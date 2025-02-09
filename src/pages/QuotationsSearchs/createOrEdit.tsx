import { Modal } from "@/Layout/Modal";
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    FInputLabel,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    GroupForm,
    IBaseFormRef,
    Textarea,
} from "@/components";
import { CONSTANT_TOKEN } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PageQuotationsSearchCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("/edit");

    const refForm = useRef<IBaseFormRef>(null);

    const [file, setFile] = useState("");
    const [openFile, setOpenFile] = useState(false);

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        if (isEdit) {
            const { success } = await putApi({
                url: `/quotationssearch/${searchParams.get("id")}`,
                body: data,
            });
            if (success) {
                onClose();
            }
        } else {
            const { success } = await postApi({
                url: "/quotationssearch",
                body: data,
            });
            if (success) {
                onClose();
            }
        }
    };

    const getData = async () => {
        const { success, data } = await getApi({
            url: `/quotationssearch/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset(data);
            if (data.images?.image) {
                setFile(
                    `http://localhost:4000${
                        data.images?.image
                    }?token=${window.sessionStorage.getItem(CONSTANT_TOKEN)}`
                );
            }
        }
    };

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <>
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
                        label={t("quantity")}
                        name="quantity"
                        readOnly
                    />
                    <FInputLabel label={t("game")} name="game.name" readOnly />
                    <FInputLabel
                        label={t("console")}
                        name="consoles.name"
                        readOnly
                    />
                    <FInputLabel
                        label={t("question")}
                        name="question.question"
                        readOnly
                    />
                    <FormField
                        name="comments"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Comentários</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder=""
                                            className="resize-none"
                                            readOnly
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    {file ? (
                        <div className="flex flex-col space-y-2 relative">
                            <label
                                className={cn(
                                    "text-sm",
                                    "font-medium",
                                    "leading-none",
                                    "peer-disabled:cursor-not-allowed",
                                    "peer-disabled:opacity-70"
                                )}
                            >
                                {t("preview")}
                            </label>
                            <img
                                src={file}
                                className={cn(
                                    "rounded-lg",
                                    "h-32",
                                    "object-contain"
                                )}
                            />
                            <Button
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenFile(true);
                                }}
                                variant="ghost"
                                className="absolute right-0 -top-4"
                            >
                                <EnterFullScreenIcon />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-2 relative">
                            <label
                                className={cn(
                                    "text-sm",
                                    "font-medium",
                                    "leading-none",
                                    "peer-disabled:cursor-not-allowed",
                                    "peer-disabled:opacity-70"
                                )}
                            >
                                {t("preview")}
                            </label>
                            <div>Imagem não disponível</div>
                        </div>
                    )}
                </GroupForm>
                <GroupForm
                    title={t("comments")}
                    className={cn("w-full", "gap-1", "sm:gap-2", "px-3")}
                >
                    <FormField
                        name="reviewComments"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel>Comentário Kanto</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder=""
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </GroupForm>
            </Modal>

            <Dialog modal open={openFile} onOpenChange={setOpenFile}>
                <DialogContent className={cn("p-5")}>
                    <DialogHeader>Imagem</DialogHeader>
                    <div className="w-full h-full ">
                        <img
                            src={file}
                            className={cn(
                                "rounded-lg",
                                "h-full",
                                "object-contain"
                            )}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
