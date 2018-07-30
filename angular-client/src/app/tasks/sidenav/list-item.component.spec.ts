/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/* app components */
import { ListItemComponent } from '@tasks/sidenav/list-item.component';

/* app models */
import { Task } from '@tasks/shared/models/task.model';
import { SidenavTasksModule } from '@tasks/sidenav/sidenav-tasks.module';

/* app services */
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks and helpers */
import { MockTaskService } from '@tasks/mocks/task.service';
import { TASKS } from '@tasks/mocks/seed/tasks';
import { TasksHelper } from '@tasks/mocks/tasks-helper';

describe('ListItemComponent', () => {
    let component: ListItemComponent;
    let fixture: ComponentFixture<ListItemComponent>;
    let httpMock: HttpTestingController;
    let tasksHelper: TasksHelper;
    let taskService: TaskService;
  
    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [
            NoopAnimationsModule,
            HttpClientTestingModule,
            RouterTestingModule.withRoutes([
                { path: 'pending', component: ListItemComponent }
            ]),

            /* app modules */
            SidenavTasksModule
        ],
        providers: [
            MockTaskService,
            { provide: TaskService, useClass: MockTaskService },
            { provide: UtilsService, useClass: UtilsService }
        ]
        }).compileComponents();

        tasksHelper = new TasksHelper(TASKS);
        fixture = TestBed.createComponent(ListItemComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.get(HttpTestingController);
        taskService = TestBed.get(TaskService);

        fixture.detectChanges();
    }));

    // Make sure there are no outstanding requests after each test
    afterEach(() =>{
        httpMock.verify();
    });

    describe('Init', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });
    
        it('should load correct number of over due tasks and render "Over Due" button with badge', () => {
            // setup: add the buttonClass and text property values
            component.buttonClass = 'overDueBadge'
            component.text = 'Over Due';
            component.ngOnInit();
            fixture.detectChanges();

            // expect: the badge should match the number of Tasks over due
            const overDueBadge = fixture.debugElement.nativeElement.querySelector('.overDueBadge .mat-badge-content').innerHTML;
            expect(component.numTasksDue).toEqual(tasksHelper.tasksOverDue.length.toString());
            expect(overDueBadge).toEqual(tasksHelper.tasksOverDue.length.toString());
        });
    
        it('should load correct number of tasks due today and render "Due Today" button with badge', () => {
            // setup: add the buttonClass and text property values
            component.buttonClass = 'dueTodayBadge'
            component.text = 'Due Today';
            component.ngOnInit();
            fixture.detectChanges();

            // expect: the badge should match the number of Tasks due Today
            const dueTodayBadge = fixture.debugElement.nativeElement.querySelector('.dueTodayBadge .mat-badge-content').innerHTML;
            expect(component.numTasksDue).toEqual(tasksHelper.tasksDueToday.length.toString());
            expect(dueTodayBadge).toEqual(tasksHelper.tasksDueToday.length.toString());
        });
    
        it('should load correct number of tasks due tomorrow and render "Due Tomorrow" button with badge', () => {
            // setup: add the buttonClass and text property values
            component.buttonClass = 'dueTomorrowBadge'
            component.text = 'Due Tomorrow';
            component.ngOnInit();
            fixture.detectChanges();

            // expect: the badge should match the number of Tasks due Tomorrow
            const dueTomorrowBadge = fixture.debugElement.nativeElement.querySelector('.dueTomorrowBadge .mat-badge-content').innerHTML;
            expect(component.numTasksDue).toEqual(tasksHelper.tasksDueTomorrow.length.toString());
            expect(dueTomorrowBadge).toEqual(tasksHelper.tasksDueTomorrow.length.toString());
        });
    });

    describe('Subscriptions', () => {

        it('should update the number of over due Tasks when the value changes in the TaskService', async() => {
            // setup: add the buttonClass and text property values
            component.buttonClass = 'overDueBadge'
            component.text = 'Over Due';
            component.ngOnInit();
            fixture.detectChanges();

            // and: create 2 over due Tasks
            let date = moment().startOf('day').subtract(1, 'days').utc().toDate();
            let tasks: Task[] = [
                { 
                    name: 'task1',
                    priority: 'Low',
                    description: 'an over due task',
                    dueDate: date
                },
                {
                    name: 'task2',
                    priority: 'Low',
                    description: 'an over due task',
                    dueDate: date
                }
            ] as Task[];

            // when: the updateNumTasks is called (with simulated data for over due Tasks from above)
            taskService.updateNumTasks(tasks);
            fixture.detectChanges();
            await fixture.whenStable();

            // then: the numTasksOverDue and the overDueBadge should update to 2
            const badge = fixture.debugElement.nativeElement.querySelector('.overDueBadge .mat-badge-content').innerHTML;
            expect(component.numTasksDue).toEqual('2');
            expect(badge).toEqual('2');
        });

        it('should update the number of Tasks due today when the value changes in the TaskService', async() => {
            // setup: add the buttonClass and text property values
            component.buttonClass = 'dueTodayBadge'
            component.text = 'Due Today';
            component.ngOnInit();
            fixture.detectChanges();

            // and: create 2 over due Tasks
            let date = moment().startOf('day').utc().toDate();
            let tasks: Task[] = [
                { 
                    name: 'task1',
                    priority: 'Low',
                    description: 'a Task due today',
                    dueDate: date
                },
                {
                    name: 'task2',
                    priority: 'Low',
                    description: 'a Task due today',
                    dueDate: date
                }
            ] as Task[];

            // when: the updateNumTasks is called (with simulated data for over due Tasks from above)
            taskService.updateNumTasks(tasks);
            fixture.detectChanges();
            await fixture.whenStable();

            // then: the numTasksDueToday and the dueTodayBadge should update to 2
            const badge = fixture.debugElement.nativeElement.querySelector('.dueTodayBadge .mat-badge-content').innerHTML;
            expect(component.numTasksDue).toEqual('2');
            expect(badge).toEqual('2');
        });

        it('should update the number of Tasks due tomorrow when the value changes in the TaskService', async() => {
            // setup: add the buttonClass and text property values
            component.buttonClass = 'dueTomorrowBadge'
            component.text = 'Due Tomorrow';
            component.ngOnInit();
            fixture.detectChanges();

            // and: create 2 over due Tasks
            let date = moment().startOf('day').add(1, 'days').utc().toDate();
            let tasks: Task[] = [
                { 
                    name: 'task1',
                    priority: 'Low',
                    description: 'a Task due tomorrow',
                    dueDate: date
                },
                {
                    name: 'task2',
                    priority: 'Low',
                    description: 'a Task due tomorrow',
                    dueDate: date
                }
            ] as Task[];

            // when: the updateNumTasks is called (with simulated data for over due Tasks from above)
            taskService.updateNumTasks(tasks);
            fixture.detectChanges();
            await fixture.whenStable();

            // then: the numTasksDueTomorrow and the dueTomorrowBadge should update to 2
            const badge = fixture.debugElement.nativeElement.querySelector('.dueTomorrowBadge .mat-badge-content').innerHTML;
            expect(component.numTasksDue).toEqual('2');
            expect(badge).toEqual('2');
        });
    })
});
