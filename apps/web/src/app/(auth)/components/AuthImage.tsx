"use client";

import { motion, type Transition } from "framer-motion";

interface AuthImageProps {
	mode: "sign-in" | "sign-up";
}

const BASE_TRANSITION: Transition = { ease: "anticipate", duration: 0.5 };

export function AuthImage({ mode }: AuthImageProps) {
	return (
		<div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
			{/* Sign-in image - slides in from left when sign-in mode */}
			<motion.div
				initial={false}
				animate={{
					x: mode === "sign-in" ? "0%" : "-100%",
				}}
				transition={BASE_TRANSITION}
				className="absolute inset-0 bg-slate-200"
				style={{
					backgroundImage:
						"url(https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80)",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			{/* Sign-up image - slides in from right when sign-up mode */}
			<motion.div
				initial={false}
				animate={{
					x: mode === "sign-up" ? "0%" : "100%",
				}}
				transition={BASE_TRANSITION}
				className="absolute inset-0 bg-slate-200"
				style={{
					backgroundImage:
						"url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80)",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
		</div>
	);
}
