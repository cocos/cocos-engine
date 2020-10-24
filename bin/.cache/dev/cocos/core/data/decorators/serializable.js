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
    global.serializable = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _property) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.formerlySerializedAs = formerlySerializedAs;
  _exports.editorOnly = _exports.serializable = void 0;

  /**
   * @category decorator
   */
  var serializable = function serializable(target, propertyKey, descriptor) {
    return (0, _property.property)(makeSerializable({}))(target, propertyKey, descriptor);
  };

  _exports.serializable = serializable;

  function formerlySerializedAs(name) {
    return (0, _property.property)(makeSerializable({
      formerlySerializedAs: name
    }));
  }
  /**
   * @en
   * Marks the property as editor only.
   * @zh
   * 设置该属性仅在编辑器中生效。
   */


  var editorOnly = function editorOnly(target, propertyKey, descriptor) {
    return (0, _property.property)({
      editorOnly: true
    })(target, propertyKey, descriptor);
  };

  _exports.editorOnly = editorOnly;

  function makeSerializable(options) {
    options.__noImplicit = true;

    if (!('serializable' in options)) {
      options.serializable = true;
    }

    return options;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL3NlcmlhbGl6YWJsZS50cyJdLCJuYW1lcyI6WyJzZXJpYWxpemFibGUiLCJ0YXJnZXQiLCJwcm9wZXJ0eUtleSIsImRlc2NyaXB0b3IiLCJtYWtlU2VyaWFsaXphYmxlIiwiZm9ybWVybHlTZXJpYWxpemVkQXMiLCJuYW1lIiwiZWRpdG9yT25seSIsIm9wdGlvbnMiLCJfX25vSW1wbGljaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFPTyxNQUFNQSxZQUFxQyxHQUFHLFNBQXhDQSxZQUF3QyxDQUFDQyxNQUFELEVBQVNDLFdBQVQsRUFBc0JDLFVBQXRCLEVBQXFDO0FBQ3RGLFdBQU8sd0JBQVNDLGdCQUFnQixDQUFDLEVBQUQsQ0FBekIsRUFBZ0NILE1BQWhDLEVBQXdDQyxXQUF4QyxFQUFxREMsVUFBckQsQ0FBUDtBQUNILEdBRk07Ozs7QUFJQSxXQUFTRSxvQkFBVCxDQUErQkMsSUFBL0IsRUFBc0U7QUFDekUsV0FBTyx3QkFBU0YsZ0JBQWdCLENBQUM7QUFDN0JDLE1BQUFBLG9CQUFvQixFQUFFQztBQURPLEtBQUQsQ0FBekIsQ0FBUDtBQUdIO0FBRUQ7Ozs7Ozs7O0FBTU8sTUFBTUMsVUFBbUMsR0FBRyxTQUF0Q0EsVUFBc0MsQ0FBQ04sTUFBRCxFQUFTQyxXQUFULEVBQXNCQyxVQUF0QixFQUFxQztBQUNwRixXQUFPLHdCQUFTO0FBQ1pJLE1BQUFBLFVBQVUsRUFBRTtBQURBLEtBQVQsRUFFSk4sTUFGSSxFQUVJQyxXQUZKLEVBRWlCQyxVQUZqQixDQUFQO0FBR0gsR0FKTTs7OztBQU1QLFdBQVNDLGdCQUFULENBQTJCSSxPQUEzQixFQUFzRDtBQUNsREEsSUFBQUEsT0FBTyxDQUFDQyxZQUFSLEdBQXVCLElBQXZCOztBQUNBLFFBQUksRUFBRSxrQkFBa0JELE9BQXBCLENBQUosRUFBa0M7QUFDOUJBLE1BQUFBLE9BQU8sQ0FBQ1IsWUFBUixHQUF1QixJQUF2QjtBQUNIOztBQUNELFdBQU9RLE9BQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZGVjb3JhdG9yXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTGVnYWN5UHJvcGVydHlEZWNvcmF0b3IgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgcHJvcGVydHksIElQcm9wZXJ0eU9wdGlvbnMgfSBmcm9tICcuL3Byb3BlcnR5JztcclxuXHJcbmV4cG9ydCBjb25zdCBzZXJpYWxpemFibGU6IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yID0gKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpID0+IHtcclxuICAgIHJldHVybiBwcm9wZXJ0eShtYWtlU2VyaWFsaXphYmxlKHsgfSkpKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1lcmx5U2VyaWFsaXplZEFzIChuYW1lOiBzdHJpbmcpOiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvciB7XHJcbiAgICByZXR1cm4gcHJvcGVydHkobWFrZVNlcmlhbGl6YWJsZSh7XHJcbiAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6IG5hbWUsXHJcbiAgICB9KSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTWFya3MgdGhlIHByb3BlcnR5IGFzIGVkaXRvciBvbmx5LlxyXG4gKiBAemhcclxuICog6K6+572u6K+l5bGe5oCn5LuF5Zyo57yW6L6R5Zmo5Lit55Sf5pWI44CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZWRpdG9yT25seTogTGVnYWN5UHJvcGVydHlEZWNvcmF0b3IgPSAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikgPT4ge1xyXG4gICAgcmV0dXJuIHByb3BlcnR5KHtcclxuICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxyXG4gICAgfSkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcik7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBtYWtlU2VyaWFsaXphYmxlIChvcHRpb25zOiBJUHJvcGVydHlPcHRpb25zKSB7XHJcbiAgICBvcHRpb25zLl9fbm9JbXBsaWNpdCA9IHRydWU7XHJcbiAgICBpZiAoISgnc2VyaWFsaXphYmxlJyBpbiBvcHRpb25zKSkge1xyXG4gICAgICAgIG9wdGlvbnMuc2VyaWFsaXphYmxlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG59XHJcbiJdfQ==