import {
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

export function validationExceptionFactory(
  errors: ValidationError[],
) {
  const formattedErrors = {};

  for (const error of errors) {
    formattedErrors[
      error.property
    ] = Object.values(
      error.constraints ?? {},
    );
  }

  return new BadRequestException({
    message:
      'Bad request exception',
    errors:
      formattedErrors,
  });
}