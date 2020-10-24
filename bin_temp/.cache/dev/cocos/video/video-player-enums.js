(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/value-types/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/value-types/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.videoPlayerEnums = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.READY_STATE = _exports.EventType = _exports.ResourceType = void 0;

  /*
   Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.
  
   http://www.cocos.com
  
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated engine source code (the "Software"), a limited,
    worldwide, royalty-free, non-assignable, revocable and non-exclusive license
   to use Cocos Creator solely to develop games on your target platforms. You shall
    not use Cocos Creator software for developing other software or tools that's
    used for developing games. You are not granted to publish, distribute,
    sublicense, and/or sell copies of Cocos Creator.
  
   The software or tools in this License Agreement are licensed, not sold.
   Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
  
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
   */

  /**
   * @category component/videoplayer
   */

  /**
   * @en Enum for video resource type.
   * @zh 视频来源
   */
  var ResourceType = (0, _index.Enum)({
    /**
     * @en
     * The remote resource type.
     * @zh
     * 远程视频
     */
    REMOTE: 0,

    /**
     * @en
     * The local resource type.
     * @zh
     * 本地视频
     */
    LOCAL: 1
  });
  _exports.ResourceType = ResourceType;
  var EventType;
  _exports.EventType = EventType;

  (function (EventType) {
    EventType[EventType["NONE"] = 0] = "NONE";
    EventType[EventType["PLAYING"] = 1] = "PLAYING";
    EventType[EventType["PAUSED"] = 2] = "PAUSED";
    EventType[EventType["STOPPED"] = 3] = "STOPPED";
    EventType[EventType["COMPLETED"] = 4] = "COMPLETED";
    EventType[EventType["META_LOADED"] = 5] = "META_LOADED";
    EventType[EventType["READY_TO_PLAY"] = 6] = "READY_TO_PLAY";
    EventType[EventType["ERROR"] = 7] = "ERROR";
    EventType[EventType["CLICKED"] = 8] = "CLICKED";
  })(EventType || (_exports.EventType = EventType = {}));

  var READY_STATE;
  _exports.READY_STATE = READY_STATE;

  (function (READY_STATE) {
    READY_STATE[READY_STATE["HAVE_NOTHING"] = 0] = "HAVE_NOTHING";
    READY_STATE[READY_STATE["HAVE_METADATA"] = 1] = "HAVE_METADATA";
    READY_STATE[READY_STATE["HAVE_CURRENT_DATA"] = 2] = "HAVE_CURRENT_DATA";
    READY_STATE[READY_STATE["HAVE_FUTURE_DATA"] = 3] = "HAVE_FUTURE_DATA";
    READY_STATE[READY_STATE["HAVE_ENOUGH_DATA"] = 4] = "HAVE_ENOUGH_DATA";
  })(READY_STATE || (_exports.READY_STATE = READY_STATE = {}));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3ZpZGVvL3ZpZGVvLXBsYXllci1lbnVtcy50cyJdLCJuYW1lcyI6WyJSZXNvdXJjZVR5cGUiLCJSRU1PVEUiLCJMT0NBTCIsIkV2ZW50VHlwZSIsIlJFQURZX1NUQVRFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7O0FBSUE7Ozs7QUFNTyxNQUFNQSxZQUFZLEdBQUcsaUJBQUs7QUFDN0I7Ozs7OztBQU1BQyxJQUFBQSxNQUFNLEVBQUUsQ0FQcUI7O0FBUTdCOzs7Ozs7QUFNQUMsSUFBQUEsS0FBSyxFQUFFO0FBZHNCLEdBQUwsQ0FBckI7O01BaUJLQyxTOzs7YUFBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztLQUFBQSxTLDBCQUFBQSxTOztNQWlEQUMsVzs7O2FBQUFBLFc7QUFBQUEsSUFBQUEsVyxDQUFBQSxXO0FBQUFBLElBQUFBLFcsQ0FBQUEsVztBQUFBQSxJQUFBQSxXLENBQUFBLFc7QUFBQUEsSUFBQUEsVyxDQUFBQSxXO0FBQUFBLElBQUFBLFcsQ0FBQUEsVztLQUFBQSxXLDRCQUFBQSxXIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAyMCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvbXBvbmVudC92aWRlb3BsYXllclxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgdmlkZW8gcmVzb3VyY2UgdHlwZS5cclxuICogQHpoIOinhumikeadpea6kFxyXG4gKi9cclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJlc291cmNlVHlwZSA9IEVudW0oe1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSByZW1vdGUgcmVzb3VyY2UgdHlwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6L+c56iL6KeG6aKRXHJcbiAgICAgKi9cclxuICAgIFJFTU9URTogMCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbG9jYWwgcmVzb3VyY2UgdHlwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5pys5Zyw6KeG6aKRXHJcbiAgICAgKi9cclxuICAgIExPQ0FMOiAxXHJcbn0pO1xyXG5cclxuZXhwb3J0IGVudW0gRXZlbnRUeXBlIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIE5vbmVcclxuICAgICAqIEB6aCDml6BcclxuICAgICAqL1xyXG4gICAgTk9ORSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB2aWRlbyBpcyBwbGF5aW5nLlxyXG4gICAgICogQHpoIOinhumikeaSreaUvuS4rVxyXG4gICAgICovXHJcbiAgICBQTEFZSU5HLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVmlkZW8gcGF1c2VkXHJcbiAgICAgKiBAemgg6KeG6aKR5pqC5YGc5LitXHJcbiAgICAgKi9cclxuICAgIFBBVVNFRCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFZpZGVvIHN0b3BwZWRcclxuICAgICAqIEB6aCDop4bpopHlgZzmraLkuK1cclxuICAgICAqL1xyXG4gICAgU1RPUFBFRCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEVuZCBvZiB2aWRlb1xyXG4gICAgICogQHpoIOinhumikeaSreaUvuWujOavlVxyXG4gICAgICovXHJcbiAgICBDT01QTEVURUQsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBWaWRlbyBtZXRhZGF0YSBsb2FkaW5nIGNvbXBsZXRlXHJcbiAgICAgKiBAemgg6KeG6aKR5YWD5pWw5o2u5Yqg6L295a6M5q+VXHJcbiAgICAgKi9cclxuICAgIE1FVEFfTE9BREVELFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHZpZGVvIGlzIHJlYWR5IHRvIHBsYXkgd2hlbiBsb2FkZWRcclxuICAgICAqIEB6aCDop4bpopHliqDovb3lrozmr5Xlj6/mkq3mlL5cclxuICAgICAqL1xyXG4gICAgUkVBRFlfVE9fUExBWSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFZpZGVvIFRyaWdnZXIgRXJyb3JcclxuICAgICAqIEB6aCDlpITnkIbop4bpopHml7bop6blj5HnmoTplJnor69cclxuICAgICAqL1xyXG4gICAgRVJST1IsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVmlkZW8gY2xpY2tlZFxyXG4gICAgICogQHpoIOinhumikeiiq+eCueWHu1xyXG4gICAgICovXHJcbiAgICBDTElDS0VELFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBSRUFEWV9TVEFURSB7XHJcbiAgICBIQVZFX05PVEhJTkcsICAgICAgLy8g5rKh5pyJ5YWz5LqO6Z+z6aKRL+inhumikeaYr+WQpuWwsee7queahOS/oeaBr1xyXG4gICAgSEFWRV9NRVRBREFUQSwgICAgIC8vIOWFs+S6jumfs+mikS/op4bpopHlsLHnu6rnmoTlhYPmlbDmja5cclxuICAgIEhBVkVfQ1VSUkVOVF9EQVRBLCAvLyDlhbPkuo7lvZPliY3mkq3mlL7kvY3nva7nmoTmlbDmja7mmK/lj6/nlKjnmoTvvIzkvYbmsqHmnInotrPlpJ/nmoTmlbDmja7mnaXmkq3mlL7kuIvkuIDluKcv5q+r56eSXHJcbiAgICBIQVZFX0ZVVFVSRV9EQVRBLCAgLy8g5b2T5YmN5Y+K6Iez5bCR5LiL5LiA5bin55qE5pWw5o2u5piv5Y+v55So55qEXHJcbiAgICBIQVZFX0VOT1VHSF9EQVRBICAgLy8g5Y+v55So5pWw5o2u6Laz5Lul5byA5aeL5pKt5pS+XHJcbn1cclxuIl19