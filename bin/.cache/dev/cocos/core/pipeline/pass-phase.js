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
    global.passPhase = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getPhaseID = void 0;

  /**
   * @hidden
   */
  var getPhaseID = function () {
    var phases = new Map();
    var phaseNum = 0;
    return function (phaseName) {
      if (typeof phaseName === 'number') {
        return phaseName;
      }

      if (!phases.has(phaseName)) {
        phases.set(phaseName, 1 << phaseNum);
        phaseNum++;
      }

      return phases.get(phaseName);
    };
  }();

  _exports.getPhaseID = getPhaseID;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcGFzcy1waGFzZS50cyJdLCJuYW1lcyI6WyJnZXRQaGFzZUlEIiwicGhhc2VzIiwiTWFwIiwicGhhc2VOdW0iLCJwaGFzZU5hbWUiLCJoYXMiLCJzZXQiLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7OztBQUlPLE1BQU1BLFVBQVUsR0FBSSxZQUFNO0FBQzdCLFFBQU1DLE1BQTJCLEdBQUcsSUFBSUMsR0FBSixFQUFwQztBQUNBLFFBQUlDLFFBQVEsR0FBRyxDQUFmO0FBQ0EsV0FBTyxVQUFDQyxTQUFELEVBQWdDO0FBQ25DLFVBQUksT0FBT0EsU0FBUCxLQUFxQixRQUF6QixFQUFtQztBQUFFLGVBQU9BLFNBQVA7QUFBbUI7O0FBQ3hELFVBQUksQ0FBQ0gsTUFBTSxDQUFDSSxHQUFQLENBQVdELFNBQVgsQ0FBTCxFQUE0QjtBQUN4QkgsUUFBQUEsTUFBTSxDQUFDSyxHQUFQLENBQVdGLFNBQVgsRUFBc0IsS0FBS0QsUUFBM0I7QUFDQUEsUUFBQUEsUUFBUTtBQUNYOztBQUNELGFBQU9GLE1BQU0sQ0FBQ00sR0FBUCxDQUFXSCxTQUFYLENBQVA7QUFDSCxLQVBEO0FBUUgsR0FYeUIsRUFBbkIiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UGhhc2VJRCA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBwaGFzZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xyXG4gICAgbGV0IHBoYXNlTnVtID0gMDtcclxuICAgIHJldHVybiAocGhhc2VOYW1lOiBzdHJpbmcgfCBudW1iZXIpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHBoYXNlTmFtZSA9PT0gJ251bWJlcicpIHsgcmV0dXJuIHBoYXNlTmFtZTsgfVxyXG4gICAgICAgIGlmICghcGhhc2VzLmhhcyhwaGFzZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIHBoYXNlcy5zZXQocGhhc2VOYW1lLCAxIDw8IHBoYXNlTnVtKTtcclxuICAgICAgICAgICAgcGhhc2VOdW0rKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBoYXNlcy5nZXQocGhhc2VOYW1lKSE7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4iXX0=