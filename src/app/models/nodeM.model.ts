export class Period {
    start: Date;
    end: Date;
  
    constructor(start: Date, end: Date) {
      this.start = start;
      this.end = end;
    }
  
    getStart(): Date {
      return this.start;
    }
  
    getEnd(): Date {
      return this.end;
    }
  
    setStart(newStart: Date) {
      this.start = newStart;
    }
  
    setEnd(newEnd: Date) {
      this.end = newEnd;
    }
  }
  
  export class NodeM {
    period: Period;
    lNode: NodeM;
    rNode: NodeM;
  
    constructor(period: Period) {
      this.period = period;
    }
  
    removePeriod(period : Period){
        this.removePeriodDate(period[0],period[1]);
    }

    removePeriodDate(start: Date, end: Date) {
      if (this.lNode == undefined) {
        //End Node Case
  
        if (start < this.period.getStart()) {
          //Not Inside
          if (end < this.period.getEnd()) {
            return;
          }
  
          //Overlap on the begining
          else {
            this.period.setStart(end);
            return;
          }
        }
  
        if (start > this.period.getEnd()) {
          return;
        }
  
        //Overlap on the end
        if (end > this.period.getEnd()) {
          this.period.setEnd(start);
          return;
        }
  
        //Lase Case, inseting in the middle, we have to make it an end node.
        //Now this node is no longer an end node
  
        this.lNode = new NodeM(new Period(this.period.getStart(), start));
        this.rNode = new NodeM(new Period(end, this.period.getEnd()));
  
        return;
      }
  
      //Not End Node Case
      if (
        !(start > this.lNode.period.getEnd()) &&
        !(end < this.lNode.period.getStart())
      ) {
        this.lNode.removePeriodDate(start, end);
      }
  
      if (
        !(start > this.rNode.period.getEnd()) &&
        !(end < this.rNode.period.getStart())
      ) {
        this.rNode.removePeriodDate(start, end);
      }
    }
  
    getListPeriod(): Period[] {
      if (this.lNode == undefined) {
        return [this.period];
      }
      return [...this.lNode.getListPeriod(), ...this.rNode.getListPeriod()];
    }
  }
  