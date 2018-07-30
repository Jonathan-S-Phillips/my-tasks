/* angular libraries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/* app */
import { CreateTaskComponent } from '@tasks/dialogs/create-task/create-task.component';
import { UtilsService } from '@tasks/shared/services/utils.service';
import { TaskService } from '@tasks/shared/services/task.service';

/**
 * Creates the main layout for the application. The main layout currently
 * consists of the header, side menu, footer, and router-outlet.
 */
@Component({
    selector: 'sidenav-tasks',
    templateUrl: './sidenav-tasks.component.html',
    styleUrls: ['./sidenav-tasks.component.css']
})
export class SidenavTasksComponent implements OnDestroy, OnInit {

    /** Boolean to indicate if the sidenav is expanded (true if expanded). */
    isExpanded: boolean;
    /** Boolean to indicate if the screen size is medium or smaller (true if screen is medium or smaller). */
    isMediumScreen: boolean;
    /** The number of over due Tasks. */
    numTasksOverDue: Observable<number>;
    /** The number of Tasks due today. */
    numTasksDueToday: Observable<number>;
    /** The number of Tasks due tomorrow. */
    numTasksDueTomorrow: Observable<number>;
    /** The index of the sidenav item that is selected. */
    selectedIndex: number;
    /** The subscriptions for the component. */
    private sub: Subscription;
    /** The routes with filter parameter for the sidenav items. */
    private sidenavRoutes: any[] = [
        ['tasks/pending'], 
        ['tasks/pending', { filter: 'overdue' }], 
        ['tasks/pending', { filter: 'today' }],
        ['tasks/pending', { filter: 'tomorrow' }],
        ['tasks/complete']
    ];
    /** The properties for each of the list-items in the sidenav. */
    listItems: any[] = [
        { buttonClass: 'defaultBadge right', icon: 'clipboard-list', marker: 'marker-list-item-pending-tasks', text: 'Pending', routerLink: '/pending' },
        { buttonClass: 'overDueBadge right', icon: 'hourglass-end', marker: '', text: 'Over Due', routerLink: '/pending', routeParams: {filter: 'overdue' } },
        { buttonClass: 'dueTodayBadge right', icon: 'hourglass-half', marker: '', text: 'Due Today', routerLink: '/pending', routeParams: {filter: 'today' } },
        { buttonClass: 'dueTomorrowBadge right', icon: 'hourglass-start', marker: '', text: 'Due Tomorrow', routerLink: '/pending', routeParams: {filter: 'tomorrow'} },
        { icon: 'clipboard-check', marker: 'marker-list-item-complete-tasks', text: 'Complete', routerLink: '/complete', routeParams: {filter: ''} }
    ];

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService,
        private utilsService: UtilsService
    ) {}

    /**
     * Opens the dialog to create a Task.
     */
    openCreateTaskDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '70%';
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.autoFocus = false;
        let createDialogRef = this.dialog.open(CreateTaskComponent, dialogConfig);

        this.utilsService.fullScreenDialogSub(createDialogRef);
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
        this.numTasksDueToday = this.taskService.numTasksDueToday;
        this.numTasksDueTomorrow = this.taskService.numTasksDueToday;
        this.numTasksOverDue = this.taskService.numTasksOverDue;

        this.sub = new Subscription();
        const subMenuToggle = this.utilsService.sidenavMenuChanges.pipe(
            filter(event => event === 'Collapse' || event === 'Expand')
        ).subscribe(next => {
            if(next === 'Collapse') {
                this.isExpanded = false;
            }
            else {
                this.isExpanded = true;
            }
        });
        this.sub.add(subMenuToggle);

        const subScreenSize = this.utilsService.isMediumScreen.subscribe((isMediumScreen: boolean) => {
            this.isMediumScreen = isMediumScreen;
            if(this.isExpanded && this.isMediumScreen) {
                this.isExpanded = false;
            }
            else {
                // set to true on medium or smaller devices, otherwise to false
                this.isExpanded = !this.isMediumScreen;
            }
        });
        this.sub.add(subScreenSize);

        // subscribe to the parameters in the route
        const params = this.getRouteParamsFromChild();
        const sub = params.subscribe(params => {
            // highlight the list-item based on the route params
            this.highlightListItem(params);
        });
        this.sub.add(sub);
    }

    /**
     * Updates the selected index for the sidenav items and navigates to the
     * route at the given index.
     * 
     * @param index The index of the sidenav item that was clicked. 
     */
    select(index: number) {
        this.selectedIndex = index;
        this.router.navigate(this.sidenavRoutes[index]);
    }

    /**
     * Traverses the route in the router state tree until it has reached
     * the last URL segement and returns the params from there.
     */
    private getRouteParamsFromChild() {
        let route = this.route;
        while(route.firstChild) {
            route = route.firstChild;
        }
        return route.params;
    }

    /**
     * Highlights the correct listItem in the sidenav based on the given
     * params (specifically filter params). If no filter params are found, 
     * then the listItem is set based on the current URL ("complete" or 
     * "pending"). The listItems are highlighted by setting the 
     * selectedIndex of the listItem from the array of listItems defined 
     * for the component.
     * 
     * @param params The parameters from the URL.
     */
    private highlightListItem(params: any) {
        // set the selectedIndex based on the value of the filter param
        let filter: string = params['filter'];
        if(filter == 'overdue') {
            this.selectedIndex = 1;
        }
        else if(filter == 'today') {
            this.selectedIndex = 2;
        }
        else if(filter == 'tomorrow') {
            this.selectedIndex = 3;
        }
        else {
            // if no filter parameter is present, then set the selectedIndex
            // based on whether 'complete' is in the URL.
            if(this.router.url.indexOf('complete') >= 0) {
                this.selectedIndex = 4;
            }
            else {
                this.selectedIndex = 0;
            }
        }
    }
}
