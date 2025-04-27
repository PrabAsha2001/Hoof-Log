import React from "react";
import { useFormik } from "formik";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

const AddEditUserModal = ({ initialData, onClose }) => {
  const user = useAuthStore((state) => state.user);

  const formik = useFormik({
    initialValues: {
      userName: initialData?.userName || "",
      email: initialData?.email || "",
      userNumber: initialData?.userNumber || "",
      address: initialData?.address || "",
      secretId: initialData?.secretId || "",
      stable: initialData?.stable || user?._id || "", // auto-fill if available
      role: initialData?.role || "caretaker",
    },
    onSubmit: async (values) => {
      try {
        const res = initialData
          ? await api.put(`/users/${initialData._id}`, values)
          : await api.post("/users", values);
        if (onClose) onClose();
      } catch (error) {
        console.error("Error submitting user:", error);
      }
    },
  });

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">{initialData ? "Edit" : "Add"} User</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        <input name="userName" placeholder="Name" value={formik.values.userName} onChange={formik.handleChange} className="border p-2 rounded" />
        <input name="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} className="border p-2 rounded" />
        <input name="userNumber" placeholder="Phone Number" value={formik.values.userNumber} onChange={formik.handleChange} className="border p-2 rounded" />
        <input name="address" placeholder="Address" value={formik.values.address} onChange={formik.handleChange} className="border p-2 rounded" />
        <input name="secretId" placeholder="Secret ID" value={formik.values.secretId} onChange={formik.handleChange} className="border p-2 rounded" />
        
        <select name="role" value={formik.values.role} onChange={formik.handleChange} className="border p-2 rounded">
          <option value="caretaker">Caretaker</option>
          <option value="vet">Vet</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEditUserModal;
