"use client";

import { SidebarWithHeader } from "@/components/sidebar-with-header";
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
		<SidebarWithHeader>
			<div className="min-h-screen pb-20">
				{" "}
				{/* Add bottom padding for sticky footer */}
				<OnboardingForm
					title="New Client Onboarding"
					subtitle="Let's gather comprehensive information to establish a complete client profile with all necessary details for effective relationship management."
				/>
			</div>
			<StickyFormFooter
				onCancel={handleCancel}
				onSave={handleSave}
				cancelText="Cancel"
				saveText="Create Client"
			/>
		</SidebarWithHeader>
	);
}
