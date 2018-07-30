/* angular libraries */
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Creates the about page for the app.
 */
@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit, OnDestroy {

    /** Reference to the element that scrolls in the component. */
    @ViewChild('aboutScroll') aboutElement: ElementRef;
    /** Boolean to indicate whether the button to scroll to top should display (defaults to false). */
    displayScrollToTop: boolean;
    /** The subscriptions for the component. */
    private sub: Subscription;

    constructor(private route:ActivatedRoute) {
        this.displayScrollToTop = false;
    }

    /**
     * Unsubscribe from any subscriptions.
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * Initialize subscription for route fragment after view is initialized
     * so element at fragment can be scrolled into view (if fragment present).
     */
    ngAfterViewInit() {
        this.sub = new Subscription();

        // Add support for handling anchor tags based on answers from issue below.
        // https://github.com/angular/angular/issues/6595
        const sub = this.route.fragment.subscribe(f => {
            const element = document.querySelector('#' + f);
            if(element) {
                element.scrollIntoView({behavior:'smooth'});
            }
        });
        this.sub.add(sub);
    }

    /**
     * Handles setting displayScrollToTop on window scroll event.
     */
    onAboutScroll() {
        if (this.aboutElement.nativeElement.scrollTop > 100) {
            this.displayScrollToTop = true;
        } 
        else if (this.aboutElement.nativeElement.scrollTop < 10) {
            this.displayScrollToTop = false; 
        } 
    }

    /**
     * Scrolls the about div to the top.
     */
    scrollToTop() {
        this.aboutElement.nativeElement.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }
}
