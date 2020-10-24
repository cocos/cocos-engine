(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../index.js", "../buffer.js", "../define.js", "./webgl-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../index.js"), require("../buffer.js"), require("../define.js"), require("./webgl-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.buffer, global.define, global.webglCommands);
    global.webglBuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _buffer, _define, _webglCommands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLBuffer = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLBuffer = /*#__PURE__*/function (_GFXBuffer) {
    _inherits(WebGLBuffer, _GFXBuffer);

    function WebGLBuffer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLBuffer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLBuffer)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuBuffer = null;
      _this._gpuBufferView = null;
      _this._uniformBuffer = null;
      return _this;
    }

    _createClass(WebGLBuffer, [{
      key: "initialize",
      value: function initialize(info) {
        if ('buffer' in info) {
          // buffer view
          this._isBufferView = true;
          var buffer = info.buffer;
          this._usage = buffer.usage;
          this._memUsage = buffer.memUsage;
          this._size = this._stride = info.range;
          this._count = 1;
          this._flags = buffer.flags;
          this._gpuBufferView = {
            gpuBuffer: buffer.gpuBuffer,
            offset: info.offset,
            range: info.range
          };
        } else {
          // native buffer
          this._usage = info.usage;
          this._memUsage = info.memUsage;
          this._size = info.size;
          this._stride = Math.max(info.stride || this._size, 1);
          this._count = this._size / this._stride;
          this._flags = info.flags;

          if (this._usage & _define.GFXBufferUsageBit.INDIRECT) {
            this._indirectBuffer = new _index.GFXIndirectBuffer();
          }

          if (this._flags & _define.GFXBufferFlagBit.BAKUP_BUFFER) {
            this._bakcupBuffer = new Uint8Array(this._size);
            this._device.memoryStatus.bufferSize += this._size;
          }

          if (this._usage & _define.GFXBufferUsageBit.UNIFORM && this._size > 0) {
            this._uniformBuffer = new Uint8Array(this._size);
          }

          this._gpuBuffer = {
            usage: this._usage,
            memUsage: this._memUsage,
            size: this._size,
            stride: this._stride,
            buffer: this._bakcupBuffer,
            vf32: null,
            indirects: [],
            glTarget: 0,
            glBuffer: null
          };

          if (info.usage & _define.GFXBufferUsageBit.INDIRECT) {
            this._gpuBuffer.indirects = this._indirectBuffer.drawInfos;
          }

          if (this._usage & _define.GFXBufferUsageBit.UNIFORM) {
            this._gpuBuffer.buffer = this._uniformBuffer;
          }

          (0, _webglCommands.WebGLCmdFuncCreateBuffer)(this._device, this._gpuBuffer);
          this._device.memoryStatus.bufferSize += this._size;
        }

        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._gpuBuffer) {
          (0, _webglCommands.WebGLCmdFuncDestroyBuffer)(this._device, this._gpuBuffer);
          this._device.memoryStatus.bufferSize -= this._size;
          this._gpuBuffer = null;
        }

        if (this._gpuBufferView) {
          this._gpuBufferView = null;
        }

        this._bakcupBuffer = null;
      }
    }, {
      key: "resize",
      value: function resize(size) {
        if (this._isBufferView) {
          console.warn('cannot resize buffer views!');
          return;
        }

        var oldSize = this._size;

        if (oldSize === size) {
          return;
        }

        this._size = size;
        this._count = this._size / this._stride;

        if (this._bakcupBuffer) {
          var oldView = this._bakcupBuffer;
          this._bakcupBuffer = new Uint8Array(this._size);

          this._bakcupBuffer.set(oldView);

          this._device.memoryStatus.bufferSize -= oldSize;
          this._device.memoryStatus.bufferSize += size;
        }

        if (this._uniformBuffer) {
          this._uniformBuffer = new Uint8Array(size);
        }

        if (this._gpuBuffer) {
          if (this._uniformBuffer) {
            this._gpuBuffer.buffer = this._uniformBuffer;
          } else if (this._bakcupBuffer) {
            this._gpuBuffer.buffer = this._bakcupBuffer;
          }

          this._gpuBuffer.size = size;

          if (size > 0) {
            (0, _webglCommands.WebGLCmdFuncResizeBuffer)(this._device, this._gpuBuffer);
            this._device.memoryStatus.bufferSize -= oldSize;
            this._device.memoryStatus.bufferSize += size;
          }
        }
      }
    }, {
      key: "update",
      value: function update(buffer, offset, size) {
        if (this._isBufferView) {
          console.warn('cannot update through buffer views!');
          return;
        }

        var buffSize;

        if (size !== undefined) {
          buffSize = size;
        } else if (this._usage & _define.GFXBufferUsageBit.INDIRECT) {
          buffSize = 0;
        } else {
          buffSize = buffer.byteLength;
        }

        if (this._bakcupBuffer && buffer !== this._bakcupBuffer.buffer) {
          var view = new Uint8Array(buffer, 0, size);

          this._bakcupBuffer.set(view, offset);
        }

        (0, _webglCommands.WebGLCmdFuncUpdateBuffer)(this._device, this._gpuBuffer, buffer, offset || 0, buffSize);
      }
    }, {
      key: "gpuBuffer",
      get: function get() {
        return this._gpuBuffer;
      }
    }, {
      key: "gpuBufferView",
      get: function get() {
        return this._gpuBufferView;
      }
    }]);

    return WebGLBuffer;
  }(_buffer.GFXBuffer);

  _exports.WebGLBuffer = WebGLBuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWJ1ZmZlci50cyJdLCJuYW1lcyI6WyJXZWJHTEJ1ZmZlciIsIl9ncHVCdWZmZXIiLCJfZ3B1QnVmZmVyVmlldyIsIl91bmlmb3JtQnVmZmVyIiwiaW5mbyIsIl9pc0J1ZmZlclZpZXciLCJidWZmZXIiLCJfdXNhZ2UiLCJ1c2FnZSIsIl9tZW1Vc2FnZSIsIm1lbVVzYWdlIiwiX3NpemUiLCJfc3RyaWRlIiwicmFuZ2UiLCJfY291bnQiLCJfZmxhZ3MiLCJmbGFncyIsImdwdUJ1ZmZlciIsIm9mZnNldCIsInNpemUiLCJNYXRoIiwibWF4Iiwic3RyaWRlIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJJTkRJUkVDVCIsIl9pbmRpcmVjdEJ1ZmZlciIsIkdGWEluZGlyZWN0QnVmZmVyIiwiR0ZYQnVmZmVyRmxhZ0JpdCIsIkJBS1VQX0JVRkZFUiIsIl9iYWtjdXBCdWZmZXIiLCJVaW50OEFycmF5IiwiX2RldmljZSIsIm1lbW9yeVN0YXR1cyIsImJ1ZmZlclNpemUiLCJVTklGT1JNIiwidmYzMiIsImluZGlyZWN0cyIsImdsVGFyZ2V0IiwiZ2xCdWZmZXIiLCJkcmF3SW5mb3MiLCJjb25zb2xlIiwid2FybiIsIm9sZFNpemUiLCJvbGRWaWV3Iiwic2V0IiwiYnVmZlNpemUiLCJ1bmRlZmluZWQiLCJieXRlTGVuZ3RoIiwidmlldyIsIkdGWEJ1ZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFZYUEsVzs7Ozs7Ozs7Ozs7Ozs7O1lBVURDLFUsR0FBcUMsSTtZQUNyQ0MsYyxHQUE2QyxJO1lBQzdDQyxjLEdBQW9DLEk7Ozs7OztpQ0FFekJDLEksRUFBa0Q7QUFFakUsWUFBSSxZQUFZQSxJQUFoQixFQUFzQjtBQUFFO0FBRXBCLGVBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFFQSxjQUFNQyxNQUFNLEdBQUdGLElBQUks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TCxDQUFtQmUsR0FBbkIsQ0FBdUJJLElBQXZCLEVBQTZCOUIsTUFBN0I7QUFDSDs7QUFFRCxxREFDSSxLQUFLYSxPQURULEVBRUksS0FBSzlCLFVBRlQsRUFHSUssTUFISixFQUlJWSxNQUFNLElBQUksQ0FKZCxFQUtJMkIsUUFMSjtBQU1IOzs7MEJBaktpQztBQUM5QixlQUFRLEtBQUs1QyxVQUFiO0FBQ0g7OzswQkFFeUM7QUFDdEMsZUFBUSxLQUFLQyxjQUFiO0FBQ0g7Ozs7SUFSNEIrQyxpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWEluZGlyZWN0QnVmZmVyIH0gZnJvbSAnLi4vLi4nO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXIsIEdGWEJ1ZmZlclNvdXJjZSwgR0ZYQnVmZmVySW5mbywgR0ZYQnVmZmVyVmlld0luZm8gfSBmcm9tICcuLi9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXJVc2FnZUJpdCwgR0ZYQnVmZmVyRmxhZ0JpdCB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7XHJcbiAgICBXZWJHTENtZEZ1bmNDcmVhdGVCdWZmZXIsXHJcbiAgICBXZWJHTENtZEZ1bmNEZXN0cm95QnVmZmVyLFxyXG4gICAgV2ViR0xDbWRGdW5jUmVzaXplQnVmZmVyLFxyXG4gICAgV2ViR0xDbWRGdW5jVXBkYXRlQnVmZmVyLFxyXG59IGZyb20gJy4vd2ViZ2wtY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBXZWJHTERldmljZSB9IGZyb20gJy4vd2ViZ2wtZGV2aWNlJztcclxuaW1wb3J0IHsgSVdlYkdMR1BVQnVmZmVyLCBJV2ViR0xHUFVCdWZmZXJWaWV3IH0gZnJvbSAnLi93ZWJnbC1ncHUtb2JqZWN0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xCdWZmZXIgZXh0ZW5kcyBHRlhCdWZmZXIge1xyXG5cclxuICAgIGdldCBncHVCdWZmZXIgKCk6IElXZWJHTEdQVUJ1ZmZlciB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLl9ncHVCdWZmZXIhO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBncHVCdWZmZXJWaWV3ICgpOiBJV2ViR0xHUFVCdWZmZXJWaWV3IHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2dwdUJ1ZmZlclZpZXchO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dwdUJ1ZmZlcjogSVdlYkdMR1BVQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9ncHVCdWZmZXJWaWV3OiBJV2ViR0xHUFVCdWZmZXJWaWV3IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF91bmlmb3JtQnVmZmVyOiBVaW50OEFycmF5IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IEdGWEJ1ZmZlckluZm8gfCBHRlhCdWZmZXJWaWV3SW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBpZiAoJ2J1ZmZlcicgaW4gaW5mbykgeyAvLyBidWZmZXIgdmlld1xyXG5cclxuICAgICAgICAgICAgdGhpcy5faXNCdWZmZXJWaWV3ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IGluZm8uYnVmZmVyIGFzIFdlYkdMQnVmZmVyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXNhZ2UgPSBidWZmZXIudXNhZ2U7XHJcbiAgICAgICAgICAgIHRoaXMuX21lbVVzYWdlID0gYnVmZmVyLm1lbVVzYWdlO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplID0gdGhpcy5fc3RyaWRlID0gaW5mby5yYW5nZTtcclxuICAgICAgICAgICAgdGhpcy5fY291bnQgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9mbGFncyA9IGJ1ZmZlci5mbGFncztcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2dwdUJ1ZmZlclZpZXcgPSB7XHJcbiAgICAgICAgICAgICAgICBncHVCdWZmZXI6IGJ1ZmZlci5ncHVCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IGluZm8ub2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgcmFuZ2U6IGluZm8ucmFuZ2UsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0gZWxzZSB7IC8vIG5hdGl2ZSBidWZmZXJcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3VzYWdlID0gaW5mby51c2FnZTtcclxuICAgICAgICAgICAgdGhpcy5fbWVtVXNhZ2UgPSBpbmZvLm1lbVVzYWdlO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplID0gaW5mby5zaXplO1xyXG4gICAgICAgICAgICB0aGlzLl9zdHJpZGUgPSBNYXRoLm1heChpbmZvLnN0cmlkZSB8fCB0aGlzLl9zaXplLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5fY291bnQgPSB0aGlzLl9zaXplIC8gdGhpcy5fc3RyaWRlO1xyXG4gICAgICAgICAgICB0aGlzLl9mbGFncyA9IGluZm8uZmxhZ3M7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fdXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5JTkRJUkVDVCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5kaXJlY3RCdWZmZXIgPSBuZXcgR0ZYSW5kaXJlY3RCdWZmZXIoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZsYWdzICYgR0ZYQnVmZmVyRmxhZ0JpdC5CQUtVUF9CVUZGRVIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jha2N1cEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KHRoaXMuX3NpemUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGV2aWNlLm1lbW9yeVN0YXR1cy5idWZmZXJTaXplICs9IHRoaXMuX3NpemU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgodGhpcy5fdXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5VTklGT1JNKSAmJiB0aGlzLl9zaXplID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdW5pZm9ybUJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KHRoaXMuX3NpemUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9ncHVCdWZmZXIgPSB7XHJcbiAgICAgICAgICAgICAgICB1c2FnZTogdGhpcy5fdXNhZ2UsXHJcbiAgICAgICAgICAgICAgICBtZW1Vc2FnZTogdGhpcy5fbWVtVXNhZ2UsXHJcbiAgICAgICAgICAgICAgICBzaXplOiB0aGlzLl9zaXplLFxyXG4gICAgICAgICAgICAgICAgc3RyaWRlOiB0aGlzLl9zdHJpZGUsXHJcbiAgICAgICAgICAgICAgICBidWZmZXI6IHRoaXMuX2Jha2N1cEJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIHZmMzI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBpbmRpcmVjdHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgZ2xUYXJnZXQ6IDAsXHJcbiAgICAgICAgICAgICAgICBnbEJ1ZmZlcjogbnVsbCxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbmZvLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ESVJFQ1QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dwdUJ1ZmZlci5pbmRpcmVjdHMgPSB0aGlzLl9pbmRpcmVjdEJ1ZmZlciEuZHJhd0luZm9zO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fdXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5VTklGT1JNKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ncHVCdWZmZXIuYnVmZmVyID0gdGhpcy5fdW5pZm9ybUJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2ViR0xDbWRGdW5jQ3JlYXRlQnVmZmVyKHRoaXMuX2RldmljZSBhcyBXZWJHTERldmljZSwgdGhpcy5fZ3B1QnVmZmVyKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMuYnVmZmVyU2l6ZSArPSB0aGlzLl9zaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgV2ViR0xDbWRGdW5jRGVzdHJveUJ1ZmZlcih0aGlzLl9kZXZpY2UgYXMgV2ViR0xEZXZpY2UsIHRoaXMuX2dwdUJ1ZmZlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMuYnVmZmVyU2l6ZSAtPSB0aGlzLl9zaXplO1xyXG4gICAgICAgICAgICB0aGlzLl9ncHVCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2dwdUJ1ZmZlclZpZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ3B1QnVmZmVyVmlldyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9iYWtjdXBCdWZmZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUgKHNpemU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0J1ZmZlclZpZXcpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdjYW5ub3QgcmVzaXplIGJ1ZmZlciB2aWV3cyEnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgb2xkU2l6ZSA9IHRoaXMuX3NpemU7XHJcbiAgICAgICAgaWYgKG9sZFNpemUgPT09IHNpemUpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuX2NvdW50ID0gdGhpcy5fc2l6ZSAvIHRoaXMuX3N0cmlkZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2Jha2N1cEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBvbGRWaWV3ID0gdGhpcy5fYmFrY3VwQnVmZmVyO1xyXG4gICAgICAgICAgICB0aGlzLl9iYWtjdXBCdWZmZXIgPSBuZXcgVWludDhBcnJheSh0aGlzLl9zaXplKTtcclxuICAgICAgICAgICAgdGhpcy5fYmFrY3VwQnVmZmVyLnNldChvbGRWaWV3KTtcclxuICAgICAgICAgICAgdGhpcy5fZGV2aWNlLm1lbW9yeVN0YXR1cy5idWZmZXJTaXplIC09IG9sZFNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMuYnVmZmVyU2l6ZSArPSBzaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3VuaWZvcm1CdWZmZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdW5pZm9ybUJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2dwdUJ1ZmZlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdW5pZm9ybUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ3B1QnVmZmVyLmJ1ZmZlciA9IHRoaXMuX3VuaWZvcm1CdWZmZXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYmFrY3VwQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ncHVCdWZmZXIuYnVmZmVyID0gdGhpcy5fYmFrY3VwQnVmZmVyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9ncHVCdWZmZXIuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgICAgIGlmIChzaXplID4gMCkge1xyXG4gICAgICAgICAgICAgICAgV2ViR0xDbWRGdW5jUmVzaXplQnVmZmVyKHRoaXMuX2RldmljZSBhcyBXZWJHTERldmljZSwgdGhpcy5fZ3B1QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMuYnVmZmVyU2l6ZSAtPSBvbGRTaXplO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGV2aWNlLm1lbW9yeVN0YXR1cy5idWZmZXJTaXplICs9IHNpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoYnVmZmVyOiBHRlhCdWZmZXJTb3VyY2UsIG9mZnNldD86IG51bWJlciwgc2l6ZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0J1ZmZlclZpZXcpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdjYW5ub3QgdXBkYXRlIHRocm91Z2ggYnVmZmVyIHZpZXdzIScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYnVmZlNpemU6IG51bWJlcjtcclxuICAgICAgICBpZiAoc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGJ1ZmZTaXplID0gc2l6ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3VzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ESVJFQ1QpIHtcclxuICAgICAgICAgICAgYnVmZlNpemUgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJ1ZmZTaXplID0gKGJ1ZmZlciBhcyBBcnJheUJ1ZmZlcikuYnl0ZUxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Jha2N1cEJ1ZmZlciAmJiBidWZmZXIgIT09IHRoaXMuX2Jha2N1cEJ1ZmZlci5idWZmZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlciBhcyBBcnJheUJ1ZmZlciwgMCwgc2l6ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jha2N1cEJ1ZmZlci5zZXQodmlldywgb2Zmc2V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFdlYkdMQ21kRnVuY1VwZGF0ZUJ1ZmZlcihcclxuICAgICAgICAgICAgdGhpcy5fZGV2aWNlIGFzIFdlYkdMRGV2aWNlLFxyXG4gICAgICAgICAgICB0aGlzLl9ncHVCdWZmZXIhLFxyXG4gICAgICAgICAgICBidWZmZXIsXHJcbiAgICAgICAgICAgIG9mZnNldCB8fCAwLFxyXG4gICAgICAgICAgICBidWZmU2l6ZSk7XHJcbiAgICB9XHJcbn1cclxuIl19