import { Modal } from "@/Layout/Modal";
import {
    Dropzone,
    FCheckboxLabel,
    FInputDatePicker,
    FInputLabel,
    FSelectLabel,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { CONSTANT_TOKEN } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { capitalize, getAmbientURL } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { dataItemsType } from "../Catalog/createOrEdit";

export const PageProductCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const [stateType, setType] = useState("");
    const [stateLoading, setLoading] = useState(false);
    const [fieldsPayments] = useState<string[]>([]);
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
        const { success, data: dataResp } = await postApi({
            url: `game/upload/${id}`,
            body: formFile,
            config: {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        });
        if (success) {
            if (file?.file) onUploadImage(dataResp?.id);
            else onClose();
        }
    };

    const onSubmit = async (data: FieldValues) => {
        let newData = data;

        newData = {
            ...newData,
            catalogId: data?.catalog?.id,
        };
        delete newData.catalog;

        if (isEdit) {
            const { success, data: dataResp } = await putApi({
                url: `/product/${searchParams.get("id")}`,
                body: newData,
            });
            if (success) {
                if (file?.file) onUploadImage(dataResp?.id);
                else onClose();
            }
        } else {
            const { success, data: dataResp } = await postApi({
                url: "/product",
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
            url: `/product/${searchParams.get("id")}`,
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

    const onCleanCatalog = () => {};

    const onEffectFactory = (value: any) => {
        value?.tagsDefault
            ?.split(",")
            .filter((key: string) => !!key)
            .forEach((key: string) => {
                refForm.current?.setValue(key, true);
            });
        onCleanCatalog();
    };

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={`${isEdit ? t("edit") : t("add")} produto`}
        >
            <GroupForm
                title={t("product")}
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
                <FSelectLabel
                    label={t("type")}
                    name="type"
                    items={dataItemsType}
                    onEffect={(e) => {
                        setType(e);
                        onCleanCatalog();
                    }}
                />
                <FSelectLabelSingleApi
                    label={t("region")}
                    name="regionId"
                    url="/regions"
                    onEffect={onCleanCatalog}
                    disabled={!stateType}
                />
                <FSelectLabelSingleApi
                    label={t("factory")}
                    name="factoryId"
                    url="/catalogs/factory"
                    dependencies={["type"]}
                    onEffect={onEffectFactory}
                    addLinkCrud={
                        stateType === "console"
                            ? "/factory/consoles/new"
                            : stateType === "console"
                            ? "/factory/games/new"
                            : ""
                    }
                />
                {stateType === "console" ? (
                    <>
                        <FCheckboxLabel
                            label={t("consoleComplete")}
                            name="consoleComplete"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("consolePackaging")}
                            name="consolePackaging"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("consoleSealed")}
                            name="consoleSealed"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("consoleTypeUnlocked")}
                            name="consoleTypeUnlocked"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("consoleUnlocked")}
                            name="consoleUnlocked"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("consoleWorking")}
                            name="consoleWorking"
                            onEffect={onCleanCatalog}
                        />
                    </>
                ) : stateType === "game" ? (
                    <>
                        <FCheckboxLabel
                            label={t("gameManual")}
                            name="gameManual"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("gamePackaging")}
                            name="gamePackaging"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("gamePackagingRental")}
                            name="gamePackagingRental"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("gameSealed")}
                            name="gameSealed"
                            onEffect={onCleanCatalog}
                        />
                        <FCheckboxLabel
                            label={t("gameWorking")}
                            name="gameWorking"
                            onEffect={onCleanCatalog}
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
                            onEffect={onCleanCatalog}
                        />
                    </>
                ) : (
                    <></>
                )}
            </GroupForm>
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
                <FSelectLabelSingleApi
                    label={t("catalog")}
                    name="catalog"
                    url="/catalogs/fields"
                    dependencies={[
                        "type",
                        "regionId.id",
                        "factoryId.id",
                        "consoleComplete",
                        "conservation",
                        "consolePackaging",
                        "consoleSealed",
                        "consoleTypeUnlocked",
                        "consoleWorking",
                        "consoleUnlocked",
                        "gameManual",
                        "gamePackaging",
                        "gamePackagingRental",
                        "gameSealed",
                        "gameWorking",
                    ]}
                    keyValue={["catalog.name"]}
                    addLinkCrud={
                        refForm.current?.watch("catalog")
                            ? ""
                            : "/factory/consoles/new"
                    }
                    onEffect={(val) => {
                        refForm.current?.setValue("name", val?.name);
                        refForm.current?.setValue("pvProfit", val?.pvProfit);
                        refForm.current?.setValue(
                            "pvMercadoLivre",
                            val?.pvMercadoLivre
                        );
                        refForm.current?.setValue("pvCost", val?.pvCost);
                    }}
                    disabled={!stateType}
                    className={cn(
                        "col-span-1",
                        "sm:col-span-2",
                        "md:col-span-3"
                    )}
                />
                <FInputLabel
                    label={t("name")}
                    name="name"
                    disabled={!stateType}
                    className={cn(
                        "col-span-1",
                        "sm:col-span-2",
                        "md:col-span-3"
                    )}
                />
                <FInputLabel
                    label={t("addressInStock")}
                    name="addressInStock"
                    disabled={!stateType}
                />
                <FInputDatePicker
                    label={t("receiptDate")}
                    name="receiptDate"
                    disabled={!stateType}
                />
                <FInputDatePicker
                    label={t("announcementDate")}
                    name="announcementDate"
                    disabled={!stateType}
                />
                <FInputDatePicker
                    label={t("dateEntryInStock")}
                    name="dateEntryInStock"
                    disabled={!stateType}
                />
                <FInputDatePicker
                    label={t("dateSale")}
                    name="dateSale"
                    disabled={!stateType}
                />
                <FSelectLabel
                    label={t("status")}
                    name="status"
                    items={[
                        {
                            id: "presente",
                            name: "Presente",
                        },
                        {
                            id: "permuta",
                            name: "Permuta",
                        },
                        {
                            id: "peça",
                            name: "Peça",
                        },
                        {
                            id: "processando",
                            name: "Processando",
                        },
                        {
                            id: "descarte",
                            name: "Descarte",
                        },
                        {
                            id: "testando",
                            name: "Testando",
                        },
                        {
                            id: "emprestimo",
                            name: "Empréstimo",
                        },
                        {
                            id: "conserto",
                            name: "Conserto",
                        },
                        {
                            id: "processando",
                            name: "Processando",
                        },
                        {
                            id: "recebimento",
                            name: "Recebimento",
                        },
                        {
                            id: "estoque",
                            name: "Estoque",
                        },
                    ]}
                    disabled={!stateType}
                />
            </GroupForm>
            <GroupForm
                title={t("prices")}
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
                    label={t("cost")}
                    name="pvCost"
                    type="currency"
                    disabled
                />
                <FInputLabel
                    label={t("pvMercadoLivre")}
                    name="pvMercadoLivre"
                    type="currency"
                    disabled
                />
                <FInputLabel
                    label={t("pvProfit")}
                    name="pvProfit"
                    type="currency"
                    disabled
                />
                {fieldsPayments?.map((k: any) => (
                    <FInputLabel
                        key={k.name}
                        label={capitalize(t(k.name))}
                        name={k.name}
                        type="currency"
                        disabled
                    />
                ))}
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
