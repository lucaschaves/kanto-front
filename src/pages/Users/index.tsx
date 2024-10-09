import { Listing } from "@/components";
import { Outlet } from "react-router-dom";
import { PageUserCreateOrEdit } from "./createOrEdit";

const PageUsers = () => {
    return (
        <>
            <Listing index={2} />
            <Outlet />
        </>
    );
};

export { PageUserCreateOrEdit, PageUsers };
