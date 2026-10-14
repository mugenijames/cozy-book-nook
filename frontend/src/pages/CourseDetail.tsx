// frontend/src/pages/CourseDetail.tsx

import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  Lock,
  PlayCircle,
  Unlock,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { getApiBase } from "@/services/api";

/* ============================================================
   TYPES
============================================================ */

type Lesson = {
  id: string;
  title: string;
  description?: string | null;
  durationMinutes?: number | null;
  position: number;
  isFreePreview: boolean;
  scheduledAt?: string | null;
};

type Module = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  overview?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  level?: string | null;
  duration?: string | null;
  estimatedHours?: number | null;
  priceCents?: number | null;
  currency?: string;
  isFree: boolean;
  unlockPercent?: number;
  instructorName?: string | null;
  instructorTitle?: string | null;
  instructorBio?: string | null;
  instructorImage?: string | null;
  objectives?: string[] | null;
  targetAudience?: string[] | null;
  requirements?: string[] | null;
  whatYouLearn?: string[] | null;
  modules: Module[];
};

type EnrollmentStatus = {
  enrolled: boolean;
  enrollment?: {
    id: string;
    paymentStatus: string;
    amountPaidCents: number;
    accessGranted: boolean;
  };
  totalPaid?: number;
  requiredCents?: number;
  remainingToUnlock?: number;
  accessGranted?: boolean;
};

/* ============================================================
   API HELPERS
============================================================ */

async function fetchCourse(slug: string): Promise<Course> {
  const res = await fetch(`${getApiBase()}/api/courses/${slug}`);
  if (!res.ok) throw new Error("Course not found");
  const data = await res.json();
  return data.course;
}

async function fetchEnrollment(
  courseId: string,
  email: string
): Promise<EnrollmentStatus> {
  const res = await fetch(
    `${getApiBase()}/api/courses/${courseId}/my-enrollment?email=${encodeURIComponent(email)}`
  );
  if (!res.ok) throw new Error("Failed to check enrollment");
  return res.json();
}

async function enrolInCourse(payload: {
  courseId: string;
  fullName: string;
  email: string;
  phone?: string;
}) {
  const res = await fetch(
    `${getApiBase()}/api/courses/${payload.courseId}/enrol`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Enrolment failed");
  }
  return res.json();
}

/* ============================================================
   HELPERS
============================================================ */

function formatPrice(cents?: number | null, currency = "KES") {
  if (cents == null || cents === 0) return "Free";
  return `${currency} ${(cents / 100).toLocaleString()}`;
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  return [];
}

