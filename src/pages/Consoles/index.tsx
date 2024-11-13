import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageConsoleCreateOrEdit } from "./createOrEdit";

type IConsole = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

const PageConsoles = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IConsole>[]>(() => {
        const columns: any[] = [];
        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id"), enableSorting: true },
            { name: "name", title: t("name"), enableSorting: true },
            { name: "ean", title: t("ean") },
            {
                name: "specialEdition",
                title: t("specialEdition"),
                type: "boolean",
            },
            {
                name: "plataform",
                filter: "plataformsId",
                title: t("plataform"),
                type: "object",
                field: "name",
            },
            {
                name: "color",
                title: t("color"),
                type: "object",
                field: "name",
            },
            {
                name: "model",
                title: t("model"),
                type: "object",
                field: "name",
            },
            {
                name: "typeOfConsole",
                title: t("typeOfConsole"),
                type: "object",
                field: "name",
            },
            {
                name: "storage",
                title: t("storage"),
                type: "object",
                field: "name",
            },
            { name: "releaseYear", title: t("releaseYear") },
            {
                name: "brand",
                title: t("brand"),
                type: "object",
                field: "name",
            },
            { name: "tagsDefault", title: t("tagsDefault") },
            { name: "updatedAt", title: t("updatedAt"), type: "datetime" },
            { name: "createdAt", title: t("createdAt"), type: "datetime" },
        ];
        colsDef.forEach((col) => {
            columns.push({
                ...createColumn({
                    name: col.name,
                    title: col.title,
                    type: col?.type as any,
                    field: col?.field,
                    enableSorting: col?.enableSorting,
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

export { PageConsoleCreateOrEdit, PageConsoles };
