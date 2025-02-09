import {
    Button,
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
import { PlusIcon } from "@radix-ui/react-icons";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface IFInputLabelProps extends Omit<InputProps, "type"> {
    label: string;
    name: string;
    description?: string;
    rules?: RegisterOptions;
    type?: "currency" | "text" | "number" | "password" | "email" | "search";
    addLinkCrud?: string;
}

const FInputLabel = (props: IFInputLabelProps) => {
    const {
        label,
        name,
        description,
        rules,
        className,
        addLinkCrud,
        onBlur,
        ...rest
    } = props;

    const { control } = useFormContext();

    const navigate = useNavigate();

    if (addLinkCrud) {
        return (
            <div className={cn("w-full flex items-end gap-2", className)}>
                <FormField
                    control={control}
                    name={name}
                    rules={rules}
                    render={({ field }) => (
                        <FormItem className={cn("w-full", className)}>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                                <Input
                                    {...rest}
                                    {...field}
                                    onBlur={onBlur}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormDescription>{description}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => navigate(addLinkCrud)}
                    className="mb-2"
                >
                    <PlusIcon />
                </Button>
            </div>
        );
    }

    if (rest.type === "currency") {
        return (
            <FormField
                control={control}
                name={name}
                rules={rules}
                render={({ field }) => (
                    <FormItem className={cn("w-full", className)}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <div className="relative w-full">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <span className="font-medium">R$</span>
                                </div>
                                <Input
                                    {...rest}
                                    {...field}
                                    onBlur={onBlur}
                                    autoComplete="off"
                                    type="number"
                                    className="pl-9"
                                />
                            </div>
                        </FormControl>
                        <FormDescription>{description}</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }

    return (
        <FormField
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem className={cn("w-full", className)}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...rest}
                            {...field}
                            onBlur={onBlur}
                            autoComplete="off"
                        />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FInputLabel };
