// frontend/src/pages/admin/AdminCourses.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  Course,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  BookOpen,
  Layers,
  Users,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    priceCents: 0,
    isFree: false,
    isPublished: true,
    featured: false,
    unlockPercent: 50,
    thumbnailUrl: "",
    instructorName: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getAdminCourses();
      setCourses(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCourseId(null);
    setFormData({
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      category: "",
      level: "Beginner",
      duration: "",
      priceCents: 0,
      isFree: false,
      isPublished: true,
      featured: false,
      unlockPercent: 50,
      thumbnailUrl: "",
      instructorName: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourseId(course.id);
    setFormData({
      title: course.title || "",
      slug: course.slug || "",
      subtitle: course.subtitle || "",
      description: course.description || "",
      category: course.category || "",
      level: course.level || "Beginner",
      duration: course.duration || "",
      priceCents: course.priceCents || 0,
      isFree: course.isFree,
      isPublished: course.isPublished,
      featured: course.featured,
      unlockPercent: course.unlockPercent ?? 50,
      thumbnailUrl: course.thumbnailUrl || "",
      instructorName: course.instructorName || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Title and URL Slug are required.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingCourseId) {
        await updateCourse(editingCourseId, formData);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(formData);
        toast.success("Course created successfully!");
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully.");
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  const publishedCount = courses.filter((c) => c.isPublished).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER & STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E6E6] pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#222222]">
            Course Management
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Build curriculum, assign modules, and track enrolled students.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-[#B88A2A] hover:bg-[#A37722] text-white shadow-sm font-semibold text-xs px-4 py-2.5 rounded-lg"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </div>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#777777]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Courses
            </span>
            <GraduationCap className="h-4 w-4 text-[#B88A2A]" />
          </div>
          <p className="text-2xl font-extrabold text-[#222222] mt-2">
            {courses.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#777777]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Live Published
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#222222] mt-2">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#777777]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Draft Mode
            </span>
            <XCircle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#222222] mt-2">
            {courses.length - publishedCount}
          </p>
        </div>
      </div>

      {/* COURSE CARDS GRID */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E6E6E6]">
          <BookOpen className="h-12 w-12 text-[#B88A2A] mx-auto mb-3 opacity-50" />
          <p className="text-gray-600 font-medium">No courses created yet.</p>
          <Button onClick={handleOpenCreate} variant="outline" className="mt-4">
            Create First Course
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-[#E6E6E6] overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* THUMBNAIL */}
                <div className="relative h-44 bg-[#F3EBE0]">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="h-10 w-10 text-[#B88A2A] opacity-40" />
                    </div>
                  )}

                  <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full backdrop-blur-md ${
                      course.isPublished
                        ? "bg-emerald-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    }`}
                  >
                    {course.isPublished ? "Live" : "Draft"}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B88A2A]">
                    {course.category || "General"}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#222222] line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {course.subtitle || course.description}
                  </p>
                </div>
              </div>

              {/* ACTION TOOLBAR (Absolute paths to prevent public redirect) */}
              <div className="p-5 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Link to={`/admin/courses/${course.id}/builder`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold border-gray-200 hover:bg-[#F3EBE0]/50"
                    >
                      <Layers className="h-3.5 w-3.5 mr-1 text-[#B88A2A]" /> Builder
                    </Button>
                  </Link>
                  <Link to={`/admin/courses/${course.id}/enrollments`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold border-gray-200 hover:bg-[#F3EBE0]/50"
                    >
                      <Users className="h-3.5 w-3.5 mr-1 text-[#B88A2A]" /> Students
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                  <span className="font-bold text-[#222222]">
                    {course.isFree
                      ? "Free"
                      : `KES ${((course.priceCents || 0) / 100).toLocaleString()}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(course)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 border border-gray-100">
            <h2 className="text-xl font-bold font-heading text-[#222222] mb-4">
              {editingCourseId ? "Edit Course Parameters" : "Create New Course"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Course Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Masterclass in Technical Writing"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">URL Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. technical-writing-masterclass"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Subtitle</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short engaging tagline"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  placeholder="Overview of syllabus, prerequisites, and outcomes..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Writing / Business"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Difficulty Level</Label>
                  <Input
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="Beginner / Intermediate"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Duration</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="4 Weeks / 12 Hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Price (KES)</Label>
                  <Input
                    type="number"
                    value={formData.priceCents / 100}
                    onChange={(e) => setFormData({ ...formData, priceCents: Number(e.target.value) * 100 })}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Instructor Name</Label>
                  <Input
                    value={formData.instructorName}
                    onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Thumbnail Image URL</Label>
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-gray-300 text-[#B88A2A]"
                  />
                  <span>Publish Live</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                    className="rounded border-gray-300 text-[#B88A2A]"
                  />
                  <span>Free Access</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-[#B88A2A] hover:bg-[#A37722] text-white">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCourseId ? "Save Changes" : "Create Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}