import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { AvailableTimeSlot } from 'src/app/models/period-tree/available-time-slot.model';
import { Period } from 'src/app/models/period-tree/period-tree.model';
import { GcalHttpService } from '../gcal/gcal-http/gcal-http.service';
import { GcalStorageService } from '../gcal/gcal-storage/gcal-storage.service';
import { EventConstraints } from '../../../models/event-constraints.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarGeneratorService {
  constructor(
    private readonly _gcalStorageService: GcalStorageService,
    private _httpService: GcalHttpService
  ) {}

  //Recuperer la liste des events.
  //Recuperer une liste de constraint event,
  //Créer l'available time slot.
  //La parcourir
  //Pour chaque elt, on regarde sa durée, on cherche le premier slot dans le availableTimeSlots
  //Dès qu'on la, on crée un event, à partir de tout ça
  //On l'envoie dans le cal
  //On met a jour les time slots
  //Puis on reboucle

  //On met a jour le storage.

  generate(
    constraintEvents: EventConstraints[],
    period: Period,
    infBound: Time,
    supBound: Time
  ) {
    let existingEvents = this.unbindExistingEventList(period);
    let availableTimeSlots = new AvailableTimeSlot(
      existingEvents,
      period,
      infBound,
      supBound
    );

    let placedEventConstraints = this.getPlacedEvents(constraintEvents);
    for (var event of placedEventConstraints){
      this.addPlacedEventConstraints(event,availableTimeSlots);
    }

    let unPlacedEventConstraints = this.getUnPlacedEvents(constraintEvents);
    for (var event of unPlacedEventConstraints){
      this.addUnPlacedEventConstraints(event,availableTimeSlots);
    }
  }

  unbindExistingEventList(period) {
    let list = [];
    let bindedEvents = this._gcalStorageService.getAllEventList(
      period.getStart().getTime(),
      period.getEnd().getTime()
    );
    for (var calendar of this._gcalStorageService.getCalendarList()) {
      let calendarId = calendar.id;
      list = [...list, ...bindedEvents[calendarId]];
    }
    return list;
  }

  getPlacedEvents(constraintEvents : EventConstraints[]){
    let ret = [];
    for (var constraintEvent of constraintEvents){
      if (constraintEvent.fixedEvent){
        ret.push(constraintEvent);
      }
    }
    return ret; 
  }

  getUnPlacedEvents(constraintEvents : EventConstraints[]){
    let ret = [];
    for (var constraintEvent of constraintEvents){
      if (!constraintEvent.fixedEvent){
        ret.push(constraintEvent);
      }
    }
    return ret; 
  }

  addPlacedEventConstraints(
    constraintEvent: EventConstraints,
    availableTimeSlots: AvailableTimeSlot
  ) {
    let event = constraintEvent.toEvent(new Date());
    let calendarId = constraintEvent.calendarId
    this._httpService.insertEvent(event,calendarId);
    availableTimeSlots.removeEvent(event);
  }

  addUnPlacedEventConstraints(
    constraintEvent: EventConstraints,
    availableTimeSlots: AvailableTimeSlot
  ) {
    let availableTimeSlotsList = availableTimeSlots.getListTimeSlots();
    let eventDuration = constraintEvent.getDurationMs();
    for (let period of availableTimeSlotsList) {
      console.log(availableTimeSlotsList);
      if (
        eventDuration <
        period.getEnd().getTime() - period.getStart().getTime()
      ) {
        let start = new Date(period.getStart());
        let event = constraintEvent.toEvent(start);
        let calendarId = constraintEvent.calendarId;
        availableTimeSlots.removeEvent(event);
        this._httpService.insertEvent(event, calendarId);
        return;
      }
    }
  }
}
