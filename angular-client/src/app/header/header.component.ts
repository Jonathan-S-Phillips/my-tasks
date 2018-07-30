/* angular libraries */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

/* app */
import { TasksFilterComponent } from '@tasks/filter/tasks-filter.component';
import { SidenavMenuEvent, UtilsService } from '@tasks/shared/services/utils.service';

/**
 * Creates the main header element for the app. The header is responsive based on the size of the screen. If
 * the screen is large, then the dueButtons and taskFilter components are rendered directly in the header on
 * the right side of the screen for easy access. If the screen is medium or smaller, then the right side of
 * the header collapses into a single "search" icon button, which when clicked displays the taskFilter
 * component.
 */
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    /** Reference to the TaskFilterComponent in the templateUrl. */
    @ViewChild('taskFilterLargeScreen') taskFilter: TasksFilterComponent;
    /** Boolean to indicate if the screen size is medium or smaller (true if screen is medium or smaller). */
    isMediumScreen: boolean;
    /** Boolean to indicate whether or not to show the search bar (shows search bar if true). */
    showSearchBar: boolean;
    /** The current state of the sidenav ('Collapse' or 'Expand'). */
    sidenavMenuState: SidenavMenuEvent;
    /** The subscriptions for the component. */
    sub: Subscription;

    constructor(private utilsService: UtilsService) {}

    /**
     * Unsubscribe from any subscriptions.
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * Initialize the component. The search bar should be hidden initially, and the sidenav menu should be set
     * to 'Collapse' on medium or smaller devices and 'Expand' on larger devices.
     */
    ngOnInit() {
        this.showSearchBar = false;

        this.sub = new Subscription();
        const sub = this.utilsService.isMediumScreen.subscribe((isMediumScreen: boolean) => {
            this.isMediumScreen = isMediumScreen;
            // set to 'Collapse' on medium or smaller devices, otherwise to 'Expand'
            this.sidenavMenuState = this.isMediumScreen ? 'Collapse' : 'Expand';
        });
        this.sub.add(sub);
    }

    /**
     * Expands and collapses the sidenav menu based on the current state of the sidenav menu. If the sidenav
     * menu is collapsed, then it is expanded. Otherwise the sidenav menu is collapsed.
     */
    onSidenavMenuToggle() {
        if(this.sidenavMenuState === 'Collapse') {
            this.sidenavMenuState = 'Expand';
            this.utilsService.toggleSidenavMenu('Expand');
        }
        else {
            this.sidenavMenuState = 'Collapse';
            this.utilsService.toggleSidenavMenu('Collapse');
        }
    }

    /**
     * Displays or hides the search bar based on the boolean parameter passed in.
     * 
     * @param showSearchBar true if the search bar should be displayed, otherwise false. 
     */
    setShowSearchBar(showSearchBar: boolean) {
        this.showSearchBar = showSearchBar;
    }
}
