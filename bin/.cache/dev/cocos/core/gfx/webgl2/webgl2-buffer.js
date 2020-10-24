(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../index.js", "../buffer.js", "../define.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../index.js"), require("../buffer.js"), require("../define.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.buffer, global.define, global.webgl2Commands);
    global.webgl2Buffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _buffer, _define, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2Buffer = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2Buffer = /*#__PURE__*/function (_GFXBuffer) {
    _inherits(WebGL2Buffer, _GFXBuffer);

    function WebGL2Buffer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2Buffer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2Buffer)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuBuffer = null;
      return _this;
    }

    _createClass(WebGL2Buffer, [{
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
          this._gpuBuffer = {
            usage: this._usage,
            memUsage: this._memUsage,
            size: this._size,
            stride: this._stride,
            buffer: this._bakcupBuffer,
            indirects: buffer.gpuBuffer.indirects,
            glTarget: buffer.gpuBuffer.glTarget,
            glBuffer: buffer.gpuBuffer.glBuffer,
            glOffset: info.offset
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

          this._gpuBuffer = {
            usage: this._usage,
            memUsage: this._memUsage,
            size: this._size,
            stride: this._stride,
            buffer: this._bakcupBuffer,
            indirects: [],
            glTarget: 0,
            glBuffer: null,
            glOffset: 0
          };

          if (info.usage & _define.GFXBufferUsageBit.INDIRECT) {
            this._gpuBuffer.indirects = this._indirectBuffer.drawInfos;
          }

          (0, _webgl2Commands.WebGL2CmdFuncCreateBuffer)(this._device, this._gpuBuffer);
          this._device.memoryStatus.bufferSize += this._size;
        }

        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._gpuBuffer) {
          if (!this._isBufferView) {
            (0, _webgl2Commands.WebGL2CmdFuncDestroyBuffer)(this._device, this._gpuBuffer);
            this._device.memoryStatus.bufferSize -= this._size;
          }

          this._gpuBuffer = null;
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

        if (this._gpuBuffer) {
          if (this._bakcupBuffer) {
            this._gpuBuffer.buffer = this._bakcupBuffer;
          }

          this._gpuBuffer.size = size;

          if (size > 0) {
            (0, _webgl2Commands.WebGL2CmdFuncResizeBuffer)(this._device, this._gpuBuffer);
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

        (0, _webgl2Commands.WebGL2CmdFuncUpdateBuffer)(this._device, this._gpuBuffer, buffer, offset || 0, buffSize);
      }
    }, {
      key: "gpuBuffer",
      get: function get() {
        return this._gpuBuffer;
      }
    }]);

    return WebGL2Buffer;
  }(_buffer.GFXBuffer);

  _exports.WebGL2Buffer = WebGL2Buffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItYnVmZmVyLnRzIl0sIm5hbWVzIjpbIldlYkdMMkJ1ZmZlciIsIl9ncHVCdWZmZXIiLCJpbmZvIiwiX2lzQnVmZmVyVmlldyIsImJ1ZmZlciIsIl91c2FnZSIsInVzYWdlIiwiX21lbVVzYWdlIiwibWVtVXNhZ2UiLCJfc2l6ZSIsIl9zdHJpZGUiLCJyYW5nZSIsIl9jb3VudCIsIl9mbGFncyIsImZsYWdzIiwic2l6ZSIsInN0cmlkZSIsIl9iYWtjdXBCdWZmZXIiLCJpbmRpcmVjdHMiLCJncHVCdWZmZXIiLCJnbFRhcmdldCIsImdsQnVmZmVyIiwiZ2xPZmZzZXQiLCJvZmZzZXQiLCJNYXRoIiwibWF4IiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJJTkRJUkVDVCIsIl9pbmRpcmVjdEJ1ZmZlciIsIkdGWEluZGlyZWN0QnVmZmVyIiwiR0ZYQnVmZmVyRmxhZ0JpdCIsIkJBS1VQX0JVRkZFUiIsIlVpbnQ4QXJyYXkiLCJfZGV2aWNlIiwibWVtb3J5U3RhdHVzIiwiYnVmZmVyU2l6ZSIsImRyYXdJbmZvcyIsImNvbnNvbGUiLCJ3YXJuIiwib2xkU2l6ZSIsIm9sZFZpZXciLCJzZXQiLCJidWZmU2l6ZSIsInVuZGVmaW5lZCIsImJ5dGVMZW5ndGgiLCJ2aWV3IiwiR0ZYQnVmZmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVlhQSxZOzs7Ozs7Ozs7Ozs7Ozs7WUFNREMsVSxHQUFzQyxJOzs7Ozs7aUNBRTNCQyxJLEVBQWtEO0FBRWpFLFlBQUksWUFBWUEsSUFBaEIsRUFBc0I7QUFBRTtBQUVwQixlQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBRUEsY0FBTUMsTUFBTSxHQUFHRixJQUFJLENBQUNFLE1BQXBCO0FBRUEsZUFBS0MsTUFBTCxHQUFjRCxNQUFNLENBQUNFLEtBQXJCO0FBQ0EsZUFBS0MsU0FBTCxHQUFp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QkFBS2dDLE9BQUwsQ0FBYUMsWUFBYixDQUEwQkMsVUFBMUIsSUFBd0NJLE9BQXhDO0FBQ0EsaUJBQUtOLE9BQUwsQ0FBYUMsWUFBYixDQUEwQkMsVUFBMUIsSUFBd0NwQixJQUF4QztBQUNIO0FBQ0o7QUFDSjs7OzZCQUVjWCxNLEVBQXlCbUIsTSxFQUFpQlIsSSxFQUFlO0FBQ3BFLFlBQUksS0FBS1osYUFBVCxFQUF3QjtBQUNwQmtDLFVBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHFDQUFiO0FBQ0E7QUFDSDs7QUFFRCxZQUFJSSxRQUFKOztBQUNBLFlBQUkzQixJQUFJLEtBQUs0QixTQUFiLEVBQXlCO0FBQ3JCRCxVQUFBQSxRQUFRLEdBQUczQixJQUFYO0FBQ0gsU0FGRCxNQUVPLElBQUksS0FBS1YsTUFBTCxHQUFjcUIsMEJBQWtCQyxRQUFwQyxFQUE4QztBQUNqRGUsVUFBQUEsUUFBUSxHQUFHLENBQVg7QUFDSCxTQUZNLE1BRUE7QUFDSEEsVUFBQUEsUUFBUSxHQUFJdEMsTUFBRCxDQUF3QndDLFVBQW5DO0FBQ0g7O0FBQ0QsWUFBSSxLQUFLM0IsYUFBTCxJQUFzQmIsTUFBTSxLQUFLLEtBQUthLGFBQUwsQ0FBbUJiLE1BQXhELEVBQWdFO0FBQzVELGNBQU15QyxJQUFJLEdBQUcsSUFBSWIsVUFBSixDQUFlNUIsTUFBZixFQUFzQyxDQUF0QyxFQUF5Q1csSUFBekMsQ0FBYjs7QUFDQSxlQUFLRSxhQUFMLENBQW1Cd0IsR0FBbkIsQ0FBdUJJLElBQXZCLEVBQTZCdEIsTUFBN0I7QUFDSDs7QUFFRCx1REFDSSxLQUFLVSxPQURULEVBRUksS0FBS2hDLFVBRlQsRUFHSUcsTUFISixFQUlJbUIsTUFBTSxJQUFJLENBSmQsRUFLSW1CLFFBTEo7QUFNSDs7OzBCQWpKa0M7QUFDL0IsZUFBUSxLQUFLekMsVUFBYjtBQUNIOzs7O0lBSjZCNkMsaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhJbmRpcmVjdEJ1ZmZlciB9IGZyb20gJy4uLy4uJztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyLCBHRlhCdWZmZXJTb3VyY2UsIEdGWEJ1ZmZlckluZm8sIEdGWEJ1ZmZlclZpZXdJbmZvIH0gZnJvbSAnLi4vYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyRmxhZ0JpdCwgR0ZYQnVmZmVyVXNhZ2VCaXQgfSBmcm9tICcuLi9kZWZpbmUnO1xyXG5pbXBvcnQge1xyXG4gICAgV2ViR0wyQ21kRnVuY0NyZWF0ZUJ1ZmZlcixcclxuICAgIFdlYkdMMkNtZEZ1bmNEZXN0cm95QnVmZmVyLFxyXG4gICAgV2ViR0wyQ21kRnVuY1Jlc2l6ZUJ1ZmZlcixcclxuICAgIFdlYkdMMkNtZEZ1bmNVcGRhdGVCdWZmZXIsXHJcbn0gZnJvbSAnLi93ZWJnbDItY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBXZWJHTDJEZXZpY2UgfSBmcm9tICcuL3dlYmdsMi1kZXZpY2UnO1xyXG5pbXBvcnQgeyBJV2ViR0wyR1BVQnVmZmVyIH0gZnJvbSAnLi93ZWJnbDItZ3B1LW9iamVjdHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMMkJ1ZmZlciBleHRlbmRzIEdGWEJ1ZmZlciB7XHJcblxyXG4gICAgZ2V0IGdwdUJ1ZmZlciAoKTogSVdlYkdMMkdQVUJ1ZmZlciB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLl9ncHVCdWZmZXIhO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dwdUJ1ZmZlcjogSVdlYkdMMkdQVUJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhCdWZmZXJJbmZvIHwgR0ZYQnVmZmVyVmlld0luZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgaWYgKCdidWZmZXInIGluIGluZm8pIHsgLy8gYnVmZmVyIHZpZXdcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2lzQnVmZmVyVmlldyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBidWZmZXIgPSBpbmZvLmJ1ZmZlciBhcyBXZWJHTDJCdWZmZXI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl91c2FnZSA9IGJ1ZmZlci51c2FnZTtcclxuICAgICAgICAgICAgdGhpcy5fbWVtVXNhZ2UgPSBidWZmZXIubWVtVXNhZ2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3NpemUgPSB0aGlzLl9zdHJpZGUgPSBpbmZvLnJhbmdlO1xyXG4gICAgICAgICAgICB0aGlzLl9jb3VudCA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsYWdzID0gYnVmZmVyLmZsYWdzO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ3B1QnVmZmVyID0ge1xyXG4gICAgICAgICAgICAgICAgdXNhZ2U6IHRoaXMuX3VzYWdlLFxyXG4gICAgICAgICAgICAgICAgbWVtVXNhZ2U6IHRoaXMuX21lbVVzYWdlLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogdGhpcy5fc2l6ZSxcclxuICAgICAgICAgICAgICAgIHN0cmlkZTogdGhpcy5fc3RyaWRlLFxyXG4gICAgICAgICAgICAgICAgYnVmZmVyOiB0aGlzLl9iYWtjdXBCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICBpbmRpcmVjdHM6IGJ1ZmZlci5ncHVCdWZmZXIuaW5kaXJlY3RzLFxyXG4gICAgICAgICAgICAgICAgZ2xUYXJnZXQ6IGJ1ZmZlci5ncHVCdWZmZXIuZ2xUYXJnZXQsXHJcbiAgICAgICAgICAgICAgICBnbEJ1ZmZlcjogYnVmZmVyLmdwdUJ1ZmZlci5nbEJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIGdsT2Zmc2V0OiBpbmZvLm9mZnNldCxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHsgLy8gbmF0aXZlIGJ1ZmZlclxyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXNhZ2UgPSBpbmZvLnVzYWdlO1xyXG4gICAgICAgICAgICB0aGlzLl9tZW1Vc2FnZSA9IGluZm8ubWVtVXNhZ2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3NpemUgPSBpbmZvLnNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0cmlkZSA9IE1hdGgubWF4KGluZm8uc3RyaWRlIHx8IHRoaXMuX3NpemUsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb3VudCA9IHRoaXMuX3NpemUgLyB0aGlzLl9zdHJpZGU7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsYWdzID0gaW5mby5mbGFncztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LklORElSRUNUKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbmRpcmVjdEJ1ZmZlciA9IG5ldyBHRlhJbmRpcmVjdEJ1ZmZlcigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fZmxhZ3MgJiBHRlhCdWZmZXJGbGFnQml0LkJBS1VQX0JVRkZFUikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFrY3VwQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXZpY2UubWVtb3J5U3RhdHVzLmJ1ZmZlclNpemUgKz0gdGhpcy5fc2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ3B1QnVmZmVyID0ge1xyXG4gICAgICAgICAgICAgICAgdXNhZ2U6IHRoaXMuX3VzYWdlLFxyXG4gICAgICAgICAgICAgICAgbWVtVXNhZ2U6IHRoaXMuX21lbVVzYWdlLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogdGhpcy5fc2l6ZSxcclxuICAgICAgICAgICAgICAgIHN0cmlkZTogdGhpcy5fc3RyaWRlLFxyXG4gICAgICAgICAgICAgICAgYnVmZmVyOiB0aGlzLl9iYWtjdXBCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICBpbmRpcmVjdHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgZ2xUYXJnZXQ6IDAsXHJcbiAgICAgICAgICAgICAgICBnbEJ1ZmZlcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIGdsT2Zmc2V0OiAwLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGluZm8udXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5JTkRJUkVDVCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ3B1QnVmZmVyLmluZGlyZWN0cyA9IHRoaXMuX2luZGlyZWN0QnVmZmVyIS5kcmF3SW5mb3M7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFdlYkdMMkNtZEZ1bmNDcmVhdGVCdWZmZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgdGhpcy5fZ3B1QnVmZmVyKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMuYnVmZmVyU2l6ZSArPSB0aGlzLl9zaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0J1ZmZlclZpZXcpIHtcclxuICAgICAgICAgICAgICAgIFdlYkdMMkNtZEZ1bmNEZXN0cm95QnVmZmVyKHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2UsIHRoaXMuX2dwdUJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXZpY2UubWVtb3J5U3RhdHVzLmJ1ZmZlclNpemUgLT0gdGhpcy5fc2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9ncHVCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYmFrY3VwQnVmZmVyID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzaXplIChzaXplOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNCdWZmZXJWaWV3KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignY2Fubm90IHJlc2l6ZSBidWZmZXIgdmlld3MhJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9sZFNpemUgPSB0aGlzLl9zaXplO1xyXG4gICAgICAgIGlmIChvbGRTaXplID09PSBzaXplKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICB0aGlzLl9zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLl9jb3VudCA9IHRoaXMuX3NpemUgLyB0aGlzLl9zdHJpZGU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9iYWtjdXBCdWZmZXIpIHtcclxuICAgICAgICAgICAgY29uc3Qgb2xkVmlldyA9IHRoaXMuX2Jha2N1cEJ1ZmZlcjtcclxuICAgICAgICAgICAgdGhpcy5fYmFrY3VwQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fc2l6ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jha2N1cEJ1ZmZlci5zZXQob2xkVmlldyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMuYnVmZmVyU2l6ZSAtPSBvbGRTaXplO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXZpY2UubWVtb3J5U3RhdHVzLmJ1ZmZlclNpemUgKz0gc2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9ncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jha2N1cEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ3B1QnVmZmVyLmJ1ZmZlciA9IHRoaXMuX2Jha2N1cEJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fZ3B1QnVmZmVyLnNpemUgPSBzaXplO1xyXG4gICAgICAgICAgICBpZiAoc2l6ZSA+IDApIHtcclxuICAgICAgICAgICAgICAgIFdlYkdMMkNtZEZ1bmNSZXNpemVCdWZmZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgdGhpcy5fZ3B1QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMuYnVmZmVyU2l6ZSAtPSBvbGRTaXplO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGV2aWNlLm1lbW9yeVN0YXR1cy5idWZmZXJTaXplICs9IHNpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoYnVmZmVyOiBHRlhCdWZmZXJTb3VyY2UsIG9mZnNldD86IG51bWJlciwgc2l6ZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0J1ZmZlclZpZXcpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdjYW5ub3QgdXBkYXRlIHRocm91Z2ggYnVmZmVyIHZpZXdzIScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYnVmZlNpemU6IG51bWJlcjtcclxuICAgICAgICBpZiAoc2l6ZSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBidWZmU2l6ZSA9IHNpemU7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl91c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LklORElSRUNUKSB7XHJcbiAgICAgICAgICAgIGJ1ZmZTaXplID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBidWZmU2l6ZSA9IChidWZmZXIgYXMgQXJyYXlCdWZmZXIpLmJ5dGVMZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9iYWtjdXBCdWZmZXIgJiYgYnVmZmVyICE9PSB0aGlzLl9iYWtjdXBCdWZmZXIuYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShidWZmZXIgYXMgQXJyYXlCdWZmZXIsIDAsIHNpemUpO1xyXG4gICAgICAgICAgICB0aGlzLl9iYWtjdXBCdWZmZXIuc2V0KHZpZXcsIG9mZnNldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBXZWJHTDJDbWRGdW5jVXBkYXRlQnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLl9kZXZpY2UgYXMgV2ViR0wyRGV2aWNlLFxyXG4gICAgICAgICAgICB0aGlzLl9ncHVCdWZmZXIhLFxyXG4gICAgICAgICAgICBidWZmZXIsXHJcbiAgICAgICAgICAgIG9mZnNldCB8fCAwLFxyXG4gICAgICAgICAgICBidWZmU2l6ZSk7XHJcbiAgICB9XHJcbn1cclxuIl19