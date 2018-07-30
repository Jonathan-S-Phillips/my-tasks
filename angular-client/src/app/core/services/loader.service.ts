/* angular libraries */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * The state of the loader.
 */
export interface LoaderState {
    /** Boolean to indicate whether to show or hide the loading spinner. */
    show: boolean;
}

/**
 * Handles displaying and hiding the loading spinner.
 */
@Injectable()
export class LoaderService {

    /** An Observable for the state of the loader. */
    loaderState: Observable<LoaderState>;
    /** The state of the loader. */
    private loaderSubject: Subject<LoaderState>;

    constructor() { 
        this.loaderSubject = new Subject<LoaderState>();
        this.loaderState = this.loaderSubject.asObservable();
    }

    /**
     * Sets the loaderSubject to show: true to display the loading spinner.
     */
    show() {
        this.loaderSubject.next(<LoaderState>{show: true});
    }
    
    /**
     * Sets the loaderSubject to show: false to hide the loading spinner.
     */
    hide() {
        this.loaderSubject.next(<LoaderState>{show: false});
    }
}
