import { Component, OnInit } from '@angular/core';
import { PercentageService } from '../shared/services/percentage.service';
import { Event } from '../models/event.model';
import {calendarListEvents} from '../../fixtures/fixtures';

@Component({
  selector: 'app-test-percentage',
  templateUrl: './test-percentage.component.html',
  styleUrls: ['./test-percentage.component.scss']
})
export class TestPercentageComponent implements OnInit {

  public calendarListEvents = calendarListEvents; 

  constructor(private _percentageService: PercentageService){}

  ngOnInit(): void {
    
  }

  public test(calendar : Event[]){
    console.log(this._percentageService.getCalendarPercentage(calendar));
  }

}
