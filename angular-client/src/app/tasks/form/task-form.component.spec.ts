/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/* app shared imports */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';
import { TaskFormComponent } from '@tasks/form/task-form.component';
import { TaskFormModule } from './task-form.module';
import { Task } from '@tasks/shared/models/task.model';
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks and helpers */
import { InputFieldTestHelper } from '@mocks/input-field-test.helper';
import { SelectMenuTestHelper } from '@mocks/select-menu-test.helper';
import { MockUtilsService } from '@tasks/mocks/utils.service';

describe('TaskFormComponent', () => {
  
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let httpMock: HttpTestingController;

  let today: moment.Moment;
  let dateCompletedForm: FormGroup;
  let mainPropertiesForm: FormGroup;
  let repeatPropertiesForm: FormGroup;
  let afterInputAttributes: NamedNodeMap;
  let nameInput: InputFieldTestHelper;
  let descriptionInput: InputFieldTestHelper;
  let dueDateInput: InputFieldTestHelper;
  let priorityOptions: HTMLElement[];
  let prioritySelectMenu: SelectMenuTestHelper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent
      ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,

        TaskFormModule
      ],
      providers: [
        MockUtilsService,
        { provide: LoggerService, useClass: ConsoleLoggerService },
        { provide: UtilsService, useClass: MockUtilsService }
      ]
    }).compileComponents();

    today = moment().startOf('day').utc();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance.taskFormComponent;
    httpMock = TestBed.get(HttpTestingController);
    fixture.detectChanges();

    let nameElement = fixture.debugElement.nativeElement.querySelector('.marker-input-name');
    let descriptionElement = fixture.debugElement.nativeElement.querySelector('.marker-input-description');
    let dueDateElement = fixture.debugElement.nativeElement.querySelector('.marker-input-due-date'); 

    // setup helpers for the input fields on the form
    nameInput = new InputFieldTestHelper(fixture, nameElement);
    descriptionInput = new InputFieldTestHelper(fixture, descriptionElement);
    dueDateInput = new InputFieldTestHelper(fixture, dueDateElement);
  }));

  // Make sure there are no outstanding requests after each test
  afterEach(() =>{
    httpMock.verify();
  });

  describe("Create New Task", () => {

    let afterInput: InputFieldTestHelper;
    let repeatSelectMenu: SelectMenuTestHelper;
    let repeatOptions: HTMLElement[];

    beforeEach(async(() => {
      fixture.detectChanges();

      mainPropertiesForm = component.mainPropertiesForm;
      repeatPropertiesForm = component.repeatPropertiesForm;

      // set the attributes from the afterElement
      let afterElement = fixture.debugElement.nativeElement.querySelector('.marker-input-after');
      afterInputAttributes = afterElement.attributes as NamedNodeMap;
      afterInput = new InputFieldTestHelper(fixture, afterElement);
    }));

    it('should initialize the mainProperties form with default form values', () => {
      // expect: the main properties form should not be valid
      expect(mainPropertiesForm.valid).toEqual(false);

      // and: the priority and repeats elements are set to default values
      expect(mainPropertiesForm.value.priority).toEqual('Low');
      expect(repeatPropertiesForm.value.repeats).toEqual('noRepeat');
  
      // and: the main properties should not be defined
      expect(mainPropertiesForm.value.name).toBeUndefined();
      expect(mainPropertiesForm.value.description).toBeUndefined();
      expect(repeatPropertiesForm.value.after).toBeUndefined();
      expect(mainPropertiesForm.value.due).toBeNull();

      // and: the after input should also be disabled
      expect(afterInputAttributes.getNamedItem('disabled').value).toBe('');
    });

    it('should validate the mainPropertiesForm when all required fields are set with valid values', () => {
      // setup: subscribe to the formsValid EventEmitter 
      let formsValid: boolean;
      component.formValid.subscribe((value: boolean) => {
          formsValid = value;
      });

      // when: the values on the required input fields are set
      nameInput.setValue('New Task', 'change');
      descriptionInput.setValue('Create unit test to make sure form works correctly for new Tasks', 'change');
      dueDateInput.setValue(today.format('MM/DD/YYYY'), 'dateChange');

      // then: the mainPropertiesForm should be valid
      expect(mainPropertiesForm.valid).toEqual(true);

      // and: the forms valid event should be fired
      expect(formsValid).toEqual(true);
    });
  });

  describe('Create New Repeat Task', () => {
    
    let afterInput: InputFieldTestHelper;
    let formsValid: boolean;
    let repeatSelectMenu: SelectMenuTestHelper;
    let repeatOptions: HTMLElement[];

    beforeEach(async() => {
      fixture.detectChanges();
      mainPropertiesForm = component.mainPropertiesForm;
      repeatPropertiesForm = component.repeatPropertiesForm;

      nameInput.setValue('New repeating Task');
      descriptionInput.setValue('Create unit test to make sure form works correctly for new repeating Tasks');
      dueDateInput.setValue(today.format('MM/DD/YYYY'));

      // set the attributes from the afterElement
      let afterElement = fixture.debugElement.nativeElement.querySelector('.marker-input-after');
      afterInput = new InputFieldTestHelper(fixture, afterElement);

      // setup: subscribe to the formsValid EventEmitter 
      component.formValid.subscribe((value: boolean) => {
          formsValid = value;
      });
    });

    it('should invalidate repeatPropertiesForm when "repeats" set to "Daily"', fakeAsync(() => {
      // setup helpers for the select "repeats" field and its options 
      repeatSelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-repeats', '.marker-option-repeats'); 
      repeatSelectMenu.triggerMenu();
      repeatOptions = repeatSelectMenu.getOptions();
      repeatSelectMenu.cleanup();

      // when: the "Daily" option is selected
      repeatSelectMenu.selectOption(repeatOptions[1]);
      fixture.detectChanges();

      // then: the repeatPropertiesForm should be invalid and the formsValid event should be false
      expect(repeatPropertiesForm.valid).toEqual(false);
      expect(formsValid).toEqual(false);

      // when: a valid value is added to the "after" input field
      afterInput.setValue('5');

      // then: the repeatPropertiesForm should be valid and the formsValid event should be true
      expect(repeatPropertiesForm.valid).toEqual(true);
      expect(formsValid).toEqual(true);
    }));

    it('should invalidate repeatPropertiesForm when "repeats" set to "Weekly"', fakeAsync(() => {
      // setup helpers for the select "repeats" field and its options 
      repeatSelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-repeats', '.marker-option-repeats'); 
      repeatSelectMenu.triggerMenu();
      repeatOptions = repeatSelectMenu.getOptions();
      repeatSelectMenu.cleanup();

      // when: the "Weekly" option is selected
      repeatSelectMenu.selectOption(repeatOptions[2]);

      // then: the repeatPropertiesForm should be invalid and the formsValid event should be false
      expect(repeatPropertiesForm.valid).toEqual(false);
      expect(formsValid).toEqual(false);

      // when: a valid value is added to the "after" input field
      afterInput.setValue('5');

      // then: the repeatPropertiesForm should be valid and the formsValid event should be true
      expect(repeatPropertiesForm.valid).toEqual(true);
      expect(formsValid).toEqual(true);
    }));

    it('should invalidate repeatPropertiesForm when "repeats" set to "Monthly"', fakeAsync(() => {
      // setup helpers for the select "repeats" field and its options 
      repeatSelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-repeats', '.marker-option-repeats'); 
      repeatSelectMenu.triggerMenu();
      repeatOptions = repeatSelectMenu.getOptions();
      repeatSelectMenu.cleanup();

      // when: the "Monthly" option is selected
      repeatSelectMenu.selectOption(repeatOptions[3]);

      // then: the repeatPropertiesForm should be invalid and the formsValid event should be false
      expect(repeatPropertiesForm.valid).toEqual(false);
      expect(formsValid).toEqual(false);

      // when: a valid value is added to the "after" input field
      afterInput.setValue('5');

      // then: the repeatPropertiesForm should be valid and the formsValid event should be true
      expect(repeatPropertiesForm.valid).toEqual(true);
      expect(formsValid).toEqual(true);
    }));

    it('should invalidate repeatPropertiesForm when "repeats" set to "Yearly"', fakeAsync(() => {
      // setup helpers for the select "repeats" field and its options 
      repeatSelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-repeats', '.marker-option-repeats'); 
      repeatSelectMenu.triggerMenu();
      repeatOptions = repeatSelectMenu.getOptions();
      repeatSelectMenu.cleanup();

      // when: the "Yearl" option is selected
      repeatSelectMenu.selectOption(repeatOptions[4]);

      // then: the repeatPropertiesForm should be invalid and the formsValid event should be false
      expect(repeatPropertiesForm.valid).toEqual(false);
      expect(formsValid).toEqual(false);

      // when: a valid value is added to the "after" input field
      afterInput.setValue('5');

      // then: the repeatPropertiesForm should be valid and the formsValid event should be true
      expect(repeatPropertiesForm.valid).toEqual(true);
      expect(formsValid).toEqual(true);
    }));
  });

  describe("Edit Complete Task", () => {

    let dateCompletedInput: InputFieldTestHelper;

    let task: Task = {
      id: 1,
      name: 'Create unit test for complete tasks',
      priority: 'Low',
      description: 'Create unit test to make sure the form initializes properly with complete tasks',
      dueDate: moment().startOf('day').utc().toDate(),
      dateCompleted: moment().startOf('day').utc().toDate(),
      isComplete: true,
      repeats: 'noRepeat'
    } as Task;

    beforeEach(async() => {
      // set the @Input task property
      component.task = task;
      component.ngOnInit();
      fixture.detectChanges();

      // get the FormGroups from the component for easy access in tests
      dateCompletedForm = component.dateCompletedForm;
      mainPropertiesForm = component.mainPropertiesForm;
      repeatPropertiesForm = component.repeatPropertiesForm;

      let dateCompletedElement = fixture.debugElement.nativeElement.querySelector('.marker-input-date-completed'); 
      dateCompletedInput = new InputFieldTestHelper(fixture, dateCompletedElement);

      // should be able to modify the main properties
      expect(mainPropertiesForm.enabled).toEqual(true);

      // should not be able to modify date completed
      expect(dateCompletedForm.enabled).toEqual(false);
    });

    it('should initialize the form with dueDate, dateCompleted, and repeats form disabled', () => {
      // expect: the fields should match the fields from the task
      expect(mainPropertiesForm.valid).toEqual(true);
      expect(mainPropertiesForm.value.name).toEqual(task.name);
      expect(mainPropertiesForm.value.priority).toEqual(task.priority);
      expect(mainPropertiesForm.value.description).toEqual(task.description);

      // and: the dueDate input value should match todays date and be disabled
      expect(moment(dueDateInput.getValue(), 'MM/DD/YYYY').utc().format('MM/DD/YYYY')).toEqual(today.format('MM/DD/YYYY'));
      expect(dueDateInput.isDisabled()).toEqual(true);

      // and: the due date form value should be undefined (since it is disabled)
      expect(mainPropertiesForm.value.due).toBeUndefined();

      // and: the dateCompleted input value should match todays date and be disabled
      expect(moment(dateCompletedInput.getValue(), 'MM/DD/YYYY').utc().format('MM/DD/YYYY')).toEqual(today.format('MM/DD/YYYY'));
      expect(dateCompletedInput.isDisabled()).toEqual(true);

      // and: the select repeats form should be disabled
      expect(repeatPropertiesForm.disabled).toEqual(true);
  
      // and: the repeats and after input elements should not be visible
      expect(fixture.debugElement.nativeElement.querySelector('.marker-select-repeats')).toBeNull();
      expect(fixture.debugElement.nativeElement.querySelector('.marker-input-after')).toBeNull();
    });

    it('should be able to modify the name, priority, description', fakeAsync(() => {
      // setup helpers for the "priority" select field and its options
      prioritySelectMenu = new SelectMenuTestHelper(fixture, '.marker-select-priority', '.marker-option-priority');
      prioritySelectMenu.triggerMenu();
      priorityOptions = prioritySelectMenu.getOptions();
      prioritySelectMenu.cleanup();

      // when: the input elements on the form are updated
      nameInput.setValue('Update complete task');
      prioritySelectMenu.selectOptionByKey(priorityOptions, 'Medium');
      descriptionInput.setValue('Create unit test to ensure the Task can be updated');

      // then: the mainPropertiesForm should be valid and updated
      expect(mainPropertiesForm.valid).toEqual(true);
      expect(mainPropertiesForm.value.name).toEqual('Update complete task');
      expect(mainPropertiesForm.value.priority).toEqual('Medium');
      expect(mainPropertiesForm.value.description).toEqual('Create unit test to ensure the Task can be updated');
    }));
  });

  describe("Edit Pending Task", () => {

    let task: Task = {
      id: 1,
      name: 'Create unit test',
      priority: 'Low',
      description: 'Create unit test to make sure the form initializes with pre-populated task',
      dueDate: moment().startOf('day').utc().toDate(),
      isComplete: false,
      repeats: 'noRepeat'
    } as Task;

    beforeEach(async() => {
      // set the @Input task property
      component.task = task;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable();

      // get the FormGroups from the component for easy access in tests
      dateCompletedForm = component.dateCompletedForm;
      mainPropertiesForm = component.mainPropertiesForm;
      repeatPropertiesForm = component.repeatPropertiesForm;
    
      // should be able to modify the main properties
      expect(mainPropertiesForm.enabled).toEqual(true);

      // should not be able to modify date completed
      expect(dateCompletedForm.enabled).toEqual(false);
    });

    it('should initialize the mainPropertiesForm with the @Input task property values and the repeats form disabled and hidden', () => {
      // expect: the fields should match the fields from the task
      expect(mainPropertiesForm.valid).toEqual(true);
      expect(mainPropertiesForm.value.name).toEqual(task.name);
      expect(mainPropertiesForm.value.priority).toEqual(task.priority);
      expect(mainPropertiesForm.value.description).toEqual(task.description);
      expect(mainPropertiesForm.value.due).toEqual(task.dueDate);

      // and: the repeat form should be disabled
      expect(repeatPropertiesForm.disabled).toEqual(true);
  
      // and: the repeats and after input elements should not be visible
      expect(fixture.debugElement.nativeElement.querySelector('.marker-select-repeats')).toBeNull();
      expect(fixture.debugElement.nativeElement.querySelector('.marker-input-after')).toBeNull();
    });
  });

  @Component({
    selector: 'host-component',
    template: '<task-form></task-form>'
  })
  class TestHostComponent {
    @ViewChild(TaskFormComponent)
    taskFormComponent: TaskFormComponent;
  }
});
