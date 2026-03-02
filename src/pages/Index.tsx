import HeroSection from "@/components/HeroSection";
import AboutPreviewSection from "@/components/AboutPreviewSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import DistributorCTA from "@/components/DistributorCTA";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO
        title="Saria Perfumes | Premium Turkish Fragrances"
        description="Discover Saria 69, Holigan, Royal Touch, and Black Kiss collections—bold Turkish perfumery crafted in Istanbul for men, women, and unisex patrons."
        path="/"
        image="https://i.ibb.co/dwN5nCSS/Saria-Perfumes-4.jpg"
      />
      <HeroSection />
      <AboutPreviewSection />
      <CategoryCarousel />
      <FeaturedProducts />
      <AboutSection />
      <DistributorCTA />
      <TestimonialSection />
    </>
  );
};

export default Index;
