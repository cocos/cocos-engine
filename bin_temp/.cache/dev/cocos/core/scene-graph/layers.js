(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../value-types/index.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../value-types/index.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.globalExports);
    global.layers = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Layers = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // built-in layers, users can use 0~19 bits, 20~31 are system preserve bits.
  var layerList = {
    NONE: 0,
    IGNORE_RAYCAST: 1 << 20,
    GIZMOS: 1 << 21,
    EDITOR: 1 << 22,
    UI_3D: 1 << 23,
    SCENE_GIZMO: 1 << 24,
    UI_2D: 1 << 25,
    PROFILER: 1 << 28,
    DEFAULT: 1 << 30,
    ALL: 0xffffffff
  };
  /**
   * @zh 节点层管理器，层数据是以掩码数据方式存储在 [[Node.layer]] 中，用于射线检测、物理碰撞和用户自定义脚本逻辑。
   * 每个节点可属于一个或多个层，可通过 “包含式” 或 “排除式” 两种检测器进行层检测。
   * @en Node's layer manager, it's stored as bit mask data in [[Node.layer]].
   * Layer information is widely used in raycast, physics and user logic.
   * Every node can be assigned to multiple layers with different bit masks, you can setup layer with inclusive or exclusive operation.
   */

  var Layers = /*#__PURE__*/function () {
    function Layers() {
      _classCallCheck(this, Layers);
    }

    _createClass(Layers, null, [{
      key: "makeMaskInclude",

      /**
       * @en All layers in an Enum
       * @zh 以 Enum 形式存在的所有层列表
       */

      /**
       * @en All layers in [[BitMask]] type
       * @zh 包含所有层的 [[BitMask]]
       */

      /**
       * @en
       * Make a layer mask accepting nothing but the listed layers
       * @zh
       * 创建一个包含式层检测器，只接受列表中的层
       * @param includes All accepted layers
       * @return A filter which can detect all accepted layers
       */
      value: function makeMaskInclude(includes) {
        var mask = 0;

        var _iterator = _createForOfIteratorHelper(includes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var inc = _step.value;
            mask |= inc;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return mask;
      }
      /**
       * @en
       * Make a layer mask accepting everything but the listed layers
       * @zh
       * 创建一个排除式层检测器，只拒绝列表中的层
       * @param excludes All excluded layers
       * @return A filter which can detect for excluded layers
       */

    }, {
      key: "makeMaskExclude",
      value: function makeMaskExclude(excludes) {
        return ~Layers.makeMaskInclude(excludes);
      }
      /**
       * @zh 添加一个新层，用户可编辑 0 - 19 位为用户自定义层
       * @en Add a new layer, user can use layers from bit position 0 to 19, other bits are reserved.
       * @param name Layer's name
       * @param bitNum Layer's bit position
       */

    }, {
      key: "addLayer",
      value: function addLayer(name, bitNum) {
        if (bitNum === undefined) {
          console.warn('bitNum can\'t be undefined');
          return;
        }

        if (bitNum > 19 || bitNum < 0) {
          console.warn('maximum layers reached.');
          return;
        }

        Layers.Enum[name] = 1 << bitNum;
        Layers.Enum[bitNum] = name;
        Layers.BitMask[name] = 1 << bitNum;
        Layers.BitMask[bitNum] = name;
      }
      /**
       * @en Remove a layer, user can remove layers from bit position 0 to 19, other bits are reserved.
       * @zh 移除一个层，用户可编辑 0 - 19 位为用户自定义层
       * @param bitNum Layer's bit position
       */

    }, {
      key: "deleteLayer",
      value: function deleteLayer(bitNum) {
        if (bitNum > 19 || bitNum < 0) {
          console.warn('do not change buildin layers.');
          return;
        }

        delete Layers.Enum[Layers.Enum[bitNum]];
        delete Layers.Enum[bitNum];
        delete Layers.BitMask[Layers.BitMask[bitNum]];
        delete Layers.BitMask[bitNum];
      }
    }]);

    return Layers;
  }();

  _exports.Layers = Layers;
  Layers.Enum = (0, _index.Enum)(layerList);
  Layers.BitMask = (0, _index.BitMask)(Object.assign({}, layerList));
  _globalExports.legacyCC.Layers = Layers;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvbGF5ZXJzLnRzIl0sIm5hbWVzIjpbImxheWVyTGlzdCIsIk5PTkUiLCJJR05PUkVfUkFZQ0FTVCIsIkdJWk1PUyIsIkVESVRPUiIsIlVJXzNEIiwiU0NFTkVfR0laTU8iLCJVSV8yRCIsIlBST0ZJTEVSIiwiREVGQVVMVCIsIkFMTCIsIkxheWVycyIsImluY2x1ZGVzIiwibWFzayIsImluYyIsImV4Y2x1ZGVzIiwibWFrZU1hc2tJbmNsdWRlIiwibmFtZSIsImJpdE51bSIsInVuZGVmaW5lZCIsImNvbnNvbGUiLCJ3YXJuIiwiRW51bSIsIkJpdE1hc2siLCJPYmplY3QiLCJhc3NpZ24iLCJsZWdhY3lDQyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ0E7QUFDQSxNQUFNQSxTQUFTLEdBQUc7QUFDaEJDLElBQUFBLElBQUksRUFBRSxDQURVO0FBRWhCQyxJQUFBQSxjQUFjLEVBQUksS0FBSyxFQUZQO0FBR2hCQyxJQUFBQSxNQUFNLEVBQUksS0FBSyxFQUhDO0FBSWhCQyxJQUFBQSxNQUFNLEVBQUksS0FBSyxFQUpDO0FBS2hCQyxJQUFBQSxLQUFLLEVBQUksS0FBSyxFQUxFO0FBTWhCQyxJQUFBQSxXQUFXLEVBQUksS0FBSyxFQU5KO0FBT2hCQyxJQUFBQSxLQUFLLEVBQUksS0FBSyxFQVBFO0FBU2hCQyxJQUFBQSxRQUFRLEVBQUksS0FBSyxFQVREO0FBVWhCQyxJQUFBQSxPQUFPLEVBQUksS0FBSyxFQVZBO0FBV2hCQyxJQUFBQSxHQUFHLEVBQUc7QUFYVSxHQUFsQjtBQWNBOzs7Ozs7OztNQU9hQyxNOzs7Ozs7OztBQUVYOzs7OztBQUtBOzs7OztBQU1BOzs7Ozs7OztzQ0FRK0JDLFEsRUFBNEI7QUFDekQsWUFBSUMsSUFBSSxHQUFHLENBQVg7O0FBRHlELG1EQUV2Q0QsUUFGdUM7QUFBQTs7QUFBQTtBQUV6RCw4REFBNEI7QUFBQSxnQkFBakJFLEdBQWlCO0FBQzFCRCxZQUFBQSxJQUFJLElBQUlDLEdBQVI7QUFDRDtBQUp3RDtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUt6RCxlQUFPRCxJQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7c0NBUStCRSxRLEVBQTRCO0FBQ3pELGVBQU8sQ0FBQ0osTUFBTSxDQUFDSyxlQUFQLENBQXVCRCxRQUF2QixDQUFSO0FBQ0Q7QUFFRDs7Ozs7Ozs7OytCQU13QkUsSSxFQUFjQyxNLEVBQWdCO0FBQ3BELFlBQUtBLE1BQU0sS0FBS0MsU0FBaEIsRUFBNEI7QUFDMUJDLFVBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDRCQUFiO0FBQ0E7QUFDRDs7QUFDRCxZQUFLSCxNQUFNLEdBQUcsRUFBVCxJQUFlQSxNQUFNLEdBQUcsQ0FBN0IsRUFBZ0M7QUFDOUJFLFVBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHlCQUFiO0FBQ0E7QUFDRDs7QUFDRFYsUUFBQUEsTUFBTSxDQUFDVyxJQUFQLENBQVlMLElBQVosSUFBb0IsS0FBS0MsTUFBekI7QUFDQVAsUUFBQUEsTUFBTSxDQUFDVyxJQUFQLENBQVlKLE1BQVosSUFBc0JELElBQXRCO0FBQ0FOLFFBQUFBLE1BQU0sQ0FBQ1ksT0FBUCxDQUFlTixJQUFmLElBQXVCLEtBQUtDLE1BQTVCO0FBQ0FQLFFBQUFBLE1BQU0sQ0FBQ1ksT0FBUCxDQUFlTCxNQUFmLElBQXlCRCxJQUF6QjtBQUNEO0FBRUQ7Ozs7Ozs7O2tDQUsyQkMsTSxFQUFnQjtBQUN6QyxZQUFLQSxNQUFNLEdBQUcsRUFBVCxJQUFlQSxNQUFNLEdBQUcsQ0FBN0IsRUFBZ0M7QUFDOUJFLFVBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLCtCQUFiO0FBQ0E7QUFDRDs7QUFDRCxlQUFPVixNQUFNLENBQUNXLElBQVAsQ0FBWVgsTUFBTSxDQUFDVyxJQUFQLENBQVlKLE1BQVosQ0FBWixDQUFQO0FBQ0EsZUFBT1AsTUFBTSxDQUFDVyxJQUFQLENBQVlKLE1BQVosQ0FBUDtBQUNBLGVBQU9QLE1BQU0sQ0FBQ1ksT0FBUCxDQUFlWixNQUFNLENBQUNZLE9BQVAsQ0FBZUwsTUFBZixDQUFmLENBQVA7QUFDQSxlQUFPUCxNQUFNLENBQUNZLE9BQVAsQ0FBZUwsTUFBZixDQUFQO0FBQ0Q7Ozs7Ozs7QUE1RVVQLEVBQUFBLE0sQ0FNR1csSSxHQUFPLGlCQUFLdEIsU0FBTCxDO0FBTlZXLEVBQUFBLE0sQ0FXR1ksTyxHQUFVLG9CQUFRQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCekIsU0FBbEIsQ0FBUixDO0FBeUUxQjBCLDBCQUFTZixNQUFULEdBQWtCQSxNQUFsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgc2NlbmUtZ3JhcGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBCaXRNYXNrLCBFbnVtIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8vIGJ1aWx0LWluIGxheWVycywgdXNlcnMgY2FuIHVzZSAwfjE5IGJpdHMsIDIwfjMxIGFyZSBzeXN0ZW0gcHJlc2VydmUgYml0cy5cclxuY29uc3QgbGF5ZXJMaXN0ID0ge1xyXG4gIE5PTkU6IDAsXHJcbiAgSUdOT1JFX1JBWUNBU1QgOiAoMSA8PCAyMCksXHJcbiAgR0laTU9TIDogKDEgPDwgMjEpLFxyXG4gIEVESVRPUiA6ICgxIDw8IDIyKSxcclxuICBVSV8zRCA6ICgxIDw8IDIzKSxcclxuICBTQ0VORV9HSVpNTyA6ICgxIDw8IDI0KSxcclxuICBVSV8yRCA6ICgxIDw8IDI1KSxcclxuXHJcbiAgUFJPRklMRVIgOiAoMSA8PCAyOCksXHJcbiAgREVGQVVMVCA6ICgxIDw8IDMwKSxcclxuICBBTEwgOiAweGZmZmZmZmZmLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEB6aCDoioLngrnlsYLnrqHnkIblmajvvIzlsYLmlbDmja7mmK/ku6XmjqnnoIHmlbDmja7mlrnlvI/lrZjlgqjlnKggW1tOb2RlLmxheWVyXV0g5Lit77yM55So5LqO5bCE57q/5qOA5rWL44CB54mp55CG56Kw5pKe5ZKM55So5oi36Ieq5a6a5LmJ6ISa5pys6YC76L6R44CCXHJcbiAqIOavj+S4quiKgueCueWPr+WxnuS6juS4gOS4quaIluWkmuS4quWxgu+8jOWPr+mAmui/hyDigJzljIXlkKvlvI/igJ0g5oiWIOKAnOaOkumZpOW8j+KAnSDkuKTnp43mo4DmtYvlmajov5vooYzlsYLmo4DmtYvjgIJcclxuICogQGVuIE5vZGUncyBsYXllciBtYW5hZ2VyLCBpdCdzIHN0b3JlZCBhcyBiaXQgbWFzayBkYXRhIGluIFtbTm9kZS5sYXllcl1dLlxyXG4gKiBMYXllciBpbmZvcm1hdGlvbiBpcyB3aWRlbHkgdXNlZCBpbiByYXljYXN0LCBwaHlzaWNzIGFuZCB1c2VyIGxvZ2ljLlxyXG4gKiBFdmVyeSBub2RlIGNhbiBiZSBhc3NpZ25lZCB0byBtdWx0aXBsZSBsYXllcnMgd2l0aCBkaWZmZXJlbnQgYml0IG1hc2tzLCB5b3UgY2FuIHNldHVwIGxheWVyIHdpdGggaW5jbHVzaXZlIG9yIGV4Y2x1c2l2ZSBvcGVyYXRpb24uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJzIHtcclxuXHJcbiAgLyoqXHJcbiAgICogQGVuIEFsbCBsYXllcnMgaW4gYW4gRW51bVxyXG4gICAqIEB6aCDku6UgRW51bSDlvaLlvI/lrZjlnKjnmoTmiYDmnInlsYLliJfooahcclxuICAgKi9cclxuICBwdWJsaWMgc3RhdGljIEVudW0gPSBFbnVtKGxheWVyTGlzdCk7XHJcbiAgLyoqXHJcbiAgICogQGVuIEFsbCBsYXllcnMgaW4gW1tCaXRNYXNrXV0gdHlwZVxyXG4gICAqIEB6aCDljIXlkKvmiYDmnInlsYLnmoQgW1tCaXRNYXNrXV1cclxuICAgKi9cclxuICBwdWJsaWMgc3RhdGljIEJpdE1hc2sgPSBCaXRNYXNrKE9iamVjdC5hc3NpZ24oe30sIGxheWVyTGlzdCkpO1xyXG5cclxuICAvKipcclxuICAgKiBAZW5cclxuICAgKiBNYWtlIGEgbGF5ZXIgbWFzayBhY2NlcHRpbmcgbm90aGluZyBidXQgdGhlIGxpc3RlZCBsYXllcnNcclxuICAgKiBAemhcclxuICAgKiDliJvlu7rkuIDkuKrljIXlkKvlvI/lsYLmo4DmtYvlmajvvIzlj6rmjqXlj5fliJfooajkuK3nmoTlsYJcclxuICAgKiBAcGFyYW0gaW5jbHVkZXMgQWxsIGFjY2VwdGVkIGxheWVyc1xyXG4gICAqIEByZXR1cm4gQSBmaWx0ZXIgd2hpY2ggY2FuIGRldGVjdCBhbGwgYWNjZXB0ZWQgbGF5ZXJzXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyBtYWtlTWFza0luY2x1ZGUgKGluY2x1ZGVzOiBudW1iZXJbXSk6IG51bWJlciB7XHJcbiAgICBsZXQgbWFzayA9IDA7XHJcbiAgICBmb3IgKGNvbnN0IGluYyBvZiBpbmNsdWRlcykge1xyXG4gICAgICBtYXNrIHw9IGluYztcclxuICAgIH1cclxuICAgIHJldHVybiBtYXNrO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGVuXHJcbiAgICogTWFrZSBhIGxheWVyIG1hc2sgYWNjZXB0aW5nIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsaXN0ZWQgbGF5ZXJzXHJcbiAgICogQHpoXHJcbiAgICog5Yib5bu65LiA5Liq5o6S6Zmk5byP5bGC5qOA5rWL5Zmo77yM5Y+q5ouS57ud5YiX6KGo5Lit55qE5bGCXHJcbiAgICogQHBhcmFtIGV4Y2x1ZGVzIEFsbCBleGNsdWRlZCBsYXllcnNcclxuICAgKiBAcmV0dXJuIEEgZmlsdGVyIHdoaWNoIGNhbiBkZXRlY3QgZm9yIGV4Y2x1ZGVkIGxheWVyc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgbWFrZU1hc2tFeGNsdWRlIChleGNsdWRlczogbnVtYmVyW10pOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIH5MYXllcnMubWFrZU1hc2tJbmNsdWRlKGV4Y2x1ZGVzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEB6aCDmt7vliqDkuIDkuKrmlrDlsYLvvIznlKjmiLflj6/nvJbovpEgMCAtIDE5IOS9jeS4uueUqOaIt+iHquWumuS5ieWxglxyXG4gICAqIEBlbiBBZGQgYSBuZXcgbGF5ZXIsIHVzZXIgY2FuIHVzZSBsYXllcnMgZnJvbSBiaXQgcG9zaXRpb24gMCB0byAxOSwgb3RoZXIgYml0cyBhcmUgcmVzZXJ2ZWQuXHJcbiAgICogQHBhcmFtIG5hbWUgTGF5ZXIncyBuYW1lXHJcbiAgICogQHBhcmFtIGJpdE51bSBMYXllcidzIGJpdCBwb3NpdGlvblxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgYWRkTGF5ZXIgKG5hbWU6IHN0cmluZywgYml0TnVtOiBudW1iZXIpIHtcclxuICAgIGlmICggYml0TnVtID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignYml0TnVtIGNhblxcJ3QgYmUgdW5kZWZpbmVkJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICggYml0TnVtID4gMTkgfHwgYml0TnVtIDwgMCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ21heGltdW0gbGF5ZXJzIHJlYWNoZWQuJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIExheWVycy5FbnVtW25hbWVdID0gMSA8PCBiaXROdW07XHJcbiAgICBMYXllcnMuRW51bVtiaXROdW1dID0gbmFtZTtcclxuICAgIExheWVycy5CaXRNYXNrW25hbWVdID0gMSA8PCBiaXROdW07XHJcbiAgICBMYXllcnMuQml0TWFza1tiaXROdW1dID0gbmFtZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBlbiBSZW1vdmUgYSBsYXllciwgdXNlciBjYW4gcmVtb3ZlIGxheWVycyBmcm9tIGJpdCBwb3NpdGlvbiAwIHRvIDE5LCBvdGhlciBiaXRzIGFyZSByZXNlcnZlZC5cclxuICAgKiBAemgg56e76Zmk5LiA5Liq5bGC77yM55So5oi35Y+v57yW6L6RIDAgLSAxOSDkvY3kuLrnlKjmiLfoh6rlrprkuYnlsYJcclxuICAgKiBAcGFyYW0gYml0TnVtIExheWVyJ3MgYml0IHBvc2l0aW9uXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyBkZWxldGVMYXllciAoYml0TnVtOiBudW1iZXIpIHtcclxuICAgIGlmICggYml0TnVtID4gMTkgfHwgYml0TnVtIDwgMCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ2RvIG5vdCBjaGFuZ2UgYnVpbGRpbiBsYXllcnMuJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGRlbGV0ZSBMYXllcnMuRW51bVtMYXllcnMuRW51bVtiaXROdW1dXTtcclxuICAgIGRlbGV0ZSBMYXllcnMuRW51bVtiaXROdW1dO1xyXG4gICAgZGVsZXRlIExheWVycy5CaXRNYXNrW0xheWVycy5CaXRNYXNrW2JpdE51bV1dO1xyXG4gICAgZGVsZXRlIExheWVycy5CaXRNYXNrW2JpdE51bV07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgTGF5ZXJzIHtcclxuICAgIGV4cG9ydCB0eXBlIEVudW0gPSBFbnVtQWxpYXM8dHlwZW9mIExheWVycy5FbnVtPjtcclxuICAgIGV4cG9ydCB0eXBlIEJpdE1hc2sgPSBFbnVtQWxpYXM8dHlwZW9mIExheWVycy5CaXRNYXNrPjtcclxufVxyXG5cclxubGVnYWN5Q0MuTGF5ZXJzID0gTGF5ZXJzO1xyXG4iXX0=