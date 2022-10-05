import { Injectable } from '@angular/core';
import { calendarListEvents } from 'src/fixtures/fixtures';
import { Event } from '../../models/event.model';


@Injectable({
  providedIn: 'root'
})
export class PercentageService {

  calendarListTotal : number;
  // calendarList : Event[][];
  calendarList;
  
  

  constructor() {
    this.calendarList = Object.entries(calendarListEvents).map((calendar: Array<any>) => calendar[1])

    //this.calendarList = [...calendarList];
    this._setTotalTime(this.calendarList);
    // this.calendarListTotal = 1104;
  }

  // Fonction qui prend un calendrier et retourne le pourcentage que prend ce calendrier parmis tous les autres
  public getCalendarPercentage(eventList: Event[]) {
    var calendarTotal = 0;
    // Boucle for each pour chaque event dans le calendrier
    for (let event of eventList) {
      // On convertit le début et la fin de l'event pour pouvoir calculer la différence des deux 
      // Ca nous permet d'obtenir la durée
      var eventDateStart = new Date(event.start.dateTime);
      var eventDateEnd = new Date(event.end.dateTime);

      var eventTime = (eventDateEnd.getTime() - eventDateStart.getTime())/60000;
      
      // On additionne le temps de chaque event pour obtenir à la fin le temps total de tous les events du calendrier
      
      calendarTotal += eventTime;
    }
    // On retourne le pourcentage que le calendrier prend parmis tout les autre calendriers
    return (calendarTotal / this.calendarListTotal) * 100;
  }

  // Fonction qui retourne le temps total occupé par tout les calendriers (nécessaire pour la fonction _getCalendarPercentage )
  private _setTotalTime(calendarList){
    var calendarTotal = 0;

    for(let calendar of calendarList){
      // On calcule le temps de chaque calendrier
      for (let event of calendar.items) {
        if (event === undefined || 'dateTime' in event.start === false || 'dateTime' in event.end === false) {
          continue;
        }
        
        // On convertit le début et la fin de l'event pour pouvoir calculer la différence des deux 
        // Ca nous permet d'obtenir la durée
        var eventDateStart = new Date(event.start.dateTime);
        var eventDateEnd = new Date(event.end.dateTime);
        
        //var eventDateStart = this.convertToLocalDate(event.start.dateTime);
        //var eventDateEnd = this.convertToLocalDate(event.end.dateTime);
        var eventTime = (eventDateEnd.getTime() - eventDateStart.getTime())/60000;
        // On additionne le temps de chaque event pour obtenir à la fin le temps total de tous les events du calendrier
        calendarTotal += eventTime;
      }
    }

    this.calendarListTotal = calendarTotal;
    console.log(calendarTotal)
    // this.calendarListTotal = 100;
    
  }
}
