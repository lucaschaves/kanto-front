import { Button, Checkbox } from "@/components";
import {
    CaretDownIcon,
    CaretSortIcon,
    CaretUpIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Square, SquareCheck } from "lucide-react";
import { resolveKeyObj } from "./resolveKeyObj";

type ITypeColumn =
    | "text"
    | "date"
    | "datetime"
    | "boolean"
    | "email"
    | "calc"
    | "object"
    | "currency"
    | "percentage";

export interface ICreateColumn {
    name: string;
    title: string;
    type?: ITypeColumn;
    subType?: ITypeColumn;
    field?: string;
    fieldCompare?: string;
    enableSorting?: boolean;
    enableHiding?: boolean;
}

const formatValueByType = (props: { type: ITypeColumn; value: any }): any => {
    const { type, value } = props;
    if (type === "date") {
        return format(new Date(value), "dd/MM/yyyy");
    }
    if (type === "datetime") {
        return format(new Date(value), "dd/MM/yyyy HH:mm:ss");
    }
    if (type === "email") {
        return value;
    }
    if (type === "boolean") {
        return value ? (
            <SquareCheck className="w-4 h-4 text-slate-700" />
        ) : (
            <Square className="w-4 h-4 text-slate-700" />
        );
    }
    if (type === "currency") {
        return value
            ? Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
              }).format(value)
            : "-";
    }
    if (type === "percentage") {
        return value
            ? (Number(value) / 100).toLocaleString("pt-BR", {
                  style: "percent",
                  minimumFractionDigits: 2,
              })
            : "-";
    }
    return value;
};

const createColumn = (props: ICreateColumn): ColumnDef<any> => {
    const {
        name,
        title,
        type = "text",
        field,
        subType = "text",
        fieldCompare,
        enableSorting = true,
        enableHiding = true,
    } = props;

    if (name === "select") {
        return {
            id: name,
            header: ({ table }) => (
                <div className="flex items-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label={title}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={title}
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 50,
            minSize: 50,
        };
    }
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
            if (type === "calc") {
                const valueDef = row.original[field || ""];
                const valueAct = resolveKeyObj(
                    fieldCompare || "",
                    row.original
                );
                return (
                    <div className="text-center">
                        {formatValueByType({
                            type: subType,
                            value: valueDef - valueAct,
                        })}
                    </div>
                );
            }
            if (["date", "datetime"].includes(type)) {
                return (
                    <div className="text-center">
                        {formatValueByType({ type, value: row.getValue(name) })}
                    </div>
                );
            }
            if (type === "email") {
                return (
                    <div className="text-left">
                        {formatValueByType({ type, value: row.getValue(name) })}
                    </div>
                );
            }
            if (type === "boolean") {
                return (
                    <div className="flex items-center justify-center">
                        {formatValueByType({ type, value: row.getValue(name) })}
                    </div>
                );
            }
            if (type === "object") {
                const rowVal = row.getValue(name) as any;
                const valObj =
                    field && rowVal && rowVal[field] ? rowVal[field] : "";

                return (
                    <div className="capitalize text-center">
                        {formatValueByType({
                            type: subType,
                            value: valObj,
                        })}
                    </div>
                );
            }
            return (
                <div className="capitalize text-center">
                    {formatValueByType({
                        type,
                        value: row.getValue(name),
                    })}
                </div>
            );
        },
        enableSorting,
        enableHiding,
    };
};

export { createColumn };
