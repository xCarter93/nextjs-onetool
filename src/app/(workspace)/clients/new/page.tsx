"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
	ClientOnboardingForm,
	ClientOnboardingFormRef,
	ClientFormData,
} from "@/components/client-onboarding-form";
import { StickyFormFooter } from "@/components/sticky-form-footer";

export default function NewClientPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [formErrors, setFormErrors] = useState<string[]>([]);
	const formRef = useRef<ClientOnboardingFormRef>(null);
	const router = useRouter();
	const createClient = useMutation(api.clients.create);
	const createContact = useMutation(api.clientContacts.create);
	const createProperty = useMutation(api.clientProperties.create);

	const handleCancel = () => {
		router.push("/clients");
	};

	const handleSave = async () => {
		if (!formRef.current) return;

		// Use the form's submit method directly
		formRef.current.submit();
	};

	const handleFormSubmit = async (formData: ClientFormData) => {
		setIsLoading(true);
		setFormErrors([]);

		try {
			// Build notes from contacts and properties
			const contactNotes = formData.contacts
				.map((contact) => {
					if (!contact.firstName.trim() && !contact.lastName.trim()) return "";

					const contactInfo = [
						`${contact.firstName} ${contact.lastName}`.trim(),
					];
					if (contact.email) contactInfo.push(`Email: ${contact.email}`);
					if (contact.phone) contactInfo.push(`Phone: ${contact.phone}`);
					if (contact.jobTitle) contactInfo.push(`Title: ${contact.jobTitle}`);
					if (contact.role) contactInfo.push(`Role: ${contact.role}`);
					if (contact.department)
						contactInfo.push(`Department: ${contact.department}`);

					return `${contact.isPrimary ? "Primary" : "Additional"} Contact: ${contactInfo.join(", ")}`;
				})
				.filter(Boolean);

			const propertyNotes = formData.properties
				.map((property) => {
					if (!property.streetAddress.trim()) return "";

					const propertyInfo = [];
					if (property.propertyName)
						propertyInfo.push(`Name: ${property.propertyName}`);
					if (property.propertyType)
						propertyInfo.push(`Type: ${property.propertyType}`);
					if (property.squareFootage)
						propertyInfo.push(`Size: ${property.squareFootage} sq ft`);
					propertyInfo.push(
						`Address: ${property.streetAddress}, ${property.city}, ${property.region} ${property.postalCode}`
					);
					if (property.propertyDescription)
						propertyInfo.push(`Description: ${property.propertyDescription}`);

					return `${property.isPrimary ? "Primary" : "Additional"} Property: ${propertyInfo.join(", ")}`;
				})
				.filter(Boolean);

			const clientData = {
				// Company Information
				companyName: formData.companyName.trim(),
				industry: formData.industry.trim() || undefined,
				companyDescription: formData.companyDescription.trim() || undefined,
				status: formData.status as
					| "lead"
					| "prospect"
					| "active"
					| "inactive"
					| "archived",
				leadSource: formData.leadSource || undefined,

				// Custom Categories
				category: formData.category || undefined,
				clientSize: formData.clientSize || undefined,
				clientType: formData.clientType || undefined,
				isActive:
					formData.isActive === "yes"
						? true
						: formData.isActive === "no"
							? false
							: undefined,
				priorityLevel: formData.priorityLevel || undefined,
				projectDimensions: formData.projectDimensions.trim() || undefined,

				// Communication preferences
				communicationPreference: formData.communicationPreference || undefined,
				emailOptIn: formData.emailOptIn,
				smsOptIn: formData.smsOptIn,

				// Services
				servicesNeeded:
					formData.servicesNeeded.length > 0
						? formData.servicesNeeded
						: undefined,

				// Metadata
				tags: formData.tags.trim()
					? formData.tags
							.split(",")
							.map((tag: string) => tag.trim())
							.filter(Boolean)
					: undefined,
				notes: [...contactNotes, ...propertyNotes].join("\n\n") || undefined,
			};

			const clientId = await createClient(clientData);

			// Create contacts
			for (const contact of formData.contacts) {
				if (contact.firstName.trim() && contact.lastName.trim()) {
					await createContact({
						clientId,
						firstName: contact.firstName.trim(),
						lastName: contact.lastName.trim(),
						email: contact.email.trim() || undefined,
						phone: contact.phone.trim() || undefined,
						jobTitle: contact.jobTitle.trim() || undefined,
						role: contact.role.trim() || undefined,
						department: contact.department.trim() || undefined,
						isPrimary: contact.isPrimary,
					});
				}
			}

			// Create properties
			for (const property of formData.properties) {
				if (property.streetAddress.trim()) {
					await createProperty({
						clientId,
						propertyName: property.propertyName.trim() || undefined,
						propertyType: property.propertyType || undefined,
						squareFootage: property.squareFootage.trim()
							? parseInt(property.squareFootage)
							: undefined,
						streetAddress: property.streetAddress.trim(),
						city: property.city.trim(),
						state: property.region.trim(),
						zipCode: property.postalCode.trim(),
						country: "United States", // Default to US, could be made configurable
						description: property.propertyDescription.trim() || undefined,
						isPrimary: property.isPrimary,
					});
				}
			}

			// Navigate to clients list on success
			router.push("/clients");
		} catch (error) {
			console.error("Failed to create client:", error);
			setFormErrors(["Failed to create client. Please try again."]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen">
			{/* Error Display */}
			{formErrors.length > 0 && (
				<div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
					<div className="text-red-800 dark:text-red-200">
						{formErrors.map((error, index) => (
							<p key={index} className="text-sm">
								{error}
							</p>
						))}
					</div>
				</div>
			)}

			{/* Form Component */}
			<ClientOnboardingForm
				title="New Client Onboarding"
				subtitle="Let's gather comprehensive information to establish a complete client profile with all necessary details for effective relationship management."
				onSubmit={handleFormSubmit}
				onCancel={handleCancel}
				isLoading={isLoading}
				ref={formRef}
			/>

			{/* Sticky Form Footer */}
			<StickyFormFooter
				onCancel={handleCancel}
				onSave={handleSave}
				cancelText="Cancel"
				saveText="Create Client"
				isLoading={isLoading}
			/>
		</div>
	);
}
