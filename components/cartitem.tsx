"use client";

import React, { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { CartItem as CartItemType, Product, ProductImage } from "@/app/types";

interface CartItemProps {
  cartItem: CartItemType;
  product: Product;
  productImage: ProductImage | null;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  cartItem,
  product,
  productImage,
  onUpdateQuantity = () => {},
  onRemove = () => {},
}: CartItemProps) {
  const [quantity, setQuantity] = useState(cartItem.quantity);

  // Format price with currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate line item total
  const lineItemTotal = product.discountPrice
    ? product.discountPrice * quantity
    : product.price * quantity;

  // Handle quantity changes
  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdateQuantity(cartItem.id, newQuantity);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(cartItem.id, newQuantity);
    }
  };

  // Handle remove item
  const handleRemove = () => {
    onRemove(cartItem.id);
  };

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden mr-0 sm:mr-6 mb-4 sm:mb-0">
        {productImage ? (
          <img
            src={productImage.url}
            alt={productImage.alt || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground text-xs">No image</p>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
        <div className="mb-4 sm:mb-0 sm:mr-6">
          <h3 className="font-serif text-lg font-medium mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            SKU: {product.sku}
          </p>
          <p className="font-sans font-medium">
            {product.discountPrice ? (
              <span className="flex items-center">
                <span>{formatPrice(product.discountPrice)}</span>
                <span className="text-xs text-muted-foreground line-through ml-2">
                  {formatPrice(product.price)}
                </span>
              </span>
            ) : (
              formatPrice(product.price)
            )}
          </p>
        </div>

        {/* Quantity and Actions */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          {/* Quantity Selector */}
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="px-3 py-1 text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center font-medium text-sm">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="px-3 py-1 text-foreground hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price Total */}
          <div className="hidden sm:block ml-8 w-24 text-right">
            <span className="font-sans font-bold">
              {formatPrice(lineItemTotal)}
            </span>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="ml-4 p-2 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Mobile Price Total */}
        <div className="sm:hidden w-full text-right mt-4">
          <span className="font-sans font-bold text-lg">
            {formatPrice(lineItemTotal)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
