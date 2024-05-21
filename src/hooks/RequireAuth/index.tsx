import { useAuth } from "@/context";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IRequireAuthProps {
    children: ReactNode;
}

export function RequireAuth(props: IRequireAuthProps) {
    const { children } = props;

    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
}
