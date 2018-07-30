/* angular libraries */
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSnackBarModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faAngleUp, faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Add icons to fortawesome/fontawesome-svg-core library for convenient access in components
library.add(faAngleUp, faCheck, faCheckSquare, faEdit, faTrash);

/* components */
import { CompleteTasksTableComponent } from '@tasks/table/complete-tasks-table.component';
import { PendingTasksTableComponent } from '@tasks/table/pending-tasks-table.component';
import { TasksTableComponent } from '@tasks/table/tasks-table.component';

/* Task modules */
import { TasksButtonBarModule } from '@tasks/button-bar/tasks-button-bar.module';
import { TasksButtonsModule } from '@tasks/buttons/tasks-buttons.module';
import { TasksDialogModule } from '@tasks/dialogs/tasks-dialog.module';

/**
 * Defines the components, services, and modules required to manage and view
 * Tasks.
 */
@NgModule({
    declarations: [
        CompleteTasksTableComponent,
        PendingTasksTableComponent,
        TasksTableComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule, 
        MatCheckboxModule,
        MatPaginatorModule, 
        MatProgressSpinnerModule, 
        MatSortModule, 
        MatTableModule, 
        MatSnackBarModule,
        ReactiveFormsModule,
        RouterModule,

        FontAwesomeModule,

        /* Task modules */
        TasksButtonBarModule,
        TasksButtonsModule,
        TasksDialogModule
    ],
    entryComponents: [
        CompleteTasksTableComponent,
        PendingTasksTableComponent,
    ]
})
export class TasksTableModule {}
