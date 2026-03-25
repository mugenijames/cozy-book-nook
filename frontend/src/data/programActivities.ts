import schoolImg from "@/assets/school.jpeg";
import maximizeImg from "@/assets/MAXIMIZE.png";
import dearDadPageImg from "@/assets/dear dad2_page-0001.jpg";

import churchImg from "@/assets/church.jpeg";
import churchRelationshipImg from "@/assets/CHURCH-RELATIONSHIP.png";
import loveImg from "@/assets/LOVE.png";

import leadBetterImg from "@/assets/LEAD-BETTER.png";
import groupPhoto1 from "@/assets/IMG_7472.JPG.jpeg";
import groupPhoto2 from "@/assets/IMG_7474.JPG.jpeg";

import ariseTurkanaImg from "@/assets/ARISE-TURKANA.png";
import communityFbImg from "@/assets/FB_IMG_1766407430713.jpg.jpeg";
import outreachImg from "@/assets/IMG-20260208-WA0018.jpg.jpeg";

export type ProgramActivity = {
  slug: string;
  title: string;
  description: string;
  /** Bundled asset URLs from `src/assets` (or any image URL string). */
  images: { src: string; alt: string }[];
};

export const PROGRAM_ACTIVITIES: ProgramActivity[] = [
  {
    slug: "school-ministry",
    title: "School ministry",
    description:
      "School-based ministry focused on students—mentorship, values, and transformation in learning environments.",
    images: [
      { src: schoolImg, alt: "School ministry" },
      { src: maximizeImg, alt: "Campus and student growth" },
      { src: dearDadPageImg, alt: "Student-focused resource" },
    ],
  },
  {
    slug: "church-outreaches",
    title: "Church outreaches",
    description:
      "Community outreaches through local churches—serving neighborhoods, events, and gatherings.",
    images: [
      { src: churchImg, alt: "Church outreach" },
      { src: churchRelationshipImg, alt: "Church and community" },
      { src: loveImg, alt: "Serving in love" },
    ],
  },
  {
    slug: "leadership-training",
    title: "Leadership Training program",
    description:
      "Practical leadership training for teams, churches, and organizations—building character and clarity.",
    images: [
      { src: leadBetterImg, alt: "Leadership training" },
      { src: groupPhoto1, alt: "Leadership gathering" },
      { src: groupPhoto2, alt: "Training session" },
    ],
  },
  {
    slug: "philanthropy",
    title: "Philanthropy",
    description:
      "Initiatives that give back—supporting communities, resources, and people in need.",
    images: [
      { src: ariseTurkanaImg, alt: "Community uplift work" },
      { src: communityFbImg, alt: "Community outreach" },
      { src: outreachImg, alt: "Philanthropy in action" },
    ],
  },
];

export function getProgramBySlug(slug: string | undefined): ProgramActivity | undefined {
  if (!slug) return undefined;
  return PROGRAM_ACTIVITIES.find((p) => p.slug === slug);
}
