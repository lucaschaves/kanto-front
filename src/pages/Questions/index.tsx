import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageQuestionCreateOrEdit } from "./createOrEdit";
import { FilterQuestions } from "./filter";

type IQuestion = {
    id: string;
    name: string;
};

const PageQuestions = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IQuestion>[]>(() => {
        const columns: any[] = [];
        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id") },
            { name: "question", title: t("question") },
            { name: "complete", title: t("complete"), type: "boolean" },
            { name: "conservation", title: t("conservation") },
            { name: "manual", title: t("manual"), type: "boolean" },
            { name: "packaging", title: t("packaging"), type: "boolean" },
            { name: "sealed", title: t("sealed"), type: "boolean" },
            { name: "standard", title: t("standard"), type: "boolean" },
            { name: "unlocked", title: t("unlocked"), type: "boolean" },
            { name: "withBox", title: t("withBox"), type: "boolean" },
            { name: "working", title: t("working"), type: "boolean" },
            { name: "updatedAt", title: t("updatedAt"), type: "datetime" },
            { name: "createdAt", title: t("createdAt"), type: "datetime" },
        ];
        colsDef.forEach((col) => {
            columns.push(
                createColumn({
                    name: col.name,
                    title: col.title,
                    type: col?.type as any,
                    // field: col?.field,
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

export { FilterQuestions, PageQuestionCreateOrEdit, PageQuestions };
