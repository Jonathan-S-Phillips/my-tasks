/* angular libraries */
import { Component, ViewChild } from '@angular/core';

/* app */
import { TasksTableComponent } from '@tasks/table/tasks-table.component';

/**
 * A wrapper for the TasksTableComponent which only displays complete Tasks.
 */
@Component({
    selector: 'complete-tasks-table',
    templateUrl: './complete-tasks-table.component.html',
    styleUrls: ['./complete-tasks-table.component.css']
})
export class CompleteTasksTableComponent {

    /** The table containing the complete Tasks. */
    @ViewChild('completedTasks') completedTasks: TasksTableComponent;
}
