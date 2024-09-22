import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    BaseForm,
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Dropzone,
    FButtonSubmit,
    FInputLabel,
    FSelectLabel,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    IBaseFormRef,
    Input,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
    RadioGroup,
    RadioGroupItem,
    ScrollArea,
    Skeleton,
    Step,
    StepItem,
    Stepper,
    Textarea,
    useStepper,
} from "@/components";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib";
import { deleteApi, getApi, postApi, putApi } from "@/services";
import { messageError, sleep } from "@/utils";
import { TrashIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const steps = [
    { label: "Começar" },
    { label: "Seus dados" },
    { label: "Dados do produto" },
    { label: "Envio" },
] satisfies StepItem[];

const formatQuotations = (data: any) => {
    const quotationProducts: any[] = [];
    data?.quotationSearchId?.forEach((s: any) => {
        quotationProducts.push({
            id: s?.id,
            product: {
                id: s?.gameId?.id,
                name: s?.gameId?.name,
                image: s?.gameId?.images?.image,
            },
            question: {
                id: s?.questionId?.id,
                question: s?.questionId?.question,
            },
            comments: "comentário",
            quantity: 1,
        });
    });
    return quotationProducts;
};

const Footer = () => {
    const {
        prevStep,
        resetSteps,
        isDisabledStep,
        hasCompletedAllSteps,
        isLastStep,
        isOptionalStep,
        activeStep,
    } = useStepper();
    return (
        <>
            {hasCompletedAllSteps && (
                <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                    <h1 className="text-xl">Uhuul, você completou! 🎉</h1>
                </div>
            )}
            <div
                className={cn(
                    "w-full",
                    "flex",
                    "items-center",
                    "justify-between",
                    "gap-2",
                    "pt-5"
                )}
            >
                {hasCompletedAllSteps ? (
                    <Button size="sm" onClick={resetSteps}>
                        Enviar outro
                    </Button>
                ) : (
                    <>
                        {activeStep > 0 ? (
                            <Button
                                disabled={isDisabledStep}
                                onClick={prevStep}
                                size="lg"
                                variant="ghost"
                            >
                                Voltar
                            </Button>
                        ) : (
                            <></>
                        )}
                        <FButtonSubmit
                            size="lg"
                            className="w-full max-w-full"
                            label={
                                isLastStep
                                    ? "Finalizar"
                                    : isOptionalStep
                                    ? "Pular"
                                    : "Próxima etapa"
                            }
                        />
                    </>
                )}
            </div>
        </>
    );
};

function MyStepperFooter() {
    const { activeStep, resetSteps, steps } = useStepper();

    if (activeStep !== steps.length) {
        return null;
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <Button onClick={resetSteps}>Dados enviados</Button>
        </div>
    );
}

const PrimeiraEtapa = ({
    onValid,
}: {
    onValid: (step: string, data: any) => Promise<boolean>;
}) => {
    const { nextStep } = useStepper();

    const refForm = useRef<IBaseFormRef>(null);

    const [searchCity, setSearchCity] = useState("");
    const [searchState, setSearchState] = useState("");
    const [stateCities, setCities] = useState<any[]>([]);
    const [stateStates, setStates] = useState<any[]>([]);

    async function onSubmit(data: any) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(data.email)) {
            if (await onValid("first", data)) nextStep();
        } else {
            messageError({ message: "Email inválido" });
        }
    }

    const getItemsCities = useCallback(async () => {
        const stateWatch = refForm.current?.watch("state");
        if (stateWatch) {
            const response = await getApi({
                url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateWatch}/municipios?view=nivelado`,
                clean: true,
            });
            setCities(
                response.map((k: any) => ({
                    id: k["municipio-id"],
                    nome: k["municipio-nome"],
                }))
            );
        }
    }, [searchCity]);

    const getItemsStates = useCallback(async () => {
        const response = await getApi({
            url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados?view=nivelado",
            clean: true,
        });
        setStates(
            response.map((k: any) => ({
                id: k["UF-id"],
                nome: `${k["UF-sigla"]}-${k["UF-nome"]}`,
            }))
        );
    }, [searchCity]);

    const debounceSearchCity = useDebounce(searchCity, 2000);

    useEffect(() => {
        getItemsCities();
    }, [debounceSearchCity]);

    useEffect(() => {
        getItemsStates();
    }, []);

    return (
        <div className={cn("w-full", "max-w-md", "flex", "flex-col", "gap-2")}>
            <p className={cn("text-lg", "font-semibold")}>
                Para fazermos a avaliação dos seus itens, precisamos de algumas
                informações suas! Complete os campos abaixo:
            </p>

            <BaseForm ref={refForm} onSubmit={onSubmit}>
                <FInputLabel
                    label="Nome completo"
                    name="name"
                    placeholder="Seu nome aqui"
                    className="max-w-full"
                    rules={{
                        required: "É necessário preencher o nome",
                    }}
                />
                <FInputLabel
                    label="Email"
                    name="email"
                    placeholder="email@exemplo.com"
                    className="max-w-full"
                    rules={{
                        required: "É necessário preencher o email",
                    }}
                    type="email"
                />
                <FInputLabel
                    label="Telefone celular"
                    name="phone"
                    placeholder="(__) _____ - ____"
                    className="max-w-full"
                    rules={{
                        required: "É necessário preencher o telefone",
                    }}
                />
                <FormField
                    name="state"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Estado</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full",
                                                "justify-between",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? stateStates.find(
                                                      (st) =>
                                                          st.id == field.value
                                                  )?.nome
                                                : "Selecione o estado"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                    <Command>
                                        <Input
                                            placeholder="Buscar estado..."
                                            value={searchState}
                                            onChange={(e) =>
                                                setSearchState(e.target.value)
                                            }
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                Estado não localizado.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {stateStates
                                                    .filter((st) => {
                                                        if (
                                                            searchState.length
                                                        ) {
                                                            return st.nome
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchState
                                                                );
                                                        }
                                                        return st;
                                                    })
                                                    .map((st) => (
                                                        <CommandItem
                                                            value={st.id}
                                                            key={st.id}
                                                            onSelect={async () => {
                                                                refForm.current?.setValue(
                                                                    "state",
                                                                    st.id
                                                                );
                                                                await sleep(
                                                                    200
                                                                );
                                                                getItemsCities();
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    st.id ==
                                                                        field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {st.nome}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="cidade"
                    disabled={stateCities.length === 0}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Cidade</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full",
                                                "justify-between",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? stateCities.find(
                                                      (city) =>
                                                          city.id == field.value
                                                  )?.nome
                                                : "Seleciona a cidade"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                    <Command>
                                        <Input
                                            placeholder="Buscar cidade..."
                                            value={searchCity}
                                            onChange={(e) =>
                                                setSearchCity(e.target.value)
                                            }
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                Cidade não localizada.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {stateCities
                                                    .filter((city) => {
                                                        if (searchCity.length) {
                                                            return city.nome
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchCity
                                                                );
                                                        }
                                                        return city;
                                                    })
                                                    .map((city) => (
                                                        <CommandItem
                                                            value={city.id}
                                                            key={city.id}
                                                            onSelect={() => {
                                                                refForm.current?.setValue(
                                                                    "cidade",
                                                                    city.id
                                                                );
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    city.id ==
                                                                        field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {city.nome}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FSelectLabel
                    label="Como nos conheceu?"
                    name="originContact"
                    items={[
                        { id: "google", name: "Google" },
                        { id: "mercadoLivre", name: "Mercado Livre" },
                    ]}
                    className="max-w-full"
                />
                <Footer />
            </BaseForm>
        </div>
    );
};

const SegundaEtapa = ({
    onValid,
}: {
    onValid: (step: string, data: any) => Promise<boolean>;
}) => {
    const { nextStep } = useStepper();

    const refForm = useRef<IBaseFormRef>(null);
    const refFormNewProduct = useRef<IBaseFormRef>(null);

    const { t } = useTranslation();

    const [openProduct, setOpenProduct] = useState(false);
    const [stateQuestions, setQuestions] = useState<any[]>([]);
    const [searchProduct, setSearchProduct] = useState("");
    const [stateProducts, setProducts] = useState<any[]>([]);
    const [stateOpenNewProduct, setOpenNewProduct] = useState(false);

    async function onSubmit(data: any) {
        if (await onValid("second", data)) nextStep();
    }

    async function onSubmitNewProduct(data: any) {
        setOpenNewProduct(false);
        nextStep();
    }

    const getItemsProducts = useCallback(async () => {
        const { success, data } = await getApi({
            url: "/quotations/products",
            config: {
                params: {
                    skip: 0,
                    limit: 100,
                },
            },
        });
        if (success) setProducts(data.rows);
    }, [searchProduct]);

    const getQuestions = useCallback(async (id: string) => {
        const { success, data } = await getApi({
            url: "/quotations/questions",
            config: {
                params: {
                    gameId: id,
                },
            },
        });
        if (success) setQuestions(data.rows);
    }, []);

    const debounceSearch = useDebounce(searchProduct, 500);

    useEffect(() => {
        getItemsProducts();
    }, [debounceSearch]);

    useEffect(() => {
        if (openProduct) getItemsProducts();
    }, [openProduct]);

    return (
        <>
            <div
                className={cn(
                    "w-full",
                    "max-w-md",
                    "flex",
                    "flex-col",
                    "gap-2"
                )}
            >
                <p className={cn("text-lg", "font-semibold")}>
                    Qual item usado você gostaria de nos vender?
                </p>

                <BaseForm
                    ref={refForm}
                    onSubmit={onSubmit}
                    defaultValues={{
                        quantity: 1,
                    }}
                >
                    <FormField
                        name="product"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Produto</FormLabel>
                                <Popover
                                    open={openProduct}
                                    onOpenChange={setOpenProduct}
                                >
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full",
                                                    "justify-between",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? stateProducts.find(
                                                          (product) =>
                                                              product.id ==
                                                              field.value
                                                      )?.name
                                                    : "Seleciona o produto"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Command>
                                            <Input
                                                placeholder="Buscar produto..."
                                                value={searchProduct}
                                                onChange={(e) =>
                                                    setSearchProduct(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    Produto não localizado.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {stateProducts.map(
                                                        (product) => (
                                                            <CommandItem
                                                                value={
                                                                    product.id
                                                                }
                                                                key={product.id}
                                                                onSelect={() => {
                                                                    refForm.current?.setValue(
                                                                        "product",
                                                                        product.id
                                                                    );
                                                                    setOpenProduct(
                                                                        false
                                                                    );
                                                                    getQuestions(
                                                                        product.id
                                                                    );
                                                                }}
                                                                className={cn(
                                                                    "flex",
                                                                    "gap-2"
                                                                )}
                                                            >
                                                                <Avatar>
                                                                    <AvatarImage
                                                                        asChild
                                                                        src={`http://localhost:4000${product.images?.image}`}
                                                                    >
                                                                        <img
                                                                            src={`http://localhost:4000${product.images?.image}`}
                                                                            alt={
                                                                                product?.name
                                                                            }
                                                                            width={
                                                                                40
                                                                            }
                                                                            height={
                                                                                40
                                                                            }
                                                                        />
                                                                    </AvatarImage>
                                                                    <AvatarFallback>
                                                                        {product?.name?.substring(
                                                                            0,
                                                                            2
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                {product?.name}
                                                            </CommandItem>
                                                        )
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {stateQuestions.length ? (
                        <>
                            <div
                                className={cn(
                                    "flex",
                                    "justify-between",
                                    "py-2",
                                    "gap-3"
                                )}
                            >
                                <img
                                    src={`http://localhost:4000${
                                        stateProducts.find(
                                            (product) =>
                                                product.id ==
                                                refForm.current?.watch(
                                                    "product"
                                                )
                                        )?.images?.image
                                    }`}
                                    height={150}
                                    width={100}
                                    className={cn("h-20", "object-contain")}
                                />
                                <div
                                    className={cn(
                                        "flex",
                                        "flex-1",
                                        "items-start",
                                        "flex-col",
                                        "gap-2"
                                    )}
                                >
                                    <span className="font-semibold">
                                        {
                                            stateProducts.find(
                                                (product) =>
                                                    product.id ==
                                                    refForm.current?.watch(
                                                        "product"
                                                    )
                                            )?.name
                                        }
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <FInputLabel
                                            label="Quantidade de itens"
                                            type="number"
                                            name="quantity"
                                            rules={{
                                                min: 1,
                                                max: 100,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <FormField
                                name="condition"
                                rules={{
                                    required:
                                        "É necessário selecionar uma opção",
                                }}
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>
                                            Condição do produto
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                {stateQuestions.map(
                                                    (question) => (
                                                        <FormItem
                                                            key={question.id}
                                                            className={cn(
                                                                "flex",
                                                                "items-center",
                                                                "space-x-3",
                                                                "space-y-0"
                                                            )}
                                                        >
                                                            <FormControl>
                                                                <RadioGroupItem
                                                                    value={
                                                                        question
                                                                            .questionId
                                                                            ?.id
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {
                                                                    question
                                                                        .questionId
                                                                        ?.question
                                                                }
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                )}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="comments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comentários</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder=""
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="image"
                                render={({ field }) => {
                                    return (
                                        <div
                                            className={cn(
                                                "flex",
                                                "flex-col",
                                                "space-y-2",
                                                field.value?.url
                                                    ? "col-span-2"
                                                    : "col-span-3"
                                            )}
                                        >
                                            <label
                                                className={cn(
                                                    "text-sm",
                                                    "font-medium",
                                                    "leading-none",
                                                    "peer-disabled:cursor-not-allowed",
                                                    "peer-disabled:opacity-70"
                                                )}
                                            >
                                                {t("image")}
                                            </label>
                                            <Dropzone
                                                onChange={field.onChange}
                                            />
                                        </div>
                                    );
                                }}
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    <Footer />
                </BaseForm>

                <Button
                    type="button"
                    variant="link"
                    onClick={() => setOpenNewProduct(true)}
                >
                    Não achou o que procura? Cadastre o produto
                </Button>
            </div>

            <Dialog
                open={stateOpenNewProduct}
                onOpenChange={setOpenNewProduct}
                modal
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{t("newProduct")}</DialogTitle>
                        <DialogDescription>
                            Informe os dados do produto
                        </DialogDescription>
                    </DialogHeader>
                    <BaseForm
                        ref={refFormNewProduct}
                        onSubmit={onSubmitNewProduct}
                    >
                        <div
                            className={cn(
                                "grid",
                                "grid-cols-3",
                                "gap-2",
                                "w-full"
                            )}
                        >
                            <FInputLabel
                                label="Tipo"
                                name="type"
                                placeholder="console, jogo, voltante, etc..."
                            />
                            <FInputLabel
                                label="Nome"
                                name="name"
                                className="col-span-2"
                            />
                            <FInputLabel
                                label="Região"
                                name="region"
                                className="col-span-2"
                            />
                            <FInputLabel
                                label="Quantidade de itens"
                                type="number"
                                name="quantity"
                                rules={{
                                    min: 1,
                                    max: 100,
                                }}
                            />
                            <FormField
                                name="comments"
                                render={({ field }) => (
                                    <FormItem className="col-span-3">
                                        <FormLabel>Comentários</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder=""
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="image"
                                render={({ field }) => {
                                    return (
                                        <div
                                            className={cn(
                                                "flex",
                                                "flex-col",
                                                "space-y-2",
                                                field.value?.url
                                                    ? "col-span-2"
                                                    : "col-span-3"
                                            )}
                                        >
                                            <label
                                                className={cn(
                                                    "text-sm",
                                                    "font-medium",
                                                    "leading-none",
                                                    "peer-disabled:cursor-not-allowed",
                                                    "peer-disabled:opacity-70"
                                                )}
                                            >
                                                {t("image")}
                                            </label>
                                            <Dropzone
                                                onChange={field.onChange}
                                            />
                                        </div>
                                    );
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                onClick={() => setOpenNewProduct(false)}
                                variant="outline"
                            >
                                {t("cancel")}
                            </Button>
                            <FButtonSubmit label="Adicionar" />
                        </DialogFooter>
                    </BaseForm>
                </DialogContent>
            </Dialog>
        </>
    );
};

const TerceiraEtapa = ({
    fields,
    onValid,
}: {
    fields: any;
    onValid: (step: string, data: any) => Promise<boolean>;
}) => {
    const { nextStep, prevStep } = useStepper();
    const [params] = useSearchParams();

    const [stateFields, setFields] = useState(fields);
    const [loading, setLoading] = useState(false);

    const refForm = useRef<IBaseFormRef>(null);

    async function onSubmit(data: any) {
        if (await onValid("three", data)) nextStep();
    }

    const handleDelete = useCallback(
        async (id: string) => {
            setLoading(true);
            const { success } = await deleteApi({
                url: `/quotations/search/${id}?idForm=${params.get("id")}`,
            });
            if (success) {
                const { success: successForm, data } = await getApi({
                    url: `/quotation/${params.get("id")}`,
                    disableMessage: true,
                });
                if (successForm) {
                    const quotationProducts = formatQuotations(data);
                    setFields(quotationProducts);
                }
            }
            setLoading(false);
        },
        [params]
    );

    return (
        <div
            className={cn(
                "w-full",
                "max-w-md",
                "flex",
                "flex-col",
                "gap-2",
                "overflow-hidden"
            )}
        >
            <p className={cn("text-lg", "font-semibold")}>
                Quase tudo pronto! Agora só falta conferir se todas as
                informações estão corretas!
            </p>
            {loading ? (
                <Skeleton className="w-full h-32" />
            ) : (
                <BaseForm ref={refForm} onSubmit={onSubmit}>
                    <ScrollArea
                        className={cn("bg-slate-200", "p-2", "rounded-lg")}
                    >
                        {stateFields?.map((field: any) => {
                            return (
                                <div
                                    key={field.id}
                                    className={cn(
                                        "flex",
                                        "flex-col",
                                        "gap-2",
                                        "px-3",
                                        "py-4",
                                        "bg-white",
                                        "rounded-lg",
                                        "mb-2"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex",
                                            "justify-between",
                                            "pb-2",
                                            "gap-1",
                                            "relative"
                                        )}
                                    >
                                        <img
                                            src={`http://localhost:4000${field?.product?.image}`}
                                            height={100}
                                            width={100}
                                            className={cn(
                                                "h-20",
                                                "object-contain"
                                            )}
                                        />
                                        <div
                                            className={cn(
                                                "flex",
                                                "flex-1",
                                                "items-start",
                                                "flex-col",
                                                "gap-2"
                                            )}
                                        >
                                            <span className="font-semibold">
                                                {field?.product?.name}
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <Label>
                                                    Quantidade de itens
                                                </Label>
                                                <Input
                                                    name="quantity"
                                                    value={field?.quantity}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            className="absolute top-0 right-0"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(field.id)
                                            }
                                        >
                                            <TrashIcon />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold">
                                            Condições do produto:
                                        </span>
                                        <p>{field?.question?.question}</p>
                                    </div>
                                    <div
                                        className={cn(
                                            "flex",
                                            "w-full",
                                            "justify-between"
                                        )}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold">
                                                Comentários:
                                            </span>
                                            <p>{field?.comments}</p>
                                        </div>
                                        <img
                                            src={`http://localhost:4000${field?.product?.image}`}
                                            height={50}
                                            width={50}
                                            className={cn(
                                                "h-10",
                                                "object-contain"
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </ScrollArea>
                    <Button
                        type="button"
                        onClick={prevStep}
                        variant="secondary"
                    >
                        Adicionar produto
                    </Button>
                    <Footer />
                </BaseForm>
            )}
        </div>
    );
};

const QuartaEtapa = ({ fields }: { fields: any }) => {
    const [params] = useSearchParams();

    return (
        <div
            className={cn(
                "w-full",
                "max-w-md",
                "flex",
                "flex-col",
                "gap-10",
                "items-center"
            )}
        >
            <div
                className={cn(
                    "w-full",
                    "max-w-md",
                    "flex",
                    "flex-col",
                    "gap-2",
                    "items-center"
                )}
            >
                <span className={cn("text-lg", "font-semibold")}>
                    A sua solicitação de cotação foi concluída!
                </span>
                <div className={cn("w-full", "border", "h-auto", "rounded-lg")}>
                    <div
                        className={cn(
                            "flex",
                            "w-full",
                            "p-4",
                            "items-center",
                            "justify-between",
                            "bg-yellow-500",
                            "text-white"
                        )}
                    >
                        <span>Número da cotação</span>
                        <span>#{fields?.id}</span>
                    </div>
                    <div
                        className={cn(
                            "w-full",
                            "h-auto",
                            "flex",
                            "flex-col",
                            "p-2"
                        )}
                    >
                        <div className={cn("grid", "w-full", "grid-cols-2")}>
                            <span className="font-semibold">Produto</span>
                            <span className="font-semibold text-right">
                                Quantidade
                            </span>
                            {fields?.quotationSearchId?.map((field: any) => (
                                <Fragment key={field?.gameId?.name}>
                                    <span>{field?.gameId?.name}</span>
                                    <span className="text-right">x1</span>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="text-center">
                    Hey {fields?.providerId?.name}, em breve enviaremos um
                    e-mail para {fields?.providerId?.email} com todos os
                    detalhes da sua venda! fique ligado no email
                </p>
            </div>
            <Button
                onClick={() =>
                    window.open("https://www.kantodosjogos.com.br", "_self")
                }
                className="w-full"
            >
                Voltar ao site
            </Button>
        </div>
    );
};

const PageCotacao = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();

    const [stateCotacao, setCotacao] = useState({});
    const [initialState, setInitialState] = useState(0);
    const [stateLoading, setLoading] = useState(false);
    const [stateCheckout, setCheckout] = useState({});

    const onValidNextStep = useCallback(
        async (step: string, data: any): Promise<boolean> => {
            if (step === "first") {
                const { success: successProvider, data: dataProvider } =
                    await postApi({
                        url: "/quotations/provider",
                        body: data,
                    });
                if (successProvider) {
                    const { success: successQuotation, data: dataQuotation } =
                        await postApi({
                            url: "/quotations/form",
                            body: {
                                providerId: dataProvider.id,
                            },
                        });
                    if (successQuotation) {
                        navigate(`${location.pathname}?id=${dataQuotation.id}`);
                        return true;
                    }
                }
            }
            if (step === "second") {
                const { success: successSearch, data: dataSearch } =
                    await postApi({
                        url: `/quotations/search`,
                        body: data,
                    });
                if (successSearch) {
                    const formFile = new FormData();
                    formFile.append("image", data?.image?.file);
                    await postApi({
                        url: `/quotation/search/upload/${dataSearch?.id}`,
                        body: formFile,
                        config: {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        },
                    });

                    const { success: successForm, data: dataForm } =
                        await putApi({
                            url: `/quotations/form/${params.get("id")}`,
                            body: {
                                quotationSearchId: dataSearch?.id,
                            },
                        });
                    if (successForm) {
                        const quotationProducts = formatQuotations(dataForm);
                        setCotacao(quotationProducts);
                        return true;
                    }
                }
            }
            if (step === "three") {
                const { success: successCheckout, data: dataCheckout } =
                    await postApi({
                        url: `/quotation/history/${params?.get("id")}`,
                        body: {},
                    });
                if (successCheckout) {
                    setCheckout(dataCheckout);
                    return true;
                }
            }
            return true;
        },
        [stateCotacao, stateCheckout, params]
    );

    const verifyQuotation = useCallback(async () => {
        setLoading(true);
        const paramsId = params.get("id");
        if (paramsId) {
            const { success, data } = await getApi({
                url: `/quotation/${paramsId}`,
                disableMessage: true,
            });
            if (success) {
                const quotationProducts = formatQuotations(data);
                setCotacao(quotationProducts);
                if (data?.quotationSearchId?.length) {
                    setInitialState(2);
                } else {
                    setInitialState(1);
                }
            }
        }
        setLoading(false);
    }, [params]);

    useEffect(() => {
        verifyQuotation();
    }, []);

    return (
        <div className={cn("w-screen", "h-screen", "flex")}>
            <div
                className={cn(
                    "hidden",
                    "md:flex",
                    "w-full",
                    "h-full",
                    "bg-cover",
                    "bg-no-repeat",
                    "bg-center",
                    "bg-black"
                )}
                style={{
                    backgroundImage: "url('/assets/background-login.png')",
                }}
            >
                <img
                    src="https://http2.mlstatic.com/storage/mshops-appearance-api/images/31/153113631/logo-2023070222281087800.webp"
                    width={180}
                    className={cn("fixed", "left-5", "top-5")}
                />
            </div>
            <div
                className={cn(
                    "flex",
                    "items-center",
                    "w-full",
                    "flex-col",
                    "gap-4",
                    "max-w-xl",
                    "bg-white",
                    "p-2",
                    "sm:max-w-2xl",
                    "pt-10"
                )}
            >
                {stateLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton
                            key={`skeleton-${i}`}
                            className="w-full h-16"
                        />
                    ))
                ) : (
                    <Stepper
                        variant="circle-alt"
                        initialStep={initialState}
                        steps={steps}
                        className={cn("max-w-96", "sm:max-w-xl")}
                    >
                        {steps.map((stepProps, index) => {
                            switch (index) {
                                case 0:
                                    return (
                                        <Step
                                            key={stepProps.label}
                                            {...stepProps}
                                        >
                                            <PrimeiraEtapa
                                                onValid={onValidNextStep}
                                            />
                                        </Step>
                                    );
                                case 1:
                                    return (
                                        <Step
                                            key={stepProps.label}
                                            {...stepProps}
                                        >
                                            <SegundaEtapa
                                                onValid={onValidNextStep}
                                            />
                                        </Step>
                                    );
                                case 2:
                                    return (
                                        <Step
                                            key={stepProps.label}
                                            {...stepProps}
                                        >
                                            <TerceiraEtapa
                                                onValid={onValidNextStep}
                                                fields={stateCotacao}
                                            />
                                        </Step>
                                    );
                                default:
                                    return (
                                        <Step
                                            key={stepProps.label}
                                            {...stepProps}
                                        >
                                            <QuartaEtapa
                                                fields={stateCheckout}
                                            />
                                        </Step>
                                    );
                            }
                        })}
                        <MyStepperFooter />
                    </Stepper>
                )}
            </div>
        </div>
    );
};

export { PageCotacao };
