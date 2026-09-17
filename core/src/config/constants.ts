export const DB_TYPE = 'postgres';
export const DB_RETRY_ATTEMPTS = 1;
export const DB_RETRY_DELAY_MS = 1000;
export const DB_CONNECT_TIMEOUT_MS = 10000;

export const PDF_QUEUE_NAME = 'pdf';
export const EMAIL_QUEUE_NAME = 'email';

export const JOB_TYPE_GENERATE_PDF = 'generate-pdf';
export const JOB_TYPE_SEND_EMAIL = 'send-email';

export const PDF_QUEUE_MAX_ATTEMPTS = 3;
export const PDF_QUEUE_BACKOFF_DELAY_MS = 2000;

export const EMAIL_QUEUE_MAX_ATTEMPTS = 5;
export const EMAIL_QUEUE_BACKOFF_DELAY_MS = 1000;

export const DEDUP_TTL_SECONDS = 40;
export const EMAIL_DEDUP_TTL_SECONDS = 300;

export const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

export const API_KEY_MAX_RETRIES = 5;
