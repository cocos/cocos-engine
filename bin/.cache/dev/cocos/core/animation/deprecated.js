(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/deprecated.js", "./animation-component.js", "./skeletal-animation.js", "../utils/js.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/deprecated.js"), require("./animation-component.js"), require("./skeletal-animation.js"), require("../utils/js.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.deprecated, global.animationComponent, global.skeletalAnimation, global.js, global.globalExports);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _deprecated, _animationComponent, _skeletalAnimation, _js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "AnimationComponent", {
    enumerable: true,
    get: function () {
      return _animationComponent.Animation;
    }
  });
  Object.defineProperty(_exports, "SkeletalAnimationComponent", {
    enumerable: true,
    get: function () {
      return _skeletalAnimation.SkeletalAnimation;
    }
  });

  /**
   * @category animation
   */
  // deprecated
  (0, _deprecated.replaceProperty)(_animationComponent.Animation.prototype, 'Animation', [{
    'name': 'getAnimationState',
    'newName': 'getState'
  }, {
    'name': 'addClip',
    'newName': 'createState'
  }, {
    'name': 'removeClip',
    'newName': 'removeState',
    'customFunction': function customFunction() {
      var arg0 = arguments.length <= 0 ? undefined : arguments[0];
      return _animationComponent.Animation.prototype.removeState.call(this, arg0.name);
    }
  }]);
  /**
   * Alias of [[Animation]]
   * @deprecated Since v1.2
   */

  _globalExports.legacyCC.AnimationComponent = _animationComponent.Animation;

  _js.js.setClassAlias(_animationComponent.Animation, 'cc.AnimationComponent');
  /**
   * Alias of [[SkeletalAnimation]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SkeletalAnimationComponent = _skeletalAnimation.SkeletalAnimation;

  _js.js.setClassAlias(_skeletalAnimation.SkeletalAnimation, 'cc.SkeletalAnimationComponent');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2RlcHJlY2F0ZWQudHMiXSwibmFtZXMiOlsiQW5pbWF0aW9uIiwicHJvdG90eXBlIiwiYXJnMCIsInJlbW92ZVN0YXRlIiwiY2FsbCIsIm5hbWUiLCJsZWdhY3lDQyIsIkFuaW1hdGlvbkNvbXBvbmVudCIsImpzIiwic2V0Q2xhc3NBbGlhcyIsIlNrZWxldGFsQW5pbWF0aW9uQ29tcG9uZW50IiwiU2tlbGV0YWxBbmltYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBV0E7QUFDQSxtQ0FBZ0JBLDhCQUFVQyxTQUExQixFQUFxQyxXQUFyQyxFQUFrRCxDQUM5QztBQUNJLFlBQVEsbUJBRFo7QUFFSSxlQUFXO0FBRmYsR0FEOEMsRUFLOUM7QUFDSSxZQUFRLFNBRFo7QUFFSSxlQUFXO0FBRmYsR0FMOEMsRUFTOUM7QUFDSSxZQUFRLFlBRFo7QUFFSSxlQUFXLGFBRmY7QUFHSSxzQkFBa0IsMEJBQXdCO0FBQ3RDLFVBQUlDLElBQUksbURBQVI7QUFDQSxhQUFPRiw4QkFBVUMsU0FBVixDQUFvQkUsV0FBcEIsQ0FBZ0NDLElBQWhDLENBQXFDLElBQXJDLEVBQTJDRixJQUFJLENBQUNHLElBQWhELENBQVA7QUFDSDtBQU5MLEdBVDhDLENBQWxEO0FBbUJBOzs7OztBQUtBQywwQkFBU0Msa0JBQVQsR0FBOEJQLDZCQUE5Qjs7QUFDQVEsU0FBR0MsYUFBSCxDQUFpQlQsNkJBQWpCLEVBQTRCLHVCQUE1QjtBQUNBOzs7Ozs7QUFLQU0sMEJBQVNJLDBCQUFULEdBQXNDQyxvQ0FBdEM7O0FBQ0FILFNBQUdDLGFBQUgsQ0FBaUJFLG9DQUFqQixFQUFvQywrQkFBcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGFuaW1hdGlvblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IHJlcGxhY2VQcm9wZXJ0eSB9IGZyb20gJy4uL3V0aWxzL2RlcHJlY2F0ZWQnO1xyXG5pbXBvcnQgeyBBbmltYXRpb24gfSBmcm9tICcuL2FuaW1hdGlvbi1jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTa2VsZXRhbEFuaW1hdGlvbiB9IGZyb20gJy4vc2tlbGV0YWwtYW5pbWF0aW9uJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uQ2xpcCB9IGZyb20gJy4vYW5pbWF0aW9uLWNsaXAnO1xyXG5pbXBvcnQgeyBqcyB9IGZyb20gJy4uL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vLyBkZXByZWNhdGVkXHJcbnJlcGxhY2VQcm9wZXJ0eShBbmltYXRpb24ucHJvdG90eXBlLCAnQW5pbWF0aW9uJywgW1xyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ2dldEFuaW1hdGlvblN0YXRlJyxcclxuICAgICAgICAnbmV3TmFtZSc6ICdnZXRTdGF0ZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnYWRkQ2xpcCcsXHJcbiAgICAgICAgJ25ld05hbWUnOiAnY3JlYXRlU3RhdGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ3JlbW92ZUNsaXAnLFxyXG4gICAgICAgICduZXdOYW1lJzogJ3JlbW92ZVN0YXRlJyxcclxuICAgICAgICAnY3VzdG9tRnVuY3Rpb24nOiBmdW5jdGlvbiAoLi4uYXJnczogYW55KSB7XHJcbiAgICAgICAgICAgIGxldCBhcmcwID0gYXJnc1swXSBhcyBBbmltYXRpb25DbGlwO1xyXG4gICAgICAgICAgICByZXR1cm4gQW5pbWF0aW9uLnByb3RvdHlwZS5yZW1vdmVTdGF0ZS5jYWxsKHRoaXMsIGFyZzAubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5dKTtcclxuXHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0FuaW1hdGlvbl1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IEFuaW1hdGlvbiBhcyBBbmltYXRpb25Db21wb25lbnQgfTtcclxubGVnYWN5Q0MuQW5pbWF0aW9uQ29tcG9uZW50ID0gQW5pbWF0aW9uO1xyXG5qcy5zZXRDbGFzc0FsaWFzKEFuaW1hdGlvbiwgJ2NjLkFuaW1hdGlvbkNvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tTa2VsZXRhbEFuaW1hdGlvbl1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IFNrZWxldGFsQW5pbWF0aW9uIGFzIFNrZWxldGFsQW5pbWF0aW9uQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlNrZWxldGFsQW5pbWF0aW9uQ29tcG9uZW50ID0gU2tlbGV0YWxBbmltYXRpb247XHJcbmpzLnNldENsYXNzQWxpYXMoU2tlbGV0YWxBbmltYXRpb24sICdjYy5Ta2VsZXRhbEFuaW1hdGlvbkNvbXBvbmVudCcpO1xyXG4iXX0=