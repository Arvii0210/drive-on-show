import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { loginWithEmail, googleLogin } from "@/lib/authService";
import { createSubscription, getUserSubscription } from "@/lib/subscriptionService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
        },
        token
      );

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user.id); // ✅ This was missing

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




  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/bg-login.jpg')" }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/95 shadow-xl rounded-2xl p-8 z-10 relative">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Site Logo" className="h-12" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to access free images and videos
        </p>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              className="rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-md"
            />
          </div>

          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            disabled={loading}
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 rounded-md hover:opacity-90"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-3">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Login */}
          <button
            onClick={googleLogin}
            className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Icon"
              className="h-5 w-5"
            />
            <span className="text-sm text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-semibold">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
