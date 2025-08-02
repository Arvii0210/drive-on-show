import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Category, categoryService } from '@/services/categoryService';

const faqData = [
  {
    id: 1,
    question: "What types of photos are available?",
    answer:
      "We offer a wide variety of high-quality stock photos including business, lifestyle, nature, technology, food, and many other categories.",
  },
  {
    id: 2,
    question: "Can I use these photos for commercial purposes?",
    answer:
      "Yes, all our photos come with commercial licenses that allow you to use them in your business projects, marketing materials, websites, and more.",
  },
  {
    id: 3,
    question: "How do I download photos?",
    answer:
      "Simply browse our categories, click on the photo you like, and choose your preferred resolution. Free users can download standard resolution.",
  },
  {
    id: 4,
    question: "What's the difference between free and premium content?",
    answer:
      "Free content includes standard resolution photos. Premium content offers high-resolution images, extended licenses, and exclusive collections.",
  },
  {
    id: 5,
    question: "Do I need to give credit to photographers?",
    answer:
      "While not always required, we encourage giving credit. Some free photos may require attribution – this is marked on each photo's download page.",
  },
];

const CategoryPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const cats = await categoryService.getCategories();
        setCategories(cats);
        setError(null);
      } catch (err) {
        setCategories([]);
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter standard categories if you have a property that marks categories STANDARD
  // Assuming all categories here, or filter accordingly if you get category type
  const standardCategories = categories.filter(cat => {
    // Add your filtering logic here if you have type info e.g. cat.type === 'STANDARD'
    return true; // show all for now
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-gray-50 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight max-w-4xl mx-auto">
          The right photo for every moment
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Surf categories of professional photos to express your ideas and connect with your audience
        </p>
      </section>

      {/* Category Grid */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse Categories</h2>
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg shadow border border-gray-200 overflow-hidden animate-pulse">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600 font-semibold text-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.length > 0 ? categories.map((category) => (
                <Link
                  to={`/photos?categoryId=${category.id}`}
                  key={category.id}
                  className="group block rounded-lg shadow-lg border border-gray-200 overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                  aria-label={`View assets in category ${category.categoryName}`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.imageUrl || 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=450&fit=crop'}
                      alt={category.categoryName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=450&fit=crop';
                      }}
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-semibold text-gray-900">{category.categoryName}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {category._count?.assets?.toLocaleString() || 0} assets available
                    </p>
                  </div>
                </Link>
              )) : (
                <p className="text-center text-gray-500 text-lg py-20">
                  No categories available at the moment.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Masonry Grid for Standard Category Images */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gray-100">
        <h2 className="text-3xl font-bold mb-10 text-center">Standard Category Highlights</h2>
        <div className="max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {standardCategories.filter(cat => cat.imageUrl).map((category) => (
              <Link
                to={`/photos?categoryId=${category.id}`}
                key={`standard-${category.id}`}
                className="block rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300 break-inside-avoid"
              aria-label={`View standard assets in category ${category.categoryName}`}
            >
              <img
                src={category.imageUrl!}
                alt={`Category ${category.categoryName}`}
                className="w-full rounded-t-lg object-cover aspect-[4/3] hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=450&fit=crop';
                }}
              />
              {(() => {
                const assetCount = category._count?.assets ?? 0;
                console.log(`Category "${category.categoryName}" has ${assetCount} assets`);
                return (
                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900">{category.categoryName}</h3>
                    <p className="text-sm text-gray-600">{assetCount.toLocaleString()} assets</p>
                  </div>
                );
              })()}
            </Link>
          ))}
          {standardCategories.length === 0 && (
            <p className="text-center text-gray-500 text-lg py-20">No standard categories available.</p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl font-bold mb-10 text-center">FAQ</h2>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={`item-${faq.id}`}
                className="bg-white rounded-lg shadow border border-gray-200 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-indigo-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CategoryPage;
