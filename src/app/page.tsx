import { Hero } from "@/components/home/Hero";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { Categories } from "@/components/home/Categories";
import { Services } from "@/components/home/Services";
import { Statistics } from "@/components/home/Statistics";
import { Testimonials } from "@/components/home/Testimonials";
import { AIAssistantTeaser } from "@/components/home/AIAssistantTeaser";
import { Newsletter } from "@/components/home/Newsletter";
import { CallToAction } from "@/components/home/CallToAction";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedCollections />
      <Categories />
      <Services />
      <AIAssistantTeaser />
      <Statistics />
      <Testimonials />
      <CallToAction />
      <Newsletter />
    </main>
  );
}
