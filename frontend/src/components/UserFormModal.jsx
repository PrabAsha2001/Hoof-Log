import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../services/api.js";
import { useAuthStore } from "../store/authStore";

const UserFormModal = ({ mode, userId, onClose }) => {
  const [formData, setFormData] = useState({ email: "", role: "caretaker" });
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (mode === "edit" && userId) {
      api.get(`/users/${userId}`).then(res => {
        setFormData({
          email: res.data.email,
          role: res.data.role,
        });
      });
    }
  }, [mode, userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (mode === "add") {
        await api.post("/users", {
          ...formData,
          stable: currentUser.stable,
        });
      } else {
        await api.put(`/users/${userId}`, formData);
      }
      onClose();
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <Modal isOpen onRequestClose={onClose} ariaHideApp={false}>
      <h2>{mode === "add" ? "Add New User" : "Edit User"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
          />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="caretaker">Caretaker</option>
          </select>
        </div>
        <button type="submit">Confirm</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default UserFormModal;
