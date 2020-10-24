(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../../core/index.js", "./shapes/ammo-capsule-shape.js", "./ammo-contact-equation.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../../core/index.js"), require("./shapes/ammo-capsule-shape.js"), require("./ammo-contact-equation.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.index, global.ammoCapsuleShape, global.ammoContactEquation);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_index, _ammoCapsuleShape, _ammoContactEquation) {
  "use strict";

  (0, _index.removeProperty)(_ammoCapsuleShape.AmmoCapsuleShape.prototype, 'shape.prototype', [{
    'name': 'setHeight',
    'suggest': 'You should use the interface provided by the component.'
  }]);
  (0, _index.replaceProperty)(_ammoContactEquation.AmmoContactEquation.prototype, 'IContactEquation.prototype', [{
    'name': 'contactA',
    'newName': 'getLocalPointOnA',
    'customGetter': function customGetter() {
      var out = new _index.Vec3();

      _ammoContactEquation.AmmoContactEquation.prototype.getLocalPointOnA.call(this, out);

      return out;
    }
  }, {
    'name': 'contactB',
    'newName': 'getLocalPointOnB',
    'customGetter': function customGetter() {
      var out = new _index.Vec3();

      _ammoContactEquation.AmmoContactEquation.prototype.getLocalPointOnB.call(this, out);

      return out;
    }
  }, {
    'name': 'normal',
    'newName': 'getLocalNormalOnB',
    'customGetter': function customGetter() {
      var out = new _index.Vec3();

      _ammoContactEquation.AmmoContactEquation.prototype.getLocalNormalOnB.call(this, out);

      return out;
    }
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9kZXByZWNhdGVkLnRzIl0sIm5hbWVzIjpbIkFtbW9DYXBzdWxlU2hhcGUiLCJwcm90b3R5cGUiLCJBbW1vQ29udGFjdEVxdWF0aW9uIiwib3V0IiwiVmVjMyIsImdldExvY2FsUG9pbnRPbkEiLCJjYWxsIiwiZ2V0TG9jYWxQb2ludE9uQiIsImdldExvY2FsTm9ybWFsT25CIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFJQSw2QkFBZUEsbUNBQWlCQyxTQUFoQyxFQUEyQyxpQkFBM0MsRUFBOEQsQ0FDMUQ7QUFDSSxZQUFRLFdBRFo7QUFFSSxlQUFXO0FBRmYsR0FEMEQsQ0FBOUQ7QUFPQSw4QkFBZ0JDLHlDQUFvQkQsU0FBcEMsRUFBK0MsNEJBQS9DLEVBQTZFLENBQ3pFO0FBQ0ksWUFBUSxVQURaO0FBRUksZUFBVyxrQkFGZjtBQUdJLG9CQUFnQix3QkFBcUM7QUFDakQsVUFBTUUsR0FBRyxHQUFHLElBQUlDLFdBQUosRUFBWjs7QUFDQUYsK0NBQW9CRCxTQUFwQixDQUE4QkksZ0JBQTlCLENBQStDQyxJQUEvQyxDQUFvRCxJQUFwRCxFQUEwREgsR0FBMUQ7O0FBQ0EsYUFBT0EsR0FBUDtBQUNIO0FBUEwsR0FEeUUsRUFVekU7QUFDSSxZQUFRLFVBRFo7QUFFSSxlQUFXLGtCQUZmO0FBR0ksb0JBQWdCLHdCQUFxQztBQUNqRCxVQUFNQSxHQUFHLEdBQUcsSUFBSUMsV0FBSixFQUFaOztBQUNBRiwrQ0FBb0JELFNBQXBCLENBQThCTSxnQkFBOUIsQ0FBK0NELElBQS9DLENBQW9ELElBQXBELEVBQTBESCxHQUExRDs7QUFDQSxhQUFPQSxHQUFQO0FBQ0g7QUFQTCxHQVZ5RSxFQW1CekU7QUFDSSxZQUFRLFFBRFo7QUFFSSxlQUFXLG1CQUZmO0FBR0ksb0JBQWdCLHdCQUFxQztBQUNqRCxVQUFNQSxHQUFHLEdBQUcsSUFBSUMsV0FBSixFQUFaOztBQUNBRiwrQ0FBb0JELFNBQXBCLENBQThCTyxpQkFBOUIsQ0FBZ0RGLElBQWhELENBQXFELElBQXJELEVBQTJESCxHQUEzRDs7QUFDQSxhQUFPQSxHQUFQO0FBQ0g7QUFQTCxHQW5CeUUsQ0FBN0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW1vdmVQcm9wZXJ0eSwgcmVwbGFjZVByb3BlcnR5LCBWZWMzIH0gZnJvbSBcIi4uLy4uL2NvcmVcIjtcclxuaW1wb3J0IHsgQW1tb0NhcHN1bGVTaGFwZSB9IGZyb20gXCIuL3NoYXBlcy9hbW1vLWNhcHN1bGUtc2hhcGVcIjtcclxuaW1wb3J0IHsgQW1tb0NvbnRhY3RFcXVhdGlvbiB9IGZyb20gXCIuL2FtbW8tY29udGFjdC1lcXVhdGlvblwiO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoQW1tb0NhcHN1bGVTaGFwZS5wcm90b3R5cGUsICdzaGFwZS5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnc2V0SGVpZ2h0JyxcclxuICAgICAgICAnc3VnZ2VzdCc6ICdZb3Ugc2hvdWxkIHVzZSB0aGUgaW50ZXJmYWNlIHByb3ZpZGVkIGJ5IHRoZSBjb21wb25lbnQuJ1xyXG4gICAgfVxyXG5dKVxyXG5cclxucmVwbGFjZVByb3BlcnR5KEFtbW9Db250YWN0RXF1YXRpb24ucHJvdG90eXBlLCAnSUNvbnRhY3RFcXVhdGlvbi5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnY29udGFjdEEnLFxyXG4gICAgICAgICduZXdOYW1lJzogJ2dldExvY2FsUG9pbnRPbkEnLFxyXG4gICAgICAgICdjdXN0b21HZXR0ZXInOiBmdW5jdGlvbiAodGhpczogQW1tb0NvbnRhY3RFcXVhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBvdXQgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgICAgICBBbW1vQ29udGFjdEVxdWF0aW9uLnByb3RvdHlwZS5nZXRMb2NhbFBvaW50T25BLmNhbGwodGhpcywgb3V0KTtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ2NvbnRhY3RCJyxcclxuICAgICAgICAnbmV3TmFtZSc6ICdnZXRMb2NhbFBvaW50T25CJyxcclxuICAgICAgICAnY3VzdG9tR2V0dGVyJzogZnVuY3Rpb24gKHRoaXM6IEFtbW9Db250YWN0RXF1YXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICAgICAgQW1tb0NvbnRhY3RFcXVhdGlvbi5wcm90b3R5cGUuZ2V0TG9jYWxQb2ludE9uQi5jYWxsKHRoaXMsIG91dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdub3JtYWwnLFxyXG4gICAgICAgICduZXdOYW1lJzogJ2dldExvY2FsTm9ybWFsT25CJyxcclxuICAgICAgICAnY3VzdG9tR2V0dGVyJzogZnVuY3Rpb24gKHRoaXM6IEFtbW9Db250YWN0RXF1YXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICAgICAgQW1tb0NvbnRhY3RFcXVhdGlvbi5wcm90b3R5cGUuZ2V0TG9jYWxOb3JtYWxPbkIuY2FsbCh0aGlzLCBvdXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbl0pXHJcbiJdfQ==