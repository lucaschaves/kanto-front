import {
    BaseForm,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    FButtonSubmit,
    IBaseFormRef,
    ScrollArea,
} from "@/components";
import { cn } from "@/lib";
import { ReactNode, forwardRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IPropsModal {
    children: ReactNode;
    title?: string;
    className?: string;
    classNameContent?: string;
    onClose: () => void;
    onSubmit: (data: FieldValues) => void;
}
export const Modal = forwardRef<IBaseFormRef, IPropsModal>((props, ref) => {
    const { children, title, onClose, onSubmit, className, classNameContent } =
        props;

    const { t } = useTranslation();

    return (
        <Dialog modal open onOpenChange={onClose}>
            <DialogContent className={cn("max-w-4xl", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <BaseForm ref={ref} onSubmit={onSubmit}>
                    <div
                        className={cn(
                            "w-full",
                            "flex",
                            "flex-col",
                            "max-h-[90vh]",
                            "overflow-hidden"
                        )}
                    >
                        <ScrollArea className={cn("max-h-[70vh]", "pb-5")}>
                            <div
                                className={cn(
                                    "flex",
                                    "flex-col",
                                    "gap-2",
                                    "w-full",
                                    "h-full",
                                    "pb-2",
                                    classNameContent
                                )}
                            >
                                {children}
                            </div>
                        </ScrollArea>
                        <div className="col-span-2"></div>
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
                    </div>
                </BaseForm>
            </DialogContent>
        </Dialog>
    );
});
