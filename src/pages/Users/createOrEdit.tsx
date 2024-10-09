import { Modal } from "@/Layout/Modal";
import { FCheckboxLabel, FInputLabel, IBaseFormRef } from "@/components";
import { getApi, postApi, putApi } from "@/services";
import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageUserCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const getData = async () => {
        const { success, data } = await getApi({
            url: `user/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset({
                name: data?.name,
                email: data?.email,
                status: data?.status,
            });
        }
    };

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        if (isEdit) {
            const { success } = await putApi({
                url: `user/${searchParams.get("id")}`,
                body: data,
            });
            if (success) onClose();
        } else {
            const { success } = await postApi({
                url: "user",
                body: data,
            });
            if (success) onClose();
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
            className="max-w-sm"
            classNameContent="px-1"
            ref={refForm}
        >
            <FInputLabel label="Nome" name="name" />
            <FInputLabel label="Email" name="email" />
            <FCheckboxLabel label="Ativo" name="status" />
        </Modal>
    );
};

export { PageUserCreateOrEdit };
