/* angular libraries */
import { Component, ViewChild } from '@angular/core';

/* app */
import { TasksTableComponent } from '@tasks/table/tasks-table.component';

/**
 * A wrapper for the TasksTableComponent which only displays pending Tasks.
 */
@Component({
    selector: 'pending-tasks-table',
    templateUrl: './pending-tasks-table.component.html',
    styleUrls: ['./pending-tasks-table.component.css']
})
export class PendingTasksTableComponent {

    /** The table containing the pending Tasks. */
    @ViewChild('pendingTasks') pendingTasks: TasksTableComponent; 
}
