import { Modal } from "@/Layout/Modal";
import { FInputLabel, IBaseFormRef } from "@/components";
import { getApi, postApi, putApi } from "@/services";
import { getParamByPath } from "@/utils";
import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageSettingCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const formActual = getParamByPath(location.pathname, 2);
    const isEdit = location.pathname.includes("/edit");

    const refForm = useRef<IBaseFormRef>(null);

    const getData = async () => {
        const { success, data } = await getApi({
            url: `${formActual.substring(
                0,
                formActual.length - 1
            )}/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset({
                name: data?.name,
            });
        }
    };

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        if (isEdit) {
            const { success } = await putApi({
                url: `${formActual.substring(
                    0,
                    formActual.length - 1
                )}/${searchParams.get("id")}`,
                body: data,
            });
            if (success) onClose();
        } else {
            const { success } = await postApi({
                url: formActual.substring(0, formActual.length - 1),
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
        </Modal>
    );
};

export { PageSettingCreateOrEdit };
