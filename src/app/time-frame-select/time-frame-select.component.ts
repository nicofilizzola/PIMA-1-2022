import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-frame-select',
  templateUrl: './time-frame-select.component.html',
  styleUrls: ['./time-frame-select.component.scss']
})
export class TimeFrameSelectComponent implements OnInit {
  customPeriodSelected = false;
  errorMessageOn = false;
  startDate = "2001-01-01";
  startTime = "00:00";
  endDate = "2001-01-01";
  endTime = "00:00";

  constructor() { }
  
  ngOnInit(): void {
  }

  onSelectCustomPeriod(customPeriodSelected: boolean) {
    this.customPeriodSelected = customPeriodSelected;
  }

  selectCustomCheck(value: string) {
    if (value == "customPeriod") {
      this.customPeriodSelected = true;
    }
    else {
      this.customPeriodSelected = false;
    }
  }

  verifyCustomPeriodSelection() {
    if (this.startDate > this.endDate) {
      this.errorMessageOn = true;
    }
    if (this.startDate == this.endDate && this.endTime < this.startTime ) {
      this.errorMessageOn = true;
    }
    if (this.startDate < this.endDate) {
      this.errorMessageOn = false;
    }
    if (this.startDate == this.endDate && this.endTime > this.startTime ) {
      this.errorMessageOn = false;
    }
  }
}
