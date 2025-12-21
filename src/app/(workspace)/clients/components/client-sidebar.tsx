"use client";

import { Doc } from "../../../../../convex/_generated/dataModel";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
	StyledCard,
	StyledCardHeader,
	StyledCardTitle,
	StyledCardContent,
	StyledSelect,
	StyledSelectTrigger,
	StyledSelectContent,
	SelectValue,
	SelectItem,
} from "@/components/ui/styled";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Helper function to format phone number for display
function formatPhoneNumber(phone?: string): string {
	if (!phone) return "";
	return phone;
}

// Helper function to format communication preference
function formatCommunicationPreference(pref?: string): string {
	if (!pref) return "Not specified";
	switch (pref) {
		case "email":
			return "Email only";
		case "phone":
			return "Phone calls for urgent matters";
		case "both":
			return "Both email and phone";
		default:
			return pref;
	}
}

interface ClientSidebarProps {
	client: Doc<"clients">;
	primaryContact: Doc<"clientContacts"> | null | undefined;
	isEditing: boolean;
	form: {
		communicationPreference: "email" | "phone" | "both" | "";
	};
	onFormChange: (field: string, value: string) => void;
	clientEmails: Doc<"emailMessages">[] | undefined;
	invoices: Doc<"invoices">[] | undefined;
}

