/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/* app */
import { LoggerService } from 'app/core/services/logger.service';
import { HttpService } from 'app/core/services/http.service';
import { Task } from '@tasks/shared/models/task.model';

/**
 * Manages all CRUD operations for Tasks.
 */
@Injectable()
export class TaskService {

    /** An Observable for when Tasks are updated so components can reload data if they need to (like table data). */
    readonly changes: Observable<string>;
    /** An Observable for complete Tasks. */
    readonly completeTasks: Observable<Task[]>;
    /** An Observable for the number of pending Tasks. */
    readonly numPendingTasks: Observable<number>;
    /** An Observable for the number of Tasks due today (updates when corresponding source changes). */
    readonly numTasksDueToday: Observable<number>;
    /** An Observable for the number of Tasks due tomorrow (updates when corresponding source changes). */
    readonly numTasksDueTomorrow: Observable<number>;
    /** An Observable for the number of over due Tasks (updates when corresponding source changes). */
    readonly numTasksOverDue: Observable<number>;
    /** An Observable for pending Tasks. */
    readonly pendingTasks: Observable<Task[]>;
    /** An Observable for the task filter (updates when corresponding source changes). */
    readonly taskFilter: Observable<string>;
    /** Tracks the complete Tasks. */
    protected completeTasksSource: BehaviorSubject<Task[]>;
    /** Tracks the number of pending Tasks. */
    protected numPendingTasksSource: BehaviorSubject<number>;
    /** Tracks the number of Tasks due today. */
    protected numTasksDueTodaySource: BehaviorSubject<number>;
    /** Tracks the number of Tasks due tomorrow. */
    protected numTasksDueTomorrowSource: BehaviorSubject<number>;
    /** Tracks the number of Tasks over due. */
    protected numTasksOverDueSource: BehaviorSubject<number>;
    /** Tracks the pending Tasks. */
    protected pendingTasksSource: BehaviorSubject<Task[]>;
    /** Tracks the filter which is updated by various components. */
    protected taskFilterSource: BehaviorSubject<string>;
    /** Tracks create, update, complete, or delete events for Tasks. */
    private changesSource;
    /** The base URL for the Tasks API. */
    private tasksUrl: string = 'tasks';

    /**
     * Initializes all subjects and observables.
     * 
     * @param http The HTTP client to connect to the Tasks API. 
     */
    constructor(private httpService: HttpService, private logger: LoggerService){
        this.changesSource = new Subject<string>();
        this.completeTasksSource = new BehaviorSubject([]);
        this.numPendingTasksSource = new BehaviorSubject(0);
        this.numTasksDueTodaySource = new BehaviorSubject(0);
        this.numTasksDueTomorrowSource = new BehaviorSubject(0);
        this.numTasksOverDueSource = new BehaviorSubject(0);
        this.pendingTasksSource = new BehaviorSubject([]);
        this.taskFilterSource = new BehaviorSubject('');

        this.changes = this.changesSource;
        this.completeTasks = this.completeTasksSource.asObservable();
        this.numPendingTasks = this.numPendingTasksSource.asObservable();
        this.numTasksDueToday = this.numTasksDueTodaySource.asObservable();
        this.numTasksDueTomorrow = this.numTasksDueTomorrowSource.asObservable();
        this.numTasksOverDue = this.numTasksOverDueSource.asObservable();
        this.pendingTasks = this.pendingTasksSource.asObservable();
        this.taskFilter = this.taskFilterSource.asObservable();
    }

    /**
     * Sends a HTTP POST request to create a new Task.
     * 
     * @param task The task to create.
     */
    create(task: Task): Observable<Task> {
        return this.httpService.post(this.tasksUrl, task).pipe(
            tap((task: Task) => {
                this.log(`added task w/ id=${task.id}`);
                this.changesSource.next('Task Created Successfully');
                this.taskFilterSource.next('');
                
                // update the appropriate number of Tasks observable (if required)
                this.updateNumTasks([task]);
            }),
            catchError(this.handleError<Task>('addTask'))
        );
    }

    /**
     * Sends a HTTP PATCH request to complete the given Task.
     *  
     * @param task The Task to complete. 
     * @param properties The properties required to complete a Task (dateCompleted).
     */
    complete(task: Task, properties: Partial<Task>): Observable<Task> {
        // define JSON to submit with request
        let json: any = {
            meta: {
                transition: 'complete'
            },
            data: {
                properties: properties
            }
        };

        return this.httpService.patch(`${this.tasksUrl}/${task.id}`, json).pipe(
            tap((task: Task) => {
                this.log(`completed task w/ id=${task.id}`);
                this.changesSource.next('Task Completed Successfully');

                // update the appropriate number of Tasks observable (if required)
                this.updateNumTasks([task]);
            }),
            catchError(this.handleError<Task>('completeTask'))
        );
    }

