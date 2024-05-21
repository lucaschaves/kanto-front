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
} from "@/components";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface IItem {
    id: string;
    label: string;
}

interface IFSelectLabelProps extends InputProps {
    label: string;
    name: string;
    items: IItem[];
    description?: string;
    rules?: RegisterOptions;
}

const FSelectLabel = (props: IFSelectLabelProps) => {
    const { label, name, description, items, rules, ...rest } = props;

    const { control } = useFormContext();

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

export { FSelectLabel };
