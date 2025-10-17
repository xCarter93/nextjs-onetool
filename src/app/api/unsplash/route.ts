import { env } from "@/env";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

interface UnsplashPhoto {
	id: string;
	alt_description: string | null;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	user: {
		name: string;
		username: string;
		links: {
			html: string;
		};
	};
	links: {
		html: string;
		download_location: string;
	};
}

interface UnsplashSearchResponse {
	total: number;
	total_pages: number;
	results: UnsplashPhoto[];
}

export async function GET() {
	try {
		console.log("Fetching from Unsplash API...");

		// Verify API key exists
		if (!env.UNSPLASH_ACCESS_KEY) {
			console.error("UNSPLASH_ACCESS_KEY is not defined");
			throw new Error("Missing Unsplash API key");
		}

		// Fetch 5 random images with 'Small Business' query
		const response = await fetch(
			`https://api.unsplash.com/search/photos?query=small+business&per_page=5&orientation=portrait&order_by=relevant`,
			{
				headers: {
					Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
				},
				next: {
					revalidate: 3600, // Cache for 1 hour
				},
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Unsplash API error: ${response.status} - ${errorText}`);
			throw new Error(`Unsplash API error: ${response.statusText}`);
		}

		const data: UnsplashSearchResponse = await response.json();

		// Transform the response to only include what we need
		const photos = data.results.map((photo) => ({
			id: photo.id,
			alt: photo.alt_description || "Small business professional",
			url: `${photo.urls.raw}&w=396&h=528&fit=crop&q=80`,
			downloadLocation: photo.links.download_location,
			photographer: {
				name: photo.user.name,
				username: photo.user.username,
				profileUrl: photo.user.links.html,
			},
			photoUrl: photo.links.html,
		}));

		return NextResponse.json(
			{
				photos,
				fetchedAt: new Date().toISOString(),
			},
			{
				headers: {
					"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
				},
			}
		);
	} catch (error) {
		console.error("Error fetching Unsplash images:", error);

		// Return fallback images (the original hardcoded ones)
		return NextResponse.json(
			{
				photos: [
					{
						id: "fallback-1",
						alt: "Field service team collaboration",
						url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80",
						photographer: { name: "Unsplash", username: "unsplash" },
					},
					{
						id: "fallback-2",
						alt: "Professional working on tablet",
						url: "https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80",
						photographer: { name: "Unsplash", username: "unsplash" },
					},
					{
						id: "fallback-3",
						alt: "Team meeting and planning",
						url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80",
						photographer: { name: "Unsplash", username: "unsplash" },
					},
					{
						id: "fallback-4",
						alt: "Modern office workspace",
						url: "https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80",
						photographer: { name: "Unsplash", username: "unsplash" },
					},
					{
						id: "fallback-5",
						alt: "Technology and innovation",
						url: "https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80",
						photographer: { name: "Unsplash", username: "unsplash" },
					},
				],
				fetchedAt: new Date().toISOString(),
				isFallback: true,
			},
			{
				status: 200,
			}
		);
	}
}
