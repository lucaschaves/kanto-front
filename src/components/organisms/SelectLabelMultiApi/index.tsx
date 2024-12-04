import { cn } from "@/lib";
import { getApi } from "@/services";
import { capitalize } from "@/utils";
import { useEffect, useState } from "react";
import { RegisterOptions } from "react-hook-form";
import { InputProps, MultiSelect } from "../..";

interface ISelectLabelMultiApiProps extends InputProps {
    label: string;
    name: string;
    url: string;
    description?: string;
    rules?: RegisterOptions;
    dependencies?: any;
    value: any;
    fieldValue?: string;
    single?: boolean;
    onChange: (p: any) => void;
}

interface IData {
    id: string;
    name: string;
}

const LIMIT = 50;

const SelectLabelMultiApi = (props: ISelectLabelMultiApiProps) => {
    const {
        label,
        name,
        url,
        description,
        rules,
        className,
        dependencies = [],
        value,
        onChange,
        fieldValue,
        ...rest
    } = props;

    const [stateOpen, setOpen] = useState(false);
    const [stateLoading, setLoading] = useState(false);
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

        if (filter?.field) {
            params = {
                ...params,
                [`filter_${filter.field}`]: filter?.filter,
            };
        }

        const { success, data } = await getApi({
            url,
            config: {
                params: {
                    ...params,
                    skip: actualPage,
                    limit: LIMIT,
                },
            },
        });
        if (success) {
            setPage(actualPage);
            const newData = actualPage === 0 ? [] : stateData.rows;
            data?.rows?.map((d: any) => {
                if (fieldValue) {
                    newData.push({
                        id: d.id?.toString(),
                        name: capitalize(d.name),
                        [fieldValue]: d[fieldValue],
                    });
                } else {
                    newData.push({
                        id: d.id?.toString(),
                        name: capitalize(d.name),
                    });
                }
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
        <div className={cn("space-y-2 w-full", className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            <MultiSelect
                selected={value}
                onChange={(e) => {
                    onChange(e);
                }}
                options={stateData.rows}
                {...rest}
                open={stateOpen}
                toggle={setOpen}
                moreOptions={() => getItems({ more: true })}
                onRefresh={getItems}
                disabledMore={stateData.total <= statePage + LIMIT}
                total={stateData.total}
                loading={stateLoading}
            />
        </div>
    );
};

export { SelectLabelMultiApi };
