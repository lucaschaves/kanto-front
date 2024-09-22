import { createSearchParams } from "react-router-dom";

export const encodeSearchParams = (params: any): string => {
    let searchs = {};
    Object.keys(params ?? {}).forEach((key) => {
        if (params[key]) {
            searchs = {
                ...searchs,
                [key]: params[key],
            };
        }
    });
    const encondeParams = createSearchParams(searchs);
    return encondeParams?.toString();
};

export const decodeSearchParams = (searchParams: any): object => {
    return searchParams
        ?.slice(1)
        .split("&")
        .map((p: any) => p.split("="))
        .reduce((acc: any, [key, val]: any) => {
            try {
                return {
                    ...acc,
                    [key]: JSON.parse(val),
                };
            } catch {
                return {
                    ...acc,
                    [key]: val,
                };
            }
        }, {});
};
