import { cn } from "@/lib";
import { getApi } from "@/services";
import { capitalize, sleep } from "@/utils";
import { useEffect, useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    InputProps,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../";

interface IItem {
    id: string;
    name: string;
}

interface IFSelectLabelApiProps extends InputProps {
    label: string;
    name: string;
    url: string;
    description?: string;
    forceRows?: boolean;
    rules?: RegisterOptions;
    dependencies?: string[];
}

const FSelectLabelApi = (props: IFSelectLabelApiProps) => {
    const {
        label,
        name,
        url,
        description,
        rules,
        className,
        dependencies,
        forceRows,
        ...rest
    } = props;

    const { control, watch } = useFormContext();

    const [items, setItems] = useState<IItem[]>([]);
    const [stateOpen, setOpen] = useState(false);
    const [stateLoading, setLoading] = useState(false);

    const getItems = async (delay?: number) => {
        setLoading(true);
        await sleep(delay || 0);
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
        setLoading(false);
    };

    const disabledDependencies = () => {
        let objDisabled = false;
        dependencies?.forEach((key) => {
            const watchValue = watch(key);
            if (!watchValue) objDisabled = true;
        });
        return objDisabled;
    };

    useEffect(() => {
        if (stateOpen) getItems();
    }, [stateOpen]);

    useEffect(() => {
        if (forceRows) getItems(500);
    }, []);

    return (
        <FormField
            control={control}
            name={name}
            rules={rules}
            disabled={disabledDependencies()}
            render={({ field }) => (
                <FormItem className={cn("w-full", className)}>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={(e) => {
                            if (!stateLoading) {
                                field.onChange(e);
                            }
                        }}
                        defaultValue={field.value}
                        open={stateOpen}
                        onOpenChange={setOpen}
                        disabled={disabledDependencies()}
                        value={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue {...rest} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FSelectLabelApi };
