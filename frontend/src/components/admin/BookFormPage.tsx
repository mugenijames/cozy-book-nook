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
import { createBook, updateBook, getBook } from "@/services/api";


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

  useEffect(() => {
    if (isEdit && id) {
      const fetchBook = async () => {
        try {
          const book = await getBook(id);
          form.reset(book);
          if (book.coverImage) setCoverPreview(book.coverImage);
        } catch (err) {
          toast.error("Failed to load book");
        }
      };
      fetchBook();
    }
  }, [id, isEdit, form]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // TODO: Upload file → get real URL → set form value
    // For now we just show preview
    // Later replace with Vercel Blob / Cloudinary upload
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

            {/* Cover Image */}
            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {coverPreview && (
                <div className="mt-2">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-48 w-auto object-cover rounded-md border"
                  />
                </div>
              )}
              {/* Hidden input for URL */}
              <Input type="hidden" {...form.register("coverImage")} />
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
              <Button type="button" variant="outline" onClick={() => navigate("/admin/books")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEdit ? "Update Book" : "Create Book"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}