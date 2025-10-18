import HeroSection from "@/components/hero-section";
import FeatureSection from "@/components/feature-section";
import FAQSection from "@/components/faq-section";
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

			{/* Features Section */}
			<section id="features">
				<FeatureSection />
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

			{/* FAQ Section */}
			<section id="faq">
				<FAQSection />
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
