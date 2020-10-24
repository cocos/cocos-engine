(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../components/component.js", "../data/decorators/property.js", "../data/decorators/index.js", "../data/object.js", "../platform/debug.js", "../platform/event-manager/event-enum.js", "../utils/id-generator.js", "../utils/js.js", "./base-node-dev.js", "./node-event-processor.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../components/component.js"), require("../data/decorators/property.js"), require("../data/decorators/index.js"), require("../data/object.js"), require("../platform/debug.js"), require("../platform/event-manager/event-enum.js"), require("../utils/id-generator.js"), require("../utils/js.js"), require("./base-node-dev.js"), require("./node-event-processor.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.property, global.index, global.object, global.debug, global.eventEnum, global.idGenerator, global.js, global.baseNodeDev, global.nodeEventProcessor, global.defaultConstants, global.globalExports);
    global.baseNode = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _property, _index, _object, _debug, _eventEnum, _idGenerator, js, _baseNodeDev, _nodeEventProcessor, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BaseNode = _exports.TRANSFORM_ON = void 0;
  _idGenerator = _interopRequireDefault(_idGenerator);
  js = _interopRequireWildcard(js);

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _temp;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  // @ts-ignore
  var Destroying = _object.CCObject.Flags.Destroying; // @ts-ignore

  var DontDestroy = _object.CCObject.Flags.DontDestroy; // @ts-ignore

  var Deactivating = _object.CCObject.Flags.Deactivating; // @ts-ignore

  var Activating = _object.CCObject.Flags.Activating;
  var ChangingState = Activating | Deactivating;
  var TRANSFORM_ON = 1 << 0; // const CHILD_ADDED = 'child-added';
  // const CHILD_REMOVED = 'child-removed';

  _exports.TRANSFORM_ON = TRANSFORM_ON;
  var idGenerator = new _idGenerator.default('Node');
  var NullScene = null;

  function getConstructor(typeOrClassName) {
    if (!typeOrClassName) {
      (0, _debug.errorID)(3804);
      return null;
    }

    if (typeof typeOrClassName === 'string') {
      return js.getClassByName(typeOrClassName);
    }

    return typeOrClassName;
  }
  /**
   * @en The base class for [[Node]], it:
   * - maintains scene hierarchy and life cycle logic
   * - provides EventTarget ability
   * - emits events if some properties changed, ref: [[SystemEventType]]
   * - manages components
   * @zh [[Node]] 的基类，他会负责：
   * - 维护场景树以及节点生命周期管理
   * - 提供 EventTarget 的事件管理和注册能力
   * - 派发节点状态相关的事件，参考：[[SystemEventType]]
   * - 管理组件
   */


  var BaseNode = (_dec = (0, _index.ccclass)('cc.BaseNode'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_CCObject) {
    _inherits(BaseNode, _CCObject);

    _createClass(BaseNode, [{
      key: "components",

      /**
       * @en Gets all components attached to this node.
       * @zh 获取附加到此节点的所有组件。
       */
      get: function get() {
        return this._components;
      }
      /**
       * @en If true, the node is an persist node which won't be destroyed during scene transition.
       * If false, the node will be destroyed automatically when loading a new scene. Default is false.
       * @zh 如果为true，则该节点是一个常驻节点，不会在场景转换期间被销毁。
       * 如果为false，节点将在加载新场景时自动销毁。默认为 false。
       * @default false
       * @protected
       */

    }, {
      key: "_persistNode",
      get: function get() {
        return (this._objFlags & DontDestroy) > 0;
      },
      set: function set(value) {
        if (value) {
          this._objFlags |= DontDestroy;
        } else {
          this._objFlags &= ~DontDestroy;
        }
      } // API

      /**
       * @en Name of node.
       * @zh 该节点名称。
       */

    }, {
      key: "name",
      get: function get() {
        return this._name;
      },
      set: function set(value) {
        if (_defaultConstants.DEV && value.indexOf('/') !== -1) {
          (0, _debug.errorID)(1632);
          return;
        }

        this._name = value;
      }
      /**
       * @en The uuid for editor, will be stripped after building project.
       * @zh 主要用于编辑器的 uuid，在编辑器下可用于持久化存储，在项目构建之后将变成自增的 id。
       * @readOnly
       */

    }, {
      key: "uuid",
      get: function get() {
        return this._id;
      }
      /**
       * @en All children nodes.
       * @zh 节点的所有子节点。
       * @readOnly
       */

    }, {
      key: "children",
      get: function get() {
        return this._children;
      }
      /**
       * @en
       * The local active state of this node.
       * Note that a Node may be inactive because a parent is not active, even if this returns true.
       * Use [[activeInHierarchy]]
       * if you want to check if the Node is actually treated as active in the scene.
       * @zh
       * 当前节点的自身激活状态。
       * 值得注意的是，一个节点的父节点如果不被激活，那么即使它自身设为激活，它仍然无法激活。
       * 如果你想检查节点在场景中实际的激活状态可以使用 [[activeInHierarchy]]
       * @default true
       */

    }, {
      key: "active",
      get: function get() {
        return this._active;
      },
      set: function set(isActive) {
        if (this._active !== isActive) {
          this._active = isActive;
          var parent = this._parent;

          if (parent) {
            var couldActiveInScene = parent._activeInHierarchy;

            if (couldActiveInScene) {
              _globalExports.legacyCC.director._nodeActivator.activateNode(this, isActive);
            }
          }
        }
      }
      /**
       * @en Indicates whether this node is active in the scene.
       * @zh 表示此节点是否在场景中激活。
       */

    }, {
      key: "activeInHierarchy",
      get: function get() {
        return this._activeInHierarchy;
      }
      /**
       * @en The parent node
       * @zh 父节点
       */

    }, {
      key: "parent",
      get: function get() {
        return this._parent;
      },
      set: function set(value) {
        this.setParent(value);
      }
      /**
       * @en Which scene this node belongs to.
       * @zh 此节点属于哪个场景。
       * @readonly
       */

    }, {
      key: "scene",
      get: function get() {
        return this._scene;
      }
      /**
       * @en The event processor of the current node, it provides EventTarget ability.
       * @zh 当前节点的事件处理器，提供 EventTarget 能力。
       * @readonly
       */

    }, {
      key: "eventProcessor",
      get: function get() {
        return this._eventProcessor;
      }
    }], [{
      key: "_setScene",
      value: function _setScene(node) {
        if (node instanceof _globalExports.legacyCC.Scene) {
          node._scene = node;
        } else {
          if (node._parent == null) {
            (0, _debug.error)('Node %s(%s) has not attached to a scene.', node.name, node.uuid);
          } else {
            node._scene = node._parent._scene;
          }
        }
      }
    }, {
      key: "_findComponent",
      value: function _findComponent(node, constructor) {
        var cls = constructor;
        var comps = node._components;

        if (cls._sealed) {
          for (var i = 0; i < comps.length; ++i) {
            var comp = comps[i];

            if (comp.constructor === constructor) {
              return comp;
            }
          }
        } else {
          for (var _i = 0; _i < comps.length; ++_i) {
            var _comp = comps[_i];

            if (_comp instanceof constructor) {
              return _comp;
            }
          }
        }

        return null;
      }
    }, {
      key: "_findComponents",
      value: function _findComponents(node, constructor, components) {
        var cls = constructor;
        var comps = node._components;

        if (cls._sealed) {
          for (var i = 0; i < comps.length; ++i) {
            var comp = comps[i];

            if (comp.constructor === constructor) {
              components.push(comp);
            }
          }
        } else {
          for (var _i2 = 0; _i2 < comps.length; ++_i2) {
            var _comp2 = comps[_i2];

            if (_comp2 instanceof constructor) {
              components.push(_comp2);
            }
          }
        }
      }
    }, {
      key: "_findChildComponent",
      value: function _findChildComponent(children, constructor) {
        for (var i = 0; i < children.length; ++i) {
          var node = children[i];

          var comp = BaseNode._findComponent(node, constructor);

          if (comp) {
            return comp;
          } else if (node._children.length > 0) {
            comp = BaseNode._findChildComponent(node._children, constructor);

            if (comp) {
              return comp;
            }
          }
        }

        return null;
      }
    }, {
      key: "_findChildComponents",
      value: function _findChildComponents(children, constructor, components) {
        for (var i = 0; i < children.length; ++i) {
          var node = children[i];

          BaseNode._findComponents(node, constructor, components);

          if (node._children.length > 0) {
            BaseNode._findChildComponents(node._children, constructor, components);
          }
        }
      }
    }]);

    function BaseNode(name) {
      var _this;

      _classCallCheck(this, BaseNode);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseNode).call(this, name));

      _initializerDefineProperty(_this, "_parent", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_children", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_active", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_components", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_prefab", _descriptor5, _assertThisInitialized(_this));

      _this._scene = NullScene;
      _this._activeInHierarchy = false;
      _this._id = idGenerator.getNewId();
      _this._name = void 0;
      _this._eventProcessor = new _nodeEventProcessor.NodeEventProcessor(_assertThisInitialized(_this));
      _this._eventMask = 0;
      _this._siblingIndex = 0;
      _this._registerIfAttached = !_defaultConstants.EDITOR ? undefined : function (register) {
        if (EditorExtends.Node && EditorExtends.Component) {
          if (register) {
            EditorExtends.Node.add(this._id, this);

            for (var i = 0; i < this._components.length; i++) {
              var comp = this._components[i];
              EditorExtends.Component.add(comp._id, comp);
            }
          } else {
            for (var _i3 = 0; _i3 < this._components.length; _i3++) {
              var _comp3 = this._components[_i3];
              EditorExtends.Component.remove(_comp3._id);
            }

            EditorExtends.Node.remove(this._id);
          }
        }

        var children = this._children;

        for (var _i4 = 0, len = children.length; _i4 < len; ++_i4) {
          var child = children[_i4];

          child._registerIfAttached(register);
        }
      };
      _this._name = name !== undefined ? name : 'New Node';
      return _this;
    }
    /**
     * @en
     * Properties configuration function.
     * All properties in attrs will be set to the node, 
     * when the setter of the node is available, 
     * the property will be set via setter function.
     * @zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
     * @param attrs - Properties to be set to node
     * @example
     * ```
     * var attrs = { name: 'New Name', active: false };
     * node.attr(attrs);
     * ```
     */


    _createClass(BaseNode, [{
      key: "attr",
      value: function attr(attrs) {
        js.mixin(this, attrs);
      } // HIERARCHY METHODS

      /**
       * @en Get parent of the node.
       * @zh 获取该节点的父节点。
       */

    }, {
      key: "getParent",
      value: function getParent() {
        return this._parent;
      }
      /**
       * @en Set parent of the node.
       * @zh 设置该节点的父节点。
       */

    }, {
      key: "setParent",
      value: function setParent(value) {
        var keepWorldTransform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (this._parent === value) {
          return;
        }

        var oldParent = this._parent;
        var newParent = value;

        if (_defaultConstants.DEBUG && oldParent && // Change parent when old parent desactivating or activating
        oldParent._objFlags & ChangingState) {
          (0, _debug.errorID)(3821);
        }

        this._parent = newParent; // Reset sibling index

        this._siblingIndex = 0;

        this._onSetParent(oldParent, keepWorldTransform);

        if (this.emit) {
          this.emit(_eventEnum.SystemEventType.PARENT_CHANGED, oldParent);
        }

        if (oldParent) {
          if (!(oldParent._objFlags & Destroying)) {
            var removeAt = oldParent._children.indexOf(this);

            if (_defaultConstants.DEV && removeAt < 0) {
              return (0, _debug.errorID)(1633);
            }

            oldParent._children.splice(removeAt, 1);

            oldParent._updateSiblingIndex();

            if (oldParent.emit) {
              oldParent.emit(_eventEnum.SystemEventType.CHILD_REMOVED, this);
            }
          }
        }

        if (newParent) {
          if (_defaultConstants.DEBUG && newParent._objFlags & Deactivating) {
            (0, _debug.errorID)(3821);
          }

          newParent._children.push(this);

          this._siblingIndex = newParent._children.length - 1;

          if (newParent.emit) {
            newParent.emit(_eventEnum.SystemEventType.CHILD_ADDED, this);
          }
        }

        this._onHierarchyChanged(oldParent);
      }
      /**
       * @en Returns a child with the same uuid.
       * @zh 通过 uuid 获取节点的子节点。
       * @param uuid - The uuid to find the child node.
       * @return a Node whose uuid equals to the input parameter
       */

    }, {
      key: "getChildByUuid",
      value: function getChildByUuid(uuid) {
        if (!uuid) {
          (0, _debug.log)('Invalid uuid');
          return null;
        }

        var locChildren = this._children;

        for (var i = 0, len = locChildren.length; i < len; i++) {
          if (locChildren[i]._id === uuid) {
            return locChildren[i];
          }
        }

        return null;
      }
      /**
       * @en Returns a child with the same name.
       * @zh 通过名称获取节点的子节点。
       * @param name - A name to find the child node.
       * @return a CCNode object whose name equals to the input parameter
       * @example
       * ```
       * var child = node.getChildByName("Test Node");
       * ```
       */

    }, {
      key: "getChildByName",
      value: function getChildByName(name) {
        if (!name) {
          (0, _debug.log)('Invalid name');
          return null;
        }

        var locChildren = this._children;

        for (var i = 0, len = locChildren.length; i < len; i++) {
          if (locChildren[i]._name === name) {
            return locChildren[i];
          }
        }

        return null;
      }
      /**
       * @en Returns a child with the given path.
       * @zh 通过路径获取节点的子节点。
       * @param path - A path to find the child node.
       * @return a Node object whose path equals to the input parameter
       * @example
       * ```
       * var child = node.getChildByPath("subNode/Test Node");
       * ```
       */

    }, {
      key: "getChildByPath",
      value: function getChildByPath(path) {
        var segments = path.split('/');
        var lastNode = this;

        var _loop = function _loop(i) {
          var segment = segments[i];

          if (segment.length === 0) {
            return "continue";
          }

          var next = lastNode.children.find(function (childNode) {
            return childNode.name === segment;
          });

          if (!next) {
            return {
              v: null
            };
          }

          lastNode = next;
        };

        for (var i = 0; i < segments.length; ++i) {
          var _ret = _loop(i);

          switch (_ret) {
            case "continue":
              continue;

            default:
              if (_typeof(_ret) === "object") return _ret.v;
          }
        }

        return lastNode;
      }
      /**
       * @en Add a child to the current node, it will be pushed to the end of [[children]] array.
       * @zh 添加一个子节点，它会被添加到 [[children]] 数组的末尾。
       * @param child - the child node to be added
       */

    }, {
      key: "addChild",
      value: function addChild(child) {
        if (_defaultConstants.DEV && !(child instanceof _globalExports.legacyCC._BaseNode)) {
          return (0, _debug.errorID)(1634, _globalExports.legacyCC.js.getClassName(child));
        }

        (0, _debug.assertID)(child, 1606);
        (0, _debug.assertID)(child._parent === null, 1605); // invokes the parent setter

        child.setParent(this);
      }
      /**
       * @en Inserts a child to the node at a specified index.
       * @zh 插入子节点到指定位置
       * @param child - the child node to be inserted
       * @param siblingIndex - the sibling index to place the child in
       * @example
       * ```
       * node.insertChild(child, 2);
       * ```
       */

    }, {
      key: "insertChild",
      value: function insertChild(child, siblingIndex) {
        child.parent = this;
        child.setSiblingIndex(siblingIndex);
      }
      /**
       * @en Get the sibling index of the current node in its parent's children array.
       * @zh 获取当前节点在父节点的 children 数组中的位置。
       */

    }, {
      key: "getSiblingIndex",
      value: function getSiblingIndex() {
        return this._siblingIndex;
      }
      /**
       * @en Set the sibling index of the current node in its parent's children array.
       * @zh 设置当前节点在父节点的 children 数组中的位置。
       */

    }, {
      key: "setSiblingIndex",
      value: function setSiblingIndex(index) {
        if (!this._parent) {
          return;
        }

        if (this._parent._objFlags & Deactivating) {
          (0, _debug.errorID)(3821);
          return;
        }

        var siblings = this._parent._children;
        index = index !== -1 ? index : siblings.length - 1;
        var oldIndex = siblings.indexOf(this);

        if (index !== oldIndex) {
          siblings.splice(oldIndex, 1);

          if (index < siblings.length) {
            siblings.splice(index, 0, this);
          } else {
            siblings.push(this);
          }

          this._parent._updateSiblingIndex();

          if (this._onSiblingIndexChanged) {
            this._onSiblingIndexChanged(index);
          }
        }
      }
      /**
       * @en Walk though the sub children tree of the current node.
       * Each node, including the current node, in the sub tree will be visited two times,
       * before all children and after all children.
       * This function call is not recursive, it's based on stack.
       * Please don't walk any other node inside the walk process.
       * @zh 遍历该节点的子树里的所有节点并按规则执行回调函数。
       * 对子树中的所有节点，包含当前节点，会执行两次回调，preFunc 会在访问它的子节点之前调用，postFunc 会在访问所有子节点之后调用。
       * 这个函数的实现不是基于递归的，而是基于栈展开递归的方式。
       * 请不要在 walk 过程中对任何其他的节点嵌套执行 walk。
       * @param preFunc The callback to process node when reach the node for the first time
       * @param postFunc The callback to process node when re-visit the node after walked all children in its sub tree
       * @example
       * ```
       * node.walk(function (target) {
       *     console.log('Walked through node ' + target.name + ' for the first time');
       * }, function (target) {
       *     console.log('Walked through node ' + target.name + ' after walked all children in its sub tree');
       * });
       * ```
       */

    }, {
      key: "walk",
      value: function walk(preFunc, postFunc) {
        // const BaseNode = cc._BaseNode;
        var index = 1;
        var children = null;
        var curr = null;
        var i = 0;
        var stack = BaseNode._stacks[BaseNode._stackId];

        if (!stack) {
          stack = [];

          BaseNode._stacks.push(stack);
        }

        BaseNode._stackId++;
        stack.length = 0;
        stack[0] = this;
        var parent = null;
        var afterChildren = false;

        while (index) {
          index--;
          curr = stack[index];

          if (!curr) {
            continue;
          }

          if (!afterChildren && preFunc) {
            // pre call
            preFunc(curr);
          } else if (afterChildren && postFunc) {
            // post call
            postFunc(curr);
          } // Avoid memory leak


          stack[index] = null; // Do not repeatly visit child tree, just do post call and continue walk

          if (afterChildren) {
            if (parent === this._parent) break;
            afterChildren = false;
          } else {
            // Children not proceeded and has children, proceed to child tree
            if (curr._children.length > 0) {
              parent = curr;
              children = curr._children;
              i = 0;
              stack[index] = children[i];
              index++;
            } else {
              stack[index] = curr;
              index++;
              afterChildren = true;
            }

            continue;
          } // curr has no sub tree, so look into the siblings in parent children


          if (children) {
            i++; // Proceed to next sibling in parent children

            if (children[i]) {
              stack[index] = children[i];
              index++;
            } else if (parent) {
              stack[index] = parent;
              index++; // Setup parent walk env

              afterChildren = true;

              if (parent._parent) {
                children = parent._parent._children;
                i = children.indexOf(parent);
                parent = parent._parent;
              } else {
                // At root
                parent = null;
                children = null;
              } // ERROR


              if (i < 0) {
                break;
              }
            }
          }
        }

        stack.length = 0;
        BaseNode._stackId--;
      }
      /**
       * @en
       * Remove itself from its parent node. 
       * If the node have no parent, then nothing happens.
       * @zh
       * 从父节点中删除该节点。
       * 如果这个节点是一个孤立节点，那么什么都不会发生。
       */

    }, {
      key: "removeFromParent",
      value: function removeFromParent() {
        if (this._parent) {
          this._parent.removeChild(this);
        }
      }
      /**
       * @en Removes a child from the container.
       * @zh 移除节点中指定的子节点。
       * @param child - The child node which will be removed.
       */

    }, {
      key: "removeChild",
      value: function removeChild(child) {
        if (this._children.indexOf(child) > -1) {
          // invoke the parent setter
          child.parent = null;
        }
      }
      /**
       * @en Removes all children from the container.
       * @zh 移除节点所有的子节点。
       */

    }, {
      key: "removeAllChildren",
      value: function removeAllChildren() {
        // not using detachChild improves speed here
        var children = this._children;

        for (var i = children.length - 1; i >= 0; i--) {
          var node = children[i];

          if (node) {
            node.parent = null;
          }
        }

        this._children.length = 0;
      }
      /**
       * @en Is this node a child of the given node?
       * @zh 是否是指定节点的子节点？
       * @return True if this node is a child, deep child or identical to the given node.
       */

    }, {
      key: "isChildOf",
      value: function isChildOf(parent) {
        var child = this;

        do {
          if (child === parent) {
            return true;
          }

          child = child._parent;
        } while (child);

        return false;
      } // COMPONENT

      /**
       * @en
       * Returns the component of supplied type if the node has one attached, null if it doesn't. 
       * You can also get component in the node by passing in the name of the script.
       * @zh
       * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。
       * 传入参数也可以是脚本的名称。
       * @param classConstructor The class of the target component
       * @example
       * ```
       * // get sprite component.
       * var sprite = node.getComponent(Sprite);
       * ```
       */

    }, {
      key: "getComponent",
      value: function getComponent(typeOrClassName) {
        var constructor = getConstructor(typeOrClassName);

        if (constructor) {
          return BaseNode._findComponent(this, constructor);
        }

        return null;
      }
      /**
       * @en Returns all components of given type in the node.
       * @zh 返回节点上指定类型的所有组件。
       * @param classConstructor The class of the target component
       */

    }, {
      key: "getComponents",
      value: function getComponents(typeOrClassName) {
        var constructor = getConstructor(typeOrClassName);
        var components = [];

        if (constructor) {
          BaseNode._findComponents(this, constructor, components);
        }

        return components;
      }
      /**
       * @en Returns the component of given type in any of its children using depth first search.
       * @zh 递归查找所有子节点中第一个匹配指定类型的组件。
       * @param classConstructor The class of the target component
       * @example
       * ```
       * var sprite = node.getComponentInChildren(Sprite);
       * ```
       */

    }, {
      key: "getComponentInChildren",
      value: function getComponentInChildren(typeOrClassName) {
        var constructor = getConstructor(typeOrClassName);

        if (constructor) {
          return BaseNode._findChildComponent(this._children, constructor);
        }

        return null;
      }
      /**
       * @en Returns all components of given type in self or any of its children.
       * @zh 递归查找自身或所有子节点中指定类型的组件
       * @param classConstructor The class of the target component
       * @example
       * ```
       * var sprites = node.getComponentsInChildren(Sprite);
       * ```
       */

    }, {
      key: "getComponentsInChildren",
      value: function getComponentsInChildren(typeOrClassName) {
        var constructor = getConstructor(typeOrClassName);
        var components = [];

        if (constructor) {
          BaseNode._findComponents(this, constructor, components);

          BaseNode._findChildComponents(this._children, constructor, components);
        }

        return components;
      }
      /**
       * @en Adds a component class to the node. You can also add component to node by passing in the name of the script.
       * @zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
       * @param classConstructor The class of the component to add
       * @throws `TypeError` if the `classConstructor` does not specify a cc-class constructor extending the `Component`.
       * @example
       * ```
       * var sprite = node.addComponent(Sprite);
       * ```
       */

    }, {
      key: "addComponent",
      value: function addComponent(typeOrClassName) {
        if (_defaultConstants.EDITOR && this._objFlags & Destroying) {
          throw Error("isDestroying");
        } // get component


        var constructor;

        if (typeof typeOrClassName === 'string') {
          constructor = js.getClassByName(typeOrClassName);

          if (!constructor) {
            if (_globalExports.legacyCC._RF.peek()) {
              (0, _debug.errorID)(3808, typeOrClassName);
            }

            throw TypeError((0, _debug.getError)(3807, typeOrClassName));
          }
        } else {
          if (!typeOrClassName) {
            throw TypeError((0, _debug.getError)(3804));
          }

          constructor = typeOrClassName;
        } // check component


        if (typeof constructor !== 'function') {
          throw TypeError((0, _debug.getError)(3809));
        }

        if (!js.isChildClassOf(constructor, _globalExports.legacyCC.Component)) {
          throw TypeError((0, _debug.getError)(3810));
        }

        if (_defaultConstants.EDITOR && constructor._disallowMultiple) {
          this._checkMultipleComp(constructor);
        } // check requirement


        var ReqComp = constructor._requireComponent;

        if (ReqComp && !this.getComponent(ReqComp)) {
          this.addComponent(ReqComp);
        } //// check conflict
        //
        // if (EDITOR && !_Scene.DetectConflict.beforeAddComponent(this, constructor)) {
        //    return null;
        // }
        //


        var component = new constructor();
        component.node = this;

        this._components.push(component);

        if (_defaultConstants.EDITOR && EditorExtends.Node && EditorExtends.Component) {
          var node = EditorExtends.Node.getNode(this._id);

          if (node) {
            EditorExtends.Component.add(component._id, component);
          }
        }

        if (this._activeInHierarchy) {
          _globalExports.legacyCC.director._nodeActivator.activateComp(component);
        }

        return component;
      }
      /**
       * @en
       * Removes a component identified by the given name or removes the component object given.
       * You can also use component.destroy() if you already have the reference.
       * @zh
       * 删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
       * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
       * @param classConstructor The class of the component to remove
       * @deprecated please destroy the component to remove it.
       * @example
       * ```
       * node.removeComponent(Sprite);
       * ```
       */

    }, {
      key: "removeComponent",
      value: function removeComponent(component) {
        if (!component) {
          (0, _debug.errorID)(3813);
          return;
        }

        var componentInstance = null;

        if (component instanceof _component.Component) {
          componentInstance = component;
        } else {
          componentInstance = this.getComponent(component);
        }

        if (componentInstance) {
          componentInstance.destroy();
        }
      } // EVENT PROCESSING

      /**
       * @en
       * Register a callback of a specific event type on Node.
       * Use this method to register touch or mouse event permit propagation based on scene graph,
       * These kinds of event are triggered with dispatchEvent, the dispatch process has three steps:
       * 1. Capturing phase: dispatch in capture targets (`_getCapturingTargets`), e.g. parents in node tree, from root to the real target
       * 2. At target phase: dispatch to the listeners of the real target
       * 3. Bubbling phase: dispatch in bubble targets (`_getBubblingTargets`), e.g. parents in node tree, from the real target to root
       * In any moment of the dispatching process, it can be stopped via `event.stopPropagation()` or `event.stopPropagationImmidiate()`.
       * It's the recommended way to register touch/mouse event for Node,
       * please do not use `eventManager` directly for Node.
       * You can also register custom event and use `emit` to trigger custom event on Node.
       * For such events, there won't be capturing and bubbling phase, your event will be dispatched directly to its listeners registered on the same node.
       * You can also pass event callback parameters with `emit` by passing parameters after `type`.
       * @zh
       * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。
       * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：
       * 1. 捕获阶段：派发事件给捕获目标（通过 `_getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。
       * 2. 目标阶段：派发给目标节点的监听器。
       * 3. 冒泡阶段：派发事件给冒泡目标（通过 `_getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发直到根节点。
       * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。
       * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 `eventManager`。
       * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器
       * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表
       * @param type - A string representing the event type to listen for.<br>See {{#crossLink "Node/EventTyupe/POSITION_CHANGED"}}Node Events{{/crossLink}} for all builtin events.
       * @param callback - The callback that will be invoked when the event is dispatched. The callback is ignored if it is a duplicate (the callbacks are unique).
       * @param target - The target (this object) to invoke the callback, can be null
       * @param useCapture - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
       * @return - Just returns the incoming callback so you can save the anonymous function easier.
       * @example
       * ```ts
       * this.node.on(SystemEventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
       * node.on(SystemEventType.TOUCH_START, callback, this);
       * node.on(SystemEventType.TOUCH_MOVE, callback, this);
       * node.on(SystemEventType.TOUCH_END, callback, this);
       * ```
       */

    }, {
      key: "on",
      value: function on(type, callback, target) {
        var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        switch (type) {
          case _eventEnum.SystemEventType.TRANSFORM_CHANGED:
            this._eventMask |= TRANSFORM_ON;
            break;
        }

        this._eventProcessor.on(type, callback, target, useCapture);
      }
      /**
       * @en
       * Removes the callback previously registered with the same type, callback, target and or useCapture.
       * This method is merely an alias to removeEventListener.
       * @zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
       * @param type - A string representing the event type being removed.
       * @param callback - The callback to remove.
       * @param target - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
       * @param useCapture - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
       * @example
       * ```ts
       * this.node.off(SystemEventType.TOUCH_START, this.memberFunction, this);
       * node.off(SystemEventType.TOUCH_START, callback, this.node);
       * ```
       */

    }, {
      key: "off",
      value: function off(type, callback, target) {
        var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        this._eventProcessor.off(type, callback, target, useCapture);

        var hasListeners = this._eventProcessor.hasEventListener(type); // All listener removed


        if (!hasListeners) {
          switch (type) {
            case _eventEnum.SystemEventType.TRANSFORM_CHANGED:
              this._eventMask &= ~TRANSFORM_ON;
              break;
          }
        }
      }
      /**
       * @en
       * Register an callback of a specific event type on the Node,
       * the callback will remove itself after the first time it is triggered.
       * @zh
       * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
       *
       * @param type - A string representing the event type to listen for.
       * @param callback - The callback that will be invoked when the event is dispatched.
       *                              The callback is ignored if it is a duplicate (the callbacks are unique).
       * @param target - The target (this object) to invoke the callback, can be null
       */

    }, {
      key: "once",
      value: function once(type, callback, target, useCapture) {
        this._eventProcessor.once(type, callback, target, useCapture);
      }
      /**
       * @en
       * Trigger an event directly with the event name and necessary arguments.
       * @zh
       * 通过事件名发送自定义事件
       * @param type - event type
       * @param arg1 - First argument in callback
       * @param arg2 - Second argument in callback
       * @param arg3 - Third argument in callback
       * @param arg4 - Fourth argument in callback
       * @param arg5 - Fifth argument in callback
       * @example
       * ```ts
       * eventTarget.emit('fire', event);
       * eventTarget.emit('fire', message, emitter);
       * ```
       */

    }, {
      key: "emit",
      value: function emit(type, arg0, arg1, arg2, arg3, arg4) {
        this._eventProcessor.emit(type, arg0, arg1, arg2, arg3, arg4);
      }
      /**
       * @en
       * Dispatches an event into the event flow.
       * The event target is the EventTarget object upon which the dispatchEvent() method is called.
       * @zh 分发事件到事件流中。
       * @param event - The Event object that is dispatched into the event flow
       */

    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        this._eventProcessor.dispatchEvent(event);
      }
      /**
       * @en Checks whether the EventTarget object has any callback registered for a specific type of event.
       * @zh 检查事件目标对象是否有为特定类型的事件注册的回调。
       * @param type - The type of event.
       * @param callback - The callback function of the event listener, if absent all event listeners for the given type will be removed
       * @param target - The callback callee of the event listener
       * @return True if a callback of the specified type is registered; false otherwise.
       */

    }, {
      key: "hasEventListener",
      value: function hasEventListener(type, callback, target) {
        return this._eventProcessor.hasEventListener(type, callback, target);
      }
      /**
       * @en Removes all callbacks previously registered with the same target.
       * @zh 移除目标上的所有注册事件。
       * @param target - The target to be searched for all related callbacks
       */

    }, {
      key: "targetOff",
      value: function targetOff(target) {
        this._eventProcessor.targetOff(target); // Check for event mask reset


        if (this._eventMask & TRANSFORM_ON && !this._eventProcessor.hasEventListener(_eventEnum.SystemEventType.TRANSFORM_CHANGED)) {
          this._eventMask &= ~TRANSFORM_ON;
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (_get(_getPrototypeOf(BaseNode.prototype), "destroy", this).call(this)) {
          // disable hierarchy
          if (this._activeInHierarchy) {
            this._disableChildComps();
          }

          return true;
        }

        return false;
      }
      /**
       * @en
       * Destroy all children from the node, and release all their own references to other objects.
       * Actual destruct operation will delayed until before rendering.
       * @zh
       * 销毁所有子节点，并释放所有它们对其它对象的引用。
       * 实际销毁操作会延迟到当前帧渲染前执行。
       */

    }, {
      key: "destroyAllChildren",
      value: function destroyAllChildren() {
        var children = this._children;

        for (var i = 0; i < children.length; ++i) {
          children[i].destroy();
        }
      } // Do remove component, only used internally.

    }, {
      key: "_removeComponent",
      value: function _removeComponent(component) {
        if (!component) {
          (0, _debug.errorID)(3814);
          return;
        }

        if (!(this._objFlags & Destroying)) {
          var i = this._components.indexOf(component);

          if (i !== -1) {
            this._components.splice(i, 1);

            if (_defaultConstants.EDITOR && EditorExtends.Component) {
              EditorExtends.Component.remove(component._id);
            }
          } // @ts-ignore
          else if (component.node !== this) {
              (0, _debug.errorID)(3815);
            }
        }
      }
    }, {
      key: "_updateSiblingIndex",
      value: function _updateSiblingIndex() {
        for (var i = 0; i < this._children.length; ++i) {
          this._children[i]._siblingIndex = i;
        }
      }
    }, {
      key: "_onSetParent",
      value: function _onSetParent(oldParent) {
        var keepWorldTransform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (this._parent) {
          if ((oldParent == null || oldParent._scene !== this._parent._scene) && this._parent._scene != null) {
            this.walk(function (node) {
              BaseNode._setScene(node);
            });
          }
        }
      } // PRIVATE

    }, {
      key: "_onPostActivated",
      value: function _onPostActivated(active) {
        return;
      }
    }, {
      key: "_onBatchRestored",
      value: function _onBatchRestored() {
        return;
      }
    }, {
      key: "_onBatchCreated",
      value: function _onBatchCreated() {
        if (this._parent) {
          this._siblingIndex = this._parent.children.indexOf(this);
        }

        return;
      }
    }, {
      key: "_onPreDestroy",
      value: function _onPreDestroy() {
        this._onPreDestroyBase();
      }
    }, {
      key: "_onHierarchyChanged",
      value: function _onHierarchyChanged(oldParent) {
        return this._onHierarchyChangedBase(oldParent);
      }
    }, {
      key: "_instantiate",
      value: function _instantiate(cloned) {
        if (!cloned) {
          cloned = _globalExports.legacyCC.instantiate._clone(this, this);
        }

        var thisPrefabInfo = this._prefab;

        if (_defaultConstants.EDITOR && thisPrefabInfo) {
          if (this !== thisPrefabInfo.root) {}
        }

        var syncing = thisPrefabInfo && this === thisPrefabInfo.root && thisPrefabInfo.sync;

        if (syncing) {// if (thisPrefabInfo._synced) {
          //    return clone;
          // }
        } else if (_defaultConstants.EDITOR && _globalExports.legacyCC.GAME_VIEW) {
          cloned._name += ' (Clone)';
        } // reset and init


        cloned._parent = null;

        cloned._onBatchRestored();

        return cloned;
      }
    }, {
      key: "_onHierarchyChangedBase",
      value: function _onHierarchyChangedBase(oldParent) {
        var newParent = this._parent;

        if (this._persistNode && !(newParent instanceof _globalExports.legacyCC.Scene)) {
          _globalExports.legacyCC.game.removePersistRootNode(this);

          if (_defaultConstants.EDITOR) {
            (0, _debug.warnID)(1623);
          }
        }

        if (_defaultConstants.EDITOR) {
          var scene = _globalExports.legacyCC.director.getScene();

          var inCurrentSceneBefore = oldParent && oldParent.isChildOf(scene);
          var inCurrentSceneNow = newParent && newParent.isChildOf(scene);

          if (!inCurrentSceneBefore && inCurrentSceneNow) {
            // attached
            this._registerIfAttached(true);
          } else if (inCurrentSceneBefore && !inCurrentSceneNow) {
            // detached
            this._registerIfAttached(false);
          } // conflict detection
          // _Scene.DetectConflict.afterAddChild(this);

        }

        var shouldActiveNow = this._active && !!(newParent && newParent._activeInHierarchy);

        if (this._activeInHierarchy !== shouldActiveNow) {
          _globalExports.legacyCC.director._nodeActivator.activateNode(this, shouldActiveNow);
        }
      }
    }, {
      key: "_onPreDestroyBase",
      value: function _onPreDestroyBase() {
        // marked as destroying
        this._objFlags |= Destroying; // detach self and children from editor

        var parent = this._parent;
        var destroyByParent = !!parent && (parent._objFlags & Destroying) !== 0;

        if (!destroyByParent && _defaultConstants.EDITOR) {
          this._registerIfAttached(false);
        } // remove from persist


        if (this._persistNode) {
          _globalExports.legacyCC.game.removePersistRootNode(this);
        }

        if (!destroyByParent) {
          // remove from parent
          if (parent) {
            this.emit(_eventEnum.SystemEventType.PARENT_CHANGED, this); // During destroy process, siblingIndex is not relyable

            var childIndex = parent._children.indexOf(this);

            parent._children.splice(childIndex, 1);

            this._siblingIndex = 0;

            if (parent.emit) {
              parent.emit(_eventEnum.SystemEventType.CHILD_REMOVED, this);
            }
          }
        } // emit node destroy event (this should before event processor destroy)


        this.emit(_eventEnum.SystemEventType.NODE_DESTROYED, this); // Destroy node event processor

        this._eventProcessor.destroy(); // destroy children


        var children = this._children;

        for (var i = 0; i < children.length; ++i) {
          // destroy immediate so its _onPreDestroy can be called
          children[i]._destroyImmediate();
        } // destroy self components


        var comps = this._components;

        for (var _i5 = 0; _i5 < comps.length; ++_i5) {
          // destroy immediate so its _onPreDestroy can be called
          // TO DO
          comps[_i5]._destroyImmediate();
        }

        return destroyByParent;
      }
    }, {
      key: "_disableChildComps",
      value: function _disableChildComps() {
        // leave this._activeInHierarchy unmodified
        var comps = this._components;

        for (var i = 0; i < comps.length; ++i) {
          var component = comps[i];

          if (component._enabled) {
            _globalExports.legacyCC.director._compScheduler.disableComp(component);
          }
        } // deactivate recursively


        var children = this._children;

        for (var _i6 = 0; _i6 < children.length; ++_i6) {
          var node = children[_i6];

          if (node._active) {
            node._disableChildComps();
          }
        }
      }
    }]);

    return BaseNode;
  }(_object.CCObject), _class3.idGenerator = idGenerator, _class3._stacks = [[]], _class3._stackId = 0, _temp), (_applyDecoratedDescriptor(_class2.prototype, "_persistNode", [_property.property], Object.getOwnPropertyDescriptor(_class2.prototype, "_persistNode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "name", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "name"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "children", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "children"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "active", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "active"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "activeInHierarchy", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "activeInHierarchy"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "parent", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "parent"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_parent", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_children", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_active", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_components", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_prefab", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
  _exports.BaseNode = BaseNode;
  (0, _baseNodeDev.baseNodePolyfill)(BaseNode);
  /**
   * @en
   * Note: This event is only emitted from the top most node whose active value did changed,
   * not including its child nodes.
   * @zh
   * 注意：此节点激活时，此事件仅从最顶部的节点发出。
   * @event active-in-hierarchy-changed
   * @param {Event.EventCustom} event
   */

  _globalExports.legacyCC._BaseNode = BaseNode;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvYmFzZS1ub2RlLnRzIl0sIm5hbWVzIjpbIkRlc3Ryb3lpbmciLCJDQ09iamVjdCIsIkZsYWdzIiwiRG9udERlc3Ryb3kiLCJEZWFjdGl2YXRpbmciLCJBY3RpdmF0aW5nIiwiQ2hhbmdpbmdTdGF0ZSIsIlRSQU5TRk9STV9PTiIsImlkR2VuZXJhdG9yIiwiSWRHZW5lcmF0b3IiLCJOdWxsU2NlbmUiLCJnZXRDb25zdHJ1Y3RvciIsInR5cGVPckNsYXNzTmFtZSIsImpzIiwiZ2V0Q2xhc3NCeU5hbWUiLCJCYXNlTm9kZSIsIl9jb21wb25lbnRzIiwiX29iakZsYWdzIiwidmFsdWUiLCJfbmFtZSIsIkRFViIsImluZGV4T2YiLCJfaWQiLCJfY2hpbGRyZW4iLCJfYWN0aXZlIiwiaXNBY3RpdmUiLCJwYXJlbnQiLCJfcGFyZW50IiwiY291bGRBY3RpdmVJblNjZW5lIiwiX2FjdGl2ZUluSGllcmFyY2h5IiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsIl9ub2RlQWN0aXZhdG9yIiwiYWN0aXZhdGVOb2RlIiwic2V0UGFyZW50IiwiX3NjZW5lIiwiX2V2ZW50UHJvY2Vzc29yIiwibm9kZSIsIlNjZW5lIiwibmFtZSIsInV1aWQiLCJjb25zdHJ1Y3RvciIsImNscyIsImNvbXBzIiwiX3NlYWxlZCIsImkiLCJsZW5ndGgiLCJjb21wIiwiY29tcG9uZW50cyIsInB1c2giLCJjaGlsZHJlbiIsIl9maW5kQ29tcG9uZW50IiwiX2ZpbmRDaGlsZENvbXBvbmVudCIsIl9maW5kQ29tcG9uZW50cyIsIl9maW5kQ2hpbGRDb21wb25lbnRzIiwiZ2V0TmV3SWQiLCJOb2RlRXZlbnRQcm9jZXNzb3IiLCJfZXZlbnRNYXNrIiwiX3NpYmxpbmdJbmRleCIsIl9yZWdpc3RlcklmQXR0YWNoZWQiLCJFRElUT1IiLCJ1bmRlZmluZWQiLCJyZWdpc3RlciIsIkVkaXRvckV4dGVuZHMiLCJOb2RlIiwiQ29tcG9uZW50IiwiYWRkIiwicmVtb3ZlIiwibGVuIiwiY2hpbGQiLCJhdHRycyIsIm1peGluIiwia2VlcFdvcmxkVHJhbnNmb3JtIiwib2xkUGFyZW50IiwibmV3UGFyZW50IiwiREVCVUciLCJfb25TZXRQYXJlbnQiLCJlbWl0IiwiU3lzdGVtRXZlbnRUeXBlIiwiUEFSRU5UX0NIQU5HRUQiLCJyZW1vdmVBdCIsInNwbGljZSIsIl91cGRhdGVTaWJsaW5nSW5kZXgiLCJDSElMRF9SRU1PVkVEIiwiQ0hJTERfQURERUQiLCJfb25IaWVyYXJjaHlDaGFuZ2VkIiwibG9jQ2hpbGRyZW4iLCJwYXRoIiwic2VnbWVudHMiLCJzcGxpdCIsImxhc3ROb2RlIiwic2VnbWVudCIsIm5leHQiLCJmaW5kIiwiY2hpbGROb2RlIiwiX0Jhc2VOb2RlIiwiZ2V0Q2xhc3NOYW1lIiwic2libGluZ0luZGV4Iiwic2V0U2libGluZ0luZGV4IiwiaW5kZXgiLCJzaWJsaW5ncyIsIm9sZEluZGV4IiwiX29uU2libGluZ0luZGV4Q2hhbmdlZCIsInByZUZ1bmMiLCJwb3N0RnVuYyIsImN1cnIiLCJzdGFjayIsIl9zdGFja3MiLCJfc3RhY2tJZCIsImFmdGVyQ2hpbGRyZW4iLCJyZW1vdmVDaGlsZCIsIkVycm9yIiwiX1JGIiwicGVlayIsIlR5cGVFcnJvciIsImlzQ2hpbGRDbGFzc09mIiwiX2Rpc2FsbG93TXVsdGlwbGUiLCJfY2hlY2tNdWx0aXBsZUNvbXAiLCJSZXFDb21wIiwiX3JlcXVpcmVDb21wb25lbnQiLCJnZXRDb21wb25lbnQiLCJhZGRDb21wb25lbnQiLCJjb21wb25lbnQiLCJnZXROb2RlIiwiYWN0aXZhdGVDb21wIiwiY29tcG9uZW50SW5zdGFuY2UiLCJkZXN0cm95IiwidHlwZSIsImNhbGxiYWNrIiwidGFyZ2V0IiwidXNlQ2FwdHVyZSIsIlRSQU5TRk9STV9DSEFOR0VEIiwib24iLCJvZmYiLCJoYXNMaXN0ZW5lcnMiLCJoYXNFdmVudExpc3RlbmVyIiwib25jZSIsImFyZzAiLCJhcmcxIiwiYXJnMiIsImFyZzMiLCJhcmc0IiwiZXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwidGFyZ2V0T2ZmIiwiX2Rpc2FibGVDaGlsZENvbXBzIiwid2FsayIsIl9zZXRTY2VuZSIsImFjdGl2ZSIsIl9vblByZURlc3Ryb3lCYXNlIiwiX29uSGllcmFyY2h5Q2hhbmdlZEJhc2UiLCJjbG9uZWQiLCJpbnN0YW50aWF0ZSIsIl9jbG9uZSIsInRoaXNQcmVmYWJJbmZvIiwiX3ByZWZhYiIsInJvb3QiLCJzeW5jaW5nIiwic3luYyIsIkdBTUVfVklFVyIsIl9vbkJhdGNoUmVzdG9yZWQiLCJfcGVyc2lzdE5vZGUiLCJnYW1lIiwicmVtb3ZlUGVyc2lzdFJvb3ROb2RlIiwic2NlbmUiLCJnZXRTY2VuZSIsImluQ3VycmVudFNjZW5lQmVmb3JlIiwiaXNDaGlsZE9mIiwiaW5DdXJyZW50U2NlbmVOb3ciLCJzaG91bGRBY3RpdmVOb3ciLCJkZXN0cm95QnlQYXJlbnQiLCJjaGlsZEluZGV4IiwiTk9ERV9ERVNUUk9ZRUQiLCJfZGVzdHJveUltbWVkaWF0ZSIsIl9lbmFibGVkIiwiX2NvbXBTY2hlZHVsZXIiLCJkaXNhYmxlQ29tcCIsInByb3BlcnR5IiwiZWRpdGFibGUiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnREE7QUFDQSxNQUFNQSxVQUFVLEdBQUdDLGlCQUFTQyxLQUFULENBQWVGLFVBQWxDLEMsQ0FDQTs7QUFDQSxNQUFNRyxXQUFXLEdBQUdGLGlCQUFTQyxLQUFULENBQWVDLFdBQW5DLEMsQ0FDQTs7QUFDQSxNQUFNQyxZQUFZLEdBQUdILGlCQUFTQyxLQUFULENBQWVFLFlBQXBDLEMsQ0FDQTs7QUFDQSxNQUFNQyxVQUFVLEdBQUdKLGlCQUFTQyxLQUFULENBQWVHLFVBQWxDO0FBQ0EsTUFBTUMsYUFBYSxHQUFHRCxVQUFVLEdBQUdELFlBQW5DO0FBRU8sTUFBTUcsWUFBWSxHQUFHLEtBQUssQ0FBMUIs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LEMseUVBckkzQnFFLGtCLGlKQWtCQUMsZSw2SUEwQkFBLGUsK0lBaUJBQSxlLHdKQXFCQUEsZSx3SkFTQUEsZSw0SkErR0FDLG1COzs7OzthQUNnQyxJOztnRkFFaENBLG1COzs7OzthQUM2QixFOzs4RUFFN0JBLG1COzs7OzthQUNtQixJOztrRkFFbkJBLG1COzs7OzthQUNvQyxFOzs4RUFHcENBLG1COzs7OzthQUN3QixJOzs7O0FBNmpDN0IscUNBQWlCcEssUUFBakI7QUFFQTs7Ozs7Ozs7OztBQVVBZSwwQkFBU2lFLFNBQVQsR0FBcUJoRixRQUFyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgc2NlbmUtZ3JhcGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IHByb3BlcnR5IH0gZnJvbSAnLi4vZGF0YS9kZWNvcmF0b3JzL3Byb3BlcnR5JztcclxuaW1wb3J0IHsgY2NjbGFzcywgZWRpdGFibGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENDT2JqZWN0IH0gZnJvbSAnLi4vZGF0YS9vYmplY3QnO1xyXG5pbXBvcnQgeyBFdmVudCB9IGZyb20gJy4uL2V2ZW50JztcclxuaW1wb3J0IHsgZXJyb3JJRCwgd2FybklELCBlcnJvciwgbG9nLCBhc3NlcnRJRCwgZ2V0RXJyb3IgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IFN5c3RlbUV2ZW50VHlwZSB9IGZyb20gJy4uL3BsYXRmb3JtL2V2ZW50LW1hbmFnZXIvZXZlbnQtZW51bSc7XHJcbmltcG9ydCB7IElTY2hlZHVsYWJsZSB9IGZyb20gJy4uL3NjaGVkdWxlcic7XHJcbmltcG9ydCBJZEdlbmVyYXRvciBmcm9tICcuLi91dGlscy9pZC1nZW5lcmF0b3InO1xyXG5pbXBvcnQgKiBhcyBqcyBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IGJhc2VOb2RlUG9seWZpbGwgfSBmcm9tICcuL2Jhc2Utbm9kZS1kZXYnO1xyXG5pbXBvcnQgeyBOb2RlRXZlbnRQcm9jZXNzb3IgfSBmcm9tICcuL25vZGUtZXZlbnQtcHJvY2Vzc29yJztcclxuaW1wb3J0IHsgREVWLCBERUJVRywgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgeyBTY2VuZSB9IGZyb20gJy4vc2NlbmUnO1xyXG5cclxudHlwZSBDb25zdHJ1Y3RvcjxUID0ge30+ID0gbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVDtcclxuXHJcbi8vIEB0cy1pZ25vcmVcclxuY29uc3QgRGVzdHJveWluZyA9IENDT2JqZWN0LkZsYWdzLkRlc3Ryb3lpbmc7XHJcbi8vIEB0cy1pZ25vcmVcclxuY29uc3QgRG9udERlc3Ryb3kgPSBDQ09iamVjdC5GbGFncy5Eb250RGVzdHJveTtcclxuLy8gQHRzLWlnbm9yZVxyXG5jb25zdCBEZWFjdGl2YXRpbmcgPSBDQ09iamVjdC5GbGFncy5EZWFjdGl2YXRpbmc7XHJcbi8vIEB0cy1pZ25vcmVcclxuY29uc3QgQWN0aXZhdGluZyA9IENDT2JqZWN0LkZsYWdzLkFjdGl2YXRpbmc7XHJcbmNvbnN0IENoYW5naW5nU3RhdGUgPSBBY3RpdmF0aW5nIHwgRGVhY3RpdmF0aW5nO1xyXG5cclxuZXhwb3J0IGNvbnN0IFRSQU5TRk9STV9PTiA9IDEgPDwgMDtcclxuXHJcbi8vIGNvbnN0IENISUxEX0FEREVEID0gJ2NoaWxkLWFkZGVkJztcclxuLy8gY29uc3QgQ0hJTERfUkVNT1ZFRCA9ICdjaGlsZC1yZW1vdmVkJztcclxuXHJcbmNvbnN0IGlkR2VuZXJhdG9yID0gbmV3IElkR2VuZXJhdG9yKCdOb2RlJyk7XHJcblxyXG5jb25zdCBOdWxsU2NlbmUgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gZ2V0Q29uc3RydWN0b3IgKHR5cGVPckNsYXNzTmFtZTogc3RyaW5nIHwgRnVuY3Rpb24pOiBGdW5jdGlvbiB8IG51bGwge1xyXG4gICAgaWYgKCF0eXBlT3JDbGFzc05hbWUpIHtcclxuICAgICAgICBlcnJvcklEKDM4MDQpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB0eXBlT3JDbGFzc05hbWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIGpzLmdldENsYXNzQnlOYW1lKHR5cGVPckNsYXNzTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHR5cGVPckNsYXNzTmFtZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgYmFzZSBjbGFzcyBmb3IgW1tOb2RlXV0sIGl0OlxyXG4gKiAtIG1haW50YWlucyBzY2VuZSBoaWVyYXJjaHkgYW5kIGxpZmUgY3ljbGUgbG9naWNcclxuICogLSBwcm92aWRlcyBFdmVudFRhcmdldCBhYmlsaXR5XHJcbiAqIC0gZW1pdHMgZXZlbnRzIGlmIHNvbWUgcHJvcGVydGllcyBjaGFuZ2VkLCByZWY6IFtbU3lzdGVtRXZlbnRUeXBlXV1cclxuICogLSBtYW5hZ2VzIGNvbXBvbmVudHNcclxuICogQHpoIFtbTm9kZV1dIOeahOWfuuexu++8jOS7luS8mui0n+i0o++8mlxyXG4gKiAtIOe7tOaKpOWcuuaZr+agkeS7peWPiuiKgueCueeUn+WRveWRqOacn+euoeeQhlxyXG4gKiAtIOaPkOS+myBFdmVudFRhcmdldCDnmoTkuovku7bnrqHnkIblkozms6jlhozog73liptcclxuICogLSDmtL7lj5HoioLngrnnirbmgIHnm7jlhbPnmoTkuovku7bvvIzlj4LogIPvvJpbW1N5c3RlbUV2ZW50VHlwZV1dXHJcbiAqIC0g566h55CG57uE5Lu2XHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQmFzZU5vZGUnKVxyXG5leHBvcnQgY2xhc3MgQmFzZU5vZGUgZXh0ZW5kcyBDQ09iamVjdCBpbXBsZW1lbnRzIElTY2hlZHVsYWJsZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXRzIGFsbCBjb21wb25lbnRzIGF0dGFjaGVkIHRvIHRoaXMgbm9kZS5cclxuICAgICAqIEB6aCDojrflj5bpmYTliqDliLDmraToioLngrnnmoTmiYDmnInnu4Tku7bjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbXBvbmVudHMgKCk6IFJlYWRvbmx5QXJyYXk8Q29tcG9uZW50PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSWYgdHJ1ZSwgdGhlIG5vZGUgaXMgYW4gcGVyc2lzdCBub2RlIHdoaWNoIHdvbid0IGJlIGRlc3Ryb3llZCBkdXJpbmcgc2NlbmUgdHJhbnNpdGlvbi5cclxuICAgICAqIElmIGZhbHNlLCB0aGUgbm9kZSB3aWxsIGJlIGRlc3Ryb3llZCBhdXRvbWF0aWNhbGx5IHdoZW4gbG9hZGluZyBhIG5ldyBzY2VuZS4gRGVmYXVsdCBpcyBmYWxzZS5cclxuICAgICAqIEB6aCDlpoLmnpzkuLp0cnVl77yM5YiZ6K+l6IqC54K55piv5LiA5Liq5bi46am76IqC54K577yM5LiN5Lya5Zyo5Zy65pmv6L2s5o2i5pyf6Ze06KKr6ZSA5q+B44CCXHJcbiAgICAgKiDlpoLmnpzkuLpmYWxzZe+8jOiKgueCueWwhuWcqOWKoOi9veaWsOWcuuaZr+aXtuiHquWKqOmUgOavgeOAgum7mOiupOS4uiBmYWxzZeOAglxyXG4gICAgICogQGRlZmF1bHQgZmFsc2VcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgQHByb3BlcnR5XHJcbiAgICBnZXQgX3BlcnNpc3ROb2RlICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX29iakZsYWdzICYgRG9udERlc3Ryb3kpID4gMDtcclxuICAgIH1cclxuICAgIHNldCBfcGVyc2lzdE5vZGUgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29iakZsYWdzIHw9IERvbnREZXN0cm95O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29iakZsYWdzICY9IH5Eb250RGVzdHJveTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQVBJXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTmFtZSBvZiBub2RlLlxyXG4gICAgICogQHpoIOivpeiKgueCueWQjeensOOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBuYW1lICgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG4gICAgc2V0IG5hbWUgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKERFViAmJiB2YWx1ZS5pbmRleE9mKCcvJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMTYzMik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB1dWlkIGZvciBlZGl0b3IsIHdpbGwgYmUgc3RyaXBwZWQgYWZ0ZXIgYnVpbGRpbmcgcHJvamVjdC5cclxuICAgICAqIEB6aCDkuLvopoHnlKjkuo7nvJbovpHlmajnmoQgdXVpZO+8jOWcqOe8lui+keWZqOS4i+WPr+eUqOS6juaMgeS5heWMluWtmOWCqO+8jOWcqOmhueebruaehOW7uuS5i+WQjuWwhuWPmOaIkOiHquWinueahCBpZOOAglxyXG4gICAgICogQHJlYWRPbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCB1dWlkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWxsIGNoaWxkcmVuIG5vZGVzLlxyXG4gICAgICogQHpoIOiKgueCueeahOaJgOacieWtkOiKgueCueOAglxyXG4gICAgICogQHJlYWRPbmx5XHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGNoaWxkcmVuICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBsb2NhbCBhY3RpdmUgc3RhdGUgb2YgdGhpcyBub2RlLlxyXG4gICAgICogTm90ZSB0aGF0IGEgTm9kZSBtYXkgYmUgaW5hY3RpdmUgYmVjYXVzZSBhIHBhcmVudCBpcyBub3QgYWN0aXZlLCBldmVuIGlmIHRoaXMgcmV0dXJucyB0cnVlLlxyXG4gICAgICogVXNlIFtbYWN0aXZlSW5IaWVyYXJjaHldXVxyXG4gICAgICogaWYgeW91IHdhbnQgdG8gY2hlY2sgaWYgdGhlIE5vZGUgaXMgYWN0dWFsbHkgdHJlYXRlZCBhcyBhY3RpdmUgaW4gdGhlIHNjZW5lLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPliY3oioLngrnnmoToh6rouqvmv4DmtLvnirbmgIHjgIJcclxuICAgICAqIOWAvOW+l+azqOaEj+eahOaYr++8jOS4gOS4quiKgueCueeahOeItuiKgueCueWmguaenOS4jeiiq+a/gOa0u++8jOmCo+S5iOWNs+S9v+Wug+iHqui6q+iuvuS4uua/gOa0u++8jOWug+S7jeeEtuaXoOazlea/gOa0u+OAglxyXG4gICAgICog5aaC5p6c5L2g5oOz5qOA5p+l6IqC54K55Zyo5Zy65pmv5Lit5a6e6ZmF55qE5r+A5rS754q25oCB5Y+v5Lul5L2/55SoIFtbYWN0aXZlSW5IaWVyYXJjaHldXVxyXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBhY3RpdmUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmU7XHJcbiAgICB9XHJcbiAgICBzZXQgYWN0aXZlIChpc0FjdGl2ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmUgIT09IGlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZSA9IGlzQWN0aXZlO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdWxkQWN0aXZlSW5TY2VuZSA9IHBhcmVudC5fYWN0aXZlSW5IaWVyYXJjaHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bGRBY3RpdmVJblNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuYWN0aXZhdGVOb2RlKHRoaXMsIGlzQWN0aXZlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbmRpY2F0ZXMgd2hldGhlciB0aGlzIG5vZGUgaXMgYWN0aXZlIGluIHRoZSBzY2VuZS5cclxuICAgICAqIEB6aCDooajnpLrmraToioLngrnmmK/lkKblnKjlnLrmma/kuK3mv4DmtLvjgIJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgYWN0aXZlSW5IaWVyYXJjaHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgcGFyZW50IG5vZGVcclxuICAgICAqIEB6aCDniLboioLngrlcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgcGFyZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG4gICAgc2V0IHBhcmVudCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldFBhcmVudCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gV2hpY2ggc2NlbmUgdGhpcyBub2RlIGJlbG9uZ3MgdG8uXHJcbiAgICAgKiBAemgg5q2k6IqC54K55bGe5LqO5ZOq5Liq5Zy65pmv44CCXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjZW5lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGV2ZW50IHByb2Nlc3NvciBvZiB0aGUgY3VycmVudCBub2RlLCBpdCBwcm92aWRlcyBFdmVudFRhcmdldCBhYmlsaXR5LlxyXG4gICAgICogQHpoIOW9k+WJjeiKgueCueeahOS6i+S7tuWkhOeQhuWZqO+8jOaPkOS+myBFdmVudFRhcmdldCDog73lipvjgIJcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgZXZlbnRQcm9jZXNzb3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudFByb2Nlc3NvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIF9zZXRTY2VuZSAobm9kZTogQmFzZU5vZGUpIHtcclxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIGxlZ2FjeUNDLlNjZW5lKSB7XHJcbiAgICAgICAgICAgIG5vZGUuX3NjZW5lID0gbm9kZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5fcGFyZW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yKCdOb2RlICVzKCVzKSBoYXMgbm90IGF0dGFjaGVkIHRvIGEgc2NlbmUuJywgbm9kZS5uYW1lLCBub2RlLnV1aWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5fc2NlbmUgPSBub2RlLl9wYXJlbnQuX3NjZW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgaWRHZW5lcmF0b3IgPSBpZEdlbmVyYXRvcjtcclxuXHJcbiAgICAvLyBGb3Igd2Fsa1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBfc3RhY2tzOiBBcnJheTxBcnJheTwoQmFzZU5vZGUgfCBudWxsKT4+ID0gW1tdXTtcclxuICAgIHByb3RlY3RlZCBzdGF0aWMgX3N0YWNrSWQgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgX2ZpbmRDb21wb25lbnQgKG5vZGU6IEJhc2VOb2RlLCBjb25zdHJ1Y3RvcjogRnVuY3Rpb24pIHtcclxuICAgICAgICBjb25zdCBjbHMgPSBjb25zdHJ1Y3RvciBhcyBhbnk7XHJcbiAgICAgICAgY29uc3QgY29tcHMgPSBub2RlLl9jb21wb25lbnRzO1xyXG4gICAgICAgIGlmIChjbHMuX3NlYWxlZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wID0gY29tcHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5jb25zdHJ1Y3RvciA9PT0gY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tcHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXAgPSBjb21wc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wIGluc3RhbmNlb2YgY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIF9maW5kQ29tcG9uZW50cyAobm9kZTogQmFzZU5vZGUsIGNvbnN0cnVjdG9yOiBGdW5jdGlvbiwgY29tcG9uZW50czogQ29tcG9uZW50W10pIHtcclxuICAgICAgICBjb25zdCBjbHMgPSBjb25zdHJ1Y3RvciBhcyBhbnk7XHJcbiAgICAgICAgY29uc3QgY29tcHMgPSBub2RlLl9jb21wb25lbnRzO1xyXG4gICAgICAgIGlmIChjbHMuX3NlYWxlZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wID0gY29tcHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5jb25zdHJ1Y3RvciA9PT0gY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLnB1c2goY29tcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wID0gY29tcHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcCBpbnN0YW5jZW9mIGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGNvbXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgX2ZpbmRDaGlsZENvbXBvbmVudCAoY2hpbGRyZW46IEJhc2VOb2RlW10sIGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGxldCBjb21wID0gQmFzZU5vZGUuX2ZpbmRDb21wb25lbnQobm9kZSwgY29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoY29tcCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5fY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29tcCA9IEJhc2VOb2RlLl9maW5kQ2hpbGRDb21wb25lbnQobm9kZS5fY2hpbGRyZW4sIGNvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBfZmluZENoaWxkQ29tcG9uZW50cyAoY2hpbGRyZW46IEJhc2VOb2RlW10sIGNvbnN0cnVjdG9yLCBjb21wb25lbnRzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIEJhc2VOb2RlLl9maW5kQ29tcG9uZW50cyhub2RlLCBjb25zdHJ1Y3RvciwgY29tcG9uZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLl9jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBCYXNlTm9kZS5fZmluZENoaWxkQ29tcG9uZW50cyhub2RlLl9jaGlsZHJlbiwgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcGFyZW50OiB0aGlzIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9jaGlsZHJlbjogdGhpc1tdID0gW107XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuXHJcbiAgICAvLyBUaGUgUHJlZmFiSW5mbyBvYmplY3RcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcHJlZmFiOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfc2NlbmU6IGFueSA9IE51bGxTY2VuZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2FjdGl2ZUluSGllcmFyY2h5ID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pZDogc3RyaW5nID0gaWRHZW5lcmF0b3IuZ2V0TmV3SWQoKTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2V2ZW50UHJvY2Vzc29yOiBOb2RlRXZlbnRQcm9jZXNzb3IgPSBuZXcgTm9kZUV2ZW50UHJvY2Vzc29yKHRoaXMpO1xyXG4gICAgcHJvdGVjdGVkIF9ldmVudE1hc2sgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBfc2libGluZ0luZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcmVnaXN0ZXJJZkF0dGFjaGVkID0gIUVESVRPUiA/IHVuZGVmaW5lZCA6IGZ1bmN0aW9uICh0aGlzOiBCYXNlTm9kZSwgcmVnaXN0ZXIpIHtcclxuICAgICAgICBpZiAoRWRpdG9yRXh0ZW5kcy5Ob2RlICYmIEVkaXRvckV4dGVuZHMuQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChyZWdpc3Rlcikge1xyXG4gICAgICAgICAgICAgICAgRWRpdG9yRXh0ZW5kcy5Ob2RlLmFkZCh0aGlzLl9pZCwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcCA9IHRoaXMuX2NvbXBvbmVudHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgRWRpdG9yRXh0ZW5kcy5Db21wb25lbnQuYWRkKGNvbXAuX2lkLCBjb21wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXAgPSB0aGlzLl9jb21wb25lbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIEVkaXRvckV4dGVuZHMuQ29tcG9uZW50LnJlbW92ZShjb21wLl9pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgRWRpdG9yRXh0ZW5kcy5Ob2RlLnJlbW92ZSh0aGlzLl9pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGNoaWxkLl9yZWdpc3RlcklmQXR0YWNoZWQhKHJlZ2lzdGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChuYW1lPzogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWUgIT09IHVuZGVmaW5lZCA/IG5hbWUgOiAnTmV3IE5vZGUnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQcm9wZXJ0aWVzIGNvbmZpZ3VyYXRpb24gZnVuY3Rpb24uXHJcbiAgICAgKiBBbGwgcHJvcGVydGllcyBpbiBhdHRycyB3aWxsIGJlIHNldCB0byB0aGUgbm9kZSwgXHJcbiAgICAgKiB3aGVuIHRoZSBzZXR0ZXIgb2YgdGhlIG5vZGUgaXMgYXZhaWxhYmxlLCBcclxuICAgICAqIHRoZSBwcm9wZXJ0eSB3aWxsIGJlIHNldCB2aWEgc2V0dGVyIGZ1bmN0aW9uLlxyXG4gICAgICogQHpoIOWxnuaAp+mFjee9ruWHveaVsOOAguWcqCBhdHRycyDnmoTmiYDmnInlsZ7mgKflsIbooqvorr7nva7kuLroioLngrnlsZ7mgKfjgIJcclxuICAgICAqIEBwYXJhbSBhdHRycyAtIFByb3BlcnRpZXMgdG8gYmUgc2V0IHRvIG5vZGVcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIHZhciBhdHRycyA9IHsgbmFtZTogJ05ldyBOYW1lJywgYWN0aXZlOiBmYWxzZSB9O1xyXG4gICAgICogbm9kZS5hdHRyKGF0dHJzKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXR0ciAoYXR0cnM6IE9iamVjdCkge1xyXG4gICAgICAgIGpzLm1peGluKHRoaXMsIGF0dHJzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBISUVSQVJDSFkgTUVUSE9EU1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBwYXJlbnQgb2YgdGhlIG5vZGUuXHJcbiAgICAgKiBAemgg6I635Y+W6K+l6IqC54K555qE54i26IqC54K544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRQYXJlbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHBhcmVudCBvZiB0aGUgbm9kZS5cclxuICAgICAqIEB6aCDorr7nva7or6XoioLngrnnmoTniLboioLngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFBhcmVudCAodmFsdWU6IHRoaXMgfCBTY2VuZSB8IG51bGwsIGtlZXBXb3JsZFRyYW5zZm9ybTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBvbGRQYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XHJcbiAgICAgICAgY29uc3QgbmV3UGFyZW50ID0gdmFsdWUgYXMgdGhpcztcclxuICAgICAgICBpZiAoREVCVUcgJiYgb2xkUGFyZW50ICYmXHJcbiAgICAgICAgICAgIC8vIENoYW5nZSBwYXJlbnQgd2hlbiBvbGQgcGFyZW50IGRlc2FjdGl2YXRpbmcgb3IgYWN0aXZhdGluZ1xyXG4gICAgICAgICAgICAob2xkUGFyZW50Ll9vYmpGbGFncyAmIENoYW5naW5nU3RhdGUpKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMzgyMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSBuZXdQYXJlbnQ7XHJcbiAgICAgICAgLy8gUmVzZXQgc2libGluZyBpbmRleFxyXG4gICAgICAgIHRoaXMuX3NpYmxpbmdJbmRleCA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuX29uU2V0UGFyZW50KG9sZFBhcmVudCwga2VlcFdvcmxkVHJhbnNmb3JtKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZW1pdCkge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlBBUkVOVF9DSEFOR0VELCBvbGRQYXJlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9sZFBhcmVudCkge1xyXG4gICAgICAgICAgICBpZiAoIShvbGRQYXJlbnQuX29iakZsYWdzICYgRGVzdHJveWluZykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUF0ID0gb2xkUGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKERFViAmJiByZW1vdmVBdCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3JJRCgxNjMzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9sZFBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKHJlbW92ZUF0LCAxKTtcclxuICAgICAgICAgICAgICAgIG9sZFBhcmVudC5fdXBkYXRlU2libGluZ0luZGV4KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkUGFyZW50LmVtaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvbGRQYXJlbnQuZW1pdChTeXN0ZW1FdmVudFR5cGUuQ0hJTERfUkVNT1ZFRCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuZXdQYXJlbnQpIHtcclxuICAgICAgICAgICAgaWYgKERFQlVHICYmIChuZXdQYXJlbnQuX29iakZsYWdzICYgRGVhY3RpdmF0aW5nKSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCgzODIxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdQYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NpYmxpbmdJbmRleCA9IG5ld1BhcmVudC5fY2hpbGRyZW4ubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgaWYgKG5ld1BhcmVudC5lbWl0KSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQYXJlbnQuZW1pdChTeXN0ZW1FdmVudFR5cGUuQ0hJTERfQURERUQsIHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9vbkhpZXJhcmNoeUNoYW5nZWQob2xkUGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIGEgY2hpbGQgd2l0aCB0aGUgc2FtZSB1dWlkLlxyXG4gICAgICogQHpoIOmAmui/hyB1dWlkIOiOt+WPluiKgueCueeahOWtkOiKgueCueOAglxyXG4gICAgICogQHBhcmFtIHV1aWQgLSBUaGUgdXVpZCB0byBmaW5kIHRoZSBjaGlsZCBub2RlLlxyXG4gICAgICogQHJldHVybiBhIE5vZGUgd2hvc2UgdXVpZCBlcXVhbHMgdG8gdGhlIGlucHV0IHBhcmFtZXRlclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRCeVV1aWQgKHV1aWQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdXVpZCkge1xyXG4gICAgICAgICAgICBsb2coJ0ludmFsaWQgdXVpZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY0NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxvY0NoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsb2NDaGlsZHJlbltpXS5faWQgPT09IHV1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsb2NDaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIGEgY2hpbGQgd2l0aCB0aGUgc2FtZSBuYW1lLlxyXG4gICAgICogQHpoIOmAmui/h+WQjeensOiOt+WPluiKgueCueeahOWtkOiKgueCueOAglxyXG4gICAgICogQHBhcmFtIG5hbWUgLSBBIG5hbWUgdG8gZmluZCB0aGUgY2hpbGQgbm9kZS5cclxuICAgICAqIEByZXR1cm4gYSBDQ05vZGUgb2JqZWN0IHdob3NlIG5hbWUgZXF1YWxzIHRvIHRoZSBpbnB1dCBwYXJhbWV0ZXJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIHZhciBjaGlsZCA9IG5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJUZXN0IE5vZGVcIik7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENoaWxkQnlOYW1lIChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIW5hbWUpIHtcclxuICAgICAgICAgICAgbG9nKCdJbnZhbGlkIG5hbWUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsb2NDaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsb2NDaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobG9jQ2hpbGRyZW5baV0uX25hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsb2NDaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIGEgY2hpbGQgd2l0aCB0aGUgZ2l2ZW4gcGF0aC5cclxuICAgICAqIEB6aCDpgJrov4fot6/lvoTojrflj5boioLngrnnmoTlrZDoioLngrnjgIJcclxuICAgICAqIEBwYXJhbSBwYXRoIC0gQSBwYXRoIHRvIGZpbmQgdGhlIGNoaWxkIG5vZGUuXHJcbiAgICAgKiBAcmV0dXJuIGEgTm9kZSBvYmplY3Qgd2hvc2UgcGF0aCBlcXVhbHMgdG8gdGhlIGlucHV0IHBhcmFtZXRlclxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogdmFyIGNoaWxkID0gbm9kZS5nZXRDaGlsZEJ5UGF0aChcInN1Yk5vZGUvVGVzdCBOb2RlXCIpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDaGlsZEJ5UGF0aCAocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc2VnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgbGV0IGxhc3ROb2RlOiB0aGlzID0gdGhpcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlZ21lbnRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlZ21lbnQgPSBzZWdtZW50c1tpXTtcclxuICAgICAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBuZXh0ID0gbGFzdE5vZGUuY2hpbGRyZW4uZmluZCgoY2hpbGROb2RlKSA9PiBjaGlsZE5vZGUubmFtZSA9PT0gc2VnbWVudCk7XHJcbiAgICAgICAgICAgIGlmICghbmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGFzdE5vZGUgPSBuZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGFzdE5vZGU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBZGQgYSBjaGlsZCB0byB0aGUgY3VycmVudCBub2RlLCBpdCB3aWxsIGJlIHB1c2hlZCB0byB0aGUgZW5kIG9mIFtbY2hpbGRyZW5dXSBhcnJheS5cclxuICAgICAqIEB6aCDmt7vliqDkuIDkuKrlrZDoioLngrnvvIzlroPkvJrooqvmt7vliqDliLAgW1tjaGlsZHJlbl1dIOaVsOe7hOeahOacq+WwvuOAglxyXG4gICAgICogQHBhcmFtIGNoaWxkIC0gdGhlIGNoaWxkIG5vZGUgdG8gYmUgYWRkZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENoaWxkIChjaGlsZDogdGhpcyB8IE5vZGUpOiB2b2lkIHtcclxuICAgICAgICBpZiAoREVWICYmICEoY2hpbGQgaW5zdGFuY2VvZiBsZWdhY3lDQy5fQmFzZU5vZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlcnJvcklEKDE2MzQsIGxlZ2FjeUNDLmpzLmdldENsYXNzTmFtZShjaGlsZCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhc3NlcnRJRChjaGlsZCwgMTYwNik7XHJcbiAgICAgICAgYXNzZXJ0SUQoKGNoaWxkIGFzIHRoaXMpLl9wYXJlbnQgPT09IG51bGwsIDE2MDUpO1xyXG5cclxuICAgICAgICAvLyBpbnZva2VzIHRoZSBwYXJlbnQgc2V0dGVyXHJcbiAgICAgICAgKGNoaWxkIGFzIHRoaXMpLnNldFBhcmVudCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbnNlcnRzIGEgY2hpbGQgdG8gdGhlIG5vZGUgYXQgYSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKiBAemgg5o+S5YWl5a2Q6IqC54K55Yiw5oyH5a6a5L2N572uXHJcbiAgICAgKiBAcGFyYW0gY2hpbGQgLSB0aGUgY2hpbGQgbm9kZSB0byBiZSBpbnNlcnRlZFxyXG4gICAgICogQHBhcmFtIHNpYmxpbmdJbmRleCAtIHRoZSBzaWJsaW5nIGluZGV4IHRvIHBsYWNlIHRoZSBjaGlsZCBpblxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogbm9kZS5pbnNlcnRDaGlsZChjaGlsZCwgMik7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluc2VydENoaWxkIChjaGlsZDogdGhpcyB8IE5vZGUsIHNpYmxpbmdJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICBjaGlsZC5zZXRTaWJsaW5nSW5kZXgoc2libGluZ0luZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGhlIHNpYmxpbmcgaW5kZXggb2YgdGhlIGN1cnJlbnQgbm9kZSBpbiBpdHMgcGFyZW50J3MgY2hpbGRyZW4gYXJyYXkuXHJcbiAgICAgKiBAemgg6I635Y+W5b2T5YmN6IqC54K55Zyo54i26IqC54K555qEIGNoaWxkcmVuIOaVsOe7hOS4reeahOS9jee9ruOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0U2libGluZ0luZGV4ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2libGluZ0luZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCB0aGUgc2libGluZyBpbmRleCBvZiB0aGUgY3VycmVudCBub2RlIGluIGl0cyBwYXJlbnQncyBjaGlsZHJlbiBhcnJheS5cclxuICAgICAqIEB6aCDorr7nva7lvZPliY3oioLngrnlnKjniLboioLngrnnmoQgY2hpbGRyZW4g5pWw57uE5Lit55qE5L2N572u44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRTaWJsaW5nSW5kZXggKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3BhcmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQuX29iakZsYWdzICYgRGVhY3RpdmF0aW5nKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMzgyMSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLl9wYXJlbnQuX2NoaWxkcmVuO1xyXG4gICAgICAgIGluZGV4ID0gaW5kZXggIT09IC0xID8gaW5kZXggOiBzaWJsaW5ncy5sZW5ndGggLSAxO1xyXG4gICAgICAgIGNvbnN0IG9sZEluZGV4ID0gc2libGluZ3MuaW5kZXhPZih0aGlzKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IG9sZEluZGV4KSB7XHJcbiAgICAgICAgICAgIHNpYmxpbmdzLnNwbGljZShvbGRJbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IHNpYmxpbmdzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgc2libGluZ3Muc3BsaWNlKGluZGV4LCAwLCB0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNpYmxpbmdzLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVTaWJsaW5nSW5kZXgoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29uU2libGluZ0luZGV4Q2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25TaWJsaW5nSW5kZXhDaGFuZ2VkKGluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXYWxrIHRob3VnaCB0aGUgc3ViIGNoaWxkcmVuIHRyZWUgb2YgdGhlIGN1cnJlbnQgbm9kZS5cclxuICAgICAqIEVhY2ggbm9kZSwgaW5jbHVkaW5nIHRoZSBjdXJyZW50IG5vZGUsIGluIHRoZSBzdWIgdHJlZSB3aWxsIGJlIHZpc2l0ZWQgdHdvIHRpbWVzLFxyXG4gICAgICogYmVmb3JlIGFsbCBjaGlsZHJlbiBhbmQgYWZ0ZXIgYWxsIGNoaWxkcmVuLlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBjYWxsIGlzIG5vdCByZWN1cnNpdmUsIGl0J3MgYmFzZWQgb24gc3RhY2suXHJcbiAgICAgKiBQbGVhc2UgZG9uJ3Qgd2FsayBhbnkgb3RoZXIgbm9kZSBpbnNpZGUgdGhlIHdhbGsgcHJvY2Vzcy5cclxuICAgICAqIEB6aCDpgY3ljobor6XoioLngrnnmoTlrZDmoJHph4znmoTmiYDmnInoioLngrnlubbmjInop4TliJnmiafooYzlm57osIPlh73mlbDjgIJcclxuICAgICAqIOWvueWtkOagkeS4reeahOaJgOacieiKgueCue+8jOWMheWQq+W9k+WJjeiKgueCue+8jOS8muaJp+ihjOS4pOasoeWbnuiwg++8jHByZUZ1bmMg5Lya5Zyo6K6/6Zeu5a6D55qE5a2Q6IqC54K55LmL5YmN6LCD55So77yMcG9zdEZ1bmMg5Lya5Zyo6K6/6Zeu5omA5pyJ5a2Q6IqC54K55LmL5ZCO6LCD55So44CCXHJcbiAgICAgKiDov5nkuKrlh73mlbDnmoTlrp7njrDkuI3mmK/ln7rkuo7pgJLlvZLnmoTvvIzogIzmmK/ln7rkuo7moIjlsZXlvIDpgJLlvZLnmoTmlrnlvI/jgIJcclxuICAgICAqIOivt+S4jeimgeWcqCB3YWxrIOi/h+eoi+S4reWvueS7u+S9leWFtuS7lueahOiKgueCueW1jOWll+aJp+ihjCB3YWxr44CCXHJcbiAgICAgKiBAcGFyYW0gcHJlRnVuYyBUaGUgY2FsbGJhY2sgdG8gcHJvY2VzcyBub2RlIHdoZW4gcmVhY2ggdGhlIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKiBAcGFyYW0gcG9zdEZ1bmMgVGhlIGNhbGxiYWNrIHRvIHByb2Nlc3Mgbm9kZSB3aGVuIHJlLXZpc2l0IHRoZSBub2RlIGFmdGVyIHdhbGtlZCBhbGwgY2hpbGRyZW4gaW4gaXRzIHN1YiB0cmVlXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgXHJcbiAgICAgKiBub2RlLndhbGsoZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICogICAgIGNvbnNvbGUubG9nKCdXYWxrZWQgdGhyb3VnaCBub2RlICcgKyB0YXJnZXQubmFtZSArICcgZm9yIHRoZSBmaXJzdCB0aW1lJyk7XHJcbiAgICAgKiB9LCBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICAgKiAgICAgY29uc29sZS5sb2coJ1dhbGtlZCB0aHJvdWdoIG5vZGUgJyArIHRhcmdldC5uYW1lICsgJyBhZnRlciB3YWxrZWQgYWxsIGNoaWxkcmVuIGluIGl0cyBzdWIgdHJlZScpO1xyXG4gICAgICogfSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHdhbGsgKHByZUZ1bmM6ICh0YXJnZXQ6IHRoaXMpID0+IHZvaWQsIHBvc3RGdW5jPzogKHRhcmdldDogdGhpcykgPT4gdm9pZCkge1xyXG4gICAgICAgIC8vIGNvbnN0IEJhc2VOb2RlID0gY2MuX0Jhc2VOb2RlO1xyXG4gICAgICAgIGxldCBpbmRleCA9IDE7XHJcbiAgICAgICAgbGV0IGNoaWxkcmVuOiB0aGlzW10gfCBudWxsID0gbnVsbDtcclxuICAgICAgICBsZXQgY3VycjogdGhpcyB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgc3RhY2sgPSBCYXNlTm9kZS5fc3RhY2tzW0Jhc2VOb2RlLl9zdGFja0lkXTtcclxuICAgICAgICBpZiAoIXN0YWNrKSB7XHJcbiAgICAgICAgICAgIHN0YWNrID0gW107XHJcbiAgICAgICAgICAgIEJhc2VOb2RlLl9zdGFja3MucHVzaChzdGFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEJhc2VOb2RlLl9zdGFja0lkKys7XHJcblxyXG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgc3RhY2tbMF0gPSB0aGlzO1xyXG4gICAgICAgIGxldCBwYXJlbnQ6IHRoaXMgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBsZXQgYWZ0ZXJDaGlsZHJlbiA9IGZhbHNlO1xyXG4gICAgICAgIHdoaWxlIChpbmRleCkge1xyXG4gICAgICAgICAgICBpbmRleC0tO1xyXG4gICAgICAgICAgICBjdXJyID0gc3RhY2tbaW5kZXhdIGFzICh0aGlzIHwgbnVsbCk7XHJcbiAgICAgICAgICAgIGlmICghY3Vycikge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFhZnRlckNoaWxkcmVuICYmIHByZUZ1bmMpIHtcclxuICAgICAgICAgICAgICAgIC8vIHByZSBjYWxsXHJcbiAgICAgICAgICAgICAgICBwcmVGdW5jKGN1cnIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFmdGVyQ2hpbGRyZW4gJiYgcG9zdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgIC8vIHBvc3QgY2FsbFxyXG4gICAgICAgICAgICAgICAgcG9zdEZ1bmMoY3Vycik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEF2b2lkIG1lbW9yeSBsZWFrXHJcbiAgICAgICAgICAgIHN0YWNrW2luZGV4XSA9IG51bGw7XHJcbiAgICAgICAgICAgIC8vIERvIG5vdCByZXBlYXRseSB2aXNpdCBjaGlsZCB0cmVlLCBqdXN0IGRvIHBvc3QgY2FsbCBhbmQgY29udGludWUgd2Fsa1xyXG4gICAgICAgICAgICBpZiAoYWZ0ZXJDaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcy5fcGFyZW50KSBicmVhaztcclxuICAgICAgICAgICAgICAgIGFmdGVyQ2hpbGRyZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIENoaWxkcmVuIG5vdCBwcm9jZWVkZWQgYW5kIGhhcyBjaGlsZHJlbiwgcHJvY2VlZCB0byBjaGlsZCB0cmVlXHJcbiAgICAgICAgICAgICAgICBpZiAoY3Vyci5fY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGN1cnI7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBjdXJyLl9jaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBzdGFja1tpbmRleF0gPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFja1tpbmRleF0gPSBjdXJyO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJDaGlsZHJlbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjdXJyIGhhcyBubyBzdWIgdHJlZSwgc28gbG9vayBpbnRvIHRoZSBzaWJsaW5ncyBpbiBwYXJlbnQgY2hpbGRyZW5cclxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAvLyBQcm9jZWVkIHRvIG5leHQgc2libGluZyBpbiBwYXJlbnQgY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbltpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrW2luZGV4XSA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrW2luZGV4XSA9IHBhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldHVwIHBhcmVudCB3YWxrIGVudlxyXG4gICAgICAgICAgICAgICAgICAgIGFmdGVyQ2hpbGRyZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHBhcmVudC5fcGFyZW50Ll9jaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGNoaWxkcmVuLmluZGV4T2YocGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50Ll9wYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXQgcm9vdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBFUlJPUlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhY2subGVuZ3RoID0gMDtcclxuICAgICAgICBCYXNlTm9kZS5fc3RhY2tJZC0tO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZW1vdmUgaXRzZWxmIGZyb20gaXRzIHBhcmVudCBub2RlLiBcclxuICAgICAqIElmIHRoZSBub2RlIGhhdmUgbm8gcGFyZW50LCB0aGVuIG5vdGhpbmcgaGFwcGVucy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5LuO54i26IqC54K55Lit5Yig6Zmk6K+l6IqC54K544CCXHJcbiAgICAgKiDlpoLmnpzov5nkuKroioLngrnmmK/kuIDkuKrlraTnq4voioLngrnvvIzpgqPkuYjku4DkuYjpg73kuI3kvJrlj5HnlJ/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUZyb21QYXJlbnQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZW1vdmVzIGEgY2hpbGQgZnJvbSB0aGUgY29udGFpbmVyLlxyXG4gICAgICogQHpoIOenu+mZpOiKgueCueS4reaMh+WumueahOWtkOiKgueCueOAglxyXG4gICAgICogQHBhcmFtIGNoaWxkIC0gVGhlIGNoaWxkIG5vZGUgd2hpY2ggd2lsbCBiZSByZW1vdmVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ2hpbGQgKGNoaWxkOiB0aGlzIHwgTm9kZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbi5pbmRleE9mKGNoaWxkIGFzIHRoaXMpID4gLTEpIHtcclxuICAgICAgICAgICAgLy8gaW52b2tlIHRoZSBwYXJlbnQgc2V0dGVyXHJcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gdGhlIGNvbnRhaW5lci5cclxuICAgICAqIEB6aCDnp7vpmaToioLngrnmiYDmnInnmoTlrZDoioLngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUFsbENoaWxkcmVuICgpIHtcclxuICAgICAgICAvLyBub3QgdXNpbmcgZGV0YWNoQ2hpbGQgaW1wcm92ZXMgc3BlZWQgaGVyZVxyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jaGlsZHJlbi5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIElzIHRoaXMgbm9kZSBhIGNoaWxkIG9mIHRoZSBnaXZlbiBub2RlP1xyXG4gICAgICogQHpoIOaYr+WQpuaYr+aMh+WumuiKgueCueeahOWtkOiKgueCue+8n1xyXG4gICAgICogQHJldHVybiBUcnVlIGlmIHRoaXMgbm9kZSBpcyBhIGNoaWxkLCBkZWVwIGNoaWxkIG9yIGlkZW50aWNhbCB0byB0aGUgZ2l2ZW4gbm9kZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzQ2hpbGRPZiAocGFyZW50OiB0aGlzIHwgU2NlbmUgfCBudWxsKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGNoaWxkOiBCYXNlTm9kZSB8IG51bGwgPSB0aGlzO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkID09PSBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNoaWxkID0gY2hpbGQuX3BhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKGNoaWxkKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ09NUE9ORU5UXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgdGhlIGNvbXBvbmVudCBvZiBzdXBwbGllZCB0eXBlIGlmIHRoZSBub2RlIGhhcyBvbmUgYXR0YWNoZWQsIG51bGwgaWYgaXQgZG9lc24ndC4gXHJcbiAgICAgKiBZb3UgY2FuIGFsc28gZ2V0IGNvbXBvbmVudCBpbiB0aGUgbm9kZSBieSBwYXNzaW5nIGluIHRoZSBuYW1lIG9mIHRoZSBzY3JpcHQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluiKgueCueS4iuaMh+Wumuexu+Wei+eahOe7hOS7tu+8jOWmguaenOiKgueCueaciemZhOWKoOaMh+Wumuexu+Wei+eahOe7hOS7tu+8jOWImei/lOWbnu+8jOWmguaenOayoeacieWImeS4uuepuuOAglxyXG4gICAgICog5Lyg5YWl5Y+C5pWw5Lmf5Y+v5Lul5piv6ISa5pys55qE5ZCN56ew44CCXHJcbiAgICAgKiBAcGFyYW0gY2xhc3NDb25zdHJ1Y3RvciBUaGUgY2xhc3Mgb2YgdGhlIHRhcmdldCBjb21wb25lbnRcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIC8vIGdldCBzcHJpdGUgY29tcG9uZW50LlxyXG4gICAgICogdmFyIHNwcml0ZSA9IG5vZGUuZ2V0Q29tcG9uZW50KFNwcml0ZSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50PiAoY2xhc3NDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8VD4pOiBUIHwgbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmV0dXJucyB0aGUgY29tcG9uZW50IG9mIHN1cHBsaWVkIHR5cGUgaWYgdGhlIG5vZGUgaGFzIG9uZSBhdHRhY2hlZCwgbnVsbCBpZiBpdCBkb2Vzbid0LlxyXG4gICAgICogWW91IGNhbiBhbHNvIGdldCBjb21wb25lbnQgaW4gdGhlIG5vZGUgYnkgcGFzc2luZyBpbiB0aGUgbmFtZSBvZiB0aGUgc2NyaXB0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5boioLngrnkuIrmjIflrprnsbvlnovnmoTnu4Tku7bvvIzlpoLmnpzoioLngrnmnInpmYTliqDmjIflrprnsbvlnovnmoTnu4Tku7bvvIzliJnov5Tlm57vvIzlpoLmnpzmsqHmnInliJnkuLrnqbrjgIJcclxuICAgICAqIOS8oOWFpeWPguaVsOS5n+WPr+S7peaYr+iEmuacrOeahOWQjeensOOAglxyXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZSBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgdGFyZ2V0IGNvbXBvbmVudFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogLy8gZ2V0IGN1c3RvbSB0ZXN0IGNsYXNzLlxyXG4gICAgICogdmFyIHRlc3QgPSBub2RlLmdldENvbXBvbmVudChcIlRlc3RcIik7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbXBvbmVudCAoY2xhc3NOYW1lOiBzdHJpbmcpOiBDb21wb25lbnQgfCBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnQgKHR5cGVPckNsYXNzTmFtZTogc3RyaW5nIHwgRnVuY3Rpb24pIHtcclxuICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9IGdldENvbnN0cnVjdG9yKHR5cGVPckNsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlTm9kZS5fZmluZENvbXBvbmVudCh0aGlzLCBjb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgYWxsIGNvbXBvbmVudHMgb2YgZ2l2ZW4gdHlwZSBpbiB0aGUgbm9kZS5cclxuICAgICAqIEB6aCDov5Tlm57oioLngrnkuIrmjIflrprnsbvlnovnmoTmiYDmnInnu4Tku7bjgIJcclxuICAgICAqIEBwYXJhbSBjbGFzc0NvbnN0cnVjdG9yIFRoZSBjbGFzcyBvZiB0aGUgdGFyZ2V0IGNvbXBvbmVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50czxUIGV4dGVuZHMgQ29tcG9uZW50PiAoY2xhc3NDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8VD4pOiBUW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBhbGwgY29tcG9uZW50cyBvZiBnaXZlbiB0eXBlIGluIHRoZSBub2RlLlxyXG4gICAgICogQHpoIOi/lOWbnuiKgueCueS4iuaMh+Wumuexu+Wei+eahOaJgOaciee7hOS7tuOAglxyXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZSBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgdGFyZ2V0IGNvbXBvbmVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50cyAoY2xhc3NOYW1lOiBzdHJpbmcpOiBDb21wb25lbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50cyAodHlwZU9yQ2xhc3NOYW1lOiBzdHJpbmcgfCBGdW5jdGlvbikge1xyXG4gICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gZ2V0Q29uc3RydWN0b3IodHlwZU9yQ2xhc3NOYW1lKTtcclxuICAgICAgICBjb25zdCBjb21wb25lbnRzOiBDb21wb25lbnRbXSA9IFtdO1xyXG4gICAgICAgIGlmIChjb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICBCYXNlTm9kZS5fZmluZENvbXBvbmVudHModGhpcywgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29tcG9uZW50cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBjb21wb25lbnQgb2YgZ2l2ZW4gdHlwZSBpbiBhbnkgb2YgaXRzIGNoaWxkcmVuIHVzaW5nIGRlcHRoIGZpcnN0IHNlYXJjaC5cclxuICAgICAqIEB6aCDpgJLlvZLmn6Xmib7miYDmnInlrZDoioLngrnkuK3nrKzkuIDkuKrljLnphY3mjIflrprnsbvlnovnmoTnu4Tku7bjgIJcclxuICAgICAqIEBwYXJhbSBjbGFzc0NvbnN0cnVjdG9yIFRoZSBjbGFzcyBvZiB0aGUgdGFyZ2V0IGNvbXBvbmVudFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogdmFyIHNwcml0ZSA9IG5vZGUuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihTcHJpdGUpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRJbkNoaWxkcmVuPFQgZXh0ZW5kcyBDb21wb25lbnQ+IChjbGFzc0NvbnN0cnVjdG9yOiBDb25zdHJ1Y3RvcjxUPik6IFQgfCBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIGNvbXBvbmVudCBvZiBnaXZlbiB0eXBlIGluIGFueSBvZiBpdHMgY2hpbGRyZW4gdXNpbmcgZGVwdGggZmlyc3Qgc2VhcmNoLlxyXG4gICAgICogQHpoIOmAkuW9kuafpeaJvuaJgOacieWtkOiKgueCueS4reesrOS4gOS4quWMuemFjeaMh+Wumuexu+Wei+eahOe7hOS7tuOAglxyXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZSBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgdGFyZ2V0IGNvbXBvbmVudFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogdmFyIFRlc3QgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oXCJUZXN0XCIpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRJbkNoaWxkcmVuIChjbGFzc05hbWU6IHN0cmluZyk6IENvbXBvbmVudCB8IG51bGw7XHJcblxyXG4gICAgcHVibGljIGdldENvbXBvbmVudEluQ2hpbGRyZW4gKHR5cGVPckNsYXNzTmFtZTogc3RyaW5nIHwgRnVuY3Rpb24pIHtcclxuICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9IGdldENvbnN0cnVjdG9yKHR5cGVPckNsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlTm9kZS5fZmluZENoaWxkQ29tcG9uZW50KHRoaXMuX2NoaWxkcmVuLCBjb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgYWxsIGNvbXBvbmVudHMgb2YgZ2l2ZW4gdHlwZSBpbiBzZWxmIG9yIGFueSBvZiBpdHMgY2hpbGRyZW4uXHJcbiAgICAgKiBAemgg6YCS5b2S5p+l5om+6Ieq6Lqr5oiW5omA5pyJ5a2Q6IqC54K55Lit5oyH5a6a57G75Z6L55qE57uE5Lu2XHJcbiAgICAgKiBAcGFyYW0gY2xhc3NDb25zdHJ1Y3RvciBUaGUgY2xhc3Mgb2YgdGhlIHRhcmdldCBjb21wb25lbnRcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIHZhciBzcHJpdGVzID0gbm9kZS5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihTcHJpdGUpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzSW5DaGlsZHJlbjxUIGV4dGVuZHMgQ29tcG9uZW50PiAoY2xhc3NDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8VD4pOiBUW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBhbGwgY29tcG9uZW50cyBvZiBnaXZlbiB0eXBlIGluIHNlbGYgb3IgYW55IG9mIGl0cyBjaGlsZHJlbi5cclxuICAgICAqIEB6aCDpgJLlvZLmn6Xmib7oh6rouqvmiJbmiYDmnInlrZDoioLngrnkuK3mjIflrprnsbvlnovnmoTnu4Tku7ZcclxuICAgICAqIEBwYXJhbSBjbGFzc05hbWUgVGhlIGNsYXNzIG5hbWUgb2YgdGhlIHRhcmdldCBjb21wb25lbnRcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIHZhciB0ZXN0cyA9IG5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oXCJUZXN0XCIpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnRzSW5DaGlsZHJlbiAoY2xhc3NOYW1lOiBzdHJpbmcpOiBDb21wb25lbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4gKHR5cGVPckNsYXNzTmFtZTogc3RyaW5nIHwgRnVuY3Rpb24pIHtcclxuICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9IGdldENvbnN0cnVjdG9yKHR5cGVPckNsYXNzTmFtZSk7XHJcbiAgICAgICAgY29uc3QgY29tcG9uZW50czogQ29tcG9uZW50W10gPSBbXTtcclxuICAgICAgICBpZiAoY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgQmFzZU5vZGUuX2ZpbmRDb21wb25lbnRzKHRoaXMsIGNvbnN0cnVjdG9yLCBjb21wb25lbnRzKTtcclxuICAgICAgICAgICAgQmFzZU5vZGUuX2ZpbmRDaGlsZENvbXBvbmVudHModGhpcy5fY2hpbGRyZW4sIGNvbnN0cnVjdG9yLCBjb21wb25lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWRkcyBhIGNvbXBvbmVudCBjbGFzcyB0byB0aGUgbm9kZS4gWW91IGNhbiBhbHNvIGFkZCBjb21wb25lbnQgdG8gbm9kZSBieSBwYXNzaW5nIGluIHRoZSBuYW1lIG9mIHRoZSBzY3JpcHQuXHJcbiAgICAgKiBAemgg5ZCR6IqC54K55re75Yqg5LiA5Liq5oyH5a6a57G75Z6L55qE57uE5Lu257G777yM5L2g6L+Y5Y+v5Lul6YCa6L+H5Lyg5YWl6ISa5pys55qE5ZCN56ew5p2l5re75Yqg57uE5Lu244CCXHJcbiAgICAgKiBAcGFyYW0gY2xhc3NDb25zdHJ1Y3RvciBUaGUgY2xhc3Mgb2YgdGhlIGNvbXBvbmVudCB0byBhZGRcclxuICAgICAqIEB0aHJvd3MgYFR5cGVFcnJvcmAgaWYgdGhlIGBjbGFzc0NvbnN0cnVjdG9yYCBkb2VzIG5vdCBzcGVjaWZ5IGEgY2MtY2xhc3MgY29uc3RydWN0b3IgZXh0ZW5kaW5nIHRoZSBgQ29tcG9uZW50YC5cclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIHZhciBzcHJpdGUgPSBub2RlLmFkZENvbXBvbmVudChTcHJpdGUpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4gKGNsYXNzQ29uc3RydWN0b3I6IENvbnN0cnVjdG9yPFQ+KTogVDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBZGRzIGEgY29tcG9uZW50IGNsYXNzIHRvIHRoZSBub2RlLiBZb3UgY2FuIGFsc28gYWRkIGNvbXBvbmVudCB0byBub2RlIGJ5IHBhc3NpbmcgaW4gdGhlIG5hbWUgb2YgdGhlIHNjcmlwdC5cclxuICAgICAqIEB6aCDlkJHoioLngrnmt7vliqDkuIDkuKrmjIflrprnsbvlnovnmoTnu4Tku7bnsbvvvIzkvaDov5jlj6/ku6XpgJrov4fkvKDlhaXohJrmnKznmoTlkI3np7DmnaXmt7vliqDnu4Tku7bjgIJcclxuICAgICAqIEBwYXJhbSBjbGFzc05hbWUgVGhlIGNsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudCB0byBhZGRcclxuICAgICAqIEB0aHJvd3MgYFR5cGVFcnJvcmAgaWYgdGhlIGBjbGFzc05hbWVgIGRvZXMgbm90IHNwZWNpZnkgYSBjYy1jbGFzcyBjb25zdHJ1Y3RvciBleHRlbmRpbmcgdGhlIGBDb21wb25lbnRgLlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogdmFyIHRlc3QgPSBub2RlLmFkZENvbXBvbmVudChcIlRlc3RcIik7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENvbXBvbmVudCAoY2xhc3NOYW1lOiBzdHJpbmcpOiBDb21wb25lbnQ7XHJcblxyXG4gICAgcHVibGljIGFkZENvbXBvbmVudCAodHlwZU9yQ2xhc3NOYW1lOiBzdHJpbmcgfCBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWluZykpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYGlzRGVzdHJveWluZ2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZ2V0IGNvbXBvbmVudFxyXG5cclxuICAgICAgICBsZXQgY29uc3RydWN0b3I7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlT3JDbGFzc05hbWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yID0ganMuZ2V0Q2xhc3NCeU5hbWUodHlwZU9yQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFjb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlZ2FjeUNDLl9SRi5wZWVrKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcklEKDM4MDgsIHR5cGVPckNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBUeXBlRXJyb3IoZ2V0RXJyb3IoMzgwNywgdHlwZU9yQ2xhc3NOYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIXR5cGVPckNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgVHlwZUVycm9yKGdldEVycm9yKDM4MDQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvciA9IHR5cGVPckNsYXNzTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGNvbXBvbmVudFxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNvbnN0cnVjdG9yICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IFR5cGVFcnJvcihnZXRFcnJvcigzODA5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghanMuaXNDaGlsZENsYXNzT2YoY29uc3RydWN0b3IsIGxlZ2FjeUNDLkNvbXBvbmVudCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgVHlwZUVycm9yKGdldEVycm9yKDM4MTApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChFRElUT1IgJiYgY29uc3RydWN0b3IuX2Rpc2FsbG93TXVsdGlwbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tNdWx0aXBsZUNvbXAhKGNvbnN0cnVjdG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIHJlcXVpcmVtZW50XHJcblxyXG4gICAgICAgIGNvbnN0IFJlcUNvbXAgPSBjb25zdHJ1Y3Rvci5fcmVxdWlyZUNvbXBvbmVudDtcclxuICAgICAgICBpZiAoUmVxQ29tcCAmJiAhdGhpcy5nZXRDb21wb25lbnQoUmVxQ29tcCkpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoUmVxQ29tcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vIGNoZWNrIGNvbmZsaWN0XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBpZiAoRURJVE9SICYmICFfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuYmVmb3JlQWRkQ29tcG9uZW50KHRoaXMsIGNvbnN0cnVjdG9yKSkge1xyXG4gICAgICAgIC8vICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy9cclxuXHJcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IGNvbnN0cnVjdG9yKCk7XHJcbiAgICAgICAgY29tcG9uZW50Lm5vZGUgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgRWRpdG9yRXh0ZW5kcy5Ob2RlICYmIEVkaXRvckV4dGVuZHMuQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBFZGl0b3JFeHRlbmRzLk5vZGUuZ2V0Tm9kZSh0aGlzLl9pZCk7XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBFZGl0b3JFeHRlbmRzLkNvbXBvbmVudC5hZGQoY29tcG9uZW50Ll9pZCwgY29tcG9uZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuYWN0aXZhdGVDb21wKGNvbXBvbmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZW1vdmVzIGEgY29tcG9uZW50IGlkZW50aWZpZWQgYnkgdGhlIGdpdmVuIG5hbWUgb3IgcmVtb3ZlcyB0aGUgY29tcG9uZW50IG9iamVjdCBnaXZlbi5cclxuICAgICAqIFlvdSBjYW4gYWxzbyB1c2UgY29tcG9uZW50LmRlc3Ryb3koKSBpZiB5b3UgYWxyZWFkeSBoYXZlIHRoZSByZWZlcmVuY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIoOmZpOiKgueCueS4iueahOaMh+Wumue7hOS7tu+8jOS8oOWFpeWPguaVsOWPr+S7peaYr+S4gOS4que7hOS7tuaehOmAoOWHveaVsOaIlue7hOS7tuWQje+8jOS5n+WPr+S7peaYr+W3sue7j+iOt+W+l+eahOe7hOS7tuW8leeUqOOAglxyXG4gICAgICog5aaC5p6c5L2g5bey57uP6I635b6X57uE5Lu25byV55So77yM5L2g5Lmf5Y+v5Lul55u05o6l6LCD55SoIGNvbXBvbmVudC5kZXN0cm95KClcclxuICAgICAqIEBwYXJhbSBjbGFzc0NvbnN0cnVjdG9yIFRoZSBjbGFzcyBvZiB0aGUgY29tcG9uZW50IHRvIHJlbW92ZVxyXG4gICAgICogQGRlcHJlY2F0ZWQgcGxlYXNlIGRlc3Ryb3kgdGhlIGNvbXBvbmVudCB0byByZW1vdmUgaXQuXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgXHJcbiAgICAgKiBub2RlLnJlbW92ZUNvbXBvbmVudChTcHJpdGUpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4gKGNsYXNzQ29uc3RydWN0b3I6IENvbnN0cnVjdG9yPFQ+KTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVtb3ZlcyBhIGNvbXBvbmVudCBpZGVudGlmaWVkIGJ5IHRoZSBnaXZlbiBuYW1lIG9yIHJlbW92ZXMgdGhlIGNvbXBvbmVudCBvYmplY3QgZ2l2ZW4uXHJcbiAgICAgKiBZb3UgY2FuIGFsc28gdXNlIGNvbXBvbmVudC5kZXN0cm95KCkgaWYgeW91IGFscmVhZHkgaGF2ZSB0aGUgcmVmZXJlbmNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDliKDpmaToioLngrnkuIrnmoTmjIflrprnu4Tku7bvvIzkvKDlhaXlj4LmlbDlj6/ku6XmmK/kuIDkuKrnu4Tku7bmnoTpgKDlh73mlbDmiJbnu4Tku7blkI3vvIzkuZ/lj6/ku6XmmK/lt7Lnu4/ojrflvpfnmoTnu4Tku7blvJXnlKjjgIJcclxuICAgICAqIOWmguaenOS9oOW3sue7j+iOt+W+l+e7hOS7tuW8leeUqO+8jOS9oOS5n+WPr+S7peebtOaOpeiwg+eUqCBjb21wb25lbnQuZGVzdHJveSgpXHJcbiAgICAgKiBAcGFyYW0gY2xhc3NOYW1lT3JJbnN0YW5jZSBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50IHRvIHJlbW92ZSBvciB0aGUgY29tcG9uZW50IGluc3RhbmNlIHRvIGJlIHJlbW92ZWRcclxuICAgICAqIEBkZXByZWNhdGVkIHBsZWFzZSBkZXN0cm95IHRoZSBjb21wb25lbnQgdG8gcmVtb3ZlIGl0LlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogaW1wb3J0IHsgU3ByaXRlIH0gZnJvbSAnY2MnO1xyXG4gICAgICogY29uc3Qgc3ByaXRlID0gbm9kZS5nZXRDb21wb25lbnQoU3ByaXRlKTtcclxuICAgICAqIGlmIChzcHJpdGUpIHtcclxuICAgICAqICAgICBub2RlLnJlbW92ZUNvbXBvbmVudChzcHJpdGUpO1xyXG4gICAgICogfVxyXG4gICAgICogbm9kZS5yZW1vdmVDb21wb25lbnQoJ1Nwcml0ZScpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVDb21wb25lbnQgKGNsYXNzTmFtZU9ySW5zdGFuY2U6IHN0cmluZyB8IENvbXBvbmVudCk6IHZvaWQ7XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUNvbXBvbmVudCAoY29tcG9uZW50OiBhbnkpIHtcclxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDM4MTMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb21wb25lbnRJbnN0YW5jZTogQ29tcG9uZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCkge1xyXG4gICAgICAgICAgICBjb21wb25lbnRJbnN0YW5jZSA9IGNvbXBvbmVudDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb21wb25lbnRJbnN0YW5jZSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnRJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjb21wb25lbnRJbnN0YW5jZS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEVWRU5UIFBST0NFU1NJTkdcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVnaXN0ZXIgYSBjYWxsYmFjayBvZiBhIHNwZWNpZmljIGV2ZW50IHR5cGUgb24gTm9kZS5cclxuICAgICAqIFVzZSB0aGlzIG1ldGhvZCB0byByZWdpc3RlciB0b3VjaCBvciBtb3VzZSBldmVudCBwZXJtaXQgcHJvcGFnYXRpb24gYmFzZWQgb24gc2NlbmUgZ3JhcGgsXHJcbiAgICAgKiBUaGVzZSBraW5kcyBvZiBldmVudCBhcmUgdHJpZ2dlcmVkIHdpdGggZGlzcGF0Y2hFdmVudCwgdGhlIGRpc3BhdGNoIHByb2Nlc3MgaGFzIHRocmVlIHN0ZXBzOlxyXG4gICAgICogMS4gQ2FwdHVyaW5nIHBoYXNlOiBkaXNwYXRjaCBpbiBjYXB0dXJlIHRhcmdldHMgKGBfZ2V0Q2FwdHVyaW5nVGFyZ2V0c2ApLCBlLmcuIHBhcmVudHMgaW4gbm9kZSB0cmVlLCBmcm9tIHJvb3QgdG8gdGhlIHJlYWwgdGFyZ2V0XHJcbiAgICAgKiAyLiBBdCB0YXJnZXQgcGhhc2U6IGRpc3BhdGNoIHRvIHRoZSBsaXN0ZW5lcnMgb2YgdGhlIHJlYWwgdGFyZ2V0XHJcbiAgICAgKiAzLiBCdWJibGluZyBwaGFzZTogZGlzcGF0Y2ggaW4gYnViYmxlIHRhcmdldHMgKGBfZ2V0QnViYmxpbmdUYXJnZXRzYCksIGUuZy4gcGFyZW50cyBpbiBub2RlIHRyZWUsIGZyb20gdGhlIHJlYWwgdGFyZ2V0IHRvIHJvb3RcclxuICAgICAqIEluIGFueSBtb21lbnQgb2YgdGhlIGRpc3BhdGNoaW5nIHByb2Nlc3MsIGl0IGNhbiBiZSBzdG9wcGVkIHZpYSBgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClgIG9yIGBldmVudC5zdG9wUHJvcGFnYXRpb25JbW1pZGlhdGUoKWAuXHJcbiAgICAgKiBJdCdzIHRoZSByZWNvbW1lbmRlZCB3YXkgdG8gcmVnaXN0ZXIgdG91Y2gvbW91c2UgZXZlbnQgZm9yIE5vZGUsXHJcbiAgICAgKiBwbGVhc2UgZG8gbm90IHVzZSBgZXZlbnRNYW5hZ2VyYCBkaXJlY3RseSBmb3IgTm9kZS5cclxuICAgICAqIFlvdSBjYW4gYWxzbyByZWdpc3RlciBjdXN0b20gZXZlbnQgYW5kIHVzZSBgZW1pdGAgdG8gdHJpZ2dlciBjdXN0b20gZXZlbnQgb24gTm9kZS5cclxuICAgICAqIEZvciBzdWNoIGV2ZW50cywgdGhlcmUgd29uJ3QgYmUgY2FwdHVyaW5nIGFuZCBidWJibGluZyBwaGFzZSwgeW91ciBldmVudCB3aWxsIGJlIGRpc3BhdGNoZWQgZGlyZWN0bHkgdG8gaXRzIGxpc3RlbmVycyByZWdpc3RlcmVkIG9uIHRoZSBzYW1lIG5vZGUuXHJcbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBldmVudCBjYWxsYmFjayBwYXJhbWV0ZXJzIHdpdGggYGVtaXRgIGJ5IHBhc3NpbmcgcGFyYW1ldGVycyBhZnRlciBgdHlwZWAuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWcqOiKgueCueS4iuazqOWGjOaMh+Wumuexu+Wei+eahOWbnuiwg+WHveaVsO+8jOS5n+WPr+S7peiuvue9riB0YXJnZXQg55So5LqO57uR5a6a5ZON5bqU5Ye95pWw55qEIHRoaXMg5a+56LGh44CCXHJcbiAgICAgKiDpvKDmoIfmiJbop6bmkbjkuovku7bkvJrooqvns7vnu5/osIPnlKggZGlzcGF0Y2hFdmVudCDmlrnms5Xop6blj5HvvIzop6blj5HnmoTov4fnqIvljIXlkKvkuInkuKrpmLbmrrXvvJpcclxuICAgICAqIDEuIOaNleiOt+mYtuaute+8mua0vuWPkeS6i+S7tue7meaNleiOt+ebruagh++8iOmAmui/hyBgX2dldENhcHR1cmluZ1RhcmdldHNgIOiOt+WPlu+8ie+8jOavlOWmgu+8jOiKgueCueagkeS4reazqOWGjOS6huaNleiOt+mYtuauteeahOeItuiKgueCue+8jOS7juagueiKgueCueW8gOWni+a0vuWPkeebtOWIsOebruagh+iKgueCueOAglxyXG4gICAgICogMi4g55uu5qCH6Zi25q6177ya5rS+5Y+R57uZ55uu5qCH6IqC54K555qE55uR5ZCs5Zmo44CCXHJcbiAgICAgKiAzLiDlhpLms6HpmLbmrrXvvJrmtL7lj5Hkuovku7bnu5nlhpLms6Hnm67moIfvvIjpgJrov4cgYF9nZXRCdWJibGluZ1RhcmdldHNgIOiOt+WPlu+8ie+8jOavlOWmgu+8jOiKgueCueagkeS4reazqOWGjOS6huWGkuazoemYtuauteeahOeItuiKgueCue+8jOS7juebruagh+iKgueCueW8gOWni+a0vuWPkeebtOWIsOagueiKgueCueOAglxyXG4gICAgICog5ZCM5pe25oKo5Y+v5Lul5bCG5LqL5Lu25rS+5Y+R5Yiw54i26IqC54K55oiW6ICF6YCa6L+H6LCD55SoIHN0b3BQcm9wYWdhdGlvbiDmi6bmiKrlroPjgIJcclxuICAgICAqIOaOqOiNkOS9v+eUqOi/meenjeaWueW8j+adpeebkeWQrOiKgueCueS4iueahOinpuaRuOaIlum8oOagh+S6i+S7tu+8jOivt+S4jeimgeWcqOiKgueCueS4iuebtOaOpeS9v+eUqCBgZXZlbnRNYW5hZ2VyYOOAglxyXG4gICAgICog5L2g5Lmf5Y+v5Lul5rOo5YaM6Ieq5a6a5LmJ5LqL5Lu25Yiw6IqC54K55LiK77yM5bm26YCa6L+HIGVtaXQg5pa55rOV6Kem5Y+R5q2k57G75LqL5Lu277yM5a+55LqO6L+Z57G75LqL5Lu277yM5LiN5Lya5Y+R55Sf5o2V6I635YaS5rOh6Zi25q6177yM5Y+q5Lya55u05o6l5rS+5Y+R57uZ5rOo5YaM5Zyo6K+l6IqC54K55LiK55qE55uR5ZCs5ZmoXHJcbiAgICAgKiDkvaDlj6/ku6XpgJrov4flnKggZW1pdCDmlrnms5XosIPnlKjml7blnKggdHlwZSDkuYvlkI7kvKDpgJLpop3lpJbnmoTlj4LmlbDkvZzkuLrkuovku7blm57osIPnmoTlj4LmlbDliJfooahcclxuICAgICAqIEBwYXJhbSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuPGJyPlNlZSB7eyNjcm9zc0xpbmsgXCJOb2RlL0V2ZW50VHl1cGUvUE9TSVRJT05fQ0hBTkdFRFwifX1Ob2RlIEV2ZW50c3t7L2Nyb3NzTGlua319IGZvciBhbGwgYnVpbHRpbiBldmVudHMuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC4gVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXHJcbiAgICAgKiBAcGFyYW0gdXNlQ2FwdHVyZSAtIFdoZW4gc2V0IHRvIHRydWUsIHRoZSBsaXN0ZW5lciB3aWxsIGJlIHRyaWdnZXJlZCBhdCBjYXB0dXJpbmcgcGhhc2Ugd2hpY2ggaXMgYWhlYWQgb2YgdGhlIGZpbmFsIHRhcmdldCBlbWl0LCBvdGhlcndpc2UgaXQgd2lsbCBiZSB0cmlnZ2VyZWQgZHVyaW5nIGJ1YmJsaW5nIHBoYXNlLlxyXG4gICAgICogQHJldHVybiAtIEp1c3QgcmV0dXJucyB0aGUgaW5jb21pbmcgY2FsbGJhY2sgc28geW91IGNhbiBzYXZlIHRoZSBhbm9ueW1vdXMgZnVuY3Rpb24gZWFzaWVyLlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm1lbWJlckZ1bmN0aW9uLCB0aGlzKTsgIC8vIGlmIFwidGhpc1wiIGlzIGNvbXBvbmVudCBhbmQgdGhlIFwibWVtYmVyRnVuY3Rpb25cIiBkZWNsYXJlZCBpbiBDQ0NsYXNzLlxyXG4gICAgICogbm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGNhbGxiYWNrLCB0aGlzKTtcclxuICAgICAqIG5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX01PVkUsIGNhbGxiYWNrLCB0aGlzKTtcclxuICAgICAqIG5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0VORCwgY2FsbGJhY2ssIHRoaXMpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbiAodHlwZTogc3RyaW5nIHwgU3lzdGVtRXZlbnRUeXBlLCBjYWxsYmFjazogRnVuY3Rpb24sIHRhcmdldD86IE9iamVjdCwgdXNlQ2FwdHVyZTogYW55ID0gZmFsc2UpIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gVFJBTlNGT1JNX09OO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V2ZW50UHJvY2Vzc29yLm9uKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHVzZUNhcHR1cmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBjYWxsYmFjayBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgc2FtZSB0eXBlLCBjYWxsYmFjaywgdGFyZ2V0IGFuZCBvciB1c2VDYXB0dXJlLlxyXG4gICAgICogVGhpcyBtZXRob2QgaXMgbWVyZWx5IGFuIGFsaWFzIHRvIHJlbW92ZUV2ZW50TGlzdGVuZXIuXHJcbiAgICAgKiBAemgg5Yig6Zmk5LmL5YmN5LiO5ZCM57G75Z6L77yM5Zue6LCD77yM55uu5qCH5oiWIHVzZUNhcHR1cmUg5rOo5YaM55qE5Zue6LCD44CCXHJcbiAgICAgKiBAcGFyYW0gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSBiZWluZyByZW1vdmVkLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cclxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgdGFyZ2V0ICh0aGlzIG9iamVjdCkgdG8gaW52b2tlIHRoZSBjYWxsYmFjaywgaWYgaXQncyBub3QgZ2l2ZW4sIG9ubHkgY2FsbGJhY2sgd2l0aG91dCB0YXJnZXQgd2lsbCBiZSByZW1vdmVkXHJcbiAgICAgKiBAcGFyYW0gdXNlQ2FwdHVyZSAtIFdoZW4gc2V0IHRvIHRydWUsIHRoZSBsaXN0ZW5lciB3aWxsIGJlIHRyaWdnZXJlZCBhdCBjYXB0dXJpbmcgcGhhc2Ugd2hpY2ggaXMgYWhlYWQgb2YgdGhlIGZpbmFsIHRhcmdldCBlbWl0LCBvdGhlcndpc2UgaXQgd2lsbCBiZSB0cmlnZ2VyZWQgZHVyaW5nIGJ1YmJsaW5nIHBoYXNlLlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5tZW1iZXJGdW5jdGlvbiwgdGhpcyk7XHJcbiAgICAgKiBub2RlLm9mZihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGNhbGxiYWNrLCB0aGlzLm5vZGUpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvZmYgKHR5cGU6IHN0cmluZywgY2FsbGJhY2s/OiBGdW5jdGlvbiwgdGFyZ2V0PzogT2JqZWN0LCB1c2VDYXB0dXJlOiBhbnkgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuX2V2ZW50UHJvY2Vzc29yLm9mZih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCB1c2VDYXB0dXJlKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFzTGlzdGVuZXJzID0gdGhpcy5fZXZlbnRQcm9jZXNzb3IuaGFzRXZlbnRMaXN0ZW5lcih0eXBlKTtcclxuICAgICAgICAvLyBBbGwgbGlzdGVuZXIgcmVtb3ZlZFxyXG4gICAgICAgIGlmICghaGFzTGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5UUkFOU0ZPUk1fT047XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlZ2lzdGVyIGFuIGNhbGxiYWNrIG9mIGEgc3BlY2lmaWMgZXZlbnQgdHlwZSBvbiB0aGUgTm9kZSxcclxuICAgICAqIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgdGhlIGZpcnN0IHRpbWUgaXQgaXMgdHJpZ2dlcmVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDms6jlhozoioLngrnnmoTnibnlrprkuovku7bnsbvlnovlm57osIPvvIzlm57osIPkvJrlnKjnrKzkuIDml7bpl7Tooqvop6blj5HlkI7liKDpmaToh6rouqvjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxyXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBjYW4gYmUgbnVsbFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25jZSAodHlwZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIHRhcmdldD86IE9iamVjdCwgdXNlQ2FwdHVyZT86IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2V2ZW50UHJvY2Vzc29yLm9uY2UodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgdXNlQ2FwdHVyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRyaWdnZXIgYW4gZXZlbnQgZGlyZWN0bHkgd2l0aCB0aGUgZXZlbnQgbmFtZSBhbmQgbmVjZXNzYXJ5IGFyZ3VtZW50cy5cclxuICAgICAqIEB6aFxyXG4gICAgICog6YCa6L+H5LqL5Lu25ZCN5Y+R6YCB6Ieq5a6a5LmJ5LqL5Lu2XHJcbiAgICAgKiBAcGFyYW0gdHlwZSAtIGV2ZW50IHR5cGVcclxuICAgICAqIEBwYXJhbSBhcmcxIC0gRmlyc3QgYXJndW1lbnQgaW4gY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSBhcmcyIC0gU2Vjb25kIGFyZ3VtZW50IGluIGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0gYXJnMyAtIFRoaXJkIGFyZ3VtZW50IGluIGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0gYXJnNCAtIEZvdXJ0aCBhcmd1bWVudCBpbiBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIGFyZzUgLSBGaWZ0aCBhcmd1bWVudCBpbiBjYWxsYmFja1xyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBldmVudFRhcmdldC5lbWl0KCdmaXJlJywgZXZlbnQpO1xyXG4gICAgICogZXZlbnRUYXJnZXQuZW1pdCgnZmlyZScsIG1lc3NhZ2UsIGVtaXR0ZXIpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbWl0ICh0eXBlOiBzdHJpbmcsIGFyZzA/OiBhbnksIGFyZzE/OiBhbnksIGFyZzI/OiBhbnksIGFyZzM/OiBhbnksIGFyZzQ/OiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9ldmVudFByb2Nlc3Nvci5lbWl0KHR5cGUsIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBEaXNwYXRjaGVzIGFuIGV2ZW50IGludG8gdGhlIGV2ZW50IGZsb3cuXHJcbiAgICAgKiBUaGUgZXZlbnQgdGFyZ2V0IGlzIHRoZSBFdmVudFRhcmdldCBvYmplY3QgdXBvbiB3aGljaCB0aGUgZGlzcGF0Y2hFdmVudCgpIG1ldGhvZCBpcyBjYWxsZWQuXHJcbiAgICAgKiBAemgg5YiG5Y+R5LqL5Lu25Yiw5LqL5Lu25rWB5Lit44CCXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgLSBUaGUgRXZlbnQgb2JqZWN0IHRoYXQgaXMgZGlzcGF0Y2hlZCBpbnRvIHRoZSBldmVudCBmbG93XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXNwYXRjaEV2ZW50IChldmVudDogRXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9ldmVudFByb2Nlc3Nvci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDaGVja3Mgd2hldGhlciB0aGUgRXZlbnRUYXJnZXQgb2JqZWN0IGhhcyBhbnkgY2FsbGJhY2sgcmVnaXN0ZXJlZCBmb3IgYSBzcGVjaWZpYyB0eXBlIG9mIGV2ZW50LlxyXG4gICAgICogQHpoIOajgOafpeS6i+S7tuebruagh+WvueixoeaYr+WQpuacieS4uueJueWumuexu+Wei+eahOS6i+S7tuazqOWGjOeahOWbnuiwg+OAglxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgdHlwZSBvZiBldmVudC5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiBvZiB0aGUgZXZlbnQgbGlzdGVuZXIsIGlmIGFic2VudCBhbGwgZXZlbnQgbGlzdGVuZXJzIGZvciB0aGUgZ2l2ZW4gdHlwZSB3aWxsIGJlIHJlbW92ZWRcclxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgY2FsbGJhY2sgY2FsbGVlIG9mIHRoZSBldmVudCBsaXN0ZW5lclxyXG4gICAgICogQHJldHVybiBUcnVlIGlmIGEgY2FsbGJhY2sgb2YgdGhlIHNwZWNpZmllZCB0eXBlIGlzIHJlZ2lzdGVyZWQ7IGZhbHNlIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGhhc0V2ZW50TGlzdGVuZXIgKHR5cGU6IHN0cmluZywgY2FsbGJhY2s/OiBGdW5jdGlvbiwgdGFyZ2V0PzogT2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50UHJvY2Vzc29yLmhhc0V2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVtb3ZlcyBhbGwgY2FsbGJhY2tzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzYW1lIHRhcmdldC5cclxuICAgICAqIEB6aCDnp7vpmaTnm67moIfkuIrnmoTmiYDmnInms6jlhozkuovku7bjgIJcclxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgdGFyZ2V0IHRvIGJlIHNlYXJjaGVkIGZvciBhbGwgcmVsYXRlZCBjYWxsYmFja3NcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRhcmdldE9mZiAodGFyZ2V0OiBzdHJpbmcgfCBPYmplY3QpIHtcclxuICAgICAgICB0aGlzLl9ldmVudFByb2Nlc3Nvci50YXJnZXRPZmYodGFyZ2V0KTtcclxuICAgICAgICAvLyBDaGVjayBmb3IgZXZlbnQgbWFzayByZXNldFxyXG4gICAgICAgIGlmICgodGhpcy5fZXZlbnRNYXNrICYgVFJBTlNGT1JNX09OKSAmJiAhdGhpcy5fZXZlbnRQcm9jZXNzb3IuaGFzRXZlbnRMaXN0ZW5lcihTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRUQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayAmPSB+VFJBTlNGT1JNX09OO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHN1cGVyLmRlc3Ryb3koKSkge1xyXG4gICAgICAgICAgICAvLyBkaXNhYmxlIGhpZXJhcmNoeVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVDaGlsZENvbXBzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBEZXN0cm95IGFsbCBjaGlsZHJlbiBmcm9tIHRoZSBub2RlLCBhbmQgcmVsZWFzZSBhbGwgdGhlaXIgb3duIHJlZmVyZW5jZXMgdG8gb3RoZXIgb2JqZWN0cy5cclxuICAgICAqIEFjdHVhbCBkZXN0cnVjdCBvcGVyYXRpb24gd2lsbCBkZWxheWVkIHVudGlsIGJlZm9yZSByZW5kZXJpbmcuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmUgOavgeaJgOacieWtkOiKgueCue+8jOW5tumHiuaUvuaJgOacieWug+S7rOWvueWFtuWug+WvueixoeeahOW8leeUqOOAglxyXG4gICAgICog5a6e6ZmF6ZSA5q+B5pON5L2c5Lya5bu26L+f5Yiw5b2T5YmN5bin5riy5p+T5YmN5omn6KGM44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95QWxsQ2hpbGRyZW4gKCkge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbltpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIERvIHJlbW92ZSBjb21wb25lbnQsIG9ubHkgdXNlZCBpbnRlcm5hbGx5LlxyXG4gICAgcHVibGljIF9yZW1vdmVDb21wb25lbnQgKGNvbXBvbmVudDogQ29tcG9uZW50KSB7XHJcbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgzODE0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEodGhpcy5fb2JqRmxhZ3MgJiBEZXN0cm95aW5nKSkge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5fY29tcG9uZW50cy5pbmRleE9mKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGlmIChpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoRURJVE9SICYmIEVkaXRvckV4dGVuZHMuQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRWRpdG9yRXh0ZW5kcy5Db21wb25lbnQucmVtb3ZlKGNvbXBvbmVudC5faWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgZWxzZSBpZiAoY29tcG9uZW50Lm5vZGUgIT09IHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIGVycm9ySUQoMzgxNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF91cGRhdGVTaWJsaW5nSW5kZXggKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW5baV0uX3NpYmxpbmdJbmRleCA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25TZXRQYXJlbnQgKG9sZFBhcmVudDogdGhpcyB8IG51bGwsIGtlZXBXb3JsZFRyYW5zZm9ybTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xyXG4gICAgICAgICAgICBpZiAoKG9sZFBhcmVudCA9PSBudWxsIHx8IG9sZFBhcmVudC5fc2NlbmUgIT09IHRoaXMuX3BhcmVudC5fc2NlbmUpICYmIHRoaXMuX3BhcmVudC5fc2NlbmUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YWxrKChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQmFzZU5vZGUuX3NldFNjZW5lKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUFJJVkFURVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25Qb3N0QWN0aXZhdGVkIChhY3RpdmU6IGJvb2xlYW4pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vbkJhdGNoUmVzdG9yZWQgKCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uQmF0Y2hDcmVhdGVkICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NpYmxpbmdJbmRleCA9IHRoaXMuX3BhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblByZURlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX29uUHJlRGVzdHJveUJhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uSGllcmFyY2h5Q2hhbmdlZCAob2xkUGFyZW50OiB0aGlzIHwgbnVsbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vbkhpZXJhcmNoeUNoYW5nZWRCYXNlKG9sZFBhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pbnN0YW50aWF0ZSAoY2xvbmVkKSB7XHJcbiAgICAgICAgaWYgKCFjbG9uZWQpIHtcclxuICAgICAgICAgICAgY2xvbmVkID0gbGVnYWN5Q0MuaW5zdGFudGlhdGUuX2Nsb25lKHRoaXMsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGhpc1ByZWZhYkluZm8gPSB0aGlzLl9wcmVmYWI7XHJcbiAgICAgICAgaWYgKEVESVRPUiAmJiB0aGlzUHJlZmFiSW5mbykge1xyXG4gICAgICAgICAgICBpZiAodGhpcyAhPT0gdGhpc1ByZWZhYkluZm8ucm9vdCkge31cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3luY2luZyA9IHRoaXNQcmVmYWJJbmZvICYmIHRoaXMgPT09IHRoaXNQcmVmYWJJbmZvLnJvb3QgJiYgdGhpc1ByZWZhYkluZm8uc3luYztcclxuICAgICAgICBpZiAoc3luY2luZykge1xyXG4gICAgICAgICAgICAvLyBpZiAodGhpc1ByZWZhYkluZm8uX3N5bmNlZCkge1xyXG4gICAgICAgICAgICAvLyAgICByZXR1cm4gY2xvbmU7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9IGVsc2UgaWYgKEVESVRPUiAmJiBsZWdhY3lDQy5HQU1FX1ZJRVcpIHtcclxuICAgICAgICAgICAgY2xvbmVkLl9uYW1lICs9ICcgKENsb25lKSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZXNldCBhbmQgaW5pdFxyXG4gICAgICAgIGNsb25lZC5fcGFyZW50ID0gbnVsbDtcclxuICAgICAgICBjbG9uZWQuX29uQmF0Y2hSZXN0b3JlZCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gY2xvbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25IaWVyYXJjaHlDaGFuZ2VkQmFzZSAob2xkUGFyZW50OiB0aGlzIHwgbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IG5ld1BhcmVudCA9IHRoaXMuX3BhcmVudDtcclxuICAgICAgICBpZiAodGhpcy5fcGVyc2lzdE5vZGUgJiYgIShuZXdQYXJlbnQgaW5zdGFuY2VvZiBsZWdhY3lDQy5TY2VuZSkpIHtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5yZW1vdmVQZXJzaXN0Um9vdE5vZGUodGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgICAgIHdhcm5JRCgxNjIzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBjb25zdCBzY2VuZSA9IGxlZ2FjeUNDLmRpcmVjdG9yLmdldFNjZW5lKCkgYXMgdGhpcyB8IG51bGw7XHJcbiAgICAgICAgICAgIGNvbnN0IGluQ3VycmVudFNjZW5lQmVmb3JlID0gb2xkUGFyZW50ICYmIG9sZFBhcmVudC5pc0NoaWxkT2Yoc2NlbmUpO1xyXG4gICAgICAgICAgICBjb25zdCBpbkN1cnJlbnRTY2VuZU5vdyA9IG5ld1BhcmVudCAmJiBuZXdQYXJlbnQuaXNDaGlsZE9mKHNjZW5lKTtcclxuICAgICAgICAgICAgaWYgKCFpbkN1cnJlbnRTY2VuZUJlZm9yZSAmJiBpbkN1cnJlbnRTY2VuZU5vdykge1xyXG4gICAgICAgICAgICAgICAgLy8gYXR0YWNoZWRcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVySWZBdHRhY2hlZCEodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5DdXJyZW50U2NlbmVCZWZvcmUgJiYgIWluQ3VycmVudFNjZW5lTm93KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkZXRhY2hlZFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJJZkF0dGFjaGVkIShmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbmZsaWN0IGRldGVjdGlvblxyXG4gICAgICAgICAgICAvLyBfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuYWZ0ZXJBZGRDaGlsZCh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNob3VsZEFjdGl2ZU5vdyA9IHRoaXMuX2FjdGl2ZSAmJiAhIShuZXdQYXJlbnQgJiYgbmV3UGFyZW50Ll9hY3RpdmVJbkhpZXJhcmNoeSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5ICE9PSBzaG91bGRBY3RpdmVOb3cpIHtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuYWN0aXZhdGVOb2RlKHRoaXMsIHNob3VsZEFjdGl2ZU5vdyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25QcmVEZXN0cm95QmFzZSAoKSB7XHJcbiAgICAgICAgLy8gbWFya2VkIGFzIGRlc3Ryb3lpbmdcclxuICAgICAgICB0aGlzLl9vYmpGbGFncyB8PSBEZXN0cm95aW5nO1xyXG5cclxuICAgICAgICAvLyBkZXRhY2ggc2VsZiBhbmQgY2hpbGRyZW4gZnJvbSBlZGl0b3JcclxuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XHJcbiAgICAgICAgY29uc3QgZGVzdHJveUJ5UGFyZW50OiBib29sZWFuID0gKCEhcGFyZW50KSAmJiAoKHBhcmVudC5fb2JqRmxhZ3MgJiBEZXN0cm95aW5nKSAhPT0gMCk7XHJcbiAgICAgICAgaWYgKCFkZXN0cm95QnlQYXJlbnQgJiYgRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVySWZBdHRhY2hlZCEoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gcGVyc2lzdFxyXG4gICAgICAgIGlmICh0aGlzLl9wZXJzaXN0Tm9kZSkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLnJlbW92ZVBlcnNpc3RSb290Tm9kZSh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGVzdHJveUJ5UGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHBhcmVudFxyXG4gICAgICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlBBUkVOVF9DSEFOR0VELCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIC8vIER1cmluZyBkZXN0cm95IHByb2Nlc3MsIHNpYmxpbmdJbmRleCBpcyBub3QgcmVseWFibGVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkSW5kZXggPSBwYXJlbnQuX2NoaWxkcmVuLmluZGV4T2YodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuX2NoaWxkcmVuLnNwbGljZShjaGlsZEluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NpYmxpbmdJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50LmVtaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuZW1pdChTeXN0ZW1FdmVudFR5cGUuQ0hJTERfUkVNT1ZFRCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGVtaXQgbm9kZSBkZXN0cm95IGV2ZW50ICh0aGlzIHNob3VsZCBiZWZvcmUgZXZlbnQgcHJvY2Vzc29yIGRlc3Ryb3kpXHJcbiAgICAgICAgdGhpcy5lbWl0KFN5c3RlbUV2ZW50VHlwZS5OT0RFX0RFU1RST1lFRCwgdGhpcyk7XHJcblxyXG4gICAgICAgIC8vIERlc3Ryb3kgbm9kZSBldmVudCBwcm9jZXNzb3JcclxuICAgICAgICB0aGlzLl9ldmVudFByb2Nlc3Nvci5kZXN0cm95KCk7XHJcblxyXG4gICAgICAgIC8vIGRlc3Ryb3kgY2hpbGRyZW5cclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgLy8gZGVzdHJveSBpbW1lZGlhdGUgc28gaXRzIF9vblByZURlc3Ryb3kgY2FuIGJlIGNhbGxlZFxyXG4gICAgICAgICAgICBjaGlsZHJlbltpXS5fZGVzdHJveUltbWVkaWF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZGVzdHJveSBzZWxmIGNvbXBvbmVudHNcclxuICAgICAgICBjb25zdCBjb21wcyA9IHRoaXMuX2NvbXBvbmVudHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAvLyBkZXN0cm95IGltbWVkaWF0ZSBzbyBpdHMgX29uUHJlRGVzdHJveSBjYW4gYmUgY2FsbGVkXHJcbiAgICAgICAgICAgIC8vIFRPIERPXHJcbiAgICAgICAgICAgIGNvbXBzW2ldLl9kZXN0cm95SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGVzdHJveUJ5UGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZGlzYWJsZUNoaWxkQ29tcHMgKCkge1xyXG4gICAgICAgIC8vIGxlYXZlIHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5IHVubW9kaWZpZWRcclxuICAgICAgICBjb25zdCBjb21wcyA9IHRoaXMuX2NvbXBvbmVudHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wc1tpXTtcclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuX2NvbXBTY2hlZHVsZXIuZGlzYWJsZUNvbXAoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkZWFjdGl2YXRlIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuX2FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5fZGlzYWJsZUNoaWxkQ29tcHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uU2libGluZ0luZGV4Q2hhbmdlZD8gKHNpYmxpbmdJbmRleDogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgdGhhdCB0aGlzIG5vZGUgaGFzIGFscmVhZHkgaGFkIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50KHMpLiBJZiBub3QsIHRoaXMgbWV0aG9kIHRocm93cy5cclxuICAgICAqIEBwYXJhbSBjb25zdHJ1Y3RvciBDb25zdHJ1Y3RvciBvZiB0aGUgY29tcG9uZW50LlxyXG4gICAgICogQHRocm93cyBJZiBvbmUgb3IgbW9yZSBjb21wb25lbnQgb2Ygc2FtZSB0eXBlIGhhdmUgYmVlbiBleGlzdGVkIGluIHRoaXMgbm9kZS5cclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIF9jaGVja011bHRpcGxlQ29tcD8gKGNvbnN0cnVjdG9yOiBGdW5jdGlvbik6IHZvaWQ7XHJcbn1cclxuXHJcbmJhc2VOb2RlUG9seWZpbGwoQmFzZU5vZGUpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIG9ubHkgZW1pdHRlZCBmcm9tIHRoZSB0b3AgbW9zdCBub2RlIHdob3NlIGFjdGl2ZSB2YWx1ZSBkaWQgY2hhbmdlZCxcclxuICogbm90IGluY2x1ZGluZyBpdHMgY2hpbGQgbm9kZXMuXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraToioLngrnmv4DmtLvml7bvvIzmraTkuovku7bku4Xku47mnIDpobbpg6jnmoToioLngrnlj5Hlh7rjgIJcclxuICogQGV2ZW50IGFjdGl2ZS1pbi1oaWVyYXJjaHktY2hhbmdlZFxyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKi9cclxuXHJcbmxlZ2FjeUNDLl9CYXNlTm9kZSA9IEJhc2VOb2RlO1xyXG4iXX0=