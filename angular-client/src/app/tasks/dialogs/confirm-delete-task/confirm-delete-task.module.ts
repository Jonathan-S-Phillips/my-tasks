/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';

/* fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faTrash);

/* module */
import { ConfirmDeleteTaskComponent } from '@tasks/dialogs/confirm-delete-task/confirm-delete-task.component';

/**
 * Defines the components, services, and modules required to delete Tasks.
 */
@NgModule({
    declarations: [
        ConfirmDeleteTaskComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        RouterModule,

        FontAwesomeModule
    ],
    entryComponents: [
        ConfirmDeleteTaskComponent
    ]
})
export class ConfirmDeleteTaskModule {}
