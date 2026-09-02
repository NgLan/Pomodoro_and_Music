import { publicEnvironment } from "@/shared/config";

interface RequestInterceptors {
  use(handler: (request: Request) => Promise<Request> | Request): unknown;
}

interface ConfigurableApiClient {
  interceptors: { request: RequestInterceptors };
  setConfig(config: { baseUrl: string }): unknown;
}

function addRequestId(request: Request): Request {
  const headers = new Headers(request.headers);
  if (!headers.has("X-Request-ID")) {
    headers.set("X-Request-ID", crypto.randomUUID());
  }
  return new Request(request, { headers });
}

/** Applies app-wide base URL and request correlation to a generated client. */
export function configureApiClient(client: ConfigurableApiClient): void {
  client.setConfig({ baseUrl: publicEnvironment.apiBaseUrl });
  client.interceptors.request.use(addRequestId);
}
