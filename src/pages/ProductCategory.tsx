import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

interface Product {
  sku: string;
  name: string;
  image: string;
  description: string;
  features?: string[];
  cat2?: string;
  link?: string;
}

const categoryData: Record<string, { title: string; description: string; products: Product[] }> = {
  lohia: {
    title: "Lohia Loom Spare Parts",
    description: "Designed for precision and durability, our Lohia spares ensure optimal loom performance.",
    products: [
      {
    "sku": "JOCKEY-LEVER-S-001",
    "name": "JOCKEY LEVER-S",
    "image": "/lsi/jockey s.jpeg",
    "description": "JOCKEY LEVER-S. Cat: WLSL6 0625 15",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/jockey-lever-s"
  },
  {
    "sku": "JOCKEY-LEVER-62-002",
    "name": "JOCKEY LEVER-62",
    "image": "/lsi/jockey62.jpeg",
    "description": "JOCKEY LEVER-62. Cat: WLSL6 0614 16; WLSL6 0615 16; WLSL6 0616 16; WLSL6 0621 16; WLSL6M 0624 16",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/jockey-lever-62"
  },
  {
    "sku": "UPPER-HEDDLE-BELT-003",
    "name": "UPPER HEDDLE BELT",
    "image": "/lsi/upper belt.jpeg",
    "description": "UPPER HEDDLE BELT. Cat: WLSL6 0716 07; WLSL6 0730 07",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/upper-heddle-belt"
  },
  {
    "sku": "LOWER-HEDDLE-BELT-004",
    "name": "LOWER HEDDLE BELT",
    "image": "/lsi/lower belt.jpeg",
    "description": "LOWER HEDDLE BELT. Cat: 19 0716W 6LSL; 19 0730 W6LSL",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/lower-heddle-belt"
  },
  {
    "sku": "SHUTTLE-ROLLER-P-005",
    "name": "SHUTTLE ROLLER-P",
    "image": "/lsi/shuter roller.jpg",
    "description": "SHUTTLE ROLLER-P. Cat: WLSL6 9906 07; WLSL6M 9994 04",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/shuttle-roller-p"
  },
  {
    "sku": "CAM-ROLLER-006",
    "name": "CAM ROLLER",
    "image": "/lsi/cam.jpg",
    "description": "CAM ROLLER. Cat: WLSL6 0614 06; WLSL6 0615 06; WLSL6 0616 06",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/cam-roller"
  },
  {
    "sku": "CHONCHOID-ROLLER-P-007",
    "name": "CHONCHOID ROLLER-P",
    "image": "/lsi/chon.jpeg",
    "description": "CHONCHOID ROLLER-P. Cat: WLSL6 9945 03",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/chonchoid-roller-p"
  },
  {
    "sku": "STOPPER-WHEEL-AP-008",
    "name": "STOPPER WHEEL-AP",
    "image": "/lsi/stopper.jpeg",
    "description": "STOPPER WHEEL-AP. Cat: WLSL6 9973 11",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/stopper-wheel-ap"
  },
  {
    "sku": "CHONCHOID-ROLLER-AP-009",
    "name": "CHONCHOID ROLLER-AP",
    "image": "/lsi/chonAP.jpg",
    "description": "CHONCHOID ROLLER-AP. Cat: WLSL6 9973 03",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/chonchoid-roller-ap"
  },
  {
    "sku": "CHONCHOID-ROLLER-010",
    "name": "CHONCHOID ROLLER",
    "image": "/lsi/chon2.jpg",
    "description": "CHONCHOID ROLLER. Cat: WLSL6 0904 16",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/chonchoid-roller-0904-16"
  },
  {
    "sku": "STOPPER-ROLLER-011",
    "name": "STOPPER ROLLER",
    "image": "/lsi/stopper2.jpg",
    "description": "STOPPER ROLLER. Cat: WLSL6 9956 11",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/stopper-roller-9956-11"
  },
  {
    "sku": "SHUTTLE-WHEEL-012",
    "name": "SHUTTLE WHEEL",
    "image": "/lsi/shutter1.jpg",
    "description": "SHUTTLE WHEEL. Cat: WLSL 9922 04",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/shuttle-wheel-9922-04"
  },
  {
    "sku": "STOPPER-ROLLER-013",
    "name": "STOPPER ROLLER",
    "image": "/lsi/stopper3.jpg",
    "description": "STOPPER ROLLER. Cat: WLSL6 0904 11",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/stopper-roller-0904-11"
  },
  {
    "sku": "PUSHER-ROLLER-014",
    "name": "PUSHER ROLLER",
    "image": "/lsi/push.jpg",
    "description": "PUSHER ROLLER. Cat: WLSL6 0809 01",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/pusher-roller"
  },
  {
    "sku": "SHUTTLE-WHEEL-015",
    "name": "SHUTTLE WHEEL",
    "image": "/lsi/shutter2.jpg",
    "description": "SHUTTLE WHEEL. Cat: WLSL6 0904 05; WLSL6 9956 05",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/shuttle-wheel-0904-05"
  },
  {
    "sku": "CHONCHOID-ROLLER-016",
    "name": "CHONCHOID ROLLER",
    "image": "/lsi/chon3.jpg",
    "description": "CHONCHOID ROLLER. Cat: WLSL6 0904 16",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/chonchoid-roller-0904-16"
  },
  {
    "sku": "BANDAGE-017",
    "name": "BANDAGE",
    "image": "/lsi/bandage.jpg",
    "description": "BANDAGE. Cat: WLSL6 0801 11; WLSL6 0802 11; WLSL6M 0804 11",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/bandage"
  },
  {
    "sku": "STOPPER-WHEEL-P-018",
    "name": "STOPPER WHEEL-P",
    "image": "/lsi/stopper4.jpg",
    "description": "STOPPER WHEEL-P. Cat: WLSL6 9945 11",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/stopper-wheel-p"
  },
  {
    "sku": "SHUTTLE-WHEEL-P-019",
    "name": "SHUTTLE WHEEL-P",
    "image": "/lsi/shutter3.jpg",
    "description": "SHUTTLE WHEEL-P. Cat: WLSL6 9945 14; WLSL6 9973 14",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/shuttle-wheel-p"
  },
  {
    "sku": "CAM-ROLLER-S-020",
    "name": "CAM ROLLER -S",
    "image": "/lsi/cam1.jpg",
    "description": "CAM ROLLER -S. Cat: WLSL6 0621 06; WLSL6 0625 06; WLSL6M 0624 06",
    "features": ["OEM fit", "Durable", "Quality assured"],
    "link": "/products/cam-roller-s"
  }
    ],
  },
  gcl: {
    title: "GCL Accessories",
    description: "Comprehensive accessories for GCL looms including pulleys, rollers & grommets.",
    products: [
      {
    sku: "GCL-6S-MA016",
    name: "Connecting Stud",
    image: "/gcl/gcl1.jpg",
    description: "Durable connecting stud for reliable loom assembly.",
    features: ["High tensile strength", "Precision cast", "Corrosion resistant"],
    link: "/products/gcl6s/connecting-stud"
  },
  {
    sku: "GCL-6S-SA001",
    name: "Shuttle Body",
    image: "/gcl/gcl2.jpg",
    description: "High-quality shuttle body designed for smooth shuttle motion.",
    features: ["Accurate design", "Long lasting", "Stable performance"],
    link: "/products/gcl6s/shuttle-body"
  },
  {
    sku: "GCL-6S-SA029",
    name: "Concord Wheel Rear",
    image: "/gcl/gcl3.jpg",
    description: "Rear concord wheel ensures proper loom movement alignment.",
    features: ["Precision engineered", "Durable material", "Smooth rotation"],
    link: "/products/gcl6s/concord-wheel-rear"
  },
  {
    sku: "GCL-6S-SA036",
    name: "Concord Wheel Front",
    image: "/gcl/gcl4.jpg",
    description: "Front concord wheel for efficient loom shuttle drive.",
    features: ["Wear resistant", "Balanced design", "Smooth operation"],
    link: "/products/gcl6s/concord-wheel-front"
  },
  {
    sku: "GCL-6S-MA011",
    name: "Cam Follower",
    image: "/gcl/gcl5.jpg",
    description: "Precision cam follower for synchronized loom mechanisms.",
    features: ["High precision", "Long service life", "Low friction"],
    link: "/products/gcl6s/cam-follower"
  },
  {
    sku: "GCL-6S-SA026",
    name: "Shuttle Wheel",
    image: "/gcl/gcl6.jpg",
    description: "Reliable shuttle wheel for smooth and stable shuttle movement.",
    features: ["High wear resistance", "Smooth rolling", "Durable design"],
    link: "/products/gcl6s/shuttle-wheel"
  },
  {
    sku: "GCL-6S-SA020",
    name: "Shuttle Roller Wheel",
    image: "/gcl/gcl7.jpg",
    description: "Quality roller wheel for shuttle movement and alignment.",
    features: ["Precision rolling", "Long life", "Efficient operation"],
    link: "/products/gcl6s/shuttle-roller-wheel"
  },
  {
    sku: "GCL-6S-UA025",
    name: "Pusher Wheel",
    image: "/gcl/gcl8.jpg",
    description: "Strong pusher wheel supporting uniform shuttle motion.",
    features: ["High durability", "Stable performance", "Accurate fit"],
    link: "/products/gcl6s/pusher-wheel"
  },
  {
    sku: "GCL-6S-MA009",
    name: "Crank Arm",
    image: "/gcl/gcl9.jpg",
    description: "Robust crank arm for loom motion conversion mechanisms.",
    features: ["High rigidity", "Corrosion resistant", "Precision fit"],
    link: "/products/gcl6s/crank-arm"
  },
  {
    sku: "GCL-6S-MA015",
    name: "Sintered Bush (Crank Arm)",
    image: "/gcl/gcl10.jpg",
    description: "Self-lubricating sintered bush used in crank arm assemblies.",
    features: ["Low friction", "Long life", "Maintenance free"],
    link: "/products/gcl6s/sintered-bush"
  },
  {
    sku: "GCL-6S-MA999",
    name: "Shuttle Mount Assembly",
    image: "/gcl/gcl11.jpg",
    description: "Complete shuttle mounting setup ensuring smooth operation.",
    features: ["Stable alignment", "Durable design", "Easy installation"],
    link: "/products/gcl6s/shuttle-mount-assembly"
  },
  {
    sku: "GCL-6S-MA998",
    name: "Connecting Rod Set",
    image: "/gcl/gcl12.jpg",
    description: "Precision connecting rods for synchronized shuttle motion.",
    features: ["High strength", "Tight tolerance", "Reliable operation"],
    link: "/products/gcl6s/connecting-rod-set"
  },
    ],
  },
  starlinger: {
    title: "Starlinger Spares",
    description: "Starlinger replacement parts and wear components for consistent uptime.",
    products:[
  {
    sku: "GCL-TL-001",
    name: "Martor Blade No. 81",
    image: "/taper/1.jpg",
    description: "High-precision Martor industrial blade designed for smooth and accurate filament cutting.",
    features: ["Corrosion resistant", "Double-edged sharpness", "German quality steel"],
    link: "/products/tapeline/martor-blade-no81"
  },
  {
    sku: "GCL-TL-002",
    name: "Martor EBSCHARTER Blade",
    image: "/taper/2.jpg",
    description: "Premium-grade blade for precise and consistent tape line extrusion cutting applications.",
    features: ["Long life edge", "High wear resistance", "Precision ground finish"],
    link: "/products/tapeline/martor-ebschartner-blade"
  },
  {
    sku: "GCL-TL-003",
    name: "Double Edge Razor Blade",
    image: "/taper/3.jpg",
    description: "Universal razor blade for smooth cutting of PP and HDPE tapes.",
    features: ["Ultra-sharp edge", "Rust-resistant coating", "Compatible with all models"],
    link: "/products/tapeline/double-edge-razor-blade"
  },
  {
    sku: "GCL-TL-004",
    name: "Single Edge Industrial Blade",
    image: "/taper/4.jpg",
    description: "Durable single-edge blade designed for trimming and finishing operations.",
    features: ["Precision ground edge", "Safe handling design", "Economical and long-lasting"],
    link: "/products/tapeline/single-edge-industrial-blade"
  },
  {
    sku: "GCL-TL-005",
    name: "Cutting Blade Insert",
    image: "/taper/5.jpg",
    description: "Insert blade compatible with tapeline extrusion systems for efficient material cutting.",
    features: ["High-speed steel", "Fine edge retention", "Consistent cutting performance"],
    link: "/products/tapeline/cutting-blade-insert"
  },
  {
    sku: "GCL-TL-006",
    name: "Cutter Blade Holder",
    image: "/taper/6.jpg",
    description: "Precision holder for industrial cutting blades ensuring secure alignment.",
    features: ["Accurate fitting", "High rigidity", "Corrosion resistant body"],
    link: "/products/tapeline/cutter-blade-holder"
  },
  {
    sku: "GCL-TL-007",
    name: "Cutter Sleeve",
    image: "/taper/7.jpg",
    description: "Hardened cutter sleeve for guiding cutting shafts in extrusion lines.",
    features: ["Wear-resistant steel", "Accurate tolerance", "Smooth internal finish"],
    link: "/products/tapeline/cutter-sleeve"
  },
  {
    sku: "GCL-TL-008",
    name: "Extruder Filter Mesh",
    image: "/taper/8.jpg",
    description: "Fine mesh filter for removing impurities from molten polymer during extrusion.",
    features: ["High filtration efficiency", "Stainless steel mesh", "Easy to replace"],
    link: "/products/tapeline/extruder-filter-mesh"
  },
  {
    sku: "GCL-TL-009",
    name: "Breaker Plate",
    image: "/taper/9.jpg",
    description: "Durable breaker plate providing even melt flow and supporting filter mesh.",
    features: ["Precision drilled holes", "Corrosion proof", "Heavy-duty steel"],
    link: "/products/tapeline/breaker-plate"
  },
  {
    sku: "GCL-TL-010",
    name: "Pressure Gauge Assembly",
    image: "/taper/10.jpg",
    description: "Digital pressure gauge assembly for monitoring extruder melt pressure accurately.",
    features: ["High-accuracy reading", "Digital display", "Easy installation"],
    link: "/products/tapeline/pressure-gauge-assembly"
  },
  {
    sku: "GCL-TL-011",
    name: "Extruder Conveyor Belt",
    image: "/taper/11.jpg",
    description: "Durable blue conveyor belt suitable for transporting filament and tapes.",
    features: ["Anti-slip surface", "High-temperature tolerance", "Flexible yet strong"],
    link: "/products/tapeline/extruder-conveyor-belt"
  },
  {
    sku: "GCL-TL-012",
    name: "Knife Blade for Cutter Assembly",
    image: "/taper/12.jpg",
    description: "Replacement knife blade for tapeline cutter units ensuring clean cuts.",
    features: ["High carbon steel", "Precision ground", "Compatible with multiple models"],
    link: "/products/tapeline/knife-blade-cutter"
  }
],
  },
  lsfil23: {
    title: "LS-FIL-23",
    description: "Replacement parts for LS-FIL-23 looms.",
    products: [
      {
    "sku": "COMPLETE-GUIDE-ROLLER-001",
    "name": "COMPLETE GUIDE ROLLER",
    "image": "/lsfi23/1.jpg",
    "description": "COMPLETE GUIDE ROLLER. Cat: F23 0700 03",
    "features": ["High precision", "OEM compatible", "Durable build"],
    "link": "/products/lsfil23/complete-guide-roller"
  },
  {
    "sku": "CAM-FOLLOWER-002",
    "name": "CAM FOLLOWER",
    "image": "/lsfi23/2.jpg",
    "description": "CAM FOLLOWER. Cat: F23 0700 03",
    "features": ["Smooth operation", "Heat-treated steel", "Reliable performance"],
    "link": "/products/lsfil23/cam-follower"
  },
  {
    "sku": "CAM-FOLLOWER-003",
    "name": "CAM FOLLOWER",
    "image": "/lsfi23/3.jpg",
    "description": "CAM FOLLOWER. Cat: F23 0700 04",
    "features": ["Precision fit", "Corrosion resistant", "Long lifespan"],
    "link": "/products/lsfil23/cam-follower-2"
  },
  {
    "sku": "GEAR-30-TEETH-004",
    "name": "GEAR 30 TEETH",
    "image": "/lsfi23/4.jpg",
    "description": "GEAR 30 TEETH. Cat: F23 1003 16",
    "features": ["Accurate tooth profile", "Durable polymer", "Smooth rotation"],
    "link": "/products/lsfil23/gear-30-teeth"
  },
  {
    "sku": "GEAR-62-TEETH-005",
    "name": "GEAR 62 TEETH",
    "image": "/lsfi23/5.jpg",
    "description": "GEAR 62 TEETH. Cat: F23 1003 18",
    "features": ["Precision molded", "High wear resistance", "Perfect alignment"],
    "link": "/products/lsfil23/gear-62-teeth"
  },
  {
    "sku": "FINGER-GUIDE-BASE-006",
    "name": "FINGER GUIDE BASE",
    "image": "/lsfi23/6.jpg",
    "description": "FINGER GUIDE BASE. Cat: F23 0803 13",
    "features": ["Strong grip", "Accurate guide support", "OEM quality"],
    "link": "/products/lsfil23/finger-guide-base"
  },
  {
    "sku": "SLEDGE-007",
    "name": "SLEDGE",
    "image": "/lsfi23/7.jpg",
    "description": "SLEDGE. Cat: F23 0700 02",
    "features": ["Heavy-duty design", "Durable metal construction", "Long-lasting"],
    "link": "/products/lsfil23/sledge"
  },
  {
    "sku": "CAM-008",
    "name": "CAM",
    "image": "/lsfi23/8.jpg",
    "description": "CAM. Cat: F23 0700 08",
    "features": ["Precision machined", "Smooth operation", "Wear resistant"],
    "link": "/products/lsfil23/cam"
  },
  {
    "sku": "FLAT-BELT-550X12-009",
    "name": "FLAT BELT (550 X 12)",
    "image": "/lsfi23/9.jpg",
    "description": "FLAT BELT (550 X 12). Cat: FIL 23 10005",
    "features": ["High tension strength", "Non-slip performance", "Long service life"],
    "link": "/products/lsfil23/flat-belt-550x12"
  },
  {
    "sku": "GUIDE-ROLLER-010",
    "name": "GUIDE ROLLER",
    "image": "/lsfi23/10.jpg",
    "description": "GUIDE ROLLER. Cat: F23 1301 11",
    "features": ["Precision roller surface", "Low friction", "High durability"],
    "link": "/products/lsfil23/guide-roller"
  },
    ],
  },
  lsh200: {
    title: "LSH-200",
    description: "Spare parts for LSH-200 looms.",
    products: [
      
  {
    sku: "LS-2060-5107",
    name: "Spring D 0.5",
    image: "/lsh200/1.jpg",
    description: "Durable spring designed for precision tension and long service life.",
    features: ["High elasticity", "Corrosion resistant", "Consistent performance"],
    link: "/products/lhs200/spring-d-0-5"
  },
  {
    sku: "LS-2060-5108",
    name: "Complete Guide Roller",
    image: "/lsh200/2.jpg",
    description: "Fully assembled guide roller for smooth belt and tape movement.",
    features: ["Balanced rotation", "Long-lasting", "Easy installation"],
    link: "/products/lhs200/complete-guide-roller"
  },
  {
    sku: "LS-2030-2111",
    name: "V Guide Roller",
    image: "/lsh200/3.jpg",
    description: "Multi-model compatible V-type guide roller ensuring stable guidance.",
    features: ["High wear resistance", "Precision fit", "Stable operation"],
    link: "/products/lhs200/v-guide-roller"
  },
  {
    sku: "LS-3140-3113",
    name: "Guide Roller",
    image: "/lsh200/4.jpg",
    description: "Quality guide roller supporting accurate movement and alignment.",
    features: ["Smooth rolling", "Durable structure", "Precision built"],
    link: "/products/lhs200/guide-roller"
  },
  {
    sku: "LS-2080-1127",
    name: "Cam Follower",
    image: "/lsh200/5.jpg",
    description: "Precision cam follower ensuring reliable cam-driven movement.",
    features: ["High load capacity", "Long life", "Smooth operation"],
    link: "/products/lhs200/cam-follower"
  },
  {
    sku: "LS-2080-1129",
    name: "Complete V Guide Roller",
    image: "/lsh200/6.jpg",
    description: "Assembled V guide roller providing enhanced stability and control.",
    features: ["Pre-assembled design", "Low maintenance", "High accuracy"],
    link: "/products/lhs200/complete-v-guide-roller"
  },
  {
    sku: "LS-160XL-12MM",
    name: "Timing Belt 160 XL (12 mm)",
    image: "/lsh200/7.jpg",
    description: "High-performance timing belt designed for accurate and quiet motion.",
    features: ["Precision molded teeth", "Durable rubber", "Long lifespan"],
    link: "/products/lhs200/timing-belt-160xl"
  },
  {
    sku: "LS-2080-1128",
    name: "Sledge",
    image: "/lsh200/8.jpg",
    description: "Robust sledge assembly providing accurate shuttle or component positioning.",
    features: ["Strong build", "Stable operation", "Long-lasting"],
    link: "/products/lhs200/sledge"
  },
  {
    sku: "LS-2041-7103",
    name: "Ceramic J Hook",
    image: "/lsh200/9.jpg",
    description: "Smooth ceramic J hook ideal for guiding and reducing thread friction.",
    features: ["Wear resistant", "Smooth finish", "High strength"],
    link: "/products/lhs200/ceramic-j-hook"
  },
  {
    sku: "LS-2080-1031",
    name: "Tape Guide with Ceramic",
    image: "/lsh200/10.jpg",
    description: "Ceramic tape guide ensuring precise, friction-free thread movement.",
    features: ["Heat resistant", "Smooth ceramic surface", "Reliable performance"],
    link: "/products/lhs200/tape-guide-with-ceramic"
  },
  {
    sku: "LS-2010-7101, LS-2010-4101",
    name: "Timing Belt 140 XL (12 mm)",
    image: "/lsh200/11.jpg",
    description: "140 XL timing belt for accurate synchronized motion and long use.",
    features: ["Flexible design", "Durable material", "Accurate pitch"],
    link: "/products/lhs200/timing-belt-140xl"
  },
  {
    sku: "F23-1301-10",
    name: "Spacer",
    image: "/lsh200/12.jpg",
    description: "Precision spacer ensuring perfect component distance and alignment.",
    features: ["Accurate dimension", "Corrosion resistant", "Strong build"],
    link: "/products/lhs200/spacer"
  },
  {
    sku: "F23-0401-06",
    name: "Spring for Spindle",
    image: "/lsh200/13.jpg",
    description: "Reliable spindle spring designed for controlled movement and flexibility.",
    features: ["High resilience", "Precision coiling", "Durable finish"],
    link: "/products/lhs200/spring-for-spindle"
  }
],  
  },
  leno4: {
    title: "Leno 4",
    description: "Essential spare parts for Leno 4 looms.",
    products:[
  {
    sku: "LENO4-0732-09",
    name: "Outer Comb",
    image: "/leno/1.jpg",
    description: "Precision-engineered outer comb for stable yarn alignment in leno weaving machines.",
    features: ["High strength steel", "Smooth edges", "Corrosion resistant finish"],
    link: "/products/leno/outer-comb"
  },
  {
    sku: "LENO4-0732-16",
    name: "Inner Comb",
    image: "/leno/2.jpg",
    description: "Durable inner comb ensuring uniform yarn separation and smooth weaving operation.",
    features: ["Accurate tooth spacing", "Long service life", "Easy installation"],
    link: "/products/leno/inner-comb"
  },
  {
    sku: "LENO4-0732-28",
    name: "Comb Holder",
    image: "/leno/3.jpg",
    description: "Robust comb holder for securing comb assemblies during leno weaving processes.",
    features: ["Precision machined", "Rigid support", "Corrosion resistant steel"],
    link: "/products/leno/comb-holder"
  },
  {
    sku: "LENO4-0732-15",
    name: "Thread Eye - 380R",
    image: "/leno/4.jpg",
    description: "High-quality thread eye rings designed for smooth yarn guidance in leno weaving.",
    features: ["Smooth inner finish", "Heat resistant", "Uniform dimension"],
    link: "/products/leno/thread-eye-380r"
  },
  {
    sku: "LENO4-0625-10B",
    name: "Sintered Bronze Bush",
    image: "/leno/5.jpg",
    description: "Self-lubricating sintered bronze bush for reduced friction and longer operational life.",
    features: ["Oil-impregnated", "Wear resistant", "Ideal for continuous motion parts"],
    link: "/products/leno/sintered-bronze-bush"
  },
  {
    sku: "LENO4-0732-30",
    name: "Leno Weaving Ring - Star and Without Star",
    image: "/leno/6.jpg",
    description: "Durable leno weaving rings available in both star and plain types for machine compatibility.",
    features: ["Balanced rotation", "Precision-machined teeth", "High durability under load"],
    link: "/products/leno/weaving-ring-star"
  }
]

  },
};

const ProductCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const data = category ? categoryData[category] : null;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-4">Category Not Found</h1>
            <p className="mb-6 text-neutral-600">The requested category does not exist or has been moved.</p>
            <Button asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/5 to-background">
      <Navbar />

      {/* Category Header */}
      <header className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{data.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{data.description}</p>
            <div className="flex gap-3">
              <Button asChild variant="secondary" className="rounded-full">
                <Link to="/contact">Request Quote</Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.products.map((product) => (
              <ProductCard
                key={product.sku}
                variant="list"
                title={product.name}
                image={product.image}
                description={product.description}
                link={product.link}
                cat={product.sku}
                cat2={product.cat2}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductCategory;
