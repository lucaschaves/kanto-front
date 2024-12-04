import { Listing } from "@/components";
import { createColumn, getParamByPath, ICreateColumn } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { PageProductCreateOrEdit } from "./createOrEdit";
import { FilterProducts } from "./filter";

type IProduct = {
    id: string;
    name: string;
};

const getHiddenColumns = (name: string): any => {
    if (
        [
            "productspresent",
            "productspermutation",
            "productspart",
            "productsdiscard",
        ].includes(name)
    ) {
        return {
            catalogId: false,
            sku: false,
            dateSale: false,
            dateEntryInStock: false,
            dateAnnouncement: false,
            pvFinal: false,
            pvSite: false,
            pvAmazon: false,
            pvMercadoLivre: false,
            addressInStock: false,
            inventoryCost: false,
            salesPlatform: false,
            receiptDate: false,
            createdAt: false,
            updatedAt: false,
        };
    }
    if (["productstest", "productsloan"].includes(name)) {
        return {
            catalogId: false,
            sku: false,
            dateSale: false,
            status: false,
            dateEntryInStock: false,
            dateAnnouncement: false,
            pvSite: false,
            pvAmazon: false,
            pvMercadoLivre: false,
            addressInStock: false,
            inventoryCost: false,
            salesPlatform: false,
            receiptDate: false,
            createdAt: false,
            updatedAt: false,
        };
    }
    if (["productsrepair"].includes(name)) {
        return {
            sku: false,
            dateSale: false,
            status: false,
            dateEntryInStock: false,
            dateAnnouncement: false,
            pvSite: false,
            pvAmazon: false,
            pvMercadoLivre: false,
            addressInStock: false,
            inventoryCost: false,
            salesPlatform: false,
            createdAt: false,
            updatedAt: false,
        };
    }
    if (["productsprocessing"].includes(name)) {
        return {
            dateSale: false,
            status: false,
            dateEntryInStock: false,
            dateAnnouncement: false,
            pvSite: false,
            pvAmazon: false,
            pvMercadoLivre: false,
            addressInStock: false,
            inventoryCost: false,
            salesPlatform: false,
            createdAt: false,
            updatedAt: false,
            receiptDate: false,
            pvFinal: false,
        };
    }
    // return {
    //     id: false,
    //     name: false,
    //     catalogId: false,
    //     sku: false,
    //     dateSale: false,
    //     status: false,
    //     dateEntryInStock: false,
    //     dateAnnouncement: false,
    //     pvFinal: false,
    //     pvSite: false,
    //     pvAmazon: false,
    //     pvMercadoLivre: false,
    //     addressInStock: false,
    //     inventoryCost: false,
    //     salesPlatform: false,
    //     receiptDate: false,
    //     createdAt: false,
    //     updatedAt: false,
    // };
    return {};
};

const PageProducts = ({ index }: { index: number }) => {
    const { t } = useTranslation();
    const location = useLocation();

    const [stateColumns] = useState<ColumnDef<IProduct>[]>(() => {
        const columns: any[] = [];
        const colsDef: ICreateColumn[] = [
            { name: "select", title: "Select" },
            { name: "id", title: t("id"), enableSorting: true },
            { name: "sku", title: t("sku") },
            { name: "name", title: t("name"), enableSorting: true },
            {
                name: "catalog",
                title: t("catalog"),
                type: "object",
                field: "type",
            },
            { name: "status", title: t("status") },
            {
                name: "pvCost",
                title: t("Custo de estoque"),
                type: "currency",
                typeFilter: "number",
            },
            {
                name: "pvMercadoLivre",
                title: t("PV Mercado Livre"),
                type: "currency",
                typeFilter: "number",
            },
            { name: "salesPlatform", title: t("salesPlatform") },
            { name: "inventoryCost", title: t("inventoryCost") },
            { name: "addressInStock", title: t("addressInStock") },
            {
                name: "dateAnnouncement",
                title: t("dateAnnouncement"),
                type: "datetime",
                typeFilter: "date",
            },
            {
                name: "dateEntryInStock",
                title: t("dateEntryInStock"),
                type: "datetime",
                typeFilter: "date",
            },
            {
                name: "dateSale",
                title: t("dateSale"),
                type: "datetime",
                typeFilter: "date",
            },
            {
                name: "receiptDate",
                title: t("receiptDate"),
                type: "datetime",
                typeFilter: "date",
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

    const formActual = getParamByPath(location.pathname, index);
    const columnsHidden = getHiddenColumns(formActual);

    return (
        <>
            <Listing
                columns={stateColumns}
                index={index}
                columnsHidden={{
                    ...columnsHidden,
                    id: false,
                    addressInStock: false,
                    dateAnnouncement: false,
                    dateEntryInStock: false,
                    dateSale: false,
                    inventoryCost: false,
                    receiptDate: false,
                    salesPlatform: false,
                    createdAt: false,
                    updatedAt: false,
                }}
                canExportCsv
                canImportCsv
                canExportTemplateCsv
                nameDefault="products"
                canStatus
                urlDelete="product"
                columnsDynamic={["payments"]}
                // urlMethod="product"
            />
            <Outlet />
        </>
    );
};

export { FilterProducts, PageProductCreateOrEdit, PageProducts };
