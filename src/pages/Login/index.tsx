import {
    BaseForm,
    Button,
    FButtonSubmit,
    FInputLabel,
    IBaseFormRef,
} from "@/components";
import { useAuth } from "@/context";
import { cn } from "@/lib";
import { messageSuccess, sleep } from "@/utils";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PageLogin = () => {
    const { signin, forgot } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const refForm = useRef<IBaseFormRef>(null);

    const [loading, setLoading] = useState(false);

    const onSubmit = useCallback(async (data: any) => {
        setLoading(true);
        await sleep(1000);
        signin(
            data,
            async () => {
                setLoading(false);
                navigate("/");
            },
            async () => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div
            className={cn(
                "w-svw",
                "h-svh",
                "flex",
                "items-center",
                "justify-center",
                "md:justify-between"
            )}
        >
            <div
                className={cn(
                    "hidden",
                    "md:flex",
                    "w-full",
                    "h-full",
                    "bg-cover",
                    "bg-no-repeat",
                    "bg-center",
                    "bg-black"
                )}
                style={{
                    backgroundImage: "url('/assets/background-login.png')",
                }}
            >
                image
            </div>
            <div
                className={cn(
                    "w-full",
                    "h-full",
                    "flex",
                    "flex-col",
                    "items-center",
                    "justify-center",
                    "p-2",
                    "gap-2",
                    "max-w-xl"
                )}
            >
                <img
                    src="https://http2.mlstatic.com/storage/mshops-appearance-api/images/31/153113631/logo-2023070222281087800.webp"
                    width={180}
                    className={cn("-mt-10")}
                />
                <div
                    className={cn(
                        "flex",
                        "w-full",
                        "items-center",
                        "justify-center",
                        "gap-2",
                        "pl-4"
                    )}
                >
                    {/* <ToggleGroup
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
                    </ToggleGroup> */}
                </div>
                <BaseForm ref={refForm} onSubmit={onSubmit}>
                    <FInputLabel
                        name="email"
                        label={t("email")}
                        type="email"
                        placeholder="email@gmail.com"
                        rules={{
                            required: "É necessário preencher a email",
                        }}
                        disabled={loading}
                        className="max-w-sm"
                    />
                    <FInputLabel
                        name="password"
                        label={t("password")}
                        type="password"
                        placeholder="********"
                        rules={{
                            required: "É necessário preencher a senha",
                        }}
                        disabled={loading}
                        className="max-w-sm"
                    />
                    <FButtonSubmit
                        label={t("signIn")}
                        loading={loading}
                        className="mt-4 w-full"
                    />
                </BaseForm>

                <Button
                    variant="link"
                    onClick={() => {
                        const email = refForm.current?.getValues("email");
                        if (!email) {
                            refForm.current?.setError("email", {
                                message: "Necessário informar o email",
                            });
                            return;
                        }
                        forgot(
                            {
                                email,
                            },
                            () => {
                                messageSuccess({
                                    message: "Verifique seu email",
                                });
                            },
                            (e) => {
                                refForm.current?.setError("email", {
                                    message: e,
                                });
                            }
                        );
                    }}
                >
                    {t("forgotPassword")}
                </Button>
            </div>
        </div>
    );
};

export { PageLogin };
