import winston from 'winston';
import path from 'path';

/**
 * Logger Utility - Centralized logging for the framework
 * Supports multiple log levels and output formats
 */
export class Logger {
  private static loggerInstance: winston.Logger;
  private static classInstance: Logger;

  private constructor() {}

  private static createLogger(): winston.Logger {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.prettyPrint()
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    );

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
        new winston.transports.File({
          filename: path.join('logs', `app-${new Date().toISOString().split('T')[0]}.log`),
        }),
      ],
    });
  }

  static getInstance(): Logger {
    if (!Logger.classInstance) {
      Logger.loggerInstance = Logger.createLogger();
      Logger.classInstance = new Logger();
    }
    return Logger.classInstance;
  }

  // Instance methods
  info(message: string, meta?: any): void {
    Logger.loggerInstance.info(message, meta);
  }

  error(message: string, meta?: any): void {
    Logger.loggerInstance.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    Logger.loggerInstance.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    Logger.loggerInstance.debug(message, meta);
  }

  // Static methods
  static info(message: string, meta?: any): void {
    Logger.getInstance().info(message, meta);
  }

  static error(message: string, meta?: any): void {
    Logger.getInstance().error(message, meta);
  }

  static warn(message: string, meta?: any): void {
    Logger.getInstance().warn(message, meta);
  }

  static debug(message: string, meta?: any): void {
    Logger.getInstance().debug(message, meta);
  }
}
