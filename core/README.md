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

All endpoints (except health check and `GET /invoice/:id`) require an `x-api-key` header. The guard validates the key against stored hashes in the database.

Internal service-to-service endpoints (`PATCH /invoice/internal/:id`) use a separate internal API key validated against the `InternalApiKeyRepository`.

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
- `404` — Client not found
- `500` — Failed to process invoice

The `jobs` field is a map of job names to amounts in dollars.

### Get Invoice Status

```
GET /invoice/:id
```

- `200` — Returns `{ "id": "<key>", "status": "<status>" }` where status is `"pending"`, `"resolved"`, or `"rejected"`
- `404` — Invoice not found

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
│   ├── constants.ts         # Queue names, timeouts, retry config
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
