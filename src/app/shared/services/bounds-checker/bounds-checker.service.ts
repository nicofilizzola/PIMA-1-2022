import { Injectable } from '@angular/core';
import { parse } from '@fortawesome/fontawesome-svg-core';

/**
 * @brief Provides methods to compare date/time-related data
 */
@Injectable({
  providedIn: 'root',
})
export class BoundsCheckerService {
  constructor() {}

  /**
   * @note both params **inLower** and **inHigher** must contain time in **hh:mm** format
   * @returns **true** if bounds OK, **false** else
   */
  checkTimeBounds(inLower: string, inHigher: string): boolean {
    const FORMAT_SEPARATOR = ':';

    if (
      !inLower.includes(FORMAT_SEPARATOR) ||
      !inHigher.includes(FORMAT_SEPARATOR)
    ) {
      console.error("Parameters don't have correct format (hh:mm)");
      return false;
    }

    let lower = {
      hour: parseInt(inLower.split(FORMAT_SEPARATOR)[0]),
      mins: parseInt(inLower.split(FORMAT_SEPARATOR)[1]),
    };
    let higher = {
      hour: parseInt(inHigher.split(FORMAT_SEPARATOR)[0]),
      mins: parseInt(inHigher.split(FORMAT_SEPARATOR)[1]),
    };

    if (
      lower.hour > higher.hour ||
      (lower.hour == higher.hour && lower.mins <= higher.mins)
    ) {
      return false;
    }
    return true;
  }

  /**
   * @note both params **inLower** and **inHigher** must contain date in **yyyy-mm-dd** format
   * @returns **true** if bounds OK, **false** else
   */
  checkDateBounds(inLower: string, inHigher: string): boolean {
    const FORMAT_SEPARATOR = '-';
    const lower = {
      yyyy: inLower.split(FORMAT_SEPARATOR)[0],
      mm: inLower.split(FORMAT_SEPARATOR)[1],
      dd: inLower.split(FORMAT_SEPARATOR)[2],
    };
    const higher = {
      yyyy: inHigher.split(FORMAT_SEPARATOR)[0],
      mm: inHigher.split(FORMAT_SEPARATOR)[1],
      dd: inHigher.split(FORMAT_SEPARATOR)[2],
    };

    if (
      inLower.split(FORMAT_SEPARATOR).length < 3 ||
      inHigher.split(FORMAT_SEPARATOR).length < 3 ||
      lower.dd.length !== 2 ||
      lower.mm.length !== 2 ||
      lower.yyyy.length !== 4 ||
      higher.dd.length !== 2 ||
      higher.mm.length !== 2 ||
      higher.yyyy.length !== 4
    ) {
      console.error("Parameters don't have correct format (yyyy-mm-dd)");
      return false;
    }

    if (parseInt(lower.yyyy) > parseInt(higher.yyyy)) {
      return false;
    }
    if (
      lower.yyyy === higher.yyyy &&
      parseInt(lower.mm) > parseInt(higher.mm)
    ) {
      return false;
    }
    if (
      lower.yyyy === higher.yyyy &&
      lower.mm === higher.mm &&
      parseInt(lower.dd) > parseInt(higher.dd)
    ) {
      return false;
    }
    return true;
  }
}
