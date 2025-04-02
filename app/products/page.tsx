"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/productcard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Product,
  ProductImage,
  Gemstone,
  Material,
  Category,
} from "@/app/types";
import {
  ChevronRight,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState<
    (Product & {
      primaryImage: ProductImage | null;
      gemstones: Gemstone[];
      materials: Material[];
    })[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rootCategories, setRootCategories] = useState<
    (Category & { children: Category[] })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const productsPerPage = 9;

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productsResponse = await fetch("/api/products");
        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        const productsData = await productsResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setCategories(categoriesData.categories || []);
        setRootCategories(categoriesData.rootCategories || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on criteria
  const filteredProducts = products.filter((product) => {
    // Filter by price range
    const price = product.discountPrice || product.price;
    if (price < priceRange[0] || price > priceRange[1]) return false;

    // Filter by category
    if (activeCategory && product.categoryId !== activeCategory) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    switch (sortOption) {
      case "price-high-low":
        return priceB - priceA;
      case "price-low-high":
        return priceA - priceB;
      case "newest":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Handle price range change
  const handlePriceRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newValue = parseInt(event.target.value);
    setPriceRange((prev) => {
      const newRange = [...prev] as [number, number];
      newRange[index] = newValue;
      return newRange;
    });
  };

  return (
    <main className="min-h-screen bg-background">
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
            <span className="font-medium">Collections</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
          Our Collections
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Discover our exquisite selection of fine jewelry, featuring rare
          gemstones and precious metals crafted with unparalleled artistry and
          attention to detail.
        </p>
      </div>

      {/* Products Grid with Sidebar */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="pb-6">
                <h3 className="font-serif text-lg font-medium mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`w-full text-left py-1 text-sm ${!activeCategory ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
                    >
                      All Collections
                    </button>
                  </li>
                  {rootCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left py-1 text-sm ${activeCategory === category.id ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
                      >
                        {category.name}
                      </button>
                      {category.children.length > 0 && (
                        <ul className="pl-4 mt-1 space-y-1">
                          {category.children.map((child) => (
                            <li key={child.id}>
                              <button
                                onClick={() => setActiveCategory(child.id)}
                                className={`w-full text-left py-1 text-xs ${activeCategory === child.id ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
                              >
                                {child.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-6 border-t border-border">
                <h3 className="font-serif text-lg font-medium mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="w-full accent-primary"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <div className="py-6 border-t border-border">
                <h3 className="font-serif text-lg font-medium mb-4">
                  Gemstones
                </h3>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Gemstone filters coming soon!
                </div>
              </div>

              <div className="py-6 border-t border-border">
                <h3 className="font-serif text-lg font-medium mb-4">
                  Materials
                </h3>
                <div className="text-sm text-muted-foreground/70 cursor-not-allowed">
                  Material filters coming soon!
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-card border border-border rounded-md"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="price-low-high">Price: Low to High</option>
              </select>
              <ArrowUpDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Desktop Sort Options */}
            <div className="hidden lg:flex justify-end mb-6">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="price-low-high">Price: Low to High</option>
                </select>
                <ArrowUpDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-muted rounded-full border-t-primary animate-spin mb-4"></div>
                <p className="text-muted-foreground">
                  Loading our exquisite collections...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="font-serif text-xl font-medium mb-2">
                  We apologize for the inconvenience
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && currentProducts.length === 0 && (
              <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="font-serif text-xl font-medium mb-2">
                  No products match your criteria
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to discover our beautiful
                  collections.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setPriceRange([0, 10000]);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && currentProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    primaryImage={product.primaryImage}
                    gemstones={product.gemstones}
                    materials={product.materials}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-md flex items-center justify-center ${
                            page === currentPage
                              ? "bg-primary text-primary-foreground"
                              : "border border-border hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute top-0 left-0 h-full w-full max-w-xs p-6 bg-card shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl font-medium">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-medium mb-3">
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => {
                          setActiveCategory(null);
                          setIsMobileFiltersOpen(false);
                        }}
                        className={`w-full text-left py-1 text-sm ${!activeCategory ? "text-primary font-medium" : "text-foreground"}`}
                      >
                        All Collections
                      </button>
                    </li>
                    {rootCategories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => {
                            setActiveCategory(category.id);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left py-1 text-sm ${activeCategory === category.id ? "text-primary font-medium" : "text-foreground"}`}
                        >
                          {category.name}
                        </button>
                        {category.children.length > 0 && (
                          <ul className="pl-4 mt-1 space-y-1">
                            {category.children.map((child) => (
                              <li key={child.id}>
                                <button
                                  onClick={() => {
                                    setActiveCategory(child.id);
                                    setIsMobileFiltersOpen(false);
                                  }}
                                  className={`w-full text-left py-1 text-xs ${activeCategory === child.id ? "text-primary font-medium" : "text-foreground"}`}
                                >
                                  {child.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="py-4 border-t border-border">
                  <h3 className="font-serif text-lg font-medium mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">${priceRange[0]}</span>
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      className="w-full accent-primary"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-md mt-4"
                >
                  Apply Filters
                </button>

                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setPriceRange([0, 10000]);
                    setIsMobileFiltersOpen(false);
                  }}
                  className="w-full bg-card border border-border hover:bg-muted text-foreground font-medium py-3 px-6 rounded-md"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
