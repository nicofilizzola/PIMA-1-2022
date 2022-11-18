import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GcalStorageService } from '../../shared/services/gcal/gcal-storage/gcal-storage.service';
import { Subscription } from 'rxjs';
import { GcalEventList, GcalEventListEntry } from '../../models/event.model';
import { PercentageService } from 'src/app/shared/services/percentage/percentage.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, OnDestroy {
  private _dataFetchSubscription: Subscription;

  fetchedEvents: GcalEventList;
  pieChartDatasets = [{ data: [] }];
  pieChartLabels = [];
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  dateInf = Date.now();
  dateSup = Date.now();

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(
    private readonly _gcalStorageService: GcalStorageService,
    private readonly _percentageService: PercentageService
  ) {}

  ngOnInit(): void {
    this._setup();
  }

  public setDateInf(dateInf) {
    this.dateInf = dateInf;
  }

  public setDateSup(dateSup) {
    this.dateSup = dateSup;
  }

  private _setup() {
    this._dataFetchSubscription =
      this._gcalStorageService.dataFetched$.subscribe(() => {
        this.fetchedEvents = this._gcalStorageService.getAllEventList();

        this._cleanDatasets();
        this._populateDatasets();

        this.chart.update();
      });
  }

  private _cleanDatasets() {
    this.pieChartDatasets[0].data = [];
    this.pieChartLabels = []
  }

  /**
   * @see this.setup
   */
  private _populateDatasets() {
    Object.entries(this.fetchedEvents).forEach(
      (eventListEntry: GcalEventListEntry) => {


        this.pieChartDatasets[0].data.push(
          eventListEntry[1].length
        );
        this.pieChartLabels.push(this._gcalStorageService.getCalendarSummary(eventListEntry[0]));
      }
    );
  }

  ngOnDestroy(): void {
    this._dataFetchSubscription.unsubscribe();
  }
}
