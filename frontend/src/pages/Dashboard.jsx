import React from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const Dashboard = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/"); // Redirect to login or home
    } catch (err) {
      toast.error("Logout failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};
