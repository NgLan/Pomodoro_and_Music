export interface Pagination {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> extends Pagination {
  items: T[];
  totalItems: number;
}
