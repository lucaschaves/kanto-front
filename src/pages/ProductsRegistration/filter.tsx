import { REF_TOOLBAR_FORM } from "@/Layout/Toolbar";
import {
    BaseForm,
    Button,
    FButtonSubmit,
    FCheckboxLabel,
    FInputLabel,
    GroupForm,
    IBaseFormRef,
    ScrollArea,
} from "@/components";
import { useDynamicRefs } from "@/hooks";
import { cn } from "@/lib";
import { decodeSearchParams, encodeSearchParams, sleep } from "@/utils";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export const FilterProductsRegistration = () => {
    const [getRef, setRef] = useDynamicRefs();

    const navigate = useNavigate();
    const location = useLocation();

    const { t } = useTranslation();

    const formActual = "productsregistration";

    const onSubmit = useCallback(
        async (data: any) => {
            navigate(
                {
                    pathname: location.pathname,
                    search: encodeSearchParams(data),
                },
                {}
            );
        },
        [formActual]
    );

    const onClose = useCallback(async () => {
        navigate(
            {
                pathname: location.pathname,
                search: "",
            },
            {}
        );
        await sleep(500);
        const refForm = getRef<IBaseFormRef>(REF_TOOLBAR_FORM);
        refForm.current?.reset({});
    }, [REF_TOOLBAR_FORM, formActual, location.pathname]);

    return (
        <BaseForm
            onSubmit={onSubmit}
            ref={setRef(REF_TOOLBAR_FORM)}
            defaultValues={{
                ...decodeSearchParams(location.search),
            }}
        >
            <div className={cn("w-full", "mb-2", "p-2")}>
                <h2 className="font-semibold">Filtros</h2>
            </div>
            <ScrollArea
                className={cn(
                    "w-full",
                    "h-full",
                    "max-h-[calc(100vh-140px)]",
                    "p-2",
                    "flex",
                    "flex-col",
                    "gap-y-4"
                )}
            >
                <GroupForm
                    title={t("prices")}
                    className={cn(
                        "w-full",
                        "grid",
                        "grid-cols-1",
                        "sm:grid-cols-2",
                        "gap-1",
                        "sm:gap-2"
                    )}
                >
                    <FInputLabel
                        label={t("moneyMin")}
                        name="filter_priceMoney_min"
                        type="number"
                        placeholder="mínimo"
                    />
                    <FInputLabel
                        label={t("moneyMax")}
                        name="filter_priceMoney_max"
                        type="number"
                        placeholder="máximo"
                    />
                    <FInputLabel
                        label={t("storeCreditMin")}
                        name="filter_priceInStoreCredit_min"
                        type="number"
                    />
                    <FInputLabel
                        label={t("storeCreditMax")}
                        name="filter_priceInStoreCredit_max"
                        type="number"
                    />
                </GroupForm>
                <GroupForm
                    title={t("games")}
                    className={cn(
                        "w-full",
                        "grid",
                        "grid-cols-1",
                        // "sm:grid-cols-2",
                        "gap-1",
                        "sm:gap-2"
                    )}
                >
                    <FInputLabel
                        label={t("type")}
                        name="filter_type"
                        // className="col-span-2"
                    />
                    <FCheckboxLabel
                        label={t("gameConversation")}
                        name="filter_gameConversation"
                    />
                    <FCheckboxLabel
                        label={t("gameManual")}
                        name="filter_gameManual"
                    />
                    <FCheckboxLabel
                        label={t("gamePackaging")}
                        name="filter_gamePackaging"
                    />
                    <FCheckboxLabel
                        label={t("gamePackagingRental")}
                        name="filter_gamePackagingRental"
                    />
                    <FCheckboxLabel
                        label={t("gameSealed")}
                        name="filter_gameSealed"
                    />
                    <FCheckboxLabel
                        label={t("gameWorking")}
                        name="filter_gameWorking"
                    />
                </GroupForm>
                <GroupForm
                    title={t("consoles")}
                    className={cn(
                        "w-full",
                        "grid",
                        "grid-cols-1",
                        "gap-1",
                        "sm:gap-2"
                    )}
                >
                    <FCheckboxLabel
                        label={t("consoleComplete")}
                        name="filter_consoleComplete"
                    />
                    <FCheckboxLabel
                        label={t("consolePackaging")}
                        name="filter_consolePackaging"
                    />
                    <FCheckboxLabel
                        label={t("consoleSealed")}
                        name="filter_consoleSealed"
                    />
                    <FCheckboxLabel
                        label={t("consoleTypeUnlocked")}
                        name="filter_consoleTypeUnlocked"
                    />
                    <FCheckboxLabel
                        label={t("consoleUnlocked")}
                        name="filter_consoleUnlocked"
                    />
                    <FCheckboxLabel
                        label={t("consoleWorking")}
                        name="filter_consoleWorking"
                    />
                </GroupForm>
            </ScrollArea>
            <div
                className={cn(
                    "flex",
                    "w-full",
                    "items-center",
                    "justify-end",
                    "gap-2",
                    "mt-4",
                    "p-2"
                )}
            >
                <Button type="button" onClick={onClose} variant="outline">
                    {t("clean")}
                </Button>
                <FButtonSubmit label={t("filter")} />
            </div>
        </BaseForm>
    );
};
