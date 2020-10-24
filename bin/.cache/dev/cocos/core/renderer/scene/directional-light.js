(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../math/index.js", "./ambient.js", "./light.js", "../core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../math/index.js"), require("./ambient.js"), require("./light.js"), require("../core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.ambient, global.light, global.memoryPools);
    global.directionalLight = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _ambient, _light, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.DirectionalLight = void 0;

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

  var _forward = new _index.Vec3(0, 0, -1);

  var _v3 = new _index.Vec3();

  var _qt = new _index.Quat();

  var DirectionalLight = /*#__PURE__*/function (_Light) {
    _inherits(DirectionalLight, _Light);

    _createClass(DirectionalLight, [{
      key: "shadowRange",
      set: function set(shadowRange) {
        this._shadowRange = shadowRange;
      },
      get: function get() {
        return this._shadowRange;
      }
    }, {
      key: "shadowIntensitywRange",
      set: function set(shadowIntensity) {
        this._shadowIntensity = shadowIntensity;
      }
    }, {
      key: "shadowIntensity",
      get: function get() {
        return this._shadowIntensity;
      }
    }, {
      key: "shadowFadeDistance",
      set: function set(shadowFadeDistance) {
        this._shadowFadeDistance = shadowFadeDistance;
      },
      get: function get() {
        return this._shadowFadeDistance;
      }
    }, {
      key: "shadowDistance",
      set: function set(shadowDistance) {
        this._shadowDistance = shadowDistance;
      },
      get: function get() {
        return this._shadowDistance;
      }
    }, {
      key: "fadeStart",
      set: function set(fadeStart) {
        this._fadeStart = fadeStart;
      },
      get: function get() {
        return this._fadeStart;
      }
    }, {
      key: "splits",
      set: function set(splits) {
        this._splits = splits;
      },
      get: function get() {
        return this._splits;
      }
    }, {
      key: "biasAutoAdjust",
      set: function set(biasAutoAdjust) {
        this._biasAutoAdjust = biasAutoAdjust;
      },
      get: function get() {
        return this._biasAutoAdjust;
      }
    }, {
      key: "direction",
      set: function set(dir) {
        this._dir = dir;

        _index.Vec3.normalize(this._dir, this._dir);

        _memoryPools.LightPool.setVec3(this._handle, _memoryPools.LightView.DIRECTION, this._dir);
      },
      get: function get() {
        return this._dir;
      } // in Lux(lx)

    }, {
      key: "illuminance",
      set: function set(illum) {
        _memoryPools.LightPool.set(this._handle, _memoryPools.LightView.ILLUMINANCE, illum);
      },
      get: function get() {
        return _memoryPools.LightPool.get(this._handle, _memoryPools.LightView.ILLUMINANCE);
      }
    }]);

    function DirectionalLight() {
      var _this;

      _classCallCheck(this, DirectionalLight);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DirectionalLight).call(this));
      _this._dir = new _index.Vec3(1.0, -1.0, -1.0);
      _this._shadowRange = 1000.0;
      _this._shadowIntensity = 0.0;
      _this._shadowFadeDistance = 0.0;
      _this._shadowDistance = 0.0;
      _this._fadeStart = 0.8;
      _this._splits = new _index.Vec4(1.0, 0.0, 0.0, 0.0);
      _this._biasAutoAdjust = 1.0;
      _this._type = _light.LightType.DIRECTIONAL;
      return _this;
    }

    _createClass(DirectionalLight, [{
      key: "initialize",
      value: function initialize() {
        _get(_getPrototypeOf(DirectionalLight.prototype), "initialize", this).call(this);

        _memoryPools.LightPool.set(this._handle, _memoryPools.LightView.ILLUMINANCE, _ambient.Ambient.SUN_ILLUM);

        _memoryPools.LightPool.setVec3(this._handle, _memoryPools.LightView.DIRECTION, this._dir);
      }
    }, {
      key: "update",
      value: function update() {
        if (this._node && this._node.hasChangedFlags) {
          this._dir = _index.Vec3.transformQuat(_v3, _forward, this._node.getWorldRotation(_qt));

          _index.Vec3.normalize(this._dir, this._dir);
        }
      }
    }]);

    return DirectionalLight;
  }(_light.Light);

  _exports.DirectionalLight = DirectionalLight;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvZGlyZWN0aW9uYWwtbGlnaHQudHMiXSwibmFtZXMiOlsiX2ZvcndhcmQiLCJWZWMzIiwiX3YzIiwiX3F0IiwiUXVhdCIsIkRpcmVjdGlvbmFsTGlnaHQiLCJzaGFkb3dSYW5nZSIsIl9zaGFkb3dSYW5nZSIsInNoYWRvd0ludGVuc2l0eSIsIl9zaGFkb3dJbnRlbnNpdHkiLCJzaGFkb3dGYWRlRGlzdGFuY2UiLCJfc2hhZG93RmFkZURpc3RhbmNlIiwic2hhZG93RGlzdGFuY2UiLCJfc2hhZG93RGlzdGFuY2UiLCJmYWRlU3RhcnQiLCJfZmFkZVN0YXJ0Iiwic3BsaXRzIiwiX3NwbGl0cyIsImJpYXNBdXRvQWRqdXN0IiwiX2JpYXNBdXRvQWRqdXN0IiwiZGlyIiwiX2RpciIsIm5vcm1hbGl6ZSIsIkxpZ2h0UG9vbCIsInNldFZlYzMiLCJfaGFuZGxlIiwiTGlnaHRWaWV3IiwiRElSRUNUSU9OIiwiaWxsdW0iLCJzZXQiLCJJTExVTUlOQU5DRSIsImdldCIsIlZlYzQiLCJfdHlwZSIsIkxpZ2h0VHlwZSIsIkRJUkVDVElPTkFMIiwiQW1iaWVudCIsIlNVTl9JTExVTSIsIl9ub2RlIiwiaGFzQ2hhbmdlZEZsYWdzIiwidHJhbnNmb3JtUXVhdCIsImdldFdvcmxkUm90YXRpb24iLCJMaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0EsTUFBTUEsUUFBUSxHQUFHLElBQUlDLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQUMsQ0FBaEIsQ0FBakI7O0FBQ0EsTUFBTUMsR0FBRyxHQUFHLElBQUlELFdBQUosRUFBWjs7QUFDQSxNQUFNRSxHQUFHLEdBQUcsSUFBSUMsV0FBSixFQUFaOztNQUVhQyxnQjs7Ozs7d0JBRWVDLFcsRUFBcUI7QUFDekMsYUFBS0MsWUFBTCxHQUFvQkQsV0FBcEI7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QixFQUEwQixLQUFLQSxJQUEvQjtBQUNIO0FBQ0o7Ozs7SUExR2lDcUIsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFF1YXQsIFZlYzMsIFZlYzQgfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgQW1iaWVudCB9IGZyb20gJy4vYW1iaWVudCc7XHJcbmltcG9ydCB7IExpZ2h0LCBMaWdodFR5cGUgfSBmcm9tICcuL2xpZ2h0JztcclxuaW1wb3J0IHsgTGlnaHRQb29sLCBMaWdodFZpZXcgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcblxyXG5jb25zdCBfZm9yd2FyZCA9IG5ldyBWZWMzKDAsIDAsIC0xKTtcclxuY29uc3QgX3YzID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX3F0ID0gbmV3IFF1YXQoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBEaXJlY3Rpb25hbExpZ2h0IGV4dGVuZHMgTGlnaHQge1xyXG5cclxuICAgIHB1YmxpYyBzZXQgc2hhZG93UmFuZ2UgKHNoYWRvd1JhbmdlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zaGFkb3dSYW5nZSA9IHNoYWRvd1JhbmdlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2hhZG93UmFuZ2UgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dSYW5nZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNoYWRvd0ludGVuc2l0eXdSYW5nZSAoc2hhZG93SW50ZW5zaXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zaGFkb3dJbnRlbnNpdHkgPSBzaGFkb3dJbnRlbnNpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzaGFkb3dJbnRlbnNpdHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dJbnRlbnNpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzaGFkb3dGYWRlRGlzdGFuY2UgKHNoYWRvd0ZhZGVEaXN0YW5jZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhZG93RmFkZURpc3RhbmNlID0gc2hhZG93RmFkZURpc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2hhZG93RmFkZURpc3RhbmNlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93RmFkZURpc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc2hhZG93RGlzdGFuY2UgKHNoYWRvd0Rpc3RhbmNlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zaGFkb3dEaXN0YW5jZSA9IHNoYWRvd0Rpc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2hhZG93RGlzdGFuY2UgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dEaXN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGZhZGVTdGFydCAoZmFkZVN0YXJ0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mYWRlU3RhcnQgPSBmYWRlU3RhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBmYWRlU3RhcnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mYWRlU3RhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzcGxpdHMgKHNwbGl0czogVmVjNCkge1xyXG4gICAgICAgIHRoaXMuX3NwbGl0cyA9IHNwbGl0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNwbGl0cyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NwbGl0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGJpYXNBdXRvQWRqdXN0IChiaWFzQXV0b0FkanVzdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fYmlhc0F1dG9BZGp1c3QgPSBiaWFzQXV0b0FkanVzdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGJpYXNBdXRvQWRqdXN0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmlhc0F1dG9BZGp1c3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kaXI6IFZlYzMgPSBuZXcgVmVjMygxLjAsIC0xLjAsIC0xLjApO1xyXG5cclxuICAgIC8vIHNoYWRvd1xyXG4gICAgcHJpdmF0ZSBfc2hhZG93UmFuZ2U6IG51bWJlciA9IDEwMDAuMDtcclxuICAgIHByaXZhdGUgX3NoYWRvd0ludGVuc2l0eTogbnVtYmVyID0gMC4wO1xyXG4gICAgcHJpdmF0ZSBfc2hhZG93RmFkZURpc3RhbmNlOiBudW1iZXIgPSAwLjA7XHJcbiAgICBwcml2YXRlIF9zaGFkb3dEaXN0YW5jZTogbnVtYmVyID0gMC4wO1xyXG5cclxuICAgIC8vIENhc2NhZGVkIHNoYWRvdyBtYXAgcGFyYW1ldGVycy5cclxuICAgIHByaXZhdGUgX2ZhZGVTdGFydDogbnVtYmVyID0gMC44O1xyXG4gICAgcHJpdmF0ZSBfc3BsaXRzOiBWZWM0ID0gbmV3IFZlYzQoMS4wLCAwLjAsIDAuMCwgMC4wKTtcclxuICAgIHByaXZhdGUgX2JpYXNBdXRvQWRqdXN0OiBudW1iZXIgPSAxLjA7XHJcblxyXG4gICAgc2V0IGRpcmVjdGlvbiAoZGlyOiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy5fZGlyID0gZGlyO1xyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKHRoaXMuX2RpciwgdGhpcy5fZGlyKTtcclxuICAgICAgICBMaWdodFBvb2wuc2V0VmVjMyh0aGlzLl9oYW5kbGUsIExpZ2h0Vmlldy5ESVJFQ1RJT04sIHRoaXMuX2Rpcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRpcmVjdGlvbiAoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpbiBMdXgobHgpXHJcbiAgICBzZXQgaWxsdW1pbmFuY2UgKGlsbHVtOiBudW1iZXIpIHtcclxuICAgICAgICBMaWdodFBvb2wuc2V0KHRoaXMuX2hhbmRsZSwgTGlnaHRWaWV3LklMTFVNSU5BTkNFLCBpbGx1bSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlsbHVtaW5hbmNlICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBMaWdodFBvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgTGlnaHRWaWV3LklMTFVNSU5BTkNFKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl90eXBlID0gTGlnaHRUeXBlLkRJUkVDVElPTkFMO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplICgpIHtcclxuICAgICAgICBzdXBlci5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgTGlnaHRQb29sLnNldCh0aGlzLl9oYW5kbGUsIExpZ2h0Vmlldy5JTExVTUlOQU5DRSwgQW1iaWVudC5TVU5fSUxMVU0pO1xyXG4gICAgICAgIExpZ2h0UG9vbC5zZXRWZWMzKHRoaXMuX2hhbmRsZSwgTGlnaHRWaWV3LkRJUkVDVElPTiwgdGhpcy5fZGlyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbm9kZSAmJiB0aGlzLl9ub2RlLmhhc0NoYW5nZWRGbGFncykge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXIgPSBWZWMzLnRyYW5zZm9ybVF1YXQoX3YzLCBfZm9yd2FyZCwgdGhpcy5fbm9kZS5nZXRXb3JsZFJvdGF0aW9uKF9xdCkpO1xyXG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZSh0aGlzLl9kaXIsIHRoaXMuX2Rpcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==