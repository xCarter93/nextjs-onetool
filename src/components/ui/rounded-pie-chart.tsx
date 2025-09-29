"use client";

import React from "react";
import { LabelList, Pie, PieChart } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export const description = "A pie chart with a label list";

const chartData = [
	{ browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
	{ browser: "safari", visitors: 200, fill: "var(--color-safari)" },
	{ browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
	{ browser: "edge", visitors: 173, fill: "var(--color-edge)" },
	{ browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	chrome: {
		label: "Chrome",
		color: "var(--chart-1)",
	},
	safari: {
		label: "Safari",
		color: "var(--chart-2)",
	},
	firefox: {
		label: "Firefox",
		color: "var(--chart-3)",
	},
	edge: {
		label: "Edge",
		color: "var(--chart-4)",
	},
	other: {
		label: "Other",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig;

export function RoundedPieChart() {
	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>
					Pie Chart
					<Badge
						variant="outline"
						className="text-green-500 bg-green-500/10 border-none ml-2"
					>
						<TrendingUp className="h-4 w-4" />
						<span>5.2%</span>
					</Badge>
				</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent nameKey="visitors" hideLabel />}
						/>
						<Pie
							data={chartData}
							innerRadius={30}
							dataKey="visitors"
							radius={10}
							cornerRadius={8}
							paddingAngle={4}
						>
							<LabelList
								dataKey="visitors"
								stroke="none"
								fontSize={12}
								fontWeight={500}
								fill="currentColor"
								formatter={(value: number) => value.toString()}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

// Flexible variant for reuse
export interface RoundedPieChartCoreProps {
	data: Array<Record<string, string | number>>; // expects categorical name + numeric value
	config: ChartConfig; // must contain color entries for each category and a label entry for valueKey
	nameKey?: string; // category key, default "name"
	valueKey?: string; // numeric key, default "value"
	showCard?: boolean;
	title?: string;
	description?: string;
	id?: string;
}

export function RoundedPieChartCore({
	data,
	config,
	nameKey = "name",
	valueKey = "value",
	showCard = false,
	title = "",
	description = "",
	id,
}: RoundedPieChartCoreProps) {
	const prepared = React.useMemo(() => {
		return data.map((d) => {
			const name = String(d[nameKey]);
			return {
				...d,
				fill: `var(--color-${name})`,
			} as Record<string, string | number>;
		});
	}, [data, nameKey]);

	const content = (
		<ChartContainer
			id={id}
			config={config}
			className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
		>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent nameKey={valueKey} hideLabel />}
				/>
				<Pie
					data={prepared}
					innerRadius={30}
					dataKey={valueKey}
					radius={10}
					cornerRadius={8}
					paddingAngle={4}
				>
					<LabelList
						dataKey={valueKey}
						stroke="none"
						fontSize={12}
						fontWeight={500}
						fill="currentColor"
						formatter={(value: number) => value.toString()}
					/>
				</Pie>
			</PieChart>
		</ChartContainer>
	);

	if (!showCard) return content;

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="flex-1 pb-0">{content}</CardContent>
		</Card>
	);
}
