import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  AlertTriangle, 
  Compass,
  Sparkles,
  Users,
  Download
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const popularPages = [
    { name: "Home", path: "/", icon: Home },
    { name: "Assets", path: "/assets", icon: Download },
    { name: "Categories", path: "/categories", icon: Search },
    { name: "Community", path: "/community", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl mb-6 shadow-lg">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 text-lg">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Compass className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Let's Get You Back on Track
              </h3>
              <p className="text-gray-600">
                Here are some popular pages you might be looking for:
              </p>
            </div>

            {/* Popular Pages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {popularPages.map((page, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex items-center justify-start space-x-3 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  onClick={() => window.location.href = page.path}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <page.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">{page.name}</span>
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => window.location.href = "/"}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1 h-12 border-2 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-yellow-50 text-yellow-700 px-6 py-3 rounded-full text-sm">
            <Search className="w-4 h-4 mr-2" />
            Can't find what you're looking for? Try our search feature
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Discover Assets</h4>
            <p className="text-sm text-gray-600">Explore millions of high-quality assets</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Join Community</h4>
            <p className="text-sm text-gray-600">Connect with fellow creators</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <Download className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Download Assets</h4>
            <p className="text-sm text-gray-600">Get unlimited downloads</p>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Still having trouble?{" "}
            <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
              Contact Support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
