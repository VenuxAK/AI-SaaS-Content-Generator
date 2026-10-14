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

# Run optimizations and migrations only for the primary app service (when starting Octane)
case "$*" in
    *octane:start*)
        echo "Running production migrations..."
        php artisan migrate --force --isolated || true

        echo "Warming Laravel production caches..."
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
        php artisan event:cache
        ;;
esac

# Ensure storage directories exist with proper write permissions
mkdir -p storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         bootstrap/cache

exec "$@"
