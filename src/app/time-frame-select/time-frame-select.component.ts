import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-frame-select',
  templateUrl: './time-frame-select.component.html',
  styleUrls: ['./time-frame-select.component.scss'],
})
export class TimeFrameSelectComponent implements OnInit {
  customPeriodSelected = false;
  errorMessageOn = false;
  startDate: string;
  endDate: string;
  startTime = '00:00';
  endTime = '00:00';

  constructor() {
    this._setStartDayToTomorrow()
    this._setEndDayOneWeekFromTomorrow()
  }

  ngOnInit(): void {}

  onSelectCustomPeriod(customPeriodSelected: boolean) {
    this.customPeriodSelected = customPeriodSelected;
  }

  onSelectCustomCheck(value: string) {
    if (value == 'customPeriod') {
      this.customPeriodSelected = true;
    } else {
      this.customPeriodSelected = false;
    }
  }

  onVerifyCustomPeriodSelection() {
    if (this.startDate > this.endDate) {
      this.errorMessageOn = true;
    }
    if (this.startDate == this.endDate && this.endTime < this.startTime) {
      this.errorMessageOn = true;
    }
    if (this.startDate < this.endDate) {
      this.errorMessageOn = false;
    }
    if (this.startDate == this.endDate && this.endTime > this.startTime) {
      this.errorMessageOn = false;
    }
  }

  private _setStartDayToTomorrow() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yyyy = tomorrow.getFullYear();
    let mm = (tomorrow.getMonth() + 1).toString();
    let dd = tomorrow.getDate().toString();

    if (parseInt(dd) < 10) dd = '0' + dd;
    if (parseInt(mm) < 10) mm = '0' + mm;

    this.startDate = yyyy + '-' + mm + '-' + dd;
  }

  private _setEndDayOneWeekFromTomorrow() {
    const today = new Date()
    const oneWeekFromTomorrow = new Date(today)
    oneWeekFromTomorrow.setDate(oneWeekFromTomorrow.getDate() + 8)
    const yyyy = oneWeekFromTomorrow.getFullYear();
    let mm = (oneWeekFromTomorrow.getMonth() + 1).toString();
    let dd = oneWeekFromTomorrow.getDate().toString();

    if (parseInt(dd) < 10) dd = '0' + dd;
    if (parseInt(mm) < 10) mm = '0' + mm;

    this.endDate = yyyy + '-' + mm + '-' + dd;
  }
}
