import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { GcalRequestHandlerService } from 'src/app/shared/services/gcal/gcal-request-handler/gcal-request-handler.service';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { GapiService } from '../../shared/services/gapi/gapi.service';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.scss'],
})
export class RefreshButtonComponent {
  constructor(
    private _gcalStorageService: GcalStorageService,
    private _gcalRequestHandlerService: GcalRequestHandlerService
  ) {}

  private text = {
    spinning: 'Réchargement en cours',
    inert: 'Recharger les données',
    finished: 'Données rechargées',
  };

  inert = true;
  spinning = false;
  finished = false;
  activeText = this.text.inert;

  onClick() {
    this.inert = false;
    this.spinning = true;
    this.activeText = this.text.spinning;

    this._gcalRequestHandlerService.fetchData();

    this._gcalStorageService.dataFetched$.pipe(first()).subscribe(() => {
      this.spinning = false;
      this.finished = true;
      this.activeText = this.text.finished;

      setTimeout(() => {
        this.finished = false;
        this.inert = true;
        this.activeText = this.text.inert;
      }, 2000);
    });

    // let refreshButton = document.getElementById('refresh');
    // refreshButton.className =  "fa-solid fa-sync fa-spin";
    // let texte = document.getElementById('refreshText');
    // texte.innerHTML = "Chargement des donneés en cours";
    // if (this._gapiService.getAuthenticatedUserEmail()) {
    //   this._gcalRequestHandlerService.fetchData();
    // }
    // setTimeout(() => refreshButton.className = "fa fa-refresh", 2000);
    // setTimeout(() =>texte.innerText = "Recharger les données", 2000);
  }
}
