import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaArrowLeft, FaPlus } from "react-icons/fa";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  published: string;
  coverImageUrl: string;
  description: string;
};

const ManageBooks = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const deleteBookMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:3001/books/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete the book");
      }
    },
    onSuccess: () => {
      alert("Book deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      alert(`Failed to delete the book: ${error.message}`);
    },
  });

  const handleDeleteBook = (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBookMutation.mutate(id);
    }
  };

  const handleAddBook = () => {
    navigate("/books/create");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-4 flex items-center justify-between">
      <button
            onClick={() => navigate("/books")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleAddBook}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
        >
          <FaPlus /> Add New Book
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Manage Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book) => (
          <div
            key={book.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-400">{book.author}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/books/edit/${book.id}`}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
                  title="Edit Book"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
                  title="Delete Book"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={book.coverImageUrl}
                alt={`${book.title} cover`}
                className="w-32 h-48 object-cover rounded-lg"
              />
            </div>
            <p className="mt-4 text-gray-300">{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBooks;
