(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "./render-stage.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("./render-stage.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.renderStage, global.globalExports);
    global.renderFlow = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _renderStage, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderFlow = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en Render flow is a sub process of the [[RenderPipeline]], it dispatch the render task to all the [[RenderStage]]s.
   * @zh 渲染流程是渲染管线（[[RenderPipeline]]）的一个子过程，它将渲染任务派发到它的所有渲染阶段（[[RenderStage]]）中执行。
   */
  var RenderFlow = (_dec = (0, _index.ccclass)('RenderFlow'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.displayOrder)(1), _dec4 = (0, _index.displayOrder)(2), _dec5 = (0, _index.displayOrder)(3), _dec6 = (0, _index.type)([_renderStage.RenderStage]), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function RenderFlow() {
      _classCallCheck(this, RenderFlow);

      _initializerDefineProperty(this, "_name", _descriptor, this);

      _initializerDefineProperty(this, "_priority", _descriptor2, this);

      _initializerDefineProperty(this, "_tag", _descriptor3, this);

      _initializerDefineProperty(this, "_stages", _descriptor4, this);
    }

    _createClass(RenderFlow, [{
      key: "initialize",

      /**
       * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
       * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
       * @param info The render flow information
       */
      value: function initialize(info) {
        this._name = info.name;
        this._priority = info.priority;
        this._stages = info.stages;

        if (info.tag) {
          this._tag = info.tag;
        }

        return true;
      }
      /**
       * @en Activate the current render flow in the given pipeline
       * @zh 为指定的渲染管线开启当前渲染流程
       * @param pipeline The render pipeline to activate this render flow
       */

    }, {
      key: "activate",
      value: function activate(pipeline) {
        this._pipeline = pipeline;

        this._stages.sort(function (a, b) {
          return a.priority - b.priority;
        });

        for (var i = 0, len = this._stages.length; i < len; i++) {
          this._stages[i].activate(pipeline, this);
        }
      }
      /**
       * @en Render function, it basically run all render stages in sequence for the given view.
       * @zh 渲染函数，对指定的渲染视图按顺序执行所有渲染阶段。
       * @param view Render view。
       */

    }, {
      key: "render",
      value: function render(view) {
        for (var i = 0, len = this._stages.length; i < len; i++) {
          this._stages[i].render(view);
        }
      }
      /**
       * @en Destroy function.
       * @zh 销毁函数。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        for (var i = 0, len = this._stages.length; i < len; i++) {
          this._stages[i].destroy();
        }

        this._stages.length = 0;
      }
    }, {
      key: "name",

      /**
       * @en The name of the render flow
       * @zh 渲染流程的名字
       */
      get: function get() {
        return this._name;
      }
      /**
       * @en Priority of the current flow
       * @zh 当前渲染流程的优先级。
       */

    }, {
      key: "priority",
      get: function get() {
        return this._priority;
      }
      /**
       * @en Tag of the current flow
       * @zh 当前渲染流程的标签。
       */

    }, {
      key: "tag",
      get: function get() {
        return this._tag;
      }
      /**
       * @en The stages of flow.
       * @zh 渲染流程 stage 列表。
       * @readonly
       */

    }, {
      key: "stages",
      get: function get() {
        return this._stages;
      }
    }]);

    return RenderFlow;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_name", [_dec2, _index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_priority", [_dec3, _index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_tag", [_dec4, _index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_stages", [_dec5, _dec6, _index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class);
  _exports.RenderFlow = RenderFlow;
  _globalExports.legacyCC.RenderFlow = RenderFlow;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLWZsb3cudHMiXSwibmFtZXMiOlsiUmVuZGVyRmxvdyIsIlJlbmRlclN0YWdlIiwiaW5mbyIsIl9uYW1lIiwibmFtZSIsIl9wcmlvcml0eSIsInByaW9yaXR5IiwiX3N0YWdlcyIsInN0YWdlcyIsInRhZyIsIl90YWciLCJwaXBlbGluZSIsIl9waXBlbGluZSIsInNvcnQiLCJhIiwiYiIsImkiLCJsZW4iLCJsZW5ndGgiLCJhY3RpdmF0ZSIsInZpZXciLCJyZW5kZXIiLCJkZXN0cm95Iiwic2VyaWFsaXphYmxlIiwibGVnYWN5Q0MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7TUFLc0JBLFUsV0FEckIsb0JBQVEsWUFBUixDLFVBbUNJLHlCQUFhLENBQWIsQyxVQUlBLHlCQUFhLENBQWIsQyxVQUlBLHlCQUFhLENBQWIsQyxVQUlBLHlCQUFhLENBQWIsQyxVQUNBLGlCQUFLLENBQUNDLHdCQUFELENBQUwsQzs7Ozs7Ozs7Ozs7Ozs7OztBQUtEOzs7OztpQ0FLbUJDLEksRUFBK0I7QUFDOUMsYUFBS0MsS0FBTCxHQUFhRCxJQUFJLENBQUNFLElBQWxCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQkgsSUFBSSxDQUFDSSxRQUF0QjtBQUNBLGFBQUtDLE9BQUwsR0FBZUwsSUFBSSxDQUFDTSxNQUFwQjs7QUFDQSxZQUFJTixJQUFJLENBQUNPLEdBQVQsRUFBYztBQUFFLGVBQUtDLElBQUwsR0FBWVIsSUFBSSxDQUFDTyxHQUFqQjtBQUF1Qjs7QUFDdkMsZUFBTyxJQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7K0JBS2lCRSxRLEVBQTBCO0FBQ3ZDLGFBQUtDLFNBQUwsR0FBaUJELFFBQWpCOztBQUNBLGFBQUtKLE9BQUwsQ0FBYU0sSUFBYixDQUFrQixVQUFDQyxDQUFELEVBQUlDLENBQUosRUFBVTtBQUN4QixpQkFBT0QsQ0FBQyxDQUFDUixRQUFGLEdBQWFTLENBQUMsQ0FBQ1QsUUFBdEI7QUFDSCxTQUZEOztBQUlBLGFBQUssSUFBSVUsQ0FBQyxHQUFHLENBQVIsRUFBV0MsR0FBRyxHQUFHLEtBQUtWLE9BQUwsQ0FBYVcsTUFBbkMsRUFBMkNGLENBQUMsR0FBR0MsR0FBL0MsRUFBb0RELENBQUMsRUFBckQsRUFBeUQ7QUFDckQsZUFBS1QsT0FBTCxDQUFhUyxDQUFiLEVBQWdCRyxRQUFoQixDQUF5QlIsUUFBekIsRUFBbUMsSUFBbkM7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OzZCQUtlUyxJLEVBQWtCO0FBQzdCLGFBQUssSUFBSUosQ0FBQyxHQUFHLENBQVIsRUFBV0MsR0FBRyxHQUFHLEtBQUtWLE9BQUwsQ0FBYVcsTUFBbkMsRUFBMkNGLENBQUMsR0FBR0MsR0FBL0MsRUFBb0RELENBQUMsRUFBckQsRUFBeUQ7QUFDckQsZUFBS1QsT0FBTCxDQUFhUyxDQUFiLEVBQWdCSyxNQUFoQixDQUF1QkQsSUFBdkI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Z0NBSWtCO0FBQ2QsYUFBSyxJQUFJSixDQUFDLEdBQUcsQ0FBUixFQUFXQyxHQUFHLEdBQUcsS0FBS1YsT0FBTCxDQUFhVyxNQUFuQyxFQUEyQ0YsQ0FBQyxHQUFHQyxHQUEvQyxFQUFvREQsQ0FBQyxFQUFyRCxFQUF5RDtBQUNyRCxlQUFLVCxPQUFMLENBQWFTLENBQWIsRUFBZ0JNLE9BQWhCO0FBQ0g7O0FBRUQsYUFBS2YsT0FBTCxDQUFhVyxNQUFiLEdBQXNCLENBQXRCO0FBQ0g7Ozs7QUFyR0Q7Ozs7MEJBSTJCO0FBQ3ZCLGVBQU8sS0FBS2YsS0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSStCO0FBQzNCLGVBQU8sS0FBS0UsU0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSTBCO0FBQ3RCLGVBQU8sS0FBS0ssSUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7OzBCQUtvQztBQUNoQyxlQUFPLEtBQUtILE9BQVo7QUFDSDs7Ozs0RkFHQWdCLG1COzs7OzthQUN5QixFOzt1RkFHekJBLG1COzs7OzthQUM2QixDOztrRkFHN0JBLG1COzs7OzthQUN3QixDOzs0RkFJeEJBLG1COzs7OzthQUNrQyxFOzs7O0FBd0R2Q0MsMEJBQVN4QixVQUFULEdBQXNCQSxVQUF0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcbmltcG9ydCB7IGNjY2xhc3MsIGRpc3BsYXlPcmRlciwgc2VyaWFsaXphYmxlLCB0eXBlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUmVuZGVyU3RhZ2UgfSBmcm9tICcuL3JlbmRlci1zdGFnZSc7XHJcbmltcG9ydCB7IFJlbmRlclZpZXcgfSBmcm9tICcuL3JlbmRlci12aWV3JztcclxuaW1wb3J0IHsgUmVuZGVyUGlwZWxpbmUgfSBmcm9tICcuL3JlbmRlci1waXBlbGluZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBSZW5kZXIgZmxvdyBpbmZvcm1hdGlvbiBkZXNjcmlwdG9yXHJcbiAqIEB6aCDmuLLmn5PmtYHnqIvmj4/ov7Dkv6Hmga/jgIJcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlckZsb3dJbmZvIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHByaW9yaXR5OiBudW1iZXI7XHJcbiAgICBzdGFnZXM6IFJlbmRlclN0YWdlW107XHJcbiAgICB0YWc/OiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gUmVuZGVyIGZsb3cgaXMgYSBzdWIgcHJvY2VzcyBvZiB0aGUgW1tSZW5kZXJQaXBlbGluZV1dLCBpdCBkaXNwYXRjaCB0aGUgcmVuZGVyIHRhc2sgdG8gYWxsIHRoZSBbW1JlbmRlclN0YWdlXV1zLlxyXG4gKiBAemgg5riy5p+T5rWB56iL5piv5riy5p+T566h57q/77yIW1tSZW5kZXJQaXBlbGluZV1d77yJ55qE5LiA5Liq5a2Q6L+H56iL77yM5a6D5bCG5riy5p+T5Lu75Yqh5rS+5Y+R5Yiw5a6D55qE5omA5pyJ5riy5p+T6Zi25q6177yIW1tSZW5kZXJTdGFnZV1d77yJ5Lit5omn6KGM44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnUmVuZGVyRmxvdycpXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZW5kZXJGbG93IHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBuYW1lIG9mIHRoZSByZW5kZXIgZmxvd1xyXG4gICAgICogQHpoIOa4suafk+a1geeoi+eahOWQjeWtl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUgKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUHJpb3JpdHkgb2YgdGhlIGN1cnJlbnQgZmxvd1xyXG4gICAgICogQHpoIOW9k+WJjea4suafk+a1geeoi+eahOS8mOWFiOe6p+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHByaW9yaXR5ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcmlvcml0eTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUYWcgb2YgdGhlIGN1cnJlbnQgZmxvd1xyXG4gICAgICogQHpoIOW9k+WJjea4suafk+a1geeoi+eahOagh+etvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHRhZyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGFnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBzdGFnZXMgb2YgZmxvdy5cclxuICAgICAqIEB6aCDmuLLmn5PmtYHnqIsgc3RhZ2Ug5YiX6KGo44CCXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzdGFnZXMgKCk6IFJlbmRlclN0YWdlW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFnZXM7XHJcbiAgICB9XHJcblxyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBAZGlzcGxheU9yZGVyKDEpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3ByaW9yaXR5OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdGFnOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIEBkaXNwbGF5T3JkZXIoMylcclxuICAgIEB0eXBlKFtSZW5kZXJTdGFnZV0pXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3N0YWdlczogUmVuZGVyU3RhZ2VbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9waXBlbGluZSE6IFJlbmRlclBpcGVsaW5lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBpbml0aWFsaXphdGlvbiBwcm9jZXNzLCB1c2VyIHNob3VsZG4ndCB1c2UgaXQgaW4gbW9zdCBjYXNlLCBvbmx5IHVzZWZ1bCB3aGVuIG5lZWQgdG8gZ2VuZXJhdGUgcmVuZGVyIHBpcGVsaW5lIHByb2dyYW1tYXRpY2FsbHkuXHJcbiAgICAgKiBAemgg5Yid5aeL5YyW5Ye95pWw77yM5q2j5bi45oOF5Ya15LiL5LiN5Lya55So5Yiw77yM5LuF55So5LqO56iL5bqP5YyW55Sf5oiQ5riy5p+T566h57q/55qE5oOF5Ya144CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBUaGUgcmVuZGVyIGZsb3cgaW5mb3JtYXRpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IElSZW5kZXJGbG93SW5mbyk6IGJvb2xlYW57XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IGluZm8ubmFtZTtcclxuICAgICAgICB0aGlzLl9wcmlvcml0eSA9IGluZm8ucHJpb3JpdHk7XHJcbiAgICAgICAgdGhpcy5fc3RhZ2VzID0gaW5mby5zdGFnZXM7XHJcbiAgICAgICAgaWYgKGluZm8udGFnKSB7IHRoaXMuX3RhZyA9IGluZm8udGFnOyB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWN0aXZhdGUgdGhlIGN1cnJlbnQgcmVuZGVyIGZsb3cgaW4gdGhlIGdpdmVuIHBpcGVsaW5lXHJcbiAgICAgKiBAemgg5Li65oyH5a6a55qE5riy5p+T566h57q/5byA5ZCv5b2T5YmN5riy5p+T5rWB56iLXHJcbiAgICAgKiBAcGFyYW0gcGlwZWxpbmUgVGhlIHJlbmRlciBwaXBlbGluZSB0byBhY3RpdmF0ZSB0aGlzIHJlbmRlciBmbG93XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAocGlwZWxpbmU6IFJlbmRlclBpcGVsaW5lKSB7XHJcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUgPSBwaXBlbGluZTtcclxuICAgICAgICB0aGlzLl9zdGFnZXMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLl9zdGFnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhZ2VzW2ldLmFjdGl2YXRlKHBpcGVsaW5lLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVuZGVyIGZ1bmN0aW9uLCBpdCBiYXNpY2FsbHkgcnVuIGFsbCByZW5kZXIgc3RhZ2VzIGluIHNlcXVlbmNlIGZvciB0aGUgZ2l2ZW4gdmlldy5cclxuICAgICAqIEB6aCDmuLLmn5Plh73mlbDvvIzlr7nmjIflrprnmoTmuLLmn5Pop4blm77mjInpobrluo/miafooYzmiYDmnInmuLLmn5PpmLbmrrXjgIJcclxuICAgICAqIEBwYXJhbSB2aWV3IFJlbmRlciB2aWV344CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW5kZXIgKHZpZXc6IFJlbmRlclZpZXcpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5fc3RhZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YWdlc1tpXS5yZW5kZXIodmlldyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIERlc3Ryb3kgZnVuY3Rpb24uXHJcbiAgICAgKiBAemgg6ZSA5q+B5Ye95pWw44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5fc3RhZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YWdlc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zdGFnZXMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuUmVuZGVyRmxvdyA9IFJlbmRlckZsb3c7XHJcbiJdfQ==