// Mock data for the Abstract Management System

export type UserRole = "admin" | "author" | "reviewer";

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "revision_required"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface SubmissionVersion {
  version: number;
  versionNumber: number;
  date: string;
  createdAt: string;
  editedBy: string;
  changeSummary: string;
  snapshot?: {
    title?: string;
    category?: string;
    keywords?: string[];
    content?: Record<string, string>;
    coAuthors?: Array<{ name: string; email?: string; institution?: string }>;
    files?: Array<{ name: string; is_latest?: boolean }>;
  };
}

export interface Submission {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  finalCategory?: string;
  author: string;
  authorEmail: string;
  institution: string;
  department: string;
  keywords: string[];
  submissionDate: string;
  status: SubmissionStatus;
  averageScore: number | null;
  assignedReviewers: string[];
  conference?: string;
  fileUrl?: string;
  fileName?: string;
  content: {
    introduction: string;
    aim: string;
    methods: string;
    results: string;
    conclusion: string;
  };
  coAuthors: { name: string; email: string; institution: string }[];
  currentVersion?: number;
  lastEditedDate?: string;
  versionHistory?: SubmissionVersion[];
}

export interface Reviewer {
  id: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  assignedReviews: number;
  completedReviews: number;
  status: "active" | "inactive";
}

export interface ReviewScores {
  originality: number;
  methodology: number;
  relevance: number;
  clarity: number;
  significance: number;
  presentation: number;
  technical_quality: number;
}

export const REVIEW_CRITERIA: {
  key: keyof ReviewScores;
  label: string;
  desc: string;
}[] = [
  {
    key: "originality",
    label: "Originality",
    desc: "Novelty and innovation of the research",
  },
  {
    key: "methodology",
    label: "Methodology",
    desc: "Soundness of research methods and design",
  },
  {
    key: "relevance",
    label: "Relevance",
    desc: "Significance and impact to the field",
  },
  {
    key: "clarity",
    label: "Clarity",
    desc: "Quality of writing and presentation",
  },
  {
    key: "significance",
    label: "Significance",
    desc: "Importance and contribution of findings",
  },
  {
    key: "presentation",
    label: "Presentation",
    desc: "Structure, figures, and overall layout",
  },
  {
    key: "technical_quality",
    label: "Technical Quality",
    desc: "Correctness and rigor of technical work",
  },
];

export const NUM_CRITERIA = REVIEW_CRITERIA.length; // 7

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewerName: string;
  scores: ReviewScores;
  totalScore: number;
  recommendation: "accept" | "reject" | "revision_required";
  comments: string;
  status: "pending" | "completed" | "not_reviewed";
  assignedDate: string;
  completedDate: string | null;
}

/** Calculate total score for a single review */
export function calcReviewTotal(scores: ReviewScores): number {
  return Object.values(scores).reduce((a, b) => a + b, 0);
}

/** Calculate average per criteria for a single review */
export function calcReviewAvg(scores: ReviewScores): number {
  const total = calcReviewTotal(scores);
  return +(total / NUM_CRITERIA).toFixed(2);
}

