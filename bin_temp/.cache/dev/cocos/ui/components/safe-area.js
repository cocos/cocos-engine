(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/components/index.js", "../../core/components/ui-base/index.js", "../../core/platform/index.js", "./widget.js", "../../core/global-exports.js", "../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/components/index.js"), require("../../core/components/ui-base/index.js"), require("../../core/platform/index.js"), require("./widget.js"), require("../../core/global-exports.js"), require("../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global.widget, global.globalExports, global.defaultConstants);
    global.safeArea = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _widget, _globalExports, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SafeArea = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * @en
   * This component is used to adjust the layout of current node to respect the safe area of a notched mobile device such as the iPhone X.
   * It is typically used for the top node of the UI interaction area. For specific usage, refer to the official [test-cases-3d/assets/cases/ui/20.safe-area/safe-area.scene](https://github.com/cocos-creator/test-cases-3d).
   *
   * The concept of safe area is to give you a fixed inner rectangle in which you can safely display content that will be drawn on screen.
   * You are strongly discouraged from providing controls outside of this area. But your screen background could embellish edges.
   *
   * This component internally uses the API `sys.getSafeAreaRect();` to obtain the safe area of the current iOS or Android device,
   * and implements the adaptation by using the Widget component and set anchor.
   *
   * @zh
   * 该组件会将所在节点的布局适配到 iPhone X 等异形屏手机的安全区域内，通常用于 UI 交互区域的顶层节点，具体用法可参考官方范例 [test-cases-3d/assets/cases/ui/20.safe-area/safe-area.scene](https://github.com/cocos-creator/test-cases-3d)。
   *
   * 该组件内部通过 API `sys.getSafeAreaRect();` 获取到当前 iOS 或 Android 设备的安全区域，并通过 Widget 组件实现适配。
   *
   */
  var // @ts-ignore
  SafeArea = (_dec = (0, _index.ccclass)('cc.SafeArea'), _dec2 = (0, _index.help)('i18n:cc.SafeArea'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/SafeArea'), _dec5 = (0, _index.requireComponent)(_widget.Widget), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = _dec4(_class = _dec5(_class = /*#__PURE__*/function (_Component) {
    _inherits(SafeArea, _Component);

    function SafeArea() {
      _classCallCheck(this, SafeArea);

      return _possibleConstructorReturn(this, _getPrototypeOf(SafeArea).apply(this, arguments));
    }

    _createClass(SafeArea, [{
      key: "onEnable",
      value: function onEnable() {
        this.updateArea();

        _index4.view.on('canvas-resize', this.updateArea, this);
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        _index4.view.off('canvas-resize', this.updateArea, this);
      }
      /**
       * @en Adapt to safe area
       * @zh 立即适配安全区域
       * @method updateArea
       * @example
       * let safeArea = this.node.addComponent(cc.SafeArea);
       * safeArea.updateArea();
       */

    }, {
      key: "updateArea",
      value: function updateArea() {
        // TODO Remove Widget dependencies in the future
        var widget = this.node.getComponent(_widget.Widget);
        var uiTransComp = this.node.getComponent(_index3.UITransform);

        if (!widget || !uiTransComp) {
          return;
        }

        var winSize = _globalExports.legacyCC.winSize,
            sys = _globalExports.legacyCC.sys;

        if (_defaultConstants.EDITOR) {
          widget.top = widget.bottom = widget.left = widget.right = 0;
          widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
          return;
        } // IMPORTANT: need to update alignment to get the latest position


        widget.updateAlignment();
        var lastPos = this.node.position;
        var lastAnchorPoint = uiTransComp.anchorPoint; //

        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        var screenWidth = winSize.width,
            screenHeight = winSize.height;
        var safeArea = sys.getSafeAreaRect();
        console.log(safeArea);
        widget.top = screenHeight - safeArea.y - safeArea.height;
        widget.bottom = safeArea.y;
        widget.left = safeArea.x;
        widget.right = screenWidth - safeArea.x - safeArea.width;
        widget.updateAlignment(); // set anchor, keep the original position unchanged

        var curPos = this.node.position;
        var anchorX = lastAnchorPoint.x - (curPos.x - lastPos.x) / uiTransComp.width;
        var anchorY = lastAnchorPoint.y - (curPos.y - lastPos.y) / uiTransComp.height;
        uiTransComp.setAnchorPoint(anchorX, anchorY); // IMPORTANT: restore to lastPos even if widget is not ALWAYS

        widget.enabled = true;
      }
    }]);

    return SafeArea;
  }(_index2.Component)) || _class) || _class) || _class) || _class) || _class) || _class);
  _exports.SafeArea = SafeArea;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvc2FmZS1hcmVhLnRzIl0sIm5hbWVzIjpbIlNhZmVBcmVhIiwiV2lkZ2V0IiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJ1cGRhdGVBcmVhIiwidmlldyIsIm9uIiwib2ZmIiwid2lkZ2V0Iiwibm9kZSIsImdldENvbXBvbmVudCIsInVpVHJhbnNDb21wIiwiVUlUcmFuc2Zvcm0iLCJ3aW5TaXplIiwibGVnYWN5Q0MiLCJzeXMiLCJFRElUT1IiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJpc0FsaWduVG9wIiwiaXNBbGlnbkJvdHRvbSIsImlzQWxpZ25MZWZ0IiwiaXNBbGlnblJpZ2h0IiwidXBkYXRlQWxpZ25tZW50IiwibGFzdFBvcyIsInBvc2l0aW9uIiwibGFzdEFuY2hvclBvaW50IiwiYW5jaG9yUG9pbnQiLCJzY3JlZW5XaWR0aCIsIndpZHRoIiwic2NyZWVuSGVpZ2h0IiwiaGVpZ2h0Iiwic2FmZUFyZWEiLCJnZXRTYWZlQXJlYVJlY3QiLCJjb25zb2xlIiwibG9nIiwieSIsIngiLCJjdXJQb3MiLCJhbmNob3JYIiwiYW5jaG9yWSIsInNldEFuY2hvclBvaW50IiwiZW5hYmxlZCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF3QkE7QUFDYUEsRUFBQUEsUSxXQVBaLG9CQUFRLGFBQVIsQyxVQUNBLGlCQUFLLGtCQUFMLEMsVUFDQSwyQkFBZSxHQUFmLEMsVUFFQSxpQkFBSyxhQUFMLEMsVUFDQSw2QkFBaUJDLGNBQWpCLEMsa0RBRkFDLHdCOzs7Ozs7Ozs7OztpQ0FNc0I7QUFDZixhQUFLQyxVQUFMOztBQUNBQyxxQkFBS0MsRUFBTCxDQUFRLGVBQVIsRUFBeUIsS0FBS0YsVUFBOUIsRUFBMEMsSUFBMUM7QUFDSDs7O2tDQUVrQjtBQUNmQyxx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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuIENvcHlyaWdodCAoYykgMjAyMCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCBleGVjdXRlSW5FZGl0TW9kZSwgcmVxdWlyZUNvbXBvbmVudCB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IFVJVHJhbnNmb3JtIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2UnO1xyXG5pbXBvcnQgeyB2aWV3IH0gZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IFdpZGdldCB9IGZyb20gJy4vd2lkZ2V0JztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tIFwiLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0c1wiO1xyXG5cclxuLy8gQHRzLWlnbm9yZVxyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGlzIGNvbXBvbmVudCBpcyB1c2VkIHRvIGFkanVzdCB0aGUgbGF5b3V0IG9mIGN1cnJlbnQgbm9kZSB0byByZXNwZWN0IHRoZSBzYWZlIGFyZWEgb2YgYSBub3RjaGVkIG1vYmlsZSBkZXZpY2Ugc3VjaCBhcyB0aGUgaVBob25lIFguXHJcbiAqIEl0IGlzIHR5cGljYWxseSB1c2VkIGZvciB0aGUgdG9wIG5vZGUgb2YgdGhlIFVJIGludGVyYWN0aW9uIGFyZWEuIEZvciBzcGVjaWZpYyB1c2FnZSwgcmVmZXIgdG8gdGhlIG9mZmljaWFsIFt0ZXN0LWNhc2VzLTNkL2Fzc2V0cy9jYXNlcy91aS8yMC5zYWZlLWFyZWEvc2FmZS1hcmVhLnNjZW5lXShodHRwczovL2dpdGh1Yi5jb20vY29jb3MtY3JlYXRvci90ZXN0LWNhc2VzLTNkKS5cclxuICpcclxuICogVGhlIGNvbmNlcHQgb2Ygc2FmZSBhcmVhIGlzIHRvIGdpdmUgeW91IGEgZml4ZWQgaW5uZXIgcmVjdGFuZ2xlIGluIHdoaWNoIHlvdSBjYW4gc2FmZWx5IGRpc3BsYXkgY29udGVudCB0aGF0IHdpbGwgYmUgZHJhd24gb24gc2NyZWVuLlxyXG4gKiBZb3UgYXJlIHN0cm9uZ2x5IGRpc2NvdXJhZ2VkIGZyb20gcHJvdmlkaW5nIGNvbnRyb2xzIG91dHNpZGUgb2YgdGhpcyBhcmVhLiBCdXQgeW91ciBzY3JlZW4gYmFja2dyb3VuZCBjb3VsZCBlbWJlbGxpc2ggZWRnZXMuXHJcbiAqXHJcbiAqIFRoaXMgY29tcG9uZW50IGludGVybmFsbHkgdXNlcyB0aGUgQVBJIGBzeXMuZ2V0U2FmZUFyZWFSZWN0KCk7YCB0byBvYnRhaW4gdGhlIHNhZmUgYXJlYSBvZiB0aGUgY3VycmVudCBpT1Mgb3IgQW5kcm9pZCBkZXZpY2UsXHJcbiAqIGFuZCBpbXBsZW1lbnRzIHRoZSBhZGFwdGF0aW9uIGJ5IHVzaW5nIHRoZSBXaWRnZXQgY29tcG9uZW50IGFuZCBzZXQgYW5jaG9yLlxyXG4gKlxyXG4gKiBAemhcclxuICog6K+l57uE5Lu25Lya5bCG5omA5Zyo6IqC54K555qE5biD5bGA6YCC6YWN5YiwIGlQaG9uZSBYIOetieW8guW9ouWxj+aJi+acuueahOWuieWFqOWMuuWfn+WGhe+8jOmAmuW4uOeUqOS6jiBVSSDkuqTkupLljLrln5/nmoTpobblsYLoioLngrnvvIzlhbfkvZPnlKjms5Xlj6/lj4LogIPlrpjmlrnojIPkvosgW3Rlc3QtY2FzZXMtM2QvYXNzZXRzL2Nhc2VzL3VpLzIwLnNhZmUtYXJlYS9zYWZlLWFyZWEuc2NlbmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2Nvcy1jcmVhdG9yL3Rlc3QtY2FzZXMtM2Qp44CCXHJcbiAqXHJcbiAqIOivpee7hOS7tuWGhemDqOmAmui/hyBBUEkgYHN5cy5nZXRTYWZlQXJlYVJlY3QoKTtgIOiOt+WPluWIsOW9k+WJjSBpT1Mg5oiWIEFuZHJvaWQg6K6+5aSH55qE5a6J5YWo5Yy65Z+f77yM5bm26YCa6L+HIFdpZGdldCDnu4Tku7blrp7njrDpgILphY3jgIJcclxuICpcclxuICovXHJcblxyXG5AY2NjbGFzcygnY2MuU2FmZUFyZWEnKVxyXG5AaGVscCgnaTE4bjpjYy5TYWZlQXJlYScpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5AbWVudSgnVUkvU2FmZUFyZWEnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChXaWRnZXQpXHJcbi8vIEB0cy1pZ25vcmVcclxuZXhwb3J0IGNsYXNzIFNhZmVBcmVhIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGUgKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQXJlYSgpO1xyXG4gICAgICAgIHZpZXcub24oJ2NhbnZhcy1yZXNpemUnLCB0aGlzLnVwZGF0ZUFyZWEsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUoKSB7XHJcbiAgICAgICAgdmlldy5vZmYoJ2NhbnZhcy1yZXNpemUnLCB0aGlzLnVwZGF0ZUFyZWEsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFkYXB0IHRvIHNhZmUgYXJlYVxyXG4gICAgICogQHpoIOeri+WNs+mAgumFjeWuieWFqOWMuuWfn1xyXG4gICAgICogQG1ldGhvZCB1cGRhdGVBcmVhXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IHNhZmVBcmVhID0gdGhpcy5ub2RlLmFkZENvbXBvbmVudChjYy5TYWZlQXJlYSk7XHJcbiAgICAgKiBzYWZlQXJlYS51cGRhdGVBcmVhKCk7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVBcmVhICgpIHtcclxuICAgICAgICAvLyBUT0RPIFJlbW92ZSBXaWRnZXQgZGVwZW5kZW5jaWVzIGluIHRoZSBmdXR1cmVcclxuICAgICAgICBsZXQgd2lkZ2V0ID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChXaWRnZXQpO1xyXG4gICAgICAgIGxldCB1aVRyYW5zQ29tcCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoVUlUcmFuc2Zvcm0pO1xyXG4gICAgICAgIGlmICghd2lkZ2V0IHx8ICF1aVRyYW5zQ29tcCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgeyB3aW5TaXplLCBzeXMgfSA9IGxlZ2FjeUNDO1xyXG5cclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHdpZGdldC50b3AgPSB3aWRnZXQuYm90dG9tID0gd2lkZ2V0LmxlZnQgPSB3aWRnZXQucmlnaHQgPSAwO1xyXG4gICAgICAgICAgICB3aWRnZXQuaXNBbGlnblRvcCA9IHdpZGdldC5pc0FsaWduQm90dG9tID0gd2lkZ2V0LmlzQWxpZ25MZWZ0ID0gd2lkZ2V0LmlzQWxpZ25SaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSU1QT1JUQU5UOiBuZWVkIHRvIHVwZGF0ZSBhbGlnbm1lbnQgdG8gZ2V0IHRoZSBsYXRlc3QgcG9zaXRpb25cclxuICAgICAgICB3aWRnZXQudXBkYXRlQWxpZ25tZW50KCk7XHJcbiAgICAgICAgbGV0IGxhc3RQb3MgPSB0aGlzLm5vZGUucG9zaXRpb247XHJcbiAgICAgICAgbGV0IGxhc3RBbmNob3JQb2ludCA9IHVpVHJhbnNDb21wLmFuY2hvclBvaW50O1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgd2lkZ2V0LmlzQWxpZ25Ub3AgPSB3aWRnZXQuaXNBbGlnbkJvdHRvbSA9IHdpZGdldC5pc0FsaWduTGVmdCA9IHdpZGdldC5pc0FsaWduUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgIGxldCBzY3JlZW5XaWR0aCA9IHdpblNpemUud2lkdGgsIHNjcmVlbkhlaWdodCA9IHdpblNpemUuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBzYWZlQXJlYSA9IHN5cy5nZXRTYWZlQXJlYVJlY3QoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coc2FmZUFyZWEpO1xyXG5cclxuICAgICAgICB3aWRnZXQudG9wID0gc2NyZWVuSGVpZ2h0IC0gc2FmZUFyZWEueSAtIHNhZmVBcmVhLmhlaWdodDtcclxuICAgICAgICB3aWRnZXQuYm90dG9tID0gc2FmZUFyZWEueTtcclxuICAgICAgICB3aWRnZXQubGVmdCA9IHNhZmVBcmVhLng7XHJcbiAgICAgICAgd2lkZ2V0LnJpZ2h0ID0gc2NyZWVuV2lkdGggLSBzYWZlQXJlYS54IC0gc2FmZUFyZWEud2lkdGg7XHJcbiAgICAgICAgd2lkZ2V0LnVwZGF0ZUFsaWdubWVudCgpO1xyXG4gICAgICAgIC8vIHNldCBhbmNob3IsIGtlZXAgdGhlIG9yaWdpbmFsIHBvc2l0aW9uIHVuY2hhbmdlZFxyXG4gICAgICAgIGxldCBjdXJQb3MgPSB0aGlzLm5vZGUucG9zaXRpb247XHJcbiAgICAgICAgbGV0IGFuY2hvclggPSBsYXN0QW5jaG9yUG9pbnQueCAtIChjdXJQb3MueCAtIGxhc3RQb3MueCkgLyB1aVRyYW5zQ29tcC53aWR0aDtcclxuICAgICAgICBsZXQgYW5jaG9yWSA9IGxhc3RBbmNob3JQb2ludC55IC0gKGN1clBvcy55IC0gbGFzdFBvcy55KSAvIHVpVHJhbnNDb21wLmhlaWdodDtcclxuICAgICAgICB1aVRyYW5zQ29tcC5zZXRBbmNob3JQb2ludChhbmNob3JYLCBhbmNob3JZKTtcclxuICAgICAgICAvLyBJTVBPUlRBTlQ6IHJlc3RvcmUgdG8gbGFzdFBvcyBldmVuIGlmIHdpZGdldCBpcyBub3QgQUxXQVlTXHJcbiAgICAgICAgd2lkZ2V0LmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==