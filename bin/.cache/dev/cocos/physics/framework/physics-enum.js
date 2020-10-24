(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.physicsEnum = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.EConstraintType = _exports.EColliderType = _exports.ESimplexType = _exports.EAxisDirection = _exports.ERigidBodyType = void 0;

  /**
   * @category physics
   */
  var ERigidBodyType;
  _exports.ERigidBodyType = ERigidBodyType;

  (function (ERigidBodyType) {
    ERigidBodyType[ERigidBodyType["DYNAMIC"] = 1] = "DYNAMIC";
    ERigidBodyType[ERigidBodyType["STATIC"] = 2] = "STATIC";
    ERigidBodyType[ERigidBodyType["KINEMATIC"] = 4] = "KINEMATIC";
  })(ERigidBodyType || (_exports.ERigidBodyType = ERigidBodyType = {}));

  var EAxisDirection;
  _exports.EAxisDirection = EAxisDirection;

  (function (EAxisDirection) {
    EAxisDirection[EAxisDirection["X_AXIS"] = 0] = "X_AXIS";
    EAxisDirection[EAxisDirection["Y_AXIS"] = 1] = "Y_AXIS";
    EAxisDirection[EAxisDirection["Z_AXIS"] = 2] = "Z_AXIS";
  })(EAxisDirection || (_exports.EAxisDirection = EAxisDirection = {}));

  (0, _index.Enum)(EAxisDirection);
  var ESimplexType;
  _exports.ESimplexType = ESimplexType;

  (function (ESimplexType) {
    ESimplexType[ESimplexType["VERTEX"] = 1] = "VERTEX";
    ESimplexType[ESimplexType["LINE"] = 2] = "LINE";
    ESimplexType[ESimplexType["TRIANGLE"] = 3] = "TRIANGLE";
    ESimplexType[ESimplexType["TETRAHEDRON"] = 4] = "TETRAHEDRON";
  })(ESimplexType || (_exports.ESimplexType = ESimplexType = {}));

  (0, _index.Enum)(ESimplexType);
  var EColliderType;
  _exports.EColliderType = EColliderType;

  (function (EColliderType) {
    EColliderType[EColliderType["BOX"] = 0] = "BOX";
    EColliderType[EColliderType["SPHERE"] = 1] = "SPHERE";
    EColliderType[EColliderType["CAPSULE"] = 2] = "CAPSULE";
    EColliderType[EColliderType["CYLINDER"] = 3] = "CYLINDER";
    EColliderType[EColliderType["CONE"] = 4] = "CONE";
    EColliderType[EColliderType["MESH"] = 5] = "MESH";
    EColliderType[EColliderType["PLANE"] = 6] = "PLANE";
    EColliderType[EColliderType["SIMPLEX"] = 7] = "SIMPLEX";
    EColliderType[EColliderType["TERRAIN"] = 8] = "TERRAIN";
  })(EColliderType || (_exports.EColliderType = EColliderType = {}));

  (0, _index.Enum)(EColliderType);
  var EConstraintType;
  _exports.EConstraintType = EConstraintType;

  (function (EConstraintType) {
    EConstraintType[EConstraintType["POINT_TO_POINT"] = 0] = "POINT_TO_POINT";
    EConstraintType[EConstraintType["HINGE"] = 1] = "HINGE";
    EConstraintType[EConstraintType["CONE_TWIST"] = 2] = "CONE_TWIST";
  })(EConstraintType || (_exports.EConstraintType = EConstraintType = {}));

  (0, _index.Enum)(EConstraintType);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL3BoeXNpY3MtZW51bS50cyJdLCJuYW1lcyI6WyJFUmlnaWRCb2R5VHlwZSIsIkVBeGlzRGlyZWN0aW9uIiwiRVNpbXBsZXhUeXBlIiwiRUNvbGxpZGVyVHlwZSIsIkVDb25zdHJhaW50VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O01BTVlBLGM7OzthQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0tBQUFBLGMsK0JBQUFBLGM7O01BTUFDLGM7OzthQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0tBQUFBLGMsK0JBQUFBLGM7O0FBS1osbUJBQUtBLGNBQUw7TUFFWUMsWTs7O2FBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0tBQUFBLFksNkJBQUFBLFk7O0FBTVosbUJBQUtBLFlBQUw7TUFFWUMsYTs7O2FBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7S0FBQUEsYSw4QkFBQUEsYTs7QUFXWixtQkFBS0EsYUFBTDtNQUVZQyxlOzs7YUFBQUEsZTtBQUFBQSxJQUFBQSxlLENBQUFBLGU7QUFBQUEsSUFBQUEsZSxDQUFBQSxlO0FBQUFBLElBQUFBLGUsQ0FBQUEsZTtLQUFBQSxlLGdDQUFBQSxlOztBQUtaLG1CQUFLQSxlQUFMIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRW51bSB9IGZyb20gXCIuLi8uLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgZW51bSBFUmlnaWRCb2R5VHlwZSB7XHJcbiAgICBEWU5BTUlDID0gMSxcclxuICAgIFNUQVRJQyA9IDIsXHJcbiAgICBLSU5FTUFUSUMgPSA0LFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBFQXhpc0RpcmVjdGlvbiB7XHJcbiAgICBYX0FYSVMsXHJcbiAgICBZX0FYSVMsXHJcbiAgICBaX0FYSVMsXHJcbn1cclxuRW51bShFQXhpc0RpcmVjdGlvbik7XHJcblxyXG5leHBvcnQgZW51bSBFU2ltcGxleFR5cGUge1xyXG4gICAgVkVSVEVYID0gMSxcclxuICAgIExJTkUgPSAyLFxyXG4gICAgVFJJQU5HTEUgPSAzLFxyXG4gICAgVEVUUkFIRURST04gPSA0LFxyXG59XHJcbkVudW0oRVNpbXBsZXhUeXBlKTtcclxuXHJcbmV4cG9ydCBlbnVtIEVDb2xsaWRlclR5cGUge1xyXG4gICAgQk9YLFxyXG4gICAgU1BIRVJFLFxyXG4gICAgQ0FQU1VMRSxcclxuICAgIENZTElOREVSLFxyXG4gICAgQ09ORSxcclxuICAgIE1FU0gsXHJcbiAgICBQTEFORSxcclxuICAgIFNJTVBMRVgsXHJcbiAgICBURVJSQUlOLFxyXG59XHJcbkVudW0oRUNvbGxpZGVyVHlwZSk7XHJcblxyXG5leHBvcnQgZW51bSBFQ29uc3RyYWludFR5cGUge1xyXG4gICAgUE9JTlRfVE9fUE9JTlQsXHJcbiAgICBISU5HRSxcclxuICAgIENPTkVfVFdJU1RcclxufVxyXG5FbnVtKEVDb25zdHJhaW50VHlwZSk7XHJcbiJdfQ==