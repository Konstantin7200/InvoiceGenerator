# PDF Generator Service

A BullMQ worker microservice that generates styled invoice PDFs. Consumes jobs from the `pdf` queue, renders invoice data using Handlebars templates, converts the HTML to PDF with Puppeteer, and uploads the result to **Backblaze B2** storage.

## Prerequisites

- Node.js (v18+)
- Redis

## Setup

```bash
npm install
cp .env.example .env
```

Configure the `.env` file with your Redis connection details.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | yes | HTTP port (default: `3001`) |
| `REDIS_HOST` | yes | Redis host |
| `REDIS_PORT` | yes | Redis port |
| `REDIS_PASSWORD` | no | Redis password |
| `REDIS_TLS` | no | Set to `true` to enable TLS |
| `CORE_API_URL` | yes | Core service URL (for callbacks) |
| `INTERNAL_API_KEY` | yes | Internal API key for service-to-service auth |
| `B2_ENDPOINT` | yes | Backblaze B2 S3 endpoint |
| `B2_REGION` | yes | Backblaze B2 region |
| `B2_ACCESS_KEY_ID` | yes | Backblaze B2 access key ID |
| `B2_SECRET_ACCESS_KEY` | yes | Backblaze B2 secret access key |
| `B2_BUCKET_NAME` | yes | Backblaze B2 bucket name |

## Run

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## How It Works

1. Listens for jobs on the `pdf` BullMQ queue
2. Checks invoice status via `GET /invoice/internal/:id` — skips if `expired` or `closed`
3. Validates incoming job data (email, name, company, jobs map)
4. Converts the rendered HTML to PDF using Puppeteer
5. Uploads the PDF to **Backblaze B2** at key `invoices/{invoiceId}.pdf`
6. Dispatches a `send-email` job to the `email` BullMQ queue with the invoice ID, recipient email, and B2 PDF key
7. On success: does not update status (email worker handles that)
8. On final failure (all retries exhausted): calls back to the core service via `PATCH /invoice/internal/:id` to mark the invoice as `closed`

### Invoice Template

The template is defined as an inline Handlebars string in `src/htmlGenerator/templates.ts` and renders:
- Invoice header with date
- Bill-to section with client name, email, company
- Job breakdown table with amounts
- Total amount
- Footer

## API Endpoints

This service is primarily a BullMQ worker. It also exposes a health check:

```
GET /
```

Returns `Hello World!` when the service is running.

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
├── app.module.ts            # Root module (ConfigModule, BullModule, PdfModule)
├── app.controller.ts        # Health check
├── app.service.ts
├── config/                  # Configuration files
│   ├── server.config.ts
│   ├── redis.config.ts
│   └── constants.ts
├── pdf/                     # PDF generation
│   ├── pdf.worker.ts        # BullMQ processor
│   ├── pdf.service.ts       # PDF creation logic (Puppeteer)
│   ├── b2.service.ts        # Backblaze B2 upload
│   ├── callback.service.ts  # Callback to core service
│   ├── pdf.module.ts
│   ├── dto/
│   │   └── pdfDto.ts
│   └── pipes/
│       └── bullmq-validation.pipe.ts
├── htmlGenerator/           # HTML rendering
│   ├── htmlGenerator.ts     # Handlebars template compiler
│   ├── htmlGenerator.module.ts
│   └── templates.ts         # Inline Handlebars invoice template
```

## License

UNLICENSED
