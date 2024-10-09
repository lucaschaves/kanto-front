import {
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
import { CONSTANT_TOKEN } from "@/constants";
import { useAuth } from "@/context";
import { useDynamicRefs } from "@/hooks";
import { cn } from "@/lib";
import { getApi, putApi } from "@/services";
import {
    BellIcon,
    ExitIcon,
    HamburgerMenuIcon,
    PersonIcon,
    StarIcon,
} from "@radix-ui/react-icons";
import { ChevronRight, Copy } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";

export const REF_TOOLBAR = "ref_toolbar";

export interface IPropsOutletContext {
    openToolbar?: boolean;
}

interface INotification {
    id: number;
    link?: string;
    message: string;
    read: boolean;
}

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();
    const { applyRules, signout, user } = useAuth();

    const [, setRef] = useDynamicRefs();

    const refForm = useRef<IBaseFormRef>(null);

    const [stateNotifications, setNotifications] = useState<INotification[]>(
        []
    );
    const [stateUser, setUser] = useState<string | null>(null);
    const [stateLoading, setLoading] = useState(false);
    const [stateOpenSidebar, setOpenSidebar] = useState(false);
    const [stateOpenToolbar, setOpenToolbar] = useState(false);
    const [stateOpenFilters, setOpenFilter] = useState(false);

    const toggleSidebar = () => setOpenSidebar(!stateOpenSidebar);

    const toggleToolbar = () => setOpenToolbar(!stateOpenToolbar);

    const toggleFilters = (p?: boolean) => {
        if (!!p) {
            setOpenFilter(p);
        } else {
            setOpenFilter(!stateOpenFilters);
        }
    };

    const onSubmit = async (data: any) => {
        const { success } = await putApi({
            url: `user/${stateUser}`,
            body: data,
        });
        if (success) {
            setUser(null);
        }
    };

    const getDataUser = async () => {
        setLoading(true);
        const { success, data } = await getApi({
            url: `/user/${stateUser}`,
        });
        if (success) {
            refForm.current?.reset(data);
        }
        setLoading(false);
    };

    const getNotifications = async () => {
        const { success, data } = await getApi({
            url: `/notifications`,
        });
        if (success) {
            setNotifications(data.rows);
        }
    };

    useEffect(() => {
        if (!!stateUser) getDataUser();
    }, [stateUser]);

    useEffect(() => {
        applyRules();
    }, [location.pathname]);

    useEffect(() => {
        getNotifications();
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
                    "flex-1",
                    "p-2",
                    "gap-2",
                    "sm:grid",
                    "overflow-hidden",
                    stateOpenFilters
                        ? cn("sm:grid-cols-[55px_minmax(100px,_2fr)_350px]")
                        : cn("sm:grid-cols-[55px_minmax(100px,_1fr)_55px]")
                )}
            >
                <Sidebar toggle={toggleSidebar} open={stateOpenSidebar} />
                <div
                    className={cn(
                        "w-full",
                        "max-w-full",
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
                                "gap-4"
                            )}
                        >
                            <Popover>
                                <PopoverTrigger>
                                    <Button variant="ghost" size="icon">
                                        <BellIcon width={20} height={20} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex flex-col gap-2 p-2 max-w-60 mr-2">
                                    <span className="text-sm text-center w-full">
                                        Notificações
                                    </span>
                                    <Separator />
                                    {stateNotifications.map((notify) => (
                                        <Button
                                            key={notify.id}
                                            variant="ghost"
                                            className="flex items-center justify-start gap-2"
                                            onClick={() => {
                                                if (notify.link)
                                                    navigate(notify.link);
                                            }}
                                        >
                                            {notify.message}
                                            <ChevronRight
                                                width={15}
                                                height={15}
                                            />
                                        </Button>
                                    ))}
                                    <Separator />
                                    <Button
                                        variant="ghost"
                                        className="flex items-center justify-start gap-2"
                                        onClick={() =>
                                            navigate("/notifications")
                                        }
                                    >
                                        <BellIcon />
                                        Ver todos
                                    </Button>
                                </PopoverContent>
                            </Popover>
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
                                    <div className={cn("flex", "items-center")}>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    window.sessionStorage.getItem(
                                                        CONSTANT_TOKEN
                                                    ) || ""
                                                );
                                                toast.info("Copiado");
                                            }}
                                            className="flex gap-2 w-full justify-start"
                                        >
                                            <Copy size={15} />
                                            <span className="text-sm font-semibold">
                                                Copiar token
                                            </span>
                                        </Button>
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
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleToolbar}
                                className={cn("flex", "sm:hidden")}
                            >
                                <HamburgerMenuIcon />
                            </Button>
                        </div>
                    </div>
                    <div
                        className={cn("w-full", "h-[calc(100%-55px)]", "flex")}
                    >
                        <Outlet
                            context={{
                                openToolbar: stateOpenFilters,
                            }}
                        />
                    </div>
                </div>

                <Toolbar
                    toggleFilters={toggleFilters}
                    openFilters={stateOpenFilters}
                    ref={setRef(REF_TOOLBAR)}
                />
            </div>

            <Sheet
                open={stateOpenToolbar}
                onOpenChange={setOpenToolbar}
                defaultOpen={false}
            >
                <SheetContent
                    side="right"
                    className={cn("bg-primary")}
                    classNameButton="text-primary-foreground"
                >
                    <SheetHeader>
                        <SheetTitle className="text-primary-foreground">
                            Toolbar
                        </SheetTitle>
                    </SheetHeader>
                    <Toolbar sheet />
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
