(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../input-assembler.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../input-assembler.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.inputAssembler, global.webgl2Commands);
    global.webgl2InputAssembler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _inputAssembler, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2InputAssembler = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2InputAssembler = /*#__PURE__*/function (_GFXInputAssembler) {
    _inherits(WebGL2InputAssembler, _GFXInputAssembler);

    function WebGL2InputAssembler() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2InputAssembler);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2InputAssembler)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuInputAssembler = null;
      return _this;
    }

    _createClass(WebGL2InputAssembler, [{
      key: "initialize",
      value: function initialize(info) {
        if (info.vertexBuffers.length === 0) {
          console.error('GFXInputAssemblerInfo.vertexBuffers is null.');
          return false;
        }

        this._attributes = info.attributes;
        this._attributesHash = this.computeAttributesHash();
        this._vertexBuffers = info.vertexBuffers;

        if (info.indexBuffer) {
          this._indexBuffer = info.indexBuffer;
          this._indexCount = this._indexBuffer.size / this._indexBuffer.stride;
          this._firstIndex = 0;
        } else {
          var vertBuff = this._vertexBuffers[0];
          this._vertexCount = vertBuff.size / vertBuff.stride;
          this._firstVertex = 0;
          this._vertexOffset = 0;
        }

        this._instanceCount = 0;
        this._firstInstance = 0;
        this._indirectBuffer = info.indirectBuffer || null;
        var gpuVertexBuffers = new Array(info.vertexBuffers.length);

        for (var i = 0; i < info.vertexBuffers.length; ++i) {
          var vb = info.vertexBuffers[i];

          if (vb.gpuBuffer) {
            gpuVertexBuffers[i] = vb.gpuBuffer;
          }
        }

        var gpuIndexBuffer = null;
        var glIndexType = 0;

        if (info.indexBuffer) {
          gpuIndexBuffer = info.indexBuffer.gpuBuffer;

          if (gpuIndexBuffer) {
            switch (gpuIndexBuffer.stride) {
              case 1:
                glIndexType = 0x1401;
                break;
              // WebGLRenderingContext.UNSIGNED_BYTE

              case 2:
                glIndexType = 0x1403;
                break;
              // WebGLRenderingContext.UNSIGNED_SHORT

              case 4:
                glIndexType = 0x1405;
                break;
              // WebGLRenderingContext.UNSIGNED_INT

              default:
                {
                  console.error('Illegal index buffer stride.');
                }
            }
          }
        }

        var gpuIndirectBuffer = null;

        if (info.indirectBuffer) {
          gpuIndirectBuffer = info.indirectBuffer.gpuBuffer;
        }

        this._gpuInputAssembler = {
          attributes: info.attributes,
          gpuVertexBuffers: gpuVertexBuffers,
          gpuIndexBuffer: gpuIndexBuffer,
          gpuIndirectBuffer: gpuIndirectBuffer,
          glAttribs: [],
          glIndexType: glIndexType,
          glVAOs: new Map()
        };
        (0, _webgl2Commands.WebGL2CmdFuncCreateInputAssember)(this._device, this._gpuInputAssembler);
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var webgl2Dev = this._device;

        if (this._gpuInputAssembler && webgl2Dev.useVAO) {
          (0, _webgl2Commands.WebGL2CmdFuncDestroyInputAssembler)(webgl2Dev, this._gpuInputAssembler);
        }

        this._gpuInputAssembler = null;
      }
    }, {
      key: "gpuInputAssembler",
      get: function get() {
        return this._gpuInputAssembler;
      }
    }]);

    return WebGL2InputAssembler;
  }(_inputAssembler.GFXInputAssembler);

  _exports.WebGL2InputAssembler = WebGL2InputAssembler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItaW5wdXQtYXNzZW1ibGVyLnRzIl0sIm5hbWVzIjpbIldlYkdMMklucHV0QXNzZW1ibGVyIiwiX2dwdUlucHV0QXNzZW1ibGVyIiwiaW5mbyIsInZlcnRleEJ1ZmZlcnMiLCJsZW5ndGgiLCJjb25zb2xlIiwiZXJyb3IiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJfYXR0cmlidXRlc0hhc2giLCJjb21wdXRlQXR0cmlidXRlc0hhc2giLCJfdmVydGV4QnVmZmVycyIsImluZGV4QnVmZmVyIiwiX2luZGV4QnVmZmVyIiwiX2luZGV4Q291bnQiLCJzaXplIiwic3RyaWRlIiwiX2ZpcnN0SW5kZXgiLCJ2ZXJ0QnVmZiIsIl92ZXJ0ZXhDb3VudCIsIl9maXJzdFZlcnRleCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5zdGFuY2VDb3VudCIsIl9maXJzdEluc3RhbmNlIiwiX2luZGlyZWN0QnVmZmVyIiwiaW5kaXJlY3RCdWZmZXIiLCJncHVWZXJ0ZXhCdWZmZXJzIiwiQXJyYXkiLCJpIiwidmIiLCJncHVCdWZmZXIiLCJncHVJbmRleEJ1ZmZlciIsImdsSW5kZXhUeXBlIiwiZ3B1SW5kaXJlY3RCdWZmZXIiLCJnbEF0dHJpYnMiLCJnbFZBT3MiLCJNYXAiLCJfZGV2aWNlIiwid2ViZ2wyRGV2IiwidXNlVkFPIiwiR0ZYSW5wdXRBc3NlbWJsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BTWFBLG9COzs7Ozs7Ozs7Ozs7Ozs7WUFNREMsa0IsR0FBc0QsSTs7Ozs7O2lDQUUzQ0MsSSxFQUFzQztBQUVyRCxZQUFJQSxJQUFJLENBQUNDLGFBQUwsQ0FBbUJDLE1BQW5CLEtBQThCLENBQWxDLEVBQXFDO0FBQ2pDQyxVQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyw4Q0FBZDtBQUNBLGlCQUFPLEtBQVA7QUFDSDs7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LE9BQXRDLEVBQStELEtBQUtwQyxrQkFBcEU7QUFFQSxlQUFPLElBQVA7QUFDSDs7O2dDQUVpQjtBQUNkLFlBQU1xQyxTQUFTLEdBQUcsS0FBS0QsT0FBdkI7O0FBQ0EsWUFBSSxLQUFLcEMsa0JBQUwsSUFBMkJxQyxTQUFTLENBQUNDLE1BQXpDLEVBQWlEO0FBQzdDLGtFQUFtQ0QsU0FBbkMsRUFBOEMsS0FBS3JDLGtCQUFuRDtBQUNIOztBQUNELGFBQUtBLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0g7OzswQkFuRnlEO0FBQ3RELGVBQVEsS0FBS0Esa0JBQWI7QUFDSDs7OztJQUpxQ3VDLGlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYSW5wdXRBc3NlbWJsZXIsIEdGWElucHV0QXNzZW1ibGVySW5mbyB9IGZyb20gJy4uL2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IFdlYkdMMkJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wyLWJ1ZmZlcic7XHJcbmltcG9ydCB7IFdlYkdMMkNtZEZ1bmNDcmVhdGVJbnB1dEFzc2VtYmVyLCBXZWJHTDJDbWRGdW5jRGVzdHJveUlucHV0QXNzZW1ibGVyIH0gZnJvbSAnLi93ZWJnbDItY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBXZWJHTDJEZXZpY2UgfSBmcm9tICcuL3dlYmdsMi1kZXZpY2UnO1xyXG5pbXBvcnQgeyBJV2ViR0wyR1BVSW5wdXRBc3NlbWJsZXIsIElXZWJHTDJHUFVCdWZmZXIgfSBmcm9tICcuL3dlYmdsMi1ncHUtb2JqZWN0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wySW5wdXRBc3NlbWJsZXIgZXh0ZW5kcyBHRlhJbnB1dEFzc2VtYmxlciB7XHJcblxyXG4gICAgcHVibGljIGdldCBncHVJbnB1dEFzc2VtYmxlciAoKTogSVdlYkdMMkdQVUlucHV0QXNzZW1ibGVyIHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2dwdUlucHV0QXNzZW1ibGVyITtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ncHVJbnB1dEFzc2VtYmxlcjogSVdlYkdMMkdQVUlucHV0QXNzZW1ibGVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IEdGWElucHV0QXNzZW1ibGVySW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBpZiAoaW5mby52ZXJ0ZXhCdWZmZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdHRlhJbnB1dEFzc2VtYmxlckluZm8udmVydGV4QnVmZmVycyBpcyBudWxsLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gaW5mby5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuX2F0dHJpYnV0ZXNIYXNoID0gdGhpcy5jb21wdXRlQXR0cmlidXRlc0hhc2goKTtcclxuICAgICAgICB0aGlzLl92ZXJ0ZXhCdWZmZXJzID0gaW5mby52ZXJ0ZXhCdWZmZXJzO1xyXG5cclxuICAgICAgICBpZiAoaW5mby5pbmRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbmRleEJ1ZmZlciA9IGluZm8uaW5kZXhCdWZmZXI7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4Q291bnQgPSB0aGlzLl9pbmRleEJ1ZmZlci5zaXplIC8gdGhpcy5faW5kZXhCdWZmZXIuc3RyaWRlO1xyXG4gICAgICAgICAgICB0aGlzLl9maXJzdEluZGV4ID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0QnVmZiA9IHRoaXMuX3ZlcnRleEJ1ZmZlcnNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRleENvdW50ID0gdmVydEJ1ZmYuc2l6ZSAvIHZlcnRCdWZmLnN0cmlkZTtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3RWZXJ0ZXggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0ZXhPZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbnN0YW5jZUNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLl9maXJzdEluc3RhbmNlID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5faW5kaXJlY3RCdWZmZXIgPSBpbmZvLmluZGlyZWN0QnVmZmVyIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGNvbnN0IGdwdVZlcnRleEJ1ZmZlcnM6IElXZWJHTDJHUFVCdWZmZXJbXSA9IG5ldyBBcnJheTxJV2ViR0wyR1BVQnVmZmVyPihpbmZvLnZlcnRleEJ1ZmZlcnMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZm8udmVydGV4QnVmZmVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCB2YiA9IGluZm8udmVydGV4QnVmZmVyc1tpXSBhcyBXZWJHTDJCdWZmZXI7XHJcbiAgICAgICAgICAgIGlmICh2Yi5ncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIGdwdVZlcnRleEJ1ZmZlcnNbaV0gPSB2Yi5ncHVCdWZmZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBncHVJbmRleEJ1ZmZlcjogSVdlYkdMMkdQVUJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBnbEluZGV4VHlwZSA9IDA7XHJcbiAgICAgICAgaWYgKGluZm8uaW5kZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgZ3B1SW5kZXhCdWZmZXIgPSAoaW5mby5pbmRleEJ1ZmZlciBhcyBXZWJHTDJCdWZmZXIpLmdwdUJ1ZmZlcjtcclxuICAgICAgICAgICAgaWYgKGdwdUluZGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGdwdUluZGV4QnVmZmVyLnN0cmlkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTogZ2xJbmRleFR5cGUgPSAweDE0MDE7IGJyZWFrOyAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVU5TSUdORURfQllURVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjogZ2xJbmRleFR5cGUgPSAweDE0MDM7IGJyZWFrOyAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVU5TSUdORURfU0hPUlRcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6IGdsSW5kZXhUeXBlID0gMHgxNDA1OyBicmVhazsgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlVOU0lHTkVEX0lOVFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSWxsZWdhbCBpbmRleCBidWZmZXIgc3RyaWRlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGdwdUluZGlyZWN0QnVmZmVyOiBJV2ViR0wyR1BVQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgaWYgKGluZm8uaW5kaXJlY3RCdWZmZXIpIHtcclxuICAgICAgICAgICAgZ3B1SW5kaXJlY3RCdWZmZXIgPSAoaW5mby5pbmRpcmVjdEJ1ZmZlciBhcyBXZWJHTDJCdWZmZXIpLmdwdUJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2dwdUlucHV0QXNzZW1ibGVyID0ge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBpbmZvLmF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIGdwdVZlcnRleEJ1ZmZlcnMsXHJcbiAgICAgICAgICAgIGdwdUluZGV4QnVmZmVyLFxyXG4gICAgICAgICAgICBncHVJbmRpcmVjdEJ1ZmZlcixcclxuXHJcbiAgICAgICAgICAgIGdsQXR0cmliczogW10sXHJcbiAgICAgICAgICAgIGdsSW5kZXhUeXBlLFxyXG4gICAgICAgICAgICBnbFZBT3M6IG5ldyBNYXA8V2ViR0xQcm9ncmFtLCBXZWJHTFZlcnRleEFycmF5T2JqZWN0PigpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFdlYkdMMkNtZEZ1bmNDcmVhdGVJbnB1dEFzc2VtYmVyKHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2UsIHRoaXMuX2dwdUlucHV0QXNzZW1ibGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGNvbnN0IHdlYmdsMkRldiA9IHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2U7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dwdUlucHV0QXNzZW1ibGVyICYmIHdlYmdsMkRldi51c2VWQU8pIHtcclxuICAgICAgICAgICAgV2ViR0wyQ21kRnVuY0Rlc3Ryb3lJbnB1dEFzc2VtYmxlcih3ZWJnbDJEZXYsIHRoaXMuX2dwdUlucHV0QXNzZW1ibGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==