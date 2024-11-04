"use client";

import {
    BaseForm,
    FInputDatePickerRange,
    IBaseFormRef,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useRef } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Line,
    LineChart,
    Pie,
    PieChart,
    XAxis,
    YAxis,
} from "recharts";

const chartDataVendas = [
    { month: "January", total: 20250, contagem: 40 },
    { month: "February", total: 35602, contagem: 90 },
    { month: "March", total: 26803, contagem: 50 },
    { month: "April", total: 48005, contagem: 120 },
    { month: "May", total: 37320, contagem: 102 },
    { month: "June", total: 56804, contagem: 139 },
];

const chartConfigVendas = {
    total: {
        label: "Total",
        color: "hsl(var(--chart-1))",
    },
    contagem: {
        label: "Contagem",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const chartDataMercados = [
    { type: "ml", visitors: 275, fill: "var(--color-ml)" },
    { type: "shops", visitors: 200, fill: "var(--color-shops)" },
];
const chartConfigMercados = {
    visitors: {
        label: "Visitors",
    },
    ml: {
        label: "Mercado Livre",
        color: "hsl(var(--chart-1))",
    },
    shops: {
        label: "Mercado Shops",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const chartDataStatus = [
    { status: "Processamento", items: 186 },
    { status: "Conserto", items: 305 },
    { status: "Recebimento", items: 237 },
    { status: "Estoque", items: 73 },
    { status: "Testando", items: 209 },
];
const chartConfigStatus = {
    items: {
        label: "Itens",
        color: "hsl(var(--chart-1))",
    },
    label: {
        color: "hsl(var(--background))",
    },
} satisfies ChartConfig;

export function ChartVendas() {
    const refFormFilter = useRef<IBaseFormRef>(null);

    return (
        <Tabs defaultValue="vendas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vendas">Vendas</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>
            <TabsContent value="vendas">
                <Card className="w-full">
                    <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                            <CardTitle>Análise de vendas</CardTitle>
                            <CardDescription className="max-w-[250px]">
                                <BaseForm
                                    ref={refFormFilter}
                                    onSubmit={(e) => console.warn(e)}
                                    defaultValues={{
                                        date: {
                                            from: "Wed Jul 03 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)",
                                            to: "Tue Aug 06 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)",
                                        },
                                    }}
                                >
                                    <FInputDatePickerRange
                                        label=""
                                        name="date"
                                    />
                                </BaseForm>
                            </CardDescription>
                        </div>
                        <div className="flex">
                            <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                                <span className="text-xs text-muted-foreground">
                                    Total(BRL)
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    R$ 235.123,51
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 w-full flex h-full">
                        <div className="h-full flex flex-col w-[70%] max-h-[50vh]">
                            <ChartContainer
                                config={chartConfigVendas}
                                style={{
                                    height: "80%",
                                    width: "100%",
                                }}
                            >
                                <LineChart
                                    className="!max-h-[45vh]"
                                    accessibilityLayer
                                    data={chartDataVendas}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid />
                                    <YAxis
                                        orientation="left"
                                        yAxisId={0}
                                        amplitude={200}
                                    />
                                    <YAxis
                                        orientation="right"
                                        tickFormatter={(value) =>
                                            `${String(value).slice(0, 2)} mil`
                                        }
                                        yAxisId={1}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) =>
                                            value.slice(0, 3)
                                        }
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent />}
                                    />
                                    <Line
                                        dataKey="total"
                                        type="monotone"
                                        stroke="var(--color-total)"
                                        strokeWidth={2}
                                        yAxisId={1}
                                    />
                                    <Line
                                        dataKey="contagem"
                                        type="monotone"
                                        stroke="var(--color-contagem)"
                                        strokeWidth={2}
                                        yAxisId={0}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </div>
                        <div className="h-full flex flex-col w-[30%] gap-6 max-h-[50vh]">
                            <div className="flex items-center justify-center gap-2 font-medium leading-none w-full text-center">
                                Porcentagem de vendas entre ML/MS
                            </div>
                            <ChartContainer
                                config={chartConfigMercados}
                                className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                                style={{
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                <PieChart>
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent hideLabel />
                                        }
                                    />
                                    <Pie
                                        data={chartDataMercados}
                                        dataKey="visitors"
                                        label
                                        nameKey="type"
                                    />
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 font-medium leading-none">
                                    Tendência de alta de 5,2% neste mês{" "}
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Mostrando o total de vendas dos últimos 6
                                    meses
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="status">
                <Card className="w-full">
                    <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                            <CardTitle>Quantidade de itens</CardTitle>
                            <CardDescription className="max-w-[250px]">
                                <BaseForm
                                    ref={refFormFilter}
                                    onSubmit={(e) => console.warn(e)}
                                    defaultValues={{
                                        date: {
                                            from: "Wed Jul 08 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)",
                                            to: "Tue Aug 06 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)",
                                        },
                                    }}
                                >
                                    <FInputDatePickerRange
                                        label=""
                                        name="date"
                                    />
                                </BaseForm>
                            </CardDescription>
                        </div>
                        <div className="flex">
                            <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                                <span className="text-xs text-muted-foreground">
                                    Total
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    1.201
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 w-full flex h-full">
                        <div className="h-full flex flex-col w-[70%]">
                            <ChartContainer config={chartConfigStatus}>
                                <BarChart
                                    accessibilityLayer
                                    data={chartDataStatus}
                                    layout="vertical"
                                    margin={{
                                        right: 16,
                                    }}
                                    className="!max-h-[45vh]"
                                >
                                    <CartesianGrid horizontal={false} />
                                    <YAxis
                                        dataKey="status"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        hide
                                    />
                                    <XAxis dataKey="items" type="number" hide />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent indicator="line" />
                                        }
                                    />
                                    <Bar
                                        dataKey="items"
                                        layout="vertical"
                                        fill="var(--color-items)"
                                        radius={4}
                                    >
                                        <LabelList
                                            dataKey="status"
                                            position="insideLeft"
                                            offset={8}
                                            className="fill-[--color-label]"
                                            fontSize={12}
                                        />
                                        <LabelList
                                            dataKey="items"
                                            position="right"
                                            offset={8}
                                            className="fill-foreground"
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 font-medium leading-none">
                                    Aumento de itens no estoque de 20,2% neste
                                    mês <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Mostrando o total de itens dos últimos 6
                                    meses
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
