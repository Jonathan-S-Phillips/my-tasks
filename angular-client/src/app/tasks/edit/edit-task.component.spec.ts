/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

/* app components */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';
import { EditTaskComponent } from './edit-task.component';
import { EditTaskModule } from '@tasks/edit/edit-task.module';

/* app shared imports */
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service'; 
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks and helpers */
import { MockMatDialog } from '@mocks/mat-dialog';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';

describe('EditTaskComponent', () => {
    let component: EditTaskComponent;
    let dialog: MockMatDialog;
    let fixture: ComponentFixture<EditTaskComponent>;
    let httpMock: HttpTestingController;
    let taskService: TaskService;
    let today: moment.Moment;
    let cancelButton: HTMLElement;
    let completeButton: HTMLElement;
    let deleteButton: HTMLElement;
    let updateButton: HTMLElement;
    let updateButtonAttributes: NamedNodeMap;
    let dateCompletedForm: FormGroup;
    let mainPropertiesForm: FormGroup;
    let repeatPropertiesForm: FormGroup;

    describe("Complete Task", () => {

        today = moment().startOf('day').utc();
        let task: Task = {
            id: 1,
            name: 'Create unit test for complete tasks',
            priority: 'Low',
            description: 'Create unit test to make sure the form initializes properly with complete tasks',
            dueDate: today.toDate(),
            dateCompleted: today.toDate(),
            isComplete: true,
            repeats: 'noRepeat'
        } as Task;

        beforeEach(async(() => {
            initTestBed({ id: task.id });

            fixture = TestBed.createComponent(EditTaskComponent);
            component = fixture.componentInstance;
            dialog = TestBed.get(MatDialog);
            httpMock = TestBed.get(HttpTestingController);
            taskService = TestBed.get(TaskService);
            spyOn(taskService, 'get').and.returnValue(Observable.of(task));

            fixture.detectChanges();

            // get the FormGroups from the component for easy access in tests
            dateCompletedForm = component.taskFormComponent.dateCompletedForm;
            mainPropertiesForm = component.taskFormComponent.mainPropertiesForm;
            repeatPropertiesForm = component.taskFormComponent.repeatPropertiesForm;

            cancelButton = fixture.debugElement.nativeElement.querySelector('.marker-action-cancel');
            completeButton = fixture.debugElement.nativeElement.querySelector('.marker-button-complete-task');
            deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-button-delete-task');
            updateButton = fixture.debugElement.nativeElement.querySelector('.marker-action-update');
            updateButtonAttributes = updateButton.attributes as NamedNodeMap;
        }));

        it('should initialize the form with update button enabled and no complete button', () => {
            expect(updateButtonAttributes.getNamedItem('disabled')).toBeNull();
            expect(completeButton).toBeNull();
        });

        it('should call method to close dialog when cancel button clicked', () => {
            // setup: create a spy for the cancel method
            let cancel = spyOn(component, 'cancel');
            
            // when: the cancel button is clicked
            cancelButton.click();
            fixture.detectChanges();

            // then: the close method should have been called
            expect(cancel).toHaveBeenCalled();
        });

        it('should emit the update event and close dialog when properties updated and update button clicked', () => {
            // setup: subscribe to the update EventEmitter
            let updateEventValue: string;
            component.onUpdate.subscribe((value: string) => {
                updateEventValue = value;
            });

            // and: update the name on the form
            mainPropertiesForm.get('name').setValue('Create unit test for updating complete tasks');
            fixture.detectChanges();

            // when: the update button is clicked
            updateButton.click();
            fixture.detectChanges();

            // then: the Task name should be updated
            expect(component.task.name).toEqual('Create unit test for updating complete tasks');
            
            // and: the updateEventValue should match the text below
            expect(updateEventValue).toEqual('Task Updated Successfully'); 
        });

        it('should not update the Task due or completed dates even if somehow updated on form', () => {
            // setup: update the due date
            let newDate = moment().startOf('day').add(1, 'days').utc().toDate();
            dateCompletedForm.get('dateCompleted').setValue(newDate);
            mainPropertiesForm.get('due').setValue(newDate);

            // when: the update button is clicked
            updateButton.click();
            fixture.detectChanges();

            // then: the Task due and completed date should not change
            expect(today.isSame(moment(component.task.dueDate, moment.ISO_8601, true).utc())).toEqual(true);
            expect(today.isSame(moment(component.task.dateCompleted, moment.ISO_8601, true).utc())).toEqual(true);
        });
    });

    describe("Pending Non-Repeating Task", () => {

        let task: Task = {
            id: 1,
            name: 'Create unit test',
            priority: 'Low',
            description: 'Create unit test to make sure the form initializes with pre-populated task',
            dueDate: moment().startOf('day').utc().toDate(),
            isComplete: false,
            repeats: 'noRepeat'
        } as Task;

        beforeEach(async(() => {
            initTestBed({ id: task.id });
            today = moment().startOf('day').utc();

            fixture = TestBed.createComponent(EditTaskComponent);
            component = fixture.componentInstance;
            dialog = TestBed.get(MatDialog);
            httpMock = TestBed.get(HttpTestingController);
            taskService = TestBed.get(TaskService);
            spyOn(taskService, 'get').and.returnValue(Observable.of(task));

            fixture.detectChanges();

            // get the FormGroups from the component for easy access in tests
            mainPropertiesForm = component.taskFormComponent.mainPropertiesForm;
            repeatPropertiesForm = component.taskFormComponent.repeatPropertiesForm;
        
            cancelButton = fixture.debugElement.nativeElement.querySelector('.marker-action-cancel');
            completeButton = fixture.debugElement.nativeElement.querySelector('.marker-button-complete-task');
            deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-button-delete-task');
            updateButton = fixture.debugElement.nativeElement.querySelector('.marker-action-update');
            updateButtonAttributes = updateButton.attributes as NamedNodeMap;
        }));

        it('should initialize the form with update button enabled and complete button visible', () => {
            expect(updateButtonAttributes.getNamedItem('disabled')).toBeNull();
            expect(completeButton).toBeDefined();
        });

        it('should call method to close dialog when cancel button clicked', () => {
            // setup: create a spy for the cancel method
            let cancel = spyOn(component, 'cancel');
            
            // when: the cancel button is clicked
            cancelButton.click();
            fixture.detectChanges();

            // then: the close method should have been called
            expect(cancel).toHaveBeenCalled();
        });

        it('should call method to open the confirm delete dialog when delete button clicked', async() => {
            // setup: install a spy on the open method
            dialog.componentInstance.deleteTask = Observable.of('');
            let spy: jasmine.Spy = spyOn(dialog, 'open').and.returnValue(dialog);

            // when: the delete button in the toolbar is clicked
            deleteButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            // then: the method to open the confirm delete Task dialog should have been called
            expect(spy).toHaveBeenCalled();
        });

        it('should call method to open complete dialog when complete button clicked', async() => {
            // setup: install a spy on the open method
            dialog.componentInstance.completeTask = Observable.of('');
            let spy: jasmine.Spy = spyOn(dialog, 'open').and.returnValue(dialog);

            // when: the complete button is clicked
            completeButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            // then: the method to open the complete Task dialog should have been called
            expect(spy).toHaveBeenCalled();
        });

        it('should emit the update event and close dialog when properties updated and update button clicked', () => {
            // setup: subscribe to the update EventEmitter
            let updateEventValue: string;
            component.onUpdate.subscribe((value: string) => {
                updateEventValue = value;
            });

            // and: update the name and due date on the form
            let newDate = moment().startOf('day').add(1, 'days').utc();
            mainPropertiesForm.get('name').setValue('Create unit test for updating complete tasks');
            mainPropertiesForm.get('due').setValue(newDate.toDate());

            // when: the update button is clicked
            updateButton.click();
            fixture.detectChanges();

            // then: the Task name and due date should be updated
            expect(component.task.name).toEqual('Create unit test for updating complete tasks');
            expect(newDate.isSame(moment(component.task.dueDate, moment.ISO_8601, true))).toEqual(true);

            // and: the updateEventValue should match the text below
            expect(updateEventValue).toEqual('Task Updated Successfully'); 
        });
    });

    describe("Pending Repeating Task", () => {

        let dialogOpenSpy: jasmine.Spy;
        let task: Task = {
            id: 1,
            name: 'Create unit test',
            priority: 'Low',
            description: 'Create unit test to make sure the form initializes with pre-populated task',
            dueDate: moment().startOf('day').utc().toDate(),
            isComplete: false,
            repeats: 'daily',
            endsAfter: 5
        } as Task;

        beforeEach(async(() => {
            initTestBed({ id: task.id });
            today = moment().startOf('day').utc();

            fixture = TestBed.createComponent(EditTaskComponent);
            component = fixture.componentInstance;
            dialog = TestBed.get(MatDialog);
            httpMock = TestBed.get(HttpTestingController);
            taskService = TestBed.get(TaskService);
            dialog.componentInstance.updateAll = Observable.of(true);
            dialogOpenSpy = spyOn(dialog, 'open').and.returnValue(dialog);
            spyOn(taskService, 'get').and.returnValue(Observable.of(task));
        }));

        it('should call the method to open the recurring Task dialog', async(() => {
            // setup: install a spy on the open method
            let spy: jasmine.Spy = spyOn(component, 'openRecurringTaskDialog').and.callThrough();
            fixture.detectChanges();

            // expect: the method to open the recurring Task dialog should have been called
            expect(dialogOpenSpy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
        }));
    });
});

@Component({
    template: ''
})
class DummyComponent {}

function initTestBed(params) {
    TestBed.configureTestingModule({
        declarations: [
            DummyComponent
        ],
        imports: [
            NoopAnimationsModule,
            FormsModule,
            HttpClientTestingModule,
            ReactiveFormsModule,
            RouterTestingModule.withRoutes([
                {
                    path:'pending',
                    component: DummyComponent
                },
                {
                    path:'complete',
                    component: DummyComponent
                }
            ]),
            
            /* app modules */
            EditTaskModule
        ],
        providers: [
            MockTaskService,
            MockUtilsService,
            { provide: ActivatedRoute, useValue: { params: Observable.of(params) } },
            { provide: LoggerService, useClass: ConsoleLoggerService },
            { provide: MatDialog, useClass: MockMatDialog },
            { provide: TaskService, useClass: MockTaskService },
            { provide: UtilsService, useClass: MockUtilsService }
        ]
    }).compileComponents();
}
