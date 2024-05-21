import { Button, Checkbox, DataTable } from "@/components";
import { getApi } from "@/services";
import { getParamByPath } from "@/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { PageProductCreateOrEdit } from "./createOrEdit";

type IProduct = {
    id: string;
    name: string;
};

const columns: ColumnDef<IProduct>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nome
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
];

const PageProducts = () => {
    const formActual = getParamByPath(location.pathname, 1);

    const [stateData, setData] = useState<IProduct[]>([]);

    const getData = useCallback(async () => {
        const { success, data } = await getApi({
            url: formActual,
        });
        if (success) {
            setData(data);
        }
    }, [formActual]);

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <DataTable nameRule="products" columns={columns} data={stateData} />
            <Outlet />
        </>
    );
};

export { PageProductCreateOrEdit, PageProducts };
