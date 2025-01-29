import {
    EnvelopeClosedIcon,
    HomeIcon,
    LockClosedIcon,
    PersonIcon,
} from "@radix-ui/react-icons";
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

export const modulesDef = [
    {
        name: "productsreceiving",
        link: "/productsreceiving",
        Icon: <FaTruckLoading />,
    },
    {
        name: "productsprocessing",
        link: "/productsprocessing",
        Icon: <FaCogs />,
    },
    {
        name: "productslist",
        link: "/productslist",
        Icon: <FaWarehouse />,
    },
];

export const modulesProducts = [
    {
        name: "productsrepair",
        link: "/products/productsrepair",
        Icon: <FaScrewdriverWrench />,
    },
    {
        name: "productsdisposal",
        link: "/products/productsdisposal",
        Icon: <FaTrashAlt />,
    },
    {
        name: "productsloan",
        link: "/products/productsloan",
        Icon: <FaPeopleArrows />,
    },
    {
        name: "productslost",
        link: "/products/productslost",
        Icon: <FaFileCircleQuestion />,
    },
    {
        name: "productspart",
        link: "/products/productspart",
        Icon: <PiPuzzlePieceFill />,
    },
    {
        name: "productsexchange",
        link: "/products/productsexchange",
        Icon: <RiExchangeBoxFill />,
    },
    {
        name: "productsgift",
        link: "/products/productsgift",
        Icon: <FaGift />,
    },
    {
        name: "productstest",
        link: "/products/productstest",
        Icon: <FaGamepad />,
    },
    {
        name: "productssold",
        link: "/products/productssold",
        Icon: <BsFillCartCheckFill />,
    },
    {
        name: "productsstock",
        link: "/products/productsstock",
        Icon: <FaBoxesStacked />,
    },
];

export const modulesSettings = [
    {
        name: "paymentspvs",
        link: "/settings/paymentspvs",
        Icon: <FaFileInvoiceDollar />,
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
        Icon: <BsFileEarmarkSpreadsheetFill />,
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
        Icon: <FaTableList />,
    },
    {
        name: "games",
        link: "/factory/games",
        Icon: <IoGameController />,
    },
    {
        name: "consoles",
        link: "/factory/consoles",
        Icon: <BsPc />,
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
        Icon: <FaCartPlus />,
    },
    {
        name: "emails",
        link: "/quotations/emails",
        Icon: <EnvelopeClosedIcon />,
    },
    {
        name: "questions",
        link: "/quotations/questions",
        Icon: <FaClipboardQuestion />,
    },
    {
        name: "questionsgroups",
        link: "/quotations/questionsgroups",
        Icon: <FaClipboardList />,
    },
];

export const modulesAll = [
    ...modulesDef,
    ...modulesProducts,
    ...modulesSettings,
    ...modulesFactory,
    ...modulesQuotations,
];
