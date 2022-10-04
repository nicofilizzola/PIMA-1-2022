import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddEventListComponent } from './add-event-list/add-event-list.component';
import { AddEventItemComponent } from './add-event-list/add-event-item/add-event-item.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEventListComponent,
    AddEventItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
