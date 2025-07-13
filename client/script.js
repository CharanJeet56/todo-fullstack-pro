/***** CONFIG *****/
const API = "https://todo-fullstack-pro.onrender.com"; // 👉 change to Render URL after deploy

/***** DOM SHORTCUTS *****/
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

/***** EVENT: Add New Task *****/
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = input.value.trim();
  if (!task) return;

  // POST /todos
  await fetch(`${API}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });

  input.value = "";
  loadTodos();
});

/***** RENDER UI *****/
async function loadTodos() {
  // GET /todos
  const todos = await fetch(`${API}/todos`).then((r) => r.json());
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "todo-item";

    // task text
    const textSpan = document.createElement("span");
    textSpan.textContent = todo.task;
    textSpan.className = "todo-text" + (todo.completed ? " completed" : "");

    /***** BUTTONS *****/
    const buttons = document.createElement("div");
    buttons.className = "todo-buttons";

    // ✅ Toggle
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = todo.completed ? "Undo" : "Done";
    toggleBtn.className = "toggle";
    toggleBtn.onclick = async () => {
      await fetch(`${API}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      loadTodos();
    };

    // ✏️ Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.onclick = async () => {
      const newTask = prompt("Edit task:", todo.task)?.trim();
      if (newTask) {
        await fetch(`${API}/todos/${todo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task: newTask }),
        });
        loadTodos();
      }
    };

    // 🗑️ Delete
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete";
    delBtn.onclick = async () => {
      await fetch(`${API}/todos/${todo.id}`, { method: "DELETE" });
      loadTodos();
    };

    buttons.append(toggleBtn, editBtn, delBtn);
    item.append(textSpan, buttons);
    todoList.appendChild(item);
  });
}

/***** INITIAL LOAD *****/
loadTodos();
