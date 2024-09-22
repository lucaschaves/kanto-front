import { cn } from "@/lib";
import { ChartVendas } from "./Charts/vendas";

const PageDashboard = () => {
    return (
        <div
            className={cn(
                "w-full",
                "h-full",
                "px-3",
                "py-5",
                "flex",
                "flex-wrap",
                "items-start",
                "justify-center",
                "gap-2"
            )}
        >
            <ChartVendas />
        </div>
    );
};

export { PageDashboard };
