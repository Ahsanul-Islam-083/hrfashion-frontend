import Link from "next/link";
import { Factory, Package, PenTool, Scissors, CheckCircle, Truck } from "lucide-react";

const SERVICES = [
  {
    icon: Factory,
    title: "Private Label Manufacturing",
    description: "End-to-end production for brands seeking premium quality garments with custom labeling."
  },
  {
    icon: Package,
    title: "Bulk & Wholesale",
    description: "Scalable production capacity to fulfill large-scale orders with consistent quality."
  },
  {
    icon: PenTool,
    title: "Custom Design & Sampling",
    description: "Turn concepts into reality with our expert design team and rapid prototyping."
  },
  {
    icon: Scissors,
    title: "Fabric Sourcing",
    description: "Access our global network of premium textile suppliers for the perfect material."
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description: "Rigorous compliance and quality control standards at every stage of production."
  },
  {
    icon: Truck,
    title: "Export & Logistics",
    description: "Seamless global shipping and supply chain management for on-time delivery."
  }
];

export function Services() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-serif mb-4">Our Services</h2>
        <p className="text-neutral-500 max-w-xl mx-auto">
          Beyond retail, HR Fashion is a premier manufacturing partner. We offer comprehensive B2B solutions for the modern garment industry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {SERVICES.map((service, idx) => (
          <div 
            key={idx} 
            className="group bg-neutral-50 dark:bg-neutral-900/50 p-8 rounded-sm border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-colors"
          >
            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <service.icon className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-lg mb-3">{service.title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link 
          href="/contact" 
          className="inline-flex items-center justify-center px-8 py-4 border border-foreground text-sm font-medium uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-sm"
        >
          Inquire for Manufacturing
        </Link>
      </div>
    </section>
  );
}
