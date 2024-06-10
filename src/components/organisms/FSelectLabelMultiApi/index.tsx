import { getApi } from "@/services";
import { capitalize } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    InputProps,
    MultiSelect,
} from "../../";

interface IFSelectLabelMultiApiProps extends InputProps {
    label: string;
    name: string;
    url: string;
    description?: string;
    rules?: RegisterOptions;
}

interface IData {
    id: string;
    name: string;
}

const LIMIT = 50;

const FSelectLabelMultiApi = (props: IFSelectLabelMultiApiProps) => {
    const { label, name, url, description, rules, className, ...rest } = props;

    const { control } = useFormContext();

    const [stateOpen, setOpen] = useState(false);
    const [stateLoading, setLoading] = useState(false);
    const [stateData, setData] = useState<{ total: number; rows: IData[] }>({
        total: 0,
        rows: [],
    });
    const [statePage, setPage] = useState(0);

    const getItems = useCallback(
        async ({
            more,
            page,
            filter,
        }: {
            more?: boolean;
            page?: number;
            filter?: any;
        }) => {
            setLoading(true);
            const actualPage = page
                ? page
                : more
                ? statePage + LIMIT
                : statePage;
            const { success, data } = await getApi({
                url,
                config: {
                    params: {
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
                    newData.push({
                        id: d.id?.toString(),
                        name: capitalize(d.name),
                    });
                });
                setData({
                    rows: newData,
                    total: data?.total,
                });
            }
            setLoading(false);
        },
        [url, stateData]
    );

    useEffect(() => {
        if (stateOpen) {
            getItems({ page: 0 });
        }
    }, [stateOpen]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <MultiSelect
                        selected={field.value}
                        options={stateData.rows}
                        {...rest}
                        {...field}
                        open={stateOpen}
                        toggle={setOpen}
                        moreOptions={() => getItems({ more: true })}
                        onRefresh={getItems}
                        disabledMore={stateData.total <= statePage + LIMIT}
                        total={stateData.total}
                        loading={stateLoading}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { FSelectLabelMultiApi };
