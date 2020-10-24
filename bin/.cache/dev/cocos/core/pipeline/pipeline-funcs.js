(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.pipelineFuncs = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SRGBToLinear = SRGBToLinear;
  _exports.LinearToSRGB = LinearToSRGB;

  /**
   * @category pipeline
   */

  /**
   * @en Convert color in SRGB space to linear space
   * @zh SRGB 颜色空间转换为线性空间。
   * @param out Output color object
   * @param gamma Gamma value in SRGB space
   */
  function SRGBToLinear(out, gamma) {
    // out.x = Math.pow(gamma.x, 2.2);
    // out.y = Math.pow(gamma.y, 2.2);
    // out.z = Math.pow(gamma.z, 2.2);
    out.x = gamma.x * gamma.x;
    out.y = gamma.y * gamma.y;
    out.z = gamma.z * gamma.z;
  }
  /**
   * @en Convert color in linear space to SRGB space
   * @zh 线性空间转换为 SRGB 颜色空间。
   * @param out Output color object
   * @param linear Color value in linear space
   */


  function LinearToSRGB(out, linear) {
    // out.x = Math.pow(linear.x, 0.454545);
    // out.y = Math.pow(linear.y, 0.454545);
    // out.z = Math.pow(linear.z, 0.454545);
    out.x = Math.sqrt(linear.x);
    out.y = Math.sqrt(linear.y);
    out.z = Math.sqrt(linear.z);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcGlwZWxpbmUtZnVuY3MudHMiXSwibmFtZXMiOlsiU1JHQlRvTGluZWFyIiwib3V0IiwiZ2FtbWEiLCJ4IiwieSIsInoiLCJMaW5lYXJUb1NSR0IiLCJsaW5lYXIiLCJNYXRoIiwic3FydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFNQTs7Ozs7O0FBTU8sV0FBU0EsWUFBVCxDQUF1QkMsR0FBdkIsRUFBdUNDLEtBQXZDLEVBQXlEO0FBQzVEO0FBQ0E7QUFDQTtBQUNBRCxJQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUUQsS0FBSyxDQUFDQyxDQUFOLEdBQVVELEtBQUssQ0FBQ0MsQ0FBeEI7QUFDQUYsSUFBQUEsR0FBRyxDQUFDRyxDQUFKLEdBQVFGLEtBQUssQ0FBQ0UsQ0FBTixHQUFVRixLQUFLLENBQUNFLENBQXhCO0FBQ0FILElBQUFBLEdBQUcsQ0FBQ0ksQ0FBSixHQUFRSCxLQUFLLENBQUNHLENBQU4sR0FBVUgsS0FBSyxDQUFDRyxDQUF4QjtBQUNIO0FBRUQ7Ozs7Ozs7O0FBTU8sV0FBU0MsWUFBVCxDQUF1QkwsR0FBdkIsRUFBdUNNLE1BQXZDLEVBQTBEO0FBQzdEO0FBQ0E7QUFDQTtBQUNBTixJQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUUssSUFBSSxDQUFDQyxJQUFMLENBQVVGLE1BQU0sQ0FBQ0osQ0FBakIsQ0FBUjtBQUNBRixJQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUUksSUFBSSxDQUFDQyxJQUFMLENBQVVGLE1BQU0sQ0FBQ0gsQ0FBakIsQ0FBUjtBQUNBSCxJQUFBQSxHQUFHLENBQUNJLENBQUosR0FBUUcsSUFBSSxDQUFDQyxJQUFMLENBQVVGLE1BQU0sQ0FBQ0YsQ0FBakIsQ0FBUjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaXBlbGluZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IElWZWM0TGlrZSB9IGZyb20gJy4uL21hdGgnO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBDb252ZXJ0IGNvbG9yIGluIFNSR0Igc3BhY2UgdG8gbGluZWFyIHNwYWNlXHJcbiAqIEB6aCBTUkdCIOminOiJsuepuumXtOi9rOaNouS4uue6v+aAp+epuumXtOOAglxyXG4gKiBAcGFyYW0gb3V0IE91dHB1dCBjb2xvciBvYmplY3RcclxuICogQHBhcmFtIGdhbW1hIEdhbW1hIHZhbHVlIGluIFNSR0Igc3BhY2VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBTUkdCVG9MaW5lYXIgKG91dDogSVZlYzRMaWtlLCBnYW1tYTogSVZlYzRMaWtlKSB7XHJcbiAgICAvLyBvdXQueCA9IE1hdGgucG93KGdhbW1hLngsIDIuMik7XHJcbiAgICAvLyBvdXQueSA9IE1hdGgucG93KGdhbW1hLnksIDIuMik7XHJcbiAgICAvLyBvdXQueiA9IE1hdGgucG93KGdhbW1hLnosIDIuMik7XHJcbiAgICBvdXQueCA9IGdhbW1hLnggKiBnYW1tYS54O1xyXG4gICAgb3V0LnkgPSBnYW1tYS55ICogZ2FtbWEueTtcclxuICAgIG91dC56ID0gZ2FtbWEueiAqIGdhbW1hLno7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gQ29udmVydCBjb2xvciBpbiBsaW5lYXIgc3BhY2UgdG8gU1JHQiBzcGFjZVxyXG4gKiBAemgg57q/5oCn56m66Ze06L2s5o2i5Li6IFNSR0Ig6aKc6Imy56m66Ze044CCXHJcbiAqIEBwYXJhbSBvdXQgT3V0cHV0IGNvbG9yIG9iamVjdFxyXG4gKiBAcGFyYW0gbGluZWFyIENvbG9yIHZhbHVlIGluIGxpbmVhciBzcGFjZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmVhclRvU1JHQiAob3V0OiBJVmVjNExpa2UsIGxpbmVhcjogSVZlYzRMaWtlKSB7XHJcbiAgICAvLyBvdXQueCA9IE1hdGgucG93KGxpbmVhci54LCAwLjQ1NDU0NSk7XHJcbiAgICAvLyBvdXQueSA9IE1hdGgucG93KGxpbmVhci55LCAwLjQ1NDU0NSk7XHJcbiAgICAvLyBvdXQueiA9IE1hdGgucG93KGxpbmVhci56LCAwLjQ1NDU0NSk7XHJcbiAgICBvdXQueCA9IE1hdGguc3FydChsaW5lYXIueCk7XHJcbiAgICBvdXQueSA9IE1hdGguc3FydChsaW5lYXIueSk7XHJcbiAgICBvdXQueiA9IE1hdGguc3FydChsaW5lYXIueik7XHJcbn1cclxuIl19