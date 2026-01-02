import { View, Text, Modal, Pressable, ScrollView, Alert, Image } from "react-native";
import { useState } from "react";
import { useUser, useAuth, useOrganization } from "@clerk/clerk-expo";
import { colors, spacing, styles, fontFamily } from "@/lib/theme";
import { User, Mail, Building, LogOut, Shield, X } from "lucide-react-native";

export function ProfileModal() {
	const [modalVisible, setModalVisible] = useState(false);
	const { user } = useUser();
	const { signOut } = useAuth();
	const { organization, membership } = useOrganization();

	const handleSignOut = () => {
		Alert.alert("Sign Out", "Are you sure you want to sign out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Sign Out",
				style: "destructive",
				onPress: () => {
					setModalVisible(false);
					signOut();
				},
			},
		]);
	};

	return (
		<>
			{/* Trigger Button */}
			<Pressable
				style={{
					width: 36,
					height: 36,
					borderRadius: 18,
					backgroundColor: user?.imageUrl ? "transparent" : colors.primary,
					alignItems: "center",
					justifyContent: "center",
					overflow: "hidden",
				}}
				onPress={() => setModalVisible(true)}
			>
			{user?.imageUrl ? (
				<Image
					source={{ uri: user.imageUrl }}
					style={{
						width: 36,
						height: 36,
						borderRadius: 18,
					}}
				/>
			) : (
				<Text style={{ color: "#fff", fontFamily: fontFamily.semibold, fontSize: 14 }}>
					{user?.firstName?.[0] ||
						user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
				</Text>
			)}
			</Pressable>

			{/* Profile Modal */}
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
							<Text style={[styles.heading, { fontSize: 18 }]}>Profile</Text>
							<Pressable
								onPress={() => setModalVisible(false)}
								style={{ padding: 4 }}
							>
								<X size={24} color={colors.foreground} />
							</Pressable>
						</View>

						{/* Content */}
						<ScrollView
							style={{ maxHeight: 500 }}
							contentContainerStyle={{ padding: spacing.md }}
						>
							{/* User Avatar & Name */}
							<View style={{ alignItems: "center", marginBottom: spacing.lg }}>
								{user?.imageUrl ? (
									<Image
										source={{ uri: user.imageUrl }}
										style={{
											width: 80,
											height: 80,
											borderRadius: 40,
											marginBottom: spacing.md,
										}}
									/>
								) : (
									<View
										style={{
											width: 80,
											height: 80,
											borderRadius: 40,
											backgroundColor: colors.primary,
											alignItems: "center",
											justifyContent: "center",
											marginBottom: spacing.md,
										}}
									>
						<Text
							style={{ color: "#fff", fontSize: 32, fontFamily: fontFamily.semibold }}
						>
							{user?.firstName?.[0] ||
								user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
						</Text>
									</View>
								)}

								<Text
									style={[styles.heading, { fontSize: 20, marginBottom: 4 }]}
								>
									{user?.firstName} {user?.lastName}
								</Text>
								<Text style={styles.mutedText}>
									{user?.primaryEmailAddress?.emailAddress}
								</Text>
							</View>

							{/* Account Details */}
							<View
								style={{
									backgroundColor: colors.muted,
									borderRadius: 12,
									padding: spacing.md,
								}}
							>
								{/* Email */}
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										paddingVertical: spacing.sm,
									}}
								>
									<Mail size={20} color={colors.mutedForeground} />
									<View style={{ marginLeft: spacing.md, flex: 1 }}>
										<Text style={[styles.mutedText, { fontSize: 12 }]}>
											Email
										</Text>
										<Text style={styles.text}>
											{user?.primaryEmailAddress?.emailAddress}
										</Text>
									</View>
								</View>

								{/* Organization */}
								{organization && (
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											paddingVertical: spacing.sm,
											marginTop: spacing.sm,
											borderTopWidth: 1,
											borderTopColor: colors.border,
										}}
									>
										<Building size={20} color={colors.mutedForeground} />
										<View style={{ marginLeft: spacing.md, flex: 1 }}>
											<Text style={[styles.mutedText, { fontSize: 12 }]}>
												Organization
											</Text>
											<Text style={styles.text}>{organization.name}</Text>
										</View>
									</View>
								)}

								{/* Role */}
								{membership && (
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											paddingVertical: spacing.sm,
											marginTop: spacing.sm,
											borderTopWidth: 1,
											borderTopColor: colors.border,
										}}
									>
										<Shield size={20} color={colors.mutedForeground} />
										<View style={{ marginLeft: spacing.md, flex: 1 }}>
											<Text style={[styles.mutedText, { fontSize: 12 }]}>
												Role
											</Text>
											<Text style={styles.text}>
												{membership.role.charAt(0).toUpperCase() +
													membership.role.slice(1)}
											</Text>
										</View>
									</View>
								)}
							</View>

							{/* Sign Out Button */}
							<Pressable
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									paddingVertical: spacing.md,
									borderRadius: 8,
									marginTop: spacing.lg,
									backgroundColor: colors.muted,
								}}
								onPress={handleSignOut}
							>
								<LogOut size={20} color={colors.danger} />
								<Text
									style={[
										styles.text,
					{
						marginLeft: spacing.sm,
						color: colors.danger,
						fontFamily: fontFamily.semibold,
					},
									]}
								>
									Sign Out
								</Text>
							</Pressable>

							{/* App Info */}
							<View style={{ alignItems: "center", marginTop: spacing.lg }}>
								<Text style={[styles.mutedText, { fontSize: 12 }]}>
									OneTool Mobile
								</Text>
								<Text
									style={[styles.mutedText, { fontSize: 12, marginTop: 4 }]}
								>
									Version 1.0.0
								</Text>
							</View>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</>
	);
}
