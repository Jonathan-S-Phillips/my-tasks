/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule } from '@angular/material';

/* module */
import { TaskFormComponent } from '@tasks/form/task-form.component';

/**
 * Defines the components, services, and modules required for the Task form.
 */
@NgModule({
    declarations: [
        TaskFormComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule, 
        MatNativeDateModule,
        MatSelectModule, 
        ReactiveFormsModule
    ],
    exports : [
        TaskFormComponent
    ]
})
export class TaskFormModule {}
