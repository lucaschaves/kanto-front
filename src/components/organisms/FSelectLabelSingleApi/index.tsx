import { getApi } from "@/services";
import { capitalize } from "@/utils";
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

interface IItem {
    id: string;
    name: string;
}

interface IFSelectLabelSingleApiProps extends InputProps {
    label: string;
    name: string;
    url: string;
    description?: string;
    rules?: RegisterOptions;
    dependencies?: string[];
}

const FSelectLabelSingleApi = (props: IFSelectLabelSingleApiProps) => {
    const {
        label,
        name,
        url,
        description,
        rules,
        className,
        dependencies = [],
        ...rest
    } = props;

    const { control, watch } = useFormContext();

    const [items, setItems] = useState<IItem[]>([]);
    const [stateOpen, setOpen] = useState(false);

    const getItems = useCallback(async () => {
        let params = {};
        dependencies?.forEach((key) => {
            params = {
                ...params,
                [key]: watch(key),
            };
        });
        const { success, data } = await getApi({
            url,
            config: {
                params,
            },
        });
        if (success) {
            setItems(
                data?.map((d: any) => ({
                    id: d.id?.toString(),
                    name: capitalize(d.name),
                }))
            );
        }
    }, [url, dependencies, watch]);

    const disabledDependencies = useCallback(() => {
        let objDisabled = false;
        dependencies?.forEach((key) => {
            const watchValue = watch(key);
            if (!watchValue) objDisabled = true;
        });
        return objDisabled;
    }, [watch, dependencies]);

    useEffect(() => {
        if (stateOpen) getItems();
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
                        options={items}
                        {...rest}
                        {...field}
                        open={stateOpen}
                        toggle={setOpen}
                        disabled={disabledDependencies()}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FSelectLabelSingleApi };
