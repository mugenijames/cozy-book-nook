// frontend/src/pages/CourseDetail.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react"
import { getPublicCourseBySlug, Course } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileText,
  User,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import CoursePaymentModal from "@/components/CoursePaymentModal";

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    if (slug) fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await getPublicCourseBySlug(slug!);
      setCourse(data);
    } catch {
      // Fallback or error handled via state
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="h-9 w-9 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold font-heading text-[#2E1208]">
          Course Not Found
        </h1>
        <p className="mt-2 text-gray-600">
          The course you are looking for might have been moved or unpublished.
        </p>
        <Button
          onClick={() => navigate("/courses")}
          className="mt-6 bg-[#C17B4F] hover:bg-[#A55E36] text-white"
        >
          Explore All Courses
        </Button>
      </div>
    );
  }

  const totalLessons =
    course.modules?.reduce(
      (acc, m) => acc + (m.lessons?.length || 0),
      0
    ) || 0;

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative border-b border-[#EADFCF] bg-[#2E1208] py-16 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C17B4F_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* HERO CONTENT */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#C17B4F]/20 px-3 py-1 text-xs font-semibold text-[#E2A078] border border-[#C17B4F]/30">
                  {course.category || "General"}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">
                  {course.level || "All Levels"}
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  {course.subtitle}
                </p>
              )}

              {/* METADATA PILLS */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-gray-300 border-t border-white/10">
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#C17B4F]" />
                    <span>{course.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#C17B4F]" />
                  <span>{totalLessons} Lessons</span>
                </div>
                {course.instructorName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#C17B4F]" />
                    <span>Instructor: {course.instructorName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* FLOATING ACTION CARD */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-2xl text-white">
                {course.thumbnailUrl && (
                  <div className="relative mb-6 overflow-hidden rounded-2xl aspect-video border border-white/10">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="mb-6 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Course Fee
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-white">
                      {course.isFree
                        ? "Free"
                        : `KES ${((course.priceCents || 0) / 100).toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full bg-[#C17B4F] hover:bg-[#A55E36] text-white py-6 text-base font-bold rounded-xl shadow-lg shadow-[#C17B4F]/25 transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Enroll Now & Start Learning
                </Button>

                <div className="mt-6 space-y-3 text-xs text-gray-300 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Instant access to preview lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Certificate of completion included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSE BODY */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* SYLLABUS & OVERVIEW */}
          <div className="lg:col-span-8 space-y-12">
            {/* OVERVIEW */}
            {course.description && (
              <div className="rounded-3xl bg-white p-8 border border-[#EADFCF] shadow-sm space-y-4">
                <h2 className="font-heading text-2xl font-bold text-[#2E1208]">
                  About This Course
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {course.description}
                </p>
              </div>
            )}

            {/* CURRICULUM */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[#2E1208]">
                    Course Curriculum
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.modules?.length || 0} Modules • {totalLessons}{" "}
                    Lessons
                  </p>
                </div>
              </div>

              {!course.modules || course.modules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500 bg-white">
                  Syllabus is currently being finalized. Check back soon!
                </div>
              ) : (
                <div className="space-y-4">
                  {course.modules.map((module, mIdx) => (
                    <div
                      key={module.id}
                      className="rounded-2xl border border-[#EADFCF] bg-white overflow-hidden shadow-sm"
                    >
                      {/* MODULE HEADER */}
                      <div className="bg-[#F3EBE0]/50 px-6 py-4 border-b border-[#EADFCF] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C17B4F]">
                            Module {mIdx + 1}
                          </span>
                          <h3 className="font-heading font-bold text-base text-[#2E1208]">
                            {module.title}
                          </h3>
                        </div>
                        <span className="text-xs font-semibold text-gray-500 bg-white/80 px-2.5 py-1 rounded-full border border-gray-200">
                          {module.lessons?.length || 0} lessons
                        </span>
                      </div>

                      {/* LESSON LIST */}
                      <div className="divide-y divide-gray-100">
                        {module.lessons?.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/80 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-gray-400 w-6">
                                {mIdx + 1}.{lIdx + 1}
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-[#2E1208]">
                                  {lesson.title}
                                </p>
                                {lesson.durationMinutes && (
                                  <span className="text-xs text-gray-400">
                                    {lesson.durationMinutes} mins
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              {lesson.isFreePreview ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                                  <PlayCircle className="h-3.5 w-3.5" />
                                  Free Preview
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                                  <Lock className="h-3 w-3" />
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT / ENROLLMENT MODAL */}
      {isPaymentOpen && (
        <CoursePaymentModal
          course={course}
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}
    </div>
  );
}