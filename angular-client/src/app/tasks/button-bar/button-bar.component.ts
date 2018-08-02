/* angular libraries */
import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';

/* app */
import { Task } from '@tasks/shared/models/task.model';
import { ButtonsComponent } from '@tasks/buttons/buttons.component';

/**
 * Creates a bar that consists of the main @link{ButtonsComponent} and
 * a paginator to page through an array of given Tasks. The capability
 * to disable and/or hide buttons on ButtonsComponent is extended through
 * the provided @Inputs that match the @Inputs in the ButtonsComponent.
 */
@Component({
    selector: 'button-bar',
    templateUrl: './button-bar.component.html',
    styleUrls: ['./button-bar.component.css']
})
export class ButtonBarComponent { 

    /** Boolean to indicate if the complete button should be disabled (enabled by default). */
    @Input() disableCompleteButton: boolean;
    /** Boolean to indicate if the delete button should be disabled (enabled by default). */
    @Input() disableDeleteButton: boolean;
    /** Boolean to indicate if the edit button should be disabled (enabled by default). */
    @Input() disableEditButton: boolean;
    /** Boolean to indicate if the complete button should be hidden (hidden by default). */
    @Input() hideCompleteButton: boolean;
    /** Boolean to indicate if the edit button should be hidden (visible by default). */
    @Input() hideEditButton: boolean;
    /** Boolean to indicate if the pageSize options in paginator should be hidden (hidden by default). */
    @Input() hidePageSize: boolean;
    /** The length of the paginator. */
    @Input() length: number;
    /** The size for the paginator. */
    @Input() pageSize: number;
    /** The size options for pages. */
    @Input() pageSizeOptions: number[];
    /** Boolean to indicate whether to show the back button (hidden by default). */
    @Input() showBackButton: boolean;
    /** Boolean to indicate whether to show first and last buttons (hidden by default). */
    @Input() showFirstLastButtons: boolean;
    /** The Task(s) being managed with the buttons. */
    @Input() tasks: Task[];
    /** Event emitted when one of the buttons is clicked. */
    @Output() click: EventEmitter<boolean>;
    /** The ButtonBar component. */
    @ViewChild(ButtonsComponent) buttons: ButtonsComponent; 
    /** The paginator component. */
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private location: Location){
        this.click = new EventEmitter<boolean>();
    }

    /**
     * Returns the user back to 
     */
    back() {
        this.location.back();
    }
}
