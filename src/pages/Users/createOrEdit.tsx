import { Modal } from "@/Layout/Modal";
import {
    FCheckboxLabel,
    FInputLabel,
    FSelectLabelApi,
    IBaseFormRef,
} from "@/components";
import { getApi, postApi, putApi } from "@/services";
import { messageError } from "@/utils";
import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageUserCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("/edit");

    const refForm = useRef<IBaseFormRef>(null);

    const getData = async () => {
        const { success, data } = await getApi({
            url: `user/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset({
                ...data,
                permissionsId: data?.permissionsId?.toString(),
            });
        }
    };

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        if (isEdit) {
            if (data?.newPassword === data?.confirmPassword) {
                const { success } = await putApi({
                    url: `user/${searchParams.get("id")}`,
                    body: data,
                });
                if (success) {
                    onClose();
                }
            } else {
                refForm.current?.setError("newPassword", { message: "" });
                refForm.current?.setError("confirmPassword", { message: "" });
                messageError({ message: "as senhas devem coincidir" });
            }
        } else {
            if (data?.confirmPassword === data?.password) {
                const { success } = await postApi({
                    url: "user",
                    body: data,
                });
                if (success) {
                    onClose();
                }
            } else {
                messageError({ message: "as senhas devem coincidir" });
                refForm.current?.setError("password", { message: "" });
                refForm.current?.setError("confirmPassword", { message: "" });
            }
        }
    };

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Modal
            onClose={onClose}
            onSubmit={onSubmit}
            title={isEdit ? t("edit") : t("add")}
            classNameContent="px-1"
            ref={refForm}
            defaultValues={{
                status: true,
            }}
        >
            <div className="flex items-center justify-start gap-6">
                <FInputLabel label="Nome" name="name" />
                <FCheckboxLabel label="Ativo" name="status" row />
            </div>
            <FInputLabel label="Email" name="email" />
            <FSelectLabelApi
                label="Grupo de permissão"
                name="permissionsId"
                url="/permissions/all"
                forceRows
            />
            {!isEdit ? (
                <FInputLabel
                    label={isEdit ? "Senha atual" : "Senha"}
                    name="password"
                    type="password"
                />
            ) : (
                <></>
            )}
            {isEdit ? (
                <FInputLabel
                    label="Nova senha"
                    name="newPassword"
                    type="password"
                />
            ) : (
                <></>
            )}
            <FInputLabel
                label="Confirme a Senha"
                name="confirmPassword"
                type="password"
            />
        </Modal>
    );
};

export { PageUserCreateOrEdit };
