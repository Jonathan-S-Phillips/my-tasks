/* angular libraries */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Task module components */
import { EditTaskComponent } from '@tasks/edit/edit-task.component';
import { CompleteTasksTableComponent } from '@tasks/table/complete-tasks-table.component';
import { PendingTasksTableComponent } from '@tasks/table/pending-tasks-table.component';
import { TasksComponent } from '@tasks/tasks.component';

/* The routes within the Tasks module. Defaults to the PendingTasksTableComponent. */
const routes: Routes = [
    {
        path: 'tasks',
        component: TasksComponent,
        children: [
            {
                path:'pending',
                component: PendingTasksTableComponent
            },
            {
                path:'complete',
                component: CompleteTasksTableComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'pending'
            },
            {
                path:':id',
                component: EditTaskComponent,              
            }
        ]
    }
];

/**
 * The router module for the Tasks module.
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TasksRoutingModule { }
