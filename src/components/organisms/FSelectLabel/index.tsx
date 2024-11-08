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
import { useTranslation } from "react-i18next";

interface IItem {
    id: string;
    name: string;
}

interface IFSelectLabelProps extends InputProps {
    label: string;
    name: string;
    items: IItem[];
    description?: string;
    rules?: RegisterOptions;
    onEffect?: (value: string) => void;
}

const FSelectLabel = (props: IFSelectLabelProps) => {
    const {
        label,
        name,
        description,
        items,
        rules,
        onEffect = () => ({}),
        ...rest
    } = props;
    const { t } = useTranslation();
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={(e) => {
                            field.onChange(e);
                            onEffect(e);
                        }}
                        defaultValue={field.value}
                        value={field.value}
                        {...rest}
                        dir="ltr"
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue {...rest} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                    {t(item.name)}
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
