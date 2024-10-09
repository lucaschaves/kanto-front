import { Modal } from "@/Layout/Modal";
import { Dropzone, FInputLabel, GroupForm, IBaseFormRef } from "@/components";
import { CONSTANT_TOKEN } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { getAmbientURL, getParamByPath } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageAccessoryCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");
    const formActual = getParamByPath(location.pathname, 2);

    const refForm = useRef<IBaseFormRef>(null);

    const [stateLoading, setLoading] = useState(false);
    const [file, setFile] = useState<{ url: string; file?: any }>({
        url: "",
        file: null,
    });

    const onClose = () => {
        navigate(-1);
    };

    const onUploadImage = async (id: string) => {
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
    };

    const onSubmit = async (data: FieldValues) => {
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
    };

    const getData = async () => {
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

export { PageAccessoryCreateOrEdit };
