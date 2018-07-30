/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/* app components */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';
import { ConfirmDeleteTaskComponent } from '@tasks/dialogs/confirm-delete-task/confirm-delete-task.component';
import { ConfirmDeleteTaskModule } from './confirm-delete-task.module';

/* app models and services */
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service'; 
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks and helpers */
import { MockMatDialog } from '@mocks/mat-dialog';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';

describe('ConfirmDeleteTaskComponent', () => {
    let component: ConfirmDeleteTaskComponent;
    let fixture: ComponentFixture<ConfirmDeleteTaskComponent>;
    let cancelButton: HTMLElement;
    let deleteButton: HTMLElement;
    let deleteButtonAttributes: NamedNodeMap;
    let dialog: MockMatDialog;
    let dialogData: any;

    let task1: Task = {
        id: 1,
        name: 'Create unit test for complete tasks',
        priority: 'Low',
        description: 'Create unit test to make sure the form initializes properly with complete tasks',
        dueDate: moment().startOf('day').utc().toDate(),
        isComplete: false,
        repeats: 'noRepeat'
    } as Task;

    describe('single Task', () => {
    
        beforeEach(() => {
            dialogData = { tasks: [task1] };
            fixture = setup(dialogData);
            component = fixture.componentInstance;
            dialog = TestBed.get(MatDialogRef);
            fixture.detectChanges();
    
            cancelButton = fixture.debugElement.nativeElement.querySelector('.marker-action-cancel');
            deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-action-delete');
            deleteButtonAttributes = deleteButton.attributes as NamedNodeMap;
        });
    
        it('should initialize with text for single Task and delete button enabled', () => {
            let text = fixture.debugElement.nativeElement.querySelector('.mat-dialog-content');
            expect(text.innerText.trim()).toEqual('Are you sure you want to delete the selected task?');
            expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
        });
    
        it('should call method to close dialog when cancel button clicked', async() => {
            // setup: create a spy for the close method on the dialog
            let closeDialog = spyOn(dialog, 'close');
            
            // when: the cancel button is clicked
            cancelButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
    
            // then: the close method should have been called
            expect(closeDialog).toHaveBeenCalled();
        });
    
        it('should emit delete Task event and close dialog when delete button is clicked', async() => {
            // setup: create a spy for the close method on the dialog
            let closeDialog = spyOn(dialog, 'close');
    
            // when: the delete button is clicked
            deleteButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
    
            component.deleteTask.subscribe((deleteTask: boolean) => {
                // then: true should have been emitted
                expect(deleteTask).toEqual(true);
    
                // and: the close method should have been called
                expect(closeDialog).toHaveBeenCalled();
            });
    
            // then: the delete method should have been called
            expect(closeDialog).toHaveBeenCalled();
        });
    });

    describe('multiple Tasks', () => {
        
        beforeEach(async(() => {
            let task2 = task1;
            task2.id = 2;
            dialogData = { tasks: [task1, task2] };
            fixture = setup(dialogData);
            component = fixture.componentInstance;
            dialog = TestBed.get(MatDialogRef);
            fixture.detectChanges();

            deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-action-delete');
        }));

        it('should initialize with text for multiple Tasks and delete button enabled', () => {
            let text = fixture.debugElement.nativeElement.querySelector('.mat-dialog-content');
            expect(text.innerText.trim()).toEqual('Are you sure you want to delete the selected 2 tasks?');
            expect(deleteButtonAttributes.getNamedItem('disabled')).toBeNull();
        });

        it('should emit delete Task event and close dialog when delete button is clicked', async() => {
            // setup: create a spy for the close method on the dialog
            let closeDialog = spyOn(dialog, 'close');
    
            // when: the delete button is clicked
            deleteButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
    
            component.deleteTask.subscribe((deleteTask: boolean) => {
                // then: true should have been emitted
                expect(deleteTask).toEqual(true);
    
                // and: the close method should have been called
                expect(closeDialog).toHaveBeenCalled();
            });
    
            // then: the delete method should have been called
            expect(closeDialog).toHaveBeenCalled();
        });
    });
});

function setup(dialogData: { tasks: Task[] }) {
    TestBed.configureTestingModule({
        imports: [
            NoopAnimationsModule,
            FormsModule,
            HttpClientTestingModule,
            ReactiveFormsModule,
            RouterTestingModule,
            
            /* app modules */
            ConfirmDeleteTaskModule
        ],
        providers: [
            MockTaskService,
            MockUtilsService,
            { provide: LoggerService, useClass: ConsoleLoggerService },
            { provide: MatDialogRef, useClass: MockMatDialog },
            { provide: MAT_DIALOG_DATA, useValue: dialogData },
            { provide: TaskService, useClass: MockTaskService },
            { provide: UtilsService, useClass: MockUtilsService }
        ]
    }).compileComponents();

    let fixture = TestBed.createComponent(ConfirmDeleteTaskComponent);

    return fixture;
}