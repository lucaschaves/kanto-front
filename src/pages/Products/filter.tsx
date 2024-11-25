import { REF_TOOLBAR_FORM } from "@/Layout/Toolbar";
import {
    BaseForm,
    Button,
    FButtonSubmit,
    FInputDatePickerRange,
    FInputLabel,
    FSelectLabelMulti,
    IBaseFormRef,
} from "@/components";
import { useDynamicRefs } from "@/hooks";
import { cn } from "@/lib";
import {
    decodeSearchParams,
    encodeSearchParams,
    getParamByPath,
    sleep,
} from "@/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const FilterProducts = () => {
    const [getRef, setRef] = useDynamicRefs();

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const formActual = getParamByPath(location.pathname, 1);

    const { t } = useTranslation();

    const onSubmit = async (data: any) => {
        let newSearch = {
            page: searchParams?.get("page") || 0,
            filter_sku: data?.filter_sku,
            filter_name: data?.filter_name,
            filter_status: data?.filter_status
                ?.map((d: { id: string }) => d?.id)
                .join("-"),
            filter_pvCost_start: data?.filter_pvCost_start?.replaceAll(
                ",",
                "."
            ),
            filter_pvCost_end: data?.filter_pvCost_end,
            filter_pvMercadoLivre_start: data?.filter_pvMercadoLivre_start,
            filter_pvMercadoLivre_end: data?.filter_pvMercadoLivre_end,
            filter_announcementDate_from: data?.filter_announcementDate?.from
                ? format(data.filter_announcementDate.from, "yyyy-MM-dd")
                : undefined,
            filter_announcementDate_to: data?.filter_announcementDate?.to
                ? format(data.filter_announcementDate.to, "yyyy-MM-dd")
                : undefined,
            filter_dateEntryInStock_from: data?.filter_dateEntryInStock?.from
                ? format(data.filter_dateEntryInStock.from, "yyyy-MM-dd")
                : undefined,
            filter_dateEntryInStock_to: data?.filter_dateEntryInStock?.to
                ? format(data.filter_dateEntryInStock.to, "yyyy-MM-dd")
                : undefined,
            filter_dateSale_from: data?.filter_dateSale?.from
                ? format(data.filter_dateSale.from, "yyyy-MM-dd")
                : undefined,
            filter_dateSale_to: data?.filter_dateSale?.to
                ? format(data.filter_dateSale.to, "yyyy-MM-dd")
                : undefined,
            filter_receiptDate_from: data?.filter_receiptDate?.from
                ? format(data.filter_receiptDate.from, "yyyy-MM-dd")
                : undefined,
            filter_receiptDate_to: data?.filter_receiptDate?.to
                ? format(data.filter_receiptDate.to, "yyyy-MM-dd")
                : undefined,
            filter_updatedAt_from: data?.filter_updatedAt?.from
                ? format(data.filter_updatedAt.from, "yyyy-MM-dd")
                : undefined,
            filter_updatedAt_to: data?.filter_updatedAt?.to
                ? format(data.filter_updatedAt.to, "yyyy-MM-dd")
                : undefined,
            filter_createdAt_from: data?.filter_createdAt?.from
                ? format(data.filter_createdAt.from, "yyyy-MM-dd")
                : undefined,
            filter_createdAt_to: data?.filter_createdAt?.to
                ? format(data.filter_createdAt.to, "yyyy-MM-dd")
                : undefined,
        };
        navigate(
            {
                pathname: location.pathname,
                search: encodeSearchParams(newSearch),
            },
            {}
        );
    };

    const onClose = async () => {
        navigate(
            {
                pathname: location.pathname,
                search: "",
            },
            {}
        );
        await sleep(500);
        const refForm = getRef<IBaseFormRef>(REF_TOOLBAR_FORM);
        refForm.current?.reset({});
    };
    console.log("formActual", formActual);
    return (
        <BaseForm
            onSubmit={onSubmit}
            ref={setRef(REF_TOOLBAR_FORM)}
            defaultValues={{
                ...decodeSearchParams(location.search),
            }}
        >
            <div className={cn("w-full", "mb-2", "p-2")}>
                <h2 className="font-semibold">Filtros</h2>
            </div>
            <div
                className={cn(
                    "w-full",
                    "h-full",
                    "max-h-[calc(100vh-140px)]",
                    "flex",
                    "flex-col",
                    "overflow-auto",
                    "p-2",
                    "gap-1"
                )}
            >
                <FInputLabel label={t("sku")} name="filter_sku" />
                <FInputLabel label={t("name")} name="filter_name" />
                {["productslist"].includes(formActual) ? (
                    <>
                        <FSelectLabelMulti
                            label={t("status")}
                            name="filter_status"
                            items={[
                                {
                                    id: "presente",
                                    name: "Presente",
                                },
                                {
                                    id: "permuta",
                                    name: "Permuta",
                                },
                                {
                                    id: "peça",
                                    name: "Peça",
                                },
                                {
                                    id: "processamento",
                                    name: "Processamento",
                                },
                                {
                                    id: "descarte",
                                    name: "Descarte",
                                },
                                {
                                    id: "testando",
                                    name: "Testando",
                                },
                                {
                                    id: "emprestimo",
                                    name: "Empréstimo",
                                },
                                {
                                    id: "conserto",
                                    name: "Conserto",
                                },
                                {
                                    id: "recebimento",
                                    name: "Recebimento",
                                },
                                {
                                    id: "estoque",
                                    name: "Estoque",
                                },
                                {
                                    id: "vendido",
                                    name: "Vendido",
                                },
                            ]}
                        />
                    </>
                ) : (
                    <></>
                )}
                <div className="flex items-center justify-between gap-2">
                    <FInputLabel
                        label={t("costStart")}
                        name="filter_pvCost_start"
                        type="currency"
                    />
                    <FInputLabel
                        label={t("costEnd")}
                        name="filter_pvCost_end"
                        type="currency"
                    />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <FInputLabel
                        label={t("mercadoLivreStart")}
                        name="filter_pvMercadoLivre_start"
                        type="currency"
                    />
                    <FInputLabel
                        label={t("mercadoLivreEnd")}
                        name="filter_pvMercadoLivre_end"
                        type="currency"
                    />
                </div>
                <FInputDatePickerRange
                    label={t("announcementDate")}
                    name="filter_announcementDate"
                />
                <FInputDatePickerRange
                    label={t("dateEntryInStock")}
                    name="filter_dateEntryInStock"
                />
                <FInputDatePickerRange
                    label={t("dateSale")}
                    name="filter_dateSale"
                />
                <FInputDatePickerRange
                    label={t("receiptDate")}
                    name="filter_receiptDate"
                />
                <FInputDatePickerRange
                    label={t("updatedAt")}
                    name="filter_updatedAt"
                />
                <FInputDatePickerRange
                    label={t("createdAt")}
                    name="filter_createdAt"
                />
            </div>

            <div
                className={cn(
                    "flex",
                    "w-full",
                    "items-center",
                    "justify-end",
                    "gap-2",
                    "mt-4",
                    "p-2"
                )}
            >
                <Button type="button" onClick={onClose} variant="outline">
                    {t("clean")}
                </Button>
                <FButtonSubmit label={t("filter")} />
            </div>
        </BaseForm>
    );
};
