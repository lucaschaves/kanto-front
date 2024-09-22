/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout } from "@/Layout";
import { RequireAuth } from "@/hooks";
import {
    PageAccessories,
    PageAccessoryCreateOrEdit,
    PageCotacao,
    PageCotacaoHello,
    PageDashboard,
    PageError,
    PageExtraCreateOrEdit,
    PageExtras,
    PageFallback,
    PageGameCreateOrEdit,
    PageGames,
    PageHistoriesForms,
    PageHistoriesFormsCreateOrEdit,
    PageInterpreter,
    PageInterpreterCreateOrEdit,
    PageLogin,
    PagePaymentsPv,
    PagePaymentsPvCreateOrEdit,
    PageProductCreateOrEdit,
    PageProductRegistrationCreateOrEdit,
    PageProducts,
    PageProductsRegistration,
    PageQuestionCreateOrEdit,
    PageQuestions,
    PageQuestionsGroupCreateOrEdit,
    PageQuestionsGroups,
    PageQuotationsFormCreateOrEdit,
    PageQuotationsForms,
    PageQuotationsSearchCreateOrEdit,
    PageQuotationsSearchs,
    PageSettingCreateOrEdit,
    PageSettings,
} from "@/pages";
import { PageConsoleCreateOrEdit, PageConsoles } from "@/pages/Consoles";
import { createBrowserRouter } from "react-router-dom";
import {
    modulesDef,
    modulesFactory,
    modulesProducts,
    modulesQuotations,
    modulesSettings,
} from "./modules";

