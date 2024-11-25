import { useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    InputProps,
    MultiSelect,
} from "../..";

interface IFSelectLabelMultiProps extends InputProps {
    label: string;
    name: string;
    description?: string;
    rules?: RegisterOptions;
    dependencies?: string[];
    single?: boolean;
    items: IData[];
    onEffect?: (value: any) => void;
}

interface IData {
    id: string;
    name: string;
}

const FSelectLabelMulti = (props: IFSelectLabelMultiProps) => {
    const {
        label,
        name,
        items,
        description,
        rules,
        className,
        dependencies = [],
        onEffect = () => ({}),
        ...rest
    } = props;

    const { control, watch } = useFormContext();

    const [stateOpen, setOpen] = useState(false);

    const disabledDependencies = () => {
        let objDisabled = false;
        dependencies?.forEach((key) => {
            const watchValue = watch(key);
            if (!watchValue) objDisabled = true;
        });
        return objDisabled;
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <MultiSelect
                        selected={
                            Array.isArray(field.value)
                                ? field.value
                                : field.value
                                ? [field.value]
                                : []
                        }
                        options={items}
                        {...rest}
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            onEffect(e);
                        }}
                        open={stateOpen}
                        toggle={setOpen}
                        total={items.length}
                        disabled={disabledDependencies()}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FSelectLabelMulti };
