import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components";
import { cn } from "@/lib";
import {
    FilterCatalogs,
    FilterProducts,
    FilterQuestions,
    FilterQuestionsGroups,
    FilterQuotationsForms,
    FilterQuotationsSearchs,
    FilterSettings,
} from "@/pages";
import {
    modulesDef,
    modulesFactory,
    modulesQuotations,
    modulesSettings,
} from "@/routes";
import { getParamByPath } from "@/utils";
import {
    FileTextIcon,
    HomeIcon,
    MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { FactoryIcon, SettingsIcon } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface IPropsToolbar {
    sheet?: boolean;
    openFilters?: boolean;
    toggleFilters?: (open?: boolean) => void;
}

export interface IRefToolbar {
    toggleFilters?: (open?: boolean) => void;
}

export const REF_TOOLBAR_FORM = "ref_toobar_form";

export const Toolbar = forwardRef<IRefToolbar, IPropsToolbar>((props, ref) => {
    const { sheet, toggleFilters = () => ({}), openFilters } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const formActual =
        getParamByPath(location.pathname, 2) ||
        getParamByPath(location.pathname, 1) ||
        getParamByPath(location.pathname, 0);

    const [fields, setFields] = useState("");

    const getFields = () => {
        setFields(formActual);
    };

    useEffect(() => {
        if (openFilters) getFields();
    }, [openFilters]);

    useEffect(() => {
        if (openFilters) toggleFilters();
    }, [location.pathname]);

    useImperativeHandle(
        ref,
        () => ({
            toggleFilters,
        }),
        [toggleFilters]
    );

    if (sheet) {
        return (
            <div
                className={cn(
                    "flex",
                    "w-full",
                    "h-full",
                    "rounded-lg",
                    "p-2",
                    "flex-col",
                    "gap-2"
                )}
            >
                {modulesDef.map((v) => (
                    <Button
                        key={v.name}
                        className={cn(
                            "w-full",
                            "px-4",
                            "py-2",
                            "gap-2",
                            "justify-between"
                        )}
                        onClick={() => navigate(v.link)}
                        variant={
                            v.link == location.pathname ? "outline" : "default"
                        }
                    >
                        {v.Icon}
                        <span className={cn("flex-1", "text-left")}>
                            {t(v.name)}
                        </span>
                    </Button>
                ))}
                <Accordion type="single" collapsible>
                    <AccordionItem value="settings" className="border-none">
                        <AccordionTrigger className="h-9">
                            <Button
                                className={cn(
                                    "w-full",
                                    "px-4",
                                    "py-2",
                                    "gap-2",
                                    "justify-between"
                                )}
                                variant={
                                    ["/settings"].includes(
                                        getParamByPath(location.pathname, 0)
                                    )
                                        ? "outline"
                                        : "default"
                                }
                            >
                                <SettingsIcon size={15} />
                                <span className={cn("flex-1", "text-left")}>
                                    {t("settings")}
                                </span>
                            </Button>
                        </AccordionTrigger>
                        <AccordionContent
                            className={cn(
                                "flex",
                                "flex-col",
                                "ml-5",
                                "border-none",
                                "pb-1"
                            )}
                        >
                            {modulesSettings.map((s) => (
                                <Button
                                    key={s.name}
                                    className={cn(
                                        "w-full",
                                        "px-4",
                                        "py-2",
                                        "gap-2",
                                        "justify-between"
                                    )}
                                    onClick={() => navigate(s.link)}
                                    variant={
                                        s.link == location.pathname
                                            ? "outline"
                                            : "default"
                                    }
                                    data-rule-component="rule"
                                    data-rule-component-id={s.name}
                                >
                                    <HomeIcon />
                                    <span className={cn("flex-1", "text-left")}>
                                        {t(s.name)}
                                    </span>
                                </Button>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                    <AccordionItem value="quotations" className="border-none">
                        <AccordionTrigger className="h-9">
                            <Button
                                className={cn(
                                    "w-full",
                                    "px-4",
                                    "py-2",
                                    "gap-2",
                                    "justify-between"
                                )}
                                variant={
                                    ["/quotations"].includes(
                                        getParamByPath(location.pathname, 0)
                                    )
                                        ? "outline"
                                        : "default"
                                }
                            >
                                <FileTextIcon />
                                <span className={cn("flex-1", "text-left")}>
                                    {t("quotations")}
                                </span>
                            </Button>
                        </AccordionTrigger>
                        <AccordionContent
                            className={cn(
                                "flex",
                                "flex-col",
                                "ml-5",
                                "border-none",
                                "pb-1"
                            )}
                        >
                            {modulesQuotations.map((s) => (
                                <Button
                                    key={s.name}
                                    className={cn(
                                        "w-full",
                                        "px-4",
                                        "py-2",
                                        "gap-2",
                                        "justify-between"
                                    )}
                                    onClick={() => navigate(s.link)}
                                    variant={
                                        s.link == location.pathname
                                            ? "outline"
                                            : "default"
                                    }
                                    data-rule-component="rule"
                                    data-rule-component-id={s.name}
                                >
                                    <HomeIcon />
                                    <span className={cn("flex-1", "text-left")}>
                                        {t(s.name)}
                                    </span>
                                </Button>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                    <AccordionItem value="factory" className="border-none">
                        <AccordionTrigger className="h-9">
                            <Button
                                className={cn(
                                    "w-full",
                                    "px-4",
                                    "py-2",
                                    "gap-2",
                                    "justify-between"
                                )}
                                variant={
                                    ["/factory"].includes(
                                        getParamByPath(location.pathname, 0)
                                    )
                                        ? "outline"
                                        : "default"
                                }
                            >
                                <FactoryIcon />
                                <span className={cn("flex-1", "text-left")}>
                                    {t("factory")}
                                </span>
                            </Button>
                        </AccordionTrigger>
                        <AccordionContent
                            className={cn(
                                "flex",
                                "flex-col",
                                "ml-5",
                                "border-none",
                                "pb-1"
                            )}
                        >
                            {modulesFactory.map((s) => (
                                <Button
                                    key={s.name}
                                    className={cn(
                                        "w-full",
                                        "px-4",
                                        "py-2",
                                        "gap-2",
                                        "justify-between"
                                    )}
                                    onClick={() => navigate(s.link)}
                                    variant={
                                        s.link == location.pathname
                                            ? "outline"
                                            : "default"
                                    }
                                    data-rule-component="rule"
                                    data-rule-component-id={s.name}
                                >
                                    <HomeIcon />
                                    <span className={cn("flex-1", "text-left")}>
                                        {t(s.name)}
                                    </span>
                                </Button>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "h-full",
                "gap-2",
                openFilters
                    ? cn(
                          "bg-white",
                          "flex",
                          "w-full",
                          "fixed",
                          "right-0",
                          "max-w-[70%]",
                          "md:max-w-full",
                          "md:bg-inherit",
                          "shadow-lg",
                          "md:relative"
                      )
                    : cn("hidden", "sm:flex", "sm:min-w-14", "sm:w-14")
            )}
        >
            <div
                className={cn(
                    "flex",
                    "w-14",
                    "h-full",
                    "bg-primary",
                    "dark:bg-slate-800",
                    "rounded-lg",
                    "p-2",
                    "gap-2",
                    "flex-col",
                    "justify-start",
                    "items-center"
                )}
            >
                {[
                    "products",
                    "catalogs",
                    "questions",
                    "questionsgroups",
                    "quotationsforms",
                    "quotationssearchs",
                ].includes(formActual) ||
                location.pathname.includes("factory") ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className={cn(
                                        "p-0",
                                        "w-10",
                                        "gap-2",
                                        "justify-center"
                                    )}
                                    onClick={() => toggleFilters()}
                                    variant={
                                        openFilters ? "outline" : "default"
                                    }
                                >
                                    <MagnifyingGlassIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>{t("search")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <></>
                )}
            </div>
            <div
                className={cn(
                    "w-full",
                    "h-full",
                    "bg-white",
                    "rounded-lg",
                    openFilters ? "flex" : "hidden",
                    "flex-col"
                )}
            >
                {["catalogs"].includes(fields) ? (
                    <FilterCatalogs />
                ) : ["quotationsforms"].includes(fields) ? (
                    <FilterQuotationsForms />
                ) : ["quotationssearchs"].includes(fields) ? (
                    <FilterQuotationsSearchs />
                ) : ["products"].includes(fields) ? (
                    <FilterProducts />
                ) : ["questions"].includes(fields) ? (
                    <FilterQuestions />
                ) : ["questionsgroups"].includes(fields) ? (
                    <FilterQuestionsGroups />
                ) : location.pathname.includes("factory") ? (
                    <FilterSettings />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
});
