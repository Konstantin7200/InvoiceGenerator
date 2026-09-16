# InvoiceGenerator

A microservices-based invoice generation system built with NestJS. Automatically generates styled PDF invoices and emails them to clients.

## Architecture

```
┌──────────┐     ┌───────────────┐
│          │────▶│     core      │
│  Client  │     │  (port 3000)  │
│          │     │  PostgreSQL   │
└──────────┘     └───────┬───────┘
                         │
              ┌──────────┴──────────┐
              │   Redis (BullMQ)    │
              └──┬──────────────┬───┘
                 │              │
                 ▼              ▼
     ┌───────────────┐  ┌───────────────┐
     │ pdf-generator │  │ email-sender  │
     │  (port 3001)  │  │  (port 3002)  │
     │  Puppeteer    │  │  Maileroo     │
     └───────┬───────┘  └───────┬───────┘
             │                  │
             ▼                  │
     ┌───────────────┐          │
     │ Backblaze B2  │◀─────────┘
     │  (PDF store)  │
     └───────────────┘
```

## Services

| Service | Port | Description |
|---|---|---|
| [core](./core) | 3000 | Orchestrator — manages clients, creates invoices, coordinates PDF generation and email delivery |
| [pdf-generator](./pdf-generator) | 3001 | BullMQ worker — generates styled invoice PDFs using Handlebars + Puppeteer |
| [email-sender](./email-sender) | 3002 | BullMQ worker — sends invoice emails with PDF attachments via Maileroo |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

## Quick Start

1. Clone the repository and install dependencies for each service:

```bash
cd core && npm install
cd ../pdf-generator && npm install
cd ../email-sender && npm install
```

2. Configure environment variables — copy `.env.example` to `.env` in each service directory and fill in the values.

3. Start each service (in separate terminals):

```bash
# Terminal 1 — Core (start first, it depends on the others)
cd core && npm run start:dev

# Terminal 2 — PDF Generator
cd pdf-generator && npm run start:dev

# Terminal 3 — Email Sender
cd email-sender && npm run start:dev
```

4. Create a client and generate an invoice:

```bash
# Create a client
curl -X POST http://localhost:3000/client \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "companyEmail": "billing@acme.com",
    "companyName": "Acme Corp"
  }'

# Generate and send an invoice
curl -X POST http://localhost:3000/invoice \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "email": "john@example.com",
    "jobs": {
      "Web Development": 1500.00,
      "UI Design": 800.50
    }
  }'
```

## How It Works

1. A client is registered via `POST /client` and stored in PostgreSQL
2. An invoice is requested via `POST /invoice` with a client email and job amounts — returns `{ id, status: "pending" }`
3. The **core** service looks up the client, creates an invoice record, and dispatches a PDF generation job to the `pdf` BullMQ queue via Redis
4. The **pdf-generator** service picks up the job, renders the Handlebars template to HTML, converts it to PDF with Puppeteer, uploads the PDF to **Backblaze B2**, and dispatches an email job to the `email` BullMQ queue via Redis
5. The **email-sender** service picks up the job, downloads the PDF from **Backblaze B2**, sends the invoice email with the PDF attached via Maileroo, deletes the PDF from B2, and calls back to the core service to mark the invoice as `resolved`
6. The invoice status can be queried via `GET /invoice/:id` at any time

## Authentication

All API endpoints require an `x-api-key` header. API keys are generated and stored in the database. Include the header in every request:

```
x-api-key: YOUR_API_KEY
```

## Environment Variables

Each service has its own `.env.example`. See individual READMEs for details.

| Variable | core | pdf-generator | email-sender | Description |
|---|---|---|---|---|
| `PORT` | yes | yes | yes | HTTP port |
| `REDIS_HOST` | yes | yes | yes | Redis host |
| `REDIS_PORT` | yes | yes | yes | Redis port |
| `REDIS_PASSWORD` | yes | yes | yes | Redis password |
| `REDIS_TLS` | yes | yes | yes | Enable TLS for Redis |
| `DB_HOST` | yes | | | PostgreSQL host |
| `DB_PORT` | yes | | | PostgreSQL port |
| `DB_USERNAME` | yes | | | PostgreSQL username |
| `DB_PASSWORD` | yes | | | PostgreSQL password |
| `DB_NAME` | yes | | | PostgreSQL database name |
| `DB_SSL` | yes | | | Enable SSL for PostgreSQL |
| `CORE_API_URL` | | yes | yes | Core service URL (for callbacks) |
| `INTERNAL_API_KEY` | | yes | yes | Internal API key for service-to-service auth |
| `MAILEROO_API_KEY` | | | yes | Maileroo API key |
| `EMAIL_FROM` | | | yes | Sender email address |
| `B2_ENDPOINT` | | yes | yes | Backblaze B2 S3 endpoint |
| `B2_REGION` | | yes | yes | Backblaze B2 region |
| `B2_ACCESS_KEY_ID` | | yes | yes | Backblaze B2 access key ID |
| `B2_SECRET_ACCESS_KEY` | | yes | yes | Backblaze B2 secret access key |
| `B2_BUCKET_NAME` | | yes | yes | Backblaze B2 bucket name |

## License

UNLICENSED
