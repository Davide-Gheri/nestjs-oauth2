import { Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { DEFAULT_REDIS_CONNECTION } from './constants';

const logger = new Logger('RedisModule');

export function getConnectionToken(name?: string): string {
  return name && name !== DEFAULT_REDIS_CONNECTION
    ? `${name}Connection`
    : DEFAULT_REDIS_CONNECTION;
}

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  return <T>(source: Observable<T>) => source.pipe(
    retryWhen(e => e.pipe(
      scan((errorCount, error) => {
        logger.error(
          `Unable to connect to the Redis database. Retrying (${errorCount + 1})...`,
          error.stack,
          'RedisModule',
        );
        if (errorCount + 1 >= retryAttempts) {
          throw error;
        }
        return errorCount + 1;
      }, 0),
      delay(retryDelay),
    )),
  );
}
