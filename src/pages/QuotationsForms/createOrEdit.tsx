import { Modal } from "@/Layout/Modal";
import { FInputLabel, GroupForm, IBaseFormRef } from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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
        if (isEdit) {
            const { success } = await putApi({
                url: `/quotationsform/${searchParams.get("id")}`,
                body: data,
            });
            if (success) {
                onClose();
            }
        } else {
            const { success } = await postApi({
                url: "/quotationsform",
                body: data,
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
        }
    };

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
                <FInputLabel label="Id" name="id" disabled />
                <FInputLabel
                    label="Nome"
                    name="providerId.name"
                    className="col-span-2"
                />
            </GroupForm>
            <GroupForm
                title={t("contact")}
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
                <FInputLabel label="Telefone" name="providerId.phone" />
                <FInputLabel
                    label="Email"
                    name="providerId.email"
                    className="col-span-2"
                />
                <FInputLabel
                    label="Origem do contato"
                    name="providerId.originContact"
                />
                <FInputLabel
                    label="Endereço"
                    name="providerId.address"
                    className="col-span-2"
                />
            </GroupForm>
        </Modal>
    );
};
