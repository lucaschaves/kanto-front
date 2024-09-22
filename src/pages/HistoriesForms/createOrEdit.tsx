import { Modal } from "@/Layout/Modal";
import { FSelectLabelSingleApi, GroupForm, IBaseFormRef } from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { useCallback, useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PageHistoriesFormsCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const onClose = useCallback(() => {
        navigate(-1);
    }, []);

    const onSubmit = useCallback(
        async (data: FieldValues) => {
            if (isEdit) {
                const { success } = await putApi({
                    url: `/HistoriesForms/${searchParams.get("id")}`,
                    body: data,
                });
                if (success) {
                    onClose();
                }
            } else {
                const { success } = await postApi({
                    url: "/HistoriesForms",
                    body: data,
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
            url: `/HistoriesForms/${searchParams.get("id")}`,
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
                    label={t("region")}
                    name="regionId"
                    url="/regions"
                />
            </GroupForm>
        </Modal>
    );
};
