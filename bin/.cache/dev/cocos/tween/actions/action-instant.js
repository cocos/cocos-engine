(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./action.js", "../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./action.js"), require("../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.action, global.index);
    global.actionInstant = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _action, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.show = show;
  _exports.hide = hide;
  _exports.toggleVisibility = toggleVisibility;
  _exports.removeSelf = removeSelf;
  _exports.callFunc = callFunc;
  _exports.CallFunc = _exports.RemoveSelf = _exports.ToggleVisibility = _exports.Hide = _exports.Show = _exports.ActionInstant = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * !#en Instant actions are immediate actions. They don't have a duration like the ActionInterval actions.
   * !#zh 即时动作，这种动作立即就会执行，继承自 FiniteTimeAction。
   * @class ActionInstant
   * @extends FiniteTimeAction
   */
  var ActionInstant = /*#__PURE__*/function (_FiniteTimeAction) {
    _inherits(ActionInstant, _FiniteTimeAction);

    function ActionInstant() {
      _classCallCheck(this, ActionInstant);

      return _possibleConstructorReturn(this, _getPrototypeOf(ActionInstant).apply(this, arguments));
    }

    _createClass(ActionInstant, [{
      key: "isDone",
      value: function isDone() {
        return true;
      }
    }, {
      key: "step",
      value: function step(dt) {
        this.update(1);
      }
    }, {
      key: "update",
      value: function update(dt) {} //nothing

      /**
       * returns a reversed action. <br />
       * For example: <br />
       * - The action is x coordinates of 0 move to 100. <br />
       * - The reversed action will be x of 100 move to 0.
       * @returns {Action}
       */

    }, {
      key: "reverse",
      value: function reverse() {
        return this.clone();
      }
    }, {
      key: "clone",
      value: function clone() {
        return new ActionInstant();
      }
    }]);

    return ActionInstant;
  }(_action.FiniteTimeAction);
  /*
   * Show the node.
   * @class Show
   * @extends ActionInstant
   */


  _exports.ActionInstant = ActionInstant;

  var Show = /*#__PURE__*/function (_ActionInstant) {
    _inherits(Show, _ActionInstant);

    function Show() {
      _classCallCheck(this, Show);

      return _possibleConstructorReturn(this, _getPrototypeOf(Show).apply(this, arguments));
    }

    _createClass(Show, [{
      key: "update",
      value: function update(dt) {
        var _renderComps = this.target.getComponentsInChildren(_index.RenderableComponent);

        for (var i = 0; i < _renderComps.length; ++i) {
          var render = _renderComps[i];
          render.enabled = true;
        }
      }
    }, {
      key: "reverse",
      value: function reverse() {
        return new Hide();
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Show();
      }
    }]);

    return Show;
  }(ActionInstant);
  /**
   * !#en Show the Node.
   * !#zh 立即显示。
   * @method show
   * @return {ActionInstant}
   * @example
   * // example
   * var showAction = show();
   */


  _exports.Show = Show;

  function show() {
    return new Show();
  }

  ;
  /*
   * Hide the node.
   * @class Hide
   * @extends ActionInstant
   */

  var Hide = /*#__PURE__*/function (_ActionInstant2) {
    _inherits(Hide, _ActionInstant2);

    function Hide() {
      _classCallCheck(this, Hide);

      return _possibleConstructorReturn(this, _getPrototypeOf(Hide).apply(this, arguments));
    }

    _createClass(Hide, [{
      key: "update",
      value: function update(dt) {
        var _renderComps = this.target.getComponentsInChildren(_index.RenderableComponent);

        for (var i = 0; i < _renderComps.length; ++i) {
          var render = _renderComps[i];
          render.enabled = false;
        }
      }
    }, {
      key: "reverse",
      value: function reverse() {
        return new Show();
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Hide();
      }
    }]);

    return Hide;
  }(ActionInstant);
  /**
   * !#en Hide the node.
   * !#zh 立即隐藏。
   * @method hide
   * @return {ActionInstant}
   * @example
   * // example
   * var hideAction = hide();
   */


  _exports.Hide = Hide;

  function hide() {
    return new Hide();
  }

  ;
  /*
   * Toggles the visibility of a node.
   * @class ToggleVisibility
   * @extends ActionInstant
   */

  var ToggleVisibility = /*#__PURE__*/function (_ActionInstant3) {
    _inherits(ToggleVisibility, _ActionInstant3);

    function ToggleVisibility() {
      _classCallCheck(this, ToggleVisibility);

      return _possibleConstructorReturn(this, _getPrototypeOf(ToggleVisibility).apply(this, arguments));
    }

    _createClass(ToggleVisibility, [{
      key: "update",
      value: function update(dt) {
        var _renderComps = this.target.getComponentsInChildren(_index.RenderableComponent);

        for (var i = 0; i < _renderComps.length; ++i) {
          var render = _renderComps[i];
          render.enabled = !render.enabled;
        }
      }
    }, {
      key: "reverse",
      value: function reverse() {
        return new ToggleVisibility();
      }
    }, {
      key: "clone",
      value: function clone() {
        return new ToggleVisibility();
      }
    }]);

    return ToggleVisibility;
  }(ActionInstant);
  /**
   * !#en Toggles the visibility of a node.
   * !#zh 显隐状态切换。
   * @method toggleVisibility
   * @return {ActionInstant}
   * @example
   * // example
   * var toggleVisibilityAction = toggleVisibility();
   */


  _exports.ToggleVisibility = ToggleVisibility;

  function toggleVisibility() {
    return new ToggleVisibility();
  }

  ;
  /*
   * Delete self in the next frame.
   * @class RemoveSelf
   * @extends ActionInstant
   * @param {Boolean} [isNeedCleanUp=true]
   *
   * @example
   * // example
   * var removeSelfAction = new RemoveSelf(false);
   */

  var RemoveSelf = /*#__PURE__*/function (_ActionInstant4) {
    _inherits(RemoveSelf, _ActionInstant4);

    function RemoveSelf(isNeedCleanUp) {
      var _this;

      _classCallCheck(this, RemoveSelf);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(RemoveSelf).call(this));
      _this._isNeedCleanUp = true;
      isNeedCleanUp !== undefined && _this.init(isNeedCleanUp);
      return _this;
    }

    _createClass(RemoveSelf, [{
      key: "update",
      value: function update(dt) {
        this.target.removeFromParent();

        if (this._isNeedCleanUp) {
          this.target.destroy();
        }
      }
    }, {
      key: "init",
      value: function init(isNeedCleanUp) {
        this._isNeedCleanUp = isNeedCleanUp;
        return true;
      }
    }, {
      key: "reverse",
      value: function reverse() {
        return new RemoveSelf(this._isNeedCleanUp);
      }
    }, {
      key: "clone",
      value: function clone() {
        return new RemoveSelf(this._isNeedCleanUp);
      }
    }]);

    return RemoveSelf;
  }(ActionInstant);
  /**
   * !#en Create a RemoveSelf object with a flag indicate whether the target should be cleaned up while removing.
   * !#zh 从父节点移除自身。
   * @method removeSelf
   * @param {Boolean} [isNeedCleanUp = true]
   * @return {ActionInstant}
   *
   * @example
   * // example
   * var removeSelfAction = removeSelf();
   */


  _exports.RemoveSelf = RemoveSelf;

  function removeSelf(isNeedCleanUp) {
    return new RemoveSelf(isNeedCleanUp);
  }

  ;
  /*
   * Calls a 'callback'.
   * @class CallFunc
   * @extends ActionInstant
   * @param {function} selector
   * @param {object} [selectorTarget=null]
   * @param {*} [data=null] data for function, it accepts all data types.
   * @example
   * // example
   * // CallFunc without data
   * var finish = new CallFunc(this.removeSprite, this);
   *
   * // CallFunc with data
   * var finish = new CallFunc(this.removeFromParentAndCleanup, this,  true);
   */

  var CallFunc = /*#__PURE__*/function (_ActionInstant5) {
    _inherits(CallFunc, _ActionInstant5);

    /*
     * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
    * Creates a CallFunc action with the callback.
    * @param {function} selector
    * @param {object} [selectorTarget=null]
    * @param {*} [data=null] data for function, it accepts all data types.
    */
    function CallFunc(selector, selectorTarget, data) {
      var _this2;

      _classCallCheck(this, CallFunc);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CallFunc).call(this));
      _this2._selectorTarget = null;
      _this2._function = null;
      _this2._data = null;

      _this2.initWithFunction(selector, selectorTarget, data);

      return _this2;
    }
    /*
     * Initializes the action with a function or function and its target
     * @param {function} selector
     * @param {object|Null} selectorTarget
     * @param {*|Null} [data] data for function, it accepts all data types.
     * @return {Boolean}
     */


    _createClass(CallFunc, [{
      key: "initWithFunction",
      value: function initWithFunction(selector, selectorTarget, data) {
        if (selector) {
          this._function = selector;
        }

        if (selectorTarget) {
          this._selectorTarget = selectorTarget;
        }

        if (data !== undefined) {
          this._data = data;
        }

        return true;
      }
      /*
       * execute the function.
       */

    }, {
      key: "execute",
      value: function execute() {
        if (this._function) {
          this._function.call(this._selectorTarget, this.target, this._data);
        }
      }
    }, {
      key: "update",
      value: function update(dt) {
        this.execute();
      }
      /*
       * Get selectorTarget.
       * @return {object}
       */

    }, {
      key: "getTargetCallback",
      value: function getTargetCallback() {
        return this._selectorTarget;
      }
      /*
       * Set selectorTarget.
       * @param {object} sel
       */

    }, {
      key: "setTargetCallback",
      value: function setTargetCallback(sel) {
        if (sel !== this._selectorTarget) {
          if (this._selectorTarget) this._selectorTarget = null;
          this._selectorTarget = sel;
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new CallFunc();
        action.initWithFunction(this._function, this._selectorTarget, this._data);
        return action;
      }
    }]);

    return CallFunc;
  }(ActionInstant);
  /**
   * !#en Creates the action with the callback.
   * !#zh 执行回调函数。
   * @method callFunc
   * @param {function} selector
   * @param {object} [selectorTarget=null]
   * @param {*} [data=null] - data for function, it accepts all data types.
   * @return {ActionInstant}
   * @example
   * // example
   * // CallFunc without data
   * var finish = callFunc(this.removeSprite, this);
   *
   * // CallFunc with data
   * var finish = callFunc(this.removeFromParentAndCleanup, this._grossini,  true);
   */


  _exports.CallFunc = CallFunc;

  function callFunc(selector, selectorTarget, data) {
    return new CallFunc(selector, selectorTarget, data);
  }

  ;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3R3ZWVuL2FjdGlvbnMvYWN0aW9uLWluc3RhbnQudHMiXSwibmFtZXMiOlsiQWN0aW9uSW5zdGFudCIsImR0IiwidXBkYXRlIiwiY2xvbmUiLCJGaW5pdGVUaW1lQWN0aW9uIiwiU2hvdyIsIl9yZW5kZXJDb21wcyIsInRhcmdldCIsImdldENvbXBvbmVudHNJbkNoaWxkcmVuIiwiUmVuZGVyYWJsZUNvbXBvbmVudCIsImkiLCJsZW5ndGgiLCJyZW5kZXIiLCJlbmFibGVkIiwiSGlkZSIsInNob3ciLCJoaWRlIiwiVG9nZ2xlVmlzaWJpbGl0eSIsInRvZ2dsZVZpc2liaWxpdHkiLCJSZW1vdmVTZWxmIiwiaXNOZWVkQ2xlYW5VcCIsIl9pc05lZWRDbGVhblVwIiwidW5kZWZpbmVkIiwiaW5pdCIsInJlbW92ZUZyb21QYXJlbnQiLCJkZXN0cm95IiwicmVtb3ZlU2VsZiIsIkNhbGxGdW5jIiwic2VsZWN0b3IiLCJzZWxlY3RvclRhcmdldCIsImRhdGEiLCJfc2VsZWN0b3JUYXJnZXQiLCJfZnVuY3Rpb24iLCJfZGF0YSIsImluaXRXaXRoRnVuY3Rpb24iLCJjYWxsIiwiZXhlY3V0ZSIsInNlbCIsImFjdGlvbiIsImNhbGxGdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBOzs7Ozs7TUFNYUEsYTs7Ozs7Ozs7Ozs7K0JBRUM7QUFDTixlQUFPLElBQVA7QUFDSDs7OzJCQUVLQyxFLEVBQVM7QUFDWCxhQUFLQyxNQUFMLENBQVksQ0FBWjtBQUNIOzs7NkJBRU9ELEUsRUFBWSxDQUVuQixDLENBREc7O0FBR0o7Ozs7Ozs7Ozs7Z0NBT21CO0FBQ2YsZUFBTyxLQUFLRSxLQUFMLEVBQVA7QUFDSDs7OzhCQUVRO0FBQ0wsZUFBTyxJQUFJSCxhQUFKLEVBQVA7QUFDSDs7OztJQTNCOEJJLHdCO0FBOEJuQzs7Ozs7Ozs7O01BS2FDLEk7Ozs7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QUtMLGVBQVo7QUFDSDtBQUVEOzs7Ozs7O3dDQUltQk0sRyxFQUFVO0FBQ3pCLFlBQUlBLEdBQUcsS0FBSyxLQUFLTixlQUFqQixFQUFrQztBQUM5QixjQUFJLEtBQUtBLGVBQVQsRUFDSSxLQUFLQSxlQUFMLEdBQXVCLElBQXZCO0FBQ0osZUFBS0EsZUFBTCxHQUF1Qk0sR0FBdkI7QUFDSDtBQUNKOzs7OEJBRVE7QUFDTCxZQUFJQyxNQUFNLEdBQUcsSUFBSVgsUUFBSixFQUFiO0FBQ0FXLFFBQUFBLE1BQU0sQ0FBQ0osZ0JBQVAsQ0FBd0IsS0FBS0YsU0FBN0IsRUFBd0MsS0FBS0QsZUFBN0MsRUFBOEQsS0FBS0UsS0FBbkU7QUFDQSxlQUFPSyxNQUFQO0FBQ0g7Ozs7SUEzRXlCdEMsYTtBQThFOUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JPLFdBQVN1QyxRQUFULENBQW1CWCxRQUFuQixFQUF1Q0MsY0FBdkMsRUFBNkRDLElBQTdELEVBQXdGO0FBQzNGLFdBQU8sSUFBSUgsUUFBSixDQUFhQyxRQUFiLEVBQXVCQyxjQUF2QixFQUF1Q0MsSUFBdkMsQ0FBUDtBQUNIOztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxyXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRmluaXRlVGltZUFjdGlvbiwgQWN0aW9uIH0gZnJvbSBcIi4vYWN0aW9uXCI7XHJcbmltcG9ydCB7IFJlbmRlcmFibGVDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29yZVwiO1xyXG5cclxuLyoqXHJcbiAqICEjZW4gSW5zdGFudCBhY3Rpb25zIGFyZSBpbW1lZGlhdGUgYWN0aW9ucy4gVGhleSBkb24ndCBoYXZlIGEgZHVyYXRpb24gbGlrZSB0aGUgQWN0aW9uSW50ZXJ2YWwgYWN0aW9ucy5cclxuICogISN6aCDljbPml7bliqjkvZzvvIzov5nnp43liqjkvZznq4vljbPlsLHkvJrmiafooYzvvIznu6fmib/oh6ogRmluaXRlVGltZUFjdGlvbuOAglxyXG4gKiBAY2xhc3MgQWN0aW9uSW5zdGFudFxyXG4gKiBAZXh0ZW5kcyBGaW5pdGVUaW1lQWN0aW9uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQWN0aW9uSW5zdGFudCBleHRlbmRzIEZpbml0ZVRpbWVBY3Rpb24ge1xyXG5cclxuICAgIGlzRG9uZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCAoZHQ6IGFueSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vbm90aGluZ1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJucyBhIHJldmVyc2VkIGFjdGlvbi4gPGJyIC8+XHJcbiAgICAgKiBGb3IgZXhhbXBsZTogPGJyIC8+XHJcbiAgICAgKiAtIFRoZSBhY3Rpb24gaXMgeCBjb29yZGluYXRlcyBvZiAwIG1vdmUgdG8gMTAwLiA8YnIgLz5cclxuICAgICAqIC0gVGhlIHJldmVyc2VkIGFjdGlvbiB3aWxsIGJlIHggb2YgMTAwIG1vdmUgdG8gMC5cclxuICAgICAqIEByZXR1cm5zIHtBY3Rpb259XHJcbiAgICAgKi9cclxuICAgIHJldmVyc2UgKCk6IEFjdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9uZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpb25JbnN0YW50KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqIFNob3cgdGhlIG5vZGUuXHJcbiAqIEBjbGFzcyBTaG93XHJcbiAqIEBleHRlbmRzIEFjdGlvbkluc3RhbnRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTaG93IGV4dGVuZHMgQWN0aW9uSW5zdGFudCB7XHJcbiAgICB1cGRhdGUgKGR0OiBhbnkpIHtcclxuICAgICAgICB2YXIgX3JlbmRlckNvbXBzID0gdGhpcy50YXJnZXQhLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKFJlbmRlcmFibGVDb21wb25lbnQpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3JlbmRlckNvbXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXIgPSBfcmVuZGVyQ29tcHNbaV07XHJcbiAgICAgICAgICAgIHJlbmRlci5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBIaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2hvdygpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogISNlbiBTaG93IHRoZSBOb2RlLlxyXG4gKiAhI3poIOeri+WNs+aYvuekuuOAglxyXG4gKiBAbWV0aG9kIHNob3dcclxuICogQHJldHVybiB7QWN0aW9uSW5zdGFudH1cclxuICogQGV4YW1wbGVcclxuICogLy8gZXhhbXBsZVxyXG4gKiB2YXIgc2hvd0FjdGlvbiA9IHNob3coKTtcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG93ICgpOiBBY3Rpb25JbnN0YW50IHtcclxuICAgIHJldHVybiBuZXcgU2hvdygpO1xyXG59O1xyXG5cclxuLypcclxuICogSGlkZSB0aGUgbm9kZS5cclxuICogQGNsYXNzIEhpZGVcclxuICogQGV4dGVuZHMgQWN0aW9uSW5zdGFudFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEhpZGUgZXh0ZW5kcyBBY3Rpb25JbnN0YW50IHtcclxuXHJcbiAgICB1cGRhdGUgKGR0OiBhbnkpIHtcclxuICAgICAgICB2YXIgX3JlbmRlckNvbXBzID0gdGhpcy50YXJnZXQhLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKFJlbmRlcmFibGVDb21wb25lbnQpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3JlbmRlckNvbXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXIgPSBfcmVuZGVyQ29tcHNbaV07XHJcbiAgICAgICAgICAgIHJlbmRlci5lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEhpZGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqICEjZW4gSGlkZSB0aGUgbm9kZS5cclxuICogISN6aCDnq4vljbPpmpDol4/jgIJcclxuICogQG1ldGhvZCBoaWRlXHJcbiAqIEByZXR1cm4ge0FjdGlvbkluc3RhbnR9XHJcbiAqIEBleGFtcGxlXHJcbiAqIC8vIGV4YW1wbGVcclxuICogdmFyIGhpZGVBY3Rpb24gPSBoaWRlKCk7XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGlkZSAoKTogQWN0aW9uSW5zdGFudCB7XHJcbiAgICByZXR1cm4gbmV3IEhpZGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFRvZ2dsZXMgdGhlIHZpc2liaWxpdHkgb2YgYSBub2RlLlxyXG4gKiBAY2xhc3MgVG9nZ2xlVmlzaWJpbGl0eVxyXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnN0YW50XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVG9nZ2xlVmlzaWJpbGl0eSBleHRlbmRzIEFjdGlvbkluc3RhbnQge1xyXG5cclxuICAgIHVwZGF0ZSAoZHQ6IGFueSkge1xyXG4gICAgICAgIHZhciBfcmVuZGVyQ29tcHMgPSB0aGlzLnRhcmdldCEuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oUmVuZGVyYWJsZUNvbXBvbmVudCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfcmVuZGVyQ29tcHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHJlbmRlciA9IF9yZW5kZXJDb21wc1tpXTtcclxuICAgICAgICAgICAgcmVuZGVyLmVuYWJsZWQgPSAhcmVuZGVyLmVuYWJsZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVG9nZ2xlVmlzaWJpbGl0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFRvZ2dsZVZpc2liaWxpdHkoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqICEjZW4gVG9nZ2xlcyB0aGUgdmlzaWJpbGl0eSBvZiBhIG5vZGUuXHJcbiAqICEjemgg5pi+6ZqQ54q25oCB5YiH5o2i44CCXHJcbiAqIEBtZXRob2QgdG9nZ2xlVmlzaWJpbGl0eVxyXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnN0YW50fVxyXG4gKiBAZXhhbXBsZVxyXG4gKiAvLyBleGFtcGxlXHJcbiAqIHZhciB0b2dnbGVWaXNpYmlsaXR5QWN0aW9uID0gdG9nZ2xlVmlzaWJpbGl0eSgpO1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZVZpc2liaWxpdHkgKCk6IEFjdGlvbkluc3RhbnQge1xyXG4gICAgcmV0dXJuIG5ldyBUb2dnbGVWaXNpYmlsaXR5KCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBEZWxldGUgc2VsZiBpbiB0aGUgbmV4dCBmcmFtZS5cclxuICogQGNsYXNzIFJlbW92ZVNlbGZcclxuICogQGV4dGVuZHMgQWN0aW9uSW5zdGFudFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpc05lZWRDbGVhblVwPXRydWVdXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIC8vIGV4YW1wbGVcclxuICogdmFyIHJlbW92ZVNlbGZBY3Rpb24gPSBuZXcgUmVtb3ZlU2VsZihmYWxzZSk7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVtb3ZlU2VsZiBleHRlbmRzIEFjdGlvbkluc3RhbnQge1xyXG4gICAgcHJvdGVjdGVkIF9pc05lZWRDbGVhblVwID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoaXNOZWVkQ2xlYW5VcD86IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlzTmVlZENsZWFuVXAgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXQoaXNOZWVkQ2xlYW5VcCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlIChkdDogYW55KSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQhLnJlbW92ZUZyb21QYXJlbnQoKTtcclxuICAgICAgICBpZiAodGhpcy5faXNOZWVkQ2xlYW5VcCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldCEuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0IChpc05lZWRDbGVhblVwOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9pc05lZWRDbGVhblVwID0gaXNOZWVkQ2xlYW5VcDtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXZlcnNlICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFJlbW92ZVNlbGYodGhpcy5faXNOZWVkQ2xlYW5VcCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVtb3ZlU2VsZih0aGlzLl9pc05lZWRDbGVhblVwKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqICEjZW4gQ3JlYXRlIGEgUmVtb3ZlU2VsZiBvYmplY3Qgd2l0aCBhIGZsYWcgaW5kaWNhdGUgd2hldGhlciB0aGUgdGFyZ2V0IHNob3VsZCBiZSBjbGVhbmVkIHVwIHdoaWxlIHJlbW92aW5nLlxyXG4gKiAhI3poIOS7jueItuiKgueCueenu+mZpOiHqui6q+OAglxyXG4gKiBAbWV0aG9kIHJlbW92ZVNlbGZcclxuICogQHBhcmFtIHtCb29sZWFufSBbaXNOZWVkQ2xlYW5VcCA9IHRydWVdXHJcbiAqIEByZXR1cm4ge0FjdGlvbkluc3RhbnR9XHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIC8vIGV4YW1wbGVcclxuICogdmFyIHJlbW92ZVNlbGZBY3Rpb24gPSByZW1vdmVTZWxmKCk7XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlU2VsZiAoaXNOZWVkQ2xlYW5VcDogYm9vbGVhbik6IEFjdGlvbkluc3RhbnQge1xyXG4gICAgcmV0dXJuIG5ldyBSZW1vdmVTZWxmKGlzTmVlZENsZWFuVXApO1xyXG59O1xyXG5cclxuLypcclxuICogQ2FsbHMgYSAnY2FsbGJhY2snLlxyXG4gKiBAY2xhc3MgQ2FsbEZ1bmNcclxuICogQGV4dGVuZHMgQWN0aW9uSW5zdGFudFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzZWxlY3RvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gW3NlbGVjdG9yVGFyZ2V0PW51bGxdXHJcbiAqIEBwYXJhbSB7Kn0gW2RhdGE9bnVsbF0gZGF0YSBmb3IgZnVuY3Rpb24sIGl0IGFjY2VwdHMgYWxsIGRhdGEgdHlwZXMuXHJcbiAqIEBleGFtcGxlXHJcbiAqIC8vIGV4YW1wbGVcclxuICogLy8gQ2FsbEZ1bmMgd2l0aG91dCBkYXRhXHJcbiAqIHZhciBmaW5pc2ggPSBuZXcgQ2FsbEZ1bmModGhpcy5yZW1vdmVTcHJpdGUsIHRoaXMpO1xyXG4gKlxyXG4gKiAvLyBDYWxsRnVuYyB3aXRoIGRhdGFcclxuICogdmFyIGZpbmlzaCA9IG5ldyBDYWxsRnVuYyh0aGlzLnJlbW92ZUZyb21QYXJlbnRBbmRDbGVhbnVwLCB0aGlzLCAgdHJ1ZSk7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FsbEZ1bmMgZXh0ZW5kcyBBY3Rpb25JbnN0YW50IHtcclxuXHJcbiAgICBwcml2YXRlIF9zZWxlY3RvclRhcmdldCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9mdW5jdGlvbjogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2RhdGEgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBDb25zdHJ1Y3RvciBmdW5jdGlvbiwgb3ZlcnJpZGUgaXQgdG8gZXh0ZW5kIHRoZSBjb25zdHJ1Y3Rpb24gYmVoYXZpb3IsIHJlbWVtYmVyIHRvIGNhbGwgXCJ0aGlzLl9zdXBlcigpXCIgaW4gdGhlIGV4dGVuZGVkIFwiY3RvclwiIGZ1bmN0aW9uLiA8YnIgLz5cclxuXHQgKiBDcmVhdGVzIGEgQ2FsbEZ1bmMgYWN0aW9uIHdpdGggdGhlIGNhbGxiYWNrLlxyXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IHNlbGVjdG9yXHJcblx0ICogQHBhcmFtIHtvYmplY3R9IFtzZWxlY3RvclRhcmdldD1udWxsXVxyXG5cdCAqIEBwYXJhbSB7Kn0gW2RhdGE9bnVsbF0gZGF0YSBmb3IgZnVuY3Rpb24sIGl0IGFjY2VwdHMgYWxsIGRhdGEgdHlwZXMuXHJcblx0ICovXHJcbiAgICBjb25zdHJ1Y3RvciAoc2VsZWN0b3I/OiBGdW5jdGlvbiwgc2VsZWN0b3JUYXJnZXQ/OiBhbnksIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdFdpdGhGdW5jdGlvbihzZWxlY3Rvciwgc2VsZWN0b3JUYXJnZXQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uIHdpdGggYSBmdW5jdGlvbiBvciBmdW5jdGlvbiBhbmQgaXRzIHRhcmdldFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gc2VsZWN0b3JcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fE51bGx9IHNlbGVjdG9yVGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0geyp8TnVsbH0gW2RhdGFdIGRhdGEgZm9yIGZ1bmN0aW9uLCBpdCBhY2NlcHRzIGFsbCBkYXRhIHR5cGVzLlxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgaW5pdFdpdGhGdW5jdGlvbiAoc2VsZWN0b3I6IGFueSwgc2VsZWN0b3JUYXJnZXQ/OiBhbnksIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fZnVuY3Rpb24gPSBzZWxlY3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdG9yVGFyZ2V0ID0gc2VsZWN0b3JUYXJnZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBleGVjdXRlIHRoZSBmdW5jdGlvbi5cclxuICAgICAqL1xyXG4gICAgZXhlY3V0ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Z1bmN0aW9uLmNhbGwodGhpcy5fc2VsZWN0b3JUYXJnZXQsIHRoaXMudGFyZ2V0LCB0aGlzLl9kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlIChkdDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5leGVjdXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdldCBzZWxlY3RvclRhcmdldC5cclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqL1xyXG4gICAgZ2V0VGFyZ2V0Q2FsbGJhY2sgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RvclRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU2V0IHNlbGVjdG9yVGFyZ2V0LlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHNlbFxyXG4gICAgICovXHJcbiAgICBzZXRUYXJnZXRDYWxsYmFjayAoc2VsOiBhbnkpIHtcclxuICAgICAgICBpZiAoc2VsICE9PSB0aGlzLl9zZWxlY3RvclRhcmdldCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2VsZWN0b3JUYXJnZXQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RvclRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdG9yVGFyZ2V0ID0gc2VsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbG9uZSAoKSB7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBDYWxsRnVuYygpO1xyXG4gICAgICAgIGFjdGlvbi5pbml0V2l0aEZ1bmN0aW9uKHRoaXMuX2Z1bmN0aW9uLCB0aGlzLl9zZWxlY3RvclRhcmdldCwgdGhpcy5fZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqICEjZW4gQ3JlYXRlcyB0aGUgYWN0aW9uIHdpdGggdGhlIGNhbGxiYWNrLlxyXG4gKiAhI3poIOaJp+ihjOWbnuiwg+WHveaVsOOAglxyXG4gKiBAbWV0aG9kIGNhbGxGdW5jXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbc2VsZWN0b3JUYXJnZXQ9bnVsbF1cclxuICogQHBhcmFtIHsqfSBbZGF0YT1udWxsXSAtIGRhdGEgZm9yIGZ1bmN0aW9uLCBpdCBhY2NlcHRzIGFsbCBkYXRhIHR5cGVzLlxyXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnN0YW50fVxyXG4gKiBAZXhhbXBsZVxyXG4gKiAvLyBleGFtcGxlXHJcbiAqIC8vIENhbGxGdW5jIHdpdGhvdXQgZGF0YVxyXG4gKiB2YXIgZmluaXNoID0gY2FsbEZ1bmModGhpcy5yZW1vdmVTcHJpdGUsIHRoaXMpO1xyXG4gKlxyXG4gKiAvLyBDYWxsRnVuYyB3aXRoIGRhdGFcclxuICogdmFyIGZpbmlzaCA9IGNhbGxGdW5jKHRoaXMucmVtb3ZlRnJvbVBhcmVudEFuZENsZWFudXAsIHRoaXMuX2dyb3NzaW5pLCAgdHJ1ZSk7XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2FsbEZ1bmMgKHNlbGVjdG9yOiBGdW5jdGlvbiwgc2VsZWN0b3JUYXJnZXQ/OiBhbnksIGRhdGE/OiBhbnkpOiBBY3Rpb25JbnN0YW50IHtcclxuICAgIHJldHVybiBuZXcgQ2FsbEZ1bmMoc2VsZWN0b3IsIHNlbGVjdG9yVGFyZ2V0LCBkYXRhKTtcclxufTtcclxuIl19