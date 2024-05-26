import { cn } from "@/lib";

interface IGroupForm {
    title: string;
    children: any;
    className?: string;
}

const GroupForm = (props: IGroupForm) => {
    const { title, children, className } = props;

    return (
        <div
            className={cn(
                "flex",
                "flex-col",
                "w-full",
                "h-auto",
                "gap-2",
                "border",
                "p-2",
                "rounded-lg"
            )}
        >
            <label className={cn("text-md", "font-semibold")}>{title}</label>
            <div className={className}>{children}</div>
        </div>
    );
};

export { GroupForm };
