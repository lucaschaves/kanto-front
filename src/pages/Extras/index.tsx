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
import { PageExtraCreateOrEdit } from "./createOrEdit";

type IExtra = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

const PageExtras = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IExtra>[]>(() => {
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
                        <div className="flex items-start">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                                className="pl-0"
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
                        <div className="flex items-start">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                                className="pl-0"
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
                            {/* <Button
                                variant="ghost"
                                className="px-1"
                                onClick={() => {
                                    if (column.getIsPinned()) {
                                        column.pin(false);
                                    } else {
                                        column.pin("left");
                                    }
                                }}
                            >
                                {column.getIsPinned() ? (
                                    <DrawingPinFilledIcon className="h-4 w-4" />
                                ) : (
                                    <DrawingPinIcon className="h-4 w-4" />
                                )}
                            </Button> */}
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
                        <div className="flex items-start">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                                className="pl-0"
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
                        <div className="flex items-start">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                                className="pl-0"
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

export { PageExtraCreateOrEdit, PageExtras };
