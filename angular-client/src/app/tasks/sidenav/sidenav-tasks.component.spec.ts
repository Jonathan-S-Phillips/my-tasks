import { Location } from "@angular/common";
import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

/* app specific modules */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';
import { SidenavTasksModule } from "@tasks/sidenav/sidenav-tasks.module";

import { SidenavTasksComponent } from '@tasks/sidenav/sidenav-tasks.component';
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

import { MockMatDialog } from '@mocks/mat-dialog';
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';

@Component({
  template: ''
})
class DummyComponent {
}

describe('SidenavTasksComponent', () => {
  
  let component: SidenavTasksComponent;
  let dialog: MockMatDialog;
  let fixture: ComponentFixture<SidenavTasksComponent>;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    let params = new Subject<Params>();
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
              path: 'pending',
              component: DummyComponent
          },
          {
              path:'complete',
              component: DummyComponent
          }
        ]),
        
        /* app modules */
        SidenavTasksModule
      ],
      providers: [
        MockTaskService,
        MockUtilsService,
        { provide: ActivatedRoute, useValue: { params: params } },
        { provide: LoggerService, useClass: ConsoleLoggerService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: TaskService, useClass: MockTaskService },
        { provide: UtilsService, useClass: MockUtilsService }
      ]
    }).compileComponents();

    router = TestBed.get(Router); 
    fixture = TestBed.createComponent(SidenavTasksComponent);
    router.initialNavigation(); 
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);
    httpMock = TestBed.get(HttpTestingController);

    fixture.detectChanges();
  }));

  // Make sure there are no outstanding requests after each test
  afterEach(() =>{
    httpMock.verify();
  });

  it('should call method to open the create dialog when the create button is clicked', async() => {
    // setup: install a spy on the open method
    let createButton = fixture.debugElement.nativeElement.querySelector('.marker-button-create-task');
    let spy: jasmine.Spy = spyOn(dialog, 'open').and.callThrough();

    // when: the create button is clicked
    createButton.click();
    fixture.detectChanges();

    // then: the method to open the create Task dialog should have been called
    expect(spy).toHaveBeenCalled();
  });

  it('should select sidenav and change route when sidenav items clicked', async() => {
    // setup: a spy for the navigate method
    let spy = spyOn(router, 'navigate');

    // and: get the list-item and classList for the element
    let sidenavItem: HTMLElement = fixture.debugElement.nativeElement.querySelectorAll('mat-list-item')[0];
    let classList: DOMTokenList = sidenavItem.classList;

    // when: the sidenav item is clicked
    sidenavItem.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // then: the item should have CSS class "selected-list-item"
    expect(classList.contains('selected-list-item'));

    // and: the route should change to the expected location
    expect(spy).toHaveBeenCalledWith(['tasks/pending'])
  })

  it('should select sidenav and change route when sidenav items clicked', async() => {
    // setup: a spy for the navigate method
    let spy = spyOn(router, 'navigate');

    // and: get the list-item and classList for the element
    let sidenavItem: HTMLElement = fixture.debugElement.nativeElement.querySelectorAll('mat-list-item')[1];
    let classList: DOMTokenList = sidenavItem.classList;

    // when: the sidenav item is clicked
    sidenavItem.click();
    fixture.detectChanges();
    await fixture.whenStable();
    
    // then: the item should have CSS class "selected-list-item"
    expect(classList.contains('selected-list-item'));

    // and: the route should change to the expected location
    expect(spy).toHaveBeenCalledWith(['tasks/pending', { filter:'overdue' }])
  })

  it('should select sidenav and change route when sidenav items clicked', async() => {
    // setup: a spy for the navigate method
    let spy = spyOn(router, 'navigate');

    // and: get the list-item and classList for the element
    let sidenavItem: HTMLElement = fixture.debugElement.nativeElement.querySelectorAll('mat-list-item')[2];
    let classList: DOMTokenList = sidenavItem.classList;

    // when: the sidenav item is clicked
    sidenavItem.click();
    fixture.detectChanges();
    await fixture.whenStable();
    
    // then: the item should have CSS class "selected-list-item"
    expect(classList.contains('selected-list-item'));

    // and: the route should change to the expected location
    expect(spy).toHaveBeenCalledWith(['tasks/pending', { filter:'today' }])
  })

  it('should select sidenav and change route when sidenav items clicked', async() => {
    // setup: a spy for the navigate method
    let spy = spyOn(router, 'navigate');

    // and: get the list-item and classList for the element
    let sidenavItem: HTMLElement = fixture.debugElement.nativeElement.querySelectorAll('mat-list-item')[3];
    let classList: DOMTokenList = sidenavItem.classList;

    // when: the sidenav item is clicked
    sidenavItem.click();
    fixture.detectChanges();
    await fixture.whenStable();
    
    // then: the item should have CSS class "selected-list-item"
    expect(classList.contains('selected-list-item'));

    // and: the route should change to the expected location
    expect(spy).toHaveBeenCalledWith(['tasks/pending', { filter:'tomorrow' }])
  })

  it('should select sidenav and change route when sidenav items clicked', async() => {
    // setup: a spy for the navigate method
    let spy = spyOn(router, 'navigate');

    // and: get the list-item and classList for the element
    let sidenavItem: HTMLElement = fixture.debugElement.nativeElement.querySelectorAll('mat-list-item')[4];
    let classList: DOMTokenList = sidenavItem.classList;

    // when: the sidenav item is clicked
    sidenavItem.click();
    fixture.detectChanges();
    await fixture.whenStable();
    
    // then: the item should have CSS class "selected-list-item"
    expect(classList.contains('selected-list-item'));

    // and: the route should change to the expected location
    expect(spy).toHaveBeenCalledWith(['tasks/complete'])
  })
});
