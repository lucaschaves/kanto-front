import { Button, Checkbox, Listing } from "@/components";
import {
    CaretDownIcon,
    CaretSortIcon,
    CaretUpIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageAccessoryCreateOrEdit } from "./createOrEdit";

type IAccessory = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

const PageAccessories = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IAccessory>[]>(() => {
        return [
            {
                id: "select",
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
                            aria-label="Select all"
                        />
                    </div>
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
                size: 50,
                minSize: 50,
            },
            {
                accessorKey: "id",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                            >
                                {t("id")}
                                {column.getIsSorted() === "desc" ? (
                                    <CaretDownIcon className="ml-2 h-4 w-4" />
                                ) : column.getIsSorted() === "asc" ? (
                                    <CaretUpIcon className="ml-2 h-4 w-4" />
                                ) : (
                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("id")}</div>
                ),
            },
            {
                accessorKey: "name",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                            >
                                {t("name")}
                                {column.getIsSorted() === "desc" ? (
                                    <CaretDownIcon className="ml-2 h-4 w-4" />
                                ) : column.getIsSorted() === "asc" ? (
                                    <CaretUpIcon className="ml-2 h-4 w-4" />
                                ) : (
                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("name")}</div>
                ),
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                            >
                                {t("createdAt")}
                                {column.getIsSorted() === "desc" ? (
                                    <CaretDownIcon className="ml-2 h-4 w-4" />
                                ) : column.getIsSorted() === "asc" ? (
                                    <CaretUpIcon className="ml-2 h-4 w-4" />
                                ) : (
                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    const value = row.getValue("createdAt") as any;
                    return (
                        <div>
                            {value
                                ? format(new Date(value), "dd/MM/yyyy HH:mm:ss")
                                : "-"}
                        </div>
                    );
                },
            },
            {
                accessorKey: "updatedAt",
                header: ({ column }) => {
                    return (
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                            >
                                {t("updatedAt")}
                                {column.getIsSorted() === "desc" ? (
                                    <CaretDownIcon className="ml-2 h-4 w-4" />
                                ) : column.getIsSorted() === "asc" ? (
                                    <CaretUpIcon className="ml-2 h-4 w-4" />
                                ) : (
                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    const value = row.getValue("updatedAt") as any;
                    return (
                        <div>
                            {value
                                ? format(new Date(value), "dd/MM/yyyy HH:mm:ss")
                                : "-"}
                        </div>
                    );
                },
            },
        ];
    });

    return (
        <>
            <Listing columns={stateColumns} index={2} />
            <Outlet />
        </>
    );
};

export { PageAccessories, PageAccessoryCreateOrEdit };
