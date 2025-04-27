import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const HorsePage = () => {
  const { stableId } = useParams(); // Assuming URL like /horses/stable/:stableId
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch horses based on stableId
  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/horses/stable/${stableId}`);
        // Check if response contains valid data
        if (res.data && Array.isArray(res.data.horses)) {
          setHorses(res.data.horses);
        } else {
          setError("Invalid horse data received.");
        }
      } catch (err) {
        setError("Error fetching horses.");
        toast.error("Error fetching horses.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorses();
  }, [stableId]);

  // Handle clicking on a horse card
  const handleCardClick = (horseId) => {
    navigate(`/horses/${horseId}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading horses...
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {horses.length === 0 ? (
        <div className="h-screen flex items-center justify-center text-xl font-semibold">
          No horses found.
        </div>
      ) : (
        horses.map((horse) => (
          <div
            key={horse._id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => handleCardClick(horse._id)}
          >
            <h2 className="text-xl font-bold mb-2">{horse.name}</h2>
            <p>Age: {horse.age ? `${horse.age} years` : calculateAge(horse.birthDate)}</p>
            <p>Weight: {horse.weight ? `${horse.weight} kg` : "Unknown"}</p>
          </div>
        ))
      )}
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

export default HorsePage;
