import {
    Badge,
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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface IItem {
    id: string;
    name: string;
}

interface MultiSelectProps {
    options: IItem[];
    selected: IItem[];
    onChange: React.Dispatch<React.SetStateAction<IItem[]>>;
    className?: string;
    open: boolean;
    toggle: (open: boolean) => void;
}

function MultiSelect({
    options,
    selected = [],
    onChange,
    className,
    open,
    toggle,
    ...props
}: MultiSelectProps) {
    const { t } = useTranslation();

    const handleUnselect = useCallback(
        (itemId: string) => {
            onChange(selected?.filter((i) => i?.id != itemId));
        },
        [onChange, selected]
    );

    return (
        <Popover open={open} onOpenChange={toggle} {...props}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "px-1",
                        "w-full",
                        "justify-between",
                        "min-h-9",
                        selected?.length > 2 ? "h-auto" : "h-9"
                    )}
                    onClick={() => toggle(!open)}
                >
                    <div
                        className={cn(
                            "flex",
                            "items-center",
                            "justify-start",
                            "gap-1",
                            selected?.length > 2 ? "flex-wrap" : ""
                        )}
                    >
                        {selected?.map((item) => (
                            <Badge
                                variant="secondary"
                                key={item?.id}
                                className="mr-1 mb-1"
                                onClick={() => handleUnselect(item?.id)}
                            >
                                {capitalize(item?.name)}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key == "Enter") {
                                            handleUnselect(item?.id);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(item?.id)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command className={className}>
                    <CommandInput placeholder={`${t("search")}...`} />
                    <CommandEmpty>{t("noItemFound")}.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                        {options.map((option) => (
                            <CommandItem
                                key={option.id}
                                onSelect={() => {
                                    const stateChange = selected?.find(
                                        (s) => s.id == option.id
                                    )
                                        ? selected?.filter(
                                              (item) => item?.id != option.id
                                          )
                                        : [...selected, option];
                                    onChange(stateChange);
                                    toggle(true);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected?.find((s) => s.id == option.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {option.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export { MultiSelect };
