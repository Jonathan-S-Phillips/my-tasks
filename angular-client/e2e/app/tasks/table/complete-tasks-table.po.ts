import { browser, element, by } from 'protractor';

import { TasksTable } from './tasks-table.po';

export class CompleteTasksTable extends TasksTable {

    constructor() {
        super('.marker-complete-tasks-table');
    }
}
