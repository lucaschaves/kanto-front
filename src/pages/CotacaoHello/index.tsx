import { Button } from "@/components";
import { cn } from "@/lib";
import { useNavigate } from "react-router-dom";

export const PageCotacaoHello = () => {
    const navigate = useNavigate();

    return (
        <div
            className={cn(
                "w-screen",
                "h-screen",
                "flex",
                "items-center",
                "justify-center",
                "xl:p-10"
            )}
            style={{
                backgroundColor: "#5d94fb",
            }}
        >
            <img
                className={cn(
                    "w-full",
                    "h-full",
                    "object-cover",
                    "bg-no-repeat",
                    "flex",
                    "items-center",
                    "justify-center"
                )}
                src="/assets/bg-quotation.jpg"
            />
            <div
                className={cn(
                    "absolute",
                    "max-w-lg",
                    "flex",
                    "flex-col",
                    "gap-10",
                    "justify-center",
                    "p-10",
                    "bg-primary",
                    "rounded-lg",
                    "text-white"
                )}
            >
                <h1 className="font-semibold text-center text-xl">
                    Que tal dar um reset em seus games zerados e passá-los para
                    um player 2?
                </h1>
                <p className="text-center">
                    Venda os seus jogos esquecidos no armário para Kanto dos
                    Jogos e receba em dinheiro ou créditos para gastar em nossa
                    loja!
                </p>
                <Button
                    onClick={() => navigate("/quotation")}
                    variant="secondary"
                    className="bg-yellow-500"
                >
                    Começar
                </Button>
            </div>
        </div>
    );
};
