import {
	View,
	Text,
	Modal,
	Pressable,
	ScrollView,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useState } from "react";
import { useOrganizationList, useOrganization } from "@clerk/clerk-expo";
import { colors, spacing, styles, fontFamily } from "@/lib/theme";
import { ChevronDown, Check, Building, X } from "lucide-react-native";

export function OrganizationSwitcher() {
	const [modalVisible, setModalVisible] = useState(false);
	const { userMemberships, setActive, isLoaded } = useOrganizationList({
		userMemberships: {
			infinite: true,
		},
	});
	const { organization: activeOrg } = useOrganization();
	const [switching, setSwitching] = useState(false);

	const handleOrgSwitch = async (orgId: string) => {
		try {
			setSwitching(true);

			// Switch the organization in Clerk
			await setActive?.({ organization: orgId });

			// Brief delay to ensure Clerk has updated its state
			// The ConvexProvider will automatically reinitialize via the key prop
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Close modal - ConvexProvider will handle the rest
			setModalVisible(false);
		} catch (error) {
			console.error("Failed to switch organization:", error);
			Alert.alert("Error", "Failed to switch organization. Please try again.", [
				{ text: "OK" },
			]);
		} finally {
			setSwitching(false);
		}
	};

	if (!isLoaded) {
		return (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					padding: 8,
					borderRadius: 8,
					backgroundColor: colors.muted,
				}}
			>
				<ActivityIndicator size="small" color={colors.mutedForeground} />
			</View>
		);
	}

	const organizationList = userMemberships?.data || [];

	return (
		<>
			{/* Trigger Button */}
			<Pressable
				style={{
					flexDirection: "row",
					alignItems: "center",
					padding: 8,
					borderRadius: 8,
					backgroundColor: colors.muted,
				}}
				onPress={() => setModalVisible(true)}
			>
				<Text
					style={{
						fontSize: 14,
						fontWeight: "600",
						color: colors.foreground,
						marginRight: 4,
					}}
				>
					{activeOrg?.name || "Personal"}
				</Text>
				<ChevronDown size={16} color={colors.mutedForeground} />
			</Pressable>

			{/* Organization Picker Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View
					style={{
						flex: 1,
						justifyContent: "flex-end",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
					}}
				>
					<View
						style={{
							backgroundColor: "#ffffff",
							borderTopLeftRadius: 20,
							borderTopRightRadius: 20,
							maxHeight: "70%",
						}}
					>
						{/* Header */}
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: spacing.md,
								paddingVertical: spacing.md,
								borderBottomWidth: 1,
								borderBottomColor: colors.border,
							}}
						>
							<Text style={[styles.heading, { fontSize: 18 }]}>
								Switch Organization
							</Text>
							<Pressable
								onPress={() => setModalVisible(false)}
								style={{ padding: 4 }}
							>
								<X size={24} color={colors.foreground} />
							</Pressable>
						</View>

						{/* Organizations List */}
						<ScrollView
							style={{ maxHeight: 400 }}
							contentContainerStyle={{ padding: spacing.md }}
						>
							{organizationList.length > 0 ? (
								organizationList.map((membership) => {
									const isActive = membership.organization.id === activeOrg?.id;

									return (
										<Pressable
											key={membership.organization.id}
											style={{
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "space-between",
												padding: spacing.md,
												borderRadius: 8,
												backgroundColor: isActive
													? colors.muted
													: "transparent",
												marginBottom: spacing.sm,
												borderWidth: 1,
												borderColor: isActive ? colors.primary : colors.border,
											}}
											onPress={() =>
												handleOrgSwitch(membership.organization.id)
											}
											disabled={switching || isActive}
										>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													flex: 1,
												}}
											>
												<View
													style={{
														width: 40,
														height: 40,
														borderRadius: 8,
														backgroundColor: colors.primary,
														alignItems: "center",
														justifyContent: "center",
														marginRight: spacing.sm,
													}}
												>
													<Text
													style={{
														color: "#fff",
														fontFamily: fontFamily.semibold,
														fontSize: 16,
													}}
													>
														{membership.organization.name[0]}
													</Text>
												</View>
												<View style={{ flex: 1 }}>
													<Text
													style={[
														styles.text,
														{ fontFamily: isActive ? fontFamily.semibold : fontFamily.regular },
													]}
													>
														{membership.organization.name}
													</Text>
													<Text
														style={[
															styles.mutedText,
															{ fontSize: 12, marginTop: 2 },
														]}
													>
														{membership.role.charAt(0).toUpperCase() +
															membership.role.slice(1)}
													</Text>
												</View>
											</View>
											{isActive && <Check size={20} color={colors.primary} />}
										</Pressable>
									);
								})
							) : (
								<View
									style={{ alignItems: "center", paddingVertical: spacing.xl }}
								>
									<Building size={48} color={colors.mutedForeground} />
									<Text style={[styles.mutedText, { marginTop: spacing.md }]}>
										No organizations found
									</Text>
									<Text
										style={[styles.mutedText, { fontSize: 12, marginTop: 4 }]}
									>
										You can create one from the web app
									</Text>
								</View>
							)}
						</ScrollView>

						{switching && (
							<View
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: "rgba(255, 255, 255, 0.9)",
									alignItems: "center",
									justifyContent: "center",
									borderTopLeftRadius: 20,
									borderTopRightRadius: 20,
								}}
							>
								<ActivityIndicator size="large" color={colors.primary} />
								<Text style={[styles.text, { marginTop: spacing.md }]}>
									Switching organization...
								</Text>
							</View>
						)}
					</View>
				</View>
			</Modal>
		</>
	);
}
