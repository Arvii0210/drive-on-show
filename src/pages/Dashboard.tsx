import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  FileText,
  Calculator,
  ArrowRight,
  BarChart3,
  Zap,
  Clock,
  ArrowUp,
  ArrowDown,
  Globe,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Settings,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import {
  fetchDashboardStats,
  DashboardResponse,
  TotalsStats,
  PeriodStats,
} from '@/services/dashboard.service';
import { useAuth } from '@/contexts/AuthContext'; 

// Time period filter type
type TimePeriod = 'total' | 'last7Days' | 'last15Days' | 'last30Days';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 

  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('total');

  useEffect(() => {
    if (!token) return;
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardStats(token); // Pass token here
        setStats(data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]); // <-- Use token as dependency

  // Helper function to get count based on selected period
  const getCount = (periodStats: PeriodStats): number => {
    return periodStats[selectedPeriod] || 0;
  };

  const recentPersons = (stats?.data?.personsByType || [])
    .filter((item) => !!item)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const recentBooks = (stats?.data?.booksByCategory || [])
    .filter((item) => !!item)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  // Helper function to get trend percentage
  const getTrendPercentage = (periodStats: PeriodStats): number => {
    const current = periodStats.last7Days;
    const previous = periodStats.last15Days - periodStats.last7Days;
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Period filter options
  const periodOptions = [
    { value: 'total', label: 'All Time' },
    { value: 'last7Days', label: 'Last 7 Days' },
    { value: 'last15Days', label: 'Last 15 Days' },
    { value: 'last30Days', label: 'Last 30 Days' },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-3">Error Loading Dashboard</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!loading && stats && !stats.data?.totals) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-3">No Data Available</h2>
          <p className="text-slate-600">Dashboard data is not available at the moment.</p>
        </div>
      </div>
    );
  }

  const totals: TotalsStats | undefined = stats?.data?.totals;

  if (!totals) {
    return null; // Or show a loading/empty state
  }

  const moduleCards = [
    {
      title: 'People',
      count: getCount(totals.persons) || 0,
      trend: getTrendPercentage(totals.persons) || 0,
      description: 'Total people registered',
      icon: Users,
      action: 'View All People',
      route: '/people',
      color: 'blue',
    },
    {
      title: 'Books Catalog',
      count: getCount(totals.books),
      trend: getTrendPercentage(totals.books),
      description: 'Published books',
      icon: BookOpen,
      action: 'View Books',
      route: '/books',
      color: 'indigo',
    },
    {
      title: 'Rights',
      count: getCount(totals.rights),
      trend: getTrendPercentage(totals.rights),
      description: 'Rights assigned',
      icon: FileText,
      action: 'Manage Rights',
      route: '/agreements',
      color: 'emerald',
    },
    {
      title: 'Own Publishings',
      count: getCount(totals.ownPublishings),
      trend: getTrendPercentage(totals.ownPublishings),
      description: 'Self-published works',
      icon: BookOpen,
      action: 'View Own Publishings',
      route: '/royalty-calculations',
      color: 'amber',
    },
  ];

  const quickActions = [
    {
      title: 'New Agreement',
      description: 'Create publishing contracts',
      icon: FileText,
      route: '/rights/buying-rights/add',
      color: 'blue',
    },
    {
      title: 'Add Book',
      description: 'Add to publishing catalog',
      icon: BookOpen,
      route: '/books/add',
      color: 'indigo',
    },
    {
      title: 'Add Author',
      description: 'Register new contributors',
      icon: Users,
      route: '/people/add',
      color: 'emerald',
    },
    {
      title: 'Calculate Royalties',
      description: 'Process royalty payments',
      icon: Calculator,
      route: '/rights/own-publishing/add',
      color: 'amber',
    },
  ];

  // Color mapping for consistent theming
  const colorMap = {
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      light: 'bg-blue-50',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600',
    },
    indigo: {
      bg: 'bg-indigo-600',
      hover: 'hover:bg-indigo-700',
      text: 'text-indigo-600',
      light: 'bg-indigo-50',
      border: 'border-indigo-200',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-600',
      hover: 'hover:bg-emerald-700',
      text: 'text-emerald-600',
      light: 'bg-emerald-50',
      border: 'border-emerald-200',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    amber: {
      bg: 'bg-amber-600',
      hover: 'hover:bg-amber-700',
      text: 'text-amber-600',
      light: 'bg-amber-50',
      border: 'border-amber-200',
      gradient: 'from-amber-500 to-amber-600',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Language and Settings Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Royalty Management Dashboard</h1>
          
        </div>

        {/* Time Period Filter */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            
            <div className="flex flex-wrap gap-2">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value as TimePeriod)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  aria-current={selectedPeriod === option.value ? 'true' : 'false'}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {moduleCards.map((module) => {
            const colors = colorMap[module.color as keyof typeof colorMap];
            return (
              <Card
                key={module.title}
                className="border border-slate-200 shadow-sm hover:shadow transition-all duration-200 overflow-hidden"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-md ${colors.light}`}>
                      <module.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-slate-800">
                        {module.count.toLocaleString()}
                      </span>
                      
                      {selectedPeriod !== 'total' && module.trend !== 0 && (
                        <span className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                          module.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {module.trend > 0 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {Math.abs(module.trend)}%
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <h3 className="font-medium text-slate-800 mb-1">{module.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{module.description}</p>
                  
                  <Button
                    onClick={() => navigate(module.route)}
                    variant="outline"
                    size="sm"
                    className={`w-full text-sm border-slate-200 ${colors.text} hover:bg-slate-50 justify-between`}
                  >
                    {module.action}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Two Column Layout for Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="border border-slate-200 shadow-sm lg:col-span-1">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Actions
              </CardTitle>
              
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const colors = colorMap[action.color as keyof typeof colorMap];
                  return (
                    <Button
                      key={action.title}
                      onClick={() => navigate(action.route)}
                      variant="outline"
                      className={`w-full justify-between items-center h-auto py-3 px-4 border-slate-200 hover:border-${action.color}-300 hover:${colors.light} group`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`p-2 rounded-md ${colors.light} group-hover:${colors.bg} group-hover:text-white transition-colors`}>
                          <action.icon className={`h-4 w-4 ${colors.text} group-hover:text-white transition-colors`} />
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-slate-800">{action.title}</span>
                          <span className="block text-xs text-slate-500">{action.description}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                    </Button>
                  );
                })}
                
                
              </div>
            </CardContent>
          </Card>

          {/* Analytics Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Persons by Type */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Team Members by Role
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/people')}
                  className="h-8 text-xs border-slate-200"
                >
                  View All
                </Button>
              </CardHeader>
              
              <CardContent>
                {recentPersons.length > 0 ? (
                  <div className="space-y-2">
                    {recentPersons.map((item) => (
                      <div 
                        key={item.type} 
                        className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center font-medium">
                            {item.type.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-slate-800">{item.type}</span>
                            <span className="block text-xs text-slate-500">Active contributors</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-slate-800">{item.count}</span>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-slate-500 text-sm">No person data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Books by Category */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  Books by Category
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/books')}
                  className="h-8 text-xs border-slate-200"
                >
                  View All
                </Button>
              </CardHeader>
              
              <CardContent>
                {recentBooks.length > 0 ? (
                  <div className="space-y-2">
                    {recentBooks.map((item) => (
                      <div 
                        key={item.category} 
                        className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center font-medium">
                            {item.category.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-slate-800">{item.category}</span>
                            <span className="block text-xs text-slate-500">Published titles</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-slate-800">{item.count}</span>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <BookOpen className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-slate-500 text-sm">No book category data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-6 flex justify-between items-center bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>System operational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
