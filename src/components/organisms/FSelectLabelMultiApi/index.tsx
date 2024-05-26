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
    MultiSelect,
} from "../../";

interface IItem {
    id: string;
    name: string;
}

interface IFSelectLabelMultiApiProps extends InputProps {
    label: string;
    name: string;
    url: string;
    description?: string;
    rules?: RegisterOptions;
}

const FSelectLabelMultiApi = (props: IFSelectLabelMultiApiProps) => {
    const { label, name, url, description, rules, className, ...rest } = props;

    const { control } = useFormContext();

    const [items, setItems] = useState<IItem[]>([]);
    const [stateOpen, setOpen] = useState(false);

    const getItems = useCallback(async () => {
        const { success, data } = await getApi({
            url,
        });
        if (success) {
            setItems(
                data?.map((d: any) => ({
                    id: d.id?.toString(),
                    name: capitalize(d.name),
                }))
            );
        }
    }, [url]);

    useEffect(() => {
        if (stateOpen) getItems();
    }, [stateOpen]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <MultiSelect
                        selected={field.value}
                        options={items}
                        {...rest}
                        {...field}
                        open={stateOpen}
                        toggle={setOpen}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FSelectLabelMultiApi };
