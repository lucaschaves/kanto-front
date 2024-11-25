import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageGameCreateOrEdit } from "./createOrEdit";
import { FilterGames } from "./filter";

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
            {
                name: "id",
                title: t("id"),
                enableSorting: true,
                typeFilter: "number",
            },
            { name: "name", title: t("name"), enableSorting: true },
            { name: "ean", title: t("ean"), enableSorting: true },
            {
                name: "plataform",
                title: t("plataform"),
                type: "object",
                field: "name",
                typeFilter: "select",
            },
            {
                name: "developer",
                title: t("developer"),
                type: "object",
                field: "name",
                typeFilter: "select",
            },
            {
                name: "publisher",
                title: t("publisher"),
                type: "object",
                field: "name",
                typeFilter: "select",
            },
            {
                name: "releaseYear",
                title: t("releaseYear"),
                typeFilter: "number",
            },
            {
                name: "gender",
                title: t("gender"),
                type: "object",
                field: "name",
                typeFilter: "select",
            },
            {
                name: "parentalRating",
                title: t("parentalRating"),
                type: "object",
                field: "name",
                typeFilter: "select",
            },
            {
                name: "numberOfPlayer",
                title: t("numberOfPlayer"),
                type: "object",
                field: "name",
                typeFilter: "select",
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
            const column = createColumn({
                name: col.name,
                title: col.title,
                type: col?.type as any,
                field: col?.field,
                enableSorting: col?.enableSorting,
                typeFilter: col?.typeFilter || "text",
            });

            columns.push(column);
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

export { FilterGames, PageGameCreateOrEdit, PageGames };
