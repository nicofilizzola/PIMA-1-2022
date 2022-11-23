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
    this.start = new Date(newStart);
  }

  setEnd(newEnd: Date) {
    this.end = new Date(newEnd);
  }
}

export class NodeM {
  period: Period;
  lNode: NodeM;
  rNode: NodeM;

  constructor(period: Period) {
    this.period = period;
    this.lNode = null;
    this.rNode = null;
  }

  removePeriod(period: Period) {
    this.removePeriodDate(
      new Date(period.getStart()),
      new Date(period.getEnd())
    );
  }

  removePeriodDate(start: Date, end: Date) {
    if (this.lNode == null) {
      if (start < this.period.getStart()) {
        if (end < this.period.getEnd()) {
          return;
        }

        this.period.setStart(new Date(end));
        return;
      }

      if (start > this.period.getEnd()) {
        return;
      }

      if (end > this.period.getEnd()) {
        this.period.setEnd(new Date(start));
        return;
      }

      this.lNode = new NodeM(
        new Period(new Date(this.period.getStart()), new Date(start))
      );
      this.rNode = new NodeM(
        new Period(new Date(end), new Date(this.period.getEnd()))
      );

      return;
    }

    if (
      start < this.lNode.period.getEnd() &&
      end > this.lNode.period.getStart()
    ) {
      this.lNode.removePeriodDate(new Date(start), new Date(end));
    } else {
      this.rNode.removePeriodDate(new Date(start), new Date(end));
    }
  }

  getListPeriod(): Period[] {
    if (this.lNode == undefined) {
      return [this.period];
    }
    return [...this.lNode.getListPeriod(), ...this.rNode.getListPeriod()];
  }
}
