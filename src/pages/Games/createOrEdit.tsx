import { Modal } from "@/Layout/Modal";
import {
    Dropzone,
    FCheckboxLabel,
    FInputLabel,
    FSelectLabel,
    FSelectLabelMultiApi,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { CONSTANT_TOKEN } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { getAmbientURL } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const PageGameCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

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
            url: `game/upload/${id}`,
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
        let newData = data;

        newData["tagsDefault"] = "";
        if (data.conservation) newData.tagsDefault += `conservation,`;
        if (data.gameWorking) newData.tagsDefault += `gameWorking,`;
        if (data.gameSealed) newData.tagsDefault += `gameSealed,`;
        if (data.gamePackagingRental)
            newData.tagsDefault += `gamePackagingRental,`;
        if (data.gamePackaging) newData.tagsDefault += `gamePackaging,`;
        if (data.gameManual) newData.tagsDefault += `gameManual,`;

        delete newData.conservation;
        delete newData.gameWorking;
        delete newData.gameSealed;
        delete newData.gamePackagingRental;
        delete newData.gamePackaging;
        delete newData.gameManual;

        if (isEdit) {
            const { success, data: dataResp } = await putApi({
                url: `game/${searchParams.get("id")}`,
                body: newData,
            });
            if (success) {
                if (file?.file) onUploadImage(dataResp?.id);
                else onClose();
            }
        } else {
            const { success, data: dataResp } = await postApi({
                url: "game",
                body: newData,
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
            url: `game/${searchParams.get("id")}`,
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

            let newData = data;
            if (data?.tagsDefault) {
                data.tagsDefault.split(",").forEach((key: string) => {
                    newData = {
                        ...newData,
                        [key]: true,
                    };
                });
            }
            delete newData.tagsDefault;
            refForm.current?.reset(newData);
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
                <FInputLabel
                    label={t("ean")}
                    name="ean"
                    disabled={stateLoading}
                />
            </GroupForm>
            <GroupForm
                title={t("tagsDefault")}
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-2",
                    "sm:grid-cols-2",
                    `md:grid-cols-3`,
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FCheckboxLabel label={t("gameManual")} name="gameManual" />
                <FCheckboxLabel
                    label={t("gamePackaging")}
                    name="gamePackaging"
                />
                <FCheckboxLabel
                    label={t("gamePackagingRental")}
                    name="gamePackagingRental"
                />
                <FCheckboxLabel label={t("gameSealed")} name="gameSealed" />
                <FCheckboxLabel label={t("gameWorking")} name="gameWorking" />
                <FSelectLabel
                    label={t("conservation")}
                    name="conservation"
                    items={[
                        {
                            id: "1",
                            name: "1",
                        },
                        {
                            id: "2",
                            name: "2",
                        },
                        {
                            id: "3",
                            name: "3",
                        },
                        {
                            id: "4",
                            name: "4",
                        },
                        {
                            id: "5",
                            name: "5",
                        },
                    ]}
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
                    name="plataform"
                    url="/plataforms"
                    disabled={stateLoading}
                    single
                />
                <FSelectLabelMultiApi
                    label={t("developer")}
                    name="developer"
                    url="/developers"
                    disabled={stateLoading}
                    single
                />
                <FSelectLabelMultiApi
                    label={t("publisher")}
                    name="publisher"
                    url="/publishers"
                    disabled={stateLoading}
                    single
                />
                <FSelectLabelMultiApi
                    label={t("gender")}
                    name="gender"
                    url="/generous"
                    disabled={stateLoading}
                    single
                />
                <FSelectLabelMultiApi
                    label={t("parentalRating")}
                    name="parentalRating"
                    url="/parentalratings"
                    disabled={stateLoading}
                    single
                />
                <FSelectLabelMultiApi
                    label={t("numberOfPlayer")}
                    name="numberOfPlayer"
                    url="/numberofplayers"
                    disabled={stateLoading}
                    single
                />
                <FCheckboxLabel
                    label={t("specialEdition")}
                    name="specialEdition"
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
                    <Dropzone
                        onChange={setFile}
                        // disabled={stateLoading}
                        disabled
                    />
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
