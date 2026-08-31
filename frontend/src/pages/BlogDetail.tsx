
// frontend/src/pages/BlogDetail.tsx

import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Newspaper,
} from "lucide-react";

const blogs = [
  {
    slug: "discovering-your-purpose",
    title: "Discovering Your Purpose: Living a Life That Matters",
    category: "Purpose & Growth",
    date: "August 28, 2026",
    readTime: "5 min read",
    introduction:
      "Purpose gives direction to our lives. When we understand why we are here and what we are called to contribute, our decisions begin to have greater meaning.",
    content: [
      {
        heading: "Purpose Begins With Understanding Who You Are",
        paragraphs: [
          "Every person has unique abilities, experiences, relationships, and opportunities. Understanding yourself is an important part of discovering the contribution you were created to make.",
          "Instead of constantly comparing yourself with others, take time to understand your strengths, values, passions, and the things that genuinely matter to you.",
        ],
      },
      {
        heading: "Purpose Requires Action",
        paragraphs: [
          "Knowing what you want to accomplish is only the beginning. Purpose becomes meaningful when it is translated into action.",
          "Small consistent decisions can eventually produce significant results. You do not have to have everything figured out before you begin.",
        ],
      },
      {
        heading: "Use Your Gifts to Serve Others",
        paragraphs: [
          "One of the clearest ways to live a purposeful life is to use what you have to make a positive difference in the lives of others.",
          "Leadership, knowledge, creativity, communication, compassion, and many other gifts become more valuable when they are used to serve and uplift people.",
        ],
      },
    ],
  },

  {
    slug: "principles-of-christian-leadership",
    title: "Principles of Christian Leadership",
    category: "Leadership",
    date: "August 22, 2026",
    readTime: "7 min read",
    introduction:
      "Christian leadership is more than a position. It is about serving people, leading with integrity, and reflecting Christ through our decisions and actions.",
    content: [
      {
        heading: "Leadership Begins With Character",
        paragraphs: [
          "A leader may have knowledge, influence, and authority, but lasting leadership is built on character.",
          "Integrity, humility, honesty, responsibility, and compassion are qualities that create trust and help leaders influence people positively.",
        ],
      },
      {
        heading: "Leaders Are Called to Serve",
        paragraphs: [
          "A healthy leadership culture is not built around personal recognition. It is built around serving people and helping them become better.",
          "Good leaders create opportunities for others to grow, develop their gifts, and contribute meaningfully.",
        ],
      },
      {
        heading: "Lead With Vision",
        paragraphs: [
          "People need direction. A leader should be able to communicate a clear vision and help others understand how their contribution fits into the bigger picture.",
          "Vision gives people something meaningful to work toward and helps organizations and communities move forward together.",
        ],
      },
    ],
  },

  {
    slug: "growing-through-challenges",
    title: "Growing Through Life's Challenges",
    category: "Personal Growth",
    date: "August 15, 2026",
    readTime: "6 min read",
    introduction:
      "Challenges can become opportunities for growth. Difficult seasons can strengthen our character, faith, resilience, and perspective.",
    content: [
      {
        heading: "Challenges Are Part of Life",
        paragraphs: [
          "No meaningful journey is completely free from difficulties. Every person experiences seasons that test their patience, confidence, faith, and determination.",
          "The presence of a challenge does not necessarily mean that you are on the wrong path.",
        ],
      },
      {
        heading: "Learn From Difficult Seasons",
        paragraphs: [
          "Difficult experiences can teach lessons that comfortable seasons sometimes cannot.",
          "Take time to reflect on what a difficult season is teaching you. Ask yourself what needs to change, what needs to grow, and what you can learn from the experience.",
        ],
      },
      {
        heading: "Keep Moving Forward",
        paragraphs: [
          "Progress does not always happen quickly. Sometimes growth looks like simply refusing to give up.",
          "Give yourself permission to move slowly when necessary, but continue moving forward with hope, wisdom, and determination.",
        ],
      },
    ],
  },

  {
    slug: "faith-and-personal-development",
    title: "Faith and Personal Development",
    category: "Faith",
    date: "August 8, 2026",
    readTime: "5 min read",
    introduction:
      "Personal development becomes more meaningful when it is built on strong values, faith, discipline, and a desire to become a better person.",
    content: [
      {
        heading: "Growth Is Intentional",
        paragraphs: [
          "Personal growth rarely happens by accident. It requires intentional decisions, reflection, learning, and a willingness to improve.",
          "Set meaningful goals and create habits that support the person you want to become.",
        ],
      },
      {
        heading: "Build Strong Foundations",
        paragraphs: [
          "Skills and achievements are valuable, but character provides the foundation upon which they should be built.",
          "Develop qualities such as discipline, honesty, patience, humility, and compassion alongside your professional and personal abilities.",
        ],
      },
      {
        heading: "Keep Learning",
        paragraphs: [
          "Growth requires curiosity. Read, listen, ask questions, learn from people around you, and remain open to new perspectives.",
          "A commitment to lifelong learning allows you to continue developing and making a meaningful contribution wherever you are.",
        ],
      },
    ],
  },

  {
    slug: "becoming-an-effective-communicator",
    title: "Becoming an Effective Communicator",
    category: "Communication",
    date: "August 1, 2026",
    readTime: "6 min read",
    introduction:
      "Communication is one of the most important skills in leadership and relationships. Clear communication helps people understand, connect, and work together.",
    content: [
      {
        heading: "Listen Before You Speak",
        paragraphs: [
          "Effective communication begins with listening. When people feel heard, they are more likely to engage honestly and positively.",
          "Give people your attention and seek to understand what they are saying before preparing your response.",
        ],
      },
      {
        heading: "Communicate Clearly",
        paragraphs: [
          "Good communication does not require complicated language. It requires clarity.",
          "Know what you want to communicate, organize your thoughts, and express your message in a way that your audience can understand.",
        ],
      },
      {
        heading: "Communication Builds Relationships",
        paragraphs: [
          "Communication is not simply about transferring information. It is also about building trust and relationships.",
          "Speak with honesty, respect, patience, and empathy, especially when discussing difficult issues.",
        ],
      },
    ],
  },

  {
    slug: "serving-with-purpose",
    title: "Serving With Purpose",
    category: "Leadership",
    date: "July 25, 2026",
    readTime: "4 min read",
    introduction:
      "True impact begins when we choose to use our abilities to serve others. Purpose becomes more meaningful when it produces positive change around us.",
    content: [
      {
        heading: "Everyone Can Make a Difference",
        paragraphs: [
          "You do not need a large platform to make an impact. Small acts of service can make a significant difference in someone's life.",
          "Look around you and identify opportunities where your time, knowledge, skills, or resources can help someone else.",
        ],
      },
      {
        heading: "Serve With Excellence",
        paragraphs: [
          "Whatever responsibility you have, approach it with commitment and excellence.",
          "Excellence communicates respect for the people you serve and demonstrates that you value the responsibility entrusted to you.",
        ],
      },
      {
        heading: "Impact Is Built Over Time",
        paragraphs: [
          "Meaningful impact is often the result of consistent service rather than one major moment.",
          "Continue showing up, helping people, sharing knowledge, and contributing positively. Over time, those actions can create a lasting legacy.",
        ],
      },
    ],
  },
];

