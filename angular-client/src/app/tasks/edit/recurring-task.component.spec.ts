/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/* app components */
import { RecurringTaskComponent } from './recurring-task.component';

/* app modules */
import { EditTaskModule } from './edit-task.module';

/* app models and services */
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service'; 
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks and helpers */
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';
import { MockMatDialog } from '@mocks/mat-dialog';

describe('RecurringTaskComponent', () => {
    let component: RecurringTaskComponent;
    let dialog: MockMatDialog;
    let fixture: ComponentFixture<RecurringTaskComponent>;
    let httpMock: HttpTestingController;
    let cancelButton: HTMLElement;
    let editButton: HTMLElement;
    let editButtonAttributes: NamedNodeMap;
    let radioButtonAll: HTMLElement;
    let radioButtonSingle: HTMLElement;

    beforeEach(async(() => {
        let task: Task = {
            name: 'Recurring Task',
            priority: 'Low',
            description: 'Create a recurring Task',
            dueDate: moment().startOf('day').utc().toDate(),
            repeats: 'daily',
            endsAfter: 5
        } as Task;

        TestBed.configureTestingModule({
        imports: [
            NoopAnimationsModule,
            HttpClientTestingModule,
            RouterTestingModule,
            
            /* app modules */
            EditTaskModule
        ],
        providers: [
            MockTaskService,
            MockUtilsService,
            { provide: MatDialogRef, useClass: MockMatDialog },
	        { provide: MAT_DIALOG_DATA, useValue: { data: task } },
            { provide: TaskService, useClass: MockTaskService },
            { provide: UtilsService, useClass: MockUtilsService }
        ]
        }).compileComponents();

        fixture = TestBed.createComponent(RecurringTaskComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.get(HttpTestingController);
        dialog = TestBed.get(MatDialogRef);
        fixture.detectChanges();

        cancelButton = fixture.debugElement.nativeElement.querySelector('.marker-action-cancel');
        editButton = fixture.debugElement.nativeElement.querySelector('.marker-action-edit');
        editButtonAttributes = editButton.attributes as NamedNodeMap;

        radioButtonAll = fixture.debugElement.nativeElement.querySelector('.marker-radio-button-all');
        radioButtonSingle = fixture.debugElement.nativeElement.querySelector('.marker-radio-button-single');
    }));

    // Make sure there are no outstanding requests after each test
    afterEach(() =>{
        httpMock.verify();
    });

    it('should initialize the form with edit button disabled', () => {
        expect(editButtonAttributes.getNamedItem('disabled').value).toEqual('');
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

    it('should emit updateAll=false value and close dialog when all selected and edit button clicked', async() => {
        // and: a spy for the dialog close method
        let closeDialog = spyOn(dialog, 'close');
        
        // setup: click the "all" radio button value 
        component.editRecurringTaskForm.get('updateAll').setValue('single');
        radioButtonAll.click();
        radioButtonAll.dispatchEvent(new Event('input'));
        fixture.detectChanges(); // detect changes so edit button enabled

        // when: the complete button is clicked
        editButton.click();
        fixture.detectChanges();
        await fixture.whenStable();

        component.updateAll.subscribe((updateAll: boolean) => {
            // then: false should have been emitted
            expect(updateAll).toEqual(false);

            // and: the close method should have been called
            expect(closeDialog).toHaveBeenCalled();
        });
    });

    it('should emit updateAll=true value and close dialog when all selected and edit button clicked', async() => {
        // and: a spy for the dialog close method
        let closeDialog = spyOn(dialog, 'close');
        
        // setup: click the "all" radio button value 
        component.editRecurringTaskForm.get('updateAll').setValue('all');
        radioButtonAll.click();
        radioButtonAll.dispatchEvent(new Event('input'));
        fixture.detectChanges(); // detect changes so edit button enabled

        // when: the complete button is clicked
        editButton.click();
        fixture.detectChanges();
        await fixture.whenStable();

        component.updateAll.subscribe((updateAll: boolean) => {
            // then: true should have been emitted
            expect(updateAll).toEqual(true);

            // and: the close method should have been called
            expect(closeDialog).toHaveBeenCalled();
        });
    });

    it('should enable the edit button when radio button value set to "all"', () => {
        // setup: click the "all" radio button value 
        component.editRecurringTaskForm.get('updateAll').setValue('all');
        radioButtonAll.click();
        radioButtonAll.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        // expect: the edit button should be enabled
        expect(editButtonAttributes.getNamedItem('disabled')).toBeNull();
    });

    it('should enable the edit button when radio button value set to "single"', () => {
        // setup: click the "single" radio button value
        component.editRecurringTaskForm.get('updateAll').setValue('single'); 
        radioButtonSingle.click();
        radioButtonSingle.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        editButtonAttributes = editButton.attributes as NamedNodeMap;

        // expect: the edit button should be enabled
        expect(editButtonAttributes.getNamedItem('disabled')).toBeNull();
    });
});