import { Modal } from "@/Layout/Modal";
import {
    FInputDatePicker,
    FInputLabel,
    FSelectLabel,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { capitalize } from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PageProductCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);
    const [fieldsPayments, setFieldsPyments] = useState<string[]>([]);

    const onClose = useCallback(() => {
        navigate(-1);
    }, []);

    const onSubmit = useCallback(
        async (data: FieldValues) => {
            console.log("data", data);
            if (isEdit) {
                const { success } = await putApi({
                    url: `/product/${searchParams.get("id")}`,
                    body: {
                        ...data,
                        productRegistrationId: data?.productRegistrationId?.id,
                    },
                });
                if (success) {
                    onClose();
                }
            } else {
                const { success } = await postApi({
                    url: "/product",
                    body: {
                        ...data,
                        productRegistrationId: data?.productRegistrationId?.id,
                    },
                });
                if (success) {
                    onClose();
                }
            }
        },
        [onClose, isEdit]
    );

    const getData = useCallback(async () => {
        const { success, data } = await getApi({
            url: `/product/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset(data);
        }
    }, [searchParams]);

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={isEdit ? t("edit") : t("add")}
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
                <FSelectLabelSingleApi
                    label={t("productRegistration")}
                    name="productRegistrationId"
                    url="/productsregistration"
                    keyValue="factory.name"
                    onEffect={(e) => {
                        setFieldsPyments(e.PaymentPv);
                        refForm.current?.setValue(
                            "pvMercadoLivre",
                            e.pvMercadoLivre
                        );
                        refForm.current?.setValue("pvCost", e.pvCost);
                        e.PaymentPv?.forEach((k: any) => {
                            refForm.current?.setValue(k.name, e[k.name]);
                        });
                    }}
                />
                <FInputLabel label={t("name")} name="name" />
                <FInputLabel
                    label={t("addressInStock")}
                    name="addressInStock"
                />

                <FInputDatePicker
                    label={t("announcementDate")}
                    name="announcementDate"
                />
                <FInputDatePicker label={t("dateSale")} name="dateSale" />
                <FSelectLabel
                    label={t("status")}
                    name="status"
                    items={[
                        {
                            id: "Presente",
                            name: "Presente",
                        },
                        {
                            id: "Permuta",
                            name: "Permuta",
                        },
                        {
                            id: "Peça",
                            name: "Peça",
                        },
                        {
                            id: "Processamento",
                            name: "Processamento",
                        },
                        {
                            id: "Descarte",
                            name: "Descarte",
                        },
                        {
                            id: "Testando",
                            name: "Testando",
                        },
                        {
                            id: "Empréstimo",
                            name: "Empréstimo",
                        },
                        {
                            id: "Conserto",
                            name: "Conserto",
                        },
                        {
                            id: "Processando",
                            name: "Processando",
                        },
                        {
                            id: "Recebimento",
                            name: "Recebimento",
                        },
                        {
                            id: "Estoque",
                            name: "Estoque",
                        },
                    ]}
                />
            </GroupForm>
            <GroupForm
                title={t("prices")}
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
                <FInputLabel
                    label={t("cost")}
                    name="pvCost"
                    type="currency"
                    disabled
                />
                <FInputLabel
                    label={t("pvMercadoLivre")}
                    name="pvMercadoLivre"
                    type="currency"
                    disabled
                />
                {fieldsPayments?.map((k: any) => (
                    <FInputLabel
                        key={k.name}
                        label={capitalize(t(k.name))}
                        name={k.name}
                        type="currency"
                        disabled
                    />
                ))}
            </GroupForm>
        </Modal>
    );
};
