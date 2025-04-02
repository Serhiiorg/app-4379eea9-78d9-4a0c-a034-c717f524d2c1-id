"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Diamond, MessageSquare, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { FeaturedProducts } from "@/components/featuredproducts";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setFeaturedProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* About Our Craftsmanship */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
            About Our Craftsmanship
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            At Opulent Gems, we honor the ancient art of jewelry making with
            modern innovation. Each piece is meticulously crafted by our master
            artisans who bring decades of experience to their work. We source
            only the finest ethically-mined gemstones and precious metals,
            ensuring every creation meets our exacting standards of quality and
            beauty.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our commitment to excellence extends beyond craftsmanship to the
            entire customer experience, from the moment you discover our
            collections to the lifelong care of your treasured piece.
          </p>
        </motion.div>
      </section>

      {/* Featured Products */}
      {!isLoading && featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} />
      )}

      {/* Collections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-card/50">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Explore Our Collections
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8 rounded-full"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite collections, each telling a unique story
            through expert craftsmanship and timeless design.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            {
              name: "Rings",
              image:
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
              description: "Engagement, wedding, and statement rings",
            },
            {
              name: "Necklaces",
              image:
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
              description: "Pendants, chains, and statement pieces",
            },
            {
              name: "Earrings",
              image:
                "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
              description: "Studs, hoops, and drop earrings",
            },
            {
              name: "Bracelets",
              image:
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
              description: "Tennis bracelets, bangles, and cuffs",
            },
          ].map((collection, index) => (
            <motion.div
              key={collection.name}
              className="relative rounded-lg overflow-hidden shadow-md group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="font-serif text-2xl font-semibold text-white mb-1">
                  {collection.name}
                </h3>
                <p className="text-white/90 mb-4">{collection.description}</p>
                <div className="text-muted-foreground/70 cursor-not-allowed">
                  <span className="inline-flex items-center text-primary-foreground">
                    Coming soon <ArrowRight size={16} className="ml-2" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Signature Gemstones */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Signature Gemstones
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each gemstone in our collection is selected for its exceptional
            quality, color, and character.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600820988248-c8e3a7eaf7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Orange Sapphire"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-semibold mb-2">
                Orange Sapphires
              </h3>
              <p className="text-muted-foreground mb-4">
                Our signature gemstone, the orange sapphire, embodies warmth,
                creativity, and vitality. Each stone is carefully selected for
                its vibrant hue and clarity.
              </p>
              <div className="flex items-center text-primary">
                <Diamond size={16} className="mr-2" />
                <span className="text-sm">Hardness: 9 Mohs</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Diamonds"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-semibold mb-2">
                Diamonds
              </h3>
              <p className="text-muted-foreground mb-4">
                Our diamonds are selected for their exceptional cut, clarity,
                and brilliance. Each stone is ethically sourced and certified
                for authenticity.
              </p>
              <div className="flex items-center text-primary">
                <Diamond size={16} className="mr-2" />
                <span className="text-sm">Hardness: 10 Mohs</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586104195538-050b9f74f58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Emeralds"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-semibold mb-2">
                Emeralds
              </h3>
              <p className="text-muted-foreground mb-4">
                Our emeralds exude a lush green hue that symbolizes growth and
                harmony. Each stone is carefully selected for its color
                saturation and clarity.
              </p>
              <div className="flex items-center text-primary">
                <Diamond size={16} className="mr-2" />
                <span className="text-sm">Hardness: 7.5-8 Mohs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Client Testimonials
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote:
                "The craftsmanship of my engagement ring exceeded all expectations. Each time I look at it, I'm reminded of our special day.",
              author: "Sarah J., New York",
            },
            {
              quote:
                "The orange sapphire necklace I purchased has become my signature piece. I receive compliments every time I wear it.",
              author: "Michael T., London",
            },
            {
              quote:
                "Working with Opulent Gems on my custom design was a pleasure. They captured my vision perfectly and created something truly unique.",
              author: "Emma L., Paris",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-lg p-8 shadow-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute top-6 left-6 text-primary opacity-20">
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.528 31.2C8.344 31.2 5.824 30.12 3.968 27.96C2.112 25.8 1.184 22.92 1.184 19.32C1.184 15.48 2.376 11.92 4.76 8.64C7.144 5.28 10.664 2.6 15.32 0.6L17.144 3.6C13.672 5.12 10.968 7.08 9.032 9.48C7.096 11.88 6.128 14.6 6.128 17.64C6.128 18.28 6.16 18.8 6.224 19.2C6.928 17.92 8.072 16.88 9.656 16.08C11.304 15.28 13.048 14.88 14.888 14.88C17.304 14.88 19.352 15.72 21.032 17.4C22.712 19 23.552 21.16 23.552 23.88C23.552 26.6 22.68 28.8 20.936 30.48C19.256 30.96 17.208 31.2 14.888 31.2H11.528ZM29.328 31.2C26.144 31.2 23.624 30.12 21.768 27.96C19.912 25.8 18.984 22.92 18.984 19.32C18.984 15.48 20.176 11.92 22.56 8.64C24.944 5.28 28.464 2.6 33.12 0.6L34.944 3.6C31.472 5.12 28.768 7.08 26.832 9.48C24.896 11.88 23.928 14.6 23.928 17.64C23.928 18.28 23.96 18.8 24.024 19.2C24.728 17.92 25.872 16.88 27.456 16.08C29.104 15.28 30.848 14.88 32.688 14.88C35.104 14.88 37.152 15.72 38.832 17.4C40.512 19 41.352 21.16 41.352 23.88C41.352 26.6 40.48 28.8 38.736 30.48C37.056 30.96 35.008 31.2 32.688 31.2H29.328Z" />
                </svg>
              </div>

              <p className="text-foreground italic text-lg leading-relaxed mb-6 relative z-10">
                {testimonial.quote}
              </p>
              <p className="text-muted-foreground font-medium">
                {testimonial.author}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-secondary p-8 md:p-12 lg:col-span-2 flex flex-col justify-center">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6 text-secondary-foreground">
                Custom Jewelry Inquiries
              </h2>
              <p className="text-secondary-foreground/90 mb-8 text-lg leading-relaxed">
                Our master artisans can create a bespoke piece that tells your
                unique story. Reach out to begin your journey to a one-of-a-kind
                creation.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <PhoneCall size={24} className="text-primary mr-4" />
                  <span className="text-secondary-foreground/90">
                    +1 (800) 123-4567
                  </span>
                </div>
                <div className="flex items-center">
                  <MessageSquare size={24} className="text-primary mr-4" />
                  <span className="text-secondary-foreground/90">
                    inquiries@opulentgems.com
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 lg:col-span-3">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Tell us about your vision
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-md transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
