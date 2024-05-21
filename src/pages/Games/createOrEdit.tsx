import {
    BaseForm,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    FButtonSubmit,
    FInputLabel,
    FSelectLabelApi,
} from "@/components";
import { cn } from "@/lib";
import { getParamByPath } from "@/utils";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageGameCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");
    const formActual = getParamByPath(location.pathname, 1);

    const [files, setFiles] = useState<string[]>([]);

    const onClose = useCallback(() => {
        navigate(-1);
    }, []);

    const onSubmit = useCallback(
        (data: FieldValues) => {
            onClose();
        },
        [onClose]
    );

    return (
        <Dialog modal open onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
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
                    <BaseForm onSubmit={onSubmit}>
                        <FInputLabel label={t("name")} name="name" />
                        <FInputLabel label={t("ean")} name="ean" />
                        <FSelectLabelApi
                            label={t("console")}
                            name="consoleId"
                            url="/consoles"
                        />
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

export { PageGameCreateOrEdit };
