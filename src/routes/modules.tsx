import {
    ArrowBottomRightIcon,
    CardStackIcon,
    CubeIcon,
    EnvelopeClosedIcon,
    HomeIcon,
    LockClosedIcon,
    PersonIcon,
    RocketIcon,
    TableIcon,
} from "@radix-ui/react-icons";

export const modulesDef = [
    {
        name: "productsreceiving",
        link: "/productsreceiving",
        Icon: <CubeIcon />,
    },
    {
        name: "productsprocessing",
        link: "/productsprocessing",
        Icon: <CubeIcon />,
    },
    {
        name: "productslist",
        link: "/productslist",
        Icon: <CubeIcon />,
    },
];

export const modulesProducts = [
    {
        name: "productsrepair",
        link: "/products/productsrepair",
        Icon: <CubeIcon />,
    },
    {
        name: "productsdisposal",
        link: "/products/productsdisposal",
        Icon: <CubeIcon />,
    },
    {
        name: "productsloan",
        link: "/products/productsloan",
        Icon: <CubeIcon />,
    },

    {
        name: "productslost",
        link: "/products/productslost",
        Icon: <CubeIcon />,
    },
    {
        name: "productspart",
        link: "/products/productspart",
        Icon: <CubeIcon />,
    },
    {
        name: "productsexchange",
        link: "/products/productsexchange",
        Icon: <CubeIcon />,
    },
    {
        name: "productsgift",
        link: "/products/productsgift",
        Icon: <CubeIcon />,
    },
    {
        name: "productstest",
        link: "/products/productstest",
        Icon: <CubeIcon />,
    },
    {
        name: "productssold",
        link: "/products/productssold",
        Icon: <CubeIcon />,
    },
    {
        name: "productsstock",
        link: "/products/productsstock",
        Icon: <CubeIcon />,
    },
];

export const modulesSettings = [
    {
        name: "paymentspvs",
        link: "/settings/paymentspvs",
        Icon: <CubeIcon />,
    },
    {
        name: "users",
        link: "/settings/users",
        Icon: <PersonIcon />,
    },
    {
        name: "permissions",
        link: "/settings/permissions",
        Icon: <LockClosedIcon />,
    },
    {
        name: "interpreter",
        link: "/settings/interpreter",
        Icon: <CardStackIcon />,
    },
    {
        name: "paymentmethods",
        link: "/settings/paymentmethods",
        Icon: <HomeIcon />,
    },
];

export const modulesFactory = [
    {
        name: "catalogs",
        link: "/factory/catalogs",
        Icon: <TableIcon />,
    },
    {
        name: "games",
        link: "/factory/games",
        Icon: <RocketIcon />,
    },
    {
        name: "consoles",
        link: "/factory/consoles",
        Icon: <HomeIcon />,
    },
    {
        name: "extras",
        link: "/factory/extras",
        Icon: <HomeIcon />,
    },
    {
        name: "accessories",
        link: "/factory/accessories",
        Icon: <HomeIcon />,
    },
    {
        name: "storages",
        link: "/factory/storages",
        Icon: <HomeIcon />,
    },
    {
        name: "colors",
        link: "/factory/colors",
        Icon: <HomeIcon />,
    },
    {
        name: "brands",
        link: "/factory/brands",
        Icon: <HomeIcon />,
    },
    {
        name: "models",
        link: "/factory/models",
        Icon: <HomeIcon />,
    },
    {
        name: "generous",
        link: "/factory/generous",
        Icon: <HomeIcon />,
    },
    {
        name: "numberofplayers",
        link: "/factory/numberofplayers",
        Icon: <HomeIcon />,
    },
    {
        name: "parentalratings",
        link: "/factory/parentalratings",
        Icon: <HomeIcon />,
    },
    {
        name: "publishers",
        link: "/factory/publishers",
        Icon: <HomeIcon />,
    },
    {
        name: "regions",
        link: "/factory/regions",
        Icon: <HomeIcon />,
    },
    {
        name: "developers",
        link: "/factory/developers",
        Icon: <HomeIcon />,
    },
    {
        name: "plataforms",
        link: "/factory/plataforms",
        Icon: <HomeIcon />,
    },
    {
        name: "typesofconsoles",
        link: "/factory/typesofconsoles",
        Icon: <HomeIcon />,
    },
];

export const modulesQuotations = [
    {
        name: "quotationsforms",
        link: "/quotations/quotationsforms",
        Icon: <ArrowBottomRightIcon />,
    },
    {
        name: "emails",
        link: "/quotations/emails",
        Icon: <EnvelopeClosedIcon />,
    },
    {
        name: "questions",
        link: "/quotations/questions",
        Icon: <PersonIcon />,
    },
    {
        name: "questionsgroups",
        link: "/quotations/questionsgroups",
        Icon: <CardStackIcon />,
    },
];

export const modulesAll = [
    ...modulesDef,
    ...modulesProducts,
    ...modulesSettings,
    ...modulesFactory,
    ...modulesQuotations,
];
