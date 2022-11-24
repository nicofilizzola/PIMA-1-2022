import { Injectable } from '@angular/core';
import { GcalHttpService } from '../gcal/gcal-http/gcal-http.service';
import { GcalStorageService } from '../gcal/gcal-storage/gcal-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarGeneratorService {



  constructor(private readonly _gcalStorageService : GcalStorageService,
    private _httpService : GcalHttpService) { }

    //Recuperer une liste de constraint event, 
    //La parcourir 
      //Pour chaque elt, on regarde sa durée, on cherche le premier slot dans le availableTimeSlots
      //Dès qu'on la, on crée un event, à partir de tout ça
      //On l'envoie dans le cal
      //On met a jour les time slots 
      //Puis on reboucle 

    //On met a jour le storage. 

}
