import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  FileText,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  tags: unknown;
  author: string | null;
  readingTime: string | null;
  published: boolean;
  featured: boolean;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
};

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
  author: string;
  readingTime: string;
  published: boolean;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
};

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "",
  tags: "",
  author: "",
  readingTime: "",
  published: false,
  featured: false,
  seoTitle: "",
  seoDescription: "",
};

function getApiBase() {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000"
  ).replace(/\/+$/, "");
}

function getToken() {
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error || "Something went wrong. Please try again."
    );
  }

  return data as T;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tagsToString(tags: unknown) {
  if (Array.isArray(tags)) {
    return tags.join(", ");
  }

  if (typeof tags === "string") {
    return tags;
  }

  return "";
}

export default function AdminBlog() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const data = await apiRequest<{
        success: boolean;
        blogs: BlogPost[];
      }>("/api/blogs/admin/all");

      return data.blogs || [];
    },
  });

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.slug.toLowerCase().includes(query) ||
        String(blog.category || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && blog.published) ||
        (statusFilter === "draft" && !blog.published);

      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, statusFilter]);

  const createMutation = useMutation({
    mutationFn: async (payload: BlogForm) => {
      return apiRequest("/api/blogs/admin", {
        method: "POST",
        body: JSON.stringify({
          title: payload.title,
          slug: payload.slug,
          excerpt: payload.excerpt || null,
          content: payload.content,
          coverImage: payload.coverImage || null,
          category: payload.category || null,
          tags: payload.tags
            ? payload.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : null,
          author: payload.author || user?.name || null,
          readingTime: payload.readingTime || null,
          published: payload.published,
          featured: payload.featured,
          seoTitle: payload.seoTitle || null,
          seoDescription: payload.seoDescription || null,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog post created successfully.");
      closeEditor();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: BlogForm;
    }) => {
      return apiRequest(`/api/blogs/admin/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: payload.title,
          slug: payload.slug,
          excerpt: payload.excerpt || null,
          content: payload.content,
          coverImage: payload.coverImage || null,
          category: payload.category || null,
          tags: payload.tags
            ? payload.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : null,
          author: payload.author || null,
          readingTime: payload.readingTime || null,
          published: payload.published,
          featured: payload.featured,
          seoTitle: payload.seoTitle || null,
          seoDescription: payload.seoDescription || null,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog post updated successfully.");
      closeEditor();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/blogs/admin/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog post deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/blogs/admin/${id}/publish`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Publication status updated.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function openCreate() {
    setEditingBlog(null);
    setForm(emptyForm);
    setEditorOpen(true);
  }

  function openEdit(blog: BlogPost) {
    setEditingBlog(blog);

    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content,
      coverImage: blog.coverImage || "",
      category: blog.category || "",
      tags: tagsToString(blog.tags),
      author: blog.author || "",
      readingTime: blog.readingTime || "",
      published: blog.published,
      featured: blog.featured,
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
    });

    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditingBlog(null);
    setForm(emptyForm);
  }

  function updateField<K extends keyof BlogForm>(
    field: K,
    value: BlogForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug:
        editingBlog && current.slug
          ? current.slug
          : slugify(value),
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a blog title.");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Please enter a blog slug.");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Please enter the blog content.");
      return;
    }

    if (editingBlog) {
      updateMutation.mutate({
        id: editingBlog.id,
        payload: form,
      });
    } else {
      createMutation.mutate(form);
    }
  }

  function handleDelete(blog: BlogPost) {
    const confirmed = window.confirm(
      `Delete "${blog.title}"?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      deleteMutation.mutate(blog.id);
    }
  }

  const publishedCount = blogs.filter((blog) => blog.published).length;
  const draftCount = blogs.filter((blog) => !blog.published).length;
  const featuredCount = blogs.filter((blog) => blog.featured).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-3xl bg-[#2E1208] p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 px-3 py-1.5 text-xs font-semibold text-[#E8C66A]">
              <FileText className="h-4 w-4" />
              Content management
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Blog Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              Create, edit and publish articles for the David Emuria
              audience.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A017] px-5 py-3 text-sm font-bold text-[#2E1208] shadow-lg transition hover:bg-[#E8C66A]"
          >
            <Plus className="h-4 w-4" />
            New blog post
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A8777]">
            Total posts
          </p>
          <p className="mt-2 text-2xl font-semibold text-[#2E1208]">
            {blogs.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A8777]">
            Published
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A8777]">
            Drafts
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-700">
            {draftCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A8777]">
            Featured
          </p>
          <p className="mt-2 text-2xl font-semibold text-[#C17B4F]">
            {featuredCount}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E8DDD4] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A8777]" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, slug or category..."
              className="w-full rounded-xl border border-[#E8DDD4] bg-[#FCFAF7] py-3 pl-10 pr-4 text-sm text-[#2E1208] outline-none transition focus:border-[#C17B4F]"
            />
          </div>

          <div className="flex rounded-xl border border-[#E8DDD4] bg-[#FCFAF7] p-1">
            {[
              ["all", "All"],
              ["published", "Published"],
              ["draft", "Drafts"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    value as "all" | "published" | "draft"
                  )
                }
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  statusFilter === value
                    ? "bg-[#2E1208] text-white"
                    : "text-[#8B7355] hover:text-[#2E1208]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#E8DDD4] border-t-[#C17B4F]" />
              <p className="text-sm text-[#8B7355]">
                Loading blog posts...
              </p>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <div className="rounded-2xl bg-[#F7F3EE] p-4 text-[#C17B4F]">
              <FileText className="h-7 w-7" />
            </div>

            <h2 className="mt-4 font-semibold text-[#2E1208]">
              No blog posts found
            </h2>

            <p className="mt-1 max-w-md text-sm text-[#8B7355]">
              Create your first article or adjust your search filters.
            </p>

            <button
              type="button"
              onClick={openCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2E1208] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Create post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FCFAF7] text-left text-xs uppercase tracking-wide text-[#9A8777]">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Article
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Category
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Views
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEE5DE]">
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="transition hover:bg-[#FCFAF7]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-[260px] items-center gap-3">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt=""
                            className="h-12 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-[#F7F3EE] text-[#C17B4F]">
                            <FileText className="h-5 w-5" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-semibold text-[#2E1208]">
                              {blog.title}
                            </p>

                            {blog.featured && (
                              <Star className="h-3.5 w-3.5 shrink-0 fill-[#D4A017] text-[#D4A017]" />
                            )}
                          </div>

                          <p className="mt-1 truncate text-xs text-[#9A8777]">
                            /{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-[#6E5A4C]">
                      {blog.category || "Uncategorized"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          blog.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[#6E5A4C]">
                      {blog.views ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title={
                            blog.published
                              ? "Unpublish"
                              : "Publish"
                          }
                          onClick={() =>
                            publishMutation.mutate(blog.id)
                          }
                          disabled={publishMutation.isPending}
                          className="rounded-lg border border-[#E8DDD4] p-2 text-[#6E5A4C] transition hover:border-[#C17B4F] hover:text-[#C17B4F] disabled:opacity-50"
                        >
                          {blog.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() => openEdit(blog)}
                          className="rounded-lg border border-[#E8DDD4] p-2 text-[#6E5A4C] transition hover:border-[#C17B4F] hover:text-[#C17B4F]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() => handleDelete(blog)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg border border-[#E8DDD4] p-2 text-[#6E5A4C] transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editorOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#2E1208]/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="mx-auto my-4 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl sm:my-8">
            <div className="flex items-center justify-between border-b border-[#E8DDD4] px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C17B4F]">
                  {editingBlog ? "Edit article" : "New article"}
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#2E1208]">
                  {editingBlog
                    ? "Update blog post"
                    : "Create blog post"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                className="rounded-xl p-2 text-[#8B7355] hover:bg-[#F7F3EE]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6 p-5 sm:p-7">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Title *
                    </label>

                    <input
                      value={form.title}
                      onChange={(event) =>
                        handleTitleChange(event.target.value)
                      }
                      placeholder="Enter article title"
                      className="w-full rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Slug *
                    </label>

                    <input
                      value={form.slug}
                      onChange={(event) =>
                        updateField(
                          "slug",
                          slugify(event.target.value)
                        )
                      }
                      placeholder="article-slug"
                      className="w-full rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Category
                    </label>

                    <input
                      value={form.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      placeholder="Leadership"
                      className="w-full rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Author
                    </label>

                    <input
                      value={form.author}
                      onChange={(event) =>
                        updateField("author", event.target.value)
                      }
                      placeholder={user?.name || "Author name"}
                      className="w-full rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Reading time
                    </label>

                    <input
                      value={form.readingTime}
                      onChange={(event) =>
                        updateField(
                          "readingTime",
                          event.target.value
                        )
                      }
                      placeholder="5 min read"
                      className="w-full rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Cover image URL
                    </label>

                    <input
                      value={form.coverImage}
                      onChange={(event) =>
                        updateField(
                          "coverImage",
                          event.target.value
                        )
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Excerpt
                    </label>

                    <textarea
                      value={form.excerpt}
                      onChange={(event) =>
                        updateField("excerpt", event.target.value)
                      }
                      rows={3}
                      placeholder="A short introduction to the article..."
                      className="w-full resize-y rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Content *
                    </label>

                    <textarea
                      value={form.content}
                      onChange={(event) =>
                        updateField("content", event.target.value)
                      }
                      rows={14}
                      placeholder="Write your article content here..."
                      className="w-full resize-y rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm leading-6 outline-none focus:border-[#C17B4F]"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                      Tags
                    </label>

                    <input
                      value={form.tags}
                      onChange={(event) =>
                        updateField("tags", event.target.value)
                      }
                      placeholder="leadership, purpose, faith"
                      className="w-full rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                    />

                    <p className="mt-1 text-xs text-[#9A8777]">
                      Separate tags with commas.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E8DDD4] bg-[#FCFAF7] p-5">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#9A8777]">
                    Publication
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(event) =>
                          updateField(
                            "published",
                            event.target.checked
                          )
                        }
                        className="mt-1 h-4 w-4 accent-[#C17B4F]"
                      />

                      <span>
                        <span className="block text-sm font-semibold text-[#2E1208]">
                          Publish article
                        </span>
                        <span className="mt-1 block text-xs text-[#8B7355]">
                          Make this article visible on the public
                          website.
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(event) =>
                          updateField(
                            "featured",
                            event.target.checked
                          )
                        }
                        className="mt-1 h-4 w-4 accent-[#C17B4F]"
                      />

                      <span>
                        <span className="block text-sm font-semibold text-[#2E1208]">
                          Featured article
                        </span>
                        <span className="mt-1 block text-xs text-[#8B7355]">
                          Mark this article as featured content.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#9A8777]">
                    Search engine optimization
                  </p>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                        SEO title
                      </label>

                      <input
                        value={form.seoTitle}
                        onChange={(event) =>
                          updateField(
                            "seoTitle",
                            event.target.value
                          )
                        }
                        placeholder="SEO page title"
                        className="w-full rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5C4436]">
                        SEO description
                      </label>

                      <textarea
                        value={form.seoDescription}
                        onChange={(event) =>
                          updateField(
                            "seoDescription",
                            event.target.value
                          )
                        }
                        rows={3}
                        placeholder="Search engine description..."
                        className="w-full resize-y rounded-xl border border-[#E8DDD4] px-4 py-3 text-sm outline-none focus:border-[#C17B4F]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E8DDD4] bg-[#FCFAF7] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-xl border border-[#E8DDD4] px-5 py-3 text-sm font-semibold text-[#5C4436] hover:bg-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E1208] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#452014] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />

                  {createMutation.isPending ||
                  updateMutation.isPending
                    ? "Saving..."
                    : editingBlog
                    ? "Save changes"
                    : "Create post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}