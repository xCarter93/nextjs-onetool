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
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold text-foreground mb-2">
					Confirm Your Details
				</h2>
				<p className="text-muted-foreground">
					Please review and confirm your personal information from your account.
				</p>
			</div>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-foreground mb-2">
						Full Name
					</label>
					<Input
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full"
						placeholder="Your full name"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-foreground mb-2">
						Business Email
					</label>
					<Input
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						className="w-full"
						placeholder="your.email@company.com"
						type="email"
					/>
				</div>
			</div>

			<div className="flex justify-end pt-4">
				<Button onClick={handleNext} className="px-6">
					Next Step
				</Button>
			</div>
		</div>
	);

	const renderStep2 = () => (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold text-foreground mb-2">
					Business Details
				</h2>
				<p className="text-muted-foreground">
					Tell us about your company to get started.
				</p>
			</div>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-foreground mb-2">
						Company Name *
					</label>
					<Input
						value={formData.companyName}
						onChange={(e) =>
							setFormData({ ...formData, companyName: e.target.value })
						}
						className="w-full"
						placeholder="Acme Corporation"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-foreground mb-2">
						Company Website *
					</label>
					<Input
						value={formData.companyWebsite}
						onChange={(e) =>
							setFormData({ ...formData, companyWebsite: e.target.value })
						}
						className="w-full"
						placeholder="https://www.acme.com"
						type="url"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-foreground mb-2">
						Company Logo (Optional)
					</label>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
							<Upload className="w-4 h-4" />
							<span className="text-sm">
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
							<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
								<Check className="w-4 h-4" />
								File selected
							</div>
						)}
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						Upload a PNG, JPG, or SVG file (max 5MB)
					</p>
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<Button intent="secondary" onClick={handlePrevious}>
					Previous
				</Button>
				<Button onClick={handleNext} className="px-6">
					Next Step
				</Button>
			</div>
		</div>
	);

	const renderStep3 = () => (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold text-foreground mb-2">
					Company Size
				</h2>
				<p className="text-muted-foreground">
					Help us understand your team size to provide the best experience.
				</p>
			</div>

			<div>
				<label className="block text-sm font-medium text-foreground mb-4">
					How many people work at your company? *
				</label>
				<SelectService
					options={companySizeOptions}
					selected={formData.companySize}
					onChange={(value) => setFormData({ ...formData, companySize: value })}
				/>
			</div>

			<div className="flex justify-between pt-4">
				<Button intent="secondary" onClick={handlePrevious}>
					Previous
				</Button>
				<Button onClick={handleCreateOrganization} className="px-6">
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
			<div className="bg-muted min-h-screen flex-1 rounded-xl md:min-h-min p-6">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-foreground mb-2">
							Create Your Organization
						</h1>
						<p className="text-muted-foreground">
							Set up your organization profile to get started with OneTool.
						</p>
					</div>

					{/* Progress Bar */}
					<div className="mb-8">
						<ProgressBar steps={progressSteps} />
					</div>

					{/* Form Content */}
					<div className="bg-card border border-border rounded-lg p-8 shadow-sm">
						{renderCurrentStep()}
					</div>
				</div>
			</div>
		</SidebarWithHeader>
	);
}
