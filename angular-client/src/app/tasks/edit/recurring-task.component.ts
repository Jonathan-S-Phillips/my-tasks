/* angular libraries */
import { Component, EventEmitter, HostBinding, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

/* app */
import { Task } from '@tasks/shared/models/task.model';

/**
 * Creates a dialog to select whether to edit a single or all remaining Tasks
 * in a sequence of Tasks. This component expects the given Task to be a 
 * recurring one.
 */
@Component({
    selector: 'recurring-task',
    templateUrl: './recurring-task.component.html',
    styleUrls: ['./recurring-task.component.css']
})
export class RecurringTaskComponent implements OnDestroy, OnInit {

    @HostBinding('class.marker-repeating-task-dialog') classMarker : boolean = true;
    /** The form to select whether to edit single or all remaining Tasks. */
    editRecurringTaskForm: FormGroup;
    /** The recurring Task to edit. */
    task: Task;
    /** Event emitted when user clicks the "Edit" button (emits boolean value updateAll=true if updating all Tasks). */
    @Output() updateAll: EventEmitter<boolean>;
    /** The subscriptions for the component. */
    private sub: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data:any,
        private dialogRef: MatDialogRef<RecurringTaskComponent>,
        private formBuilder: FormBuilder
    ) {
        this.updateAll = new EventEmitter<boolean>();
    }

    /**
     * Cancels the Task edit and closes the dialog.
     */
    cancel() {
        this.dialogRef.close();
    }

    /**
     * Clean the component 
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * Initialize the component.
     */
    ngOnInit() {
        this.task = this.data.task;

        this.editRecurringTaskForm = this.formBuilder.group({
            updateAll: [
                {
                    value: '',
                    disabled: false
                },
                Validators.required
            ]
        });

        this.sub = new Subscription();
    }

    /**
     * Opens the dialog to edit a Task.
     */
    edit() {
        let updateAll: boolean;
        if(this.editRecurringTaskForm.get('updateAll').value == 'all') {
            updateAll = true;
        }
        else {
            updateAll = false;
        }
        this.updateAll.emit(updateAll);
        this.dialogRef.close();
    }
}
