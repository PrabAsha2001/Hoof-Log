import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const HorseTask = () => {
  const { horseId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!horseId) {
      setError("Invalid horse ID");
      setLoading(false);
      return;
    }

    const fetchHorseTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${horseId}?date=today`, {
          withCredentials: true,
        });

        if (res.data && Array.isArray(res.data.tasks)) {
          setTasks(res.data.tasks);
        } else {
          setError("No tasks found for this horse.");
        }
      } catch (err) {
        console.error("Error fetching tasks for horse:", err);
        setError("Error fetching tasks for horse.");
        toast.error("Error fetching tasks for horse.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorseTasks();
  }, [horseId]);

  const handleTaskChange = async (taskId, isChecked) => {
    try {
      const updatedTask = { completed: isChecked };
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, updatedTask, {
        withCredentials: true,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed: isChecked } : task
        )
      );
      toast.success("Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading tasks...
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
      <h1 className="text-3xl font-bold mb-6">Tasks for {tasks[0]?.horse?.name || "this horse"}</h1>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center text-xl font-semibold">
            No tasks found for this horse today.
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => handleTaskChange(task._id, e.target.checked)}
                className="h-5 w-5 text-blue-500"
              />
              <p
                className={`text-lg ${task.completed ? "line-through text-gray-500" : "text-black"}`}
              >
               {task.taskDescription}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HorseTask;
