import { Modal } from "@/Layout/Modal";
import {
    Dropzone,
    FInputLabel,
    FSelectLabelMultiApi,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { CONSTANT_TOKEN } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { getAmbientURL, getParamByPath } from "@/utils";
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
    const formActual = getParamByPath(location.pathname, 2);

    const refForm = useRef<IBaseFormRef>(null);

    const [stateLoading, setLoading] = useState(false);
    const [modeView, setModeView] = useState<"groups" | "tabs">("groups");
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
                    url: formActual.substring(0, formActual.length - 1),
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
        setLoading(true);
        const { success, data } = await getApi({
            url: `${formActual.substring(
                0,
                formActual.length - 1
            )}/${searchParams.get("id")}`,
        });
        if (success) {
            if (data.images?.image) {
                setFile({
                    url: `${getAmbientURL()}${
                        data.images?.image
                    }?token=${window.sessionStorage.getItem(CONSTANT_TOKEN)}`,
                });
            }
            delete data.images;
            refForm.current?.reset(data);
        }
        setLoading(false);
    }, [formActual, searchParams]);

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
                    label={t("name")}
                    name="name"
                    disabled={stateLoading}
                    className="col-span-2"
                />
                <FInputLabel
                    label={t("ean")}
                    name="ean"
                    disabled={stateLoading}
                />
            </GroupForm>
            <GroupForm
                title={t("dados")}
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
                    label={t("releaseYear")}
                    name="releaseYear"
                    disabled={stateLoading}
                    rules={{
                        min: {
                            value: 1900,
                            message: "Valor mínimo é 1900",
                        },
                        max: {
                            value: new Date().getFullYear(),
                            message: `Valor mínimo é ${new Date().getFullYear()}`,
                        },
                    }}
                    type="number"
                />
                <FSelectLabelMultiApi
                    label={t("plataform")}
                    name="plataformId"
                    url="/plataforms"
                    disabled={stateLoading}
                />
                <FSelectLabelMultiApi
                    label={t("developer")}
                    name="developerId"
                    url="/developers"
                    disabled={stateLoading}
                />
                <FSelectLabelMultiApi
                    label={t("publisher")}
                    name="publisherId"
                    url="/publishers"
                    disabled={stateLoading}
                />
                <FSelectLabelMultiApi
                    label={t("gender")}
                    name="genderId"
                    url="/generous"
                    disabled={stateLoading}
                />
                <FSelectLabelMultiApi
                    label={t("parentalRating")}
                    name="parentalRatingId"
                    url="/parentalratings"
                    disabled={stateLoading}
                />
                <FSelectLabelMultiApi
                    label={t("numberOfPlayer")}
                    name="numberOfPlayerId"
                    url="/numberofplayers"
                    disabled={stateLoading}
                />
            </GroupForm>
            <GroupForm
                title={t("images")}
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
                    <Dropzone onChange={setFile} disabled={stateLoading} />
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
            </GroupForm>
        </Modal>
    );
};

export { PageGameCreateOrEdit };
