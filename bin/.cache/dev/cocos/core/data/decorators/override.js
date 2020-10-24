(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./property.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./property.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.property);
    global.override = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _property) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.override = void 0;

  /**
   * @category decorator
   */
  var override = function override(target, propertyKey, descriptor) {
    return (0, _property.property)({
      __noImplicit: true,
      override: true
    })(target, propertyKey, descriptor);
  };

  _exports.override = override;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL292ZXJyaWRlLnRzIl0sIm5hbWVzIjpbIm92ZXJyaWRlIiwidGFyZ2V0IiwicHJvcGVydHlLZXkiLCJkZXNjcmlwdG9yIiwiX19ub0ltcGxpY2l0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7QUFPTyxNQUFNQSxRQUFpQyxHQUFHLFNBQXBDQSxRQUFvQyxDQUFDQyxNQUFELEVBQVNDLFdBQVQsRUFBc0JDLFVBQXRCLEVBQXFDO0FBQ2xGLFdBQU8sd0JBQVM7QUFDWkMsTUFBQUEsWUFBWSxFQUFFLElBREY7QUFFWkosTUFBQUEsUUFBUSxFQUFFO0FBRkUsS0FBVCxFQUdKQyxNQUhJLEVBR0lDLFdBSEosRUFHaUJDLFVBSGpCLENBQVA7QUFJSCxHQUxNIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgZGVjb3JhdG9yXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTGVnYWN5UHJvcGVydHlEZWNvcmF0b3IgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgcHJvcGVydHkgfSBmcm9tICcuL3Byb3BlcnR5JztcclxuXHJcbmV4cG9ydCBjb25zdCBvdmVycmlkZTogTGVnYWN5UHJvcGVydHlEZWNvcmF0b3IgPSAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikgPT4ge1xyXG4gICAgcmV0dXJuIHByb3BlcnR5KHtcclxuICAgICAgICBfX25vSW1wbGljaXQ6IHRydWUsXHJcbiAgICAgICAgb3ZlcnJpZGU6IHRydWUsXHJcbiAgICB9KSh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKTtcclxufTsiXX0=