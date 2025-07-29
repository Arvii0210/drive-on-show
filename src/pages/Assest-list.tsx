import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderWithDropdown from "@/components/HeaderWithDropdown";

interface ImageData {
  id: string;
  src: string;
  title: string;
  description?: string;
  author: {
    name: string;
    avatar?: string;
  };
  isPremium: boolean;
  category: string;
}

const images: ImageData[] = [
  { 
    id: "1",
    src: "/assets/college-1.jpg", 
    title: "University Building",
    description: "Beautiful university campus architecture",
    author: { name: "John Smith" },
    isPremium: false,
    category: "education"
  },
  { 
    id: "2",
    src: "/assets/graduate-1.jpg", 
    title: "Graduate Girl",
    description: "Happy graduate celebrating achievement",
    author: { name: "Sarah Wilson" },
    isPremium: true,
    category: "education"
  },
  { 
    id: "3",
    src: "/assets/certificate.jpg", 
    title: "Certificate Hand",
    description: "Holding graduation certificate",
    author: { name: "Mike Johnson" },
    isPremium: false,
    category: "education"
  },
  { 
    id: "4",
    src: "/assets/college-2.jpg", 
    title: "Old College",
    description: "Historic college building",
    author: { name: "Emma Davis" },
    isPremium: false,
    category: "education"
  },
  { 
    id: "5",
    src: "/assets/graduate-2.jpg", 
    title: "Smiling Graduate",
    description: "Graduate with cap and gown",
    author: { name: "David Brown" },
    isPremium: true,
    category: "education"
  },
  { 
    id: "6",
    src: "/assets/college-3.jpg", 
    title: "Main Hall",
    description: "University main hall interior",
    author: { name: "Lisa Chen" },
    isPremium: false,
    category: "education"
  },
  { 
    id: "7",
    src: "/assets/convocation.jpg", 
    title: "Convocation",
    description: "Graduation ceremony moment",
    author: { name: "Robert Taylor" },
    isPremium: true,
    category: "education"
  },
  { 
    id: "8",
    src: "/assets/board.jpg", 
    title: "Results Board",
    description: "University results announcement",
    author: { name: "Anna White" },
    isPremium: false,
    category: "education"
  },
];

const AssetList  = () => {
  const navigate = useNavigate();

  const handleImageClick = (image: ImageData) => {
    navigate(`/image/${image.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderWithDropdown />

      {/* Masonry Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((item, idx) => (
          <div
            key={item.id}
            className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-card cursor-pointer"
            onClick={() => handleImageClick(item)}
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full object-cover rounded-2xl hover:scale-105 transition duration-300"
              style={{ height: `${200 + (idx % 3) * 50}px` }} // Variable heights
            />
            <div className="p-3 text-sm font-semibold text-foreground text-center">
              {item.title}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AssetList;