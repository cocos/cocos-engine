(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/misc.js", "../value-types/index.js", "./object.js", "../utils/js.js", "../platform/debug.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/misc.js"), require("../value-types/index.js"), require("./object.js"), require("../utils/js.js"), require("../platform/debug.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.misc, global.index, global.object, global.js, global.debug, global.defaultConstants, global.globalExports);
    global.instantiate = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _misc, _index, _object, _js, _debug, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.instantiate = instantiate;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var Destroyed = _object.CCObject.Flags.Destroyed;
  var PersistentMask = _object.CCObject.Flags.PersistentMask;
  var objsToClearTmpVar = []; // used to reset _iN$t variable

  /**
   * Invoke _instantiate method if supplied.
   * The _instantiate callback will be called only on the root object, its associated object will not be called.
   * @param instantiated If supplied, _instantiate just need to initialize the instantiated object, no need to create new object by itself.
   * @returns The instantiated object.
   */

  function instantiate(original, internalForce) {
    if (!internalForce) {
      if (_defaultConstants.DEV) {
        if (_typeof(original) !== 'object' || Array.isArray(original)) {
          throw new TypeError((0, _debug.getError)(6900));
        }

        if (!original) {
          throw new TypeError((0, _debug.getError)(6901));
        }

        if (!_globalExports.legacyCC.isValid(original)) {
          throw new TypeError((0, _debug.getError)(6901));
        }

        if (original instanceof _globalExports.legacyCC.Component) {
          (0, _debug.warn)('Should not instantiate a single cc.Component directly, you must instantiate the entire node.');
        }
      }
    }

    var clone;

    if (original instanceof _object.CCObject) {
      // @ts-ignore
      if (original._instantiate) {
        _globalExports.legacyCC.game._isCloning = true; // @ts-ignore

        clone = original._instantiate();
        _globalExports.legacyCC.game._isCloning = false;
        return clone;
      } else if (original instanceof _globalExports.legacyCC.Asset) {
        throw new TypeError((0, _debug.getError)(6903));
      }
    }

    _globalExports.legacyCC.game._isCloning = true;
    clone = doInstantiate(original);
    _globalExports.legacyCC.game._isCloning = false;
    return clone;
  }
  /*
   * @en
   * Do instantiate object, the object to instantiate must be non-nil.
   * @zh
   * 这是一个通用的 instantiate 方法，可能效率比较低。
   * 之后可以给各种类型重写快速实例化的特殊实现，但应该在单元测试中将结果和这个方法的结果进行对比。
   * 值得注意的是，这个方法不可重入。
   * @param obj - 该方法仅供内部使用，用户需负责保证参数合法。什么参数是合法的请参考 cc.instantiate 的实现。
   * @param parent - 只有在该对象下的场景物体会被克隆。
   * @return {Object}
   * @private
   */


  function doInstantiate(obj, parent) {
    if (_defaultConstants.DEV) {
      if (Array.isArray(obj)) {
        throw new TypeError((0, _debug.getError)(6904));
      }

      if (_misc.isDomNode && (0, _misc.isDomNode)(obj)) {
        throw new TypeError((0, _debug.getError)(6905));
      }
    }

    var clone;

    if (obj._iN$t) {
      // User can specify an existing object by assigning the "_iN$t" property.
      // enumerateObject will always push obj to objsToClearTmpVar
      clone = obj._iN$t;
    } else if (obj.constructor) {
      var klass = obj.constructor;
      clone = new klass();
    } else {
      clone = Object.create(null);
    }

    enumerateObject(obj, clone, parent);

    for (var i = 0, len = objsToClearTmpVar.length; i < len; ++i) {
      objsToClearTmpVar[i]._iN$t = null;
    }

    objsToClearTmpVar.length = 0;
    return clone;
  } // @param {Object} obj - The object to instantiate, typeof must be 'object' and should not be an array.


  function enumerateCCClass(klass, obj, clone, parent) {
    var props = klass.__values__; // tslint:disable: prefer-for-of

    for (var p = 0; p < props.length; p++) {
      var key = props[p];
      var value = obj[key];

      if (_typeof(value) === 'object' && value) {
        var initValue = clone[key];

        if (initValue instanceof _index.ValueType && initValue.constructor === value.constructor) {
          initValue.set(value);
        } else {
          clone[key] = value._iN$t || instantiateObj(value, parent);
        }
      } else {
        clone[key] = value;
      }
    }
  }

  function enumerateObject(obj, clone, parent) {
    // 目前使用“_iN$t”这个特殊字段来存实例化后的对象，这样做主要是为了防止循环引用
    // 注意，为了避免循环引用，所有新创建的实例，必须在赋值前被设为源对象的_iN$t
    _js.js.value(obj, '_iN$t', clone, true);

    objsToClearTmpVar.push(obj);
    var klass = obj.constructor;

    if (_globalExports.legacyCC.Class._isCCClass(klass)) {
      enumerateCCClass(klass, obj, clone, parent);
    } else {
      // primitive javascript object
      for (var key in obj) {
        if (!obj.hasOwnProperty(key) || key.charCodeAt(0) === 95 && key.charCodeAt(1) === 95 && // starts with "__"
        key !== '__type__') {
          continue;
        }

        var value = obj[key];

        if (_typeof(value) === 'object' && value) {
          if (value === clone) {
            continue; // value is obj._iN$t
          }

          clone[key] = value._iN$t || instantiateObj(value, parent);
        } else {
          clone[key] = value;
        }
      }
    }

    if (obj instanceof _object.CCObject) {
      clone._objFlags &= PersistentMask;
    }
  }
  /*
   * @param {Object|Array} obj - the original non-nil object, typeof must be 'object'
   * @return {Object|Array} - the original non-nil object, typeof must be 'object'
   */


  function instantiateObj(obj, parent) {
    if (obj instanceof _index.ValueType) {
      return obj.clone();
    }

    if (obj instanceof _globalExports.legacyCC.Asset) {
      // 所有资源直接引用，不需要拷贝
      return obj;
    }

    var clone;

    if (Array.isArray(obj)) {
      var len = obj.length;
      clone = new Array(len); // @ts-ignore

      obj._iN$t = clone;

      for (var i = 0; i < len; ++i) {
        var value = obj[i];

        if (_typeof(value) === 'object' && value) {
          clone[i] = value._iN$t || instantiateObj(value, parent);
        } else {
          clone[i] = value;
        }
      }

      objsToClearTmpVar.push(obj);
      return clone;
    } else if (obj._objFlags & Destroyed) {
      // the same as cc.isValid(obj)
      return null;
    }

    var ctor = obj.constructor;

    if (_globalExports.legacyCC.Class._isCCClass(ctor)) {
      if (parent) {
        if (parent instanceof _globalExports.legacyCC.Component) {
          if (obj instanceof _globalExports.legacyCC._BaseNode || obj instanceof _globalExports.legacyCC.Component) {
            return obj;
          }
        } else if (parent instanceof _globalExports.legacyCC._BaseNode) {
          if (obj instanceof _globalExports.legacyCC._BaseNode) {
            if (!obj.isChildOf(parent)) {
              // should not clone other nodes if not descendant
              return obj;
            }
          } else if (obj instanceof _globalExports.legacyCC.Component) {
            if (!obj.node.isChildOf(parent)) {
              // should not clone other component if not descendant
              return obj;
            }
          }
        }
      }

      clone = new ctor();
    } else if (ctor === Object) {
      clone = {};
    } else if (!ctor) {
      clone = Object.create(null);
    } else {
      // unknown type
      return obj;
    }

    enumerateObject(obj, clone, parent);
    return clone;
  }

  instantiate._clone = doInstantiate;
  _globalExports.legacyCC.instantiate = instantiate;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9pbnN0YW50aWF0ZS50cyJdLCJuYW1lcyI6WyJEZXN0cm95ZWQiLCJDQ09iamVjdCIsIkZsYWdzIiwiUGVyc2lzdGVudE1hc2siLCJvYmpzVG9DbGVhclRtcFZhciIsImluc3RhbnRpYXRlIiwib3JpZ2luYWwiLCJpbnRlcm5hbEZvcmNlIiwiREVWIiwiQXJyYXkiLCJpc0FycmF5IiwiVHlwZUVycm9yIiwibGVnYWN5Q0MiLCJpc1ZhbGlkIiwiQ29tcG9uZW50IiwiY2xvbmUiLCJfaW5zdGFudGlhdGUiLCJnYW1lIiwiX2lzQ2xvbmluZyIsIkFzc2V0IiwiZG9JbnN0YW50aWF0ZSIsIm9iaiIsInBhcmVudCIsImlzRG9tTm9kZSIsIl9pTiR0IiwiY29uc3RydWN0b3IiLCJrbGFzcyIsIk9iamVjdCIsImNyZWF0ZSIsImVudW1lcmF0ZU9iamVjdCIsImkiLCJsZW4iLCJsZW5ndGgiLCJlbnVtZXJhdGVDQ0NsYXNzIiwicHJvcHMiLCJfX3ZhbHVlc19fIiwicCIsImtleSIsInZhbHVlIiwiaW5pdFZhbHVlIiwiVmFsdWVUeXBlIiwic2V0IiwiaW5zdGFudGlhdGVPYmoiLCJqcyIsInB1c2giLCJDbGFzcyIsIl9pc0NDQ2xhc3MiLCJoYXNPd25Qcm9wZXJ0eSIsImNoYXJDb2RlQXQiLCJfb2JqRmxhZ3MiLCJjdG9yIiwiX0Jhc2VOb2RlIiwiaXNDaGlsZE9mIiwibm9kZSIsIl9jbG9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQSxNQUFNQSxTQUFTLEdBQUdDLGlCQUFTQyxLQUFULENBQWVGLFNBQWpDO0FBQ0EsTUFBTUcsY0FBYyxHQUFHRixpQkFBU0MsS0FBVCxDQUFlQyxjQUF0QztBQUVBLE1BQU1DLGlCQUFzQixHQUFHLEVBQS9CLEMsQ0FBcUM7O0FBRXJDOzs7Ozs7O0FBMENPLFdBQVNDLFdBQVQsQ0FBc0JDLFFBQXRCLEVBQXFDQyxhQUFyQyxF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LGVBQWUsQ0FBQ1IsR0FBRCxFQUFNTixLQUFOLEVBQWFPLE1BQWIsQ0FBZjtBQUNBLFdBQU9QLEtBQVA7QUFDSDs7QUFFRFYsRUFBQUEsV0FBVyxDQUFDaUQsTUFBWixHQUFxQmxDLGFBQXJCO0FBQ0FSLDBCQUFTUCxXQUFULEdBQXVCQSxXQUF2QiIsInNvdXJjZXNDb250ZW50IjpbIu+7vy8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29yZS9kYXRhXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgaXNEb21Ob2RlIH0gZnJvbSAnLi4vdXRpbHMvbWlzYyc7XHJcbmltcG9ydCB7IFZhbHVlVHlwZSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzJztcclxuaW1wb3J0IHsgQ0NPYmplY3QgfSBmcm9tICcuL29iamVjdCc7XHJcbmltcG9ydCB7IGpzIH0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBnZXRFcnJvciwgd2FybiB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgREVWIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCBQcmVmYWIgZnJvbSAnLi4vYXNzZXRzL3ByZWZhYic7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi9zY2VuZS1ncmFwaC9ub2RlJztcclxuXHJcbmNvbnN0IERlc3Ryb3llZCA9IENDT2JqZWN0LkZsYWdzLkRlc3Ryb3llZDtcclxuY29uc3QgUGVyc2lzdGVudE1hc2sgPSBDQ09iamVjdC5GbGFncy5QZXJzaXN0ZW50TWFzaztcclxuXHJcbmNvbnN0IG9ianNUb0NsZWFyVG1wVmFyOiBhbnkgPSBbXTsgICAvLyB1c2VkIHRvIHJlc2V0IF9pTiR0IHZhcmlhYmxlXHJcblxyXG4vKipcclxuICogSW52b2tlIF9pbnN0YW50aWF0ZSBtZXRob2QgaWYgc3VwcGxpZWQuXHJcbiAqIFRoZSBfaW5zdGFudGlhdGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgb25seSBvbiB0aGUgcm9vdCBvYmplY3QsIGl0cyBhc3NvY2lhdGVkIG9iamVjdCB3aWxsIG5vdCBiZSBjYWxsZWQuXHJcbiAqIEBwYXJhbSBpbnN0YW50aWF0ZWQgSWYgc3VwcGxpZWQsIF9pbnN0YW50aWF0ZSBqdXN0IG5lZWQgdG8gaW5pdGlhbGl6ZSB0aGUgaW5zdGFudGlhdGVkIG9iamVjdCwgbm8gbmVlZCB0byBjcmVhdGUgbmV3IG9iamVjdCBieSBpdHNlbGYuXHJcbiAqIEByZXR1cm5zIFRoZSBpbnN0YW50aWF0ZWQgb2JqZWN0LlxyXG4gKi9cclxudHlwZSBDdXN0b21JbnN0YW50aWF0aW9uID0gPFQ+KHRoaXM6IFQsIGluc3RhbnRpYXRlZD86IFQpID0+IFQ7XHJcblxyXG4vKipcclxuICogQHpoIOS7jiBQcmVmYWIg5a6e5L6L5YyW5Ye65paw6IqC54K544CCXHJcbiAqIEBlbiBJbnN0YW50aWF0ZSBhIG5vZGUgZnJvbSB0aGUgUHJlZmFiLlxyXG4gKiBAcGFyYW0gcHJlZmFiIFRoZSBwcmVmYWIuXHJcbiAqIEByZXR1cm5zIFRoZSBpbnN0YW50aWF0ZWQgbm9kZS5cclxuICogQGV4YW1wbGVcclxuICogYGBgdHNcclxuICogaW1wb3J0IHsgaW5zdGFudGlhdGUsIGRpcmVjdG9yIH0gZnJvbSAnY2MnO1xyXG4gKiAvLyBJbnN0YW50aWF0ZSBub2RlIGZyb20gcHJlZmFiLlxyXG4gKiBjb25zdCBub2RlID0gaW5zdGFudGlhdGUocHJlZmFiQXNzZXQpO1xyXG4gKiBub2RlLnBhcmVudCA9IGRpcmVjdG9yLmdldFNjZW5lKCk7XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlIChwcmVmYWI6IFByZWZhYik6IE5vZGU7XHJcblxyXG4vKipcclxuICogQGVuIENsb25lcyB0aGUgb2JqZWN0IGBvcmlnaW5hbC5cclxuICogQHpoIOWFi+mahuaMh+WumueahOS7u+aEj+exu+Wei+eahOWvueixoeOAglxyXG4gKiBAcGFyYW0gb3JpZ2luYWwgQW4gZXhpc3Rpbmcgb2JqZWN0IHRoYXQgeW91IHdhbnQgdG8gbWFrZSBhIGNvcHkgb2YuXHJcbiAqIEl0IGNhbiBiZSBhbnkgSmF2YVNjcmlwdCBvYmplY3QoYHR5cGVvZiBvcmlnaW5hbCA9PT0gJ29iamVjdCdgKSBidXQ6XHJcbiAqIC0gaXQgc2hhbGwgbm90IGJlIGFycmF5IG9yIG51bGw7XHJcbiAqIC0gaXQgc2hhbGwgbm90IGJlIG9iamVjdCBvZiBgQXNzZXRgO1xyXG4gKiAtIGlmIGl0J3MgYW4gb2JqZWN0IG9mIGBDQ09iamVjdGAsIGl0IHNob3VsZCBub3QgaGF2ZSBiZWVuIGRlc3Ryb3llZC5cclxuICogQHJldHVybnMgVGhlIG5ld2x5IGluc3RhbnRpYXRlZCBvYmplY3QuXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IGluc3RhbnRpYXRlLCBkaXJlY3RvciB9IGZyb20gJ2NjJztcclxuICogLy8gQ2xvbmUgYSBub2RlLlxyXG4gKiBjb25zdCBub2RlID0gaW5zdGFudGlhdGUodGFyZ2V0Tm9kZSk7XHJcbiAqIG5vZGUucGFyZW50ID0gZGlyZWN0b3IuZ2V0U2NlbmUoKTtcclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFudGlhdGU8VD4gKG9yaWdpbmFsOiBUKTogVDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnN0YW50aWF0ZSAob3JpZ2luYWw6IGFueSwgaW50ZXJuYWxGb3JjZT86IGJvb2xlYW4pIHtcclxuICAgIGlmICghaW50ZXJuYWxGb3JjZSkge1xyXG4gICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbCAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShvcmlnaW5hbCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZ2V0RXJyb3IoNjkwMCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghb3JpZ2luYWwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZ2V0RXJyb3IoNjkwMSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghbGVnYWN5Q0MuaXNWYWxpZChvcmlnaW5hbCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZ2V0RXJyb3IoNjkwMSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbCBpbnN0YW5jZW9mIGxlZ2FjeUNDLkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgd2FybignU2hvdWxkIG5vdCBpbnN0YW50aWF0ZSBhIHNpbmdsZSBjYy5Db21wb25lbnQgZGlyZWN0bHksIHlvdSBtdXN0IGluc3RhbnRpYXRlIHRoZSBlbnRpcmUgbm9kZS4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2xvbmU7XHJcbiAgICBpZiAob3JpZ2luYWwgaW5zdGFuY2VvZiBDQ09iamVjdCkge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBpZiAob3JpZ2luYWwuX2luc3RhbnRpYXRlKSB7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmdhbWUuX2lzQ2xvbmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgY2xvbmUgPSBvcmlnaW5hbC5faW5zdGFudGlhdGUoKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5faXNDbG9uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob3JpZ2luYWwgaW5zdGFuY2VvZiBsZWdhY3lDQy5Bc3NldCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGdldEVycm9yKDY5MDMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGVnYWN5Q0MuZ2FtZS5faXNDbG9uaW5nID0gdHJ1ZTtcclxuICAgIGNsb25lID0gZG9JbnN0YW50aWF0ZShvcmlnaW5hbCk7XHJcbiAgICBsZWdhY3lDQy5nYW1lLl9pc0Nsb25pbmcgPSBmYWxzZTtcclxuICAgIHJldHVybiBjbG9uZTtcclxufVxyXG5cclxuLypcclxuICogQGVuXHJcbiAqIERvIGluc3RhbnRpYXRlIG9iamVjdCwgdGhlIG9iamVjdCB0byBpbnN0YW50aWF0ZSBtdXN0IGJlIG5vbi1uaWwuXHJcbiAqIEB6aFxyXG4gKiDov5nmmK/kuIDkuKrpgJrnlKjnmoQgaW5zdGFudGlhdGUg5pa55rOV77yM5Y+v6IO95pWI546H5q+U6L6D5L2O44CCXHJcbiAqIOS5i+WQjuWPr+S7pee7meWQhOenjeexu+Wei+mHjeWGmeW/q+mAn+WunuS+i+WMlueahOeJueauiuWunueOsO+8jOS9huW6lOivpeWcqOWNleWFg+a1i+ivleS4reWwhue7k+aenOWSjOi/meS4quaWueazleeahOe7k+aenOi/m+ihjOWvueavlOOAglxyXG4gKiDlgLzlvpfms6jmhI/nmoTmmK/vvIzov5nkuKrmlrnms5XkuI3lj6/ph43lhaXjgIJcclxuICogQHBhcmFtIG9iaiAtIOivpeaWueazleS7heS+m+WGhemDqOS9v+eUqO+8jOeUqOaIt+mcgOi0n+i0o+S/neivgeWPguaVsOWQiOazleOAguS7gOS5iOWPguaVsOaYr+WQiOazleeahOivt+WPguiAgyBjYy5pbnN0YW50aWF0ZSDnmoTlrp7njrDjgIJcclxuICogQHBhcmFtIHBhcmVudCAtIOWPquacieWcqOivpeWvueixoeS4i+eahOWcuuaZr+eJqeS9k+S8muiiq+WFi+mahuOAglxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBkb0luc3RhbnRpYXRlIChvYmosIHBhcmVudD8pIHtcclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZ2V0RXJyb3IoNjkwNCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNEb21Ob2RlICYmIGlzRG9tTm9kZShvYmopKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZ2V0RXJyb3IoNjkwNSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2xvbmU7XHJcbiAgICBpZiAob2JqLl9pTiR0KSB7XHJcbiAgICAgICAgLy8gVXNlciBjYW4gc3BlY2lmeSBhbiBleGlzdGluZyBvYmplY3QgYnkgYXNzaWduaW5nIHRoZSBcIl9pTiR0XCIgcHJvcGVydHkuXHJcbiAgICAgICAgLy8gZW51bWVyYXRlT2JqZWN0IHdpbGwgYWx3YXlzIHB1c2ggb2JqIHRvIG9ianNUb0NsZWFyVG1wVmFyXHJcbiAgICAgICAgY2xvbmUgPSBvYmouX2lOJHQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChvYmouY29uc3RydWN0b3IpIHtcclxuICAgICAgICBjb25zdCBrbGFzcyA9IG9iai5jb25zdHJ1Y3RvcjtcclxuICAgICAgICBjbG9uZSA9IG5ldyBrbGFzcygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY2xvbmUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGVudW1lcmF0ZU9iamVjdChvYmosIGNsb25lLCBwYXJlbnQpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBvYmpzVG9DbGVhclRtcFZhci5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgIG9ianNUb0NsZWFyVG1wVmFyW2ldLl9pTiR0ID0gbnVsbDtcclxuICAgIH1cclxuICAgIG9ianNUb0NsZWFyVG1wVmFyLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgcmV0dXJuIGNsb25lO1xyXG59XHJcblxyXG4vLyBAcGFyYW0ge09iamVjdH0gb2JqIC0gVGhlIG9iamVjdCB0byBpbnN0YW50aWF0ZSwgdHlwZW9mIG11c3QgYmUgJ29iamVjdCcgYW5kIHNob3VsZCBub3QgYmUgYW4gYXJyYXkuXHJcblxyXG5mdW5jdGlvbiBlbnVtZXJhdGVDQ0NsYXNzIChrbGFzcywgb2JqLCBjbG9uZSwgcGFyZW50KSB7XHJcbiAgICBjb25zdCBwcm9wcyA9IGtsYXNzLl9fdmFsdWVzX187XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZTogcHJlZmVyLWZvci1vZlxyXG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IHByb3BzW3BdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5pdFZhbHVlID0gY2xvbmVba2V5XTtcclxuICAgICAgICAgICAgaWYgKGluaXRWYWx1ZSBpbnN0YW5jZW9mIFZhbHVlVHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgaW5pdFZhbHVlLmNvbnN0cnVjdG9yID09PSB2YWx1ZS5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgaW5pdFZhbHVlLnNldCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjbG9uZVtrZXldID0gdmFsdWUuX2lOJHQgfHwgaW5zdGFudGlhdGVPYmoodmFsdWUsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNsb25lW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVudW1lcmF0ZU9iamVjdCAob2JqLCBjbG9uZSwgcGFyZW50KSB7XHJcbiAgICAvLyDnm67liY3kvb/nlKjigJxfaU4kdOKAnei/meS4queJueauiuWtl+auteadpeWtmOWunuS+i+WMluWQjueahOWvueixoe+8jOi/meagt+WBmuS4u+imgeaYr+S4uuS6humYsuatouW+queOr+W8leeUqFxyXG4gICAgLy8g5rOo5oSP77yM5Li65LqG6YG/5YWN5b6q546v5byV55So77yM5omA5pyJ5paw5Yib5bu655qE5a6e5L6L77yM5b+F6aG75Zyo6LWL5YC85YmN6KKr6K6+5Li65rqQ5a+56LGh55qEX2lOJHRcclxuICAgIGpzLnZhbHVlKG9iaiwgJ19pTiR0JywgY2xvbmUsIHRydWUpO1xyXG4gICAgb2Jqc1RvQ2xlYXJUbXBWYXIucHVzaChvYmopO1xyXG4gICAgY29uc3Qga2xhc3MgPSBvYmouY29uc3RydWN0b3I7XHJcbiAgICBpZiAobGVnYWN5Q0MuQ2xhc3MuX2lzQ0NDbGFzcyhrbGFzcykpIHtcclxuICAgICAgICBlbnVtZXJhdGVDQ0NsYXNzKGtsYXNzLCBvYmosIGNsb25lLCBwYXJlbnQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gcHJpbWl0aXZlIGphdmFzY3JpcHQgb2JqZWN0XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkgfHxcclxuICAgICAgICAgICAgICAgIChrZXkuY2hhckNvZGVBdCgwKSA9PT0gOTUgJiYga2V5LmNoYXJDb2RlQXQoMSkgPT09IDk1ICYmICAgLy8gc3RhcnRzIHdpdGggXCJfX1wiXHJcbiAgICAgICAgICAgICAgICAga2V5ICE9PSAnX190eXBlX18nKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGNsb25lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7ICAgLy8gdmFsdWUgaXMgb2JqLl9pTiR0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjbG9uZVtrZXldID0gdmFsdWUuX2lOJHQgfHwgaW5zdGFudGlhdGVPYmoodmFsdWUsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjbG9uZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgQ0NPYmplY3QpIHtcclxuICAgICAgICBjbG9uZS5fb2JqRmxhZ3MgJj0gUGVyc2lzdGVudE1hc2s7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogLSB0aGUgb3JpZ2luYWwgbm9uLW5pbCBvYmplY3QsIHR5cGVvZiBtdXN0IGJlICdvYmplY3QnXHJcbiAqIEByZXR1cm4ge09iamVjdHxBcnJheX0gLSB0aGUgb3JpZ2luYWwgbm9uLW5pbCBvYmplY3QsIHR5cGVvZiBtdXN0IGJlICdvYmplY3QnXHJcbiAqL1xyXG5mdW5jdGlvbiBpbnN0YW50aWF0ZU9iaiAob2JqLCBwYXJlbnQpIHtcclxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBWYWx1ZVR5cGUpIHtcclxuICAgICAgICByZXR1cm4gb2JqLmNsb25lKCk7XHJcbiAgICB9XHJcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgbGVnYWN5Q0MuQXNzZXQpIHtcclxuICAgICAgICAvLyDmiYDmnInotYTmupDnm7TmjqXlvJXnlKjvvIzkuI3pnIDopoHmi7fotJ1cclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG4gICAgbGV0IGNsb25lO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IG9iai5sZW5ndGg7XHJcbiAgICAgICAgY2xvbmUgPSBuZXcgQXJyYXkobGVuKTtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgb2JqLl9pTiR0ID0gY2xvbmU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG9ialtpXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNsb25lW2ldID0gdmFsdWUuX2lOJHQgfHwgaW5zdGFudGlhdGVPYmoodmFsdWUsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjbG9uZVtpXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9ianNUb0NsZWFyVG1wVmFyLnB1c2gob2JqKTtcclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChvYmouX29iakZsYWdzICYgRGVzdHJveWVkKSB7XHJcbiAgICAgICAgLy8gdGhlIHNhbWUgYXMgY2MuaXNWYWxpZChvYmopXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcclxuICAgIGlmIChsZWdhY3lDQy5DbGFzcy5faXNDQ0NsYXNzKGN0b3IpKSB7XHJcbiAgICAgICAgaWYgKHBhcmVudCkge1xyXG4gICAgICAgICAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgbGVnYWN5Q0MuQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgbGVnYWN5Q0MuX0Jhc2VOb2RlIHx8IG9iaiBpbnN0YW5jZW9mIGxlZ2FjeUNDLkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGFyZW50IGluc3RhbmNlb2YgbGVnYWN5Q0MuX0Jhc2VOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgbGVnYWN5Q0MuX0Jhc2VOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvYmouaXNDaGlsZE9mKHBhcmVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCBjbG9uZSBvdGhlciBub2RlcyBpZiBub3QgZGVzY2VuZGFudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIGxlZ2FjeUNDLkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghb2JqLm5vZGUuaXNDaGlsZE9mKHBhcmVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCBjbG9uZSBvdGhlciBjb21wb25lbnQgaWYgbm90IGRlc2NlbmRhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2xvbmUgPSBuZXcgY3RvcigpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoY3RvciA9PT0gT2JqZWN0KSB7XHJcbiAgICAgICAgY2xvbmUgPSB7fTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFjdG9yKSB7XHJcbiAgICAgICAgY2xvbmUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gdW5rbm93biB0eXBlXHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIGVudW1lcmF0ZU9iamVjdChvYmosIGNsb25lLCBwYXJlbnQpO1xyXG4gICAgcmV0dXJuIGNsb25lO1xyXG59XHJcblxyXG5pbnN0YW50aWF0ZS5fY2xvbmUgPSBkb0luc3RhbnRpYXRlO1xyXG5sZWdhY3lDQy5pbnN0YW50aWF0ZSA9IGluc3RhbnRpYXRlO1xyXG4iXX0=