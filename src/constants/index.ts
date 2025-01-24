export const CONSTANT_TOKEN = "@kanto_token";
export const CONSTANT_LANGUAGE = "@kanto_language";
export const CONSTANT_USER = "@kanto_user";
export const CONSTANT_ROLES = "@kanto_roles";
export const CONSTANT_FAVORITES = "@kanto_fav";
export const CONSTANT_COLUMNS_ORDER = "@kanto_columns_order";
export const CONSTANT_COLUMNS_VIEW = "@kanto_columns_view";
export const CONSTANT_NUMBER_ROWS = "@kanto_number_rows";
export const STATUS_ENUM = [
    {
        id: "presente",
        name: "Presente",
        link: ["/productsgift"],
    },
    {
        id: "permuta",
        name: "Permuta",
        link: ["/productsexchange"],
    },
    {
        id: "peça",
        name: "Peça",
        link: ["/productspart"],
    },
    {
        id: "processamento",
        name: "Processamento",
        link: ["/productsprocessing"],
    },
    {
        id: "descarte",
        name: "Descarte",
        link: ["/productsdisposal"],
    },
    {
        id: "teste",
        name: "Teste",
        link: ["/productstest"],
    },
    {
        id: "emprestimo",
        name: "Empréstimo",
        link: ["/productsloan"],
    },
    {
        id: "conserto",
        name: "Conserto",
        link: ["/productsrepair"],
    },
    {
        id: "recebimento",
        name: "Recebimento",
        link: [
            "/productsreceiving",
            "/productsprocessing",
            "/products/productssold",
            "/products/productsrepair",
            "/products/productstest",
            "/products/productsdisposal",
            "/products/productslost",
            "/products/productspart",
            "/products/productsexchange",
            "/products/productsgift",
            "/products/productsstock",
        ],
    },
    {
        id: "estoque",
        name: "Estoque",
        link: ["/productsstock"],
    },
    {
        id: "vendido",
        name: "Vendido",
        link: ["/productssold"],
    },
    {
        id: "perdido",
        name: "Perdido",
        link: ["/productslost"],
    },
];
