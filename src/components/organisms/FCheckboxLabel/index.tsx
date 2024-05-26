import {
    Checkbox,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components";
import { cn } from "@/lib";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface IFCheckboxLabelProps {
    label: string;
    name: string;
    className?: string;
    description?: string;
    rules?: RegisterOptions;
}

const FCheckboxLabel = (props: IFCheckboxLabelProps) => {
    const { label, name, description, rules, className, ...rest } = props;

    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem
                    className={cn(
                        "flex flex-row items-start space-x-3 space-y-0 p-4",
                        className
                    )}
                >
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...rest}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>{label}</FormLabel>
                        <FormDescription>{description}</FormDescription>
                    </div>
                </FormItem>
            )}
        />
    );
};

export { FCheckboxLabel };
