"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Product, ProductImage, Gemstone, Material } from "@/app/types";
import { ProductCard } from "@/components/productcard";

interface FeaturedProductsProps {
  products: (Product & {
    primaryImage: ProductImage | null;
    gemstones: Gemstone[];
    materials: Material[];
  })[];
}

export function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
          Featured Collections
        </h2>
        <div className="w-24 h-1 bg-accent mx-auto mb-8 rounded-full"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most exceptional pieces, crafted with rare gemstones and
          precious metals for those who appreciate timeless elegance.
        </p>
      </div>

      {/* Desktop/Tablet Grid View */}
      <div className="hidden md:block">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                product={product}
                primaryImage={product.primaryImage}
                gemstones={product.gemstones}
                materials={product.materials}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile/Tablet Scrollable View */}
      <div className="md:hidden relative">
        <motion.div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-6 scrollbar-hide"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="flex-none w-full sm:w-80"
              variants={itemVariants}
            >
              <ProductCard
                product={product}
                primaryImage={product.primaryImage}
                gemstones={product.gemstones}
                materials={product.materials}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows - Only visible on tablet */}
      <div className="hidden sm:flex md:hidden justify-between items-center mt-6">
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-full bg-card hover:bg-muted transition-colors shadow-sm"
          aria-label="Previous products"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-full bg-card hover:bg-muted transition-colors shadow-sm"
          aria-label="Next products"
        >
          <ChevronRight size={24} className="text-foreground" />
        </button>
      </div>

      {/* View All Link */}
      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
        >
          View All Collections
        </Link>
      </div>
    </section>
  );
}
