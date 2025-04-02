"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, ArrowRight } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Subscription logic would go here
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/90 border-t border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              <span className="text-primary">Opulent</span> Gems
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Dedicated to crafting timeless jewelry with rare gemstones and
              precious metals. Each piece tells a unique story of elegance and
              sophistication.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">
              Collections
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  All Collections
                </Link>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Rings
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Necklaces
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Earrings
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Bracelets
                </div>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  About Us
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Sustainability
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Gemstone Guide
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Jewelry Care
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Blog
                </div>
              </li>
            </ul>
          </div>

          {/* Customer Service & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-foreground">
              Stay Connected
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Subscribe to receive updates on new collections and exclusive
              offers.
            </p>
            <form onSubmit={handleSubmit} className="flex">
              <div className="relative flex-grow">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-10 pr-3 py-2 bg-card border border-border rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-r-md transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </form>

            <h3 className="font-serif text-lg font-medium text-foreground pt-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Contact Us
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  FAQ
                </div>
              </li>
              <li>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Shipping & Returns
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0">
              © {currentYear} Opulent Gems. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <div className="text-xs text-muted-foreground/70 cursor-not-allowed">
                Privacy Policy
              </div>
              <div className="text-xs text-muted-foreground/70 cursor-not-allowed">
                Terms of Service
              </div>
              <div className="text-xs text-muted-foreground/70 cursor-not-allowed">
                Accessibility
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
