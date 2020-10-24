(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/js.js", "./class.js", "../platform/debug.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/js.js"), require("./class.js"), require("../platform/debug.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global._class, global.debug, global.defaultConstants, global.globalExports);
    global.object = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, js, _class, _debug, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isValid = isValid;
  _exports.CCObject = void 0;
  js = _interopRequireWildcard(js);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  // definitions for CCObject.Flags
  var Destroyed = 1 << 0;
  var RealDestroyed = 1 << 1;
  var ToDestroy = 1 << 2;
  var DontSave = 1 << 3;
  var EditorOnly = 1 << 4;
  var Dirty = 1 << 5;
  var DontDestroy = 1 << 6;
  var Destroying = 1 << 7;
  var Deactivating = 1 << 8;
  var LockedInEditor = 1 << 9; // var HideInGame = 1 << 9;

  var HideInHierarchy = 1 << 10;
  var IsOnEnableCalled = 1 << 11;
  var IsEditorOnEnableCalled = 1 << 12;
  var IsPreloadStarted = 1 << 13;
  var IsOnLoadCalled = 1 << 14;
  var IsOnLoadStarted = 1 << 15;
  var IsStartCalled = 1 << 16;
  var IsRotationLocked = 1 << 17;
  var IsScaleLocked = 1 << 18;
  var IsAnchorLocked = 1 << 19;
  var IsSizeLocked = 1 << 20;
  var IsPositionLocked = 1 << 21; // var Hide = HideInGame | HideInEditor;
  // should not clone or serialize these flags

  var PersistentMask = ~(ToDestroy | Dirty | Destroying | DontDestroy | Deactivating | IsPreloadStarted | IsOnLoadStarted | IsOnLoadCalled | IsStartCalled | IsOnEnableCalled | IsEditorOnEnableCalled | IsRotationLocked | IsScaleLocked | IsAnchorLocked | IsSizeLocked | IsPositionLocked
  /*RegisteredInEditor*/
  );
  var objectsToDestroy = [];
  var deferredDestroyTimer = null;

  function compileDestruct(obj, ctor) {
    var shouldSkipId = obj instanceof _globalExports.legacyCC._BaseNode || obj instanceof _globalExports.legacyCC.Component;
    var idToSkip = shouldSkipId ? '_id' : null;
    var key;
    var propsToReset = {};

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === idToSkip) {
          continue;
        }

        switch (_typeof(obj[key])) {
          case 'string':
            propsToReset[key] = '';
            break;

          case 'object':
          case 'function':
            propsToReset[key] = null;
            break;
        }
      }
    } // Overwrite propsToReset according to Class


    if (_class.CCClass._isCCClass(ctor)) {
      var attrs = _globalExports.legacyCC.Class.Attr.getClassAttrs(ctor);

      var propList = ctor.__props__; // tslint:disable-next-line: prefer-for-of

      for (var i = 0; i < propList.length; i++) {
        key = propList[i];
        var attrKey = key + _globalExports.legacyCC.Class.Attr.DELIMETER + 'default';

        if (attrKey in attrs) {
          if (shouldSkipId && key === '_id') {
            continue;
          }

          switch (_typeof(attrs[attrKey])) {
            case 'string':
              propsToReset[key] = '';
              break;

            case 'object':
            case 'function':
              propsToReset[key] = null;
              break;

            case 'undefined':
              propsToReset[key] = undefined;
              break;
          }
        }
      }
    }

    if (_defaultConstants.SUPPORT_JIT) {
      // compile code
      var func = ''; // tslint:disable: forin

      for (key in propsToReset) {
        var statement = void 0;

        if (_class.CCClass.IDENTIFIER_RE.test(key)) {
          statement = 'o.' + key + '=';
        } else {
          statement = 'o[' + _class.CCClass.escapeForJS(key) + ']=';
        }

        var val = propsToReset[key];

        if (val === '') {
          val = '""';
        }

        func += statement + val + ';\n';
      }

      return Function('o', func);
    } else {
      return function (o) {
        for (var _key in propsToReset) {
          o[_key] = propsToReset[_key];
        }
      };
    }
  }
  /**
   * @en
   * The base class of most of all the objects in Fireball.
   * @zh
   * 大部分对象的基类。
   * @private
   */


  var CCObject = /*#__PURE__*/function () {
    _createClass(CCObject, null, [{
      key: "_deferredDestroy",
      value: function _deferredDestroy() {
        var deleteCount = objectsToDestroy.length;

        for (var i = 0; i < deleteCount; ++i) {
          var obj = objectsToDestroy[i];

          if (!(obj._objFlags & Destroyed)) {
            obj._destroyImmediate();
          }
        } // if we called b.destory() in a.onDestroy(), objectsToDestroy will be resized,
        // but we only destroy the objects which called destory in this frame.


        if (deleteCount === objectsToDestroy.length) {
          objectsToDestroy.length = 0;
        } else {
          objectsToDestroy.splice(0, deleteCount);
        }

        if (_defaultConstants.EDITOR) {
          deferredDestroyTimer = null;
        }
      }
    }]);

    function CCObject() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      _classCallCheck(this, CCObject);

      this._objFlags = void 0;
      this._name = void 0;

      /**
       * @default ""
       * @private
       */
      this._name = name;
      /**
       * @default 0
       * @private
       */

      this._objFlags = 0;
    } // MEMBER

    /**
     * @en The name of the object.
     * @zh 该对象的名称。
     * @default ""
     * @example
     * ```
     * obj.name = "New Obj";
     * ```
     */


    _createClass(CCObject, [{
      key: "destroy",

      /**
       * @en
       * Destroy this Object, and release all its own references to other objects.<br/>
       * Actual object destruction will delayed until before rendering.
       * From the next frame, this object is not usable any more.
       * You can use `isValid(obj)` to check whether the object is destroyed before accessing it.
       * @zh
       * 销毁该对象，并释放所有它对其它对象的引用。<br/>
       * 实际销毁操作会延迟到当前帧渲染前执行。从下一帧开始，该对象将不再可用。
       * 您可以在访问对象之前使用 `isValid(obj)` 来检查对象是否已被销毁。
       * @return whether it is the first time the destroy being called
       * @example
       * ```
       * obj.destroy();
       * ```
       */
      value: function destroy() {
        if (this._objFlags & Destroyed) {
          (0, _debug.warnID)(5000);
          return false;
        }

        if (this._objFlags & ToDestroy) {
          return false;
        }

        this._objFlags |= ToDestroy;
        objectsToDestroy.push(this);

        if (_defaultConstants.EDITOR && deferredDestroyTimer === null && _globalExports.legacyCC.engine && !_globalExports.legacyCC.engine._isUpdating) {
          // auto destroy immediate in edit mode
          // @ts-ignore
          deferredDestroyTimer = setImmediate(CCObject._deferredDestroy);
        }

        return true;
      }
      /**
       * Clear all references in the instance.
       *
       * NOTE: this method will not clear the getter or setter functions which defined in the instance of CCObject.
       *       You can override the _destruct method if you need, for example:
       *       _destruct: function () {
       *           for (var key in this) {
       *               if (this.hasOwnProperty(key)) {
       *                   switch (typeof this[key]) {
       *                       case 'string':
       *                           this[key] = '';
       *                           break;
       *                       case 'object':
       *                       case 'function':
       *                           this[key] = null;
       *                           break;
       *               }
       *           }
       *       }
       *
       */

    }, {
      key: "_destruct",
      value: function _destruct() {
        var ctor = this.constructor;
        var destruct = ctor.__destruct__;

        if (!destruct) {
          destruct = compileDestruct(this, ctor);
          js.value(ctor, '__destruct__', destruct, true);
        }

        destruct(this);
      }
    }, {
      key: "_destroyImmediate",
      value: function _destroyImmediate() {
        if (this._objFlags & Destroyed) {
          (0, _debug.errorID)(5000);
          return;
        } // engine internal callback
        // @ts-ignore


        if (this._onPreDestroy) {
          // @ts-ignore
          this._onPreDestroy();
        }

        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this._destruct();
        }

        this._objFlags |= Destroyed;
      }
    }, {
      key: "name",
      get: function get() {
        return this._name;
      },
      set: function set(value) {
        this._name = value;
      }
      /**
       * @en
       * Indicates whether the object is not yet destroyed. (It will not be available after being destroyed)<br>
       * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
       * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
       * If you want to determine whether the current frame has called `destroy`, use `isValid(obj, true)`,
       * but this is often caused by a particular logical requirements, which is not normally required.
       *
       * @zh
       * 表示该对象是否可用（被 destroy 后将不可用）。<br>
       * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。<br>
       * 因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。<br>
       * 如果希望判断当前帧是否调用过 `destroy`，请使用 `isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
       * @default true
       * @readOnly
       * @example
       * ```ts
       * import { Node, log } from 'cc';
       * const node = new Node();
       * log(node.isValid);    // true
       * node.destroy();
       * log(node.isValid);    // true, still valid in this frame
       * // after a frame...
       * log(node.isValid);    // false, destroyed in the end of last frame
       * ```
       */

    }, {
      key: "isValid",
      get: function get() {
        return !(this._objFlags & Destroyed);
      }
    }]);

    return CCObject;
  }();

  _exports.CCObject = CCObject;
  var prototype = CCObject.prototype;

  if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
    js.get(prototype, 'isRealValid', function () {
      return !(this._objFlags & RealDestroyed);
    });
    /*
    * @en
    * In fact, Object's "destroy" will not trigger the destruct operation in Firebal Editor.
    * The destruct operation will be executed by Undo system later.
    * @zh
    * 事实上，对象的 “destroy” 不会在编辑器中触发析构操作，
    * 析构操作将在 Undo 系统中**延后**执行。
    * @method realDestroyInEditor
    * @private
    */
    // @ts-ignore

    prototype.realDestroyInEditor = function () {
      if (!(this._objFlags & Destroyed)) {
        (0, _debug.warnID)(5001);
        return;
      }

      if (this._objFlags & RealDestroyed) {
        (0, _debug.warnID)(5000);
        return;
      }

      this._destruct();

      this._objFlags |= RealDestroyed;
    };
  }

  if (_defaultConstants.EDITOR) {
    js.value(CCObject, '_clearDeferredDestroyTimer', function () {
      if (deferredDestroyTimer !== null) {
        // @ts-ignore
        clearImmediate(deferredDestroyTimer);
        deferredDestroyTimer = null;
      }
    });
    /*
     * The customized serialization for this object. (Editor Only)
     * @method _serialize
     * @param {Boolean} exporting
     * @return {object} the serialized json data object
     * @private
     */
    // @ts-ignore

    prototype._serialize = null;
  }
  /*
   * Init this object from the custom serialized data.
   * @method _deserialize
   * @param {Object} data - the serialized json data
   * @param {_Deserializer} ctx
   * @private
   */
  // @ts-ignore


  prototype._deserialize = null;
  /*
   * Called before the object being destroyed.
   * @method _onPreDestroy
   * @private
   */
  // @ts-ignore

  prototype._onPreDestroy = null;

  _class.CCClass.fastDefine('cc.Object', CCObject, {
    _name: '',
    _objFlags: 0
  });
  /**
   * Bit mask that controls object states.
   * @enum Object.Flags
   * @private
   */


  js.value(CCObject, 'Flags', {
    Destroyed: Destroyed,
    DontSave: DontSave,
    EditorOnly: EditorOnly,
    Dirty: Dirty,
    DontDestroy: DontDestroy,
    PersistentMask: PersistentMask,
    Destroying: Destroying,
    Deactivating: Deactivating,
    LockedInEditor: LockedInEditor,
    HideInHierarchy: HideInHierarchy,
    IsPreloadStarted: IsPreloadStarted,
    IsOnLoadStarted: IsOnLoadStarted,
    IsOnLoadCalled: IsOnLoadCalled,
    IsOnEnableCalled: IsOnEnableCalled,
    IsStartCalled: IsStartCalled,
    IsEditorOnEnableCalled: IsEditorOnEnableCalled,
    IsPositionLocked: IsPositionLocked,
    IsRotationLocked: IsRotationLocked,
    IsScaleLocked: IsScaleLocked,
    IsAnchorLocked: IsAnchorLocked,
    IsSizeLocked: IsSizeLocked
  });

  /*
   * @en
   * Checks whether the object is non-nil and not yet destroyed.<br>
   * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
   * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
   * If you want to determine whether the current frame has called `destroy`, use `isValid(obj, true)`,
   * but this is often caused by a particular logical requirements, which is not normally required.
   *
   * @zh
   * 检查该对象是否不为 null 并且尚未销毁。<br>
   * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。<br>
   * 因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。<br>
   * 如果希望判断当前帧是否调用过 `destroy`，请使用 `isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
   *
   * @method isValid
   * @param value
   * @param [strictMode=false] - If true, Object called destroy() in this frame will also treated as invalid.
   * @return whether is valid
   * @example
   * ```
   * import { Node, log } from 'cc';
   * var node = new Node();
   * log(isValid(node));    // true
   * node.destroy();
   * log(isValid(node));    // true, still valid in this frame
   * // after a frame...
   * log(isValid(node));    // false, destroyed in the end of last frame
   * ```
   */
  function isValid(value, strictMode) {
    if (_typeof(value) === 'object') {
      return !!value && !(value._objFlags & (strictMode ? Destroyed | ToDestroy : Destroyed));
    } else {
      return typeof value !== 'undefined';
    }
  }

  _globalExports.legacyCC.isValid = isValid;

  if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
    js.value(CCObject, '_willDestroy', function (obj) {
      return !(obj._objFlags & Destroyed) && (obj._objFlags & ToDestroy) > 0;
    });
    js.value(CCObject, '_cancelDestroy', function (obj) {
      obj._objFlags &= ~ToDestroy;
      js.array.fastRemove(objectsToDestroy, obj);
    });
  }

  _globalExports.legacyCC.Object = CCObject;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9vYmplY3QudHMiXSwibmFtZXMiOlsiRGVzdHJveWVkIiwiUmVhbERlc3Ryb3llZCIsIlRvRGVzdHJveSIsIkRvbnRTYXZlIiwiRWRpdG9yT25seSIsIkRpcnR5IiwiRG9udERlc3Ryb3kiLCJEZXN0cm95aW5nIiwiRGVhY3RpdmF0aW5nIiwiTG9ja2VkSW5FZGl0b3IiLCJIaWRlSW5IaWVyYXJjaHkiLCJJc09uRW5hYmxlQ2FsbGVkIiwiSXNFZGl0b3JPbkVuYWJsZUNhbGxlZCIsIklzUHJlbG9hZFN0YXJ0ZWQiLCJJc09uTG9hZENhbGxlZCIsIklzT25Mb2FkU3RhcnRlZCIsIklzU3RhcnRDYWxsZWQiLCJJc1JvdGF0aW9uTG9ja2VkIiwiSXNTY2FsZUxvY2tlZCIsIklzQW5jaG9yTG9ja2VkIiwiSXNTaXplTG9ja2VkIiwiSXNQb3NpdGlvbkxvY2tlZCIsIlBlcnNpc3RlbnRNYXNrIiwib2JqZWN0c1RvRGVzdHJveSIsImRlZmVycmVkRGVzdHJveVRpbWVyIiwiY29tcGlsZURlc3RydWN0Iiwib2JqIiwiY3RvciIsInNob3VsZFNraXBJZCIsImxlZ2FjeUNDIiwiX0Jhc2VOb2RlIiwiQ29tcG9uZW50IiwiaWRUb1NraXAiLCJrZXkiLCJwcm9wc1RvUmVzZXQiLCJoYXNPd25Qcm9wZXJ0eSIsIkNDQ2xhc3MiLCJfaXNDQ0NsYXNzIiwiYXR0cnMiLCJDbGFzcyIsIkF0dHIiLCJnZXRDbGFzc0F0dHJzIiwicHJvcExpc3QiLCJfX3Byb3BzX18iLCJpIiwibGVuZ3RoIiwiYXR0cktleSIsIkRFTElNRVRFUiIsInVuZGVmaW5lZCIsIlNVUFBPUlRfSklUIiwiZnVuYyIsInN0YXRlbWVudCIsIklERU5USUZJRVJfUkUiLCJ0ZXN0IiwiZXNjYXBlRm9ySlMiLCJ2YWwiLCJGdW5jdGlvbiIsIm8iLCJfa2V5IiwiQ0NPYmplY3QiLCJkZWxldGVDb3VudCIsIl9vYmpGbGFncyIsIl9kZXN0cm95SW1tZWRpYXRlIiwic3BsaWNlIiwiRURJVE9SIiwibmFtZSIsIl9uYW1lIiwicHVzaCIsImVuZ2luZSIsIl9pc1VwZGF0aW5nIiwic2V0SW1tZWRpYXRlIiwiX2RlZmVycmVkRGVzdHJveSIsImNvbnN0cnVjdG9yIiwiZGVzdHJ1Y3QiLCJfX2Rlc3RydWN0X18iLCJqcyIsInZhbHVlIiwiX29uUHJlRGVzdHJveSIsIkdBTUVfVklFVyIsIl9kZXN0cnVjdCIsInByb3RvdHlwZSIsIlRFU1QiLCJnZXQiLCJyZWFsRGVzdHJveUluRWRpdG9yIiwiY2xlYXJJbW1lZGlhdGUiLCJfc2VyaWFsaXplIiwiX2Rlc2VyaWFsaXplIiwiZmFzdERlZmluZSIsImlzVmFsaWQiLCJzdHJpY3RNb2RlIiwiYXJyYXkiLCJmYXN0UmVtb3ZlIiwiT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUNBO0FBRUEsTUFBTUEsU0FBUyxHQUFHLEtBQUssQ0FBdkI7QUFDQSxNQUFNQyxhQUFhLEdBQUcsS0FBSyxDQUEzQjtBQUNBLE1BQU1DLFNBQVMsR0FBRyxLQUFLLENBQXZCO0FBQ0EsTUFBTUMsUUFBUSxHQUFHLEtBQUssQ0FBdEI7QUFDQSxNQUFNQyxVQUFVLEdBQUcsS0FBSyxDQUF4QjtBQUNBLE1BQU1DLEtBQUssR0FBRyxLQUFLLENBQW5CO0FBQ0EsTUFBTUMsV0FBVyxHQUFHLEtBQUssQ0FBekI7QUFDQSxNQUFNQyxVQUFVLEdBQUcsS0FBSyxDQUF4QjtBQUNBLE1BQU1DLFlBQVksR0FBRyxLQUFLLENBQTFCO0FBQ0EsTUFBTUMsY0FBYyxHQUFHLEtBQUssQ0FBNUIsQyxDQUNBOztBQUNBLE1BQU1DLGVBQWUsR0FBRyxLQUFLLEVBQTdCO0FBRUEsTUFBTUMsZ0JBQWdCLEdBQUcsS0FBSyxFQUE5QjtBQUNBLE1BQU1DLHNCQUFzQixHQUFHLEtBQUssRUFBcEM7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyxLQUFLLEVBQTlCO0FBQ0EsTUFBTUMsY0FBYyxHQUFHLEtB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QUFrQlosS0FBbEIsRUFBOEJhLFVBQTlCLEVBQW9EO0FBQ3ZELFFBQUksUUFBT2IsS0FBUCxNQUFpQixRQUFyQixFQUErQjtBQUMzQixhQUFPLENBQUMsQ0FBQ0EsS0FBRixJQUFXLEVBQUVBLEtBQUssQ0FBQ2YsU0FBTixJQUFtQjRCLFVBQVUsR0FBSXpGLFNBQVMsR0FBR0UsU0FBaEIsR0FBNkJGLFNBQTFELENBQUYsQ0FBbEI7QUFDSCxLQUZELE1BR0s7QUFDRCxhQUFPLE9BQU80RSxLQUFQLEtBQWlCLFdBQXhCO0FBQ0g7QUFDSjs7QUFDRC9DLDBCQUFTMkQsT0FBVCxHQUFtQkEsT0FBbkI7O0FBRUEsTUFBSXhCLDRCQUFVaUIsc0JBQWQsRUFBb0I7QUFDaEJOLElBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTakIsUUFBVCxFQUFtQixjQUFuQixFQUFtQyxVQUFDakMsR0FBRCxFQUFTO0FBQ3hDLGFBQU8sRUFBRUEsR0FBRyxDQUFDbUMsU0FBSixHQUFnQjdELFNBQWxCLEtBQWdDLENBQUMwQixHQUFHLENBQUNtQyxTQUFKLEdBQWdCM0QsU0FBakIsSUFBOEIsQ0FBckU7QUFDSCxLQUZEO0FBR0F5RSxJQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBU2pCLFFBQVQsRUFBbUIsZ0JBQW5CLEVBQXFDLFVBQUNqQyxHQUFELEVBQVM7QUFDMUNBLE1BQUFBLEdBQUcsQ0FBQ21DLFNBQUosSUFBaUIsQ0FBQzNELFNBQWxCO0FBQ0F5RSxNQUFBQSxFQUFFLENBQUNlLEtBQUgsQ0FBU0MsVUFBVCxDQUFvQnBFLGdCQUFwQixFQUFzQ0csR0FBdEM7QUFDSCxLQUhEO0FBSUg7O0FBRURHLDBCQUFTK0QsTUFBVCxHQUFrQmpDLFFBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmUvZGF0YVxyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIGpzIGZyb20gJy4uL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgQ0NDbGFzcyB9IGZyb20gJy4vY2xhc3MnO1xyXG5pbXBvcnQgeyBlcnJvcklELCB3YXJuSUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IFNVUFBPUlRfSklULCBFRElUT1IsIFRFU1QgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8vIGRlZmluaXRpb25zIGZvciBDQ09iamVjdC5GbGFnc1xyXG5cclxuY29uc3QgRGVzdHJveWVkID0gMSA8PCAwO1xyXG5jb25zdCBSZWFsRGVzdHJveWVkID0gMSA8PCAxO1xyXG5jb25zdCBUb0Rlc3Ryb3kgPSAxIDw8IDI7XHJcbmNvbnN0IERvbnRTYXZlID0gMSA8PCAzO1xyXG5jb25zdCBFZGl0b3JPbmx5ID0gMSA8PCA0O1xyXG5jb25zdCBEaXJ0eSA9IDEgPDwgNTtcclxuY29uc3QgRG9udERlc3Ryb3kgPSAxIDw8IDY7XHJcbmNvbnN0IERlc3Ryb3lpbmcgPSAxIDw8IDc7XHJcbmNvbnN0IERlYWN0aXZhdGluZyA9IDEgPDwgODtcclxuY29uc3QgTG9ja2VkSW5FZGl0b3IgPSAxIDw8IDk7XHJcbi8vIHZhciBIaWRlSW5HYW1lID0gMSA8PCA5O1xyXG5jb25zdCBIaWRlSW5IaWVyYXJjaHkgPSAxIDw8IDEwO1xyXG5cclxuY29uc3QgSXNPbkVuYWJsZUNhbGxlZCA9IDEgPDwgMTE7XHJcbmNvbnN0IElzRWRpdG9yT25FbmFibGVDYWxsZWQgPSAxIDw8IDEyO1xyXG5jb25zdCBJc1ByZWxvYWRTdGFydGVkID0gMSA8PCAxMztcclxuY29uc3QgSXNPbkxvYWRDYWxsZWQgPSAxIDw8IDE0O1xyXG5jb25zdCBJc09uTG9hZFN0YXJ0ZWQgPSAxIDw8IDE1O1xyXG5jb25zdCBJc1N0YXJ0Q2FsbGVkID0gMSA8PCAxNjtcclxuXHJcbmNvbnN0IElzUm90YXRpb25Mb2NrZWQgPSAxIDw8IDE3O1xyXG5jb25zdCBJc1NjYWxlTG9ja2VkID0gMSA8PCAxODtcclxuY29uc3QgSXNBbmNob3JMb2NrZWQgPSAxIDw8IDE5O1xyXG5jb25zdCBJc1NpemVMb2NrZWQgPSAxIDw8IDIwO1xyXG5jb25zdCBJc1Bvc2l0aW9uTG9ja2VkID0gMSA8PCAyMTtcclxuXHJcbi8vIHZhciBIaWRlID0gSGlkZUluR2FtZSB8IEhpZGVJbkVkaXRvcjtcclxuLy8gc2hvdWxkIG5vdCBjbG9uZSBvciBzZXJpYWxpemUgdGhlc2UgZmxhZ3NcclxuY29uc3QgUGVyc2lzdGVudE1hc2sgPSB+KFRvRGVzdHJveSB8IERpcnR5IHwgRGVzdHJveWluZyB8IERvbnREZXN0cm95IHwgRGVhY3RpdmF0aW5nIHxcclxuICAgICAgICAgICAgICAgICAgICAgICBJc1ByZWxvYWRTdGFydGVkIHwgSXNPbkxvYWRTdGFydGVkIHwgSXNPbkxvYWRDYWxsZWQgfCBJc1N0YXJ0Q2FsbGVkIHxcclxuICAgICAgICAgICAgICAgICAgICAgICBJc09uRW5hYmxlQ2FsbGVkIHwgSXNFZGl0b3JPbkVuYWJsZUNhbGxlZCB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgSXNSb3RhdGlvbkxvY2tlZCB8IElzU2NhbGVMb2NrZWQgfCBJc0FuY2hvckxvY2tlZCB8IElzU2l6ZUxvY2tlZCB8IElzUG9zaXRpb25Mb2NrZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAvKlJlZ2lzdGVyZWRJbkVkaXRvciovKTtcclxuXHJcbmNvbnN0IG9iamVjdHNUb0Rlc3Ryb3k6IGFueSA9IFtdO1xyXG5sZXQgZGVmZXJyZWREZXN0cm95VGltZXIgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gY29tcGlsZURlc3RydWN0IChvYmosIGN0b3IpIHtcclxuICAgIGNvbnN0IHNob3VsZFNraXBJZCA9IG9iaiBpbnN0YW5jZW9mIGxlZ2FjeUNDLl9CYXNlTm9kZSB8fCBvYmogaW5zdGFuY2VvZiBsZWdhY3lDQy5Db21wb25lbnQ7XHJcbiAgICBjb25zdCBpZFRvU2tpcCA9IHNob3VsZFNraXBJZCA/ICdfaWQnIDogbnVsbDtcclxuXHJcbiAgICBsZXQga2V5O1xyXG4gICAgY29uc3QgcHJvcHNUb1Jlc2V0ID0ge307XHJcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gaWRUb1NraXApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIG9ialtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzVG9SZXNldFtrZXldID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzVG9SZXNldFtrZXldID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIE92ZXJ3cml0ZSBwcm9wc1RvUmVzZXQgYWNjb3JkaW5nIHRvIENsYXNzXHJcbiAgICBpZiAoQ0NDbGFzcy5faXNDQ0NsYXNzKGN0b3IpKSB7XHJcbiAgICAgICAgY29uc3QgYXR0cnMgPSBsZWdhY3lDQy5DbGFzcy5BdHRyLmdldENsYXNzQXR0cnMoY3Rvcik7XHJcbiAgICAgICAgY29uc3QgcHJvcExpc3QgPSBjdG9yLl9fcHJvcHNfXztcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGtleSA9IHByb3BMaXN0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBhdHRyS2V5ID0ga2V5ICsgbGVnYWN5Q0MuQ2xhc3MuQXR0ci5ERUxJTUVURVIgKyAnZGVmYXVsdCc7XHJcbiAgICAgICAgICAgIGlmIChhdHRyS2V5IGluIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkU2tpcElkICYmIGtleSA9PT0gJ19pZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIGF0dHJzW2F0dHJLZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHNUb1Jlc2V0W2tleV0gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzVG9SZXNldFtrZXldID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHNUb1Jlc2V0W2tleV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChTVVBQT1JUX0pJVCkge1xyXG4gICAgICAgIC8vIGNvbXBpbGUgY29kZVxyXG4gICAgICAgIGxldCBmdW5jID0gJyc7XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6IGZvcmluXHJcbiAgICAgICAgZm9yIChrZXkgaW4gcHJvcHNUb1Jlc2V0KSB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQ7XHJcbiAgICAgICAgICAgIGlmIChDQ0NsYXNzLklERU5USUZJRVJfUkUudGVzdChrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSAnby4nICsga2V5ICsgJz0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gJ29bJyArIENDQ2xhc3MuZXNjYXBlRm9ySlMoa2V5KSArICddPSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHZhbCA9IHByb3BzVG9SZXNldFtrZXldO1xyXG4gICAgICAgICAgICBpZiAodmFsID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gJ1wiXCInO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmMgKz0gKHN0YXRlbWVudCArIHZhbCArICc7XFxuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBGdW5jdGlvbignbycsIGZ1bmMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIChvKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgX2tleSBpbiBwcm9wc1RvUmVzZXQpIHtcclxuICAgICAgICAgICAgICAgIG9bX2tleV0gPSBwcm9wc1RvUmVzZXRbX2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSBiYXNlIGNsYXNzIG9mIG1vc3Qgb2YgYWxsIHRoZSBvYmplY3RzIGluIEZpcmViYWxsLlxyXG4gKiBAemhcclxuICog5aSn6YOo5YiG5a+56LGh55qE5Z+657G744CCXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5jbGFzcyBDQ09iamVjdCB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBfZGVmZXJyZWREZXN0cm95ICgpIHtcclxuICAgICAgICBjb25zdCBkZWxldGVDb3VudCA9IG9iamVjdHNUb0Rlc3Ryb3kubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVsZXRlQ291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBvYmplY3RzVG9EZXN0cm95W2ldO1xyXG4gICAgICAgICAgICBpZiAoIShvYmouX29iakZsYWdzICYgRGVzdHJveWVkKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqLl9kZXN0cm95SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgd2UgY2FsbGVkIGIuZGVzdG9yeSgpIGluIGEub25EZXN0cm95KCksIG9iamVjdHNUb0Rlc3Ryb3kgd2lsbCBiZSByZXNpemVkLFxyXG4gICAgICAgIC8vIGJ1dCB3ZSBvbmx5IGRlc3Ryb3kgdGhlIG9iamVjdHMgd2hpY2ggY2FsbGVkIGRlc3RvcnkgaW4gdGhpcyBmcmFtZS5cclxuICAgICAgICBpZiAoZGVsZXRlQ291bnQgPT09IG9iamVjdHNUb0Rlc3Ryb3kubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIG9iamVjdHNUb0Rlc3Ryb3kubGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG9iamVjdHNUb0Rlc3Ryb3kuc3BsaWNlKDAsIGRlbGV0ZUNvdW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgZGVmZXJyZWREZXN0cm95VGltZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29iakZsYWdzOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAobmFtZSA9ICcnKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlZmF1bHQgXCJcIlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZWZhdWx0IDBcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX29iakZsYWdzID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNRU1CRVJcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbmFtZSBvZiB0aGUgb2JqZWN0LlxyXG4gICAgICogQHpoIOivpeWvueixoeeahOWQjeensOOAglxyXG4gICAgICogQGRlZmF1bHQgXCJcIlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogb2JqLm5hbWUgPSBcIk5ldyBPYmpcIjtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBnZXQgbmFtZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcbiAgICBzZXQgbmFtZSAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBvYmplY3QgaXMgbm90IHlldCBkZXN0cm95ZWQuIChJdCB3aWxsIG5vdCBiZSBhdmFpbGFibGUgYWZ0ZXIgYmVpbmcgZGVzdHJveWVkKTxicj5cclxuICAgICAqIFdoZW4gYW4gb2JqZWN0J3MgYGRlc3Ryb3lgIGlzIGNhbGxlZCwgaXQgaXMgYWN0dWFsbHkgZGVzdHJveWVkIGFmdGVyIHRoZSBlbmQgb2YgdGhpcyBmcmFtZS5cclxuICAgICAqIFNvIGBpc1ZhbGlkYCB3aWxsIHJldHVybiBmYWxzZSBmcm9tIHRoZSBuZXh0IGZyYW1lLCB3aGlsZSBgaXNWYWxpZGAgaW4gdGhlIGN1cnJlbnQgZnJhbWUgd2lsbCBzdGlsbCBiZSB0cnVlLlxyXG4gICAgICogSWYgeW91IHdhbnQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGN1cnJlbnQgZnJhbWUgaGFzIGNhbGxlZCBgZGVzdHJveWAsIHVzZSBgaXNWYWxpZChvYmosIHRydWUpYCxcclxuICAgICAqIGJ1dCB0aGlzIGlzIG9mdGVuIGNhdXNlZCBieSBhIHBhcnRpY3VsYXIgbG9naWNhbCByZXF1aXJlbWVudHMsIHdoaWNoIGlzIG5vdCBub3JtYWxseSByZXF1aXJlZC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOihqOekuuivpeWvueixoeaYr+WQpuWPr+eUqO+8iOiiqyBkZXN0cm95IOWQjuWwhuS4jeWPr+eUqO+8ieOAgjxicj5cclxuICAgICAqIOW9k+S4gOS4quWvueixoeeahCBgZGVzdHJveWAg6LCD55So5Lul5ZCO77yM5Lya5Zyo6L+Z5LiA5bin57uT5p2f5ZCO5omN55yf5q2j6ZSA5q+B44CCPGJyPlxyXG4gICAgICog5Zug5q2k5LuO5LiL5LiA5bin5byA5aeLIGBpc1ZhbGlkYCDlsLHkvJrov5Tlm54gZmFsc2XvvIzogIzlvZPliY3luKflhoUgYGlzVmFsaWRgIOS7jeeEtuS8muaYryB0cnVl44CCPGJyPlxyXG4gICAgICog5aaC5p6c5biM5pyb5Yik5pat5b2T5YmN5bin5piv5ZCm6LCD55So6L+HIGBkZXN0cm95YO+8jOivt+S9v+eUqCBgaXNWYWxpZChvYmosIHRydWUpYO+8jOS4jei/h+i/meW+gOW+gOaYr+eJueauiueahOS4muWKoemcgOaxguW8lei1t+eahO+8jOmAmuW4uOaDheWGteS4i+S4jemcgOimgei/meagt+OAglxyXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxyXG4gICAgICogQHJlYWRPbmx5XHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IE5vZGUsIGxvZyB9IGZyb20gJ2NjJztcclxuICAgICAqIGNvbnN0IG5vZGUgPSBuZXcgTm9kZSgpO1xyXG4gICAgICogbG9nKG5vZGUuaXNWYWxpZCk7ICAgIC8vIHRydWVcclxuICAgICAqIG5vZGUuZGVzdHJveSgpO1xyXG4gICAgICogbG9nKG5vZGUuaXNWYWxpZCk7ICAgIC8vIHRydWUsIHN0aWxsIHZhbGlkIGluIHRoaXMgZnJhbWVcclxuICAgICAqIC8vIGFmdGVyIGEgZnJhbWUuLi5cclxuICAgICAqIGxvZyhub2RlLmlzVmFsaWQpOyAgICAvLyBmYWxzZSwgZGVzdHJveWVkIGluIHRoZSBlbmQgb2YgbGFzdCBmcmFtZVxyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIGdldCBpc1ZhbGlkICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gISh0aGlzLl9vYmpGbGFncyAmIERlc3Ryb3llZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIERlc3Ryb3kgdGhpcyBPYmplY3QsIGFuZCByZWxlYXNlIGFsbCBpdHMgb3duIHJlZmVyZW5jZXMgdG8gb3RoZXIgb2JqZWN0cy48YnIvPlxyXG4gICAgICogQWN0dWFsIG9iamVjdCBkZXN0cnVjdGlvbiB3aWxsIGRlbGF5ZWQgdW50aWwgYmVmb3JlIHJlbmRlcmluZy5cclxuICAgICAqIEZyb20gdGhlIG5leHQgZnJhbWUsIHRoaXMgb2JqZWN0IGlzIG5vdCB1c2FibGUgYW55IG1vcmUuXHJcbiAgICAgKiBZb3UgY2FuIHVzZSBgaXNWYWxpZChvYmopYCB0byBjaGVjayB3aGV0aGVyIHRoZSBvYmplY3QgaXMgZGVzdHJveWVkIGJlZm9yZSBhY2Nlc3NpbmcgaXQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmUgOavgeivpeWvueixoe+8jOW5tumHiuaUvuaJgOacieWug+WvueWFtuWug+WvueixoeeahOW8leeUqOOAgjxici8+XHJcbiAgICAgKiDlrp7pmYXplIDmr4Hmk43kvZzkvJrlu7bov5/liLDlvZPliY3luKfmuLLmn5PliY3miafooYzjgILku47kuIvkuIDluKflvIDlp4vvvIzor6Xlr7nosaHlsIbkuI3lho3lj6/nlKjjgIJcclxuICAgICAqIOaCqOWPr+S7peWcqOiuv+mXruWvueixoeS5i+WJjeS9v+eUqCBgaXNWYWxpZChvYmopYCDmnaXmo4Dmn6Xlr7nosaHmmK/lkKblt7LooqvplIDmr4HjgIJcclxuICAgICAqIEByZXR1cm4gd2hldGhlciBpdCBpcyB0aGUgZmlyc3QgdGltZSB0aGUgZGVzdHJveSBiZWluZyBjYWxsZWRcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIG9iai5kZXN0cm95KCk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlc3Ryb3kgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9vYmpGbGFncyAmIERlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNTAwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX29iakZsYWdzICYgVG9EZXN0cm95KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fb2JqRmxhZ3MgfD0gVG9EZXN0cm95O1xyXG4gICAgICAgIG9iamVjdHNUb0Rlc3Ryb3kucHVzaCh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKEVESVRPUiAmJiBkZWZlcnJlZERlc3Ryb3lUaW1lciA9PT0gbnVsbCAmJiBsZWdhY3lDQy5lbmdpbmUgJiYgISBsZWdhY3lDQy5lbmdpbmUuX2lzVXBkYXRpbmcpIHtcclxuICAgICAgICAgICAgLy8gYXV0byBkZXN0cm95IGltbWVkaWF0ZSBpbiBlZGl0IG1vZGVcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBkZWZlcnJlZERlc3Ryb3lUaW1lciA9IHNldEltbWVkaWF0ZShDQ09iamVjdC5fZGVmZXJyZWREZXN0cm95KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciBhbGwgcmVmZXJlbmNlcyBpbiB0aGUgaW5zdGFuY2UuXHJcbiAgICAgKlxyXG4gICAgICogTk9URTogdGhpcyBtZXRob2Qgd2lsbCBub3QgY2xlYXIgdGhlIGdldHRlciBvciBzZXR0ZXIgZnVuY3Rpb25zIHdoaWNoIGRlZmluZWQgaW4gdGhlIGluc3RhbmNlIG9mIENDT2JqZWN0LlxyXG4gICAgICogICAgICAgWW91IGNhbiBvdmVycmlkZSB0aGUgX2Rlc3RydWN0IG1ldGhvZCBpZiB5b3UgbmVlZCwgZm9yIGV4YW1wbGU6XHJcbiAgICAgKiAgICAgICBfZGVzdHJ1Y3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAqICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcykge1xyXG4gICAgICogICAgICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiB0aGlzW2tleV0pIHtcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSAnJztcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IG51bGw7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICogICAgICAgICAgICAgICB9XHJcbiAgICAgKiAgICAgICAgICAgfVxyXG4gICAgICogICAgICAgfVxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9kZXN0cnVjdCAoKSB7XHJcbiAgICAgICAgY29uc3QgY3RvcjogYW55ID0gdGhpcy5jb25zdHJ1Y3RvcjtcclxuICAgICAgICBsZXQgZGVzdHJ1Y3QgPSBjdG9yLl9fZGVzdHJ1Y3RfXztcclxuICAgICAgICBpZiAoIWRlc3RydWN0KSB7XHJcbiAgICAgICAgICAgIGRlc3RydWN0ID0gY29tcGlsZURlc3RydWN0KHRoaXMsIGN0b3IpO1xyXG4gICAgICAgICAgICBqcy52YWx1ZShjdG9yLCAnX19kZXN0cnVjdF9fJywgZGVzdHJ1Y3QsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZXN0cnVjdCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2Rlc3Ryb3lJbW1lZGlhdGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9vYmpGbGFncyAmIERlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDUwMDApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVuZ2luZSBpbnRlcm5hbCBjYWxsYmFja1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBpZiAodGhpcy5fb25QcmVEZXN0cm95KSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgdGhpcy5fb25QcmVEZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUVESVRPUiB8fCBsZWdhY3lDQy5HQU1FX1ZJRVcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVzdHJ1Y3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX29iakZsYWdzIHw9IERlc3Ryb3llZDtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcHJvdG90eXBlID0gQ0NPYmplY3QucHJvdG90eXBlO1xyXG5pZiAoRURJVE9SIHx8IFRFU1QpIHtcclxuICAgIGpzLmdldChwcm90b3R5cGUsICdpc1JlYWxWYWxpZCcsIGZ1bmN0aW9uICh0aGlzOiBDQ09iamVjdCkge1xyXG4gICAgICAgIHJldHVybiAhKHRoaXMuX29iakZsYWdzICYgUmVhbERlc3Ryb3llZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKlxyXG4gICAgKiBAZW5cclxuICAgICogSW4gZmFjdCwgT2JqZWN0J3MgXCJkZXN0cm95XCIgd2lsbCBub3QgdHJpZ2dlciB0aGUgZGVzdHJ1Y3Qgb3BlcmF0aW9uIGluIEZpcmViYWwgRWRpdG9yLlxyXG4gICAgKiBUaGUgZGVzdHJ1Y3Qgb3BlcmF0aW9uIHdpbGwgYmUgZXhlY3V0ZWQgYnkgVW5kbyBzeXN0ZW0gbGF0ZXIuXHJcbiAgICAqIEB6aFxyXG4gICAgKiDkuovlrp7kuIrvvIzlr7nosaHnmoQg4oCcZGVzdHJveeKAnSDkuI3kvJrlnKjnvJbovpHlmajkuK3op6blj5HmnpDmnoTmk43kvZzvvIxcclxuICAgICog5p6Q5p6E5pON5L2c5bCG5ZyoIFVuZG8g57O757uf5LitKirlu7blkI4qKuaJp+ihjOOAglxyXG4gICAgKiBAbWV0aG9kIHJlYWxEZXN0cm95SW5FZGl0b3JcclxuICAgICogQHByaXZhdGVcclxuICAgICovXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcm90b3R5cGUucmVhbERlc3Ryb3lJbkVkaXRvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoICEodGhpcy5fb2JqRmxhZ3MgJiBEZXN0cm95ZWQpICkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNTAwMSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX29iakZsYWdzICYgUmVhbERlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNTAwMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGVzdHJ1Y3QoKTtcclxuICAgICAgICB0aGlzLl9vYmpGbGFncyB8PSBSZWFsRGVzdHJveWVkO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKEVESVRPUikge1xyXG4gICAganMudmFsdWUoQ0NPYmplY3QsICdfY2xlYXJEZWZlcnJlZERlc3Ryb3lUaW1lcicsICgpID0+IHtcclxuICAgICAgICBpZiAoZGVmZXJyZWREZXN0cm95VGltZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBjbGVhckltbWVkaWF0ZShkZWZlcnJlZERlc3Ryb3lUaW1lcik7XHJcbiAgICAgICAgICAgIGRlZmVycmVkRGVzdHJveVRpbWVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhlIGN1c3RvbWl6ZWQgc2VyaWFsaXphdGlvbiBmb3IgdGhpcyBvYmplY3QuIChFZGl0b3IgT25seSlcclxuICAgICAqIEBtZXRob2QgX3NlcmlhbGl6ZVxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBleHBvcnRpbmdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0gdGhlIHNlcmlhbGl6ZWQganNvbiBkYXRhIG9iamVjdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJvdG90eXBlLl9zZXJpYWxpemUgPSBudWxsO1xyXG59XHJcblxyXG4vKlxyXG4gKiBJbml0IHRoaXMgb2JqZWN0IGZyb20gdGhlIGN1c3RvbSBzZXJpYWxpemVkIGRhdGEuXHJcbiAqIEBtZXRob2QgX2Rlc2VyaWFsaXplXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gdGhlIHNlcmlhbGl6ZWQganNvbiBkYXRhXHJcbiAqIEBwYXJhbSB7X0Rlc2VyaWFsaXplcn0gY3R4XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG4vLyBAdHMtaWdub3JlXHJcbnByb3RvdHlwZS5fZGVzZXJpYWxpemUgPSBudWxsO1xyXG4vKlxyXG4gKiBDYWxsZWQgYmVmb3JlIHRoZSBvYmplY3QgYmVpbmcgZGVzdHJveWVkLlxyXG4gKiBAbWV0aG9kIF9vblByZURlc3Ryb3lcclxuICogQHByaXZhdGVcclxuICovXHJcbi8vIEB0cy1pZ25vcmVcclxucHJvdG90eXBlLl9vblByZURlc3Ryb3kgPSBudWxsO1xyXG5cclxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5PYmplY3QnLCBDQ09iamVjdCwgeyBfbmFtZTogJycsIF9vYmpGbGFnczogMCB9KTtcclxuXHJcbi8qKlxyXG4gKiBCaXQgbWFzayB0aGF0IGNvbnRyb2xzIG9iamVjdCBzdGF0ZXMuXHJcbiAqIEBlbnVtIE9iamVjdC5GbGFnc1xyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuanMudmFsdWUoQ0NPYmplY3QsICdGbGFncycsIHtcclxuICAgIERlc3Ryb3llZCxcclxuICAgIERvbnRTYXZlLFxyXG4gICAgRWRpdG9yT25seSxcclxuICAgIERpcnR5LFxyXG4gICAgRG9udERlc3Ryb3ksXHJcbiAgICBQZXJzaXN0ZW50TWFzayxcclxuICAgIERlc3Ryb3lpbmcsXHJcbiAgICBEZWFjdGl2YXRpbmcsXHJcbiAgICBMb2NrZWRJbkVkaXRvcixcclxuICAgIEhpZGVJbkhpZXJhcmNoeSxcclxuICAgIElzUHJlbG9hZFN0YXJ0ZWQsXHJcbiAgICBJc09uTG9hZFN0YXJ0ZWQsXHJcbiAgICBJc09uTG9hZENhbGxlZCxcclxuICAgIElzT25FbmFibGVDYWxsZWQsXHJcbiAgICBJc1N0YXJ0Q2FsbGVkLFxyXG4gICAgSXNFZGl0b3JPbkVuYWJsZUNhbGxlZCxcclxuICAgIElzUG9zaXRpb25Mb2NrZWQsXHJcbiAgICBJc1JvdGF0aW9uTG9ja2VkLFxyXG4gICAgSXNTY2FsZUxvY2tlZCxcclxuICAgIElzQW5jaG9yTG9ja2VkLFxyXG4gICAgSXNTaXplTG9ja2VkLFxyXG59KTtcclxuXHJcbmRlY2xhcmUgbmFtZXNwYWNlIENDT2JqZWN0IHtcclxuICAgIGV4cG9ydCBlbnVtIEZsYWdzIHtcclxuICAgICAgICBEZXN0cm95ZWQsXHJcbiAgICAgICAgLy8gVG9EZXN0cm95OiBUb0Rlc3Ryb3ksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBUaGUgb2JqZWN0IHdpbGwgbm90IGJlIHNhdmVkLlxyXG4gICAgICAgICAqIEB6aCDor6Xlr7nosaHlsIbkuI3kvJrooqvkv53lrZjjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICBEb250U2F2ZSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIFRoZSBvYmplY3Qgd2lsbCBub3QgYmUgc2F2ZWQgd2hlbiBidWlsZGluZyBhIHBsYXllci5cclxuICAgICAgICAgKiBAemgg5p6E5bu66aG555uu5pe277yM6K+l5a+56LGh5bCG5LiN5Lya6KKr5L+d5a2Y44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRWRpdG9yT25seSxcclxuXHJcbiAgICAgICAgRGlydHksXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBEb250IGRlc3Ryb3kgYXV0b21hdGljYWxseSB3aGVuIGxvYWRpbmcgYSBuZXcgc2NlbmUuXHJcbiAgICAgICAgICogQHpoIOWKoOi9veS4gOS4quaWsOWcuuaZr+aXtu+8jOS4jeiHquWKqOWIoOmZpOivpeWvueixoVxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRG9udERlc3Ryb3ksXHJcblxyXG4gICAgICAgIFBlcnNpc3RlbnRNYXNrLFxyXG5cclxuICAgICAgICAvLyBGTEFHUyBGT1IgRU5HSU5FXHJcblxyXG4gICAgICAgIERlc3Ryb3lpbmcsXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBUaGUgbm9kZSBpcyBkZWFjdGl2YXRpbmcuXHJcbiAgICAgICAgICogQHpoIOiKgueCueato+WcqOWPjea/gOa0u+eahOi/h+eoi+S4reOAglxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRGVhY3RpdmF0aW5nLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gVGhlIGxvY2sgbm9kZSwgd2hlbiB0aGUgbm9kZSBpcyBsb2NrZWQsIGNhbm5vdCBiZSBjbGlja2VkIGluIHRoZSBzY2VuZS5cclxuICAgICAgICAgKiBAemgg6ZSB5a6a6IqC54K577yM6ZSB5a6a5ZCO5Zy65pmv5YaF5LiN6IO954K55Ye7XHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBMb2NrZWRJbkVkaXRvcixcclxuXHJcbiAgICAgICAgLy8vICoqXHJcbiAgICAgICAgLy8gKiBAZW5cclxuICAgICAgICAvLyAqIEhpZGUgaW4gZ2FtZSBhbmQgaGllcmFyY2h5LlxyXG4gICAgICAgIC8vICogVGhpcyBmbGFnIGlzIHJlYWRvbmx5LCBpdCBjYW4gb25seSBiZSB1c2VkIGFzIGFuIGFyZ3VtZW50IG9mIHNjZW5lLmFkZEVudGl0eSgpIG9yIEVudGl0eS5jcmVhdGVXaXRoRmxhZ3MoKS5cclxuICAgICAgICAvLyAqIEB6aFxyXG4gICAgICAgIC8vICog5Zyo5ri45oiP5ZKM5bGC57qn5Lit6ZqQ6JeP6K+l5a+56LGh44CCPGJyLz5cclxuICAgICAgICAvLyAqIOivpeagh+iusOWPquivu++8jOWug+WPquiDveiiq+eUqOS9nCBzY2VuZS5hZGRFbnRpdHkoKeeahOS4gOS4quWPguaVsOOAglxyXG4gICAgICAgIC8vICovXHJcbiAgICAgICAgLy8gSGlkZUluR2FtZTogSGlkZUluR2FtZSxcclxuXHJcbiAgICAgICAgLy8gRkxBR1MgRk9SIEVESVRPUlxyXG5cclxuICAgICAgICAvLy8gKipcclxuICAgICAgICAvLyAqIEBlbiBUaGlzIGZsYWcgaXMgcmVhZG9ubHksIGl0IGNhbiBvbmx5IGJlIHVzZWQgYXMgYW4gYXJndW1lbnQgb2Ygc2NlbmUuYWRkRW50aXR5KCkgb3IgRW50aXR5LmNyZWF0ZVdpdGhGbGFncygpLlxyXG4gICAgICAgIC8vICogQHpoIOivpeagh+iusOWPquivu++8jOWug+WPquiDveiiq+eUqOS9nCBzY2VuZS5hZGRFbnRpdHkoKeeahOS4gOS4quWPguaVsOOAglxyXG4gICAgICAgIC8vICovXHJcbiAgICAgICAgSGlkZUluSGllcmFyY2h5LFxyXG5cclxuICAgICAgICAvLy8gKipcclxuICAgICAgICAvLyAqIEBlblxyXG4gICAgICAgIC8vICogSGlkZSBpbiBnYW1lIHZpZXcsIGhpZXJhcmNoeSwgYW5kIHNjZW5lIHZpZXcuLi4gZXRjLlxyXG4gICAgICAgIC8vICogVGhpcyBmbGFnIGlzIHJlYWRvbmx5LCBpdCBjYW4gb25seSBiZSB1c2VkIGFzIGFuIGFyZ3VtZW50IG9mIHNjZW5lLmFkZEVudGl0eSgpIG9yIEVudGl0eS5jcmVhdGVXaXRoRmxhZ3MoKS5cclxuICAgICAgICAvLyAqIEB6aFxyXG4gICAgICAgIC8vICog5Zyo5ri45oiP6KeG5Zu+77yM5bGC57qn77yM5Zy65pmv6KeG5Zu+562J562JLi4u5Lit6ZqQ6JeP6K+l5a+56LGh44CCXHJcbiAgICAgICAgLy8gKiDor6XmoIforrDlj6ror7vvvIzlroPlj6rog73ooqvnlKjkvZwgc2NlbmUuYWRkRW50aXR5KCnnmoTkuIDkuKrlj4LmlbDjgIJcclxuICAgICAgICAvLyAqL1xyXG4gICAgICAgIC8vIEhpZGU6IEhpZGUsXHJcblxyXG4gICAgICAgIC8vLy8gVVVJRCBSZWdpc3RlcmVkIGluIGVkaXRvclxyXG4gICAgICAgIC8vIFJlZ2lzdGVyZWRJbkVkaXRvcjogUmVnaXN0ZXJlZEluRWRpdG9yLFxyXG5cclxuICAgICAgICAvLyBGTEFHUyBGT1IgQ09NUE9ORU5UXHJcblxyXG4gICAgICAgIElzUHJlbG9hZFN0YXJ0ZWQsXHJcbiAgICAgICAgSXNPbkxvYWRTdGFydGVkLFxyXG4gICAgICAgIElzT25Mb2FkQ2FsbGVkLFxyXG4gICAgICAgIElzT25FbmFibGVDYWxsZWQsXHJcbiAgICAgICAgSXNTdGFydENhbGxlZCxcclxuICAgICAgICBJc0VkaXRvck9uRW5hYmxlQ2FsbGVkLFxyXG5cclxuICAgICAgICBJc1Bvc2l0aW9uTG9ja2VkLFxyXG4gICAgICAgIElzUm90YXRpb25Mb2NrZWQsXHJcbiAgICAgICAgSXNTY2FsZUxvY2tlZCxcclxuICAgICAgICBJc0FuY2hvckxvY2tlZCxcclxuICAgICAgICBJc1NpemVMb2NrZWQsXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqIEBlblxyXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgb2JqZWN0IGlzIG5vbi1uaWwgYW5kIG5vdCB5ZXQgZGVzdHJveWVkLjxicj5cclxuICogV2hlbiBhbiBvYmplY3QncyBgZGVzdHJveWAgaXMgY2FsbGVkLCBpdCBpcyBhY3R1YWxseSBkZXN0cm95ZWQgYWZ0ZXIgdGhlIGVuZCBvZiB0aGlzIGZyYW1lLlxyXG4gKiBTbyBgaXNWYWxpZGAgd2lsbCByZXR1cm4gZmFsc2UgZnJvbSB0aGUgbmV4dCBmcmFtZSwgd2hpbGUgYGlzVmFsaWRgIGluIHRoZSBjdXJyZW50IGZyYW1lIHdpbGwgc3RpbGwgYmUgdHJ1ZS5cclxuICogSWYgeW91IHdhbnQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGN1cnJlbnQgZnJhbWUgaGFzIGNhbGxlZCBgZGVzdHJveWAsIHVzZSBgaXNWYWxpZChvYmosIHRydWUpYCxcclxuICogYnV0IHRoaXMgaXMgb2Z0ZW4gY2F1c2VkIGJ5IGEgcGFydGljdWxhciBsb2dpY2FsIHJlcXVpcmVtZW50cywgd2hpY2ggaXMgbm90IG5vcm1hbGx5IHJlcXVpcmVkLlxyXG4gKlxyXG4gKiBAemhcclxuICog5qOA5p+l6K+l5a+56LGh5piv5ZCm5LiN5Li6IG51bGwg5bm25LiU5bCa5pyq6ZSA5q+B44CCPGJyPlxyXG4gKiDlvZPkuIDkuKrlr7nosaHnmoQgYGRlc3Ryb3lgIOiwg+eUqOS7peWQju+8jOS8muWcqOi/meS4gOW4p+e7k+adn+WQjuaJjeecn+ato+mUgOavgeOAgjxicj5cclxuICog5Zug5q2k5LuO5LiL5LiA5bin5byA5aeLIGBpc1ZhbGlkYCDlsLHkvJrov5Tlm54gZmFsc2XvvIzogIzlvZPliY3luKflhoUgYGlzVmFsaWRgIOS7jeeEtuS8muaYryB0cnVl44CCPGJyPlxyXG4gKiDlpoLmnpzluIzmnJvliKTmlq3lvZPliY3luKfmmK/lkKbosIPnlKjov4cgYGRlc3Ryb3lg77yM6K+35L2/55SoIGBpc1ZhbGlkKG9iaiwgdHJ1ZSlg77yM5LiN6L+H6L+Z5b6A5b6A5piv54m55q6K55qE5Lia5Yqh6ZyA5rGC5byV6LW355qE77yM6YCa5bi45oOF5Ya15LiL5LiN6ZyA6KaB6L+Z5qC344CCXHJcbiAqXHJcbiAqIEBtZXRob2QgaXNWYWxpZFxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHBhcmFtIFtzdHJpY3RNb2RlPWZhbHNlXSAtIElmIHRydWUsIE9iamVjdCBjYWxsZWQgZGVzdHJveSgpIGluIHRoaXMgZnJhbWUgd2lsbCBhbHNvIHRyZWF0ZWQgYXMgaW52YWxpZC5cclxuICogQHJldHVybiB3aGV0aGVyIGlzIHZhbGlkXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYFxyXG4gKiBpbXBvcnQgeyBOb2RlLCBsb2cgfSBmcm9tICdjYyc7XHJcbiAqIHZhciBub2RlID0gbmV3IE5vZGUoKTtcclxuICogbG9nKGlzVmFsaWQobm9kZSkpOyAgICAvLyB0cnVlXHJcbiAqIG5vZGUuZGVzdHJveSgpO1xyXG4gKiBsb2coaXNWYWxpZChub2RlKSk7ICAgIC8vIHRydWUsIHN0aWxsIHZhbGlkIGluIHRoaXMgZnJhbWVcclxuICogLy8gYWZ0ZXIgYSBmcmFtZS4uLlxyXG4gKiBsb2coaXNWYWxpZChub2RlKSk7ICAgIC8vIGZhbHNlLCBkZXN0cm95ZWQgaW4gdGhlIGVuZCBvZiBsYXN0IGZyYW1lXHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWQgKHZhbHVlOiBhbnksIHN0cmljdE1vZGU/OiBib29sZWFuKSB7XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHJldHVybiAhIXZhbHVlICYmICEodmFsdWUuX29iakZsYWdzICYgKHN0cmljdE1vZGUgPyAoRGVzdHJveWVkIHwgVG9EZXN0cm95KSA6IERlc3Ryb3llZCkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCc7XHJcbiAgICB9XHJcbn1cclxubGVnYWN5Q0MuaXNWYWxpZCA9IGlzVmFsaWQ7XHJcblxyXG5pZiAoRURJVE9SIHx8IFRFU1QpIHtcclxuICAgIGpzLnZhbHVlKENDT2JqZWN0LCAnX3dpbGxEZXN0cm95JywgKG9iaikgPT4ge1xyXG4gICAgICAgIHJldHVybiAhKG9iai5fb2JqRmxhZ3MgJiBEZXN0cm95ZWQpICYmIChvYmouX29iakZsYWdzICYgVG9EZXN0cm95KSA+IDA7XHJcbiAgICB9KTtcclxuICAgIGpzLnZhbHVlKENDT2JqZWN0LCAnX2NhbmNlbERlc3Ryb3knLCAob2JqKSA9PiB7XHJcbiAgICAgICAgb2JqLl9vYmpGbGFncyAmPSB+VG9EZXN0cm95O1xyXG4gICAgICAgIGpzLmFycmF5LmZhc3RSZW1vdmUob2JqZWN0c1RvRGVzdHJveSwgb2JqKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5sZWdhY3lDQy5PYmplY3QgPSBDQ09iamVjdDtcclxuZXhwb3J0IHsgQ0NPYmplY3QgfTtcclxuIl19