import { REF_TOOLBAR_FORM } from "@/Layout/Toolbar";
import {
    BaseForm,
    Button,
    FButtonSubmit,
    FCheckboxLabel,
    FInputLabel,
    FSelectLabelMultiApi,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { useDynamicRefs } from "@/hooks";
import { cn } from "@/lib";
import { decodeSearchParams, encodeSearchParams, sleep } from "@/utils";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const FilterCatalogs = () => {
    const [getRef, setRef] = useDynamicRefs();

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const { t } = useTranslation();

    const onSubmit = async (data: any) => {
        let newSearch = {
            page: searchParams?.get("page") || 0,
            // filter_factory: data?.filter_factory,
            filter_regions: data?.filter_regions
                ?.map((d: { id: string }) => d?.id)
                .join("-"),
            filter_pvCost_start: data?.filter_pvCost_start,
            filter_pvCost_end: data?.filter_pvCost_end,
            filter_pvMercadoLivre_start: data?.filter_pvMercadoLivre_start,
            filter_pvMercadoLivre_end: data?.filter_pvMercadoLivre_end,
            filter_conservation: data?.filter_conservation,
            filter_gameManual: data?.filter_gameManual,
            filter_gamePackaging: data?.filter_gamePackaging,
            filter_gamePackagingRental: data?.filter_gamePackagingRental,
            filter_gameSealed: data?.filter_gameSealed,
            filter_gameWorking: data?.filter_gameWorking,
            filter_consoleSealed: data?.filter_consoleSealed,
            filter_consoleWorking: data?.filter_consoleWorking,
            filter_consolePackaging: data?.filter_consolePackaging,
            filter_consoleComplete: data?.filter_consoleComplete,
            filter_consoleUnlocked: data?.filter_consoleUnlocked,
            filter_consoleTypeUnlocked: data?.filter_consoleTypeUnlocked,
        };
        navigate(
            {
                pathname: location.pathname,
                search: encodeSearchParams(newSearch),
            },
            {}
        );
    };

    const onClose = async () => {
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
    };

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
            <div
                className={cn(
                    "w-full",
                    "h-full",
                    "max-h-[calc(100vh-140px)]",
                    "flex",
                    "flex-col",
                    "overflow-auto",
                    "p-2",
                    "gap-1"
                )}
            >
                {/* <FInputLabel label={t("factory")} name="filter_factory" /> */}
                <FSelectLabelMultiApi
                    url="/regions"
                    label={t("regions")}
                    name="filter_regions"
                />
                <div className="flex items-center justify-between gap-2">
                    <FInputLabel
                        label={t("costStart")}
                        name="filter_pvCost_start"
                        type="currency"
                    />
                    <FInputLabel
                        label={t("costEnd")}
                        name="filter_pvCost_end"
                        type="currency"
                    />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <FInputLabel
                        label={t("mercadoLivreStart")}
                        name="filter_pvMercadoLivre_start"
                        type="currency"
                    />
                    <FInputLabel
                        label={t("mercadoLivreEnd")}
                        name="filter_pvMercadoLivre_end"
                        type="currency"
                    />
                </div>
                <FInputLabel
                    label={t("conservation")}
                    name="filter_conservation"
                    type="number"
                />
                <GroupForm title={t("games")} className="flex flex-wrap gap-2">
                    <FCheckboxLabel
                        row
                        label={t("gameManual")}
                        name="filter_gameManual"
                    />
                    <FCheckboxLabel
                        row
                        label={t("gamePackaging")}
                        name="filter_gamePackaging"
                    />
                    <FCheckboxLabel
                        row
                        label={t("gamePackagingRental")}
                        name="filter_gamePackagingRental"
                    />
                    <FCheckboxLabel
                        row
                        label={t("gameSealed")}
                        name="filter_gameSealed"
                    />
                    <FCheckboxLabel
                        row
                        label={t("gameWorking")}
                        name="filter_gameWorking"
                    />
                </GroupForm>
                <GroupForm
                    title={t("consoles")}
                    className="flex flex-wrap gap-2"
                >
                    <FCheckboxLabel
                        row
                        label={t("consoleSealed")}
                        name="filter_consoleSealed"
                    />
                    <FCheckboxLabel
                        row
                        label={t("consoleWorking")}
                        name="filter_consoleWorking"
                    />
                    <FCheckboxLabel
                        row
                        label={t("consolePackaging")}
                        name="filter_consolePackaging"
                    />
                    <FCheckboxLabel
                        row
                        label={t("consoleComplete")}
                        name="filter_consoleComplete"
                    />
                    <FCheckboxLabel
                        row
                        label={t("consoleUnlocked")}
                        name="filter_consoleUnlocked"
                    />
                    <FCheckboxLabel
                        row
                        label={t("consoleTypeUnlocked")}
                        name="filter_consoleTypeUnlocked"
                    />
                </GroupForm>
            </div>
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
