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
    global.webglStateCache = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _pipelineState) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLStateCache = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var WebGLStateCache = /*#__PURE__*/function () {
    function WebGLStateCache() {
      _classCallCheck(this, WebGLStateCache);

      this.glArrayBuffer = null;
      this.glElementArrayBuffer = null;
      this.glVAO = null;
      this.texUnit = 0;
      this.glTexUnits = [];
      this.glRenderbuffer = null;
      this.glFramebuffer = null;
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

    _createClass(WebGLStateCache, [{
      key: "initialize",
      value: function initialize(texUnit, vertexAttributes) {
        for (var i = 0; i < texUnit; ++i) {
          this.glTexUnits.push({
            glTexture: null
          });
        }

        this.glEnabledAttribLocs.length = vertexAttributes;
        this.glEnabledAttribLocs.fill(false);
        this.glCurrentAttribLocs.length = vertexAttributes;
        this.glCurrentAttribLocs.fill(false);
      }
    }]);

    return WebGLStateCache;
  }();

  _exports.WebGLStateCache = WebGLStateCache;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLXN0YXRlLWNhY2hlLnRzIl0sIm5hbWVzIjpbIldlYkdMU3RhdGVDYWNoZSIsImdsQXJyYXlCdWZmZXIiLCJnbEVsZW1lbnRBcnJheUJ1ZmZlciIsImdsVkFPIiwidGV4VW5pdCIsImdsVGV4VW5pdHMiLCJnbFJlbmRlcmJ1ZmZlciIsImdsRnJhbWVidWZmZXIiLCJ2aWV3cG9ydCIsIkdGWFZpZXdwb3J0Iiwic2Npc3NvclJlY3QiLCJHRlhSZWN0IiwicnMiLCJHRlhSYXN0ZXJpemVyU3RhdGUiLCJkc3MiLCJHRlhEZXB0aFN0ZW5jaWxTdGF0ZSIsImJzIiwiR0ZYQmxlbmRTdGF0ZSIsImdsUHJvZ3JhbSIsImdsRW5hYmxlZEF0dHJpYkxvY3MiLCJnbEN1cnJlbnRBdHRyaWJMb2NzIiwidGV4VW5pdENhY2hlTWFwIiwidmVydGV4QXR0cmlidXRlcyIsImkiLCJwdXNoIiwiZ2xUZXh0dXJlIiwibGVuZ3RoIiwiZmlsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFPYUEsZTs7OztXQUNGQyxhLEdBQW9DLEk7V0FDcENDLG9CLEdBQTJDLEk7V0FDM0NDLEssR0FBMEMsSTtXQUMxQ0MsTyxHQUFrQixDO1dBQ2xCQyxVLEdBQThCLEU7V0FDOUJDLGMsR0FBMkMsSTtXQUMzQ0MsYSxHQUF5QyxJO1dBQ3pDQyxRLEdBQVcsSUFBSUMsbUJBQUosRTtXQUNYQyxXLEdBQWMsSUFBSUMsZUFBSixDQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLEM7V0FDZEMsRSxHQUFLLElBQUlDLGlDQUFKLEU7V0FDTEMsRyxHQUFNLElBQUlDLG1DQUFKLEU7V0FDTkMsRSxHQUFLLElBQUlDLDRCQUFKLEU7V0FDTEMsUyxHQUFpQyxJO1dBQ2pDQyxtQixHQUFpQyxFO1dBQ2pDQyxtQixHQUFpQyxFO1dBQ2pDQyxlLEdBQTBDLEU7Ozs7O2lDQUVyQ2pCLE8sRUFBaUJrQixnQixFQUEwQjtBQUNuRCxhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUduQixPQUFwQixFQUE2QixFQUFFbUIsQ0FBL0I7QUFBa0MsZUFBS2xCLFVBQUwsQ0FBZ0JtQixJQUFoQixDQUFxQjtBQUFFQyxZQUFBQSxTQUFTLEVBQUU7QUFBYixXQUFyQjtBQUFsQzs7QUFFQSxhQUFLTixtQkFBTCxDQUF5Qk8sTUFBekIsR0FBa0NKLGdCQUFsQztBQUNBLGFBQUtILG1CQUFMLENBQXlCUSxJQUF6QixDQUE4QixLQUE5QjtBQUVBLGFBQUtQLG1CQUFMLENBQXlCTSxNQUF6QixHQUFrQ0osZ0JBQWxDO0FBQ0EsYUFBS0YsbUJBQUwsQ0FBeUJPLElBQXpCLENBQThCLEtBQTlCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhSZWN0LCBHRlhWaWV3cG9ydCB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWEJsZW5kU3RhdGUsIEdGWERlcHRoU3RlbmNpbFN0YXRlLCBHRlhSYXN0ZXJpemVyU3RhdGUgfSBmcm9tICcuLi9waXBlbGluZS1zdGF0ZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElXZWJHTFRleFVuaXQge1xyXG4gICAgZ2xUZXh0dXJlOiBXZWJHTFRleHR1cmUgfCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xTdGF0ZUNhY2hlIHtcclxuICAgIHB1YmxpYyBnbEFycmF5QnVmZmVyOiBXZWJHTEJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGdsRWxlbWVudEFycmF5QnVmZmVyOiBXZWJHTEJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGdsVkFPOiBXZWJHTFZlcnRleEFycmF5T2JqZWN0T0VTIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdGV4VW5pdDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBnbFRleFVuaXRzOiBJV2ViR0xUZXhVbml0W10gPSBbXTtcclxuICAgIHB1YmxpYyBnbFJlbmRlcmJ1ZmZlcjogV2ViR0xSZW5kZXJidWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBnbEZyYW1lYnVmZmVyOiBXZWJHTEZyYW1lYnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdmlld3BvcnQgPSBuZXcgR0ZYVmlld3BvcnQoKTtcclxuICAgIHB1YmxpYyBzY2lzc29yUmVjdCA9IG5ldyBHRlhSZWN0KDAsIDAsIDAsIDApO1xyXG4gICAgcHVibGljIHJzID0gbmV3IEdGWFJhc3Rlcml6ZXJTdGF0ZSgpO1xyXG4gICAgcHVibGljIGRzcyA9IG5ldyBHRlhEZXB0aFN0ZW5jaWxTdGF0ZSgpO1xyXG4gICAgcHVibGljIGJzID0gbmV3IEdGWEJsZW5kU3RhdGUoKTtcclxuICAgIHB1YmxpYyBnbFByb2dyYW06IFdlYkdMUHJvZ3JhbSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGdsRW5hYmxlZEF0dHJpYkxvY3M6IGJvb2xlYW5bXSA9IFtdO1xyXG4gICAgcHVibGljIGdsQ3VycmVudEF0dHJpYkxvY3M6IGJvb2xlYW5bXSA9IFtdO1xyXG4gICAgcHVibGljIHRleFVuaXRDYWNoZU1hcDogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xyXG5cclxuICAgIGluaXRpYWxpemUgKHRleFVuaXQ6IG51bWJlciwgdmVydGV4QXR0cmlidXRlczogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXhVbml0OyArK2kpIHRoaXMuZ2xUZXhVbml0cy5wdXNoKHsgZ2xUZXh0dXJlOiBudWxsIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdsRW5hYmxlZEF0dHJpYkxvY3MubGVuZ3RoID0gdmVydGV4QXR0cmlidXRlcztcclxuICAgICAgICB0aGlzLmdsRW5hYmxlZEF0dHJpYkxvY3MuZmlsbChmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2xDdXJyZW50QXR0cmliTG9jcy5sZW5ndGggPSB2ZXJ0ZXhBdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuZ2xDdXJyZW50QXR0cmliTG9jcy5maWxsKGZhbHNlKTtcclxuICAgIH1cclxufVxyXG4iXX0=