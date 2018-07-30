import * as moment from 'moment';

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/* app modules */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';

import { TasksTableModule } from '@tasks/table/tasks-table.module';

import { CompleteTasksTableComponent } from '@tasks/table/complete-tasks-table.component';
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

import { TableTestHelper } from '@mocks/table-test.helper';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';
import { TASKS } from '@tasks/mocks/seed/tasks';
import { TasksHelper } from '@tasks/mocks/tasks-helper';

describe('CompleteTasksTableComponent', () => {

    let table: TableTestHelper;
    let rows: HTMLElement[];
    let displayedColumns: HTMLElement[];
    let tasksHelper: TasksHelper;
    let utilsService: MockUtilsService;
    let component: CompleteTasksTableComponent;
    let fixture: ComponentFixture<CompleteTasksTableComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async(() => {
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
        fixture = TestBed.createComponent(CompleteTasksTableComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.get(HttpTestingController);
        utilsService = TestBed.get(UtilsService);

        spyOn(utilsService, 'fullScreenDialogSub').and.callFake(() => {
            // do nothing
        });
    }));

    describe('Large Screen', () => {

        beforeEach(() => {
            utilsService.setIsMediumScreen(false);
            fixture.detectChanges();

            table = new TableTestHelper(fixture);
            displayedColumns = table.getDisplayedColumns();
            rows = table.getAllRows();
        });
    
        it('should initialize the table and display complete tasks', () => {
            let overDueRows = table.getHighlightedRows('row-red');
            let dueTodayRows = table.getHighlightedRows('row-orange');
            let dueTomorrowRows = table.getHighlightedRows('row-yellow');

            // then: the number of columns displayed should match the components default number of diplayedColumns
            expect(displayedColumns.length).toEqual(component.completedTasks.displayedColumns.length);
    
            // and: every column except the first should match the text below
            expect(displayedColumns[1].innerText.trim()).toEqual('Name');
            expect(displayedColumns[2].innerText.trim()).toEqual('Priority');
            expect(displayedColumns[3].innerText.trim()).toEqual('Description');
            expect(displayedColumns[4].innerText.trim()).toEqual('Due Date');
            expect(displayedColumns[5].innerText.trim()).toEqual('Date Completed');
    
            // and: the total number of rows should match the total complete Tasks
            expect(rows.length).toEqual(tasksHelper.completeTasks.length);
    
            // and: the table data should match the pendingTasks data
            for(let i:number = 0; i < rows.length; i++) {
                let row: HTMLElement = rows[i];
                expect(table.getCellByColumnIndex(row, 1).innerText).toEqual(tasksHelper.completeTasks[i].name);
                expect(table.getCellByColumnIndex(row, 2).innerText).toEqual(tasksHelper.completeTasks[i].priority);
                expect(table.getCellByColumnIndex(row, 3).innerText).toEqual(tasksHelper.completeTasks[i].description);
                expect(table.getCellByColumnIndex(row, 4).innerText).toEqual(moment(tasksHelper.completeTasks[i].dueDate, moment.ISO_8601, true).utc().format('MM/DD/YYYY'));
                expect(table.getCellByColumnIndex(row, 5).innerText.trim()).toEqual(moment(tasksHelper.completeTasks[i].dateCompleted, moment.ISO_8601, true).utc().format('MM/DD/YYYY'));
            }
    
            // and: the number of each row type (over Due, due today, due tomorrow, no warning) should all be 0
            expect(overDueRows.length).toEqual(0);
            expect(dueTodayRows.length).toEqual(0);
            expect(dueTomorrowRows.length).toEqual(0);
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

        it('should initialize the table and display complete tasks', () => {
            let overDueRows = table.getHighlightedRows('row-red');
            let dueTodayRows = table.getHighlightedRows('row-orange');
            let dueTomorrowRows = table.getHighlightedRows('row-yellow');

            // then: the number of columns displayed should be 2 (the checkbox and the name columns)
            expect(displayedColumns.length).toEqual(2);
    
            // and: the total number of rows should match the total complete tasks
            expect(rows.length).toEqual(tasksHelper.completeTasks.length);
    
            // and: the data in the name column should match the expected data for small to medium screens
            for(let i:number = 0; i < rows.length; i++) {
                let row: HTMLElement = rows[i];
                let cellContent: string = table.getCellByColumnIndex(row, 1).innerText;
                expect(cellContent).toContain(`Name: ${tasksHelper.completeTasks[i].name}`);
                expect(cellContent).toContain(`Priority: ${tasksHelper.completeTasks[i].priority}`);
                expect(cellContent).toContain(`Due Date: ${moment(tasksHelper.completeTasks[i].dueDate, moment.ISO_8601, true).utc().format('MM/DD/YYYY')}`);
                expect(cellContent).toContain(`Date Completed: ${moment(tasksHelper.completeTasks[i].dateCompleted, moment.ISO_8601, true).utc().format('MM/DD/YYYY')}`);
            }
    
            // and: the number of each row type (over Due, due today, due tomorrow, no warning) should all be 0
            expect(overDueRows.length).toEqual(0);
            expect(dueTodayRows.length).toEqual(0);
            expect(dueTomorrowRows.length).toEqual(0);
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
            expect(displayedColumns[5].innerText.trim()).toEqual('Date Completed');

            // and: the table data should match the completeTasks data
            rows = table.getAllRows();
            for(let i:number = 0; i < rows.length; i++) {
                let row: HTMLElement = rows[i];
                expect(table.getCellByColumnIndex(row, 1).innerText).toEqual(tasksHelper.completeTasks[i].name);
                expect(table.getCellByColumnIndex(row, 2).innerText).toEqual(tasksHelper.completeTasks[i].priority);
                expect(table.getCellByColumnIndex(row, 3).innerText).toEqual(tasksHelper.completeTasks[i].description);
                expect(table.getCellByColumnIndex(row, 4).innerText).toEqual(moment(tasksHelper.completeTasks[i].dueDate, moment.ISO_8601, true).utc().format('MM/DD/YYYY'));
                expect(table.getCellByColumnIndex(row, 5).innerText.trim()).toEqual(moment(tasksHelper.completeTasks[i].dateCompleted, moment.ISO_8601, true).utc().format('MM/DD/YYYY'));
            }
        });
    });
});
