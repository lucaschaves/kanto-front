import { Listing } from "@/components";
import { createColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { PageQuotationsFormCreateOrEdit } from "./createOrEdit";
import { FilterQuotationsForms } from "./filter";

type IQuotationsForm = {
    id: string;
    name: string;
};

const PageQuotationsForms = () => {
    const { t } = useTranslation();

    const [stateColumns] = useState<ColumnDef<IQuotationsForm>[]>(() => {
        const columns: any[] = [];

        const colsDef = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id") },

            {
                name: "providerName",
                title: t("name"),
            },
            {
                name: "providerEmail",
                title: t("email"),
            },
            {
                name: "providerAddress",
                title: t("Endereço"),
            },
            {
                name: "providerOriginContact",
                title: t("Origem do contato"),
            },
            {
                name: "providerPhone",
                title: t("phone"),
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
                columns={stateColumns}
                index={2}
                name="quotationsforms"
                filter_name="filter_form_id"
                // navigateForm="/quotations/quotationssearchs"
                // canAdd={false}
            />
            <Outlet />
        </>
    );
};

export {
    FilterQuotationsForms,
    PageQuotationsFormCreateOrEdit,
    PageQuotationsForms,
};