    /**
     * Sends a HTTP PATCH request to complete Tasks with given ids.
     * 
     * @param ids The ids of the Tasks to complete. 
     * @param properties The properties required to complete a Task (dateCompleted).
     */
    completeAll(ids: number[] | string[], properties: Partial<Task>): Observable<Task[]> {
        // define JSON to submit with request
        let json: any = {
            meta: {
                transition: 'complete'
            },
            data: {
                ids: ids,
                properties: properties
            }
        };

        return this.httpService.patch(this.tasksUrl, json).pipe(
            tap((tasks: Task[]) => {
                this.log(`completed bulk update tasks w/ ids=${ids}`);
                this.changesSource.next('Tasks Completed Successfully');

                // update the appropriate number of Tasks observable (if required)
                this.updateNumTasks(tasks);
            }),
            catchError(this.handleError<Task[]>('completeTaskBulk'))
        )
    }

    /**
     * Sends a HTTP DELETE request to delete the given Task.
     * 
     * @param task The Task to delete.
     */
    delete(task: Task) {
        const url = `${this.tasksUrl}/${task.id}`;

        return this.httpService.delete(url).pipe(
            tap((task: Task) => {
                this.log(`deleted task id=${task.id}`);
                this.changesSource.next('Task Deleted Successfully');

                // update the appropriate number of Tasks observable (if required)
                this.updateNumTasks([task]);
            }),
            catchError(this.handleError<Task>('deleteTask'))
        );
    }

    /**
     * Sends a HTTP GET request to find and page through the Tasks that match the 
     * given isComplete and filter properties. The filter property can be a string 
     * which will search on the name, priority, and description. It can also be a 
     * date which will search on dueDate for pending Tasks, and dueDate and 
     * dateCompleted for complete Tasks. If no properties are given then the first 
     * 5 pending Tasks are returned.
     * 
     * @param isComplete Boolean value indicating whether Task is complete (true if complete). 
     * @param filter The filter to use on the Tasks.
     * @param sort The property to sort the results.
     * @param order The order to sort the results (ASC or DESC).
     * @param pageNumber The page of results to return. 
     * @param pageSize The number of results to return.
     */
    findTasks(isComplete:boolean = false, filter = '', sort = 'dueDate', order = 'ASC', pageNumber = 0, pageSize = 20): Observable<any> {
        return this.httpService.get(`${this.tasksUrl}`, {
            params: new HttpParams()
                .set('isComplete', `${isComplete}`)
                .set('filter', filter)
                .set('sort', sort)
                .set('order', order)
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        });
    }

    /** 
     * Sends a HTTP GET request to get the Task with the given id.
     * 
     * @param id The id of the Task to find. 
     */
    get(id: number): Observable<Task> {
        const url = `${this.tasksUrl}/${id}`;
        return this.httpService.get(url).pipe(
            tap(_ => this.log(`fetched task id=${id}`)),
            catchError(this.handleError<Task>(`getTask id=${id}`))
        ) as Observable<Task>;
    }

    /**
     * Initializes the values for the BehaviorSubjects for the number of Tasks
     * over due, due today, and due tomorrow. BehaviorSubjects are used so that 
     * the service can handle the logic to update the number of Tasks when it 
     * needs to and the component(s) that subscribe to the Observables associated
     * with the BehavoirSubjects can just listen to those Observables, rather than 
     * having to subscribe to various events (create, update, delete) and update
     * the values that way. The values are initialized using the findTasks method
     * with the appropriate filter, and a pageSize of 0 (since only the total value
     * in the meta data is needed). These BehaviorSubjects are only used for the 
     * badges that display in the header, but could be used in other places. 
     */
    initNumTasks() {
        this.findTasks(false, '', 'dueDate', 'ASC', 0, -1).subscribe((res: any) => {
            this.numPendingTasksSource.next(res.meta.total);
            this.pendingTasksSource.next(res.data);
        });
        this.findTasks(true, '', 'dueDate', 'ASC', 0, -1).subscribe((res: any) => {
            this.completeTasksSource.next(res.data);
        });
        this.findTasks(false, 'overDue', 'dueDate', 'ASC', 0, 0).subscribe((res: any) => {
            this.numTasksOverDueSource.next(res.meta.total); // just get the total from the meta
        });
        this.findTasks(false, moment().startOf('day').utc().format('MM/DD/YYYY'), 'dueDate', 'ASC', 0, 0).subscribe((res: any) => {
            this.numTasksDueTodaySource.next(res.meta.total); // just get the total from the meta
        });
        this.findTasks(false, moment().startOf('day').add(1, 'days').utc().format('MM/DD/YYYY'), 'dueDate', 'ASC', 0, 0).subscribe((res: any) => {
            this.numTasksDueTomorrowSource.next(res.meta.total); // just get the total from the meta
        });
    }

