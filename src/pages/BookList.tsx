import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Book = {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string;
};

const BookList = () => {
  const { data: books, isLoading, error } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/books");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      return response.json();
    },
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative w-full h-64 mb-8">
        <img
          src="/images/capa.jpg"
          alt="Library background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Book Collection</h1>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {user?.role === "admin" && (
          <div className="relative flex justify-end mb-4">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg transition"
              aria-label="Settings"
            >
              <FaCog className="text-2xl text-white" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-52 mt-2 z-10">
                <ul className="divide-y divide-gray-700">
                  <li
                    className="hover:bg-gray-700 cursor-pointer px-4 py-2 text-gray-300"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/manage-books");
                    }}
                  >
                    Manage Books
                  </li>
                  <li
                    className="hover:bg-gray-700 cursor-pointer px-4 py-2 text-gray-300"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/manage-users");
                    }}
                  >
                    Manage Users
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books?.map((book) => (
            <div
              key={book.id}
              className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <Link to={`/books/${book.id}`}>
                <img
                  src={book.coverImageUrl}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-2xl font-semibold truncate text-gray-200">
                    {book.title}
                  </h2>
                  <p className="text-gray-400">{book.author}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookList;
