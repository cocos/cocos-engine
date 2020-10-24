(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../../gfx/define.js", "../render-stage.js", "../forward/enum.js", "../pipeline-serialization.js", "../pass-phase.js", "../render-queue.js", "../define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../../gfx/define.js"), require("../render-stage.js"), require("../forward/enum.js"), require("../pipeline-serialization.js"), require("../pass-phase.js"), require("../render-queue.js"), require("../define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.renderStage, global._enum, global.pipelineSerialization, global.passPhase, global.renderQueue, global.define);
    global.uiStage = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _renderStage, _enum, _pipelineSerialization, _passPhase, _renderQueue, _define2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIStage = void 0;

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var colors = [];
  /**
   * @en The UI render stage
   * @zh UI渲阶段。
   */

  var UIStage = (_dec = (0, _index.ccclass)('UIStage'), _dec2 = (0, _index.type)([_pipelineSerialization.RenderQueueDesc]), _dec3 = (0, _index.displayOrder)(2), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_RenderStage) {
    _inherits(UIStage, _RenderStage);

    function UIStage() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UIStage);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIStage)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "renderQueues", _descriptor, _assertThisInitialized(_this));

      _this._renderQueues = [];
      _this._renderArea = new _define.GFXRect();
      return _this;
    }

    _createClass(UIStage, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(UIStage.prototype), "initialize", this).call(this, info);

        if (info.renderQueues) {
          this.renderQueues = info.renderQueues;
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline, flow) {
        _get(_getPrototypeOf(UIStage.prototype), "activate", this).call(this, pipeline, flow);

        for (var i = 0; i < this.renderQueues.length; i++) {
          var phase = 0;

          for (var j = 0; j < this.renderQueues[i].stages.length; j++) {
            phase |= (0, _passPhase.getPhaseID)(this.renderQueues[i].stages[j]);
          }

          var sortFunc = _renderQueue.opaqueCompareFn;

          switch (this.renderQueues[i].sortMode) {
            case _pipelineSerialization.RenderQueueSortMode.BACK_TO_FRONT:
              sortFunc = _renderQueue.transparentCompareFn;
              break;

            case _pipelineSerialization.RenderQueueSortMode.FRONT_TO_BACK:
              sortFunc = _renderQueue.opaqueCompareFn;
              break;
          }

          this._renderQueues[i] = new _renderQueue.RenderQueue({
            isTransparent: this.renderQueues[i].isTransparent,
            phases: phase,
            sortFunc: sortFunc
          });
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {}
    }, {
      key: "render",
      value: function render(view) {
        var pipeline = this._pipeline;
        var isHDR = pipeline.isHDR;
        pipeline.isHDR = false;
        var device = pipeline.device;

        this._renderQueues[0].clear();

        var renderObjects = pipeline.renderObjects;

        for (var i = 0; i < renderObjects.length; i++) {
          var ro = renderObjects[i];
          var subModels = ro.model.subModels;

          for (var j = 0; j < subModels.length; j++) {
            var passes = subModels[j].passes;

            for (var k = 0; k < passes.length; k++) {
              this._renderQueues[0].insertRenderPass(ro, j, k);
            }
          }
        }

        this._renderQueues[0].sort();

        var camera = view.camera;
        var vp = camera.viewport;
        this._renderArea.x = vp.x * camera.width;
        this._renderArea.y = vp.y * camera.height;
        this._renderArea.width = vp.width * camera.width;
        this._renderArea.height = vp.height * camera.height;
        colors[0] = camera.clearColor;
        var cmdBuff = pipeline.commandBuffers[0];
        var framebuffer = view.window.framebuffer;
        var renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea, colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.bindDescriptorSet(_define2.SetIndex.GLOBAL, pipeline.descriptorSet);

        this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
        pipeline.isHDR = isHDR;
      }
    }]);

    return UIStage;
  }(_renderStage.RenderStage), _class3.initInfo = {
    name: 'UIStage',
    priority: _enum.ForwardStagePriority.UI,
    tag: 0,
    renderQueues: [{
      isTransparent: true,
      stages: ['default'],
      sortMode: _pipelineSerialization.RenderQueueSortMode.BACK_TO_FRONT
    }]
  }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "renderQueues", [_dec2, _index.serializable, _dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class);
  _exports.UIStage = UIStage;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvdWkvdWktc3RhZ2UudHMiXSwibmFtZXMiOlsiY29sb3JzIiwiVUlTdGFnZSIsIlJlbmRlclF1ZXVlRGVzYyIsIl9yZW5kZXJRdWV1ZXMiLCJfcmVuZGVyQXJlYSIsIkdGWFJlY3QiLCJpbmZvIiwicmVuZGVyUXVldWVzIiwicGlwZWxpbmUiLCJmbG93IiwiaSIsImxlbmd0aCIsInBoYXNlIiwiaiIsInN0YWdlcyIsInNvcnRGdW5jIiwib3BhcXVlQ29tcGFyZUZuIiwic29ydE1vZGUiLCJSZW5kZXJRdWV1ZVNvcnRNb2RlIiwiQkFDS19UT19GUk9OVCIsInRyYW5zcGFyZW50Q29tcGFyZUZuIiwiRlJPTlRfVE9fQkFDSyIsIlJlbmRlclF1ZXVlIiwiaXNUcmFuc3BhcmVudCIsInBoYXNlcyIsInZpZXciLCJfcGlwZWxpbmUiLCJpc0hEUiIsImRldmljZSIsImNsZWFyIiwicmVuZGVyT2JqZWN0cyIsInJvIiwic3ViTW9kZWxzIiwibW9kZWwiLCJwYXNzZXMiLCJrIiwiaW5zZXJ0UmVuZGVyUGFzcyIsInNvcnQiLCJjYW1lcmEiLCJ2cCIsInZpZXdwb3J0IiwieCIsIndpZHRoIiwieSIsImhlaWdodCIsImNsZWFyQ29sb3IiLCJjbWRCdWZmIiwiY29tbWFuZEJ1ZmZlcnMiLCJmcmFtZWJ1ZmZlciIsIndpbmRvdyIsInJlbmRlclBhc3MiLCJjb2xvclRleHR1cmVzIiwiZ2V0UmVuZGVyUGFzcyIsImNsZWFyRmxhZyIsImJlZ2luUmVuZGVyUGFzcyIsImNsZWFyRGVwdGgiLCJjbGVhclN0ZW5jaWwiLCJiaW5kRGVzY3JpcHRvclNldCIsIlNldEluZGV4IiwiR0xPQkFMIiwiZGVzY3JpcHRvclNldCIsInJlY29yZENvbW1hbmRCdWZmZXIiLCJlbmRSZW5kZXJQYXNzIiwiUmVuZGVyU3RhZ2UiLCJpbml0SW5mbyIsIm5hbWUiLCJwcmlvcml0eSIsIkZvcndhcmRTdGFnZVByaW9y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QUF3RDFDLFFBQVEsQ0FBQzRDLGFBQVQsQ0FBdUJkLE1BQU0sQ0FBQ2UsU0FBOUIsQ0FBM0U7QUFFQVAsUUFBQUEsT0FBTyxDQUFDUSxlQUFSLENBQXdCSixVQUF4QixFQUFvQ0YsV0FBcEMsRUFBaUQsS0FBSzVDLFdBQXRELEVBQ0lKLE1BREosRUFDWXNDLE1BQU0sQ0FBQ2lCLFVBRG5CLEVBQytCakIsTUFBTSxDQUFDa0IsWUFEdEM7QUFHQVYsUUFBQUEsT0FBTyxDQUFDVyxpQkFBUixDQUEwQkMsa0JBQVNDLE1BQW5DLEVBQTJDbkQsUUFBUSxDQUFDb0QsYUFBcEQ7O0FBRUEsYUFBS3pELGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0IwRCxtQkFBdEIsQ0FBMENqQyxNQUExQyxFQUFrRHNCLFVBQWxELEVBQThESixPQUE5RDs7QUFFQUEsUUFBQUEsT0FBTyxDQUFDZ0IsYUFBUjtBQUVBdEQsUUFBQUEsUUFBUSxDQUFDbUIsS0FBVCxHQUFpQkEsS0FBakI7QUFDSDs7OztJQXRHd0JvQyx3QixXQUNYQyxRLEdBQTZCO0FBQ3ZDQyxJQUFBQSxJQUFJLEVBQUUsU0FEaUM7QUFFdkNDLElBQUFBLFFBQVEsRUFBRUMsMkJBQXFCQyxFQUZRO0FBR3ZDQyxJQUFBQSxHQUFHLEVBQUUsQ0FIa0M7QUFJdkM5RCxJQUFBQSxZQUFZLEVBQUUsQ0FDVjtBQUNJZ0IsTUFBQUEsYUFBYSxFQUFFLElBRG5CO0FBRUlULE1BQUFBLE1BQU0sRUFBRSxDQUFDLFNBQUQsQ0FGWjtBQUdJRyxNQUFBQSxRQUFRLEVBQUVDLDJDQUFvQkM7QUFIbEMsS0FEVTtBQUp5QixHLDhGQWMxQ21ELG1COzs7OzthQUUyQyxFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaXBlbGluZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgR0ZYQ29sb3IsIEdGWFJlY3QgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgSVJlbmRlclN0YWdlSW5mbywgUmVuZGVyU3RhZ2UgfSBmcm9tICcuLi9yZW5kZXItc3RhZ2UnO1xyXG5pbXBvcnQgeyBSZW5kZXJWaWV3IH0gZnJvbSAnLi4vcmVuZGVyLXZpZXcnO1xyXG5pbXBvcnQgeyBGb3J3YXJkU3RhZ2VQcmlvcml0eSB9IGZyb20gJy4uL2ZvcndhcmQvZW51bSc7XHJcbmltcG9ydCB7IFVJRmxvdyB9IGZyb20gJy4vdWktZmxvdyc7XHJcbmltcG9ydCB7IEZvcndhcmRQaXBlbGluZSB9IGZyb20gJy4uL2ZvcndhcmQvZm9yd2FyZC1waXBlbGluZSc7XHJcbmltcG9ydCB7IFJlbmRlclF1ZXVlRGVzYywgUmVuZGVyUXVldWVTb3J0TW9kZSB9IGZyb20gJy4uL3BpcGVsaW5lLXNlcmlhbGl6YXRpb24nO1xyXG5pbXBvcnQgeyBnZXRQaGFzZUlEIH0gZnJvbSAnLi4vcGFzcy1waGFzZSc7XHJcbmltcG9ydCB7IG9wYXF1ZUNvbXBhcmVGbiwgUmVuZGVyUXVldWUsIHRyYW5zcGFyZW50Q29tcGFyZUZuIH0gZnJvbSAnLi4vcmVuZGVyLXF1ZXVlJztcclxuaW1wb3J0IHsgSVJlbmRlclBhc3MsIFNldEluZGV4IH0gZnJvbSAnLi4vZGVmaW5lJztcclxuXHJcbmNvbnN0IGNvbG9yczogR0ZYQ29sb3JbXSA9IFtdO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgVUkgcmVuZGVyIHN0YWdlXHJcbiAqIEB6aCBVSea4sumYtuauteOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ1VJU3RhZ2UnKVxyXG5leHBvcnQgY2xhc3MgVUlTdGFnZSBleHRlbmRzIFJlbmRlclN0YWdlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdEluZm86IElSZW5kZXJTdGFnZUluZm8gPSB7XHJcbiAgICAgICAgbmFtZTogJ1VJU3RhZ2UnLFxyXG4gICAgICAgIHByaW9yaXR5OiBGb3J3YXJkU3RhZ2VQcmlvcml0eS5VSSxcclxuICAgICAgICB0YWc6IDAsXHJcbiAgICAgICAgcmVuZGVyUXVldWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlzVHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzdGFnZXM6IFsnZGVmYXVsdCddLFxyXG4gICAgICAgICAgICAgICAgc29ydE1vZGU6IFJlbmRlclF1ZXVlU29ydE1vZGUuQkFDS19UT19GUk9OVCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH07XHJcblxyXG4gICAgQHR5cGUoW1JlbmRlclF1ZXVlRGVzY10pXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDIpXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUXVldWVzOiBSZW5kZXJRdWV1ZURlc2NbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9yZW5kZXJRdWV1ZXM6IFJlbmRlclF1ZXVlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIF9yZW5kZXJBcmVhID0gbmV3IEdGWFJlY3QoKTtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlclN0YWdlSW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoaW5mbyk7XHJcbiAgICAgICAgaWYgKGluZm8ucmVuZGVyUXVldWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUXVldWVzID0gaW5mby5yZW5kZXJRdWV1ZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFjdGl2YXRlIChwaXBlbGluZTogRm9yd2FyZFBpcGVsaW5lLCBmbG93OiBVSUZsb3cpIHtcclxuICAgICAgICBzdXBlci5hY3RpdmF0ZShwaXBlbGluZSwgZmxvdyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlbmRlclF1ZXVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcGhhc2UgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucmVuZGVyUXVldWVzW2ldLnN0YWdlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgcGhhc2UgfD0gZ2V0UGhhc2VJRCh0aGlzLnJlbmRlclF1ZXVlc1tpXS5zdGFnZXNbal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBzb3J0RnVuYzogKGE6IElSZW5kZXJQYXNzLCBiOiBJUmVuZGVyUGFzcykgPT4gbnVtYmVyID0gb3BhcXVlQ29tcGFyZUZuO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMucmVuZGVyUXVldWVzW2ldLnNvcnRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJlbmRlclF1ZXVlU29ydE1vZGUuQkFDS19UT19GUk9OVDpcclxuICAgICAgICAgICAgICAgICAgICBzb3J0RnVuYyA9IHRyYW5zcGFyZW50Q29tcGFyZUZuO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBSZW5kZXJRdWV1ZVNvcnRNb2RlLkZST05UX1RPX0JBQ0s6XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEZ1bmMgPSBvcGFxdWVDb21wYXJlRm47XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclF1ZXVlc1tpXSA9IG5ldyBSZW5kZXJRdWV1ZSh7XHJcbiAgICAgICAgICAgICAgICBpc1RyYW5zcGFyZW50OiB0aGlzLnJlbmRlclF1ZXVlc1tpXS5pc1RyYW5zcGFyZW50LFxyXG4gICAgICAgICAgICAgICAgcGhhc2VzOiBwaGFzZSxcclxuICAgICAgICAgICAgICAgIHNvcnRGdW5jLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIgKHZpZXc6IFJlbmRlclZpZXcpIHtcclxuICAgICAgICBjb25zdCBwaXBlbGluZSA9IHRoaXMuX3BpcGVsaW5lIGFzIEZvcndhcmRQaXBlbGluZTtcclxuICAgICAgICBjb25zdCBpc0hEUiA9IHBpcGVsaW5lLmlzSERSO1xyXG4gICAgICAgIHBpcGVsaW5lLmlzSERSID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IGRldmljZSA9IHBpcGVsaW5lLmRldmljZTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJRdWV1ZXNbMF0uY2xlYXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVuZGVyT2JqZWN0cyA9IHBpcGVsaW5lLnJlbmRlck9iamVjdHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJPYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvID0gcmVuZGVyT2JqZWN0c1tpXTtcclxuICAgICAgICAgICAgY29uc3Qgc3ViTW9kZWxzID0gcm8ubW9kZWwuc3ViTW9kZWxzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN1Yk1vZGVscy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFzc2VzID0gc3ViTW9kZWxzW2pdLnBhc3NlcztcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcGFzc2VzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzWzBdLmluc2VydFJlbmRlclBhc3Mocm8sIGosIGspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JlbmRlclF1ZXVlc1swXS5zb3J0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IHZpZXcuY2FtZXJhITtcclxuICAgICAgICBjb25zdCB2cCA9IGNhbWVyYS52aWV3cG9ydDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBcmVhIS54ID0gdnAueCAqIGNhbWVyYS53aWR0aDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBcmVhIS55ID0gdnAueSAqIGNhbWVyYS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyQXJlYSEud2lkdGggPSB2cC53aWR0aCAqIGNhbWVyYS53aWR0aDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBcmVhIS5oZWlnaHQgPSB2cC5oZWlnaHQgKiBjYW1lcmEuaGVpZ2h0O1xyXG5cclxuICAgICAgICBjb2xvcnNbMF0gPSBjYW1lcmEuY2xlYXJDb2xvciBhcyBHRlhDb2xvcjtcclxuXHJcbiAgICAgICAgY29uc3QgY21kQnVmZiA9IHBpcGVsaW5lLmNvbW1hbmRCdWZmZXJzWzBdO1xyXG5cclxuICAgICAgICBjb25zdCBmcmFtZWJ1ZmZlciA9IHZpZXcud2luZG93LmZyYW1lYnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3MgPSBmcmFtZWJ1ZmZlci5jb2xvclRleHR1cmVzWzBdID8gZnJhbWVidWZmZXIucmVuZGVyUGFzcyA6IHBpcGVsaW5lLmdldFJlbmRlclBhc3MoY2FtZXJhLmNsZWFyRmxhZyk7XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYuYmVnaW5SZW5kZXJQYXNzKHJlbmRlclBhc3MsIGZyYW1lYnVmZmVyLCB0aGlzLl9yZW5kZXJBcmVhISxcclxuICAgICAgICAgICAgY29sb3JzLCBjYW1lcmEuY2xlYXJEZXB0aCwgY2FtZXJhLmNsZWFyU3RlbmNpbCk7XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguR0xPQkFMLCBwaXBlbGluZS5kZXNjcmlwdG9yU2V0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzWzBdLnJlY29yZENvbW1hbmRCdWZmZXIoZGV2aWNlLCByZW5kZXJQYXNzLCBjbWRCdWZmKTtcclxuXHJcbiAgICAgICAgY21kQnVmZi5lbmRSZW5kZXJQYXNzKCk7XHJcblxyXG4gICAgICAgIHBpcGVsaW5lLmlzSERSID0gaXNIRFI7XHJcbiAgICB9XHJcbn1cclxuIl19