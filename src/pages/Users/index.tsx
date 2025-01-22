import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageUserCreateOrEdit } from "./createOrEdit";

const PageUsers = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<any>[]>(() => {
        const columns: any[] = [];
        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id"), enableSorting: true },
            { name: "name", title: t("name"), enableSorting: true },
            { name: "email", title: t("email"), enableSorting: true },
            {
                name: "status",
                title: t("status"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "permission",
                filter: "permissionsId",
                title: t("permission"),
                type: "object",
                field: "name",
            },
            {
                name: "updatedAt",
                title: t("updatedAt"),
                type: "datetime",
                typeFilter: "date",
            },
            {
                name: "createdAt",
                title: t("createdAt"),
                type: "datetime",
                typeFilter: "date",
            },
        ];
        colsDef.forEach((col) => {
            columns.push({
                ...createColumn({
                    name: col.name,
                    title: col.title,
                    type: col?.type as any,
                    field: col?.field,
                    enableSorting: col?.enableSorting,
                    typeFilter: col?.typeFilter,
                }),
                filter: col.filter,
            });
        });
        return columns;
    });

    return (
        <>
            <Listing columns={stateColumns} index={2} />
            <Outlet />
        </>
    );
};

export { PageUserCreateOrEdit, PageUsers };
