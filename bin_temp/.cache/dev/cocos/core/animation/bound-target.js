(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/index.js", "./target-path.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/index.js"), require("./target-path.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.targetPath, global.debug);
    global.boundTarget = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _targetPath, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.createBoundTarget = createBoundTarget;
  _exports.createBufferedTarget = createBufferedTarget;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function createBoundTarget(target, modifiers, valueAdapter) {
    var ap;
    var lastPath = modifiers[modifiers.length - 1];

    if (modifiers.length !== 0 && (0, _targetPath.isPropertyPath)(lastPath) && !valueAdapter) {
      var resultTarget = _targetPath.evaluatePath.apply(void 0, [target].concat(_toConsumableArray(modifiers.slice(0, modifiers.length - 1))));

      if (resultTarget === null) {
        return null;
      }

      ap = {
        isProxy: false,
        object: resultTarget,
        property: lastPath
      };
    } else if (!valueAdapter) {
      (0, _debug.error)("Empty animation curve.");
      return null;
    } else {
      var _resultTarget = _targetPath.evaluatePath.apply(void 0, [target].concat(_toConsumableArray(modifiers)));

      if (_resultTarget === null) {
        return null;
      }

      ap = {
        isProxy: true,
        proxy: valueAdapter.forTarget(_resultTarget)
      };
    }

    return {
      setValue: function setValue(value) {
        if (ap.isProxy) {
          ap.proxy.set(value);
        } else {
          ap.object[ap.property] = value;
        }
      },
      getValue: function getValue() {
        if (ap.isProxy) {
          if (!ap.proxy.get) {
            (0, _debug.error)("Target doesn't provide a get method.");
            return null;
          } else {
            return ap.proxy.get();
          }
        } else {
          return ap.object[ap.property];
        }
      }
    };
  }

  function createBufferedTarget(target, modifiers, valueAdapter) {
    var boundTarget = createBoundTarget(target, modifiers, valueAdapter);

    if (boundTarget === null) {
      return null;
    }

    var value = boundTarget.getValue();
    var copyable = getBuiltinCopy(value);

    if (!copyable) {
      (0, _debug.error)("Value is not copyable!");
      return null;
    }

    var buffer = copyable.createBuffer();
    var copy = copyable.copy;
    return Object.assign(boundTarget, {
      peek: function peek() {
        return buffer;
      },
      pull: function pull() {
        var value = boundTarget.getValue();
        copy(buffer, value);
      },
      push: function push() {
        boundTarget.setValue(buffer);
      }
    });
  }

  var getBuiltinCopy = function () {
    var map = new Map();
    map.set(_index.Vec2, {
      createBuffer: function createBuffer() {
        return new _index.Vec2();
      },
      copy: _index.Vec2.copy
    });
    map.set(_index.Vec3, {
      createBuffer: function createBuffer() {
        return new _index.Vec3();
      },
      copy: _index.Vec3.copy
    });
    map.set(_index.Vec4, {
      createBuffer: function createBuffer() {
        return new _index.Vec4();
      },
      copy: _index.Vec4.copy
    });
    map.set(_index.Color, {
      createBuffer: function createBuffer() {
        return new _index.Color();
      },
      copy: _index.Color.copy
    });
    return function (value) {
      return map.get(value === null || value === void 0 ? void 0 : value.constructor);
    };
  }();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2JvdW5kLXRhcmdldC50cyJdLCJuYW1lcyI6WyJjcmVhdGVCb3VuZFRhcmdldCIsInRhcmdldCIsIm1vZGlmaWVycyIsInZhbHVlQWRhcHRlciIsImFwIiwibGFzdFBhdGgiLCJsZW5ndGgiLCJyZXN1bHRUYXJnZXQiLCJldmFsdWF0ZVBhdGgiLCJzbGljZSIsImlzUHJveHkiLCJvYmplY3QiLCJwcm9wZXJ0eSIsInByb3h5IiwiZm9yVGFyZ2V0Iiwic2V0VmFsdWUiLCJ2YWx1ZSIsInNldCIsImdldFZhbHVlIiwiZ2V0IiwiY3JlYXRlQnVmZmVyZWRUYXJnZXQiLCJib3VuZFRhcmdldCIsImNvcHlhYmxlIiwiZ2V0QnVpbHRpbkNvcHkiLCJidWZmZXIiLCJjcmVhdGVCdWZmZXIiLCJjb3B5IiwiT2JqZWN0IiwiYXNzaWduIiwicGVlayIsInB1bGwiLCJwdXNoIiwibWFwIiwiTWFwIiwiVmVjMiIsIlZlYzMiLCJWZWM0IiwiQ29sb3IiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JPLFdBQVNBLGlCQUFULENBQTRCQyxNQUE1QixFQUF5Q0MsU0FBekMsRUFBa0VDLFlBQWxFLEVBQTBIO0FBQzdILFFBQUlDLEVBQUo7QUFRQSxRQUFNQyxRQUFRLEdBQUdILFNBQVMsQ0FBQ0EsU0FBUyxDQUFDSSxNQUFWLEdBQW1CLENBQXBCLENBQTFCOztBQUNBLFFBQUlKLFNBQVMsQ0FBQ0ksTUFBVixLQUFxQixDQUFyQixJQUEwQixnQ0FBZUQsUUFBZixDQUExQixJQUFzRCxDQUFDRixZQUEzRCxFQUF5RTtBQUNyRSxVQUFNSSxZQUFZLEdBQUdDLHdDQUFhUCxNQUFiLDRCQUF3QkMsU0FBUyxDQUFDTyxLQUFWLENBQWdCLENBQWhCLEVBQW1CUCxTQUFTLENBQUNJLE1BQVYsR0FBbUIsQ0FBdEMsQ0FBeEIsR0FBckI7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LEdBQUcsQ0FBQ2YsR0FBSixDQUFRaUIsV0FBUixFQUFjO0FBQUVULE1BQUFBLFlBQVksRUFBRTtBQUFBLGVBQU0sSUFBSVMsV0FBSixFQUFOO0FBQUEsT0FBaEI7QUFBa0NSLE1BQUFBLElBQUksRUFBRVEsWUFBS1I7QUFBN0MsS0FBZDtBQUNBTSxJQUFBQSxHQUFHLENBQUNmLEdBQUosQ0FBUWtCLFdBQVIsRUFBYztBQUFFVixNQUFBQSxZQUFZLEVBQUU7QUFBQSxlQUFNLElBQUlVLFdBQUosRUFBTjtBQUFBLE9BQWhCO0FBQWtDVCxNQUFBQSxJQUFJLEVBQUVTLFlBQUtUO0FBQTdDLEtBQWQ7QUFDQU0sSUFBQUEsR0FBRyxDQUFDZixHQUFKLENBQVFtQixXQUFSLEVBQWM7QUFBRVgsTUFBQUEsWUFBWSxFQUFFO0FBQUEsZUFBTSxJQUFJVyxXQUFKLEVBQU47QUFBQSxPQUFoQjtBQUFrQ1YsTUFBQUEsSUFBSSxFQUFFVSxZQUFLVjtBQUE3QyxLQUFkO0FBQ0FNLElBQUFBLEdBQUcsQ0FBQ2YsR0FBSixDQUFRb0IsWUFBUixFQUFlO0FBQUVaLE1BQUFBLFlBQVksRUFBRTtBQUFBLGVBQU0sSUFBSVksWUFBSixFQUFOO0FBQUEsT0FBaEI7QUFBbUNYLE1BQUFBLElBQUksRUFBRVcsYUFBTVg7QUFBL0MsS0FBZjtBQUNBLFdBQU8sVUFBQ1YsS0FBRCxFQUFnQjtBQUNuQixhQUFPZ0IsR0FBRyxDQUFDYixHQUFKLENBQVFILEtBQVIsYUFBUUEsS0FBUix1QkFBUUEsS0FBSyxDQUFFc0IsV0FBZixDQUFQO0FBQ0gsS0FGRDtBQUdILEdBVHNCLEVBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBDb2xvciwgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgeyBJVmFsdWVQcm94eSwgSVZhbHVlUHJveHlGYWN0b3J5IH0gZnJvbSAnLi92YWx1ZS1wcm94eSc7XHJcbmltcG9ydCB7IGlzUHJvcGVydHlQYXRoLCBQcm9wZXJ0eVBhdGgsIFRhcmdldFBhdGgsIGV2YWx1YXRlUGF0aCB9IGZyb20gJy4vdGFyZ2V0LXBhdGgnO1xyXG5pbXBvcnQgeyBlcnJvciB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUJvdW5kVGFyZ2V0IHtcclxuICAgIHNldFZhbHVlICh2YWx1ZTogYW55KTogdm9pZDtcclxuICAgIGdldFZhbHVlICgpOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUJ1ZmZlcmVkVGFyZ2V0IGV4dGVuZHMgSUJvdW5kVGFyZ2V0IHtcclxuICAgIHBlZWsoKTogYW55O1xyXG4gICAgcHVsbCgpOiB2b2lkO1xyXG4gICAgcHVzaCgpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQm91bmRUYXJnZXQgKHRhcmdldDogYW55LCBtb2RpZmllcnM6IFRhcmdldFBhdGhbXSwgdmFsdWVBZGFwdGVyPzogSVZhbHVlUHJveHlGYWN0b3J5KTogbnVsbCB8IElCb3VuZFRhcmdldCB7XHJcbiAgICBsZXQgYXA6IHtcclxuICAgICAgICBpc1Byb3h5OiBmYWxzZTtcclxuICAgICAgICBvYmplY3Q6IGFueTtcclxuICAgICAgICBwcm9wZXJ0eTogUHJvcGVydHlQYXRoO1xyXG4gICAgfSB8IHtcclxuICAgICAgICBpc1Byb3h5OiB0cnVlO1xyXG4gICAgICAgIHByb3h5OiBJVmFsdWVQcm94eTtcclxuICAgIH07XHJcbiAgICBjb25zdCBsYXN0UGF0aCA9IG1vZGlmaWVyc1ttb2RpZmllcnMubGVuZ3RoIC0gMV07XHJcbiAgICBpZiAobW9kaWZpZXJzLmxlbmd0aCAhPT0gMCAmJiBpc1Byb3BlcnR5UGF0aChsYXN0UGF0aCkgJiYgIXZhbHVlQWRhcHRlcikge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdFRhcmdldCA9IGV2YWx1YXRlUGF0aCh0YXJnZXQsIC4uLm1vZGlmaWVycy5zbGljZSgwLCBtb2RpZmllcnMubGVuZ3RoIC0gMSkpO1xyXG4gICAgICAgIGlmIChyZXN1bHRUYXJnZXQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFwID0ge1xyXG4gICAgICAgICAgICBpc1Byb3h5OiBmYWxzZSxcclxuICAgICAgICAgICAgb2JqZWN0OiByZXN1bHRUYXJnZXQsXHJcbiAgICAgICAgICAgIHByb3BlcnR5OiBsYXN0UGF0aCxcclxuICAgICAgICB9O1xyXG4gICAgfSBlbHNlIGlmICghdmFsdWVBZGFwdGVyKSB7XHJcbiAgICAgICAgZXJyb3IoYEVtcHR5IGFuaW1hdGlvbiBjdXJ2ZS5gKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0VGFyZ2V0ID0gZXZhbHVhdGVQYXRoKHRhcmdldCwgLi4ubW9kaWZpZXJzKTtcclxuICAgICAgICBpZiAocmVzdWx0VGFyZ2V0ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhcCA9IHtcclxuICAgICAgICAgICAgaXNQcm94eTogdHJ1ZSxcclxuICAgICAgICAgICAgcHJveHk6IHZhbHVlQWRhcHRlci5mb3JUYXJnZXQocmVzdWx0VGFyZ2V0KSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0VmFsdWU6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYXAuaXNQcm94eSkge1xyXG4gICAgICAgICAgICAgICAgYXAucHJveHkuc2V0KHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFwLm9iamVjdFthcC5wcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0VmFsdWU6ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGFwLmlzUHJveHkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghYXAucHJveHkuZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoYFRhcmdldCBkb2Vzbid0IHByb3ZpZGUgYSBnZXQgbWV0aG9kLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXAucHJveHkuZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXAub2JqZWN0W2FwLnByb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQnVmZmVyZWRUYXJnZXQgKHRhcmdldDogYW55LCBtb2RpZmllcnM6IFRhcmdldFBhdGhbXSwgdmFsdWVBZGFwdGVyPzogSVZhbHVlUHJveHlGYWN0b3J5KTogbnVsbCB8IElCdWZmZXJlZFRhcmdldCB7XHJcbiAgICBjb25zdCBib3VuZFRhcmdldCA9IGNyZWF0ZUJvdW5kVGFyZ2V0KHRhcmdldCwgbW9kaWZpZXJzLCB2YWx1ZUFkYXB0ZXIpO1xyXG4gICAgaWYgKGJvdW5kVGFyZ2V0ID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCB2YWx1ZSA9IGJvdW5kVGFyZ2V0LmdldFZhbHVlKCk7XHJcbiAgICBjb25zdCBjb3B5YWJsZSA9IGdldEJ1aWx0aW5Db3B5KHZhbHVlKTtcclxuICAgIGlmICghY29weWFibGUpIHtcclxuICAgICAgICBlcnJvcihgVmFsdWUgaXMgbm90IGNvcHlhYmxlIWApO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYnVmZmVyID0gY29weWFibGUuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICBjb25zdCBjb3B5ID0gY29weWFibGUuY29weTtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGJvdW5kVGFyZ2V0LCB7XHJcbiAgICAgICAgcGVlazogKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHVsbDogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGJvdW5kVGFyZ2V0LmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgIGNvcHkoYnVmZmVyLCB2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwdXNoOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGJvdW5kVGFyZ2V0LnNldFZhbHVlKGJ1ZmZlcik7XHJcbiAgICAgICAgfSxcclxuICAgIH0pO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSUNvcHlhYmxlIHtcclxuICAgIGNyZWF0ZUJ1ZmZlcjogKCkgPT4gYW55O1xyXG4gICAgY29weTogKG91dDogYW55LCBzb3VyY2U6IGFueSkgPT4gYW55O1xyXG59XHJcblxyXG5jb25zdCBnZXRCdWlsdGluQ29weSA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwPENvbnN0cnVjdG9yLCBJQ29weWFibGU+KCk7XHJcbiAgICBtYXAuc2V0KFZlYzIsIHsgY3JlYXRlQnVmZmVyOiAoKSA9PiBuZXcgVmVjMigpLCBjb3B5OiBWZWMyLmNvcHl9KTtcclxuICAgIG1hcC5zZXQoVmVjMywgeyBjcmVhdGVCdWZmZXI6ICgpID0+IG5ldyBWZWMzKCksIGNvcHk6IFZlYzMuY29weX0pO1xyXG4gICAgbWFwLnNldChWZWM0LCB7IGNyZWF0ZUJ1ZmZlcjogKCkgPT4gbmV3IFZlYzQoKSwgY29weTogVmVjNC5jb3B5fSk7XHJcbiAgICBtYXAuc2V0KENvbG9yLCB7IGNyZWF0ZUJ1ZmZlcjogKCkgPT4gbmV3IENvbG9yKCksIGNvcHk6IENvbG9yLmNvcHl9KTtcclxuICAgIHJldHVybiAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBtYXAuZ2V0KHZhbHVlPy5jb25zdHJ1Y3Rvcik7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4iXX0=