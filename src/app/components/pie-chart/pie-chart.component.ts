import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GcalStorageService } from '../../shared/services/gcal/gcal-storage/gcal-storage.service';
import { Subscription } from 'rxjs';
import { GcalEventList, GcalEventListEntry } from '../../models/event.model';
import { PercentageService } from 'src/app/shared/services/percentage/percentage.service';
import { GcalCalendarList } from 'src/app/models/calendar-list.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, OnDestroy {
  private _dataFetchSubscription: Subscription;
  private fetchedCalendarList: GcalCalendarList;

  fetchedEvents: GcalEventList;
  pieChartDatasets = [{ data: [], backgroundColor: [] }];
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
        this.fetchedCalendarList = this._gcalStorageService.getCalendarList();

        this._cleanDatasets();
        this._populateDatasets();

        this.chart.update();
      });
  }

  private _cleanDatasets() {
    this.pieChartDatasets[0].data = [];
    this.pieChartDatasets[0].backgroundColor = [];
    this.pieChartLabels = [];
  }

  /**
   * @see this.setup
   */
  private _populateDatasets() {
    Object.entries(this.fetchedEvents).forEach(
      (eventListEntry: GcalEventListEntry) => {
        this.pieChartDatasets[0].data.push(eventListEntry[1].length);
        this.pieChartLabels.push(
          this._gcalStorageService.getCalendarSummary(eventListEntry[0])
        );
        this.pieChartDatasets[0].backgroundColor.push(
          this._getBackgroundColor(eventListEntry[0])
        );
      }
    );
  }

  private _getBackgroundColor(calendarId: string) {
    return this.fetchedCalendarList.find(
      (calendar) => calendar.id == calendarId
    ).backgroundColor;
  }

  ngOnDestroy(): void {
    this._dataFetchSubscription.unsubscribe();
  }
}
