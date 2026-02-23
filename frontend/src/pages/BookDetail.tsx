import { useParams } from "react-router-dom";

const BookDetail = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-white p-12">
      <h1 className="text-4xl font-bold mb-6 capitalize">
        {slug?.replace("-", " ")}
      </h1>

      <p className="text-lg text-gray-700 max-w-3xl">
        Full book description goes here. You can later fetch this
        dynamically from backend.
      </p>
    </div>
  );
};

export default BookDetail;