import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Separator,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    ToggleGroup,
    ToggleGroupItem,
} from "@/components";
import { useAuth } from "@/context";
import { cn } from "@/lib";
import { modulesDef, modulesSettings } from "@/routes/modules";
import { getParamByPath } from "@/utils";
import {
    ExitIcon,
    HamburgerMenuIcon,
    HomeIcon,
    PersonIcon,
    StarIcon,
} from "@radix-ui/react-icons";
import { Fragment, useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Sidebar = (props: { sheet?: boolean }) => {
    const { sheet } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { applyRules } = useAuth();

    const [stateOpenSettings, setOpenSettings] = useState("");

    useEffect(() => {
        applyRules();
    }, [stateOpenSettings]);

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
                            v.link === location.pathname ? "outline" : "default"
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
                                <HomeIcon />
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
                                "border-none"
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
                                        s.link === location.pathname
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
                "hidden",
                "sm:flex",
                "sm:w-14",
                "md:w-80",
                "h-full",
                "bg-primary",
                "dark:bg-slate-800",
                "rounded-lg",
                "p-2",
                "flex-col",
                "gap-2"
            )}
        >
            <div>
                <img
                    src="https://http2.mlstatic.com/storage/mshops-appearance-api/images/31/153113631/logo-2023070222281087800.webp"
                    className={cn("object-contain", "max-h-16", "w-full")}
                />
            </div>
            {modulesDef.map((v) => (
                <Button
                    key={v.name}
                    className={cn(
                        "p-0",
                        "sm:w-9",
                        "md:w-auto",
                        "md:px-4",
                        "md:py-2",
                        "gap-2",
                        "justify-center",
                        "md:justify-between"
                    )}
                    onClick={() => navigate(v.link)}
                    variant={
                        v.link === location.pathname ? "outline" : "default"
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
                            "md:block"
                        )}
                    >
                        {t(v.name)}
                    </span>
                </Button>
            ))}
            <Accordion
                type="single"
                collapsible
                className="hidden md:block"
                value={stateOpenSettings}
                onValueChange={setOpenSettings}
            >
                <AccordionItem value="settings" className="border-none">
                    <AccordionTrigger className="h-9">
                        <Button
                            className={cn(
                                "p-0",
                                "sm:w-9",
                                "md:w-auto",
                                "md:px-4",
                                "md:py-2",
                                "gap-2",
                                "justify-center",
                                "md:justify-between"
                            )}
                            variant={
                                ["/settings"].includes(
                                    getParamByPath(location.pathname, 0)
                                )
                                    ? "outline"
                                    : "default"
                            }
                        >
                            <HomeIcon />
                            <span
                                className={cn(
                                    "flex-1",
                                    "text-left",
                                    "hidden",
                                    "md:block"
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
                            "border-none"
                        )}
                    >
                        {modulesSettings.map((s) => (
                            <Button
                                key={s.name}
                                className={cn(
                                    "p-0",
                                    "sm:w-9",
                                    "md:w-auto",
                                    "md:px-4",
                                    "md:py-2",
                                    "gap-2",
                                    "justify-center",
                                    "md:justify-between"
                                )}
                                onClick={() => navigate(s.link)}
                                variant={
                                    s.link === location.pathname
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
                                        "md:block"
                                    )}
                                >
                                    {t(s.name)}
                                </span>
                            </Button>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Popover>
                <PopoverTrigger className="block md:hidden">
                    <Button
                        className={cn("p-0", "w-9", "gap-2", "justify-center")}
                    >
                        <HomeIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className={cn(
                        "flex",
                        "flex-col",
                        "gap-2",
                        "bg-primary",
                        "p-2"
                    )}
                    side="right"
                >
                    <Button
                        className={cn(
                            "w-auto",
                            "px-4",
                            "py-2",
                            "gap-2",
                            "justify-between"
                        )}
                        onClick={() => navigate("/settings/colors")}
                        variant={
                            "/settings/colors" === location.pathname
                                ? "outline"
                                : "default"
                        }
                    >
                        <HomeIcon />
                        <span className={cn("flex-1", "text-left")}>
                            {t("colors")}
                        </span>
                    </Button>
                    <Button
                        className={cn(
                            "w-auto",
                            "px-4",
                            "py-2",
                            "gap-2",
                            "justify-between"
                        )}
                        onClick={() => navigate("/settings/regions")}
                        variant={
                            "/settings/regions" === location.pathname
                                ? "outline"
                                : "default"
                        }
                    >
                        <HomeIcon />
                        <span className={cn("flex-1", "text-left")}>
                            {t("regions")}
                        </span>
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
};

const Layout = () => {
    const [openSidebar, setOpenSidebar] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();
    const { applyRules, signout, user } = useAuth();

    const toggleSidebar = useCallback(
        () => setOpenSidebar(!openSidebar),
        [openSidebar]
    );

    // const toggleTheme = useCallback(() => {
    //     setTheme(theme === "dark" ? "light" : "dark");
    // }, [theme]);

    useEffect(() => {
        applyRules();
    }, [location.pathname]);

    return (
        <>
            <div
                className={cn(
                    "w-svw",
                    "h-svh",
                    "bg-slate-300",
                    "dark:bg-primary-foreground",
                    "flex",
                    "p-5",
                    "gap-5"
                )}
            >
                <Sidebar />
                <div
                    className={cn(
                        "w-full",
                        "h-full",
                        "bg-white",
                        "dark:bg-slate-800",
                        "rounded-lg",
                        "p-2"
                    )}
                >
                    <div
                        className={cn(
                            "w-full",
                            "flex",
                            "items-center",
                            "justify-between",
                            "border-b",
                            "border-b-slate-300",
                            "dark:border-b-slate-700",
                            "p-2"
                        )}
                    >
                        <div
                            className={cn(
                                "flex",
                                "items-center",
                                "justify-start",
                                "gap-2"
                            )}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSidebar}
                                className={cn("flex", "sm:hidden")}
                            >
                                <HamburgerMenuIcon />
                            </Button>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/">
                                            {t("home")}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {location.pathname
                                        .split("/")
                                        .filter((item) => !!item)
                                        .map((item, i, s) =>
                                            i < s.length - 1 ? (
                                                <Fragment key={item}>
                                                    <BreadcrumbSeparator />
                                                    <BreadcrumbItem>
                                                        <BreadcrumbLink
                                                            href={item}
                                                        >
                                                            {t(item)}
                                                        </BreadcrumbLink>
                                                    </BreadcrumbItem>
                                                </Fragment>
                                            ) : (
                                                <Fragment key={item}>
                                                    <BreadcrumbSeparator />
                                                    <BreadcrumbItem>
                                                        <BreadcrumbPage>
                                                            {t(item)}
                                                        </BreadcrumbPage>
                                                    </BreadcrumbItem>
                                                </Fragment>
                                            )
                                        )}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div
                            className={cn(
                                "flex",
                                "items-center",
                                "justify-end",
                                "gap-2"
                            )}
                        >
                            {/* <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                            >
                                <MoonIcon />
                            </Button> */}
                            <Popover>
                                <PopoverTrigger>
                                    <Button variant="ghost" size="icon">
                                        <Avatar>
                                            <AvatarImage
                                                src="https://github.com/shadcn.png"
                                                alt="@shadcn"
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex flex-col gap-2 p-2 max-w-60 mr-2">
                                    <Button
                                        variant="ghost"
                                        className="flex items-center justify-start gap-2"
                                    >
                                        <PersonIcon />
                                        {user?.name}
                                    </Button>
                                    <Separator />
                                    <div
                                        className={cn(
                                            "flex",
                                            "items-center",
                                            "gap-2",
                                            "pl-4"
                                        )}
                                    >
                                        <StarIcon />
                                        <span className="text-sm font-semibold">
                                            {t("language")}
                                        </span>
                                        <ToggleGroup
                                            type="single"
                                            value={i18n.language?.toLowerCase()}
                                            onValueChange={i18n.changeLanguage}
                                        >
                                            <ToggleGroupItem value="pt-br">
                                                <ReactCountryFlag
                                                    countryCode="BR"
                                                    svg
                                                    title="PT-BR"
                                                />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="en-us">
                                                <ReactCountryFlag
                                                    countryCode="US"
                                                    svg
                                                    title="EN-US"
                                                />
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                    <Separator />
                                    <Button
                                        variant="ghost"
                                        className="flex items-center justify-start gap-2"
                                        onClick={() => {
                                            signout(() => {
                                                navigate("/");
                                            });
                                        }}
                                    >
                                        <ExitIcon />
                                        {t("logout")}
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className={cn("w-full", "h-[calc(100%-60px)]")}>
                        <Outlet />
                    </div>
                </div>
            </div>

            <Sheet
                open={openSidebar}
                onOpenChange={setOpenSidebar}
                defaultOpen={false}
            >
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
                    <Sidebar sheet />
                </SheetContent>
            </Sheet>
        </>
    );
};

export { Layout };
