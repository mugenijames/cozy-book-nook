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
import { Loader2, Plus, Edit, Trash2, CheckCircle, XCircle, BookOpen, Layers, Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal / Form state
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
      toast.error(err.message || "Failed to load admin courses");
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
      toast.error("Title and Slug are required.");
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
      toast.success("Course deleted.");
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[#2E1208]">Manage Courses</h1>
          <p className="text-gray-600 text-sm mt-1">Create, edit, and publish learning programs for students.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <BookOpen className="h-12 w-12 text-[#C17B4F] mx-auto mb-3 opacity-60" />
          <p className="text-gray-600 font-medium">No courses found in the system.</p>
          <Button onClick={handleOpenCreate} variant="outline" className="mt-4">
            Create Your First Course
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-[#F3EBE0] flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-[#C17B4F]" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C17B4F]">
                      {course.category || "General"}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${course.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {course.isPublished ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-lg text-[#2E1208]">{course.title}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.subtitle || course.description}</p>
                </div>
              </div>

              <div className="px-5 pb-4 space-y-3">
                {/* BUILDER & ENROLLMENTS QUICK LINKS */}
                <div className="grid grid-cols-2 gap-2">
                  <Link to={`/admin/courses/${course.id}/builder`}>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Layers className="h-3.5 w-3.5 mr-1" /> Builder
                    </Button>
                  </Link>
                  <Link to={`/admin/courses/${course.id}/enrollments`}>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Users className="h-3.5 w-3.5 mr-1" /> Enrollments
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-bold text-[#2E1208]">
                    {course.isFree ? "Free" : `KES ${(course.priceCents || 0) / 100}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(course)}>
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT COURSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <h2 className="text-xl font-bold font-heading text-[#2E1208] mb-4">
              {editingCourseId ? "Edit Course" : "Create New Course"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Course Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Advanced TypeScript"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>URL Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. advanced-typescript"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Subtitle</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short catchy tagline"
                />
              </div>

              <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Full course overview..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Programming"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Level</Label>
                  <Input
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="Beginner / Advanced"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Duration</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 4 Weeks"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Price (in KES)</Label>
                  <Input
                    type="number"
                    value={formData.priceCents / 100}
                    onChange={(e) => setFormData({ ...formData, priceCents: Number(e.target.value) * 100 })}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Instructor Name</Label>
                  <Input
                    value={formData.instructorName}
                    onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                    placeholder="Instructor Full Name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Thumbnail Image URL</Label>
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Publish live on site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Free Course</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Featured Course</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCourseId ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}