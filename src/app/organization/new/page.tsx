"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SidebarWithHeader } from "@/components/sidebar-with-header";
import ProgressBar, { ProgressStep } from "@/components/progress-bar";
import SelectService from "@/components/choice-set";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Building2, Globe, Upload, Check } from "lucide-react";

interface FormData {
	name: string;
	email: string;
	companyName: string;
	companyWebsite: string;
	companyLogo: File | null;
	companySize: string;
}

export default function OrganizationOnboarding() {
	const { user } = useUser();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<FormData>({
		name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
		email: user?.primaryEmailAddress?.emailAddress || "",
		companyName: "",
		companyWebsite: "",
		companyLogo: null,
		companySize: "",
	});

	const progressSteps: ProgressStep[] = [
		{
			id: "1",
			name: "Confirm Details",
			description: "Verify your personal information",
			status:
				currentStep === 1
					? "current"
					: currentStep > 1
						? "complete"
						: "upcoming",
		},
		{
			id: "2",
			name: "Business Details",
			description: "Tell us about your company",
			status:
				currentStep === 2
					? "current"
					: currentStep > 2
						? "complete"
						: "upcoming",
		},
		{
			id: "3",
			name: "Company Size",
			description: "Help us understand your team",
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
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleCreateOrganization = () => {
		// Basic validation
		if (
			!formData.companyName.trim() ||
			!formData.companyWebsite.trim() ||
			!formData.companySize
		) {
			alert(
				"Please fill in all required fields before creating your organization."
			);
			return;
		}

		// For now, just show success message
		alert(
			"Organization creation would happen here! Form data:\n" +
				JSON.stringify(formData, null, 2)
		);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFormData({ ...formData, companyLogo: file });
		}
	};

	const renderStep1 = () => (
		<div className="space-y-8">
			<div>
				<div className="flex items-center gap-3 mb-3">
					<div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
					<h2 className="text-2xl font-semibold text-foreground tracking-tight">
						Confirm Your Details
					</h2>
				</div>
				<p className="text-muted-foreground ml-5 leading-relaxed">
					Please review and confirm your personal information from your account.
				</p>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Full Name
					</label>
					<Input
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="Your full name"
					/>
				</div>

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
						placeholder="your.email@company.com"
						type="email"
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
						Business Details
					</h2>
				</div>
				<p className="text-muted-foreground ml-5 leading-relaxed">
					Tell us about your company to get started.
				</p>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Company Name *
					</label>
					<Input
						value={formData.companyName}
						onChange={(e) =>
							setFormData({ ...formData, companyName: e.target.value })
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="Acme Corporation"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Company Website *
					</label>
					<Input
						value={formData.companyWebsite}
						onChange={(e) =>
							setFormData({ ...formData, companyWebsite: e.target.value })
						}
						className="w-full border-border dark:border-border bg-background dark:bg-background focus:bg-background dark:focus:bg-background transition-colors shadow-sm ring-1 ring-border/10"
						placeholder="https://www.acme.com"
						type="url"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-foreground mb-3 tracking-wide">
						Company Logo (Optional)
					</label>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2 px-6 py-3 border border-border dark:border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-all duration-200 bg-background dark:bg-background backdrop-blur-sm shadow-sm hover:shadow-md ring-1 ring-border/10">
							<Upload className="w-5 h-5 text-primary" />
							<span className="text-sm font-medium">
								{formData.companyLogo
									? formData.companyLogo.name
									: "Choose file"}
							</span>
							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
						</label>
						{formData.companyLogo && (
							<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-3 py-2 rounded-lg ring-1 ring-green-200 dark:ring-green-800 shadow-sm">
								<Check className="w-4 h-4" />
								File selected
							</div>
						)}
					</div>
					<p className="text-xs text-muted-foreground mt-2 ml-1">
						Upload a PNG, JPG, or SVG file (max 5MB)
					</p>
				</div>
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
					onClick={handleCreateOrganization}
					className="px-8 py-2.5 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
				>
					Create Organization
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

	return (
		<SidebarWithHeader>
			<div className="min-h-screen flex-1">
				{/* Enhanced Background with Gradient */}
				<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-full rounded-xl">
					{/* Subtle Pattern Overlay */}
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.1),transparent_50%)] rounded-xl" />

					<div className="relative p-8 min-h-screen flex flex-col">
						<div className="max-w-4xl mx-auto flex-1 flex flex-col py-8">
							{/* Enhanced Header */}
							<div className="mb-10">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
									<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
										Create Your Organization
									</h1>
								</div>
								<p className="text-muted-foreground ml-5 leading-relaxed">
									Set up your organization profile to get started with OneTool.
								</p>
							</div>

							{/* Enhanced Progress Bar */}
							<div className="mb-10">
								<ProgressBar steps={progressSteps} />
							</div>

							{/* Enhanced Form Content with improved contrast */}
							<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-2xl p-10 shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50 flex-shrink-0">
								{renderCurrentStep()}
							</div>
						</div>
					</div>
				</div>
			</div>
		</SidebarWithHeader>
	);
}
