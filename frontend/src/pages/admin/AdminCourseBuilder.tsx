// frontend/src/pages/admin/AdminCourseBuilder.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  apiFetch,
  createCourseModule,
  createModuleLesson,
  Course,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, ArrowLeft, Layers } from "lucide-react";
import { toast } from "sonner";

export default function AdminCourseBuilder() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Module modal state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");

  // Lesson modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    pdfUrl: "",
    durationMinutes: 10,
    isFreePreview: false,
    isPublished: true,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      // Fetch admin view of courses or individual course details
      const data = await apiFetch<{ success: boolean; courses: Course[] }>("/api/courses/admin/all");
      const current = data.courses?.find((c) => c.id === courseId);
      if (current) {
        setCourse(current);
      } else {
        toast.error("Course not found");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !moduleTitle.trim()) return;

    try {
      setSubmitting(true);
      await createCourseModule(courseId, {
        title: moduleTitle.trim(),
        description: moduleDesc.trim() || undefined,
        position: course?.modules?.length || 0,
      });
      toast.success("Module added successfully!");
      setIsModuleModalOpen(false);
      setModuleTitle("");
      setModuleDesc("");
      fetchCourseDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to create module");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId || !lessonData.title.trim()) return;

    try {
      setSubmitting(true);
      await createModuleLesson(selectedModuleId, {
        ...lessonData,
        durationMinutes: Number(lessonData.durationMinutes),
      });
      toast.success("Lesson added successfully!");
      setIsLessonModalOpen(false);
      setLessonData({
        title: "",
        description: "",
        content: "",
        videoUrl: "",
        pdfUrl: "",
        durationMinutes: 10,
        isFreePreview: false,
        isPublished: true,
      });
      fetchCourseDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to create lesson");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-[#2E1208]">Course Not Found</h1>
        <Link to="/admin/courses" className="mt-4 inline-block">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin/courses" className="text-xs font-semibold text-gray-500 hover:text-[#C17B4F] flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Courses
          </Link>
          <h1 className="text-3xl font-bold font-heading text-[#2E1208]">{course.title} — Syllabus Builder</h1>
          <p className="text-gray-600 text-sm mt-1">Organize your course into modules and structured lessons.</p>
        </div>
        <Button onClick={() => setIsModuleModalOpen(true)} className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Module
        </Button>
      </div>

      {/* MODULES & LESSONS LIST */}
      {(!course.modules || course.modules.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Layers className="h-12 w-12 text-[#C17B4F] mx-auto mb-3 opacity-60" />
          <p className="text-gray-600 font-medium">No modules created for this course yet.</p>
          <Button onClick={() => setIsModuleModalOpen(true)} variant="outline" className="mt-4">
            Create First Module
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {course.modules.map((module, mIdx) => (
            <div key={module.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-[#F3EBE0]/60 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C17B4F]">Module {mIdx + 1}</span>
                  <h3 className="font-heading font-bold text-lg text-[#2E1208]">{module.title}</h3>
                  {module.description && <p className="text-xs text-gray-600 mt-0.5">{module.description}</p>}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedModuleId(module.id);
                    setIsLessonModalOpen(true);
                  }}
                  className="bg-white hover:bg-gray-50"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Lesson
                </Button>
              </div>

              {/* LESSONS */}
              <div className="divide-y divide-gray-100">
                {(!module.lessons || module.lessons.length === 0) ? (
                  <p className="px-6 py-4 text-xs text-gray-400 italic">No lessons in this module yet.</p>
                ) : (
                  module.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-6">{mIdx + 1}.{lIdx + 1}</span>
                        <div>
                          <p className="text-sm font-semibold text-[#2E1208]">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                            {lesson.durationMinutes && <span>{lesson.durationMinutes} mins</span>}
                            {lesson.isFreePreview && (
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium text-[10px]">
                                Free Preview
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODULE MODAL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold font-heading text-[#2E1208] mb-4">Add Course Module</h2>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div className="space-y-1">
                <Label>Module Title *</Label>
                <Input
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g. Introduction & Setup"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Summary of what this module covers..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModuleModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Module
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LESSON MODAL */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8">
            <h2 className="text-xl font-bold font-heading text-[#2E1208] mb-4">Add Lesson to Module</h2>
            <form onSubmit={handleCreateLesson} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-1">
                <Label>Lesson Title *</Label>
                <Input
                  value={lessonData.title}
                  onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                  placeholder="e.g. Installing Node.js & Prisma"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Short Description</Label>
                <Input
                  value={lessonData.description}
                  onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                  placeholder="Brief summary..."
                />
              </div>

              <div className="space-y-1">
                <Label>Lesson Text Content / Markdown</Label>
                <textarea
                  value={lessonData.content}
                  onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Main lesson text content..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Video Embed URL</Label>
                  <Input
                    value={lessonData.videoUrl}
                    onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
                <div className="space-y-1">
                  <Label>PDF Resource URL</Label>
                  <Input
                    value={lessonData.pdfUrl}
                    onChange={(e) => setLessonData({ ...lessonData, pdfUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Duration (Minutes)</Label>
                  <Input
                    type="number"
                    value={lessonData.durationMinutes}
                    onChange={(e) => setLessonData({ ...lessonData, durationMinutes: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lessonData.isFreePreview}
                    onChange={(e) => setLessonData({ ...lessonData, isFreePreview: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Free Preview Lesson</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsLessonModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Lesson
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}