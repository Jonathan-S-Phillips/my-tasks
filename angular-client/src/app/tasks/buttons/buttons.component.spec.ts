import { Location } from "@angular/common";
import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from "rxjs";

/* app modules */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';
import { ButtonsComponent } from '@tasks/buttons/buttons.component';
import { TasksButtonsModule } from './tasks-buttons.module';
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

import { MockMatDialog } from '@mocks/mat-dialog';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';
import { TASKS } from '@tasks/mocks/seed/tasks';
import { TasksHelper } from '@tasks/mocks/tasks-helper';

@Component({
    template: ''
})
class DummyComponent {}

describe('ButtonsComponent', () => {

    let completeButton: HTMLElement;
    let completeButtonAttributes: NamedNodeMap;
    let deleteButton: HTMLElement;
    let deleteButtonAttributes: NamedNodeMap;
    let editButton: HTMLElement;
    let editButtonAttributes: NamedNodeMap;
    let dialog: MockMatDialog;
    let tasksHelper: TasksHelper;
    let taskService: TaskService;
    let utilsService: MockUtilsService;
    let component: ButtonsComponent;
    let fixture: ComponentFixture<ButtonsComponent>;
    let httpMock: HttpTestingController;
    let location: Location;
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DummyComponent
            ],
            imports: [
                NoopAnimationsModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    {
                        path:'tasks/:id',
                        component: DummyComponent
                    }
                ]),

                /* app modules */
                TasksButtonsModule
            ],
            providers: [
                MockTaskService,
                MockUtilsService,
                { provide: LoggerService, useClass: ConsoleLoggerService },
                { provide: MatDialog, useClass: MockMatDialog },
                { provide: TaskService, useClass: MockTaskService },
                { provide: UtilsService, useClass: MockUtilsService }
            ]
        }).compileComponents();
    
        tasksHelper = new TasksHelper(TASKS);
        location = TestBed.get(Location); 
        router = TestBed.get(Router); 
        fixture = TestBed.createComponent(ButtonsComponent);
        router.initialNavigation(); 
        component = fixture.componentInstance;
        httpMock = TestBed.get(HttpTestingController);
        dialog = TestBed.get(MatDialog);
        taskService = TestBed.get(TaskService);
        utilsService = TestBed.get(UtilsService);
        fixture.detectChanges();

        completeButton = fixture.debugElement.nativeElement.querySelector('.marker-button-complete-task');
        completeButtonAttributes = completeButton.attributes as NamedNodeMap;
        deleteButton = fixture.debugElement.nativeElement.querySelector('.marker-button-delete-task');
        deleteButtonAttributes = deleteButton.attributes as NamedNodeMap;
        editButton = fixture.debugElement.nativeElement.querySelector('.marker-button-edit-task');
        editButtonAttributes = editButton.attributes as NamedNodeMap;
    }));

    it('should initialize the component with all buttons enabled by default', () => {
        expect(component.disableCompleteButton).toBeUndefined();
        expect(component.disableDeleteButton).toBeUndefined();
        expect(component.disableEditButton).toBeUndefined();
    })

    describe('Buttons disabled', () => {

        beforeEach(async(() => {
            component.disableCompleteButton = true;
            component.disableDeleteButton = true;
            component.disableEditButton = true;
            fixture.detectChanges();
        }));

        it('should not call method to open the complete dialog when complete button clicked in toolbar', async(() => {
            // setup: install a spy on the openEditDialog method
            let dialog: string;
            spyOn(component, 'openCompleteDialog').and.callFake(() => {
                dialog = 'opened';
            });

            // when: the complete button in the toolbar is clicked
            completeButton.click();
            fixture.detectChanges();

            // then: the openConfirmDeleteDialog method should not have been called
            expect(dialog).toBeUndefined();
        }));
    });

    describe('Buttons enabled', () => {

        it('should call method to open the complete dialog when complete button clicked', async() => {
            // setup: install a spy on the open method
            dialog.componentInstance.completeTask = Observable.of('');
            let spy: jasmine.Spy = spyOn(dialog, 'open').and.returnValue(dialog);

            // when: the complete button in the toolbar is clicked
            completeButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            // then: the method to open the complete Task dialog should have been called
            expect(spy).toHaveBeenCalled();
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
    
        it('should redirect to edit Task component when edit button clicked in toolbar', async() => {
            // setup: install a spy on the openEditDialog method
            component.tasks = [tasksHelper.pendingTasks[0]];
    
            // when: the edit button in the toolbar is clicked
            editButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
    
            // then: the openEditDialog method should have been called
            expect(location.path()).toEqual(`/tasks/${tasksHelper.pendingTasks[0].id}`); 
        });
    });
});