/* angular libraries */
import { Component, HostBinding, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

/* app */
import { LoggerService } from 'app/core/services/logger.service';
import { TaskFormComponent } from '@tasks/form/task-form.component';
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service';

/**
 * Creates a dialog to create a new Task. The dialog uses the TaskFormComponent
 * and subscribes to it's formValid EventEmitter to enable and disable the 
 * "create" button.
 */
@Component({
    selector: 'create-task',
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit, OnDestroy {
    
    @HostBinding('class.marker-create-task-dialog') classMarker : boolean = true;
    /** Boolean to indicate whether or not to enable the create button (true to enable button). */
    enableCreateButton: boolean = false;
    /** The form to create a Task. */
    @ViewChild(TaskFormComponent) taskFormComponent: TaskFormComponent;
    /** The subscriptions for the component. */
    private sub: Subscription;

    constructor(
        private dialogRef: MatDialogRef<CreateTaskComponent>,
        private logger: LoggerService,
        private taskService: TaskService
    ) {}

    /**
     * Cancels the Task creation and closes the dialog.
     */
    cancel() {
        this.dialogRef.close();
    }

    /**
     * Creates a new task.
     */
    create() {
        this.dialogRef.disableClose = true;

        // create a Task based on the values from the TaskFormComponent
        let task: Task = {
            name: this.taskFormComponent.mainPropertiesForm.get('name').value,
            priority: this.taskFormComponent.mainPropertiesForm.get('priority').value,
            description: this.taskFormComponent.mainPropertiesForm.get('description').value,
            dueDate: this.taskFormComponent.mainPropertiesForm.get('due').value,
            isComplete: false,
            repeats: this.taskFormComponent.repeatPropertiesForm.get('repeats').value,
            endsAfter: this.taskFormComponent.repeatPropertiesForm.get('after').value
        } as Task;

        const sub = this.taskService.create(task).subscribe((task: Task) => {
            this.logger.info('CreateTaskComponent: Task created successfully', task);
            this.dialogRef.close(task);
        });
        this.sub.add(sub);
    }

    /**
     * Initialize the component.
     */
    ngOnInit() {
        this.sub = new Subscription();

        const sub = this.taskFormComponent.formValid.subscribe((formValid) => {
            if(formValid) {
                this.enableCreateButton = true;
            }
            else {
                this.enableCreateButton = false;
            }
        });
        this.sub.add(sub);
    }

    /**
     * Unsubscribe from any subscriptions.
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
