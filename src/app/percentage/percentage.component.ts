import { Component, OnInit, OnDestroy } from '@angular/core';
import { Calendar } from '../models/calendar.model';
import { Event } from '../models/event.model';


@Component({
  selector: 'app-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.scss']
})
export class PercentageComponent implements OnInit, OnDestroy {

  calendarListTotal : number;
  calendarList : Event[][];

  constructor() {
    this._setTotalTime(this.calendarList);
  }

  ngOnInit(): void {
  }

  // Fonction qui prend un calendrier et retourne le pourcentage que prend ce calendrier parmis tous les autres
  public _getCalendarPercentage(eventList: Event[]) {
    var calendarTotal = 0;

    // Boucle for each pour chaque event dans le calendrier
    for (let event of eventList) {
      if (event === undefined) {
        continue;
      }
      // On convertit le début et la fin de l'event pour pouvoir calculer la différence des deux 
      // Ca nous permet d'obtenir la durée
      var eventDateStart = this.convertToLocalDate(event.start.dateTime);
      var eventDateEnd = this.convertToLocalDate(event.end.dateTime);
      var eventTime = eventDateStart.getTime() - eventDateEnd.getTime();
      // On additionne le temps de chaque event pour obtenir à la fin le temps total de tous les events du calendrier
      calendarTotal += eventTime;
    }
    // On retourne le pourcentage que le calendrier prend parmis tout les autre calendriers
    return (calendarTotal / this.calendarListTotal) * 100;
  }

  // Fonction qui retourne le temps total occupé par tout les calendriers (nécessaire pour la fonction _getCalendarPercentage )
  public _setTotalTime(calendarList : Event[][]){
    var calendarTotal = 0;

    for(let eventList of calendarList ){
      // On calcule le temps de chaque calendrier
      for (let event of eventList) {
        if (event === undefined) {
          continue;
        }
        // On convertit le début et la fin de l'event pour pouvoir calculer la différence des deux 
        // Ca nous permet d'obtenir la durée
        var eventDateStart = this.convertToLocalDate(event.start.dateTime);
        var eventDateEnd = this.convertToLocalDate(event.end.dateTime);
        var eventTime = eventDateStart.getTime() - eventDateEnd.getTime();
        // On additionne le temps de chaque event pour obtenir à la fin le temps total de tous les events du calendrier
        calendarTotal += eventTime;
      }
    }
  }

  
// https://stackoverflow.com/questions/43202250/how-to-convert-string-to-date-in-angular2-typescript

  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
}



// Convert date to user timezone

convertToLocalDate(responseDate: any) {
    try {
        if (responseDate != null) {
            if (typeof (responseDate) === 'string') {
                if (String(responseDate.indexOf('T') >= 0)) {
                    responseDate = responseDate.split('T')[0];
                }
                if (String(responseDate.indexOf('+') >= 0)) {
                    responseDate = responseDate.split('+')[0];
                }
            }

            responseDate = new Date(responseDate);
            const newDate = new Date(responseDate.getFullYear(), responseDate.getMonth(), responseDate.getDate(), 0, 0, 0);
            const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;

            const finalDate: Date = new Date(newDate.getTime() - userTimezoneOffset);
            return finalDate > Util.minDateValue ? finalDate : null;
        } else {
            return null;
        }
    } catch (error) {
        return responseDate;
    }
}

  ngOnDestroy(): void{

  }

}
