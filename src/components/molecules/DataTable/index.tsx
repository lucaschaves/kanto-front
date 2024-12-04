import { IPropsOutletContext, REF_TOOLBAR } from "@/Layout";
import { IRefToolbar, REF_TOOLBAR_FORM } from "@/Layout/Toolbar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Calendar,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    Checkbox,
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    IBaseFormRef,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Separator,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components";
import {
    CONSTANT_COLUMNS_ORDER,
    CONSTANT_COLUMNS_VIEW,
    CONSTANT_NUMBER_ROWS,
    STATUS_ENUM,
} from "@/constants";
import { useDynamicRefs, useSorting } from "@/hooks";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import {
    camelCaseAndNormalize,
    convertJsonToCSV,
    downloadBlobAsFile,
    messageError,
    messageSuccess,
    sleep,
} from "@/utils";
import {
    CalendarIcon,
    CheckCircledIcon,
    ChevronDownIcon,
    Cross2Icon,
    DoubleArrowDownIcon,
    DownloadIcon,
    DragHandleDots2Icon,
    PaperPlaneIcon,
    Pencil1Icon,
    PlusIcon,
    ReloadIcon,
    TrashIcon,
    UploadIcon,
} from "@radix-ui/react-icons";
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    ColumnOrderState,
    ColumnPinningState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircleIcon, FileDownIcon } from "lucide-react";
import Papa from "papaparse";
import {
    CSSProperties,
    SetStateAction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    useLocation,
    useNavigate,
    useOutletContext,
    useSearchParams,
} from "react-router-dom";

interface IPagination {
    skip: number;
    limit: number;
}
interface ISort {
    field: string;
    order: string;
}

export interface IOnRefresh {
    pagination: IPagination;
    sort: ISort;
    filters?: any;
}

interface IPropsDataTable<T> {
    name: string;
    urlMethod?: string;
    nameDefault?: string;
    filter_name?: string;
    navigateForm?: string;
    columns: ColumnDef<T>[];
    columnsHidden?: VisibilityState;
    data: T[];
    total: number;
    limit?: number;
    loading?: boolean;
    onAction?: (ids: string[]) => void;
    onDelete?: (ids: string[]) => void;
    onRefresh?: (props: IOnRefresh) => void;
    canRefresh?: boolean;
    canNavigate?: boolean;
    canAdd?: boolean;
    canEdit?: boolean;
    canStatus?: boolean;
    canExportCsv?: boolean;
    canImportCsv?: boolean;
    canImportCatalog?: boolean;
    canDelete?: boolean;
    canColumns?: boolean;
    canApprove?: boolean;
    className?: string;
    classNameTable?: string;
    canExportTemplateCsv?: boolean;
}

export interface IRefDataTable {
    refresh: (props?: any) => void;
    getColumns: () => any[];
    hiddeColumns: (hiddenCols: VisibilityState) => void;
}

interface IHistory {
    show: boolean;
    values?: {
        id: number;
        idElement: string;
        value:
            | {
                  value?: string;
              }
            | { name?: string }[];
        createdAt: string;
        updatedAt: string;
        usersId: number;
    }[];
}

interface ICatalogCsv {
    adicionadoALoja: string;
    anoEstoque: string;
    anoVenda: string;
    custoDeEstoque: string;
    dataAdicaoLoja: string;
    dataDeVenda: string;
    dataEntradaEstoque: string;
    enderecoNoEstoque: string;
    lucroBruto: string;
    mesEstoque: string;
    mesVenda: string;
    nomeProduto: string;
    pVFinal: string;
    pVML: string;
    pVSite: string;
    plataforma: string;
    sKU: string;
    "vendaML?": string;
    "vendido?": string;
}

