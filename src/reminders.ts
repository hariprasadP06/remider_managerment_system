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
      if (!reminder.id || !reminder.title || !reminder.dueDate) {
        throw new Error("ID, title, and due date are required.");
      }
      this.reminders.push(reminder);
    }
  
    getReminder(id: string): Reminder | undefined {
      return this.reminders.find((r) => r.id === id);
    }
  
    getAllReminders(): Reminder[] {
      return this.reminders;
    }
  
    updateReminder(id: string, updatedFields: Partial<Reminder>): boolean {
      const reminder = this.getReminder(id);
      if (!reminder) return false;
  
      Object.assign(reminder, updatedFields);
      return true;
    }
  
    removeReminder(id: string): boolean {
      const index = this.reminders.findIndex((r) => r.id === id);
      if (index === -1) return false;
  
      this.reminders.splice(index, 1);
      return true;
    }
  
    markCompleted(id: string, status: boolean): boolean {
      const reminder = this.getReminder(id);
      if (!reminder) return false;
  
      reminder.isCompleted = status;
      return true;
    }
  
    getRemindersByCompletion(status: boolean): Reminder[] {
      return this.reminders.filter((r) => r.isCompleted === status);
    }
  
    getRemindersDueToday(): Reminder[] {
      const today = new Date().toISOString().split("T")[0];
      return this.reminders.filter((r) => r.dueDate === today);
    }
  }
  