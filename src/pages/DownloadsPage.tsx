// src/pages/DownloadsPage.tsx
import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ui/ProfileLayout";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { downloadService, DownloadRecord } from "@/services/downloadService";
import {  formatFileType, getTimeUntilReset } from "@/lib/utils";
import { 
  Download, 
  Calendar, 
  FileImage,
  MoreVertical
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

const DownloadsPage: React.FC = () => {
  const { user } = useAuth();
  const { userSubscription } = useSubscription();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery] = useState("");
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
        
        // Add safety checks for the response structure
        const downloadsArray = response?.downloads || [];
        const pagination = response?.pagination || { totalPages: 0, total: 0 };
        
        setDownloads(downloadsArray);
        setTotalPages(pagination.totalPages);
        setTotalDownloads(pagination.total);
      } catch (error) {
        console.error('Failed to fetch downloads:', error);
        setDownloads([]);
        setTotalPages(0);
        setTotalDownloads(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [user, currentPage]);

  const filteredDownloads = (downloads || []).filter(item => {
      const categoryName = (item?.asset?.assetCategory);
      
    return item?.asset?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           categoryName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const displayedDownloads = searchQuery ? filteredDownloads : (downloads || []);

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

        {/* Quota Status Card */}
        {userSubscription && (
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Daily Download Quota
                  </p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100">
                    {userSubscription.remainingStandardDownloads || 0} Standard • {userSubscription.remainingPremiumDownloads || 0} Premium
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Resets in {getTimeUntilReset()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {userSubscription.planType || 'Free'} Plan
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Daily Limit: {userSubscription.planType === 'PREMIUM' ? 'Unlimited' : '3'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                    src={item.asset.thumbnail || item.asset.imageUrl || '/placeholder.svg'}
                    alt={item.asset.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.asset.assetCategory || 'Asset'}
                      </p>
                      {item.asset.fileType && (
                        <p className="text-xs text-gray-500 mt-1">
                          File type: {formatFileType(item.asset.fileType)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(item.downloadedAt).toLocaleDateString()}
                      </div>
                      <span>
                        {(item.asset.assetCategory)}
                      </span>
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
