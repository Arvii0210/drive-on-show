import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { verifyOtp } from "@/services/authService";
import { 
  Shield, 
  Mail, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  RefreshCw,
  Smartphone
} from "lucide-react";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { userId, email } = location.state || {};
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      return toast({ 
        title: "Invalid OTP", 
        description: "Please enter a 6-digit OTP",
        variant: "destructive" 
      });
    }

    setIsLoading(true);
    try {
      const res = await verifyOtp({ userId, otp });
      if (res.status === 200) {
        toast({ 
          title: "Success!", 
          description: "Account verified successfully!",
          variant: "default"
        });
        navigate("/login");
      } else {
        toast({ 
          title: "Verification Failed", 
          description: "Please check your OTP and try again",
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Invalid or expired OTP. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setTimeLeft(30);
    setCanResend(false);
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your email",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
          <p className="text-gray-600">We've sent a verification code to your email</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center text-lg">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Enter Verification Code
            </CardTitle>
            <p className="text-sm text-gray-600">
              Code sent to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={(val) => setOtp(val)}
                className="justify-center"
              >
                <InputOTPGroup className="gap-2">
                  {[...Array(6)].map((_, idx) => (
                    <InputOTPSlot 
                      key={idx} 
                      index={idx}
                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Timer and Resend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
              
              <Button
                variant="link"
                size="sm"
                onClick={handleResendOTP}
                disabled={!canResend}
                className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Resend
              </Button>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verify Account
                </div>
              )}
            </Button>

            {/* Alternative Methods */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Or verify using</p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  SMS
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
            <Shield className="w-4 h-4 mr-2" />
            Your information is secure and encrypted
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto">
              Contact Support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
