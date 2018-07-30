/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaste } from '@fortawesome/free-solid-svg-icons';

// Add icons to fortawesome/fontawesome-svg-core library for convenient access in components
library.add(faPaste);

/* app modules */
import { TaskFormModule } from '@tasks/form/task-form.module';

/* Task shared components and services */
import { CreateTaskComponent } from '@tasks/dialogs/create-task/create-task.component';

/**
 * Defines the components, services, and modules required to manage and view
 * Tasks.
 */
@NgModule({
    declarations: [
        CreateTaskComponent
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
        ReactiveFormsModule,
        RouterModule,

        FontAwesomeModule,

        /* app modules */
        TaskFormModule
    ],
    entryComponents: [
        CreateTaskComponent
    ]
})
export class CreateTaskModule {}
