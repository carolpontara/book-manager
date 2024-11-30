import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

const CreateUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [nextId, setNextId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLastUserId = async () => {
      try {
        const response = await fetch("http://localhost:3001/users");
        if (!response.ok) {
          throw new Error(`Failed to fetch users, status: ${response.status}`);
        }
        const responseData = await response.json();
        if (Array.isArray(responseData) && responseData.length > 0) {
          const lastUserId = (
            Math.max(...responseData.map((user: User) => parseInt(user.id))) + 1
          ).toString();
          setNextId(lastUserId);
        } else {
          setNextId("1");
        }
      } catch (error) {
        console.error("Error fetching last user ID:", error);
        alert("Erro ao buscar o ID do próximo usuário. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchLastUserId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nextId === null) {
      alert("Erro: Não foi possível determinar o próximo ID.");
      return;
    }

    const newUser = { ...userData, id: nextId };

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(`Failed to add the user, status: ${response.status}`);
      }

      alert("User added successfully!");
      navigate("/manage-users");
    } catch (error) {
      console.error("Error adding user:", error);
      alert(`Failed to add the user: ${error}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <button
        onClick={() => navigate("/manage-users")}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
      >
        ←
      </button>
      <h1 className="text-4xl font-bold mb-6 text-center">Create New User</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Role</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
