// frontend/src/data/programActivities.ts

import schoolImg from "@/assets/school.jpeg";
import maximizeImg from "@/assets/MAXIMIZE.png";
import churchImg from "@/assets/church.jpeg";
import churchRelationshipImg from "@/assets/CHURCH-RELATIONSHIP.png";
import loveImg from "@/assets/LOVE.png";
import leadBetterImg from "@/assets/LEAD-BETTER.png";
import ariseTurkanaImg from "@/assets/ARISE-TURKANA.png";

export type ProgramActivity = {
  slug: string;
  title: string;
  shortTitle?: string;

  category: string;

  description: string;

  fullDescription: string;

  icon: "GraduationCap" | "Church" | "Users" | "HeartHandshake";

  featuredImage: {
    src: string;
    alt: string;
  };

  images: {
    src: string;
    alt: string;
  }[];

  highlights: string[];

  audience: string;

  ctaText?: string;
};

export const PROGRAM_ACTIVITIES: ProgramActivity[] = [
  {
    slug: "school-ministry",

    title: "School Ministry",

    shortTitle: "School Ministry",

    category: "Youth & Student Development",

    description:
      "Inspiring young minds through motivational talks, mentorship, and practical conversations that help students discover purpose, build resilience, and make meaningful choices.",

    fullDescription:
      "The School Ministry program exists to reach students at a critical stage of personal development. Through motivational talks, mentorship sessions, interactive conversations, and practical life lessons, the program creates an environment where young people can think deeply about their identity, choices, relationships, education, faith, and future. The goal is not simply to inspire students for a moment, but to equip them with principles they can apply long after the program ends.",

    icon: "GraduationCap",

    featuredImage: {
      src: schoolImg,
      alt: "Students participating in a school ministry program",
    },

    images: [
      {
        src: schoolImg,
        alt: "School ministry event",
      },
      {
        src: maximizeImg,
        alt: "Maximize Campus Life program",
      },
    ],

    highlights: [
      "Motivational and inspirational talks",
      "Student mentorship",
      "Purpose and identity development",
      "Character and discipline",
      "Leadership development",
      "Life skills and decision making",
    ],

    audience: "Students, schools, teachers, and youth leaders",

    ctaText: "Invite David to Your School",
  },

  {
    slug: "church-outreaches",

    title: "Church Outreaches",

    shortTitle: "Church Outreaches",

    category: "Faith & Community",

    description:
      "Engaging church communities through meaningful conversations, teaching, leadership development, and outreach initiatives that strengthen faith, relationships, and service.",

    fullDescription:
      "Church Outreaches provide opportunities to engage communities through faith, practical teaching, conversations, and service. The program addresses issues that affect individuals, families, young people, and leaders while encouraging believers to develop a practical and transformative faith. Through church gatherings, conferences, youth meetings, and community initiatives, the focus remains on strengthening people and building healthier communities.",

    icon: "Church",

    featuredImage: {
      src: churchImg,
      alt: "Church outreach gathering",
    },

    images: [
      {
        src: churchImg,
        alt: "Church outreach event",
      },
      {
        src: churchRelationshipImg,
        alt: "Church relationship teaching",
      },
      {
        src: loveImg,
        alt: "Love in action outreach initiative",
      },
    ],

    highlights: [
      "Inspirational speaking",
      "Faith and personal growth",
      "Relationship development",
      "Youth ministry",
      "Leadership conversations",
      "Community outreach",
    ],

    audience:
      "Churches, ministries, youth groups, and community organizations",

    ctaText: "Invite David to Your Church",
  },

  {
    slug: "leadership-training",

    title: "Leadership Training Program",

    shortTitle: "Leadership Training",

    category: "Leadership & Development",

    description:
      "Equipping emerging and established leaders with practical principles for leading with integrity, emotional intelligence, responsibility, and influence.",

    fullDescription:
      "The Leadership Training Program is designed to help leaders understand that effective leadership goes beyond titles and positions. Participants are challenged to develop self-awareness, emotional intelligence, communication skills, responsibility, integrity, and strategic thinking. The program combines practical principles with real-life leadership situations to help participants become more intentional and effective in their spheres of influence.",

    icon: "Users",

    featuredImage: {
      src: leadBetterImg,
      alt: "Leadership training program",
    },

    images: [
      {
        src: leadBetterImg,
        alt: "Lead Better Than Me leadership program",
      },
      {
        src: maximizeImg,
        alt: "Leadership and personal development session",
      },
    ],

    highlights: [
      "Leadership principles",
      "Emotional intelligence",
      "Communication skills",
      "Integrity and responsibility",
      "Team building",
      "Strategic thinking",
      "Personal development",
    ],

    audience:
      "Emerging leaders, professionals, students, churches, and organizations",

    ctaText: "Book a Leadership Session",
  },

  {
    slug: "philanthropy",

    title: "Philanthropy",

    shortTitle: "Philanthropy",

    category: "Community Transformation",

    description:
      "Supporting communities through initiatives that promote dignity, opportunity, education, personal responsibility, and sustainable transformation.",

    fullDescription:
      "Philanthropy is an important part of David's commitment to social transformation. These initiatives seek to respond to real community needs while empowering people to become part of the solution. From supporting vulnerable communities to creating awareness around education, leadership, opportunity, and personal responsibility, the focus is on creating meaningful and lasting impact.",

    icon: "HeartHandshake",

    featuredImage: {
      src: ariseTurkanaImg,
      alt: "Community transformation initiative",
    },

    images: [
      {
        src: ariseTurkanaImg,
        alt: "Arise Turkana initiative",
      },
      {
        src: churchImg,
        alt: "Community outreach",
      },
    ],

    highlights: [
      "Community support",
      "Youth empowerment",
      "Education initiatives",
      "Community development",
      "Social awareness",
      "Supporting vulnerable communities",
    ],

    audience:
      "Communities, youth groups, schools, churches, and development partners",

    ctaText: "Partner for Community Impact",
  },
];

export function getProgramBySlug(
  slug: string | undefined
): ProgramActivity | undefined {
  if (!slug) return undefined;

  return PROGRAM_ACTIVITIES.find(
    (activity) => activity.slug === slug
  );
}