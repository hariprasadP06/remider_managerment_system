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
    console.error("Error creating reminder:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to create reminder" }, 400);
  }
});

app.get("/reminders/:id", (c) => {
  try {
    const id = c.req.param("id");
    const reminder = db.getReminder(id);
    return reminder ? c.json(reminder) : c.json({ error: "Not found" }, 404);
  } catch (error) {
    console.error("Error retrieving reminder:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to retrieve reminder" }, 500);
  }
});

app.get("/reminders", (c) => {
  try {
    const reminders = db.getAllReminders();
    return reminders.length
      ? c.json(reminders)
      : c.json({ error: "No reminders found" }, 404);
  } catch (error) {
    console.error("Error retrieving reminders:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to retrieve reminders" }, 500);
  }
});

app.patch("/reminders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedFields: Partial<Reminder> = await c.req.json();
    return db.updateReminder(id, updatedFields)
      ? c.json({ message: "Reminder updated" })
      : c.json({ error: "Not found or invalid data" }, 400);
  } catch (error) {
    console.error("Error updating reminder:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to update reminder" }, 500);
  }
});

app.delete("/reminders/:id", (c) => {
  try {
    const id = c.req.param("id");
    return db.removeReminder(id)
      ? c.json({ message: "Reminder deleted" })
      : c.json({ error: "Not found" }, 404);
  } catch (error) {
    console.error("Error deleting reminder:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to delete reminder" }, 500);
  }
});

app.post("/reminders/:id/mark-completed", (c) => {
  try {
    const id = c.req.param("id");
    return db.markCompleted(id, true)
      ? c.json({ message: "Marked as completed" })
      : c.json({ error: "Not found" }, 404);
  } catch (error) {
    console.error("Error marking reminder as completed:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to mark as completed" }, 500);
  }
});

app.post("/reminders/:id/unmark-completed", (c) => {
  try {
    const id = c.req.param("id");
    return db.markCompleted(id, false)
      ? c.json({ message: "Unmarked as completed" })
      : c.json({ error: "Not found" }, 404);
  } catch (error) {
    console.error("Error unmarking reminder as completed:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to unmark as completed" }, 500);
  }
});

app.get("/reminders/completed", (c) => {
  try {
    const reminders = db.getRemindersByCompletion(true);
    return reminders.length
      ? c.json(reminders)
      : c.json({ error: "No completed reminders found" }, 404);
  } catch (error) {
    console.error("Error retrieving completed reminders:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to retrieve completed reminders" }, 500);
  }
});

app.get("/reminders/not-completed", (c) => {
  try {
    const reminders = db.getRemindersByCompletion(false);
    return reminders.length
      ? c.json(reminders)
      : c.json({ error: "No pending reminders found" }, 404);
  } catch (error) {
    console.error("Error retrieving pending reminders:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to retrieve pending reminders" }, 500);
  }
});

app.get("/reminders/due-today", (c) => {
  try {
    const reminders = db.getRemindersDueToday();
    return reminders.length
      ? c.json(reminders)
      : c.json({ error: "No reminders due today" }, 404);
  } catch (error) {
    console.error("Error retrieving reminders due today:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to retrieve reminders due today" }, 500);
  }
});

console.log("Server started at http://localhost:3000");

serve(app);
