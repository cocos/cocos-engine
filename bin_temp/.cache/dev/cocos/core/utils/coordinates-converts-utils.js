(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/index.js", "./deprecated.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/index.js"), require("./deprecated.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.deprecated, global.globalExports);
    global.coordinatesConvertsUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _deprecated, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WorldNode3DToLocalNodeUI = WorldNode3DToLocalNodeUI;
  _exports.WorldNode3DToWorldNodeUI = WorldNode3DToWorldNodeUI;
  _exports.convertUtils = void 0;

  /**
   * @category pipeline
   */
  var _vec3 = new _index.Vec3();
  /**
   * @en
   * Conversion of non-UI nodes to UI Node (Local) Space coordinate system.
   * @zh
   * 非 UI 节点转换到 UI 节点(局部) 空间坐标系。
   * @deprecated 将在 1.2 移除，请使用 Camera 的 `convertToUINode`。
   * @param mainCamera 主相机。
   * @param wpos 世界空间位置。
   * @param uiNode UI节点。
   * @param out 返回局部坐标。
   */


  function WorldNode3DToLocalNodeUI(mainCamera, wpos, uiNode, out) {
    if (!out) {
      out = new _index.Vec3();
    }

    mainCamera.convertToUINode(wpos, uiNode, out);
    var pos = uiNode.position;
    out.add(pos);
    return out;
  }
  /**
   * @en
   * Conversion of non-UI nodes to UI Node (World) Space coordinate system.
   * @zh
   * 非 UI 节点转换到 UI 节点(世界) 空间坐标系。
   * @deprecated 将在 1.2 移除，请使用 Camera 的 `convertToUINode`。
   * @param mainCamera 主相机。
   * @param wpos 世界空间位置。
   * @param out 返回世界坐标。
   */


  function WorldNode3DToWorldNodeUI(mainCamera, wpos, out) {
    if (!out) {
      out = new _index.Vec3();
    }

    mainCamera.worldToScreen(wpos, out);
    out.x = out.x / _globalExports.legacyCC.view.getScaleX();
    out.y = out.y / _globalExports.legacyCC.view.getScaleY();
    return out;
  }
  /**
   * @deprecated 将在 1.2 移除，请使用 Camera 的 `convertToUINode`。
   */


  var convertUtils = {
    WorldNode3DToLocalNodeUI: WorldNode3DToLocalNodeUI,
    WorldNode3DToWorldNodeUI: WorldNode3DToWorldNodeUI
  };
  _exports.convertUtils = convertUtils;
  _globalExports.legacyCC.pipelineUtils = convertUtils;
  (0, _deprecated.replaceProperty)(_globalExports.legacyCC.pipelineUtils, 'cc.pipelineUtils', [{
    'name': 'WorldNode3DToLocalNodeUI',
    'newName': 'convertToUINode',
    'targetName': 'cc.Camera.prototype',
    'customFunction': function customFunction() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var camera = args[0];
      var out = args[3] || _vec3;
      camera.convertToUINode(args[1], args[2], out);
      out.add(args[2].position);
      return args[3] || out.clone();
    }
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvY29vcmRpbmF0ZXMtY29udmVydHMtdXRpbHMudHMiXSwibmFtZXMiOlsiX3ZlYzMiLCJWZWMzIiwiV29ybGROb2RlM0RUb0xvY2FsTm9kZVVJIiwibWFpbkNhbWVyYSIsIndwb3MiLCJ1aU5vZGUiLCJvdXQiLCJjb252ZXJ0VG9VSU5vZGUiLCJwb3MiLCJwb3NpdGlvbiIsImFkZCIsIldvcmxkTm9kZTNEVG9Xb3JsZE5vZGVVSSIsIndvcmxkVG9TY3JlZW4iLCJ4IiwibGVnYWN5Q0MiLCJ2aWV3IiwiZ2V0U2NhbGVYIiwieSIsImdldFNjYWxlWSIsImNvbnZlcnRVdGlscyIsInBpcGVsaW5lVXRpbHMiLCJhcmdzIiwiY2FtZXJhIiwiY2xvbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBVUEsTUFBTUEsS0FBSyxHQUFHLElBQUlDLFdBQUosRUFBZDtBQUVBOzs7Ozs7Ozs7Ozs7O0FBV08sV0FBU0Msd0JBQVQsQ0FBbUNDLFVBQW5DLEVBQXVEQyxJQUF2RCxFQUFtRUMsTUFBbkUsRUFBaUZDLEdBQWpGLEVBQTZGO0FBQ2hHLFFBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ05BLE1BQUFBLEdBQUcsR0FBRyxJQUFJTCxXQUFKLEVBQU47QUFDSDs7QUFFREUsSUFBQUEsVUFBVSxDQUFDSSxlQUFYLENBQTJCSCxJQUEzQixFQUFpQ0MsTUFBakMsRUFBeUNDLEdBQXpDO0FBQ0EsUUFBTUUsR0FBRyxHQUFHSCxNQUFNLENBQUNJLFFBQW5CO0FBQ0FILElBQUFBLEdBQUcsQ0FBQ0ksR0FBSixDQUFRRixHQUFSO0FBQ0EsV0FBT0YsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztBQVVPLFdBQVNLLHdCQUFULENBQW1DUixVQUFuQyxFQUF1REMsSUFBdkQsRUFBbUVFLEdBQW5FLEVBQThFO0FBQ2pGLFFBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ05BLE1BQUFBLEdBQUcsR0FBRyxJQUFJTCxXQUFKLEVBQU47QUFDSDs7QUFFREUsSUFBQUEsVUFBVSxDQUFDUyxhQUFYLENBQXlCUixJQUF6QixFQUErQkUsR0FBL0I7QUFDQUEsSUFBQUEsR0FBRyxDQUFDTyxDQUFKLEdBQVFQLEdBQUcsQ0FBQ08sQ0FBSixHQUFRQyx3QkFBU0MsSUFBVCxDQUFjQyxTQUFkLEVBQWhCO0FBQ0FWLElBQUFBLEdBQUcsQ0FBQ1csQ0FBSixHQUFRWCxHQUFHLENBQUNXLENBQUosR0FBUUgsd0JBQVNDLElBQVQsQ0FBY0csU0FBZCxFQUFoQjtBQUNBLFdBQU9aLEdBQVA7QUFDSDtBQUVEOzs7OztBQUdBLE1BQU1hLFlBQVksR0FBRztBQUNqQmpCLElBQUFBLHdCQUF3QixFQUF4QkEsd0JBRGlCO0FBRWpCUyxJQUFBQSx3QkFBd0IsRUFBeEJBO0FBRmlCLEdBQXJCOztBQU1BRywwQkFBU00sYUFBVCxHQUF5QkQsWUFBekI7QUFFQSxtQ0FBZ0JMLHdCQUFTTSxhQUF6QixFQUF3QyxrQkFBeEMsRUFBNEQsQ0FDeEQ7QUFDSSxZQUFRLDBCQURaO0FBRUksZUFBVyxpQkFGZjtBQUdJLGtCQUFjLHFCQUhsQjtBQUlJLHNCQUFrQiwwQkFBMEI7QUFBQSx3Q0FBYkMsSUFBYTtBQUFiQSxRQUFBQSxJQUFhO0FBQUE7O0FBQ3hDLFVBQU1DLE1BQU0sR0FBR0QsSUFBSSxDQUFDLENBQUQsQ0FBbkI7QUFDQSxVQUFNZixHQUFHLEdBQUdlLElBQUksQ0FBQyxDQUFELENBQUosSUFBV3JCLEtBQXZCO0FBQ0FzQixNQUFBQSxNQUFNLENBQUNmLGVBQVAsQ0FBdUJjLElBQUksQ0FBQyxDQUFELENBQTNCLEVBQWdDQSxJQUFJLENBQUMsQ0FBRCxDQUFwQyxFQUF5Q2YsR0FBekM7QUFDQUEsTUFBQUEsR0FBRyxDQUFDSSxHQUFKLENBQVFXLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUVosUUFBaEI7QUFDQSxhQUFPWSxJQUFJLENBQUMsQ0FBRCxDQUFKLElBQVdmLEdBQUcsQ0FBQ2lCLEtBQUosRUFBbEI7QUFDSDtBQVZMLEdBRHdELENBQTVEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaXBlbGluZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENhbWVyYSB9IGZyb20gJy4uLzNkL2ZyYW1ld29yay9jYW1lcmEtY29tcG9uZW50JztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vc2NlbmUtZ3JhcGgnO1xyXG5pbXBvcnQgeyByZXBsYWNlUHJvcGVydHkgfSBmcm9tICcuL2RlcHJlY2F0ZWQnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmNvbnN0IF92ZWMzID0gbmV3IFZlYzMoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQ29udmVyc2lvbiBvZiBub24tVUkgbm9kZXMgdG8gVUkgTm9kZSAoTG9jYWwpIFNwYWNlIGNvb3JkaW5hdGUgc3lzdGVtLlxyXG4gKiBAemhcclxuICog6Z2eIFVJIOiKgueCuei9rOaNouWIsCBVSSDoioLngrko5bGA6YOoKSDnqbrpl7TlnZDmoIfns7vjgIJcclxuICogQGRlcHJlY2F0ZWQg5bCG5ZyoIDEuMiDnp7vpmaTvvIzor7fkvb/nlKggQ2FtZXJhIOeahCBgY29udmVydFRvVUlOb2RlYOOAglxyXG4gKiBAcGFyYW0gbWFpbkNhbWVyYSDkuLvnm7jmnLrjgIJcclxuICogQHBhcmFtIHdwb3Mg5LiW55WM56m66Ze05L2N572u44CCXHJcbiAqIEBwYXJhbSB1aU5vZGUgVUnoioLngrnjgIJcclxuICogQHBhcmFtIG91dCDov5Tlm57lsYDpg6jlnZDmoIfjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBXb3JsZE5vZGUzRFRvTG9jYWxOb2RlVUkgKG1haW5DYW1lcmE6IENhbWVyYSwgd3BvczogVmVjMywgdWlOb2RlOiBOb2RlLCBvdXQ/OiBWZWMzKSB7XHJcbiAgICBpZiAoIW91dCkge1xyXG4gICAgICAgIG91dCA9IG5ldyBWZWMzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFpbkNhbWVyYS5jb252ZXJ0VG9VSU5vZGUod3BvcywgdWlOb2RlLCBvdXQpO1xyXG4gICAgY29uc3QgcG9zID0gdWlOb2RlLnBvc2l0aW9uO1xyXG4gICAgb3V0LmFkZChwb3MpO1xyXG4gICAgcmV0dXJuIG91dDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBDb252ZXJzaW9uIG9mIG5vbi1VSSBub2RlcyB0byBVSSBOb2RlIChXb3JsZCkgU3BhY2UgY29vcmRpbmF0ZSBzeXN0ZW0uXHJcbiAqIEB6aFxyXG4gKiDpnZ4gVUkg6IqC54K56L2s5o2i5YiwIFVJIOiKgueCuSjkuJbnlYwpIOepuumXtOWdkOagh+ezu+OAglxyXG4gKiBAZGVwcmVjYXRlZCDlsIblnKggMS4yIOenu+mZpO+8jOivt+S9v+eUqCBDYW1lcmEg55qEIGBjb252ZXJ0VG9VSU5vZGVg44CCXHJcbiAqIEBwYXJhbSBtYWluQ2FtZXJhIOS4u+ebuOacuuOAglxyXG4gKiBAcGFyYW0gd3BvcyDkuJbnlYznqbrpl7TkvY3nva7jgIJcclxuICogQHBhcmFtIG91dCDov5Tlm57kuJbnlYzlnZDmoIfjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBXb3JsZE5vZGUzRFRvV29ybGROb2RlVUkgKG1haW5DYW1lcmE6IENhbWVyYSwgd3BvczogVmVjMywgb3V0PzogVmVjMyl7XHJcbiAgICBpZiAoIW91dCkge1xyXG4gICAgICAgIG91dCA9IG5ldyBWZWMzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFpbkNhbWVyYS53b3JsZFRvU2NyZWVuKHdwb3MsIG91dCk7XHJcbiAgICBvdXQueCA9IG91dC54IC8gbGVnYWN5Q0Mudmlldy5nZXRTY2FsZVgoKTtcclxuICAgIG91dC55ID0gb3V0LnkgLyBsZWdhY3lDQy52aWV3LmdldFNjYWxlWSgpO1xyXG4gICAgcmV0dXJuIG91dDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXByZWNhdGVkIOWwhuWcqCAxLjIg56e76Zmk77yM6K+35L2/55SoIENhbWVyYSDnmoQgYGNvbnZlcnRUb1VJTm9kZWDjgIJcclxuICovXHJcbmNvbnN0IGNvbnZlcnRVdGlscyA9IHtcclxuICAgIFdvcmxkTm9kZTNEVG9Mb2NhbE5vZGVVSSxcclxuICAgIFdvcmxkTm9kZTNEVG9Xb3JsZE5vZGVVSSxcclxufTtcclxuXHJcbmV4cG9ydCB7IGNvbnZlcnRVdGlscyB9O1xyXG5sZWdhY3lDQy5waXBlbGluZVV0aWxzID0gY29udmVydFV0aWxzO1xyXG5cclxucmVwbGFjZVByb3BlcnR5KGxlZ2FjeUNDLnBpcGVsaW5lVXRpbHMsICdjYy5waXBlbGluZVV0aWxzJywgW1xyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ1dvcmxkTm9kZTNEVG9Mb2NhbE5vZGVVSScsXHJcbiAgICAgICAgJ25ld05hbWUnOiAnY29udmVydFRvVUlOb2RlJyxcclxuICAgICAgICAndGFyZ2V0TmFtZSc6ICdjYy5DYW1lcmEucHJvdG90eXBlJyxcclxuICAgICAgICAnY3VzdG9tRnVuY3Rpb24nOiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICAgICAgY29uc3QgY2FtZXJhID0gYXJnc1swXSBhcyBDYW1lcmE7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dCA9IGFyZ3NbM10gfHwgX3ZlYzM7XHJcbiAgICAgICAgICAgIGNhbWVyYS5jb252ZXJ0VG9VSU5vZGUoYXJnc1sxXSwgYXJnc1syXSwgb3V0KTtcclxuICAgICAgICAgICAgb3V0LmFkZChhcmdzWzJdLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbM10gfHwgb3V0LmNsb25lKCk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbl0pO1xyXG4iXX0=