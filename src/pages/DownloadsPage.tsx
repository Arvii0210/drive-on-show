import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatFileType, getTimeUntilReset } from '@/lib/utils';

interface DownloadItem {
  id: number;
  assetName: string;
  assetType: string;
  downloadedAt: string;
  status: 'completed' | 'pending' | 'failed';
  fileSize: string;
}

interface UserQuota {
  dailyLimit: number;
  used: number;
  remaining: number;
  resetTime: string;
}

const DownloadsPage = () => {
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [quota, setQuota] = useState<UserQuota>({
    dailyLimit: 3,
    used: 1,
    remaining: 2,
    resetTime: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
    fetchQuota();
  }, []);

  const fetchDownloads = async () => {
    try {
      // Mock API call - replace with actual service
      const mockDownloads: DownloadItem[] = [
        {
          id: 1,
          assetName: 'Modern Logo Design',
          assetType: 'ai',
          downloadedAt: new Date().toISOString(),
          status: 'completed',
          fileSize: '2.4 MB'
        },
        {
          id: 2,
          assetName: 'Business Card Template',
          assetType: 'psd',
          downloadedAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'completed',
          fileSize: '15.8 MB'
        },
      ];
      
      setDownloads(mockDownloads);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch downloads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuota = async () => {
    try {
      // Mock API call - replace with actual service
      const mockQuota: UserQuota = {
        dailyLimit: 3,
        used: 1,
        remaining: 2,
        resetTime: new Date().toISOString(),
      };
      
      setQuota(mockQuota);
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading downloads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Downloads</h1>
          <p className="text-muted-foreground">Track your downloaded assets and quota usage</p>
        </div>
      </div>

      {/* Daily Quota Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Daily Download Quota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {quota.used} of {quota.dailyLimit} downloads used today
              </span>
              <Badge variant={quota.remaining > 0 ? "default" : "destructive"}>
                {quota.remaining} remaining
              </Badge>
            </div>
            <Progress value={(quota.used / quota.dailyLimit) * 100} className="w-full" />
            <div className="text-xs text-muted-foreground">
              Quota resets in: {getTimeUntilReset()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloads List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Downloads ({downloads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {downloads.length === 0 ? (
            <div className="text-center py-8">
              <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No downloads yet</h3>
              <p className="text-sm text-muted-foreground">
                Start downloading assets to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {downloads.map((download) => (
                <div
                  key={download.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(download.status)}
                    <div>
                      <h4 className="font-medium">{download.assetName}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {formatFileType(download.assetType)}
                        </Badge>
                        <span>•</span>
                        <span>{download.fileSize}</span>
                        <span>•</span>
                        <span>{formatDate(download.downloadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        download.status === 'completed' ? 'default' :
                        download.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {download.status}
                    </Badge>
                    {download.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Re-download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadsPage;