import { Component } from '@angular/core';
import { GapiService } from './shared/services/gapi-service/gapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly _gapiService: GapiService) {}

}
