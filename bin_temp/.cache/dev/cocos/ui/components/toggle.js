(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/component-event-handler.js", "../../core/components/ui-base/index.js", "../../core/data/decorators/index.js", "./button.js", "./sprite.js", "../../core/data/utils/extends-enum.js", "../../core/default-constants.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/component-event-handler.js"), require("../../core/components/ui-base/index.js"), require("../../core/data/decorators/index.js"), require("./button.js"), require("./sprite.js"), require("../../core/data/utils/extends-enum.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.componentEventHandler, global.index, global.index, global.button, global.sprite, global.extendsEnum, global.defaultConstants, global.globalExports);
    global.toggle = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _componentEventHandler, _index, _index2, _button, _sprite, _extendsEnum, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Toggle = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var EventType;
  /**
   * @en
   * The toggle component is a CheckBox, when it used together with a ToggleGroup,
   * it could be treated as a RadioButton.
   *
   * @zh
   * Toggle 是一个 CheckBox，当它和 ToggleGroup 一起使用的时候，可以变成 RadioButton。
   */

  (function (EventType) {
    EventType["TOGGLE"] = "toggle";
  })(EventType || (EventType = {}));

  var Toggle = (_dec = (0, _index2.ccclass)('cc.Toggle'), _dec2 = (0, _index2.help)('i18n:cc.Toggle'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/Toggle'), _dec5 = (0, _index2.requireComponent)(_index.UITransform), _dec6 = (0, _index2.displayOrder)(2), _dec7 = (0, _index2.tooltip)('如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。'), _dec8 = (0, _index2.type)(_sprite.Sprite), _dec9 = (0, _index2.displayOrder)(3), _dec10 = (0, _index2.tooltip)('Toggle 处于选中状态时显示的精灵图片'), _dec11 = (0, _index2.type)([_componentEventHandler.EventHandler]), _dec12 = (0, _index2.tooltip)('列表类型，默认为空，用户添加的每一个事件由节点引用，组件名称和一个响应函数组成'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Button) {
    _inherits(Toggle, _Button);

    function Toggle() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Toggle);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Toggle)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "checkEvents", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isChecked", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_checkMark", _descriptor3, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(Toggle, [{
      key: "_internalToggle",
      value: function _internalToggle() {
        this.isChecked = !this.isChecked;
      }
    }, {
      key: "_set",
      value: function _set(value) {
        var emitEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (this._isChecked == value) return;
        this._isChecked = value;
        var group = this._toggleContainer;

        if (group && group.enabled && this.enabled) {
          if (value || !group.anyTogglesChecked() && !group.allowSwitchOff) {
            this._isChecked = true;
            group.notifyToggleCheck(this, emitEvent);
          }
        }

        this.playEffect();

        if (emitEvent) {
          this._emitToggleEvents();
        }
      } //

    }, {
      key: "playEffect",
      value: function playEffect() {
        if (this._checkMark) {
          this._checkMark.node.active = this._isChecked;
        }
      }
      /**
       * @en
       * Set isChecked without invoking checkEvents.
       *
       * @zh
       * 设置 isChecked 而不调用 checkEvents 回调。
       *
       * @param value - 是否被按下
       */

    }, {
      key: "setIsCheckedWithoutNotify",
      value: function setIsCheckedWithoutNotify(value) {
        this._set(value, false);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        _get(_getPrototypeOf(Toggle.prototype), "onEnable", this).call(this);

        this.playEffect();

        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this.node.on(Toggle.EventType.CLICK, this._internalToggle, this);
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        _get(_getPrototypeOf(Toggle.prototype), "onDisable", this).call(this);

        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this.node.off(Toggle.EventType.CLICK, this._internalToggle, this);
        }
      }
    }, {
      key: "OnDestroy",
      value: function OnDestroy() {
        var group = this._toggleContainer;

        if (group) {
          group.ensureValidState();
        }
      }
    }, {
      key: "_emitToggleEvents",
      value: function _emitToggleEvents() {
        this.node.emit(Toggle.EventType.TOGGLE, this);

        if (this.checkEvents) {
          _componentEventHandler.EventHandler.emitEvents(this.checkEvents, this);
        }
      }
    }, {
      key: "isChecked",

      /**
       * @en
       * When this value is true, the check mark component will be enabled,
       * otherwise the check mark component will be disabled.
       *
       * @zh
       * 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
       */
      get: function get() {
        return this._isChecked;
      },
      set: function set(value) {
        this._set(value);
      }
      /**
       * @en
       * The image used for the checkmark.
       *
       * @zh
       * Toggle 处于选中状态时显示的图片。
       */

    }, {
      key: "checkMark",
      get: function get() {
        return this._checkMark;
      },
      set: function set(value) {
        if (this._checkMark === value) {
          return;
        }

        this._checkMark = value;
      }
    }, {
      key: "_resizeToTarget",
      set: function set(value) {
        if (value) {
          this._resizeNodeToTargetNode();
        }
      }
    }, {
      key: "_toggleContainer",
      get: function get() {
        var parent = this.node.parent;

        if (_globalExports.legacyCC.Node.isNode(parent)) {
          return parent.getComponent('cc.ToggleContainer');
        }

        return null;
      }
    }]);

    return Toggle;
  }(_button.Button), _class3.EventType = (0, _extendsEnum.extendsEnum)(EventType, _button.EventType), _temp), (_applyDecoratedDescriptor(_class2.prototype, "isChecked", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "isChecked"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "checkMark", [_dec8, _dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "checkMark"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "checkEvents", [_dec11, _index2.serializable, _dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_isChecked", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_checkMark", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   *
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event toggle
   * @param {Event.EventCustom} event
   * @param {Toggle} toggle - The Toggle component.
   */

  _exports.Toggle = Toggle;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbIkV2ZW50VHlwZSIsIlRvZ2dsZSIsIlVJVHJhbnNmb3JtIiwiU3ByaXRlIiwiQ29tcG9uZW50RXZlbnRIYW5kbGVyIiwiaXNDaGVja2VkIiwidmFsdWUiLCJlbWl0RXZlbnQiLCJfaXNDaGVja2VkIiwiZ3JvdXAiLCJfdG9nZ2xlQ29udGFpbmVyIiwiZW5hYmxlZCIsImFueVRvZ2dsZXNDaGVja2VkIiwiYWxsb3dTd2l0Y2hPZmYiLCJub3RpZnlUb2dnbGVDaGVjayIsInBsYXlFZmZlY3QiLCJfZW1pdFRvZ2dsZUV2ZW50cyIsIl9jaGVja01hcmsiLCJub2RlIiwiYWN0aXZlIiwiX3NldCIsIkVESVRPUiIsImxlZ2FjeUNDIiwiR0FNRV9WSUVXIiwib24iLCJDTElDSyIsIl9pbnRlcm5hbFRvZ2dsZSIsIm9mZiIsImVuc3VyZVZhbGlkU3RhdGUiLCJlbWl0IiwiVE9HR0xFIiwiY2hlY2tFdmVudHMiLCJlbWl0RXZlbnRzIiwiX3Jlc2l6ZU5vZGVUb1RhcmdldE5vZGUiLCJwYXJlbnQiLCJOb2RlIiwiaXNOb2RlIiwiZ2V0Q29tcG9uZW50IiwiQnV0dG9uIiwiQnV0dG9uRXZlbnRUeXBlIiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXlDS0EsUztBQUlMOzs7Ozs7Ozs7YUFKS0EsUztBQUFBQSxJQUFBQSxTO0tBQUFBLFMsS0FBQUEsUzs7TUFpQlFDLE0sV0FMWixxQkFBUSxXQUFSLEMsVUFDQSxrQkFBSyxnQkFBTCxDLFVBQ0EsNEJBQWUsR0FBZixDLFVBQ0Esa0JBQUssV0FBTCxDLFVBQ0EsOEJBQWlCQyxrQkFBakIsQyxVQVdJLDBCQUFhLENBQWIsQyxVQUNBLHFCQUFRLDhEQUFSLEMsVUFnQkEsa0JBQUtDLGNBQUwsQyxVQUNBLDBC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QUFMLENBQVVnQixNQUF6Qjs7QUFDQSxZQUFJWix3QkFBU2EsSUFBVCxDQUFjQyxNQUFkLENBQXFCRixNQUFyQixDQUFKLEVBQWtDO0FBQzlCLGlCQUFPQSxNQUFNLENBQUNHLFlBQVAsQ0FBb0Isb0JBQXBCLENBQVA7QUFDSDs7QUFDRCxlQUFPLElBQVA7QUFDSDs7OztJQXREdUJDLGMsV0F3RFZ0QyxTLEdBQVksOEJBQVlBLFNBQVosRUFBdUJ1QyxpQkFBdkIsQyxvYUFVekJDLG9COzs7OzthQUU2QyxFOztpRkFDN0NBLG9COzs7OzthQUMrQixJOztpRkFDL0JBLG9COzs7OzthQUNxQyxJOzs7QUE0RTFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEV2ZW50SGFuZGxlciBhcyBDb21wb25lbnRFdmVudEhhbmRsZXIgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvY29tcG9uZW50LWV2ZW50LWhhbmRsZXInO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlJztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgcmVxdWlyZUNvbXBvbmVudCwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi9idXR0b24nO1xyXG5pbXBvcnQgeyBTcHJpdGUgfSBmcm9tICcuL3Nwcml0ZSc7XHJcbmltcG9ydCB7IFRvZ2dsZUNvbnRhaW5lciB9IGZyb20gJy4vdG9nZ2xlLWNvbnRhaW5lcic7XHJcbmltcG9ydCB7IGV4dGVuZHNFbnVtIH0gZnJvbSAnLi4vLi4vY29yZS9kYXRhL3V0aWxzL2V4dGVuZHMtZW51bSc7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSBhcyBCdXR0b25FdmVudFR5cGUgfSBmcm9tICcuL2J1dHRvbic7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5lbnVtIEV2ZW50VHlwZSB7XHJcbiAgICBUT0dHTEUgPSAndG9nZ2xlJyxcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgdG9nZ2xlIGNvbXBvbmVudCBpcyBhIENoZWNrQm94LCB3aGVuIGl0IHVzZWQgdG9nZXRoZXIgd2l0aCBhIFRvZ2dsZUdyb3VwLFxyXG4gKiBpdCBjb3VsZCBiZSB0cmVhdGVkIGFzIGEgUmFkaW9CdXR0b24uXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiBUb2dnbGUg5piv5LiA5LiqIENoZWNrQm9477yM5b2T5a6D5ZKMIFRvZ2dsZUdyb3VwIOS4gOi1t+S9v+eUqOeahOaXtuWAme+8jOWPr+S7peWPmOaIkCBSYWRpb0J1dHRvbuOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlRvZ2dsZScpXHJcbkBoZWxwKCdpMThuOmNjLlRvZ2dsZScpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkBtZW51KCdVSS9Ub2dnbGUnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChVSVRyYW5zZm9ybSlcclxuZXhwb3J0IGNsYXNzIFRvZ2dsZSBleHRlbmRzIEJ1dHRvbiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZW4gdGhpcyB2YWx1ZSBpcyB0cnVlLCB0aGUgY2hlY2sgbWFyayBjb21wb25lbnQgd2lsbCBiZSBlbmFibGVkLFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSBjaGVjayBtYXJrIGNvbXBvbmVudCB3aWxsIGJlIGRpc2FibGVkLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5aaC5p6c6L+Z5Liq6K6+572u5Li6IHRydWXvvIzliJkgY2hlY2sgbWFyayDnu4Tku7bkvJrlpITkuo4gZW5hYmxlZCDnirbmgIHvvIzlkKbliJnlpITkuo4gZGlzYWJsZWQg54q25oCB44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEB0b29sdGlwKCflpoLmnpzov5nkuKrorr7nva7kuLogdHJ1Ze+8jOWImSBjaGVjayBtYXJrIOe7hOS7tuS8muWkhOS6jiBlbmFibGVkIOeKtuaAge+8jOWQpuWImeWkhOS6jiBkaXNhYmxlZCDnirbmgIHjgIInKVxyXG4gICAgZ2V0IGlzQ2hlY2tlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQ2hlY2tlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaXNDaGVja2VkICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3NldCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBpbWFnZSB1c2VkIGZvciB0aGUgY2hlY2ttYXJrLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICogVG9nZ2xlIOWkhOS6jumAieS4reeKtuaAgeaXtuaYvuekuueahOWbvueJh+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGUpXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBAdG9vbHRpcCgnVG9nZ2xlIOWkhOS6jumAieS4reeKtuaAgeaXtuaYvuekuueahOeyvueBteWbvueJhycpXHJcbiAgICBnZXQgY2hlY2tNYXJrICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2hlY2tNYXJrO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjaGVja01hcmsgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NoZWNrTWFyayA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2hlY2tNYXJrID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IF9yZXNpemVUb1RhcmdldCAodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplTm9kZVRvVGFyZ2V0Tm9kZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgX3RvZ2dsZUNvbnRhaW5lciAoKSB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudCE7XHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLk5vZGUuaXNOb2RlKHBhcmVudCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5nZXRDb21wb25lbnQoJ2NjLlRvZ2dsZUNvbnRhaW5lcicpIGFzIFRvZ2dsZUNvbnRhaW5lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBFdmVudFR5cGUgPSBleHRlbmRzRW51bShFdmVudFR5cGUsIEJ1dHRvbkV2ZW50VHlwZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElmIFRvZ2dsZSBpcyBjbGlja2VkLCBpdCB3aWxsIHRyaWdnZXIgZXZlbnQncyBoYW5kbGVyLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICogVG9nZ2xlIOaMiemSrueahOeCueWHu+S6i+S7tuWIl+ihqOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShbQ29tcG9uZW50RXZlbnRIYW5kbGVyXSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEB0b29sdGlwKCfliJfooajnsbvlnovvvIzpu5jorqTkuLrnqbrvvIznlKjmiLfmt7vliqDnmoTmr4/kuIDkuKrkuovku7bnlLHoioLngrnlvJXnlKjvvIznu4Tku7blkI3np7DlkozkuIDkuKrlk43lupTlh73mlbDnu4TmiJAnKVxyXG4gICAgcHVibGljIGNoZWNrRXZlbnRzOiBDb21wb25lbnRFdmVudEhhbmRsZXJbXSA9IFtdO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9pc0NoZWNrZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9jaGVja01hcms6IFNwcml0ZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfaW50ZXJuYWxUb2dnbGUgKCkge1xyXG4gICAgICAgIHRoaXMuaXNDaGVja2VkID0gIXRoaXMuaXNDaGVja2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfc2V0ICh2YWx1ZTogYm9vbGVhbiwgZW1pdEV2ZW50OiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0NoZWNrZWQgPT0gdmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5faXNDaGVja2VkID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5fdG9nZ2xlQ29udGFpbmVyO1xyXG4gICAgICAgIGlmIChncm91cCAmJiBncm91cC5lbmFibGVkICYmIHRoaXMuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgfHwgKCFncm91cC5hbnlUb2dnbGVzQ2hlY2tlZCgpICYmICFncm91cC5hbGxvd1N3aXRjaE9mZikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBncm91cC5ub3RpZnlUb2dnbGVDaGVjayh0aGlzLCBlbWl0RXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsYXlFZmZlY3QoKTtcclxuICAgICAgICBpZiAoZW1pdEV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VtaXRUb2dnbGVFdmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9cclxuICAgIHB1YmxpYyBwbGF5RWZmZWN0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2hlY2tNYXJrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrTWFyay5ub2RlLmFjdGl2ZSA9IHRoaXMuX2lzQ2hlY2tlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldCBpc0NoZWNrZWQgd2l0aG91dCBpbnZva2luZyBjaGVja0V2ZW50cy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9riBpc0NoZWNrZWQg6ICM5LiN6LCD55SoIGNoZWNrRXZlbnRzIOWbnuiwg+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIOaYr+WQpuiiq+aMieS4i1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0SXNDaGVja2VkV2l0aG91dE5vdGlmeSAodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9zZXQodmFsdWUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGUgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uRW5hYmxlKCk7XHJcbiAgICAgICAgdGhpcy5wbGF5RWZmZWN0KCk7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgfHwgbGVnYWN5Q0MuR0FNRV9WSUVXKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihUb2dnbGUuRXZlbnRUeXBlLkNMSUNLLCB0aGlzLl9pbnRlcm5hbFRvZ2dsZSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uRGlzYWJsZSgpO1xyXG4gICAgICAgIGlmICghRURJVE9SIHx8IGxlZ2FjeUNDLkdBTUVfVklFVykge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKFRvZ2dsZS5FdmVudFR5cGUuQ0xJQ0ssIHRoaXMuX2ludGVybmFsVG9nZ2xlLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIE9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gdGhpcy5fdG9nZ2xlQ29udGFpbmVyO1xyXG4gICAgICAgIGlmIChncm91cCkge1xyXG4gICAgICAgICAgICBncm91cC5lbnN1cmVWYWxpZFN0YXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZW1pdFRvZ2dsZUV2ZW50cyAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoVG9nZ2xlLkV2ZW50VHlwZS5UT0dHTEUsIHRoaXMpO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrRXZlbnRzKSB7XHJcbiAgICAgICAgICAgIENvbXBvbmVudEV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMuY2hlY2tFdmVudHMsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcclxuICogQGV2ZW50IHRvZ2dsZVxyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKiBAcGFyYW0ge1RvZ2dsZX0gdG9nZ2xlIC0gVGhlIFRvZ2dsZSBjb21wb25lbnQuXHJcbiAqL1xyXG4iXX0=