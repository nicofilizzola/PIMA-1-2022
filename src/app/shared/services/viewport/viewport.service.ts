import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  VIEWPORT_SIZES = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  };

  /**
   * @brief Under 576px (smallest viewport_width = 320px)
   */
  XS = 'XS';
  /**
   * @brief Between 576px and 767px
   */
  SM = 'SM';
  /**
   * @brief Between 768px and 991px
   */
  MD = 'MD';
  /**
   * @brief Between 992px and 1999px
   */
  LG = 'LG';
  /**
   * @brief Between 1200px and 1399px
   */
  XL = 'XL';
  /**
   * @brief Above 1400px
   */
  XXL = 'XXL';

  private _getViewportWidth() {
    return Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
  }

  isXs() {
    return this._getViewportWidth() < this.VIEWPORT_SIZES.sm;
  }

  isSm() {
    let vw = this._getViewportWidth();
    return vw >= this.VIEWPORT_SIZES.sm && vw < this.VIEWPORT_SIZES.md;
  }

  isMd() {
    let vw = this._getViewportWidth();
    return vw >= this.VIEWPORT_SIZES.md && vw < this.VIEWPORT_SIZES.lg;
  }

  isLg() {
    let vw = this._getViewportWidth();
    return vw >= this.VIEWPORT_SIZES.lg && vw < this.VIEWPORT_SIZES.xl;
  }

  isXl() {
    let vw = this._getViewportWidth();
    return vw >= this.VIEWPORT_SIZES.xl && vw < this.VIEWPORT_SIZES.xxl;
  }

  isXxl() {
    return this._getViewportWidth() >= this.VIEWPORT_SIZES.xxl;
  }

  getViewportSize(): string {
    if (this.isXs()) return this.XS;
    if (this.isSm()) return this.SM;
    if (this.isMd()) return this.MD;
    if (this.isLg()) return this.LG;
    if (this.isXl()) return this.XL;
    if (this.isXxl()) return this.XXL;
  }
}
