import { APP_BASE_HREF, Location } from "@angular/common";
import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatProgressSpinnerModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

/* app specific modules */
import { AppModule } from './app.module';
import { AboutModule } from './about/about.module';
import { CoreModule } from './core/core.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';

import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { LoaderService } from 'app/core/services/loader.service';
import { LoggerService } from 'app/core/services/logger.service';

import { AppComponent } from './app.component';
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

describe('AppComponent', () => {

  let component: AppComponent;
  let dialog: MockMatDialog;
  let fixture: ComponentFixture<AppComponent>;
  let location: Location;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    let params = new Subject<Params>();
    params.next({ filter: '' });

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DummyComponent
      ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          {
              path: '',
              component: DummyComponent
          }
        ]),
        
        /* app modules */
        AboutModule,
        CoreModule,
        FooterModule,
        HeaderModule
      ],
      providers: [
        LoaderService,
        MockTaskService,
        MockUtilsService,
        { provide: ActivatedRoute, useValue: { params: params, snapshot : {} } },
        { provide: APP_BASE_HREF, useValue : '/' },
        { provide: LoggerService, useClass: ConsoleLoggerService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: TaskService, useClass: MockTaskService },
        { provide: UtilsService, useClass: MockUtilsService }
      ]
    }).compileComponents();

    location = TestBed.get(Location); 
    router = TestBed.get(Router); 
    fixture = TestBed.createComponent(AppComponent);
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

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();    
  });
  
  it('should render app-header tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-header'));
  });

  it('should render router-outlet tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('router-outlet'));
  });

  it('should render app-footer tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-footer'));
  });
});
