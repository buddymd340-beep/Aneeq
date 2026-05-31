import {
  Award,
  BookOpen,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Clock,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Lightbulb,
  MessageCircle,
  PenTool,
  Phone,
  Sparkles,
  Star,
  Target,
  Users
} from "lucide-react";

export type Course = {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  level: string;
  duration: string;
  mode: "Online" | "Offline" | "Online + Offline";
  fee: string;
  isFeatured: boolean;
  color: string;
  outcomes: string[];
  syllabus: string[];
};

export const site = {
  name: "BrightPath Teaching",
  tagline: "Simple teaching for confident learning.",
  phone: "+1 555 0199",
  email: "hello@brightpath.example",
  address: "Main Learning Center, City Campus",
  whatsapp: "+1 555 0199",
  timing: "Mon - Sat, 4:00 PM - 8:00 PM"
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact" }
];

export const stats = [
  { label: "Students guided", value: "500+", icon: Users },
  { label: "Subjects covered", value: "10+", icon: BookOpen },
  { label: "Positive feedback", value: "95%", icon: Star },
  { label: "Flexible classes", value: "Online", icon: Laptop }
];

export const courses: Course[] = [
  {
    title: "Mathematics Foundation",
    slug: "mathematics-foundation",
    category: "Mathematics",
    shortDescription: "Build strong basics in algebra, geometry, word problems, and exam practice.",
    description:
      "A focused mathematics program for students who want clear concepts, step-by-step problem solving, and regular practice before exams.",
    level: "Classes 8-10",
    duration: "4 months",
    mode: "Online + Offline",
    fee: "Contact for fee",
    isFeatured: true,
    color: "from-blue-500 to-cyan-400",
    outcomes: [
      "Understand core formulas and where to use them",
      "Solve exam-style questions with confidence",
      "Improve speed through weekly practice sheets",
      "Create simple revision notes for exams"
    ],
    syllabus: ["Algebra", "Geometry", "Trigonometry basics", "Statistics", "Past paper practice"]
  },
  {
    title: "Physics Concepts",
    slug: "physics-concepts",
    category: "Science",
    shortDescription: "Learn motion, force, energy, electricity, and practical examples in simple words.",
    description:
      "This course explains physics with real-life examples, diagrams, numericals, and short tests so students can understand instead of memorizing.",
    level: "Classes 9-11",
    duration: "3 months",
    mode: "Online",
    fee: "Contact for fee",
    isFeatured: true,
    color: "from-violet-500 to-indigo-500",
    outcomes: [
      "Connect theory with real examples",
      "Practice numericals using easy methods",
      "Prepare short notes for quick revision",
      "Improve confidence in diagrams and definitions"
    ],
    syllabus: ["Motion", "Forces", "Work and energy", "Electricity", "Waves"]
  },
  {
    title: "English Grammar & Writing",
    slug: "english-grammar-writing",
    category: "English",
    shortDescription: "Improve grammar, vocabulary, sentence building, and academic writing.",
    description:
      "A practical English course for students who want better grammar, clearer writing, and more confidence in school assignments and exams.",
    level: "Classes 6-10",
    duration: "8 weeks",
    mode: "Online + Offline",
    fee: "Contact for fee",
    isFeatured: true,
    color: "from-emerald-500 to-teal-400",
    outcomes: [
      "Use grammar rules correctly",
      "Write better paragraphs and essays",
      "Build vocabulary with guided practice",
      "Improve reading comprehension"
    ],
    syllabus: ["Tenses", "Parts of speech", "Comprehension", "Essay writing", "Letter writing"]
  },
  {
    title: "Computer Basics",
    slug: "computer-basics",
    category: "Computer",
    shortDescription: "Start with computer fundamentals, internet safety, documents, and presentations.",
    description:
      "A beginner-friendly computer course for students who need practical digital skills for school and everyday learning.",
    level: "Beginners",
    duration: "6 weeks",
    mode: "Offline",
    fee: "Contact for fee",
    isFeatured: false,
    color: "from-orange-500 to-amber-400",
    outcomes: [
      "Use a computer safely and confidently",
      "Create documents and presentations",
      "Understand internet basics and online safety",
      "Practice typing and file management"
    ],
    syllabus: ["Computer parts", "Typing basics", "Documents", "Presentations", "Internet safety"]
  },
  {
    title: "Science Exam Preparation",
    slug: "science-exam-preparation",
    category: "Science",
    shortDescription: "Revise key science chapters with worksheets, diagrams, and test practice.",
    description:
      "A revision-focused course for students preparing for school exams with structured notes, repeated practice, and feedback.",
    level: "Classes 7-10",
    duration: "10 weeks",
    mode: "Online",
    fee: "Contact for fee",
    isFeatured: false,
    color: "from-rose-500 to-pink-400",
    outcomes: [
      "Revise important chapters quickly",
      "Practice diagrams and definitions",
      "Attempt weekly tests with feedback",
      "Learn exam answering techniques"
    ],
    syllabus: ["Biology basics", "Chemistry basics", "Physics revision", "Diagrams", "Model tests"]
  },
  {
    title: "Exam Confidence Program",
    slug: "exam-confidence-program",
    category: "Exam Preparation",
    shortDescription: "Learn planning, revision habits, time management, and test-taking skills.",
    description:
      "A supportive program for students who need a better study routine, exam strategy, and confidence during preparation.",
    level: "All school levels",
    duration: "4 weeks",
    mode: "Online + Offline",
    fee: "Contact for fee",
    isFeatured: false,
    color: "from-sky-500 to-blue-500",
    outcomes: [
      "Create a simple study schedule",
      "Practice time management",
      "Reduce exam stress with preparation habits",
      "Track weekly progress"
    ],
    syllabus: ["Study planning", "Revision methods", "Practice tests", "Time management", "Progress review"]
  }
];

