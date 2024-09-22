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
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    IBaseFormRef,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollArea,
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
import { useDynamicRefs, usePagination, useSorting } from "@/hooks";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import {
    convertJsonToCSV,
    downloadBlobAsFile,
    messageError,
    messageSuccess,
    sleep,
} from "@/utils";
import {
    CheckCircledIcon,
    ChevronDownIcon,
    DoubleArrowDownIcon,
    DownloadIcon,
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
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

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
    const { t } = useTranslation();
    const { openToolbar } = useOutletContext<IPropsOutletContext>();

    const [getRef, setRef] = useDynamicRefs();

    const refInit = useRef(true);
    const refFile = useRef<HTMLInputElement>(null);

    const [stateLimit, setLimit] = useState(limit?.toString() || 10);

    const {
        limit: limitPage,
        onPaginationChange,
        skip,
        pagination,
    } = usePagination({ limit: Number(stateLimit) });
    const { sorting, onSortingChange, field, order } = useSorting();

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
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        createdAt: false,
        updatedAt: false,
        ...columnsHidden,
    });
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [stateRowFocus, setRowFocus] = useState<any>({});

    const handleSort = useCallback(
        (propsV: SetStateAction<SortingState>) => {
            onSortingChange(propsV);
            const defPagination = {
                pagination: { skip: 0, limit: limitPage },
                sort: { field, order },
            };
            onPaginationChange({
                pageSize: defPagination.pagination.limit,
                pageIndex: defPagination.pagination.skip,
            });
            onRefresh(defPagination);
        },
        [field, order, sorting, skip, limitPage, pagination]
    );

    const table = useReactTable({
        data,
        columns,
        onSortingChange: handleSort,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
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
            pagination,
        },
    });

    const handleAddOrEditDialog = useCallback(
        (id?: string) => {
            if (id) {
                navigate(`${location.pathname}/edit?id=${id}`);
            } else {
                navigate(`${location.pathname}/new`);
            }
        },
        [location.pathname]
    );

    const handleRowClick = useCallback((row: any) => {
        setRowFocus(row?.original);
    }, []);

    const toggleDelete = useCallback(() => {
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
    }, [rowSelection, stateRowFocus]);

    const handleDelete = useCallback(() => {
        if (Object.values(rowSelection).length) {
            const rowsIds = table
                .getSelectedRowModel()
                .rows.map((r: any) => r.original.id);
            onDelete(rowsIds);
        } else if (Object.values(stateRowFocus).length) {
            onDelete([stateRowFocus?.id]);
        }
    }, [stateRowFocus, rowSelection]);

    const handleRefresh = useCallback(
        (filters?: any) => {
            onRefresh({
                pagination: { skip, limit: limitPage },
                sort: { field, order },
                filters,
            });
        },
        [limitPage, skip, pagination, sorting, field, order]
    );

    const handleFilterCell = useCallback(
        async (propsV: any) => {
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
        },
        [name]
    );

    const handleHistoryCell = useCallback(
        async (id: string, col: string) => {
            const { success, data } = await getApi({
                url: `/log/${nameDefault}.${id}.${col}`,
            });
            if (success) {
                setHistory({
                    show: true,
                    values: data?.log,
                });
            }
        },
        [name, nameDefault, stateHistory]
    );

    const handleNavigateTo = useCallback(
        (id: string) => {
            navigate(`${navigateForm}?${filter_name}=${id}`);
        },
        [filter_name, navigateForm]
    );

    const handleExportCSV = useCallback(() => {
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
    }, [data, columns, columnVisibility, name]);

    const handleExportTemplateCSV = useCallback(() => {
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
    }, [data, columns, columnVisibility, name]);

    const handleImportCSV = useCallback(
        async (file: File) => {
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
        },
        [refFile, name, nameDefault]
    );

    const getColumns = useCallback(() => {
        return columns;
    }, [columns]);

    const handleActionStatus = useCallback(
        async (st: string, ids: number[]) => {
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
        },
        [stateRowFocus, name, handleRefresh, urlMethod]
    );

    const hiddeColumns = useCallback((hiddenCols: VisibilityState) => {
        setColumnVisibility(hiddenCols);
    }, []);

    const handleApprove = useCallback(async () => {
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
            if (t?.gameId) {
                dataProcuts.push({
                    name: t.gameId?.name,
                    status: "receiving",
                    receiptDate: new Date(),
                    images: t?.images,
                    productsRegistrationsId: 1,
                });
            } else if (t?.consoleId) {
                dataProcuts.push({
                    name: t.consoleId?.name,
                    status: "receiving",
                    receiptDate: new Date(),
                    images: t?.images,
                    productsRegistrationsId: 1,
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
    }, [table, stateRowFocus]);

    useEffect(() => {
        if (refInit.current) {
            refInit.current = false;
            return;
        }
        onRefresh({
            pagination: { skip, limit: limitPage },
            sort: { field, order },
        });
    }, [skip]);

    useEffect(() => {
        if (refInit.current) {
            refInit.current = false;
            return;
        }
        if (stateLimit != limitPage) {
            onPaginationChange({
                pageSize: Number(stateLimit),
                pageIndex: 0,
            });
            onRefresh({
                pagination: { skip: 0, limit: Number(stateLimit) },
                sort: { field, order },
            });
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
                        "flex-col-reverse",
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
                            "justify-between",
                            "gap-2",
                            "w-full",
                            "md:flex-row",
                            "md:justify-end"
                        )}
                    >
                        {canColumns ? (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger
                                    asChild
                                    className="w-auto sm:w-auto max-w-48"
                                >
                                    <Button
                                        variant="outline"
                                        className="ml-auto"
                                    >
                                        {`${t("columns")} `}
                                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(
                                                            !!value
                                                        )
                                                    }
                                                >
                                                    {t(column.id)}
                                                </DropdownMenuCheckboxItem>
                                            );
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                            <Separator
                                orientation="vertical"
                                className="h-10"
                            />
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
                            <Separator
                                orientation="vertical"
                                className="h-10"
                            />
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
                                            {[
                                                "receiving",
                                                "processing",
                                                "sold",
                                                "repair",
                                                "loan",
                                                "test",
                                                "disposal",
                                                "lost",
                                                "part",
                                                "exchange",
                                                "gift",
                                            ].map((v) => (
                                                <Button
                                                    key={v}
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
                                                            v,
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
                                                        {t(v)}
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
                            <Separator
                                orientation="vertical"
                                className="h-10"
                            />
                            {canExportTemplateCsv ? (
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
                            ) : (
                                <></>
                            )}
                            <Separator
                                orientation="vertical"
                                className="h-10"
                            />
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
                        </div>
                    </div>
                </div>
                <ScrollArea
                    className={cn("w-full", "max-h-[calc(100svh-230px)]")}
                    style={{
                        height: 44 * Number(stateLimit),
                    }}
                >
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
                        <Table>
                            <TableHeader>
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
                                                    className={
                                                        header.column.id ===
                                                        "id"
                                                            ? "w-[50px] max-w-[50px]"
                                                            : ""
                                                    }
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
                                                                        <></>
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
                </ScrollArea>
                <div className="flex items-center justify-between sm:justify-end space-x-2 py-2">
                    <div className="hidden sm:flex flex-1 text-sm text-muted-foreground items-center gap-2">
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length}{" "}
                        {t("selectedLines")}
                        <Select
                            onValueChange={(e) => setLimit(e?.toString())}
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
                            {t("page")} {skip / limitPage}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                table.previousPage();
                            }}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {t("back")}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
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
        </>
    );
};

export { DataTable };
