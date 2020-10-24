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
    global.ammoTrimeshShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoShape, _index, _ammoUtil, _ammoEnum, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoTrimeshShape = void 0;
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

  var AmmoTrimeshShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoTrimeshShape, _AmmoShape);

    _createClass(AmmoTrimeshShape, [{
      key: "setMesh",
      value: function setMesh(v) {
        if (!this._isBinding) return;

        if (this._btShape != null && this._btShape != _ammoConst.AmmoConstant.instance.EMPTY_SHAPE) {
          // TODO: change the mesh after initialization
          (0, _index.warnID)(9620);
        } else {
          var mesh = v;

          if (mesh && mesh.renderingSubMeshes.length > 0) {
            var btTriangleMesh = this._getBtTriangleMesh(mesh);

            if (this.collider.convex) {
              this._btShape = new _ammoInstantiated.default.btConvexTriangleMeshShape(btTriangleMesh, true);
            } else {
              this._btShape = new _ammoInstantiated.default.btBvhTriangleMeshShape(btTriangleMesh, true, true);
            }

            (0, _ammoUtil.cocos2AmmoVec3)(this.scale, this._collider.node.worldScale);

            this._btShape.setMargin(0.01);

            this._btShape.setLocalScaling(this.scale);

            this.setWrapper();
            this.setCompound(this._btCompound);
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

    function AmmoTrimeshShape() {
      var _this;

      _classCallCheck(this, AmmoTrimeshShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoTrimeshShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.TRIANGLE_MESH_SHAPE_PROXYTYPE));
      _this.refBtTriangleMesh = null;
      return _this;
    }

    _createClass(AmmoTrimeshShape, [{
      key: "onComponentSet",
      value: function onComponentSet() {
        this.setMesh(this.collider.mesh);
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this.refBtTriangleMesh) {
          _ammoInstantiated.default.destroy(this.refBtTriangleMesh);
        }

        _get(_getPrototypeOf(AmmoTrimeshShape.prototype), "onDestroy", this).call(this);
      }
    }, {
      key: "setCompound",
      value: function setCompound(compound) {
        _get(_getPrototypeOf(AmmoTrimeshShape.prototype), "setCompound", this).call(this, compound);

        this.impl.setUserIndex(this._index);
      }
    }, {
      key: "setScale",
      value: function setScale() {
        _get(_getPrototypeOf(AmmoTrimeshShape.prototype), "setScale", this).call(this);

        (0, _ammoUtil.cocos2AmmoVec3)(this.scale, this._collider.node.worldScale);

        this._btShape.setLocalScaling(this.scale);

        this.updateCompoundTransform();
      }
    }, {
      key: "_getBtTriangleMesh",
      value: function _getBtTriangleMesh(mesh) {
        var btTriangleMesh;

        if (_ammoInstantiated.default['CC_CACHE']['btTriangleMesh'].enable) {
          if (_ammoInstantiated.default['CC_CACHE']['btTriangleMesh'][mesh._uuid] == null) {
            var btm = new _ammoInstantiated.default.btTriangleMesh();
            _ammoInstantiated.default['CC_CACHE']['btTriangleMesh'][mesh._uuid] = btm;
            (0, _ammoUtil.cocos2AmmoTriMesh)(btm, mesh);
          }

          btTriangleMesh = _ammoInstantiated.default['CC_CACHE']['btTriangleMesh'][mesh._uuid];
        } else {
          this.refBtTriangleMesh = btTriangleMesh = new _ammoInstantiated.default.btTriangleMesh();
          (0, _ammoUtil.cocos2AmmoTriMesh)(btTriangleMesh, mesh);
        }

        return btTriangleMesh;
      }
    }]);

    return AmmoTrimeshShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoTrimeshShape = AmmoTrimeshShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby10cmltZXNoLXNoYXBlLnRzIl0sIm5hbWVzIjpbIkFtbW9UcmltZXNoU2hhcGUiLCJ2IiwiX2lzQmluZGluZyIsIl9idFNoYXBlIiwiQW1tb0NvbnN0YW50IiwiaW5zdGFuY2UiLCJFTVBUWV9TSEFQRSIsIm1lc2giLCJyZW5kZXJpbmdTdWJNZXNoZXMiLCJsZW5ndGgiLCJidFRyaWFuZ2xlTWVzaCIsIl9nZXRCdFRyaWFuZ2xlTWVzaCIsImNvbGxpZGVyIiwiY29udmV4IiwiQW1tbyIsImJ0Q29udmV4VHJpYW5nbGVNZXNoU2hhcGUiLCJidEJ2aFRyaWFuZ2xlTWVzaFNoYXBlIiwic2NhbGUiLCJfY29sbGlkZXIiLCJub2RlIiwid29ybGRTY2FsZSIsInNldE1hcmdpbiIsInNldExvY2FsU2NhbGluZyIsInNldFdyYXBwZXIiLCJzZXRDb21wb3VuZCIsIl9idENvbXBvdW5kIiwiQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyIsIlRSSUFOR0xFX01FU0hfU0hBUEVfUFJPWFlUWVBFIiwicmVmQnRUcmlhbmdsZU1lc2giLCJzZXRNZXNoIiwiZGVzdHJveSIsImNvbXBvdW5kIiwiaW1wbCIsInNldFVzZXJJbmRleCIsIl9pbmRleCIsInVwZGF0ZUNvbXBvdW5kVHJhbnNmb3JtIiwiZW5hYmxlIiwiX3V1aWQiLCJidG0iLCJBbW1vU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNhQSxnQjs7Ozs7OEJBVUFDLEMsRUFBZ0I7QUFDckIsWUFBSSxDQUFDLEtBQUtDLFVBQVYsRUFBc0I7O0FBRXRCLFlBQUksS0FBS0MsUUFBTCxJQUFpQixJQUFqQixJQUF5QixLQUFLQSxRQUFMLElBQWlCQyx3QkFBYUMsUUFBYixDQUFzQkMsV0FBcEUsRUFBaUY7QUFDN0U7QUFDQSw2QkFBTyxJQUFQO0FB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IjpbImltcG9ydCBBbW1vIGZyb20gJy4uL2FtbW8taW5zdGFudGlhdGVkJztcclxuaW1wb3J0IHsgQW1tb1NoYXBlIH0gZnJvbSBcIi4vYW1tby1zaGFwZVwiO1xyXG5pbXBvcnQgeyBNZXNoLCB3YXJuSUQgfSBmcm9tIFwiLi4vLi4vLi4vY29yZVwiO1xyXG5pbXBvcnQgeyBNZXNoQ29sbGlkZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9leHBvcnRzL3BoeXNpY3MtZnJhbWV3b3JrJztcclxuaW1wb3J0IHsgY29jb3MyQW1tb1ZlYzMsIGNvY29zMkFtbW9UcmlNZXNoIH0gZnJvbSAnLi4vYW1tby11dGlsJztcclxuaW1wb3J0IHsgQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyB9IGZyb20gJy4uL2FtbW8tZW51bSc7XHJcbmltcG9ydCB7IElUcmltZXNoU2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IEFtbW9Db25zdGFudCB9IGZyb20gJy4uL2FtbW8tY29uc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFtbW9UcmltZXNoU2hhcGUgZXh0ZW5kcyBBbW1vU2hhcGUgaW1wbGVtZW50cyBJVHJpbWVzaFNoYXBlIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIgYXMgTWVzaENvbGxpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaW1wbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J0U2hhcGUgYXMgQW1tby5idEJ2aFRyaWFuZ2xlTWVzaFNoYXBlIHwgQW1tby5idENvbnZleFRyaWFuZ2xlTWVzaFNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1lc2ggKHY6IE1lc2ggfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0JpbmRpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2J0U2hhcGUgIT0gbnVsbCAmJiB0aGlzLl9idFNoYXBlICE9IEFtbW9Db25zdGFudC5pbnN0YW5jZS5FTVBUWV9TSEFQRSkge1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBjaGFuZ2UgdGhlIG1lc2ggYWZ0ZXIgaW5pdGlhbGl6YXRpb25cclxuICAgICAgICAgICAgd2FybklEKDk2MjApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lc2ggPSB2O1xyXG4gICAgICAgICAgICBpZiAobWVzaCAmJiBtZXNoLnJlbmRlcmluZ1N1Yk1lc2hlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnRUcmlhbmdsZU1lc2g6IEFtbW8uYnRUcmlhbmdsZU1lc2ggPSB0aGlzLl9nZXRCdFRyaWFuZ2xlTWVzaChtZXNoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbGxpZGVyLmNvbnZleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J0U2hhcGUgPSBuZXcgQW1tby5idENvbnZleFRyaWFuZ2xlTWVzaFNoYXBlKGJ0VHJpYW5nbGVNZXNoLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnRTaGFwZSA9IG5ldyBBbW1vLmJ0QnZoVHJpYW5nbGVNZXNoU2hhcGUoYnRUcmlhbmdsZU1lc2gsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5zY2FsZSwgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J0U2hhcGUuc2V0TWFyZ2luKDAuMDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYnRTaGFwZS5zZXRMb2NhbFNjYWxpbmcodGhpcy5zY2FsZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFdyYXBwZXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29tcG91bmQodGhpcy5fYnRDb21wb3VuZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9idFNoYXBlID0gQW1tb0NvbnN0YW50Lmluc3RhbmNlLkVNUFRZX1NIQVBFO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVmQnRUcmlhbmdsZU1lc2g6IEFtbW8uYnRUcmlhbmdsZU1lc2ggfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcy5UUklBTkdMRV9NRVNIX1NIQVBFX1BST1hZVFlQRSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db21wb25lbnRTZXQgKCkge1xyXG4gICAgICAgIHRoaXMuc2V0TWVzaCh0aGlzLmNvbGxpZGVyLm1lc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVmQnRUcmlhbmdsZU1lc2gpIHsgQW1tby5kZXN0cm95KHRoaXMucmVmQnRUcmlhbmdsZU1lc2gpOyB9XHJcbiAgICAgICAgc3VwZXIub25EZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29tcG91bmQgKGNvbXBvdW5kOiBBbW1vLmJ0Q29tcG91bmRTaGFwZSB8IG51bGwpIHtcclxuICAgICAgICBzdXBlci5zZXRDb21wb3VuZChjb21wb3VuZCk7XHJcbiAgICAgICAgdGhpcy5pbXBsLnNldFVzZXJJbmRleCh0aGlzLl9pbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2NhbGUgKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFNjYWxlKCk7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5zY2FsZSwgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICB0aGlzLl9idFNoYXBlLnNldExvY2FsU2NhbGluZyh0aGlzLnNjYWxlKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbXBvdW5kVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0QnRUcmlhbmdsZU1lc2ggKG1lc2g6IE1lc2gpOiBBbW1vLmJ0VHJpYW5nbGVNZXNoIHtcclxuICAgICAgICB2YXIgYnRUcmlhbmdsZU1lc2g6IEFtbW8uYnRUcmlhbmdsZU1lc2g7XHJcbiAgICAgICAgaWYgKEFtbW9bJ0NDX0NBQ0hFJ11bJ2J0VHJpYW5nbGVNZXNoJ10uZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIGlmIChBbW1vWydDQ19DQUNIRSddWydidFRyaWFuZ2xlTWVzaCddW21lc2guX3V1aWRdID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBidG0gPSBuZXcgQW1tby5idFRyaWFuZ2xlTWVzaCgpO1xyXG4gICAgICAgICAgICAgICAgQW1tb1snQ0NfQ0FDSEUnXVsnYnRUcmlhbmdsZU1lc2gnXVttZXNoLl91dWlkXSA9IGJ0bTtcclxuICAgICAgICAgICAgICAgIGNvY29zMkFtbW9UcmlNZXNoKGJ0bSwgbWVzaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnRUcmlhbmdsZU1lc2ggPSBBbW1vWydDQ19DQUNIRSddWydidFRyaWFuZ2xlTWVzaCddW21lc2guX3V1aWRdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVmQnRUcmlhbmdsZU1lc2ggPSBidFRyaWFuZ2xlTWVzaCA9IG5ldyBBbW1vLmJ0VHJpYW5nbGVNZXNoKCk7XHJcbiAgICAgICAgICAgIGNvY29zMkFtbW9UcmlNZXNoKGJ0VHJpYW5nbGVNZXNoLCBtZXNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ0VHJpYW5nbGVNZXNoO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=