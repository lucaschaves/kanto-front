import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Button,
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    Input,
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
import { usePagination, useSorting } from "@/hooks";
import { cn } from "@/lib";
import { messageError } from "@/utils";
import {
    ChevronDownIcon,
    Cross1Icon,
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
    OnChangeFn,
    RowSelectionState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    CSSProperties,
    KeyboardEvent,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface IPagination {
    skip: number;
    limit: number;
}
interface ISort {
    field: string;
    order: string;
}

interface IFilter {
    field: string;
    filter: string;
}

export interface IOnRefresh {
    pagination: IPagination;
    sort: ISort;
    filter?: IFilter;
}

interface IPropsDataTable<T> {
    nameRule: string;
    columns: ColumnDef<T>[];
    data: T[];
    total: number;
    limit?: number;
    loading?: boolean;
    onAction?: (ids: string[]) => void;
    onDelete?: (ids: string[]) => void;
    onRefresh?: (props: IOnRefresh) => void;
    onSort?: OnChangeFn<ColumnOrderState>;
    canRefresh?: boolean;
    canAdd?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canColumns?: boolean;
    canFilter?: boolean;
    className?: string;
    classNameTable?: string;
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
        nameRule,
        columns,
        data,
        total,
        loading = false,
        onAction,
        onDelete = () => ({}),
        onRefresh = () => ({}),
        // onSort = () => ({}),
        canRefresh = true,
        canAdd = true,
        canEdit = true,
        canDelete = true,
        canColumns = true,
        canFilter = true,
        className = "",
        classNameTable = "",
        limit,
    } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const refInit = useRef(true);

    const {
        limit: limitPage,
        onPaginationChange,
        skip,
        pagination,
    } = usePagination({ limit });
    const { sorting, onSortingChange, field, order } = useSorting();

    const [stateFilter, setFilter] = useState("");
    const [isDelete, setDelete] = useState(false);
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: [],
        right: [],
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        createdAt: false,
        updatedAt: false,
    });
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [stateRowFocus, setRowFocus] = useState<any>({});

    const keyFilter =
        columns.length > 2 ? (columns[2] as any)?.accessorKey : "name";

    const handleSort = useCallback(
        (propsV: SetStateAction<SortingState>) => {
            onSortingChange(propsV);
            const defPagination = {
                pagination: { skip: 0, limit: limitPage },
                sort: { field, order },
                filter: { field: "name", filter: stateFilter },
            };
            onPaginationChange({
                pageSize: defPagination.pagination.limit,
                pageIndex: defPagination.pagination.skip,
            });
            onRefresh(defPagination);
        },
        [field, order, sorting, skip, limitPage, pagination, stateFilter]
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

    const handleRefresh = useCallback(() => {
        onRefresh({
            pagination: { skip, limit: limitPage },
            sort: { field, order },
            filter: { field: "name", filter: stateFilter },
        });
    }, [limitPage, skip, pagination, sorting, field, order, stateFilter]);

    const handleFilter = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            switch (e.keyCode) {
                case 13:
                    onRefresh({
                        pagination: { skip: 0, limit: limitPage },
                        sort: { field, order },
                        filter: { field: "name", filter: stateFilter },
                    });
                    break;
                default:
                    break;
            }
        },
        [stateFilter, limitPage, field, order]
    );

    const handleCleanFilter = useCallback(() => {
        setFilter("");
        onRefresh({
            pagination: { skip: 0, limit: limitPage },
            sort: { field, order },
            filter: { field: "name", filter: "" },
        });
    }, [limitPage, field, order]);

    useEffect(() => {
        if (refInit.current) {
            refInit.current = false;
            return;
        }
        onRefresh({
            pagination: { skip, limit: limitPage },
            sort: { field, order },
            filter: { field: "name", filter: stateFilter },
        });
    }, [skip]);

    return (
        <>
            <div
                className={cn(
                    "w-full",
                    "overflow-hidden",
                    "max-w-[calc(100svw-50px)]",
                    "sm:max-w-[calc(100svw-140px)]",
                    "md:max-w-[calc(100svw-370px)]",
                    "px-1",
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
                    {canFilter ? (
                        <div
                            className={cn(
                                "relative",
                                "flex",
                                "items-center",
                                "justify-start",
                                "w-full",
                                "lg:max-w-md"
                            )}
                        >
                            <Input
                                data-rule-component="rule"
                                data-rule-component-id={`${nameRule}.filter`}
                                placeholder={`${t("filterBy")} ${t(
                                    keyFilter
                                )?.toLocaleLowerCase()}...`}
                                value={stateFilter}
                                onChange={(e) => setFilter(e.target.value)}
                                onKeyDown={handleFilter}
                                autoComplete="off"
                                className="pr-10"
                            />
                            <Button
                                className="top-0 right-0 absolute"
                                size="icon"
                                variant="ghost"
                                onClick={handleCleanFilter}
                                data-rule-component="rule"
                                data-rule-component-id={`${nameRule}.filter`}
                            >
                                <Cross1Icon />
                            </Button>
                        </div>
                    ) : (
                        <></>
                    )}
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
                            <DropdownMenu>
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
                                                data-rule-component-id={`${nameRule}.new`}
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
                                                data-rule-component-id={`${nameRule}.edit`}
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
                                                data-rule-component-id={`${nameRule}.delete`}
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
                                    data-rule-component-id={`${nameRule}.new`}
                                    className="flex gap-1"
                                >
                                    <UploadIcon />
                                    Importar
                                </Button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
                <div className={cn("rounded-md", "border", classNameTable)}>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                style={{
                                                    ...getCommonPinningStyles(
                                                        header.column
                                                    ),
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
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
                                        {table.getAllColumns().map((col) => {
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
                                table.getRowModel().rows.map((row: any) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                        onClick={() => handleRowClick(row)}
                                        className={cn(
                                            stateRowFocus?.id ==
                                                row?.original?.id
                                                ? cn(
                                                      "bg-slate-200",
                                                      "hover:bg-slate-300"
                                                  )
                                                : ""
                                        )}
                                    >
                                        {row
                                            .getVisibleCells()
                                            .map((cell: any) => (
                                                <TableCell
                                                    key={cell.id}
                                                    style={{
                                                        ...getCommonPinningStyles(
                                                            cell.column
                                                        ),
                                                    }}
                                                    className="truncate"
                                                >
                                                    <ContextMenu>
                                                        <ContextMenuTrigger>
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </ContextMenuTrigger>
                                                        <ContextMenuContent className="w-64">
                                                            <ContextMenuItem>
                                                                {t(
                                                                    "changeHistory"
                                                                )}
                                                            </ContextMenuItem>
                                                            <ContextMenuItem>
                                                                {t(
                                                                    "filterByCellValue"
                                                                )}
                                                            </ContextMenuItem>
                                                        </ContextMenuContent>
                                                    </ContextMenu>
                                                </TableCell>
                                            ))}
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
                <div className="flex items-center justify-between sm:justify-end space-x-2 py-2">
                    <div className="hidden sm:flex flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length}{" "}
                        {t("selectedLines")}
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
        </>
    );
};

export { DataTable };
