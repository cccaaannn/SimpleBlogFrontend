interface Pagination<T> {
    data: T[],
    totalItems: number,
    totalPages: number,
    page: number,
    pageSize: number
};

export type { Pagination };