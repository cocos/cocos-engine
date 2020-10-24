(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../define.js", "../pipeline-state.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../define.js"), require("../pipeline-state.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.pipelineState);
    global.webgl2StateCache = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _pipelineState) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2StateCache = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var WebGL2StateCache = /*#__PURE__*/function () {
    function WebGL2StateCache() {
      _classCallCheck(this, WebGL2StateCache);

      this.glArrayBuffer = null;
      this.glElementArrayBuffer = null;
      this.glUniformBuffer = null;
      this.glBindUBOs = [];
      this.glBindUBOOffsets = [];
      this.glVAO = null;
      this.texUnit = 0;
      this.glTexUnits = [];
      this.glSamplerUnits = [];
      this.glRenderbuffer = null;
      this.glFramebuffer = null;
      this.glReadFramebuffer = null;
      this.viewport = new _define.GFXViewport();
      this.scissorRect = new _define.GFXRect(0, 0, 0, 0);
      this.rs = new _pipelineState.GFXRasterizerState();
      this.dss = new _pipelineState.GFXDepthStencilState();
      this.bs = new _pipelineState.GFXBlendState();
      this.glProgram = null;
      this.glEnabledAttribLocs = [];
      this.glCurrentAttribLocs = [];
      this.texUnitCacheMap = {};
    }

    _createClass(WebGL2StateCache, [{
      key: "initialize",
      value: function initialize(texUnit, bufferBindings, vertexAttributes) {
        for (var i = 0; i < texUnit; ++i) {
          this.glTexUnits.push({
            glTexture: null
          });
        }

        this.glSamplerUnits.length = texUnit;
        this.glSamplerUnits.fill(null);
        this.glBindUBOs.length = bufferBindings;
        this.glBindUBOs.fill(null);
        this.glBindUBOOffsets.length = bufferBindings;
        this.glBindUBOOffsets.fill(0);
        this.glEnabledAttribLocs.length = vertexAttributes;
        this.glEnabledAttribLocs.fill(false);
        this.glCurrentAttribLocs.length = vertexAttributes;
        this.glCurrentAttribLocs.fill(false);
      }
    }]);

    return WebGL2StateCache;
  }();

  _exports.WebGL2StateCache = WebGL2StateCache;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItc3RhdGUtY2FjaGUudHMiXSwibmFtZXMiOlsiV2ViR0wyU3RhdGVDYWNoZSIsImdsQXJyYXlCdWZmZXIiLCJnbEVsZW1lbnRBcnJheUJ1ZmZlciIsImdsVW5pZm9ybUJ1ZmZlciIsImdsQmluZFVCT3MiLCJnbEJpbmRVQk9PZmZzZXRzIiwiZ2xWQU8iLCJ0ZXhVbml0IiwiZ2xUZXhVbml0cyIsImdsU2FtcGxlclVuaXRzIiwiZ2xSZW5kZXJidWZmZXIiLCJnbEZyYW1lYnVmZmVyIiwiZ2xSZWFkRnJhbWVidWZmZXIiLCJ2aWV3cG9ydCIsIkdGWFZpZXdwb3J0Iiwic2Npc3NvclJlY3QiLCJHRlhSZWN0IiwicnMiLCJHRlhSYXN0ZXJpemVyU3RhdGUiLCJkc3MiLCJHRlhEZXB0aFN0ZW5jaWxTdGF0ZSIsImJzIiwiR0ZYQmxlbmRTdGF0ZSIsImdsUHJvZ3JhbSIsImdsRW5hYmxlZEF0dHJpYkxvY3MiLCJnbEN1cnJlbnRBdHRyaWJMb2NzIiwidGV4VW5pdENhY2hlTWFwIiwiYnVmZmVyQmluZGluZ3MiLCJ2ZXJ0ZXhBdHRyaWJ1dGVzIiwiaSIsInB1c2giLCJnbFRleHR1cmUiLCJsZW5ndGgiLCJmaWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU9hQSxnQjs7OztXQUNGQyxhLEdBQW9DLEk7V0FDcENDLG9CLEdBQTJDLEk7V0FDM0NDLGUsR0FBc0MsSTtXQUN0Q0MsVSxHQUFxQyxFO1dBQ3JDQyxnQixHQUE2QixFO1dBQzdCQyxLLEdBQXVDLEk7V0FDdkNDLE8sR0FBa0IsQztXQUNsQkMsVSxHQUErQixFO1dBQy9CQyxjLEdBQTBDLEU7V0FDMUNDLGMsR0FBMkMsSTtXQUMzQ0MsYSxHQUF5QyxJO1dBQ3pDQyxpQixHQUE2QyxJO1dBQzdDQyxRLEdBQVcsSUFBSUMsbUJBQUosRTtXQUNYQyxXLEdBQWMsSUFBSUMsZUFBSixDQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLEM7V0FDZEMsRSxHQUFLLElBQUlDLGlDQUFKLEU7V0FDTEMsRyxHQUFNLElBQUlDLG1DQUFKLEU7V0FDTkMsRSxHQUFLLElBQUlDLDRCQUFKLEU7V0FDTEMsUyxHQUFpQyxJO1dBQ2pDQyxtQixHQUFpQyxFO1dBQ2pDQyxtQixHQUFpQyxFO1dBQ2pDQyxlLEdBQTBDLEU7Ozs7O2lDQUVyQ25CLE8sRUFBaUJvQixjLEVBQXdCQyxnQixFQUEwQjtBQUMzRSxhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd0QixPQUFwQixFQUE2QixFQUFFc0IsQ0FBL0I7QUFBa0MsZUFBS3JCLFVBQUwsQ0FBZ0JzQixJQUFoQixDQUFxQjtBQUFFQyxZQUFBQSxTQUFTLEVBQUU7QUFBYixXQUFyQjtBQUFsQzs7QUFFQSxhQUFLdEIsY0FBTCxDQUFvQnVCLE1BQXBCLEdBQTZCekIsT0FBN0I7QUFDQSxhQUFLRSxjQUFMLENBQW9Cd0IsSUFBcEIsQ0FBeUIsSUFBekI7QUFFQSxhQUFLN0IsVUFBTCxDQUFnQjRCLE1BQWhCLEdBQXlCTCxjQUF6QjtBQUNBLGFBQUt2QixVQUFMLENBQWdCNkIsSUFBaEIsQ0FBcUIsSUFBckI7QUFFQSxhQUFLNUIsZ0JBQUwsQ0FBc0IyQixNQUF0QixHQUErQkwsY0FBL0I7QUFDQSxhQUFLdEIsZ0JBQUwsQ0FBc0I0QixJQUF0QixDQUEyQixDQUEzQjtBQUVBLGFBQUtULG1CQUFMLENBQXlCUSxNQUF6QixHQUFrQ0osZ0JBQWxDO0FBQ0EsYUFBS0osbUJBQUwsQ0FBeUJTLElBQXpCLENBQThCLEtBQTlCO0FBRUEsYUFBS1IsbUJBQUwsQ0FBeUJPLE1BQXpCLEdBQWtDSixnQkFBbEM7QUFDQSxhQUFLSCxtQkFBTCxDQUF5QlEsSUFBekIsQ0FBOEIsS0FBOUI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWFJlY3QsIEdGWFZpZXdwb3J0IH0gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYQmxlbmRTdGF0ZSwgR0ZYRGVwdGhTdGVuY2lsU3RhdGUsIEdGWFJhc3Rlcml6ZXJTdGF0ZSB9IGZyb20gJy4uL3BpcGVsaW5lLXN0YXRlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVdlYkdMMlRleFVuaXQge1xyXG4gICAgZ2xUZXh0dXJlOiBXZWJHTFRleHR1cmUgfCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyU3RhdGVDYWNoZSB7XHJcbiAgICBwdWJsaWMgZ2xBcnJheUJ1ZmZlcjogV2ViR0xCdWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBnbEVsZW1lbnRBcnJheUJ1ZmZlcjogV2ViR0xCdWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBnbFVuaWZvcm1CdWZmZXI6IFdlYkdMQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZ2xCaW5kVUJPczogKFdlYkdMQnVmZmVyIHwgbnVsbClbXSA9IFtdO1xyXG4gICAgcHVibGljIGdsQmluZFVCT09mZnNldHM6IG51bWJlcltdID0gW107XHJcbiAgICBwdWJsaWMgZ2xWQU86IFdlYkdMVmVydGV4QXJyYXlPYmplY3QgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB0ZXhVbml0OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIGdsVGV4VW5pdHM6IElXZWJHTDJUZXhVbml0W10gPSBbXTtcclxuICAgIHB1YmxpYyBnbFNhbXBsZXJVbml0czogKFdlYkdMU2FtcGxlciB8IG51bGwpW10gPSBbXTtcclxuICAgIHB1YmxpYyBnbFJlbmRlcmJ1ZmZlcjogV2ViR0xSZW5kZXJidWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBnbEZyYW1lYnVmZmVyOiBXZWJHTEZyYW1lYnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZ2xSZWFkRnJhbWVidWZmZXI6IFdlYkdMRnJhbWVidWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB2aWV3cG9ydCA9IG5ldyBHRlhWaWV3cG9ydCgpO1xyXG4gICAgcHVibGljIHNjaXNzb3JSZWN0ID0gbmV3IEdGWFJlY3QoMCwgMCwgMCwgMCk7XHJcbiAgICBwdWJsaWMgcnMgPSBuZXcgR0ZYUmFzdGVyaXplclN0YXRlKCk7XHJcbiAgICBwdWJsaWMgZHNzID0gbmV3IEdGWERlcHRoU3RlbmNpbFN0YXRlKCk7XHJcbiAgICBwdWJsaWMgYnMgPSBuZXcgR0ZYQmxlbmRTdGF0ZSgpO1xyXG4gICAgcHVibGljIGdsUHJvZ3JhbTogV2ViR0xQcm9ncmFtIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZ2xFbmFibGVkQXR0cmliTG9jczogYm9vbGVhbltdID0gW107XHJcbiAgICBwdWJsaWMgZ2xDdXJyZW50QXR0cmliTG9jczogYm9vbGVhbltdID0gW107XHJcbiAgICBwdWJsaWMgdGV4VW5pdENhY2hlTWFwOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XHJcblxyXG4gICAgaW5pdGlhbGl6ZSAodGV4VW5pdDogbnVtYmVyLCBidWZmZXJCaW5kaW5nczogbnVtYmVyLCB2ZXJ0ZXhBdHRyaWJ1dGVzOiBudW1iZXIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleFVuaXQ7ICsraSkgdGhpcy5nbFRleFVuaXRzLnB1c2goeyBnbFRleHR1cmU6IG51bGwgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2xTYW1wbGVyVW5pdHMubGVuZ3RoID0gdGV4VW5pdDtcclxuICAgICAgICB0aGlzLmdsU2FtcGxlclVuaXRzLmZpbGwobnVsbCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2xCaW5kVUJPcy5sZW5ndGggPSBidWZmZXJCaW5kaW5ncztcclxuICAgICAgICB0aGlzLmdsQmluZFVCT3MuZmlsbChudWxsKTtcclxuXHJcbiAgICAgICAgdGhpcy5nbEJpbmRVQk9PZmZzZXRzLmxlbmd0aCA9IGJ1ZmZlckJpbmRpbmdzO1xyXG4gICAgICAgIHRoaXMuZ2xCaW5kVUJPT2Zmc2V0cy5maWxsKDApO1xyXG5cclxuICAgICAgICB0aGlzLmdsRW5hYmxlZEF0dHJpYkxvY3MubGVuZ3RoID0gdmVydGV4QXR0cmlidXRlcztcclxuICAgICAgICB0aGlzLmdsRW5hYmxlZEF0dHJpYkxvY3MuZmlsbChmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2xDdXJyZW50QXR0cmliTG9jcy5sZW5ndGggPSB2ZXJ0ZXhBdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuZ2xDdXJyZW50QXR0cmliTG9jcy5maWxsKGZhbHNlKTtcclxuICAgIH1cclxufVxyXG4iXX0=