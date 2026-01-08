import HeroSection from "@/app/components/hero-section";
import FeatureSection from "@/app/components/feature-section";
import FAQSection from "@/app/components/faq-section";
import PricingSection from "@/app/components/pricing-section";
import ShowcaseSection from "@/app/components/showcase-section";
import GlowLine from "@/app/components/glowline";
import AppNavbar from "@/app/components/app-navbar";
import Footer from "@/app/components/footer";

export default function Home() {
	return (
		<div className="overflow-x-hidden">
			{/* Sticky Navbar */}
			<AppNavbar />

			{/* Hero Section */}
			<section id="home" className="relative overflow-hidden">
				<HeroSection />
			</section>

			{/* Blue glowline separator */}
			<div className="relative w-full h-px">
				<GlowLine
					orientation="horizontal"
					position="50%"
					color="blue"
					className="opacity-60"
				/>
			</div>

			{/* Features Section */}
			<section id="features" className="relative overflow-hidden">
				<FeatureSection />
			</section>

			{/* Blue glowline separator */}
			<div className="relative w-full h-px">
				<GlowLine
					orientation="horizontal"
					position="50%"
					color="blue"
					className="opacity-60"
				/>
			</div>

			{/* FAQ Section */}
			<section id="faq" className="relative overflow-hidden">
				<FAQSection />
			</section>

			{/* Blue glowline separator */}
			<div className="relative w-full h-px">
				<GlowLine
					orientation="horizontal"
					position="50%"
					color="blue"
					className="opacity-60"
				/>
			</div>

			{/* Community Showcase Section - Only renders if public pages exist */}
			<ShowcaseSection />

			{/* Blue glowline separator */}
			<div className="relative w-full h-px">
				<GlowLine
					orientation="horizontal"
					position="50%"
					color="blue"
					className="opacity-60"
				/>
			</div>

			{/* Pricing Section */}
			<section id="pricing" className="relative overflow-hidden">
				<PricingSection />
			</section>

			{/* Blue glowline separator */}
			<div className="relative w-full h-px">
				<GlowLine
					orientation="horizontal"
					position="50%"
					color="blue"
					className="opacity-60"
				/>
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}
