/* eslint-disable react/no-children-prop */
"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import Accordion from "./ui/accordion";
import { useToastOperations } from "@/hooks/use-toast";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldLegend,
} from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

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
	notes: string;

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
	notes: "",

	// Service Requirements
	servicesNeeded: [],
	communicationPreference: "",

	// Opt-in preferences
	emailOptIn: true,
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

// Zod validation schema
const formSchema = z.object({
	companyName: z.string().min(1, "Company name is required"),
	status: z.string().refine((val) => val !== "", {
		message: "Client status is required",
	}),
	industry: z.string(),
	companyDescription: z.string(),
	leadSource: z.string(),
	contacts: z
		.array(
			z.object({
				id: z.string(),
				firstName: z.string(),
				lastName: z.string(),
				email: z.string(),
				phone: z.string(),
				jobTitle: z.string(),
				role: z.string(),
				department: z.string(),
				isPrimary: z.boolean(),
			})
		)
		.refine(
			(contacts) => {
				const primary = contacts.find((c) => c.isPrimary);
				if (!primary) return false;
				if (!primary.firstName.trim()) return false;
				if (!primary.lastName.trim()) return false;
				if (!primary.email.trim()) return false;
				if (!/\S+@\S+\.\S+/.test(primary.email)) return false;
				return true;
			},
			{
				message:
					"Primary contact requires first name, last name, and a valid email",
			}
		),
	properties: z
		.array(
			z.object({
				id: z.string(),
				propertyName: z.string(),
				propertyType: z.string(),
				squareFootage: z.string(),
				streetAddress: z.string(),
				city: z.string(),
				region: z.string(),
				postalCode: z.string(),
				propertyDescription: z.string(),
				isPrimary: z.boolean(),
			})
		)
		.refine(
			(properties) => {
				const primary = properties.find((p) => p.isPrimary);
				if (!primary) return false;
				if (!primary.streetAddress.trim()) return false;
				if (!primary.city.trim()) return false;
				if (!primary.region.trim()) return false;
				if (!primary.postalCode.trim()) return false;
				return true;
			},
			{
				message:
					"Primary property requires street address, city, state/province, and postal code",
			}
		),
	category: z.string(),
	clientSize: z.string(),
	clientType: z.string(),
	isActive: z.string(),
	projectDimensions: z.string(),
	priorityLevel: z.string(),
	tags: z.string(),
	notes: z.string(),
	servicesNeeded: z.array(z.string()),
	communicationPreference: z.string(),
	emailOptIn: z.boolean(),
	smsOptIn: z.boolean(),
});

