(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.globalExports);
    global.renderStage = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderStage = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en The render stage actually renders render objects to the output window or other [[GFXFrameBuffer]].
   * Typically, a render stage collects render objects it's responsible for, clear the camera,
   * record and execute command buffer, and at last present the render result.
   * @zh 渲染阶段是实质上的渲染执行者，它负责收集渲染数据并执行渲染将渲染结果输出到屏幕或其他 [[GFXFrameBuffer]] 中。
   * 典型的渲染阶段会收集它所管理的渲染对象，按照 [[Camera]] 的清除标记进行清屏，记录并执行渲染指令缓存，并最终呈现渲染结果。
   */
  var RenderStage = (_dec = (0, _index.ccclass)('RenderStage'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.displayOrder)(1), _dec4 = (0, _index.displayOrder)(2), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function RenderStage() {
      _classCallCheck(this, RenderStage);

      _initializerDefineProperty(this, "_name", _descriptor, this);

      _initializerDefineProperty(this, "_priority", _descriptor2, this);

      _initializerDefineProperty(this, "_tag", _descriptor3, this);
    }

    _createClass(RenderStage, [{
      key: "initialize",

      /**
       * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
       * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
       * @param info The render stage information
       */
      value: function initialize(info) {
        this._name = info.name;
        this._priority = info.priority;

        if (info.tag) {
          this._tag = info.tag;
        }

        return true;
      }
      /**
       * @en Activate the current render stage in the given render flow
       * @zh 为指定的渲染流程开启当前渲染阶段
       * @param flow The render flow to activate this render stage
       */

    }, {
      key: "activate",
      value: function activate(pipeline, flow) {
        this._pipeline = pipeline;
        this._flow = flow;
      }
      /**
       * @en Destroy function
       * @zh 销毁函数。
       */

    }, {
      key: "name",

      /**
       * @en Name of the current stage
       * @zh 当前渲染阶段的名字。
       */
      get: function get() {
        return this._name;
      }
      /**
       * @en Priority of the current stage
       * @zh 当前渲染阶段的优先级。
       */

    }, {
      key: "priority",
      get: function get() {
        return this._priority;
      }
      /**
       * @en Tag of the current stage
       * @zh 当前渲染阶段的标签。
       */

    }, {
      key: "tag",
      get: function get() {
        return this._tag;
      }
      /**
       * @en Name
       * @zh 名称。
       */

    }]);

    return RenderStage;
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
  })), _class2)) || _class);
  _exports.RenderStage = RenderStage;
  _globalExports.legacyCC.RenderStage = RenderStage;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLXN0YWdlLnRzIl0sIm5hbWVzIjpbIlJlbmRlclN0YWdlIiwiaW5mbyIsIl9uYW1lIiwibmFtZSIsIl9wcmlvcml0eSIsInByaW9yaXR5IiwidGFnIiwiX3RhZyIsInBpcGVsaW5lIiwiZmxvdyIsIl9waXBlbGluZSIsIl9mbG93Iiwic2VyaWFsaXphYmxlIiwibGVnYWN5Q0MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkE7Ozs7Ozs7TUFRc0JBLFcsV0FEckIsb0JBQVEsYUFBUixDLFVBOEJJLHlCQUFhLENBQWIsQyxVQVFBLHlCQUFhLENBQWIsQyxVQVFBLHlCQUFhLENBQWIsQzs7Ozs7Ozs7Ozs7Ozs7QUFNRDs7Ozs7aUNBS21CQyxJLEVBQWlDO0FBQ2hELGFBQUtDLEtBQUwsR0FBYUQsSUFBSSxDQUFDRSxJQUFsQjtBQUNBLGFBQUtDLFNBQUwsR0FBaUJILElBQUksQ0FBQ0ksUUFBdEI7O0FBQ0EsWUFBSUosSUFBSSxDQUFDSyxHQUFULEVBQWM7QUFBRSxlQUFLQyxJQUFMLEdBQVlOLElBQUksQ0FBQ0ssR0FBakI7QUFBdUI7O0FBQ3ZDLGVBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7OytCQUtpQkUsUSxFQUEwQkMsSSxFQUFrQjtBQUN6RCxhQUFLQyxTQUFMLEdBQWlCRixRQUFqQjtBQUNBLGFBQUtHLEtBQUwsR0FBYUYsSUFBYjtBQUNIO0FBRUQ7Ozs7Ozs7O0FBeEVBOzs7OzBCQUkyQjtBQUN2QixlQUFPLEtBQUtQLEtBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUkrQjtBQUMzQixlQUFPLEtBQUtFLFNBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUkwQjtBQUN0QixlQUFPLEtBQUtHLElBQVo7QUFDSDtBQUVEOzs7Ozs7Ozs0RkFLQ0ssbUI7Ozs7O2FBQ3lCLEU7O3VGQU96QkEsbUI7Ozs7O2FBQzZCLEM7O2tGQU83QkEsbUI7Ozs7O2FBQ3dCLEM7Ozs7QUF3QzdCQywwQkFBU2IsV0FBVCxHQUF1QkEsV0FBdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBpcGVsaW5lXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgZGlzcGxheU9yZGVyLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBSZW5kZXJWaWV3IH0gZnJvbSAnLi9yZW5kZXItdmlldyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBSZW5kZXJQaXBlbGluZSB9IGZyb20gJy4vcmVuZGVyLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgUmVuZGVyRmxvdyB9IGZyb20gJy4vcmVuZGVyLWZsb3cnO1xyXG5pbXBvcnQgeyBSZW5kZXJRdWV1ZURlc2MgfSBmcm9tICcuL3BpcGVsaW5lLXNlcmlhbGl6YXRpb24nO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgcmVuZGVyIHN0YWdlIGluZm9ybWF0aW9uIGRlc2NyaXB0b3JcclxuICogQHpoIOa4suafk+mYtuauteaPj+i/sOS/oeaBr+OAglxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJUmVuZGVyU3RhZ2VJbmZvIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHByaW9yaXR5OiBudW1iZXI7XHJcbiAgICB0YWc/OiBudW1iZXI7XHJcbiAgICByZW5kZXJRdWV1ZXM/OiBSZW5kZXJRdWV1ZURlc2NbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgcmVuZGVyIHN0YWdlIGFjdHVhbGx5IHJlbmRlcnMgcmVuZGVyIG9iamVjdHMgdG8gdGhlIG91dHB1dCB3aW5kb3cgb3Igb3RoZXIgW1tHRlhGcmFtZUJ1ZmZlcl1dLlxyXG4gKiBUeXBpY2FsbHksIGEgcmVuZGVyIHN0YWdlIGNvbGxlY3RzIHJlbmRlciBvYmplY3RzIGl0J3MgcmVzcG9uc2libGUgZm9yLCBjbGVhciB0aGUgY2FtZXJhLFxyXG4gKiByZWNvcmQgYW5kIGV4ZWN1dGUgY29tbWFuZCBidWZmZXIsIGFuZCBhdCBsYXN0IHByZXNlbnQgdGhlIHJlbmRlciByZXN1bHQuXHJcbiAqIEB6aCDmuLLmn5PpmLbmrrXmmK/lrp7otKjkuIrnmoTmuLLmn5PmiafooYzogIXvvIzlroPotJ/otKPmlLbpm4bmuLLmn5PmlbDmja7lubbmiafooYzmuLLmn5PlsIbmuLLmn5Pnu5PmnpzovpPlh7rliLDlsY/luZXmiJblhbbku5YgW1tHRlhGcmFtZUJ1ZmZlcl1dIOS4reOAglxyXG4gKiDlhbjlnovnmoTmuLLmn5PpmLbmrrXkvJrmlLbpm4blroPmiYDnrqHnkIbnmoTmuLLmn5Plr7nosaHvvIzmjInnhacgW1tDYW1lcmFdXSDnmoTmuIXpmaTmoIforrDov5vooYzmuIXlsY/vvIzorrDlvZXlubbmiafooYzmuLLmn5PmjIfku6TnvJPlrZjvvIzlubbmnIDnu4jlkYjnjrDmuLLmn5Pnu5PmnpzjgIJcclxuICovXHJcbkBjY2NsYXNzKCdSZW5kZXJTdGFnZScpXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZW5kZXJTdGFnZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBOYW1lIG9mIHRoZSBjdXJyZW50IHN0YWdlXHJcbiAgICAgKiBAemgg5b2T5YmN5riy5p+T6Zi25q6155qE5ZCN5a2X44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgbmFtZSAoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQcmlvcml0eSBvZiB0aGUgY3VycmVudCBzdGFnZVxyXG4gICAgICogQHpoIOW9k+WJjea4suafk+mYtuauteeahOS8mOWFiOe6p+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHByaW9yaXR5ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcmlvcml0eTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUYWcgb2YgdGhlIGN1cnJlbnQgc3RhZ2VcclxuICAgICAqIEB6aCDlvZPliY3muLLmn5PpmLbmrrXnmoTmoIfnrb7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCB0YWcgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBOYW1lXHJcbiAgICAgKiBAemgg5ZCN56ew44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMClcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nID0gJyc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUHJpb3JpdHlcclxuICAgICAqIEB6aCDkvJjlhYjnuqfjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9wcmlvcml0eTogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUeXBlXHJcbiAgICAgKiBAemgg57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdGFnOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9waXBlbGluZSE6IFJlbmRlclBpcGVsaW5lO1xyXG4gICAgcHJvdGVjdGVkIF9mbG93ITogUmVuZGVyRmxvdztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgaW5pdGlhbGl6YXRpb24gcHJvY2VzcywgdXNlciBzaG91bGRuJ3QgdXNlIGl0IGluIG1vc3QgY2FzZSwgb25seSB1c2VmdWwgd2hlbiBuZWVkIHRvIGdlbmVyYXRlIHJlbmRlciBwaXBlbGluZSBwcm9ncmFtbWF0aWNhbGx5LlxyXG4gICAgICogQHpoIOWIneWni+WMluWHveaVsO+8jOato+W4uOaDheWGteS4i+S4jeS8mueUqOWIsO+8jOS7heeUqOS6jueoi+W6j+WMlueUn+aIkOa4suafk+euoee6v+eahOaDheWGteOAglxyXG4gICAgICogQHBhcmFtIGluZm8gVGhlIHJlbmRlciBzdGFnZSBpbmZvcm1hdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlclN0YWdlSW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBpbmZvLm5hbWU7XHJcbiAgICAgICAgdGhpcy5fcHJpb3JpdHkgPSBpbmZvLnByaW9yaXR5O1xyXG4gICAgICAgIGlmIChpbmZvLnRhZykgeyB0aGlzLl90YWcgPSBpbmZvLnRhZzsgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFjdGl2YXRlIHRoZSBjdXJyZW50IHJlbmRlciBzdGFnZSBpbiB0aGUgZ2l2ZW4gcmVuZGVyIGZsb3dcclxuICAgICAqIEB6aCDkuLrmjIflrprnmoTmuLLmn5PmtYHnqIvlvIDlkK/lvZPliY3muLLmn5PpmLbmrrVcclxuICAgICAqIEBwYXJhbSBmbG93IFRoZSByZW5kZXIgZmxvdyB0byBhY3RpdmF0ZSB0aGlzIHJlbmRlciBzdGFnZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWN0aXZhdGUgKHBpcGVsaW5lOiBSZW5kZXJQaXBlbGluZSwgZmxvdzogUmVuZGVyRmxvdykge1xyXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lID0gcGlwZWxpbmU7XHJcbiAgICAgICAgdGhpcy5fZmxvdyA9IGZsb3c7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRGVzdHJveSBmdW5jdGlvblxyXG4gICAgICogQHpoIOmUgOavgeWHveaVsOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGVzdHJveSAoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZW5kZXIgZnVuY3Rpb25cclxuICAgICAqIEB6aCDmuLLmn5Plh73mlbDjgIJcclxuICAgICAqIEBwYXJhbSB2aWV3IFRoZSByZW5kZXIgdmlld1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVuZGVyICh2aWV3OiBSZW5kZXJWaWV3KTtcclxufVxyXG5cclxubGVnYWN5Q0MuUmVuZGVyU3RhZ2UgPSBSZW5kZXJTdGFnZTtcclxuIl19