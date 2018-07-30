/* angular libraries */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/* app components */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';
import { TasksFilterComponent } from '@tasks/filter/tasks-filter.component';
import { TasksFilterModule } from '@tasks/filter/tasks-filter.module';

/* app services */
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks and helpers */
import { InputFieldTestHelper } from '@mocks/input-field-test.helper';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';

describe('TasksFilterComponent', () => {

    let component: TasksFilterComponent;
    let fixture: ComponentFixture<TasksFilterComponent>;
    let httpMock: HttpTestingController;
    let taskFilterInput: InputFieldTestHelper;
    let taskFilterElement: any;
    let taskService: MockTaskService;
    let utilsService: MockUtilsService;
  
    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [
            NoopAnimationsModule,
            HttpClientTestingModule,

            /* app modules */
            TasksFilterModule
        ],
        providers: [
            MockTaskService,
            MockUtilsService,
            { provide: LoggerService, useClass: ConsoleLoggerService },
            { provide: TaskService, useClass: MockTaskService },
            { provide: UtilsService, useClass: MockUtilsService }
        ]
        }).compileComponents();

        fixture = TestBed.createComponent(TasksFilterComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.get(HttpTestingController);
        taskService = TestBed.get(TaskService);
        utilsService = TestBed.get(UtilsService);

        taskFilterElement = fixture.debugElement.nativeElement.querySelector('.marker-input-task-filter');
        taskFilterInput = new InputFieldTestHelper(fixture, taskFilterElement);

        fixture.detectChanges();
    }));

    // Make sure there are no outstanding requests after each test
    afterEach(() =>{
        httpMock.verify();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should update taskFilter Observable in TaskService when input value changes', async() => {
        // setup: subscribe to the taskFilter Observable
        let filter;
        taskService.taskFilter.subscribe((value: string) => {
            filter = value;
        });
        
        // when: the taskFilter value is changed
        taskFilterInput.setValue('test value for task filter', 'keyup');
        fixture.detectChanges();
        await fixture.whenStable();

        // then: the filter should equal the value entered into the input field
        expect(filter).toEqual('test value for task filter');
    });

    describe('Large Screens', () => {

        it('should clear the filter when the clear button clicked', async() => {
            // given: the clear button
            let clearButton = fixture.debugElement.nativeElement.querySelector('.marker-button-clear-filter');

            // and: a value in the filter
            taskFilterInput.setValue('test value for task filter');
            fixture.detectChanges();

            // when: the clear button is clicked
            clearButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            // then: the filter input should be cleared
            expect(taskFilterInput.getValue()).toEqual('');
        });
    });

    describe('Small to Medium Size Screens', () => {

        beforeEach(async(() => {
            utilsService.setIsMediumScreen(true);
            fixture.detectChanges();
        }));

        it('should not see the clear filter button', () => {
            // given: the clear filter button
            let clearButton = fixture.debugElement.nativeElement.querySelector('.marker-button-clear-filter');
    
            // expect: the clear filter button should not be visible
            expect(clearButton).toBeNull();
        });
    });
});
