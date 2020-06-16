import * as numeral from 'numeral';
import { isEmpty } from './utils';

export enum MomentUnit {
  years,
  months,
  days,
  weekdays,
}

export class Moment extends Date {

  constructor(date?: any) {
    let moment = isEmpty(date) ? Date.now() : date;
    switch (moment.constructor) {
      case String: super(moment.replace(/-/g, '\/').replace(/T.+/, '')); break;
      default:
        if (true) {}
        switch (true) {
          default: super(moment);
        }
    }
  }

  static min(a: Moment, b: Moment): Moment {
    return a.time <= b.time ? a : b;
  }

  static max(a: Moment, b: Moment): Moment {
    return a.time >= b.time ? a : b;
  }

  static get zero(): Moment {
    return new Moment(new Date(0, 1, 1));
  }

  static get birthday(): Moment {
    return new Moment().add(-18, MomentUnit.years);
  }

  static get time() {
    return this.now();
  }

  static get today(): Moment {
    let moment = new Moment();
    moment.setHours(0, 0, 0, 0);
    return moment;
  }

  static get tomorrow(): Moment {
    return new Moment().add(1, MomentUnit.days);
  }

  static get nextWeekday(): Moment {
    return new Moment().add(1, MomentUnit.weekdays);
  }

  static weekday(date: Date): boolean {
    return new Moment(date).isWeekday;
  }

  get time() {
    return this.getTime();
  }

  get isWeekday(): boolean {
    return [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ].indexOf(this.day) > -1;
  }

  add(count: number, unit: MomentUnit): Moment {
    let moment = new (this.constructor as any)(this);
    let i = count;

    switch (unit) {
      case MomentUnit.years: moment.setFullYear(moment.getFullYear() + count); break;
      case MomentUnit.months: moment.setMonth(moment.getMonth() + count); break;
      case MomentUnit.days: moment.setDate(moment.getDate() + count); break;

      case MomentUnit.weekdays:
        moment.setDate(moment.getDate() + count);
        if (!moment.isWeekday) {
          moment.add(1, MomentUnit.weekdays);
        }
        break;
    }

    return moment;
  }

  get day(): string {
    return [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][this.getDay()];
  }

  get date(): string {
    return numeral(this.getDate()).format('0o');
  }

  get month(): string {
    return [
      'Janunary',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][this.getMonth()];
  }

  get year(): number {
    return this.getFullYear();
  }

  daysUntil(moment: Moment): number {
    return Math.floor((moment.getTime() - this.getTime()) / 1000 / 60 / 60 / 24);
  }

  get pretty(): string {
    return `${this.month} ${this.getDate()}, ${this.year}`;
  }

  get ugly(): string {
    return [
      this.year,
      `0${this.getMonth() + 1}`.slice(-2),
      `0${this.getDate()}`.slice(-2),
    ].join('-');
  }
}

export class Month extends Moment {
  get pretty(): string {
    return `${this.month} ${this.year}`;
  }

  get ugly(): string {
    return super.ugly.slice(0, 7);
  }
}

export class Year extends Moment {
  get pretty(): string {
    return this.year.toString();
  }

  get ugly(): string {
    return this.year.toString();
  }
}
