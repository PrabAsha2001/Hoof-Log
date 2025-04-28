// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";

import { useAuthStore } from "../store/authStore";
import UserTable from "../components/UserTable"; // We'll create this next
import HorseTable from "../components/HorseTable"; // Placeholder, you can implement later

const AdminPanel = () => {
  const { user, isCheckingAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState("user"); // default to user table

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  console.log("🧠 Zustand raw state:", useAuthStore.getState());


  useEffect(() => {
    if (user) {
      console.log("✅ AdminPanel has access to user:", user);
    } else {
      console.log("❌ user is undefined/null in AdminPanel");
    }
  }, [user]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Hi Admin{user?.ownerName ? `, ${user.ownerName}` : ""}
      </h1>
      <p className="text-gray-600 mb-4">{today}</p>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setActiveTab("horse")}
          className={`px-4 py-2 rounded ${
            activeTab === "horse" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Horses
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2 rounded ${
            activeTab === "user" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Users
        </button>
      </div>

      {activeTab === "user" ? <UserTable /> : <HorseTable />}
    </div>
  );
};

export default AdminPanel;
