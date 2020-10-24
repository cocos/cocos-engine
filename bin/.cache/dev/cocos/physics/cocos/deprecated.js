(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../../core/index.js", "./shapes/builtin-capsule-shape.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../../core/index.js"), require("./shapes/builtin-capsule-shape.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.index, global.builtinCapsuleShape);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_index, _builtinCapsuleShape) {
  "use strict";

  /**
   * @hidden
   */
  (0, _index.removeProperty)(_builtinCapsuleShape.BuiltinCapsuleShape.prototype, 'shape.prototype', [{
    'name': 'setHeight',
    'suggest': 'You should use the interface provided by the component.'
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3MvZGVwcmVjYXRlZC50cyJdLCJuYW1lcyI6WyJCdWlsdGluQ2Fwc3VsZVNoYXBlIiwicHJvdG90eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBT0EsNkJBQWVBLHlDQUFvQkMsU0FBbkMsRUFBOEMsaUJBQTlDLEVBQWlFLENBQzdEO0FBQ0ksWUFBUSxXQURaO0FBRUksZUFBVztBQUZmLEdBRDZELENBQWpFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyByZW1vdmVQcm9wZXJ0eSB9IGZyb20gXCIuLi8uLi9jb3JlXCI7XHJcbmltcG9ydCB7IEJ1aWx0aW5DYXBzdWxlU2hhcGUgfSBmcm9tIFwiLi9zaGFwZXMvYnVpbHRpbi1jYXBzdWxlLXNoYXBlXCI7XHJcblxyXG5yZW1vdmVQcm9wZXJ0eShCdWlsdGluQ2Fwc3VsZVNoYXBlLnByb3RvdHlwZSwgJ3NoYXBlLnByb3RvdHlwZScsIFtcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdzZXRIZWlnaHQnLFxyXG4gICAgICAgICdzdWdnZXN0JzogJ1lvdSBzaG91bGQgdXNlIHRoZSBpbnRlcmZhY2UgcHJvdmlkZWQgYnkgdGhlIGNvbXBvbmVudC4nXHJcbiAgICB9XHJcbl0pIl19