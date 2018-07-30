/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule, MatButtonModule, MatListModule, MatSidenavModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';

/* fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHourglass } from '@fortawesome/free-regular-svg-icons';
import { faClipboardList, faClipboardCheck, faHourglassEnd, faHourglassHalf, faHourglassStart, faPaste } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faClipboardList, faClipboardCheck, faHourglass, faHourglassEnd, faHourglassHalf, faHourglassStart, faPaste);

/* module */
import { SidenavTasksComponent } from './sidenav-tasks.component';
import { ListItemComponent } from './list-item.component';
import { CreateTaskModule } from '@tasks/dialogs/create-task/create-task.module';

/**
 * Defines the components, services, and modules required to for the Tasks
 * sidenav.
 */
@NgModule({
    declarations: [
        ListItemComponent,
        SidenavTasksComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        MatBadgeModule, 
        MatButtonModule,
        MatListModule, 
        MatSidenavModule, 
        MatTooltipModule,
        RouterModule,

        FontAwesomeModule,

        /* app modules */
        CreateTaskModule
    ],
    exports: [
        SidenavTasksComponent
    ],
    entryComponents: [
        SidenavTasksComponent
    ]
})
export class SidenavTasksModule {}
