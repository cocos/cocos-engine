(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./misc.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./misc.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.misc, global.defaultConstants, global.globalExports);
    global.decodeUuid = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _misc, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = decodeUuid;

  /*
   Copyright (c) 2013-2016 Chukong Technologies Inc.
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
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
  var HexChars = '0123456789abcdef'.split('');
  var _t = ['', '', '', ''];

  var UuidTemplate = _t.concat(_t, '-', _t, '-', _t, '-', _t, '-', _t, _t, _t);

  var Indices = UuidTemplate.map(function (x, i) {
    return x === '-' ? NaN : i;
  }).filter(isFinite);
  /**
   * @en
   * Decode uuid, returns the original uuid
   *
   * @zh
   * 解码 uuid，返回原始 uuid
   *
   * @method decodeUuid
   * @param  base64 - the encoded uuid
   * @returns the original uuid
   *
   * @example
   * ```ts
   * const uuid = 'fcmR3XADNLgJ1ByKhqcC5Z';
   * const originalUuid = decodeUuid(uuid); // fc991dd7-0033-4b80-9d41-c8a86a702e59
   * ```
   */

  function decodeUuid(base64) {
    var strs = base64.split('@');
    var uuid = strs[0];

    if (uuid.length !== 22) {
      return base64;
    }

    UuidTemplate[0] = base64[0];
    UuidTemplate[1] = base64[1];

    for (var i = 2, j = 2; i < 22; i += 2) {
      var lhs = _misc.BASE64_VALUES[base64.charCodeAt(i)];

      var rhs = _misc.BASE64_VALUES[base64.charCodeAt(i + 1)];

      UuidTemplate[Indices[j++]] = HexChars[lhs >> 2];
      UuidTemplate[Indices[j++]] = HexChars[(lhs & 3) << 2 | rhs >> 4];
      UuidTemplate[Indices[j++]] = HexChars[rhs & 0xF];
    }

    return base64.replace(uuid, UuidTemplate.join(''));
  }

  if (_defaultConstants.TEST) {
    _globalExports.legacyCC._Test.decodeUuid = decodeUuid;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvZGVjb2RlLXV1aWQudHMiXSwibmFtZXMiOlsiSGV4Q2hhcnMiLCJzcGxpdCIsIl90IiwiVXVpZFRlbXBsYXRlIiwiY29uY2F0IiwiSW5kaWNlcyIsIm1hcCIsIngiLCJpIiwiTmFOIiwiZmlsdGVyIiwiaXNGaW5pdGUiLCJkZWNvZGVVdWlkIiwiYmFzZTY0Iiwic3RycyIsInV1aWQiLCJsZW5ndGgiLCJqIiwibGhzIiwiQkFTRTY0X1ZBTFVFUyIsImNoYXJDb2RlQXQiLCJyaHMiLCJyZXBsYWNlIiwiam9pbiIsIlRFU1QiLCJsZWdhY3lDQyIsIl9UZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJBLE1BQU1BLFFBQVEsR0FBRyxtQkFBbUJDLEtBQW5CLENBQXlCLEVBQXpCLENBQWpCO0FBRUEsTUFBTUMsRUFBRSxHQUFHLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixDQUFYOztBQUNBLE1BQU1DLFlBQVksR0FBR0QsRUFBRSxDQUFDRSxNQUFILENBQVVGLEVBQVYsRUFBYyxHQUFkLEVBQW1CQSxFQUFuQixFQUF1QixHQUF2QixFQUE0QkEsRUFBNUIsRUFBZ0MsR0FBaEMsRUFBcUNBLEVBQXJDLEVBQXlDLEdBQXpDLEVBQThDQSxFQUE5QyxFQUFrREEsRUFBbEQsRUFBc0RBLEVBQXRELENBQXJCOztBQUNBLE1BQU1HLE9BQU8sR0FBR0YsWUFBWSxDQUFDRyxHQUFiLENBQWlCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVVELENBQUMsS0FBSyxHQUFOLEdBQVlFLEdBQVosR0FBa0JELENBQTVCO0FBQUEsR0FBakIsRUFBZ0RFLE1BQWhELENBQXVEQyxRQUF2RCxDQUFoQjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQmUsV0FBU0MsVUFBVCxDQUFxQkMsTUFBckIsRUFBcUM7QUFDaEQsUUFBTUMsSUFBSSxHQUFHRCxNQUFNLENBQUNaLEtBQVAsQ0FBYSxHQUFiLENBQWI7QUFDQSxRQUFNYyxJQUFJLEdBQUdELElBQUksQ0FBQyxDQUFELENBQWpCOztBQUNBLFFBQUlDLElBQUksQ0FBQ0MsTUFBTCxLQUFnQixFQUFwQixFQUF3QjtBQUNwQixhQUFPSCxNQUFQO0FBQ0g7O0FBQ0RWLElBQUFBLFlBQVksQ0FBQyxDQUFELENBQVosR0FBa0JVLE1BQU0sQ0FBQyxDQUFELENBQXhCO0FBQ0FWLElBQUFBLFlBQVksQ0FBQyxDQUFELENBQVosR0FBa0JVLE1BQU0sQ0FBQyxDQUFELENBQXhCOztBQUNBLFNBQUssSUFBSUwsQ0FBQyxHQUFHLENBQVIsRUFBV1MsQ0FBQyxHQUFHLENBQXBCLEVBQXVCVCxDQUFDLEdBQUcsRUFBM0IsRUFBK0JBLENBQUMsSUFBSSxDQUFwQyxFQUF1QztBQUNuQyxVQUFNVSxHQUFHLEdBQUdDLG9CQUFjTixNQUFNLENBQUNPLFVBQVAsQ0FBa0JaLENBQWxCLENBQWQsQ0FBWjs7QUFDQSxVQUFNYSxHQUFHLEdBQUdGLG9CQUFjTixNQUFNLENBQUNPLFVBQVAsQ0FBa0JaLENBQUMsR0FBRyxDQUF0QixDQUFkLENBQVo7O0FBQ0FMLE1BQUFBLFlBQVksQ0FBQ0UsT0FBTyxDQUFDWSxDQUFDLEVBQUYsQ0FBUixDQUFaLEdBQTZCakIsUUFBUSxDQUFDa0IsR0FBRyxJQUFJLENBQVIsQ0FBckM7QUFDQWYsTUFBQUEsWUFBWSxDQUFDRSxPQUFPLENBQUNZLENBQUMsRUFBRixDQUFSLENBQVosR0FBNkJqQixRQUFRLENBQUUsQ0FBQ2tCLEdBQUcsR0FBRyxDQUFQLEtBQWEsQ0FBZCxHQUFtQkcsR0FBRyxJQUFJLENBQTNCLENBQXJDO0FBQ0FsQixNQUFBQSxZQUFZLENBQUNFLE9BQU8sQ0FBQ1ksQ0FBQyxFQUFGLENBQVIsQ0FBWixHQUE2QmpCLFFBQVEsQ0FBQ3FCLEdBQUcsR0FBRyxHQUFQLENBQXJDO0FBQ0g7O0FBQ0QsV0FBT1IsTUFBTSxDQUFDUyxPQUFQLENBQWVQLElBQWYsRUFBcUJaLFlBQVksQ0FBQ29CLElBQWIsQ0FBa0IsRUFBbEIsQ0FBckIsQ0FBUDtBQUNIOztBQUVELE1BQUlDLHNCQUFKLEVBQVU7QUFDTkMsNEJBQVNDLEtBQVQsQ0FBZWQsVUFBZixHQUE0QkEsVUFBNUI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbmltcG9ydCB7IEJBU0U2NF9WQUxVRVMgfSBmcm9tICcuL21pc2MnO1xyXG5pbXBvcnQgeyBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCBIZXhDaGFycyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XHJcblxyXG5jb25zdCBfdCA9IFsnJywgJycsICcnLCAnJ107XHJcbmNvbnN0IFV1aWRUZW1wbGF0ZSA9IF90LmNvbmNhdChfdCwgJy0nLCBfdCwgJy0nLCBfdCwgJy0nLCBfdCwgJy0nLCBfdCwgX3QsIF90KTtcclxuY29uc3QgSW5kaWNlcyA9IFV1aWRUZW1wbGF0ZS5tYXAoKHgsIGkpID0+IHggPT09ICctJyA/IE5hTiA6IGkpLmZpbHRlcihpc0Zpbml0ZSk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIERlY29kZSB1dWlkLCByZXR1cm5zIHRoZSBvcmlnaW5hbCB1dWlkXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDop6PnoIEgdXVpZO+8jOi/lOWbnuWOn+WniyB1dWlkXHJcbiAqXHJcbiAqIEBtZXRob2QgZGVjb2RlVXVpZFxyXG4gKiBAcGFyYW0gIGJhc2U2NCAtIHRoZSBlbmNvZGVkIHV1aWRcclxuICogQHJldHVybnMgdGhlIG9yaWdpbmFsIHV1aWRcclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgdHNcclxuICogY29uc3QgdXVpZCA9ICdmY21SM1hBRE5MZ0oxQnlLaHFjQzVaJztcclxuICogY29uc3Qgb3JpZ2luYWxVdWlkID0gZGVjb2RlVXVpZCh1dWlkKTsgLy8gZmM5OTFkZDctMDAzMy00YjgwLTlkNDEtYzhhODZhNzAyZTU5XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVjb2RlVXVpZCAoYmFzZTY0OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHN0cnMgPSBiYXNlNjQuc3BsaXQoJ0AnKTtcclxuICAgIGNvbnN0IHV1aWQgPSBzdHJzWzBdO1xyXG4gICAgaWYgKHV1aWQubGVuZ3RoICE9PSAyMikge1xyXG4gICAgICAgIHJldHVybiBiYXNlNjQ7XHJcbiAgICB9XHJcbiAgICBVdWlkVGVtcGxhdGVbMF0gPSBiYXNlNjRbMF07XHJcbiAgICBVdWlkVGVtcGxhdGVbMV0gPSBiYXNlNjRbMV07XHJcbiAgICBmb3IgKGxldCBpID0gMiwgaiA9IDI7IGkgPCAyMjsgaSArPSAyKSB7XHJcbiAgICAgICAgY29uc3QgbGhzID0gQkFTRTY0X1ZBTFVFU1tiYXNlNjQuY2hhckNvZGVBdChpKV07XHJcbiAgICAgICAgY29uc3QgcmhzID0gQkFTRTY0X1ZBTFVFU1tiYXNlNjQuY2hhckNvZGVBdChpICsgMSldO1xyXG4gICAgICAgIFV1aWRUZW1wbGF0ZVtJbmRpY2VzW2orK11dID0gSGV4Q2hhcnNbbGhzID4+IDJdO1xyXG4gICAgICAgIFV1aWRUZW1wbGF0ZVtJbmRpY2VzW2orK11dID0gSGV4Q2hhcnNbKChsaHMgJiAzKSA8PCAyKSB8IHJocyA+PiA0XTtcclxuICAgICAgICBVdWlkVGVtcGxhdGVbSW5kaWNlc1tqKytdXSA9IEhleENoYXJzW3JocyAmIDB4Rl07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmFzZTY0LnJlcGxhY2UodXVpZCwgVXVpZFRlbXBsYXRlLmpvaW4oJycpKTtcclxufVxyXG5cclxuaWYgKFRFU1QpIHtcclxuICAgIGxlZ2FjeUNDLl9UZXN0LmRlY29kZVV1aWQgPSBkZWNvZGVVdWlkO1xyXG59XHJcbiJdfQ==