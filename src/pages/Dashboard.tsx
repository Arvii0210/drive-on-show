
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Users,
  BookOpen,
  Calculator,
  FileText,
  RotateCcw,
  Plus,
  TrendingUp,
  DollarSign,
  Filter,
  ChevronDown,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all'); // Default to all
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Sample data for different time periods
  const filterData = {
    'all': {
      people: '156',
      books: '342',
      royalties: '45',
      agreements: '189',
      renewals: '12',
      totalRoyalties: '₹12,45,680',
      pendingRoyalties: '₹1,25,230',
      activeAgreements: '94%'
    },
    '7': {
      people: '8',
      books: '12',
      royalties: '3',
      agreements: '15',
      renewals: '2',
      totalRoyalties: '₹45,230',
      pendingRoyalties: '₹12,450',
      activeAgreements: '85%'
    },
    '15': {
      people: '16',
      books: '28',
      royalties: '7',
      agreements: '24',
      renewals: '3',
      totalRoyalties: '₹1,25,680',
      pendingRoyalties: '₹28,750',
      activeAgreements: '89%'
    },
    '30': {
      people: '24',
      books: '56',
      royalties: '12',
      agreements: '38',
      renewals: '5',
      totalRoyalties: '₹2,45,680',
      pendingRoyalties: '₹45,230',
      activeAgreements: '92%'
    }
  };

  const currentData = filterData[selectedFilter as keyof typeof filterData];

  const moduleCards = [
    {
      title: 'People',
      count: currentData.people,
      description: 'Total people registered',
      icon: Users,
      action: 'View All People',
      route: '/people',
      gradient: 'from-blue-500 to-teal-500',
    },
    {
      title: 'Books Catalog',
      count: currentData.books,
      description: 'Published books',
      icon: BookOpen,
      action: 'View Books',
      route: '/books',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Royalty Payments',
      count: currentData.royalties,
      description: 'Royalty calculations',
      icon: Calculator,
      action: 'Calculate Royalties',
      route: '/royalty-calculations',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Agreements',
      count: currentData.agreements,
      description: 'Active agreements',
      icon: FileText,
      action: 'Manage Agreements',
      route: '/agreements',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Upcoming Renewals',
      count: currentData.renewals,
      description: 'Agreements expiring in next 90 days',
      icon: RotateCcw,
      action: 'View Renewals',
      route: '/renewals',
      gradient: 'from-cyan-500 to-blue-500',
    },
  ];

  const quickActions = [
    {
      title: 'New Agreement',
      icon: FileText,
      route: '/agreements/add',
      color: 'bg-gradient-to-r from-blue-600 to-blue-700',
    },
    {
      title: 'Add Book',
      icon: BookOpen,
      route: '/books/add',
      color: 'bg-gradient-to-r from-purple-600 to-purple-700',
    },
    {
      title: 'Add Author',
      icon: Users,
      route: '/people/add',
      color: 'bg-gradient-to-r from-green-600 to-green-700',
    },
    {
      title: 'Calculate Royalties',
      icon: Calculator,
      route: '/royalty-calculations',
      color: 'bg-gradient-to-r from-orange-600 to-orange-700',
    },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7', label: '7 Days' },
    { value: '15', label: '15 Days' },
    { value: '30', label: '30 Days' },
  ];

  const getFilterLabel = (value: string) => {
    return 'Filter';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-black animate-slide-up">
          Royalty Management Dashboard
        </h1>
        <p className="text-muted-foreground text-lg animate-slide-up">
          Manage your publishing business with powerful tools and insights
        </p>
      </div>

      {/* Filter and Clear Buttons */}
      <div className="flex justify-end gap-3">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              <Filter className="h-4 w-4" />
              <span className="font-medium">{getFilterLabel(selectedFilter)}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="space-y-1">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedFilter === option.value ? "default" : "ghost"}
                  className={`w-full justify-start text-left ${
                    selectedFilter === option.value 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSelectedFilter(option.value);
                    setIsPopoverOpen(false);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          onClick={() => setSelectedFilter('all')}
          className="px-6 py-2 bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          Clear
        </Button>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleCards.map((module, index) => (
          <Card 
            key={module.title} 
            className="card-gradient group cursor-pointer transition-all duration-300 hover:shadow-primary animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${module.gradient} text-white shadow-lg`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">
                    {module.count}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Total
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                {module.title}
              </CardTitle>
              <p className="text-muted-foreground text-sm mb-4">
                {module.description}
              </p>
              <Button
                onClick={() => navigate(module.route)}
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                {module.action}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Quick Actions Card */}
        <Card className="card-gradient col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={action.title}
                  onClick={() => navigate(action.route)}
                  className={`${action.color} text-white h-20 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 animate-scale-in rounded-lg`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center leading-tight">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
};

export default Dashboard;
