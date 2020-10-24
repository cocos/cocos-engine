(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "./ammo-shape.js", "../../../core/index.js", "../ammo-util.js", "../ammo-enum.js", "../ammo-const.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("./ammo-shape.js"), require("../../../core/index.js"), require("../ammo-util.js"), require("../ammo-enum.js"), require("../ammo-const.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.ammoShape, global.index, global.ammoUtil, global.ammoEnum, global.ammoConst);
    global.ammoTerrainShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoShape, _index, _ammoUtil, _ammoEnum, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoTerrainShape = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var AmmoTerrainShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoTerrainShape, _AmmoShape);

    _createClass(AmmoTerrainShape, [{
      key: "setTerrain",
      value: function setTerrain(v) {
        if (!this._isBinding) return;

        if (this._btShape != null && this._btShape != _ammoConst.AmmoConstant.instance.EMPTY_SHAPE) {
          // TODO: change the terrain asset after initialization
          (0, _index.warn)("[Physics] Ammo change the terrain asset after initialization is not support.");
        } else {
          var terrain = v;

          if (terrain) {
            this._terrainID = terrain._uuid;
            this._tileSize = terrain.tileSize;
            var sizeI = terrain.getVertexCountI();
            var sizeJ = terrain.getVertexCountJ();
            this._buffPtr = _ammoInstantiated.default._malloc(4 * sizeI * sizeJ);
            var offset = 0;
            var maxHeight = Number.MIN_VALUE;
            var minHeight = Number.MAX_VALUE;

            for (var j = 0; j < sizeJ; j++) {
              for (var i = 0; i < sizeI; i++) {
                var _v = terrain.getHeight(i, j);

                _ammoInstantiated.default.HEAPF32[this._buffPtr + offset >> 2] = _v;
                maxHeight = maxHeight < _v ? _v : maxHeight;
                minHeight = minHeight > _v ? _v : minHeight;
                offset += 4;
              }
            }

            maxHeight += 0.1;
            minHeight -= 0.1;

            this._localOffset.set((sizeI - 1) / 2 * this._tileSize, (maxHeight + minHeight) / 2, (sizeJ - 1) / 2 * this._tileSize);

            var heightScale = 1;
            var hdt = "PHY_FLOAT";
            var upAxis = 1;
            var flipQuadEdges = false;
            this._btShape = new _ammoInstantiated.default.btHeightfieldTerrainShape(sizeI, sizeJ, this._buffPtr, heightScale, minHeight, maxHeight, upAxis, hdt, flipQuadEdges);
            this.scale.setValue(this._tileSize, 1, this._tileSize);

            this._btShape.setLocalScaling(this.scale);
          } else {
            this._btShape = _ammoConst.AmmoConstant.instance.EMPTY_SHAPE;
          }
        }
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }, {
      key: "impl",
      get: function get() {
        return this._btShape;
      }
    }]);

    function AmmoTerrainShape() {
      var _this;

      _classCallCheck(this, AmmoTerrainShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoTerrainShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.TERRAIN_SHAPE_PROXYTYPE));
      _this._terrainID = void 0;
      _this._buffPtr = void 0;
      _this._tileSize = void 0;
      _this._localOffset = void 0;
      _this._terrainID = '';
      _this._buffPtr = 0;
      _this._tileSize = 0;
      _this._localOffset = new _index.Vec3();
      return _this;
    }

    _createClass(AmmoTerrainShape, [{
      key: "onComponentSet",
      value: function onComponentSet() {
        this.setTerrain(this.collider.terrain);
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._buffPtr) _ammoInstantiated.default['_free'](this._buffPtr);

        _get(_getPrototypeOf(AmmoTerrainShape.prototype), "onDestroy", this).call(this);
      }
    }, {
      key: "setCompound",
      value: function setCompound(compound) {
        _get(_getPrototypeOf(AmmoTerrainShape.prototype), "setCompound", this).call(this, compound);

        this.impl.setUserIndex(this._index);
      }
    }, {
      key: "setCenter",
      value: function setCenter(v) {
        _index.Vec3.copy(_ammoConst.CC_V3_0, v);

        _ammoConst.CC_V3_0.add(this._localOffset);

        _ammoConst.CC_V3_0.multiply(this._collider.node.worldScale);

        (0, _ammoUtil.cocos2AmmoVec3)(this.transform.getOrigin(), _ammoConst.CC_V3_0);
        this.updateCompoundTransform();
      } // setScale () {
      //     // TODO: handle scale
      // }

    }]);

    return AmmoTerrainShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoTerrainShape = AmmoTerrainShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby10ZXJyYWluLXNoYXBlLnRzIl0sIm5hbWVzIjpbIkFtbW9UZXJyYWluU2hhcGUiLCJ2IiwiX2lzQmluZGluZyIsIl9idFNoYXBlIiwiQW1tb0NvbnN0YW50IiwiaW5zdGFuY2UiLCJFTVBUWV9TSEFQRSIsInRlcnJhaW4iLCJfdGVycmFpbklEIiwiX3V1aWQiLCJfdGlsZVNpemUiLCJ0aWxlU2l6ZSIsInNpemVJIiwiZ2V0VmVydGV4Q291bnRJIiwic2l6ZUoiLCJnZXRWZXJ0ZXhDb3VudEoiLCJfYnVmZlB0ciIsIkFtbW8iLCJfbWFsbG9jIiwib2Zmc2V0IiwibWF4SGVpZ2h0IiwiTnVtYmVyIiwiTUlOX1ZBTFVFIiwibWluSGVpZ2h0IiwiTUFYX1ZBTFVFIiwiaiIsImkiLCJnZXRIZWlnaHQiLCJIRUFQRjMyIiwiX2xvY2FsT2Zmc2V0Iiwic2V0IiwiaGVpZ2h0U2NhbGUiLCJoZHQiLCJ1cEF4aXMiLCJmbGlwUXVhZEVkZ2VzIiwiYnRIZWlnaHRmaWVsZFRlcnJhaW5TaGFwZSIsInNjYWxlIiwic2V0VmFsdWUiLCJzZXRMb2NhbFNjYWxpbmciLCJfY29sbGlkZXIiLCJBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzIiwiVEVSUkFJTl9TSEFQRV9QUk9YWVRZUEUiLCJWZWMzIiwic2V0VGVycmFpbiIsImNvbGxpZGVyIiwiY29tcG91bmQiLCJpbXBsIiwic2V0VXNlckluZGV4IiwiX2luZGV4IiwiY29weSIsIkNDX1YzXzAiLCJhZGQiLCJtdWx0aXBseSIsIm5vZGUiLCJ3b3JsZFNjYWxlIiwidHJhbnNmb3JtIiwiZ2V0T3JpZ2luIiwidXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0iLCJBbW1vU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVdhQSxnQjs7Ozs7aUNBVUdDLEMsRUFBK0I7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QkFFa0I7QUFDZixlQUFPLEtBQUtwQyxRQUFaO0FBQ0g7OztBQW9ERCxnQ0FBZTtBQUFBOztBQUFBOztBQUNYLDRGQUFNcUMsb0NBQTBCQyx1QkFBaEM7QUFEVyxZQUxQakMsVUFLTztBQUFBLFlBSlBRLFFBSU87QUFBQSxZQUhQTixTQUdPO0FBQUEsWUFGUG1CLFlBRU87QUFFWCxZQUFLckIsVUFBTCxHQUFrQixFQUFsQjtBQUNBLFlBQUtRLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxZQUFLTixTQUFMLEdBQWlCLENBQWpCO0FBQ0EsWUFBS21CLFlBQUwsR0FBb0IsSUFBSWEsV0FBSixFQUFwQjtBQUxXO0FBTWQ7Ozs7dUNBRWlCO0FBQ2QsYUFBS0MsVUFBTCxDQUFnQixLQUFLQyxRQUFMLENBQWNyQyxPQUE5QjtBQUNIOzs7a0NBRVk7QUFDVCxZQUFJLEtBQUtTLFFBQVQsRUFBbUJDLDBCQUFLLE9BQUwsRUFBYyxLQUFLRCxRQUFuQjs7QUFDbkI7QUFDSDs7O2tDQUVZNkIsUSxFQUF1QztBQUNoRCwwRkFBa0JBLFFBQWxCOztBQUNBLGFBQUtDLElBQUwsQ0FBVUMsWUFBVixDQUF1QixLQUFLQyxNQUE1QjtBQUNIOzs7Z0NBRVUvQyxDLEVBQWM7QUFDckJ5QyxvQkFBS08sSUFBTCxDQUFVQyxrQkFBVixFQUFtQmpELENBQW5COztBQUNBaUQsMkJBQVFDLEdBQVIsQ0FBWSxLQUFLdEIsWUFBakI7O0FBQ0FxQiwyQkFBUUUsUUFBUixDQUFpQixLQUFLYixTQUFMLENBQWVjLElBQWYsQ0FBb0JDLFVBQXJDOztBQUNBLHNDQUFlLEtBQUtDLFNBQUwsQ0FBZUMsU0FBZixFQUFmLEVBQTJDTixrQkFBM0M7QUFDQSxhQUFLTyx1QkFBTDtBQUNILE8sQ0FFRDtBQUNBO0FBQ0E7Ozs7O0lBNUZrQ0Msb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW1tbyBmcm9tICcuLi9hbW1vLWluc3RhbnRpYXRlZCc7XHJcbmltcG9ydCB7IEFtbW9TaGFwZSB9IGZyb20gXCIuL2FtbW8tc2hhcGVcIjtcclxuaW1wb3J0IHsgVmVjMywgd2FybiB9IGZyb20gXCIuLi8uLi8uLi9jb3JlXCI7XHJcbmltcG9ydCB7IFRlcnJhaW5Db2xsaWRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBjb2NvczJBbW1vVmVjMyB9IGZyb20gJy4uL2FtbW8tdXRpbCc7XHJcbmltcG9ydCB7IEFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMgfSBmcm9tICcuLi9hbW1vLWVudW0nO1xyXG5pbXBvcnQgeyBJVGVycmFpblNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBJVGVycmFpbkFzc2V0IH0gZnJvbSAnLi4vLi4vc3BlYy9pLWV4dGVybmFsJztcclxuaW1wb3J0IHsgQ0NfVjNfMCwgQW1tb0NvbnN0YW50IH0gZnJvbSAnLi4vYW1tby1jb25zdCc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQW1tb1RlcnJhaW5TaGFwZSBleHRlbmRzIEFtbW9TaGFwZSBpbXBsZW1lbnRzIElUZXJyYWluU2hhcGUge1xyXG5cclxuICAgIHB1YmxpYyBnZXQgY29sbGlkZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xsaWRlciBhcyBUZXJyYWluQ29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYnRTaGFwZSBhcyBBbW1vLmJ0SGVpZ2h0ZmllbGRUZXJyYWluU2hhcGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGVycmFpbiAodjogSVRlcnJhaW5Bc3NldCB8IG51bGwpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzQmluZGluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fYnRTaGFwZSAhPSBudWxsICYmIHRoaXMuX2J0U2hhcGUgIT0gQW1tb0NvbnN0YW50Lmluc3RhbmNlLkVNUFRZX1NIQVBFKSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IGNoYW5nZSB0aGUgdGVycmFpbiBhc3NldCBhZnRlciBpbml0aWFsaXphdGlvblxyXG4gICAgICAgICAgICB3YXJuKFwiW1BoeXNpY3NdIEFtbW8gY2hhbmdlIHRoZSB0ZXJyYWluIGFzc2V0IGFmdGVyIGluaXRpYWxpemF0aW9uIGlzIG5vdCBzdXBwb3J0LlwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0ZXJyYWluID0gdjtcclxuICAgICAgICAgICAgaWYgKHRlcnJhaW4pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RlcnJhaW5JRCA9IHRlcnJhaW4uX3V1aWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aWxlU2l6ZSA9IHRlcnJhaW4udGlsZVNpemU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplSSA9IHRlcnJhaW4uZ2V0VmVydGV4Q291bnRJKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplSiA9IHRlcnJhaW4uZ2V0VmVydGV4Q291bnRKKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9idWZmUHRyID0gQW1tby5fbWFsbG9jKDQgKiBzaXplSSAqIHNpemVKKTtcclxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1heEhlaWdodCA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWluSGVpZ2h0ID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZUo7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZUk7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGVycmFpbi5nZXRIZWlnaHQoaSwgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFtbW8uSEVBUEYzMlt0aGlzLl9idWZmUHRyICsgb2Zmc2V0ID4+IDJdID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4SGVpZ2h0ID0gbWF4SGVpZ2h0IDwgdiA/IHYgOiBtYXhIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodCA9IG1pbkhlaWdodCA+IHYgPyB2IDogbWluSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgKz0gNDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtYXhIZWlnaHQgKz0gMC4xO1xyXG4gICAgICAgICAgICAgICAgbWluSGVpZ2h0IC09IDAuMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsT2Zmc2V0LnNldCgoc2l6ZUkgLSAxKSAvIDIgKiB0aGlzLl90aWxlU2l6ZSwgKG1heEhlaWdodCArIG1pbkhlaWdodCkgLyAyLCAoc2l6ZUogLSAxKSAvIDIgKiB0aGlzLl90aWxlU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHRTY2FsZSA9IDE7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZHQgPSBcIlBIWV9GTE9BVFwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXBBeGlzID0gMTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZsaXBRdWFkRWRnZXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J0U2hhcGUgPSBuZXcgQW1tby5idEhlaWdodGZpZWxkVGVycmFpblNoYXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemVJLCBzaXplSiwgdGhpcy5fYnVmZlB0ciwgaGVpZ2h0U2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0LCBtYXhIZWlnaHQsIHVwQXhpcywgaGR0LCBmbGlwUXVhZEVkZ2VzXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS5zZXRWYWx1ZSh0aGlzLl90aWxlU2l6ZSwgMSwgdGhpcy5fdGlsZVNpemUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYnRTaGFwZS5zZXRMb2NhbFNjYWxpbmcodGhpcy5zY2FsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9idFNoYXBlID0gQW1tb0NvbnN0YW50Lmluc3RhbmNlLkVNUFRZX1NIQVBFO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RlcnJhaW5JRDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfYnVmZlB0cjogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfdGlsZVNpemU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2xvY2FsT2Zmc2V0OiBWZWMzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcihBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzLlRFUlJBSU5fU0hBUEVfUFJPWFlUWVBFKTtcclxuICAgICAgICB0aGlzLl90ZXJyYWluSUQgPSAnJztcclxuICAgICAgICB0aGlzLl9idWZmUHRyID0gMDtcclxuICAgICAgICB0aGlzLl90aWxlU2l6ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5fbG9jYWxPZmZzZXQgPSBuZXcgVmVjMygpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29tcG9uZW50U2V0ICgpIHtcclxuICAgICAgICB0aGlzLnNldFRlcnJhaW4odGhpcy5jb2xsaWRlci50ZXJyYWluKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9idWZmUHRyKSBBbW1vWydfZnJlZSddKHRoaXMuX2J1ZmZQdHIpO1xyXG4gICAgICAgIHN1cGVyLm9uRGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbXBvdW5kIChjb21wb3VuZDogQW1tby5idENvbXBvdW5kU2hhcGUgfCBudWxsKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0Q29tcG91bmQoY29tcG91bmQpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5zZXRVc2VySW5kZXgodGhpcy5faW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENlbnRlciAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KENDX1YzXzAsIHYpO1xyXG4gICAgICAgIENDX1YzXzAuYWRkKHRoaXMuX2xvY2FsT2Zmc2V0KTtcclxuICAgICAgICBDQ19WM18wLm11bHRpcGx5KHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy50cmFuc2Zvcm0uZ2V0T3JpZ2luKCksIENDX1YzXzApO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzZXRTY2FsZSAoKSB7XHJcbiAgICAvLyAgICAgLy8gVE9ETzogaGFuZGxlIHNjYWxlXHJcbiAgICAvLyB9XHJcblxyXG59XHJcbiJdfQ==