(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "./animation.js", "./easing.js", "./target-path.js", "./value-proxy-factories/uniform.js", "../global-exports.js", "./deprecated.js", "./bezier.js", "./animation-curve.js", "./animation-clip.js", "./animation-manager.js", "./animation-state.js", "./animation-component.js", "./skeletal-animation-data-hub.js", "./skeletal-animation-state.js", "./skeletal-animation.js", "./transform-utils.js", "./cubic-spline-value.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("./animation.js"), require("./easing.js"), require("./target-path.js"), require("./value-proxy-factories/uniform.js"), require("../global-exports.js"), require("./deprecated.js"), require("./bezier.js"), require("./animation-curve.js"), require("./animation-clip.js"), require("./animation-manager.js"), require("./animation-state.js"), require("./animation-component.js"), require("./skeletal-animation-data-hub.js"), require("./skeletal-animation-state.js"), require("./skeletal-animation.js"), require("./transform-utils.js"), require("./cubic-spline-value.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.animation, global.easing, global.targetPath, global.uniform, global.globalExports, global.deprecated, global.bezier, global.animationCurve, global.animationClip, global.animationManager, global.animationState, global.animationComponent, global.skeletalAnimationDataHub, global.skeletalAnimationState, global.skeletalAnimation, global.transformUtils, global.cubicSplineValue);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, animation, easing, _targetPath, _uniform, _globalExports, _deprecated, _bezier, _animationCurve, _animationClip, _animationManager, _animationState, _animationComponent, _skeletalAnimationDataHub, _skeletalAnimationState, _skeletalAnimation, _transformUtils, _cubicSplineValue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    HierachyModifier: true,
    ComponentModifier: true,
    CurveValueAdapter: true,
    UniformCurveValueAdapter: true,
    isPropertyModifier: true,
    isElementModifier: true,
    isCustomTargetModifier: true,
    animation: true,
    easing: true,
    AnimationState: true
  };
  _exports.isPropertyModifier = isPropertyModifier;
  _exports.isElementModifier = isElementModifier;
  _exports.isCustomTargetModifier = isCustomTargetModifier;
  Object.defineProperty(_exports, "AnimationState", {
    enumerable: true,
    get: function () {
      return _animationState.AnimationState;
    }
  });
  _exports.easing = _exports.animation = _exports.UniformCurveValueAdapter = _exports.CurveValueAdapter = _exports.ComponentModifier = _exports.HierachyModifier = void 0;
  animation = _interopRequireWildcard(animation);
  _exports.animation = animation;
  easing = _interopRequireWildcard(easing);
  _exports.easing = easing;
  Object.keys(_deprecated).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _deprecated[key];
      }
    });
  });
  Object.keys(_bezier).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _bezier[key];
      }
    });
  });
  Object.keys(_animationCurve).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _animationCurve[key];
      }
    });
  });
  Object.keys(_animationClip).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _animationClip[key];
      }
    });
  });
  Object.keys(_animationManager).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _animationManager[key];
      }
    });
  });
  Object.keys(_animationComponent).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _animationComponent[key];
      }
    });
  });
  Object.keys(_skeletalAnimationDataHub).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _skeletalAnimationDataHub[key];
      }
    });
  });
  Object.keys(_skeletalAnimationState).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _skeletalAnimationState[key];
      }
    });
  });
  Object.keys(_skeletalAnimation).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _skeletalAnimation[key];
      }
    });
  });
  Object.keys(_transformUtils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _transformUtils[key];
      }
    });
  });
  Object.keys(_cubicSplineValue).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _cubicSplineValue[key];
      }
    });
  });

  var _dec, _class, _dec2, _class2, _dec3, _class3, _dec4, _class4;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  _globalExports.legacyCC.easing = easing;

  /**
   * Alias of `HierarchyPath`.
   * @deprecated Since v1.1.
   */
  var HierachyModifier = (_dec = (0, _index.ccclass)('cc.HierachyModifier'), _dec(_class = /*#__PURE__*/function (_HierarchyPath) {
    _inherits(HierachyModifier, _HierarchyPath);

    function HierachyModifier() {
      _classCallCheck(this, HierachyModifier);

      return _possibleConstructorReturn(this, _getPrototypeOf(HierachyModifier).apply(this, arguments));
    }

    return HierachyModifier;
  }(_targetPath.HierarchyPath)) || _class);
  _exports.HierachyModifier = HierachyModifier;
  _globalExports.legacyCC.HierachyModifier = HierachyModifier;
  /**
   * Alias of `ComponentPath`.
   * @deprecated Since v1.1.
   */

  var ComponentModifier = (_dec2 = (0, _index.ccclass)('cc.ComponentModifier'), _dec2(_class2 = /*#__PURE__*/function (_ComponentPath) {
    _inherits(ComponentModifier, _ComponentPath);

    function ComponentModifier() {
      _classCallCheck(this, ComponentModifier);

      return _possibleConstructorReturn(this, _getPrototypeOf(ComponentModifier).apply(this, arguments));
    }

    return ComponentModifier;
  }(_targetPath.ComponentPath)) || _class2);
  _exports.ComponentModifier = ComponentModifier;
  _globalExports.legacyCC.ComponentModifier = ComponentModifier;
  /**
   * Implements `IValueProxyFactory` but do nothing.
   * @deprecated Since v1.1.
   */

  var CurveValueAdapter = (_dec3 = (0, _index.ccclass)('cc.CurveValueAdapter'), _dec3(_class3 = /*#__PURE__*/function () {
    function CurveValueAdapter() {
      _classCallCheck(this, CurveValueAdapter);
    }

    _createClass(CurveValueAdapter, [{
      key: "forTarget",
      value: function forTarget(target) {
        return {
          set: function set() {}
        };
      }
    }]);

    return CurveValueAdapter;
  }()) || _class3);
  _exports.CurveValueAdapter = CurveValueAdapter;
  _globalExports.legacyCC.CurveValueAdapter = CurveValueAdapter;
  /**
   * Alias of `UniformProxyFactory`.
   * @deprecated Since v1.1.
   */

  var UniformCurveValueAdapter = (_dec4 = (0, _index.ccclass)('cc.UniformCurveValueAdapter'), _dec4(_class4 = /*#__PURE__*/function (_UniformProxyFactory) {
    _inherits(UniformCurveValueAdapter, _UniformProxyFactory);

    function UniformCurveValueAdapter() {
      _classCallCheck(this, UniformCurveValueAdapter);

      return _possibleConstructorReturn(this, _getPrototypeOf(UniformCurveValueAdapter).apply(this, arguments));
    }

    return UniformCurveValueAdapter;
  }(_uniform.UniformProxyFactory)) || _class4);
  _exports.UniformCurveValueAdapter = UniformCurveValueAdapter;
  _globalExports.legacyCC.UniformCurveValueAdapter = UniformCurveValueAdapter;
  /**
   * Alias of `isPropertyPath(path) && typeof path === 'string'`.
   * @deprecated Since v1.1.
   */

  function isPropertyModifier(path) {
    return typeof path === 'string';
  }

  _globalExports.legacyCC.isPropertyModifier = isPropertyModifier;
  /**
   * Alias of `isPropertyPath(path) && typeof path === 'number'`.
   * @deprecated Since v1.1.
   */

  function isElementModifier(path) {
    return typeof path === 'number';
  }

  _globalExports.legacyCC.isElementModifier = isElementModifier;
  /**
   * Alias of `isCustomPath()`.
   * @deprecated Since v1.1.
   */

  function isCustomTargetModifier(path, constructor) {
    return path instanceof constructor;
  }

  _globalExports.legacyCC.isCustomTargetModifier = isCustomTargetModifier;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwiZWFzaW5nIiwiSGllcmFjaHlNb2RpZmllciIsIkhpZXJhcmNoeVBhdGgiLCJDb21wb25lbnRNb2RpZmllciIsIkNvbXBvbmVudFBhdGgiLCJDdXJ2ZVZhbHVlQWRhcHRlciIsInRhcmdldCIsInNldCIsIlVuaWZvcm1DdXJ2ZVZhbHVlQWRhcHRlciIsIlVuaWZvcm1Qcm94eUZhY3RvcnkiLCJpc1Byb3BlcnR5TW9kaWZpZXIiLCJwYXRoIiwiaXNFbGVtZW50TW9kaWZpZXIiLCJpc0N1c3RvbVRhcmdldE1vZGlmaWVyIiwiY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFwQkFBLDBCQUFTQyxNQUFULEdBQWtCQSxNQUFsQjs7QUFzQkE7Ozs7TUFLYUMsZ0IsV0FEWixvQkFBUSxxQkFBUixDOzs7Ozs7Ozs7O0lBQ3FDQyx5Qjs7QUFDdENILDBCQUFTRSxnQkFBVCxHQUE0QkEsZ0JBQTVCO0FBRUE7Ozs7O01BS2FFLGlCLFlBRFosb0JBQVEsc0JBQVIsQzs7Ozs7Ozs7OztJQUNzQ0MseUI7O0FBQ3ZDTCwwQkFBU0ksaUJBQVQsR0FBNkJBLGlCQUE3QjtBQUVBOzs7OztNQUthRSxpQixZQURaLG9CQUFRLHNCQUFSLEM7Ozs7Ozs7Z0NBRXFCQyxNLEVBQWE7QUFDM0IsZUFBTztBQUNIQyxVQUFBQSxHQUFHLEVBQUUsZUFBTSxDQUVWO0FBSEUsU0FBUDtBQUtIOzs7Ozs7QUFFTFIsMEJBQVNNLGlCQUFULEdBQTZCQSxpQkFBN0I7QUFFQTs7Ozs7TUFLYUcsd0IsWUFEWixvQkFBUSw2QkFBUixDOzs7Ozs7Ozs7O0lBQzZDQyw0Qjs7QUFDOUNWLDBCQUFTUyx3QkFBVCxHQUFvQ0Esd0JBQXBDO0FBRUE7Ozs7O0FBSU8sV0FBU0Usa0JBQVQsQ0FBNkJDLElBQTdCLEVBQStEO0FBQ2xFLFdBQU8sT0FBT0EsSUFBUCxLQUFnQixRQUF2QjtBQUNIOztBQUNEWiwwQkFBU1csa0JBQVQsR0FBOEJBLGtCQUE5QjtBQUVBOzs7OztBQUlPLFdBQVNFLGlCQUFULENBQTRCRCxJQUE1QixFQUE4RDtBQUNqRSxXQUFPLE9BQU9BLElBQVAsS0FBZ0IsUUFBdkI7QUFDSDs7QUFDRFosMEJBQVNhLGlCQUFULEdBQTZCQSxpQkFBN0I7QUFFQTs7Ozs7QUFJTyxXQUFTQyxzQkFBVCxDQUE4REYsSUFBOUQsRUFBZ0ZHLFdBQWhGLEVBQXdIO0FBQzNILFdBQU9ILElBQUksWUFBWUcsV0FBdkI7QUFDSDs7QUFDRGYsMEJBQVNjLHNCQUFULEdBQWtDQSxzQkFBbEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuaW1wb3J0IHsgY2NjbGFzcyB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCAqIGFzIGFuaW1hdGlvbiBmcm9tICcuL2FuaW1hdGlvbic7XHJcbmltcG9ydCAqIGFzIGVhc2luZyBmcm9tICcuL2Vhc2luZyc7XHJcbmltcG9ydCB7IENvbXBvbmVudFBhdGgsIEhpZXJhcmNoeVBhdGgsIElDdXN0b21UYXJnZXRQYXRoLCBUYXJnZXRQYXRoIH0gZnJvbSAnLi90YXJnZXQtcGF0aCc7XHJcbmltcG9ydCB7IElWYWx1ZVByb3h5RmFjdG9yeSB9IGZyb20gJy4vdmFsdWUtcHJveHknO1xyXG5pbXBvcnQgeyBVbmlmb3JtUHJveHlGYWN0b3J5IH0gZnJvbSAnLi92YWx1ZS1wcm94eS1mYWN0b3JpZXMvdW5pZm9ybSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9kZXByZWNhdGVkJztcclxuXHJcbmxlZ2FjeUNDLmVhc2luZyA9IGVhc2luZztcclxuZXhwb3J0ICogZnJvbSAnLi9iZXppZXInO1xyXG5leHBvcnQgeyBlYXNpbmcgfTtcclxuZXhwb3J0ICogZnJvbSAnLi9hbmltYXRpb24tY3VydmUnO1xyXG5leHBvcnQgKiBmcm9tICcuL2FuaW1hdGlvbi1jbGlwJztcclxuZXhwb3J0ICogZnJvbSAnLi9hbmltYXRpb24tbWFuYWdlcic7XHJcbmV4cG9ydCB7XHJcbiAgICBBbmltYXRpb25TdGF0ZSxcclxufSBmcm9tICcuL2FuaW1hdGlvbi1zdGF0ZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vYW5pbWF0aW9uLWNvbXBvbmVudCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vc2tlbGV0YWwtYW5pbWF0aW9uLWRhdGEtaHViJztcclxuZXhwb3J0ICogZnJvbSAnLi9za2VsZXRhbC1hbmltYXRpb24tc3RhdGUnO1xyXG5leHBvcnQgKiBmcm9tICcuL3NrZWxldGFsLWFuaW1hdGlvbic7XHJcbmV4cG9ydCAqIGZyb20gJy4vdHJhbnNmb3JtLXV0aWxzJztcclxuZXhwb3J0IHsgYW5pbWF0aW9uIH07XHJcblxyXG4vKipcclxuICogVXNlIHN0dWZmcyBpbiBgaW1wb3J0KCdjYycpLmFuaW1hdGlvbmAgaW5zdGVhZC5cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMS5cclxuICovXHJcbmV4cG9ydCAqIGZyb20gJy4vY3ViaWMtc3BsaW5lLXZhbHVlJztcclxuXHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBgSGllcmFyY2h5UGF0aGAuXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjEuXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuSGllcmFjaHlNb2RpZmllcicpXHJcbmV4cG9ydCBjbGFzcyBIaWVyYWNoeU1vZGlmaWVyIGV4dGVuZHMgSGllcmFyY2h5UGF0aCB7fVxyXG5sZWdhY3lDQy5IaWVyYWNoeU1vZGlmaWVyID0gSGllcmFjaHlNb2RpZmllcjtcclxuXHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBgQ29tcG9uZW50UGF0aGAuXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjEuXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQ29tcG9uZW50TW9kaWZpZXInKVxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50TW9kaWZpZXIgZXh0ZW5kcyBDb21wb25lbnRQYXRoIHt9XHJcbmxlZ2FjeUNDLkNvbXBvbmVudE1vZGlmaWVyID0gQ29tcG9uZW50TW9kaWZpZXI7XHJcblxyXG4vKipcclxuICogSW1wbGVtZW50cyBgSVZhbHVlUHJveHlGYWN0b3J5YCBidXQgZG8gbm90aGluZy5cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMS5cclxuICovXHJcbkBjY2NsYXNzKCdjYy5DdXJ2ZVZhbHVlQWRhcHRlcicpXHJcbmV4cG9ydCBjbGFzcyBDdXJ2ZVZhbHVlQWRhcHRlciBpbXBsZW1lbnRzIElWYWx1ZVByb3h5RmFjdG9yeSB7XHJcbiAgICBwdWJsaWMgZm9yVGFyZ2V0ICh0YXJnZXQ6IGFueSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNldDogKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmxlZ2FjeUNDLkN1cnZlVmFsdWVBZGFwdGVyID0gQ3VydmVWYWx1ZUFkYXB0ZXI7XHJcblxyXG4vKipcclxuICogQWxpYXMgb2YgYFVuaWZvcm1Qcm94eUZhY3RvcnlgLlxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4xLlxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlVuaWZvcm1DdXJ2ZVZhbHVlQWRhcHRlcicpXHJcbmV4cG9ydCBjbGFzcyBVbmlmb3JtQ3VydmVWYWx1ZUFkYXB0ZXIgZXh0ZW5kcyBVbmlmb3JtUHJveHlGYWN0b3J5IHt9XHJcbmxlZ2FjeUNDLlVuaWZvcm1DdXJ2ZVZhbHVlQWRhcHRlciA9IFVuaWZvcm1DdXJ2ZVZhbHVlQWRhcHRlcjtcclxuXHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBgaXNQcm9wZXJ0eVBhdGgocGF0aCkgJiYgdHlwZW9mIHBhdGggPT09ICdzdHJpbmcnYC5cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3BlcnR5TW9kaWZpZXIgKHBhdGg6IFRhcmdldFBhdGgpOiBwYXRoIGlzIHN0cmluZyB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHBhdGggPT09ICdzdHJpbmcnO1xyXG59XHJcbmxlZ2FjeUNDLmlzUHJvcGVydHlNb2RpZmllciA9IGlzUHJvcGVydHlNb2RpZmllcjtcclxuXHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBgaXNQcm9wZXJ0eVBhdGgocGF0aCkgJiYgdHlwZW9mIHBhdGggPT09ICdudW1iZXInYC5cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0VsZW1lbnRNb2RpZmllciAocGF0aDogVGFyZ2V0UGF0aCk6IHBhdGggaXMgbnVtYmVyIHtcclxuICAgIHJldHVybiB0eXBlb2YgcGF0aCA9PT0gJ251bWJlcic7XHJcbn1cclxubGVnYWN5Q0MuaXNFbGVtZW50TW9kaWZpZXIgPSBpc0VsZW1lbnRNb2RpZmllcjtcclxuXHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBgaXNDdXN0b21QYXRoKClgLlxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4xLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ3VzdG9tVGFyZ2V0TW9kaWZpZXI8VCBleHRlbmRzIElDdXN0b21UYXJnZXRQYXRoPiAocGF0aDogVGFyZ2V0UGF0aCwgY29uc3RydWN0b3I6IENvbnN0cnVjdG9yPFQ+KTogcGF0aCBpcyBUIHtcclxuICAgIHJldHVybiBwYXRoIGluc3RhbmNlb2YgY29uc3RydWN0b3I7XHJcbn1cclxubGVnYWN5Q0MuaXNDdXN0b21UYXJnZXRNb2RpZmllciA9IGlzQ3VzdG9tVGFyZ2V0TW9kaWZpZXI7XHJcbiJdfQ==