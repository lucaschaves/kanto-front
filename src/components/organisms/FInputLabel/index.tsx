import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    InputProps,
} from "@/components";
import { cn } from "@/lib";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface IFInputLabelProps extends InputProps {
    label: string;
    name: string;
    description?: string;
    rules?: RegisterOptions;
}

const FInputLabel = (props: IFInputLabelProps) => {
    const { label, name, description, rules, className, ...rest } = props;

    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem className={cn("w-full", "max-w-sm", className)}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input {...rest} {...field} />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FInputLabel };
