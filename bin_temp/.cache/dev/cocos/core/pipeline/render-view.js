(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js", "./pipeline-serialization.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"), require("./pipeline-serialization.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.pipelineSerialization, global.globalExports);
    global.renderView = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _pipelineSerialization, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderView = _exports.RenderViewPriority = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en The predefined priority of render view
   * @zh 预设渲染视图优先级。
   */
  var RenderViewPriority;
  /**
   * @en Render target information descriptor
   * @zh 渲染目标描述信息。
   */

  _exports.RenderViewPriority = RenderViewPriority;

  (function (RenderViewPriority) {
    RenderViewPriority[RenderViewPriority["GENERAL"] = 100] = "GENERAL";
  })(RenderViewPriority || (_exports.RenderViewPriority = RenderViewPriority = {}));

  /**
   * @en Render view represents a view from its camera, it also manages a list of [[RenderFlow]]s which will be executed for it.
   * @zh 渲染视图代表了它的相机所拍摄的视图，它也管理一组在视图上执行的 [[RenderFlow]]。
   */
  var RenderView = /*#__PURE__*/function () {
    _createClass(RenderView, [{
      key: "name",

      /**
       * @en Name
       * @zh 名称。
       */
      get: function get() {
        return this._name;
      }
      /**
       * @en The GFX window
       * @zh GFX 窗口。
       */

    }, {
      key: "window",
      get: function get() {
        return this._window;
      },
      set: function set(val) {
        this._window = val;
      }
      /**
       * @en The priority among other render views, used for sorting.
       * @zh 在所有 RenderView 中的优先级，用于排序。
       */

    }, {
      key: "priority",
      get: function get() {
        return this._priority;
      },
      set: function set(val) {
        this._priority = val;

        if (_globalExports.legacyCC.director.root) {
          _globalExports.legacyCC.director.root.sortViews();
        }
      }
      /**
       * @en The visibility is a mask which allows nodes in the scene be seen by the current view if their [[Node.layer]] bit is included in this mask.
       * @zh 可见性是一个掩码，如果场景中节点的 [[Node.layer]] 位被包含在该掩码中，则对应节点对该视图是可见的。
       */

    }, {
      key: "visibility",
      set: function set(vis) {
        this._visibility = vis;
      },
      get: function get() {
        return this._visibility;
      }
      /**
       * @en The camera correspond to this render view
       * @zh 该视图对应的相机。
       * @readonly
       */

    }, {
      key: "camera",
      get: function get() {
        return this._camera;
      }
      /**
       * @en Whether the view is enabled
       * @zh 是否启用。
       * @readonly
       */

    }, {
      key: "isEnable",
      get: function get() {
        return this._isEnable;
      }
      /**
       * @en Render flow list
       * @zh 渲染流程列表。
       * @readonly
       */

    }, {
      key: "flows",
      get: function get() {
        return this._flows;
      }
    }]);

    /**
     * @en The constructor
     * @zh 构造函数。
     * @param camera
     */
    function RenderView() {
      _classCallCheck(this, RenderView);

      this._name = '';
      this._window = null;
      this._priority = 0;
      this._visibility = _define.CAMERA_DEFAULT_MASK;
      this._isEnable = false;
      this._flows = [];
    }
    /**
     * @en Initialization function with a render view information descriptor
     * @zh 使用一个渲染视图描述信息来初始化。
     * @param info Render view information descriptor
     */


    _createClass(RenderView, [{
      key: "initialize",
      value: function initialize(info) {
        this._camera = info.camera;
        this._name = info.name;
        this.priority = info.priority;
        this.setExecuteFlows(info.flows);
        return true;
      }
      /**
       * @en The destroy function
       * @zh 销毁函数。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this._window = null;
        this._priority = 0;
      }
      /**
       * @en Enable or disable this render view
       * @zh 启用或禁用该渲染视图。
       * @param isEnable Whether to enable or disable this view
       */

    }, {
      key: "enable",
      value: function enable(isEnable) {
        this._isEnable = isEnable;
      }
      /**
       * @en Set the execution render flows with their names, the flows found in the pipeline will then be executed for this view in the render process
       * @zh 使用对应的名字列表设置需要执行的渲染流程，所有在渲染管线中找到的对应渲染流程都会用来对当前视图执行渲染。
       * @param flows The names of all [[RenderFlow]]s
       */

    }, {
      key: "setExecuteFlows",
      value: function setExecuteFlows(flows) {
        this._flows.length = 0;
        var pipeline = _globalExports.legacyCC.director.root.pipeline;
        var pipelineFlows = pipeline.flows;

        if (flows && flows.length === 1 && flows[0] === 'UIFlow') {
          for (var i = 0; i < pipelineFlows.length; i++) {
            if (pipelineFlows[i].name === 'UIFlow') {
              this._flows.push(pipelineFlows[i]);

              break;
            }
          }

          return;
        }

        for (var _i = 0; _i < pipelineFlows.length; ++_i) {
          var f = pipelineFlows[_i];

          if (f.tag === _pipelineSerialization.RenderFlowTag.SCENE || flows && flows.indexOf(f.name) !== -1) {
            this._flows.push(f);
          }
        }
      }
    }, {
      key: "onGlobalPipelineStateChanged",
      value: function onGlobalPipelineStateChanged() {
        var pipeline = _globalExports.legacyCC.director.root.pipeline;
        var pipelineFlows = pipeline.flows;

        for (var i = 0; i < this._flows.length; ++i) {
          var flow = this._flows[i];

          for (var j = 0; j < pipelineFlows.length; j++) {
            if (pipelineFlows[j].name === flow.name) {
              this._flows[i] = pipelineFlows[j];
              break;
            }
          }
        }
      }
    }]);

    return RenderView;
  }();

  _exports.RenderView = RenderView;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLXZpZXcudHMiXSwibmFtZXMiOlsiUmVuZGVyVmlld1ByaW9yaXR5IiwiUmVuZGVyVmlldyIsIl9uYW1lIiwiX3dpbmRvdyIsInZhbCIsIl9wcmlvcml0eSIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJyb290Iiwic29ydFZpZXdzIiwidmlzIiwiX3Zpc2liaWxpdHkiLCJfY2FtZXJhIiwiX2lzRW5hYmxlIiwiX2Zsb3dzIiwiQ0FNRVJBX0RFRkFVTFRfTUFTSyIsImluZm8iLCJjYW1lcmEiLCJuYW1lIiwicHJpb3JpdHkiLCJzZXRFeGVjdXRlRmxvd3MiLCJmbG93cyIsImlzRW5hYmxlIiwibGVuZ3RoIiwicGlwZWxpbmUiLCJwaXBlbGluZUZsb3dzIiwiaSIsInB1c2giLCJmIiwidGFnIiwiUmVuZGVyRmxvd1RhZyIsIlNDRU5FIiwiaW5kZXhPZiIsImZsb3ciLCJqIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdBOzs7O01BSVlBLGtCO0FBSVo7Ozs7Ozs7YUFKWUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7S0FBQUEsa0IsbUNBQUFBLGtCOztBQWFaOzs7O01BSWFDLFU7Ozs7QUFFVDs7OzswQkFJWTtBQUNSLGVBQU8sS0FBS0MsS0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSWM7QUFDVixlQUFPLEtBQUtDLE9BQVo7QUFDSCxPO3dCQUVXQyxHLEVBQUs7QUFDYixhQUFLRCxPQUFMLEdBQWVDLEdBQWY7QUFDSDtBQUVEOzs7Ozs7OzBCQUlnQjtBQUNaLGVBQU8sS0FBS0MsU0FBWjtBQUNILE87d0JBRWFELEcsRUFBSztBQUNmLGFBQUtDLFNBQUwsR0FBaUJELEdBQWpCOztBQUNBLFlBQUlFLHdCQUFTQyxRQUFULENBQWtCQyxJQUF0QixFQUE0QjtBQUN4QkYsa0NBQVNDLFFBQVQsQ0FBa0JDLElBQWxCLENBQXVCQyxTQUF2QjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozt3QkFJZ0JDLEcsRUFBSztBQUNqQixhQUFLQyxXQUFMLEdBQW1CRCxHQUFuQjtBQUNILE87MEJBQ2lCO0FBQ2QsZUFBTyxLQUFLQyxXQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7MEJBS3NCO0FBQ2xCLGVBQU8sS0FBS0MsT0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7OzBCQUt5QjtBQUNyQixlQUFPLEtBQUtDLFNBQVo7QUFDSDtBQUVEOzs7Ozs7OzswQkFLMkI7QUFDdkIsZUFBTyxLQUFLQyxNQUFaO0FBQ0g7OztBQVVEOzs7OztBQUtBLDBCQUFzQjtBQUFBOztBQUFBLFdBYmRaLEtBYWMsR0FiRSxFQWFGO0FBQUEsV0FaZEMsT0FZYyxHQVppQixJQVlqQjtBQUFBLFdBWGRFLFNBV2MsR0FYTSxDQVdOO0FBQUEsV0FWZE0sV0FVYyxHQVZRSSwyQkFVUjtBQUFBLFdBUmRGLFNBUWMsR0FSTyxLQVFQO0FBQUEsV0FQZEMsTUFPYyxHQVBTLEVBT1Q7QUFDckI7QUFFRDs7Ozs7Ozs7O2lDQUttQkUsSSxFQUFnQztBQUMvQyxhQUFLSixPQUFMLEdBQWVJLElBQUksQ0FBQ0MsTUFBcEI7QUFDQSxhQUFLZixLQUFMLEdBQWFjLElBQUksQ0FBQ0UsSUFBbEI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCSCxJQUFJLENBQUNHLFFBQXJCO0FBQ0EsYUFBS0MsZUFBTCxDQUFxQkosSUFBSSxDQUFDSyxLQUExQjtBQUVBLGVBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Z0NBSWtCO0FBQ2QsYUFBS2xCLE9BQUwsR0FBZSxJQUFmO0FBQ0EsYUFBS0UsU0FBTCxHQUFpQixDQUFqQjtBQUNIO0FBRUQ7Ozs7Ozs7OzZCQUtlaUIsUSxFQUFtQjtBQUM5QixhQUFLVCxTQUFMLEdBQWlCUyxRQUFqQjtBQUNIO0FBRUQ7Ozs7Ozs7O3NDQUt3QkQsSyxFQUE2QjtBQUNqRCxhQUFLUCxNQUFMLENBQVlTLE1BQVosR0FBcUIsQ0FBckI7QUFDQSxZQUFNQyxRQUFRLEdBQUdsQix3QkFBU0MsUUFBVCxDQUFrQkMsSUFBbEIsQ0FBdUJnQixRQUF4QztBQUNBLFlBQU1DLGFBQWEsR0FBR0QsUUFBUSxDQUFDSCxLQUEvQjs7QUFDQSxZQUFJQSxLQUFLLElBQUlBLEtBQUssQ0FBQ0UsTUFBTixLQUFpQixDQUExQixJQUErQkYsS0FBSyxDQUFDLENBQUQsQ0FBTCxLQUFhLFFBQWhELEVBQTBEO0FBQ3RELGVBQUssSUFBSUssQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsYUFBYSxDQUFDRixNQUFsQyxFQUEwQ0csQ0FBQyxFQUEzQyxFQUErQztBQUMzQyxnQkFBSUQsYUFBYSxDQUFDQyxDQUFELENBQWIsQ0FBaUJSLElBQWpCLEtBQTBCLFFBQTlCLEVBQXdDO0FBQ3BDLG1CQUFLSixNQUFMLENBQVlhLElBQVosQ0FBaUJGLGFBQWEsQ0FBQ0MsQ0FBRCxDQUE5Qjs7QUFDQTtBQUNIO0FBQ0o7O0FBQ0Q7QUFDSDs7QUFDRCxhQUFLLElBQUlBLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdELGFBQWEsQ0FBQ0YsTUFBbEMsRUFBMEMsRUFBRUcsRUFBNUMsRUFBK0M7QUFDM0MsY0FBTUUsQ0FBQyxHQUFHSCxhQUFhLENBQUNDLEVBQUQsQ0FBdkI7O0FBQ0EsY0FBSUUsQ0FBQyxDQUFDQyxHQUFGLEtBQVVDLHFDQUFjQyxLQUF4QixJQUFrQ1YsS0FBSyxJQUFJQSxLQUFLLENBQUNXLE9BQU4sQ0FBY0osQ0FBQyxDQUFDVixJQUFoQixNQUEwQixDQUFDLENBQTFFLEVBQThFO0FBQzFFLGlCQUFLSixNQUFMLENBQVlhLElBQVosQ0FBaUJDLENBQWpCO0FBQ0g7QUFDSjtBQUNKOzs7cURBRXNDO0FBQ25DLFlBQU1KLFFBQVEsR0FBR2xCLHdCQUFTQyxRQUFULENBQWtCQyxJQUFsQixDQUF1QmdCLFFBQXhDO0FBQ0EsWUFBTUMsYUFBYSxHQUFHRCxRQUFRLENBQUNILEtBQS9COztBQUNBLGFBQUssSUFBSUssQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLWixNQUFMLENBQVlTLE1BQWhDLEVBQXdDLEVBQUVHLENBQTFDLEVBQTZDO0FBQ3pDLGNBQU1PLElBQUksR0FBRyxLQUFLbkIsTUFBTCxDQUFZWSxDQUFaLENBQWI7O0FBQ0EsZUFBSyxJQUFJUSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHVCxhQUFhLENBQUNGLE1BQWxDLEVBQTBDVyxDQUFDLEVBQTNDLEVBQStDO0FBQzNDLGdCQUFJVCxhQUFhLENBQUNTLENBQUQsQ0FBYixDQUFpQmhCLElBQWpCLEtBQTBCZSxJQUFJLENBQUNmLElBQW5DLEVBQXlDO0FBQ3JDLG1CQUFLSixNQUFMLENBQVlZLENBQVosSUFBaUJELGFBQWEsQ0FBQ1MsQ0FBRCxDQUE5QjtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBpcGVsaW5lXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSAnLi4vcmVuZGVyZXIvc2NlbmUvY2FtZXJhJztcclxuaW1wb3J0IHsgQ0FNRVJBX0RFRkFVTFRfTUFTSywgSVJlbmRlclZpZXdJbmZvIH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBSZW5kZXJGbG93VGFnIH0gZnJvbSAnLi9waXBlbGluZS1zZXJpYWxpemF0aW9uJztcclxuaW1wb3J0IHsgUmVuZGVyRmxvdyB9IGZyb20gJy4vcmVuZGVyLWZsb3cnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgUmVuZGVyV2luZG93IH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9yZW5kZXItd2luZG93JztcclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIHByZWRlZmluZWQgcHJpb3JpdHkgb2YgcmVuZGVyIHZpZXdcclxuICogQHpoIOmihOiuvua4suafk+inhuWbvuS8mOWFiOe6p+OAglxyXG4gKi9cclxuZXhwb3J0IGVudW0gUmVuZGVyVmlld1ByaW9yaXR5IHtcclxuICAgIEdFTkVSQUwgPSAxMDAsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gUmVuZGVyIHRhcmdldCBpbmZvcm1hdGlvbiBkZXNjcmlwdG9yXHJcbiAqIEB6aCDmuLLmn5Pnm67moIfmj4/ov7Dkv6Hmga/jgIJcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlclRhcmdldEluZm8ge1xyXG4gICAgd2lkdGg/OiBudW1iZXI7XHJcbiAgICBoZWlnaHQ/OiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gUmVuZGVyIHZpZXcgcmVwcmVzZW50cyBhIHZpZXcgZnJvbSBpdHMgY2FtZXJhLCBpdCBhbHNvIG1hbmFnZXMgYSBsaXN0IG9mIFtbUmVuZGVyRmxvd11dcyB3aGljaCB3aWxsIGJlIGV4ZWN1dGVkIGZvciBpdC5cclxuICogQHpoIOa4suafk+inhuWbvuS7o+ihqOS6huWug+eahOebuOacuuaJgOaLjeaRhOeahOinhuWbvu+8jOWug+S5n+euoeeQhuS4gOe7hOWcqOinhuWbvuS4iuaJp+ihjOeahCBbW1JlbmRlckZsb3ddXeOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlbmRlclZpZXcge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE5hbWVcclxuICAgICAqIEB6aCDlkI3np7DjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG5hbWUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBHRlggd2luZG93XHJcbiAgICAgKiBAemggR0ZYIOeql+WPo+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgd2luZG93ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93ITtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd2luZG93ICh2YWwpIHtcclxuICAgICAgICB0aGlzLl93aW5kb3cgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHByaW9yaXR5IGFtb25nIG90aGVyIHJlbmRlciB2aWV3cywgdXNlZCBmb3Igc29ydGluZy5cclxuICAgICAqIEB6aCDlnKjmiYDmnIkgUmVuZGVyVmlldyDkuK3nmoTkvJjlhYjnuqfvvIznlKjkuo7mjpLluo/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHByaW9yaXR5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJpb3JpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHByaW9yaXR5ICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9wcmlvcml0eSA9IHZhbDtcclxuICAgICAgICBpZiAobGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5yb290LnNvcnRWaWV3cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgdmlzaWJpbGl0eSBpcyBhIG1hc2sgd2hpY2ggYWxsb3dzIG5vZGVzIGluIHRoZSBzY2VuZSBiZSBzZWVuIGJ5IHRoZSBjdXJyZW50IHZpZXcgaWYgdGhlaXIgW1tOb2RlLmxheWVyXV0gYml0IGlzIGluY2x1ZGVkIGluIHRoaXMgbWFzay5cclxuICAgICAqIEB6aCDlj6/op4HmgKfmmK/kuIDkuKrmjqnnoIHvvIzlpoLmnpzlnLrmma/kuK3oioLngrnnmoQgW1tOb2RlLmxheWVyXV0g5L2N6KKr5YyF5ZCr5Zyo6K+l5o6p56CB5Lit77yM5YiZ5a+55bqU6IqC54K55a+56K+l6KeG5Zu+5piv5Y+v6KeB55qE44CCXHJcbiAgICAgKi9cclxuICAgIHNldCB2aXNpYmlsaXR5ICh2aXMpIHtcclxuICAgICAgICB0aGlzLl92aXNpYmlsaXR5ID0gdmlzO1xyXG4gICAgfVxyXG4gICAgZ2V0IHZpc2liaWxpdHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aXNpYmlsaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBjYW1lcmEgY29ycmVzcG9uZCB0byB0aGlzIHJlbmRlciB2aWV3XHJcbiAgICAgKiBAemgg6K+l6KeG5Zu+5a+55bqU55qE55u45py644CCXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGNhbWVyYSAoKTogQ2FtZXJhIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhITtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXaGV0aGVyIHRoZSB2aWV3IGlzIGVuYWJsZWRcclxuICAgICAqIEB6aCDmmK/lkKblkK/nlKjjgIJcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgaXNFbmFibGUgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0VuYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZW5kZXIgZmxvdyBsaXN0XHJcbiAgICAgKiBAemgg5riy5p+T5rWB56iL5YiX6KGo44CCXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGZsb3dzICgpOiBSZW5kZXJGbG93W10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mbG93cztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9uYW1lOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgX3dpbmRvdzogUmVuZGVyV2luZG93IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9wcmlvcml0eTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3Zpc2liaWxpdHk6IG51bWJlciA9IENBTUVSQV9ERUZBVUxUX01BU0s7XHJcbiAgICBwcml2YXRlIF9jYW1lcmEhOiBDYW1lcmE7XHJcbiAgICBwcml2YXRlIF9pc0VuYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfZmxvd3M6IFJlbmRlckZsb3dbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBjb25zdHJ1Y3RvclxyXG4gICAgICogQHpoIOaehOmAoOWHveaVsOOAglxyXG4gICAgICogQHBhcmFtIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEluaXRpYWxpemF0aW9uIGZ1bmN0aW9uIHdpdGggYSByZW5kZXIgdmlldyBpbmZvcm1hdGlvbiBkZXNjcmlwdG9yXHJcbiAgICAgKiBAemgg5L2/55So5LiA5Liq5riy5p+T6KeG5Zu+5o+P6L+w5L+h5oGv5p2l5Yid5aeL5YyW44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBSZW5kZXIgdmlldyBpbmZvcm1hdGlvbiBkZXNjcmlwdG9yXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBJUmVuZGVyVmlld0luZm8pOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLl9jYW1lcmEgPSBpbmZvLmNhbWVyYTtcclxuICAgICAgICB0aGlzLl9uYW1lID0gaW5mby5uYW1lO1xyXG4gICAgICAgIHRoaXMucHJpb3JpdHkgPSBpbmZvLnByaW9yaXR5O1xyXG4gICAgICAgIHRoaXMuc2V0RXhlY3V0ZUZsb3dzKGluZm8uZmxvd3MpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZGVzdHJveSBmdW5jdGlvblxyXG4gICAgICogQHpoIOmUgOavgeWHveaVsOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5fd2luZG93ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9wcmlvcml0eSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRW5hYmxlIG9yIGRpc2FibGUgdGhpcyByZW5kZXIgdmlld1xyXG4gICAgICogQHpoIOWQr+eUqOaIluemgeeUqOivpea4suafk+inhuWbvuOAglxyXG4gICAgICogQHBhcmFtIGlzRW5hYmxlIFdoZXRoZXIgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhpcyB2aWV3XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbmFibGUgKGlzRW5hYmxlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXNFbmFibGUgPSBpc0VuYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgdGhlIGV4ZWN1dGlvbiByZW5kZXIgZmxvd3Mgd2l0aCB0aGVpciBuYW1lcywgdGhlIGZsb3dzIGZvdW5kIGluIHRoZSBwaXBlbGluZSB3aWxsIHRoZW4gYmUgZXhlY3V0ZWQgZm9yIHRoaXMgdmlldyBpbiB0aGUgcmVuZGVyIHByb2Nlc3NcclxuICAgICAqIEB6aCDkvb/nlKjlr7nlupTnmoTlkI3lrZfliJfooajorr7nva7pnIDopoHmiafooYznmoTmuLLmn5PmtYHnqIvvvIzmiYDmnInlnKjmuLLmn5PnrqHnur/kuK3mib7liLDnmoTlr7nlupTmuLLmn5PmtYHnqIvpg73kvJrnlKjmnaXlr7nlvZPliY3op4blm77miafooYzmuLLmn5PjgIJcclxuICAgICAqIEBwYXJhbSBmbG93cyBUaGUgbmFtZXMgb2YgYWxsIFtbUmVuZGVyRmxvd11dc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0RXhlY3V0ZUZsb3dzIChmbG93czogc3RyaW5nW10gfCB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLl9mbG93cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5waXBlbGluZTtcclxuICAgICAgICBjb25zdCBwaXBlbGluZUZsb3dzID0gcGlwZWxpbmUuZmxvd3M7XHJcbiAgICAgICAgaWYgKGZsb3dzICYmIGZsb3dzLmxlbmd0aCA9PT0gMSAmJiBmbG93c1swXSA9PT0gJ1VJRmxvdycpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaXBlbGluZUZsb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGlwZWxpbmVGbG93c1tpXS5uYW1lID09PSAnVUlGbG93Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zsb3dzLnB1c2gocGlwZWxpbmVGbG93c1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpcGVsaW5lRmxvd3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgZiA9IHBpcGVsaW5lRmxvd3NbaV07XHJcbiAgICAgICAgICAgIGlmIChmLnRhZyA9PT0gUmVuZGVyRmxvd1RhZy5TQ0VORSB8fCAoZmxvd3MgJiYgZmxvd3MuaW5kZXhPZihmLm5hbWUpICE9PSAtMSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Zsb3dzLnB1c2goZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uR2xvYmFsUGlwZWxpbmVTdGF0ZUNoYW5nZWQgKCkge1xyXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5waXBlbGluZTtcclxuICAgICAgICBjb25zdCBwaXBlbGluZUZsb3dzID0gcGlwZWxpbmUuZmxvd3M7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9mbG93cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBmbG93ID0gdGhpcy5fZmxvd3NbaV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGlwZWxpbmVGbG93cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBpcGVsaW5lRmxvd3Nbal0ubmFtZSA9PT0gZmxvdy5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmxvd3NbaV0gPSBwaXBlbGluZUZsb3dzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==