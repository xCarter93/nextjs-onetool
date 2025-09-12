import HeroSection from "@/components/hero-section";
import FeatureBento from "@/components/feature-bento";
import PricingSection from "@/components/pricing-section";
import GlowLine from "@/components/glowline";
import AppNavbar from "@/components/app-navbar";
import Footer from "@/components/footer";

export default function Home() {
	return (
		<>
			{/* Sticky Navbar */}
			<AppNavbar />

			{/* Hero Section */}
			<section id="home">
				<HeroSection />
			</section>

			{/* Blue glowline separator */}
			<div className="relative w-full">
				<GlowLine
					orientation="horizontal"
					position="50%"
					color="blue"
					className="opacity-60"
				/>
			</div>

			{/* Feature Bento Section */}
			<section id="features">
				<FeatureBento />
			</section>

			{/* Blue glowline separator */}
			<div className="relative w-full">
				<GlowLine
					orientation="horizontal"
					position="50%"
					color="blue"
					className="opacity-60"
				/>
			</div>

			{/* Pricing Section */}
			<section id="pricing">
				<PricingSection />
			</section>

			{/* Blue glowline separator */}
			<div className="relative w-full">
				<GlowLine
					orientation="horizontal"
					position="50%"
					color="blue"
					className="opacity-60"
				/>
			</div>

			{/* Footer */}
			<Footer />
		</>
	);
}
