import { Listing } from "@/components";
import { Outlet } from "react-router-dom";

const PageNotifications = () => {
    return (
        <>
            <Listing
                index={1}
                canAdd={false}
                canApprove={false}
                canDelete={false}
                canEdit={false}
            />
            <Outlet />
        </>
    );
};

export { PageNotifications };
