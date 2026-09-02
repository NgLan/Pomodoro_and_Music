export class PaginationMetaDto {
  readonly totalPages: number;

  constructor(
    readonly page: number,
    readonly pageSize: number,
    readonly totalItems: number,
  ) {
    this.totalPages =
      totalItems === 0 ? 0 : Math.ceil(totalItems / this.pageSize);
  }
}
