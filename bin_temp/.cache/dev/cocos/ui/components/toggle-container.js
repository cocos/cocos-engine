(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/index.js", "../../core/data/decorators/index.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/index.js"), require("../../core/data/decorators/index.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.globalExports);
    global.toggleContainer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ToggleContainer = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * ToggleContainer is not a visible UI component but a way to modify the behavior of a set of Toggles. <br/>
   * Toggles that belong to the same group could only have one of them to be switched on at a time.<br/>
   * Note: All the first layer child node containing the toggle component will auto be added to the container.
   *
   * @zh
   * ToggleGroup 不是一个可见的 UI 组件，它可以用来修改一组 Toggle  组件的行为。当一组 Toggle 属于同一个 ToggleGroup 的时候，<br/>
   * 任何时候只能有一个 Toggle 处于选中状态。
   */
  var ToggleContainer = (_dec = (0, _index2.ccclass)('cc.ToggleContainer'), _dec2 = (0, _index2.help)('i18n:cc.ToggleContainer'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/ToggleContainer'), _dec5 = (0, _index2.tooltip)('如果这个设置为 true， 那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。'), _dec6 = (0, _index2.type)([_index.EventHandler]), _dec7 = (0, _index2.tooltip)('选中事件。列表类型，默认为空，用户添加的每一个事件由节点引用，组件名称和一个响应函数组成。'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _index2.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(ToggleContainer, _Component);

    function ToggleContainer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ToggleContainer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ToggleContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_allowSwitchOff", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "checkEvents", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(ToggleContainer, [{
      key: "start",
      value: function start() {
        this.ensureValidState();
      }
    }, {
      key: "activeToggles",
      value: function activeToggles() {
        return this.toggleItems.filter(function (x) {
          return x.isChecked;
        });
      }
    }, {
      key: "anyTogglesChecked",
      value: function anyTogglesChecked() {
        return !!this.toggleItems.find(function (x) {
          return x.isChecked;
        });
      }
      /**
       * @en
       * Refresh the state of the managed toggles.
       *
       * @zh
       * 刷新管理的 toggle 状态。
       *
       * @param toggle - 需要被更新的 toggle。
       * @param emitEvent - 是否需要触发事件
       */

    }, {
      key: "notifyToggleCheck",
      value: function notifyToggleCheck(toggle) {
        var emitEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (!this.enabledInHierarchy) {
          return;
        }

        for (var i = 0; i < this.toggleItems.length; i++) {
          var item = this.toggleItems[i];

          if (item === toggle) {
            continue;
          }

          if (emitEvent) {
            item.isChecked = false;
          } else {
            item.setIsCheckedWithoutNotify(false);
          }
        }

        if (this.checkEvents) {
          _globalExports.legacyCC.Component.EventHandler.emitEvents(this.checkEvents, toggle);
        }
      }
    }, {
      key: "ensureValidState",
      value: function ensureValidState() {
        var toggles = this.toggleItems;

        if (!this._allowSwitchOff && !this.anyTogglesChecked() && toggles.length !== 0) {
          var toggle = toggles[0];
          toggle.isChecked = true;
          this.notifyToggleCheck(toggle);
        }

        var activeToggles = this.activeToggles();

        if (activeToggles.length > 1) {
          var firstToggle = activeToggles[0];

          for (var i = 0; i < activeToggles.length; ++i) {
            var _toggle = activeToggles[i];

            if (_toggle === firstToggle) {
              continue;
            }

            _toggle.isChecked = false;
          }
        }
      }
    }, {
      key: "allowSwitchOff",

      /**
       * @en
       * If this setting is true, a toggle could be switched off and on when pressed.
       * If it is false, it will make sure there is always only one toggle could be switched on
       * and the already switched on toggle can't be switched off.
       *
       * @zh
       * 如果这个设置为 true，那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。
       */
      get: function get() {
        return this._allowSwitchOff;
      },
      set: function set(value) {
        this._allowSwitchOff = value;
      }
      /**
       * @en
       * If Toggle is clicked, it will trigger event's handler.
       *
       * @zh
       * Toggle 按钮的点击事件列表。
       */

    }, {
      key: "toggleItems",

      /**
       * @en
       * Read only property, return the toggle items array reference managed by ToggleContainer.
       *
       * @zh
       * 只读属性，返回 toggleContainer 管理的 toggle 数组引用。
       */
      get: function get() {
        return this.node.children.map(function (item) {
          var toggle = item.getComponent('cc.Toggle');

          if (toggle && toggle.enabled) {
            return toggle;
          }
        }).filter(Boolean);
      }
    }]);

    return ToggleContainer;
  }(_index.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_allowSwitchOff", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "allowSwitchOff", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "allowSwitchOff"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "checkEvents", [_dec6, _index2.serializable, _dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.ToggleContainer = ToggleContainer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvdG9nZ2xlLWNvbnRhaW5lci50cyJdLCJuYW1lcyI6WyJUb2dnbGVDb250YWluZXIiLCJDb21wb25lbnRFdmVudEhhbmRsZXIiLCJleGVjdXRlSW5FZGl0TW9kZSIsImVuc3VyZVZhbGlkU3RhdGUiLCJ0b2dnbGVJdGVtcyIsImZpbHRlciIsIngiLCJpc0NoZWNrZWQiLCJmaW5kIiwidG9nZ2xlIiwiZW1pdEV2ZW50IiwiZW5hYmxlZEluSGllcmFyY2h5IiwiaSIsImxlbmd0aCIsIml0ZW0iLCJzZXRJc0NoZWNrZWRXaXRob3V0Tm90aWZ5IiwiY2hlY2tFdmVudHMiLCJsZWdhY3lDQyIsIkNvbXBvbmVudCIsIkV2ZW50SGFuZGxlciIsImVtaXRFdmVudHMiLCJ0b2dnbGVzIiwiX2FsbG93U3dpdGNoT2ZmIiwiYW55VG9nZ2xlc0NoZWNrZWQiLCJub3RpZnlUb2dnbGVDaGVjayIsImFjdGl2ZVRvZ2dsZXMiLCJmaXJzdFRvZ2dsZSIsInZhbHVlIiwibm9kZSIsImNoaWxkcmVuIiwibWFwIiwiZ2V0Q29tcG9uZW50IiwiZW5hYmxlZCIsIkJvb2xlYW4iLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0E7Ozs7Ozs7Ozs7TUFnQmFBLGUsV0FMWixxQkFBUSxvQkFBUixDLFVBQ0Esa0JBQUsseUJBQUwsQyxVQUNBLDRCQUFlLEdBQWYsQyxVQUNBLGtCQUFLLG9CQUFMLEMsVUFjSSxxQkFBUSxnREFBUixDLFVBZ0JBLGtCQUFLLENBQUNDLG1CQUFELENBQUwsQyxVQUVBLHFCQUFRLCtDQUFSLEMsaUVBL0JKQyx5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFrRG1CO0FBQ1osYUFBS0MsZ0JBQUw7QUFDSDs7O3NDQUV1QjtBQUNwQixlQUFPLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQWpC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LEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEhhbmRsZXIgYXMgQ29tcG9uZW50RXZlbnRIYW5kbGVyIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCB0b29sdGlwLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBUb2dnbGUgfSBmcm9tICcuL3RvZ2dsZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRvZ2dsZUNvbnRhaW5lciBpcyBub3QgYSB2aXNpYmxlIFVJIGNvbXBvbmVudCBidXQgYSB3YXkgdG8gbW9kaWZ5IHRoZSBiZWhhdmlvciBvZiBhIHNldCBvZiBUb2dnbGVzLiA8YnIvPlxyXG4gKiBUb2dnbGVzIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIGdyb3VwIGNvdWxkIG9ubHkgaGF2ZSBvbmUgb2YgdGhlbSB0byBiZSBzd2l0Y2hlZCBvbiBhdCBhIHRpbWUuPGJyLz5cclxuICogTm90ZTogQWxsIHRoZSBmaXJzdCBsYXllciBjaGlsZCBub2RlIGNvbnRhaW5pbmcgdGhlIHRvZ2dsZSBjb21wb25lbnQgd2lsbCBhdXRvIGJlIGFkZGVkIHRvIHRoZSBjb250YWluZXIuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiBUb2dnbGVHcm91cCDkuI3mmK/kuIDkuKrlj6/op4HnmoQgVUkg57uE5Lu277yM5a6D5Y+v5Lul55So5p2l5L+u5pS55LiA57uEIFRvZ2dsZSAg57uE5Lu255qE6KGM5Li644CC5b2T5LiA57uEIFRvZ2dsZSDlsZ7kuo7lkIzkuIDkuKogVG9nZ2xlR3JvdXAg55qE5pe25YCZ77yMPGJyLz5cclxuICog5Lu75L2V5pe25YCZ5Y+q6IO95pyJ5LiA5LiqIFRvZ2dsZSDlpITkuo7pgInkuK3nirbmgIHjgIJcclxuICovXHJcblxyXG5AY2NjbGFzcygnY2MuVG9nZ2xlQ29udGFpbmVyJylcclxuQGhlbHAoJ2kxOG46Y2MuVG9nZ2xlQ29udGFpbmVyJylcclxuQGV4ZWN1dGlvbk9yZGVyKDExMClcclxuQG1lbnUoJ1VJL1RvZ2dsZUNvbnRhaW5lcicpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgVG9nZ2xlQ29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfYWxsb3dTd2l0Y2hPZmY6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJZiB0aGlzIHNldHRpbmcgaXMgdHJ1ZSwgYSB0b2dnbGUgY291bGQgYmUgc3dpdGNoZWQgb2ZmIGFuZCBvbiB3aGVuIHByZXNzZWQuXHJcbiAgICAgKiBJZiBpdCBpcyBmYWxzZSwgaXQgd2lsbCBtYWtlIHN1cmUgdGhlcmUgaXMgYWx3YXlzIG9ubHkgb25lIHRvZ2dsZSBjb3VsZCBiZSBzd2l0Y2hlZCBvblxyXG4gICAgICogYW5kIHRoZSBhbHJlYWR5IHN3aXRjaGVkIG9uIHRvZ2dsZSBjYW4ndCBiZSBzd2l0Y2hlZCBvZmYuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlpoLmnpzov5nkuKrorr7nva7kuLogdHJ1Ze+8jOmCo+S5iCB0b2dnbGUg5oyJ6ZKu5Zyo6KKr54K55Ye755qE5pe25YCZ5Y+v5Lul5Y+N5aSN5Zyw6KKr6YCJ5Lit5ZKM5pyq6YCJ5Lit44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCflpoLmnpzov5nkuKrorr7nva7kuLogdHJ1Ze+8jCDpgqPkuYggdG9nZ2xlIOaMiemSruWcqOiiq+eCueWHu+eahOaXtuWAmeWPr+S7peWPjeWkjeWcsOiiq+mAieS4reWSjOacqumAieS4reOAgicpXHJcbiAgICBnZXQgYWxsb3dTd2l0Y2hPZmYgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxvd1N3aXRjaE9mZjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYWxsb3dTd2l0Y2hPZmYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fYWxsb3dTd2l0Y2hPZmYgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSWYgVG9nZ2xlIGlzIGNsaWNrZWQsIGl0IHdpbGwgdHJpZ2dlciBldmVudCdzIGhhbmRsZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiBUb2dnbGUg5oyJ6ZKu55qE54K55Ye75LqL5Lu25YiX6KGo44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFtDb21wb25lbnRFdmVudEhhbmRsZXJdKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHRvb2x0aXAoJ+mAieS4reS6i+S7tuOAguWIl+ihqOexu+Wei++8jOm7mOiupOS4uuepuu+8jOeUqOaIt+a3u+WKoOeahOavj+S4gOS4quS6i+S7tueUseiKgueCueW8leeUqO+8jOe7hOS7tuWQjeensOWSjOS4gOS4quWTjeW6lOWHveaVsOe7hOaIkOOAgicpXHJcbiAgICBwdWJsaWMgY2hlY2tFdmVudHM6IENvbXBvbmVudEV2ZW50SGFuZGxlcltdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlYWQgb25seSBwcm9wZXJ0eSwgcmV0dXJuIHRoZSB0b2dnbGUgaXRlbXMgYXJyYXkgcmVmZXJlbmNlIG1hbmFnZWQgYnkgVG9nZ2xlQ29udGFpbmVyLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5Y+q6K+75bGe5oCn77yM6L+U5ZueIHRvZ2dsZUNvbnRhaW5lciDnrqHnkIbnmoQgdG9nZ2xlIOaVsOe7hOW8leeUqOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgdG9nZ2xlSXRlbXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUuY2hpbGRyZW4ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0b2dnbGUgPSBpdGVtLmdldENvbXBvbmVudCgnY2MuVG9nZ2xlJykgYXMgVG9nZ2xlO1xyXG4gICAgICAgICAgICBpZiAodG9nZ2xlICYmIHRvZ2dsZS5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9nZ2xlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCAoKSB7XHJcbiAgICAgICAgdGhpcy5lbnN1cmVWYWxpZFN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2ZVRvZ2dsZXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZUl0ZW1zLmZpbHRlcih4ID0+IHghLmlzQ2hlY2tlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFueVRvZ2dsZXNDaGVja2VkICgpIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLnRvZ2dsZUl0ZW1zLmZpbmQoeCA9PiB4IS5pc0NoZWNrZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZWZyZXNoIHRoZSBzdGF0ZSBvZiB0aGUgbWFuYWdlZCB0b2dnbGVzLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5Yi35paw566h55CG55qEIHRvZ2dsZSDnirbmgIHjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdG9nZ2xlIC0g6ZyA6KaB6KKr5pu05paw55qEIHRvZ2dsZeOAglxyXG4gICAgICogQHBhcmFtIGVtaXRFdmVudCAtIOaYr+WQpumcgOimgeinpuWPkeS6i+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbm90aWZ5VG9nZ2xlQ2hlY2sgKHRvZ2dsZTogVG9nZ2xlLCBlbWl0RXZlbnQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZ2dsZUl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy50b2dnbGVJdGVtc1tpXSE7XHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSB0b2dnbGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbWl0RXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uaXNDaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNldElzQ2hlY2tlZFdpdGhvdXROb3RpZnkoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGVja0V2ZW50cykge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy5jaGVja0V2ZW50cywgdG9nZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVuc3VyZVZhbGlkU3RhdGUgKCkge1xyXG4gICAgICAgIGxldCB0b2dnbGVzID0gdGhpcy50b2dnbGVJdGVtcztcclxuICAgICAgICBpZiAoIXRoaXMuX2FsbG93U3dpdGNoT2ZmICYmICF0aGlzLmFueVRvZ2dsZXNDaGVja2VkKCkgJiYgdG9nZ2xlcy5sZW5ndGggIT09IDAgKSB7XHJcbiAgICAgICAgICAgIGxldCB0b2dnbGUgPSB0b2dnbGVzWzBdITtcclxuICAgICAgICAgICAgdG9nZ2xlLmlzQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5VG9nZ2xlQ2hlY2sodG9nZ2xlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGl2ZVRvZ2dsZXMgPSB0aGlzLmFjdGl2ZVRvZ2dsZXMoKTtcclxuICAgICAgICBpZiAoYWN0aXZlVG9nZ2xlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGxldCBmaXJzdFRvZ2dsZSA9IGFjdGl2ZVRvZ2dsZXNbMF07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aXZlVG9nZ2xlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRvZ2dsZSA9IGFjdGl2ZVRvZ2dsZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlID09PSBmaXJzdFRvZ2dsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlIS5pc0NoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIl19