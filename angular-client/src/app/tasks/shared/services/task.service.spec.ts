/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

/* app services */
import { ConsoleLoggerService } from 'app/core/services/console-logger.service';
import { HttpService } from 'app/core/services/http.service';
import { LoaderService } from 'app/core/services/loader.service';
import { LoggerService } from 'app/core/services/logger.service';

/* task models  and services*/
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from './task.service';

describe('TaskService', () => {
    let injector: TestBed;
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
        service = injector.get(TaskService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('create()', () => {

        it('should send a POST request to the tasks API with Task details in the body', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task
                const task: Task = { 
                    name: 'Test TaskService',
                    priority: 'Medium',
                    description: 'Create unit tests for taskService',
                    dueDate: moment().startOf('day').utc().toDate()
                } as Task;

                // when: the create method is called
                service.create(task).subscribe();

                // then: setup the httpMock and expect a single POST request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks');
                expect(req.request.method).toEqual('POST');

                // and: the request body should contain the Task details
                expect(req.request.body).toEqual(task);
        })));
    });

    describe('complete()', () => {

        it('should send a PATCH request to the tasks API with complete transition and dateCompleted in body', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task and partial including dateCompleted property
                const today:moment.Moment = moment().startOf('day').utc();
                const task: Task = { id: 1 } as Task; // only need id for test
                const partial: Partial<Task> = { dateCompleted: today.toDate() };

                // when: the complete method is called
                service.complete(task, partial).subscribe();

                // then: setup the httpMock and expect a single PATCH request to the below URL
                const req = httpMock.expectOne(`http://localhost:3000/api/tasks/${task.id}`);
                expect(req.request.method).toEqual('PATCH');

                // and: the request body should contain complete transition in meta 
                expect(req.request.body.meta.transition).toEqual('complete');
                
                // and: it should also include the dateCompleted in data
                expect(req.request.body.data.properties).toEqual(partial);
        })));
    });

    describe('completeAll()', () => {

        it('should send a PATCH request to the tasks API with complete transition, ids (of Tasks to complete), and dateCompleted in body', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a partial including dateCompleted property
                const partial: Partial<Task> = { dateCompleted: moment().startOf('day').utc().toDate() };

                // when: the complete method is called
                service.completeAll([1, 2], partial).subscribe();

                // then: setup the httpMock and expect a single PATCH request to the below URL
                const req = httpMock.expectOne(`http://localhost:3000/api/tasks`);
                expect(req.request.method).toEqual('PATCH');

                // and: the request body should contain complete transition in meta 
                expect(req.request.body.meta.transition).toEqual('complete');
                
                // and: it should also include the Task ids and dateCompleted in data 
                expect(req.request.body.data.ids).toEqual([1, 2]);
                expect(req.request.body.data.properties).toEqual(partial);
        })));
    });

    describe('delete()', () => {

        it('should send a DELETE request to the tasks API', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task
                const task: Task = { id: 1 } as Task;

                // when: the delete method is called
                service.delete(task).subscribe();

                // then: setup the httpMock and expect a single DELETE request to the below URL
                const req = httpMock.expectOne(`http://localhost:3000/api/tasks/${task.id}`);
                expect(req.request.method).toEqual('DELETE');
        })));
    });

    describe('findTasks()', () => {

        it('should send a GET request to the tasks API with default params when none provided', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the findTasks method is called
                service.findTasks().subscribe();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=false&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for filter, sort, order, pageNumber, and pageSize', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the findTasks method is called
                service.findTasks(true).subscribe();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for sort, order, pageNumber, and pageSize', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the findTasks method is called
                service.findTasks(true, 'test').subscribe();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=dueDate&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for order, pageNumber, and pageSize', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the findTasks method is called
                service.findTasks(true, 'test', 'name').subscribe();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=ASC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default params for pageNumber and pageSize', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the findTasks method is called
                service.findTasks(true, 'test', 'name', 'DESC').subscribe();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=0&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with default param for pageSize', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the findTasks method is called
                service.findTasks(true, 'test', 'name', 'DESC', 1).subscribe();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=1&pageSize=20');
                expect(req.request.method).toEqual('GET');
        })));

        it('should send a GET request to the tasks API with given params', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the findTasks method is called
                service.findTasks(true, 'test', 'name', 'DESC', 1, 1).subscribe();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=true&filter=test&sort=name&order=DESC&pageNumber=1&pageSize=1');
                expect(req.request.method).toEqual('GET');
        })));
    });

    describe('get()', () => {

        it('should send a GET request to the tasks API', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the get method is called
                service.get(1).subscribe();

                // then: setup the httpMock and expect a single GET request to the below URL
                const req = httpMock.expectOne('http://localhost:3000/api/tasks/1');
                expect(req.request.method).toEqual('GET');
        })));
    });

    describe('initNumTasks()', () => {
        
        it('should send GET requests to the tasks API', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // when: the initNumTasks method is called
                service.initNumTasks();

                // then: setup the httpMock and expect a GET request to the below URL for all pending tasks
                const pendingReq = httpMock.match('http://localhost:3000/api/tasks?isComplete=false&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=-1');
                expect(pendingReq[0].request.method).toEqual('GET');

                // and: setup the httpMock and expect a GET request to the below URL for all complete tasks
                const completeReq = httpMock.match('http://localhost:3000/api/tasks?isComplete=true&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=-1');
                expect(completeReq[0].request.method).toEqual('GET');

                // and: setup the httpMock and expect a GET request to the below URL for overDue tasks
                const overDueReq = httpMock.match('http://localhost:3000/api/tasks?isComplete=false&filter=overDue&sort=dueDate&order=ASC&pageNumber=0&pageSize=0');
                expect(overDueReq[0].request.method).toEqual('GET');

                // and: setup the httpMock and expect a GET request to the below URL for Tasks due today
                const dueTodayReq = httpMock.match(`http://localhost:3000/api/tasks?isComplete=false&filter=${moment().startOf('day').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
                expect(dueTodayReq[0].request.method).toEqual('GET');

                // and: setup the httpMock and expect a GET request to the below URL for Tasks due tomorrow
                const dueTomorrowReq = httpMock.match(`http://localhost:3000/api/tasks?isComplete=false&filter=${moment().startOf('day').add(1, 'days').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
                expect(dueTomorrowReq[0].request.method).toEqual('GET');
        })));
    });

    describe('setTaskFilter()', () => {

        it('should update the taskFilter Observable', async() => {
            // setup: a subscription on the taskFilter Observable
            let taskFilter;
            service.taskFilter.subscribe((filter: string) => {
                taskFilter = filter;
            });

            // when: the setTaskFilter method is called
            await service.setTaskFilter('new filter');

            // then: the taskFilter should match the parameter used in the above method call
            expect(taskFilter).toEqual('new filter');
        });
    });

    describe('update()', () => {

        it('should send a PATCH request to the tasks API with default updateAll=false', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task to update
                const task: Task = { 
                    id: 1,
                    name: 'Test TaskService',
                    priority: 'Medium',
                    description: 'Create unit tests for taskService',
                    dueDate: moment().startOf('day').utc().toDate()
                } as Task;

                // when: the update method is called with just a task parameter
                service.update(task).subscribe();

                // then: setup the httpMock and expect a single PATCH request to the below URL
                const req = httpMock.expectOne(`http://localhost:3000/api/tasks/${task.id}?updateAll=false`);
                expect(req.request.method).toEqual('PATCH');
                
                // and: the request body should contain update transition in meta 
                expect(req.request.body.meta.transition).toEqual('update');
                
                // and: it should also include the Task data in the body
                expect(req.request.body.data.properties).toEqual(task);
        })));

        it('should send a PATCH request to the tasks API with updateAll=true when updateAll param included in method call', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task to update
                const task: Task = { 
                    id: 1,
                    name: 'Test TaskService',
                    priority: 'Medium',
                    description: 'Create unit tests for taskService',
                    dueDate: moment().startOf('day').utc().toDate(),
                    repeats: 'Daily',
                    endsAfter: 5
                } as Task;

                // when: the update method is called
                service.update(task, true).subscribe();

                // then: setup the httpMock and expect a single PATCH request to the below URL
                const req = httpMock.expectOne(`http://localhost:3000/api/tasks/${task.id}?updateAll=true`);
                expect(req.request.method).toEqual('PATCH');
                
                // and: the request body should contain update transition in meta 
                expect(req.request.body.meta.transition).toEqual('update');
                
                // and: it should also include the Task data in the body
                expect(req.request.body.data.properties).toEqual(task);
        })));
    });

    describe('updateNumTasks()', () => {

        it('should not send any requests to the tasks API when Tasks array includes Task with dueDate after tomorrow', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task to update
                const task: Task = { 
                    id: 1,
                    name: 'Test TaskService',
                    priority: 'Medium',
                    description: 'Create unit tests for taskService',
                    dueDate: moment().startOf('day').add(2, 'days').utc().toDate()
                } as Task;

                // when: the updateNumTasks method is called
                service.updateNumTasks([task]);

                // then: expect a GET request to the below URL for all pending tasks
                const pendingReq = httpMock.match('http://localhost:3000/api/tasks?isComplete=false&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=-1');
                expect(pendingReq[0].request.method).toEqual('GET');

                // and: no requests to the below URLs
                httpMock.expectNone('http://localhost:3000/api/tasks?isComplete=false&filter=overDue&sort=dueDate&order=ASC&pageNumber=0&pageSize=0');
                httpMock.expectNone(`http://localhost:3000/api/tasks?isComplete=false&filter=${moment().startOf('day').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
                httpMock.expectNone(`http://localhost:3000/api/tasks?isComplete=false&filter=${moment().startOf('day').add(1, 'days').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
        })));

        it('should send a GET request for over due Tasks when Tasks array includes Task with dueDate less than todays date', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task
                const task: Task = { 
                    id: 1,
                    name: 'Test TaskService',
                    priority: 'Medium',
                    description: 'Create unit tests for taskService',
                    dueDate: moment().startOf('day').subtract(1, 'days').utc().toDate()
                } as Task;

                // when: the updateNumTasks method is called
                service.updateNumTasks([task]);

                // then: setup the httpMock and expect a GET request to the below URL for overDue tasks
                const req = httpMock.expectOne('http://localhost:3000/api/tasks?isComplete=false&filter=overDue&sort=dueDate&order=ASC&pageNumber=0&pageSize=0');
                expect(req.request.method).toEqual('GET');

                // and: expect a GET request to the below URL for all pending tasks
                const pendingReq = httpMock.match('http://localhost:3000/api/tasks?isComplete=false&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=-1');
                expect(pendingReq[0].request.method).toEqual('GET');

                // and: there should be no requests for Tasks due today or tomorrow
                httpMock.expectNone(`http://localhost:3000/api/tasks?isComplete=false&filter=${moment().startOf('day').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
                httpMock.expectNone(`http://localhost:3000/api/tasks?isComplete=false&filter=${moment().startOf('day').add(1, 'days').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
        })));

        it('should send a GET request for Tasks due today when Tasks array includes Task with dueDate=todays date', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task
                const today = moment().startOf('day').utc();
                const task: Task = { 
                    id: 1,
                    name: 'Test TaskService',
                    priority: 'Medium',
                    description: 'Create unit tests for taskService',
                    dueDate: today.toDate()
                } as Task;

                // when: the updateNumTasks method is called
                service.updateNumTasks([task]);

                // then: setup the httpMock and expect a GET request to the below URL for tasks due today
                const req = httpMock.expectOne(`http://localhost:3000/api/tasks?isComplete=false&filter=${today.format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
                expect(req.request.method).toEqual('GET');

                // and: expect a GET request to the below URL for all pending tasks
                const pendingReq = httpMock.match('http://localhost:3000/api/tasks?isComplete=false&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=-1');
                expect(pendingReq[0].request.method).toEqual('GET');

                // and: there should be no requests for over due Tasks or Tasks due tomorrow
                httpMock.expectNone('http://localhost:3000/api/tasks?isComplete=false&filter=overDue&sort=dueDate&order=ASC&pageNumber=0&pageSize=0');
                httpMock.expectNone(`http://localhost:3000/api/tasks?isComplete=false&filter=${today.add(1, 'days').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
        })));

        it('should send a GET request for Tasks due tomorrow when Tasks array includes Task with dueDate=tomorrows date', async(inject([HttpTestingController, TaskService],
            (httpMock: HttpTestingController, service: TaskService) => {
                // setup: a Task
                const task: Task = { 
                    id: 1,
                    name: 'Test TaskService',
                    priority: 'Medium',
                    description: 'Create unit tests for taskService',
                    dueDate: moment().startOf('day').add(1, 'days').utc().toDate()
                } as Task;

                // when: the updateNumTasks method is called
                service.updateNumTasks([task]);

                // then: setup the httpMock and expect a GET request to the below URL for tasks due tomorrow
                const req = httpMock.expectOne(`http://localhost:3000/api/tasks?isComplete=false&filter=${moment().startOf('day').add(1, 'days').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
                expect(req.request.method).toEqual('GET');

                // and: expect a GET request to the below URL for all pending tasks
                const pendingReq = httpMock.match('http://localhost:3000/api/tasks?isComplete=false&filter=&sort=dueDate&order=ASC&pageNumber=0&pageSize=-1');
                expect(pendingReq[0].request.method).toEqual('GET');

                // and: there should be no requests for over due Tasks or Tasks due today
                httpMock.expectNone('http://localhost:3000/api/tasks?isComplete=false&filter=overDue&sort=dueDate&order=ASC&pageNumber=0&pageSize=0');
                httpMock.expectNone(`http://localhost:3000/api/tasks?isComplete=false&filter=${moment().startOf('day').utc().format('MM/DD/YYYY')}&sort=dueDate&order=ASC&pageNumber=0&pageSize=0`);
        })));
    });
});
