import { SignUp } from "@clerk/nextjs";
import Orb from "@/components/Orb";

export default function SignUpPage() {
	return (
		<div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-linear-to-b from-primary via-primary/70 to-gray-100">
			{/* Orb Background */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
				<div className="w-[1100px] h-[1100px]">
					<Orb
						hue={0}
						hoverIntensity={0}
						rotateOnHover={false}
						backgroundColor="#000000"
					/>
				</div>
			</div>

			{/* Clerk Component */}
			<div className="relative z-10 w-full max-w-2xl">
				<SignUp
					appearance={{
						elements: {
							rootBox: "w-full scale-120 flex justify-center",
							logoImage: "w-50 h-50",
							formButtonPrimary:
								"bg-primary/10 hover:bg-primary/15 text-primary hover:text-primary/80 ring-1 ring-primary/30 hover:ring-primary/40 shadow-sm hover:shadow-md backdrop-blur-sm transition-all duration-200",
							card: "shadow-xl backdrop-blur-sm bg-background/95 mx-auto",
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
