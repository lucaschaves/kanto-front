import { Modal } from "@/Layout/Modal";
import {
    Button,
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
    SearchCatalog,
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
import { messageError } from "@/utils";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { FieldValues, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const ItemsSearchs = ({ control, onChangeValue, getValues }: any) => {
    const { t } = useTranslation();

    const { fields, append, remove } = useFieldArray({
        name: "quotationSearch",
        control,
    });

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
            pvCredit: values?.pvCredit,
            plataform: values?.catalog?.catalog?.plataform,
            catalogId: values?.catalog?.id,
        });
        onCleanCatalog();
    };

    const handleDelete = (index: number) => {
        remove(index);
    };

    const handleLoadItem = (index: number) => {
        const item = fields[index] as any;

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
        onChangeValue("pvCredit", item.pvCredit);
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
        onChangeValue("pvCredit", null);
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
                title={t("catalog")}
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
                        onChangeValue("pvCredit", val?.pvCredit);
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
                    label={t("pvCredit")}
                    name="pvCredit"
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
                                <FormLabel>Comentários do fornecedor</FormLabel>
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
                            <FormLabel>Comentário de review</FormLabel>
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
                            <TableHead>Custo de estoque</TableHead>
                            <TableHead>PV ML</TableHead>
                            <TableHead>PV Credito</TableHead>
                            <TableHead>Comentários</TableHead>
                            {/* <TableHead></TableHead> */}
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field: any, i: number) => {
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
                                    <TableCell>{field?.plataform}</TableCell>
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
                                        {RSValue.format(field?.pvCredit || 0)}
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

export const PageQuotationsFormCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        if (!data?.provider?.name) {
            messageError({
                message: "É necessário informar um nome",
            });
            return;
        }
        if (!data?.quotationSearch.length) {
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
                body: {
                    ...newData,
                    quotationHistory: {
                        ...newData?.quotationHistory,
                        adjusted: true,
                    },
                },
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
            const idUser = JSON.parse(
                window.sessionStorage.getItem(CONSTANT_USER) || "{}"
            )?.id;
            await putApi({
                url: `/quotationsform/user/${searchParams.get("id")}`,
                body: {
                    userId: idUser,
                },
            });
        }
    };

    const onChangeTab = (value: string) => {
        if (value === "general") {
            const searchItems = refForm.current?.watch("quotationSearch");
            let valuePcCost = 0;
            let valuePcCredit = 0;

            searchItems.forEach((f: any) => {
                valuePcCost += f.pcCost;
                valuePcCredit += f.pvCredit;
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
        }
    };

    const handleCancel = async () => {
        await putApi({
            url: `/quotationsform/${searchParams.get("id")}`,
            body: {
                quotationHistory: {
                    finished: true,
                    completionDate: new Date(),
                },
            },
        });
    };

    const handleFinish = async () => {
        const valuesForm = refForm.current?.getValues();
        const { success } = await putApi({
            url: `/quotationsform/finish/${searchParams.get("id")}`,
            body: {
                ...valuesForm,
                quotationHistory: {
                    ...valuesForm.quotationHistory,
                    finished: true,
                    completionDate: new Date(),
                },
            },
        });
        if (success) {
            onClose();
        }
    };

    useEffect(() => {
        if (isEdit) {
            getData();
        }
    }, []);

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={isEdit ? t("edit") : t("add")}
            defaultValues={{
                quantity: 1,
            }}
        >
            <Tabs
                defaultValue="general"
                className="w-full"
                onValueChange={onChangeTab}
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">Geral</TabsTrigger>
                    <TabsTrigger value="items">Itens</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="flex flex-col gap-4">
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
                        <FInputLabel label="Telefone" name="provider.phone" />
                        <FInputLabel
                            label="Email"
                            name="provider.email"
                            className="col-span-2"
                        />
                        <FInputLabel
                            label="Origem do contato"
                            name="provider.originContact"
                        />
                        <FInputLabel
                            label="Endereço"
                            name="provider.address"
                            className="col-span-2"
                        />
                    </GroupForm>
                    <GroupForm
                        title={t("value")}
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
                            label="Valor final"
                            name="quotationHistory.finalValue"
                            type="currency"
                        />
                        <FInputLabel
                            label="Valores orçados"
                            name="quotationHistory.budgetedValues"
                            type="currency"
                        />
                        <FInputLabel
                            label="Valor crédito"
                            name="quotationHistory.finalCredit"
                            type="currency"
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
                        />
                        <FSelectLabelMultiApi
                            label="Método de pagamento"
                            name="quotationHistory.paymentMethodId"
                            url="/paymentmethods"
                            single
                        />
                    </GroupForm>
                    <div className="flex items-center justify-start gap-4">
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
                    </div>
                </TabsContent>
                <TabsContent value="items">
                    <ItemsSearchs
                        control={refForm.current?.control}
                        onChangeValue={(n: string, v: any) =>
                            refForm.current?.setValue(n, v)
                        }
                        getValues={() => refForm.current?.getValues()}
                    />
                </TabsContent>
                <TabsContent value="history">
                    <GroupForm
                        title={t("contact")}
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
                            label="Retornou"
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
                </TabsContent>
            </Tabs>
        </Modal>
    );
};
