import { PaginationMetaDto } from './pagination-meta.dto.js';

export class PaginatedResponseDto<T> {
  readonly meta: PaginationMetaDto;

  constructor(
    readonly items: T[],
    page: number,
    pageSize: number,
    totalItems: number,
  ) {
    this.meta = new PaginationMetaDto(page, pageSize, totalItems);
  }
}
