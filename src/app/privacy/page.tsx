export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Legal</p>
        <h1 className="text-4xl md:text-5xl font-serif">Privacy Policy</h1>
      </div>

      <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <section>
          <h2 className="text-xl font-medium text-foreground mb-4">1. Information Collection</h2>
          <p>
            At HR Fashion, we are committed to protecting the privacy of our clients, partners, and website visitors. We collect personal information such as your name, contact details, shipping address, and business information when you register an account, place an order for garment manufacturing, or contact our support team. We also automatically collect non-identifiable technical data (such as IP addresses and browser types) to improve our website experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-4">2. Use of Your Information</h2>
          <p>
            The information we collect is used primarily to fulfill your manufacturing orders, process payments securely, and deliver our services efficiently. We may also use your contact information to communicate order updates, send invoices, and, if you have opted in, provide you with our latest catalogs and promotional offers. We do not sell or rent your personal information to third-party marketers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-4">3. Data Security and Sharing</h2>
          <p>
            We implement robust physical, technical, and administrative security measures to safeguard your personal and commercial data against unauthorized access or disclosure. We only share necessary information with trusted third-party service providers—such as payment gateways and logistics partners—strictly for the purpose of fulfilling your order. These partners are legally bound to keep your information confidential.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground mb-4">4. Your Rights</h2>
          <p>
            You have the right to access, correct, or request the deletion of your personal data stored on our systems. If you have an account with us, you can update your preferences and information via the user dashboard. For complete data deletion requests, please contact our data protection officer through our Contact page. We will process your request within 30 days in accordance with applicable privacy laws.
          </p>
        </section>
      </div>
    </main>
  );
}
