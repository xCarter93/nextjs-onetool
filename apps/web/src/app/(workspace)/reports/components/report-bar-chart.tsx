"use client";

import React from "react";
import {
	Bar,
	BarChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
} from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface DataPoint {
	name: string;
	value: number;
	totalValue?: number;
	[key: string]: unknown;
}

interface ReportBarChartProps {
	data: DataPoint[];
	total: number;
	groupBy?: string;
	entityType: string;
}

// Glass blue color palette - variations of the primary blue
const COLORS = [
	"rgb(0, 166, 244)",      // Primary glass blue
	"rgb(56, 189, 248)",     // Lighter blue (sky-400)
	"rgb(14, 165, 233)",     // Slightly darker (sky-500)
	"rgb(2, 132, 199)",      // Medium blue (sky-600)
	"rgb(3, 105, 161)",      // Darker blue (sky-700)
	"rgb(125, 211, 252)",    // Pale blue (sky-300)
	"rgb(7, 89, 133)",       // Deep blue (sky-800)
	"rgb(186, 230, 253)",    // Very light blue (sky-200)
];

export function ReportBarChart({
	data,
	total,
	groupBy,
	entityType,
}: ReportBarChartProps) {
	// Build chart config dynamically
	const chartConfig: ChartConfig = data.reduce((acc, item, index) => {
		acc[item.name] = {
			label: item.name,
			color: COLORS[index % COLORS.length],
		};
		return acc;
	}, {} as ChartConfig);

	chartConfig.value = {
		label: "Count",
		color: COLORS[0],
	};

	const formatValue = (value: number) => {
		// If the total looks like a monetary value, format as currency
		if (entityType === "invoices" || entityType === "quotes") {
			if (total > 1000) {
				return new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
					notation: "compact",
					maximumFractionDigits: 1,
				}).format(value);
			}
		}
		return value.toString();
	};

	return (
		<div className="space-y-4">
			{/* Summary stats */}
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">
					{data.length} categories
				</span>
				<span className="font-medium text-foreground">
					Total: {formatValue(data.reduce((sum, d) => sum + d.value, 0))}
				</span>
			</div>

			{/* Chart */}
			<ChartContainer config={chartConfig} className="min-h-[300px] w-full">
				<BarChart
					data={data}
					layout="vertical"
					margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="var(--border)" />
					<XAxis
						type="number"
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
						tickFormatter={(value) => formatValue(value)}
					/>
					<YAxis
						type="category"
						dataKey="name"
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
						width={75}
					/>
					<ChartTooltip
						cursor={{ fill: "var(--muted)", opacity: 0.2 }}
						content={<ChartTooltipContent />}
					/>
					<Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={40}>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Bar>
				</BarChart>
			</ChartContainer>

			{/* Legend */}
			<div className="flex flex-wrap gap-3 justify-center pt-2">
				{data.map((item, index) => (
					<div key={item.name} className="flex items-center gap-1.5 text-xs">
						<div
							className="w-2.5 h-2.5 rounded-sm"
							style={{ backgroundColor: COLORS[index % COLORS.length] }}
						/>
						<span className="text-muted-foreground">{item.name}</span>
						<span className="font-medium text-foreground">({item.value})</span>
					</div>
				))}
			</div>
		</div>
	);
}

