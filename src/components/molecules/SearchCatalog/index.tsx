import {
    Checkbox,
    GroupForm,
    Select,
    SelectContent,
    SelectItem,
    SelectLabelMultiApi,
    SelectTrigger,
    SelectValue,
} from "@/components";
import { cn } from "@/lib";
import { dataItemsType } from "@/pages/Catalog/createOrEdit";
import { useTranslation } from "react-i18next";

interface IPropsSearchCatalog {
    value: any;
    onChange: (name: string, value: any) => void;
}

export const SearchCatalog = (props: IPropsSearchCatalog) => {
    const { value, onChange } = props;

    const { t } = useTranslation();

    const onEffectFactory = (value: any) => {
        if (value[0]) {
            value[0]?.tagsDefault
                ?.split(",")
                .filter((key: string) => !!key)
                .forEach((key: string) => {
                    onChange(key, true);
                });
        }
    };

    return (
        <GroupForm
            title={t("Filtros")}
            className={cn(
                "w-full",
                "grid",
                "grid-cols-2",
                "sm:grid-cols-2",
                "gap-1",
                "sm:gap-2",
                "px-3",
                value?.type === "game" ? "md:grid-cols-5" : "md:grid-cols-3"
            )}
        >
            <div className="space-y-2 w-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tipo
                </label>
                <Select
                    onValueChange={(e) => onChange("type", e)}
                    defaultValue={value?.type}
                    value={value?.type}
                    dir="ltr"
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {dataItemsType.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <SelectLabelMultiApi
                label={t("region")}
                onChange={(e) => onChange("region", e)}
                defaultValue={value?.region}
                value={value?.region}
                disabled={!value?.type}
                name="region"
                url="/regions"
                className={cn(value?.type === "game" ? "col-span-2" : "")}
                dependencies={[
                    {
                        type: value.type,
                    },
                ]}
            />
            <SelectLabelMultiApi
                label={t("plataform")}
                onChange={(e) => onChange("plataform", e)}
                defaultValue={value?.plataform}
                value={value?.plataform}
                disabled={!value?.type}
                name="plataform"
                url="/plataforms"
                className={cn(value?.type === "game" ? "col-span-2" : "")}
                dependencies={{
                    type: value?.type,
                }}
            />

            {value?.type === "console" ? (
                <>
                    {[
                        "consoleComplete",
                        "consolePackaging",
                        "consoleSealed",
                        "consoleTypeUnlocked",
                        "consoleUnlocked",
                        "consoleWorking",
                    ].map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                            <Checkbox
                                id={d}
                                checked={value?.[d]}
                                onCheckedChange={(e) => onChange(d, e)}
                            />
                            <label
                                htmlFor={d}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {t(d)}
                            </label>
                        </div>
                    ))}
                </>
            ) : value?.type === "game" ? (
                <>
                    {[
                        "gameManual",
                        "gamePackaging",
                        "gamePackagingRental",
                        "gameSealed",
                        "gameWorking",
                    ].map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                            <Checkbox
                                id={d}
                                checked={value?.[d]}
                                onCheckedChange={(e) => onChange(d, e)}
                            />
                            <label
                                htmlFor={d}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {t(d)}
                            </label>
                        </div>
                    ))}
                    <div className="flex flex-col justify-start items-start space-y-2.5 pt-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t("conservation")}
                        </label>
                        <Select
                            onValueChange={(e) =>
                                onChange("gameConversation", e)
                            }
                            defaultValue={value?.type}
                            value={value?.type}
                            dir="ltr"
                            disabled={!value?.type}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    {
                                        id: "1",
                                        name: "1",
                                    },
                                    {
                                        id: "2",
                                        name: "2",
                                    },
                                    {
                                        id: "3",
                                        name: "3",
                                    },
                                ].map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </>
            ) : (
                <></>
            )}
            {value?.type ? (
                <SelectLabelMultiApi
                    label="Factory (obrigatório)"
                    onChange={(e) => {
                        onChange("factory", e);
                        onEffectFactory(e);
                    }}
                    defaultValue={value?.factory}
                    value={value?.factory}
                    disabled={!value?.type}
                    name="factory"
                    url="/catalogs/factory"
                    fieldValue="tagsDefault"
                    className={cn(
                        value?.type === "game" ? "col-span-4" : "col-span-3"
                    )}
                    dependencies={{
                        type: value?.type,
                        plataform: value?.plataform
                            ?.map((d: any) => d?.id)
                            .join(","),
                    }}
                    single
                />
            ) : (
                <></>
            )}
        </GroupForm>
    );
};
