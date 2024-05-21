import {
    ArrowBottomRightIcon,
    DashboardIcon,
    HomeIcon,
    PersonIcon,
    RocketIcon,
} from "@radix-ui/react-icons";

export const modulesDef = [
    {
        name: "dashboard",
        link: "/",
        Icon: <DashboardIcon />,
    },
    {
        name: "games",
        link: "/games",
        Icon: <RocketIcon />,
    },
    {
        name: "products",
        link: "/products",
        Icon: <ArrowBottomRightIcon />,
    },
];

export const modulesSettings = [
    {
        name: "colors",
        link: "/settings/colors",
        Icon: <HomeIcon />,
    },
    {
        name: "regions",
        link: "/settings/regions",
        Icon: <HomeIcon />,
    },

    {
        name: "users",
        link: "/settings/users",
        Icon: <PersonIcon />,
    },
];
