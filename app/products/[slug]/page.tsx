"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductDetail } from "@/components/productdetail";
import { ProductCard } from "@/components/productcard";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Product,
  ProductImage,
  Gemstone,
  Material,
  Inventory,
  Category,
} from "@/app/types";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);

        // Fetch product details by slug
        const response = await fetch(`/api/products?slug=${params.slug}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          throw new Error("Product not found");
        }

        const productData = data[0];
        setProduct(productData);
        setGemstones(productData.gemstones || []);
        setMaterials(productData.materials || []);

        // Fetch product images
        const imagesResponse = await fetch(
          `/api/products/${productData.id}/images`,
        );
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          setImages(imagesData || []);
        }

        // Fetch inventory
        const inventoryResponse = await fetch(
          `/api/products/${productData.id}/inventory`,
        );
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json();
          setInventory(inventoryData || { quantity: 10, lowStockThreshold: 3 });
        } else {
          // Default inventory if not available
          setInventory({
            id: "default",
            productId: productData.id,
            quantity: 10,
            lowStockThreshold: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Fetch category
        if (productData.categoryId) {
          const categoryResponse = await fetch(
            `/api/categories/${productData.categoryId}`,
          );
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategory(categoryData);
          }
        }

        // Fetch related products from same category
        if (productData.categoryId) {
          const relatedResponse = await fetch(
            `/api/products?categoryId=${productData.categoryId}&limit=4`,
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out the current product
            setRelatedProducts(
              relatedData
                .filter((p: Product) => p.id !== productData.id)
                .slice(0, 4),
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-muted rounded-full border-t-primary animate-spin mx-auto mb-8"></div>
            <h2 className="font-serif text-2xl font-medium mb-2">
              Discovering Elegance
            </h2>
            <p className="text-muted-foreground">
              Loading your exquisite piece...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-medium mb-4">
              Product Not Found
            </h2>
            <p className="text-muted-foreground mb-8">
              We apologize, but the jewelry piece you're looking for is no
              longer available or may have been moved.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-base font-medium transition-colors"
            >
              Browse Our Collections
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-muted/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={16} className="mx-2 text-muted-foreground" />
            <Link
              href="/products"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Collections
            </Link>
            {category && (
              <>
                <ChevronRight
                  size={16}
                  className="mx-2 text-muted-foreground"
                />
                <Link
                  href={`/products?categoryId=${category.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight size={16} className="mx-2 text-muted-foreground" />
            <span className="font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      {product && inventory && (
        <ProductDetail
          product={product}
          images={images}
          gemstones={gemstones}
          materials={materials}
          inventory={inventory}
        />
      )}

      {/* Social sharing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center border-t border-border">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-muted-foreground">
            Share:
          </span>
          <button
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook size={18} />
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter size={18} />
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share on Instagram"
          >
            <Instagram size={18} />
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share via link"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Reviews - Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-medium mb-2">
            Customer Reviews
          </h2>
          <p className="text-muted-foreground">Reviews coming soon!</p>
        </div>
      </section>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-8 text-center">
            You May Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard
                  product={relatedProduct}
                  primaryImage={relatedProduct.primaryImage}
                  gemstones={relatedProduct.gemstones || []}
                  materials={relatedProduct.materials || []}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
