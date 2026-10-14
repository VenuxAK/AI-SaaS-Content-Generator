#!/bin/sh
set -e

# Wait for Database connection if DB_HOST, DB_URL, or DATABASE_URL is set
if [ -n "$DB_HOST" ] || [ -n "$DB_URL" ] || [ -n "$DATABASE_URL" ]; then
    echo "Waiting for database connection..."
    max_retries=30
    retry_count=0

    until php -r "
        require 'vendor/autoload.php';
        \$app = require 'bootstrap/app.php';
        \$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
        try {
            Illuminate\Support\Facades\DB::connection()->getPdo();
            exit(0);
        } catch (Throwable \$e) {
            exit(1);
        }
    " > /dev/null 2>&1; do
        retry_count=$((retry_count + 1))
        if [ $retry_count -ge $max_retries ]; then
            echo "ERROR: Database connection timeout after $max_retries attempts."
            exit 1
        fi
        sleep 2
    done
    echo "Database is ready."
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
