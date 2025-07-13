const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ➕ Add Task
app.post("/todos", async (req, res) => {
  const { task } = req.body;
  const { data, error } = await supabase.from("todos").insert([{ task }]);
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

// 📥 Get All Tasks
app.get("/todos", async (req, res) => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// 🗑️ Delete Task
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

// ✅ Toggle Completed
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { data, error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id)
    .select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed, task } = req.body;
  const updates = {};
  if (completed !== undefined) updates.completed = completed;
  if (task !== undefined) updates.task = task;

  const { data, error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
