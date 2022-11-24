import { Injectable } from '@angular/core';
import { GcalHttpService } from '../gcal/gcal-http/gcal-http.service';
import { GcalStorageService } from '../gcal/gcal-storage/gcal-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarGeneratorService {



  constructor(private readonly _gcalStorageService : GcalStorageService,
    private _httpService : GcalHttpService) { }



}
