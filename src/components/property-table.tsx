"use client";

import React, { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import type { Id, Doc } from "../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	BuildingOffice2Icon,
	PlusIcon,
	PencilIcon,
	TrashIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarFilledIcon } from "@heroicons/react/24/solid";

type Property = {
	_id: Id<"clientProperties"> | string; // Allow temp IDs for new items
	propertyName?: string;
	propertyType?:
		| "residential"
		| "commercial"
		| "industrial"
		| "retail"
		| "office"
		| "mixed-use";
	squareFootage?: number;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	country?: string;
	description?: string;
	isPrimary: boolean;
	isNew?: boolean; // Track if this is a new item not yet saved
};

// Helper function to format property type for display
function formatPropertyType(type?: string): string {
	if (!type) return "Not specified";
	return type.charAt(0).toUpperCase() + type.slice(1);
}

interface PropertyTableProps {
	clientId: Id<"clients">;
	properties: Doc<"clientProperties">[];
	onChange?: () => void;
}

export function PropertyTable({
	clientId,
	properties,
	onChange,
}: PropertyTableProps) {
	const toast = useToast();
	const createProperty = useMutation(api.clientProperties.create);
	const updateProperty = useMutation(api.clientProperties.update);
	const deleteProperty = useMutation(api.clientProperties.remove);

	// Local state
	const [editingId, setEditingId] = useState<
		Id<"clientProperties"> | string | null
	>(null);
	const [localProperties, setLocalProperties] = useState<Property[]>([]);
	const [nextTempId, setNextTempId] = useState(1);

	// Combine saved properties with local ones
	const allProperties = useMemo(() => {
		// Convert saved items to our Property type
		const savedItems: Property[] = properties.map((item) => ({
			...item,
			isNew: false,
		}));

		console.log("allProperties useMemo:", {
			savedItems: savedItems.map((p) => ({
				id: p._id,
				name: p.propertyName,
				isNew: p.isNew,
			})),
			localProperties: localProperties.map((p) => ({
				id: p._id,
				name: p.propertyName,
				isNew: p.isNew,
			})),
		});

		// Combine and sort by creation time (newest first)
		return [...savedItems, ...localProperties];
	}, [properties, localProperties]);

	const handleAddProperty = () => {
		const tempId = `temp-${nextTempId}`;

		const newProperty: Property = {
			_id: tempId,
			propertyName: "",
			propertyType: undefined,
			squareFootage: undefined,
			streetAddress: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
			description: "",
			isPrimary: false,
			isNew: true,
		};

		setLocalProperties((prev) => [...prev, newProperty]);
		setEditingId(tempId);
		setNextTempId((prev) => prev + 1);
	};

	const handleEditProperty = (id: Id<"clientProperties"> | string) => {
		console.log("handleEditProperty called with:", {
			id,
			idType: typeof id,
			property: allProperties.find((p) => p._id === id),
		});
		setEditingId(id);
	};

	const handleSaveProperty = async (property: Property) => {
		console.log("handleSaveProperty called with:", {
			propertyId: property._id,
			propertyIdType: typeof property._id,
			isNew: property.isNew,
			propertyName: property.propertyName,
		});

		// Check if this is a new property by looking at the isNew flag or if it's a temporary ID
		const isNewProperty =
			property.isNew ||
			(typeof property._id === "string" && property._id.startsWith("temp-"));

		if (isNewProperty) {
			// Save new property directly to database
			console.log("Creating new property...");
			try {
				await createProperty({
					clientId,
					propertyName: property.propertyName,
					propertyType: property.propertyType,
					squareFootage: property.squareFootage,
					streetAddress: property.streetAddress || "Address Required",
					city: property.city || "City Required",
					state: property.state || "State Required",
					zipCode: property.zipCode || "ZIP Required",
					country: property.country,
					description: property.description,
					isPrimary: property.isPrimary,
				});

				// Remove from local items
				setLocalProperties((prev) =>
					prev.filter((item) => item._id !== property._id)
				);
				setEditingId(null);
				onChange?.();
				toast.success(
					"Property Saved",
					"Property has been successfully saved!"
				);
			} catch (error) {
				console.error("Failed to save property:", error);
				toast.error("Error", "Failed to save property. Please try again.");
			}
		} else {
			// Update existing item in database
			console.log("Updating existing property with ID:", property._id);
			try {
				await updateProperty({
					id: property._id as Id<"clientProperties">,
					propertyName: property.propertyName,
					propertyType: property.propertyType,
					squareFootage: property.squareFootage,
					streetAddress: property.streetAddress,
					city: property.city,
					state: property.state,
					zipCode: property.zipCode,
					country: property.country,
					description: property.description,
					isPrimary: property.isPrimary,
				});
				setEditingId(null);
				onChange?.();
				toast.success(
					"Property Updated",
					"Property has been successfully updated!"
				);
			} catch (error) {
				console.error("Failed to save property:", error);
				toast.error("Error", "Failed to save property. Please try again.");
			}
		}
	};

	const handleDeleteProperty = async (id: Id<"clientProperties"> | string) => {
		// Check if this is a temporary ID (new item not yet saved)
		if (typeof id === "string" && id.startsWith("temp-")) {
			// Remove local item
			setLocalProperties((prev) => prev.filter((item) => item._id !== id));
			if (editingId === id) {
				setEditingId(null);
			}
			toast.success("Property Deleted", "Unsaved property has been removed.");
		} else {
			// Delete from database
			try {
				await deleteProperty({ id: id as Id<"clientProperties"> });
				onChange?.();
				toast.success(
					"Property Deleted",
					"Property has been successfully deleted."
				);
			} catch (error) {
				console.error("Failed to delete property:", error);
				toast.error("Error", "Failed to delete property. Please try again.");
			}
		}
	};

	return (
		<div className="bg-card dark:bg-card backdrop-blur-md border border-border dark:border-border rounded-xl shadow-lg dark:shadow-black/50 ring-1 ring-border/30 dark:ring-border/50">
			<Card className="bg-transparent border-none shadow-none ring-0">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-xl">Properties</CardTitle>
					<Button intent="outline" size="sm" onPress={handleAddProperty}>
						<PlusIcon className="h-4 w-4 mr-2" />
						New Property
					</Button>
				</CardHeader>
				<CardContent>
					{allProperties && allProperties.length > 0 ? (
						<div className="overflow-hidden rounded-lg border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[25%]">Property</TableHead>
										<TableHead className="w-[20%]">Address</TableHead>
										<TableHead className="w-[15%]">City</TableHead>
										<TableHead className="w-[10%]">State</TableHead>
										<TableHead className="w-[10%]">ZIP</TableHead>
										<TableHead className="w-[10%]">Type</TableHead>
										<TableHead className="w-[5%]">Primary</TableHead>
										<TableHead className="w-[5%]">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{allProperties.map((property) => (
										<PropertyRow
											key={property._id}
											property={property}
											isEditing={editingId === property._id}
											onEdit={() => handleEditProperty(property._id)}
											onSave={handleSaveProperty}
											onCancel={() => setEditingId(null)}
											onDelete={() => handleDeleteProperty(property._id)}
										/>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
								<BuildingOffice2Icon className="h-8 w-8 text-gray-400" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
								No properties
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								No properties have been added for this client yet.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

// PropertyRow Component for inline editing
function PropertyRow({
	property,
	isEditing,
	onEdit,
	onSave,
	onCancel,
	onDelete,
}: {
	property: Property;
	isEditing: boolean;
	onEdit: () => void;
	onSave: (property: Property) => void;
	onCancel: () => void;
	onDelete: () => void;
}) {
	const [editedProperty, setEditedProperty] = useState<Property>(property);

	React.useEffect(() => {
		if (isEditing) {
			setEditedProperty(property);
		}
	}, [isEditing, property]);

	const handleFieldChange = (
		field: keyof Property,
		value: string | number | boolean | undefined
	) => {
		setEditedProperty((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = () => {
		console.log("PropertyRow handleSave called with:", {
			propertyId: editedProperty._id,
			propertyIdType: typeof editedProperty._id,
			isNew: editedProperty.isNew,
			originalPropertyId: property._id,
			originalPropertyIdType: typeof property._id,
		});
		onSave(editedProperty);
	};

	if (isEditing) {
		return (
			<TableRow
				className={`bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500 ${property.isNew ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}`}
			>
				<TableCell>
					<Input
						value={editedProperty.propertyName || ""}
						onChange={(e) => handleFieldChange("propertyName", e.target.value)}
						placeholder="Property name..."
						className="w-full"
					/>
				</TableCell>
				<TableCell>
					<Input
						value={editedProperty.streetAddress}
						onChange={(e) => handleFieldChange("streetAddress", e.target.value)}
						placeholder="Street address..."
						className="w-full"
					/>
				</TableCell>
				<TableCell>
					<Input
						value={editedProperty.city}
						onChange={(e) => handleFieldChange("city", e.target.value)}
						placeholder="City..."
						className="w-full"
					/>
				</TableCell>
				<TableCell>
					<Input
						value={editedProperty.state}
						onChange={(e) => handleFieldChange("state", e.target.value)}
						placeholder="State..."
						className="w-full"
					/>
				</TableCell>
				<TableCell>
					<Input
						value={editedProperty.zipCode}
						onChange={(e) => handleFieldChange("zipCode", e.target.value)}
						placeholder="ZIP..."
						className="w-full"
					/>
				</TableCell>
				<TableCell>
					<select
						value={editedProperty.propertyType || ""}
						onChange={(e) =>
							handleFieldChange("propertyType", e.target.value || undefined)
						}
						className="w-full text-sm border border-input bg-background px-2 py-1 rounded"
					>
						<option value="">Select type</option>
						<option value="residential">Residential</option>
						<option value="commercial">Commercial</option>
						<option value="industrial">Industrial</option>
						<option value="retail">Retail</option>
						<option value="office">Office</option>
						<option value="mixed-use">Mixed Use</option>
					</select>
				</TableCell>
				<TableCell>
					<Checkbox
						checked={editedProperty.isPrimary}
						onCheckedChange={(checked) =>
							handleFieldChange("isPrimary", !!checked)
						}
					/>
				</TableCell>
				<TableCell>
					<div className="flex gap-1">
						<Button
							intent="outline"
							size="sq-sm"
							onPress={handleSave}
							aria-label="Save"
						>
							<CheckIcon className="h-3 w-3" />
						</Button>
						<Button
							intent="outline"
							size="sq-sm"
							onPress={onCancel}
							aria-label="Cancel"
						>
							<XMarkIcon className="h-3 w-3" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
		);
	}

	return (
		<TableRow
			className={`hover:bg-muted/50 ${property.isNew ? "bg-yellow-50/30 dark:bg-yellow-900/20 border-l-4 border-l-yellow-400" : ""}`}
		>
			<TableCell className="font-medium">
				<div className="flex items-center gap-2">
					<span>{property.propertyName || "Unnamed Property"}</span>
					{property.isNew && (
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
							Unsaved
						</span>
					)}
				</div>
			</TableCell>
			<TableCell>{property.streetAddress}</TableCell>
			<TableCell>{property.city}</TableCell>
			<TableCell>{property.state}</TableCell>
			<TableCell>{property.zipCode}</TableCell>
			<TableCell>
				{property.propertyType && (
					<Badge variant="outline" className="text-xs">
						{formatPropertyType(property.propertyType)}
					</Badge>
				)}
			</TableCell>
			<TableCell>
				{property.isPrimary && (
					<StarFilledIcon className="h-4 w-4 text-yellow-400" />
				)}
			</TableCell>
			<TableCell>
				<div className="flex gap-1">
					<Button
						intent="outline"
						size="sq-sm"
						onPress={onEdit}
						aria-label="Edit"
					>
						<PencilIcon className="h-3 w-3" />
					</Button>
					<Button
						intent="outline"
						size="sq-sm"
						onPress={onDelete}
						aria-label="Delete"
					>
						<TrashIcon className="h-3 w-3" />
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}
