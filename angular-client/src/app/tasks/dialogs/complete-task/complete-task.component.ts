/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { Component, EventEmitter, HostBinding, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

/* app */
import { LoggerService } from 'app/core/services/logger.service';
import { Task } from '@tasks/shared/models/task.model';
import { TaskService} from '@tasks/shared/services/task.service';

/**
 * Creates a dialog to complete a Task or list of Tasks. If more than one
 * Task is completed, then they will all be marked complete with the same
 * date.
 */
@Component({
    selector: 'complete-task',
    templateUrl: './complete-task.component.html',
    styleUrls: ['./complete-task.component.css']
})
export class CompleteTaskComponent implements OnInit, OnDestroy {

    @HostBinding('class.marker-complete-task-dialog') classMarker : boolean = true;
    /** Event emitted when the Task(s) are complete. */
    @Output() completeTask: EventEmitter<Task> = new EventEmitter<Task>();
    /** The text to display in the content along with the date completed field. */
    content: string;
    /** The form for the dateCompleted property. */
    dateCompletedForm: FormGroup;
    /** The text to display for the dateCompleted hint. */
    hint: string;
    /** The max date a Task can be marked as complete (set to current date; it doesn't 
        make a lot of sense to allow user to mark a task complete in the future).*/
    maxDateCompleted: Date;
    /** The Task(s) to complete. */
    tasks: Task[];
    /** The title text for the dialog. */
    title: string;
    /** The subscriptions for the component. */
    private sub: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data:any,
        private dialogRef: MatDialogRef<CompleteTaskComponent>,
        private formBuilder: FormBuilder,
        private logger: LoggerService,
        private taskService: TaskService
    ) {}

    /**
     * Cancels the Task edit and closes the dialog.
     */
    cancel() {
        this.dialogRef.close();
    }

    /**
     * Returns true if the form is invalid and the property of the given form is dirty or it has
     * been touched.
     * 
     * @param form The form to validate.
     * @param property The property that was updated.
     */
    checkError(param: string) {
        return this.dateCompletedForm.get(param).invalid && (this.dateCompletedForm.get(param).dirty || this.dateCompletedForm.get(param).touched);      
    }

    /**
     * Completes the Task(s).
     */
    complete() {
        let properties: Partial<Task> = {
            dateCompleted: this.dateCompletedForm.controls['dateCompleted'].value
        }

        if(this.tasks.length > 1) {
            let ids: number[] = this.tasks.map((task: Task) => task.id);
            const sub = this.taskService.completeAll(ids, properties).subscribe((tasks: Task[]) => {
                this.notifyAndClose('Tasks Completed Successfully', tasks[0]);
            });
            this.sub.add(sub);
        }
        else {
            const sub = this.taskService.complete(this.tasks[0], properties).subscribe((task: Task) => {
                this.notifyAndClose('Task Completed Successfully', task);
            });
            this.sub.add(sub);
        }
    }

    /**
     * Unsubscribe from any subscriptions.
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * Initialize the component.
     */
    ngOnInit() {
        this.maxDateCompleted = moment().startOf('day').utc().toDate();
        this.sub = new Subscription();
        this.tasks = this.data.tasks;
        if(this.tasks.length > 1) { 
            this.content = 'Enter the date the Tasks are completed. All Tasks will get the same date completed.';
            this.hint = 'The date the tasks are completed';
            this.title = 'Complete Tasks';
        }
        else {
            this.content = 'Enter the date the Task is completed.';
            this.hint = 'The date the task is completed';
            this.title = 'Complete Task';
        }

        this.dateCompletedForm = this.formBuilder.group({
            dateCompleted: [
                {
                    value: '',
                    disabled: false
                },
                [Validators.required]
            ]
        });
    }

    /**
     * Displays a snackBar with the given message, emits the given Task to this
     * components parent, and closes this dialog.
     * 
     * @param msg The message to display to the user.
     */
    private notifyAndClose(msg: string, task: Task): void {
        this.logger.info(`CompleteTaskComponent: ${msg}`, task);
        this.completeTask.emit(task);
        this.dialogRef.close(msg);
    }
}
