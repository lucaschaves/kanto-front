import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageQuestionsGroupCreateOrEdit } from "./createOrEdit";
import { FilterQuestionsGroups } from "./filter";

type IQuestionsGroup = {
    id: string;
    name: string;
};

const PageQuestionsGroups = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IQuestionsGroup>[]>(() => {
        const columns: any[] = [];
        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id") },
            { name: "gameId", title: t("game"), type: "object", field: "name" },
            {
                name: "consoleId",
                title: t("console"),
                type: "object",
                field: "name",
            },
            {
                name: "categoryId",
                title: t("category"),
                type: "object",
                field: "name",
            },
            {
                name: "questionId",
                title: t("question"),
                type: "object",
                field: "question",
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

export {
    FilterQuestionsGroups,
    PageQuestionsGroupCreateOrEdit,
    PageQuestionsGroups,
};
