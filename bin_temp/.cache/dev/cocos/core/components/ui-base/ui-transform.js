(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../component.js", "../../data/decorators/index.js", "../../platform/event-manager/event-enum.js", "../../math/index.js", "../../geometry/index.js", "../../default-constants.js", "../../global-exports.js", "../../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../component.js"), require("../../data/decorators/index.js"), require("../../platform/event-manager/event-enum.js"), require("../../math/index.js"), require("../../geometry/index.js"), require("../../default-constants.js"), require("../../global-exports.js"), require("../../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.eventEnum, global.index, global.index, global.defaultConstants, global.globalExports, global.debug);
    global.uiTransform = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _eventEnum, _index2, _index3, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UITransform = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var _vec2a = new _index2.Vec2();

  var _vec2b = new _index2.Vec2();

  var _mat4_temp = new _index2.Mat4();

  var _matrix = new _index2.Mat4();

  var _worldMatrix = new _index2.Mat4();

  var _zeroMatrix = new _index2.Mat4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  var _rect = new _index2.Rect();
  /**
   * @en
   * The component of transform in UI.
   *
   * @zh
   * UI 变换组件。
   */


  var UITransform = (_dec = (0, _index.ccclass)('cc.UITransform'), _dec2 = (0, _index.help)('i18n:cc.UITransform'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/UITransform'), _dec5 = (0, _index.displayOrder)(0), _dec6 = (0, _index.tooltip)('内容尺寸'), _dec7 = (0, _index.displayOrder)(1), _dec8 = (0, _index.tooltip)('锚点位置'), _dec9 = (0, _index.tooltip)('渲染排序优先级'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(UITransform, _Component);

    function UITransform() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UITransform);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UITransform)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_priority", _descriptor, _assertThisInitialized(_this));

      _this._canvas = null;

      _initializerDefineProperty(_this, "_contentSize", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_anchorPoint", _descriptor3, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(UITransform, [{
      key: "__preload",
      value: function __preload() {
        this.node._uiProps.uiTransformComp = this;
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._updateVisibility();

        this.node.on(_eventEnum.SystemEventType.PARENT_CHANGED, this._parentChanged, this);

        this._sortSiblings();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this.node.off(_eventEnum.SystemEventType.PARENT_CHANGED, this._parentChanged, this);
        this._canvas = null;
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this.node._uiProps.uiTransformComp = null;
      }
      /**
       * @en
       * Sets the untransformed size of the node.<br/>
       * The contentSize remains the same no matter if the node is scaled or rotated.<br/>
       * All nodes have a size. Layer and Scene have the same size of the screen.
       *
       * @zh
       * 设置节点原始大小，不受该节点是否被缩放或者旋转的影响。
       *
       * @param size - 节点内容变换的尺寸或者宽度。
       * @param height - 节点内容未变换的高度。
       * @example
       * ```ts
       * import { Size } from 'cc';
       * node.setContentSize(new Size(100, 100));
       * node.setContentSize(100, 100);
       * ```
       */

    }, {
      key: "setContentSize",
      value: function setContentSize(size, height) {
        var locContentSize = this._contentSize;
        var clone;

        if (height === undefined) {
          size = size;

          if (size.width === locContentSize.width && size.height === locContentSize.height) {
            return;
          }

          if (_defaultConstants.EDITOR) {
            clone = new _index2.Size(this._contentSize);
          }

          locContentSize.width = size.width;
          locContentSize.height = size.height;
        } else {
          if (size === locContentSize.width && height === locContentSize.height) {
            return;
          }

          if (_defaultConstants.EDITOR) {
            clone = new _index2.Size(this._contentSize);
          }

          locContentSize.width = size;
          locContentSize.height = height;
        }

        if (_defaultConstants.EDITOR) {
          // @ts-ignore
          this.node.emit(_eventEnum.SystemEventType.SIZE_CHANGED, clone);
        } else {
          this.node.emit(_eventEnum.SystemEventType.SIZE_CHANGED);
        }
      }
      /**
       * @en
       * Sets the anchor point in percent. <br/>
       * anchor point is the point around which all transformations and positioning manipulations take place. <br/>
       * It's like a pin in the node where it is "attached" to its parent. <br/>
       * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.<br/>
       * But you can use values higher than (1,1) and lower than (0,0) too.<br/>
       * The default anchor point is (0.5,0.5), so it starts at the center of the node.
       *
       * @zh
       * 设置锚点的百分比。<br>
       * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br>
       * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br>
       * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br>
       * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br>
       * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
       *
       * @param point - 节点锚点或节点 x 轴锚。
       * @param y - 节点 y 轴锚。
       * @example
       * ```ts
       * import { Vec2 } from 'cc';
       * node.setAnchorPoint(new Vec2(1, 1));
       * node.setAnchorPoint(1, 1);
       * ```
       */

    }, {
      key: "setAnchorPoint",
      value: function setAnchorPoint(point, y) {
        var locAnchorPoint = this._anchorPoint;

        if (y === undefined) {
          point = point;

          if (point.x === locAnchorPoint.x && point.y === locAnchorPoint.y) {
            return;
          }

          locAnchorPoint.x = point.x;
          locAnchorPoint.y = point.y;
        } else {
          if (point === locAnchorPoint.x && y === locAnchorPoint.y) {
            return;
          }

          locAnchorPoint.x = point;
          locAnchorPoint.y = y;
        } // this.setLocalDirty(LocalDirtyFlag.POSITION);
        // if (this._eventMask & ANCHOR_ON) {


        this.node.emit(_eventEnum.SystemEventType.ANCHOR_CHANGED, this._anchorPoint); // }
      }
      /**
       * @zh
       * 当前节点的点击计算。
       *
       * @param point - 屏幕点。
       * @param listener - 事件监听器。
       */

    }, {
      key: "isHit",
      value: function isHit(point, listener) {
        var w = this._contentSize.width;
        var h = this._contentSize.height;
        var cameraPt = _vec2a;
        var testPt = _vec2b;
        var canvas = this._canvas;

        if (!canvas) {
          return;
        } // 将一个摄像机坐标系下的点转换到世界坐标系下


        canvas.node.getWorldRT(_mat4_temp);
        var m12 = _mat4_temp.m12;
        var m13 = _mat4_temp.m13;
        var center = _globalExports.legacyCC.visibleRect.center;
        _mat4_temp.m12 = center.x - (_mat4_temp.m00 * m12 + _mat4_temp.m04 * m13);
        _mat4_temp.m13 = center.y - (_mat4_temp.m01 * m12 + _mat4_temp.m05 * m13);

        _index2.Mat4.invert(_mat4_temp, _mat4_temp);

        _index2.Vec2.transformMat4(cameraPt, point, _mat4_temp);

        this.node.getWorldMatrix(_worldMatrix);

        _index2.Mat4.invert(_mat4_temp, _worldMatrix);

        if (_index2.Mat4.strictEquals(_mat4_temp, _zeroMatrix)) {
          return false;
        }

        _index2.Vec2.transformMat4(testPt, cameraPt, _mat4_temp);

        testPt.x += this._anchorPoint.x * w;
        testPt.y += this._anchorPoint.y * h;

        if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
          if (listener && listener.mask) {
            var mask = listener.mask;
            var parent = this.node; // find mask parent, should hit test it

            for (var i = 0; parent && i < mask.index; ++i, parent = parent.parent) {}

            if (parent === mask.node) {
              var comp = parent.getComponent(_globalExports.legacyCC.Mask);
              return comp && comp.enabledInHierarchy ? comp.isHit(cameraPt) : true;
            } else {
              listener.mask = null;
              return true;
            }
          } else {
            return true;
          }
        } else {
          return false;
        }
      }
      /**
       * @en
       * Converts a Point to node (local) space coordinates.
       *
       * @zh
       * 将一个 UI 节点世界坐标系下点转换到另一个 UI 节点 (局部) 空间坐标系，这个坐标系以锚点为原点。
       * 非 UI 节点转换到 UI 节点(局部) 空间坐标系，请走 Camera 的 `convertToUINode`。
       *
       * @param worldPoint - 世界坐标点。
       * @param out - 转换后坐标。
       * @returns - 返回与目标节点的相对位置。
       * @example
       * ```ts
       * const newVec3 = uiTransform.convertToNodeSpaceAR(cc.v3(100, 100, 0));
       * ```
       */

    }, {
      key: "convertToNodeSpaceAR",
      value: function convertToNodeSpaceAR(worldPoint, out) {
        this.node.getWorldMatrix(_worldMatrix);

        _index2.Mat4.invert(_mat4_temp, _worldMatrix);

        if (!out) {
          out = new _index2.Vec3();
        }

        return _index2.Vec3.transformMat4(out, worldPoint, _mat4_temp);
      }
      /**
       * @en
       * Converts a Point in node coordinates to world space coordinates.
       *
       * @zh
       * 将距当前节点坐标系下的一个点转换到世界坐标系。
       *
       * @param nodePoint - 节点坐标。
       * @param out - 转换后坐标。
       * @returns - 返回 UI 世界坐标系。
       * @example
       * ```ts
       * const newVec3 = uiTransform.convertToWorldSpaceAR(3(100, 100, 0));
       * ```
       */

    }, {
      key: "convertToWorldSpaceAR",
      value: function convertToWorldSpaceAR(nodePoint, out) {
        this.node.getWorldMatrix(_worldMatrix);

        if (!out) {
          out = new _index2.Vec3();
        }

        return _index2.Vec3.transformMat4(out, nodePoint, _worldMatrix);
      }
      /**
       * @en
       * Returns a "local" axis aligned bounding box of the node. <br/>
       * The returned box is relative only to its parent.
       *
       * @zh
       * 返回父节坐标系下的轴向对齐的包围盒。
       *
       * @return - 节点大小的包围盒
       * @example
       * ```ts
       * const boundingBox = uiTransform.getBoundingBox();
       * ```
       */

    }, {
      key: "getBoundingBox",
      value: function getBoundingBox() {
        _index2.Mat4.fromRTS(_matrix, this.node.getRotation(), this.node.getPosition(), this.node.getScale());

        var width = this._contentSize.width;
        var height = this._contentSize.height;
        var rect = new _index2.Rect(-this._anchorPoint.x * width, -this._anchorPoint.y * height, width, height);
        rect.transformMat4(_matrix);
        return rect;
      }
      /**
       * @en
       * Returns a "world" axis aligned bounding box of the node.<br/>
       * The bounding box contains self and active children's world bounding box.
       *
       * @zh
       * 返回节点在世界坐标系下的对齐轴向的包围盒（AABB）。
       * 该边框包含自身和已激活的子节点的世界边框。
       *
       * @returns - 返回世界坐标系下包围盒。
       * @example
       * ```ts
       * const newRect = uiTransform.getBoundingBoxToWorld();
       * ```
       */

    }, {
      key: "getBoundingBoxToWorld",
      value: function getBoundingBoxToWorld() {
        if (this.node.parent) {
          this.node.parent.getWorldMatrix(_worldMatrix);
          return this.getBoundingBoxTo(_worldMatrix);
        } else {
          return this.getBoundingBox();
        }
      }
      /**
       * @en
       * Returns the minimum bounding box containing the current bounding box and its child nodes.
       *
       * @zh
       * 返回包含当前包围盒及其子节点包围盒的最小包围盒。
       *
       * @param parentMat - 父节点矩阵。
       * @returns
       */

    }, {
      key: "getBoundingBoxTo",
      value: function getBoundingBoxTo(parentMat) {
        _index2.Mat4.fromRTS(_matrix, this.node.getRotation(), this.node.getPosition(), this.node.getScale());

        var width = this._contentSize.width;
        var height = this._contentSize.height;
        var rect = new _index2.Rect(-this._anchorPoint.x * width, -this._anchorPoint.y * height, width, height);

        _index2.Mat4.multiply(_worldMatrix, parentMat, _matrix);

        rect.transformMat4(_worldMatrix); // query child's BoundingBox

        if (!this.node.children) {
          return rect;
        }

        var locChildren = this.node.children;

        var _iterator = _createForOfIteratorHelper(locChildren),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var child = _step.value;

            if (child && child.active) {
              var uiTransform = child.getComponent(UITransform);

              if (uiTransform) {
                var childRect = uiTransform.getBoundingBoxTo(parentMat);

                if (childRect) {
                  _index2.Rect.union(rect, rect, childRect);
                }
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return rect;
      }
      /**
       * @en
       * Compute the corresponding aabb in world space for raycast.
       *
       * @zh
       * 计算出此 UI_2D 节点在世界空间下的 aabb 包围盒
       */

    }, {
      key: "getComputeAABB",
      value: function getComputeAABB(out) {
        var width = this._contentSize.width;
        var height = this._contentSize.height;

        _rect.set(-this._anchorPoint.x * width, -this._anchorPoint.y * height, width, height);

        _rect.transformMat4(this.node.worldMatrix);

        var px = _rect.x + _rect.width * 0.5;
        var py = _rect.y + _rect.height * 0.5;
        ;
        var pz = this.node.worldPosition.z;
        var w = _rect.width / 2;
        var h = _rect.height / 2;
        var l = 0.001;

        if (out != null) {
          _index3.aabb.set(out, px, py, pz, w, h, l);
        } else {
          return new _index3.aabb(px, py, pz, w, h, l);
        }
      }
    }, {
      key: "_updateVisibility",
      value: function _updateVisibility() {
        var parent = this.node; // 获取被渲染相机的 visibility

        while (parent) {
          if (parent) {
            var canvasComp = parent.getComponent('cc.Canvas');

            if (canvasComp) {
              this._canvas = canvasComp;
              break;
            }
          } // @ts-ignore


          parent = parent.parent;
        }
      }
    }, {
      key: "_parentChanged",
      value: function _parentChanged(node) {
        if (this._canvas && this._canvas.node === this.node) {
          return;
        }

        this._sortSiblings();
      }
    }, {
      key: "_sortSiblings",
      value: function _sortSiblings() {
        var siblings = this.node.parent && this.node.parent.children;

        if (siblings) {
          siblings.sort(function (a, b) {
            var aComp = a._uiProps.uiTransformComp;
            var bComp = b._uiProps.uiTransformComp;
            var ca = aComp ? aComp.priority : 0;
            var cb = bComp ? bComp.priority : 0;
            var diff = ca - cb;

            if (diff === 0) {
              return a.getSiblingIndex() - b.getSiblingIndex();
            }

            return diff;
          });

          this.node.parent._updateSiblingIndex();
        }
      }
    }, {
      key: "contentSize",

      /**
       * @en
       * Size of the UI node.
       *
       * @zh
       * 内容尺寸。
       */
      get: function get() {
        return this._contentSize;
      },
      set: function set(value) {
        if (this._contentSize.equals(value)) {
          return;
        }

        var clone;

        if (_defaultConstants.EDITOR) {
          clone = new _index2.Size(this._contentSize);
        }

        this._contentSize.set(value);

        if (_defaultConstants.EDITOR) {
          // @ts-ignore
          this.node.emit(_eventEnum.SystemEventType.SIZE_CHANGED, clone);
        } else {
          this.node.emit(_eventEnum.SystemEventType.SIZE_CHANGED);
        }
      }
    }, {
      key: "width",
      get: function get() {
        return this._contentSize.width;
      },
      set: function set(value) {
        if (this._contentSize.width === value) {
          return;
        }

        var clone;

        if (_defaultConstants.EDITOR) {
          clone = new _index2.Size(this._contentSize);
        }

        this._contentSize.width = value;

        if (_defaultConstants.EDITOR) {
          // @ts-ignore
          this.node.emit(_eventEnum.SystemEventType.SIZE_CHANGED, clone);
        } else {
          this.node.emit(_eventEnum.SystemEventType.SIZE_CHANGED);
        }
      }
    }, {
      key: "height",
      get: function get() {
        return this._contentSize.height;
      },
      set: function set(value) {
        if (this.contentSize.height === value) {
          return;
        }

        var clone;

        if (_defaultConstants.EDITOR) {
          clone = new _index2.Size(this._contentSize);
        }

        this._contentSize.height = value;

        if (_defaultConstants.EDITOR) {
          // @ts-ignore
          this.node.emit(_eventEnum.SystemEventType.SIZE_CHANGED, clone);
        } else {
          this.node.emit(_eventEnum.SystemEventType.SIZE_CHANGED);
        }
      }
      /**
       * @en
       * Anchor point of the UI node.
       *
       * @zh
       * 锚点位置。
       */

    }, {
      key: "anchorPoint",
      get: function get() {
        return this._anchorPoint;
      },
      set: function set(value) {
        if (this._anchorPoint.equals(value)) {
          return;
        }

        this._anchorPoint.set(value);

        this.node.emit(_eventEnum.SystemEventType.ANCHOR_CHANGED, this._anchorPoint);
      }
    }, {
      key: "anchorX",
      get: function get() {
        return this._anchorPoint.x;
      },
      set: function set(value) {
        if (this._anchorPoint.x === value) {
          return;
        }

        this._anchorPoint.x = value;
        this.node.emit(_eventEnum.SystemEventType.ANCHOR_CHANGED, this._anchorPoint);
      }
    }, {
      key: "anchorY",
      get: function get() {
        return this._anchorPoint.y;
      },
      set: function set(value) {
        if (this._anchorPoint.y === value) {
          return;
        }

        this._anchorPoint.y = value;
        this.node.emit(_eventEnum.SystemEventType.ANCHOR_CHANGED, this._anchorPoint);
      }
      /**
       * @en
       * Render sequence.
       * Note: UI rendering is only about priority.
       *
       * @zh
       * 渲染先后顺序，按照广度渲染排列，按同级节点下进行一次排列。
       */

    }, {
      key: "priority",
      get: function get() {
        return this._priority;
      },
      set: function set(value) {
        if (this._priority === value) {
          return;
        }

        if (this._canvas && this._canvas.node === this.node) {
          (0, _debug.warnID)(9200);
          return;
        }

        this._priority = value;

        this._sortSiblings();
      }
    }, {
      key: "visibility",

      /**
       * @zh
       * 查找被渲染相机。
       */
      get: function get() {
        if (!this._canvas) {
          return -1;
        }

        return this._canvas.visibility;
      }
    }]);

    return UITransform;
  }(_component.Component), _class3.EventType = _eventEnum.SystemEventType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "contentSize", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "contentSize"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "anchorPoint", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "anchorPoint"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "priority", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "priority"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_priority", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_contentSize", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Size(100, 100);
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_anchorPoint", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec2(0.5, 0.5);
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.UITransform = UITransform;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLXRyYW5zZm9ybS50cyJdLCJuYW1lcyI6WyJfdmVjMmEiLCJWZWMyIiwiX3ZlYzJiIiwiX21hdDRfdGVtcCIsIk1hdDQiLCJfbWF0cml4IiwiX3dvcmxkTWF0cml4IiwiX3plcm9NYXRyaXgiLCJfcmVjdCIsIlJlY3QiLCJVSVRyYW5zZm9ybSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX2NhbnZhcyIsIm5vZGUiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsIl91cGRhdGVWaXNpYmlsaXR5Iiwib24iLCJTeXN0ZW1FdmVudFR5cGUiLCJQQVJFTlRfQ0hBTkdFRCIsIl9wYXJlbnRDaGFuZ2VkIiwiX3NvcnRTaWJsaW5ncyIsIm9mZiIsInNpemUiLCJoZWlnaHQiLCJsb2NDb250ZW50U2l6ZSIsIl9jb250ZW50U2l6ZSIsImNsb25lIiwidW5kZWZpbmVkIiwid2lkdGgiLCJFRElUT1IiLCJTaXplIiwiZW1pdCIsIlNJWkVfQ0hBTkdFRCIsInBvaW50IiwieSIsImxvY0FuY2hvclBvaW50IiwiX2FuY2hvclBvaW50IiwieCIsIkFOQ0hPUl9DSEFOR0VEIiwibGlzdGVuZXIiLCJ3IiwiaCIsImNhbWVyYVB0IiwidGVzdFB0IiwiY2FudmFzIiwiZ2V0V29ybGRSVCIsIm0xMiIsIm0xMyIsImNlbnRlciIsImxlZ2FjeUNDIiwidmlzaWJsZVJlY3QiLCJtMDAiLCJtMDQiLCJtMDEiLCJtMDUiLCJpbnZlcnQiLCJ0cmFuc2Zvcm1NYXQ0IiwiZ2V0V29ybGRNYXRyaXgiLCJzdHJpY3RFcXVhbHMiLCJtYXNrIiwicGFyZW50IiwiaSIsImluZGV4IiwiY29tcCIsImdldENvbXBvbmVudCIsIk1hc2siLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJpc0hpdCIsIndvcmxkUG9pbnQiLCJvdXQiLCJWZWMzIiwibm9kZVBvaW50IiwiZnJvbVJUUyIsImdldFJvdGF0aW9uIiwiZ2V0UG9zaXRpb24iLCJnZXRTY2FsZSIsInJlY3QiLCJnZXRCb3VuZGluZ0JveFRvIiwiZ2V0Qm91bmRpbmdCb3giLCJwYXJlbnRNYXQiLCJtdWx0aXBseSIsImNoaWxkcmVuIiwibG9jQ2hpbGRyZW4iLCJjaGlsZCIsImFjdGl2ZSIsInVpVHJhbnNmb3JtIiwiY2hpbGRSZWN0IiwidW5pb24iLCJzZXQiLCJ3b3JsZE1hdHJpeCIsInB4IiwicHkiLCJweiIsIndvcmxkUG9zaXRpb24iLCJ6IiwibCIsImFhYmIiLCJjYW52YXNDb21wIiwic2libGluZ3MiLCJzb3J0IiwiYSIsImIiLCJhQ29tcCIsImJDb21wIiwiY2EiLCJwcmlvcml0eSIsImNiIiwiZGlmZiIsImdldFNpYmxpbmdJbmRleCIsIl91cGRhdGVTaWJsaW5nSW5kZXgiLCJ2YWx1ZSIsImVxdWFscyIsImNvbnRlbnRTaXplIiwiX3ByaW9yaXR5IiwidmlzaWJpbGl0eSIsIkNvbXBvbmVudCIsIkV2ZW50VHlwZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDQSxNQUFNQSxNQUFNLEdBQUcsSUFBSUMsWUFBSixFQUFmOztBQUNBLE1BQU1DLE1BQU0sR0FBRyxJQUFJRCxZQUFKLEVBQWY7O0FBQ0EsTUFBTUUsVUFBVSxHQUFHLElBQUlDLFlBQUosRUFBbkI7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHLElBQUlELFlBQUosRUFBaEI7O0FBQ0EsTUFBTUUsWUFBWSxHQUFHLElBQUlGLFlBQUosRUFBckI7O0FBQ0EsTUFBTUcsV0FBVyxHQUFHLElBQUlILFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMEMsQ0FBMUMsRUFBNkMsQ0FBN0MsRUFBZ0Qs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QUFiLEtBQXNCLEtBQUtBLElBQS9DLEVBQXFEO0FBQ2pELDZCQUFPLElBQVA7QUFDQTtBQUNIOztBQUVELGFBQUtxRyxTQUFMLEdBQWlCSCxLQUFqQjs7QUFDQSxhQUFLMUYsYUFBTDtBQUNIOzs7O0FBS0Q7Ozs7MEJBSWtCO0FBQ2QsWUFBSSxDQUFDLEtBQUtULE9BQVYsRUFBbUI7QUFDZixpQkFBTyxDQUFDLENBQVI7QUFDSDs7QUFFRCxlQUFPLEtBQUtBLE9BQUwsQ0FBYXVHLFVBQXBCO0FBQ0g7Ozs7SUEzSzRCQyxvQixXQTZLZkMsUyxHQUFZbkcsMEIsZ2pCQWZ6Qm9HLG1COzs7OzthQUNxQixDOzttRkFrQnJCQSxtQjs7Ozs7YUFDd0IsSUFBSXZGLFlBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxDOzttRkFDeEJ1RixtQjs7Ozs7YUFDd0IsSUFBSXJILFlBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50JztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCB0b29sdGlwLCBkaXNwbGF5T3JkZXIsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFN5c3RlbUV2ZW50VHlwZSB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL2V2ZW50LW1hbmFnZXIvZXZlbnQtZW51bSc7XHJcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXIsIElMaXN0ZW5lck1hc2sgfSBmcm9tICcuLi8uLi9wbGF0Zm9ybS9ldmVudC1tYW5hZ2VyL2V2ZW50LWxpc3RlbmVyJztcclxuaW1wb3J0IHsgTWF0NCwgUmVjdCwgU2l6ZSwgVmVjMiwgVmVjMyB9IGZyb20gJy4uLy4uL21hdGgnO1xyXG5pbXBvcnQgeyBhYWJiIH0gZnJvbSAnLi4vLi4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBDYW52YXMgfSBmcm9tICcuL2NhbnZhcyc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyB3YXJuSUQgfSBmcm9tICcuLi8uLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcblxyXG5jb25zdCBfdmVjMmEgPSBuZXcgVmVjMigpO1xyXG5jb25zdCBfdmVjMmIgPSBuZXcgVmVjMigpO1xyXG5jb25zdCBfbWF0NF90ZW1wID0gbmV3IE1hdDQoKTtcclxuY29uc3QgX21hdHJpeCA9IG5ldyBNYXQ0KCk7XHJcbmNvbnN0IF93b3JsZE1hdHJpeCA9IG5ldyBNYXQ0KCk7XHJcbmNvbnN0IF96ZXJvTWF0cml4ID0gbmV3IE1hdDQoMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCk7XHJcbmNvbnN0IF9yZWN0ID0gbmV3IFJlY3QoKTtcclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgY29tcG9uZW50IG9mIHRyYW5zZm9ybSBpbiBVSS5cclxuICpcclxuICogQHpoXHJcbiAqIFVJIOWPmOaNoue7hOS7tuOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlVJVHJhbnNmb3JtJylcclxuQGhlbHAoJ2kxOG46Y2MuVUlUcmFuc2Zvcm0nKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5AbWVudSgnVUkvVUlUcmFuc2Zvcm0nKVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuZXhwb3J0IGNsYXNzIFVJVHJhbnNmb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2l6ZSBvZiB0aGUgVUkgbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWGheWuueWwuuWvuOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBAdG9vbHRpcCgn5YaF5a655bC65a+4JylcclxuICAgIC8vIEBjb25zdGdldFxyXG4gICAgZ2V0IGNvbnRlbnRTaXplICgpOiBSZWFkb25seTxTaXplPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb250ZW50U2l6ZSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29udGVudFNpemUuZXF1YWxzKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2xvbmU6IFNpemU7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBjbG9uZSA9IG5ldyBTaXplKHRoaXMuX2NvbnRlbnRTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRlbnRTaXplLnNldCh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5lbWl0KFN5c3RlbUV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIGNsb25lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZW1pdChTeXN0ZW1FdmVudFR5cGUuU0laRV9DSEFOR0VEKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCB3aWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRTaXplLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB3aWR0aCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29udGVudFNpemUud2lkdGggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjbG9uZTogU2l6ZTtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGNsb25lID0gbmV3IFNpemUodGhpcy5fY29udGVudFNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29udGVudFNpemUud2lkdGggPSB2YWx1ZTtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgY2xvbmUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5lbWl0KFN5c3RlbUV2ZW50VHlwZS5TSVpFX0NIQU5HRUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFNpemUuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBoZWlnaHQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGVudFNpemUuaGVpZ2h0ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2xvbmU6IFNpemU7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBjbG9uZSA9IG5ldyBTaXplKHRoaXMuX2NvbnRlbnRTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRlbnRTaXplLmhlaWdodCA9IHZhbHVlO1xyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZW1pdChTeXN0ZW1FdmVudFR5cGUuU0laRV9DSEFOR0VELCBjbG9uZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBbmNob3IgcG9pbnQgb2YgdGhlIFVJIG5vZGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDplJrngrnkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHRvb2x0aXAoJ+mUmueCueS9jee9ricpXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIGdldCBhbmNob3JQb2ludCAoKTogUmVhZG9ubHk8VmVjMj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbmNob3JQb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYW5jaG9yUG9pbnQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FuY2hvclBvaW50LmVxdWFscyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYW5jaG9yUG9pbnQuc2V0KHZhbHVlKTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdChTeXN0ZW1FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIHRoaXMuX2FuY2hvclBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYW5jaG9yWCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuY2hvclBvaW50Lng7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGFuY2hvclggKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FuY2hvclBvaW50LnggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FuY2hvclBvaW50LnggPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdChTeXN0ZW1FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIHRoaXMuX2FuY2hvclBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYW5jaG9yWSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuY2hvclBvaW50Lnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGFuY2hvclkgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FuY2hvclBvaW50LnkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FuY2hvclBvaW50LnkgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdChTeXN0ZW1FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIHRoaXMuX2FuY2hvclBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVuZGVyIHNlcXVlbmNlLlxyXG4gICAgICogTm90ZTogVUkgcmVuZGVyaW5nIGlzIG9ubHkgYWJvdXQgcHJpb3JpdHkuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmuLLmn5PlhYjlkI7pobrluo/vvIzmjInnhaflub/luqbmuLLmn5PmjpLliJfvvIzmjInlkIznuqfoioLngrnkuIvov5vooYzkuIDmrKHmjpLliJfjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+a4suafk+aOkuW6j+S8mOWFiOe6pycpXHJcbiAgICBnZXQgcHJpb3JpdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByaW9yaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwcmlvcml0eSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcmlvcml0eSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NhbnZhcyAmJiB0aGlzLl9jYW52YXMubm9kZSA9PT0gdGhpcy5ub2RlKSB7XHJcbiAgICAgICAgICAgIHdhcm5JRCg5MjAwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJpb3JpdHkgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zb3J0U2libGluZ3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3ByaW9yaXR5ID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5p+l5om+6KKr5riy5p+T55u45py644CCXHJcbiAgICAgKi9cclxuICAgIGdldCB2aXNpYmlsaXR5ICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NhbnZhcykge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzLnZpc2liaWxpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBFdmVudFR5cGUgPSBTeXN0ZW1FdmVudFR5cGU7XHJcblxyXG4gICAgcHVibGljIF9jYW52YXM6IENhbnZhcyB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY29udGVudFNpemUgPSBuZXcgU2l6ZSgxMDAsIDEwMCk7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2FuY2hvclBvaW50ID0gbmV3IFZlYzIoMC41LCAwLjUpO1xyXG5cclxuICAgIHB1YmxpYyBfX3ByZWxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVZpc2liaWxpdHkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5QQVJFTlRfQ0hBTkdFRCwgdGhpcy5fcGFyZW50Q2hhbmdlZCwgdGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvcnRTaWJsaW5ncygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUoKXtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5QQVJFTlRfQ0hBTkdFRCwgdGhpcy5fcGFyZW50Q2hhbmdlZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0cyB0aGUgdW50cmFuc2Zvcm1lZCBzaXplIG9mIHRoZSBub2RlLjxici8+XHJcbiAgICAgKiBUaGUgY29udGVudFNpemUgcmVtYWlucyB0aGUgc2FtZSBubyBtYXR0ZXIgaWYgdGhlIG5vZGUgaXMgc2NhbGVkIG9yIHJvdGF0ZWQuPGJyLz5cclxuICAgICAqIEFsbCBub2RlcyBoYXZlIGEgc2l6ZS4gTGF5ZXIgYW5kIFNjZW5lIGhhdmUgdGhlIHNhbWUgc2l6ZSBvZiB0aGUgc2NyZWVuLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u6IqC54K55Y6f5aeL5aSn5bCP77yM5LiN5Y+X6K+l6IqC54K55piv5ZCm6KKr57yp5pS+5oiW6ICF5peL6L2s55qE5b2x5ZON44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHNpemUgLSDoioLngrnlhoXlrrnlj5jmjaLnmoTlsLrlr7jmiJbogIXlrr3luqbjgIJcclxuICAgICAqIEBwYXJhbSBoZWlnaHQgLSDoioLngrnlhoXlrrnmnKrlj5jmjaLnmoTpq5jluqbjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgU2l6ZSB9IGZyb20gJ2NjJztcclxuICAgICAqIG5vZGUuc2V0Q29udGVudFNpemUobmV3IFNpemUoMTAwLCAxMDApKTtcclxuICAgICAqIG5vZGUuc2V0Q29udGVudFNpemUoMTAwLCAxMDApO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRDb250ZW50U2l6ZSAoc2l6ZTogU2l6ZSB8IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgbG9jQ29udGVudFNpemUgPSB0aGlzLl9jb250ZW50U2l6ZTtcclxuICAgICAgICBsZXQgY2xvbmU6IFNpemU7XHJcbiAgICAgICAgaWYgKGhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNpemUgPSBzaXplIGFzIFNpemU7XHJcbiAgICAgICAgICAgIGlmICgoc2l6ZS53aWR0aCA9PT0gbG9jQ29udGVudFNpemUud2lkdGgpICYmIChzaXplLmhlaWdodCA9PT0gbG9jQ29udGVudFNpemUuaGVpZ2h0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgICAgICBjbG9uZSA9IG5ldyBTaXplKHRoaXMuX2NvbnRlbnRTaXplKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbG9jQ29udGVudFNpemUud2lkdGggPSBzaXplLndpZHRoO1xyXG4gICAgICAgICAgICBsb2NDb250ZW50U2l6ZS5oZWlnaHQgPSBzaXplLmhlaWdodDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoKHNpemUgPT09IGxvY0NvbnRlbnRTaXplLndpZHRoKSAmJiAoaGVpZ2h0ID09PSBsb2NDb250ZW50U2l6ZS5oZWlnaHQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgICAgIGNsb25lID0gbmV3IFNpemUodGhpcy5fY29udGVudFNpemUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsb2NDb250ZW50U2l6ZS53aWR0aCA9IHNpemUgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICBsb2NDb250ZW50U2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgY2xvbmUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5lbWl0KFN5c3RlbUV2ZW50VHlwZS5TSVpFX0NIQU5HRUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0cyB0aGUgYW5jaG9yIHBvaW50IGluIHBlcmNlbnQuIDxici8+XHJcbiAgICAgKiBhbmNob3IgcG9pbnQgaXMgdGhlIHBvaW50IGFyb3VuZCB3aGljaCBhbGwgdHJhbnNmb3JtYXRpb25zIGFuZCBwb3NpdGlvbmluZyBtYW5pcHVsYXRpb25zIHRha2UgcGxhY2UuIDxici8+XHJcbiAgICAgKiBJdCdzIGxpa2UgYSBwaW4gaW4gdGhlIG5vZGUgd2hlcmUgaXQgaXMgXCJhdHRhY2hlZFwiIHRvIGl0cyBwYXJlbnQuIDxici8+XHJcbiAgICAgKiBUaGUgYW5jaG9yUG9pbnQgaXMgbm9ybWFsaXplZCwgbGlrZSBhIHBlcmNlbnRhZ2UuICgwLDApIG1lYW5zIHRoZSBib3R0b20tbGVmdCBjb3JuZXIgYW5kICgxLDEpIG1lYW5zIHRoZSB0b3AtcmlnaHQgY29ybmVyLjxici8+XHJcbiAgICAgKiBCdXQgeW91IGNhbiB1c2UgdmFsdWVzIGhpZ2hlciB0aGFuICgxLDEpIGFuZCBsb3dlciB0aGFuICgwLDApIHRvby48YnIvPlxyXG4gICAgICogVGhlIGRlZmF1bHQgYW5jaG9yIHBvaW50IGlzICgwLjUsMC41KSwgc28gaXQgc3RhcnRzIGF0IHRoZSBjZW50ZXIgb2YgdGhlIG5vZGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7plJrngrnnmoTnmb7liIbmr5TjgII8YnI+XHJcbiAgICAgKiDplJrngrnlupTnlKjkuo7miYDmnInlj5jmjaLlkozlnZDmoIfngrnnmoTmk43kvZzvvIzlroPlsLHlg4/lnKjoioLngrnkuIrov57mjqXlhbbniLboioLngrnnmoTlpKflpLTpkojjgII8YnI+XHJcbiAgICAgKiDplJrngrnmmK/moIflh4bljJbnmoTvvIzlsLHlg4/nmb7liIbmr5TkuIDmoLfjgIIoMO+8jDApIOihqOekuuW3puS4i+inku+8jCgx77yMMSkg6KGo56S65Y+z5LiK6KeS44CCPGJyPlxyXG4gICAgICog5L2G5piv5L2g5Y+v5Lul5L2/55So5q+U77yIMe+8jDHvvInmm7Tpq5jnmoTlgLzmiJbogIXmr5TvvIgw77yMMO+8ieabtOS9jueahOWAvOOAgjxicj5cclxuICAgICAqIOm7mOiupOeahOmUmueCueaYr++8iDAuNe+8jDAuNe+8ie+8jOWboOatpOWug+W8gOWni+S6juiKgueCueeahOS4reW/g+S9jee9ruOAgjxicj5cclxuICAgICAqIOazqOaEj++8mkNyZWF0b3Ig5Lit55qE6ZSa54K55LuF55So5LqO5a6a5L2N5omA5Zyo55qE6IqC54K577yM5a2Q6IqC54K555qE5a6a5L2N5LiN5Y+X5b2x5ZON44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBvaW50IC0g6IqC54K56ZSa54K55oiW6IqC54K5IHgg6L206ZSa44CCXHJcbiAgICAgKiBAcGFyYW0geSAtIOiKgueCuSB5IOi9tOmUmuOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBWZWMyIH0gZnJvbSAnY2MnO1xyXG4gICAgICogbm9kZS5zZXRBbmNob3JQb2ludChuZXcgVmVjMigxLCAxKSk7XHJcbiAgICAgKiBub2RlLnNldEFuY2hvclBvaW50KDEsIDEpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRBbmNob3JQb2ludCAocG9pbnQ6IFZlYzIgfCBudW1iZXIsIHk/OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBsb2NBbmNob3JQb2ludCA9IHRoaXMuX2FuY2hvclBvaW50O1xyXG4gICAgICAgIGlmICh5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcG9pbnQgPSBwb2ludCBhcyBWZWMyO1xyXG4gICAgICAgICAgICBpZiAoKHBvaW50LnggPT09IGxvY0FuY2hvclBvaW50LngpICYmIChwb2ludC55ID09PSBsb2NBbmNob3JQb2ludC55KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxvY0FuY2hvclBvaW50LnggPSBwb2ludC54O1xyXG4gICAgICAgICAgICBsb2NBbmNob3JQb2ludC55ID0gcG9pbnQueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoKHBvaW50ID09PSBsb2NBbmNob3JQb2ludC54KSAmJiAoeSA9PT0gbG9jQW5jaG9yUG9pbnQueSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsb2NBbmNob3JQb2ludC54ID0gcG9pbnQgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICBsb2NBbmNob3JQb2ludC55ID0geTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5QT1NJVElPTik7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMuX2V2ZW50TWFzayAmIEFOQ0hPUl9PTikge1xyXG4gICAgICAgIHRoaXMubm9kZS5lbWl0KFN5c3RlbUV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fYW5jaG9yUG9pbnQpO1xyXG5cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+WJjeiKgueCueeahOeCueWHu+iuoeeul+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwb2ludCAtIOWxj+W5leeCueOAglxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIC0g5LqL5Lu255uR5ZCs5Zmo44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc0hpdCAocG9pbnQ6IFZlYzIsIGxpc3RlbmVyPzogRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIGNvbnN0IHcgPSB0aGlzLl9jb250ZW50U2l6ZS53aWR0aDtcclxuICAgICAgICBjb25zdCBoID0gdGhpcy5fY29udGVudFNpemUuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYVB0ID0gX3ZlYzJhO1xyXG4gICAgICAgIGNvbnN0IHRlc3RQdCA9IF92ZWMyYjtcclxuXHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG4gICAgICAgIGlmICghY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWwhuS4gOS4quaRhOWDj+acuuWdkOagh+ezu+S4i+eahOeCuei9rOaNouWIsOS4lueVjOWdkOagh+ezu+S4i1xyXG4gICAgICAgIGNhbnZhcy5ub2RlLmdldFdvcmxkUlQoX21hdDRfdGVtcCk7XHJcbiAgICAgICAgY29uc3QgbTEyID0gX21hdDRfdGVtcC5tMTI7XHJcbiAgICAgICAgY29uc3QgbTEzID0gX21hdDRfdGVtcC5tMTM7XHJcbiAgICAgICAgY29uc3QgY2VudGVyID0gbGVnYWN5Q0MudmlzaWJsZVJlY3QuY2VudGVyO1xyXG4gICAgICAgIF9tYXQ0X3RlbXAubTEyID0gY2VudGVyLnggLSAoX21hdDRfdGVtcC5tMDAgKiBtMTIgKyBfbWF0NF90ZW1wLm0wNCAqIG0xMyk7XHJcbiAgICAgICAgX21hdDRfdGVtcC5tMTMgPSBjZW50ZXIueSAtIChfbWF0NF90ZW1wLm0wMSAqIG0xMiArIF9tYXQ0X3RlbXAubTA1ICogbTEzKTtcclxuICAgICAgICBNYXQ0LmludmVydChfbWF0NF90ZW1wLCBfbWF0NF90ZW1wKTtcclxuICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQoY2FtZXJhUHQsIHBvaW50LCBfbWF0NF90ZW1wKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLmdldFdvcmxkTWF0cml4KF93b3JsZE1hdHJpeCk7XHJcbiAgICAgICAgTWF0NC5pbnZlcnQoX21hdDRfdGVtcCwgX3dvcmxkTWF0cml4KTtcclxuICAgICAgICBpZiAoTWF0NC5zdHJpY3RFcXVhbHMoX21hdDRfdGVtcCwgX3plcm9NYXRyaXgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgVmVjMi50cmFuc2Zvcm1NYXQ0KHRlc3RQdCwgY2FtZXJhUHQsIF9tYXQ0X3RlbXApO1xyXG4gICAgICAgIHRlc3RQdC54ICs9IHRoaXMuX2FuY2hvclBvaW50LnggKiB3O1xyXG4gICAgICAgIHRlc3RQdC55ICs9IHRoaXMuX2FuY2hvclBvaW50LnkgKiBoO1xyXG5cclxuICAgICAgICBpZiAodGVzdFB0LnggPj0gMCAmJiB0ZXN0UHQueSA+PSAwICYmIHRlc3RQdC54IDw9IHcgJiYgdGVzdFB0LnkgPD0gaCkge1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgJiYgbGlzdGVuZXIubWFzaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWFzayA9IGxpc3RlbmVyLm1hc2sgYXMgSUxpc3RlbmVyTWFzaztcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQ6IGFueSA9IHRoaXMubm9kZTtcclxuICAgICAgICAgICAgICAgIC8vIGZpbmQgbWFzayBwYXJlbnQsIHNob3VsZCBoaXQgdGVzdCBpdFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IHBhcmVudCAmJiBpIDwgbWFzay5pbmRleDsgKytpLCBwYXJlbnQgPSBwYXJlbnQucGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50ID09PSBtYXNrLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wID0gcGFyZW50LmdldENvbXBvbmVudChsZWdhY3lDQy5NYXNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNvbXAgJiYgY29tcC5lbmFibGVkSW5IaWVyYXJjaHkpID8gY29tcC5pc0hpdChjYW1lcmFQdCkgOiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5tYXNrID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ29udmVydHMgYSBQb2ludCB0byBub2RlIChsb2NhbCkgc3BhY2UgY29vcmRpbmF0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbkuIDkuKogVUkg6IqC54K55LiW55WM5Z2Q5qCH57O75LiL54K56L2s5o2i5Yiw5Y+m5LiA5LiqIFVJIOiKgueCuSAo5bGA6YOoKSDnqbrpl7TlnZDmoIfns7vvvIzov5nkuKrlnZDmoIfns7vku6XplJrngrnkuLrljp/ngrnjgIJcclxuICAgICAqIOmdniBVSSDoioLngrnovazmjaLliLAgVUkg6IqC54K5KOWxgOmDqCkg56m66Ze05Z2Q5qCH57O777yM6K+36LWwIENhbWVyYSDnmoQgYGNvbnZlcnRUb1VJTm9kZWDjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gd29ybGRQb2ludCAtIOS4lueVjOWdkOagh+eCueOAglxyXG4gICAgICogQHBhcmFtIG91dCAtIOi9rOaNouWQjuWdkOagh+OAglxyXG4gICAgICogQHJldHVybnMgLSDov5Tlm57kuI7nm67moIfoioLngrnnmoTnm7jlr7nkvY3nva7jgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogY29uc3QgbmV3VmVjMyA9IHVpVHJhbnNmb3JtLmNvbnZlcnRUb05vZGVTcGFjZUFSKGNjLnYzKDEwMCwgMTAwLCAwKSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnZlcnRUb05vZGVTcGFjZUFSICh3b3JsZFBvaW50OiBWZWMzLCBvdXQ/OiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldFdvcmxkTWF0cml4KF93b3JsZE1hdHJpeCk7XHJcbiAgICAgICAgTWF0NC5pbnZlcnQoX21hdDRfdGVtcCwgX3dvcmxkTWF0cml4KTtcclxuICAgICAgICBpZiAoIW91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFZlYzMudHJhbnNmb3JtTWF0NChvdXQsIHdvcmxkUG9pbnQsIF9tYXQ0X3RlbXApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb252ZXJ0cyBhIFBvaW50IGluIG5vZGUgY29vcmRpbmF0ZXMgdG8gd29ybGQgc3BhY2UgY29vcmRpbmF0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbot53lvZPliY3oioLngrnlnZDmoIfns7vkuIvnmoTkuIDkuKrngrnovazmjaLliLDkuJbnlYzlnZDmoIfns7vjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbm9kZVBvaW50IC0g6IqC54K55Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IC0g6L2s5o2i5ZCO5Z2Q5qCH44CCXHJcbiAgICAgKiBAcmV0dXJucyAtIOi/lOWbniBVSSDkuJbnlYzlnZDmoIfns7vjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogY29uc3QgbmV3VmVjMyA9IHVpVHJhbnNmb3JtLmNvbnZlcnRUb1dvcmxkU3BhY2VBUigzKDEwMCwgMTAwLCAwKSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnZlcnRUb1dvcmxkU3BhY2VBUiAobm9kZVBvaW50OiBWZWMzLCBvdXQ/OiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldFdvcmxkTWF0cml4KF93b3JsZE1hdHJpeCk7XHJcbiAgICAgICAgaWYgKCFvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LCBub2RlUG9pbnQsIF93b3JsZE1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgYSBcImxvY2FsXCIgYXhpcyBhbGlnbmVkIGJvdW5kaW5nIGJveCBvZiB0aGUgbm9kZS4gPGJyLz5cclxuICAgICAqIFRoZSByZXR1cm5lZCBib3ggaXMgcmVsYXRpdmUgb25seSB0byBpdHMgcGFyZW50LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L+U5Zue54i26IqC5Z2Q5qCH57O75LiL55qE6L205ZCR5a+56b2Q55qE5YyF5Zu055uS44CCXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiAtIOiKgueCueWkp+Wwj+eahOWMheWbtOebklxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBjb25zdCBib3VuZGluZ0JveCA9IHVpVHJhbnNmb3JtLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJvdW5kaW5nQm94ICgpIHtcclxuICAgICAgICBNYXQ0LmZyb21SVFMoX21hdHJpeCwgdGhpcy5ub2RlLmdldFJvdGF0aW9uKCksIHRoaXMubm9kZS5nZXRQb3NpdGlvbigpLCB0aGlzLm5vZGUuZ2V0U2NhbGUoKSk7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9jb250ZW50U2l6ZS53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IG5ldyBSZWN0KFxyXG4gICAgICAgICAgICAtdGhpcy5fYW5jaG9yUG9pbnQueCAqIHdpZHRoLFxyXG4gICAgICAgICAgICAtdGhpcy5fYW5jaG9yUG9pbnQueSAqIGhlaWdodCxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCk7XHJcbiAgICAgICAgcmVjdC50cmFuc2Zvcm1NYXQ0KF9tYXRyaXgpO1xyXG4gICAgICAgIHJldHVybiByZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXR1cm5zIGEgXCJ3b3JsZFwiIGF4aXMgYWxpZ25lZCBib3VuZGluZyBib3ggb2YgdGhlIG5vZGUuPGJyLz5cclxuICAgICAqIFRoZSBib3VuZGluZyBib3ggY29udGFpbnMgc2VsZiBhbmQgYWN0aXZlIGNoaWxkcmVuJ3Mgd29ybGQgYm91bmRpbmcgYm94LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L+U5Zue6IqC54K55Zyo5LiW55WM5Z2Q5qCH57O75LiL55qE5a+56b2Q6L205ZCR55qE5YyF5Zu055uS77yIQUFCQu+8ieOAglxyXG4gICAgICog6K+l6L655qGG5YyF5ZCr6Ieq6Lqr5ZKM5bey5r+A5rS755qE5a2Q6IqC54K555qE5LiW55WM6L655qGG44CCXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgLSDov5Tlm57kuJbnlYzlnZDmoIfns7vkuIvljIXlm7Tnm5LjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogY29uc3QgbmV3UmVjdCA9IHVpVHJhbnNmb3JtLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRCb3VuZGluZ0JveFRvV29ybGQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm5vZGUucGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnQuZ2V0V29ybGRNYXRyaXgoX3dvcmxkTWF0cml4KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdCb3hUbyhfd29ybGRNYXRyaXgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQm94KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIGJvdW5kaW5nIGJveCBjb250YWluaW5nIHRoZSBjdXJyZW50IGJvdW5kaW5nIGJveCBhbmQgaXRzIGNoaWxkIG5vZGVzLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L+U5Zue5YyF5ZCr5b2T5YmN5YyF5Zu055uS5Y+K5YW25a2Q6IqC54K55YyF5Zu055uS55qE5pyA5bCP5YyF5Zu055uS44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBhcmVudE1hdCAtIOeItuiKgueCueefqemYteOAglxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJvdW5kaW5nQm94VG8gKHBhcmVudE1hdDogTWF0NCkge1xyXG4gICAgICAgIE1hdDQuZnJvbVJUUyhfbWF0cml4LCB0aGlzLm5vZGUuZ2V0Um90YXRpb24oKSwgdGhpcy5ub2RlLmdldFBvc2l0aW9uKCksIHRoaXMubm9kZS5nZXRTY2FsZSgpKTtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2NvbnRlbnRTaXplLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX2NvbnRlbnRTaXplLmhlaWdodDtcclxuICAgICAgICBjb25zdCByZWN0ID0gbmV3IFJlY3QoXHJcbiAgICAgICAgICAgIC10aGlzLl9hbmNob3JQb2ludC54ICogd2lkdGgsXHJcbiAgICAgICAgICAgIC10aGlzLl9hbmNob3JQb2ludC55ICogaGVpZ2h0LFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgTWF0NC5tdWx0aXBseShfd29ybGRNYXRyaXgsIHBhcmVudE1hdCwgX21hdHJpeCk7XHJcbiAgICAgICAgcmVjdC50cmFuc2Zvcm1NYXQ0KF93b3JsZE1hdHJpeCk7XHJcblxyXG4gICAgICAgIC8vIHF1ZXJ5IGNoaWxkJ3MgQm91bmRpbmdCb3hcclxuICAgICAgICBpZiAoIXRoaXMubm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY0NoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbG9jQ2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdWlUcmFuc2Zvcm0gPSBjaGlsZC5nZXRDb21wb25lbnQoVUlUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHVpVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRSZWN0ID0gdWlUcmFuc2Zvcm0uZ2V0Qm91bmRpbmdCb3hUbyhwYXJlbnRNYXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZFJlY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVjdC51bmlvbihyZWN0LCByZWN0LCBjaGlsZFJlY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvbXB1dGUgdGhlIGNvcnJlc3BvbmRpbmcgYWFiYiBpbiB3b3JsZCBzcGFjZSBmb3IgcmF5Y2FzdC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuoeeul+WHuuatpCBVSV8yRCDoioLngrnlnKjkuJbnlYznqbrpl7TkuIvnmoQgYWFiYiDljIXlm7Tnm5JcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbXB1dGVBQUJCIChvdXQ/OiBhYWJiKSB7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9jb250ZW50U2l6ZS53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgX3JlY3Quc2V0KFxyXG4gICAgICAgICAgICAtdGhpcy5fYW5jaG9yUG9pbnQueCAqIHdpZHRoLFxyXG4gICAgICAgICAgICAtdGhpcy5fYW5jaG9yUG9pbnQueSAqIGhlaWdodCxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCk7XHJcbiAgICAgICAgX3JlY3QudHJhbnNmb3JtTWF0NCh0aGlzLm5vZGUud29ybGRNYXRyaXgpO1xyXG4gICAgICAgIGNvbnN0IHB4ID0gX3JlY3QueCArIF9yZWN0LndpZHRoICogMC41O1xyXG4gICAgICAgIGNvbnN0IHB5ID0gX3JlY3QueSArIF9yZWN0LmhlaWdodCAqIDAuNTs7XHJcbiAgICAgICAgY29uc3QgcHogPSB0aGlzLm5vZGUud29ybGRQb3NpdGlvbi56O1xyXG4gICAgICAgIGNvbnN0IHcgPSBfcmVjdC53aWR0aCAvIDI7XHJcbiAgICAgICAgY29uc3QgaCA9IF9yZWN0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgY29uc3QgbCA9IDAuMDAxO1xyXG4gICAgICAgIGlmIChvdXQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhYWJiLnNldChvdXQsIHB4LCBweSwgcHosIHcsIGgsIGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgYWFiYihweCwgcHksIHB6LCB3LCBoLCBsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF91cGRhdGVWaXNpYmlsaXR5KCkge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLm5vZGU7XHJcbiAgICAgICAgLy8g6I635Y+W6KKr5riy5p+T55u45py655qEIHZpc2liaWxpdHlcclxuICAgICAgICB3aGlsZSAocGFyZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhc0NvbXAgPSBwYXJlbnQuZ2V0Q29tcG9uZW50KCdjYy5DYW52YXMnKSBhcyBDYW52YXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FudmFzQ29tcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbnZhcyA9IGNhbnZhc0NvbXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9wYXJlbnRDaGFuZ2VkKG5vZGU6IE5vZGUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2FudmFzICYmIHRoaXMuX2NhbnZhcy5ub2RlID09PSB0aGlzLm5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc29ydFNpYmxpbmdzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zb3J0U2libGluZ3MoKSB7XHJcbiAgICAgICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLm5vZGUucGFyZW50ICYmIHRoaXMubm9kZS5wYXJlbnQuY2hpbGRyZW4gYXMgTXV0YWJsZTxOb2RlW10+O1xyXG4gICAgICAgIGlmIChzaWJsaW5ncykge1xyXG4gICAgICAgICAgICBzaWJsaW5ncy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhQ29tcCA9IGEuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYkNvbXAgPSBiLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhID0gYUNvbXAgPyBhQ29tcC5wcmlvcml0eSA6IDA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYiA9IGJDb21wID8gYkNvbXAucHJpb3JpdHkgOiAwO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZiA9IGNhIC0gY2I7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlmZiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmdldFNpYmxpbmdJbmRleCgpIC0gYi5nZXRTaWJsaW5nSW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBkaWZmO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnQhLl91cGRhdGVTaWJsaW5nSW5kZXgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19