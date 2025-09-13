import { BuildingOffice2Icon, UserCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Accordion from "@/components/ui/accordion";

interface OnboardingFormProps {
	title?: string;
	subtitle?: string;
}

export function OnboardingForm({
	title = "Client Onboarding",
	subtitle = "Let's gather the essential information to get started.",
}: OnboardingFormProps) {
	return (
		<div className="mx-auto max-w-full px-6 lg:px-12 xl:px-16">
			<div className="mx-auto max-w-6xl pt-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{title}
					</h1>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						{subtitle}
					</p>
				</div>

				<form>
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
								<div className="sm:col-span-4">
									<label
										htmlFor="company-name"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Company name
									</label>
									<div className="mt-2">
										<input
											id="company-name"
											name="company-name"
											type="text"
											autoComplete="organization"
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
											placeholder="e.g., ASMobbin"
										/>
									</div>
								</div>

								<div className="sm:col-span-2">
									<label
										htmlFor="client-status"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Client status
									</label>
									<div className="mt-2 grid grid-cols-1">
										<select
											id="client-status"
											name="client-status"
											className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800"
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
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
											placeholder="Brief description of the company and what they do..."
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Primary Contact Details Section */}
						<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-200 dark:border-white/10 pb-12 md:grid-cols-3">
							<div>
								<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
									Primary Contact Details
								</h2>
								<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
									Information about the main point of contact for this client
									relationship.
								</p>
							</div>

							<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
								<div className="sm:col-span-3">
									<label
										htmlFor="first-name"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										First name
									</label>
									<div className="mt-2">
										<input
											id="first-name"
											name="first-name"
											type="text"
											autoComplete="given-name"
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="last-name"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Last name
									</label>
									<div className="mt-2">
										<input
											id="last-name"
											name="last-name"
											type="text"
											autoComplete="family-name"
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="sm:col-span-4">
									<label
										htmlFor="email"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Email address
									</label>
									<div className="mt-2">
										<input
											id="email"
											name="email"
											type="email"
											autoComplete="email"
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="phone"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Phone number
									</label>
									<div className="mt-2">
										<input
											id="phone"
											name="phone"
											type="tel"
											autoComplete="tel"
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="title"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Job title
									</label>
									<div className="mt-2">
										<input
											id="title"
											name="title"
											type="text"
											autoComplete="organization-title"
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="col-span-full">
									<label
										htmlFor="contact-photo"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Contact photo
									</label>
									<div className="mt-2 flex items-center gap-x-3">
										<UserCircleIcon
											aria-hidden="true"
											className="size-12 text-gray-400 dark:text-gray-500"
										/>
										<button
											type="button"
											className="rounded-md bg-white dark:bg-white/10 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
										>
											Change
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Additional Contacts Section */}
						<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-200 dark:border-white/10 pb-12 md:grid-cols-3">
							<div>
								<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
									Additional Contacts
								</h2>
								<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
									Add other key contacts within the organization who may be
									involved in this relationship.
								</p>
							</div>

							<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
								<div className="col-span-full">
									<Accordion
										items={[
											{
												title: "Additional Contact #1 (Optional)",
												content: (
													<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
														<div className="sm:col-span-3">
															<label
																htmlFor="contact1-first-name"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																First name
															</label>
															<div className="mt-1">
																<input
																	id="contact1-first-name"
																	name="contact1-first-name"
																	type="text"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																	placeholder="Optional"
																/>
															</div>
														</div>

														<div className="sm:col-span-3">
															<label
																htmlFor="contact1-last-name"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Last name
															</label>
															<div className="mt-1">
																<input
																	id="contact1-last-name"
																	name="contact1-last-name"
																	type="text"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																	placeholder="Optional"
																/>
															</div>
														</div>

														<div className="sm:col-span-3">
															<label
																htmlFor="contact1-role"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Role/Title
															</label>
															<div className="mt-1">
																<input
																	id="contact1-role"
																	name="contact1-role"
																	type="text"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																	placeholder="e.g., Manager, Director"
																/>
															</div>
														</div>

														<div className="sm:col-span-3">
															<label
																htmlFor="contact1-department"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Department
															</label>
															<div className="mt-1">
																<input
																	id="contact1-department"
																	name="contact1-department"
																	type="text"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																	placeholder="e.g., Billing Contact, Operations"
																/>
															</div>
														</div>

														<div className="sm:col-span-3">
															<label
																htmlFor="contact1-phone"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Phone number
															</label>
															<div className="mt-1">
																<input
																	id="contact1-phone"
																	name="contact1-phone"
																	type="tel"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																/>
															</div>
														</div>

														<div className="sm:col-span-3">
															<label
																htmlFor="contact1-email"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Email address
															</label>
															<div className="mt-1">
																<input
																	id="contact1-email"
																	name="contact1-email"
																	type="email"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																/>
															</div>
														</div>

														<div className="col-span-full mt-4">
															<button
																type="button"
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
														</div>
													</div>
												),
											},
										]}
									/>
								</div>
							</div>
						</div>

						{/* Property Information Section */}
						<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-200 dark:border-white/10 pb-12 md:grid-cols-3">
							<div>
								<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
									Property Information
								</h2>
								<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
									Details about properties or locations associated with this
									client.
								</p>
							</div>

							<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
								<div className="col-span-full">
									<Accordion
										items={[
											{
												title: "Primary Property (Required)",
												content: (
													<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
														<div className="col-span-full">
															<label
																htmlFor="property-name"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Property name
															</label>
															<div className="mt-2">
																<input
																	id="property-name"
																	name="property-name"
																	type="text"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																	placeholder="e.g., Downtown Office Complex"
																/>
															</div>
														</div>

														<div className="sm:col-span-3">
															<label
																htmlFor="property-type"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Property type
															</label>
															<div className="mt-2 grid grid-cols-1">
																<select
																	id="property-type"
																	name="property-type"
																	className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800"
																>
																	<option value="">Select property type</option>
																	<option value="residential">
																		Residential
																	</option>
																	<option value="commercial">Commercial</option>
																	<option value="industrial">Industrial</option>
																	<option value="retail">Retail</option>
																	<option value="office">Office</option>
																	<option value="mixed-use">Mixed Use</option>
																</select>
																<ChevronDownIcon
																	aria-hidden="true"
																	className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
																/>
															</div>
														</div>

														<div className="sm:col-span-3">
															<label
																htmlFor="square-footage"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Square footage
															</label>
															<div className="mt-2">
																<input
																	id="square-footage"
																	name="square-footage"
																	type="number"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																	placeholder="e.g., 2500"
																/>
															</div>
														</div>

														<div className="col-span-full">
															<label
																htmlFor="street-address"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Street address
															</label>
															<div className="mt-2">
																<input
																	id="street-address"
																	name="street-address"
																	type="text"
																	autoComplete="street-address"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																/>
															</div>
														</div>

														<div className="sm:col-span-2">
															<label
																htmlFor="city"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																City
															</label>
															<div className="mt-2">
																<input
																	id="city"
																	name="city"
																	type="text"
																	autoComplete="address-level2"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																/>
															</div>
														</div>

														<div className="sm:col-span-2">
															<label
																htmlFor="region"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																State / Province
															</label>
															<div className="mt-2">
																<input
																	id="region"
																	name="region"
																	type="text"
																	autoComplete="address-level1"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																/>
															</div>
														</div>

														<div className="sm:col-span-2">
															<label
																htmlFor="postal-code"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																ZIP / Postal code
															</label>
															<div className="mt-2">
																<input
																	id="postal-code"
																	name="postal-code"
																	type="text"
																	autoComplete="postal-code"
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																/>
															</div>
														</div>

														<div className="col-span-full">
															<label
																htmlFor="property-description"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Property description
															</label>
															<div className="mt-2">
																<textarea
																	id="property-description"
																	name="property-description"
																	rows={3}
																	className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
																	placeholder="Brief description of the property, its features, or any special considerations..."
																/>
															</div>
														</div>

														<div className="col-span-full">
															<label
																htmlFor="property-images"
																className="block text-sm/6 font-medium text-gray-900 dark:text-white"
															>
																Property images
															</label>
															<div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-white/25 px-6 py-10">
																<div className="text-center">
																	<BuildingOffice2Icon
																		aria-hidden="true"
																		className="mx-auto size-12 text-gray-400 dark:text-gray-500"
																	/>
																	<div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
																		<label
																			htmlFor="file-upload"
																			className="relative cursor-pointer rounded-md bg-white dark:bg-transparent font-semibold text-blue-600 dark:text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:focus-within:outline-indigo-500 hover:text-blue-500 dark:hover:text-indigo-300"
																		>
																			<span>Upload files</span>
																			<input
																				id="file-upload"
																				name="file-upload"
																				type="file"
																				multiple
																				className="sr-only"
																			/>
																		</label>
																		<p className="pl-1">or drag and drop</p>
																	</div>
																	<p className="text-xs/5 text-gray-500 dark:text-gray-400">
																		PNG, JPG, GIF up to 10MB each
																	</p>
																</div>
															</div>
														</div>
														<div className="col-span-full mt-4">
															<button
																type="button"
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
																Add another property
															</button>
														</div>
													</div>
												),
											},
										]}
									/>
								</div>
							</div>
						</div>

						{/* Custom Categories Section */}
						<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-200 dark:border-white/10 pb-12 md:grid-cols-3">
							<div>
								<h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
									Custom Categories
								</h2>
								<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
									Add custom categories and attributes that help classify and
									organize this client.
								</p>
							</div>

							<div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
								<div className="sm:col-span-3">
									<label
										htmlFor="category"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Category
									</label>
									<div className="mt-2 grid grid-cols-1">
										<select
											id="category"
											name="category"
											className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800"
										>
											<option value="">Select category</option>
											<option value="design">Design</option>
											<option value="development">Development</option>
											<option value="consulting">Consulting</option>
											<option value="maintenance">Maintenance</option>
											<option value="marketing">Marketing</option>
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
										htmlFor="client-size"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Client size
									</label>
									<div className="mt-2 grid grid-cols-1">
										<select
											id="client-size"
											name="client-size"
											className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800"
										>
											<option value="">Select size</option>
											<option value="small">Small (1-10 employees)</option>
											<option value="medium">Medium (11-50 employees)</option>
											<option value="large">Large (51-200 employees)</option>
											<option value="enterprise">
												Enterprise (200+ employees)
											</option>
										</select>
										<ChevronDownIcon
											aria-hidden="true"
											className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="client-type"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Client type
									</label>
									<div className="mt-2 grid grid-cols-1">
										<select
											id="client-type"
											name="client-type"
											className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800"
										>
											<option value="">Select type</option>
											<option value="new-client">New Client</option>
											<option value="existing-client">Existing Client</option>
											<option value="partner">Partner</option>
											<option value="vendor">Vendor</option>
											<option value="contractor">Contractor</option>
										</select>
										<ChevronDownIcon
											aria-hidden="true"
											className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="active-status"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Active status
									</label>
									<div className="mt-2 grid grid-cols-1">
										<select
											id="active-status"
											name="active-status"
											className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800"
										>
											<option value="">Select status</option>
											<option value="yes">Yes</option>
											<option value="no">No</option>
											<option value="pending">Pending</option>
										</select>
										<ChevronDownIcon
											aria-hidden="true"
											className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="project-dimensions"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Project dimensions
									</label>
									<div className="mt-2">
										<input
											id="project-dimensions"
											name="project-dimensions"
											type="text"
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
											placeholder="e.g., 10.0 × 20.0 cm, Large Scale, etc."
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="priority-level"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Priority level
									</label>
									<div className="mt-2 grid grid-cols-1">
										<select
											id="priority-level"
											name="priority-level"
											className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6 [&_option]:bg-white [&_option]:dark:bg-gray-800"
										>
											<option value="">Select priority</option>
											<option value="low">Low</option>
											<option value="medium">Medium</option>
											<option value="high">High</option>
											<option value="urgent">Urgent</option>
										</select>
										<ChevronDownIcon
											aria-hidden="true"
											className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
										/>
									</div>
								</div>

								<div className="col-span-full">
									<label
										htmlFor="tags"
										className="block text-sm/6 font-medium text-gray-900 dark:text-white"
									>
										Tags
									</label>
									<div className="mt-2">
										<input
											id="tags"
											name="tags"
											type="text"
											className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:focus:outline-indigo-500 sm:text-sm/6"
											placeholder="Enter tags separated by commas (e.g., vip, high-volume, long-term)"
										/>
									</div>
									<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
										Separate multiple tags with commas
									</p>
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
										<div className="flex gap-3">
											<div className="flex h-6 shrink-0 items-center">
												<div className="group grid size-4 grid-cols-1">
													<input
														id="property-management"
														name="services"
														type="checkbox"
														value="property-management"
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
													htmlFor="property-management"
													className="font-medium text-gray-900 dark:text-white"
												>
													Property Management
												</label>
												<p className="text-gray-600 dark:text-gray-400">
													Comprehensive property management services including
													maintenance and tenant relations.
												</p>
											</div>
										</div>

										<div className="flex gap-3">
											<div className="flex h-6 shrink-0 items-center">
												<div className="group grid size-4 grid-cols-1">
													<input
														id="maintenance"
														name="services"
														type="checkbox"
														value="maintenance"
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
													htmlFor="maintenance"
													className="font-medium text-gray-900 dark:text-white"
												>
													Maintenance Services
												</label>
												<p className="text-gray-600 dark:text-gray-400">
													Regular maintenance, repairs, and emergency response
													services.
												</p>
											</div>
										</div>

										<div className="flex gap-3">
											<div className="flex h-6 shrink-0 items-center">
												<div className="group grid size-4 grid-cols-1">
													<input
														id="consulting"
														name="services"
														type="checkbox"
														value="consulting"
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
													htmlFor="consulting"
													className="font-medium text-gray-900 dark:text-white"
												>
													Consulting Services
												</label>
												<p className="text-gray-600 dark:text-gray-400">
													Strategic consulting for property optimization and
													investment planning.
												</p>
											</div>
										</div>
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
										<div className="flex items-center gap-x-3">
											<input
												defaultChecked
												id="comm-email"
												name="communication"
												type="radio"
												value="email"
												className="relative size-4 appearance-none rounded-full border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-blue-600 dark:checked:border-indigo-500 checked:bg-blue-600 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-indigo-500"
											/>
											<label
												htmlFor="comm-email"
												className="block text-sm/6 font-medium text-gray-900 dark:text-white"
											>
												Email only
											</label>
										</div>
										<div className="flex items-center gap-x-3">
											<input
												id="comm-phone"
												name="communication"
												type="radio"
												value="phone"
												className="relative size-4 appearance-none rounded-full border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-blue-600 dark:checked:border-indigo-500 checked:bg-blue-600 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-indigo-500"
											/>
											<label
												htmlFor="comm-phone"
												className="block text-sm/6 font-medium text-gray-900 dark:text-white"
											>
												Phone calls for urgent matters
											</label>
										</div>
										<div className="flex items-center gap-x-3">
											<input
												id="comm-both"
												name="communication"
												type="radio"
												value="both"
												className="relative size-4 appearance-none rounded-full border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-blue-600 dark:checked:border-indigo-500 checked:bg-blue-600 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-indigo-500"
											/>
											<label
												htmlFor="comm-both"
												className="block text-sm/6 font-medium text-gray-900 dark:text-white"
											>
												Both email and phone
											</label>
										</div>
									</div>
								</fieldset>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
