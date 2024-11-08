import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageExtraCreateOrEdit } from "./createOrEdit";

type IExtra = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

const PageExtras = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IExtra>[]>(() => {
        const columns: any[] = [];
        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id") },
            { name: "name", title: t("name") },
            {
                name: "plataform",
                title: t("plataform"),
                type: "object",
                field: "name",
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
                    field: col?.field,
                })
            );
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

export { PageExtraCreateOrEdit, PageExtras };
