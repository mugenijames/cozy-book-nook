// frontend/src/pages/CourseLearn.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPublicCourseBySlug,
  getProtectedLesson,
  Course,
  Lesson,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Lock,
  PlayCircle,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function CourseLearn() {
  const { slug } = useParams<{ slug: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeLessonData, setActiveLessonData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Student email from local storage or prompt
  const [learnerEmail, setLearnerEmail] = useState(
    () => localStorage.getItem("learner_email") || ""
  );

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await getPublicCourseBySlug(slug!);
      setCourse(data);

      // Automatically select the first published lesson
      const firstLesson = data.modules
        ?.flatMap((m) => m.lessons)
        ?.find((l) => l.isPublished);

      if (firstLesson) {
        selectLesson(data.id, firstLesson);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  const selectLesson = async (courseId: string, lesson: Lesson) => {
    setActiveLesson(lesson);
    setAccessDenied(null);

    if (!learnerEmail && !lesson.isFreePreview) {
      setAccessDenied("Please log in with your enrolled email to access locked lessons.");
      return;
    }

    try {
      setLessonLoading(true);
      const data = await getProtectedLesson(courseId, lesson.id, learnerEmail);
      setActiveLessonData(data);
    } catch (err: any) {
      setAccessDenied(err.message || "Access denied. Ensure your enrollment payment threshold is met.");
      setActiveLessonData(null);
    } finally {
      setLessonLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#1A1A1A] text-white p-4">
        <h1 className="text-2xl font-bold">Course Not Found</h1>
        <Link to="/courses" className="mt-4">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#141414] text-gray-100 overflow-hidden">
      {/* SIDEBAR TOGGLE (MOBILE) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#262626] rounded-lg shadow-lg text-white"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* SYLLABUS SIDEBAR */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-[#1E1E1E] border-r border-[#2D2D2D] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-[#2D2D2D] flex items-center justify-between">
          <Link
            to={`/courses/${course.slug}`}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#C17B4F] transition"
          >
            <ArrowLeft className="h-4 w-4" /> Course Overview
          </Link>
        </div>

        <div className="p-4 border-b border-[#2D2D2D]">
          <h2 className="font-bold text-sm text-white line-clamp-1">{course.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Learner: <span className="text-emerald-400">{learnerEmail || "Guest / Preview"}</span>
          </p>
        </div>

        {/* MODULE & LESSON LIST */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2A2A2A]">
          {course.modules?.map((module, mIdx) => (
            <div key={module.id} className="py-2">
              <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                Module {mIdx + 1}: {module.title}
              </div>
              <div className="space-y-0.5">
                {module.lessons?.map((lesson) => {
                  const isSelected = activeLesson?.id === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(course.id, lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs transition ${
                        isSelected
                          ? "bg-[#C17B4F]/20 text-[#C17B4F] font-semibold border-r-2 border-[#C17B4F]"
                          : "text-gray-300 hover:bg-[#262626]"
                      }`}
                    >
                      {lesson.isFreePreview ? (
                        <PlayCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      )}
                      <span className="line-clamp-1 flex-1">{lesson.title}</span>
                      {lesson.durationMinutes && (
                        <span className="text-[10px] text-gray-500">{lesson.durationMinutes}m</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT / LESSON VIEWER */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-[#141414]">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-6">
            <div className="border-b border-[#2A2A2A] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C17B4F]">
                {activeLesson.isFreePreview ? "Free Preview Lesson" : "Protected Lesson"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {activeLesson.title}
              </h1>
            </div>

            {lessonLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
              </div>
            ) : accessDenied ? (
              <div className="rounded-2xl bg-[#221B18] border border-[#593122] p-8 text-center space-y-4">
                <Lock className="h-12 w-12 text-[#C17B4F] mx-auto" />
                <h3 className="text-lg font-bold text-white">Lesson Locked</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">{accessDenied}</p>
                <Link to={`/courses/${course.slug}`}>
                  <Button className="bg-[#C17B4F] hover:bg-[#A55E36] text-white mt-2">
                    Complete Enrollment & Unlock
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* VIDEO PLAYER EMBED */}
                {activeLessonData?.videoUrl && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#2D2D2D] shadow-2xl">
                    <iframe
                      src={activeLessonData.videoUrl}
                      title={activeLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* LESSON TEXT CONTENT */}
                {activeLessonData?.content && (
                  <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed bg-[#1E1E1E] p-6 rounded-2xl border border-[#2D2D2D]">
                    {activeLessonData.content}
                  </div>
                )}

                {/* LESSON PDF MATERIAL */}
                {activeLessonData?.pdfUrl && (
                  <div className="flex items-center justify-between p-4 bg-[#1E1E1E] rounded-xl border border-[#2D2D2D]">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-[#C17B4F]" />
                      <div>
                        <p className="text-sm font-semibold text-white">Lesson Resource (PDF)</p>
                        <p className="text-xs text-gray-400">Download course reading material</p>
                      </div>
                    </div>
                    <a
                      href={activeLessonData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#C17B4F] bg-[#C17B4F]/10 px-3 py-2 rounded-lg hover:bg-[#C17B4F]/20 transition"
                    >
                      Download PDF
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a lesson from the syllabus to start learning.
          </div>
        )}
      </main>
    </div>
  );
}