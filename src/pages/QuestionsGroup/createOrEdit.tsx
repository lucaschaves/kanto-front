import { Modal } from "@/Layout/Modal";
import {
    FSelectLabel,
    FSelectLabelMultiApi,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { dataItemsType } from "../Catalog/createOrEdit";

export const PageQuestionsGroupCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const [stateType, setType] = useState("game");

    const isEdit = location.pathname.includes("/edit");

    const refForm = useRef<IBaseFormRef>(null);

    const onClose = () => navigate(-1);

    const onSubmit = async (data: FieldValues) => {
        let newData = {
            category: data?.category ? data.category : null,
            console: data?.console ? data.console[0] : null,
            game: data?.game ? data.game[0] : null,
            question: data?.question ? data.question : null,
            type: data.type,
        };
        if (isEdit) {
            const { success } = await putApi({
                url: `/questionsgroup/${searchParams.get("id")}`,
                body: newData,
            });
            if (success) {
                onClose();
            }
        } else {
            const { success } = await postApi({
                url: "/questionsgroup",
                body: newData,
            });
            if (success) {
                onClose();
            }
        }
    };

    const getData = async () => {
        const { success, data } = await getApi({
            url: `/questionsgroup/${searchParams.get("id")}`,
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
            defaultValues={{ type: stateType }}
        >
            <GroupForm
                title={t("general")}
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-2",
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FSelectLabel
                    label={t("type")}
                    name="type"
                    items={dataItemsType}
                    onEffect={(e) => setType(e)}
                />
                {stateType === "game" ? (
                    <FSelectLabelMultiApi
                        label={t("game")}
                        name="game"
                        url="/games"
                        single
                    />
                ) : stateType === "console" ? (
                    <FSelectLabelSingleApi
                        label={t("console")}
                        name="console"
                        url="/consoles"
                    />
                ) : stateType === "extra" ? (
                    <FSelectLabelSingleApi
                        label={t("extra")}
                        name="extra"
                        url="/extras"
                    />
                ) : (
                    <FSelectLabelSingleApi
                        label={t("accessory")}
                        name="accessory"
                        url="/acessories"
                    />
                )}
                <FSelectLabelSingleApi
                    label={t("question")}
                    name="question"
                    url="/questions"
                    keyValue="question"
                    className="col-span-2"
                />
            </GroupForm>
        </Modal>
    );
};
