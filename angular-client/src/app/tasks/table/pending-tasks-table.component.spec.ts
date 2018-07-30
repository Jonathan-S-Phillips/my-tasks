import * as moment from 'moment';

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';

import { TasksTableModule } from './tasks-table.module';

import { PendingTasksTableComponent } from '@tasks/table/pending-tasks-table.component';
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

import { TableTestHelper } from '@mocks/table-test.helper';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';
import { TASKS } from '@tasks/mocks/seed/tasks';
import { TasksHelper } from '@tasks/mocks/tasks-helper';

describe('PendingTasksTableComponent', () => {

    let table: TableTestHelper;
    let rows: HTMLElement[];
    let displayedColumns: HTMLElement[];
    let tasksHelper: TasksHelper;
    let utilsService: MockUtilsService;
    let component: PendingTasksTableComponent;
    let fixture: ComponentFixture<PendingTasksTableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                HttpClientTestingModule,
                RouterTestingModule,

                /* app modules */
                TasksTableModule
            ],
            providers: [
                MockTaskService,
                MockUtilsService,
                { provide: LoggerService, useClass: ConsoleLoggerService },
                { provide: TaskService, useClass: MockTaskService },
                { provide: UtilsService, useClass: MockUtilsService }
            ]
        }).compileComponents();
    
        tasksHelper = new TasksHelper(TASKS);
        fixture = TestBed.createComponent(PendingTasksTableComponent);
        component = fixture.componentInstance;
        utilsService = TestBed.get(UtilsService);

        spyOn(utilsService, 'fullScreenDialogSub').and.callFake(() => {
            // do nothing
        });
    });

    describe('Large Screen', () => {

        beforeEach(async() => {
            utilsService.setIsMediumScreen(false);
            fixture.detectChanges();

            table = new TableTestHelper(fixture);
            displayedColumns = table.getDisplayedColumns();
            rows = table.getAllRows();
        });
    
        it('should initialize the table and display pending tasks by default', () => {
            let overDueRows = table.getHighlightedRows('row-red');
            let dueTodayRows = table.getHighlightedRows('row-orange');
            let dueTomorrowRows = table.getHighlightedRows('row-yellow');

            // then: the number of columns displayed should match the components default number of diplayedColumns
            expect(displayedColumns.length).toEqual(fixture.componentInstance.pendingTasks.displayedColumns.length);
    
            // and: every column except the first should match the text below
            expect(displayedColumns[1].innerText.trim()).toEqual('Name');
            expect(displayedColumns[2].innerText.trim()).toEqual('Priority');
            expect(displayedColumns[3].innerText.trim()).toEqual('Description');
            expect(displayedColumns[4].innerText.trim()).toEqual('Due Date');
    
            // and: the total number of rows should match the total pending tasks
            expect(rows.length).toEqual(tasksHelper.pendingTasks.length);
    
            // and: the table data should match the pendingTasks data
            for(let i:number = 0; i < rows.length; i++) {
                let row: HTMLElement = rows[i];
                expect(table.getCellByColumnIndex(row, 1).innerText).toEqual(tasksHelper.pendingTasks[i].name);
                expect(table.getCellByColumnIndex(row, 2).innerText).toEqual(tasksHelper.pendingTasks[i].priority);
                expect(table.getCellByColumnIndex(row, 3).innerText).toEqual(tasksHelper.pendingTasks[i].description);
                expect(table.getCellByColumnIndex(row, 4).innerText.trim()).toEqual(moment(tasksHelper.pendingTasks[i].dueDate, moment.ISO_8601, true).utc().format('MM/DD/YYYY'));
            }
    
            // and: the number of each row type (over Due, due today, due tomorrow, no warning) should match the expected num tasks of each type
            expect(overDueRows.length).toEqual(tasksHelper.tasksOverDue.length);
            expect(dueTodayRows.length).toEqual(tasksHelper.tasksDueToday.length);
            expect(dueTomorrowRows.length).toEqual(tasksHelper.tasksDueTomorrow.length);
            expect(rows.length - (overDueRows.length + dueTodayRows.length + dueTomorrowRows.length)).toEqual(tasksHelper.pendingTasks.length - (tasksHelper.tasksOverDue.length + tasksHelper.tasksDueToday.length + tasksHelper.tasksDueTomorrow.length))
        });
    });

    describe('Small to Medium Size Screens', () => {

        beforeEach(() => {
            utilsService.setIsMediumScreen(true);

            fixture.detectChanges();
    
            table = new TableTestHelper(fixture);
            displayedColumns = table.getDisplayedColumns();
            rows = table.getAllRows();
        });
    
        it('should initialize the table and display pending tasks by default', () => {
            let overDueRows = table.getHighlightedRows('row-red');
            let dueTodayRows = table.getHighlightedRows('row-orange');
            let dueTomorrowRows = table.getHighlightedRows('row-yellow');

            // then: the number of columns displayed should be 2 (the checkbox and the name columns)
            expect(displayedColumns.length).toEqual(2);
    
            // and: the total number of rows should match the total pending tasks
            expect(rows.length).toEqual(tasksHelper.pendingTasks.length);
    
            // and: the table data should match the pendingTasks data
            for(let i:number = 0; i < rows.length; i++) {
                let row: HTMLElement = rows[i];
                let cellContent: string = table.getCellByColumnIndex(row, 1).innerText;
                expect(cellContent).toContain(`Name: ${tasksHelper.pendingTasks[i].name}`);
                expect(cellContent).toContain(`Priority: ${tasksHelper.pendingTasks[i].priority}`);
                expect(cellContent).toContain(`Due Date: ${moment(tasksHelper.pendingTasks[i].dueDate, moment.ISO_8601, true).utc().format('MM/DD/YYYY')}`);
            }
    
            // and: the number of each row type (over Due, due today, due tomorrow, no warning) should match the expected num tasks of each type
            expect(overDueRows.length).toEqual(tasksHelper.tasksOverDue.length);
            expect(dueTodayRows.length).toEqual(tasksHelper.tasksDueToday.length);
            expect(dueTomorrowRows.length).toEqual(tasksHelper.tasksDueTomorrow.length);
            expect(rows.length - (overDueRows.length + dueTodayRows.length + dueTomorrowRows.length)).toEqual(tasksHelper.pendingTasks.length - (tasksHelper.tasksOverDue.length + tasksHelper.tasksDueToday.length + tasksHelper.tasksDueTomorrow.length))
        });

        it('should display the original columns when changing to large screen', () => {
            // when: the screen size changes
            utilsService.setIsMediumScreen(false);
            fixture.detectChanges();

            // then: every column except the first should match the text below
            displayedColumns = table.getDisplayedColumns();
            expect(displayedColumns[1].innerText.trim()).toEqual('Name');
            expect(displayedColumns[2].innerText.trim()).toEqual('Priority');
            expect(displayedColumns[3].innerText.trim()).toEqual('Description');
            expect(displayedColumns[4].innerText.trim()).toEqual('Due Date');

            // and: the table data should match the completeTasks data
            rows = table.getAllRows();
            for(let i:number = 0; i < rows.length; i++) {
                let row: HTMLElement = rows[i];
                expect(table.getCellByColumnIndex(row, 1).innerText).toEqual(tasksHelper.pendingTasks[i].name);
                expect(table.getCellByColumnIndex(row, 2).innerText).toEqual(tasksHelper.pendingTasks[i].priority);
                expect(table.getCellByColumnIndex(row, 3).innerText).toEqual(tasksHelper.pendingTasks[i].description);
                expect(table.getCellByColumnIndex(row, 4).innerText.trim()).toEqual(moment(tasksHelper.pendingTasks[i].dueDate, moment.ISO_8601, true).utc().format('MM/DD/YYYY'));
            }
        });
    });
});
