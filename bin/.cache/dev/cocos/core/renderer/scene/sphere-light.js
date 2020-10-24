(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../geometry/index.js", "../../math/index.js", "./light.js", "../core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../geometry/index.js"), require("../../math/index.js"), require("./light.js"), require("../core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.light, global.memoryPools);
    global.sphereLight = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _light, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SphereLight = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var SphereLight = /*#__PURE__*/function (_Light) {
    _inherits(SphereLight, _Light);

    _createClass(SphereLight, [{
      key: "position",
      get: function get() {
        return this._pos;
      }
    }, {
      key: "size",
      set: function set(size) {
        this._size = size;
      },
      get: function get() {
        return this._size;
      }
    }, {
      key: "range",
      set: function set(range) {
        this._range = range;
        this._needUpdate = true;
      },
      get: function get() {
        return this._range;
      }
    }, {
      key: "luminance",
      set: function set(lum) {
        _memoryPools.LightPool.set(this._handle, _memoryPools.LightView.ILLUMINANCE, lum);
      },
      get: function get() {
        return _memoryPools.LightPool.get(this._handle, _memoryPools.LightView.ILLUMINANCE);
      }
    }, {
      key: "aabb",
      get: function get() {
        return this._aabb;
      }
    }]);

    function SphereLight() {
      var _this;

      _classCallCheck(this, SphereLight);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SphereLight).call(this));
      _this._needUpdate = false;
      _this._size = 0.15;
      _this._range = 1.0;
      _this._pos = void 0;
      _this._aabb = void 0;
      _this._type = _light.LightType.SPHERE;
      _this._aabb = _index.aabb.create();
      _this._pos = new _index2.Vec3();
      return _this;
    }

    _createClass(SphereLight, [{
      key: "initialize",
      value: function initialize() {
        _get(_getPrototypeOf(SphereLight.prototype), "initialize", this).call(this);

        _memoryPools.LightPool.set(this._handle, _memoryPools.LightView.ILLUMINANCE, 1700 / (0, _light.nt2lm)(this._size));
      }
    }, {
      key: "update",
      value: function update() {
        if (this._node && (this._node.hasChangedFlags || this._needUpdate)) {
          this._node.getWorldPosition(this._pos);

          _index.aabb.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, this._range, this._range, this._range);

          this._needUpdate = false;
        }
      }
    }]);

    return SphereLight;
  }(_light.Light);

  _exports.SphereLight = SphereLight;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvc3BoZXJlLWxpZ2h0LnRzIl0sIm5hbWVzIjpbIlNwaGVyZUxpZ2h0IiwiX3BvcyIsInNpemUiLCJfc2l6ZSIsInJhbmdlIiwiX3JhbmdlIiwiX25lZWRVcGRhdGUiLCJsdW0iLCJMaWdodFBvb2wiLCJzZXQiLCJfaGFuZGxlIiwiTGlnaHRWaWV3IiwiSUxMVU1JTkFOQ0UiLCJnZXQiLCJfYWFiYiIsIl90eXBlIiwiTGlnaHRUeXBlIiwiU1BIRVJFIiwiYWFiYiIsImNyZWF0ZSIsIlZlYzMiLCJfbm9kZSIsImhhc0NoYW5nZWRGbGFncyIsImdldFdvcmxkUG9zaXRpb24iLCJ4IiwieSIsInoiLCJMaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BS2FBLFc7Ozs7OzBCQUlPO0FBQ1osZUFBTyxLQUFLQyxJQUFaO0FBQ0g7Ozt3QkFFU0MsSSxFQUFjO0FBQ3BCLGFBQUtDLEtBQUwsR0FBYUQsSUFBYjtBQUNILE87MEJBRW1CO0FBQ2hCLGVBQU8sS0FBS0MsS0FBWjtBQUNIOzs7d0JBRVVDLEssRUFBZTtBQUN0QixhQUFLQyxNQUFMLEdBQWNELEtBQWQ7QUFDQSxhQUFLRSxXQUFMLEdBQW1CLElBQW5CO0FBQ0gsTzswQkFFb0I7QUFDakIsZUFBTyxLQUFLRCxNQUFaO0FBQ0g7Ozt3QkFFY0UsRyxFQUFhO0FBQ3hCQywrQkFBVUMsR0FBVixDQUFjLEtBQUtDLE9BQW5CLEVBQTRCQyx1QkFBVUMsV0FBdEMsRUFBbURMLEdBQW5EO0FBQ0gsTzswQkFFd0I7QUFDckIsZUFBT0MsdUJBQVVLLEdBQVYsQ0FBYyxLQUFLSCxPQUFuQixFQUE0QkMsdUJBQVVDLFdBQXRDLENBQVA7QUFDSDs7OzBCQUVXO0FBQ1IsZUFBTyxLQUFLRSxLQUFaO0FBQ0g7OztBQU9ELDJCQUFlO0FBQUE7O0FBQUE7O0FBQ1g7QUFEVyxZQXhDTFIsV0F3Q0ssR0F4Q1MsS0F3Q1Q7QUFBQSxZQUxMSCxLQUtLLEdBTFcsSUFLWDtBQUFBLFlBSkxFLE1BSUssR0FKWSxHQUlaO0FBQUEsWUFITEosSUFHSztBQUFBLFlBRkxhLEtBRUs7QUFFWCxZQUFLQyxLQUFMLEdBQWFDLGlCQUFVQyxNQUF2QjtBQUNBLFlBQUtILEtBQUwsR0FBYUksWUFBS0MsTUFBTCxFQUFiO0FBQ0EsWUFBS2xCLElBQUwsR0FBWSxJQUFJbUIsWUFBSixFQUFaO0FBSlc7QUFLZDs7OzttQ0FFb0I7QUFDakI7O0FBQ0FaLCtCQUFVQyxHQUFWLENBQWMsS0FBS0MsT0FBbkIsRUFBNEJDLHVCQUFVQyxXQUF0QyxFQUFtRCxPQUFPLGtCQUFNLEtBQUtULEtBQVgsQ0FBMUQ7QUFDSDs7OytCQUVnQjtBQUNiLFlBQUksS0FBS2tCLEtBQUwsS0FBZSxLQUFLQSxLQUFMLENBQVdDLGVBQVgsSUFBOEIsS0FBS2hCLFdBQWxELENBQUosRUFBb0U7QUFDaEUsZUFBS2UsS0FBTCxDQUFXRSxnQkFBWCxDQUE0QixLQUFLdEIsSUFBakM7O0FBQ0FpQixzQkFBS1QsR0FBTCxDQUFTLEtBQUtLLEtBQWQsRUFBcUIsS0FBS2IsSUFBTCxDQUFVdUIsQ0FBL0IsRUFBa0MsS0FBS3ZCLElBQUwsQ0FBVXdCLENBQTVDLEVBQStDLEtBQUt4QixJQUFMLENBQVV5QixDQUF6RCxFQUE0RCxLQUFLckIsTUFBakUsRUFBeUUsS0FBS0EsTUFBOUUsRUFBc0YsS0FBS0EsTUFBM0Y7O0FBQ0EsZUFBS0MsV0FBTCxHQUFtQixLQUFuQjtBQUNIO0FBQ0o7Ozs7SUE1RDRCcUIsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFhYmIgfSBmcm9tICcuLi8uLi9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgTGlnaHQsIExpZ2h0VHlwZSwgbnQybG0gfSBmcm9tICcuL2xpZ2h0JztcclxuaW1wb3J0IHsgTGlnaHRQb29sLCBMaWdodFZpZXcgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcblxyXG5leHBvcnQgY2xhc3MgU3BoZXJlTGlnaHQgZXh0ZW5kcyBMaWdodCB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9uZWVkVXBkYXRlID0gZmFsc2U7XHJcblxyXG4gICAgZ2V0IHBvc2l0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzaXplIChzaXplOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zaXplID0gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l6ZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcmFuZ2UgKHJhbmdlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yYW5nZSA9IHJhbmdlO1xyXG4gICAgICAgIHRoaXMuX25lZWRVcGRhdGUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByYW5nZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGx1bWluYW5jZSAobHVtOiBudW1iZXIpIHtcclxuICAgICAgICBMaWdodFBvb2wuc2V0KHRoaXMuX2hhbmRsZSwgTGlnaHRWaWV3LklMTFVNSU5BTkNFLCBsdW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsdW1pbmFuY2UgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIExpZ2h0UG9vbC5nZXQodGhpcy5faGFuZGxlLCBMaWdodFZpZXcuSUxMVU1JTkFOQ0UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBhYWJiICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWFiYjtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3NpemU6IG51bWJlciA9IDAuMTU7XHJcbiAgICBwcm90ZWN0ZWQgX3JhbmdlOiBudW1iZXIgPSAxLjA7XHJcbiAgICBwcm90ZWN0ZWQgX3BvczogVmVjMztcclxuICAgIHByb3RlY3RlZCBfYWFiYjogYWFiYjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl90eXBlID0gTGlnaHRUeXBlLlNQSEVSRTtcclxuICAgICAgICB0aGlzLl9hYWJiID0gYWFiYi5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLl9wb3MgPSBuZXcgVmVjMygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplICgpIHtcclxuICAgICAgICBzdXBlci5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgTGlnaHRQb29sLnNldCh0aGlzLl9oYW5kbGUsIExpZ2h0Vmlldy5JTExVTUlOQU5DRSwgMTcwMCAvIG50MmxtKHRoaXMuX3NpemUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbm9kZSAmJiAodGhpcy5fbm9kZS5oYXNDaGFuZ2VkRmxhZ3MgfHwgdGhpcy5fbmVlZFVwZGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fbm9kZS5nZXRXb3JsZFBvc2l0aW9uKHRoaXMuX3Bvcyk7XHJcbiAgICAgICAgICAgIGFhYmIuc2V0KHRoaXMuX2FhYmIsIHRoaXMuX3Bvcy54LCB0aGlzLl9wb3MueSwgdGhpcy5fcG9zLnosIHRoaXMuX3JhbmdlLCB0aGlzLl9yYW5nZSwgdGhpcy5fcmFuZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLl9uZWVkVXBkYXRlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==