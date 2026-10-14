#!/bin/sh
set -e

# Wait for Database connection if DB_HOST, DB_URL, or DATABASE_URL is set
if [ -n "$DB_HOST" ] || [ -n "$DB_URL" ] || [ -n "$DATABASE_URL" ]; then
    echo "Checking database connection to ${DB_HOST:-database}:${DB_PORT:-3306}..."
    max_retries=15
    retry_count=0
    error_output=""

    while [ $retry_count -lt $max_retries ]; do
        error_output=$(php -r "
            require 'vendor/autoload.php';
            \$app = require 'bootstrap/app.php';
            \$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
            try {
                Illuminate\Support\Facades\DB::connection()->getPdo();
                exit(0);
            } catch (Throwable \$e) {
                fwrite(STDERR, \$e->getMessage());
                exit(1);
            }
        " 2>&1)
        if [ $? -eq 0 ]; then
            echo "Database connection established successfully!"
            break
        fi

        retry_count=$((retry_count + 1))
        echo "Database connection attempt $retry_count/$max_retries failed: $error_output"

        if [ $retry_count -ge $max_retries ]; then
            echo "ERROR: Could not connect to database after $max_retries attempts."
            echo "Last error: $error_output"
            exit 1
        fi
        sleep 2
    done
fi

# Ensure storage and cache directories exist with proper write permissions early
mkdir -p storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         bootstrap/cache
chmod -R 777 storage bootstrap/cache

# Guarantee APP_KEY exists so web requests (sessions, cookies, encryption) never fail with 500
if [ -z "$APP_KEY" ]; then
    echo "================================================================="
    echo "WARNING: APP_KEY is not set in Render environment!"
    export APP_KEY=$(php artisan key:generate --show)
    echo "Generated fallback key: $APP_KEY"
    echo "Please set this APP_KEY in your Render dashboard under Environment."
    echo "================================================================="
fi

# If REDIS_HOST is set to 'redis' but cannot be resolved, fall back to database
if [ "$REDIS_HOST" = "redis" ] && ! getent hosts redis > /dev/null 2>&1; then
    echo "Notice: Redis host 'redis' not reachable. Forcing CACHE_STORE=database and SESSION_DRIVER=database."
    export CACHE_STORE=database
    export SESSION_DRIVER=database
fi

# Run optimizations and migrations only for the primary app service (when starting Octane)
case "$*" in
    *octane:start*)
        echo "Running production migrations..."
        php artisan migrate --force || true

        echo "Warming Laravel production caches..."
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
        php artisan event:cache
        ;;
esac

exec "$@"
