(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "./cannon-shape.js", "../../../core/index.js", "../cannon-util.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("./cannon-shape.js"), require("../../../core/index.js"), require("../cannon-util.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.cannonShape, global.index, global.cannonUtil);
    global.cannonTerrainShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _cannonShape, _index, _cannonUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonTerrainShape = void 0;
  _cannon = _interopRequireDefault(_cannon);

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

  var CANNON_AABB_LOCAL = new _cannon.default.AABB();
  var CANNON_AABB = new _cannon.default.AABB();
  var CANNON_TRANSFORM = new _cannon.default.Transform();

  _cannon.default.Heightfield.prototype.calculateWorldAABB = function (pos, quat, min, max) {
    var frame = CANNON_TRANSFORM;
    var result = CANNON_AABB;

    _index.Vec3.copy(frame.position, pos);

    _index.Quat.copy(frame.quaternion, quat);

    var s = this.elementSize;
    var data = this.data;
    CANNON_AABB_LOCAL.lowerBound.set(0, 0, this.minValue);
    CANNON_AABB_LOCAL.upperBound.set((data.length - 1) * s, (data[0].length - 1) * s, this.maxValue);
    CANNON_AABB_LOCAL.toWorldFrame(frame, result);
    min.copy(result.lowerBound);
    max.copy(result.upperBound);
  };

  var CannonTerrainShape = /*#__PURE__*/function (_CannonShape) {
    _inherits(CannonTerrainShape, _CannonShape);

    _createClass(CannonTerrainShape, [{
      key: "setTerrain",
      value: function setTerrain(v) {
        if (v) {
          if (this._terrainID != v._uuid) {
            var terrain = v;
            var sizeI = terrain.getVertexCountI();
            var sizeJ = terrain.getVertexCountJ();
            this._terrainID = terrain._uuid;
            this.DATA.length = sizeI - 1;

            for (var i = 0; i < sizeI; i++) {
              if (this.DATA[i] == null) this.DATA[i] = [];
              this.DATA[i].length = sizeJ - 1;

              for (var j = 0; j < sizeJ; j++) {
                this.DATA[i][j] = terrain.getHeight(i, sizeJ - 1 - j);
              }
            }

            this.OPTIONS.elementSize = terrain.tileSize;
            this.updateProperties(this.DATA, this.OPTIONS.elementSize);
          }
        } else {
          if (this._terrainID != '') {
            this._terrainID = '';
            this.DATA.length = 1;
            this.DATA[0] = this.DATA[0] || [];
            this.DATA[0].length = 0;
            this.OPTIONS.elementSize = 0;
            this.updateProperties(this.DATA, this.OPTIONS.elementSize);
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
        return this._shape;
      }
    }]);

    function CannonTerrainShape() {
      var _this;

      _classCallCheck(this, CannonTerrainShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CannonTerrainShape).call(this));
      _this.DATA = void 0;
      _this.OPTIONS = void 0;
      _this._terrainID = void 0;
      _this.DATA = [[]];
      _this.OPTIONS = {
        elementSize: 0
      };
      _this._terrainID = '';
      return _this;
    }

    _createClass(CannonTerrainShape, [{
      key: "onComponentSet",
      value: function onComponentSet() {
        var terrain = this.collider.terrain;

        if (terrain) {
          var sizeI = terrain.getVertexCountI();
          var sizeJ = terrain.getVertexCountJ();

          for (var i = 0; i < sizeI; i++) {
            if (this.DATA[i] == null) this.DATA[i] = [];

            for (var j = 0; j < sizeJ; j++) {
              this.DATA[i][j] = terrain.getHeight(i, sizeJ - 1 - j);
            }
          }

          this.OPTIONS.elementSize = terrain.tileSize;
          this._terrainID = terrain._uuid;
        }

        this._shape = new _cannon.default.Heightfield(this.DATA, this.OPTIONS);
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(CannonTerrainShape.prototype), "onLoad", this).call(this);

        this.setTerrain(this.collider.terrain);
      }
    }, {
      key: "updateProperties",
      value: function updateProperties(data, elementSize) {
        var impl = this.impl;
        impl.data = data;
        impl.elementSize = elementSize;
        impl.updateMinValue();
        impl.updateMaxValue();
        impl.updateBoundingSphereRadius();
        impl.update();

        if (this._index >= 0) {
          (0, _cannonUtil.commitShapeUpdates)(this._body);
        }
      } // override

    }, {
      key: "_setCenter",
      value: function _setCenter(v) {
        var terrain = this.collider.terrain;

        if (terrain) {
          _index.Quat.fromEuler(this._orient, -90, 0, 0);

          var lpos = this._offset;

          _index.Vec3.set(lpos, 0, 0, (terrain.getVertexCountJ() - 1) * terrain.tileSize);

          _index.Vec3.add(lpos, lpos, v);

          _index.Vec3.multiply(lpos, lpos, this._collider.node.worldScale);
        }
      }
    }]);

    return CannonTerrainShape;
  }(_cannonShape.CannonShape);

  _exports.CannonTerrainShape = CannonTerrainShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tdGVycmFpbi1zaGFwZS50cyJdLCJuYW1lcyI6WyJDQU5OT05fQUFCQl9MT0NBTCIsIkNBTk5PTiIsIkFBQkIiLCJDQU5OT05fQUFCQiIsIkNBTk5PTl9UUkFOU0ZPUk0iLCJUcmFuc2Zvcm0iLCJIZWlnaHRmaWVsZCIsInByb3RvdHlwZSIsImNhbGN1bGF0ZVdvcmxkQUFCQiIsInBvcyIsInF1YXQiLCJtaW4iLCJtYXgiLCJmcmFtZSIsInJlc3VsdCIsIlZlYzMiLCJjb3B5IiwicG9zaXRpb24iLCJRdWF0IiwicXVhdGVybmlvbiIsInMiLCJlbGVtZW50U2l6ZSIsImRhdGEiLCJsb3dlckJvdW5kIiwic2V0IiwibWluVmFsdWUiLCJ1cHBlckJvdW5kIiwibGVuZ3RoIiwibWF4VmFsdWUiLCJ0b1dvcmxkRnJhbWUiLCJDYW5ub25UZXJyYWluU2hhcGUiLCJ2IiwiX3RlcnJhaW5JRCIsIl91dWlkIiwidGVycmFpbiIsInNpemVJIiwiZ2V0VmVydGV4Q291bnRJIiwic2l6ZUoiLCJnZXRWZXJ0ZXhDb3VudEoiLCJEQVRBIiwiaSIsImoiLCJnZXRIZWlnaHQiLCJPUFRJT05TIiwidGlsZVNpemUiLCJ1cGRhdGVQcm9wZXJ0aWVzIiwiX2NvbGxpZGVyIiwiX3NoYXBlIiwiY29sbGlkZXIiLCJzZXRUZXJyYWluIiwiaW1wbCIsInVwZGF0ZU1pblZhbHVlIiwidXBkYXRlTWF4VmFsdWUiLCJ1cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cyIsInVwZGF0ZSIsIl9pbmRleCIsIl9ib2R5IiwiZnJvbUV1bGVyIiwiX29yaWVudCIsImxwb3MiLCJfb2Zmc2V0IiwiYWRkIiwibXVsdGlwbHkiLCJub2RlIiwid29ybGRTY2FsZSIsIkNhbm5vblNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFT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QUFLYyxRQUFMLENBQWNkLE9BQTlCOztBQUNBLFlBQUlBLE9BQUosRUFBYTtBQUNUaEIsc0JBQUt1QyxTQUFMLENBQWUsS0FBS0MsT0FBcEIsRUFBNkIsQ0FBQyxFQUE5QixFQUFrQyxDQUFsQyxFQUFxQyxDQUFyQzs7QUFDQSxjQUFNQyxJQUFJLEdBQUcsS0FBS0MsT0FBbEI7O0FBQ0E3QyxzQkFBS1MsR0FBTCxDQUFTbUMsSUFBVCxFQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBQ3pCLE9BQU8sQ0FBQ0ksZUFBUixLQUE0QixDQUE3QixJQUFrQ0osT0FBTyxDQUFDVSxRQUEvRDs7QUFDQTdCLHNCQUFLOEMsR0FBTCxDQUFTRixJQUFULEVBQWVBLElBQWYsRUFBcUI1QixDQUFyQjs7QUFDQWhCLHNCQUFLK0MsUUFBTCxDQUFjSCxJQUFkLEVBQW9CQSxJQUFwQixFQUEwQixLQUFLYixTQUFMLENBQWVpQixJQUFmLENBQW9CQyxVQUE5QztBQUNIO0FBQ0o7Ozs7SUFqR21DQyx3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDQU5OT04gZnJvbSAnQGNvY29zL2Nhbm5vbic7XHJcbmltcG9ydCB7IENhbm5vblNoYXBlIH0gZnJvbSAnLi9jYW5ub24tc2hhcGUnO1xyXG5pbXBvcnQgeyBUZXJyYWluQ29sbGlkZXIgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBWZWMzLCBRdWF0IH0gZnJvbSAnLi4vLi4vLi4vY29yZSc7XHJcbmltcG9ydCB7IElUZXJyYWluU2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IElUZXJyYWluQXNzZXQgfSBmcm9tICcuLi8uLi9zcGVjL2ktZXh0ZXJuYWwnO1xyXG5pbXBvcnQgeyBjb21taXRTaGFwZVVwZGF0ZXMgfSBmcm9tICcuLi9jYW5ub24tdXRpbCc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcblxyXG5jb25zdCBDQU5OT05fQUFCQl9MT0NBTCA9IG5ldyBDQU5OT04uQUFCQigpO1xyXG5jb25zdCBDQU5OT05fQUFCQiA9IG5ldyBDQU5OT04uQUFCQigpO1xyXG5jb25zdCBDQU5OT05fVFJBTlNGT1JNID0gbmV3IENBTk5PTi5UcmFuc2Zvcm0oKTtcclxuQ0FOTk9OLkhlaWdodGZpZWxkLnByb3RvdHlwZS5jYWxjdWxhdGVXb3JsZEFBQkIgPSBmdW5jdGlvbiAocG9zOiBDQU5OT04uVmVjMywgcXVhdDogQ0FOTk9OLlF1YXRlcm5pb24sIG1pbjogQ0FOTk9OLlZlYzMsIG1heDogQ0FOTk9OLlZlYzMpIHtcclxuICAgIHZhciBmcmFtZSA9IENBTk5PTl9UUkFOU0ZPUk07XHJcbiAgICB2YXIgcmVzdWx0ID0gQ0FOTk9OX0FBQkI7XHJcbiAgICBWZWMzLmNvcHkoZnJhbWUucG9zaXRpb24sIHBvcyk7XHJcbiAgICBRdWF0LmNvcHkoZnJhbWUucXVhdGVybmlvbiwgcXVhdCk7XHJcbiAgICB2YXIgcyA9IHRoaXMuZWxlbWVudFNpemU7XHJcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIENBTk5PTl9BQUJCX0xPQ0FMLmxvd2VyQm91bmQuc2V0KDAsIDAsIHRoaXMubWluVmFsdWUpO1xyXG4gICAgQ0FOTk9OX0FBQkJfTE9DQUwudXBwZXJCb3VuZC5zZXQoKGRhdGEubGVuZ3RoIC0gMSkgKiBzLCAoZGF0YVswXS5sZW5ndGggLSAxKSAqIHMsIHRoaXMubWF4VmFsdWUpO1xyXG4gICAgQ0FOTk9OX0FBQkJfTE9DQUwudG9Xb3JsZEZyYW1lKGZyYW1lLCByZXN1bHQpO1xyXG4gICAgbWluLmNvcHkocmVzdWx0Lmxvd2VyQm91bmQpO1xyXG4gICAgbWF4LmNvcHkocmVzdWx0LnVwcGVyQm91bmQpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2Fubm9uVGVycmFpblNoYXBlIGV4dGVuZHMgQ2Fubm9uU2hhcGUgaW1wbGVtZW50cyBJVGVycmFpblNoYXBlIHtcclxuXHJcbiAgICBnZXQgY29sbGlkZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xsaWRlciBhcyBUZXJyYWluQ29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGltcGwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBDQU5OT04uSGVpZ2h0ZmllbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGVycmFpbiAodjogSVRlcnJhaW5Bc3NldCB8IG51bGwpOiB2b2lkIHtcclxuICAgICAgICBpZiAodikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdGVycmFpbklEICE9IHYuX3V1aWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlcnJhaW4gPSB2O1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZUkgPSB0ZXJyYWluLmdldFZlcnRleENvdW50SSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZUogPSB0ZXJyYWluLmdldFZlcnRleENvdW50SigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGVycmFpbklEID0gdGVycmFpbi5fdXVpZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuREFUQS5sZW5ndGggPSBzaXplSSAtIDE7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemVJOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5EQVRBW2ldID09IG51bGwpIHRoaXMuREFUQVtpXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuREFUQVtpXS5sZW5ndGggPSBzaXplSiAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplSjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuREFUQVtpXVtqXSA9IHRlcnJhaW4uZ2V0SGVpZ2h0KGksIHNpemVKIC0gMSAtIGopO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuT1BUSU9OUy5lbGVtZW50U2l6ZSA9IHRlcnJhaW4udGlsZVNpemU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXModGhpcy5EQVRBLCB0aGlzLk9QVElPTlMuZWxlbWVudFNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RlcnJhaW5JRCAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGVycmFpbklEID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkRBVEEubGVuZ3RoID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuREFUQVswXSA9IHRoaXMuREFUQVswXSB8fCBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuREFUQVswXS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PUFRJT05TLmVsZW1lbnRTaXplID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllcyh0aGlzLkRBVEEsIHRoaXMuT1BUSU9OUy5lbGVtZW50U2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgREFUQTogbnVtYmVyW11bXTtcclxuICAgIHJlYWRvbmx5IE9QVElPTlM6IENBTk5PTi5JSGlnaHRmaWVsZDtcclxuICAgIHByaXZhdGUgX3RlcnJhaW5JRDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuREFUQSA9IFtbXV07XHJcbiAgICAgICAgdGhpcy5PUFRJT05TID0geyBlbGVtZW50U2l6ZTogMCB9O1xyXG4gICAgICAgIHRoaXMuX3RlcnJhaW5JRCA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkNvbXBvbmVudFNldCAoKSB7XHJcbiAgICAgICAgY29uc3QgdGVycmFpbiA9IHRoaXMuY29sbGlkZXIudGVycmFpbjtcclxuICAgICAgICBpZiAodGVycmFpbikge1xyXG4gICAgICAgICAgICBjb25zdCBzaXplSSA9IHRlcnJhaW4uZ2V0VmVydGV4Q291bnRJKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpemVKID0gdGVycmFpbi5nZXRWZXJ0ZXhDb3VudEooKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplSTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5EQVRBW2ldID09IG51bGwpIHRoaXMuREFUQVtpXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplSjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5EQVRBW2ldW2pdID0gdGVycmFpbi5nZXRIZWlnaHQoaSwgc2l6ZUogLSAxIC0gaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5PUFRJT05TLmVsZW1lbnRTaXplID0gdGVycmFpbi50aWxlU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5fdGVycmFpbklEID0gdGVycmFpbi5fdXVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NoYXBlID0gbmV3IENBTk5PTi5IZWlnaHRmaWVsZCh0aGlzLkRBVEEsIHRoaXMuT1BUSU9OUyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuICAgICAgICBzdXBlci5vbkxvYWQoKTtcclxuICAgICAgICB0aGlzLnNldFRlcnJhaW4odGhpcy5jb2xsaWRlci50ZXJyYWluKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQcm9wZXJ0aWVzIChkYXRhOiBudW1iZXJbXVtdLCBlbGVtZW50U2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgaW1wbCA9IHRoaXMuaW1wbDtcclxuICAgICAgICBpbXBsLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIGltcGwuZWxlbWVudFNpemUgPSBlbGVtZW50U2l6ZTtcclxuICAgICAgICBpbXBsLnVwZGF0ZU1pblZhbHVlKCk7XHJcbiAgICAgICAgaW1wbC51cGRhdGVNYXhWYWx1ZSgpO1xyXG4gICAgICAgIGltcGwudXBkYXRlQm91bmRpbmdTcGhlcmVSYWRpdXMoKTtcclxuICAgICAgICBpbXBsLnVwZGF0ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb3ZlcnJpZGVcclxuICAgIHByb3RlY3RlZCBfc2V0Q2VudGVyICh2OiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBjb25zdCB0ZXJyYWluID0gdGhpcy5jb2xsaWRlci50ZXJyYWluO1xyXG4gICAgICAgIGlmICh0ZXJyYWluKSB7XHJcbiAgICAgICAgICAgIFF1YXQuZnJvbUV1bGVyKHRoaXMuX29yaWVudCwgLTkwLCAwLCAwKTtcclxuICAgICAgICAgICAgY29uc3QgbHBvcyA9IHRoaXMuX29mZnNldCBhcyBJVmVjM0xpa2U7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KGxwb3MsIDAsIDAsICh0ZXJyYWluLmdldFZlcnRleENvdW50SigpIC0gMSkgKiB0ZXJyYWluLnRpbGVTaXplKTtcclxuICAgICAgICAgICAgVmVjMy5hZGQobHBvcywgbHBvcywgdik7XHJcbiAgICAgICAgICAgIFZlYzMubXVsdGlwbHkobHBvcywgbHBvcywgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19