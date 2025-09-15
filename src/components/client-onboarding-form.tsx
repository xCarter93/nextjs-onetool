"use client";

import React, {
	useState,
	useCallback,
	forwardRef,
	useImperativeHandle,
} from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Accordion from "./ui/accordion";
import { useToastOperations } from "@/hooks/use-toast";

export interface ClientFormData {
	// Company Information
	companyName: string;
	industry: string;
	companyDescription: string;
	status: "lead" | "prospect" | "active" | "inactive" | "archived" | "";
	leadSource:
		| "word-of-mouth"
		| "website"
		| "social-media"
		| "referral"
		| "advertising"
		| "trade-show"
		| "cold-outreach"
		| "other"
		| "";

	// Contacts (structured for multiple contacts)
	contacts: Array<{
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		jobTitle: string;
		role: string;
		department: string;
		isPrimary: boolean;
	}>;

	// Properties (structured for multiple properties)
	properties: Array<{
		id: string;
		propertyName: string;
		propertyType:
			| "residential"
			| "commercial"
			| "industrial"
			| "retail"
			| "office"
			| "mixed-use"
			| "";
		squareFootage: string;
		streetAddress: string;
		city: string;
		region: string;
		postalCode: string;
		propertyDescription: string;
		isPrimary: boolean;
	}>;

	// Custom Categories
	category:
		| "design"
		| "development"
		| "consulting"
		| "maintenance"
		| "marketing"
		| "other"
		| "";
	clientSize: "small" | "medium" | "large" | "enterprise" | "";
	clientType:
		| "new-client"
		| "existing-client"
		| "partner"
		| "vendor"
		| "contractor"
		| "";
	isActive: "yes" | "no" | "pending" | "";
	projectDimensions: string;
	priorityLevel: "low" | "medium" | "high" | "urgent" | "";
	tags: string;

	// Service Requirements
	servicesNeeded: string[];
	communicationPreference: "email" | "phone" | "both" | "";

	// Opt-in preferences
	emailOptIn: boolean;
	smsOptIn: boolean;
}

interface ClientOnboardingFormProps {
	title?: string;
	subtitle?: string;
	onSubmit?: (data: ClientFormData) => void;
	onCancel?: () => void;
	isLoading?: boolean;
}

export interface ClientOnboardingFormRef {
	submit: () => void;
	validate: () => boolean;
	getFormData: () => ClientFormData;
}

const initialFormData: ClientFormData = {
	// Company Information
	companyName: "",
	industry: "",
	companyDescription: "",
	status: "",
	leadSource: "",

	// Contacts - start with one primary contact
	contacts: [
		{
			id: "primary",
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			jobTitle: "",
			role: "",
			department: "",
			isPrimary: true,
		},
	],

	// Properties - start with one primary property
	properties: [
		{
			id: "primary",
			propertyName: "",
			propertyType: "",
			squareFootage: "",
			streetAddress: "",
			city: "",
			region: "",
			postalCode: "",
			propertyDescription: "",
			isPrimary: true,
		},
	],

	// Custom Categories
	category: "",
	clientSize: "",
	clientType: "",
	isActive: "",
	projectDimensions: "",
	priorityLevel: "",
	tags: "",

	// Service Requirements
	servicesNeeded: [],
	communicationPreference: "",

	// Opt-in preferences
	emailOptIn: true, // Default to true for email
	smsOptIn: false,
};

// Helper functions for managing contacts and properties
const generateId = () => Math.random().toString(36).substr(2, 9);

const createEmptyContact = (isPrimary = false) => ({
	id: generateId(),
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	jobTitle: "",
	role: "",
	department: "",
	isPrimary,
});

const createEmptyProperty = (isPrimary = false) => ({
	id: generateId(),
	propertyName: "",
	propertyType: "" as const,
	squareFootage: "",
	streetAddress: "",
	city: "",
	region: "",
	postalCode: "",
	propertyDescription: "",
	isPrimary,
});

export const ClientOnboardingForm = forwardRef<
	ClientOnboardingFormRef,
	ClientOnboardingFormProps
