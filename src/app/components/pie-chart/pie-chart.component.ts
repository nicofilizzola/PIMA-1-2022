import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { pairwise } from 'rxjs';
import { calendarListEvents } from 'src/fixtures/fixtures';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  pieChartDatasets = [{ data: [] }]
  pieChartLabels = [] 
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  dateInf = Date.now()
  dateSup = Date.now()
  
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor() {}

  ngOnInit(): void {
    this.setupChart();
  }

  public setDateInf(dateInf) {
    this.dateInf = dateInf;
  }

  public setDateSup(dateSup) {
    this.dateSup = dateSup;
  }

  setupChart() {

    for (const fields of Object.entries(calendarListEvents)) {

      var calendarName = fields[0]
      var calendarContent = fields[1]

      if ('items' in calendarContent) {
        this.pieChartDatasets[0].data.push(calendarContent.items.length) //TODO : Implementation de la gestion du temps
        this.pieChartLabels.push(calendarName)
      }
    }
  }

}

