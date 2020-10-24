(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../math/index.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../math/index.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.globalExports);
    global.touch = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Touch = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _vec2 = new _index.Vec2();
  /**
   * @en The touch point class
   * @zh 封装了触点相关的信息。
   */


  var Touch = /*#__PURE__*/function () {
    _createClass(Touch, [{
      key: "lastModified",
      get: function get() {
        return this._lastModified;
      }
      /**
       * @param x - x position of the touch point
       * @param y - y position of the touch point
       * @param id - The id of the touch point
       */

    }]);

    function Touch(x, y) {
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      _classCallCheck(this, Touch);

      this._point = new _index.Vec2();
      this._prevPoint = new _index.Vec2();
      this._lastModified = 0;
      this._id = 0;
      this._startPoint = new _index.Vec2();
      this._startPointCaptured = false;
      this.setTouchInfo(id, x, y);
    }
    /**
     * @en Returns the current touch location in OpenGL coordinates.、
     * @zh 获取当前触点位置。
     * @param out - Pass the out object to avoid object creation, very good practice
     */


    _createClass(Touch, [{
      key: "getLocation",
      value: function getLocation(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._point.x, this._point.y);
        return out;
      }
      /**
       * @en Returns X axis location value.
       * @zh 获取当前触点 X 轴位置。
       */

    }, {
      key: "getLocationX",
      value: function getLocationX() {
        return this._point.x;
      }
      /**
       * @en Returns Y axis location value.
       * @zh 获取当前触点 Y 轴位置。
       */

    }, {
      key: "getLocationY",
      value: function getLocationY() {
        return this._point.y;
      }
      /**
       * @en Returns the current touch location in UI coordinates.、
       * @zh 获取当前触点在 UI 坐标系中的位置。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUILocation",
      value: function getUILocation(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._point.x, this._point.y);

        _globalExports.legacyCC.view._convertPointWithScale(out);

        return out;
      }
      /**
       * @en Returns X axis location value in UI coordinates.
       * @zh 获取当前触点在 UI 坐标系中 X 轴位置。
       */

    }, {
      key: "getUILocationX",
      value: function getUILocationX() {
        var viewport = _globalExports.legacyCC.view.getViewportRect();

        return (this._point.x - viewport.x) / _globalExports.legacyCC.view.getScaleX();
      }
      /**
       * @en Returns Y axis location value in UI coordinates.
       * @zh 获取当前触点在 UI 坐标系中 Y 轴位置。
       */

    }, {
      key: "getUILocationY",
      value: function getUILocationY() {
        var viewport = _globalExports.legacyCC.view.getViewportRect();

        return (this._point.y - viewport.y) / _globalExports.legacyCC.view.getScaleY();
      }
      /**
       * @en Returns the previous touch location.
       * @zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getPreviousLocation",
      value: function getPreviousLocation(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._prevPoint.x, this._prevPoint.y);
        return out;
      }
      /**
       * @en Returns the previous touch location in UI coordinates.
       * @zh 获取触点在上一次事件时在 UI 坐标系中的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUIPreviousLocation",
      value: function getUIPreviousLocation(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._prevPoint.x, this._prevPoint.y);

        _globalExports.legacyCC.view._convertPointWithScale(out);

        return out;
      }
      /**
       * @en Returns the start touch location.
       * @zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getStartLocation",
      value: function getStartLocation(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._startPoint.x, this._startPoint.y);
        return out;
      }
      /**
       * @en Returns the start touch location in UI coordinates.
       * @zh 获取触点落下时在 UI 坐标系中的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUIStartLocation",
      value: function getUIStartLocation(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._startPoint.x, this._startPoint.y);

        _globalExports.legacyCC.view._convertPointWithScale(out);

        return out;
      }
      /**
       * @en Returns the delta distance from the previous touche to the current one.
       * @zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getDelta",
      value: function getDelta(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._point);
        out.subtract(this._prevPoint);
        return out;
      }
      /**
       * @en Returns the delta distance from the previous touche to the current one in UI coordinates.
       * @zh 获取触点距离上一次事件移动在 UI 坐标系中的距离对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUIDelta",
      value: function getUIDelta(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        _vec2.set(this._point);

        _vec2.subtract(this._prevPoint);

        out.set(_globalExports.legacyCC.view.getScaleX(), _globalExports.legacyCC.view.getScaleY());

        _index.Vec2.divide(out, _vec2, out);

        return out;
      }
      /**
       * @en Returns the current touch location in screen coordinates.
       * @zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getLocationInView",
      value: function getLocationInView(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._point.x, _globalExports.legacyCC.view._designResolutionSize.height - this._point.y);
        return out;
      }
      /**
       * @en Returns the previous touch location in screen coordinates.
       * @zh 获取触点在上一次事件时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getPreviousLocationInView",
      value: function getPreviousLocationInView(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._prevPoint.x, _globalExports.legacyCC.view._designResolutionSize.height - this._prevPoint.y);
        return out;
      }
      /**
       * @en Returns the start touch location in screen coordinates.
       * @zh 获取触点落下时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getStartLocationInView",
      value: function getStartLocationInView(out) {
        if (!out) {
          out = new _index.Vec2();
        }

        out.set(this._startPoint.x, _globalExports.legacyCC.view._designResolutionSize.height - this._startPoint.y);
        return out;
      }
      /**
       * @en Returns the id of the touch point.
       * @zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
       */

    }, {
      key: "getID",
      value: function getID() {
        return this._id;
      }
      /**
       * @en Resets touch point information.
       * @zh 重置触点相关的信息。
       * @param id - The id of the touch point
       * @param x - x position of the touch point
       * @param y - y position of the touch point
       */

    }, {
      key: "setTouchInfo",
      value: function setTouchInfo() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var x = arguments.length > 1 ? arguments[1] : undefined;
        var y = arguments.length > 2 ? arguments[2] : undefined;
        this._prevPoint = this._point;
        this._point = new _index.Vec2(x || 0, y || 0);
        this._id = id;

        if (!this._startPointCaptured) {
          this._startPoint = new _index.Vec2(this._point); // cc.view._convertPointWithScale(this._startPoint);

          this._startPointCaptured = true;
        }
      }
      /**
       * @en Sets touch point location.
       * @zh 设置触点位置。
       * @param point - The location
       */

    }, {
      key: "setPoint",
      value: function setPoint(x, y) {
        if (_typeof(x) === 'object') {
          this._point.x = x.x;
          this._point.y = x.y;
        } else {
          this._point.x = x || 0;
          this._point.y = y || 0;
        }

        this._lastModified = _globalExports.legacyCC.director.getCurrentTime();
      }
      /**
       * @en Sets the location previously registered for the current touch.
       * @zh 设置触点在前一次触发时收集的位置。
       * @param point - The location
       */

    }, {
      key: "setPrevPoint",
      value: function setPrevPoint(x, y) {
        if (_typeof(x) === 'object') {
          this._prevPoint = new _index.Vec2(x.x, x.y);
        } else {
          this._prevPoint = new _index.Vec2(x || 0, y || 0);
        }

        this._lastModified = _globalExports.legacyCC.director.getCurrentTime();
      }
    }]);

    return Touch;
  }();

  _exports.Touch = Touch;
  _globalExports.legacyCC.Touch = Touch;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci90b3VjaC50cyJdLCJuYW1lcyI6WyJfdmVjMiIsIlZlYzIiLCJUb3VjaCIsIl9sYXN0TW9kaWZpZWQiLCJ4IiwieSIsImlkIiwiX3BvaW50IiwiX3ByZXZQb2ludCIsIl9pZCIsIl9zdGFydFBvaW50IiwiX3N0YXJ0UG9pbnRDYXB0dXJlZCIsInNldFRvdWNoSW5mbyIsIm91dCIsInNldCIsImxlZ2FjeUNDIiwidmlldyIsIl9jb252ZXJ0UG9pbnRXaXRoU2NhbGUiLCJ2aWV3cG9ydCIsImdldFZpZXdwb3J0UmVjdCIsImdldFNjYWxlWCIsImdldFNjYWxlWSIsInN1YnRyYWN0IiwiZGl2aWRlIiwiX2Rlc2lnblJlc29sdXRpb25TaXplIiwiaGVpZ2h0IiwiZGlyZWN0b3IiLCJnZXRDdXJyZW50VGltZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlDQSxNQUFNQSxLQUFLLEdBQUcsSUFBSUMsV0FBSixFQUFkO0FBQ0E7Ozs7OztNQUlhQyxLOzs7MEJBUVc7QUFDaEIsZUFBTyxLQUFLQyxhQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFLQSxtQkFBYUMsQ0FBYixFQUF3QkMsQ0FBeEIsRUFBbUQ7QUFBQSxVQUFoQkMsRUFBZ0IsdUVBQUgsQ0FBRzs7QUFBQTs7QUFBQSxXQWhCM0NDLE1BZ0IyQyxHQWhCNUIsSUFBSU4sV0FBSixFQWdCNEI7QUFBQSxXQWYzQ08sVUFlMkMsR0FmeEIsSUFBSVAsV0FBSixFQWV3QjtBQUFBLFdBZDNDRSxhQWMyQyxHQWQzQixDQWMyQjtBQUFBLFdBYjNDTSxHQWEyQyxHQWI3QixDQWE2QjtBQUFBLFdBWjNDQyxXQVkyQyxHQVp2QixJQUFJVCxXQUFKLEVBWXVCO0FBQUEsV0FYM0NVLG1CQVcyQyxHQVhaLEtBV1k7QUFDL0MsV0FBS0MsWUFBTCxDQUFrQk4sRUFBbEIsRUFBc0JGLENBQXRC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K0JBZWlCUCxDLEVBQWtCQyxDLEVBQVk7QUFDM0MsWUFBSSxRQUFPRCxDQUFQLE1BQWEsUUFBakIsRUFBMkI7QUFDdkIsZUFBS0csTUFBTCxDQUFZSCxDQUFaLEdBQWdCQSxDQUFDLENBQUNBLENBQWxCO0FBQ0EsZUFBS0csTUFBTCxDQUFZRixDQUFaLEdBQWdCRCxDQUFDLENBQUNDLENBQWxCO0FBQ0gsU0FIRCxNQUdPO0FBQ0gsZUFBS0UsTUFBTCxDQUFZSCxDQUFaLEdBQWdCQSxDQUFDLElBQUksQ0FBckI7QUFDQSxlQUFLRyxNQUFMLENBQVlGLENBQVosR0FBZ0JBLENBQUMsSUFBSSxDQUFyQjtBQUNIOztBQUNELGFBQUtGLGFBQUwsR0FBcUJZLHdCQUFTVyxRQUFULENBQWtCQyxjQUFsQixFQUFyQjtBQUNIO0FBRUQ7Ozs7Ozs7O21DQWVxQnZCLEMsRUFBa0JDLEMsRUFBWTtBQUMvQyxZQUFJLFFBQU9ELENBQVAsTUFBYSxRQUFqQixFQUEyQjtBQUN2QixlQUFLSSxVQUFMLEdBQWtCLElBQUlQLFdBQUosQ0FBU0csQ0FBQyxDQUFDQSxDQUFYLEVBQWNBLENBQUMsQ0FBQ0MsQ0FBaEIsQ0FBbEI7QUFDSCxTQUZELE1BRU87QUFDSCxlQUFLRyxVQUFMLEdBQWtCLElBQUlQLFdBQUosQ0FBU0csQ0FBQyxJQUFJLENBQWQsRUFBaUJDLENBQUMsSUFBSSxDQUF0QixDQUFsQjtBQUNIOztBQUNELGFBQUtGLGFBQUwsR0FBcUJZLHdCQUFTVyxRQUFULENBQWtCQyxjQUFsQixFQUFyQjtBQUNIOzs7Ozs7O0FBR0xaLDBCQUFTYixLQUFULEdBQWlCQSxLQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgZXZlbnRcclxuICovXHJcblxyXG5pbXBvcnQgeyBWZWMyIH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgX3ZlYzIgPSBuZXcgVmVjMigpO1xyXG4vKipcclxuICogQGVuIFRoZSB0b3VjaCBwb2ludCBjbGFzc1xyXG4gKiBAemgg5bCB6KOF5LqG6Kem54K555u45YWz55qE5L+h5oGv44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVG91Y2gge1xyXG4gICAgcHJpdmF0ZSBfcG9pbnQ6IFZlYzIgPSBuZXcgVmVjMigpO1xyXG4gICAgcHJpdmF0ZSBfcHJldlBvaW50OiBWZWMyID0gbmV3IFZlYzIoKTtcclxuICAgIHByaXZhdGUgX2xhc3RNb2RpZmllZCA9IDA7XHJcbiAgICBwcml2YXRlIF9pZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3N0YXJ0UG9pbnQ6IFZlYzIgPSBuZXcgVmVjMigpO1xyXG4gICAgcHJpdmF0ZSBfc3RhcnRQb2ludENhcHR1cmVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgZ2V0IGxhc3RNb2RpZmllZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3RNb2RpZmllZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB4IC0geCBwb3NpdGlvbiBvZiB0aGUgdG91Y2ggcG9pbnRcclxuICAgICAqIEBwYXJhbSB5IC0geSBwb3NpdGlvbiBvZiB0aGUgdG91Y2ggcG9pbnRcclxuICAgICAqIEBwYXJhbSBpZCAtIFRoZSBpZCBvZiB0aGUgdG91Y2ggcG9pbnRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKHg6IG51bWJlciwgeTogbnVtYmVyLCBpZDogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIHRoaXMuc2V0VG91Y2hJbmZvKGlkLCB4LCB5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBjdXJyZW50IHRvdWNoIGxvY2F0aW9uIGluIE9wZW5HTCBjb29yZGluYXRlcy7jgIFcclxuICAgICAqIEB6aCDojrflj5blvZPliY3op6bngrnkvY3nva7jgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMb2NhdGlvbiAob3V0PzogVmVjMikge1xyXG4gICAgICAgIGlmICghb3V0KXtcclxuICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dC5zZXQodGhpcy5fcG9pbnQueCwgdGhpcy5fcG9pbnQueSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIFggYXhpcyBsb2NhdGlvbiB2YWx1ZS5cclxuICAgICAqIEB6aCDojrflj5blvZPliY3op6bngrkgWCDovbTkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldExvY2F0aW9uWCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50Lng7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBZIGF4aXMgbG9jYXRpb24gdmFsdWUuXHJcbiAgICAgKiBAemgg6I635Y+W5b2T5YmN6Kem54K5IFkg6L205L2N572u44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMb2NhdGlvblkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb2ludC55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIGN1cnJlbnQgdG91Y2ggbG9jYXRpb24gaW4gVUkgY29vcmRpbmF0ZXMu44CBXHJcbiAgICAgKiBAemgg6I635Y+W5b2T5YmN6Kem54K55ZyoIFVJIOWdkOagh+ezu+S4reeahOS9jee9ruOAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJTG9jYXRpb24gKG91dD86IFZlYzIpIHtcclxuICAgICAgICBpZiAoIW91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBuZXcgVmVjMigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3V0LnNldCh0aGlzLl9wb2ludC54LCB0aGlzLl9wb2ludC55KTtcclxuICAgICAgICBsZWdhY3lDQy52aWV3Ll9jb252ZXJ0UG9pbnRXaXRoU2NhbGUob3V0KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgWCBheGlzIGxvY2F0aW9uIHZhbHVlIGluIFVJIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjeinpueCueWcqCBVSSDlnZDmoIfns7vkuK0gWCDovbTkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJTG9jYXRpb25YICgpIHtcclxuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IGxlZ2FjeUNDLnZpZXcuZ2V0Vmlld3BvcnRSZWN0KCk7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9wb2ludC54IC0gdmlld3BvcnQueCkgLyBsZWdhY3lDQy52aWV3LmdldFNjYWxlWCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgWSBheGlzIGxvY2F0aW9uIHZhbHVlIGluIFVJIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjeinpueCueWcqCBVSSDlnZDmoIfns7vkuK0gWSDovbTkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJTG9jYXRpb25ZICgpIHtcclxuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IGxlZ2FjeUNDLnZpZXcuZ2V0Vmlld3BvcnRSZWN0KCk7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9wb2ludC55IC0gdmlld3BvcnQueSkgLyBsZWdhY3lDQy52aWV3LmdldFNjYWxlWSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIHByZXZpb3VzIHRvdWNoIGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiOt+WPluinpueCueWcqOS4iuS4gOasoeS6i+S7tuaXtueahOS9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFByZXZpb3VzTG9jYXRpb24gKG91dD86IFZlYzIpIHtcclxuICAgICAgICBpZiAoIW91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBuZXcgVmVjMigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3V0LnNldCh0aGlzLl9wcmV2UG9pbnQueCwgdGhpcy5fcHJldlBvaW50LnkpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgcHJldmlvdXMgdG91Y2ggbG9jYXRpb24gaW4gVUkgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemgg6I635Y+W6Kem54K55Zyo5LiK5LiA5qyh5LqL5Lu25pe25ZyoIFVJIOWdkOagh+ezu+S4reeahOS9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJUHJldmlvdXNMb2NhdGlvbiAob3V0PzogVmVjMikge1xyXG4gICAgICAgIGlmICghb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG5ldyBWZWMyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvdXQuc2V0KHRoaXMuX3ByZXZQb2ludC54LCB0aGlzLl9wcmV2UG9pbnQueSk7XHJcbiAgICAgICAgbGVnYWN5Q0Mudmlldy5fY29udmVydFBvaW50V2l0aFNjYWxlKG91dCk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBzdGFydCB0b3VjaCBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDojrflj5bop6bngrnokL3kuIvml7bnmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTdGFydExvY2F0aW9uIChvdXQ/OiBWZWMyKSB7XHJcbiAgICAgICAgaWYgKCFvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dC5zZXQodGhpcy5fc3RhcnRQb2ludC54LCB0aGlzLl9zdGFydFBvaW50LnkpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgc3RhcnQgdG91Y2ggbG9jYXRpb24gaW4gVUkgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemgg6I635Y+W6Kem54K56JC95LiL5pe25ZyoIFVJIOWdkOagh+ezu+S4reeahOS9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJU3RhcnRMb2NhdGlvbiAob3V0PzogVmVjMikge1xyXG4gICAgICAgIGlmICghb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG5ldyBWZWMyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvdXQuc2V0KHRoaXMuX3N0YXJ0UG9pbnQueCwgdGhpcy5fc3RhcnRQb2ludC55KTtcclxuICAgICAgICBsZWdhY3lDQy52aWV3Ll9jb252ZXJ0UG9pbnRXaXRoU2NhbGUob3V0KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIHRvdWNoZSB0byB0aGUgY3VycmVudCBvbmUuXHJcbiAgICAgKiBAemgg6I635Y+W6Kem54K56Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo55qE6Led56a75a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IC0gUGFzcyB0aGUgb3V0IG9iamVjdCB0byBhdm9pZCBvYmplY3QgY3JlYXRpb24sIHZlcnkgZ29vZCBwcmFjdGljZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RGVsdGEgKG91dD86IFZlYzIpIHtcclxuICAgICAgICBpZiAoIW91dCl7XHJcbiAgICAgICAgICAgIG91dCA9IG5ldyBWZWMyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvdXQuc2V0KHRoaXMuX3BvaW50KTtcclxuICAgICAgICBvdXQuc3VidHJhY3QodGhpcy5fcHJldlBvaW50KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIHRvdWNoZSB0byB0aGUgY3VycmVudCBvbmUgaW4gVUkgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemgg6I635Y+W6Kem54K56Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo5ZyoIFVJIOWdkOagh+ezu+S4reeahOi3neemu+Wvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJRGVsdGEgKG91dD86IFZlYzIpIHtcclxuICAgICAgICBpZiAoIW91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBuZXcgVmVjMigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX3ZlYzIuc2V0KHRoaXMuX3BvaW50KTtcclxuICAgICAgICBfdmVjMi5zdWJ0cmFjdCh0aGlzLl9wcmV2UG9pbnQpO1xyXG4gICAgICAgIG91dC5zZXQobGVnYWN5Q0Mudmlldy5nZXRTY2FsZVgoKSwgbGVnYWN5Q0Mudmlldy5nZXRTY2FsZVkoKSk7XHJcbiAgICAgICAgVmVjMi5kaXZpZGUob3V0LCBfdmVjMiwgb3V0KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIGN1cnJlbnQgdG91Y2ggbG9jYXRpb24gaW4gc2NyZWVuIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjeS6i+S7tuWcqOa4uOaIj+eql+WPo+WGheeahOWdkOagh+S9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldExvY2F0aW9uSW5WaWV3IChvdXQ/OiBWZWMyKSB7XHJcbiAgICAgICAgaWYgKCFvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dC5zZXQodGhpcy5fcG9pbnQueCwgbGVnYWN5Q0Mudmlldy5fZGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0IC0gdGhpcy5fcG9pbnQueSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBwcmV2aW91cyB0b3VjaCBsb2NhdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemgg6I635Y+W6Kem54K55Zyo5LiK5LiA5qyh5LqL5Lu25pe25Zyo5ri45oiP56qX5Y+j5Lit55qE5L2N572u5a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IC0gUGFzcyB0aGUgb3V0IG9iamVjdCB0byBhdm9pZCBvYmplY3QgY3JlYXRpb24sIHZlcnkgZ29vZCBwcmFjdGljZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UHJldmlvdXNMb2NhdGlvbkluVmlldyAob3V0PzogVmVjMikge1xyXG4gICAgICAgIGlmICghb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG5ldyBWZWMyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvdXQuc2V0KHRoaXMuX3ByZXZQb2ludC54LCBsZWdhY3lDQy52aWV3Ll9kZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQgLSB0aGlzLl9wcmV2UG9pbnQueSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBzdGFydCB0b3VjaCBsb2NhdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemgg6I635Y+W6Kem54K56JC95LiL5pe25Zyo5ri45oiP56qX5Y+j5Lit55qE5L2N572u5a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IC0gUGFzcyB0aGUgb3V0IG9iamVjdCB0byBhdm9pZCBvYmplY3QgY3JlYXRpb24sIHZlcnkgZ29vZCBwcmFjdGljZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0U3RhcnRMb2NhdGlvbkluVmlldyAob3V0PzogVmVjMikge1xyXG4gICAgICAgIGlmICghb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG5ldyBWZWMyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvdXQuc2V0KHRoaXMuX3N0YXJ0UG9pbnQueCwgbGVnYWN5Q0Mudmlldy5fZGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0IC0gdGhpcy5fc3RhcnRQb2ludC55KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIGlkIG9mIHRoZSB0b3VjaCBwb2ludC5cclxuICAgICAqIEB6aCDop6bngrnnmoTmoIfor4YgSUTvvIzlj6/ku6XnlKjmnaXlnKjlpJrngrnop6bmkbjkuK3ot5/ouKrop6bngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldElEICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzZXRzIHRvdWNoIHBvaW50IGluZm9ybWF0aW9uLlxyXG4gICAgICogQHpoIOmHjee9ruinpueCueebuOWFs+eahOS/oeaBr+OAglxyXG4gICAgICogQHBhcmFtIGlkIC0gVGhlIGlkIG9mIHRoZSB0b3VjaCBwb2ludFxyXG4gICAgICogQHBhcmFtIHggLSB4IHBvc2l0aW9uIG9mIHRoZSB0b3VjaCBwb2ludFxyXG4gICAgICogQHBhcmFtIHkgLSB5IHBvc2l0aW9uIG9mIHRoZSB0b3VjaCBwb2ludFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VG91Y2hJbmZvIChpZDogbnVtYmVyID0gMCwgeD86IG51bWJlciwgeT86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3ByZXZQb2ludCA9IHRoaXMuX3BvaW50O1xyXG4gICAgICAgIHRoaXMuX3BvaW50ID0gbmV3IFZlYzIoeCB8fCAwLCB5IHx8IDApO1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zdGFydFBvaW50Q2FwdHVyZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRQb2ludCA9IG5ldyBWZWMyKHRoaXMuX3BvaW50KTtcclxuICAgICAgICAgICAgLy8gY2Mudmlldy5fY29udmVydFBvaW50V2l0aFNjYWxlKHRoaXMuX3N0YXJ0UG9pbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydFBvaW50Q2FwdHVyZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIHRvdWNoIHBvaW50IGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiuvue9ruinpueCueS9jee9ruOAglxyXG4gICAgICogQHBhcmFtIHBvaW50IC0gVGhlIGxvY2F0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRQb2ludCAocG9pbnQ6IFZlYzIpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldHMgdG91Y2ggcG9pbnQgbG9jYXRpb24uXHJcbiAgICAgKiBAemgg6K6+572u6Kem54K55L2N572u44CCXHJcbiAgICAgKiBAcGFyYW0geCAtIHggcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB5IC0geSBwb3NpdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0UG9pbnQgKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgc2V0UG9pbnQgKHg6IG51bWJlciB8IFZlYzIsIHk/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BvaW50LnggPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMuX3BvaW50LnkgPSB4Lnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9pbnQueCA9IHggfHwgMDtcclxuICAgICAgICAgICAgdGhpcy5fcG9pbnQueSA9IHkgfHwgMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbGFzdE1vZGlmaWVkID0gbGVnYWN5Q0MuZGlyZWN0b3IuZ2V0Q3VycmVudFRpbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIHRoZSBsb2NhdGlvbiBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZm9yIHRoZSBjdXJyZW50IHRvdWNoLlxyXG4gICAgICogQHpoIOiuvue9ruinpueCueWcqOWJjeS4gOasoeinpuWPkeaXtuaUtumbhueahOS9jee9ruOAglxyXG4gICAgICogQHBhcmFtIHBvaW50IC0gVGhlIGxvY2F0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRQcmV2UG9pbnQgKHBvaW50OiBWZWMyKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIHRoZSBsb2NhdGlvbiBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgZm9yIHRoZSBjdXJyZW50IHRvdWNoLlxyXG4gICAgICogQHpoIOiuvue9ruinpueCueWcqOWJjeS4gOasoeinpuWPkeaXtuaUtumbhueahOS9jee9ruOAglxyXG4gICAgICogQHBhcmFtIHggLSB4IHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0geSAtIHkgcG9zaXRpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFByZXZQb2ludCAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBzZXRQcmV2UG9pbnQgKHg6IG51bWJlciB8IFZlYzIsIHk/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ByZXZQb2ludCA9IG5ldyBWZWMyKHgueCwgeC55KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9wcmV2UG9pbnQgPSBuZXcgVmVjMih4IHx8IDAsIHkgfHwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xhc3RNb2RpZmllZCA9IGxlZ2FjeUNDLmRpcmVjdG9yLmdldEN1cnJlbnRUaW1lKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLlRvdWNoID0gVG91Y2g7XHJcbiJdfQ==