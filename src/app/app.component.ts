import { Component, OnInit } from '@angular/core';
import { GapiService } from './shared/services/gapi-service/gapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private readonly _gapiService: GapiService) {}

  ngOnInit(): void {
    this._gapiService.authenticatedUserEmail.subscribe((authenticatedUserEmail: string) => {
      if (authenticatedUserEmail === null) { window.location.reload() }
    })
  }

  onLogout(){
    this._gapiService.logOut()
  }

}
