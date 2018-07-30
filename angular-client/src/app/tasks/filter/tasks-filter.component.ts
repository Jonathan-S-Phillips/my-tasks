/* angular libraries */
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/* app */
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';

/**
 * Creates a small form with a single input element that contains a datepicker and
 * custom "select" functionality using a dropdown menu. The input element allows
 * the user to enter text or dates from the datepicker, and select a value from 
 * the dropdown menu (over due, due today, or due tomorrow) to filter/search Tasks.
 */
@Component({
    selector: 'tasks-filter',
    templateUrl: './tasks-filter.component.html',
    styleUrls: ['./tasks-filter.component.css']
})
export class TasksFilterComponent implements AfterViewInit, OnDestroy, OnInit {

    /** The input element to filter Tasks. */
    @ViewChild('taskFilter') taskFilterInput: ElementRef;
    /** Boolean to indicate if the screen size is medium or smaller (true if screen is medium or smaller). */
    isMediumScreen: boolean;
    /** The subscriptions for the component. */
    sub: Subscription;

    constructor(
        private taskService: TaskService,
        private utilsService: UtilsService
    ) {}

    /**
     * Clears the the input and the Task filter in the TaskService.
     */
    clear() {
        this.taskFilterInput.nativeElement.value = '';
        this.updateTaskFilter();
    }

    /**
     * Unsubscribe from any subscriptions.
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * Initialize the component
     */
    ngOnInit() {
        this.sub = new Subscription();
        const sub = this.utilsService.isMediumScreen.subscribe((isMediumScreen: boolean) => {
            this.isMediumScreen = isMediumScreen;
        });
        this.sub.add(sub);
    }

    /**
     * Creates observables for taskFilterInput "keyup" event (when user is typing 
     * into input element) and dueButtons "click" EventEmitter after the 
     * component has been fully initialized. 
     */
    ngAfterViewInit() {
        // create observable for the "keyup" event on the main input element but
        // delay values emitted to prevent server overload (with debouceTime) and
        // only emit when the current value is different from the last
        fromEvent(this.taskFilterInput.nativeElement,'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            ).subscribe(() => {
                // update task filter observable in TaskService
                this.updateTaskFilter();
            });
    }

    /**
     * Updates the taskFilter observable in the TaskService so that any elements
     * listening for a change to the filter can react accordingly. This method 
     * is used by the dateChange EventEmitter from the datepicker and the "keyup" 
     * event defined for the taskFilterInput element. 
     */
    updateTaskFilter() {
        this.taskService.setTaskFilter(this.taskFilterInput.nativeElement.value);
    }
}
