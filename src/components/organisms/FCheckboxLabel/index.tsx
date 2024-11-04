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
                        "flex flex-col items-start justify-start pt-1.5 gap-2",
                        className
                    )}
                >
                    <FormLabel className={classNameLabel}>{label}</FormLabel>
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
