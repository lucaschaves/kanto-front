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
import { PageHistoriesFormsCreateOrEdit } from "./createOrEdit";
import { FilterHistoriesForms } from "./filter";

type IHistoryQuotation = {
    id: string;
    name: string;
};

const PageHistoriesForms = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IHistoryQuotation>[]>([
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
            accessorKey: "adjusted",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("adjusted")}
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
                return (
                    <div className="capitalize">{row.getValue("adjusted")}</div>
                );
            },
        },
        {
            accessorKey: "budgetedValues",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("budgetedValues")}
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
                return (
                    <div className="capitalize">
                        {row.getValue("budgetedValues")}
                    </div>
                );
            },
        },
        {
            accessorKey: "completionDate",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("completionDate")}
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
                return (
                    <div className="capitalize">
                        {row.getValue("completionDate")}
                    </div>
                );
            },
        },
        {
            accessorKey: "finalValue",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("finalValue")}
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
                return (
                    <div className="capitalize">
                        {row.getValue("finalValue")}
                    </div>
                );
            },
        },
        {
            accessorKey: "finished",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("finished")}
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
                return (
                    <div className="capitalize">{row.getValue("finished")}</div>
                );
            },
        },
        {
            accessorKey: "openingDate",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("openingDate")}
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
                return (
                    <div className="capitalize">
                        {row.getValue("openingDate")}
                    </div>
                );
            },
        },
        {
            accessorKey: "paymentMethodId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("paymentMethodId")}
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
                return (
                    <div className="capitalize">
                        {row.getValue("paymentMethodId")}
                    </div>
                );
            },
        },
        {
            accessorKey: "receiptDate",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("receiptDate")}
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
                return (
                    <div className="capitalize">
                        {row.getValue("receiptDate")}
                    </div>
                );
            },
        },
        {
            accessorKey: "received",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("received")}
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
                return (
                    <div className="capitalize">{row.getValue("received")}</div>
                );
            },
        },
        {
            accessorKey: "returned",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("returned")}
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
                return (
                    <div className="capitalize">{row.getValue("returned")}</div>
                );
            },
        },
    ]);

    return (
        <>
            <Listing
                columns={stateColumns}
                index={2}
                filter_name="filter_history_id"
                navigateForm="/quotations/quotationsforms"
            />
            <Outlet />
        </>
    );
};

export {
    FilterHistoriesForms,
    PageHistoriesForms,
    PageHistoriesFormsCreateOrEdit,
};
