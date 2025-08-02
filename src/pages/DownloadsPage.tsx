// src/pages/DownloadsPage.tsx
import React, { useState } from "react";
import ProfileLayout from "@/components/ui/ProfileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Search, 
  Calendar, 
  FileImage,
  Eye,
  Heart,
  Share2,
  MoreVertical
} from "lucide-react";

// Sample data - only images
const allDownloads = Array.from({ length: 17 }).map((_, i) => ({
  id: String(i + 1),
  title: `Image ${i + 1}`,
  date: `2025-01-${(10 + i).toString().padStart(2, "0")}`,
  thumbnail: `https://source.unsplash.com/random/300x200?mountain&sig=${i}`,
  type: 'image',
  size: `${(Math.random() * 10 + 1).toFixed(1)}MB`,
  downloads: Math.floor(Math.random() * 50) + 1,
  category: ['Nature', 'Business', 'Technology', 'Art'][i % 4],
}));

const ITEMS_PER_PAGE = 6;

const DownloadsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDownloads = allDownloads.filter(item => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredDownloads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredDownloads.length / ITEMS_PER_PAGE);

  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Download className="mr-3 text-blue-600" size={28} />
              Your Downloads
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredDownloads.length} images • Page {currentPage} of {totalPages}
            </p>
          </div>
          
          
        </div>

        

        {/* Stats Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Downloaded Images</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{allDownloads.length}</p>
              </div>
              <FileImage className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-100 text-blue-600">
                    <FileImage size={16} />
                    <span className="ml-1">Image</span>
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {item.date}
                    </div>
                    <span>{item.size}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye size={14} />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="ghost">
                        <Heart size={14} />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  ← Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProfileLayout>
  );
};

export default DownloadsPage;
