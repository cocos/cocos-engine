(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./property.js", "../utils/attribute.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./property.js"), require("../utils/attribute.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.property, global.attribute);
    global.type = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _property, _attribute) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.type = type;
  _exports.string = _exports.boolean = _exports.float = _exports.integer = void 0;

  /**
   * @category decorator
   */

  /**
   * @en Declare the property as integer
   * @zh 将该属性标记为整数。
   */
  var integer = type(_attribute.CCInteger);
  /**
   * @en Declare the property as float
   * @zh 将该属性标记为浮点数。
   */

  _exports.integer = integer;

  var _float = type(_attribute.CCFloat);
  /**
   * @en Declare the property as boolean
   * @zh 将该属性标记为布尔值。
   */


  _exports.float = _float;

  var _boolean = type(_attribute.CCBoolean);
  /**
   * @en Declare the property as string
   * @zh 将该属性标记为字符串。
   */


  _exports.boolean = _boolean;
  var string = type(_attribute.CCString);
  /**
   * @en Declare the property as the given type
   * @zh 标记该属性的类型。
   * @param type
   */

  _exports.string = string;

  function type(type) {
    return (0, _property.property)({
      type: type
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL3R5cGUudHMiXSwibmFtZXMiOlsiaW50ZWdlciIsInR5cGUiLCJDQ0ludGVnZXIiLCJmbG9hdCIsIkNDRmxvYXQiLCJib29sZWFuIiwiQ0NCb29sZWFuIiwic3RyaW5nIiwiQ0NTdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBUUE7Ozs7QUFJTyxNQUFNQSxPQUFPLEdBQUdDLElBQUksQ0FBQ0Msb0JBQUQsQ0FBcEI7QUFFUDs7Ozs7OztBQUlPLE1BQU1DLE1BQUssR0FBR0YsSUFBSSxDQUFDRyxrQkFBRCxDQUFsQjtBQUVQOzs7Ozs7OztBQUlPLE1BQU1DLFFBQU8sR0FBR0osSUFBSSxDQUFDSyxvQkFBRCxDQUFwQjtBQUVQOzs7Ozs7O0FBSU8sTUFBTUMsTUFBTSxHQUFHTixJQUFJLENBQUNPLG1CQUFELENBQW5CO0FBRVA7Ozs7Ozs7O0FBU08sV0FBU1AsSUFBVCxDQUFrQkEsSUFBbEIsRUFBZ0g7QUFDbkgsV0FBTyx3QkFBUztBQUNaQSxNQUFBQSxJQUFJLEVBQUpBO0FBRFksS0FBVCxDQUFQO0FBR0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGRlY29yYXRvclxyXG4gKi9cclxuXHJcbmltcG9ydCB7IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IHByb3BlcnR5IH0gZnJvbSAnLi9wcm9wZXJ0eSc7XHJcbmltcG9ydCB7IENDU3RyaW5nLCBDQ0ludGVnZXIsIENDRmxvYXQsIENDQm9vbGVhbiwgUHJpbWl0aXZlVHlwZSB9IGZyb20gJy4uL3V0aWxzL2F0dHJpYnV0ZSc7XHJcblxyXG4vKipcclxuICogQGVuIERlY2xhcmUgdGhlIHByb3BlcnR5IGFzIGludGVnZXJcclxuICogQHpoIOWwhuivpeWxnuaAp+agh+iusOS4uuaVtOaVsOOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGludGVnZXIgPSB0eXBlKENDSW50ZWdlcik7XHJcblxyXG4vKipcclxuICogQGVuIERlY2xhcmUgdGhlIHByb3BlcnR5IGFzIGZsb2F0XHJcbiAqIEB6aCDlsIbor6XlsZ7mgKfmoIforrDkuLrmta7ngrnmlbDjgIJcclxuICovXHJcbmV4cG9ydCBjb25zdCBmbG9hdCA9IHR5cGUoQ0NGbG9hdCk7XHJcblxyXG4vKipcclxuICogQGVuIERlY2xhcmUgdGhlIHByb3BlcnR5IGFzIGJvb2xlYW5cclxuICogQHpoIOWwhuivpeWxnuaAp+agh+iusOS4uuW4g+WwlOWAvOOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGJvb2xlYW4gPSB0eXBlKENDQm9vbGVhbik7XHJcblxyXG4vKipcclxuICogQGVuIERlY2xhcmUgdGhlIHByb3BlcnR5IGFzIHN0cmluZ1xyXG4gKiBAemgg5bCG6K+l5bGe5oCn5qCH6K6w5Li65a2X56ym5Liy44CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgc3RyaW5nID0gdHlwZShDQ1N0cmluZyk7XHJcblxyXG4vKipcclxuICogQGVuIERlY2xhcmUgdGhlIHByb3BlcnR5IGFzIHRoZSBnaXZlbiB0eXBlXHJcbiAqIEB6aCDmoIforrDor6XlsZ7mgKfnmoTnsbvlnovjgIJcclxuICogQHBhcmFtIHR5cGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0eXBlICh0eXBlOiBGdW5jdGlvbiB8IFtGdW5jdGlvbl0gfCBhbnkpOiBQcm9wZXJ0eURlY29yYXRvcjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0eXBlPFQ+ICh0eXBlOiBQcmltaXRpdmVUeXBlPFQ+IHwgW1ByaW1pdGl2ZVR5cGU8VD5dKTogUHJvcGVydHlEZWNvcmF0b3I7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdHlwZTxUPiAodHlwZTogUHJpbWl0aXZlVHlwZTxUPiB8IEZ1bmN0aW9uIHwgW1ByaW1pdGl2ZVR5cGU8VD5dIHwgW0Z1bmN0aW9uXSk6IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yIHtcclxuICAgIHJldHVybiBwcm9wZXJ0eSh7XHJcbiAgICAgICAgdHlwZSxcclxuICAgIH0pO1xyXG59Il19