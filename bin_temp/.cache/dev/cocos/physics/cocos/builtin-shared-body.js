(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/math/index.js", "../../core/geometry/index.js", "./object/builtin-object.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/math/index.js"), require("../../core/geometry/index.js"), require("./object/builtin-object.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.builtinObject);
    global.builtinSharedBody = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _builtinObject) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BuiltinSharedBody = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  // tslint:disable: prefer-for-of
  var m4_0 = new _index.Mat4();
  var v3_0 = new _index.Vec3();
  var v3_1 = new _index.Vec3();
  var quat_0 = new _index.Quat();
  /**
   * Built-in static collider, no physical forces involved
   */

  var BuiltinSharedBody = /*#__PURE__*/function (_BuiltinObject) {
    _inherits(BuiltinSharedBody, _BuiltinObject);

    _createClass(BuiltinSharedBody, [{
      key: "id",
      get: function get() {
        return this._id;
      }
      /**
       * add or remove from world \
       * add, if enable \
       * remove, if disable & shapes.length == 0 & wrappedBody disable
       */

    }, {
      key: "enabled",
      set: function set(v) {
        if (v) {
          if (this.index < 0) {
            this.index = this.world.bodies.length;
            this.world.addSharedBody(this);
            this.syncInitial();
          }
        } else {
          if (this.index >= 0) {
            var isRemove = this.shapes.length == 0;

            if (isRemove) {
              this.index = -1;
              this.world.removeSharedBody(this);
            }
          }
        }
      }
    }, {
      key: "reference",
      set: function set(v) {
        v ? this.ref++ : this.ref--;

        if (this.ref == 0) {
          this.destroy();
        }
      }
      /** id generator */

    }], [{
      key: "getSharedBody",
      value: function getSharedBody(node, wrappedWorld) {
        var key = node.uuid;

        if (BuiltinSharedBody.sharedBodesMap.has(key)) {
          return BuiltinSharedBody.sharedBodesMap.get(key);
        } else {
          var newSB = new BuiltinSharedBody(node, wrappedWorld);
          BuiltinSharedBody.sharedBodesMap.set(node.uuid, newSB);
          return newSB;
        }
      }
    }]);

    function BuiltinSharedBody(node, world) {
      var _this;

      _classCallCheck(this, BuiltinSharedBody);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BuiltinSharedBody).call(this));
      _this._id = void 0;
      _this.index = -1;
      _this.ref = 0;
      _this.node = void 0;
      _this.world = void 0;
      _this.shapes = [];
      _this.wrappedBody = null;
      _this._id = BuiltinSharedBody.idCounter++;
      _this.node = node;
      _this.world = world;
      return _this;
    }

    _createClass(BuiltinSharedBody, [{
      key: "intersects",
      value: function intersects(body) {
        for (var i = 0; i < this.shapes.length; i++) {
          var shapeA = this.shapes[i];

          for (var j = 0; j < body.shapes.length; j++) {
            var shapeB = body.shapes[j];

            if (shapeA.collider.needTriggerEvent || shapeB.collider.needTriggerEvent) {
              if (_index2.intersect.resolve(shapeA.worldShape, shapeB.worldShape)) {
                this.world.shapeArr.push(shapeA);
                this.world.shapeArr.push(shapeB);
              }
            }
          }
        }
      }
    }, {
      key: "addShape",
      value: function addShape(shape) {
        var i = this.shapes.indexOf(shape);

        if (i < 0) {
          this.shapes.push(shape);
        }
      }
    }, {
      key: "removeShape",
      value: function removeShape(shape) {
        var i = this.shapes.indexOf(shape);

        if (i >= 0) {
          this.shapes.splice(i, 1);
        }
      }
    }, {
      key: "syncSceneToPhysics",
      value: function syncSceneToPhysics() {
        if (this.node.hasChangedFlags) {
          this.node.getWorldMatrix(m4_0);
          v3_0.set(this.node.worldPosition);
          quat_0.set(this.node.worldRotation);
          v3_1.set(this.node.worldScale);

          for (var i = 0; i < this.shapes.length; i++) {
            this.shapes[i].transform(m4_0, v3_0, quat_0, v3_1);
          }
        }
      }
    }, {
      key: "syncInitial",
      value: function syncInitial() {
        this.node.getWorldMatrix(m4_0);
        v3_0.set(this.node.worldPosition);
        quat_0.set(this.node.worldRotation);
        v3_1.set(this.node.worldScale);

        for (var i = 0; i < this.shapes.length; i++) {
          this.shapes[i].transform(m4_0, v3_0, quat_0, v3_1);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        BuiltinSharedBody.sharedBodesMap["delete"](this.node.uuid);
        this.node = null;
        this.world = null;
        this.shapes = null;
      }
    }]);

    return BuiltinSharedBody;
  }(_builtinObject.BuiltinObject);

  _exports.BuiltinSharedBody = BuiltinSharedBody;
  BuiltinSharedBody.sharedBodesMap = new Map();
  BuiltinSharedBody.idCounter = 0;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3MvYnVpbHRpbi1zaGFyZWQtYm9keS50cyJdLCJuYW1lcyI6WyJtNF8wIiwiTWF0NCIsInYzXzAiLCJWZWMzIiwidjNfMSIsInF1YXRfMCIsIlF1YXQiLCJCdWlsdGluU2hhcmVkQm9keSIsIl9pZCIsInYiLCJpbmRleCIsIndvcmxkIiwiYm9kaWVzIiwibGVuZ3RoIiwiYWRkU2hhcmVkQm9keSIsInN5bmNJbml0aWFsIiwiaXNSZW1vdmUiLCJzaGFwZXMiLCJyZW1vdmVTaGFyZWRCb2R5IiwicmVmIiwiZGVzdHJveSIsIm5vZGUiLCJ3cmFwcGVkV29ybGQiLCJrZXkiLCJ1dWlkIiwic2hhcmVkQm9kZXNNYXAiLCJoYXMiLCJnZXQiLCJuZXdTQiIsInNldCIsIndyYXBwZWRCb2R5IiwiaWRDb3VudGVyIiwiYm9keSIsImkiLCJzaGFwZUEiLCJqIiwic2hhcGVCIiwiY29sbGlkZXIiLCJuZWVkVHJpZ2dlckV2ZW50IiwiaW50ZXJzZWN0IiwicmVzb2x2ZSIsIndvcmxkU2hhcGUiLCJzaGFwZUFyciIsInB1c2giLCJzaGFwZSIsImluZGV4T2YiLCJzcGxpY2UiLCJoYXNDaGFuZ2VkRmxhZ3MiLCJnZXRXb3JsZE1hdHJpeCIsIndvcmxkUG9zaXRpb24iLCJ3b3JsZFJvdGF0aW9uIiwid29ybGRTY2FsZSIsInRyYW5zZm9ybSIsIkJ1aWx0aW5PYmplY3QiLCJNYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV0E7QUFFQSxNQUFNQSxJQUFJLEdBQUcsSUFBSUMsV0FBSixFQUFiO0FBQ0EsTUFBTUMsSUFBSSxHQUFHLElBQUlDLFdBQUosRUFBYjtBQUNBLE1BQU1DLElBQUksR0FBRyxJQUFJRCxXQUFKLEVBQWI7QUFDQSxNQUFNRSxNQUFNLEdBQUcsSUFBSUMsV0FBSixFQUFmO0FBRUE7Ozs7TUFHYUMsaUI7Ozs7OzBCQWVDO0FB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QyxpQkFBS2hCLE1BQUwsQ0FBWWdCLENBQVosRUFBZW1CLFNBQWYsQ0FBeUJwRCxJQUF6QixFQUErQkUsSUFBL0IsRUFBcUNHLE1BQXJDLEVBQTZDRCxJQUE3QztBQUNIO0FBQ0o7QUFDSjs7O29DQUVjO0FBQ1gsYUFBS2lCLElBQUwsQ0FBVTJCLGNBQVYsQ0FBeUJoRCxJQUF6QjtBQUNBRSxRQUFBQSxJQUFJLENBQUMyQixHQUFMLENBQVMsS0FBS1IsSUFBTCxDQUFVNEIsYUFBbkI7QUFDQTVDLFFBQUFBLE1BQU0sQ0FBQ3dCLEdBQVAsQ0FBVyxLQUFLUixJQUFMLENBQVU2QixhQUFyQjtBQUNBOUMsUUFBQUEsSUFBSSxDQUFDeUIsR0FBTCxDQUFTLEtBQUtSLElBQUwsQ0FBVThCLFVBQW5COztBQUNBLGFBQUssSUFBSWxCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS2hCLE1BQUwsQ0FBWUosTUFBaEMsRUFBd0NvQixDQUFDLEVBQXpDLEVBQTZDO0FBQ3pDLGVBQUtoQixNQUFMLENBQVlnQixDQUFaLEVBQWVtQixTQUFmLENBQXlCcEQsSUFBekIsRUFBK0JFLElBQS9CLEVBQXFDRyxNQUFyQyxFQUE2Q0QsSUFBN0M7QUFDSDtBQUNKOzs7Z0NBRWtCO0FBQ2ZHLFFBQUFBLGlCQUFpQixDQUFDa0IsY0FBbEIsV0FBd0MsS0FBS0osSUFBTCxDQUFVRyxJQUFsRDtBQUNDLGFBQUtILElBQU4sR0FBcUIsSUFBckI7QUFDQyxhQUFLVixLQUFOLEdBQXNCLElBQXRCO0FBQ0MsYUFBS00sTUFBTixHQUF1QixJQUF2QjtBQUNIOzs7O0lBMUhrQ29DLDRCOzs7QUFBMUI5QyxFQUFBQSxpQixDQUVla0IsYyxHQUFpQixJQUFJNkIsR0FBSixFO0FBRmhDL0MsRUFBQUEsaUIsQ0FpRE13QixTLEdBQW9CLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IE1hdDQsIFF1YXQsIFZlYzMgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBpbnRlcnNlY3QgfSBmcm9tICcuLi8uLi9jb3JlL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgQnVpbHRJbldvcmxkIH0gZnJvbSAnLi9idWlsdGluLXdvcmxkJztcclxuaW1wb3J0IHsgQnVpbHRpbk9iamVjdCB9IGZyb20gJy4vb2JqZWN0L2J1aWx0aW4tb2JqZWN0JztcclxuaW1wb3J0IHsgQnVpbHRpblNoYXBlIH0gZnJvbSAnLi9zaGFwZXMvYnVpbHRpbi1zaGFwZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgQnVpbHRpblJpZ2lkQm9keSB9IGZyb20gJy4vYnVpbHRpbi1yaWdpZC1ib2R5JztcclxuLy8gdHNsaW50OmRpc2FibGU6IHByZWZlci1mb3Itb2ZcclxuXHJcbmNvbnN0IG00XzAgPSBuZXcgTWF0NCgpO1xyXG5jb25zdCB2M18wID0gbmV3IFZlYzMoKTtcclxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IHF1YXRfMCA9IG5ldyBRdWF0KCk7XHJcblxyXG4vKipcclxuICogQnVpbHQtaW4gc3RhdGljIGNvbGxpZGVyLCBubyBwaHlzaWNhbCBmb3JjZXMgaW52b2x2ZWRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBCdWlsdGluU2hhcmVkQm9keSBleHRlbmRzIEJ1aWx0aW5PYmplY3Qge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHNoYXJlZEJvZGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIEJ1aWx0aW5TaGFyZWRCb2R5PigpO1xyXG5cclxuICAgIHN0YXRpYyBnZXRTaGFyZWRCb2R5IChub2RlOiBOb2RlLCB3cmFwcGVkV29ybGQ6IEJ1aWx0SW5Xb3JsZCkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IG5vZGUudXVpZDtcclxuICAgICAgICBpZiAoQnVpbHRpblNoYXJlZEJvZHkuc2hhcmVkQm9kZXNNYXAuaGFzKGtleSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJ1aWx0aW5TaGFyZWRCb2R5LnNoYXJlZEJvZGVzTWFwLmdldChrZXkpITtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdTQiA9IG5ldyBCdWlsdGluU2hhcmVkQm9keShub2RlLCB3cmFwcGVkV29ybGQpO1xyXG4gICAgICAgICAgICBCdWlsdGluU2hhcmVkQm9keS5zaGFyZWRCb2Rlc01hcC5zZXQobm9kZS51dWlkLCBuZXdTQik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdTQjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgb3IgcmVtb3ZlIGZyb20gd29ybGQgXFxcclxuICAgICAqIGFkZCwgaWYgZW5hYmxlIFxcXHJcbiAgICAgKiByZW1vdmUsIGlmIGRpc2FibGUgJiBzaGFwZXMubGVuZ3RoID09IDAgJiB3cmFwcGVkQm9keSBkaXNhYmxlXHJcbiAgICAgKi9cclxuICAgIHNldCBlbmFibGVkICh2OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy53b3JsZC5ib2RpZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRTaGFyZWRCb2R5KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zeW5jSW5pdGlhbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNSZW1vdmUgPSAodGhpcy5zaGFwZXMubGVuZ3RoID09IDApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc1JlbW92ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkLnJlbW92ZVNoYXJlZEJvZHkodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJlZmVyZW5jZSAodjogYm9vbGVhbikge1xyXG4gICAgICAgIHYgPyB0aGlzLnJlZisrIDogdGhpcy5yZWYtLTtcclxuICAgICAgICBpZiAodGhpcy5yZWYgPT0gMCkgeyB0aGlzLmRlc3Ryb3koKTsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBpZCBnZW5lcmF0b3IgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnRlcjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2lkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgIHByaXZhdGUgcmVmOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHJlYWRvbmx5IG5vZGU6IE5vZGU7XHJcbiAgICByZWFkb25seSB3b3JsZDogQnVpbHRJbldvcmxkO1xyXG4gICAgcmVhZG9ubHkgc2hhcGVzOiBCdWlsdGluU2hhcGVbXSA9IFtdO1xyXG4gICAgd3JhcHBlZEJvZHk6IEJ1aWx0aW5SaWdpZEJvZHkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yIChub2RlOiBOb2RlLCB3b3JsZDogQnVpbHRJbldvcmxkKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9pZCA9IEJ1aWx0aW5TaGFyZWRCb2R5LmlkQ291bnRlcisrO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICAgICAgdGhpcy53b3JsZCA9IHdvcmxkO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyc2VjdHMgKGJvZHk6IEJ1aWx0aW5TaGFyZWRCb2R5KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoYXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBzaGFwZUEgPSB0aGlzLnNoYXBlc1tpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2R5LnNoYXBlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVCID0gYm9keS5zaGFwZXNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hhcGVBLmNvbGxpZGVyLm5lZWRUcmlnZ2VyRXZlbnQgfHwgc2hhcGVCLmNvbGxpZGVyLm5lZWRUcmlnZ2VyRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJzZWN0LnJlc29sdmUoc2hhcGVBLndvcmxkU2hhcGUsIHNoYXBlQi53b3JsZFNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkLnNoYXBlQXJyLnB1c2goc2hhcGVBKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZC5zaGFwZUFyci5wdXNoKHNoYXBlQik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZFNoYXBlIChzaGFwZTogQnVpbHRpblNoYXBlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuc2hhcGVzLmluZGV4T2Yoc2hhcGUpO1xyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlcy5wdXNoKHNoYXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlU2hhcGUgKHNoYXBlOiBCdWlsdGluU2hhcGUpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpID0gdGhpcy5zaGFwZXMuaW5kZXhPZihzaGFwZSk7XHJcbiAgICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN5bmNTY2VuZVRvUGh5c2ljcyAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZS5oYXNDaGFuZ2VkRmxhZ3MpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmdldFdvcmxkTWF0cml4KG00XzApO1xyXG4gICAgICAgICAgICB2M18wLnNldCh0aGlzLm5vZGUud29ybGRQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHF1YXRfMC5zZXQodGhpcy5ub2RlLndvcmxkUm90YXRpb24pO1xyXG4gICAgICAgICAgICB2M18xLnNldCh0aGlzLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhcGVzW2ldLnRyYW5zZm9ybShtNF8wLCB2M18wLCBxdWF0XzAsIHYzXzEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN5bmNJbml0aWFsICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRNYXRyaXgobTRfMCk7XHJcbiAgICAgICAgdjNfMC5zZXQodGhpcy5ub2RlLndvcmxkUG9zaXRpb24pO1xyXG4gICAgICAgIHF1YXRfMC5zZXQodGhpcy5ub2RlLndvcmxkUm90YXRpb24pO1xyXG4gICAgICAgIHYzXzEuc2V0KHRoaXMubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGVzW2ldLnRyYW5zZm9ybShtNF8wLCB2M18wLCBxdWF0XzAsIHYzXzEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIEJ1aWx0aW5TaGFyZWRCb2R5LnNoYXJlZEJvZGVzTWFwLmRlbGV0ZSh0aGlzLm5vZGUudXVpZCk7XHJcbiAgICAgICAgKHRoaXMubm9kZSBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICAodGhpcy53b3JsZCBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICAodGhpcy5zaGFwZXMgYXMgYW55KSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuIl19