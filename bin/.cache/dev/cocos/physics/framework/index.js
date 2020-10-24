(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./physics-system.js", "./assets/physic-material.js", "./physics-ray-result.js", "./components/colliders/box-collider.js", "./components/colliders/collider.js", "./components/colliders/sphere-collider.js", "./components/colliders/capsule-collider.js", "./components/colliders/cylinder-collider.js", "./components/colliders/cone-collider.js", "./components/colliders/mesh-collider.js", "./components/rigid-body.js", "./components/constant-force.js", "./components/colliders/terrain-collider.js", "./components/colliders/simplex-collider.js", "./components/colliders/plane-collider.js", "./components/constraints/constraint.js", "./components/constraints/hinge-constraint.js", "./components/constraints/point-to-point-constraint.js", "../../core/global-exports.js", "./physics-interface.js", "./physics-enum.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./physics-system.js"), require("./assets/physic-material.js"), require("./physics-ray-result.js"), require("./components/colliders/box-collider.js"), require("./components/colliders/collider.js"), require("./components/colliders/sphere-collider.js"), require("./components/colliders/capsule-collider.js"), require("./components/colliders/cylinder-collider.js"), require("./components/colliders/cone-collider.js"), require("./components/colliders/mesh-collider.js"), require("./components/rigid-body.js"), require("./components/constant-force.js"), require("./components/colliders/terrain-collider.js"), require("./components/colliders/simplex-collider.js"), require("./components/colliders/plane-collider.js"), require("./components/constraints/constraint.js"), require("./components/constraints/hinge-constraint.js"), require("./components/constraints/point-to-point-constraint.js"), require("../../core/global-exports.js"), require("./physics-interface.js"), require("./physics-enum.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.physicsSystem, global.physicMaterial, global.physicsRayResult, global.boxCollider, global.collider, global.sphereCollider, global.capsuleCollider, global.cylinderCollider, global.coneCollider, global.meshCollider, global.rigidBody, global.constantForce, global.terrainCollider, global.simplexCollider, global.planeCollider, global.constraint, global.hingeConstraint, global.pointToPointConstraint, global.globalExports, global.physicsInterface, global.physicsEnum, global.deprecated);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _physicsSystem, _physicMaterial, _physicsRayResult, _boxCollider, _collider, _sphereCollider, _capsuleCollider, _cylinderCollider, _coneCollider, _meshCollider, _rigidBody, _constantForce, _terrainCollider, _simplexCollider, _planeCollider, _constraint, _hingeConstraint, _pointToPointConstraint, _globalExports, _physicsInterface, _physicsEnum, _deprecated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    PhysicsSystem: true,
    PhysicMaterial: true,
    PhysicsRayResult: true,
    BoxCollider: true,
    Collider: true,
    SphereCollider: true,
    CapsuleCollider: true,
    CylinderCollider: true,
    ConeCollider: true,
    MeshCollider: true,
    RigidBody: true,
    ConstantForce: true,
    TerrainCollider: true,
    SimplexCollider: true,
    PlaneCollider: true,
    Constraint: true,
    HingeConstraint: true,
    PointToPointConstraint: true,
    EAxisDirection: true,
    ERigidBodyType: true
  };
  Object.defineProperty(_exports, "PhysicsSystem", {
    enumerable: true,
    get: function () {
      return _physicsSystem.PhysicsSystem;
    }
  });
  Object.defineProperty(_exports, "PhysicMaterial", {
    enumerable: true,
    get: function () {
      return _physicMaterial.PhysicMaterial;
    }
  });
  Object.defineProperty(_exports, "PhysicsRayResult", {
    enumerable: true,
    get: function () {
      return _physicsRayResult.PhysicsRayResult;
    }
  });
  Object.defineProperty(_exports, "BoxCollider", {
    enumerable: true,
    get: function () {
      return _boxCollider.BoxCollider;
    }
  });
  Object.defineProperty(_exports, "Collider", {
    enumerable: true,
    get: function () {
      return _collider.Collider;
    }
  });
  Object.defineProperty(_exports, "SphereCollider", {
    enumerable: true,
    get: function () {
      return _sphereCollider.SphereCollider;
    }
  });
  Object.defineProperty(_exports, "CapsuleCollider", {
    enumerable: true,
    get: function () {
      return _capsuleCollider.CapsuleCollider;
    }
  });
  Object.defineProperty(_exports, "CylinderCollider", {
    enumerable: true,
    get: function () {
      return _cylinderCollider.CylinderCollider;
    }
  });
  Object.defineProperty(_exports, "ConeCollider", {
    enumerable: true,
    get: function () {
      return _coneCollider.ConeCollider;
    }
  });
  Object.defineProperty(_exports, "MeshCollider", {
    enumerable: true,
    get: function () {
      return _meshCollider.MeshCollider;
    }
  });
  Object.defineProperty(_exports, "RigidBody", {
    enumerable: true,
    get: function () {
      return _rigidBody.RigidBody;
    }
  });
  Object.defineProperty(_exports, "ConstantForce", {
    enumerable: true,
    get: function () {
      return _constantForce.ConstantForce;
    }
  });
  Object.defineProperty(_exports, "TerrainCollider", {
    enumerable: true,
    get: function () {
      return _terrainCollider.TerrainCollider;
    }
  });
  Object.defineProperty(_exports, "SimplexCollider", {
    enumerable: true,
    get: function () {
      return _simplexCollider.SimplexCollider;
    }
  });
  Object.defineProperty(_exports, "PlaneCollider", {
    enumerable: true,
    get: function () {
      return _planeCollider.PlaneCollider;
    }
  });
  Object.defineProperty(_exports, "Constraint", {
    enumerable: true,
    get: function () {
      return _constraint.Constraint;
    }
  });
  Object.defineProperty(_exports, "HingeConstraint", {
    enumerable: true,
    get: function () {
      return _hingeConstraint.HingeConstraint;
    }
  });
  Object.defineProperty(_exports, "PointToPointConstraint", {
    enumerable: true,
    get: function () {
      return _pointToPointConstraint.PointToPointConstraint;
    }
  });
  Object.defineProperty(_exports, "EAxisDirection", {
    enumerable: true,
    get: function () {
      return _physicsEnum.EAxisDirection;
    }
  });
  Object.defineProperty(_exports, "ERigidBodyType", {
    enumerable: true,
    get: function () {
      return _physicsEnum.ERigidBodyType;
    }
  });
  Object.keys(_physicsInterface).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _physicsInterface[key];
      }
    });
  });
  Object.keys(_deprecated).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _deprecated[key];
      }
    });
  });

  /**
   * @hidden
   */
  // constraints
  _globalExports.legacyCC.PhysicsSystem = _physicsSystem.PhysicsSystem;
  _globalExports.legacyCC.PhysicMaterial = _physicMaterial.PhysicMaterial;
  _globalExports.legacyCC.PhysicsRayResult = _physicsRayResult.PhysicsRayResult;
  _globalExports.legacyCC.ConstantForce = _constantForce.ConstantForce;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2luZGV4LnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwiUGh5c2ljc1N5c3RlbSIsIlBoeXNpY01hdGVyaWFsIiwiUGh5c2ljc1JheVJlc3VsdCIsIkNvbnN0YW50Rm9yY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUE3REE7OztBQW9CQTtBQWdDQUEsMEJBQVNDLGFBQVQsR0FBeUJBLDRCQUF6QjtBQUVBRCwwQkFBU0UsY0FBVCxHQUEwQkEsOEJBQTFCO0FBQ0FGLDBCQUFTRyxnQkFBVCxHQUE0QkEsa0NBQTVCO0FBQ0FILDBCQUFTSSxhQUFULEdBQXlCQSw0QkFBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFBoeXNpY3NTeXN0ZW0gfSBmcm9tICcuL3BoeXNpY3Mtc3lzdGVtJztcclxuaW1wb3J0IHsgUGh5c2ljTWF0ZXJpYWwgfSBmcm9tICcuL2Fzc2V0cy9waHlzaWMtbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBQaHlzaWNzUmF5UmVzdWx0IH0gZnJvbSAnLi9waHlzaWNzLXJheS1yZXN1bHQnO1xyXG5pbXBvcnQgeyBCb3hDb2xsaWRlciB9IGZyb20gJy4vY29tcG9uZW50cy9jb2xsaWRlcnMvYm94LWNvbGxpZGVyJztcclxuaW1wb3J0IHsgQ29sbGlkZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvY29sbGlkZXJzL2NvbGxpZGVyJztcclxuaW1wb3J0IHsgU3BoZXJlQ29sbGlkZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvY29sbGlkZXJzL3NwaGVyZS1jb2xsaWRlcic7XHJcbmltcG9ydCB7IENhcHN1bGVDb2xsaWRlciB9IGZyb20gJy4vY29tcG9uZW50cy9jb2xsaWRlcnMvY2Fwc3VsZS1jb2xsaWRlcic7XHJcbmltcG9ydCB7IEN5bGluZGVyQ29sbGlkZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvY29sbGlkZXJzL2N5bGluZGVyLWNvbGxpZGVyJztcclxuaW1wb3J0IHsgQ29uZUNvbGxpZGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbGxpZGVycy9jb25lLWNvbGxpZGVyJztcclxuaW1wb3J0IHsgTWVzaENvbGxpZGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbGxpZGVycy9tZXNoLWNvbGxpZGVyJztcclxuaW1wb3J0IHsgUmlnaWRCb2R5IH0gZnJvbSAnLi9jb21wb25lbnRzL3JpZ2lkLWJvZHknO1xyXG5pbXBvcnQgeyBDb25zdGFudEZvcmNlIH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnN0YW50LWZvcmNlJztcclxuaW1wb3J0IHsgVGVycmFpbkNvbGxpZGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbGxpZGVycy90ZXJyYWluLWNvbGxpZGVyJztcclxuaW1wb3J0IHsgU2ltcGxleENvbGxpZGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbGxpZGVycy9zaW1wbGV4LWNvbGxpZGVyJztcclxuaW1wb3J0IHsgUGxhbmVDb2xsaWRlciB9IGZyb20gJy4vY29tcG9uZW50cy9jb2xsaWRlcnMvcGxhbmUtY29sbGlkZXInO1xyXG5cclxuLy8gY29uc3RyYWludHNcclxuaW1wb3J0IHsgQ29uc3RyYWludCB9IGZyb20gJy4vY29tcG9uZW50cy9jb25zdHJhaW50cy9jb25zdHJhaW50JztcclxuaW1wb3J0IHsgSGluZ2VDb25zdHJhaW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnN0cmFpbnRzL2hpbmdlLWNvbnN0cmFpbnQnO1xyXG5pbXBvcnQgeyBQb2ludFRvUG9pbnRDb25zdHJhaW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnN0cmFpbnRzL3BvaW50LXRvLXBvaW50LWNvbnN0cmFpbnQnO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIFBoeXNpY3NTeXN0ZW0sXHJcbiAgICBQaHlzaWNzUmF5UmVzdWx0LFxyXG5cclxuICAgIENvbGxpZGVyLFxyXG4gICAgQm94Q29sbGlkZXIsXHJcbiAgICBTcGhlcmVDb2xsaWRlcixcclxuICAgIENhcHN1bGVDb2xsaWRlcixcclxuICAgIE1lc2hDb2xsaWRlcixcclxuICAgIEN5bGluZGVyQ29sbGlkZXIsXHJcbiAgICBDb25lQ29sbGlkZXIsXHJcbiAgICBUZXJyYWluQ29sbGlkZXIsXHJcbiAgICBTaW1wbGV4Q29sbGlkZXIsXHJcbiAgICBQbGFuZUNvbGxpZGVyLFxyXG5cclxuICAgIENvbnN0cmFpbnQsXHJcbiAgICBIaW5nZUNvbnN0cmFpbnQsXHJcbiAgICBQb2ludFRvUG9pbnRDb25zdHJhaW50LFxyXG5cclxuICAgIFJpZ2lkQm9keSxcclxuXHJcbiAgICBQaHlzaWNNYXRlcmlhbCxcclxuXHJcbiAgICBDb25zdGFudEZvcmNlLFxyXG59O1xyXG5cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxubGVnYWN5Q0MuUGh5c2ljc1N5c3RlbSA9IFBoeXNpY3NTeXN0ZW07XHJcblxyXG5sZWdhY3lDQy5QaHlzaWNNYXRlcmlhbCA9IFBoeXNpY01hdGVyaWFsO1xyXG5sZWdhY3lDQy5QaHlzaWNzUmF5UmVzdWx0ID0gUGh5c2ljc1JheVJlc3VsdDtcclxubGVnYWN5Q0MuQ29uc3RhbnRGb3JjZSA9IENvbnN0YW50Rm9yY2U7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL3BoeXNpY3MtaW50ZXJmYWNlJztcclxuZXhwb3J0IHsgRUF4aXNEaXJlY3Rpb24sIEVSaWdpZEJvZHlUeXBlIH0gZnJvbSAnLi9waHlzaWNzLWVudW0nO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9kZXByZWNhdGVkJztcclxuIl19