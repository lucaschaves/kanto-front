import { Checkbox, DataTable, IOnRefresh } from "@/components";
import { deleteApi, getApi } from "@/services";
import { createColumn, getParamByPath } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface IPropsListing<T> {
    columns?: ColumnDef<T>[];
    index: number;
}

const columnId: ColumnDef<any> = {
    id: "select",
    header: ({ table }) => (
        <div className="flex items-center">
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Selecionar todos"
            />
        </div>
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
        />
    ),
    enableSorting: false,
    size: 50,
};

export function Listing<T>(props: IPropsListing<T>) {
    const { columns, index } = props;

    const location = useLocation();

    const { t } = useTranslation();
    const formActual = getParamByPath(location.pathname, index);

    const [stateLoading, setLoading] = useState(false);
    const [stateData, setData] = useState<{ total: number; rows: T[] }>({
        total: 0,
        rows: [],
    });
    const [stateColumns, setColumns] = useState<ColumnDef<T>[]>(columns ?? []);

    const getData = useCallback(
        async (propsV?: IOnRefresh) => {
            setLoading(true);
            const { success, data } = await getApi({
                url: formActual,
                config: {
                    params: {
                        skip: propsV?.pagination.skip,
                        limit: propsV?.pagination.limit,
                        order: propsV?.sort.field,
                        direction: propsV?.sort.order,
                        field: propsV?.filter?.field,
                        filter: propsV?.filter?.filter,
                    },
                },
            });
            if (success) {
                if (!columns) {
                    const columns: ColumnDef<T>[] = [];
                    if (data.rows.length) {
                        Object.keys(data.rows[0]).forEach((key) => {
                            const column = createColumn(key, t(key)) as any;
                            columns.push(column);
                        });
                    }
                    setColumns([columnId as any, ...columns]);
                }
                setData(data);
            }
            setLoading(false);
        },
        [formActual]
    );

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
            getData({
                pagination: { limit: 10, skip: 0 },
                sort: { field: "id", order: "ASC" },
            });
        }
    }, [location.pathname]);

    return (
        <DataTable
            columns={stateColumns}
            data={stateData.rows}
            nameRule={formActual}
            onDelete={handleDelete}
            onRefresh={getData}
            total={stateData.total}
            loading={stateLoading}
        />
    );
}
