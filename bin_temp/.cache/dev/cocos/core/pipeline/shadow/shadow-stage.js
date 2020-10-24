(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../../gfx/define.js", "../render-stage.js", "../forward/enum.js", "../render-shadowMap-batched-queue.js", "../define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../../gfx/define.js"), require("../render-stage.js"), require("../forward/enum.js"), require("../render-shadowMap-batched-queue.js"), require("../define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.renderStage, global._enum, global.renderShadowMapBatchedQueue, global.define);
    global.shadowStage = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _renderStage, _enum, _renderShadowMapBatchedQueue, _define2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ShadowStage = void 0;

  var _dec, _class, _class2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var colors = [new _define.GFXColor(1, 1, 1, 1)];
  /**
   * @zh
   * 阴影渲染阶段。
   */

  var ShadowStage = (_dec = (0, _index.ccclass)('ShadowStage'), _dec(_class = (_temp = _class2 = /*#__PURE__*/function (_RenderStage) {
    _inherits(ShadowStage, _RenderStage);

    _createClass(ShadowStage, [{
      key: "setShadowFrameBuffer",
      value: function setShadowFrameBuffer(shadowFrameBuffer) {
        this._shadowFrameBuffer = shadowFrameBuffer;
      }
    }]);

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    function ShadowStage() {
      var _this;

      _classCallCheck(this, ShadowStage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ShadowStage).call(this));
      _this._additiveShadowQueue = void 0;
      _this._shadowFrameBuffer = null;
      _this._renderArea = new _define.GFXRect();
      _this._additiveShadowQueue = new _renderShadowMapBatchedQueue.RenderShadowMapBatchedQueue();
      return _this;
    }
    /**
     * @zh
     * 销毁函数。
     */


    _createClass(ShadowStage, [{
      key: "destroy",
      value: function destroy() {}
      /**
       * @zh
       * 渲染函数。
       * @param view 渲染视图。
       */

    }, {
      key: "render",
      value: function render(view) {
        var pipeline = this._pipeline;
        var shadowInfo = pipeline.shadows;

        this._additiveShadowQueue.clear(pipeline.descriptorSet.getBuffer(_define2.UBOShadow.BINDING));

        var shadowObjects = pipeline.shadowObjects;
        var m = 0;
        var p = 0;

        for (var i = 0; i < shadowObjects.length; ++i) {
          var ro = shadowObjects[i];
          var subModels = ro.model.subModels;

          for (m = 0; m < subModels.length; m++) {
            var passes = subModels[m].passes;

            for (p = 0; p < passes.length; p++) {
              this._additiveShadowQueue.add(ro, m, p);
            }
          }
        }

        var camera = view.camera;
        var cmdBuff = pipeline.commandBuffers[0];
        var vp = camera.viewport;
        var shadowMapSize = shadowInfo.size;
        this._renderArea.x = vp.x * shadowMapSize.x;
        this._renderArea.y = vp.y * shadowMapSize.y;
        this._renderArea.width = vp.width * shadowMapSize.x * pipeline.shadingScale;
        this._renderArea.height = vp.height * shadowMapSize.y * pipeline.shadingScale;
        var device = pipeline.device;
        var renderPass = this._shadowFrameBuffer.renderPass;
        cmdBuff.beginRenderPass(renderPass, this._shadowFrameBuffer, this._renderArea, colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.bindDescriptorSet(_define2.SetIndex.GLOBAL, pipeline.descriptorSet);

        this._additiveShadowQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
      }
    }]);

    return ShadowStage;
  }(_renderStage.RenderStage), _class2.initInfo = {
    name: 'ShadowStage',
    priority: _enum.ForwardStagePriority.FORWARD,
    tag: 0
  }, _temp)) || _class);
  _exports.ShadowStage = ShadowStage;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvc2hhZG93L3NoYWRvdy1zdGFnZS50cyJdLCJuYW1lcyI6WyJjb2xvcnMiLCJHRlhDb2xvciIsIlNoYWRvd1N0YWdlIiwic2hhZG93RnJhbWVCdWZmZXIiLCJfc2hhZG93RnJhbWVCdWZmZXIiLCJfYWRkaXRpdmVTaGFkb3dRdWV1ZSIsIl9yZW5kZXJBcmVhIiwiR0ZYUmVjdCIsIlJlbmRlclNoYWRvd01hcEJhdGNoZWRRdWV1ZSIsInZpZXciLCJwaXBlbGluZSIsIl9waXBlbGluZSIsInNoYWRvd0luZm8iLCJzaGFkb3dzIiwiY2xlYXIiLCJkZXNjcmlwdG9yU2V0IiwiZ2V0QnVmZmVyIiwiVUJPU2hhZG93IiwiQklORElORyIsInNoYWRvd09iamVjdHMiLCJtIiwicCIsImkiLCJsZW5ndGgiLCJybyIsInN1Yk1vZGVscyIsIm1vZGVsIiwicGFzc2VzIiwiYWRkIiwiY2FtZXJhIiwiY21kQnVmZiIsImNvbW1hbmRCdWZmZXJzIiwidnAiLCJ2aWV3cG9ydCIsInNoYWRvd01hcFNpemUiLCJzaXplIiwieCIsInkiLCJ3aWR0aCIsInNoYWRpbmdTY2FsZSIsImhlaWdodCIsImRldmljZSIsInJlbmRlclBhc3MiLCJiZWdpblJlbmRlclBhc3MiLCJjbGVhckRlcHRoIiwiY2xlYXJTdGVuY2lsIiwiYmluZERlc2NyaXB0b3JTZXQiLCJTZXRJbmRleCIsIkdMT0JBTCIsInJlY29yZENvbW1hbmRCdWZmZXIiLCJlbmRSZW5kZXJQYXNzIiwiUmVuZGVyU3RhZ2UiLCJpbml0SW5mbyIsIm5hbWUiLCJwcmlvcml0eSIsIkZvcndhcmRTdGFnZVByaW9yaXR5IiwiRk9SV0FSRCIsInRhZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNBLE1BQU1BLE1BQWtCLEdBQUcsQ0FBRSxJQUFJQyxnQkFBSixDQUFhLENBQWIsRUFBZ0IsQ0FB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QUF6QyxFQUE4RCxLQUFLRSxXQUFuRSxFQUNJTixNQURKLEVBQ1k2QixNQUFNLENBQUNlLFVBRG5CLEVBQytCZixNQUFNLENBQUNnQixZQUR0QztBQUdBZixRQUFBQSxPQUFPLENBQUNnQixpQkFBUixDQUEwQkMsa0JBQVNDLE1BQW5DLEVBQTJDdEMsUUFBUSxDQUFDSyxhQUFwRDs7QUFFQSxhQUFLVixvQkFBTCxDQUEwQjRDLG1CQUExQixDQUE4Q1IsTUFBOUMsRUFBc0RDLFVBQXRELEVBQW1FWixPQUFuRTs7QUFFQUEsUUFBQUEsT0FBTyxDQUFDb0IsYUFBUjtBQUNIOzs7O0lBNUU0QkMsd0IsV0FDZkMsUSxHQUE2QjtBQUN2Q0MsSUFBQUEsSUFBSSxFQUFFLGFBRGlDO0FBRXZDQyxJQUFBQSxRQUFRLEVBQUVDLDJCQUFxQkMsT0FGUTtBQUd2Q0MsSUFBQUEsR0FBRyxFQUFFO0FBSGtDLEciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBpcGVsaW5lLmZvcndhcmRcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgR0ZYQ29sb3IsIEdGWFJlY3QgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgSVJlbmRlclN0YWdlSW5mbywgUmVuZGVyU3RhZ2UgfSBmcm9tICcuLi9yZW5kZXItc3RhZ2UnO1xyXG5pbXBvcnQgeyBSZW5kZXJWaWV3IH0gZnJvbSAnLi4vcmVuZGVyLXZpZXcnO1xyXG5pbXBvcnQgeyBGb3J3YXJkU3RhZ2VQcmlvcml0eSB9IGZyb20gJy4uL2ZvcndhcmQvZW51bSc7XHJcbmltcG9ydCB7IFJlbmRlclNoYWRvd01hcEJhdGNoZWRRdWV1ZSB9IGZyb20gJy4uL3JlbmRlci1zaGFkb3dNYXAtYmF0Y2hlZC1xdWV1ZSc7XHJcbmltcG9ydCB7IEdGWEZyYW1lYnVmZmVyIH0gZnJvbSAnLi4vLi4vZ2Z4L2ZyYW1lYnVmZmVyJztcclxuaW1wb3J0IHsgRm9yd2FyZFBpcGVsaW5lIH0gZnJvbSAnLi4vZm9yd2FyZC9mb3J3YXJkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgU2V0SW5kZXgsIFVCT1NoYWRvdyB9IGZyb20gJy4uL2RlZmluZSc7XHJcblxyXG5jb25zdCBjb2xvcnM6IEdGWENvbG9yW10gPSBbIG5ldyBHRlhDb2xvcigxLCAxLCAxLCAxKSBdO1xyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDpmLTlvbHmuLLmn5PpmLbmrrXjgIJcclxuICovXHJcbkBjY2NsYXNzKCdTaGFkb3dTdGFnZScpXHJcbmV4cG9ydCBjbGFzcyBTaGFkb3dTdGFnZSBleHRlbmRzIFJlbmRlclN0YWdlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdEluZm86IElSZW5kZXJTdGFnZUluZm8gPSB7XHJcbiAgICAgICAgbmFtZTogJ1NoYWRvd1N0YWdlJyxcclxuICAgICAgICBwcmlvcml0eTogRm9yd2FyZFN0YWdlUHJpb3JpdHkuRk9SV0FSRCxcclxuICAgICAgICB0YWc6IDBcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHNldFNoYWRvd0ZyYW1lQnVmZmVyIChzaGFkb3dGcmFtZUJ1ZmZlcjogR0ZYRnJhbWVidWZmZXIpIHtcclxuICAgICAgICB0aGlzLl9zaGFkb3dGcmFtZUJ1ZmZlciA9IHNoYWRvd0ZyYW1lQnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FkZGl0aXZlU2hhZG93UXVldWU6IFJlbmRlclNoYWRvd01hcEJhdGNoZWRRdWV1ZTtcclxuICAgIHByaXZhdGUgX3NoYWRvd0ZyYW1lQnVmZmVyOiBHRlhGcmFtZWJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcmVuZGVyQXJlYSA9IG5ldyBHRlhSZWN0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmnoTpgKDlh73mlbDjgIJcclxuICAgICAqIEBwYXJhbSBmbG93IOa4suafk+mYtuauteOAglxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9hZGRpdGl2ZVNoYWRvd1F1ZXVlID0gbmV3IFJlbmRlclNoYWRvd01hcEJhdGNoZWRRdWV1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDplIDmr4Hlh73mlbDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmuLLmn5Plh73mlbDjgIJcclxuICAgICAqIEBwYXJhbSB2aWV3IOa4suafk+inhuWbvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVuZGVyICh2aWV3OiBSZW5kZXJWaWV3KSB7XHJcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSB0aGlzLl9waXBlbGluZSBhcyBGb3J3YXJkUGlwZWxpbmU7XHJcbiAgICAgICAgY29uc3Qgc2hhZG93SW5mbyA9IHBpcGVsaW5lLnNoYWRvd3M7XHJcbiAgICAgICAgdGhpcy5fYWRkaXRpdmVTaGFkb3dRdWV1ZS5jbGVhcihwaXBlbGluZS5kZXNjcmlwdG9yU2V0LmdldEJ1ZmZlcihVQk9TaGFkb3cuQklORElORykpO1xyXG5cclxuICAgICAgICBjb25zdCBzaGFkb3dPYmplY3RzID0gcGlwZWxpbmUuc2hhZG93T2JqZWN0cztcclxuICAgICAgICBsZXQgbSA9IDA7IGxldCBwID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYWRvd09iamVjdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3Qgcm8gPSBzaGFkb3dPYmplY3RzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBzdWJNb2RlbHMgPSByby5tb2RlbC5zdWJNb2RlbHM7XHJcbiAgICAgICAgICAgIGZvciAobSA9IDA7IG0gPCBzdWJNb2RlbHMubGVuZ3RoOyBtKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3NlcyA9IHN1Yk1vZGVsc1ttXS5wYXNzZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcGFzc2VzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkaXRpdmVTaGFkb3dRdWV1ZS5hZGQocm8sIG0sIHApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB2aWV3LmNhbWVyYTtcclxuXHJcbiAgICAgICAgY29uc3QgY21kQnVmZiA9IHBpcGVsaW5lLmNvbW1hbmRCdWZmZXJzWzBdO1xyXG5cclxuICAgICAgICBjb25zdCB2cCA9IGNhbWVyYS52aWV3cG9ydDtcclxuICAgICAgICBjb25zdCBzaGFkb3dNYXBTaXplID0gc2hhZG93SW5mby5zaXplO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLnggPSB2cC54ICogc2hhZG93TWFwU2l6ZS54O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLnkgPSB2cC55ICogc2hhZG93TWFwU2l6ZS55O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLndpZHRoID0gIHZwLndpZHRoICogc2hhZG93TWFwU2l6ZS54ICogcGlwZWxpbmUuc2hhZGluZ1NjYWxlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLmhlaWdodCA9IHZwLmhlaWdodCAqIHNoYWRvd01hcFNpemUueSAqIHBpcGVsaW5lLnNoYWRpbmdTY2FsZTtcclxuXHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gcGlwZWxpbmUuZGV2aWNlO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3MgPSB0aGlzLl9zaGFkb3dGcmFtZUJ1ZmZlciEucmVuZGVyUGFzcztcclxuXHJcbiAgICAgICAgY21kQnVmZi5iZWdpblJlbmRlclBhc3MocmVuZGVyUGFzcywgdGhpcy5fc2hhZG93RnJhbWVCdWZmZXIhLCB0aGlzLl9yZW5kZXJBcmVhISxcclxuICAgICAgICAgICAgY29sb3JzLCBjYW1lcmEuY2xlYXJEZXB0aCwgY2FtZXJhLmNsZWFyU3RlbmNpbCk7XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguR0xPQkFMLCBwaXBlbGluZS5kZXNjcmlwdG9yU2V0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fYWRkaXRpdmVTaGFkb3dRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzcyEsIGNtZEJ1ZmYpO1xyXG5cclxuICAgICAgICBjbWRCdWZmLmVuZFJlbmRlclBhc3MoKTtcclxuICAgIH1cclxufVxyXG4iXX0=