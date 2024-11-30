import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  published: string;
  coverImageUrl: string;
  description: string;
};

const CreateBook = () => {
  const navigate = useNavigate();
  const [bookData, setBookData] = useState<Book>({
    id: 0,
    title: "",
    author: "",
    genre: "",
    published: "",
    coverImageUrl: "",
    description: "",
  });
  const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLastBookId = async () => {
      try {
        const response = await fetch("http://localhost:3001/books");
        if (!response.ok) {
          throw new Error(`Failed to fetch books, status: ${response.status}`);
        }
        const responseData = await response.json();
        if (Array.isArray(responseData) && responseData.length > 0) {
          const lastBookId = Math.max(...responseData.map((book: Book) => book.id));
          setNextId(lastBookId + 1);
        } else {
          setNextId(1);
        }
      } catch (error) {
        console.error("Error fetching last book ID:", error);
        alert("Erro ao buscar o ID do próximo livro. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchLastBookId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setNewCoverImage(file);

      // Simular a URL da imagem adicionada
      const fileUrl = URL.createObjectURL(file);
      setBookData({ ...bookData, coverImageUrl: fileUrl });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nextId === null) {
      alert("Erro: Não foi possível determinar o próximo ID.");
      return;
    }

    const newBook = { ...bookData, id: nextId };

    try {
      const response = await fetch("http://localhost:3001/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        throw new Error(`Failed to add the book, status: ${response.status}`);
      }

      alert("Book added successfully!");
      navigate("/books");
    } catch (error) {
      console.error("Error adding book:", error);
      alert(`Failed to add the book: ${error}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <button
        onClick={() => navigate("/books")}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
      >
        ←
      </button>
      <h1 className="text-4xl font-bold mb-6 text-center">Add New Book</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={bookData.title}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-300">Author</label>
            <input
              type="text"
              name="author"
              value={bookData.author}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Genre</label>
          <input
            type="text"
            name="genre"
            value={bookData.genre}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Published Date</label>
          <input
            type="date"
            name="published"
            value={bookData.published}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Description</label>
          <textarea
            name="description"
            value={bookData.description}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Cover Image</label>
          <div className="flex items-center space-x-3 mb-3">
            {newCoverImage && (
              <div className="relative">
                <img
                  src={bookData.coverImageUrl}
                  alt="Selected cover"
                  className="w-32 h-48 object-cover rounded-lg shadow-md mb-2"
                />
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-2 text-gray-400">Choose a file to upload</p>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default CreateBook;
