(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/components/ui-base/ui-renderable.js", "../../core/math/index.js", "../../core/platform/index.js", "../../core/platform/visible-rect.js", "../../core/scene-graph/index.js", "../../core/value-types/enum.js", "./graphics.js", "../../core/index.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/components/ui-base/ui-renderable.js"), require("../../core/math/index.js"), require("../../core/platform/index.js"), require("../../core/platform/visible-rect.js"), require("../../core/scene-graph/index.js"), require("../../core/value-types/enum.js"), require("./graphics.js"), require("../../core/index.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.uiRenderable, global.index, global.index, global.visibleRect, global.index, global._enum, global.graphics, global.index, global.globalExports);
    global.mask = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _uiRenderable, _index2, _index3, _visibleRect, _index4, _enum, _graphics, _index5, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Mask = _exports.MaskType = void 0;
  _visibleRect = _interopRequireDefault(_visibleRect);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

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

  var _worldMatrix = new _index2.Mat4();

  var _vec2_temp = new _index2.Vec2();

  var _mat4_temp = new _index2.Mat4();

  var _circlePoints = [];

  function _calculateCircle(center, radius, segments) {
    _circlePoints.length = 0;
    var anglePerStep = Math.PI * 2 / segments;

    for (var step = 0; step < segments; ++step) {
      _circlePoints.push(new _index2.Vec3(radius.x * Math.cos(anglePerStep * step) + center.x, radius.y * Math.sin(anglePerStep * step) + center.y, 0));
    }

    return _circlePoints;
  }
  /**
   * @en The type for mask.
   *
   * @zh 遮罩组件类型。
   */


  var MaskType;
  _exports.MaskType = MaskType;

  (function (MaskType) {
    MaskType[MaskType["RECT"] = 0] = "RECT";
    MaskType[MaskType["ELLIPSE"] = 1] = "ELLIPSE";
    MaskType[MaskType["GRAPHICS_STENCIL"] = 2] = "GRAPHICS_STENCIL";
  })(MaskType || (_exports.MaskType = MaskType = {}));

  (0, _enum.ccenum)(MaskType);
  var SEGMENTS_MIN = 3;
  var SEGMENTS_MAX = 10000;
  /**
   * @en
   * The Mask Component.
   *
   * @zh
   * 遮罩组件。
   */

  var Mask = (_dec = (0, _index.ccclass)('cc.Mask'), _dec2 = (0, _index.help)('i18n:cc.Mask'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/Render/Mask'), _dec5 = (0, _index.type)(MaskType), _dec6 = (0, _index.displayOrder)(4), _dec7 = (0, _index.tooltip)('遮罩类型'), _dec8 = (0, _index.tooltip)('反向遮罩'), _dec9 = (0, _index.visible)(false), _dec10 = (0, _index.visible)(false), _dec11 = (0, _index.visible)(false), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_UIRenderable) {
    _inherits(Mask, _UIRenderable);

    _createClass(Mask, [{
      key: "type",

      /**
       * @en
       * The mask type.
       *
       * @zh
       * 遮罩类型。
       */
      get: function get() {
        return this._type;
      },
      set: function set(value) {
        if (this._type === value) {
          return;
        }

        this._type = value;

        this._updateGraphics();

        if (this._renderData) {
          this.destroyRenderData();
          this._renderData = null;
        }
      }
      /**
       * @en
       * Reverse mask (Not supported Canvas Mode)
       * .
       * @zh
       * 反向遮罩（不支持 Canvas 模式）。
       */

    }, {
      key: "inverted",
      get: function get() {
        return this._inverted;
      },
      set: function set(value) {
        if (_globalExports.legacyCC.game.renderType === _index5.Game.RENDER_TYPE_CANVAS) {
          (0, _index3.warnID)(4202);
          return;
        }

        this._inverted = value;
      }
      /**
       * @en
       * The segments for ellipse mask.
       *
       * TODO: remove segments, not supported by graphics
       * @zh
       * 椭圆遮罩的曲线细分数。
       */

    }, {
      key: "segments",
      get: function get() {
        return this._segments;
      },
      set: function set(value) {
        if (this._segments === value) {
          return;
        }

        this._segments = (0, _index2.clamp)(value, SEGMENTS_MIN, SEGMENTS_MAX);

        this._updateGraphics();
      }
    }, {
      key: "graphics",
      get: function get() {
        return this._graphics;
      }
    }, {
      key: "clearGraphics",
      get: function get() {
        return this._clearGraphics;
      }
    }, {
      key: "dstBlendFactor",
      get: function get() {
        return this._dstBlendFactor;
      },
      set: function set(value) {
        if (this._dstBlendFactor === value) {
          return;
        }

        this._dstBlendFactor = value;

        this._updateBlendFunc();
      }
    }, {
      key: "srcBlendFactor",
      get: function get() {
        return this._srcBlendFactor;
      },
      set: function set(value) {
        if (this._srcBlendFactor === value) {
          return;
        }

        this._srcBlendFactor = value;

        this._updateBlendFunc();
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

        this.markForUpdateRenderData();
      }
    }]);

    function Mask() {
      var _this;

      _classCallCheck(this, Mask);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Mask).call(this));

      _initializerDefineProperty(_this, "_type", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_inverted", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_segments", _descriptor3, _assertThisInitialized(_this));

      _this._graphics = null;
      _this._clearGraphics = null;
      _this._instanceMaterialType = _uiRenderable.InstanceMaterialType.ADD_COLOR;
      _this._uiMaterialDirty = true;
      return _this;
    }

    _createClass(Mask, [{
      key: "onLoad",
      value: function onLoad() {
        this._createGraphics();

        if (this._clearGraphics) {
          this._clearGraphics.onLoad();
        }

        if (this._graphics) {
          this._graphics.onLoad();
        }
      }
      /**
       * @zh
       * 图形内容重塑。
       */

    }, {
      key: "onRestore",
      value: function onRestore() {
        this._createGraphics();

        this._updateGraphics();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        _get(_getPrototypeOf(Mask.prototype), "onEnable", this).call(this);

        this._enableGraphics();

        _index3.view.on('design-resolution-changed', this._updateClearGraphics, this);
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        _get(_getPrototypeOf(Mask.prototype), "onDisable", this).call(this);

        this._disableGraphics();

        _index3.view.off('design-resolution-changed', this._updateClearGraphics);
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _get(_getPrototypeOf(Mask.prototype), "onDestroy", this).call(this);

        this._removeGraphics();
      }
      /**
       * @zh
       * 根据屏幕坐标计算点击事件。
       *
       * @param cameraPt  屏幕点转换到相机坐标系下的点。
       */

    }, {
      key: "isHit",
      value: function isHit(cameraPt) {
        var uiTrans = this.node._uiProps.uiTransformComp;
        var size = uiTrans.contentSize;
        var w = size.width;
        var h = size.height;
        var testPt = _vec2_temp;
        this.node.getWorldMatrix(_worldMatrix);

        _index2.Mat4.invert(_mat4_temp, _worldMatrix);

        _index2.Vec2.transformMat4(testPt, cameraPt, _mat4_temp);

        var ap = uiTrans.anchorPoint;
        testPt.x += ap.x * w;
        testPt.y += ap.y * h;
        var result = false;

        if (this.type === MaskType.RECT || this.type === MaskType.GRAPHICS_STENCIL) {
          result = testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
        } else if (this.type === MaskType.ELLIPSE) {
          var rx = w / 2;
          var ry = h / 2;
          var px = testPt.x - 0.5 * w;
          var py = testPt.y - 0.5 * h;
          result = px * px / (rx * rx) + py * py / (ry * ry) < 1;
        }

        if (this._inverted) {
          result = !result;
        }

        return result;
      }
    }, {
      key: "_render",
      value: function _render(render) {
        render.commitComp(this, null, this._assembler);
      }
    }, {
      key: "_postRender",
      value: function _postRender(render) {
        if (!this._postAssembler) {
          return;
        }

        render.commitComp(this, null, this._postAssembler);
      }
    }, {
      key: "_nodeStateChange",
      value: function _nodeStateChange(type) {
        _get(_getPrototypeOf(Mask.prototype), "_nodeStateChange", this).call(this, type);

        this._updateGraphics();
      }
    }, {
      key: "_resolutionChanged",
      value: function _resolutionChanged() {
        this._updateClearGraphics();
      }
    }, {
      key: "_canRender",
      value: function _canRender() {
        if (!_get(_getPrototypeOf(Mask.prototype), "_canRender", this).call(this)) {
          return false;
        }

        return this._clearGraphics !== null && this._graphics !== null;
      }
    }, {
      key: "_flushAssembler",
      value: function _flushAssembler() {
        var assembler = Mask.Assembler.getAssembler(this);
        var posAssembler = Mask.PostAssembler.getAssembler(this);

        if (this._assembler !== assembler) {
          this.destroyRenderData();
          this._assembler = assembler;
        }

        if (this._postAssembler !== posAssembler) {
          this._postAssembler = posAssembler;
        }

        if (!this._renderData) {
          if (this._assembler && this._assembler.createData) {
            this._renderData = this._assembler.createData(this);
            this._renderData.material = this.sharedMaterial;
            this.markForUpdateRenderData();
          }
        }
      }
    }, {
      key: "_createGraphics",
      value: function _createGraphics() {
        if (!this._clearGraphics) {
          var node = new _index4.Node('clear-graphics');
          var clearGraphics = this._clearGraphics = node.addComponent(_graphics.Graphics);
          clearGraphics.delegateSrc = this.node;
          clearGraphics.lineWidth = 0;

          var color = _index2.Color.WHITE.clone();

          color.a = 0;
          clearGraphics.fillColor = color;
        }

        if (!this._graphics) {
          var graphics = this._graphics = new _graphics.Graphics();
          graphics.node = this.node;
          graphics.node.getWorldMatrix();
          graphics.lineWidth = 0;

          var _color = _index2.Color.WHITE.clone();

          _color.a = 0;
          graphics.fillColor = _color;
        }
      }
    }, {
      key: "_updateClearGraphics",
      value: function _updateClearGraphics() {
        if (!this._clearGraphics) {
          return;
        }

        var size = _visibleRect.default;

        this._clearGraphics.node.setWorldPosition(size.width / 2, size.height / 2, 0);

        this._clearGraphics.clear();

        this._clearGraphics.rect(-size.width / 2, -size.height / 2, size.width, size.height);

        this._clearGraphics.fill();
      }
    }, {
      key: "_updateGraphics",
      value: function _updateGraphics() {
        if (!this._graphics) {
          return;
        }

        var uiTrans = this.node._uiProps.uiTransformComp;
        var graphics = this._graphics; // Share render data with graphics content

        graphics.clear();
        var size = uiTrans.contentSize;
        var width = size.width;
        var height = size.height;
        var ap = uiTrans.anchorPoint;
        var x = -width * ap.x;
        var y = -height * ap.y;

        if (this._type === MaskType.RECT) {
          graphics.rect(x, y, width, height);
        } else if (this._type === MaskType.ELLIPSE) {
          var center = new _index2.Vec3(x + width / 2, y + height / 2, 0);
          var radius = new _index2.Vec3(width / 2, height / 2, 0);

          var points = _calculateCircle(center, radius, this._segments);

          for (var i = 0; i < points.length; ++i) {
            var point = points[i];

            if (i === 0) {
              graphics.moveTo(point.x, point.y);
            } else {
              graphics.lineTo(point.x, point.y);
            }
          }

          graphics.close();
        }

        graphics.fill();
      }
    }, {
      key: "_enableGraphics",
      value: function _enableGraphics() {
        if (this._clearGraphics) {
          this._clearGraphics.onEnable();

          this._updateClearGraphics();
        }

        if (this._graphics) {
          this._graphics.onEnable();

          this._updateGraphics();
        }
      }
    }, {
      key: "_disableGraphics",
      value: function _disableGraphics() {
        if (this._graphics) {
          this._graphics.onDisable();
        }

        if (this._clearGraphics) {
          this._clearGraphics.onDisable();
        }
      }
    }, {
      key: "_removeGraphics",
      value: function _removeGraphics() {
        if (this._graphics) {
          this._graphics.destroy();
        }

        if (this._clearGraphics) {
          this._clearGraphics.destroy();
        }
      }
    }]);

    return Mask;
  }(_uiRenderable.UIRenderable), _class3.Type = MaskType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "type", [_dec5, _dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "inverted", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "inverted"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "segments", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "segments"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dstBlendFactor", [_index.override, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "dstBlendFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "srcBlendFactor", [_index.override, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "srcBlendFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "color", [_index.override, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_type", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return MaskType.RECT;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_inverted", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_segments", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 64;
    }
  })), _class2)) || _class) || _class) || _class) || _class); // tslint:disable-next-line

  _exports.Mask = Mask;
  _globalExports.legacyCC.Mask = Mask;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvbWFzay50cyJdLCJuYW1lcyI6WyJfd29ybGRNYXRyaXgiLCJNYXQ0IiwiX3ZlYzJfdGVtcCIsIlZlYzIiLCJfbWF0NF90ZW1wIiwiX2NpcmNsZVBvaW50cyIsIl9jYWxjdWxhdGVDaXJjbGUiLCJjZW50ZXIiLCJyYWRpdXMiLCJzZWdtZW50cyIsImxlbmd0aCIsImFuZ2xlUGVyU3RlcCIsIk1hdGgiLCJQSSIsInN0ZXAiLCJwdXNoIiwiVmVjMyIsIngiLCJjb3MiLCJ5Iiwic2luIiwiTWFza1R5cGUiLCJTRUdNRU5UU19NSU4iLCJTRUdNRU5UU19NQVgiLCJNYXNrIiwiX3R5cGUiLCJ2YWx1ZSIsIl91cGRhdGVHcmFwaGljcyIsIl9yZW5kZXJEYXRhIiwiZGVzdHJveVJlbmRlckRhdGEiLCJfaW52ZXJ0ZWQiLCJsZWdhY3lDQyIsImdhbWUiLCJyZW5kZXJUeXBlIiwiR2FtZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsIl9zZWdtZW50cyIsIl9ncmFwaGljcyIsIl9jbGVhckdyYXBoaWNzIiwiX2RzdEJsZW5kRmFjdG9yIiwiX3VwZGF0ZUJsZW5kRnVuYyIsIl9zcmNCbGVuZEZhY3RvciIsIl9jb2xvciIsInNldCIsIm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhIiwiX2luc3RhbmNlTWF0ZXJpYWxUeXBlIiwiSW5zdGFuY2VNYXRlcmlhbFR5cGUiLCJBRERfQ09MT1IiLCJfdWlNYXRlcmlhbERpcnR5IiwiX2NyZWF0ZUdyYXBoaWNzIiwib25Mb2FkIiwiX2VuYWJsZUdyYXBoaWNzIiwidmlldyIsIm9uIiwiX3VwZGF0ZUNsZWFyR3JhcGhpY3MiLCJfZGlzYWJsZUdyYXBoaWNzIiwib2ZmIiwiX3JlbW92ZUdyYXBoaWNzIiwiY2FtZXJhUHQiLCJ1aVRyYW5zIiwibm9kZSIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwic2l6ZSIsImNvbnRlbnRTaXplIiwidyIsIndpZHRoIiwiaCIsImhlaWdodCIsInRlc3RQdCIsImdldFdvcmxkTWF0cml4IiwiaW52ZXJ0IiwidHJhbnNmb3JtTWF0NCIsImFwIiwiYW5jaG9yUG9pbnQiLCJyZXN1bHQiLCJ0eXBlIiwiUkVDVCIsIkdSQVBISUNTX1NURU5DSUwiLCJFTExJUFNFIiwicngiLCJyeSIsInB4IiwicHkiLCJyZW5kZXIiLCJjb21taXRDb21wIiwiX2Fzc2VtYmxlciIsIl9wb3N0QXNzZW1ibGVyIiwiYXNzZW1ibGVyIiwiQXNzZW1ibGVyIiwiZ2V0QXNzZW1ibGVyIiwicG9zQXNzZW1ibGVyIiwiUG9zdEFzc2VtYmxlciIsImNyZWF0ZURhdGEiLCJtYXRlcmlhbCIsInNoYXJlZE1hdGVyaWFsIiwiTm9kZSIsImNsZWFyR3JhcGhpY3MiLCJhZGRDb21wb25lbnQiLCJHcmFwaGljcyIsImRlbGVnYXRlU3JjIiwibGluZVdpZHRoIiwiY29sb3IiLCJDb2xvciIsIldISVRFIiwiY2xvbmUiLCJhIiwiZmlsbENvbG9yIiwiZ3JhcGhpY3MiLCJ2aXNpYmxlUmVjdCIsInNldFdvcmxkUG9zaXRpb24iLCJjbGVhciIsInJlY3QiLCJmaWxsIiwicG9pbnRzIiwiaSIsInBvaW50IiwibW92ZVRvIiwibGluZVRvIiwiY2xvc2UiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsImRlc3Ryb3kiLCJVSVJlbmRlcmFibGUiLCJUeXBlIiwiZWRpdGFibGUiLCJvdmVycmlkZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQ0EsTUFBTUEsWUFBWSxHQUFHLElBQUlDLFlBQUosRUFBckI7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHLElBQUlDLFlBQUosRUFBbkI7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHLElBQUlILFlBQUosRUFBbkI7O0FBRUEsTUFBTUksYUFBcUIsR0FBRyxFQUE5Qjs7QUFDQSxXQUFTQyxnQkFBVCxDQUEyQkMsTUFBM0IsRUFBeUNDLE1BQXpDLEVBQXVEQyxRQUF2RCxFQUF5RTtBQUNyRUosSUFBQUEsYUFBYSxDQUFDSyxNQUFkLEdBQXVCLENBQXZCO0FBQ0EsUUFBTUMsWUFBWSxHQUFHQyxJQUFJLENBQUNDLEVBQUwsR0FBVSxDQUFWLEdBQWNKLFFBQW5DOztBQUNBLFNBQUssSUFBSUssSUFBSSxHQUFHLENBQWhCLEVBQW1CQSxJQUFJLEdBQUdMLFFBQTFCLEVBQW9DLEVBQUVLLElBQXRDLEVBQTRDO0FBQ3hDVCxNQUFBQSxhQUFhLENBQUNVLElBQWQsQ0FBbUIsSUFBSUMsWUFBSixDQUFTUixNQUFNLENBQUNTLENBQVAsR0FBV0wsSUFBSSxDQUFDTSxHQUFMLENBQVNQLFlBQVksR0FBR0csSUFBeEIsQ0FBWCxHQUEyQ1AsTUFBTSxDQUFDVSxDQUEzRCxFQUNmVCxNQUFNLENBQUNXLENBQVAsR0FBV1AsSUFBSSxDQUFDUSxHQUFMLENBQVNULFlBQVksR0FBR0csSUFBeEIsQ0FBWCxHQUEyQ1AsTUFBTSxDQUFDWSxDQURuQyxFQUNzQyxDQUR0QyxDQUFuQjtBQUVIOztBQUVELFdBQU9kLGFBQVA7QUFDSDtBQUNEOzs7Ozs7O01BS1lnQixROzs7YUFBQUEsUTtBQUFBQSxJQUFBQSxRLENBQUFBLFE7QUFBQUEsSUFBQUEsUSxDQUFBQSxRO0FBQUFBLElBQUFBLFEsQ0FBQUEsUTtLQUFBQSxRLHlCQUFBQSxROztBQTBCWixvQkFBT0EsUUFBUDtBQUVBLE1BQU1DLFlBQVksR0FBRyxDQUFyQjtBQUNBLE1BQU1DLFlBQVksR0FBRyxLQUFyQjtBQUVBOzs7Ozs7OztNQVdhQyxJLFdBSlosb0JBQVEsU0FBUixDLFVBQ0EsaUJBQUssY0FBTCxDLFVBQ0EsMkJBQWUsR0FBZixDLFVBQ0EsaUJBQUssZ0JBQUwsQyxVQVNJLGlCQUFLSCxRQUFMLEMsVUFDQSx5QkFBYSxDQUFiLEMsVUFDQSxvQkFBUSxNQUFSLEMsVUF5QkEsb0JBQVEsTUFBUixDLFVBNkNBLG9CQUFRLEtBQVIsQyxXQWVBLG9CQUFRLEtBQVIsQyxXQWVBLG9CQUFRLEtBQVIsQzs7Ozs7O0FBN0dEOzs7Ozs7OzBCQVVZO0FBQ1IsZUFBTyxLQUFLSSxLQUFaO0FBQ0gsTzt3QkFFU0MsSyxFQUFpQjtBQUN2QixZQUFJLEtBQUtELEtBQUwsS0FBZUMsS0FBbkIsRUFBMEI7QUFDdEI7QUFDSDs7QUFFRCxhQUFLRCxLQUFMLEdBQWFDLEtBQWI7O0FBQ0EsYUFBS0MsZUFBTDs7QUFDQSxZQUFJLEtBQUtDLFdBQVQsRUFBc0I7QUFDbEIsZUFBS0MsaUJBQUw7QUFDQSxlQUFLRCxXQUFMLEdBQW1CLElBQW5CO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7OzBCQVFnQjtBQUNaLGVBQU8sS0FBS0UsU0FBWjtBQUNILE87d0JBRWFKLEssRUFBTztBQUNqQixZQUFJSyx3QkFBU0MsSUFBVCxDQUFjQyxVQUFkLEtBQTZCQyxhQUFLQyxrQkFBdEMsRUFBMEQ7QUFDdEQsOEJBQU8sSUFBUDtBQUNBO0FBQ0g7O0FBRUQsYUFBS0wsU0FBTCxHQUFpQkosS0FBakI7QUFDSDtBQUVEOzs7Ozs7Ozs7OzswQkFTZ0I7QUFDWixlQUFPLEtBQUtVLFNBQVo7QUFDSCxPO3dCQUVhVixLLEVBQU87QUFDakIsWUFBSSxLQUFLVSxTQUFMLEtBQW1CVixLQUF2QixFQUE4QjtBQUMxQjtBQUNIOztBQUVELGFBQUtVLFNBQUwsR0FBaUIsbUJBQU1WLEtBQU4sRUFBYUosWUFBYixFQUEyQkMsWUFBM0IsQ0FBakI7O0FBQ0EsYUFBS0ksZUFBTDtBQUNIOzs7MEJBRWU7QUFDWixlQUFPLEtBQUtVLFNBQVo7QUFDSDs7OzBCQUVvQjtBQUNqQixlQUFPLEtBQUtDLGNBQVo7QUFDSDs7OzBCQUlxQjtBQUNsQixlQUFPLEtBQUtDLGVBQVo7QUFDSCxPO3dCQUVtQmIsSyxFQUFPO0FBQ3ZCLFlBQUksS0FBS2EsZUFBTCxLQUF5QmIsS0FBN0IsRUFBb0M7QUFDaEM7QUFDSDs7QUFFRCxhQUFLYSxlQUFMLEdBQXVCYixLQUF2Qjs7QUFDQSxhQUFLYyxnQkFBTDtBQUNIOzs7MEJBSXFCO0FBQ2xCLGVBQU8sS0FBS0MsZUFBWjtBQUNILE87d0JBRW1CZixLLEVBQU87QUFDdkIsWUFBSSxLQUFLZSxlQUFMLEtBQXlCZixLQUE3QixFQUFvQztBQUNoQztBQUNIOztBQUVELGFBQUtlLGVBQUwsR0FBdUJmLEtBQXZCOztBQUNBLGFBQUtjLGdCQUFMO0FBQ0g7OzswQkFLNkI7QUFDMUIsZUFBTyxLQUFLRSxNQUFaO0FBQ0gsTzt3QkFFVWhCLEssRUFBTztBQUNkLFlBQUksS0FBS2dCLE1BQUwsS0FBZ0JoQixLQUFwQixFQUEyQjtBQUN2QjtBQUNIOztBQUVELGFBQUtnQixNQUFMLENBQVlDLEdBQVosQ0FBZ0JqQixLQUFoQjs7QUFDQSxhQUFLa0IsdUJBQUw7QUFDSDs7O0FBZ0JELG9CQUFlO0FBQUE7O0FBQUE7O0FBQ1g7O0FBRFc7O0FBQUE7O0FBQUE7O0FBQUEsWUFITFAsU0FHSyxHQUh3QixJQUd4QjtBQUFBLFlBRkxDLGNBRUssR0FGNkIsSUFFN0I7QUFFWCxZQUFLTyxxQkFBTCxHQUE2QkMsbUNBQXFCQyxTQUFsRDtBQUNBLFlBQUtDLGdCQUFMLEdBQXdCLElBQXhCO0FBSFc7QUFJZDs7OzsrQkFFZ0I7QUFDYixhQUFLQyxlQUFMOztBQUNBLFlBQUksS0FBS1gsY0FBVCxFQUF5QjtBQUNyQixlQUFLQSxjQUFMLENBQW9CWSxNQUFwQjtBQUNIOztBQUVELFlBQUksS0FBS2IsU0FBVCxFQUFvQjtBQUNoQixlQUFLQSxTQUFMLENBQWVhLE1BQWY7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7a0NBSW9CO0FBQ2hCLGFBQUtELGVBQUw7O0FBQ0EsYUFBS3RCLGVBQUw7QUFDSDs7O2lDQUVrQjtBQUNmOztBQUNBLGFBQUt3QixlQUFMOztBQUVBQyxxQkFBS0MsRUFBTCxDQUFRLDJCQUFSLEVBQXFDLEtBQUtDLG9CQUExQyxFQUFnRSxJQUFoRTtBQUNIOzs7a0NBRW1CO0FBQ2hCOztBQUNBLGFBQUtDLGdCQUFMOztBQUNBSCxxQkFBS0ksR0FBTCxDQUFTLDJCQUFULEVBQXNDLEtBQUtGLG9CQUEzQztBQUNIOzs7a0NBRW1CO0FBQ2hCOztBQUNBLGFBQUtHLGVBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7NEJBTWNDLFEsRUFBZ0I7QUFDMUIsWUFBTUMsT0FBTyxHQUFHLEtBQUtDLElBQUwsQ0FBVUMsUUFBVixDQUFtQkMsZUFBbkM7QUFDQSxZQUFNQyxJQUFJLEdBQUdKLE9BQU8sQ0FBQ0ssV0FBckI7QUFDQSxZQUFNQyxDQUFDLEdBQUdGLElBQUksQ0FBQ0csS0FBZjtBQUNBLFlBQU1DLENBQUMsR0FBR0osSUFBSSxDQUFDSyxNQUFmO0FBQ0EsWUFBTUMsTUFBTSxHQUFHbkUsVUFBZjtBQUVBLGFBQUswRCxJQUFMLENBQVVVLGNBQVYsQ0FBeUJ0RSxZQUF6Qjs7QUFDQUMscUJBQUtzRSxNQUFMLENBQVluRSxVQUFaLEVBQXdCSixZQUF4Qjs7QUFDQUcscUJBQUtxRSxhQUFMLENBQW1CSCxNQUFuQixFQUEyQlgsUUFBM0IsRUFBcUN0RCxVQUFyQzs7QUFDQSxZQUFNcUUsRUFBRSxHQUFHZCxPQUFPLENBQUNlLFdBQW5CO0FBQ0FMLFFBQUFBLE1BQU0sQ0FBQ3BELENBQVAsSUFBWXdELEVBQUUsQ0FBQ3hELENBQUgsR0FBT2dELENBQW5CO0FBQ0FJLFFBQUFBLE1BQU0sQ0FBQ2xELENBQVAsSUFBWXNELEVBQUUsQ0FBQ3RELENBQUgsR0FBT2dELENBQW5CO0FBRUEsWUFBSVEsTUFBTSxHQUFHLEtBQWI7O0FBQ0EsWUFBSSxLQUFLQyxJQUFMLEtBQWN2RCxRQUFRLENBQUN3RCxJQUF2QixJQUErQixLQUFLRCxJQUFMLEtBQWN2RCxRQUFRLENBQUN5RCxnQkFBMUQsRUFBNEU7QUFDeEVILFVBQUFBLE1BQU0sR0FBR04sTUFBTSxDQUFDcEQsQ0FBUCxJQUFZLENBQVosSUFBaUJvRCxNQUFNLENBQUNsRCxDQUFQLElBQVksQ0FBN0IsSUFBa0NrRCxNQUFNLENBQUNwRCxDQUFQLElBQVlnRCxDQUE5QyxJQUFtREksTUFBTSxDQUFDbEQsQ0FBUCxJQUFZZ0QsQ0FBeEU7QUFDSCxTQUZELE1BRU8sSUFBSSxLQUFLUyxJQUFMLEtBQWN2RCxRQUFRLENBQUMwRCxPQUEzQixFQUFvQztBQUN2QyxjQUFNQyxFQUFFLEdBQUdmLENBQUMsR0FBRyxDQUFmO0FBQ0EsY0FBTWdCLEVBQUUsR0FBR2QsQ0FBQyxHQUFHLENBQWY7QUFDQSxjQUFNZSxFQUFFLEdBQUdiLE1BQU0sQ0FBQ3BELENBQVAsR0FBVyxNQUFNZ0QsQ0FBNUI7QUFDQSxjQUFNa0IsRUFBRSxHQUFHZCxNQUFNLENBQUNsRCxDQUFQLEdBQVcsTUFBTWdELENBQTVCO0FBQ0FRLFVBQUFBLE1BQU0sR0FBR08sRUFBRSxHQUFHQSxFQUFMLElBQVdGLEVBQUUsR0FBR0EsRUFBaEIsSUFBc0JHLEVBQUUsR0FBR0EsRUFBTCxJQUFXRixFQUFFLEdBQUdBLEVBQWhCLENBQXRCLEdBQTRDLENBQXJEO0FBQ0g7O0FBRUQsWUFBSSxLQUFLbkQsU0FBVCxFQUFvQjtBQUNoQjZDLFVBQUFBLE1BQU0sR0FBRyxDQUFDQSxNQUFWO0FBQ0g7O0FBRUQsZUFBT0EsTUFBUDtBQUNIOzs7OEJBRWtCUyxNLEVBQVk7QUFDM0JBLFFBQUFBLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUE4QixLQUFLQyxVQUFuQztBQUNIOzs7a0NBRXNCRixNLEVBQVk7QUFDL0IsWUFBSSxDQUFDLEtBQUtHLGNBQVYsRUFBMEI7QUFDdEI7QUFDSDs7QUFFREgsUUFBQUEsTUFBTSxDQUFDQyxVQUFQLENBQWtCLElBQWxCLEVBQXdCLElBQXhCLEVBQThCLEtBQUtFLGNBQW5DO0FBQ0g7Ozt1Q0FFMkJYLEksRUFBb0I7QUFDNUMsbUZBQXVCQSxJQUF2Qjs7QUFFQSxhQUFLakQsZUFBTDtBQUNIOzs7MkNBRStCO0FBQzVCLGFBQUsyQixvQkFBTDtBQUNIOzs7bUNBRXVCO0FBQ3BCLFlBQUkscUVBQUosRUFBeUI7QUFDckIsaUJBQU8sS0FBUDtBQUNIOztBQUVELGVBQU8sS0FBS2hCLGNBQUwsS0FBd0IsSUFBeEIsSUFBZ0MsS0FBS0QsU0FBTCxLQUFtQixJQUExRDtBQUNIOzs7d0NBRTRCO0FBQ3pCLFlBQU1tRCxTQUFTLEdBQUdoRSxJQUFJLENBQUNpRSxTQUFMLENBQWdCQyxZQUFoQixDQUE2QixJQUE3QixDQUFsQjtBQUNBLFlBQU1DLFlBQVksR0FBR25FLElBQUksQ0FBQ29FLGFBQUwsQ0FBb0JGLFlBQXBCLENBQWlDLElBQWpDLENBQXJCOztBQUVBLFlBQUksS0FBS0osVUFBTCxLQUFvQkUsU0FBeEIsRUFBbUM7QUFDL0IsZUFBSzNELGlCQUFMO0FBQ0EsZUFBS3lELFVBQUwsR0FBa0JFLFNBQWxCO0FBQ0g7O0FBRUQsWUFBSSxLQUFLRCxjQUFMLEtBQXdCSSxZQUE1QixFQUEwQztBQUN0QyxlQUFLSixjQUFMLEdBQXNCSSxZQUF0QjtBQUNIOztBQUVELFlBQUksQ0FBQyxLQUFLL0QsV0FBVixFQUF1QjtBQUNuQixjQUFJLEtBQUswRCxVQUFMLElBQW1CLEtBQUtBLFVBQUwsQ0FBZ0JPLFVBQXZDLEVBQW1EO0FBQy9DLGlCQUFLakUsV0FBTCxHQUFtQixLQUFLMEQsVUFBTCxDQUFnQk8sVUFBaEIsQ0FBMkIsSUFBM0IsQ0FBbkI7QUFDQSxpQkFBS2pFLFdBQUwsQ0FBa0JrRSxRQUFsQixHQUE2QixLQUFLQyxjQUFsQztBQUNBLGlCQUFLbkQsdUJBQUw7QUFDSDtBQUNKO0FBQ0o7Ozt3Q0FFNEI7QUFDekIsWUFBSSxDQUFDLEtBQUtOLGNBQVYsRUFBMEI7QUFDdEIsY0FBTXNCLElBQUksR0FBRyxJQUFJb0MsWUFBSixDQUFTLGdCQUFULENBQWI7QUFDQSxjQUFNQyxhQUFhLEdBQUcsS0FBSzNELGNBQUwsR0FBc0JzQixJQUFJLENBQUNzQyxZQUFMLENBQWtCQyxrQkFBbEIsQ0FBNUM7QUFDQUYsVUFBQUEsYUFBYSxDQUFDRyxXQUFkLEdBQTRCLEtBQUt4QyxJQUFqQztBQUNBcUMsVUFBQUEsYUFBYSxDQUFDSSxTQUFkLEdBQTBCLENBQTFCOztBQUNBLGNBQU1DLEtBQUssR0FBR0MsY0FBTUMsS0FBTixDQUFZQyxLQUFaLEVBQWQ7O0FBQ0FILFVBQUFBLEtBQUssQ0FBQ0ksQ0FBTixHQUFVLENBQVY7QUFDQVQsVUFBQUEsYUFBYSxDQUFDVSxTQUFkLEdBQTBCTCxLQUExQjtBQUNIOztBQUVELFlBQUksQ0FBQyxLQUFLakUsU0FBVixFQUFxQjtBQUNqQixjQUFNdUUsUUFBUSxHQUFHLEtBQUt2RSxTQUFMLEdBQWlCLElBQUk4RCxrQkFBSixFQUFsQztBQUNBUyxVQUFBQSxRQUFRLENBQUNoRCxJQUFULEdBQWdCLEtBQUtBLElBQXJCO0FBQ0FnRCxVQUFBQSxRQUFRLENBQUNoRCxJQUFULENBQWNVLGNBQWQ7QUFDQXNDLFVBQUFBLFFBQVEsQ0FBQ1AsU0FBVCxHQUFxQixDQUFyQjs7QUFDQSxjQUFNQyxNQUFLLEdBQUdDLGNBQU1DLEtBQU4sQ0FBWUMsS0FBWixFQUFkOztBQUNBSCxVQUFBQSxNQUFLLENBQUNJLENBQU4sR0FBVSxDQUFWO0FBQ0FFLFVBQUFBLFFBQVEsQ0FBQ0QsU0FBVCxHQUFxQkwsTUFBckI7QUFDSDtBQUNKOzs7NkNBRWlDO0FBQzlCLFlBQUksQ0FBQyxLQUFLaEUsY0FBVixFQUEwQjtBQUN0QjtBQUNIOztBQUVELFlBQU15QixJQUFJLEdBQUc4QyxvQkFBYjs7QUFDQSxhQUFLdkUsY0FBTCxDQUFvQnNCLElBQXBCLENBQXlCa0QsZ0JBQXpCLENBQTBDL0MsSUFBSSxDQUFDRyxLQUFMLEdBQWEsQ0FBdkQsRUFBMERILElBQUksQ0FBQ0ssTUFBTCxHQUFjLENBQXhFLEVBQTJFLENBQTNFOztBQUNBLGFBQUs5QixjQUFMLENBQW9CeUUsS0FBcEI7O0FBQ0EsYUFBS3pFLGNBQUwsQ0FBb0IwRSxJQUFwQixDQUF5QixDQUFDakQsSUFBSSxDQUFDRyxLQUFOLEdBQWMsQ0FBdkMsRUFBMEMsQ0FBQ0gsSUFBSSxDQUFDSyxNQUFOLEdBQWUsQ0FBekQsRUFBNERMLElBQUksQ0FBQ0csS0FBakUsRUFBd0VILElBQUksQ0FBQ0ssTUFBN0U7O0FBQ0EsYUFBSzlCLGNBQUwsQ0FBb0IyRSxJQUFwQjtBQUNIOzs7d0NBRTRCO0FBQ3pCLFlBQUksQ0FBQyxLQUFLNUUsU0FBVixFQUFxQjtBQUNqQjtBQUNIOztBQUVELFlBQU1zQixPQUFPLEdBQUcsS0FBS0MsSUFBTCxDQUFVQyxRQUFWLENBQW1CQyxlQUFuQztBQUNBLFlBQU04QyxRQUFRLEdBQUcsS0FBS3ZFLFNBQXRCLENBTnlCLENBT3pCOztBQUNBdUUsUUFBQUEsUUFBUSxDQUFDRyxLQUFUO0FBQ0EsWUFBTWhELElBQUksR0FBR0osT0FBTyxDQUFDSyxXQUFyQjtBQUNBLFlBQU1FLEtBQUssR0FBR0gsSUFBSSxDQUFDRyxLQUFuQjtBQUNBLFlBQU1FLE1BQU0sR0FBR0wsSUFBSSxDQUFDSyxNQUFwQjtBQUNBLFlBQU1LLEVBQUUsR0FBR2QsT0FBTyxDQUFDZSxXQUFuQjtBQUNBLFlBQU16RCxDQUFDLEdBQUcsQ0FBQ2lELEtBQUQsR0FBU08sRUFBRSxDQUFDeEQsQ0FBdEI7QUFDQSxZQUFNRSxDQUFDLEdBQUcsQ0FBQ2lELE1BQUQsR0FBVUssRUFBRSxDQUFDdEQsQ0FBdkI7O0FBQ0EsWUFBSSxLQUFLTSxLQUFMLEtBQWVKLFFBQVEsQ0FBQ3dELElBQTVCLEVBQWtDO0FBQzlCK0IsVUFBQUEsUUFBUSxDQUFDSSxJQUFULENBQWMvRixDQUFkLEVBQWlCRSxDQUFqQixFQUFvQitDLEtBQXBCLEVBQTJCRSxNQUEzQjtBQUNILFNBRkQsTUFFTyxJQUFJLEtBQUszQyxLQUFMLEtBQWVKLFFBQVEsQ0FBQzBELE9BQTVCLEVBQXFDO0FBQ3hDLGNBQU14RSxNQUFNLEdBQUcsSUFBSVMsWUFBSixDQUFTQyxDQUFDLEdBQUdpRCxLQUFLLEdBQUcsQ0FBckIsRUFBd0IvQyxDQUFDLEdBQUdpRCxNQUFNLEdBQUcsQ0FBckMsRUFBd0MsQ0FBeEMsQ0FBZjtBQUNBLGNBQU01RCxNQUFNLEdBQUcsSUFBSVEsWUFBSixDQUFTa0QsS0FBSyxHQUFHLENBQWpCLEVBQW9CRSxNQUFNLEdBQUcsQ0FBN0IsRUFBZ0MsQ0FBaEMsQ0FBZjs7QUFFQSxjQUFNOEMsTUFBTSxHQUFHNUcsZ0JBQWdCLENBQUNDLE1BQUQsRUFBU0MsTUFBVCxFQUFpQixLQUFLNEIsU0FBdEIsQ0FBL0I7O0FBQ0EsZUFBSyxJQUFJK0UsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsTUFBTSxDQUFDeEcsTUFBM0IsRUFBbUMsRUFBRXlHLENBQXJDLEVBQXdDO0FBQ3BDLGdCQUFNQyxLQUFLLEdBQUdGLE1BQU0sQ0FBQ0MsQ0FBRCxDQUFwQjs7QUFDQSxnQkFBSUEsQ0FBQyxLQUFLLENBQVYsRUFBYTtBQUNUUCxjQUFBQSxRQUFRLENBQUNTLE1BQVQsQ0FBZ0JELEtBQUssQ0FBQ25HLENBQXRCLEVBQXlCbUcsS0FBSyxDQUFDakcsQ0FBL0I7QUFDSCxhQUZELE1BRU87QUFDSHlGLGNBQUFBLFFBQVEsQ0FBQ1UsTUFBVCxDQUFnQkYsS0FBSyxDQUFDbkcsQ0FBdEIsRUFBeUJtRyxLQUFLLENBQUNqRyxDQUEvQjtBQUNIO0FBQ0o7O0FBQ0R5RixVQUFBQSxRQUFRLENBQUNXLEtBQVQ7QUFDSDs7QUFFRFgsUUFBQUEsUUFBUSxDQUFDSyxJQUFUO0FBQ0g7Ozt3Q0FFNEI7QUFDekIsWUFBSSxLQUFLM0UsY0FBVCxFQUF5QjtBQUNyQixlQUFLQSxjQUFMLENBQW9Ca0YsUUFBcEI7O0FBQ0EsZUFBS2xFLG9CQUFMO0FBQ0g7O0FBRUQsWUFBSSxLQUFLakIsU0FBVCxFQUFvQjtBQUNoQixlQUFLQSxTQUFMLENBQWVtRixRQUFmOztBQUNBLGVBQUs3RixlQUFMO0FBQ0g7QUFDSjs7O3lDQUU2QjtBQUMxQixZQUFJLEtBQUtVLFNBQVQsRUFBb0I7QUFDaEIsZUFBS0EsU0FBTCxDQUFlb0YsU0FBZjtBQUNIOztBQUVELFlBQUksS0FBS25GLGNBQVQsRUFBeUI7QUFDckIsZUFBS0EsY0FBTCxDQUFvQm1GLFNBQXBCO0FBQ0g7QUFDSjs7O3dDQUU0QjtBQUN6QixZQUFJLEtBQUtwRixTQUFULEVBQW9CO0FBQ2hCLGVBQUtBLFNBQUwsQ0FBZXFGLE9BQWY7QUFDSDs7QUFFRCxZQUFJLEtBQUtwRixjQUFULEVBQXlCO0FBQ3JCLGVBQUtBLGNBQUwsQ0FBb0JvRixPQUFwQjtBQUNIO0FBQ0o7Ozs7SUFyWHFCQywwQixXQTZIUkMsSSxHQUFPdkcsUSx1WEFwRXBCd0csZSx1SkFzQkFDLGUsb0tBZUFBLGUsNEpBZUFBLGUsaUtBa0JBQyxtQjs7Ozs7YUFDaUIxRyxRQUFRLENBQUN3RCxJOztnRkFFMUJrRCxtQjs7Ozs7YUFDcUIsSzs7Z0ZBRXJCQSxtQjs7Ozs7YUFDcUIsRTs7OERBa1AxQjs7O0FBQ0FoRywwQkFBU1AsSUFBVCxHQUFnQkEsSUFBaEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgdHlwZSwgdmlzaWJsZSwgb3ZlcnJpZGUsIGVkaXRhYmxlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBJbnN0YW5jZU1hdGVyaWFsVHlwZSwgVUlSZW5kZXJhYmxlIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2UvdWktcmVuZGVyYWJsZSc7XHJcbmltcG9ydCB7IGNsYW1wLCBDb2xvciwgTWF0NCwgVmVjMiwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IHZpZXcsIHdhcm5JRCB9IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0nO1xyXG5pbXBvcnQgdmlzaWJsZVJlY3QgZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybS92aXNpYmxlLXJlY3QnO1xyXG5pbXBvcnQgeyBVSSB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXIvdWkvdWknO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vY29yZS9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IEdyYXBoaWNzIH0gZnJvbSAnLi9ncmFwaGljcyc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybUJpdCB9IGZyb20gJy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS1lbnVtJztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgX3dvcmxkTWF0cml4ID0gbmV3IE1hdDQoKTtcclxuY29uc3QgX3ZlYzJfdGVtcCA9IG5ldyBWZWMyKCk7XHJcbmNvbnN0IF9tYXQ0X3RlbXAgPSBuZXcgTWF0NCgpO1xyXG5cclxuY29uc3QgX2NpcmNsZVBvaW50czogVmVjM1tdID0gW107XHJcbmZ1bmN0aW9uIF9jYWxjdWxhdGVDaXJjbGUgKGNlbnRlcjogVmVjMywgcmFkaXVzOiBWZWMzLCBzZWdtZW50czogbnVtYmVyKSB7XHJcbiAgICBfY2lyY2xlUG9pbnRzLmxlbmd0aCA9IDA7XHJcbiAgICBjb25zdCBhbmdsZVBlclN0ZXAgPSBNYXRoLlBJICogMiAvIHNlZ21lbnRzO1xyXG4gICAgZm9yIChsZXQgc3RlcCA9IDA7IHN0ZXAgPCBzZWdtZW50czsgKytzdGVwKSB7XHJcbiAgICAgICAgX2NpcmNsZVBvaW50cy5wdXNoKG5ldyBWZWMzKHJhZGl1cy54ICogTWF0aC5jb3MoYW5nbGVQZXJTdGVwICogc3RlcCkgKyBjZW50ZXIueCxcclxuICAgICAgICAgICAgcmFkaXVzLnkgKiBNYXRoLnNpbihhbmdsZVBlclN0ZXAgKiBzdGVwKSArIGNlbnRlci55LCAwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIF9jaXJjbGVQb2ludHM7XHJcbn1cclxuLyoqXHJcbiAqIEBlbiBUaGUgdHlwZSBmb3IgbWFzay5cclxuICpcclxuICogQHpoIOmBrue9qee7hOS7tuexu+Wei+OAglxyXG4gKi9cclxuZXhwb3J0IGVudW0gTWFza1R5cGUge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVjdCBtYXNrLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5L2/55So55+p5b2i5L2c5Li66YGu572p44CCXHJcbiAgICAgKi9cclxuICAgIFJFQ1QgPSAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEVsbGlwc2UgTWFzay5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS9v+eUqOakreWchuS9nOS4uumBrue9qeOAglxyXG4gICAgICovXHJcbiAgICBFTExJUFNFID0gMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFbGxpcHNlIE1hc2suXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDkvb/nlKjlm77lg4/mqKHniYjkvZzkuLrpga7nvanjgIJcclxuICAgICAqL1xyXG4gICAgR1JBUEhJQ1NfU1RFTkNJTCA9IDIsXHJcbn1cclxuXHJcbmNjZW51bShNYXNrVHlwZSk7XHJcblxyXG5jb25zdCBTRUdNRU5UU19NSU4gPSAzO1xyXG5jb25zdCBTRUdNRU5UU19NQVggPSAxMDAwMDtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGhlIE1hc2sgQ29tcG9uZW50LlxyXG4gKlxyXG4gKiBAemhcclxuICog6YGu572p57uE5Lu244CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuTWFzaycpXHJcbkBoZWxwKCdpMThuOmNjLk1hc2snKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5AbWVudSgnVUkvUmVuZGVyL01hc2snKVxyXG5leHBvcnQgY2xhc3MgTWFzayBleHRlbmRzIFVJUmVuZGVyYWJsZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1hc2sgdHlwZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmBrue9qeexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShNYXNrVHlwZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoNClcclxuICAgIEB0b29sdGlwKCfpga7nvannsbvlnosnKVxyXG4gICAgZ2V0IHR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0eXBlICh2YWx1ZTogTWFza1R5cGUpIHtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUdyYXBoaWNzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlckRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXN0cm95UmVuZGVyRGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldmVyc2UgbWFzayAoTm90IHN1cHBvcnRlZCBDYW52YXMgTW9kZSlcclxuICAgICAqIC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Y+N5ZCR6YGu572p77yI5LiN5pSv5oyBIENhbnZhcyDmqKHlvI/vvInjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+WPjeWQkemBrue9qScpXHJcbiAgICBnZXQgaW52ZXJ0ZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZlcnRlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaW52ZXJ0ZWQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLmdhbWUucmVuZGVyVHlwZSA9PT0gR2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcclxuICAgICAgICAgICAgd2FybklEKDQyMDIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pbnZlcnRlZCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgc2VnbWVudHMgZm9yIGVsbGlwc2UgbWFzay5cclxuICAgICAqXHJcbiAgICAgKiBUT0RPOiByZW1vdmUgc2VnbWVudHMsIG5vdCBzdXBwb3J0ZWQgYnkgZ3JhcGhpY3NcclxuICAgICAqIEB6aFxyXG4gICAgICog5qSt5ZyG6YGu572p55qE5puy57q/57uG5YiG5pWw44CCXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IHNlZ21lbnRzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VnbWVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNlZ21lbnRzICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZWdtZW50cyA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2VnbWVudHMgPSBjbGFtcCh2YWx1ZSwgU0VHTUVOVFNfTUlOLCBTRUdNRU5UU19NQVgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUdyYXBoaWNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdyYXBoaWNzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ3JhcGhpY3M7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNsZWFyR3JhcGhpY3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGVhckdyYXBoaWNzO1xyXG4gICAgfVxyXG5cclxuICAgIEBvdmVycmlkZVxyXG4gICAgQHZpc2libGUoZmFsc2UpXHJcbiAgICBnZXQgZHN0QmxlbmRGYWN0b3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kc3RCbGVuZEZhY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZHN0QmxlbmRGYWN0b3IgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2RzdEJsZW5kRmFjdG9yID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9kc3RCbGVuZEZhY3RvciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUJsZW5kRnVuYygpO1xyXG4gICAgfVxyXG5cclxuICAgIEBvdmVycmlkZVxyXG4gICAgQHZpc2libGUoZmFsc2UpXHJcbiAgICBnZXQgc3JjQmxlbmRGYWN0b3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zcmNCbGVuZEZhY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3JjQmxlbmRGYWN0b3IgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NyY0JsZW5kRmFjdG9yID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zcmNCbGVuZEZhY3RvciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUJsZW5kRnVuYygpO1xyXG4gICAgfVxyXG5cclxuICAgIEBvdmVycmlkZVxyXG4gICAgQHZpc2libGUoZmFsc2UpXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIGdldCBjb2xvciAoKTogUmVhZG9ubHk8Q29sb3I+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbG9yICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2xvciA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29sb3Iuc2V0KHZhbHVlKTtcclxuICAgICAgICB0aGlzLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBUeXBlID0gTWFza1R5cGU7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF90eXBlID0gTWFza1R5cGUuUkVDVDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ludmVydGVkID0gZmFsc2U7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zZWdtZW50cyA9IDY0O1xyXG5cclxuICAgIHByb3RlY3RlZCBfZ3JhcGhpY3M6IEdyYXBoaWNzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2NsZWFyR3JhcGhpY3M6IEdyYXBoaWNzIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5faW5zdGFuY2VNYXRlcmlhbFR5cGUgPSBJbnN0YW5jZU1hdGVyaWFsVHlwZS5BRERfQ09MT1I7XHJcbiAgICAgICAgdGhpcy5fdWlNYXRlcmlhbERpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpIHtcclxuICAgICAgICB0aGlzLl9jcmVhdGVHcmFwaGljcygpO1xyXG4gICAgICAgIGlmICh0aGlzLl9jbGVhckdyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsZWFyR3JhcGhpY3Mub25Mb2FkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZ3JhcGhpY3MpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ3JhcGhpY3Mub25Mb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlm77lvaLlhoXlrrnph43loZHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uUmVzdG9yZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fY3JlYXRlR3JhcGhpY3MoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVHcmFwaGljcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25FbmFibGUoKTtcclxuICAgICAgICB0aGlzLl9lbmFibGVHcmFwaGljcygpO1xyXG5cclxuICAgICAgICB2aWV3Lm9uKCdkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkJywgdGhpcy5fdXBkYXRlQ2xlYXJHcmFwaGljcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25EaXNhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5fZGlzYWJsZUdyYXBoaWNzKCk7XHJcbiAgICAgICAgdmlldy5vZmYoJ2Rlc2lnbi1yZXNvbHV0aW9uLWNoYW5nZWQnLCB0aGlzLl91cGRhdGVDbGVhckdyYXBoaWNzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9yZW1vdmVHcmFwaGljcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmoLnmja7lsY/luZXlnZDmoIforqHnrpfngrnlh7vkuovku7bjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhUHQgIOWxj+W5leeCuei9rOaNouWIsOebuOacuuWdkOagh+ezu+S4i+eahOeCueOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNIaXQgKGNhbWVyYVB0OiBWZWMyKSB7XHJcbiAgICAgICAgY29uc3QgdWlUcmFucyA9IHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSB1aVRyYW5zLmNvbnRlbnRTaXplO1xyXG4gICAgICAgIGNvbnN0IHcgPSBzaXplLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGggPSBzaXplLmhlaWdodDtcclxuICAgICAgICBjb25zdCB0ZXN0UHQgPSBfdmVjMl90ZW1wO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRNYXRyaXgoX3dvcmxkTWF0cml4KTtcclxuICAgICAgICBNYXQ0LmludmVydChfbWF0NF90ZW1wLCBfd29ybGRNYXRyaXgpO1xyXG4gICAgICAgIFZlYzIudHJhbnNmb3JtTWF0NCh0ZXN0UHQsIGNhbWVyYVB0LCBfbWF0NF90ZW1wKTtcclxuICAgICAgICBjb25zdCBhcCA9IHVpVHJhbnMuYW5jaG9yUG9pbnQ7XHJcbiAgICAgICAgdGVzdFB0LnggKz0gYXAueCAqIHc7XHJcbiAgICAgICAgdGVzdFB0LnkgKz0gYXAueSAqIGg7XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09PSBNYXNrVHlwZS5SRUNUIHx8IHRoaXMudHlwZSA9PT0gTWFza1R5cGUuR1JBUEhJQ1NfU1RFTkNJTCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0ZXN0UHQueCA+PSAwICYmIHRlc3RQdC55ID49IDAgJiYgdGVzdFB0LnggPD0gdyAmJiB0ZXN0UHQueSA8PSBoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSBNYXNrVHlwZS5FTExJUFNFKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJ4ID0gdyAvIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IHJ5ID0gaCAvIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IHB4ID0gdGVzdFB0LnggLSAwLjUgKiB3O1xyXG4gICAgICAgICAgICBjb25zdCBweSA9IHRlc3RQdC55IC0gMC41ICogaDtcclxuICAgICAgICAgICAgcmVzdWx0ID0gcHggKiBweCAvIChyeCAqIHJ4KSArIHB5ICogcHkgLyAocnkgKiByeSkgPCAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2ludmVydGVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICFyZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVuZGVyIChyZW5kZXI6IFVJKSB7XHJcbiAgICAgICAgcmVuZGVyLmNvbW1pdENvbXAodGhpcywgbnVsbCwgdGhpcy5fYXNzZW1ibGVyISk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9wb3N0UmVuZGVyIChyZW5kZXI6IFVJKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wb3N0QXNzZW1ibGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlci5jb21taXRDb21wKHRoaXMsIG51bGwsIHRoaXMuX3Bvc3RBc3NlbWJsZXIhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX25vZGVTdGF0ZUNoYW5nZSAodHlwZTogVHJhbnNmb3JtQml0KSB7XHJcbiAgICAgICAgc3VwZXIuX25vZGVTdGF0ZUNoYW5nZSh0eXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlR3JhcGhpY3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3Jlc29sdXRpb25DaGFuZ2VkICgpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVDbGVhckdyYXBoaWNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYW5SZW5kZXIgKCkge1xyXG4gICAgICAgIGlmICghc3VwZXIuX2NhblJlbmRlcigpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGVhckdyYXBoaWNzICE9PSBudWxsICYmIHRoaXMuX2dyYXBoaWNzICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZmx1c2hBc3NlbWJsZXIgKCkge1xyXG4gICAgICAgIGNvbnN0IGFzc2VtYmxlciA9IE1hc2suQXNzZW1ibGVyIS5nZXRBc3NlbWJsZXIodGhpcyk7XHJcbiAgICAgICAgY29uc3QgcG9zQXNzZW1ibGVyID0gTWFzay5Qb3N0QXNzZW1ibGVyIS5nZXRBc3NlbWJsZXIodGhpcyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlbWJsZXIgIT09IGFzc2VtYmxlcikge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlciA9IGFzc2VtYmxlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9wb3N0QXNzZW1ibGVyICE9PSBwb3NBc3NlbWJsZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9zdEFzc2VtYmxlciA9IHBvc0Fzc2VtYmxlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci5jcmVhdGVEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhID0gdGhpcy5fYXNzZW1ibGVyLmNyZWF0ZURhdGEodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhIS5tYXRlcmlhbCA9IHRoaXMuc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVHcmFwaGljcyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jbGVhckdyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgTm9kZSgnY2xlYXItZ3JhcGhpY3MnKTtcclxuICAgICAgICAgICAgY29uc3QgY2xlYXJHcmFwaGljcyA9IHRoaXMuX2NsZWFyR3JhcGhpY3MgPSBub2RlLmFkZENvbXBvbmVudChHcmFwaGljcykhO1xyXG4gICAgICAgICAgICBjbGVhckdyYXBoaWNzLmRlbGVnYXRlU3JjID0gdGhpcy5ub2RlO1xyXG4gICAgICAgICAgICBjbGVhckdyYXBoaWNzLmxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gQ29sb3IuV0hJVEUuY2xvbmUoKTtcclxuICAgICAgICAgICAgY29sb3IuYSA9IDA7XHJcbiAgICAgICAgICAgIGNsZWFyR3JhcGhpY3MuZmlsbENvbG9yID0gY29sb3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2dyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyYXBoaWNzID0gdGhpcy5fZ3JhcGhpY3MgPSBuZXcgR3JhcGhpY3MoKTtcclxuICAgICAgICAgICAgZ3JhcGhpY3Mubm9kZSA9IHRoaXMubm9kZTtcclxuICAgICAgICAgICAgZ3JhcGhpY3Mubm9kZS5nZXRXb3JsZE1hdHJpeCgpO1xyXG4gICAgICAgICAgICBncmFwaGljcy5saW5lV2lkdGggPSAwO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IENvbG9yLldISVRFLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGNvbG9yLmEgPSAwO1xyXG4gICAgICAgICAgICBncmFwaGljcy5maWxsQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVDbGVhckdyYXBoaWNzICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NsZWFyR3JhcGhpY3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHZpc2libGVSZWN0O1xyXG4gICAgICAgIHRoaXMuX2NsZWFyR3JhcGhpY3Mubm9kZS5zZXRXb3JsZFBvc2l0aW9uKHNpemUud2lkdGggLyAyLCBzaXplLmhlaWdodCAvIDIsIDApO1xyXG4gICAgICAgIHRoaXMuX2NsZWFyR3JhcGhpY3MuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLl9jbGVhckdyYXBoaWNzLnJlY3QoLXNpemUud2lkdGggLyAyLCAtc2l6ZS5oZWlnaHQgLyAyLCBzaXplLndpZHRoLCBzaXplLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5fY2xlYXJHcmFwaGljcy5maWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVHcmFwaGljcyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9ncmFwaGljcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB1aVRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgY29uc3QgZ3JhcGhpY3MgPSB0aGlzLl9ncmFwaGljcztcclxuICAgICAgICAvLyBTaGFyZSByZW5kZXIgZGF0YSB3aXRoIGdyYXBoaWNzIGNvbnRlbnRcclxuICAgICAgICBncmFwaGljcy5jbGVhcigpO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSB1aVRyYW5zLmNvbnRlbnRTaXplO1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gc2l6ZS53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSBzaXplLmhlaWdodDtcclxuICAgICAgICBjb25zdCBhcCA9IHVpVHJhbnMuYW5jaG9yUG9pbnQ7XHJcbiAgICAgICAgY29uc3QgeCA9IC13aWR0aCAqIGFwLng7XHJcbiAgICAgICAgY29uc3QgeSA9IC1oZWlnaHQgKiBhcC55O1xyXG4gICAgICAgIGlmICh0aGlzLl90eXBlID09PSBNYXNrVHlwZS5SRUNUKSB7XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLnJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl90eXBlID09PSBNYXNrVHlwZS5FTExJUFNFKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZWMzKHggKyB3aWR0aCAvIDIsIHkgKyBoZWlnaHQgLyAyLCAwKTtcclxuICAgICAgICAgICAgY29uc3QgcmFkaXVzID0gbmV3IFZlYzMod2lkdGggLyAyLCBoZWlnaHQgLyAyLCAwLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludHMgPSBfY2FsY3VsYXRlQ2lyY2xlKGNlbnRlciwgcmFkaXVzLCB0aGlzLl9zZWdtZW50cyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb2ludCA9IHBvaW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubW92ZVRvKHBvaW50LngsIHBvaW50LnkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5saW5lVG8ocG9pbnQueCwgcG9pbnQueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JhcGhpY3MuY2xvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdyYXBoaWNzLmZpbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2VuYWJsZUdyYXBoaWNzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2xlYXJHcmFwaGljcykge1xyXG4gICAgICAgICAgICB0aGlzLl9jbGVhckdyYXBoaWNzLm9uRW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNsZWFyR3JhcGhpY3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9ncmFwaGljcykge1xyXG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljcy5vbkVuYWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVHcmFwaGljcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2Rpc2FibGVHcmFwaGljcyAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNzLm9uRGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NsZWFyR3JhcGhpY3MpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xlYXJHcmFwaGljcy5vbkRpc2FibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZW1vdmVHcmFwaGljcyAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNzLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jbGVhckdyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsZWFyR3JhcGhpY3MuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXHJcbmxlZ2FjeUNDLk1hc2sgPSBNYXNrO1xyXG4iXX0=