// Example: src/components/BooksAdmin.tsx
import AddBook from "./AddBook";
import BooksList from "../BooksList";

interface BooksAdminProps {
  userRole: "USER" | "ADMIN";
}

const BooksAdmin = ({ userRole }: BooksAdminProps) => {
  if (userRole !== "ADMIN") return null;

  return (
    <div>
      <AddBook />
      <BooksList refresh={true} />
    </div>
  );
};

export default BooksAdmin;
