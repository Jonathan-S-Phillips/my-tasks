/* angular libraries */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/* app components */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoggerService } from 'app/core/services/logger.service';

import { HeaderComponent } from './header.component';
import { HeaderModule } from './header.module';

/* app services */
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

/* app mocks */
import { MockTaskService } from '@tasks/mocks/task.service';
import { MockUtilsService } from '@tasks/mocks/utils.service';

describe('HeaderComponent', () => {

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let httpMock: HttpTestingController;
  let utilsService: MockUtilsService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,

        /* app modules */
        HeaderModule
      ],
      providers: [
        MockTaskService,
        MockUtilsService,
        { provide: LoggerService, useClass: ConsoleLoggerService },
        { provide: TaskService, useClass: MockTaskService },
        { provide: UtilsService, useClass: MockUtilsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    utilsService = TestBed.get(UtilsService);
  });

  // Make sure there are no outstanding requests after each test
  afterEach(() =>{
    httpMock.verify();
  });

  describe('Init - tests that do not depend on screen size', () => {

    beforeEach(async(() => {
      fixture.detectChanges();
    }));

    it('should create the header component', () => {
      expect(component).toBeTruthy();
    });

    it('the search bar should not be visible', () => {
      // expect: the showSearchBar boolean should be false
      expect(component.showSearchBar).toEqual(false);

      // and: the "marker-toolbar-search-bar" class marker should not be visible
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-search-bar')).toBeNull();
    });
  });

  describe('Large screens', () => {

    beforeEach(async(() => {
      // set screen to large screen
      utilsService.setIsMediumScreen(false);
      fixture.detectChanges();
    }));

    it('the large screen toolbar should be visible and the sidenav should be expanded', () => {
      // expect: the large screen toolbar should be visible and the medium screen toolbar should be hidden
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-large-screen')).toBeDefined();
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-medium-screen')).toBeNull();

      // and: the sidenav should be expanded
      expect(component.sidenavMenuState).toEqual('Expand');
    });

    it('should display medium screen toolbar when changing to medium screen', async(() => {
      // when: the screen size changes to medium or smaller
      utilsService.setIsMediumScreen(true);
      fixture.detectChanges();

      // then: the medium screen toolbar should be visible and the large screen toolbar should be visible
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-medium-screen')).toBeDefined();
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-large-screen')).toBeNull();
    }));

    it('should collapse the sidenav when the toggle is clicked', async(() => {
      // when: the sidenav toggle is clicked
      fixture.debugElement.nativeElement.querySelector('.marker-button-toggle-sidenav').click();
      fixture.detectChanges();

      // then: the sidenav should be collapsed
      expect(component.sidenavMenuState).toEqual('Collapse');
    }));
  });

  describe('Small to Medium Size Screens', () => {

    beforeEach(async(() => {
      // set screen to medium size (or smaller) screen
      utilsService.setIsMediumScreen(true);
      fixture.detectChanges();
    }));

    it('the medium screen toolbar should be visible and and the sidenav should be collapsed', () => {
      // expect: the medium screen toolbar should be visible and the large screen toolbar should be hidden
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-medium-screen')).toBeDefined();
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-large-screen')).toBeNull();

      // and: the sidenav should be collapsed
      expect(component.sidenavMenuState).toEqual('Collapse');
    });

    it('should display large screen toolbar when changing to large screen', async(() => {
      // when: the screen size changes to large
      utilsService.setIsMediumScreen(false);
      fixture.detectChanges();

      // then: the large screen toolbar should be visible and the medium screen toolbar should be hidden
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-large-screen')).toBeDefined();
      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-medium-screen')).toBeNull();
    }));

    it('should display search bar when search icon button clicked', async(() => {
      fixture.debugElement.nativeElement.querySelector('.marker-button-show-search-bar').click();
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.marker-toolbar-search-bar')).toBeDefined();
    }));

    it('should expand the sidenav when the toggle is clicked', async(() => {
      // when: the sidenav toggle is clicked
      fixture.debugElement.nativeElement.querySelector('.marker-button-toggle-sidenav').click();
      fixture.detectChanges();

      // then: the sidenav should be expanded
      expect(component.sidenavMenuState).toEqual('Expand');
    }));
  });
});
