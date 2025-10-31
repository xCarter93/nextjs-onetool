import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/hooks/use-toast";
import { ConfirmDialogProvider } from "@/hooks/use-confirm-dialog";
import { DynamicTitle } from "@/components/shared/dynamic-title";
import "./globals.css";
import { env } from "@/env";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "OneTool",
	description: "All-in-one business management platform for modern teams",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ClerkProvider
					publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
					afterSignOutUrl="/"
					appearance={{
						cssLayerName: "clerk",
					}}
				>
					<ConvexClientProvider>
						<ThemeProvider>
							<DynamicTitle />
							<ToastProvider position="top-right" maxToasts={5}>
								<ConfirmDialogProvider>{children}</ConfirmDialogProvider>
							</ToastProvider>
						</ThemeProvider>
					</ConvexClientProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
