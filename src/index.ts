import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Reminder, ReminderDatabase } from "./reminders";

const app = new Hono();
const db = new ReminderDatabase();

app.get("/", (c) => {
  return c.json({ message: "Welcome to the reminders API" });
});
app.post("/reminders", async (c) => {
  try {
    const body: Reminder = await c.req.json();
    db.createReminder(body);
    return c.json({ message: "Reminder created successfully" }, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

app.get("/reminders/:id", (c) => {
  const id = c.req.param("id");
  const reminder = db.getReminder(id);
  return reminder ? c.json(reminder) : c.json({ error: "Not found" }, 404);
});

app.get("/reminders", (c) => {
  const reminders = db.getAllReminders();
  return reminders.length
    ? c.json(reminders)
    : c.json({ error: "No reminders found" }, 404);
});

app.patch("/reminders/:id", async (c) => {
  const id = c.req.param("id");
  const updatedFields: Partial<Reminder> = await c.req.json();
  return db.updateReminder(id, updatedFields)
    ? c.json({ message: "Reminder updated" })
    : c.json({ error: "Not found or invalid data" }, 400);
});

app.delete("/reminders/:id", (c) => {
  const id = c.req.param("id");
  return db.removeReminder(id)
    ? c.json({ message: "Reminder deleted" })
    : c.json({ error: "Not found" }, 404);
});

app.post("/reminders/:id/mark-completed", (c) => {
  const id = c.req.param("id");
  return db.markCompleted(id, true)
    ? c.json({ message: "Marked as completed" })
    : c.json({ error: "Not found" }, 404);
});

app.post("/reminders/:id/unmark-completed", (c) => {
  const id = c.req.param("id");
  return db.markCompleted(id, false)
    ? c.json({ message: "Unmarked as completed" })
    : c.json({ error: "Not found" }, 404);
});

app.get("/reminders/completed", (c) => {
  const reminders = db.getRemindersByCompletion(true);
  return reminders.length
    ? c.json(reminders)
    : c.json({ error: "No completed reminders found" }, 404);
});

app.get("/reminders/not-completed", (c) => {
  const reminders = db.getRemindersByCompletion(false);
  return reminders.length
    ? c.json(reminders)
    : c.json({ error: "No pending reminders found" }, 404);
});

app.get("/reminders/due-today", (c) => {
  const reminders = db.getRemindersDueToday();
  return reminders.length
    ? c.json(reminders)
    : c.json({ error: "No reminders due today" }, 404);
});

console.log("Server started at http://localhost:3000");

serve(app);

export default app;
