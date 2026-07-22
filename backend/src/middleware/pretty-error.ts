import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

const isDev = env.appEnv === 'development';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
};

function formatStackLine(line: string): string {
  const match = line.match(/\s+at\s(.+?)\s\((.+):(\d+):(\d+)\)/);
  if (match) {
    const [, fn, file, lineNum, col] = match;
    const shortFile = file.replace(process.cwd() + '/', '');
    return `  ${COLORS.cyan}at${COLORS.reset} ${COLORS.white}${fn}${COLORS.reset} (${COLORS.yellow}${shortFile}:${lineNum}:${col}${COLORS.reset})`;
  }
  return `  ${COLORS.gray}${line.trim()}${COLORS.reset}`;
}

export function prettyError(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (!isDev) {
    return next(err);
  }

  const error = err instanceof Error ? err : new Error(String(err));
  const lines = [
    '',
    `${COLORS.bgRed}${COLORS.white} ERROR ${COLORS.reset} ${COLORS.red}${error.name}: ${error.message}${COLORS.reset}`,
    `${COLORS.gray}  Request: ${req.method} ${req.originalUrl}${COLORS.reset}`,
    `${COLORS.gray}  RequestId: ${req.requestId}${COLORS.reset}`,
    '',
  ];

  if (error.stack) {
    const stackLines = error.stack.split('\n');
    for (let i = 1; i < stackLines.length && i < 12; i++) {
      lines.push(formatStackLine(stackLines[i]));
    }
    if (stackLines.length > 12) {
      lines.push(`  ${COLORS.gray}... (${stackLines.length - 12} more lines)${COLORS.reset}`);
    }
  }

  lines.push('');
  process.stderr.write(lines.join('\n'));

  next(err);
}
