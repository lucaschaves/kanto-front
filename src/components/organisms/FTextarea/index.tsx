import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Textarea,
    TextareaProps,
} from "@/components";
import { cn } from "@/lib";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface IFTextareaProps extends Omit<TextareaProps, "type"> {
    label: string;
    name: string;
    description?: string;
    rules?: RegisterOptions;
}

const FTextarea = (props: IFTextareaProps) => {
    const { label, name, description, rules, className, ...rest } = props;

    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem className={cn("w-full", className)}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea {...rest} {...field} autoComplete="off" />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FTextarea };
