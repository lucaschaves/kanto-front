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
import { useDynamicRefs } from "@/hooks";
import { cn } from "@/lib";
import {
    CaretDownIcon,
    CaretSortIcon,
    CaretUpIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useImperativeHandle, useRef, useState } from "react";
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
    const [, setRef] = useDynamicRefs();
    const { t } = useTranslation();

    const location = useLocation();
    const navigate = useNavigate();

    const [stateLoading, setLoading] = useState(false);
    const [stateOptionsSheets, setOptionsSheets] = useState<IItem[]>([]);
    const [stateOptionsColumns, setOptionsColumns] = useState<IItem[]>([]);
    const [stateNameUp, setNameUp] = useState("");
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
                        <div className="flex items-start">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                                className="pl-0"
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
                        <div className="flex items-start">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() == "asc"
                                    )
                                }
                                className="pl-0"
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
                        </div>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("name")}</div>
                ),
            },
        ];
    });
    const [stateData, setData] = useState<{ total: number; rows: any[] }>({
        total: 0,
        rows: [],
    });
    const [stateWorkbook, setWoorkbook] = useState<{
        [sheet: string]: XLSX.WorkSheet;
    } | null>(null);

    const handleSubmit = (data: any) => {
        if (stateWorkbook) {
            const { sheetName, column } = data;
            const sheetsWork = XLSX.utils.sheet_to_json(
                stateWorkbook[sheetName]
            );
            setNameUp("");
            if (column === "NOME") {
                if (sheetName === "Jogos") {
                    setNameUp("jogo");
                    const dataRows = sheetsWork.map((d: any) => {
                        return {
                            anoDeLancamento: d["ANO DE LANÇAMENTO"],
                            classificacaoIndicativa: String(
                                d["CLASSIFICAÇÃO INDICATIVA"]
                            )?.toLowerCase(),
                            console: String(d["CONSOLE"])?.toLowerCase(),
                            desenvolvedora: String(
                                d["DESENVOLVEDORA"]
                            )?.toLowerCase(),
                            editora: String(d["EDITORA"])?.toLowerCase(),
                            genero: String(d["GÊNERO"])?.toLowerCase(),
                            nome: String(d["NOME"])?.toLowerCase(),
                            name: String(d["NOME"])?.toLowerCase(),
                            id: String(d["NOME"])?.toLowerCase(),
                            numeroDeJogadores: String(
                                d["NUMERO DE JOGADORES"]
                            )?.toLowerCase(),
                            ean: d["EAN"],
                        };
                    });
                    setData({
                        total: dataRows.length,
                        rows: dataRows,
                    });
                } else if (sheetName === "Consoles") {
                    setNameUp("console");
                    const dataRows = sheetsWork.map((d: any) => {
                        return {
                            anoDeLancamento: d["ANO DE LANÇAMENTO"],
                            armazenamento: String(
                                d["Armazenamento"]
                            )?.toLowerCase(),
                            cor: String(d["COR"])?.toLowerCase(),
                            edicaoEspecial: d["Edição Especial"],
                            marca: String(d["MARCA"])?.toLowerCase(),
                            modelo: String(d["MODELO"])?.toLowerCase(),
                            nome: String(d["NOME"])?.toLowerCase(),
                            name: String(d["NOME"])?.toLowerCase(),
                            id: String(d["NOME"])?.toLowerCase(),
                            tipoDeConsole: String(
                                d["TIPO DE CONSOLE"]
                            )?.toLowerCase(),
                        };
                    });
                    setData({
                        total: dataRows.length,
                        rows: dataRows,
                    });
                }
            } else {
                const dataByColumn = sheetsWork
                    .map((d: any) => String(d[column])?.toLowerCase())
                    .filter((d, i, s) => s.indexOf(d) === i)
                    .filter((d) => d != "undefined")
                    .filter((d) => !!d)
                    .sort();
                setData({
                    total: dataByColumn.length,
                    rows: dataByColumn.map((d) => ({
                        id: String(d)?.toLowerCase(),
                        name: String(d)?.toLowerCase(),
                    })),
                });
            }
        }
    };

    const handleChange = (data: any) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheets = workbook.SheetNames.map((s) => {
                return {
                    id: s,
                    name: s,
                };
            });
            setWoorkbook(workbook.Sheets);
            setOptionsSheets(sheets);
            setLoading(false);
        };
        reader.readAsArrayBuffer(data.file);
        setFile(data);
    };

    const handleChangeSheet = (sheetName: string) => {
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
    };

    const onImport = (ids: string[]) => {
        navigate(`${location.pathname}/import`, {
            state: {
                ids,
            },
        });
    };

    const onClean = () => {
        setLoading(false);
        setOptionsSheets([]);
        setOptionsColumns([]);
        setNameUp("");
        setFile({
            file: null,
            url: "",
        });
        setData({
            total: 0,
            rows: [],
        });
        setWoorkbook(null);
        refForm.current?.reset({});
    };

    useImperativeHandle(
        setRef("interpreterSheet"),
        () => ({
            getItems: () => stateData,
            getName: () => stateNameUp,
        }),
        [stateData, stateNameUp]
    );

    // const handleDownload = async () => {
    //     const worksheet = XLSX.utils.json_to_sheet(stateXLSX);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //     const excelBuffer = XLSX.write(workbook, {
    //         bookType: "xlsx",
    //         type: "array",
    //     });
    //     const blob = new Blob([excelBuffer], {
    //         type: "application/octet-stream",
    //     });
    //     saveAs(
    //         blob,
    //         `${refForm.current?.watch("sheetName")}-${refForm.current?.watch(
    //             "column"
    //         )}.xlsx`
    //     );
    // }

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
                                    onClick={onClean}
                                    disabled={stateLoading || !file.file}
                                >
                                    {t("clean")}
                                </Button>
                                <FButtonSubmit
                                    label={t("convert")}
                                    disabled={stateLoading || !file.file}
                                />
                                {/* <Button type="button" onClick={handleDownload}>
                                    Download
                                </Button> */}
                            </div>
                        </div>
                    </BaseForm>
                </div>
                <Separator />
                <DataTable
                    columns={stateColumns}
                    data={stateData.rows}
                    total={stateData.total}
                    limit={10}
                    name="interpreter"
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
