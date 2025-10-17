"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface UnsplashImage {
	id: string;
	alt: string;
	url: string;
	downloadLocation?: string;
	photographer?: {
		name: string;
		username: string;
		profileUrl?: string;
	};
	photoUrl?: string;
}

interface UnsplashResponse {
	photos: UnsplashImage[];
	fetchedAt: string;
	isFallback?: boolean;
}

// Default fallback images
const DEFAULT_IMAGES: UnsplashImage[] = [
	{
		id: "fallback-1",
		alt: "Field service team collaboration",
		url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80",
	},
	{
		id: "fallback-2",
		alt: "Professional working on tablet",
		url: "https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80",
	},
	{
		id: "fallback-3",
		alt: "Team meeting and planning",
		url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80",
	},
	{
		id: "fallback-4",
		alt: "Modern office workspace",
		url: "https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80",
	},
	{
		id: "fallback-5",
		alt: "Technology and innovation",
		url: "https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80",
	},
];

export default function HeroSection() {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme } = useTheme();
	const [images, setImages] = useState<UnsplashImage[]>(DEFAULT_IMAGES);

	// Fetch images from Unsplash API
	const fetchImages = async () => {
		try {
			console.log("Fetching images from /api/unsplash...");
			const response = await fetch("/api/unsplash");

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`API error: ${response.status} - ${errorText}`);
				throw new Error(`Failed to fetch images: ${response.statusText}`);
			}

			const data: UnsplashResponse = await response.json();
			console.log("Successfully fetched images:", data.photos.length);
			setImages(data.photos);

			// Track downloads for Unsplash attribution requirements
			if (!data.isFallback) {
				data.photos.forEach((photo) => {
					if (photo.downloadLocation) {
						// Track download in background (non-blocking)
						fetch(photo.downloadLocation).catch(() => {
							// Silently fail if tracking doesn't work
						});
					}
				});
			}
		} catch (error) {
			console.error("Error fetching Unsplash images:", error);
			// Keep using current images or fallback to defaults
			setImages(DEFAULT_IMAGES);
		}
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	// Fetch images on mount and every hour
	useEffect(() => {
		if (!mounted) return;

		// Initial fetch
		fetchImages();

		// Refresh every hour (3600000 ms)
		const interval = setInterval(() => {
			fetchImages();
		}, 3600000);

		return () => clearInterval(interval);
	}, [mounted]);

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
										Streamline Your Field Service Business
									</h1>
									<p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none dark:text-gray-400">
										Manage clients, projects, quotes, and invoices all in one
										powerful platform. OneTool simplifies your field service
										operations so you can focus on growing your business.
									</p>
									<div className="mt-10 flex items-center gap-x-6">
										<a
											href="#"
											className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:outline-blue-500"
										>
											Start Free Trial
										</a>
										<a
											href="#"
											className="text-sm/6 font-semibold text-gray-900 dark:text-white"
										>
											Watch Demo <span aria-hidden="true">→</span>
										</a>
									</div>
								</div>
								<div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
									<div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80">
										<motion.div
											className="relative"
											initial={{ opacity: 0, y: 20 }}
											animate={{
												opacity: 1,
												y: [0, -10, 0],
											}}
											transition={{
												opacity: { duration: 0.6, delay: 0.2 },
												y: {
													duration: 6,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 0.5,
												},
											}}
											whileHover={{
												scale: 1.05,
												y: -5,
												transition: { duration: 0.3 },
											}}
										>
											<Image
												alt={images[0]?.alt || "Small business"}
												src={images[0]?.url || DEFAULT_IMAGES[0].url}
												width={176}
												height={264}
												className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-2xl dark:bg-gray-700/5 transition-all duration-300"
												key={images[0]?.id}
											/>
											<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10" />
											<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
										</motion.div>
									</div>
									<div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
										<motion.div
											className="relative"
											initial={{ opacity: 0, y: 20 }}
											animate={{
												opacity: 1,
												y: [0, -8, 0],
												rotate: [0, 1, 0, -1, 0],
											}}
											transition={{
												opacity: { duration: 0.6, delay: 0.4 },
												y: {
													duration: 7,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 1,
												},
												rotate: {
													duration: 8,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 2,
												},
											}}
											whileHover={{
												scale: 1.05,
												y: -5,
												transition: { duration: 0.3 },
											}}
										>
											<Image
												alt={images[1]?.alt || "Small business"}
												src={images[1]?.url || DEFAULT_IMAGES[1].url}
												width={176}
												height={264}
												className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-2xl dark:bg-gray-700/5 transition-all duration-300"
												key={images[1]?.id}
											/>
											<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10" />
											<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
										</motion.div>
										<motion.div
											className="relative"
											initial={{ opacity: 0, y: 20 }}
											animate={{
												opacity: 1,
												y: [0, -12, 0],
												x: [0, 2, 0, -2, 0],
											}}
											transition={{
												opacity: { duration: 0.6, delay: 0.6 },
												y: {
													duration: 5,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 1.5,
												},
												x: {
													duration: 9,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 0.8,
												},
											}}
											whileHover={{
												scale: 1.05,
												y: -5,
												transition: { duration: 0.3 },
											}}
										>
											<Image
												alt={images[2]?.alt || "Small business"}
												src={images[2]?.url || DEFAULT_IMAGES[2].url}
												width={176}
												height={264}
												className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-2xl dark:bg-gray-700/5 transition-all duration-300"
												key={images[2]?.id}
											/>
											<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10" />
											<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
										</motion.div>
									</div>
									<div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
										<motion.div
											className="relative"
											initial={{ opacity: 0, y: 20 }}
											animate={{
												opacity: 1,
												y: [0, -6, 0],
												scale: [1, 1.02, 1],
											}}
											transition={{
												opacity: { duration: 0.6, delay: 0.8 },
												y: {
													duration: 4,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 2.5,
												},
												scale: {
													duration: 6,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 3,
												},
											}}
											whileHover={{
												scale: 1.05,
												y: -5,
												transition: { duration: 0.3 },
											}}
										>
											<Image
												alt={images[3]?.alt || "Small business"}
												src={images[3]?.url || DEFAULT_IMAGES[3].url}
												width={176}
												height={264}
												className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-2xl dark:bg-gray-700/5 transition-all duration-300"
												key={images[3]?.id}
											/>
											<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10" />
											<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
										</motion.div>
										<motion.div
											className="relative"
											initial={{ opacity: 0, y: 20 }}
											animate={{
												opacity: 1,
												y: [0, -9, 0],
												rotate: [0, -0.5, 0, 0.5, 0],
											}}
											transition={{
												opacity: { duration: 0.6, delay: 1.0 },
												y: {
													duration: 5.5,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 2,
												},
												rotate: {
													duration: 10,
													repeat: Infinity,
													ease: "easeInOut",
													delay: 1.2,
												},
											}}
											whileHover={{
												scale: 1.05,
												y: -5,
												transition: { duration: 0.3 },
											}}
										>
											<Image
												alt={images[4]?.alt || "Small business"}
												src={images[4]?.url || DEFAULT_IMAGES[4].url}
												width={176}
												height={264}
												className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-2xl dark:bg-gray-700/5 transition-all duration-300"
												key={images[4]?.id}
											/>
											<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10" />
											<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
										</motion.div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
