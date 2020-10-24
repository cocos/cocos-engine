(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../3d/framework/skinned-mesh-renderer.js", "../data/decorators/index.js", "../math/index.js", "../scene-graph/node.js", "./animation-component.js", "./skeletal-animation-data-hub.js", "./skeletal-animation-state.js", "./transform-utils.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../3d/framework/skinned-mesh-renderer.js"), require("../data/decorators/index.js"), require("../math/index.js"), require("../scene-graph/node.js"), require("./animation-component.js"), require("./skeletal-animation-data-hub.js"), require("./skeletal-animation-state.js"), require("./transform-utils.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.skinnedMeshRenderer, global.index, global.index, global.node, global.animationComponent, global.skeletalAnimationDataHub, global.skeletalAnimationState, global.transformUtils, global.globalExports);
    global.skeletalAnimation = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _skinnedMeshRenderer, _index, _index2, _node, _animationComponent, _skeletalAnimationDataHub, _skeletalAnimationState, _transformUtils, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SkeletalAnimation = _exports.Socket = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _temp, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class4, _class5, _descriptor3, _descriptor4, _class6, _temp2;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var Socket = (_dec = (0, _index.ccclass)('cc.SkeletalAnimationComponent.Socket'), _dec2 = (0, _index.type)(_node.Node), _dec(_class = (_class2 = (_temp =
  /**
   * @en Path of the target joint.
   * @zh 此挂点的目标骨骼路径。
   */

  /**
   * @en Transform output node.
   * @zh 此挂点的变换信息输出节点。
   */
  function Socket() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Socket);

    _initializerDefineProperty(this, "path", _descriptor, this);

    _initializerDefineProperty(this, "target", _descriptor2, this);

    this.path = path;
    this.target = target;
  }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "path", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
  _exports.Socket = Socket;
  var m4_1 = new _index2.Mat4();
  var m4_2 = new _index2.Mat4();

  function collectRecursively(node) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var out = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    for (var i = 0; i < node.children.length; i++) {
      var child = node.children[i];

      if (!child) {
        continue;
      }

      var path = prefix ? "".concat(prefix, "/").concat(child.name) : child.name;
      out.push(path);
      collectRecursively(child, path, out);
    }

    return out;
  }
  /**
   * @en
   * Skeletal animation component, offers the following features on top of [[Animation]]:
   * * Choice between baked animation and real-time calculation, to leverage efficiency and expressiveness.
   * * Joint socket system: Create any socket node directly under the animation component root node,
   *   find your target joint and register both to the socket list, so that the socket node would be in-sync with the joint.
   * @zh
   * 骨骼动画组件，在普通动画组件基础上额外提供以下功能：
   * * 可选预烘焙动画模式或实时计算模式，用以权衡运行时效率与效果；
   * * 提供骨骼挂点功能：通过在动画根节点下创建挂点节点，并在骨骼动画组件上配置 socket 列表，挂点节点的 Transform 就能与骨骼保持同步。
   */


  var SkeletalAnimation = (_dec3 = (0, _index.ccclass)('cc.SkeletalAnimation'), _dec4 = (0, _index.help)('i18n:cc.SkeletalAnimation'), _dec5 = (0, _index.executionOrder)(99), _dec6 = (0, _index.menu)('Components/SkeletalAnimation'), _dec7 = (0, _index.type)([Socket]), _dec8 = (0, _index.tooltip)('i18n:animation.sockets'), _dec9 = (0, _index.tooltip)('i18n:animation.use_baked_animation'), _dec10 = (0, _index.type)([Socket]), _dec3(_class4 = _dec4(_class4 = _dec5(_class4 = (0, _index.executeInEditMode)(_class4 = _dec6(_class4 = (_class5 = (_temp2 = _class6 = /*#__PURE__*/function (_Animation) {
    _inherits(SkeletalAnimation, _Animation);

    function SkeletalAnimation() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, SkeletalAnimation);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SkeletalAnimation)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_useBakedAnimation", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_sockets", _descriptor4, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(SkeletalAnimation, [{
      key: "onDestroy",
      value: function onDestroy() {
        _get(_getPrototypeOf(SkeletalAnimation.prototype), "onDestroy", this).call(this);

        _globalExports.legacyCC.director.root.dataPoolManager.jointAnimationInfo.destroy(this.node.uuid);

        _globalExports.legacyCC.director.getAnimationManager().removeSockets(this.node, this._sockets);
      }
    }, {
      key: "start",
      value: function start() {
        this.sockets = this._sockets;
        this.useBakedAnimation = this._useBakedAnimation;

        _get(_getPrototypeOf(SkeletalAnimation.prototype), "start", this).call(this);
      }
    }, {
      key: "querySockets",
      value: function querySockets() {
        var animPaths = this._defaultClip && Object.keys(_skeletalAnimationDataHub.SkelAnimDataHub.getOrExtract(this._defaultClip).data).sort().reduce(function (acc, cur) {
          return cur.startsWith(acc[acc.length - 1]) ? acc : (acc.push(cur), acc);
        }, []) || [];

        if (!animPaths.length) {
          return ['please specify a valid default animation clip first'];
        }

        var out = [];

        for (var i = 0; i < animPaths.length; i++) {
          var path = animPaths[i];
          var node = this.node.getChildByPath(path);

          if (!node) {
            continue;
          }

          out.push(path);
          collectRecursively(node, path, out);
        }

        return out;
      }
    }, {
      key: "rebuildSocketAnimations",
      value: function rebuildSocketAnimations() {
        var _iterator = _createForOfIteratorHelper(this._sockets),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var socket = _step.value;
            var joint = this.node.getChildByPath(socket.path);
            var target = socket.target;

            if (joint && target) {
              target.name = "".concat(socket.path.substring(socket.path.lastIndexOf('/') + 1), " Socket");
              target.parent = this.node;
              (0, _transformUtils.getWorldTransformUntilRoot)(joint, this.node, m4_1);

              _index2.Mat4.fromRTS(m4_2, target.rotation, target.position, target.scale);

              if (!_index2.Mat4.equals(m4_2, m4_1)) {
                target.matrix = m4_1;
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        for (var _i = 0, _Object$keys = Object.keys(this._nameToState); _i < _Object$keys.length; _i++) {
          var stateName = _Object$keys[_i];
          var state = this._nameToState[stateName];
          state.rebuildSocketCurves(this._sockets);
        }
      }
    }, {
      key: "createSocket",
      value: function createSocket(path) {
        var socket = this._sockets.find(function (s) {
          return s.path === path;
        });

        if (socket) {
          return socket.target;
        }

        var joint = this.node.getChildByPath(path);

        if (!joint) {
          console.warn('illegal socket path');
          return null;
        }

        var target = new _node.Node();
        target.parent = this.node;

        this._sockets.push(new Socket(path, target));

        this.rebuildSocketAnimations();
        return target;
      }
    }, {
      key: "_createState",
      value: function _createState(clip, name) {
        return new _skeletalAnimationState.SkeletalAnimationState(clip, name);
      }
    }, {
      key: "_doCreateState",
      value: function _doCreateState(clip, name) {
        var state = _get(_getPrototypeOf(SkeletalAnimation.prototype), "_doCreateState", this).call(this, clip, name);

        state.rebuildSocketCurves(this._sockets);
        return state;
      }
    }, {
      key: "sockets",

      /**
       * @en
       * The joint sockets this animation component maintains.<br>
       * Sockets have to be registered here before attaching custom nodes to animated joints.
       * @zh
       * 当前动画组件维护的挂点数组。要挂载自定义节点到受动画驱动的骨骼上，必须先在此注册挂点。
       */
      get: function get() {
        return this._sockets;
      },
      set: function set(val) {
        if (!this._useBakedAnimation) {
          var animMgr = _globalExports.legacyCC.director.getAnimationManager();

          animMgr.removeSockets(this.node, this._sockets);
          animMgr.addSockets(this.node, val);
        }

        this._sockets = val;
        this.rebuildSocketAnimations();
      }
      /**
       * @en
       * Whether to bake animations. Default to true,<br>
       * which substantially increases performance while making all animations completely fixed.<br>
       * Dynamically changing this property will take effect when playing the next animation clip.
       * @zh
       * 是否使用预烘焙动画，默认启用，可以大幅提高运行效时率，但所有动画效果会被彻底固定，不支持任何形式的编辑和混合。<br>
       * 运行时动态修改此选项会在播放下一条动画片段时生效。
       */

    }, {
      key: "useBakedAnimation",
      get: function get() {
        return this._useBakedAnimation;
      },
      set: function set(val) {
        this._useBakedAnimation = val;
        var comps = this.node.getComponentsInChildren(_skinnedMeshRenderer.SkinnedMeshRenderer);

        for (var i = 0; i < comps.length; ++i) {
          var comp = comps[i];

          if (comp.skinningRoot === this.node) {
            comp.setUseBakedAnimation(this._useBakedAnimation);
          }
        }

        if (this._useBakedAnimation) {
          _globalExports.legacyCC.director.getAnimationManager().removeSockets(this.node, this._sockets);
        } else {
          _globalExports.legacyCC.director.getAnimationManager().addSockets(this.node, this._sockets);
        }
      }
    }]);

    return SkeletalAnimation;
  }(_animationComponent.Animation), _class6.Socket = Socket, _temp2), (_applyDecoratedDescriptor(_class5.prototype, "sockets", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class5.prototype, "sockets"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "useBakedAnimation", [_dec9], Object.getOwnPropertyDescriptor(_class5.prototype, "useBakedAnimation"), _class5.prototype), _descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "_useBakedAnimation", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "_sockets", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class5)) || _class4) || _class4) || _class4) || _class4) || _class4);
  _exports.SkeletalAnimation = SkeletalAnimation;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3NrZWxldGFsLWFuaW1hdGlvbi50cyJdLCJuYW1lcyI6WyJTb2NrZXQiLCJOb2RlIiwicGF0aCIsInRhcmdldCIsInNlcmlhbGl6YWJsZSIsImVkaXRhYmxlIiwibTRfMSIsIk1hdDQiLCJtNF8yIiwiY29sbGVjdFJlY3Vyc2l2ZWx5Iiwibm9kZSIsInByZWZpeCIsIm91dCIsImkiLCJjaGlsZHJlbiIsImxlbmd0aCIsImNoaWxkIiwibmFtZSIsInB1c2giLCJTa2VsZXRhbEFuaW1hdGlvbiIsImV4ZWN1dGVJbkVkaXRNb2RlIiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInJvb3QiLCJkYXRhUG9vbE1hbmFnZXIiLCJqb2ludEFuaW1hdGlvbkluZm8iLCJkZXN0cm95IiwidXVpZCIsImdldEFuaW1hdGlvbk1hbmFnZXIiLCJyZW1vdmVTb2NrZXRzIiwiX3NvY2tldHMiLCJzb2NrZXRzIiwidXNlQmFrZWRBbmltYXRpb24iLCJfdXNlQmFrZWRBbmltYXRpb24iLCJhbmltUGF0aHMiLCJfZGVmYXVsdENsaXAiLCJPYmplY3QiLCJrZXlzIiwiU2tlbEFuaW1EYXRhSHViIiwiZ2V0T3JFeHRyYWN0IiwiZGF0YSIsInNvcnQiLCJyZWR1Y2UiLCJhY2MiLCJjdXIiLCJzdGFydHNXaXRoIiwiZ2V0Q2hpbGRCeVBhdGgiLCJzb2NrZXQiLCJqb2ludCIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwicGFyZW50IiwiZnJvbVJUUyIsInJvdGF0aW9uIiwicG9zaXRpb24iLCJzY2FsZSIsImVxdWFscyIsIm1hdHJpeCIsIl9uYW1lVG9TdGF0ZSIsInN0YXRlTmFtZSIsInN0YXRlIiwicmVidWlsZFNvY2tldEN1cnZlcyIsImZpbmQiLCJzIiwiY29uc29sZSIsIndhcm4iLCJyZWJ1aWxkU29ja2V0QW5pbWF0aW9ucyIsImNsaXAiLCJTa2VsZXRhbEFuaW1hdGlvblN0YXRlIiwidmFsIiwiYW5pbU1nciIsImFkZFNvY2tldHMiLCJjb21wcyIsImdldENvbXBvbmVudHNJbkNoaWxkcmVuIiwiU2tpbm5lZE1lc2hSZW5kZXJlciIsImNvbXAiLCJza2lubmluZ1Jvb3QiLCJzZXRVc2VCYWtlZEFuaW1hdGlvbiIsIkFuaW1hdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyQ2FBLE0sV0FEWixvQkFBUSxzQ0FBUixDLFVBZUksaUJBQUtDLFVBQUwsQztBQVpEOzs7OztBQVFBOzs7O0FBT0Esb0JBQW9EO0FBQUEsUUFBdkNDLElBQXVDLHVFQUFoQyxFQUFnQztBQUFBLFFBQTVCQyxNQUE0Qix1RUFBTixJQUFNOztBQUFBOztBQUFBOztBQUFBOztBQUNoRCxTQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDSCxHLCtFQWRBQyxtQixFQUNBQyxlOzs7OzthQUNxQixFOzs7Ozs7O2FBT08sSTs7OztBQVFqQyxNQUFNQyxJQUFJLEdBQUcsSUFBSUMsWUFBSixFQUFiO0FBQ0EsTUFBTUMsSUFBSSxHQUFHLElBQUlELFlBQUosRUFBYjs7QUFFQSxXQUFTRSxrQkFBVCxDQUE2QkMsSUFBN0IsRUFBMEU7QUFBQSxRQUFqQ0MsTUFBaUMsdUVBQXhCLEVBQXdCO0FBQUEsUUFBcEJDLEdBQW9CLHVFQUFKLEVBQUk7O0FBQ3RFLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsSUFBSSxDQUFDSSxRQUFMLENBQWNDLE1BQWxDLEVBQTBDRixDQUFDLEVBQTNDLEVBQStDO0FBQzNDLFVBQU1HLEtBQUssR0FBR04sSUFBSSxDQUFDSSxRQUFMLENBQWNELENBQWQsQ0FBZDs7QUFDQSxVQUFJLENBQUNHLEtBQUwsRUFBWTtBQUFFO0FBQVc7O0FBQ3pCLFVBQU1kLElBQUksR0FBR1MsTUFBTSxhQUFNQSxNQUFOLGNBQWdCSyxLQUFLLENBQUNDLElBQXRCLElB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O0FBQ3JCLGVBQU8sS0FBS2pDLGtCQUFaO0FBQ0gsTzt3QkFDc0JvQyxHLEVBQUs7QUFDeEIsYUFBS3BDLGtCQUFMLEdBQTBCb0MsR0FBMUI7QUFDQSxZQUFNRyxLQUFLLEdBQUcsS0FBSzlELElBQUwsQ0FBVStELHVCQUFWLENBQWtDQyx3Q0FBbEMsQ0FBZDs7QUFDQSxhQUFLLElBQUk3RCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHMkQsS0FBSyxDQUFDekQsTUFBMUIsRUFBa0MsRUFBRUYsQ0FBcEMsRUFBdUM7QUFDbkMsY0FBTThELElBQUksR0FBR0gsS0FBSyxDQUFDM0QsQ0FBRCxDQUFsQjs7QUFDQSxjQUFJOEQsSUFBSSxDQUFDQyxZQUFMLEtBQXNCLEtBQUtsRSxJQUEvQixFQUFxQztBQUNqQ2lFLFlBQUFBLElBQUksQ0FBQ0Usb0JBQUwsQ0FBMEIsS0FBSzVDLGtCQUEvQjtBQUNIO0FBQ0o7O0FBQ0QsWUFBSSxLQUFLQSxrQkFBVCxFQUE2QjtBQUFHWixrQ0FBU0MsUUFBVCxDQUFrQk0sbUJBQWxCLEVBQUQsQ0FBOERDLGFBQTlELENBQTRFLEtBQUtuQixJQUFqRixFQUF1RixLQUFLb0IsUUFBNUY7QUFBd0csU0FBdkksTUFDSztBQUFHVCxrQ0FBU0MsUUFBVCxDQUFrQk0sbUJBQWxCLEVBQUQsQ0FBOEQyQyxVQUE5RCxDQUF5RSxLQUFLN0QsSUFBOUUsRUFBb0YsS0FBS29CLFFBQXpGO0FBQXFHO0FBQy9HOzs7O0lBbERrQ2dELDZCLFdBRXJCOUUsTSxHQUFTQSxNLGthQWtEdEJJLG1COzs7OzthQUM4QixJOzs7Ozs7O2FBR0EsRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYW5pbWF0aW9uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgU2tpbm5lZE1lc2hSZW5kZXJlciB9IGZyb20gJy4uLzNkL2ZyYW1ld29yay9za2lubmVkLW1lc2gtcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBleGVjdXRlSW5FZGl0TW9kZSwgZXhlY3V0aW9uT3JkZXIsIGhlbHAsIG1lbnUsIHRvb2x0aXAsIHR5cGUsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBNYXQ0IH0gZnJvbSAnLi4vbWF0aCc7XHJcbmltcG9ydCB7IERhdGFQb29sTWFuYWdlciB9IGZyb20gJy4uL3JlbmRlcmVyL2RhdGEtcG9vbC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uL3NjZW5lLWdyYXBoL25vZGUnO1xyXG5pbXBvcnQgeyBBbmltYXRpb25DbGlwIH0gZnJvbSAnLi9hbmltYXRpb24tY2xpcCc7XHJcbmltcG9ydCB7IEFuaW1hdGlvbiB9IGZyb20gJy4vYW5pbWF0aW9uLWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFNrZWxBbmltRGF0YUh1YiB9IGZyb20gJy4vc2tlbGV0YWwtYW5pbWF0aW9uLWRhdGEtaHViJztcclxuaW1wb3J0IHsgU2tlbGV0YWxBbmltYXRpb25TdGF0ZSB9IGZyb20gJy4vc2tlbGV0YWwtYW5pbWF0aW9uLXN0YXRlJztcclxuaW1wb3J0IHsgZ2V0V29ybGRUcmFuc2Zvcm1VbnRpbFJvb3QgfSBmcm9tICcuL3RyYW5zZm9ybS11dGlscyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBBbmltYXRpb25NYW5hZ2VyIH0gZnJvbSAnLi9hbmltYXRpb24tbWFuYWdlcic7XHJcblxyXG5AY2NjbGFzcygnY2MuU2tlbGV0YWxBbmltYXRpb25Db21wb25lbnQuU29ja2V0JylcclxuZXhwb3J0IGNsYXNzIFNvY2tldCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGF0aCBvZiB0aGUgdGFyZ2V0IGpvaW50LlxyXG4gICAgICogQHpoIOatpOaMgueCueeahOebruagh+mqqOmqvOi3r+W+hOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBwYXRoOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUcmFuc2Zvcm0gb3V0cHV0IG5vZGUuXHJcbiAgICAgKiBAemgg5q2k5oyC54K555qE5Y+Y5o2i5L+h5oGv6L6T5Ye66IqC54K544CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKE5vZGUpXHJcbiAgICBwdWJsaWMgdGFyZ2V0OiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHBhdGggPSAnJywgdGFyZ2V0OiBOb2RlIHwgbnVsbCA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtNF8xID0gbmV3IE1hdDQoKTtcclxuY29uc3QgbTRfMiA9IG5ldyBNYXQ0KCk7XHJcblxyXG5mdW5jdGlvbiBjb2xsZWN0UmVjdXJzaXZlbHkgKG5vZGU6IE5vZGUsIHByZWZpeCA9ICcnLCBvdXQ6IHN0cmluZ1tdID0gW10pIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcclxuICAgICAgICBpZiAoIWNoaWxkKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHByZWZpeCA/IGAke3ByZWZpeH0vJHtjaGlsZC5uYW1lfWAgOiBjaGlsZC5uYW1lO1xyXG4gICAgICAgIG91dC5wdXNoKHBhdGgpO1xyXG4gICAgICAgIGNvbGxlY3RSZWN1cnNpdmVseShjaGlsZCwgcGF0aCwgb3V0KTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2tlbGV0YWwgYW5pbWF0aW9uIGNvbXBvbmVudCwgb2ZmZXJzIHRoZSBmb2xsb3dpbmcgZmVhdHVyZXMgb24gdG9wIG9mIFtbQW5pbWF0aW9uXV06XHJcbiAqICogQ2hvaWNlIGJldHdlZW4gYmFrZWQgYW5pbWF0aW9uIGFuZCByZWFsLXRpbWUgY2FsY3VsYXRpb24sIHRvIGxldmVyYWdlIGVmZmljaWVuY3kgYW5kIGV4cHJlc3NpdmVuZXNzLlxyXG4gKiAqIEpvaW50IHNvY2tldCBzeXN0ZW06IENyZWF0ZSBhbnkgc29ja2V0IG5vZGUgZGlyZWN0bHkgdW5kZXIgdGhlIGFuaW1hdGlvbiBjb21wb25lbnQgcm9vdCBub2RlLFxyXG4gKiAgIGZpbmQgeW91ciB0YXJnZXQgam9pbnQgYW5kIHJlZ2lzdGVyIGJvdGggdG8gdGhlIHNvY2tldCBsaXN0LCBzbyB0aGF0IHRoZSBzb2NrZXQgbm9kZSB3b3VsZCBiZSBpbi1zeW5jIHdpdGggdGhlIGpvaW50LlxyXG4gKiBAemhcclxuICog6aqo6aq85Yqo55S757uE5Lu277yM5Zyo5pmu6YCa5Yqo55S757uE5Lu25Z+656GA5LiK6aKd5aSW5o+Q5L6b5Lul5LiL5Yqf6IO977yaXHJcbiAqICog5Y+v6YCJ6aKE54OY54SZ5Yqo55S75qih5byP5oiW5a6e5pe26K6h566X5qih5byP77yM55So5Lul5p2D6KGh6L+Q6KGM5pe25pWI546H5LiO5pWI5p6c77ybXHJcbiAqICog5o+Q5L6b6aqo6aq85oyC54K55Yqf6IO977ya6YCa6L+H5Zyo5Yqo55S75qC56IqC54K55LiL5Yib5bu65oyC54K56IqC54K577yM5bm25Zyo6aqo6aq85Yqo55S757uE5Lu25LiK6YWN572uIHNvY2tldCDliJfooajvvIzmjILngrnoioLngrnnmoQgVHJhbnNmb3JtIOWwseiDveS4jumqqOmqvOS/neaMgeWQjOatpeOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlNrZWxldGFsQW5pbWF0aW9uJylcclxuQGhlbHAoJ2kxOG46Y2MuU2tlbGV0YWxBbmltYXRpb24nKVxyXG5AZXhlY3V0aW9uT3JkZXIoOTkpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5AbWVudSgnQ29tcG9uZW50cy9Ta2VsZXRhbEFuaW1hdGlvbicpXHJcbmV4cG9ydCBjbGFzcyBTa2VsZXRhbEFuaW1hdGlvbiBleHRlbmRzIEFuaW1hdGlvbiB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBTb2NrZXQgPSBTb2NrZXQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBqb2ludCBzb2NrZXRzIHRoaXMgYW5pbWF0aW9uIGNvbXBvbmVudCBtYWludGFpbnMuPGJyPlxyXG4gICAgICogU29ja2V0cyBoYXZlIHRvIGJlIHJlZ2lzdGVyZWQgaGVyZSBiZWZvcmUgYXR0YWNoaW5nIGN1c3RvbSBub2RlcyB0byBhbmltYXRlZCBqb2ludHMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+WJjeWKqOeUu+e7hOS7tue7tOaKpOeahOaMgueCueaVsOe7hOOAguimgeaMgui9veiHquWumuS5ieiKgueCueWIsOWPl+WKqOeUu+mpseWKqOeahOmqqOmqvOS4iu+8jOW/hemhu+WFiOWcqOatpOazqOWGjOaMgueCueOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShbU29ja2V0XSlcclxuICAgIEB0b29sdGlwKCdpMThuOmFuaW1hdGlvbi5zb2NrZXRzJylcclxuICAgIGdldCBzb2NrZXRzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc29ja2V0cztcclxuICAgIH1cclxuICAgIHNldCBzb2NrZXRzICh2YWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3VzZUJha2VkQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuaW1NZ3IgPSBsZWdhY3lDQy5kaXJlY3Rvci5nZXRBbmltYXRpb25NYW5hZ2VyKCkgYXMgQW5pbWF0aW9uTWFuYWdlcjtcclxuICAgICAgICAgICAgYW5pbU1nci5yZW1vdmVTb2NrZXRzKHRoaXMubm9kZSwgdGhpcy5fc29ja2V0cyk7XHJcbiAgICAgICAgICAgIGFuaW1NZ3IuYWRkU29ja2V0cyh0aGlzLm5vZGUsIHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NvY2tldHMgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5yZWJ1aWxkU29ja2V0QW5pbWF0aW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRvIGJha2UgYW5pbWF0aW9ucy4gRGVmYXVsdCB0byB0cnVlLDxicj5cclxuICAgICAqIHdoaWNoIHN1YnN0YW50aWFsbHkgaW5jcmVhc2VzIHBlcmZvcm1hbmNlIHdoaWxlIG1ha2luZyBhbGwgYW5pbWF0aW9ucyBjb21wbGV0ZWx5IGZpeGVkLjxicj5cclxuICAgICAqIER5bmFtaWNhbGx5IGNoYW5naW5nIHRoaXMgcHJvcGVydHkgd2lsbCB0YWtlIGVmZmVjdCB3aGVuIHBsYXlpbmcgdGhlIG5leHQgYW5pbWF0aW9uIGNsaXAuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaYr+WQpuS9v+eUqOmihOeDmOeEmeWKqOeUu++8jOm7mOiupOWQr+eUqO+8jOWPr+S7peWkp+W5heaPkOmrmOi/kOihjOaViOaXtueOh++8jOS9huaJgOacieWKqOeUu+aViOaenOS8muiiq+W9u+W6leWbuuWumu+8jOS4jeaUr+aMgeS7u+S9leW9ouW8j+eahOe8lui+keWSjOa3t+WQiOOAgjxicj5cclxuICAgICAqIOi/kOihjOaXtuWKqOaAgeS/ruaUueatpOmAiemhueS8muWcqOaSreaUvuS4i+S4gOadoeWKqOeUu+eJh+auteaXtueUn+aViOOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgnaTE4bjphbmltYXRpb24udXNlX2Jha2VkX2FuaW1hdGlvbicpXHJcbiAgICBnZXQgdXNlQmFrZWRBbmltYXRpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VCYWtlZEFuaW1hdGlvbjtcclxuICAgIH1cclxuICAgIHNldCB1c2VCYWtlZEFuaW1hdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlQmFrZWRBbmltYXRpb24gPSB2YWw7XHJcbiAgICAgICAgY29uc3QgY29tcHMgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oU2tpbm5lZE1lc2hSZW5kZXJlcik7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wID0gY29tcHNbaV07XHJcbiAgICAgICAgICAgIGlmIChjb21wLnNraW5uaW5nUm9vdCA9PT0gdGhpcy5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wLnNldFVzZUJha2VkQW5pbWF0aW9uKHRoaXMuX3VzZUJha2VkQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fdXNlQmFrZWRBbmltYXRpb24pIHsgKGxlZ2FjeUNDLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKSBhcyBBbmltYXRpb25NYW5hZ2VyKS5yZW1vdmVTb2NrZXRzKHRoaXMubm9kZSwgdGhpcy5fc29ja2V0cyk7IH1cclxuICAgICAgICBlbHNlIHsgKGxlZ2FjeUNDLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKSBhcyBBbmltYXRpb25NYW5hZ2VyKS5hZGRTb2NrZXRzKHRoaXMubm9kZSwgdGhpcy5fc29ja2V0cyk7IH1cclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3VzZUJha2VkQW5pbWF0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBAdHlwZShbU29ja2V0XSlcclxuICAgIHByb3RlY3RlZCBfc29ja2V0czogU29ja2V0W10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKTtcclxuICAgICAgICAobGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5kYXRhUG9vbE1hbmFnZXIgYXMgRGF0YVBvb2xNYW5hZ2VyKS5qb2ludEFuaW1hdGlvbkluZm8uZGVzdHJveSh0aGlzLm5vZGUudXVpZCk7XHJcbiAgICAgICAgKGxlZ2FjeUNDLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKSBhcyBBbmltYXRpb25NYW5hZ2VyKS5yZW1vdmVTb2NrZXRzKHRoaXMubm9kZSwgdGhpcy5fc29ja2V0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0ICgpIHtcclxuICAgICAgICB0aGlzLnNvY2tldHMgPSB0aGlzLl9zb2NrZXRzO1xyXG4gICAgICAgIHRoaXMudXNlQmFrZWRBbmltYXRpb24gPSB0aGlzLl91c2VCYWtlZEFuaW1hdGlvbjtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBxdWVyeVNvY2tldHMgKCkge1xyXG4gICAgICAgIGNvbnN0IGFuaW1QYXRocyA9IHRoaXMuX2RlZmF1bHRDbGlwICYmIE9iamVjdC5rZXlzKFNrZWxBbmltRGF0YUh1Yi5nZXRPckV4dHJhY3QodGhpcy5fZGVmYXVsdENsaXApLmRhdGEpLnNvcnQoKS5yZWR1Y2UoKGFjYywgY3VyKSA9PlxyXG4gICAgICAgICAgICBjdXIuc3RhcnRzV2l0aChhY2NbYWNjLmxlbmd0aCAtIDFdKSA/IGFjYyA6IChhY2MucHVzaChjdXIpLCBhY2MpLCBbXSBhcyBzdHJpbmdbXSkgfHwgW107XHJcbiAgICAgICAgaWYgKCFhbmltUGF0aHMubGVuZ3RoKSB7IHJldHVybiBbJ3BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgZGVmYXVsdCBhbmltYXRpb24gY2xpcCBmaXJzdCddOyB9XHJcbiAgICAgICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5pbVBhdGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBhbmltUGF0aHNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeVBhdGgocGF0aCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBvdXQucHVzaChwYXRoKTtcclxuICAgICAgICAgICAgY29sbGVjdFJlY3Vyc2l2ZWx5KG5vZGUsIHBhdGgsIG91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlYnVpbGRTb2NrZXRBbmltYXRpb25zICgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHNvY2tldCBvZiB0aGlzLl9zb2NrZXRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGpvaW50ID0gdGhpcy5ub2RlLmdldENoaWxkQnlQYXRoKHNvY2tldC5wYXRoKTtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gc29ja2V0LnRhcmdldDtcclxuICAgICAgICAgICAgaWYgKGpvaW50ICYmIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Lm5hbWUgPSBgJHtzb2NrZXQucGF0aC5zdWJzdHJpbmcoc29ja2V0LnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpfSBTb2NrZXRgO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnBhcmVudCA9IHRoaXMubm9kZTtcclxuICAgICAgICAgICAgICAgIGdldFdvcmxkVHJhbnNmb3JtVW50aWxSb290KGpvaW50LCB0aGlzLm5vZGUsIG00XzEpO1xyXG4gICAgICAgICAgICAgICAgTWF0NC5mcm9tUlRTKG00XzIsIHRhcmdldC5yb3RhdGlvbiwgdGFyZ2V0LnBvc2l0aW9uLCB0YXJnZXQuc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFNYXQ0LmVxdWFscyhtNF8yLCBtNF8xKSkgeyB0YXJnZXQubWF0cml4ID0gbTRfMTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3Qgc3RhdGVOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuX25hbWVUb1N0YXRlKSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX25hbWVUb1N0YXRlW3N0YXRlTmFtZV0gYXMgU2tlbGV0YWxBbmltYXRpb25TdGF0ZTtcclxuICAgICAgICAgICAgc3RhdGUucmVidWlsZFNvY2tldEN1cnZlcyh0aGlzLl9zb2NrZXRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVNvY2tldCAocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gdGhpcy5fc29ja2V0cy5maW5kKChzKSA9PiBzLnBhdGggPT09IHBhdGgpO1xyXG4gICAgICAgIGlmIChzb2NrZXQpIHsgcmV0dXJuIHNvY2tldC50YXJnZXQ7IH1cclxuICAgICAgICBjb25zdCBqb2ludCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5UGF0aChwYXRoKTtcclxuICAgICAgICBpZiAoIWpvaW50KSB7IGNvbnNvbGUud2FybignaWxsZWdhbCBzb2NrZXQgcGF0aCcpOyByZXR1cm4gbnVsbDsgfVxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IG5ldyBOb2RlKCk7XHJcbiAgICAgICAgdGFyZ2V0LnBhcmVudCA9IHRoaXMubm9kZTtcclxuICAgICAgICB0aGlzLl9zb2NrZXRzLnB1c2gobmV3IFNvY2tldChwYXRoLCB0YXJnZXQpKTtcclxuICAgICAgICB0aGlzLnJlYnVpbGRTb2NrZXRBbmltYXRpb25zKCk7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZVN0YXRlIChjbGlwOiBBbmltYXRpb25DbGlwLCBuYW1lPzogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTa2VsZXRhbEFuaW1hdGlvblN0YXRlKGNsaXAsIG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZG9DcmVhdGVTdGF0ZSAoY2xpcDogQW5pbWF0aW9uQ2xpcCwgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBzdXBlci5fZG9DcmVhdGVTdGF0ZShjbGlwLCBuYW1lKSBhcyBTa2VsZXRhbEFuaW1hdGlvblN0YXRlO1xyXG4gICAgICAgIHN0YXRlLnJlYnVpbGRTb2NrZXRDdXJ2ZXModGhpcy5fc29ja2V0cyk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==