(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../framework/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../framework/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.builtinRigidBody = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BuiltinRigidBody = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var BuiltinRigidBody = /*#__PURE__*/function () {
    function BuiltinRigidBody() {
      _classCallCheck(this, BuiltinRigidBody);
    }

    _createClass(BuiltinRigidBody, [{
      key: "initialize",
      value: function initialize(com) {
        this._rigidBody = com;
        this._sharedBody = _index.PhysicsSystem.instance.physicsWorld.getSharedBody(this._rigidBody.node);
        this._sharedBody.reference = true;
        this._sharedBody.wrappedBody = this;
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._sharedBody.setGroup(this._rigidBody.group);

        if (_index.PhysicsSystem.instance.useCollisionMatrix) {
          this._sharedBody.setMask(_index.PhysicsSystem.instance.collisionMatrix[this._rigidBody.group]);
        }

        this._sharedBody.enabled = true;
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._sharedBody.enabled = false;
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this._sharedBody.reference = false;
        this._rigidBody = null;
        this._sharedBody = null;
      }
    }, {
      key: "setMass",
      value: function setMass(v) {}
    }, {
      key: "setLinearDamping",
      value: function setLinearDamping(v) {}
    }, {
      key: "setAngularDamping",
      value: function setAngularDamping(v) {}
    }, {
      key: "setIsKinematic",
      value: function setIsKinematic(v) {}
    }, {
      key: "useGravity",
      value: function useGravity(v) {}
    }, {
      key: "fixRotation",
      value: function fixRotation(v) {}
    }, {
      key: "setLinearFactor",
      value: function setLinearFactor(v) {}
    }, {
      key: "setAngularFactor",
      value: function setAngularFactor(v) {}
    }, {
      key: "setAllowSleep",
      value: function setAllowSleep(v) {}
    }, {
      key: "wakeUp",
      value: function wakeUp() {}
    }, {
      key: "sleep",
      value: function sleep() {}
    }, {
      key: "clearState",
      value: function clearState() {}
    }, {
      key: "clearForces",
      value: function clearForces() {}
    }, {
      key: "clearVelocity",
      value: function clearVelocity() {}
    }, {
      key: "setSleepThreshold",
      value: function setSleepThreshold(v) {}
    }, {
      key: "getSleepThreshold",
      value: function getSleepThreshold() {
        return 0;
      }
    }, {
      key: "getLinearVelocity",
      value: function getLinearVelocity(out) {}
    }, {
      key: "setLinearVelocity",
      value: function setLinearVelocity(value) {}
    }, {
      key: "getAngularVelocity",
      value: function getAngularVelocity(out) {}
    }, {
      key: "setAngularVelocity",
      value: function setAngularVelocity(value) {}
    }, {
      key: "applyForce",
      value: function applyForce(force, relativePoint) {}
    }, {
      key: "applyLocalForce",
      value: function applyLocalForce(force, relativePoint) {}
    }, {
      key: "applyImpulse",
      value: function applyImpulse(force, relativePoint) {}
    }, {
      key: "applyLocalImpulse",
      value: function applyLocalImpulse(force, relativePoint) {}
    }, {
      key: "applyTorque",
      value: function applyTorque(torque) {}
    }, {
      key: "applyLocalTorque",
      value: function applyLocalTorque(torque) {}
    }, {
      key: "setGroup",
      value: function setGroup(v) {
        this._sharedBody.setGroup(v);
      }
    }, {
      key: "getGroup",
      value: function getGroup() {
        return this._sharedBody.getGroup();
      }
    }, {
      key: "addGroup",
      value: function addGroup(v) {
        this._sharedBody.addGroup(v);
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(v) {
        this._sharedBody.removeGroup(v);
      }
    }, {
      key: "setMask",
      value: function setMask(v) {
        this._sharedBody.setMask(v);
      }
    }, {
      key: "getMask",
      value: function getMask() {
        return this._sharedBody.getMask();
      }
    }, {
      key: "addMask",
      value: function addMask(v) {
        this._sharedBody.addMask(v);
      }
    }, {
      key: "removeMask",
      value: function removeMask(v) {
        this._sharedBody.removeMask(v);
      }
    }, {
      key: "impl",
      get: function get() {
        return this;
      }
    }, {
      key: "isAwake",
      get: function get() {
        return true;
      }
    }, {
      key: "isSleepy",
      get: function get() {
        return false;
      }
    }, {
      key: "isSleeping",
      get: function get() {
        return false;
      }
    }, {
      key: "rigidBody",
      get: function get() {
        return this._rigidBody;
      }
    }, {
      key: "sharedBody",
      get: function get() {
        return this._sharedBody;
      }
    }]);

    return BuiltinRigidBody;
  }();

  _exports.BuiltinRigidBody = BuiltinRigidBody;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3MvYnVpbHRpbi1yaWdpZC1ib2R5LnRzIl0sIm5hbWVzIjpbIkJ1aWx0aW5SaWdpZEJvZHkiLCJjb20iLCJfcmlnaWRCb2R5IiwiX3NoYXJlZEJvZHkiLCJQaHlzaWNzU3lzdGVtIiwiaW5zdGFuY2UiLCJwaHlzaWNzV29ybGQiLCJnZXRTaGFyZWRCb2R5Iiwibm9kZSIsInJlZmVyZW5jZSIsIndyYXBwZWRCb2R5Iiwic2V0R3JvdXAiLCJncm91cCIsInVzZUNvbGxpc2lvbk1hdHJpeCIsInNldE1hc2siLCJjb2xsaXNpb25NYXRyaXgiLCJlbmFibGVkIiwidiIsIm91dCIsInZhbHVlIiwiZm9yY2UiLCJyZWxhdGl2ZVBvaW50IiwidG9ycXVlIiwiZ2V0R3JvdXAiLCJhZGRHcm91cCIsInJlbW92ZUdyb3VwIiwiZ2V0TWFzayIsImFkZE1hc2siLCJyZW1vdmVNYXNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU1hQSxnQjs7Ozs7OztpQ0FZR0MsRyxFQUFzQjtBQUM5QixhQUFLQyxVQUFMLEdBQWtCRCxHQUFsQjtBQUNBLGFBQUtFLFdBQUwsR0FBb0JDLHFCQUFjQyxRQUFkLENBQXVCQyxZQUF4QixDQUFzREMsYUFBdEQsQ0FBb0UsS0FBS0wsVUFBTCxDQUFnQk0sSUFBcEYsQ0FBbkI7QUFDQSxhQUFLTCxXQUFMLENBQWlCTSxTQUFqQixHQUE2QixJQUE3QjtBQUNBLGFBQUtOLFdBQUwsQ0FBaUJPLFdBQWpCLEdBQStCLElBQS9CO0FBQ0g7OztpQ0FFVztBQUNSLGFBQUtQLFdBQUwsQ0FBaUJRLFFBQWpCLENBQTBCLEtBQUtULFVBQUwsQ0FBZ0JVLEtBQTFDOztBQUNBLFlBQUlSLHFCQUFjQyxRQUFkLENBQXVCUSxrQkFBM0IsRUFBK0M7QUFDM0MsZUFBS1YsV0FBTCxDQUFpQlcsT0FBakIsQ0FBeUJWLHFCQUFjQyxRQUFkLENBQXVCVSxlQUF2QixDQUF1QyxLQUFLYixVQUFMLENBQWdCVSxLQUF2RCxDQUF6QjtBQUNIOztBQUNELGFBQUtULFdBQUwsQ0FBaUJhLE9BQWpCLEdBQTJCLElBQTNCO0FBQ0g7OztrQ0FFWTtBQUNULGFBQUtiLFdBQUwsQ0FBaUJhLE9BQWpCLEdBQTJCLEtBQTNCO0FBQ0g7OztrQ0FFWTtBQUNULGFBQUtiLFdBQUwsQ0FBaUJNLFNBQWpCLEdBQTZCLEtBQTdCO0FBQ0MsYUFBS1AsVUFBTixHQUEyQixJQUEzQjtBQUNDLGFBQUtDLFdBQU4sR0FBNEIsSUFBNUI7QUFDSDs7OzhCQUVRYyxDLEVBQVcsQ0FBRzs7O3VDQUNMQSxDLEVBQVcsQ0FBRzs7O3dDQUNiQSxDLEVBQVcsQ0FBRzs7O3FDQUNqQkEsQyxFQUFZLENBQUc7OztpQ0FDbkJBLEMsRUFBWSxDQUFHOzs7a0NBQ2RBLEMsRUFBWSxDQUFHOzs7c0NBQ1hBLEMsRUFBYyxDQUFHOzs7dUNBQ2hCQSxDLEVBQWMsQ0FBRzs7O29DQUNwQkEsQyxFQUFZLENBQUc7OzsrQkFDZCxDQUFHOzs7OEJBQ0osQ0FBRzs7O21DQUNFLENBQUc7OztvQ0FDRixDQUFHOzs7c0NBQ0QsQ0FBRzs7O3dDQUNQQSxDLEVBQWlCLENBQUc7OzswQ0FDVjtBQUFFLGVBQU8sQ0FBUDtBQUFVOzs7d0NBQ3RCQyxHLEVBQXNCLENBQUc7Ozt3Q0FDekJDLEssRUFBd0IsQ0FBRzs7O3lDQUMxQkQsRyxFQUFzQixDQUFHOzs7eUNBQ3pCQyxLLEVBQXdCLENBQUc7OztpQ0FDbkNDLEssRUFBa0JDLGEsRUFBaUMsQ0FBRzs7O3NDQUNqREQsSyxFQUFrQkMsYSxFQUFpQyxDQUFHOzs7bUNBQ3pERCxLLEVBQWtCQyxhLEVBQWlDLENBQUc7Ozt3Q0FDakRELEssRUFBa0JDLGEsRUFBaUMsQ0FBRzs7O2tDQUM1REMsTSxFQUF5QixDQUFHOzs7dUNBQ3ZCQSxNLEVBQXlCLENBQUc7OzsrQkFFcENMLEMsRUFBaUI7QUFDdkIsYUFBS2QsV0FBTCxDQUFpQlEsUUFBakIsQ0FBMEJNLENBQTFCO0FBQ0g7OztpQ0FDbUI7QUFDaEIsZUFBTyxLQUFLZCxXQUFMLENBQWlCb0IsUUFBakIsRUFBUDtBQUNIOzs7K0JBQ1NOLEMsRUFBaUI7QUFDdkIsYUFBS2QsV0FBTCxDQUFpQnFCLFFBQWpCLENBQTBCUCxDQUExQjtBQUNIOzs7a0NBQ1lBLEMsRUFBaUI7QUFDMUIsYUFBS2QsV0FBTCxDQUFpQnNCLFdBQWpCLENBQTZCUixDQUE3QjtBQUNIOzs7OEJBQ1FBLEMsRUFBaUI7QUFDdEIsYUFBS2QsV0FBTCxDQUFpQlcsT0FBakIsQ0FBeUJHLENBQXpCO0FBQ0g7OztnQ0FDa0I7QUFDZixlQUFPLEtBQUtkLFdBQUwsQ0FBaUJ1QixPQUFqQixFQUFQO0FBQ0g7Ozs4QkFDUVQsQyxFQUFpQjtBQUN0QixhQUFLZCxXQUFMLENBQWlCd0IsT0FBakIsQ0FBeUJWLENBQXpCO0FBQ0g7OztpQ0FDV0EsQyxFQUFpQjtBQUN6QixhQUFLZCxXQUFMLENBQWlCeUIsVUFBakIsQ0FBNEJYLENBQTVCO0FBQ0g7OzswQkF0Rlc7QUFBRSxlQUFPLElBQVA7QUFBYzs7OzBCQUNiO0FBQUUsZUFBTyxJQUFQO0FBQWM7OzswQkFDZjtBQUFFLGVBQU8sS0FBUDtBQUFlOzs7MEJBQ2Y7QUFBRSxlQUFPLEtBQVA7QUFBZTs7OzBCQUVsQjtBQUFFLGVBQU8sS0FBS2YsVUFBWjtBQUF5Qjs7OzBCQUMxQjtBQUFFLGVBQU8sS0FBS0MsV0FBWjtBQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSaWdpZEJvZHkgfSBmcm9tIFwiLi4vc3BlYy9pLXJpZ2lkLWJvZHlcIjtcclxuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSBcIi4uLy4uL2NvcmVcIjtcclxuaW1wb3J0IHsgUmlnaWRCb2R5LCBQaHlzaWNzU3lzdGVtIH0gZnJvbSBcIi4uL2ZyYW1ld29ya1wiO1xyXG5pbXBvcnQgeyBCdWlsdGluU2hhcmVkQm9keSB9IGZyb20gXCIuL2J1aWx0aW4tc2hhcmVkLWJvZHlcIjtcclxuaW1wb3J0IHsgQnVpbHRJbldvcmxkIH0gZnJvbSBcIi4vYnVpbHRpbi13b3JsZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1aWx0aW5SaWdpZEJvZHkgaW1wbGVtZW50cyBJUmlnaWRCb2R5IHtcclxuICAgIGdldCBpbXBsICgpIHsgcmV0dXJuIHRoaXM7IH1cclxuICAgIGdldCBpc0F3YWtlICgpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIGdldCBpc1NsZWVweSAoKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgZ2V0IGlzU2xlZXBpbmcgKCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcbiAgICBnZXQgcmlnaWRCb2R5ICgpIHsgcmV0dXJuIHRoaXMuX3JpZ2lkQm9keTsgfVxyXG4gICAgZ2V0IHNoYXJlZEJvZHkgKCkgeyByZXR1cm4gdGhpcy5fc2hhcmVkQm9keTsgfVxyXG5cclxuICAgIHByaXZhdGUgX3JpZ2lkQm9keSE6IFJpZ2lkQm9keTtcclxuICAgIHByb3RlY3RlZCBfc2hhcmVkQm9keSE6IEJ1aWx0aW5TaGFyZWRCb2R5O1xyXG5cclxuICAgIGluaXRpYWxpemUgKGNvbTogUmlnaWRCb2R5KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmlnaWRCb2R5ID0gY29tO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkgPSAoUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS5waHlzaWNzV29ybGQgYXMgQnVpbHRJbldvcmxkKS5nZXRTaGFyZWRCb2R5KHRoaXMuX3JpZ2lkQm9keS5ub2RlKTtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS53cmFwcGVkQm9keSA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgb25FbmFibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuc2V0R3JvdXAodGhpcy5fcmlnaWRCb2R5Lmdyb3VwKTtcclxuICAgICAgICBpZiAoUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS51c2VDb2xsaXNpb25NYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5zZXRNYXNrKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UuY29sbGlzaW9uTWF0cml4W3RoaXMuX3JpZ2lkQm9keS5ncm91cF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5lbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IGZhbHNlO1xyXG4gICAgICAgICh0aGlzLl9yaWdpZEJvZHkgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMuX3NoYXJlZEJvZHkgYXMgYW55KSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TWFzcyAodjogbnVtYmVyKSB7IH1cclxuICAgIHNldExpbmVhckRhbXBpbmcgKHY6IG51bWJlcikgeyB9XHJcbiAgICBzZXRBbmd1bGFyRGFtcGluZyAodjogbnVtYmVyKSB7IH1cclxuICAgIHNldElzS2luZW1hdGljICh2OiBib29sZWFuKSB7IH1cclxuICAgIHVzZUdyYXZpdHkgKHY6IGJvb2xlYW4pIHsgfVxyXG4gICAgZml4Um90YXRpb24gKHY6IGJvb2xlYW4pIHsgfVxyXG4gICAgc2V0TGluZWFyRmFjdG9yICh2OiBJVmVjM0xpa2UpIHsgfVxyXG4gICAgc2V0QW5ndWxhckZhY3RvciAodjogSVZlYzNMaWtlKSB7IH1cclxuICAgIHNldEFsbG93U2xlZXAgKHY6IGJvb2xlYW4pIHsgfVxyXG4gICAgd2FrZVVwICgpOiB2b2lkIHsgfVxyXG4gICAgc2xlZXAgKCk6IHZvaWQgeyB9XHJcbiAgICBjbGVhclN0YXRlICgpOiB2b2lkIHsgfVxyXG4gICAgY2xlYXJGb3JjZXMgKCk6IHZvaWQgeyB9XHJcbiAgICBjbGVhclZlbG9jaXR5ICgpOiB2b2lkIHsgfVxyXG4gICAgc2V0U2xlZXBUaHJlc2hvbGQgKHY6IG51bWJlcik6IHZvaWQgeyB9XHJcbiAgICBnZXRTbGVlcFRocmVzaG9sZCAoKTogbnVtYmVyIHsgcmV0dXJuIDAgfVxyXG4gICAgZ2V0TGluZWFyVmVsb2NpdHkgKG91dDogSVZlYzNMaWtlKTogdm9pZCB7IH1cclxuICAgIHNldExpbmVhclZlbG9jaXR5ICh2YWx1ZTogSVZlYzNMaWtlKTogdm9pZCB7IH1cclxuICAgIGdldEFuZ3VsYXJWZWxvY2l0eSAob3V0OiBJVmVjM0xpa2UpOiB2b2lkIHsgfVxyXG4gICAgc2V0QW5ndWxhclZlbG9jaXR5ICh2YWx1ZTogSVZlYzNMaWtlKTogdm9pZCB7IH1cclxuICAgIGFwcGx5Rm9yY2UgKGZvcmNlOiBJVmVjM0xpa2UsIHJlbGF0aXZlUG9pbnQ/OiBJVmVjM0xpa2UpOiB2b2lkIHsgfVxyXG4gICAgYXBwbHlMb2NhbEZvcmNlIChmb3JjZTogSVZlYzNMaWtlLCByZWxhdGl2ZVBvaW50PzogSVZlYzNMaWtlKTogdm9pZCB7IH1cclxuICAgIGFwcGx5SW1wdWxzZSAoZm9yY2U6IElWZWMzTGlrZSwgcmVsYXRpdmVQb2ludD86IElWZWMzTGlrZSk6IHZvaWQgeyB9XHJcbiAgICBhcHBseUxvY2FsSW1wdWxzZSAoZm9yY2U6IElWZWMzTGlrZSwgcmVsYXRpdmVQb2ludD86IElWZWMzTGlrZSk6IHZvaWQgeyB9XHJcbiAgICBhcHBseVRvcnF1ZSAodG9ycXVlOiBJVmVjM0xpa2UpOiB2b2lkIHsgfVxyXG4gICAgYXBwbHlMb2NhbFRvcnF1ZSAodG9ycXVlOiBJVmVjM0xpa2UpOiB2b2lkIHsgfVxyXG5cclxuICAgIHNldEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnNldEdyb3VwKHYpO1xyXG4gICAgfVxyXG4gICAgZ2V0R3JvdXAgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuZ2V0R3JvdXAoKTtcclxuICAgIH1cclxuICAgIGFkZEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmFkZEdyb3VwKHYpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlR3JvdXAgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVtb3ZlR3JvdXAodik7XHJcbiAgICB9XHJcbiAgICBzZXRNYXNrICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnNldE1hc2sodik7XHJcbiAgICB9XHJcbiAgICBnZXRNYXNrICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFyZWRCb2R5LmdldE1hc2soKTtcclxuICAgIH1cclxuICAgIGFkZE1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuYWRkTWFzayh2KTtcclxuICAgIH1cclxuICAgIHJlbW92ZU1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVtb3ZlTWFzayh2KTtcclxuICAgIH1cclxufVxyXG4iXX0=