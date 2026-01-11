// src/components/EditBook.tsx
import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getBookById, updateBook } from "../../api/books";

interface EditBookProps {
  bookId: string;
  onUpdated?: () => void;
}

const EditBook: React.FC<EditBookProps> = ({ bookId, onUpdated }) => {
  const queryClient = useQueryClient();
  const { data: book, isLoading } = useQuery(
    ["book", bookId],
    () => getBookById(bookId)
  );

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setPrice(book.price);
      setDescription(book.description);
    }
  }, [book]);

  const mutation = useMutation(
    () => updateBook(bookId, { title, author, price, description }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["books"]);
        queryClient.invalidateQueries(["book", bookId]);
        if (onUpdated) onUpdated();
      },
      onError: (err: any) => setError(err.message),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <p>Loading book...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label>Title:</label>
        <input
          className="border p-1 ml-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Author:</label>
        <input
          className="border p-1 ml-2"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          className="border p-1 ml-2"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          className="border p-1 ml-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
      >
        Update Book
      </button>
    </form>
  );
};

export default EditBook;
