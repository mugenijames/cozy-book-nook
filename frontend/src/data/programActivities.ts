// frontend/src/data/programActivities.ts
import schoolImg from "@/assets/school.jpeg";
import maximizeImg from "@/assets/MAXIMIZE.png";
import dearDadPageImg from "@/assets/dear dad2_page-0001.jpg";
import churchImg from "@/assets/church.jpeg";
import churchRelationshipImg from "@/assets/CHURCH-RELATIONSHIP.png";
import loveImg from "@/assets/LOVE.png";
import leadBetterImg from "@/assets/LEAD-BETTER.png";
import ariseTurkanaImg from "@/assets/ARISE-TURKANA.png";

export type ProgramActivity = {
  slug: string;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
};

export const PROGRAM_ACTIVITIES: ProgramActivity[] = [
  {
    slug: "school-ministry",
    title: "School Ministry",
    description: "Inspiring young minds through motivational talks, mentorship programs, and educational workshops that empower students to discover their purpose and potential.",
    images: [
      { src: schoolImg, alt: "School ministry event" },
      { src: maximizeImg, alt: "Maximize your potential" },
    ],
  },
  {
    slug: "church-outreaches",
    title: "Church Outreaches",
    description: "Engaging church communities through powerful sermons, leadership training, and community outreach programs that strengthen faith and fellowship.",
    images: [
      { src: churchImg, alt: "Church outreach event" },
      { src: churchRelationshipImg, alt: "Church relationship" },
      { src: loveImg, alt: "Love in action" },
    ],
  },
  {
    slug: "leadership-training",
    title: "Leadership Training Program",
    description: "Comprehensive leadership development programs designed to equip emerging leaders with practical skills, emotional intelligence, and strategic thinking.",
    images: [
      { src: leadBetterImg, alt: "Lead better" },
      { src: maximizeImg, alt: "Maximize potential" },
    ],
  },
  {
    slug: "philanthropy",
    title: "Philanthropy",
    description: "Giving back to communities through charitable initiatives, community development projects, and programs that uplift the less fortunate.",
    images: [
      { src: ariseTurkanaImg, alt: "Arise Turkana" },
      { src: churchImg, alt: "Community outreach" },
    ],
  },
];

export function getProgramBySlug(slug: string): ProgramActivity | undefined {
  return PROGRAM_ACTIVITIES.find(activity => activity.slug === slug);
}