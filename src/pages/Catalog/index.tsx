import { Listing } from "@/components";
import { createColumn, ICreateColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageCatalogCreateOrEdit } from "./createOrEdit";
import { FilterCatalogs } from "./filter";

type ICatalog = {
    id: string;
    name: string;
};

const PageCatalogs = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<ICatalog>[]>(() => {
        const columns: any[] = [];
        const colsDef: ICreateColumn[] = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id"), enableSorting: true },
            { name: "type", title: t("type") },
            {
                name: "factory",
                title: t("factory"),
                type: "object",
                field: "name",
                enableSorting: true,
            },
            {
                name: "region",
                title: t("region"),
                type: "object",
                field: "name",
            },
            {
                name: "pcCost",
                title: t("pcCost"),
                type: "currency",
                typeFilter: "number",
            },
            {
                name: "pvMercadoLivre",
                title: t("PV Mercado Livre"),
                type: "currency",
                typeFilter: "number",
            },
            {
                name: "conservation",
                title: t("conservation"),
                typeFilter: "number",
            },
            {
                name: "gameManual",
                title: t("gameManual"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "gamePackaging",
                title: t("gamePackaging"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "gamePackagingRental",
                title: t("gamePackagingRental"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "gameSealed",
                title: t("gameSealed"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "gameWorking",
                title: t("gameWorking"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "consoleComplete",
                title: t("consoleComplete"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "consolePackaging",
                title: t("consolePackaging"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "consoleSealed",
                title: t("consoleSealed"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "consoleTypeUnlocked",
                title: t("consoleTypeUnlocked"),
                type: "text",
                typeFilter: "text",
            },
            {
                name: "consoleUnlocked",
                title: t("consoleUnlocked"),
                type: "boolean",
                typeFilter: "boolean",
            },
            {
                name: "consoleWorking",
                title: t("consoleWorking"),
                type: "boolean",
                typeFilter: "boolean",
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
            columns.push(
                createColumn({
                    name: col.name,
                    title: col.title,
                    type: col?.type as any,
                    field: col?.field,
                    enableHiding: col?.enableHiding,
                    enableSorting: col?.enableSorting,
                    typeFilter: col?.typeFilter,
                })
            );
        });
        return columns;
    });

    return (
        <>
            <Listing
                columns={stateColumns}
                index={2}
                columnsHidden={{
                    id: false,
                    gameConversation: false,
                    gameManual: false,
                    gamePackaging: false,
                    gamePackagingRental: false,
                    gameSealed: false,
                    gameWorking: false,
                    consoleComplete: false,
                    consolePackaging: false,
                    consoleSealed: false,
                    consoleTypeUnlocked: false,
                    consoleUnlocked: false,
                    consoleWorking: false,
                    createdAt: false,
                    updatedAt: false,
                }}
                columnsDynamic={["payments"]}
                canImportCatalog
            />
            <Outlet />
        </>
    );
};

export { FilterCatalogs, PageCatalogCreateOrEdit, PageCatalogs };
