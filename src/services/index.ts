/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { messageError } from "@/utils";
import axios, { AxiosRequestConfig } from "axios";
import api from "./client";

interface IGetProps {
    url: string;
    config?: AxiosRequestConfig;
}

interface IDeleteProps {
    url: string;
    config?: AxiosRequestConfig;
}

interface IPostProps {
    url: string;
    body?: object;
    config?: AxiosRequestConfig;
}

interface IPutProps {
    url: string;
    body?: object;
    config?: AxiosRequestConfig;
}

interface IResponse {
    success: boolean;
    data: any;
    error?: string;
    elapsed: string;
}

const headersDefault = {
    headers: {
        Accept: "application/json",
    },
};

export const getApi = async <T>(props: IGetProps): Promise<IResponse> => {
    const { url, config = {} } = props;
    try {
        const response = await api.get<IResponse>(url, {
            ...headersDefault,
            ...config,
        });

        const {
            data: { data, success, elapsed },
        } = response;

        return {
            data: data as T,
            success,
            elapsed,
        };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const messageErr = messageError({
                message: err.response?.data?.error,
                status: err.response?.status,
                elapsed: err.response?.data?.elapsed,
            });
            return {
                success: false,
                error: messageErr.message,
                data: null,
                elapsed: messageErr.elapsed,
            };
        }
        const message = JSON.stringify(err);
        const messageErr = messageError({ message });
        return {
            success: false,
            error: messageErr.message,
            data: null,
            elapsed: messageErr.elapsed,
        };
    }
};

export const postApi = async <T>(props: IPostProps): Promise<IResponse> => {
    const { url, body = {}, config = {} } = props;

    try {
        const response: any = await api.post<IResponse>(url, body, {
            ...headersDefault,
            ...config,
        });

        const {
            data: { data, success, elapsed },
        } = response;

        return {
            data: data as T,
            success,
            elapsed,
        };
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            const messageErr = messageError({
                message: err.response?.data?.error,
                status: err.response?.status,
                elapsed: err.response?.data?.elapsed,
                data: err.response?.data,
            });
            return {
                success: false,
                error: messageErr.message,
                data: null,
                elapsed: messageErr.elapsed,
            };
        }

        const message = JSON.stringify(err);
        const messageErr = messageError({ message });
        return {
            success: false,
            error: messageErr.message,
            data: null,
            elapsed: messageErr.elapsed,
        };
    }
};

export const putApi = async <T>(props: IPutProps): Promise<IResponse> => {
    const { url, body = {}, config = {} } = props;

    try {
        const response: any = await api.put<IResponse>(url, body, {
            ...headersDefault,
            ...config,
        });

        const {
            data: { data, success, elapsed },
        } = response;

        return {
            data: data as T,
            success,
            elapsed,
        };
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            const messageErr = messageError({
                message: err.response?.data?.error,
                status: err.response?.status,
                elapsed: err.response?.data?.elapsed,
                data: err.response?.data,
            });
            return {
                success: false,
                error: messageErr.message,
                data: null,
                elapsed: messageErr.elapsed,
            };
        }

        const message = JSON.stringify(err);
        const messageErr = messageError({ message });
        return {
            success: false,
            error: messageErr.message,
            data: null,
            elapsed: messageErr.elapsed,
        };
    }
};

export const deleteApi = async <T>(props: IDeleteProps): Promise<IResponse> => {
    const { url, config = {} } = props;
    try {
        const response = await api.delete<IResponse>(url, {
            ...headersDefault,
            ...config,
        });

        const {
            data: { data, success, elapsed },
        } = response;

        return {
            data: data as T,
            success,
            elapsed,
        };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const messageErr = messageError({
                message: err.response?.data?.error,
                status: err.response?.status,
                elapsed: err.response?.data?.elapsed,
            });
            return {
                success: false,
                error: messageErr.message,
                data: null,
                elapsed: messageErr.elapsed,
            };
        }
        const message = JSON.stringify(err);
        const messageErr = messageError({ message });
        return {
            success: false,
            error: messageErr.message,
            data: null,
            elapsed: messageErr.elapsed,
        };
    }
};
