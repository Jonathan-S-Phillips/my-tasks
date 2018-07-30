/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

/* app services */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { HttpService } from 'app/core/services/http.service';
import { LoaderService } from 'app/core/services/loader.service';
import { LoggerService, Logger } from 'app/core/services/logger.service';

/* task datasource and services */
import { TasksDataSource } from './tasks.datasource';
import { TaskService } from './task.service';

describe('TasksDataSource', () => {
    let dataSource: TasksDataSource;
    let injector: TestBed;
    let logger: LoggerService;
    let service: TaskService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                HttpService,
                LoaderService,
                TaskService,
                { provide: LoggerService, useClass: ConsoleLoggerService }
            ]
        });

        injector = getTestBed();
        logger = injector.get(LoggerService);
        service = injector.get(TaskService);
        httpMock = injector.get(HttpTestingController);

        // initialize the dataSource to use in the tests
        dataSource = new TasksDataSource(logger, service);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('concatTasks()', () => {

        it('should send a GET request to the tasks API with default params when none provided', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the concatTasks method is called
                dataSource.concatTasks();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=false&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for filter, sort, order, pageNumber, and pageSize', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the concatTasks method is called
                dataSource.concatTasks(true);

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for sort, order, pageNumber, and pageSize', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController) => {
                // when: the concatTasks method is called
                dataSource.concatTasks(true, 'test');

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for order, pageNumber, and pageSize', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the concatTasks method is called
                dataSource.concatTasks(true, 'test', 'name');

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for pageNumber and pageSize', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the concatTasks method is called
                dataSource.concatTasks(true, 'test', 'name', 'DESC');

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default param for pageSize', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the concatTasks method is called
                dataSource.concatTasks(true, 'test', 'name', 'DESC', 1);

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=1&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with given params', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the concatTasks method is called
                dataSource.concatTasks(true, 'test', 'name', 'DESC', 1, 1);

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=1&pageSize=1');
                expect(req.request.method).toEqual('GET');
        })));
    });

    describe('loadTasks()', () => {

        it('should send a GET request to the tasks API with default params when none provided', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the loadTasks method is called
                dataSource.loadTasks();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=false&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for filter, sort, order, pageNumber, and pageSize', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the loadTasks method is called
                dataSource.loadTasks(true);

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for sort, order, pageNumber, and pageSize', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController) => {
                // when: the loadTasks method is called
                dataSource.loadTasks(true, 'test');

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for order, pageNumber, and pageSize', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the loadTasks method is called
                dataSource.loadTasks(true, 'test', 'name');

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for pageNumber and pageSize', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the loadTasks method is called
                dataSource.loadTasks(true, 'test', 'name', 'DESC');

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default param for pageSize', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the loadTasks method is called
                dataSource.loadTasks(true, 'test', 'name', 'DESC', 1);

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=1&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with given params', async(inject([HttpTestingController],
            (httpMock: HttpTestingController) => {
                // when: the loadTasks method is called
                dataSource.loadTasks(true, 'test', 'name', 'DESC', 1, 1);

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=1&pageSize=1');
                expect(req.request.method).toEqual('GET');
        })));
    });
});
