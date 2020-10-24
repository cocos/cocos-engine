(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./models/skeletal-animation-utils.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./models/skeletal-animation-utils.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.skeletalAnimationUtils);
    global.dataPoolManager = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _skeletalAnimationUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.DataPoolManager = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var DataPoolManager = /*#__PURE__*/function () {
    function DataPoolManager(device) {
      _classCallCheck(this, DataPoolManager);

      this.jointTexturePool = void 0;
      this.jointAnimationInfo = void 0;
      this.jointTexturePool = new _skeletalAnimationUtils.JointTexturePool(device);
      this.jointAnimationInfo = new _skeletalAnimationUtils.JointAnimationInfo(device);
    }

    _createClass(DataPoolManager, [{
      key: "releaseSkeleton",
      value: function releaseSkeleton(skeleton) {
        this.jointTexturePool.releaseSkeleton(skeleton);
      }
    }, {
      key: "releaseAnimationClip",
      value: function releaseAnimationClip(clip) {
        this.jointTexturePool.releaseAnimationClip(clip);
      }
    }, {
      key: "clear",
      value: function clear() {
        this.jointTexturePool.clear();
        this.jointAnimationInfo.clear();
      }
    }]);

    return DataPoolManager;
  }();

  _exports.DataPoolManager = DataPoolManager;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvZGF0YS1wb29sLW1hbmFnZXIudHMiXSwibmFtZXMiOlsiRGF0YVBvb2xNYW5hZ2VyIiwiZGV2aWNlIiwiam9pbnRUZXh0dXJlUG9vbCIsImpvaW50QW5pbWF0aW9uSW5mbyIsIkpvaW50VGV4dHVyZVBvb2wiLCJKb2ludEFuaW1hdGlvbkluZm8iLCJza2VsZXRvbiIsInJlbGVhc2VTa2VsZXRvbiIsImNsaXAiLCJyZWxlYXNlQW5pbWF0aW9uQ2xpcCIsImNsZWFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU1hQSxlO0FBSVQsNkJBQWFDLE1BQWIsRUFBZ0M7QUFBQTs7QUFBQSxXQUh6QkMsZ0JBR3lCO0FBQUEsV0FGekJDLGtCQUV5QjtBQUM1QixXQUFLRCxnQkFBTCxHQUF3QixJQUFJRSx3Q0FBSixDQUFxQkgsTUFBckIsQ0FBeEI7QUFDQSxXQUFLRSxrQkFBTCxHQUEwQixJQUFJRSwwQ0FBSixDQUF1QkosTUFBdkIsQ0FBMUI7QUFDSDs7OztzQ0FFdUJLLFEsRUFBb0I7QUFDeEMsYUFBS0osZ0JBQUwsQ0FBc0JLLGVBQXRCLENBQXNDRCxRQUF0QztBQUNIOzs7MkNBRTRCRSxJLEVBQXFCO0FBQzlDLGFBQUtOLGdCQUFMLENBQXNCTyxvQkFBdEIsQ0FBMkNELElBQTNDO0FBQ0g7Ozs4QkFFZTtBQUNaLGFBQUtOLGdCQUFMLENBQXNCUSxLQUF0QjtBQUNBLGFBQUtQLGtCQUFMLENBQXdCTyxLQUF4QjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcbmltcG9ydCB7IEFuaW1hdGlvbkNsaXAgfSBmcm9tICcuLi9hbmltYXRpb24vYW5pbWF0aW9uLWNsaXAnO1xyXG5pbXBvcnQgeyBTa2VsZXRvbiB9IGZyb20gJy4uL2Fzc2V0cyc7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4uL2dmeC9kZXZpY2UnO1xyXG5pbXBvcnQgeyBKb2ludEFuaW1hdGlvbkluZm8sIEpvaW50VGV4dHVyZVBvb2wgfSBmcm9tICcuL21vZGVscy9za2VsZXRhbC1hbmltYXRpb24tdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFQb29sTWFuYWdlciB7XHJcbiAgICBwdWJsaWMgam9pbnRUZXh0dXJlUG9vbDogSm9pbnRUZXh0dXJlUG9vbDtcclxuICAgIHB1YmxpYyBqb2ludEFuaW1hdGlvbkluZm86IEpvaW50QW5pbWF0aW9uSW5mbztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZGV2aWNlOiBHRlhEZXZpY2UpIHtcclxuICAgICAgICB0aGlzLmpvaW50VGV4dHVyZVBvb2wgPSBuZXcgSm9pbnRUZXh0dXJlUG9vbChkZXZpY2UpO1xyXG4gICAgICAgIHRoaXMuam9pbnRBbmltYXRpb25JbmZvID0gbmV3IEpvaW50QW5pbWF0aW9uSW5mbyhkZXZpY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWxlYXNlU2tlbGV0b24gKHNrZWxldG9uOiBTa2VsZXRvbikge1xyXG4gICAgICAgIHRoaXMuam9pbnRUZXh0dXJlUG9vbC5yZWxlYXNlU2tlbGV0b24oc2tlbGV0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWxlYXNlQW5pbWF0aW9uQ2xpcCAoY2xpcDogQW5pbWF0aW9uQ2xpcCkge1xyXG4gICAgICAgIHRoaXMuam9pbnRUZXh0dXJlUG9vbC5yZWxlYXNlQW5pbWF0aW9uQ2xpcChjbGlwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuam9pbnRUZXh0dXJlUG9vbC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuam9pbnRBbmltYXRpb25JbmZvLmNsZWFyKCk7XHJcbiAgICB9XHJcbn1cclxuIl19