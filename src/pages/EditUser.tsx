import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user, status: ${response.status}`);
        }
        const user = await response.json();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert(`Failed to fetch user: ${error}`);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user, status: ${response.status}`);
      }

      alert("User updated successfully!");
      navigate("/manage-users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(`Failed to update user: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <button
        onClick={() => navigate("/manage-users")}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
      >
        ←
      </button>
      <h1 className="text-4xl font-bold mb-6 text-center">Edit User</h1>
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
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default EditUser;
