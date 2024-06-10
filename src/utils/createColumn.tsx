import { Button } from "@/components";
import {
    CaretDownIcon,
    CaretSortIcon,
    CaretUpIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const createColumn = (name: string, title: string): ColumnDef<any> => {
    return {
        accessorKey: name,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() == "asc")
                    }
                >
                    {title}
                    {column.getIsSorted() === "desc" ? (
                        <CaretDownIcon className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "asc" ? (
                        <CaretUpIcon className="ml-2 h-4 w-4" />
                    ) : (
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => {
            if (["createdAt", "updatedAt"].includes(name)) {
                return (
                    <div>
                        {format(
                            new Date(row.getValue(name)),
                            "dd/MM/yyyy HH:mm:ss"
                        )}
                    </div>
                );
            }
            if (["email"].includes(name)) {
                return <div>{row.getValue(name)}</div>;
            }
            if (typeof row.getValue(name) == "boolean") {
                return (
                    <div className="capitalize text-center">
                        {row.getValue(name) ? "Ativo" : "Inativo"}
                    </div>
                );
            }
            return <div className="capitalize">{row.getValue(name)}</div>;
        },
    };
};

export { createColumn };
