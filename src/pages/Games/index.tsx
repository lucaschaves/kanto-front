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
import { PageGameCreateOrEdit } from "./createOrEdit";

type IGame = {
    id: number;
    name: string;
    ean?: string;
    createdAt: Date;
    updatedAt: Date;
    consoleId: any[];
    developerId: any[];
    genderId: any[];
    numberOfPlayerId: any[];
    parentalRatingId: any[];
    publisherId: any[];
    releaseYearId: any[];
};

const PageGames = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IGame>[]>(() => {
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
                accessorKey: "ean",
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
                                {t("ean")}
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
                    <div className="capitalize">{row.getValue("ean")}</div>
                ),
            },
            {
                accessorKey: "consoleId",
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
                                {t("console")}
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
                    const rowValue = (row.getValue("consoleId") as any[])
                        ?.map((r) => r?.name)
                        ?.join(", ");
                    return <div className="capitalize">{rowValue}</div>;
                },
            },
            {
                accessorKey: "developerId",
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
                                {t("developer")}
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
                    const rowValue = (row.getValue("developerId") as any[])
                        ?.map((r) => r?.name)
                        ?.join(", ");
                    return <div className="capitalize">{rowValue}</div>;
                },
            },
            {
                accessorKey: "publisherId",
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
                                {t("publisher")}
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
                    const rowValue = (row.getValue("publisherId") as any[])
                        ?.map((r) => r?.name)
                        ?.join(", ");
                    return <div className="capitalize">{rowValue}</div>;
                },
            },
            {
                accessorKey: "releaseYearId",
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
                                {t("releaseYear")}
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
                    const rowValue = (row.getValue("releaseYearId") as any[])
                        ?.map((r) => r?.name)
                        ?.join(", ");
                    return <div className="capitalize">{rowValue}</div>;
                },
            },
            {
                accessorKey: "genderId",
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
                                {t("gender")}
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
                    const rowValue = (row.getValue("genderId") as any[])
                        ?.map((r) => r?.name)
                        ?.join(", ");
                    return <div className="capitalize">{rowValue}</div>;
                },
            },
            {
                accessorKey: "parentalRatingId",
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
                                {t("parentalRating")}
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
                    const rowValue = (row.getValue("parentalRatingId") as any[])
                        ?.map((r) => r?.name)
                        ?.join(", ");
                    return <div className="capitalize">{rowValue}</div>;
                },
            },
            {
                accessorKey: "numberOfPlayerId",
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
                                {t("numberOfPlayer")}
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
                    const rowValue = (row.getValue("numberOfPlayerId") as any[])
                        ?.map((r) => r?.name)
                        ?.join(", ");
                    return <div className="capitalize">{rowValue}</div>;
                },
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
                    return (
                        <div>
                            {format(
                                new Date(row.getValue("createdAt")),
                                "dd/MM/yyyy HH:mm:ss"
                            )}
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
                    return (
                        <div>
                            {format(
                                new Date(row.getValue("updatedAt")),
                                "dd/MM/yyyy HH:mm:ss"
                            )}
                        </div>
                    );
                },
            },
        ];
    });

    return (
        <>
            <Listing columns={stateColumns} index={1} />
            <Outlet />
        </>
    );
};

export { PageGameCreateOrEdit, PageGames };
