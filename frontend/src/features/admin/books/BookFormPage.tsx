// src/components/admin/BookFormPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, X, ImagePlus } from "lucide-react";
import { createBook, updateBook, getBook } from "@/services/api";


// Zod schema (unchanged)
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  genre: z.string().optional(),
  coverImage: z.string().url().optional(),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional(),
  pages: z.number().int().positive().optional(),
  rating: z.number().min(0).max(5).optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

export default function BookFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      genre: "",
      coverImage: "",
      publishedYear: undefined,
      pages: undefined,
      rating: 0,
    },
  });

  // Fetch book data if editing
  useEffect(() => {
    if (isEdit && id) {
      const fetchBook = async () => {
        try {
          const book = await getBook(id);
          form.reset(book);
          if (book.coverImage) {
            setCoverPreview(book.coverImage);
            form.setValue("coverImage", book.coverImage);
          }
        } catch (err) {
          toast.error("Failed to load book details");
        }
      };
      fetchBook();
    }
  }, [id, isEdit, form]);

  // Inside handleImageUpload in BookFormPage.tsx
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('cover', file); // Ensure the key is 'cover'

    try {
      const response = await fetch("http://localhost:5000/api/upload-cover", {
        method: "POST",
        body: formData,
        // DO NOT SET 'Content-Type' here!
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      console.log("Success:", data.url);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };
  const removeCoverImage = () => {
    setCoverPreview(null);
    form.setValue("coverImage", null);
  };

  const onSubmit = async (data: BookFormData) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateBook(id, data);
        toast.success("Book updated successfully");
      } else {
        await createBook(data);
        toast.success("Book created successfully");
      }
      navigate("/admin/books");
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? "Edit Book" : "Add New Book"}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? "Update book details" : "Create a new book entry"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div className="grid gap-2">
              <Label htmlFor="author">Author *</Label>
              <Input id="author" {...form.register("author")} />
              {form.formState.errors.author && (
                <p className="text-sm text-red-600">{form.formState.errors.author.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...form.register("description")} />
            </div>

            {/* Genre */}
            <div className="grid gap-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" {...form.register("genre")} />
            </div>

            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                {/* Preview area */}
                <div className="relative h-48 w-36 overflow-hidden rounded-lg border bg-muted">
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={removeCoverImage}
                        disabled={uploadingImage || loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImagePlus className="h-10 w-10" />
                    </div>
                  )}
                </div>

                {/* Upload controls */}
                <div className="flex-1 space-y-3">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={uploadingImage || loading}
                  />
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </div>
                  )}
                  {/* Hidden field for URL */}
                  <Input type="hidden" {...form.register("coverImage")} />
                  {form.formState.errors.coverImage && (
                    <p className="text-sm text-red-600">{form.formState.errors.coverImage.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Published Year & Pages */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publishedYear">Published Year</Label>
                <Input
                  id="publishedYear"
                  type="number"
                  {...form.register("publishedYear", { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  {...form.register("pages", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Rating */}
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...form.register("rating", { valueAsNumber: true })}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/books")}
                disabled={loading || uploadingImage}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingImage}>
                {loading ? "Saving..." : isEdit ? "Update Book" : "Create Book"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}