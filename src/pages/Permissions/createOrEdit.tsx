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
import { cn } from "@/lib";
import { getApi, postApi, putApi } from "@/services";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const arrPermissionsSettings = [
    {
        name: "users",
        title: "Usuários",
    },
    {
        name: "interpreter",
        title: "Interpretador",
    },
    {
        name: "permissions",
        title: "Permissões",
    },
    {
        name: "paymentspvs",
        title: "Taxa de pagamentos",
    },
];

const arrPermissionsQuotations = [
    {
        name: "quotationsforms",
        title: "Cotações",
    },
    {
        name: "questions",
        title: "Questões",
    },
    {
        name: "questionsgroups",
        title: "Grupo de questões",
    },
];

const arrPermissionsProducts = [
    {
        name: "productsrepair",
        title: "Conserto",
    },
    {
        name: "productsdisposal",
        title: "Descarte",
    },
    {
        name: "productsloan",
        title: "Empréstimo",
    },
    {
        name: "productslost",
        title: "Perdido",
    },
    {
        name: "productspart",
        title: "Peça",
    },
    {
        name: "productsexchange",
        title: "Permuta",
    },
    {
        name: "productsgift",
        title: "Presente",
    },
    {
        name: "productstest",
        title: "Teste",
    },
    {
        name: "productssold",
        title: "Vendido",
    },
    {
        name: "productsstock",
        title: "Estoque",
    },
    {
        name: "productsprocessing",
        title: "Processamento",
    },
    {
        name: "productsreceiving",
        title: "Recebimento",
    },
    {
        name: "productslist",
        title: "Todos os produtos",
    },
];

const arrPermissionsFactory = [
    {
        name: "catalogs",
        title: "Catálogo",
    },
    {
        name: "games",
        title: "Jogos",
    },
    {
        name: "consoles",
        title: "Consoles",
    },
    {
        name: "extras",
        title: "Extras",
    },
    {
        name: "accessories",
        title: "Acessórios",
    },
    {
        name: "storages",
        title: "Armazenamentos",
    },
    {
        name: "colors",
        title: "Cores",
    },
    {
        name: "brands",
        title: "Marcas",
    },
    {
        name: "models",
        title: "Modelos",
    },
    {
        name: "generous",
        title: "Gêneros",
    },
    {
        name: "numberOfPlayers",
        title: "Número de jogadores",
    },
    {
        name: "publishers",
        title: "Editoras",
    },
    {
        name: "parentalRatings",
        title: "Classificação indicativa",
    },
    {
        name: "developers",
        title: "Densevolvedoras",
    },
    {
        name: "regions",
        title: "Regiões",
    },
    {
        name: "plataforms",
        title: "Plataformas",
    },
    {
        name: "typeOfConsoles",
        title: "Tipo de plataforma",
    },
    {
        name: "methodsPayments",
        title: "Métodos de pagamento",
    },
];

const PagePermissionCreateOrEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEdit = location.pathname.includes("edit");

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
                            <FCheckboxLabel
                                label="Lista"
                                name={`permission.${v.name}.list`}
                                center
                            />
                            <FCheckboxLabel
                                label="Adicionar"
                                name={`permission.${v.name}.new`}
                                center
                            />
                            <FCheckboxLabel
                                label="Editar"
                                name={`permission.${v.name}.edit`}
                                center
                            />
                            <FCheckboxLabel
                                label="Deletar"
                                name={`permission.${v.name}.delete`}
                                center
                            />
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
                            <FCheckboxLabel
                                label="Lista"
                                name={`permission.${v.name}.list`}
                                center
                            />
                            <FCheckboxLabel
                                label="Adicionar"
                                name={`permission.${v.name}.new`}
                                center
                            />
                            <FCheckboxLabel
                                label="Editar"
                                name={`permission.${v.name}.edit`}
                                center
                            />
                            <FCheckboxLabel
                                label="Deletar"
                                name={`permission.${v.name}.delete`}
                                center
                            />
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
                            <FCheckboxLabel
                                label="Lista"
                                name={`permission.${v.name}.list`}
                                center
                            />
                            <FCheckboxLabel
                                label="Adicionar"
                                name={`permission.${v.name}.new`}
                                center
                            />
                            <FCheckboxLabel
                                label="Editar"
                                name={`permission.${v.name}.edit`}
                                center
                            />
                            <FCheckboxLabel
                                label="Deletar"
                                name={`permission.${v.name}.delete`}
                                center
                            />
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
                            <FCheckboxLabel
                                label="Lista"
                                name={`permission.${v.name}.list`}
                                center
                            />
                            <FCheckboxLabel
                                label="Adicionar"
                                name={`permission.${v.name}.new`}
                                center
                            />
                            <FCheckboxLabel
                                label="Editar"
                                name={`permission.${v.name}.edit`}
                                center
                            />
                            <FCheckboxLabel
                                label="Deletar"
                                name={`permission.${v.name}.delete`}
                                center
                            />
                        </GroupForm>
                    ))}
                </TabsContent>
            </Tabs>
        </Modal>
    );
};

export { PagePermissionCreateOrEdit };
