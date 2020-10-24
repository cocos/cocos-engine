(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../assets/scripts.js", "../data/decorators/index.js", "../data/object.js", "../utils/id-generator.js", "../utils/js.js", "../data/utils/requiring-frame.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../assets/scripts.js"), require("../data/decorators/index.js"), require("../data/object.js"), require("../utils/id-generator.js"), require("../utils/js.js"), require("../data/utils/requiring-frame.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.scripts, global.index, global.object, global.idGenerator, global.js, global.requiringFrame, global.defaultConstants, global.globalExports, global.debug);
    global.component = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _scripts, _index, _object, _idGenerator, _js, RF, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Component = void 0;
  _idGenerator = _interopRequireDefault(_idGenerator);
  RF = _interopRequireWildcard(RF);

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var idGenerator = new _idGenerator.default('Comp'); // @ts-ignore

  var IsOnEnableCalled = _object.CCObject.Flags.IsOnEnableCalled; // @ts-ignore

  var IsOnLoadCalled = _object.CCObject.Flags.IsOnLoadCalled;
  var NullNode = null;
  /**
   * @en
   * Base class for everything attached to Node(Entity).<br/>
   * <br/>
   * NOTE: Not allowed to use construction parameters for Component's subclasses,
   *       because Component is created by the engine.
   * @zh
   * 所有附加到节点的基类。<br/>
   * <br/>
   * 注意：不允许使用组件的子类构造参数，因为组件是由引擎创建的。
   *
   * @class Component
   * @extends Object
   */

  var Component = (_dec = (0, _index.ccclass)('cc.Component'), _dec2 = (0, _index.displayName)('Script'), _dec3 = (0, _index.type)(_scripts.Script), _dec4 = (0, _index.tooltip)('i18n:INSPECTOR.component.script'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_CCObject) {
    _inherits(Component, _CCObject);

    function Component() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Component);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Component)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "node", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_enabled", _descriptor2, _assertThisInitialized(_this));

      _this._sceneGetter = null;
      _this._id = idGenerator.getNewId();
      return _this;
    }

    _createClass(Component, [{
      key: "_getRenderScene",
      // private __scriptUuid = '';
      value: function _getRenderScene() {
        if (this._sceneGetter) {
          return this._sceneGetter();
        } else {
          return this.node.scene._renderScene;
        }
      } // PUBLIC

      /**
       * @en Adds a component class to the node. You can also add component to node by passing in the name of the script.
       * @zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
       * @example
       * ```ts
       * import { Sprite } from 'cc';
       * const sprite = node.addComponent(Sprite);
       * ```
       */

    }, {
      key: "addComponent",
      value: function addComponent(typeOrClassName) {
        return this.node.addComponent(typeOrClassName);
      }
      /**
       * @en
       * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
       * You can also get component in the node by passing in the name of the script.
       * @zh
       * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
       * 传入参数也可以是脚本的名称。
       * @example
       * ```ts
       * import { Sprite } from 'cc';
       * // get sprite component.
       * var sprite = node.getComponent(Sprite);
       * ```
       */

    }, {
      key: "getComponent",
      value: function getComponent(typeOrClassName) {
        return this.node.getComponent(typeOrClassName);
      }
      /**
       * @en Returns all components of supplied type in the node.
       * @zh 返回节点上指定类型的所有组件。
       * @example
       * ```ts
       * import { Sprite } from 'cc';
       * const sprites = node.getComponents(Sprite);
       * ```
       */

    }, {
      key: "getComponents",
      value: function getComponents(typeOrClassName) {
        return this.node.getComponents(typeOrClassName);
      }
      /**
       * @en Returns the component of supplied type in any of its children using depth first search.
       * @zh 递归查找所有子节点中第一个匹配指定类型的组件。
       * @example
       * ```ts
       * import { Sprite } from 'cc';
       * const sprite = node.getComponentInChildren(Sprite);
       * ```
       */

    }, {
      key: "getComponentInChildren",
      value: function getComponentInChildren(typeOrClassName) {
        return this.node.getComponentInChildren(typeOrClassName);
      }
      /**
       * @en Returns all components of supplied type in self or any of its children.
       * @zh 递归查找自身或所有子节点中指定类型的组件。
       * @example
       * ```ts
       * import { Sprite } from 'cc';
       * const sprites = node.getComponentsInChildren(Sprite);
       * ```
       */

    }, {
      key: "getComponentsInChildren",
      value: function getComponentsInChildren(typeOrClassName) {
        return this.node.getComponentsInChildren(typeOrClassName);
      } // OVERRIDE

    }, {
      key: "destroy",
      value: function destroy() {
        if (_defaultConstants.EDITOR) {
          // @ts-ignore
          var depend = this.node._getDependComponent(this);

          if (depend) {
            (0, _debug.errorID)(3626, (0, _js.getClassName)(this), (0, _js.getClassName)(depend));
            return false;
          }
        }

        if (_get(_getPrototypeOf(Component.prototype), "destroy", this).call(this)) {
          if (this._enabled && this.node.activeInHierarchy) {
            _globalExports.legacyCC.director._compScheduler.disableComp(this);
          }

          return true;
        }

        return false;
      }
    }, {
      key: "_onPreDestroy",
      value: function _onPreDestroy() {
        // Schedules
        this.unscheduleAllCallbacks(); //

        if (_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          // @ts-ignore
          _Scene.AssetsWatcher.stop(this);
        } // onDestroy


        _globalExports.legacyCC.director._nodeActivator.destroyComp(this); // do remove component


        this.node._removeComponent(this);
      }
    }, {
      key: "_instantiate",
      value: function _instantiate(cloned) {
        if (!cloned) {
          cloned = _globalExports.legacyCC.instantiate._clone(this, this);
        }

        cloned.node = null;
        return cloned;
      } // Scheduler

      /**
       * @en
       * Schedules a custom selector.<br/>
       * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.
       * @zh
       * 调度一个自定义的回调函数。<br/>
       * 如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
       * @method schedule
       * @param {function} callback 回调函数。
       * @param {Number} interval  时间间隔，0 表示每帧都重复。
       * @param {Number} repeat    将被重复执行（repeat+ 1）次，您可以使用 cc.macro.REPEAT_FOREVER 进行无限次循环。
       * @param {Number} delay     第一次执行前等待的时间（延时执行）。
       * @example
       * ```ts
       * import { log } from 'cc';
       * this.schedule((dt) => void log(`time: ${dt}`), 1);
       * ```
       */

    }, {
      key: "schedule",
      value: function schedule(callback) {
        var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var repeat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _globalExports.legacyCC.macro.REPEAT_FOREVER;
        var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        (0, _debug.assertID)(callback, 1619);
        interval = interval || 0;
        (0, _debug.assertID)(interval >= 0, 1620);
        repeat = isNaN(repeat) ? _globalExports.legacyCC.macro.REPEAT_FOREVER : repeat;
        delay = delay || 0;

        var scheduler = _globalExports.legacyCC.director.getScheduler(); // should not use enabledInHierarchy to judge whether paused,
        // because enabledInHierarchy is assigned after onEnable.
        // Actually, if not yet scheduled, resumeTarget/pauseTarget has no effect on component,
        // therefore there is no way to guarantee the paused state other than isTargetPaused.


        var paused = scheduler.isTargetPaused(this);
        scheduler.schedule(callback, this, interval, repeat, delay, paused);
      }
      /**
       * @en Schedules a callback function that runs only once, with a delay of 0 or larger.
       * @zh 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
       * @method scheduleOnce
       * @see [[schedule]]
       * @param {function} callback  回调函数。
       * @param {Number} delay  第一次执行前等待的时间（延时执行）。
       * @example
       * ```ts
       * import { log } from 'cc';
       * this.scheduleOnce((dt) => void log(`time: ${dt}`), 2);
       * ```
       */

    }, {
      key: "scheduleOnce",
      value: function scheduleOnce(callback) {
        var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        this.schedule(callback, 0, 0, delay);
      }
      /**
       * @en Un-schedules a custom callback function.
       * @zh 取消调度一个自定义的回调函数。
       * @param {function} callback_fn  回调函数。
       * @example
       * ```ts
       * this.unschedule(_callback);
       * ```
       */

    }, {
      key: "unschedule",
      value: function unschedule(callback_fn) {
        if (!callback_fn) {
          return;
        }

        _globalExports.legacyCC.director.getScheduler().unschedule(callback_fn, this);
      }
      /**
       * @en
       * unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
       * Actions are not affected by this method.
       * @zh 取消调度所有已调度的回调函数：定制的回调函数以及 'update' 回调函数。动作不受此方法影响。
       * @method unscheduleAllCallbacks
       * @example
       * ```ts
       * this.unscheduleAllCallbacks();
       * ```
       */

    }, {
      key: "unscheduleAllCallbacks",
      value: function unscheduleAllCallbacks() {
        _globalExports.legacyCC.director.getScheduler().unscheduleAllForTarget(this);
      } // LIFECYCLE METHODS
      // Fireball provides lifecycle methods that you can specify to hook into this process.
      // We provide Pre methods, which are called right before something happens, and Post methods which are called right after something happens.

      /**
       * @en Update is called every frame, if the Component is enabled.<br/>
       * This is a lifecycle method. It may not be implemented in the super class.<br/>
       * You can only call its super class method inside it. It should not be called manually elsewhere.
       * @zh 如果该组件启用，则每帧调用 update。<br/>
       * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
       * @param dt - the delta time in seconds it took to complete the last frame
       */

    }, {
      key: "name",
      get: function get() {
        if (this._name) {
          return this._name;
        }

        var className = (0, _js.getClassName)(this);
        var trimLeft = className.lastIndexOf('.');

        if (trimLeft >= 0) {
          className = className.slice(trimLeft + 1);
        }

        return this.node.name + '<' + className + '>';
      },
      set: function set(value) {
        this._name = value;
      }
      /**
       * @en The uuid for editor.
       * @zh 组件的 uuid，用于编辑器。
       * @readOnly
       * @example
       * ```ts
       * import { log } from 'cc';
       * log(comp.uuid);
       * ```
       */

    }, {
      key: "uuid",
      get: function get() {
        return this._id;
      }
    }, {
      key: "__scriptAsset",
      get: function get() {
        return null;
      }
      /**
       * @en indicates whether this component is enabled or not.
       * @zh 表示该组件自身是否启用。
       * @default true
       * @example
       * ```ts
       * import { log } from 'cc';
       * comp.enabled = true;
       * log(comp.enabled);
       * ```
       */

    }, {
      key: "enabled",
      get: function get() {
        return this._enabled;
      },
      set: function set(value) {
        if (this._enabled !== value) {
          this._enabled = value;

          if (this.node.activeInHierarchy) {
            var compScheduler = _globalExports.legacyCC.director._compScheduler;

            if (value) {
              compScheduler.enableComp(this);
            } else {
              compScheduler.disableComp(this);
            }
          }
        }
      }
      /**
       * @en indicates whether this component is enabled and its node is also active in the hierarchy.
       * @zh 表示该组件是否被启用并且所在的节点也处于激活状态。
       * @readOnly
       * @example
       * ```ts
       * import { log } from 'cc';
       * log(comp.enabledInHierarchy);
       * ```
       */

    }, {
      key: "enabledInHierarchy",
      get: function get() {
        return this._enabled && this.node && this.node.activeInHierarchy;
      }
      /**
       * @en Returns a value which used to indicate the onLoad get called or not.
       * @zh 返回一个值用来判断 onLoad 是否被调用过，不等于 0 时调用过，等于 0 时未调用。
       * @readOnly
       * @example
       * ```ts
       * import { log } from 'cc';
       * log(this._isOnLoadCalled > 0);
       * ```
       */

    }, {
      key: "_isOnLoadCalled",
      get: function get() {
        return this._objFlags & IsOnLoadCalled;
      }
    }]);

    return Component;
  }(_object.CCObject), _class3.system = null, _temp), (_applyDecoratedDescriptor(_class2.prototype, "__scriptAsset", [_dec2, _dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "__scriptAsset"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "node", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return NullNode;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_enabled", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  })), _class2)) || _class);
  _exports.Component = Component;
  var proto = Component.prototype; // @ts-ignore

  proto.update = null; // @ts-ignore

  proto.lateUpdate = null; // @ts-ignore

  proto.__preload = null; // @ts-ignore

  proto.onLoad = null; // @ts-ignore

  proto.start = null; // @ts-ignore

  proto.onEnable = null; // @ts-ignore

  proto.onDisable = null; // @ts-ignore

  proto.onDestroy = null; // @ts-ignore

  proto.onFocusInEditor = null; // @ts-ignore

  proto.onLostFocusInEditor = null; // @ts-ignore

  proto.resetInEditor = null; // @ts-ignore

  proto._getLocalBounds = null; // @ts-ignore

  proto.onRestore = null; // @ts-ignore

  Component._requireComponent = null; // @ts-ignore

  Component._executionOrder = 0;

  if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
    // INHERITABLE STATIC MEMBERS
    // @ts-ignore
    Component._executeInEditMode = false; // @ts-ignore

    Component._playOnFocus = false; // @ts-ignore

    Component._disallowMultiple = null; // @ts-ignore

    Component._help = ''; // NON-INHERITED STATIC MEMBERS
    // (TypeScript 2.3 will still inherit them, so always check hasOwnProperty before using)

    (0, _js.value)(Component, '_inspector', '', true);
    (0, _js.value)(Component, '_icon', '', true); // COMPONENT HELPERS
    // TODO Keep temporarily, compatible with old version

    _globalExports.legacyCC._componentMenuItems = [];
  } // we make this non-enumerable, to prevent inherited by sub classes.


  (0, _js.value)(Component, '_registerEditorProps', function (cls, props) {
    var reqComp = props.requireComponent;

    if (reqComp) {
      cls._requireComponent = reqComp;
    }

    var order = props.executionOrder;

    if (order && typeof order === 'number') {
      cls._executionOrder = order;
    }

    if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
      var name = (0, _js.getClassName)(cls);

      for (var key in props) {
        var val = props[key];

        switch (key) {
          case 'executeInEditMode':
            cls._executeInEditMode = !!val;
            break;

          case 'playOnFocus':
            if (val) {
              var willExecuteInEditMode = 'executeInEditMode' in props ? props.executeInEditMode : cls._executeInEditMode;

              if (willExecuteInEditMode) {
                cls._playOnFocus = true;
              } else {
                (0, _debug.warnID)(3601, name);
              }
            }

            break;

          case 'inspector':
            (0, _js.value)(cls, '_inspector', val, true);
            break;

          case 'icon':
            (0, _js.value)(cls, '_icon', val, true);
            break;

          case 'menu':
            var frame = RF.peek();
            var menu = val;

            if (frame) {
              menu = 'i18n:menu.custom_script/' + menu;
            }

            _defaultConstants.EDITOR && EditorExtends.Component.removeMenu(cls);
            _defaultConstants.EDITOR && EditorExtends.Component.addMenu(cls, menu, props.menuPriority);
            break;

          case 'disallowMultiple':
            cls._disallowMultiple = cls;
            break;

          case 'requireComponent':
          case 'executionOrder':
            // skip here
            break;

          case 'help':
            cls._help = val;
            break;

          default:
            (0, _debug.warnID)(3602, key, name);
            break;
        }
      }
    }
  });
  _globalExports.legacyCC.Component = Component;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy9jb21wb25lbnQudHMiXSwibmFtZXMiOlsiaWRHZW5lcmF0b3IiLCJJREdlbmVyYXRvciIsIklzT25FbmFibGVDYWxsZWQiLCJDQ09iamVjdCIsIkZsYWdzIiwiSXNPbkxvYWRDYWxsZWQiLCJOdWxsTm9kZSIsIkNvbXBvbmVudCIsIlNjcmlwdCIsIl9zY2VuZUdldHRlciIsIl9pZCIsImdldE5ld0lkIiwibm9kZSIsInNjZW5lIiwiX3JlbmRlclNjZW5lIiwidHlwZU9yQ2xhc3NOYW1lIiwiYWRkQ29tcG9uZW50IiwiZ2V0Q29tcG9uZW50IiwiZ2V0Q29tcG9uZW50cyIsImdldENvbXBvbmVudEluQ2hpbGRyZW4iLCJnZXRDb21wb25lbnRzSW5DaGlsZHJlbiIsIkVESVRPUiIsImRlcGVuZCIsIl9nZXREZXBlbmRDb21wb25lbnQiLCJfZW5hYmxlZCIsImFjdGl2ZUluSGllcmFyY2h5IiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsIl9jb21wU2NoZWR1bGVyIiwiZGlzYWJsZUNvbXAiLCJ1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzIiwiVEVTVCIsIl9TY2VuZSIsIkFzc2V0c1dhdGNoZXIiLCJzdG9wIiwiX25vZGVBY3RpdmF0b3IiLCJkZXN0cm95Q29tcCIsIl9yZW1vdmVDb21wb25lbnQiLCJjbG9uZWQiLCJpbnN0YW50aWF0ZSIsIl9jbG9uZSIsImNhbGxiYWNrIiwiaW50ZXJ2YWwiLCJyZXBlYXQiLCJtYWNybyIsIlJFUEVBVF9GT1JFVkVSIiwiZGVsYXkiLCJpc05hTiIsInNjaGVkdWxlciIsImdldFNjaGVkdWxlciIsInBhdXNlZCIsImlzVGFyZ2V0UGF1c2VkIiwic2NoZWR1bGUiLCJjYWxsYmFja19mbiIsInVuc2NoZWR1bGUiLCJ1bnNjaGVkdWxlQWxsRm9yVGFyZ2V0IiwiX25hbWUiLCJjbGFzc05hbWUiLCJ0cmltTGVmdCIsImxhc3RJbmRleE9mIiwic2xpY2UiLCJuYW1lIiwidmFsdWUiLCJjb21wU2NoZWR1bGVyIiwiZW5hYmxlQ29tcCIsIl9vYmpGbGFncyIsInN5c3RlbSIsInNlcmlhbGl6YWJsZSIsInByb3RvIiwicHJvdG90eXBlIiwidXBkYXRlIiwibGF0ZVVwZGF0ZSIsIl9fcHJlbG9hZCIsIm9uTG9hZCIsInN0YXJ0Iiwib25FbmFibGUiLCJvbkRpc2FibGUiLCJvbkRlc3Ryb3kiLCJvbkZvY3VzSW5FZGl0b3IiLCJvbkxvc3RGb2N1c0luRWRpdG9yIiwicmVzZXRJbkVkaXRvciIsIl9nZXRMb2NhbEJvdW5kcyIsIm9uUmVzdG9yZSIsIl9yZXF1aXJlQ29tcG9uZW50IiwiX2V4ZWN1dGlvbk9yZGVyIiwiX2V4ZWN1dGVJbkVkaXRNb2RlIiwiX3BsYXlPbkZvY3VzIiwiX2Rpc2FsbG93TXVsdGlwbGUiLCJfaGVscCIsIl9jb21wb25lbnRNZW51SXRlbXMiLCJjbHMiLCJwcm9wcyIsInJlcUNvbXAiLCJyZXF1aXJlQ29tcG9uZW50Iiwib3JkZXIiLCJleGVjdXRpb25PcmRlciIsImtleSIsInZhbCIsIndpbGxFeGVjdXRlSW5FZGl0TW9kZSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiZnJhbWUiLCJSRiIsInBlZWsiLCJtZW51IiwiRWRpdG9yRXh0ZW5kcyIsInJlbW92ZU1lbnUiLCJhZGRNZW51IiwibWVudVByaW9yaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkNBLE1BQU1BLFdBQVcsR0FBRyxJQUFJQyxvQkFBSixDQUFnQixNQUFoQixDQUFwQixDLENBQ0E7O0FBQ0EsTUFBTUMsZ0JBQWdCLEdBQUdDLGlCQUFTQyxLQUFULENBQWVGLGdCQUF4QyxDLENBQ0E7O0FBQ0EsTUFBTUcsY0FBYyxHQUFHRixpQkFBU0MsS0FBVCxDQUFlQyxjQUF0QztBQUVBLE1BQU1DLFFBQVEsR0FBRyxJQUFqQjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7TUFlTUMsUyxXQURMLG9CQUFRLGNBQVIsQyxVQStCSSx3QkFBWSxRQUFaLEMsVUFDQSxpQkFBS0MsZUFBTCxDLFVBQ0Esb0JBQVEsaUNBQVIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUErRU1DLFksR0FBMkMsSTtZQUszQ0MsRyxHQUFjVixXQUFXLENBQUNXLFFBQVosRTs7Ozs7O0FBRXJCO3dDQUV1QztBQUNuQyxZQUFJLEtBQUtGLFlBQVQsRUFBdUI7QUFDbkIsaUJBQU8sS0FBS0EsWUFBTCxFQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQU8sS0FBS0csSUFBTCxDQUFVQyxLQUFWLENBQWlCQyxZQUF4QjtBQUNIO0FBQ0osTyxDQUVEOztBQUVBOzs7Ozs7Ozs7Ozs7bUNBcUJxQkMsZSxFQUFzQjtBQUN2QyxlQUFPLEtBQUtILElBQUwsQ0FBVUksWUFBVixDQUF1QkQsZUFBdkIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQStCcUJBLGUsRUFBc0I7QUFDdkMsZUFBTyxLQUFLSCxJQUFMLENBQVVLLFlBQVYsQ0FBdUJGLGVBQXZCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7b0NBcUIyQ0EsZSxFQUFzQjtBQUM3RCxlQUFPLEtBQUtILElBQUwsQ0FBVU0sYUFBVixDQUF3QkgsZUFBeEIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs2Q0FxQitCQSxlLEVBQXNCO0FBQ2pELGVBQU8sS0FBS0gsSUFBTCxDQUFVTyxzQkFBVixDQUFpQ0osZUFBakMsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs4Q0FxQmdDQSxlLEVBQXNCO0FBQ2xELGVBQU8sS0FBS0gsSUFBTCxDQUFVUSx1QkFBVixDQUFrQ0wsZUFBbEMsQ0FBUDtBQUNILE8sQ0FFRDs7OztnQ0FFa0I7QUFDZCxZQUFJTSx3QkFBSixFQUFZO0FBQ1I7QUFDQSxjQUFNQyxNQUFNLEdBQUcsS0FBS1YsSUFBTCxDQUFVVyxtQkFBVixDQUE4QixJQUE5QixDQUFmOztBQUNBLGNBQUlELE1BQUosRUFBWTtBQUNSLGdDQUFRLElBQVIsRUFDSSxzQkFBYSxJQUFiLENBREosRUFDd0Isc0JBQWFBLE1BQWIsQ0FEeEI7QUFFQSxtQkFBTyxLQUFQO0FBQ0g7QUFDSjs7QUFDRCxvRkFBcUI7QUFDakIsY0FBSSxLQUFLRSxRQUFMLElBQWlCLEtBQUtaLElBQUwsQ0FBVWEsaUJBQS9CLEVBQWtEO0FBQzlDQyxvQ0FBU0MsUUFBVCxDQUFrQkMsY0FBbEIsQ0FBaUNDLFdBQWpDLENBQTZDLElBQTdDO0FBQ0g7O0FBQ0QsaUJBQU8sSUFBUDtBQUNIOztBQUNELGVBQU8sS0FBUDtBQUNIOzs7c0NBRXVCO0FBQ3BCO0FBQ0EsYUFBS0Msc0JBQUwsR0FGb0IsQ0FJcEI7O0FBQ0EsWUFBSVQsNEJBQVUsQ0FBQ1Usc0JBQWYsRUFBcUI7QUFDakI7QUFDQUMsVUFBQUEsTUFBTSxDQUFDQyxhQUFQLENBQXFCQyxJQUFyQixDQUEwQixJQUExQjtBQUNILFNBUm1CLENBVXBCOzs7QUFDQVIsZ0NBQVNDLFFBQVQsQ0FBa0JRLGNBQWxCLENBQWlDQyxXQUFqQyxDQUE2QyxJQUE3QyxFQVhvQixDQWFwQjs7O0FBQ0EsYUFBS3hCLElBQUwsQ0FBVXlCLGdCQUFWLENBQTJCLElBQTNCO0FBQ0g7OzttQ0FFb0JDLE0sRUFBUTtBQUN6QixZQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNUQSxVQUFBQSxNQUFNLEdBQUdaLHdCQUFTYSxXQUFULENBQXFCQyxNQUFyQixDQUE0QixJQUE1QixFQUFrQyxJQUFsQyxDQUFUO0FBQ0g7O0FBQ0RGLFFBQUFBLE1BQU0sQ0FBQzFCLElBQVAsR0FBYyxJQUFkO0FBQ0EsZUFBTzBCLE1BQVA7QUFDSCxPLENBRUQ7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQkFrQmlCRyxRLEVBQW1HO0FBQUEsWUFBekZDLFFBQXlGLHVFQUF0RSxDQUFzRTtBQUFBLFlBQW5FQyxNQUFtRSx1RUFBbERqQix3QkFBU2tCLEtBQVQsQ0FBZUMsY0FBbUM7QUFBQSxZQUFuQkMsS0FBbUIsdUVBQUgsQ0FBRztBQUNoSCw2QkFBU0wsUUFBVCxFQUFtQixJQUFuQjtBQUVBQyxRQUFBQSxRQUFRLEdBQUdBLFFBQVEsSUFBSSxDQUF2QjtBQUNBLDZCQUFTQSxRQUFRLElBQUksQ0FBckIsRUFBd0IsSUFBeEI7QUFFQUMsUUFBQUEsTUFBTSxHQUFHSSxLQUFLLENBQUNKLE1BQUQsQ0FBTCxHQUFnQmpCLHdCQUFTa0IsS0FBVCxDQUFlQyxjQUEvQixHQUFnREYsTUFBekQ7QUFDQUcsUUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksQ0FBakI7O0FBRUEsWUFBTUUsU0FBUyxHQUFHdEIsd0JBQVNDLFFBQVQsQ0FBa0JzQixZQUFsQixFQUFsQixDQVRnSCxDQVdoSDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsWUFBTUMsTUFBTSxHQUFHRixTQUFTLENBQUNHLGNBQVYsQ0FBeUIsSUFBekIsQ0FBZjtBQUVBSCxRQUFBQSxTQUFTLENBQUNJLFFBQVYsQ0FBbUJYLFFBQW5CLEVBQTZCLElBQTdCLEVBQW1DQyxRQUFuQyxFQUE2Q0MsTUFBN0MsRUFBcURHLEtBQXJELEVBQTRESSxNQUE1RDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBYXFCVCxRLEVBQTZCO0FBQUEsWUFBbkJLLEtBQW1CLHVFQUFILENBQUc7QUFDOUMsYUFBS00sUUFBTCxDQUFjWCxRQUFkLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCSyxLQUE5QjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztpQ0FTbUJPLFcsRUFBYTtBQUM1QixZQUFJLENBQUNBLFdBQUwsRUFBa0I7QUFDZDtBQUNIOztBQUVEM0IsZ0NBQVNDLFFBQVQsQ0FBa0JzQixZQUFsQixHQUFpQ0ssVUFBakMsQ0FBNENELFdBQTVDLEVBQXlELElBQXpEO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7K0NBV2lDO0FBQzdCM0IsZ0NBQVNDLFFBQVQsQ0FBa0JzQixZQUFsQixHQUFpQ00sc0JBQWpDLENBQXdELElBQXhEO0FBQ0gsTyxDQUVEO0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7MEJBcFpZO0FBQ1IsWUFBSSxLQUFLQyxLQUFULEVBQWdCO0FBQ1osaUJBQU8sS0FBS0EsS0FBWjtBQUNIOztBQUNELFlBQUlDLFNBQVMsR0FBRyxzQkFBYSxJQUFiLENBQWhCO0FBQ0EsWUFBTUMsUUFBUSxHQUFHRCxTQUFTLENBQUNFLFdBQVYsQ0FBc0IsR0FBdEIsQ0FBakI7O0FBQ0EsWUFBSUQsUUFBUSxJQUFJLENBQWhCLEVBQW1CO0FBQ2ZELFVBQUFBLFNBQVMsR0FBR0EsU0FBUyxDQUFDRyxLQUFWLENBQWdCRixRQUFRLEdBQUcsQ0FBM0IsQ0FBWjtBQUNIOztBQUNELGVBQU8sS0FBSzlDLElBQUwsQ0FBVWlELElBQVYsR0FBaUIsR0FBakIsR0FBdUJKLFNBQXZCLEdBQW1DLEdBQTFDO0FBQ0gsTzt3QkFDU0ssSyxFQUFPO0FBQ2IsYUFBS04sS0FBTCxHQUFhTSxLQUFiO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OzswQkFVWTtBQUNSLGVBQU8sS0FBS3BELEdBQVo7QUFDSDs7OzBCQUtvQjtBQUFFLGVBQU8sSUFBUDtBQUFjO0FBRXJDOzs7Ozs7Ozs7Ozs7OzswQkFXZTtBQUNYLGVBQU8sS0FBS2MsUUFBWjtBQUNILE87d0JBQ1lzQyxLLEVBQU87QUFDaEIsWUFBSSxLQUFLdEMsUUFBTCxLQUFrQnNDLEtBQXRCLEVBQTZCO0FBQ3pCLGVBQUt0QyxRQUFMLEdBQWdCc0MsS0FBaEI7O0FBQ0EsY0FBSSxLQUFLbEQsSUFBTCxDQUFVYSxpQkFBZCxFQUFpQztBQUM3QixnQkFBTXNDLGFBQWEsR0FBR3JDLHdCQUFTQyxRQUFULENBQWtCQyxjQUF4Qzs7QUFDQSxnQkFBSWtDLEtBQUosRUFBVztBQUNQQyxjQUFBQSxhQUFhLENBQUNDLFVBQWQsQ0FBeUIsSUFBekI7QUFDSCxhQUZELE1BR0s7QUFDREQsY0FBQUEsYUFBYSxDQUFDbEMsV0FBZCxDQUEwQixJQUExQjtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7Ozs7MEJBVTBCO0FBQ3RCLGVBQU8sS0FBS0wsUUFBTCxJQUFpQixLQUFLWixJQUF0QixJQUE4QixLQUFLQSxJQUFMLENBQVVhLGlCQUEvQztBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7MEJBVXVCO0FBQ25CLGVBQU8sS0FBS3dDLFNBQUwsR0FBaUI1RCxjQUF4QjtBQUNIOzs7O0lBMUZtQkYsZ0IsV0E0Rk4rRCxNLEdBQVMsSSw2UEFVdEJDLG1COzs7OzthQUNtQjdELFE7OytFQUtuQjZELG1COzs7OzthQUNpQixJOzs7O0FBK2J0QixNQUFNQyxLQUFLLEdBQUc3RCxTQUFTLENBQUM4RCxTQUF4QixDLENBQ0E7O0FBQ0FELEVBQUFBLEtBQUssQ0FBQ0UsTUFBTixHQUFlLElBQWYsQyxDQUNBOztBQUNBRixFQUFBQSxLQUFLLENBQUNHLFVBQU4sR0FBbUIsSUFBbkIsQyxDQUNBOztBQUNBSCxFQUFBQSxLQUFLLENBQUNJLFNBQU4sR0FBa0IsSUFBbEIsQyxDQUNBOztBQUNBSixFQUFBQSxLQUFLLENBQUNLLE1BQU4sR0FBZSxJQUFmLEMsQ0FDQTs7QUFDQUwsRUFBQUEsS0FBSyxDQUFDTSxLQUFOLEdBQWMsSUFBZCxDLENBQ0E7O0FBQ0FOLEVBQUFBLEtBQUssQ0FBQ08sUUFBTixHQUFpQixJQUFqQixDLENBQ0E7O0FBQ0FQLEVBQUFBLEtBQUssQ0FBQ1EsU0FBTixHQUFrQixJQUFsQixDLENBQ0E7O0FBQ0FSLEVBQUFBLEtBQUssQ0FBQ1MsU0FBTixHQUFrQixJQUFsQixDLENBQ0E7O0FBQ0FULEVBQUFBLEtBQUssQ0FBQ1UsZUFBTixHQUF3QixJQUF4QixDLENBQ0E7O0FBQ0FWLEVBQUFBLEtBQUssQ0FBQ1csbUJBQU4sR0FBNEIsSUFBNUIsQyxDQUNBOztBQUNBWCxFQUFBQSxLQUFLLENBQUNZLGFBQU4sR0FBc0IsSUFBdEIsQyxDQUNBOztBQUNBWixFQUFBQSxLQUFLLENBQUNhLGVBQU4sR0FBd0IsSUFBeEIsQyxDQUNBOztBQUNBYixFQUFBQSxLQUFLLENBQUNjLFNBQU4sR0FBa0IsSUFBbEIsQyxDQUNBOztBQUNBM0UsRUFBQUEsU0FBUyxDQUFDNEUsaUJBQVYsR0FBOEIsSUFBOUIsQyxDQUNBOztBQUNBNUUsRUFBQUEsU0FBUyxDQUFDNkUsZUFBVixHQUE0QixDQUE1Qjs7QUFFQSxNQUFJL0QsNEJBQVVVLHNCQUFkLEVBQW9CO0FBRWhCO0FBQ0E7QUFDQXhCLElBQUFBLFNBQVMsQ0FBQzhFLGtCQUFWLEdBQStCLEtBQS9CLENBSmdCLENBS2hCOztBQUNBOUUsSUFBQUEsU0FBUyxDQUFDK0UsWUFBVixHQUF5QixLQUF6QixDQU5nQixDQU9oQjs7QUFDQS9FLElBQUFBLFNBQVMsQ0FBQ2dGLGlCQUFWLEdBQThCLElBQTlCLENBUmdCLENBU2hCOztBQUNBaEYsSUFBQUEsU0FBUyxDQUFDaUYsS0FBVixHQUFrQixFQUFsQixDQVZnQixDQVloQjtBQUNBOztBQUVBLG1CQUFNakYsU0FBTixFQUFpQixZQUFqQixFQUErQixFQUEvQixFQUFtQyxJQUFuQztBQUNBLG1CQUFNQSxTQUFOLEVBQWlCLE9BQWpCLEVBQTBCLEVBQTFCLEVBQThCLElBQTlCLEVBaEJnQixDQWtCaEI7QUFFQTs7QUFDQW1CLDRCQUFTK0QsbUJBQVQsR0FBK0IsRUFBL0I7QUFDSCxHLENBRUQ7OztBQUNBLGlCQUFNbEYsU0FBTixFQUFpQixzQkFBakIsRUFBeUMsVUFBVW1GLEdBQVYsRUFBZUMsS0FBZixFQUFzQjtBQUMzRCxRQUFNQyxPQUFPLEdBQUdELEtBQUssQ0FBQ0UsZ0JBQXRCOztBQUNBLFFBQUlELE9BQUosRUFBYTtBQUNURixNQUFBQSxHQUFHLENBQUNQLGlCQUFKLEdBQXdCUyxPQUF4QjtBQUNIOztBQUNELFFBQU1FLEtBQUssR0FBR0gsS0FBSyxDQUFDSSxjQUFwQjs7QUFDQSxRQUFJRCxLQUFLLElBQUksT0FBT0EsS0FBUCxLQUFpQixRQUE5QixFQUF3QztBQUNwQ0osTUFBQUEsR0FBRyxDQUFDTixlQUFKLEdBQXNCVSxLQUF0QjtBQUNIOztBQUNELFFBQUl6RSw0QkFBVVUsc0JBQWQsRUFBb0I7QUFDaEIsVUFBTThCLElBQUksR0FBRyxzQkFBYTZCLEdBQWIsQ0FBYjs7QUFDQSxXQUFLLElBQU1NLEdBQVgsSUFBa0JMLEtBQWxCLEVBQXlCO0FBQ3JCLFlBQU1NLEdBQUcsR0FBR04sS0FBSyxDQUFDSyxHQUFELENBQWpCOztBQUNBLGdCQUFRQSxHQUFSO0FBQ0ksZUFBSyxtQkFBTDtBQUNJTixZQUFBQSxHQUFHLENBQUNMLGtCQUFKLEdBQXlCLENBQUMsQ0FBQ1ksR0FBM0I7QUFDQTs7QUFFSixlQUFLLGFBQUw7QUFDSSxnQkFBSUEsR0FBSixFQUFTO0FBQ0wsa0JBQU1DLHFCQUFxQixHQUFJLHVCQUF1QlAsS0FBeEIsR0FBaUNBLEtBQUssQ0FBQ1EsaUJBQXZDLEdBQTJEVCxHQUFHLENBQUNMLGtCQUE3Rjs7QUFDQSxrQkFBSWEscUJBQUosRUFBMkI7QUFDdkJSLGdCQUFBQSxHQUFHLENBQUNKLFlBQUosR0FBbUIsSUFBbkI7QUFDSCxlQUZELE1BR0s7QUFDRCxtQ0FBTyxJQUFQLEVBQWF6QixJQUFiO0FBQ0g7QUFDSjs7QUFDRDs7QUFFSixlQUFLLFdBQUw7QUFDSSwyQkFBTTZCLEdBQU4sRUFBVyxZQUFYLEVBQXlCTyxHQUF6QixFQUE4QixJQUE5QjtBQUNBOztBQUVKLGVBQUssTUFBTDtBQUNJLDJCQUFNUCxHQUFOLEVBQVcsT0FBWCxFQUFvQk8sR0FBcEIsRUFBeUIsSUFBekI7QUFDQTs7QUFFSixlQUFLLE1BQUw7QUFDSSxnQkFBTUcsS0FBSyxHQUFHQyxFQUFFLENBQUNDLElBQUgsRUFBZDtBQUNBLGdCQUFJQyxJQUFJLEdBQUdOLEdBQVg7O0FBQ0EsZ0JBQUlHLEtBQUosRUFBVztBQUNQRyxjQUFBQSxJQUFJLEdBQUcsNkJBQTZCQSxJQUFwQztBQUNIOztBQUVEbEYsd0NBQVVtRixhQUFhLENBQUNqRyxTQUFkLENBQXdCa0csVUFBeEIsQ0FBbUNmLEdBQW5DLENBQVY7QUFDQXJFLHdDQUFVbUYsYUFBYSxDQUFDakcsU0FBZCxDQUF3Qm1HLE9BQXhCLENBQWdDaEIsR0FBaEMsRUFBcUNhLElBQXJDLEVBQTJDWixLQUFLLENBQUNnQixZQUFqRCxDQUFWO0FBQ0E7O0FBRUosZUFBSyxrQkFBTDtBQUNJakIsWUFBQUEsR0FBRyxDQUFDSCxpQkFBSixHQUF3QkcsR0FBeEI7QUFDQTs7QUFFSixlQUFLLGtCQUFMO0FBQ0EsZUFBSyxnQkFBTDtBQUNJO0FBQ0E7O0FBRUosZUFBSyxNQUFMO0FBQ0lBLFlBQUFBLEdBQUcsQ0FBQ0YsS0FBSixHQUFZUyxHQUFaO0FBQ0E7O0FBRUo7QUFDSSwrQkFBTyxJQUFQLEVBQWFELEdBQWIsRUFBa0JuQyxJQUFsQjtBQUNBO0FBbkRSO0FBcURIO0FBQ0o7QUFDSixHQXBFRDtBQXNFQW5DLDBCQUFTbkIsU0FBVCxHQUFxQkEsU0FBckIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZVxyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb21wb25lbnRcclxuICovXHJcblxyXG5pbXBvcnQgeyBTY3JpcHQgfSBmcm9tICcuLi9hc3NldHMvc2NyaXB0cyc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIHRvb2x0aXAsIGRpc3BsYXlOYW1lLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDQ09iamVjdCB9IGZyb20gJy4uL2RhdGEvb2JqZWN0JztcclxuaW1wb3J0IElER2VuZXJhdG9yIGZyb20gJy4uL3V0aWxzL2lkLWdlbmVyYXRvcic7XHJcbmltcG9ydCB7IGdldENsYXNzTmFtZSwgdmFsdWUgfSBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IFJlbmRlclNjZW5lIH0gZnJvbSAnLi4vcmVuZGVyZXIvc2NlbmUvcmVuZGVyLXNjZW5lJztcclxuaW1wb3J0IHsgUmVjdCB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgKiBhcyBSRiBmcm9tICcuLi9kYXRhL3V0aWxzL3JlcXVpcmluZy1mcmFtZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IEVESVRPUiwgVEVTVCwgREVWIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IGVycm9ySUQsIHdhcm5JRCwgYXNzZXJ0SUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcblxyXG5jb25zdCBpZEdlbmVyYXRvciA9IG5ldyBJREdlbmVyYXRvcignQ29tcCcpO1xyXG4vLyBAdHMtaWdub3JlXHJcbmNvbnN0IElzT25FbmFibGVDYWxsZWQgPSBDQ09iamVjdC5GbGFncy5Jc09uRW5hYmxlQ2FsbGVkO1xyXG4vLyBAdHMtaWdub3JlXHJcbmNvbnN0IElzT25Mb2FkQ2FsbGVkID0gQ0NPYmplY3QuRmxhZ3MuSXNPbkxvYWRDYWxsZWQ7XHJcblxyXG5jb25zdCBOdWxsTm9kZSA9IG51bGwgYXMgdW5rbm93biBhcyBOb2RlO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBCYXNlIGNsYXNzIGZvciBldmVyeXRoaW5nIGF0dGFjaGVkIHRvIE5vZGUoRW50aXR5KS48YnIvPlxyXG4gKiA8YnIvPlxyXG4gKiBOT1RFOiBOb3QgYWxsb3dlZCB0byB1c2UgY29uc3RydWN0aW9uIHBhcmFtZXRlcnMgZm9yIENvbXBvbmVudCdzIHN1YmNsYXNzZXMsXHJcbiAqICAgICAgIGJlY2F1c2UgQ29tcG9uZW50IGlzIGNyZWF0ZWQgYnkgdGhlIGVuZ2luZS5cclxuICogQHpoXHJcbiAqIOaJgOaciemZhOWKoOWIsOiKgueCueeahOWfuuexu+OAgjxici8+XHJcbiAqIDxici8+XHJcbiAqIOazqOaEj++8muS4jeWFgeiuuOS9v+eUqOe7hOS7tueahOWtkOexu+aehOmAoOWPguaVsO+8jOWboOS4uue7hOS7tuaYr+eUseW8leaTjuWIm+W7uueahOOAglxyXG4gKlxyXG4gKiBAY2xhc3MgQ29tcG9uZW50XHJcbiAqIEBleHRlbmRzIE9iamVjdFxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkNvbXBvbmVudCcpXHJcbmNsYXNzIENvbXBvbmVudCBleHRlbmRzIENDT2JqZWN0IHtcclxuICAgIGdldCBuYW1lICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IGdldENsYXNzTmFtZSh0aGlzKTtcclxuICAgICAgICBjb25zdCB0cmltTGVmdCA9IGNsYXNzTmFtZS5sYXN0SW5kZXhPZignLicpO1xyXG4gICAgICAgIGlmICh0cmltTGVmdCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5zbGljZSh0cmltTGVmdCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLm5hbWUgKyAnPCcgKyBjbGFzc05hbWUgKyAnPic7XHJcbiAgICB9XHJcbiAgICBzZXQgbmFtZSAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHV1aWQgZm9yIGVkaXRvci5cclxuICAgICAqIEB6aCDnu4Tku7bnmoQgdXVpZO+8jOeUqOS6jue8lui+keWZqOOAglxyXG4gICAgICogQHJlYWRPbmx5XHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IGxvZyB9IGZyb20gJ2NjJztcclxuICAgICAqIGxvZyhjb21wLnV1aWQpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIGdldCB1dWlkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgQGRpc3BsYXlOYW1lKCdTY3JpcHQnKVxyXG4gICAgQHR5cGUoU2NyaXB0KVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46SU5TUEVDVE9SLmNvbXBvbmVudC5zY3JpcHQnKVxyXG4gICAgZ2V0IF9fc2NyaXB0QXNzZXQgKCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGluZGljYXRlcyB3aGV0aGVyIHRoaXMgY29tcG9uZW50IGlzIGVuYWJsZWQgb3Igbm90LlxyXG4gICAgICogQHpoIOihqOekuuivpee7hOS7tuiHqui6q+aYr+WQpuWQr+eUqOOAglxyXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBsb2cgfSBmcm9tICdjYyc7XHJcbiAgICAgKiBjb21wLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICogbG9nKGNvbXAuZW5hYmxlZCk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgZ2V0IGVuYWJsZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xyXG4gICAgfVxyXG4gICAgc2V0IGVuYWJsZWQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQgIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5hY3RpdmVJbkhpZXJhcmNoeSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcFNjaGVkdWxlciA9IGxlZ2FjeUNDLmRpcmVjdG9yLl9jb21wU2NoZWR1bGVyO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcFNjaGVkdWxlci5lbmFibGVDb21wKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcFNjaGVkdWxlci5kaXNhYmxlQ29tcCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBpbmRpY2F0ZXMgd2hldGhlciB0aGlzIGNvbXBvbmVudCBpcyBlbmFibGVkIGFuZCBpdHMgbm9kZSBpcyBhbHNvIGFjdGl2ZSBpbiB0aGUgaGllcmFyY2h5LlxyXG4gICAgICogQHpoIOihqOekuuivpee7hOS7tuaYr+WQpuiiq+WQr+eUqOW5tuS4lOaJgOWcqOeahOiKgueCueS5n+WkhOS6jua/gOa0u+eKtuaAgeOAglxyXG4gICAgICogQHJlYWRPbmx5XHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IGxvZyB9IGZyb20gJ2NjJztcclxuICAgICAqIGxvZyhjb21wLmVuYWJsZWRJbkhpZXJhcmNoeSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgZ2V0IGVuYWJsZWRJbkhpZXJhcmNoeSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQgJiYgdGhpcy5ub2RlICYmIHRoaXMubm9kZS5hY3RpdmVJbkhpZXJhcmNoeTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIGEgdmFsdWUgd2hpY2ggdXNlZCB0byBpbmRpY2F0ZSB0aGUgb25Mb2FkIGdldCBjYWxsZWQgb3Igbm90LlxyXG4gICAgICogQHpoIOi/lOWbnuS4gOS4quWAvOeUqOadpeWIpOaWrSBvbkxvYWQg5piv5ZCm6KKr6LCD55So6L+H77yM5LiN562J5LqOIDAg5pe26LCD55So6L+H77yM562J5LqOIDAg5pe25pyq6LCD55So44CCXHJcbiAgICAgKiBAcmVhZE9ubHlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgbG9nIH0gZnJvbSAnY2MnO1xyXG4gICAgICogbG9nKHRoaXMuX2lzT25Mb2FkQ2FsbGVkID4gMCk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgZ2V0IF9pc09uTG9hZENhbGxlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29iakZsYWdzICYgSXNPbkxvYWRDYWxsZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzeXN0ZW0gPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG5vZGUgdGhpcyBjb21wb25lbnQgaXMgYXR0YWNoZWQgdG8uIEEgY29tcG9uZW50IGlzIGFsd2F5cyBhdHRhY2hlZCB0byBhIG5vZGUuXHJcbiAgICAgKiBAemgg6K+l57uE5Lu26KKr6ZmE5Yqg5Yiw55qE6IqC54K544CC57uE5Lu25oC75Lya6ZmE5Yqg5Yiw5LiA5Liq6IqC54K544CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IGxvZyB9IGZyb20gJ2NjJztcclxuICAgICAqIGxvZyhjb21wLm5vZGUpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyBub2RlOiBOb2RlID0gTnVsbE5vZGU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgX2VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIHB1YmxpYyBfc2NlbmVHZXR0ZXI6IG51bGwgfCAoKCkgPT4gUmVuZGVyU2NlbmUpID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZvciBpbnRlcm5hbCB1c2FnZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIF9pZDogc3RyaW5nID0gaWRHZW5lcmF0b3IuZ2V0TmV3SWQoKTtcclxuXHJcbiAgICAvLyBwcml2YXRlIF9fc2NyaXB0VXVpZCA9ICcnO1xyXG5cclxuICAgIHB1YmxpYyBfZ2V0UmVuZGVyU2NlbmUgKCk6IFJlbmRlclNjZW5lIHtcclxuICAgICAgICBpZiAodGhpcy5fc2NlbmVHZXR0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NjZW5lR2V0dGVyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5zY2VuZSEuX3JlbmRlclNjZW5lITtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUFVCTElDXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWRkcyBhIGNvbXBvbmVudCBjbGFzcyB0byB0aGUgbm9kZS4gWW91IGNhbiBhbHNvIGFkZCBjb21wb25lbnQgdG8gbm9kZSBieSBwYXNzaW5nIGluIHRoZSBuYW1lIG9mIHRoZSBzY3JpcHQuXHJcbiAgICAgKiBAemgg5ZCR6IqC54K55re75Yqg5LiA5Liq5oyH5a6a57G75Z6L55qE57uE5Lu257G777yM5L2g6L+Y5Y+v5Lul6YCa6L+H5Lyg5YWl6ISa5pys55qE5ZCN56ew5p2l5re75Yqg57uE5Lu244CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IFNwcml0ZSB9IGZyb20gJ2NjJztcclxuICAgICAqIGNvbnN0IHNwcml0ZSA9IG5vZGUuYWRkQ29tcG9uZW50KFNwcml0ZSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50PiAoY2xhc3NDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8VD4pOiBUIHwgbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBZGRzIGEgY29tcG9uZW50IGNsYXNzIHRvIHRoZSBub2RlLiBZb3UgY2FuIGFsc28gYWRkIGNvbXBvbmVudCB0byBub2RlIGJ5IHBhc3NpbmcgaW4gdGhlIG5hbWUgb2YgdGhlIHNjcmlwdC5cclxuICAgICAqIEB6aCDlkJHoioLngrnmt7vliqDkuIDkuKrmjIflrprnsbvlnovnmoTnu4Tku7bnsbvvvIzkvaDov5jlj6/ku6XpgJrov4fkvKDlhaXohJrmnKznmoTlkI3np7DmnaXmt7vliqDnu4Tku7bjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogY29uc3QgdGVzdCA9IG5vZGUuYWRkQ29tcG9uZW50KFwiVGVzdFwiKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50IChjbGFzc05hbWU6IHN0cmluZyk6IENvbXBvbmVudCB8IG51bGw7XHJcblxyXG4gICAgcHVibGljIGFkZENvbXBvbmVudCAodHlwZU9yQ2xhc3NOYW1lOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmFkZENvbXBvbmVudCh0eXBlT3JDbGFzc05hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjb21wb25lbnQgb2Ygc3VwcGxpZWQgdHlwZSBpZiB0aGUgbm9kZSBoYXMgb25lIGF0dGFjaGVkLCBudWxsIGlmIGl0IGRvZXNuJ3QuPGJyLz5cclxuICAgICAqIFlvdSBjYW4gYWxzbyBnZXQgY29tcG9uZW50IGluIHRoZSBub2RlIGJ5IHBhc3NpbmcgaW4gdGhlIG5hbWUgb2YgdGhlIHNjcmlwdC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W6IqC54K55LiK5oyH5a6a57G75Z6L55qE57uE5Lu277yM5aaC5p6c6IqC54K55pyJ6ZmE5Yqg5oyH5a6a57G75Z6L55qE57uE5Lu277yM5YiZ6L+U5Zue77yM5aaC5p6c5rKh5pyJ5YiZ5Li656m644CCPGJyLz5cclxuICAgICAqIOS8oOWFpeWPguaVsOS5n+WPr+S7peaYr+iEmuacrOeahOWQjeensOOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBTcHJpdGUgfSBmcm9tICdjYyc7XHJcbiAgICAgKiAvLyBnZXQgc3ByaXRlIGNvbXBvbmVudC5cclxuICAgICAqIHZhciBzcHJpdGUgPSBub2RlLmdldENvbXBvbmVudChTcHJpdGUpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4gKGNsYXNzQ29uc3RydWN0b3I6IENvbnN0cnVjdG9yPFQ+KTogVCB8IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgdGhlIGNvbXBvbmVudCBvZiBzdXBwbGllZCB0eXBlIGlmIHRoZSBub2RlIGhhcyBvbmUgYXR0YWNoZWQsIG51bGwgaWYgaXQgZG9lc24ndC48YnIvPlxyXG4gICAgICogWW91IGNhbiBhbHNvIGdldCBjb21wb25lbnQgaW4gdGhlIG5vZGUgYnkgcGFzc2luZyBpbiB0aGUgbmFtZSBvZiB0aGUgc2NyaXB0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5boioLngrnkuIrmjIflrprnsbvlnovnmoTnu4Tku7bvvIzlpoLmnpzoioLngrnmnInpmYTliqDmjIflrprnsbvlnovnmoTnu4Tku7bvvIzliJnov5Tlm57vvIzlpoLmnpzmsqHmnInliJnkuLrnqbrjgII8YnIvPlxyXG4gICAgICog5Lyg5YWl5Y+C5pWw5Lmf5Y+v5Lul5piv6ISa5pys55qE5ZCN56ew44CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIC8vIGdldCBjdXN0b20gdGVzdCBjYWxzcy5cclxuICAgICAqIHZhciB0ZXN0ID0gbm9kZS5nZXRDb21wb25lbnQoXCJUZXN0XCIpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnQgKGNsYXNzTmFtZTogc3RyaW5nKTogQ29tcG9uZW50IHwgbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50ICh0eXBlT3JDbGFzc05hbWU6IGFueSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KHR5cGVPckNsYXNzTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBhbGwgY29tcG9uZW50cyBvZiBzdXBwbGllZCB0eXBlIGluIHRoZSBub2RlLlxyXG4gICAgICogQHpoIOi/lOWbnuiKgueCueS4iuaMh+Wumuexu+Wei+eahOaJgOaciee7hOS7tuOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBTcHJpdGUgfSBmcm9tICdjYyc7XHJcbiAgICAgKiBjb25zdCBzcHJpdGVzID0gbm9kZS5nZXRDb21wb25lbnRzKFNwcml0ZSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbXBvbmVudHM8VCBleHRlbmRzIENvbXBvbmVudD4gKGNsYXNzQ29uc3RydWN0b3I6IENvbnN0cnVjdG9yPFQ+KTogVFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgYWxsIGNvbXBvbmVudHMgb2Ygc3VwcGxpZWQgdHlwZSBpbiB0aGUgbm9kZS5cclxuICAgICAqIEB6aCDov5Tlm57oioLngrnkuIrmjIflrprnsbvlnovnmoTmiYDmnInnu4Tku7bjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogY29uc3QgdGVzdHMgPSBub2RlLmdldENvbXBvbmVudHMoXCJUZXN0XCIpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzIChjbGFzc05hbWU6IHN0cmluZyk6IENvbXBvbmVudFtdO1xyXG5cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzPFQgZXh0ZW5kcyBDb21wb25lbnQ+ICh0eXBlT3JDbGFzc05hbWU6IGFueSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50cyh0eXBlT3JDbGFzc05hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIGNvbXBvbmVudCBvZiBzdXBwbGllZCB0eXBlIGluIGFueSBvZiBpdHMgY2hpbGRyZW4gdXNpbmcgZGVwdGggZmlyc3Qgc2VhcmNoLlxyXG4gICAgICogQHpoIOmAkuW9kuafpeaJvuaJgOacieWtkOiKgueCueS4reesrOS4gOS4quWMuemFjeaMh+Wumuexu+Wei+eahOe7hOS7tuOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBTcHJpdGUgfSBmcm9tICdjYyc7XHJcbiAgICAgKiBjb25zdCBzcHJpdGUgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oU3ByaXRlKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50SW5DaGlsZHJlbjxUIGV4dGVuZHMgQ29tcG9uZW50PiAoY2xhc3NDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8VD4pOiBUIHwgbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBjb21wb25lbnQgb2Ygc3VwcGxpZWQgdHlwZSBpbiBhbnkgb2YgaXRzIGNoaWxkcmVuIHVzaW5nIGRlcHRoIGZpcnN0IHNlYXJjaC5cclxuICAgICAqIEB6aCDpgJLlvZLmn6Xmib7miYDmnInlrZDoioLngrnkuK3nrKzkuIDkuKrljLnphY3mjIflrprnsbvlnovnmoTnu4Tku7bjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogdmFyIFRlc3QgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oXCJUZXN0XCIpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRJbkNoaWxkcmVuIChjbGFzc05hbWU6IHN0cmluZyk6IENvbXBvbmVudCB8IG51bGw7XHJcblxyXG4gICAgcHVibGljIGdldENvbXBvbmVudEluQ2hpbGRyZW4gKHR5cGVPckNsYXNzTmFtZTogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKHR5cGVPckNsYXNzTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBhbGwgY29tcG9uZW50cyBvZiBzdXBwbGllZCB0eXBlIGluIHNlbGYgb3IgYW55IG9mIGl0cyBjaGlsZHJlbi5cclxuICAgICAqIEB6aCDpgJLlvZLmn6Xmib7oh6rouqvmiJbmiYDmnInlrZDoioLngrnkuK3mjIflrprnsbvlnovnmoTnu4Tku7bjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgU3ByaXRlIH0gZnJvbSAnY2MnO1xyXG4gICAgICogY29uc3Qgc3ByaXRlcyA9IG5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oU3ByaXRlKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4gKGNsYXNzQ29uc3RydWN0b3I6IENvbnN0cnVjdG9yPFQ+KTogVFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgYWxsIGNvbXBvbmVudHMgb2Ygc3VwcGxpZWQgdHlwZSBpbiBzZWxmIG9yIGFueSBvZiBpdHMgY2hpbGRyZW4uXHJcbiAgICAgKiBAemgg6YCS5b2S5p+l5om+6Ieq6Lqr5oiW5omA5pyJ5a2Q6IqC54K55Lit5oyH5a6a57G75Z6L55qE57uE5Lu244CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGNvbnN0IHRlc3RzID0gbm9kZS5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihcIlRlc3RcIik7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbXBvbmVudHNJbkNoaWxkcmVuIChjbGFzc05hbWU6IHN0cmluZyk6IENvbXBvbmVudFtdO1xyXG5cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzSW5DaGlsZHJlbiAodHlwZU9yQ2xhc3NOYW1lOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKHR5cGVPckNsYXNzTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT1ZFUlJJREVcclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGNvbnN0IGRlcGVuZCA9IHRoaXMubm9kZS5fZ2V0RGVwZW5kQ29tcG9uZW50KHRoaXMpO1xyXG4gICAgICAgICAgICBpZiAoZGVwZW5kKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDM2MjYsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0Q2xhc3NOYW1lKHRoaXMpLCBnZXRDbGFzc05hbWUoZGVwZW5kKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN1cGVyLmRlc3Ryb3koKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZW5hYmxlZCAmJiB0aGlzLm5vZGUuYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLl9jb21wU2NoZWR1bGVyLmRpc2FibGVDb21wKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9vblByZURlc3Ryb3kgKCkge1xyXG4gICAgICAgIC8vIFNjaGVkdWxlc1xyXG4gICAgICAgIHRoaXMudW5zY2hlZHVsZUFsbENhbGxiYWNrcygpO1xyXG5cclxuICAgICAgICAvL1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBfU2NlbmUuQXNzZXRzV2F0Y2hlci5zdG9wKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gb25EZXN0cm95XHJcbiAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuZGVzdHJveUNvbXAodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIGRvIHJlbW92ZSBjb21wb25lbnRcclxuICAgICAgICB0aGlzLm5vZGUuX3JlbW92ZUNvbXBvbmVudCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2luc3RhbnRpYXRlIChjbG9uZWQpIHtcclxuICAgICAgICBpZiAoIWNsb25lZCkge1xyXG4gICAgICAgICAgICBjbG9uZWQgPSBsZWdhY3lDQy5pbnN0YW50aWF0ZS5fY2xvbmUodGhpcywgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsb25lZC5ub2RlID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gY2xvbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNjaGVkdWxlclxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTY2hlZHVsZXMgYSBjdXN0b20gc2VsZWN0b3IuPGJyLz5cclxuICAgICAqIElmIHRoZSBzZWxlY3RvciBpcyBhbHJlYWR5IHNjaGVkdWxlZCwgdGhlbiB0aGUgaW50ZXJ2YWwgcGFyYW1ldGVyIHdpbGwgYmUgdXBkYXRlZCB3aXRob3V0IHNjaGVkdWxpbmcgaXQgYWdhaW4uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiwg+W6puS4gOS4quiHquWumuS5ieeahOWbnuiwg+WHveaVsOOAgjxici8+XHJcbiAgICAgKiDlpoLmnpzlm57osIPlh73mlbDlt7LosIPluqbvvIzpgqPkuYjlsIbkuI3kvJrph43lpI3osIPluqblroPvvIzlj6rkvJrmm7TmlrDml7bpl7Tpl7TpmpTlj4LmlbDjgIJcclxuICAgICAqIEBtZXRob2Qgc2NoZWR1bGVcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIOWbnuiwg+WHveaVsOOAglxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsICDml7bpl7Tpl7TpmpTvvIwwIOihqOekuuavj+W4p+mDvemHjeWkjeOAglxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJlcGVhdCAgICDlsIbooqvph43lpI3miafooYzvvIhyZXBlYXQrIDHvvInmrKHvvIzmgqjlj6/ku6Xkvb/nlKggY2MubWFjcm8uUkVQRUFUX0ZPUkVWRVIg6L+b6KGM5peg6ZmQ5qyh5b6q546v44CCXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgICAgIOesrOS4gOasoeaJp+ihjOWJjeetieW+heeahOaXtumXtO+8iOW7tuaXtuaJp+ihjO+8ieOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBsb2cgfSBmcm9tICdjYyc7XHJcbiAgICAgKiB0aGlzLnNjaGVkdWxlKChkdCkgPT4gdm9pZCBsb2coYHRpbWU6ICR7ZHR9YCksIDEpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzY2hlZHVsZSAoY2FsbGJhY2ssIGludGVydmFsOiBudW1iZXIgPSAwLCByZXBlYXQ6IG51bWJlciA9IGxlZ2FjeUNDLm1hY3JvLlJFUEVBVF9GT1JFVkVSLCBkZWxheTogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIGFzc2VydElEKGNhbGxiYWNrLCAxNjE5KTtcclxuXHJcbiAgICAgICAgaW50ZXJ2YWwgPSBpbnRlcnZhbCB8fCAwO1xyXG4gICAgICAgIGFzc2VydElEKGludGVydmFsID49IDAsIDE2MjApO1xyXG5cclxuICAgICAgICByZXBlYXQgPSBpc05hTihyZXBlYXQpID8gbGVnYWN5Q0MubWFjcm8uUkVQRUFUX0ZPUkVWRVIgOiByZXBlYXQ7XHJcbiAgICAgICAgZGVsYXkgPSBkZWxheSB8fCAwO1xyXG5cclxuICAgICAgICBjb25zdCBzY2hlZHVsZXIgPSBsZWdhY3lDQy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKTtcclxuXHJcbiAgICAgICAgLy8gc2hvdWxkIG5vdCB1c2UgZW5hYmxlZEluSGllcmFyY2h5IHRvIGp1ZGdlIHdoZXRoZXIgcGF1c2VkLFxyXG4gICAgICAgIC8vIGJlY2F1c2UgZW5hYmxlZEluSGllcmFyY2h5IGlzIGFzc2lnbmVkIGFmdGVyIG9uRW5hYmxlLlxyXG4gICAgICAgIC8vIEFjdHVhbGx5LCBpZiBub3QgeWV0IHNjaGVkdWxlZCwgcmVzdW1lVGFyZ2V0L3BhdXNlVGFyZ2V0IGhhcyBubyBlZmZlY3Qgb24gY29tcG9uZW50LFxyXG4gICAgICAgIC8vIHRoZXJlZm9yZSB0aGVyZSBpcyBubyB3YXkgdG8gZ3VhcmFudGVlIHRoZSBwYXVzZWQgc3RhdGUgb3RoZXIgdGhhbiBpc1RhcmdldFBhdXNlZC5cclxuICAgICAgICBjb25zdCBwYXVzZWQgPSBzY2hlZHVsZXIuaXNUYXJnZXRQYXVzZWQodGhpcyk7XHJcblxyXG4gICAgICAgIHNjaGVkdWxlci5zY2hlZHVsZShjYWxsYmFjaywgdGhpcywgaW50ZXJ2YWwsIHJlcGVhdCwgZGVsYXksIHBhdXNlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2NoZWR1bGVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBydW5zIG9ubHkgb25jZSwgd2l0aCBhIGRlbGF5IG9mIDAgb3IgbGFyZ2VyLlxyXG4gICAgICogQHpoIOiwg+W6puS4gOS4quWPqui/kOihjOS4gOasoeeahOWbnuiwg+WHveaVsO+8jOWPr+S7peaMh+WumiAwIOiuqeWbnuiwg+WHveaVsOWcqOS4i+S4gOW4p+eri+WNs+aJp+ihjOaIluiAheWcqOS4gOWumueahOW7tuaXtuS5i+WQjuaJp+ihjOOAglxyXG4gICAgICogQG1ldGhvZCBzY2hlZHVsZU9uY2VcclxuICAgICAqIEBzZWUgW1tzY2hlZHVsZV1dXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAg5Zue6LCD5Ye95pWw44CCXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgIOesrOS4gOasoeaJp+ihjOWJjeetieW+heeahOaXtumXtO+8iOW7tuaXtuaJp+ihjO+8ieOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBsb2cgfSBmcm9tICdjYyc7XHJcbiAgICAgKiB0aGlzLnNjaGVkdWxlT25jZSgoZHQpID0+IHZvaWQgbG9nKGB0aW1lOiAke2R0fWApLCAyKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2NoZWR1bGVPbmNlIChjYWxsYmFjaywgZGVsYXk6IG51bWJlciA9IDApIHtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlKGNhbGxiYWNrLCAwLCAwLCBkZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVW4tc2NoZWR1bGVzIGEgY3VzdG9tIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICogQHpoIOWPlua2iOiwg+W6puS4gOS4quiHquWumuS5ieeahOWbnuiwg+WHveaVsOOAglxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tfZm4gIOWbnuiwg+WHveaVsOOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiB0aGlzLnVuc2NoZWR1bGUoX2NhbGxiYWNrKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdW5zY2hlZHVsZSAoY2FsbGJhY2tfZm4pIHtcclxuICAgICAgICBpZiAoIWNhbGxiYWNrX2ZuKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnVuc2NoZWR1bGUoY2FsbGJhY2tfZm4sIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiB1bnNjaGVkdWxlIGFsbCBzY2hlZHVsZWQgY2FsbGJhY2sgZnVuY3Rpb25zOiBjdXN0b20gY2FsbGJhY2sgZnVuY3Rpb25zLCBhbmQgdGhlICd1cGRhdGUnIGNhbGxiYWNrIGZ1bmN0aW9uLjxici8+XHJcbiAgICAgKiBBY3Rpb25zIGFyZSBub3QgYWZmZWN0ZWQgYnkgdGhpcyBtZXRob2QuXHJcbiAgICAgKiBAemgg5Y+W5raI6LCD5bqm5omA5pyJ5bey6LCD5bqm55qE5Zue6LCD5Ye95pWw77ya5a6a5Yi255qE5Zue6LCD5Ye95pWw5Lul5Y+KICd1cGRhdGUnIOWbnuiwg+WHveaVsOOAguWKqOS9nOS4jeWPl+atpOaWueazleW9seWTjeOAglxyXG4gICAgICogQG1ldGhvZCB1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIHRoaXMudW5zY2hlZHVsZUFsbENhbGxiYWNrcygpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzICgpIHtcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS51bnNjaGVkdWxlQWxsRm9yVGFyZ2V0KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExJRkVDWUNMRSBNRVRIT0RTXHJcblxyXG4gICAgLy8gRmlyZWJhbGwgcHJvdmlkZXMgbGlmZWN5Y2xlIG1ldGhvZHMgdGhhdCB5b3UgY2FuIHNwZWNpZnkgdG8gaG9vayBpbnRvIHRoaXMgcHJvY2Vzcy5cclxuICAgIC8vIFdlIHByb3ZpZGUgUHJlIG1ldGhvZHMsIHdoaWNoIGFyZSBjYWxsZWQgcmlnaHQgYmVmb3JlIHNvbWV0aGluZyBoYXBwZW5zLCBhbmQgUG9zdCBtZXRob2RzIHdoaWNoIGFyZSBjYWxsZWQgcmlnaHQgYWZ0ZXIgc29tZXRoaW5nIGhhcHBlbnMuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVXBkYXRlIGlzIGNhbGxlZCBldmVyeSBmcmFtZSwgaWYgdGhlIENvbXBvbmVudCBpcyBlbmFibGVkLjxici8+XHJcbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuPGJyLz5cclxuICAgICAqIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXHJcbiAgICAgKiBAemgg5aaC5p6c6K+l57uE5Lu25ZCv55So77yM5YiZ5q+P5bin6LCD55SoIHVwZGF0ZeOAgjxici8+XHJcbiAgICAgKiDor6Xmlrnms5XkuLrnlJ/lkb3lkajmnJ/mlrnms5XvvIzniLbnsbvmnKrlv4XkvJrmnInlrp7njrDjgILlubbkuJTkvaDlj6rog73lnKjor6Xmlrnms5XlhoXpg6josIPnlKjniLbnsbvnmoTlrp7njrDvvIzkuI3lj6/lnKjlhbblroPlnLDmlrnnm7TmjqXosIPnlKjor6Xmlrnms5XjgIJcclxuICAgICAqIEBwYXJhbSBkdCAtIHRoZSBkZWx0YSB0aW1lIGluIHNlY29uZHMgaXQgdG9vayB0byBjb21wbGV0ZSB0aGUgbGFzdCBmcmFtZVxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlPyAoZHQ6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTGF0ZVVwZGF0ZSBpcyBjYWxsZWQgZXZlcnkgZnJhbWUsIGlmIHRoZSBDb21wb25lbnQgaXMgZW5hYmxlZC48YnIvPlxyXG4gICAgICogVGhpcyBpcyBhIGxpZmVjeWNsZSBtZXRob2QuIEl0IG1heSBub3QgYmUgaW1wbGVtZW50ZWQgaW4gdGhlIHN1cGVyIGNsYXNzLjxici8+XHJcbiAgICAgKiBZb3UgY2FuIG9ubHkgY2FsbCBpdHMgc3VwZXIgY2xhc3MgbWV0aG9kIGluc2lkZSBpdC4gSXQgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbWFudWFsbHkgZWxzZXdoZXJlLlxyXG4gICAgICogQHpoIOWmguaenOivpee7hOS7tuWQr+eUqO+8jOWImeavj+W4p+iwg+eUqCBMYXRlVXBkYXRl44CCPGJyLz5cclxuICAgICAqIOivpeaWueazleS4uueUn+WRveWRqOacn+aWueazle+8jOeItuexu+acquW/heS8muacieWunueOsOOAguW5tuS4lOS9oOWPquiDveWcqOivpeaWueazleWGhemDqOiwg+eUqOeItuexu+eahOWunueOsO+8jOS4jeWPr+WcqOWFtuWug+WcsOaWueebtOaOpeiwg+eUqOivpeaWueazleOAglxyXG4gICAgICogQHBhcmFtIGR0IC0gdGhlIGRlbHRhIHRpbWUgaW4gc2Vjb25kcyBpdCB0b29rIHRvIGNvbXBsZXRlIHRoZSBsYXN0IGZyYW1lXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBsYXRlVXBkYXRlPyAoZHQ6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gYF9fcHJlbG9hZGAgaXMgY2FsbGVkIGJlZm9yZSBldmVyeSBvbkxvYWQuPGJyLz5cclxuICAgICAqIEl0IGlzIHVzZWQgdG8gaW5pdGlhbGl6ZSB0aGUgYnVpbHRpbiBjb21wb25lbnRzIGludGVybmFsbHksPGJyLz5cclxuICAgICAqIHRvIGF2b2lkIGNoZWNraW5nIHdoZXRoZXIgb25Mb2FkIGlzIGNhbGxlZCBiZWZvcmUgZXZlcnkgcHVibGljIG1ldGhvZCBjYWxscy48YnIvPlxyXG4gICAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIHJlbW92ZWQgaWYgc2NyaXB0IHByaW9yaXR5IGlzIHN1cHBvcnRlZC5cclxuICAgICAqIEB6aCBgX19wcmVsb2FkYCDlnKjmr4/mrKFvbkxvYWTkuYvliY3osIPnlKjjgII8YnIvPlxyXG4gICAgICog5a6D55So5LqO5Zyo5YaF6YOo5Yid5aeL5YyW5YaF572u57uE5Lu277yMPGJyLz5cclxuICAgICAqIOS7pemBv+WFjeWcqOavj+asoeWFrOacieaWueazleiwg+eUqOS5i+WJjeajgOafpeaYr+WQpuiwg+eUqOS6hm9uTG9hZOOAgjxici8+XHJcbiAgICAgKiDlpoLmnpzmlK/mjIHohJrmnKzkvJjlhYjnuqfvvIzliJnlupTliKDpmaTmraTmlrnms5XjgIJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBfX3ByZWxvYWQ/ICgpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGVuIGF0dGFjaGluZyB0byBhbiBhY3RpdmUgbm9kZSBvciBpdHMgbm9kZSBmaXJzdCBhY3RpdmF0ZWQuPGJyLz5cclxuICAgICAqIG9uTG9hZCBpcyBhbHdheXMgY2FsbGVkIGJlZm9yZSBhbnkgc3RhcnQgZnVuY3Rpb25zLCB0aGlzIGFsbG93cyB5b3UgdG8gb3JkZXIgaW5pdGlhbGl6YXRpb24gb2Ygc2NyaXB0cy48YnIvPlxyXG4gICAgICogVGhpcyBpcyBhIGxpZmVjeWNsZSBtZXRob2QuIEl0IG1heSBub3QgYmUgaW1wbGVtZW50ZWQgaW4gdGhlIHN1cGVyIGNsYXNzLjxici8+XHJcbiAgICAgKiBZb3UgY2FuIG9ubHkgY2FsbCBpdHMgc3VwZXIgY2xhc3MgbWV0aG9kIGluc2lkZSBpdC4gSXQgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbWFudWFsbHkgZWxzZXdoZXJlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPpmYTliqDliLDkuIDkuKrmv4DmtLvnmoToioLngrnkuIrmiJbogIXlhbboioLngrnnrKzkuIDmrKHmv4DmtLvml7blgJnosIPnlKjjgIJvbkxvYWQg5oC75piv5Lya5Zyo5Lu75L2VIHN0YXJ0IOaWueazleiwg+eUqOWJjeaJp+ihjO+8jOi/meiDveeUqOS6juWuieaOkuiEmuacrOeahOWIneWni+WMlumhuuW6j+OAgjxici8+XHJcbiAgICAgKiDor6Xmlrnms5XkuLrnlJ/lkb3lkajmnJ/mlrnms5XvvIzniLbnsbvmnKrlv4XkvJrmnInlrp7njrDjgILlubbkuJTkvaDlj6rog73lnKjor6Xmlrnms5XlhoXpg6josIPnlKjniLbnsbvnmoTlrp7njrDvvIzkuI3lj6/lnKjlhbblroPlnLDmlrnnm7TmjqXosIPnlKjor6Xmlrnms5XjgIJcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIG9uTG9hZD8gKCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENhbGxlZCBiZWZvcmUgYWxsIHNjcmlwdHMnIHVwZGF0ZSBpZiB0aGUgQ29tcG9uZW50IGlzIGVuYWJsZWQgdGhlIGZpcnN0IHRpbWUuPGJyLz5cclxuICAgICAqIFVzdWFsbHkgdXNlZCB0byBpbml0aWFsaXplIHNvbWUgbG9naWMgd2hpY2ggbmVlZCB0byBiZSBjYWxsZWQgYWZ0ZXIgYWxsIGNvbXBvbmVudHMnIGBvbmxvYWRgIG1ldGhvZHMgY2FsbGVkLjxici8+XHJcbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuPGJyLz5cclxuICAgICAqIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWmguaenOivpee7hOS7tuesrOS4gOasoeWQr+eUqO+8jOWImeWcqOaJgOaciee7hOS7tueahCB1cGRhdGUg5LmL5YmN6LCD55So44CC6YCa5bi455So5LqO6ZyA6KaB5Zyo5omA5pyJ57uE5Lu255qEIG9uTG9hZCDliJ3lp4vljJblrozmr5XlkI7miafooYznmoTpgLvovpHjgII8YnIvPlxyXG4gICAgICog6K+l5pa55rOV5Li655Sf5ZG95ZGo5pyf5pa55rOV77yM54i257G75pyq5b+F5Lya5pyJ5a6e546w44CC5bm25LiU5L2g5Y+q6IO95Zyo6K+l5pa55rOV5YaF6YOo6LCD55So54i257G755qE5a6e546w77yM5LiN5Y+v5Zyo5YW25a6D5Zyw5pa555u05o6l6LCD55So6K+l5pa55rOV44CCXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzdGFydD8gKCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2FsbGVkIHdoZW4gdGhpcyBjb21wb25lbnQgYmVjb21lcyBlbmFibGVkIGFuZCBpdHMgbm9kZSBpcyBhY3RpdmUuPGJyLz5cclxuICAgICAqIFRoaXMgaXMgYSBsaWZlY3ljbGUgbWV0aG9kLiBJdCBtYXkgbm90IGJlIGltcGxlbWVudGVkIGluIHRoZSBzdXBlciBjbGFzcy5cclxuICAgICAqIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXHJcbiAgICAgKiBAemgg5b2T6K+l57uE5Lu26KKr5ZCv55So77yM5bm25LiU5a6D55qE6IqC54K55Lmf5r+A5rS75pe244CCPGJyLz5cclxuICAgICAqIOivpeaWueazleS4uueUn+WRveWRqOacn+aWueazle+8jOeItuexu+acquW/heS8muacieWunueOsOOAguW5tuS4lOS9oOWPquiDveWcqOivpeaWueazleWGhemDqOiwg+eUqOeItuexu+eahOWunueOsO+8jOS4jeWPr+WcqOWFtuWug+WcsOaWueebtOaOpeiwg+eUqOivpeaWueazleOAglxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgb25FbmFibGU/ICgpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENhbGxlZCB3aGVuIHRoaXMgY29tcG9uZW50IGJlY29tZXMgZGlzYWJsZWQgb3IgaXRzIG5vZGUgYmVjb21lcyBpbmFjdGl2ZS48YnIvPlxyXG4gICAgICogVGhpcyBpcyBhIGxpZmVjeWNsZSBtZXRob2QuIEl0IG1heSBub3QgYmUgaW1wbGVtZW50ZWQgaW4gdGhlIHN1cGVyIGNsYXNzLlxyXG4gICAgICogWW91IGNhbiBvbmx5IGNhbGwgaXRzIHN1cGVyIGNsYXNzIG1ldGhvZCBpbnNpZGUgaXQuIEl0IHNob3VsZCBub3QgYmUgY2FsbGVkIG1hbnVhbGx5IGVsc2V3aGVyZS5cclxuICAgICAqIEB6aCDlvZPor6Xnu4Tku7booqvnpoHnlKjmiJboioLngrnlj5jkuLrml6DmlYjml7bosIPnlKjjgII8YnIvPlxyXG4gICAgICog6K+l5pa55rOV5Li655Sf5ZG95ZGo5pyf5pa55rOV77yM54i257G75pyq5b+F5Lya5pyJ5a6e546w44CC5bm25LiU5L2g5Y+q6IO95Zyo6K+l5pa55rOV5YaF6YOo6LCD55So54i257G755qE5a6e546w77yM5LiN5Y+v5Zyo5YW25a6D5Zyw5pa555u05o6l6LCD55So6K+l5pa55rOV44CCXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBvbkRpc2FibGU/ICgpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENhbGxlZCB3aGVuIHRoaXMgY29tcG9uZW50IHdpbGwgYmUgZGVzdHJveWVkLjxici8+XHJcbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuPGJyLz5cclxuICAgICAqIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXHJcbiAgICAgKiBAemgg5b2T6K+l57uE5Lu26KKr6ZSA5q+B5pe26LCD55SoPGJyLz5cclxuICAgICAqIOivpeaWueazleS4uueUn+WRveWRqOacn+aWueazle+8jOeItuexu+acquW/heS8muacieWunueOsOOAguW5tuS4lOS9oOWPquiDveWcqOivpeaWueazleWGhemDqOiwg+eUqOeItuexu+eahOWunueOsO+8jOS4jeWPr+WcqOWFtuWug+WcsOaWueebtOaOpeiwg+eUqOivpeaWueazleOAglxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgb25EZXN0cm95PyAoKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgb25Gb2N1c0luRWRpdG9yPyAoKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgb25Mb3N0Rm9jdXNJbkVkaXRvcj8gKCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2FsbGVkIHRvIGluaXRpYWxpemUgdGhlIGNvbXBvbmVudCBvciBub2Rl4oCZcyBwcm9wZXJ0aWVzIHdoZW4gYWRkaW5nIHRoZSBjb21wb25lbnQgdGhlIGZpcnN0IHRpbWUgb3Igd2hlbiB0aGUgUmVzZXQgY29tbWFuZCBpcyB1c2VkLlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBpcyBvbmx5IGNhbGxlZCBpbiBlZGl0b3IuPGJyLz5cclxuICAgICAqIEB6aCDnlKjmnaXliJ3lp4vljJbnu4Tku7bmiJboioLngrnnmoTkuIDkupvlsZ7mgKfvvIzlvZPor6Xnu4Tku7booqvnrKzkuIDmrKHmt7vliqDliLDoioLngrnkuIrmiJbnlKjmiLfngrnlh7vkuoblroPnmoQgUmVzZXQg6I+c5Y2V5pe26LCD55So44CC6L+Z5Liq5Zue6LCD5Y+q5Lya5Zyo57yW6L6R5Zmo5LiL6LCD55So44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldEluRWRpdG9yPyAoKTogdm9pZDtcclxuXHJcbiAgICAvLyBWSVJUVUFMXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElmIHRoZSBjb21wb25lbnQncyBib3VuZGluZyBib3ggaXMgZGlmZmVyZW50IGZyb20gdGhlIG5vZGUncywgeW91IGNhbiBpbXBsZW1lbnQgdGhpcyBtZXRob2QgdG8gc3VwcGx5XHJcbiAgICAgKiBhIGN1c3RvbSBheGlzIGFsaWduZWQgYm91bmRpbmcgYm94IChBQUJCKSwgc28gdGhlIGVkaXRvcidzIHNjZW5lIHZpZXcgY2FuIHBlcmZvcm0gaGl0IHRlc3QgcHJvcGVybHkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWmguaenOe7hOS7tueahOWMheWbtOebkuS4juiKgueCueS4jeWQjO+8jOaCqOWPr+S7peWunueOsOivpeaWueazleS7peaPkOS+m+iHquWumuS5ieeahOi9tOWQkeWvuem9kOeahOWMheWbtOebku+8iEFBQkLvvInvvIxcclxuICAgICAqIOS7peS+v+e8lui+keWZqOeahOWcuuaZr+inhuWbvuWPr+S7peato+ehruWcsOaJp+ihjOeCuemAiea1i+ivleOAglxyXG4gICAgICogQHBhcmFtIG91dF9yZWN0IC0g5o+Q5L6b5YyF5Zu055uS55qEIFJlY3RcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIF9nZXRMb2NhbEJvdW5kcz8gKG91dF9yZWN0OiBSZWN0KTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogb25SZXN0b3JlIGlzIGNhbGxlZCBhZnRlciB0aGUgdXNlciBjbGlja3MgdGhlIFJlc2V0IGl0ZW0gaW4gdGhlIEluc3BlY3RvcidzIGNvbnRleHQgbWVudSBvciBwZXJmb3Jtc1xyXG4gICAgICogYW4gdW5kbyBvcGVyYXRpb24gb24gdGhpcyBjb21wb25lbnQuPGJyLz5cclxuICAgICAqIDxici8+XHJcbiAgICAgKiBJZiB0aGUgY29tcG9uZW50IGNvbnRhaW5zIHRoZSBcImludGVybmFsIHN0YXRlXCIsIHNob3J0IGZvciBcInRlbXBvcmFyeSBtZW1iZXIgdmFyaWFibGVzIHdoaWNoIG5vdCBpbmNsdWRlZDxici8+XHJcbiAgICAgKiBpbiBpdHMgQ0NDbGFzcyBwcm9wZXJ0aWVzXCIsIHRoZW4geW91IG1heSBuZWVkIHRvIGltcGxlbWVudCB0aGlzIGZ1bmN0aW9uLjxici8+XHJcbiAgICAgKiA8YnIvPlxyXG4gICAgICogVGhlIGVkaXRvciB3aWxsIGNhbGwgdGhlIGdldHNldCBhY2Nlc3NvcnMgb2YgeW91ciBjb21wb25lbnQgdG8gcmVjb3JkL3Jlc3RvcmUgdGhlIGNvbXBvbmVudCdzIHN0YXRlPGJyLz5cclxuICAgICAqIGZvciB1bmRvL3JlZG8gb3BlcmF0aW9uLiBIb3dldmVyLCBpbiBleHRyZW1lIGNhc2VzLCBpdCBtYXkgbm90IHdvcmtzIHdlbGwuIFRoZW4geW91IHNob3VsZCBpbXBsZW1lbnQ8YnIvPlxyXG4gICAgICogdGhpcyBmdW5jdGlvbiB0byBtYW51YWxseSBzeW5jaHJvbml6ZSB5b3VyIGNvbXBvbmVudCdzIFwiaW50ZXJuYWwgc3RhdGVzXCIgd2l0aCBpdHMgcHVibGljIHByb3BlcnRpZXMuPGJyLz5cclxuICAgICAqIE9uY2UgeW91IGltcGxlbWVudCB0aGlzIGZ1bmN0aW9uLCBhbGwgdGhlIGdldHNldCBhY2Nlc3NvcnMgb2YgeW91ciBjb21wb25lbnQgd2lsbCBub3QgYmUgY2FsbGVkIHdoZW48YnIvPlxyXG4gICAgICogdGhlIHVzZXIgcGVyZm9ybXMgYW4gdW5kby9yZWRvIG9wZXJhdGlvbi4gV2hpY2ggbWVhbnMgdGhhdCBvbmx5IHRoZSBwcm9wZXJ0aWVzIHdpdGggZGVmYXVsdCB2YWx1ZTxici8+XHJcbiAgICAgKiB3aWxsIGJlIHJlY29yZGVkIG9yIHJlc3RvcmVkIGJ5IGVkaXRvci48YnIvPlxyXG4gICAgICogPGJyLz5cclxuICAgICAqIFNpbWlsYXJseSwgdGhlIGVkaXRvciBtYXkgZmFpbGVkIHRvIHJlc2V0IHlvdXIgY29tcG9uZW50IGNvcnJlY3RseSBpbiBleHRyZW1lIGNhc2VzLiBUaGVuIGlmIHlvdSBuZWVkPGJyLz5cclxuICAgICAqIHRvIHN1cHBvcnQgdGhlIHJlc2V0IG1lbnUsIHlvdSBzaG91bGQgbWFudWFsbHkgc3luY2hyb25pemUgeW91ciBjb21wb25lbnQncyBcImludGVybmFsIHN0YXRlc1wiIHdpdGggaXRzPGJyLz5cclxuICAgICAqIHByb3BlcnRpZXMgaW4gdGhpcyBmdW5jdGlvbi4gT25jZSB5b3UgaW1wbGVtZW50IHRoaXMgZnVuY3Rpb24sIGFsbCB0aGUgZ2V0c2V0IGFjY2Vzc29ycyBvZiB5b3VyIGNvbXBvbmVudDxici8+XHJcbiAgICAgKiB3aWxsIG5vdCBiZSBjYWxsZWQgZHVyaW5nIHJlc2V0IG9wZXJhdGlvbi4gV2hpY2ggbWVhbnMgdGhhdCBvbmx5IHRoZSBwcm9wZXJ0aWVzIHdpdGggZGVmYXVsdCB2YWx1ZTxici8+XHJcbiAgICAgKiB3aWxsIGJlIHJlc2V0IGJ5IGVkaXRvci5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkIGluIGVkaXRvciBtb2RlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiBvblJlc3RvcmUg5piv55So5oi35Zyo5qOA5p+l5Zmo6I+c5Y2V54K55Ye7IFJlc2V0IOaXtu+8jOWvueatpOe7hOS7tuaJp+ihjOaSpOa2iOaTjeS9nOWQjuiwg+eUqOeahOOAgjxici8+XHJcbiAgICAgKiA8YnIvPlxyXG4gICAgICog5aaC5p6c57uE5Lu25YyF5ZCr5LqG4oCc5YaF6YOo54q25oCB4oCd77yI5LiN5ZyoIENDQ2xhc3Mg5bGe5oCn5Lit5a6a5LmJ55qE5Li05pe25oiQ5ZGY5Y+Y6YeP77yJ77yM6YKj5LmI5L2g5Y+v6IO96ZyA6KaB5a6e546w6K+l5pa55rOV44CCPGJyLz5cclxuICAgICAqIDxici8+XHJcbiAgICAgKiDnvJbovpHlmajmiafooYzmkqTplIAv6YeN5YGa5pON5L2c5pe277yM5bCG6LCD55So57uE5Lu255qEIGdldCBzZXQg5p2l5b2V5Yi25ZKM6L+Y5Y6f57uE5Lu255qE54q25oCB44CCXHJcbiAgICAgKiDnhLbogIzvvIzlnKjmnoHnq6/nmoTmg4XlhrXkuIvvvIzlroPlj6/og73ml6Dms5Xoia/lpb3ov5DkvZzjgII8YnIvPlxyXG4gICAgICog6YKj5LmI5L2g5bCx5bqU6K+l5a6e546w6L+Z5Liq5pa55rOV77yM5omL5Yqo5qC55o2u57uE5Lu255qE5bGe5oCn5ZCM5q2l4oCc5YaF6YOo54q25oCB4oCd44CCXHJcbiAgICAgKiDkuIDml6bkvaDlrp7njrDov5nkuKrmlrnms5XvvIzlvZPnlKjmiLfmkqTplIDmiJbph43lgZrml7bvvIznu4Tku7bnmoTmiYDmnIkgZ2V0IHNldCDpg73kuI3kvJrlho3ooqvosIPnlKjjgIJcclxuICAgICAqIOi/meaEj+WRs+edgOS7heS7heaMh+WumuS6hum7mOiupOWAvOeahOWxnuaAp+Wwhuiiq+e8lui+keWZqOiusOW9leWSjOi/mOWOn+OAgjxici8+XHJcbiAgICAgKiA8YnIvPlxyXG4gICAgICog5ZCM5qC355qE77yM57yW6L6R5Y+v6IO95peg5rOV5Zyo5p6B56uv5oOF5Ya15LiL5q2j56Gu5Zyw6YeN572u5oKo55qE57uE5Lu244CCPGJyLz5cclxuICAgICAqIOS6juaYr+WmguaenOS9oOmcgOimgeaUr+aMgee7hOS7tumHjee9ruiPnOWNle+8jOS9oOmcgOimgeWcqOivpeaWueazleS4reaJi+W3peWQjOatpee7hOS7tuWxnuaAp+WIsOKAnOWGhemDqOeKtuaAgeKAneOAgjxici8+XHJcbiAgICAgKiDkuIDml6bkvaDlrp7njrDov5nkuKrmlrnms5XvvIznu4Tku7bnmoTmiYDmnIkgZ2V0IHNldCDpg73kuI3kvJrlnKjph43nva7mk43kvZzml7booqvosIPnlKjjgIJcclxuICAgICAqIOi/meaEj+WRs+edgOS7heS7heaMh+WumuS6hum7mOiupOWAvOeahOWxnuaAp+Wwhuiiq+e8lui+keWZqOmHjee9ruOAglxyXG4gICAgICogPGJyLz5cclxuICAgICAqIOatpOaWueazleS7heWcqOe8lui+keWZqOS4i+S8muiiq+iwg+eUqOOAglxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgb25SZXN0b3JlPyAoKTogdm9pZDtcclxufVxyXG5cclxuY29uc3QgcHJvdG8gPSBDb21wb25lbnQucHJvdG90eXBlO1xyXG4vLyBAdHMtaWdub3JlXHJcbnByb3RvLnVwZGF0ZSA9IG51bGw7XHJcbi8vIEB0cy1pZ25vcmVcclxucHJvdG8ubGF0ZVVwZGF0ZSA9IG51bGw7XHJcbi8vIEB0cy1pZ25vcmVcclxucHJvdG8uX19wcmVsb2FkID0gbnVsbDtcclxuLy8gQHRzLWlnbm9yZVxyXG5wcm90by5vbkxvYWQgPSBudWxsO1xyXG4vLyBAdHMtaWdub3JlXHJcbnByb3RvLnN0YXJ0ID0gbnVsbDtcclxuLy8gQHRzLWlnbm9yZVxyXG5wcm90by5vbkVuYWJsZSA9IG51bGw7XHJcbi8vIEB0cy1pZ25vcmVcclxucHJvdG8ub25EaXNhYmxlID0gbnVsbDtcclxuLy8gQHRzLWlnbm9yZVxyXG5wcm90by5vbkRlc3Ryb3kgPSBudWxsO1xyXG4vLyBAdHMtaWdub3JlXHJcbnByb3RvLm9uRm9jdXNJbkVkaXRvciA9IG51bGw7XHJcbi8vIEB0cy1pZ25vcmVcclxucHJvdG8ub25Mb3N0Rm9jdXNJbkVkaXRvciA9IG51bGw7XHJcbi8vIEB0cy1pZ25vcmVcclxucHJvdG8ucmVzZXRJbkVkaXRvciA9IG51bGw7XHJcbi8vIEB0cy1pZ25vcmVcclxucHJvdG8uX2dldExvY2FsQm91bmRzID0gbnVsbDtcclxuLy8gQHRzLWlnbm9yZVxyXG5wcm90by5vblJlc3RvcmUgPSBudWxsO1xyXG4vLyBAdHMtaWdub3JlXHJcbkNvbXBvbmVudC5fcmVxdWlyZUNvbXBvbmVudCA9IG51bGw7XHJcbi8vIEB0cy1pZ25vcmVcclxuQ29tcG9uZW50Ll9leGVjdXRpb25PcmRlciA9IDA7XHJcblxyXG5pZiAoRURJVE9SIHx8IFRFU1QpIHtcclxuXHJcbiAgICAvLyBJTkhFUklUQUJMRSBTVEFUSUMgTUVNQkVSU1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgQ29tcG9uZW50Ll9leGVjdXRlSW5FZGl0TW9kZSA9IGZhbHNlO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgQ29tcG9uZW50Ll9wbGF5T25Gb2N1cyA9IGZhbHNlO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgQ29tcG9uZW50Ll9kaXNhbGxvd011bHRpcGxlID0gbnVsbDtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIENvbXBvbmVudC5faGVscCA9ICcnO1xyXG5cclxuICAgIC8vIE5PTi1JTkhFUklURUQgU1RBVElDIE1FTUJFUlNcclxuICAgIC8vIChUeXBlU2NyaXB0IDIuMyB3aWxsIHN0aWxsIGluaGVyaXQgdGhlbSwgc28gYWx3YXlzIGNoZWNrIGhhc093blByb3BlcnR5IGJlZm9yZSB1c2luZylcclxuXHJcbiAgICB2YWx1ZShDb21wb25lbnQsICdfaW5zcGVjdG9yJywgJycsIHRydWUpO1xyXG4gICAgdmFsdWUoQ29tcG9uZW50LCAnX2ljb24nLCAnJywgdHJ1ZSk7XHJcblxyXG4gICAgLy8gQ09NUE9ORU5UIEhFTFBFUlNcclxuXHJcbiAgICAvLyBUT0RPIEtlZXAgdGVtcG9yYXJpbHksIGNvbXBhdGlibGUgd2l0aCBvbGQgdmVyc2lvblxyXG4gICAgbGVnYWN5Q0MuX2NvbXBvbmVudE1lbnVJdGVtcyA9IFtdO1xyXG59XHJcblxyXG4vLyB3ZSBtYWtlIHRoaXMgbm9uLWVudW1lcmFibGUsIHRvIHByZXZlbnQgaW5oZXJpdGVkIGJ5IHN1YiBjbGFzc2VzLlxyXG52YWx1ZShDb21wb25lbnQsICdfcmVnaXN0ZXJFZGl0b3JQcm9wcycsIGZ1bmN0aW9uIChjbHMsIHByb3BzKSB7XHJcbiAgICBjb25zdCByZXFDb21wID0gcHJvcHMucmVxdWlyZUNvbXBvbmVudDtcclxuICAgIGlmIChyZXFDb21wKSB7XHJcbiAgICAgICAgY2xzLl9yZXF1aXJlQ29tcG9uZW50ID0gcmVxQ29tcDtcclxuICAgIH1cclxuICAgIGNvbnN0IG9yZGVyID0gcHJvcHMuZXhlY3V0aW9uT3JkZXI7XHJcbiAgICBpZiAob3JkZXIgJiYgdHlwZW9mIG9yZGVyID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGNscy5fZXhlY3V0aW9uT3JkZXIgPSBvcmRlcjtcclxuICAgIH1cclxuICAgIGlmIChFRElUT1IgfHwgVEVTVCkge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBnZXRDbGFzc05hbWUoY2xzKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcykge1xyXG4gICAgICAgICAgICBjb25zdCB2YWwgPSBwcm9wc1trZXldO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZXhlY3V0ZUluRWRpdE1vZGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNscy5fZXhlY3V0ZUluRWRpdE1vZGUgPSAhIXZhbDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdwbGF5T25Gb2N1cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3aWxsRXhlY3V0ZUluRWRpdE1vZGUgPSAoJ2V4ZWN1dGVJbkVkaXRNb2RlJyBpbiBwcm9wcykgPyBwcm9wcy5leGVjdXRlSW5FZGl0TW9kZSA6IGNscy5fZXhlY3V0ZUluRWRpdE1vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aWxsRXhlY3V0ZUluRWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNscy5fcGxheU9uRm9jdXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FybklEKDM2MDEsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2luc3BlY3Rvcic6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUoY2xzLCAnX2luc3BlY3RvcicsIHZhbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnaWNvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUoY2xzLCAnX2ljb24nLCB2YWwsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ21lbnUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYW1lID0gUkYucGVlaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtZW51ID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW51ID0gJ2kxOG46bWVudS5jdXN0b21fc2NyaXB0LycgKyBtZW51O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgRURJVE9SICYmIEVkaXRvckV4dGVuZHMuQ29tcG9uZW50LnJlbW92ZU1lbnUoY2xzKTtcclxuICAgICAgICAgICAgICAgICAgICBFRElUT1IgJiYgRWRpdG9yRXh0ZW5kcy5Db21wb25lbnQuYWRkTWVudShjbHMsIG1lbnUsIHByb3BzLm1lbnVQcmlvcml0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZGlzYWxsb3dNdWx0aXBsZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2xzLl9kaXNhbGxvd011bHRpcGxlID0gY2xzO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JlcXVpcmVDb21wb25lbnQnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZXhlY3V0aW9uT3JkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNraXAgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2hlbHAnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNscy5faGVscCA9IHZhbDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHdhcm5JRCgzNjAyLCBrZXksIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbmxlZ2FjeUNDLkNvbXBvbmVudCA9IENvbXBvbmVudDtcclxuZXhwb3J0IHsgQ29tcG9uZW50IH07XHJcbiJdfQ==