export const features = [
  {
    title: "Clear Concepts",
    description: "Each lesson explains the idea first, then moves into examples and practice.",
    icon: Lightbulb
  },
  {
    title: "Personal Attention",
    description: "Students can ask questions freely and get support based on their level.",
    icon: HeartHandshake
  },
  {
    title: "Weekly Practice",
    description: "Practice sheets, revision tasks, and small tests help students stay consistent.",
    icon: PenTool
  }
];

export const processSteps = [
  { title: "Choose Course", description: "Browse subjects and select the course that fits your class level.", icon: BookOpen },
  { title: "Contact Teacher", description: "Send a simple inquiry with your phone number and learning goal.", icon: MessageCircle },
  { title: "Discuss Timing", description: "Confirm class mode, schedule, and the student's current level.", icon: CalendarCheck },
  { title: "Start Learning", description: "Begin lessons with clear explanations, practice, and feedback.", icon: GraduationCap }
];

export const testimonials = [
  {
    name: "Ayesha K.",
    className: "Class 10",
    quote: "The lessons are very clear. I finally understood mathematics topics that were difficult for me before.",
    rating: 5
  },
  {
    name: "Hamza R.",
    className: "Class 9",
    quote: "Weekly practice and small tests helped me improve my confidence before exams.",
    rating: 5
  },
  {
    name: "Sara M.",
    className: "Class 8",
    quote: "The teacher explains with examples and gives personal attention when I ask questions.",
    rating: 5
  }
];

export const faqs = [
  {
    question: "Do I need to create an account?",
    answer: "No. This website is public. Students or parents can browse courses and send a contact inquiry directly."
  },
  {
    question: "Are online classes available?",
    answer: "Yes. Some courses are online, some are offline, and some support both modes."
  },
  {
    question: "How do I join a course?",
    answer: "Open the contact page, share your details and interested subject, and the teaching team will contact you."
  },
  {
    question: "Can parents contact directly?",
    answer: "Yes. Parents can use the contact form, phone number, or WhatsApp button to discuss classes."
  }
];

export const teachingValues = [
  { title: "Simple explanation", icon: Brain },
  { title: "Practice focused", icon: Target },
  { title: "Student confidence", icon: Sparkles },
  { title: "Regular feedback", icon: CheckCircle2 },
  { title: "Exam readiness", icon: Award },
  { title: "Flexible schedule", icon: Clock },
  { title: "Quick contact", icon: Phone }
];

export const categories = ["All", ...Array.from(new Set(courses.map((course) => course.category)))];
