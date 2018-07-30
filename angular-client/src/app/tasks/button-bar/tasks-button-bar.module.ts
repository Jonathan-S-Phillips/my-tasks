/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDialogModule, MatPaginatorModule } from '@angular/material';
import { RouterModule } from '@angular/router';

/* fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faCheck, faEdit, faPaste, faTrash } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faArrowLeft, faCheck, faCheckSquare, faEdit, faPaste, faTrash);

/* module */
import { ButtonBarComponent } from './button-bar.component';
import { TasksButtonsModule } from '@tasks/buttons/tasks-buttons.module'; 

/**
 * Defines the components, services, and modules required for the button
 * bar.
 */
@NgModule({
    declarations: [
        ButtonBarComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatDialogModule,
        MatPaginatorModule,
        RouterModule,

        FontAwesomeModule,
        
        TasksButtonsModule
    ],
    exports : [
        ButtonBarComponent
    ]
})
export class TasksButtonBarModule {}
