(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils.js", "../../platform/debug.js", "../../utils/js.js", "../../default-constants.js", "../utils/preprocess-class.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils.js"), require("../../platform/debug.js"), require("../../utils/js.js"), require("../../default-constants.js"), require("../utils/preprocess-class.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils, global.debug, global.js, global.defaultConstants, global.preprocessClass);
    global.property = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils, _debug, _js, _defaultConstants, _preprocessClass) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.property = property;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function property(target, propertyKey, descriptor) {
    var options = null;

    function normalized(target, propertyKey, descriptor) {
      var cache = (0, _utils.getClassCache)(target.constructor);

      if (cache) {
        var ccclassProto = (0, _utils.getSubDict)(cache, 'proto');
        var properties = (0, _utils.getSubDict)(ccclassProto, 'properties');
        genProperty(target.constructor, properties, propertyKey, options, descriptor, cache);
      }
    }

    if (target === undefined) {
      // @property() => LegacyPropertyDecorator
      return property({
        type: undefined
      });
    } else if (typeof propertyKey === 'undefined') {
      // @property(options) => LegacyPropertyDescriptor
      // @property(type) => LegacyPropertyDescriptor
      options = target;
      return normalized;
    } else {
      // @property
      normalized(target, propertyKey, descriptor);
    }
  }

  function getDefaultFromInitializer(initializer) {
    var value;

    try {
      value = initializer();
    } catch (e) {
      // just lazy initialize by CCClass
      return initializer;
    }

    if (_typeof(value) !== 'object' || value === null) {
      // string boolean number function undefined null
      return value;
    } else {
      // The default attribute will not be used in ES6 constructor actually,
      // so we dont need to simplify into `{}` or `[]` or vec2 completely.
      return initializer;
    }
  }

  function extractActualDefaultValues(ctor) {
    var dummyObj;

    try {
      dummyObj = new ctor();
    } catch (e) {
      if (_defaultConstants.DEV) {
        (0, _debug.warnID)(3652, _js.js.getClassName(ctor), e);
      }

      return {};
    }

    return dummyObj;
  }

  function genProperty(ctor, properties, propertyKey, options, descriptor, cache) {
    var fullOptions;

    if (options) {
      fullOptions = _defaultConstants.DEV ? (0, _preprocessClass.getFullFormOfProperty)(options, propertyKey, _js.js.getClassName(ctor)) : (0, _preprocessClass.getFullFormOfProperty)(options);
      fullOptions = fullOptions || options;
    }

    var existsPropertyRecord = properties[propertyKey];

    var propertyRecord = _js.js.mixin(existsPropertyRecord || {}, fullOptions || {});

    if (descriptor && (descriptor.get || descriptor.set)) {
      // If the target property is accessor
      // typescript or babel
      if (_defaultConstants.DEV && options && (options.get || options.set)) {
        var errorProps = (0, _utils.getSubDict)(cache, 'errorProps');

        if (!errorProps[propertyKey]) {
          errorProps[propertyKey] = true;
          (0, _debug.warnID)(3655, propertyKey, _js.js.getClassName(ctor), propertyKey, propertyKey);
        }
      }

      if (descriptor.get) {
        propertyRecord.get = descriptor.get;
      }

      if (descriptor.set) {
        propertyRecord.set = descriptor.set;
      }
    } else {
      // Target property is non-accessor
      if (_defaultConstants.DEV && (propertyRecord.get || propertyRecord.set)) {
        // Specify "accessor options" for non-accessor property is forbidden.
        (0, _debug.errorID)(3655, propertyKey, _js.js.getClassName(ctor), propertyKey, propertyKey);
        return;
      }

      var defaultValue;
      var isDefaultValueSpecified = false;

      if (descriptor) {
        // In case of Babel, if an initializer is given for class field.
        // That initializer is passed to `descriptor.initializer`.
        // babel
        if (descriptor.initializer) {
          defaultValue = getDefaultFromInitializer(descriptor.initializer);
          isDefaultValueSpecified = true;
        }
      } else {
        // In case of TypeScript, we can not directly capture the initializer.
        // We have to be hacking to extract the value.
        var actualDefaultValues = cache["default"] || (cache["default"] = extractActualDefaultValues(ctor));

        if (actualDefaultValues.hasOwnProperty(propertyKey)) {
          defaultValue = actualDefaultValues[propertyKey];
          isDefaultValueSpecified = true;
        }
      }

      if (_defaultConstants.DEV) {
        if (options && options.hasOwnProperty('default')) {
          (0, _debug.warnID)(3653, propertyKey, _js.js.getClassName(ctor));
        } else if (!isDefaultValueSpecified) {
          (0, _debug.warnID)(3654, _js.js.getClassName(ctor), propertyKey);
        }
      }

      propertyRecord["default"] = defaultValue;
    }

    properties[propertyKey] = propertyRecord;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL3Byb3BlcnR5LnRzIl0sIm5hbWVzIjpbInByb3BlcnR5IiwidGFyZ2V0IiwicHJvcGVydHlLZXkiLCJkZXNjcmlwdG9yIiwib3B0aW9ucyIsIm5vcm1hbGl6ZWQiLCJjYWNoZSIsImNvbnN0cnVjdG9yIiwiY2NjbGFzc1Byb3RvIiwicHJvcGVydGllcyIsImdlblByb3BlcnR5IiwidW5kZWZpbmVkIiwidHlwZSIsImdldERlZmF1bHRGcm9tSW5pdGlhbGl6ZXIiLCJpbml0aWFsaXplciIsInZhbHVlIiwiZSIsImV4dHJhY3RBY3R1YWxEZWZhdWx0VmFsdWVzIiwiY3RvciIsImR1bW15T2JqIiwiREVWIiwianMiLCJnZXRDbGFzc05hbWUiLCJmdWxsT3B0aW9ucyIsImV4aXN0c1Byb3BlcnR5UmVjb3JkIiwicHJvcGVydHlSZWNvcmQiLCJtaXhpbiIsImdldCIsInNldCIsImVycm9yUHJvcHMiLCJkZWZhdWx0VmFsdWUiLCJpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCIsImFjdHVhbERlZmF1bHRWYWx1ZXMiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZDTyxXQUFTQSxRQUFULENBQ0hDLE1BREcsRUFFSEMsV0FGRyxFQUdIQyxVQUhHLEVBSUw7QUFDRSxRQUFJQyxPQUErQyxHQUFHLElBQXREOztBQUNBLGFBQVNDLFVBQVQsQ0FDSUosTUFESixFQUVJQyxXQUZKLEVBR0lDLFVBSEosRUFJRTtBQUNFLFVBQU1HLEtBQUssR0FBRywwQkFBY0wsTUFBTSxDQUFDTSxXQUFyQixDQUFkOztBQUNBLFVBQUlELEtBQUosRUFBVztBQUNQLFlBQU1FLFlBQVksR0FBRyx1QkFBV0YsS0FBWCxFQUFrQixPQUFsQixDQUFyQjtBQUNBLFlBQU1HLFVBQVUsR0FBRyx1QkFBV0QsWUFBWCxFQUF5QixZQUF6QixDQUFuQjtBQUNB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LHFCQUFKLEVBQVM7QUFDTCxZQUFJaEIsT0FBTyxJQUFJQSxPQUFPLENBQUM2QixjQUFSLENBQXVCLFNBQXZCLENBQWYsRUFBa0Q7QUFDOUMsNkJBQU8sSUFBUCxFQUFhL0IsV0FBYixFQUEwQm1CLE9BQUdDLFlBQUgsQ0FBZ0JKLElBQWhCLENBQTFCO0FBQ0gsU0FGRCxNQUVPLElBQUksQ0FBQ2EsdUJBQUwsRUFBOEI7QUFDakMsNkJBQU8sSUFBUCxFQUFhVixPQUFHQyxZQUFILENBQWdCSixJQUFoQixDQUFiLEVBQW9DaEIsV0FBcEM7QUFDSDtBQUNKOztBQUVEdUIsTUFBQUEsY0FBYyxXQUFkLEdBQXlCSyxZQUF6QjtBQUNIOztBQUVEckIsSUFBQUEsVUFBVSxDQUFDUCxXQUFELENBQVYsR0FBMEJ1QixjQUExQjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBkZWNvcmF0b3JcclxuICovXHJcblxyXG5pbXBvcnQgeyBDQ1N0cmluZywgQ0NJbnRlZ2VyLCBDQ0Zsb2F0LCBDQ0Jvb2xlYW4gfSBmcm9tICcuLi91dGlscy9hdHRyaWJ1dGUnO1xyXG5pbXBvcnQgeyBJRXhwb3NlZEF0dHJpYnV0ZXMgfSBmcm9tICcuLi91dGlscy9hdHRyaWJ1dGUtZGVmaW5lcyc7XHJcbmltcG9ydCB7IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yLCBnZXRTdWJEaWN0LCBnZXRDbGFzc0NhY2hlIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IHdhcm5JRCwgZXJyb3JJRCB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsganMgfSBmcm9tICcuLi8uLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IERFViB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGdldEZ1bGxGb3JtT2ZQcm9wZXJ0eSB9IGZyb20gJy4uL3V0aWxzL3ByZXByb2Nlc3MtY2xhc3MnO1xyXG5cclxuZXhwb3J0IHR5cGUgU2ltcGxlUHJvcGVydHlUeXBlID0gRnVuY3Rpb24gfCBzdHJpbmcgfCB0eXBlb2YgQ0NTdHJpbmcgfCB0eXBlb2YgQ0NJbnRlZ2VyIHwgdHlwZW9mIENDRmxvYXQgfCB0eXBlb2YgQ0NCb29sZWFuO1xyXG5cclxuZXhwb3J0IHR5cGUgUHJvcGVydHlUeXBlID0gU2ltcGxlUHJvcGVydHlUeXBlIHwgU2ltcGxlUHJvcGVydHlUeXBlW107XHJcblxyXG4vKipcclxuICogQHpoIENDQ2xhc3Mg5bGe5oCn6YCJ6aG544CCXHJcbiAqIEBlbiBDQ0NsYXNzIHByb3BlcnR5IG9wdGlvbnNcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb3BlcnR5T3B0aW9ucyBleHRlbmRzIElFeHBvc2VkQXR0cmlidXRlcyB7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gRGVjbGFyZSBhcyBhIENDQ2xhc3MgcHJvcGVydHkgd2l0aCBvcHRpb25zXHJcbiAqIEB6aCDlo7DmmI7lsZ7mgKfkuLogQ0NDbGFzcyDlsZ7mgKfjgIJcclxuICogQHBhcmFtIG9wdGlvbnMgcHJvcGVydHkgb3B0aW9uc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnR5IChvcHRpb25zPzogSVByb3BlcnR5T3B0aW9ucyk6IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBEZWNsYXJlIGFzIGEgQ0NDbGFzcyBwcm9wZXJ0eSB3aXRoIHRoZSBwcm9wZXJ0eSB0eXBlXHJcbiAqIEB6aCDmoIfms6jlsZ7mgKfkuLogY2Mg5bGe5oCn44CCPGJyLz5cclxuICog562J5Lu35LqOYEBwcm9wZXJ0eSh7dHlwZX0pYOOAglxyXG4gKiBAcGFyYW0gdHlwZSBBIHt7Y2NjbGFzc319IHR5cGUgb3IgYSB7e1ZhbHVlVHlwZX19XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcHJvcGVydHkgKHR5cGU6IFByb3BlcnR5VHlwZSk6IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBEZWNsYXJlIGFzIGEgQ0NDbGFzcyBwcm9wZXJ0eVxyXG4gKiBAemgg5qCH5rOo5bGe5oCn5Li6IGNjIOWxnuaAp+OAgjxici8+XHJcbiAqIOetieS7t+S6jmBAcHJvcGVydHkoKWDjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0eSAoLi4uYXJnczogUGFyYW1ldGVyczxMZWdhY3lQcm9wZXJ0eURlY29yYXRvcj4pOiB2b2lkO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnR5IChcclxuICAgIHRhcmdldD86IFBhcmFtZXRlcnM8TGVnYWN5UHJvcGVydHlEZWNvcmF0b3I+WzBdLFxyXG4gICAgcHJvcGVydHlLZXk/OiBQYXJhbWV0ZXJzPExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yPlsxXSxcclxuICAgIGRlc2NyaXB0b3I/OiBQYXJhbWV0ZXJzPExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yPlsyXSxcclxuKSB7XHJcbiAgICBsZXQgb3B0aW9uczogSVByb3BlcnR5T3B0aW9ucyB8IFByb3BlcnR5VHlwZSB8IG51bGwgPSBudWxsO1xyXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplZCAoXHJcbiAgICAgICAgdGFyZ2V0OiBQYXJhbWV0ZXJzPExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yPlswXSxcclxuICAgICAgICBwcm9wZXJ0eUtleTogUGFyYW1ldGVyczxMZWdhY3lQcm9wZXJ0eURlY29yYXRvcj5bMV0sXHJcbiAgICAgICAgZGVzY3JpcHRvcjogUGFyYW1ldGVyczxMZWdhY3lQcm9wZXJ0eURlY29yYXRvcj5bMl0sXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCBjYWNoZSA9IGdldENsYXNzQ2FjaGUodGFyZ2V0LmNvbnN0cnVjdG9yKTtcclxuICAgICAgICBpZiAoY2FjaGUpIHtcclxuICAgICAgICAgICAgY29uc3QgY2NjbGFzc1Byb3RvID0gZ2V0U3ViRGljdChjYWNoZSwgJ3Byb3RvJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBnZXRTdWJEaWN0KGNjY2xhc3NQcm90bywgJ3Byb3BlcnRpZXMnKTtcclxuICAgICAgICAgICAgZ2VuUHJvcGVydHkodGFyZ2V0LmNvbnN0cnVjdG9yLCBwcm9wZXJ0aWVzLCBwcm9wZXJ0eUtleSwgb3B0aW9ucywgZGVzY3JpcHRvciwgY2FjaGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAvLyBAcHJvcGVydHkoKSA9PiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvclxyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIHR5cGU6IHVuZGVmaW5lZCxcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHByb3BlcnR5S2V5ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIEBwcm9wZXJ0eShvcHRpb25zKSA9PiBMZWdhY3lQcm9wZXJ0eURlc2NyaXB0b3JcclxuICAgICAgICAvLyBAcHJvcGVydHkodHlwZSkgPT4gTGVnYWN5UHJvcGVydHlEZXNjcmlwdG9yXHJcbiAgICAgICAgb3B0aW9ucyA9IHRhcmdldDtcclxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gQHByb3BlcnR5XHJcbiAgICAgICAgbm9ybWFsaXplZCh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGVmYXVsdEZyb21Jbml0aWFsaXplciAoaW5pdGlhbGl6ZXIpIHtcclxuICAgIGxldCB2YWx1ZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFsdWUgPSBpbml0aWFsaXplcigpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAvLyBqdXN0IGxhenkgaW5pdGlhbGl6ZSBieSBDQ0NsYXNzXHJcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVyO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHtcclxuICAgICAgICAvLyBzdHJpbmcgYm9vbGVhbiBudW1iZXIgZnVuY3Rpb24gdW5kZWZpbmVkIG51bGxcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBUaGUgZGVmYXVsdCBhdHRyaWJ1dGUgd2lsbCBub3QgYmUgdXNlZCBpbiBFUzYgY29uc3RydWN0b3IgYWN0dWFsbHksXHJcbiAgICAgICAgLy8gc28gd2UgZG9udCBuZWVkIHRvIHNpbXBsaWZ5IGludG8gYHt9YCBvciBgW11gIG9yIHZlYzIgY29tcGxldGVseS5cclxuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4dHJhY3RBY3R1YWxEZWZhdWx0VmFsdWVzIChjdG9yKSB7XHJcbiAgICBsZXQgZHVtbXlPYmo7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGR1bW15T2JqID0gbmV3IGN0b3IoKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKERFVikge1xyXG4gICAgICAgICAgICB3YXJuSUQoMzY1MiwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGR1bW15T2JqO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5Qcm9wZXJ0eSAoXHJcbiAgICBjdG9yLFxyXG4gICAgcHJvcGVydGllcyxcclxuICAgIHByb3BlcnR5S2V5OiBQYXJhbWV0ZXJzPExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yPlsxXSxcclxuICAgIG9wdGlvbnMsXHJcbiAgICBkZXNjcmlwdG9yOiBQYXJhbWV0ZXJzPExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yPlsyXSB8IHVuZGVmaW5lZCxcclxuICAgIGNhY2hlLFxyXG4pIHtcclxuICAgIGxldCBmdWxsT3B0aW9ucztcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgICAgZnVsbE9wdGlvbnMgPSBERVYgPyBnZXRGdWxsRm9ybU9mUHJvcGVydHkob3B0aW9ucywgcHJvcGVydHlLZXksIGpzLmdldENsYXNzTmFtZShjdG9yKSkgOlxyXG4gICAgICAgICAgICBnZXRGdWxsRm9ybU9mUHJvcGVydHkob3B0aW9ucyk7XHJcbiAgICAgICAgZnVsbE9wdGlvbnMgPSBmdWxsT3B0aW9ucyB8fCBvcHRpb25zO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZXhpc3RzUHJvcGVydHlSZWNvcmQgPSBwcm9wZXJ0aWVzW3Byb3BlcnR5S2V5XTtcclxuICAgIGNvbnN0IHByb3BlcnR5UmVjb3JkID0ganMubWl4aW4oZXhpc3RzUHJvcGVydHlSZWNvcmQgfHwge30sIGZ1bGxPcHRpb25zIHx8IHt9KTtcclxuXHJcbiAgICBpZiAoZGVzY3JpcHRvciAmJiAoZGVzY3JpcHRvci5nZXQgfHwgZGVzY3JpcHRvci5zZXQpKSB7IC8vIElmIHRoZSB0YXJnZXQgcHJvcGVydHkgaXMgYWNjZXNzb3JcclxuICAgICAgICAvLyB0eXBlc2NyaXB0IG9yIGJhYmVsXHJcbiAgICAgICAgaWYgKERFViAmJiBvcHRpb25zICYmIChvcHRpb25zLmdldCB8fCBvcHRpb25zLnNldCkpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JQcm9wcyA9IGdldFN1YkRpY3QoY2FjaGUsICdlcnJvclByb3BzJyk7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3JQcm9wc1twcm9wZXJ0eUtleV0pIHtcclxuICAgICAgICAgICAgICAgIGVycm9yUHJvcHNbcHJvcGVydHlLZXldID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHdhcm5JRCgzNjU1LCBwcm9wZXJ0eUtleSwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBwcm9wZXJ0eUtleSwgcHJvcGVydHlLZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZXNjcmlwdG9yLmdldCkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0eVJlY29yZC5nZXQgPSBkZXNjcmlwdG9yLmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlc2NyaXB0b3Iuc2V0KSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5UmVjb3JkLnNldCA9IGRlc2NyaXB0b3Iuc2V0O1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIFRhcmdldCBwcm9wZXJ0eSBpcyBub24tYWNjZXNzb3JcclxuICAgICAgICBpZiAoREVWICYmIChwcm9wZXJ0eVJlY29yZC5nZXQgfHwgcHJvcGVydHlSZWNvcmQuc2V0KSkge1xyXG4gICAgICAgICAgICAvLyBTcGVjaWZ5IFwiYWNjZXNzb3Igb3B0aW9uc1wiIGZvciBub24tYWNjZXNzb3IgcHJvcGVydHkgaXMgZm9yYmlkZGVuLlxyXG4gICAgICAgICAgICBlcnJvcklEKDM2NTUsIHByb3BlcnR5S2V5LCBqcy5nZXRDbGFzc05hbWUoY3RvciksIHByb3BlcnR5S2V5LCBwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkZWZhdWx0VmFsdWU6IGFueTtcclxuICAgICAgICBsZXQgaXNEZWZhdWx0VmFsdWVTcGVjaWZpZWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoZGVzY3JpcHRvcikge1xyXG4gICAgICAgICAgICAvLyBJbiBjYXNlIG9mIEJhYmVsLCBpZiBhbiBpbml0aWFsaXplciBpcyBnaXZlbiBmb3IgY2xhc3MgZmllbGQuXHJcbiAgICAgICAgICAgIC8vIFRoYXQgaW5pdGlhbGl6ZXIgaXMgcGFzc2VkIHRvIGBkZXNjcmlwdG9yLmluaXRpYWxpemVyYC5cclxuICAgICAgICAgICAgLy8gYmFiZWxcclxuICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IuaW5pdGlhbGl6ZXIpIHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9IGdldERlZmF1bHRGcm9tSW5pdGlhbGl6ZXIoZGVzY3JpcHRvci5pbml0aWFsaXplcik7XHJcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJbiBjYXNlIG9mIFR5cGVTY3JpcHQsIHdlIGNhbiBub3QgZGlyZWN0bHkgY2FwdHVyZSB0aGUgaW5pdGlhbGl6ZXIuXHJcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gYmUgaGFja2luZyB0byBleHRyYWN0IHRoZSB2YWx1ZS5cclxuICAgICAgICAgICAgY29uc3QgYWN0dWFsRGVmYXVsdFZhbHVlcyA9IGNhY2hlLmRlZmF1bHQgfHwgKGNhY2hlLmRlZmF1bHQgPSBleHRyYWN0QWN0dWFsRGVmYXVsdFZhbHVlcyhjdG9yKSk7XHJcbiAgICAgICAgICAgIGlmIChhY3R1YWxEZWZhdWx0VmFsdWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5S2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlID0gYWN0dWFsRGVmYXVsdFZhbHVlc1twcm9wZXJ0eUtleV07XHJcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoMzY1MywgcHJvcGVydHlLZXksIGpzLmdldENsYXNzTmFtZShjdG9yKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzRGVmYXVsdFZhbHVlU3BlY2lmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoMzY1NCwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3BlcnR5UmVjb3JkLmRlZmF1bHQgPSBkZWZhdWx0VmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcGVydGllc1twcm9wZXJ0eUtleV0gPSBwcm9wZXJ0eVJlY29yZDtcclxufSJdfQ==