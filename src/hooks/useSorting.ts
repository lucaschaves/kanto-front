import { SortingState } from "@tanstack/react-table";
import { SetStateAction, useEffect, useRef, useState } from "react";

export interface IOnRefreshSort {
    field: string;
}

interface IPropsUseSorting {
    initialField?: string;
    initialOrder?: string;
    columns?: any[];
    onRefresh?: (props: IOnRefreshSort) => void;
}

export function useSorting(props: IPropsUseSorting) {
    const {
        initialField = "id",
        initialOrder = "asc",
        columns,
        onRefresh = () => ({}),
    } = props;

    const refInit = useRef(false);
    const [sorting, setSorting] = useState<SortingState>([
        { id: initialField, desc: initialOrder === "asc" },
    ]);

    const handleSort = (propsV: SetStateAction<SortingState>): SortingState => {
        setSorting(propsV);
        return sorting;
    };

    let findField = columns?.find(
        (col) => col.accessorKey == sorting && sorting[0]?.id
    )?.filter;

    if (!findField) {
        findField = sorting.length ? sorting[0].id : initialField;
    }

    const findOrder = !sorting.length
        ? initialOrder
        : sorting[0].desc
        ? "desc"
        : "asc";

    useEffect(() => {
        if (refInit.current) {
            onRefresh({
                field: findField,
                // order: findOrder,
            });
        }
        refInit.current = true;
    }, [sorting]);

    return {
        sorting,
        onSortingChange: handleSort,
        order: findOrder,
        field: findField,
    };
}
