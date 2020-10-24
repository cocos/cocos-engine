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
    global.tabIndexUtil = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.tabIndexUtil = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @hidden
   */
  var tabIndexUtil = /*#__PURE__*/function () {
    function tabIndexUtil() {
      _classCallCheck(this, tabIndexUtil);
    }

    _createClass(tabIndexUtil, null, [{
      key: "add",
      value: function add(editBoxImpl) {
        var list = this._tabIndexList;
        var index = list.indexOf(editBoxImpl);

        if (index === -1) {
          list.push(editBoxImpl);
        }
      }
    }, {
      key: "remove",
      value: function remove(editBoxImpl) {
        var list = this._tabIndexList;
        var index = list.indexOf(editBoxImpl);

        if (index !== -1) {
          list.splice(index, 1);
        }
      }
    }, {
      key: "resort",
      value: function resort() {
        this._tabIndexList.sort(function (a, b) {
          return a._delegate.tabIndex - b._delegate.tabIndex;
        });
      }
    }, {
      key: "next",
      value: function next(editBoxImpl) {
        var list = this._tabIndexList;
        var index = list.indexOf(editBoxImpl);
        editBoxImpl.setFocus(false);

        if (index !== -1) {
          var nextImpl = list[index + 1];

          if (nextImpl && nextImpl._delegate.tabIndex >= 0) {
            nextImpl.setFocus(true);
          }
        }
      }
    }]);

    return tabIndexUtil;
  }();

  _exports.tabIndexUtil = tabIndexUtil;
  tabIndexUtil._tabIndexList = [];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvZWRpdGJveC90YWJJbmRleFV0aWwudHMiXSwibmFtZXMiOlsidGFiSW5kZXhVdGlsIiwiZWRpdEJveEltcGwiLCJsaXN0IiwiX3RhYkluZGV4TGlzdCIsImluZGV4IiwiaW5kZXhPZiIsInB1c2giLCJzcGxpY2UiLCJzb3J0IiwiYSIsImIiLCJfZGVsZWdhdGUiLCJ0YWJJbmRleCIsInNldEZvY3VzIiwibmV4dEltcGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztNQU1hQSxZOzs7Ozs7OzBCQUdVQyxXLEVBQTBCO0FBQ3pDLFlBQU1DLElBQUksR0FBRyxLQUFLQyxhQUFsQjtBQUNBLFlBQU1DLEtBQUssR0FBR0YsSUFBSSxDQUFDRyxPQUFMLENBQWFKLFdBQWIsQ0FBZDs7QUFDQSxZQUFJRyxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWlCO0FBQ2JGLFVBQUFBLElBQUksQ0FBQ0ksSUFBTCxDQUFVTCxXQUFWO0FBQ0g7QUFDSjs7OzZCQUVxQkEsVyxFQUEwQjtBQUM1QyxZQUFNQyxJQUFJLEdBQUcsS0FBS0MsYUFBbEI7QUFDQSxZQUFNQyxLQUFLLEdBQUdGLElBQUksQ0FBQ0csT0FBTCxDQUFhSixXQUFiLENBQWQ7O0FBQ0EsWUFBSUcsS0FBSyxLQUFLLENBQUMsQ0FBZixFQUFrQjtBQUNkRixVQUFBQSxJQUFJLENBQUNLLE1BQUwsQ0FBWUgsS0FBWixFQUFtQixDQUFuQjtBQUNIO0FBQ0o7OzsrQkFFdUI7QUFDcEIsYUFBS0QsYUFBTCxDQUFtQkssSUFBbkIsQ0FBd0IsVUFBQ0MsQ0FBRCxFQUFpQkMsQ0FBakIsRUFBb0M7QUFDeEQsaUJBQU9ELENBQUMsQ0FBQ0UsU0FBRixDQUFhQyxRQUFiLEdBQXdCRixDQUFDLENBQUNDLFNBQUYsQ0FBYUMsUUFBNUM7QUFDSCxTQUZEO0FBR0g7OzsyQkFFbUJYLFcsRUFBMEI7QUFDMUMsWUFBTUMsSUFBSSxHQUFHLEtBQUtDLGFBQWxCO0FBQ0EsWUFBTUMsS0FBSyxHQUFHRixJQUFJLENBQUNHLE9BQUwsQ0FBYUosV0FBYixDQUFkO0FBQ0FBLFFBQUFBLFdBQVcsQ0FBQ1ksUUFBWixDQUFxQixLQUFyQjs7QUFDQSxZQUFJVCxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2QsY0FBTVUsUUFBUSxHQUFHWixJQUFJLENBQUNFLEtBQUssR0FBRyxDQUFULENBQXJCOztBQUNBLGNBQUlVLFFBQVEsSUFBSUEsUUFBUSxDQUFDSCxTQUFULENBQW9CQyxRQUFwQixJQUFnQyxDQUFoRCxFQUFtRDtBQUMvQ0UsWUFBQUEsUUFBUSxDQUFDRCxRQUFULENBQWtCLElBQWxCO0FBQ0g7QUFDSjtBQUNKOzs7Ozs7O0FBbkNRYixFQUFBQSxZLENBQ0tHLGEsR0FBK0IsRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRWRpdEJveEltcGwgfSBmcm9tICcuL2VkaXQtYm94LWltcGwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIHRhYkluZGV4VXRpbCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIF90YWJJbmRleExpc3Q6IEVkaXRCb3hJbXBsW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFkZCAoZWRpdEJveEltcGw6IEVkaXRCb3hJbXBsKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuX3RhYkluZGV4TGlzdDtcclxuICAgICAgICBjb25zdCBpbmRleCA9IGxpc3QuaW5kZXhPZihlZGl0Qm94SW1wbCk7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSl7XHJcbiAgICAgICAgICAgIGxpc3QucHVzaChlZGl0Qm94SW1wbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlIChlZGl0Qm94SW1wbDogRWRpdEJveEltcGwpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5fdGFiSW5kZXhMaXN0O1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKGVkaXRCb3hJbXBsKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZXNvcnQgKCkge1xyXG4gICAgICAgIHRoaXMuX3RhYkluZGV4TGlzdC5zb3J0KChhOiBFZGl0Qm94SW1wbCwgYjogRWRpdEJveEltcGwpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGEuX2RlbGVnYXRlIS50YWJJbmRleCAtIGIuX2RlbGVnYXRlIS50YWJJbmRleDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG5leHQgKGVkaXRCb3hJbXBsOiBFZGl0Qm94SW1wbCkge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLl90YWJJbmRleExpc3Q7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBsaXN0LmluZGV4T2YoZWRpdEJveEltcGwpO1xyXG4gICAgICAgIGVkaXRCb3hJbXBsLnNldEZvY3VzKGZhbHNlKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRJbXBsID0gbGlzdFtpbmRleCArIDFdO1xyXG4gICAgICAgICAgICBpZiAobmV4dEltcGwgJiYgbmV4dEltcGwuX2RlbGVnYXRlIS50YWJJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0SW1wbC5zZXRGb2N1cyh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=