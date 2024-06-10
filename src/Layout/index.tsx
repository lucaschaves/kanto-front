import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Avatar,
    AvatarFallback,
    AvatarImage,
    BaseForm,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    FButtonSubmit,
    FInputLabel,
    IBaseFormRef,
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
import { getApi, putApi } from "@/services";
import { getParamByPath } from "@/utils";
import {
    ExitIcon,
    HamburgerMenuIcon,
    HomeIcon,
    PersonIcon,
    StarIcon,
} from "@radix-ui/react-icons";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
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
                "hidden",
                "sm:flex",
                "sm:min-w-14",
                "sm:w-14",
                "md:min-w-72",
                "md:w-72",
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
                        v.link == location.pathname ? "outline" : "default"
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
                                "md:w-full",
                                "md:px-4",
                                "md:py-2",
                                "gap-2",
                                "justify-center",
                                "md:justify-between"
                            )}
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
                            "border-none",
                            "overflow-auto",
                            "max-h-[calc(100vh-310px)]"
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
                            "/settings/colors" == location.pathname
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
                            "/settings/regions" == location.pathname
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

    const refForm = useRef<IBaseFormRef>(null);

    const [stateUser, setUser] = useState<string | null>(null);
    const [stateLoading, setLoading] = useState(false);

    const toggleSidebar = useCallback(
        () => setOpenSidebar(!openSidebar),
        [openSidebar]
    );

    const onSubmit = useCallback(
        async (data: any) => {
            const { success } = await putApi({
                url: `user/${stateUser}`,
                body: data,
            });
            if (success) {
                setUser(null);
            }
        },
        [stateUser]
    );

    const getDataUser = useCallback(async () => {
        setLoading(true);
        const { success, data } = await getApi({
            url: `/user/${stateUser}`,
        });
        if (success) {
            refForm.current?.reset(data);
        }
        setLoading(false);
    }, [stateUser]);

    useEffect(() => {
        if (!!stateUser) getDataUser();
    }, [stateUser]);

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
                                        onClick={() => setUser("1")}
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
                    <div className={cn("w-full", "h-[calc(100%-55px)]")}>
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

            <Dialog modal onOpenChange={() => setUser(null)} open={!!stateUser}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Usuário</DialogTitle>
                    </DialogHeader>
                    <div
                        className={cn(
                            "w-full",
                            "grid",
                            "grid-cols-2",
                            "sm:grid-cols-2",
                            "gap-1",
                            "sm:gap-2"
                        )}
                    >
                        <BaseForm onSubmit={onSubmit} ref={refForm}>
                            <FInputLabel
                                label="Name"
                                name="name"
                                disabled={stateLoading}
                                rules={{
                                    required: true,
                                }}
                            />
                            <FInputLabel
                                label="Email"
                                name="email"
                                disabled={stateLoading}
                                rules={{
                                    required: true,
                                }}
                            />
                            <FInputLabel
                                label="Senha atual"
                                name="password"
                                disabled={stateLoading}
                                className="col-span-2"
                            />
                            <FInputLabel
                                label="Nova senha"
                                name="newpassword"
                                disabled={stateLoading}
                                description="A senha deve conter no mínimo 8 caracteres, incluindo Letras, Números e Simbolos (@,#,$,...)"
                                className="col-span-2"
                            />
                            <div
                                className={cn(
                                    "flex",
                                    "w-full",
                                    "items-center",
                                    "justify-end",
                                    "gap-2",
                                    "mt-4",
                                    "col-span-2"
                                )}
                            >
                                <Button
                                    type="button"
                                    onClick={() => setUser(null)}
                                    variant="outline"
                                    disabled={stateLoading}
                                >
                                    {t("cancel")}
                                </Button>
                                <FButtonSubmit
                                    label={t("save")}
                                    disabled={stateLoading}
                                />
                            </div>
                        </BaseForm>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export { Layout };
