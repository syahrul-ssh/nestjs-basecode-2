import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { map } from 'rxjs';

@Injectable()
export class PaginatedResponseInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ) {
    return next.handle().pipe(
      map((result) => ({
        success: true,
        meta: result.meta,
        data: result.data,
      })),
    );
  }
}