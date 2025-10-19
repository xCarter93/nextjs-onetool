"use client";

import React from "react";
import Modal from "./modal";
import { cn } from "@/lib/utils";
import {
	GradientRoundedAreaChart,
	type ChartDataPoint,
} from "@/components/ui/gradient-rounded-chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
} from "@heroicons/react/24/outline";

type ChangeType = "increase" | "decrease" | "neutral";

interface StatBadgeProps {
	change?: string;
	changeType?: ChangeType;
}

const StatBadge = ({ change, changeType }: StatBadgeProps) => {
	if (!change || !changeType) return null;
	const styles =
		changeType === "increase"
			? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
			: changeType === "decrease"
				? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
				: "bg-muted text-muted-foreground";

	const Icon =
		changeType === "increase"
			? ArrowUpIcon
			: changeType === "decrease"
				? ArrowDownIcon
				: ArrowRightIcon;

	return (
		<div
			className={cn(
				"inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
				styles
			)}
		>
			<Icon aria-hidden="true" className="mr-1 -ml-0.5 size-3 shrink-0" />
			{change}
		</div>
	);
};

interface ChartSectionProps {
	data: ChartDataPoint[];
	config: ChartConfig;
	xAxisKey?: string;
	dataKeys?: string[];
	chartId: string;
	referenceLineValue?: number;
	referenceLineLabel?: string;
	referenceLineColor?: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({
	data,
	config,
	xAxisKey = "date",
	dataKeys,
	chartId,
	referenceLineValue,
	referenceLineLabel,
	referenceLineColor,
}) => {
	return (
		<div className="mt-4">
			<GradientRoundedAreaChart
				data={data}
				config={config}
				title=""
				description=""
				xAxisKey={xAxisKey}
				dataKeys={dataKeys}
				height={220}
				showCard={false}
				chartId={chartId}
				className="w-full"
				referenceLineValue={referenceLineValue}
				referenceLineLabel={referenceLineLabel}
				referenceLineColor={referenceLineColor}
			/>
		</div>
	);
};

interface MetadataItem {
	label: string;
	value: string | number;
}

interface ChartDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	subtitle?: string;
	change?: string;
	changeType?: ChangeType;
	statSummary?: MetadataItem[]; // quick facts row
	metadata?: MetadataItem[]; // grid list
	chart: ChartSectionProps;
	secondaryTitle?: string;
	secondary?: React.ReactNode;
	sideBySide?: boolean; // layout: charts side-by-side instead of stacked
}

export const ChartDetailModal: React.FC<ChartDetailModalProps> = ({
	isOpen,
	onClose,
	title,
	subtitle,
	change,
	changeType,
	statSummary = [],
	metadata = [],
	chart,
	secondaryTitle,
	secondary,
	sideBySide = false,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			size={sideBySide ? "2xl" : "lg"}
		>
			{/* Header subtext and change badge */}
			{(subtitle || change) && (
				<div className="flex items-center justify-between mb-3">
					{subtitle ? (
						<p className="text-sm text-muted-foreground dark:text-muted-foreground/85">
							{subtitle}
						</p>
					) : (
						<span />
					)}
					<StatBadge change={change} changeType={changeType} />
				</div>
			)}

			{/* Charts */}
			{secondary && sideBySide ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
					<div>
						<ChartSection {...chart} />
					</div>
					<div>
						{secondaryTitle && (
							<h4 className="text-sm font-medium text-foreground mb-2">
								{secondaryTitle}
							</h4>
						)}
						{secondary}
					</div>
				</div>
			) : (
				<>
					<ChartSection {...chart} />
					{secondary && (
						<div className="mt-6">
							{secondaryTitle && (
								<h4 className="text-sm font-medium text-foreground mb-2">
									{secondaryTitle}
								</h4>
							)}
							{secondary}
						</div>
					)}
				</>
			)}

			{/* Quick stats row */}
			{statSummary.length > 0 && (
				<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
					{statSummary.map((s) => (
						<div
							key={s.label}
							className="rounded-md border border-border/40 dark:border-border/60 bg-muted/20 dark:bg-muted/10 px-3 py-2"
						>
							<div className="text-xs text-muted-foreground">{s.label}</div>
							<div className="text-sm font-semibold text-foreground">
								{s.value}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Metadata grid */}
			{metadata.length > 0 && (
				<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
					{metadata.map((m) => (
						<div
							key={m.label}
							className="flex items-center justify-between rounded-md bg-transparent px-1 py-1"
						>
							<span className="text-xs text-muted-foreground">{m.label}</span>
							<span className="text-sm font-medium text-foreground">
								{m.value}
							</span>
						</div>
					))}
				</div>
			)}
		</Modal>
	);
};

export default ChartDetailModal;
