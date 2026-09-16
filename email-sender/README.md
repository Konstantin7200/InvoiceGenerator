# Email Sender Service

A BullMQ worker microservice that sends invoice emails with PDF attachments. Consumes jobs from the `email` queue, downloads the PDF from **Backblaze B2** storage, and delivers emails via the [Maileroo](https://maileroo.com/) SMTP API. After sending, it calls back to the core service to update the invoice status.

## Prerequisites

- Node.js (v18+)
- Redis
- A [Maileroo](https://maileroo.com/) account with an API key

## Setup

```bash
npm install
cp .env.example .env
```

Configure the `.env` file with your Maileroo credentials and Redis connection.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | yes | HTTP port (default: `3002`) |
| `MAILEROO_API_KEY` | yes | Maileroo API key |
| `EMAIL_FROM` | yes | Sender email address (must be verified in Maileroo) |
| `REDIS_HOST` | yes | Redis host |
| `REDIS_PORT` | yes | Redis port |
| `REDIS_PASSWORD` | no | Redis password |
| `REDIS_TLS` | no | Set to `true` to enable TLS |
| `CORE_API_URL` | yes | Core service URL (for status callbacks) |
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

1. Listens for jobs on the `email` BullMQ queue
2. Validates incoming job data (invoice ID, recipient email, B2 PDF key)
3. Downloads the PDF from **Backblaze B2** using the provided key
4. Sends an email via the Maileroo API with the PDF attached as `invoice.pdf`
5. Deletes the PDF from **Backblaze B2** (no longer needed)
6. Calls back to the core service via `PATCH /invoice/internal/:id` to mark the invoice as `resolved`

### Email Content

- **Subject:** "Email with jobs invoice"
- **Body:** HTML with a message that the invoice is attached
- **Attachment:** `invoice.pdf` (PDF buffer from the PDF generator service)

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
├── app.module.ts            # Root module (ConfigModule, BullModule, EmailModule)
├── config/                  # Configuration files
│   ├── server.config.ts
│   ├── redis.config.ts
│   ├── email.config.ts
│   └── constants.ts
├── email/                   # Email processing
│   ├── email.worker.ts      # BullMQ processor
│   ├── email.service.ts     # Email sending logic
│   ├── b2.service.ts        # Backblaze B2 download/delete
│   ├── callback.service.ts  # Callback to core service
│   ├── email.module.ts
│   ├── dto/
│   └── pipes/
└── maileroo/                # Maileroo API integration
    ├── maileroo.service.ts   # Maileroo HTTP client
    └── maileroo.module.ts
```

## License

UNLICENSED
