# ==============================================================================
# Stage 1: Build Frontend Assets (Inertia React + Tailwind CSS)
# ==============================================================================
FROM node:22-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Production PHP Runtime with FrankenPHP & Octane
# ==============================================================================
FROM dunglas/frankenphp:php8.4-alpine AS production

# Install system packages (ca-certificates for TiDB Cloud TLS verification)
RUN apk add --no-cache ca-certificates

# Install essential production PHP extensions using FrankenPHP helper
RUN install-php-extensions \
    pdo_mysql \
    pdo_sqlite \
    redis \
    pcntl \
    opcache \
    intl \
    zip \
    bcmath

# Copy Composer binary from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy custom production PHP configurations
COPY docker/php.ini $PHP_INI_DIR/conf.d/99-custom.ini
COPY docker/opcache.ini $PHP_INI_DIR/conf.d/99-opcache.ini

WORKDIR /app

# Install production dependencies first (optimized Docker layer caching)
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# Copy full application source code
COPY . .

# Copy compiled frontend assets from frontend stage
COPY --from=frontend /app/public/build ./public/build

# Complete composer autoload generation
RUN composer dump-autoload --optimize --no-dev

# Ensure storage and bootstrap cache permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Setup entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]

# Expose HTTP port (Render uses $PORT, defaults to 8000 for standard Docker)
EXPOSE 8000 10000

# Default command: Start Octane with FrankenPHP, dynamically binding to Render's $PORT or 8000
CMD ["sh", "-c", "php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=${PORT:-8000} --workers=auto"]
