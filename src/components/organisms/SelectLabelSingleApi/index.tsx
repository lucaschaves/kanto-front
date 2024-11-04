import { getApi } from "@/services";
import { capitalize, resolveKeyObj } from "@/utils";
import { useEffect, useState } from "react";
import { RegisterOptions } from "react-hook-form";
import { InputProps, SingleSelect } from "../..";

interface IData {
    id: string;
    name: string;
}

interface ISelectLabelSingleApiProps extends InputProps {
    label: string;
    name: string;
    url: string;
    keyValue?: string | string[];
    description?: string;
    rules?: RegisterOptions;
    dependencies?: any;
    addLinkCrud?: string;
    onEffect?: (value: any) => void;
    value: any;
    onChange: (p: any) => void;
}

const LIMIT = 50;

const SelectLabelSingleApi = (props: ISelectLabelSingleApiProps) => {
    const {
        label,
        name,
        url,
        description,
        rules,
        className,
        keyValue,
        dependencies,
        onEffect = () => ({}),
        addLinkCrud,
        disabled,
        value,
        onChange,
        ...rest
    } = props;

    const [stateOpen, setOpen] = useState(false);
    const [, setLoading] = useState(false);
    const [stateData, setData] = useState<{ total: number; rows: IData[] }>({
        total: 0,
        rows: [],
    });
    const [statePage, setPage] = useState(0);

    const getItems = async ({
        more,
        page,
        filter,
    }: {
        more?: boolean;
        page?: number;
        filter?: any;
    }) => {
        setLoading(true);
        let params = {};
        Object.keys(dependencies)?.forEach((key) => {
            params = {
                ...params,
                [key]: dependencies[key],
            };
        });

        const actualPage = page ? page : more ? statePage + LIMIT : statePage;
        const { success, data } = await getApi({
            url,
            config: {
                params: {
                    ...params,
                    skip: actualPage,
                    limit: LIMIT,
                    field: filter?.field,
                    filter: filter?.filter,
                },
            },
        });
        if (success) {
            setPage(actualPage);
            const newData = actualPage === 0 ? [] : stateData.rows;
            data?.rows?.map((d: any) => {
                let valueName = "";
                if (typeof keyValue === "string") {
                    valueName = d?.name;
                    if (keyValue) {
                        if (keyValue?.includes(".")) {
                            valueName = resolveKeyObj(keyValue, d);
                        } else {
                            valueName = d[keyValue];
                        }
                    }
                } else if (keyValue) {
                    keyValue?.forEach((key, i) => {
                        if (key?.includes(".")) {
                            valueName +=
                                i === 0
                                    ? resolveKeyObj(key, d)
                                    : ` - ${resolveKeyObj(key, d)}`;
                        } else {
                            valueName += i === 0 ? d[key] : ` - ${d[key]}`;
                        }
                    });
                } else {
                    valueName = d?.name;
                }
                let objData = {
                    ...d,
                    id: d.id?.toString(),
                    name: capitalize(valueName),
                };
                newData.push(objData);
            });
            setData({
                rows: newData,
                total: data?.total,
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        if (stateOpen) {
            getItems({ page: 0 });
        }
    }, [stateOpen]);

    return (
        <div className="space-y-2 w-full">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            <SingleSelect
                selected={value}
                options={stateData.rows}
                {...rest}
                open={stateOpen}
                toggle={setOpen}
                disabled={disabled}
                onChange={(e) => {
                    onChange(e);
                    onEffect(e);
                }}
            />
        </div>
    );
};

export { SelectLabelSingleApi };
