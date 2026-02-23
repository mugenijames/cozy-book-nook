import { Link } from "react-router-dom";

const books = [
  { title: "Dear Dad", slug: "dear-dad" },
  { title: "Why Church Relationships Fail", slug: "church-relationships" },
  { title: "Arise Turkana", slug: "arise-turkana" },
  { title: "Be Valuable", slug: "be-valuable" },
];

const Books = () => {
  return (
    <section id="books" className="py-24 bg-[#F9F6EF]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Books & Publications
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {books.map((book) => (
            <div
              key={book.slug}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-4">
                {book.title}
              </h3>

              <Link
                to={`/book/${book.slug}`}
                className="text-[#D4A017] font-medium"
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