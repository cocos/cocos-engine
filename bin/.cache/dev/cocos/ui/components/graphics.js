(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/3d/builtin/index.js", "../../core/components/ui-base/ui-renderable.js", "../../core/data/decorators/index.js", "../../core/director.js", "../../core/math/index.js", "../../core/renderer/index.js", "../assembler/graphics/types.js", "../../core/index.js", "../../core/renderer/ui/ui-vertex-format.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/3d/builtin/index.js"), require("../../core/components/ui-base/ui-renderable.js"), require("../../core/data/decorators/index.js"), require("../../core/director.js"), require("../../core/math/index.js"), require("../../core/renderer/index.js"), require("../assembler/graphics/types.js"), require("../../core/index.js"), require("../../core/renderer/ui/ui-vertex-format.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.uiRenderable, global.index, global.director, global.index, global.index, global.types, global.index, global.uiVertexFormat, global.globalExports);
    global.graphics = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _uiRenderable, _index2, _director, _index3, _index4, _types, _index5, _uiVertexFormat, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Graphics = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3, _temp;

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

  var _matInsInfo = {
    parent: null,
    owner: null,
    subModelIdx: 0
  };

  var attributes = _uiVertexFormat.vfmt.concat([new _index5.GFXAttribute('a_dist', _index5.GFXFormat.R32F)]);

  var stride = (0, _uiVertexFormat.getAttributeStride)(attributes);
  /**
   * @en
   * Graphics component.
   *
   * @zh
   * 自定义图形类
   */

  var Graphics = (_dec = (0, _index2.ccclass)('cc.Graphics'), _dec2 = (0, _index2.help)('i18n:cc.Graphics'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/Render/Graphics'), _dec5 = (0, _index2.type)(_types.LineJoin), _dec6 = (0, _index2.tooltip)('两条线相交时，所创建的拐角类型'), _dec7 = (0, _index2.type)(_types.LineCap), _dec8 = (0, _index2.tooltip)('线条的结束端点样式'), _dec9 = (0, _index2.tooltip)('笔触的颜色'), _dec10 = (0, _index2.tooltip)('填充绘画的颜色'), _dec11 = (0, _index2.tooltip)('最大斜接长度'), _dec12 = (0, _index2.visible)(false), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_UIRenderable) {
    _inherits(Graphics, _UIRenderable);

    _createClass(Graphics, [{
      key: "lineWidth",

      /**
       * @en
       * Current line width.
       *
       * @zh
       * 当前线条宽度。
       */
      get: function get() {
        return this._lineWidth;
      },
      set: function set(value) {
        this._lineWidth = value;

        if (!this.impl) {
          return;
        }

        this.impl.lineWidth = value;
      }
      /**
       * @en
       * Determines how two connecting segments (of lines, arcs or curves) with non-zero lengths in a shape are joined together.
       *
       * @zh
       * 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性。
       */

    }, {
      key: "lineJoin",
      get: function get() {
        return this._lineJoin;
      },
      set: function set(value) {
        this._lineJoin = value;

        if (!this.impl) {
          return;
        }

        this.impl.lineJoin = value;
      }
      /**
       * @en
       * Determines how the end points of every line are drawn.
       *
       * @zh
       * 指定如何绘制每一条线段末端。
       */

    }, {
      key: "lineCap",
      get: function get() {
        return this._lineCap;
      },
      set: function set(value) {
        this._lineCap = value;

        if (!this.impl) {
          return;
        }

        this.impl.lineCap = value;
      }
      /**
       * @en
       * Stroke color.
       *
       * @zh
       * 线段颜色。
       */

    }, {
      key: "strokeColor",
      get: function get() {
        return this._strokeColor;
      },
      set: function set(value) {
        if (!this.impl) {
          return;
        }

        this._strokeColor.set(value);

        this.impl.strokeColor = this._strokeColor;
      }
      /**
       * @en
       * Fill color.
       *
       * @zh
       * 填充颜色。
       */

    }, {
      key: "fillColor",
      get: function get() {
        return this._fillColor;
      },
      set: function set(value) {
        if (!this.impl) {
          return;
        }

        this._fillColor.set(value);

        this.impl.fillColor = this._fillColor;
      }
      /**
       * @en
       * Sets the miter limit ratio.
       *
       * @zh
       * 设置斜接面限制比例。
       */

    }, {
      key: "miterLimit",
      get: function get() {
        return this._miterLimit;
      },
      set: function set(value) {
        this._miterLimit = value; // this.impl.miterLimit = value;
      }
    }, {
      key: "color",
      get: function get() {
        return this._color;
      },
      set: function set(value) {
        if (this._color === value) {
          return;
        }

        this._color.set(value);

        this._updateColor();

        this.markForUpdateRenderData();
      }
    }]);

    function Graphics() {
      var _this;

      _classCallCheck(this, Graphics);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Graphics).call(this));
      _this.impl = null;
      _this.model = null;

      _initializerDefineProperty(_this, "_lineWidth", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_strokeColor", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_lineJoin", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_lineCap", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fillColor", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_miterLimit", _descriptor6, _assertThisInitialized(_this));

      _this._isDrawing = false;
      _this._renderingMeshCache = [];
      _this._instanceMaterialType = _uiRenderable.InstanceMaterialType.ADD_COLOR;
      _this._uiMaterialDirty = true;
      return _this;
    }

    _createClass(Graphics, [{
      key: "onRestore",
      value: function onRestore() {
        if (!this.impl) {
          this._flushAssembler();
        }
      }
    }, {
      key: "__preload",
      value: function __preload() {
        _get(_getPrototypeOf(Graphics.prototype), "__preload", this).call(this); // this._flushAssembler();


        this.impl = this._assembler && this._assembler.createImpl(this);
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        this._sceneGetter = _director.director.root.ui.getRenderSceneGetter();

        this._rebuildModel();

        this.helpInstanceMaterial();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._detachFromScene();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _get(_getPrototypeOf(Graphics.prototype), "onDestroy", this).call(this);

        this._sceneGetter = null;

        if (this.model) {
          this.model.destroy();

          _director.director.root.destroyModel(this.model);

          this.model = null;
        }

        if (this._renderingMeshCache.length > 0) {
          var len = this._renderingMeshCache.length;

          for (var i = 0; i < len; i++) {
            var _renderMesh$indexBuff;

            var renderMesh = this._renderingMeshCache[i];
            renderMesh.vertexBuffers[0].destroy();
            (_renderMesh$indexBuff = renderMesh.indexBuffer) === null || _renderMesh$indexBuff === void 0 ? void 0 : _renderMesh$indexBuff.destroy();
            renderMesh.destroy();
          }

          this._renderingMeshCache.length = 0;
        }

        if (!this.impl) {
          return;
        }

        this._isDrawing = false;
        this.impl.clear();
        this.impl = null;
      }
      /**
       * @en
       * Move path start point to (x,y).
       *
       * @zh
       * 移动路径起点到坐标(x, y)。
       *
       * @param x - 移动坐标 x 轴。
       * @param y - 移动坐标 y 轴。
       */

    }, {
      key: "moveTo",
      value: function moveTo(x, y) {
        if (!this.impl) {
          return;
        }

        this.impl.moveTo(x, y);
      }
      /**
       * @en
       * Adds a straight line to the path.
       *
       * @zh
       * 绘制直线路径。
       *
       * @param x - 绘制路径坐标 x 轴。
       * @param y - 绘制路径坐标 y 轴。
       */

    }, {
      key: "lineTo",
      value: function lineTo(x, y) {
        if (!this.impl) {
          return;
        }

        this.impl.lineTo(x, y);
      }
      /**
       * @en
       * Adds a cubic Bézier curve to the path.
       *
       * @zh
       * 绘制三次贝赛尔曲线路径。
       *
       * @param c1x - 第一个控制点的坐标 x 轴。
       * @param c1y - 第一个控制点的坐标 y 轴。
       * @param c2x - 第二个控制点的坐标 x 轴。
       * @param c2y - 第二个控制点的坐标 y 轴。
       * @param x - 最后一个控制点的坐标 x 轴。
       * @param y - 最后一个控制点的坐标 y 轴。
       */

    }, {
      key: "bezierCurveTo",
      value: function bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
        if (!this.impl) {
          return;
        }

        this.impl.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
      }
      /**
       * @en
       * Adds a quadratic Bézier curve to the path.
       *
       * @zh
       * 绘制二次贝赛尔曲线路径。
       *
       * @param cx - 起始控制点的坐标 x 轴。
       * @param cy - 起始控制点的坐标 y 轴。
       * @param x - 终点控制点的坐标 x 轴。
       * @param y - 终点控制点的坐标 x 轴。
       */

    }, {
      key: "quadraticCurveTo",
      value: function quadraticCurveTo(cx, cy, x, y) {
        if (!this.impl) {
          return;
        }

        this.impl.quadraticCurveTo(cx, cy, x, y);
      }
      /**
       * @en
       * Adds an arc to the path which is centered at (cx, cy) position with radius r starting at startAngle
       * and ending at endAngle going in the given direction by counterclockwise (defaulting to false).
       *
       * @zh
       * 绘制圆弧路径。圆弧路径的圆心在 (cx, cy) 位置，半径为 r ，根据 counterclockwise （默认为false）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
       *
       * @param cx - 中心控制点的坐标 x 轴。
       * @param cy - 中心控制点的坐标 y 轴。
       * @param r - 圆弧弧度。
       * @param startAngle - 开始弧度，从正 x 轴顺时针方向测量。
       * @param endAngle - 结束弧度，从正 x 轴顺时针方向测量。
       * @param counterclockwise 如果为真，在两个角度之间逆时针绘制。默认顺时针。
       */

    }, {
      key: "arc",
      value: function arc(cx, cy, r, startAngle, endAngle, counterclockwise) {
        if (!this.impl) {
          return;
        }

        this.impl.arc(cx, cy, r, startAngle, endAngle, counterclockwise);
      }
      /**
       * @en
       * Adds an ellipse to the path.
       *
       * @zh
       * 绘制椭圆路径。
       *
       * @param cx - 中心点的坐标 x 轴。
       * @param cy - 中心点的坐标 y 轴。
       * @param rx - 椭圆 x 轴半径。
       * @param ry - 椭圆 y 轴半径。
       */

    }, {
      key: "ellipse",
      value: function ellipse(cx, cy, rx, ry) {
        if (!this.impl) {
          return;
        }

        this.impl.ellipse(cx, cy, rx, ry);
      }
      /**
       * @en
       * Adds a circle to the path.
       *
       * @zh
       * 绘制圆形路径。
       *
       * @param cx - 中心点的坐标 x 轴。
       * @param cy - 中心点的坐标 y 轴。
       * @param r - 圆半径。
       */

    }, {
      key: "circle",
      value: function circle(cx, cy, r) {
        if (!this.impl) {
          return;
        }

        this.impl.circle(cx, cy, r);
      }
      /**
       * @en
       * Adds a rectangle to the path.
       *
       * @zh
       * 绘制矩形路径。
       *
       * @param x - 矩形起始坐标 x 轴。
       * @param y - 矩形起始坐标 y 轴。
       * @param w - 矩形宽度。
       * @param h - 矩形高度。
       */

    }, {
      key: "rect",
      value: function rect(x, y, w, h) {
        if (!this.impl) {
          return;
        }

        this.impl.rect(x, y, w, h);
      }
      /**
       * @en
       * Adds a round corner rectangle to the path.
       *
       * @zh
       * 绘制圆角矩形路径。
       *
       * @param x - 矩形起始坐标 x 轴。
       * @param y - 矩形起始坐标 y 轴。
       * @param w - 矩形宽度。
       * @param h - 矩形高度。
       * @param r - 矩形圆角半径。
       */

    }, {
      key: "roundRect",
      value: function roundRect(x, y, w, h, r) {
        if (!this.impl) {
          return;
        }

        this.impl.roundRect(x, y, w, h, r);
      }
      /**
       * @en
       * Draws a filled rectangle.
       *
       * @zh
       * 绘制填充矩形。
       *
       * @param x - 矩形起始坐标 x 轴。
       * @param y - 矩形起始坐标 y 轴。
       * @param w - 矩形宽度。
       * @param h - 矩形高度。
       */

    }, {
      key: "fillRect",
      value: function fillRect(x, y, w, h) {
        this.rect(x, y, w, h);
        this.fill();
      }
      /**
       * @en
       * Erasing any previously drawn content.
       *
       * @zh
       * 擦除之前绘制的所有内容的方法。
       */

    }, {
      key: "clear",
      value: function clear() {
        var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!this.impl) {
          return;
        }

        this.impl.clear(clean);
        this._isDrawing = false;

        if (this.model) {
          this.model.destroy();

          this._rebuildModel();
        }

        this._detachFromScene();

        this.markForUpdateRenderData();
      }
      /**
       * @en
       * Causes the point of the pen to move back to the start of the current path.
       * It tries to add a straight line from the current point to the start.
       *
       * @zh
       * 将笔点返回到当前路径起始点的。它尝试从当前点到起始点绘制一条直线。
       */

    }, {
      key: "close",
      value: function close() {
        if (!this.impl) {
          return;
        }

        this.impl.close();
      }
      /**
       * @en
       * Strokes the current or given path with the current stroke style.
       *
       * @zh
       * 根据当前的画线样式，绘制当前或已经存在的路径。
       */

    }, {
      key: "stroke",
      value: function stroke() {
        if (!this._assembler) {
          this._flushAssembler();
        }

        this._isDrawing = true;

        this._assembler.stroke(this);

        this._attachToScene();
      }
      /**
       * @en
       * Fills the current or given path with the current fill style.
       *
       * @zh
       * 根据当前的画线样式，填充当前或已经存在的路径。
       */

    }, {
      key: "fill",
      value: function fill() {
        if (!this._assembler) {
          this._flushAssembler();
        }

        this._isDrawing = true;

        this._assembler.fill(this);

        this._attachToScene();
      }
      /**
       * @en
       * Manual instance material.
       *
       * @zh
       * 辅助材质实例化。可用于只取数据而无实体情况下渲染使用。特殊情况可参考：[[instanceMaterial]]
       */

    }, {
      key: "helpInstanceMaterial",
      value: function helpInstanceMaterial() {
        var mat = null;
        _matInsInfo.owner = this;

        if (this.sharedMaterial) {
          _matInsInfo.parent = this.sharedMaterial[0];
          mat = new _index4.MaterialInstance(_matInsInfo);
        } else {
          _matInsInfo.parent = _index.builtinResMgr.get('ui-graphics-material');
          mat = new _index4.MaterialInstance(_matInsInfo);
          mat.recompileShaders({
            USE_LOCAL: true
          });
        }

        this._uiMaterial = _matInsInfo.parent;
        this._uiMaterialIns = mat;

        if (!this.impl) {
          this._flushAssembler();

          this.impl = this._assembler && this._assembler.createImpl(this);
        }
      }
    }, {
      key: "activeSubModel",
      value: function activeSubModel(idx) {
        if (!this.model) {
          console.warn("There is no model in ".concat(this.node.name));
          return;
        }

        if (this.model.subModels.length <= idx) {
          var renderMesh;
          var len = this._renderingMeshCache.length;

          if (len > 0 && len > idx) {
            renderMesh = this._renderingMeshCache[idx];
          } else {
            var gfxDevice = _globalExports.legacyCC.director.root.device;
            var vertexBuffer = gfxDevice.createBuffer(new _index5.GFXBufferInfo(_index5.GFXBufferUsageBit.VERTEX | _index5.GFXBufferUsageBit.TRANSFER_DST, _index5.GFXMemoryUsageBit.DEVICE, 65535 * stride, stride));
            var indexBuffer = gfxDevice.createBuffer(new _index5.GFXBufferInfo(_index5.GFXBufferUsageBit.INDEX | _index5.GFXBufferUsageBit.TRANSFER_DST, _index5.GFXMemoryUsageBit.DEVICE, 65535 * 2, 2));
            renderMesh = new _index5.RenderingSubMesh([vertexBuffer], attributes, _index5.GFXPrimitiveMode.TRIANGLE_LIST, indexBuffer);
            renderMesh.subMeshIdx = 0;

            this._renderingMeshCache.push(renderMesh);
          }

          this.model.initSubModel(idx, renderMesh, this.getUIMaterialInstance());
        }
      }
    }, {
      key: "_render",
      value: function _render(render) {
        render.commitModel(this, this.model, this._uiMaterialIns);
      }
    }, {
      key: "_flushAssembler",
      value: function _flushAssembler() {
        var assembler = Graphics.Assembler.getAssembler(this);

        if (this._assembler !== assembler) {
          this._assembler = assembler;
        }
      }
    }, {
      key: "_canRender",
      value: function _canRender() {
        if (!_get(_getPrototypeOf(Graphics.prototype), "_canRender", this).call(this)) {
          return false;
        }

        return !!this.model && this._isDrawing;
      }
    }, {
      key: "_attachToScene",
      value: function _attachToScene() {
        var renderScene = _director.director.root.ui.renderScene;

        if (!this.model || this.model.scene === renderScene) {
          return;
        }

        if (this.model.scene !== null) {
          this._detachFromScene();
        }

        renderScene.addModel(this.model);
      }
    }, {
      key: "_detachFromScene",
      value: function _detachFromScene() {
        if (this.model && this.model.scene) {
          this.model.scene.removeModel(this.model);
          this.model.scene = null;
        }
      }
    }, {
      key: "_rebuildModel",
      value: function _rebuildModel() {
        if (!this.model) {
          this.model = _director.director.root.createModel(_index4.scene.Model);
          this.model.node = this.model.transform = this.node;
        } else if (!this.model.inited) {
          this.model.initialize();
        }
      }
    }]);

    return Graphics;
  }(_uiRenderable.UIRenderable), _class3.LineJoin = _types.LineJoin, _class3.LineCap = _types.LineCap, _temp), (_applyDecoratedDescriptor(_class2.prototype, "lineWidth", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "lineWidth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "lineJoin", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "lineJoin"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "lineCap", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "lineCap"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "strokeColor", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "strokeColor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fillColor", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "fillColor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "miterLimit", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "miterLimit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "color", [_index2.override, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_lineWidth", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_strokeColor", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index3.Color.BLACK.clone();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_lineJoin", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _types.LineJoin.MITER;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_lineCap", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _types.LineCap.BUTT;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_fillColor", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index3.Color.WHITE.clone();
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_miterLimit", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 10;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.Graphics = Graphics;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvZ3JhcGhpY3MudHMiXSwibmFtZXMiOlsiX21hdEluc0luZm8iLCJwYXJlbnQiLCJvd25lciIsInN1Yk1vZGVsSWR4IiwiYXR0cmlidXRlcyIsInZmbXQiLCJjb25jYXQiLCJHRlhBdHRyaWJ1dGUiLCJHRlhGb3JtYXQiLCJSMzJGIiwic3RyaWRlIiwiR3JhcGhpY3MiLCJMaW5lSm9pbiIsIkxpbmVDYXAiLCJfbGluZVdpZHRoIiwidmFsdWUiLCJpbXBsIiwibGluZVdpZHRoIiwiX2xpbmVKb2luIiwibGluZUpvaW4iLCJfbGluZUNhcCIsImxpbmVDYXAiLCJfc3Ryb2tlQ29sb3IiLCJzZXQiLCJzdHJva2VDb2xvciIsIl9maWxsQ29sb3IiLCJmaWxsQ29sb3IiLCJfbWl0ZXJMaW1pdCIsIl9jb2xvciIsIl91cGRhdGVDb2xvciIsIm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhIiwibW9kZWwiLCJfaXNEcmF3aW5nIiwiX3JlbmRlcmluZ01lc2hDYWNoZSIsIl9pbnN0YW5jZU1hdGVyaWFsVHlwZSIsIkluc3RhbmNlTWF0ZXJpYWxUeXBlIiwiQUREX0NPTE9SIiwiX3VpTWF0ZXJpYWxEaXJ0eSIsIl9mbHVzaEFzc2VtYmxlciIsIl9hc3NlbWJsZXIiLCJjcmVhdGVJbXBsIiwiX3NjZW5lR2V0dGVyIiwiZGlyZWN0b3IiLCJyb290IiwidWkiLCJnZXRSZW5kZXJTY2VuZUdldHRlciIsIl9yZWJ1aWxkTW9kZWwiLCJoZWxwSW5zdGFuY2VNYXRlcmlhbCIsIl9kZXRhY2hGcm9tU2NlbmUiLCJkZXN0cm95IiwiZGVzdHJveU1vZGVsIiwibGVuZ3RoIiwibGVuIiwiaSIsInJlbmRlck1lc2giLCJ2ZXJ0ZXhCdWZmZXJzIiwiaW5kZXhCdWZmZXIiLCJjbGVhciIsIngiLCJ5IiwibW92ZVRvIiwibGluZVRvIiwiYzF4IiwiYzF5IiwiYzJ4IiwiYzJ5IiwiYmV6aWVyQ3VydmVUbyIsImN4IiwiY3kiLCJxdWFkcmF0aWNDdXJ2ZVRvIiwiciIsInN0YXJ0QW5nbGUiLCJlbmRBbmdsZSIsImNvdW50ZXJjbG9ja3dpc2UiLCJhcmMiLCJyeCIsInJ5IiwiZWxsaXBzZSIsImNpcmNsZSIsInciLCJoIiwicmVjdCIsInJvdW5kUmVjdCIsImZpbGwiLCJjbGVhbiIsImNsb3NlIiwic3Ryb2tlIiwiX2F0dGFjaFRvU2NlbmUiLCJtYXQiLCJzaGFyZWRNYXRlcmlhbCIsIk1hdGVyaWFsSW5zdGFuY2UiLCJidWlsdGluUmVzTWdyIiwiZ2V0IiwicmVjb21waWxlU2hhZGVycyIsIlVTRV9MT0NBTCIsIl91aU1hdGVyaWFsIiwiX3VpTWF0ZXJpYWxJbnMiLCJpZHgiLCJjb25zb2xlIiwid2FybiIsIm5vZGUiLCJuYW1lIiwic3ViTW9kZWxzIiwiZ2Z4RGV2aWNlIiwibGVnYWN5Q0MiLCJkZXZpY2UiLCJ2ZXJ0ZXhCdWZmZXIiLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJWRVJURVgiLCJUUkFOU0ZFUl9EU1QiLCJHRlhNZW1vcnlVc2FnZUJpdCIsIkRFVklDRSIsIklOREVYIiwiUmVuZGVyaW5nU3ViTWVzaCIsIkdGWFByaW1pdGl2ZU1vZGUiLCJUUklBTkdMRV9MSVNUIiwic3ViTWVzaElkeCIsInB1c2giLCJpbml0U3ViTW9kZWwiLCJnZXRVSU1hdGVyaWFsSW5zdGFuY2UiLCJyZW5kZXIiLCJjb21taXRNb2RlbCIsImFzc2VtYmxlciIsIkFzc2VtYmxlciIsImdldEFzc2VtYmxlciIsInJlbmRlclNjZW5lIiwic2NlbmUiLCJhZGRNb2RlbCIsInJlbW92ZU1vZGVsIiwiY3JlYXRlTW9kZWwiLCJNb2RlbCIsInRyYW5zZm9ybSIsImluaXRlZCIsImluaXRpYWxpemUiLCJVSVJlbmRlcmFibGUiLCJlZGl0YWJsZSIsIm92ZXJyaWRlIiwic2VyaWFsaXphYmxlIiwiQ29sb3IiLCJCTEFDSyIsImNsb25lIiwiTUlURVIiLCJCVVRUIiwiV0hJVEUiXSwibWFw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bEcsS0FBMUI7QUFDSDs7O3lDQUU2QjtBQUMxQixZQUFJLEtBQUtBLEtBQUwsSUFBYyxLQUFLQSxLQUFMLENBQVdpRyxLQUE3QixFQUFvQztBQUNoQyxlQUFLakcsS0FBTCxDQUFXaUcsS0FBWCxDQUFpQkUsV0FBakIsQ0FBNkIsS0FBS25HLEtBQWxDO0FBQ0EsZUFBS0EsS0FBTCxDQUFXaUcsS0FBWCxHQUFtQixJQUFuQjtBQUNIO0FBQ0o7OztzQ0FFMEI7QUFDdkIsWUFBSSxDQUFDLEtBQUtqRyxLQUFWLEVBQWlCO0FBQ2IsZUFBS0EsS0FBTCxHQUFhVyxtQkFBU0MsSUFBVCxDQUFld0YsV0FBZixDQUEyQkgsY0FBTUksS0FBakMsQ0FBYjtBQUNBLGVBQUtyRyxLQUFMLENBQVdxRSxJQUFYLEdBQWtCLEtBQUtyRSxLQUFMLENBQVdzRyxTQUFYLEdBQXVCLEtBQUtqQyxJQUE5QztBQUNILFNBSEQsTUFHTyxJQUFJLENBQUMsS0FBS3JFLEtBQUwsQ0FBV3VHLE1BQWhCLEVBQXdCO0FBQzNCLGVBQUt2RyxLQUFMLENBQVd3RyxVQUFYO0FBQ0g7QUFDSjs7OztJQTVsQnlCQywwQixXQStJWjVILFEsR0FBV0EsZSxVQUNYQyxPLEdBQVVBLGMsc0VBdkl2QjRILGdCLHU1QkFzSEFDLGdCLHNLQW9CQUMsb0I7Ozs7O2FBQ3NCLEM7O21GQUN0QkEsb0I7Ozs7O2FBQ3dCQyxjQUFNQyxLQUFOLENBQVlDLEtBQVosRTs7Z0ZBQ3hCSCxvQjs7Ozs7YUFDcUIvSCxnQkFBU21JLEs7OytFQUM5Qkosb0I7Ozs7O2FBQ29COUgsZUFBUW1JLEk7O2lGQUM1Qkwsb0I7Ozs7O2FBQ3NCQyxjQUFNSyxLQUFOLENBQVlILEtBQVosRTs7a0ZBQ3RCSCxvQjs7Ozs7YUFDdUIsRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBidWlsdGluUmVzTWdyIH0gZnJvbSAnLi4vLi4vY29yZS8zZC9idWlsdGluJztcclxuaW1wb3J0IHsgSW5zdGFuY2VNYXRlcmlhbFR5cGUsIFVJUmVuZGVyYWJsZSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLXJlbmRlcmFibGUnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRpb25PcmRlciwgbWVudSwgdG9vbHRpcCwgdHlwZSwgdmlzaWJsZSwgb3ZlcnJpZGUsIGVkaXRhYmxlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBkaXJlY3RvciB9IGZyb20gJy4uLy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IElNYXRlcmlhbEluc3RhbmNlSW5mbywgTWF0ZXJpYWxJbnN0YW5jZSwgc2NlbmUgfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyJztcclxuaW1wb3J0IHsgSUFzc2VtYmxlciB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXIvdWkvYmFzZSc7XHJcbmltcG9ydCB7IFVJIH0gZnJvbSAnLi4vLi4vY29yZS9yZW5kZXJlci91aS91aSc7XHJcbmltcG9ydCB7IExpbmVDYXAsIExpbmVKb2luIH0gZnJvbSAnLi4vYXNzZW1ibGVyL2dyYXBoaWNzL3R5cGVzJztcclxuaW1wb3J0IHsgSW1wbCB9IGZyb20gJy4uL2Fzc2VtYmxlci9ncmFwaGljcy93ZWJnbC9pbXBsJztcclxuaW1wb3J0IHsgR0ZYRm9ybWF0LCBHRlhQcmltaXRpdmVNb2RlLCBHRlhBdHRyaWJ1dGUsIFJlbmRlcmluZ1N1Yk1lc2gsIEdGWERldmljZSwgR0ZYQnVmZmVyVXNhZ2VCaXQsIEdGWEJ1ZmZlckluZm8sIEdGWE1lbW9yeVVzYWdlQml0IH0gZnJvbSAnLi4vLi4vY29yZSc7XHJcbmltcG9ydCB7IHZmbXQsIGdldEF0dHJpYnV0ZVN0cmlkZSB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXIvdWkvdWktdmVydGV4LWZvcm1hdCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCBfbWF0SW5zSW5mbzogSU1hdGVyaWFsSW5zdGFuY2VJbmZvID0ge1xyXG4gICAgcGFyZW50OiBudWxsISxcclxuICAgIG93bmVyOiBudWxsISxcclxuICAgIHN1Yk1vZGVsSWR4OiAwLFxyXG59O1xyXG5cclxuY29uc3QgYXR0cmlidXRlcyA9IHZmbXQuY29uY2F0KFtcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoJ2FfZGlzdCcsIEdGWEZvcm1hdC5SMzJGKSxcclxuXSk7XHJcblxyXG5jb25zdCBzdHJpZGUgPSBnZXRBdHRyaWJ1dGVTdHJpZGUoYXR0cmlidXRlcyk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEdyYXBoaWNzIGNvbXBvbmVudC5cclxuICpcclxuICogQHpoXHJcbiAqIOiHquWumuS5ieWbvuW9ouexu1xyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkdyYXBoaWNzJylcclxuQGhlbHAoJ2kxOG46Y2MuR3JhcGhpY3MnKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5AbWVudSgnVUkvUmVuZGVyL0dyYXBoaWNzJylcclxuZXhwb3J0IGNsYXNzIEdyYXBoaWNzIGV4dGVuZHMgVUlSZW5kZXJhYmxlIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ3VycmVudCBsaW5lIHdpZHRoLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5b2T5YmN57q/5p2h5a695bqm44CCXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGxpbmVXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVXaWR0aDtcclxuICAgIH1cclxuICAgIHNldCBsaW5lV2lkdGggKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbGluZVdpZHRoID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltcGwpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltcGwubGluZVdpZHRoID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIERldGVybWluZXMgaG93IHR3byBjb25uZWN0aW5nIHNlZ21lbnRzIChvZiBsaW5lcywgYXJjcyBvciBjdXJ2ZXMpIHdpdGggbm9uLXplcm8gbGVuZ3RocyBpbiBhIHNoYXBlIGFyZSBqb2luZWQgdG9nZXRoZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnlKjmnaXorr7nva4y5Liq6ZW/5bqm5LiN5Li6MOeahOebuOi/numDqOWIhu+8iOe6v+aute+8jOWchuW8p++8jOabsue6v++8ieWmguS9lei/nuaOpeWcqOS4gOi1t+eahOWxnuaAp+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShMaW5lSm9pbilcclxuICAgIEB0b29sdGlwKCfkuKTmnaHnur/nm7jkuqTml7bvvIzmiYDliJvlu7rnmoTmi5Dop5LnsbvlnosnKVxyXG4gICAgZ2V0IGxpbmVKb2luICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGluZUpvaW47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxpbmVKb2luICh2YWx1ZTogTGluZUpvaW4pIHtcclxuICAgICAgICB0aGlzLl9saW5lSm9pbiA9IHZhbHVlO1xyXG4gICAgICAgIGlmICghdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW1wbC5saW5lSm9pbiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBEZXRlcm1pbmVzIGhvdyB0aGUgZW5kIHBvaW50cyBvZiBldmVyeSBsaW5lIGFyZSBkcmF3bi5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMh+WumuWmguS9lee7mOWItuavj+S4gOadoee6v+auteacq+err+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShMaW5lQ2FwKVxyXG4gICAgQHRvb2x0aXAoJ+e6v+adoeeahOe7k+adn+err+eCueagt+W8jycpXHJcbiAgICBnZXQgbGluZUNhcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVDYXA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxpbmVDYXAgKHZhbHVlOiBMaW5lQ2FwKSB7XHJcbiAgICAgICAgdGhpcy5fbGluZUNhcCA9IHZhbHVlO1xyXG4gICAgICAgIGlmICghdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW1wbC5saW5lQ2FwID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFN0cm9rZSBjb2xvci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOe6v+auteminOiJsuOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn56yU6Kem55qE6aKc6ImyJylcclxuICAgIC8vIEBjb25zdGdldFxyXG4gICAgZ2V0IHN0cm9rZUNvbG9yICgpOiBSZWFkb25seTxDb2xvcj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJva2VDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3Ryb2tlQ29sb3IgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltcGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc3Ryb2tlQ29sb3Iuc2V0KHZhbHVlKTtcclxuICAgICAgICB0aGlzLmltcGwuc3Ryb2tlQ29sb3IgPSB0aGlzLl9zdHJva2VDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRmlsbCBjb2xvci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWhq+WFheminOiJsuOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5aGr5YWF57uY55S755qE6aKc6ImyJylcclxuICAgIC8vIEBjb25zdGdldFxyXG4gICAgZ2V0IGZpbGxDb2xvciAoKTogUmVhZG9ubHk8Q29sb3I+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlsbENvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmaWxsQ29sb3IgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltcGwpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9maWxsQ29sb3Iuc2V0KHZhbHVlKTtcclxuICAgICAgICB0aGlzLmltcGwuZmlsbENvbG9yID0gdGhpcy5fZmlsbENvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHRoZSBtaXRlciBsaW1pdCByYXRpby5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruaWnOaOpemdoumZkOWItuavlOS+i+OAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5pyA5aSn5pac5o6l6ZW/5bqmJylcclxuICAgIGdldCBtaXRlckxpbWl0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWl0ZXJMaW1pdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWl0ZXJMaW1pdCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9taXRlckxpbWl0ID0gdmFsdWU7XHJcbiAgICAgICAgLy8gdGhpcy5pbXBsLm1pdGVyTGltaXQgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBAb3ZlcnJpZGVcclxuICAgIEB2aXNpYmxlKGZhbHNlKVxyXG4gICAgZ2V0IGNvbG9yICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbG9yICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2xvciA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29sb3Iuc2V0KHZhbHVlKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVDb2xvcigpO1xyXG4gICAgICAgIHRoaXMubWFya0ZvclVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIExpbmVKb2luID0gTGluZUpvaW47XHJcbiAgICBwdWJsaWMgc3RhdGljIExpbmVDYXAgPSBMaW5lQ2FwO1xyXG4gICAgcHVibGljIGltcGw6IEltcGwgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBtb2RlbDogc2NlbmUuTW9kZWwgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfbGluZVdpZHRoID0gMTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfc3Ryb2tlQ29sb3IgPSBDb2xvci5CTEFDSy5jbG9uZSgpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9saW5lSm9pbiA9IExpbmVKb2luLk1JVEVSO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9saW5lQ2FwID0gTGluZUNhcC5CVVRUO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9maWxsQ29sb3IgPSBDb2xvci5XSElURS5jbG9uZSgpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9taXRlckxpbWl0ID0gMTA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pc0RyYXdpbmcgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfcmVuZGVyaW5nTWVzaENhY2hlOiBSZW5kZXJpbmdTdWJNZXNoW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2luc3RhbmNlTWF0ZXJpYWxUeXBlID0gSW5zdGFuY2VNYXRlcmlhbFR5cGUuQUREX0NPTE9SO1xyXG4gICAgICAgIHRoaXMuX3VpTWF0ZXJpYWxEaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUmVzdG9yZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmx1c2hBc3NlbWJsZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9fcHJlbG9hZCAoKXtcclxuICAgICAgICBzdXBlci5fX3ByZWxvYWQoKTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5fZmx1c2hBc3NlbWJsZXIoKTtcclxuICAgICAgICB0aGlzLmltcGwgPSB0aGlzLl9hc3NlbWJsZXIgJiYgKHRoaXMuX2Fzc2VtYmxlciBhcyBJQXNzZW1ibGVyKS5jcmVhdGVJbXBsISh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpIHtcclxuICAgICAgICB0aGlzLl9zY2VuZUdldHRlciA9IGRpcmVjdG9yLnJvb3QhLnVpLmdldFJlbmRlclNjZW5lR2V0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5fcmVidWlsZE1vZGVsKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaGVscEluc3RhbmNlTWF0ZXJpYWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpe1xyXG4gICAgICAgIHRoaXMuX2RldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uRGVzdHJveSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9zY2VuZUdldHRlciA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yLnJvb3QhLmRlc3Ryb3lNb2RlbCh0aGlzLm1vZGVsKTtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fcmVuZGVyaW5nTWVzaENhY2hlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgbGVuID0gdGhpcy5fcmVuZGVyaW5nTWVzaENhY2hlLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyTWVzaCA9IHRoaXMuX3JlbmRlcmluZ01lc2hDYWNoZVtpXTtcclxuICAgICAgICAgICAgICAgIHJlbmRlck1lc2gudmVydGV4QnVmZmVyc1swXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJNZXNoLmluZGV4QnVmZmVyPy5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJNZXNoLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyaW5nTWVzaENhY2hlLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0RyYXdpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmltcGwuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLmltcGwgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBNb3ZlIHBhdGggc3RhcnQgcG9pbnQgdG8gKHgseSkuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnp7vliqjot6/lvoTotbfngrnliLDlnZDmoIcoeCwgeSnjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCAtIOenu+WKqOWdkOaghyB4IOi9tOOAglxyXG4gICAgICogQHBhcmFtIHkgLSDnp7vliqjlnZDmoIcgeSDovbTjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG1vdmVUbyAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltcGwubW92ZVRvKHgsIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGRzIGEgc3RyYWlnaHQgbGluZSB0byB0aGUgcGF0aC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOe7mOWItuebtOe6v+i3r+W+hOOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB4IC0g57uY5Yi26Lev5b6E5Z2Q5qCHIHgg6L2044CCXHJcbiAgICAgKiBAcGFyYW0geSAtIOe7mOWItui3r+W+hOWdkOaghyB5IOi9tOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGluZVRvICh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW1wbC5saW5lVG8oeCwgeSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEFkZHMgYSBjdWJpYyBCw6l6aWVyIGN1cnZlIHRvIHRoZSBwYXRoLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog57uY5Yi25LiJ5qyh6LSd6LWb5bCU5puy57q/6Lev5b6E44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGMxeCAtIOesrOS4gOS4quaOp+WItueCueeahOWdkOaghyB4IOi9tOOAglxyXG4gICAgICogQHBhcmFtIGMxeSAtIOesrOS4gOS4quaOp+WItueCueeahOWdkOaghyB5IOi9tOOAglxyXG4gICAgICogQHBhcmFtIGMyeCAtIOesrOS6jOS4quaOp+WItueCueeahOWdkOaghyB4IOi9tOOAglxyXG4gICAgICogQHBhcmFtIGMyeSAtIOesrOS6jOS4quaOp+WItueCueeahOWdkOaghyB5IOi9tOOAglxyXG4gICAgICogQHBhcmFtIHggLSDmnIDlkI7kuIDkuKrmjqfliLbngrnnmoTlnZDmoIcgeCDovbTjgIJcclxuICAgICAqIEBwYXJhbSB5IC0g5pyA5ZCO5LiA5Liq5o6n5Yi254K555qE5Z2Q5qCHIHkg6L2044CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBiZXppZXJDdXJ2ZVRvIChjMXg6IG51bWJlciwgYzF5OiBudW1iZXIsIGMyeDogbnVtYmVyLCBjMnk6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltcGwuYmV6aWVyQ3VydmVUbyhjMXgsIGMxeSwgYzJ4LCBjMnksIHgsIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGRzIGEgcXVhZHJhdGljIELDqXppZXIgY3VydmUgdG8gdGhlIHBhdGguXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnu5jliLbkuozmrKHotJ3otZvlsJTmm7Lnur/ot6/lvoTjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY3ggLSDotbflp4vmjqfliLbngrnnmoTlnZDmoIcgeCDovbTjgIJcclxuICAgICAqIEBwYXJhbSBjeSAtIOi1t+Wni+aOp+WItueCueeahOWdkOaghyB5IOi9tOOAglxyXG4gICAgICogQHBhcmFtIHggLSDnu4jngrnmjqfliLbngrnnmoTlnZDmoIcgeCDovbTjgIJcclxuICAgICAqIEBwYXJhbSB5IC0g57uI54K55o6n5Yi254K555qE5Z2Q5qCHIHgg6L2044CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBxdWFkcmF0aWNDdXJ2ZVRvIChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW1wbC5xdWFkcmF0aWNDdXJ2ZVRvKGN4LCBjeSwgeCwgeSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEFkZHMgYW4gYXJjIHRvIHRoZSBwYXRoIHdoaWNoIGlzIGNlbnRlcmVkIGF0IChjeCwgY3kpIHBvc2l0aW9uIHdpdGggcmFkaXVzIHIgc3RhcnRpbmcgYXQgc3RhcnRBbmdsZVxyXG4gICAgICogYW5kIGVuZGluZyBhdCBlbmRBbmdsZSBnb2luZyBpbiB0aGUgZ2l2ZW4gZGlyZWN0aW9uIGJ5IGNvdW50ZXJjbG9ja3dpc2UgKGRlZmF1bHRpbmcgdG8gZmFsc2UpLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog57uY5Yi25ZyG5byn6Lev5b6E44CC5ZyG5byn6Lev5b6E55qE5ZyG5b+D5ZyoIChjeCwgY3kpIOS9jee9ru+8jOWNiuW+hOS4uiByIO+8jOagueaNriBjb3VudGVyY2xvY2t3aXNlIO+8iOm7mOiupOS4umZhbHNl77yJ5oyH5a6a55qE5pa55ZCR5LuOIHN0YXJ0QW5nbGUg5byA5aeL57uY5Yi277yM5YiwIGVuZEFuZ2xlIOe7k+adn+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjeCAtIOS4reW/g+aOp+WItueCueeahOWdkOaghyB4IOi9tOOAglxyXG4gICAgICogQHBhcmFtIGN5IC0g5Lit5b+D5o6n5Yi254K555qE5Z2Q5qCHIHkg6L2044CCXHJcbiAgICAgKiBAcGFyYW0gciAtIOWchuW8p+W8p+W6puOAglxyXG4gICAgICogQHBhcmFtIHN0YXJ0QW5nbGUgLSDlvIDlp4vlvKfluqbvvIzku47mraMgeCDovbTpobrml7bpkojmlrnlkJHmtYvph4/jgIJcclxuICAgICAqIEBwYXJhbSBlbmRBbmdsZSAtIOe7k+adn+W8p+W6pu+8jOS7juatoyB4IOi9tOmhuuaXtumSiOaWueWQkea1i+mHj+OAglxyXG4gICAgICogQHBhcmFtIGNvdW50ZXJjbG9ja3dpc2Ug5aaC5p6c5Li655yf77yM5Zyo5Lik5Liq6KeS5bqm5LmL6Ze06YCG5pe26ZKI57uY5Yi244CC6buY6K6k6aG65pe26ZKI44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcmMgKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHI6IG51bWJlciwgc3RhcnRBbmdsZTogbnVtYmVyLCBlbmRBbmdsZTogbnVtYmVyLCBjb3VudGVyY2xvY2t3aXNlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltcGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbXBsLmFyYyhjeCwgY3ksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjb3VudGVyY2xvY2t3aXNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkcyBhbiBlbGxpcHNlIHRvIHRoZSBwYXRoLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog57uY5Yi25qSt5ZyG6Lev5b6E44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGN4IC0g5Lit5b+D54K555qE5Z2Q5qCHIHgg6L2044CCXHJcbiAgICAgKiBAcGFyYW0gY3kgLSDkuK3lv4PngrnnmoTlnZDmoIcgeSDovbTjgIJcclxuICAgICAqIEBwYXJhbSByeCAtIOakreWchiB4IOi9tOWNiuW+hOOAglxyXG4gICAgICogQHBhcmFtIHJ5IC0g5qSt5ZyGIHkg6L205Y2K5b6E44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbGxpcHNlIChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCByeDogbnVtYmVyLCByeTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltcGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbXBsLmVsbGlwc2UoY3gsIGN5LCByeCwgcnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGRzIGEgY2lyY2xlIHRvIHRoZSBwYXRoLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog57uY5Yi25ZyG5b2i6Lev5b6E44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGN4IC0g5Lit5b+D54K555qE5Z2Q5qCHIHgg6L2044CCXHJcbiAgICAgKiBAcGFyYW0gY3kgLSDkuK3lv4PngrnnmoTlnZDmoIcgeSDovbTjgIJcclxuICAgICAqIEBwYXJhbSByIC0g5ZyG5Y2K5b6E44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjaXJjbGUgKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHI6IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW1wbC5jaXJjbGUoY3gsIGN5LCByKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkcyBhIHJlY3RhbmdsZSB0byB0aGUgcGF0aC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOe7mOWItuefqeW9oui3r+W+hOOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB4IC0g55+p5b2i6LW35aeL5Z2Q5qCHIHgg6L2044CCXHJcbiAgICAgKiBAcGFyYW0geSAtIOefqeW9oui1t+Wni+WdkOaghyB5IOi9tOOAglxyXG4gICAgICogQHBhcmFtIHcgLSDnn6nlvaLlrr3luqbjgIJcclxuICAgICAqIEBwYXJhbSBoIC0g55+p5b2i6auY5bqm44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWN0ICh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltcGwucmVjdCh4LCB5LCB3LCBoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkcyBhIHJvdW5kIGNvcm5lciByZWN0YW5nbGUgdG8gdGhlIHBhdGguXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnu5jliLblnIbop5Lnn6nlvaLot6/lvoTjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCAtIOefqeW9oui1t+Wni+WdkOaghyB4IOi9tOOAglxyXG4gICAgICogQHBhcmFtIHkgLSDnn6nlvaLotbflp4vlnZDmoIcgeSDovbTjgIJcclxuICAgICAqIEBwYXJhbSB3IC0g55+p5b2i5a695bqm44CCXHJcbiAgICAgKiBAcGFyYW0gaCAtIOefqeW9oumrmOW6puOAglxyXG4gICAgICogQHBhcmFtIHIgLSDnn6nlvaLlnIbop5LljYrlvoTjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJvdW5kUmVjdCAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCByOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltcGwucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBEcmF3cyBhIGZpbGxlZCByZWN0YW5nbGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnu5jliLbloavlhYXnn6nlvaLjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCAtIOefqeW9oui1t+Wni+WdkOaghyB4IOi9tOOAglxyXG4gICAgICogQHBhcmFtIHkgLSDnn6nlvaLotbflp4vlnZDmoIcgeSDovbTjgIJcclxuICAgICAqIEBwYXJhbSB3IC0g55+p5b2i5a695bqm44CCXHJcbiAgICAgKiBAcGFyYW0gaCAtIOefqeW9oumrmOW6puOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZmlsbFJlY3QgKHgsIHksIHcsIGgpIHtcclxuICAgICAgICB0aGlzLnJlY3QoeCwgeSwgdywgaCk7XHJcbiAgICAgICAgdGhpcy5maWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEVyYXNpbmcgYW55IHByZXZpb3VzbHkgZHJhd24gY29udGVudC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaTpumZpOS5i+WJjee7mOWItueahOaJgOacieWGheWuueeahOaWueazleOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXIgKGNsZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltcGwuY2xlYXIoY2xlYW4pO1xyXG4gICAgICAgIHRoaXMuX2lzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWJ1aWxkTW9kZWwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2RldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgICAgIHRoaXMubWFya0ZvclVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ2F1c2VzIHRoZSBwb2ludCBvZiB0aGUgcGVuIHRvIG1vdmUgYmFjayB0byB0aGUgc3RhcnQgb2YgdGhlIGN1cnJlbnQgcGF0aC5cclxuICAgICAqIEl0IHRyaWVzIHRvIGFkZCBhIHN0cmFpZ2h0IGxpbmUgZnJvbSB0aGUgY3VycmVudCBwb2ludCB0byB0aGUgc3RhcnQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbnrJTngrnov5Tlm57liLDlvZPliY3ot6/lvoTotbflp4vngrnnmoTjgILlroPlsJ3or5Xku47lvZPliY3ngrnliLDotbflp4vngrnnu5jliLbkuIDmnaHnm7Tnur/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsb3NlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmltcGwuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3Ryb2tlcyB0aGUgY3VycmVudCBvciBnaXZlbiBwYXRoIHdpdGggdGhlIGN1cnJlbnQgc3Ryb2tlIHN0eWxlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5qC55o2u5b2T5YmN55qE55S757q/5qC35byP77yM57uY5Yi25b2T5YmN5oiW5bey57uP5a2Y5Zyo55qE6Lev5b6E44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdHJva2UgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fYXNzZW1ibGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsdXNoQXNzZW1ibGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICAgICh0aGlzLl9hc3NlbWJsZXIgYXMgSUFzc2VtYmxlcikuc3Ryb2tlISh0aGlzKTtcclxuICAgICAgICB0aGlzLl9hdHRhY2hUb1NjZW5lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEZpbGxzIHRoZSBjdXJyZW50IG9yIGdpdmVuIHBhdGggd2l0aCB0aGUgY3VycmVudCBmaWxsIHN0eWxlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5qC55o2u5b2T5YmN55qE55S757q/5qC35byP77yM5aGr5YWF5b2T5YmN5oiW5bey57uP5a2Y5Zyo55qE6Lev5b6E44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaWxsICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2Fzc2VtYmxlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9mbHVzaEFzc2VtYmxlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICAodGhpcy5fYXNzZW1ibGVyIGFzIElBc3NlbWJsZXIpLmZpbGwhKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2F0dGFjaFRvU2NlbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTWFudWFsIGluc3RhbmNlIG1hdGVyaWFsLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L6F5Yqp5p2Q6LSo5a6e5L6L5YyW44CC5Y+v55So5LqO5Y+q5Y+W5pWw5o2u6ICM5peg5a6e5L2T5oOF5Ya15LiL5riy5p+T5L2/55So44CC54m55q6K5oOF5Ya15Y+v5Y+C6ICD77yaW1tpbnN0YW5jZU1hdGVyaWFsXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGhlbHBJbnN0YW5jZU1hdGVyaWFsICgpIHtcclxuICAgICAgICBsZXQgbWF0OiBNYXRlcmlhbEluc3RhbmNlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgX21hdEluc0luZm8ub3duZXIgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLnNoYXJlZE1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgIF9tYXRJbnNJbmZvLnBhcmVudCA9IHRoaXMuc2hhcmVkTWF0ZXJpYWxbMF07XHJcbiAgICAgICAgICAgIG1hdCA9IG5ldyBNYXRlcmlhbEluc3RhbmNlKF9tYXRJbnNJbmZvKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfbWF0SW5zSW5mby5wYXJlbnQgPSBidWlsdGluUmVzTWdyLmdldCgndWktZ3JhcGhpY3MtbWF0ZXJpYWwnKTtcclxuICAgICAgICAgICAgbWF0ID0gbmV3IE1hdGVyaWFsSW5zdGFuY2UoX21hdEluc0luZm8pO1xyXG4gICAgICAgICAgICBtYXQucmVjb21waWxlU2hhZGVycyh7IFVTRV9MT0NBTDogdHJ1ZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VpTWF0ZXJpYWwgPSBfbWF0SW5zSW5mby5wYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5fdWlNYXRlcmlhbElucyA9IG1hdDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltcGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9mbHVzaEFzc2VtYmxlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmltcGwgPSB0aGlzLl9hc3NlbWJsZXIgJiYgKHRoaXMuX2Fzc2VtYmxlciBhcyBJQXNzZW1ibGVyKS5jcmVhdGVJbXBsISh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2ZVN1Yk1vZGVsIChpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFRoZXJlIGlzIG5vIG1vZGVsIGluICR7dGhpcy5ub2RlLm5hbWV9YCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLnN1Yk1vZGVscy5sZW5ndGggPD0gaWR4KSB7XHJcbiAgICAgICAgICAgIGxldCByZW5kZXJNZXNoOiBSZW5kZXJpbmdTdWJNZXNoO1xyXG4gICAgICAgICAgICBjb25zdCBsZW4gPSB0aGlzLl9yZW5kZXJpbmdNZXNoQ2FjaGUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAobGVuID4gMCAmJiBsZW4gPiBpZHgpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlck1lc2ggPSB0aGlzLl9yZW5kZXJpbmdNZXNoQ2FjaGVbaWR4XTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdmeERldmljZTogR0ZYRGV2aWNlID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5kZXZpY2U7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBnZnhEZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LlZFUlRFWCB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgICAgICAgICAgNjU1MzUgKiBzdHJpZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaWRlLFxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleEJ1ZmZlciA9IGdmeERldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ERVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICAgICAgICAgIDY1NTM1ICogMixcclxuICAgICAgICAgICAgICAgICAgICAyLFxyXG4gICAgICAgICAgICAgICAgKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVuZGVyTWVzaCA9IG5ldyBSZW5kZXJpbmdTdWJNZXNoKFt2ZXJ0ZXhCdWZmZXJdLCBhdHRyaWJ1dGVzLCBHRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX0xJU1QsIGluZGV4QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlck1lc2guc3ViTWVzaElkeCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJpbmdNZXNoQ2FjaGUucHVzaChyZW5kZXJNZXNoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5pbml0U3ViTW9kZWwoaWR4LCByZW5kZXJNZXNoLCB0aGlzLmdldFVJTWF0ZXJpYWxJbnN0YW5jZSgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZW5kZXIgKHJlbmRlcjogVUkpIHtcclxuICAgICAgICByZW5kZXIuY29tbWl0TW9kZWwodGhpcywgdGhpcy5tb2RlbCwgdGhpcy5fdWlNYXRlcmlhbElucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9mbHVzaEFzc2VtYmxlciAoKXtcclxuICAgICAgICBjb25zdCBhc3NlbWJsZXIgPSBHcmFwaGljcy5Bc3NlbWJsZXIhLmdldEFzc2VtYmxlcih0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VtYmxlciAhPT0gYXNzZW1ibGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlciA9IGFzc2VtYmxlcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYW5SZW5kZXIgKCl7XHJcbiAgICAgICAgaWYgKCFzdXBlci5fY2FuUmVuZGVyKCkpe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gISF0aGlzLm1vZGVsICYmIHRoaXMuX2lzRHJhd2luZztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2F0dGFjaFRvU2NlbmUgKCkge1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclNjZW5lID0gZGlyZWN0b3Iucm9vdCEudWkucmVuZGVyU2NlbmU7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1vZGVsIHx8IHRoaXMubW9kZWwhLnNjZW5lID09PSByZW5kZXJTY2VuZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5tb2RlbCEuc2NlbmUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGV0YWNoRnJvbVNjZW5lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlclNjZW5lLmFkZE1vZGVsKHRoaXMubW9kZWwhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldGFjaEZyb21TY2VuZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwgJiYgdGhpcy5tb2RlbC5zY2VuZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNjZW5lLnJlbW92ZU1vZGVsKHRoaXMubW9kZWwpO1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNjZW5lID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZWJ1aWxkTW9kZWwgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gZGlyZWN0b3Iucm9vdCEuY3JlYXRlTW9kZWwoc2NlbmUuTW9kZWwpO1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLm5vZGUgPSB0aGlzLm1vZGVsLnRyYW5zZm9ybSA9IHRoaXMubm9kZTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1vZGVsLmluaXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmluaXRpYWxpemUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19