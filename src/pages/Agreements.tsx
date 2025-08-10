import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Users, TrendingUp, Globe, Edit, Trash2 } from 'lucide-react';
import { getRights } from '@/services/rights.service';
import { RightsPayload, RightsType } from '@/models/rights.model';

export default function Agreements() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buying');
  const [buyingRights, setBuyingRights] = useState<RightsPayload[]>([]);
  const [sellingRights, setSellingRights] = useState<RightsPayload[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
  try {
    const filters = { rightsType: activeTab.toUpperCase() as RightsType };
    const response = await getRights(filters);
    console.log(response); // Log to check the response structure

    if (response.status === 'success' && Array.isArray(response.data.rights)) {
      const rightsArray = response.data.rights;
      if (activeTab === 'buying') {
        setBuyingRights(rightsArray);
      } else {
        setSellingRights(rightsArray);
      }
    } else {
      console.error('Expected array but received:', response.data);
    }
  } catch (error) {
    console.error('Error fetching rights:', error);
  }
};


  const totalBuyingRights = buyingRights.length;
  const totalSellingRights = sellingRights.length;
  const activeBuyingRights = buyingRights.filter(item => item.isActive).length;
  const activeSellingRights = sellingRights.filter(item => item.isActive).length;

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'proprietor':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0';
      case 'publisher':
        return 'bg-gradient-to-r from-green-500 to-teal-500 text-white border-0';
      case 'agencies':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0';
      case 'author':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'NPR': 'Rs',
      'GBP': '£',
    };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

 

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-600 bg-clip-text text-black">
            Rights Management
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage buying and selling rights agreements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-violet-50 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Buying Rights</p>
                <p className="text-3xl font-bold text-violet-600">{totalBuyingRights}</p>
              </div>
              <Globe className="h-10 w-10 text-violet-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Selling Rights</p>
                <p className="text-3xl font-bold text-purple-600">{totalSellingRights}</p>
              </div>
              <FileText className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Buying Rights</p>
                <p className="text-3xl font-bold text-emerald-600">{activeBuyingRights}</p>
              </div>
              <Users className="h-10 w-10 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-pink-50 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Selling Rights</p>
                <p className="text-3xl font-bold text-pink-600">{activeSellingRights}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Buying and Selling Rights */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-violet-100 to-purple-100 h-14">
          <TabsTrigger value="buying" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-lg font-medium">
            <Globe className="h-5 w-5 mr-2" />
            Buying Rights
          </TabsTrigger>
          <TabsTrigger value="selling" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-lg font-medium">
            <FileText className="h-5 w-5 mr-2" />
            Selling Rights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buying" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-700">Buying Rights Agreements</h2>
            <Button
              onClick={() => navigate('/rights/buying-rights/add')}
              className="bg-gradient-to-r from-blue-600 to-blue-600 hover:opacity-90 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Buying Right
            </Button>
          </div>

          <div className="grid gap-4">
            {buyingRights.map((item, index) => (
              <Card key={item.id || index} className="shadow-xl border-0 bg-gradient-to-r from-white to-blue-50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{item.role}</h3>
                        <Badge className={getStatusBadgeColor(item.isActive)}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Advance:</span>
                          <p className="font-bold text-lg">{formatCurrency(item.advancePaid, item.currency)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Royalty:</span>
                          <p className="font-bold text-lg text-emerald-600">{item.royalties}%</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Language:</span>
                          <p className="font-medium">{item.languages}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Country:</span>
                          <p className="font-medium">{item.country}</p>
                        </div>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-200 hover:bg-blue-50"
                        onClick={() => navigate(`/rights/buying-rights/edit/${item.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-gradient-to-r from-red-500 to-pink-500 border-0"
                        onClick={() => {
                          // Add your delete handler here
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="selling" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-700">Selling Rights Agreements</h2>
            <Button
              onClick={() => navigate('/rights/selling-rights/add')}
              className="bg-gradient-to-r from-blue-600 to-blue-600 hover:opacity-90 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Selling Right
            </Button>
          </div>

          <div className="grid gap-4">
            {sellingRights.map((item) => (
              <Card key={item.id} className="shadow-xl border-0 bg-gradient-to-r from-white to-blue-50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{item.personId}</h3>
                        <Badge className={item.isActive ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Advance:</span>
                          <p className="font-bold text-lg">{formatCurrency(item.advancePaid || 0, item.currency)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Royalty:</span>
                          <p className="font-bold text-lg text-emerald-600">{item.royalties}%</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Country:</span>
                          <p className="font-medium">{item.country}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Rights:</span>
                          <div className="flex flex-wrap gap-1">
                            {item.rightsType ? (
                              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-0">
                                {item.rightsType}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                Sold via Agency/Publisher
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" className="bg-gradient-to-r from-red-500 to-pink-500 border-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
