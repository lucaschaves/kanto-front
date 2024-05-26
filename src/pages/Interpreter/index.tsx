import {
    BaseForm,
    Button,
    Checkbox,
    DataTable,
    Dropzone,
    FButtonSubmit,
    FSelectLabel,
    IBaseFormRef,
    Separator,
    Spinner,
} from "@/components";
import { cn } from "@/lib";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { PageInterpreterCreateOrEdit } from "./createOrEdit";

interface IItem {
    id: string;
    name: string;
}

const PageInterpreter = () => {
    const refForm = useRef<IBaseFormRef>(null);

    const { t } = useTranslation();

    const location = useLocation();
    const navigate = useNavigate();

    const [stateLoading, setLoading] = useState(false);
    const [stateOptionsSheets, setOptionsSheets] = useState<IItem[]>([]);
    const [stateOptionsColumns, setOptionsColumns] = useState<IItem[]>([]);
    const [file, setFile] = useState<{ url: string; file: any }>({
        file: null,
        url: "",
    });
    const [stateColumns] = useState<ColumnDef<any>[]>(() => {
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
                                table.toggleAllRowsSelected(!!value)
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
                        </div>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("name")}</div>
                ),
            },
        ];
    });
    const [stateData, setData] = useState<{ id: string; name: string }[]>([]);
    const [stateWorkbook, setWoorkbook] = useState<{
        [sheet: string]: XLSX.WorkSheet;
    } | null>(null);

    const handleSubmit = useCallback(
        (data: any) => {
            if (stateWorkbook) {
                const { sheetName, column } = data;
                const sheetsWork = XLSX.utils.sheet_to_json(
                    stateWorkbook[sheetName]
                );
                const dataByColumn = sheetsWork
                    .map((d: any) => String(d[column])?.toLowerCase())
                    .filter((d, i, s) => s.indexOf(d) === i)
                    .filter((d) => d != "undefined")
                    .filter((d) => !!d)
                    .sort()
                    .map((d) => ({ id: d, name: d }));
                setData(dataByColumn);
            }
        },
        [file, stateWorkbook]
    );

    const handleChange = useCallback((data: any) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheets = workbook.SheetNames.map((s) => ({ id: s, name: s }));
            setWoorkbook(workbook.Sheets);
            setOptionsSheets(sheets);
            setLoading(false);
        };
        reader.readAsArrayBuffer(data.file);
        setFile(data);
    }, []);

    const handleChangeSheet = useCallback(
        (sheetName: string) => {
            if (stateWorkbook) {
                const sheetsWork = XLSX.utils.sheet_to_json(
                    stateWorkbook[sheetName]
                )[0] as any;
                const columns = Object.keys(sheetsWork).map((key) => ({
                    id: key,
                    name: key,
                }));
                setOptionsColumns(columns);
            }
        },
        [stateWorkbook]
    );

    const onImport = useCallback(
        (ids: string[]) => {
            navigate(`${location.pathname}/import`, {
                state: {
                    ids,
                },
            });
        },
        [location.pathname]
    );

    return (
        <>
            <div
                className={cn(
                    "w-full",
                    "h-full",
                    "flex",
                    "flex-col",
                    "gap-4",
                    "p-2",
                    "relative"
                )}
            >
                <div className={cn("grid", "grid-cols-3", "gap-2")}>
                    <Dropzone onChange={handleChange} />
                    <BaseForm ref={refForm} onSubmit={handleSubmit}>
                        <div className={cn("col-span-2", "flex", "flex-col")}>
                            <FSelectLabel
                                label={t("tabName")}
                                name="sheetName"
                                items={stateOptionsSheets}
                                onEffect={handleChangeSheet}
                                disabled={stateLoading || !file.file}
                            />
                            <FSelectLabel
                                label={t("column")}
                                name="column"
                                items={stateOptionsColumns}
                                disabled={stateLoading || !file.file}
                            />
                            <div
                                className={cn(
                                    "flex",
                                    "w-full",
                                    "items-center",
                                    "justify-end",
                                    "gap-2",
                                    "mt-4",
                                    "col-span-2"
                                )}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => refForm.current?.reset({})}
                                    disabled={stateLoading || !file.file}
                                >
                                    {t("clean")}
                                </Button>
                                <FButtonSubmit
                                    label={t("convert")}
                                    disabled={stateLoading || !file.file}
                                />
                            </div>
                        </div>
                    </BaseForm>
                </div>
                <Separator />
                <DataTable
                    columns={stateColumns}
                    data={stateData}
                    nameRule="interpreter"
                    canRefresh={false}
                    canAdd={false}
                    canDelete={false}
                    canEdit={false}
                    canColumns={false}
                    onAction={onImport}
                />
                {stateLoading ? (
                    <Spinner className="absolute top-2/4 left-2/4" />
                ) : (
                    <></>
                )}
            </div>
            <Outlet />
        </>
    );
};

export { PageInterpreter, PageInterpreterCreateOrEdit };
