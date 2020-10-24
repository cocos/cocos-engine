(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/define.js", "../../platform/sys.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/define.js"), require("../../platform/sys.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.sys);
    global.buffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _sys) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.writeBuffer = writeBuffer;
  _exports.readBuffer = readBuffer;
  _exports.mapBuffer = mapBuffer;

  var _typeMap2;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var _typeMap = (_typeMap2 = {}, _defineProperty(_typeMap2, _define.GFXFormatType.UNORM, 'Uint'), _defineProperty(_typeMap2, _define.GFXFormatType.SNORM, 'Int'), _defineProperty(_typeMap2, _define.GFXFormatType.UINT, 'Uint'), _defineProperty(_typeMap2, _define.GFXFormatType.INT, 'Int'), _defineProperty(_typeMap2, _define.GFXFormatType.UFLOAT, 'Float'), _defineProperty(_typeMap2, _define.GFXFormatType.FLOAT, 'Float'), _defineProperty(_typeMap2, "default", 'Uint'), _typeMap2);

  function _getDataViewType(info) {
    var type = _typeMap[info.type] || _typeMap["default"];
    var bytes = info.size / info.count * 8;
    return type + bytes;
  } // default params bahaves just like on an plain, compact Float32Array


  function writeBuffer(target, data) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXFormat.R32F;
    var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var stride = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var info = _define.GFXFormatInfos[format];

    if (!stride) {
      stride = info.size;
    }

    var writer = 'set' + _getDataViewType(info);

    var componentBytesLength = info.size / info.count;
    var nSeg = Math.floor(data.length / info.count);
    var isLittleEndian = _sys.sys.isLittleEndian;

    for (var iSeg = 0; iSeg < nSeg; ++iSeg) {
      var x = offset + stride * iSeg;

      for (var iComponent = 0; iComponent < info.count; ++iComponent) {
        var y = x + componentBytesLength * iComponent;
        target[writer](y, data[info.count * iSeg + iComponent], isLittleEndian);
      }
    }
  }

  function readBuffer(target) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXFormat.R32F;
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : target.byteLength - offset;
    var stride = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var out = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
    var info = _define.GFXFormatInfos[format];

    if (!stride) {
      stride = info.size;
    }

    var reader = 'get' + _getDataViewType(info);

    var componentBytesLength = info.size / info.count;
    var nSeg = Math.floor(length / stride);
    var isLittleEndian = _sys.sys.isLittleEndian;

    for (var iSeg = 0; iSeg < nSeg; ++iSeg) {
      var x = offset + stride * iSeg;

      for (var iComponent = 0; iComponent < info.count; ++iComponent) {
        var y = x + componentBytesLength * iComponent;
        out[info.count * iSeg + iComponent] = target[reader](y, isLittleEndian);
      }
    }

    return out;
  }

  function mapBuffer(target, callback) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXFormat.R32F;
    var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var length = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : target.byteLength - offset;
    var stride = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var out = arguments.length > 6 ? arguments[6] : undefined;

    if (!out) {
      out = new DataView(target.buffer.slice(target.byteOffset, target.byteOffset + target.byteLength));
    }

    var info = _define.GFXFormatInfos[format];

    if (!stride) {
      stride = info.size;
    }

    var writer = 'set' + _getDataViewType(info);

    var reader = 'get' + _getDataViewType(info);

    var componentBytesLength = info.size / info.count;
    var nSeg = Math.floor(length / stride);
    var isLittleEndian = _sys.sys.isLittleEndian;

    for (var iSeg = 0; iSeg < nSeg; ++iSeg) {
      var x = offset + stride * iSeg;

      for (var iComponent = 0; iComponent < info.count; ++iComponent) {
        var y = x + componentBytesLength * iComponent;

        var _cur = target[reader](y, isLittleEndian); // iComponent is usually more useful than y


        out[writer](y, callback(_cur, iComponent, target), isLittleEndian);
      }
    }

    return out;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvbWlzYy9idWZmZXIudHMiXSwibmFtZXMiOlsiX3R5cGVNYXAiLCJHRlhGb3JtYXRUeXBlIiwiVU5PUk0iLCJTTk9STSIsIlVJTlQiLCJJTlQiLCJVRkxPQVQiLCJGTE9BVCIsIl9nZXREYXRhVmlld1R5cGUiLCJpbmZvIiwidHlwZSIsImJ5dGVzIiwic2l6ZSIsImNvdW50Iiwid3JpdGVCdWZmZXIiLCJ0YXJnZXQiLCJkYXRhIiwiZm9ybWF0IiwiR0ZYRm9ybWF0IiwiUjMyRiIsIm9mZnNldCIsInN0cmlkZSIsIkdGWEZvcm1hdEluZm9zIiwid3JpdGVyIiwiY29tcG9uZW50Qnl0ZXNMZW5ndGgiLCJuU2VnIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwiaXNMaXR0bGVFbmRpYW4iLCJzeXMiLCJpU2VnIiwieCIsImlDb21wb25lbnQiLCJ5IiwicmVhZEJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJvdXQiLCJyZWFkZXIiLCJtYXBCdWZmZXIiLCJjYWxsYmFjayIsIkRhdGFWaWV3IiwiYnVmZmVyIiwic2xpY2UiLCJieXRlT2Zmc2V0IiwiY3VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQU1BLFFBQVEsK0NBQ1RDLHNCQUFjQyxLQURMLEVBQ2EsTUFEYiw4QkFFVEQsc0JBQWNFLEtBRkwsRUFFYSxLQUZiLDhCQUdURixzQkFBY0csSUFITCxFQUdZLE1BSFosOEJBSVRILHNCQUFjSSxHQUpMLEVBSVcsS0FKWCw4QkFLVEosc0JBQWNLLE1BTEwsRUFLYyxPQUxkLDhCQU1UTCxzQkFBY00sS0FOTCxFQU1hLE9BTmIseUNBT0QsTUFQQyxhQUFkOztBQVNBLFdBQVNDLGdCQUFULENBQTJCQyxJQUEzQixFQUFnRDtBQUM1QyxRQUFNQyxJQUFJLEdBQUdWLFFBQVEsQ0FBQ1MsSUFBSSxDQUFDQyxJQUFOLENBQVIsSUFBdUJWLFFBQVEsV0FBNUM7QUFDQSxR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SUFBSSxDQUFDSSxLQUE5QztBQUNBLFFBQU1ZLElBQUksR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdDLE1BQU0sR0FBR1AsTUFBcEIsQ0FBYjtBQUNBLFFBQU1RLGNBQWMsR0FBR0MsU0FBSUQsY0FBM0I7O0FBRUEsU0FBSyxJQUFJRSxJQUFJLEdBQUcsQ0FBaEIsRUFBbUJBLElBQUksR0FBR04sSUFBMUIsRUFBZ0MsRUFBRU0sSUFBbEMsRUFBd0M7QUFDcEMsVUFBTUMsQ0FBQyxHQUFHWixNQUFNLEdBQUdDLE1BQU0sR0FBR1UsSUFBNUI7O0FBQ0EsV0FBSyxJQUFJRSxVQUFVLEdBQUcsQ0FBdEIsRUFBeUJBLFVBQVUsR0FBR3hCLElBQUksQ0FBQ0ksS0FBM0MsRUFBa0QsRUFBRW9CLFVBQXBELEVBQWdFO0FBQzVELFlBQU1DLENBQUMsR0FBR0YsQ0FBQyxHQUFHUixvQkFBb0IsR0FBR1MsVUFBckM7O0FBQ0EsWUFBTVksSUFBRyxHQUFHOUIsTUFBTSxDQUFDdUIsTUFBRCxDQUFOLENBQWVKLENBQWYsRUFBa0JMLGNBQWxCLENBQVosQ0FGNEQsQ0FHNUQ7OztBQUNBUSxRQUFBQSxHQUFHLENBQUNkLE1BQUQsQ0FBSCxDQUFZVyxDQUFaLEVBQWVNLFFBQVEsQ0FBQ0ssSUFBRCxFQUFNWixVQUFOLEVBQWtCbEIsTUFBbEIsQ0FBdkIsRUFBa0RjLGNBQWxEO0FBQ0g7QUFDSjs7QUFDRCxXQUFPUSxHQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhGb3JtYXQsIEdGWEZvcm1hdEluZm9zLCBHRlhGb3JtYXRUeXBlLCBHRlhGb3JtYXRJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IHN5cyB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL3N5cyc7XHJcblxyXG5jb25zdCBfdHlwZU1hcCA9IHtcclxuICAgIFtHRlhGb3JtYXRUeXBlLlVOT1JNXTogJ1VpbnQnLFxyXG4gICAgW0dGWEZvcm1hdFR5cGUuU05PUk1dOiAnSW50JyxcclxuICAgIFtHRlhGb3JtYXRUeXBlLlVJTlRdOiAnVWludCcsXHJcbiAgICBbR0ZYRm9ybWF0VHlwZS5JTlRdOiAnSW50JyxcclxuICAgIFtHRlhGb3JtYXRUeXBlLlVGTE9BVF06ICdGbG9hdCcsXHJcbiAgICBbR0ZYRm9ybWF0VHlwZS5GTE9BVF06ICdGbG9hdCcsXHJcbiAgICBkZWZhdWx0OiAnVWludCcsXHJcbn07XHJcbmZ1bmN0aW9uIF9nZXREYXRhVmlld1R5cGUgKGluZm86IEdGWEZvcm1hdEluZm8pIHtcclxuICAgIGNvbnN0IHR5cGUgPSBfdHlwZU1hcFtpbmZvLnR5cGVdIHx8IF90eXBlTWFwLmRlZmF1bHQ7XHJcbiAgICBjb25zdCBieXRlcyA9IGluZm8uc2l6ZSAvIGluZm8uY291bnQgKiA4O1xyXG4gICAgcmV0dXJuIHR5cGUgKyBieXRlcztcclxufVxyXG5cclxuLy8gZGVmYXVsdCBwYXJhbXMgYmFoYXZlcyBqdXN0IGxpa2Ugb24gYW4gcGxhaW4sIGNvbXBhY3QgRmxvYXQzMkFycmF5XHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZUJ1ZmZlciAodGFyZ2V0OiBEYXRhVmlldywgZGF0YTogbnVtYmVyW10sIGZvcm1hdDogR0ZYRm9ybWF0ID0gR0ZYRm9ybWF0LlIzMkYsIG9mZnNldDogbnVtYmVyID0gMCwgc3RyaWRlOiBudW1iZXIgPSAwKSB7XHJcbiAgICBjb25zdCBpbmZvID0gR0ZYRm9ybWF0SW5mb3NbZm9ybWF0XTtcclxuICAgIGlmICghc3RyaWRlKSB7IHN0cmlkZSA9IGluZm8uc2l6ZTsgfVxyXG4gICAgY29uc3Qgd3JpdGVyID0gJ3NldCcgKyBfZ2V0RGF0YVZpZXdUeXBlKGluZm8pO1xyXG4gICAgY29uc3QgY29tcG9uZW50Qnl0ZXNMZW5ndGggPSBpbmZvLnNpemUgLyBpbmZvLmNvdW50O1xyXG4gICAgY29uc3QgblNlZyA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggLyBpbmZvLmNvdW50KTtcclxuICAgIGNvbnN0IGlzTGl0dGxlRW5kaWFuID0gc3lzLmlzTGl0dGxlRW5kaWFuO1xyXG5cclxuICAgIGZvciAobGV0IGlTZWcgPSAwOyBpU2VnIDwgblNlZzsgKytpU2VnKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IG9mZnNldCArIHN0cmlkZSAqIGlTZWc7XHJcbiAgICAgICAgZm9yIChsZXQgaUNvbXBvbmVudCA9IDA7IGlDb21wb25lbnQgPCBpbmZvLmNvdW50OyArK2lDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgeSA9IHggKyBjb21wb25lbnRCeXRlc0xlbmd0aCAqIGlDb21wb25lbnQ7XHJcbiAgICAgICAgICAgIHRhcmdldFt3cml0ZXJdKHksIGRhdGFbaW5mby5jb3VudCAqIGlTZWcgKyBpQ29tcG9uZW50XSwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gcmVhZEJ1ZmZlciAoXHJcbiAgICB0YXJnZXQ6IERhdGFWaWV3LCBmb3JtYXQ6IEdGWEZvcm1hdCA9IEdGWEZvcm1hdC5SMzJGLCBvZmZzZXQ6IG51bWJlciA9IDAsXHJcbiAgICBsZW5ndGg6IG51bWJlciA9IHRhcmdldC5ieXRlTGVuZ3RoIC0gb2Zmc2V0LCBzdHJpZGU6IG51bWJlciA9IDAsIG91dDogbnVtYmVyW10gPSBbXSkge1xyXG4gICAgY29uc3QgaW5mbyA9IEdGWEZvcm1hdEluZm9zW2Zvcm1hdF07XHJcbiAgICBpZiAoIXN0cmlkZSkgeyBzdHJpZGUgPSBpbmZvLnNpemU7IH1cclxuICAgIGNvbnN0IHJlYWRlciA9ICdnZXQnICsgX2dldERhdGFWaWV3VHlwZShpbmZvKTtcclxuICAgIGNvbnN0IGNvbXBvbmVudEJ5dGVzTGVuZ3RoID0gaW5mby5zaXplIC8gaW5mby5jb3VudDtcclxuICAgIGNvbnN0IG5TZWcgPSBNYXRoLmZsb29yKGxlbmd0aCAvIHN0cmlkZSk7XHJcbiAgICBjb25zdCBpc0xpdHRsZUVuZGlhbiA9IHN5cy5pc0xpdHRsZUVuZGlhbjtcclxuXHJcbiAgICBmb3IgKGxldCBpU2VnID0gMDsgaVNlZyA8IG5TZWc7ICsraVNlZykge1xyXG4gICAgICAgIGNvbnN0IHggPSBvZmZzZXQgKyBzdHJpZGUgKiBpU2VnO1xyXG4gICAgICAgIGZvciAobGV0IGlDb21wb25lbnQgPSAwOyBpQ29tcG9uZW50IDwgaW5mby5jb3VudDsgKytpQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSB4ICsgY29tcG9uZW50Qnl0ZXNMZW5ndGggKiBpQ29tcG9uZW50O1xyXG4gICAgICAgICAgICBvdXRbaW5mby5jb3VudCAqIGlTZWcgKyBpQ29tcG9uZW50XSA9IHRhcmdldFtyZWFkZXJdKHksIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBtYXBCdWZmZXIgKFxyXG4gICAgdGFyZ2V0OiBEYXRhVmlldywgY2FsbGJhY2s6IChjdXI6IG51bWJlciwgaWR4OiBudW1iZXIsIHZpZXc6IERhdGFWaWV3KSA9PiBudW1iZXIsIGZvcm1hdDogR0ZYRm9ybWF0ID0gR0ZYRm9ybWF0LlIzMkYsXHJcbiAgICBvZmZzZXQ6IG51bWJlciA9IDAsIGxlbmd0aDogbnVtYmVyID0gdGFyZ2V0LmJ5dGVMZW5ndGggLSBvZmZzZXQsIHN0cmlkZTogbnVtYmVyID0gMCwgb3V0PzogRGF0YVZpZXcpIHtcclxuICAgIGlmICghb3V0KSB7IG91dCA9IG5ldyBEYXRhVmlldyh0YXJnZXQuYnVmZmVyLnNsaWNlKHRhcmdldC5ieXRlT2Zmc2V0LCB0YXJnZXQuYnl0ZU9mZnNldCArIHRhcmdldC5ieXRlTGVuZ3RoKSk7IH1cclxuICAgIGNvbnN0IGluZm8gPSBHRlhGb3JtYXRJbmZvc1tmb3JtYXRdO1xyXG4gICAgaWYgKCFzdHJpZGUpIHsgc3RyaWRlID0gaW5mby5zaXplOyB9XHJcbiAgICBjb25zdCB3cml0ZXIgPSAnc2V0JyArIF9nZXREYXRhVmlld1R5cGUoaW5mbyk7XHJcbiAgICBjb25zdCByZWFkZXIgPSAnZ2V0JyArIF9nZXREYXRhVmlld1R5cGUoaW5mbyk7XHJcbiAgICBjb25zdCBjb21wb25lbnRCeXRlc0xlbmd0aCA9IGluZm8uc2l6ZSAvIGluZm8uY291bnQ7XHJcbiAgICBjb25zdCBuU2VnID0gTWF0aC5mbG9vcihsZW5ndGggLyBzdHJpZGUpO1xyXG4gICAgY29uc3QgaXNMaXR0bGVFbmRpYW4gPSBzeXMuaXNMaXR0bGVFbmRpYW47XHJcblxyXG4gICAgZm9yIChsZXQgaVNlZyA9IDA7IGlTZWcgPCBuU2VnOyArK2lTZWcpIHtcclxuICAgICAgICBjb25zdCB4ID0gb2Zmc2V0ICsgc3RyaWRlICogaVNlZztcclxuICAgICAgICBmb3IgKGxldCBpQ29tcG9uZW50ID0gMDsgaUNvbXBvbmVudCA8IGluZm8uY291bnQ7ICsraUNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB5ID0geCArIGNvbXBvbmVudEJ5dGVzTGVuZ3RoICogaUNvbXBvbmVudDtcclxuICAgICAgICAgICAgY29uc3QgY3VyID0gdGFyZ2V0W3JlYWRlcl0oeSwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICAvLyBpQ29tcG9uZW50IGlzIHVzdWFsbHkgbW9yZSB1c2VmdWwgdGhhbiB5XHJcbiAgICAgICAgICAgIG91dFt3cml0ZXJdKHksIGNhbGxiYWNrKGN1ciwgaUNvbXBvbmVudCwgdGFyZ2V0KSwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuIl19