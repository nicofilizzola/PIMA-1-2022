import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventListComponent } from './components/add-event-list/add-event-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';


const routes: Routes = [
  { path: 'evenements', component: AddEventListComponent},
  { path: 'statistiques', component: PieChartComponent },
  { path: '', component: CalendarComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
