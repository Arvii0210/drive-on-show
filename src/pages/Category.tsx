import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Search, Camera } from "lucide-react";
import Header from "@/components/Header";

import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import { Category, categoryService } from '@/services/categoryService';
import { Skeleton } from '@/components/ui/skeleton';

const galleryImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
  "https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
  "https://images.unsplash.com/photo-1510070009289-b5bc34383727",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
  "https://images.unsplash.com/photo-1497032205916-ac775f0649ae",
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
];

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
      "While not always required, we encourage giving credit. Some free photos may require attribution – this is marked on each photo’s download page.",
  },
];

const CategoryPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
          setError('Invalid data format received from server.');
        }
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        console.error('Error fetching categories:', err);
        setCategories([]);
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
        !(profileRef.current as any).contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The right photo for every moment
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Surf categories of professional photos to express your ideas and
            connect with your audience
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(categories) && categories.length > 0 ? categories.map((category) => (
                <Link
                  to={`/asset-list?category=${encodeURIComponent(category.categoryName)}`}
                  key={category.id}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition hover:scale-105 cursor-pointer block"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image || 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop'}
                      alt={category.categoryName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{category.categoryName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category._count.assets.toLocaleString()} assets
                    </p>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No categories available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Masonry Image Gallery */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Explore Free Images
          </h2>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleryImages.map((src, i) => (
              <img
                key={i}
                src={`${src}?w=400&auto=format&fit=crop`}
                alt={`Gallery ${i + 1}`}
                className="w-full rounded-lg mb-4 break-inside-avoid shadow-md hover:scale-[1.02] transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            FAQ
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={`item-${faq.id}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
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
