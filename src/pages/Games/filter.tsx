import { REF_TOOLBAR_FORM } from "@/Layout/Toolbar";
import {
    BaseForm,
    Button,
    FButtonSubmit,
    FInputDatePickerRange,
    FInputLabel,
    FSelectLabelMultiApi,
    IBaseFormRef,
} from "@/components";
import { useDynamicRefs } from "@/hooks";
import { cn } from "@/lib";
import { decodeSearchParams, encodeSearchParams, sleep } from "@/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const FilterGames = () => {
    const [getRef, setRef] = useDynamicRefs();

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const { t } = useTranslation();

    const onSubmit = async (data: any) => {
        let newSearch = {
            page: searchParams?.get("page") || 0,
            filter_name: data?.filter_name,
            filter_ean: data?.filter_ean,
            filter_plataforms: data?.filter_plataforms
                ?.map((d: { id: string }) => d?.id)
                .join("-"),
            filter_developers: data?.filter_developers
                ?.map((d: { id: string }) => d?.id)
                .join("-"),
            filter_releaseYear_start: data?.filter_releaseYear_start,
            filter_releaseYear_end: data?.filter_releaseYear_end,
            filter_generous: data?.filter_generous
                ?.map((d: { id: string }) => d?.id)
                .join("-"),
            filter_parentalRatings: data?.filter_parentalRatings
                ?.map((d: { id: string }) => d?.id)
                .join("-"),
            filter_numberOfPlayers: data?.filter_numberOfPlayers
                ?.map((d: { id: string }) => d?.id)
                .join("-"),
            filter_updatedAt_from: data?.filter_updatedAt?.from
                ? format(data.filter_updatedAt.from, "yyyy-MM-dd")
                : undefined,
            filter_updatedAt_to: data?.filter_updatedAt?.to
                ? format(data.filter_updatedAt.to, "yyyy-MM-dd")
                : undefined,
            filter_createdAt_from: data?.filter_createdAt?.from
                ? format(data.filter_createdAt.from, "yyyy-MM-dd")
                : undefined,
            filter_createdAt_to: data?.filter_createdAt?.to
                ? format(data.filter_createdAt.to, "yyyy-MM-dd")
                : undefined,
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
                <FInputLabel label={t("name")} name="filter_name" />
                <FInputLabel label={t("ean")} name="filter_ean" />
                <FSelectLabelMultiApi
                    url="/plataforms"
                    label={t("plataforms")}
                    name="filter_plataforms"
                />
                <FSelectLabelMultiApi
                    url="/developers"
                    label={t("developers")}
                    name="filter_developers"
                />
                <FSelectLabelMultiApi
                    url="/publishers"
                    label={t("publishers")}
                    name="filter_publishers"
                />
                <div className="flex items-center justify-between gap-2">
                    <FInputLabel
                        label={t("yearStart")}
                        name="filter_releaseYear_start"
                        type="number"
                        placeholder="1990"
                    />
                    <FInputLabel
                        label={t("yearEnd")}
                        name="filter_releaseYear_end"
                        type="number"
                        placeholder={format(new Date(), "yyyy")}
                    />
                </div>
                <FSelectLabelMultiApi
                    url="/generous"
                    label={t("generous")}
                    name="filter_generous"
                />
                <FSelectLabelMultiApi
                    url="/parentalratings"
                    label={t("parentalratings")}
                    name="filter_parentalRatings"
                />
                <FSelectLabelMultiApi
                    url="/numberofplayers"
                    label={t("numberOfPlayer")}
                    name="filter_numberOfPlayers"
                />
                <FInputDatePickerRange
                    label={t("updatedAt")}
                    name="filter_updatedAt"
                />
                <FInputDatePickerRange
                    label={t("createdAt")}
                    name="filter_createdAt"
                />
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
