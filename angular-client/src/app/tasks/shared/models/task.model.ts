/** The priority types available for a Task. */
export type PriorityTypes = "Low" | "Medium" | "High" | "Urgent";

/**
 * A Task to be completed. A Task requires a name, description, and due date.
 * By default Tasks are marked pending (isComplete=false). Tasks can also have
 * a priority, a frequency that they repeat (daily, weekly, monthly, yearly), and
 * the number of times they repeat (if it repeats).
 */
export class Task {
    /** The unique identifier of the Task. */
    id: number;
    /** The name of the Task. */
    name: string;
    /** The description of the Task.*/
    description: string;
    /** The date the Task is due. */
    dueDate: Date;
    /** The date the Task is completed. */
    dateCompleted: Date;
    /** Set to true if the Task is complete, false if it is pending. */
    isComplete: boolean = false;
    /** The priority of the Task (Low, Medium, High, or Urgent). */
    priority: PriorityTypes = 'Low';
    /** The frequency the Task repeats: 'noRepeat', 'daily', 'weekly', 'monthly', 'yearly'. */
    repeats?: string = 'noRepeat';
    /** The number of times the Task will repeat (if it repeats). */
    endsAfter: number = 0;
}
