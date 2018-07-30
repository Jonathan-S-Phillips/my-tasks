/* angular libraries */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material';

/* app components */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AboutModule } from './about/about.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CoreModule } from './core/core.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { TasksModule } from './tasks/tasks.module'; 

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    /* angular libraries */
    BrowserModule,
    MatProgressSpinnerModule,

    /* app modules */
    AboutModule,
    CoreModule.forRoot(),
    FooterModule,
    HeaderModule,
    TasksModule.forRoot(),
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [PageNotFoundComponent]
})
export class AppModule { }
