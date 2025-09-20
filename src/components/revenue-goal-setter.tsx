"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ChartBarIcon,
	PencilIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function RevenueGoalSetter() {
	const [isEditing, setIsEditing] = useState(false);
	const [tempValue, setTempValue] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	// Get organization data and revenue goal progress
	const organization = useQuery(api.organizations.get);
	const revenueGoalProgress = useQuery(api.homeStats.getRevenueGoalProgress);
	const updateOrganization = useMutation(api.organizations.update);

	// Get current goal value from organization data
	const goalValue = organization?.monthlyRevenueTarget?.toString() || "0";

	const handleEdit = () => {
		setTempValue(goalValue);
		setIsEditing(true);
	};

	const handleSave = async () => {
		if (tempValue && !isNaN(parseFloat(tempValue.replace(/,/g, "")))) {
			setIsSaving(true);
			try {
				const numericValue = parseFloat(tempValue.replace(/,/g, ""));
				await updateOrganization({
					monthlyRevenueTarget: numericValue,
				});
				setIsEditing(false);
			} catch (error) {
				console.error("Failed to save revenue goal:", error);
				// You could add a toast notification here
			} finally {
				setIsSaving(false);
			}
		}
	};

	const handleCancel = () => {
		setTempValue("");
		setIsEditing(false);
	};

	const formatCurrency = (value: string) => {
		const num = parseFloat(value.replace(/,/g, ""));
		if (isNaN(num)) return "$0";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(num);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, "");
		setTempValue(value);
	};

	// Show loading state while data is being fetched
	if (organization === undefined || revenueGoalProgress === undefined) {
		return (
			<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
				<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
				<CardContent className="relative z-10">
					<div className="flex items-center justify-center h-32">
						<div className="text-muted-foreground">Loading revenue goal...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
			{/* Glass morphism overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent rounded-2xl" />
			<CardContent className="relative z-10">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800">
							<ChartBarIcon className="w-5 h-5" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">
								Monthly Revenue Goal
							</h3>
							<p className="text-sm text-muted-foreground">
								Set your target for this month
							</p>
						</div>
					</div>
					{!isEditing && (
						<Button
							intent="plain"
							size="sm"
							onClick={handleEdit}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							<PencilIcon className="w-4 h-4" />
						</Button>
					)}
				</div>

				{isEditing ? (
					<div className="space-y-4">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span className="text-muted-foreground sm:text-sm">$</span>
							</div>
							<Input
								type="text"
								value={tempValue}
								onChange={handleInputChange}
								placeholder="50000"
								className="pl-8 text-lg font-semibold"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") handleSave();
									if (e.key === "Escape") handleCancel();
								}}
							/>
						</div>
						<div className="flex space-x-2">
							<Button
								onClick={handleSave}
								size="sm"
								intent="primary"
								className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
								isDisabled={
									!tempValue ||
									isNaN(parseFloat(tempValue.replace(/,/g, ""))) ||
									isSaving
								}
							>
								<CheckIcon className="w-4 h-4 mr-1" />
								{isSaving ? "Saving..." : "Save Goal"}
							</Button>
							<Button
								onClick={handleCancel}
								size="sm"
								intent="outline"
								className="flex-1"
							>
								<XMarkIcon className="w-4 h-4 mr-1" />
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="text-3xl font-bold text-foreground">
									{formatCurrency(goalValue)}
								</div>
								<div className="text-sm text-muted-foreground">
									Current monthly target
								</div>
							</div>
						</div>

						{/* Progress indicator */}
						{revenueGoalProgress && (
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Progress</span>
									<span className="font-medium text-emerald-600 dark:text-emerald-400">
										{revenueGoalProgress.percentage}% completed
									</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div
										className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
										style={{
											width: `${Math.min(revenueGoalProgress.percentage, 100)}%`,
										}}
									/>
								</div>
								<div className="text-xs text-muted-foreground">
									{formatCurrency(revenueGoalProgress.current.toString())} of{" "}
									{formatCurrency(revenueGoalProgress.target.toString())}{" "}
									achieved
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
