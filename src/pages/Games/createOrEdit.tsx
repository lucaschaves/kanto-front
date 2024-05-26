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
    FSelectLabelMultiApi,
    IBaseFormRef,
} from "@/components";
import { CONSTANT_TOKEN } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { getParamByPath } from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageGameCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");
    const formActual = getParamByPath(location.pathname, 1);

    const refForm = useRef<IBaseFormRef>(null);

    const [file, setFile] = useState<{ url: string; file?: any }>({
        url: "",
        file: null,
    });

    const onClose = useCallback(() => {
        navigate(-1);
    }, []);

    const onUploadImage = useCallback(
        async (id: string) => {
            const formFile = new FormData();
            formFile.append("image", file?.file);
            const { success } = await postApi({
                url: `${formActual.substring(
                    0,
                    formActual.length - 1
                )}/upload/${id}`,
                body: formFile,
                config: {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            });
            if (success) onClose();
        },
        [file, formActual]
    );

    const onSubmit = useCallback(
        async (data: FieldValues) => {
            if (isEdit) {
                const { success, data: dataResp } = await putApi({
                    url: `${formActual.substring(
                        0,
                        formActual.length - 1
                    )}/${searchParams.get("id")}`,
                    body: data,
                });
                if (success) {
                    if (file?.file) onUploadImage(dataResp?.id);
                    else onClose();
                }
            } else {
                const { success, data: dataResp } = await postApi({
                    url: formActual,
                    body: data,
                });
                if (success) {
                    if (file?.file) onUploadImage(dataResp?.id);
                    else onClose();
                }
            }
        },
        [onClose, isEdit, formActual, onUploadImage, file]
    );

    const getData = useCallback(async () => {
        const { success, data } = await getApi({
            url: `${formActual.substring(
                0,
                formActual.length - 1
            )}/${searchParams.get("id")}`,
        });
        if (success) {
            if (data.images?.image) {
                setFile({
                    url: `http://localhost:4000${
                        data.images?.image
                    }?token=${window.sessionStorage.getItem(CONSTANT_TOKEN)}`,
                });
            }
            delete data.images;
            refForm.current?.reset(data);
        }
    }, [formActual, searchParams]);

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Dialog modal open onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? t("edit") : t("add")}</DialogTitle>
                </DialogHeader>
                <div
                    className={cn(
                        "w-full",
                        "grid",
                        "grid-cols-2",
                        "sm:grid-cols-2",
                        "md:grid-cols-3",
                        "gap-1",
                        "sm:gap-2"
                    )}
                >
                    <BaseForm onSubmit={onSubmit} ref={refForm}>
                        {/* <FInputLabel label={t("id")} name="id" disabled /> */}
                        <FInputLabel label={t("name")} name="name" />
                        <FInputLabel label={t("ean")} name="ean" />
                        <FSelectLabelMultiApi
                            label={t("console")}
                            name="consoleId"
                            url="/consoles"
                        />
                        <FSelectLabelMultiApi
                            label={t("developer")}
                            name="developerId"
                            url="/developers"
                        />
                        <FSelectLabelMultiApi
                            label={t("publisher")}
                            name="publisherId"
                            url="/publishers"
                        />
                        <FSelectLabelMultiApi
                            label={t("releaseYear")}
                            name="releaseYearId"
                            url="/releaseyears"
                        />
                        <FSelectLabelMultiApi
                            label={t("gender")}
                            name="genderId"
                            url="/generous"
                        />
                        <FSelectLabelMultiApi
                            label={t("parentalRating")}
                            name="parentalRatingId"
                            url="/parentalratings"
                        />
                        <FSelectLabelMultiApi
                            label={t("numberOfPlayer")}
                            name="numberOfPlayerId"
                            url="/numberofplayers"
                        />
                        <div
                            className={cn(
                                "flex",
                                "flex-col",
                                "space-y-2",
                                file?.url ? "col-span-2" : "col-span-3"
                            )}
                        >
                            <label
                                className={cn(
                                    "text-sm",
                                    "font-medium",
                                    "leading-none",
                                    "peer-disabled:cursor-not-allowed",
                                    "peer-disabled:opacity-70"
                                )}
                            >
                                {t("image")}
                            </label>
                            <Dropzone onChange={setFile} />
                        </div>
                        {file?.url ? (
                            <div className="flex flex-col space-y-2">
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
                                    src={file?.url}
                                    className={cn(
                                        "rounded-lg",
                                        "h-32",
                                        "object-contain"
                                    )}
                                />
                            </div>
                        ) : (
                            <></>
                        )}
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
                    </BaseForm>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { PageGameCreateOrEdit };
