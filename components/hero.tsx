"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only apply parallax effect on desktop/large screens and when component is mounted
  const parallaxStyle = isMounted && window.innerWidth >= 1024 ? { y } : {};

  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        style={parallaxStyle}
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&auto=format&fit=crop&q=85&w=2070&h=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1.0],
          }}
          className="max-w-3xl"
        >
          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Exquisite Craftsmanship,
            <span className="block text-primary mt-2">Timeless Elegance</span>
          </h1>

          {/* Subheading */}
          <p className="font-sans text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Discover our collection of rare gemstones and bespoke jewelry,
            meticulously crafted to illuminate your most precious moments.
          </p>

          {/* CTA Button */}
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-lg shadow-primary/25 text-base font-medium transition-all duration-300 transform hover:scale-105"
          >
            Explore Collections
          </Link>
        </motion.div>
      </div>

      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-accent/80 to-transparent" />
    </section>
  );
}
