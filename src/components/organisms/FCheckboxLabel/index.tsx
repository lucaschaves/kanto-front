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
    classNameLabel?: string;
    description?: string;
    rules?: RegisterOptions;
    row?: boolean;
    onEffect?: () => void;
}

const FCheckboxLabel = (props: IFCheckboxLabelProps) => {
    const {
        label,
        name,
        description,
        rules,
        className,
        onEffect = () => ({}),
        classNameLabel,
        row,
        ...rest
    } = props;

    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem
                    className={cn(
                        "flex",
                        "gap-2",
                        "justify-start",
                        row
                            ? cn("flex-row-reverse", "items-center")
                            : cn("flex-col", "items-start", "pt-1.5"),
                        className
                    )}
                >
                    <FormLabel
                        className={cn(row ? "pt-1.5" : "", classNameLabel)}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={(e) => {
                                field.onChange(e);
                                onEffect();
                            }}
                            {...rest}
                        />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                </FormItem>
            )}
        />
    );
};

export { FCheckboxLabel };
