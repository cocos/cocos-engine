(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/index.js", "../core/memory-pools.js", "../core/program-lib.js", "../../pipeline/define.js", "../../global-exports.js", "../../assets/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/index.js"), require("../core/memory-pools.js"), require("../core/program-lib.js"), require("../../pipeline/define.js"), require("../../global-exports.js"), require("../../assets/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.memoryPools, global.programLib, global.define, global.globalExports, global.index);
    global.uiDrawBatch = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _memoryPools, _programLib, _define, _globalExports, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIDrawBatch = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _dsInfo = new _index.GFXDescriptorSetInfo(null);

  var UIDrawBatch = /*#__PURE__*/function () {
    function UIDrawBatch() {
      _classCallCheck(this, UIDrawBatch);

      this.bufferBatch = null;
      this.camera = null;
      this.model = null;
      this.material = null;
      this.texture = null;
      this.sampler = null;
      this.hInputAssembler = _memoryPools.NULL_HANDLE;
      this.hDescriptorSet = _memoryPools.NULL_HANDLE;
      this.useLocalData = null;
      this.isStatic = false;
      var root = _globalExports.legacyCC.director.root;

      var programName = _index2.EffectAsset.get('builtin-sprite').shaders[0].name;

      _programLib.programLib.getGFXShader(root.device, programName, {
        USE_TEXTURE: true
      }, root.pipeline);

      _dsInfo.layout = _programLib.programLib.getPipelineLayout(programName).setLayouts[_define.SetIndex.LOCAL];
      this.hDescriptorSet = _memoryPools.DSPool.alloc(root.device, _dsInfo);
    }

    _createClass(UIDrawBatch, [{
      key: "destroy",
      value: function destroy(ui) {
        if (this.hDescriptorSet) {
          _memoryPools.DSPool.free(this.hDescriptorSet);

          this.hDescriptorSet = _memoryPools.NULL_HANDLE;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this.bufferBatch = null;
        this.hInputAssembler = _memoryPools.NULL_HANDLE;
        this.camera = null;
        this.material = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
      }
    }]);

    return UIDrawBatch;
  }();

  _exports.UIDrawBatch = UIDrawBatch;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvdWkvdWktZHJhdy1iYXRjaC50cyJdLCJuYW1lcyI6WyJfZHNJbmZvIiwiR0ZYRGVzY3JpcHRvclNldEluZm8iLCJVSURyYXdCYXRjaCIsImJ1ZmZlckJhdGNoIiwiY2FtZXJhIiwibW9kZWwiLCJtYXRlcmlhbCIsInRleHR1cmUiLCJzYW1wbGVyIiwiaElucHV0QXNzZW1ibGVyIiwiTlVMTF9IQU5ETEUiLCJoRGVzY3JpcHRvclNldCIsInVzZUxvY2FsRGF0YSIsImlzU3RhdGljIiwicm9vdCIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJwcm9ncmFtTmFtZSIsIkVmZmVjdEFzc2V0IiwiZ2V0Iiwic2hhZGVycyIsIm5hbWUiLCJwcm9ncmFtTGliIiwiZ2V0R0ZYU2hhZGVyIiwiZGV2aWNlIiwiVVNFX1RFWFRVUkUiLCJwaXBlbGluZSIsImxheW91dCIsImdldFBpcGVsaW5lTGF5b3V0Iiwic2V0TGF5b3V0cyIsIlNldEluZGV4IiwiTE9DQUwiLCJEU1Bvb2wiLCJhbGxvYyIsInVpIiwiZnJlZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsTUFBTUEsT0FBTyxHQUFHLElBQUlDLDJCQUFKLENBQXlCLElBQXpCLENBQWhCOztNQUVhQyxXO0FBYVQsMkJBQWU7QUFBQTs7QUFBQSxXQVhSQyxXQVdRLEdBWHlCLElBV3pCO0FBQUEsV0FWUkMsTUFVUSxHQVZnQixJQVVoQjtBQUFBLFdBVFJDLEtBU1EsR0FUYyxJQVNkO0FBQUEsV0FSUkMsUUFRUSxHQVJvQixJQVFwQjtBQUFBLFdBUFJDLE9BT1EsR0FQcUIsSUFPckI7QUFBQSxXQU5SQyxPQU1RLEdBTnFCLElBTXJCO0FBQUEsV0FMUkMsZUFLUSxHQUxnQ0Msd0JBS2hDO0FBQUEsV0FKUkMsY0FJUSxHQUo4QkQsd0JBSTlCO0FBQUEsV0FIUkUsWUFHUSxHQUhvQixJQUdwQjtBQUFBLFdBRlJDLFFBRVEsR0FGRyxLQUVIO0FBQ1gsVUFBTUMsSUFBSSxHQUFHQyx3QkFBU0MsUUFBVCxDQUFrQkYsSUFBL0I7O0FBRUEsVUFBTUcsV0FBVyxHQUFHQyxvQkFBWUMsR0FBWixDQUFnQixnQkFBaEIsRUFBbUNDLE9BQW5DLENBQTJDLENBQTNDLEVBQThDQyxJQUFsRTs7QUFDQUMsNkJBQVdDLFlBQVgsQ0FBd0JULElBQUksQ0FBQ1UsTUFBN0IsRUFBcUNQLFdBQXJDLEVBQWtEO0FBQUVRLFFBQUFBLFdBQVcsRUFBRTtBQUFmLE9BQWxELEVBQXlFWCxJQUFJLENBQUNZLFFBQTlFOztBQUNBMUIsTUFBQUEsT0FBTyxDQUFDMkIsTUFBUixHQUFpQkwsdUJBQVdNLGlCQUFYLENBQTZCWCxXQUE3QixFQUEwQ1ksVUFBMUMsQ0FBcURDLGlCQUFTQyxLQUE5RCxDQUFqQjtBQUNBLFdBQUtwQixjQUFMLEdBQXNCcUIsb0JBQU9DLEtBQVAsQ0FBYW5CLElBQUksQ0FBQ1UsTUFBbEIsRUFBMEJ4QixPQUExQixDQUF0QjtBQUNIOzs7OzhCQUVla0MsRSxFQUFRO0FBQ3BCLFlBQUksS0FBS3ZCLGNBQVQsRUFBeUI7QUFDckJxQiw4QkFBT0csSUFBUCxDQUFZLEtBQUt4QixjQUFqQjs7QUFDQSxlQUFLQSxjQUFMLEdBQXNCRCx3QkFBdEI7QUFDSDtBQUNKOzs7OEJBRWU7QUFDWixhQUFLUCxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsYUFBS00sZUFBTCxHQUF1QkMsd0JBQXZCO0FBQ0EsYUFBS04sTUFBTCxHQUFjLElBQWQ7QUFDQSxhQUFLRSxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxhQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLGFBQUtILEtBQUwsR0FBYSxJQUFiO0FBQ0EsYUFBS1EsUUFBTCxHQUFnQixLQUFoQjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBNZXNoQnVmZmVyIH0gZnJvbSAnLi4vLi4vLi4vdWknO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tYXRlcmlhbCc7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUsIEdGWFNhbXBsZXIsIEdGWERlc2NyaXB0b3JTZXRJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4JztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSAnLi4vc2NlbmUvY2FtZXJhJztcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuLi9zY2VuZS9tb2RlbCc7XHJcbmltcG9ydCB7IFVJIH0gZnJvbSAnLi91aSc7XHJcbmltcG9ydCB7IElucHV0QXNzZW1ibGVySGFuZGxlLCBEZXNjcmlwdG9yU2V0SGFuZGxlLCBOVUxMX0hBTkRMRSwgRFNQb29sIH0gZnJvbSAnLi4vY29yZS9tZW1vcnktcG9vbHMnO1xyXG5pbXBvcnQgeyBwcm9ncmFtTGliIH0gZnJvbSAnLi4vY29yZS9wcm9ncmFtLWxpYic7XHJcbmltcG9ydCB7IFNldEluZGV4IH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvZGVmaW5lJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IEVmZmVjdEFzc2V0IH0gZnJvbSAnLi4vLi4vYXNzZXRzJztcclxuXHJcbmNvbnN0IF9kc0luZm8gPSBuZXcgR0ZYRGVzY3JpcHRvclNldEluZm8obnVsbCEpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVJRHJhd0JhdGNoIHtcclxuXHJcbiAgICBwdWJsaWMgYnVmZmVyQmF0Y2g6IE1lc2hCdWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBjYW1lcmE6IENhbWVyYSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG1vZGVsOiBNb2RlbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG1hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHRleHR1cmU6IEdGWFRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBzYW1wbGVyOiBHRlhTYW1wbGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgaElucHV0QXNzZW1ibGVyOiBJbnB1dEFzc2VtYmxlckhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgcHVibGljIGhEZXNjcmlwdG9yU2V0OiBEZXNjcmlwdG9yU2V0SGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcbiAgICBwdWJsaWMgdXNlTG9jYWxEYXRhOiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgaXNTdGF0aWMgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3Q7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2dyYW1OYW1lID0gRWZmZWN0QXNzZXQuZ2V0KCdidWlsdGluLXNwcml0ZScpIS5zaGFkZXJzWzBdLm5hbWU7XHJcbiAgICAgICAgcHJvZ3JhbUxpYi5nZXRHRlhTaGFkZXIocm9vdC5kZXZpY2UsIHByb2dyYW1OYW1lLCB7IFVTRV9URVhUVVJFOiB0cnVlIH0sIHJvb3QucGlwZWxpbmUpO1xyXG4gICAgICAgIF9kc0luZm8ubGF5b3V0ID0gcHJvZ3JhbUxpYi5nZXRQaXBlbGluZUxheW91dChwcm9ncmFtTmFtZSkuc2V0TGF5b3V0c1tTZXRJbmRleC5MT0NBTF07XHJcbiAgICAgICAgdGhpcy5oRGVzY3JpcHRvclNldCA9IERTUG9vbC5hbGxvYyhyb290LmRldmljZSwgX2RzSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKHVpOiBVSSkge1xyXG4gICAgICAgIGlmICh0aGlzLmhEZXNjcmlwdG9yU2V0KSB7XHJcbiAgICAgICAgICAgIERTUG9vbC5mcmVlKHRoaXMuaERlc2NyaXB0b3JTZXQpO1xyXG4gICAgICAgICAgICB0aGlzLmhEZXNjcmlwdG9yU2V0ID0gTlVMTF9IQU5ETEU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5idWZmZXJCYXRjaCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5oSW5wdXRBc3NlbWJsZXIgPSBOVUxMX0hBTkRMRTtcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5tYXRlcmlhbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNhbXBsZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaXNTdGF0aWMgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG4iXX0=