"use client";

import React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Sector } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface DataPoint {
	name: string;
	value: number;
	[key: string]: unknown;
}

interface ReportPieChartProps {
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

export function ReportPieChart({
	data,
	total,
	groupBy,
	entityType,
}: ReportPieChartProps) {
	const [activeIndex, setActiveIndex] = React.useState<number | undefined>();

	// Build chart config dynamically
	const chartConfig: ChartConfig = data.reduce((acc, item, index) => {
		acc[item.name] = {
			label: item.name,
			color: COLORS[index % COLORS.length],
		};
		return acc;
	}, {} as ChartConfig);

	const totalCount = data.reduce((sum, d) => sum + d.value, 0);

	const formatValue = (value: number) => {
		if (entityType === "invoices" || entityType === "quotes") {
			if (value > 1000) {
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

	const onPieEnter = (_: unknown, index: number) => {
		setActiveIndex(index);
	};

	const onPieLeave = () => {
		setActiveIndex(undefined);
	};

	const renderActiveShape = (props: any) => {
		const {
			cx,
			cy,
			innerRadius,
			outerRadius,
			startAngle,
			endAngle,
			fill,
			payload,
			percent,
		} = props;

		return (
			<g>
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={innerRadius}
					outerRadius={outerRadius + 8}
					startAngle={startAngle}
					endAngle={endAngle}
					fill={fill}
				/>
				<text
					x={cx}
					y={cy - 10}
					textAnchor="middle"
					fill="hsl(var(--foreground))"
					className="text-sm font-medium"
				>
					{payload.name}
				</text>
				<text
					x={cx}
					y={cy + 10}
					textAnchor="middle"
					fill="hsl(var(--muted-foreground))"
					className="text-xs"
				>
					{`${(percent * 100).toFixed(1)}%`}
				</text>
			</g>
		);
	};

	return (
		<div className="space-y-4">
			{/* Summary stats */}
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">
					{data.length} categories
				</span>
				<span className="font-medium text-foreground">
					Total: {totalCount}
				</span>
			</div>

			{/* Chart */}
			<ChartContainer config={chartConfig} className="min-h-[300px] w-full">
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={100}
						paddingAngle={2}
						dataKey="value"
						nameKey="name"
						activeIndex={activeIndex}
						activeShape={renderActiveShape}
						onMouseEnter={onPieEnter}
						onMouseLeave={onPieLeave}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
								stroke="var(--background)"
								strokeWidth={2}
							/>
						))}
					</Pie>
					<ChartTooltip
						content={<ChartTooltipContent hideLabel />}
					/>
				</PieChart>
			</ChartContainer>

			{/* Legend */}
			<div className="grid grid-cols-2 gap-2 pt-2">
				{data.map((item, index) => {
					const percentage = totalCount > 0 
						? ((item.value / totalCount) * 100).toFixed(1)
						: 0;
					
					return (
						<div
							key={item.name}
							className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
							onMouseEnter={() => setActiveIndex(index)}
							onMouseLeave={() => setActiveIndex(undefined)}
						>
							<div
								className="w-3 h-3 rounded-sm flex-shrink-0"
								style={{ backgroundColor: COLORS[index % COLORS.length] }}
							/>
							<div className="flex-1 min-w-0">
								<div className="font-medium text-foreground truncate">
									{item.name}
								</div>
								<div className="text-xs text-muted-foreground">
									{item.value} ({percentage}%)
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

