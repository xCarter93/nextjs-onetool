"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@onetool/backend/convex/_generated/api";
import {
	Map,
	MapMarker,
	MarkerContent,
	MarkerPopup,
	MapControls,
	useMap,
} from "@/components/ui/map";
import { StyledButton } from "@/components/ui/styled/styled-button";
import { Card } from "@/components/ui/card";
import { MapPin, BarChart3, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Match the approximate height of the LineChart6 component (header ~220px + chart 360px + padding)
// Must use explicit height (not min-height) for MapLibre GL to render properly
const MAP_HEIGHT = "h-[580px]";

type ClientPropertiesMapProps = {
	onToggleView: () => void;
	className?: string;
};

function MapBoundsHandler({
	properties,
}: {
	properties: Array<{ latitude: number; longitude: number }>;
}) {
	const { map, isLoaded } = useMap();
	const hasFitted = useRef(false);

	useEffect(() => {
		if (!map || !isLoaded || hasFitted.current || properties.length === 0)
			return;

		// Calculate bounds
		const lngs = properties.map((p) => p.longitude);
		const lats = properties.map((p) => p.latitude);

		const minLng = Math.min(...lngs);
		const maxLng = Math.max(...lngs);
		const minLat = Math.min(...lats);
		const maxLat = Math.max(...lats);

		// Add padding
		const padding = 50;

		if (properties.length === 1) {
			// Single property - center on it with zoom (further out)
			map.flyTo({
				center: [properties[0].longitude, properties[0].latitude],
				zoom: 11,
				duration: 1000,
			});
		} else {
			// Multiple properties - fit bounds with lower max zoom
			map.fitBounds(
				[
					[minLng, minLat],
					[maxLng, maxLat],
				],
				{
					padding,
					duration: 1000,
					maxZoom: 12,
				}
			);
		}

		hasFitted.current = true;
	}, [map, isLoaded, properties]);

	return null;
}

export default function ClientPropertiesMap({
	onToggleView,
	className,
}: ClientPropertiesMapProps) {
	const router = useRouter();
	const propertiesData = useQuery(api.clientProperties.listGeocodedWithClients);

	const isLoading = propertiesData === undefined;
	const properties = propertiesData?.properties ?? [];
	const totalCount = propertiesData?.totalCount ?? 0;
	const geocodedCount = propertiesData?.geocodedCount ?? 0;

	// Calculate center from properties or use default
	const defaultCenter = useMemo(() => {
		if (properties.length === 0) {
			return { lng: -98.5795, lat: 39.8283 }; // Center of US
		}
		const avgLng =
			properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length;
		const avgLat =
			properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length;
		return { lng: avgLng, lat: avgLat };
	}, [properties]);

	const handleViewClient = (clientId: string) => {
		router.push(`/clients/${clientId}`);
	};

	const formatAddress = (property: (typeof properties)[0]) => {
		if (property.formattedAddress) {
			return property.formattedAddress;
		}
		return `${property.streetAddress}, ${property.city}, ${property.state} ${property.zipCode}`;
	};

	if (isLoading) {
		return (
			<Card
				className={cn(
					"relative w-full p-0 border border-border/60 bg-card/70 shadow-sm ring-1 ring-border/40 backdrop-blur-sm flex items-center justify-center",
					MAP_HEIGHT,
					className
				)}
			>
				<div className="flex gap-1">
					<span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
					<span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:150ms]" />
					<span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:300ms]" />
				</div>
			</Card>
		);
	}

	return (
		<Card
			className={cn(
				"relative w-full p-0 border border-border/60 bg-card/70 shadow-sm ring-1 ring-border/40 backdrop-blur-sm overflow-hidden",
				MAP_HEIGHT,
				className
			)}
		>
			<Map
				center={[defaultCenter.lng, defaultCenter.lat]}
				zoom={properties.length === 0 ? 4 : 6}
				scrollZoom={false}
			>
				<MapBoundsHandler properties={properties} />
				<MapControls position="bottom-right" showZoom />

				{properties.map((property) => (
					<MapMarker
						key={property._id}
						longitude={property.longitude}
						latitude={property.latitude}
					>
						<MarkerContent>
							<div className="relative h-6 w-6 rounded-full border-2 border-white bg-primary shadow-lg flex items-center justify-center">
								<MapPin className="h-3 w-3 text-primary-foreground" />
							</div>
						</MarkerContent>
						<MarkerPopup closeButton className="min-w-[240px] p-0">
							<div className="p-4 space-y-4">
								<div className="space-y-1.5">
									<p className="text-sm font-medium text-foreground leading-snug">
										{formatAddress(property)}
									</p>
									<p className="text-xs text-muted-foreground">
										{property.clientCompanyName}
									</p>
								</div>
								<StyledButton
									size="sm"
									intent="primary"
									className="w-full"
									onClick={() => handleViewClient(property.clientId)}
									showArrow={false}
								>
									<span className="flex items-center gap-1.5">
										View Client
										<ExternalLink className="h-3 w-3" />
									</span>
								</StyledButton>
							</div>
						</MarkerPopup>
					</MapMarker>
				))}
			</Map>

			{/* Stats Overlay */}
			<div className="absolute top-3 left-3 z-10">
				<div className="bg-background/90 backdrop-blur-sm border border-border rounded-md px-3 py-2 shadow-sm">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium">
							{geocodedCount} of {totalCount} properties mapped
						</span>
					</div>
				</div>
			</div>

			{/* Toggle Button */}
			<div className="absolute bottom-4 left-4 z-10">
				<StyledButton
					intent="primary"
					size="md"
					onClick={onToggleView}
					icon={<BarChart3 className="h-4 w-4" />}
					showArrow={false}
					title="Switch to chart view"
					className="rounded-full h-11 w-11 p-0 justify-center"
				/>
			</div>

			{/* Empty State */}
			{properties.length === 0 && (
				<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
					<div className="text-center space-y-2">
						<MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
						<p className="text-sm text-muted-foreground">
							No geocoded properties yet
						</p>
						<p className="text-xs text-muted-foreground/70">
							Add addresses with location data to see them on the map
						</p>
					</div>
				</div>
			)}
		</Card>
	);
}
