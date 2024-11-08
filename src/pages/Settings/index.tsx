import { Listing } from "@/components";
import { Outlet } from "react-router-dom";
import { PageSettingCreateOrEdit } from "./createOrEdit";
import { FilterSettings } from "./filter";

const PageSettings = () => {
    return (
        <>
            <Listing index={2} canColumns={false} />
            <Outlet />
        </>
    );
};

export { FilterSettings, PageSettingCreateOrEdit, PageSettings };
