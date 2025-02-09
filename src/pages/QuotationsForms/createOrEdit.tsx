import { Modal } from "@/Layout/Modal";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    BaseForm,
    Button,
    Editor,
    FButtonSubmit,
    FCheckboxLabel,
    FInputDatePicker,
    FInputLabel,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FSelectLabel,
    FSelectLabelMultiApi,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
    Input,
    ScrollArea,
    SearchCatalog,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from "@/components";
import { CONSTANT_USER } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { createColumn, ICreateColumn, messageError } from "@/utils";
import {
    CheckIcon,
    ExternalLinkIcon,
    PlusIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { FieldValues, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight, FiMail } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const ItemsSearchs = ({ control, onChangeValue, getValues }: any) => {
    const { t } = useTranslation();

    const { fields, append, remove, update } = useFieldArray({
        name: "quotationSearch",
        control,
    });

    const [stateIsEdit, setEdit] = useState({ edit: false, index: -1 });
    const [stateFindCatalog, setFindCatalog] = useState<any>({});

    const handleAdd = () => {
        const values = getValues();
        if (!values?.catalog?.id) {
            messageError({
                message: "É necessário informar o catálogo",
            });
            return;
        }
        append({
            comments: values?.comments,
            quantity: values?.quantity || 1,
            reviewComments: values?.reviewComments,
            name: values?.name,
            pcCost: values?.pcCost,
            pvMercadoLivre: values?.pvMercadoLivre,
            pcCredit: values?.pcCredit,
            plataform: values?.catalog?.catalog?.plataform,
            catalogId: values?.catalog?.id,
        });
        onCleanCatalog();
    };

    const handleUpdated = () => {
        const values = getValues();
        if (!values?.catalog?.id) {
            messageError({
                message: "É necessário informar o catálogo",
            });
            return;
        }

        update(stateIsEdit.index, {
            comments: values?.comments,
            quantity: values?.quantity || 1,
            reviewComments: values?.reviewComments,
            name: values?.name,
            pcCost: values?.pcCost,
            pvMercadoLivre: values?.pvMercadoLivre,
            pcCredit: values?.pcCredit,
            plataform: values?.catalog?.catalog?.plataform,
            catalogId: values?.catalog?.id,
        });
        onCleanCatalog();
        setEdit({ edit: false, index: -1 });
    };

    const handleDelete = (index: number) => {
        remove(index);
    };

    const handleLoadItem = (index: number) => {
        const item = fields[index] as any;
        setEdit({ edit: true, index });
        setFindCatalog({
            type: "game",
            factory: [item.game],
        });
        onChangeValue("catalog", item.catalog);
        onChangeValue("catalogId", item.catalog?.id);
        onChangeValue("name", item.name);
        onChangeValue("quantity", item.quantity);
        onChangeValue("comments", item.comments);
        onChangeValue("reviewComments", item.reviewComments);
        onChangeValue("pcCost", item.pcCost);
        onChangeValue("pvMercadoLivre", item.pvMercadoLivre);
        onChangeValue("pcCredit", item.pcCredit);
        onChangeValue("plataform", item.catalog?.plataform);
    };

    const onCleanCatalog = () => {
        onChangeValue("catalog", null);
        onChangeValue("catalogId", null);
        onChangeValue("name", null);
        onChangeValue("quantity", 1);
        onChangeValue("comments", null);
        onChangeValue("reviewComments", null);
        onChangeValue("pcCost", null);
        onChangeValue("pvMercadoLivre", null);
        onChangeValue("pcCredit", null);
        onChangeValue("plataform", null);
    };

    return (
        <div className="flex flex-col w-full h-full gap-2">
            <SearchCatalog
                onChange={(n, v) => {
                    setFindCatalog((prev: any) => ({ ...prev, [n]: v }));
                    onCleanCatalog();
                }}
                value={stateFindCatalog}
            />
            <GroupForm
                title="Dados do Item"
                className={cn(
                    "relative",
                    "w-full",
                    "grid",
                    "grid-cols-2",
                    "sm:grid-cols-4",
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                {stateIsEdit.edit ? (
                    <>
                        <Button
                            size="sm"
                            variant="secondary"
                            type="button"
                            className="absolute -top-8 right-24"
                            disabled={!stateFindCatalog?.type}
                            onClick={onCleanCatalog}
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            variant="default"
                            type="button"
                            className="absolute -top-8 right-2"
                            disabled={!stateFindCatalog?.type}
                            onClick={handleUpdated}
                        >
                            Atualizar
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleAdd}
                        size="sm"
                        variant="default"
                        type="button"
                        className="absolute -top-8 right-2"
                        disabled={!stateFindCatalog?.type}
                    >
                        <PlusIcon />
                        Adicionar
                    </Button>
                )}
                <FSelectLabelSingleApi
                    defControl={control}
                    className="col-span-2"
                    label={t("catalog")}
                    name="catalog"
                    url="/catalogs/fields"
                    dependenciesValue={{
                        type: stateFindCatalog?.type,
                        plataform: stateFindCatalog?.plataform
                            ?.map((d: any) => d?.id)
                            .join(","),
                        region: stateFindCatalog?.region
                            ?.map((d: any) => d?.id)
                            .join(","),
                        factory: stateFindCatalog?.factory
                            ?.map((d: any) => d?.id)
                            .join(","),
                    }}
                    // dependencies={[
                    //     "consoleComplete",
                    //     "conservation",
                    //     "consolePackaging",
                    //     "consoleSealed",
                    //     "consoleTypeUnlocked",
                    //     "consoleWorking",
                    //     "consoleUnlocked",
                    //     "gameManual",
                    //     "gamePackaging",
                    //     "gamePackagingRental",
                    //     "gameSealed",
                    //     "gameWorking",
                    // ]}
                    keyValue={["catalog.name"]}
                    // addLinkCrud={
                    //     refForm.current?.watch("catalog")
                    //         ? ""
                    //         : "/factory/consoles/new"
                    // }
                    onEffect={(val) => {
                        onChangeValue("name", val?.name);
                        onChangeValue("pvMercadoLivre", val?.pvMercadoLivre);
                        onChangeValue("pcCredit", val?.pcCredit);
                        onChangeValue("pcCost", val?.pcCost);
                    }}
                    // disabled={!stateType}
                    // className={cn(
                    //     "col-span-1",
                    //     "sm:col-span-2",
                    //     "md:col-span-3"
                    // )}
                    disabled={!stateFindCatalog?.type}
                />
                <FInputLabel
                    label={t("name")}
                    name="name"
                    className="col-span-2"
                    disabled={!stateFindCatalog?.type}
                />
                <FInputLabel
                    label={t("quantity")}
                    name="quantity"
                    disabled={!stateFindCatalog?.type}
                />
                <FInputLabel
                    label={t("pvMercadoLivre")}
                    name="pvMercadoLivre"
                    disabled={!stateFindCatalog?.type}
                />
                <FInputLabel
                    label={t("pcCredit")}
                    name="pcCredit"
                    disabled={!stateFindCatalog?.type}
                />
                <FInputLabel
                    label={t("pcCost")}
                    name="pcCost"
                    disabled={!stateFindCatalog?.type}
                />
                <FormField
                    name="comments"
                    render={({ field }) => {
                        return (
                            <FormItem className="col-span-2">
                                <FormLabel>Comentários do Fornecedor</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder=""
                                        className="resize-none"
                                        disabled={!stateFindCatalog?.type}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    name="reviewComments"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Comentário Kanto</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder=""
                                    className="resize-none"
                                    disabled={!stateFindCatalog?.type}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </GroupForm>
            <div
                className={cn(
                    "flex",
                    "flex-col",
                    "w-full",
                    "border",
                    "rounded-lg",
                    "p-2"
                )}
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Catálogo</TableHead>
                            <TableHead>Plataforma</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Custo de Estoque</TableHead>
                            <TableHead>PV ML</TableHead>
                            <TableHead>PV Credito</TableHead>
                            <TableHead>Comentários</TableHead>
                            {/* <TableHead></TableHead> */}
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields
                            .filter((f: any) => !f.newProduct)
                            .map((field: any, i: number) => {
                                const RSValue = new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                });
                                return (
                                    <TableRow
                                        key={field.id}
                                        onClick={() => handleLoadItem(i)}
                                    >
                                        <TableCell>{field?.name}</TableCell>
                                        <TableCell>
                                            {field?.plataform}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {field?.quantity}
                                        </TableCell>
                                        <TableCell>
                                            {RSValue.format(field?.pcCost || 0)}
                                        </TableCell>
                                        <TableCell>
                                            {RSValue.format(
                                                field?.pvMercadoLivre || 0
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {RSValue.format(
                                                field?.pcCredit || 0
                                            )}
                                        </TableCell>
                                        <TableCell>{field?.comments}</TableCell>
                                        {/* <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(i)}
                                        >
                                            <Pencil1Icon />
                                        </button>
                                    </TableCell> */}
                                        <TableCell>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(i)}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const EmailView = ({
    isNew,
    onClick,
    isLoading,
    data,
    onChange,
}: {
    isNew: boolean;
    isLoading: boolean;
    data: any;
    onClick: () => void;
    onChange: (key: string, e: any) => void;
}) => {
    return (
        <div className="flex flex-col w-full gap-2">
            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    className="flex gap-3"
                    onClick={onClick}
                >
                    <FiChevronLeft />
                    Voltar
                </Button>
                {isNew ? (
                    <Button
                        type="button"
                        variant="ghost"
                        className="flex gap-3"
                    >
                        <FiMail />
                        Enviar email
                    </Button>
                ) : (
                    <></>
                )}
            </div>
            <GroupForm
                title=""
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-1",
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                {isLoading ? (
                    <>
                        <Skeleton className="w-full h-[40px] rounded-md" />
                        <Skeleton className="w-full h-[80px] rounded-md col-span-2" />
                    </>
                ) : (
                    <>
                        <div className="flex flex-col w-full">
                            <span>Assunto</span>
                            <Input value={data.subject} readOnly={!isNew} />
                        </div>
                        <div className="flex flex-col w-full col-span-2">
                            <span>Email</span>
                            <Editor
                                className="max-h-96 overflow-auto"
                                value={data?.body}
                                onChangeText={(p) => onChange("emailText", p)}
                                onChangeHtml={(p) => onChange("emailHtml", p)}
                            />
                        </div>
                    </>
                )}
            </GroupForm>
        </div>
    );
};

const EmailsList = ({
    data,
    onClick,
}: {
    data: any[];
    onClick: (id: string) => void;
}) => {
    return (
        <ScrollArea className={cn("h-96")}>
            {data.map((p) => (
                <div
                    key={`list-${p.id}`}
                    className={cn(
                        "p-2",
                        "border",
                        "rounded-lg",
                        "flex",
                        "items-center",
                        "gap-4",
                        "hover:bg-slate-50",
                        "mb-2"
                    )}
                    onClick={() => onClick(p.id)}
                >
                    <Avatar>
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt={p?.to_email}
                        />
                        <AvatarFallback>
                            {p?.to_email?.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div key={p.id} className={cn("p-2", "w-full")}>
                        <div
                            className={cn(
                                "flex",
                                "items-center",
                                "justify-between"
                            )}
                        >
                            <span className="text-base font-semibold">
                                {p?.to_email}
                            </span>
                            <span className="text-sm font-semibold">
                                {p?.created_at
                                    ? format(
                                          new Date(p?.created_at),
                                          "dd MMM, HH:mm"
                                      )
                                    : ""}
                            </span>
                        </div>
                        <div className="w-full text-sm">
                            <span className="w-full truncate">
                                {p?.subject}
                            </span>
                        </div>
                    </div>
                    <FiChevronRight />
                </div>
            ))}
        </ScrollArea>
    );
};

const EmailsTemplate = ({
    data,
    onClick,
}: {
    data: any[];
    onClick: (p: any) => void;
}) => {
    return (
        <ScrollArea className={cn("h-96")}>
            {data.map((p) => (
                <div
                    key={`template-${p.id}`}
                    className={cn(
                        "p-2",
                        "border",
                        "rounded-lg",
                        "flex",
                        "items-center",
                        "justify-between",
                        "gap-4",
                        "hover:bg-slate-50",
                        "mb-2"
                    )}
                    onClick={() => onClick(p)}
                >
                    <span className="text-base font-semibold">{p?.name}</span>
                    <FiChevronRight />
                </div>
            ))}
        </ScrollArea>
    );
};

export const PageQuotationsFormCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("/edit");

    const refModal = useRef<any>(null);
    const refForm = useRef<IBaseFormRef>(null);
    const refProductForm = useRef<IBaseFormRef>(null);
    const refEmailForm = useRef<IBaseFormRef>(null);
    const [stateViewEmail, setViewEmail] = useState<
        "list" | "new" | "template" | "view"
    >("list");
    const [stateTable, setTable] = useState<{ data: any[]; total: number }>({
        data: [],
        total: 0,
    });
    const [stateNewItem, setNewItem] = useState<any>({});
    const [stateEmail, setEmail] = useState<any>({});
    const [stateEmails, setEmails] = useState<any[]>([]);
    const [stateTemplates, setTemplates] = useState<any[]>([]);
    const [stateLoadingEmail, setLoadingEmail] = useState(false);

    const [stateColumnsNew] = useState<ColumnDef<any>[]>(() => {
        const columns: any[] = [];
        const colsDef: ICreateColumn[] = [
            { name: "id", title: t("id") },
            { name: "newName", title: t("name") },
            {
                name: "newRegion",
                title: t("region"),
                type: "object",
                field: "name",
            },
            {
                name: "comments",
                title: t("comments"),
            },
        ];
        colsDef.forEach((col) => {
            columns.push(
                createColumn({
                    name: col.name,
                    title: col.title,
                    type: col?.type as any,
                    field: col?.field,
                })
            );
        });
        return columns;
    });
    const [stateProductFindCatalog, setProductFindCatalog] = useState<any>({});

    const onProductSubmit = async (data: FieldValues) => {
        const newTable: any[] = [];
        stateTable.data.forEach((key: any) => {
            if (key?.id == stateNewItem?.id) {
                newTable.push({
                    ...key,
                    catalogId: data?.catalog?.id,
                });
            } else {
                newTable.push(key);
            }
        });
        setTable({
            data: newTable,
            total: newTable.length,
        });
        setNewItem({});
    };

    const onProductCleanCatalog = () => {
        // onChangeValue("catalog", null);
    };

    const tableNew = useReactTable({
        getCoreRowModel: getCoreRowModel(),
        data: stateTable.data,
        columns: stateColumnsNew,
        rowCount: stateTable.total,
    });

    const onProductClose = () => {
        setNewItem({});
    };

    const onEmailClose = () => {
        setEmail({});
        refEmailForm.current?.reset({});
    };

    const handleViewEmail = async (id: string) => {
        const { success, data } = await getApi({
            url: `/email/${id}`,
        });
        if (success) {
            setEmail(data);
        }
        setLoadingEmail(false);
    };

    const onClose = () => {
        navigate("/quotations/quotationsforms");
    };

    const onSubmit = async (data: FieldValues) => {
        if (!data?.provider?.name) {
            messageError({
                message: "É necessário informar um nome",
            });
            return;
        }
        if (!data?.quotationSearch?.length) {
            messageError({
                message: "É necessário ter pelo menos um item",
            });
            return;
        }
        let newData = data;
        if (newData?.quotationHistory?.paymentMethodId?.length) {
            newData = {
                ...newData,
                quotationHistory: {
                    ...newData?.quotationHistory,
                    paymentMethodId:
                        newData?.quotationHistory?.paymentMethodId[0],
                },
            };
        }
        if (isEdit) {
            const { success } = await putApi({
                url: `/quotationsform/${searchParams.get("id")}`,
                body: newData,
            });
            if (success) {
                onClose();
            }
        } else {
            const { success } = await postApi({
                url: "/quotationsform",
                body: newData,
            });
            if (success) {
                onClose();
            }
        }
    };

    const getData = async () => {
        const { success, data } = await getApi({
            url: `/quotationsform/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset(data);
            const dataNewProducts = data?.quotationSearch?.filter(
                (r: any) => !!r?.newProduct
            );
            setTable({
                data: dataNewProducts,
                total: dataNewProducts.length,
            });
            const idUser = JSON.parse(
                window.sessionStorage.getItem(CONSTANT_USER) || "{}"
            )?.id;
            await putApi({
                url: `/quotationsform/user/${searchParams.get("id")}`,
                body: {
                    userId: idUser,
                },
            });
            const emails = await getApi({
                url: `/emails/quotation/${searchParams.get("id")}`,
            });
            if (emails.success) {
                setEmails(emails.data.rows);
            }
        }
    };

    const onChangeTab = (value: string) => {
        onProductClose();
        onEmailClose();
        setLoadingEmail(false);
        setEmail({});
        setViewEmail("list");
        if (value === "general") {
            const searchItems = refForm.current?.watch("quotationSearch");
            let valuePcCost = 0;
            let valuePcCredit = 0;

            searchItems.forEach((f: any) => {
                valuePcCost += f.pcCost;
                valuePcCredit += f.pcCredit;
            });
            refForm.current?.setValue(
                "quotationHistory.finalValue",
                valuePcCost
            );
            refForm.current?.setValue(
                "quotationHistory.budgetedValues",
                valuePcCost
            );
            refForm.current?.setValue(
                "quotationHistory.finalCredit",
                valuePcCredit
            );
            if (Number(valuePcCost) < 200) {
                refForm.current?.setValue("priorityTag", "baixo");
            } else if (
                Number(valuePcCost) >= 200 &&
                Number(valuePcCost) < 1000
            ) {
                refForm.current?.setValue("priorityTag", "médio");
            } else {
                if (Number(valuePcCost) < 200) {
                    refForm.current?.setValue("priorityTag", "alto");
                }
            }
        }
    };

    const handleCancel = async () => {
        await putApi({
            url: `/quotationsform/${searchParams.get("id")}`,
            body: {
                quotationHistory: {
                    finished: true,
                    canceled: true,
                    completionDate: new Date(),
                },
            },
        });
    };

    const handleFinish = async () => {
        const valuesForm = refForm.current?.getValues();

        if (valuesForm?.quotationHistory?.received) {
            const { success } = await putApi({
                url: `/quotationsform/finish/${searchParams.get("id")}`,
                body: {
                    ...valuesForm,
                    quotationHistory: {
                        ...valuesForm.quotationHistory,
                        finished: true,
                        completionDate: new Date(),
                        returned:
                            valuesForm?.quotationHistory?.returned || "nao",
                    },
                },
            });
            if (success) {
                onClose();
            }
        } else {
            messageError({
                message: "É necessário ter recebido os itens",
            });
        }
    };

    const getTemplates = async () => {
        const { success, data } = await getApi({
            url: "/templatesemails",
        });
        if (success) {
            setTemplates(data.rows);
        }
    };

    const handleAppoveNewItem = async (rowOriginal: any) => {
        const { success } = await putApi({
            url: `/quotationssearch/${rowOriginal?.id}`,
            body: rowOriginal,
        });
        if (success) {
            getData();
        }
    };

    useEffect(() => {
        getTemplates();
        if (isEdit) {
            getData();
        }
    }, []);

    const isExpanse = Object.keys(stateNewItem).length;

    return (
        <>
            <Modal
                ref={refModal}
                onClose={onClose}
                title={isEdit ? t("edit") : t("add")}
                maxWidth={isExpanse ? "max-w-7xl" : "max-w-4xl"}
                disabledForm
            >
                <div
                    className={
                        isExpanse
                            ? "flex items-start gap-8 overflow-hidden"
                            : ""
                    }
                >
                    <BaseForm
                        ref={refForm}
                        onSubmit={onSubmit}
                        defaultValues={{
                            quantity: 1,
                        }}
                    >
                        <div className="flex flex-col ">
                            <Tabs
                                defaultValue="general"
                                className={cn(
                                    "w-full min-h-96",
                                    isExpanse ? "max-w-xl" : ""
                                )}
                                onValueChange={onChangeTab}
                            >
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="general">
                                        Geral
                                    </TabsTrigger>
                                    <TabsTrigger value="items">
                                        Itens
                                    </TabsTrigger>
                                    <TabsTrigger value="newitems">
                                        Novos itens
                                    </TabsTrigger>
                                    <TabsTrigger value="history">
                                        Histórico
                                    </TabsTrigger>
                                    <TabsTrigger value="emails">
                                        Emails
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="general"
                                    className="flex flex-col gap-4"
                                >
                                    <ScrollArea
                                        className={cn("h-[calc(100vh-400px)]")}
                                    >
                                        <GroupForm
                                            title={t("general")}
                                            className={cn(
                                                "w-full",
                                                "grid",
                                                "grid-cols-2",
                                                "sm:grid-cols-2",
                                                "md:grid-cols-3",
                                                "gap-1",
                                                "sm:gap-2",
                                                "px-3"
                                            )}
                                        >
                                            <FInputLabel
                                                label="Nome"
                                                name="provider.name"
                                                className={cn(
                                                    "col-span-2",
                                                    "sm:col-span-2",
                                                    "md:col-span-3"
                                                )}
                                            />
                                            <FInputLabel
                                                label="Telefone"
                                                name="provider.phone"
                                            />
                                            <FInputLabel
                                                label="Email"
                                                name="provider.email"
                                                className="col-span-2"
                                            />
                                            <FInputLabel
                                                label="Origem do Contato"
                                                name="provider.originContact"
                                            />
                                            <FInputLabel
                                                label="Endereço"
                                                name="provider.address"
                                                className="col-span-2"
                                            />
                                            <FSelectLabel
                                                label="Status"
                                                name="status"
                                                items={[
                                                    {
                                                        id: "aberto",
                                                        name: "Aberto",
                                                    },
                                                    {
                                                        id: "negociação",
                                                        name: "Negociação",
                                                    },
                                                    {
                                                        id: "compra de produtos",
                                                        name: "Compra de produtos",
                                                    },
                                                    {
                                                        id: "recebido",
                                                        name: "Recebido",
                                                    },
                                                    {
                                                        id: "devolução",
                                                        name: "Devolução",
                                                    },
                                                    {
                                                        id: "finalizado",
                                                        name: "Finalizado",
                                                    },
                                                ]}
                                                disabled
                                            />
                                            <FSelectLabel
                                                label="Prioridade"
                                                name="priorityTag"
                                                items={[
                                                    {
                                                        id: "baixo",
                                                        name: "Baixo",
                                                    },
                                                    {
                                                        id: "médio",
                                                        name: "Médio",
                                                    },
                                                    {
                                                        id: "alto",
                                                        name: "Alto",
                                                    },
                                                ]}
                                                disabled
                                            />
                                            <FCheckboxLabel
                                                label={t("received")}
                                                name="quotationHistory.received"
                                                onEffect={() =>
                                                    refForm.current?.setValue(
                                                        "quotationHistory.dateReceipt",
                                                        new Date()
                                                    )
                                                }
                                                row
                                            />
                                        </GroupForm>
                                        <GroupForm
                                            title={t("value")}
                                            className={cn(
                                                "w-full",
                                                "grid",
                                                "grid-cols-2",
                                                "sm:grid-cols-2",
                                                "gap-1",
                                                "sm:gap-2",
                                                "px-3"
                                            )}
                                        >
                                            <FSelectLabelMultiApi
                                                label="Método de Pagamento"
                                                name="quotationHistory.paymentMethodId"
                                                url="/paymentmethods"
                                                single
                                            />
                                            <FInputLabel
                                                label="Valores Orçados"
                                                name="quotationHistory.budgetedValues"
                                                type="currency"
                                            />
                                            <FInputLabel
                                                label="Valor Crédito"
                                                name="quotationHistory.finalCredit"
                                                type="currency"
                                            />
                                            <FInputLabel
                                                label="Valor Dinheiro"
                                                name="quotationHistory.finalValue"
                                                type="currency"
                                            />
                                        </GroupForm>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="items">
                                    <ScrollArea
                                        className={cn("h-[calc(100vh-400px)]")}
                                    >
                                        <ItemsSearchs
                                            control={refForm.current?.control}
                                            onChangeValue={(
                                                n: string,
                                                v: any
                                            ) =>
                                                refForm.current?.setValue(n, v)
                                            }
                                            getValues={() =>
                                                refForm.current?.getValues()
                                            }
                                        />
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="newitems">
                                    <ScrollArea
                                        className={cn("h-[calc(100vh-400px)]")}
                                    >
                                        <Table
                                            className={cn(
                                                "w-full",
                                                "rounded-md",
                                                "border"
                                            )}
                                        >
                                            <TableHeader className=" bg-slate-100">
                                                {tableNew
                                                    .getHeaderGroups()
                                                    .map((headerGroup) => (
                                                        <TableRow
                                                            key={headerGroup.id}
                                                        >
                                                            {headerGroup.headers.map(
                                                                (header) => {
                                                                    return (
                                                                        <TableHead
                                                                            key={
                                                                                header.id
                                                                            }
                                                                            colSpan={
                                                                                header.colSpan
                                                                            }
                                                                            className={cn(
                                                                                header
                                                                                    .column
                                                                                    .id ===
                                                                                    "id"
                                                                                    ? "w-[50px] max-w-[50px]"
                                                                                    : ""
                                                                            )}
                                                                        >
                                                                            {header.isPlaceholder
                                                                                ? null
                                                                                : flexRender(
                                                                                      header
                                                                                          .column
                                                                                          .columnDef
                                                                                          .header,
                                                                                      header.getContext()
                                                                                  )}
                                                                        </TableHead>
                                                                    );
                                                                }
                                                            )}
                                                            <TableHead>
                                                                Editar
                                                            </TableHead>
                                                            <TableHead>
                                                                Aprovar
                                                            </TableHead>
                                                        </TableRow>
                                                    ))}
                                            </TableHeader>
                                            <TableBody>
                                                {tableNew
                                                    .getRowModel()
                                                    .rows.map((row) => (
                                                        <TableRow
                                                            key={row.id}
                                                            data-state={
                                                                row.getIsSelected() &&
                                                                "selected"
                                                            }
                                                        >
                                                            {row
                                                                .getVisibleCells()
                                                                .map((cell) => {
                                                                    return (
                                                                        <TableCell
                                                                            key={
                                                                                cell.id
                                                                            }
                                                                            className="text-nowrap"
                                                                        >
                                                                            {flexRender(
                                                                                cell
                                                                                    .column
                                                                                    .columnDef
                                                                                    .cell,
                                                                                cell.getContext()
                                                                            )}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                            <TableCell className="">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setNewItem(
                                                                            row.original
                                                                        )
                                                                    }
                                                                >
                                                                    <ExternalLinkIcon />
                                                                </button>
                                                            </TableCell>
                                                            <TableCell className="">
                                                                {!!row.original
                                                                    ?.catalogId ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleAppoveNewItem(
                                                                                row.original
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckIcon />
                                                                    </button>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="history">
                                    <ScrollArea
                                        className={cn("h-[calc(100vh-400px)]")}
                                    >
                                        <GroupForm
                                            title=""
                                            className={cn(
                                                "w-full",
                                                "grid",
                                                "grid-cols-2",
                                                "sm:grid-cols-2",
                                                "md:grid-cols-2",
                                                "gap-1",
                                                "sm:gap-2",
                                                "px-3"
                                            )}
                                        >
                                            <FSelectLabel
                                                label="Devolvida"
                                                name="quotationHistory.returned"
                                                items={[
                                                    {
                                                        id: "sim",
                                                        name: "Sim",
                                                    },
                                                    {
                                                        id: "nao",
                                                        name: "Não",
                                                    },
                                                    {
                                                        id: "parcial",
                                                        name: "Parcial",
                                                    },
                                                ]}
                                            />
                                            <FInputDatePicker
                                                label={t("dateReceipt")}
                                                name="quotationHistory.dateReceipt"
                                            />
                                            <FInputDatePicker
                                                label={t("completionDate")}
                                                name="quotationHistory.completionDate"
                                                disabled
                                            />
                                            <FInputDatePicker
                                                label={t("openingDate")}
                                                name="quotationHistory.openingDate"
                                                disabled
                                            />
                                        </GroupForm>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="emails">
                                    {["view", "new"].includes(
                                        stateViewEmail
                                    ) ? (
                                        <EmailView
                                            isNew={stateViewEmail === "new"}
                                            onClick={() => {
                                                setEmail({});
                                                setViewEmail("list");
                                            }}
                                            isLoading={stateLoadingEmail}
                                            data={stateEmail}
                                            onChange={(k, v) =>
                                                setEmail((prev: any) => ({
                                                    ...prev,
                                                    [k]: v,
                                                }))
                                            }
                                        />
                                    ) : (
                                        <>
                                            <div
                                                className={cn(
                                                    "flex",
                                                    "items-center",
                                                    "w-full",
                                                    "justify-start",
                                                    "gap-2",
                                                    "mb-4"
                                                )}
                                            >
                                                <Button
                                                    variant={
                                                        stateViewEmail ===
                                                        "list"
                                                            ? "outline"
                                                            : "ghost"
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setViewEmail("list")
                                                    }
                                                >
                                                    Emails
                                                </Button>
                                                <Button
                                                    variant={
                                                        stateViewEmail === "new"
                                                            ? "outline"
                                                            : "ghost"
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setViewEmail("new")
                                                    }
                                                >
                                                    Criar email
                                                </Button>
                                                <Button
                                                    variant={
                                                        stateViewEmail ===
                                                        "template"
                                                            ? "outline"
                                                            : "ghost"
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setViewEmail("template")
                                                    }
                                                >
                                                    User template
                                                </Button>
                                            </div>
                                            {stateViewEmail === "template" ? (
                                                <EmailsTemplate
                                                    data={stateTemplates}
                                                    onClick={(p: any) => {
                                                        setViewEmail("new");
                                                        setEmail({
                                                            to_name: "teste",
                                                            ...p,
                                                        });
                                                    }}
                                                />
                                            ) : (
                                                <EmailsList
                                                    data={stateEmails}
                                                    onClick={(id: string) => {
                                                        setLoadingEmail(true);
                                                        setViewEmail("view");
                                                        handleViewEmail(id);
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}
                                </TabsContent>
                            </Tabs>
                            <div
                                className={cn(
                                    "flex",
                                    "w-full",
                                    "items-center",
                                    "justify-between",
                                    "gap-2",
                                    "mt-4"
                                )}
                            >
                                <div className="flex items-center justify-start gap-4">
                                    {isEdit ? (
                                        <>
                                            <Button
                                                type="button"
                                                onClick={handleCancel}
                                                variant="outline"
                                                className="max-w-32"
                                            >
                                                Cancelar cotação
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleFinish}
                                                variant="outline"
                                                className="max-w-32"
                                            >
                                                Finalizar cotação
                                            </Button>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "flex",
                                        "w-full",
                                        "items-center",
                                        "justify-end",
                                        "gap-2"
                                    )}
                                >
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        variant="outline"
                                    >
                                        {t("cancel")}
                                    </Button>
                                    <FButtonSubmit label={t("save")} />
                                </div>
                            </div>
                        </div>
                    </BaseForm>
                    {Object.keys(stateNewItem).length ? (
                        <BaseForm
                            ref={refProductForm}
                            onSubmit={onProductSubmit}
                        >
                            <div className="flex flex-col w-full">
                                <div
                                    className={cn(
                                        "flex",
                                        "w-full",
                                        "items-center",
                                        "justify-between",
                                        "gap-2",
                                        "mb-2"
                                    )}
                                >
                                    <p className="font-bold text-base">
                                        Buscar catálogo - {stateNewItem?.id}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={onProductClose}
                                            variant="outline"
                                        >
                                            {t("cancel")}
                                        </Button>
                                        <FButtonSubmit label="Adicionar" />
                                    </div>
                                </div>
                                <SearchCatalog
                                    onChange={(n, v) => {
                                        setProductFindCatalog((prev: any) => ({
                                            ...prev,
                                            [n]: v,
                                        }));
                                        onProductCleanCatalog();
                                    }}
                                    value={stateProductFindCatalog}
                                />
                                <GroupForm
                                    title={t("general")}
                                    className={cn(
                                        "w-full",
                                        "gap-1",
                                        "sm:gap-2",
                                        "px-3"
                                    )}
                                >
                                    <FSelectLabelSingleApi
                                        defControl={
                                            refProductForm.current?.control
                                        }
                                        label={t("catalog")}
                                        name="catalog"
                                        url="/catalogs/fields"
                                        dependenciesValue={{
                                            type: stateProductFindCatalog?.type,
                                            plataform:
                                                stateProductFindCatalog?.plataform
                                                    ?.map((d: any) => d?.id)
                                                    .join(","),
                                            region: stateProductFindCatalog?.region
                                                ?.map((d: any) => d?.id)
                                                .join(","),
                                            factory:
                                                stateProductFindCatalog?.factory
                                                    ?.map((d: any) => d?.id)
                                                    .join(","),
                                        }}
                                        dependencies={[
                                            "consoleComplete",
                                            "conservation",
                                            "consolePackaging",
                                            "consoleSealed",
                                            "consoleTypeUnlocked",
                                            "consoleWorking",
                                            "consoleUnlocked",
                                            "gameManual",
                                            "gamePackaging",
                                            "gamePackagingRental",
                                            "gameSealed",
                                            "gameWorking",
                                        ]}
                                        keyValue={["catalog.name"]}
                                        disabled={
                                            !stateProductFindCatalog?.factory
                                        }
                                        // navigateItem="/factory/catalogs/edit?id="
                                    />
                                </GroupForm>
                            </div>
                        </BaseForm>
                    ) : (
                        <></>
                    )}
                </div>
            </Modal>
        </>
    );
};
