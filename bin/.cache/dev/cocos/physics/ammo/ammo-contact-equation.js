(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/index.js", "./ammo-util.js", "./ammo-const.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/index.js"), require("./ammo-util.js"), require("./ammo-const.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.ammoUtil, global.ammoConst);
    global.ammoContactEquation = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _ammoUtil, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoContactEquation = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var AmmoContactEquation = /*#__PURE__*/function () {
    _createClass(AmmoContactEquation, [{
      key: "isBodyA",
      get: function get() {
        var sb = this.event.selfCollider.shape.sharedBody.body;
        var b0 = this.event.impl.getBody0();
        return Ammo.compare(b0, sb);
      }
    }]);

    function AmmoContactEquation(event) {
      _classCallCheck(this, AmmoContactEquation);

      this.impl = null;
      this.event = void 0;
      this.event = event;
    }

    _createClass(AmmoContactEquation, [{
      key: "getLocalPointOnA",
      value: function getLocalPointOnA(out) {
        if (this.impl) (0, _ammoUtil.ammo2CocosVec3)(out, this.impl.m_localPointA);
      }
    }, {
      key: "getLocalPointOnB",
      value: function getLocalPointOnB(out) {
        if (this.impl) (0, _ammoUtil.ammo2CocosVec3)(out, this.impl.m_localPointB);
      }
    }, {
      key: "getWorldPointOnA",
      value: function getWorldPointOnA(out) {
        if (this.impl) (0, _ammoUtil.ammo2CocosVec3)(out, this.impl.m_positionWorldOnA);
      }
    }, {
      key: "getWorldPointOnB",
      value: function getWorldPointOnB(out) {
        if (this.impl) (0, _ammoUtil.ammo2CocosVec3)(out, this.impl.m_positionWorldOnB);
      }
    }, {
      key: "getLocalNormalOnB",
      value: function getLocalNormalOnB(out) {
        if (this.impl) {
          var inv_rot = _ammoConst.CC_QUAT_0;
          var bt_rot = _ammoConst.AmmoConstant.instance.QUAT_0;
          var body = this.event.impl.getBody1();
          body.getWorldTransform().getBasis().getRotation(bt_rot);
          (0, _ammoUtil.ammo2CocosQuat)(inv_rot, bt_rot);

          _index.Quat.invert(inv_rot, inv_rot);

          (0, _ammoUtil.ammo2CocosVec3)(out, this.impl.m_normalWorldOnB);

          _index.Vec3.transformQuat(out, out, inv_rot);
        }
      }
    }, {
      key: "getWorldNormalOnB",
      value: function getWorldNormalOnB(out) {
        if (this.impl) (0, _ammoUtil.ammo2CocosVec3)(out, this.impl.m_normalWorldOnB);
      }
    }]);

    return AmmoContactEquation;
  }();

  _exports.AmmoContactEquation = AmmoContactEquation;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9hbW1vLWNvbnRhY3QtZXF1YXRpb24udHMiXSwibmFtZXMiOlsiQW1tb0NvbnRhY3RFcXVhdGlvbiIsInNiIiwiZXZlbnQiLCJzZWxmQ29sbGlkZXIiLCJzaGFwZSIsInNoYXJlZEJvZHkiLCJib2R5IiwiYjAiLCJpbXBsIiwiZ2V0Qm9keTAiLCJBbW1vIiwiY29tcGFyZSIsIm91dCIsIm1fbG9jYWxQb2ludEEiLCJtX2xvY2FsUG9pbnRCIiwibV9wb3NpdGlvbldvcmxkT25BIiwibV9wb3NpdGlvbldvcmxkT25CIiwiaW52X3JvdCIsIkNDX1FVQVRfMCIsImJ0X3JvdCIsIkFtbW9Db25zdGFudCIsImluc3RhbmNlIiwiUVVBVF8wIiwiZ2V0Qm9keTEiLCJnZXRXb3JsZFRyYW5zZm9ybSIsImdldEJhc2lzIiwiZ2V0Um90YXRpb24iLCJRdWF0IiwiaW52ZXJ0IiwibV9ub3JtYWxXb3JsZE9uQiIsIlZlYzMiLCJ0cmFuc2Zvcm1RdWF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU1hQSxtQjs7OzBCQUVlO0FBQ3BCLFlBQU1DLEVBQUUsR0FBSSxLQUFLQyxLQUFMLENBQVdDLFlBQVgsQ0FBd0JDLEtBQXpCLENBQTZDQyxVQUE3QyxDQUF3REMsSUFBbkU7QUFDQSxZQUFNQyxFQUFFLEdBQUksS0FBS0wsS0FBTCxDQUFXTSxJQUFaLENBQStDQyxRQUEvQyxFQUFYO0FBQ0EsZUFBT0MsSUFBSSxDQUFDQyxPQUFMLENBQWFKLEVBQWIsRUFBaUJOLEVBQWpCLENBQVA7QUFDSDs7O0FBS0QsaUNBQWFDLEtBQWIsRUFBcUM7QUFBQTs7QUFBQSxXQUhyQ00sSUFHcUMsR0FIRCxJQUdDO0FBQUEsV0FGckNOLEtBRXFDO0FBQ2pDLFdBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNIOzs7O3VDQUVpQlUsRyxFQUFzQjtBQUNwQyxZQUFJLEtBQUtKLElBQVQsRUFBZSw4QkFBZUksR0FBZixFQUFvQixLQUFLSixJQUFMLENBQVVLLGFBQTlCO0FBQ2xCOzs7dUNBRWlCRCxHLEVBQXNCO0FBQ3BDLFlBQUksS0FBS0osSUFBVCxFQUFlLDhCQUFlSSxHQUFmLEVBQW9CLEtBQUtKLElBQUwsQ0FBVU0sYUFBOUI7QUFDbEI7Ozt1Q0FFaUJGLEcsRUFBc0I7QUFDcEMsWUFBSSxLQUFLSixJQUFULEVBQWUsOEJBQWVJLEdBQWYsRUFBb0IsS0FBS0osSUFBTCxDQUFVTyxrQkFBOUI7QUFDbEI7Ozt1Q0FFaUJILEcsRUFBc0I7QUFDcEMsWUFBSSxLQUFLSixJQUFULEVBQWUsOEJBQWVJLEdBQWYsRUFBb0IsS0FBS0osSUFBTCxDQUFVUSxrQkFBOUI7QUFDbEI7Ozt3Q0FFa0JKLEcsRUFBc0I7QUFDckMsWUFBSSxLQUFLSixJQUFULEVBQWU7QUFDWCxjQUFNUyxPQUFPLEdBQUdDLG9CQUFoQjtBQUNBLGNBQU1DLE1BQU0sR0FBR0Msd0JBQWFDLFFBQWIsQ0FBc0JDLE1BQXJDO0FBQ0EsY0FBTWhCLElBQUksR0FBSSxLQUFLSixLQUFMLENBQVdNLElBQVosQ0FBK0NlLFFBQS9DLEVBQWI7QUFDQWpCLFVBQUFBLElBQUksQ0FBQ2tCLGlCQUFMLEdBQXlCQyxRQUF6QixHQUFvQ0MsV0FBcEMsQ0FBZ0RQLE1BQWhEO0FBQ0Esd0NBQWVGLE9BQWYsRUFBd0JFLE1BQXhCOztBQUNBUSxzQkFBS0MsTUFBTCxDQUFZWCxPQUFaLEVBQXFCQSxPQUFyQjs7QUFDQSx3Q0FBZUwsR0FBZixFQUFvQixLQUFLSixJQUFMLENBQVVxQixnQkFBOUI7O0FBQ0FDLHNCQUFLQyxhQUFMLENBQW1CbkIsR0FBbkIsRUFBd0JBLEdBQXhCLEVBQTZCSyxPQUE3QjtBQUNIO0FBQ0o7Ozt3Q0FFa0JMLEcsRUFBc0I7QUFDckMsWUFBSSxLQUFLSixJQUFULEVBQWUsOEJBQWVJLEdBQWYsRUFBb0IsS0FBS0osSUFBTCxDQUFVcUIsZ0JBQTlCO0FBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNvbnRhY3RFcXVhdGlvbiwgSUNvbGxpc2lvbkV2ZW50IH0gZnJvbSBcIi4uL2ZyYW1ld29ya1wiO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UsIFZlYzMsIFF1YXQgfSBmcm9tIFwiLi4vLi4vY29yZVwiO1xyXG5pbXBvcnQgeyBhbW1vMkNvY29zVmVjMywgYW1tbzJDb2Nvc1F1YXQgfSBmcm9tIFwiLi9hbW1vLXV0aWxcIjtcclxuaW1wb3J0IHsgQW1tb1NoYXBlIH0gZnJvbSBcIi4vc2hhcGVzL2FtbW8tc2hhcGVcIjtcclxuaW1wb3J0IHsgQ0NfUVVBVF8wLCBBbW1vQ29uc3RhbnQgfSBmcm9tIFwiLi9hbW1vLWNvbnN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQW1tb0NvbnRhY3RFcXVhdGlvbiBpbXBsZW1lbnRzIElDb250YWN0RXF1YXRpb24ge1xyXG5cclxuICAgIGdldCBpc0JvZHlBICgpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBzYiA9ICh0aGlzLmV2ZW50LnNlbGZDb2xsaWRlci5zaGFwZSBhcyBBbW1vU2hhcGUpLnNoYXJlZEJvZHkuYm9keTtcclxuICAgICAgICBjb25zdCBiMCA9ICh0aGlzLmV2ZW50LmltcGwgYXMgQW1tby5idFBlcnNpc3RlbnRNYW5pZm9sZCkuZ2V0Qm9keTAoKTtcclxuICAgICAgICByZXR1cm4gQW1tby5jb21wYXJlKGIwLCBzYik7XHJcbiAgICB9XHJcblxyXG4gICAgaW1wbDogQW1tby5idE1hbmlmb2xkUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICAgIGV2ZW50OiBJQ29sbGlzaW9uRXZlbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGV2ZW50OiBJQ29sbGlzaW9uRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmV2ZW50ID0gZXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYWxQb2ludE9uQSAob3V0OiBJVmVjM0xpa2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5pbXBsKSBhbW1vMkNvY29zVmVjMyhvdXQsIHRoaXMuaW1wbC5tX2xvY2FsUG9pbnRBKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRMb2NhbFBvaW50T25CIChvdXQ6IElWZWMzTGlrZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmltcGwpIGFtbW8yQ29jb3NWZWMzKG91dCwgdGhpcy5pbXBsLm1fbG9jYWxQb2ludEIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFdvcmxkUG9pbnRPbkEgKG91dDogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wbCkgYW1tbzJDb2Nvc1ZlYzMob3V0LCB0aGlzLmltcGwubV9wb3NpdGlvbldvcmxkT25BKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXb3JsZFBvaW50T25CIChvdXQ6IElWZWMzTGlrZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmltcGwpIGFtbW8yQ29jb3NWZWMzKG91dCwgdGhpcy5pbXBsLm1fcG9zaXRpb25Xb3JsZE9uQik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYWxOb3JtYWxPbkIgKG91dDogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnZfcm90ID0gQ0NfUVVBVF8wO1xyXG4gICAgICAgICAgICBjb25zdCBidF9yb3QgPSBBbW1vQ29uc3RhbnQuaW5zdGFuY2UuUVVBVF8wO1xyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gKHRoaXMuZXZlbnQuaW1wbCBhcyBBbW1vLmJ0UGVyc2lzdGVudE1hbmlmb2xkKS5nZXRCb2R5MSgpO1xyXG4gICAgICAgICAgICBib2R5LmdldFdvcmxkVHJhbnNmb3JtKCkuZ2V0QmFzaXMoKS5nZXRSb3RhdGlvbihidF9yb3QpO1xyXG4gICAgICAgICAgICBhbW1vMkNvY29zUXVhdChpbnZfcm90LCBidF9yb3QpO1xyXG4gICAgICAgICAgICBRdWF0LmludmVydChpbnZfcm90LCBpbnZfcm90KTtcclxuICAgICAgICAgICAgYW1tbzJDb2Nvc1ZlYzMob3V0LCB0aGlzLmltcGwubV9ub3JtYWxXb3JsZE9uQik7XHJcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdChvdXQsIG91dCwgaW52X3JvdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFdvcmxkTm9ybWFsT25CIChvdXQ6IElWZWMzTGlrZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmltcGwpIGFtbW8yQ29jb3NWZWMzKG91dCwgdGhpcy5pbXBsLm1fbm9ybWFsV29ybGRPbkIpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==