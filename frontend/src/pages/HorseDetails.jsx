import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const HorseDetail = () => {
  const { horseId } = useParams();
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHorse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/horses/${horseId}`, {
          withCredentials: true,
        });
        console.log("🐎 Single Horse API response:", response.data);

        if (response.data && response.data.horse) {
          setHorse(response.data.horse);
        } else {
          setError("Horse not found.");
        }
      } catch (error) {
        console.error("Failed to fetch horse:", error);
        setError("Failed to fetch horse.");
        toast.error("Failed to fetch horse.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorse();
  }, [horseId]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-xl font-bold">Loading horse details...</div>;
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center text-xl font-bold text-red-600">{error}</div>;
  }

  if (!horse) {
    return <div className="h-screen flex items-center justify-center text-xl font-bold">No horse found.</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{horse.name || "Unnamed Horse"}</h1>
      <div className="space-y-2">
        <p><strong>Age:</strong> {horse.age ? `${horse.age} years` : horse.birthDate ? `${calculateAge(horse.birthDate)} years` : "Unknown"}</p>
        <p><strong>Weight:</strong> {horse.weight ? `${horse.weight} kg` : "Unknown"}</p>
        <p><strong>Breed:</strong> {horse.breed || "Unknown"}</p>
        <p><strong>Gender:</strong> {horse.gender || "Unknown"}</p>
        <p><strong>Color:</strong> {horse.color || "Unknown"}</p>
        <p><strong>Role:</strong> {horse.role || "Unknown"}</p>
        <p><strong>Birth Date:</strong> {horse.birthDate ? new Date(horse.birthDate).toLocaleDateString() : "Unknown"}</p>
        {/* Add more fields if you want */}
      </div>
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

export default HorseDetail;
