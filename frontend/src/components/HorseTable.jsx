import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import AddEditHorseModal from "./AddEditHorseModal";
import { useAuthStore } from "../store/authStore"; // adjust the path if different

const HorseTable = () => {
  const [horses, setHorses] = useState([]);
  const [selectedHorseId, setSelectedHorseId] = useState(null);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const stableId = useAuthStore((state) => state.stableId);

  const fetchHorses = async () => {
    if (!stableId) {
      toast.error("Stable ID not available");
      return;
    }
  
    try {
      const res = await api.get(`/horses/stable/${stableId}`);
      setHorses(res.data.horses || []);
    } catch (err) {
      toast.error("Failed to fetch horses");
    }
  };
  
  useEffect(() => {
    fetchHorses();
  }, [stableId]);

  const handleRadioSelect = (horse) => {
    setSelectedHorseId(horse._id);
    setSelectedHorse(horse);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedHorse(null);
    setModalOpen(true);
  };

  const handleEdit = () => {
    if (!selectedHorse) {
      toast.error("Please select a horse to edit");
      return;
    }
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedHorse) {
      toast.error("Please select a horse to delete");
      return;
    }
    if (window.confirm("Are you sure you want to delete this horse?")) {
      try {
        await api.delete(`/horses/${selectedHorse._id}`);
        toast.success("Horse deleted successfully");
        fetchHorses();
        setSelectedHorse(null);
        setSelectedHorseId(null);
      } catch (error) {
        toast.error("Failed to delete horse");
      }
    }
  };

  // Function to calculate age from birth date
  const calculateAge = (birthDate) => {
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  return (
    <div className="p-4">
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

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="py-2 px-4 border">Select</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Breed</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Birth Date</th>
              <th className="py-2 px-4 border">Age</th>
              <th className="py-2 px-4 border">Weight (kg)</th>
              <th className="py-2 px-4 border">Gender</th>
            </tr>
          </thead>
          <tbody>
            {horses.map((horse) => (
              <tr key={horse._id} className="text-center border-t">
                <td className="py-2 px-4 border">
                  <input
                    type="radio"
                    name="selectedHorse"
                    checked={selectedHorseId === horse._id}
                    onChange={() => handleRadioSelect(horse)}
                  />
                </td>
                <td className="py-2 px-4 border">{horse.name}</td>
                <td className="py-2 px-4 border">{horse.breed}</td>
                <td className="py-2 px-4 border">{horse.role}</td>
                <td className="py-2 px-4 border">{new Date(horse.birthDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{calculateAge(horse.birthDate)}</td>
                <td className="py-2 px-4 border">{horse.weight}</td>
                <td className="py-2 px-4 border">{horse.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <AddEditHorseModal
          initialData={isEditing ? selectedHorse : null}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HorseTable;
