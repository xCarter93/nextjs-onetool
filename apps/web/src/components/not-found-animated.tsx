"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function NotFoundAnimated() {
	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-[--bg] text-[--foreground]">
			{/* Background decorative blobs */}
			<motion.div
				aria-hidden
				className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-linear-to-br from-blue-500/25 to-indigo-500/25 blur-3xl"
				initial={{ opacity: 0.35, scale: 0.9 }}
				animate={{ opacity: [0.35, 0.5, 0.35], scale: [0.9, 1, 0.9] }}
				transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				aria-hidden
				className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-linear-to-tr from-cyan-400/25 to-sky-600/25 blur-3xl"
				initial={{ opacity: 0.3, scale: 1 }}
				animate={{ opacity: [0.3, 0.45, 0.3], scale: [1, 1.05, 1] }}
				transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
			/>

			{/* Content */}
			<div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
				<motion.div
					className="mb-8 rounded-2xl border border-white/10 bg-white/60 p-4 backdrop-blur-md shadow-xl ring-1 ring-black/5 dark:bg-white/5"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<motion.div
						className="mx-auto h-64"
						initial={{ rotate: -6, scale: 0.95 }}
						animate={{ rotate: [-6, 6, -6], scale: [0.95, 1, 0.95] }}
						transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					>
						<Image
							priority
							alt="OneTool logo"
							src="/OneTool.png"
							width={256}
							height={256}
							className="h-full w-full object-contain drop-shadow-lg"
						/>
					</motion.div>
				</motion.div>

				<div className="text-center">
					<motion.h1
						className="text-5xl font-extrabold tracking-tight sm:text-6xl"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-300">
							404 — Page Not Found
						</span>
					</motion.h1>
					<motion.p
						className="mt-4 max-w-xl text-balance text-base text-gray-600 dark:text-gray-300 sm:text-lg"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						We couldn’t find the page you’re looking for. It may have been moved
						or no longer exists.
					</motion.p>

					<div className="mt-8 flex items-center justify-center gap-4">
						<motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
							<Link
								href="/home"
								className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400"
							>
								Return Home
							</Link>
						</motion.div>
						<motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
							<Link
								href="/projects"
								className="inline-flex items-center rounded-lg border border-gray-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-white/90 dark:border-white/15 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10"
							>
								View Projects
							</Link>
						</motion.div>
					</div>
				</div>

				{/* Subtle orbiting dots */}
				<motion.div
					aria-hidden
					className="pointer-events-none absolute inset-0"
					initial={{ rotate: 0 }}
					animate={{ rotate: 360 }}
					transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
				>
					<div className="absolute left-1/2 top-24 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500/60 shadow-[0_0_12px_theme(colors.blue.400)]" />
					<div className="absolute left-[15%] top-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_10px_theme(colors.cyan.400)]" />
					<div className="absolute right-[18%] bottom-[22%] h-1.5 w-1.5 rounded-full bg-indigo-400/60 shadow-[0_0_10px_theme(colors.indigo.400)]" />
				</motion.div>
			</div>
		</div>
	);
}
