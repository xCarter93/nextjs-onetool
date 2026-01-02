import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	StyleSheet,
	ActivityIndicator,
	KeyboardTypeOptions,
} from "react-native";
import { colors, fontFamily, radius, spacing } from "@/lib/theme";
import { Pencil, Check, X } from "lucide-react-native";

interface EditableFieldProps {
	label: string;
	value: string | undefined;
	onSave: (value: string) => Promise<void>;
	placeholder?: string;
	multiline?: boolean;
	numberOfLines?: number;
	keyboardType?: KeyboardTypeOptions;
	maxLength?: number;
	editable?: boolean;
	renderValue?: (value: string | undefined) => React.ReactNode;
}

export function EditableField({
	label,
	value,
	onSave,
	placeholder = "Not set",
	multiline = false,
	numberOfLines = 1,
	keyboardType = "default",
	maxLength,
	editable = true,
	renderValue,
}: EditableFieldProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(value || "");
	const [isSaving, setIsSaving] = useState(false);
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	useEffect(() => {
		setEditValue(value || "");
	}, [value]);

	const handleEdit = () => {
		setEditValue(value || "");
		setIsEditing(true);
	};

	const handleCancel = () => {
		setEditValue(value || "");
		setIsEditing(false);
	};

	const handleSave = async () => {
		if (editValue === value) {
			setIsEditing(false);
			return;
		}

		setIsSaving(true);
		try {
			await onSave(editValue);
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to save:", error);
			// Keep editing mode open on error
		} finally {
			setIsSaving(false);
		}
	};

	if (isEditing) {
		return (
			<View style={styles.container}>
				<Text style={styles.label}>{label}</Text>
				<View style={styles.editRow}>
					<TextInput
						ref={inputRef}
						style={[
							styles.input,
							multiline && {
								height: numberOfLines * 24,
								textAlignVertical: "top",
							},
						]}
						value={editValue}
						onChangeText={setEditValue}
						placeholder={placeholder}
						placeholderTextColor={colors.mutedForeground}
						multiline={multiline}
						numberOfLines={numberOfLines}
						keyboardType={keyboardType}
						maxLength={maxLength}
						editable={!isSaving}
					/>
					<View style={styles.actions}>
						{isSaving ? (
							<ActivityIndicator size="small" color={colors.primary} />
						) : (
							<>
								<Pressable
									onPress={handleSave}
									style={({ pressed }) => [
										styles.actionButton,
										styles.saveButton,
										pressed && styles.actionPressed,
									]}
								>
									<Check size={16} color={colors.success} />
								</Pressable>
								<Pressable
									onPress={handleCancel}
									style={({ pressed }) => [
										styles.actionButton,
										styles.cancelButton,
										pressed && styles.actionPressed,
									]}
								>
									<X size={16} color={colors.danger} />
								</Pressable>
							</>
						)}
					</View>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.labelRow}>
				<Text style={styles.label}>{label}</Text>
				{editable && (
					<Pressable
						onPress={handleEdit}
						style={({ pressed }) => [
							styles.editButton,
							pressed && styles.actionPressed,
						]}
					>
						<Pencil size={14} color={colors.mutedForeground} />
					</Pressable>
				)}
			</View>
			<View style={styles.valueContainer}>
				{renderValue ? (
					renderValue(value)
				) : (
					<Text style={[styles.value, !value && styles.placeholder]}>
						{value || placeholder}
					</Text>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.md,
	},
	labelRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.xs,
	},
	label: {
		fontSize: 13,
		fontFamily: fontFamily.medium,
		color: colors.mutedForeground,
	},
	editButton: {
		padding: spacing.xs,
	},
	valueContainer: {
		minHeight: 24,
	},
	value: {
		fontSize: 15,
		fontFamily: fontFamily.regular,
		color: colors.foreground,
	},
	placeholder: {
		color: colors.mutedForeground,
		fontStyle: "italic",
	},
	editRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: colors.primary,
		borderRadius: radius.md,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		fontSize: 15,
		fontFamily: fontFamily.regular,
		color: colors.foreground,
		backgroundColor: colors.background,
	},
	actions: {
		flexDirection: "row",
		gap: spacing.xs,
	},
	actionButton: {
		width: 32,
		height: 32,
		borderRadius: radius.md,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
	},
	saveButton: {
		backgroundColor: "#dcfce7",
		borderColor: "#86efac",
	},
	cancelButton: {
		backgroundColor: "#fee2e2",
		borderColor: "#fecaca",
	},
	actionPressed: {
		opacity: 0.7,
	},
});
