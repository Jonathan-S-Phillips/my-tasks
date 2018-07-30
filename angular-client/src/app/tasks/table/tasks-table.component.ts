/* type definitions */
import * as moment from 'moment';

/* angular libraries */
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ChangeDetectorRef, ElementRef, OnDestroy, OnInit, HostListener, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSnackBar, MatSort } from "@angular/material";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

/* app */
import { LoggerService } from 'app/core/services/logger.service';
import { ButtonBarComponent } from '@tasks/button-bar/button-bar.component';
import { ButtonsComponent } from '@tasks/buttons/buttons.component';
import { Task } from '@tasks/shared/models/task.model';
import { TaskService } from '@tasks/shared/services/task.service';
import { TasksDataSource } from '@tasks/shared/services/tasks.datasource';
import { UtilsService } from '@tasks/shared/services/utils.service';

/**
 * Creates the table component for displaying Task details. Works for both
 * pending and complete Tasks. 
 */
@Component({
    selector: 'tasks-table',
    templateUrl: './tasks-table.component.html',
    styleUrls: ['./tasks-table.component.css']
})
export class TasksTableComponent implements AfterViewInit, OnDestroy, OnInit {

    /** The columns to display. Defaults to columns for pending Tasks. */
    @Input() displayedColumns: string[] = ["select", "name", "priority", "description", "dueDate"];
    /** The filter for the table. */
    @Input() filter: string;
    /** Boolean to indicate whether the Tasks in the table are complete (true to load complete Tasks). */
    @Input() isComplete: boolean = false;
    /** The ButtonBarComponent. */
    @ViewChild(ButtonBarComponent) buttonBar: ButtonBarComponent;
    /** The sort container. */
    @ViewChild(MatSort) sort: MatSort;
    /** The table element. Must specify read option otherwise entire angular component is returned.
       See: https://github.com/angular/material2/issues/3922#issuecomment-334975063 */
    @ViewChild('taskTable', {read: ElementRef}) table: ElementRef;
    /** The buttons to edit, complete, or delete one or more Tasks. */
    @ViewChildren(ButtonsComponent) buttons: QueryList<ButtonsComponent>;
    /** Boolean to indicate if the complete button should be enabled (set to true if 1 or more Tasks selected). */
    enableCompleteButton: boolean;
    /** Boolean to indicate if the delete button should be enabled (set to true if 1 or more Tasks selected). */
    enableDeleteButton: boolean;
    /** Boolean to indicate if the edit button should be enabled (set to true if exactly 1 Task is selected). */
    enableEditButton: boolean;
    /** The dataSource to load the Tasks from. */
    dataSource: TasksDataSource;
    /** Boolean to indicate if the screen size is medium or smaller (true if screen is medium or smaller). */
    isMediumScreen: boolean;
    /** Boolean to indicate if nav is fixed. */
    navIsFixed: boolean;
    /** The model to track Tasks selected in table. */
    selection = new SelectionModel<Task>(true, []);
    /** Reference to the displayedColumns in case the component is rendered on small to medium size screen. */
    private displayedColumnsOrig: string[];
    /** The current page of Tasks loaded from the TaskDataSource. */
    private pageIndex: number;
    /** The number of Tasks to retrieve from the TaskDataSource. */
    private pageSize: number;
    /** The subscriptions for the component. */
    private sub: Subscription;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private logger: LoggerService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private taskService: TaskService,
        private utilsService: UtilsService
    ){}

    /**
     * Returns the given date in the format "MM/DD/YYYY". This is a convenience method to format dates for
     * Tasks in the table.
     * 
     * @param date The date to format. 
     */
    format(date: Date) {
        return moment(date, moment.ISO_8601, true).utc().format('MM/DD/YYYY');
    }

    /**
     * Sets the class on the row in the table to highlight it based on when the Task is due. If the Task
     * is over due then the row is highlighted red, if it is due today then the row is highlighted orange,
     * if the task is due tomorrow then the row is highlighted yellow. Otherwise there is not highlight
     * added to the row.
     * 
     * @param task The task associated with the row to be highlighted. 
     */
    highlightRow(task: Task) {
        let dueDate = moment(task.dueDate).utc();
        let today = moment().startOf('day').utc();
        let tomorrow = moment().startOf('day').add(1, 'days').utc();

        if(dueDate.isBefore(today, 'day')) {
            return 'row-red';
        }
        else if(dueDate.isSame(today, 'day')) {
            return 'row-orange';
        }
        else if(dueDate.isSame(tomorrow, 'day')) {
            return 'row-yellow';
        }
        else {
            return '';
        }
    }

    /** 
     * Returns true if all Tasks in the table are selected. 
     */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /**
     * Loads the page of Tasks based on the current page size and pageIndex (or paginator.pageIndex).
     * 
     * @param filter The filter to use when loading the Tasks. 
     */
    loadTasksPage(filter: string = '') {
        let page: number;
        let pageSize: number;

        if(this.isMediumScreen) {
            // set the page and pageSize based on the components if the screen is medium or smaller (since
            // the paginator is not available on these screens)
            page = this.pageIndex;
            pageSize = this.pageSize;
        }
        else {
            // set the page and pageSize based on the paginator child component on large screens
            page = this.buttonBar.paginator.pageIndex;
            pageSize = this.buttonBar.paginator.pageSize;
        }

        // reload the Tasks in the dataSource
        this.dataSource.loadTasks(this.isComplete, filter, this.sort.active, this.sort.direction.toUpperCase(), page, pageSize);
        this.changeDetector.detectChanges();
    }

    /** 
     * Selects all rows if they are not all selected; otherwise clear selection. 
     */
    masterToggle() {
        if(this.isAllSelected()) {
            this.selection.clear();
            this.disableButtons();
        }
        else {
            this.dataSource.data.forEach(row => this.selection.select(row));

            if(!this.isComplete) {
                this.enableCompleteButton = true;
            }
            this.enableDeleteButton = true;
        }
    }

    /**
     * Initialize subscriptions that require the component to be fully
     * initialized.
     */
    ngAfterViewInit() {
        // set up sort and paginator subscriptions for large screens
        if(!this.isMediumScreen) {
            // reset the paginator after sorting
            const sortChange = this.sort.sortChange.subscribe(() => this.buttonBar.paginator.pageIndex = 0);
            this.sub.add(sortChange);

            const sort = this.sort.sortChange.pipe(
                tap(() => this.loadTasksPage())
            ).subscribe();
            this.sub.add(sort);

            const page = this.buttonBar.paginator.page.pipe(
                tap(() => this.loadTasksPage()      // reload the Tasks page
            )).subscribe();
            this.sub.add(page);
        }

        // set up the subscription for when the task filter changes
        const filterChange = this.taskService.taskFilter.subscribe((filter: string) => {
            if(!this.isMediumScreen) {
                this.changeDetector.detectChanges();
                this.buttonBar.paginator.pageIndex = 0;  // reset the paginator (for large screens)
            }
            this.pageIndex = 0;                // reset the page to 0 (in case we are on a medium or small screen)
            this.loadTasksPage(filter);        // reload the Tasks page with the given filter
        });
        this.sub.add(filterChange);

        const sub = this.taskService.changes.subscribe((changes: string) => {
            this.loadTasksPage(); 
            this.selection.clear();
            this.disableButtons();
            if(changes) {
                this.snackBar.open(changes, '', { duration: 2000 });
            }
        })
        this.sub.add(sub);
    }

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
        this.sub = new Subscription();
        this.displayedColumnsOrig = this.displayedColumns;

        this.dataSource = new TasksDataSource(this.logger, this.taskService);

        const paramsSub = this.route.params.subscribe(params => {
            let filter = params['filter'] || '';
            this.dataSource.loadTasks(this.isComplete, filter, 'dueDate', 'ASC', 0, 20);
        });
        this.sub.add(paramsSub);

        const screenSub = this.utilsService.isMediumScreen.subscribe((isMediumScreen: boolean) => {
            this.isMediumScreen = isMediumScreen;
            this.pageSize = 20;
            if(this.isMediumScreen) {
                this.displayedColumns = ['select', 'name'];
                this.pageIndex = 0;
            }
            else {
                this.displayedColumns = this.displayedColumnsOrig;
            }
        });
        this.sub.add(screenSub);
    }

    /**
     * Handles enabling and disabling the toolbar buttons based on the number of rows selected. If one or more
     * rows is selected then the complete and delete buttons should be enabled (more than one row selected
     * allows for bulk complete or delete). If exactly one row is selected then the edit button should be enabled,
     * otherwise the edit button should be disabled. This is because only one Task can be modified at a time. 
     * 
     * @param row The row that is selected. 
     */
    onRowSelected(row:any) {
        this.selection.toggle(row);
        if(this.selection.selected.length >= 1) {
            // enable the edit button if one or more rows is selected
            this.enableDeleteButton = true;

            // enable the complete button if the Tasks in the table are pending
            if(!this.isComplete) {
                this.enableCompleteButton = true;
            }

            if(this.selection.selected.length == 1) {
                // enable the edit button if exaclty one row is selected
                this.enableEditButton = true;
            }
            else {
                // disable the edit button if more than one row is selected
                this.enableEditButton = false;
            }
        }
        else {
            this.disableButtons();
        }
    }

    /**
     * Handler for the scroll event for the mat-table. On medium screens or
     * smaller an infinite scroll capability is simulated (where additional 
     * Tasks are added to existing data as user scrolls down and additional 
     * data available; since paging removed on medium screens or smaller).
     * 
     * @param event 
     */
    onTableScroll(event) {
        const tableViewHeight = event.target.offsetHeight // viewport: ~500px
        const tableScrollHeight = event.target.scrollHeight // length of all table
        const scrollLocation = event.target.scrollTop; // how far user scrolled
        
        const buffer = 50;
        const limit = tableScrollHeight - tableViewHeight - buffer;    
        if(this.isMediumScreen && scrollLocation > limit) {
            // add more data (if any) if on a medium or smaller screen and 
            // user has scrolled within 50px of the bottom
            if(this.pageIndex < this.dataSource.totalPages) {
                this.pageIndex += 1;
                this.dataSource.concatTasks(this.isComplete, '', 'dueDate', 'ASC', this.pageIndex, this.pageSize);
            }
        }

        if(scrollLocation > 100) {
            this.navIsFixed = true;
        }
        else {
            this.navIsFixed = false;
        }
    }

    /**
     * Handles setting navIsFixed on window scroll event.
     */
    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (this.table.nativeElement.scrollTop > 100) {
            this.navIsFixed = true;
        } 
        else if (this.table.nativeElement.scrollTop < 10) {
            this.navIsFixed = false; 
        } 
    }

    /**
     * Scrolls the window and table to the top.
     */
    scrollToTop() {
        let currentScroll = document.documentElement.scrollTop || document.body.scrollTop; 
        if (currentScroll > 0) {
            window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }

        let table = this.table.nativeElement;
        let tableScroll = table.scrollTop;
        if(tableScroll > 0) {
            table.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
    }

    /**
     * Disable the complete, delete, and edit buttons if no rows are selected
     */
    private disableButtons() {
        this.enableCompleteButton = false;
        this.enableDeleteButton = false;
        this.enableEditButton = false;
    }
}
