(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../components/component.js", "../data/decorators/index.js", "./view.js", "../../ui/components/sprite.js", "../scene-graph/index.js", "../components/ui-base/ui-transform.js", "../assets/image-asset.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../components/component.js"), require("../data/decorators/index.js"), require("./view.js"), require("../../ui/components/sprite.js"), require("../scene-graph/index.js"), require("../components/ui-base/ui-transform.js"), require("../assets/image-asset.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.view, global.sprite, global.index, global.uiTransform, global.imageAsset, global.globalExports);
    global.SubContextView = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _view, _sprite, _index2, _uiTransform, _imageAsset, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SubContextView = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _temp;

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

  /**
   * @en SubContextView is a view component which controls open data context viewport in WeChat game platform.<br/>
   * The component's node size decide the viewport of the sub context content in main context,
   * the entire sub context texture will be scaled to the node's bounding box area.<br/>
   * This component provides multiple important features:<br/>
   * 1. Sub context could use its own resolution size and policy.<br/>
   * 2. Sub context could be minized to smallest size it needed.<br/>
   * 3. Resolution of sub context content could be increased.<br/>
   * 4. User touch input is transformed to the correct viewport.<br/>
   * 5. Texture update is handled by this component. User don't need to worry.<br/>
   * One important thing to be noted, whenever the node's bounding box change,
   * you need to manually reset the viewport of sub context using updateSubContextViewport.
   * @zh SubContextView 可以用来控制微信小游戏平台开放数据域在主域中的视窗的位置。<br/>
   * 这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
   * 在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
   * 1. 子域中可以使用独立的设计分辨率和适配模式<br/>
   * 2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
   * 3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
   * 4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
   * 5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
   * 唯一需要注意的是，当子域节点的包围盒发生改变时，开发者需要使用 `updateSubContextViewport` 来手动更新子域视窗。
   */
  var SubContextView = (_dec = (0, _index.ccclass)('cc.SubContextView'), _dec2 = (0, _index.help)('i18n:cc.SubContextView'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.requireComponent)(_uiTransform.UITransform), _dec5 = (0, _index.menu)('Components/SubContextView'), _dec6 = (0, _index.tooltip)('帧数'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(SubContextView, _Component);

    _createClass(SubContextView, [{
      key: "fps",
      get: function get() {
        return this._fps;
      },
      set: function set(value) {
        if (this._fps === value) {
          return;
        }

        this._fps = value;
        this._updateInterval = 1 / value;

        this._updateSubContextFrameRate();
      }
    }]);

    function SubContextView() {
      var _this;

      _classCallCheck(this, SubContextView);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SubContextView).call(this));

      _initializerDefineProperty(_this, "_fps", _descriptor, _assertThisInitialized(_this));

      _this._sprite = void 0;
      _this._imageAsset = void 0;
      _this._context = void 0;
      _this._updatedTime = 0;
      _this._updateInterval = 0;
      _this._firstlyEnabled = true;
      _this._sprite = null;
      _this._imageAsset = new _imageAsset.ImageAsset();
      _this._context = null;
      _this._updatedTime = performance.now();
      return _this;
    }

    _createClass(SubContextView, [{
      key: "onLoad",
      value: function onLoad() {
        // Setup subcontext canvas size
        if (window.__globalAdapter && __globalAdapter.getOpenDataContext) {
          this._updateInterval = 1000 / this._fps;
          this._context = __globalAdapter.getOpenDataContext(); // reset sharedCanvas width and height

          this.reset();
          var image = this._imageAsset;
          var sharedCanvas = this._context.canvas;
          image.reset(sharedCanvas);

          image._texture.create(sharedCanvas.width, sharedCanvas.height);

          this._sprite = this.node.getComponent(_sprite.Sprite);

          if (!this._sprite) {
            this._sprite = this.node.addComponent(_sprite.Sprite);
          }

          if (this._sprite.spriteFrame) {
            this._sprite.spriteFrame.texture = this._imageAsset._texture;
          } else {
            var sp = new _globalExports.legacyCC.SpriteFrame();
            sp.texture = this._imageAsset._texture;
            this._sprite.spriteFrame = sp;
          }
        } else {
          this.enabled = false;
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._firstlyEnabled && this._context) {
          this._context.postMessage({
            fromEngine: true,
            event: 'boot'
          });

          this._firstlyEnabled = false;
        } else {
          this._runSubContextMainLoop();
        }

        this._registerNodeEvent();

        this._updateSubContextFrameRate();

        this.updateSubContextViewport();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._unregisterNodeEvent();

        this._stopSubContextMainLoop();
      }
    }, {
      key: "update",
      value: function update(dt) {
        var calledUpdateManually = dt === undefined;

        if (calledUpdateManually) {
          this._context && this._context.postMessage({
            fromEngine: true,
            event: 'step'
          });

          this._updateSubContextTexture();

          return;
        }

        var now = performance.now();
        var deltaTime = now - this._updatedTime;

        if (deltaTime >= this._updateInterval) {
          this._updatedTime += this._updateInterval;

          this._updateSubContextTexture();
        }
      }
      /**
       * @en Reset open data context size and viewport
       * @zh 重置开放数据域的尺寸和视窗
       */

    }, {
      key: "reset",
      value: function reset() {
        if (this._context) {
          this.updateSubContextViewport();
          var sharedCanvas = this._context.canvas;
          var transformComp = this.node.getComponent(_uiTransform.UITransform);

          if (sharedCanvas) {
            sharedCanvas.width = transformComp.width;
            sharedCanvas.height = transformComp.height;
          }
        }
      }
      /**
       * @en Update the sub context viewport manually, it should be called whenever the node's bounding box changes.
       * @zh 更新开放数据域相对于主域的 viewport，这个函数应该在节点包围盒改变时手动调用。
       */

    }, {
      key: "updateSubContextViewport",
      value: function updateSubContextViewport() {
        if (this._context) {
          var box = this.node.getComponent(_uiTransform.UITransform).getBoundingBoxToWorld();

          var sx = _view.view.getScaleX();

          var sy = _view.view.getScaleY();

          var rect = _view.view.getViewportRect();

          this._context.postMessage({
            fromEngine: true,
            event: 'viewport',
            x: box.x * sx + rect.x,
            y: box.y * sy + rect.y,
            width: box.width * sx,
            height: box.height * sy
          });
        }
      }
    }, {
      key: "_updateSubContextTexture",
      value: function _updateSubContextTexture() {
        var img = this._imageAsset;

        if (!img || !this._context) {
          return;
        }

        if (img.width <= 0 || img.height <= 0) {
          return;
        }

        var canvas = this._context.canvas;
        img.reset(canvas);

        if (canvas.width > img.width || canvas.height > img.height) {
          this._imageAsset._texture.create(canvas.width, canvas.height);
        }

        this._imageAsset._texture.uploadData(canvas);
      }
    }, {
      key: "_registerNodeEvent",
      value: function _registerNodeEvent() {
        this.node.on(_index2.Node.EventType.TRANSFORM_CHANGED, this.updateSubContextViewport, this);
        this.node.on(_index2.Node.EventType.SIZE_CHANGED, this.updateSubContextViewport, this);
      }
    }, {
      key: "_unregisterNodeEvent",
      value: function _unregisterNodeEvent() {
        this.node.off(_index2.Node.EventType.TRANSFORM_CHANGED, this.updateSubContextViewport, this);
        this.node.off(_index2.Node.EventType.SIZE_CHANGED, this.updateSubContextViewport, this);
      }
    }, {
      key: "_runSubContextMainLoop",
      value: function _runSubContextMainLoop() {
        if (this._context) {
          this._context.postMessage({
            fromEngine: true,
            event: 'mainLoop',
            value: true
          });
        }
      }
    }, {
      key: "_stopSubContextMainLoop",
      value: function _stopSubContextMainLoop() {
        if (this._context) {
          this._context.postMessage({
            fromEngine: true,
            event: 'mainLoop',
            value: false
          });
        }
      }
    }, {
      key: "_updateSubContextFrameRate",
      value: function _updateSubContextFrameRate() {
        if (this._context) {
          this._context.postMessage({
            fromEngine: true,
            event: 'frameRate',
            value: this._fps
          });
        }
      }
    }]);

    return SubContextView;
  }(_component.Component), _temp), (_applyDecoratedDescriptor(_class2.prototype, "fps", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "fps"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_fps", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 60;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.SubContextView = SubContextView;
  _globalExports.legacyCC.SubContextView = SubContextView;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vU3ViQ29udGV4dFZpZXcudHMiXSwibmFtZXMiOlsiU3ViQ29udGV4dFZpZXciLCJVSVRyYW5zZm9ybSIsIl9mcHMiLCJ2YWx1ZSIsIl91cGRhdGVJbnRlcnZhbCIsIl91cGRhdGVTdWJDb250ZXh0RnJhbWVSYXRlIiwiX3Nwcml0ZSIsIl9pbWFnZUFzc2V0IiwiX2NvbnRleHQiLCJfdXBkYXRlZFRpbWUiLCJfZmlyc3RseUVuYWJsZWQiLCJJbWFnZUFzc2V0IiwicGVyZm9ybWFuY2UiLCJub3ciLCJ3aW5kb3ciLCJfX2dsb2JhbEFkYXB0ZXIiLCJnZXRPcGVuRGF0YUNvbnRleHQiLCJyZXNldCIsImltYWdlIiwic2hhcmVkQ2FudmFzIiwiY2FudmFzIiwiX3RleHR1cmUiLCJjcmVhdGUiLCJ3aWR0aCIsImhlaWdodCIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJTcHJpdGUiLCJhZGRDb21wb25lbnQiLCJzcHJpdGVGcmFtZSIsInRleHR1cmUiLCJzcCIsImxlZ2FjeUNDIiwiU3ByaXRlRnJhbWUiLCJlbmFibGVkIiwicG9zdE1lc3NhZ2UiLCJmcm9tRW5naW5lIiwiZXZlbnQiLCJfcnVuU3ViQ29udGV4dE1haW5Mb29wIiwiX3JlZ2lzdGVyTm9kZUV2ZW50IiwidXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0IiwiX3VucmVnaXN0ZXJOb2RlRXZlbnQiLCJfc3RvcFN1YkNvbnRleHRNYWluTG9vcCIsImR0IiwiY2FsbGVkVXBkYXRlTWFudWFsbHkiLCJ1bmRlZmluZWQiLCJfdXBkYXRlU3ViQ29udGV4dFRleHR1cmUiLCJkZWx0YVRpbWUiLCJ0cmFuc2Zvcm1Db21wIiwiYm94IiwiZ2V0Qm91bmRpbmdCb3hUb1dvcmxkIiwic3giLCJ2aWV3IiwiZ2V0U2NhbGVYIiwic3kiLCJnZXRTY2FsZVkiLCJyZWN0IiwiZ2V0Vmlld3BvcnRSZWN0IiwieCIsInkiLCJpbWciLCJ1cGxvYWREYXRhIiwib24iLCJOb2RlIiwiRXZlbnRUeXBlIiwiVFJBTlNGT1JNX0NIQU5HRUQiLCJTSVpFX0NIQU5HRUQiLCJvZmYiLCJDb21wb25lbnQiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyQmFBLGMsV0FMWixvQkFBUSxtQkFBUixDLFVBQ0EsaUJBQUssd0JBQUwsQyxVQUNBLDJCQUFlLEdBQWYsQyxVQUNBLDZCQUFpQkMsd0JBQWpCLEMsVUFDQSxpQkFBSywyQkFBTCxDLFVBRUksb0JBQVEsSUFBUixDOzs7OzswQkFDUztBQUNOLGVBQU8sS0FBS0MsSUFBWjtBQUNILE87d0JBQ1FDLEssRUFBTztBQUNaLFlBQUksS0FBS0QsSUFBTCxLQUFjQyxLQUFsQixFQUF5QjtBQUNyQjtBQUNIOztBQUNELGFBQUtELElBQUwsR0FBWUMsS0FBWjtBQUNBLGFBQUtDLGVBQUwsR0FBdUIsSUFBSUQsS0FBM0I7O0FBQ0EsYUFBS0UsMEJBQUw7QUFDSDs7O0FBV0QsOEJBQWU7QUFBQTs7QUFBQTs7QUFDWDs7QUFEVzs7QUFBQSxZQVBQQyxPQU9PO0FBQUEsWUFOUEMsV0FNTztBQUFBLFlBTFBDLFFBS087QUFBQSxZQUpQQyxZQUlPLEdBSlEsQ0FJUjtBQUFBLFlBSFBMLGVBR08sR0FIVyxDQUdYO0FBQUEsWUFGUE0sZUFFTyxHQUZXLElBRVg7QUFFWCxZQUFLSixPQUFMLEdBQWUsSUFBZjtBQUNBLFlBQUtDLFdBQUwsR0FBbUIsSUFBSUksc0JBQUosRUFBbkI7QUFDQSxZQUFLSCxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsWUFBS0MsWUFBTCxHQUFvQkcsV0FBVyxDQUFDQyxHQUFaLEVBQXBCO0FBTFc7QUFNZDs7OzsrQkFFZ0I7QUFDYjtBQUNBLFlBQUlDLE1BQU0sQ0FBQ0MsZUFBUCxJQUEwQkEsZUFBZSxDQUFDQyxrQkFBOUMsRUFBa0U7QUFDOUQsZUFBS1osZUFBTCxHQUF1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QUFLSDtBQUNKOzs7Z0RBRWtDO0FBQy9CLFlBQUksS0FBS0ssUUFBVCxFQUFtQjtBQUNmLGVBQUtBLFFBQUwsQ0FBYzJCLFdBQWQsQ0FBMEI7QUFDdEJDLFlBQUFBLFVBQVUsRUFBRSxJQURVO0FBRXRCQyxZQUFBQSxLQUFLLEVBQUUsVUFGZTtBQUd0QmxDLFlBQUFBLEtBQUssRUFBRTtBQUhlLFdBQTFCO0FBS0g7QUFDSjs7O21EQUVxQztBQUNsQyxZQUFJLEtBQUtLLFFBQVQsRUFBbUI7QUFDZixlQUFLQSxRQUFMLENBQWMyQixXQUFkLENBQTBCO0FBQ3RCQyxZQUFBQSxVQUFVLEVBQUUsSUFEVTtBQUV0QkMsWUFBQUEsS0FBSyxFQUFFLFdBRmU7QUFHdEJsQyxZQUFBQSxLQUFLLEVBQUUsS0FBS0Q7QUFIVSxXQUExQjtBQUtIO0FBQ0o7Ozs7SUFsTStCa0Usb0IsNE5BYy9CQyxtQjs7Ozs7YUFDYyxFOzs7O0FBcUxuQnJDLDBCQUFTaEMsY0FBVCxHQUEwQkEsY0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29tcG9uZW50XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBtZW51LCBleGVjdXRpb25PcmRlciwgcmVxdWlyZUNvbXBvbmVudCwgdG9vbHRpcCwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgdmlldyB9IGZyb20gJy4vdmlldyc7XHJcbmltcG9ydCB7IFNwcml0ZSB9IGZyb20gJy4uLy4uL3VpL2NvbXBvbmVudHMvc3ByaXRlJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgVUlUcmFuc2Zvcm0gfSBmcm9tICcuLi9jb21wb25lbnRzL3VpLWJhc2UvdWktdHJhbnNmb3JtJztcclxuaW1wb3J0IHsgSW1hZ2VBc3NldCB9IGZyb20gJy4uL2Fzc2V0cy9pbWFnZS1hc3NldCc7XHJcbmltcG9ydCB7IFJlY3QgfSBmcm9tICcuLi9tYXRoJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGVuIFN1YkNvbnRleHRWaWV3IGlzIGEgdmlldyBjb21wb25lbnQgd2hpY2ggY29udHJvbHMgb3BlbiBkYXRhIGNvbnRleHQgdmlld3BvcnQgaW4gV2VDaGF0IGdhbWUgcGxhdGZvcm0uPGJyLz5cclxuICogVGhlIGNvbXBvbmVudCdzIG5vZGUgc2l6ZSBkZWNpZGUgdGhlIHZpZXdwb3J0IG9mIHRoZSBzdWIgY29udGV4dCBjb250ZW50IGluIG1haW4gY29udGV4dCxcclxuICogdGhlIGVudGlyZSBzdWIgY29udGV4dCB0ZXh0dXJlIHdpbGwgYmUgc2NhbGVkIHRvIHRoZSBub2RlJ3MgYm91bmRpbmcgYm94IGFyZWEuPGJyLz5cclxuICogVGhpcyBjb21wb25lbnQgcHJvdmlkZXMgbXVsdGlwbGUgaW1wb3J0YW50IGZlYXR1cmVzOjxici8+XHJcbiAqIDEuIFN1YiBjb250ZXh0IGNvdWxkIHVzZSBpdHMgb3duIHJlc29sdXRpb24gc2l6ZSBhbmQgcG9saWN5Ljxici8+XHJcbiAqIDIuIFN1YiBjb250ZXh0IGNvdWxkIGJlIG1pbml6ZWQgdG8gc21hbGxlc3Qgc2l6ZSBpdCBuZWVkZWQuPGJyLz5cclxuICogMy4gUmVzb2x1dGlvbiBvZiBzdWIgY29udGV4dCBjb250ZW50IGNvdWxkIGJlIGluY3JlYXNlZC48YnIvPlxyXG4gKiA0LiBVc2VyIHRvdWNoIGlucHV0IGlzIHRyYW5zZm9ybWVkIHRvIHRoZSBjb3JyZWN0IHZpZXdwb3J0Ljxici8+XHJcbiAqIDUuIFRleHR1cmUgdXBkYXRlIGlzIGhhbmRsZWQgYnkgdGhpcyBjb21wb25lbnQuIFVzZXIgZG9uJ3QgbmVlZCB0byB3b3JyeS48YnIvPlxyXG4gKiBPbmUgaW1wb3J0YW50IHRoaW5nIHRvIGJlIG5vdGVkLCB3aGVuZXZlciB0aGUgbm9kZSdzIGJvdW5kaW5nIGJveCBjaGFuZ2UsXHJcbiAqIHlvdSBuZWVkIHRvIG1hbnVhbGx5IHJlc2V0IHRoZSB2aWV3cG9ydCBvZiBzdWIgY29udGV4dCB1c2luZyB1cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQuXHJcbiAqIEB6aCBTdWJDb250ZXh0VmlldyDlj6/ku6XnlKjmnaXmjqfliLblvq7kv6HlsI/muLjmiI/lubPlj7DlvIDmlL7mlbDmja7ln5/lnKjkuLvln5/kuK3nmoTop4bnqpfnmoTkvY3nva7jgII8YnIvPlxyXG4gKiDov5nkuKrnu4Tku7bnmoToioLngrnlsLrlr7jlhrPlrprkuoblvIDmlL7mlbDmja7ln5/lhoXlrrnlnKjkuLvln5/kuK3nmoTlsLrlr7jvvIzmlbTkuKrlvIDmlL7mlbDmja7ln5/kvJrooqvnvKnmlL7liLDoioLngrnnmoTljIXlm7Tnm5LojIPlm7TlhoXjgII8YnIvPlxyXG4gKiDlnKjov5nkuKrnu4Tku7bnmoTmjqfliLbkuIvvvIznlKjmiLflj6/ku6Xmm7Toh6rnlLHlvpfmjqfliLblvIDmlL7mlbDmja7ln5/vvJo8YnIvPlxyXG4gKiAxLiDlrZDln5/kuK3lj6/ku6Xkvb/nlKjni6znq4vnmoTorr7orqHliIbovqjnjoflkozpgILphY3mqKHlvI88YnIvPlxyXG4gKiAyLiDlrZDln5/ljLrln5/lsLrlr7jlj6/ku6XnvKnlsI/liLDlj6rlrrnnurPlhoXlrrnljbPlj688YnIvPlxyXG4gKiAzLiDlrZDln5/nmoTliIbovqjnjofkuZ/lj6/ku6XooqvmlL7lpKfvvIzku6Xkvr/ojrflvpfmm7TmuIXmmbDnmoTmmL7npLrmlYjmnpw8YnIvPlxyXG4gKiA0LiDnlKjmiLfovpPlhaXlnZDmoIfkvJrooqvoh6rliqjovazmjaLliLDmraPnoa7nmoTlrZDln5/op4bnqpfkuK08YnIvPlxyXG4gKiA1LiDlrZDln5/lhoXlrrnotLTlm77nmoTmm7TmlrDnlLHnu4Tku7botJ/otKPvvIznlKjmiLfkuI3pnIDopoHlpITnkIY8YnIvPlxyXG4gKiDllK/kuIDpnIDopoHms6jmhI/nmoTmmK/vvIzlvZPlrZDln5/oioLngrnnmoTljIXlm7Tnm5Llj5HnlJ/mlLnlj5jml7bvvIzlvIDlj5HogIXpnIDopoHkvb/nlKggYHVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydGAg5p2l5omL5Yqo5pu05paw5a2Q5Z+f6KeG56qX44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuU3ViQ29udGV4dFZpZXcnKVxyXG5AaGVscCgnaTE4bjpjYy5TdWJDb250ZXh0VmlldycpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkByZXF1aXJlQ29tcG9uZW50KFVJVHJhbnNmb3JtKVxyXG5AbWVudSgnQ29tcG9uZW50cy9TdWJDb250ZXh0VmlldycpXHJcbmV4cG9ydCBjbGFzcyBTdWJDb250ZXh0VmlldyBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBAdG9vbHRpcCgn5bin5pWwJylcclxuICAgIGdldCBmcHMgKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZwcztcclxuICAgIH1cclxuICAgIHNldCBmcHMgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZwcyA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9mcHMgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl91cGRhdGVJbnRlcnZhbCA9IDEgLyB2YWx1ZTtcclxuICAgICAgICB0aGlzLl91cGRhdGVTdWJDb250ZXh0RnJhbWVSYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfZnBzID0gNjA7XHJcbiAgICBwcml2YXRlIF9zcHJpdGU6IFNwcml0ZSB8IG51bGw7XHJcbiAgICBwcml2YXRlIF9pbWFnZUFzc2V0OiBJbWFnZUFzc2V0O1xyXG4gICAgcHJpdmF0ZSBfY29udGV4dDogYW55O1xyXG4gICAgcHJpdmF0ZSBfdXBkYXRlZFRpbWUgPSAwO1xyXG4gICAgcHJpdmF0ZSBfdXBkYXRlSW50ZXJ2YWwgPSAwO1xyXG4gICAgcHJpdmF0ZSBfZmlyc3RseUVuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3Nwcml0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faW1hZ2VBc3NldCA9IG5ldyBJbWFnZUFzc2V0KCk7XHJcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpIHtcclxuICAgICAgICAvLyBTZXR1cCBzdWJjb250ZXh0IGNhbnZhcyBzaXplXHJcbiAgICAgICAgaWYgKHdpbmRvdy5fX2dsb2JhbEFkYXB0ZXIgJiYgX19nbG9iYWxBZGFwdGVyLmdldE9wZW5EYXRhQ29udGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVJbnRlcnZhbCA9IDEwMDAgLyB0aGlzLl9mcHM7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQgPSBfX2dsb2JhbEFkYXB0ZXIuZ2V0T3BlbkRhdGFDb250ZXh0KCk7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0IHNoYXJlZENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGltYWdlID0gdGhpcy5faW1hZ2VBc3NldDtcclxuICAgICAgICAgICAgY29uc3Qgc2hhcmVkQ2FudmFzID0gdGhpcy5fY29udGV4dC5jYW52YXM7XHJcbiAgICAgICAgICAgIGltYWdlLnJlc2V0KHNoYXJlZENhbnZhcyk7XHJcbiAgICAgICAgICAgIGltYWdlLl90ZXh0dXJlLmNyZWF0ZShzaGFyZWRDYW52YXMud2lkdGgsIHNoYXJlZENhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc3ByaXRlID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChTcHJpdGUpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3Nwcml0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3ByaXRlID0gdGhpcy5ub2RlLmFkZENvbXBvbmVudChTcHJpdGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3ByaXRlIS5zcHJpdGVGcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3ByaXRlIS5zcHJpdGVGcmFtZS50ZXh0dXJlID0gdGhpcy5faW1hZ2VBc3NldC5fdGV4dHVyZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNwID0gbmV3IGxlZ2FjeUNDLlNwcml0ZUZyYW1lKCk7XHJcbiAgICAgICAgICAgICAgICBzcC50ZXh0dXJlID0gdGhpcy5faW1hZ2VBc3NldC5fdGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Nwcml0ZSEuc3ByaXRlRnJhbWUgPSBzcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9maXJzdGx5RW5hYmxlZCAmJiB0aGlzLl9jb250ZXh0KSB7XHJcbiAgICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIGZyb21FbmdpbmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBldmVudDogJ2Jvb3QnLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3RseUVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3J1blN1YkNvbnRleHRNYWluTG9vcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZWdpc3Rlck5vZGVFdmVudCgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN1YkNvbnRleHRGcmFtZVJhdGUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3VucmVnaXN0ZXJOb2RlRXZlbnQoKTtcclxuICAgICAgICB0aGlzLl9zdG9wU3ViQ29udGV4dE1haW5Mb29wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBjYWxsZWRVcGRhdGVNYW51YWxseSA9IChkdCA9PT0gdW5kZWZpbmVkKTtcclxuICAgICAgICBpZiAoY2FsbGVkVXBkYXRlTWFudWFsbHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIGZyb21FbmdpbmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBldmVudDogJ3N0ZXAnLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3ViQ29udGV4dFRleHR1cmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgbGV0IGRlbHRhVGltZSA9IChub3cgLSB0aGlzLl91cGRhdGVkVGltZSk7XHJcbiAgICAgICAgaWYgKGRlbHRhVGltZSA+PSB0aGlzLl91cGRhdGVJbnRlcnZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVkVGltZSArPSB0aGlzLl91cGRhdGVJbnRlcnZhbDtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3ViQ29udGV4dFRleHR1cmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzZXQgb3BlbiBkYXRhIGNvbnRleHQgc2l6ZSBhbmQgdmlld3BvcnRcclxuICAgICAqIEB6aCDph43nva7lvIDmlL7mlbDmja7ln5/nmoTlsLrlr7jlkozop4bnqpdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29udGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCgpO1xyXG4gICAgICAgICAgICBsZXQgc2hhcmVkQ2FudmFzID0gdGhpcy5fY29udGV4dC5jYW52YXM7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybUNvbXAgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFVJVHJhbnNmb3JtKSE7XHJcbiAgICAgICAgICAgIGlmIChzaGFyZWRDYW52YXMpIHtcclxuICAgICAgICAgICAgICAgIHNoYXJlZENhbnZhcy53aWR0aCA9IHRyYW5zZm9ybUNvbXAud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBzaGFyZWRDYW52YXMuaGVpZ2h0ID0gdHJhbnNmb3JtQ29tcC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVXBkYXRlIHRoZSBzdWIgY29udGV4dCB2aWV3cG9ydCBtYW51YWxseSwgaXQgc2hvdWxkIGJlIGNhbGxlZCB3aGVuZXZlciB0aGUgbm9kZSdzIGJvdW5kaW5nIGJveCBjaGFuZ2VzLlxyXG4gICAgICogQHpoIOabtOaWsOW8gOaUvuaVsOaNruWfn+ebuOWvueS6juS4u+Wfn+eahCB2aWV3cG9ydO+8jOi/meS4quWHveaVsOW6lOivpeWcqOiKgueCueWMheWbtOebkuaUueWPmOaXtuaJi+WKqOiwg+eUqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29udGV4dCkge1xyXG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChVSVRyYW5zZm9ybSkhLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpIGFzIFJlY3Q7XHJcbiAgICAgICAgICAgIGxldCBzeCA9IHZpZXcuZ2V0U2NhbGVYKCk7XHJcbiAgICAgICAgICAgIGxldCBzeSA9IHZpZXcuZ2V0U2NhbGVZKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB2aWV3LmdldFZpZXdwb3J0UmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIGZyb21FbmdpbmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBldmVudDogJ3ZpZXdwb3J0JyxcclxuICAgICAgICAgICAgICAgIHg6IGJveC54ICogc3ggKyByZWN0LngsXHJcbiAgICAgICAgICAgICAgICB5OiBib3gueSAqIHN5ICsgcmVjdC55LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGJveC53aWR0aCAqIHN4LFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBib3guaGVpZ2h0ICogc3lcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZVN1YkNvbnRleHRUZXh0dXJlICgpIHtcclxuICAgICAgICBjb25zdCBpbWcgPSB0aGlzLl9pbWFnZUFzc2V0O1xyXG4gICAgICAgIGlmICghaW1nIHx8ICF0aGlzLl9jb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbWcud2lkdGggPD0gMCB8fCBpbWcuaGVpZ2h0IDw9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY29udGV4dC5jYW52YXM7XHJcbiAgICAgICAgaW1nLnJlc2V0KGNhbnZhcyk7XHJcbiAgICAgICAgaWYgKGNhbnZhcy53aWR0aCA+IGltZy53aWR0aCB8fCBjYW52YXMuaGVpZ2h0ID4gaW1nLmhlaWdodCApe1xyXG4gICAgICAgICAgICB0aGlzLl9pbWFnZUFzc2V0Ll90ZXh0dXJlLmNyZWF0ZShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW1hZ2VBc3NldC5fdGV4dHVyZS51cGxvYWREYXRhKGNhbnZhcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVnaXN0ZXJOb2RlRXZlbnQgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihOb2RlLkV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgdGhpcy51cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihOb2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91bnJlZ2lzdGVyTm9kZUV2ZW50ICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGUuRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihOb2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ydW5TdWJDb250ZXh0TWFpbkxvb3AgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgZnJvbUVuZ2luZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGV2ZW50OiAnbWFpbkxvb3AnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zdG9wU3ViQ29udGV4dE1haW5Mb29wICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29udGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIGZyb21FbmdpbmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBldmVudDogJ21haW5Mb29wJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZVN1YkNvbnRleHRGcmFtZVJhdGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgZnJvbUVuZ2luZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGV2ZW50OiAnZnJhbWVSYXRlJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLl9mcHMsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5sZWdhY3lDQy5TdWJDb250ZXh0VmlldyA9IFN1YkNvbnRleHRWaWV3O1xyXG4iXX0=