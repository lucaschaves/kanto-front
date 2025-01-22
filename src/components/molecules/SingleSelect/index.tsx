import {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components";
import { cn } from "@/lib";
import { capitalize } from "@/utils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface IItem {
    id: string;
    name: string;
}

interface SingleSelectProps {
    options: IItem[];
    selected: IItem;
    onChange: React.Dispatch<React.SetStateAction<IItem>>;
    className?: string;
    open: boolean;
    toggle: (open: boolean) => void;
    disabled?: boolean;
    navigateItem?: string;
}

function SingleSelect({
    options,
    selected,
    onChange,
    className,
    open,
    toggle,
    disabled,
    navigateItem,
    ...props
}: SingleSelectProps) {
    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <Popover open={open} onOpenChange={toggle} {...props}>
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "px-1",
                        "w-full",
                        "justify-between",
                        "min-h-9",
                        "h-9",
                        "truncate"
                    )}
                    onClick={() => toggle(!open)}
                >
                    <div
                        className={cn(
                            "flex",
                            "items-center",
                            "justify-start",
                            "gap-1",
                            "px-2",
                            "font-normal",
                            "truncate"
                        )}
                    >
                        {capitalize(selected?.name)}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 min-w-[200px]">
                <Command className={className}>
                    <CommandInput placeholder={`${t("search")}...`} />
                    <CommandEmpty>{t("noItemFound")}.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                        {options.map((option) => (
                            <div className={cn("flex", "items-center")}>
                                <CommandItem
                                    key={option.id}
                                    onSelect={() => {
                                        onChange(option);
                                        toggle(true);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected?.id == option.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {option.name}
                                </CommandItem>
                                {navigateItem ? (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            navigate(
                                                `${navigateItem}${option.id}`
                                            );
                                        }}
                                        size="icon"
                                        variant="link"
                                    >
                                        <Pencil1Icon />
                                    </Button>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export { SingleSelect };
