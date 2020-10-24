(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/component.js", "../../core/components/component-event-handler.js", "../../core/data/decorators/index.js", "../../core/scene-graph/index.js", "../../core/utils/index.js", "../../core/3d/index.js", "../../core/math/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/component.js"), require("../../core/components/component-event-handler.js"), require("../../core/data/decorators/index.js"), require("../../core/scene-graph/index.js"), require("../../core/utils/index.js"), require("../../core/3d/index.js"), require("../../core/math/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.componentEventHandler, global.index, global.index, global.index, global.index, global.index);
    global.uiCoodinateTracker = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _componentEventHandler, _index, _index2, _index3, _index4, _index5) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UICoordinateTracker = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

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

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @zh 3D 节点映射 UI 节点组件
   * 主要提供映射后的转换世界坐标以及模拟透视相机远近比。
   */
  var UICoordinateTracker = (_dec = (0, _index.ccclass)('cc.UICoordinateTracker'), _dec2 = (0, _index.help)('i18n:cc.UICoordinateTracker'), _dec3 = (0, _index.menu)('UI/UICoordinateTracker'), _dec4 = (0, _index.executionOrder)(110), _dec5 = (0, _index.type)(_index2.Node), _dec6 = (0, _index.tooltip)('目标对象'), _dec7 = (0, _index.type)(_index4.Camera), _dec8 = (0, _index.tooltip)('照射相机'), _dec9 = (0, _index.tooltip)('是否是缩放映射'), _dec10 = (0, _index.tooltip)('距相机多少距离为正常显示计算大小'), _dec11 = (0, _index.type)([_componentEventHandler.EventHandler]), _dec12 = (0, _index.tooltip)('映射数据事件。回调的第一个参数是映射后的本地坐标，第二个是距相机距离比'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(UICoordinateTracker, _Component);

    function UICoordinateTracker() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UICoordinateTracker);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UICoordinateTracker)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "syncEvents", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_target", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_camera", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_useScale", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_distance", _descriptor5, _assertThisInitialized(_this));

      _this._transformPos = new _index5.Vec3();
      _this._viewPos = new _index5.Vec3();
      _this._canMove = true;
      _this._lastWpos = new _index5.Vec3();
      _this._lastCameraPos = new _index5.Vec3();
      return _this;
    }

    _createClass(UICoordinateTracker, [{
      key: "onEnable",
      value: function onEnable() {
        this._checkCanMove();
      }
    }, {
      key: "update",
      value: function update() {
        var wpos = this.node.worldPosition;
        var camera = this._camera; // @ts-ignore

        if (!this._canMove || !camera._camera || this._lastWpos.equals(wpos) && this._lastCameraPos.equals(camera.node.worldPosition)) {
          return;
        }

        this._lastWpos.set(wpos);

        this._lastCameraPos.set(camera.node.worldPosition); // [HACK]
        // @ts-ignore


        camera._camera.update();

        _index3.convertUtils.WorldNode3DToLocalNodeUI(camera, wpos, this._target, this._transformPos);

        if (this._useScale) {
          // @ts-ignore
          _index5.Vec3.transformMat4(this._viewPos, this.node.worldPosition, camera._camera.matView);
        }

        if (this.syncEvents.length > 0) {
          var data = this._distance / Math.abs(this._viewPos.z);

          _componentEventHandler.EventHandler.emitEvents(this.syncEvents, this._transformPos, data);
        }
      }
    }, {
      key: "_checkCanMove",
      value: function _checkCanMove() {
        this._canMove = !!(this._camera && this._target);
      }
    }, {
      key: "target",

      /**
       * @zh
       * 目标对象。
       */
      get: function get() {
        return this._target;
      },
      set: function set(value) {
        if (this._target === value) {
          return;
        }

        this._target = value;

        this._checkCanMove();
      }
      /**
       * @zh
       * 照射相机。
       */

    }, {
      key: "camera",
      get: function get() {
        return this._camera;
      },
      set: function set(value) {
        if (this._camera === value) {
          return;
        }

        this._camera = value;

        this._checkCanMove();
      }
      /**
       * @zh
       * 是否是缩放映射。
       */

    }, {
      key: "useScale",
      get: function get() {
        return this._useScale;
      },
      set: function set(value) {
        if (this._useScale === value) {
          return;
        }

        this._useScale = value;
      }
      /**
       * @zh
       * 距相机多少距离为正常显示计算大小。
       */

    }, {
      key: "distance",
      get: function get() {
        return this._distance;
      },
      set: function set(value) {
        if (this._distance === value) {
          return;
        }

        this._distance = value;
      }
      /**
       * @zh
       * 映射数据事件。回调的第一个参数是映射后的本地坐标，第二个是距相机距离比。
       */

    }]);

    return UICoordinateTracker;
  }(_component.Component), _temp), (_applyDecoratedDescriptor(_class2.prototype, "target", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "target"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "camera"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "useScale", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "useScale"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "distance", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "distance"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "syncEvents", [_dec11, _index.serializable, _dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_target", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_camera", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_useScale", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_distance", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.UICoordinateTracker = UICoordinateTracker;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvdWktY29vZGluYXRlLXRyYWNrZXIudHMiXSwibmFtZXMiOlsiVUlDb29yZGluYXRlVHJhY2tlciIsIk5vZGUiLCJDYW1lcmEiLCJFdmVudEhhbmRsZXIiLCJfdHJhbnNmb3JtUG9zIiwiVmVjMyIsIl92aWV3UG9zIiwiX2Nhbk1vdmUiLCJfbGFzdFdwb3MiLCJfbGFzdENhbWVyYVBvcyIsIl9jaGVja0Nhbk1vdmUiLCJ3cG9zIiwibm9kZSIsIndvcmxkUG9zaXRpb24iLCJjYW1lcmEiLCJfY2FtZXJhIiwiZXF1YWxzIiwic2V0IiwidXBkYXRlIiwiY29udmVydFV0aWxzIiwiV29ybGROb2RlM0RUb0xvY2FsTm9kZVVJIiwiX3RhcmdldCIsIl91c2VTY2FsZSIsInRyYW5zZm9ybU1hdDQiLCJtYXRWaWV3Iiwic3luY0V2ZW50cyIsImxlbmd0aCIsImRhdGEiLCJfZGlzdGFuY2UiLCJNYXRoIiwiYWJzIiwieiIsImVtaXRFdmVudHMiLCJ2YWx1ZSIsIkNvbXBvbmVudCIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNDQTs7OztNQVFhQSxtQixXQUpaLG9CQUFRLHdCQUFSLEMsVUFDQSxpQkFBSyw2QkFBTCxDLFVBQ0EsaUJBQUssd0JBQUwsQyxVQUNBLDJCQUFlLEdBQWYsQyxVQU1JLGlCQUFLQyxZQUFMLEMsVUFDQSxvQkFBUSxNQUFSLEMsVUFrQkEsaUJBQUtDLGNBQUwsQyxVQUNBLG9CQUFRLE1BQVIsQyxVQWtCQSxvQkFBUSxTQUFSLEMsV0FpQkEsb0JBQVEsa0JBQVIsQyxXQWlCQSxpQkFBSyxDQUFDQyxtQ0FBRCxDQUFMLEMsV0FFQSxvQkFBUSxxQ0FBUixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVlTQyxhLEdBQWdCLElBQUlDLFlBQUosRTtZQUNoQkMsUSxHQUFX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Ozs7O2FBQ2tDLEk7O2dGQUNsQ0EsbUI7Ozs7O2FBQ3FCLEk7O2dGQUNyQkEsbUI7Ozs7O2FBQ3FCLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvbXBvbmVudFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBFdmVudEhhbmRsZXIgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvY29tcG9uZW50LWV2ZW50LWhhbmRsZXInO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBtZW51LCBleGVjdXRpb25PcmRlciwgdG9vbHRpcCwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgnO1xyXG5pbXBvcnQgeyBjb252ZXJ0VXRpbHMgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSAnLi4vLi4vY29yZS8zZCc7XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5cclxuLyoqXHJcbiAqIEB6aCAzRCDoioLngrnmmKDlsIQgVUkg6IqC54K557uE5Lu2XHJcbiAqIOS4u+imgeaPkOS+m+aYoOWwhOWQjueahOi9rOaNouS4lueVjOWdkOagh+S7peWPiuaooeaLn+mAj+inhuebuOacuui/nOi/keavlOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlVJQ29vcmRpbmF0ZVRyYWNrZXInKVxyXG5AaGVscCgnaTE4bjpjYy5VSUNvb3JkaW5hdGVUcmFja2VyJylcclxuQG1lbnUoJ1VJL1VJQ29vcmRpbmF0ZVRyYWNrZXInKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5leHBvcnQgY2xhc3MgVUlDb29yZGluYXRlVHJhY2tlciBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog55uu5qCH5a+56LGh44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKE5vZGUpXHJcbiAgICBAdG9vbHRpcCgn55uu5qCH5a+56LGhJylcclxuICAgIGdldCB0YXJnZXQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRhcmdldCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl90YXJnZXQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9jaGVja0Nhbk1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog54Wn5bCE55u45py644CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKENhbWVyYSlcclxuICAgIEB0b29sdGlwKCfnhaflsITnm7jmnLonKVxyXG4gICAgZ2V0IGNhbWVyYSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbWVyYTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2FtZXJhICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbWVyYSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2NoZWNrQ2FuTW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKbmmK/nvKnmlL7mmKDlsITjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuaYr+e8qeaUvuaYoOWwhCcpXHJcbiAgICBnZXQgdXNlU2NhbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdXNlU2NhbGUgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3VzZVNjYWxlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91c2VTY2FsZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDot53nm7jmnLrlpJrlsJHot53nprvkuLrmraPluLjmmL7npLrorqHnrpflpKflsI/jgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+i3neebuOacuuWkmuWwkei3neemu+S4uuato+W4uOaYvuekuuiuoeeul+Wkp+WwjycpXHJcbiAgICBnZXQgZGlzdGFuY2UgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZGlzdGFuY2UgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rpc3RhbmNlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9kaXN0YW5jZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmKDlsITmlbDmja7kuovku7bjgILlm57osIPnmoTnrKzkuIDkuKrlj4LmlbDmmK/mmKDlsITlkI7nmoTmnKzlnLDlnZDmoIfvvIznrKzkuozkuKrmmK/ot53nm7jmnLrot53nprvmr5TjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoW0V2ZW50SGFuZGxlcl0pXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAdG9vbHRpcCgn5pig5bCE5pWw5o2u5LqL5Lu244CC5Zue6LCD55qE56ys5LiA5Liq5Y+C5pWw5piv5pig5bCE5ZCO55qE5pys5Zyw5Z2Q5qCH77yM56ys5LqM5Liq5piv6Led55u45py66Led56a75q+UJylcclxuICAgIHB1YmxpYyBzeW5jRXZlbnRzOiBFdmVudEhhbmRsZXJbXSA9IFtdO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdGFyZ2V0OiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2NhbWVyYTogQ2FtZXJhIHwgbnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3VzZVNjYWxlID0gdHJ1ZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZGlzdGFuY2UgPSAxO1xyXG5cclxuICAgIHByb3RlY3RlZCBfdHJhbnNmb3JtUG9zID0gbmV3IFZlYzMoKTtcclxuICAgIHByb3RlY3RlZCBfdmlld1BvcyA9IG5ldyBWZWMzKCk7XHJcbiAgICBwcm90ZWN0ZWQgX2Nhbk1vdmUgPSB0cnVlO1xyXG4gICAgcHJvdGVjdGVkIF9sYXN0V3BvcyA9IG5ldyBWZWMzKCk7XHJcbiAgICBwcm90ZWN0ZWQgX2xhc3RDYW1lcmFQb3MgPSBuZXcgVmVjMygpO1xyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fY2hlY2tDYW5Nb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoKSB7XHJcbiAgICAgICAgY29uc3Qgd3BvcyA9IHRoaXMubm9kZS53b3JsZFBvc2l0aW9uO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IHRoaXMuX2NhbWVyYTtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKCF0aGlzLl9jYW5Nb3ZlIHx8ICFjYW1lcmEuX2NhbWVyYSB8fCAodGhpcy5fbGFzdFdwb3MuZXF1YWxzKHdwb3MpICYmIHRoaXMuX2xhc3RDYW1lcmFQb3MuZXF1YWxzKGNhbWVyYSEubm9kZS53b3JsZFBvc2l0aW9uKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbGFzdFdwb3Muc2V0KHdwb3MpO1xyXG4gICAgICAgIHRoaXMuX2xhc3RDYW1lcmFQb3Muc2V0KGNhbWVyYSEubm9kZS53b3JsZFBvc2l0aW9uKTtcclxuICAgICAgICAvLyBbSEFDS11cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgY2FtZXJhLl9jYW1lcmEudXBkYXRlKCk7XHJcbiAgICAgICAgY29udmVydFV0aWxzLldvcmxkTm9kZTNEVG9Mb2NhbE5vZGVVSShjYW1lcmEhLCB3cG9zLCB0aGlzLl90YXJnZXQhLCB0aGlzLl90cmFuc2Zvcm1Qb3MpO1xyXG4gICAgICAgIGlmICh0aGlzLl91c2VTY2FsZSkge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NCh0aGlzLl92aWV3UG9zLCB0aGlzLm5vZGUud29ybGRQb3NpdGlvbiwgY2FtZXJhLl9jYW1lcmEhLm1hdFZpZXcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3luY0V2ZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9kaXN0YW5jZSAvIE1hdGguYWJzKHRoaXMuX3ZpZXdQb3Mueik7XHJcbiAgICAgICAgICAgIEV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMuc3luY0V2ZW50cywgdGhpcy5fdHJhbnNmb3JtUG9zLCBkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jaGVja0Nhbk1vdmUgKCkge1xyXG4gICAgICAgIHRoaXMuX2Nhbk1vdmUgPSAhISh0aGlzLl9jYW1lcmEgJiYgdGhpcy5fdGFyZ2V0KTtcclxuICAgIH1cclxufVxyXG4iXX0=