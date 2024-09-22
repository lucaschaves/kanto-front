import { getApi } from "@/services";
import { capitalize, resolveKeyObj } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    InputProps,
    SingleSelect,
} from "../..";

interface IData {
    id: string;
    name: string;
}

interface IFSelectLabelSingleApiProps extends InputProps {
    label: string;
    name: string;
    url: string;
    keyValue?: string;
    description?: string;
    rules?: RegisterOptions;
    dependencies?: string[];
    onEffect?: (value: any) => void;
}

const LIMIT = 50;

const FSelectLabelSingleApi = (props: IFSelectLabelSingleApiProps) => {
    const {
        label,
        name,
        url,
        description,
        rules,
        className,
        keyValue,
        dependencies = [],
        onEffect = () => ({}),
        ...rest
    } = props;

    const { control, watch } = useFormContext();

    const [stateOpen, setOpen] = useState(false);
    const [, setLoading] = useState(false);
    const [stateData, setData] = useState<{ total: number; rows: IData[] }>({
        total: 0,
        rows: [],
    });
    const [statePage, setPage] = useState(0);

    const getItems = useCallback(
        async ({
            more,
            page,
            filter,
        }: {
            more?: boolean;
            page?: number;
            filter?: any;
        }) => {
            setLoading(true);

            let params = {};
            dependencies?.forEach((key) => {
                params = {
                    ...params,
                    [key]: watch(key),
                };
            });

            const actualPage = page
                ? page
                : more
                ? statePage + LIMIT
                : statePage;
            const { success, data } = await getApi({
                url,
                config: {
                    params: {
                        ...params,
                        skip: actualPage,
                        limit: LIMIT,
                        field: filter?.field,
                        filter: filter?.filter,
                    },
                },
            });
            if (success) {
                setPage(actualPage);
                const newData = actualPage === 0 ? [] : stateData.rows;
                data?.rows?.map((d: any) => {
                    let valueName = d?.name;
                    if (keyValue) {
                        if (keyValue?.includes(".")) {
                            valueName = resolveKeyObj(keyValue, d);
                        } else {
                            valueName = d[keyValue];
                        }
                    }
                    let objData = {
                        ...d,
                        id: d.id?.toString(),
                        name: capitalize(valueName),
                    };
                    newData.push(objData);
                });
                setData({
                    rows: newData,
                    total: data?.total,
                });
            }
            setLoading(false);
        },
        [url, stateData, dependencies, watch]
    );

    const disabledDependencies = useCallback(() => {
        let objDisabled = false;
        dependencies?.forEach((key) => {
            const watchValue = watch(key);
            if (!watchValue) objDisabled = true;
        });
        return objDisabled;
    }, [watch, dependencies]);

    useEffect(() => {
        if (stateOpen) {
            getItems({ page: 0 });
        }
    }, [stateOpen]);

    return (
        <FormField
            control={control}
            name={name}
            disabled={disabledDependencies()}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <SingleSelect
                        selected={field.value}
                        options={stateData.rows}
                        {...rest}
                        {...field}
                        open={stateOpen}
                        toggle={setOpen}
                        // total={stateData.total}
                        // loading={stateLoading}
                        disabled={disabledDependencies()}
                        onChange={(e) => {
                            field.onChange(e);
                            onEffect(e);
                        }}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FSelectLabelSingleApi };