export const ClientOnboardingForm: React.FC<ClientOnboardingFormProps> = ({
	title = "New Client Onboarding",
	subtitle = "Let's gather comprehensive information to establish a complete client profile with all necessary details for effective relationship management.",
	onSubmit,
	isLoading = false,
}) => {
	const toast = useToastOperations();

	const form = useForm({
		defaultValues: initialFormData,
		onSubmit: async ({ value }) => {
			// Validate with Zod
			const result = formSchema.safeParse(value);
			if (!result.success) {
				const errors = result.error.flatten();
				console.error("Validation errors:", errors);
				toast.error(
					"Validation Error",
					"Please fix the errors in the form before submitting."
				);
				return;
			}

			try {
				if (onSubmit) {
					onSubmit(value);
				}
			} catch (error) {
				console.error("Failed to submit form:", error);
				toast.error("Error", "Failed to submit form. Please try again.");
			}
		},
	});

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

				<form
					id="client-onboarding-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<div className="space-y-12">
						{/* Company Information Section */}
						<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-200 dark:border-white/10 pb-12 md:grid-cols-3">
							<div>
								<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
									Company Information
								</h2>
								<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
									Basic information about the client company and how they found
									us.
								</p>
							</div>

							<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
								<FieldGroup className="sm:col-span-4">
									<form.Field
										name="companyName"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched &&
												field.state.meta.errors.length > 0;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Company name *
													</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														aria-invalid={isInvalid}
														placeholder="e.g., ASMobbin"
														autoComplete="organization"
														disabled={isLoading}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>

								<FieldGroup className="sm:col-span-2">
									<form.Field
										name="status"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched &&
												field.state.meta.errors.length > 0;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Client status *
													</FieldLabel>
													<Select
														value={field.state.value}
														onValueChange={(value) =>
															field.handleChange(
																value as ClientFormData["status"]
															)
														}
														disabled={isLoading}
													>
														<SelectTrigger aria-invalid={isInvalid}>
															<SelectValue placeholder="Select status" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="lead">Lead</SelectItem>
															<SelectItem value="prospect">Prospect</SelectItem>
															<SelectItem value="active">Active</SelectItem>
															<SelectItem value="inactive">Inactive</SelectItem>
															<SelectItem value="archived">Archived</SelectItem>
														</SelectContent>
													</Select>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>

								<FieldGroup className="sm:col-span-3">
									<form.Field
										name="leadSource"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched &&
												field.state.meta.errors.length > 0;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Lead source
													</FieldLabel>
													<Select
														value={field.state.value}
														onValueChange={(value) =>
															field.handleChange(
																value as ClientFormData["leadSource"]
															)
														}
														disabled={isLoading}
													>
														<SelectTrigger aria-invalid={isInvalid}>
															<SelectValue placeholder="Select source" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="word-of-mouth">
																Word Of Mouth
															</SelectItem>
															<SelectItem value="website">Website</SelectItem>
															<SelectItem value="social-media">
																Social Media
															</SelectItem>
															<SelectItem value="referral">Referral</SelectItem>
															<SelectItem value="advertising">
																Advertising
															</SelectItem>
															<SelectItem value="trade-show">
																Trade Show
															</SelectItem>
															<SelectItem value="cold-outreach">
																Cold Outreach
															</SelectItem>
															<SelectItem value="other">Other</SelectItem>
														</SelectContent>
													</Select>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>

								<FieldGroup className="sm:col-span-3">
									<form.Field
										name="industry"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched &&
												field.state.meta.errors.length > 0;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Industry</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														aria-invalid={isInvalid}
														placeholder="e.g., Technology, Healthcare, Manufacturing"
														disabled={isLoading}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>

								<FieldGroup className="col-span-full">
									<form.Field
										name="companyDescription"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched &&
												field.state.meta.errors.length > 0;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Company description
													</FieldLabel>
													<Textarea
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														aria-invalid={isInvalid}
														rows={3}
														placeholder="Brief description of the company and what they do..."
														disabled={isLoading}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>
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
								<form.Field
									name="contacts"
									mode="array"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched &&
											field.state.meta.errors.length > 0;
										return (
											<>
												{isInvalid && (
													<p className="mt-2 text-sm text-red-600 dark:text-red-400">
														{field.state.meta.errors.join(", ")}
													</p>
												)}
											</>
										);
									}}
								/>
							</div>

							<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
								<div className="col-span-full">
									<form.Field
										name="contacts"
										mode="array"
										children={(contactsField) => {
											const primaryContact = contactsField.state.value.find(
												(c) => c.isPrimary
											);
											const additionalContacts =
												contactsField.state.value.filter((c) => !c.isPrimary);

											return (
												<>
													<Accordion
														items={[
															// Primary Contact
															{
																title: "Primary Contact (Required)",
																content: (
																	<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
																		{primaryContact && (
																			<React.Fragment key={primaryContact.id}>
																				<FieldGroup className="sm:col-span-3">
																					<form.Field
																						name={`contacts[0].firstName`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										First name *
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="given-name"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>

																				<FieldGroup className="sm:col-span-3">
																					<form.Field
																						name={`contacts[0].lastName`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										Last name *
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="family-name"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>

																				<FieldGroup className="sm:col-span-4">
																					<form.Field
																						name={`contacts[0].email`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										Email address *
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										type="email"
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="email"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>

																				<FieldGroup className="sm:col-span-3">
																					<form.Field
																						name={`contacts[0].phone`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										Phone number
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										type="tel"
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="tel"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>

																				<FieldGroup className="sm:col-span-3">
																					<form.Field
																						name={`contacts[0].jobTitle`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										Job title
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="organization-title"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>
																			</React.Fragment>
																		)}
																	</div>
																),
															},
															// Additional Contacts
															...additionalContacts.map((contact, idx) => {
																const actualIndex = idx + 1;
																return {
																	title: `Additional Contact #${actualIndex} (Optional)`,
																	content: (
																		<div
																			key={contact.id}
																			className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6"
																		>
																			<FieldGroup className="sm:col-span-3">
																				<form.Field
																					name={`contacts[${actualIndex}].firstName`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									First name
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									placeholder="Optional"
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<FieldGroup className="sm:col-span-3">
																				<form.Field
																					name={`contacts[${actualIndex}].lastName`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									Last name
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									placeholder="Optional"
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<FieldGroup className="sm:col-span-3">
																				<form.Field
																					name={`contacts[${actualIndex}].role`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									Role/Title
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									placeholder="e.g., Manager, Director"
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<FieldGroup className="sm:col-span-3">
																				<form.Field
																					name={`contacts[${actualIndex}].department`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									Department
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									placeholder="e.g., Billing Contact, Operations"
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<FieldGroup className="sm:col-span-3">
																				<form.Field
																					name={`contacts[${actualIndex}].phone`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									Phone number
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									type="tel"
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<FieldGroup className="sm:col-span-3">
																				<form.Field
																					name={`contacts[${actualIndex}].email`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									Email address
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									type="email"
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<div className="col-span-full mt-4 flex justify-between">
																				<button
																					type="button"
																					onClick={() =>
																						contactsField.pushValue(
																							createEmptyContact(false)
																						)
																					}
																					className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300"
																					disabled={isLoading}
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
																				<button
																					type="button"
																					onClick={() =>
																						contactsField.removeValue(
																							actualIndex
																						)
																					}
																					className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
																					disabled={isLoading}
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
																			</div>
																		</div>
																	),
																};
															}),
														]}
													/>
													{additionalContacts.length === 0 && (
														<div className="mt-4">
															<button
																type="button"
																onClick={() =>
																	contactsField.pushValue(
																		createEmptyContact(false)
																	)
																}
																className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300"
																disabled={isLoading}
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
												</>
											);
										}}
									/>
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
								<form.Field
									name="properties"
									mode="array"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched &&
											field.state.meta.errors.length > 0;
										return (
											<>
												{isInvalid && (
													<p className="mt-2 text-sm text-red-600 dark:text-red-400">
														{field.state.meta.errors.join(", ")}
													</p>
												)}
											</>
										);
									}}
								/>
							</div>

							<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
								<div className="col-span-full">
									<form.Field
										name="properties"
										mode="array"
										children={(propertiesField) => {
											const primaryProperty = propertiesField.state.value.find(
												(p) => p.isPrimary
											);
											const additionalProperties =
												propertiesField.state.value.filter((p) => !p.isPrimary);

											return (
												<>
													<Accordion
														items={[
															// Primary Property
															{
																title: "Primary Property (Required)",
																content: (
																	<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
																		{primaryProperty && (
																			<React.Fragment key={primaryProperty.id}>
																				<FieldGroup className="col-span-full">
																					<form.Field
																						name={`properties[0].streetAddress`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										Street address *
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="street-address"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>

																				<FieldGroup className="sm:col-span-2">
																					<form.Field
																						name={`properties[0].city`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										City *
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="address-level2"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>

																				<FieldGroup className="sm:col-span-2">
																					<form.Field
																						name={`properties[0].region`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										State / Province *
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="address-level1"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>

																				<FieldGroup className="sm:col-span-2">
																					<form.Field
																						name={`properties[0].postalCode`}
																						children={(field) => {
																							const isInvalid =
																								field.state.meta.isTouched &&
																								field.state.meta.errors.length >
																									0;
																							return (
																								<Field data-invalid={isInvalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										ZIP / Postal code *
																									</FieldLabel>
																									<Input
																										id={field.name}
																										name={field.name}
																										value={field.state.value}
																										onBlur={field.handleBlur}
																										onChange={(e) =>
																											field.handleChange(
																												e.target.value
																											)
																										}
																										aria-invalid={isInvalid}
																										autoComplete="postal-code"
																										disabled={isLoading}
																									/>
																									{isInvalid && (
																										<FieldError
																											errors={
																												field.state.meta.errors
																											}
																										/>
																									)}
																								</Field>
																							);
																						}}
																					/>
																				</FieldGroup>
																			</React.Fragment>
																		)}
																	</div>
																),
															},
															// Additional Properties
															...additionalProperties.map((property, idx) => {
																const actualIndex = idx + 1;
																return {
																	title: `Additional Property #${actualIndex} (Optional)`,
																	content: (
																		<div
																			key={property.id}
																			className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6"
																		>
																			<FieldGroup className="col-span-full">
																				<form.Field
																					name={`properties[${actualIndex}].streetAddress`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									Street address
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									placeholder="Optional"
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<FieldGroup className="sm:col-span-2">
																				<form.Field
																					name={`properties[${actualIndex}].city`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									City
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									placeholder="Optional"
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<FieldGroup className="sm:col-span-2">
																				<form.Field
																					name={`properties[${actualIndex}].region`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									State / Province
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									placeholder="Optional"
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<FieldGroup className="sm:col-span-2">
																				<form.Field
																					name={`properties[${actualIndex}].postalCode`}
																					children={(field) => {
																						const isInvalid =
																							field.state.meta.isTouched &&
																							field.state.meta.errors.length >
																								0;
																						return (
																							<Field data-invalid={isInvalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									ZIP / Postal code
																								</FieldLabel>
																								<Input
																									id={field.name}
																									name={field.name}
																									value={field.state.value}
																									onBlur={field.handleBlur}
																									onChange={(e) =>
																										field.handleChange(
																											e.target.value
																										)
																									}
																									aria-invalid={isInvalid}
																									placeholder="Optional"
																									disabled={isLoading}
																								/>
																								{isInvalid && (
																									<FieldError
																										errors={
																											field.state.meta.errors
																										}
																									/>
																								)}
																							</Field>
																						);
																					}}
																				/>
																			</FieldGroup>

																			<div className="col-span-full mt-4 flex justify-between">
																				<button
																					type="button"
																					onClick={() =>
																						propertiesField.pushValue(
																							createEmptyProperty(false)
																						)
																					}
																					className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300"
																					disabled={isLoading}
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
																					Add another property
																				</button>
																				<button
																					type="button"
																					onClick={() =>
																						propertiesField.removeValue(
																							actualIndex
																						)
																					}
																					className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
																					disabled={isLoading}
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
																					Remove property
																				</button>
																			</div>
																		</div>
																	),
																};
															}),
														]}
													/>
													{additionalProperties.length === 0 && (
														<div className="mt-4">
															<button
																type="button"
																onClick={() =>
																	propertiesField.pushValue(
																		createEmptyProperty(false)
																	)
																}
																className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300"
																disabled={isLoading}
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
												</>
											);
										}}
									/>
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
								<FieldSet>
									<FieldLegend variant="label">Services needed</FieldLegend>
									<form.Field
										name="servicesNeeded"
										mode="array"
										children={(field) => {
											const services = [
												{
													value: "property-management",
													label: "Property Management",
													description:
														"Comprehensive property management services including maintenance and tenant relations.",
												},
												{
													value: "maintenance",
													label: "Maintenance Services",
													description:
														"Regular maintenance, repairs, and emergency response services.",
												},
												{
													value: "consulting",
													label: "Consulting Services",
													description:
														"Strategic consulting for property optimization and investment planning.",
												},
											];

											return (
												<FieldGroup className="gap-6">
													{services.map((service) => {
														const isChecked = field.state.value.includes(
															service.value
														);
														return (
															<Field
																key={service.value}
																orientation="horizontal"
															>
																<Checkbox
																	id={service.value}
																	checked={isChecked}
																	onCheckedChange={(checked) => {
																		if (checked) {
																			field.pushValue(service.value);
																		} else {
																			const index = field.state.value.indexOf(
																				service.value
																			);
																			if (index > -1) {
																				field.removeValue(index);
																			}
																		}
																	}}
																	disabled={isLoading}
																/>
																<FieldLabel htmlFor={service.value}>
																	<div className="text-sm/6">
																		<div className="font-medium text-gray-900 dark:text-white">
																			{service.label}
																		</div>
																		<p className="text-gray-600 dark:text-gray-400">
																			{service.description}
																		</p>
																	</div>
																</FieldLabel>
															</Field>
														);
													})}
												</FieldGroup>
											);
										}}
									/>
								</FieldSet>

								<FieldSet>
									<FieldLegend variant="label">
										Communication preferences
									</FieldLegend>
									<FieldDescription>
										How would you like to receive updates and notifications?
									</FieldDescription>
									<form.Field
										name="communicationPreference"
										children={(field) => {
											return (
												<Field>
													<RadioGroup
														value={field.state.value}
														onValueChange={(value) =>
															field.handleChange(
																value as ClientFormData["communicationPreference"]
															)
														}
														disabled={isLoading}
													>
														<div className="flex items-center gap-3">
															<RadioGroupItem value="email" id="comm-email" />
															<Label htmlFor="comm-email">Email only</Label>
														</div>
														<div className="flex items-center gap-3">
															<RadioGroupItem value="phone" id="comm-phone" />
															<Label htmlFor="comm-phone">
																Phone calls for urgent matters
															</Label>
														</div>
														<div className="flex items-center gap-3">
															<RadioGroupItem value="both" id="comm-both" />
															<Label htmlFor="comm-both">
																Both email and phone
															</Label>
														</div>
													</RadioGroup>
												</Field>
											);
										}}
									/>
								</FieldSet>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

ClientOnboardingForm.displayName = "ClientOnboardingForm";
