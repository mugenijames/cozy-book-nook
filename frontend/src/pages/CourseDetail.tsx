import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const courses = [
  {
    slug: "foundations-of-christian-leadership",
    title: "Foundations of Christian Leadership",
    description:
      "Develop biblical leadership principles, servant leadership skills, and practical wisdom for leading people with integrity.",
    level: "Beginner",
    duration: "6 Weeks",
    price: "Free",
    category: "Christian Leadership",
    introduction:
      "Leadership is more than having a position. It is about serving people, developing character, making wise decisions, and influencing others positively. This introductory course provides practical foundations for anyone who desires to grow as a Christian leader.",
    objectives: [
      "Understand biblical principles of servant leadership.",
      "Develop integrity, humility, and responsibility as a leader.",
      "Learn practical approaches to leading people effectively.",
      "Understand the relationship between character and leadership.",
      "Develop a personal leadership growth plan.",
    ],
    modules: [
      "Understanding Biblical Leadership",
      "Character and Integrity in Leadership",
      "Servant Leadership",
      "Leading People and Building Teams",
      "Decision Making and Wisdom",
      "Developing Your Leadership Influence",
    ],
  },

  {
    slug: "effective-christian-communication",
    title: "Effective Christian Communication",
    description:
      "Learn how to communicate biblical truth clearly, confidently, and effectively in ministry, leadership, and everyday life.",
    level: "Intermediate",
    duration: "4 Weeks",
    price: "KES 2,500",
    category: "Communication",
    introduction:
      "Effective communication is essential in ministry, leadership, relationships, and everyday life. This course explores practical principles that can help you communicate with clarity, confidence, wisdom, and compassion.",
    objectives: [
      "Understand the foundations of effective communication.",
      "Develop confidence when speaking to individuals and groups.",
      "Learn how to communicate ideas clearly and simply.",
      "Improve listening and interpersonal communication skills.",
      "Apply communication principles in ministry and leadership.",
    ],
    modules: [
      "Foundations of Effective Communication",
      "Listening and Understanding Others",
      "Speaking with Clarity and Confidence",
      "Communication in Ministry and Leadership",
    ],
  },

  {
    slug: "personal-growth-and-purpose",
    title: "Personal Growth & Purpose",
    description:
      "Discover practical principles for personal development, purpose, discipline, and meaningful impact.",
    level: "Beginner",
    duration: "5 Weeks",
    price: "KES 2,000",
    category: "Personal Development",
    introduction:
      "Personal growth begins with understanding who you are, where you are going, and the values that guide your decisions. This course provides practical principles for developing discipline, discovering purpose, and creating meaningful impact.",
    objectives: [
      "Develop greater self-awareness.",
      "Explore purpose, vision, and personal values.",
      "Build healthy habits and personal discipline.",
      "Set meaningful and achievable goals.",
      "Create a practical personal growth plan.",
    ],
    modules: [
      "Understanding Yourself",
      "Discovering Purpose and Direction",
      "Discipline and Consistency",
      "Goal Setting and Personal Vision",
      "Creating Meaningful Impact",
    ],
  },
];

export default function CourseDetail() {
  const { slug } = useParams();

  const course = courses.find(
    (item) => item.slug === slug
  );

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6F2] px-4">
        <div className="text-center">
          <BookMarked className="mx-auto h-12 w-12 text-[#C17B4F]" />

          <h1 className="mt-5 font-heading text-3xl font-bold text-[#2E1208]">
            Course Not Found
          </h1>

          <p className="mt-3 text-[#6B5548]">
            The course you are looking for could not be found.
          </p>

          <Link
            to="/courses"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white transition hover:bg-[#2E1208]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#4A1F0E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,123,79,0.30),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4D7C5] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C17B4F]/40 bg-white/10 px-4 py-2 text-sm font-semibold text-[#F4D7C5]">
                <GraduationCap className="h-4 w-4" />
                {course.category}
              </div>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                {course.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  {course.level}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  <Clock3 className="h-4 w-4" />
                  {course.duration}
                </span>

                <span className="rounded-full bg-[#D4A017] px-4 py-2 text-sm font-bold text-white">
                  {course.price}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
              <BookMarked className="h-14 w-14 text-[#D4A017]" />

              <h2 className="mt-6 font-heading text-2xl font-bold text-white">
                Start Your Learning Journey
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/70">
                Explore the course modules and discover practical
                principles you can apply in your personal life,
                ministry, leadership, and work.
              </p>

              <button
                type="button"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4A017] px-5 py-3 font-semibold text-white transition hover:bg-[#B58900]"
              >
                Enroll in Course
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================
          COURSE CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">

          <div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C17B4F]">
                About This Course
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold text-[#2E1208]">
                What you will discover
              </h2>

              <p className="mt-5 leading-8 text-[#6B5548]">
                {course.introduction}
              </p>
            </div>

            {/* Objectives */}

            <div className="mt-12">

              <h2 className="font-heading text-2xl font-bold text-[#2E1208]">
                Learning Objectives
              </h2>

              <div className="mt-6 space-y-4">

                {course.objectives.map(
                  (objective) => (
                    <div
                      key={objective}
                      className="flex gap-3"
                    >
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#C17B4F]" />

                      <p className="leading-7 text-[#6B5548]">
                        {objective}
                      </p>
                    </div>
                  )
                )}

              </div>
            </div>

            {/* Modules */}

            <div className="mt-12">

              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#C17B4F]" />

                <h2 className="font-heading text-2xl font-bold text-[#2E1208]">
                  Course Modules
                </h2>
              </div>

              <div className="mt-6 space-y-3">

                {course.modules.map(
                  (module, index) => (
                    <div
                      key={module}
                      className="flex items-center gap-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-sm"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4A1F0E] text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <p className="font-semibold text-[#2E1208]">
                        {module}
                      </p>
                    </div>
                  )
                )}

              </div>
            </div>

          </div>

          {/* Sidebar */}

          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-3xl border border-[#E8DDD4] bg-white p-7 shadow-sm">

              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#C17B4F]">
                Course Information
              </p>

              <div className="mt-6 space-y-5">

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8B7568]">
                    Level
                  </p>

                  <p className="mt-1 font-semibold text-[#2E1208]">
                    {course.level}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8B7568]">
                    Duration
                  </p>

                  <p className="mt-1 font-semibold text-[#2E1208]">
                    {course.duration}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8B7568]">
                    Investment
                  </p>

                  <p className="mt-1 font-semibold text-[#2E1208]">
                    {course.price}
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A1F0E] px-5 py-3 font-semibold text-white transition hover:bg-[#2E1208]"
              >
                Enroll Now
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

          </aside>

        </div>
      </section>

      {/* ======================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="border-t border-[#E8DDD4] bg-white">

        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">

          <GraduationCap className="mx-auto h-10 w-10 text-[#C17B4F]" />

          <h2 className="mt-5 font-heading text-3xl font-bold text-[#2E1208]">
            Continue Your Growth
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6B5548]">
            Explore more courses and discover opportunities to
            grow your knowledge, character, leadership, and purpose.
          </p>

          <Link
            to="/courses"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#2E1208] hover:shadow-xl"
          >
            Explore More Courses
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </section>

    </main>
  );
}