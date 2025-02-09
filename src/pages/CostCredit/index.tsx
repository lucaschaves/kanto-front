import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageCostCreditCreateOrEdit } from "./createOrEdit";

type ICostCredit = {
    id: string;
    name: string;
    percentage: string;
    value: any;
};

const PageCostCredit = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<ICostCredit>[]>(() => {
        const columns: any[] = [];
        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id") },
            { name: "name", title: t("name") },
            { name: "value", title: t("Função"), capitalize: false },
            { name: "updatedAt", title: t("updatedAt"), type: "datetime" },
            { name: "createdAt", title: t("createdAt"), type: "datetime" },
        ];
        colsDef.forEach((col) => {
            columns.push(
                createColumn({
                    name: col.name,
                    title: col.title,
                    type: col?.type as any,
                    capitalize: col.capitalize,
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

export { PageCostCredit, PageCostCreditCreateOrEdit };
