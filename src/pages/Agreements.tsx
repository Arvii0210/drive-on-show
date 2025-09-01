import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  FileText, 
  Users, 
  TrendingUp, 
  Globe, 
  Edit, 
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  MapPin,
  DollarSign,
  Percent,
  Eye,
  Download,
  ArrowUpRight,
  Building2,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { getRights, deleteRight } from '@/services/rights.service';
import { RightsPayload, RightsType } from '@/models/rights.model';
import { toast } from '@/components/ui/use-toast';

export default function Agreements() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buying');
  const [buyingRights, setBuyingRights] = useState<RightsPayload[]>([]);
  const [sellingRights, setSellingRights] = useState<RightsPayload[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    (async () => {
      const buying = await getRights({ rightsType: 'BUYING' });
      if (buying.status === 'success') setBuyingRights(buying.data.rights);

      const selling = await getRights({ rightsType: 'SELLING' });
      if (selling.status === 'success') setSellingRights(selling.data.rights);
    })();
  }, []);

  const fetchData = async () => {
    try {
      const filters = { rightsType: activeTab.toUpperCase() as RightsType };
      const response = await getRights(filters);

      if (response.status === 'success' && Array.isArray(response.data.rights)) {
        const rightsArray = response.data.rights;
        if (activeTab === 'buying') {
          setBuyingRights(rightsArray);
        } else {
          setSellingRights(rightsArray);
        }
      }
    } catch (error) {
      console.error('Error fetching rights:', error);
    }
  };

  const totalBuyingRights = buyingRights.length;
  const totalSellingRights = sellingRights.length;
  const activeBuyingRights = buyingRights.filter(item => item.isActive).length;
  const activeSellingRights = sellingRights.filter(item => item.isActive).length;

  const formatCurrency = (amount: number = 0, currency = 'USD') => {
  const symbols: Record<string, string> = {
    INR: '₹', USD: '$', EUR: '€', NPR: 'Rs', GBP: '£',
  };
  const symbol = symbols[currency] ?? currency;
  return `(${symbol})  ${amount.toLocaleString()} `;
};


  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this agreement?')) {
      return;
    }

    try {
      await deleteRight(id);
      toast({
        title: "Success",
        description: "Agreement deleted successfully",
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete agreement",
        variant: "destructive",
      });
    }
  };

  const filteredData = (activeTab === 'buying' ? buyingRights : sellingRights).filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.person?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && item.isActive) ||
      (statusFilter === 'inactive' && !item.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const MetricCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 group bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <div className="flex items-center space-x-2">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              {trend && (
                <div className="flex items-center text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {trend}%
                </div>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 w-full h-1 ${color.replace('text-', 'bg-')} opacity-20`}></div>
      </CardContent>
    </Card>
  );

  const RightsCard = ({ item, type }: { item: RightsPayload; type: 'buying' | 'selling' }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-200 bg-white overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
  {item.person?.name}
</p>
<p className="text-sm text-slate-500">
  {type === 'buying' ? item.role : item.person?.personType} • {item.country}
</p>

                
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={item.isActive ? "default" : "secondary"}
                className={`${
                  item.isActive 
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                    : "bg-red-500 text-white border-slate-200"
                } border`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                 
                  <DropdownMenuItem onClick={() => navigate(`/rights/${type}-rights/edit/${item.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Agreement
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-slate-500 text-xs">
                <div className="h-3 w-3 mr-1" />
                ADVANCE PAID
              </div>
              <p className="font-semibold text-slate-900">
                {formatCurrency(item.advancePaid || 0, item.currency)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-slate-500 text-xs">
                <Percent className="h-3 w-3 mr-1" />
                ROYALTY RATE
              </div>
              <p className="font-semibold text-emerald-600">
                {item.royalties}%
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-slate-500 text-xs">
                <Globe className="h-3 w-3 mr-1" />
                LANGUAGE
              </div>
              <p className="font-semibold text-slate-900">
                {item.languages || 'Multiple'}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-slate-500 text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                COUNTRY
              </div>
              <p className="font-semibold text-slate-900">
                {item.country}
              </p>
            </div>
          </div>

          {type === 'selling' && item.rightsType && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {item.rightsType}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">
              Rights Management
            </h1>
            <p className="text-slate-600">
              Manage your publishing and distribution agreements
            </p>
          </div>
          
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Buying Rights"
            value={totalBuyingRights}
            icon={Globe}
            
            color="text-indigo-600"
          />
          <MetricCard
            title="Total Selling Rights"
            value={totalSellingRights}
            icon={FileText}
            
            color="text-emerald-600"
          />
          <MetricCard
            title="Active Buying"
            value={activeBuyingRights}
            icon={UserCheck}
            color="text-blue-600"
          />
          <MetricCard
            title="Active Selling"
            value={activeSellingRights}
            icon={TrendingUp}
            color="text-purple-600"
          />
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-0">
            {/* Tabs Header */}
            <div className="border-b border-slate-200">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 pb-0 gap-4">
                  <TabsList className="bg-slate-100 p-1 h-10">
                    <TabsTrigger 
                      value="buying" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Buying Rights ({totalBuyingRights})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="selling"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Selling Rights ({totalSellingRights})
                    </TabsTrigger>
                  </TabsList>

                  {/* Search and Filters */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search agreements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64 border-slate-300"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32 border-slate-300">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <TabsContent value="buying" className="mt-0">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Buying Rights Agreements
                        </h3>
                        <p className="text-sm text-slate-600">
                          {filteredData.length} of {totalBuyingRights} agreements
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate('/rights/buying-rights/add')}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Buying Right
                      </Button>
                    </div>

                    <div className="grid gap-6">
                      {filteredData.map((item, index) => (
                        <RightsCard key={item.id || index} item={item} type="buying" />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="selling" className="mt-0">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Selling Rights Agreements
                        </h3>
                        <p className="text-sm text-slate-600">
                          {filteredData.length} of {totalSellingRights} agreements
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate('/rights/selling-rights/add')}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Selling Right
                      </Button>
                    </div>

                    <div className="grid gap-6">
                      {filteredData.map((item) => (
                        <RightsCard key={item.id} item={item} type="selling" />
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No agreements found
              </h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first rights agreement'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button 
                  onClick={() => navigate(`/rights/${activeTab}-rights/add`)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Agreement
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
