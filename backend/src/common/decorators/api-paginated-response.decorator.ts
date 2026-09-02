import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto.js';

export function ApiPaginatedResponse<TModel extends Type<unknown>>(
  model: TModel,
  description: string,
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                required: ['items', 'meta'],
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  meta: {
                    type: 'object',
                    required: ['page', 'pageSize', 'totalItems', 'totalPages'],
                    properties: {
                      page: { type: 'integer', minimum: 1 },
                      pageSize: { type: 'integer', minimum: 1 },
                      totalItems: { type: 'integer', minimum: 0 },
                      totalPages: { type: 'integer', minimum: 0 },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
}
