(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../memop/cached-array.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../memop/cached-array.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cachedArray, global.webgl2Commands);
    global.webgl2CommandAllocator = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cachedArray, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2CommandAllocator = _exports.WebGL2CommandPool = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var WebGL2CommandPool = /*#__PURE__*/function () {
    function WebGL2CommandPool(clazz, count) {
      _classCallCheck(this, WebGL2CommandPool);

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


    _createClass(WebGL2CommandPool, [{
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

    return WebGL2CommandPool;
  }();

  _exports.WebGL2CommandPool = WebGL2CommandPool;

  var WebGL2CommandAllocator = /*#__PURE__*/function () {
    function WebGL2CommandAllocator() {
      _classCallCheck(this, WebGL2CommandAllocator);

      this.beginRenderPassCmdPool = void 0;
      this.bindStatesCmdPool = void 0;
      this.drawCmdPool = void 0;
      this.updateBufferCmdPool = void 0;
      this.copyBufferToTextureCmdPool = void 0;
      this.beginRenderPassCmdPool = new WebGL2CommandPool(_webgl2Commands.WebGL2CmdBeginRenderPass, 1);
      this.bindStatesCmdPool = new WebGL2CommandPool(_webgl2Commands.WebGL2CmdBindStates, 1);
      this.drawCmdPool = new WebGL2CommandPool(_webgl2Commands.WebGL2CmdDraw, 1);
      this.updateBufferCmdPool = new WebGL2CommandPool(_webgl2Commands.WebGL2CmdUpdateBuffer, 1);
      this.copyBufferToTextureCmdPool = new WebGL2CommandPool(_webgl2Commands.WebGL2CmdCopyBufferToTexture, 1);
    }

    _createClass(WebGL2CommandAllocator, [{
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

    return WebGL2CommandAllocator;
  }();

  _exports.WebGL2CommandAllocator = WebGL2CommandAllocator;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItY29tbWFuZC1hbGxvY2F0b3IudHMiXSwibmFtZXMiOlsiV2ViR0wyQ29tbWFuZFBvb2wiLCJjbGF6eiIsImNvdW50IiwiX2ZyZWVzIiwiX2ZyZWVJZHgiLCJfZnJlZUNtZHMiLCJBcnJheSIsIkNhY2hlZEFycmF5IiwiaSIsInNpemUiLCJsZW5ndGgiLCJ0ZW1wIiwiaW5jcmVhc2UiLCJqIiwiY21kIiwicmVmQ291bnQiLCJwdXNoIiwiY21kcyIsImFycmF5IiwiY2xlYXIiLCJXZWJHTDJDb21tYW5kQWxsb2NhdG9yIiwiYmVnaW5SZW5kZXJQYXNzQ21kUG9vbCIsImJpbmRTdGF0ZXNDbWRQb29sIiwiZHJhd0NtZFBvb2wiLCJ1cGRhdGVCdWZmZXJDbWRQb29sIiwiY29weUJ1ZmZlclRvVGV4dHVyZUNtZFBvb2wiLCJXZWJHTDJDbWRCZWdpblJlbmRlclBhc3MiLCJXZWJHTDJDbWRCaW5kU3RhdGVzIiwiV2ViR0wyQ21kRHJhdyIsIldlYkdMMkNtZFVwZGF0ZUJ1ZmZlciIsIldlYkdMMkNtZENvcHlCdWZmZXJUb1RleHR1cmUiLCJjbWRQYWNrYWdlIiwiYmVnaW5SZW5kZXJQYXNzQ21kcyIsImZyZWVDbWRzIiwiYmluZFN0YXRlc0NtZHMiLCJkcmF3Q21kcyIsInVwZGF0ZUJ1ZmZlckNtZHMiLCJjb3B5QnVmZmVyVG9UZXh0dXJlQ21kcyIsInJlbGVhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BWWFBLGlCO0FBTVQsK0JBQWFDLEtBQWIsRUFBZ0NDLEtBQWhDLEVBQStDO0FBQUE7O0FBQUEsV0FKdkNDLE1BSXVDO0FBQUEsV0FIdkNDLFFBR3VDLEdBSHBCLENBR29CO0FBQUEsV0FGdkNDLFNBRXVDO0FBQzNDLFdBQUtGLE1BQUwsR0FBYyxJQUFJRyxLQUFKLENBQVVKLEtBQVYsQ0FBZDtBQUNBLFdBQUtHLFNBQUwsR0FB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QUEsVUFBVSxDQUFDSyxnQkFBWCxDQUE0QmpCLEtBQTVCO0FBQ0g7O0FBRUQsWUFBSVksVUFBVSxDQUFDTSx1QkFBWCxDQUFtQzNCLE1BQXZDLEVBQStDO0FBQzNDLGVBQUtlLDBCQUFMLENBQWdDUSxRQUFoQyxDQUF5Q0YsVUFBVSxDQUFDTSx1QkFBcEQ7QUFDQU4sVUFBQUEsVUFBVSxDQUFDTSx1QkFBWCxDQUFtQ2xCLEtBQW5DO0FBQ0g7O0FBRURZLFFBQUFBLFVBQVUsQ0FBQ2QsSUFBWCxDQUFnQkUsS0FBaEI7QUFDSDs7O29DQUVxQjtBQUNsQixhQUFLRSxzQkFBTCxDQUE0QmlCLE9BQTVCO0FBQ0EsYUFBS2hCLGlCQUFMLENBQXVCZ0IsT0FBdkI7QUFDQSxhQUFLZixXQUFMLENBQWlCZSxPQUFqQjtBQUNBLGFBQUtkLG1CQUFMLENBQXlCYyxPQUF6QjtBQUNBLGFBQUtiLDBCQUFMLENBQWdDYSxPQUFoQztBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FjaGVkQXJyYXkgfSBmcm9tICcuLi8uLi9tZW1vcC9jYWNoZWQtYXJyYXknO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuLi9kZXZpY2UnO1xyXG5pbXBvcnQge1xyXG4gICAgV2ViR0wyQ21kQmVnaW5SZW5kZXJQYXNzLFxyXG4gICAgV2ViR0wyQ21kQmluZFN0YXRlcyxcclxuICAgIFdlYkdMMkNtZENvcHlCdWZmZXJUb1RleHR1cmUsXHJcbiAgICBXZWJHTDJDbWREcmF3LFxyXG4gICAgV2ViR0wyQ21kT2JqZWN0LFxyXG4gICAgV2ViR0wyQ21kUGFja2FnZSxcclxuICAgIFdlYkdMMkNtZFVwZGF0ZUJ1ZmZlcixcclxufSBmcm9tICcuL3dlYmdsMi1jb21tYW5kcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyQ29tbWFuZFBvb2w8VCBleHRlbmRzIFdlYkdMMkNtZE9iamVjdD4ge1xyXG5cclxuICAgIHByaXZhdGUgX2ZyZWVzOiAoVHxudWxsKVtdO1xyXG4gICAgcHJpdmF0ZSBfZnJlZUlkeDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2ZyZWVDbWRzOiBDYWNoZWRBcnJheTxUPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoY2xheno6IG5ldygpID0+IFQsIGNvdW50OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mcmVlcyA9IG5ldyBBcnJheShjb3VudCk7XHJcbiAgICAgICAgdGhpcy5fZnJlZUNtZHMgPSBuZXcgQ2FjaGVkQXJyYXkoY291bnQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mcmVlc1tpXSA9IG5ldyBjbGF6eigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9mcmVlSWR4ID0gY291bnQgLSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICBwdWJsaWMgYWxsb2MgKGNsYXp6OiBuZXcoKSA9PiBUKTogVCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBjbGF6eigpO1xyXG4gICAgfVxyXG4gICAgKi9cclxuXHJcbiAgICBwdWJsaWMgYWxsb2MgKGNsYXp6OiBuZXcoKSA9PiBUKTogVCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyZWVJZHggPCAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLl9mcmVlcy5sZW5ndGggKiAyO1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gdGhpcy5fZnJlZXM7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyZWVzID0gbmV3IEFycmF5PFQ+KHNpemUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5jcmVhc2UgPSBzaXplIC0gdGVtcC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5jcmVhc2U7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnJlZXNbaV0gPSBuZXcgY2xhenooKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGluY3JlYXNlLCBqID0gMDsgaSA8IHNpemU7ICsraSwgKytqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmVlc1tpXSA9IHRlbXBbal07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZyZWVJZHggKz0gaW5jcmVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjbWQgPSB0aGlzLl9mcmVlc1t0aGlzLl9mcmVlSWR4XSE7XHJcbiAgICAgICAgdGhpcy5fZnJlZXNbdGhpcy5fZnJlZUlkeC0tXSA9IG51bGw7XHJcbiAgICAgICAgKytjbWQucmVmQ291bnQ7XHJcbiAgICAgICAgcmV0dXJuIGNtZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJlZSAoY21kOiBUKSB7XHJcbiAgICAgICAgaWYgKC0tY21kLnJlZkNvdW50ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyZWVDbWRzLnB1c2goY21kKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyZWVDbWRzIChjbWRzOiBDYWNoZWRBcnJheTxUPikge1xyXG4gICAgICAgIC8vIHJldHVybiA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbWRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmICgtLWNtZHMuYXJyYXlbaV0ucmVmQ291bnQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyZWVDbWRzLnB1c2goY21kcy5hcnJheVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbGVhc2UgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZnJlZUNtZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgY21kID0gdGhpcy5fZnJlZUNtZHMuYXJyYXlbaV07XHJcbiAgICAgICAgICAgIGNtZC5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9mcmVlc1srK3RoaXMuX2ZyZWVJZHhdID0gY21kO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9mcmVlQ21kcy5jbGVhcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyQ29tbWFuZEFsbG9jYXRvciB7XHJcblxyXG4gICAgcHVibGljIGJlZ2luUmVuZGVyUGFzc0NtZFBvb2w6IFdlYkdMMkNvbW1hbmRQb29sPFdlYkdMMkNtZEJlZ2luUmVuZGVyUGFzcz47XHJcbiAgICBwdWJsaWMgYmluZFN0YXRlc0NtZFBvb2w6IFdlYkdMMkNvbW1hbmRQb29sPFdlYkdMMkNtZEJpbmRTdGF0ZXM+O1xyXG4gICAgcHVibGljIGRyYXdDbWRQb29sOiBXZWJHTDJDb21tYW5kUG9vbDxXZWJHTDJDbWREcmF3PjtcclxuICAgIHB1YmxpYyB1cGRhdGVCdWZmZXJDbWRQb29sOiBXZWJHTDJDb21tYW5kUG9vbDxXZWJHTDJDbWRVcGRhdGVCdWZmZXI+O1xyXG4gICAgcHVibGljIGNvcHlCdWZmZXJUb1RleHR1cmVDbWRQb29sOiBXZWJHTDJDb21tYW5kUG9vbDxXZWJHTDJDbWRDb3B5QnVmZmVyVG9UZXh0dXJlPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5iZWdpblJlbmRlclBhc3NDbWRQb29sID0gbmV3IFdlYkdMMkNvbW1hbmRQb29sKFdlYkdMMkNtZEJlZ2luUmVuZGVyUGFzcywgMSk7XHJcbiAgICAgICAgdGhpcy5iaW5kU3RhdGVzQ21kUG9vbCA9IG5ldyBXZWJHTDJDb21tYW5kUG9vbChXZWJHTDJDbWRCaW5kU3RhdGVzLCAxKTtcclxuICAgICAgICB0aGlzLmRyYXdDbWRQb29sID0gbmV3IFdlYkdMMkNvbW1hbmRQb29sKFdlYkdMMkNtZERyYXcsIDEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnVmZmVyQ21kUG9vbCA9IG5ldyBXZWJHTDJDb21tYW5kUG9vbChXZWJHTDJDbWRVcGRhdGVCdWZmZXIsIDEpO1xyXG4gICAgICAgIHRoaXMuY29weUJ1ZmZlclRvVGV4dHVyZUNtZFBvb2wgPSBuZXcgV2ViR0wyQ29tbWFuZFBvb2woV2ViR0wyQ21kQ29weUJ1ZmZlclRvVGV4dHVyZSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyQ21kcyAoY21kUGFja2FnZTogV2ViR0wyQ21kUGFja2FnZSkge1xyXG5cclxuICAgICAgICBpZiAoY21kUGFja2FnZS5iZWdpblJlbmRlclBhc3NDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmJlZ2luUmVuZGVyUGFzc0NtZFBvb2wuZnJlZUNtZHMoY21kUGFja2FnZS5iZWdpblJlbmRlclBhc3NDbWRzKTtcclxuICAgICAgICAgICAgY21kUGFja2FnZS5iZWdpblJlbmRlclBhc3NDbWRzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY21kUGFja2FnZS5iaW5kU3RhdGVzQ21kcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5iaW5kU3RhdGVzQ21kUG9vbC5mcmVlQ21kcyhjbWRQYWNrYWdlLmJpbmRTdGF0ZXNDbWRzKTtcclxuICAgICAgICAgICAgY21kUGFja2FnZS5iaW5kU3RhdGVzQ21kcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNtZFBhY2thZ2UuZHJhd0NtZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0NtZFBvb2wuZnJlZUNtZHMoY21kUGFja2FnZS5kcmF3Q21kcyk7XHJcbiAgICAgICAgICAgIGNtZFBhY2thZ2UuZHJhd0NtZHMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbWRQYWNrYWdlLnVwZGF0ZUJ1ZmZlckNtZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnVmZmVyQ21kUG9vbC5mcmVlQ21kcyhjbWRQYWNrYWdlLnVwZGF0ZUJ1ZmZlckNtZHMpO1xyXG4gICAgICAgICAgICBjbWRQYWNrYWdlLnVwZGF0ZUJ1ZmZlckNtZHMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbWRQYWNrYWdlLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRQb29sLmZyZWVDbWRzKGNtZFBhY2thZ2UuY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMpO1xyXG4gICAgICAgICAgICBjbWRQYWNrYWdlLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbWRQYWNrYWdlLmNtZHMuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVsZWFzZUNtZHMgKCkge1xyXG4gICAgICAgIHRoaXMuYmVnaW5SZW5kZXJQYXNzQ21kUG9vbC5yZWxlYXNlKCk7XHJcbiAgICAgICAgdGhpcy5iaW5kU3RhdGVzQ21kUG9vbC5yZWxlYXNlKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3Q21kUG9vbC5yZWxlYXNlKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVCdWZmZXJDbWRQb29sLnJlbGVhc2UoKTtcclxuICAgICAgICB0aGlzLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRQb29sLnJlbGVhc2UoKTtcclxuICAgIH1cclxufVxyXG4iXX0=