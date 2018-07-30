/* angular libraries */
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule, MatSidenavModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

/* services */
import { ConsoleLoggerService } from './services/console-logger.service';
import { HttpService } from './services/http.service';
import { LoaderService } from './services/loader.service';
import { LoggerService } from './services/logger.service';

/**
 * The CoreModule defines all the providers for the singleton services
 * that should be loaded when the app starts. This should only be imported
 * at the root AppModule.
 */
@NgModule({
    imports: [
        /* angular libraries */
        BrowserAnimationsModule,
        CommonModule,
        FlexLayoutModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        RouterModule
    ],
    exports: [
        /* angular libraries */
        BrowserAnimationsModule,
        CommonModule,
        FlexLayoutModule,
        HttpClientModule,
        RouterModule
    ]
})
export class CoreModule {
    
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        // make sure CoreModule is imported only by one NgModule the AppModule
        if(parentModule) {
            throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
    }

    /**
     * Returns a wrapper around this module that associates it with the
     * TaskService and UtilsService providers so a single instance of each
     * service can be loaded and shared between any modules in the app.
     */
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                HttpService,
                LoaderService,
                { provide: LoggerService, useClass: ConsoleLoggerService }
            ]
        };
    }
}
