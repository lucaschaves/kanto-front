import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

const PageNotifications = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<any>[]>(() => {
        const columns: any[] = [];

        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id") },
            {
                name: "message",
                title: t("message"),
            },
            {
                name: "read",
                title: t("read"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "link",
                title: t("link"),
            },
            { name: "updatedAt", title: t("updatedAt"), type: "datetime" },
            { name: "createdAt", title: t("createdAt"), type: "datetime" },
        ];

        colsDef.forEach((col) => {
            columns.push(
                createColumn({
                    name: col.name,
                    title: col.title,
                    type: col?.type as any,
                    // capitalize: col.capitalize,
                    // enableSorting: col?.enableSorting,
                })
            );
        });
        return columns;
    });

    return (
        <>
            <Listing
                index={1}
                canAdd={false}
                canApprove={false}
                canDelete={false}
                canEdit={false}
                columns={stateColumns}
            />
            <Outlet />
        </>
    );
};

export { PageNotifications };
