import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  Download,
  Heart
} from "lucide-react";
import { loginWithEmail, googleLogin } from "@/services/authService";
import { createSubscription, getUserSubscription } from "@/services/subscriptionService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return toast({
        title: "Please enter email and password",
        variant: "destructive",
      });
    }

    try {
      setLoading(true);
      const res = await loginWithEmail({ email, password });

      if (res.status === 200) {
        const user = res.data?.data?.user;
        const token = res.data?.data?.token;
        
        // Save Auth
        login(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || "",
            createdAt: user.createdAt || "",
          },
          token
        );

        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user.id);
        console.log("User data being stored:", user);

        // Subscription logic
        try {
          const sub = await getUserSubscription(user.id);
          if (!sub) {
            await createSubscription(user.id, "FREE");
          }
        } catch (err: any) {
          if (err?.response?.status === 404) {
            await createSubscription(user.id, "FREE");
          }
        }

        toast({ title: "Logged in successfully!" });
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: err?.response?.data?.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Download, text: "Unlimited Downloads", color: "text-blue-600" },
    { icon: Heart, text: "Premium Content", color: "text-red-600" },
    { icon: Users, text: "Community Access", color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                  Forgot password?
                </Button>
              </div>

              {/* Login Button */}
              <Button
                disabled={loading}
                onClick={handleLogin}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              {/* Google Login */}
              <Button
                onClick={googleLogin}
                variant="outline"
                className="w-full h-12 border-2 hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5 mr-3"
                />
                Continue with Google
              </Button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/register")}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                  >
                    Sign up
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
              <Shield className="w-4 h-4 mr-2" />
              Your data is secure and encrypted
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-6">Unlock Your Creative Potential</h2>
            <p className="text-xl mb-8 text-blue-100">
              Access millions of high-quality assets and join our growing community
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">10M+</div>
                <div className="text-sm text-blue-100">Assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-blue-100">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-blue-100">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
