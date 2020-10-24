(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../scene/model.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../scene/model.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.model);
    global.morphModel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _model) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MorphModel = void 0;

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

  var MorphModel = /*#__PURE__*/function (_Model) {
    _inherits(MorphModel, _Model);

    function MorphModel() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, MorphModel);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MorphModel)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._morphRenderingInstance = null;
      _this._usedMaterials = new Set();
      return _this;
    }

    _createClass(MorphModel, [{
      key: "getMacroPatches",
      value: function getMacroPatches(subModelIndex) {
        if (this._morphRenderingInstance) {
          return this._morphRenderingInstance.requiredPatches(subModelIndex);
        } else {
          return undefined;
        }
      }
    }, {
      key: "initSubModel",
      value: function initSubModel(subModelIndex, subMeshData, material) {
        return _get(_getPrototypeOf(MorphModel.prototype), "initSubModel", this).call(this, subModelIndex, subMeshData, this._launderMaterial(material));
      }
    }, {
      key: "setSubModelMaterial",
      value: function setSubModelMaterial(subModelIndex, material) {
        return _get(_getPrototypeOf(MorphModel.prototype), "setSubModelMaterial", this).call(this, subModelIndex, this._launderMaterial(material));
      }
    }, {
      key: "_updateLocalDescriptors",
      value: function _updateLocalDescriptors(submodelIdx, descriptorSet) {
        _get(_getPrototypeOf(MorphModel.prototype), "_updateLocalDescriptors", this).call(this, submodelIdx, descriptorSet);

        if (this._morphRenderingInstance) {
          this._morphRenderingInstance.adaptPipelineState(submodelIdx, descriptorSet);
        }
      }
    }, {
      key: "_launderMaterial",
      value: function _launderMaterial(material) {
        return material; // if (this._usedMaterials.has(material)) {
        //     return new MaterialInstance({
        //         parent: material,
        //     });
        // } else {
        //     this._usedMaterials.add(material);
        //     return material;
        // }
      }
    }, {
      key: "setMorphRendering",
      value: function setMorphRendering(morphRendering) {
        this._morphRenderingInstance = morphRendering;
      }
    }]);

    return MorphModel;
  }(_model.Model);

  _exports.MorphModel = MorphModel;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvbW9kZWxzL21vcnBoLW1vZGVsLnRzIl0sIm5hbWVzIjpbIk1vcnBoTW9kZWwiLCJfbW9ycGhSZW5kZXJpbmdJbnN0YW5jZSIsIl91c2VkTWF0ZXJpYWxzIiwiU2V0Iiwic3ViTW9kZWxJbmRleCIsInJlcXVpcmVkUGF0Y2hlcyIsInVuZGVmaW5lZCIsInN1Yk1lc2hEYXRhIiwibWF0ZXJpYWwiLCJfbGF1bmRlck1hdGVyaWFsIiwic3VibW9kZWxJZHgiLCJkZXNjcmlwdG9yU2V0IiwiYWRhcHRQaXBlbGluZVN0YXRlIiwibW9ycGhSZW5kZXJpbmciLCJNb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BTWFBLFU7Ozs7Ozs7Ozs7Ozs7OztZQUNEQyx1QixHQUF5RCxJO1lBQ3pEQyxjLEdBQWlCLElBQUlDLEdBQUosRTs7Ozs7O3NDQUVEQyxhLEVBQTZCO0FBQ2pELFlBQUksS0FBS0gsdUJBQVQsRUFBa0M7QUFDOUIsaUJBQU8sS0FBS0EsdUJBQUwsQ0FBNkJJLGVBQTdCLENBQTZDRCxhQUE3QyxDQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQU9FLFNBQVA7QUFDSDtBQUNKOzs7bUNBRW9CRixhLEVBQXVCRyxXLEVBQStCQyxRLEVBQW9CO0FBQzNGLDRGQUNJSixhQURKLEVBRUlHLFdBRkosRUFHSSxLQUFLRSxnQkFBTCxDQUFzQkQsUUFBdEIsQ0FISjtBQUtIOzs7MENBRTJCSixhLEVBQXVCSSxRLEVBQW9CO0FBQ25FLG1HQUFpQ0osYUFBakMsRUFBZ0QsS0FBS0ssZ0JBQUwsQ0FBc0JELFFBQXRCLENBQWhEO0FBQ0g7Ozs4Q0FFa0NFLFcsRUFBcUJDLGEsRUFBaUM7QUFDckYsZ0dBQThCRCxXQUE5QixFQUEyQ0MsYUFBM0M7O0FBRUEsWUFBSSxLQUFLVix1QkFBVCxFQUFrQztBQUM5QixlQUFLQSx1QkFBTCxDQUE2Qlcsa0JBQTdCLENBQWdERixXQUFoRCxFQUE2REMsYUFBN0Q7QUFDSDtBQUNKOzs7dUNBRXlCSCxRLEVBQW9CO0FBQzFDLGVBQU9BLFFBQVAsQ0FEMEMsQ0FFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7d0NBRXlCSyxjLEVBQXdDO0FBQzlELGFBQUtaLHVCQUFMLEdBQStCWSxjQUEvQjtBQUNIOzs7O0lBOUMyQkMsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vc2NlbmUvbW9kZWwnO1xyXG5pbXBvcnQgeyBNb3JwaFJlbmRlcmluZ0luc3RhbmNlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21vcnBoJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9hc3NldHMvbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBSZW5kZXJpbmdTdWJNZXNoIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21lc2gnO1xyXG5pbXBvcnQgeyBHRlhEZXNjcmlwdG9yU2V0IH0gZnJvbSAnLi4vLi4vZ2Z4JztcclxuXHJcbmV4cG9ydCBjbGFzcyBNb3JwaE1vZGVsIGV4dGVuZHMgTW9kZWwge1xyXG4gICAgcHJpdmF0ZSBfbW9ycGhSZW5kZXJpbmdJbnN0YW5jZTogTW9ycGhSZW5kZXJpbmdJbnN0YW5jZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdXNlZE1hdGVyaWFscyA9IG5ldyBTZXQ8TWF0ZXJpYWw+KCk7XHJcblxyXG4gICAgcHVibGljIGdldE1hY3JvUGF0Y2hlcyAoc3ViTW9kZWxJbmRleDogbnVtYmVyKSA6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vcnBoUmVuZGVyaW5nSW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vcnBoUmVuZGVyaW5nSW5zdGFuY2UucmVxdWlyZWRQYXRjaGVzKHN1Yk1vZGVsSW5kZXgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0U3ViTW9kZWwgKHN1Yk1vZGVsSW5kZXg6IG51bWJlciwgc3ViTWVzaERhdGE6IFJlbmRlcmluZ1N1Yk1lc2gsIG1hdGVyaWFsOiBNYXRlcmlhbCkge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5pbml0U3ViTW9kZWwoXHJcbiAgICAgICAgICAgIHN1Yk1vZGVsSW5kZXgsXHJcbiAgICAgICAgICAgIHN1Yk1lc2hEYXRhLFxyXG4gICAgICAgICAgICB0aGlzLl9sYXVuZGVyTWF0ZXJpYWwobWF0ZXJpYWwpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFN1Yk1vZGVsTWF0ZXJpYWwgKHN1Yk1vZGVsSW5kZXg6IG51bWJlciwgbWF0ZXJpYWw6IE1hdGVyaWFsKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldFN1Yk1vZGVsTWF0ZXJpYWwoc3ViTW9kZWxJbmRleCwgdGhpcy5fbGF1bmRlck1hdGVyaWFsKG1hdGVyaWFsKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVMb2NhbERlc2NyaXB0b3JzIChzdWJtb2RlbElkeDogbnVtYmVyLCBkZXNjcmlwdG9yU2V0OiBHRlhEZXNjcmlwdG9yU2V0KSB7XHJcbiAgICAgICAgc3VwZXIuX3VwZGF0ZUxvY2FsRGVzY3JpcHRvcnMoc3VibW9kZWxJZHgsIGRlc2NyaXB0b3JTZXQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbW9ycGhSZW5kZXJpbmdJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3JwaFJlbmRlcmluZ0luc3RhbmNlLmFkYXB0UGlwZWxpbmVTdGF0ZShzdWJtb2RlbElkeCwgZGVzY3JpcHRvclNldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2xhdW5kZXJNYXRlcmlhbCAobWF0ZXJpYWw6IE1hdGVyaWFsKSB7XHJcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG4gICAgICAgIC8vIGlmICh0aGlzLl91c2VkTWF0ZXJpYWxzLmhhcyhtYXRlcmlhbCkpIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIG5ldyBNYXRlcmlhbEluc3RhbmNlKHtcclxuICAgICAgICAvLyAgICAgICAgIHBhcmVudDogbWF0ZXJpYWwsXHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuX3VzZWRNYXRlcmlhbHMuYWRkKG1hdGVyaWFsKTtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TW9ycGhSZW5kZXJpbmcgKG1vcnBoUmVuZGVyaW5nOiBNb3JwaFJlbmRlcmluZ0luc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy5fbW9ycGhSZW5kZXJpbmdJbnN0YW5jZSA9IG1vcnBoUmVuZGVyaW5nO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==