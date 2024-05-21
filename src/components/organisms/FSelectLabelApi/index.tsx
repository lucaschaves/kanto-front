import { getApi } from "@/services";
import { useCallback, useEffect, useState } from "react";
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
    rules?: RegisterOptions;
}

const FSelectLabelApi = (props: IFSelectLabelApiProps) => {
    const { label, name, url, description, rules, ...rest } = props;

    const { control } = useFormContext();

    const [items, setItems] = useState<IItem[]>([]);
    const [stateOpen, setOpen] = useState(false);

    const getItems = useCallback(async () => {
        const { success, data } = await getApi({
            url,
        });
        if (success) {
            setItems(data?.map((d) => ({ id: d.id, label: d.name })));
        }
    }, [url]);

    useEffect(() => {
        if (stateOpen) {
            getItems();
        }
    }, [stateOpen]);

    return (
        <FormField
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Como conheceu?</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        open={stateOpen}
                        onOpenChange={setOpen}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue {...rest} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.label}
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
