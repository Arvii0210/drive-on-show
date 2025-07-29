import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyOtp } from "@/lib/authService";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { userId, email } = location.state || {};
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      return toast({ title: "Enter a 6-digit OTP", variant: "destructive" });
    }

    try {
      const res = await verifyOtp({ userId, otp });
      if (res.status === 200) {
        toast({ title: "Account verified successfully!" });
        navigate("/login");
      } else {
        toast({ title: "OTP verification failed", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Invalid or expired OTP", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          An OTP has been sent to <span className="font-medium">{email}</span>
        </p>

        <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
          <InputOTPGroup>
            {[...Array(6)].map((_, idx) => (
              <InputOTPSlot key={idx} index={idx} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button
          onClick={handleVerify}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Verify OTP
        </Button>
      </div>
    </div>
  );
};

export default VerifyOtp;
