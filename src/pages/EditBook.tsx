import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

type Book = {
    id: number;
    title: string;
    author: string;
    genre: string;
    published: string;
    coverImageUrl: string;
    description: string;
};

const EditBook = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<Book | null>(null);
    const [newCoverImage, setNewCoverImage] = useState<File | null>(null);

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
            const formDataToSend = new FormData();
            formDataToSend.append("title", updatedBook.title);
            formDataToSend.append("author", updatedBook.author);
            formDataToSend.append("genre", updatedBook.genre);
            formDataToSend.append("published", updatedBook.published);
            formDataToSend.append("description", updatedBook.description);

            if (newCoverImage) {
                formDataToSend.append("coverImage", newCoverImage);
            } else {
                formDataToSend.append("coverImageUrl", updatedBook.coverImageUrl);
            }

            const response = await fetch(`http://localhost:3001/books/${id}`, {
                method: "PUT",
                body: formDataToSend,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (formData) {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewCoverImage(e.target.files[0]);
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
        <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
            <button
                onClick={() => navigate("/manage-books")}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
                ←
            </button>
            <h1 className="text-4xl font-bold mb-6 text-center">Edit Book</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 font-semibold text-gray-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold text-gray-300">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-gray-300">Genre</label>
                    <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-gray-300">Published Date</label>
                    <input
                        type="date"
                        name="published"
                        value={formData.published}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-gray-300">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-gray-300">Cover Image</label>
                    <div className="flex items-center space-x-3 mb-3">
                        {newCoverImage || formData.coverImageUrl ? (
                            <div className="relative">
                                <img
                                    src={newCoverImage ? URL.createObjectURL(newCoverImage) : formData.coverImageUrl}
                                    alt="Current cover"
                                    className="w-32 h-48 object-cover rounded-lg shadow-md mb-2"
                                />
                            </div>
                        ) : null}
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
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditBook;
