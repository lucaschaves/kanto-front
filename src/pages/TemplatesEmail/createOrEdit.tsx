import { Modal } from "@/Layout/Modal";
import {
    Editor,
    FInputLabel,
    GroupForm,
    IBaseFormRef,
    IRefEditor,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { sleep } from "@/utils";
import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PageTemplatesEmailCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("/edit");

    const refEditor = useRef<IRefEditor>(null);
    const refForm = useRef<IBaseFormRef>(null);

    const onClose = () => navigate(-1);

    const onSubmit = async (data: FieldValues) => {
        if (isEdit) {
            const { success } = await putApi({
                url: `/templatesemail/${searchParams.get("id")}`,
                body: data,
            });
            if (success) {
                onClose();
            }
        } else {
            const { success } = await postApi({
                url: "/templatesemail",
                body: data,
            });
            if (success) {
                onClose();
            }
        }
    };

    const getData = async () => {
        const { success, data } = await getApi({
            url: `/templatesemail/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset(data);
            await sleep(50);
            refEditor.current?.addBody(data?.body);
        }
    };

    const handleInserTag = (v: any) => {
        const oldValue = refForm.current?.watch("body") || "";
        refEditor.current?.addBody(`${oldValue} ${v}`);
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
                title={t("")}
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-2",
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FInputLabel label={t("name")} name="name" />
                <FInputLabel label={t("subject")} name="subject" />
                <Select onValueChange={handleInserTag}>
                    <SelectTrigger>Inserir Tag</SelectTrigger>
                    <SelectContent>
                        <SelectItem value="{{name}}">Nome</SelectItem>
                        <SelectItem value="{{email}}">Email</SelectItem>
                        <SelectItem value="{{totalCredit}}">
                            Total de crédito
                        </SelectItem>
                        <SelectItem value="{{totalDinheiro}}">
                            Total de dinheiro
                        </SelectItem>
                        <SelectItem value="{{items}}">Itens</SelectItem>
                    </SelectContent>
                </Select>
                <Editor
                    ref={refEditor}
                    className="max-h-96 overflow-auto col-span-2"
                    value={refForm.current?.watch("body")}
                    onChangeHtml={(p) => refForm.current?.setValue("body", p)}
                />
            </GroupForm>
        </Modal>
    );
};
