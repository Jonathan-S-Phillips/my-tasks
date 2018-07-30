import * as moment from 'moment';

import { Observable } from 'rxjs';

import { LoggerService } from 'app/core/services/logger.service';

import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service';

import { TASKS } from '@taskMocks/seed/tasks';
import { TasksHelper } from '@taskMocks/tasks-helper';

/**
 * A mock TaskService to use for unit tests. Uses the TASKS from the seed
 * data and allows basic ability to sort and filter tasks. Most actions to
 * create or update Tasks just return Observables of the given Tasks since
 * we are not concerned with actually creating or modifying Tasks on the
 * front end during unit tests.
 */
export class MockTaskService extends TaskService {

    private tasksHelper: TasksHelper;

    constructor() {
        super(null, new LoggerService());
        this.tasksHelper = new TasksHelper(TASKS);
        this.updateNumTasks([]);
    }

    create(task: Task): Observable<Task> {
        return Observable.of(task);
    }

    complete(task: Task, properties: Partial<Task>): Observable<Task> {
        return Observable.of(task);
    }

    completeAll(ids: number[] | string[], properties: Partial<Task>): Observable<Task[]> {
        return Observable.of([]);
    }

    delete(task: Task): Observable<Task> {
        return Observable.of(task);
    }

    findTasks(isComplete:boolean = false, filter = '', sort = 'dueDate', order = 'ASC', pageNumber = 0, pageSize = 20): Observable<any> {
        let tasks: Task[] = this.tasksHelper.filterTasks(isComplete, filter);
        let total: number = tasks.length;

        if(pageSize > -1) {
            tasks = tasks.slice(pageNumber * pageSize, (pageNumber * pageSize) + pageSize);
        }

        return Observable.of({
            meta: {
                total: total,
                totalPages: Math.ceil(total/pageSize)
            },
            data: tasks
        });
    }

    update(task: Task, updateAll: boolean): Observable<Task> {
        return Observable.of(task);
    }

    updateNumTasks(tasks: Task[]) {
        let overDue: Task[];
        let dueToday: Task[];
        let dueTomorrow: Task[];
        let today = moment().startOf('day').utc();
        let tomorrow = moment(today).add(1, 'days').utc();
        if(tasks.length > 0) {
            overDue = tasks.filter((task: Task) => { return task.dueDate < today.toDate() });
            dueToday = this.tasksHelper.getTasksDue(today.toDate(), tasks);
            dueTomorrow = this.tasksHelper.getTasksDue(tomorrow.toDate(), tasks);
        }
        else {
            overDue = this.tasksHelper.filterTasks(false, 'overDue');
            dueToday = this.tasksHelper.filterTasks(false, today.format('MM/DD/YYYY'));
            dueTomorrow = this.tasksHelper.filterTasks(false, tomorrow.format('MM/DD/YYYY'));
        }

        this.completeTasksSource.next(this.tasksHelper.completeTasks);
        this.pendingTasksSource.next(this.tasksHelper.pendingTasks);
        this.numTasksOverDueSource.next(overDue.length);
        this.numTasksDueTodaySource.next(dueToday.length);
        this.numTasksDueTomorrowSource.next(dueTomorrow.length);
    }
}