"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	BuildingOffice2Icon,
	EnvelopeIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

// Test data for the client
const clientData = {
	id: "1",
	companyName: "ASMobbin",
	status: "Lead",
	primaryContact: {
		name: "Mr. John Smith",
		phone: {
			main: "+1 650 213 7390",
			work: "+1 650 213 7379",
		},
		email: "jdoe.mobbin@gmail.com",
	},
	leadSource: "Word Of Mouth",
	categories: [
		{ label: "Category", value: "Design" },
		{ label: "Size", value: "10.0 cm" },
		{ label: "Active", value: "Yes" },
		{ label: "Dimensions", value: "10.0 × 20.0 cm" },
		{ label: "Type", value: "Design" },
	],
	properties: [
		{
			id: 1,
			address: "1226 University Dr, Menlo Park, CA 94025, USA",
			city: "Menlo Park",
			state: "California",
			zipCode: "94025",
		},
		{
			id: 2,
			address: "75 Ayer Rajah Crescent #02-02",
			city: "Singapore",
			state: "California",
			zipCode: "139953",
		},
	],
	contacts: [
		{
			id: 1,
			name: "Mr. Alex Smith",
			role: "Manager",
			department: "Billing Contact",
			phone: "(650) 213-7390",
			email: "alexsmith.mobbin+1@gmail.com",
		},
	],
	billingHistory: {
		currentBalance: 0,
		hasHistory: false,
	},
	schedule: [
		{
			id: 1,
			title: "New Dashboard Design",
			description: "Create a new dashboard for ASMobbin new product feature",
			date: "Aug 31, 2025 20:00",
			assignee: "Sam Lee",
		},
	],
};

