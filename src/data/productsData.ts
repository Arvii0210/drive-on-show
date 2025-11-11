// 3-Level Product Hierarchy: Categories → Products → Spare Parts

export interface SparePart {
  id: string;
  partNo: string;
  name: string;
  image: string;
  description: string;
  availability: "In Stock" | "Made to Order" | "Limited Stock";
  category?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  sparePartsCount: number;
  spareParts: SparePart[];
}

export interface Category {
  id: string;
  name: string;
  logo?: string;
  image: string;
  description: string;
  productsCount: number;
  products: Product[];
}

export const categoriesData: Category[] = [
  {
    id: "starlinger",
    name: "Starlinger",
    image: "/taper/1.jpg",
    description: "High-performance Starlinger wear parts and accessories for tape lines and extrusion systems.",
    productsCount: 3,
    products: [
      {
        id: "cheese-winder",
        name: "Cheese Winder",
        image: "/taper/1.jpg",
        description: "Complete spare parts for Starlinger cheese winder systems.",
        sparePartsCount: 15,
        spareParts: [
          {
            id: "fil-200a",
            partNo: "FIL-200A",
            name: "Martor Blade No. 81",
            image: "/taper/1.jpg",
            description: "High-precision Martor industrial blade designed for smooth and accurate filament cutting.",
            availability: "In Stock",
            category: "F23 0700 03"
          },
          {
            id: "fil-200b",
            partNo: "FIL-200B",
            name: "Martor EBSCHARTER Blade",
            image: "/taper/2.jpg",
            description: "Premium-grade blade for precise and consistent tape line extrusion cutting applications.",
            availability: "In Stock",
            category: "F23 0700 04"
          },
          {
            id: "fil-201",
            partNo: "FIL-201",
            name: "Double Edge Razor Blade",
            image: "/taper/3.jpg",
            description: "Universal razor blade for smooth cutting of PP and HDPE tapes.",
            availability: "In Stock",
            category: "F23 1003 16"
          },
          {
            id: "fil-202",
            partNo: "FIL-202",
            name: "Single Edge Industrial Blade",
            image: "/taper/4.jpg",
            description: "Durable single-edge blade designed for trimming and finishing operations.",
            availability: "Made to Order",
            category: "F23 1003 18"
          },
          {
            id: "fil-203",
            partNo: "FIL-203",
            name: "Cutting Blade Insert",
            image: "/taper/5.jpg",
            description: "Insert blade compatible with tapeline extrusion systems for efficient material cutting.",
            availability: "In Stock",
            category: "F23 0803 13"
          },
          {
            id: "fil-204",
            partNo: "FIL-204",
            name: "Cutter Blade Holder",
            image: "/taper/6.jpg",
            description: "Precision holder for industrial cutting blades ensuring secure alignment.",
            availability: "In Stock",
            category: "F23 0700 02"
          },
          {
            id: "fil-205",
            partNo: "FIL-205",
            name: "Cutter Sleeve",
            image: "/taper/7.jpg",
            description: "Hardened cutter sleeve for guiding cutting shafts in extrusion lines.",
            availability: "Limited Stock",
            category: "F23 0700 08"
          },
          {
            id: "fil-206",
            partNo: "FIL-206",
            name: "Extruder Filter Mesh",
            image: "/taper/8.jpg",
            description: "Fine mesh filter for removing impurities from molten polymer during extrusion.",
            availability: "In Stock",
            category: "FIL 23 10005"
          },
          {
            id: "fil-207",
            partNo: "FIL-207",
            name: "Breaker Plate",
            image: "/taper/9.jpg",
            description: "Durable breaker plate providing even melt flow and supporting filter mesh.",
            availability: "In Stock",
            category: "F23 1301 11"
          },
          {
            id: "fil-208",
            partNo: "FIL-208",
            name: "Pressure Gauge Assembly",
            image: "/taper/10.jpg",
            description: "Digital pressure gauge assembly for monitoring extruder melt pressure accurately.",
            availability: "Made to Order",
            category: "GCL-TL-010"
          },
          {
            id: "fil-209",
            partNo: "FIL-209",
            name: "Extruder Conveyor Belt",
            image: "/taper/11.jpg",
            description: "Durable blue conveyor belt suitable for transporting filament and tapes.",
            availability: "In Stock",
            category: "GCL-TL-011"
          },
          {
            id: "fil-210",
            partNo: "FIL-210",
            name: "Knife Blade for Cutter Assembly",
            image: "/taper/12.jpg",
            description: "Replacement knife blade for tapeline cutter units ensuring clean cuts.",
            availability: "In Stock",
            category: "GCL-TL-012"
          },
          {
            id: "fil-211",
            partNo: "FIL-211",
            name: "Heat Seal Roll",
            image: "/taper/13.jpg",
            description: "High-temperature resistant roll for bag sealing operations.",
            availability: "Limited Stock",
            category: "GCL-TL-013"
          },
          {
            id: "fil-212",
            partNo: "FIL-212",
            name: "Tension Control Disc",
            image: "/taper/14.jpg",
            description: "Precision disc for maintaining consistent tape tension during winding.",
            availability: "In Stock",
            category: "GCL-TL-014"
          },
          {
            id: "fil-213",
            partNo: "FIL-213",
            name: "Winding Spindle",
            image: "/taper/15.jpg",
            description: "Heavy-duty spindle for cheese winding applications with balanced design.",
            availability: "In Stock",
            category: "GCL-TL-015"
          }
        ]
      },
      {
        id: "tape-line",
        name: "Tape Line",
        image: "/taper/6.jpg",
        description: "Spare parts and consumables for Starlinger tape extrusion lines.",
        sparePartsCount: 8,
        spareParts: [
          {
            id: "tl-100",
            partNo: "TL-100",
            name: "Extrusion Die Lips",
            image: "/taper/1.jpg",
            description: "Precision machined die lips for uniform tape width and thickness.",
            availability: "Made to Order",
            category: "TL-SERIES"
          },
          {
            id: "tl-101",
            partNo: "TL-101",
            name: "Quench Bath Roller",
            image: "/taper/2.jpg",
            description: "Stainless steel roller for cooling extruded tapes in quench bath.",
            availability: "In Stock",
            category: "TL-SERIES"
          },
          {
            id: "tl-102",
            partNo: "TL-102",
            name: "Stretching Roller Set",
            image: "/taper/3.jpg",
            description: "Complete roller set for longitudinal and transverse stretching.",
            availability: "In Stock",
            category: "TL-SERIES"
          },
          {
            id: "tl-103",
            partNo: "TL-103",
            name: "Annealing Oven Belt",
            image: "/taper/11.jpg",
            description: "Heat-resistant conveyor belt for annealing zone.",
            availability: "Limited Stock",
            category: "TL-SERIES"
          },
          {
            id: "tl-104",
            partNo: "TL-104",
            name: "Nip Roller Assembly",
            image: "/taper/4.jpg",
            description: "Rubber-coated nip roller for consistent tape feeding.",
            availability: "In Stock",
            category: "TL-SERIES"
          },
          {
            id: "tl-105",
            partNo: "TL-105",
            name: "Tape Guide Rail",
            image: "/taper/5.jpg",
            description: "Precision guide rail for accurate tape alignment during processing.",
            availability: "In Stock",
            category: "TL-SERIES"
          },
          {
            id: "tl-106",
            partNo: "TL-106",
            name: "Slitting Knife Set",
            image: "/taper/6.jpg",
            description: "Hardened steel slitting knives for clean tape edge cutting.",
            availability: "In Stock",
            category: "TL-SERIES"
          },
          {
            id: "tl-107",
            partNo: "TL-107",
            name: "Winder Clutch Assembly",
            image: "/taper/7.jpg",
            description: "Automatic clutch system for smooth tape winding operations.",
            availability: "Made to Order",
            category: "TL-SERIES"
          }
        ]
      },
      {
        id: "circular-loom",
        name: "Circular Loom Accessories",
        image: "/taper/12.jpg",
        description: "Essential accessories and wear parts for Starlinger circular looms.",
        sparePartsCount: 6,
        spareParts: [
          {
            id: "cl-50",
            partNo: "CL-50",
            name: "Shuttle Race Assembly",
            image: "/taper/8.jpg",
            description: "Complete shuttle race with precision bearings for smooth operation.",
            availability: "In Stock",
            category: "CL-SERIES"
          },
          {
            id: "cl-51",
            partNo: "CL-51",
            name: "Weft Feeler Sensor",
            image: "/taper/9.jpg",
            description: "Electronic weft detection sensor with adjustable sensitivity.",
            availability: "In Stock",
            category: "CL-SERIES"
          },
          {
            id: "cl-52",
            partNo: "CL-52",
            name: "Heald Frame Set",
            image: "/taper/10.jpg",
            description: "Lightweight aluminum heald frames for circular loom weaving.",
            availability: "Made to Order",
            category: "CL-SERIES"
          },
          {
            id: "cl-53",
            partNo: "CL-53",
            name: "Fabric Take-up Roller",
            image: "/taper/11.jpg",
            description: "Precision-balanced roller for uniform fabric winding.",
            availability: "In Stock",
            category: "CL-SERIES"
          },
          {
            id: "cl-54",
            partNo: "CL-54",
            name: "Tension Spring Kit",
            image: "/taper/12.jpg",
            description: "Assorted tension springs for yarn and weft control.",
            availability: "In Stock",
            category: "CL-SERIES"
          },
          {
            id: "cl-55",
            partNo: "CL-55",
            name: "Bobbin Holder Assembly",
            image: "/taper/13.jpg",
            description: "Durable bobbin holder with quick-release mechanism.",
            availability: "Limited Stock",
            category: "CL-SERIES"
          }
        ]
      }
    ]
  },
  {
    id: "lohia",
    name: "Lohia",
    image: "/lsi/cam.jpg",
    description: "Precision-engineered spare parts for Lohia circular looms ensuring optimal performance.",
    productsCount: 2,
    products: [
      {
        id: "lsl-6",
        name: "LSL-6 Series",
        image: "/lsi/cam.jpg",
        description: "Complete range of spare parts for LSL-6 circular loom models.",
        sparePartsCount: 20,
        spareParts: [
          {
            id: "lsl6-001",
            partNo: "WLSL6-0625-15",
            name: "JOCKEY LEVER-S",
            image: "/lsi/jockey s.jpeg",
            description: "High-precision jockey lever for shuttle control mechanism.",
            availability: "In Stock",
            category: "WLSL6 0625 15"
          },
          {
            id: "lsl6-002",
            partNo: "WLSL6-0614-16",
            name: "JOCKEY LEVER-62",
            image: "/lsi/jockey62.jpeg",
            description: "Durable jockey lever suitable for multiple LSL-6 variants.",
            availability: "In Stock",
            category: "WLSL6 0614 16"
          },
          {
            id: "lsl6-003",
            partNo: "WLSL6-0716-07",
            name: "UPPER HEDDLE BELT",
            image: "/lsi/upper belt.jpeg",
            description: "Premium quality upper heddle belt for smooth heddle operation.",
            availability: "In Stock",
            category: "WLSL6 0716 07"
          },
          {
            id: "lsl6-004",
            partNo: "19-0716W-6LSL",
            name: "LOWER HEDDLE BELT",
            image: "/lsi/lower belt.jpeg",
            description: "Reinforced lower heddle belt ensuring long service life.",
            availability: "In Stock",
            category: "19 0716W 6LSL"
          },
          {
            id: "lsl6-005",
            partNo: "WLSL6-9906-07",
            name: "SHUTTLE ROLLER-P",
            image: "/lsi/shuter roller.jpg",
            description: "Precision shuttle roller for consistent shuttle movement.",
            availability: "In Stock",
            category: "WLSL6 9906 07"
          },
          {
            id: "lsl6-006",
            partNo: "WLSL6-0614-06",
            name: "CAM ROLLER",
            image: "/lsi/cam.jpg",
            description: "Heat-treated cam roller for reliable cam mechanism operation.",
            availability: "In Stock",
            category: "WLSL6 0614 06"
          },
          {
            id: "lsl6-007",
            partNo: "WLSL6-9945-03",
            name: "CHONCHOID ROLLER-P",
            image: "/lsi/chon.jpeg",
            description: "Precision chonchoid roller for shuttle drive system.",
            availability: "In Stock",
            category: "WLSL6 9945 03"
          },
          {
            id: "lsl6-008",
            partNo: "WLSL6-9973-11",
            name: "STOPPER WHEEL-AP",
            image: "/lsi/stopper.jpeg",
            description: "Durable stopper wheel for shuttle positioning control.",
            availability: "In Stock",
            category: "WLSL6 9973 11"
          },
          {
            id: "lsl6-009",
            partNo: "WLSL6-9973-03",
            name: "CHONCHOID ROLLER-AP",
            image: "/lsi/chonAP.jpg",
            description: "Alternate profile chonchoid roller for specific loom configurations.",
            availability: "In Stock",
            category: "WLSL6 9973 03"
          },
          {
            id: "lsl6-010",
            partNo: "WLSL6-0904-16",
            name: "CHONCHOID ROLLER",
            image: "/lsi/chon2.jpg",
            description: "Standard chonchoid roller for shuttle drive mechanisms.",
            availability: "In Stock",
            category: "WLSL6 0904 16"
          },
          {
            id: "lsl6-011",
            partNo: "WLSL6-9956-11",
            name: "STOPPER ROLLER",
            image: "/lsi/stopper2.jpg",
            description: "Precision stopper roller for accurate shuttle stopping.",
            availability: "In Stock",
            category: "WLSL6 9956 11"
          },
          {
            id: "lsl6-012",
            partNo: "WLSL-9922-04",
            name: "SHUTTLE WHEEL",
            image: "/lsi/shutter1.jpg",
            description: "High-quality shuttle wheel for consistent shuttle guidance.",
            availability: "In Stock",
            category: "WLSL 9922 04"
          },
          {
            id: "lsl6-013",
            partNo: "WLSL6-0904-11",
            name: "STOPPER ROLLER",
            image: "/lsi/stopper3.jpg",
            description: "Reliable stopper roller for shuttle control system.",
            availability: "In Stock",
            category: "WLSL6 0904 11"
          },
          {
            id: "lsl6-014",
            partNo: "WLSL6-0809-01",
            name: "PUSHER ROLLER",
            image: "/lsi/push.jpg",
            description: "Durable pusher roller for shuttle propulsion mechanism.",
            availability: "In Stock",
            category: "WLSL6 0809 01"
          },
          {
            id: "lsl6-015",
            partNo: "WLSL6-0904-05",
            name: "SHUTTLE WHEEL",
            image: "/lsi/shutter2.jpg",
            description: "Precision shuttle wheel for smooth shuttle operation.",
            availability: "In Stock",
            category: "WLSL6 0904 05"
          },
          {
            id: "lsl6-016",
            partNo: "WLSL6-0904-16A",
            name: "CHONCHOID ROLLER",
            image: "/lsi/chon3.jpg",
            description: "High-precision chonchoid roller for shuttle drive systems.",
            availability: "In Stock",
            category: "WLSL6 0904 16"
          },
          {
            id: "lsl6-017",
            partNo: "WLSL6-0801-11",
            name: "BANDAGE",
            image: "/lsi/bandage.jpg",
            description: "Protective bandage for loom shaft assemblies.",
            availability: "In Stock",
            category: "WLSL6 0801 11"
          },
          {
            id: "lsl6-018",
            partNo: "WLSL6-9945-11",
            name: "STOPPER WHEEL-P",
            image: "/lsi/stopper4.jpg",
            description: "Precision stopper wheel for shuttle positioning.",
            availability: "In Stock",
            category: "WLSL6 9945 11"
          },
          {
            id: "lsl6-019",
            partNo: "WLSL6-9945-14",
            name: "SHUTTLE WHEEL-P",
            image: "/lsi/shutter3.jpg",
            description: "Heavy-duty shuttle wheel for demanding applications.",
            availability: "In Stock",
            category: "WLSL6 9945 14"
          },
          {
            id: "lsl6-020",
            partNo: "WLSL6-0621-06",
            name: "CAM ROLLER-S",
            image: "/lsi/cam1.jpg",
            description: "Specialized cam roller for specific loom configurations.",
            availability: "In Stock",
            category: "WLSL6 0621 06"
          }
        ]
      },
      {
        id: "lsl-4",
        name: "LSL-4 Series",
        image: "/leno/1.jpg",
        description: "Essential spare parts for LSL-4 circular loom models.",
        sparePartsCount: 6,
        spareParts: [
          {
            id: "lsl4-001",
            partNo: "LSL4-CAM-01",
            name: "Main Cam Assembly",
            image: "/leno/1.jpg",
            description: "Primary cam assembly for LSL-4 loom drive system.",
            availability: "In Stock",
            category: "LSL4-SERIES"
          },
          {
            id: "lsl4-002",
            partNo: "LSL4-BELT-01",
            name: "Drive Belt Set",
            image: "/leno/2.jpg",
            description: "Complete drive belt set for power transmission.",
            availability: "In Stock",
            category: "LSL4-SERIES"
          },
          {
            id: "lsl4-003",
            partNo: "LSL4-GUIDE-01",
            name: "Yarn Guide Assembly",
            image: "/leno/3.jpg",
            description: "Precision yarn guide for accurate yarn positioning.",
            availability: "Made to Order",
            category: "LSL4-SERIES"
          },
          {
            id: "lsl4-004",
            partNo: "LSL4-SPRING-01",
            name: "Tension Spring Kit",
            image: "/leno/4.jpg",
            description: "Assorted tension springs for yarn control.",
            availability: "In Stock",
            category: "LSL4-SERIES"
          },
          {
            id: "lsl4-005",
            partNo: "LSL4-ROLLER-01",
            name: "Feed Roller Set",
            image: "/leno/5.jpg",
            description: "Rubber-coated feed rollers for consistent yarn feeding.",
            availability: "In Stock",
            category: "LSL4-SERIES"
          },
          {
            id: "lsl4-006",
            partNo: "LSL4-SENSOR-01",
            name: "Yarn Break Sensor",
            image: "/leno/6.jpg",
            description: "Electronic sensor for yarn break detection.",
            availability: "Limited Stock",
            category: "LSL4-SERIES"
          }
        ]
      }
    ]
  },
  {
    id: "gcl",
    name: "GCL",
    image: "/gcl/gcl1.jpg",
    description: "Comprehensive accessories and spare parts for GCL circular looms.",
    productsCount: 2,
    products: [
      {
        id: "gcl-6s",
        name: "GCL-6S",
        image: "/gcl/gcl1.jpg",
        description: "Complete range of accessories for GCL-6S circular loom systems.",
        sparePartsCount: 12,
        spareParts: [
          {
            id: "gcl6s-001",
            partNo: "MA016",
            name: "Connecting Stud",
            image: "/gcl/gcl1.jpg",
            description: "Durable connecting stud for reliable loom assembly.",
            availability: "In Stock",
            category: "GCL-6S-MA016"
          },
          {
            id: "gcl6s-002",
            partNo: "SA001",
            name: "Shuttle Body",
            image: "/gcl/gcl2.jpg",
            description: "High-quality shuttle body designed for smooth shuttle motion.",
            availability: "In Stock",
            category: "GCL-6S-SA001"
          },
          {
            id: "gcl6s-003",
            partNo: "SA029",
            name: "Concord Wheel Rear",
            image: "/gcl/gcl3.jpg",
            description: "Rear concord wheel ensures proper loom movement alignment.",
            availability: "In Stock",
            category: "GCL-6S-SA029"
          },
          {
            id: "gcl6s-004",
            partNo: "SA036",
            name: "Concord Wheel Front",
            image: "/gcl/gcl4.jpg",
            description: "Front concord wheel for efficient loom shuttle drive.",
            availability: "In Stock",
            category: "GCL-6S-SA036"
          },
          {
            id: "gcl6s-005",
            partNo: "MA011",
            name: "Cam Follower",
            image: "/gcl/gcl5.jpg",
            description: "Precision cam follower for synchronized loom mechanisms.",
            availability: "In Stock",
            category: "GCL-6S-MA011"
          },
          {
            id: "gcl6s-006",
            partNo: "SA026",
            name: "Shuttle Wheel",
            image: "/gcl/gcl6.jpg",
            description: "Reliable shuttle wheel for smooth and stable shuttle movement.",
            availability: "In Stock",
            category: "GCL-6S-SA026"
          },
          {
            id: "gcl6s-007",
            partNo: "SA020",
            name: "Shuttle Roller Wheel",
            image: "/gcl/gcl7.jpg",
            description: "Quality roller wheel for shuttle movement and alignment.",
            availability: "In Stock",
            category: "GCL-6S-SA020"
          },
          {
            id: "gcl6s-008",
            partNo: "UA025",
            name: "Pusher Wheel",
            image: "/gcl/gcl8.jpg",
            description: "Strong pusher wheel supporting uniform shuttle motion.",
            availability: "In Stock",
            category: "GCL-6S-UA025"
          },
          {
            id: "gcl6s-009",
            partNo: "MA009",
            name: "Crank Arm",
            image: "/gcl/gcl9.jpg",
            description: "Robust crank arm for loom motion conversion mechanisms.",
            availability: "In Stock",
            category: "GCL-6S-MA009"
          },
          {
            id: "gcl6s-010",
            partNo: "MA015",
            name: "Sintered Bush (Crank Arm)",
            image: "/gcl/gcl10.jpg",
            description: "Self-lubricating sintered bush used in crank arm assemblies.",
            availability: "In Stock",
            category: "GCL-6S-MA015"
          },
          {
            id: "gcl6s-011",
            partNo: "MA999",
            name: "Shuttle Mount Assembly",
            image: "/gcl/gcl11.jpg",
            description: "Complete shuttle mounting setup ensuring smooth operation.",
            availability: "Made to Order",
            category: "GCL-6S-MA999"
          },
          {
            id: "gcl6s-012",
            partNo: "MA998",
            name: "Connecting Rod Set",
            image: "/gcl/gcl12.jpg",
            description: "Precision connecting rods for synchronized shuttle motion.",
            availability: "In Stock",
            category: "GCL-6S-MA998"
          }
        ]
      },
      {
        id: "gcl-6",
        name: "GCL-6",
        image: "/gcl/gcl5.jpg",
        description: "Standard spare parts for GCL-6 circular loom models.",
        sparePartsCount: 5,
        spareParts: [
          {
            id: "gcl6-001",
            partNo: "GCL6-SHUTTLE-01",
            name: "Shuttle Assembly",
            image: "/gcl/gcl2.jpg",
            description: "Complete shuttle assembly for GCL-6 looms.",
            availability: "In Stock",
            category: "GCL-6-SERIES"
          },
          {
            id: "gcl6-002",
            partNo: "GCL6-HEALD-01",
            name: "Heald Belt Set",
            image: "/gcl/gcl3.jpg",
            description: "Durable heald belt set for heddle operation.",
            availability: "In Stock",
            category: "GCL-6-SERIES"
          },
          {
            id: "gcl6-003",
            partNo: "GCL6-WHEEL-01",
            name: "Drive Wheel Assembly",
            image: "/gcl/gcl4.jpg",
            description: "Main drive wheel assembly for loom operation.",
            availability: "Made to Order",
            category: "GCL-6-SERIES"
          },
          {
            id: "gcl6-004",
            partNo: "GCL6-CAM-01",
            name: "Cam Set",
            image: "/gcl/gcl5.jpg",
            description: "Precision machined cam set for loom timing.",
            availability: "In Stock",
            category: "GCL-6-SERIES"
          },
          {
            id: "gcl6-005",
            partNo: "GCL6-ROLLER-01",
            name: "Guide Roller Kit",
            image: "/gcl/gcl6.jpg",
            description: "Complete guide roller kit for yarn guidance.",
            availability: "In Stock",
            category: "GCL-6-SERIES"
          }
        ]
      }
    ]
  },
  {
    id: "lsfil23",
    name: "LS-FIL-23",
    image: "/lsfi23/1.jpg",
    description: "High-performance spare parts for LS-FIL-23 filament winding systems.",
    productsCount: 1,
    products: [
      {
        id: "fil23-main",
        name: "FIL-23 Main Components",
        image: "/lsfi23/1.jpg",
        description: "Essential components and wear parts for LS-FIL-23 systems.",
        sparePartsCount: 10,
        spareParts: [
          {
            id: "fil23-001",
            partNo: "F23-0700-03",
            name: "COMPLETE GUIDE ROLLER",
            image: "/lsfi23/1.jpg",
            description: "High-precision complete guide roller assembly.",
            availability: "In Stock",
            category: "F23 0700 03"
          },
          {
            id: "fil23-002",
            partNo: "F23-0700-03A",
            name: "CAM FOLLOWER",
            image: "/lsfi23/2.jpg",
            description: "Smooth operation cam follower with heat-treated steel.",
            availability: "In Stock",
            category: "F23 0700 03"
          },
          {
            id: "fil23-003",
            partNo: "F23-0700-04",
            name: "CAM FOLLOWER",
            image: "/lsfi23/3.jpg",
            description: "Precision fit cam follower with corrosion resistance.",
            availability: "In Stock",
            category: "F23 0700 04"
          },
          {
            id: "fil23-004",
            partNo: "F23-1003-16",
            name: "GEAR 30 TEETH",
            image: "/lsfi23/4.jpg",
            description: "Accurate tooth profile gear with durable polymer construction.",
            availability: "In Stock",
            category: "F23 1003 16"
          },
          {
            id: "fil23-005",
            partNo: "F23-1003-18",
            name: "GEAR 62 TEETH",
            image: "/lsfi23/5.jpg",
            description: "Precision molded gear with high wear resistance.",
            availability: "In Stock",
            category: "F23 1003 18"
          },
          {
            id: "fil23-006",
            partNo: "F23-0803-13",
            name: "FINGER GUIDE BASE",
            image: "/lsfi23/6.jpg",
            description: "Strong grip finger guide base with accurate support.",
            availability: "In Stock",
            category: "F23 0803 13"
          },
          {
            id: "fil23-007",
            partNo: "F23-0700-02",
            name: "SLEDGE",
            image: "/lsfi23/7.jpg",
            description: "Heavy-duty sledge with durable metal construction.",
            availability: "In Stock",
            category: "F23 0700 02"
          },
          {
            id: "fil23-008",
            partNo: "F23-0700-08",
            name: "CAM",
            image: "/lsfi23/8.jpg",
            description: "Precision machined cam with smooth operation.",
            availability: "In Stock",
            category: "F23 0700 08"
          },
          {
            id: "fil23-009",
            partNo: "FIL23-10005",
            name: "FLAT BELT (550 X 12)",
            image: "/lsfi23/9.jpg",
            description: "High tension strength flat belt with non-slip performance.",
            availability: "In Stock",
            category: "FIL 23 10005"
          },
          {
            id: "fil23-010",
            partNo: "F23-1301-11",
            name: "GUIDE ROLLER",
            image: "/lsfi23/10.jpg",
            description: "Precision roller surface guide with low friction.",
            availability: "In Stock",
            category: "F23 1301 11"
          }
        ]
      }
    ]
  },
  {
    id: "lsh200",
    name: "LSH-200",
    image: "/lsh200/1.jpg",
    description: "Reliable spare parts for LSH-200 heating and processing systems.",
    productsCount: 1,
    products: [
      {
        id: "lsh200-main",
        name: "LSH-200 Components",
        image: "/lsh200/1.jpg",
        description: "Complete range of components for LSH-200 systems.",
        sparePartsCount: 13,
        spareParts: [
          {
            id: "lsh200-001",
            partNo: "LS-2060-5107",
            name: "Spring D 0.5",
            image: "/lsh200/1.jpg",
            description: "Durable spring designed for precision tension and long service life.",
            availability: "In Stock",
            category: "LS-2060-5107"
          },
          {
            id: "lsh200-002",
            partNo: "LS-2060-5108",
            name: "Complete Guide Roller",
            image: "/lsh200/2.jpg",
            description: "Fully assembled guide roller for smooth belt and tape movement.",
            availability: "In Stock",
            category: "LS-2060-5108"
          },
          {
            id: "lsh200-003",
            partNo: "LS-2060-5109",
            name: "Tension Roller Assembly",
            image: "/lsh200/3.jpg",
            description: "Precision tension roller for consistent material handling.",
            availability: "In Stock",
            category: "LS-2060-5109"
          },
          {
            id: "lsh200-004",
            partNo: "LS-2060-5110",
            name: "Drive Belt 200mm",
            image: "/lsh200/4.jpg",
            description: "Heavy-duty drive belt for power transmission systems.",
            availability: "In Stock",
            category: "LS-2060-5110"
          },
          {
            id: "lsh200-005",
            partNo: "LS-2060-5111",
            name: "Heating Element 2kW",
            image: "/lsh200/5.jpg",
            description: "High-efficiency heating element for processing applications.",
            availability: "Made to Order",
            category: "LS-2060-5111"
          },
          {
            id: "lsh200-006",
            partNo: "LS-2060-5112",
            name: "Temperature Sensor PT100",
            image: "/lsh200/6.jpg",
            description: "Precision temperature sensor for accurate heat control.",
            availability: "In Stock",
            category: "LS-2060-5112"
          },
          {
            id: "lsh200-007",
            partNo: "LS-2060-5113",
            name: "Control Panel Display",
            image: "/lsh200/7.jpg",
            description: "Digital display panel for system monitoring and control.",
            availability: "In Stock",
            category: "LS-2060-5113"
          },
          {
            id: "lsh200-008",
            partNo: "LS-2060-5114",
            name: "Pneumatic Cylinder 50mm",
            image: "/lsh200/8.jpg",
            description: "Double-acting pneumatic cylinder for automated operations.",
            availability: "In Stock",
            category: "LS-2060-5114"
          },
          {
            id: "lsh200-009",
            partNo: "LS-2060-5115",
            name: "Proximity Switch M18",
            image: "/lsh200/9.jpg",
            description: "Inductive proximity sensor for position detection.",
            availability: "In Stock",
            category: "LS-2060-5115"
          },
          {
            id: "lsh200-010",
            partNo: "LS-2060-5116",
            name: "Solenoid Valve 24VDC",
            image: "/lsh200/10.jpg",
            description: "Electric solenoid valve for pneumatic control systems.",
            availability: "In Stock",
            category: "LS-2060-5116"
          },
          {
            id: "lsh200-011",
            partNo: "LS-2060-5117",
            name: "Pressure Regulator",
            image: "/lsh200/11.jpg",
            description: "Precision air pressure regulator with gauge.",
            availability: "In Stock",
            category: "LS-2060-5117"
          },
          {
            id: "lsh200-012",
            partNo: "LS-2060-5118",
            name: "Filter Regulator Unit",
            image: "/lsh200/12.jpg",
            description: "Combined air filter and regulator assembly.",
            availability: "Limited Stock",
            category: "LS-2060-5118"
          },
          {
            id: "lsh200-013",
            partNo: "LS-2060-5119",
            name: "Quick Connect Coupling",
            image: "/lsh200/13.jpg",
            description: "Push-to-connect pneumatic coupling for easy installation.",
            availability: "In Stock",
            category: "LS-2060-5119"
          }
        ]
      }
    ]
  },
  {
    id: "leno4",
    name: "Leno-4",
    image: "/leno/1.jpg",
    description: "Reliable spare parts for Leno-4 loom systems ensuring smooth operation.",
    productsCount: 1,
    products: [
      {
        id: "leno4-main",
        name: "Leno-4 Main Parts",
        image: "/leno/1.jpg",
        description: "Essential spare parts for Leno-4 loom maintenance.",
        sparePartsCount: 6,
        spareParts: [
          {
            id: "leno4-001",
            partNo: "LENO4-CAM-01",
            name: "Leno Cam Assembly",
            image: "/leno/1.jpg",
            description: "Precision leno cam for leno weaving mechanism.",
            availability: "In Stock",
            category: "LENO4-SERIES"
          },
          {
            id: "leno4-002",
            partNo: "LENO4-HEALD-01",
            name: "Leno Heald Frame",
            image: "/leno/2.jpg",
            description: "Specialized heald frame for leno fabric production.",
            availability: "In Stock",
            category: "LENO4-SERIES"
          },
          {
            id: "leno4-003",
            partNo: "LENO4-GUIDE-01",
            name: "Doup Guide Set",
            image: "/leno/3.jpg",
            description: "Complete doup guide set for leno weaving.",
            availability: "Made to Order",
            category: "LENO4-SERIES"
          },
          {
            id: "leno4-004",
            partNo: "LENO4-REED-01",
            name: "Leno Reed",
            image: "/leno/4.jpg",
            description: "Precision leno reed for accurate yarn spacing.",
            availability: "In Stock",
            category: "LENO4-SERIES"
          },
          {
            id: "leno4-005",
            partNo: "LENO4-SPRING-01",
            name: "Tension Spring Kit",
            image: "/leno/5.jpg",
            description: "Specialized tension springs for leno mechanism.",
            availability: "In Stock",
            category: "LENO4-SERIES"
          },
          {
            id: "leno4-006",
            partNo: "LENO4-ROLLER-01",
            name: "Warp Beam Roller",
            image: "/leno/6.jpg",
            description: "Heavy-duty warp beam roller for leno looms.",
            availability: "In Stock",
            category: "LENO4-SERIES"
          }
        ]
      }
    ]
  }
];

// Helper functions
export const getCategoryById = (categoryId: string): Category | undefined => {
  return categoriesData.find(cat => cat.id === categoryId);
};

export const getProductById = (categoryId: string, productId: string): Product | undefined => {
  const category = getCategoryById(categoryId);
  return category?.products.find(prod => prod.id === productId);
};

export const getSparePartById = (categoryId: string, productId: string, sparePartId: string): SparePart | undefined => {
  const product = getProductById(categoryId, productId);
  return product?.spareParts.find(part => part.id === sparePartId);
};
