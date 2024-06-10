import { Listing } from "@/components";
import { Outlet } from "react-router-dom";
import { PageSettingCreateOrEdit } from "./createOrEdit";

const PageSettings = () => {
    return (
        <>
            <Listing index={2} />
            <Outlet />
        </>
    );
};

export { PageSettingCreateOrEdit, PageSettings };
