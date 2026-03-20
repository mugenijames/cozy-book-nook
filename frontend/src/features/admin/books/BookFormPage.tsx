// src/features/admin/books/BookFormPage.tsx
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
import { useAuth } from "@/contexts/AuthContext";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  genre: z.string().optional(),
  coverImage: z.string().optional(),
  publishedYear: z.number().int().optional(),
  pages: z.number().int().positive().optional(),
  rating: z.number().min(0).max(5).optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

export default function BookFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, isAdmin, logout } = useAuth();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Set bypass auth flag for testing
  const BYPASS_AUTH = true; // Set to false when backend auth is ready

  // Check if user is admin (only if not bypassing)
  useEffect(() => {
    if (!BYPASS_AUTH && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

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
          if (book.coverImage) {
            setCoverPreview(book.coverImage);
          }
        } catch (err) {
          toast.error("Failed to load book details");
          console.error(err);
        }
      };
      fetchBook();
    }
  }, [id, isEdit, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("cover", file);

    try {
      // Create headers - only add auth if not bypassing
      const headers: HeadersInit = {};
      
      if (!BYPASS_AUTH && token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("🔐 Uploading with auth token");
      } else {
        console.log("⚠️ Uploading without auth (bypass enabled)");
      }

      const response = await fetch("http://localhost:5000/api/upload-cover", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      
      // Store the backend path
      const imagePath = data.url;
      
      // Create local preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      setCoverPreview(localPreviewUrl);
      
      // Update the form state with the backend path
      form.setValue("coverImage", imagePath);
      
      toast.success("Image uploaded successfully!");
      
      // Clean up the blob URL when component unmounts
      return () => {
        URL.revokeObjectURL(localPreviewUrl);
      };
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image");
      e.target.value = "";
    } finally {
      setUploadingImage(false);
    }
  };

  const removeCoverImage = () => {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverPreview(null);
    form.setValue("coverImage", "");
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith("blob:")) {
      return imagePath;
    }
    
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  const onSubmit = async (data: BookFormData) => {
    if (uploadingImage) {
      toast.error("Please wait for image upload to complete");
      return;
    }

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
    } catch (err: any) {
      console.error("Submit error:", err);
      
      if (!BYPASS_AUTH && (err.message?.includes("Access denied") || err.message?.includes("403"))) {
        toast.error("Your session has expired. Please log in again.");
        logout();
        navigate("/admin/login");
      } else {
        toast.error(err.message || "Failed to save book");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? "Edit Book" : "Add New Book"}
        </h1>
        {BYPASS_AUTH && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Development Mode: Authentication is bypassed for testing. 
              In production, this will be disabled.
            </p>
          </div>
        )}
        <p className="text-muted-foreground mt-1">
          {isEdit 
            ? "Update book information and cover image" 
            : "Fill in the details to add a new book to your collection"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title" 
                    {...form.register("title")} 
                    placeholder="Enter book title"
                    disabled={loading}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input 
                    id="author" 
                    {...form.register("author")} 
                    placeholder="Enter author name"
                    disabled={loading}
                  />
                  {form.formState.errors.author && (
                    <p className="text-sm text-red-500">{form.formState.errors.author.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input 
                    id="genre" 
                    {...form.register("genre")} 
                    placeholder="e.g., Fiction, Self-Help, Biography"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Cover Image</Label>
                <div className="flex items-start gap-4">
                  <div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                    {coverPreview ? (
                      <>
                        <img
                          src={getImageUrl(coverPreview) || undefined}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", coverPreview);
                            e.currentTarget.src = "https://via.placeholder.com/128x192?text=No+Image";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={removeCoverImage}
                          disabled={uploadingImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No image</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage || loading}
                      className="cursor-pointer"
                    />
                    {uploadingImage && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-xs text-muted-foreground">Uploading to server...</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Supported formats: JPG, PNG, GIF. Max size: 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                rows={4} 
                {...form.register("description")}
                placeholder="Enter book description or summary..."
                disabled={loading}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publishedYear">Publication Year</Label>
                <Input 
                  type="number" 
                  id="publishedYear"
                  {...form.register("publishedYear", { valueAsNumber: true })}
                  placeholder="e.g., 2024"
                  disabled={loading}
                  min={1000}
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="pages">Page Count</Label>
                <Input 
                  type="number" 
                  id="pages"
                  {...form.register("pages", { valueAsNumber: true })}
                  placeholder="Number of pages"
                  disabled={loading}
                  min={1}
                />
                {form.formState.errors.pages && (
                  <p className="text-sm text-red-500">{form.formState.errors.pages.message}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input 
                  type="number" 
                  step="0.1"
                  id="rating"
                  {...form.register("rating", { valueAsNumber: true })}
                  placeholder="e.g., 4.5"
                  disabled={loading}
                  min={0}
                  max={5}
                />
                {form.formState.errors.rating && (
                  <p className="text-sm text-red-500">{form.formState.errors.rating.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/admin/books")}
                disabled={loading || uploadingImage}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || uploadingImage}
                className="min-w-[120px]"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Update Book" : "Create Book"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}