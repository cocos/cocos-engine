(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.morphWeights = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MorphWeightsAllValueProxy = _exports.MorphWeightsValueProxy = void 0;

  var _dec, _class, _class2, _descriptor, _temp, _dec2, _class4;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * Value proxy factory for setting morph weights of specified sub-mesh on model component target.
   * @zh
   * 用于设置模型组件目标上指定子网格形变权重的曲线值代理工厂。
   */
  var MorphWeightsValueProxy = (_dec = (0, _index.ccclass)('cc.animation.MorphWeightsValueProxy'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function MorphWeightsValueProxy() {
      _classCallCheck(this, MorphWeightsValueProxy);

      _initializerDefineProperty(this, "subMeshIndex", _descriptor, this);
    }

    _createClass(MorphWeightsValueProxy, [{
      key: "forTarget",
      value: function forTarget(target) {
        var _this = this;

        return {
          set: function set(value) {
            target.setWeights(value, _this.subMeshIndex);
          }
        };
      }
    }]);

    return MorphWeightsValueProxy;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "subMeshIndex", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class);
  /**
   * @en
   * Value proxy factory for setting morph weights of each sub-mesh on model component target.
   * @zh
   * 用于设置模型组件目标上所有子网格形变权重的曲线值代理工厂。
   */

  _exports.MorphWeightsValueProxy = MorphWeightsValueProxy;
  var MorphWeightsAllValueProxy = (_dec2 = (0, _index.ccclass)('cc.animation.MorphWeightsAllValueProxy'), _dec2(_class4 = /*#__PURE__*/function () {
    function MorphWeightsAllValueProxy() {
      _classCallCheck(this, MorphWeightsAllValueProxy);
    }

    _createClass(MorphWeightsAllValueProxy, [{
      key: "forTarget",
      value: function forTarget(target) {
        return {
          set: function set(value) {
            var _target$mesh$struct$p, _target$mesh;

            var nSubMeshes = (_target$mesh$struct$p = (_target$mesh = target.mesh) === null || _target$mesh === void 0 ? void 0 : _target$mesh.struct.primitives.length) !== null && _target$mesh$struct$p !== void 0 ? _target$mesh$struct$p : 0;

            for (var iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
              target.setWeights(value, iSubMesh);
            }
          }
        };
      }
    }]);

    return MorphWeightsAllValueProxy;
  }()) || _class4);
  _exports.MorphWeightsAllValueProxy = MorphWeightsAllValueProxy;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3ZhbHVlLXByb3h5LWZhY3Rvcmllcy9tb3JwaC13ZWlnaHRzLnRzIl0sIm5hbWVzIjpbIk1vcnBoV2VpZ2h0c1ZhbHVlUHJveHkiLCJ0YXJnZXQiLCJzZXQiLCJ2YWx1ZSIsInNldFdlaWdodHMiLCJzdWJNZXNoSW5kZXgiLCJzZXJpYWxpemFibGUiLCJNb3JwaFdlaWdodHNBbGxWYWx1ZVByb3h5IiwiblN1Yk1lc2hlcyIsIm1lc2giLCJzdHJ1Y3QiLCJwcmltaXRpdmVzIiwibGVuZ3RoIiwiaVN1Yk1lc2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQTs7Ozs7O01BT2FBLHNCLFdBRFosb0JBQVEscUNBQVIsQzs7Ozs7Ozs7O2dDQVNxQkMsTSxFQUFzQjtBQUFBOztBQUNwQyxlQUFPO0FBQ0hDLFVBQUFBLEdBQUcsRUFBRSxhQUFDQyxLQUFELEVBQXFCO0FBQ3RCRixZQUFBQSxNQUFNLENBQUNHLFVBQVAsQ0FBa0JELEtBQWxCLEVBQXlCLEtBQUksQ0FBQ0UsWUFBOUI7QUFDSDtBQUhFLFNBQVA7QUFLSDs7Ozs0RkFUQUMsbUI7Ozs7O2FBQzZCLEM7OztBQVdsQzs7Ozs7Ozs7TUFPYUMseUIsWUFEWixvQkFBUSx3Q0FBUixDOzs7Ozs7O2dDQUVxQk4sTSxFQUFzQjtBQUNwQyxlQUFPO0FBQ0hDLFVBQUFBLEdBQUcsRUFBRSxhQUFDQyxLQUFELEVBQXFCO0FBQUE7O0FBQ3RCLGdCQUFNSyxVQUFVLDRDQUFHUCxNQUFNLENBQUNRLElBQVYsaURBQUcsYUFBYUMsTUFBYixDQUFvQkMsVUFBcEIsQ0FBK0JDLE1BQWxDLHlFQUE0QyxDQUE1RDs7QUFDQSxpQkFBSyxJQUFJQyxRQUFRLEdBQUcsQ0FBcEIsRUFBdUJBLFFBQVEsR0FBR0wsVUFBbEMsRUFBOEMsRUFBRUssUUFBaEQsRUFBMEQ7QUFDdERaLGNBQUFBLE1BQU0sQ0FBQ0csVUFBUCxDQUFrQkQsS0FBbEIsRUFBeUJVLFFBQXpCO0FBQ0g7QUFDSjtBQU5FLFNBQVA7QUFRSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgTWVzaFJlbmRlcmVyIH0gZnJvbSAnLi4vLi4vM2QvZnJhbWV3b3JrL21lc2gtcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBJVmFsdWVQcm94eUZhY3RvcnkgfSBmcm9tICcuLi92YWx1ZS1wcm94eSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFZhbHVlIHByb3h5IGZhY3RvcnkgZm9yIHNldHRpbmcgbW9ycGggd2VpZ2h0cyBvZiBzcGVjaWZpZWQgc3ViLW1lc2ggb24gbW9kZWwgY29tcG9uZW50IHRhcmdldC5cclxuICogQHpoXHJcbiAqIOeUqOS6juiuvue9ruaooeWei+e7hOS7tuebruagh+S4iuaMh+WumuWtkOe9keagvOW9ouWPmOadg+mHjeeahOabsue6v+WAvOS7o+eQhuW3peWOguOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLmFuaW1hdGlvbi5Nb3JwaFdlaWdodHNWYWx1ZVByb3h5JylcclxuZXhwb3J0IGNsYXNzIE1vcnBoV2VpZ2h0c1ZhbHVlUHJveHkgaW1wbGVtZW50cyBJVmFsdWVQcm94eUZhY3Rvcnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU3ViLW1lc2ggaW5kZXguXHJcbiAgICAgKiBAemgg5a2Q572R5qC857Si5byV44CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyBzdWJNZXNoSW5kZXg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGZvclRhcmdldCAodGFyZ2V0OiBNZXNoUmVuZGVyZXIpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXQ6ICh2YWx1ZTogbnVtYmVyW10pID0+IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5zZXRXZWlnaHRzKHZhbHVlLCB0aGlzLnN1Yk1lc2hJbmRleCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBWYWx1ZSBwcm94eSBmYWN0b3J5IGZvciBzZXR0aW5nIG1vcnBoIHdlaWdodHMgb2YgZWFjaCBzdWItbWVzaCBvbiBtb2RlbCBjb21wb25lbnQgdGFyZ2V0LlxyXG4gKiBAemhcclxuICog55So5LqO6K6+572u5qih5Z6L57uE5Lu255uu5qCH5LiK5omA5pyJ5a2Q572R5qC85b2i5Y+Y5p2D6YeN55qE5puy57q/5YC85Luj55CG5bel5Y6C44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuYW5pbWF0aW9uLk1vcnBoV2VpZ2h0c0FsbFZhbHVlUHJveHknKVxyXG5leHBvcnQgY2xhc3MgTW9ycGhXZWlnaHRzQWxsVmFsdWVQcm94eSBpbXBsZW1lbnRzIElWYWx1ZVByb3h5RmFjdG9yeSB7XHJcbiAgICBwdWJsaWMgZm9yVGFyZ2V0ICh0YXJnZXQ6IE1lc2hSZW5kZXJlcikge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNldDogKHZhbHVlOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgblN1Yk1lc2hlcyA9IHRhcmdldC5tZXNoPy5zdHJ1Y3QucHJpbWl0aXZlcy5sZW5ndGggPz8gMDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlTdWJNZXNoID0gMDsgaVN1Yk1lc2ggPCBuU3ViTWVzaGVzOyArK2lTdWJNZXNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNldFdlaWdodHModmFsdWUsIGlTdWJNZXNoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==