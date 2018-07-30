/* angular libraries */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* components */
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

/* The routes for the app. Defaults to the tasks module at the root. */
const appRoutes: Routes = [
    {
        path: 'about',
        loadChildren: './about/about.module#AboutModule'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tasks'
    },
    {
        path: '404',
        component: PageNotFoundComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

/**
 * The router module for the application.
 */
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {};
