import {
    Badge,
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Skeleton,
} from "@/components";
import { cn } from "@/lib";
import { capitalize } from "@/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

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
    disabled?: boolean;
    loading?: boolean;
    disabledMore?: boolean;
    single?: boolean;
    total?: number;
    moreOptions?: () => void;
    onRefresh?: (props: any) => void;
    toggle: (open: boolean) => void;
}

function MultiSelect({
    options,
    selected = [],
    onChange,
    className,
    open,
    toggle,
    disabled,
    loading,
    moreOptions = () => ({}),
    onRefresh = () => ({}),
    disabledMore = true,
    total,
    single,
    ...props
}: MultiSelectProps) {
    const { t } = useTranslation();

    const [stateFilter, setFilter] = useState("");

    const handleUnselect = (itemId: string) => {
        onChange(selected?.filter((i) => i?.id != itemId));
    };

    const handleFilter = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.keyCode) {
            case 13:
                e.preventDefault();
                e.stopPropagation();
                onRefresh({
                    page: 0,
                    filter: { field: "name", filter: stateFilter },
                });
                break;
            default:
                break;
        }
    };

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
                    disabled={disabled}
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
                        {selected
                            ?.filter((_, i) => i < 6)
                            .map((item) => (
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
                        {selected?.length > 6 ? "..." : ""}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <div className={cn("flex", "w-full", "p-0.5")}>
                    <Input
                        placeholder={`Filtrar...`}
                        value={stateFilter}
                        onChange={(e) => setFilter(e.target.value)}
                        onKeyDown={handleFilter}
                        autoComplete="off"
                    />
                </div>

                <Command className={className}>
                    <CommandEmpty>{t("noItemFound")}.</CommandEmpty>
                    <CommandGroup className="overflow-y-auto max-h-64">
                        {loading && options.length === 0 ? (
                            <>
                                <CommandItem>
                                    <Skeleton className="h-4 w-full" />
                                </CommandItem>
                                <CommandItem>
                                    <Skeleton className="h-4 w-full" />
                                </CommandItem>
                                <CommandItem>
                                    <Skeleton className="h-4 w-full" />
                                </CommandItem>
                            </>
                        ) : options.length > 0 ? (
                            <>
                                {options.map((option) => (
                                    <CommandItem
                                        key={`multi-${uuidv4()}-${option.id}`}
                                        onSelect={() => {
                                            if (single) {
                                                onChange([option]);
                                            } else {
                                                const stateChange =
                                                    selected?.find(
                                                        (s) => s.id == option.id
                                                    )
                                                        ? selected?.filter(
                                                              (item) =>
                                                                  item?.id !=
                                                                  option.id
                                                          )
                                                        : [...selected, option];
                                                onChange(stateChange);
                                            }
                                            toggle(true);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected?.find(
                                                    (s) => s.id == option.id
                                                )
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {option.name}
                                    </CommandItem>
                                ))}
                                {disabledMore ? (
                                    <></>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={moreOptions}
                                        variant="secondary"
                                        className={cn(
                                            "w-full",
                                            loading ? "animate-pulse" : ""
                                        )}
                                    >
                                        {loading ? "buscando..." : "mais..."}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <CommandItem>{t("noItemFound")}</CommandItem>
                        )}
                    </CommandGroup>
                </Command>
                <div
                    className={cn(
                        "flex",
                        "w-full",
                        "px-1",
                        "py-2",
                        "items-center",
                        "justify-between"
                    )}
                >
                    <span className={cn("text-xs")}>
                        {t("selected")} {selected?.length}
                    </span>
                    <span className={cn("text-xs")}>Total {total}</span>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export { MultiSelect };
