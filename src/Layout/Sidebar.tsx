import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Separator,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components";
import { CONSTANT_ROLES } from "@/constants";
import { useAuth } from "@/context";
import { cn } from "@/lib";
import {
    modulesDef,
    modulesFactory,
    modulesQuotations,
    modulesSettings,
} from "@/routes";
import { modulesAll, modulesProducts, SIZE_ICON } from "@/routes/modules";
import { deleteApi, postApi } from "@/services";
import {
    FileTextIcon,
    HomeIcon,
    StarFilledIcon,
    StarIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { FactoryIcon, PackageSearchIcon, SettingsIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
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
    const { applyRules, favorites, user, refreshFavorites } = useAuth();

    const rulesKanto = JSON.parse(
        window.sessionStorage.getItem(CONSTANT_ROLES) || "[]"
    ) as string[];

    const [stateOpen, setOpen] = useState("");
    const [stateOpenPopov, setOpenPopov] = useState("");

    const handleFav = async (item: any) => {
        const { success } = await postApi({
            url: "/favorite",
            body: {
                email: user?.email,
                name: item.name,
            },
        });
        if (success) {
            refreshFavorites();
        }
    };

    const handleUnFav = async (item: any) => {
        const { success } = await deleteApi({
            url: "/favorite",
            config: {
                params: {
                    email: user?.email,
                    name: item.name,
                },
            },
        });
        if (success) {
            refreshFavorites();
        }
    };

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

                {favorites.data
                    .filter((_, i) => i < 4)
                    .map((v) => {
                        const findModule = modulesAll.find(
                            (d) => d.name == v.name
                        );
                        if (findModule) {
                            return (
                                <Button
                                    key={v.name}
                                    size="icon"
                                    onClick={() => navigate(findModule.link)}
                                    variant={
                                        findModule.link == location.pathname
                                            ? "outline"
                                            : "default"
                                    }
                                >
                                    {findModule.Icon}
                                </Button>
                            );
                        }
                        return <Fragment key={v.id}></Fragment>;
                    })}
                {favorites.data.length >= 5 ? (
                    <Popover
                        onOpenChange={(p) => setOpenPopov(p ? "fav" : "")}
                        open={stateOpenPopov === "fav"}
                    >
                        <PopoverTrigger asChild>
                            <Button size="icon" variant="default">
                                <StarFilledIcon
                                    width={SIZE_ICON}
                                    height={SIZE_ICON}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={cn("flex", "flex-col", "p-2")}
                            side="right"
                        >
                            {favorites.data
                                .filter((_, i) => i >= 5)
                                .map((v) => {
                                    const findModule = modulesAll.find(
                                        (d) => d.name == v.name
                                    );
                                    if (findModule) {
                                        return (
                                            <Button
                                                key={`favs-${findModule.name}`}
                                                className={cn(
                                                    "w-auto",
                                                    "px-4",
                                                    "py-2",
                                                    "gap-2",
                                                    "justify-between"
                                                )}
                                                onClick={() => {
                                                    navigate(findModule.link);
                                                    setOpenPopov("");
                                                }}
                                                variant={
                                                    findModule.link ==
                                                    location.pathname
                                                        ? "outline"
                                                        : "ghost"
                                                }
                                            >
                                                {findModule.Icon}
                                                <span
                                                    className={cn(
                                                        "flex-1",
                                                        "text-left"
                                                    )}
                                                >
                                                    {t(findModule.name)}
                                                </span>
                                            </Button>
                                        );
                                    }
                                    return <Fragment key={v.id}></Fragment>;
                                })}
                        </PopoverContent>
                    </Popover>
                ) : (
                    <></>
                )}
                <Separator />
                {modulesDef
                    .filter((v) => rulesKanto.includes(`${v.name}.list`))
                    .map((v) => (
                        <Button
                            key={v.name}
                            size="icon"
                            onClick={() => navigate(v.link)}
                            variant={
                                v.link == location.pathname
                                    ? "outline"
                                    : "default"
                            }
                        >
                            {v.Icon}
                        </Button>
                    ))}
                {modulesProducts.filter((v) =>
                    rulesKanto.includes(`${v.name}.list`)
                ).length > 0 ? (
                    <Popover
                        onOpenChange={(p) => setOpenPopov(p ? "products" : "")}
                        open={stateOpenPopov === "products"}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                size="icon"
                                variant={
                                    location.pathname.split("/")[1] ===
                                    "products"
                                        ? "outline"
                                        : "default"
                                }
                            >
                                <PackageSearchIcon size={20} />
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
                            {modulesProducts
                                .filter((v) =>
                                    rulesKanto.includes(`${v.name}.list`)
                                )
                                .map((v) => (
                                    <Button
                                        key={v.name}
                                        className={cn(
                                            "w-auto",
                                            "px-4",
                                            "py-2",
                                            "gap-2",
                                            "justify-between"
                                        )}
                                        onClick={() => {
                                            navigate(v.link);
                                            setOpenPopov("");
                                        }}
                                        variant={
                                            v.link == location.pathname
                                                ? "outline"
                                                : "ghost"
                                        }
                                    >
                                        {v.Icon}
                                        <span
                                            className={cn(
                                                "flex-1",
                                                "text-left"
                                            )}
                                        >
                                            {t(v.name)}
                                        </span>
                                    </Button>
                                ))}
                        </PopoverContent>
                    </Popover>
                ) : (
                    <></>
                )}
                {modulesQuotations.filter((v) =>
                    rulesKanto.includes(`${v.name}.list`)
                ).length > 0 ? (
                    <Popover
                        onOpenChange={(p) =>
                            setOpenPopov(p ? "quotations" : "")
                        }
                        open={stateOpenPopov === "quotations"}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                size="icon"
                                variant={
                                    location.pathname.includes("quotations")
                                        ? "outline"
                                        : "default"
                                }
                            >
                                <FileTextIcon
                                    width={SIZE_ICON}
                                    height={SIZE_ICON}
                                />
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
                            {modulesQuotations
                                .filter((v) =>
                                    rulesKanto.includes(`${v.name}.list`)
                                )
                                .map((v) => (
                                    <Button
                                        key={v.name}
                                        className={cn(
                                            "w-auto",
                                            "px-4",
                                            "py-2",
                                            "gap-2",
                                            "justify-between"
                                        )}
                                        onClick={() => {
                                            navigate(v.link);
                                            setOpenPopov("");
                                        }}
                                        variant={
                                            v.link == location.pathname
                                                ? "outline"
                                                : "ghost"
                                        }
                                    >
                                        {v.Icon}
                                        <span
                                            className={cn(
                                                "flex-1",
                                                "text-left"
                                            )}
                                        >
                                            {t(v.name)}
                                        </span>
                                    </Button>
                                ))}
                        </PopoverContent>
                    </Popover>
                ) : (
                    <></>
                )}
                {modulesFactory.filter((v) =>
                    rulesKanto.includes(`${v.name}.list`)
                ).length > 0 ? (
                    <Popover
                        onOpenChange={(p) => setOpenPopov(p ? "factory" : "")}
                        open={stateOpenPopov === "factory"}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                size="icon"
                                variant={
                                    location.pathname.includes("factory")
                                        ? "outline"
                                        : "default"
                                }
                            >
                                <FactoryIcon size={SIZE_ICON} />
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
                            {modulesFactory
                                .filter((v) =>
                                    rulesKanto.includes(`${v.name}.list`)
                                )
                                .map((v) => (
                                    <Button
                                        key={v.name}
                                        className={cn(
                                            "w-auto",
                                            "px-4",
                                            "py-2",
                                            "gap-2",
                                            "justify-between"
                                        )}
                                        onClick={() => {
                                            navigate(v.link);
                                            setOpenPopov("");
                                        }}
                                        variant={
                                            v.link == location.pathname
                                                ? "outline"
                                                : "ghost"
                                        }
                                    >
                                        {v.Icon}
                                        <span
                                            className={cn(
                                                "flex-1",
                                                "text-left"
                                            )}
                                        >
                                            {t(v.name)}
                                        </span>
                                    </Button>
                                ))}
                        </PopoverContent>
                    </Popover>
                ) : (
                    <></>
                )}
                {modulesSettings.filter((v) =>
                    rulesKanto.includes(`${v.name}.list`)
                ).length > 0 ? (
                    <Popover
                        onOpenChange={(p) => setOpenPopov(p ? "settings" : "")}
                        open={stateOpenPopov === "settings"}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                size="icon"
                                variant={
                                    location.pathname.includes("settings")
                                        ? "outline"
                                        : "default"
                                }
                            >
                                <SettingsIcon size={SIZE_ICON} />
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
                            {modulesSettings
                                .filter((v) =>
                                    rulesKanto.includes(`${v.name}.list`)
                                )
                                .map((v) => (
                                    <Button
                                        key={v.name}
                                        className={cn(
                                            "w-auto",
                                            "px-4",
                                            "py-2",
                                            "gap-2",
                                            "justify-between"
                                        )}
                                        onClick={() => {
                                            navigate(v.link);
                                            setOpenPopov("");
                                        }}
                                        variant={
                                            v.link == location.pathname
                                                ? "outline"
                                                : "ghost"
                                        }
                                    >
                                        {v.Icon}
                                        <span
                                            className={cn(
                                                "flex-1",
                                                "text-left"
                                            )}
                                        >
                                            {t(v.name)}
                                        </span>
                                    </Button>
                                ))}
                        </PopoverContent>
                    </Popover>
                ) : (
                    <></>
                )}
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
                        {favorites.data.length ? (
                            <>
                                <span className="text-white">Favoritos</span>
                                <div className="w-full max-h-40 overflow-auto">
                                    {favorites.data.map((v: any) => {
                                        const findModule = modulesAll.find(
                                            (d) => d.name == v.name
                                        );
                                        if (findModule) {
                                            return (
                                                <div
                                                    key={`fav-${v.name}`}
                                                    className="w-full flex items-center justify-between gap-2"
                                                >
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
                                                        onClick={() =>
                                                            navigate(
                                                                findModule.link
                                                            )
                                                        }
                                                        variant={
                                                            findModule.link ==
                                                            location.pathname
                                                                ? "outline"
                                                                : "default"
                                                        }
                                                        data-rule-component="rule"
                                                        data-rule-component-id={
                                                            findModule.name
                                                        }
                                                    >
                                                        {findModule.Icon}
                                                        <span
                                                            className={cn(
                                                                "flex-1",
                                                                "text-left",
                                                                "hidden",
                                                                "lg:block"
                                                            )}
                                                        >
                                                            {t(findModule.name)}
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="default"
                                                        onClick={() =>
                                                            handleUnFav(
                                                                findModule
                                                            )
                                                        }
                                                    >
                                                        <TrashIcon />
                                                    </Button>
                                                </div>
                                            );
                                        }
                                        return <Fragment key={v.id}></Fragment>;
                                    })}
                                </div>
                                <Separator />
                            </>
                        ) : (
                            <></>
                        )}
                        {modulesDef.map((v) => {
                            if (
                                favorites?.data?.find((d) => d.name == v.name)
                            ) {
                                return (
                                    <div
                                        key={v.name}
                                        className="w-full flex items-center justify-between gap-2"
                                    >
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
                                        <Button
                                            variant="default"
                                            onClick={() => handleUnFav(v)}
                                        >
                                            <StarFilledIcon />
                                        </Button>
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={v.name}
                                    className="w-full flex items-center justify-between gap-2"
                                >
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
                                    <Button
                                        variant="default"
                                        onClick={() => handleFav(v)}
                                    >
                                        <StarIcon />
                                    </Button>
                                </div>
                            );
                        })}

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
                                        "max-h-[calc(100svh-500px)]",
                                        "pb-1"
                                    )}
                                >
                                    {modulesQuotations.map((s: any) => {
                                        if (
                                            favorites?.data?.find(
                                                (d) => d.name == s.name
                                            )
                                        ) {
                                            return (
                                                <div
                                                    key={s.name}
                                                    className="w-full flex items-center justify-between gap-2"
                                                >
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
                                                        onClick={() => {
                                                            setOpen("");
                                                            navigate(s.link);
                                                        }}
                                                        variant={
                                                            s.link ==
                                                            location.pathname
                                                                ? "outline"
                                                                : "default"
                                                        }
                                                        data-rule-component="rule"
                                                        data-rule-component-id={
                                                            s.name
                                                        }
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
                                                    <Button
                                                        variant="default"
                                                        onClick={() =>
                                                            handleUnFav(s)
                                                        }
                                                    >
                                                        <StarFilledIcon />
                                                    </Button>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                key={s.name}
                                                className="w-full flex items-center justify-between gap-2"
                                            >
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
                                                    onClick={() => {
                                                        setOpen("");
                                                        navigate(s.link);
                                                    }}
                                                    variant={
                                                        s.link ==
                                                        location.pathname
                                                            ? "outline"
                                                            : "default"
                                                    }
                                                    data-rule-component="rule"
                                                    data-rule-component-id={
                                                        s.name
                                                    }
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
                                                <Button
                                                    variant="default"
                                                    onClick={() => handleFav(s)}
                                                >
                                                    <StarIcon />
                                                </Button>
                                            </div>
                                        );
                                    })}
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
                                        "max-h-[calc(100svh-500px)]",
                                        "pb-1"
                                    )}
                                >
                                    {modulesFactory.map((s: any) => {
                                        if (
                                            favorites?.data?.find(
                                                (d) => d.name == s.name
                                            )
                                        ) {
                                            return (
                                                <div
                                                    key={s.name}
                                                    className="w-full flex items-center justify-between gap-2"
                                                >
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
                                                        onClick={() => {
                                                            setOpen("");
                                                            navigate(s.link);
                                                        }}
                                                        variant={
                                                            s.link ==
                                                            location.pathname
                                                                ? "outline"
                                                                : "default"
                                                        }
                                                        data-rule-component="rule"
                                                        data-rule-component-id={
                                                            s.name
                                                        }
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
                                                    <Button
                                                        variant="default"
                                                        onClick={() =>
                                                            handleUnFav(s)
                                                        }
                                                    >
                                                        <StarFilledIcon />
                                                    </Button>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                key={s.name}
                                                className="w-full flex items-center justify-between gap-2"
                                            >
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
                                                    onClick={() => {
                                                        setOpen("");
                                                        navigate(s.link);
                                                    }}
                                                    variant={
                                                        s.link ==
                                                        location.pathname
                                                            ? "outline"
                                                            : "default"
                                                    }
                                                    data-rule-component="rule"
                                                    data-rule-component-id={
                                                        s.name
                                                    }
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
                                                <Button
                                                    variant="default"
                                                    onClick={() => handleFav(s)}
                                                >
                                                    <StarIcon />
                                                </Button>
                                            </div>
                                        );
                                    })}
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
                                        "max-h-[calc(100svh-500px)]",
                                        "pb-1"
                                    )}
                                >
                                    {modulesSettings.map((s: any) => {
                                        if (
                                            favorites?.data?.find(
                                                (d) => d.name == s.name
                                            )
                                        ) {
                                            return (
                                                <div
                                                    key={s.name}
                                                    className="w-full flex items-center justify-between gap-2"
                                                >
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
                                                        onClick={() => {
                                                            setOpen("");
                                                            navigate(s.link);
                                                        }}
                                                        variant={
                                                            s.link ==
                                                            location.pathname
                                                                ? "outline"
                                                                : "default"
                                                        }
                                                        data-rule-component="rule"
                                                        data-rule-component-id={
                                                            s.name
                                                        }
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
                                                    <Button
                                                        variant="default"
                                                        onClick={() =>
                                                            handleUnFav(s)
                                                        }
                                                    >
                                                        <StarFilledIcon />
                                                    </Button>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                key={s.name}
                                                className="w-full flex items-center justify-between gap-2"
                                            >
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
                                                    onClick={() => {
                                                        setOpen("");
                                                        navigate(s.link);
                                                    }}
                                                    variant={
                                                        s.link ==
                                                        location.pathname
                                                            ? "outline"
                                                            : "default"
                                                    }
                                                    data-rule-component="rule"
                                                    data-rule-component-id={
                                                        s.name
                                                    }
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
                                                <Button
                                                    variant="default"
                                                    onClick={() => handleFav(s)}
                                                >
                                                    <StarIcon />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};
