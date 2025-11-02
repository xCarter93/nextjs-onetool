import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
			<div className="w-full max-w-md">
				<SignUp
					appearance={{
						elements: {
							formButtonPrimary:
								"bg-primary hover:bg-primary/90 text-primary-foreground",
							card: "shadow-xl",
							headerTitle: "text-foreground",
							headerSubtitle: "text-muted-foreground",
							socialButtonsBlockButton:
								"border-border hover:bg-accent hover:text-accent-foreground",
							formFieldLabel: "text-foreground",
							formFieldInput:
								"border-border focus:border-primary focus:ring-primary",
							footerActionLink: "text-primary hover:text-primary/90",
						},
					}}
					routing="path"
					path="/sign-up"
					signInUrl="/sign-in"
					fallbackRedirectUrl="/home"
				/>
			</div>
		</div>
	);
}
