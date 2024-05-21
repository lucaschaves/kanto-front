import { Button, ButtonProps } from "@/components";
import { cn } from "@/lib";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface IButtonProps extends ButtonProps {
    label: string;
    loading?: boolean;
}

const FButtonSubmit = (props: IButtonProps) => {
    const { label, loading, className = "", ...rest } = props;

    const {
        formState: { isSubmitting },
    } = useFormContext();

    const isLoading = isSubmitting || loading;

    return (
        <Button
            type="submit"
            className={cn("w-auto", "max-w-sm", className)}
            disabled={isLoading}
            {...rest}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    aguarde...
                </>
            ) : (
                <>{label}</>
            )}
        </Button>
    );
};

export { FButtonSubmit };
