import { Time } from '@angular/common';
import { EmptyExpr } from '@angular/compiler';
import { EmptyError } from 'rxjs';
import { GcalEvent, GcalEventList } from './event.model';
const dayInMillis = 24 * 60 * 60 * 1000;
type Node = null | {lNode : Node, period : [Date,Date], rNode : Node}

export class AvailableTimeSlot {

  timeSlotsTree : Node = null; 

  /**
   *
   * @param eventList : list of Event, the one of the calendar generator service
   * @param period : (Date,Date), the Date of Beginning, the Date of Ending
   * @param infTime : Start time of a day
   * @param supTime : End time for a day.
   */

  constructor(
    eventList: GcalEvent[],
    period: [Date, Date],
    infTime: Time,
    supTime: Time
  ) {
    this.timeSlotsTree = {
      lNode : null,
      period : [new Date(period[0]),new Date(period[1])],
      rNode : null
    }
  }

  newNode(left : Node ,period : [Date,Date], right : Node) : Node {
    return {
      lNode : left,
      period : period, 
      rNode : right
    }
  }

  //AVL functions

  /**
   * 
   * @param tree 
   * @raise Empty : if the tree is not deep enough
   * @return a tree with the applied rotation
   * 
   * To understaing the name of the variables https://www.geeksforgeeks.org/insertion-in-an-avl-tree/
   */
  rightRotation(tree : Node){

    if(tree.lNode == null){throw new Error("lNode empty")}

    let y = tree.period;
    let x = tree.lNode.period;
    let T1 = tree.lNode.lNode;
    let T2 = tree.lNode.rNode;
    let T3 = tree.rNode;
    
    return this.newNode(
      T1,
      x,
      this.newNode(T2,y,T3)
    )
  }

  leftRotation(tree : Node){
    if(tree.rNode == null){throw new Error("rNode empty")}

    let x = tree.period;
    let y = tree.rNode.period; 
    let T1 = tree.lNode;
    let T2 = tree.rNode.lNode;
    let T3 = tree.rNode.rNode;

    return  this.newNode(
      this.newNode(T1,x,T3),
      y,
      T3
    )
  }

  getListTimeSlots() {

  }

  removeAllNights(period: [Date, Date], infTime: Time, supTime: Time) {
    let nightStart = new Date();
    let nightEnd = new Date();

    //Usefull Stuff
    let infTimeMillis =
      infTime.hours * 60 * 60 * 1000 + infTime.minutes * 60 * 1000;
    let supTimeMillis =
      supTime.hours * 60 * 60 * 1000 + supTime.minutes * 60 * 1000;
    let nightDurationInMillis = dayInMillis - supTimeMillis + infTimeMillis;

    //Initialising nightStart to the Date of the first night start in the period.
    let actualTimeOfDay = period[0].getTime() % dayInMillis; //Give the time in millisecond of the day ex : if period start at 14h30, it will give 14 * 60 * 60 * 1000 + 30 * 60 * 1000
    if (actualTimeOfDay < infTimeMillis) {
      nightStart.setTime(
        period[0].getTime() + supTimeMillis - actualTimeOfDay - dayInMillis
      ); //Starts a day before
    } else if (actualTimeOfDay < supTimeMillis) {
      nightStart.setTime(period[0].getTime() + supTimeMillis - actualTimeOfDay);
    } else {
      nightStart.setTime(
        period[0].getTime() + supTimeMillis - actualTimeOfDay - dayInMillis
      ); //Starts a day before
    }

    //Loop on all the possible nights.
    while (nightStart.getTime() < period[1].getTime()) {
      //Setting the night end
      nightEnd.setTime(nightStart.getTime() + nightDurationInMillis);
      //Update free periods
      this.updateTimeSlotTime(nightStart, nightEnd);
      //Preparing the next loop
      nightStart.setTime(nightStart.getTime() + dayInMillis); // Next Day
    }
  }
}
