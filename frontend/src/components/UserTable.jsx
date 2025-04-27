import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddEditUserModal from "./AddEditUserModal"; // ✅ fixed import

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRadioSelect = (user) => {
    setSelectedUserId(user._id);
    setSelectedUser(user);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = () => {
    if (!selectedUser) {
      toast.error("Please select a user to edit");
      return;
    }
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to delete");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${selectedUser._id}`);
        toast.success("User deleted successfully");
        fetchUsers();
        setSelectedUser(null);
        setSelectedUserId(null);
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="p-4">
      {/* Top Buttons */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add
        </button>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="py-2 px-4 border">Select</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Number</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Secret Code</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border-t">
                <td className="py-2 px-4 border">
                  <input
                    type="radio"
                    name="selectedUser"
                    checked={selectedUserId === user._id}
                    onChange={() => handleRadioSelect(user)}
                  />
                </td>
                <td className="py-2 px-4 border">{user.userName}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.userNumber}</td>
                <td className="py-2 px-4 border">{user.address}</td>
                <td className="py-2 px-4 border">{user.role}</td>
                <td className="py-2 px-4 border">{user.secretId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <AddEditUserModal
          initialData={isEditing ? selectedUser : null}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserTable;
