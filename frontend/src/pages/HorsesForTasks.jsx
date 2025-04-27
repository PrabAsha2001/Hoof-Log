import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const HorsesForTasks = () => {
  const { stableId } = useParams();
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/horses/stable/${stableId}`, {
          withCredentials: true,
        });
        console.log("🐎 Horses for Tasks API response:", res.data);

        if (res.data && Array.isArray(res.data.horses)) {
          setHorses(res.data.horses);
        } else {
          setError("Invalid horse data received.");
        }
      } catch (err) {
        console.error("Error fetching horses for tasks:", err);
        setError("Error fetching horses for tasks.");
        toast.error("Error fetching horses for tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorses();
  }, [stableId]);

  const handleHorseClick = (horseId) => {
    navigate(`/tasks/horse/${horseId}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading horses for tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Select a Horse for Today's Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {horses.length === 0 ? (
          <div className="col-span-full text-center text-xl font-semibold">
            No horses found.
          </div>
        ) : (
          horses.map((horse) => (
            <div
              key={horse._id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => handleHorseClick(horse._id)}
            >
              <h2 className="text-2xl font-bold mb-2">{horse.name}</h2>
              <p className="text-gray-600">Age: {horse.age ? `${horse.age} years` : calculateAge(horse.birthDate)}</p>
              <p className="text-gray-600">Role: {horse.role || "Unknown"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function calculateAge(birthDate) {
  if (!birthDate) return "Unknown";
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default HorsesForTasks;
