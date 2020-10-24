(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../../utils/index.js", "./event-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../../utils/index.js"), require("./event-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.index, global.eventEnum);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_index, _eventEnum) {
  "use strict";

  /**
   * @hidden
   */
  (0, _index.replaceProperty)(_eventEnum.SystemEventType, 'Node.EventType', [{
    name: 'POSITION_PART',
    newName: 'TRANSFORM_CHANGED'
  }, {
    name: 'ROTATION_PART',
    newName: 'TRANSFORM_CHANGED'
  }, {
    name: 'SCALE_PART',
    newName: 'TRANSFORM_CHANGED'
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9kZXByZWNhdGVkLnRzIl0sIm5hbWVzIjpbIlN5c3RlbUV2ZW50VHlwZSIsIm5hbWUiLCJuZXdOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBT0EsOEJBQWdCQSwwQkFBaEIsRUFBaUMsZ0JBQWpDLEVBQW1ELENBQy9DO0FBQ0lDLElBQUFBLElBQUksRUFBRSxlQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRTtBQUZiLEdBRCtDLEVBSy9DO0FBQ0lELElBQUFBLElBQUksRUFBRSxlQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRTtBQUZiLEdBTCtDLEVBUy9DO0FBQ0lELElBQUFBLElBQUksRUFBRSxZQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRTtBQUZiLEdBVCtDLENBQW5EIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyByZXBsYWNlUHJvcGVydHkgfSBmcm9tICcuLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IFN5c3RlbUV2ZW50VHlwZSB9IGZyb20gJy4vZXZlbnQtZW51bSc7XHJcblxyXG5yZXBsYWNlUHJvcGVydHkoU3lzdGVtRXZlbnRUeXBlLCAnTm9kZS5FdmVudFR5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ1BPU0lUSU9OX1BBUlQnLFxyXG4gICAgICAgIG5ld05hbWU6ICdUUkFOU0ZPUk1fQ0hBTkdFRCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdST1RBVElPTl9QQVJUJyxcclxuICAgICAgICBuZXdOYW1lOiAnVFJBTlNGT1JNX0NIQU5HRUQnLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnU0NBTEVfUEFSVCcsXHJcbiAgICAgICAgbmV3TmFtZTogJ1RSQU5TRk9STV9DSEFOR0VEJyxcclxuICAgIH0sXHJcbl0pO1xyXG4iXX0=