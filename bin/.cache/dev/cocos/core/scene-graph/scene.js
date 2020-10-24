(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../math/index.js", "../platform/debug.js", "./base-node.js", "../default-constants.js", "../global-exports.js", "./scene-globals.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../math/index.js"), require("../platform/debug.js"), require("./base-node.js"), require("../default-constants.js"), require("../global-exports.js"), require("./scene-globals.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.debug, global.baseNode, global.defaultConstants, global.globalExports, global.sceneGlobals);
    global.scene = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _debug, _baseNode, _defaultConstants, _globalExports, _sceneGlobals) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Scene = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en
   * Scene is a subclass of [[BaseNode]], composed by nodes, representing the root of a runnable environment in the game.
   * It's managed by [[Director]] and user can switch from a scene to another using [[Director.loadScene]]
   * @zh
   * Scene 是 [[BaseNode]] 的子类，由节点所构成，代表着游戏中可运行的某一个整体环境。
   * 它由 [[Director]] 管理，用户可以使用 [[Director.loadScene]] 来切换场景
   */
  var Scene = (_dec = (0, _index.ccclass)('cc.Scene'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_BaseNode) {
    _inherits(Scene, _BaseNode);

    _createClass(Scene, [{
      key: "renderScene",

      /**
       * @en The renderer scene, normally user don't need to use it
       * @zh 渲染层场景，一般情况下用户不需要关心它
       */
      get: function get() {
        return this._renderScene;
      }
    }, {
      key: "globals",
      get: function get() {
        return this._globals;
      }
      /**
       * @en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
       * @zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。
       */

    }]);

    function Scene(name) {
      var _this;

      _classCallCheck(this, Scene);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Scene).call(this, name));

      _initializerDefineProperty(_this, "autoReleaseAssets", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_globals", _descriptor2, _assertThisInitialized(_this));

      _this._renderScene = null;
      _this.dependAssets = null;
      _this._inited = void 0;
      _this._prefabSyncedInLiveReload = false;
      _this._pos = _index2.Vec3.ZERO;
      _this._rot = _index2.Quat.IDENTITY;
      _this._scale = _index2.Vec3.ONE;
      _this._mat = _index2.Mat4.IDENTITY;
      _this._dirtyFlags = 0;
      _this._activeInHierarchy = false;

      if (_globalExports.legacyCC.director && _globalExports.legacyCC.director.root) {
        _this._renderScene = _globalExports.legacyCC.director.root.createScene({});
      }

      _this._inited = _globalExports.legacyCC.game ? !_globalExports.legacyCC.game._isCloning : true;
      return _this;
    }
    /**
     * @en Destroy the current scene and all its nodes, this action won't destroy related assets
     * @zh 销毁当前场景中的所有节点，这个操作不会销毁资源
     */


    _createClass(Scene, [{
      key: "destroy",
      value: function destroy() {
        var success = _get(_getPrototypeOf(Scene.prototype), "destroy", this).call(this);

        _globalExports.legacyCC.director.root.destroyScene(this._renderScene);

        this._activeInHierarchy = false;
        return success;
      }
      /**
       * @en Only for compatibility purpose, user should not add any component to the scene
       * @zh 仅为兼容性保留，用户不应该在场景上直接添加任何组件
       */

    }, {
      key: "addComponent",
      value: function addComponent(typeOrClassName) {
        throw new Error((0, _debug.getError)(3822));
      }
    }, {
      key: "_onHierarchyChanged",
      value: function _onHierarchyChanged() {}
    }, {
      key: "_onBatchCreated",
      value: function _onBatchCreated() {
        _get(_getPrototypeOf(Scene.prototype), "_onBatchCreated", this).call(this);

        var len = this._children.length;

        for (var i = 0; i < len; ++i) {
          this._children[i]._onBatchCreated();
        }
      }
    }, {
      key: "_onBatchRestored",
      value: function _onBatchRestored() {
        this._onBatchCreated();
      } // transform helpers

      /**
       * Refer to [[Node.getPosition]]
       */

    }, {
      key: "getPosition",
      value: function getPosition(out) {
        return _index2.Vec3.copy(out || new _index2.Vec3(), _index2.Vec3.ZERO);
      }
      /**
       * Refer to [[Node.getRotation]]
       */

    }, {
      key: "getRotation",
      value: function getRotation(out) {
        return _index2.Quat.copy(out || new _index2.Quat(), _index2.Quat.IDENTITY);
      }
      /**
       * Refer to [[Node.getScale]]
       */

    }, {
      key: "getScale",
      value: function getScale(out) {
        return _index2.Vec3.copy(out || new _index2.Vec3(), _index2.Vec3.ONE);
      }
      /**
       * Refer to [[Node.getWorldPosition]]
       */

    }, {
      key: "getWorldPosition",
      value: function getWorldPosition(out) {
        return _index2.Vec3.copy(out || new _index2.Vec3(), _index2.Vec3.ZERO);
      }
      /**
       * Refer to [[Node.getWorldRotation]]
       */

    }, {
      key: "getWorldRotation",
      value: function getWorldRotation(out) {
        return _index2.Quat.copy(out || new _index2.Quat(), _index2.Quat.IDENTITY);
      }
      /**
       * Refer to [[Node.getWorldScale]]
       */

    }, {
      key: "getWorldScale",
      value: function getWorldScale(out) {
        return _index2.Vec3.copy(out || new _index2.Vec3(), _index2.Vec3.ONE);
      }
      /**
       * Refer to [[Node.getWorldMatrix]]
       */

    }, {
      key: "getWorldMatrix",
      value: function getWorldMatrix(out) {
        return _index2.Mat4.copy(out || new _index2.Mat4(), _index2.Mat4.IDENTITY);
      }
      /**
       * Refer to [[Node.getWorldRS]]
       */

    }, {
      key: "getWorldRS",
      value: function getWorldRS(out) {
        return _index2.Mat4.copy(out || new _index2.Mat4(), _index2.Mat4.IDENTITY);
      }
      /**
       * Refer to [[Node.getWorldRT]]
       */

    }, {
      key: "getWorldRT",
      value: function getWorldRT(out) {
        return _index2.Mat4.copy(out || new _index2.Mat4(), _index2.Mat4.IDENTITY);
      }
      /**
       * Refer to [[Node.position]]
       */

    }, {
      key: "updateWorldTransform",

      /**
       * Refer to [[Node.updateWorldTransform]]
       */
      value: function updateWorldTransform() {} // life-cycle call backs

    }, {
      key: "_instantiate",
      value: function _instantiate() {}
    }, {
      key: "_load",
      value: function _load() {
        if (!this._inited) {
          if (_defaultConstants.TEST) {
            (0, _debug.assert)(!this._activeInHierarchy, 'Should deactivate ActionManager and EventManager by default');
          }

          this._onBatchCreated();

          this._inited = true;
        } // static methode can't use this as parameter type


        this.walk(_baseNode.BaseNode._setScene);
      }
    }, {
      key: "_activate",
      value: function _activate(active) {
        active = active !== false;

        if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
          // register all nodes to editor
          this._registerIfAttached(active);
        }

        _globalExports.legacyCC.director._nodeActivator.activateNode(this, active);

        this._globals.activate();
      }
    }, {
      key: "position",
      get: function get() {
        return _index2.Vec3.ZERO;
      }
      /**
       * Refer to [[Node.worldPosition]]
       */

    }, {
      key: "worldPosition",
      get: function get() {
        return _index2.Vec3.ZERO;
      }
      /**
       * Refer to [[Node.rotation]]
       */

    }, {
      key: "rotation",
      get: function get() {
        return _index2.Quat.IDENTITY;
      }
      /**
       * Refer to [[Node.worldRotation]]
       */

    }, {
      key: "worldRotation",
      get: function get() {
        return _index2.Quat.IDENTITY;
      }
      /**
       * Refer to [[Node.scale]]
       */

    }, {
      key: "scale",
      get: function get() {
        return _index2.Vec3.ONE;
      }
      /**
       * Refer to [[Node.worldScale]]
       */

    }, {
      key: "worldScale",
      get: function get() {
        return _index2.Vec3.ONE;
      }
      /**
       * Refer to [[Node.eulerAngles]]
       */

    }, {
      key: "eulerAngles",
      get: function get() {
        return _index2.Vec3.ZERO;
      }
      /**
       * Refer to [[Node.worldMatrix]]
       */

    }, {
      key: "worldMatrix",
      get: function get() {
        return _index2.Mat4.IDENTITY;
      }
    }]);

    return Scene;
  }(_baseNode.BaseNode), _temp), (_applyDecoratedDescriptor(_class2.prototype, "globals", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "globals"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "autoReleaseAssets", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_globals", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _sceneGlobals.SceneGlobals();
    }
  })), _class2)) || _class);
  _exports.Scene = Scene;
  _globalExports.legacyCC.Scene = Scene;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvc2NlbmUudHMiXSwibmFtZXMiOlsiU2NlbmUiLCJfcmVuZGVyU2NlbmUiLCJfZ2xvYmFscyIsIm5hbWUiLCJkZXBlbmRBc3NldHMiLCJfaW5pdGVkIiwiX3ByZWZhYlN5bmNlZEluTGl2ZVJlbG9hZCIsIl9wb3MiLCJWZWMzIiwiWkVSTyIsIl9yb3QiLCJRdWF0IiwiSURFTlRJVFkiLCJfc2NhbGUiLCJPTkUiLCJfbWF0IiwiTWF0NCIsIl9kaXJ0eUZsYWdzIiwiX2FjdGl2ZUluSGllcmFyY2h5IiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInJvb3QiLCJjcmVhdGVTY2VuZSIsImdhbWUiLCJfaXNDbG9uaW5nIiwic3VjY2VzcyIsImRlc3Ryb3lTY2VuZSIsInR5cGVPckNsYXNzTmFtZSIsIkVycm9yIiwibGVuIiwiX2NoaWxkcmVuIiwibGVuZ3RoIiwiaSIsIl9vbkJhdGNoQ3JlYXRlZCIsIm91dCIsImNvcHkiLCJURVNUIiwid2FsayIsIkJhc2VOb2RlIiwiX3NldFNjZW5lIiwiYWN0aXZlIiwiRURJVE9SIiwiX3JlZ2lzdGVySWZBdHRhY2hlZCIsIl9ub2RlQWN0aXZhdG9yIiwiYWN0aXZhdGVOb2RlIiwiYWN0aXZhdGUiLCJlZGl0YWJsZSIsInNlcmlhbGl6YWJsZSIsIlNjZW5lR2xvYmFscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0E7Ozs7Ozs7O01BU2FBLEssV0FEWixvQkFBUSxVQUFSLEM7Ozs7OztBQUVHOzs7OzBCQUltQjtBQUNmLGVBQU8sS0FBS0MsWUFBWjtBQUNIOzs7MEJBR2M7QUFDWCxlQUFPLEtBQUtDLFFBQVo7QUFDSDtBQUVEOzs7Ozs7O0FBNEJBLG1CQUFhQyxJQUFiLEVBQTJCO0FBQUE7O0FBQUE7O0FBQ3ZCLGlGQUFNQSxJQUFOOztBQUR1Qjs7QUFBQTs7QUFB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Q2hFOzs7Ozs7MEJBRzRDO0FBQUUsZUFBT0QsYUFBS0MsUUFBWjtBQUF1QjtBQUNyRTs7Ozs7OzBCQUdvQztBQUFFLGVBQU9KLGFBQUtNLEdBQVo7QUFBa0I7QUFDeEQ7Ozs7OzswQkFHeUM7QUFBRSxlQUFPTixhQUFLTSxHQUFaO0FBQWtCO0FBQzdEOzs7Ozs7MEJBRzBDO0FBQUUsZUFBT04sYUFBS0MsSUFBWjtBQUFtQjtBQUMvRDs7Ozs7OzBCQUcwQztBQUFFLGVBQU9PLGFBQUtKLFFBQVo7QUFBdUI7Ozs7SUF6SjVDMEIsa0IscUVBU3RCUSxlLHVLQVNBQyxtQixFQUNBRCxlOzs7OzthQUMwQixLOzsrRUFNMUJDLG1COzs7OzthQUNpQixJQUFJQywwQkFBSixFOzs7O0FBK0p0QjdCLDBCQUFTbkIsS0FBVCxHQUFpQkEsS0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHNjZW5lLWdyYXBoXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgc2VyaWFsaXphYmxlLCBlZGl0YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IE1hdDQsIFF1YXQsIFZlYzMgfSBmcm9tICcuLi9tYXRoJztcclxuaW1wb3J0IHsgYXNzZXJ0LCBnZXRFcnJvciB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgUmVuZGVyU2NlbmUgfSBmcm9tICcuLi9yZW5kZXJlci9zY2VuZS9yZW5kZXItc2NlbmUnO1xyXG5pbXBvcnQgeyBCYXNlTm9kZSB9IGZyb20gJy4vYmFzZS1ub2RlJztcclxuaW1wb3J0IHsgRURJVE9SLCBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2NlbmVHbG9iYWxzIH0gZnJvbSAnLi9zY2VuZS1nbG9iYWxzJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2NlbmUgaXMgYSBzdWJjbGFzcyBvZiBbW0Jhc2VOb2RlXV0sIGNvbXBvc2VkIGJ5IG5vZGVzLCByZXByZXNlbnRpbmcgdGhlIHJvb3Qgb2YgYSBydW5uYWJsZSBlbnZpcm9ubWVudCBpbiB0aGUgZ2FtZS5cclxuICogSXQncyBtYW5hZ2VkIGJ5IFtbRGlyZWN0b3JdXSBhbmQgdXNlciBjYW4gc3dpdGNoIGZyb20gYSBzY2VuZSB0byBhbm90aGVyIHVzaW5nIFtbRGlyZWN0b3IubG9hZFNjZW5lXV1cclxuICogQHpoXHJcbiAqIFNjZW5lIOaYryBbW0Jhc2VOb2RlXV0g55qE5a2Q57G777yM55Sx6IqC54K55omA5p6E5oiQ77yM5Luj6KGo552A5ri45oiP5Lit5Y+v6L+Q6KGM55qE5p+Q5LiA5Liq5pW05L2T546v5aKD44CCXHJcbiAqIOWug+eUsSBbW0RpcmVjdG9yXV0g566h55CG77yM55So5oi35Y+v5Lul5L2/55SoIFtbRGlyZWN0b3IubG9hZFNjZW5lXV0g5p2l5YiH5o2i5Zy65pmvXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuU2NlbmUnKVxyXG5leHBvcnQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBCYXNlTm9kZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgcmVuZGVyZXIgc2NlbmUsIG5vcm1hbGx5IHVzZXIgZG9uJ3QgbmVlZCB0byB1c2UgaXRcclxuICAgICAqIEB6aCDmuLLmn5PlsYLlnLrmma/vvIzkuIDoiKzmg4XlhrXkuIvnlKjmiLfkuI3pnIDopoHlhbPlv4PlroNcclxuICAgICAqL1xyXG4gICAgZ2V0IHJlbmRlclNjZW5lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyU2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgZ2xvYmFscyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dsb2JhbHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5kaWNhdGVzIHdoZXRoZXIgYWxsIChkaXJlY3RseSBvciBpbmRpcmVjdGx5KSBzdGF0aWMgcmVmZXJlbmNlZCBhc3NldHMgb2YgdGhpcyBzY2VuZSBhcmUgcmVsZWFzYWJsZSBieSBkZWZhdWx0IGFmdGVyIHNjZW5lIHVubG9hZGluZy5cclxuICAgICAqIEB6aCDmjIfnpLror6XlnLrmma/kuK3nm7TmjqXmiJbpl7TmjqXpnZnmgIHlvJXnlKjliLDnmoTmiYDmnInotYTmupDmmK/lkKbpu5jorqTlnKjlnLrmma/liIfmjaLlkI7oh6rliqjph4rmlL7jgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgYXV0b1JlbGVhc2VBc3NldHMgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQZXItc2NlbmUgbGV2ZWwgcmVuZGVyaW5nIGluZm9cclxuICAgICAqIEB6aCDlnLrmma/nuqfliKvnmoTmuLLmn5Pkv6Hmga9cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHVibGljIF9nbG9iYWxzID0gbmV3IFNjZW5lR2xvYmFscygpO1xyXG5cclxuICAgIHB1YmxpYyBfcmVuZGVyU2NlbmU6IFJlbmRlclNjZW5lIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZGVwZW5kQXNzZXRzID0gbnVsbDsgLy8gY2FjaGUgYWxsIGRlcGVuZCBhc3NldHMgZm9yIGF1dG8gcmVsZWFzZVxyXG5cclxuICAgIHByb3RlY3RlZCBfaW5pdGVkOiBib29sZWFuO1xyXG4gICAgcHJvdGVjdGVkIF9wcmVmYWJTeW5jZWRJbkxpdmVSZWxvYWQgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBzdXBwb3J0IE5vZGUgYWNjZXNzIHBhcmVudCBkYXRhIGZyb20gU2NlbmVcclxuICAgIHByb3RlY3RlZCBfcG9zID0gVmVjMy5aRVJPO1xyXG4gICAgcHJvdGVjdGVkIF9yb3QgPSBRdWF0LklERU5USVRZO1xyXG4gICAgcHJvdGVjdGVkIF9zY2FsZSA9IFZlYzMuT05FO1xyXG4gICAgcHJvdGVjdGVkIF9tYXQgPSBNYXQ0LklERU5USVRZO1xyXG4gICAgcHJvdGVjdGVkIF9kaXJ0eUZsYWdzID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkgPSBmYWxzZTtcclxuICAgICAgICBpZiAobGVnYWN5Q0MuZGlyZWN0b3IgJiYgbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJTY2VuZSA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuY3JlYXRlU2NlbmUoe30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbml0ZWQgPSBsZWdhY3lDQy5nYW1lID8gIWxlZ2FjeUNDLmdhbWUuX2lzQ2xvbmluZyA6IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRGVzdHJveSB0aGUgY3VycmVudCBzY2VuZSBhbmQgYWxsIGl0cyBub2RlcywgdGhpcyBhY3Rpb24gd29uJ3QgZGVzdHJveSByZWxhdGVkIGFzc2V0c1xyXG4gICAgICogQHpoIOmUgOavgeW9k+WJjeWcuuaZr+S4reeahOaJgOacieiKgueCue+8jOi/meS4quaTjeS9nOS4jeS8mumUgOavgei1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IHN1cGVyLmRlc3Ryb3koKTtcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRlc3Ryb3lTY2VuZSh0aGlzLl9yZW5kZXJTY2VuZSk7XHJcbiAgICAgICAgdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gc3VjY2VzcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPbmx5IGZvciBjb21wYXRpYmlsaXR5IHB1cnBvc2UsIHVzZXIgc2hvdWxkIG5vdCBhZGQgYW55IGNvbXBvbmVudCB0byB0aGUgc2NlbmVcclxuICAgICAqIEB6aCDku4XkuLrlhbzlrrnmgKfkv53nlZnvvIznlKjmiLfkuI3lupTor6XlnKjlnLrmma/kuIrnm7TmjqXmt7vliqDku7vkvZXnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENvbXBvbmVudCAodHlwZU9yQ2xhc3NOYW1lOiBzdHJpbmcgfCBGdW5jdGlvbik6IENvbXBvbmVudCB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdldEVycm9yKDM4MjIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uSGllcmFyY2h5Q2hhbmdlZCAoKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgX29uQmF0Y2hDcmVhdGVkICgpIHtcclxuICAgICAgICBzdXBlci5fb25CYXRjaENyZWF0ZWQoKTtcclxuICAgICAgICBjb25zdCBsZW4gPSB0aGlzLl9jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbltpXS5fb25CYXRjaENyZWF0ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9vbkJhdGNoUmVzdG9yZWQgKCkge1xyXG4gICAgICAgIHRoaXMuX29uQmF0Y2hDcmVhdGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdHJhbnNmb3JtIGhlbHBlcnNcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyIHRvIFtbTm9kZS5nZXRQb3NpdGlvbl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRQb3NpdGlvbiAob3V0PzogVmVjMyk6IFZlYzMgeyByZXR1cm4gVmVjMy5jb3B5KG91dCB8fCBuZXcgVmVjMygpLCBWZWMzLlpFUk8pOyB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyIHRvIFtbTm9kZS5nZXRSb3RhdGlvbl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSb3RhdGlvbiAob3V0PzogUXVhdCk6IFF1YXQgeyByZXR1cm4gUXVhdC5jb3B5KG91dCB8fCBuZXcgUXVhdCgpLCBRdWF0LklERU5USVRZKTsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlciB0byBbW05vZGUuZ2V0U2NhbGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0U2NhbGUgKG91dD86IFZlYzMpOiBWZWMzIHsgcmV0dXJuIFZlYzMuY29weShvdXQgfHwgbmV3IFZlYzMoKSwgVmVjMy5PTkUpOyB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyIHRvIFtbTm9kZS5nZXRXb3JsZFBvc2l0aW9uXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdvcmxkUG9zaXRpb24gKG91dD86IFZlYzMpIHsgcmV0dXJuIFZlYzMuY29weShvdXQgfHwgbmV3IFZlYzMoKSwgVmVjMy5aRVJPKTsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlciB0byBbW05vZGUuZ2V0V29ybGRSb3RhdGlvbl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRXb3JsZFJvdGF0aW9uIChvdXQ/OiBRdWF0KSB7IHJldHVybiBRdWF0LmNvcHkob3V0IHx8IG5ldyBRdWF0KCksIFF1YXQuSURFTlRJVFkpOyB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyIHRvIFtbTm9kZS5nZXRXb3JsZFNjYWxlXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdvcmxkU2NhbGUgKG91dD86IFZlYzMpIHsgcmV0dXJuIFZlYzMuY29weShvdXQgfHwgbmV3IFZlYzMoKSwgVmVjMy5PTkUpOyB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyIHRvIFtbTm9kZS5nZXRXb3JsZE1hdHJpeF1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRXb3JsZE1hdHJpeCAob3V0PzogTWF0NCk6IE1hdDQgeyByZXR1cm4gTWF0NC5jb3B5KG91dCB8fCBuZXcgTWF0NCgpLCBNYXQ0LklERU5USVRZKTsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlciB0byBbW05vZGUuZ2V0V29ybGRSU11dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRXb3JsZFJTIChvdXQ/OiBNYXQ0KTogTWF0NCB7IHJldHVybiBNYXQ0LmNvcHkob3V0IHx8IG5ldyBNYXQ0KCksIE1hdDQuSURFTlRJVFkpOyB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyIHRvIFtbTm9kZS5nZXRXb3JsZFJUXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdvcmxkUlQgKG91dD86IE1hdDQpOiBNYXQ0IHsgcmV0dXJuIE1hdDQuY29weShvdXQgfHwgbmV3IE1hdDQoKSwgTWF0NC5JREVOVElUWSk7IH1cclxuICAgIC8qKlxyXG4gICAgICogUmVmZXIgdG8gW1tOb2RlLnBvc2l0aW9uXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBwb3NpdGlvbiAoKTogUmVhZG9ubHk8VmVjMz4geyByZXR1cm4gVmVjMy5aRVJPOyB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyIHRvIFtbTm9kZS53b3JsZFBvc2l0aW9uXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCB3b3JsZFBvc2l0aW9uICgpOiBSZWFkb25seTxWZWMzPiB7IHJldHVybiBWZWMzLlpFUk87IH1cclxuICAgIC8qKlxyXG4gICAgICogUmVmZXIgdG8gW1tOb2RlLnJvdGF0aW9uXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCByb3RhdGlvbiAoKTogUmVhZG9ubHk8UXVhdD4geyByZXR1cm4gUXVhdC5JREVOVElUWTsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlciB0byBbW05vZGUud29ybGRSb3RhdGlvbl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgd29ybGRSb3RhdGlvbiAoKTogUmVhZG9ubHk8UXVhdD4geyByZXR1cm4gUXVhdC5JREVOVElUWTsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlciB0byBbW05vZGUuc2NhbGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHNjYWxlICgpOiBSZWFkb25seTxWZWMzPiB7IHJldHVybiBWZWMzLk9ORTsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZlciB0byBbW05vZGUud29ybGRTY2FsZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgd29ybGRTY2FsZSAoKTogUmVhZG9ubHk8VmVjMz4geyByZXR1cm4gVmVjMy5PTkU7IH1cclxuICAgIC8qKlxyXG4gICAgICogUmVmZXIgdG8gW1tOb2RlLmV1bGVyQW5nbGVzXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBldWxlckFuZ2xlcyAoKTogUmVhZG9ubHk8VmVjMz4geyByZXR1cm4gVmVjMy5aRVJPOyB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZmVyIHRvIFtbTm9kZS53b3JsZE1hdHJpeF1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgd29ybGRNYXRyaXggKCk6IFJlYWRvbmx5PE1hdDQ+IHsgcmV0dXJuIE1hdDQuSURFTlRJVFk7IH1cclxuICAgIC8qKlxyXG4gICAgICogUmVmZXIgdG8gW1tOb2RlLnVwZGF0ZVdvcmxkVHJhbnNmb3JtXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHVwZGF0ZVdvcmxkVHJhbnNmb3JtICgpIHt9XHJcblxyXG4gICAgLy8gbGlmZS1jeWNsZSBjYWxsIGJhY2tzXHJcblxyXG4gICAgcHJvdGVjdGVkIF9pbnN0YW50aWF0ZSAoKSB7IH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2xvYWQgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSB7XHJcbiAgICAgICAgICAgIGlmIChURVNUKSB7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnQoIXRoaXMuX2FjdGl2ZUluSGllcmFyY2h5LCAnU2hvdWxkIGRlYWN0aXZhdGUgQWN0aW9uTWFuYWdlciBhbmQgRXZlbnRNYW5hZ2VyIGJ5IGRlZmF1bHQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9vbkJhdGNoQ3JlYXRlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzdGF0aWMgbWV0aG9kZSBjYW4ndCB1c2UgdGhpcyBhcyBwYXJhbWV0ZXIgdHlwZVxyXG4gICAgICAgIHRoaXMud2FsayhCYXNlTm9kZS5fc2V0U2NlbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYWN0aXZhdGUgKGFjdGl2ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGFjdGl2ZSA9IChhY3RpdmUgIT09IGZhbHNlKTtcclxuICAgICAgICBpZiAoRURJVE9SIHx8IFRFU1QpIHtcclxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgYWxsIG5vZGVzIHRvIGVkaXRvclxyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlcklmQXR0YWNoZWQhKGFjdGl2ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLl9ub2RlQWN0aXZhdG9yLmFjdGl2YXRlTm9kZSh0aGlzLCBhY3RpdmUpO1xyXG4gICAgICAgIHRoaXMuX2dsb2JhbHMuYWN0aXZhdGUoKTtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuU2NlbmUgPSBTY2VuZTtcclxuIl19