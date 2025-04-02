"use client";

import React from "react";
import { Product, ProductImage, Gemstone, Material } from "@/app/types";
import { ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  primaryImage: ProductImage | null;
  gemstones: Gemstone[];
  materials: Material[];
}

export function ProductCard({
  product,
  primaryImage,
  gemstones = [],
  materials = [],
}: ProductCardProps) {
  // Calculate discount percentage if discounted price exists
  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  // Format price with currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted">
              <p className="text-muted-foreground">Image not available</p>
            </div>
          )}
        </div>

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-medium rounded">
            Featured
          </div>
        )}

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-medium rounded">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-serif text-lg font-medium mb-1">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {product.discountPrice ? (
            <>
              <span className="font-sans font-bold text-foreground">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="font-sans text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-sans font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Gemstones and Materials */}
        {(gemstones.length > 0 || materials.length > 0) && (
          <div className="flex flex-wrap gap-1 mb-2">
            {gemstones.map((gemstone) => (
              <span
                key={gemstone.id}
                className="bg-muted px-2 py-0.5 text-xs rounded-full text-muted-foreground"
              >
                {gemstone.name}
              </span>
            ))}
            {materials.map((material) => (
              <span
                key={material.id}
                className="bg-muted px-2 py-0.5 text-xs rounded-full text-muted-foreground"
              >
                {material.name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded text-center text-sm"
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden flex items-center justify-center">
              <Eye size={16} />
            </span>
          </Link>

          <button
            aria-label="Add to cart"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground p-2 rounded"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