>(
	(
		{
			title = "New Client Onboarding",
			subtitle = "Let's gather comprehensive information to establish a complete client profile with all necessary details for effective relationship management.",
			onSubmit,
		},
		ref
	) => {
		const [formData, setFormData] = useState<ClientFormData>(initialFormData);
		const [errors, setErrors] = useState<Record<string, string>>({});
		const router = useRouter();
		const createClient = useMutation(api.clients.create);
		const createContact = useMutation(api.clientContacts.create);
		const createProperty = useMutation(api.clientProperties.create);
		const toast = useToastOperations();

		// Expose form methods via ref
		useImperativeHandle(ref, () => ({
			submit: handleSubmit,
			validate: validateForm,
			getFormData: () => formData,
		}));

		const updateField = useCallback(
			(field: keyof ClientFormData, value: string | boolean | string[]) => {
				setFormData((prev) => ({ ...prev, [field]: value }));
				// Clear error when user starts typing
				if (errors[field]) {
					const newErrors = { ...errors };
					delete newErrors[field];
					setErrors(newErrors);
				}
			},
			[errors]
		);

		const handleCheckboxChange = useCallback(
			(service: string, checked: boolean) => {
				setFormData((prev) => ({
					...prev,
					servicesNeeded: checked
						? [...prev.servicesNeeded, service]
						: prev.servicesNeeded.filter((s) => s !== service),
				}));
			},
			[]
		);

		// Contact management functions
		const addContact = useCallback(() => {
			setFormData((prev) => ({
				...prev,
				contacts: [...prev.contacts, createEmptyContact(false)],
			}));
		}, []);

		const removeContact = useCallback((contactId: string) => {
			setFormData((prev) => ({
				...prev,
				contacts: prev.contacts.filter((c) => c.id !== contactId),
			}));
		}, []);

		const updateContact = useCallback(
			(contactId: string, field: string, value: string | boolean) => {
				setFormData((prev) => ({
					...prev,
					contacts: prev.contacts.map((contact) =>
						contact.id === contactId ? { ...contact, [field]: value } : contact
					),
				}));
			},
			[]
		);

		// Property management functions
		const addProperty = useCallback(() => {
			setFormData((prev) => ({
				...prev,
				properties: [...prev.properties, createEmptyProperty(false)],
			}));
		}, []);

		const updateProperty = useCallback(
			(propertyId: string, field: string, value: string | boolean) => {
				setFormData((prev) => ({
					...prev,
					properties: prev.properties.map((property) =>
						property.id === propertyId
							? { ...property, [field]: value }
							: property
					),
				}));
			},
			[]
		);

		const validateForm = (): boolean => {
			const newErrors: Record<string, string> = {};

			// Required fields
			if (!formData.companyName.trim()) {
				newErrors.companyName = "Company name is required";
			}

			if (!formData.status) {
				newErrors.status = "Client status is required";
			}

			// Validate primary contact
			const primaryContact = formData.contacts.find((c) => c.isPrimary);
			if (!primaryContact) {
				newErrors.contacts = "At least one primary contact is required";
			} else {
				if (!primaryContact.firstName.trim()) {
					newErrors.contacts = "Primary contact first name is required";
				}
				if (!primaryContact.lastName.trim()) {
					newErrors.contacts = "Primary contact last name is required";
				}
				if (!primaryContact.email.trim()) {
					newErrors.contacts = "Primary contact email is required";
				} else if (!/\S+@\S+\.\S+/.test(primaryContact.email)) {
					newErrors.contacts = "Primary contact email must be valid";
				}
			}

			// Validate primary property
			const primaryProperty = formData.properties.find((p) => p.isPrimary);
			if (!primaryProperty) {
				newErrors.properties = "At least one primary property is required";
			} else {
				if (!primaryProperty.streetAddress.trim()) {
					newErrors.properties = "Primary property street address is required";
				}
				if (!primaryProperty.city.trim()) {
					newErrors.properties = "Primary property city is required";
				}
				if (!primaryProperty.region.trim()) {
					newErrors.properties = "Primary property state/province is required";
				}
				if (!primaryProperty.postalCode.trim()) {
					newErrors.properties = "Primary property ZIP/postal code is required";
				}
			}

			setErrors(newErrors);
			return Object.keys(newErrors).length === 0;
		};

		const handleSubmit = async (e?: React.FormEvent) => {
			if (e) {
				e.preventDefault();
			}

			if (!validateForm()) {
				toast.error(
					"Validation Error",
					"Please fix the errors in the form before submitting."
				);
				return;
			}

			try {
				if (onSubmit) {
					onSubmit(formData);
				} else {
					await toast.confirmAction(
						async () => {
							const clientData = {
								// Company Information
								companyName: formData.companyName.trim(),
								industry: formData.industry.trim() || undefined,
								companyDescription:
									formData.companyDescription.trim() || undefined,
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
								projectDimensions:
									formData.projectDimensions.trim() || undefined,

								// Communication preferences
								communicationPreference:
									formData.communicationPreference || undefined,
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
											.map((tag) => tag.trim())
											.filter(Boolean)
									: undefined,
								notes: undefined,
							};

							// Create the client first
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
										description:
											property.propertyDescription.trim() || undefined,
										isPrimary: property.isPrimary,
									});
								}
							}

							router.push("/clients");
						},
						{
							loading: "Creating client profile...",
							success: `Client "${formData.companyName}" created successfully!`,
							error: "Failed to create client profile",
						}
					);
				}
			} catch (error) {
				console.error("Failed to create client:", error);
				toast.error("Error", "Failed to create client. Please try again.");
			}
		};

		// handleCancel function removed - handled by parent component

		return (
			<div className="w-full px-6">
				<div className="w-full pt-8 pb-24">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{title}
						</h1>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{subtitle}
						</p>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="space-y-12">
							{/* Company Information Section */}
							<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-200 dark:border-white/10 pb-12 md:grid-cols-3">
								<div>
									<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
										Company Information
									</h2>
									<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
										Basic information about the client company and how they
										found us.
									</p>
								</div>

								<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
									<div className="sm:col-span-4">
										<label
											htmlFor="company-name"
											className="block text-sm/6 font-medium text-gray-900 dark:text-white"
										>
											Company name *
										</label>
										<div className="mt-2">
											<input
												id="company-name"
												name="company-name"
												type="text"
												value={formData.companyName}
												onChange={(e) =>
													updateField("companyName", e.target.value)
												}
												autoComplete="organization"
												className={`block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 ${errors.companyName ? "border-red-500 outline-red-500" : ""}`}
												placeholder="e.g., ASMobbin"
											/>
											{errors.companyName && (
												<p className="mt-1 text-sm text-red-600 dark:text-red-400">
													{errors.companyName}
												</p>
											)}
										</div>
									</div>

									<div className="sm:col-span-2">
										<label
											htmlFor="client-status"
											className="block text-sm/6 font-medium text-gray-900 dark:text-white"
										>
											Client status *
										</label>
										<div className="mt-2 grid grid-cols-1">
											<select
												id="client-status"
												name="client-status"
												value={formData.status}
												onChange={(e) => updateField("status", e.target.value)}
												className={`col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800 ${errors.status ? "border-red-500 outline-red-500" : ""}`}
											>
												<option value="">Select status</option>
												<option value="lead">Lead</option>
												<option value="prospect">Prospect</option>
												<option value="active">Active</option>
												<option value="inactive">Inactive</option>
												<option value="archived">Archived</option>
											</select>
											<ChevronDownIcon
												aria-hidden="true"
												className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
											/>
											{errors.status && (
												<p className="mt-1 text-sm text-red-600 dark:text-red-400">
													{errors.status}
												</p>
											)}
										</div>
									</div>

									<div className="sm:col-span-3">
										<label
											htmlFor="lead-source"
											className="block text-sm/6 font-medium text-gray-900 dark:text-white"
										>
											Lead source
										</label>
										<div className="mt-2 grid grid-cols-1">
											<select
												id="lead-source"
												name="lead-source"
												value={formData.leadSource}
												onChange={(e) =>
													updateField("leadSource", e.target.value)
												}
												className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800"
											>
												<option value="">Select source</option>
												<option value="word-of-mouth">Word Of Mouth</option>
												<option value="website">Website</option>
												<option value="social-media">Social Media</option>
												<option value="referral">Referral</option>
												<option value="advertising">Advertising</option>
												<option value="trade-show">Trade Show</option>
												<option value="cold-outreach">Cold Outreach</option>
												<option value="other">Other</option>
											</select>
											<ChevronDownIcon
												aria-hidden="true"
												className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
											/>
										</div>
									</div>

									<div className="sm:col-span-3">
										<label
											htmlFor="industry"
											className="block text-sm/6 font-medium text-gray-900 dark:text-white"
										>
											Industry
										</label>
										<div className="mt-2">
											<input
												id="industry"
												name="industry"
												type="text"
												value={formData.industry}
												onChange={(e) =>
													updateField("industry", e.target.value)
												}
												className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
												placeholder="e.g., Technology, Healthcare, Manufacturing"
											/>
										</div>
									</div>

									<div className="col-span-full">
										<label
											htmlFor="company-description"
											className="block text-sm/6 font-medium text-gray-900 dark:text-white"
										>
											Company description
										</label>
										<div className="mt-2">
											<textarea
												id="company-description"
												name="company-description"
												rows={3}
												value={formData.companyDescription}
												onChange={(e) =>
													updateField("companyDescription", e.target.value)
												}
												className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
												placeholder="Brief description of the company and what they do..."
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Contact Details Section with Accordion */}
							<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-200 dark:border-white/10 pb-12 md:grid-cols-3">
								<div>
									<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
										Contact Details
									</h2>
									<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
										Primary contact and additional contacts for this client.
									</p>
									{errors.contacts && (
										<p className="mt-2 text-sm text-red-600 dark:text-red-400">
											{errors.contacts}
										</p>
									)}
								</div>

								<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
									<div className="col-span-full">
										<Accordion
											items={[
												{
													title: "Primary Contact (Required)",
													content: (
														<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
															{formData.contacts
																.filter((contact) => contact.isPrimary)
																.map((contact) => (
																	<React.Fragment key={contact.id}>
																		<div className="sm:col-span-3">
																			<label
																				htmlFor={`${contact.id}-first-name`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				First name *
																			</label>
																			<div className="mt-1">
																				<input
																					id={`${contact.id}-first-name`}
																					name={`${contact.id}-first-name`}
																					type="text"
																					value={contact.firstName}
																					onChange={(e) =>
																						updateContact(
																							contact.id,
																							"firstName",
																							e.target.value
																						)
																					}
																					autoComplete="given-name"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>

																		<div className="sm:col-span-3">
																			<label
																				htmlFor={`${contact.id}-last-name`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				Last name *
																			</label>
																			<div className="mt-1">
																				<input
																					id={`${contact.id}-last-name`}
																					name={`${contact.id}-last-name`}
																					type="text"
																					value={contact.lastName}
																					onChange={(e) =>
																						updateContact(
																							contact.id,
																							"lastName",
																							e.target.value
																						)
																					}
																					autoComplete="family-name"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>

																		<div className="sm:col-span-4">
																			<label
																				htmlFor={`${contact.id}-email`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				Email address *
																			</label>
																			<div className="mt-1">
																				<input
																					id={`${contact.id}-email`}
																					name={`${contact.id}-email`}
																					type="email"
																					value={contact.email}
																					onChange={(e) =>
																						updateContact(
																							contact.id,
																							"email",
																							e.target.value
																						)
																					}
																					autoComplete="email"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>

																		<div className="sm:col-span-3">
																			<label
																				htmlFor={`${contact.id}-phone`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				Phone number
																			</label>
																			<div className="mt-1">
																				<input
																					id={`${contact.id}-phone`}
																					name={`${contact.id}-phone`}
																					type="tel"
																					value={contact.phone}
																					onChange={(e) =>
																						updateContact(
																							contact.id,
																							"phone",
																							e.target.value
																						)
																					}
																					autoComplete="tel"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>

																		<div className="sm:col-span-3">
																			<label
																				htmlFor={`${contact.id}-job-title`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				Job title
																			</label>
																			<div className="mt-1">
																				<input
																					id={`${contact.id}-job-title`}
																					name={`${contact.id}-job-title`}
																					type="text"
																					value={contact.jobTitle}
																					onChange={(e) =>
																						updateContact(
																							contact.id,
																							"jobTitle",
																							e.target.value
																						)
																					}
																					autoComplete="organization-title"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>
																	</React.Fragment>
																))}
														</div>
													),
												},
												...formData.contacts
													.filter((contact) => !contact.isPrimary)
													.map((contact, index) => ({
														title: `Additional Contact #${index + 1} (Optional)`,
														content: (
															<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
																<div className="sm:col-span-3">
																	<label
																		htmlFor={`${contact.id}-first-name`}
																		className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																	>
																		First name
																	</label>
																	<div className="mt-1">
																		<input
																			id={`${contact.id}-first-name`}
																			name={`${contact.id}-first-name`}
																			type="text"
																			value={contact.firstName}
																			onChange={(e) =>
																				updateContact(
																					contact.id,
																					"firstName",
																					e.target.value
																				)
																			}
																			className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																			placeholder="Optional"
																		/>
																	</div>
																</div>

																<div className="sm:col-span-3">
																	<label
																		htmlFor={`${contact.id}-last-name`}
																		className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																	>
																		Last name
																	</label>
																	<div className="mt-1">
																		<input
																			id={`${contact.id}-last-name`}
																			name={`${contact.id}-last-name`}
																			type="text"
																			value={contact.lastName}
																			onChange={(e) =>
																				updateContact(
																					contact.id,
																					"lastName",
																					e.target.value
																				)
																			}
																			className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																			placeholder="Optional"
																		/>
																	</div>
																</div>

																<div className="sm:col-span-3">
																	<label
																		htmlFor={`${contact.id}-role`}
																		className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																	>
																		Role/Title
																	</label>
																	<div className="mt-1">
																		<input
																			id={`${contact.id}-role`}
																			name={`${contact.id}-role`}
																			type="text"
																			value={contact.role}
																			onChange={(e) =>
																				updateContact(
																					contact.id,
																					"role",
																					e.target.value
																				)
																			}
																			className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																			placeholder="e.g., Manager, Director"
																		/>
																	</div>
																</div>

																<div className="sm:col-span-3">
																	<label
																		htmlFor={`${contact.id}-department`}
																		className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																	>
																		Department
																	</label>
																	<div className="mt-1">
																		<input
																			id={`${contact.id}-department`}
																			name={`${contact.id}-department`}
																			type="text"
																			value={contact.department}
																			onChange={(e) =>
																				updateContact(
																					contact.id,
																					"department",
																					e.target.value
																				)
																			}
																			className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																			placeholder="e.g., Billing Contact, Operations"
																		/>
																	</div>
																</div>

																<div className="sm:col-span-3">
																	<label
																		htmlFor={`${contact.id}-phone`}
																		className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																	>
																		Phone number
																	</label>
																	<div className="mt-1">
																		<input
																			id={`${contact.id}-phone`}
																			name={`${contact.id}-phone`}
																			type="tel"
																			value={contact.phone}
																			onChange={(e) =>
																				updateContact(
																					contact.id,
																					"phone",
																					e.target.value
																				)
																			}
																			className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																		/>
																	</div>
																</div>

																<div className="sm:col-span-3">
																	<label
																		htmlFor={`${contact.id}-email`}
																		className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																	>
																		Email address
																	</label>
																	<div className="mt-1">
																		<input
																			id={`${contact.id}-email`}
																			name={`${contact.id}-email`}
																			type="email"
																			value={contact.email}
																			onChange={(e) =>
																				updateContact(
																					contact.id,
																					"email",
																					e.target.value
																				)
																			}
																			className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																		/>
																	</div>
																</div>

																<div className="col-span-full mt-4 flex justify-between">
																	<button
																		type="button"
																		onClick={addContact}
																		className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300"
																	>
																		<svg
																			className="h-4 w-4"
																			fill="none"
																			viewBox="0 0 24 24"
																			strokeWidth="1.5"
																			stroke="currentColor"
																		>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				d="M12 4.5v15m7.5-7.5h-15"
																			/>
																		</svg>
																		Add another contact
																	</button>
																	{!contact.isPrimary && (
																		<button
																			type="button"
																			onClick={() => removeContact(contact.id)}
																			className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
																		>
																			<svg
																				className="h-4 w-4"
																				fill="none"
																				viewBox="0 0 24 24"
																				strokeWidth="1.5"
																				stroke="currentColor"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					d="M6 18L18 6M6 6l12 12"
																				/>
																			</svg>
																			Remove contact
																		</button>
																	)}
																</div>
															</div>
														),
													})),
											]}
										/>
										{formData.contacts.filter((c) => !c.isPrimary).length ===
											0 && (
											<div className="mt-4">
												<button
													type="button"
													onClick={addContact}
													className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300"
												>
													<svg
														className="h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth="1.5"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M12 4.5v15m7.5-7.5h-15"
														/>
													</svg>
													Add additional contact
												</button>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Property Information Section with Accordion */}
							<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-200 dark:border-white/10 pb-12 md:grid-cols-3">
								<div>
									<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
										Property Information
									</h2>
									<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
										Details about properties or locations associated with this
										client.
									</p>
									{errors.properties && (
										<p className="mt-2 text-sm text-red-600 dark:text-red-400">
											{errors.properties}
										</p>
									)}
								</div>

								<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
									<div className="col-span-full">
										<Accordion
											items={[
												{
													title: "Primary Property (Required)",
													content: (
														<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
															{formData.properties
																.filter((property) => property.isPrimary)
																.map((property) => (
																	<React.Fragment key={property.id}>
																		<div className="col-span-full">
																			<label
																				htmlFor={`${property.id}-street-address`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				Street address *
																			</label>
																			<div className="mt-2">
																				<input
																					id={`${property.id}-street-address`}
																					name={`${property.id}-street-address`}
																					type="text"
																					value={property.streetAddress}
																					onChange={(e) =>
																						updateProperty(
																							property.id,
																							"streetAddress",
																							e.target.value
																						)
																					}
																					autoComplete="street-address"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>

																		<div className="sm:col-span-2">
																			<label
																				htmlFor={`${property.id}-city`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				City *
																			</label>
																			<div className="mt-2">
																				<input
																					id={`${property.id}-city`}
																					name={`${property.id}-city`}
																					type="text"
																					value={property.city}
																					onChange={(e) =>
																						updateProperty(
																							property.id,
																							"city",
																							e.target.value
																						)
																					}
																					autoComplete="address-level2"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>

																		<div className="sm:col-span-2">
																			<label
																				htmlFor={`${property.id}-region`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				State / Province *
																			</label>
																			<div className="mt-2">
																				<input
																					id={`${property.id}-region`}
																					name={`${property.id}-region`}
																					type="text"
																					value={property.region}
																					onChange={(e) =>
																						updateProperty(
																							property.id,
																							"region",
																							e.target.value
																						)
																					}
																					autoComplete="address-level1"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>

																		<div className="sm:col-span-2">
																			<label
																				htmlFor={`${property.id}-postal-code`}
																				className="block text-sm/6 font-medium text-gray-900 dark:text-white"
																			>
																				ZIP / Postal code *
																			</label>
																			<div className="mt-2">
																				<input
																					id={`${property.id}-postal-code`}
																					name={`${property.id}-postal-code`}
																					type="text"
																					value={property.postalCode}
																					onChange={(e) =>
																						updateProperty(
																							property.id,
																							"postalCode",
																							e.target.value
																						)
																					}
																					autoComplete="postal-code"
																					className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																				/>
																			</div>
																		</div>
																	</React.Fragment>
																))}
														</div>
													),
												},
											]}
										/>
										{formData.properties.filter((p) => !p.isPrimary).length ===
											0 && (
											<div className="mt-4">
												<button
													type="button"
													onClick={addProperty}
													className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300"
												>
													<svg
														className="h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth="1.5"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M12 4.5v15m7.5-7.5h-15"
														/>
													</svg>
													Add additional property
												</button>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Service Requirements Section */}
							<div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
								<div>
									<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
										Service Requirements
									</h2>
									<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
										Select the services you&apos;re interested in and
										communication preferences.
									</p>
								</div>

								<div className="max-w-4xl space-y-10 md:col-span-2">
									<fieldset>
										<legend className="text-sm/6 font-semibold text-gray-900 dark:text-white">
											Services needed
										</legend>
										<div className="mt-6 space-y-6">
											{[
												{
													id: "property-management",
													value: "property-management",
													label: "Property Management",
													description:
														"Comprehensive property management services including maintenance and tenant relations.",
												},
												{
													id: "maintenance",
													value: "maintenance",
													label: "Maintenance Services",
													description:
														"Regular maintenance, repairs, and emergency response services.",
												},
												{
													id: "consulting",
													value: "consulting",
													label: "Consulting Services",
													description:
														"Strategic consulting for property optimization and investment planning.",
												},
											].map((service) => (
												<div key={service.id} className="flex gap-3">
													<div className="flex h-6 shrink-0 items-center">
														<div className="group grid size-4 grid-cols-1">
															<input
																id={service.id}
																name="services"
																type="checkbox"
																value={service.value}
																checked={formData.servicesNeeded.includes(
																	service.value
																)}
																onChange={(e) =>
																	handleCheckboxChange(
																		service.value,
																		e.target.checked
																	)
																}
																className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 checked:border-blue-600 dark:checked:border-indigo-500 checked:bg-blue-600 dark:checked:bg-indigo-500 indeterminate:border-blue-600 dark:indeterminate:border-indigo-500 indeterminate:bg-blue-600 dark:indeterminate:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-indigo-500"
															/>
															<svg
																fill="none"
																viewBox="0 0 14 14"
																className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
															>
																<path
																	d="M3 8L6 11L11 3.5"
																	strokeWidth={2}
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	className="opacity-0 group-has-checked:opacity-100"
																/>
															</svg>
														</div>
													</div>
													<div className="text-sm/6">
														<label
															htmlFor={service.id}
															className="font-medium text-gray-900 dark:text-white"
														>
															{service.label}
														</label>
														<p className="text-gray-600 dark:text-gray-400">
															{service.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</fieldset>

									<fieldset>
										<legend className="text-sm/6 font-semibold text-gray-900 dark:text-white">
											Communication preferences
										</legend>
										<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
											How would you like to receive updates and notifications?
										</p>
										<div className="mt-6 space-y-6">
											{[
												{
													id: "comm-email",
													value: "email",
													label: "Email only",
												},
												{
													id: "comm-phone",
													value: "phone",
													label: "Phone calls for urgent matters",
												},
												{
													id: "comm-both",
													value: "both",
													label: "Both email and phone",
												},
											].map((option) => (
												<div
													key={option.id}
													className="flex items-center gap-x-3"
												>
													<input
														id={option.id}
														name="communication"
														type="radio"
														value={option.value}
														checked={
															formData.communicationPreference === option.value
														}
														onChange={(e) =>
															updateField(
																"communicationPreference",
																e.target.value
															)
														}
														className="relative size-4 appearance-none rounded-full border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-blue-600 dark:checked:border-indigo-500 checked:bg-blue-600 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-indigo-500"
													/>
													<label
														htmlFor={option.id}
														className="block text-sm/6 font-medium text-gray-900 dark:text-white"
													>
														{option.label}
													</label>
												</div>
											))}
										</div>
									</fieldset>

									{/* Opt-in checkboxes */}
									<div className="space-y-4">
										<div className="flex items-center gap-x-3">
											<input
												id="email-opt-in"
												name="email-opt-in"
												type="checkbox"
												checked={formData.emailOptIn}
												onChange={(e) =>
													updateField("emailOptIn", e.target.checked)
												}
												className="size-4 appearance-none rounded border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 checked:border-blue-600 dark:checked:border-indigo-500 checked:bg-blue-600 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-indigo-500"
											/>
											<label
												htmlFor="email-opt-in"
												className="text-sm font-medium text-gray-900 dark:text-white"
											>
												I agree to receive email communications
											</label>
										</div>
										<div className="flex items-center gap-x-3">
											<input
												id="sms-opt-in"
												name="sms-opt-in"
												type="checkbox"
												checked={formData.smsOptIn}
												onChange={(e) =>
													updateField("smsOptIn", e.target.checked)
												}
												className="size-4 appearance-none rounded border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 checked:border-blue-600 dark:checked:border-indigo-500 checked:bg-blue-600 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-indigo-500"
											/>
											<label
												htmlFor="sms-opt-in"
												className="text-sm font-medium text-gray-900 dark:text-white"
											>
												I agree to receive SMS communications
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
);

ClientOnboardingForm.displayName = "ClientOnboardingForm";
