import { cn } from "@/lib";
import React, {
    ReactNode,
    Ref,
    forwardRef,
    useCallback,
    useImperativeHandle,
} from "react";
import {
    FieldErrors,
    FieldValues,
    FormProvider,
    Resolver,
    UseFormReturn,
    useForm,
} from "react-hook-form";

interface IBaseFormProps {
    children: ReactNode;
    id?: string;
    defaultValues?: FieldValues;
    resolver?: Resolver<FieldValues, any>;
    onSubmit(e: FieldValues, p: any): void;
    onError?(e: FieldValues): void;
}

interface IBaseFormRef extends UseFormReturn<any, any> {}

const BaseForm = forwardRef((props: IBaseFormProps, ref: Ref<IBaseFormRef>) => {
    const {
        id,
        children,
        defaultValues,
        resolver,
        onSubmit,
        onError = () => ({}),
    } = props;

    const methods = useForm({
        defaultValues,
        resolver,
    });

    const onValid = useCallback(
        (data: FieldValues, event?: React.BaseSyntheticEvent) => {
            if (event?.preventDefault) {
                event?.preventDefault();
                event?.stopPropagation();
            }
            onSubmit(data, event);
        },
        [id, onSubmit]
    );

    const onInvalid = useCallback(
        (
            errors: FieldErrors<FieldValues>,
            event?: React.BaseSyntheticEvent
        ) => {
            if (event?.preventDefault) {
                event?.preventDefault();
            }
            if (event?.stopPropagation) {
                event?.stopPropagation();
            }
            onError && onError(errors);
        },
        [onError]
    );

    const handleSubmit = useCallback(
        async (data: any) => {
            methods.handleSubmit(onValid, onInvalid)(data);
        },
        [methods, onInvalid, onValid]
    );

    useImperativeHandle(
        ref,
        () => ({
            ...methods,
        }),
        [methods]
    );

    return (
        <FormProvider {...methods}>
            <form
                id={id}
                className={cn("contents", "bg-inherit")}
                onSubmit={handleSubmit}
            >
                {children}
            </form>
        </FormProvider>
    );
});

export { BaseForm };
export type { IBaseFormRef };
