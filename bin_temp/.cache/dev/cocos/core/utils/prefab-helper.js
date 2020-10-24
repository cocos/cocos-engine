(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../math/index.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../math/index.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.defaultConstants, global.globalExports, global.debug);
    global.prefabHelper = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = syncWithPrefab;
  _exports.PrefabInfo = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var PrefabInfo = (_dec = (0, _index.ccclass)('cc.PrefabInfo'), _dec(_class = (_class2 = (_temp = function PrefabInfo() {
    _classCallCheck(this, PrefabInfo);

    _initializerDefineProperty(this, "root", _descriptor, this);

    _initializerDefineProperty(this, "asset", _descriptor2, this);

    _initializerDefineProperty(this, "fileId", _descriptor3, this);

    _initializerDefineProperty(this, "sync", _descriptor4, this);

    _initializerDefineProperty(this, "_synced", _descriptor5, this);
  } // _instantiate (cloned) {
  //     if (!cloned) {
  //         cloned = new cc._PrefabInfo();
  //     }
  //     cloned.root = this.root;
  //     cloned.asset = this.asset;
  //     cloned.fileId = this.fileId;
  //     cloned.sync = this.sync;
  //     cloned._synced = this._synced;
  //     return cloned;
  // }
  , _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "root", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "asset", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "fileId", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "sync", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_synced", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return {
        "default": false,
        serializable: false
      };
    }
  })), _class2)) || _class);
  _exports.PrefabInfo = PrefabInfo;
  _globalExports.legacyCC._PrefabInfo = PrefabInfo; // update node to make it sync with prefab

  function syncWithPrefab(node) {
    var _prefab = node._prefab; // non-reentrant

    _prefab._synced = true; //

    if (!_prefab.asset) {
      if (_defaultConstants.EDITOR) {// @ts-ignore
        // const NodeUtils = Editor.require('scene://utils/node');
        // // @ts-ignore
        // const PrefabUtils = Editor.require('scene://utils/prefab');
        // // @ts-ignore
        // cc.warn(Editor.T('MESSAGE.prefab.missing_prefab', { node: NodeUtils.getNodePath(node) }));
        // node.name += PrefabUtils.MISSING_PREFAB_SUFFIX;
      } else {
        (0, _debug.errorID)(3701, node.name);
      }

      node._prefab = null;
      return;
    } // save root's preserved props to avoid overwritten by prefab


    var _objFlags = node._objFlags;
    var _parent = node._parent;
    var _id = node._id;
    var _name = node._name;
    var _active = node._active;
    var x = node._position.x;
    var y = node._position.y;
    var _quat = node._quat;
    var _localZOrder = node._localZOrder;
    var _globalZOrder = node._globalZOrder; // instantiate prefab

    _globalExports.legacyCC.game._isCloning = true;

    if (_defaultConstants.SUPPORT_JIT) {
      _prefab.asset._doInstantiate(node);
    } else {
      // root in prefab asset is always synced
      var prefabRoot = _prefab.asset.data;
      prefabRoot._prefab._synced = true; // use node as the instantiated prefabRoot to make references to prefabRoot in prefab redirect to node

      prefabRoot._iN$t = node; // instantiate prefab and apply to node

      _globalExports.legacyCC.instantiate._clone(prefabRoot, prefabRoot);
    }

    _globalExports.legacyCC.game._isCloning = false; // restore preserved props

    node._objFlags = _objFlags;
    node._parent = _parent;
    node._id = _id;
    node._prefab = _prefab;
    node._name = _name;
    node._active = _active;
    node._position.x = x;
    node._position.y = y;

    _index2.Quat.copy(node._quat, _quat);

    node._localZOrder = _localZOrder;
    node._globalZOrder = _globalZOrder;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvcHJlZmFiLWhlbHBlci50cyJdLCJuYW1lcyI6WyJQcmVmYWJJbmZvIiwic2VyaWFsaXphYmxlIiwiZWRpdGFibGUiLCJsZWdhY3lDQyIsIl9QcmVmYWJJbmZvIiwic3luY1dpdGhQcmVmYWIiLCJub2RlIiwiX3ByZWZhYiIsIl9zeW5jZWQiLCJhc3NldCIsIkVESVRPUiIsIm5hbWUiLCJfb2JqRmxhZ3MiLCJfcGFyZW50IiwiX2lkIiwiX25hbWUiLCJfYWN0aXZlIiwieCIsIl9wb3NpdGlvbiIsInkiLCJfcXVhdCIsIl9sb2NhbFpPcmRlciIsIl9nbG9iYWxaT3JkZXIiLCJnYW1lIiwiX2lzQ2xvbmluZyIsIlNVUFBPUlRfSklUIiwiX2RvSW5zdGFudGlhdGUiLCJwcmVmYWJSb290IiwiZGF0YSIsIl9pTiR0IiwiaW5zdGFudGlhdGUiLCJfY2xvbmUiLCJRdWF0IiwiY29weSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWlDYUEsVSxXQURaLG9CQUFRLGVBQVIsQzs7Ozs7Ozs7Ozs7O0lBK0JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7aUZBdENDQyxtQixFQUNBQyxlOzs7OzthQUNhLEk7OzRFQUliRCxtQixFQUNBQyxlOzs7OzthQUNjLEk7OzZFQUdkRCxtQixFQUNBQyxlOzs7OzthQUNlLEU7OzJFQUdmRCxtQixFQUNBQyxlOzs7OzthQUNhLEs7OzhFQUdiRCxtQixFQUNBQyxlOzs7OzthQUNnQjtBQUNiLG1CQUFTLEtBREk7QUFFYkQsUUFBQUEsWUFBWSxFQUFFO0FBRkQsTzs7OztBQWtCckJFLDBCQUFTQyxXQUFULEdBQXVCSixVQUF2QixDLENBRUE7O0FBQ2UsV0FBU0ssY0FBVCxDQUF5QkMsSUFBekIsRUFBK0I7QUFDMUMsUUFBTUMsT0FBTyxHQUFHRCxJQUFJLENBQUNDLE9BQXJCLENBRDBDLENBRTFDOztBQUNBQSxJQUFBQSxPQUFPLENBQUNDLE9BQVIsR0FBa0IsSUFBbEIsQ0FIMEMsQ0FJMUM7O0FBQ0EsUUFBSSxDQUFDRCxPQUFPLENBQUNFLEtBQWIsRUFBb0I7QUFDaEIsVUFBSUMsd0JBQUosRUFBWSxDQUNSO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0gsT0FURCxNQVVLO0FBQ0QsNEJBQVEsSUFBUixFQUFjSixJQUFJLENBQUNLLElBQW5CO0FBQ0g7O0FBQ0RMLE1BQUFBLElBQUksQ0FBQ0MsT0FBTCxHQUFlLElBQWY7QUFDQTtBQUNILEtBckJ5QyxDQXVCMUM7OztBQUNBLFFBQU1LLFNBQVMsR0FBR04sSUFBSSxDQUFDTSxTQUF2QjtBQUNBLFFBQU1DLE9BQU8sR0FBR1AsSUFBSSxDQUFDTyxPQUFyQjtBQUNBLFFBQU1DLEdBQUcsR0FBR1IsSUFBSSxDQUFDUSxHQUFqQjtBQUNBLFFBQU1DLEtBQUssR0FBR1QsSUFBSSxDQUFDUyxLQUFuQjtBQUNBLFFBQU1DLE9BQU8sR0FBR1YsSUFBSSxDQUFDVSxPQUFyQjtBQUNBLFFBQU1DLENBQUMsR0FBR1gsSUFBSSxDQUFDWSxTQUFMLENBQWVELENBQXpCO0FBQ0EsUUFBTUUsQ0FBQyxHQUFHYixJQUFJLENBQUNZLFNBQUwsQ0FBZUMsQ0FBekI7QUFDQSxRQUFNQyxLQUFLLEdBQUdkLElBQUksQ0FBQ2MsS0FBbkI7QUFDQSxRQUFNQyxZQUFZLEdBQUdmLElBQUksQ0FBQ2UsWUFBMUI7QUFDQSxRQUFNQyxhQUFhLEdBQUdoQixJQUFJLENBQUNnQixhQUEzQixDQWpDMEMsQ0FtQzFDOztBQUNBbkIsNEJBQVNvQixJQUFULENBQWNDLFVBQWQsR0FBMkIsSUFBM0I7O0FBQ0EsUUFBSUMsNkJBQUosRUFBaUI7QUFDYmxCLE1BQUFBLE9BQU8sQ0FBQ0UsS0FBUixDQUFjaUIsY0FBZCxDQUE2QnBCLElBQTdCO0FBQ0gsS0FGRCxNQUdLO0FBQ0Q7QUFDQSxVQUFNcUIsVUFBVSxHQUFHcEIsT0FBTyxDQUFDRSxLQUFSLENBQWNtQixJQUFqQztBQUNBRCxNQUFBQSxVQUFVLENBQUNwQixPQUFYLENBQW1CQyxPQUFuQixHQUE2QixJQUE3QixDQUhDLENBS0Q7O0FBQ0FtQixNQUFBQSxVQUFVLENBQUNFLEtBQVgsR0FBbUJ2QixJQUFuQixDQU5DLENBUUQ7O0FBQ0FILDhCQUFTMkIsV0FBVCxDQUFxQkMsTUFBckIsQ0FBNEJKLFVBQTVCLEVBQXdDQSxVQUF4QztBQUNIOztBQUNEeEIsNEJBQVNvQixJQUFULENBQWNDLFVBQWQsR0FBMkIsS0FBM0IsQ0FuRDBDLENBcUQxQzs7QUFDQWxCLElBQUFBLElBQUksQ0FBQ00sU0FBTCxHQUFpQkEsU0FBakI7QUFDQU4sSUFBQUEsSUFBSSxDQUFDTyxPQUFMLEdBQWVBLE9BQWY7QUFDQVAsSUFBQUEsSUFBSSxDQUFDUSxHQUFMLEdBQVdBLEdBQVg7QUFDQVIsSUFBQUEsSUFBSSxDQUFDQyxPQUFMLEdBQWVBLE9BQWY7QUFDQUQsSUFBQUEsSUFBSSxDQUFDUyxLQUFMLEdBQWFBLEtBQWI7QUFDQVQsSUFBQUEsSUFBSSxDQUFDVSxPQUFMLEdBQWVBLE9BQWY7QUFDQVYsSUFBQUEsSUFBSSxDQUFDWSxTQUFMLENBQWVELENBQWYsR0FBbUJBLENBQW5CO0FBQ0FYLElBQUFBLElBQUksQ0FBQ1ksU0FBTCxDQUFlQyxDQUFmLEdBQW1CQSxDQUFuQjs7QUFDQWEsaUJBQUtDLElBQUwsQ0FBVTNCLElBQUksQ0FBQ2MsS0FBZixFQUFzQkEsS0FBdEI7O0FBQ0FkLElBQUFBLElBQUksQ0FBQ2UsWUFBTCxHQUFvQkEsWUFBcEI7QUFDQWYsSUFBQUEsSUFBSSxDQUFDZ0IsYUFBTCxHQUFxQkEsYUFBckI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBRdWF0IH0gZnJvbSAnLi4vbWF0aCc7XHJcbmltcG9ydCB7IEVESVRPUiwgU1VQUE9SVF9KSVQgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgZXJyb3JJRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbkBjY2NsYXNzKCdjYy5QcmVmYWJJbmZvJylcclxuZXhwb3J0IGNsYXNzIFByZWZhYkluZm8ge1xyXG4gICAgLy8gdGhlIG1vc3QgdG9wIG5vZGUgb2YgdGhpcyBwcmVmYWIgaW4gdGhlIHNjZW5lXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyByb290ID0gbnVsbDtcclxuXHJcbiAgICAvLyDmiYDlsZ7nmoQgcHJlZmFiIOi1hOa6kOWvueixoSAoY2MuUHJlZmFiKVxyXG4gICAgLy8gSW4gRWRpdG9yLCBvbmx5IGFzc2V0Ll91dWlkIGlzIHVzYWJsZSBiZWNhdXNlIGFzc2V0IHdpbGwgYmUgY2hhbmdlZC5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIGFzc2V0ID0gbnVsbDtcclxuXHJcbiAgICAvLyDnlKjmnaXmoIfor4bliKvor6XoioLngrnlnKggcHJlZmFiIOi1hOa6kOS4reeahOS9jee9ru+8jOWboOatpOi/meS4qiBJRCDlj6rpnIDopoHkv53or4HlnKggQXNzZXRzIOmHjOS4jemHjeWkjeWwseihjFxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgZmlsZUlkID0gJyc7XHJcblxyXG4gICAgLy8gSW5kaWNhdGVzIHdoZXRoZXIgdGhpcyBub2RlIHNob3VsZCBhbHdheXMgc3luY2hyb25pemUgd2l0aCB0aGUgcHJlZmFiIGFzc2V0LCBvbmx5IGF2YWlsYWJsZSBpbiB0aGUgcm9vdCBub2RlXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBzeW5jID0gZmFsc2U7XHJcblxyXG4gICAgLy8gSW5kaWNhdGVzIHdoZXRoZXIgdGhpcyBub2RlIGlzIHN5bmNocm9uaXplZCwgb25seSBhdmFpbGFibGUgaW4gdGhlIHJvb3Qgbm9kZVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgX3N5bmNlZCA9IHtcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBfaW5zdGFudGlhdGUgKGNsb25lZCkge1xyXG4gICAgLy8gICAgIGlmICghY2xvbmVkKSB7XHJcbiAgICAvLyAgICAgICAgIGNsb25lZCA9IG5ldyBjYy5fUHJlZmFiSW5mbygpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBjbG9uZWQucm9vdCA9IHRoaXMucm9vdDtcclxuICAgIC8vICAgICBjbG9uZWQuYXNzZXQgPSB0aGlzLmFzc2V0O1xyXG4gICAgLy8gICAgIGNsb25lZC5maWxlSWQgPSB0aGlzLmZpbGVJZDtcclxuICAgIC8vICAgICBjbG9uZWQuc3luYyA9IHRoaXMuc3luYztcclxuICAgIC8vICAgICBjbG9uZWQuX3N5bmNlZCA9IHRoaXMuX3N5bmNlZDtcclxuICAgIC8vICAgICByZXR1cm4gY2xvbmVkO1xyXG4gICAgLy8gfVxyXG59XHJcblxyXG5sZWdhY3lDQy5fUHJlZmFiSW5mbyA9IFByZWZhYkluZm87XHJcblxyXG4vLyB1cGRhdGUgbm9kZSB0byBtYWtlIGl0IHN5bmMgd2l0aCBwcmVmYWJcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3luY1dpdGhQcmVmYWIgKG5vZGUpIHtcclxuICAgIGNvbnN0IF9wcmVmYWIgPSBub2RlLl9wcmVmYWI7XHJcbiAgICAvLyBub24tcmVlbnRyYW50XHJcbiAgICBfcHJlZmFiLl9zeW5jZWQgPSB0cnVlO1xyXG4gICAgLy9cclxuICAgIGlmICghX3ByZWZhYi5hc3NldCkge1xyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAvLyBjb25zdCBOb2RlVXRpbHMgPSBFZGl0b3IucmVxdWlyZSgnc2NlbmU6Ly91dGlscy9ub2RlJyk7XHJcbiAgICAgICAgICAgIC8vIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gY29uc3QgUHJlZmFiVXRpbHMgPSBFZGl0b3IucmVxdWlyZSgnc2NlbmU6Ly91dGlscy9wcmVmYWInKTtcclxuXHJcbiAgICAgICAgICAgIC8vIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gY2Mud2FybihFZGl0b3IuVCgnTUVTU0FHRS5wcmVmYWIubWlzc2luZ19wcmVmYWInLCB7IG5vZGU6IE5vZGVVdGlscy5nZXROb2RlUGF0aChub2RlKSB9KSk7XHJcbiAgICAgICAgICAgIC8vIG5vZGUubmFtZSArPSBQcmVmYWJVdGlscy5NSVNTSU5HX1BSRUZBQl9TVUZGSVg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvcklEKDM3MDEsIG5vZGUubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuX3ByZWZhYiA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNhdmUgcm9vdCdzIHByZXNlcnZlZCBwcm9wcyB0byBhdm9pZCBvdmVyd3JpdHRlbiBieSBwcmVmYWJcclxuICAgIGNvbnN0IF9vYmpGbGFncyA9IG5vZGUuX29iakZsYWdzO1xyXG4gICAgY29uc3QgX3BhcmVudCA9IG5vZGUuX3BhcmVudDtcclxuICAgIGNvbnN0IF9pZCA9IG5vZGUuX2lkO1xyXG4gICAgY29uc3QgX25hbWUgPSBub2RlLl9uYW1lO1xyXG4gICAgY29uc3QgX2FjdGl2ZSA9IG5vZGUuX2FjdGl2ZTtcclxuICAgIGNvbnN0IHggPSBub2RlLl9wb3NpdGlvbi54O1xyXG4gICAgY29uc3QgeSA9IG5vZGUuX3Bvc2l0aW9uLnk7XHJcbiAgICBjb25zdCBfcXVhdCA9IG5vZGUuX3F1YXQ7XHJcbiAgICBjb25zdCBfbG9jYWxaT3JkZXIgPSBub2RlLl9sb2NhbFpPcmRlcjtcclxuICAgIGNvbnN0IF9nbG9iYWxaT3JkZXIgPSBub2RlLl9nbG9iYWxaT3JkZXI7XHJcblxyXG4gICAgLy8gaW5zdGFudGlhdGUgcHJlZmFiXHJcbiAgICBsZWdhY3lDQy5nYW1lLl9pc0Nsb25pbmcgPSB0cnVlO1xyXG4gICAgaWYgKFNVUFBPUlRfSklUKSB7XHJcbiAgICAgICAgX3ByZWZhYi5hc3NldC5fZG9JbnN0YW50aWF0ZShub2RlKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIHJvb3QgaW4gcHJlZmFiIGFzc2V0IGlzIGFsd2F5cyBzeW5jZWRcclxuICAgICAgICBjb25zdCBwcmVmYWJSb290ID0gX3ByZWZhYi5hc3NldC5kYXRhO1xyXG4gICAgICAgIHByZWZhYlJvb3QuX3ByZWZhYi5fc3luY2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gdXNlIG5vZGUgYXMgdGhlIGluc3RhbnRpYXRlZCBwcmVmYWJSb290IHRvIG1ha2UgcmVmZXJlbmNlcyB0byBwcmVmYWJSb290IGluIHByZWZhYiByZWRpcmVjdCB0byBub2RlXHJcbiAgICAgICAgcHJlZmFiUm9vdC5faU4kdCA9IG5vZGU7XHJcblxyXG4gICAgICAgIC8vIGluc3RhbnRpYXRlIHByZWZhYiBhbmQgYXBwbHkgdG8gbm9kZVxyXG4gICAgICAgIGxlZ2FjeUNDLmluc3RhbnRpYXRlLl9jbG9uZShwcmVmYWJSb290LCBwcmVmYWJSb290KTtcclxuICAgIH1cclxuICAgIGxlZ2FjeUNDLmdhbWUuX2lzQ2xvbmluZyA9IGZhbHNlO1xyXG5cclxuICAgIC8vIHJlc3RvcmUgcHJlc2VydmVkIHByb3BzXHJcbiAgICBub2RlLl9vYmpGbGFncyA9IF9vYmpGbGFncztcclxuICAgIG5vZGUuX3BhcmVudCA9IF9wYXJlbnQ7XHJcbiAgICBub2RlLl9pZCA9IF9pZDtcclxuICAgIG5vZGUuX3ByZWZhYiA9IF9wcmVmYWI7XHJcbiAgICBub2RlLl9uYW1lID0gX25hbWU7XHJcbiAgICBub2RlLl9hY3RpdmUgPSBfYWN0aXZlO1xyXG4gICAgbm9kZS5fcG9zaXRpb24ueCA9IHg7XHJcbiAgICBub2RlLl9wb3NpdGlvbi55ID0geTtcclxuICAgIFF1YXQuY29weShub2RlLl9xdWF0LCBfcXVhdCk7XHJcbiAgICBub2RlLl9sb2NhbFpPcmRlciA9IF9sb2NhbFpPcmRlcjtcclxuICAgIG5vZGUuX2dsb2JhbFpPcmRlciA9IF9nbG9iYWxaT3JkZXI7XHJcbn1cclxuIl19