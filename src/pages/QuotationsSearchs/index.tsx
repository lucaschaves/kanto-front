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
            accessorKey: "consoleId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
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
                const rowValue = row.getValue("consoleId") as any;
                return <div className="capitalize">{rowValue?.name}</div>;
            },
        },
        {
            accessorKey: "gameId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
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
                const rowValue = row.getValue("gameId") as any;
                return <div className="capitalize">{rowValue?.name}</div>;
            },
        },
        {
            accessorKey: "questionId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
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
                const rowValue = row.getValue("questionId") as any;
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
