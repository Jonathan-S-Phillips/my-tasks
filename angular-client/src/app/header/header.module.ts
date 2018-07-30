/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faClipboardList } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faBars, faClipboardList);

/* module */
import { HeaderComponent } from './header.component';
import { TasksFilterModule } from '@tasks/filter/tasks-filter.module';

/**
 * Defines the components, services, and modules required for the header.
 */
@NgModule({
    declarations: [
        HeaderComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        MatButtonModule, 
        MatToolbarModule, 
        MatTooltipModule,
        RouterModule,

        FontAwesomeModule,

        /* app modules */
        TasksFilterModule
    ],
    exports: [
        HeaderComponent
    ],
    entryComponents: [
        HeaderComponent
    ]
})
export class HeaderModule {}
