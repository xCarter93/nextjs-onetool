"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
	{
		question: "What is OneTool and who is it for?",
		answer:
			"OneTool is a comprehensive field service management platform designed for contractors, landscapers, HVAC technicians, electricians, and other service professionals. It streamlines client management, project tracking, quoting, invoicing, and task scheduling in one unified platform.",
	},
	{
		question: "How does OneTool help me manage my clients?",
		answer:
			"OneTool provides a centralized database for all your client information, including contact details, service history, property information, and communication logs. You can easily search, filter, and organize clients, set up automated reminders, and track every interaction to deliver exceptional service.",
	},
	{
		question: "Can I create and send professional quotes and invoices?",
		answer:
			"Yes! OneTool includes a powerful quoting and invoicing system. Create customized quotes with line items, taxes, and your company branding. Send them directly via email with e-signature capabilities for quick approvals. Convert approved quotes to invoices with one click and track payment status.",
	},
	{
		question: "Is OneTool accessible on mobile devices?",
		answer:
			"Absolutely. OneTool is built as a responsive web application that works seamlessly on smartphones, tablets, and desktop computers. Access your client data, update project statuses, create quotes, and manage tasks from anywhere with an internet connection.",
	},
	{
		question: "How does task scheduling work?",
		answer:
			"OneTool's task scheduling system lets you create tasks, assign them to team members, set due dates and priorities, and track completion status. You can view tasks in list or calendar format, set reminders, and get notifications when tasks are completed or overdue.",
	},
	{
		question: "Can multiple team members use OneTool?",
		answer:
			"Yes! OneTool supports team collaboration with organization-based access. Add team members to your organization, assign roles and permissions, and work together in real-time. Everyone stays synchronized with instant updates across all devices.",
	},
	{
		question: "What kind of support do you offer?",
		answer:
			"We provide comprehensive support including detailed documentation, video tutorials, and email support. Premium plan subscribers also get priority support with faster response times and access to one-on-one onboarding assistance.",
	},
	{
		question: "How secure is my data?",
		answer:
			"Security is our top priority. OneTool uses industry-standard encryption for data transmission and storage. Your data is hosted on secure servers with regular backups, and we comply with data protection regulations. You maintain full ownership of your data and can export it at any time.",
	},
	{
		question: "Can I import my existing client data?",
		answer:
			"Yes! OneTool supports CSV imports, making it easy to migrate your existing client data. Simply export your data from your current system, map the fields, and import it into OneTool. We also provide guidance to help you with the migration process.",
	},
	{
		question: "What happens if I need to cancel my subscription?",
		answer:
			"You can cancel your subscription at any time with no penalties. Your data remains accessible for 30 days after cancellation, giving you time to export everything you need. We also offer a full refund within the first 14 days if OneTool isn't the right fit for you.",
	},
];

export default function FAQSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
			<div className="mx-auto max-w-4xl px-6 lg:px-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h2 className="text-base font-semibold leading-7 text-primary">
						FAQ
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
						Frequently Asked Questions
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
						Everything you need to know about OneTool and how it can transform
						your field service business.
					</p>
				</motion.div>

				{/* FAQ Items */}
				<div className="mt-16 space-y-4">
					{faqs.map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
							className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
						>
							<button
								onClick={() => toggleFAQ(index)}
								className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
							>
								<span className="text-lg font-semibold text-gray-900 dark:text-white">
									{faq.question}
								</span>
								<motion.div
									animate={{ rotate: openIndex === index ? 180 : 0 }}
									transition={{ duration: 0.3 }}
									className="ml-4 flex-shrink-0"
								>
									<ChevronDown className="h-5 w-5 text-primary" />
								</motion.div>
							</button>

							<AnimatePresence>
								{openIndex === index && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="overflow-hidden"
									>
										<div className="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
											<p className="text-base leading-7 text-gray-600 dark:text-gray-400">
												{faq.answer}
											</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="mt-16 text-center"
				>
					<p className="text-base leading-7 text-gray-600 dark:text-gray-400">
						Still have questions?
					</p>
					<a
						href="mailto:support@onetool.com"
						className="mt-2 inline-flex items-center text-base font-semibold text-primary transition-colors hover:text-primary/80"
					>
						Contact our support team →
					</a>
				</motion.div>
			</div>
		</div>
	);
}