/** Calculate the submission average across multiple completed reviews */
export function calcSubmissionAverage(reviews: Review[]): number | null {
  const completed = reviews.filter((r) => r.status === "completed");
  if (completed.length === 0) return null;
  const avgOfAvgs =
    completed.reduce((sum, r) => sum + calcReviewAvg(r.scores), 0) /
    completed.length;
  return +avgOfAvgs.toFixed(2);
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  date: string;
  read: boolean;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Artificial Intelligence",
    subcategories: [
      "Neural Networks",
      "Natural Language Processing",
      "Computer Vision",
    ],
  },
  {
    id: "cat-2",
    name: "Machine Learning",
    subcategories: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
    ],
  },
  {
    id: "cat-3",
    name: "Data Science",
    subcategories: ["Big Data", "Data Visualization", "Statistical Analysis"],
  },
  {
    id: "cat-4",
    name: "Cybersecurity",
    subcategories: ["Network Security", "Cryptography", "Ethical Hacking"],
  },
  {
    id: "cat-5",
    name: "Cloud Computing",
    subcategories: ["AWS", "Azure", "Google Cloud"],
  },
  {
    id: "cat-6",
    name: "IoT",
    subcategories: ["Smart Home", "Industrial IoT", "Sensors"],
  },
  {
    id: "cat-7",
    name: "Blockchain",
    subcategories: ["Smart Contracts", "DeFi", "NFTs"],
  },
  {
    id: "cat-8",
    name: "Bioinformatics",
    subcategories: ["Genomics", "Proteomics", "Systems Biology"],
  },
  {
    id: "cat-9",
    name: "Renewable Energy",
    subcategories: ["Solar", "Wind", "Hydro"],
  },
  {
    id: "cat-10",
    name: "Quantum Computing",
    subcategories: ["Quantum Algorithms", "Hardware", "Error Correction"],
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: "ABS-2024-001",
    title: "Deep Learning Approaches for Medical Image Segmentation",
    category: "Artificial Intelligence",
    author: "Dr. Sarah Chen",
    authorEmail: "sarah.chen@university.edu",
    institution: "MIT",
    department: "Computer Science",
    keywords: ["deep learning", "medical imaging", "segmentation"],
    submissionDate: "2024-01-15",
    status: "accepted",
    averageScore: 8.5,
    assignedReviewers: ["Dr. James Wilson", "Dr. Maria Garcia"],
    conference: "ICAI 2024",
    content: {
      introduction:
        "Medical image segmentation plays a crucial role in clinical diagnosis and treatment planning. Recent advances in deep learning have shown promising results in automating this process.",
      aim: "To develop and evaluate a novel deep learning architecture for accurate multi-organ segmentation in CT scans.",
      methods:
        "We propose a modified U-Net architecture with attention mechanisms and evaluate it on a dataset of 5,000 annotated CT scans from three medical centers.",
      results:
        "Our model achieved a mean Dice coefficient of 0.92 across 13 organ classes, outperforming existing state-of-the-art methods by 3.5%.",
      conclusion:
        "The proposed architecture demonstrates superior segmentation accuracy and generalizability, suggesting potential for clinical deployment.",
    },
    coAuthors: [
      {
        name: "Dr. Michael Brown",
        email: "mbrown@university.edu",
        institution: "MIT",
      },
      {
        name: "Prof. Lisa Wang",
        email: "lwang@stanford.edu",
        institution: "Stanford University",
      },
    ],
  },
  {
    id: "ABS-2024-002",
    title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
    category: "Machine Learning",
    author: "Prof. Ahmed Hassan",
    authorEmail: "ahmed.hassan@oxford.ac.uk",
    institution: "Oxford University",
    department: "Data Science",
    keywords: ["federated learning", "privacy", "healthcare"],
    submissionDate: "2024-01-18",
    status: "under_review",
    averageScore: null,
    assignedReviewers: ["Dr. Emily Park"],
    conference: "ICAI 2024",
    content: {
      introduction:
        "Healthcare data is inherently sensitive, making centralized machine learning approaches problematic from a privacy perspective.",
      aim: "To propose a federated learning framework that enables collaborative model training across hospitals without sharing patient data.",
      methods:
        "We implemented a differential privacy-enhanced federated averaging algorithm and tested it across 8 simulated hospital networks.",
      results:
        "Our framework achieves 95% of centralized model performance while maintaining ε-differential privacy guarantees.",
      conclusion:
        "Federated learning with differential privacy is a viable approach for privacy-preserving healthcare analytics.",
    },
    coAuthors: [
      {
        name: "Dr. Fatima Al-Rashid",
        email: "fatima@oxford.ac.uk",
        institution: "Oxford University",
      },
    ],
  },
  {
    id: "ABS-2024-003",
    title: "Quantum Error Correction Using Surface Codes",
    category: "Quantum Computing",
    author: "Dr. Kenji Tanaka",
    authorEmail: "ktanaka@tokyo-u.ac.jp",
    institution: "University of Tokyo",
    department: "Physics",
    keywords: ["quantum computing", "error correction", "surface codes"],
    submissionDate: "2024-01-20",
    status: "submitted",
    averageScore: null,
    assignedReviewers: [],
    conference: "DSS 2024",
    content: {
      introduction:
        "Quantum error correction is essential for building fault-tolerant quantum computers capable of solving practical problems.",
      aim: "To develop an improved surface code decoder with reduced computational overhead.",
      methods:
        "We designed a neural network-based decoder trained on synthetic error data and evaluated it on a 17-qubit surface code.",
      results:
        "The decoder achieves a logical error rate of 10⁻⁶ per round with 40% less computational overhead than minimum-weight perfect matching.",
      conclusion:
        "Neural network decoders offer a practical path to real-time quantum error correction.",
    },
    coAuthors: [],
  },
  {
    id: "ABS-2024-004",
    title: "Blockchain-Based Supply Chain Transparency Framework",
    category: "Blockchain",
    author: "Maria Rodriguez",
    authorEmail: "mrodriguez@eth.ch",
    institution: "ETH Zurich",
    department: "Information Systems",
    keywords: ["blockchain", "supply chain", "transparency"],
    submissionDate: "2024-01-22",
    status: "revision_required",
    averageScore: 6.2,
    assignedReviewers: ["Dr. James Wilson"],
    conference: "ICAI 2024",
    content: {
      introduction:
        "Supply chain transparency is increasingly important for sustainability and regulatory compliance.",
      aim: "To design a blockchain-based framework that ensures end-to-end transparency in global supply chains.",
      methods:
        "We developed a permissioned blockchain solution using Hyperledger Fabric and tested it with three multinational companies.",
      results:
        "The framework reduced audit time by 60% and improved traceability accuracy to 99.8%.",
      conclusion:
        "Blockchain technology can significantly enhance supply chain transparency when properly implemented.",
    },
    coAuthors: [
      {
        name: "Hans Mueller",
        email: "hmueller@eth.ch",
        institution: "ETH Zurich",
      },
    ],
  },
  {
    id: "ABS-2024-005",
    title: "IoT-Enabled Smart Agriculture Monitoring System",
    category: "IoT",
    author: "Dr. Priya Sharma",
    authorEmail: "psharma@iit.in",
    institution: "IIT Delhi",
    department: "Electronics",
    keywords: ["IoT", "smart agriculture", "monitoring"],
    submissionDate: "2024-01-25",
    status: "rejected",
    averageScore: 4.8,
    assignedReviewers: ["Dr. Emily Park", "Dr. Maria Garcia"],
    conference: "ICAI 2024",
    content: {
      introduction:
        "Agriculture accounts for 70% of global water usage, necessitating smart monitoring solutions.",
      aim: "To develop an IoT-based system for real-time monitoring of soil moisture, temperature, and crop health.",
      methods:
        "We deployed a network of 200 sensor nodes across 50 hectares and developed a cloud-based analytics dashboard.",
      results:
        "The system reduced water consumption by 30% and improved crop yield prediction accuracy by 25%.",
      conclusion:
        "IoT-enabled monitoring can significantly improve agricultural efficiency and sustainability.",
    },
    coAuthors: [],
  },
  {
    id: "ABS-2024-006",
    title: "Adversarial Robustness in Natural Language Processing",
    category: "Artificial Intelligence",
    author: "Dr. Alex Kim",
    authorEmail: "akim@stanford.edu",
    institution: "Stanford University",
    department: "Computer Science",
    keywords: ["NLP", "adversarial", "robustness"],
    submissionDate: "2024-02-01",
    status: "draft",
    averageScore: null,
    assignedReviewers: [],
    conference: "DSS 2024",
    content: {
      introduction:
        "NLP models are vulnerable to adversarial attacks that can drastically alter model predictions.",
      aim: "To propose a training methodology that improves adversarial robustness without sacrificing accuracy.",
      methods:
        "We combine adversarial training with contrastive learning on BERT-based models across 5 NLP benchmarks.",
      results:
        "Our approach improves adversarial robustness by 45% while maintaining 98% of clean accuracy.",
      conclusion:
        "Combining adversarial and contrastive training is effective for building robust NLP systems.",
    },
    coAuthors: [
      {
        name: "Dr. Wei Zhang",
        email: "wzhang@stanford.edu",
        institution: "Stanford University",
      },
    ],
  },
  {
    id: "ABS-2024-007",
    title: "Cloud-Native Microservices Architecture for E-Government",
    category: "Cloud Computing",
    author: "Prof. John Smith",
    authorEmail: "jsmith@cambridge.ac.uk",
    institution: "University of Cambridge",
    department: "Engineering",
    keywords: ["cloud computing", "microservices", "e-government"],
    submissionDate: "2024-02-05",
    status: "under_review",
    averageScore: null,
    assignedReviewers: ["Dr. James Wilson"],
    conference: "ICAI 2024",
    content: {
      introduction:
        "E-government systems require scalable, reliable, and maintainable architectures.",
      aim: "To design a cloud-native microservices architecture tailored for e-government service delivery.",
      methods:
        "We implemented a reference architecture using Kubernetes and service mesh, deploying 15 microservices.",
      results:
        "The architecture achieved 99.99% uptime and reduced deployment time from weeks to hours.",
      conclusion:
        "Cloud-native architectures are well-suited for modernizing government digital services.",
    },
    coAuthors: [],
  },
  {
    id: "ABS-2024-008",
    title: "Explainable AI for Credit Risk Assessment",
    category: "Data Science",
    author: "Dr. Nina Petrova",
    authorEmail: "npetrova@tu-berlin.de",
    institution: "TU Berlin",
    department: "Finance & Technology",
    keywords: ["explainable AI", "credit risk", "finance"],
    submissionDate: "2024-02-08",
    status: "accepted",
    averageScore: 9.1,
    assignedReviewers: ["Dr. Emily Park", "Dr. Maria Garcia"],
    conference: "DSS 2024",
    content: {
      introduction:
        "Credit risk models must be both accurate and interpretable to meet regulatory requirements.",
      aim: "To develop an explainable AI framework for credit risk assessment that satisfies regulatory standards.",
      methods:
        "We combined gradient boosting with SHAP explanations and validated against Basel III requirements.",
      results:
        "Our model matches black-box accuracy (AUC 0.94) while providing regulatory-compliant explanations.",
      conclusion:
        "Explainable AI can bridge the gap between model performance and regulatory compliance in finance.",
    },
    coAuthors: [
      {
        name: "Dr. Thomas Wagner",
        email: "twagner@tu-berlin.de",
        institution: "TU Berlin",
      },
    ],
  },
];

