(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/object.js", "../utils/js.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/object.js"), require("../utils/js.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.object, global.js, global.defaultConstants, global.globalExports, global.debug);
    global.baseNodeDev = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _object, js, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.baseNodePolyfill = baseNodePolyfill;
  js = _interopRequireWildcard(js);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var Destroying = _object.CCObject.Flags.Destroying;

  function baseNodePolyfill(BaseNode) {
    if (_defaultConstants.EDITOR) {
      BaseNode.prototype._checkMultipleComp = function (ctor) {
        var existing = this.getComponent(ctor._disallowMultiple);

        if (existing) {
          if (existing.constructor === ctor) {
            throw Error((0, _debug.getError)(3805, js.getClassName(ctor), this._name));
          } else {
            throw Error((0, _debug.getError)(3806, js.getClassName(ctor), this._name, js.getClassName(existing)));
          }
        }

        return true;
      };
      /**
       * This api should only used by undo system
       * @method _addComponentAt
       * @param {Component} comp
       * @param {Number} index
       */


      BaseNode.prototype._addComponentAt = function (comp, index) {
        if (this._objFlags & Destroying) {
          return (0, _debug.error)('isDestroying');
        }

        if (!(comp instanceof _globalExports.legacyCC.Component)) {
          return (0, _debug.errorID)(3811);
        }

        if (index > this._components.length) {
          return (0, _debug.errorID)(3812);
        } // recheck attributes because script may changed


        var ctor = comp.constructor;

        if (ctor._disallowMultiple) {
          if (!this._checkMultipleComp(ctor)) {
            return;
          }
        } // remove dependency and return directly by editor
        // const ReqComp = ctor._requireComponent;
        // if (ReqComp && !this.getComponent(ReqComp)) {
        //     if (index === this._components.length) {
        //         // If comp should be last component, increase the index because required component added
        //         ++index;
        //     }
        //     const depended = this.addComponent(ReqComp);
        //     if (!depended) {
        //         // depend conflicts
        //         return null;
        //     }
        // }


        comp.node = this;

        this._components.splice(index, 0, comp);

        if ((_defaultConstants.EDITOR || _defaultConstants.TEST) && _globalExports.legacyCC.engine && this._id in _globalExports.legacyCC.engine.attachedObjsForEditor) {
          _globalExports.legacyCC.engine.attachedObjsForEditor[comp._id] = comp;
        }

        if (this._activeInHierarchy) {
          _globalExports.legacyCC.director._nodeActivator.activateComp(comp);
        }
      };
      /**
       * @method _getDependComponent
       * @param {Component} depended
       * @return {Component}
       */


      BaseNode.prototype._getDependComponent = function (depended) {
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < this._components.length; i++) {
          var comp = this._components[i];

          if (comp !== depended && comp.isValid && !_globalExports.legacyCC.Object._willDestroy(comp)) {
            var depend = comp.constructor._requireComponent;

            if (depend && depended instanceof depend) {
              return comp;
            }
          }
        }

        return null;
      };

      BaseNode.prototype.onRestore = function () {
        // check activity state
        var shouldActiveNow = this._active && !!(this._parent && this._parent._activeInHierarchy);

        if (this._activeInHierarchy !== shouldActiveNow) {
          _globalExports.legacyCC.director._nodeActivator.activateNode(this, shouldActiveNow);
        }
      };

      BaseNode.prototype._onPreDestroy = function () {
        var destroyByParent = this._onPreDestroyBase();

        if (!destroyByParent) {
          // ensure this node can reattach to scene by undo system
          // (simulate some destruct logic to make undo system work correctly)
          this._parent = null;
        }

        return destroyByParent;
      };

      BaseNode.prototype._onRestoreBase = BaseNode.prototype.onRestore;
    }

    if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
      BaseNode.prototype._registerIfAttached = function (register) {
        var attachedObjsForEditor = _globalExports.legacyCC.engine.attachedObjsForEditor;

        if (register) {
          attachedObjsForEditor[this._id] = this;

          for (var i = this._components.length - 1; i >= 0; i--) {
            var comp = this._components[i];

            if (!comp) {
              this._components.splice(i, 1);

              console.error('component attached to node:' + this.name + ' is invalid for some reason');
              continue;
            }

            attachedObjsForEditor[comp._id] = comp;
          }

          _globalExports.legacyCC.engine.emit('node-attach-to-scene', this);
        } else {
          _globalExports.legacyCC.engine.emit('node-detach-from-scene', this);

          delete attachedObjsForEditor[this._id];

          var _iterator = _createForOfIteratorHelper(this._components),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _comp = _step.value;
              delete attachedObjsForEditor[_comp._id];
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        var children = this._children;

        for (var _i = 0, len = children.length; _i < len; ++_i) {
          var child = children[_i];

          child._registerIfAttached(register);
        }
      };
    }

    if (_defaultConstants.DEV) {
      // promote debug info
      js.get(BaseNode.prototype, ' INFO ', function () {
        var path = ''; // @ts-ignore

        var node = this;

        while (node && !(node instanceof _globalExports.legacyCC.Scene)) {
          if (path) {
            path = node.name + '/' + path;
          } else {
            path = node.name;
          }

          node = node._parent;
        } // @ts-ignore


        return this.name + ', path: ' + path;
      });
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvYmFzZS1ub2RlLWRldi50cyJdLCJuYW1lcyI6WyJEZXN0cm95aW5nIiwiQ0NPYmplY3QiLCJGbGFncyIsImJhc2VOb2RlUG9seWZpbGwiLCJCYXNlTm9kZSIsIkVESVRPUiIsInByb3RvdHlwZSIsIl9jaGVja011bHRpcGxlQ29tcCIsImN0b3IiLCJleGlzdGluZyIsImdldENvbXBvbmVudCIsIl9kaXNhbGxvd011bHRpcGxlIiwiY29uc3RydWN0b3IiLCJFcnJvciIsImpzIiwiZ2V0Q2xhc3NOYW1lIiwiX25hbWUiLCJfYWRkQ29tcG9uZW50QXQiLCJjb21wIiwiaW5kZXgiLCJfb2JqRmxhZ3MiLCJsZWdhY3lDQyIsIkNvbXBvbmVudCIsIl9jb21wb25lbnRzIiwibGVuZ3RoIiwibm9kZSIsInNwbGljZSIsIlRFU1QiLCJlbmdpbmUiLCJfaWQiLCJhdHRhY2hlZE9ianNGb3JFZGl0b3IiLCJfYWN0aXZlSW5IaWVyYXJjaHkiLCJkaXJlY3RvciIsIl9ub2RlQWN0aXZhdG9yIiwiYWN0aXZhdGVDb21wIiwiX2dldERlcGVuZENvbXBvbmVudCIsImRlcGVuZGVkIiwiaSIsImlzVmFsaWQiLCJPYmplY3QiLCJfd2lsbERlc3Ryb3kiLCJkZXBlbmQiLCJfcmVxdWlyZUNvbXBvbmVudCIsIm9uUmVzdG9yZSIsInNob3VsZEFjdGl2ZU5vdyIsIl9hY3RpdmUiLCJfcGFyZW50IiwiYWN0aXZhdGVOb2RlIiwiX29uUHJlRGVzdHJveSIsImRlc3Ryb3lCeVBhcmVudCIsIl9vblByZURlc3Ryb3lCYXNlIiwiX29uUmVzdG9yZUJhc2UiLCJfcmVnaXN0ZXJJZkF0dGFjaGVkIiwicmVnaXN0ZXIiLCJjb25zb2xlIiwiZXJyb3IiLCJuYW1lIiwiZW1pdCIsImNoaWxkcmVuIiwiX2NoaWxkcmVuIiwibGVuIiwiY2hpbGQiLCJERVYiLCJnZXQiLCJwYXRoIiwiU2NlbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0EsTUFBTUEsVUFBVSxHQUFHQyxpQkFBU0MsS0FBVCxDQUFlRixVQUFsQzs7QUFFTyxXQUFTRyxnQkFBVCxDQUEyQkMsUUFBM0IsRUFBcUM7QUFDeEMsUUFBSUMsd0JBQUosRUFBWTtBQUNSRCxNQUFBQSxRQUFRLENBQUNFLFNBQVQsQ0FBbUJDLGtCQUFuQixHQUF3QyxVQUFVQyxJQUFWLEVBQWdCO0FBQ3BELFlBQU1DLFFBQVEsR0FBRyxLQUFLQyxZQUFMLENBQWtCRixJQUFJLENBQUNHLGlCQUF2QixDQUFqQjs7QUFDQSxZQUFJRixRQUFKLEVBQWM7QUFDVixjQUFJQSxRQUFRLENBQUNHLFdBQVQsS0FBeUJKLElBQTdCLEVBQW1DO0FBQy9CLGtCQUFNSyxLQUFLLENBQUMscUJBQVMsSUFBVCxFQUFlQyxFQUFFLENBQUNDLFlBQUgsQ0FBZ0JQLElBQWhCLENBQWYsRUFBc0MsS0FBS1EsS0FBM0MsQ0FBRCxDQUFYO0FBQ0gsV0FGRCxNQUVPO0FBQ0gsa0JBQU1ILEtBQUssQ0FBQyxxQkFBUyxJQUFULEVBQWVDLEVBQUUsQ0FBQ0MsWUFBSCxDQUFnQlAsSUFBaEIsQ0FBZixFQUFzQyxLQUFLUSxLQUEzQyxFQUFrREYsRUFBRSxDQUFDQyxZQUFILENBQWdCTixRQUFoQixDQUFsRCxDQUFELENBQVg7QUFDSDtBQUNKOztBQUNELGVBQU8sSUFBUDtBQUNILE9BVkQ7QUFZQTs7Ozs7Ozs7QUFNQUwsTUFBQUEsUUFBUSxDQUFDRSxTQUFULENBQW1CVyxlQUFuQixHQUFxQyxVQUFVQyxJQUFWLEVBQWdCQyxLQUFoQixFQUF1QjtBQUN4RCxZQUFJLEtBQUtDLFNBQUwsR0FBaUJwQixVQUFyQixFQUFpQztBQUM3QixpQkFBTyxrQkFBTSxjQUFOLENBQVA7QUFDSDs7QUFDRCxZQUFJLEVBQUVrQixJQUFJLFlBQVlHLHdCQUFTQyxTQUEzQixDQUFKLEVBQTJDO0FBQ3ZDLGlCQUFPLG9CQUFRLElBQVIsQ0FBUDtBQUNIOztBQUNELFlBQUlILEtBQUssR0FBRyxLQUFLSSxXQUFMLENBQWlCQyxNQUE3QixFQUFxQztBQUNqQyxpQkFBTyxvQkFBUSxJQUFSLENBQVA7QUFDSCxTQVR1RCxDQVd4RDs7O0FBQ0EsWUFBTWhCLElBQUksR0FBR1UsSUFBSSxDQUFDTixXQUFsQjs7QUFDQSxZQUFJSixJQUFJLENBQUNHLGlCQUFULEVBQTRCO0FBQ3hCLGNBQUksQ0FBQyxLQUFLSixrQkFBTCxDQUF3QkMsSUFBeEIsQ0FBTCxFQUFvQztBQUNoQztBQUNIO0FBQ0osU0FqQnVELENBbUJ4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUFVLFFBQUFBLElBQUksQ0FBQ08sSUFBTCxHQUFZLElBQVo7O0FBQ0EsYUFBS0YsV0FBTCxDQUFpQkcsTUFBakIsQ0FBd0JQLEtBQXhCLEVBQStCLENBQS9CLEVBQWtDRCxJQUFsQzs7QUFDQSxZQUFJLENBQUNiLDRCQUFVc0Isc0JBQVgsS0FBb0JOLHdCQUFTTyxNQUE3QixJQUF3QyxLQUFLQyxHQUFMLElBQVlSLHdCQUFTTyxNQUFULENBQWdCRSxxQkFBeEUsRUFBZ0c7QUFDNUZULGtDQUFTTyxNQUFULENBQWdCRSxxQkFBaEIsQ0FBc0NaLElBQUksQ0FBQ1csR0FBM0MsSUFBa0RYLElBQWxEO0FBQ0g7O0FBQ0QsWUFBSSxLQUFLYSxrQkFBVCxFQUE2QjtBQUN6QlYsa0NBQVNXLFFBQVQsQ0FBa0JDLGNBQWxCLENBQWlDQyxZQUFqQyxDQUE4Q2hCLElBQTlDO0FBQ0g7QUFDSixPQXpDRDtBQTJDQTs7Ozs7OztBQUtBZCxNQUFBQSxRQUFRLENBQUNFLFNBQVQsQ0FBbUI2QixtQkFBbkIsR0FBeUMsVUFBVUMsUUFBVixFQUFvQjtBQUN6RDtBQUNBLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLZCxXQUFMLENBQWlCQyxNQUFyQyxFQUE2Q2EsQ0FBQyxFQUE5QyxFQUFrRDtBQUM5QyxjQUFNbkIsSUFBSSxHQUFHLEtBQUtLLFdBQUwsQ0FBaUJjLENBQWpCLENBQWI7O0FBQ0EsY0FBSW5CLElBQUksS0FBS2tCLFFBQVQsSUFBcUJsQixJQUFJLENBQUNvQixPQUExQixJQUFxQyxDQUFDakIsd0JBQVNrQixNQUFULENBQWdCQyxZQUFoQixDQUE2QnRCLElBQTdCLENBQTFDLEVBQThFO0FBQzFFLGdCQUFNdUIsTUFBTSxHQUFHdkIsSUFBSSxDQUFDTixXQUFMLENBQWlCOEIsaUJBQWhDOztBQUNBLGdCQUFJRCxNQUFNLElBQUlMLFFBQVEsWUFBWUssTUFBbEMsRUFBMEM7QUFDdEMscUJBQU92QixJQUFQO0FBQ0g7QUFDSjtBQUNKOztBQUNELGVBQU8sSUFBUDtBQUNILE9BWkQ7O0FBY0FkLE1BQUFBLFFBQVEsQ0FBQ0UsU0FBVCxDQUFtQnFDLFNBQW5CLEdBQStCLFlBQVk7QUFDdkM7QUFDQSxZQUFNQyxlQUFlLEdBQUcsS0FBS0MsT0FBTCxJQUFnQixDQUFDLEVBQUUsS0FBS0MsT0FBTCxJQUFnQixLQUFLQSxPQUFMLENBQWFmLGtCQUEvQixDQUF6Qzs7QUFDQSxZQUFJLEtBQUtBLGtCQUFMLEtBQTRCYSxlQUFoQyxFQUFpRDtBQUM3Q3ZCLGtDQUFTVyxRQUFULENBQWtCQyxjQUFsQixDQUFpQ2MsWUFBakMsQ0FBOEMsSUFBOUMsRUFBb0RILGVBQXBEO0FBQ0g7QUFDSixPQU5EOztBQVFBeEMsTUFBQUEsUUFBUSxDQUFDRSxTQUFULENBQW1CMEMsYUFBbkIsR0FBbUMsWUFBWTtBQUMzQyxZQUFNQyxlQUFlLEdBQUcsS0FBS0MsaUJBQUwsRUFBeEI7O0FBQ0EsWUFBSSxDQUFDRCxlQUFMLEVBQXNCO0FBQ2xCO0FBQ0E7QUFDQSxlQUFLSCxPQUFMLEdBQWUsSUFBZjtBQUNIOztBQUNELGVBQU9HLGVBQVA7QUFDSCxPQVJEOztBQVVBN0MsTUFBQUEsUUFBUSxDQUFDRSxTQUFULENBQW1CNkMsY0FBbkIsR0FBb0MvQyxRQUFRLENBQUNFLFNBQVQsQ0FBbUJxQyxTQUF2RDtBQUNIOztBQUVELFFBQUl0Qyw0QkFBVXNCLHNCQUFkLEVBQW9CO0FBQ2hCdkIsTUFBQUEsUUFBUSxDQUFDRSxTQUFULENBQW1COEMsbUJBQW5CLEdBQXlDLFVBQVVDLFFBQVYsRUFBb0I7QUFDekQsWUFBTXZCLHFCQUFxQixHQUFHVCx3QkFBU08sTUFBVCxDQUFnQkUscUJBQTlDOztBQUNBLFlBQUl1QixRQUFKLEVBQWM7QUFDVnZCLFVBQUFBLHFCQUFxQixDQUFDLEtBQUtELEdBQU4sQ0FBckIsR0FBa0MsSUFBbEM7O0FBQ0EsZUFBSyxJQUFJUSxDQUFDLEdBQUcsS0FBS2QsV0FBTCxDQUFpQkMsTUFBakIsR0FBMEIsQ0FBdkMsRUFBMENhLENBQUMsSUFBSSxDQUEvQyxFQUFrREEsQ0FBQyxFQUFuRCxFQUF1RDtBQUNuRCxnQkFBTW5CLElBQUksR0FBRyxLQUFLSyxXQUFMLENBQWlCYyxDQUFqQixDQUFiOztBQUNBLGdCQUFJLENBQUNuQixJQUFMLEVBQVc7QUFDUCxtQkFBS0ssV0FBTCxDQUFpQkcsTUFBakIsQ0FBd0JXLENBQXhCLEVBQTJCLENBQTNCOztBQUNBaUIsY0FBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsZ0NBQWdDLEtBQUtDLElBQXJDLEdBQTRDLDZCQUExRDtBQUNBO0FBQ0g7O0FBQ0QxQixZQUFBQSxxQkFBcUIsQ0FBQ1osSUFBSSxDQUFDVyxHQUFOLENBQXJCLEdBQWtDWCxJQUFsQztBQUNIOztBQUNERyxrQ0FBU08sTUFBVCxDQUFnQjZCLElBQWhCLENBQXFCLHNCQUFyQixFQUE2QyxJQUE3QztBQUNILFNBWkQsTUFZTztBQUNIcEMsa0NBQVNPLE1BQVQsQ0FBZ0I2QixJQUFoQixDQUFxQix3QkFBckIsRUFBK0MsSUFBL0M7O0FBQ0EsaUJBQU8zQixxQkFBcUIsQ0FBQyxLQUFLRCxHQUFOLENBQTVCOztBQUZHLHFEQUdnQixLQUFLTixXQUhyQjtBQUFBOztBQUFBO0FBR0gsZ0VBQXFDO0FBQUEsa0JBQTFCTCxLQUEwQjtBQUNqQyxxQkFBT1kscUJBQXFCLENBQUNaLEtBQUksQ0FBQ1csR0FBTixDQUE1QjtBQUNIO0FBTEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1OOztBQUNELFlBQU02QixRQUFRLEdBQUcsS0FBS0MsU0FBdEI7O0FBQ0EsYUFBSyxJQUFJdEIsRUFBQyxHQUFHLENBQVIsRUFBV3VCLEdBQUcsR0FBR0YsUUFBUSxDQUFDbEMsTUFBL0IsRUFBdUNhLEVBQUMsR0FBR3VCLEdBQTNDLEVBQWdELEVBQUV2QixFQUFsRCxFQUFxRDtBQUNqRCxjQUFNd0IsS0FBSyxHQUFHSCxRQUFRLENBQUNyQixFQUFELENBQXRCOztBQUNBd0IsVUFBQUEsS0FBSyxDQUFDVCxtQkFBTixDQUEwQkMsUUFBMUI7QUFDSDtBQUNKLE9BMUJEO0FBMkJIOztBQUVELFFBQUlTLHFCQUFKLEVBQVM7QUFDTDtBQUNBaEQsTUFBQUEsRUFBRSxDQUFDaUQsR0FBSCxDQUFPM0QsUUFBUSxDQUFDRSxTQUFoQixFQUEyQixRQUEzQixFQUFxQyxZQUFZO0FBQzdDLFlBQUkwRCxJQUFJLEdBQUcsRUFBWCxDQUQ2QyxDQUU3Qzs7QUFDQSxZQUFJdkMsSUFBSSxHQUFHLElBQVg7O0FBQ0EsZUFBT0EsSUFBSSxJQUFJLEVBQUVBLElBQUksWUFBWUosd0JBQVM0QyxLQUEzQixDQUFmLEVBQWtEO0FBQzlDLGNBQUlELElBQUosRUFBVTtBQUNOQSxZQUFBQSxJQUFJLEdBQUd2QyxJQUFJLENBQUMrQixJQUFMLEdBQVksR0FBWixHQUFrQlEsSUFBekI7QUFDSCxXQUZELE1BRU87QUFDSEEsWUFBQUEsSUFBSSxHQUFHdkMsSUFBSSxDQUFDK0IsSUFBWjtBQUNIOztBQUNEL0IsVUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNxQixPQUFaO0FBQ0gsU0FYNEMsQ0FZN0M7OztBQUNBLGVBQU8sS0FBS1UsSUFBTCxHQUFZLFVBQVosR0FBeUJRLElBQWhDO0FBQ0gsT0FkRDtBQWVIO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENDT2JqZWN0IH0gZnJvbSAnLi4vZGF0YS9vYmplY3QnO1xyXG5pbXBvcnQgKiBhcyBqcyBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IEVESVRPUiwgREVWLCBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IGVycm9yLCBlcnJvcklELCBnZXRFcnJvciB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbmNvbnN0IERlc3Ryb3lpbmcgPSBDQ09iamVjdC5GbGFncy5EZXN0cm95aW5nO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJhc2VOb2RlUG9seWZpbGwgKEJhc2VOb2RlKSB7XHJcbiAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgQmFzZU5vZGUucHJvdG90eXBlLl9jaGVja011bHRpcGxlQ29tcCA9IGZ1bmN0aW9uIChjdG9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5nZXRDb21wb25lbnQoY3Rvci5fZGlzYWxsb3dNdWx0aXBsZSk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdGluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nLmNvbnN0cnVjdG9yID09PSBjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoZ2V0RXJyb3IoMzgwNSwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCB0aGlzLl9uYW1lKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKGdldEVycm9yKDM4MDYsIGpzLmdldENsYXNzTmFtZShjdG9yKSwgdGhpcy5fbmFtZSwganMuZ2V0Q2xhc3NOYW1lKGV4aXN0aW5nKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoaXMgYXBpIHNob3VsZCBvbmx5IHVzZWQgYnkgdW5kbyBzeXN0ZW1cclxuICAgICAgICAgKiBAbWV0aG9kIF9hZGRDb21wb25lbnRBdFxyXG4gICAgICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wXHJcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQmFzZU5vZGUucHJvdG90eXBlLl9hZGRDb21wb25lbnRBdCA9IGZ1bmN0aW9uIChjb21wLCBpbmRleCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb2JqRmxhZ3MgJiBEZXN0cm95aW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3IoJ2lzRGVzdHJveWluZycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKGNvbXAgaW5zdGFuY2VvZiBsZWdhY3lDQy5Db21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3JJRCgzODExKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiB0aGlzLl9jb21wb25lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9ySUQoMzgxMik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHJlY2hlY2sgYXR0cmlidXRlcyBiZWNhdXNlIHNjcmlwdCBtYXkgY2hhbmdlZFxyXG4gICAgICAgICAgICBjb25zdCBjdG9yID0gY29tcC5jb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgaWYgKGN0b3IuX2Rpc2FsbG93TXVsdGlwbGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tNdWx0aXBsZUNvbXAoY3RvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBkZXBlbmRlbmN5IGFuZCByZXR1cm4gZGlyZWN0bHkgYnkgZWRpdG9yXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IFJlcUNvbXAgPSBjdG9yLl9yZXF1aXJlQ29tcG9uZW50O1xyXG4gICAgICAgICAgICAvLyBpZiAoUmVxQ29tcCAmJiAhdGhpcy5nZXRDb21wb25lbnQoUmVxQ29tcCkpIHtcclxuICAgICAgICAgICAgLy8gICAgIGlmIChpbmRleCA9PT0gdGhpcy5fY29tcG9uZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAvLyBJZiBjb21wIHNob3VsZCBiZSBsYXN0IGNvbXBvbmVudCwgaW5jcmVhc2UgdGhlIGluZGV4IGJlY2F1c2UgcmVxdWlyZWQgY29tcG9uZW50IGFkZGVkXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgKytpbmRleDtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIGNvbnN0IGRlcGVuZGVkID0gdGhpcy5hZGRDb21wb25lbnQoUmVxQ29tcCk7XHJcbiAgICAgICAgICAgIC8vICAgICBpZiAoIWRlcGVuZGVkKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgLy8gZGVwZW5kIGNvbmZsaWN0c1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBjb21wLm5vZGUgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnRzLnNwbGljZShpbmRleCwgMCwgY29tcCk7XHJcbiAgICAgICAgICAgIGlmICgoRURJVE9SIHx8IFRFU1QpICYmIGxlZ2FjeUNDLmVuZ2luZSAmJiAodGhpcy5faWQgaW4gbGVnYWN5Q0MuZW5naW5lLmF0dGFjaGVkT2Jqc0ZvckVkaXRvcikpIHtcclxuICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmVuZ2luZS5hdHRhY2hlZE9ianNGb3JFZGl0b3JbY29tcC5faWRdID0gY29tcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLl9ub2RlQWN0aXZhdG9yLmFjdGl2YXRlQ29tcChjb21wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBtZXRob2QgX2dldERlcGVuZENvbXBvbmVudFxyXG4gICAgICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBkZXBlbmRlZFxyXG4gICAgICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICBCYXNlTm9kZS5wcm90b3R5cGUuX2dldERlcGVuZENvbXBvbmVudCA9IGZ1bmN0aW9uIChkZXBlbmRlZCkge1xyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wID0gdGhpcy5fY29tcG9uZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wICE9PSBkZXBlbmRlZCAmJiBjb21wLmlzVmFsaWQgJiYgIWxlZ2FjeUNDLk9iamVjdC5fd2lsbERlc3Ryb3koY29tcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXBlbmQgPSBjb21wLmNvbnN0cnVjdG9yLl9yZXF1aXJlQ29tcG9uZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXBlbmQgJiYgZGVwZW5kZWQgaW5zdGFuY2VvZiBkZXBlbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEJhc2VOb2RlLnByb3RvdHlwZS5vblJlc3RvcmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGFjdGl2aXR5IHN0YXRlXHJcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZEFjdGl2ZU5vdyA9IHRoaXMuX2FjdGl2ZSAmJiAhISh0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50Ll9hY3RpdmVJbkhpZXJhcmNoeSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeSAhPT0gc2hvdWxkQWN0aXZlTm93KSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5fbm9kZUFjdGl2YXRvci5hY3RpdmF0ZU5vZGUodGhpcywgc2hvdWxkQWN0aXZlTm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEJhc2VOb2RlLnByb3RvdHlwZS5fb25QcmVEZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zdCBkZXN0cm95QnlQYXJlbnQgPSB0aGlzLl9vblByZURlc3Ryb3lCYXNlKCk7XHJcbiAgICAgICAgICAgIGlmICghZGVzdHJveUJ5UGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlbnN1cmUgdGhpcyBub2RlIGNhbiByZWF0dGFjaCB0byBzY2VuZSBieSB1bmRvIHN5c3RlbVxyXG4gICAgICAgICAgICAgICAgLy8gKHNpbXVsYXRlIHNvbWUgZGVzdHJ1Y3QgbG9naWMgdG8gbWFrZSB1bmRvIHN5c3RlbSB3b3JrIGNvcnJlY3RseSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3lCeVBhcmVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBCYXNlTm9kZS5wcm90b3R5cGUuX29uUmVzdG9yZUJhc2UgPSBCYXNlTm9kZS5wcm90b3R5cGUub25SZXN0b3JlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChFRElUT1IgfHwgVEVTVCkge1xyXG4gICAgICAgIEJhc2VOb2RlLnByb3RvdHlwZS5fcmVnaXN0ZXJJZkF0dGFjaGVkID0gZnVuY3Rpb24gKHJlZ2lzdGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFjaGVkT2Jqc0ZvckVkaXRvciA9IGxlZ2FjeUNDLmVuZ2luZS5hdHRhY2hlZE9ianNGb3JFZGl0b3I7XHJcbiAgICAgICAgICAgIGlmIChyZWdpc3Rlcikge1xyXG4gICAgICAgICAgICAgICAgYXR0YWNoZWRPYmpzRm9yRWRpdG9yW3RoaXMuX2lkXSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fY29tcG9uZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXAgPSB0aGlzLl9jb21wb25lbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29tcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb21wb25lbnRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignY29tcG9uZW50IGF0dGFjaGVkIHRvIG5vZGU6JyArIHRoaXMubmFtZSArICcgaXMgaW52YWxpZCBmb3Igc29tZSByZWFzb24nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaGVkT2Jqc0ZvckVkaXRvcltjb21wLl9pZF0gPSBjb21wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGVnYWN5Q0MuZW5naW5lLmVtaXQoJ25vZGUtYXR0YWNoLXRvLXNjZW5lJywgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5lbmdpbmUuZW1pdCgnbm9kZS1kZXRhY2gtZnJvbS1zY2VuZScsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGF0dGFjaGVkT2Jqc0ZvckVkaXRvclt0aGlzLl9pZF07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNvbXAgb2YgdGhpcy5fY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBhdHRhY2hlZE9ianNGb3JFZGl0b3JbY29tcC5faWRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLl9yZWdpc3RlcklmQXR0YWNoZWQocmVnaXN0ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoREVWKSB7XHJcbiAgICAgICAgLy8gcHJvbW90ZSBkZWJ1ZyBpbmZvXHJcbiAgICAgICAganMuZ2V0KEJhc2VOb2RlLnByb3RvdHlwZSwgJyBJTkZPICcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSAnJztcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHdoaWxlIChub2RlICYmICEobm9kZSBpbnN0YW5jZW9mIGxlZ2FjeUNDLlNjZW5lKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gbm9kZS5uYW1lICsgJy8nICsgcGF0aDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IG5vZGUubmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLl9wYXJlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgJywgcGF0aDogJyArIHBhdGg7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19