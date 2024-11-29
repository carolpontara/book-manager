import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type Book = {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string;
  description: string;
  published: string;
  genre: string;
};

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);

  const { data, isLoading, error } = useQuery<Book>({
    queryKey: ["book", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/books/${id}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setBook(data);
    }
  }, [data]);

  if (isLoading) {
    return <p className="text-center text-xl text-gray-300">Loading...</p>;
  }

  if (error instanceof Error) {
    return <p className="text-center text-xl text-red-400">Error: {error.message}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-6 relative">
      <Link
        to="/books"
        className="absolute top-8 left-8 text-gray-400 text-2xl hover:text-gray-200 transition"
        aria-label="Go back"
      >
        ←
      </Link>

      <div className="w-full max-w-6xl bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 bg-gray-700 flex items-center justify-center p-8">
            <img
              src={book?.coverImageUrl}
              alt={`Cover of ${book?.title}`}
              className="w-4/5 h-auto max-w-md object-cover rounded-md shadow-lg"
            />
          </div>

          <div className="w-full lg:w-1/2 p-10 flex flex-col">
            <h1 className="text-5xl font-bold text-white mb-4">{book?.title}</h1>
            <p className="text-2xl text-gray-400 mb-8">
              by <span className="text-gray-300">{book?.author}</span>
            </p>
            <p className="text-base text-gray-300 leading-relaxed mb-8">
              {book?.description}
            </p>
            <div className="flex flex-col space-y-3">
              <span className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg shadow-sm text-base">
                Genre: {book?.genre}
              </span>
              <span className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg shadow-sm text-base">
                Published: {book?.published}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
