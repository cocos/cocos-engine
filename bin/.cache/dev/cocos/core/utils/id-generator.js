(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants);
    global.idGenerator = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var NonUuidMark = '.';
  /**
   * ID generator for runtime.
   */

  var IDGenerator = /*#__PURE__*/function () {
    /*
    * The global id generator might have a conflict problem once every 365 days,
    * if the game runs at 60 FPS and each frame 4760273 counts of new id are requested.
    */

    /**
     * @param [category] You can specify a unique category to avoid id collision with other instance of IdGenerator.
     */
    function IDGenerator(category) {
      _classCallCheck(this, IDGenerator);

      this.id = void 0;
      this.prefix = void 0;
      // Tnit with a random id to emphasize that the returns id should not be stored in persistence data.
      this.id = 0 | Math.random() * 998;
      this.prefix = category ? category + NonUuidMark : '';
    }

    _createClass(IDGenerator, [{
      key: "getNewId",
      value: function getNewId() {
        if (_defaultConstants.EDITOR && (this.prefix === 'Node.' || this.prefix === 'Comp.')) {
          return EditorExtends.UuidUtils.uuid();
        }

        return this.prefix + ++this.id;
      }
    }]);

    return IDGenerator;
  }();

  _exports.default = IDGenerator;
  IDGenerator.global = new IDGenerator('global');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvaWQtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbIk5vblV1aWRNYXJrIiwiSURHZW5lcmF0b3IiLCJjYXRlZ29yeSIsImlkIiwicHJlZml4IiwiTWF0aCIsInJhbmRvbSIsIkVESVRPUiIsIkVkaXRvckV4dGVuZHMiLCJVdWlkVXRpbHMiLCJ1dWlkIiwiZ2xvYmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxNQUFNQSxXQUFXLEdBQUcsR0FBcEI7QUFFQTs7OztNQUdxQkMsVztBQUNqQjs7Ozs7QUFVQTs7O0FBR0EseUJBQWFDLFFBQWIsRUFBZ0M7QUFBQTs7QUFBQSxXQVB6QkMsRUFPeUI7QUFBQSxXQUx6QkMsTUFLeUI7QUFDNUI7QUFDQSxXQUFLRCxFQUFMLEdBQVUsSUFBS0UsSUFBSSxDQUFDQyxNQUFMLEtBQWdCLEdBQS9CO0FBQ0EsV0FBS0YsTUFBTCxHQUFjRixRQUFRLEdBQUlBLFFBQVEsR0FBR0YsV0FBZixHQUE4QixFQUFwRDtBQUNIOzs7O2lDQUVrQjtBQUNmLFlBQUlPLDZCQUFXLEtBQUtILE1BQUwsS0FBZ0IsT0FBaEIsSUFBMkIsS0FBS0EsTUFBTCxLQUFnQixPQUF0RCxDQUFKLEVBQW9FO0FBQ2hFLGlCQUFPSSxhQUFhLENBQUNDLFNBQWQsQ0FBd0JDLElBQXhCLEVBQVA7QUFDSDs7QUFDRCxlQUFPLEtBQUtOLE1BQUwsR0FBZSxFQUFFLEtBQUtELEVBQTdCO0FBQ0g7Ozs7Ozs7QUF6QmdCRixFQUFBQSxXLENBS0hVLE0sR0FBUyxJQUFJVixXQUFKLENBQWdCLFFBQWhCLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcblxyXG5jb25zdCBOb25VdWlkTWFyayA9ICcuJztcclxuXHJcbi8qKlxyXG4gKiBJRCBnZW5lcmF0b3IgZm9yIHJ1bnRpbWUuXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJREdlbmVyYXRvciB7XHJcbiAgICAvKlxyXG4gICAgKiBUaGUgZ2xvYmFsIGlkIGdlbmVyYXRvciBtaWdodCBoYXZlIGEgY29uZmxpY3QgcHJvYmxlbSBvbmNlIGV2ZXJ5IDM2NSBkYXlzLFxyXG4gICAgKiBpZiB0aGUgZ2FtZSBydW5zIGF0IDYwIEZQUyBhbmQgZWFjaCBmcmFtZSA0NzYwMjczIGNvdW50cyBvZiBuZXcgaWQgYXJlIHJlcXVlc3RlZC5cclxuICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdsb2JhbCA9IG5ldyBJREdlbmVyYXRvcignZ2xvYmFsJyk7XHJcblxyXG4gICAgcHVibGljIGlkOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIHByZWZpeDogc3RyaW5nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIFtjYXRlZ29yeV0gWW91IGNhbiBzcGVjaWZ5IGEgdW5pcXVlIGNhdGVnb3J5IHRvIGF2b2lkIGlkIGNvbGxpc2lvbiB3aXRoIG90aGVyIGluc3RhbmNlIG9mIElkR2VuZXJhdG9yLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoY2F0ZWdvcnk/OiBzdHJpbmcpIHtcclxuICAgICAgICAvLyBUbml0IHdpdGggYSByYW5kb20gaWQgdG8gZW1waGFzaXplIHRoYXQgdGhlIHJldHVybnMgaWQgc2hvdWxkIG5vdCBiZSBzdG9yZWQgaW4gcGVyc2lzdGVuY2UgZGF0YS5cclxuICAgICAgICB0aGlzLmlkID0gMCB8IChNYXRoLnJhbmRvbSgpICogOTk4KTtcclxuICAgICAgICB0aGlzLnByZWZpeCA9IGNhdGVnb3J5ID8gKGNhdGVnb3J5ICsgTm9uVXVpZE1hcmspIDogJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE5ld0lkICgpIHtcclxuICAgICAgICBpZiAoRURJVE9SICYmICh0aGlzLnByZWZpeCA9PT0gJ05vZGUuJyB8fCB0aGlzLnByZWZpeCA9PT0gJ0NvbXAuJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVkaXRvckV4dGVuZHMuVXVpZFV0aWxzLnV1aWQoKSBhcyBzdHJpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArICgrK3RoaXMuaWQpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==