import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/books")
      .then(res => setBooks(res.data));
  }, []);

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-heading text-center mb-12">
          Books & Publications
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {books.map((book: any) => (
            <div key={book.id} className="bg-white p-6 shadow rounded">
              <h3 className="font-semibold mb-4">
                {book.title}
              </h3>

              <Link
                to={`/book/${book.slug}`}
                className="text-[#D4A017]"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;