import {
    BaseForm,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    FButtonSubmit,
    FCheckboxLabel,
    FInputLabel,
    FSelectLabel,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { getParamByPath } from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const dataItemsType = [
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

const PageProductCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");
    const formActual = getParamByPath(location.pathname, 1);

    const refForm = useRef<IBaseFormRef>(null);

    const [modeView, setModeView] = useState<"groups" | "tabs">("groups");

    const onClose = useCallback(() => {
        navigate(-1);
    }, []);

    const onSubmit = useCallback(
        async (data: FieldValues) => {
            if (isEdit) {
                const { success } = await putApi({
                    url: `${formActual.substring(
                        0,
                        formActual.length - 1
                    )}/${searchParams.get("id")}`,
                    body: data,
                });
                if (success) {
                    onClose();
                }
            } else {
                const { success } = await postApi({
                    url: formActual.substring(0, formActual.length - 1),
                    body: data,
                });
                if (success) {
                    onClose();
                }
            }
        },
        [onClose, isEdit, formActual]
    );

    const getData = useCallback(async () => {
        const { success, data } = await getApi({
            url: `${formActual.substring(
                0,
                formActual.length - 1
            )}/${searchParams.get("id")}`,
        });
        if (success) {
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
                <BaseForm onSubmit={onSubmit} ref={refForm}>
                    <div
                        className={cn(
                            "w-full",
                            "flex",
                            "flex-col",
                            "max-h-[90vh]",
                            "overflow-hidden"
                        )}
                    >
                        <div className="w-full flex items-center justify-end p-1 gap-1">
                            <Button
                                type="button"
                                onClick={() => setModeView("groups")}
                                variant={
                                    modeView === "groups"
                                        ? "secondary"
                                        : "ghost"
                                }
                                size="sm"
                            >
                                Visualizar por Grupo
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setModeView("tabs")}
                                variant={
                                    modeView === "tabs" ? "secondary" : "ghost"
                                }
                                size="sm"
                            >
                                Visualizar por abas
                            </Button>
                        </div>
                        {modeView === "groups" ? (
                            <div
                                className={cn(
                                    "w-full",
                                    "flex",
                                    "flex-col",
                                    "gap-2",
                                    "max-h-[70vh]",
                                    "overflow-auto",
                                    "pb-5"
                                )}
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
                                    <FSelectLabel
                                        label={t("type")}
                                        name="type"
                                        items={dataItemsType}
                                    />
                                    <FSelectLabelSingleApi
                                        label={t("factory")}
                                        name="factoryId"
                                        url="/products/factory"
                                        dependencies={["type"]}
                                    />
                                    <FSelectLabelSingleApi
                                        label={t("region")}
                                        name="regionId"
                                        url="/regions"
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
                                        label={t("priceMoney")}
                                        name="priceMoney"
                                        type="currency"
                                    />
                                    <FInputLabel
                                        label={t("priceInStoreCredit")}
                                        name="priceInStoreCredit"
                                        type="currency"
                                    />
                                    <FInputLabel
                                        label={t("pvAmazon")}
                                        name="pvAmazon"
                                        type="currency"
                                    />
                                    <FInputLabel
                                        label={t("pvMercadoLivre")}
                                        name="pvMercadoLivre"
                                        type="currency"
                                    />
                                    <FInputLabel
                                        label={t("pvSite")}
                                        name="pvSite"
                                        type="currency"
                                    />
                                </GroupForm>
                                <GroupForm
                                    title={t("consoles")}
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
                                <GroupForm
                                    title={t("games")}
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
                                    <FCheckboxLabel
                                        label={t("gameManual")}
                                        name="gameManual"
                                    />
                                    <FCheckboxLabel
                                        label={t("gamePackaging")}
                                        name="gamePackaging"
                                    />
                                    <FCheckboxLabel
                                        label={t("gamePackagingRental")}
                                        name="gamePackagingRental"
                                    />
                                    <FCheckboxLabel
                                        label={t("gameSealed")}
                                        name="gameSealed"
                                    />
                                    <FCheckboxLabel
                                        label={t("gameWorking")}
                                        name="gameWorking"
                                    />
                                    <FInputLabel
                                        label={t("gameConversation")}
                                        name="gameConversation"
                                    />
                                </GroupForm>
                            </div>
                        ) : (
                            <Tabs
                                defaultValue="general"
                                className="w-full min-h-[50vh]"
                            >
                                <TabsList className="w-full grid grid-cols-5">
                                    <TabsTrigger value="general">
                                        {t("general")}
                                    </TabsTrigger>
                                    <TabsTrigger value="prices">
                                        {t("prices")}
                                    </TabsTrigger>
                                    <TabsTrigger value="consoles">
                                        {t("consoles")}
                                    </TabsTrigger>
                                    <TabsTrigger value="games">
                                        {t("games")}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="general">
                                    <FSelectLabel
                                        label={t("type")}
                                        name="type"
                                        items={dataItemsType}
                                    />
                                    <FSelectLabelSingleApi
                                        label={t("factory")}
                                        name="factoryId"
                                        url="/products/factory"
                                        dependencies={["type"]}
                                    />
                                    <FSelectLabelSingleApi
                                        label={t("region")}
                                        name="regionId"
                                        url="/regions"
                                    />
                                </TabsContent>
                                <TabsContent value="prices">
                                    <FInputLabel
                                        label={t("priceMoney")}
                                        name="priceMoney"
                                        type="currency"
                                    />
                                    <FInputLabel
                                        label={t("priceInStoreCredit")}
                                        name="priceInStoreCredit"
                                        type="currency"
                                    />
                                    <FInputLabel
                                        label={t("pvAmazon")}
                                        name="pvAmazon"
                                        type="currency"
                                    />
                                    <FInputLabel
                                        label={t("pvMercadoLivre")}
                                        name="pvMercadoLivre"
                                        type="currency"
                                    />
                                    <FInputLabel
                                        label={t("pvSite")}
                                        name="pvSite"
                                        type="currency"
                                    />
                                </TabsContent>
                                <TabsContent value="consoles">
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
                                </TabsContent>
                                <TabsContent value="games">
                                    <FCheckboxLabel
                                        label={t("gameManual")}
                                        name="gameManual"
                                    />
                                    <FCheckboxLabel
                                        label={t("gamePackaging")}
                                        name="gamePackaging"
                                    />
                                    <FCheckboxLabel
                                        label={t("gamePackagingRental")}
                                        name="gamePackagingRental"
                                    />
                                    <FCheckboxLabel
                                        label={t("gameSealed")}
                                        name="gameSealed"
                                    />
                                    <FCheckboxLabel
                                        label={t("gameWorking")}
                                        name="gameWorking"
                                    />
                                    <FInputLabel
                                        label={t("gameConversation")}
                                        name="gameConversation"
                                    />
                                </TabsContent>
                            </Tabs>
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
                    </div>
                </BaseForm>
            </DialogContent>
        </Dialog>
    );
};

export { PageProductCreateOrEdit };
