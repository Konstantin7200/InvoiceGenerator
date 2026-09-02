const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'PORT',
] as const;

export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (process.env[key] === undefined || process.env[key] === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        `Please check your .env file.`,
    );
  }

  const dbPort = parseInt(process.env.DB_PORT!, 10);
  if (isNaN(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error(
      `Invalid DB_PORT value: "${process.env.DB_PORT}". Must be a valid port number (1-65535).`,
    );
  }

  const port = parseInt(process.env.PORT!, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid PORT value: "${process.env.PORT}". Must be a valid port number (1-65535).`,
    );
  }
}
