import {
    BaseForm,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    FButtonSubmit,
    FInputLabel,
    IBaseFormRef,
} from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { getParamByPath } from "@/utils";
import { useCallback, useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageSettingCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const formActual = getParamByPath(location.pathname, 2);
    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const getData = useCallback(async () => {
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
    }, [formActual, searchParams]);

    const onClose = useCallback(() => {
        navigate(-1);
    }, []);

    const onSubmit = useCallback(
        async (data: FieldValues) => {
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
        },
        [onClose, formActual, searchParams, isEdit]
    );

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Dialog modal open onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? t("edit") : t("add")}</DialogTitle>
                </DialogHeader>
                <div
                    className={cn(
                        "flex",
                        "flex-col",
                        "w-full",
                        "justify-center",
                        "items-center",
                        "gap-0",
                        "md:gap-2",
                        "md:flex-row",
                        "md:flex-wrap",
                        "md:justify-start"
                    )}
                >
                    <BaseForm ref={refForm} onSubmit={onSubmit}>
                        <FInputLabel label="Nome" name="name" />
                        <div
                            className={cn(
                                "flex",
                                "w-full",
                                "items-center",
                                "justify-end",
                                "gap-2",
                                "mt-4"
                            )}
                        >
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="outline"
                            >
                                Cancelar
                            </Button>
                            <FButtonSubmit label="Salvar" />
                        </div>
                    </BaseForm>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { PageSettingCreateOrEdit };
