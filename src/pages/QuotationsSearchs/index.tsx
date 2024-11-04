import { Button, Checkbox, Listing } from "@/components";
import {
    CaretDownIcon,
    CaretSortIcon,
    CaretUpIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageQuotationsSearchCreateOrEdit } from "./createOrEdit";
import { FilterQuotationsSearchs } from "./filter";

type IQuotationsSearch = {
    id: string;
    name: string;
};

const PageQuotationsSearchs = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IQuotationsSearch>[]>([
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
            accessorKey: "console",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                        className="pl-0"
                    >
                        {t("console")}
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
                const rowValue = row.getValue("console") as any;
                return <div className="capitalize">{rowValue?.name}</div>;
            },
        },
        {
            accessorKey: "game",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                        className="pl-0"
                    >
                        {t("game")}
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
                const rowValue = row.getValue("game") as any;
                return <div className="capitalize">{rowValue?.name}</div>;
            },
        },
        {
            accessorKey: "question",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                        className="pl-0"
                    >
                        {t("question")}
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
                const rowValue = row.getValue("question") as any;
                return <div className="capitalize">{rowValue?.question}</div>;
            },
        },
        {
            accessorKey: "reviewComments",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                        className="pl-0"
                    >
                        {t("reviewComments")}
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
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("reviewComments")}
                </div>
            ),
        },
    ]);

    return (
        <>
            <Listing
                columns={stateColumns}
                index={2}
                name="quotationssearch"
                canAdd={false}
                canApprove={true}
            />
            <Outlet />
        </>
    );
};

export {
    FilterQuotationsSearchs,
    PageQuotationsSearchCreateOrEdit,
    PageQuotationsSearchs,
};
