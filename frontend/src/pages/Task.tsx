import { useState, useEffect } from "react";

interface Task {
  _id: string;        // MongoDB uses _id instead of id
  title: string;
  completed: boolean;
}

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from backend when component mounts
  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add new task (send to backend)
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: false }),
      });

      const createdTask = await res.json();
      setTasks([...tasks, createdTask]); // update state with backend response
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Toggle task completion (send update to backend)
  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });

      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task (optional)
  const deleteTask = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="todo-container">
      <h2>Todo List</h2>
      <div className="todo-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="todo-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleTask(task._id)}>{task.title}</span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