    /**
     * Updates the taskFilterSource BehaviorSubject with the given value. This
     * method is used by the DueButtonsComponent and the TaskFilterComponent to
     * update the filter so the TasksTableComponent can subscribe to the Observable
     * defined for this BehaviorSubject and update the table with the appropriate
     * Tasks based on the latest filter value.
     * 
     * @param filter The value to set the filter to. 
     */
    setTaskFilter(filter: string) {
        this.taskFilterSource.next(filter);
    }

    /** 
     * Sends a HTTP PATCH request to update the given Task.
     * 
     * @param task The Task to update (which includes the updated properties).
     * @param updateAll Optional parameter to update all remaining Tasks in sequence (if Task part of sequence).  
     */
    update(task: Task, updateAll: boolean = false): Observable<any> {
        // define JSON to submit with request
        let json: any = {
            meta: {
                transition: 'update'
            },
            data: {
                properties: task
            }
        };

        return this.httpService.patch(`${this.tasksUrl}/${task.id}`, json, {
            params: new HttpParams().set('updateAll', updateAll.toString())
        }).pipe(
            tap(_ => {
                this.log(`updated task id=${task.id}`)
                if(updateAll) {
                    this.changesSource.next('Tasks Updated Successfully');
                }
                else {
                    this.changesSource.next('Task Updated Successfully');
                }

                // update the appropriate number of Tasks observable (if required)
                // TODO handle updateAll in case subsequent Tasks over due, today, or tomorrow
                this.updateNumTasks([task]);
            }),
            catchError(this.handleError<any>('updateTask'))
        );
    }

    /**
     * Updates the BehaviorSubjects for the number of Tasks over due, due today,
     * and due tomorrow based on the given array of Tasks. If any Tasks in the
     * array have due dates less than today, equal to today, or tomorrow, then
     * the BehaviorSubjects are updated so the Observables can change accordingly
     * any components subscribing to them are automatically updated.
     * 
     * @param tasks An array of Tasks that were updated.
     */
    updateNumTasks(tasks: Task[]): void {
        this.findTasks(false, '', 'dueDate', 'ASC', 0, -1).subscribe((res: any) => {
            this.numPendingTasksSource.next(res.meta.total);
            this.pendingTasksSource.next(res.data);
        });

        let numCompleteTasks: number = tasks.filter((task: Task) => {
            return task.isComplete
        }).length;
        if(numCompleteTasks > 0) {
            this.findTasks(true, '', 'dueDate', 'ASC', 0, -1).subscribe((res: any) => {
                this.completeTasksSource.next(res.data);
            })
        }

        // find the number of Tasks that are over due
        let today = moment().startOf('day').utc();
        let numOverDue = tasks.filter((task: Task) => {
            return moment(task.dueDate, moment.ISO_8601, true).startOf('day').utc() < today;
        }).length;
        if(numOverDue > 0) {
            // update the number of over due Tasks if any of the Tasks had dueDates before today
            this.findTasks(false, 'overDue', 'dueDate', 'ASC', 0, 0).subscribe((res: any) => {
                this.numTasksOverDueSource.next(res.meta.total);
            });
        }

        // find the number of Tasks that are due today
        let numTasksDueToday = tasks.filter((task: Task) => {
            return today.isSame(moment(task.dueDate, moment.ISO_8601, true).startOf('day').utc());
        }).length;
        if(numTasksDueToday > 0) {
            // update the number of Tasks due today if any of the Tasks were due today
            this.findTasks(false, today.format('MM/DD/YYYY'), 'dueDate', 'ASC', 0, 0).subscribe((res: any) => {
                this.numTasksDueTodaySource.next(res.meta.total);
            });
        }

        // find the number of Tasks that are due tomorrow
        let tomorrow = moment(today).add(1, 'days').utc();
        let numTasksDueTomorrow = tasks.filter((task: Task) => {
            return tomorrow.isSame(moment(task.dueDate).startOf('day').utc());
        }).length;
        if(numTasksDueTomorrow > 0) {
            // update the number of Tasks due tomorrow if any of the Tasks are due tomorrow
            this.findTasks(false, tomorrow.format('MM/DD/YYYY'), 'dueDate', 'ASC', 0, 0).subscribe((res: any) => {
                this.numTasksDueTomorrowSource.next(res.meta.total);
            });
        }
    }

    /**
     * Handle HTTP operation that failed and let the app continue.
     * 
     * @param operation Name of the operation that failed
     * @param result Optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: better job of transforming error for user consumption
            this.logger.error(`TaskService: ${operation} failed: ${error.message}`);
            this.logger.error(error);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** 
     * Log a TaskService message with the LoggingService.
     * 
     * @param message The message to log
     */
    private log(message: string) {
        this.logger.info(`TaskService: ${message}`);
    }
}
