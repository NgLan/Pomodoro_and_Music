import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../dto/api-error-response.dto.js';

export function ApiErrorResponses(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'The request is invalid.',
      type: ApiErrorResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'The requested resource was not found.',
      type: ApiErrorResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'An unexpected server error occurred.',
      type: ApiErrorResponseDto,
    }),
  );
}
