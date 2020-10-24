(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "../../assets/render-texture.js", "../../components/component.js", "../../data/decorators/index.js", "../../geometry/index.js", "../../gfx/define.js", "../../math/index.js", "../../pipeline/define.js", "../../platform/view.js", "../../renderer/scene/camera.js", "../../scene-graph/layers.js", "../../value-types/index.js", "../../scene-graph/node-enum.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("../../assets/render-texture.js"), require("../../components/component.js"), require("../../data/decorators/index.js"), require("../../geometry/index.js"), require("../../gfx/define.js"), require("../../math/index.js"), require("../../pipeline/define.js"), require("../../platform/view.js"), require("../../renderer/scene/camera.js"), require("../../scene-graph/layers.js"), require("../../value-types/index.js"), require("../../scene-graph/node-enum.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.renderTexture, global.component, global.index, global.index, global.define, global.index, global.define, global.view, global.camera, global.layers, global.index, global.nodeEnum, global.globalExports);
    global.cameraComponent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _renderTexture, _component, _index, _index2, _define, _index3, _define2, _view, _camera, _layers, _index4, _nodeEnum, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Camera = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var _temp_vec3_1 = new _index3.Vec3();
  /**
   * @en The projection type.
   * @zh 投影类型。
   */


  var ProjectionType = (0, _index4.Enum)(_camera.CameraProjection);
  var FOVAxis = (0, _index4.Enum)(_camera.CameraFOVAxis);
  var Aperture = (0, _index4.Enum)(_camera.CameraAperture);
  var Shutter = (0, _index4.Enum)(_camera.CameraShutter);
  var ISO = (0, _index4.Enum)(_camera.CameraISO);
  var ClearFlag = (0, _index4.Enum)({
    SKYBOX: _camera.SKYBOX_FLAG | _define.GFXClearFlag.DEPTH_STENCIL,
    SOLID_COLOR: _define.GFXClearFlag.ALL,
    DEPTH_ONLY: _define.GFXClearFlag.DEPTH_STENCIL,
    DONT_CLEAR: _define.GFXClearFlag.NONE
  }); // tslint:disable: no-shadowed-variable

  // tslint:enable: no-shadowed-variable

  /**
   * @en The Camera Component.
   * @zh 相机组件。
   */
  var Camera = (_dec = (0, _index.ccclass)('cc.Camera'), _dec2 = (0, _index.help)('i18n:cc.Camera'), _dec3 = (0, _index.menu)('Components/Camera'), _dec4 = (0, _index.displayOrder)(0), _dec5 = (0, _index.tooltip)('i18n:camera.priority'), _dec6 = (0, _index.type)(_layers.Layers.BitMask), _dec7 = (0, _index.displayOrder)(1), _dec8 = (0, _index.tooltip)('i18n:camera.visibility'), _dec9 = (0, _index.type)(ClearFlag), _dec10 = (0, _index.displayOrder)(2), _dec11 = (0, _index.tooltip)('i18n:camera.clear_flags'), _dec12 = (0, _index.displayOrder)(3), _dec13 = (0, _index.tooltip)('i18n:camera.color'), _dec14 = (0, _index.displayOrder)(4), _dec15 = (0, _index.tooltip)('i18n:camera.depth'), _dec16 = (0, _index.displayOrder)(5), _dec17 = (0, _index.tooltip)('i18n:camera.stencil'), _dec18 = (0, _index.type)(ProjectionType), _dec19 = (0, _index.displayOrder)(6), _dec20 = (0, _index.tooltip)('i18n:camera.projection'), _dec21 = (0, _index.type)(FOVAxis), _dec22 = (0, _index.displayOrder)(7), _dec23 = (0, _index.tooltip)('i18n:camera.fov_axis'), _dec24 = (0, _index.displayOrder)(8), _dec25 = (0, _index.tooltip)('i18n:camera.fov'), _dec26 = (0, _index.displayOrder)(9), _dec27 = (0, _index.tooltip)('i18n:camera.ortho_height'), _dec28 = (0, _index.displayOrder)(10), _dec29 = (0, _index.tooltip)('i18n:camera.near'), _dec30 = (0, _index.displayOrder)(11), _dec31 = (0, _index.tooltip)('i18n:camera.far'), _dec32 = (0, _index.type)(Aperture), _dec33 = (0, _index.displayOrder)(12), _dec34 = (0, _index.tooltip)('i18n:camera.aperture'), _dec35 = (0, _index.type)(Shutter), _dec36 = (0, _index.displayOrder)(13), _dec37 = (0, _index.tooltip)('i18n:camera.shutter'), _dec38 = (0, _index.type)(ISO), _dec39 = (0, _index.displayOrder)(14), _dec40 = (0, _index.tooltip)('i18n:camera.ISO'), _dec41 = (0, _index.displayOrder)(15), _dec42 = (0, _index.tooltip)('i18n:camera.rect'), _dec43 = (0, _index.type)(_renderTexture.RenderTexture), _dec44 = (0, _index.displayOrder)(16), _dec45 = (0, _index.tooltip)('i18n:camera.target_texture'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(Camera, _Component);

    function Camera() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Camera);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Camera)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_projection", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_priority", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fov", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fovAxis", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_orthoHeight", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_near", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_far", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_color", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_depth", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_stencil", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_clearFlags", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_rect", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_aperture", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_shutter", _descriptor14, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_iso", _descriptor15, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_screenScale", _descriptor16, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_visibility", _descriptor17, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_targetTexture", _descriptor18, _assertThisInitialized(_this));

      _this._camera = null;
      _this._inEditorMode = false;
      _this._flows = undefined;
      return _this;
    }

    _createClass(Camera, [{
      key: "onLoad",
      value: function onLoad() {
        _globalExports.legacyCC.director.on(_globalExports.legacyCC.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneChanged, this);

        this._createCamera();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this.node.hasChangedFlags |= _nodeEnum.TransformBit.POSITION; // trigger camera matrix update

        if (this._camera) {
          this._attachToScene();

          return;
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._camera) {
          this._detachFromScene();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._camera) {
          _globalExports.legacyCC.director.root.destroyCamera(this._camera);

          this._camera = null;
        }

        if (this._targetTexture) {
          this._targetTexture.off('resize');
        }
      }
    }, {
      key: "screenPointToRay",
      value: function screenPointToRay(x, y, out) {
        if (!out) {
          out = _index2.ray.create();
        }

        if (this._camera) {
          this._camera.screenPointToRay(out, x, y);
        }

        return out;
      }
    }, {
      key: "worldToScreen",
      value: function worldToScreen(worldPos, out) {
        if (!out) {
          out = new _index3.Vec3();
        }

        if (this._camera) {
          this._camera.worldToScreen(out, worldPos);
        }

        return out;
      }
    }, {
      key: "screenToWorld",
      value: function screenToWorld(screenPos, out) {
        if (!out) {
          out = this.node.getWorldPosition();
        }

        if (this._camera) {
          this._camera.screenToWorld(out, screenPos);
        }

        return out;
      }
      /**
       * @en 3D node to UI local node coordinates. The converted value is the offset under the UI node.
       *
       * @zh 3D 节点转 UI 本地节点坐标。转换后的值是该 UI 节点下的偏移。
       * @param wpos 3D 节点世界坐标
       * @param uiNode UI 节点
       * @param out 返回在当前传入的 UI 节点下的偏移量
       *
       * @example
       * ```ts
       * this.convertToUINode(target.worldPosition, uiNode.parent, out);
       * uiNode.position = out;
       * ```
       */

    }, {
      key: "convertToUINode",
      value: function convertToUINode(wpos, uiNode, out) {
        if (!out) {
          out = new _index3.Vec3();
        }

        if (!this._camera) {
          return out;
        }

        this.worldToScreen(wpos, _temp_vec3_1);
        var cmp = uiNode.getComponent('cc.UITransform');

        var designSize = _view.view.getVisibleSize();

        var xoffset = _temp_vec3_1.x - this._camera.width * 0.5;
        var yoffset = _temp_vec3_1.y - this._camera.height * 0.5;
        _temp_vec3_1.x = xoffset / _globalExports.legacyCC.view.getScaleX() + designSize.width * 0.5;
        _temp_vec3_1.y = yoffset / _globalExports.legacyCC.view.getScaleY() + designSize.height * 0.5;

        if (cmp) {
          cmp.convertToNodeSpaceAR(_temp_vec3_1, out);
        }

        return out;
      }
    }, {
      key: "_createCamera",
      value: function _createCamera() {
        this._camera = _globalExports.legacyCC.director.root.createCamera();

        this._camera.initialize({
          name: this.node.name,
          node: this.node,
          projection: this._projection,
          window: this._inEditorMode ? _globalExports.legacyCC.director.root && _globalExports.legacyCC.director.root.mainWindow : _globalExports.legacyCC.director.root && _globalExports.legacyCC.director.root.tempWindow,
          priority: this._priority,
          flows: this._flows
        });

        if (this._camera) {
          this._camera.viewport = this._rect;
          this._camera.fovAxis = this._fovAxis;
          this._camera.fov = (0, _index3.toRadian)(this._fov);
          this._camera.orthoHeight = this._orthoHeight;
          this._camera.nearClip = this._near;
          this._camera.farClip = this._far;
          this._camera.clearColor = this._color;
          this._camera.clearDepth = this._depth;
          this._camera.clearStencil = this._stencil;
          this._camera.clearFlag = this._clearFlags;
          this._camera.visibility = this._visibility;
          this._camera.aperture = this._aperture;
          this._camera.shutter = this._shutter;
          this._camera.iso = this._iso;
        }

        this._updateTargetTexture();
      }
    }, {
      key: "_attachToScene",
      value: function _attachToScene() {
        if (!this.node.scene || !this._camera) {
          return;
        }

        if (this._camera && this._camera.scene) {
          this._camera.scene.removeCamera(this._camera);
        }

        var rs = this._getRenderScene();

        rs.addCamera(this._camera);
      }
    }, {
      key: "_detachFromScene",
      value: function _detachFromScene() {
        if (this._camera && this._camera.scene) {
          this._camera.scene.removeCamera(this._camera);
        }
      }
    }, {
      key: "onSceneChanged",
      value: function onSceneChanged(_scene) {
        // to handle scene switch of editor camera
        if (this._camera && this._camera.scene == null) {
          this._attachToScene();
        }
      }
    }, {
      key: "_chechTargetTextureEvent",
      value: function _chechTargetTextureEvent(old) {
        var _this2 = this;

        var resizeFunc = function resizeFunc(window) {
          if (_this2._camera) {
            _this2._camera.setFixedSize(window.width, window.height);
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

        if (this._targetTexture) {
          var window = this._targetTexture.window;

          this._camera.changeTargetWindow(window);

          this._camera.setFixedSize(window.width, window.height);
        }
      }
    }, {
      key: "camera",
      get: function get() {
        return this._camera;
      }
      /**
       * @en Render priority of the camera, in ascending-order.
       * @zh 相机的渲染优先级，值越小越优先渲染。
       */

    }, {
      key: "priority",
      get: function get() {
        return this._priority;
      },
      set: function set(val) {
        this._priority = val;

        if (this._camera) {
          this._camera.priority = val;
        }
      }
      /**
       * @en Visibility mask, declaring a set of node layers that will be visible to this camera.
       * @zh 可见性掩码，声明在当前相机中可见的节点层级集合。
       */

    }, {
      key: "visibility",
      get: function get() {
        return this._visibility;
      },
      set: function set(val) {
        this._visibility = val;

        if (this._camera) {
          this._camera.visibility = val;
        }
      }
      /**
       * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
       * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
       */

    }, {
      key: "clearFlags",
      get: function get() {
        return this._clearFlags;
      },
      set: function set(val) {
        this._clearFlags = val;

        if (this._camera) {
          this._camera.clearFlag = val;
        }
      }
      /**
       * @en Clearing color of the camera.
       * @zh 相机的颜色缓冲默认值。
       */

    }, {
      key: "clearColor",
      get: function get() {
        return this._color;
      },
      set: function set(val) {
        this._color.set(val);

        if (this._camera) {
          this._camera.clearColor = this._color;
        }
      }
      /**
       * @en Clearing depth of the camera.
       * @zh 相机的深度缓冲默认值。
       */

    }, {
      key: "clearDepth",
      get: function get() {
        return this._depth;
      },
      set: function set(val) {
        this._depth = val;

        if (this._camera) {
          this._camera.clearDepth = val;
        }
      }
      /**
       * @en Clearing stencil of the camera.
       * @zh 相机的模板缓冲默认值。
       */

    }, {
      key: "clearStencil",
      get: function get() {
        return this._stencil;
      },
      set: function set(val) {
        this._stencil = val;

        if (this._camera) {
          this._camera.clearStencil = val;
        }
      }
      /**
       * @en Projection type of the camera.
       * @zh 相机的投影类型。
       */

    }, {
      key: "projection",
      get: function get() {
        return this._projection;
      },
      set: function set(val) {
        this._projection = val;

        if (this._camera) {
          this._camera.projectionType = val;
        }
      }
      /**
       * @en The axis on which the FOV would be fixed regardless of screen aspect changes.
       * @zh 指定视角的固定轴向，在此轴上不会跟随屏幕长宽比例变化。
       */

    }, {
      key: "fovAxis",
      get: function get() {
        return this._fovAxis;
      },
      set: function set(val) {
        if (val === this._fovAxis) {
          return;
        }

        this._fovAxis = val;

        if (this._camera) {
          this._camera.fovAxis = val;

          if (val === _camera.CameraFOVAxis.VERTICAL) {
            this.fov = this._fov * this._camera.aspect;
          } else {
            this.fov = this._fov / this._camera.aspect;
          }
        }
      }
      /**
       * @en Field of view of the camera.
       * @zh 相机的视角大小。
       */

    }, {
      key: "fov",
      get: function get() {
        return this._fov;
      },
      set: function set(val) {
        this._fov = val;

        if (this._camera) {
          this._camera.fov = (0, _index3.toRadian)(val);
        }
      }
      /**
       * @en Viewport height in orthographic mode.
       * @zh 正交模式下的相机视角高度。
       */

    }, {
      key: "orthoHeight",
      get: function get() {
        return this._orthoHeight;
      },
      set: function set(val) {
        this._orthoHeight = val;

        if (this._camera) {
          this._camera.orthoHeight = val;
        }
      }
      /**
       * @en Near clipping distance of the camera, should be as large as possible within acceptable range.
       * @zh 相机的近裁剪距离，应在可接受范围内尽量取最大。
       */

    }, {
      key: "near",
      get: function get() {
        return this._near;
      },
      set: function set(val) {
        this._near = val;

        if (this._camera) {
          this._camera.nearClip = val;
        }
      }
      /**
       * @en Far clipping distance of the camera, should be as small as possible within acceptable range.
       * @zh 相机的远裁剪距离，应在可接受范围内尽量取最小。
       */

    }, {
      key: "far",
      get: function get() {
        return this._far;
      },
      set: function set(val) {
        this._far = val;

        if (this._camera) {
          this._camera.farClip = val;
        }
      }
      /**
       * @en Camera aperture, controls the exposure parameter.
       * @zh 相机光圈，影响相机的曝光参数。
       */

    }, {
      key: "aperture",
      get: function get() {
        return this._aperture;
      },
      set: function set(val) {
        this._aperture = val;

        if (this._camera) {
          this._camera.aperture = val;
        }
      }
      /**
       * @en Camera shutter, controls the exposure parameter.
       * @zh 相机快门，影响相机的曝光参数。
       */

    }, {
      key: "shutter",
      get: function get() {
        return this._shutter;
      },
      set: function set(val) {
        this._shutter = val;

        if (this._camera) {
          this._camera.shutter = val;
        }
      }
      /**
       * @en Camera ISO, controls the exposure parameter.
       * @zh 相机感光度，影响相机的曝光参数。
       */

    }, {
      key: "iso",
      get: function get() {
        return this._iso;
      },
      set: function set(val) {
        this._iso = val;

        if (this._camera) {
          this._camera.iso = val;
        }
      }
      /**
       * @en Screen viewport of the camera wrt. the sceen size.
       * @zh 此相机最终渲染到屏幕上的视口位置和大小。
       */

    }, {
      key: "rect",
      get: function get() {
        return this._rect;
      },
      set: function set(val) {
        this._rect = val;

        if (this._camera) {
          this._camera.viewport = val;
        }
      }
      /**
       * @en Output render texture of the camera. Default to null, which outputs directly to screen.
       * @zh 指定此相机的渲染输出目标贴图，默认为空，直接渲染到屏幕。
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

        this._chechTargetTextureEvent(old);

        this._updateTargetTexture();

        if (!value && this._camera) {
          this._camera.changeTargetWindow(_defaultConstants.EDITOR ? _globalExports.legacyCC.director.root.tempWindow : null);

          this._camera.isWindowSize = true;
        }
      }
      /**
       * @en Scale of the internal buffer size,
       * set to 1 to keep the same with the canvas size.
       * @zh 相机内部缓冲尺寸的缩放值, 1 为与 canvas 尺寸相同。
       */

    }, {
      key: "screenScale",
      get: function get() {
        return this._screenScale;
      },
      set: function set(val) {
        this._screenScale = val;

        if (this._camera) {
          this._camera.screenScale = val;
        }
      }
    }, {
      key: "inEditorMode",
      get: function get() {
        return this._inEditorMode;
      },
      set: function set(value) {
        this._inEditorMode = value;

        if (this._camera) {
          this._camera.changeTargetWindow(value ? _globalExports.legacyCC.director.root && _globalExports.legacyCC.director.root.mainWindow : _globalExports.legacyCC.director.root && _globalExports.legacyCC.director.root.tempWindow);
        }
      }
    }, {
      key: "flows",
      set: function set(val) {
        if (this._camera) {
          this._camera.flows = val;
        }

        this._flows = val;
      }
    }]);

    return Camera;
  }(_component.Component), _class3.ProjectionType = ProjectionType, _class3.FOVAxis = FOVAxis, _class3.ClearFlag = ClearFlag, _class3.Aperture = Aperture, _class3.Shutter = Shutter, _class3.ISO = ISO, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_projection", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return ProjectionType.PERSPECTIVE;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_priority", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_fov", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 45;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_fovAxis", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return FOVAxis.VERTICAL;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_orthoHeight", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 10;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_near", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_far", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1000;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_color", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index3.Color('#333333');
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_depth", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_stencil", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_clearFlags", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return ClearFlag.SOLID_COLOR;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_rect", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index3.Rect(0, 0, 1, 1);
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_aperture", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Aperture.F16_0;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_shutter", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Shutter.D125;
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "_iso", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return ISO.ISO100;
    }
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "_screenScale", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "_visibility", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define2.CAMERA_DEFAULT_MASK;
    }
  }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "_targetTexture", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "priority", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "priority"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "visibility", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "visibility"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clearFlags", [_dec9, _dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "clearFlags"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clearColor", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "clearColor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clearDepth", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "clearDepth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clearStencil", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "clearStencil"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "projection", [_dec18, _dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "projection"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fovAxis", [_dec21, _dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "fovAxis"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fov", [_dec24, _dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "fov"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "orthoHeight", [_dec26, _dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "orthoHeight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "near", [_dec28, _dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "near"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "far", [_dec30, _dec31], Object.getOwnPropertyDescriptor(_class2.prototype, "far"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "aperture", [_dec32, _dec33, _dec34], Object.getOwnPropertyDescriptor(_class2.prototype, "aperture"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shutter", [_dec35, _dec36, _dec37], Object.getOwnPropertyDescriptor(_class2.prototype, "shutter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "iso", [_dec38, _dec39, _dec40], Object.getOwnPropertyDescriptor(_class2.prototype, "iso"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "rect", [_dec41, _dec42], Object.getOwnPropertyDescriptor(_class2.prototype, "rect"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "targetTexture", [_dec43, _dec44, _dec45], Object.getOwnPropertyDescriptor(_class2.prototype, "targetTexture"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
  _exports.Camera = Camera;
  _globalExports.legacyCC.Camera = Camera;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL2NhbWVyYS1jb21wb25lbnQudHMiXSwibmFtZXMiOlsiX3RlbXBfdmVjM18xIiwiVmVjMyIsIlByb2plY3Rpb25UeXBlIiwiQ2FtZXJhUHJvamVjdGlvbiIsIkZPVkF4aXMiLCJDYW1lcmFGT1ZBeGlzIiwiQXBlcnR1cmUiLCJDYW1lcmFBcGVydHVyZSIsIlNodXR0ZXIiLCJDYW1lcmFTaHV0dGVyIiwiSVNPIiwiQ2FtZXJhSVNPIiwiQ2xlYXJGbGFnIiwiU0tZQk9YIiwiU0tZQk9YX0ZMQUciLCJHRlhDbGVhckZsYWciLCJERVBUSF9TVEVOQ0lMIiwiU09MSURfQ09MT1IiLCJBTEwiLCJERVBUSF9PTkxZIiwiRE9OVF9DTEVBUiIsIk5PTkUiLCJDYW1lcmEiLCJMYXllcnMiLCJCaXRNYXNrIiwiUmVuZGVyVGV4dHVyZSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX2NhbWVyYSIsIl9pbkVkaXRvck1vZGUiLCJfZmxvd3MiLCJ1bmRlZmluZWQiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwib24iLCJEaXJlY3RvciIsIkVWRU5UX0FGVEVSX1NDRU5FX0xBVU5DSCIsIm9uU2NlbmVDaGFuZ2VkIiwiX2NyZWF0ZUNhbWVyYSIsIm5vZGUiLCJoYXNDaGFuZ2VkRmxhZ3MiLCJUcmFuc2Zvcm1CaXQiLCJQT1NJVElPTiIsIl9hdHRhY2hUb1NjZW5lIiwiX2RldGFjaEZyb21TY2VuZSIsInJvb3QiLCJkZXN0cm95Q2FtZXJhIiwiX3RhcmdldFRleHR1cmUiLCJvZmYiLCJ4IiwieSIsIm91dCIsInJheSIsImNyZWF0ZSIsInNjcmVlblBvaW50VG9SYXkiLCJ3b3JsZFBvcyIsIndvcmxkVG9TY3JlZW4iLCJzY3JlZW5Qb3MiLCJnZXRXb3JsZFBvc2l0aW9uIiwic2NyZWVuVG9Xb3JsZCIsIndwb3MiLCJ1aU5vZGUiLCJjbXAiLCJnZXRDb21wb25lbnQiLCJkZXNpZ25TaXplIiwidmlldyIsImdldFZpc2libGVTaXplIiwieG9mZnNldCIsIndpZHRoIiwieW9mZnNldCIsImhlaWdodCIsImdldFNjYWxlWCIsImdldFNjYWxlWSIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwiY3JlYXRlQ2FtZXJhIiwiaW5pdGlhbGl6ZSIsIm5hbWUiLCJwcm9qZWN0aW9uIiwiX3Byb2plY3Rpb24iLCJ3aW5kb3ciLCJtYWluV2luZG93IiwidGVtcFdpbmRvdyIsInByaW9yaXR5IiwiX3ByaW9yaXR5IiwiZmxvd3MiLCJ2aWV3cG9ydCIsIl9yZWN0IiwiZm92QXhpcyIsIl9mb3ZBeGlzIiwiZm92IiwiX2ZvdiIsIm9ydGhvSGVpZ2h0IiwiX29ydGhvSGVpZ2h0IiwibmVhckNsaXAiLCJfbmVhciIsImZhckNsaXAiLCJfZmFyIiwiY2xlYXJDb2xvciIsIl9jb2xvciIsImNsZWFyRGVwdGgiLCJfZGVwdGgiLCJjbGVhclN0ZW5jaWwiLCJfc3RlbmNpbCIsImNsZWFyRmxhZyIsIl9jbGVhckZsYWdzIiwidmlzaWJpbGl0eSIsIl92aXNpYmlsaXR5IiwiYXBlcnR1cmUiLCJfYXBlcnR1cmUiLCJzaHV0dGVyIiwiX3NodXR0ZXIiLCJpc28iLCJfaXNvIiwiX3VwZGF0ZVRhcmdldFRleHR1cmUiLCJzY2VuZSIsInJlbW92ZUNhbWVyYSIsInJzIiwiX2dldFJlbmRlclNjZW5lIiwiYWRkQ2FtZXJhIiwiX3NjZW5lIiwib2xkIiwicmVzaXplRnVuYyIsInNldEZpeGVkU2l6ZSIsImNoYW5nZVRhcmdldFdpbmRvdyIsInZhbCIsInNldCIsInByb2plY3Rpb25UeXBlIiwiVkVSVElDQUwiLCJhc3BlY3QiLCJ2YWx1ZSIsIl9jaGVjaFRhcmdldFRleHR1cmVFdmVudCIsIkVESVRPUiIsImlzV2luZG93U2l6ZSIsIl9zY3JlZW5TY2FsZSIsInNjcmVlblNjYWxlIiwiQ29tcG9uZW50Iiwic2VyaWFsaXphYmxlIiwiUEVSU1BFQ1RJVkUiLCJDb2xvciIsIlJlY3QiLCJGMTZfMCIsIkQxMjUiLCJJU08xMDAiLCJDQU1FUkFf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QlAsbUI7Ozs7O2FBQ2dELEk7Ozs7QUFpZnJEeEcsMEJBQVNULE1BQVQsR0FBa0JBLE1BQWxCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvbXBvbmVudC9jYW1lcmFcclxuICovXHJcblxyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBSZW5kZXJUZXh0dXJlIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3JlbmRlci10ZXh0dXJlJztcclxuaW1wb3J0IHsgVUlUcmFuc2Zvcm0gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL3VpLWJhc2UnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIGV4ZWN1dGVJbkVkaXRNb2RlLCBtZW51LCB0b29sdGlwLCBkaXNwbGF5T3JkZXIsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IHJheSB9IGZyb20gJy4uLy4uL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgR0ZYQ2xlYXJGbGFnIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IENvbG9yLCBSZWN0LCB0b1JhZGlhbiwgVmVjMyB9IGZyb20gJy4uLy4uL21hdGgnO1xyXG5pbXBvcnQgeyBDQU1FUkFfREVGQVVMVF9NQVNLIH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvZGVmaW5lJztcclxuaW1wb3J0IHsgdmlldyB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL3ZpZXcnO1xyXG5pbXBvcnQgeyBzY2VuZSB9IGZyb20gJy4uLy4uL3JlbmRlcmVyJztcclxuaW1wb3J0IHsgU0tZQk9YX0ZMQUcsIENhbWVyYVByb2plY3Rpb24sIENhbWVyYUZPVkF4aXMsIENhbWVyYUFwZXJ0dXJlLCBDYW1lcmFJU08sIENhbWVyYVNodXR0ZXIgfSBmcm9tICcuLi8uLi9yZW5kZXJlci9zY2VuZS9jYW1lcmEnO1xyXG5pbXBvcnQgeyBSb290IH0gZnJvbSAnLi4vLi4vcm9vdCc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaC9ub2RlJztcclxuaW1wb3J0IHsgTGF5ZXJzIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgvbGF5ZXJzJztcclxuaW1wb3J0IHsgU2NlbmUgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaC9zY2VuZSc7XHJcbmltcG9ydCB7IEVudW0gfSBmcm9tICcuLi8uLi92YWx1ZS10eXBlcyc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybUJpdCB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoL25vZGUtZW51bSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBSZW5kZXJXaW5kb3cgfSBmcm9tICcuLi8uLi9yZW5kZXJlci9jb3JlL3JlbmRlci13aW5kb3cnO1xyXG5cclxuY29uc3QgX3RlbXBfdmVjM18xID0gbmV3IFZlYzMoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIHByb2plY3Rpb24gdHlwZS5cclxuICogQHpoIOaKleW9seexu+Wei+OAglxyXG4gKi9cclxuY29uc3QgUHJvamVjdGlvblR5cGUgPSBFbnVtKENhbWVyYVByb2plY3Rpb24pO1xyXG5jb25zdCBGT1ZBeGlzID0gRW51bShDYW1lcmFGT1ZBeGlzKTtcclxuY29uc3QgQXBlcnR1cmUgPSBFbnVtKENhbWVyYUFwZXJ0dXJlKTtcclxuY29uc3QgU2h1dHRlciA9IEVudW0oQ2FtZXJhU2h1dHRlcik7XHJcbmNvbnN0IElTTyA9IEVudW0oQ2FtZXJhSVNPKTtcclxuXHJcbmNvbnN0IENsZWFyRmxhZyA9IEVudW0oe1xyXG4gICAgU0tZQk9YOiBTS1lCT1hfRkxBRyB8IEdGWENsZWFyRmxhZy5ERVBUSF9TVEVOQ0lMLFxyXG4gICAgU09MSURfQ09MT1I6IEdGWENsZWFyRmxhZy5BTEwsXHJcbiAgICBERVBUSF9PTkxZOiBHRlhDbGVhckZsYWcuREVQVEhfU1RFTkNJTCxcclxuICAgIERPTlRfQ0xFQVI6IEdGWENsZWFyRmxhZy5OT05FLFxyXG59KTtcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlOiBuby1zaGFkb3dlZC12YXJpYWJsZVxyXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgQ2FtZXJhIHtcclxuICAgIGV4cG9ydCB0eXBlIFByb2plY3Rpb25UeXBlID0gRW51bUFsaWFzPHR5cGVvZiBQcm9qZWN0aW9uVHlwZT47XHJcbiAgICBleHBvcnQgdHlwZSBGT1ZBeGlzID0gRW51bUFsaWFzPHR5cGVvZiBGT1ZBeGlzPjtcclxuICAgIGV4cG9ydCB0eXBlIENsZWFyRmxhZyA9IEVudW1BbGlhczx0eXBlb2YgQ2xlYXJGbGFnPjtcclxuICAgIGV4cG9ydCB0eXBlIEFwZXJ0dXJlID0gRW51bUFsaWFzPHR5cGVvZiBBcGVydHVyZT47XHJcbiAgICBleHBvcnQgdHlwZSBTaHV0dGVyID0gRW51bUFsaWFzPHR5cGVvZiBTaHV0dGVyPjtcclxuICAgIGV4cG9ydCB0eXBlIElTTyA9IEVudW1BbGlhczx0eXBlb2YgSVNPPjtcclxufVxyXG4vLyB0c2xpbnQ6ZW5hYmxlOiBuby1zaGFkb3dlZC12YXJpYWJsZVxyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgQ2FtZXJhIENvbXBvbmVudC5cclxuICogQHpoIOebuOacuue7hOS7tuOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkNhbWVyYScpXHJcbkBoZWxwKCdpMThuOmNjLkNhbWVyYScpXHJcbkBtZW51KCdDb21wb25lbnRzL0NhbWVyYScpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgQ2FtZXJhIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgUHJvamVjdGlvblR5cGUgPSBQcm9qZWN0aW9uVHlwZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgRk9WQXhpcyA9IEZPVkF4aXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIENsZWFyRmxhZyA9IENsZWFyRmxhZztcclxuICAgIHB1YmxpYyBzdGF0aWMgQXBlcnR1cmUgPSBBcGVydHVyZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgU2h1dHRlciA9IFNodXR0ZXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIElTTyA9IElTTztcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3Byb2plY3Rpb24gPSBQcm9qZWN0aW9uVHlwZS5QRVJTUEVDVElWRTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcHJpb3JpdHkgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9mb3YgPSA0NTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZm92QXhpcyA9IEZPVkF4aXMuVkVSVElDQUw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX29ydGhvSGVpZ2h0ID0gMTA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX25lYXIgPSAxO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9mYXIgPSAxMDAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9jb2xvciA9IG5ldyBDb2xvcignIzMzMzMzMycpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9kZXB0aCA9IDE7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3N0ZW5jaWwgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9jbGVhckZsYWdzID0gQ2xlYXJGbGFnLlNPTElEX0NPTE9SO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9yZWN0ID0gbmV3IFJlY3QoMCwgMCwgMSwgMSk7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2FwZXJ0dXJlID0gQXBlcnR1cmUuRjE2XzA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3NodXR0ZXIgPSBTaHV0dGVyLkQxMjU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2lzbyA9IElTTy5JU08xMDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3NjcmVlblNjYWxlID0gMTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdmlzaWJpbGl0eSA9IENBTUVSQV9ERUZBVUxUX01BU0s7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3RhcmdldFRleHR1cmU6IFJlbmRlclRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NhbWVyYTogc2NlbmUuQ2FtZXJhIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2luRWRpdG9yTW9kZSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9mbG93czogc3RyaW5nW10gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgZ2V0IGNhbWVyYSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbWVyYSE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVuZGVyIHByaW9yaXR5IG9mIHRoZSBjYW1lcmEsIGluIGFzY2VuZGluZy1vcmRlci5cclxuICAgICAqIEB6aCDnm7jmnLrnmoTmuLLmn5PkvJjlhYjnuqfvvIzlgLzotorlsI/otorkvJjlhYjmuLLmn5PjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46Y2FtZXJhLnByaW9yaXR5JylcclxuICAgIGdldCBwcmlvcml0eSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByaW9yaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwcmlvcml0eSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fcHJpb3JpdHkgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEucHJpb3JpdHkgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFZpc2liaWxpdHkgbWFzaywgZGVjbGFyaW5nIGEgc2V0IG9mIG5vZGUgbGF5ZXJzIHRoYXQgd2lsbCBiZSB2aXNpYmxlIHRvIHRoaXMgY2FtZXJhLlxyXG4gICAgICogQHpoIOWPr+ingeaAp+aOqeegge+8jOWjsOaYjuWcqOW9k+WJjeebuOacuuS4reWPr+ingeeahOiKgueCueWxgue6p+mbhuWQiOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShMYXllcnMuQml0TWFzaylcclxuICAgIEBkaXNwbGF5T3JkZXIoMSlcclxuICAgIEB0b29sdGlwKCdpMThuOmNhbWVyYS52aXNpYmlsaXR5JylcclxuICAgIGdldCB2aXNpYmlsaXR5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJpbGl0eTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmlzaWJpbGl0eSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS52aXNpYmlsaXR5ID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDbGVhcmluZyBmbGFncyBvZiB0aGUgY2FtZXJhLCBzcGVjaWZpZXMgd2hpY2ggcGFydCBvZiB0aGUgZnJhbWVidWZmZXIgd2lsbCBiZSBhY3R1YWxseSBjbGVhcmVkIGV2ZXJ5IGZyYW1lLlxyXG4gICAgICogQHpoIOebuOacuueahOe8k+WGsua4hemZpOagh+W/l+S9je+8jOaMh+WumuW4p+e8k+WGsueahOWTqumDqOWIhuimgeavj+W4p+a4hemZpOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDbGVhckZsYWcpXHJcbiAgICBAZGlzcGxheU9yZGVyKDIpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpjYW1lcmEuY2xlYXJfZmxhZ3MnKVxyXG4gICAgZ2V0IGNsZWFyRmxhZ3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGVhckZsYWdzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjbGVhckZsYWdzICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9jbGVhckZsYWdzID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHsgdGhpcy5fY2FtZXJhLmNsZWFyRmxhZyA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENsZWFyaW5nIGNvbG9yIG9mIHRoZSBjYW1lcmEuXHJcbiAgICAgKiBAemgg55u45py655qE6aKc6Imy57yT5Yay6buY6K6k5YC844CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMylcclxuICAgIEB0b29sdGlwKCdpMThuOmNhbWVyYS5jb2xvcicpXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIGdldCBjbGVhckNvbG9yICgpOiBSZWFkb25seTxDb2xvcj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2xlYXJDb2xvciAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fY29sb3Iuc2V0KHZhbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY2xlYXJDb2xvciA9IHRoaXMuX2NvbG9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDbGVhcmluZyBkZXB0aCBvZiB0aGUgY2FtZXJhLlxyXG4gICAgICogQHpoIOebuOacuueahOa3seW6pue8k+WGsum7mOiupOWAvOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDQpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpjYW1lcmEuZGVwdGgnKVxyXG4gICAgZ2V0IGNsZWFyRGVwdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXB0aDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2xlYXJEZXB0aCAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fZGVwdGggPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkgeyB0aGlzLl9jYW1lcmEuY2xlYXJEZXB0aCA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENsZWFyaW5nIHN0ZW5jaWwgb2YgdGhlIGNhbWVyYS5cclxuICAgICAqIEB6aCDnm7jmnLrnmoTmqKHmnb/nvJPlhrLpu5jorqTlgLzjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcig1KVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46Y2FtZXJhLnN0ZW5jaWwnKVxyXG4gICAgZ2V0IGNsZWFyU3RlbmNpbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0ZW5jaWw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNsZWFyU3RlbmNpbCAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fc3RlbmNpbCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7IHRoaXMuX2NhbWVyYS5jbGVhclN0ZW5jaWwgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQcm9qZWN0aW9uIHR5cGUgb2YgdGhlIGNhbWVyYS5cclxuICAgICAqIEB6aCDnm7jmnLrnmoTmipXlvbHnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoUHJvamVjdGlvblR5cGUpXHJcbiAgICBAZGlzcGxheU9yZGVyKDYpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpjYW1lcmEucHJvamVjdGlvbicpXHJcbiAgICBnZXQgcHJvamVjdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2plY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHByb2plY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3Byb2plY3Rpb24gPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkgeyB0aGlzLl9jYW1lcmEucHJvamVjdGlvblR5cGUgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgYXhpcyBvbiB3aGljaCB0aGUgRk9WIHdvdWxkIGJlIGZpeGVkIHJlZ2FyZGxlc3Mgb2Ygc2NyZWVuIGFzcGVjdCBjaGFuZ2VzLlxyXG4gICAgICogQHpoIOaMh+WumuinhuinkueahOWbuuWumui9tOWQke+8jOWcqOatpOi9tOS4iuS4jeS8mui3n+maj+Wxj+W5lemVv+WuveavlOS+i+WPmOWMluOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShGT1ZBeGlzKVxyXG4gICAgQGRpc3BsYXlPcmRlcig3KVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46Y2FtZXJhLmZvdl9heGlzJylcclxuICAgIGdldCBmb3ZBeGlzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm92QXhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZm92QXhpcyAodmFsKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gdGhpcy5fZm92QXhpcykgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9mb3ZBeGlzID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmZvdkF4aXMgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT09IENhbWVyYUZPVkF4aXMuVkVSVElDQUwpIHsgdGhpcy5mb3YgPSB0aGlzLl9mb3YgKiB0aGlzLl9jYW1lcmEuYXNwZWN0OyB9XHJcbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLmZvdiA9IHRoaXMuX2ZvdiAvIHRoaXMuX2NhbWVyYS5hc3BlY3Q7IH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRmllbGQgb2YgdmlldyBvZiB0aGUgY2FtZXJhLlxyXG4gICAgICogQHpoIOebuOacuueahOinhuinkuWkp+Wwj+OAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDgpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpjYW1lcmEuZm92JylcclxuICAgIGdldCBmb3YgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3Y7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZvdiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fZm92ID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHsgdGhpcy5fY2FtZXJhLmZvdiA9IHRvUmFkaWFuKHZhbCk7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBWaWV3cG9ydCBoZWlnaHQgaW4gb3J0aG9ncmFwaGljIG1vZGUuXHJcbiAgICAgKiBAemgg5q2j5Lqk5qih5byP5LiL55qE55u45py66KeG6KeS6auY5bqm44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoOSlcclxuICAgIEB0b29sdGlwKCdpMThuOmNhbWVyYS5vcnRob19oZWlnaHQnKVxyXG4gICAgZ2V0IG9ydGhvSGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3J0aG9IZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG9ydGhvSGVpZ2h0ICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9vcnRob0hlaWdodCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7IHRoaXMuX2NhbWVyYS5vcnRob0hlaWdodCA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE5lYXIgY2xpcHBpbmcgZGlzdGFuY2Ugb2YgdGhlIGNhbWVyYSwgc2hvdWxkIGJlIGFzIGxhcmdlIGFzIHBvc3NpYmxlIHdpdGhpbiBhY2NlcHRhYmxlIHJhbmdlLlxyXG4gICAgICogQHpoIOebuOacuueahOi/keijgeWJqui3neemu++8jOW6lOWcqOWPr+aOpeWPl+iMg+WbtOWGheWwvemHj+WPluacgOWkp+OAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDEwKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46Y2FtZXJhLm5lYXInKVxyXG4gICAgZ2V0IG5lYXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBuZWFyICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9uZWFyID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHsgdGhpcy5fY2FtZXJhLm5lYXJDbGlwID0gdmFsOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRmFyIGNsaXBwaW5nIGRpc3RhbmNlIG9mIHRoZSBjYW1lcmEsIHNob3VsZCBiZSBhcyBzbWFsbCBhcyBwb3NzaWJsZSB3aXRoaW4gYWNjZXB0YWJsZSByYW5nZS5cclxuICAgICAqIEB6aCDnm7jmnLrnmoTov5zoo4Hliarot53nprvvvIzlupTlnKjlj6/mjqXlj5fojIPlm7TlhoXlsL3ph4/lj5bmnIDlsI/jgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxMSlcclxuICAgIEB0b29sdGlwKCdpMThuOmNhbWVyYS5mYXInKVxyXG4gICAgZ2V0IGZhciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZmFyICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9mYXIgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkgeyB0aGlzLl9jYW1lcmEuZmFyQ2xpcCA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENhbWVyYSBhcGVydHVyZSwgY29udHJvbHMgdGhlIGV4cG9zdXJlIHBhcmFtZXRlci5cclxuICAgICAqIEB6aCDnm7jmnLrlhYnlnIjvvIzlvbHlk43nm7jmnLrnmoTmm53lhYnlj4LmlbDjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQXBlcnR1cmUpXHJcbiAgICBAZGlzcGxheU9yZGVyKDEyKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46Y2FtZXJhLmFwZXJ0dXJlJylcclxuICAgIGdldCBhcGVydHVyZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwZXJ0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBhcGVydHVyZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fYXBlcnR1cmUgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkgeyB0aGlzLl9jYW1lcmEuYXBlcnR1cmUgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDYW1lcmEgc2h1dHRlciwgY29udHJvbHMgdGhlIGV4cG9zdXJlIHBhcmFtZXRlci5cclxuICAgICAqIEB6aCDnm7jmnLrlv6vpl6jvvIzlvbHlk43nm7jmnLrnmoTmm53lhYnlj4LmlbDjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU2h1dHRlcilcclxuICAgIEBkaXNwbGF5T3JkZXIoMTMpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpjYW1lcmEuc2h1dHRlcicpXHJcbiAgICBnZXQgc2h1dHRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NodXR0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNodXR0ZXIgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3NodXR0ZXIgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkgeyB0aGlzLl9jYW1lcmEuc2h1dHRlciA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENhbWVyYSBJU08sIGNvbnRyb2xzIHRoZSBleHBvc3VyZSBwYXJhbWV0ZXIuXHJcbiAgICAgKiBAemgg55u45py65oSf5YWJ5bqm77yM5b2x5ZON55u45py655qE5pud5YWJ5Y+C5pWw44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKElTTylcclxuICAgIEBkaXNwbGF5T3JkZXIoMTQpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpjYW1lcmEuSVNPJylcclxuICAgIGdldCBpc28gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc287XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGlzbyAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5faXNvID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHsgdGhpcy5fY2FtZXJhLmlzbyA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNjcmVlbiB2aWV3cG9ydCBvZiB0aGUgY2FtZXJhIHdydC4gdGhlIHNjZWVuIHNpemUuXHJcbiAgICAgKiBAemgg5q2k55u45py65pyA57uI5riy5p+T5Yiw5bGP5bmV5LiK55qE6KeG5Y+j5L2N572u5ZKM5aSn5bCP44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMTUpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpjYW1lcmEucmVjdCcpXHJcbiAgICBnZXQgcmVjdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJlY3QgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3JlY3QgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkgeyB0aGlzLl9jYW1lcmEudmlld3BvcnQgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPdXRwdXQgcmVuZGVyIHRleHR1cmUgb2YgdGhlIGNhbWVyYS4gRGVmYXVsdCB0byBudWxsLCB3aGljaCBvdXRwdXRzIGRpcmVjdGx5IHRvIHNjcmVlbi5cclxuICAgICAqIEB6aCDmjIflrprmraTnm7jmnLrnmoTmuLLmn5PovpPlh7rnm67moIfotLTlm77vvIzpu5jorqTkuLrnqbrvvIznm7TmjqXmuLLmn5PliLDlsY/luZXjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoUmVuZGVyVGV4dHVyZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMTYpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpjYW1lcmEudGFyZ2V0X3RleHR1cmUnKVxyXG4gICAgZ2V0IHRhcmdldFRleHR1cmUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90YXJnZXRUZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0YXJnZXRUZXh0dXJlICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRUZXh0dXJlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLl90YXJnZXRUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldFRleHR1cmUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9jaGVjaFRhcmdldFRleHR1cmVFdmVudChvbGQpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVRhcmdldFRleHR1cmUoKTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWx1ZSAmJiB0aGlzLl9jYW1lcmEpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmNoYW5nZVRhcmdldFdpbmRvdyhFRElUT1IgPyBsZWdhY3lDQy5kaXJlY3Rvci5yb290LnRlbXBXaW5kb3cgOiBudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmlzV2luZG93U2l6ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNjYWxlIG9mIHRoZSBpbnRlcm5hbCBidWZmZXIgc2l6ZSxcclxuICAgICAqIHNldCB0byAxIHRvIGtlZXAgdGhlIHNhbWUgd2l0aCB0aGUgY2FudmFzIHNpemUuXHJcbiAgICAgKiBAemgg55u45py65YaF6YOo57yT5Yay5bC65a+455qE57yp5pS+5YC8LCAxIOS4uuS4jiBjYW52YXMg5bC65a+455u45ZCM44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JlZW5TY2FsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjcmVlblNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzY3JlZW5TY2FsZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fc2NyZWVuU2NhbGUgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkgeyB0aGlzLl9jYW1lcmEuc2NyZWVuU2NhbGUgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW5FZGl0b3JNb2RlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5FZGl0b3JNb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpbkVkaXRvck1vZGUgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5faW5FZGl0b3JNb2RlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY2hhbmdlVGFyZ2V0V2luZG93KHZhbHVlID8gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCAmJiBsZWdhY3lDQy5kaXJlY3Rvci5yb290Lm1haW5XaW5kb3cgOlxyXG4gICAgICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCAmJiBsZWdhY3lDQy5kaXJlY3Rvci5yb290LnRlbXBXaW5kb3cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXQgZmxvd3MgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmZsb3dzID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9mbG93cyA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpIHtcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5vbihsZWdhY3lDQy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0gsIHRoaXMub25TY2VuZUNoYW5nZWQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2NyZWF0ZUNhbWVyYSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLmhhc0NoYW5nZWRGbGFncyB8PSBUcmFuc2Zvcm1CaXQuUE9TSVRJT047IC8vIHRyaWdnZXIgY2FtZXJhIG1hdHJpeCB1cGRhdGVcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaFRvU2NlbmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuZGVzdHJveUNhbWVyYSh0aGlzLl9jYW1lcmEpO1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldFRleHR1cmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0VGV4dHVyZS5vZmYoJ3Jlc2l6ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NyZWVuUG9pbnRUb1JheSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIG91dD86IHJheSkge1xyXG4gICAgICAgIGlmICghb3V0KSB7IG91dCA9IHJheS5jcmVhdGUoKTsgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHsgdGhpcy5fY2FtZXJhLnNjcmVlblBvaW50VG9SYXkob3V0LCB4LCB5KTsgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHdvcmxkVG9TY3JlZW4gKHdvcmxkUG9zOiBWZWMzLCBvdXQ/OiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKCFvdXQpIHsgb3V0ID0gbmV3IFZlYzMoKTsgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHsgdGhpcy5fY2FtZXJhLndvcmxkVG9TY3JlZW4ob3V0LCB3b3JsZFBvcyk7IH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY3JlZW5Ub1dvcmxkIChzY3JlZW5Qb3M6IFZlYzMsIG91dD86IFZlYzMpIHtcclxuICAgICAgICBpZiAoIW91dCkgeyBvdXQgPSB0aGlzLm5vZGUuZ2V0V29ybGRQb3NpdGlvbigpOyB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkgeyB0aGlzLl9jYW1lcmEuc2NyZWVuVG9Xb3JsZChvdXQsIHNjcmVlblBvcyk7IH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIDNEIG5vZGUgdG8gVUkgbG9jYWwgbm9kZSBjb29yZGluYXRlcy4gVGhlIGNvbnZlcnRlZCB2YWx1ZSBpcyB0aGUgb2Zmc2V0IHVuZGVyIHRoZSBVSSBub2RlLlxyXG4gICAgICpcclxuICAgICAqIEB6aCAzRCDoioLngrnovawgVUkg5pys5Zyw6IqC54K55Z2Q5qCH44CC6L2s5o2i5ZCO55qE5YC85piv6K+lIFVJIOiKgueCueS4i+eahOWBj+enu+OAglxyXG4gICAgICogQHBhcmFtIHdwb3MgM0Qg6IqC54K55LiW55WM5Z2Q5qCHXHJcbiAgICAgKiBAcGFyYW0gdWlOb2RlIFVJIOiKgueCuVxyXG4gICAgICogQHBhcmFtIG91dCDov5Tlm57lnKjlvZPliY3kvKDlhaXnmoQgVUkg6IqC54K55LiL55qE5YGP56e76YePXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiB0aGlzLmNvbnZlcnRUb1VJTm9kZSh0YXJnZXQud29ybGRQb3NpdGlvbiwgdWlOb2RlLnBhcmVudCwgb3V0KTtcclxuICAgICAqIHVpTm9kZS5wb3NpdGlvbiA9IG91dDtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udmVydFRvVUlOb2RlICh3cG9zOiBWZWMzLCB1aU5vZGU6IE5vZGUsIG91dD86IFZlYzMpIHtcclxuICAgICAgICBpZiAoIW91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkgeyByZXR1cm4gb3V0OyB9XHJcblxyXG4gICAgICAgIHRoaXMud29ybGRUb1NjcmVlbih3cG9zLCBfdGVtcF92ZWMzXzEpO1xyXG4gICAgICAgIGNvbnN0IGNtcCA9IHVpTm9kZS5nZXRDb21wb25lbnQoJ2NjLlVJVHJhbnNmb3JtJykgYXMgVUlUcmFuc2Zvcm07XHJcbiAgICAgICAgY29uc3QgZGVzaWduU2l6ZSA9IHZpZXcuZ2V0VmlzaWJsZVNpemUoKTtcclxuICAgICAgICBjb25zdCB4b2Zmc2V0ID0gX3RlbXBfdmVjM18xLnggLSB0aGlzLl9jYW1lcmEhLndpZHRoICogMC41O1xyXG4gICAgICAgIGNvbnN0IHlvZmZzZXQgPSBfdGVtcF92ZWMzXzEueSAtIHRoaXMuX2NhbWVyYSEuaGVpZ2h0ICogMC41O1xyXG4gICAgICAgIF90ZW1wX3ZlYzNfMS54ID0geG9mZnNldCAvIGxlZ2FjeUNDLnZpZXcuZ2V0U2NhbGVYKCkgKyBkZXNpZ25TaXplLndpZHRoICogMC41O1xyXG4gICAgICAgIF90ZW1wX3ZlYzNfMS55ID0geW9mZnNldCAvIGxlZ2FjeUNDLnZpZXcuZ2V0U2NhbGVZKCkgKyBkZXNpZ25TaXplLmhlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgICAgaWYgKGNtcCkge1xyXG4gICAgICAgICAgICBjbXAuY29udmVydFRvTm9kZVNwYWNlQVIoX3RlbXBfdmVjM18xLCBvdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZUNhbWVyYSAoKSB7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhID0gKGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QgYXMgUm9vdCkuY3JlYXRlQ2FtZXJhKCk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhIS5pbml0aWFsaXplKHtcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5ub2RlLm5hbWUsXHJcbiAgICAgICAgICAgIG5vZGU6IHRoaXMubm9kZSxcclxuICAgICAgICAgICAgcHJvamVjdGlvbjogdGhpcy5fcHJvamVjdGlvbixcclxuICAgICAgICAgICAgd2luZG93OiB0aGlzLl9pbkVkaXRvck1vZGUgPyBsZWdhY3lDQy5kaXJlY3Rvci5yb290ICYmIGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QubWFpbldpbmRvdyA6XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5yb290ICYmIGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QudGVtcFdpbmRvdyxcclxuICAgICAgICAgICAgcHJpb3JpdHk6IHRoaXMuX3ByaW9yaXR5LFxyXG4gICAgICAgICAgICBmbG93czogdGhpcy5fZmxvd3MsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLnZpZXdwb3J0ID0gdGhpcy5fcmVjdDtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmZvdkF4aXMgPSB0aGlzLl9mb3ZBeGlzO1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuZm92ID0gdG9SYWRpYW4odGhpcy5fZm92KTtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLm9ydGhvSGVpZ2h0ID0gdGhpcy5fb3J0aG9IZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5uZWFyQ2xpcCA9IHRoaXMuX25lYXI7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5mYXJDbGlwID0gdGhpcy5fZmFyO1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY2xlYXJDb2xvciA9IHRoaXMuX2NvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY2xlYXJEZXB0aCA9IHRoaXMuX2RlcHRoO1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY2xlYXJTdGVuY2lsID0gdGhpcy5fc3RlbmNpbDtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmNsZWFyRmxhZyA9IHRoaXMuX2NsZWFyRmxhZ3M7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS52aXNpYmlsaXR5ID0gdGhpcy5fdmlzaWJpbGl0eTtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmFwZXJ0dXJlID0gdGhpcy5fYXBlcnR1cmU7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5zaHV0dGVyID0gdGhpcy5fc2h1dHRlcjtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLmlzbyA9IHRoaXMuX2lzbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVRhcmdldFRleHR1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2F0dGFjaFRvU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5ub2RlLnNjZW5lIHx8ICF0aGlzLl9jYW1lcmEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhICYmIHRoaXMuX2NhbWVyYS5zY2VuZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuc2NlbmUucmVtb3ZlQ2FtZXJhKHRoaXMuX2NhbWVyYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJzID0gdGhpcy5fZ2V0UmVuZGVyU2NlbmUoKTtcclxuICAgICAgICBycy5hZGRDYW1lcmEodGhpcy5fY2FtZXJhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldGFjaEZyb21TY2VuZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSAmJiB0aGlzLl9jYW1lcmEuc2NlbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLnNjZW5lLnJlbW92ZUNhbWVyYSh0aGlzLl9jYW1lcmEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25TY2VuZUNoYW5nZWQgKF9zY2VuZTogU2NlbmUpIHtcclxuICAgICAgICAvLyB0byBoYW5kbGUgc2NlbmUgc3dpdGNoIG9mIGVkaXRvciBjYW1lcmFcclxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhICYmIHRoaXMuX2NhbWVyYS5zY2VuZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaFRvU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jaGVjaFRhcmdldFRleHR1cmVFdmVudCAob2xkOiBSZW5kZXJUZXh0dXJlIHwgbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IHJlc2l6ZUZ1bmMgPSAod2luZG93OiBSZW5kZXJXaW5kb3cpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FtZXJhLnNldEZpeGVkU2l6ZSh3aW5kb3cud2lkdGgsIHdpbmRvdy5oZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgICAgICBvbGQub2ZmKCdyZXNpemUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldFRleHR1cmUub24oJ3Jlc2l6ZScsIHJlc2l6ZUZ1bmMsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVRhcmdldFRleHR1cmUgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX3RhcmdldFRleHR1cmUud2luZG93O1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY2hhbmdlVGFyZ2V0V2luZG93KHdpbmRvdyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5zZXRGaXhlZFNpemUod2luZG93IS53aWR0aCwgd2luZG93IS5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuQ2FtZXJhID0gQ2FtZXJhO1xyXG4iXX0=