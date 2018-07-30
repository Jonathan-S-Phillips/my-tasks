/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatTooltipModule } from '@angular/material';

/* fontawesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

// Add icons to library for convenient access in components
library.add(faSearch, faTimes);

/* module */
import { TasksFilterComponent } from '@tasks/filter/tasks-filter.component';

/**
 * Defines the components, services, and modules required to filter Tasks.
 */
@NgModule({
    declarations: [
        TasksFilterComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        MatButtonModule, 
        MatDatepickerModule, 
        MatFormFieldModule,
        MatInputModule, 
        MatNativeDateModule,
        MatTooltipModule, 

        FontAwesomeModule
    ],
    exports: [
        TasksFilterComponent
    ],
    entryComponents: [
        TasksFilterComponent
    ]
})
export class TasksFilterModule {}
