(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./ammo-instantiated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./ammo-instantiated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated);
    global.ammoEnum = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoDispatcherFlags = _exports.AmmoCollisionFilterGroups = _exports.AmmoBroadphaseNativeTypes = _exports.AmmoRigidBodyFlags = _exports.AmmoAnisotropicFrictionFlags = _exports.AmmoCollisionObjectStates = _exports.AmmoCollisionObjectTypes = _exports.AmmoCollisionFlags = _exports.EAmmoSharedBodyDirty = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var EAmmoSharedBodyDirty;
  _exports.EAmmoSharedBodyDirty = EAmmoSharedBodyDirty;

  (function (EAmmoSharedBodyDirty) {
    EAmmoSharedBodyDirty[EAmmoSharedBodyDirty["BODY_RE_ADD"] = 1] = "BODY_RE_ADD";
    EAmmoSharedBodyDirty[EAmmoSharedBodyDirty["GHOST_RE_ADD"] = 2] = "GHOST_RE_ADD";
  })(EAmmoSharedBodyDirty || (_exports.EAmmoSharedBodyDirty = EAmmoSharedBodyDirty = {}));

  var AmmoCollisionFlags;
  _exports.AmmoCollisionFlags = AmmoCollisionFlags;

  (function (AmmoCollisionFlags) {
    AmmoCollisionFlags[AmmoCollisionFlags["CF_STATIC_OBJECT"] = 1] = "CF_STATIC_OBJECT";
    AmmoCollisionFlags[AmmoCollisionFlags["CF_KINEMATIC_OBJECT"] = 2] = "CF_KINEMATIC_OBJECT";
    AmmoCollisionFlags[AmmoCollisionFlags["CF_NO_CONTACT_RESPONSE"] = 4] = "CF_NO_CONTACT_RESPONSE";
    AmmoCollisionFlags[AmmoCollisionFlags["CF_CUSTOM_MATERIAL_CALLBACK"] = 8] = "CF_CUSTOM_MATERIAL_CALLBACK";
    AmmoCollisionFlags[AmmoCollisionFlags["CF_CHARACTER_OBJECT"] = 16] = "CF_CHARACTER_OBJECT";
    AmmoCollisionFlags[AmmoCollisionFlags["CF_DISABLE_VISUALIZE_OBJECT"] = 32] = "CF_DISABLE_VISUALIZE_OBJECT";
    AmmoCollisionFlags[AmmoCollisionFlags["CF_DISABLE_SPU_COLLISION_PROCESSING"] = 64] = "CF_DISABLE_SPU_COLLISION_PROCESSING";
  })(AmmoCollisionFlags || (_exports.AmmoCollisionFlags = AmmoCollisionFlags = {}));

  ;
  _ammoInstantiated.default.AmmoCollisionFlags = AmmoCollisionFlags;
  var AmmoCollisionObjectTypes;
  _exports.AmmoCollisionObjectTypes = AmmoCollisionObjectTypes;

  (function (AmmoCollisionObjectTypes) {
    AmmoCollisionObjectTypes[AmmoCollisionObjectTypes["CO_COLLISION_OBJECT"] = 1] = "CO_COLLISION_OBJECT";
    AmmoCollisionObjectTypes[AmmoCollisionObjectTypes["CO_RIGID_BODY"] = 2] = "CO_RIGID_BODY";
    AmmoCollisionObjectTypes[AmmoCollisionObjectTypes["CO_GHOST_OBJECT"] = 4] = "CO_GHOST_OBJECT";
    AmmoCollisionObjectTypes[AmmoCollisionObjectTypes["CO_SOFT_BODY"] = 8] = "CO_SOFT_BODY";
    AmmoCollisionObjectTypes[AmmoCollisionObjectTypes["CO_HF_FLUID"] = 16] = "CO_HF_FLUID";
    AmmoCollisionObjectTypes[AmmoCollisionObjectTypes["CO_USER_TYPE"] = 32] = "CO_USER_TYPE";
    AmmoCollisionObjectTypes[AmmoCollisionObjectTypes["CO_FEATHERSTONE_LINK"] = 64] = "CO_FEATHERSTONE_LINK";
  })(AmmoCollisionObjectTypes || (_exports.AmmoCollisionObjectTypes = AmmoCollisionObjectTypes = {}));

  ;
  _ammoInstantiated.default.AmmoCollisionObjectTypes = AmmoCollisionObjectTypes;
  var AmmoCollisionObjectStates;
  _exports.AmmoCollisionObjectStates = AmmoCollisionObjectStates;

  (function (AmmoCollisionObjectStates) {
    AmmoCollisionObjectStates[AmmoCollisionObjectStates["ACTIVE_TAG"] = 1] = "ACTIVE_TAG";
    AmmoCollisionObjectStates[AmmoCollisionObjectStates["ISLAND_SLEEPING"] = 2] = "ISLAND_SLEEPING";
    AmmoCollisionObjectStates[AmmoCollisionObjectStates["WANTS_DEACTIVATION"] = 3] = "WANTS_DEACTIVATION";
    AmmoCollisionObjectStates[AmmoCollisionObjectStates["DISABLE_DEACTIVATION"] = 4] = "DISABLE_DEACTIVATION";
    AmmoCollisionObjectStates[AmmoCollisionObjectStates["DISABLE_SIMULATION"] = 5] = "DISABLE_SIMULATION";
  })(AmmoCollisionObjectStates || (_exports.AmmoCollisionObjectStates = AmmoCollisionObjectStates = {}));

  var AmmoAnisotropicFrictionFlags;
  _exports.AmmoAnisotropicFrictionFlags = AmmoAnisotropicFrictionFlags;

  (function (AmmoAnisotropicFrictionFlags) {
    AmmoAnisotropicFrictionFlags[AmmoAnisotropicFrictionFlags["CF_ANISOTROPIC_FRICTION_DISABLED"] = 0] = "CF_ANISOTROPIC_FRICTION_DISABLED";
    AmmoAnisotropicFrictionFlags[AmmoAnisotropicFrictionFlags["CF_ANISOTROPIC_FRICTION"] = 1] = "CF_ANISOTROPIC_FRICTION";
    AmmoAnisotropicFrictionFlags[AmmoAnisotropicFrictionFlags["CF_ANISOTROPIC_ROLLING_FRICTION"] = 2] = "CF_ANISOTROPIC_ROLLING_FRICTION";
  })(AmmoAnisotropicFrictionFlags || (_exports.AmmoAnisotropicFrictionFlags = AmmoAnisotropicFrictionFlags = {}));

  ;
  _ammoInstantiated.default.AmmoAnisotropicFrictionFlags = AmmoAnisotropicFrictionFlags;
  var AmmoRigidBodyFlags;
  _exports.AmmoRigidBodyFlags = AmmoRigidBodyFlags;

  (function (AmmoRigidBodyFlags) {
    AmmoRigidBodyFlags[AmmoRigidBodyFlags["BT_DISABLE_WORLD_GRAVITY"] = 1] = "BT_DISABLE_WORLD_GRAVITY";
    AmmoRigidBodyFlags[AmmoRigidBodyFlags["BT_ENABLE_GYROPSCOPIC_FORCE"] = 2] = "BT_ENABLE_GYROPSCOPIC_FORCE";
  })(AmmoRigidBodyFlags || (_exports.AmmoRigidBodyFlags = AmmoRigidBodyFlags = {}));

  ;
  _ammoInstantiated.default.AmmoRigidBodyFlags = AmmoRigidBodyFlags; /// btDispatcher uses these types
  /// IMPORTANT NOTE:The types are ordered polyhedral, implicit convex and concave
  /// to facilitate type checking
  /// CUSTOM_POLYHEDRAL_SHAPE_TYPE,CUSTOM_CONVEX_SHAPE_TYPE and CUSTOM_CONCAVE_SHAPE_TYPE can be used to extend Bullet without modifying source code

  var AmmoBroadphaseNativeTypes;
  _exports.AmmoBroadphaseNativeTypes = AmmoBroadphaseNativeTypes;

  (function (AmmoBroadphaseNativeTypes) {
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["BOX_SHAPE_PROXYTYPE"] = 0] = "BOX_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["TRIANGLE_SHAPE_PROXYTYPE"] = 1] = "TRIANGLE_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["TETRAHEDRAL_SHAPE_PROXYTYPE"] = 2] = "TETRAHEDRAL_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CONVEX_TRIANGLEMESH_SHAPE_PROXYTYPE"] = 3] = "CONVEX_TRIANGLEMESH_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CONVEX_HULL_SHAPE_PROXYTYPE"] = 4] = "CONVEX_HULL_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CONVEX_POINT_CLOUD_SHAPE_PROXYTYPE"] = 5] = "CONVEX_POINT_CLOUD_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CUSTOM_POLYHEDRAL_SHAPE_TYPE"] = 6] = "CUSTOM_POLYHEDRAL_SHAPE_TYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["IMPLICIT_CONVEX_SHAPES_START_HERE"] = 7] = "IMPLICIT_CONVEX_SHAPES_START_HERE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["SPHERE_SHAPE_PROXYTYPE"] = 8] = "SPHERE_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["MULTI_SPHERE_SHAPE_PROXYTYPE"] = 9] = "MULTI_SPHERE_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CAPSULE_SHAPE_PROXYTYPE"] = 10] = "CAPSULE_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CONE_SHAPE_PROXYTYPE"] = 11] = "CONE_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CONVEX_SHAPE_PROXYTYPE"] = 12] = "CONVEX_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CYLINDER_SHAPE_PROXYTYPE"] = 13] = "CYLINDER_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["UNIFORM_SCALING_SHAPE_PROXYTYPE"] = 14] = "UNIFORM_SCALING_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["MINKOWSKI_SUM_SHAPE_PROXYTYPE"] = 15] = "MINKOWSKI_SUM_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["MINKOWSKI_DIFFERENCE_SHAPE_PROXYTYPE"] = 16] = "MINKOWSKI_DIFFERENCE_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["BOX_2D_SHAPE_PROXYTYPE"] = 17] = "BOX_2D_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CONVEX_2D_SHAPE_PROXYTYPE"] = 18] = "CONVEX_2D_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CUSTOM_CONVEX_SHAPE_TYPE"] = 19] = "CUSTOM_CONVEX_SHAPE_TYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CONCAVE_SHAPES_START_HERE"] = 20] = "CONCAVE_SHAPES_START_HERE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["TRIANGLE_MESH_SHAPE_PROXYTYPE"] = 21] = "TRIANGLE_MESH_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["SCALED_TRIANGLE_MESH_SHAPE_PROXYTYPE"] = 22] = "SCALED_TRIANGLE_MESH_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["FAST_CONCAVE_MESH_PROXYTYPE"] = 23] = "FAST_CONCAVE_MESH_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["TERRAIN_SHAPE_PROXYTYPE"] = 24] = "TERRAIN_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["GIMPACT_SHAPE_PROXYTYPE"] = 25] = "GIMPACT_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["MULTIMATERIAL_TRIANGLE_MESH_PROXYTYPE"] = 26] = "MULTIMATERIAL_TRIANGLE_MESH_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["EMPTY_SHAPE_PROXYTYPE"] = 27] = "EMPTY_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["STATIC_PLANE_PROXYTYPE"] = 28] = "STATIC_PLANE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CUSTOM_CONCAVE_SHAPE_TYPE"] = 29] = "CUSTOM_CONCAVE_SHAPE_TYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["CONCAVE_SHAPES_END_HERE"] = 30] = "CONCAVE_SHAPES_END_HERE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["COMPOUND_SHAPE_PROXYTYPE"] = 31] = "COMPOUND_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["SOFTBODY_SHAPE_PROXYTYPE"] = 32] = "SOFTBODY_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["HFFLUID_SHAPE_PROXYTYPE"] = 33] = "HFFLUID_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["HFFLUID_BUOYANT_CONVEX_SHAPE_PROXYTYPE"] = 34] = "HFFLUID_BUOYANT_CONVEX_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["INVALID_SHAPE_PROXYTYPE"] = 35] = "INVALID_SHAPE_PROXYTYPE";
    AmmoBroadphaseNativeTypes[AmmoBroadphaseNativeTypes["MAX_BROADPHASE_COLLISION_TYPES"] = 36] = "MAX_BROADPHASE_COLLISION_TYPES";
  })(AmmoBroadphaseNativeTypes || (_exports.AmmoBroadphaseNativeTypes = AmmoBroadphaseNativeTypes = {}));

  ;
  _ammoInstantiated.default.AmmoBroadphaseNativeTypes = AmmoBroadphaseNativeTypes;
  var AmmoCollisionFilterGroups;
  _exports.AmmoCollisionFilterGroups = AmmoCollisionFilterGroups;

  (function (AmmoCollisionFilterGroups) {
    AmmoCollisionFilterGroups[AmmoCollisionFilterGroups["DefaultFilter"] = 1] = "DefaultFilter";
    AmmoCollisionFilterGroups[AmmoCollisionFilterGroups["StaticFilter"] = 2] = "StaticFilter";
    AmmoCollisionFilterGroups[AmmoCollisionFilterGroups["KinematicFilter"] = 4] = "KinematicFilter";
    AmmoCollisionFilterGroups[AmmoCollisionFilterGroups["DebrisFilter"] = 8] = "DebrisFilter";
    AmmoCollisionFilterGroups[AmmoCollisionFilterGroups["SensorTrigger"] = 16] = "SensorTrigger";
    AmmoCollisionFilterGroups[AmmoCollisionFilterGroups["CharacterFilter"] = 32] = "CharacterFilter";
    AmmoCollisionFilterGroups[AmmoCollisionFilterGroups["AllFilter"] = -1] = "AllFilter";
  })(AmmoCollisionFilterGroups || (_exports.AmmoCollisionFilterGroups = AmmoCollisionFilterGroups = {}));

  ;
  _ammoInstantiated.default.AmmoCollisionFilterGroups = AmmoCollisionFilterGroups;
  var AmmoDispatcherFlags;
  _exports.AmmoDispatcherFlags = AmmoDispatcherFlags;

  (function (AmmoDispatcherFlags) {
    AmmoDispatcherFlags[AmmoDispatcherFlags["CD_STATIC_STATIC_REPORTED"] = 1] = "CD_STATIC_STATIC_REPORTED";
    AmmoDispatcherFlags[AmmoDispatcherFlags["CD_USE_RELATIVE_CONTACT_BREAKING_THRESHOLD"] = 2] = "CD_USE_RELATIVE_CONTACT_BREAKING_THRESHOLD";
    AmmoDispatcherFlags[AmmoDispatcherFlags["CD_DISABLE_CONTACTPOOL_DYNAMIC_ALLOCATION"] = 4] = "CD_DISABLE_CONTACTPOOL_DYNAMIC_ALLOCATION";
  })(AmmoDispatcherFlags || (_exports.AmmoDispatcherFlags = AmmoDispatcherFlags = {}));

  ;
  _ammoInstantiated.default.AmmoDispatcherFlags = AmmoDispatcherFlags;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9hbW1vLWVudW0udHMiXSwibmFtZXMiOlsiRUFtbW9TaGFyZWRCb2R5RGlydHkiLCJBbW1vQ29sbGlzaW9uRmxhZ3MiLCJBbW1vIiwiQW1tb0NvbGxpc2lvbk9iamVjdFR5cGVzIiwiQW1tb0NvbGxpc2lvbk9iamVjdFN0YXRlcyIsIkFtbW9Bbmlzb3Ryb3BpY0ZyaWN0aW9uRmxhZ3MiLCJBbW1vUmlnaWRCb2R5RmxhZ3MiLCJBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzIiwiQW1tb0NvbGxpc2lvbkZpbHRlckdyb3VwcyIsIkFtbW9EaXNwYXRjaGVyRmxhZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BRVlBLG9COzs7YUFBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7S0FBQUEsb0IscUNBQUFBLG9COztNQUtBQyxrQjs7O2FBQUFBLGtCO0FBQUFBLElBQUFBLGtCLENBQUFBLGtCO0FBQUFBLElBQUFBLGtCLENBQUFBLGtCO0FBQUFBLElBQUFBLGtCLENBQUFBLGtCO0FBQUFBLElBQUFBLGtCLENBQUFBLGtCO0FBQUFBLElBQUFBLGtCLENBQUFBLGtCO0FBQUFBLElBQUFBLGtCLENBQUFBLGtCO0FBQUFBLElBQUFBLGtCLENBQUFBLGtCO0tBQUFBLGtCLG1DQUFBQSxrQjs7QUFRWDtBQUNBQywyQkFBRCxDQUFjRCxrQkFBZCxHQUFtQ0Esa0JBQW5DO01BRVlFLHdCOzs7YUFBQUEsd0I7QUFBQUEsSUFBQUEsd0IsQ0FBQUEsd0I7QUFBQUEsSUFBQUEsd0IsQ0FBQUEsd0I7QUFBQUEsSUFBQUEsd0IsQ0FBQUEsd0I7QUFBQUEsSUFBQUEsd0IsQ0FBQUEsd0I7QUFBQUEsSUFBQUEsd0IsQ0FBQUEsd0I7QUFBQUEsSUFBQUEsd0IsQ0FBQUEsd0I7QUFBQUEsSUFBQUEsd0IsQ0FBQUEsd0I7S0FBQUEsd0IseUNBQUFBLHdCOztBQVVYO0FBQ0FELDJCQUFELENBQWNDLHdCQUFkLEdBQXlDQSx3QkFBekM7TUFFWUMseUI7OzthQUFBQSx5QjtBQUFBQSxJQUFBQSx5QixDQUFBQSx5QjtBQUFBQSxJQUFBQSx5QixDQUFBQSx5QjtBQUFBQSxJQUFBQSx5QixDQUFBQSx5QjtBQUFBQSxJQUFBQSx5QixDQUFBQSx5QjtBQUFBQSxJQUFBQSx5QixDQUFBQSx5QjtLQUFBQSx5QiwwQ0FBQUEseUI7O01BU0FDLDRCOzs7YUFBQUEsNEI7QUFBQUEsSUFBQUEsNEIsQ0FBQUEsNEI7QUFBQUEsSUFBQUEsNEIsQ0FBQUEsNEI7QUFBQUEsSUFBQUEsNEIsQ0FBQUEsNEI7S0FBQUEsNEIsNkNBQUFBLDRCOztBQUlYO0FBQ0FILDJCQUFELENBQWNHLDRCQUFkLEdBQTZDQSw0QkFBN0M7TUFFWUMsa0I7OzthQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtLQUFBQSxrQixtQ0FBQUEsa0I7O0FBTVg7QUFDQUosMkJBQUQsQ0FBY0ksa0JBQWQsR0FBbUNBLGtCQUFuQyxDLENBR0E7QUFDQTtBQUNBO0FBQ0E7O01BQ1lDLHlCOzs7YUFBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7S0FBQUEseUIsMENBQUFBLHlCOztBQWtEWDtBQUNBTCwyQkFBRCxDQUFjSyx5QkFBZCxHQUEwQ0EseUJBQTFDO01BRVlDLHlCOzs7YUFBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7QUFBQUEsSUFBQUEseUIsQ0FBQUEseUI7S0FBQUEseUIsMENBQUFBLHlCOztBQVFYO0FBQ0FOLDJCQUFELENBQWNNLHlCQUFkLEdBQTBDQSx5QkFBMUM7TUFFWUMsbUI7OzthQUFBQSxtQjtBQUFBQSxJQUFBQSxtQixDQUFBQSxtQjtBQUFBQSxJQUFBQSxtQixDQUFBQSxtQjtBQUFBQSxJQUFBQSxtQixDQUFBQSxtQjtLQUFBQSxtQixvQ0FBQUEsbUI7O0FBSVg7QUFDQVAsMkJBQUQsQ0FBY08sbUJBQWQsR0FBb0NBLG1CQUFwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbW1vIGZyb20gJy4vYW1tby1pbnN0YW50aWF0ZWQnO1xyXG5cclxuZXhwb3J0IGVudW0gRUFtbW9TaGFyZWRCb2R5RGlydHkge1xyXG4gICAgQk9EWV9SRV9BREQgPSAxLFxyXG4gICAgR0hPU1RfUkVfQUREID0gMixcclxufVxyXG5cclxuZXhwb3J0IGVudW0gQW1tb0NvbGxpc2lvbkZsYWdzIHtcclxuICAgIENGX1NUQVRJQ19PQkpFQ1QgPSAxLFxyXG4gICAgQ0ZfS0lORU1BVElDX09CSkVDVCA9IDIsXHJcbiAgICBDRl9OT19DT05UQUNUX1JFU1BPTlNFID0gNCxcclxuICAgIENGX0NVU1RPTV9NQVRFUklBTF9DQUxMQkFDSyA9IDgsLy90aGlzIGFsbG93cyBwZXItdHJpYW5nbGUgbWF0ZXJpYWwgKGZyaWN0aW9uL3Jlc3RpdHV0aW9uKVxyXG4gICAgQ0ZfQ0hBUkFDVEVSX09CSkVDVCA9IDE2LFxyXG4gICAgQ0ZfRElTQUJMRV9WSVNVQUxJWkVfT0JKRUNUID0gMzIsIC8vZGlzYWJsZSBkZWJ1ZyBkcmF3aW5nXHJcbiAgICBDRl9ESVNBQkxFX1NQVV9DT0xMSVNJT05fUFJPQ0VTU0lORyA9IDY0Ly9kaXNhYmxlIHBhcmFsbGVsL1NQVSBwcm9jZXNzaW5nXHJcbn07XHJcbihBbW1vIGFzIGFueSkuQW1tb0NvbGxpc2lvbkZsYWdzID0gQW1tb0NvbGxpc2lvbkZsYWdzO1xyXG5cclxuZXhwb3J0IGVudW0gQW1tb0NvbGxpc2lvbk9iamVjdFR5cGVzIHtcclxuICAgIENPX0NPTExJU0lPTl9PQkpFQ1QgPSAxLFxyXG4gICAgQ09fUklHSURfQk9EWSA9IDIsXHJcbiAgICAvLy9DT19HSE9TVF9PQkpFQ1Qga2VlcHMgdHJhY2sgb2YgYWxsIG9iamVjdHMgb3ZlcmxhcHBpbmcgaXRzIEFBQkIgYW5kIHRoYXQgcGFzcyBpdHMgY29sbGlzaW9uIGZpbHRlclxyXG4gICAgLy8vSXQgaXMgdXNlZnVsIGZvciBjb2xsaXNpb24gc2Vuc29ycywgZXhwbG9zaW9uIG9iamVjdHMsIGNoYXJhY3RlciBjb250cm9sbGVyIGV0Yy5cclxuICAgIENPX0dIT1NUX09CSkVDVCA9IDQsXHJcbiAgICBDT19TT0ZUX0JPRFkgPSA4LFxyXG4gICAgQ09fSEZfRkxVSUQgPSAxNixcclxuICAgIENPX1VTRVJfVFlQRSA9IDMyLFxyXG4gICAgQ09fRkVBVEhFUlNUT05FX0xJTksgPSA2NFxyXG59O1xyXG4oQW1tbyBhcyBhbnkpLkFtbW9Db2xsaXNpb25PYmplY3RUeXBlcyA9IEFtbW9Db2xsaXNpb25PYmplY3RUeXBlcztcclxuXHJcbmV4cG9ydCBlbnVtIEFtbW9Db2xsaXNpb25PYmplY3RTdGF0ZXMge1xyXG4gICAgQUNUSVZFX1RBRyA9IDEsXHJcbiAgICBJU0xBTkRfU0xFRVBJTkcgPSAyLFxyXG4gICAgV0FOVFNfREVBQ1RJVkFUSU9OID0gMyxcclxuICAgIC8vIOmdmeatouS8keecoFxyXG4gICAgRElTQUJMRV9ERUFDVElWQVRJT04gPSA0LFxyXG4gICAgRElTQUJMRV9TSU1VTEFUSU9OID0gNSxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gQW1tb0FuaXNvdHJvcGljRnJpY3Rpb25GbGFncyB7XHJcbiAgICBDRl9BTklTT1RST1BJQ19GUklDVElPTl9ESVNBQkxFRCA9IDAsXHJcbiAgICBDRl9BTklTT1RST1BJQ19GUklDVElPTiA9IDEsXHJcbiAgICBDRl9BTklTT1RST1BJQ19ST0xMSU5HX0ZSSUNUSU9OID0gMlxyXG59O1xyXG4oQW1tbyBhcyBhbnkpLkFtbW9Bbmlzb3Ryb3BpY0ZyaWN0aW9uRmxhZ3MgPSBBbW1vQW5pc290cm9waWNGcmljdGlvbkZsYWdzO1xyXG5cclxuZXhwb3J0IGVudW0gQW1tb1JpZ2lkQm9keUZsYWdzIHtcclxuICAgIEJUX0RJU0FCTEVfV09STERfR1JBVklUWSA9IDEsXHJcbiAgICAvLy9UaGUgQlRfRU5BQkxFX0dZUk9QU0NPUElDX0ZPUkNFIGNhbiBlYXNpbHkgaW50cm9kdWNlIGluc3RhYmlsaXR5XHJcbiAgICAvLy9TbyBnZW5lcmFsbHkgaXQgaXMgYmVzdCB0byBub3QgZW5hYmxlIGl0LiBcclxuICAgIC8vL0lmIHJlYWxseSBuZWVkZWQsIHJ1biBhdCBhIGhpZ2ggZnJlcXVlbmN5IGxpa2UgMTAwMCBIZXJ0ejpcdC8vL1NlZSBEZW1vcy9HeXJvc2NvcGljRGVtbyBmb3IgYW4gZXhhbXBsZSB1c2VcclxuICAgIEJUX0VOQUJMRV9HWVJPUFNDT1BJQ19GT1JDRSA9IDJcclxufTtcclxuKEFtbW8gYXMgYW55KS5BbW1vUmlnaWRCb2R5RmxhZ3MgPSBBbW1vUmlnaWRCb2R5RmxhZ3M7XHJcblxyXG5cclxuLy8vIGJ0RGlzcGF0Y2hlciB1c2VzIHRoZXNlIHR5cGVzXHJcbi8vLyBJTVBPUlRBTlQgTk9URTpUaGUgdHlwZXMgYXJlIG9yZGVyZWQgcG9seWhlZHJhbCwgaW1wbGljaXQgY29udmV4IGFuZCBjb25jYXZlXHJcbi8vLyB0byBmYWNpbGl0YXRlIHR5cGUgY2hlY2tpbmdcclxuLy8vIENVU1RPTV9QT0xZSEVEUkFMX1NIQVBFX1RZUEUsQ1VTVE9NX0NPTlZFWF9TSEFQRV9UWVBFIGFuZCBDVVNUT01fQ09OQ0FWRV9TSEFQRV9UWVBFIGNhbiBiZSB1c2VkIHRvIGV4dGVuZCBCdWxsZXQgd2l0aG91dCBtb2RpZnlpbmcgc291cmNlIGNvZGVcclxuZXhwb3J0IGVudW0gQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyB7XHJcbiAgICAvLyBwb2x5aGVkcmFsIGNvbnZleCBzaGFwZXNcclxuICAgIEJPWF9TSEFQRV9QUk9YWVRZUEUsXHJcbiAgICBUUklBTkdMRV9TSEFQRV9QUk9YWVRZUEUsXHJcbiAgICBURVRSQUhFRFJBTF9TSEFQRV9QUk9YWVRZUEUsXHJcbiAgICBDT05WRVhfVFJJQU5HTEVNRVNIX1NIQVBFX1BST1hZVFlQRSxcclxuICAgIENPTlZFWF9IVUxMX1NIQVBFX1BST1hZVFlQRSxcclxuICAgIENPTlZFWF9QT0lOVF9DTE9VRF9TSEFQRV9QUk9YWVRZUEUsXHJcbiAgICBDVVNUT01fUE9MWUhFRFJBTF9TSEFQRV9UWVBFLFxyXG4gICAgLy9pbXBsaWNpdCBjb252ZXggc2hhcGVzXHJcbiAgICBJTVBMSUNJVF9DT05WRVhfU0hBUEVTX1NUQVJUX0hFUkUsXHJcbiAgICBTUEhFUkVfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgTVVMVElfU1BIRVJFX1NIQVBFX1BST1hZVFlQRSxcclxuICAgIENBUFNVTEVfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgQ09ORV9TSEFQRV9QUk9YWVRZUEUsXHJcbiAgICBDT05WRVhfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgQ1lMSU5ERVJfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgVU5JRk9STV9TQ0FMSU5HX1NIQVBFX1BST1hZVFlQRSxcclxuICAgIE1JTktPV1NLSV9TVU1fU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgTUlOS09XU0tJX0RJRkZFUkVOQ0VfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgQk9YXzJEX1NIQVBFX1BST1hZVFlQRSxcclxuICAgIENPTlZFWF8yRF9TSEFQRV9QUk9YWVRZUEUsXHJcbiAgICBDVVNUT01fQ09OVkVYX1NIQVBFX1RZUEUsXHJcbiAgICAvL2NvbmNhdmUgc2hhcGVzXHJcbiAgICBDT05DQVZFX1NIQVBFU19TVEFSVF9IRVJFLFxyXG4gICAgLy9rZWVwIGFsbCB0aGUgY29udmV4IHNoYXBldHlwZSBiZWxvdyBoZXJlLCBmb3IgdGhlIGNoZWNrIElzQ29udmV4U2hhcGUgaW4gYnJvYWRwaGFzZSBwcm94eSFcclxuICAgIFRSSUFOR0xFX01FU0hfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgU0NBTEVEX1RSSUFOR0xFX01FU0hfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgLy8vdXNlZCBmb3IgZGVtbyBpbnRlZ3JhdGlvbiBGQVNUL1N3aWZ0IGNvbGxpc2lvbiBsaWJyYXJ5IGFuZCBCdWxsZXRcclxuICAgIEZBU1RfQ09OQ0FWRV9NRVNIX1BST1hZVFlQRSxcclxuICAgIC8vdGVycmFpblxyXG4gICAgVEVSUkFJTl9TSEFQRV9QUk9YWVRZUEUsXHJcbiAgICAvLy9Vc2VkIGZvciBHSU1QQUNUIFRyaW1lc2ggaW50ZWdyYXRpb25cclxuICAgIEdJTVBBQ1RfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgLy8vTXVsdGltYXRlcmlhbCBtZXNoXHJcbiAgICBNVUxUSU1BVEVSSUFMX1RSSUFOR0xFX01FU0hfUFJPWFlUWVBFLFxyXG5cclxuICAgIEVNUFRZX1NIQVBFX1BST1hZVFlQRSxcclxuICAgIFNUQVRJQ19QTEFORV9QUk9YWVRZUEUsXHJcbiAgICBDVVNUT01fQ09OQ0FWRV9TSEFQRV9UWVBFLFxyXG4gICAgQ09OQ0FWRV9TSEFQRVNfRU5EX0hFUkUsXHJcblxyXG4gICAgQ09NUE9VTkRfU0hBUEVfUFJPWFlUWVBFLFxyXG5cclxuICAgIFNPRlRCT0RZX1NIQVBFX1BST1hZVFlQRSxcclxuICAgIEhGRkxVSURfU0hBUEVfUFJPWFlUWVBFLFxyXG4gICAgSEZGTFVJRF9CVU9ZQU5UX0NPTlZFWF9TSEFQRV9QUk9YWVRZUEUsXHJcbiAgICBJTlZBTElEX1NIQVBFX1BST1hZVFlQRSxcclxuXHJcbiAgICBNQVhfQlJPQURQSEFTRV9DT0xMSVNJT05fVFlQRVNcclxufTtcclxuKEFtbW8gYXMgYW55KS5BbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzID0gQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcztcclxuXHJcbmV4cG9ydCBlbnVtIEFtbW9Db2xsaXNpb25GaWx0ZXJHcm91cHMge1xyXG4gICAgRGVmYXVsdEZpbHRlciA9IDEsXHJcbiAgICBTdGF0aWNGaWx0ZXIgPSAyLFxyXG4gICAgS2luZW1hdGljRmlsdGVyID0gNCxcclxuICAgIERlYnJpc0ZpbHRlciA9IDgsXHJcbiAgICBTZW5zb3JUcmlnZ2VyID0gMTYsXHJcbiAgICBDaGFyYWN0ZXJGaWx0ZXIgPSAzMixcclxuICAgIEFsbEZpbHRlciA9IC0xIC8vYWxsIGJpdHMgc2V0czogRGVmYXVsdEZpbHRlciB8IFN0YXRpY0ZpbHRlciB8IEtpbmVtYXRpY0ZpbHRlciB8IERlYnJpc0ZpbHRlciB8IFNlbnNvclRyaWdnZXJcclxufTtcclxuKEFtbW8gYXMgYW55KS5BbW1vQ29sbGlzaW9uRmlsdGVyR3JvdXBzID0gQW1tb0NvbGxpc2lvbkZpbHRlckdyb3VwcztcclxuXHJcbmV4cG9ydCBlbnVtIEFtbW9EaXNwYXRjaGVyRmxhZ3Mge1xyXG4gICAgQ0RfU1RBVElDX1NUQVRJQ19SRVBPUlRFRCA9IDEsXHJcbiAgICBDRF9VU0VfUkVMQVRJVkVfQ09OVEFDVF9CUkVBS0lOR19USFJFU0hPTEQgPSAyLFxyXG4gICAgQ0RfRElTQUJMRV9DT05UQUNUUE9PTF9EWU5BTUlDX0FMTE9DQVRJT04gPSA0XHJcbn07XHJcbihBbW1vIGFzIGFueSkuQW1tb0Rpc3BhdGNoZXJGbGFncyA9IEFtbW9EaXNwYXRjaGVyRmxhZ3M7XHJcbiJdfQ==