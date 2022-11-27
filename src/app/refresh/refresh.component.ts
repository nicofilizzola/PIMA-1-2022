import { Component, OnInit } from '@angular/core';
import { GcalRequestHandlerService } from 'src/app/shared/services/gcal/gcal-request-handler/gcal-request-handler.service';
import { GapiService } from '../shared/services/gapi/gapi.service';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.scss']
})
export class RefreshComponent implements OnInit {

  constructor(
    private readonly _gapiService: GapiService,
    private readonly _gcalRequestHandlerService: GcalRequestHandlerService
  ) { }

  ngOnInit(): void {
  }

  onRefresh(){
    let refreshButton = document.getElementById('refresh');
    refreshButton.className =  "fa-solid fa-sync fa-spin";
    let texte = document.getElementById('refreshText');
    texte.innerHTML = "Chargement des donneés en cours ...";
    if (this._gapiService.getAuthenticatedUserEmail()) {
      this._gcalRequestHandlerService.fetchData();
    }
    setTimeout(() => refreshButton.className = "fa fa-refresh", 2000);
    setTimeout(() =>texte.innerText = "Recharger les données", 2000);
  }

}
