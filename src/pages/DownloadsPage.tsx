// src/pages/DownloadsPage.tsx
import React, { useState } from "react";
import ProfileLayout from "@/components/ui/ProfileLayout";
import { Download } from "lucide-react";

// ✅ Sample data (replace with API later)
const allDownloads = Array.from({ length: 17 }).map((_, i) => ({
  id: String(i + 1),
  title: `Asset ${i + 1}`,
  date: `2025-07-${(10 + i).toString().padStart(2, "0")}`,
  thumbnail: `https://source.unsplash.com/random/300x200?mountain&sig=${i}`,
}));

const ITEMS_PER_PAGE = 6;

const DownloadsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = allDownloads.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(allDownloads.length / ITEMS_PER_PAGE);

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            📥 Your Downloads
          </h2>
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 bg-white dark:bg-zinc-900"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">Downloaded on {item.date}</p>
              </div>
              <div className="p-4 pt-0">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download Again
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md border text-sm bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md border text-sm bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default DownloadsPage;
