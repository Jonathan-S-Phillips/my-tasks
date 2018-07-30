/* typeorm modules */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * A Task to be completed. A Task requires a name, description, and due date.
 * Tasks can also have a priority and a frequency that they repeat (daily, 
 * weekly, monthly, yearly). If the Task repeats then it will have a reference
 * to the next Task in the sequence through the nextId property (as long as it
 * is not the last Task in the sequence), and it will have the number of Tasks
 * left in the sequence.
*/
@Entity()
export class Task {
    /* The primary key. */
    @PrimaryGeneratedColumn() id: number;
    /* The name of the Task. */
    @Column() name: string;
    /* The priority: 'Urgent', 'High', 'Medium', 'Low'. */
    @Column() priority: string;
    /* The frequency the Task repeats: 'noRepeat', 'daily', 'weekly', 'monthly', 'yearly'. */
    @Column({ nullable: true }) repeats: string;
    /* The number of repeated Tasks left in the sequence (of repeated tasks). */
    @Column({ default: 0 }) endsAfter: number;
    /* The next Task in the sequence (of repeated tasks). */
    @Column({ nullable: true }) nextId: string;
    /* The description of the Task. */
    @Column() description: string;
    /* The date the Task is due. */ 
    @Column({ type: 'date' }) dueDate: string;
    /* The date the Task was completed. */
    @Column({ type: 'date', nullable: true }) dateCompleted: string;
    /* Set to true if the Task is complete, false if it is pending. */
    @Column() isComplete: boolean;
}