/* ============================================================
   PAGE
============================================================ */

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState(
    () => localStorage.getItem("learner_email") || ""
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showEnrolForm, setShowEnrolForm] = useState(false);

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => fetchCourse(slug!),
    enabled: !!slug,
  });

  const {
    data: enrollmentStatus,
    isLoading: enrollmentLoading,
  } = useQuery({
    queryKey: ["enrollment", course?.id, email],
    queryFn: () => fetchEnrollment(course!.id, email),
    enabled: !!course?.id && !!email.trim(),
  });

  const enrolMutation = useMutation({
    mutationFn: enrolInCourse,
    onSuccess: (data) => {
      localStorage.setItem("learner_email", email.trim().toLowerCase());
      toast.success(
        data.alreadyEnrolled
          ? "You are already enrolled in this course."
          : "Enrolled successfully!"
      );
      setShowEnrolForm(false);
      queryClient.invalidateQueries({
        queryKey: ["enrollment", course?.id, email],
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Enrolment failed");
    },
  });

  const objectives = useMemo(
    () => asList(course?.objectives ?? course?.whatYouLearn),
    [course]
  );
  const requirements = useMemo(
    () => asList(course?.requirements),
    [course]
  );
  const audience = useMemo(
    () => asList(course?.targetAudience),
    [course]
  );

  const totalLessons = useMemo(() => {
    if (!course) return 0;
    return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  }, [course]);

  const handleEnrol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    if (!fullName.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    enrolMutation.mutate({
      courseId: course.id,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
    });
  };

  /* ============================================================
     LOADING / ERROR
  ============================================================ */

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5] pt-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
          <p className="text-sm text-gray-500">Loading course...</p>
        </div>
      </main>
    );
  }

  if (isError || !course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 pt-24">
        <div className="max-w-md text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
          <h1 className="mt-4 text-3xl font-bold text-[#2E1208]">
            Course not found
          </h1>
          <p className="mt-3 text-gray-500">
            The course you are looking for does not exist or is not published.
          </p>
          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2E1208]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>
        </div>
      </main>
    );
  }

  const accessGranted =
    course.isFree || enrollmentStatus?.accessGranted === true;
  const isEnrolled = enrollmentStatus?.enrolled === true;
  const remainingToUnlock = enrollmentStatus?.remainingToUnlock ?? 0;
  const requiredCents = enrollmentStatus?.requiredCents ?? 0;
  const totalPaid = enrollmentStatus?.totalPaid ?? 0;

  return (
    <main className="min-h-screen bg-white pt-24">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#F7F7F5] py-12 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#C17B4F]/10 blur-3xl" />
        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500"
          >
            <Link to="/" className="hover:text-[#C17B4F]">
              Home
            </Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-[#C17B4F]">
              Courses
            </Link>
            <span>/</span>
            <span className="font-medium text-[#2E1208]">{course.title}</span>
          </motion.nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-wider text-[#C17B4F]">
                {course.category && <span>{course.category}</span>}
                {course.level && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{course.level}</span>
                  </>
                )}
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#2E1208] sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  {course.subtitle}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {course.duration && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#C17B4F]" />
                    {course.duration}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-[#C17B4F]" />
                  {totalLessons} lessons
                </span>
                {course.instructorName && (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4 text-[#C17B4F]" />
                    {course.instructorName}
                  </span>
                )}
              </div>

              {course.description && (
                <p className="mt-7 max-w-2xl leading-8 text-gray-600">
                  {course.description}
                </p>
              )}
            </motion.div>

            {/* Right card — pricing / enrol */}
            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65 }}
              className="rounded-3xl border border-[#E8DDD4] bg-white p-6 shadow-xl sm:p-8"
            >
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="mb-5 aspect-[16/10] w-full rounded-2xl object-cover"
                />
              )}

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Course fee</p>
                  <p className="text-3xl font-bold text-[#2E1208]">
                    {formatPrice(course.priceCents, course.currency)}
                  </p>
                </div>
                {!course.isFree && (
                  <p className="rounded-full bg-[#F7F7F5] px-3 py-1 text-xs font-semibold text-[#C17B4F]">
                    Unlock at {course.unlockPercent ?? 50}%
                  </p>
                )}
              </div>

              {/* Access status */}
              {email && enrollmentLoading && (
                <p className="mt-4 text-sm text-gray-500">
                  Checking enrolment...
                </p>
              )}

              {isEnrolled && (
                <div className="mt-5 rounded-xl border border-gray-100 bg-[#F7F7F5] p-4">
                  {accessGranted ? (
                    <div className="flex items-start gap-3">
                      <Unlock className="mt-0.5 h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-emerald-700">
                          Access granted
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          You can open lessons and learning materials.
                        </p>
                        <Link
                          to={`/learn/${course.slug}`}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#C17B4F]"
                        >
                          Go to learning portal
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Lock className="mt-0.5 h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-semibold text-amber-800">
                          Access locked
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Paid:{" "}
                          <strong>
                            {formatPrice(totalPaid, course.currency)}
                          </strong>
                          {" · "}
                          Required:{" "}
                          <strong>
                            {formatPrice(requiredCents, course.currency)}
                          </strong>
                        </p>
                        {remainingToUnlock > 0 && (
                          <p className="mt-1 text-sm text-gray-600">
                            Remaining to unlock:{" "}
                            <strong>
                              {formatPrice(remainingToUnlock, course.currency)}
                            </strong>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enrol CTA */}
              {!isEnrolled && (
                <div className="mt-6">
                  {!showEnrolForm ? (
                    <button
                      type="button"
                      onClick={() => setShowEnrolForm(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C17B4F] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#A55E36]"
                    >
                      Enrol in this course
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <form onSubmit={handleEnrol} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C17B4F]"
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C17B4F]"
                      />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C17B4F]"
                      />
                      <button
                        type="submit"
                        disabled={enrolMutation.isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C17B4F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#A55E36] disabled:opacity-60"
                      >
                        {enrolMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enrolling...
                          </>
                        ) : (
                          "Confirm enrolment"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Returning learner email lookup */}
              {!email && isEnrolled === false && !showEnrolForm && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-gray-500">
                    Already enrolled? Enter your email to check access.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email"
                    onBlur={(e) => {
                      const v = e.target.value.trim().toLowerCase();
                      if (v) {
                        setEmail(v);
                        localStorage.setItem("learner_email", v);
                      }
                    }}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C17B4F]"
                  />
                </div>
              )}
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ======================================================
          WHAT YOU'LL LEARN + CURRICULUM
      ====================================================== */}

      <section className="py-14 sm:py-18 lg:py-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">

            {/* Left */}
            <div className="space-y-10">
              {objectives.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2E1208]">
                    What you will learn
                  </h2>
                  <div className="mt-5 space-y-3">
                    {objectives.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C17B4F]" />
                        <span className="text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {requirements.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2E1208]">
                    Requirements
                  </h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                    {requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {audience.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2E1208]">
                    Who this course is for
                  </h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                    {audience.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.overview && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2E1208]">
                    Course overview
                  </h2>
                  <p className="mt-4 leading-8 text-gray-600">
                    {course.overview}
                  </p>
                </div>
              )}
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-2xl font-bold text-[#2E1208]">
                Course curriculum
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {course.modules.length} modules · {totalLessons} lessons
              </p>

              <div className="mt-6 space-y-4">
                {course.modules.map((module) => (
                  <div
                    key={module.id}
                    className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#F7F7F5]"
                  >
                    <div className="border-b border-[#E8DDD4] bg-white px-5 py-4">
                      <h3 className="font-bold text-[#2E1208]">
                        {module.title}
                      </h3>
                      {module.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {module.description}
                        </p>
                      )}
                    </div>

                    <ul className="divide-y divide-[#E8DDD4]">
                      {module.lessons.map((lesson) => {
                        const locked =
                          !lesson.isFreePreview && !accessGranted;

                        return (
                          <li
                            key={lesson.id}
                            className="flex items-center justify-between gap-3 px-5 py-3.5"
                          >
                            <div className="flex items-start gap-3">
                              {locked ? (
                                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                              ) : (
                                <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C17B4F]" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-[#2E1208]">
                                  {lesson.title}
                                </p>
                                {lesson.isFreePreview && (
                                  <span className="text-xs font-semibold text-emerald-600">
                                    Free preview
                                  </span>
                                )}
                              </div>
                            </div>

                            {lesson.durationMinutes && (
                              <span className="shrink-0 text-xs text-gray-400">
                                {lesson.durationMinutes} min
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                {course.modules.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                    Curriculum will be published soon.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          BACK LINK
      ====================================================== */}

      <div className="border-t border-[#E8DDD4] py-10 text-center">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A1F0E] transition hover:text-[#C17B4F]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all courses
        </Link>
      </div>
    </main>
  );
}