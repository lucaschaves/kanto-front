import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageEmailsCreateOrEdit } from "./createOrEdit";

const PageEmails = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<any>[]>(() => {
        const columns: any[] = [];
        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id") },
            { name: "to_email", title: t("email") },
            { name: "to_name", title: t("name") },
            { name: "subject", title: t("subject") },
            {
                name: "sent_at",
                title: t("sent_at"),
                type: "date",
                typeFilter: "date",
            },
            {
                name: "is_read",
                title: t("is_read"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "updated_at",
                title: t("updatedAt"),
                type: "datetime",
                typeFilter: "date",
            },
            {
                name: "created_at",
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
                    typeFilter: col?.typeFilter,
                }),
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

export { PageEmails, PageEmailsCreateOrEdit };
