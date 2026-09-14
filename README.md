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
     └───────────────┘  └───────────────┘
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
2. An invoice is requested via `POST /invoice` with a client email and job amounts
3. The **core** service looks up the client, creates an invoice record, and dispatches a PDF generation job to the `pdf` BullMQ queue via Redis
4. The **pdf-generator** service picks up the job, renders the Handlebars template to HTML, converts it to PDF with Puppeteer, and returns the buffer via the queue
5. The **core** service receives the PDF, then dispatches an email job to the `email` BullMQ queue via Redis with the PDF buffer
6. The **email-sender** service picks up the job and sends the invoice email with the PDF attached via Maileroo

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
| `MAILEROO_API_KEY` | | | yes | Maileroo API key |
| `EMAIL_FROM` | | | yes | Sender email address |

## License

UNLICENSED
