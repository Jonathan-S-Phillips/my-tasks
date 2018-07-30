/* angular libraries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

/* module */
import { FooterComponent } from './footer.component';

/**
 * Defines the components and modules for the footer.
 */
@NgModule({
    declarations: [
        FooterComponent
    ],
    imports: [
        /* angular libraries */
        CommonModule,
        FlexLayoutModule,
        RouterModule
    ],
    exports: [
        FooterComponent
    ],
    entryComponents: [
        FooterComponent
    ]
})
export class FooterModule {}
