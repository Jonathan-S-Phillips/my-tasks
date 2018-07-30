/* angular libraries */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* About module components */
import { AboutComponent } from './about.component';

/* The routes within the About module. Defaults to the AboutComponent. */
const routes: Routes = [
    {
        path: 'about',
        component: AboutComponent
    }
];

/**
 * The router module for the About module.
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AboutRoutingModule { }
