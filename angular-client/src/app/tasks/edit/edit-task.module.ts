/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatPaginatorIntl, MatPaginatorModule, MatRadioModule, MatTooltipModule, MatSnackBarModule } from '@angular/material';
import { RouterModule } from '@angular/router';

/* fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faEdit, faPaste, faTrash } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faCheck, faCheckSquare, faEdit, faPaste, faTrash);

/* app */
import { EditTaskComponent } from './edit-task.component';
import { RecurringTaskComponent } from './recurring-task.component';
import { TasksButtonBarModule } from '@tasks/button-bar/tasks-button-bar.module';
import { TasksDialogModule } from '@tasks/dialogs/tasks-dialog.module';
import { TaskFormModule } from '@tasks/form/task-form.module';
import { MatPaginatorCustom } from '@tasks/shared/util/mat-paginator-custom';

/**
 * Defines the components, services, and modules required to edit a Task.
 */
@NgModule({
    declarations: [
        EditTaskComponent,
        RecurringTaskComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule, 
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatPaginatorModule, 
        MatRadioModule,
        MatTooltipModule, 
        MatSnackBarModule,
        ReactiveFormsModule,
        RouterModule,

        FontAwesomeModule,

        /* Task modules */
        TasksButtonBarModule,
        TasksDialogModule,
        TaskFormModule
    ],
    entryComponents: [
        EditTaskComponent,
        RecurringTaskComponent
    ],
    providers: [
        MatPaginatorCustom,
        { provide: MatPaginatorIntl, useClass: MatPaginatorCustom }
    ]
})
export class EditTaskModule {}
