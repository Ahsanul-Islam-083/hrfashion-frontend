export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Legal</p>
        <h1 className="text-4xl md:text-5xl font-serif">Terms of Service</h1>
      </div>

      <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <section>
          <h2 className="text-xl font-medium text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing the HR Fashion website or engaging our manufacturing services, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website or services. These terms apply to all clients, visitors, and users of our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-4">2. Orders and Production</h2>
          <p>
            All manufacturing orders are subject to acceptance by HR Fashion. An order is only confirmed once a formal invoice has been issued and the initial deposit (as outlined in the invoice) has been received. We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion. Production timelines are estimates and may be affected by material availability or unforeseen delays.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-4">3. Quality and Returns</h2>
          <p>
            We take pride in our craftsmanship and adhere to strict quality control standards. Any claims for defects, shortages, or discrepancies must be made in writing within 14 days of receiving the shipment. Since our manufacturing services produce custom goods to client specifications, we do not accept returns or offer refunds for non-defective merchandise.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-4">4. Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to logos, text, graphics, and images, is the property of HR Fashion and is protected by international copyright laws. Any designs or specifications provided by the client remain the intellectual property of the client. By submitting designs for production, the client warrants that they hold the necessary rights and licenses for such designs.
          </p>
        </section>
      </div>
    </main>
  );
}
