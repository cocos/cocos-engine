(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/director.js", "../../core/math/index.js", "../../core/platform/sys.js", "../../core/platform/view.js", "../../core/platform/visible-rect.js", "../../core/scene-graph/index.js", "../../core/scene-graph/node.js", "../../core/utils/js.js", "./widget.js", "../../core/components/ui-base/index.js", "../../core/default-constants.js", "../../core/global-exports.js", "../../core/platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/director.js"), require("../../core/math/index.js"), require("../../core/platform/sys.js"), require("../../core/platform/view.js"), require("../../core/platform/visible-rect.js"), require("../../core/scene-graph/index.js"), require("../../core/scene-graph/node.js"), require("../../core/utils/js.js"), require("./widget.js"), require("../../core/components/ui-base/index.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"), require("../../core/platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.director, global.index, global.sys, global.view, global.visibleRect, global.index, global.node, global.js, global.widget, global.index, global.defaultConstants, global.globalExports, global.debug);
    global.widgetManager = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _director, _index, _sys, _view, _visibleRect, _index2, _node, _js, _widget, _index3, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.widgetManager = void 0;
  _visibleRect = _interopRequireDefault(_visibleRect);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var _tempPos = new _index.Vec3();

  var _defaultAnchor = new _index.Vec2();

  var tInverseTranslate = new _index.Vec3();
  var tInverseScale = new _index.Vec3(1, 1, 1); // align to borders by adjusting node's position and size (ignore rotation)

  function align(node, widget) {
    var hasTarget = widget.target;
    var target;
    var inverseTranslate = tInverseTranslate;
    var inverseScale = tInverseScale;

    if (hasTarget) {
      target = hasTarget; // inverseTranslate = tInverseTranslate;
      // inverseScale = tInverseScale;

      (0, _widget.computeInverseTransForTarget)(node, target, inverseTranslate, inverseScale);
    } else {
      target = node.parent;
    }

    if (!target.getComponent(_index3.UITransform)) {
      return;
    }

    var targetSize = (0, _widget.getReadonlyNodeSize)(target);
    var isScene = target instanceof _index2.Scene;
    var targetAnchor = isScene ? _defaultAnchor : target.getComponent(_index3.UITransform).anchorPoint; // @ts-ignore

    var isRoot = !_defaultConstants.EDITOR && isScene;
    node.getPosition(_tempPos);
    var uiTrans = node._uiProps.uiTransformComp;
    var x = _tempPos.x;
    var y = _tempPos.y;
    var anchor = uiTrans.anchorPoint;
    var scale = node.getScale();

    if (widget.alignFlags & _widget.AlignFlags.HORIZONTAL) {
      var localLeft = 0;
      var localRight = 0;
      var targetWidth = targetSize.width;

      if (isRoot) {
        localLeft = _visibleRect.default.left.x;
        localRight = _visibleRect.default.right.x;
      } else {
        localLeft = -targetAnchor.x * targetWidth;
        localRight = localLeft + targetWidth;
      } // adjust borders according to offsets


      localLeft += widget.isAbsoluteLeft ? widget.left : widget.left * targetWidth;
      localRight -= widget.isAbsoluteRight ? widget.right : widget.right * targetWidth;

      if (hasTarget) {
        localLeft += inverseTranslate.x;
        localLeft *= inverseScale.x;
        localRight += inverseTranslate.x;
        localRight *= inverseScale.x;
      }

      var width = 0;
      var anchorX = anchor.x;
      var scaleX = scale.x;

      if (scaleX < 0) {
        anchorX = 1.0 - anchorX;
        scaleX = -scaleX;
      }

      if (widget.isStretchWidth) {
        width = localRight - localLeft;

        if (scaleX !== 0) {
          uiTrans.width = width / scaleX;
        }

        x = localLeft + anchorX * width;
      } else {
        width = uiTrans.width * scaleX;

        if (widget.isAlignHorizontalCenter) {
          var localHorizontalCenter = widget.isAbsoluteHorizontalCenter ? widget.horizontalCenter : widget.horizontalCenter * targetWidth;
          var targetCenter = (0.5 - targetAnchor.x) * targetSize.width;

          if (hasTarget) {
            localHorizontalCenter *= inverseScale.x;
            targetCenter += inverseTranslate.x;
            targetCenter *= inverseScale.x;
          }

          x = targetCenter + (anchorX - 0.5) * width + localHorizontalCenter;
        } else if (widget.isAlignLeft) {
          x = localLeft + anchorX * width;
        } else {
          x = localRight + (anchorX - 1) * width;
        }
      }

      widget._lastSize.width = width;
    }

    if (widget.alignFlags & _widget.AlignFlags.VERTICAL) {
      var localTop = 0;
      var localBottom = 0;
      var targetHeight = targetSize.height;

      if (isRoot) {
        localBottom = _visibleRect.default.bottom.y;
        localTop = _visibleRect.default.top.y;
      } else {
        localBottom = -targetAnchor.y * targetHeight;
        localTop = localBottom + targetHeight;
      } // adjust borders according to offsets


      localBottom += widget.isAbsoluteBottom ? widget.bottom : widget.bottom * targetHeight;
      localTop -= widget.isAbsoluteTop ? widget.top : widget.top * targetHeight;

      if (hasTarget) {
        // transform
        localBottom += inverseTranslate.y;
        localBottom *= inverseScale.y;
        localTop += inverseTranslate.y;
        localTop *= inverseScale.y;
      }

      var height = 0;
      var anchorY = anchor.y;
      var scaleY = scale.y;

      if (scaleY < 0) {
        anchorY = 1.0 - anchorY;
        scaleY = -scaleY;
      }

      if (widget.isStretchHeight) {
        height = localTop - localBottom;

        if (scaleY !== 0) {
          uiTrans.height = height / scaleY;
        }

        y = localBottom + anchorY * height;
      } else {
        height = uiTrans.height * scaleY;

        if (widget.isAlignVerticalCenter) {
          var localVerticalCenter = widget.isAbsoluteVerticalCenter ? widget.verticalCenter : widget.verticalCenter * targetHeight;
          var targetMiddle = (0.5 - targetAnchor.y) * targetSize.height;

          if (hasTarget) {
            localVerticalCenter *= inverseScale.y;
            targetMiddle += inverseTranslate.y;
            targetMiddle *= inverseScale.y;
          }

          y = targetMiddle + (anchorY - 0.5) * height + localVerticalCenter;
        } else if (widget.isAlignBottom) {
          y = localBottom + anchorY * height;
        } else {
          y = localTop + (anchorY - 1) * height;
        }
      }

      widget._lastSize.height = height;
    }

    node.setPosition(x, y, _tempPos.z);

    _index.Vec3.set(widget._lastPos, x, y, _tempPos.z);
  } // TODO: type is hack, Change to the type actually used (Node or BaseNode) when BaseNode complete


  function visitNode(node) {
    var widget = node.getComponent(_widget.Widget);

    if (widget) {
      // @ts-ignore
      if (_defaultConstants.DEV) {
        widget._validateTargetInDEV();
      }

      align(node, widget); // @ts-ignore

      if ((!_defaultConstants.EDITOR || widgetManager.animationState.animatedSinceLastFrame) && widget.alignMode !== _widget.AlignMode.ALWAYS) {
        widget.enabled = false;
      } else {
        if (_globalExports.legacyCC.isValid(node, true)) {
          activeWidgets.push(widget);
        } else {
          return;
        }
      }
    }

    var children = node.children;

    var _iterator = _createForOfIteratorHelper(children),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var child = _step.value;

        if (child.active) {
          visitNode(child);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } // if (EDITOR) {
  //     const animationState = {
  //         previewing: false,
  //         time: 0,
  //         animatedSinceLastFrame: false,
  //     };
  // }


  function refreshScene() {
    // check animation editor
    // if (EDITOR && !Editor.isBuilder) {
    // var AnimUtils = Editor.require('scene://utils/animation');
    // var EditMode = Editor.require('scene://edit-mode');
    // if (AnimUtils && EditMode) {
    //     var nowPreviewing = (EditMode.curMode().name === 'animation' && !!AnimUtils.Cache.animation);
    //     if (nowPreviewing !== animationState.previewing) {
    //         animationState.previewing = nowPreviewing;
    //         if (nowPreviewing) {
    //             animationState.animatedSinceLastFrame = true;
    //             let component = cc.engine.getInstanceById(AnimUtils.Cache.component);
    //             if (component) {
    //                 let animation = component.getAnimationState(AnimUtils.Cache.animation);
    //                 animationState.time = animation.time;
    //             }
    //         }
    //         else {
    //             animationState.animatedSinceLastFrame = false;
    //         }
    //     }
    //     else if (nowPreviewing) {
    //         let component = cc.engine.getInstanceById(AnimUtils.Cache.component);
    //         if (component) {
    //             let animation = component.getAnimationState(AnimUtils.Cache.animation);
    //             if (animationState.time !== animation.time) {
    //                 animationState.animatedSinceLastFrame = true;
    //                 animationState.time = AnimUtils.Cache.animation.time;
    //             }
    //         }
    //     }
    // }
    // }
    var scene = _director.director.getScene();

    if (scene) {
      widgetManager.isAligning = true;

      if (widgetManager._nodesOrderDirty) {
        activeWidgets.length = 0;
        visitNode(scene);
        widgetManager._nodesOrderDirty = false;
      } else {
        var i = 0;
        var widget = null;
        var iterator = widgetManager._activeWidgetsIterator; // var AnimUtils;
        // if (EDITOR &&
        //     (AnimUtils = Editor.require('scene://utils/animation')) &&
        //     AnimUtils.Cache.animation) {
        //     var editingNode = cc.engine.getInstanceById(AnimUtils.Cache.rNode);
        //     if (editingNode) {
        //         for (i = activeWidgets.length - 1; i >= 0; i--) {
        //             widget = activeWidgets[i];
        //             var node = widget.node;
        //             if (widget.alignMode !== AlignMode.ALWAYS &&
        //                 animationState.animatedSinceLastFrame &&
        //                 node.isChildOf(editingNode)
        //             ) {
        //                 // widget contains in activeWidgets should aligned at least once
        //                 widget.enabled = false;
        //             }
        //             else {
        //                 align(node, widget);
        //             }
        //         }
        //     }
        // }
        // else {
        // loop reversely will not help to prevent out of sync
        // because user may remove more than one item during a step.

        for (iterator.i = 0; iterator.i < activeWidgets.length; ++iterator.i) {
          widget = activeWidgets[iterator.i];

          if (widget._dirty) {
            align(widget.node, widget);
            widget._dirty = false;
          }
        } // }

      }

      widgetManager.isAligning = false;
    } // check animation editor


    if (_defaultConstants.EDITOR) {
      widgetManager.animationState.animatedSinceLastFrame = false;
    }
  }

  var activeWidgets = []; // updateAlignment from scene to node recursively

  function updateAlignment(node) {
    var parent = node.parent;

    if (parent && _node.Node.isNode(parent)) {
      updateAlignment(parent);
    } // node._widget will be null when widget is disabled


    var widget = node.getComponent(_widget.Widget);

    if (widget && parent) {
      align(node, widget);
    }
  }

  var canvasList = [];
  var widgetManager = _globalExports.legacyCC._widgetManager = {
    isAligning: false,
    _nodesOrderDirty: false,
    _activeWidgetsIterator: new _js.array.MutableForwardIterator(activeWidgets),
    // hack
    animationState: _defaultConstants.EDITOR ? {
      previewing: false,
      time: 0,
      animatedSinceLastFrame: false
    } : null,
    init: function init() {
      _director.director.on(_director.Director.EVENT_AFTER_UPDATE, refreshScene);

      if (_defaultConstants.EDITOR
      /*&& cc.engine*/
      ) {// cc.engien extends eventTarget
          // cc.engine.on('design-resolution-changed', this.onResized.bind(this));
        } else {
        if (_sys.sys.isMobile) {
          var thisOnResized = this.onResized.bind(this);
          window.addEventListener('resize', thisOnResized);
          window.addEventListener('orientationchange', thisOnResized);
        } else {
          _view.View.instance.on('design-resolution-changed', this.onResized, this);
        }
      }
    },
    add: function add(widget) {
      this._nodesOrderDirty = true;

      var canvasComp = _director.director.root.ui.getScreen(widget.node._uiProps.uiTransformComp.visibility);

      if (canvasComp && canvasList.indexOf(canvasComp) === -1) {
        canvasList.push(canvasComp);
        canvasComp.node.on('design-resolution-changed', this.onResized, this);
      }
    },
    remove: function remove(widget) {
      this._activeWidgetsIterator.remove(widget);
    },
    onResized: function onResized() {
      var scene = _director.director.getScene();

      if (scene) {
        this.refreshWidgetOnResized(scene);
      }
    },
    refreshWidgetOnResized: function refreshWidgetOnResized(node) {
      if (_node.Node.isNode(node)) {
        var widget = node.getComponent(_widget.Widget);

        if (widget && widget.alignMode === _widget.AlignMode.ON_WINDOW_RESIZE) {
          widget.enabled = true;
        }
      }

      var children = node.children;

      var _iterator2 = _createForOfIteratorHelper(children),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var child = _step2.value;
          this.refreshWidgetOnResized(child);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    },
    updateOffsetsToStayPut: function updateOffsetsToStayPut(widget, e) {
      function i(t, c) {
        return Math.abs(t - c) > 1e-10 ? c : t;
      }

      var widgetNode = widget.node;
      var widgetParent = widgetNode.parent;

      if (widgetParent) {
        var zero = new _index.Vec3();
        var one = new _index.Vec3(1, 1, 1);

        if (widget.target) {
          widgetParent = widget.target;
          (0, _widget.computeInverseTransForTarget)(widgetNode, widgetParent, zero, one);
        }

        if (!e) {
          return;
        }

        var parentTrans = widgetParent._uiProps.uiTransformComp;
        var trans = widgetNode._uiProps.uiTransformComp;

        if (!parentTrans) {
          (0, _debug.warnID)(6501, widget.node.name);
          return;
        }

        var parentAP = parentTrans.anchorPoint;
        var matchSize = (0, _widget.getReadonlyNodeSize)(widgetParent);
        var myAP = trans.anchorPoint;
        var pos = widgetNode.getPosition();
        var alignFlags = _widget.AlignFlags;
        var widgetNodeScale = widgetNode.getScale();
        var temp = 0;

        if (e & alignFlags.LEFT) {
          var l = -parentAP.x * matchSize.width;
          l += zero.x;
          l *= one.x;
          temp = pos.x - myAP.x * trans.width * widgetNodeScale.x - l;

          if (!widget.isAbsoluteLeft) {
            temp /= matchSize.width;
          }

          temp /= one.x;
          widget.left = i(widget.left, temp);
        }

        if (e & alignFlags.RIGHT) {
          var r = (1 - parentAP.x) * matchSize.width;
          r += zero.x;
          temp = (r *= one.x) - (pos.x + (1 - myAP.x) * trans.width * widgetNodeScale.x);

          if (!widget.isAbsoluteRight) {
            temp /= matchSize.width;
          }

          temp /= one.x;
          widget.right = i(widget.right, temp);
        }

        if (e & alignFlags.TOP) {
          var t = (1 - parentAP.y) * matchSize.height;
          t += zero.y;
          temp = (t *= one.y) - (pos.y + (1 - myAP.y) * trans.height * widgetNodeScale.y);

          if (!widget.isAbsoluteTop) {
            temp /= matchSize.height;
          }

          temp /= one.y;
          widget.top = i(widget.top, temp);
        }

        if (e & alignFlags.BOT) {
          var b = -parentAP.y * matchSize.height;
          b += zero.y;
          b *= one.y;
          temp = pos.y - myAP.y * trans.height * widgetNodeScale.y - b;

          if (!widget.isAbsoluteBottom) {
            temp /= matchSize.height;
          }

          temp /= one.y;
          widget.bottom = i(widget.bottom, temp);
        }
      }
    },
    updateAlignment: updateAlignment,
    AlignMode: _widget.AlignMode,
    AlignFlags: _widget.AlignFlags
  };
  _exports.widgetManager = widgetManager;

  _director.director.on(_director.Director.EVENT_INIT, function () {
    widgetManager.init();
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvd2lkZ2V0LW1hbmFnZXIudHMiXSwibmFtZXMiOlsiX3RlbXBQb3MiLCJWZWMzIiwiX2RlZmF1bHRBbmNob3IiLCJWZWMyIiwidEludmVyc2VUcmFuc2xhdGUiLCJ0SW52ZXJzZVNjYWxlIiwiYWxpZ24iLCJub2RlIiwid2lkZ2V0IiwiaGFzVGFyZ2V0IiwidGFyZ2V0IiwiaW52ZXJzZVRyYW5zbGF0ZSIsImludmVyc2VTY2FsZSIsInBhcmVudCIsImdldENvbXBvbmVudCIsIlVJVHJhbnNmb3JtIiwidGFyZ2V0U2l6ZSIsImlzU2NlbmUiLCJTY2VuZSIsInRhcmdldEFuY2hvciIsImFuY2hvclBvaW50IiwiaXNSb290IiwiRURJVE9SIiwiZ2V0UG9zaXRpb24iLCJ1aVRyYW5zIiwiX3VpUHJvcHMiLCJ1aVRyYW5zZm9ybUNvbXAiLCJ4IiwieSIsImFuY2hvciIsInNjYWxlIiwiZ2V0U2NhbGUiLCJhbGlnbkZsYWdzIiwiQWxpZ25GbGFncyIsIkhPUklaT05UQUwiLCJsb2NhbExlZnQiLCJsb2NhbFJpZ2h0IiwidGFyZ2V0V2lkdGgiLCJ3aWR0aCIsInZpc2libGVSZWN0IiwibGVmdCIsInJpZ2h0IiwiaXNBYnNvbHV0ZUxlZnQiLCJpc0Fic29sdXRlUmlnaHQiLCJhbmNob3JYIiwic2NhbGVYIiwiaXNTdHJldGNoV2lkdGgiLCJpc0FsaWduSG9yaXpvbnRhbENlbnRlciIsImxvY2FsSG9yaXpvbnRhbENlbnRlciIsImlzQWJzb2x1dGVIb3Jpem9udGFsQ2VudGVyIiwiaG9yaXpvbnRhbENlbnRlciIsInRhcmdldENlbnRlciIsImlzQWxpZ25MZWZ0IiwiX2xhc3RTaXplIiwiVkVSVElDQUwiLCJsb2NhbFRvcCIsImxvY2FsQm90dG9tIiwidGFyZ2V0SGVpZ2h0IiwiaGVpZ2h0IiwiYm90dG9tIiwidG9wIiwiaXNBYnNvbHV0ZUJvdHRvbSIsImlzQWJzb2x1dGVUb3AiLCJhbmNob3JZIiwic2NhbGVZIiwiaXNTdHJldGNoSGVpZ2h0IiwiaXNBbGlnblZlcnRpY2FsQ2VudGVyIiwibG9jYWxWZXJ0aWNhbENlbnRlciIsImlzQWJzb2x1dGVWZXJ0aWNhbENlbnRlciIsInZlcnRpY2FsQ2VudGVyIiwidGFyZ2V0TWlkZGxlIiwiaXNBbGlnbkJvdHRvbSIsInNldFBvc2l0aW9uIiwieiIsInNldCIsIl9sYXN0UG9zIiwidmlzaXROb2RlIiwiV2lkZ2V0IiwiREVWIiwiX3ZhbGlkYXRlVGFyZ2V0SW5ERVYiLCJ3aWRnZXRNYW5hZ2VyIiwiYW5pbWF0aW9uU3RhdGUiLCJhbmltYXRlZFNpbmNlTGFzdEZyYW1lIiwiYWxpZ25Nb2RlIiwiQWxpZ25Nb2RlIiwiQUxXQVlTIiwiZW5hYmxlZCIsImxlZ2FjeUNDIiwiaXNWYWxpZCIsImFjdGl2ZVdpZGdldHMiLCJwdXNoIiwiY2hpbGRyZW4iLCJjaGlsZCIsImFjdGl2ZSIsInJlZnJlc2hTY2VuZSIsInNjZW5lIiwiZGlyZWN0b3IiLCJnZXRTY2VuZSIsImlzQWxpZ25pbmciLCJfbm9kZXNPcmRlckRpcnR5IiwibGVuZ3RoIiwiaSIsIml0ZXJhdG9yIiwiX2FjdGl2ZVdpZGdldHNJdGVyYXRvciIsIl9kaXJ0eSIsInVwZGF0ZUFsaWdubWVudCIsIk5vZGUiLCJpc05vZGUiLCJjYW52YXNMaXN0IiwiX3dpZGdldE1hbmFnZXIiLCJhcnJheSIsIk11dGFibGVGb3J3YXJkSXRlcmF0b3IiLCJwcmV2aWV3aW5nIiwidGltZSIsImluaXQiLCJvbiIsIkRpcmVjdG9yIiwiRVZFTlRfQUZURVJfVVBEQVRFIiwic3lzIiwiaXNNb2JpbGUiLCJ0aGlzT25SZXNpemVkIiwib25SZXNpemVkIiwiYmluZCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJWaWV3IiwiaW5zdGFuY2UiLCJhZGQiLCJjYW52YXNDb21wIiwicm9vdCIsInVpIiwiZ2V0U2NyZWVuIiwidmlzaWJpbGl0eSIsImluZGV4T2YiLCJyZW1vdmUiLCJyZWZyZXNoV2lkZ2V0T25SZXNpemVkIiwiT05fV0lORE9XX1JFU0laRSIsInVwZGF0ZU9mZnNldHNUb1N0YXlQdXQiLCJlIiwidCIsImMiLCJNYXRoIiwiYWJzIiwid2lkZ2V0Tm9kZSIsIndpZGdldFBhcmVudCIsInplcm8iLCJvbmUiLCJwYXJlbnRUcmFucyIsInRyYW5zIiwibmFtZSIsInBhcmVudEFQIiwibWF0Y2hTaXplIiwibXlBUCIsInBvcyIsIndpZGdldE5vZGVTY2FsZSIsInRlbXAiLCJMRUZUIiwibCIsIlJJR0hUIiwiciIsIlRPUCIsIkJPVCIsImIiLCJFVkVOVF9JTklUIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZDQSxNQUFNQSxRQUFRLEdBQUcsSUFBSUMsV0FBSixFQUFqQjs7QUFDQSxNQUFNQyxjQUFjLEdBQUcsSUFBSUMsV0FBSixFQUF2Qjs7QUFFQSxNQUFNQyxpQkFBaUIsR0FBRyxJQUFJSCxXQUFKLEVBQTFCO0FBQ0EsTUFBTUksYUFBYSxHQUFHLElBQUlKLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBdEIsQyxDQUVBOztBQUNBLFdBQVNLLEtBQVQsQ0FBZ0JDLElBQWhCLEVBQTRCQyxNQUE1QixFQUE0QztBQUN4QyxRQUFNQyxTQUFTLEdBQUdELE1BQU0sQ0FBQ0UsTUFBekI7QUFDQSxRQUFJQSxNQUFKO0FBQ0EsUUFBTUMsZ0JBQWdCLEdBQUdQLGlCQUF6QjtBQUNBLFFBQU1RLFlBQVksR0FBR1AsYUFBckI7O0FBQ0EsUUFBSUksU0FBSixFQUFlO0FBQ1hDLE1BQUFBLE1BQU0sR0FBR0QsU0FBVCxDQURXLENBRVg7QUFDQTs7QUFDQSxnREFBNkJGLElBQTdCLEVBQW1DRyxNQUFuQyxFQUEyQ0MsZ0JBQTNDLEVBQTZEQyxZQUE3RDtBQUNILEtBTEQsTUFLTztBQUNIRixNQUFBQSxNQUFNLEdBQUdILElBQUksQ0FBQ00sTUFBZDtBQUNIOztBQUNELFFBQUksQ0FBQ0gsTUFBTSxDQUFDSSxZQUFQLENBQW9CQyxtQkFBcEIsQ0FBTCxFQUF1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IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL2NhbnZhcyc7XHJcbmltcG9ydCB7IERpcmVjdG9yLCBkaXJlY3RvciB9IGZyb20gJy4uLy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBWZWMyLCBWZWMzIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgc3lzIH0gZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybS9zeXMnO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybS92aWV3JztcclxuaW1wb3J0IHZpc2libGVSZWN0IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0vdmlzaWJsZS1yZWN0JztcclxuaW1wb3J0IHsgU2NlbmUgfSBmcm9tICcuLi8uLi9jb3JlL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZSc7XHJcbmltcG9ydCB7IGFycmF5IH0gZnJvbSAnLi4vLi4vY29yZS91dGlscy9qcyc7XHJcbmltcG9ydCB7IEFsaWduRmxhZ3MsIEFsaWduTW9kZSwgY29tcHV0ZUludmVyc2VUcmFuc0ZvclRhcmdldCwgZ2V0UmVhZG9ubHlOb2RlU2l6ZSwgV2lkZ2V0IH0gZnJvbSAnLi93aWRnZXQnO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlJztcclxuaW1wb3J0IHsgRURJVE9SLCBERVYgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyB3YXJuSUQgfSBmcm9tICcuLi8uLi9jb3JlL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbmNvbnN0IF90ZW1wUG9zID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX2RlZmF1bHRBbmNob3IgPSBuZXcgVmVjMigpO1xyXG5cclxuY29uc3QgdEludmVyc2VUcmFuc2xhdGUgPSBuZXcgVmVjMygpO1xyXG5jb25zdCB0SW52ZXJzZVNjYWxlID0gbmV3IFZlYzMoMSwgMSwgMSk7XHJcblxyXG4vLyBhbGlnbiB0byBib3JkZXJzIGJ5IGFkanVzdGluZyBub2RlJ3MgcG9zaXRpb24gYW5kIHNpemUgKGlnbm9yZSByb3RhdGlvbilcclxuZnVuY3Rpb24gYWxpZ24gKG5vZGU6IE5vZGUsIHdpZGdldDogV2lkZ2V0KSB7XHJcbiAgICBjb25zdCBoYXNUYXJnZXQgPSB3aWRnZXQudGFyZ2V0O1xyXG4gICAgbGV0IHRhcmdldDogTm9kZSB8IFNjZW5lO1xyXG4gICAgY29uc3QgaW52ZXJzZVRyYW5zbGF0ZSA9IHRJbnZlcnNlVHJhbnNsYXRlO1xyXG4gICAgY29uc3QgaW52ZXJzZVNjYWxlID0gdEludmVyc2VTY2FsZTtcclxuICAgIGlmIChoYXNUYXJnZXQpIHtcclxuICAgICAgICB0YXJnZXQgPSBoYXNUYXJnZXQ7XHJcbiAgICAgICAgLy8gaW52ZXJzZVRyYW5zbGF0ZSA9IHRJbnZlcnNlVHJhbnNsYXRlO1xyXG4gICAgICAgIC8vIGludmVyc2VTY2FsZSA9IHRJbnZlcnNlU2NhbGU7XHJcbiAgICAgICAgY29tcHV0ZUludmVyc2VUcmFuc0ZvclRhcmdldChub2RlLCB0YXJnZXQsIGludmVyc2VUcmFuc2xhdGUsIGludmVyc2VTY2FsZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRhcmdldCA9IG5vZGUucGFyZW50ITtcclxuICAgIH1cclxuICAgIGlmICghdGFyZ2V0LmdldENvbXBvbmVudChVSVRyYW5zZm9ybSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCB0YXJnZXRTaXplID0gZ2V0UmVhZG9ubHlOb2RlU2l6ZSh0YXJnZXQpO1xyXG4gICAgY29uc3QgaXNTY2VuZSA9IHRhcmdldCBpbnN0YW5jZW9mIFNjZW5lO1xyXG4gICAgY29uc3QgdGFyZ2V0QW5jaG9yID0gaXNTY2VuZSA/IF9kZWZhdWx0QW5jaG9yIDogdGFyZ2V0LmdldENvbXBvbmVudChVSVRyYW5zZm9ybSkhLmFuY2hvclBvaW50O1xyXG5cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGNvbnN0IGlzUm9vdCA9ICFFRElUT1IgJiYgaXNTY2VuZTtcclxuICAgIG5vZGUuZ2V0UG9zaXRpb24oX3RlbXBQb3MpO1xyXG4gICAgY29uc3QgdWlUcmFucyA9IG5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgIGxldCB4ID0gX3RlbXBQb3MueDtcclxuICAgIGxldCB5ID0gX3RlbXBQb3MueTtcclxuICAgIGNvbnN0IGFuY2hvciA9IHVpVHJhbnMuYW5jaG9yUG9pbnQ7XHJcbiAgICBjb25zdCBzY2FsZSA9IG5vZGUuZ2V0U2NhbGUoKTtcclxuXHJcbiAgICBpZiAod2lkZ2V0LmFsaWduRmxhZ3MgJiBBbGlnbkZsYWdzLkhPUklaT05UQUwpIHtcclxuICAgICAgICBsZXQgbG9jYWxMZWZ0ID0gMDtcclxuICAgICAgICBsZXQgbG9jYWxSaWdodCA9IDA7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0V2lkdGggPSB0YXJnZXRTaXplLndpZHRoO1xyXG4gICAgICAgIGlmIChpc1Jvb3QpIHtcclxuICAgICAgICAgICAgbG9jYWxMZWZ0ID0gdmlzaWJsZVJlY3QubGVmdC54O1xyXG4gICAgICAgICAgICBsb2NhbFJpZ2h0ID0gdmlzaWJsZVJlY3QucmlnaHQueDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2NhbExlZnQgPSAtdGFyZ2V0QW5jaG9yLnggKiB0YXJnZXRXaWR0aDtcclxuICAgICAgICAgICAgbG9jYWxSaWdodCA9IGxvY2FsTGVmdCArIHRhcmdldFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRqdXN0IGJvcmRlcnMgYWNjb3JkaW5nIHRvIG9mZnNldHNcclxuICAgICAgICBsb2NhbExlZnQgKz0gd2lkZ2V0LmlzQWJzb2x1dGVMZWZ0ID8gd2lkZ2V0LmxlZnQgOiB3aWRnZXQubGVmdCAqIHRhcmdldFdpZHRoO1xyXG4gICAgICAgIGxvY2FsUmlnaHQgLT0gd2lkZ2V0LmlzQWJzb2x1dGVSaWdodCA/IHdpZGdldC5yaWdodCA6IHdpZGdldC5yaWdodCAqIHRhcmdldFdpZHRoO1xyXG5cclxuICAgICAgICBpZiAoaGFzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGxvY2FsTGVmdCArPSBpbnZlcnNlVHJhbnNsYXRlLng7XHJcbiAgICAgICAgICAgIGxvY2FsTGVmdCAqPSBpbnZlcnNlU2NhbGUueDtcclxuICAgICAgICAgICAgbG9jYWxSaWdodCArPSBpbnZlcnNlVHJhbnNsYXRlLng7XHJcbiAgICAgICAgICAgIGxvY2FsUmlnaHQgKj0gaW52ZXJzZVNjYWxlLng7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgd2lkdGggPSAwO1xyXG4gICAgICAgIGxldCBhbmNob3JYID0gYW5jaG9yLng7XHJcbiAgICAgICAgbGV0IHNjYWxlWCA9IHNjYWxlLng7XHJcbiAgICAgICAgaWYgKHNjYWxlWCA8IDApIHtcclxuICAgICAgICAgICAgYW5jaG9yWCA9IDEuMCAtIGFuY2hvclg7XHJcbiAgICAgICAgICAgIHNjYWxlWCA9IC1zY2FsZVg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aWRnZXQuaXNTdHJldGNoV2lkdGgpIHtcclxuICAgICAgICAgICAgd2lkdGggPSBsb2NhbFJpZ2h0IC0gbG9jYWxMZWZ0O1xyXG4gICAgICAgICAgICBpZiAoc2NhbGVYICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB1aVRyYW5zLndpZHRoID0gd2lkdGggLyBzY2FsZVg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeCA9IGxvY2FsTGVmdCArIGFuY2hvclggKiB3aWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aWR0aCA9IHVpVHJhbnMud2lkdGggKiBzY2FsZVg7XHJcbiAgICAgICAgICAgIGlmICh3aWRnZXQuaXNBbGlnbkhvcml6b250YWxDZW50ZXIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsb2NhbEhvcml6b250YWxDZW50ZXIgPSB3aWRnZXQuaXNBYnNvbHV0ZUhvcml6b250YWxDZW50ZXIgP1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZGdldC5ob3Jpem9udGFsQ2VudGVyIDogd2lkZ2V0Lmhvcml6b250YWxDZW50ZXIgKiB0YXJnZXRXaWR0aDtcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRDZW50ZXIgPSAoMC41IC0gdGFyZ2V0QW5jaG9yLngpICogdGFyZ2V0U2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGlmIChoYXNUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbEhvcml6b250YWxDZW50ZXIgKj0gaW52ZXJzZVNjYWxlLng7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q2VudGVyICs9IGludmVyc2VUcmFuc2xhdGUueDtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRDZW50ZXIgKj0gaW52ZXJzZVNjYWxlLng7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB4ID0gdGFyZ2V0Q2VudGVyICsgKGFuY2hvclggLSAwLjUpICogd2lkdGggKyBsb2NhbEhvcml6b250YWxDZW50ZXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2lkZ2V0LmlzQWxpZ25MZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICB4ID0gbG9jYWxMZWZ0ICsgYW5jaG9yWCAqIHdpZHRoO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgeCA9IGxvY2FsUmlnaHQgKyAoYW5jaG9yWCAtIDEpICogd2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdpZGdldC5fbGFzdFNpemUud2lkdGggPSB3aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2lkZ2V0LmFsaWduRmxhZ3MgJiBBbGlnbkZsYWdzLlZFUlRJQ0FMKSB7XHJcblxyXG4gICAgICAgIGxldCBsb2NhbFRvcCA9IDA7XHJcbiAgICAgICAgbGV0IGxvY2FsQm90dG9tID0gMDtcclxuICAgICAgICBjb25zdCB0YXJnZXRIZWlnaHQgPSB0YXJnZXRTaXplLmhlaWdodDtcclxuICAgICAgICBpZiAoaXNSb290KSB7XHJcbiAgICAgICAgICAgIGxvY2FsQm90dG9tID0gdmlzaWJsZVJlY3QuYm90dG9tLnk7XHJcbiAgICAgICAgICAgIGxvY2FsVG9wID0gdmlzaWJsZVJlY3QudG9wLnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9jYWxCb3R0b20gPSAtdGFyZ2V0QW5jaG9yLnkgKiB0YXJnZXRIZWlnaHQ7XHJcbiAgICAgICAgICAgIGxvY2FsVG9wID0gbG9jYWxCb3R0b20gKyB0YXJnZXRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGp1c3QgYm9yZGVycyBhY2NvcmRpbmcgdG8gb2Zmc2V0c1xyXG4gICAgICAgIGxvY2FsQm90dG9tICs9IHdpZGdldC5pc0Fic29sdXRlQm90dG9tID8gd2lkZ2V0LmJvdHRvbSA6IHdpZGdldC5ib3R0b20gKiB0YXJnZXRIZWlnaHQ7XHJcbiAgICAgICAgbG9jYWxUb3AgLT0gd2lkZ2V0LmlzQWJzb2x1dGVUb3AgPyB3aWRnZXQudG9wIDogd2lkZ2V0LnRvcCAqIHRhcmdldEhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKGhhc1RhcmdldCkge1xyXG4gICAgICAgICAgICAvLyB0cmFuc2Zvcm1cclxuICAgICAgICAgICAgbG9jYWxCb3R0b20gKz0gaW52ZXJzZVRyYW5zbGF0ZS55O1xyXG4gICAgICAgICAgICBsb2NhbEJvdHRvbSAqPSBpbnZlcnNlU2NhbGUueTtcclxuICAgICAgICAgICAgbG9jYWxUb3AgKz0gaW52ZXJzZVRyYW5zbGF0ZS55O1xyXG4gICAgICAgICAgICBsb2NhbFRvcCAqPSBpbnZlcnNlU2NhbGUueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBoZWlnaHQgPSAwO1xyXG4gICAgICAgIGxldCBhbmNob3JZID0gYW5jaG9yLnk7XHJcbiAgICAgICAgbGV0IHNjYWxlWSA9IHNjYWxlLnk7XHJcbiAgICAgICAgaWYgKHNjYWxlWSA8IDApIHtcclxuICAgICAgICAgICAgYW5jaG9yWSA9IDEuMCAtIGFuY2hvclk7XHJcbiAgICAgICAgICAgIHNjYWxlWSA9IC1zY2FsZVk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aWRnZXQuaXNTdHJldGNoSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGxvY2FsVG9wIC0gbG9jYWxCb3R0b207XHJcbiAgICAgICAgICAgIGlmIChzY2FsZVkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHVpVHJhbnMuaGVpZ2h0ID0gaGVpZ2h0IC8gc2NhbGVZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHkgPSBsb2NhbEJvdHRvbSArIGFuY2hvclkgKiBoZWlnaHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gdWlUcmFucy5oZWlnaHQgKiBzY2FsZVk7XHJcbiAgICAgICAgICAgIGlmICh3aWRnZXQuaXNBbGlnblZlcnRpY2FsQ2VudGVyKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbG9jYWxWZXJ0aWNhbENlbnRlciA9IHdpZGdldC5pc0Fic29sdXRlVmVydGljYWxDZW50ZXIgP1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZGdldC52ZXJ0aWNhbENlbnRlciA6IHdpZGdldC52ZXJ0aWNhbENlbnRlciAqIHRhcmdldEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRNaWRkbGUgPSAoMC41IC0gdGFyZ2V0QW5jaG9yLnkpICogdGFyZ2V0U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGFzVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxWZXJ0aWNhbENlbnRlciAqPSBpbnZlcnNlU2NhbGUueTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRNaWRkbGUgKz0gaW52ZXJzZVRyYW5zbGF0ZS55O1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldE1pZGRsZSAqPSBpbnZlcnNlU2NhbGUueTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHkgPSB0YXJnZXRNaWRkbGUgKyAoYW5jaG9yWSAtIDAuNSkgKiBoZWlnaHQgKyBsb2NhbFZlcnRpY2FsQ2VudGVyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpZGdldC5pc0FsaWduQm90dG9tKSB7XHJcbiAgICAgICAgICAgICAgICB5ID0gbG9jYWxCb3R0b20gKyBhbmNob3JZICogaGVpZ2h0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgeSA9IGxvY2FsVG9wICsgKGFuY2hvclkgLSAxKSAqIGhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2lkZ2V0Ll9sYXN0U2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZS5zZXRQb3NpdGlvbih4LCB5LCBfdGVtcFBvcy56KTtcclxuICAgIFZlYzMuc2V0KHdpZGdldC5fbGFzdFBvcywgeCwgeSwgX3RlbXBQb3Mueik7XHJcbn1cclxuXHJcbi8vIFRPRE86IHR5cGUgaXMgaGFjaywgQ2hhbmdlIHRvIHRoZSB0eXBlIGFjdHVhbGx5IHVzZWQgKE5vZGUgb3IgQmFzZU5vZGUpIHdoZW4gQmFzZU5vZGUgY29tcGxldGVcclxuZnVuY3Rpb24gdmlzaXROb2RlIChub2RlOiBhbnkpIHtcclxuICAgIGNvbnN0IHdpZGdldCA9IG5vZGUuZ2V0Q29tcG9uZW50KFdpZGdldCk7XHJcbiAgICBpZiAod2lkZ2V0KSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgd2lkZ2V0Ll92YWxpZGF0ZVRhcmdldEluREVWKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFsaWduKG5vZGUsIHdpZGdldCk7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmICgoIUVESVRPUiB8fCB3aWRnZXRNYW5hZ2VyLmFuaW1hdGlvblN0YXRlIS5hbmltYXRlZFNpbmNlTGFzdEZyYW1lKSAmJiB3aWRnZXQuYWxpZ25Nb2RlICE9PSBBbGlnbk1vZGUuQUxXQVlTKSB7XHJcbiAgICAgICAgICAgIHdpZGdldC5lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGxlZ2FjeUNDLmlzVmFsaWQobm9kZSwgdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZVdpZGdldHMucHVzaCh3aWRnZXQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xyXG4gICAgICAgIGlmIChjaGlsZC5hY3RpdmUpIHtcclxuICAgICAgICAgICAgdmlzaXROb2RlKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGlmIChFRElUT1IpIHtcclxuLy8gICAgIGNvbnN0IGFuaW1hdGlvblN0YXRlID0ge1xyXG4vLyAgICAgICAgIHByZXZpZXdpbmc6IGZhbHNlLFxyXG4vLyAgICAgICAgIHRpbWU6IDAsXHJcbi8vICAgICAgICAgYW5pbWF0ZWRTaW5jZUxhc3RGcmFtZTogZmFsc2UsXHJcbi8vICAgICB9O1xyXG4vLyB9XHJcblxyXG5mdW5jdGlvbiByZWZyZXNoU2NlbmUgKCkge1xyXG4gICAgLy8gY2hlY2sgYW5pbWF0aW9uIGVkaXRvclxyXG4gICAgLy8gaWYgKEVESVRPUiAmJiAhRWRpdG9yLmlzQnVpbGRlcikge1xyXG4gICAgLy8gdmFyIEFuaW1VdGlscyA9IEVkaXRvci5yZXF1aXJlKCdzY2VuZTovL3V0aWxzL2FuaW1hdGlvbicpO1xyXG4gICAgLy8gdmFyIEVkaXRNb2RlID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vZWRpdC1tb2RlJyk7XHJcbiAgICAvLyBpZiAoQW5pbVV0aWxzICYmIEVkaXRNb2RlKSB7XHJcbiAgICAvLyAgICAgdmFyIG5vd1ByZXZpZXdpbmcgPSAoRWRpdE1vZGUuY3VyTW9kZSgpLm5hbWUgPT09ICdhbmltYXRpb24nICYmICEhQW5pbVV0aWxzLkNhY2hlLmFuaW1hdGlvbik7XHJcbiAgICAvLyAgICAgaWYgKG5vd1ByZXZpZXdpbmcgIT09IGFuaW1hdGlvblN0YXRlLnByZXZpZXdpbmcpIHtcclxuICAgIC8vICAgICAgICAgYW5pbWF0aW9uU3RhdGUucHJldmlld2luZyA9IG5vd1ByZXZpZXdpbmc7XHJcbiAgICAvLyAgICAgICAgIGlmIChub3dQcmV2aWV3aW5nKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBhbmltYXRpb25TdGF0ZS5hbmltYXRlZFNpbmNlTGFzdEZyYW1lID0gdHJ1ZTtcclxuICAgIC8vICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBjYy5lbmdpbmUuZ2V0SW5zdGFuY2VCeUlkKEFuaW1VdGlscy5DYWNoZS5jb21wb25lbnQpO1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKGNvbXBvbmVudCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb24gPSBjb21wb25lbnQuZ2V0QW5pbWF0aW9uU3RhdGUoQW5pbVV0aWxzLkNhY2hlLmFuaW1hdGlvbik7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGUudGltZSA9IGFuaW1hdGlvbi50aW1lO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGUuYW5pbWF0ZWRTaW5jZUxhc3RGcmFtZSA9IGZhbHNlO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIGVsc2UgaWYgKG5vd1ByZXZpZXdpbmcpIHtcclxuICAgIC8vICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNjLmVuZ2luZS5nZXRJbnN0YW5jZUJ5SWQoQW5pbVV0aWxzLkNhY2hlLmNvbXBvbmVudCk7XHJcbiAgICAvLyAgICAgICAgIGlmIChjb21wb25lbnQpIHtcclxuICAgIC8vICAgICAgICAgICAgIGxldCBhbmltYXRpb24gPSBjb21wb25lbnQuZ2V0QW5pbWF0aW9uU3RhdGUoQW5pbVV0aWxzLkNhY2hlLmFuaW1hdGlvbik7XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uU3RhdGUudGltZSAhPT0gYW5pbWF0aW9uLnRpbWUpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBhbmltYXRpb25TdGF0ZS5hbmltYXRlZFNpbmNlTGFzdEZyYW1lID0gdHJ1ZTtcclxuICAgIC8vICAgICAgICAgICAgICAgICBhbmltYXRpb25TdGF0ZS50aW1lID0gQW5pbVV0aWxzLkNhY2hlLmFuaW1hdGlvbi50aW1lO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgLy8gfVxyXG5cclxuICAgIGNvbnN0IHNjZW5lID0gZGlyZWN0b3IuZ2V0U2NlbmUoKTtcclxuICAgIGlmIChzY2VuZSkge1xyXG4gICAgICAgIHdpZGdldE1hbmFnZXIuaXNBbGlnbmluZyA9IHRydWU7XHJcbiAgICAgICAgaWYgKHdpZGdldE1hbmFnZXIuX25vZGVzT3JkZXJEaXJ0eSkge1xyXG4gICAgICAgICAgICBhY3RpdmVXaWRnZXRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHZpc2l0Tm9kZShzY2VuZSk7XHJcbiAgICAgICAgICAgIHdpZGdldE1hbmFnZXIuX25vZGVzT3JkZXJEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaSA9IDA7XHJcbiAgICAgICAgICAgIGxldCB3aWRnZXQ6IFdpZGdldCB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVyYXRvciA9IHdpZGdldE1hbmFnZXIuX2FjdGl2ZVdpZGdldHNJdGVyYXRvcjtcclxuICAgICAgICAgICAgLy8gdmFyIEFuaW1VdGlscztcclxuICAgICAgICAgICAgLy8gaWYgKEVESVRPUiAmJlxyXG4gICAgICAgICAgICAvLyAgICAgKEFuaW1VdGlscyA9IEVkaXRvci5yZXF1aXJlKCdzY2VuZTovL3V0aWxzL2FuaW1hdGlvbicpKSAmJlxyXG4gICAgICAgICAgICAvLyAgICAgQW5pbVV0aWxzLkNhY2hlLmFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICAvLyAgICAgdmFyIGVkaXRpbmdOb2RlID0gY2MuZW5naW5lLmdldEluc3RhbmNlQnlJZChBbmltVXRpbHMuQ2FjaGUuck5vZGUpO1xyXG4gICAgICAgICAgICAvLyAgICAgaWYgKGVkaXRpbmdOb2RlKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgZm9yIChpID0gYWN0aXZlV2lkZ2V0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB3aWRnZXQgPSBhY3RpdmVXaWRnZXRzW2ldO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB2YXIgbm9kZSA9IHdpZGdldC5ub2RlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAod2lkZ2V0LmFsaWduTW9kZSAhPT0gQWxpZ25Nb2RlLkFMV0FZUyAmJlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RhdGUuYW5pbWF0ZWRTaW5jZUxhc3RGcmFtZSAmJlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgbm9kZS5pc0NoaWxkT2YoZWRpdGluZ05vZGUpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gd2lkZ2V0IGNvbnRhaW5zIGluIGFjdGl2ZVdpZGdldHMgc2hvdWxkIGFsaWduZWQgYXQgbGVhc3Qgb25jZVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgd2lkZ2V0LmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGFsaWduKG5vZGUsIHdpZGdldCk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGxvb3AgcmV2ZXJzZWx5IHdpbGwgbm90IGhlbHAgdG8gcHJldmVudCBvdXQgb2Ygc3luY1xyXG4gICAgICAgICAgICAvLyBiZWNhdXNlIHVzZXIgbWF5IHJlbW92ZSBtb3JlIHRoYW4gb25lIGl0ZW0gZHVyaW5nIGEgc3RlcC5cclxuICAgICAgICAgICAgZm9yIChpdGVyYXRvci5pID0gMDsgaXRlcmF0b3IuaSA8IGFjdGl2ZVdpZGdldHMubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcclxuICAgICAgICAgICAgICAgIHdpZGdldCA9IGFjdGl2ZVdpZGdldHNbaXRlcmF0b3IuaV07XHJcbiAgICAgICAgICAgICAgICBpZiAod2lkZ2V0Ll9kaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduKHdpZGdldC5ub2RlLCB3aWRnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZGdldC5fZGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpZGdldE1hbmFnZXIuaXNBbGlnbmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrIGFuaW1hdGlvbiBlZGl0b3JcclxuICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICB3aWRnZXRNYW5hZ2VyLmFuaW1hdGlvblN0YXRlIS5hbmltYXRlZFNpbmNlTGFzdEZyYW1lID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGFjdGl2ZVdpZGdldHM6IFdpZGdldFtdID0gW107XHJcblxyXG4vLyB1cGRhdGVBbGlnbm1lbnQgZnJvbSBzY2VuZSB0byBub2RlIHJlY3Vyc2l2ZWx5XHJcbmZ1bmN0aW9uIHVwZGF0ZUFsaWdubWVudCAobm9kZTogTm9kZSkge1xyXG4gICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XHJcbiAgICBpZiAocGFyZW50ICYmIE5vZGUuaXNOb2RlKHBhcmVudCkpIHtcclxuICAgICAgICB1cGRhdGVBbGlnbm1lbnQocGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBub2RlLl93aWRnZXQgd2lsbCBiZSBudWxsIHdoZW4gd2lkZ2V0IGlzIGRpc2FibGVkXHJcbiAgICBjb25zdCB3aWRnZXQgPSBub2RlLmdldENvbXBvbmVudChXaWRnZXQpO1xyXG4gICAgaWYgKHdpZGdldCAmJiBwYXJlbnQpIHtcclxuICAgICAgICBhbGlnbihub2RlLCB3aWRnZXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjYW52YXNMaXN0OiBDYW52YXNbXSA9IFtdO1xyXG5cclxuZXhwb3J0IGNvbnN0IHdpZGdldE1hbmFnZXIgPSBsZWdhY3lDQy5fd2lkZ2V0TWFuYWdlciA9IHtcclxuICAgIGlzQWxpZ25pbmc6IGZhbHNlLFxyXG4gICAgX25vZGVzT3JkZXJEaXJ0eTogZmFsc2UsXHJcbiAgICBfYWN0aXZlV2lkZ2V0c0l0ZXJhdG9yOiBuZXcgYXJyYXkuTXV0YWJsZUZvcndhcmRJdGVyYXRvcihhY3RpdmVXaWRnZXRzKSxcclxuICAgIC8vIGhhY2tcclxuICAgIGFuaW1hdGlvblN0YXRlOiBFRElUT1IgPyB7XHJcbiAgICAgICAgcHJldmlld2luZzogZmFsc2UsXHJcbiAgICAgICAgdGltZTogMCxcclxuICAgICAgICBhbmltYXRlZFNpbmNlTGFzdEZyYW1lOiBmYWxzZSxcclxuICAgIH0gOiBudWxsLFxyXG5cclxuICAgIGluaXQgKCkge1xyXG4gICAgICAgIGRpcmVjdG9yLm9uKERpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgcmVmcmVzaFNjZW5lKTtcclxuXHJcbiAgICAgICAgaWYgKEVESVRPUiAvKiYmIGNjLmVuZ2luZSovKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBjYy5lbmdpZW4gZXh0ZW5kcyBldmVudFRhcmdldFxyXG4gICAgICAgICAgICAvLyBjYy5lbmdpbmUub24oJ2Rlc2lnbi1yZXNvbHV0aW9uLWNoYW5nZWQnLCB0aGlzLm9uUmVzaXplZC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc3lzLmlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGhpc09uUmVzaXplZCA9IHRoaXMub25SZXNpemVkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpc09uUmVzaXplZCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCB0aGlzT25SZXNpemVkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFZpZXcuaW5zdGFuY2Uub24oJ2Rlc2lnbi1yZXNvbHV0aW9uLWNoYW5nZWQnLCB0aGlzLm9uUmVzaXplZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWRkICh3aWRnZXQ6IFdpZGdldCkge1xyXG4gICAgICAgIHRoaXMuX25vZGVzT3JkZXJEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgY2FudmFzQ29tcCA9IGRpcmVjdG9yLnJvb3QhLnVpLmdldFNjcmVlbih3aWRnZXQubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLnZpc2liaWxpdHkpO1xyXG4gICAgICAgIGlmIChjYW52YXNDb21wICYmIGNhbnZhc0xpc3QuaW5kZXhPZihjYW52YXNDb21wKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgY2FudmFzTGlzdC5wdXNoKGNhbnZhc0NvbXApO1xyXG4gICAgICAgICAgICBjYW52YXNDb21wLm5vZGUub24oJ2Rlc2lnbi1yZXNvbHV0aW9uLWNoYW5nZWQnLCB0aGlzLm9uUmVzaXplZCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlbW92ZSAod2lkZ2V0OiBXaWRnZXQpIHtcclxuICAgICAgICB0aGlzLl9hY3RpdmVXaWRnZXRzSXRlcmF0b3IucmVtb3ZlKHdpZGdldCk7XHJcbiAgICB9LFxyXG4gICAgb25SZXNpemVkICgpIHtcclxuICAgICAgICBjb25zdCBzY2VuZSA9IGRpcmVjdG9yLmdldFNjZW5lKCk7XHJcbiAgICAgICAgaWYgKHNjZW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFdpZGdldE9uUmVzaXplZChzY2VuZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlZnJlc2hXaWRnZXRPblJlc2l6ZWQgKG5vZGU6IE5vZGUpIHtcclxuICAgICAgICBpZiAoTm9kZS5pc05vZGUobm9kZSkpIHtcclxuICAgICAgICAgICAgY29uc3Qgd2lkZ2V0ID0gbm9kZS5nZXRDb21wb25lbnQoV2lkZ2V0KTtcclxuICAgICAgICAgICAgaWYgKHdpZGdldCAmJiB3aWRnZXQuYWxpZ25Nb2RlID09PSBBbGlnbk1vZGUuT05fV0lORE9XX1JFU0laRSkge1xyXG4gICAgICAgICAgICAgICAgd2lkZ2V0LmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hXaWRnZXRPblJlc2l6ZWQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cGRhdGVPZmZzZXRzVG9TdGF5UHV0ICh3aWRnZXQ6IFdpZGdldCwgZT86IEFsaWduRmxhZ3MpIHtcclxuICAgICAgICBmdW5jdGlvbiBpICh0OiBudW1iZXIsIGM6IG51bWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnModCAtIGMpID4gMWUtMTAgPyBjIDogdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgd2lkZ2V0Tm9kZSA9IHdpZGdldC5ub2RlO1xyXG4gICAgICAgIGxldCB3aWRnZXRQYXJlbnQgPSB3aWRnZXROb2RlLnBhcmVudDtcclxuICAgICAgICBpZiAod2lkZ2V0UGFyZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHplcm8gPSBuZXcgVmVjMygpO1xyXG4gICAgICAgICAgICBjb25zdCBvbmUgPSBuZXcgVmVjMygxLCAxLCAxKTtcclxuICAgICAgICAgICAgaWYgKHdpZGdldC50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHdpZGdldFBhcmVudCA9IHdpZGdldC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlSW52ZXJzZVRyYW5zRm9yVGFyZ2V0KHdpZGdldE5vZGUsIHdpZGdldFBhcmVudCwgemVybywgb25lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudFRyYW5zID0gd2lkZ2V0UGFyZW50Ll91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnMgPSB3aWRnZXROb2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgICAgIGlmICghcGFyZW50VHJhbnMpIHtcclxuICAgICAgICAgICAgICAgIHdhcm5JRCg2NTAxLCB3aWRnZXQubm9kZS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFyZW50QVAgPSBwYXJlbnRUcmFucy5hbmNob3JQb2ludDtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hTaXplID0gZ2V0UmVhZG9ubHlOb2RlU2l6ZSh3aWRnZXRQYXJlbnQhKTtcclxuICAgICAgICAgICAgY29uc3QgbXlBUCA9IHRyYW5zLmFuY2hvclBvaW50O1xyXG4gICAgICAgICAgICBjb25zdCBwb3MgPSB3aWRnZXROb2RlLmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFsaWduRmxhZ3MgPSBBbGlnbkZsYWdzO1xyXG4gICAgICAgICAgICBjb25zdCB3aWRnZXROb2RlU2NhbGUgPSB3aWRnZXROb2RlLmdldFNjYWxlKCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGVtcCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoZSAmIGFsaWduRmxhZ3MuTEVGVCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGwgPSAtcGFyZW50QVAueCAqIG1hdGNoU2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGwgKz0gemVyby54O1xyXG4gICAgICAgICAgICAgICAgbCAqPSBvbmUueDtcclxuICAgICAgICAgICAgICAgIHRlbXAgPSBwb3MueCAtIG15QVAueCAqIHRyYW5zLndpZHRoISAqIHdpZGdldE5vZGVTY2FsZS54IC0gbDtcclxuICAgICAgICAgICAgICAgIGlmICghd2lkZ2V0LmlzQWJzb2x1dGVMZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcCAvPSBtYXRjaFNpemUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGVtcCAvPSBvbmUueDtcclxuICAgICAgICAgICAgICAgIHdpZGdldC5sZWZ0ID0gaSh3aWRnZXQubGVmdCwgdGVtcCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlICYgYWxpZ25GbGFncy5SSUdIVCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSAoMSAtIHBhcmVudEFQLngpICogbWF0Y2hTaXplLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgciArPSB6ZXJvLng7XHJcbiAgICAgICAgICAgICAgICB0ZW1wID0gKHIgKj0gb25lLngpIC0gKHBvcy54ICsgKDEgLSBteUFQLngpICogdHJhbnMud2lkdGghICogd2lkZ2V0Tm9kZVNjYWxlLngpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF3aWRnZXQuaXNBYnNvbHV0ZVJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcCAvPSBtYXRjaFNpemUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGVtcCAvPSBvbmUueDtcclxuICAgICAgICAgICAgICAgIHdpZGdldC5yaWdodCA9IGkod2lkZ2V0LnJpZ2h0LCB0ZW1wKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGUgJiBhbGlnbkZsYWdzLlRPUCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHQgPSAoMSAtIHBhcmVudEFQLnkpICogbWF0Y2hTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHQgKz0gemVyby55O1xyXG4gICAgICAgICAgICAgICAgdGVtcCA9ICh0ICo9IG9uZS55KSAtIChwb3MueSArICgxIC0gbXlBUC55KSAqIHRyYW5zLmhlaWdodCEgKiB3aWRnZXROb2RlU2NhbGUueSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXdpZGdldC5pc0Fic29sdXRlVG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcCAvPSBtYXRjaFNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRlbXAgLz0gb25lLnk7XHJcbiAgICAgICAgICAgICAgICB3aWRnZXQudG9wID0gaSh3aWRnZXQudG9wLCB0ZW1wKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGUgJiBhbGlnbkZsYWdzLkJPVCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGIgPSAtcGFyZW50QVAueSAqIG1hdGNoU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBiICs9IHplcm8ueTtcclxuICAgICAgICAgICAgICAgIGIgKj0gb25lLnk7XHJcbiAgICAgICAgICAgICAgICB0ZW1wID0gcG9zLnkgLSBteUFQLnkgKiB0cmFucy5oZWlnaHQhICogd2lkZ2V0Tm9kZVNjYWxlLnkgLSBiO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF3aWRnZXQuaXNBYnNvbHV0ZUJvdHRvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgLz0gbWF0Y2hTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wIC89IG9uZS55O1xyXG4gICAgICAgICAgICAgICAgd2lkZ2V0LmJvdHRvbSA9IGkod2lkZ2V0LmJvdHRvbSwgdGVtcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlQWxpZ25tZW50LFxyXG4gICAgQWxpZ25Nb2RlLFxyXG4gICAgQWxpZ25GbGFncyxcclxufTtcclxuXHJcbmRpcmVjdG9yLm9uKERpcmVjdG9yLkVWRU5UX0lOSVQsICgpID0+IHtcclxuICAgIHdpZGdldE1hbmFnZXIuaW5pdCgpO1xyXG59KTtcclxuIl19