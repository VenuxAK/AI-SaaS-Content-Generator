# Production Deployment Guide: Render + TiDB Cloud Serverless (MySQL)

This guide provides step-by-step instructions for deploying the **AI SaaS Content Generator** to production using **Render** (Web Service with Docker + Laravel Octane FrankenPHP) and **TiDB Cloud** (Free Serverless MySQL).

---

## Architecture Overview

```
                            [ User Browser / Mobile ]
                                       │
                                       ▼ (HTTPS)
                            ┌─────────────────────┐
                            │    Render Edge      │ (Reverse Proxy & SSL Termination)
                            └──────────┬──────────┘
                                       │ (Forwarded Header: X-Forwarded-Proto, X-Forwarded-For)
                                       ▼ (Dynamic $PORT)
 ┌────────────────────────────────────────────────────────────────────────┐
 │ Render Web Service Container (Alpine Linux)                           │
 │                                                                        │
 │  ┌──────────────────────────────────────────────────────────────────┐  │
 │  │ FrankenPHP + Laravel Octane Worker Pool                          │  │
 │  │                                                                  │  │
 │  │  • Multi-worker long-running PHP 8.4 runtime                     │  │
 │  │  • Built-in asset serving (public/build, Inertia + React + CSS)  │  │
 │  │  • Dynamic port binding: ${PORT:-8000}                           │  │
 │  │  • Trusted reverse proxy support ($middleware->trustProxies)     │  │
 │  └──────────────────────────────────┬───────────────────────────────┘  │
 └─────────────────────────────────────┼──────────────────────────────────┘
                                       │
                                       │ TLS Encrypted Connection
                                       │ (ca-certificates.crt verified)
                                       ▼
                       ┌───────────────────────────────┐
                       │  TiDB Cloud Serverless        │
                       │  MySQL 8.0 Compatible         │
                       │                               │
                       │  • 5 GB Storage (Permanent)   │
                       │  • 50M Request Units / Month  │
                       │  • Database Sessions & Cache  │
                       └───────────────────────────────┘
```