export const mockReviewers: Reviewer[] = [
  {
    id: "REV-001",
    name: "Dr. James Wilson",
    email: "jwilson@harvard.edu",
    institution: "Harvard University",
    department: "Computer Science",
    assignedReviews: 5,
    completedReviews: 3,
    status: "active",
  },
  {
    id: "REV-002",
    name: "Dr. Emily Park",
    email: "epark@caltech.edu",
    institution: "Caltech",
    department: "Data Science",
    assignedReviews: 4,
    completedReviews: 2,
    status: "active",
  },
  {
    id: "REV-003",
    name: "Dr. Maria Garcia",
    email: "mgarcia@mit.edu",
    institution: "MIT",
    department: "AI Research",
    assignedReviews: 3,
    completedReviews: 3,
    status: "active",
  },
  {
    id: "REV-004",
    name: "Prof. David Lee",
    email: "dlee@berkeley.edu",
    institution: "UC Berkeley",
    department: "Electrical Engineering",
    assignedReviews: 2,
    completedReviews: 0,
    status: "active",
  },
  {
    id: "REV-005",
    name: "Dr. Anna Kowalski",
    email: "akowalski@eth.ch",
    institution: "ETH Zurich",
    department: "Information Security",
    assignedReviews: 0,
    completedReviews: 0,
    status: "inactive",
  },
];

