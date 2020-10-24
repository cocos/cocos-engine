(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../data/object.js", "./node.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../data/object.js"), require("./node.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.object, global.node, global.globalExports);
    global.privateNode = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _object, _node, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PrivateNode = void 0;

  var _dec, _class;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  // const LocalDirtyFlag = Node._LocalDirtyFlag;
  // const POSITION_ON = 1 << 0;
  // @ts-ignore
  var HideInHierarchy = _object.CCObject.Flags.HideInHierarchy;
  /**
   * @en
   * Class of private entities in Cocos Creator 3d scenes.<br/>
   * The PrivateNode is hidden in editor, and completely transparent to users.<br/>
   * It's normally used as Node's private content created by components in parent node.<br/>
   * So in theory private nodes are not children, they are part of the parent node.<br/>
   * Private node have two important characteristics:<br/>
   * 1. It has the minimum z index and cannot be modified, because they can't be displayed over real children.<br/>
   * 2. The positioning of private nodes is also special, they will consider the left bottom corner of the parent node's bounding box as the origin of local coordinates.<br/>
   *    In this way, they can be easily kept inside the bounding box.<br/>
   * Currently, it's used by RichText component and TileMap component.
   * @zh
   * Cocos Creator 3d 场景中的私有节点类。<br/>
   * 私有节点在编辑器中不可见，对用户透明。<br/>
   * 通常私有节点是被一些特殊的组件创建出来作为父节点的一部分而存在的，理论上来说，它们不是子节点，而是父节点的组成部分。<br/>
   * 私有节点有两个非常重要的特性：<br/>
   * 1. 它有着最小的渲染排序的 Z 轴深度，并且无法被更改，因为它们不能被显示在其他正常子节点之上。<br/>
   * 2. 它的定位也是特殊的，对于私有节点来说，父节点包围盒的左下角是它的局部坐标系原点，这个原点相当于父节点的位置减去它锚点的偏移。这样私有节点可以比较容易被控制在包围盒之中。<br/>
   * 目前在引擎中，RichText 和 TileMap 都有可能生成私有节点。
   */

  var PrivateNode = (_dec = (0, _index.ccclass)('cc.PrivateNode'), _dec(_class = /*#__PURE__*/function (_Node) {
    _inherits(PrivateNode, _Node);

    // @property({
    //     override: true
    // })
    // get x() {
    //     return this._originPos.x;
    // }
    // set x(value) {
    //     var localPosition = this._originPos;
    //     if (value !== localPosition.x) {
    //         localPosition.x = value;
    //         this._posDirty(true);
    //     }
    // }
    // @property({
    //     override: true
    // })
    // get y() {
    //     return this._originPos.y;
    // }
    // set y(value) {
    //     var localPosition = this._originPos;
    //     if (value !== localPosition.y) {
    //         localPosition.y = value;
    //         this._posDirty(true);
    //     }
    // }
    // @property({
    //     override: true
    // })
    // get zIndex() {
    //     return cc.macro.MIN_ZINDEX;
    // }
    // set zIndex(val) {
    //     cc.warnID(1638);
    // }
    function PrivateNode(name) {
      var _this;

      _classCallCheck(this, PrivateNode);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PrivateNode).call(this, name)); // this._originPos = cc.v2();

      _this._objFlags |= HideInHierarchy;
      return _this;
    } // _posDirty (sendEvent) {
    //     this.setLocalDirty(LocalDirtyFlag.POSITION);
    //     if (sendEvent === true && (this._eventMask & POSITION_ON)) {
    //         this.emit(Node.EventType.POSITION_CHANGED);
    //     }
    // }
    // _updateLocalMatrix() {
    //     if (!this._localMatDirty) return;
    //     let parent = this.parent;
    //     if (parent) {
    //         // Position correction for transform calculation
    //         this._position.x = this._originPos.x - (parent._anchorPoint.x - 0.5) * parent._contentSize.width;
    //         this._position.y = this._originPos.y - (parent._anchorPoint.y - 0.5) * parent._contentSize.height;
    //     }
    //     super._updateLocalMatrix();
    // }
    // getPosition () {
    //     return new cc.Vec2(this._originPos);
    // }
    // setPosition (x, y) {
    //     if (y === undefined) {
    //         x = x.x;
    //         y = x.y;
    //     }
    //     let pos = this._originPos;
    //     if (pos.x === x && pos.y === y) {
    //         return;
    //     }
    //     pos.x = x;
    //     pos.y = y;
    //     this._posDirty(true);
    // }
    // setParent(value) {
    //     let oldParent = this._parent;
    //     super.setParent(value);
    //     if (oldParent !== value) {
    //         if (oldParent) {
    //             oldParent.off(Node.EventType.ANCHOR_CHANGED, this._posDirty, this);
    //         }
    //         if (value) {
    //             value.on(Node.EventType.ANCHOR_CHANGED, this._posDirty, this);
    //         }
    //     }
    // }
    // do not update order of arrival
    // public _updateOrderOfArrival () {}


    return PrivateNode;
  }(_node.Node)) || _class); // cc.js.getset(PrivateNode.prototype, 'parent', PrivateNode.prototype.getParent, PrivateNode.prototype.setParent);
  // cc.js.getset(PrivateNode.prototype, 'position', PrivateNode.prototype.getPosition, PrivateNode.prototype.setPosition);

  _exports.PrivateNode = PrivateNode;
  _globalExports.legacyCC.PrivateNode = PrivateNode;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvcHJpdmF0ZS1ub2RlLnRzIl0sIm5hbWVzIjpbIkhpZGVJbkhpZXJhcmNoeSIsIkNDT2JqZWN0IiwiRmxhZ3MiLCJQcml2YXRlTm9kZSIsIm5hbWUiLCJfb2JqRmxhZ3MiLCJOb2RlIiwibGVnYWN5Q0MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxlQUFlLEdBQUdDLGlCQUFTQyxLQUFULENBQWVGLGVBQXZDO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXFCYUcsVyxXQURaLG9CQUFRLGdCQUFSLEM7OztBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSx5QkFBYUMsSUFBYixFQUEyQjtBQUFBOztBQUFBOztBQUN2Qix1RkFBTUEsSUFBTixHQUR1QixDQUV2Qjs7QUFDQSxZQUFLQyxTQUFMLElBQWtCTCxlQUFsQjtBQUh1QjtBQUkxQixLLENBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7Ozs7SUFsRzZCTSxVLGVBcUdqQztBQUNBOzs7QUFFQUMsMEJBQVNKLFdBQVQsR0FBdUJBLFdBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBzY2VuZS1ncmFwaFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDQ09iamVjdCB9IGZyb20gJy4uL2RhdGEvb2JqZWN0JztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLy8gY29uc3QgTG9jYWxEaXJ0eUZsYWcgPSBOb2RlLl9Mb2NhbERpcnR5RmxhZztcclxuLy8gY29uc3QgUE9TSVRJT05fT04gPSAxIDw8IDA7XHJcbi8vIEB0cy1pZ25vcmVcclxuY29uc3QgSGlkZUluSGllcmFyY2h5ID0gQ0NPYmplY3QuRmxhZ3MuSGlkZUluSGllcmFyY2h5O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBDbGFzcyBvZiBwcml2YXRlIGVudGl0aWVzIGluIENvY29zIENyZWF0b3IgM2Qgc2NlbmVzLjxici8+XHJcbiAqIFRoZSBQcml2YXRlTm9kZSBpcyBoaWRkZW4gaW4gZWRpdG9yLCBhbmQgY29tcGxldGVseSB0cmFuc3BhcmVudCB0byB1c2Vycy48YnIvPlxyXG4gKiBJdCdzIG5vcm1hbGx5IHVzZWQgYXMgTm9kZSdzIHByaXZhdGUgY29udGVudCBjcmVhdGVkIGJ5IGNvbXBvbmVudHMgaW4gcGFyZW50IG5vZGUuPGJyLz5cclxuICogU28gaW4gdGhlb3J5IHByaXZhdGUgbm9kZXMgYXJlIG5vdCBjaGlsZHJlbiwgdGhleSBhcmUgcGFydCBvZiB0aGUgcGFyZW50IG5vZGUuPGJyLz5cclxuICogUHJpdmF0ZSBub2RlIGhhdmUgdHdvIGltcG9ydGFudCBjaGFyYWN0ZXJpc3RpY3M6PGJyLz5cclxuICogMS4gSXQgaGFzIHRoZSBtaW5pbXVtIHogaW5kZXggYW5kIGNhbm5vdCBiZSBtb2RpZmllZCwgYmVjYXVzZSB0aGV5IGNhbid0IGJlIGRpc3BsYXllZCBvdmVyIHJlYWwgY2hpbGRyZW4uPGJyLz5cclxuICogMi4gVGhlIHBvc2l0aW9uaW5nIG9mIHByaXZhdGUgbm9kZXMgaXMgYWxzbyBzcGVjaWFsLCB0aGV5IHdpbGwgY29uc2lkZXIgdGhlIGxlZnQgYm90dG9tIGNvcm5lciBvZiB0aGUgcGFyZW50IG5vZGUncyBib3VuZGluZyBib3ggYXMgdGhlIG9yaWdpbiBvZiBsb2NhbCBjb29yZGluYXRlcy48YnIvPlxyXG4gKiAgICBJbiB0aGlzIHdheSwgdGhleSBjYW4gYmUgZWFzaWx5IGtlcHQgaW5zaWRlIHRoZSBib3VuZGluZyBib3guPGJyLz5cclxuICogQ3VycmVudGx5LCBpdCdzIHVzZWQgYnkgUmljaFRleHQgY29tcG9uZW50IGFuZCBUaWxlTWFwIGNvbXBvbmVudC5cclxuICogQHpoXHJcbiAqIENvY29zIENyZWF0b3IgM2Qg5Zy65pmv5Lit55qE56eB5pyJ6IqC54K557G744CCPGJyLz5cclxuICog56eB5pyJ6IqC54K55Zyo57yW6L6R5Zmo5Lit5LiN5Y+v6KeB77yM5a+555So5oi36YCP5piO44CCPGJyLz5cclxuICog6YCa5bi456eB5pyJ6IqC54K55piv6KKr5LiA5Lqb54m55q6K55qE57uE5Lu25Yib5bu65Ye65p2l5L2c5Li654i26IqC54K555qE5LiA6YOo5YiG6ICM5a2Y5Zyo55qE77yM55CG6K665LiK5p2l6K+077yM5a6D5Lus5LiN5piv5a2Q6IqC54K577yM6ICM5piv54i26IqC54K555qE57uE5oiQ6YOo5YiG44CCPGJyLz5cclxuICog56eB5pyJ6IqC54K55pyJ5Lik5Liq6Z2e5bi46YeN6KaB55qE54m55oCn77yaPGJyLz5cclxuICogMS4g5a6D5pyJ552A5pyA5bCP55qE5riy5p+T5o6S5bqP55qEIFog6L205rex5bqm77yM5bm25LiU5peg5rOV6KKr5pu05pS577yM5Zug5Li65a6D5Lus5LiN6IO96KKr5pi+56S65Zyo5YW25LuW5q2j5bi45a2Q6IqC54K55LmL5LiK44CCPGJyLz5cclxuICogMi4g5a6D55qE5a6a5L2N5Lmf5piv54m55q6K55qE77yM5a+55LqO56eB5pyJ6IqC54K55p2l6K+077yM54i26IqC54K55YyF5Zu055uS55qE5bem5LiL6KeS5piv5a6D55qE5bGA6YOo5Z2Q5qCH57O75Y6f54K577yM6L+Z5Liq5Y6f54K555u45b2T5LqO54i26IqC54K555qE5L2N572u5YeP5Y675a6D6ZSa54K555qE5YGP56e744CC6L+Z5qC356eB5pyJ6IqC54K55Y+v5Lul5q+U6L6D5a655piT6KKr5o6n5Yi25Zyo5YyF5Zu055uS5LmL5Lit44CCPGJyLz5cclxuICog55uu5YmN5Zyo5byV5pOO5Lit77yMUmljaFRleHQg5ZKMIFRpbGVNYXAg6YO95pyJ5Y+v6IO955Sf5oiQ56eB5pyJ6IqC54K544CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuUHJpdmF0ZU5vZGUnKVxyXG5leHBvcnQgY2xhc3MgUHJpdmF0ZU5vZGUgZXh0ZW5kcyBOb2RlIHtcclxuICAgIC8vIEBwcm9wZXJ0eSh7XHJcbiAgICAvLyAgICAgb3ZlcnJpZGU6IHRydWVcclxuICAgIC8vIH0pXHJcbiAgICAvLyBnZXQgeCgpIHtcclxuICAgIC8vICAgICByZXR1cm4gdGhpcy5fb3JpZ2luUG9zLng7XHJcbiAgICAvLyB9XHJcbiAgICAvLyBzZXQgeCh2YWx1ZSkge1xyXG4gICAgLy8gICAgIHZhciBsb2NhbFBvc2l0aW9uID0gdGhpcy5fb3JpZ2luUG9zO1xyXG4gICAgLy8gICAgIGlmICh2YWx1ZSAhPT0gbG9jYWxQb3NpdGlvbi54KSB7XHJcbiAgICAvLyAgICAgICAgIGxvY2FsUG9zaXRpb24ueCA9IHZhbHVlO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9wb3NEaXJ0eSh0cnVlKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gQHByb3BlcnR5KHtcclxuICAgIC8vICAgICBvdmVycmlkZTogdHJ1ZVxyXG4gICAgLy8gfSlcclxuICAgIC8vIGdldCB5KCkge1xyXG4gICAgLy8gICAgIHJldHVybiB0aGlzLl9vcmlnaW5Qb3MueTtcclxuICAgIC8vIH1cclxuICAgIC8vIHNldCB5KHZhbHVlKSB7XHJcbiAgICAvLyAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSB0aGlzLl9vcmlnaW5Qb3M7XHJcbiAgICAvLyAgICAgaWYgKHZhbHVlICE9PSBsb2NhbFBvc2l0aW9uLnkpIHtcclxuICAgIC8vICAgICAgICAgbG9jYWxQb3NpdGlvbi55ID0gdmFsdWU7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX3Bvc0RpcnR5KHRydWUpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBAcHJvcGVydHkoe1xyXG4gICAgLy8gICAgIG92ZXJyaWRlOiB0cnVlXHJcbiAgICAvLyB9KVxyXG4gICAgLy8gZ2V0IHpJbmRleCgpIHtcclxuICAgIC8vICAgICByZXR1cm4gY2MubWFjcm8uTUlOX1pJTkRFWDtcclxuICAgIC8vIH1cclxuICAgIC8vIHNldCB6SW5kZXgodmFsKSB7XHJcbiAgICAvLyAgICAgY2Mud2FybklEKDE2MzgpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAvLyB0aGlzLl9vcmlnaW5Qb3MgPSBjYy52MigpO1xyXG4gICAgICAgIHRoaXMuX29iakZsYWdzIHw9IEhpZGVJbkhpZXJhcmNoeTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBfcG9zRGlydHkgKHNlbmRFdmVudCkge1xyXG4gICAgLy8gICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5QT1NJVElPTik7XHJcbiAgICAvLyAgICAgaWYgKHNlbmRFdmVudCA9PT0gdHJ1ZSAmJiAodGhpcy5fZXZlbnRNYXNrICYgUE9TSVRJT05fT04pKSB7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuZW1pdChOb2RlLkV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VEKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gX3VwZGF0ZUxvY2FsTWF0cml4KCkge1xyXG4gICAgLy8gICAgIGlmICghdGhpcy5fbG9jYWxNYXREaXJ0eSkgcmV0dXJuO1xyXG5cclxuICAgIC8vICAgICBsZXQgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XHJcbiAgICAvLyAgICAgaWYgKHBhcmVudCkge1xyXG4gICAgLy8gICAgICAgICAvLyBQb3NpdGlvbiBjb3JyZWN0aW9uIGZvciB0cmFuc2Zvcm0gY2FsY3VsYXRpb25cclxuICAgIC8vICAgICAgICAgdGhpcy5fcG9zaXRpb24ueCA9IHRoaXMuX29yaWdpblBvcy54IC0gKHBhcmVudC5fYW5jaG9yUG9pbnQueCAtIDAuNSkgKiBwYXJlbnQuX2NvbnRlbnRTaXplLndpZHRoO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9wb3NpdGlvbi55ID0gdGhpcy5fb3JpZ2luUG9zLnkgLSAocGFyZW50Ll9hbmNob3JQb2ludC55IC0gMC41KSAqIHBhcmVudC5fY29udGVudFNpemUuaGVpZ2h0O1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgc3VwZXIuX3VwZGF0ZUxvY2FsTWF0cml4KCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gZ2V0UG9zaXRpb24gKCkge1xyXG4gICAgLy8gICAgIHJldHVybiBuZXcgY2MuVmVjMih0aGlzLl9vcmlnaW5Qb3MpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHNldFBvc2l0aW9uICh4LCB5KSB7XHJcbiAgICAvLyAgICAgaWYgKHkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgLy8gICAgICAgICB4ID0geC54O1xyXG4gICAgLy8gICAgICAgICB5ID0geC55O1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgbGV0IHBvcyA9IHRoaXMuX29yaWdpblBvcztcclxuICAgIC8vICAgICBpZiAocG9zLnggPT09IHggJiYgcG9zLnkgPT09IHkpIHtcclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBwb3MueCA9IHg7XHJcbiAgICAvLyAgICAgcG9zLnkgPSB5O1xyXG4gICAgLy8gICAgIHRoaXMuX3Bvc0RpcnR5KHRydWUpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHNldFBhcmVudCh2YWx1ZSkge1xyXG4gICAgLy8gICAgIGxldCBvbGRQYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XHJcbiAgICAvLyAgICAgc3VwZXIuc2V0UGFyZW50KHZhbHVlKTtcclxuICAgIC8vICAgICBpZiAob2xkUGFyZW50ICE9PSB2YWx1ZSkge1xyXG4gICAgLy8gICAgICAgICBpZiAob2xkUGFyZW50KSB7XHJcbiAgICAvLyAgICAgICAgICAgICBvbGRQYXJlbnQub2ZmKE5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9wb3NEaXJ0eSwgdGhpcyk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAvLyAgICAgICAgICAgICB2YWx1ZS5vbihOb2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fcG9zRGlydHksIHRoaXMpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGRvIG5vdCB1cGRhdGUgb3JkZXIgb2YgYXJyaXZhbFxyXG4gICAgLy8gcHVibGljIF91cGRhdGVPcmRlck9mQXJyaXZhbCAoKSB7fVxyXG59XHJcblxyXG4vLyBjYy5qcy5nZXRzZXQoUHJpdmF0ZU5vZGUucHJvdG90eXBlLCAncGFyZW50JywgUHJpdmF0ZU5vZGUucHJvdG90eXBlLmdldFBhcmVudCwgUHJpdmF0ZU5vZGUucHJvdG90eXBlLnNldFBhcmVudCk7XHJcbi8vIGNjLmpzLmdldHNldChQcml2YXRlTm9kZS5wcm90b3R5cGUsICdwb3NpdGlvbicsIFByaXZhdGVOb2RlLnByb3RvdHlwZS5nZXRQb3NpdGlvbiwgUHJpdmF0ZU5vZGUucHJvdG90eXBlLnNldFBvc2l0aW9uKTtcclxuXHJcbmxlZ2FjeUNDLlByaXZhdGVOb2RlID0gUHJpdmF0ZU5vZGU7XHJcbiJdfQ==