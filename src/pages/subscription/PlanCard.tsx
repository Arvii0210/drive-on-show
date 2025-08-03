/* ------------------------------------------------------------
   PlanCard.tsx  –  “wow” edition
   ------------------------------------------------------------ */
   import React from "react";
   import { motion } from "framer-motion";
   import { Badge } from "@/components/ui/badge2";
   import { Button } from "@/components/ui/button";
   import {
     Sparkles,
     CheckCircle2,
     Check,
     Calendar,
     Gift,
     Star,
     Crown,
     TrendingUp,
   } from "lucide-react";
   
   /* tiny helper for 3-D tilt */
   function useTilt(max = 15) {
     const ref = React.useRef<HTMLDivElement>(null);
     React.useEffect(() => {
       const el = ref.current;
       if (!el) return;
       const handle = (e: MouseEvent) => {
         const { left, top, width, height } = el.getBoundingClientRect();
         const x = ((e.clientX - left) / width - 0.5) * max;
         const y = ((e.clientY - top) / height - 0.5) * -max;
         el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
       };
       const reset = () => (el.style.transform = "perspective(900px)");
       el.addEventListener("mousemove", handle);
       el.addEventListener("mouseleave", reset);
       return () => {
         el.removeEventListener("mousemove", handle);
         el.removeEventListener("mouseleave", reset);
       };
     }, [max]);
     return ref;
   }
   
   interface PlanCardProps {
     id: string;
     displayName: string;
     type: string;
     price: number;
     premiumDownloads: number;
     standardDownloads: number;
     duration: number;
     description?: string;
     onBuy: () => void;
     isActive: boolean;
     isLoggedIn: boolean;
     large?: boolean;
     accent?: "green" | "purple" | "yellow" | "orange" | "blue";
     badge?: string; // e.g. “BEST VALUE”, “POPULAR”
   }
   
   const accentMap: Record<
     NonNullable<PlanCardProps["accent"]>,
     { from: string; to: string; ring: string }
   > = {
     blue:    { from: "from-sky-500", to: "to-indigo-500", ring: "ring-sky-500/60" },
     green:   { from: "from-emerald-500", to: "to-lime-500", ring: "ring-emerald-500/60" },
     purple:  { from: "from-purple-500", to: "to-fuchsia-500", ring: "ring-purple-500/60" },
     yellow:  { from: "from-amber-400", to: "to-orange-500", ring: "ring-amber-400/60" },
     orange:  { from: "from-orange-500", to: "to-rose-500", ring: "ring-orange-500/60" },
   };
   
   const PlanCard: React.FC<PlanCardProps> = ({
     displayName,
     type,
     price,
     premiumDownloads,
     standardDownloads,
     duration,
     description,
     onBuy,
     isActive,
     isLoggedIn,
     large,
     accent = "blue",
     badge,
   }) => {
     /* -------------------------------------------------- helpers */
     const isFree = type === "FREE";
     const { from, to, ring } = accentMap[accent];
     const tiltRef = useTilt();
   
     const handleClick = () => {
       if (!isLoggedIn) window.location.href = "/login";
       else onBuy();
     };
   
     /* -------------------------------------------------- jsx */
     return (
       <motion.div
         ref={tiltRef}
         whileHover={{ scale: 1.04 }}
         transition={{ type: "spring", stiffness: 260, damping: 18 }}
         className={`
           relative isolate flex flex-col items-center text-center overflow-hidden
           rounded-3xl p-8 ${large ? "min-h-[520px]" : "min-h-[460px]"}
           bg-gradient-to-br ${from} ${to} shadow-lg
           before:absolute before:inset-px before:rounded-[inherit]
           before:bg-zinc-50/80 before:dark:bg-zinc-900/80 before:backdrop-blur-xl
           ${isActive ? `ring-4 ${ring}` : "ring-1 ring-black/10 dark:ring-white/10"}
         `}
       >
         {/* floating blurred blob */}
         <span className="pointer-events-none absolute -top-32 -right-32 size-72 rounded-full bg-white/20 blur-3xl" />
   
         {/* corner badge */}
         {badge && (
           <Badge
             variant="primary"
             className="absolute top-5 right-5 z-10 px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md"
           >
             {badge === "BEST VALUE" ? (
               <Crown className="inline w-4 h-4 -mt-0.5 mr-1" />
             ) : (
               <TrendingUp className="inline w-4 h-4 -mt-0.5 mr-1" />
             )}
             {badge}
           </Badge>
         )}
   
         {/* icon */}
         <div className="relative z-10 mb-6 flex size-16 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 shadow-md backdrop-blur">
           {isFree ? (
             <Sparkles className="size-7 stroke-sky-600" />
           ) : (
             <Star className="size-7 stroke-yellow-500 fill-yellow-500/20" />
           )}
         </div>
   
         {/* title & price */}
         <h3 className="relative z-10 mb-1 text-2xl font-extrabold">{displayName}</h3>
         <div className="relative z-10 mb-2 flex items-end justify-center gap-1">
           <span className="text-5xl font-black">
             {isFree ? "0" : `₹${price}`}
           </span>
           {!isFree && <span className="font-semibold">/-</span>}
         </div>
         <p className="relative z-10 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
           {duration} day{duration > 1 && "s"} {isFree ? "free access" : "validity"}
         </p>
   
         {/* feature list */}
         <ul className="relative z-10 mb-8 w-full space-y-2 text-left">
           {premiumDownloads > 0 && (
             <li className="flex items-center gap-2 font-medium text-indigo-600">
               <Sparkles size={18} /> {premiumDownloads} Premium downloads
             </li>
           )}
           {standardDownloads > 0 && (
             <li className="flex items-center gap-2 font-medium text-emerald-600">
               <CheckCircle2 size={18} /> {standardDownloads} Standard downloads
             </li>
           )}
           <li className="flex items-center gap-2 font-medium text-fuchsia-600">
             <Calendar size={18} /> {duration} day validity
           </li>
           {description && (
             <li className="flex items-center gap-2 font-medium text-rose-600">
               <Gift size={18} /> {description.replace("🎁", "")}
             </li>
           )}
         </ul>
   
         {/* action button */}
         <Button
           disabled={isActive}
           onClick={handleClick}
           className={`
             relative z-10 w-full justify-center rounded-xl py-3 text-base font-semibold
             transition-all duration-200
             ${isActive
               ? "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed"
               : "bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:brightness-110 shadow-md"}
           `}
         >
           {isActive ? (
             <>
               <Check className="mr-2 size-5" /> Active plan
             </>
           ) : (
             isFree ? "Start for free" : "Choose plan"
           )}
         </Button>
       </motion.div>
     );
   };
   
   export default PlanCard;
   