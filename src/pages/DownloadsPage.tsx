// src/pages/DownloadsPage.tsx
import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ui/ProfileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { downloadService, DownloadRecord } from "@/services/downloadService";
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

const ITEMS_PER_PAGE = 6;

const DownloadsPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);

  // Fetch user downloads
  useEffect(() => {
    const fetchDownloads = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const response = await downloadService.getUserDownloads(
          user.id, 
          currentPage, 
          ITEMS_PER_PAGE
        );
        setDownloads(response.downloads);
        setTotalPages(response.pagination.totalPages);
        setTotalDownloads(response.pagination.total);
      } catch (error) {
        console.error('Failed to fetch downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [user, currentPage]);

  const filteredDownloads = downloads.filter(item => {
    return item.asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.asset.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const displayedDownloads = searchQuery ? filteredDownloads : downloads;

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
              {displayedDownloads.length} images • Page {currentPage} of {totalPages}
            </p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Downloaded Images</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalDownloads}</p>
              </div>
              <FileImage className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayedDownloads.length === 0 ? (
          <div className="text-center py-12">
            <FileImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No downloads found' : 'No downloads yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search terms.' : 'Start downloading images to see them here.'}
            </p>
          </div>
        ) : (
          /* Downloads Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDownloads.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={item.asset.thumbnailUrl || '/placeholder.svg'}
                    alt={item.asset.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-100 text-blue-600">
                      <FileImage size={16} />
                      <span className="ml-1">{item.isFree ? 'Free' : 'Premium'}</span>
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
                        {item.asset.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.asset.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(item.downloadedAt).toLocaleDateString()}
                      </div>
                      <span>{item.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Download size={14} className="mr-1" />
                          Re-download
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
        )}

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
