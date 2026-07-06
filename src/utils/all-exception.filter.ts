import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter
  implements ExceptionFilter
{
  private readonly logger =
    new Logger(
      GlobalExceptionFilter.name,
    );

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): void {
    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    const request =
      ctx.getRequest<Request>();

    let status =
      HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      'Internal server error';

    let errors: any = null;

    if (
      exception instanceof HttpException
    ) {
      status =
        exception.getStatus();

      const exceptionResponse =
        exception.getResponse();

      if (
        typeof exceptionResponse ===
        'string'
      ) {
        message =
          exceptionResponse;
      } else {
        const error =
          exceptionResponse as Record<
            string,
            any
          >;

        message =
          error.message ??
          exception.message;

        errors =
          error.errors ?? null;
      }
    }

    if (
      exception instanceof Error
    ) {
      this.logger.error(
        exception.message,
        exception.stack,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp:
        new Date().toISOString(),
      path: request.originalUrl,
    });
  }
}