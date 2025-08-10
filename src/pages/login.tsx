import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react'; // ✅ Make sure this is imported

const Login = () => {
  const [username, setUsername] = useState(''); // ✅ changed from "email"
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password); // ✅ username instead of email
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to Kalachuvadu Publication Dashboard',
          variant: 'default',
        });
        navigate('/'); // ✅ redirect after login
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-warm border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full overflow-hidden shadow-md flex items-center justify-center">
              <img
                src="Assets/kalachuvadu-logo.jpg"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                Kalachuvadu Publication
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Admin Dashboard Login
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin@Kalachuvadu.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-border focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo credentials:</p>
              <p className="text-xs">
                Email: admin@Kalachuvadu.com | Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
