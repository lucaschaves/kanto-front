import { Button, Checkbox, DataTable } from "@/components";
import { deleteApi, getApi } from "@/services";
import { getParamByPath } from "@/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
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
    const location = useLocation();
    const formActual = getParamByPath(location.pathname, 1);
    const { t } = useTranslation();

    const [stateData, setData] = useState<IGame[]>([]);
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                <CaretSortIcon className="ml-2 h-4 w-4" />
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

    const getData = useCallback(async () => {
        const { success, data } = await getApi({
            url: formActual,
        });
        if (success) {
            setData(data);
        }
    }, [formActual]);

    const handleDelete = useCallback(
        async (ids: string[]) => {
            const promisesDelete = ids.map(async (id) => {
                const responsePromise = new Promise((resolve, reject) => {
                    deleteApi({
                        url: `${formActual.substring(
                            0,
                            formActual.length - 1
                        )}/${id}`,
                    })
                        .then((value) => {
                            resolve(value);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
                return responsePromise;
            });
            await Promise.all(promisesDelete);
            getData();
        },
        [formActual, getData]
    );

    useEffect(() => {
        if (
            !location.pathname.includes("edit") &&
            !location.pathname.includes("new")
        ) {
            getData();
        }
    }, [location.pathname]);

    return (
        <>
            <DataTable
                columns={stateColumns}
                data={stateData}
                nameRule={formActual}
                onDelete={handleDelete}
                onRefresh={getData}
            />
            <Outlet />
        </>
    );
};

export { PageGameCreateOrEdit, PageGames };
