/**
 * Shared types for Unsplash API integration
 */

/**
 * Unsplash photo from API response
 */
export interface UnsplashPhoto {
	id: string;
	alt_description: string | null;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	links: {
		self: string;
		html: string;
		download: string;
		download_location: string;
	};
	user: {
		id: string;
		username: string;
		name: string;
		portfolio_url?: string;
		bio?: string;
		location?: string;
		links: {
			html: string;
		};
	};
}

/**
 * Unsplash search API response
 */
export interface UnsplashSearchResponse {
	results: UnsplashPhoto[];
	total: number;
	total_pages: number;
}

/**
 * Simplified Unsplash image for client use
 */
export interface UnsplashImage {
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

/**
 * Response from Unsplash API route
 */
export interface UnsplashResponse {
	photos: UnsplashImage[];
	fetchedAt: string;
	isFallback?: boolean;
}

