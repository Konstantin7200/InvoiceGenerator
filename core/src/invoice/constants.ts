export const PDF_QUEUE_NAME = 'pdf';
export const EMAIL_QUEUE_NAME = 'email';

export const JOB_TYPE_GENERATE_PDF = 'generate-pdf';
export const JOB_TYPE_SEND_EMAIL = 'send-email';

export const PDF_JOB_COMPLETION_TIMEOUT_MS = 30_000;
export const EMAIL_JOB_COMPLETION_TIMEOUT_MS = 10_000;

export const PDF_QUEUE_MAX_ATTEMPTS = 3;
export const PDF_QUEUE_BACKOFF_DELAY_MS = 2000;

export const EMAIL_QUEUE_MAX_ATTEMPTS = 5;
export const EMAIL_QUEUE_BACKOFF_DELAY_MS = 1000;

export const BACKOFF_TYPE = 'exponential';
