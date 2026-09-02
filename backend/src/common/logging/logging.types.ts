export interface LogMetadata {
  event?: string;
  operation?: string;
  duration_ms?: number;
  error_code?: string;
  [key: string]: unknown;
}
