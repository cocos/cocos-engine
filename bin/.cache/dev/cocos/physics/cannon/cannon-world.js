(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "../../core/math/index.js", "./cannon-util.js", "./shapes/cannon-shape.js", "./cannon-shared-body.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("../../core/math/index.js"), require("./cannon-util.js"), require("./shapes/cannon-shape.js"), require("./cannon-shared-body.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.index, global.cannonUtil, global.cannonShape, global.cannonSharedBody);
    global.cannonWorld = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _index, _cannonUtil, _cannonShape, _cannonSharedBody) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonWorld = void 0;
  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var CannonWorld = /*#__PURE__*/function () {
    _createClass(CannonWorld, [{
      key: "setDefaultMaterial",
      value: function setDefaultMaterial(mat) {
        this._world.defaultMaterial.friction = mat.friction;
        this._world.defaultMaterial.restitution = mat.restitution;

        if (_cannonShape.CannonShape.idToMaterial[mat._uuid] != null) {
          _cannonShape.CannonShape.idToMaterial[mat._uuid] = this._world.defaultMaterial;
        }
      }
    }, {
      key: "setAllowSleep",
      value: function setAllowSleep(v) {
        this._world.allowSleep = v;
      }
    }, {
      key: "setGravity",
      value: function setGravity(gravity) {
        _index.Vec3.copy(this._world.gravity, gravity);
      } // get defaultContactMaterial () {
      //     return this._defaultContactMaterial;
      // }

    }, {
      key: "impl",
      get: function get() {
        return this._world;
      }
    }]);

    function CannonWorld() {
      _classCallCheck(this, CannonWorld);

      this.bodies = [];
      this.constraints = [];
      this._world = void 0;
      this._raycastResult = new _cannon.default.RaycastResult();
      this._world = new _cannon.default.World();
      this._world.broadphase = new _cannon.default.NaiveBroadphase();
      this._world.solver.iterations = 10;
      this._world.solver.tolerance = 0.0001;
      this._world.defaultContactMaterial.contactEquationStiffness = 1000000;
      this._world.defaultContactMaterial.frictionEquationStiffness = 1000000;
      this._world.defaultContactMaterial.contactEquationRelaxation = 3;
      this._world.defaultContactMaterial.frictionEquationRelaxation = 3;
    }

    _createClass(CannonWorld, [{
      key: "emitEvents",
      value: function emitEvents() {
        this._world.emitTriggeredEvents();

        this._world.emitCollisionEvents();
      }
    }, {
      key: "syncSceneToPhysics",
      value: function syncSceneToPhysics() {
        for (var i = 0; i < this.bodies.length; i++) {
          this.bodies[i].syncSceneToPhysics();
        }
      }
    }, {
      key: "step",
      value: function step(deltaTime, timeSinceLastCalled, maxSubStep) {
        if (this.bodies.length == 0) return;

        this._world.step(deltaTime, timeSinceLastCalled, maxSubStep); // sync physics to scene


        for (var i = 0; i < this.bodies.length; i++) {
          this.bodies[i].syncPhysicsToScene();
        }
      }
    }, {
      key: "raycastClosest",
      value: function raycastClosest(worldRay, options, result) {
        setupFromAndTo(worldRay, options.maxDistance);
        (0, _cannonUtil.toCannonRaycastOptions)(raycastOpt, options);

        var hit = this._world.raycastClosest(from, to, raycastOpt, this._raycastResult);

        if (hit) {
          (0, _cannonUtil.fillRaycastResult)(result, this._raycastResult);
        }

        return hit;
      }
    }, {
      key: "raycast",
      value: function raycast(worldRay, options, pool, results) {
        setupFromAndTo(worldRay, options.maxDistance);
        (0, _cannonUtil.toCannonRaycastOptions)(raycastOpt, options);

        var hit = this._world.raycastAll(from, to, raycastOpt, function (result) {
          var r = pool.add();
          (0, _cannonUtil.fillRaycastResult)(r, result);
          results.push(r);
        });

        return hit;
      }
    }, {
      key: "getSharedBody",
      value: function getSharedBody(node) {
        return _cannonSharedBody.CannonSharedBody.getSharedBody(node, this);
      }
    }, {
      key: "addSharedBody",
      value: function addSharedBody(sharedBody) {
        var i = this.bodies.indexOf(sharedBody);

        if (i < 0) {
          this.bodies.push(sharedBody);

          this._world.addBody(sharedBody.body);
        }
      }
    }, {
      key: "removeSharedBody",
      value: function removeSharedBody(sharedBody) {
        var i = this.bodies.indexOf(sharedBody);

        if (i >= 0) {
          this.bodies.splice(i, 1);

          this._world.remove(sharedBody.body);
        }
      } //  addContactMaterial (contactMaterial: ContactMaterial) {
      //     this._cannonWorld.addContactMaterial(contactMaterial._getImpl());
      // }

    }, {
      key: "addConstraint",
      value: function addConstraint(constraint) {
        var i = this.constraints.indexOf(constraint);

        if (i < 0) {
          this.constraints.push(constraint);

          this._world.addConstraint(constraint.impl);
        }
      }
    }, {
      key: "removeConstraint",
      value: function removeConstraint(constraint) {
        var i = this.constraints.indexOf(constraint);

        if (i >= 0) {
          this.constraints.splice(i, 1);

          this._world.removeConstraint(constraint.impl);
        }
      }
    }, {
      key: "updateCollisionMatrix",
      value: function updateCollisionMatrix(group, mask) {
        for (var i = 0; i < this.bodies.length; i++) {
          var b = this.bodies[i].body;

          if (b.collisionFilterGroup == group) {
            b.collisionFilterMask = mask;
          }
        }
      }
    }]);

    return CannonWorld;
  }();

  _exports.CannonWorld = CannonWorld;
  var from = new _cannon.default.Vec3();
  var to = new _cannon.default.Vec3();

  function setupFromAndTo(worldRay, distance) {
    _index.Vec3.copy(from, worldRay.o);

    worldRay.computeHit(to, distance);
  }

  var raycastOpt = {
    'checkCollisionResponse': false,
    'collisionFilterGroup': -1,
    'collisionFilterMask': -1,
    'skipBackFaces': true
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL2Nhbm5vbi13b3JsZC50cyJdLCJuYW1lcyI6WyJDYW5ub25Xb3JsZCIsIm1hdCIsIl93b3JsZCIsImRlZmF1bHRNYXRlcmlhbCIsImZyaWN0aW9uIiwicmVzdGl0dXRpb24iLCJDYW5ub25TaGFwZSIsImlkVG9NYXRlcmlhbCIsIl91dWlkIiwidiIsImFsbG93U2xlZXAiLCJncmF2aXR5IiwiVmVjMyIsImNvcHkiLCJib2RpZXMiLCJjb25zdHJhaW50cyIsIl9yYXljYXN0UmVzdWx0IiwiQ0FOTk9OIiwiUmF5Y2FzdFJlc3VsdCIsIldvcmxkIiwiYnJvYWRwaGFzZSIsIk5haXZlQnJvYWRwaGFzZSIsInNvbHZlciIsIml0ZXJhdGlvbnMiLCJ0b2xlcmFuY2UiLCJkZWZhdWx0Q29udGFjdE1hdGVyaWFsIiwiY29udGFjdEVxdWF0aW9uU3RpZmZuZXNzIiwiZnJpY3Rpb25FcXVhdGlvblN0aWZmbmVzcyIsImNvbnRhY3RFcXVhdGlvblJlbGF4YXRpb24iLCJmcmljdGlvbkVxdWF0aW9uUmVsYXhhdGlvbiIsImVtaXRUcmlnZ2VyZWRFdmVudHMiLCJlbWl0Q29sbGlzaW9uRXZlbnRzIiwiaSIsImxlbmd0aCIsInN5bmNTY2VuZVRvUGh5c2ljcyIsImRlbHRhVGltZSIsInRpbWVTaW5jZUxhc3RDYWxsZWQiLCJtYXhTdWJTdGVwIiwic3RlcCIsInN5bmNQaHlzaWNzVG9TY2VuZSIsIndvcmxkUmF5Iiwib3B0aW9ucyIsInJlc3VsdCIsInNldHVwRnJvbUFuZFRvIiwibWF4RGlzdGFuY2UiLCJyYXljYXN0T3B0IiwiaGl0IiwicmF5Y2FzdENsb3Nlc3QiLCJmcm9tIiwidG8iLCJwb29sIiwicmVzdWx0cyIsInJheWNhc3RBbGwiLCJyIiwiYWRkIiwicHVzaCIsIm5vZGUiLCJDYW5ub25TaGFyZWRCb2R5IiwiZ2V0U2hhcmVkQm9keSIsInNoYXJlZEJvZHkiLCJpbmRleE9mIiwiYWRkQm9keSIsImJvZHkiLCJzcGxpY2UiLCJyZW1vdmUiLCJjb25zdHJhaW50IiwiYWRkQ29uc3RyYWludCIsImltcGwiLCJyZW1vdmVDb25zdHJhaW50IiwiZ3JvdXAiLCJtYXNrIiwiYiIsImNvbGxpc2lvbkZpbHRlckdyb3VwIiwiY29sbGlzaW9uRmlsdGVyTWFzayIsImRpc3RhbmNlIiwibyIsImNvbXB1dGVIaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BV2FBLFc7Ozt5Q0FNV0MsRyxFQUFxQjtBQUNyQyxhQUFLQyxNQUFMLENBQVlDLGVBQVosQ0FBNEJDLFFBQTVCLEdBQXVDSCxHQUFHLENBQUNHLFFBQTNDO0FBQ0EsYUFBS0YsTUFBTCxDQUFZQyxlQUFaLENBQTRCRSxXQUE1QixHQUEwQ0osR0FBRyxDQUFDSSxXQUE5Qzs7QUFDQSxZQUFJQyx5QkFBWUMsWUFBWixDQUF5Qk4sR0FBRyxDQUFDTyxLQUE3QixLQUF1QyxJQUEzQyxFQUFpRDtBQUM3Q0YsbUNBQVlDLFlBQVosQ0FBeUJOLEdBQUcsQ0FBQ08sS0FBN0IsSUFBc0MsS0FBS04sTUFBTCxDQUFZQyxlQUFsRDtBQUNIO0FBQ0o7OztvQ0FFY00sQyxFQUFZO0FBQ3ZCLGFBQUtQLE1BQUwsQ0FBWVEsVUFBWixHQUF5QkQsQ0FBekI7QUFDSDs7O2lDQUVXRSxPLEVBQW9CO0FBQzVCQyxvQkFBS0MsSUFBTCxDQUFVLEtBQUtYLE1BQUwsQ0FBWVMsT0FBdEIsRUFBK0JBLE9BQS9CO0FBQ0gsTyxDQUVEO0FBQ0E7QUFDQTs7OzswQkF0Qlk7QUFDUixlQUFPLEtBQUtULE1BQVo7QUFDSDs7O0FBNEJELDJCQUFlO0FBQUE7O0FBQUEsV0FOTlksTUFNTSxHQU51QixFQU12QjtBQUFBLFdBTE5DLFdBS00sR0FMNEIsRUFLNUI7QUFBQSxXQUhQYixNQUdPO0FBQUEsV0FGUGMsY0FFTyxHQUZVLElBQUlDLGdCQUFPQyxhQUFYLEVBRVY7QUFDWCxXQUFLaEIsTUFBTCxHQUFjLElBQUllLGdCQUFPRSxLQUFYLEVB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RUFBZUMsSSxFQUFjO0FBQ2hELGFBQUssSUFBSXRDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS2xCLE1BQUwsQ0FBWW1CLE1BQWhDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0FBQ3pDLGNBQU11QyxDQUFDLEdBQUcsS0FBS3pELE1BQUwsQ0FBWWtCLENBQVosRUFBZThCLElBQXpCOztBQUNBLGNBQUlTLENBQUMsQ0FBQ0Msb0JBQUYsSUFBMEJILEtBQTlCLEVBQXFDO0FBQ2pDRSxZQUFBQSxDQUFDLENBQUNFLG1CQUFGLEdBQXdCSCxJQUF4QjtBQUNIO0FBQ0o7QUFDSjs7Ozs7OztBQUdMLE1BQU10QixJQUFJLEdBQUcsSUFBSS9CLGdCQUFPTCxJQUFYLEVBQWI7QUFDQSxNQUFNcUMsRUFBRSxHQUFHLElBQUloQyxnQkFBT0wsSUFBWCxFQUFYOztBQUNBLFdBQVMrQixjQUFULENBQXlCSCxRQUF6QixFQUF3Q2tDLFFBQXhDLEVBQTBEO0FBQ3REOUQsZ0JBQUtDLElBQUwsQ0FBVW1DLElBQVYsRUFBZ0JSLFFBQVEsQ0FBQ21DLENBQXpCOztBQUNBbkMsSUFBQUEsUUFBUSxDQUFDb0MsVUFBVCxDQUFvQjNCLEVBQXBCLEVBQXdCeUIsUUFBeEI7QUFDSDs7QUFFRCxNQUFNN0IsVUFBa0MsR0FBRztBQUN2Qyw4QkFBMEIsS0FEYTtBQUV2Qyw0QkFBd0IsQ0FBQyxDQUZjO0FBR3ZDLDJCQUF1QixDQUFDLENBSGU7QUFJdkMscUJBQWlCO0FBSnNCLEdBQTNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENBTk5PTiBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaW1wb3J0IHsgVmVjMywgUXVhdCB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGZpbGxSYXljYXN0UmVzdWx0LCB0b0Nhbm5vblJheWNhc3RPcHRpb25zIH0gZnJvbSAnLi9jYW5ub24tdXRpbCc7XHJcbmltcG9ydCB7IENhbm5vbkNvbnN0cmFpbnQgfSBmcm9tICcuL2NvbnN0cmFpbnRzL2Nhbm5vbi1jb25zdHJhaW50JztcclxuaW1wb3J0IHsgQ2Fubm9uU2hhcGUgfSBmcm9tICcuL3NoYXBlcy9jYW5ub24tc2hhcGUnO1xyXG5pbXBvcnQgeyByYXkgfSBmcm9tICcuLi8uLi9jb3JlL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgUmVjeWNsZVBvb2wsIE5vZGUgfSBmcm9tICcuLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgQ2Fubm9uU2hhcmVkQm9keSB9IGZyb20gJy4vY2Fubm9uLXNoYXJlZC1ib2R5JztcclxuaW1wb3J0IHsgSVBoeXNpY3NXb3JsZCwgSVJheWNhc3RPcHRpb25zIH0gZnJvbSAnLi4vc3BlYy9pLXBoeXNpY3Mtd29ybGQnO1xyXG5pbXBvcnQgeyBQaHlzaWNNYXRlcmlhbCwgUGh5c2ljc1JheVJlc3VsdCB9IGZyb20gJy4uL2ZyYW1ld29yayc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcbmV4cG9ydCBjbGFzcyBDYW5ub25Xb3JsZCBpbXBsZW1lbnRzIElQaHlzaWNzV29ybGQge1xyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGVmYXVsdE1hdGVyaWFsIChtYXQ6IFBoeXNpY01hdGVyaWFsKSB7XHJcbiAgICAgICAgdGhpcy5fd29ybGQuZGVmYXVsdE1hdGVyaWFsLmZyaWN0aW9uID0gbWF0LmZyaWN0aW9uO1xyXG4gICAgICAgIHRoaXMuX3dvcmxkLmRlZmF1bHRNYXRlcmlhbC5yZXN0aXR1dGlvbiA9IG1hdC5yZXN0aXR1dGlvbjtcclxuICAgICAgICBpZiAoQ2Fubm9uU2hhcGUuaWRUb01hdGVyaWFsW21hdC5fdXVpZF0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBDYW5ub25TaGFwZS5pZFRvTWF0ZXJpYWxbbWF0Ll91dWlkXSA9IHRoaXMuX3dvcmxkLmRlZmF1bHRNYXRlcmlhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWxsb3dTbGVlcCAodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3dvcmxkLmFsbG93U2xlZXAgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHNldEdyYXZpdHkgKGdyYXZpdHk6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl93b3JsZC5ncmF2aXR5LCBncmF2aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBnZXQgZGVmYXVsdENvbnRhY3RNYXRlcmlhbCAoKSB7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRDb250YWN0TWF0ZXJpYWw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcmVhZG9ubHkgYm9kaWVzOiBDYW5ub25TaGFyZWRCb2R5W10gPSBbXTtcclxuICAgIHJlYWRvbmx5IGNvbnN0cmFpbnRzOiBDYW5ub25Db25zdHJhaW50W10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIF93b3JsZDogQ0FOTk9OLldvcmxkO1xyXG4gICAgcHJpdmF0ZSBfcmF5Y2FzdFJlc3VsdCA9IG5ldyBDQU5OT04uUmF5Y2FzdFJlc3VsdCgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl93b3JsZCA9IG5ldyBDQU5OT04uV29ybGQoKTtcclxuICAgICAgICB0aGlzLl93b3JsZC5icm9hZHBoYXNlID0gbmV3IENBTk5PTi5OYWl2ZUJyb2FkcGhhc2UoKTtcclxuICAgICAgICB0aGlzLl93b3JsZC5zb2x2ZXIuaXRlcmF0aW9ucyA9IDEwO1xyXG4gICAgICAgICh0aGlzLl93b3JsZC5zb2x2ZXIgYXMgYW55KS50b2xlcmFuY2UgPSAwLjAwMDE7XHJcbiAgICAgICAgdGhpcy5fd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5jb250YWN0RXF1YXRpb25TdGlmZm5lc3MgPSAxMDAwMDAwO1xyXG4gICAgICAgIHRoaXMuX3dvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb25FcXVhdGlvblN0aWZmbmVzcyA9IDEwMDAwMDA7XHJcbiAgICAgICAgdGhpcy5fd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5jb250YWN0RXF1YXRpb25SZWxheGF0aW9uID0gMztcclxuICAgICAgICB0aGlzLl93b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLmZyaWN0aW9uRXF1YXRpb25SZWxheGF0aW9uID0gMztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZW1pdEV2ZW50cyAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fd29ybGQuZW1pdFRyaWdnZXJlZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuX3dvcmxkLmVtaXRDb2xsaXNpb25FdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzeW5jU2NlbmVUb1BoeXNpY3MgKCk6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ib2RpZXNbaV0uc3luY1NjZW5lVG9QaHlzaWNzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAgKGRlbHRhVGltZTogbnVtYmVyLCB0aW1lU2luY2VMYXN0Q2FsbGVkPzogbnVtYmVyLCBtYXhTdWJTdGVwPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYm9kaWVzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fd29ybGQuc3RlcChkZWx0YVRpbWUsIHRpbWVTaW5jZUxhc3RDYWxsZWQsIG1heFN1YlN0ZXApO1xyXG5cclxuICAgICAgICAvLyBzeW5jIHBoeXNpY3MgdG8gc2NlbmVcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLnN5bmNQaHlzaWNzVG9TY2VuZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByYXljYXN0Q2xvc2VzdCAod29ybGRSYXk6IHJheSwgb3B0aW9uczogSVJheWNhc3RPcHRpb25zLCByZXN1bHQ6IFBoeXNpY3NSYXlSZXN1bHQpOiBib29sZWFuIHtcclxuICAgICAgICBzZXR1cEZyb21BbmRUbyh3b3JsZFJheSwgb3B0aW9ucy5tYXhEaXN0YW5jZSk7XHJcbiAgICAgICAgdG9DYW5ub25SYXljYXN0T3B0aW9ucyhyYXljYXN0T3B0LCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCBoaXQgPSB0aGlzLl93b3JsZC5yYXljYXN0Q2xvc2VzdChmcm9tLCB0bywgcmF5Y2FzdE9wdCwgdGhpcy5fcmF5Y2FzdFJlc3VsdCk7XHJcbiAgICAgICAgaWYgKGhpdCkge1xyXG4gICAgICAgICAgICBmaWxsUmF5Y2FzdFJlc3VsdChyZXN1bHQsIHRoaXMuX3JheWNhc3RSZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGl0O1xyXG4gICAgfVxyXG5cclxuICAgIHJheWNhc3QgKHdvcmxkUmF5OiByYXksIG9wdGlvbnM6IElSYXljYXN0T3B0aW9ucywgcG9vbDogUmVjeWNsZVBvb2w8UGh5c2ljc1JheVJlc3VsdD4sIHJlc3VsdHM6IFBoeXNpY3NSYXlSZXN1bHRbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHNldHVwRnJvbUFuZFRvKHdvcmxkUmF5LCBvcHRpb25zLm1heERpc3RhbmNlKTtcclxuICAgICAgICB0b0Nhbm5vblJheWNhc3RPcHRpb25zKHJheWNhc3RPcHQsIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IGhpdCA9IHRoaXMuX3dvcmxkLnJheWNhc3RBbGwoZnJvbSwgdG8sIHJheWNhc3RPcHQsIChyZXN1bHQ6IENBTk5PTi5SYXljYXN0UmVzdWx0KTogYW55ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgciA9IHBvb2wuYWRkKCk7XHJcbiAgICAgICAgICAgIGZpbGxSYXljYXN0UmVzdWx0KHIsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gaGl0XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2hhcmVkQm9keSAobm9kZTogTm9kZSk6IENhbm5vblNoYXJlZEJvZHkge1xyXG4gICAgICAgIHJldHVybiBDYW5ub25TaGFyZWRCb2R5LmdldFNoYXJlZEJvZHkobm9kZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkU2hhcmVkQm9keSAoc2hhcmVkQm9keTogQ2Fubm9uU2hhcmVkQm9keSkge1xyXG4gICAgICAgIGNvbnN0IGkgPSB0aGlzLmJvZGllcy5pbmRleE9mKHNoYXJlZEJvZHkpO1xyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmJvZGllcy5wdXNoKHNoYXJlZEJvZHkpO1xyXG4gICAgICAgICAgICB0aGlzLl93b3JsZC5hZGRCb2R5KHNoYXJlZEJvZHkuYm9keSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVNoYXJlZEJvZHkgKHNoYXJlZEJvZHk6IENhbm5vblNoYXJlZEJvZHkpIHtcclxuICAgICAgICBjb25zdCBpID0gdGhpcy5ib2RpZXMuaW5kZXhPZihzaGFyZWRCb2R5KTtcclxuICAgICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5fd29ybGQucmVtb3ZlKHNoYXJlZEJvZHkuYm9keSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICBhZGRDb250YWN0TWF0ZXJpYWwgKGNvbnRhY3RNYXRlcmlhbDogQ29udGFjdE1hdGVyaWFsKSB7XHJcbiAgICAvLyAgICAgdGhpcy5fY2Fubm9uV29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKGNvbnRhY3RNYXRlcmlhbC5fZ2V0SW1wbCgpKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBhZGRDb25zdHJhaW50IChjb25zdHJhaW50OiBDYW5ub25Db25zdHJhaW50KSB7XHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuY29uc3RyYWludHMuaW5kZXhPZihjb25zdHJhaW50KTtcclxuICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJhaW50cy5wdXNoKGNvbnN0cmFpbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl93b3JsZC5hZGRDb25zdHJhaW50KGNvbnN0cmFpbnQuaW1wbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvbnN0cmFpbnQgKGNvbnN0cmFpbnQ6IENhbm5vbkNvbnN0cmFpbnQpIHtcclxuICAgICAgICBjb25zdCBpID0gdGhpcy5jb25zdHJhaW50cy5pbmRleE9mKGNvbnN0cmFpbnQpO1xyXG4gICAgICAgIGlmIChpID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJhaW50cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmxkLnJlbW92ZUNvbnN0cmFpbnQoY29uc3RyYWludC5pbXBsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ29sbGlzaW9uTWF0cml4IChncm91cDogbnVtYmVyLCBtYXNrOiBudW1iZXIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmJvZGllc1tpXS5ib2R5O1xyXG4gICAgICAgICAgICBpZiAoYi5jb2xsaXNpb25GaWx0ZXJHcm91cCA9PSBncm91cCkge1xyXG4gICAgICAgICAgICAgICAgYi5jb2xsaXNpb25GaWx0ZXJNYXNrID0gbWFzaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZnJvbSA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG5jb25zdCB0byA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG5mdW5jdGlvbiBzZXR1cEZyb21BbmRUbyAod29ybGRSYXk6IHJheSwgZGlzdGFuY2U6IG51bWJlcikge1xyXG4gICAgVmVjMy5jb3B5KGZyb20sIHdvcmxkUmF5Lm8pO1xyXG4gICAgd29ybGRSYXkuY29tcHV0ZUhpdCh0bywgZGlzdGFuY2UpO1xyXG59XHJcblxyXG5jb25zdCByYXljYXN0T3B0OiBDQU5OT04uSVJheWNhc3RPcHRpb25zID0ge1xyXG4gICAgJ2NoZWNrQ29sbGlzaW9uUmVzcG9uc2UnOiBmYWxzZSxcclxuICAgICdjb2xsaXNpb25GaWx0ZXJHcm91cCc6IC0xLFxyXG4gICAgJ2NvbGxpc2lvbkZpbHRlck1hc2snOiAtMSxcclxuICAgICdza2lwQmFja0ZhY2VzJzogdHJ1ZVxyXG59Il19