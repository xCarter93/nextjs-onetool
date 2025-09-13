"use client";

import { OnboardingForm } from "@/components/onboarding-form";
import { StickyFormFooter } from "@/components/sticky-form-footer";

export default function NewClientPage() {
	const handleCancel = () => {
		// Navigate back or show confirmation dialog
		console.log("Cancel clicked");
	};

	const handleSave = () => {
		// Handle form submission
		console.log("Save clicked");
	};

	return (
		<div className="min-h-screen">
			{/* Add bottom padding for sticky footer */}
			<OnboardingForm
				title="New Client Onboarding"
				subtitle="Let's gather comprehensive information to establish a complete client profile with all necessary details for effective relationship management."
			/>
			<StickyFormFooter
				onCancel={handleCancel}
				onSave={handleSave}
				cancelText="Cancel"
				saveText="Create Client"
			/>
		</div>
	);
}
