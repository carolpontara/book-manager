import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  published: string;
  coverImageUrl: string;
  description: string;
};

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState<Book>({
    id: "",
    title: "",
    author: "",
    genre: "",
    published: "",
    coverImageUrl: "",
    description: "",
  });
  const [newImage, setNewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3001/books/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch book, status: ${response.status}`);
        }
        const book = await response.json();
        setBookData(book);
        setNewImage(book.coverImageUrl); // Exibe a imagem atual
      } catch (error) {
        console.error("Error fetching book:", error);
        alert(`Failed to fetch book: ${error}`);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const blob = new Blob([reader.result], { type: file.type });
          const imageUrl = URL.createObjectURL(blob);
          setNewImage(imageUrl);
          setBookData({ ...bookData, coverImageUrl: imageUrl });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update book, status: ${response.status}`);
      }

      alert("Book updated successfully!");
      navigate("/manage-books");
    } catch (error) {
      console.error("Error updating book:", error);
      alert(`Failed to update book: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <button
        onClick={() => navigate("/manage-books")}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
      >
        ←
      </button>
      <h1 className="text-4xl font-bold mb-6 text-center">Edit Book</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            value={bookData.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Genre</label>
          <input
            type="text"
            name="genre"
            value={bookData.genre}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Published</label>
          <input
            type="date"
            name="published"
            value={bookData.published}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {newImage && (
            <div className="mt-4">
              <img
                src={newImage}
                alt="Preview"
                className="w-full max-w-xs mx-auto mt-2 rounded-lg"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Description</label>
          <textarea
            name="description"
            value={bookData.description}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;
