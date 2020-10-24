(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/math/index.js", "./builtin-shared-body.js", "../utils/array-collision-matrix.js", "../../core/geometry/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/math/index.js"), require("./builtin-shared-body.js"), require("../utils/array-collision-matrix.js"), require("../../core/geometry/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.builtinSharedBody, global.arrayCollisionMatrix, global.index);
    global.builtinWorld = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _builtinSharedBody, _arrayCollisionMatrix, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BuiltInWorld = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var hitPoint = new _index.Vec3();
  var TriggerEventObject = {
    type: 'onTriggerEnter',
    selfCollider: null,
    otherCollider: null,
    impl: {}
  };
  /**
   * Built-in collision system, intended for use as a
   * efficient discrete collision detector,
   * not a full physical simulator
   */

  var BuiltInWorld = /*#__PURE__*/function () {
    function BuiltInWorld() {
      _classCallCheck(this, BuiltInWorld);

      this.shapeArr = [];
      this.bodies = [];
      this._shapeArrPrev = [];
      this._collisionMatrix = new _arrayCollisionMatrix.ArrayCollisionMatrix();
      this._collisionMatrixPrev = new _arrayCollisionMatrix.ArrayCollisionMatrix();
    }

    _createClass(BuiltInWorld, [{
      key: "setGravity",
      value: function setGravity(v) {}
    }, {
      key: "setAllowSleep",
      value: function setAllowSleep(v) {}
    }, {
      key: "setDefaultMaterial",
      value: function setDefaultMaterial(v) {}
    }, {
      key: "step",
      value: function step(deltaTime) {
        // store and reset collision array
        var tmp = this._shapeArrPrev;
        this._shapeArrPrev = this.shapeArr;
        this.shapeArr = tmp;
        this.shapeArr.length = 0; // collision detection

        for (var i = 0; i < this.bodies.length; i++) {
          var bodyA = this.bodies[i];

          for (var j = i + 1; j < this.bodies.length; j++) {
            var bodyB = this.bodies[j]; // first, Check collision filter masks

            if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0 || (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0) {
              continue;
            }

            bodyA.intersects(bodyB);
          }
        }
      }
    }, {
      key: "syncSceneToPhysics",
      value: function syncSceneToPhysics() {
        for (var i = 0; i < this.bodies.length; i++) {
          this.bodies[i].syncSceneToPhysics();
        }
      }
    }, {
      key: "emitEvents",
      value: function emitEvents() {
        this.emitTriggerEvent();
      }
    }, {
      key: "raycastClosest",
      value: function raycastClosest(worldRay, options, out) {
        var tmp_d = Infinity;
        var max_d = options.maxDistance;
        var mask = options.mask;

        for (var i = 0; i < this.bodies.length; i++) {
          var body = this.bodies[i];
          if (!(body.collisionFilterGroup & mask)) continue;

          for (var _i = 0; _i < body.shapes.length; _i++) {
            var shape = body.shapes[_i];

            var distance = _index2.intersect.resolve(worldRay, shape.worldShape);

            if (distance == 0 || distance > max_d) {
              continue;
            }

            if (tmp_d > distance) {
              tmp_d = distance;

              _index.Vec3.normalize(hitPoint, worldRay.d);

              _index.Vec3.scaleAndAdd(hitPoint, worldRay.o, hitPoint, distance);

              out._assign(hitPoint, distance, shape.collider, _index.Vec3.ZERO);
            }
          }
        }

        return !(tmp_d == Infinity);
      }
    }, {
      key: "raycast",
      value: function raycast(worldRay, options, pool, results) {
        var max_d = options.maxDistance;
        var mask = options.mask;

        for (var i = 0; i < this.bodies.length; i++) {
          var body = this.bodies[i];
          if (!(body.collisionFilterGroup & mask)) continue;

          for (var _i2 = 0; _i2 < body.shapes.length; _i2++) {
            var shape = body.shapes[_i2];

            var distance = _index2.intersect.resolve(worldRay, shape.worldShape);

            if (distance == 0 || distance > max_d) {
              continue;
            } else {
              var r = pool.add();
              worldRay.computeHit(hitPoint, distance);

              r._assign(hitPoint, distance, shape.collider, _index.Vec3.ZERO);

              results.push(r);
            }
          }
        }

        return results.length > 0;
      }
    }, {
      key: "getSharedBody",
      value: function getSharedBody(node) {
        return _builtinSharedBody.BuiltinSharedBody.getSharedBody(node, this);
      }
    }, {
      key: "addSharedBody",
      value: function addSharedBody(body) {
        var index = this.bodies.indexOf(body);

        if (index < 0) {
          this.bodies.push(body);
        }
      }
    }, {
      key: "removeSharedBody",
      value: function removeSharedBody(body) {
        var index = this.bodies.indexOf(body);

        if (index >= 0) {
          this.bodies.splice(index, 1);
        }
      }
    }, {
      key: "updateCollisionMatrix",
      value: function updateCollisionMatrix(group, mask) {
        for (var i = 0; i < this.bodies.length; i++) {
          var b = this.bodies[i];

          if (b.collisionFilterGroup == group) {
            b.collisionFilterMask = mask;
          }
        }
      }
    }, {
      key: "emitTriggerEvent",
      value: function emitTriggerEvent() {
        var shapeA;
        var shapeB;

        for (var i = 0; i < this.shapeArr.length; i += 2) {
          shapeA = this.shapeArr[i];
          shapeB = this.shapeArr[i + 1];
          TriggerEventObject.selfCollider = shapeA.collider;
          TriggerEventObject.otherCollider = shapeB.collider;

          this._collisionMatrix.set(shapeA.id, shapeB.id, true);

          if (this._collisionMatrixPrev.get(shapeA.id, shapeB.id)) {
            // emit stay
            TriggerEventObject.type = 'onTriggerStay';
          } else {
            // first trigger, emit enter
            TriggerEventObject.type = 'onTriggerEnter';
          }

          if (shapeA.collider) {
            shapeA.collider.emit(TriggerEventObject.type, TriggerEventObject);
          }

          TriggerEventObject.selfCollider = shapeB.collider;
          TriggerEventObject.otherCollider = shapeA.collider;

          if (shapeB.collider) {
            shapeB.collider.emit(TriggerEventObject.type, TriggerEventObject);
          }
        }

        for (var _i3 = 0; _i3 < this._shapeArrPrev.length; _i3 += 2) {
          shapeA = this._shapeArrPrev[_i3];
          shapeB = this._shapeArrPrev[_i3 + 1];

          if (this._collisionMatrixPrev.get(shapeA.id, shapeB.id)) {
            if (!this._collisionMatrix.get(shapeA.id, shapeB.id)) {
              // emit exit
              TriggerEventObject.type = 'onTriggerExit';
              TriggerEventObject.selfCollider = shapeA.collider;
              TriggerEventObject.otherCollider = shapeB.collider;

              if (shapeA.collider) {
                shapeA.collider.emit(TriggerEventObject.type, TriggerEventObject);
              }

              TriggerEventObject.selfCollider = shapeB.collider;
              TriggerEventObject.otherCollider = shapeA.collider;

              if (shapeB.collider) {
                shapeB.collider.emit(TriggerEventObject.type, TriggerEventObject);
              }

              this._collisionMatrix.set(shapeA.id, shapeB.id, false);
            }
          }
        }

        var temp = this._collisionMatrixPrev.matrix;
        this._collisionMatrixPrev.matrix = this._collisionMatrix.matrix;
        this._collisionMatrix.matrix = temp;

        this._collisionMatrix.reset();
      }
    }, {
      key: "impl",
      get: function get() {
        return this;
      }
    }]);

    return BuiltInWorld;
  }();

  _exports.BuiltInWorld = BuiltInWorld;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3MvYnVpbHRpbi13b3JsZC50cyJdLCJuYW1lcyI6WyJoaXRQb2ludCIsIlZlYzMiLCJUcmlnZ2VyRXZlbnRPYmplY3QiLCJ0eXBlIiwic2VsZkNvbGxpZGVyIiwib3RoZXJDb2xsaWRlciIsImltcGwiLCJCdWlsdEluV29ybGQiLCJzaGFwZUFyciIsImJvZGllcyIsIl9zaGFwZUFyclByZXYiLCJfY29sbGlzaW9uTWF0cml4IiwiQXJyYXlDb2xsaXNpb25NYXRyaXgiLCJfY29sbGlzaW9uTWF0cml4UHJldiIsInYiLCJkZWx0YVRpbWUiLCJ0bXAiLCJsZW5ndGgiLCJpIiwiYm9keUEiLCJqIiwiYm9keUIiLCJjb2xsaXNpb25GaWx0ZXJHcm91cCIsImNvbGxpc2lvbkZpbHRlck1hc2siLCJpbnRlcnNlY3RzIiwic3luY1NjZW5lVG9QaHlzaWNzIiwiZW1pdFRyaWdnZXJFdmVudCIsIndvcmxkUmF5Iiwib3B0aW9ucyIsIm91dCIsInRtcF9kIiwiSW5maW5pdHkiLCJtYXhfZCIsIm1heERpc3RhbmNlIiwibWFzayIsImJvZHkiLCJzaGFwZXMiLCJzaGFwZSIsImRpc3RhbmNlIiwiaW50ZXJzZWN0IiwicmVzb2x2ZSIsIndvcmxkU2hhcGUiLCJub3JtYWxpemUiLCJkIiwic2NhbGVBbmRBZGQiLCJvIiwiX2Fzc2lnbiIsImNvbGxpZGVyIiwiWkVSTyIsInBvb2wiLCJyZXN1bHRzIiwiciIsImFkZCIsImNvbXB1dGVIaXQiLCJwdXNoIiwibm9kZSIsIkJ1aWx0aW5TaGFyZWRCb2R5IiwiZ2V0U2hhcmVkQm9keSIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImdyb3VwIiwiYiIsInNoYXBlQSIsInNoYXBlQiIsInNldCIsImlkIiwiZ2V0IiwiZW1pdCIsInRlbXAiLCJtYXRyaXgiLCJyZXNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEs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QU8sSUFBUDtBQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgUGh5c2ljc1JheVJlc3VsdCB9IGZyb20gJy4uL2ZyYW1ld29yay9waHlzaWNzLXJheS1yZXN1bHQnO1xyXG5pbXBvcnQgeyBCdWlsdGluU2hhcmVkQm9keSB9IGZyb20gJy4vYnVpbHRpbi1zaGFyZWQtYm9keSc7XHJcbmltcG9ydCB7IEJ1aWx0aW5TaGFwZSB9IGZyb20gJy4vc2hhcGVzL2J1aWx0aW4tc2hhcGUnO1xyXG5pbXBvcnQgeyBBcnJheUNvbGxpc2lvbk1hdHJpeCB9IGZyb20gJy4uL3V0aWxzL2FycmF5LWNvbGxpc2lvbi1tYXRyaXgnO1xyXG5pbXBvcnQgeyByYXksIGludGVyc2VjdCB9IGZyb20gJy4uLy4uL2NvcmUvZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBSZWN5Y2xlUG9vbCwgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBJUGh5c2ljc1dvcmxkLCBJUmF5Y2FzdE9wdGlvbnMgfSBmcm9tICcuLi9zcGVjL2ktcGh5c2ljcy13b3JsZCc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IFBoeXNpY01hdGVyaWFsIH0gZnJvbSAnLi8uLi9mcmFtZXdvcmsvYXNzZXRzL3BoeXNpYy1tYXRlcmlhbCc7XHJcbmltcG9ydCB7IFRyaWdnZXJFdmVudFR5cGUgfSBmcm9tICcuLi9mcmFtZXdvcmsvcGh5c2ljcy1pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBDb2xsaWRlciB9IGZyb20gJy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5cclxuY29uc3QgaGl0UG9pbnQgPSBuZXcgVmVjMygpO1xyXG5jb25zdCBUcmlnZ2VyRXZlbnRPYmplY3QgPSB7XHJcbiAgICB0eXBlOiAnb25UcmlnZ2VyRW50ZXInIGFzIHVua25vd24gYXMgVHJpZ2dlckV2ZW50VHlwZSxcclxuICAgIHNlbGZDb2xsaWRlcjogbnVsbCBhcyB1bmtub3duIGFzIENvbGxpZGVyLFxyXG4gICAgb3RoZXJDb2xsaWRlcjogbnVsbCBhcyB1bmtub3duIGFzIENvbGxpZGVyLFxyXG4gICAgaW1wbDoge30gYXMgYW55LFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEJ1aWx0LWluIGNvbGxpc2lvbiBzeXN0ZW0sIGludGVuZGVkIGZvciB1c2UgYXMgYVxyXG4gKiBlZmZpY2llbnQgZGlzY3JldGUgY29sbGlzaW9uIGRldGVjdG9yLFxyXG4gKiBub3QgYSBmdWxsIHBoeXNpY2FsIHNpbXVsYXRvclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEJ1aWx0SW5Xb3JsZCBpbXBsZW1lbnRzIElQaHlzaWNzV29ybGQge1xyXG4gICAgc2V0R3Jhdml0eSAodjogSVZlYzNMaWtlKSB7IH1cclxuICAgIHNldEFsbG93U2xlZXAgKHY6IGJvb2xlYW4pIHsgfVxyXG4gICAgc2V0RGVmYXVsdE1hdGVyaWFsICh2OiBQaHlzaWNNYXRlcmlhbCkgeyB9XHJcbiAgICBnZXQgaW1wbCAoKSB7IHJldHVybiB0aGlzOyB9XHJcbiAgICBzaGFwZUFycjogQnVpbHRpblNoYXBlW10gPSBbXTtcclxuICAgIHJlYWRvbmx5IGJvZGllczogQnVpbHRpblNoYXJlZEJvZHlbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgX3NoYXBlQXJyUHJldjogQnVpbHRpblNoYXBlW10gPSBbXTtcclxuICAgIHByaXZhdGUgX2NvbGxpc2lvbk1hdHJpeDogQXJyYXlDb2xsaXNpb25NYXRyaXggPSBuZXcgQXJyYXlDb2xsaXNpb25NYXRyaXgoKTtcclxuICAgIHByaXZhdGUgX2NvbGxpc2lvbk1hdHJpeFByZXY6IEFycmF5Q29sbGlzaW9uTWF0cml4ID0gbmV3IEFycmF5Q29sbGlzaW9uTWF0cml4KCk7XHJcblxyXG4gICAgc3RlcCAoZGVsdGFUaW1lOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAvLyBzdG9yZSBhbmQgcmVzZXQgY29sbGlzaW9uIGFycmF5XHJcbiAgICAgICAgY29uc3QgdG1wID0gdGhpcy5fc2hhcGVBcnJQcmV2O1xyXG4gICAgICAgIHRoaXMuX3NoYXBlQXJyUHJldiA9IHRoaXMuc2hhcGVBcnI7XHJcbiAgICAgICAgdGhpcy5zaGFwZUFyciA9IHRtcDtcclxuICAgICAgICB0aGlzLnNoYXBlQXJyLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIC8vIGNvbGxpc2lvbiBkZXRlY3Rpb25cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHlBID0gdGhpcy5ib2RpZXNbaV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5QiA9IHRoaXMuYm9kaWVzW2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGZpcnN0LCBDaGVjayBjb2xsaXNpb24gZmlsdGVyIG1hc2tzXHJcbiAgICAgICAgICAgICAgICBpZiAoKGJvZHlBLmNvbGxpc2lvbkZpbHRlckdyb3VwICYgYm9keUIuY29sbGlzaW9uRmlsdGVyTWFzaykgPT09IDAgfHxcclxuICAgICAgICAgICAgICAgICAgICAoYm9keUIuY29sbGlzaW9uRmlsdGVyR3JvdXAgJiBib2R5QS5jb2xsaXNpb25GaWx0ZXJNYXNrKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9keUEuaW50ZXJzZWN0cyhib2R5Qik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3luY1NjZW5lVG9QaHlzaWNzICgpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbWl0RXZlbnRzICgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVtaXRUcmlnZ2VyRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICByYXljYXN0Q2xvc2VzdCAod29ybGRSYXk6IHJheSwgb3B0aW9uczogSVJheWNhc3RPcHRpb25zLCBvdXQ6IFBoeXNpY3NSYXlSZXN1bHQpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgdG1wX2QgPSBJbmZpbml0eTtcclxuICAgICAgICBjb25zdCBtYXhfZCA9IG9wdGlvbnMubWF4RGlzdGFuY2UhO1xyXG4gICAgICAgIGNvbnN0IG1hc2sgPSBvcHRpb25zLm1hc2shO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMuYm9kaWVzW2ldIGFzIEJ1aWx0aW5TaGFyZWRCb2R5O1xyXG4gICAgICAgICAgICBpZiAoIShib2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwICYgbWFzaykpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvZHkuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZSA9IGJvZHkuc2hhcGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBpbnRlcnNlY3QucmVzb2x2ZSh3b3JsZFJheSwgc2hhcGUud29ybGRTaGFwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPT0gMCB8fCBkaXN0YW5jZSA+IG1heF9kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodG1wX2QgPiBkaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRtcF9kID0gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUoaGl0UG9pbnQsIHdvcmxkUmF5LmQpXHJcbiAgICAgICAgICAgICAgICAgICAgVmVjMy5zY2FsZUFuZEFkZChoaXRQb2ludCwgd29ybGRSYXkubywgaGl0UG9pbnQsIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBvdXQuX2Fzc2lnbihoaXRQb2ludCwgZGlzdGFuY2UsIHNoYXBlLmNvbGxpZGVyLCBWZWMzLlpFUk8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gISh0bXBfZCA9PSBJbmZpbml0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmF5Y2FzdCAod29ybGRSYXk6IHJheSwgb3B0aW9uczogSVJheWNhc3RPcHRpb25zLCBwb29sOiBSZWN5Y2xlUG9vbDxQaHlzaWNzUmF5UmVzdWx0PiwgcmVzdWx0czogUGh5c2ljc1JheVJlc3VsdFtdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgbWF4X2QgPSBvcHRpb25zLm1heERpc3RhbmNlITtcclxuICAgICAgICBjb25zdCBtYXNrID0gb3B0aW9ucy5tYXNrITtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmJvZGllc1tpXSBhcyBCdWlsdGluU2hhcmVkQm9keTtcclxuICAgICAgICAgICAgaWYgKCEoYm9keS5jb2xsaXNpb25GaWx0ZXJHcm91cCAmIG1hc2spKSBjb250aW51ZTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2R5LnNoYXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSBib2R5LnNoYXBlc1tpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gaW50ZXJzZWN0LnJlc29sdmUod29ybGRSYXksIHNoYXBlLndvcmxkU2hhcGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID09IDAgfHwgZGlzdGFuY2UgPiBtYXhfZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByID0gcG9vbC5hZGQoKTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JsZFJheS5jb21wdXRlSGl0KGhpdFBvaW50LCBkaXN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgci5fYXNzaWduKGhpdFBvaW50LCBkaXN0YW5jZSwgc2hhcGUuY29sbGlkZXIsIFZlYzMuWkVSTyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRzLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2hhcmVkQm9keSAobm9kZTogTm9kZSk6IEJ1aWx0aW5TaGFyZWRCb2R5IHtcclxuICAgICAgICByZXR1cm4gQnVpbHRpblNoYXJlZEJvZHkuZ2V0U2hhcmVkQm9keShub2RlLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTaGFyZWRCb2R5IChib2R5OiBCdWlsdGluU2hhcmVkQm9keSkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5ib2RpZXMuaW5kZXhPZihib2R5KTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzLnB1c2goYm9keSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVNoYXJlZEJvZHkgKGJvZHk6IEJ1aWx0aW5TaGFyZWRCb2R5KSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmJvZGllcy5pbmRleE9mKGJvZHkpO1xyXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNvbGxpc2lvbk1hdHJpeCAoZ3JvdXA6IG51bWJlciwgbWFzazogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBiID0gdGhpcy5ib2RpZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChiLmNvbGxpc2lvbkZpbHRlckdyb3VwID09IGdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICBiLmNvbGxpc2lvbkZpbHRlck1hc2sgPSBtYXNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZW1pdFRyaWdnZXJFdmVudCAoKSB7XHJcbiAgICAgICAgbGV0IHNoYXBlQTogQnVpbHRpblNoYXBlO1xyXG4gICAgICAgIGxldCBzaGFwZUI6IEJ1aWx0aW5TaGFwZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVBcnIubGVuZ3RoOyBpICs9IDIpIHtcclxuICAgICAgICAgICAgc2hhcGVBID0gdGhpcy5zaGFwZUFycltpXTtcclxuICAgICAgICAgICAgc2hhcGVCID0gdGhpcy5zaGFwZUFycltpICsgMV07XHJcblxyXG4gICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Quc2VsZkNvbGxpZGVyID0gc2hhcGVBLmNvbGxpZGVyO1xyXG4gICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Qub3RoZXJDb2xsaWRlciA9IHNoYXBlQi5jb2xsaWRlcjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbk1hdHJpeC5zZXQoc2hhcGVBLmlkLCBzaGFwZUIuaWQsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbGxpc2lvbk1hdHJpeFByZXYuZ2V0KHNoYXBlQS5pZCwgc2hhcGVCLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZW1pdCBzdGF5XHJcbiAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3QudHlwZSA9ICdvblRyaWdnZXJTdGF5JztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGZpcnN0IHRyaWdnZXIsIGVtaXQgZW50ZXJcclxuICAgICAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC50eXBlID0gJ29uVHJpZ2dlckVudGVyJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNoYXBlQS5jb2xsaWRlcikge1xyXG4gICAgICAgICAgICAgICAgc2hhcGVBLmNvbGxpZGVyLmVtaXQoVHJpZ2dlckV2ZW50T2JqZWN0LnR5cGUsIFRyaWdnZXJFdmVudE9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5zZWxmQ29sbGlkZXIgPSBzaGFwZUIuY29sbGlkZXI7XHJcbiAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5vdGhlckNvbGxpZGVyID0gc2hhcGVBLmNvbGxpZGVyO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNoYXBlQi5jb2xsaWRlcikge1xyXG4gICAgICAgICAgICAgICAgc2hhcGVCLmNvbGxpZGVyLmVtaXQoVHJpZ2dlckV2ZW50T2JqZWN0LnR5cGUsIFRyaWdnZXJFdmVudE9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2hhcGVBcnJQcmV2Lmxlbmd0aDsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgIHNoYXBlQSA9IHRoaXMuX3NoYXBlQXJyUHJldltpXTtcclxuICAgICAgICAgICAgc2hhcGVCID0gdGhpcy5fc2hhcGVBcnJQcmV2W2kgKyAxXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb2xsaXNpb25NYXRyaXhQcmV2LmdldChzaGFwZUEuaWQsIHNoYXBlQi5pZCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY29sbGlzaW9uTWF0cml4LmdldChzaGFwZUEuaWQsIHNoYXBlQi5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbWl0IGV4aXRcclxuICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3QudHlwZSA9ICdvblRyaWdnZXJFeGl0JztcclxuICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Quc2VsZkNvbGxpZGVyID0gc2hhcGVBLmNvbGxpZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5vdGhlckNvbGxpZGVyID0gc2hhcGVCLmNvbGxpZGVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hhcGVBLmNvbGxpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlQS5jb2xsaWRlci5lbWl0KFRyaWdnZXJFdmVudE9iamVjdC50eXBlLCBUcmlnZ2VyRXZlbnRPYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgVHJpZ2dlckV2ZW50T2JqZWN0LnNlbGZDb2xsaWRlciA9IHNoYXBlQi5jb2xsaWRlcjtcclxuICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Qub3RoZXJDb2xsaWRlciA9IHNoYXBlQS5jb2xsaWRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoYXBlQi5jb2xsaWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZUIuY29sbGlkZXIuZW1pdChUcmlnZ2VyRXZlbnRPYmplY3QudHlwZSwgVHJpZ2dlckV2ZW50T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbk1hdHJpeC5zZXQoc2hhcGVBLmlkLCBzaGFwZUIuaWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGVtcCA9IHRoaXMuX2NvbGxpc2lvbk1hdHJpeFByZXYubWF0cml4O1xyXG4gICAgICAgIHRoaXMuX2NvbGxpc2lvbk1hdHJpeFByZXYubWF0cml4ID0gdGhpcy5fY29sbGlzaW9uTWF0cml4Lm1hdHJpeDtcclxuICAgICAgICB0aGlzLl9jb2xsaXNpb25NYXRyaXgubWF0cml4ID0gdGVtcDtcclxuICAgICAgICB0aGlzLl9jb2xsaXNpb25NYXRyaXgucmVzZXQoKTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19