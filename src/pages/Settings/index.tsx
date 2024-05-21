import { Checkbox, DataTable } from "@/components";
import { deleteApi, getApi } from "@/services";
import { createColumn, getParamByPath } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { PageSettingCreateOrEdit } from "./createOrEdit";

type ISetting = {
    id: string;
    name: string;
};

const columnId: ColumnDef<ISetting> = {
    id: "select",
    header: ({ table }) => (
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
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
        />
    ),
    enableSorting: false,
    enableHiding: false,
};

const PageSettings = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const formActual = getParamByPath(location.pathname, 2);

    const [stateData, setData] = useState<ISetting[]>([]);
    const [stateColumns, setColumns] = useState<ColumnDef<ISetting>[]>([
        columnId,
    ]);

    const getData = useCallback(async () => {
        const { success, data } = await getApi({
            url: formActual,
        });
        if (success) {
            const columns: ColumnDef<ISetting>[] = [];
            Object.keys(data[0]).forEach((key) => {
                const column = createColumn(key, t(key)) as any;
                columns.push(column);
            });
            setColumns([columnId, ...columns]);
            setData(data);
        }
    }, [formActual, stateColumns]);

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

export { PageSettingCreateOrEdit, PageSettings };
