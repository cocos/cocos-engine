(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../../core/index.js", "./cannon-contact-equation.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../../core/index.js"), require("./cannon-contact-equation.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.index, global.cannonContactEquation);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_index, _cannonContactEquation) {
  "use strict";

  (0, _index.replaceProperty)(_cannonContactEquation.CannonContactEquation.prototype, 'IContactEquation.prototype', [{
    'name': 'contactA',
    'newName': 'getLocalPointOnA',
    'customGetter': function customGetter() {
      var out = new _index.Vec3();

      _cannonContactEquation.CannonContactEquation.prototype.getLocalPointOnA.call(this, out);

      return out;
    }
  }, {
    'name': 'contactB',
    'newName': 'getLocalPointOnB',
    'customGetter': function customGetter() {
      var out = new _index.Vec3();

      _cannonContactEquation.CannonContactEquation.prototype.getLocalPointOnB.call(this, out);

      return out;
    }
  }, {
    'name': 'normal',
    'newName': 'getLocalNormalOnB',
    'customGetter': function customGetter() {
      var out = new _index.Vec3();

      _cannonContactEquation.CannonContactEquation.prototype.getLocalNormalOnB.call(this, out);

      return out;
    }
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL2RlcHJlY2F0ZWQudHMiXSwibmFtZXMiOlsiQ2Fubm9uQ29udGFjdEVxdWF0aW9uIiwicHJvdG90eXBlIiwib3V0IiwiVmVjMyIsImdldExvY2FsUG9pbnRPbkEiLCJjYWxsIiwiZ2V0TG9jYWxQb2ludE9uQiIsImdldExvY2FsTm9ybWFsT25CIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSw4QkFBZ0JBLDZDQUFzQkMsU0FBdEMsRUFBaUQsNEJBQWpELEVBQStFLENBQzNFO0FBQ0ksWUFBUSxVQURaO0FBRUksZUFBVyxrQkFGZjtBQUdJLG9CQUFnQix3QkFBdUM7QUFDbkQsVUFBTUMsR0FBRyxHQUFHLElBQUlDLFdBQUosRUFBWjs7QUFDQUgsbURBQXNCQyxTQUF0QixDQUFnQ0csZ0JBQWhDLENBQWlEQyxJQUFqRCxDQUFzRCxJQUF0RCxFQUE0REgsR0FBNUQ7O0FBQ0EsYUFBT0EsR0FBUDtBQUNIO0FBUEwsR0FEMkUsRUFVM0U7QUFDSSxZQUFRLFVBRFo7QUFFSSxlQUFXLGtCQUZmO0FBR0ksb0JBQWdCLHdCQUF1QztBQUNuRCxVQUFNQSxHQUFHLEdBQUcsSUFBSUMsV0FBSixFQUFaOztBQUNBSCxtREFBc0JDLFNBQXRCLENBQWdDSyxnQkFBaEMsQ0FBaURELElBQWpELENBQXNELElBQXRELEVBQTRESCxHQUE1RDs7QUFDQSxhQUFPQSxHQUFQO0FBQ0g7QUFQTCxHQVYyRSxFQW1CM0U7QUFDSSxZQUFRLFFBRFo7QUFFSSxlQUFXLG1CQUZmO0FBR0ksb0JBQWdCLHdCQUF1QztBQUNuRCxVQUFNQSxHQUFHLEdBQUcsSUFBSUMsV0FBSixFQUFaOztBQUNBSCxtREFBc0JDLFNBQXRCLENBQWdDTSxpQkFBaEMsQ0FBa0RGLElBQWxELENBQXVELElBQXZELEVBQTZESCxHQUE3RDs7QUFDQSxhQUFPQSxHQUFQO0FBQ0g7QUFQTCxHQW5CMkUsQ0FBL0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZXBsYWNlUHJvcGVydHksIFZlYzMgfSBmcm9tIFwiLi4vLi4vY29yZVwiO1xyXG5pbXBvcnQgeyBDYW5ub25Db250YWN0RXF1YXRpb24gfSBmcm9tIFwiLi9jYW5ub24tY29udGFjdC1lcXVhdGlvblwiO1xyXG5cclxucmVwbGFjZVByb3BlcnR5KENhbm5vbkNvbnRhY3RFcXVhdGlvbi5wcm90b3R5cGUsICdJQ29udGFjdEVxdWF0aW9uLnByb3RvdHlwZScsIFtcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdjb250YWN0QScsXHJcbiAgICAgICAgJ25ld05hbWUnOiAnZ2V0TG9jYWxQb2ludE9uQScsXHJcbiAgICAgICAgJ2N1c3RvbUdldHRlcic6IGZ1bmN0aW9uICh0aGlzOiBDYW5ub25Db250YWN0RXF1YXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICAgICAgQ2Fubm9uQ29udGFjdEVxdWF0aW9uLnByb3RvdHlwZS5nZXRMb2NhbFBvaW50T25BLmNhbGwodGhpcywgb3V0KTtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ2NvbnRhY3RCJyxcclxuICAgICAgICAnbmV3TmFtZSc6ICdnZXRMb2NhbFBvaW50T25CJyxcclxuICAgICAgICAnY3VzdG9tR2V0dGVyJzogZnVuY3Rpb24gKHRoaXM6IENhbm5vbkNvbnRhY3RFcXVhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBvdXQgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgICAgICBDYW5ub25Db250YWN0RXF1YXRpb24ucHJvdG90eXBlLmdldExvY2FsUG9pbnRPbkIuY2FsbCh0aGlzLCBvdXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnbm9ybWFsJyxcclxuICAgICAgICAnbmV3TmFtZSc6ICdnZXRMb2NhbE5vcm1hbE9uQicsXHJcbiAgICAgICAgJ2N1c3RvbUdldHRlcic6IGZ1bmN0aW9uICh0aGlzOiBDYW5ub25Db250YWN0RXF1YXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICAgICAgQ2Fubm9uQ29udGFjdEVxdWF0aW9uLnByb3RvdHlwZS5nZXRMb2NhbE5vcm1hbE9uQi5jYWxsKHRoaXMsIG91dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXSlcclxuIl19