import winston from 'winston';
import { env } from './env';

const { combine, colorize, errors, json, printf, timestamp } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, requestId, stack, ...meta }) => {
    const base = `${ts} [${level}]${requestId ? ` [${String(requestId)}]` : ''} ${message}`;
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return stack ? `${base}\n${stack}${extra}` : `${base}${extra}`;
  }),
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  defaultMeta: { service: 'restaurant-automation-backend' },
  format: env.isProduction
    ? combine(timestamp(), errors({ stack: true }), json())
    : devFormat,
  transports: [new winston.transports.Console()],
});
