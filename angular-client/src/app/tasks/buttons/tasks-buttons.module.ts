/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDialogModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';

/* fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faCheck, faEdit, faPaste, faTrash } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faArrowLeft, faCheck, faCheckSquare, faEdit, faPaste, faTrash);

/* app */
import { ButtonsComponent } from '@tasks/buttons/buttons.component';

/**
 * Defines the components, services, and modules required for main buttons
 * to manage one or more Tasks. The main management capabilities for Tasks 
 * include completing, deleting, and editing.
 */
@NgModule({
    declarations: [
        ButtonsComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatDialogModule,
        MatTooltipModule,
        RouterModule,

        FontAwesomeModule
    ],
    exports : [
        ButtonsComponent
    ]
})
export class TasksButtonsModule {}
