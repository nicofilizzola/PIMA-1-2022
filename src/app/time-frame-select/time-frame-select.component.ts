import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-frame-select',
  templateUrl: './time-frame-select.component.html',
  styleUrls: ['./time-frame-select.component.scss']
})
export class TimeFrameSelectComponent implements OnInit {
  customPeriodSelected = false;
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
      alert("Saisie de dates impossibles. Le début doit etre avant la fin.");
    }
    if (this.startDate == this.endDate && this.endTime < this.startTime ) {
      alert("Saisie de temps impossibles. Le début doit etre avant la fin.");
    } else {
      alert("Saisie validée");
    }

  }
}
