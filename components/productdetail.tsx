"use client";

import React, { useState } from "react";
import { Heart, ShoppingBag, Plus, Minus, Check, Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  Product,
  ProductImage,
  Gemstone,
  Material,
  Inventory,
} from "@/app/types";

interface ProductDetailProps {
  product: Product;
  images: ProductImage[];
  gemstones: Gemstone[];
  materials: Material[];
  inventory: Inventory;
}

export function ProductDetail({
  product,
  images = [],
  gemstones = [],
  materials = [],
  inventory,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
    images.find((img) => img.isPrimary) || images[0] || null,
  );
  const [quantity, setQuantity] = useState(1);

  // Format price with currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle quantity changes
  const incrementQuantity = () => {
    if (quantity < inventory.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Image Gallery - Left Section */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Image */}
          <div className="aspect-square relative rounded-lg overflow-hidden mb-4 bg-muted">
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Image not available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`flex-none w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage?.id === image.id
                    ? "border-primary"
                    : "border-border"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `${product.name} view`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Details - Right Section */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Product Name and Price */}
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-6">
            {product.discountPrice ? (
              <>
                <span className="font-sans text-2xl sm:text-3xl font-bold">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="font-sans text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-sans text-2xl sm:text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Gemstone Details */}
          {gemstones.length > 0 && (
            <div className="mb-6">
              <h3 className="font-serif text-xl font-medium mb-3">
                Gemstone Details
              </h3>
              <div className="bg-card p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gemstones.map((gemstone) => (
                    <div key={gemstone.id} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: gemstone.color }}
                        ></span>
                        <span className="font-medium">{gemstone.name}</span>
                      </div>
                      <div className="pl-5 text-sm text-muted-foreground space-y-1">
                        <p>Carat: {gemstone.carat}</p>
                        {gemstone.clarity && <p>Clarity: {gemstone.clarity}</p>}
                        {gemstone.cut && <p>Cut: {gemstone.cut}</p>}
                        {gemstone.origin && <p>Origin: {gemstone.origin}</p>}
                        {gemstone.certification && (
                          <p className="flex items-center gap-1">
                            <Check size={14} className="text-success" />
                            <span>Certified: {gemstone.certification}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Material Information */}
          {materials.length > 0 && (
            <div className="mb-8">
              <h3 className="font-serif text-xl font-medium mb-3">
                Material Information
              </h3>
              <div className="flex flex-wrap gap-3">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-card px-4 py-3 rounded-lg flex-grow"
                  >
                    <h4 className="font-medium mb-1">{material.name}</h4>
                    {material.purity && (
                      <p className="text-sm text-muted-foreground">
                        Purity: {material.purity}
                      </p>
                    )}
                    {material.karat && (
                      <p className="text-sm text-muted-foreground">
                        Karat: {material.karat}K
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector and Actions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Quantity</span>
              {inventory.quantity <= inventory.lowStockThreshold && (
                <span className="text-sm text-destructive flex items-center gap-1">
                  <Info size={14} />
                  Only {inventory.quantity} left
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-md">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-4 py-2 text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= inventory.quantity}
                  className="px-4 py-2 text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1">
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-colors"
                  aria-label="Add to cart"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>

              <button
                className="p-3 border border-border rounded-md hover:bg-muted transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={20} className="text-foreground" />
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-center text-sm text-muted-foreground">
              <Check size={16} className="mr-2 text-success" />
              Free shipping on orders over $1000
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Check size={16} className="mr-2 text-success" />
              30-day returns
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Check size={16} className="mr-2 text-success" />
              Complimentary luxury gift packaging
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
