/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    CONSTANT_LANGUAGE,
    CONSTANT_ROLES,
    CONSTANT_TOKEN,
    CONSTANT_USER,
} from "@/constants";
import { getApi, postApi } from "@/services";
import { removeProperties } from "@/utils";
import { createContext, useCallback, useContext, useState } from "react";

interface IUser {
    login: string;
    password?: string;
}

interface IUserAuth {
    token: string;
    user: string;
    email?: string;
    name?: string;
}

interface IUserForgot {
    email: string;
}

interface IUserReset {
    password: string;
    hash: string;
    login: string;
    dialect: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: IUserAuth | null;
    rules: string[];
    signin: (props: IUser, callback: VoidFunction, error: VoidFunction) => void;
    forgot: (
        props: IUserForgot,
        callback: () => void,
        error: (err: any) => void
    ) => void;
    reset: (
        props: IUserReset,
        callback: VoidFunction,
        error: VoidFunction
    ) => void;
    signout: (callback: VoidFunction) => void;
    applyRules: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [rules, setRules] = useState<string[]>(() => {
        const rulesS = window.sessionStorage.getItem(CONSTANT_ROLES);
        if (rulesS) {
            return JSON.parse(rulesS);
        }
        return [];
    });
    const [user, setUser] = useState<IUserAuth | null>(() => {
        const auth = window.sessionStorage.getItem(CONSTANT_TOKEN);
        if (auth) {
            const userAuth =
                window.sessionStorage.getItem(CONSTANT_USER) || "{}";
            return {
                token: auth,
                ...JSON.parse(userAuth),
            };
        }
        return null;
    });

    const signPersist = async (data: any) => {
        const objUser = {
            ...data,
        };
        setUser(objUser);
        window.sessionStorage.setItem(CONSTANT_TOKEN, data.token);
        window.sessionStorage.setItem(
            CONSTANT_USER,
            JSON.stringify(removeProperties(objUser, "token"))
        );
        window.sessionStorage.setItem(CONSTANT_LANGUAGE, "pt");
        const { success, data: dataRules } = await getApi({
            url: `/permissiongroup/${objUser?.permissionsId}`,
        });
        if (success) {
            window.sessionStorage.setItem(
                CONSTANT_ROLES,
                JSON.stringify(dataRules)
            );
            setRules(dataRules);
        }
        return;
    };

    const signin = useCallback(
        async (props: IUser, callback: VoidFunction, error: VoidFunction) => {
            const { success, data } = await postApi({
                url: "/auth/login",
                body: {
                    dialeto: "pt-BR",
                    ...props,
                },
            });

            if (success) {
                await signPersist(data);
                callback();
            } else {
                error();
            }
        },
        []
    );

    const forgot = useCallback(
        async (
            props: IUserForgot,
            callback: () => void,
            error: (err: any) => void
        ) => {
            const { success, error: err } = await postApi<any>({
                url: "/auth/forgot",
                body: props,
            });
            if (success) {
                callback();
            } else {
                error(err);
            }
        },
        []
    );

    const reset = useCallback(
        async (
            props: IUserReset,
            callback: VoidFunction,
            error: VoidFunction
        ) => {
            const { success, data } = await postApi<any>({
                url: "/auth/reset",
                body: props,
            });
            if (success) {
                const responseUser = await getApi<any>({
                    url: "/safe/instance",
                    config: {
                        headers: {
                            Authorization: data.token,
                        },
                    },
                });
                const objUser = {
                    ...data,
                    name: responseUser?.data?.user?.name,
                    email: responseUser?.data?.user?.email,
                };
                setUser(objUser);
                window.sessionStorage.setItem(CONSTANT_TOKEN, data.token);
                window.sessionStorage.setItem(
                    CONSTANT_USER,
                    JSON.stringify(removeProperties(objUser, "token"))
                );
                window.sessionStorage.setItem(CONSTANT_LANGUAGE, "pt");
                callback();
            } else {
                error();
            }
        },
        []
    );

    const signout = useCallback((callback: VoidFunction) => {
        setUser(null);
        window.sessionStorage.clear();
        callback();
    }, []);

    const applyRules = useCallback(() => {
        const rulesElements = document.querySelectorAll(
            '[data-rule-component="rule"]'
        );
        rulesElements.forEach((element) => {
            const datasetElement = (element as any)?.dataset;
            if (!rules.includes(datasetElement?.ruleComponentId)) {
                element.classList.add("hidden");
            }
        });
    }, [rules]);

    const value = {
        user,
        rules,
        forgot,
        signin,
        signout,
        reset,
        signPersist,
        applyRules,
        isAuthenticated: !!user?.token,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };
