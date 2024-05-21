import { Button, Checkbox, DataTable } from "@/components";
import { deleteApi, getApi } from "@/services";
import { getParamByPath } from "@/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageGameCreateOrEdit } from "./createOrEdit";

type IGame = {
    id: string;
    name: string;
    ean?: string;
    createdAt: Date;
    updatedAt: Date;
};

const PageGames = () => {
    const formActual = getParamByPath(location.pathname, 1);
    const { t } = useTranslation();

    const [stateData, setData] = useState<IGame[]>([]);
    const [stateColumns] = useState<ColumnDef<IGame>[]>(() => {
        return [
            {
                id: "select",
                header: ({ table }) => (
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
                accessorKey: "name",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            {t("name")}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
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
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            {t("ean")}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
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
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            {t("console")}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
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
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            {t("developer")}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    const rowValue = (row.getValue("developerId") as any[])
                        ?.map((r) => r?.name)
                        ?.join(", ");
                    return <div className="capitalize">{rowValue}</div>;
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
                    deleteApi({ url: `${formActual}/${id}` })
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
        getData();
    }, []);

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
