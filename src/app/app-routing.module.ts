import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGcalEventListComponent } from './components/add-event-list/add-event-list.component';
import { GcalCalendarComponent } from './components/calendar/calendar.component';
import { StatsViewComponent } from './components/stats-view/stats-view/stats-view.component';


const routes: Routes = [
  { path: 'events', component: AddGcalEventListComponent},
  { path: 'stats', component: StatsViewComponent },
  { path: '', component: GcalCalendarComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
