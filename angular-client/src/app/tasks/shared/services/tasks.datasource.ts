/* angular libraries */
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

/* app */
import { LoggerService } from 'app/core/services/logger.service';
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service';
 
/**
 * The DataSource to use for the TasksTableComponent.
 */
export class TasksDataSource implements DataSource<Task> {

    /** The array of Tasks. */
    data: Task[];
    /** Indicates when connection to load data is active. */
    loading: Observable<boolean>;
    /** The total number of Tasks. */
    total: number;
    /** The total number of pages of Tasks. */
    totalPages: number;
    /** Subject for dataSource connection. */
    private tasksSubject;
    /** Subject for when connection to load data is active. */
    private loadingSubject;

    /**
     * Initializes all BehaviorSubjects and Observables.
     * 
     * @param taskService 
     */
    constructor(private logger: LoggerService, private taskService: TaskService) {
        this.data = [];
        this.loadingSubject = new BehaviorSubject<boolean>(false);
        this.tasksSubject = new BehaviorSubject<Task[]>([]);

        this.loading = this.loadingSubject.asObservable();
    }

    connect(collectionViewer: CollectionViewer): Observable<Task[]> {
        this.logger.info("TasksDataSource: Connecting data source");
        return this.tasksSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.logger.info("TasksDataSource: Disconnecting data source");
        this.tasksSubject.complete();
        this.loadingSubject.complete();
    }

    /**
     * Adds the Tasks returned from the TaskService findTasks() method to the current
     * array of Tasks. This method is currently used to emulate infinite scroll in
     * the Tasks table on medium or small devices.
     * 
     * @param isComplete Boolean value indicating whether Task is complete (true if complete). 
     * @param filter The filter to use on the Tasks.
     * @param sort The property to sort the results.
     * @param order The order to sort the results (ASC or DESC).
     * @param pageNumber The page of results to return. 
     * @param pageSize The number of results to return.
     */
    concatTasks(isComplete = false, filter = '', sort = 'dueDate', order = 'ASC', pageIndex = 0, pageSize = 20) {
        this.findTasks(isComplete, filter, sort, order, pageIndex, pageSize, this.concatData);
    }

    /**
     * Updates the current array of Tasks with the Tasks returned from the TaskService
     * findTasks() method.
     * 
     * @param isComplete Boolean value indicating whether Task is complete (true if complete). 
     * @param filter The filter to use on the Tasks.
     * @param sort The property to sort the results.
     * @param order The order to sort the results (ASC or DESC).
     * @param pageNumber The page of results to return. 
     * @param pageSize The number of results to return. 
     */
    loadTasks(isComplete = false, filter = '', sort = 'dueDate', order = 'ASC', pageIndex = 0, pageSize = 20) {
        this.findTasks(isComplete, filter, sort, order, pageIndex, pageSize, this.setData);
    }

    /**
     * Calls the TaskService findTasks() method with the given parameters and updates
     * the current array of Tasks based on the given callback function when the
     * findTasks() method completes.
     * 
     * @param isComplete Boolean value indicating whether Task is complete (true if complete). 
     * @param filter The filter to use on the Tasks.
     * @param sort The property to sort the results.
     * @param order The order to sort the results (ASC or DESC).
     * @param pageNumber The page of results to return. 
     * @param pageSize The number of results to return. 
     * @param callback The function to update the current array of Tasks.
     */
    private findTasks(isComplete, filter, sort, order, pageIndex, pageSize, callback) {
        this.loadingSubject.next(true);

        this.taskService
                .findTasks(isComplete, filter, sort, order, pageIndex, pageSize)
                .pipe(
                    catchError(() => of([])),
                    finalize(() => this.loadingSubject.next(false))
                )
                .subscribe(res => {
                    this.total = parseInt(res.meta.total);
                    this.totalPages = parseInt(res.meta.totalPages);
                    this.data = callback(this.data, res);
                    this.tasksSubject.next(this.data);
                });
    }

    //--- Callback functions -------------------------------------------------------

    /**
     * Returns the given data array of Tasks with the data from the given res
     * parameter appended.
     * 
     * @param data The current array of Tasks for the dataSource.
     * @param res A JSON object containing an array of Tasks in the data property.
     */
    private concatData(data: Task[], res: any): Task[] {
        data.push.apply(data, res.data);
        return data;
    }

    /**
     * Returns a new array of Tasks from the given res parameter.
     * 
     * @param data The current array of Tasks for the dataSource.
     * @param res A JSON object containing an array of Tasks in the data property.
     */
    private setData(data: Task[], res: any): Task[] {
        data = res.data;
        return data;
    }
}
