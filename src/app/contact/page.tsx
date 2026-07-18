"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Loader2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message sent! We'll get back to you shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Get in Touch</h1>
          <p className="text-muted uppercase tracking-widest text-sm">
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-5xl mx-auto">
          
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-serif mb-8">Contact Information</h2>
              <div className="space-y-8 text-muted">
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-card rounded-full text-foreground shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-widest text-foreground mb-1">Email Us</h3>
                    <a href="mailto:hello@hrfashion.com" className="hover:text-foreground transition-colors">
                      hello@hrfashion.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-card rounded-full text-foreground shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-widest text-foreground mb-1">Call Us</h3>
                    <a href="tel:+8801700000000" className="hover:text-foreground transition-colors">
                      +880 1700 000000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-card rounded-full text-foreground shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-widest text-foreground mb-1">Visit Us</h3>
                    <p className="leading-relaxed">
                      Level 4, House 12, Road 4<br />
                      Banani, Dhaka 1213<br />
                      Bangladesh
                    </p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-8 bg-card border border-card-border rounded-sm">
              <h3 className="font-serif text-lg mb-2">Customer Service Hours</h3>
              <p className="text-sm text-muted mb-1">Sunday - Thursday: 9:00 AM - 6:00 PM (BST)</p>
              <p className="text-sm text-muted">Friday - Saturday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-background rounded-sm border border-card-border p-8 shadow-sm">
            <h2 className="text-2xl font-serif mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest font-medium text-muted">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest font-medium text-muted">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs uppercase tracking-widest font-medium text-muted">Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest font-medium text-muted">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-foreground text-background font-medium uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
