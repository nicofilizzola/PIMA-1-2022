import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { AddGcalEventListComponent } from './components/add-event-list/add-event-list.component';
import { AddGcalEventItemComponent } from './components/add-event-list/add-event-item/add-event-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeFrameSelectComponent } from './components/time-frame-select/time-frame-select.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { GcalInterceptor } from './interceptors/gcal.interceptor';
import { GcalCalendarComponent } from './components/calendar/calendar.component';
import { AddGcalEventTooltipComponent } from './components/add-event-list/add-event-item/add-event-tooltip/add-event-tooltip.component';
import { HeaderComponent } from './components/header/header.component';
import { StatsViewComponent } from './components/stats-view/stats-view/stats-view.component';


@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent,
    AddGcalEventListComponent,
    AddGcalEventItemComponent,
    GcalCalendarComponent,
    TimeFrameSelectComponent,
    AddGcalEventTooltipComponent,
    HeaderComponent,
    StatsViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GcalInterceptor,
      multi: true,
      deps: [OAuthService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
