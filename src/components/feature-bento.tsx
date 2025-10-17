import Image from "next/image";

export default function FeatureBento() {
	return (
		<div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
			<div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
				<h2 className="text-base/7 font-semibold text-blue-600 dark:text-blue-400">
					Streamline operations
				</h2>
				<p className="mt-2 max-w-lg text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl dark:text-white">
					Everything you need to run your field service business
				</p>
				<div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
					<div className="relative lg:col-span-3">
						<div className="absolute inset-0 rounded-lg bg-white max-lg:rounded-t-4xl lg:rounded-tl-4xl dark:bg-gray-800" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
							<Image
								alt="Field service team managing client relationships"
								src="/ClientList.webp"
								width={400}
								height={320}
								className="h-80 w-full object-cover"
								style={{ objectPosition: "20% center" }}
							/>
							<div className="p-10 pt-4">
								<h3 className="text-sm/4 font-semibold text-blue-600 dark:text-blue-400">
									Client Management
								</h3>
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
									Organize all your clients in one place
								</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
									Keep detailed client profiles with contact information,
									service history, and preferences. Never lose track of
									important client details again.
								</p>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl lg:rounded-tl-4xl dark:outline-white/15" />
					</div>
					<div className="relative lg:col-span-3">
						<div className="absolute inset-0 rounded-lg bg-white lg:rounded-tr-4xl dark:bg-gray-800" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
							<Image
								alt="Project management and tracking dashboard"
								src="/Projects.webp"
								width={400}
								height={320}
								className="h-80 w-full object-cover"
							/>
							<div className="p-10 pt-4">
								<h3 className="text-sm/4 font-semibold text-blue-600 dark:text-blue-400">
									Project Tracking
								</h3>
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
									Manage projects from start to finish
								</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
									Track project status, deadlines, and progress in real-time.
									Assign tasks, set priorities, and keep your entire team
									aligned on project goals.
								</p>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-tr-4xl dark:outline-white/15" />
					</div>
					<div className="relative lg:col-span-2">
						<div className="absolute inset-0 rounded-lg bg-white lg:rounded-bl-4xl dark:bg-gray-800" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
							<Image
								alt="Professional quote and invoice creation interface"
								src="/QuotePage.webp"
								width={400}
								height={320}
								className="h-80 w-full object-cover"
							/>
							<div className="p-10 pt-4">
								<h3 className="text-sm/4 font-semibold text-blue-600 dark:text-blue-400">
									Quoting & Invoicing
								</h3>
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
									Create professional quotes instantly
								</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
									Generate beautiful quotes and invoices with your branding.
									Include line items, taxes, and terms. Send via email with
									e-signature capabilities.
								</p>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-bl-4xl dark:outline-white/15" />
					</div>
					<div className="relative lg:col-span-2">
						<div className="absolute inset-0 rounded-lg bg-white dark:bg-gray-800" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
							<Image
								alt="Task scheduling and calendar management interface"
								src="/TaskList.webp"
								width={400}
								height={320}
								className="h-80 w-full object-cover"
							/>
							<div className="p-10 pt-4">
								<h3 className="text-sm/4 font-semibold text-blue-600 dark:text-blue-400">
									Task Scheduling
								</h3>
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
									Schedule and track all your tasks
								</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
									Plan your day with smart scheduling. Set reminders, assign
									tasks to team members, and track completion in real-time.
									Never miss a deadline again.
								</p>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 dark:outline-white/15" />
					</div>
					<div className="relative lg:col-span-2">
						<div className="absolute inset-0 rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-br-4xl dark:bg-gray-800" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
							<Image
								alt="Mobile responsive interface for field service management"
								src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-network.png"
								width={400}
								height={320}
								className="h-80 w-full object-cover dark:hidden"
							/>
							<Image
								alt="Mobile responsive interface for field service management"
								src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-network.png"
								width={400}
								height={320}
								className="h-80 w-full object-cover not-dark:hidden"
							/>
							<div className="p-10 pt-4">
								<h3 className="text-sm/4 font-semibold text-blue-600 dark:text-blue-400">
									Mobile Access
								</h3>
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
									Work from anywhere, anytime
								</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
									Access your business data on the go with our responsive web
									app. Check schedules, update clients, and manage projects from
									your phone or tablet.
								</p>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-br-4xl dark:outline-white/15" />
					</div>
				</div>
			</div>
		</div>
	);
}
