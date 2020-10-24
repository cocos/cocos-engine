(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../framework/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../framework/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.builtinObject = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BuiltinObject = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var BuiltinObject = /*#__PURE__*/function () {
    function BuiltinObject() {
      _classCallCheck(this, BuiltinObject);

      this.collisionFilterGroup = _index.PhysicsSystem.PhysicsGroup.DEFAULT;
      this.collisionFilterMask = -1;
    }

    _createClass(BuiltinObject, [{
      key: "getGroup",

      /** group */
      value: function getGroup() {
        return this.collisionFilterGroup;
      }
    }, {
      key: "setGroup",
      value: function setGroup(v) {
        this.collisionFilterGroup = v;
      }
    }, {
      key: "addGroup",
      value: function addGroup(v) {
        this.collisionFilterGroup |= v;
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(v) {
        this.collisionFilterGroup &= ~v;
      }
      /** mask */

    }, {
      key: "getMask",
      value: function getMask() {
        return this.collisionFilterMask;
      }
    }, {
      key: "setMask",
      value: function setMask(v) {
        this.collisionFilterMask = v;
      }
    }, {
      key: "addMask",
      value: function addMask(v) {
        this.collisionFilterMask |= v;
      }
    }, {
      key: "removeMask",
      value: function removeMask(v) {
        this.collisionFilterMask &= ~v;
      }
    }]);

    return BuiltinObject;
  }();

  _exports.BuiltinObject = BuiltinObject;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3Mvb2JqZWN0L2J1aWx0aW4tb2JqZWN0LnRzIl0sIm5hbWVzIjpbIkJ1aWx0aW5PYmplY3QiLCJjb2xsaXNpb25GaWx0ZXJHcm91cCIsIlBoeXNpY3NTeXN0ZW0iLCJQaHlzaWNzR3JvdXAiLCJERUZBVUxUIiwiY29sbGlzaW9uRmlsdGVyTWFzayIsInYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BTWFBLGE7Ozs7V0FFRkMsb0IsR0FBK0JDLHFCQUFjQyxZQUFkLENBQTJCQyxPO1dBRTFEQyxtQixHQUE4QixDQUFDLEM7Ozs7OztBQUV0QztpQ0FDMkI7QUFDdkIsZUFBTyxLQUFLSixvQkFBWjtBQUNIOzs7K0JBRWdCSyxDLEVBQWlCO0FBQzlCLGFBQUtMLG9CQUFMLEdBQTRCSyxDQUE1QjtBQUNIOzs7K0JBRWdCQSxDLEVBQWlCO0FBQzlCLGFBQUtMLG9CQUFMLElBQTZCSyxDQUE3QjtBQUNIOzs7a0NBRW1CQSxDLEVBQWlCO0FBQ2pDLGFBQUtMLG9CQUFMLElBQTZCLENBQUNLLENBQTlCO0FBQ0g7QUFFRDs7OztnQ0FDMEI7QUFDdEIsZUFBTyxLQUFLRCxtQkFBWjtBQUNIOzs7OEJBRWVDLEMsRUFBaUI7QUFDN0IsYUFBS0QsbUJBQUwsR0FBMkJDLENBQTNCO0FBQ0g7Ozs4QkFFZUEsQyxFQUFpQjtBQUM3QixhQUFLRCxtQkFBTCxJQUE0QkMsQ0FBNUI7QUFDSDs7O2lDQUVrQkEsQyxFQUFpQjtBQUNoQyxhQUFLRCxtQkFBTCxJQUE0QixDQUFDQyxDQUE3QjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBQaHlzaWNzU3lzdGVtIH0gZnJvbSBcIi4uLy4uL2ZyYW1ld29ya1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1aWx0aW5PYmplY3Qge1xyXG5cclxuICAgIHB1YmxpYyBjb2xsaXNpb25GaWx0ZXJHcm91cDogbnVtYmVyID0gUGh5c2ljc1N5c3RlbS5QaHlzaWNzR3JvdXAuREVGQVVMVDtcclxuXHJcbiAgICBwdWJsaWMgY29sbGlzaW9uRmlsdGVyTWFzazogbnVtYmVyID0gLTE7XHJcblxyXG4gICAgLyoqIGdyb3VwICovXHJcbiAgICBwdWJsaWMgZ2V0R3JvdXAgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGlzaW9uRmlsdGVyR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbGxpc2lvbkZpbHRlckdyb3VwID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkR3JvdXAgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29sbGlzaW9uRmlsdGVyR3JvdXAgfD0gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlR3JvdXAgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29sbGlzaW9uRmlsdGVyR3JvdXAgJj0gfnY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIG1hc2sgKi9cclxuICAgIHB1YmxpYyBnZXRNYXNrICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxpc2lvbkZpbHRlck1hc2s7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29sbGlzaW9uRmlsdGVyTWFzayA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29sbGlzaW9uRmlsdGVyTWFzayB8PSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVNYXNrICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbGxpc2lvbkZpbHRlck1hc2sgJj0gfnY7XHJcbiAgICB9XHJcbn1cclxuIl19