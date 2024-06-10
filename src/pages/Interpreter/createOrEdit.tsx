import {
    BaseForm,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    FButtonSubmit,
    FSelectLabel,
    IBaseFormRef,
} from "@/components";
import { cn } from "@/lib";
import { modulesSettings } from "@/routes/modules";
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
        <Dialog modal open onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("import")}</DialogTitle>
                </DialogHeader>
                <div
                    className={cn(
                        "flex",
                        "flex-col",
                        "w-full",
                        "justify-center",
                        "items-center",
                        "gap-0"
                    )}
                >
                    <BaseForm ref={refForm} onSubmit={onSubmit}>
                        <span>
                            {location.state?.ids?.length} Items a serem
                            importados para
                        </span>
                        <FSelectLabel
                            label={t("table")}
                            name="table"
                            items={modulesSettings.map((key) => ({
                                id: key.name,
                                name: t(key.name),
                            }))}
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
                                {t("cancel")}
                            </Button>
                            <FButtonSubmit label={t("save")} />
                        </div>
                    </BaseForm>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { PageInterpreterCreateOrEdit };
