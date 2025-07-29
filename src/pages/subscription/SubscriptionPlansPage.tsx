// Complete subscription plans page with API integration
import React from "react";
import { useNavigate } from "react-router-dom";
import PlanCard from "./PlanCard"; 
import { useSubscription } from "@/hooks/useSubscription";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info, Sparkles, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SubscriptionPlansPage: React.FC = () => {
  const { 
    plans, 
    userSubscription, 
    loading, 
    error, 
    createSubscription, 
    isLoggedIn,
    getActivePlanId
  } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();

  const activePlanId = getActivePlanId();

  const handleBuy = async (planId: string, type: string) => {
    if (!isLoggedIn) {
      // Store intended plan in localStorage for after login
      localStorage.setItem("intendedPlan", planId);
      navigate("/login");
      return;
    }
    
    if (type === "FREE") {
      await createSubscription(planId);
      return;
    }
    
    // For paid plans, redirect to payment gateway
    const paymentUrl = `http://localhost:3000/api/payments/checkout?planId=${planId}`;
    window.location.href = paymentUrl;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscription plans...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary hover:underline">
              Try again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const freePlans = plans.filter(p => p.type === "FREE");
  const premiumPlans = plans.filter(p => p.type === "PREMIUM");
  const litePlans = plans.filter(p => p.type === "LITE");

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Unlock unlimited downloads and premium content with our flexible subscription plans
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">10M+ Happy Users</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm">Premium Quality Assets</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Commercial License</span>
              </div>
            </div>
          </motion.div>

          {/* Free Plans */}
          {freePlans.length > 0 && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Start for Free</h2>
                <p className="text-muted-foreground">Get started with our free plan and explore our library</p>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  {freePlans.map(plan => (
                    <PlanCard
                      key={plan.id}
                      {...plan}
                      isActive={plan.id === activePlanId}
                      isLoggedIn={isLoggedIn}
                      onBuy={() => handleBuy(plan.id, plan.type)}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Premium Plans */}
          {premiumPlans.length > 0 && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Premium Plans</h2>
                <p className="text-muted-foreground">Unlock unlimited access with our premium subscriptions</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <PlanCard
                      {...plan}
                      isActive={plan.id === activePlanId}
                      isLoggedIn={isLoggedIn}
                      onBuy={() => handleBuy(plan.id, plan.type)}
                      popular={plan.displayName.toLowerCase().includes("pro")}
                      bestValue={plan.displayName.toLowerCase().includes("elite")}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Lite Plans */}
          {litePlans.length > 0 && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Lite Plans</h2>
                <p className="text-muted-foreground">Perfect for occasional downloads and specific needs</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {litePlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <PlanCard
                      {...plan}
                      isActive={plan.id === activePlanId}
                      isLoggedIn={isLoggedIn}
                      onBuy={() => handleBuy(plan.id, plan.type)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Info Section */}
          <motion.div 
            className="bg-muted/30 border rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Info className="inline-block h-5 w-5 mr-2 text-primary" />
            <span className="text-muted-foreground">
              Need help choosing? Contact our support team or upgrade/downgrade anytime. 
              All unused credits carry forward when you upgrade.
            </span>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SubscriptionPlansPage;
