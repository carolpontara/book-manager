import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/books");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/book-background.jpg')" }}
    >
      <div className="bg-black bg-opacity-70 p-10 shadow-lg rounded-lg w-full max-w-md border border-gray-800">
        <div className="flex justify-center mb-6">
          <FaBookOpen className="text-6xl text-white" />
        </div>
        <h1 className="text-3xl font-bold text-center text-white mb-4">Story Cloud</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-2 rounded-lg border border-gray-600 hover:bg-gray-800 hover:shadow-lg transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
