import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signup } from "@/lib/authService";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      const res = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const { userId } = res.data.data;
      toast({ title: "OTP sent to your email" });
      navigate("/verify-otp", { state: { userId, email: form.email } });
    } catch (err) {
      toast({
        variant: "destructive",
        title: err.response?.data?.message || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-80">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
