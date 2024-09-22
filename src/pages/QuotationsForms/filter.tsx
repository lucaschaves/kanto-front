import { REF_TOOLBAR_FORM } from "@/Layout/Toolbar";
import {
    BaseForm,
    Button,
    FButtonSubmit,
    FSelectLabelSingleApi,
    GroupForm,
    IBaseFormRef,
} from "@/components";
import { useDynamicRefs } from "@/hooks";
import { cn } from "@/lib";
import { decodeSearchParams, encodeSearchParams, sleep } from "@/utils";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export const FilterQuotationsForms = () => {
    const [getRef, setRef] = useDynamicRefs();

    const navigate = useNavigate();
    const location = useLocation();

    const { t } = useTranslation();

    const formActual = "quotationsform";

    const onSubmit = useCallback(
        async (data: any) => {
            navigate(
                {
                    pathname: location.pathname,
                    search: encodeSearchParams({
                        filter_history_id: data?.filter_history_id?.id,
                    }),
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
                <GroupForm
                    title={t("prices")}
                    className={cn(
                        "w-full",
                        "grid",
                        "grid-cols-1",
                        "gap-1",
                        "sm:gap-2"
                    )}
                >
                    <FSelectLabelSingleApi
                        url="/quotationhistorys"
                        label={t("history")}
                        name="filter_history_id"
                        keyValue="id"
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
