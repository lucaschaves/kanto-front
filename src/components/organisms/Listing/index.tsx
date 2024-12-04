import { Checkbox, DataTable, IOnRefresh } from "@/components";
import { CONSTANT_NUMBER_ROWS } from "@/constants";
import { deleteApi, getApi } from "@/services";
import {
    capitalize,
    createColumn,
    decodeSearchParams,
    getParamByPath,
} from "@/utils";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";

interface IPropsListing<T> {
    columns?: ColumnDef<T>[];
    urlMethod?: string;
    columnsHidden?: VisibilityState;
    columnsDynamic?: string[];
    index: number;
    name?: string;
    nameDefault?: string;
    filter_name?: string;
    navigateForm?: string;
    canAdd?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canExportCsv?: boolean;
    canImportCsv?: boolean;
    canImportCatalog?: boolean;
    canExportTemplateCsv?: boolean;
    canStatus?: boolean;
    urlDelete?: string;
    canColumns?: boolean;
    canApprove?: boolean;
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

const enableSortingArr = ["id", "name"];

export function Listing<T>(props: IPropsListing<T>) {
    const {
        columns,
        index,
        name,
        navigateForm,
        columnsHidden,
        columnsDynamic,
        urlDelete,
        ...rest
    } = props;

    const location = useLocation();

    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const formActual = name || getParamByPath(location.pathname, index);

    const [stateLoading, setLoading] = useState(false);
    const [stateData, setData] = useState<{ total: number; rows: T[] }>({
        total: 0,
        rows: [],
    });
    const [stateColumns, setColumns] = useState<ColumnDef<T>[]>(columns ?? []);

    const getData = async (propsV?: IOnRefresh) => {
        setLoading(true);
        const skip = searchParams?.get("page")
            ? (
                  Number(searchParams?.get("page")) *
                  Number(propsV?.pagination?.limit)
              ).toFixed(0)
            : propsV?.pagination?.skip;
        const { success, data } = await getApi({
            url: formActual,
            config: {
                params: {
                    skip: skip,
                    limit: propsV?.pagination.limit,
                    order: propsV?.sort.field,
                    direction: propsV?.sort.order,
                    ...propsV?.filters,
                },
            },
        });
        if (success) {
            if (!columns) {
                const columnsAt: any[] = [];
                if (data.rows.length) {
                    const row = data.rows[0];
                    Object.keys(row).forEach((key) => {
                        const column = createColumn({
                            name: key,
                            title: t(key) as any,
                            enableSorting: enableSortingArr.includes(key),
                        });
                        columnsAt.push({
                            ...column,
                            typeFilter: "text",
                        });
                    });
                }
                setColumns([columnId as any, ...columnsAt]);
            }
            if (columnsDynamic) {
                const columnsAt: any[] = columns
                    ? [...columns]
                    : [...stateColumns];
                if (data.rows.length) {
                    const row = data.rows[0];
                    Object.keys(row).forEach((key) => {
                        columnsDynamic.forEach((d) => {
                            if (key === d) {
                                const arrayName = row[d];
                                arrayName?.forEach((a: any) => {
                                    const column = createColumn({
                                        name: a.name,
                                        title: t(`PV ${capitalize(a.name)}`),
                                        type: "currency",
                                        enableSorting:
                                            enableSortingArr.includes(key),
                                    });
                                    columnsAt.push({
                                        ...column,
                                        typeFilter: "text",
                                    });
                                });
                            }
                        });
                    });
                }
                setColumns(columnsAt);
            }
            setData(data);
        }
        setLoading(false);
    };

    const handleDelete = async (ids: string[]) => {
        const promisesDelete = ids.map(async (id) => {
            const responsePromise = new Promise((resolve, reject) => {
                deleteApi({
                    url: urlDelete
                        ? `${urlDelete}/${id}`
                        : `${formActual.substring(
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
    };

    useEffect(() => {
        const numberRows = JSON.parse(
            window.localStorage.getItem(CONSTANT_NUMBER_ROWS) || "{}"
        );
        let limitPag = 20;
        if (numberRows && numberRows[formActual]) {
            try {
                limitPag = Number(numberRows[formActual]);
            } catch (err) {}
        }
        if (
            location.search?.length &&
            !location.pathname.includes("edit") &&
            !location.pathname.includes("new")
        ) {
            const filters = decodeSearchParams(location.search);
            getData({
                pagination: { limit: limitPag, skip: 0 },
                sort: { field: "id", order: "desc" },
                filters,
            });
        } else if (
            !location.pathname.includes("edit") &&
            !location.pathname.includes("new")
        ) {
            getData({
                pagination: { limit: limitPag, skip: 0 },
                sort: { field: "id", order: "desc" },
                filters: {},
            });
        }
    }, [location.pathname, location.search]);

    return (
        <DataTable
            columns={stateColumns}
            data={stateData.rows}
            name={formActual}
            onDelete={handleDelete}
            onRefresh={getData}
            total={stateData.total}
            loading={stateLoading}
            navigateForm={navigateForm}
            canNavigate={!!navigateForm}
            columnsHidden={columnsHidden}
            {...rest}
        />
    );
}
