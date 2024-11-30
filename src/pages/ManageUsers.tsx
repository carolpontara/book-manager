import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaArrowLeft, FaPlus } from "react-icons/fa";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch users from db.json
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });

  // Mutation to delete user
  const deleteUserMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete the user");
      }
    },
    onSuccess: () => {
      alert("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      alert(`Failed to delete the user: ${error.message}`);
    },
  });

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleAddUser = () => {
    navigate("/users/create");
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
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
        >
          <FaPlus /> Add New User
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-500">{user.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/users/edit/${user.id}`}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
                  title="Edit User"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
                  title="Delete User"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
