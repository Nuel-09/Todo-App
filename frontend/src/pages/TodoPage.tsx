import { useState, useEffect } from "react";

interface Task {
  _id: string;        // MongoDB uses _id
  title: string;
  completed: boolean;
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks after login
  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: false }),
      });

      const createdTask = await res.json();
      setTasks([...tasks, createdTask]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Toggle task completion
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

  // Delete task
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

  // Separate pending and completed tasks
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Your Todo List</h2>

        {/* Add new task */}
        <div className="todo-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
          />
          <button onClick={addTask} className="page-btn">Add</button>
        </div>

        {/* Pending tasks */}
        <h3 style={{ color: "#fff", marginTop: "1.5rem" }}>Pending Tasks</h3>
        <ul className="task-list">
          {pendingTasks.map((task) => (
            <li key={task._id} className="task-item pending">
              <span onClick={() => toggleTask(task._id)} className="task-title">
                {task.title}
              </span>
              <button onClick={() => deleteTask(task._id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Completed tasks */}
        <h3 style={{ color: "#fff", marginTop: "1.5rem" }}>Completed Tasks</h3>
        <ul className="task-list">
          {completedTasks.map((task) => (
            <li key={task._id} className="task-item completed">
              <span onClick={() => toggleTask(task._id)} className="task-title completed-title">
                {task.title}
              </span>
              <button onClick={() => deleteTask(task._id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
