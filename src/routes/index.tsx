/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout } from "@/Layout";
import { RequireAuth } from "@/hooks";
import {
    PageCotacao,
    PageDashboard,
    PageError,
    PageFallback,
    PageGameCreateOrEdit,
    PageGames,
    PageInterpreter,
    PageInterpreterCreateOrEdit,
    PageLogin,
    PageProductCreateOrEdit,
    PageProducts,
    PageSettingCreateOrEdit,
    PageSettings,
} from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import { modulesDef, modulesSettings } from "./modules";

const elementsRoute = (name: string) => {
    switch (name) {
        case "games":
            return {
                element: <PageGames />,
                createEdit: <PageGameCreateOrEdit />,
            };
        case "products":
            return {
                element: <PageProducts />,
                createEdit: <PageProductCreateOrEdit />,
            };
        default:
            return {
                element: <PageDashboard />,
                createEdit: <PageDashboard />,
            };
    }
};

const routesDefault = modulesDef.map((s) => ({
    path: s.link,
    errorElement: <PageError />,
    element: elementsRoute(s.name).element,
    children: [
        {
            path: `${s.link}/new`,
            errorElement: <PageError />,
            element: elementsRoute(s.name).createEdit,
        },
        {
            path: `${s.link}/edit`,
            errorElement: <PageError />,
            element: elementsRoute(s.name).createEdit,
        },
    ],
}));

const appRoutes = () => {
    const arrRoutes = [
        {
            path: "/login",
            element: <PageLogin />,
        },
        {
            path: "/cotacao",
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
                    path: "/interpreter",
                    errorElement: <PageError />,
                    element: <PageInterpreter />,
                    children: [
                        {
                            path: `/interpreter/import`,
                            errorElement: <PageError />,
                            element: <PageInterpreterCreateOrEdit />,
                        },
                    ],
                },
                ...routesDefault,
                {
                    path: "/settings",
                    errorElement: <PageError />,
                    children: [
                        ...modulesSettings.map((r) => ({
                            path: r.link,
                            errorElement: <PageError />,
                            element: <PageSettings />,
                            children: [
                                {
                                    path: `${r.link}/new`,
                                    errorElement: <PageError />,
                                    element: <PageSettingCreateOrEdit />,
                                },
                                {
                                    path: `${r.link}/edit`,
                                    errorElement: <PageError />,
                                    element: <PageSettingCreateOrEdit />,
                                },
                            ],
                        })),
                    ],
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

export { appRoutes };
