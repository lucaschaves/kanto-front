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
import { PageQuotationsFormCreateOrEdit } from "./createOrEdit";
import { FilterQuotationsForms } from "./filter";

type IQuotationsForm = {
    id: string;
    name: string;
};

const PageQuotationsForms = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IQuotationsForm>[]>([
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
            accessorKey: "quotationHistoryId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("quotationHistory")}
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
                const rowValue = row.getValue("quotationHistoryId") as any;
                return <div className="capitalize">{rowValue?.id}</div>;
            },
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
            accessorKey: "providerId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
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
                );
            },
            cell: ({ row }) => {
                const rowValue = row.getValue("providerId") as any;
                return <div className="capitalize">{rowValue?.name}</div>;
            },
        },
        {
            accessorKey: "providerId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("email")}
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
                const rowValue = row.getValue("providerId") as any;
                return <div>{rowValue?.email}</div>;
            },
        },
        {
            accessorKey: "providerId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("phone")}
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
                const rowValue = row.getValue("providerId") as any;
                return <div className="capitalize">{rowValue?.phone}</div>;
            },
        },
        {
            accessorKey: "quotationHistoryId.adjusted",
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
                    <div className="capitalize">
                        {row.getValue("quotationHistoryId.adjusted")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.budgetedValues",
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
                        {row.getValue("quotationHistoryId.budgetedValues")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.completionDate",
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
                        {row.getValue("quotationHistoryId.completionDate")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.finalValue",
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
                        {row.getValue("quotationHistoryId.finalValue")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.finished",
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
                    <div className="capitalize">
                        {row.getValue("quotationHistoryId.finished")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.openingDate",
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
                        {row.getValue("quotationHistoryId.openingDate")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.paymentMethodId",
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
                        {row.getValue("quotationHistoryId.paymentMethodId")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.receiptDate",
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
                        {row.getValue("quotationHistoryId.receiptDate")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.received",
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
                    <div className="capitalize">
                        {row.getValue("quotationHistoryId.received")}
                    </div>
                );
            },
        },
        {
            accessorKey: "quotationHistoryId.returned",
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
                    <div className="capitalize">
                        {row.getValue("quotationHistoryId.returned")}
                    </div>
                );
            },
        },
    ]);

    return (
        <>
            <Listing
                columns={stateColumns}
                index={2}
                name="quotationsform"
                filter_name="filter_form_id"
                navigateForm="/quotations/quotationssearchs"
                canAdd={false}
            />
            <Outlet />
        </>
    );
};

export {
    FilterQuotationsForms,
    PageQuotationsFormCreateOrEdit,
    PageQuotationsForms,
};
