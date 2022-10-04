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

  pieChartDatasets;
  pieChartLabels;
  dateInf;
  dateSup;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  

  constructor() {

  }

  ngOnInit(): void {
    console.log(this.chart)
    //Initialisation des bornes

    this.dateInf = Date.now()
    this.dateSup = Date.now()



    //DataSet Creation

    this.createChart();
    console.log(this.pieChartDatasets)
    console.log(this.pieChartLabels)
    console.log(this.chart)
    this.chart?.update()
    console.log(this.chart)
  }

  /*   Setters     */

  public setDateInf(dateInf) {
    this.dateInf = dateInf;
  }

  public setDateSup(dateSup) {
    this.dateSup = dateSup;
  }


  createChart() {


    this.pieChartDatasets = [{ data: [] }]
    this.pieChartLabels = []

    //Accès rapide au data 

    for (const fields of Object.entries(calendarListEvents)) {

      var calendarName = fields[0]
      var fieldContent = fields[1]

      var totalDuration = 0

      if ('items' in fieldContent) {
        totalDuration = + fieldContent.items.length
        this.pieChartLabels.push(calendarName)
      }
      this.pieChartDatasets[0].data.push(totalDuration)
    }
  }

  onAction() {
    this.chart?.update()
    console.log(this.chart)
  }

}

