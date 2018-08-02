/* angular libraries */
import { Component, EventEmitter, OnDestroy, OnInit, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

/* app */
import { CompleteTaskComponent } from '@tasks/dialogs/complete-task/complete-task.component';
import { ConfirmDeleteTaskComponent } from '@tasks/dialogs/confirm-delete-task/confirm-delete-task.component';
import { Task } from '@tasks/shared/models/task.model';
import { UtilsService } from '@tasks/shared/services/utils.service';

/**
 * Creates the main buttons to manage one or more Tasks. The main management
 * capabilities for Tasks include completing, deleting, and editing. Any 
 * button can be disabled and/or hidden using the provided @Inputs.
 */
@Component({
    selector: 'buttons',
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnDestroy, OnInit { 

    /** Boolean to indicate if the complete button should be disabled (enabled by default). */
    @Input() disableCompleteButton: boolean;
    /** Boolean to indicate if the delete button should be disabled (enabled by default). */
    @Input() disableDeleteButton: boolean;
    /** Boolean to indicate if the edit button should be disabled (enabled by default). */
    @Input() disableEditButton: boolean;
    /** Boolean to indicate if the complete button should be hidden (visible by default). */
    @Input() hideCompleteButton: boolean;
    /** Boolean to indicate if the edit button should be hidden (visible by default). */
    @Input() hideEditButton: boolean;
    /** The Task(s) being managed with the buttons. */
    @Input() tasks: Task[];
    /** Event emitted when Task is completed. */
    @Output() complete: EventEmitter<boolean>;
    /** Event emitted when Task is deleted. */
    @Output() deleted: EventEmitter<boolean>;
    /** The subscriptions for the component. */
    private sub: Subscription;

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private utilsService: UtilsService
    ){
        this.complete = new EventEmitter<boolean>();
        this.deleted = new EventEmitter<boolean>();
    }

    /**
     * Opens the dialog to complete the selected Task(s).
     */
    openCompleteDialog(event) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '50%';
        dialogConfig.autoFocus = false;
        dialogConfig.data = { tasks: this.tasks };
        let completeSelectedDialogRef = this.dialog.open(CompleteTaskComponent, dialogConfig);
        this.utilsService.fullScreenDialogSub(completeSelectedDialogRef, '50%');

        // subscribe to the completeTask event from the dialog
        const sub = completeSelectedDialogRef.componentInstance.completeTask.subscribe(() => {
            this.complete.emit(true);
        });
        this.sub.add(sub);

        // prevent propagation so parent components do not receive the click event
        event.stopPropagation();
    }

    /**
     * Opens the dialog to confirm if the selected Task(s) should be deleted.
     */
    openConfirmDeleteDialog(event) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '50%';
        dialogConfig.autoFocus = false;
        dialogConfig.data = { tasks: this.tasks };
        let confirmDeleteDialogRef = this.dialog.open(ConfirmDeleteTaskComponent, dialogConfig);

        this.utilsService.fullScreenDialogSub(confirmDeleteDialogRef);

        // subscribe to the deleteTask event from the dialog
        const sub = confirmDeleteDialogRef.componentInstance.deleteTask.subscribe(() => {
            this.deleted.emit(true);
        });
        this.sub.add(sub);

        // prevent propagation so parent components do not receive the click event
        event.stopPropagation();
    }

    /**
     * Opens the dialog to edit the selected Task. If the Task is not complete
     * and it is a repeating Task, then the RecurringTaskComponent is displayed
     * to determine if the user wants to edit the single selected Task or all
     * remaining Tasks (including the one selected). Otherwise the basic edit
     * Task dialog is rendered.
     * 
     * @param event
     */
    openEditDialog(event) {
        this.router.navigate(['tasks', this.tasks[0].id]);
        // prevent propagation so parent components do not receive the click event
        event.stopPropagation();
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
    }
}
