(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./actions/action-instant.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./actions/action-instant.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.actionInstant);
    global.setAction = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _actionInstant) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SetAction = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var SetAction = /*#__PURE__*/function (_ActionInstant) {
    _inherits(SetAction, _ActionInstant);

    function SetAction(props) {
      var _this;

      _classCallCheck(this, SetAction);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SetAction).call(this));
      _this._props = void 0;
      _this._props = {};
      props !== undefined && _this.init(props);
      return _this;
    }

    _createClass(SetAction, [{
      key: "init",
      value: function init(props) {
        for (var name in props) {
          this._props[name] = props[name];
        }

        return true;
      }
    }, {
      key: "update",
      value: function update() {
        var props = this._props;
        var target = this.target;

        for (var name in props) {
          target[name] = props[name];
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new SetAction();
        action.init(this._props);
        return action;
      }
    }]);

    return SetAction;
  }(_actionInstant.ActionInstant);

  _exports.SetAction = SetAction;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3R3ZWVuL3NldC1hY3Rpb24udHMiXSwibmFtZXMiOlsiU2V0QWN0aW9uIiwicHJvcHMiLCJfcHJvcHMiLCJ1bmRlZmluZWQiLCJpbml0IiwibmFtZSIsInRhcmdldCIsImFjdGlvbiIsIkFjdGlvbkluc3RhbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BTWFBLFM7OztBQUlULHVCQUFhQyxLQUFiLEVBQTBCO0FBQUE7O0FBQUE7O0FBQ3RCO0FBRHNCLFlBRmxCQyxNQUVrQjtBQUV0QixZQUFLQSxNQUFMLEdBQWMsRUFBZDtBQUNBRCxNQUFBQSxLQUFLLEtBQUtFLFNBQVYsSUFBdUIsTUFBS0MsSUFBTCxDQUFVSCxLQUFWLENBQXZCO0FBSHNCO0FBSXpCOzs7OzJCQUVLQSxLLEVBQU87QUFDVCxhQUFLLElBQUlJLElBQVQsSUFBaUJKLEtBQWpCLEVBQXdCO0FBQ3BCLGVBQUtDLE1BQUwsQ0FBWUcsSUFBWixJQUFvQkosS0FBSyxDQUFDSSxJQUFELENBQXpCO0FBQ0g7O0FBQ0QsZUFBTyxJQUFQO0FBQ0g7OzsrQkFFUztBQUNOLFlBQUlKLEtBQUssR0FBRyxLQUFLQyxNQUFqQjtBQUNBLFlBQUlJLE1BQU0sR0FBRyxLQUFLQSxNQUFsQjs7QUFDQSxhQUFLLElBQUlELElBQVQsSUFBaUJKLEtBQWpCLEVBQXdCO0FBQ3BCSyxVQUFBQSxNQUFNLENBQUVELElBQUYsQ0FBTixHQUFnQkosS0FBSyxDQUFDSSxJQUFELENBQXJCO0FBQ0g7QUFDSjs7OzhCQUVRO0FBQ0wsWUFBSUUsTUFBTSxHQUFHLElBQUlQLFNBQUosRUFBYjtBQUNBTyxRQUFBQSxNQUFNLENBQUNILElBQVAsQ0FBWSxLQUFLRixNQUFqQjtBQUNBLGVBQU9LLE1BQVA7QUFDSDs7OztJQTdCMEJDLDRCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBBY3Rpb25JbnN0YW50fSBmcm9tICcuL2FjdGlvbnMvYWN0aW9uLWluc3RhbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldEFjdGlvbiBleHRlbmRzIEFjdGlvbkluc3RhbnQge1xyXG5cclxuICAgIHByaXZhdGUgX3Byb3BzOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHByb3BzPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9wcm9wcyA9IHt9O1xyXG4gICAgICAgIHByb3BzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0KHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0IChwcm9wcykge1xyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gcHJvcHMpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJvcHNbbmFtZV0gPSBwcm9wc1tuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlICgpIHtcclxuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLl9wcm9wcztcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBwcm9wcykge1xyXG4gICAgICAgICAgICB0YXJnZXQhW25hbWVdID0gcHJvcHNbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsb25lICgpIHtcclxuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IFNldEFjdGlvbigpO1xyXG4gICAgICAgIGFjdGlvbi5pbml0KHRoaXMuX3Byb3BzKTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uO1xyXG4gICAgfVxyXG59Il19