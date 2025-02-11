import { Modal } from "@/Layout/Modal";
import {
    Button,
    Dropzone,
    FInputDatePicker,
    FInputLabel,
    FSelectLabel,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
    SearchCatalog,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components";
import { CONSTANT_TOKEN, STATUS_ENUM } from "@/constants";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { capitalize, getAmbientURL, messageError } from "@/utils";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PageProductCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("/edit");

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

        let isError = false;
        if (!newData?.name) {
            isError = true;
            refForm.current?.setError("name", {
                message: "É necessário",
            });
        }
        if (!newData?.sku) {
            isError = true;
            refForm.current?.setError("sku", {
                message: "É necessário",
            });
        }
        if (!newData?.addressInStock) {
            isError = true;
            refForm.current?.setError("addressInStock", {
                message: "É necessário",
            });
        }
        if (newData?.addressInStock.length < 3) {
            isError = true;
            refForm.current?.setError("addressInStock", {
                message: "É necessário ter ter caracteres",
            });
        }
        if (!newData?.status) {
            isError = true;
            refForm.current?.setError("status", {
                message: "É necessário",
            });
        }
        if (!newData?.catalogId) {
            isError = true;
            refForm.current?.setError("catalog", {
                message: "É necessário",
            });
        }
        if (newData?.status) {
            if (newData.status === "presente") {
                if (!newData?.datePresent) {
                    isError = true;
                    refForm.current?.setError("datePresent", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "permuta") {
                if (!newData?.dateExchange) {
                    isError = true;
                    refForm.current?.setError("dateExchange", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "peça") {
                if (!newData?.datePart) {
                    isError = true;
                    refForm.current?.setError("datePart", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "processamento") {
                if (!newData?.dateProcessing) {
                    isError = true;
                    refForm.current?.setError("dateProcessing", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "descarte") {
                if (!newData?.dateDiscard) {
                    isError = true;
                    refForm.current?.setError("dateDiscard", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "teste") {
                if (!newData?.dateTest) {
                    isError = true;
                    refForm.current?.setError("dateTest", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "emprestimo") {
                if (!newData?.dateLoan) {
                    isError = true;
                    refForm.current?.setError("dateLoan", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "conserto") {
                if (!newData?.dateRepair) {
                    isError = true;
                    refForm.current?.setError("dateRepair", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "recebimento") {
                if (!newData?.dateReceipt) {
                    isError = true;
                    refForm.current?.setError("dateReceipt", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "estoque") {
                if (!newData?.dateEntryInStock) {
                    isError = true;
                    refForm.current?.setError("dateEntryInStock", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "vendido") {
                if (!newData?.dateSale) {
                    isError = true;
                    refForm.current?.setError("dateSale", {
                        message: "É necessário",
                    });
                }
            } else if (newData.status === "perdido") {
                if (!newData?.dateLoss) {
                    isError = true;
                    refForm.current?.setError("dateLoss", {
                        message: "É necessário",
                    });
                }
            }
        }
        if (isError) {
            messageError({ message: "É necessário preencher os campos" });
            return;
        }
        newData = {
            ...newData,
            sku: newData?.sku
                ? `${newData?.sku?.split("-")[0]}${newData?.sku?.split("-")[1]}`
                : newData?.sku,
        };
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
                sku: newData?.sku
                    ? `${newData?.sku?.slice(0, 2)}-${newData?.sku?.slice(
                          2,
                          newData?.sku.length
                      )}`
                    : newData?.sku,
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

    const disabledField = !stateFindCatalog?.factory;

    return (
        <Modal
            ref={refForm}
            onClose={onClose}
            onSubmit={onSubmit}
            title={`${isEdit ? t("edit") : t("add")} produto`}
        >
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">Geral</TabsTrigger>
                    <TabsTrigger value="date">Datas</TabsTrigger>
                    <TabsTrigger value="prices">Valores</TabsTrigger>
                    <TabsTrigger value="images">Imagens</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="flex flex-col gap-4">
                    <SearchCatalog
                        onChange={(n, v) => {
                            setFindCatalog((prev: any) => ({
                                ...prev,
                                [n]: v,
                            }));
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
                            dependencies={[
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
                            // addLinkCrud={
                            //     refForm.current?.watch("catalog")
                            //         ? ""
                            //         : "/factory/consoles/new"
                            // }
                            onEffect={(val) => {
                                refForm.current?.setValue("name", val?.name);
                                refForm.current?.setValue(
                                    "pvMercadoLivre",
                                    val?.pvMercadoLivre
                                );
                                refForm.current?.setValue(
                                    "pcCost",
                                    val?.pcCost
                                );
                            }}
                            disabled={disabledField}
                            navigateItem="/factory/catalogs/edit?id="
                        />
                        <FInputLabel
                            label={t("sku")}
                            name="sku"
                            disabled={disabledField}
                        />
                        <FInputLabel
                            label={t("name")}
                            name="name"
                            disabled={disabledField}
                            className={cn("col-span-1", "sm:col-span-3")}
                        />
                        <FInputLabel
                            label={t("addressInStock")}
                            name="addressInStock"
                            disabled={disabledField}
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
                            disabled={disabledField}
                        />
                        <FSelectLabel
                            label={t("status")}
                            name="status"
                            items={STATUS_ENUM}
                            disabled={disabledField}
                            onEffect={(e) => {
                                switch (e) {
                                    case "presente":
                                        refForm.current?.setValue(
                                            "datePresent",
                                            new Date()
                                        );
                                        break;
                                    case "permuta":
                                        refForm.current?.setValue(
                                            "dateExchange",
                                            new Date()
                                        );
                                        break;
                                    case "peça":
                                        refForm.current?.setValue(
                                            "datePart",
                                            new Date()
                                        );
                                        break;
                                    case "processamento":
                                        refForm.current?.setValue(
                                            "dateProcessing",
                                            new Date()
                                        );
                                        break;
                                    case "descarte":
                                        refForm.current?.setValue(
                                            "dateDiscard",
                                            new Date()
                                        );
                                        break;
                                    case "teste":
                                        refForm.current?.setValue(
                                            "dateTest",
                                            new Date()
                                        );
                                        break;
                                    case "emprestimo":
                                        refForm.current?.setValue(
                                            "dateLoan",
                                            new Date()
                                        );
                                        break;
                                    case "conserto":
                                        refForm.current?.setValue(
                                            "dateRepair",
                                            new Date()
                                        );
                                        break;
                                    case "recebimento":
                                        refForm.current?.setValue(
                                            "dateReceipt",
                                            new Date()
                                        );
                                        break;
                                    case "estoque":
                                        refForm.current?.setValue(
                                            "dateEntryInStock",
                                            new Date()
                                        );
                                        break;
                                    case "vendido":
                                        refForm.current?.setValue(
                                            "dateSale",
                                            new Date()
                                        );
                                        break;
                                    case "perdido":
                                        refForm.current?.setValue(
                                            "dateLoss",
                                            new Date()
                                        );
                                        break;
                                    default:
                                        break;
                                }
                            }}
                        />
                        <div className="flex gap-2 items-center justify-start">
                            <FInputLabel
                                label="Cotação ID"
                                name="quotationId.id"
                                disabled
                            />
                            <Button
                                onClick={() => {
                                    const idQuotation =
                                        refForm.current?.watch(
                                            "quotationId.id"
                                        );
                                    navigate(
                                        `/quotations/quotationsforms/edit?id=${idQuotation}`
                                    );
                                }}
                                size="icon"
                                variant="ghost"
                                className="mt-5"
                            >
                                <OpenInNewWindowIcon />
                            </Button>
                        </div>
                    </GroupForm>
                </TabsContent>
                <TabsContent value="date" className="flex flex-col gap-4">
                    <GroupForm
                        title="Datas"
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
                        <FInputDatePicker
                            label={t("dateReceipt")}
                            name="dateReceipt"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateAnnouncement")}
                            name="dateAnnouncement"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateEntryInStock")}
                            name="dateEntryInStock"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateSale")}
                            name="dateSale"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateDiscard")}
                            name="dateDiscard"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateExchange")}
                            name="dateExchange"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateLoan")}
                            name="dateLoan"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateLoss")}
                            name="dateLoss"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("datePart")}
                            name="datePart"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("datePresent")}
                            name="datePresent"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateProcessing")}
                            name="dateProcessing"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateRepair")}
                            name="dateRepair"
                            disabled={disabledField}
                        />
                        <FInputDatePicker
                            label={t("dateTest")}
                            name="dateTest"
                            disabled={disabledField}
                        />
                    </GroupForm>
                </TabsContent>
                <TabsContent value="prices" className="flex flex-col gap-4">
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
                            label={t("pcCost")}
                            name="pcCost"
                            type="currency"
                            disabled={disabledField}
                        />
                        <FInputLabel
                            label={t("pvMercadoLivre")}
                            name="pvMercadoLivre"
                            type="currency"
                            disabled={disabledField}
                        />
                        {fieldsPayments?.map((k: any) => (
                            <FInputLabel
                                key={k.name}
                                label={capitalize(t(k.name))}
                                name={k.name}
                                type="currency"
                                disabled={disabledField}
                            />
                        ))}
                        {/* <FInputLabel
                    label={t("pvFinal")}
                    name="pvFinal"
                    type="currency"
                    disabled={disabledField}
                /> */}
                    </GroupForm>
                </TabsContent>
                <TabsContent value="images" className="flex flex-col gap-4">
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
                                disabled={disabledField}
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
                </TabsContent>
            </Tabs>
        </Modal>
    );
};
