(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "./ammo-shape.js", "../ammo-util.js", "../ammo-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("./ammo-shape.js"), require("../ammo-util.js"), require("../ammo-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.ammoShape, global.ammoUtil, global.ammoEnum);
    global.ammoSimplexShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoShape, _ammoUtil, _ammoEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoSimplexShape = void 0;
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

  var AmmoSimplexShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoSimplexShape, _AmmoShape);

    _createClass(AmmoSimplexShape, [{
      key: "setShapeType",
      value: function setShapeType(v) {
        if (this._isBinding) {//TODO: 
        }
      }
    }, {
      key: "setVertices",
      value: function setVertices(v) {
        //TODO: Fix
        var length = this.VERTICES.length;

        for (var i = 0; i < length; i++) {
          (0, _ammoUtil.cocos2AmmoVec3)(this.VERTICES[i], v[i]);
        }

        (0, _ammoUtil.cocos2AmmoVec3)(this.scale, this._collider.node.worldScale);

        this._btShape.setLocalScaling(this.scale);

        if (this._btCompound) {
          this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
      }
    }, {
      key: "impl",
      get: function get() {
        return this._btShape;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }]);

    function AmmoSimplexShape() {
      var _this;

      _classCallCheck(this, AmmoSimplexShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoSimplexShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.TETRAHEDRAL_SHAPE_PROXYTYPE));
      _this.VERTICES = [];
      _this._btShape = new _ammoInstantiated.default.btBU_Simplex1to4();
      return _this;
    }

    _createClass(AmmoSimplexShape, [{
      key: "onComponentSet",
      value: function onComponentSet() {
        var length = this.collider.shapeType;
        var vertices = this.collider.vertices;

        for (var i = 0; i < length; i++) {
          this.VERTICES[i] = new _ammoInstantiated.default.btVector3();
          (0, _ammoUtil.cocos2AmmoVec3)(this.VERTICES[i], vertices[i]);
          this.impl.addVertex(this.VERTICES[i]);
        }

        (0, _ammoUtil.cocos2AmmoVec3)(this.scale, this._collider.node.worldScale);

        this._btShape.setLocalScaling(this.scale);
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(AmmoSimplexShape.prototype), "onLoad", this).call(this);

        this.collider.updateVertices();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        var length = this.VERTICES.length;

        for (var i = 0; i < length; i++) {
          _ammoInstantiated.default.destroy(this.VERTICES[i]);
        }

        this.VERTICES = null;

        _get(_getPrototypeOf(AmmoSimplexShape.prototype), "onDestroy", this).call(this);
      }
    }, {
      key: "setScale",
      value: function setScale() {
        _get(_getPrototypeOf(AmmoSimplexShape.prototype), "setScale", this).call(this);

        (0, _ammoUtil.cocos2AmmoVec3)(this.scale, this._collider.node.worldScale);

        this._btShape.setLocalScaling(this.scale);

        if (this._btCompound) {
          this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
      }
    }]);

    return AmmoSimplexShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoSimplexShape = AmmoSimplexShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby1zaW1wbGV4LXNoYXBlLnRzIl0sIm5hbWVzIjpbIkFtbW9TaW1wbGV4U2hhcGUiLCJ2IiwiX2lzQmluZGluZyIsImxlbmd0aCIsIlZFUlRJQ0VTIiwiaSIsInNjYWxlIiwiX2NvbGxpZGVyIiwibm9kZSIsIndvcmxkU2NhbGUiLCJfYnRTaGFwZSIsInNldExvY2FsU2NhbGluZyIsIl9idENvbXBvdW5kIiwidXBkYXRlQ2hpbGRUcmFuc2Zvcm0iLCJpbmRleCIsInRyYW5zZm9ybSIsIkFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMiLCJURVRSQUhFRFJBTF9TSEFQRV9QUk9YWVRZUEUiLCJBbW1vIiwiYnRCVV9TaW1wbGV4MXRvNCIsImNvbGxpZGVyIiwic2hhcGVUeXBlIiwidmVydGljZXMiLCJidFZlY3RvcjMiLCJpbXBsIiwiYWRkVmVydGV4IiwidXBkYXRlVmVydGljZXMiLCJkZXN0cm95IiwiQW1tb1NoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFRYUEsZ0I7Ozs7O21DQUVLQyxDLEVBQWlDO0FBQzNDLFlBQUksS0FBS0MsVUFBVCxFQUFxQixDQUNqQjtBQUNIO0FBQ0o7OztrQ0FFWUQsQyxFQUFnQjtBQUN6QjtBQUNBLFlBQU1FLE1BQU0sR0FBRyxLQUFLQyxRQUFMLENBQWNELE1BQTdCOztBQUNBLGFBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsTUFBcEIsRUFBNEJFLENBQUMsRUFBN0IsRUFBaUM7QUFDN0Isd0NBQWUsS0FBS0QsUUFBTCxDQUFjQyxDQUFkLENBQWYsRUFBaUNKLENBQUMsQ0FBQ0ksQ0FBRCxDQUFsQztBQUNIOztBQUNELHNDQUFlLEtBQUtDLEtBQXBCLEVBQTJCLEtBQUtDLFNBQUwsQ0FBZUMsSUFBZixDQUFvQkMsVUFBL0M7O0FBQ0EsYUFBS0MsUUFBTCxDQUFjQyxlQUFkLENBQThCLEtBQUtMLEtBQW5DOztBQUNBLFlBQUksS0FBS00sV0FBVCxFQUFzQjtBQUNsQixlQUFLQSxXQUFMLENBQWlCQyxvQkFBakIsQ0FBc0MsS0FBS0MsS0FBM0MsRUFBa0QsS0FBS0MsU0FBdkQsRUFBa0UsSUFBbEU7QUFDSDtBQUNKOzs7MEJBRVc7QUFDUixlQUFPLEtBQUtMLFFBQVo7QUFDSDs7OzBCQUVlO0FBQ1osZUFBTyxLQUFLSCxTQUFaO0FBQ0g7OztBQUlELGdDQUFlO0FBQUE7O0FBQUE7O0FBQ1gsNEZBQU1TLG9DQUEwQkMsMkJBQWhDO0FBRFcsWUFGTmIsUUFFTSxHQUZ1QixFQUV2QjtBQUVYLFlBQUtNLFFBQUwsR0FBZ0IsSUFBSVEsMEJBQUtDLGdCQUFULEVBQWhCO0FBRlc7QUFHZDs7Ozt1Q0FFMkI7QUFDeEIsWUFBTWhCLE1BQU0sR0FBRyxLQUFLaUIsUUFBTCxDQUFjQyxTQUE3QjtBQUNBLFlBQU1DLFFBQVEsR0FBRyxLQUFLRixRQUFMLENBQWNFLFFBQS9COztBQUNBLGFBQUssSUFBSWpCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLE1BQXBCLEVBQTRCRSxDQUFDLEVBQTdCLEVBQWlDO0FBQzdCLGVBQUtELFFBQUwsQ0FBY0MsQ0FBZCxJQUFtQixJQUFJYSwwQkFBS0ssU0FBVCxFQUFuQjtBQUNBLHdDQUFlLEtBQUtuQixRQUFMLENBQWNDLENBQWQsQ0FBZixFQUFpQ2lCLFFBQVEsQ0FBQ2pCLENBQUQsQ0FBekM7QUFDQSxlQUFLbUIsSUFBTCxDQUFVQyxTQUFWLENBQW9CLEtBQUtyQixRQUFMLENBQWNDLENBQWQsQ0FBcEI7QUFDSDs7QUFDRCxzQ0FBZSxLQUFLQyxLQUFwQixFQUEyQixLQUFLQyxTQUFMLENBQWVDLElBQWYsQ0FBb0JDLFVBQS9DOztBQUNBLGFBQUtDLFFBQUwsQ0FBY0MsZUFBZCxDQUE4QixLQUFLTCxLQUFuQztBQUNIOzs7K0JBRVM7QUFDTjs7QUFDQSxhQUFLYyxRQUFMLENBQWNNLGNBQWQ7QUFDSDs7O2tDQUVZO0FBQ1QsWUFBTXZCLE1BQU0sR0FBRyxLQUFLQyxRQUFMLENBQWNELE1BQTdCOztBQUNBLGFBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsTUFBcEIsRUFBNEJFLENBQUMsRUFBN0IsRUFBaUM7QUFDN0JhLG9DQUFLUyxPQUFMLENBQWEsS0FBS3ZCLFFBQUwsQ0FBY0MsQ0FBZCxDQUFiO0FBQ0g7O0FBQ0EsYUFBS0QsUUFBTixHQUF5QixJQUF6Qjs7QUFDQTtBQUNIOzs7aUNBRVc7QUFDUjs7QUFDQSxzQ0FBZSxLQUFLRSxLQUFwQixFQUEyQixLQUFLQyxTQUFMLENBQWVDLElBQWYsQ0FBb0JDLFVBQS9DOztBQUNBLGFBQUtDLFFBQUwsQ0FBY0MsZUFBZCxDQUE4QixLQUFLTCxLQUFuQzs7QUFDQSxZQUFJLEtBQUtNLFdBQVQsRUFBc0I7QUFDbEIsZUFBS0EsV0FBTCxDQUFpQkMsb0JBQWpCLENBQXNDLEtBQUtDLEtBQTNDLEVBQWtELEtBQUtDLFNBQXZELEVBQWtFLElBQWxFO0FBQ0g7QUFDSjs7OztJQXJFaUNhLG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFtbW8gZnJvbSAnLi4vYW1tby1pbnN0YW50aWF0ZWQnO1xyXG5pbXBvcnQgeyBBbW1vU2hhcGUgfSBmcm9tIFwiLi9hbW1vLXNoYXBlXCI7XHJcbmltcG9ydCB7IFNpbXBsZXhDb2xsaWRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBjb2NvczJBbW1vVmVjMyB9IGZyb20gJy4uL2FtbW8tdXRpbCc7XHJcbmltcG9ydCB7IEFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMgfSBmcm9tICcuLi9hbW1vLWVudW0nO1xyXG5pbXBvcnQgeyBJU2ltcGxleFNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFtbW9TaW1wbGV4U2hhcGUgZXh0ZW5kcyBBbW1vU2hhcGUgaW1wbGVtZW50cyBJU2ltcGxleFNoYXBlIHtcclxuXHJcbiAgICBzZXRTaGFwZVR5cGUgKHY6IFNpbXBsZXhDb2xsaWRlci5FU2ltcGxleFR5cGUpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNCaW5kaW5nKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzogXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFZlcnRpY2VzICh2OiBJVmVjM0xpa2VbXSkge1xyXG4gICAgICAgIC8vVE9ETzogRml4XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5WRVJUSUNFUy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb2NvczJBbW1vVmVjMyh0aGlzLlZFUlRJQ0VTW2ldLCB2W2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5zY2FsZSwgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICB0aGlzLl9idFNoYXBlLnNldExvY2FsU2NhbGluZyh0aGlzLnNjYWxlKTtcclxuICAgICAgICBpZiAodGhpcy5fYnRDb21wb3VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9idENvbXBvdW5kLnVwZGF0ZUNoaWxkVHJhbnNmb3JtKHRoaXMuaW5kZXgsIHRoaXMudHJhbnNmb3JtLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGltcGwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9idFNoYXBlIGFzIEFtbW8uYnRCVV9TaW1wbGV4MXRvNDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY29sbGlkZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xsaWRlciBhcyBTaW1wbGV4Q29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgVkVSVElDRVM6IEFtbW8uYnRWZWN0b3IzW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcy5URVRSQUhFRFJBTF9TSEFQRV9QUk9YWVRZUEUpO1xyXG4gICAgICAgIHRoaXMuX2J0U2hhcGUgPSBuZXcgQW1tby5idEJVX1NpbXBsZXgxdG80KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uQ29tcG9uZW50U2V0ICgpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmNvbGxpZGVyLnNoYXBlVHlwZTtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IHRoaXMuY29sbGlkZXIudmVydGljZXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLlZFUlRJQ0VTW2ldID0gbmV3IEFtbW8uYnRWZWN0b3IzKCk7XHJcbiAgICAgICAgICAgIGNvY29zMkFtbW9WZWMzKHRoaXMuVkVSVElDRVNbaV0sIHZlcnRpY2VzW2ldKTtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLmFkZFZlcnRleCh0aGlzLlZFUlRJQ0VTW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5zY2FsZSwgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICB0aGlzLl9idFNoYXBlLnNldExvY2FsU2NhbGluZyh0aGlzLnNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMuY29sbGlkZXIudXBkYXRlVmVydGljZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuVkVSVElDRVMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgQW1tby5kZXN0cm95KHRoaXMuVkVSVElDRVNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAodGhpcy5WRVJUSUNFUyBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0U2NhbGUoKTtcclxuICAgICAgICBjb2NvczJBbW1vVmVjMyh0aGlzLnNjYWxlLCB0aGlzLl9jb2xsaWRlci5ub2RlLndvcmxkU2NhbGUpO1xyXG4gICAgICAgIHRoaXMuX2J0U2hhcGUuc2V0TG9jYWxTY2FsaW5nKHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIGlmICh0aGlzLl9idENvbXBvdW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J0Q29tcG91bmQudXBkYXRlQ2hpbGRUcmFuc2Zvcm0odGhpcy5pbmRleCwgdGhpcy50cmFuc2Zvcm0sIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIl19