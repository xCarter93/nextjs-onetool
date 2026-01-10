"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { AuthImage } from "./AuthImage";

const BASE_TRANSITION: Transition = { ease: "anticipate", duration: 0.5 };

// Shared Clerk appearance configuration (preserving original styling)
const clerkAppearance = {
	elements: {
		rootBox: "w-full scale-120 flex justify-center",
		logoImage: "w-50 h-50",
		formButtonPrimary:
			"bg-primary/10 hover:bg-primary/15 text-primary hover:text-primary/80 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm transition-all duration-200",
		card: "shadow-xl backdrop-blur-sm bg-background/95",
		headerTitle: "text-foreground",
		headerSubtitle: "text-muted-foreground",
		socialButtonsBlockButton:
			"border-border hover:bg-accent hover:text-accent-foreground",
		formFieldLabel: "text-foreground",
		formFieldInput:
			"border-border focus:border-primary focus:ring-primary",
		footerActionLink: "text-primary hover:text-primary/90",
	},
};

interface SignInUpFormProps {
	mode: "sign-in" | "sign-up";
}


export function SignInUpForm({ mode }: SignInUpFormProps) {
	return (
		<>
			{/* Left side - Form with gradient background */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-linear-to-b from-primary via-primary/70 to-gray-100">
				<div className="w-full max-w-md">
					{/* Clerk Form with animation */}
					<AnimatePresence mode="wait">
						<motion.div
							key={mode}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={BASE_TRANSITION}
						>
							{mode === "sign-in" ? (
								<SignIn
									appearance={clerkAppearance}
									routing="path"
									path="/sign-in"
									signUpUrl="/sign-up"
									fallbackRedirectUrl="/home"
								/>
							) : (
								<SignUp
									appearance={clerkAppearance}
									routing="path"
									path="/sign-up"
									signInUrl="/sign-in"
									fallbackRedirectUrl="/home"
								/>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			{/* Right side - Image */}
			<AuthImage mode={mode} />
		</>
	);
}

export default SignInUpForm;