export default function BlogDetail() {
  const { slug } = useParams();

  const blog = blogs.find(
    (item) => item.slug === slug
  );

  // ============================================================
  // BLOG NOT FOUND
  // ============================================================

  if (!blog) {
    return (
      <main className="min-h-screen bg-[#F8F6F2]">

        <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">

          <Newspaper className="mx-auto h-12 w-12 text-[#C17B4F]" />

          <h1 className="mt-6 font-heading text-3xl font-bold text-[#2E1208]">
            Article Not Found
          </h1>

          <p className="mt-4 leading-7 text-[#6B5548]">
            The article you are looking for may have been removed
            or the link may be incorrect.
          </p>

          <Link
            to="/blogs"
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#4A1F0E]
              px-6
              py-3
              font-semibold
              text-white
              shadow-md
              transition-all
              hover:bg-[#2E1208]
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

        </section>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">

      {/* ======================================================
          ARTICLE HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#4A1F0E]">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,123,79,0.30),transparent_45%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <Link
            to="/blogs"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#F4D7C5]
              transition-colors
              hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <div className="mt-10">

            <span className="
              inline-flex
              rounded-full
              bg-[#D4A017]
              px-4
              py-1.5
              text-xs
              font-bold
              text-white
            ">
              {blog.category}
            </span>

            <h1 className="
              mt-5
              max-w-4xl
              font-heading
              text-4xl
              font-bold
              leading-tight
              text-white
              sm:text-5xl
              lg:text-6xl
            ">
              {blog.title}
            </h1>

            <div className="
              mt-6
              flex
              flex-wrap
              items-center
              gap-5
              text-sm
              text-white/70
            ">

              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {blog.date}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {blog.readTime}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          ARTICLE
      ====================================================== */}

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Article introduction */}

        <div className="
          border-l-4
          border-[#C17B4F]
          bg-white
          px-6
          py-6
          shadow-sm
          sm:px-8
        ">
          <p className="
            text-lg
            font-medium
            leading-8
            text-[#4A1F0E]
          ">
            {blog.introduction}
          </p>
        </div>

        {/* Article content */}

        <div className="mt-12 space-y-10">

          {blog.content.map(
            (section, index) => (
              <section key={index}>

                <h2 className="
                  font-heading
                  text-2xl
                  font-bold
                  text-[#2E1208]
                  sm:text-3xl
                ">
                  {section.heading}
                </h2>

                <div className="mt-4 space-y-4">

                  {section.paragraphs.map(
                    (paragraph, paragraphIndex) => (
                      <p
                        key={paragraphIndex}
                        className="
                          text-base
                          leading-8
                          text-[#5F4A3D]
                        "
                      >
                        {paragraph}
                      </p>
                    )
                  )}

                </div>

              </section>
            )
          )}

        </div>

        {/* ====================================================
            ARTICLE FOOTER
        ==================================================== */}

        <div className="
          mt-14
          border-t
          border-[#E8DDD4]
          pt-8
        ">

          <Link
            to="/blogs"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#4A1F0E]
              px-6
              py-3
              font-semibold
              text-white
              shadow-md
              transition-all
              hover:-translate-y-0.5
              hover:bg-[#2E1208]
              hover:shadow-lg
            "
          >
            <ArrowLeft className="h-4 w-4" />
            More Articles
          </Link>

          <Link
            to="/courses"
            className="
              ml-3
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#C17B4F]
              bg-white
              px-6
              py-3
              font-semibold
              text-[#8B4513]
              transition-all
              hover:bg-[#F8F6F2]
            "
          >
            Explore Courses
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </article>

    </main>
  );
}

