import React from "react";
import { useFormik } from "formik";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

const AddEditHorseModal = ({ initialData, onClose }) => {
  const user = useAuthStore((state) => state.user);

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      breed: initialData?.breed || "",
      role: initialData?.role || "pethorse",
      birthDate: initialData?.birthDate?.slice(0, 10) || "", // format for input type="date"
      weight: initialData?.weight || "",
      gender: initialData?.gender || "male",
      rabiesDueDate: "",
      tetanusDueDate: "",
      lastTeethCheckup: "",
      lastHoofChange: "",
    },
    onSubmit: async (values) => {
      try {
        const valuesToSend = {
          name: values.name,
          breed: values.breed,
          role: values.role,
          birthDate: values.birthDate,
          weight: values.weight,
          gender: values.gender,
          stableId: user?._id,
        };

        if (initialData) {
          await api.put(`/horses/${initialData._id}`, valuesToSend);
        } else {
          await api.post("/horses/addhorse", valuesToSend);
        }

        if (onClose) onClose();
      } catch (error) {
        console.error("Error submitting horse:", error);
      }
    },
  });

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-10 bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Edit" : "Add"} Horse
      </h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />
        <input
          name="breed"
          placeholder="Breed"
          value={formik.values.breed}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />
        <select
          name="role"
          value={formik.values.role}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        >
          <option value="pethorse">Pet Horse</option>
          <option value="workhorse">Work Horse</option>
          <option value="racehorse">Race Horse</option>
        </select>

        <input
          name="birthDate"
          type="date"
          value={formik.values.birthDate}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />

        <input
          name="weight"
          type="number"
          placeholder="Weight (kg)"
          value={formik.values.weight}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />

        <select
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="gelding">Gelding</option>
        </select>

        {/* Health Status Inputs - Just UI for now */}
        <label className="text-sm font-medium mt-2">Health Check Dates</label>
        <input
          type="date"
          name="rabiesDueDate"
          value={formik.values.rabiesDueDate}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="tetanusDueDate"
          value={formik.values.tetanusDueDate}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="lastTeethCheckup"
          value={formik.values.lastTeethCheckup}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="lastHoofChange"
          value={formik.values.lastHoofChange}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEditHorseModal;
