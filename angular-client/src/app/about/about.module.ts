/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

/* fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faAngleUp);

/* module */
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about.routing';

/**
 * Defines the components and modules required for the about page.
 */
@NgModule({
    declarations: [
        AboutComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,

        FontAwesomeModule,
        
        AboutRoutingModule
    ],
    entryComponents: [
        AboutComponent
    ]
})
export class AboutModule {}
