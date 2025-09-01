import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, Info, ExternalLink } from 'lucide-react';
import { Eye, EyeOff } from "lucide-react";


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        toast({
          title: 'Authentication Successful',
          description: 'Welcome to the Kalachuvadu Royalty Management System',
        });
        navigate('/'); 
      } else {
        toast({
          title: 'Authentication Failed',
          description: 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'System Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Content container */}
      <div className="w-full max-w-md z-10">
        {/* Logo and brand header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img 
              src="/Assets/kalachuvadu-logo.jpg" 
              alt="Kalachuvadu Publications" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Kalachuvadu Publications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Global Royalty Management System
          </p>
        </div>

        {/* Login card */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username or Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    placeholder="admin@kalachuvadu.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
  <div className="flex justify-between items-center">
    <Label htmlFor="password" className="text-sm font-medium">
      Password
    </Label>
  </div>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      placeholder="••••••••"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
</div>


              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  "Sign in to Dashboard"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 px-6 py-4">
            <div className="flex items-start text-xs text-gray-500 dark:text-gray-400">
              <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                This is a secure system for managing royalty distributions, contracts, and financial analytics 
                for authors and publishers. Unauthorized access is prohibited.
              </span>
            </div>
            
           
          </CardFooter>
        </Card>

        {/* Footer links */}
        

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} Kalachuvadu Publications. All rights reserved.</p>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
