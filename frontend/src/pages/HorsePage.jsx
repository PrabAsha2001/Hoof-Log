import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const HorsePage = () => {
  const { stableId } = useParams();
  const navigate = useNavigate();

  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/horses/stable/${stableId}`, {
          withCredentials: true,
        });
        console.log("🐎 Horse API response:", response.data);

        if (response.data && Array.isArray(response.data.horses)) {
          setHorses(response.data.horses);
        } else {
          setError("No horses found or invalid data format.");
        }
      } catch (error) {
        console.error("Failed to fetch horses:", error);
        setError("Failed to fetch horses.");
        toast.error("Failed to fetch horses.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorses();
  }, [stableId]);

  const handleHorseClick = (horseId) => {
    navigate(`/horses/${horseId}`);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-xl font-bold">Loading horses...</div>;
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center text-xl font-bold text-red-600">{error}</div>;
  }

  if (horses.length === 0) {
    return <div className="h-screen flex items-center justify-center text-xl font-bold">No horses found.</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {horses.map((horse) => (
        <div
          key={horse._id}
          onClick={() => handleHorseClick(horse._id)}
          className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
        >
          <h2 className="text-2xl font-bold mb-2">{horse.name || "Unnamed Horse"}</h2>
          <p>Age: {horse.age ? `${horse.age} years` : horse.birthDate ? `${calculateAge(horse.birthDate)} years` : "Unknown"}</p>
          <p>Weight: {horse.weight ? `${horse.weight} kg` : "Unknown"}</p>
        </div>
      ))}
    </div>
  );
};

const calculateAge = (birthDate) => {
  if (!birthDate) return "Unknown";
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default HorsePage;
