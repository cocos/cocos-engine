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
    global.cannonTrimeshShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _cannonShape, _index, _cannonUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonTrimeshShape = void 0;
  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var v3_cannon0 = new _cannon.default.Vec3();

  var CannonTrimeshShape = /*#__PURE__*/function (_CannonShape) {
    _inherits(CannonTrimeshShape, _CannonShape);

    function CannonTrimeshShape() {
      _classCallCheck(this, CannonTrimeshShape);

      return _possibleConstructorReturn(this, _getPrototypeOf(CannonTrimeshShape).apply(this, arguments));
    }

    _createClass(CannonTrimeshShape, [{
      key: "setMesh",
      value: function setMesh(v) {
        if (!this._isBinding) return;
        var mesh = v;

        if (this._shape != null) {
          if (mesh && mesh.renderingSubMeshes.length > 0) {
            var vertices = mesh.renderingSubMeshes[0].geometricInfo.positions;
            var indices = mesh.renderingSubMeshes[0].geometricInfo.indices;
            this.updateProperties(vertices, indices);
          } else {
            this.updateProperties(new Float32Array(), new Uint16Array());
          }
        } else {
          if (mesh && mesh.renderingSubMeshes.length > 0) {
            var _vertices = mesh.renderingSubMeshes[0].geometricInfo.positions;
            var _indices = mesh.renderingSubMeshes[0].geometricInfo.indices;
            this._shape = new _cannon.default.Trimesh(_vertices, _indices);
          } else {
            this._shape = new _cannon.default.Trimesh(new Float32Array(), new Uint16Array());
          }
        }
      }
    }, {
      key: "onComponentSet",
      value: function onComponentSet() {
        this.setMesh(this.collider.mesh);
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(CannonTrimeshShape.prototype), "onLoad", this).call(this);

        this.setMesh(this.collider.mesh);
      }
    }, {
      key: "setScale",
      value: function setScale(scale) {
        _get(_getPrototypeOf(CannonTrimeshShape.prototype), "setScale", this).call(this, scale);

        _index.Vec3.copy(v3_cannon0, scale);

        this.impl.setScale(v3_cannon0);
      }
    }, {
      key: "updateProperties",
      value: function updateProperties(vertices, indices) {
        this.impl.vertices = new Float32Array(vertices);
        this.impl.indices = new Int16Array(indices);
        this.impl.normals = new Float32Array(indices.length);
        this.impl.aabb = new _cannon.default.AABB();
        this.impl.edges = [];
        this.impl.tree = new _cannon.default.Octree(new _cannon.default.AABB());
        this.impl.updateEdges();
        this.impl.updateNormals();
        this.impl.updateAABB();
        this.impl.updateBoundingSphereRadius();
        this.impl.updateTree();
        this.impl.setScale(this.impl.scale);

        if (this._index >= 0) {
          (0, _cannonUtil.commitShapeUpdates)(this._body);
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

    return CannonTrimeshShape;
  }(_cannonShape.CannonShape);

  _exports.CannonTrimeshShape = CannonTrimeshShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tdHJpbWVzaC1zaGFwZS50cyJdLCJuYW1lcyI6WyJ2M19jYW5ub24wIiwiQ0FOTk9OIiwiVmVjMyIsIkNhbm5vblRyaW1lc2hTaGFwZSIsInYiLCJfaXNCaW5kaW5nIiwibWVzaCIsIl9zaGFwZSIsInJlbmRlcmluZ1N1Yk1lc2hlcyIsImxlbmd0aCIsInZlcnRpY2VzIiwiZ2VvbWV0cmljSW5mbyIsInBvc2l0aW9ucyIsImluZGljZXMiLCJ1cGRhdGVQcm9wZXJ0aWVzIiwiRmxvYXQzMkFycmF5IiwiVWludDE2QXJyYXkiLCJUcmltZXNoIiwic2V0TWVzaCIsImNvbGxpZGVyIiwic2NhbGUiLCJjb3B5IiwiaW1wbCIsInNldFNjYWxlIiwiSW50MTZBcnJheSIsIm5vcm1hbHMiLCJhYWJiIiwiQUFCQiIsImVkZ2VzIiwidHJlZSIsIk9jdHJlZSIsInVwZGF0ZUVkZ2VzIiwidXBkYXRlTm9ybWFscyIsInVwZGF0ZUFBQkIiLCJ1cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cyIsInVwZGF0ZVRyZWUiLCJfaW5kZXgiLCJfYm9keSIsIl9jb2xsaWRlciIsIkNhbm5vblNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSxNQUFNQSxVQUFVLEdBQUcsSUFBSUMsZ0JBQU9DLElBQVgsRUFBbkI7O01BRWFDLGtCOzs7Ozs7Ozs7Ozs4QkFVQUMsQyxFQUFnQjtBQUNyQixZQUFJLENBQUMsS0FBS0MsVUFBVixFQUFzQjtBQUV0QixZQUFNQyxJQUFJLEdBQUdGLENBQWI7O0FBQ0EsWUFBSSxLQUFLRyxNQUFMLElBQWUsSUFBbkIsRUFBeUI7QUFDckIsY0FBSUQsSUFBSSxJQUFJQSxJQUFJLENBQUNFLGtCQUFMLENBQXdCQyxNQUF4QixHQUFpQyxDQUE3QyxFQUFnRDtBQUM1QyxnQkFBTUMsUUFBUSxHQUFHSixJQUFJLENBQUNFLGtCQUFMLENBQXdCLENBQXhCLEVBQTJCRyxhQUEzQixDQUEwQ0MsU0FBM0Q7QUFDQSxnQkFBTUMsT0FBTyxHQUFHUCxJQUFJLENBQUNFLGtCQUFMLENBQXdCLENBQXhCLEVBQTJCRyxhQUEzQixDQUEwQ0UsT0FBMUQ7QUFDQSxpQkFBS0MsZ0JBQUwsQ0FBc0JKLFFBQXRCLEVBQWdDRyxPQUFoQztBQUNILFdBSkQsTUFJTztBQUNILGlCQUFLQyxnQkFBTCxDQUFzQixJQUFJQyxZQUFKLEVBQXRCLEVBQTBDLElBQUlDLFdBQUosRUFBMUM7QUFDSDtBQUNKLFNBUkQsTUFRTztBQUNILGNBQUlWLElBQUksSUFBSUEsSUFBSSxDQUFDRSxrQkFBTCxDQUF3QkMsTUFBeEIsR0FBaUMsQ0FBN0MsRUFBZ0Q7QUFDNUMsZ0JBQU1DLFNBQVEsR0FBR0osSUFBSSxDQUFDRSxrQkFBTCxDQUF3QixDQUF4QixFQUEyQkcsYUFBM0IsQ0FBMENDLFNBQTNEO0FBQ0EsZ0JBQU1DLFFBQU8sR0FBR1AsSUFBSSxDQUFDRSxrQkFBTCxDQUF3QixDQUF4QixFQUEyQkcsYUFBM0IsQ0FBMENFLE9BQTFEO0FBQ0EsaUJBQUtOLE1BQUwsR0FBYyxJQUFJTixnQkFBT2dCLE9BQVgsQ0FBbUJQLFNBQW5CLEVBQTZCRyxRQUE3QixDQUFkO0FBQ0gsV0FKRCxNQUlPO0FBQ0gsaUJBQUtOLE1BQUwsR0FBYyxJQUFJTixnQkFBT2dCLE9BQVgsQ0FBbUIsSUFBSUYsWUFBSixFQUFuQixFQUF1QyxJQUFJQyxXQUFKLEVBQXZDLENBQWQ7QUFDSDtBQUNKO0FBQ0o7Ozt1Q0FFMkI7QUFDeEIsYUFBS0UsT0FBTCxDQUFhLEtBQUtDLFFBQUwsQ0FBY2IsSUFBM0I7QUFDSDs7OytCQUVTO0FBQ047O0FBQ0EsYUFBS1ksT0FBTCxDQUFhLEtBQUtDLFFBQUwsQ0FBY2IsSUFBM0I7QUFDSDs7OytCQUVTYyxLLEVBQWE7QUFDbkIseUZBQWVBLEtBQWY7O0FBQ0FsQixvQkFBS21CLElBQUwsQ0FBVXJCLFVBQVYsRUFBc0JvQixLQUF0Qjs7QUFDQSxhQUFLRSxJQUFMLENBQVVDLFFBQVYsQ0FBbUJ2QixVQUFuQjtBQUNIOzs7dUNBRWlCVSxRLEVBQXdCRyxPLEVBQXNCO0FBQzVELGFBQUtTLElBQUwsQ0FBVVosUUFBVixHQUFxQixJQUFJSyxZQUFKLENBQWlCTCxRQUFqQixDQUFyQjtBQUNBLGFBQUtZLElBQUwsQ0FBVVQsT0FBVixHQUFvQixJQUFJVyxVQUFKLENBQWVYLE9BQWYsQ0FBcEI7QUFDQSxhQUFLUyxJQUFMLENBQVVHLE9BQVYsR0FBb0IsSUFBSVYsWUFBSixDQUFpQkYsT0FBTyxDQUFDSixNQUF6QixDQUFwQjtBQUNBLGFBQUthLElBQUwsQ0FBVUksSUFBVixHQUFpQixJQUFJekIsZ0JBQU8wQixJQUFYLEVBQWpCO0FBQ0EsYUFBS0wsSUFBTCxDQUFVTSxLQUFWLEdBQWtCLEVBQWxCO0FBQ0EsYUFBS04sSUFBTCxDQUFVTyxJQUFWLEdBQWlCLElBQUk1QixnQkFBTzZCLE1BQVgsQ0FBa0IsSUFBSTdCLGdCQUFPMEIsSUFBWCxFQUFsQixDQUFqQjtBQUNBLGFBQUtMLElBQUwsQ0FBVVMsV0FBVjtBQUNBLGFBQUtULElBQUwsQ0FBVVUsYUFBVjtBQUNBLGFBQUtWLElBQUwsQ0FBVVcsVUFBVjtBQUNBLGFBQUtYLElBQUwsQ0FBVVksMEJBQVY7QUFDQSxhQUFLWixJQUFMLENBQVVhLFVBQVY7QUFDQSxhQUFLYixJQUFMLENBQVVDLFFBQVYsQ0FBbUIsS0FBS0QsSUFBTCxDQUFVRixLQUE3Qjs7QUFDQSxZQUFJLEtBQUtnQixNQUFMLElBQWUsQ0FBbkIsRUFBc0I7QUFDbEIsOENBQW1CLEtBQUtDLEtBQXhCO0FBQ0g7QUFDSjs7OzBCQTlEZTtBQUNaLGVBQU8sS0FBS0MsU0FBWjtBQUNIOzs7MEJBRVc7QUFDUixlQUFPLEtBQUsvQixNQUFaO0FBQ0g7Ozs7SUFSbUNnQyx3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDQU5OT04gZnJvbSAnQGNvY29zL2Nhbm5vbic7XHJcbmltcG9ydCB7IENhbm5vblNoYXBlIH0gZnJvbSAnLi9jYW5ub24tc2hhcGUnO1xyXG5pbXBvcnQgeyBNZXNoQ29sbGlkZXIgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBNZXNoLCBWZWMzIH0gZnJvbSAnLi4vLi4vLi4vY29yZSc7XHJcbmltcG9ydCB7IElUcmltZXNoU2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IGNvbW1pdFNoYXBlVXBkYXRlcyB9IGZyb20gJy4uL2Nhbm5vbi11dGlsJztcclxuXHJcbmNvbnN0IHYzX2Nhbm5vbjAgPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW5ub25UcmltZXNoU2hhcGUgZXh0ZW5kcyBDYW5ub25TaGFwZSBpbXBsZW1lbnRzIElUcmltZXNoU2hhcGUge1xyXG5cclxuICAgIGdldCBjb2xsaWRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpZGVyIGFzIE1lc2hDb2xsaWRlcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW1wbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlIGFzIENBTk5PTi5UcmltZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1lc2ggKHY6IE1lc2ggfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0JpbmRpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgbWVzaCA9IHY7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NoYXBlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKG1lc2ggJiYgbWVzaC5yZW5kZXJpbmdTdWJNZXNoZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmVydGljZXMgPSBtZXNoLnJlbmRlcmluZ1N1Yk1lc2hlc1swXS5nZW9tZXRyaWNJbmZvIS5wb3NpdGlvbnM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRpY2VzID0gbWVzaC5yZW5kZXJpbmdTdWJNZXNoZXNbMF0uZ2VvbWV0cmljSW5mbyEuaW5kaWNlcyBhcyBVaW50MTZBcnJheTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllcyh2ZXJ0aWNlcywgaW5kaWNlcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMobmV3IEZsb2F0MzJBcnJheSgpLCBuZXcgVWludDE2QXJyYXkoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobWVzaCAmJiBtZXNoLnJlbmRlcmluZ1N1Yk1lc2hlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IG1lc2gucmVuZGVyaW5nU3ViTWVzaGVzWzBdLmdlb21ldHJpY0luZm8hLnBvc2l0aW9ucztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSBtZXNoLnJlbmRlcmluZ1N1Yk1lc2hlc1swXS5nZW9tZXRyaWNJbmZvIS5pbmRpY2VzIGFzIFVpbnQxNkFycmF5O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhcGUgPSBuZXcgQ0FOTk9OLlRyaW1lc2godmVydGljZXMsIGluZGljZXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhcGUgPSBuZXcgQ0FOTk9OLlRyaW1lc2gobmV3IEZsb2F0MzJBcnJheSgpLCBuZXcgVWludDE2QXJyYXkoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uQ29tcG9uZW50U2V0ICgpIHtcclxuICAgICAgICB0aGlzLnNldE1lc2godGhpcy5jb2xsaWRlci5tZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMuc2V0TWVzaCh0aGlzLmNvbGxpZGVyLm1lc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNjYWxlIChzY2FsZTogVmVjMykge1xyXG4gICAgICAgIHN1cGVyLnNldFNjYWxlKHNjYWxlKTtcclxuICAgICAgICBWZWMzLmNvcHkodjNfY2Fubm9uMCwgc2NhbGUpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5zZXRTY2FsZSh2M19jYW5ub24wKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQcm9wZXJ0aWVzICh2ZXJ0aWNlczogRmxvYXQzMkFycmF5LCBpbmRpY2VzOiBVaW50MTZBcnJheSkge1xyXG4gICAgICAgIHRoaXMuaW1wbC52ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5pbmRpY2VzID0gbmV3IEludDE2QXJyYXkoaW5kaWNlcyk7XHJcbiAgICAgICAgdGhpcy5pbXBsLm5vcm1hbHMgPSBuZXcgRmxvYXQzMkFycmF5KGluZGljZXMubGVuZ3RoKTtcclxuICAgICAgICB0aGlzLmltcGwuYWFiYiA9IG5ldyBDQU5OT04uQUFCQigpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5lZGdlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW1wbC50cmVlID0gbmV3IENBTk5PTi5PY3RyZWUobmV3IENBTk5PTi5BQUJCKCkpO1xyXG4gICAgICAgIHRoaXMuaW1wbC51cGRhdGVFZGdlcygpO1xyXG4gICAgICAgIHRoaXMuaW1wbC51cGRhdGVOb3JtYWxzKCk7XHJcbiAgICAgICAgdGhpcy5pbXBsLnVwZGF0ZUFBQkIoKTtcclxuICAgICAgICB0aGlzLmltcGwudXBkYXRlQm91bmRpbmdTcGhlcmVSYWRpdXMoKTtcclxuICAgICAgICB0aGlzLmltcGwudXBkYXRlVHJlZSgpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5zZXRTY2FsZSh0aGlzLmltcGwuc2NhbGUpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19