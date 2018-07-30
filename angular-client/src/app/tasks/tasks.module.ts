/* angular libraries */
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';

/* module */
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks.routing';
import { EditTaskModule } from '@tasks/edit/edit-task.module';
import { TaskService } from '@tasks/shared/services/task.service';
import { UtilsService } from '@tasks/shared/services/utils.service';
import { SidenavTasksModule } from '@tasks/sidenav/sidenav-tasks.module';
import { TasksTableModule } from '@tasks/table/tasks-table.module';

/**
 * Defines the components, services, and modules required to create and
 * manage Tasks.
 */
@NgModule({
    declarations: [
        TasksComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatSidenavModule,
        ReactiveFormsModule,
        RouterModule,

        /* Task modules */
        EditTaskModule,
        TasksRoutingModule,
        TasksTableModule,
        SidenavTasksModule,
    ]
})
export class TasksModule {

    /**
     * Returns a wrapper around this module that associates it with the
     * TaskService and UtilsService providers so a single instance of each
     * service can be loaded and shared between any modules in the app.
     */
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TasksModule,
            providers: [
                TaskService,
                UtilsService
            ]
        };
    }
}