### Why this stack?
1. **Zero Recurring Infrastructure Cost**:
   - **Render Free Tier**: 750 free compute hours/month for Web Services.
   - **TiDB Cloud Serverless**: 5 GB persistent MySQL-compatible storage free forever (no 30-day auto-wipe like Render's free PostgreSQL).
2. **Exceptional Performance with Laravel Octane**:
   - FrankenPHP keeps the Laravel application bootstrapped in memory.
   - Eliminates PHP-FPM bootstrap overhead per request, resulting in sub-millisecond to low double-digit latency.
3. **Stateless Container Architecture**:
   - Session storage (`SESSION_DRIVER=database`) and cache (`CACHE_STORE=database`) reside in TiDB Cloud.
   - When Render puts the free container to sleep after 15 minutes of inactivity, no user sessions or application data are lost.

---

## Prerequisites

Before starting, ensure you have:
- [x] A **GitHub account** with access to this repository.
- [x] A **Render account** at [render.com](https://render.com/).
- [x] A **TiDB Cloud account** at [tidbcloud.com](https://tidbcloud.com/).
- [x] Your AI service credentials (e.g. `GEMINI_API_KEY` or `OPENAI_API_KEY`).

---

## Phase 1: Create Your TiDB Cloud Serverless Database

TiDB Cloud Serverless provides a production-grade, MySQL-compatible relational database that automatically scales and enforces TLS encryption.

### 1.1 Create Cluster
1. Log in to the [TiDB Cloud Console](https://tidbcloud.com/).
2. Click **Create Cluster**.
3. Select **Serverless** (Free Tier).
4. Choose the Cloud Provider and Region:
   - **Provider**: AWS or GCP.
   - **Region**: Choose a region closest to your Render service region (e.g., `us-east-1` for US Oregon/Virginia, or `eu-central-1` for Frankfurt) to minimize latency.
5. Set your **Cluster Name** (e.g., `ai-saas-db`).
6. Click **Create**.

### 1.2 Configure Root Password & Network Security
1. In the cluster creation modal or cluster overview, note down or reset the **Root Password**.
2. Under **Security** / **IP Access List**:
   - By default, Serverless clusters allow connections from all IPs (`0.0.0.0/0`) authenticated via username, password, and SSL.
   - Ensure the IP access list permits connections so Render's dynamic IP range can reach the database.

### 1.3 Obtain Your Connection String
1. In the TiDB Cloud dashboard, click **Connect** (top right).
2. Under **Connection Type**, select **General** or **MySQL CLI**.
3. Copy the URL-formatted connection string. It will look like this:
   ```text
   mysql://<username>:<password>@gateway01.<region>.prod.aws.tidbcloud.com:4000/<database_name>?ssl-mode=REQUIRED
   ```
   *(Note: By default, the database name is `test` or you can create `saas_content_generator`).*

---

## Phase 2: Deploy to Render

You can deploy using either the automated **Render Blueprint** (recommended) or manual **Web Service creation**.

### Option A: 1-Click Blueprint Deployment (Recommended)

The repository includes a ready-to-use [`render.yaml`](../render.yaml) specification file.

1. Push your repository to GitHub:
   ```bash
   git push origin master
   ```
2. Log in to [dashboard.render.com](https://dashboard.render.com/).
3. Click **New +** in the top navigation bar and select **Blueprint**.
4. Connect your GitHub account and select the **AI SaaS Content Generator** repository.
5. Render will detect the `render.yaml` file and present the configuration prompt:
   - **`DB_URL`**: Paste your TiDB Cloud connection string from Phase 1.3.
   - **`APP_URL`**: Enter the public URL Render assigns to your service (e.g. `https://ai-saas-content-generator.onrender.com`) or your custom domain.
6. Click **Apply**.
7. Render will automatically build the Docker image, configure the environment, run database migrations, and start the service.

---

### Option B: Manual Web Service Creation

If you prefer to configure the service manually via the Render UI:

1. In the Render Dashboard, click **New +** $\rightarrow$ **Web Service**.
2. Select **Build and deploy from a Git repository** and pick this repo.
3. Configure the following service settings:
   - **Name**: `ai-saas-content-generator`
   - **Region**: Closest to your TiDB Cloud cluster region (e.g., `Oregon (US West)` or `Frankfurt (EU Central)`).
   - **Branch**: `master` (or your production branch)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`
   - **Instance Type**: `Free`
4. Expand **Advanced Settings**:
   - **Health Check Path**: `/up`
   - **Auto Deploy**: `Yes`
5. Add the **Environment Variables** listed in the table below.
6. Click **Create Web Service**.

---

## Phase 3: Environment Variables Reference

Configure these variables in your Render service dashboard under **Environment**:

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `APP_NAME` | `AI SaaS Content Generator` | Public application name displayed in the UI. |
| `APP_ENV` | `production` | Enables production error handling and performance optimizations. |
| `APP_DEBUG` | `false` | Disables verbose debug stack traces in the UI. |
| `APP_KEY` | *(Auto-generated or run `php artisan key:generate --show`)* | 32-character encryption key for cookies and tokens. |
| `APP_URL` | `https://your-app-name.onrender.com` | Root URL used for link generation and Wayfinder route resolution. |
| `DB_CONNECTION` | `mysql` | Uses Laravel's MySQL PDO driver. |
| `DB_URL` | `mysql://user:pass@host:4000/dbname?ssl-mode=REQUIRED` | Complete TiDB Cloud connection string. |
| `OCTANE_SERVER` | `frankenphp` | Activates the FrankenPHP worker engine. |
| `OCTANE_MAX_REQUESTS` | `1000` | Workers gracefully cycle after 1,000 requests to avoid memory creep. |
| `OCTANE_HTTPS` | `true` | Informs Octane that client communication is HTTPS through the proxy. |
| `SESSION_DRIVER` | `database` | Stores session records in TiDB Cloud (`sessions` table). |
| `CACHE_STORE` | `database` | Stores cache entries in TiDB Cloud (`cache` table). |
| `QUEUE_CONNECTION` | `sync` | Executes jobs synchronously (ideal for single-container free tier). |
| `LOG_CHANNEL` | `stderr` | Streams application logs directly to Render's live log viewer. |
| `GEMINI_API_KEY` | `AIzaSy...` | *(Optional)* Google Gemini API key for AI generation. |
| `OPENAI_API_KEY` | `sk-...` | *(Optional)* OpenAI API key for alternative LLM providers. |
| `STRIPE_KEY` | `pk_live_...` | *(Optional)* Stripe Publishable Key for subscriptions. |
| `STRIPE_SECRET` | `sk_live_...` | *(Optional)* Stripe Secret Key. |

> [!TIP]
> If you prefer individual database credentials over `DB_URL`, you can omit `DB_URL` and configure:
> - `DB_HOST`: `<gateway01.region.prod.aws.tidbcloud.com>`
> - `DB_PORT`: `4000`
> - `DB_DATABASE`: `<database_name>`
> - `DB_USERNAME`: `<username>`
> - `DB_PASSWORD`: `<password>`

---

## Phase 4: Automated Container Lifecycle

When Render starts or redeploys the container, [`docker/entrypoint.sh`](../docker/entrypoint.sh) executes the following sequence:

1. **Database Readiness Probe**:
   - The container attempts a test PDO handshake against TiDB Cloud with retry intervals.
   - Prevents startup crashes if the network or database takes a moment to respond.
2. **Automated Migrations**:
   - Executes `php artisan migrate --force --isolated`.
   - Safely creates all tables (users, subscriptions, generations, sessions, cache, etc.) on first boot and applies future schema changes automatically on each deployment.
3. **Laravel Cache Warming**:
   - Compiles route mappings: `php artisan route:cache`
   - Compiles configuration: `php artisan config:cache`
   - Compiles Blade/Inertia templates: `php artisan view:cache`
   - Compiles events: `php artisan event:cache`
4. **Port Binding & Worker Launch**:
   - FrankenPHP reads Render's dynamic `$PORT` environment variable:
     ```bash
     php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=${PORT:-8000} --workers=auto
     ```
   - Automatically utilizes CPU cores for concurrent request processing.
5. **Reverse Proxy Trust**:
   - The application has `$middleware->trustProxies(at: '*')` enabled in `bootstrap/app.php`, guaranteeing that HTTPS detection and client IP extraction work seamlessly through Render's TLS termination proxy.

---

## Phase 5: Verification & Post-Deployment Checklist

After the initial deploy finishes in Render:

1. **Verify Live Health Check**:
   - Visit `https://your-service.onrender.com/up`.
   - You should receive an immediate HTTP 200 response with a clean heartbeat.
2. **Verify User Registration & Login**:
   - Navigate to `https://your-service.onrender.com/register`.
   - Register a new account.
   - Verify that you are redirected to the dashboard.
3. **Inspect the Database Tables**:
   - Open your TiDB Cloud Console $\rightarrow$ **Chat2Query** or **SQL Editor**.
   - Run:
     ```sql
     SHOW TABLES;
     SELECT id, name, email, created_at FROM users;
     ```
   - Confirm that the `users`, `sessions`, and `migrations` tables are populated.
4. **Test AI Content Generation**:
   - On your live app, select an AI template (e.g., Blog Post or Social Caption) and click **Generate**.
   - Ensure the output streams or returns successfully.

---

## Phase 6: Understanding Render Free Tier Behavior

Because this deployment runs on Render's Free tier:

- **Inactivity Spin-Down**:
  - The service spins down (sleeps) if it receives no web traffic for 15 consecutive minutes.
  - The next incoming request will experience a "cold start" (typically 30–50 seconds) while Render restarts the container.
- **Persistent Data**:
  - Because all application data, users, and sessions reside in **TiDB Cloud Serverless**, no data is lost during container sleep cycles or redeployments.
- **Preventing Sleep (Optional)**:
  - If you and your friends want the site to remain awake during the day, you can use a free uptime monitoring service like [UptimeRobot](https://uptimerobot.com/) or [BetterStack](https://betterstack.com/) to ping `https://your-service.onrender.com/up` every 10 minutes.

---

## Phase 7: Troubleshooting

### 1. Database Connection Refused or Timeout
- **Symptom**: Logs show `ERROR: Database connection timeout after 30 attempts`.
- **Solution**:
  - Check that your TiDB Cloud IP Access List allows `0.0.0.0/0`.
  - Verify that the connection string includes `?ssl-mode=REQUIRED`.
  - Ensure the database user password has not expired or been reset.

### 2. HTTPS Redirect Loops
- **Symptom**: Browser reports `ERR_TOO_MANY_REDIRECTS`.
- **Solution**:
  - Ensure `APP_URL` in Render begins with `https://`.
  - Ensure `OCTANE_HTTPS=true` is set.
  - Confirm `bootstrap/app.php` has `$middleware->trustProxies(at: '*')`.

### 3. Missing Vite Manifest / Blank White Page
- **Symptom**: Error `Unable to locate file in Vite manifest: resources/js/app.tsx`.
- **Solution**:
  - The multi-stage [`Dockerfile`](../Dockerfile) compiles frontend assets during Stage 1 (`npm run build`) and copies `public/build` into Stage 2.
  - Trigger a manual **Clear build cache & deploy** in the Render Dashboard.

### 4. Running Custom Artisan Commands
To run one-off artisan tasks (e.g. database seeders or clearing caches):
1. In the Render Dashboard, navigate to your Web Service.
2. Click the **Shell** tab on the left sidebar.
3. Run any artisan command directly:
   ```bash
   php artisan tinker
   php artisan db:seed
   php artisan route:list
   ```
