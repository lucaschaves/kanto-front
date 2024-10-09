import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components";
import { useAuth } from "@/context";
import { cn } from "@/lib";
import {
    modulesDef,
    modulesFactory,
    modulesQuotations,
    modulesSettings,
} from "@/routes";
import { modulesPayments, modulesProducts } from "@/routes/modules";
import { FileTextIcon, HomeIcon } from "@radix-ui/react-icons";
import { FactoryIcon, PackageSearchIcon, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface IPropsSidebar {
    sheet?: boolean;
    open: boolean;
    toggle: () => void;
}

export const Sidebar = (props: IPropsSidebar) => {
    const { open, toggle } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { applyRules } = useAuth();

    const [stateOpen, setOpen] = useState("");

    useEffect(() => {
        applyRules();
        if (!stateOpen) {
            setOpen(
                location.pathname.includes("quotations")
                    ? "quotations"
                    : location.pathname.includes("factory")
                    ? "factory"
                    : location.pathname.includes("settings")
                    ? "settings"
                    : ""
            );
        }
    }, [stateOpen]);

    return (
        <>
            <div
                className={cn(
                    "hidden",
                    "sm:flex",
                    "sm:min-w-14",
                    "sm:w-14",
                    "h-full",
                    "bg-primary",
                    "dark:bg-slate-800",
                    "rounded-lg",
                    "p-2",
                    "flex-col",
                    "items-center",
                    "gap-2"
                )}
            >
                <div
                    className={cn(
                        "h-auto",
                        "w-full",
                        "flex",
                        "items-center",
                        "justify-center",
                        "cursor-pointer",
                        "hover:opacity-50"
                    )}
                >
                    <img
                        onClick={toggle}
                        src="https://http2.mlstatic.com/storage/mshops-appearance-api/images/31/153113631/logo-2023070222281087800.webp"
                        className={cn("object-contain", "max-h-16", "w-full")}
                    />
                </div>
                {modulesDef.map((v) => (
                    <Button
                        key={v.name}
                        size="icon"
                        onClick={() => navigate(v.link)}
                        variant={
                            v.link == location.pathname ? "outline" : "default"
                        }
                    >
                        {v.Icon}
                    </Button>
                ))}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant={
                                location.pathname.split("/")[1] === "products"
                                    ? "outline"
                                    : "default"
                            }
                        >
                            <PackageSearchIcon size={15} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className={cn(
                            "flex",
                            "flex-col",
                            // "gap-2",
                            "p-2"
                        )}
                        side="right"
                    >
                        {modulesProducts.map((v) => (
                            <Button
                                key={v.name}
                                className={cn(
                                    "w-auto",
                                    "px-4",
                                    "py-2",
                                    "gap-2",
                                    "justify-between"
                                )}
                                onClick={() => navigate(v.link)}
                                variant={
                                    v.link == location.pathname
                                        ? "outline"
                                        : "ghost"
                                }
                            >
                                {v.Icon}
                                <span className={cn("flex-1", "text-left")}>
                                    {t(v.name)}
                                </span>
                            </Button>
                        ))}
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant={
                                location.pathname.split("/")[1] === "payments"
                                    ? "outline"
                                    : "default"
                            }
                        >
                            <PackageSearchIcon size={15} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className={cn(
                            "flex",
                            "flex-col",
                            // "gap-2",
                            "p-2"
                        )}
                        side="right"
                    >
                        {modulesPayments.map((v) => (
                            <Button
                                key={v.name}
                                className={cn(
                                    "w-auto",
                                    "px-4",
                                    "py-2",
                                    "gap-2",
                                    "justify-between"
                                )}
                                onClick={() => navigate(v.link)}
                                variant={
                                    v.link == location.pathname
                                        ? "outline"
                                        : "ghost"
                                }
                            >
                                {v.Icon}
                                <span className={cn("flex-1", "text-left")}>
                                    {t(v.name)}
                                </span>
                            </Button>
                        ))}
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant={
                                location.pathname.includes("quotations")
                                    ? "outline"
                                    : "default"
                            }
                        >
                            <FileTextIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className={cn(
                            "flex",
                            "flex-col",
                            // "gap-2",
                            "p-2"
                        )}
                        side="right"
                    >
                        {modulesQuotations.map((v) => (
                            <Button
                                key={v.name}
                                className={cn(
                                    "w-auto",
                                    "px-4",
                                    "py-2",
                                    "gap-2",
                                    "justify-between"
                                )}
                                onClick={() => navigate(v.link)}
                                variant={
                                    v.link == location.pathname
                                        ? "outline"
                                        : "ghost"
                                }
                            >
                                {v.Icon}
                                <span className={cn("flex-1", "text-left")}>
                                    {t(v.name)}
                                </span>
                            </Button>
                        ))}
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant={
                                location.pathname.includes("factory")
                                    ? "outline"
                                    : "default"
                            }
                        >
                            <FactoryIcon size={15} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className={cn(
                            "flex",
                            "flex-col",
                            // "gap-2",
                            "p-2"
                        )}
                        side="right"
                    >
                        {modulesFactory.map((v) => (
                            <Button
                                key={v.name}
                                className={cn(
                                    "w-auto",
                                    "px-4",
                                    "py-2",
                                    "gap-2",
                                    "justify-between"
                                )}
                                onClick={() => navigate(v.link)}
                                variant={
                                    v.link == location.pathname
                                        ? "outline"
                                        : "ghost"
                                }
                            >
                                {v.Icon}
                                <span className={cn("flex-1", "text-left")}>
                                    {t(v.name)}
                                </span>
                            </Button>
                        ))}
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant={
                                location.pathname.includes("settings")
                                    ? "outline"
                                    : "default"
                            }
                        >
                            <SettingsIcon size={15} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className={cn(
                            "flex",
                            "flex-col",
                            // "gap-2",
                            "p-2"
                        )}
                        side="right"
                    >
                        {modulesSettings.map((v) => (
                            <Button
                                key={v.name}
                                className={cn(
                                    "w-auto",
                                    "px-4",
                                    "py-2",
                                    "gap-2",
                                    "justify-between"
                                )}
                                onClick={() => navigate(v.link)}
                                variant={
                                    v.link == location.pathname
                                        ? "outline"
                                        : "ghost"
                                }
                            >
                                {v.Icon}
                                <span className={cn("flex-1", "text-left")}>
                                    {t(v.name)}
                                </span>
                            </Button>
                        ))}
                    </PopoverContent>
                </Popover>
            </div>

            <Sheet open={open} onOpenChange={toggle} defaultOpen={false}>
                <SheetContent
                    side="left"
                    className={cn("bg-primary")}
                    classNameButton="text-primary-foreground"
                >
                    <SheetHeader>
                        <SheetTitle className="text-primary-foreground">
                            Menu
                        </SheetTitle>
                    </SheetHeader>
                    <div
                        className={cn(
                            "w-full",
                            "h-full",
                            "bg-primary",
                            "rounded-lg",
                            "p-2",
                            "flex-col",
                            "gap-2",
                            "flex",
                            "flex-col"
                        )}
                    >
                        {modulesDef.map((v) => (
                            <Button
                                key={v.name}
                                className={cn(
                                    "p-0",
                                    "sm:w-9",
                                    "lg:w-auto",
                                    "lg:px-4",
                                    "lg:py-2",
                                    "gap-2",
                                    "justify-center",
                                    "lg:justify-between"
                                )}
                                onClick={() => navigate(v.link)}
                                variant={
                                    v.link == location.pathname
                                        ? "outline"
                                        : "default"
                                }
                                data-rule-component="rule"
                                data-rule-component-id={v.name}
                            >
                                {v.Icon}
                                <span
                                    className={cn(
                                        "flex-1",
                                        "text-left",
                                        "hidden",
                                        "lg:block"
                                    )}
                                >
                                    {t(v.name)}
                                </span>
                            </Button>
                        ))}
                        <Accordion
                            type="single"
                            collapsible
                            className="hidden lg:block"
                            value={stateOpen}
                            onValueChange={setOpen}
                        >
                            <AccordionItem
                                value="quotations"
                                className="border-none"
                            >
                                <AccordionTrigger className="h-12">
                                    <Button
                                        className={cn(
                                            "p-0",
                                            "sm:w-9",
                                            "lg:w-full",
                                            "lg:px-4",
                                            "lg:py-2",
                                            "gap-2",
                                            "justify-center",
                                            "lg:justify-between"
                                        )}
                                    >
                                        <FileTextIcon />
                                        <span
                                            className={cn(
                                                "flex-1",
                                                "text-left",
                                                "hidden",
                                                "lg:block"
                                            )}
                                        >
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
                                        "overflow-auto",
                                        "max-h-[calc(100vh-310px)]",
                                        "pb-1"
                                    )}
                                >
                                    {modulesQuotations.map((s) => (
                                        <Button
                                            key={s.name}
                                            className={cn(
                                                "p-0",
                                                "sm:w-9",
                                                "lg:w-auto",
                                                "lg:px-4",
                                                "lg:py-2",
                                                "gap-2",
                                                "justify-center",
                                                "lg:justify-between"
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
                                            <span
                                                className={cn(
                                                    "flex-1",
                                                    "text-left",
                                                    "hidden",
                                                    "lg:block"
                                                )}
                                            >
                                                {t(s.name)}
                                            </span>
                                        </Button>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem
                                value="factory"
                                className="border-none"
                            >
                                <AccordionTrigger className="h-12">
                                    <Button
                                        className={cn(
                                            "p-0",
                                            "sm:w-9",
                                            "lg:w-full",
                                            "lg:px-4",
                                            "lg:py-2",
                                            "gap-2",
                                            "justify-center",
                                            "lg:justify-between"
                                        )}
                                    >
                                        <FactoryIcon size={15} />
                                        <span
                                            className={cn(
                                                "flex-1",
                                                "text-left",
                                                "hidden",
                                                "lg:block"
                                            )}
                                        >
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
                                        "overflow-auto",
                                        "max-h-[calc(100vh-310px)]",
                                        "pb-1"
                                    )}
                                >
                                    {modulesFactory.map((s) => (
                                        <Button
                                            key={s.name}
                                            className={cn(
                                                "p-0",
                                                "sm:w-9",
                                                "lg:w-auto",
                                                "lg:px-4",
                                                "lg:py-2",
                                                "gap-2",
                                                "justify-center",
                                                "lg:justify-between"
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
                                            <span
                                                className={cn(
                                                    "flex-1",
                                                    "text-left",
                                                    "hidden",
                                                    "lg:block"
                                                )}
                                            >
                                                {t(s.name)}
                                            </span>
                                        </Button>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem
                                value="settings"
                                className="border-none"
                            >
                                <AccordionTrigger className="h-12">
                                    <Button
                                        className={cn(
                                            "p-0",
                                            "sm:w-9",
                                            "lg:w-full",
                                            "lg:px-4",
                                            "lg:py-2",
                                            "gap-2",
                                            "justify-center",
                                            "lg:justify-between"
                                        )}
                                    >
                                        <SettingsIcon size={15} />
                                        <span
                                            className={cn(
                                                "flex-1",
                                                "text-left",
                                                "hidden",
                                                "lg:block"
                                            )}
                                        >
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
                                        "overflow-auto",
                                        "max-h-[calc(100vh-310px)]",
                                        "pb-1"
                                    )}
                                >
                                    {modulesSettings.map((s) => (
                                        <Button
                                            key={s.name}
                                            className={cn(
                                                "p-0",
                                                "sm:w-9",
                                                "lg:w-auto",
                                                "lg:px-4",
                                                "lg:py-2",
                                                "gap-2",
                                                "justify-center",
                                                "lg:justify-between"
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
                                            <span
                                                className={cn(
                                                    "flex-1",
                                                    "text-left",
                                                    "hidden",
                                                    "lg:block"
                                                )}
                                            >
                                                {t(s.name)}
                                            </span>
                                        </Button>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};
