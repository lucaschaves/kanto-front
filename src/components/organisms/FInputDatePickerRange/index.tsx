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

interface IFInputDatePickerRangeProps extends Omit<InputProps, "type"> {
    label: string;
    name: string;
    description?: string;
    rules?: RegisterOptions;
}

export const FInputDatePickerRange = (props: IFInputDatePickerRangeProps) => {
    const {
        label,
        name,
        description,
        rules,
        // ...rest
    } = props;

    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value?.from ? (
                                        field.value.to ? (
                                            <>
                                                {format(
                                                    field.value.from,
                                                    "dd LLL, y",
                                                    {
                                                        locale: ptBR,
                                                    }
                                                )}{" "}
                                                -{" "}
                                                {format(
                                                    field.value.to,
                                                    "dd LLL, y",
                                                    {
                                                        locale: ptBR,
                                                    }
                                                )}
                                            </>
                                        ) : (
                                            format(
                                                field.value.from,
                                                "dd LLL, y"
                                            )
                                        )
                                    ) : (
                                        <span>Selecione a data</span>
                                    )}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={field.value?.from}
                                selected={field.value}
                                onSelect={field.onChange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
