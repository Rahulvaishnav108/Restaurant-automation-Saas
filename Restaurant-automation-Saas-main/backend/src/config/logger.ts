// src/config/logger.ts
// Winston structured logging — never log passwords, tokens, API keys, or raw PII

import winston from 'winston';

// Determine log level from env (import env after dotenv is loaded)
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Sensitive field patterns to redact from logs
const SENSITIVE_KEYS = /password|secret|token|authorization|cookie|apikey|api_key|jwt|refresh/i;

/**
 * Recursively redact sensitive fields from log metadata
 */
function redactSensitive(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(redactSensitive);
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.test(key)) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitive(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

// Custom format that redacts sensitive data
const redactFormat = winston.format((info) => {
  // Redact any metadata objects
  if (info.metadata && typeof info.metadata === 'object') {
    info.metadata = redactSensitive(info.metadata);
  }
  return info;
});

// Console format for development — colorized and readable
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize(),
  redactFormat(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

// JSON format for production — structured for log aggregation
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  redactFormat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: NODE_ENV === 'production' ? prodFormat : devFormat,
  defaultMeta: { service: 'restaurant-automation' },
  transports: [
    new winston.transports.Console(),
  ],
});

// Add file transports in production
if (NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5_242_880, // 5MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5_242_880, // 5MB
      maxFiles: 5,
    })
  );
}

export default logger;
