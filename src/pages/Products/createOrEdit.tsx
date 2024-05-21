import {
    BaseForm,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Dropzone,
    FButtonSubmit,
    FInputLabel,
} from "@/components";
import { cn } from "@/lib";
import { getParamByPath } from "@/utils";
import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageProductCreateOrEdit = () => {
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
                        <FInputLabel label="Nome" name="name" />
                        <FInputLabel label="Endereço" name="address" />
                        <FInputLabel
                            label="Data da venda"
                            name="dateSale"
                            type="date"
                        />
                        <FInputLabel
                            label="Data do recebimento"
                            name="dateSale"
                            type="date"
                        />
                        <FInputLabel
                            label="Data do anúncio"
                            name="dateSale"
                            type="date"
                        />
                        <FInputLabel label="Custo" name="name" />
                        <Dropzone
                            onChange={setFiles}
                            className="w-full max-w-sm"
                            fileExtension="png"
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

export { PageProductCreateOrEdit };
