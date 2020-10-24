(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../framework/physics-selector.js", "./builtin-world.js", "./builtin-rigid-body.js", "./shapes/builtin-box-shape.js", "./shapes/builtin-sphere-shape.js", "./shapes/builtin-capsule-shape.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../framework/physics-selector.js"), require("./builtin-world.js"), require("./builtin-rigid-body.js"), require("./shapes/builtin-box-shape.js"), require("./shapes/builtin-sphere-shape.js"), require("./shapes/builtin-capsule-shape.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.physicsSelector, global.builtinWorld, global.builtinRigidBody, global.builtinBoxShape, global.builtinSphereShape, global.builtinCapsuleShape, global.deprecated);
    global.instantiate = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_physicsSelector, _builtinWorld, _builtinRigidBody, _builtinBoxShape, _builtinSphereShape, _builtinCapsuleShape, _deprecated) {
  "use strict";

  /**
   * @hidden
   */
  (0, _physicsSelector.select)('builtin', {
    RigidBody: _builtinRigidBody.BuiltinRigidBody,
    BoxShape: _builtinBoxShape.BuiltinBoxShape,
    SphereShape: _builtinSphereShape.BuiltinSphereShape,
    PhysicsWorld: _builtinWorld.BuiltInWorld,
    CapsuleShape: _builtinCapsuleShape.BuiltinCapsuleShape
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3MvaW5zdGFudGlhdGUudHMiXSwibmFtZXMiOlsiUmlnaWRCb2R5IiwiQnVpbHRpblJpZ2lkQm9keSIsIkJveFNoYXBlIiwiQnVpbHRpbkJveFNoYXBlIiwiU3BoZXJlU2hhcGUiLCJCdWlsdGluU3BoZXJlU2hhcGUiLCJQaHlzaWNzV29ybGQiLCJCdWlsdEluV29ybGQiLCJDYXBzdWxlU2hhcGUiLCJCdWlsdGluQ2Fwc3VsZVNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBV0EsK0JBQU8sU0FBUCxFQUFrQjtBQUNkQSxJQUFBQSxTQUFTLEVBQUVDLGtDQURHO0FBRWRDLElBQUFBLFFBQVEsRUFBRUMsZ0NBRkk7QUFHZEMsSUFBQUEsV0FBVyxFQUFFQyxzQ0FIQztBQUlkQyxJQUFBQSxZQUFZLEVBQUVDLDBCQUpBO0FBS2RDLElBQUFBLFlBQVksRUFBRUM7QUFMQSxHQUFsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnLi4vZnJhbWV3b3JrL3BoeXNpY3Mtc2VsZWN0b3InO1xyXG5pbXBvcnQgeyBCdWlsdEluV29ybGQgfSBmcm9tICcuL2J1aWx0aW4td29ybGQnO1xyXG5pbXBvcnQgeyBCdWlsdGluUmlnaWRCb2R5IH0gZnJvbSAnLi9idWlsdGluLXJpZ2lkLWJvZHknO1xyXG5pbXBvcnQgeyBCdWlsdGluQm94U2hhcGUgfSBmcm9tICcuL3NoYXBlcy9idWlsdGluLWJveC1zaGFwZSc7XHJcbmltcG9ydCB7IEJ1aWx0aW5TcGhlcmVTaGFwZSB9IGZyb20gJy4vc2hhcGVzL2J1aWx0aW4tc3BoZXJlLXNoYXBlJztcclxuaW1wb3J0IHsgQnVpbHRpbkNhcHN1bGVTaGFwZSB9IGZyb20gJy4vc2hhcGVzL2J1aWx0aW4tY2Fwc3VsZS1zaGFwZSc7XHJcblxyXG5zZWxlY3QoJ2J1aWx0aW4nLCB7XHJcbiAgICBSaWdpZEJvZHk6IEJ1aWx0aW5SaWdpZEJvZHksXHJcbiAgICBCb3hTaGFwZTogQnVpbHRpbkJveFNoYXBlLFxyXG4gICAgU3BoZXJlU2hhcGU6IEJ1aWx0aW5TcGhlcmVTaGFwZSxcclxuICAgIFBoeXNpY3NXb3JsZDogQnVpbHRJbldvcmxkLFxyXG4gICAgQ2Fwc3VsZVNoYXBlOiBCdWlsdGluQ2Fwc3VsZVNoYXBlXHJcbn0pO1xyXG5cclxuaW1wb3J0ICcuL2RlcHJlY2F0ZWQnOyJdfQ==