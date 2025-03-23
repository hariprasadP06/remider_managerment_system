export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

export class ReminderDatabase {
  private reminders: Reminder[] = [];

  createReminder(reminder: Reminder): void {
    try {
      if (!reminder.id || !reminder.title || !reminder.dueDate) {
        throw new Error("ID, title, and due date are required.");
      }
      this.reminders.push(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error instanceof Error ? error.message : error);
    }
  }

  getReminder(id: string): Reminder | undefined {
    try {
      if (!id) throw new Error("ID is required.");
      return this.reminders.find((r) => r.id === id);
    } catch (error) {
      console.error("Error retrieving reminder:", error instanceof Error ? error.message : error);
      return undefined;
    }
  }

  getAllReminders(): Reminder[] {
    return this.reminders;
  }

  updateReminder(id: string, updatedFields: Partial<Reminder>): boolean {
    try {
      if (!id) throw new Error("ID is required.");
      const reminder = this.getReminder(id);
      if (!reminder) throw new Error("Reminder not found.");
      
      Object.assign(reminder, updatedFields);
      return true;
    } catch (error) {
      console.error("Error updating reminder:", error instanceof Error ? error.message : error);
      return false;
    }
  }

  removeReminder(id: string): boolean {
    try {
      if (!id) throw new Error("ID is required.");
      const index = this.reminders.findIndex((r) => r.id === id);
      if (index === -1) throw new Error("Reminder not found.");
      
      this.reminders.splice(index, 1);
      return true;
    } catch (error) {
      console.error("Error removing reminder:", error instanceof Error ? error.message : error);
      return false;
    }
  }

  markCompleted(id: string, status: boolean): boolean {
    try {
      if (!id) throw new Error("ID is required.");
      const reminder = this.getReminder(id);
      if (!reminder) throw new Error("Reminder not found.");
      
      reminder.isCompleted = status;
      return true;
    } catch (error) {
      console.error("Error marking reminder as completed:", error instanceof Error ? error.message : error);
      return false;
    }
  }

  getRemindersByCompletion(status: boolean): Reminder[] {
    try {
      return this.reminders.filter((r) => r.isCompleted === status);
    } catch (error) {
      console.error("Error retrieving reminders by completion:", error instanceof Error ? error.message : error);
      return [];
    }
  }

  getRemindersDueToday(): Reminder[] {
    try {
      const today = new Date().toISOString().split("T")[0];
      return this.reminders.filter((r) => r.dueDate === today);
    } catch (error) {
      console.error("Error retrieving reminders due today:", error instanceof Error ? error.message : error);
      return [];
    }
  }
}


