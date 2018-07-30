import { browser, element, by } from 'protractor';

import { TasksTable } from './tasks-table.po';

export class PendingTasksTable extends TasksTable {

    constructor() {
        super('.marker-pending-tasks-table');
    }
}