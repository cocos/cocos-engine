(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/index.js", "./ui-component.js", "./ui-transform.js", "./ui-renderable.js", "./canvas.js", "../../utils/js.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/index.js"), require("./ui-component.js"), require("./ui-transform.js"), require("./ui-renderable.js"), require("./canvas.js"), require("../../utils/js.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.uiComponent, global.uiTransform, global.uiRenderable, global.canvas, global.js, global.globalExports);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _uiComponent, _uiTransform, _uiRenderable, _canvas, _js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "UITransformComponent", {
    enumerable: true,
    get: function () {
      return _uiTransform.UITransform;
    }
  });
  Object.defineProperty(_exports, "RenderComponent", {
    enumerable: true,
    get: function () {
      return _uiRenderable.UIRenderable;
    }
  });
  Object.defineProperty(_exports, "CanvasComponent", {
    enumerable: true,
    get: function () {
      return _canvas.Canvas;
    }
  });

  /**
   * @category ui
   */
  (0, _index.removeProperty)(_uiComponent.UIComponent.prototype, 'UIComponent', [{
    name: '_visibility'
  }, {
    name: 'setVisibility'
  }]);
  /**
   * Alias of [[UITransform]]
   * @deprecated Since v1.2
   */

  _globalExports.legacyCC.UITransformComponent = _uiTransform.UITransform;

  _js.js.setClassAlias(_uiTransform.UITransform, 'cc.UITransformComponent');
  /**
   * Alias of [[UIRenderable]]
   * @deprecated Since v1.2
   */


  _js.js.setClassAlias(_uiRenderable.UIRenderable, 'cc.RenderComponent');
  /**
   * Alias of [[Canvas]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.CanvasComponent = _canvas.Canvas;

  _js.js.setClassAlias(_canvas.Canvas, 'cc.CanvasComponent');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL2RlcHJlY2F0ZWQudHMiXSwibmFtZXMiOlsiVUlDb21wb25lbnQiLCJwcm90b3R5cGUiLCJuYW1lIiwibGVnYWN5Q0MiLCJVSVRyYW5zZm9ybUNvbXBvbmVudCIsIlVJVHJhbnNmb3JtIiwianMiLCJzZXRDbGFzc0FsaWFzIiwiVUlSZW5kZXJhYmxlIiwiQ2FudmFzQ29tcG9uZW50IiwiQ2FudmFzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQVlBLDZCQUFlQSx5QkFBWUMsU0FBM0IsRUFBc0MsYUFBdEMsRUFBb0QsQ0FDaEQ7QUFDSUMsSUFBQUEsSUFBSSxFQUFFO0FBRFYsR0FEZ0QsRUFJaEQ7QUFDSUEsSUFBQUEsSUFBSSxFQUFFO0FBRFYsR0FKZ0QsQ0FBcEQ7QUFTQTs7Ozs7QUFLQUMsMEJBQVNDLG9CQUFULEdBQWdDQyx3QkFBaEM7O0FBQ0FDLFNBQUdDLGFBQUgsQ0FBaUJGLHdCQUFqQixFQUE4Qix5QkFBOUI7QUFFQTs7Ozs7O0FBS0FDLFNBQUdDLGFBQUgsQ0FBaUJDLDBCQUFqQixFQUErQixvQkFBL0I7QUFFQTs7Ozs7O0FBS0FMLDBCQUFTTSxlQUFULEdBQTJCQyxjQUEzQjs7QUFDQUosU0FBR0MsYUFBSCxDQUFpQkcsY0FBakIsRUFBeUIsb0JBQXpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IHJlbW92ZVByb3BlcnR5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBVSUNvbXBvbmVudCB9IGZyb20gJy4vdWktY29tcG9uZW50JztcclxuaW1wb3J0IHsgVUlUcmFuc2Zvcm0gfSBmcm9tICcuL3VpLXRyYW5zZm9ybSc7XHJcbmltcG9ydCB7IFVJUmVuZGVyYWJsZSB9IGZyb20gJy4vdWktcmVuZGVyYWJsZSc7XHJcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gJy4vY2FudmFzJztcclxuaW1wb3J0IHsganMgfSBmcm9tICcuLi8uLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoVUlDb21wb25lbnQucHJvdG90eXBlLCAnVUlDb21wb25lbnQnLFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnX3Zpc2liaWxpdHknLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnc2V0VmlzaWJpbGl0eScsXHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1VJVHJhbnNmb3JtXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgVUlUcmFuc2Zvcm0gYXMgVUlUcmFuc2Zvcm1Db21wb25lbnQgfTtcclxubGVnYWN5Q0MuVUlUcmFuc2Zvcm1Db21wb25lbnQgPSBVSVRyYW5zZm9ybTtcclxuanMuc2V0Q2xhc3NBbGlhcyhVSVRyYW5zZm9ybSwgJ2NjLlVJVHJhbnNmb3JtQ29tcG9uZW50Jyk7XHJcblxyXG4vKipcclxuICogQWxpYXMgb2YgW1tVSVJlbmRlcmFibGVdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBVSVJlbmRlcmFibGUgYXMgUmVuZGVyQ29tcG9uZW50IH07XHJcbmpzLnNldENsYXNzQWxpYXMoVUlSZW5kZXJhYmxlLCAnY2MuUmVuZGVyQ29tcG9uZW50Jyk7XHJcblxyXG4vKipcclxuICogQWxpYXMgb2YgW1tDYW52YXNdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBDYW52YXMgYXMgQ2FudmFzQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLkNhbnZhc0NvbXBvbmVudCA9IENhbnZhcztcclxuanMuc2V0Q2xhc3NBbGlhcyhDYW52YXMsICdjYy5DYW52YXNDb21wb25lbnQnKTtcclxuIl19