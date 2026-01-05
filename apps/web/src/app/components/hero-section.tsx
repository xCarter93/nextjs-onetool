"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { StyledButton } from "@/components/ui/styled/styled-button";
import CardSwap, { Card } from "@/components/CardSwap";
import { Check, Mail, MapPin, Phone, User, Calendar } from "lucide-react";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Apple's official logo
function AppleLogo({ className = "w-6 h-6" }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="-1 -1 16 16"
			className={className}
		>
			<path
				fill="white"
				d="M10.182 7.49a2.49 2.49 0 0 1 1.737-2.366a2.906 2.906 0 0 0-4.214-.999a1 1 0 0 1-.999 0a3.086 3.086 0 0 0-4.404 1.208a5.12 5.12 0 0 0-.54 3.356A7.24 7.24 0 0 0 3.7 12.893a2.09 2.09 0 0 0 2.697.15a1.32 1.32 0 0 1 1.568 0a2.06 2.06 0 0 0 2.656-.06a6.57 6.57 0 0 0 1.698-2.996a2.476 2.476 0 0 1-2.137-2.497"
			/>
			<path
				fill="none"
				stroke="white"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.184 1.998L9.682.5"
			/>
		</svg>
	);
}

export default function HeroSection() {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme } = useTheme();
	const [isScheduleDemoOpen, setIsScheduleDemoOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
		phone: "",
		message: "",
	});
	const [formStatus, setFormStatus] = useState<{
		type: "success" | "error" | null;
		message: string;
	}>({ type: null, message: "" });

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleScheduleDemo = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setFormStatus({ type: null, message: "" });

		try {
			const response = await fetch("/api/schedule-demo", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to send demo request");
			}

			setFormStatus({
				type: "success",
				message:
					"Thank you! We'll be in touch within 24 hours to schedule your demo.",
			});

			// Reset form after successful submission
			setTimeout(() => {
				setFormData({
					name: "",
					email: "",
					company: "",
					phone: "",
					message: "",
				});
				setIsScheduleDemoOpen(false);
				setFormStatus({ type: null, message: "" });
			}, 2000);
		} catch (error) {
			setFormStatus({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Failed to send demo request. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Prevent hydration mismatch by not rendering until theme is resolved
	if (!mounted || !resolvedTheme) {
		return null;
	}

	return (
		<div className="relative bg-white dark:bg-gray-900">
			{/* Main Hero Content */}
			<main>
				<div className="relative isolate">
					<svg
						aria-hidden="true"
						className="absolute inset-x-0 top-0 -z-10 h-256 w-full mask-[radial-gradient(32rem_32rem_at_center,white,transparent)] stroke-gray-200 dark:stroke-white/10"
					>
						<defs>
							<pattern
								x="50%"
								y={-1}
								id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
								width={200}
								height={200}
								patternUnits="userSpaceOnUse"
							>
								<path d="M.5 200V.5H200" fill="none" />
							</pattern>
						</defs>
						<svg
							x="50%"
							y={-1}
							className="overflow-visible fill-gray-50 dark:fill-gray-800"
						>
							<path
								d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
								strokeWidth={0}
							/>
						</svg>
						<rect
							fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
							width="100%"
							height="100%"
							strokeWidth={0}
						/>
					</svg>
					<div
						aria-hidden="true"
						className="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
					>
						<div
							style={{
								clipPath:
									"polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
							}}
							className="aspect-801/1036 w-200.25 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
						/>
					</div>
					<div className="overflow-hidden">
						<div className="mx-auto max-w-7xl px-6 pt-24 pb-32 sm:pt-32 lg:px-8 lg:pt-36">
							<div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
								<div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
									<h1 className="text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white">
										Simplify your growing business with OneTool.
									</h1>
									<p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none dark:text-gray-400">
										OneTool brings together quotes, projects, clients, and
										invoices — everything you need to keep work moving.
									</p>
									<div className="mt-10 flex items-center gap-x-4 flex-wrap">
										<StyledButton
											intent="primary"
											size="lg"
											onClick={() => {
												// Handle Start Free Trial action
											}}
										>
											Start Free Trial
										</StyledButton>
										<StyledButton
											intent="outline"
											size="lg"
											onClick={() => setIsScheduleDemoOpen(true)}
											icon={<Calendar className="h-5 w-5" />}
										>
											Schedule a Demo
										</StyledButton>
										
										{/* App Store Badge - Coming Soon */}
										<StyledButton
											intent="secondary"
											size="lg"
											disabled
											showArrow={false}
											className="!bg-black !text-white hover:!bg-gray-900 !ring-gray-800 disabled:opacity-60"
											icon={<AppleLogo className="w-8 h-8" />}
										>
											<div className="flex flex-col items-start text-left -my-1">
												<span className="text-[10px] leading-tight font-normal">Coming Soon on the</span>
												<span className="text-lg font-semibold leading-tight -mt-0.5">App Store</span>
											</div>
										</StyledButton>
									</div>

									{/* Schedule Demo Modal */}
									<Modal
										isOpen={isScheduleDemoOpen}
										onClose={() => setIsScheduleDemoOpen(false)}
										title="Schedule a Demo"
										size="md"
									>
										<div className="space-y-4">
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Fill out the form below and we'll reach out within 24
												hours to schedule your personalized demo.
											</p>

											<form onSubmit={handleScheduleDemo} className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="name">
														Name <span className="text-red-500">*</span>
													</Label>
													<Input
														id="name"
														type="text"
														required
														placeholder="John Doe"
														value={formData.name}
														onChange={(e) =>
															setFormData({ ...formData, name: e.target.value })
														}
														disabled={isSubmitting}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="email">
														Email <span className="text-red-500">*</span>
													</Label>
													<Input
														id="email"
														type="email"
														required
														placeholder="john@company.com"
														value={formData.email}
														onChange={(e) =>
															setFormData({
																...formData,
																email: e.target.value,
															})
														}
														disabled={isSubmitting}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="company">Company</Label>
													<Input
														id="company"
														type="text"
														placeholder="Acme Inc."
														value={formData.company}
														onChange={(e) =>
															setFormData({
																...formData,
																company: e.target.value,
															})
														}
														disabled={isSubmitting}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="phone">Phone</Label>
													<Input
														id="phone"
														type="tel"
														placeholder="+1 (555) 123-4567"
														value={formData.phone}
														onChange={(e) =>
															setFormData({
																...formData,
																phone: e.target.value,
															})
														}
														disabled={isSubmitting}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="message">Message</Label>
													<Textarea
														id="message"
														placeholder="Tell us about your business and what you'd like to see in the demo..."
														value={formData.message}
														onChange={(e) =>
															setFormData({
																...formData,
																message: e.target.value,
															})
														}
														disabled={isSubmitting}
														rows={4}
													/>
												</div>

												{formStatus.type && (
													<div
														className={`p-3 rounded-lg text-sm ${
															formStatus.type === "success"
																? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
																: "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
														}`}
													>
														{formStatus.message}
													</div>
												)}

												<div className="flex justify-end gap-3 pt-4">
													<StyledButton
														type="button"
														intent="outline"
														onClick={() => setIsScheduleDemoOpen(false)}
														disabled={isSubmitting}
													>
														Cancel
													</StyledButton>
													<StyledButton
														type="submit"
														intent="primary"
														isLoading={isSubmitting}
														disabled={
															isSubmitting ||
															!formData.name.trim() ||
															!formData.email.trim()
														}
													>
														{isSubmitting ? "Sending..." : "Request Demo"}
													</StyledButton>
												</div>
											</form>
										</div>
									</Modal>
								</div>

								{/* CardSwap Component Area */}
								<div className="relative mt-14 flex h-[450px] w-full items-center justify-center sm:-mt-44 lg:mt-0 lg:h-[600px] lg:justify-end">
									<CardSwap width="100%" height="100%">
										{/* Quotes Card */}
										<Card className="flex flex-col justify-between bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
											<div className="flex flex-col items-center text-center">
												<div className="mb-4 rounded-full bg-blue-500/10 p-3 ring-1 ring-blue-500/20">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-blue-500"
													>
														<path d="M3 3v18h18" />
														<path d="m19 9-5 5-4-4-3 3" />
													</svg>
												</div>
												<h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
													Quotes
												</h3>
												<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
													Create professional quotes in seconds and win more
													work.
												</p>
											</div>

											{/* Middle Section: Line Items */}
											<div className="w-full space-y-3 py-2">
												<div className="flex justify-between text-xs">
													<span className="text-gray-600 dark:text-gray-400">
														Consultation
													</span>
													<span className="font-medium text-gray-900 dark:text-white">
														$150.00
													</span>
												</div>
												<div className="flex justify-between text-xs">
													<span className="text-gray-600 dark:text-gray-400">
														Materials
													</span>
													<span className="font-medium text-gray-900 dark:text-white">
														$2,500.00
													</span>
												</div>
												<div className="flex justify-between text-xs">
													<span className="text-gray-600 dark:text-gray-400">
														Labor (20hrs)
													</span>
													<span className="font-medium text-gray-900 dark:text-white">
														$1,850.00
													</span>
												</div>
											</div>

											{/* Mini Widget: Quote Preview */}
											<div className="w-full rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-3 space-y-2">
												<div className="flex justify-between items-center text-xs">
													<span className="font-medium text-gray-600 dark:text-gray-300">
														Kitchen Remodel
													</span>
													<span className="text-blue-600 dark:text-blue-400 font-semibold">
														#Q-1024
													</span>
												</div>
												<div className="h-px bg-gray-200 dark:bg-gray-800 w-full" />
												<div className="flex justify-between items-center">
													<span className="text-xs text-gray-500">Total</span>
													<span className="text-sm font-bold text-gray-900 dark:text-white">
														$4,500.00
													</span>
												</div>
											</div>
										</Card>

										{/* Clients Card */}
										<Card className="flex flex-col justify-between bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
											<div className="flex flex-col items-center text-center">
												<div className="mb-4 rounded-full bg-purple-500/10 p-3 ring-1 ring-purple-500/20">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-purple-500"
													>
														<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
														<circle cx="9" cy="7" r="4" />
														<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
														<path d="M16 3.13a4 4 0 0 1 0 7.75" />
													</svg>
												</div>
												<h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
													Clients
												</h3>
												<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
													Manage all your client relationships in one place.
												</p>
											</div>

											{/* Middle Section: Contact Details */}
											<div className="flex w-full items-center gap-4 py-2">
												{/* Stock Avatar Placeholder */}
												<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
													<User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
												</div>
												{/* Right Side Details */}
												<div className="flex flex-1 flex-col justify-center space-y-2">
													<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
														<Phone className="h-3.5 w-3.5 shrink-0" />
														<span className="truncate">+1 (555) 123-4567</span>
													</div>
													<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
														<Mail className="h-3.5 w-3.5 shrink-0" />
														<span className="truncate">
															john.doe@example.com
														</span>
													</div>
													<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
														<MapPin className="h-3.5 w-3.5 shrink-0" />
														<span className="truncate">Austin, TX</span>
													</div>
												</div>
											</div>

											{/* Mini Widget: Client Profile */}
											<div className="w-full rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-3 flex items-center gap-3">
												<div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400">
													JD
												</div>
												<div className="text-left flex-1">
													<div className="text-xs font-semibold text-gray-900 dark:text-white">
														John Doe
													</div>
													<div className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1">
														<span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
														Active Client
													</div>
												</div>
											</div>
										</Card>

										{/* Projects Card */}
										<Card className="flex flex-col justify-between bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
											<div className="flex flex-col items-center text-center">
												<div className="mb-4 rounded-full bg-indigo-500/10 p-3 ring-1 ring-indigo-500/20">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-indigo-500"
													>
														<path d="M2 12h20" />
														<path d="M7 12v6h10v-6" />
														<path d="M12 2v20" />
													</svg>
												</div>
												<h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
													Projects
												</h3>
												<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
													Keep your projects organized and on track.
												</p>
											</div>

											{/* Middle Section: Tasks */}
											<div className="w-full space-y-3 py-2">
												<div className="flex w-full items-center justify-between gap-2">
													<div className="flex items-center gap-2">
														<div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
															<Check className="h-3 w-3" />
														</div>
														<span className="text-xs text-gray-600 dark:text-gray-300 line-through">
															Initial Survey
														</span>
													</div>
													<span className="text-[10px] text-gray-400">
														Oct 24
													</span>
												</div>
												<div className="flex w-full items-center justify-between gap-2">
													<div className="flex items-center gap-2">
														<div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
															<Check className="h-3 w-3" />
														</div>
														<span className="text-xs text-gray-600 dark:text-gray-300 line-through">
															Permit Approval
														</span>
													</div>
													<span className="text-[10px] text-gray-400">
														Nov 01
													</span>
												</div>
												<div className="flex w-full items-center justify-between gap-2">
													<div className="flex items-center gap-2">
														<div className="h-5 w-5 rounded-full border border-gray-300 dark:border-gray-600" />
														<span className="text-xs font-medium text-gray-900 dark:text-white">
															Material Delivery
														</span>
													</div>
													<span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
														Today
													</span>
												</div>
											</div>

											{/* Mini Widget: Project Progress */}
											<div className="w-full rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-3 space-y-2">
												<div className="flex justify-between items-center text-xs">
													<span className="font-medium text-gray-900 dark:text-white">
														Site Renovation
													</span>
													<span className="text-indigo-600 dark:text-indigo-400 font-medium">
														75%
													</span>
												</div>
												<div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
													<div className="h-full w-3/4 rounded-full bg-indigo-500" />
												</div>
											</div>
										</Card>

										{/* Invoices Card */}
										<Card className="flex flex-col justify-between bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
											<div className="flex flex-col items-center text-center">
												<div className="mb-4 rounded-full bg-green-500/10 p-3 ring-1 ring-green-500/20">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-green-500"
													>
														<circle cx="12" cy="12" r="10" />
														<path d="M12 6v6l4 2" />
													</svg>
												</div>
												<h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
													Invoices
												</h3>
												<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
													Get paid faster with automated invoicing.
												</p>
											</div>

											{/* Middle Section: Invoice Details */}
											<div className="w-full space-y-3 py-2 text-left">
												<div className="space-y-1">
													<p className="text-[10px] text-gray-500 uppercase">
														Bill To
													</p>
													<p className="text-xs font-medium text-gray-900 dark:text-white">
														Acme Corp
													</p>
													<p className="text-[10px] text-gray-500">
														Attn: Jane Smith
													</p>
												</div>
												<div className="grid grid-cols-2 gap-4 pt-2">
													<div>
														<p className="text-[10px] text-gray-500 uppercase">
															Invoice Date
														</p>
														<p className="text-xs font-medium text-gray-900 dark:text-white">
															Dec 12, 2024
														</p>
													</div>
													<div>
														<p className="text-[10px] text-gray-500 uppercase">
															Due Date
														</p>
														<p className="text-xs font-medium text-gray-900 dark:text-white">
															Dec 26, 2024
														</p>
													</div>
												</div>
											</div>

											{/* Mini Widget: Paid Status */}
											<div className="w-full rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-3 flex justify-between items-center">
												<div className="flex flex-col items-start">
													<span className="text-[10px] text-gray-500 uppercase tracking-wide">
														Amount Due
													</span>
													<span className="text-sm font-bold text-gray-900 dark:text-white">
														$2,800.00
													</span>
												</div>
												<div className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-xs font-medium text-green-700 dark:text-green-400">
													Paid
												</div>
											</div>
										</Card>
									</CardSwap>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
