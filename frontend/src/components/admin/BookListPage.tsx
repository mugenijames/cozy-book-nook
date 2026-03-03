// src/features/admin/books/BookListPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner"; // or react-hot-toast / your toast library
import { getBooks, deleteBook } from "@/services/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

// Type for book (adjust to match your real Book type)
interface Book {
  id: string;
  title: string;
  author: string;
  // add more fields as needed: description, coverImage, etc.
}

export default function BookListPage() {
  const queryClient = useQueryClient();

  // Fetch books
  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      toast.success("Book deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err) => {
      toast.error("Failed to delete book");
      console.error(err);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <p>Error loading books: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Books Management</h1>
        <Button asChild>
          <Link to="/admin/books/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Book
          </Link>
        </Button>
      </div>

      {/* Table / Empty state */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No books found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by adding your first book.
          </p>
          <Button asChild className="mt-6">
            <Link to="/admin/books/new">Add Book</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Author
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 font-medium">{book.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{book.author}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/books/${book.id}/edit`}>Edit</Link>
                        </Button>

                        <ConfirmDialog
                          title="Delete Book"
                          description={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
                          confirmText="Delete"
                          variant="destructive"
                          onConfirm={async () => {
                            await deleteMutation.mutateAsync(book.id);
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            Delete
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}