import { Component, OnInit } from '@angular/core';
import { GcalRequestHandlerService } from 'src/app/shared/services/gcal/gcal-request-handler/gcal-request-handler.service';
import { GapiService } from '../../shared/services/gapi/gapi.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isMenuCollapsed = true;
  constructor(
    private readonly _gapiService: GapiService,
    private readonly _gcalRequestHandlerService: GcalRequestHandlerService
  ) {}

  ngOnInit(): void {}

  onLogout() {
    this._gapiService.logOut();
  }

  /**
   * onRefresh fetches data from Google Calendar's API. This function is called whenever the user changes page
   * or if they press the refresh button.
   */
  onRefresh() {
    if (this._gapiService.getAuthenticatedUserEmail()) {
      this._gcalRequestHandlerService.fetchData();
    }
  }
}
