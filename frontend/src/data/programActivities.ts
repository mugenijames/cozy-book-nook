// frontend/src/data/programActivities.ts

import type { ComponentType } from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  Church,
  GraduationCap,
  HeartHandshake,
  Landmark,
  PiggyBank,
  Users,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

export type ProgramIcon =
  | "SpiritualDevelopment"
  | "CapacityBuilding"
  | "MentorshipEducation"
  | "CareerGuidance"
  | "FinancialEmpowerment";

export type ProgramHighlight = {
  title: string;
  slug: string;
  description: string;
  image: string;
};

export type ProgramActivity = {
  slug: string;
  title: string;
  shortTitle?: string;

  category: string;

  description: string;

  fullDescription: string;

  icon: ProgramIcon;

  featuredImage: {
    src: string;
    alt: string;
  };

  images: {
    src: string;
    alt: string;
  }[];

  highlights: ProgramHighlight[];

  audience: string;

  ctaText?: string;
};

// ============================================================
// ICONS
// ============================================================

export const PROGRAM_ICON_MAP: Record<
  ProgramIcon,
  ComponentType<{ className?: string }>
> = {
  SpiritualDevelopment: Church,
  CapacityBuilding: Users,
  MentorshipEducation: GraduationCap,
  CareerGuidance: BriefcaseBusiness,
  FinancialEmpowerment: PiggyBank,
};

// ============================================================
// TEMPORARY ONLINE IMAGES
// ============================================================
//
// These are temporary images for development/testing.
// Replace them later with your actual ministry/program photos.
//
// ============================================================

const images = {
  church:
    "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=85",

  prayer:
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=85",

  bible:
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=85",

  worship:
    "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=85",

  leadership:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=85",

  teamwork:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",

  training:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",

  customerService:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",

  mentorship:
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=85",

  education:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",

  books:
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85",

  students:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",

  career:
    "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1600&q=85",

  fatherSon:
    "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=1200&q=85",

  speaking:
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85",

  youth:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",

  finance:
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=85",

  entrepreneurship:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",

  business:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85",

  family:
    "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&w=1200&q=85",
};

// ============================================================
// PROGRAM ACTIVITIES
// ============================================================

