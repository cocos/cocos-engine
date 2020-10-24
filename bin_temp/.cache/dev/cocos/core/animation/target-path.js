(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../scene-graph/node.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../scene-graph/node.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.node, global.debug);
    global.targetPath = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _node, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isPropertyPath = isPropertyPath;
  _exports.isCustomPath = isCustomPath;
  _exports.evaluatePath = evaluatePath;
  _exports.ComponentPath = _exports.HierarchyPath = void 0;

  var _dec, _class, _class2, _descriptor, _temp, _dec2, _class4, _class5, _descriptor2, _temp2;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function isPropertyPath(path) {
    return typeof path === 'string' || typeof path === 'number';
  }

  function isCustomPath(path, constructor) {
    return path instanceof constructor;
  }

  var HierarchyPath = (_dec = (0, _index.ccclass)('cc.animation.HierarchyPath'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function HierarchyPath(path) {
      _classCallCheck(this, HierarchyPath);

      _initializerDefineProperty(this, "path", _descriptor, this);

      this.path = path || '';
    }

    _createClass(HierarchyPath, [{
      key: "get",
      value: function get(target) {
        if (!(target instanceof _node.Node)) {
          (0, _debug.warn)("Target of hierarchy path should be of type Node.");
          return null;
        }

        var result = target.getChildByPath(this.path);

        if (!result) {
          (0, _debug.warn)("Node \"".concat(target.name, "\" has no path \"").concat(this.path, "\""));
          return null;
        }

        return result;
      }
    }]);

    return HierarchyPath;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "path", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class);
  _exports.HierarchyPath = HierarchyPath;
  var ComponentPath = (_dec2 = (0, _index.ccclass)('cc.animation.ComponentPath'), _dec2(_class4 = (_class5 = (_temp2 = /*#__PURE__*/function () {
    function ComponentPath(component) {
      _classCallCheck(this, ComponentPath);

      _initializerDefineProperty(this, "component", _descriptor2, this);

      this.component = component || '';
    }

    _createClass(ComponentPath, [{
      key: "get",
      value: function get(target) {
        if (!(target instanceof _node.Node)) {
          (0, _debug.warn)("Target of component path should be of type Node.");
          return null;
        }

        var result = target.getComponent(this.component);

        if (!result) {
          (0, _debug.warn)("Node \"".concat(target.name, "\" has no component \"").concat(this.component, "\""));
          return null;
        }

        return result;
      }
    }]);

    return ComponentPath;
  }(), _temp2), (_descriptor2 = _applyDecoratedDescriptor(_class5.prototype, "component", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class5)) || _class4);
  /**
   * Evaluate a sequence of paths, in order, from specified root.
   * @param root The root object.
   * @param path The path sequence.
   */

  _exports.ComponentPath = ComponentPath;

  function evaluatePath(root) {
    var result = root;

    for (var iPath = 0; iPath < (arguments.length <= 1 ? 0 : arguments.length - 1); ++iPath) {
      var path = iPath + 1 < 1 || arguments.length <= iPath + 1 ? undefined : arguments[iPath + 1];

      if (isPropertyPath(path)) {
        if (!(path in result)) {
          (0, _debug.warn)("Target object has no property \"".concat(path, "\""));
          return null;
        } else {
          result = result[path];
        }
      } else {
        result = path.get(result);
      }

      if (result === null) {
        break;
      }
    }

    return result;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3RhcmdldC1wYXRoLnRzIl0sIm5hbWVzIjpbImlzUHJvcGVydHlQYXRoIiwicGF0aCIsImlzQ3VzdG9tUGF0aCIsImNvbnN0cnVjdG9yIiwiSGllcmFyY2h5UGF0aCIsInRhcmdldCIsIk5vZGUiLCJyZXN1bHQiLCJnZXRDaGlsZEJ5UGF0aCIsIm5hbWUiLCJzZXJpYWxpemFibGUiLCJDb21wb25lbnRQYXRoIiwiY29tcG9uZW50IiwiZ2V0Q29tcG9uZW50IiwiZXZhbHVhdGVQYXRoIiwicm9vdCIsImlQYXRoIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JPLFdBQVNBLGNBQVQsQ0FBeUJDLElBQXpCLEVBQWlFO0FBQ3BFLFdBQU8sT0FBT0EsSUFBUCxLQUFnQixRQUFoQixJQUE0QixPQUFPQSxJQUFQLEtBQWdCLFFBQW5EO0FBQ0g7O0FBRU0sV0FBU0MsWUFBVCxDQUFvREQsSUFBcEQsRUFBc0VFLFdBQXRFLEVBQThHO0FBQ2pILFdBQU9GLElBQUksWUFBWUUsV0FBdkI7QUFDSDs7TUFHWUMsYSxXQURaLG9CQUFRLDRCQUFSLEM7QUFLRywyQkFBYUgsSUFBYixFQUE0QjtBQUFBOztBQUFBOztBQUN4QixXQUFLQSxJQUFMLEdBQVlBLElBQUksSUFBSSxFQUFwQjtBQUNIOzs7OzBCQUVXSSxNLEVBQWM7QUFDdEIsWUFBSSxFQUFFQSxNQUFNLFlBQVlDLFVBQXBCLENBQUosRUFBK0I7QUFDM0I7QUFDQSxpQkFBTyxJQUFQO0FBQ0g7O0FBQ0QsWUFBTUMsTUFBTSxHQUFHRixNQUFNLENBQUNHLGNBQVAsQ0FBc0IsS0FBS1AsSUFBM0IsQ0FBZjs7QUFDQSxZQUFJLENBQUNNLE1BQUwsRUFBYTtBQUNULDRDQUFjRixNQUFNLENBQUNJLElBQXJCLDhCQUEyQyxLQUFLUixJQUFoRDtBQUNBLGlCQUFPLElBQVA7QUFDSDs7QUFDRCxlQUFPTSxNQUFQO0FBQ0g7Ozs7b0ZBbEJBRyxtQjs7Ozs7YUFDcUIsRTs7OztNQXFCYkMsYSxZQURaLG9CQUFRLDRCQUFSLEM7QUFLRywyQkFBYUMsU0FBYixFQUFpQztBQUFBOztBQUFBOztBQUM3QixXQUFLQSxTQUFMLEdBQWlCQSxTQUFTLElBQUksRUFBOUI7QUFDSDs7OzswQkFFV1AsTSxFQUFjO0FBQ3RCLFlBQUksRUFBRUEsTUFBTSxZQUFZQyxVQUFwQixDQUFKLEVBQStCO0FBQzNCO0FBQ0EsaUJBQU8sSUFBUDtBQUNIOztBQUNELFlBQU1DLE1BQU0sR0FBR0YsTUFBTSxDQUFDUSxZQUFQLENBQW9CLEtBQUtELFNBQXpCLENBQWY7O0FBQ0EsWUFBSSxDQUFDTCxNQUFMLEVBQWE7QUFDVCw0Q0FBY0YsTUFBTSxDQUFDSSxJQUFyQixtQ0FBZ0QsS0FBS0csU0FBckQ7QUFDQSxpQkFBTyxJQUFQO0FBQ0g7O0FBQ0QsZUFBT0wsTUFBUDtBQUNIOzs7OzJGQWxCQUcsbUI7Ozs7O2FBQzBCLEU7OztBQW9CL0I7Ozs7Ozs7O0FBS08sV0FBU0ksWUFBVCxDQUF1QkMsSUFBdkIsRUFBMEQ7QUFDN0QsUUFBSVIsTUFBTSxHQUFHUSxJQUFiOztBQUNBLFNBQUssSUFBSUMsS0FBSyxHQUFHLENBQWpCLEVBQW9CQSxLQUFLLHFEQUF6QixFQUEwQyxFQUFFQSxLQUE1QyxFQUFtRDtBQUMvQyxVQUFNZixJQUFJLEdBQVNlLEtBQVQsZ0NBQVNBLEtBQVQsNkJBQVNBLEtBQVQsS0FBVjs7QUFDQSxVQUFJaEIsY0FBYyxDQUFDQyxJQUFELENBQWxCLEVBQTBCO0FBQ3RCLFlBQUksRUFBRUEsSUFBSSxJQUFJTSxNQUFWLENBQUosRUFBdUI7QUFDbkIscUVBQXVDTixJQUF2QztBQUNBLGlCQUFPLElBQVA7QUFDSCxTQUhELE1BR087QUFDSE0sVUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQUNOLElBQUQsQ0FBZjtBQUNIO0FBQ0osT0FQRCxNQU9PO0FBQ0hNLFFBQUFBLE1BQU0sR0FBR04sSUFBSSxDQUFDZ0IsR0FBTCxDQUFTVixNQUFULENBQVQ7QUFDSDs7QUFDRCxVQUFJQSxNQUFNLEtBQUssSUFBZixFQUFxQjtBQUNqQjtBQUNIO0FBQ0o7O0FBQ0QsV0FBT0EsTUFBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vc2NlbmUtZ3JhcGgvbm9kZSc7XHJcbmltcG9ydCB7IHdhcm4gfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcblxyXG5leHBvcnQgdHlwZSBQcm9wZXJ0eVBhdGggPSBzdHJpbmcgfCBudW1iZXI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDdXN0b21UYXJnZXRQYXRoIHtcclxuICAgIC8qKlxyXG4gICAgICogSWYgZXJyb3JzIGFyZSBlbmNvdW50ZXJlZCwgYG51bGxgIHNob3VsZCBiZSByZXR1cm5lZC5cclxuICAgICAqIEBwYXJhbSB0YXJnZXRcclxuICAgICAqL1xyXG4gICAgZ2V0KHRhcmdldDogYW55KTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBUYXJnZXRQYXRoID0gUHJvcGVydHlQYXRoIHwgSUN1c3RvbVRhcmdldFBhdGg7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9wZXJ0eVBhdGggKHBhdGg6IFRhcmdldFBhdGgpOiBwYXRoIGlzIFByb3BlcnR5UGF0aCB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHBhdGggPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBwYXRoID09PSAnbnVtYmVyJztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ3VzdG9tUGF0aDxUIGV4dGVuZHMgSUN1c3RvbVRhcmdldFBhdGg+IChwYXRoOiBUYXJnZXRQYXRoLCBjb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8VD4pOiBwYXRoIGlzIFQge1xyXG4gICAgcmV0dXJuIHBhdGggaW5zdGFuY2VvZiBjb25zdHJ1Y3RvcjtcclxufVxyXG5cclxuQGNjY2xhc3MoJ2NjLmFuaW1hdGlvbi5IaWVyYXJjaHlQYXRoJylcclxuZXhwb3J0IGNsYXNzIEhpZXJhcmNoeVBhdGggaW1wbGVtZW50cyBJQ3VzdG9tVGFyZ2V0UGF0aCB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nID0gJyc7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHBhdGg/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgKHRhcmdldDogTm9kZSkge1xyXG4gICAgICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpKSB7XHJcbiAgICAgICAgICAgIHdhcm4oYFRhcmdldCBvZiBoaWVyYXJjaHkgcGF0aCBzaG91bGQgYmUgb2YgdHlwZSBOb2RlLmApO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGFyZ2V0LmdldENoaWxkQnlQYXRoKHRoaXMucGF0aCk7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgd2FybihgTm9kZSBcIiR7dGFyZ2V0Lm5hbWV9XCIgaGFzIG5vIHBhdGggXCIke3RoaXMucGF0aH1cImApO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG5cclxuQGNjY2xhc3MoJ2NjLmFuaW1hdGlvbi5Db21wb25lbnRQYXRoJylcclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudFBhdGggaW1wbGVtZW50cyBJQ3VzdG9tVGFyZ2V0UGF0aCB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgY29tcG9uZW50OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoY29tcG9uZW50Pzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQgfHwgJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCAodGFyZ2V0OiBOb2RlKSB7XHJcbiAgICAgICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpIHtcclxuICAgICAgICAgICAgd2FybihgVGFyZ2V0IG9mIGNvbXBvbmVudCBwYXRoIHNob3VsZCBiZSBvZiB0eXBlIE5vZGUuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KHRoaXMuY29tcG9uZW50KTtcclxuICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICB3YXJuKGBOb2RlIFwiJHt0YXJnZXQubmFtZX1cIiBoYXMgbm8gY29tcG9uZW50IFwiJHt0aGlzLmNvbXBvbmVudH1cImApO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEV2YWx1YXRlIGEgc2VxdWVuY2Ugb2YgcGF0aHMsIGluIG9yZGVyLCBmcm9tIHNwZWNpZmllZCByb290LlxyXG4gKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBvYmplY3QuXHJcbiAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHNlcXVlbmNlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV2YWx1YXRlUGF0aCAocm9vdDogYW55LCAuLi5wYXRoczogVGFyZ2V0UGF0aFtdKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gcm9vdDtcclxuICAgIGZvciAobGV0IGlQYXRoID0gMDsgaVBhdGggPCBwYXRocy5sZW5ndGg7ICsraVBhdGgpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gcGF0aHNbaVBhdGhdO1xyXG4gICAgICAgIGlmIChpc1Byb3BlcnR5UGF0aChwYXRoKSkge1xyXG4gICAgICAgICAgICBpZiAoIShwYXRoIGluIHJlc3VsdCkpIHtcclxuICAgICAgICAgICAgICAgIHdhcm4oYFRhcmdldCBvYmplY3QgaGFzIG5vIHByb3BlcnR5IFwiJHtwYXRofVwiYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFtwYXRoXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHBhdGguZ2V0KHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4iXX0=