import type { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';

export const OPENAPI_UI_PATH = 'docs';
export const OPENAPI_JSON_PATH = 'docs/openapi.json';

export function createOpenApiDocument(
  application: INestApplication,
): OpenAPIObject {
  const configuration = new DocumentBuilder()
    .setTitle('Pomodoro and Music API')
    .setDescription('Backend API for Pomodoro sessions and music playback.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  return SwaggerModule.createDocument(application, configuration, {
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey.replace(/Controller$/, '')}_${methodKey}`,
  });
}

export function setupOpenApi(application: INestApplication): void {
  SwaggerModule.setup(
    OPENAPI_UI_PATH,
    application,
    () => createOpenApiDocument(application),
    {
      jsonDocumentUrl: OPENAPI_JSON_PATH,
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );
}