export const PROGRAM_ACTIVITIES: ProgramActivity[] = [
  // ==========================================================
  // 1. SPIRITUAL DEVELOPMENT
  // ==========================================================

  {
    slug: "spiritual-development",

    title: "Spiritual Development",

    shortTitle: "Spiritual Development",

    category: "Faith & Spiritual Formation",

    description:
      "Helping individuals, churches, and Christian communities grow deeper in their relationship with God through biblical teaching, prayer, evangelism, discipleship, and practical Christian living.",

    fullDescription:
      "Spiritual Development focuses on nurturing a strong and practical Christian faith. Through evangelism, prayer and devotion, Bible study, discipleship training, and Sunday services, we seek to help believers grow in their knowledge of Scripture, develop a consistent walk with God, and live out their faith in everyday life. These programs can be delivered through churches, Christian Unions, youth fellowships, conferences, small groups, and community settings.",

    icon: "SpiritualDevelopment",

    featuredImage: {
      src: images.church,
      alt: "Christian community gathered for worship and spiritual development",
    },

    images: [
      {
        src: images.church,
        alt: "Church community gathering",
      },
      {
        src: images.prayer,
        alt: "Prayer and devotion session",
      },
      {
        src: images.bible,
        alt: "Bible study session",
      },
      {
        src: images.worship,
        alt: "Christian worship gathering",
      },
    ],

    highlights: [
      {
        title: "Evangelism",
        slug: "evangelism",
        description:
          "Equipping believers to share the Gospel with courage, wisdom, love, and compassion.",
        image: images.church,
      },
      {
        title: "Prayer & Devotion",
        slug: "prayer-devotion",
        description:
          "Encouraging a consistent personal and corporate culture of prayer, worship, and devotion to God.",
        image: images.prayer,
      },
      {
        title: "Bible Study",
        slug: "bible-study",
        description:
          "Creating opportunities for people to study Scripture, ask meaningful questions, and apply biblical truth.",
        image: images.bible,
      },
      {
        title: "Discipleship Training",
        slug: "discipleship-training",
        description:
          "Helping believers develop spiritual maturity and become faithful followers and representatives of Christ.",
        image: images.education,
      },
      {
        title: "Sunday Services",
        slug: "sunday-services",
        description:
          "Supporting churches and Christian communities through biblical preaching, teaching, worship, and fellowship.",
        image: images.worship,
      },
    ],

    audience:
      "Churches, Christian Unions, youth ministries, fellowships, small groups, and individual believers",

    ctaText: "Invite Us to Your Church",
  },

  // ==========================================================
  // 2. CAPACITY BUILDING & TRAININGS
  // ==========================================================

  {
    slug: "capacity-building",

    title: "Capacity Building & Trainings",

    shortTitle: "Capacity Building",

    category: "Organizational & Leadership Development",

    description:
      "Equipping teams, staff, leaders, and organizations with practical skills that strengthen performance, collaboration, service, leadership, and organizational culture.",

    fullDescription:
      "Capacity Building & Trainings are designed to help organizations and teams develop the people behind their mission. Through practical and interactive sessions, we address staff motivation, teamwork, customer service, leadership, communication, and professional growth. The goal is to help organizations build healthier teams, improve performance, strengthen relationships, and create a culture of excellence and accountability.",

    icon: "CapacityBuilding",

    featuredImage: {
      src: images.leadership,
      alt: "Team participating in a professional capacity building session",
    },

    images: [
      {
        src: images.leadership,
        alt: "Leadership development session",
      },
      {
        src: images.teamwork,
        alt: "Teamwork and collaboration session",
      },
      {
        src: images.training,
        alt: "Professional training workshop",
      },
      {
        src: images.customerService,
        alt: "Customer service training",
      },
    ],

    highlights: [
      {
        title: "Staff Motivation",
        slug: "staff-motivation",
        description:
          "Helping teams understand motivation, purpose, ownership, and the value of their contribution.",
        image: images.training,
      },
      {
        title: "Teamwork",
        slug: "teamwork",
        description:
          "Building collaborative teams that communicate effectively, trust one another, and work toward shared goals.",
        image: images.teamwork,
      },
      {
        title: "Customer Service",
        slug: "customer-service",
        description:
          "Developing a customer-focused culture built around professionalism, empathy, communication, and excellence.",
        image: images.customerService,
      },
      {
        title: "Leadership",
        slug: "leadership",
        description:
          "Equipping leaders with practical principles for integrity, influence, communication, responsibility, and effective leadership.",
        image: images.leadership,
      },
    ],

    audience:
      "Organizations, businesses, churches, schools, NGOs, staff teams, emerging leaders, and professional groups",

    ctaText: "Book a Training Session",
  },

  // ==========================================================
  // 3. MENTORSHIP & EDUCATION
  // ==========================================================

  {
    slug: "mentorship-education",

    title: "Mentorship & Education",

    shortTitle: "Mentorship & Education",

    category: "Personal Growth & Learning",

    description:
      "Creating platforms that help young people and lifelong learners discover purpose, develop character, gain knowledge, and build meaningful relationships.",

    fullDescription:
      "Mentorship & Education brings together structured mentorship, educational resources, conversations, books, courses, and digital platforms designed to help people grow. Through initiatives such as Dreamers Table and Dreamers Community, we create spaces where young people can ask questions, share experiences, learn from mentors, and develop practical strategies for their future. Books, courses, and social media content extend these conversations beyond physical gatherings.",

    icon: "MentorshipEducation",

    featuredImage: {
      src: images.mentorship,
      alt: "Young people participating in a mentorship session",
    },

    images: [
      {
        src: images.mentorship,
        alt: "Mentorship discussion",
      },
      {
        src: images.education,
        alt: "Educational learning session",
      },
      {
        src: images.books,
        alt: "Books and educational resources",
      },
      {
        src: images.students,
        alt: "Students learning together",
      },
    ],

    highlights: [
      {
        title: "Dreamers Table",
        slug: "dreamers-table",
        description:
          "A platform for meaningful conversations around purpose, identity, growth, relationships, leadership, and the future.",
        image: images.mentorship,
      },
      {
        title: "Dreamers Community",
        slug: "dreamers-community",
        description:
          "Building a community where young people can connect, learn, collaborate, and encourage one another.",
        image: images.students,
      },
      {
        title: "Books",
        slug: "books",
        description:
          "Providing books and written resources that encourage personal, spiritual, professional, and intellectual growth.",
        image: images.books,
      },
      {
        title: "Courses",
        slug: "courses",
        description:
          "Developing practical learning experiences that help people gain useful knowledge and applicable skills.",
        image: images.education,
      },
      {
        title: "Social Media Presence",
        slug: "social-media",
        description:
          "Using digital platforms to share educational, inspirational, motivational, and faith-based content.",
        image: images.students,
      },
    ],

    audience:
      "Students, young professionals, young adults, emerging leaders, lifelong learners, and aspiring entrepreneurs",

    ctaText: "Join the Community",
  },

  // ==========================================================
  // 4. CAREER GUIDANCE & COUNSELLING
  // ==========================================================

  {
    slug: "career-guidance",
    
    title: "Career Guidance & Counselling",

    shortTitle: "Career Guidance",

    category: "Career & Personal Development",

    description:
      "Helping young people make informed decisions about education, careers, relationships, personal development, and their future through mentorship and practical guidance.",

    fullDescription:
      "Career Guidance & Counselling provides practical support for young people navigating important decisions about education, careers, identity, relationships, and personal responsibility. Through the Dear Dad Initiative, inspirational and motivational talks, career conversations, and boychild empowerment, we create spaces where young people can receive guidance, ask difficult questions, develop confidence, and make informed choices about their future.",

    icon: "CareerGuidance",

    featuredImage: {
      src: images.career,
      alt: "Career guidance and mentorship session",
    },

    images: [
      {
        src: images.career,
        alt: "Career guidance session",
      },
      {
        src: images.fatherSon,
        alt: "Mentorship and fatherhood conversation",
      },
      {
        src: images.speaking,
        alt: "Inspirational speaking session",
      },
      {
        src: images.youth,
        alt: "Youth empowerment gathering",
      },
    ],

    highlights: [
      {
        title: "Dear Dad Initiative",
        slug: "dear-dad",
        description:
          "Creating conversations around fatherhood, mentorship, identity, responsibility, relationships, and growing into responsible adulthood.",
        image: images.fatherSon,
      },
      {
        title: "Inspirational Talks",
        slug: "inspirational-talks",
        description:
          "Sharing practical messages that encourage young people to believe in their potential and pursue meaningful lives.",
        image: images.speaking,
      },
      {
        title: "Motivational Talks",
        slug: "motivational-talks",
        description:
          "Helping audiences overcome limiting mindsets, develop resilience, and take purposeful action.",
        image: images.speaking,
      },
      {
        title: "Boychild Empowerment",
        slug: "boychild-empowerment",
        description:
          "Creating intentional conversations and mentorship opportunities that help boys and young men grow into responsible adults.",
        image: images.youth,
      },
    ],

    audience:
      "Students, teenagers, young adults, parents, schools, youth organizations, and community groups",

    ctaText: "Request a Career Session",
  },

  // ==========================================================
  // 5. FINANCIAL EMPOWERMENT
  // ==========================================================

  {
    slug: "financial-empowerment",

    title: "Financial Empowerment",

    shortTitle: "Financial Empowerment",

    category: "Financial Literacy & Economic Empowerment",

    description:
      "Equipping individuals, families, and communities with practical knowledge for responsible money management, financial decision-making, entrepreneurship, and economic empowerment.",

    fullDescription:
      "Financial Empowerment focuses on helping people develop healthier relationships with money and make informed financial decisions. Through personal finance education, financial literacy, entrepreneurship, and parents and caregivers empowerment, participants are equipped with practical principles that can help them manage resources responsibly, identify opportunities, plan for the future, and build sustainable financial habits.",

    icon: "FinancialEmpowerment",

    featuredImage: {
      src: images.finance,
      alt: "Financial empowerment and financial literacy session",
    },

    images: [
      {
        src: images.finance,
        alt: "Financial literacy training",
      },
      {
        src: images.entrepreneurship,
        alt: "Entrepreneurship discussion",
      },
      {
        src: images.business,
        alt: "Business and entrepreneurship session",
      },
      {
        src: images.family,
        alt: "Family financial empowerment conversation",
      },
    ],

    highlights: [
      {
        title: "Personal Finance",
        slug: "personal-finance",
        description:
          "Helping individuals understand budgeting, saving, spending, planning, and responsible financial decision-making.",
        image: images.finance,
      },
      {
        title: "Financial Literacy",
        slug: "financial-literacy",
        description:
          "Building practical understanding of financial concepts that help people make informed decisions.",
        image: images.finance,
      },
      {
        title: "Entrepreneurship",
        slug: "entrepreneurship",
        description:
          "Encouraging entrepreneurial thinking, opportunity identification, innovation, and responsible business development.",
        image: images.entrepreneurship,
      },
      {
        title: "Parents & Caregivers Empowerment",
        slug: "parents-caregivers",
        description:
          "Supporting parents and caregivers with practical conversations around financial responsibility, planning, and family wellbeing.",
        image: images.family,
      },
    ],

    audience:
      "Young adults, professionals, entrepreneurs, parents, caregivers, students, churches, schools, and community organizations",

    ctaText: "Request Financial Training",
  },
];

// ============================================================
// FIND PROGRAM BY SLUG
// ============================================================

export function getProgramBySlug(
  slug: string | undefined
): ProgramActivity | undefined {
  if (!slug) return undefined;

  return PROGRAM_ACTIVITIES.find(
    (activity) => activity.slug === slug
  );
}

// ============================================================
// FIND HIGHLIGHT BY SLUG
// ============================================================

export function getProgramHighlight(
  programSlug: string | undefined,
  highlightSlug: string | undefined
): ProgramHighlight | undefined {
  if (!programSlug || !highlightSlug) return undefined;

  const program = getProgramBySlug(programSlug);

  if (!program) return undefined;

  return program.highlights.find(
    (highlight) => highlight.slug === highlightSlug
  );
}