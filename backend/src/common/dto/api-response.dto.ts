export class ApiResponseDto<T> {
  readonly status = 'success';

  constructor(
    readonly code: number,
    readonly message: string,
    readonly data: T,
  ) {}
}
