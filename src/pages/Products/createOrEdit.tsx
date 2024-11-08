import { Modal } from "@/Layout/Modal";
import {
    Dropzone,
    FInputDatePicker,
    FInputLabel,
    FSelectLabel,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
    SearchCatalog,
} from "@/components";
import { CONSTANT_TOKEN } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { capitalize, getAmbientURL } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PageProductCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

    const refForm = useRef<IBaseFormRef>(null);

    const [stateFindCatalog, setFindCatalog] = useState<any>({});
    const [, setLoading] = useState(false);
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
            let newData = data;
            setFindCatalog({
                type: data?.catalog?.type,
                region: data?.catalog?.region ? [data?.catalog?.region] : null,
                plataform: data?.plataform ? [data?.plataform] : null,
                factory: data?.factory ? [data?.factory] : null,
            });
            newData = {
                ...newData,
                catalog: {
                    ...newData?.catalog,
                    name: newData?.name,
                },
            };
            refForm.current?.reset(newData);
        }
        setLoading(false);
    };

    const onCleanCatalog = () => {
        // onChangeValue("catalog", null);
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
            <SearchCatalog
                onChange={(n, v) => {
                    setFindCatalog((prev: any) => ({ ...prev, [n]: v }));
                    onCleanCatalog();
                }}
                value={stateFindCatalog}
            />
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
                    defControl={refForm.current?.control}
                    className="col-span-2"
                    label={t("catalog")}
                    name="catalog"
                    url="/catalogs/fields"
                    dependenciesValue={{
                        type: stateFindCatalog?.type,
                        plataform: stateFindCatalog?.plataform
                            ?.map((d: any) => d?.id)
                            .join(","),
                        region: stateFindCatalog?.region
                            ?.map((d: any) => d?.id)
                            .join(","),
                        factory: stateFindCatalog?.factory
                            ?.map((d: any) => d?.id)
                            .join(","),
                    }}
                    // dependencies={[
                    //     "consoleComplete",
                    //     "conservation",
                    //     "consolePackaging",
                    //     "consoleSealed",
                    //     "consoleTypeUnlocked",
                    //     "consoleWorking",
                    //     "consoleUnlocked",
                    //     "gameManual",
                    //     "gamePackaging",
                    //     "gamePackagingRental",
                    //     "gameSealed",
                    //     "gameWorking",
                    // ]}
                    keyValue={["catalog.name"]}
                    // addLinkCrud={
                    //     refForm.current?.watch("catalog")
                    //         ? ""
                    //         : "/factory/consoles/new"
                    // }
                    onEffect={(val) => {
                        refForm.current?.setValue("name", val?.name);
                        // refForm.current?.setValue("pvMercadoLivre", val?.pvMercadoLivre);
                        // refForm.current?.setValue("pvCost", val?.pvCost);
                    }}
                    // disabled={!stateType}
                    // className={cn(
                    //     "col-span-1",
                    //     "sm:col-span-2",
                    //     "md:col-span-3"
                    // )}
                    disabled={!stateFindCatalog?.type}
                />
                <FInputLabel
                    label={t("sku")}
                    name="sku"
                    disabled={!stateFindCatalog?.type}
                />
                <FInputLabel
                    label={t("name")}
                    name="name"
                    disabled={!stateFindCatalog?.type}
                    className={cn("col-span-1", "sm:col-span-2")}
                />
                <FInputLabel
                    label={t("addressInStock")}
                    name="addressInStock"
                    disabled={!stateFindCatalog?.type}
                />
                <FSelectLabel
                    label={t("Plataforma de venda")}
                    name="salesPlatform"
                    items={[
                        {
                            id: "mercado livre",
                            name: "Mercado Livre",
                        },
                        {
                            id: "amazon",
                            name: "Amazon",
                        },
                        {
                            id: "site",
                            name: "Site",
                        },
                        {
                            id: "shoppe",
                            name: "Shoppe",
                        },
                    ]}
                    disabled={!stateFindCatalog?.type}
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
                            id: "processamento",
                            name: "Processamento",
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
                            id: "recebimento",
                            name: "Recebimento",
                        },
                        {
                            id: "estoque",
                            name: "Estoque",
                        },
                        {
                            id: "vendido",
                            name: "Vendido",
                        },
                    ]}
                    disabled={!stateFindCatalog?.type}
                />
                <FInputDatePicker
                    label={t("receiptDate")}
                    name="receiptDate"
                    disabled={!stateFindCatalog?.type}
                />
                <FInputDatePicker
                    label={t("announcementDate")}
                    name="announcementDate"
                    disabled={!stateFindCatalog?.type}
                />
                <FInputDatePicker
                    label={t("dateEntryInStock")}
                    name="dateEntryInStock"
                    disabled={!stateFindCatalog?.type}
                />
                <FInputDatePicker
                    label={t("dateSale")}
                    name="dateSale"
                    disabled={!stateFindCatalog?.type}
                />
            </GroupForm>
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
                    label={t("pvCost")}
                    name="pvCost"
                    type="currency"
                />
                <FInputLabel
                    label={t("pvMercadoLivre")}
                    name="pvMercadoLivre"
                    type="currency"
                />
                {fieldsPayments?.map((k: any) => (
                    <FInputLabel
                        key={k.name}
                        label={capitalize(t(k.name))}
                        name={k.name}
                        type="currency"
                    />
                ))}
                <FInputLabel
                    label={t("pvFinal")}
                    name="pvFinal"
                    type="currency"
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
