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
    global.spotLight = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _light, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SpotLight = void 0;

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

  var _forward = new _index2.Vec3(0, 0, -1);

  var _qt = new _index2.Quat();

  var _matView = new _index2.Mat4();

  var _matProj = new _index2.Mat4();

  var _matViewProj = new _index2.Mat4();

  var _matViewProjInv = new _index2.Mat4();

  var SpotLight = /*#__PURE__*/function (_Light) {
    _inherits(SpotLight, _Light);

    _createClass(SpotLight, [{
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
      key: "direction",
      get: function get() {
        return this._dir;
      }
    }, {
      key: "spotAngle",
      get: function get() {
        return this._spotAngle;
      },
      set: function set(val) {
        this._angle = val;
        this._spotAngle = Math.cos(val * 0.5);
        this._needUpdate = true;
      }
    }, {
      key: "aabb",
      get: function get() {
        return this._aabb;
      }
    }, {
      key: "frustum",
      get: function get() {
        return this._frustum;
      }
    }]);

    function SpotLight() {
      var _this;

      _classCallCheck(this, SpotLight);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SpotLight).call(this));
      _this._dir = new _index2.Vec3(1.0, -1.0, -1.0);
      _this._size = 0.15;
      _this._range = 5.0;
      _this._spotAngle = Math.cos(Math.PI / 6);
      _this._pos = void 0;
      _this._aabb = void 0;
      _this._frustum = void 0;
      _this._angle = 0;
      _this._needUpdate = false;
      _this._type = _light.LightType.SPOT;
      _this._aabb = _index.aabb.create();
      _this._frustum = _index.frustum.create();
      _this._pos = new _index2.Vec3();
      return _this;
    }

    _createClass(SpotLight, [{
      key: "initialize",
      value: function initialize() {
        _get(_getPrototypeOf(SpotLight.prototype), "initialize", this).call(this);

        _memoryPools.LightPool.set(this._handle, _memoryPools.LightView.ILLUMINANCE, 1700 / (0, _light.nt2lm)(this._size));
      }
    }, {
      key: "update",
      value: function update() {
        if (this._node && (this._node.hasChangedFlags || this._needUpdate)) {
          this._node.getWorldPosition(this._pos);

          _index2.Vec3.transformQuat(this._dir, _forward, this._node.getWorldRotation(_qt));

          _index2.Vec3.normalize(this._dir, this._dir);

          _memoryPools.LightPool.setVec3(this._handle, _memoryPools.LightView.DIRECTION, this._dir);

          _index.aabb.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, this._range, this._range, this._range); // view matrix


          this._node.getWorldRT(_matView);

          _index2.Mat4.invert(_matView, _matView);

          _index2.Mat4.perspective(_matProj, this._angle, 1, 0.001, this._range); // view-projection


          _index2.Mat4.multiply(_matViewProj, _matProj, _matView); // Mat4.invert(_matViewProjInv, _matViewProj);


          this._frustum.update(_matViewProj, _matViewProjInv);

          this._needUpdate = false;
        }
      }
    }]);

    return SpotLight;
  }(_light.Light);

  _exports.SpotLight = SpotLight;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvc3BvdC1saWdodC50cyJdLCJuYW1lcyI6WyJfZm9yd2FyZCIsIlZlYzMiLCJfcXQiLCJRdWF0IiwiX21hdFZpZXciLCJNYXQ0IiwiX21hdFByb2oiLCJfbWF0Vmlld1Byb2oiLCJfbWF0Vmlld1Byb2pJbnYiLCJTcG90TGlnaHQiLCJfcG9zIiwic2l6ZSIsIl9zaXplIiwicmFuZ2UiLCJfcmFuZ2UiLCJfbmVlZFVwZGF0ZSIsImx1bSIsIkxpZ2h0UG9vbCIsInNldCIsIl9oYW5kbGUiLCJMaWdodFZpZXciLCJJTExVTUlOQU5DRSIsImdldCIsIl9kaXIiLCJfc3BvdEFuZ2xlIiwidmFsIiwiX2FuZ2xlIiwiTWF0aCIsImNvcyIsIl9hYWJiIiwiX2ZydXN0dW0iLCJQSSIsIl90eXBlIiwiTGlnaHRUeXBlIiwiU1BPVCIsImFhYmIiLCJjcmVhdGUiLCJmcnVzdHVtIiwiX25vZGUiLCJoYXNDaGFuZ2VkRmxhZ3MiLCJnZXRXb3JsZFBvc2l0aW9uIiwidHJhbnNmb3JtUXVhdCIsImdldFdvcmxkUm90YXRpb24iLCJub3JtYWxpemUiLCJzZXRWZWMzIiwiRElSRUNUSU9OIiwieCIsInkiLCJ6IiwiZ2V0V29ybGRSVCIsImludmVydCIsInBlcnNwZWN0aXZlIiwibXVsdGlwbHkiLCJ1cGRhdGUiLCJMaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0EsTUFBTUEsUUFBUSxHQUFHLElBQUlDLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQUMsQ0FBaEIsQ0FBakI7O0FBQ0EsTUFBTUMsR0FBRyxHQUFHLElBQUlDLFlBQUosRUFBWjs7QUFDQSxNQUFNQyxRQUFRLEdBQUcsSUFBSUMsWUFBSixFQUFqQjs7QUFDQSxNQUFNQyxRQUFRLEdBQUcsSUFBSUQsWUFBSixFQUFqQjs7QUFDQSxNQUFNRSxZQUFZLEdBQUcsSUFBSUYsWUFBSixFQUFyQjs7QUFDQSxNQUFNRyxlQUFlLEdBQUcsSUFBSUgsWUFBSixFQUF4Qjs7TUFFYUksUzs7Ozs7MEJBV087QUFDWixlQUFPLEtBQUtDLElBQVo7QUFDSDs7O3dCQUVTQyxJLEVBQWM7QUFDcEIsYUFBS0MsS0FBTCxHQUFhRCxJQUFiO0FBQ0gsTzswQkFFbUI7QUFDaEIsZUFBTyxLQUFLQyxLQUFaO0FBQ0g7Ozt3QkFFVUMsSyxFQUFlO0FBQ3RCLGFBQUtDLE1BQUwsR0FBY0QsS0FBZDtBQUNBLGFBQUtFLFdBQUwsR0FBbUIsSUFBbkI7QUFDSCxPOzBCQUVvQjtBQUNqQixlQUFPLEtBQUtELE1BQVo7QUFDSDs7O3dCQUVjRSxHLEVBQWE7QUFDeEJDLCtCQUFVQyxHQUFWLENBQWMsS0FBS0MsT0FBbkIsRUFBNEJDLHVCQUFVQyxXQUF0QyxFQUFtREwsR0FBbkQ7QUFDSCxPOzBCQUV3QjtBQUNyQixlQUFPQyx1QkFBVUssR0FBVixDQUFjLEtBQUtILE9BQW5CLEVBQTRCQyx1QkFBVUMsV0FBdEMsQ0FBUDtBQUNIOzs7MEJBRXNCO0FBQ25CLGVBQU8sS0FBS0UsSUFBWjtBQUNIOzs7MEJBRWdCO0FBQ2IsZUFBTyxLQUFLQyxVQUFaO0FBQ0gsTzt3QkFFY0MsRyxFQUFhO0FBQ3hCLGFBQUtDLE1BQUwsR0FBY0QsR0FBZDtBQUNBLGFBQUtELFVBQUwsR0FBa0JHLElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxHQUFHLEdBQUcsR0FBZixDQUFsQjtBQUNBLGFBQUtWLFdBQUwsR0FBbUIsSUFBbkI7QUFDSDs7OzBCQUVXO0FBQ1IsZUFBTyxLQUFLYyxLQUFaO0FBQ0g7OzswQkFFYztBQUNYLGVBQU8sS0FBS0MsUUFBWjtBQUNIOzs7QUFFRCx5QkFBZTtBQUFBOztBQUFBOztBQUNYO0FBRFcsWUE3RExQLElBNkRLLEdBN0RRLElBQUl0QixZQUFKLENBQVMsR0FBVCxFQUFjLENBQUMsR0FBZixFQUFvQixDQUFDLEdBQXJCLENBNkRSO0FBQUEsWUE1RExXLEtBNERLLEdBNURXLElBNERYO0FBQUEsWUEzRExFLE1BMkRLLEdBM0RZLEdBMkRaO0FBQUEsWUExRExVLFVBMERLLEdBMURnQkcsSUFBSSxDQUFDQyxHQUFMLENBQVNELElBQUksQ0FBQ0ksRUFBTCxHQUFVLENBQW5CLENBMERoQjtBQUFBLFlBekRMckIsSUF5REs7QUFBQSxZQXhETG1CLEtBd0RLO0FBQUEsWUF2RExDLFFBdURLO0FBQUEsWUF0RExKLE1Bc0RLLEdBdERZLENBc0RaO0FBQUEsWUFyRExYLFdBcURLLEdBckRTLEtBcURUO0FBRVgsWUFBS2lCLEtBQUwsR0FBYUMsaUJBQVVDLElBQXZCO0FBQ0EsWUFBS0wsS0FBTCxHQUFhTSxZQUFLQyxNQUFMLEVBQWI7QUFDQSxZQUFLTixRQUFMLEdBQWdCTyxlQUFRRCxNQUFSLEVBQWhCO0FBQ0EsWUFBSzFCLElBQUwsR0FBWSxJQUFJVCxZQUFKLEVBQVo7QUFMVztBQU1kOzs7O21DQUVvQjtBQUNqQjs7QUFDQWdCLCtCQUFVQyxHQUFWLENBQWMsS0FBS0MsT0FBbkIsRUFBNEJDLHVCQUFVQyxXQUF0QyxFQUFtRCxPQUFPLGtCQUFNLEtBQUtULEtBQVgsQ0FBMUQ7QUFDSDs7OytCQUVnQjtBQUNiLFlBQUksS0FBSzBCLEtBQUwsS0FBZSxLQUFLQSxLQUFMLENBQVdDLGVBQVgsSUFBOEIsS0FBS3hCLFdBQWxELENBQUosRUFBb0U7QUFDaEUsZUFBS3VCLEtBQUwsQ0FBV0UsZ0JBQVgsQ0FBNEIsS0FBSzlCLElBQWpDOztBQUNBVCx1QkFBS3dDLGFBQUwsQ0FBbUIsS0FBS2xCLElBQXhCLEVBQThCdkIsUUFBOUIsRUFBd0MsS0FBS3NDLEtBQUwsQ0FBV0ksZ0JBQVgsQ0FBNEJ4QyxHQUE1QixDQUF4Qzs7QUFDQUQsdUJBQUswQyxTQUFMLENBQWUsS0FBS3BCLElBQXBCLEVBQTBCLEtBQUtBLElBQS9COztBQUNBTixpQ0FBVTJCLE9BQVYsQ0FBa0IsS0FBS3pCLE9BQXZCLEVBQWdDQyx1QkFBVXlCLFNBQTFDLEVBQXFELEtBQUt0QixJQUExRDs7QUFDQVksc0JBQUtqQixHQUFMLENBQVMsS0FBS1csS0FBZCxFQUFxQixLQUFLbkIsSUFBTCxDQUFVb0MsQ0FBL0IsRUFBa0MsS0FBS3BDLElBQUwsQ0FBVXFDLENBQTVDLEVBQStDLEtBQUtyQyxJQUFMLENBQVVzQyxDQUF6RCxFQUE0RCxLQUFLbEMsTUFBakUsRUFBeUUsS0FBS0EsTUFBOUUsRUFBc0YsS0FBS0EsTUFBM0YsRUFMZ0UsQ0FPaEU7OztBQUNBLGVBQUt3QixLQUFMLENBQVdXLFVBQVgsQ0FBc0I3QyxRQUF0Qjs7QUFDQUMsdUJBQUs2QyxNQUFMLENBQVk5QyxRQUFaLEVBQXNCQSxRQUF0Qjs7QUFFQUMsdUJBQUs4QyxXQUFMLENBQWlCN0MsUUFBakIsRUFBMkIsS0FBS29CLE1BQWhDLEVBQXdDLENBQXhDLEVBQTJDLEtBQTNDLEVBQWtELEtBQUtaLE1BQXZELEVBWGdFLENBYWhFOzs7QUFDQVQsdUJBQUsrQyxRQUFMLENBQWM3QyxZQUFkLEVBQTRCRCxRQUE1QixFQUFzQ0YsUUFBdEMsRUFkZ0UsQ0FlaEU7OztBQUVBLGVBQUswQixRQUFMLENBQWN1QixNQUFkLENBQXFCOUMsWUFBckIsRUFBbUNDLGVBQW5DOztBQUNBLGVBQUtPLFdBQUwsR0FBbUIsS0FBbkI7QUFDSDtBQUNKOzs7O0lBaEcwQnVDLFkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhYWJiLCBmcnVzdHVtIH0gZnJvbSAnLi4vLi4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBNYXQ0LCBRdWF0LCBWZWMzIH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IExpZ2h0LCBMaWdodFR5cGUsIG50MmxtIH0gZnJvbSAnLi9saWdodCc7XHJcbmltcG9ydCB7IExpZ2h0UG9vbCwgTGlnaHRWaWV3IH0gZnJvbSAnLi4vY29yZS9tZW1vcnktcG9vbHMnO1xyXG5cclxuY29uc3QgX2ZvcndhcmQgPSBuZXcgVmVjMygwLCAwLCAtMSk7XHJcbmNvbnN0IF9xdCA9IG5ldyBRdWF0KCk7XHJcbmNvbnN0IF9tYXRWaWV3ID0gbmV3IE1hdDQoKTtcclxuY29uc3QgX21hdFByb2ogPSBuZXcgTWF0NCgpO1xyXG5jb25zdCBfbWF0Vmlld1Byb2ogPSBuZXcgTWF0NCgpO1xyXG5jb25zdCBfbWF0Vmlld1Byb2pJbnYgPSBuZXcgTWF0NCgpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNwb3RMaWdodCBleHRlbmRzIExpZ2h0IHtcclxuICAgIHByb3RlY3RlZCBfZGlyOiBWZWMzID0gbmV3IFZlYzMoMS4wLCAtMS4wLCAtMS4wKTtcclxuICAgIHByb3RlY3RlZCBfc2l6ZTogbnVtYmVyID0gMC4xNTtcclxuICAgIHByb3RlY3RlZCBfcmFuZ2U6IG51bWJlciA9IDUuMDtcclxuICAgIHByb3RlY3RlZCBfc3BvdEFuZ2xlOiBudW1iZXIgPSBNYXRoLmNvcyhNYXRoLlBJIC8gNik7XHJcbiAgICBwcm90ZWN0ZWQgX3BvczogVmVjMztcclxuICAgIHByb3RlY3RlZCBfYWFiYjogYWFiYjtcclxuICAgIHByb3RlY3RlZCBfZnJ1c3R1bTogZnJ1c3R1bTtcclxuICAgIHByb3RlY3RlZCBfYW5nbGU6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX25lZWRVcGRhdGUgPSBmYWxzZTtcclxuXHJcbiAgICBnZXQgcG9zaXRpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNpemUgKHNpemU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NpemUgPSBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXplICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByYW5nZSAocmFuZ2U6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlID0gcmFuZ2U7XHJcbiAgICAgICAgdGhpcy5fbmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHJhbmdlICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yYW5nZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbHVtaW5hbmNlIChsdW06IG51bWJlcikge1xyXG4gICAgICAgIExpZ2h0UG9vbC5zZXQodGhpcy5faGFuZGxlLCBMaWdodFZpZXcuSUxMVU1JTkFOQ0UsIGx1bSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGx1bWluYW5jZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTGlnaHRQb29sLmdldCh0aGlzLl9oYW5kbGUsIExpZ2h0Vmlldy5JTExVTUlOQU5DRSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRpcmVjdGlvbiAoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3BvdEFuZ2xlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3BvdEFuZ2xlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzcG90QW5nbGUgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fYW5nbGUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5fc3BvdEFuZ2xlID0gTWF0aC5jb3ModmFsICogMC41KTtcclxuICAgICAgICB0aGlzLl9uZWVkVXBkYXRlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYWFiYiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FhYmI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZydXN0dW0gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mcnVzdHVtO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBMaWdodFR5cGUuU1BPVDtcclxuICAgICAgICB0aGlzLl9hYWJiID0gYWFiYi5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLl9mcnVzdHVtID0gZnJ1c3R1bS5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLl9wb3MgPSBuZXcgVmVjMygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplICgpIHtcclxuICAgICAgICBzdXBlci5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgTGlnaHRQb29sLnNldCh0aGlzLl9oYW5kbGUsIExpZ2h0Vmlldy5JTExVTUlOQU5DRSwgMTcwMCAvIG50MmxtKHRoaXMuX3NpemUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbm9kZSAmJiAodGhpcy5fbm9kZS5oYXNDaGFuZ2VkRmxhZ3MgfHwgdGhpcy5fbmVlZFVwZGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fbm9kZS5nZXRXb3JsZFBvc2l0aW9uKHRoaXMuX3Bvcyk7XHJcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdCh0aGlzLl9kaXIsIF9mb3J3YXJkLCB0aGlzLl9ub2RlLmdldFdvcmxkUm90YXRpb24oX3F0KSk7XHJcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKHRoaXMuX2RpciwgdGhpcy5fZGlyKTtcclxuICAgICAgICAgICAgTGlnaHRQb29sLnNldFZlYzModGhpcy5faGFuZGxlLCBMaWdodFZpZXcuRElSRUNUSU9OLCB0aGlzLl9kaXIpO1xyXG4gICAgICAgICAgICBhYWJiLnNldCh0aGlzLl9hYWJiLCB0aGlzLl9wb3MueCwgdGhpcy5fcG9zLnksIHRoaXMuX3Bvcy56LCB0aGlzLl9yYW5nZSwgdGhpcy5fcmFuZ2UsIHRoaXMuX3JhbmdlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHZpZXcgbWF0cml4XHJcbiAgICAgICAgICAgIHRoaXMuX25vZGUuZ2V0V29ybGRSVChfbWF0Vmlldyk7XHJcbiAgICAgICAgICAgIE1hdDQuaW52ZXJ0KF9tYXRWaWV3LCBfbWF0Vmlldyk7XHJcblxyXG4gICAgICAgICAgICBNYXQ0LnBlcnNwZWN0aXZlKF9tYXRQcm9qLCB0aGlzLl9hbmdsZSwgMSwgMC4wMDEsIHRoaXMuX3JhbmdlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHZpZXctcHJvamVjdGlvblxyXG4gICAgICAgICAgICBNYXQ0Lm11bHRpcGx5KF9tYXRWaWV3UHJvaiwgX21hdFByb2osIF9tYXRWaWV3KTtcclxuICAgICAgICAgICAgLy8gTWF0NC5pbnZlcnQoX21hdFZpZXdQcm9qSW52LCBfbWF0Vmlld1Byb2opO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZnJ1c3R1bS51cGRhdGUoX21hdFZpZXdQcm9qLCBfbWF0Vmlld1Byb2pJbnYpO1xyXG4gICAgICAgICAgICB0aGlzLl9uZWVkVXBkYXRlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==