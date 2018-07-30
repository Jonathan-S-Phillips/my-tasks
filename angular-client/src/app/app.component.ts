/* angular libraries */
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

/* app services */
import { LoaderService, LoaderState } from './core/services/loader.service';

/**
 * Creates the main layout for the application. The main layout currently
 * consists of the header, side menu, footer, and router-outlet.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {

    /** Boolean value to indicate when the application is loading something. */
    loading: boolean;
    /** The subscriptions for the component. */
    private sub: Subscription;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private loaderService: LoaderService
    ) {}

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
        const subLoading = this.loaderService.loaderState.subscribe((loaderState: LoaderState) => {
            this.loading = loaderState.show;
            this.changeDetectorRef.detectChanges();
        });
        this.sub.add(subLoading);
    }
}
