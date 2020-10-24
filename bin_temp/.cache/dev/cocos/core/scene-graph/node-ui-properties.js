(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../components/ui-base/ui-transform.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../components/ui-base/ui-transform.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.uiTransform);
    global.nodeUiProperties = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _uiTransform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.NodeUIProperties = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en Node's UI properties abstraction
   * @zh 节点上 UI 相关的属性抽象类
   */
  var NodeUIProperties = /*#__PURE__*/function () {
    _createClass(NodeUIProperties, [{
      key: "uiTransformComp",

      /**
       * @en The UI transform component
       * @zh UI 变换组件
       */
      get: function get() {
        if (!this._uiTransformComp) {
          this._uiTransformComp = this._node.getComponent(_uiTransform.UITransform);
        }

        return this._uiTransformComp;
      },
      set: function set(value) {
        this._uiTransformComp = value;
      }
      /**
       * @en The base UI component
       * @zh UI 基类组件
       */

    }]);

    function NodeUIProperties(node) {
      _classCallCheck(this, NodeUIProperties);

      this.uiComp = null;
      this.opacity = 1;
      this._uiTransformComp = null;
      this._node = void 0;
      this._node = node;
    }

    return NodeUIProperties;
  }();

  _exports.NodeUIProperties = NodeUIProperties;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS11aS1wcm9wZXJ0aWVzLnRzIl0sIm5hbWVzIjpbIk5vZGVVSVByb3BlcnRpZXMiLCJfdWlUcmFuc2Zvcm1Db21wIiwiX25vZGUiLCJnZXRDb21wb25lbnQiLCJVSVRyYW5zZm9ybSIsInZhbHVlIiwibm9kZSIsInVpQ29tcCIsIm9wYWNpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNBOzs7O01BSWFBLGdCOzs7O0FBQ1Q7Ozs7MEJBSXVCO0FBQ25CLFlBQUksQ0FBQyxLQUFLQyxnQkFBVixFQUE0QjtBQUN4QixlQUFLQSxnQkFBTCxHQUF3QixLQUFLQyxLQUFMLENBQVdDLFlBQVgsQ0FBd0JDLHdCQUF4QixDQUF4QjtBQUNIOztBQUVELGVBQU8sS0FBS0gsZ0JBQVo7QUFDSCxPO3dCQUNvQkksSyxFQUFPO0FBQ3hCLGFBQUtKLGdCQUFMLEdBQXdCSSxLQUF4QjtBQUNIO0FBRUQ7Ozs7Ozs7QUFhQSw4QkFBYUMsSUFBYixFQUF3QjtBQUFBOztBQUFBLFdBVGpCQyxNQVNpQixHQVQyQixJQVMzQjtBQUFBLFdBSmpCQyxPQUlpQixHQUpQLENBSU87QUFBQSxXQUhkUCxnQkFHYyxHQUh5QixJQUd6QjtBQUFBLFdBRmhCQyxLQUVnQjtBQUNwQixXQUFLQSxLQUFMLEdBQWFJLElBQWI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgc2NlbmUtZ3JhcGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBVSUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvdWktYmFzZS91aS1jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uL2NvbXBvbmVudHMvdWktYmFzZS91aS10cmFuc2Zvcm0nO1xyXG5pbXBvcnQgeyBVSVJlbmRlcmFibGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3VpLWJhc2UvdWktcmVuZGVyYWJsZSc7XHJcblxyXG4vKipcclxuICogQGVuIE5vZGUncyBVSSBwcm9wZXJ0aWVzIGFic3RyYWN0aW9uXHJcbiAqIEB6aCDoioLngrnkuIogVUkg55u45YWz55qE5bGe5oCn5oq96LGh57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTm9kZVVJUHJvcGVydGllcyB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgVUkgdHJhbnNmb3JtIGNvbXBvbmVudFxyXG4gICAgICogQHpoIFVJIOWPmOaNoue7hOS7tlxyXG4gICAgICovXHJcbiAgICBnZXQgdWlUcmFuc2Zvcm1Db21wICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3VpVHJhbnNmb3JtQ29tcCkge1xyXG4gICAgICAgICAgICB0aGlzLl91aVRyYW5zZm9ybUNvbXAgPSB0aGlzLl9ub2RlLmdldENvbXBvbmVudChVSVRyYW5zZm9ybSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fdWlUcmFuc2Zvcm1Db21wO1xyXG4gICAgfVxyXG4gICAgc2V0IHVpVHJhbnNmb3JtQ29tcCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl91aVRyYW5zZm9ybUNvbXAgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgYmFzZSBVSSBjb21wb25lbnRcclxuICAgICAqIEB6aCBVSSDln7rnsbvnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHVpQ29tcDogVUlDb21wb25lbnQgfCBVSVJlbmRlcmFibGUgfCBudWxsID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBvcGFjaXR5IG9mIHRoZSBVSSBub2RlXHJcbiAgICAgKiBAemggVUkg6YCP5piO5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvcGFjaXR5ID0gMTtcclxuICAgIHByb3RlY3RlZCBfdWlUcmFuc2Zvcm1Db21wOiBVSVRyYW5zZm9ybSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfbm9kZTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChub2RlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9ub2RlID0gbm9kZTtcclxuICAgIH1cclxufVxyXG4iXX0=