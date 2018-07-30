import * as moment from 'moment';

import { Location } from "@angular/common";
import { Component, DebugElement } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

/* app modules */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';

import { TasksTableModule } from './tasks-table.module';

import { TasksTableComponent } from '@tasks/table/tasks-table.component';
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

import { TableTestHelper } from '@mocks/table-test.helper';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';
import { TASKS } from '@tasks/mocks/seed/tasks';
import { TasksHelper } from '@tasks/mocks/tasks-helper';

@Component({
    template: ''
})
class DummyComponent {
}

describe('TasksTableComponent', () => {

    let table: TableTestHelper;
    let location: Location;
    let params: Subject<Params>;
    let route: ActivatedRoute;
    let router: Router;
    let rows: HTMLElement[];
    let completeButton: HTMLElement;
    let completeButtonAttributes: NamedNodeMap;
    let displayedColumns: HTMLElement[];
    let deleteButton: HTMLElement;
    let deleteButtonAttributes: NamedNodeMap;
    let editButton: HTMLElement;
    let editButtonAttributes: NamedNodeMap;
    let checkBoxInstances: DebugElement[];
    let tasksHelper: TasksHelper;
    let taskService: TaskService;
    let utilsService: MockUtilsService;
    let component: TasksTableComponent;
    let fixture: ComponentFixture<TasksTableComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async(() => {
        params = new Subject<Params>();
        params.next({ filter: '' });

        TestBed.configureTestingModule({
            declarations: [
                DummyComponent
            ],
            imports: [
                NoopAnimationsModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    {
                        path: 'tasks',
                        component: TasksTableComponent
                    },
                    {
                        path:'tasks/:id',
                        component: DummyComponent
                    }
                ]),

                TasksTableModule
            ],
            providers: [
                MockTaskService,
                MockUtilsService,
                { provide: ActivatedRoute, useValue: { params: params } },
                { provide: LoggerService, useClass: ConsoleLoggerService },
                { provide: TaskService, useClass: MockTaskService },
                { provide: UtilsService, useClass: MockUtilsService }
            ]
        }).compileComponents();

        tasksHelper = new TasksHelper(TASKS);
        route = TestBed.get(ActivatedRoute);
        router = TestBed.get(Router); 
        location = TestBed.get(Location); 
        fixture = TestBed.createComponent(TasksTableComponent);
        router.initialNavigation(); 
        component = fixture.componentInstance;
        httpMock = TestBed.get(HttpTestingController);
        taskService = TestBed.get(TaskService);
        utilsService = TestBed.get(UtilsService);

        spyOn(utilsService, 'fullScreenDialogSub').and.callFake(() => {
            // do nothing
        });
    }));

    describe('Large Screen', () => {

        beforeEach(async(() => {
            utilsService.setIsMediumScreen(false);
        }));

        describe('Complete Tasks', () => {

            beforeEach(async(() => {
                component.displayedColumns = ["select", "name", "priority", "description", "dueDate", "dateCompleted"];
                component.isComplete = true;
                //component.ngOnInit();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    table = new TableTestHelper(fixture);

                    completeButton = fixture.debugElement.nativeElement.querySelector('.marker-button-complete-task');
                    completeButtonAttributes = completeButton.attributes as NamedNodeMap;
                    deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-button-delete-task');
                    deleteButtonAttributes = deleteButton.attributes as NamedNodeMap;
                    editButton = fixture.debugElement.nativeElement.querySelector('.marker-button-edit-task');
                    editButtonAttributes = editButton.attributes as NamedNodeMap;
                    
                    displayedColumns = table.getDisplayedColumns();
                    rows = table.getAllRows();
        
                    checkBoxInstances = fixture.debugElement.queryAll(By.css('mat-row mat-checkbox'));
        
                    // expect: the delete and edit buttons should be disabled by default
                    expect(deleteButtonAttributes.getNamedItem('disabled').value).toBe('');
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                });
            }));
    
            it('should initialize the table and display complete tasks', () => {
                // setup: get the highlighted rows
                let overDueRows = table.getHighlightedRows('row-red');
                let dueTodayRows = table.getHighlightedRows('row-orange');
                let dueTomorrowRows = table.getHighlightedRows('row-yellow');
    
                // then: the number of columns displayed should match the components default number of diplayedColumns
                expect(displayedColumns.length).toEqual(fixture.componentInstance.displayedColumns.length);
        
                // and: every column except the first should match the text below
                expect(displayedColumns[1].innerText.trim()).toEqual('Name');
                expect(displayedColumns[2].innerText.trim()).toEqual('Priority');
                expect(displayedColumns[3].innerText.trim()).toEqual('Description');
                expect(displayedColumns[4].innerText.trim()).toEqual('Due Date');
                expect(displayedColumns[5].innerText.trim()).toEqual('Date Completed');
        
                // and: the total number of rows should match total complete Tasks
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
    
            it('should redirect to "/tasks/:id" when a row is clicked', async() => {
                // when: a row is clicked
                rows[0].click();
                fixture.detectChanges();
                await fixture.whenStable();
    
                // then: the route should change to /tasks/:id
                expect(location.path()).toBe(`/tasks/${tasksHelper.completeTasks[0].id}`);
            });
    
            it('should not display any over due Tasks when the taskFilter changes to "overDue"', () => {
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter('overdue');
                fixture.detectChanges();
    
                // then: there should be no rows in the table
                expect(table.getAllRows().length).toEqual(0);
            });
    
            it('should display the Tasks due or completed today when the taskFilter changes to todays date', () => {
                // setup: todays date
                let today = moment().startOf('day').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter(today.format('MM/DD/YYYY'));
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates or date completed equal to today's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    // get the text content from the due date and date completed cells and compare them with today's date
                    let dueDateCell = table.getCellByColumnIndex(rows[i], 4).textContent
                    let dueDate: moment.Moment = moment(dueDateCell, 'MM/DD/YYYY', true).startOf('day').utc();
                    let dateCompletedCell = table.getCellByColumnIndex(rows[i], 5).textContent.trim()
                    let dateCompleted: moment.Moment = moment(dateCompletedCell, 'MM/DD/YYYY', true).startOf('day').utc();
    
                    // expect: the dueDate or dateCompleted to match todays date
                    expect(dueDate.isSame(today) || dateCompleted.isSame(today)).toEqual(true);
                }
            });
    
            it('should display Tasks due tomorrow when the taskFilter changes to tomorrows date', () => {
                // setup: tomorrow's date
                let tomorrow = moment().startOf('day').add(1, 'days').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter(tomorrow.format('MM/DD/YYYY'));
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates equal to tomorrow's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    // get the text content from the due date cell and compare it with today's date
                    let dueDateCell = table.getCellByColumnIndex(rows[i], 4).textContent.trim()
                    let dueDate: moment.Moment = moment(dueDateCell, 'MM/DD/YYYY', true).startOf('day').utc();

                    // expect: the dueDate to match tomorrow's date
                    expect(dueDate.isSame(tomorrow)).toEqual(true);
                }
            });
    
            describe('checkbox selected in header', () => {
    
                beforeEach(() => {
                    // check the checkbox in the header
                    let checkBoxInstance = fixture.debugElement.query(By.css('mat-header-cell mat-checkbox')).nativeElement;
                    checkBoxInstance.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the header
                    let checkBoxInstance = fixture.debugElement.query(By.css('mat-header-cell mat-checkbox')).nativeElement;
                    checkBoxInstance.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should disable the edit button and enable the delete button in toolbar', () => {
                    // expect: the delete button should be enabled
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
    
                    // and: the edit and complete buttons should be disabled
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                    expect(completeButtonAttributes.getNamedItem('disabled').value).toEqual('');
                });
            });
    
            describe('checkbox selected in multiple rows', () => {
    
                beforeEach(() => {
                    // check the checkboxes in the first two rows
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    checkBoxInstances[1].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkboxes in the first two rows
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    checkBoxInstances[1].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should disable the edit button and enable the delete button in toolbar when more than 1 row is checked', () => {
                    // expect: the delete button should be enabled
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
    
                    // and: the edit and complete buttons should be disabled
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                    expect(completeButtonAttributes.getNamedItem('disabled').value).toEqual('');
                });
            });
    
            describe('checkbox selected in one row', () => {
    
                beforeEach(() => {
                    // check the checkbox in the first row
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the first row
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should enable the edit and delete button in toolbar', () => {
                    // expect: the delete and edit buttons should be enabled
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
                    expect(editButtonAttributes.getNamedItem('disabled')).toBeNull();
    
                    // and: the complete button should be disabled
                    expect(completeButtonAttributes.getNamedItem('disabled').value).toEqual('');
                });
            });
        });
    
        describe('Pending Tasks', ()=> {
    
            beforeEach(async(() => {
                fixture.detectChanges();
    
                table = new TableTestHelper(fixture);
                displayedColumns = table.getDisplayedColumns();
                rows = table.getAllRows();
    
                completeButton = fixture.debugElement.nativeElement.querySelector('.marker-button-complete-task');
                completeButtonAttributes = completeButton.attributes as NamedNodeMap;
                deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-button-delete-task');
                deleteButtonAttributes = deleteButton.attributes as NamedNodeMap;
                editButton = fixture.debugElement.nativeElement.querySelector('.marker-button-edit-task');
                editButtonAttributes = editButton.attributes as NamedNodeMap;
                checkBoxInstances = fixture.debugElement.queryAll(By.css('mat-row mat-checkbox'));
    
                // expect: the delete and edit buttons should be disabled by default
                expect(deleteButtonAttributes.getNamedItem('disabled').value).toBe('');
                expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
            }));
    
            it('should initialize the table and display pending tasks by default', () => {
                let overDueRows = table.getHighlightedRows('row-red');
                let dueTodayRows = table.getHighlightedRows('row-orange');
                let dueTomorrowRows = table.getHighlightedRows('row-yellow');
    
                // then: the number of columns displayed should match the components default number of diplayedColumns
                expect(displayedColumns.length).toEqual(fixture.componentInstance.displayedColumns.length);
        
                // and: every column except the first should match the text below
                expect(displayedColumns[1].innerText.trim()).toEqual('Name');
                expect(displayedColumns[2].innerText.trim()).toEqual('Priority');
                expect(displayedColumns[3].innerText.trim()).toEqual('Description');
                expect(displayedColumns[4].innerText.trim()).toEqual('Due Date');
        
                // and: the total number of rows should match the total pending Tasks
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
    
            it('should redirect to "/tasks/:id" when a row is clicked', async() => {
                // when: a row is clicked
                rows[0].click();
                fixture.detectChanges();
                await fixture.whenStable();
    
                // then: the route should change to /tasks/:id
                expect(location.path()).toBe(`/tasks/${tasksHelper.pendingTasks[0].id}`);
            });
    
            it('should display the over due Tasks when the taskFilter changes to "overDue"', () => {
                // setup: todays date
                let today = moment().startOf('day').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter('overDue');
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates less than today's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    // get the text content from the due date cell and compare it with today's date
                    let dueDateCell = table.getCellByColumnIndex(rows[i], 4).textContent.trim()
                    let dueDate: moment.Moment = moment(dueDateCell, 'MM/DD/YYYY', true).startOf('day').utc();

                    // expect: the dueDate to be less than todays date
                    expect(dueDate < today).toEqual(true);
                }
            });
    
            it('should display the Tasks due today when the taskFilter changes to todays date', () => {
                // setup: todays date
                let today = moment().startOf('day').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter(today.format('MM/DD/YYYY'));
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates equal to today's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    // get the text content from the due date cell and compare it with today's date
                    let dueDateCell = table.getCellByColumnIndex(rows[i], 4).textContent.trim()
                    let dueDate: moment.Moment = moment(dueDateCell, 'MM/DD/YYYY', true).startOf('day').utc();

                    // expect: the dueDate to match todays date
                    expect(dueDate.isSame(today)).toEqual(true);
                }
            });
    
            it('should display the Tasks due tomorrow when the taskFilter changes to tomorrows date', () => {
                // setup: tomorrow's date
                let tomorrow = moment().startOf('day').add(1, 'days').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter(tomorrow.format('MM/DD/YYYY'));
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates equal to tomorrow's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    // get the text content from the due date cell and compare it with today's date
                    let dueDateCell = table.getCellByColumnIndex(rows[i], 4).textContent.trim()
                    let dueDate: moment.Moment = moment(dueDateCell, 'MM/DD/YYYY', true).startOf('day').utc();

                    // expect the dueDate to match tomorrows date
                    expect(dueDate.isSame(tomorrow)).toEqual(true);
                }
            });
    
            describe('checkbox selected in header', () => {
    
                beforeEach(() => {
                    // check the checkbox in the header
                    let checkBoxInstance = fixture.debugElement.query(By.css('mat-header-cell mat-checkbox')).nativeElement;
                    checkBoxInstance.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the header
                    let checkBoxInstance = fixture.debugElement.query(By.css('mat-header-cell mat-checkbox')).nativeElement;
                    checkBoxInstance.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should disable the edit button and enable the delete button in toolbar', () => {
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                });
            });
    
            describe('checkbox selected in multiple rows', () => {
    
                beforeEach(() => {
                    // check the checkbox in the first two rows
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    checkBoxInstances[1].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the first two rows
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    checkBoxInstances[1].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should disable the edit button and enable the delete button in toolbar when more than 1 row is checked', () => {
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                });
            });
    
            describe('checkbox selected in one row', () => {
    
                beforeEach(() => {
                    // check the checkbox in the first row
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the first row
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should enable the edit and delete button in toolbar', () => {
                    // then: the delete and edit buttons should be enabled
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
                    expect(editButtonAttributes.getNamedItem('disabled')).toBeNull();
                });
            });
        });
    });

    describe('Small to Medium Size Screens', () => {

        beforeEach(() => {
            utilsService.setIsMediumScreen(true);
        });

        describe('Complete Tasks', () => {

            beforeEach(async(() => {
                component.displayedColumns = ["select", "name", "priority", "description", "dueDate", "dateCompleted"];
                component.isComplete = true;
    
                fixture.detectChanges();
    
                table = new TableTestHelper(fixture);
                displayedColumns = table.getDisplayedColumns();
                rows = table.getAllRows();
    
                checkBoxInstances = fixture.debugElement.queryAll(By.css('mat-row mat-checkbox'));

                // setup the buttons once the screen size changes to ensure we have the correct buttons for the tests
                completeButton = fixture.debugElement.nativeElement.querySelector('.marker-button-complete-task');
                completeButtonAttributes = completeButton.attributes as NamedNodeMap;
                deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-button-delete-task');
                deleteButtonAttributes = deleteButton.attributes as NamedNodeMap;
                editButton = fixture.debugElement.nativeElement.querySelector('.marker-button-edit-task');
                editButtonAttributes = editButton.attributes as NamedNodeMap;
    
                // expect: the delete and edit buttons should be disabled by default
                expect(deleteButtonAttributes.getNamedItem('disabled').value).toBe('');
                expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
            }));

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
    
            it('should redirect to "/tasks/:id" when a row is clicked', async() => {
                // when: a row is clicked
                rows[0].click();
                fixture.detectChanges();
                await fixture.whenStable();
    
                // then: the route should change to /tasks/:id
                expect(location.path()).toBe(`/tasks/${tasksHelper.completeTasks[0].id}`);
            });

            it('should not display any over due Tasks when the taskFilter changes to "overDue"', () => {
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter('overDue');
                fixture.detectChanges();
    
                // then: there should be no rows in the table
                expect(table.getAllRows().length).toEqual(0);
            });
    
            it('should display the Tasks due or completed today when the taskFilter changes to todays date', () => {
                // setup: todays date
                let today = moment().startOf('day').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter(today.format('MM/DD/YYYY'));
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates or date completed equal to today's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    let row: HTMLElement = rows[i];
                    let cellContent: string = table.getCellByColumnIndex(row, 1).innerText;
                    expect(cellContent).toContain(today.format('MM/DD/YYYY'));
                }
            });
    
            it('should display Tasks due tomorrow when the taskFilter changes to tomorrows date', () => {
                // setup: tomorrow's date
                let tomorrow = moment().startOf('day').add(1, 'days').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter(tomorrow.format('MM/DD/YYYY'));
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates equal to tomorrow's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    let row: HTMLElement = rows[i];
                    let cellContent: string = table.getCellByColumnIndex(row, 1).innerText;
                    expect(cellContent).toContain(`Due Date: ${tomorrow.format('MM/DD/YYYY')}`);
                }
            });

            describe('checkbox selected in header', () => {
    
                beforeEach(() => {
                    // check the checkbox in the header
                    let checkBoxInstance = fixture.debugElement.query(By.css('mat-header-cell mat-checkbox')).nativeElement;
                    checkBoxInstance.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck check the checkbox in the header
                    let checkBoxInstance = fixture.debugElement.query(By.css('mat-header-cell mat-checkbox')).nativeElement;
                    checkBoxInstance.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should disable the edit button and enable the delete button in toolbar', () => {
                    // expect: the delete button should be enabled
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
    
                    // and: the edit and complete buttons should be disabled
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                    expect(completeButtonAttributes.getNamedItem('disabled').value).toEqual('');
                });
            });
    
            describe('checkbox selected in multiple rows', () => {
    
                beforeEach(() => {
                    // check the checkbox in the first two rows
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    checkBoxInstances[1].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the first two rows
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    checkBoxInstances[1].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should disable the edit button and enable the delete button in toolbar when more than 1 row is checked', () => {
                    // expect: the delete button should be enabled
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
    
                    // and: the edit and complete buttons should be disabled
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                    expect(completeButtonAttributes.getNamedItem('disabled').value).toEqual('');
                });
            });
    
            describe('checkbox selected in one row', () => {
    
                beforeEach(() => {
                    // check the checkbox in the first row
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the first row
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should enable the edit and delete button in toolbar', () => {
                    // expect: the delete and edit buttons should be enabled
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
                    expect(editButtonAttributes.getNamedItem('disabled')).toBeNull();
    
                    // and: the complete button should be disabled
                    expect(completeButtonAttributes.getNamedItem('disabled').value).toEqual('');
                });
            });
        });

        describe('Pending Tasks', () => {
    
            beforeEach(async(() => {
                fixture.detectChanges();
    
                table = new TableTestHelper(fixture);
                displayedColumns = table.getDisplayedColumns();
                rows = table.getAllRows();
    
                checkBoxInstances = fixture.debugElement.queryAll(By.css('mat-row mat-checkbox'));

                completeButton = fixture.debugElement.nativeElement.querySelector('.marker-button-complete-task');
                completeButtonAttributes = completeButton.attributes as NamedNodeMap;
                deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-button-delete-task');
                deleteButtonAttributes = deleteButton.attributes as NamedNodeMap;
                editButton = fixture.debugElement.nativeElement.querySelector('.marker-button-edit-task');
                editButtonAttributes = editButton.attributes as NamedNodeMap;
    
                // expect: the delete and edit buttons should be disabled by default
                expect(deleteButtonAttributes.getNamedItem('disabled').value).toBe('');
                expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
            }));
    
            it('should initialize the table and display pending tasks by default', () => {
                let overDueRows = table.getHighlightedRows('row-red');
                let dueTodayRows = table.getHighlightedRows('row-orange');
                let dueTomorrowRows = table.getHighlightedRows('row-yellow');
    
                // then: the number of columns displayed should be 2 (the checkbox and the name columns)
                expect(displayedColumns.length).toEqual(2);
        
                // and: the total number of rows should match the total complete tasks
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
    
            it('should redirect to "/tasks/:id" when a row is clicked', async() => {
                // when: a row is clicked
                rows[0].click();
                fixture.detectChanges();
                await fixture.whenStable();
    
                // then: the route should change to /tasks/:id
                expect(location.path()).toBe(`/tasks/${tasksHelper.pendingTasks[0].id}`);
            });
    
            it('should display the over due Tasks when the taskFilter changes to "overDue"', () => {
                // setup: todays date
                let today = moment().startOf('day').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter('overDue');
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates less than today's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    let row: HTMLElement = rows[i];
                    // parse the dueDate from the mat-cell content
                    let cellContent: string = table.getCellByColumnIndex(row, 1).innerText;
                    let dueDateString: string = cellContent.substr(cellContent.indexOf('Due Date: ') + 10, cellContent.length-1).trim();
                    let dueDate: moment.Moment = moment(dueDateString, 'MM/DD/YYYY', true).startOf('day').utc();
                    
                    // the dueDate should be less than todays date
                    expect(dueDate < today).toEqual(true);
                }
            });
    
            it('should display the Tasks due today when the taskFilter changes to todays date', () => {
                // setup: todays date
                let today = moment().startOf('day').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter(today.format('MM/DD/YYYY'));
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates equal to today's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    let row: HTMLElement = rows[i];
                    let cellContent: string = table.getCellByColumnIndex(row, 1).innerText;
                    expect(cellContent).toContain(`Due Date: ${today.format('MM/DD/YYYY')}`);
                }
            });
    
            it('should display the Tasks due tomorrow when the taskFilter changes to tomorrows date', () => {
                // setup: tomorrow's date
                let tomorrow = moment().startOf('day').add(1, 'days').utc();
    
                // when: the task filter value changes in the TaskService
                taskService.setTaskFilter(tomorrow.format('MM/DD/YYYY'));
                fixture.detectChanges();
    
                // then: all visible rows in the table should have due dates equal to tomorrow's date
                let rows = table.getAllRows();
                for(let i: number = 0; i < rows.length; i++) {
                    let row: HTMLElement = rows[i];
                    let cellContent: string = table.getCellByColumnIndex(row, 1).innerText;
                    expect(cellContent).toContain(`Due Date: ${tomorrow.format('MM/DD/YYYY')}`);
                }
            });
    
            describe('checkbox selected in header', () => {
    
                beforeEach(() => {
                    // check the checkbox in the header
                    let checkBoxInstance = fixture.debugElement.query(By.css('mat-header-cell mat-checkbox')).nativeElement;
                    checkBoxInstance.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the header
                    let checkBoxInstance = fixture.debugElement.query(By.css('mat-header-cell mat-checkbox')).nativeElement;
                    checkBoxInstance.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should disable the edit button and enable the delete button in toolbar', () => {
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                });
            });
    
            describe('checkbox selected in multiple rows', () => {
    
                beforeEach(() => {
                    // check the checkbox in the first two rows
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    checkBoxInstances[1].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                afterEach(() => {
                    // uncheck the checkbox in the first two rows
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    checkBoxInstances[1].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                });
    
                it('should disable the edit button and enable the delete button in toolbar when more than 1 row is checked', () => {
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
                    expect(editButtonAttributes.getNamedItem('disabled').value).toBe('');
                });
            });
    
            describe('checkbox selected in one row', () => {
    
                beforeEach(async(() => {
                    // check the checkbox in the first row
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                }));
    
                afterEach(async(() => {
                    // uncheck the checkbox in the first row
                    checkBoxInstances[0].nativeElement.querySelector('input').click();
                    fixture.detectChanges();
                }));
    
                it('should enable the edit and delete button in toolbar', () => {
                    expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
                    expect(editButtonAttributes.getNamedItem('disabled')).toBeNull();
                });
            });
        });
    });
});

// class DialogTestHelper {
//     private _container: OverlayContainer;
//     private _containerElement: HTMLElement;
//     private _dialog: MatDialog;
  
//     public constructor() {
//       inject([MatDialog, OverlayContainer], (d: MatDialog, oc: OverlayContainer) => {
//         this._dialog = d;
//         this._container = oc;
//         this._containerElement = oc.getContainerElement();
//       })
//     }
  
//     public cleanup() {
//       this._container.ngOnDestroy();
//     }
// }
