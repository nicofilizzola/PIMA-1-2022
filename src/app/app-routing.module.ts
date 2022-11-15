import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventListComponent } from './components/add-event-list/add-event-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { StatsViewComponent } from './components/stats-view/stats-view/stats-view.component';


const routes: Routes = [
  { path: 'events', component: AddEventListComponent},
  { path: 'stats', component: StatsViewComponent },
  { path: '', component: CalendarComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
