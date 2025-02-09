import { Modal } from "@/Layout/Modal";
import {
    FCheckboxLabel,
    FInputLabel,
    GroupForm,
    IBaseFormRef,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components";
import { useAuth } from "@/context";
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { sleep } from "@/utils";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const arrPermissionsSettings = [
    {
        name: "users",
        title: "Usuários",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "interpreter",
        title: "Interpretador",
        permissions: ["list", "import"],
    },
    {
        name: "permissions",
        title: "Permissões",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "paymentspvs",
        title: "Taxa de pagamentos",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "costcredit",
        title: "Custo de crédito",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "methodsPayments",
        title: "Métodos de pagamento",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
];

const arrPermissionsQuotations = [
    {
        name: "quotationsforms",
        title: "Cotações",
        permissions: ["list", "new", "edit", "delete", "sendemail", "filter"],
    },
    {
        name: "emails",
        title: "Emails",
        permissions: ["list", "edit", "filter"],
    },
    {
        name: "questions",
        title: "Questões",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "questionsgroups",
        title: "Grupo de questões",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
];

const arrPermissionsProducts = [
    {
        name: "productsrepair",
        title: "Conserto",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productsdisposal",
        title: "Descarte",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productsloan",
        title: "Empréstimo",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productslost",
        title: "Perdido",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productspart",
        title: "Peça",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productsexchange",
        title: "Permuta",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productsgift",
        title: "Presente",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productstest",
        title: "Teste",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productssold",
        title: "Vendido",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productsstock",
        title: "Estoque",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productsprocessing",
        title: "Processamento",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productsreceiving",
        title: "Recebimento",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
    {
        name: "productslist",
        title: "Todos os produtos",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "status",
            "template",
            "export",
            "import",
            "filter",
        ],
    },
];

const arrPermissionsFactory = [
    {
        name: "catalogs",
        title: "Catálogo",
        permissions: [
            "list",
            "new",
            "edit",
            "delete",
            "importvendido",
            "importdefault",
            "filter",
        ],
    },
    {
        name: "games",
        title: "Jogos",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "consoles",
        title: "Consoles",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "extras",
        title: "Extras",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "accessories",
        title: "Acessórios",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "storages",
        title: "Armazenamentos",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "colors",
        title: "Cores",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "brands",
        title: "Marcas",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "models",
        title: "Modelos",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "generous",
        title: "Gêneros",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "numberOfPlayers",
        title: "Número de jogadores",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "publishers",
        title: "Editoras",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "parentalRatings",
        title: "Classificação indicativa",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "developers",
        title: "Densevolvedoras",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "regions",
        title: "Regiões",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "plataforms",
        title: "Plataformas",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
    {
        name: "typeOfConsoles",
        title: "Tipo de plataforma",
        permissions: ["list", "new", "edit", "delete", "filter"],
    },
];

const PagePermissionCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const { refreshRules, applyRules } = useAuth();

    const isEdit = location.pathname.includes("/edit");

    const refForm = useRef<IBaseFormRef>(null);

    const getData = async () => {
        const { success, data } = await getApi({
            url: `permission/${searchParams.get("id")}`,
        });
        if (success) {
            refForm.current?.reset(data);
        }
    };

    const onClose = () => {
        navigate(-1);
    };

    const onSubmit = async (data: FieldValues) => {
        const objPermission: string[] = [];
        Object.entries(data.permission).forEach(([p, v]: any) => {
            Object.keys(v).forEach((s) => {
                if (v[s]) {
                    objPermission.push(`${p}.${s}`);
                }
            });
        });
        if (isEdit) {
            const { success } = await putApi({
                url: `permission/${searchParams.get("id")}`,
                body: {
                    id: data?.id,
                    name: data?.name,
                    permission: objPermission,
                },
            });
            if (success) {
                onClose();
            }
        } else {
            const { success } = await postApi({
                url: "permission",
                body: {
                    id: data?.id,
                    name: data?.name,
                    permission: objPermission,
                },
            });
            if (success) {
                onClose();
            }
        }
        await refreshRules();
        await sleep(500);
        applyRules();
    };

    useEffect(() => {
        if (isEdit) getData();
    }, []);

    return (
        <Modal
            onClose={onClose}
            onSubmit={onSubmit}
            title={isEdit ? t("edit") : t("add")}
            classNameContent="px-1"
            ref={refForm}
        >
            <Tabs defaultValue="general" className="w-full min-h-96">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">Geral</TabsTrigger>
                    <TabsTrigger value="quotations">
                        <LockClosedIcon /> Cotações
                    </TabsTrigger>
                    <TabsTrigger value="products">
                        <LockClosedIcon /> Produtos
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                        <LockClosedIcon /> Configurações
                    </TabsTrigger>
                    <TabsTrigger value="factory">
                        <LockClosedIcon /> Factory
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="flex flex-col gap-4">
                    <FInputLabel label="Nome" name="name" />
                </TabsContent>
                <TabsContent
                    value="quotations"
                    className="grid gap-4 grid-cols-3"
                >
                    {arrPermissionsQuotations.map((v) => (
                        <GroupForm
                            key={v.name}
                            title={v.title}
                            className={cn(
                                "w-full",
                                "grid",
                                "grid-cols-4",
                                "gap-5",
                                "px-3"
                            )}
                        >
                            {v.permissions.map((p) => (
                                <FCheckboxLabel
                                    key={`${v.name}-${p}`}
                                    label={t(p)}
                                    name={`permission.${v.name}.${p}`}
                                    center
                                />
                            ))}
                        </GroupForm>
                    ))}
                </TabsContent>
                <TabsContent
                    value="products"
                    className="grid gap-4 grid-cols-3"
                >
                    {arrPermissionsProducts.map((v) => (
                        <GroupForm
                            key={v.name}
                            title={v.title}
                            className={cn(
                                "w-full",
                                "grid",
                                "grid-cols-4",
                                "gap-5",
                                "px-3"
                            )}
                        >
                            {v.permissions.map((p) => (
                                <FCheckboxLabel
                                    key={`${v.name}-${p}`}
                                    label={t(p)}
                                    name={`permission.${v.name}.${p}`}
                                    center
                                />
                            ))}
                        </GroupForm>
                    ))}
                </TabsContent>
                <TabsContent
                    value="settings"
                    className="grid gap-4 grid-cols-3"
                >
                    {arrPermissionsSettings.map((v) => (
                        <GroupForm
                            key={v.name}
                            title={v.title}
                            className={cn(
                                "w-full",
                                "grid",
                                "grid-cols-4",
                                "gap-5",
                                "px-3"
                            )}
                        >
                            {v.permissions.map((p) => (
                                <FCheckboxLabel
                                    key={`${v.name}-${p}`}
                                    label={t(p)}
                                    name={`permission.${v.name}.${p}`}
                                    center
                                />
                            ))}
                        </GroupForm>
                    ))}
                </TabsContent>
                <TabsContent value="factory" className="grid gap-4 grid-cols-3">
                    {arrPermissionsFactory.map((v) => (
                        <GroupForm
                            key={v.name}
                            title={v.title}
                            className={cn(
                                "w-full",
                                "grid",
                                "grid-cols-4",
                                "gap-5",
                                "px-3"
                            )}
                        >
                            {v.permissions.map((p) => (
                                <FCheckboxLabel
                                    key={`${v.name}-${p}`}
                                    label={t(p)}
                                    name={`permission.${v.name}.${p}`}
                                    center
                                />
                            ))}
                        </GroupForm>
                    ))}
                </TabsContent>
            </Tabs>
        </Modal>
    );
};

export { PagePermissionCreateOrEdit };
