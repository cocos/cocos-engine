(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../memop/cached-array.js", "./webgl-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../memop/cached-array.js"), require("./webgl-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cachedArray, global.webglCommands);
    global.webglCommandAllocator = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cachedArray, _webglCommands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLCommandAllocator = _exports.WebGLCommandPool = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var WebGLCommandPool = /*#__PURE__*/function () {
    function WebGLCommandPool(clazz, count) {
      _classCallCheck(this, WebGLCommandPool);

      this._frees = void 0;
      this._freeIdx = 0;
      this._freeCmds = void 0;
      this._frees = new Array(count);
      this._freeCmds = new _cachedArray.CachedArray(count);

      for (var i = 0; i < count; ++i) {
        this._frees[i] = new clazz();
      }

      this._freeIdx = count - 1;
    }
    /*
    public alloc (clazz: new() => T): T {
        return new clazz();
    }
    */


    _createClass(WebGLCommandPool, [{
      key: "alloc",
      value: function alloc(clazz) {
        if (this._freeIdx < 0) {
          var size = this._frees.length * 2;
          var temp = this._frees;
          this._frees = new Array(size);
          var increase = size - temp.length;

          for (var i = 0; i < increase; ++i) {
            this._frees[i] = new clazz();
          }

          for (var _i = increase, j = 0; _i < size; ++_i, ++j) {
            this._frees[_i] = temp[j];
          }

          this._freeIdx += increase;
        }

        var cmd = this._frees[this._freeIdx];
        this._frees[this._freeIdx--] = null;
        ++cmd.refCount;
        return cmd;
      }
    }, {
      key: "free",
      value: function free(cmd) {
        if (--cmd.refCount === 0) {
          this._freeCmds.push(cmd);
        }
      }
    }, {
      key: "freeCmds",
      value: function freeCmds(cmds) {
        // return ;
        for (var i = 0; i < cmds.length; ++i) {
          if (--cmds.array[i].refCount === 0) {
            this._freeCmds.push(cmds.array[i]);
          }
        }
      }
    }, {
      key: "release",
      value: function release() {
        for (var i = 0; i < this._freeCmds.length; ++i) {
          var cmd = this._freeCmds.array[i];
          cmd.clear();
          this._frees[++this._freeIdx] = cmd;
        }

        this._freeCmds.clear();
      }
    }]);

    return WebGLCommandPool;
  }();

  _exports.WebGLCommandPool = WebGLCommandPool;

  var WebGLCommandAllocator = /*#__PURE__*/function () {
    function WebGLCommandAllocator() {
      _classCallCheck(this, WebGLCommandAllocator);

      this.beginRenderPassCmdPool = void 0;
      this.bindStatesCmdPool = void 0;
      this.drawCmdPool = void 0;
      this.updateBufferCmdPool = void 0;
      this.copyBufferToTextureCmdPool = void 0;
      this.beginRenderPassCmdPool = new WebGLCommandPool(_webglCommands.WebGLCmdBeginRenderPass, 1);
      this.bindStatesCmdPool = new WebGLCommandPool(_webglCommands.WebGLCmdBindStates, 1);
      this.drawCmdPool = new WebGLCommandPool(_webglCommands.WebGLCmdDraw, 1);
      this.updateBufferCmdPool = new WebGLCommandPool(_webglCommands.WebGLCmdUpdateBuffer, 1);
      this.copyBufferToTextureCmdPool = new WebGLCommandPool(_webglCommands.WebGLCmdCopyBufferToTexture, 1);
    }

    _createClass(WebGLCommandAllocator, [{
      key: "clearCmds",
      value: function clearCmds(cmdPackage) {
        if (cmdPackage.beginRenderPassCmds.length) {
          this.beginRenderPassCmdPool.freeCmds(cmdPackage.beginRenderPassCmds);
          cmdPackage.beginRenderPassCmds.clear();
        }

        if (cmdPackage.bindStatesCmds.length) {
          this.bindStatesCmdPool.freeCmds(cmdPackage.bindStatesCmds);
          cmdPackage.bindStatesCmds.clear();
        }

        if (cmdPackage.drawCmds.length) {
          this.drawCmdPool.freeCmds(cmdPackage.drawCmds);
          cmdPackage.drawCmds.clear();
        }

        if (cmdPackage.updateBufferCmds.length) {
          this.updateBufferCmdPool.freeCmds(cmdPackage.updateBufferCmds);
          cmdPackage.updateBufferCmds.clear();
        }

        if (cmdPackage.copyBufferToTextureCmds.length) {
          this.copyBufferToTextureCmdPool.freeCmds(cmdPackage.copyBufferToTextureCmds);
          cmdPackage.copyBufferToTextureCmds.clear();
        }

        cmdPackage.cmds.clear();
      }
    }, {
      key: "releaseCmds",
      value: function releaseCmds() {
        this.beginRenderPassCmdPool.release();
        this.bindStatesCmdPool.release();
        this.drawCmdPool.release();
        this.updateBufferCmdPool.release();
        this.copyBufferToTextureCmdPool.release();
      }
    }]);

    return WebGLCommandAllocator;
  }();

  _exports.WebGLCommandAllocator = WebGLCommandAllocator;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWNvbW1hbmQtYWxsb2NhdG9yLnRzIl0sIm5hbWVzIjpbIldlYkdMQ29tbWFuZFBvb2wiLCJjbGF6eiIsImNvdW50IiwiX2ZyZWVzIiwiX2ZyZWVJZHgiLCJfZnJlZUNtZHMiLCJBcnJheSIsIkNhY2hlZEFycmF5IiwiaSIsInNpemUiLCJsZW5ndGgiLCJ0ZW1wIiwiaW5jcmVhc2UiLCJqIiwiY21kIiwicmVmQ291bnQiLCJwdXNoIiwiY21kcyIsImFycmF5IiwiY2xlYXIiLCJXZWJHTENvbW1hbmRBbGxvY2F0b3IiLCJiZWdpblJlbmRlclBhc3NDbWRQb29sIiwiYmluZFN0YXRlc0NtZFBvb2wiLCJkcmF3Q21kUG9vbCIsInVwZGF0ZUJ1ZmZlckNtZFBvb2wiLCJjb3B5QnVmZmVyVG9UZXh0dXJlQ21kUG9vbCIsIldlYkdMQ21kQmVnaW5SZW5kZXJQYXNzIiwiV2ViR0xDbWRCaW5kU3RhdGVzIiwiV2ViR0xDbWREcmF3IiwiV2ViR0xDbWRVcGRhdGVCdWZmZXIiLCJXZWJHTENtZENvcHlCdWZmZXJUb1RleHR1cmUiLCJjbWRQYWNrYWdlIiwiYmVnaW5SZW5kZXJQYXNzQ21kcyIsImZyZWVDbWRzIiwiYmluZFN0YXRlc0NtZHMiLCJkcmF3Q21kcyIsInVwZGF0ZUJ1ZmZlckNtZHMiLCJjb3B5QnVmZmVyVG9UZXh0dXJlQ21kcyIsInJlbGVhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BV2FBLGdCO0FBTVQsOEJBQWFDLEtBQWIsRUFBZ0NDLEtBQWhDLEVBQStDO0FBQUE7O0FBQUEsV0FKdkNDLE1BSXVDO0FBQUEsV0FIdkNDLFFBR3VDLEdBSHBCLENBR29CO0FBQUEsV0FGdkNDLFNBRXVDO0FBQzNDLFdBQUtGLE1BQUwsR0FBYyxJQUFJRyxLQUFKLENBQVVKLEtBQVYsQ0FBZDtBQUNBLFdBQUtHLFNBQUwsR0FBaUIsSUFBSUUs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QUFDSyxnQkFBWCxDQUE0QmpCLEtBQTVCO0FBQ0g7O0FBRUQsWUFBSVksVUFBVSxDQUFDTSx1QkFBWCxDQUFtQzNCLE1BQXZDLEVBQStDO0FBQzNDLGVBQUtlLDBCQUFMLENBQWdDUSxRQUFoQyxDQUF5Q0YsVUFBVSxDQUFDTSx1QkFBcEQ7QUFDQU4sVUFBQUEsVUFBVSxDQUFDTSx1QkFBWCxDQUFtQ2xCLEtBQW5DO0FBQ0g7O0FBRURZLFFBQUFBLFVBQVUsQ0FBQ2QsSUFBWCxDQUFnQkUsS0FBaEI7QUFDSDs7O29DQUVxQjtBQUNsQixhQUFLRSxzQkFBTCxDQUE0QmlCLE9BQTVCO0FBQ0EsYUFBS2hCLGlCQUFMLENBQXVCZ0IsT0FBdkI7QUFDQSxhQUFLZixXQUFMLENBQWlCZSxPQUFqQjtBQUNBLGFBQUtkLG1CQUFMLENBQXlCYyxPQUF6QjtBQUNBLGFBQUtiLDBCQUFMLENBQWdDYSxPQUFoQztBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FjaGVkQXJyYXkgfSBmcm9tICcuLi8uLi9tZW1vcC9jYWNoZWQtYXJyYXknO1xyXG5pbXBvcnQge1xyXG4gICAgV2ViR0xDbWRCZWdpblJlbmRlclBhc3MsXHJcbiAgICBXZWJHTENtZEJpbmRTdGF0ZXMsXHJcbiAgICBXZWJHTENtZENvcHlCdWZmZXJUb1RleHR1cmUsXHJcbiAgICBXZWJHTENtZERyYXcsXHJcbiAgICBXZWJHTENtZE9iamVjdCxcclxuICAgIFdlYkdMQ21kUGFja2FnZSxcclxuICAgIFdlYkdMQ21kVXBkYXRlQnVmZmVyLFxyXG59IGZyb20gJy4vd2ViZ2wtY29tbWFuZHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMQ29tbWFuZFBvb2w8VCBleHRlbmRzIFdlYkdMQ21kT2JqZWN0PiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfZnJlZXM6IChUfG51bGwpW107XHJcbiAgICBwcml2YXRlIF9mcmVlSWR4OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfZnJlZUNtZHM6IENhY2hlZEFycmF5PFQ+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjbGF6ejogbmV3KCkgPT4gVCwgY291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZyZWVzID0gbmV3IEFycmF5KGNvdW50KTtcclxuICAgICAgICB0aGlzLl9mcmVlQ21kcyA9IG5ldyBDYWNoZWRBcnJheShjb3VudCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyZWVzW2ldID0gbmV3IGNsYXp6KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZyZWVJZHggPSBjb3VudCAtIDE7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIHB1YmxpYyBhbGxvYyAoY2xheno6IG5ldygpID0+IFQpOiBUIHtcclxuICAgICAgICByZXR1cm4gbmV3IGNsYXp6KCk7XHJcbiAgICB9XHJcbiAgICAqL1xyXG5cclxuICAgIHB1YmxpYyBhbGxvYyAoY2xheno6IG5ldygpID0+IFQpOiBUIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJlZUlkeCA8IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX2ZyZWVzLmxlbmd0aCAqIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB0aGlzLl9mcmVlcztcclxuICAgICAgICAgICAgdGhpcy5fZnJlZXMgPSBuZXcgQXJyYXk8VD4oc2l6ZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbmNyZWFzZSA9IHNpemUgLSB0ZW1wLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmNyZWFzZTsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmVlc1tpXSA9IG5ldyBjbGF6eigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gaW5jcmVhc2UsIGogPSAwOyBpIDwgc2l6ZTsgKytpLCArK2opIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyZWVzW2ldID0gdGVtcFtqXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fZnJlZUlkeCArPSBpbmNyZWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNtZCA9IHRoaXMuX2ZyZWVzW3RoaXMuX2ZyZWVJZHhdITtcclxuICAgICAgICB0aGlzLl9mcmVlc1t0aGlzLl9mcmVlSWR4LS1dID0gbnVsbDtcclxuICAgICAgICArK2NtZC5yZWZDb3VudDtcclxuICAgICAgICByZXR1cm4gY21kO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmcmVlIChjbWQ6IFQpIHtcclxuICAgICAgICBpZiAoLS1jbWQucmVmQ291bnQgPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZnJlZUNtZHMucHVzaChjbWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJlZUNtZHMgKGNtZHM6IENhY2hlZEFycmF5PFQ+KSB7XHJcbiAgICAgICAgLy8gcmV0dXJuIDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNtZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKC0tY21kcy5hcnJheVtpXS5yZWZDb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnJlZUNtZHMucHVzaChjbWRzLmFycmF5W2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVsZWFzZSAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9mcmVlQ21kcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBjbWQgPSB0aGlzLl9mcmVlQ21kcy5hcnJheVtpXTtcclxuICAgICAgICAgICAgY21kLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyZWVzWysrdGhpcy5fZnJlZUlkeF0gPSBjbWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZyZWVDbWRzLmNsZWFyKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJHTENvbW1hbmRBbGxvY2F0b3Ige1xyXG5cclxuICAgIHB1YmxpYyBiZWdpblJlbmRlclBhc3NDbWRQb29sOiBXZWJHTENvbW1hbmRQb29sPFdlYkdMQ21kQmVnaW5SZW5kZXJQYXNzPjtcclxuICAgIHB1YmxpYyBiaW5kU3RhdGVzQ21kUG9vbDogV2ViR0xDb21tYW5kUG9vbDxXZWJHTENtZEJpbmRTdGF0ZXM+O1xyXG4gICAgcHVibGljIGRyYXdDbWRQb29sOiBXZWJHTENvbW1hbmRQb29sPFdlYkdMQ21kRHJhdz47XHJcbiAgICBwdWJsaWMgdXBkYXRlQnVmZmVyQ21kUG9vbDogV2ViR0xDb21tYW5kUG9vbDxXZWJHTENtZFVwZGF0ZUJ1ZmZlcj47XHJcbiAgICBwdWJsaWMgY29weUJ1ZmZlclRvVGV4dHVyZUNtZFBvb2w6IFdlYkdMQ29tbWFuZFBvb2w8V2ViR0xDbWRDb3B5QnVmZmVyVG9UZXh0dXJlPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5iZWdpblJlbmRlclBhc3NDbWRQb29sID0gbmV3IFdlYkdMQ29tbWFuZFBvb2woV2ViR0xDbWRCZWdpblJlbmRlclBhc3MsIDEpO1xyXG4gICAgICAgIHRoaXMuYmluZFN0YXRlc0NtZFBvb2wgPSBuZXcgV2ViR0xDb21tYW5kUG9vbChXZWJHTENtZEJpbmRTdGF0ZXMsIDEpO1xyXG4gICAgICAgIHRoaXMuZHJhd0NtZFBvb2wgPSBuZXcgV2ViR0xDb21tYW5kUG9vbChXZWJHTENtZERyYXcsIDEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnVmZmVyQ21kUG9vbCA9IG5ldyBXZWJHTENvbW1hbmRQb29sKFdlYkdMQ21kVXBkYXRlQnVmZmVyLCAxKTtcclxuICAgICAgICB0aGlzLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRQb29sID0gbmV3IFdlYkdMQ29tbWFuZFBvb2woV2ViR0xDbWRDb3B5QnVmZmVyVG9UZXh0dXJlLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXJDbWRzIChjbWRQYWNrYWdlOiBXZWJHTENtZFBhY2thZ2UpIHtcclxuXHJcbiAgICAgICAgaWYgKGNtZFBhY2thZ2UuYmVnaW5SZW5kZXJQYXNzQ21kcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5iZWdpblJlbmRlclBhc3NDbWRQb29sLmZyZWVDbWRzKGNtZFBhY2thZ2UuYmVnaW5SZW5kZXJQYXNzQ21kcyk7XHJcbiAgICAgICAgICAgIGNtZFBhY2thZ2UuYmVnaW5SZW5kZXJQYXNzQ21kcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNtZFBhY2thZ2UuYmluZFN0YXRlc0NtZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmluZFN0YXRlc0NtZFBvb2wuZnJlZUNtZHMoY21kUGFja2FnZS5iaW5kU3RhdGVzQ21kcyk7XHJcbiAgICAgICAgICAgIGNtZFBhY2thZ2UuYmluZFN0YXRlc0NtZHMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbWRQYWNrYWdlLmRyYXdDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdDbWRQb29sLmZyZWVDbWRzKGNtZFBhY2thZ2UuZHJhd0NtZHMpO1xyXG4gICAgICAgICAgICBjbWRQYWNrYWdlLmRyYXdDbWRzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY21kUGFja2FnZS51cGRhdGVCdWZmZXJDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1ZmZlckNtZFBvb2wuZnJlZUNtZHMoY21kUGFja2FnZS51cGRhdGVCdWZmZXJDbWRzKTtcclxuICAgICAgICAgICAgY21kUGFja2FnZS51cGRhdGVCdWZmZXJDbWRzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY21kUGFja2FnZS5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kUG9vbC5mcmVlQ21kcyhjbWRQYWNrYWdlLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRzKTtcclxuICAgICAgICAgICAgY21kUGFja2FnZS5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY21kUGFja2FnZS5jbWRzLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbGVhc2VDbWRzICgpIHtcclxuICAgICAgICB0aGlzLmJlZ2luUmVuZGVyUGFzc0NtZFBvb2wucmVsZWFzZSgpO1xyXG4gICAgICAgIHRoaXMuYmluZFN0YXRlc0NtZFBvb2wucmVsZWFzZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0NtZFBvb2wucmVsZWFzZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnVmZmVyQ21kUG9vbC5yZWxlYXNlKCk7XHJcbiAgICAgICAgdGhpcy5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kUG9vbC5yZWxlYXNlKCk7XHJcbiAgICB9XHJcbn1cclxuIl19