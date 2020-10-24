(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../define.js", "../render-flow.js", "./enum.js", "./lighting-stage.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../define.js"), require("../render-flow.js"), require("./enum.js"), require("./lighting-stage.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.renderFlow, global._enum, global.lightingStage);
    global.lightingFlow = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _renderFlow, _enum, _lightingStage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LightingFlow = void 0;

  var _dec, _class, _class2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

  /**
   * @en The lighting flow in lighting render pipeline
   * @zh 前向渲染流程。
   */
  var LightingFlow = (_dec = (0, _index.ccclass)('LightingFlow'), _dec(_class = (_temp = _class2 = /*#__PURE__*/function (_RenderFlow) {
    _inherits(LightingFlow, _RenderFlow);

    function LightingFlow() {
      _classCallCheck(this, LightingFlow);

      return _possibleConstructorReturn(this, _getPrototypeOf(LightingFlow).apply(this, arguments));
    }

    _createClass(LightingFlow, [{
      key: "initialize",

      /**
       * @en The shared initialization information of lighting render flow
       * @zh 共享的前向渲染流程初始化参数
       */
      value: function initialize(info) {
        _get(_getPrototypeOf(LightingFlow.prototype), "initialize", this).call(this, info);

        if (this._stages.length === 0) {
          var lightingStage = new _lightingStage.LightingStage();
          lightingStage.initialize(_lightingStage.LightingStage.initInfo);

          this._stages.push(lightingStage);
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline) {
        _get(_getPrototypeOf(LightingFlow.prototype), "activate", this).call(this, pipeline);
      }
    }, {
      key: "render",
      value: function render(view) {
        var pipeline = this._pipeline;
        pipeline.updateUBOs(view);

        _get(_getPrototypeOf(LightingFlow.prototype), "render", this).call(this, view);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(LightingFlow.prototype), "destroy", this).call(this);
      }
    }]);

    return LightingFlow;
  }(_renderFlow.RenderFlow), _class2.initInfo = {
    name: _define.PIPELINE_FLOW_LIGHTING,
    priority: _enum.DeferredFlowPriority.LIGHTING,
    stages: []
  }, _temp)) || _class);
  _exports.LightingFlow = LightingFlow;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZGVmZXJyZWQvbGlnaHRpbmctZmxvdy50cyJdLCJuYW1lcyI6WyJMaWdodGluZ0Zsb3ciLCJpbmZvIiwiX3N0YWdlcyIsImxlbmd0aCIsImxpZ2h0aW5nU3RhZ2UiLCJMaWdodGluZ1N0YWdlIiwiaW5pdGlhbGl6ZSIsImluaXRJbmZvIiwicHVzaCIsInBpcGVsaW5lIiwidmlldyIsIl9waXBlbGluZSIsInVwZGF0ZVVCT3MiLCJSZW5kZXJGbG93IiwibmFtZSIsIlBJUEVMSU5FX0ZMT1dfTElHSFRJTkciLCJwcmlvcml0eSIsIkRlZmVycmVkRmxvd1ByaW9yaXR5IiwiTElHSFRJTkciLCJzdGFnZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7TUFLYUEsWSxXQURaLG9CQUFRLGNBQVIsQzs7Ozs7Ozs7Ozs7O0FBR0c7Ozs7aUNBVW1CQyxJLEVBQWdDO0FBQy9DLHFGQUFpQkEsSUFBakI7O0FBQ0EsWUFBSSxLQUFLQyxPQUFMLENBQWFDLE1BQWIsS0FBd0IsQ0FBNUIsRUFBK0I7QUFDM0IsY0FBTUMsYUFBYSxHQUFHLElBQUlDLDRCQUFKLEVBQXRCO0FBQ0FELFVBQUFBLGFBQWEsQ0FBQ0UsVUFBZCxDQUF5QkQsNkJBQWNFLFFBQXZDOztBQUNBLGVBQUtMLE9BQUwsQ0FBYU0sSUFBYixDQUFrQkosYUFBbEI7QUFDSDs7QUFDRCxlQUFPLElBQVA7QUFDSDs7OytCQUVnQkssUSxFQUEwQjtBQUN2QyxtRkFBZUEsUUFBZjtBQUNIOzs7NkJBRWNDLEksRUFBa0I7QUFDN0IsWUFBTUQsUUFBUSxHQUFHLEtBQUtFLFNBQXRCO0FBQ0FGLFFBQUFBLFFBQVEsQ0FBQ0csVUFBVCxDQUFvQkYsSUFBcEI7O0FBQ0EsaUZBQWFBLElBQWI7QUFDSDs7O2dDQUVpQjtBQUNkO0FBQ0g7Ozs7SUFsQzZCRyxzQixXQU1oQk4sUSxHQUE0QjtBQUN0Q08sSUFBQUEsSUFBSSxFQUFFQyw4QkFEZ0M7QUFFdENDLElBQUFBLFFBQVEsRUFBRUMsMkJBQXFCQyxRQUZPO0FBR3RDQyxJQUFBQSxNQUFNLEVBQUU7QUFIOEIsRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUElQRUxJTkVfRkxPV19MSUdIVElORyB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IElSZW5kZXJGbG93SW5mbywgUmVuZGVyRmxvdyB9IGZyb20gJy4uL3JlbmRlci1mbG93JztcclxuaW1wb3J0IHsgUmVuZGVyVmlldyB9IGZyb20gJy4uL3JlbmRlci12aWV3JztcclxuaW1wb3J0IHsgRGVmZXJyZWRGbG93UHJpb3JpdHkgfSBmcm9tICcuL2VudW0nO1xyXG5pbXBvcnQgeyBMaWdodGluZ1N0YWdlIH0gZnJvbSAnLi9saWdodGluZy1zdGFnZSc7XHJcbmltcG9ydCB7IERlZmVycmVkUGlwZWxpbmUgfSBmcm9tICcuL2RlZmVycmVkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgUmVuZGVyUGlwZWxpbmUgfSBmcm9tICcuLi9yZW5kZXItcGlwZWxpbmUnO1xyXG4vKipcclxuICogQGVuIFRoZSBsaWdodGluZyBmbG93IGluIGxpZ2h0aW5nIHJlbmRlciBwaXBlbGluZVxyXG4gKiBAemgg5YmN5ZCR5riy5p+T5rWB56iL44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnTGlnaHRpbmdGbG93JylcclxuZXhwb3J0IGNsYXNzIExpZ2h0aW5nRmxvdyBleHRlbmRzIFJlbmRlckZsb3cge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBzaGFyZWQgaW5pdGlhbGl6YXRpb24gaW5mb3JtYXRpb24gb2YgbGlnaHRpbmcgcmVuZGVyIGZsb3dcclxuICAgICAqIEB6aCDlhbHkuqvnmoTliY3lkJHmuLLmn5PmtYHnqIvliJ3lp4vljJblj4LmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0SW5mbzogSVJlbmRlckZsb3dJbmZvID0ge1xyXG4gICAgICAgIG5hbWU6IFBJUEVMSU5FX0ZMT1dfTElHSFRJTkcsXHJcbiAgICAgICAgcHJpb3JpdHk6IERlZmVycmVkRmxvd1ByaW9yaXR5LkxJR0hUSU5HLFxyXG4gICAgICAgIHN0YWdlczogW11cclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IElSZW5kZXJGbG93SW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoaW5mbyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YWdlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc3QgbGlnaHRpbmdTdGFnZSA9IG5ldyBMaWdodGluZ1N0YWdlKCk7XHJcbiAgICAgICAgICAgIGxpZ2h0aW5nU3RhZ2UuaW5pdGlhbGl6ZShMaWdodGluZ1N0YWdlLmluaXRJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fc3RhZ2VzLnB1c2gobGlnaHRpbmdTdGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAocGlwZWxpbmU6IFJlbmRlclBpcGVsaW5lKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0aXZhdGUocGlwZWxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIgKHZpZXc6IFJlbmRlclZpZXcpIHtcclxuICAgICAgICBjb25zdCBwaXBlbGluZSA9IHRoaXMuX3BpcGVsaW5lIGFzIERlZmVycmVkUGlwZWxpbmU7XHJcbiAgICAgICAgcGlwZWxpbmUudXBkYXRlVUJPcyh2aWV3KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIodmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxufVxyXG4iXX0=