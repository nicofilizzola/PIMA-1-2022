import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, Subscription } from 'rxjs';
import { GcalRequestHandlerService } from 'src/app/shared/services/gcal/gcal-request-handler/gcal-request-handler.service';
import { GcalStorageService } from 'src/app/shared/services/gcal/gcal-storage/gcal-storage.service';
import { GapiService } from '../../shared/services/gapi/gapi.service';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.scss'],
})
export class RefreshButtonComponent implements OnDestroy {
  constructor(
    private _gcalStorageService: GcalStorageService,
    private _gcalRequestHandlerService: GcalRequestHandlerService
  ) {}

  private subscriptions: Subscription[] = [];

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

    this.subscriptions.push(
      this._gcalStorageService.dataFetched$.subscribe(() => {
        this.spinning = false;
        this.finished = true;
        this.activeText = this.text.finished;

        setTimeout(() => {
          this.finished = false;
          this.inert = true;
          this.activeText = this.text.inert;
        }, 2000);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
