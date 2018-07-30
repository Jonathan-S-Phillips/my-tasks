/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { RouterModule } from '@angular/router';

/* fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faCheck, faCheckSquare);

/* module */
import { CompleteTaskComponent } from '@tasks/dialogs/complete-task/complete-task.component';

/**
 * Defines the components, services, and modules required to complete Tasks.
 */
@NgModule({
    declarations: [
        CompleteTaskComponent,
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

        FontAwesomeModule
    ],
    entryComponents: [
        CompleteTaskComponent,
    ]
})
export class CompleteTaskModule {}
