export const MAILEROO_API_URL = 'https://smtp.maileroo.com/api/v2/emails';
export const EMAIL_QUEUE_NAME = 'email';
export const MAILEROO_TIMEOUT_MS = 20000;

export const EMAIL_QUEUE_MAX_ATTEMPTS = 5;
export const EMAIL_QUEUE_BACKOFF_DELAY_MS = 1000;
export const EMAIL_DEDUP_TTL_SECONDS = 300;

export const JOB_REMOVE_ON_COMPLETE_AGE_SECONDS = 3600;
export const JOB_REMOVE_ON_FAIL_AGE_SECONDS = 86400;

export const EMAIL_DEDUP_KEY_PREFIX = 'email-sent';
export const REDIS_DEDUP_VALUE = '1';

export const INVOICE_STATUS_EXPIRED = 'expired';
export const INVOICE_STATUS_CLOSED = 'closed';
export const INVOICE_STATUS_RESOLVED = 'resolved';
