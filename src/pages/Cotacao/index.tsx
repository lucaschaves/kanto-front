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
    Step,
    StepItem,
    Stepper,
    Textarea,
    useStepper,
} from "@/components";
import { DataCidades } from "@/data";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib";
import { TrashIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const steps = [
    { label: "Seus dados" },
    { label: "Dados do produto" },
    { label: "Envio" },
] satisfies StepItem[];

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

const PrimeiraEtapa = ({ onValid }: { onValid: (data: any) => void }) => {
    const { nextStep } = useStepper();

    const refForm = useRef<IBaseFormRef>(null);

    const [searchCity, setSearchCity] = useState("");
    const [stateCities, setCities] = useState(
        DataCidades.filter((_, i) => i < 10)
    );

    function onSubmit(data: any) {
        onValid(data);
        nextStep();
    }

    const getItemsCities = useCallback(async () => {
        const newCities = DataCidades.filter((v) =>
            v.nome.toLowerCase()?.includes(searchCity)
        ).filter((_, i) => i < 50);
        setCities(newCities);
    }, [DataCidades, searchCity]);

    const debounceSearch = useDebounce(searchCity, 2000);

    useEffect(() => {
        getItemsCities();
    }, [debounceSearch]);

    return (
        <div className={cn("w-full", "max-w-md", "flex", "flex-col", "gap-2")}>
            <p className={cn("text-lg", "font-semibold")}>
                Para fazermos a avaliação dos seus itens, precisamos de algumas
                informações suas! Complete os campos abaixo:
            </p>

            <BaseForm
                ref={refForm}
                onSubmit={onSubmit}
                defaultValues={{
                    cidade: "4",
                    comoConhece: "google",
                    comoConheceu: "google",
                    email: "l@l.com",
                    nome: "Lucas",
                    telefone: "559",
                }}
            >
                <FInputLabel
                    label="Nome completo"
                    name="nome"
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
                />
                <FInputLabel
                    label="Telefone celular"
                    name="telefone"
                    placeholder="(__) _____ - ____"
                    className="max-w-full"
                    rules={{
                        required: "É necessário preencher o telefone",
                    }}
                />
                <FormField
                    name="cidade"
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
                                                {stateCities.map((city) => (
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
                    name="comoConheceu"
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

const questions = {
    xbox: [
        {
            id: "productOriginal",
            name: "Produto funcionando em sua embalagem original",
        },
        {
            id: "productEuropeu",
            name: "Produto funcionando, mas europeu",
        },
        {
            product: "productNot",
            name: "Produto não funciona",
        },
    ],
    play: [
        {
            id: "productOriginal",
            name: "Produto funcionando em sua embalagem original",
        },
        {
            id: "productChines",
            name: "Produto funcionando, mas chines",
        },
        {
            id: "productEuropeu",
            name: "Produto funcionando, mas europeu",
        },
        {
            product: "productNot",
            name: "Produto não funciona",
        },
    ],
};

const products = [
    {
        name: "007 - Xbox",
        id: "xbox-007",
        image: "https://m.media-amazon.com/images/I/61j4200lZLL._AC_UF1000,1000_QL80_.jpg",
    },
    {
        name: "GTA - Play 5",
        id: "play5-gta",
        image: "https://m.media-amazon.com/images/I/71rmY66nqoL._AC_UF1000,1000_QL80_.jpg",
    },
];

const SegundaEtapa = ({ onValid }: { onValid: (data: any) => void }) => {
    const { nextStep } = useStepper();

    const refForm = useRef<IBaseFormRef>(null);

    const [openProduct, setOpenProduct] = useState(false);
    const [stateQuestions, setQuestions] = useState<any[]>([]);
    const [searchProduct, setSearchProduct] = useState("");
    const [stateProducts, setProducts] = useState<any[]>([]);

    function onSubmit(data: any) {
        onValid(data);
        nextStep();
    }

    const getItemsProducts = useCallback(async () => {
        const newProducts = products
            .filter((v) => v.name.toLowerCase()?.includes(searchProduct))
            .filter((_, i) => i < 50);
        setProducts(newProducts);
    }, [products, searchProduct]);

    const getQuestions = useCallback(
        async (id: string) => {
            setQuestions(id == "xbox-007" ? questions.xbox : questions.play);
        },
        [questions]
    );

    const debounceSearch = useDebounce(searchProduct, 500);

    useEffect(() => {
        getItemsProducts();
    }, [debounceSearch]);

    return (
        <div className={cn("w-full", "max-w-md", "flex", "flex-col", "gap-2")}>
            <p className={cn("text-lg", "font-semibold")}>
                Qual item usado você gostaria de nos vender?
            </p>

            <BaseForm ref={refForm} onSubmit={onSubmit} defaultValues={{}}>
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
                                                setSearchProduct(e.target.value)
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
                                                            value={product.id}
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
                                                                    src={
                                                                        product.image
                                                                    }
                                                                >
                                                                    <img
                                                                        src={
                                                                            product.image
                                                                        }
                                                                        alt={
                                                                            product.name
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
                                                                    {
                                                                        product.name
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            {product.name}
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
                                "py-10",
                                "gap-3"
                            )}
                        >
                            <img
                                src={
                                    stateProducts.find(
                                        (product) =>
                                            product.id ==
                                            refForm.current?.watch("product")
                                    )?.image
                                }
                                height={100}
                                width={100}
                                className={cn("h-20", "object-cover")}
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
                                    <Label>Quantidade de items:</Label>
                                    <Input
                                        type="number"
                                        defaultValue={1}
                                        min={1}
                                        max={100}
                                    />
                                </div>
                            </div>
                        </div>
                        <FormField
                            name="condicao"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Condição do produto</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            {stateQuestions.map((question) => (
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
                                                            value={question.id}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {question.name}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
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
                    </>
                ) : (
                    <></>
                )}
                <Footer />
            </BaseForm>
        </div>
    );
};

const TerceiraEtapa = ({
    fields,
    onValid,
}: {
    fields: any;
    onValid: (data: any) => void;
}) => {
    const { nextStep } = useStepper();

    const refForm = useRef<IBaseFormRef>(null);

    function onSubmit(data: any) {
        onValid(data);
        nextStep();
    }

    return (
        <div className={cn("w-full", "max-w-md", "flex", "flex-col", "gap-2")}>
            <p className={cn("text-lg", "font-semibold")}>
                Quase tudo pronto! Agora só falta conferir se todas as
                informações estão corretas!
            </p>

            <BaseForm
                ref={refForm}
                onSubmit={onSubmit}
                defaultValues={{
                    ...fields,
                }}
            >
                <ScrollArea className="bg-slate-200 p-2 rounded-lg">
                    <div
                        className={cn(
                            "flex",
                            "flex-col",
                            "gap-4",
                            "px-3",
                            "py-4",
                            "bg-white",
                            "rounded-lg"
                        )}
                    >
                        <div
                            className={cn(
                                "flex",
                                "justify-between",
                                "pb-2",
                                "gap-3",
                                "relative"
                            )}
                        >
                            <img
                                src={fields?.image}
                                height={100}
                                width={100}
                                className={cn("h-20", "object-cover")}
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
                                    {fields?.name}
                                </span>
                                <div className="flex flex-col gap-1">
                                    <Label>Quantidade de items:</Label>
                                    <Input
                                        type="number"
                                        defaultValue={1}
                                        min={1}
                                        max={100}
                                    />
                                </div>
                            </div>
                            <Button
                                className="absolute top-0 right-0"
                                variant="destructive"
                            >
                                <TrashIcon />
                            </Button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">
                                Condições do produto:
                            </span>
                            <p>{fields?.condicoes}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">Comentários:</span>
                            <p>{fields?.comments}</p>
                        </div>
                    </div>
                </ScrollArea>
                <Footer />
            </BaseForm>
        </div>
    );
};

const PageCotacao = () => {
    const [dataCotacao, setCotacao] = useState({});

    const onValidNextStep = useCallback(
        (data: any) => {
            setCotacao({
                ...dataCotacao,
                ...data,
            });
        },
        [dataCotacao]
    );

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
                <Stepper
                    variant="circle-alt"
                    initialStep={0}
                    steps={steps}
                    className={cn("max-w-96", "sm:max-w-xl")}
                >
                    {steps.map((stepProps, index) => {
                        switch (index) {
                            case 0:
                                return (
                                    <Step key={stepProps.label} {...stepProps}>
                                        <PrimeiraEtapa
                                            onValid={onValidNextStep}
                                        />
                                    </Step>
                                );
                            case 1:
                                return (
                                    <Step key={stepProps.label} {...stepProps}>
                                        <SegundaEtapa
                                            onValid={onValidNextStep}
                                        />
                                    </Step>
                                );
                            default:
                                return (
                                    <Step key={stepProps.label} {...stepProps}>
                                        <TerceiraEtapa
                                            onValid={onValidNextStep}
                                            fields={{
                                                image: "https://m.media-amazon.com/images/I/71rmY66nqoL._AC_UF1000,1000_QL80_.jpg",
                                                comments: "Teste",
                                                name: "007 - Xbox",
                                                condicoes:
                                                    "Produto funcionando perfeitamente",
                                            }}
                                        />
                                    </Step>
                                );
                        }
                    })}
                    <MyStepperFooter />
                </Stepper>
            </div>
        </div>
    );
};

export { PageCotacao };
