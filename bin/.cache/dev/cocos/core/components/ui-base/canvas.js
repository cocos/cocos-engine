(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../3d/framework/camera-component.js", "../../assets/render-texture.js", "../../data/decorators/index.js", "../../director.js", "../../game.js", "../../gfx/define.js", "../../math/index.js", "../../platform/view.js", "../../platform/visible-rect.js", "../../scene-graph/node.js", "../../value-types/index.js", "../component.js", "./ui-transform.js", "../../default-constants.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../3d/framework/camera-component.js"), require("../../assets/render-texture.js"), require("../../data/decorators/index.js"), require("../../director.js"), require("../../game.js"), require("../../gfx/define.js"), require("../../math/index.js"), require("../../platform/view.js"), require("../../platform/visible-rect.js"), require("../../scene-graph/node.js"), require("../../value-types/index.js"), require("../component.js"), require("./ui-transform.js"), require("../../default-constants.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cameraComponent, global.renderTexture, global.index, global.director, global.game, global.define, global.index, global.view, global.visibleRect, global.node, global.index, global.component, global.uiTransform, global.defaultConstants, global.globalExports);
    global.canvas = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cameraComponent, _renderTexture, _index, _director, _game, _define, _index2, _view, _visibleRect, _node, _index3, _component, _uiTransform, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Canvas = void 0;
  _visibleRect = _interopRequireDefault(_visibleRect);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var _worldPos = new _index2.Vec3();

  var CanvasClearFlag = (0, _index3.Enum)({
    SOLID_COLOR: _define.GFXClearFlag.ALL,
    DEPTH_ONLY: _define.GFXClearFlag.DEPTH_STENCIL,
    DONT_CLEAR: _define.GFXClearFlag.NONE
  });
  var RenderMode = (0, _index3.Enum)({
    OVERLAY: 0,
    INTERSPERSE: 1
  });
  /**
   * @en
   * The root node of UI.
   * Provide an aligned window for all child nodes, also provides ease of setting screen adaptation policy interfaces from the editor.
   * Line-of-sight range is -999 to 1000.
   *
   * @zh
   * 作为 UI 根节点，为所有子节点提供对齐视窗，另外提供屏幕适配策略接口，方便从编辑器设置。
   * 注：由于本节点的尺寸会跟随屏幕拉伸，所以 anchorPoint 只支持 (0.5, 0.5)，否则适配不同屏幕时坐标会有偏差。
   * UI 的视距范围是 -999 ～ 1000.
   */

  var Canvas = (_dec = (0, _index.ccclass)('cc.Canvas'), _dec2 = (0, _index.help)('i18n:cc.Canvas'), _dec3 = (0, _index.executionOrder)(100), _dec4 = (0, _index.requireComponent)(_uiTransform.UITransform), _dec5 = (0, _index.menu)('UI/Canvas'), _dec6 = (0, _index.type)(CanvasClearFlag), _dec7 = (0, _index.tooltip)('清理屏幕缓冲标记'), _dec8 = (0, _index.tooltip)('清理颜色缓冲区后的颜色'), _dec9 = (0, _index.type)(RenderMode), _dec10 = (0, _index.tooltip)('Canvas 渲染模式，intersperse 下可以指定 Canvas 与场景中的相机的渲染顺序，overlay 下 Canvas 会在所有场景相机渲染完成后渲染。\n注意：注意：场景里的相机（包括 Canvas 内置的相机）必须有一个的 ClearFlag 选择 SOLID_COLOR，否则在移动端可能会出现闪屏'), _dec11 = (0, _index.tooltip)('相机排序优先级。当 RenderMode 为 intersperse 时，指定与其它相机的渲染顺序，当 RenderMode 为 overlay 时，指定跟其余 Canvas 做排序使用。需要对多 Canvas 设定 priority 以免出现不同平台下的闪屏问题。'), _dec12 = (0, _index.type)(_renderTexture.RenderTexture), _dec13 = (0, _index.tooltip)('目标渲染纹理'), _dec14 = (0, _index.type)(CanvasClearFlag), _dec15 = (0, _index.type)(RenderMode), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (0, _index.executeInEditMode)(_class = (0, _index.disallowMultiple)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(Canvas, _Component);

    _createClass(Canvas, [{
      key: "clearFlag",

      /**
       * @en
       * The flags to clear the built in camera.
       *
       * @zh
       * 清理屏幕缓冲标记。
       */
      get: function get() {
        return this._clearFlag;
      },
      set: function set(val) {
        this._clearFlag = val;

        if (this._camera) {
          this._camera.clearFlag = this._clearFlag;
        }
      }
      /**
       * @en
       * The color clearing value of the builtin camera.
       *
       * @zh
       * 内置相机的颜色缓冲默认值。
       */

    }, {
      key: "color",
      get: function get() {
        return this._color;
      },
      set: function set(val) {
        _index2.Color.copy(this._color, val);

        if (this._camera) {
          this._camera.clearColor = val;
        }
      }
      /**
       * @en
       * The render mode of Canvas.
       * When you choose the mode of INTERSPERSE, You can specify the rendering order of the Canvas with the camera in the scene.
       * When you choose the mode of OVERLAY, the builtin camera of Canvas will render after all scene cameras are rendered.
       * NOTE: The cameras in the scene (including the Canvas built-in camera) must have a ClearFlag selection of SOLID_COLOR,
       * otherwise a splash screen may appear on the mobile device.
       *
       * @zh
       * Canvas 渲染模式。
       * intersperse 下可以指定 Canvas 与场景中的相机的渲染顺序，overlay 下 Canvas 会在所有场景相机渲染完成后渲染。
       * 注意：场景里的相机（包括 Canvas 内置的相机）必须有一个的 ClearFlag 选择 SOLID_COLOR，否则在移动端可能会出现闪屏。
       */

    }, {
      key: "renderMode",
      get: function get() {
        return this._renderMode;
      },
      set: function set(val) {
        this._renderMode = val;

        if (this._camera) {
          this._camera.priority = this._getViewPriority();
        }
      }
      /**
       * @en
       * Camera render priority.
       * When you choose the RenderModel of INTERSPERSE, specifies the render order with other cameras.
       * When you choose the RenderModel of OVERLAY, specifies sorting with the rest of the Canvas.
       *
       * @zh
       * 相机渲染优先级。当 RenderMode 为 intersperse 时，指定与其它相机的渲染顺序，当 RenderMode 为 overlay 时，指定跟其余 Canvas 做排序使用。需要对多 Canvas 设定 priority 以免出现不同平台下的闪屏问题。
       *
       * @param value - 渲染优先级。
       */

    }, {
      key: "priority",
      get: function get() {
        return this._priority;
      },
      set: function set(val) {
        this._priority = val;

        if (this._camera) {
          this._camera.priority = this._getViewPriority();
        }

        if (_director.director.root && _director.director.root.ui) {
          _director.director.root.ui.sortScreens();
        }
      }
      /**
       * @en
       * Set the target render texture.
       *
       * @zh
       * 设置目标渲染纹理。
       */

    }, {
      key: "targetTexture",
      get: function get() {
        return this._targetTexture;
      },
      set: function set(value) {
        if (this._targetTexture === value) {
          return;
        }

        var old = this._targetTexture;
        this._targetTexture = value;

        this._checkTargetTextureEvent(old);

        this._updateTargetTexture();
      }
    }, {
      key: "visibility",
      get: function get() {
        if (this._camera) {
          return this._camera.view.visibility;
        }

        return -1;
      }
    }, {
      key: "camera",
      get: function get() {
        return this._camera;
      } // /**
      //  * @zh
      //  * 当前激活的画布组件，场景同一时间只能有一个激活的画布。
      //  */
      // public static instance: Canvas | null = null;

    }]);

    function Canvas() {
      var _this;

      _classCallCheck(this, Canvas);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Canvas).call(this));

      _initializerDefineProperty(_this, "_priority", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_targetTexture", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_clearFlag", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_color", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_renderMode", _descriptor5, _assertThisInitialized(_this));

      _this._thisOnResized = void 0;
      _this._camera = null;
      _this._pos = new _index2.Vec3();
      _this._thisOnResized = _this.alignWithScreen.bind(_assertThisInitialized(_this)); // // TODO:maybe remove when multiple scene
      // if (!Canvas.instance){
      //     Canvas.instance = this;
      // }

      return _this;
    }

    _createClass(Canvas, [{
      key: "__preload",
      value: function __preload() {
        var cameraNode = new _node.Node('UICamera_' + this.node.name);
        cameraNode.setPosition(0, 0, 1000);

        if (!_defaultConstants.EDITOR) {
          this._camera = _director.director.root.createCamera();

          this._camera.initialize({
            name: 'ui_' + this.node.name,
            node: cameraNode,
            projection: _cameraComponent.Camera.ProjectionType.ORTHO,
            priority: this._getViewPriority(),
            flows: ['UIFlow']
          });

          this._camera.fov = 45;
          this._camera.clearFlag = this.clearFlag;
          this._camera.farClip = 2000;
          this._camera.viewport = new _index2.Rect(0, 0, 1, 1);
          this.color = this._color;

          if (this._targetTexture) {
            var win = this._targetTexture.window;

            this._camera.changeTargetWindow(win);
          }
        }

        if (_defaultConstants.EDITOR) {
          _director.director.on(_director.Director.EVENT_AFTER_UPDATE, this.alignWithScreen, this); // In Editor can not edit these attrs.
          // (Position in Node, contentSize in uiTransform)
          // (anchor in uiTransform, but it can edit, this is different from cocos creator)


          this._objFlags |= _globalExports.legacyCC.Object.Flags.IsPositionLocked | _globalExports.legacyCC.Object.Flags.IsSizeLocked | _globalExports.legacyCC.Object.Flags.IsAnchorLocked;
        }

        _view.view.on('design-resolution-changed', this._thisOnResized); // this.applySettings();


        this.alignWithScreen();

        _director.director.root.ui.addScreen(this);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._camera) {
          _director.director.root.ui.renderScene.addCamera(this._camera);
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._camera) {
          _director.director.root.ui.renderScene.removeCamera(this._camera);
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _director.director.root.ui.removeScreen(this);

        if (this._camera) {
          _director.director.root.destroyCamera(this._camera);
        }

        if (_defaultConstants.EDITOR) {
          _director.director.off(_director.Director.EVENT_AFTER_UPDATE, this.alignWithScreen, this);
        }

        if (this._targetTexture) {
          this._targetTexture.off('resize');
        }

        _view.view.off('design-resolution-changed', this._thisOnResized); // if (Canvas.instance === this) {
        //     Canvas.instance = null;
        // }

      }
      /**
       * @en
       * Screen alignment.
       *
       * @zh
       * 屏幕对齐。
       */

    }, {
      key: "alignWithScreen",
      value: function alignWithScreen() {
        var nodeSize;
        var designSize;
        this.node.getPosition(this._pos);
        var visibleSize = _visibleRect.default;

        if (_defaultConstants.EDITOR) {
          // nodeSize = designSize = cc.engine.getDesignResolutionSize();
          nodeSize = designSize = _view.view.getDesignResolutionSize();

          _index2.Vec3.set(_worldPos, designSize.width * 0.5, designSize.height * 0.5, 1);
        } else {
          nodeSize = visibleSize;
          designSize = _view.view.getDesignResolutionSize();

          var policy = _view.view.getResolutionPolicy(); // const clipTopRight = !this.fitHeight && !this.fitWidth;


          var clipTopRight = policy === _globalExports.legacyCC.view._rpNoBorder;
          var offsetX = 0;
          var offsetY = 0;

          if (clipTopRight) {
            // offset the canvas to make it in the center of screen
            offsetX = (designSize.width - visibleSize.width) * 0.5;
            offsetY = (designSize.height - visibleSize.height) * 0.5;
          }

          _index2.Vec3.set(_worldPos, visibleSize.width * 0.5 + offsetX, visibleSize.height * 0.5 + offsetY, 0);
        }

        if (!this._pos.equals(_worldPos)) {
          this.node.setPosition(_worldPos);
        }

        var trans = this.node._uiProps.uiTransformComp;

        if (trans.width !== nodeSize.width) {
          trans.width = nodeSize.width;
        }

        if (trans.height !== nodeSize.height) {
          trans.height = nodeSize.height;
        }

        this.node.getWorldPosition(_worldPos);
        var camera = this._camera;

        if (camera) {
          if (this._targetTexture) {
            camera.setFixedSize(visibleSize.width, visibleSize.height);
            camera.orthoHeight = visibleSize.height / 2;
          } else {
            var size = _game.game.canvas;
            camera.resize(size.width, size.height);
            camera.orthoHeight = _game.game.canvas.height / _view.view.getScaleY() / 2;
          }

          camera.node.setPosition(_worldPos.x, _worldPos.y, 1000);
          camera.update();
        }
      }
    }, {
      key: "_checkTargetTextureEvent",
      value: function _checkTargetTextureEvent(old) {
        var _this2 = this;

        var resizeFunc = function resizeFunc(win) {
          if (_this2._camera) {
            _this2._camera.setFixedSize(win.width, win.height);
          }
        };

        if (old) {
          old.off('resize');
        }

        if (this._targetTexture) {
          this._targetTexture.on('resize', resizeFunc, this);
        }
      }
    }, {
      key: "_updateTargetTexture",
      value: function _updateTargetTexture() {
        if (!this._camera) {
          return;
        }

        var camera = this._camera;

        if (!this._targetTexture) {
          camera.changeTargetWindow();
          camera.orthoHeight = _game.game.canvas.height / _view.view.getScaleY() / 2;
          camera.isWindowSize = true;
        } else {
          var win = this._targetTexture.window;
          camera.changeTargetWindow(win);
          camera.orthoHeight = _visibleRect.default.height / 2;
          camera.isWindowSize = false;
        }
      }
    }, {
      key: "_getViewPriority",
      value: function _getViewPriority() {
        return this._renderMode === RenderMode.OVERLAY ? this._priority | 1 << 30 : this._priority;
      }
    }]);

    return Canvas;
  }(_component.Component), _temp), (_applyDecoratedDescriptor(_class2.prototype, "clearFlag", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "clearFlag"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "color", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "renderMode", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "renderMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "priority", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "priority"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "targetTexture", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "targetTexture"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_priority", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_targetTexture", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_clearFlag", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return CanvasClearFlag.DEPTH_ONLY;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_color", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Color(0, 0, 0, 0);
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_renderMode", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return RenderMode.OVERLAY;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
  _exports.Canvas = Canvas;
  _globalExports.legacyCC.Canvas = Canvas;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL2NhbnZhcy50cyJdLCJuYW1lcyI6WyJfd29ybGRQb3MiLCJWZWMzIiwiQ2FudmFzQ2xlYXJGbGFnIiwiU09MSURfQ09MT1IiLCJHRlhDbGVhckZsYWciLCJBTEwiLCJERVBUSF9PTkxZIiwiREVQVEhfU1RFTkNJTCIsIkRPTlRfQ0xFQVIiLCJOT05FIiwiUmVuZGVyTW9kZSIsIk9WRVJMQVkiLCJJTlRFUlNQRVJTRSIsIkNhbnZhcyIsIlVJVHJhbnNmb3JtIiwiUmVuZGVyVGV4dHVyZSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiZGlzYWxsb3dNdWx0aXBsZSIsIl9jbGVhckZsYWciLCJ2YWwiLCJfY2FtZXJhIiwiY2xlYXJGbGFnIiwiX2NvbG9yIiwiQ29sb3IiLCJjb3B5IiwiY2xlYXJDb2xvciIsIl9yZW5kZXJNb2RlIiwicHJpb3JpdHkiLCJfZ2V0Vmlld1ByaW9yaXR5IiwiX3ByaW9yaXR5IiwiZGlyZWN0b3IiLCJyb290IiwidWkiLCJzb3J0U2NyZWVucyIsIl90YXJnZXRUZXh0dXJlIiwidmFsdWUiLCJvbGQiLCJfY2hlY2tUYXJnZXRUZXh0dXJlRXZlbnQiLCJfdXBkYXRlVGFyZ2V0VGV4dHVyZSIsInZpZXciLCJ2aXNpYmlsaXR5IiwiX3RoaXNPblJlc2l6ZWQiLCJfcG9zIiwiYWxpZ25XaXRoU2NyZWVuIiwiYmluZCIsImNhbWVyYU5vZGUiLCJOb2RlIiwibm9kZSIsIm5hbWUiLCJzZXRQb3NpdGlvbiIsIkVESVRPUiIsImNyZWF0ZUNhbWVyYSIsImluaXRpYWxpemUiLCJwcm9qZWN0aW9uIiwiQ2FtZXJhIiwiUHJvamVjdGlvblR5cGUiLCJPUlRITyIsImZsb3dzIiwiZm92IiwiZmFyQ2xpcCIsInZpZXdwb3J0IiwiUmVjdCIsImNvbG9yIiwid2luIiwid2luZG93IiwiY2hhbmdlVGFyZ2V0V2luZG93Iiwib24iLCJEaXJlY3RvciIsIkVWRU5UX0FGVEVSX1VQREFURSIsIl9vYmpGbGFncyIsImxlZ2FjeUNDIiwiT2JqZWN0IiwiRmxhZ3MiLCJJc1Bvc2l0aW9uTG9ja2VkIiwiSXNTaXplTG9ja2VkIiwiSXNBbmNob3JMb2NrZWQiLCJhZGRTY3JlZW4iLCJyZW5kZXJTY2VuZSIsImFkZENhbWVyYSIsInJlbW92ZUNhbWVyYSIsInJlbW92ZVNjcmVlbiIsImRlc3Ryb3lDYW1lcmEiLCJvZmYiLCJub2RlU2l6ZSIsImRlc2lnblNpemUiLCJnZXRQb3NpdGlvbiIsInZpc2libGVTaXplIiwidmlzaWJsZVJlY3QiLCJnZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSIsInNldCIsIndpZHRoIiwiaGVpZ2h0IiwicG9saWN5IiwiZ2V0UmVzb2x1dGlvblBvbGljeSIsImNsaXBUb3BSaWdodCIsIl9ycE5vQm9yZGVyIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJlcXVhbHMiLCJ0cmFucyIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwiZ2V0V29ybGRQb3NpdGlvbiIsImNhbWVyYSIsInNldEZpeGVkU2l6ZSIsIm9ydGhvSGVpZ2h0Iiwic2l6ZSIsImdhbWUiLCJjYW52YXMiLCJyZXNpemUiLCJnZXRTY2FsZVkiLCJ4IiwieSIsInVwZGF0ZSIsInJlc2l6ZUZ1bmMiLCJpc1dpbmRvd1NpemUiLCJDb21wb25lbnQiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnREEsTUFBTUEsU0FBUyxHQUFHLElBQUlDLFlBQUosRUFBbEI7O0FBRUEsTUFBTUMsZUFBZSxHQUFHLGtCQUFLO0FBQ3pCQyxJQUFBQSxXQUFXLEVBQUVDLHFCQUFhQyxHQUREO0FBRXpCQyxJQUFBQSxVQUFVLEVBQUVGLHFCQUFhRyxhQUZBO0FBR3pCQyxJQUFBQSxVQUFVLEVBQUVKLHFCQUFhSztBQUhBLEdBQUwsQ0FBeEI7QUFNQSxNQUFNQyxVQUFVLEdBQUcsa0JBQUs7QUFDcEJDLElBQUFBLE9B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dEJxRSxVQUFBQSxNQUFNLENBQUN0QyxrQkFBUDtBQUNBc0MsVUFBQUEsTUFBTSxDQUFDRSxXQUFQLEdBQXFCRSxXQUFLQyxNQUFMLENBQWFqQixNQUFiLEdBQXNCcEQsV0FBS3VFLFNBQUwsRUFBdEIsR0FBeUMsQ0FBOUQ7QUFDQVAsVUFBQUEsTUFBTSxDQUFDWSxZQUFQLEdBQXNCLElBQXRCO0FBQ0gsU0FKRCxNQUlPO0FBQ0gsY0FBTXBELEdBQUcsR0FBRyxLQUFLN0IsY0FBTCxDQUFvQjhCLE1BQWhDO0FBQ0F1QyxVQUFBQSxNQUFNLENBQUN0QyxrQkFBUCxDQUEwQkYsR0FBMUI7QUFDQXdDLFVBQUFBLE1BQU0sQ0FBQ0UsV0FBUCxHQUFxQmxCLHFCQUFZSSxNQUFaLEdBQXFCLENBQTFDO0FBQ0FZLFVBQUFBLE1BQU0sQ0FBQ1ksWUFBUCxHQUFzQixLQUF0QjtBQUNIO0FBQ0o7Ozt5Q0FFMkI7QUFDeEIsZUFBTyxLQUFLekYsV0FBTCxLQUFxQmhCLFVBQVUsQ0FBQ0MsT0FBaEMsR0FBMEMsS0FBS2tCLFNBQUwsR0FBaUIsS0FBSyxFQUFoRSxHQUFxRSxLQUFLQSxTQUFqRjtBQUNIOzs7O0lBN1V1QnVGLG9CLHMyQkF1SXZCQyxtQjs7Ozs7YUFDcUIsQzs7cUZBQ3JCQSxtQjs7Ozs7YUFDZ0QsSTs7Ozs7OzthQUUxQm5ILGVBQWUsQ0FBQ0ksVTs7NkVBQ3RDK0csbUI7Ozs7O2FBQ2tCLElBQUk5RixhQUFKLENBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQzs7Ozs7OzthQUVLYixVQUFVLENBQUNDLE87Ozs7QUFnTXZDMkQsMEJBQVN6RCxNQUFULEdBQWtCQSxNQUFsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBDYW1lcmEgfSBmcm9tICcuLi8uLi8zZC9mcmFtZXdvcmsvY2FtZXJhLWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFJlbmRlclRleHR1cmUgfSBmcm9tICcuLi8uLi9hc3NldHMvcmVuZGVyLXRleHR1cmUnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBkaXNhbGxvd011bHRpcGxlLCBleGVjdXRlSW5FZGl0TW9kZSwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHJlcXVpcmVDb21wb25lbnQsIHRvb2x0aXAsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IGRpcmVjdG9yLCBEaXJlY3RvciB9IGZyb20gJy4uLy4uL2RpcmVjdG9yJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uL2dhbWUnO1xyXG5pbXBvcnQgeyBHRlhDbGVhckZsYWcgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgQ29sb3IsIFZlYzMsIFJlY3QgfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgdmlldyB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL3ZpZXcnO1xyXG5pbXBvcnQgdmlzaWJsZVJlY3QgZnJvbSAnLi4vLi4vcGxhdGZvcm0vdmlzaWJsZS1yZWN0JztcclxuaW1wb3J0IHsgc2NlbmUgfSBmcm9tICcuLi8uLi9yZW5kZXJlcic7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaC9ub2RlJztcclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uLy4uL3ZhbHVlLXR5cGVzJztcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50JztcclxuaW1wb3J0IHsgVUlUcmFuc2Zvcm0gfSBmcm9tICcuL3VpLXRyYW5zZm9ybSc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBSZW5kZXJXaW5kb3cgfSBmcm9tICcuLi8uLi9yZW5kZXJlci9jb3JlL3JlbmRlci13aW5kb3cnO1xyXG5cclxuY29uc3QgX3dvcmxkUG9zID0gbmV3IFZlYzMoKTtcclxuXHJcbmNvbnN0IENhbnZhc0NsZWFyRmxhZyA9IEVudW0oe1xyXG4gICAgU09MSURfQ09MT1I6IEdGWENsZWFyRmxhZy5BTEwsXHJcbiAgICBERVBUSF9PTkxZOiBHRlhDbGVhckZsYWcuREVQVEhfU1RFTkNJTCxcclxuICAgIERPTlRfQ0xFQVI6IEdGWENsZWFyRmxhZy5OT05FLFxyXG59KTtcclxuXHJcbmNvbnN0IFJlbmRlck1vZGUgPSBFbnVtKHtcclxuICAgIE9WRVJMQVk6IDAsXHJcbiAgICBJTlRFUlNQRVJTRTogMSxcclxufSk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSByb290IG5vZGUgb2YgVUkuXHJcbiAqIFByb3ZpZGUgYW4gYWxpZ25lZCB3aW5kb3cgZm9yIGFsbCBjaGlsZCBub2RlcywgYWxzbyBwcm92aWRlcyBlYXNlIG9mIHNldHRpbmcgc2NyZWVuIGFkYXB0YXRpb24gcG9saWN5IGludGVyZmFjZXMgZnJvbSB0aGUgZWRpdG9yLlxyXG4gKiBMaW5lLW9mLXNpZ2h0IHJhbmdlIGlzIC05OTkgdG8gMTAwMC5cclxuICpcclxuICogQHpoXHJcbiAqIOS9nOS4uiBVSSDmoLnoioLngrnvvIzkuLrmiYDmnInlrZDoioLngrnmj5Dkvpvlr7npvZDop4bnqpfvvIzlj6blpJbmj5DkvpvlsY/luZXpgILphY3nrZbnlaXmjqXlj6PvvIzmlrnkvr/ku47nvJbovpHlmajorr7nva7jgIJcclxuICog5rOo77ya55Sx5LqO5pys6IqC54K555qE5bC65a+45Lya6Lef6ZqP5bGP5bmV5ouJ5Ly477yM5omA5LulIGFuY2hvclBvaW50IOWPquaUr+aMgSAoMC41LCAwLjUp77yM5ZCm5YiZ6YCC6YWN5LiN5ZCM5bGP5bmV5pe25Z2Q5qCH5Lya5pyJ5YGP5beu44CCXHJcbiAqIFVJIOeahOinhui3neiMg+WbtOaYryAtOTk5IO+9niAxMDAwLlxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkNhbnZhcycpXHJcbkBoZWxwKCdpMThuOmNjLkNhbnZhcycpXHJcbkBleGVjdXRpb25PcmRlcigxMDApXHJcbkByZXF1aXJlQ29tcG9uZW50KFVJVHJhbnNmb3JtKVxyXG5AbWVudSgnVUkvQ2FudmFzJylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbkBkaXNhbGxvd011bHRpcGxlXHJcbmV4cG9ydCBjbGFzcyBDYW52YXMgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBmbGFncyB0byBjbGVhciB0aGUgYnVpbHQgaW4gY2FtZXJhLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5riF55CG5bGP5bmV57yT5Yay5qCH6K6w44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKENhbnZhc0NsZWFyRmxhZylcclxuICAgIEB0b29sdGlwKCfmuIXnkIblsY/luZXnvJPlhrLmoIforrAnKVxyXG4gICAgZ2V0IGNsZWFyRmxhZyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsZWFyRmxhZztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2xlYXJGbGFnICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9jbGVhckZsYWcgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY2xlYXJGbGFnID0gdGhpcy5fY2xlYXJGbGFnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGNvbG9yIGNsZWFyaW5nIHZhbHVlIG9mIHRoZSBidWlsdGluIGNhbWVyYS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWGhee9ruebuOacuueahOminOiJsue8k+WGsum7mOiupOWAvOOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5riF55CG6aKc6Imy57yT5Yay5Yy65ZCO55qE6aKc6ImyJylcclxuICAgIGdldCBjb2xvciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb2xvciAodmFsKSB7XHJcbiAgICAgICAgQ29sb3IuY29weSh0aGlzLl9jb2xvciwgdmFsKTtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5jbGVhckNvbG9yID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHJlbmRlciBtb2RlIG9mIENhbnZhcy5cclxuICAgICAqIFdoZW4geW91IGNob29zZSB0aGUgbW9kZSBvZiBJTlRFUlNQRVJTRSwgWW91IGNhbiBzcGVjaWZ5IHRoZSByZW5kZXJpbmcgb3JkZXIgb2YgdGhlIENhbnZhcyB3aXRoIHRoZSBjYW1lcmEgaW4gdGhlIHNjZW5lLlxyXG4gICAgICogV2hlbiB5b3UgY2hvb3NlIHRoZSBtb2RlIG9mIE9WRVJMQVksIHRoZSBidWlsdGluIGNhbWVyYSBvZiBDYW52YXMgd2lsbCByZW5kZXIgYWZ0ZXIgYWxsIHNjZW5lIGNhbWVyYXMgYXJlIHJlbmRlcmVkLlxyXG4gICAgICogTk9URTogVGhlIGNhbWVyYXMgaW4gdGhlIHNjZW5lIChpbmNsdWRpbmcgdGhlIENhbnZhcyBidWlsdC1pbiBjYW1lcmEpIG11c3QgaGF2ZSBhIENsZWFyRmxhZyBzZWxlY3Rpb24gb2YgU09MSURfQ09MT1IsXHJcbiAgICAgKiBvdGhlcndpc2UgYSBzcGxhc2ggc2NyZWVuIG1heSBhcHBlYXIgb24gdGhlIG1vYmlsZSBkZXZpY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiBDYW52YXMg5riy5p+T5qih5byP44CCXHJcbiAgICAgKiBpbnRlcnNwZXJzZSDkuIvlj6/ku6XmjIflrpogQ2FudmFzIOS4juWcuuaZr+S4reeahOebuOacuueahOa4suafk+mhuuW6j++8jG92ZXJsYXkg5LiLIENhbnZhcyDkvJrlnKjmiYDmnInlnLrmma/nm7jmnLrmuLLmn5PlrozmiJDlkI7muLLmn5PjgIJcclxuICAgICAqIOazqOaEj++8muWcuuaZr+mHjOeahOebuOacuu+8iOWMheaLrCBDYW52YXMg5YaF572u55qE55u45py677yJ5b+F6aG75pyJ5LiA5Liq55qEIENsZWFyRmxhZyDpgInmi6kgU09MSURfQ09MT1LvvIzlkKbliJnlnKjnp7vliqjnq6/lj6/og73kvJrlh7rnjrDpl6rlsY/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoUmVuZGVyTW9kZSlcclxuICAgIEB0b29sdGlwKCdDYW52YXMg5riy5p+T5qih5byP77yMaW50ZXJzcGVyc2Ug5LiL5Y+v5Lul5oyH5a6aIENhbnZhcyDkuI7lnLrmma/kuK3nmoTnm7jmnLrnmoTmuLLmn5Ppobrluo/vvIxvdmVybGF5IOS4iyBDYW52YXMg5Lya5Zyo5omA5pyJ5Zy65pmv55u45py65riy5p+T5a6M5oiQ5ZCO5riy5p+T44CCXFxu5rOo5oSP77ya5rOo5oSP77ya5Zy65pmv6YeM55qE55u45py677yI5YyF5ousIENhbnZhcyDlhoXnva7nmoTnm7jmnLrvvInlv4XpobvmnInkuIDkuKrnmoQgQ2xlYXJGbGFnIOmAieaLqSBTT0xJRF9DT0xPUu+8jOWQpuWImeWcqOenu+WKqOerr+WPr+iDveS8muWHuueOsOmXquWxjycpXHJcbiAgICBnZXQgcmVuZGVyTW9kZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlck1vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJlbmRlck1vZGUgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlck1vZGUgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEucHJpb3JpdHkgPSB0aGlzLl9nZXRWaWV3UHJpb3JpdHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENhbWVyYSByZW5kZXIgcHJpb3JpdHkuXHJcbiAgICAgKiBXaGVuIHlvdSBjaG9vc2UgdGhlIFJlbmRlck1vZGVsIG9mIElOVEVSU1BFUlNFLCBzcGVjaWZpZXMgdGhlIHJlbmRlciBvcmRlciB3aXRoIG90aGVyIGNhbWVyYXMuXHJcbiAgICAgKiBXaGVuIHlvdSBjaG9vc2UgdGhlIFJlbmRlck1vZGVsIG9mIE9WRVJMQVksIHNwZWNpZmllcyBzb3J0aW5nIHdpdGggdGhlIHJlc3Qgb2YgdGhlIENhbnZhcy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOebuOacuua4suafk+S8mOWFiOe6p+OAguW9kyBSZW5kZXJNb2RlIOS4uiBpbnRlcnNwZXJzZSDml7bvvIzmjIflrprkuI7lhbblroPnm7jmnLrnmoTmuLLmn5Ppobrluo/vvIzlvZMgUmVuZGVyTW9kZSDkuLogb3ZlcmxheSDml7bvvIzmjIflrprot5/lhbbkvZkgQ2FudmFzIOWBmuaOkuW6j+S9v+eUqOOAgumcgOimgeWvueWkmiBDYW52YXMg6K6+5a6aIHByaW9yaXR5IOS7peWFjeWHuueOsOS4jeWQjOW5s+WPsOS4i+eahOmXquWxj+mXrumimOOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIOa4suafk+S8mOWFiOe6p+OAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn55u45py65o6S5bqP5LyY5YWI57qn44CC5b2TIFJlbmRlck1vZGUg5Li6IGludGVyc3BlcnNlIOaXtu+8jOaMh+WumuS4juWFtuWug+ebuOacuueahOa4suafk+mhuuW6j++8jOW9kyBSZW5kZXJNb2RlIOS4uiBvdmVybGF5IOaXtu+8jOaMh+Wumui3n+WFtuS9mSBDYW52YXMg5YGa5o6S5bqP5L2/55So44CC6ZyA6KaB5a+55aSaIENhbnZhcyDorr7lrpogcHJpb3JpdHkg5Lul5YWN5Ye6546w5LiN5ZCM5bmz5Y+w5LiL55qE6Zeq5bGP6Zeu6aKY44CCJylcclxuICAgIGdldCBwcmlvcml0eSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByaW9yaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwcmlvcml0eSAodmFsOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9wcmlvcml0eSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5wcmlvcml0eSA9IHRoaXMuX2dldFZpZXdQcmlvcml0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRpcmVjdG9yLnJvb3QgJiYgZGlyZWN0b3Iucm9vdC51aSl7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yLnJvb3QudWkuc29ydFNjcmVlbnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldCB0aGUgdGFyZ2V0IHJlbmRlciB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u55uu5qCH5riy5p+T57q555CG44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFJlbmRlclRleHR1cmUpXHJcbiAgICBAdG9vbHRpcCgn55uu5qCH5riy5p+T57q555CGJylcclxuICAgIGdldCB0YXJnZXRUZXh0dXJlICgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90YXJnZXRUZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0YXJnZXRUZXh0dXJlICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRUZXh0dXJlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLl90YXJnZXRUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldFRleHR1cmUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9jaGVja1RhcmdldFRleHR1cmVFdmVudChvbGQpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVRhcmdldFRleHR1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlzaWJpbGl0eSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhLnZpZXcudmlzaWJpbGl0eTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2FtZXJhICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC8qKlxyXG4gICAgLy8gICogQHpoXHJcbiAgICAvLyAgKiDlvZPliY3mv4DmtLvnmoTnlLvluIPnu4Tku7bvvIzlnLrmma/lkIzkuIDml7bpl7Tlj6rog73mnInkuIDkuKrmv4DmtLvnmoTnlLvluIPjgIJcclxuICAgIC8vICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBpbnN0YW5jZTogQ2FudmFzIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9wcmlvcml0eSA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3RhcmdldFRleHR1cmU6IFJlbmRlclRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuICAgIEB0eXBlKENhbnZhc0NsZWFyRmxhZylcclxuICAgIHByb3RlY3RlZCBfY2xlYXJGbGFnID0gQ2FudmFzQ2xlYXJGbGFnLkRFUFRIX09OTFk7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2NvbG9yID0gbmV3IENvbG9yKDAsIDAsIDAsIDApO1xyXG4gICAgQHR5cGUoUmVuZGVyTW9kZSlcclxuICAgIHByb3RlY3RlZCBfcmVuZGVyTW9kZSA9IFJlbmRlck1vZGUuT1ZFUkxBWTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3RoaXNPblJlc2l6ZWQ6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYW1lcmE6IHNjZW5lLkNhbWVyYSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcG9zID0gbmV3IFZlYzMoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl90aGlzT25SZXNpemVkID0gdGhpcy5hbGlnbldpdGhTY3JlZW4uYmluZCh0aGlzKTtcclxuICAgICAgICAvLyAvLyBUT0RPOm1heWJlIHJlbW92ZSB3aGVuIG11bHRpcGxlIHNjZW5lXHJcbiAgICAgICAgLy8gaWYgKCFDYW52YXMuaW5zdGFuY2Upe1xyXG4gICAgICAgIC8vICAgICBDYW52YXMuaW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX19wcmVsb2FkICgpIHtcclxuICAgICAgICBjb25zdCBjYW1lcmFOb2RlID0gbmV3IE5vZGUoJ1VJQ2FtZXJhXycgKyB0aGlzLm5vZGUubmFtZSk7XHJcbiAgICAgICAgY2FtZXJhTm9kZS5zZXRQb3NpdGlvbigwLCAwLCAxMDAwKTtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEgPSBkaXJlY3Rvci5yb290IS5jcmVhdGVDYW1lcmEoKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmluaXRpYWxpemUoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3VpXycgKyB0aGlzLm5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgIG5vZGU6IGNhbWVyYU5vZGUsXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uOiBDYW1lcmEuUHJvamVjdGlvblR5cGUuT1JUSE8sXHJcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogdGhpcy5fZ2V0Vmlld1ByaW9yaXR5KCksXHJcbiAgICAgICAgICAgICAgICBmbG93czogWydVSUZsb3cnXSxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuZm92ID0gNDU7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5jbGVhckZsYWcgPSB0aGlzLmNsZWFyRmxhZztcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmZhckNsaXAgPSAyMDAwO1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEudmlld3BvcnQgPSBuZXcgUmVjdCgwLCAwLCAxLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5jb2xvciA9IHRoaXMuX2NvbG9yO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RhcmdldFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdpbiA9IHRoaXMuX3RhcmdldFRleHR1cmUud2luZG93O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmNoYW5nZVRhcmdldFdpbmRvdyh3aW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yLm9uKERpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgdGhpcy5hbGlnbldpdGhTY3JlZW4sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW4gRWRpdG9yIGNhbiBub3QgZWRpdCB0aGVzZSBhdHRycy5cclxuICAgICAgICAgICAgLy8gKFBvc2l0aW9uIGluIE5vZGUsIGNvbnRlbnRTaXplIGluIHVpVHJhbnNmb3JtKVxyXG4gICAgICAgICAgICAvLyAoYW5jaG9yIGluIHVpVHJhbnNmb3JtLCBidXQgaXQgY2FuIGVkaXQsIHRoaXMgaXMgZGlmZmVyZW50IGZyb20gY29jb3MgY3JlYXRvcilcclxuICAgICAgICAgICAgdGhpcy5fb2JqRmxhZ3MgfD0gbGVnYWN5Q0MuT2JqZWN0LkZsYWdzLklzUG9zaXRpb25Mb2NrZWQgfCBsZWdhY3lDQy5PYmplY3QuRmxhZ3MuSXNTaXplTG9ja2VkIHwgbGVnYWN5Q0MuT2JqZWN0LkZsYWdzLklzQW5jaG9yTG9ja2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmlldy5vbignZGVzaWduLXJlc29sdXRpb24tY2hhbmdlZCcsIHRoaXMuX3RoaXNPblJlc2l6ZWQpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLmFwcGx5U2V0dGluZ3MoKTtcclxuICAgICAgICB0aGlzLmFsaWduV2l0aFNjcmVlbigpO1xyXG5cclxuICAgICAgICBkaXJlY3Rvci5yb290IS51aS5hZGRTY3JlZW4odGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yLnJvb3QhLnVpLnJlbmRlclNjZW5lLmFkZENhbWVyYSh0aGlzLl9jYW1lcmEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yLnJvb3QhLnVpLnJlbmRlclNjZW5lLnJlbW92ZUNhbWVyYSh0aGlzLl9jYW1lcmEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBkaXJlY3Rvci5yb290IS51aS5yZW1vdmVTY3JlZW4odGhpcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICBkaXJlY3Rvci5yb290IS5kZXN0cm95Q2FtZXJhKHRoaXMuX2NhbWVyYSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yLm9mZihEaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIHRoaXMuYWxpZ25XaXRoU2NyZWVuLCB0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldFRleHR1cmUub2ZmKCdyZXNpemUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZpZXcub2ZmKCdkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkJywgdGhpcy5fdGhpc09uUmVzaXplZCk7XHJcbiAgICAgICAgLy8gaWYgKENhbnZhcy5pbnN0YW5jZSA9PT0gdGhpcykge1xyXG4gICAgICAgIC8vICAgICBDYW52YXMuaW5zdGFuY2UgPSBudWxsO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2NyZWVuIGFsaWdubWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWxj+W5leWvuem9kOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWxpZ25XaXRoU2NyZWVuICgpIHtcclxuICAgICAgICBsZXQgbm9kZVNpemU7XHJcbiAgICAgICAgbGV0IGRlc2lnblNpemU7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldFBvc2l0aW9uKHRoaXMuX3Bvcyk7XHJcbiAgICAgICAgY29uc3QgdmlzaWJsZVNpemUgPSB2aXNpYmxlUmVjdDtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIC8vIG5vZGVTaXplID0gZGVzaWduU2l6ZSA9IGNjLmVuZ2luZS5nZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSgpO1xyXG4gICAgICAgICAgICBub2RlU2l6ZSA9IGRlc2lnblNpemUgPSB2aWV3LmdldERlc2lnblJlc29sdXRpb25TaXplKCk7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KF93b3JsZFBvcywgZGVzaWduU2l6ZS53aWR0aCAqIDAuNSwgZGVzaWduU2l6ZS5oZWlnaHQgKiAwLjUsIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGVTaXplID0gdmlzaWJsZVNpemU7XHJcbiAgICAgICAgICAgIGRlc2lnblNpemUgPSB2aWV3LmdldERlc2lnblJlc29sdXRpb25TaXplKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvbGljeSA9IHZpZXcuZ2V0UmVzb2x1dGlvblBvbGljeSgpO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBjbGlwVG9wUmlnaHQgPSAhdGhpcy5maXRIZWlnaHQgJiYgIXRoaXMuZml0V2lkdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaXBUb3BSaWdodCA9IHBvbGljeSA9PT0gbGVnYWN5Q0Mudmlldy5fcnBOb0JvcmRlcjtcclxuICAgICAgICAgICAgbGV0IG9mZnNldFggPSAwO1xyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XHJcbiAgICAgICAgICAgIGlmIChjbGlwVG9wUmlnaHQpIHtcclxuICAgICAgICAgICAgICAgIC8vIG9mZnNldCB0aGUgY2FudmFzIHRvIG1ha2UgaXQgaW4gdGhlIGNlbnRlciBvZiBzY3JlZW5cclxuICAgICAgICAgICAgICAgIG9mZnNldFggPSAoZGVzaWduU2l6ZS53aWR0aCAtIHZpc2libGVTaXplLndpZHRoKSAqIDAuNTtcclxuICAgICAgICAgICAgICAgIG9mZnNldFkgPSAoZGVzaWduU2l6ZS5oZWlnaHQgLSB2aXNpYmxlU2l6ZS5oZWlnaHQpICogMC41O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBWZWMzLnNldChfd29ybGRQb3MsIHZpc2libGVTaXplLndpZHRoICogMC41ICsgb2Zmc2V0WCwgdmlzaWJsZVNpemUuaGVpZ2h0ICogMC41ICsgb2Zmc2V0WSwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX3Bvcy5lcXVhbHMoX3dvcmxkUG9zKSkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0UG9zaXRpb24oX3dvcmxkUG9zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgaWYgKHRyYW5zLndpZHRoICE9PSBub2RlU2l6ZS53aWR0aCkge1xyXG4gICAgICAgICAgICB0cmFucy53aWR0aCA9IG5vZGVTaXplLndpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRyYW5zLmhlaWdodCAhPT0gbm9kZVNpemUuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRyYW5zLmhlaWdodCA9IG5vZGVTaXplLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5nZXRXb3JsZFBvc2l0aW9uKF93b3JsZFBvcyk7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gdGhpcy5fY2FtZXJhO1xyXG4gICAgICAgIGlmIChjYW1lcmEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RhcmdldFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5zZXRGaXhlZFNpemUodmlzaWJsZVNpemUud2lkdGgsIHZpc2libGVTaXplLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEub3J0aG9IZWlnaHQgPSB2aXNpYmxlU2l6ZS5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IGdhbWUuY2FudmFzITtcclxuICAgICAgICAgICAgICAgIGNhbWVyYS5yZXNpemUoc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLm9ydGhvSGVpZ2h0ID0gZ2FtZS5jYW52YXMhLmhlaWdodCAvIHZpZXcuZ2V0U2NhbGVZKCkgLyAyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYW1lcmEubm9kZS5zZXRQb3NpdGlvbihfd29ybGRQb3MueCwgX3dvcmxkUG9zLnksIDEwMDApO1xyXG4gICAgICAgICAgICBjYW1lcmEudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2hlY2tUYXJnZXRUZXh0dXJlRXZlbnQgKG9sZDogUmVuZGVyVGV4dHVyZSB8IG51bGwpIHtcclxuICAgICAgICBjb25zdCByZXNpemVGdW5jID0gKHdpbjogUmVuZGVyV2luZG93KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5zZXRGaXhlZFNpemUod2luLndpZHRoLCB3aW4uaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLm9mZigncmVzaXplJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0VGV4dHVyZSkge1xyXG4gICAgICAgICAgICB0aGlzLl90YXJnZXRUZXh0dXJlLm9uKCdyZXNpemUnLCByZXNpemVGdW5jLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVUYXJnZXRUZXh0dXJlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLl9jYW1lcmE7XHJcbiAgICAgICAgaWYgKCF0aGlzLl90YXJnZXRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYS5jaGFuZ2VUYXJnZXRXaW5kb3coKTtcclxuICAgICAgICAgICAgY2FtZXJhLm9ydGhvSGVpZ2h0ID0gZ2FtZS5jYW52YXMhLmhlaWdodCAvIHZpZXcuZ2V0U2NhbGVZKCkgLyAyO1xyXG4gICAgICAgICAgICBjYW1lcmEuaXNXaW5kb3dTaXplID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB3aW4gPSB0aGlzLl90YXJnZXRUZXh0dXJlLndpbmRvdztcclxuICAgICAgICAgICAgY2FtZXJhLmNoYW5nZVRhcmdldFdpbmRvdyh3aW4pO1xyXG4gICAgICAgICAgICBjYW1lcmEub3J0aG9IZWlnaHQgPSB2aXNpYmxlUmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICBjYW1lcmEuaXNXaW5kb3dTaXplID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFZpZXdQcmlvcml0eSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlck1vZGUgPT09IFJlbmRlck1vZGUuT1ZFUkxBWSA/IHRoaXMuX3ByaW9yaXR5IHwgMSA8PCAzMCA6IHRoaXMuX3ByaW9yaXR5O1xyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5DYW52YXMgPSBDYW52YXM7XHJcbiJdfQ==