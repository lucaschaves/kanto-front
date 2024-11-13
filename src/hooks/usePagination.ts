import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

interface IPagination {
    limit?: number | null;
    page?: string | null;
}

export function usePagination(props: IPagination) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: props?.limit || 10,
        pageIndex: props?.page ? Number(props.page) : 0,
    });

    const { pageSize, pageIndex } = pagination;

    return {
        limit: pageSize,
        onPaginationChange: setPagination,
        pagination,
        skip: pageSize * pageIndex,
    };
}
