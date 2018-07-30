/* angular libraries */
import { Component, HostBinding, Inject, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

/* app */
import { LoggerService } from 'app/core/services/logger.service';
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service';

/**
 * Creates a confirmation dialog to delete a Task or list of Tasks.
 */
@Component({
    selector: 'confirm-delete',
    templateUrl: './confirm-delete-task.component.html',
    styleUrls: ['./confirm-delete-task.component.css']
})
export class ConfirmDeleteTaskComponent implements OnDestroy, OnInit {

    @HostBinding('class.marker-confirm-delete-task-dialog') classMarker : boolean = true;
    /** The task to delete */
    task: Task;
    /** The tasks to delete */
    tasks: Task[];
    /** The confirmation text to display in the dialog. */
    text: string;
    /** The event emitter when the task is deleted. */
    deleteTask = new EventEmitter<boolean>();
    /** The subscriptions for the component. */
    sub: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data:any,
        private dialogRef: MatDialogRef<ConfirmDeleteTaskComponent>,
        private logger: LoggerService,
        private taskService: TaskService
    ) {}

    /**
     * Cancel out of delete and close this dialog
     */
    cancel() {
        this.dialogRef.close();
    }

    /**
     * Delete the task
     */
    delete() {
        if(this.tasks.length > 1) {
            // send individual requests to delete each Task since bulk delete
            // is not available through the API.
            this.tasks.forEach((task: Task, index:number) => {
                const sub = this.taskService.delete(task).subscribe(() => {
                    if(index == this.tasks.length - 1) {
                        this.deleteTask.emit(true);   // emit the deleteTask event to the edit-task parent component 
                        this.dialogRef.close(); // and close the this dialog
                    }
                });
                this.sub.add(sub);
            });
        }
        else {
            const sub = this.taskService.delete(this.tasks[0]).subscribe((task: Task) => {
                this.logger.info('ConfirmDeleteTaskComponent: Task deleted successfully', task);
                this.deleteTask.emit(true);   // emit the deleteTask event to the edit-task parent component 
                this.dialogRef.close(); // and close the this dialog
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
        this.sub = new Subscription();
        this.tasks = this.data.tasks;
        if(this.tasks.length > 1) {
            this.text = `Are you sure you want to delete the selected ${this.tasks.length} tasks?`;
        }
        else {
            this.text = 'Are you sure you want to delete the selected task?';
        }
    }
}
