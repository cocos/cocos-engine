(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../value-types/enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../value-types/enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._enum);
    global.types = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _enum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isLerpable = isLerpable;
  _exports.WrappedInfo = _exports.WrapMode = _exports.WrapModeMask = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var WrapModeMask;
  _exports.WrapModeMask = WrapModeMask;

  (function (WrapModeMask) {
    WrapModeMask[WrapModeMask["Default"] = 0] = "Default";
    WrapModeMask[WrapModeMask["Normal"] = 1] = "Normal";
    WrapModeMask[WrapModeMask["Loop"] = 2] = "Loop";
    WrapModeMask[WrapModeMask["ShouldWrap"] = 4] = "ShouldWrap";
    WrapModeMask[WrapModeMask["Clamp"] = 8] = "Clamp";
    WrapModeMask[WrapModeMask["PingPong"] = 22] = "PingPong";
    WrapModeMask[WrapModeMask["Reverse"] = 36] = "Reverse";
  })(WrapModeMask || (_exports.WrapModeMask = WrapModeMask = {}));

  /**
   * 动画使用的循环模式。
   */
  var WrapMode;
  _exports.WrapMode = WrapMode;

  (function (WrapMode) {
    WrapMode[WrapMode["Default"] = WrapModeMask.Default] = "Default";
    WrapMode[WrapMode["Normal"] = WrapModeMask.Normal] = "Normal";
    WrapMode[WrapMode["Reverse"] = WrapModeMask.Reverse] = "Reverse";
    WrapMode[WrapMode["Loop"] = WrapModeMask.Loop] = "Loop";
    WrapMode[WrapMode["LoopReverse"] = WrapModeMask.Loop | WrapModeMask.Reverse] = "LoopReverse";
    WrapMode[WrapMode["PingPong"] = WrapModeMask.PingPong] = "PingPong";
    WrapMode[WrapMode["PingPongReverse"] = WrapModeMask.PingPong | WrapModeMask.Reverse] = "PingPongReverse";
  })(WrapMode || (_exports.WrapMode = WrapMode = {}));

  (0, _enum.ccenum)(WrapMode);
  /**
   * For internal
   */

  var WrappedInfo = /*#__PURE__*/function () {
    function WrappedInfo(info) {
      _classCallCheck(this, WrappedInfo);

      this.ratio = 0;
      this.time = 0;
      this.direction = 1;
      this.stopped = true;
      this.iterations = 0;
      this.frameIndex = undefined;

      if (info) {
        this.set(info);
      }
    }

    _createClass(WrappedInfo, [{
      key: "set",
      value: function set(info) {
        this.ratio = info.ratio;
        this.time = info.time;
        this.direction = info.direction;
        this.stopped = info.stopped;
        this.iterations = info.iterations;
        this.frameIndex = info.frameIndex;
      }
    }]);

    return WrappedInfo;
  }();

  _exports.WrappedInfo = WrappedInfo;

  function isLerpable(object) {
    return typeof object.lerp === 'function';
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3R5cGVzLnRzIl0sIm5hbWVzIjpbIldyYXBNb2RlTWFzayIsIldyYXBNb2RlIiwiRGVmYXVsdCIsIk5vcm1hbCIsIlJldmVyc2UiLCJMb29wIiwiUGluZ1BvbmciLCJXcmFwcGVkSW5mbyIsImluZm8iLCJyYXRpbyIsInRpbWUiLCJkaXJlY3Rpb24iLCJzdG9wcGVkIiwiaXRlcmF0aW9ucyIsImZyYW1lSW5kZXgiLCJ1bmRlZmluZWQiLCJzZXQiLCJpc0xlcnBhYmxlIiwib2JqZWN0IiwibGVycCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BT1lBLFk7OzthQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtLQUFBQSxZLDZCQUFBQSxZOztBQVVaOzs7TUFHWUMsUTs7O2FBQUFBLFE7QUFBQUEsSUFBQUEsUSxDQUFBQSxRLGNBSUVELFlBQVksQ0FBQ0UsTztBQUpmRCxJQUFBQSxRLENBQUFBLFEsYUFTQ0QsWUFBWSxDQUFDRyxNO0FBVGRGLElBQUFBLFEsQ0FBQUEsUSxjQWNFRCxZQUFZLENBQUNJLE87QUFkZkgsSUFBQUEsUSxDQUFBQSxRLFdBbUJERCxZQUFZLENBQUNLLEk7QUFuQlpKLElBQUFBLFEsQ0FBQUEsUSxrQkF3Qk1ELFlBQVksQ0FBQ0ssSUFBYixHQUFvQkwsWUFBWSxDQUFDSSxPO0FBeEJ2Q0gsSUFBQUEsUSxDQUFBQSxRLGVBNkJHRCxZQUFZLENBQUNNLFE7QUE3QmhCTCxJQUFBQSxRLENBQUFBLFEsc0JBa0NVRCxZQUFZLENBQUNNLFFBQWIsR0FBd0JOLFlBQVksQ0FBQ0ksTztLQWxDL0NILFEseUJBQUFBLFE7O0FBcUNaLG9CQUFPQSxRQUFQO0FBRUE7Ozs7TUFHYU0sVztBQVFULHlCQUFhQyxJQUFiLEVBQWlDO0FBQUE7O0FBQUEsV0FQMUJDLEtBTzBCLEdBUGxCLENBT2tCO0FBQUEsV0FOMUJDLElBTTBCLEdBTm5CLENBTW1CO0FBQUEsV0FMMUJDLFNBSzBCLEdBTGQsQ0FLYztBQUFBLFdBSjFCQyxPQUkwQixHQUpoQixJQUlnQjtBQUFBLFdBSDFCQyxVQUcwQixHQUhiLENBR2E7QUFBQSxXQUYxQkMsVUFFMEIsR0FGTEMsU0FFSzs7QUFDN0IsVUFBSVAsSUFBSixFQUFVO0FBQ04sYUFBS1EsR0FBTCxDQUFTUixJQUFUO0FBQ0g7QUFDSjs7OzswQkFFV0EsSSxFQUFtQjtBQUMzQixhQUFLQyxLQUFMLEdBQWFELElBQUksQ0FBQ0MsS0FBbEI7QUFDQSxhQUFLQyxJQUFMLEdBQVlGLElBQUksQ0FBQ0UsSUFBakI7QUFDQSxhQUFLQyxTQUFMLEdBQWlCSCxJQUFJLENBQUNHLFNBQXRCO0FBQ0EsYUFBS0MsT0FBTCxHQUFlSixJQUFJLENBQUNJLE9BQXBCO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQkwsSUFBSSxDQUFDSyxVQUF2QjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JOLElBQUksQ0FBQ00sVUFBdkI7QUFDSDs7Ozs7Ozs7QUFvQkUsV0FBU0csVUFBVCxDQUFxQkMsTUFBckIsRUFBdUQ7QUFDMUQsV0FBTyxPQUFPQSxNQUFNLENBQUNDLElBQWQsS0FBdUIsVUFBOUI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogQGNhdGVnb3J5IGFuaW1hdGlvblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzL2VudW0nO1xyXG5cclxuZXhwb3J0IGVudW0gV3JhcE1vZGVNYXNrIHtcclxuICAgIERlZmF1bHQgPSAwLFxyXG4gICAgTm9ybWFsID0gMSA8PCAwLFxyXG4gICAgTG9vcCA9IDEgPDwgMSxcclxuICAgIFNob3VsZFdyYXAgPSAxIDw8IDIsXHJcbiAgICBDbGFtcCA9IDEgPDwgMyxcclxuICAgIFBpbmdQb25nID0gMSA8PCA0IHwgMSA8PCAxIHwgMSA8PCAyLCAgLy8gTG9vcCwgU2hvdWxkV3JhcFxyXG4gICAgUmV2ZXJzZSA9IDEgPDwgNSB8IDEgPDwgMiwgICAgICAvLyBTaG91bGRXcmFwXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDliqjnlLvkvb/nlKjnmoTlvqrnjq/mqKHlvI/jgIJcclxuICovXHJcbmV4cG9ydCBlbnVtIFdyYXBNb2RlIHtcclxuICAgIC8qKlxyXG4gICAgICog5ZCRIEFuaW1hdGlvbiBDb21wb25lbnQg5oiW6ICFIEFuaW1hdGlvbkNsaXAg5p+l5om+IHdyYXBNb2RlXHJcbiAgICAgKi9cclxuICAgIERlZmF1bHQgPSBXcmFwTW9kZU1hc2suRGVmYXVsdCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKqOeUu+WPquaSreaUvuS4gOmBjVxyXG4gICAgICovXHJcbiAgICBOb3JtYWwgPSBXcmFwTW9kZU1hc2suTm9ybWFsLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LuO5pyA5ZCO5LiA5bin5oiW57uT5p2f5L2N572u5byA5aeL5Y+N5ZCR5pKt5pS+77yM5Yiw56ys5LiA5bin5oiW5byA5aeL5L2N572u5YGc5q2iXHJcbiAgICAgKi9cclxuICAgIFJldmVyc2UgPSBXcmFwTW9kZU1hc2suUmV2ZXJzZSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW+queOr+aSreaUvlxyXG4gICAgICovXHJcbiAgICBMb29wID0gV3JhcE1vZGVNYXNrLkxvb3AsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlj43lkJHlvqrnjq/mkq3mlL5cclxuICAgICAqL1xyXG4gICAgTG9vcFJldmVyc2UgPSBXcmFwTW9kZU1hc2suTG9vcCB8IFdyYXBNb2RlTWFzay5SZXZlcnNlLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LuO56ys5LiA5bin5pKt5pS+5Yiw5pyA5ZCO5LiA5bin77yM54S25ZCO5Y+N5ZCR5pKt5pS+5Zue56ys5LiA5bin77yM5Yiw56ys5LiA5bin5ZCO5YaN5q2j5ZCR5pKt5pS+77yM5aaC5q2k5b6q546vXHJcbiAgICAgKi9cclxuICAgIFBpbmdQb25nID0gV3JhcE1vZGVNYXNrLlBpbmdQb25nLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LuO5pyA5ZCO5LiA5bin5byA5aeL5Y+N5ZCR5pKt5pS+77yM5YW25LuW5ZCMIFBpbmdQb25nXHJcbiAgICAgKi9cclxuICAgIFBpbmdQb25nUmV2ZXJzZSA9IFdyYXBNb2RlTWFzay5QaW5nUG9uZyB8IFdyYXBNb2RlTWFzay5SZXZlcnNlLFxyXG59XHJcblxyXG5jY2VudW0oV3JhcE1vZGUpO1xyXG5cclxuLyoqXHJcbiAqIEZvciBpbnRlcm5hbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFdyYXBwZWRJbmZvIHtcclxuICAgIHB1YmxpYyByYXRpbyA9IDA7XHJcbiAgICBwdWJsaWMgdGltZSA9IDA7XHJcbiAgICBwdWJsaWMgZGlyZWN0aW9uID0gMTtcclxuICAgIHB1YmxpYyBzdG9wcGVkID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBpdGVyYXRpb25zID0gMDtcclxuICAgIHB1YmxpYyBmcmFtZUluZGV4OiBudW1iZXIgPSB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGluZm8/OiBXcmFwcGVkSW5mbykge1xyXG4gICAgICAgIGlmIChpbmZvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGluZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IChpbmZvOiBXcmFwcGVkSW5mbykge1xyXG4gICAgICAgIHRoaXMucmF0aW8gPSBpbmZvLnJhdGlvO1xyXG4gICAgICAgIHRoaXMudGltZSA9IGluZm8udGltZTtcclxuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGluZm8uZGlyZWN0aW9uO1xyXG4gICAgICAgIHRoaXMuc3RvcHBlZCA9IGluZm8uc3RvcHBlZDtcclxuICAgICAgICB0aGlzLml0ZXJhdGlvbnMgPSBpbmZvLml0ZXJhdGlvbnM7XHJcbiAgICAgICAgdGhpcy5mcmFtZUluZGV4ID0gaW5mby5mcmFtZUluZGV4O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMZXJwYWJsZSB7XHJcbiAgICAvKipcclxuICAgICAqIOWcqOW9k+WJjeabsue6v+WAvOS4juebruagh+absue6v+WAvOS5i+mXtOaPkuWAvOOAglxyXG4gICAgICogQHBhcmFtIHRvIOebruagh+absue6v+WAvOOAglxyXG4gICAgICogQHBhcmFtIHQg5o+S5YC85q+U546H44CCXHJcbiAgICAgKiBAcGFyYW0gZHQg5b2T5YmN5puy57q/5YC85LiO55uu5qCH5puy57q/5YC855qE5pe26Ze06Ze06ZqU77yM5Y2V5L2N5Li656eS44CCXHJcbiAgICAgKiBAcmV0dXJucyDmj5LlgLznu5PmnpzjgIJcclxuICAgICAqL1xyXG4gICAgbGVycCAodG86IGFueSwgdDogbnVtYmVyLCBkdDogbnVtYmVyKTogYW55O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T55u05o6l5L2/55So5puy57q/5YC85L2c5Li66YeH5qC357uT5p6c5pe255qE57uT5p6c5YC877yM5a6D5bqU6K+l562J5ZCM5LqO5o+S5YC85q+U546H5Li6IDAg5pe255qE5o+S5YC857uT5p6c44CCXHJcbiAgICAgKiBAcmV0dXJucyDmj5LlgLzmr5TnjofkuLogMCDml7bnmoTmj5LlgLznu5PmnpzjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0Tm9MZXJwPyAoKTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNMZXJwYWJsZSAob2JqZWN0OiBhbnkpOiBvYmplY3QgaXMgSUxlcnBhYmxlIHtcclxuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0LmxlcnAgPT09ICdmdW5jdGlvbic7XHJcbn1cclxuIl19