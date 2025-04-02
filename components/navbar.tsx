"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              <span className="text-primary">Opulent</span> Gems
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Collections
            </Link>
            <div className="font-medium text-foreground/70 cursor-not-allowed">
              About
            </div>
            <div className="font-medium text-foreground/70 cursor-not-allowed">
              Contact
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-foreground" />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "240px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 origin-top-right"
                  >
                    <input
                      type="text"
                      placeholder="Search for jewelry..."
                      className="w-full px-4 py-2 bg-card border border-border rounded-md shadow-md focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <div className="hidden sm:block">
              <button
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} className="text-foreground" />
              </button>
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ShoppingBag size={20} className="text-foreground" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              <Menu size={24} className="text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div
        className={`h-px w-full bg-border/50 transition-opacity duration-300 ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            <motion.div className="absolute top-0 right-0 h-full w-64 sm:w-80 bg-card shadow-lg p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-xl font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-foreground" />
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                <Link
                  href="/"
                  className="font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collections
                </Link>
                <div className="font-medium text-foreground/70 cursor-not-allowed">
                  About
                </div>
                <div className="font-medium text-foreground/70 cursor-not-allowed">
                  Contact
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search for jewelry..."
                      className="w-full px-4 py-2 pr-10 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Search
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
