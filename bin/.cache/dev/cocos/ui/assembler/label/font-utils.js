(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.fontUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CanvasPool = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @hidden
   */
  var CanvasPool = /*#__PURE__*/function () {
    function CanvasPool() {
      _classCallCheck(this, CanvasPool);

      this.pool = [];
    }

    _createClass(CanvasPool, [{
      key: "get",
      value: function get() {
        var data = this.pool.pop();

        if (!data) {
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          data = {
            canvas: canvas,
            context: context
          };
        }

        return data;
      }
    }, {
      key: "put",
      value: function put(canvas) {
        if (this.pool.length >= 32) {
          return;
        }

        this.pool.push(canvas);
      }
    }]);

    return CanvasPool;
  }(); // export function packToDynamicAtlas(comp, frame) {
  //     // TODO: Material API design and export from editor could affect the material activation process
  //     // need to update the logic here
  //     if (frame && !TEST) {
  //         if (!frame._original && dynamicAtlasManager) {
  //             let packedFrame = dynamicAtlasManager.insertSpriteFrame(frame);
  //             if (packedFrame) {
  //                 frame._setDynamicAtlasFrame(packedFrame);
  //             }
  //         }
  //         if (comp.sharedMaterials[0].getProperty('texture') !== frame._texture) {
  //             comp._activateMaterial();
  //         }
  //     }
  // }


  _exports.CanvasPool = CanvasPool;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9sYWJlbC9mb250LXV0aWxzLnRzIl0sIm5hbWVzIjpbIkNhbnZhc1Bvb2wiLCJwb29sIiwiZGF0YSIsInBvcCIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwibGVuZ3RoIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O01BU2FBLFU7Ozs7V0FDRkMsSSxHQUEyQixFOzs7Ozs0QkFDcEI7QUFDVixZQUFJQyxJQUFJLEdBQUcsS0FBS0QsSUFBTCxDQUFVRSxHQUFWLEVBQVg7O0FBRUEsWUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDUCxjQUFNRSxNQUFNLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQUFmO0FBQ0EsY0FBTUMsT0FBTyxHQUFHSCxNQUFNLENBQUNJLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBaEI7QUFDQU4sVUFBQUEsSUFBSSxHQUFHO0FBQ0hFLFlBQUFBLE1BQU0sRUFBTkEsTUFERztBQUVIRyxZQUFBQSxPQUFPLEVBQVBBO0FBRkcsV0FBUDtBQUlIOztBQUVELGVBQU9MLElBQVA7QUFDSDs7OzBCQUVXRSxNLEVBQTBCO0FBQ2xDLFlBQUksS0FBS0gsSUFBTCxDQUFVUSxNQUFWLElBQW9CLEVBQXhCLEVBQTRCO0FBQ3hCO0FBQ0g7O0FBQ0QsYUFBS1IsSUFBTCxDQUFVUyxJQUFWLENBQWVOLE1BQWY7QUFDSDs7OztPQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2hhcmVkTGFiZWxEYXRhIHtcclxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FudmFzUG9vbCB7XHJcbiAgICBwdWJsaWMgcG9vbDogSVNoYXJlZExhYmVsRGF0YVtdID0gW107XHJcbiAgICBwdWJsaWMgZ2V0ICgpIHtcclxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMucG9vbC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBjYW52YXMsXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHB1dCAoY2FudmFzOiBJU2hhcmVkTGFiZWxEYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9vbC5sZW5ndGggPj0gMzIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvb2wucHVzaChjYW52YXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBleHBvcnQgZnVuY3Rpb24gcGFja1RvRHluYW1pY0F0bGFzKGNvbXAsIGZyYW1lKSB7XHJcbi8vICAgICAvLyBUT0RPOiBNYXRlcmlhbCBBUEkgZGVzaWduIGFuZCBleHBvcnQgZnJvbSBlZGl0b3IgY291bGQgYWZmZWN0IHRoZSBtYXRlcmlhbCBhY3RpdmF0aW9uIHByb2Nlc3NcclxuLy8gICAgIC8vIG5lZWQgdG8gdXBkYXRlIHRoZSBsb2dpYyBoZXJlXHJcbi8vICAgICBpZiAoZnJhbWUgJiYgIVRFU1QpIHtcclxuLy8gICAgICAgICBpZiAoIWZyYW1lLl9vcmlnaW5hbCAmJiBkeW5hbWljQXRsYXNNYW5hZ2VyKSB7XHJcbi8vICAgICAgICAgICAgIGxldCBwYWNrZWRGcmFtZSA9IGR5bmFtaWNBdGxhc01hbmFnZXIuaW5zZXJ0U3ByaXRlRnJhbWUoZnJhbWUpO1xyXG4vLyAgICAgICAgICAgICBpZiAocGFja2VkRnJhbWUpIHtcclxuLy8gICAgICAgICAgICAgICAgIGZyYW1lLl9zZXREeW5hbWljQXRsYXNGcmFtZShwYWNrZWRGcmFtZSk7XHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgaWYgKGNvbXAuc2hhcmVkTWF0ZXJpYWxzWzBdLmdldFByb3BlcnR5KCd0ZXh0dXJlJykgIT09IGZyYW1lLl90ZXh0dXJlKSB7XHJcbi8vICAgICAgICAgICAgIGNvbXAuX2FjdGl2YXRlTWF0ZXJpYWwoKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vIH1cclxuIl19