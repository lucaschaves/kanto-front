import { HomeIcon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import {
    BsFileEarmarkSpreadsheetFill,
    BsFillCartCheckFill,
    BsPc,
} from "react-icons/bs";
import {
    FaCartPlus,
    FaClipboardList,
    FaCogs,
    FaFileInvoiceDollar,
    FaGamepad,
    FaGift,
    FaPeopleArrows,
    FaTrashAlt,
    FaTruckLoading,
    FaWarehouse,
} from "react-icons/fa";
import {
    FaBoxesStacked,
    FaClipboardQuestion,
    FaFileCircleQuestion,
    FaScrewdriverWrench,
    FaTableList,
} from "react-icons/fa6";
import { IoGameController } from "react-icons/io5";
import { PiPuzzlePieceFill } from "react-icons/pi";
import { RiExchangeBoxFill } from "react-icons/ri";

export const SIZE_ICON = 18;

export const modulesDef = [
    {
        name: "productsreceiving",
        link: "/productsreceiving",
        Icon: <FaTruckLoading size={SIZE_ICON} />,
    },
    {
        name: "productsprocessing",
        link: "/productsprocessing",
        Icon: <FaCogs size={SIZE_ICON} />,
    },
    {
        name: "productslist",
        link: "/productslist",
        Icon: <FaWarehouse size={SIZE_ICON} />,
    },
];

export const modulesProducts = [
    {
        name: "productsrepair",
        link: "/products/productsrepair",
        Icon: <FaScrewdriverWrench size={SIZE_ICON} />,
    },
    {
        name: "productsdisposal",
        link: "/products/productsdisposal",
        Icon: <FaTrashAlt size={SIZE_ICON} />,
    },
    {
        name: "productsloan",
        link: "/products/productsloan",
        Icon: <FaPeopleArrows size={SIZE_ICON} />,
    },
    {
        name: "productslost",
        link: "/products/productslost",
        Icon: <FaFileCircleQuestion size={SIZE_ICON} />,
    },
    {
        name: "productspart",
        link: "/products/productspart",
        Icon: <PiPuzzlePieceFill size={SIZE_ICON} />,
    },
    {
        name: "productsexchange",
        link: "/products/productsexchange",
        Icon: <RiExchangeBoxFill size={SIZE_ICON} />,
    },
    {
        name: "productsgift",
        link: "/products/productsgift",
        Icon: <FaGift size={SIZE_ICON} />,
    },
    {
        name: "productstest",
        link: "/products/productstest",
        Icon: <FaGamepad size={SIZE_ICON} />,
    },
    {
        name: "productssold",
        link: "/products/productssold",
        Icon: <BsFillCartCheckFill size={SIZE_ICON} />,
    },
    {
        name: "productsstock",
        link: "/products/productsstock",
        Icon: <FaBoxesStacked size={SIZE_ICON} />,
    },
];

export const modulesSettings = [
    {
        name: "paymentspvs",
        link: "/settings/paymentspvs",
        Icon: <FaFileInvoiceDollar size={SIZE_ICON} />,
    },
    {
        name: "costcredits",
        link: "/settings/costcredits",
        Icon: <FaFileInvoiceDollar size={SIZE_ICON} />,
    },
    {
        name: "templatesemails",
        link: "/settings/templatesemails",
        Icon: <FaFileInvoiceDollar size={SIZE_ICON} />,
    },
    {
        name: "purchasemethods",
        link: "/settings/purchasemethods",
        Icon: <FaFileInvoiceDollar size={SIZE_ICON} />,
    },
    {
        name: "users",
        link: "/settings/users",
        Icon: <PersonIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "permissions",
        link: "/settings/permissions",
        Icon: <LockClosedIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "interpreter",
        link: "/settings/interpreter",
        Icon: <BsFileEarmarkSpreadsheetFill size={SIZE_ICON} />,
    },
    {
        name: "paymentmethods",
        link: "/settings/paymentmethods",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
];

export const modulesFactory = [
    {
        name: "catalogs",
        link: "/factory/catalogs",
        Icon: <FaTableList size={SIZE_ICON} />,
    },
    {
        name: "games",
        link: "/factory/games",
        Icon: <IoGameController size={SIZE_ICON} />,
    },
    {
        name: "consoles",
        link: "/factory/consoles",
        Icon: <BsPc size={SIZE_ICON} />,
    },
    {
        name: "accessories",
        link: "/factory/accessories",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "extras",
        link: "/factory/extras",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "storages",
        link: "/factory/storages",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "colors",
        link: "/factory/colors",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "brands",
        link: "/factory/brands",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "models",
        link: "/factory/models",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "generous",
        link: "/factory/generous",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "numberofplayers",
        link: "/factory/numberofplayers",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "parentalratings",
        link: "/factory/parentalratings",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "publishers",
        link: "/factory/publishers",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "regions",
        link: "/factory/regions",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "developers",
        link: "/factory/developers",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "plataforms",
        link: "/factory/plataforms",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
    {
        name: "typesofconsoles",
        link: "/factory/typesofconsoles",
        Icon: <HomeIcon width={SIZE_ICON} height={SIZE_ICON} />,
    },
];

export const modulesQuotations = [
    {
        name: "quotationsforms",
        link: "/quotations/quotationsforms",
        Icon: <FaCartPlus size={SIZE_ICON} />,
    },
    // {
    //     name: "emails",
    //     link: "/quotations/emails",
    //     Icon: <EnvelopeClosedIcon width={SIZE_ICON} height={SIZE_ICON} />,
    // },
    {
        name: "questions",
        link: "/quotations/questions",
        Icon: <FaClipboardQuestion size={SIZE_ICON} />,
    },
    {
        name: "questionsgroups",
        link: "/quotations/questionsgroups",
        Icon: <FaClipboardList size={SIZE_ICON} />,
    },
];

export const modulesAll = [
    ...modulesDef,
    ...modulesProducts,
    ...modulesSettings,
    ...modulesFactory,
    ...modulesQuotations,
];
