import { StyleSheet, Platform } from "react-native";

// Font family - using Outfit to match web app
// On iOS, the font family name is used directly
// On Android, we use the font weight variants
export const fontFamily = {
	regular: Platform.select({
		ios: "Outfit_400Regular",
		android: "Outfit_400Regular",
		default: "Outfit_400Regular",
	}),
	medium: Platform.select({
		ios: "Outfit_500Medium",
		android: "Outfit_500Medium",
		default: "Outfit_500Medium",
	}),
	semibold: Platform.select({
		ios: "Outfit_600SemiBold",
		android: "Outfit_600SemiBold",
		default: "Outfit_600SemiBold",
	}),
	bold: Platform.select({
		ios: "Outfit_700Bold",
		android: "Outfit_700Bold",
		default: "Outfit_700Bold",
	}),
};

// Colors matching the web app's globals.css
export const colors = {
  // Primary brand color
  primary: "rgb(0, 166, 244)",
  primaryForeground: "#ffffff",

  // Background colors
  background: "#ffffff",
  foreground: "#1f2937",

  // Card colors
  card: "#ffffff",
  cardForeground: "#1f2937",

  // Muted colors
  muted: "#f3f4f6",
  mutedForeground: "#6b7280",

  // Border colors
  border: "#e5e7eb",

  // Status colors
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",

  // Semantic colors
  destructive: "#ef4444",
} as const;

// Spacing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// Border radius constants
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Common styles
export const styles = StyleSheet.create({
  // Typography
  heading: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semibold,
    color: colors.foreground,
  },
  text: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.foreground,
  },
  mutedText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.mutedForeground,
  },

  // Card
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  primaryButtonText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: "600",
  },

  // Input
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.foreground,
  },
});

