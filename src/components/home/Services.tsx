"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import Link from "next/link";
import {
  Factory, Package, Scissors, ShieldCheck, Truck, Globe,
  PenTool, CheckCircle, Wrench, Star, Layers, Box,
  type LucideProps,
} from "lucide-react";
import type { ElementType } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";

const ICON_MAP: Record<string, ElementType<LucideProps>> = {
  Factory, Package, Scissors, ShieldCheck, Truck, Globe,
  PenTool, CheckCircle, Wrench, Star, Layers, Box,
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <Wrench className="w-5 h-5" />;
  return <Icon className="w-5 h-5" />;
}

const FALLBACK = [
  { icon: "Factory", title: "Private Label Manufacturing", description: "End-to-end production for brands seeking premium quality garments with custom labeling." },
  { icon: "Package", title: "Bulk & Wholesale", description: "Scalable production capacity to fulfill large-scale orders with consistent quality." },
  { icon: "PenTool", title: "Custom Design & Sampling", description: "Turn concepts into reality with our expert design team and rapid prototyping." },
  { icon: "Scissors", title: "Fabric Sourcing", description: "Access our global network of premium textile suppliers for the perfect material." },
  { icon: "CheckCircle", title: "Quality Assurance", description: "Rigorous compliance and quality control standards at every stage of production." },
  { icon: "Truck", title: "Export & Logistics", description: "Seamless global shipping and supply chain management for on-time delivery." },
];

export function Services() {
  const { data: services } = useQuery({
    queryKey: QUERY_KEYS.services(),
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 5,
  });

  const items = services && services.length > 0
    ? [...services].sort((a, b) => a.order - b.order)
    : FALLBACK;

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-3xl font-serif mb-4">Our Services</h2>
        <p className="text-muted max-w-xl mx-auto">
          Beyond retail, HR Fashion is a premier manufacturing partner. We offer comprehensive B2B solutions for the modern garment industry.
        </p>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {items.map((service, idx) => (
          <StaggerItem key={"_id" in service ? String(service._id) : idx}>
            <div className="group bg-card p-8 rounded-sm border border-card-border overflow-hidden hover:shadow-xl transition-shadow duration-[600ms] h-full">
              <div className="w-12 h-12 bg-accent text-pure-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-[600ms] ease-out transform-gpu rounded-sm">
                <ServiceIcon name={service.icon} />
              </div>
              <h3 className="font-medium text-lg mb-3">{service.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{service.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ScrollReveal className="text-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 border border-card-border text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
        >
          Inquire for Manufacturing
        </Link>
      </ScrollReveal>
    </section>
  );
}
