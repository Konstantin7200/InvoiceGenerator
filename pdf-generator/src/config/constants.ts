export const PDF_QUEUE_NAME = 'pdf';
export const EMAIL_QUEUE_NAME = 'email';

export const PDF_QUEUE_MAX_ATTEMPTS = 3;
export const PDF_QUEUE_BACKOFF_DELAY_MS = 2000;

export const JOB_REMOVE_ON_COMPLETE_AGE_SECONDS = 3600;
export const JOB_REMOVE_ON_FAIL_AGE_SECONDS = 86400;

export const JOB_TYPE_SEND_EMAIL = 'send-email';
export const PDF_B2_KEY_PREFIX = 'invoices';

export const INVOICE_STATUS_EXPIRED = 'expired';
export const INVOICE_STATUS_CLOSED = 'closed';
export const INVOICE_STATUS_RESOLVED = 'resolved';
