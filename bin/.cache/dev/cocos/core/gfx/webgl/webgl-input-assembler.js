(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../input-assembler.js", "./webgl-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../input-assembler.js"), require("./webgl-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.inputAssembler, global.webglCommands);
    global.webglInputAssembler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _inputAssembler, _webglCommands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLInputAssembler = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLInputAssembler = /*#__PURE__*/function (_GFXInputAssembler) {
    _inherits(WebGLInputAssembler, _GFXInputAssembler);

    function WebGLInputAssembler() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLInputAssembler);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLInputAssembler)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuInputAssembler = null;
      return _this;
    }

    _createClass(WebGLInputAssembler, [{
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
                  console.error('Error index buffer stride.');
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
        (0, _webglCommands.WebGLCmdFuncCreateInputAssember)(this._device, this._gpuInputAssembler);
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var webglDev = this._device;

        if (this._gpuInputAssembler && webglDev.useVAO) {
          (0, _webglCommands.WebGLCmdFuncDestroyInputAssembler)(webglDev, this._gpuInputAssembler);
        }

        this._gpuInputAssembler = null;
      }
    }, {
      key: "gpuInputAssembler",
      get: function get() {
        return this._gpuInputAssembler;
      }
    }]);

    return WebGLInputAssembler;
  }(_inputAssembler.GFXInputAssembler);

  _exports.WebGLInputAssembler = WebGLInputAssembler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWlucHV0LWFzc2VtYmxlci50cyJdLCJuYW1lcyI6WyJXZWJHTElucHV0QXNzZW1ibGVyIiwiX2dwdUlucHV0QXNzZW1ibGVyIiwiaW5mbyIsInZlcnRleEJ1ZmZlcnMiLCJsZW5ndGgiLCJjb25zb2xlIiwiZXJyb3IiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJfYXR0cmlidXRlc0hhc2giLCJjb21wdXRlQXR0cmlidXRlc0hhc2giLCJfdmVydGV4QnVmZmVycyIsImluZGV4QnVmZmVyIiwiX2luZGV4QnVmZmVyIiwiX2luZGV4Q291bnQiLCJzaXplIiwic3RyaWRlIiwiX2ZpcnN0SW5kZXgiLCJ2ZXJ0QnVmZiIsIl92ZXJ0ZXhDb3VudCIsIl9maXJzdFZlcnRleCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5zdGFuY2VDb3VudCIsIl9maXJzdEluc3RhbmNlIiwiX2luZGlyZWN0QnVmZmVyIiwiaW5kaXJlY3RCdWZmZXIiLCJncHVWZXJ0ZXhCdWZmZXJzIiwiQXJyYXkiLCJpIiwidmIiLCJncHVCdWZmZXIiLCJncHVJbmRleEJ1ZmZlciIsImdsSW5kZXhUeXBlIiwiZ3B1SW5kaXJlY3RCdWZmZXIiLCJnbEF0dHJpYnMiLCJnbFZBT3MiLCJNYXAiLCJfZGV2aWNlIiwid2ViZ2xEZXYiLCJ1c2VWQU8iLCJHRlhJbnB1dEFzc2VtYmxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFNYUEsbUI7Ozs7Ozs7Ozs7Ozs7OztZQU1EQyxrQixHQUFxRCxJOzs7Ozs7aUNBRTFDQyxJLEVBQXNDO0FBRXJELFlBQUlBLElBQUksQ0FBQ0MsYUFBTCxDQUFtQkMsTUFBbkIsS0FBOEIsQ0FBbEMsRUFBcUM7QUFDakNDLFVBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLDhDQUFkO0FBQ0EsaUJBQU8sS0FBUDtBQUNIOztBQUVELGFBQUtDLFdBQUwsR0FBbUJMLElBQUksQ0FBQ00sVUFBeEI7QUFDQSxhQUFLQyxlQUFMLEdBQXVCLEtBQUtDLHFCQUFMLEVBQXZCO0FBQ0EsYUFBS0MsY0FBTCxHQUFzQlQsSUFBSSxDQUFDQyxhQUEzQjs7QUFFQSxZQUFJRCxJQUFJLENBQUNVLFdBQVQsRUFBc0I7QUFDbEIsZUFBS0MsWUFBTCxHQUFvQlgsSUFBSSxDQUFDVSxXQUF6QjtBQUNBLGVBQUtFLFdBQUwsR0FBbUIsS0FBS0QsWUFBTCxDQUFrQkUsSUFBbEIsR0FBeUIsS0FBS0YsWUFBTCxDQUFrQkcsTUFBOUQ7QUFDQSxlQUFLQyxXQUFMLEdBQW1CLENBQW5CO0FBQ0gsU0FKRCxNQUlPO0FBQ0gsY0FBTUMsUUFBUSxHQUFHLEtBQUtQLGNBQUwsQ0FBb0IsQ0FBcEIsQ0FBakI7QUFDQSxlQUFLUSxZQUFMLEdBQW9CRCxRQUFRLENBQUNILElBQVQsR0FBZ0JHLFFBQVEsQ0FBQ0YsTUFBN0M7QUFDQSxlQUFLSSxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsZUFBS0MsYUFBTCxHQUFxQixDQUFyQjtBQUNIOztBQUNELGFBQUtDLGNBQUwsR0FBc0IsQ0FBdEI7QUFDQSxhQUFLQyxjQUFMLEdBQXNCLENBQXRCO0FBRUEsYUFBS0MsZUFBTCxHQUF1QnRCLElBQUksQ0FBQ3VCLGNBQUwsSUFBdUIsSUFBOUM7QUFFQSxZQUFNQyxnQkFBbUMsR0FBRyxJQUFJQyxLQUFKLENBQTJCekIsSUFBSSxDQUFDQyxhQUFMLENBQW1CQyxNQUE5QyxDQUE1Qzs7QUFDQSxhQUFLLElBQUl3QixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHMUIsSUFBSSxDQUFDQyxhQUFMLENBQW1CQyxNQUF2QyxFQUErQyxFQUFFd0IsQ0FBakQsRUFBb0Q7QUFDaEQsY0FBTUMsRUFBRSxHQUFHM0IsSUFBSSxDQUFDQyxhQUFMLENBQW1CeUIsQ0FBbkIsQ0FBWDs7QUFDQSxjQUFJQyxFQUFFLENBQUNDLFNBQVAsRUFBa0I7QUFDZEosWUFBQUEsZ0JBQWdCLENBQUNFLENBQUQsQ0FBaEIsR0FBc0JDLEVBQUUsQ0FBQ0MsU0FBekI7QUFDSDtBQUNKOztBQUVELFlBQUlDLGNBQXNDLEdBQUcsSUFBN0M7QUFDQSxZQUFJQyxXQUFXLEdBQUcsQ0FBbEI7O0FBQ0EsWUFBSTlCLElBQUksQ0FBQ1UsV0FBVCxFQUFzQjtBQUNsQm1CLFVBQUFBLGNBQWMsR0FBSTdCLElBQUksQ0FBQ1UsV0FBTixDQUFrQ2tCLFNBQW5EOztBQUNBLGNBQUlDLGNBQUosRUFBb0I7QUFDaEIsb0JBQVFBLGNBQWMsQ0FBQ2YsTUFBdkI7QUFDSSxtQkFBSyxDQUFMO0FBQVFnQixnQkFBQUEsV0FBVyxHQUFHLE1BQWQ7QUFBc0I7QUFBTzs7QUFDckMsbUJBQUssQ0FBTDtBQUFRQSxnQkFBQUEsV0FBVyxHQUFHLE1BQWQ7QUFBc0I7QUFBTzs7QUFDckMsbUJBQUssQ0FBTDtBQUFRQSxnQkFBQUEsV0FBVyxHQUFHLE1BQWQ7QUFBc0I7QUFBTzs7QUFDckM7QUFBUztBQUNMM0Isa0JBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLDRCQUFkO0FBQ0g7QUFOTDtBQVFIO0FBQ0o7O0FBRUQsWUFBSTJCLGlCQUF5QyxHQUFHLElBQWhEOztBQUNBLFlBQUkvQixJQUFJLENBQUN1QixjQUFULEVBQXlCO0FBQ3JCUSxVQUFBQSxpQkFBaUIsR0FBSS9CLElBQUksQ0FBQ3VCLGNBQU4sQ0FBcUNLLFNBQXpEO0FBQ0g7O0FBRUQsYUFBSzdCLGtCQUFMLEdBQTBCO0FBQ3RCTyxVQUFBQSxVQUFVLEVBQUVOLElBQUksQ0FBQ00sVUFESztBQUV0QmtCLFVBQUFBLGdCQUFnQixFQUFoQkEsZ0JBRnNCO0FBR3RCSyxVQUFBQSxjQUFjLEVBQWRBLGNBSHNCO0FBSXRCRSxVQUFBQSxpQkFBaUIsRUFBakJBLGlCQUpzQjtBQU10QkMsVUFBQUEsU0FBUyxFQUFFLEVBTlc7QUFPdEJGLFVBQUFBLFdBQVcsRUFBWEEsV0FQc0I7QUFRdEJHLFVBQUFBLE1BQU0sRUFBRSxJQUFJQyxHQUFKO0FBUmMsU0FBMUI7QUFXQSw0REFBZ0MsS0FBS0MsT0FBckMsRUFBNkQsS0FBS3BDLGtCQUFsRTtBQUVBLGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCO0FBQ2QsWUFBTXFDLFFBQVEsR0FBRyxLQUFLRCxPQUF0Qjs7QUFDQSxZQUFJLEtBQUtwQyxrQkFBTCxJQUEyQnFDLFFBQVEsQ0FBQ0MsTUFBeEMsRUFBZ0Q7QUFDNUMsZ0VBQWtDRCxRQUFsQyxFQUE0QyxLQUFLckMsa0JBQWpEO0FBQ0g7O0FBQ0QsYUFBS0Esa0JBQUwsR0FBMEIsSUFBMUI7QUFDSDs7OzBCQW5GaUQ7QUFDOUMsZUFBUSxLQUFLQSxrQkFBYjtBQUNIOzs7O0lBSm9DdUMsaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhJbnB1dEFzc2VtYmxlciwgR0ZYSW5wdXRBc3NlbWJsZXJJbmZvIH0gZnJvbSAnLi4vaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgV2ViR0xCdWZmZXIgfSBmcm9tICcuL3dlYmdsLWJ1ZmZlcic7XHJcbmltcG9ydCB7IFdlYkdMQ21kRnVuY0NyZWF0ZUlucHV0QXNzZW1iZXIsIFdlYkdMQ21kRnVuY0Rlc3Ryb3lJbnB1dEFzc2VtYmxlciB9IGZyb20gJy4vd2ViZ2wtY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBXZWJHTERldmljZSB9IGZyb20gJy4vd2ViZ2wtZGV2aWNlJztcclxuaW1wb3J0IHsgSVdlYkdMR1BVSW5wdXRBc3NlbWJsZXIsIElXZWJHTEdQVUJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wtZ3B1LW9iamVjdHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMSW5wdXRBc3NlbWJsZXIgZXh0ZW5kcyBHRlhJbnB1dEFzc2VtYmxlciB7XHJcblxyXG4gICAgZ2V0IGdwdUlucHV0QXNzZW1ibGVyICgpOiBJV2ViR0xHUFVJbnB1dEFzc2VtYmxlciB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLl9ncHVJbnB1dEFzc2VtYmxlciE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1SW5wdXRBc3NlbWJsZXI6IElXZWJHTEdQVUlucHV0QXNzZW1ibGVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IEdGWElucHV0QXNzZW1ibGVySW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBpZiAoaW5mby52ZXJ0ZXhCdWZmZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdHRlhJbnB1dEFzc2VtYmxlckluZm8udmVydGV4QnVmZmVycyBpcyBudWxsLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gaW5mby5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuX2F0dHJpYnV0ZXNIYXNoID0gdGhpcy5jb21wdXRlQXR0cmlidXRlc0hhc2goKTtcclxuICAgICAgICB0aGlzLl92ZXJ0ZXhCdWZmZXJzID0gaW5mby52ZXJ0ZXhCdWZmZXJzO1xyXG5cclxuICAgICAgICBpZiAoaW5mby5pbmRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbmRleEJ1ZmZlciA9IGluZm8uaW5kZXhCdWZmZXI7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4Q291bnQgPSB0aGlzLl9pbmRleEJ1ZmZlci5zaXplIC8gdGhpcy5faW5kZXhCdWZmZXIuc3RyaWRlO1xyXG4gICAgICAgICAgICB0aGlzLl9maXJzdEluZGV4ID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0QnVmZiA9IHRoaXMuX3ZlcnRleEJ1ZmZlcnNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRleENvdW50ID0gdmVydEJ1ZmYuc2l6ZSAvIHZlcnRCdWZmLnN0cmlkZTtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3RWZXJ0ZXggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0ZXhPZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbnN0YW5jZUNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLl9maXJzdEluc3RhbmNlID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5faW5kaXJlY3RCdWZmZXIgPSBpbmZvLmluZGlyZWN0QnVmZmVyIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGNvbnN0IGdwdVZlcnRleEJ1ZmZlcnM6IElXZWJHTEdQVUJ1ZmZlcltdID0gbmV3IEFycmF5PElXZWJHTEdQVUJ1ZmZlcj4oaW5mby52ZXJ0ZXhCdWZmZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZvLnZlcnRleEJ1ZmZlcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgdmIgPSBpbmZvLnZlcnRleEJ1ZmZlcnNbaV0gYXMgV2ViR0xCdWZmZXI7XHJcbiAgICAgICAgICAgIGlmICh2Yi5ncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIGdwdVZlcnRleEJ1ZmZlcnNbaV0gPSB2Yi5ncHVCdWZmZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBncHVJbmRleEJ1ZmZlcjogSVdlYkdMR1BVQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IGdsSW5kZXhUeXBlID0gMDtcclxuICAgICAgICBpZiAoaW5mby5pbmRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBncHVJbmRleEJ1ZmZlciA9IChpbmZvLmluZGV4QnVmZmVyIGFzIFdlYkdMQnVmZmVyKS5ncHVCdWZmZXI7XHJcbiAgICAgICAgICAgIGlmIChncHVJbmRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChncHVJbmRleEJ1ZmZlci5zdHJpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6IGdsSW5kZXhUeXBlID0gMHgxNDAxOyBicmVhazsgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlVOU0lHTkVEX0JZVEVcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6IGdsSW5kZXhUeXBlID0gMHgxNDAzOyBicmVhazsgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlVOU0lHTkVEX1NIT1JUXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiBnbEluZGV4VHlwZSA9IDB4MTQwNTsgYnJlYWs7IC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5VTlNJR05FRF9JTlRcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluZGV4IGJ1ZmZlciBzdHJpZGUuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZ3B1SW5kaXJlY3RCdWZmZXI6IElXZWJHTEdQVUJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGlmIChpbmZvLmluZGlyZWN0QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGdwdUluZGlyZWN0QnVmZmVyID0gKGluZm8uaW5kaXJlY3RCdWZmZXIgYXMgV2ViR0xCdWZmZXIpLmdwdUJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2dwdUlucHV0QXNzZW1ibGVyID0ge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBpbmZvLmF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIGdwdVZlcnRleEJ1ZmZlcnMsXHJcbiAgICAgICAgICAgIGdwdUluZGV4QnVmZmVyLFxyXG4gICAgICAgICAgICBncHVJbmRpcmVjdEJ1ZmZlcixcclxuXHJcbiAgICAgICAgICAgIGdsQXR0cmliczogW10sXHJcbiAgICAgICAgICAgIGdsSW5kZXhUeXBlLFxyXG4gICAgICAgICAgICBnbFZBT3M6IG5ldyBNYXA8V2ViR0xQcm9ncmFtLCBXZWJHTFZlcnRleEFycmF5T2JqZWN0T0VTPigpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFdlYkdMQ21kRnVuY0NyZWF0ZUlucHV0QXNzZW1iZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMRGV2aWNlLCB0aGlzLl9ncHVJbnB1dEFzc2VtYmxlcik7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBjb25zdCB3ZWJnbERldiA9IHRoaXMuX2RldmljZSBhcyBXZWJHTERldmljZTtcclxuICAgICAgICBpZiAodGhpcy5fZ3B1SW5wdXRBc3NlbWJsZXIgJiYgd2ViZ2xEZXYudXNlVkFPKSB7XHJcbiAgICAgICAgICAgIFdlYkdMQ21kRnVuY0Rlc3Ryb3lJbnB1dEFzc2VtYmxlcih3ZWJnbERldiwgdGhpcy5fZ3B1SW5wdXRBc3NlbWJsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ncHVJbnB1dEFzc2VtYmxlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuIl19