import {
    Button,
    Calendar,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    InputProps,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components";
import { cn } from "@/lib";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface IFInputDatePickerProps extends Omit<InputProps, "type"> {
    label: string;
    name: string;
    description?: string;
    rules?: RegisterOptions;
}

export const FInputDatePicker = (props: IFInputDatePickerProps) => {
    const {
        label,
        name,
        description,
        rules,
        disabled,
        // ...rest
    } = props;

    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            rules={rules}
            disabled={disabled}
            render={({ field }) => (
                <FormItem className="flex flex-col pt-2.5">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild disabled={disabled}>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    disabled={disabled}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP", {
                                            locale: ptBR,
                                        })
                                    ) : (
                                        <span>Selecione a data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                }
                                initialFocus
                                locale={ptBR}
                            />
                        </PopoverContent>
                    </Popover>
                    {description ? (
                        <FormDescription>{description}</FormDescription>
                    ) : (
                        <></>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
