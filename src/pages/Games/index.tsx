import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageGameCreateOrEdit } from "./createOrEdit";

type IGame = {
    id: number;
    name: string;
    ean?: string;
    createdAt: Date;
    updatedAt: Date;
    console: any[];
    developer: any[];
    gender: any[];
    numberOfPlayer: any[];
    parentalRating: any[];
    publisher: any[];
    releaseYear: number[];
};

const PageGames = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IGame>[]>(() => {
        const columns: any[] = [];
        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id"), enableSorting: true },
            { name: "name", title: t("name"), enableSorting: true },
            { name: "ean", title: t("ean") },
            {
                name: "plataform",
                title: t("plataform"),
                type: "object",
                field: "name",
            },
            {
                name: "developer",
                title: t("developer"),
                type: "object",
                field: "name",
            },
            {
                name: "publisher",
                title: t("publisher"),
                type: "object",
                field: "name",
            },
            { name: "releaseYear", title: t("releaseYear") },
            {
                name: "gender",
                title: t("gender"),
                type: "object",
                field: "name",
            },
            {
                name: "parentalRating",
                title: t("parentalRating"),
                type: "object",
                field: "name",
            },
            {
                name: "numberOfPlayer",
                title: t("numberOfPlayer"),
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
                    enableSorting: col?.enableSorting,
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

export { PageGameCreateOrEdit, PageGames };
