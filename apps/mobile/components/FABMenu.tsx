import React, { useState } from "react";
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	Modal,
	TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, X, CheckSquare } from "lucide-react-native";
import { colors, fontFamily, radius, spacing } from "@/lib/theme";
import { useRouter } from "expo-router";

// Tab bar height (approximate, includes safe area)
const TAB_BAR_HEIGHT = 49;

interface FABMenuProps {
	/** Optional custom style for the FAB button */
	style?: any;
}

export function FABMenu({ style }: FABMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const insets = useSafeAreaInsets();

	// Calculate bottom offset to position above tab bar
	const bottomOffset = 24;
	// In modal, we need to account for tab bar + safe area
	const modalBottomOffset = bottomOffset + TAB_BAR_HEIGHT + insets.bottom;

	const handleNewTask = () => {
		setIsOpen(false);
		router.push("/tasks/new");
	};

	return (
		<>
			{/* Backdrop Modal */}
			<Modal
				visible={isOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsOpen(false)}
			>
				<TouchableOpacity
					style={styles.backdrop}
					activeOpacity={1}
					onPress={() => setIsOpen(false)}
				>
					{/* Menu Items */}
					<View
						style={[
							styles.menuContainer,
							{ bottom: modalBottomOffset + 56 + spacing.md },
						]}
					>
						<Pressable
							style={({ pressed }) => [
								styles.menuItem,
								pressed && styles.menuItemPressed,
							]}
							onPress={handleNewTask}
						>
							<View
								style={[
									styles.menuIconContainer,
									{ backgroundColor: colors.primary },
								]}
							>
								<CheckSquare size={20} color="#fff" />
							</View>
							<Text style={styles.menuLabel}>New Task</Text>
						</Pressable>
					</View>

					{/* Close FAB Button - Same position as open button */}
					<Pressable
						style={({ pressed }) => [
							styles.fabBase,
							styles.fabOpen,
							pressed && styles.fabPressed,
							{ bottom: modalBottomOffset, right: 24 },
							style,
						]}
						onPress={() => setIsOpen(false)}
					>
						<X size={24} color="#ffffff" />
					</Pressable>
				</TouchableOpacity>
			</Modal>

			{/* Main FAB Button (always visible when closed) */}
			{!isOpen && (
				<Pressable
					style={({ pressed }) => [
						styles.fabBase,
						styles.fab,
						pressed && styles.fabPressed,
						style,
					]}
					onPress={() => setIsOpen(true)}
				>
					<Plus size={24} color="#ffffff" />
				</Pressable>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	menuContainer: {
		position: "absolute",
		right: 24,
		alignItems: "flex-end",
		gap: spacing.sm,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.card,
		borderRadius: radius.full,
		paddingVertical: spacing.sm,
		paddingLeft: spacing.sm,
		paddingRight: spacing.md,
		gap: spacing.sm,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		minWidth: 150,
	},
	menuItemPressed: {
		opacity: 0.8,
	},
	menuIconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	menuLabel: {
		fontSize: 15,
		fontFamily: fontFamily.semibold,
		color: colors.foreground,
	},
	fabBase: {
		position: "absolute",
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	fab: {
		bottom: 24,
		right: 24,
		backgroundColor: colors.primary,
	},
	fabOpen: {
		backgroundColor: colors.danger,
	},
	fabPressed: {
		opacity: 0.8,
	},
});

