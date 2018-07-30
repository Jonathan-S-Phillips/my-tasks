/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

/* app */
import { TaskService } from '@tasks/shared/services/task.service';

/**
 * Creates 3 buttons meant for filtering Tasks "Over Due", "Due Today", and "Due Tomorrow". Allows 
 * for the buttons to be styled in multiple ways so the buttons can be re-used on the header toolbar 
 * for large screens as "mat-button" elements and in the task filter as "mat-menu-item" elements in 
 * the dropdown menu.
 */
@Component({
    selector: 'list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnDestroy, OnInit {

    /** The CSS class to apply to the buttons (only "mat-button" or "mat-menu-item" currently, but could use others). */
    @Input() buttonClass: string;
    /** The icon to display in front of the button text. */
    @Input() icon: string;
    /** Boolean value to indicate whether the button should be displayed expanded (true if the badge should be offset to right). */
    @Input() expand: boolean;
    /** The Observable that can be subscribed to (for displaying quantities in badge). */
    @Input() tasksDue: Observable<number>;
    /** The text to display for the button. */
    @Input() text: 'Over Due' | 'Due Today' | 'Due Tomorrow' | 'Pending' | 'Complete';
    /** The base URL to use when list-item clicked. */
    @Input() url: string;
    /** The filter parameter to apply to the URL when the due button clicked. */
    filter: string;
    /** The number of Tasks due. */
    numTasksDue: string;
    /** The URL paramters. */
    params: string;
    /** The subscriptions for the component. */
    sub: Subscription;

    constructor(private taskService: TaskService) {}

    /**
     * Unsubscribe from any subscriptions.
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * Initialize the component.
     */
    ngOnInit() {
        // initialize the num tasks over due, due today, and due tomorrow
        this.taskService.initNumTasks();

        // create sub to maintain all subscriptions for the component (for easy unsubscribe on destory)
        this.sub = new Subscription();

        if(this.text == 'Over Due') {
            this.filter = 'overdue';
            // subscribe to the numTasksOverDue Observable and add it to the subscriptions for the component
            const subOverDue = this.taskService.numTasksOverDue.subscribe((num: number) => {
                this.numTasksDue = num.toString(); // update number of tasks over due (so badge updates)
            });
            this.sub.add(subOverDue);
        }
        else if(this.text == 'Due Today') {
            this.filter = moment().startOf('day').utc().format('YYYY-MM-DD');
            // subscribe to the numTasksDueToday Observable and add it to the subscriptions for the component
            const subToday = this.taskService.numTasksDueToday.subscribe((num: number) => {
                this.numTasksDue = num.toString(); // update number of tasks due today (so badge updates)
            });
            this.sub.add(subToday);
        }
        else if(this.text == 'Due Tomorrow'){
            this.filter = moment().startOf('day').add(1, 'days').utc().format('YYYY-MM-DD');
            // subscribe to the numTasksDueTomorrow Observable and add it to the subscriptions for the component
            const subTomorrow = this.taskService.numTasksDueTomorrow.subscribe((num: number) => {
                this.numTasksDue = num.toString(); // update number of tasks due tomorrow (so badge updates)
            });
            this.sub.add(subTomorrow);
        }
        else {
            this.filter = '';
            if(this.text !== 'Complete') {
                const sub = this.taskService.numPendingTasks.subscribe((num: number) => {
                    if(num < 100) {
                        this.numTasksDue = num.toString();
                    }
                    else {
                        this.numTasksDue = '99+';
                    }
                });
                this.sub.add(sub);
            }
        }
    }
}
