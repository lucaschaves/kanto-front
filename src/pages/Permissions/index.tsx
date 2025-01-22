import { Listing } from "@/components";
import { Outlet } from "react-router-dom";
import { PagePermissionCreateOrEdit } from "./createOrEdit";

const PagePermissions = () => {
    return (
        <>
            <Listing index={2} />
            <Outlet />
        </>
    );
};

export { PagePermissionCreateOrEdit, PagePermissions };
