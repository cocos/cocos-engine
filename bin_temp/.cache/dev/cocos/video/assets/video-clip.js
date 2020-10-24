(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/index.js", "../../core/data/decorators/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/index.js"), require("../../core/data/decorators/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index);
    global.videoClip = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.VideoClip = void 0;

  var _dec, _class, _class2, _descriptor, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * The video clip asset.
   * @zh
   * 视频片段资源。
   */
  var VideoClip = (_dec = (0, _index2.ccclass)('cc.VideoClip'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(VideoClip, _Asset);

    function VideoClip() {
      var _this;

      _classCallCheck(this, VideoClip);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(VideoClip).call(this));

      _initializerDefineProperty(_this, "_duration", _descriptor, _assertThisInitialized(_this));

      _this._video = null;
      _this.loaded = false;
      return _this;
    }

    _createClass(VideoClip, [{
      key: "_nativeAsset",
      set: function set(clip) {
        this._video = clip;

        if (clip) {
          this._duration = clip.duration;
          this.loaded = true;
        } else {
          this._duration = 0;
          this.loaded = false;
        }
      },
      get: function get() {
        return this._video;
      }
    }]);

    return VideoClip;
  }(_index.Asset), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_duration", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class);
  _exports.VideoClip = VideoClip;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3ZpZGVvL2Fzc2V0cy92aWRlby1jbGlwLnRzIl0sIm5hbWVzIjpbIlZpZGVvQ2xpcCIsIl92aWRlbyIsImxvYWRlZCIsImNsaXAiLCJfZHVyYXRpb24iLCJkdXJhdGlvbiIsIkFzc2V0Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0NBOzs7Ozs7TUFPYUEsUyxXQURaLHFCQUFRLGNBQVIsQzs7O0FBT0cseUJBQWU7QUFBQTs7QUFBQTs7QUFDWDs7QUFEVzs7QUFBQSxZQUZMQyxNQUVLLEdBRlMsSUFFVDtBQUVYLFlBQUtDLE1BQUwsR0FBYyxLQUFkO0FBRlc7QUFHZDs7Ozt3QkFFaUJDLEksRUFBVztBQUN6QixhQUFLRixNQUFMLEdBQWNFLElBQWQ7O0FBQ0EsWUFBSUEsSUFBSixFQUFVO0FBQ04sZUFBS0MsU0FBTCxHQUFpQkQsSUFBSSxDQUFDRSxRQUF0QjtBQUNBLGVBQUtILE1BQUwsR0FBYyxJQUFkO0FBQ0gsU0FIRCxNQUdPO0FBQ0gsZUFBS0UsU0FBTCxHQUFpQixDQUFqQjtBQUNBLGVBQUtGLE1BQUwsR0FBYyxLQUFkO0FBQ0g7QUFDSixPOzBCQUVtQjtBQUNoQixlQUFPLEtBQUtELE1BQVo7QUFDSDs7OztJQXhCMEJLLFkscUZBRTFCQyxvQjs7Ozs7YUFDcUIsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvbXBvbmVudC9hdWRpb1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnLi4vLi4vY29yZS9hc3NldHMnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgdmlkZW8gY2xpcCBhc3NldC5cclxuICogQHpoXHJcbiAqIOinhumikeeJh+autei1hOa6kOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlZpZGVvQ2xpcCcpXHJcbmV4cG9ydCBjbGFzcyBWaWRlb0NsaXAgZXh0ZW5kcyBBc3NldCB7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9kdXJhdGlvbiA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX3ZpZGVvOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IF9uYXRpdmVBc3NldCAoY2xpcDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fdmlkZW8gPSBjbGlwO1xyXG4gICAgICAgIGlmIChjbGlwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2R1cmF0aW9uID0gY2xpcC5kdXJhdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2R1cmF0aW9uID0gMDtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IF9uYXRpdmVBc3NldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZGVvO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==