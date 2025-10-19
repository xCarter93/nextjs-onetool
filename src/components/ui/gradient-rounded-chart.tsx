"use client";

import * as React from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	XAxis,
	YAxis,
	ReferenceLine,
} from "recharts";

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
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

// Default chart data for the original example
const defaultChartData = [
	{ month: "January", desktop: 342, mobile: 245 },
	{ month: "February", desktop: 876, mobile: 654 },
	{ month: "March", desktop: 512, mobile: 387 },
	{ month: "April", desktop: 629, mobile: 521 },
	{ month: "May", desktop: 458, mobile: 412 },
	{ month: "June", desktop: 781, mobile: 598 },
	{ month: "July", desktop: 394, mobile: 312 },
	{ month: "August", desktop: 925, mobile: 743 },
	{ month: "September", desktop: 647, mobile: 489 },
	{ month: "October", desktop: 532, mobile: 476 },
	{ month: "November", desktop: 803, mobile: 687 },
	{ month: "December", desktop: 271, mobile: 198 },
];

const defaultChartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1)",
	},
	mobile: {
		label: "Mobile",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

// Types for the new flexible component
export interface ChartDataPoint {
	[key: string]: string | number;
}

export interface ChartComponentProps {
	data?: ChartDataPoint[];
	config?: ChartConfig;
	title?: string;
	description?: string;
	badge?: {
		text: string;
		type: "increase" | "decrease" | "neutral";
		color?: "red" | "green" | "gray";
	};
	xAxisKey?: string;
	dataKeys?: string[];
	height?: number;
	showCard?: boolean;
	className?: string;
	chartId?: string; // For unique gradient IDs
	referenceLineValue?: number; // Value for the reference line
	referenceLineLabel?: string; // Label for the reference line
	referenceLineColor?: string; // Color for the reference line (CSS color value)
}

export function GradientRoundedAreaChart({
	data = defaultChartData,
	config = defaultChartConfig,
	title = "Rounded Area Chart",
	description = "Showing total visitors for the last 6 months",
	badge,
	xAxisKey = "month",
	dataKeys,
	height = 300,
	showCard = true,
	className = "",
	chartId = "default",
	referenceLineValue,
	referenceLineLabel,
	referenceLineColor = "hsl(142.1 76.2% 36.3%)", // Default green
}: ChartComponentProps) {
	// Auto-detect data keys if not provided
	const detectedDataKeys = dataKeys || Object.keys(config);

	// Calculate Y-axis domain to include reference line
	const yAxisDomain = React.useMemo((): [number, number] | undefined => {
		if (!referenceLineValue) return undefined;

		// Find max value in data
		const dataMax = data.reduce((max, item) => {
			const values = detectedDataKeys.map((key) => Number(item[key]) || 0);
			const itemMax = Math.max(...values);
			return Math.max(max, itemMax);
		}, 0);

		// Set domain to include both data and reference line
		const maxValue = Math.max(dataMax, referenceLineValue);
		return [0, maxValue * 1.1]; // Add 10% padding
	}, [data, detectedDataKeys, referenceLineValue]);

	// Generate badge icon based on type
	const getBadgeIcon = (type: "increase" | "decrease" | "neutral") => {
		switch (type) {
			case "increase":
				return <TrendingUp className="h-4 w-4" />;
			case "decrease":
				return <TrendingDown className="h-4 w-4" />;
			default:
				return <Minus className="h-4 w-4" />;
		}
	};

	// Generate badge color classes
	const getBadgeClasses = (
		type: "increase" | "decrease" | "neutral",
		color?: string
	) => {
		if (color) {
			switch (color) {
				case "red":
					return "text-red-500 bg-red-500/10 border-none";
				case "green":
					return "text-green-500 bg-green-500/10 border-none";
				default:
					return "text-gray-500 bg-gray-500/10 border-none";
			}
		}

		switch (type) {
			case "increase":
				return "text-green-500 bg-green-500/10 border-none";
			case "decrease":
				return "text-red-500 bg-red-500/10 border-none";
			default:
				return "text-gray-500 bg-gray-500/10 border-none";
		}
	};

	const chartContent = (
		<ChartContainer
			config={config}
			className={`h-[${height}px] ${className} [&_.recharts-cartesian-axis-tick_text]:fill-current`}
		>
			<AreaChart accessibilityLayer data={data}>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey={xAxisKey}
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tick={{ fontSize: 12 }}
					tickFormatter={(value) => {
						// If it's a date string, format it nicely
						if (typeof value === "string" && value.includes("-")) {
							// Parse date more carefully to avoid timezone issues
							const [year, month, day] = value.split("-").map(Number);
							const date = new Date(year, month - 1, day);
							return date.getDate().toString();
						}
						// Otherwise, slice to first 3 characters
						return value.toString().slice(0, 3);
					}}
				/>
				<YAxis
					domain={yAxisDomain}
					tickLine={false}
					axisLine={false}
					width={0}
					hide
				/>
				<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
				{referenceLineValue !== undefined && (
					<ReferenceLine
						y={referenceLineValue}
						stroke={referenceLineColor}
						strokeDasharray="5 5"
						strokeWidth={2}
						ifOverflow="extendDomain"
						label={{
							value: referenceLineLabel || `Target: ${referenceLineValue}`,
							position: "insideTopRight",
							fill: referenceLineColor,
							fontSize: 12,
							fontWeight: 600,
						}}
					/>
				)}
				<defs>
					{detectedDataKeys.map((key) => (
						<linearGradient
							key={key}
							id={`gradient-${chartId}-${key}`}
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset="5%"
								stopColor={`var(--color-${key})`}
								stopOpacity={0.5}
							/>
							<stop
								offset="95%"
								stopColor={`var(--color-${key})`}
								stopOpacity={0.1}
							/>
						</linearGradient>
					))}
				</defs>
				{detectedDataKeys.map((key, index) => (
					<Area
						key={key}
						dataKey={key}
						type="natural"
						fill={`url(#gradient-${chartId}-${key})`}
						fillOpacity={0.4}
						stroke={`var(--color-${key})`}
						stackId={detectedDataKeys.length > 1 ? "a" : undefined}
						strokeWidth={0.8}
						strokeDasharray={index === 0 ? "3 3" : "3 3"}
					/>
				))}
			</AreaChart>
		</ChartContainer>
	);

	if (!showCard) {
		return chartContent;
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>
					{title}
					{badge && (
						<Badge
							variant="outline"
							className={`ml-2 ${getBadgeClasses(badge.type, badge.color)}`}
						>
							{getBadgeIcon(badge.type)}
							<span>{badge.text}</span>
						</Badge>
					)}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>{chartContent}</CardContent>
		</Card>
	);
}
