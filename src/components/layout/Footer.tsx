import Link from "next/link";
import { Instagram, Facebook, p, Pin } from "lucide-react"; // Using generic icons for minimal look

export function Footer() {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg tracking-widest uppercase font-semibold mb-6">HR Fashion</h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Elevating everyday aesthetics. A modern fashion label born in Dhaka, blending timeless elegance with contemporary minimalism.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm uppercase font-semibold tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase font-semibold tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li>
                <a href="mailto:hello@hrfashion.com" className="hover:text-foreground transition-colors">
                  hello@hrfashion.com
                </a>
              </li>
              <li>
                <a href="tel:+8801700000000" className="hover:text-foreground transition-colors">
                  +880 1700 000000
                </a>
              </li>
              <li className="leading-relaxed">
                Level 4, House 12, Road 4<br />
                Banani, Dhaka 1213<br />
                Bangladesh
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase font-semibold tracking-wider mb-6">Social</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Instagram className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Facebook className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Pin className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-4">
          <p>&copy; {new Date().getFullYear()} HR Fashion. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
