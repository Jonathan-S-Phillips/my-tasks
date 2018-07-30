/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { TestBed, async, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/* app components */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';
import { CreateTaskComponent } from '@tasks/dialogs/create-task/create-task.component';

import { CreateTaskModule } from './create-task.module';

/* app shared imports */
import { TaskService } from '@tasks/shared/services/task.service'; 
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks and helpers */
import { InputFieldTestHelper } from '@mocks/input-field-test.helper';
import { SelectMenuTestHelper } from '@mocks/select-menu-test.helper';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';

describe('CreateTaskComponent', () => {
    let component: CreateTaskComponent;
    let fixture: ComponentFixture<CreateTaskComponent>;
    let httpMock: HttpTestingController;
    let today: moment.Moment;
    let createButton: HTMLElement;
    let createButtonAttributes: NamedNodeMap;
    let mainPropertiesForm: FormGroup;
    let repeatPropertiesForm: FormGroup;
    let nameInput: InputFieldTestHelper;
    let descriptionInput: InputFieldTestHelper;
    let dueDateInput: InputFieldTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [
            NoopAnimationsModule,
            FormsModule,
            HttpClientTestingModule,
            ReactiveFormsModule,
            RouterTestingModule,
            
            /* app modules */
            CreateTaskModule
        ],
        providers: [
            MockTaskService,
            MockUtilsService,
            { provide: LoggerService, useClass: ConsoleLoggerService },
            { provide: MatDialogRef, useValue: {} },
	        { provide: MAT_DIALOG_DATA, useValue: [] },
            { provide: TaskService, useClass: MockTaskService },
            { provide: UtilsService, useClass: MockUtilsService }
        ]
        }).compileComponents();

        today = moment().startOf('day').utc();

        fixture = TestBed.createComponent(CreateTaskComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.get(HttpTestingController);

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let nameElement = fixture.debugElement.nativeElement.querySelector('.marker-input-name');
            let descriptionElement = fixture.debugElement.nativeElement.querySelector('.marker-input-description');
            let dueDateElement = fixture.debugElement.nativeElement.querySelector('.marker-input-due-date'); 

            // setup helpers for the input fields on the form
            nameInput = new InputFieldTestHelper(fixture, nameElement);
            descriptionInput = new InputFieldTestHelper(fixture, descriptionElement);
            dueDateInput = new InputFieldTestHelper(fixture, dueDateElement);
        });
    });

    // Make sure there are no outstanding requests after each test
    afterEach(() =>{
        httpMock.verify();
    });

    describe("Non-Repeating Task", () => {
    
        beforeEach(async(() => {
            fixture.detectChanges();
        
            mainPropertiesForm = component.taskFormComponent.mainPropertiesForm;

            createButton = fixture.debugElement.nativeElement.querySelector('.marker-action-create');
            createButtonAttributes = createButton.attributes as NamedNodeMap;
        }));
    
        it('should initialize dialog with create button disabled', () => {
            expect(createButtonAttributes.getNamedItem('disabled').value).toBe('');
        });
    
        it('should enable the create button when the mainPropertiesForm is valid', () => {        
            // when: the values on the required input fields are set
            nameInput.setValue('New Task', 'change');
            descriptionInput.setValue('Create unit test to make sure form works correctly for new Tasks', 'change');
            dueDateInput.setValue(today.format('MM/DD/YYYY'), 'dateChange');
            fixture.detectChanges();
        
            // then: the mainPropertiesForm should be valid
            expect(mainPropertiesForm.valid).toEqual(true);

            // and: the create button should be enabled
            expect(createButtonAttributes.getNamedItem('disabled')).toBeNull();
        });
    });
    
    describe('Repeat Task', () => {
        
        let afterInput: InputFieldTestHelper;
        let repeatSelectMenu: SelectMenuTestHelper;
        let repeatOptions: HTMLElement[];
    
        beforeEach(async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                mainPropertiesForm = component.taskFormComponent.mainPropertiesForm;
                repeatPropertiesForm = component.taskFormComponent.repeatPropertiesForm;
        
                nameInput.setValue('New repeating Task');
                descriptionInput.setValue('Create unit test to make sure form works correctly for new repeating Tasks');
                dueDateInput.setValue(today.format('MM/DD/YYYY'));

                // set the attributes from the afterElement
                let afterElement = fixture.debugElement.nativeElement.querySelector('.marker-input-after');
                afterInput = new InputFieldTestHelper(fixture, afterElement);

                createButton = fixture.debugElement.nativeElement.querySelector('.marker-action-create');
                createButtonAttributes = createButton.attributes as NamedNodeMap;
            });
        }));
    
        it('should enable/disable create button when "repeats" set to "Daily" and "after" valid/invalid', fakeAsync(() => {
            // setup helpers for the select "repeats" field and its options 
            repeatSelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-repeats', '.marker-option-repeats'); 
            repeatSelectMenu.triggerMenu();
            repeatOptions = repeatSelectMenu.getOptions();
            repeatSelectMenu.cleanup();
        
            // when: the "Daily" option is selected
            repeatSelectMenu.selectOption(repeatOptions[1]);
        
            // then: the repeatPropertiesForm should be invalid and the create button should be disabled
            expect(repeatPropertiesForm.valid).toEqual(false); 
            expect(createButtonAttributes.getNamedItem('disabled').value).toBe('');
        
            // when: a valid value is added to the "after" input field
            afterInput.setValue('5');
        
            // then: the repeatPropertiesForm should be valid and the create button should be enabled
            expect(repeatPropertiesForm.valid).toEqual(true);
            expect(createButtonAttributes.getNamedItem('disabled')).toBeNull();
        }));
    
        it('enable/disable create button when "repeats" set to "Weekly" and "after" valid/invalid', fakeAsync(() => {
            // setup helpers for the select "repeats" field and its options 
            repeatSelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-repeats', '.marker-option-repeats'); 
            repeatSelectMenu.triggerMenu();
            repeatOptions = repeatSelectMenu.getOptions();
            repeatSelectMenu.cleanup();
        
            // when: the "Weekly" option is selected
            repeatSelectMenu.selectOption(repeatOptions[2]);
        
            // then: the repeatPropertiesForm should be invalid and the create button should be disabled
            expect(repeatPropertiesForm.valid).toEqual(false); 
            expect(createButtonAttributes.getNamedItem('disabled').value).toBe('');
        
            // when: a valid value is added to the "after" input field
            afterInput.setValue('5');
        
            // then: the repeatPropertiesForm should be valid and the create button should be enabled
            expect(repeatPropertiesForm.valid).toEqual(true);
            expect(createButtonAttributes.getNamedItem('disabled')).toBeNull();
        }));
    
        it('enable/disable create button when "repeats" set to "Monthly" and "after" valid/invalid', fakeAsync(() => {
            // setup helpers for the select "repeats" field and its options 
            repeatSelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-repeats', '.marker-option-repeats'); 
            repeatSelectMenu.triggerMenu();
            repeatOptions = repeatSelectMenu.getOptions();
            repeatSelectMenu.cleanup();
        
            // when: the "Monthly" option is selected
            repeatSelectMenu.selectOption(repeatOptions[3]);
        
            // then: the repeatPropertiesForm should be invalid and the create button should be disabled
            expect(repeatPropertiesForm.valid).toEqual(false); 
            expect(createButtonAttributes.getNamedItem('disabled').value).toBe('');
        
            // when: a valid value is added to the "after" input field
            afterInput.setValue('5');
        
            // then: the repeatPropertiesForm should be valid and the create button should be enabled
            expect(repeatPropertiesForm.valid).toEqual(true);
            expect(createButtonAttributes.getNamedItem('disabled')).toBeNull();
        }));
    
        it('enable/disable create button when "repeats" set to "Yearly" and "after" valid/invalid', fakeAsync(() => {
            // setup helpers for the select "repeats" field and its options 
            repeatSelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-repeats', '.marker-option-repeats'); 
            repeatSelectMenu.triggerMenu();
            repeatOptions = repeatSelectMenu.getOptions();
            repeatSelectMenu.cleanup();
        
            // when: the "Yearly" option is selected
            repeatSelectMenu.selectOption(repeatOptions[4]);
        
            // then: the repeatPropertiesForm should be invalid and the create button should be disabled
            expect(repeatPropertiesForm.valid).toEqual(false); 
            expect(createButtonAttributes.getNamedItem('disabled').value).toBe('');
        
            // when: a valid value is added to the "after" input field
            afterInput.setValue('5');
        
            // then: the repeatPropertiesForm should be valid and the create button should be enabled
            expect(repeatPropertiesForm.valid).toEqual(true);
            expect(createButtonAttributes.getNamedItem('disabled')).toBeNull();
        }));
    });
});
