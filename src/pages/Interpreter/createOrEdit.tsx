import { Modal } from "@/Layout/Modal";
import { FSelectLabel, IBaseFormRef } from "@/components";
import { modulesFactory } from "@/routes/modules";
import { postApi } from "@/services";
import { useCallback, useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const PageInterpreterCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const refForm = useRef<IBaseFormRef>(null);

    const onClose = useCallback(() => {
        navigate(-1);
    }, []);

    const onSubmit = useCallback(
        async (data: FieldValues) => {
            const { ids, table } = data;
            const dataIds = ids?.map((id: any) => ({ name: id }));
            const { success } = await postApi({
                url: table,
                body: {
                    data: dataIds,
                },
            });
            if (success) onClose();
        },
        [onClose]
    );

    useEffect(() => {
        refForm.current?.reset({
            ...location.state,
        });
    }, [location.pathname]);

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={t("import")}
            className="max-w-sm"
        >
            <span>
                {location.state?.ids?.length} Items a serem importados para
            </span>
            <FSelectLabel
                label={t("table")}
                name="table"
                items={modulesFactory.map((key) => ({
                    id: key.name,
                    name: t(key.name),
                }))}
            />
        </Modal>
    );
};

export { PageInterpreterCreateOrEdit };
