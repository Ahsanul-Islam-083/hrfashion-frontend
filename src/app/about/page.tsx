"use client";

import { useQuery } from "@tanstack/react-query";
import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { fetchTeam, type TeamMember } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { PageMotion, ScrollReveal } from "@/components/ui/PageMotion";

// ---- Team Card ----
function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group flex flex-col bg-card border border-card-border rounded-sm overflow-hidden hover:shadow-xl transition-shadow duration-[600ms]">
      <div className="aspect-[4/5] overflow-hidden bg-card">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[600ms] ease-out transform-gpu"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs uppercase tracking-widest text-muted mb-1">{member.designation}</p>
        <h3 className="font-serif text-lg text-foreground mb-3">{member.name}</h3>
        <p className="text-sm text-muted leading-relaxed">{member.description}</p>
      </div>
    </div>
  );
}

// ---- Skeleton ----
function TeamSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card border border-card-border rounded-sm overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-card" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-card rounded w-1/3" />
            <div className="h-5 bg-card rounded w-2/3" />
            <div className="h-3 bg-card rounded w-full" />
            <div className="h-3 bg-card rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- FAQ Data ----
const FAQ_ITEMS = [
  {
    q: "Do you offer private label manufacturing?",
    a: "Yes. HR Fashion specialises in private label garment production. We work closely with brands of all sizes to produce custom collections — from design consultation and fabric sourcing through to final delivery — under your own label.",
  },
  {
    q: "What is your minimum order quantity?",
    a: "Our standard MOQ is 300 pieces per style, per colour. For premium bespoke ranges we can accommodate smaller runs — please contact our production team to discuss your specific requirements.",
  },
  {
    q: "How can I apply for a job?",
    a: "Visit our Careers page to browse all open positions. Select any role that suits your background and click \"Apply Now\" to fill in the application form. Our HR team reviews every submission and responds within 7 working days.",
  },
  {
    q: "Do you export internationally?",
    a: "Yes. We export to markets across Europe, North America, the Middle East, and Asia-Pacific. All shipments comply with international trade regulations and we handle end-to-end logistics documentation.",
  },
  {
    q: "How do I track my application status?",
    a: "Log in to your user dashboard and navigate to the Applications section. You will see real-time status updates — Pending, Accepted, or Rejected — for every position you have applied to.",
  },
  {
    q: "What sustainability practices do you follow?",
    a: "Sustainability is central to our production model. We use GOTS-certified organic fabrics where possible, operate zero-discharge dyeing facilities, partner with local artisans to reduce supply chain emissions, and aim for zero-landfill packaging by 2026.",
  },
];

export default function AboutPage() {
  const { data: team = [], isLoading: teamLoading } = useQuery({
    queryKey: QUERY_KEYS.team(),
    queryFn: fetchTeam,
  });

  return (
    <PageMotion>
      <main className="bg-background text-foreground min-h-screen">
        {/* ---- HERO ---- */}
        <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
          <img
            src="https://i.ibb.co.com/MQ0Wbwt/about-Bn.avif"
            alt="HR Fashion atelier"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Established Dhaka, 2018</p>
            <h1 className="text-5xl md:text-7xl font-serif leading-none">About HR Fashion</h1>
          </div>
        </section>

        {/* ---- OUR VISION ---- */}
        <ScrollReveal>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted mb-5">Our Vision</p>
                <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-snug">
                  Craftsmanship for a Conscious World
                </h2>
                <div className="space-y-5 text-muted leading-relaxed">
                  <p>
                    HR Fashion was founded on a single conviction: that garment manufacturing can be both
                    exceptional in quality and responsible in practice. From our atelier in Dhaka we produce
                    collections that meet global export standards — without compromise on the hands that make them.
                  </p>
                  <p>
                    We invest in local textile talent, partnering with skilled artisans whose craft elevates every
                    seam and stitch. Our vertically integrated production process — from organic fabric sourcing to
                    final quality inspection — ensures that every piece leaving our facility is built to endure.
                  </p>
                  <p>
                    Sustainable production is not an add-on for us; it is the framework. We operate
                    closed-loop dyeing facilities, source GOTS-certified materials, and hold ourselves to the
                    environmental benchmarks demanded by the world's leading retail partners.
                  </p>
                </div>
              </div>

              {/* Images grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-sm overflow-hidden row-span-2">
                  <img
                    src="https://i.ibb.co.com/QvkFt8x5/About1.avif"
                    alt="Textile craftsmanship"
                    className="w-full h-full object-cover"
                  />
                </div>
                


                <div className="aspect-[3/2] rounded-sm overflow-hidden">
                  <img
                    src="https://i.ibb.co.com/R4czphSB/About2.avif"
                    alt="Garment production"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/2] rounded-sm overflow-hidden">
                  <img
                    src="https://i.ibb.co.com/JwcpxjL8/About3.avif"
                    alt="Fashion design process"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-card-border" />
        </div>

        {/* ---- THE DREAM TEAM ---- */}
        <ScrollReveal>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-muted mb-5">The Dream Team</p>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-serif max-w-xl leading-snug">
                  The People Behind the Label
                </h2>
                <p className="text-muted text-sm max-w-sm leading-relaxed">
                  Every collection is a collaboration. Meet the creative and operational minds who
                  bring HR Fashion's vision to life, season after season.
                </p>
              </div>
            </div>

            {teamLoading ? (
              <TeamSkeleton />
            ) : team.length === 0 ? (
              <div className="py-24 text-center border border-card-border rounded-sm">
                <p className="text-muted uppercase tracking-widest text-sm">Team profiles coming soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                  <TeamMemberCard key={member._id} member={member} />
                ))}
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-card-border" />
        </div>

        {/* ---- FAQ ---- */}
        <ScrollReveal>
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-muted mb-5">FAQ</p>
              <h2 className="text-4xl md:text-5xl font-serif leading-snug">Common Questions</h2>
            </div>

            <Accordion.Root type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => (
                <Accordion.Item
                  key={idx}
                  value={`item-${idx}`}
                  className="border border-card-border rounded-sm overflow-hidden data-[state=open]:border-card-border transition-colors"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left font-medium text-sm uppercase tracking-widest group hover:text-foreground transition-colors">
                      <span>{item.q}</span>
                      <ChevronDown className="w-4 h-4 text-muted flex-shrink-0 ml-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-hidden text-sm data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
                    <p className="px-6 pb-6 text-muted leading-relaxed">{item.a}</p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </section>
        </ScrollReveal>
      </main>
    </PageMotion>
  );
}
