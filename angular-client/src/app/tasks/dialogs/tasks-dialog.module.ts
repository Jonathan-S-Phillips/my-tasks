/* angular libraries */
import { NgModule } from '@angular/core';

/* module */
import { CompleteTaskModule } from '@tasks/dialogs/complete-task/complete-task.module';
import { ConfirmDeleteTaskModule } from '@tasks/dialogs/confirm-delete-task/confirm-delete-task.module';
import { TaskFormModule } from '@tasks/form/task-form.module';

/**
 * Defines the components, services, and modules required for dialogs.
 */
@NgModule({
    imports: [
        /* app modules */
        CompleteTaskModule,
        ConfirmDeleteTaskModule,
        TaskFormModule
    ]
})
export class TasksDialogModule {}