const zeroScores: ReviewScores = {
  originality: 0,
  methodology: 0,
  relevance: 0,
  clarity: 0,
  significance: 0,
  presentation: 0,
  technical_quality: 0,
};

export const mockReviews: Review[] = [
  {
    id: "RVW-001",
    submissionId: "ABS-2024-001",
    reviewerId: "REV-001",
    reviewerName: "Dr. James Wilson",
    scores: {
      originality: 9,
      methodology: 8,
      relevance: 9,
      clarity: 8,
      significance: 8,
      presentation: 7,
      technical_quality: 9,
    },
    totalScore: 58,
    recommendation: "accept",
    comments: "Excellent work with strong methodology and significant results.",
    status: "completed",
    assignedDate: "2024-01-20",
    completedDate: "2024-02-01",
  },
  {
    id: "RVW-002",
    submissionId: "ABS-2024-001",
    reviewerId: "REV-003",
    reviewerName: "Dr. Maria Garcia",
    scores: {
      originality: 8,
      methodology: 9,
      relevance: 8,
      clarity: 9,
      significance: 9,
      presentation: 8,
      technical_quality: 8,
    },
    totalScore: 59,
    recommendation: "accept",
    comments: "Well-written paper with innovative approach.",
    status: "completed",
    assignedDate: "2024-01-20",
    completedDate: "2024-01-30",
  },
  {
    id: "RVW-003",
    submissionId: "ABS-2024-002",
    reviewerId: "REV-002",
    reviewerName: "Dr. Emily Park",
    scores: { ...zeroScores },
    totalScore: 0,
    recommendation: "accept",
    comments: "",
    status: "pending",
    assignedDate: "2024-01-25",
    completedDate: null,
  },
  {
    id: "RVW-004",
    submissionId: "ABS-2024-004",
    reviewerId: "REV-001",
    reviewerName: "Dr. James Wilson",
    scores: {
      originality: 6,
      methodology: 5,
      relevance: 7,
      clarity: 7,
      significance: 6,
      presentation: 5,
      technical_quality: 6,
    },
    totalScore: 42,
    recommendation: "revision_required",
    comments: "The methodology needs strengthening.",
    status: "completed",
    assignedDate: "2024-01-28",
    completedDate: "2024-02-05",
  },
  {
    id: "RVW-005",
    submissionId: "ABS-2024-005",
    reviewerId: "REV-002",
    reviewerName: "Dr. Emily Park",
    scores: {
      originality: 4,
      methodology: 5,
      relevance: 5,
      clarity: 5,
      significance: 4,
      presentation: 5,
      technical_quality: 4,
    },
    totalScore: 32,
    recommendation: "reject",
    comments: "The contribution is incremental.",
    status: "completed",
    assignedDate: "2024-01-30",
    completedDate: "2024-02-08",
  },
  {
    id: "RVW-006",
    submissionId: "ABS-2024-005",
    reviewerId: "REV-003",
    reviewerName: "Dr. Maria Garcia",
    scores: {
      originality: 5,
      methodology: 4,
      relevance: 5,
      clarity: 5,
      significance: 4,
      presentation: 5,
      technical_quality: 4,
    },
    totalScore: 32,
    recommendation: "reject",
    comments: "Lacks novelty.",
    status: "completed",
    assignedDate: "2024-01-30",
    completedDate: "2024-02-10",
  },
  {
    id: "RVW-007",
    submissionId: "ABS-2024-007",
    reviewerId: "REV-001",
    reviewerName: "Dr. James Wilson",
    scores: { ...zeroScores },
    totalScore: 0,
    recommendation: "accept",
    comments: "",
    status: "pending",
    assignedDate: "2024-02-10",
    completedDate: null,
  },
  {
    id: "RVW-008",
    submissionId: "ABS-2024-008",
    reviewerId: "REV-002",
    reviewerName: "Dr. Emily Park",
    scores: {
      originality: 9,
      methodology: 9,
      relevance: 10,
      clarity: 9,
      significance: 9,
      presentation: 8,
      technical_quality: 9,
    },
    totalScore: 63,
    recommendation: "accept",
    comments: "Outstanding contribution.",
    status: "completed",
    assignedDate: "2024-02-12",
    completedDate: "2024-02-20",
  },
  {
    id: "RVW-009",
    submissionId: "ABS-2024-008",
    reviewerId: "REV-003",
    reviewerName: "Dr. Maria Garcia",
    scores: {
      originality: 9,
      methodology: 10,
      relevance: 9,
      clarity: 8,
      significance: 9,
      presentation: 9,
      technical_quality: 10,
    },
    totalScore: 64,
    recommendation: "accept",
    comments: "Rigorous methodology.",
    status: "completed",
    assignedDate: "2024-02-12",
    completedDate: "2024-02-18",
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "NOT-001",
    title: "Abstract Submitted",
    message:
      'Your abstract "Deep Learning Approaches for Medical Image Segmentation" has been successfully submitted.',
    type: "success",
    date: "2024-01-15",
    read: true,
  },
  {
    id: "NOT-002",
    title: "New Review Assignment",
    message: "You have been assigned a new abstract to review: ABS-2024-002.",
    type: "info",
    date: "2024-01-25",
    read: false,
  },
  {
    id: "NOT-003",
    title: "Review Completed",
    message: "Dr. James Wilson has completed the review for ABS-2024-001.",
    type: "success",
    date: "2024-02-01",
    read: true,
  },
  {
    id: "NOT-004",
    title: "Deadline Approaching",
    message: "The submission deadline for ICAI 2024 is in 3 days.",
    type: "warning",
    date: "2024-02-25",
    read: false,
  },
  {
    id: "NOT-005",
    title: "Abstract Accepted",
    message:
      'Your abstract "Deep Learning Approaches for Medical Image Segmentation" has been accepted!',
    type: "success",
    date: "2024-03-01",
    read: false,
  },
  {
    id: "NOT-006",
    title: "Revision Required",
    message:
      "Your abstract ABS-2024-004 requires revisions. Please review the feedback.",
    type: "warning",
    date: "2024-02-10",
    read: true,
  },
];
