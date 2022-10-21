import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { AddEventListComponent } from './add-event-list/add-event-list.component';
import { AddEventItemComponent } from './add-event-list/add-event-item/add-event-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { GcalInterceptor } from './interceptors/gcal.interceptor';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent,
    AddEventListComponent,
    AddEventItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    FormsModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GcalInterceptor,
      multi: true,
      deps: [OAuthService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