export default function ClientDetailPage() {
	const params = useParams();
	const clientId = params.clientId as string;

	// In a real application, you would use the clientId to fetch client data
	// const clientData = await fetchClient(clientId);

	// For now, we're using test data
	return (
		<div className="min-h-[100vh] flex-1 md:min-h-min">
			{/* Enhanced Background with Gradient */}
			<div className="relative bg-gradient-to-br from-background via-muted/30 to-muted/60 dark:from-background dark:via-muted/20 dark:to-muted/40 min-h-[100vh] md:min-h-min rounded-xl">
				{/* Subtle Pattern Overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.1),transparent_50%)] rounded-xl" />

				<div className="relative px-6 pt-8 pb-20">
					<div className="mx-auto">
						{/* Success Message */}
						<div className="mb-6 rounded-md bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-green-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium text-green-800 dark:text-green-200">
										Task created for client {clientId}
									</p>
								</div>
							</div>
						</div>

						{/* Client Header */}
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-4">
								<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
									<BuildingOffice2Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<div className="flex items-center gap-3">
										<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
											{clientData.companyName}
										</h1>
										<Badge
											variant="secondary"
											className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
										>
											{clientData.status}
										</Badge>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Button intent="outline" size="sm">
									<EnvelopeIcon className="h-4 w-4 mr-2" />
									Email
								</Button>
								<Button intent="outline" size="sm">
									Edit
								</Button>
								<Button intent="outline" size="sm">
									More Actions
								</Button>
							</div>
						</div>

						{/* Two Column Layout */}
						<div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
							{/* Main Content - Left Column */}
							<div className="xl:col-span-3 space-y-8">
								{/* Properties Section */}
								<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<Card className="bg-transparent border-none shadow-none ring-0">
										<CardHeader className="flex flex-row items-center justify-between">
											<CardTitle className="text-xl">Properties</CardTitle>
											<Button intent="outline" size="sm">
												<PlusIcon className="h-4 w-4 mr-2" />
												New Property
											</Button>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												{clientData.properties.map((property) => (
													<div
														key={property.id}
														className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
													>
														<div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
															<div>
																<p className="font-medium text-gray-900 dark:text-white">
																	{property.address.split(",")[0]}
																</p>
																<p className="text-gray-600 dark:text-gray-400">
																	{property.address}
																</p>
															</div>
															<div>
																<p className="text-gray-900 dark:text-white">
																	{property.city}
																</p>
															</div>
															<div>
																<p className="text-gray-900 dark:text-white">
																	{property.state}
																</p>
															</div>
															<div>
																<p className="text-gray-900 dark:text-white">
																	{property.zipCode}
																</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Contacts Section */}
								<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<Card className="bg-transparent border-none shadow-none ring-0">
										<CardHeader>
											<CardTitle className="text-xl">Contacts</CardTitle>
										</CardHeader>
										<CardContent>
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Name</TableHead>
														<TableHead>Role</TableHead>
														<TableHead>Phone</TableHead>
														<TableHead>Email</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{clientData.contacts.map((contact) => (
														<TableRow key={contact.id}>
															<TableCell className="font-medium">
																{contact.name}
															</TableCell>
															<TableCell>
																<div>
																	<p>{contact.role}</p>
																	<p className="text-sm text-gray-500 dark:text-gray-400">
																		{contact.department}
																	</p>
																</div>
															</TableCell>
															<TableCell>{contact.phone}</TableCell>
															<TableCell>{contact.email}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</CardContent>
									</Card>
								</div>

								{/* Overview Section with Tabs */}
								<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<Card className="bg-transparent border-none shadow-none ring-0">
										<CardHeader className="flex flex-row items-center justify-between">
											<CardTitle className="text-xl">Overview</CardTitle>
											<Button
												intent="outline"
												size="sm"
												className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
											>
												New
											</Button>
										</CardHeader>
										<CardContent>
											<Tabs defaultValue="active-work" className="w-full">
												<TabsList className="grid w-full grid-cols-5">
													<TabsTrigger value="active-work">
														Active Work
													</TabsTrigger>
													<TabsTrigger value="requests">Requests</TabsTrigger>
													<TabsTrigger value="quotes">Quotes</TabsTrigger>
													<TabsTrigger value="jobs">Jobs</TabsTrigger>
													<TabsTrigger value="invoices">Invoices</TabsTrigger>
												</TabsList>
												<TabsContent value="active-work" className="mt-6">
													<div className="flex flex-col items-center justify-center py-12 text-center">
														<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
															<BuildingOffice2Icon className="h-8 w-8 text-gray-400" />
														</div>
														<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
															No active work
														</h3>
														<p className="text-gray-600 dark:text-gray-400">
															No active jobs, invoices or quotes for this client
															yet
														</p>
													</div>
												</TabsContent>
												<TabsContent value="requests" className="mt-6">
													<div className="text-center py-8">
														<p className="text-gray-600 dark:text-gray-400">
															No requests found
														</p>
													</div>
												</TabsContent>
												<TabsContent value="quotes" className="mt-6">
													<div className="text-center py-8">
														<p className="text-gray-600 dark:text-gray-400">
															No quotes found
														</p>
													</div>
												</TabsContent>
												<TabsContent value="jobs" className="mt-6">
													<div className="text-center py-8">
														<p className="text-gray-600 dark:text-gray-400">
															No jobs found
														</p>
													</div>
												</TabsContent>
												<TabsContent value="invoices" className="mt-6">
													<div className="text-center py-8">
														<p className="text-gray-600 dark:text-gray-400">
															No invoices found
														</p>
													</div>
												</TabsContent>
											</Tabs>
										</CardContent>
									</Card>
								</div>

								{/* Schedule Section */}
								<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
									<Card className="bg-transparent border-none shadow-none ring-0">
										<CardHeader className="flex flex-row items-center justify-between">
											<CardTitle className="text-xl">Schedule</CardTitle>
											<Button
												intent="outline"
												size="sm"
												className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
											>
												New
											</Button>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="font-medium text-gray-900 dark:text-white">
													August
												</div>
												{clientData.schedule.map((item) => (
													<div
														key={item.id}
														className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
													>
														<input
															type="checkbox"
															className="mt-1 rounded border-gray-300 dark:border-gray-600"
														/>
														<div className="flex-1">
															<h4 className="font-medium text-gray-900 dark:text-white">
																{item.title}
															</h4>
															<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
																{item.description}
															</p>
														</div>
														<div className="text-right text-sm">
															<p className="text-gray-900 dark:text-white">
																{item.date}
															</p>
															<p className="text-gray-600 dark:text-gray-400">
																Assigned to {item.assignee}
															</p>
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								</div>
							</div>

							{/* Contact Info Sidebar - Right Column */}
							<div className="xl:col-span-1">
								<div className="sticky top-24 space-y-6">
									{/* Contact Info Card */}
									<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<Card className="bg-transparent border-none shadow-none ring-0">
											<CardHeader>
												<CardTitle className="text-lg">Contact info</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Primary contact
													</span>
													<span className="text-sm text-gray-900 dark:text-white">
														{clientData.primaryContact.name}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Main
													</span>
													<div className="flex items-center gap-2">
														<span className="text-sm text-gray-900 dark:text-white">
															{clientData.primaryContact.phone.main}
														</span>
														<StarSolidIcon className="h-4 w-4 text-yellow-400" />
													</div>
												</div>
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Work
													</span>
													<span className="text-sm text-gray-900 dark:text-white">
														{clientData.primaryContact.phone.work}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Main
													</span>
													<span className="text-sm text-gray-900 dark:text-white">
														{clientData.primaryContact.email}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">
														Lead Source
													</span>
													<span className="text-sm text-gray-900 dark:text-white">
														{clientData.leadSource}
													</span>
												</div>
												{clientData.categories.map((category, index) => (
													<div key={index} className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															{category.label}
														</span>
														<span className="text-sm text-gray-900 dark:text-white">
															{category.value}
														</span>
													</div>
												))}
											</CardContent>
										</Card>
									</div>

									{/* Tags Card */}
									<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<Card className="bg-transparent border-none shadow-none ring-0">
											<CardHeader className="flex flex-row items-center justify-between">
												<CardTitle className="text-lg">Tags</CardTitle>
												<Button intent="outline" size="sm">
													<PlusIcon className="h-4 w-4 mr-2" />
													New Tag
												</Button>
											</CardHeader>
											<CardContent>
												<p className="text-sm text-gray-600 dark:text-gray-400 italic">
													This client has no tags
												</p>
											</CardContent>
										</Card>
									</div>

									{/* Last Client Communication */}
									<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<Card className="bg-transparent border-none shadow-none ring-0">
											<CardHeader>
												<CardTitle className="text-lg">
													Last client communication
												</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm text-gray-600 dark:text-gray-400 italic">
													You haven&apos;t sent any client communications yet
												</p>
											</CardContent>
										</Card>
									</div>

									{/* Billing History */}
									<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<Card className="bg-transparent border-none shadow-none ring-0">
											<CardHeader className="flex flex-row items-center justify-between">
												<CardTitle className="text-lg">
													Billing history
												</CardTitle>
												<Button
													intent="outline"
													size="sm"
													className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
												>
													New
												</Button>
											</CardHeader>
											<CardContent className="space-y-4">
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
												<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
													<div className="flex justify-between">
														<span className="text-sm text-gray-600 dark:text-gray-400">
															Current balance
														</span>
														<span className="text-sm font-medium text-gray-900 dark:text-white">
															Rp0.00
														</span>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>

									{/* Internal Notes */}
									<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
										<Card className="bg-transparent border-none shadow-none ring-0">
											<CardHeader>
												<CardTitle className="text-lg">
													Internal notes
												</CardTitle>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Internal notes will only be seen by your team
												</p>
											</CardHeader>
											<CardContent>
												<div className="space-y-4">
													<textarea
														className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
														placeholder="Note details"
													/>
													<div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
														<p className="text-sm text-gray-600 dark:text-gray-400">
															Drag your files here or{" "}
															<Button
																intent="plain"
																className="p-0 h-auto text-blue-600 dark:text-blue-400"
															>
																Select a File
															</Button>
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
