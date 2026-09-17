# Core Service

The orchestrator microservice for InvoiceGenerator. Manages clients in PostgreSQL and coordinates invoice creation by dispatching PDF generation and email sending jobs via BullMQ.

## Prerequisites

- Node.js (v18+)
- PostgreSQL
- Redis
- [pdf-generator](../pdf-generator) service running
- [email-sender](../email-sender) service running

## Setup

```bash
npm install
cp .env.example .env
```

Configure the `.env` file with your database, Redis, and service URLs.

Run the database migration for the `createdAt` column:

```sql
ALTER TABLE invoice_entity ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | yes | HTTP port (default: `3000`) |
| `DB_HOST` | yes | PostgreSQL host |
| `DB_PORT` | yes | PostgreSQL port |
| `DB_USERNAME` | yes | PostgreSQL username |
| `DB_PASSWORD` | yes | PostgreSQL password |
| `DB_NAME` | yes | PostgreSQL database name |
| `DB_SSL` | yes | Enable SSL for PostgreSQL (`true`/`false`) |
| `REDIS_HOST` | yes | Redis host |
| `REDIS_PORT` | yes | Redis port |
| `REDIS_PASSWORD` | no | Redis password |
| `REDIS_TLS` | no | Set to `true` to enable TLS |

## Run

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Authentication

All endpoints (except health check, `GET /invoice/:id`, and internal endpoints) require an `x-api-key` header. The guard validates the key against stored hashes in the database.

Internal service-to-service endpoints (`/invoice/internal/*` and `/invoice/cron/*`) use a separate internal API key validated against the `InternalApiKeyRepository`.

## Invoice Statuses

| Status | Description |
|---|---|
| `pending` | Invoice created, awaiting processing |
| `resolved` | Email successfully sent to the client |
| `expired` | Invoice was not processed within 24 hours (set by cron) |
| `closed` | All retry attempts exhausted, processing permanently stopped |

## API Endpoints

### Health Check

```
GET /
```

Returns `Hello World!` when the service is running.

### Create Client

```
POST /client
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "companyEmail": "billing@acme.com",
  "companyName": "Acme Corp"
}
```

- `201` — Client created
- `409` — Client with this email already exists

### Create Invoice

```
POST /invoice
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

```json
{
  "email": "john@example.com",
  "jobs": {
    "Web Development": 1500.00,
    "UI Design": 800.50
  }
}
```

- `200` — Invoice created, returns `{ "id": "<key>", "status": "pending" }`
- `200` — Duplicate detected, returns `{ "id": "<key>", "status": "pending", "duplicate": true }`
- `404` — Client not found
- `500` — Failed to process invoice

The `jobs` field is a map of job names to amounts in dollars. Duplicate requests within 40 seconds return the existing invoice.

### Get Invoice Status

```
GET /invoice/:id
```

- `200` — Returns `{ "id": "<key>", "status": "<status>" }` where status is `"pending"`, `"resolved"`, `"expired"`, or `"closed"`
- `404` — Invoice not found

### Get Invoice Status by Numeric ID (Internal)

```
GET /invoice/internal/:id
x-api-key: INTERNAL_API_KEY
```

- `200` — Returns `{ "status": "<status>" }`
- `401` — Invalid internal API key
- `404` — Invoice not found

Internal endpoint used by workers to check invoice status before processing.

### Update Invoice Status (Internal)

```
PATCH /invoice/internal/:id
Content-Type: application/json
x-api-key: INTERNAL_API_KEY
```

```json
{
  "status": "resolved"
}
```

Internal endpoint used by the pdf-generator and email-sender services to report status back to the core. Protected by a separate internal API key.

- `200` — Status updated
- `401` — Invalid internal API key

### Expire Stale Invoices (Cron)

```
PATCH /invoice/cron/expire-stale
x-api-key: INTERNAL_API_KEY
```

- `200` — Returns `{ "expired": <count> }` where count is the number of invoices expired
- `401` — Invalid internal API key

Marks all invoices with status `pending` that are older than 24 hours as `expired`. Call this from an external cron service.

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Project Structure

```
src/
├── main.ts                  # Application bootstrap
├── app.module.ts            # Root module (ConfigModule, BullModule, feature modules)
├── app.controller.ts        # Health check
├── app.service.ts
├── auth/                    # API key authentication
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts        # x-api-key header guard
│   ├── internal-auth.guard.ts # Internal service-to-service guard
│   └── hashFunction.ts
├── config/                  # Configuration files
│   ├── server.config.ts
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── constants.ts         # Queue names, timeouts, retry config, dedup TTLs
│   ├── client.seed.json
│   └── client.seed.example.json
├── client/                  # Client management
│   ├── client.controller.ts
│   ├── client.service.ts
│   ├── client.module.ts
│   └── dto/
│       └── client.dto.ts
├── invoice/                 # Invoice orchestration
│   ├── invoice.controller.ts
│   ├── invoice.service.ts
│   ├── invoice.module.ts
│   └── dto/
│       └── createInvoice.dto.ts
└── db/                      # Database layer
    ├── db.module.ts
    ├── clientRepository.ts
    ├── invoiceRepository.ts
    ├── apiKeyRepository.ts
    ├── internalApiKeyRepository.ts
    ├── clientSeed.service.ts
    ├── entities/
    │   ├── clientEntity.ts
    │   ├── invoiceEntity.ts
    │   ├── apiKeyEntity.ts
    │   └── internalApiKeyEntity.ts
    └── types/
        ├── client.ts
        └── invoiceStatus.ts
```

## License

UNLICENSED
