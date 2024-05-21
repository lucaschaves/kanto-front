import { Button } from "@/components";
import { CaretSortIcon } from "@radix-ui/react-icons";
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
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    {title}
                    <CaretSortIcon className="ml-2 h-4 w-4" />
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
            if (typeof row.getValue(name) === "boolean") {
                return (
                    <div className="capitalize">
                        {row.getValue(name) ? "Ativo" : "Inativo"}
                    </div>
                );
            }
            return <div className="capitalize">{row.getValue(name)}</div>;
        },
    };
};

export { createColumn };
