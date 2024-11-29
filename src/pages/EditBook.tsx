import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

type Book = {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string;
};

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      const response = await fetch(`http://localhost:3001/books/${id}`);
      if (!response.ok) {
        alert("Failed to fetch the book");
        return;
      }
      const bookData = await response.json();
      setFormData(bookData);
    };
    fetchBook();
  }, [id]);

  const updateBookMutation = useMutation({
    mutationFn: async (updatedBook: Book) => {
      const response = await fetch(`http://localhost:3001/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });
      if (!response.ok) {
        throw new Error("Failed to update the book");
      }
    },
    onSuccess: () => {
      alert("Book updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      navigate("/books");
    },
    onError: (error: Error) => {
      alert(`Failed to update the book: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateBookMutation.mutate(formData);
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate("/books")}
        className="mb-4 flex items-center gap-2 px-4 py-2"
      >
        ←
      </button>
      <h1 className="text-3xl font-bold mb-6">Edit Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Cover Image URL</label>
          <input
            type="text"
            name="coverImageUrl"
            value={formData.coverImageUrl}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-900"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBook;
