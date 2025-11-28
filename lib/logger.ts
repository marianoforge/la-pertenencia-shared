type LogLevel = 'log' | 'error' | 'warn' | 'info';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (!isDevelopment) {
      if (level === 'error') {
        console.error(`[${entry.timestamp}]`, message, data || '');
      }
      return;
    }
    const consoleMethod = console[level] || console.log;
    const prefix = `[${level.toUpperCase()}]`;
    consoleMethod(prefix, message, data || '');
  }

  log(message: string, data?: unknown) {
    this.log('log', message, data);
  }

  error(message: string, error?: unknown) {
    this.log('error', message, error);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }
}

export const logger = new Logger();