export const appRoutes = () => {
    const arrRoutes = [
        {
            path: "/login",
            element: <PageLogin />,
        },
        {
            path: "/cotacao",
            element: <PageCotacaoHello />,
        },
        {
            path: "/quotation",
            element: <PageCotacao />,
        },
        {
            path: "/",
            element: (
                <RequireAuth>
                    <Layout />
                </RequireAuth>
            ),
            children: [
                {
                    path: "/",
                    errorElement: <PageError />,
                    element: <PageDashboard />,
                },
                {
                    path: "/productsreceiving",
                    errorElement: <PageError />,
                    element: <PageProducts index={1} />,
                    children: [
                        {
                            path: `/productsreceiving/new`,
                            errorElement: <PageError />,
                            element: <PageProductCreateOrEdit />,
                        },
                        {
                            path: `/productsreceiving/edit`,
                            errorElement: <PageError />,
                            element: <PageProductCreateOrEdit />,
                        },
                    ],
                },
                {
                    path: "/productsprocessing",
                    errorElement: <PageError />,
                    element: <PageProducts index={1} />,
                    children: [
                        {
                            path: `/productsprocessing/new`,
                            errorElement: <PageError />,
                            element: <PageProductCreateOrEdit />,
                        },
                        {
                            path: `/productsprocessing/edit`,
                            errorElement: <PageError />,
                            element: <PageProductCreateOrEdit />,
                        },
                    ],
                },
                {
                    path: "/payments",
                    errorElement: <PageError />,
                    children: [
                        {
                            path: "/payments/paymentspvs",
                            errorElement: <PageError />,
                            element: <PagePaymentsPv />,
                            children: [
                                {
                                    path: `/payments/paymentspvs/new`,
                                    errorElement: <PageError />,
                                    element: <PagePaymentsPvCreateOrEdit />,
                                },
                                {
                                    path: `/payments/paymentspvs/edit`,
                                    errorElement: <PageError />,
                                    element: <PagePaymentsPvCreateOrEdit />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "/products",
                    errorElement: <PageError />,
                    children: modulesProducts.map((s) => ({
                        path: s.link,
                        errorElement: <PageError />,
                        element: <PageProducts index={2} />,
                        children: [
                            {
                                path: `${s.link}/new`,
                                errorElement: <PageError />,
                                element: <PageProductCreateOrEdit />,
                            },
                            {
                                path: `${s.link}/edit`,
                                errorElement: <PageError />,
                                element: <PageProductCreateOrEdit />,
                            },
                        ],
                    })),
                },
                {
                    path: "/productsregistration",
                    errorElement: <PageError />,
                    element: <PageProductsRegistration />,
                    children: [
                        {
                            path: "/productsregistration/new",
                            errorElement: <PageError />,
                            element: <PageProductRegistrationCreateOrEdit />,
                        },
                        {
                            path: "/productsregistration/edit",
                            errorElement: <PageError />,
                            element: <PageProductRegistrationCreateOrEdit />,
                        },
                    ],
                },
                {
                    path: "/quotationsforms",
                    errorElement: <PageError />,
                    element: <PageQuotationsForms />,
                    children: [
                        {
                            path: "/quotationsforms/new",
                            errorElement: <PageError />,
                            element: <PageQuotationsFormCreateOrEdit />,
                        },
                        {
                            path: "/quotationsforms/edit",
                            errorElement: <PageError />,
                            element: <PageQuotationsFormCreateOrEdit />,
                        },
                    ],
                },
                {
                    path: "/quotationhistorys",
                    errorElement: <PageError />,
                    element: <PageHistoriesForms />,
                    children: [
                        {
                            path: "/quotationhistorys/new",
                            errorElement: <PageError />,
                            element: <PageHistoriesFormsCreateOrEdit />,
                        },
                        {
                            path: "/quotationhistorys/edit",
                            errorElement: <PageError />,
                            element: <PageHistoriesFormsCreateOrEdit />,
                        },
                    ],
                },
                {
                    path: "/settings",
                    errorElement: <PageError />,
                    children: [
                        {
                            path: "/settings/users",
                            errorElement: <PageError />,
                            element: <PageSettings />,
                            children: [
                                {
                                    path: "/settings/users/new",
                                    errorElement: <PageError />,
                                    element: <PageSettingCreateOrEdit />,
                                },
                                {
                                    path: "/settings/users/edit",
                                    errorElement: <PageError />,
                                    element: <PageSettingCreateOrEdit />,
                                },
                            ],
                        },
                        {
                            path: "/settings/interpreter",
                            errorElement: <PageError />,
                            element: <PageInterpreter />,
                            children: [
                                {
                                    path: "/settings/interpreter/import",
                                    errorElement: <PageError />,
                                    element: <PageInterpreterCreateOrEdit />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "/factory",
                    errorElement: <PageError />,
                    children: modulesFactory.map((s) => ({
                        path: s.link,
                        errorElement: <PageError />,
                        element:
                            s.name === "games" ? (
                                <PageGames />
                            ) : s.name === "accesories" ? (
                                <PageAccessories />
                            ) : s.name === "consoles" ? (
                                <PageConsoles />
                            ) : s.name === "extras" ? (
                                <PageExtras />
                            ) : (
                                <PageSettings />
                            ),
                        children: [
                            {
                                path: `${s.link}/new`,
                                errorElement: <PageError />,
                                element:
                                    s.name === "games" ? (
                                        <PageGameCreateOrEdit />
                                    ) : s.name === "accesories" ? (
                                        <PageAccessoryCreateOrEdit />
                                    ) : s.name === "consoles" ? (
                                        <PageConsoleCreateOrEdit />
                                    ) : s.name === "extras" ? (
                                        <PageExtraCreateOrEdit />
                                    ) : (
                                        <PageSettingCreateOrEdit />
                                    ),
                            },
                            {
                                path: `${s.link}/edit`,
                                errorElement: <PageError />,
                                element:
                                    s.name === "games" ? (
                                        <PageGameCreateOrEdit />
                                    ) : s.name === "accesories" ? (
                                        <PageAccessoryCreateOrEdit />
                                    ) : s.name === "consoles" ? (
                                        <PageConsoleCreateOrEdit />
                                    ) : s.name === "extras" ? (
                                        <PageExtraCreateOrEdit />
                                    ) : (
                                        <PageSettingCreateOrEdit />
                                    ),
                            },
                        ],
                    })),
                },
                {
                    path: "/quotations",
                    errorElement: <PageError />,
                    children: modulesQuotations.map((s) => ({
                        path: s.link,
                        errorElement: <PageError />,
                        element: ["quotationhistorys"].includes(s.name) ? (
                            <PageHistoriesForms />
                        ) : ["quotationsforms"].includes(s.name) ? (
                            <PageQuotationsForms />
                        ) : ["quotationssearchs"].includes(s.name) ? (
                            <PageQuotationsSearchs />
                        ) : ["questionsgroups"].includes(s.name) ? (
                            <PageQuestionsGroups />
                        ) : (
                            <PageQuestions />
                        ),
                        children: [
                            {
                                path: `${s.link}/new`,
                                errorElement: <PageError />,
                                element: ["quotationhistorys"].includes(
                                    s.name
                                ) ? (
                                    <PageHistoriesFormsCreateOrEdit />
                                ) : ["quotationsforms"].includes(s.name) ? (
                                    <PageQuotationsFormCreateOrEdit />
                                ) : ["quotationssearchs"].includes(s.name) ? (
                                    <PageQuotationsSearchCreateOrEdit />
                                ) : ["questionsgroups"].includes(s.name) ? (
                                    <PageQuestionsGroupCreateOrEdit />
                                ) : (
                                    <PageQuestionCreateOrEdit />
                                ),
                            },
                            {
                                path: `${s.link}/edit`,
                                errorElement: <PageError />,
                                element: ["quotationhistorys"].includes(
                                    s.name
                                ) ? (
                                    <PageHistoriesFormsCreateOrEdit />
                                ) : ["quotationsforms"].includes(s.name) ? (
                                    <PageQuotationsFormCreateOrEdit />
                                ) : ["quotationssearchs"].includes(s.name) ? (
                                    <PageQuotationsSearchCreateOrEdit />
                                ) : ["questionsgroups"].includes(s.name) ? (
                                    <PageQuestionsGroupCreateOrEdit />
                                ) : (
                                    <PageQuestionCreateOrEdit />
                                ),
                            },
                        ],
                    })),
                },
            ],
        },
        {
            path: "/error",
            element: (
                <RequireAuth>
                    <PageError />
                </RequireAuth>
            ),
        },
        {
            path: "*",
            element: (
                <RequireAuth>
                    <PageFallback />
                </RequireAuth>
            ),
        },
    ];

    return createBrowserRouter(arrRoutes);
};

export { modulesDef, modulesFactory, modulesQuotations, modulesSettings };
