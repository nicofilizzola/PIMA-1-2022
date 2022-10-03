import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddEventListComponent } from './add-event-list/add-event-list.component';
import { CustomFormComponent } from './add-event-list/custom-form/custom-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomFormComponent,
    AddEventListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