export function ClientSidebar({
	client,
	primaryContact,
	isEditing,
	form,
	onFormChange,
	clientEmails,
	invoices,
}: ClientSidebarProps) {
	const toast = useToast();
	const [isLastEmailExpanded, setIsLastEmailExpanded] = useState(false);

	return (
		<div className="space-y-6">
			{/* Contact Info Card */}
			<StyledCard>
				<StyledCardHeader>
					<StyledCardTitle className="text-lg">Contact Info</StyledCardTitle>
				</StyledCardHeader>
				<StyledCardContent className="space-y-4">
					{primaryContact ? (
						<>
							<div className="space-y-3">
								<div className="flex items-start justify-between">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Primary contact
									</span>
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											{primaryContact.firstName} {primaryContact.lastName}
										</span>
										<StarSolidIcon className="h-4 w-4 text-yellow-400" />
									</div>
								</div>
								{primaryContact.jobTitle && (
									<div className="flex items-start justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">
											Job Title
										</span>
										<span className="text-sm text-gray-900 dark:text-white text-right">
											{primaryContact.jobTitle}
										</span>
									</div>
								)}
								{primaryContact.phone && (
									<div className="flex items-start justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">
											Phone
										</span>
										<span className="text-sm text-gray-900 dark:text-white">
											{formatPhoneNumber(primaryContact.phone)}
										</span>
									</div>
								)}
								{primaryContact.email && (
									<div className="flex items-start justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">
											Email
										</span>
										<span className="text-sm text-gray-900 dark:text-white text-right break-all">
											{primaryContact.email}
										</span>
									</div>
								)}
							</div>
							{/* Communication Preference */}
							<div className="pt-4 border-t border-gray-200 dark:border-white/10">
								<div className="flex items-start justify-between gap-3">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Communication Preference
									</span>
									{isEditing ? (
										<div className="flex-1 max-w-[180px]">
											<StyledSelect
												value={form.communicationPreference}
												onValueChange={(value) =>
													onFormChange("communicationPreference", value)
												}
											>
												<StyledSelectTrigger className="h-8">
													<SelectValue placeholder="Select" />
												</StyledSelectTrigger>
												<StyledSelectContent>
													<SelectItem value="email">Email only</SelectItem>
													<SelectItem value="phone">
														Phone calls for urgent matters
													</SelectItem>
													<SelectItem value="both">
														Both email and phone
													</SelectItem>
												</StyledSelectContent>
											</StyledSelect>
										</div>
									) : (
										<span className="text-sm text-gray-900 dark:text-white text-right">
											{formatCommunicationPreference(
												client.communicationPreference
											)}
										</span>
									)}
								</div>
							</div>
						</>
					) : (
						<div className="text-center py-4">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								No primary contact set
							</p>
						</div>
					)}
				</StyledCardContent>
			</StyledCard>

			{/* Last Communication Card */}
			<StyledCard>
				<StyledCardHeader>
					<StyledCardTitle className="text-lg">
						Last client communication
					</StyledCardTitle>
				</StyledCardHeader>
				<StyledCardContent>
					{clientEmails && clientEmails.length > 0 ? (
						(() => {
							const lastEmail = clientEmails[0];
							const isInbound = lastEmail.direction === "inbound";

							return (
								<div className="space-y-3">
									{/* Email Header */}
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-start gap-2 flex-1 min-w-0">
											<div
												className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
													isInbound
														? "bg-blue-500"
														: lastEmail.status === "delivered" ||
														  lastEmail.status === "opened"
														? "bg-green-500"
														: lastEmail.status === "sent"
														? "bg-blue-500"
														: "bg-red-500"
												}`}
											/>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span
														className={`text-xs font-medium px-2 py-0.5 rounded ${
															isInbound
																? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
																: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
														}`}
													>
														{isInbound ? "Inbound" : "Outbound"}
													</span>
												</div>
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{lastEmail.subject}
												</p>
												<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
													From:{" "}
													<span className="font-medium">
														{lastEmail.fromName}
													</span>
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
													{new Date(lastEmail.sentAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															year: "numeric",
															hour: "numeric",
															minute: "2-digit",
														}
													)}
												</p>
											</div>
										</div>
									</div>

									{/* Status Badge */}
									{!isInbound && (
										<div className="flex items-center gap-1.5 pl-4">
											{lastEmail.status === "opened" && (
												<span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
													<svg
														className="w-3 h-3"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
														/>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
														/>
													</svg>
													Opened
												</span>
											)}
											{lastEmail.status === "delivered" && (
												<span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
													<svg
														className="w-3 h-3"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M5 13l4 4L19 7"
														/>
													</svg>
													Delivered
												</span>
											)}
											{lastEmail.status === "sent" && (
												<span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
													<svg
														className="w-3 h-3"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
														/>
													</svg>
													Sent
												</span>
											)}
											{lastEmail.status === "bounced" && (
												<span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
													<svg
														className="w-3 h-3"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													Bounced
												</span>
											)}
										</div>
									)}

									{/* Expandable Message Body */}
									<div>
										<button
											onClick={() => setIsLastEmailExpanded(!isLastEmailExpanded)}
											className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 font-medium transition-colors w-full pl-4"
										>
											{isLastEmailExpanded ? (
												<>
													<ChevronUp className="w-3 h-3" />
													Hide message
												</>
											) : (
												<>
													<ChevronDown className="w-3 h-3" />
													Show message
												</>
											)}
										</button>

										{isLastEmailExpanded && (
											<div className="mt-3 pl-4">
												<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
													{lastEmail.messageBody ||
														lastEmail.textBody ||
														lastEmail.messagePreview ||
														"No message content"}
												</div>
											</div>
										)}
									</div>

									{/* Additional emails indicator */}
									{clientEmails.length > 1 && (
										<p className="text-xs text-gray-500 dark:text-gray-400 italic pl-4 pt-2 border-t border-gray-200 dark:border-gray-700">
											{clientEmails.length - 1} earlier message
											{clientEmails.length - 1 !== 1 ? "s" : ""}
										</p>
									)}
								</div>
							);
						})()
					) : (
						<p className="text-sm text-gray-600 dark:text-gray-400 italic">
							You haven&apos;t sent any client communications yet
						</p>
					)}
				</StyledCardContent>
			</StyledCard>

		{/* Billing Summary */}
		<StyledCard>
			<StyledCardHeader>
				<StyledCardTitle className="text-lg">
					Billing summary
				</StyledCardTitle>
			</StyledCardHeader>
				<StyledCardContent className="space-y-4">
					{invoices && invoices.length > 0 ? (
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Total invoices
								</span>
								<span className="text-sm font-medium text-gray-900 dark:text-white">
									{invoices.length}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Total billed
								</span>
								<span className="text-sm font-medium text-gray-900 dark:text-white">
									$
									{invoices
										.reduce(
											(sum: number, inv: Doc<"invoices">) => sum + inv.total,
											0
										)
										.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Outstanding
								</span>
								<span className="text-sm font-medium text-gray-900 dark:text-white">
									$
									{invoices
										.filter((inv: Doc<"invoices">) => inv.status !== "paid")
										.reduce(
											(sum: number, inv: Doc<"invoices">) => sum + inv.total,
											0
										)
										.toLocaleString()}
								</span>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center text-center py-6">
							<div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3">
								<EnvelopeIcon className="h-6 w-6 text-gray-400" />
							</div>
							<h4 className="font-medium text-gray-900 dark:text-white mb-1">
								No billing history
							</h4>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								This client hasn&apos;t been billed yet
							</p>
						</div>
					)}
				</StyledCardContent>
			</StyledCard>
		</div>
	);
}

