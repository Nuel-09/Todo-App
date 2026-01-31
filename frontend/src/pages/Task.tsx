import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function isAuthenticated() {
  return !!localStorage.getItem("token");
}
import "./task.css";

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  completed?: boolean;
}

const PRIORITIES = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [statusTab, setStatusTab] = useState("all");
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    // Optionally decode user from token (if you store username/email in JWT)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload.username || payload.email || "User");
      } catch {
        setUser("User");
      }
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/tasks", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setTasks([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, description, priority }),
      });
      if (!res.ok) throw new Error("Unauthorized");
      const createdTask = await res.json();
      setTasks((prev) => [...prev, createdTask]);
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      // handle error
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...task,
          status: task.status === "completed" ? "pending" : "completed",
        }),
      });
      if (!res.ok) throw new Error("Unauthorized");
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updatedTask : t)),
      );
    } catch (err) {}
  };

  const handleDeleteTask = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Unauthorized");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {}
  };

  // Filter tasks by status
  const filteredTasks =
    statusTab === "all"
      ? tasks
      : tasks.filter((t) =>
          statusTab === "pending"
            ? t.status !== "completed"
            : t.status === "completed",
        );

  return (
    <div className="task-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-title">Todo App</span>
        </div>
        <div>
          <span className="dashboard-user">Welcome, {user || "User"}!</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="create-task-card">
        <h3>Create New Task</h3>
        <form className="create-task-form" onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <button type="submit">Create Task</button>
        </form>
      </div>

      <div className="status-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`status-tab${statusTab === tab.value ? " active" : ""}`}
            onClick={() => setStatusTab(tab.value)}
          >
            {tab.label} (
            {tab.value === "all"
              ? tasks.length
              : tab.value === "pending"
                ? tasks.filter((t) => t.status !== "completed").length
                : tasks.filter((t) => t.status === "completed").length}
            )
          </button>
        ))}
      </div>

      <div className="tasks-section">
        {filteredTasks.length === 0 ? (
          <div
            style={{ color: "#b0b8c1", textAlign: "center", marginTop: "2rem" }}
          >
            No tasks to display.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`task-card${task.status === "completed" ? " completed" : ""}`}
            >
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-desc">{task.description}</div>
                )}
                <div className="task-meta">
                  {task.priority
                    ? task.priority === "high"
                      ? "🔥 High Priority"
                      : task.priority === "medium"
                        ? "⭐ Medium Priority"
                        : task.priority === "low"
                          ? "🧸 Low Priority"
                          : `${task.priority}`
                    : "Medium priority"}
                </div>
              </div>
              <div className="task-actions">
                <button
                  className={`status-btn ${task.status === "completed" ? "pending" : "completed"}`}
                  onClick={() => handleToggleStatus(task)}
                >
                  {task.status === "completed"
                    ? "Mark as Pending"
                    : "Mark as Completed"}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
