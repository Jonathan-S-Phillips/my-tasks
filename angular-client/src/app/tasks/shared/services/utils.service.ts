/* angular libraries */
import { Injectable } from '@angular/core';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDialogRef } from '@angular/material';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

/* app */
import { LoggerService } from 'app/core/services/logger.service';

/* The optional states of the sidenav. */
export type SidenavMenuEvent = "Collapse" | "Expand"

/**
 * Manages utility methods that can be shared across components.
 */
@Injectable()
export class UtilsService {

    /** Tracks whether the screen is medium or smaller. */
    protected isMediumScreenSource: BehaviorSubject<boolean>;
    /** Tracks the state of the sidenav menu (Collapse or Expand). */
    protected _sidenavMenuChanges = new Subject<SidenavMenuEvent>();
    /** Observable for whether the screen is medium or smaller (true if medium or smaller, otherwise false). */
    readonly isMediumScreen: Observable<boolean>;
    /** Observale for changes to the sidenav. */
    readonly sidenavMenuChanges: Observable<SidenavMenuEvent> = this._sidenavMenuChanges;

    constructor(private breakpointObserver: BreakpointObserver, private logger: LoggerService) {
        this.isMediumScreenSource = new BehaviorSubject<boolean>(false);
        this.isMediumScreen = this.isMediumScreenSource.asObservable();
        
        // add a subscription to the breakpointObserver so the isMediumScreenSource
        // can be updated when the screen size changes.
        this.breakpointObserver
            .observe([Breakpoints.Handset, Breakpoints.Small])
            .subscribe((size: BreakpointState) => {
                this.logger.info(`UtilsService: screen size ${ size.matches ? 'small to medium' : 'large' }`);
                this.isMediumScreenSource.next(size.matches);
            });
    }

    /**
     * Sets the given dialog to full screen on medium or small devices.
     * 
     * @param dialogRef The dialog to update. 
     * @param largeSize The width and height to set for large screens.
     */
    fullScreenDialogSub(dialogRef: MatDialogRef<any>, largeSize: string = '70%'): void {
        const sub: Subscription = this.isMediumScreen.subscribe((isMediumScreen: boolean) => {
            if(isMediumScreen) {
                dialogRef.updateSize('100%', '100%');
            }
            else {
                dialogRef.updateSize(largeSize);
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
        });
    }

    /**
     * Updates the sidenav menu state.
     * 
     * @param event The state to set the sidenav menu to. 
     */
    toggleSidenavMenu(event: SidenavMenuEvent) {
        this._sidenavMenuChanges.next(event);
    }
}
