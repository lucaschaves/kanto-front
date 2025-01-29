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
    disabled?: boolean;
    defaultValues?: any;
    dirtyFields?: () => void;
    onClose: () => void;
    onSubmit?: (data: FieldValues) => void;
    footer?: any;
    maxWidth?: string;
    disabledForm?: boolean;
}

export const Modal = forwardRef<IBaseFormRef, IPropsModal>((props, ref) => {
    const {
        children,
        disabled,
        title,
        onClose,
        onSubmit = () => ({}),
        className,
        classNameContent,
        defaultValues,
        dirtyFields,
        footer,
        maxWidth = "max-w-4xl",
        disabledForm = false,
    } = props;

    const { t } = useTranslation();

    return (
        <Dialog
            modal
            open
            onOpenChange={() => {
                if (!disabled) {
                    onClose();
                }
            }}
        >
            <DialogContent className={cn(maxWidth, className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {disabledForm ? (
                    <div
                        className={cn(
                            "w-full",
                            "flex",
                            "flex-col",
                            "max-h-[90vh]",
                            "overflow-hidden"
                        )}
                    >
                        {children}
                    </div>
                ) : (
                    <BaseForm
                        ref={ref}
                        onSubmit={onSubmit}
                        defaultValues={defaultValues}
                        dirtyFields={dirtyFields}
                    >
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
                            <div
                                className={cn(
                                    "flex",
                                    "w-full",
                                    "items-center",
                                    "justify-between",
                                    "gap-2",
                                    "mt-4"
                                )}
                            >
                                <div>{footer}</div>
                                <div
                                    className={cn(
                                        "flex",
                                        "w-full",
                                        "items-center",
                                        "justify-end",
                                        "gap-2"
                                    )}
                                >
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        variant="outline"
                                        disabled={disabled}
                                    >
                                        {t("cancel")}
                                    </Button>
                                    <FButtonSubmit
                                        label={t("save")}
                                        disabled={disabled}
                                    />
                                </div>
                            </div>
                        </div>
                    </BaseForm>
                )}
            </DialogContent>
        </Dialog>
    );
});
