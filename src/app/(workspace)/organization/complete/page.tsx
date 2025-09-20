"use client";

import React, { useState } from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import ProgressBar, { ProgressStep } from "@/components/progress-bar";
import SelectService from "@/components/choice-set";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Building2, Globe } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";

interface FormData {
	email: string;
	website: string;
	phone: string;
	address: string;
	companySize: string;
	defaultTaxRate: number;
	defaultReminderTiming: number;
	smsEnabled: boolean;
	monthlyRevenueTarget: number;
}

export default function CompleteOrganizationMetadata() {
	const { user } = useUser();
	const { organization: clerkOrganization } = useOrganization();
	const router = useRouter();
	const completeMetadata = useMutation(api.organizations.completeMetadata);
	const organization = useQuery(api.organizations.get);
	const needsCompletion = useQuery(api.organizations.needsMetadataCompletion);

	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		email: user?.primaryEmailAddress?.emailAddress || "",
		website: "",
		phone: "",
		address: "",
		companySize: "",
		defaultTaxRate: 0,
		defaultReminderTiming: 24, // 24 hours default
		smsEnabled: false,
		monthlyRevenueTarget: 0,
	});

	// Redirect if metadata is already complete
	// Only redirect when we're sure the data has loaded (not undefined)
	React.useEffect(() => {
		if (needsCompletion === false && organization !== undefined) {
			// If needsCompletion is false and we have organization data,
			// it means the metadata is already complete
			router.push("/home");
		}
	}, [needsCompletion, organization, router]);

	const progressSteps: ProgressStep[] = [
		{
			id: "1",
			name: "Business Info",
			description: "Company details and contact information",
			status:
				currentStep === 1
					? "current"
					: currentStep > 1
						? "complete"
						: "upcoming",
		},
		{
			id: "2",
			name: "Company Size",
			description: "Help us understand your team",
			status:
				currentStep === 2
					? "current"
					: currentStep > 2
						? "complete"
						: "upcoming",
		},
		{
			id: "3",
			name: "Settings",
			description: "Default settings for your organization",
			status:
				currentStep === 3
					? "current"
					: currentStep > 3
						? "complete"
						: "upcoming",
		},
	];

	const companySizeOptions = [
		{
			icon: Users,
			text: "1-10",
			value: "1-10",
		},
		{
			icon: Building2,
			text: "10-100",
			value: "10-100",
		},
		{
			icon: Globe,
			text: "100+",
			value: "100+",
		},
	];

	const handleNext = () => {
		setError(null);
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		setError(null);
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleCompleteMetadata = async () => {
		setError(null);

		// Basic validation
		if (!formData.website.trim() || !formData.companySize) {
			setError(
				"Please fill in the required fields (website and company size)."
			);
			return;
		}

		setIsLoading(true);

		try {
			await completeMetadata({
				email: formData.email.trim() || undefined,
				website: formData.website.trim(),
				phone: formData.phone.trim() || undefined,
				address: formData.address.trim() || undefined,
				companySize: formData.companySize as "1-10" | "10-100" | "100+",
				defaultTaxRate: formData.defaultTaxRate || undefined,
				defaultReminderTiming: formData.defaultReminderTiming,
				smsEnabled: formData.smsEnabled,
				monthlyRevenueTarget: formData.monthlyRevenueTarget || undefined,
				logoUrl: clerkOrganization?.imageUrl || undefined,
			});

			router.push("/home");
		} catch (err) {
			console.error("Failed to complete organization metadata:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to save organization settings. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const renderStep1 = () => (
		<div className="space-y-8">
			<div>
				<div className="flex items-center gap-3 mb-3">
					<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
					<h2 className="text-2xl font-semibold text-foreground tracking-tight">
						Business Information
					</h2>
				</div>
				<p className="text-muted-foreground ml-5 leading-relaxed">
					Tell us more about your business to customize your experience.
				</p>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Business Email
					</label>
					<Input
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="your.business@company.com"
						type="email"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Company Website *
					</label>
					<Input
						value={formData.website}
						onChange={(e) =>
							setFormData({ ...formData, website: e.target.value })
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="https://www.yourcompany.com"
						type="url"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Phone Number
					</label>
					<Input
						value={formData.phone}
						onChange={(e) =>
							setFormData({ ...formData, phone: e.target.value })
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="+1 (555) 123-4567"
						type="tel"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Business Address
					</label>
					<Input
						value={formData.address}
						onChange={(e) =>
							setFormData({ ...formData, address: e.target.value })
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="123 Business St, City, State 12345"
					/>
				</div>
			</div>

			<div className="flex justify-end pt-6">
				<Button
					onClick={handleNext}
					className="px-8 py-2.5 shadow-lg hover:shadow-xl transition-shadow"
				>
					Next Step
				</Button>
			</div>
		</div>
	);

	const renderStep2 = () => (
		<div className="space-y-8">
			<div>
				<div className="flex items-center gap-3 mb-3">
					<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
					<h2 className="text-2xl font-semibold text-foreground tracking-tight">
						Company Size
					</h2>
				</div>
				<p className="text-muted-foreground ml-5 leading-relaxed">
					Help us understand your team size to provide the best experience.
				</p>
			</div>

			<div>
				<label className="block text-sm font-semibold text-foreground mb-6 tracking-wide">
					How many people work at your company? *
				</label>
				<SelectService
					options={companySizeOptions}
					selected={formData.companySize}
					onChange={(value) => setFormData({ ...formData, companySize: value })}
				/>
			</div>

			<div className="flex justify-between pt-6">
				<Button
					intent="secondary"
					onClick={handlePrevious}
					className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow"
				>
					Previous
				</Button>
				<Button
					onClick={handleNext}
					className="px-8 py-2.5 shadow-lg hover:shadow-xl transition-shadow"
				>
					Next Step
				</Button>
			</div>
		</div>
	);

	const renderStep3 = () => (
		<div className="space-y-8">
			<div>
				<div className="flex items-center gap-3 mb-3">
					<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
					<h2 className="text-2xl font-semibold text-foreground tracking-tight">
						Default Settings
					</h2>
				</div>
				<p className="text-muted-foreground ml-5 leading-relaxed">
					Set up default preferences for your organization.
				</p>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Default Tax Rate (%)
					</label>
					<Input
						value={formData.defaultTaxRate}
						onChange={(e) =>
							setFormData({
								...formData,
								defaultTaxRate: parseFloat(e.target.value) || 0,
							})
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="8.5"
						type="number"
						step="0.1"
						min="0"
						max="100"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Invoice Reminder Timing (hours before due)
					</label>
					<Input
						value={formData.defaultReminderTiming}
						onChange={(e) =>
							setFormData({
								...formData,
								defaultReminderTiming: parseInt(e.target.value) || 24,
							})
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="24"
						type="number"
						min="1"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Monthly Revenue Target ($)
					</label>
					<Input
						value={formData.monthlyRevenueTarget}
						onChange={(e) =>
							setFormData({
								...formData,
								monthlyRevenueTarget: parseInt(e.target.value) || 0,
							})
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="10000"
						type="number"
						min="0"
					/>
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
					<p className="text-sm text-red-800 dark:text-red-200">{error}</p>
				</div>
			)}

			<div className="flex justify-between pt-6">
				<Button
					intent="secondary"
					onClick={handlePrevious}
					isDisabled={isLoading}
					className="px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow"
				>
					Previous
				</Button>
				<Button
					onClick={handleCompleteMetadata}
					isDisabled={isLoading}
					className="px-8 py-2.5 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? "Saving..." : "Complete Setup"}
				</Button>
			</div>
		</div>
	);

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1:
				return renderStep1();
			case 2:
				return renderStep2();
			case 3:
				return renderStep3();
			default:
				return renderStep1();
		}
	};

	// Show loading state while webhook is processing organization creation
	if (needsCompletion === undefined || organization === undefined) {
		return (
			<div className="min-h-screen flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<h2 className="text-xl font-semibold text-foreground mb-2">
						Setting up your organization...
					</h2>
					<p className="text-muted-foreground">
						Please wait while we prepare your workspace.
					</p>
				</div>
			</div>
		);
	}

	// If we reach here and needsCompletion is false, redirect to home
	if (needsCompletion === false) {
		return (
			<div className="min-h-screen flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<h2 className="text-xl font-semibold text-foreground mb-2">
						Redirecting...
					</h2>
					<p className="text-muted-foreground">
						Your organization is already set up!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
			<div className="flex-1 flex flex-col py-8 max-w-4xl mx-auto w-full">
				{/* Enhanced Header */}
				<div className="mb-10">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
							Complete Your Organization Setup
						</h1>
					</div>
					<p className="text-muted-foreground ml-5 leading-relaxed">
						Welcome to {organization?.name}! Let&apos;s finish setting up your
						organization.
					</p>
				</div>

				{/* Enhanced Progress Bar */}
				<div className="mb-10">
					<ProgressBar steps={progressSteps} />
				</div>

				{/* Enhanced Form Content */}
				<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-10 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 flex-shrink-0">
					{renderCurrentStep()}
				</div>
			</div>
		</div>
	);
}
