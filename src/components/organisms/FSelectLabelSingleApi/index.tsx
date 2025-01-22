import { cn } from "@/lib";
import { getApi } from "@/services";
import { capitalize, resolveKeyObj } from "@/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Button,
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
    keyValue?: string | string[];
    description?: string;
    rules?: RegisterOptions;
    defControl?: any;
    dependencies?: string[];
    dependenciesValue?: any;
    addLinkCrud?: string;
    onEffect?: (value: any) => void;
    navigateItem?: string;
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
        dependenciesValue,
        onEffect = () => ({}),
        addLinkCrud,
        disabled,
        defControl,
        navigateItem,
        ...rest
    } = props;

    const { control, watch } = useFormContext();
    const navigate = useNavigate();

    const [stateOpen, setOpen] = useState(false);
    const [, setLoading] = useState(false);
    const [stateData, setData] = useState<{ total: number; rows: IData[] }>({
        total: 0,
        rows: [],
    });
    const [statePage, setPage] = useState(0);

    const getItems = async ({
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
            if (key.includes(".")) {
                params = {
                    ...params,
                    [key.split(".")[0]]: watch(key),
                };
            } else {
                params = {
                    ...params,
                    [key]: watch(key),
                };
            }
        });

        dependenciesValue &&
            Object.keys(dependenciesValue)?.forEach((key) => {
                params = {
                    ...params,
                    [key]: dependenciesValue[key],
                };
            });

        const actualPage = page ? page : more ? statePage + LIMIT : statePage;
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
                let valueName = "";
                if (typeof keyValue === "string") {
                    valueName = d?.name;
                    if (keyValue) {
                        if (keyValue?.includes(".")) {
                            valueName = resolveKeyObj(keyValue, d);
                        } else {
                            valueName = d[keyValue];
                        }
                    }
                } else if (keyValue) {
                    keyValue?.forEach((key, i) => {
                        if (key?.includes(".")) {
                            valueName +=
                                i === 0
                                    ? resolveKeyObj(key, d)
                                    : ` - ${resolveKeyObj(key, d)}`;
                        } else {
                            valueName += i === 0 ? d[key] : ` - ${d[key]}`;
                        }
                    });
                } else {
                    valueName = d?.name;
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
    };

    const disabledDependencies = () => {
        // let objDisabled = false;
        // dependencies?.forEach((key) => {
        //     const watchValue = watch(key);
        //     if (!watchValue) objDisabled = true;
        // });
        // return objDisabled;
        return false;
    };

    useEffect(() => {
        if (stateOpen) {
            getItems({ page: 0 });
        }
    }, [stateOpen]);

    if (addLinkCrud) {
        return (
            <div className={cn("w-full flex items-end gap-2 pb-2", className)}>
                <FormField
                    control={control}
                    name={name}
                    disabled={disabled || disabledDependencies()}
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[calc(100%-40px)]">
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
                                disabled={disabled || disabledDependencies()}
                                onChange={(e) => {
                                    field.onChange(e);
                                    onEffect(e);
                                }}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => navigate(addLinkCrud)}
                    disabled={disabled}
                    className="min-w-9"
                >
                    <PlusIcon />
                </Button>
            </div>
        );
    }
    return (
        <FormField
            control={defControl || control}
            name={name}
            disabled={disabled || disabledDependencies()}
            render={({ field }) => (
                <FormItem className={className}>
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
                        disabled={disabled || disabledDependencies()}
                        onChange={(e) => {
                            field.onChange(e);
                            onEffect(e);
                        }}
                        navigateItem={navigateItem}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FSelectLabelSingleApi };
