import { Modal } from "@/Layout/Modal";
import {
    FCheckboxLabel,
    FInputLabel,
    FSelectLabel,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PageQuestionCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("/edit");

    const refForm = useRef<IBaseFormRef>(null);

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        if (isEdit) {
            const { success } = await putApi({
                url: `/question/${searchParams.get("id")}`,
                body: data,
            });
            if (success) {
                onClose();
            }
        } else {
            const { success } = await postApi({
                url: "/question",
                body: data,
            });
            if (success) {
                onClose();
            }
        }
    };

    const getData = async () => {
        const { success, data } = await getApi({
            url: `/question/${searchParams.get("id")}`,
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
                <FInputLabel
                    label={t("question")}
                    name="question"
                    className="col-span-2 md:col-span-3"
                />
                <FCheckboxLabel label={t("complete")} name="complete" />
                <FCheckboxLabel label={t("manual")} name="manual" />
                <FCheckboxLabel label={t("packaging")} name="packaging" />
                <FCheckboxLabel label={t("sealed")} name="sealed" />
                <FCheckboxLabel label={t("standard")} name="standard" />
                <FCheckboxLabel label={t("unlocked")} name="unlocked" />
                <FCheckboxLabel label={t("withBox")} name="withBox" />
                <FCheckboxLabel label={t("working")} name="working" />
                <FSelectLabel
                    label={t("conservation")}
                    name="conservation"
                    items={[
                        {
                            id: "1",
                            name: "1",
                        },
                        {
                            id: "2",
                            name: "2",
                        },
                        {
                            id: "3",
                            name: "3",
                        },
                    ]}
                />
            </GroupForm>
        </Modal>
    );
};
