import { Modal } from "@/Layout/Modal";
import {
    Dropzone,
    FCheckboxLabel,
    FInputLabel,
    FSelectLabel,
    FSelectLabelSingleApi,
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

export const dataItemsType = [
    {
        id: "game",
        name: "Game",
    },
    {
        id: "console",
        name: "Console",
    },
    {
        id: "accessory",
        name: "Acessório",
    },
    {
        id: "extra",
        name: "Extra",
    },
];

export const PageCatalogCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const [, setLoading] = useState(false);
    const [stateType, setType] = useState("");
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
            url: `catalog/upload/${id}`,
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
                url: `/catalog/${searchParams.get("id")}`,
                body: data,
            });
            if (success) {
                if (file?.file) onUploadImage(dataResp?.id);
                else onClose();
            }
        } else {
            const { success, data: dataResp } = await postApi({
                url: "/catalog",
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
            url: `/catalog/${searchParams.get("id")}`,
        });
        if (success) {
            if (data.images?.image) {
                setFile({
                    url: `${getAmbientURL()}${
                        data.images?.image
                    }?token=${window.sessionStorage.getItem(CONSTANT_TOKEN)}`,
                });
            }

            const payments: any[] = [];
            data?.payments?.forEach((k: any) => {
                payments.push(k);
            });
            let newData = data;
            data?.payments?.forEach((k: any) => {
                newData = {
                    ...newData,
                    [k.name]: k.value,
                };
            });
            delete newData.payments;
            delete newData.images;
            refForm.current?.reset(newData);
            setType(newData.type);
            setLoading(false);
        }
    };

    const onEffectFactory = (tags: string) => {
        tags?.split(",")
            .filter((key) => !!key)
            .forEach((key) => {
                refForm.current?.setValue(key, true);
            });
    };

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={`${isEdit ? t("edit") : t("add")} catálogo`}
        >
            <GroupForm
                title={t("general")}
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-2",
                    "sm:grid-cols-2",
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FSelectLabel
                    label={t("type")}
                    name="type"
                    items={dataItemsType}
                    onEffect={(e) => setType(e)}
                />
                <FSelectLabelSingleApi
                    label={t("factory")}
                    name="factory"
                    url="/catalogs/factory"
                    dependencies={["type"]}
                    onEffect={(e) => onEffectFactory(e?.tagsDefault)}
                />
                <FSelectLabelSingleApi
                    label={t("region")}
                    name="region"
                    url="/regions"
                />
                <FCheckboxLabel label={t("unique")} name="unique" />
            </GroupForm>
            {stateType === "console" ? (
                <GroupForm
                    title={t("consoles")}
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
                    <FCheckboxLabel
                        label={t("consoleComplete")}
                        name="consoleComplete"
                    />
                    <FCheckboxLabel
                        label={t("consolePackaging")}
                        name="consolePackaging"
                    />
                    <FCheckboxLabel
                        label={t("consoleSealed")}
                        name="consoleSealed"
                    />
                    <FCheckboxLabel
                        label={t("consoleTypeUnlocked")}
                        name="consoleTypeUnlocked"
                    />
                    <FCheckboxLabel
                        label={t("consoleUnlocked")}
                        name="consoleUnlocked"
                    />
                    <FCheckboxLabel
                        label={t("consoleWorking")}
                        name="consoleWorking"
                    />
                </GroupForm>
            ) : stateType === "game" ? (
                <GroupForm
                    title={t("games")}
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
                    <FCheckboxLabel
                        label={t("gameWorking")}
                        name="gameWorking"
                    />
                    <FSelectLabel
                        label={t("gameConversation")}
                        name="gameConversation"
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
            ) : (
                <></>
            )}
            <GroupForm
                title={t("prices")}
                className={cn(
                    "w-full",
                    "grid",
                    "grid-cols-2",
                    "sm:grid-cols-2",
                    "gap-1",
                    "sm:gap-2",
                    "px-3"
                )}
            >
                <FInputLabel
                    label={t("price")}
                    name="pvMercadoLivre"
                    type="currency"
                />
                <FInputLabel label={t("cost")} name="pvCost" type="currency" />
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
