import { SortingState } from "@tanstack/react-table";
import { useState } from "react";

interface IPropsUseSorting {
    initialField?: string;
    initialOrder?: string;
    columns?: any[];
}

export function useSorting(props: IPropsUseSorting) {
    const { initialField = "id", initialOrder = "asc", columns } = props;

    const [sorting, setSorting] = useState<SortingState>([
        { id: initialField, desc: initialOrder === "asc" },
    ]);

    let findField = columns?.find(
        (col) => col.accessorKey == sorting && sorting[0]?.id
    )?.filter;
    if (!findField) {
        findField = sorting.length ? sorting[0].id : initialField;
    }

    return {
        sorting,
        onSortingChange: setSorting,
        order: !sorting.length
            ? initialOrder
            : sorting[0].desc
            ? "desc"
            : "asc",
        field: findField, // sorting.length ? sorting[0].id : initialField,
    };
}
