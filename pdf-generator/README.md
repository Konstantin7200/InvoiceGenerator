# PDF Generator Service

A BullMQ worker microservice that generates styled invoice PDFs. Consumes jobs from the `pdf` queue, renders invoice data using Handlebars templates, and converts the HTML to PDF with Puppeteer.

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
2. Validates incoming job data (email, name, company, jobs map)
3. Renders the Handlebars template (`templates/invoice.hbs`) with client and job data
4. Converts the rendered HTML to PDF using Puppeteer
5. Returns the PDF buffer back to the calling service

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
