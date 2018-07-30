/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/* app components */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';

import { CompleteTaskComponent } from '@tasks/dialogs/complete-task/complete-task.component';
import { CompleteTaskModule } from './complete-task.module';

/* app models and services */
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service'; 
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks and helpers */
import { InputFieldTestHelper } from '@mocks/input-field-test.helper';
import { MockMatDialog } from '@mocks/mat-dialog';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';

describe('CompleteTaskComponent', () => {
    let component: CompleteTaskComponent;
    let fixture: ComponentFixture<CompleteTaskComponent>;
    let cancelButton: HTMLElement;
    let completeButton: HTMLElement;
    let completeButtonAttributes: NamedNodeMap;
    let dateCompletedInput: InputFieldTestHelper;
    let dialog: MatDialogRef<CompleteTaskComponent>;

    let task: Task = {
        id: 1,
        name: 'Create unit test for complete tasks',
        priority: 'Low',
        description: 'Create unit test to make sure the form initializes properly with complete tasks',
        dueDate: moment().startOf('day').utc().toDate(),
        isComplete: false,
        repeats: 'noRepeat'
    } as Task;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                FormsModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                RouterTestingModule,
                
                /* app modules */
                CompleteTaskModule
            ],
            providers: [
                MockTaskService,
                MockUtilsService,
                { provide: LoggerService, useClass: ConsoleLoggerService },
                { provide: MatDialogRef, useClass: MockMatDialog },
                { provide: MAT_DIALOG_DATA, useValue: { tasks: [task] } },
                { provide: TaskService, useClass: MockTaskService },
                { provide: UtilsService, useClass: MockUtilsService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CompleteTaskComponent);
        component = fixture.componentInstance;
        dialog = TestBed.get(MatDialogRef);

        fixture.detectChanges();

        let dateCompletedElement = fixture.debugElement.nativeElement.querySelector('.marker-input-date-completed'); 
        dateCompletedInput = new InputFieldTestHelper(fixture, dateCompletedElement);

        cancelButton = fixture.debugElement.nativeElement.querySelector('.marker-action-cancel');
        completeButton = fixture.debugElement.nativeElement.querySelector('.marker-action-complete');
        completeButtonAttributes = completeButton.attributes as NamedNodeMap;
    }));

    it('should initialize the form with the complete button disabled', () => {
        expect(completeButtonAttributes.getNamedItem('disabled').value).toEqual('');
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

    it('should emit the task completed and close the dialog when the complete button is clicked', () => {
        // setup: a subscription for the complete event 
        let completeTask: Task;
        component.completeTask.subscribe((task: Task) => {
            completeTask = task;
        });

        // and: a spy for the dialog close method
        let closeSpy: jasmine.Spy = spyOn(dialog, 'close');
        
        // and: add a valid date to the dateCompleted input
        dateCompletedInput.setValue(moment().startOf('day').utc().format('MM/DD/YYYY'));
        fixture.detectChanges();

        // when: the complete button is clicked
        completeButton.click();
        fixture.detectChanges();

        // then: the completeTask should match the Task used in the test
        expect(completeTask).toEqual(task); 

        // and: the dialog close method should have been called
        expect(closeSpy).toHaveBeenCalled();
    });

    it('should enable the complete button when the date completed form is valid', () => {
        // setup: add a valid date to the dateCompleted input
        dateCompletedInput.setValue(moment().startOf('day').utc().format('MM/DD/YYYY'));
        fixture.detectChanges();

        // expect: the complete button should be enabled
        expect(completeButtonAttributes.getNamedItem('disabled')).toBeNull();
    });
});
