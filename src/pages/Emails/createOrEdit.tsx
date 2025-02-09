import { Modal } from "@/Layout/Modal";
import {
    FInputDatePicker,
    FInputLabel,
    FTextarea,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { cn } from "@/lib";
import { getApi } from "@/services";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PageEmailsCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("/edit");

    const refForm = useRef<IBaseFormRef>(null);

    const [, setLoading] = useState(false);

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (_data: FieldValues) => {};

    const getData = async () => {
        setLoading(true);
        const { success, data } = await getApi({
            url: `/email/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={t("edit")}
        >
            <GroupForm
                title={t("general")}
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
                <FInputLabel label={t("name")} name="to_name" readOnly />
                <FInputLabel label={t("email")} name="to_email" readOnly />
                <FInputLabel label={t("subject")} name="subject" readOnly />
                <FInputDatePicker
                    label={t("sent_at")}
                    name="sent_at"
                    readOnly
                />
                <FTextarea
                    label={t("text")}
                    name="text"
                    readOnly
                    className="col-span-2"
                    rows={5}
                />
            </GroupForm>
        </Modal>
    );
};
