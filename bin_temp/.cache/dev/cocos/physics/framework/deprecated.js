(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./physics-system.js", "../../core/utils/deprecated.js", "./components/colliders/box-collider.js", "./components/colliders/sphere-collider.js", "./components/colliders/capsule-collider.js", "./components/colliders/cylinder-collider.js", "./components/colliders/mesh-collider.js", "./components/rigid-body.js", "./components/colliders/collider.js", "../../core/utils/js.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./physics-system.js"), require("../../core/utils/deprecated.js"), require("./components/colliders/box-collider.js"), require("./components/colliders/sphere-collider.js"), require("./components/colliders/capsule-collider.js"), require("./components/colliders/cylinder-collider.js"), require("./components/colliders/mesh-collider.js"), require("./components/rigid-body.js"), require("./components/colliders/collider.js"), require("../../core/utils/js.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.physicsSystem, global.deprecated, global.boxCollider, global.sphereCollider, global.capsuleCollider, global.cylinderCollider, global.meshCollider, global.rigidBody, global.collider, global.js, global.globalExports);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _physicsSystem, _deprecated, _boxCollider, _sphereCollider, _capsuleCollider, _cylinderCollider, _meshCollider, _rigidBody, _collider, _js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "BoxColliderComponent", {
    enumerable: true,
    get: function () {
      return _boxCollider.BoxCollider;
    }
  });
  Object.defineProperty(_exports, "SphereColliderComponent", {
    enumerable: true,
    get: function () {
      return _sphereCollider.SphereCollider;
    }
  });
  Object.defineProperty(_exports, "CapsuleColliderComponent", {
    enumerable: true,
    get: function () {
      return _capsuleCollider.CapsuleCollider;
    }
  });
  Object.defineProperty(_exports, "CylinderColliderComponent", {
    enumerable: true,
    get: function () {
      return _cylinderCollider.CylinderCollider;
    }
  });
  Object.defineProperty(_exports, "MeshColliderComponent", {
    enumerable: true,
    get: function () {
      return _meshCollider.MeshCollider;
    }
  });
  Object.defineProperty(_exports, "RigidBodyComponent", {
    enumerable: true,
    get: function () {
      return _rigidBody.RigidBody;
    }
  });
  Object.defineProperty(_exports, "ColliderComponent", {
    enumerable: true,
    get: function () {
      return _collider.Collider;
    }
  });

  /**
   * @category physics
   */
  (0, _deprecated.replaceProperty)(_physicsSystem.PhysicsSystem, 'PhysicsSystem', [{
    "name": "ins",
    "newName": "instance"
  }]);
  (0, _deprecated.replaceProperty)(_physicsSystem.PhysicsSystem.prototype, 'PhysicsSystem.prototype', [{
    "name": "deltaTime",
    "newName": "fixedTimeStep"
  }, {
    "name": "maxSubStep",
    "newName": "maxSubSteps"
  }]);
  (0, _deprecated.removeProperty)(_physicsSystem.PhysicsSystem.prototype, 'PhysicsSystem.prototype', [{
    "name": "useFixedTime"
  }]);
  (0, _deprecated.replaceProperty)(_collider.Collider.prototype, 'Collider.prototype', [{
    "name": "attachedRigidbody",
    "newName": "attachedRigidBody"
  }]);
  (0, _deprecated.replaceProperty)(_boxCollider.BoxCollider.prototype, 'BoxCollider.prototype', [{
    "name": "boxShape",
    "newName": "shape"
  }]);
  (0, _deprecated.replaceProperty)(_sphereCollider.SphereCollider.prototype, 'SphereCollider.prototype', [{
    "name": "sphereShape",
    "newName": "shape"
  }]);
  (0, _deprecated.replaceProperty)(_capsuleCollider.CapsuleCollider.prototype, 'CapsuleCollider.prototype', [{
    "name": "capsuleShape",
    "newName": "shape"
  }]);
  (0, _deprecated.replaceProperty)(_rigidBody.RigidBody.prototype, 'RigidBody.prototype', [{
    "name": "rigidBody",
    "newName": "body"
  }]);
  /**
   * Alias of [[RigidBody]]
   * @deprecated Since v1.2
   */

  _globalExports.legacyCC.RigidBodyComponent = _rigidBody.RigidBody;

  _js.js.setClassAlias(_rigidBody.RigidBody, 'cc.RigidBodyComponent');
  /**
   * Alias of [[Collider]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.ColliderComponent = _collider.Collider;

  _js.js.setClassAlias(_collider.Collider, 'cc.ColliderComponent');
  /**
   * Alias of [[BoxCollider]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.BoxColliderComponent = _boxCollider.BoxCollider;

  _js.js.setClassAlias(_boxCollider.BoxCollider, 'cc.BoxColliderComponent');
  /**
   * Alias of [[SphereCollider]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SphereColliderComponent = _sphereCollider.SphereCollider;

  _js.js.setClassAlias(_sphereCollider.SphereCollider, 'cc.SphereColliderComponent');
  /**
   * Alias of [[CapsuleCollider]]
   * @deprecated Since v1.2
   */


  _js.js.setClassAlias(_capsuleCollider.CapsuleCollider, 'cc.CapsuleColliderComponent');
  /**
   * Alias of [[MeshCollider]]
   * @deprecated Since v1.2
   */


  _js.js.setClassAlias(_meshCollider.MeshCollider, 'cc.MeshColliderComponent');
  /**
   * Alias of [[CylinderCollider]]
   * @deprecated Since v1.2
   */


  _js.js.setClassAlias(_cylinderCollider.CylinderCollider, 'cc.CylinderColliderComponent');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2RlcHJlY2F0ZWQudHMiXSwibmFtZXMiOlsiUGh5c2ljc1N5c3RlbSIsInByb3RvdHlwZSIsIkNvbGxpZGVyIiwiQm94Q29sbGlkZXIiLCJTcGhlcmVDb2xsaWRlciIsIkNhcHN1bGVDb2xsaWRlciIsIlJpZ2lkQm9keSIsImxlZ2FjeUNDIiwiUmlnaWRCb2R5Q29tcG9uZW50IiwianMiLCJzZXRDbGFzc0FsaWFzIiwiQ29sbGlkZXJDb21wb25lbnQiLCJCb3hDb2xsaWRlckNvbXBvbmVudCIsIlNwaGVyZUNvbGxpZGVyQ29tcG9uZW50IiwiTWVzaENvbGxpZGVyIiwiQ3lsaW5kZXJDb2xsaWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFnQkEsbUNBQWdCQSw0QkFBaEIsRUFBK0IsZUFBL0IsRUFBZ0QsQ0FDNUM7QUFDSSxZQUFRLEtBRFo7QUFFSSxlQUFXO0FBRmYsR0FENEMsQ0FBaEQ7QUFPQSxtQ0FBZ0JBLDZCQUFjQyxTQUE5QixFQUF5Qyx5QkFBekMsRUFBb0UsQ0FDaEU7QUFDSSxZQUFRLFdBRFo7QUFFSSxlQUFXO0FBRmYsR0FEZ0UsRUFLaEU7QUFDSSxZQUFRLFlBRFo7QUFFSSxlQUFXO0FBRmYsR0FMZ0UsQ0FBcEU7QUFXQSxrQ0FBZUQsNkJBQWNDLFNBQTdCLEVBQXdDLHlCQUF4QyxFQUFtRSxDQUMvRDtBQUNJLFlBQVE7QUFEWixHQUQrRCxDQUFuRTtBQU1BLG1DQUFnQkMsbUJBQVNELFNBQXpCLEVBQW9DLG9CQUFwQyxFQUEwRCxDQUN0RDtBQUNJLFlBQVEsbUJBRFo7QUFFSSxlQUFXO0FBRmYsR0FEc0QsQ0FBMUQ7QUFPQSxtQ0FBZ0JFLHlCQUFZRixTQUE1QixFQUF1Qyx1QkFBdkMsRUFBZ0UsQ0FDNUQ7QUFDSSxZQUFRLFVBRFo7QUFFSSxlQUFXO0FBRmYsR0FENEQsQ0FBaEU7QUFPQSxtQ0FBZ0JHLCtCQUFlSCxTQUEvQixFQUEwQywwQkFBMUMsRUFBc0UsQ0FDbEU7QUFDSSxZQUFRLGFBRFo7QUFFSSxlQUFXO0FBRmYsR0FEa0UsQ0FBdEU7QUFPQSxtQ0FBZ0JJLGlDQUFnQkosU0FBaEMsRUFBMkMsMkJBQTNDLEVBQXdFLENBQ3BFO0FBQ0ksWUFBUSxjQURaO0FBRUksZUFBVztBQUZmLEdBRG9FLENBQXhFO0FBT0EsbUNBQWdCSyxxQkFBVUwsU0FBMUIsRUFBcUMscUJBQXJDLEVBQTRELENBQ3hEO0FBQ0ksWUFBUSxXQURaO0FBRUksZUFBVztBQUZmLEdBRHdELENBQTVEO0FBT0E7Ozs7O0FBS0FNLDBCQUFTQyxrQkFBVCxHQUE4QkYsb0JBQTlCOztBQUNBRyxTQUFHQyxhQUFILENBQWlCSixvQkFBakIsRUFBNEIsdUJBQTVCO0FBQ0E7Ozs7OztBQUtBQywwQkFBU0ksaUJBQVQsR0FBNkJULGtCQUE3Qjs7QUFDQU8sU0FBR0MsYUFBSCxDQUFpQlIsa0JBQWpCLEVBQTJCLHNCQUEzQjtBQUNBOzs7Ozs7QUFLQUssMEJBQVNLLG9CQUFULEdBQWdDVCx3QkFBaEM7O0FBQ0FNLFNBQUdDLGFBQUgsQ0FBaUJQLHdCQUFqQixFQUE4Qix5QkFBOUI7QUFDQTs7Ozs7O0FBS0FJLDBCQUFTTSx1QkFBVCxHQUFtQ1QsOEJBQW5DOztBQUNBSyxTQUFHQyxhQUFILENBQWlCTiw4QkFBakIsRUFBaUMsNEJBQWpDO0FBQ0E7Ozs7OztBQUtBSyxTQUFHQyxhQUFILENBQWlCTCxnQ0FBakIsRUFBa0MsNkJBQWxDO0FBQ0E7Ozs7OztBQUtBSSxTQUFHQyxhQUFILENBQWlCSSwwQkFBakIsRUFBK0IsMEJBQS9CO0FBQ0E7Ozs7OztBQUtBTCxTQUFHQyxhQUFILENBQWlCSyxrQ0FBakIsRUFBbUMsOEJBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgUGh5c2ljc1N5c3RlbSB9IGZyb20gXCIuL3BoeXNpY3Mtc3lzdGVtXCI7XHJcbmltcG9ydCB7IHJlcGxhY2VQcm9wZXJ0eSwgcmVtb3ZlUHJvcGVydHkgfSBmcm9tIFwiLi4vLi4vY29yZS91dGlscy9kZXByZWNhdGVkXCI7XHJcbmltcG9ydCB7IEJveENvbGxpZGVyIH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb2xsaWRlcnMvYm94LWNvbGxpZGVyXCI7XHJcbmltcG9ydCB7IFNwaGVyZUNvbGxpZGVyIH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb2xsaWRlcnMvc3BoZXJlLWNvbGxpZGVyXCI7XHJcbmltcG9ydCB7IENhcHN1bGVDb2xsaWRlciB9IGZyb20gXCIuL2NvbXBvbmVudHMvY29sbGlkZXJzL2NhcHN1bGUtY29sbGlkZXJcIjtcclxuaW1wb3J0IHsgQ3lsaW5kZXJDb2xsaWRlciB9IGZyb20gXCIuL2NvbXBvbmVudHMvY29sbGlkZXJzL2N5bGluZGVyLWNvbGxpZGVyXCI7XHJcbmltcG9ydCB7IE1lc2hDb2xsaWRlciB9IGZyb20gXCIuL2NvbXBvbmVudHMvY29sbGlkZXJzL21lc2gtY29sbGlkZXJcIjtcclxuaW1wb3J0IHsgUmlnaWRCb2R5IH0gZnJvbSBcIi4vY29tcG9uZW50cy9yaWdpZC1ib2R5XCI7XHJcbmltcG9ydCB7IENvbGxpZGVyIH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb2xsaWRlcnMvY29sbGlkZXJcIjtcclxuaW1wb3J0IHsganMgfSBmcm9tIFwiLi4vLi4vY29yZS91dGlscy9qc1wiO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxucmVwbGFjZVByb3BlcnR5KFBoeXNpY3NTeXN0ZW0sICdQaHlzaWNzU3lzdGVtJywgW1xyXG4gICAge1xyXG4gICAgICAgIFwibmFtZVwiOiBcImluc1wiLFxyXG4gICAgICAgIFwibmV3TmFtZVwiOiBcImluc3RhbmNlXCJcclxuICAgIH1cclxuXSk7XHJcblxyXG5yZXBsYWNlUHJvcGVydHkoUGh5c2ljc1N5c3RlbS5wcm90b3R5cGUsICdQaHlzaWNzU3lzdGVtLnByb3RvdHlwZScsIFtcclxuICAgIHtcclxuICAgICAgICBcIm5hbWVcIjogXCJkZWx0YVRpbWVcIixcclxuICAgICAgICBcIm5ld05hbWVcIjogXCJmaXhlZFRpbWVTdGVwXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwibWF4U3ViU3RlcFwiLFxyXG4gICAgICAgIFwibmV3TmFtZVwiOiBcIm1heFN1YlN0ZXBzXCJcclxuICAgIH1cclxuXSk7XHJcblxyXG5yZW1vdmVQcm9wZXJ0eShQaHlzaWNzU3lzdGVtLnByb3RvdHlwZSwgJ1BoeXNpY3NTeXN0ZW0ucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIFwibmFtZVwiOiBcInVzZUZpeGVkVGltZVwiXHJcbiAgICB9XHJcbl0pO1xyXG5cclxucmVwbGFjZVByb3BlcnR5KENvbGxpZGVyLnByb3RvdHlwZSwgJ0NvbGxpZGVyLnByb3RvdHlwZScsIFtcclxuICAgIHtcclxuICAgICAgICBcIm5hbWVcIjogXCJhdHRhY2hlZFJpZ2lkYm9keVwiLFxyXG4gICAgICAgIFwibmV3TmFtZVwiOiBcImF0dGFjaGVkUmlnaWRCb2R5XCJcclxuICAgIH1cclxuXSk7XHJcblxyXG5yZXBsYWNlUHJvcGVydHkoQm94Q29sbGlkZXIucHJvdG90eXBlLCAnQm94Q29sbGlkZXIucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIFwibmFtZVwiOiBcImJveFNoYXBlXCIsXHJcbiAgICAgICAgXCJuZXdOYW1lXCI6IFwic2hhcGVcIlxyXG4gICAgfVxyXG5dKTtcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShTcGhlcmVDb2xsaWRlci5wcm90b3R5cGUsICdTcGhlcmVDb2xsaWRlci5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwic3BoZXJlU2hhcGVcIixcclxuICAgICAgICBcIm5ld05hbWVcIjogXCJzaGFwZVwiXHJcbiAgICB9XHJcbl0pO1xyXG5cclxucmVwbGFjZVByb3BlcnR5KENhcHN1bGVDb2xsaWRlci5wcm90b3R5cGUsICdDYXBzdWxlQ29sbGlkZXIucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIFwibmFtZVwiOiBcImNhcHN1bGVTaGFwZVwiLFxyXG4gICAgICAgIFwibmV3TmFtZVwiOiBcInNoYXBlXCJcclxuICAgIH1cclxuXSk7XHJcblxyXG5yZXBsYWNlUHJvcGVydHkoUmlnaWRCb2R5LnByb3RvdHlwZSwgJ1JpZ2lkQm9keS5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwicmlnaWRCb2R5XCIsXHJcbiAgICAgICAgXCJuZXdOYW1lXCI6IFwiYm9keVwiXHJcbiAgICB9XHJcbl0pO1xyXG5cclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbUmlnaWRCb2R5XV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgUmlnaWRCb2R5IGFzIFJpZ2lkQm9keUNvbXBvbmVudCB9O1xyXG5sZWdhY3lDQy5SaWdpZEJvZHlDb21wb25lbnQgPSBSaWdpZEJvZHk7XHJcbmpzLnNldENsYXNzQWxpYXMoUmlnaWRCb2R5LCAnY2MuUmlnaWRCb2R5Q29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0NvbGxpZGVyXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgQ29sbGlkZXIgYXMgQ29sbGlkZXJDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuQ29sbGlkZXJDb21wb25lbnQgPSBDb2xsaWRlcjtcclxuanMuc2V0Q2xhc3NBbGlhcyhDb2xsaWRlciwgJ2NjLkNvbGxpZGVyQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0JveENvbGxpZGVyXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgQm94Q29sbGlkZXIgYXMgQm94Q29sbGlkZXJDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuQm94Q29sbGlkZXJDb21wb25lbnQgPSBCb3hDb2xsaWRlcjtcclxuanMuc2V0Q2xhc3NBbGlhcyhCb3hDb2xsaWRlciwgJ2NjLkJveENvbGxpZGVyQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1NwaGVyZUNvbGxpZGVyXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgU3BoZXJlQ29sbGlkZXIgYXMgU3BoZXJlQ29sbGlkZXJDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuU3BoZXJlQ29sbGlkZXJDb21wb25lbnQgPSBTcGhlcmVDb2xsaWRlcjtcclxuanMuc2V0Q2xhc3NBbGlhcyhTcGhlcmVDb2xsaWRlciwgJ2NjLlNwaGVyZUNvbGxpZGVyQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0NhcHN1bGVDb2xsaWRlcl1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IENhcHN1bGVDb2xsaWRlciBhcyBDYXBzdWxlQ29sbGlkZXJDb21wb25lbnQgfTtcclxuanMuc2V0Q2xhc3NBbGlhcyhDYXBzdWxlQ29sbGlkZXIsICdjYy5DYXBzdWxlQ29sbGlkZXJDb21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbTWVzaENvbGxpZGVyXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgTWVzaENvbGxpZGVyIGFzIE1lc2hDb2xsaWRlckNvbXBvbmVudCB9O1xyXG5qcy5zZXRDbGFzc0FsaWFzKE1lc2hDb2xsaWRlciwgJ2NjLk1lc2hDb2xsaWRlckNvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tDeWxpbmRlckNvbGxpZGVyXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgQ3lsaW5kZXJDb2xsaWRlciBhcyBDeWxpbmRlckNvbGxpZGVyQ29tcG9uZW50IH07XHJcbmpzLnNldENsYXNzQWxpYXMoQ3lsaW5kZXJDb2xsaWRlciwgJ2NjLkN5bGluZGVyQ29sbGlkZXJDb21wb25lbnQnKTsiXX0=