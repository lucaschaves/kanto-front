import { cn } from "@/lib";
import React, {
    ReactNode,
    Ref,
    forwardRef,
    useEffect,
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
    dirtyFields?: () => void;
    onSubmit(e: FieldValues, p: any): void;
    onError?(e: FieldValues): void;
}

interface IBaseFormRef extends UseFormReturn<any, any> {
    submit: () => void;
}

const BaseForm = forwardRef((props: IBaseFormProps, ref: Ref<IBaseFormRef>) => {
    const {
        id,
        children,
        defaultValues,
        resolver,
        onSubmit,
        onError = () => ({}),
        dirtyFields = () => ({}),
    } = props;

    const methods = useForm({
        defaultValues,
        resolver,
    });

    const onValid = (data: FieldValues, event?: React.BaseSyntheticEvent) => {
        if (event?.preventDefault) {
            event?.preventDefault();
            event?.stopPropagation();
        }
        onSubmit(data, event);
    };

    const onInvalid = (
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
    };

    const handleSubmit = async (data?: any) => {
        methods.handleSubmit(onValid, onInvalid)(data);
    };

    useEffect(() => {
        if (methods.formState.isDirty) dirtyFields();
    }, [methods.formState.isDirty]);

    useImperativeHandle(
        ref,
        () => ({
            ...methods,
            submit() {
                handleSubmit();
            },
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
