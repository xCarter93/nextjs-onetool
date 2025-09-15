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

export default function RevenueGoalSetter() {
	const [isEditing, setIsEditing] = useState(false);
	const [goalValue, setGoalValue] = useState("50000"); // Default goal
	const [tempValue, setTempValue] = useState("");

	const handleEdit = () => {
		setTempValue(goalValue);
		setIsEditing(true);
	};

	const handleSave = () => {
		if (tempValue && !isNaN(parseFloat(tempValue.replace(/,/g, "")))) {
			setGoalValue(tempValue);
			setIsEditing(false);
			// TODO: Save to backend when ready
			console.log("Saving revenue goal:", tempValue);
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

	return (
		<Card className="group relative backdrop-blur-md overflow-hidden ring-1 ring-border/20 dark:ring-border/40">
			<CardContent>
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
									!tempValue || isNaN(parseFloat(tempValue.replace(/,/g, "")))
								}
							>
								<CheckIcon className="w-4 h-4 mr-1" />
								Save Goal
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
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Progress</span>
								<span className="font-medium text-emerald-600 dark:text-emerald-400">
									78% completed
								</span>
							</div>
							<div className="w-full bg-muted rounded-full h-2">
								<div
									className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
									style={{ width: "78%" }}
								/>
							</div>
							<div className="text-xs text-muted-foreground">
								{formatCurrency((parseFloat(goalValue) * 0.78).toString())} of{" "}
								{formatCurrency(goalValue)} achieved
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