const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned == "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
        isPinned == "right" && column.getIsFirstColumn("right");

    return {
        boxShadow: isLastLeftPinnedColumn
            ? "-4px 0 4px -4px gray inset"
            : isFirstRightPinnedColumn
            ? "4px 0 4px -4px gray inset"
            : undefined,
        left: isPinned == "left" ? `${column.getStart("left")}px` : undefined,
        right:
            isPinned == "right" ? `${column.getAfter("right")}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? "sticky" : "relative",
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    };
};

const DropdownMenuDragInDrop = (props: {
    items: any[];
    onChangeColumns: (cols: any[]) => void;
}) => {
    const { items, onChangeColumns } = props;

    const { t } = useTranslation();

    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);

    const [stateItems, setItems] = useState(items);

    const dragStart = (e: any) => {
        dragItem.current = Number(e.target.id);
    };

    const dragEnter = (e: any) => {
        dragOverItem.current = Number(e.currentTarget.id);
    };

    const drop = () => {
        const copyListItems = [...stateItems];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setItems(copyListItems);
        onChangeColumns(copyListItems);
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="w-auto sm:w-auto max-w-48">
                <Button variant="outline" className="ml-auto">
                    {`${t("columns")} `}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {stateItems.map((item, index) => (
                    <div
                        key={item.id}
                        id={String(index)}
                        className="flex w-full items-center justify-start gap-2 capitalize px-2 py-0.5"
                        onDragStart={dragStart}
                        onDragEnter={dragEnter}
                        onDragEnd={drop}
                        draggable
                    >
                        <DragHandleDots2Icon />
                        <Checkbox
                            checked={item.getIsVisible()}
                            onCheckedChange={(value) =>
                                item.toggleVisibility(!!value)
                            }
                        />
                        <span>{t(item.id)}</span>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const DataTable = <T,>(props: IPropsDataTable<T>) => {
    const {
        name,
        nameDefault,
        columns,
        columnsHidden,
        filter_name,
        navigateForm,
        data,
        total,
        loading = false,
        onAction,
        onDelete = () => ({}),
        onRefresh = () => ({}),
        canRefresh = true,
        canAdd = true,
        canEdit = true,
        canDelete = true,
        canColumns = true,
        canNavigate = false,
        canExportCsv = false,
        canImportCsv = false,
        canImportCatalog = false,
        canStatus = false,
        canExportTemplateCsv = false,
        canApprove = false,
        className = "",
        classNameTable = "",
        urlMethod,
        limit,
    } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const { t } = useTranslation();
    const { openToolbar } = useOutletContext<IPropsOutletContext>();

    const [getRef, setRef] = useDynamicRefs();

    const refInit = useRef(true);
    const refFile = useRef<HTMLInputElement>(null);
    const refFileCatalog = useRef<HTMLInputElement>(null);

    const [stateLimit, setLimit] = useState<number>(() => {
        const numberRows = JSON.parse(
            window.localStorage.getItem(CONSTANT_NUMBER_ROWS) || "{}"
        );
        if (numberRows && numberRows[name]) {
            try {
                return Number(numberRows[name]);
            } catch (err) {}
        }
        return limit || 20;
    });
    const [stateFilterDefault, setFilterDefault] = useState<{
        filter: string;
        value: any;
    }>({
        filter: "id",
        value: "",
    });
    const [stateFilterType, setFilterType] = useState("number");

    const skip = searchParams?.get("page")
        ? Number(searchParams?.get("page")) * stateLimit
        : 0;
    const { sorting, onSortingChange, field, order } = useSorting({
        columns,
    });

    const [stateHistory, setHistory] = useState<IHistory>({
        show: false,
    });
    const [isDelete, setDelete] = useState(false);
    const [isApprove, setApprove] = useState(false);
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: [],
        right: [],
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        () => {
            const oldsCols = JSON.parse(
                window.localStorage.getItem(CONSTANT_COLUMNS_VIEW) || "{}"
            );
            if (oldsCols && oldsCols[name]) {
                try {
                    return oldsCols[name];
                } catch (err) {}
            }
            return {
                createdAt: false,
                updatedAt: false,
                ...columnsHidden,
                select: true,
            };
        }
    );
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() => {
        const oldsCols = JSON.parse(
            window.localStorage.getItem(CONSTANT_COLUMNS_ORDER) || "{}"
        );
        if (oldsCols && oldsCols[name]) {
            try {
                return oldsCols[name];
            } catch (err) {}
        }
        return [];
    });
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [stateRowFocus, setRowFocus] = useState<any>({});
    const [stateQuestionSold, setQuestionSold] = useState({
        show: false,
        value: "",
        ids: [] as any[],
    });
    const [stateQuestionStock, setQuestionStock] = useState({
        show: false,
        value: "",
        ids: [] as any[],
    });

    const handleSort = (propsV: SetStateAction<SortingState>) => {
        onSortingChange(propsV);
        const defPagination = {
            pagination: { skip, limit: stateLimit },
            sort: { field, order },
        };
        setSearchParams((prev) => {
            prev.set("page", (skip / stateLimit)?.toString());
            return prev;
        });
        onRefresh(defPagination);
    };

    const table = useReactTable({
        data,
        columns,
        onSortingChange: handleSort,
        onColumnFiltersChange: setColumnFilters,
        // onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: (e: any) => {
            const oldsCols = JSON.parse(
                window.localStorage.getItem(CONSTANT_COLUMNS_VIEW) || "{}"
            );
            const changeCol = e();
            window.localStorage.setItem(
                CONSTANT_COLUMNS_VIEW,
                JSON.stringify({
                    ...oldsCols,
                    [name]: {
                        ...columnVisibility,
                        ...changeCol,
                        select: true,
                    },
                })
            );
            setColumnVisibility(e);
        },
        onRowSelectionChange: setRowSelection,
        onColumnPinningChange: setColumnPinning,
        manualFiltering: !!limit ? false : true,
        manualPagination: !!limit ? false : true,
        manualSorting: !!limit ? false : true,
        rowCount: total,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            columnPinning,
            // pagination,
            columnOrder,
        },
    });

    const handleAddOrEditDialog = (id?: string) => {
        if (id) {
            navigate(`${location.pathname}/edit?id=${id}`);
        } else {
            navigate(`${location.pathname}/new`);
        }
    };

    const handleRowClick = (row: any) => {
        setRowFocus(row?.original);
    };

    const toggleDelete = () => {
        if (
            Object.values(rowSelection).length > 0 ||
            Object.values(stateRowFocus).length > 0
        ) {
            setDelete(true);
        } else {
            messageError({
                message: t("selectALine"),
            });
        }
    };

    const handleDelete = () => {
        if (Object.values(rowSelection).length) {
            const rowsIds = table
                .getSelectedRowModel()
                .rows.map((r: any) => r.original.id);
            onDelete(rowsIds);
        } else if (Object.values(stateRowFocus).length) {
            onDelete([stateRowFocus?.id]);
        }
    };

    const handleRefresh = (filters?: any) => {
        onRefresh({
            pagination: { skip, limit: stateLimit },
            sort: { field, order },
            filters,
        });
    };

    const handleFilterCell = async (propsV: any) => {
        const refToolbar = getRef<IRefToolbar>(REF_TOOLBAR);
        refToolbar?.current?.toggleFilters &&
            refToolbar?.current?.toggleFilters(true);
        await sleep(50);
        const value =
            typeof propsV.value === "object"
                ? propsV.value?.map((v: any) => v?.name)?.join(",")
                : propsV.value;
        const refFormToolbar = getRef<IBaseFormRef>(REF_TOOLBAR_FORM);
        refFormToolbar.current?.reset({
            [`filter_${propsV.column}`]: value,
        });
        await sleep(50);
        refFormToolbar.current?.submit();
    };

    const handleHistoryCell = async (id: string, col: string) => {
        const { success, data } = await getApi({
            url: `/log/${nameDefault || name}.${id}.${col}`,
        });
        if (success) {
            setHistory({
                show: true,
                values: data?.log,
            });
        }
    };

    const handleNavigateTo = (id: string) => {
        navigate(`${navigateForm}?${filter_name}=${id}`);
    };

    const handleExportCSV = () => {
        const dataFormat: any[] = [];
        data.forEach((row: any) => {
            let dataRow = {};
            columns.forEach((col: any) => {
                const findKey = Object.keys(columnVisibility).find(
                    (d) => d === col.accessorKey
                );
                if (col.accessorKey && !findKey) {
                    dataRow = {
                        ...dataRow,
                        [t(col.accessorKey)]: row[col.accessorKey],
                    };
                } else if (findKey && columnVisibility[findKey]) {
                    dataRow = {
                        ...dataRow,
                        [t(col.accessorKey)]: row[col.accessorKey],
                    };
                }
            });
            dataFormat.push(dataRow);
        });
        const con = convertJsonToCSV(dataFormat);
        downloadBlobAsFile(con, name);
    };

    const handleExportTemplateCSV = () => {
        const dataFormat: any[] = [];
        Array({ length: 1 }).forEach(() => {
            let dataRow = {};
            columns.forEach((col: any) => {
                if (col.accessorKey !== "id") {
                    const findKey = Object.keys(columnVisibility).find(
                        (d) => d === col.accessorKey
                    );
                    if (col.accessorKey && !findKey) {
                        dataRow = {
                            ...dataRow,
                            [t(col.accessorKey)]: "",
                        };
                    } else if (findKey && columnVisibility[findKey]) {
                        dataRow = {
                            ...dataRow,
                            [t(col.accessorKey)]: "",
                        };
                    }
                }
            });
            dataFormat.push(dataRow);
        });
        const con = convertJsonToCSV(dataFormat);
        downloadBlobAsFile(con, name);
    };

    const handleImportCSV = async (file: File) => {
        Papa.parse(file, {
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: async (res) => {
                const formatCols: any[] = [];
                res.meta.fields?.forEach((key) => {
                    const findCol = columns.find(
                        (col: any) => t(col.accessorKey) === key
                    ) as any;
                    formatCols.push({
                        field: key,
                        fieldName: findCol?.accessorKey,
                    });
                });
                const formatData: any[] = [];
                res.data.forEach((row: any) => {
                    let dataRow: any = {};
                    Object.keys(row).forEach((key: any) => {
                        const keyData = formatCols.find(
                            (col) => col.field === key
                        );
                        dataRow = {
                            ...dataRow,
                            [keyData.fieldName]: row[key],
                        };
                    });
                    formatData.push(dataRow);
                });
                const { success } = await postApi({
                    url: nameDefault || name,
                    body: { data: formatData },
                });
                if (success) {
                    messageSuccess({ message: "Sucesso" });
                }
            },
        });
        if (refFile.current?.value) {
            refFile.current.type = "text";
            refFile.current.value = "";
            refFile.current.type = "file";
        }
    };

    const handleImportCatalog = async (file: File) => {
        Papa.parse(file, {
            delimiter: "\t",
            header: true,
            skipEmptyLines: true,
            complete: async (res) => {
                const formatCols: any[] = [];
                res.meta.fields?.forEach((key) => {
                    formatCols.push({
                        field: key,
                        fieldName: camelCaseAndNormalize(key),
                    });
                });
                const formatData: ICatalogCsv[] = [];

                res.data.forEach((row: any) => {
                    let dataRow: any = {};
                    if (
                        row["Endereço no Estoque"]?.toLowerCase() === "vendido"
                    ) {
                        Object.keys(row).forEach((key: string) => {
                            const col = formatCols.find((f) => f.field === key);
                            dataRow = {
                                ...dataRow,
                                [col.fieldName]: row[col.field],
                            };
                        });
                        formatData.push(dataRow);
                    }
                });
                let successAll = true;
                const countSend = 100;
                const count = Math.ceil(formatData.length / countSend);
                let indexCount = 0;
                for (let index = 0; index < count; index++) {
                    const element = formatData.slice(
                        indexCount,
                        indexCount + countSend
                    );
                    const { success } = await postApi({
                        url: "/catalogs/import",
                        body: {
                            data: element,
                        },
                    });
                    indexCount += countSend;
                    if (!success) {
                        successAll = false;
                    }
                    await sleep(500);
                }
                if (successAll) {
                    messageSuccess({ message: "Importado com sucesso" });
                }
            },
        });
        if (refFileCatalog.current?.value) {
            refFileCatalog.current.type = "text";
            refFileCatalog.current.value = "";
            refFileCatalog.current.type = "file";
        }
    };

    const getColumns = () => {
        return columns;
    };

    const handleActionStatus = async (st: string, ids: number[]) => {
        let idsState = ids;
        if (ids.length === 0) {
            if (stateRowFocus?.id) {
                idsState = [stateRowFocus?.id];
            } else {
                messageError({
                    message: "Selecione ao menos uma linha",
                });
                return;
            }
        }

        if (st === "vendido") {
            setQuestionSold({ show: true, value: "", ids: idsState });
        } else if (st === "estoque") {
            setQuestionStock({ show: true, value: "", ids: idsState });
        } else {
            const { success } = await putApi({
                url: urlMethod || name,
                body: {
                    ids: idsState,
                    status: st,
                },
            });
            if (success) {
                messageSuccess({
                    message: "Status alterado com sucesso",
                });
                handleRefresh();
            }
        }
    };

    const handleStatusSold = async () => {
        const { success } = await putApi({
            url: urlMethod || name,
            body: {
                ids: stateQuestionSold.ids,
                status: "vendido",
                plataform: stateQuestionSold.value,
            },
        });
        if (success) {
            setQuestionSold({ show: false, value: "", ids: [] });
            messageSuccess({
                message: "Status alterado com sucesso",
            });
            handleRefresh();
        }
    };

    const handleStatusStock = async () => {
        const { success } = await putApi({
            url: urlMethod || name,
            body: {
                ids: stateQuestionStock.ids,
                status: "estoque",
                addressInStock: stateQuestionStock.value,
            },
        });
        if (success) {
            setQuestionStock({ show: false, value: "", ids: [] });
            messageSuccess({
                message: "Status alterado com sucesso",
            });
            handleRefresh();
        }
    };

    const hiddeColumns = (hiddenCols: VisibilityState) => {
        const oldsCols = JSON.parse(
            window.localStorage.getItem(CONSTANT_COLUMNS_VIEW) || "{}"
        );
        window.localStorage.setItem(
            CONSTANT_COLUMNS_VIEW,
            JSON.stringify({
                ...oldsCols,
                [name]: hiddenCols,
            })
        );
        setColumnVisibility(hiddenCols);
    };

    const handleApprove = async () => {
        let idsState = table.getSelectedRowModel().rows.map((r) => r.original);
        if (idsState.length === 0) {
            if (stateRowFocus?.id) {
                idsState = [stateRowFocus];
            } else {
                messageError({
                    message: "Selecione ao menos uma linha",
                });
                return;
            }
        }
        const dataProcuts: any[] = [];
        idsState.forEach((t: any) => {
            if (t?.game) {
                dataProcuts.push({
                    name: t.game?.name,
                    status: "recebimento",
                    receiptDate: new Date(),
                    images: t?.images,
                    catalog: 1,
                });
            } else if (t?.console) {
                dataProcuts.push({
                    name: t.console?.name,
                    status: "recebimento",
                    receiptDate: new Date(),
                    images: t?.images,
                    catalog: 1,
                });
            }
        });

        const { success } = await postApi({
            url: "/products",
            body: {
                data: dataProcuts,
                skuGenerate: true,
            },
        });
        if (success) {
            messageSuccess({
                message: "Produtos enviados com sucesso",
            });
        }
    };

    const onChangeOrderColumns = (columnsOr: any[]) => {
        const idsCols = columnsOr.map((c) => c.id);
        const oldsCols = JSON.parse(
            window.localStorage.getItem(CONSTANT_COLUMNS_ORDER) || "{}"
        );
        window.localStorage.setItem(
            CONSTANT_COLUMNS_ORDER,
            JSON.stringify({
                ...oldsCols,
                [name]: ["select", ...idsCols],
            })
        );
        setColumnOrder(["select", ...idsCols]);
    };

    const getItemsDrop = () => {
        const itemsCan = table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .filter((column) => column.id !== "select");
        const newItemsDrop: any[] = [];
        if (columnOrder.length) {
            columnOrder.forEach((col) => {
                const findCan = itemsCan.find((c) => c.id === col);
                if (findCan) {
                    newItemsDrop.push(findCan);
                }
            });
            return newItemsDrop;
        }
        return itemsCan;
    };

    const getTypeFilter = useCallback(
        (f: string) => {
            const findColumns: any = columns?.find(
                (c: any) => c.accessorKey === f
            );
            if (findColumns?.typeFilter) {
                setFilterType(findColumns.typeFilter);
            } else {
                setFilterType("text");
            }
        },
        [columns]
    );

    useEffect(() => {
        if (refInit.current) {
            refInit.current = false;
            return;
        }
        setSearchParams((prev) => {
            prev.set("page", (skip / stateLimit)?.toString());
            return prev;
        });
        onRefresh({
            pagination: { skip, limit: stateLimit },
            sort: { field, order },
        });
    }, []);

    useEffect(() => {
        if (refInit.current) {
            refInit.current = false;
            return;
        }
    }, [stateLimit]);

    useImperativeHandle(
        setRef(name),
        () => ({
            refresh: handleRefresh,
            getColumns,
            hiddeColumns,
        }),
        [handleRefresh, getColumns, hiddeColumns]
    );

    return (
        <>
            <div
                className={cn(
                    "w-full",
                    "overflow-hidden",
                    "px-1",
                    "max-w-[calc(100svw-50px)]",
                    "sm:max-w-[calc(100svw-140px)]",
                    className
                )}
            >
                <div
                    className={cn(
                        "flex",
                        "sm:flex-row",
                        "items-center",
                        "py-4",
                        "gap-2",
                        "justify-between"
                    )}
                >
                    <div
                        className={cn(
                            "flex",
                            "flex-row",
                            "items-center",
                            "justify-start",
                            "gap-2",
                            "w-full",
                            "md:flex-row",
                            "relative",
                            "max-w-md"
                        )}
                    >
                        <Select
                            onValueChange={(e) => {
                                setFilterDefault({ filter: e, value: "" });
                                getTypeFilter(e);
                            }}
                            value={stateFilterDefault.filter}
                        >
                            <SelectTrigger className="w-auto sm:w-auto max-w-48">
                                <SelectValue placeholder={`${t("filter")} `} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Filtros</SelectLabel>
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .filter(
                                            (column) =>
                                                ![
                                                    "type",
                                                    "factory",
                                                    "tagsDefault",
                                                    "select",
                                                ].includes(column.id)
                                        )
                                        .map((column) => (
                                            <SelectItem
                                                key={column.id}
                                                className="capitalize"
                                                value={column.id}
                                            >
                                                {t(column.id)}
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {["number"].includes(stateFilterType) ? (
                            <Input
                                placeholder="buscar..."
                                value={stateFilterDefault.value}
                                onChange={(e) =>
                                    setFilterDefault((p) => ({
                                        ...p,
                                        value: e.target.value,
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        navigate(
                                            `${location.pathname}?filter_${stateFilterDefault.filter}=${stateFilterDefault.value}`
                                        );
                                    }
                                }}
                                type="number"
                            />
                        ) : ["boolean"].includes(stateFilterType) ? (
                            <Checkbox
                                checked={stateFilterDefault.value}
                                onCheckedChange={(e) => {
                                    setFilterDefault((p) => ({
                                        ...p,
                                        value: e,
                                    }));
                                    navigate(
                                        `${location.pathname}?filter_${stateFilterDefault.filter}=${e}`
                                    );
                                }}
                            />
                        ) : ["date"].includes(stateFilterType) ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !stateFilterDefault.value &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {stateFilterDefault.value ? (
                                            <>
                                                {format(
                                                    stateFilterDefault.value,
                                                    "dd LLL, y",
                                                    {
                                                        locale: ptBR,
                                                    }
                                                )}
                                            </>
                                        ) : (
                                            <span>Selecione a data</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        initialFocus
                                        selected={stateFilterDefault.value}
                                        onSelect={(e: any) => {
                                            setFilterDefault((prev) => ({
                                                ...prev,
                                                value: e,
                                            }));
                                            navigate(
                                                `${location.pathname}?filter_${
                                                    stateFilterDefault.filter
                                                }=${format(e, "yyyy-MM-dd")}`
                                            );
                                        }}
                                        mode="single"
                                    />
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Input
                                placeholder="buscar..."
                                value={stateFilterDefault.value}
                                onChange={(e) =>
                                    setFilterDefault((p) => ({
                                        ...p,
                                        value: e.target.value,
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        navigate(
                                            `${location.pathname}?filter_${stateFilterDefault.filter}=${stateFilterDefault.value}`
                                        );
                                    }
                                }}
                            />
                        )}
                        <Button
                            size="icon"
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFilterDefault((prev) => ({
                                    ...prev,
                                    value: "",
                                }));
                                navigate(location.pathname);
                            }}
                            className="min-w-10"
                        >
                            <Cross2Icon />
                        </Button>
                    </div>
                    <div
                        className={cn(
                            "flex",
                            "flex-row",
                            "items-center",
                            "justify-between",
                            "gap-2",
                            "w-full",
                            "md:flex-row",
                            "md:justify-end"
                        )}
                    >
                        {canColumns ? (
                            <DropdownMenuDragInDrop
                                items={getItemsDrop()}
                                onChangeColumns={onChangeOrderColumns}
                            />
                        ) : (
                            <div></div>
                        )}
                        <div className="flex items-center gap-2">
                            {canRefresh ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleRefresh()}
                                            >
                                                <ReloadIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Recarregar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <></>
                            )}
                            {/* <Separator
                                orientation="vertical"
                                className="h-10"
                            /> */}
                            {canAdd || canEdit || canDelete ? (
                                <Separator
                                    orientation="vertical"
                                    className="h-10"
                                />
                            ) : (
                                <></>
                            )}
                            {canAdd ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleAddOrEditDialog()
                                                }
                                                data-rule-component="rule"
                                                data-rule-component-id={`${name}.new`}
                                            >
                                                <PlusIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Adicionar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <></>
                            )}
                            {canEdit ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    if (
                                                        Object.values(
                                                            stateRowFocus
                                                        ).length
                                                    ) {
                                                        handleAddOrEditDialog(
                                                            stateRowFocus?.id
                                                        );
                                                        return;
                                                    }
                                                    messageError({
                                                        message:
                                                            t("selectALine"),
                                                    });
                                                }}
                                                data-rule-component="rule"
                                                data-rule-component-id={`${name}.edit`}
                                            >
                                                <Pencil1Icon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <></>
                            )}
                            {canDelete ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={toggleDelete}
                                                data-rule-component="rule"
                                                data-rule-component-id={`${name}.delete`}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Deletar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <></>
                            )}

                            {canApprove ||
                            canStatus ||
                            canNavigate ||
                            onAction ? (
                                <Separator
                                    orientation="vertical"
                                    className="h-10"
                                />
                            ) : (
                                <></>
                            )}
                            {canApprove ? (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    data-rule-component="rule"
                                    data-rule-component-id={`${name}.approve`}
                                    onClick={() => setApprove(true)}
                                >
                                    <CheckCircledIcon />
                                </Button>
                            ) : (
                                <></>
                            )}
                            {canStatus ? (
                                <Popover>
                                    <PopoverTrigger>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            data-rule-component="rule"
                                            data-rule-component-id={`${name}.status`}
                                        >
                                            <DoubleArrowDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="flex flex-col gap-2">
                                        <span className="text-left font-semibold text-sm">
                                            Enviar linhas selecionadas para:
                                        </span>
                                        <Separator className="w-full" />
                                        <div className="flex flex-col">
                                            {STATUS_ENUM.filter((v) => {
                                                if (
                                                    !v.link.includes(
                                                        location.pathname
                                                    )
                                                ) {
                                                    return v;
                                                }
                                            }).map((v) => (
                                                <Button
                                                    key={v.id}
                                                    className={cn(
                                                        "w-auto",
                                                        "px-4",
                                                        "py-2",
                                                        "gap-2",
                                                        "justify-between"
                                                    )}
                                                    onClick={() => {
                                                        const rowsIds = table
                                                            .getSelectedRowModel()
                                                            .rows.map(
                                                                (r: any) =>
                                                                    r.original
                                                                        .id
                                                            );
                                                        handleActionStatus(
                                                            v.id,
                                                            rowsIds
                                                        );
                                                    }}
                                                    variant="ghost"
                                                >
                                                    <span
                                                        className={cn(
                                                            "flex-1",
                                                            "text-left"
                                                        )}
                                                    >
                                                        {t(v.name)}
                                                    </span>
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <></>
                            )}
                            {canNavigate ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleNavigateTo(
                                                        stateRowFocus.id
                                                    )
                                                }
                                                data-rule-component="rule"
                                                data-rule-component-id={`${name}.navigate`}
                                            >
                                                <PaperPlaneIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Navegar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <></>
                            )}
                            {onAction ? (
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        const rowsIds = table
                                            .getSelectedRowModel()
                                            .rows.map(
                                                (r: any) => r.original.id
                                            );
                                        onAction(rowsIds);
                                    }}
                                    data-rule-component="rule"
                                    data-rule-component-id={`${name}.new`}
                                    className="flex gap-1"
                                >
                                    <UploadIcon />
                                    Importar
                                </Button>
                            ) : (
                                <></>
                            )}
                            {canExportTemplateCsv ||
                            canExportCsv ||
                            canImportCsv ||
                            canImportCatalog ? (
                                <Separator
                                    orientation="vertical"
                                    className="h-10"
                                />
                            ) : (
                                <></>
                            )}
                            {canExportTemplateCsv ? (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleExportTemplateCSV()
                                                    }
                                                    data-rule-component="rule"
                                                    data-rule-component-id={`${name}.exporttemplate`}
                                                >
                                                    <FileDownIcon size={15} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Template</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            ) : (
                                <></>
                            )}
                            {canExportCsv ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleExportCSV()
                                                }
                                                data-rule-component="rule"
                                                data-rule-component-id={`${name}.export`}
                                            >
                                                <DownloadIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Exportar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <></>
                            )}
                            {canImportCsv ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    refFile.current?.click()
                                                }
                                                data-rule-component="rule"
                                                data-rule-component-id={`${name}.import`}
                                            >
                                                <UploadIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Importar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <></>
                            )}
                            {canImportCatalog ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    refFileCatalog.current?.click()
                                                }
                                                data-rule-component="rule"
                                                data-rule-component-id={`${name}.import`}
                                            >
                                                <UploadIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Importar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className={cn(
                        "rounded-md",
                        "border",
                        "overflow-x-auto",
                        "overflow-y-hidden",
                        openToolbar
                            ? cn(
                                  "max-w-[calc(100svw-350px)]",
                                  "sm:max-w-[calc(100svw-465px)]"
                              )
                            : cn(
                                  "max-w-[calc(100svw-60px)]",
                                  "sm:max-w-[calc(100svw-150px)]"
                              ),
                        classNameTable
                    )}
                >
                    <div
                        className={cn(
                            "w-full",
                            "max-h-[calc(100svh-230px)]",
                            "overflow-x-auto"
                        )}
                        style={{
                            height: 44 * Number(stateLimit),
                        }}
                    >
                        <Table
                            className={cn(
                                "rounded-md",
                                "border",
                                "overflow-x-auto",
                                "overflow-y-hidden",
                                openToolbar
                                    ? cn(
                                          "max-w-[calc(100svw-350px)]",
                                          "sm:max-w-[calc(100svw-465px)]"
                                      )
                                    : cn(
                                          "max-w-[calc(100svw-60px)]",
                                          "sm:max-w-[calc(100svw-150px)]"
                                      ),
                                classNameTable
                            )}
                        >
                            <TableHeader className="sticky top-0 z-50 bg-slate-100">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const styleColumn =
                                                getCommonPinningStyles(
                                                    header.column
                                                );
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className={cn(
                                                        header.column.id ===
                                                            "id"
                                                            ? "w-[50px] max-w-[50px]"
                                                            : ""
                                                    )}
                                                    style={
                                                        header.column.id ===
                                                        "id"
                                                            ? {
                                                                  ...styleColumn,
                                                                  width: undefined,
                                                              }
                                                            : styleColumn
                                                    }
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <TableRow key={`loading-${i}`}>
                                            {table
                                                .getAllColumns()
                                                .map((col) => {
                                                    return (
                                                        <TableHead
                                                            key={`loading-${col.id}`}
                                                        >
                                                            <Skeleton className="h-4 w-full" />
                                                        </TableHead>
                                                    );
                                                })}
                                        </TableRow>
                                    ))
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                "selected"
                                            }
                                            onClick={() => handleRowClick(row)}
                                            onDoubleClick={() =>
                                                handleAddOrEditDialog(
                                                    (row.original as any)?.id
                                                )
                                            }
                                            className={cn(
                                                stateRowFocus?.id ==
                                                    (row?.original as any)?.id
                                                    ? cn(
                                                          "!bg-blue-300",
                                                          "!hover:bg-blue-200"
                                                      )
                                                    : "border-b-slate-300"
                                            )}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => {
                                                    const styleColumn =
                                                        getCommonPinningStyles(
                                                            cell.column
                                                        );

                                                    return (
                                                        <TableCell
                                                            key={cell.id}
                                                            style={
                                                                cell.column
                                                                    .id === "id"
                                                                    ? {
                                                                          ...styleColumn,
                                                                          width: undefined,
                                                                      }
                                                                    : styleColumn
                                                            }
                                                            className="text-nowrap"
                                                        >
                                                            {[
                                                                "id",
                                                                "select",
                                                            ].includes(
                                                                cell.column.id
                                                            ) ? (
                                                                <>
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <ContextMenu>
                                                                    <ContextMenuTrigger>
                                                                        {flexRender(
                                                                            cell
                                                                                .column
                                                                                .columnDef
                                                                                .cell,
                                                                            cell.getContext()
                                                                        )}
                                                                    </ContextMenuTrigger>
                                                                    <ContextMenuContent className="w-64">
                                                                        {canNavigate ? (
                                                                            <ContextMenuItem
                                                                                onClick={() =>
                                                                                    handleNavigateTo(
                                                                                        (
                                                                                            cell
                                                                                                .row
                                                                                                .original as any
                                                                                        )
                                                                                            .id
                                                                                    )
                                                                                }
                                                                            >
                                                                                {t(
                                                                                    "navigateTo"
                                                                                )}
                                                                            </ContextMenuItem>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                        <ContextMenuItem
                                                                            onClick={() =>
                                                                                handleHistoryCell(
                                                                                    (
                                                                                        cell
                                                                                            .row
                                                                                            .original as any
                                                                                    )
                                                                                        .id,
                                                                                    cell
                                                                                        .column
                                                                                        .id
                                                                                )
                                                                            }
                                                                        >
                                                                            {t(
                                                                                "changeHistory"
                                                                            )}
                                                                        </ContextMenuItem>
                                                                        <ContextMenuItem
                                                                            onClick={() =>
                                                                                handleFilterCell(
                                                                                    {
                                                                                        column: cell
                                                                                            .column
                                                                                            .id,
                                                                                        value: cell.getValue(),
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            {t(
                                                                                "filterByCellValue"
                                                                            )}
                                                                        </ContextMenuItem>
                                                                    </ContextMenuContent>
                                                                </ContextMenu>
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            Sem resultados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-2 py-2">
                    <div className="hidden sm:flex flex-1 text-sm text-muted-foreground items-center gap-2">
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length}{" "}
                        {t("selectedLines")}
                        <Select
                            onValueChange={async (e) => {
                                const oldLimits = JSON.parse(
                                    window.localStorage.getItem(
                                        CONSTANT_NUMBER_ROWS
                                    ) || "{}"
                                );
                                window.localStorage.setItem(
                                    CONSTANT_NUMBER_ROWS,
                                    JSON.stringify({
                                        ...oldLimits,
                                        [name]: e?.toString(),
                                    })
                                );
                                setLimit(Number(e));
                                await sleep(300);
                                onRefresh({
                                    pagination: {
                                        skip,
                                        limit: Number(e),
                                    },
                                    sort: { field, order },
                                });
                            }}
                            value={stateLimit?.toString()}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Items por página</SelectLabel>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-x-2 w-full flex items-center sm:w-auto justify-between sm:justify-end">
                        <span className="text-sm text-muted-foreground">
                            {t("total")} {total} -
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {t("page")} {skip / stateLimit + 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSearchParams((prev) => {
                                    prev.set(
                                        "page",
                                        (
                                            Number(
                                                searchParams.get("page") || 1
                                            ) - 1
                                        )?.toString()
                                    );
                                    return prev;
                                });
                            }}
                            disabled={
                                Number(searchParams.get("page") || 0) === 0
                            }
                        >
                            {t("back")}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSearchParams((prev) => {
                                    prev.set(
                                        "page",
                                        (
                                            Number(
                                                searchParams.get("page") || 0
                                            ) + 1
                                        )?.toString()
                                    );
                                    return prev;
                                });
                            }}
                            disabled={
                                (Number(searchParams.get("page") || 0) + 1) *
                                    stateLimit >=
                                total
                            }
                        >
                            {t("next")}
                        </Button>
                    </div>
                </div>
            </div>
            <AlertDialog open={isApprove} onOpenChange={setApprove}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <CheckCircleIcon className="h-5 w-5" />
                            Deseja aprovar?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Ao aprovar os items eles serão encaminhados para os
                            produtos
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/80"
                            onClick={handleApprove}
                        >
                            Aprovar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={isDelete} onOpenChange={setDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <TrashIcon className="h-5 w-5" />
                            Deseja remover?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Ao remover esse produto ele ficará indisponivel para
                            uso
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/80"
                            onClick={handleDelete}
                        >
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog
                open={stateHistory.show}
                onOpenChange={(p) => setHistory({ show: p })}
                modal
            >
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{t("changeHistory")}</DialogTitle>
                    </DialogHeader>
                    <div
                        className={cn(
                            "flex",
                            "flex-col",
                            "gap-2",
                            "max-w-sm",
                            "items-center"
                        )}
                    >
                        <Separator />
                        <Carousel
                            className="max-w-[250px]"
                            opts={{
                                startIndex: stateHistory.values?.length,
                            }}
                        >
                            <CarouselContent className="w-full">
                                {stateHistory?.values?.map((log) => {
                                    return (
                                        <CarouselItem key={log.id}>
                                            <div
                                                className={cn(
                                                    "flex",
                                                    "flex-col",
                                                    "gap-2"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex",
                                                        "gap-2",
                                                        "items-center"
                                                    )}
                                                >
                                                    <Avatar>
                                                        <AvatarImage
                                                            src="https://github.com/shadcn.png"
                                                            alt="@shadcn"
                                                        />
                                                        <AvatarFallback>
                                                            LC
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div
                                                        className={cn(
                                                            "flex",
                                                            "flex-col",
                                                            "gap-1"
                                                        )}
                                                    >
                                                        <h3 className="font-semibold">
                                                            Lucas Chaves
                                                        </h3>
                                                        <span className="text-sm">
                                                            {log?.createdAt ? (
                                                                format(
                                                                    log?.createdAt,
                                                                    "PPP, pp",
                                                                    {
                                                                        locale: ptBR,
                                                                    }
                                                                )
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    className={cn(
                                                        "flex",
                                                        "flex-wrap",
                                                        "gap-2"
                                                    )}
                                                >
                                                    <span className="font-bold">
                                                        Valor:
                                                    </span>{" "}
                                                    <p className="w-full flex flex-wrap">
                                                        {Array.isArray(
                                                            log?.value
                                                        )
                                                            ? log?.value
                                                                  ?.map(
                                                                      (k) =>
                                                                          k?.name
                                                                  )
                                                                  .join(", ")
                                                            : log?.value?.value
                                                            ? t(log.value.value)
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={stateQuestionSold.show}
                onOpenChange={(p) =>
                    setQuestionSold((prev) => ({ ...prev, show: p, value: "" }))
                }
                modal
            >
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{t("sold")}</DialogTitle>
                    </DialogHeader>
                    <div
                        className={cn(
                            "flex",
                            "flex-col",
                            "gap-4",
                            "max-w-sm",
                            "items-center"
                        )}
                    >
                        <Separator />
                        <div className="flex flex-col w-full gap-4">
                            <span>Qual plataforma o produto foi vendido?</span>
                            <Select
                                onValueChange={(e) =>
                                    setQuestionSold((prev) => ({
                                        ...prev,
                                        value: e,
                                    }))
                                }
                                value={stateQuestionSold.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            className="capitalize"
                                            value="mercado livre"
                                        >
                                            Mercado Livre
                                        </SelectItem>
                                        <SelectItem
                                            className="capitalize"
                                            value="amazon"
                                        >
                                            Amazon
                                        </SelectItem>
                                        <SelectItem
                                            className="capitalize"
                                            value="shopee"
                                        >
                                            shopee
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center w-full justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setQuestionSold({
                                        show: false,
                                        value: "",
                                        ids: [],
                                    })
                                }
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleStatusSold}
                                type="button"
                            >
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={stateQuestionStock.show}
                onOpenChange={(p) =>
                    setQuestionStock((prev) => ({
                        ...prev,
                        show: p,
                        value: "",
                    }))
                }
                modal
            >
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{t("stock")}</DialogTitle>
                    </DialogHeader>
                    <div
                        className={cn(
                            "flex",
                            "flex-col",
                            "gap-4",
                            "max-w-sm",
                            "items-center"
                        )}
                    >
                        <Separator />
                        <div className="flex flex-col w-full gap-4">
                            <span>Informe o endereço de estoque</span>
                            <Input
                                value={stateQuestionStock.value}
                                onChange={(e) =>
                                    setQuestionStock((prev) => ({
                                        ...prev,
                                        value: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="flex items-center w-full justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setQuestionStock({
                                        show: false,
                                        value: "",
                                        ids: [],
                                    })
                                }
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleStatusStock}
                                type="button"
                            >
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <input
                ref={refFile}
                type="file"
                className="hidden"
                accept=".csv"
                onChange={(e) => {
                    if (e.target.files?.length) {
                        handleImportCSV(e.target.files[0]);
                    }
                }}
            />
            <input
                ref={refFileCatalog}
                type="file"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.length) {
                        handleImportCatalog(e.target.files[0]);
                    }
                }}
            />
        </>
    );
};

export { DataTable };
