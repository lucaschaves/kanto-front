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
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    Input,
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
import { cn } from "@/lib";
import { messageError } from "@/utils";
import {
    ChevronDownIcon,
    Pencil1Icon,
    PlusIcon,
    ReloadIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface IPropsDataTable<T> {
    nameRule: string;
    columns: ColumnDef<T>[];
    data: T[];
    onDelete?: (ids: string[]) => void;
    onRefresh?: () => void;
}

const DataTable = <T,>(props: IPropsDataTable<T>) => {
    const {
        nameRule,
        columns,
        data,
        onDelete = () => ({}),
        onRefresh = () => ({}),
    } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [isDelete, setDelete] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        createdAt: false,
        updatedAt: false,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [stateRowFocus, setRowFocus] = useState<any>({});

    const keyFilter =
        columns.length > 2 ? (columns[2] as any)?.accessorKey : "name";
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
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

    const handleDelete = useCallback(() => {
        if (Object.values(rowSelection).length) {
            const rowsIds = table
                .getSelectedRowModel()
                .rows.map((r: any) => r.original.id);
            onDelete(rowsIds);
        } else if (Object.values(stateRowFocus).length) {
            onDelete([stateRowFocus?.id]);
        } else {
            messageError({
                message: "Selecione ao menos uma linha",
            });
        }
    }, [stateRowFocus]);

    const handleRefresh = useCallback(() => {
        onRefresh();
    }, []);

    return (
        <>
            <div className="w-full">
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
                            "items-center",
                            "justify-start",
                            "w-full",
                            "lg:max-w-md"
                        )}
                    >
                        <Input
                            data-rule-component="rule"
                            data-rule-component-id={`${nameRule}.filter`}
                            placeholder={`Filtrar por ${keyFilter}...`}
                            value={
                                (table
                                    .getColumn(keyFilter)
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn(keyFilter)
                                    ?.setFilterValue(event.target.value)
                            }
                        />
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
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                asChild
                                className="w-auto sm:w-auto max-w-48"
                            >
                                <Button variant="outline" className="ml-auto">
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
                        <div className="flex items-center gap-2">
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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                if (
                                                    Object.values(stateRowFocus)
                                                        .length
                                                ) {
                                                    handleAddOrEditDialog(
                                                        stateRowFocus?.id
                                                    );
                                                    return;
                                                }
                                                messageError({
                                                    message:
                                                        "Selecione uma linha",
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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setDelete(true)}
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
                        </div>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
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
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row: any) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                        onClick={() => handleRowClick(row)}
                                        className={cn(
                                            stateRowFocus?.id ===
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
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )}
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
                <div className="flex items-center justify-between sm:justify-end space-x-2 py-4">
                    <div className="hidden sm:flex flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length} linhas
                        selecionadas.
                    </div>
                    <div className="space-x-2 w-full flex items-center sm:w-auto justify-between sm:justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Voltar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Avançar
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
