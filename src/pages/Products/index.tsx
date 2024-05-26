import { Button, Checkbox, DataTable } from "@/components";
import { deleteApi, getApi } from "@/services";
import { getParamByPath } from "@/utils";
import { CaretSortIcon, CheckboxIcon, StopIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { PageProductCreateOrEdit } from "./createOrEdit";

type IProduct = {
    id: string;
    name: string;
};

const PageProducts = () => {
    const location = useLocation();
    const formActual = getParamByPath(location.pathname, 1);

    const { t } = useTranslation();

    const [stateData, setData] = useState<IProduct[]>([]);
    const [stateColumns] = useState<ColumnDef<IProduct>[]>([
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
            accessorKey: "type",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("type")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("type")}</div>
            ),
        },
        {
            accessorKey: "factory",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("factoryConsoleGame")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.getValue("factory") as any;
                return <div className="capitalize">{rowValue?.name}</div>;
            },
        },
        {
            accessorKey: "regionId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("region")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const rowValue = (row.getValue("regionId") as any)?.name;
                return <div className="capitalize">{rowValue}</div>;
            },
        },
        {
            accessorKey: "priceMoney",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("priceMoney")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.getValue("priceMoney") as any;
                const rowFormat = rowValue
                    ? Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                      }).format(rowValue)
                    : "-";
                return <div className="capitalize">{rowFormat}</div>;
            },
        },
        {
            accessorKey: "priceInStoreCredit",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("priceInStoreCredit")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.getValue("priceInStoreCredit") as any;
                const rowFormat = rowValue
                    ? Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                      }).format(rowValue)
                    : "-";
                return <div className="capitalize">{rowFormat}</div>;
            },
        },
        {
            accessorKey: "pvSite",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("pvSite")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.getValue("pvSite") as any;
                const rowFormat = rowValue
                    ? Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                      }).format(rowValue)
                    : "-";
                return <div className="capitalize">{rowFormat}</div>;
            },
        },
        {
            accessorKey: "pvMercadoLivre",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("pvMercadoLivre")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.getValue("pvMercadoLivre") as any;
                const rowFormat = rowValue
                    ? Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                      }).format(rowValue)
                    : "-";
                return <div className="capitalize">{rowFormat}</div>;
            },
        },
        {
            accessorKey: "pvAmazon",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("pvAmazon")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.getValue("pvAmazon") as any;
                const rowFormat = rowValue
                    ? Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                      }).format(rowValue)
                    : "-";
                return <div className="capitalize">{rowFormat}</div>;
            },
        },
        {
            accessorKey: "gameConversation",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("gameConversation")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("gameConversation")}
                </div>
            ),
        },
        {
            accessorKey: "gameManual",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("gameManual")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("gameManual") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "gamePackaging",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("gamePackaging")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("gamePackaging") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "gamePackagingRental",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("gamePackagingRental")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("gamePackagingRental") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "gameSealed",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("gameSealed")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("gameSealed") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "gameWorking",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("gameWorking")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("gameWorking") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "consoleComplete",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("consoleComplete")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("consoleComplete") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "consolePackaging",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("consolePackaging")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("consolePackaging") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "consoleSealed",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("consoleSealed")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("consoleSealed") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "consoleTypeUnlocked",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("consoleTypeUnlocked")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("consoleTypeUnlocked") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "consoleUnlocked",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("consoleUnlocked")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("consoleUnlocked") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "consoleWorking",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() == "asc")
                        }
                    >
                        {t("consoleWorking")}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("consoleWorking") ? (
                        <CheckboxIcon />
                    ) : (
                        <StopIcon />
                    )}
                </div>
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
    ]);

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
                onDelete={handleDelete}
                onRefresh={getData}
                nameRule="products"
            />
            <Outlet />
        </>
    );
};

export { PageProductCreateOrEdit, PageProducts };
