import { Component, OnInit } from '@angular/core';
import { GapiService } from '../../shared/services/gapi/gapi.service';
import { GcalHttpService } from '../../shared/services/gcal/gcal-http/gcal-http.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isMenuCollapsed = true;
  constructor(
    private readonly _gapiService: GapiService,
    private readonly _gcalHttpService: GcalHttpService,

  ) {}

  ngOnInit(): void {
  }

  onLogout() {
    this._gapiService.logOut();
  }

  /**
   * onRefresh fetches data from Google Calendar's API. This function is called whenever the user changes page
   * or if he activates the refresh button.
   */
  onRefresh () {
    if (this._gapiService.getAuthenticatedUserEmail()) {
      this._gcalHttpService.fetchData();
    }
  }

}
