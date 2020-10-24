(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.cannonContactEquation = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonContactEquation = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var CannonContactEquation = /*#__PURE__*/function () {
    _createClass(CannonContactEquation, [{
      key: "isBodyA",
      get: function get() {
        var si = this.event.selfCollider.shape.impl;
        var bj = this.impl.bj;
        return si.body.id == bj.id;
      }
    }]);

    function CannonContactEquation(event) {
      _classCallCheck(this, CannonContactEquation);

      this.impl = null;
      this.event = void 0;
      this.event = event;
    }

    _createClass(CannonContactEquation, [{
      key: "getLocalPointOnA",
      value: function getLocalPointOnA(out) {
        if (this.impl) _index.Vec3.copy(out, this.impl.rj);
      }
    }, {
      key: "getLocalPointOnB",
      value: function getLocalPointOnB(out) {
        if (this.impl) _index.Vec3.copy(out, this.impl.ri);
      }
    }, {
      key: "getWorldPointOnA",
      value: function getWorldPointOnA(out) {
        if (this.impl) _index.Vec3.add(out, this.impl.rj, this.impl.bj.position);
      }
    }, {
      key: "getWorldPointOnB",
      value: function getWorldPointOnB(out) {
        if (this.impl) _index.Vec3.add(out, this.impl.ri, this.impl.bi.position);
      }
    }, {
      key: "getLocalNormalOnB",
      value: function getLocalNormalOnB(out) {
        if (this.impl) _index.Vec3.copy(out, this.impl.ni);
      }
    }, {
      key: "getWorldNormalOnB",
      value: function getWorldNormalOnB(out) {
        if (this.impl) _index.Vec3.transformQuat(out, this.impl.ni, this.impl.bi.quaternion);
      }
    }]);

    return CannonContactEquation;
  }();

  _exports.CannonContactEquation = CannonContactEquation;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL2Nhbm5vbi1jb250YWN0LWVxdWF0aW9uLnRzIl0sIm5hbWVzIjpbIkNhbm5vbkNvbnRhY3RFcXVhdGlvbiIsInNpIiwiZXZlbnQiLCJzZWxmQ29sbGlkZXIiLCJzaGFwZSIsImltcGwiLCJiaiIsImJvZHkiLCJpZCIsIm91dCIsIlZlYzMiLCJjb3B5IiwicmoiLCJyaSIsImFkZCIsInBvc2l0aW9uIiwiYmkiLCJuaSIsInRyYW5zZm9ybVF1YXQiLCJxdWF0ZXJuaW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUlhQSxxQjs7OzBCQUVlO0FBQ3BCLFlBQU1DLEVBQUUsR0FBSSxLQUFLQyxLQUFMLENBQVdDLFlBQVgsQ0FBd0JDLEtBQXpCLENBQStDQyxJQUExRDtBQUNBLFlBQU1DLEVBQUUsR0FBRyxLQUFLRCxJQUFMLENBQVdDLEVBQXRCO0FBQ0EsZUFBT0wsRUFBRSxDQUFDTSxJQUFILENBQVFDLEVBQVIsSUFBY0YsRUFBRSxDQUFDRSxFQUF4QjtBQUNIOzs7QUFLRCxtQ0FBYU4sS0FBYixFQUFxQztBQUFBOztBQUFBLFdBSHJDRyxJQUdxQyxHQUhDLElBR0Q7QUFBQSxXQUZyQ0gsS0FFcUM7QUFDakMsV0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7Ozs7dUNBRWlCTyxHLEVBQXNCO0FBQ3BDLFlBQUksS0FBS0osSUFBVCxFQUFlSyxZQUFLQyxJQUFMLENBQVVGLEdBQVYsRUFBZSxLQUFLSixJQUFMLENBQVVPLEVBQXpCO0FBQ2xCOzs7dUNBRWlCSCxHLEVBQXNCO0FBQ3BDLFlBQUksS0FBS0osSUFBVCxFQUFlSyxZQUFLQyxJQUFMLENBQVVGLEdBQVYsRUFBZSxLQUFLSixJQUFMLENBQVVRLEVBQXpCO0FBQ2xCOzs7dUNBRWlCSixHLEVBQXNCO0FBQ3BDLFlBQUksS0FBS0osSUFBVCxFQUFlSyxZQUFLSSxHQUFMLENBQVNMLEdBQVQsRUFBYyxLQUFLSixJQUFMLENBQVVPLEVBQXhCLEVBQTRCLEtBQUtQLElBQUwsQ0FBVUMsRUFBVixDQUFhUyxRQUF6QztBQUNsQjs7O3VDQUVpQk4sRyxFQUFzQjtBQUNwQyxZQUFJLEtBQUtKLElBQVQsRUFBZUssWUFBS0ksR0FBTCxDQUFTTCxHQUFULEVBQWMsS0FBS0osSUFBTCxDQUFVUSxFQUF4QixFQUE0QixLQUFLUixJQUFMLENBQVVXLEVBQVYsQ0FBYUQsUUFBekM7QUFDbEI7Ozt3Q0FFa0JOLEcsRUFBc0I7QUFDckMsWUFBSSxLQUFLSixJQUFULEVBQWVLLFlBQUtDLElBQUwsQ0FBVUYsR0FBVixFQUFlLEtBQUtKLElBQUwsQ0FBVVksRUFBekI7QUFDbEI7Ozt3Q0FFa0JSLEcsRUFBc0I7QUFDckMsWUFBSSxLQUFLSixJQUFULEVBQWVLLFlBQUtRLGFBQUwsQ0FBbUJULEdBQW5CLEVBQXdCLEtBQUtKLElBQUwsQ0FBVVksRUFBbEMsRUFBc0MsS0FBS1osSUFBTCxDQUFVVyxFQUFWLENBQWFHLFVBQW5EO0FBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNvbnRhY3RFcXVhdGlvbiwgSUNvbGxpc2lvbkV2ZW50IH0gZnJvbSBcIi4uL2ZyYW1ld29ya1wiO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UsIFZlYzMgfSBmcm9tIFwiLi4vLi4vY29yZVwiO1xyXG5pbXBvcnQgeyBDYW5ub25TaGFwZSB9IGZyb20gXCIuL3NoYXBlcy9jYW5ub24tc2hhcGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW5ub25Db250YWN0RXF1YXRpb24gaW1wbGVtZW50cyBJQ29udGFjdEVxdWF0aW9uIHtcclxuXHJcbiAgICBnZXQgaXNCb2R5QSAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3Qgc2kgPSAodGhpcy5ldmVudC5zZWxmQ29sbGlkZXIuc2hhcGUgYXMgQ2Fubm9uU2hhcGUpLmltcGw7XHJcbiAgICAgICAgY29uc3QgYmogPSB0aGlzLmltcGwhLmJqO1xyXG4gICAgICAgIHJldHVybiBzaS5ib2R5LmlkID09IGJqLmlkO1xyXG4gICAgfVxyXG5cclxuICAgIGltcGw6IENBTk5PTi5Db250YWN0RXF1YXRpb24gfCBudWxsID0gbnVsbDtcclxuICAgIGV2ZW50OiBJQ29sbGlzaW9uRXZlbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGV2ZW50OiBJQ29sbGlzaW9uRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmV2ZW50ID0gZXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYWxQb2ludE9uQSAob3V0OiBJVmVjM0xpa2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5pbXBsKSBWZWMzLmNvcHkob3V0LCB0aGlzLmltcGwucmopO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExvY2FsUG9pbnRPbkIgKG91dDogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wbCkgVmVjMy5jb3B5KG91dCwgdGhpcy5pbXBsLnJpKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXb3JsZFBvaW50T25BIChvdXQ6IElWZWMzTGlrZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmltcGwpIFZlYzMuYWRkKG91dCwgdGhpcy5pbXBsLnJqLCB0aGlzLmltcGwuYmoucG9zaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFdvcmxkUG9pbnRPbkIgKG91dDogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wbCkgVmVjMy5hZGQob3V0LCB0aGlzLmltcGwucmksIHRoaXMuaW1wbC5iaS5wb3NpdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYWxOb3JtYWxPbkIgKG91dDogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wbCkgVmVjMy5jb3B5KG91dCwgdGhpcy5pbXBsLm5pKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXb3JsZE5vcm1hbE9uQiAob3V0OiBJVmVjM0xpa2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5pbXBsKSBWZWMzLnRyYW5zZm9ybVF1YXQob3V0LCB0aGlzLmltcGwubmksIHRoaXMuaW1wbC5iaS5xdWF0ZXJuaW9uKTtcclxuICAgIH1cclxuXHJcbn0iXX0=