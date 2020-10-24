(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/platform/debug.js", "../core/data/class-decorator.js", "./components/index.js", "../core/utils/js.js", "../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/platform/debug.js"), require("../core/data/class-decorator.js"), require("./components/index.js"), require("../core/utils/js.js"), require("../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.classDecorator, global.index, global.js, global.globalExports);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _classDecorator, _index, _js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "BlockInputEventsComponent", {
    enumerable: true,
    get: function () {
      return _index.BlockInputEvents;
    }
  });
  Object.defineProperty(_exports, "ButtonComponent", {
    enumerable: true,
    get: function () {
      return _index.Button;
    }
  });
  Object.defineProperty(_exports, "EditBoxComponent", {
    enumerable: true,
    get: function () {
      return _index.EditBox;
    }
  });
  Object.defineProperty(_exports, "LayoutComponent", {
    enumerable: true,
    get: function () {
      return _index.Layout;
    }
  });
  Object.defineProperty(_exports, "MaskComponent", {
    enumerable: true,
    get: function () {
      return _index.Mask;
    }
  });
  Object.defineProperty(_exports, "LabelComponent", {
    enumerable: true,
    get: function () {
      return _index.Label;
    }
  });
  Object.defineProperty(_exports, "LabelOutlineComponent", {
    enumerable: true,
    get: function () {
      return _index.LabelOutline;
    }
  });
  Object.defineProperty(_exports, "ProgressBarComponent", {
    enumerable: true,
    get: function () {
      return _index.ProgressBar;
    }
  });
  Object.defineProperty(_exports, "RichTextComponent", {
    enumerable: true,
    get: function () {
      return _index.RichText;
    }
  });
  Object.defineProperty(_exports, "ScrollViewComponent", {
    enumerable: true,
    get: function () {
      return _index.ScrollView;
    }
  });
  Object.defineProperty(_exports, "ScrollBarComponent", {
    enumerable: true,
    get: function () {
      return _index.ScrollBar;
    }
  });
  Object.defineProperty(_exports, "SliderComponent", {
    enumerable: true,
    get: function () {
      return _index.Slider;
    }
  });
  Object.defineProperty(_exports, "SpriteComponent", {
    enumerable: true,
    get: function () {
      return _index.Sprite;
    }
  });
  Object.defineProperty(_exports, "ToggleComponent", {
    enumerable: true,
    get: function () {
      return _index.Toggle;
    }
  });
  Object.defineProperty(_exports, "ToggleContainerComponent", {
    enumerable: true,
    get: function () {
      return _index.ToggleContainer;
    }
  });
  Object.defineProperty(_exports, "UIModelComponent", {
    enumerable: true,
    get: function () {
      return _index.UIMeshRenderer;
    }
  });
  Object.defineProperty(_exports, "WidgetComponent", {
    enumerable: true,
    get: function () {
      return _index.Widget;
    }
  });
  Object.defineProperty(_exports, "GraphicsComponent", {
    enumerable: true,
    get: function () {
      return _index.Graphics;
    }
  });
  Object.defineProperty(_exports, "PageViewComponent", {
    enumerable: true,
    get: function () {
      return _index.PageView;
    }
  });
  Object.defineProperty(_exports, "PageViewIndicatorComponent", {
    enumerable: true,
    get: function () {
      return _index.PageViewIndicator;
    }
  });
  Object.defineProperty(_exports, "UIStaticBatchComponent", {
    enumerable: true,
    get: function () {
      return _index.UIStaticBatch;
    }
  });
  Object.defineProperty(_exports, "UIOpacityComponent", {
    enumerable: true,
    get: function () {
      return _index.UIOpacity;
    }
  });
  Object.defineProperty(_exports, "SafeAreaComponent", {
    enumerable: true,
    get: function () {
      return _index.SafeArea;
    }
  });
  Object.defineProperty(_exports, "UICoordinateTrackerComponent", {
    enumerable: true,
    get: function () {
      return _index.UICoordinateTracker;
    }
  });
  _exports.UIReorderComponent = void 0;

  var _dec, _class;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * @deprecated Since v1.2
   */
  var UIReorderComponent = (_dec = (0, _classDecorator.ccclass)('cc.UIReorderComponent'), _dec(_class = function UIReorderComponent() {
    _classCallCheck(this, UIReorderComponent);

    (0, _debug.warnID)(1408, 'UIReorderComponent');
  }) || _class);
  _exports.UIReorderComponent = UIReorderComponent;
  _globalExports.legacyCC.UIReorderComponent = UIReorderComponent;
  /**
   * Alias of [[Button]]
   * @deprecated Since v1.2
   */

  _globalExports.legacyCC.ButtonComponent = _index.Button;

  _js.js.setClassAlias(_index.Button, 'cc.ButtonComponent');
  /**
   * Alias of [[EditBox]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.EditBoxComponent = _index.EditBox;

  _js.js.setClassAlias(_index.EditBox, 'cc.EditBoxComponent');
  /**
   * Alias of [[Layout]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.LayoutComponent = _index.Layout;

  _js.js.setClassAlias(_index.Layout, 'cc.LayoutComponent');
  /**
   * Alias of [[Mask]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.MaskComponent = _index.Mask;

  _js.js.setClassAlias(_index.Mask, 'cc.MaskComponent');
  /**
   * Alias of [[Label]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.LabelComponent = _index.Label;

  _js.js.setClassAlias(_index.Label, 'cc.LabelComponent');
  /**
   * Alias of [[LabelOutline]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.LabelOutlineComponent = _index.LabelOutline;

  _js.js.setClassAlias(_index.LabelOutline, 'cc.LabelOutlineComponent');
  /**
   * Alias of [[ProgressBar]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.ProgressBarComponent = _index.ProgressBar;

  _js.js.setClassAlias(_index.ProgressBar, 'cc.ProgressBarComponent');
  /**
   * Alias of [[RichText]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.RichTextComponent = _index.RichText;

  _js.js.setClassAlias(_index.RichText, 'cc.RichTextComponent');
  /**
   * Alias of [[ScrollView]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.ScrollViewComponent = _index.ScrollView;

  _js.js.setClassAlias(_index.ScrollView, 'cc.ScrollViewComponent');
  /**
   * Alias of [[ScrollBar]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.ScrollBarComponent = _index.ScrollBar;

  _js.js.setClassAlias(_index.ScrollBar, 'cc.ScrollBarComponent');
  /**
   * Alias of [[Slider]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SliderComponent = _index.Slider;

  _js.js.setClassAlias(_index.Slider, 'cc.SliderComponent');
  /**
   * Alias of [[Sprite]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SpriteComponent = _index.Sprite;

  _js.js.setClassAlias(_index.Sprite, 'cc.SpriteComponent');
  /**
   * Alias of [[Toggle]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.ToggleComponent = _index.Toggle;

  _js.js.setClassAlias(_index.Toggle, 'cc.ToggleComponent');
  /**
   * Alias of [[ToggleContainer]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.ToggleContainerComponent = _index.ToggleContainer;

  _js.js.setClassAlias(_index.ToggleContainer, 'cc.ToggleContainerComponent');
  /**
   * Alias of [[UIMeshRenderer]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.UIModelComponent = _index.UIMeshRenderer;

  _js.js.setClassAlias(_index.UIMeshRenderer, 'cc.UIModelComponent');
  /**
   * Alias of [[Widget]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.WidgetComponent = _index.Widget;

  _js.js.setClassAlias(_index.Widget, 'cc.WidgetComponent');
  /**
   * Alias of [[Graphics]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.GraphicsComponent = _index.Graphics;

  _js.js.setClassAlias(_index.Graphics, 'cc.GraphicsComponent');
  /**
   * Alias of [[PageView]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.PageViewComponent = _index.PageView;

  _js.js.setClassAlias(_index.PageView, 'cc.PageViewComponent');
  /**
   * Alias of [[PageViewIndicator]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.PageViewIndicatorComponent = _index.PageViewIndicator;

  _js.js.setClassAlias(_index.PageViewIndicator, 'cc.PageViewIndicatorComponent');
  /**
   * Alias of [[UIStaticBatch]]
   * @deprecated Since v1.2
   */


  _js.js.setClassAlias(_index.UIStaticBatch, 'cc.UIStaticBatchComponent');
  /**
   * Alias of [[UIOpacity]]
   * @deprecated Since v1.2
   */


  _js.js.setClassAlias(_index.UIOpacity, 'cc.UIOpacityComponent');
  /**
   * Alias of [[SafeArea]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SafeAreaComponent = _index.SafeArea;

  _js.js.setClassAlias(_index.SafeArea, 'cc.SafeAreaComponent');
  /**
   * Alias of [[UICoordinateTracker]]
   * @deprecated Since v1.2
   */


  _js.js.setClassAlias(_index.UICoordinateTracker, 'cc.UICoordinateTrackerComponent');
  /**
   * Alias of [[BlockInputEvents]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.BlockInputEventsComponent = _index.BlockInputEvents;

  _js.js.setClassAlias(_index.BlockInputEvents, 'cc.BlockInputEventsComponent');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2RlcHJlY2F0ZWQudHMiXSwibmFtZXMiOlsiVUlSZW9yZGVyQ29tcG9uZW50IiwibGVnYWN5Q0MiLCJCdXR0b25Db21wb25lbnQiLCJCdXR0b24iLCJqcyIsInNldENsYXNzQWxpYXMiLCJFZGl0Qm94Q29tcG9uZW50IiwiRWRpdEJveCIsIkxheW91dENvbXBvbmVudCIsIkxheW91dCIsIk1hc2tDb21wb25lbnQiLCJNYXNrIiwiTGFiZWxDb21wb25lbnQiLCJMYWJlbCIsIkxhYmVsT3V0bGluZUNvbXBvbmVudCIsIkxhYmVsT3V0bGluZSIsIlByb2dyZXNzQmFyQ29tcG9uZW50IiwiUHJvZ3Jlc3NCYXIiLCJSaWNoVGV4dENvbXBvbmVudCIsIlJpY2hUZXh0IiwiU2Nyb2xsVmlld0NvbXBvbmVudCIsIlNjcm9sbFZpZXciLCJTY3JvbGxCYXJDb21wb25lbnQiLCJTY3JvbGxCYXIiLCJTbGlkZXJDb21wb25lbnQiLCJTbGlkZXIiLCJTcHJpdGVDb21wb25lbnQiLCJTcHJpdGUiLCJUb2dnbGVDb21wb25lbnQiLCJUb2dnbGUiLCJUb2dnbGVDb250YWluZXJDb21wb25lbnQiLCJUb2dnbGVDb250YWluZXIiLCJVSU1vZGVsQ29tcG9uZW50IiwiVUlNZXNoUmVuZGVyZXIiLCJXaWRnZXRDb21wb25lbnQiLCJXaWRnZXQiLCJHcmFwaGljc0NvbXBvbmVudCIsIkdyYXBoaWNzIiwiUGFnZVZpZXdDb21wb25lbnQiLCJQYWdlVmlldyIsIlBhZ2VWaWV3SW5kaWNhdG9yQ29tcG9uZW50IiwiUGFnZVZpZXdJbmRpY2F0b3IiLCJVSVN0YXRpY0JhdGNoIiwiVUlPcGFjaXR5IiwiU2FmZUFyZWFDb21wb25lbnQiLCJTYWZlQXJlYSIsIlVJQ29vcmRpbmF0ZVRyYWNrZXIiLCJCbG9ja0lucHV0RXZlbnRzQ29tcG9uZW50IiwiQmxvY2tJbnB1dEV2ZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7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cUMsaUJBQVQsR0FBNkJDLGVBQTdCOztBQUNBbkMsU0FBR0MsYUFBSCxDQUFpQmtDLGVBQWpCLEVBQTJCLHNCQUEzQjtBQUNBOzs7Ozs7QUFLQXRDLDBCQUFTdUMsMEJBQVQsR0FBc0NDLHdCQUF0Qzs7QUFDQXJDLFNBQUdDLGFBQUgsQ0FBaUJvQyx3QkFBakIsRUFBb0MsK0JBQXBDO0FBQ0E7Ozs7OztBQUtBckMsU0FBR0MsYUFBSCxDQUFpQnFDLG9CQUFqQixFQUFnQywyQkFBaEM7QUFDQTs7Ozs7O0FBS0F0QyxTQUFHQyxhQUFILENBQWlCc0MsZ0JBQWpCLEVBQTRCLHVCQUE1QjtBQUNBOzs7Ozs7QUFLQTFDLDBCQUFTMkMsaUJBQVQsR0FBNkJDLGVBQTdCOztBQUNBekMsU0FBR0MsYUFBSCxDQUFpQndDLGVBQWpCLEVBQTJCLHNCQUEzQjtBQUNBOzs7Ozs7QUFLQXpDLFNBQUdDLGFBQUgsQ0FBaUJ5QywwQkFBakIsRUFBc0MsaUNBQXRDO0FBQ0E7Ozs7OztBQUtBN0MsMEJBQVM4Qyx5QkFBVCxHQUFxQ0MsdUJBQXJDOztBQUNBNUMsU0FBR0MsYUFBSCxDQUFpQjJDLHVCQUFqQixFQUFtQyw4QkFBbkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgd2FybklEIH0gZnJvbSAnLi4vY29yZS9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IGNjY2xhc3MgfSBmcm9tICcuLi9jb3JlL2RhdGEvY2xhc3MtZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQmxvY2tJbnB1dEV2ZW50cywgQnV0dG9uLCBFZGl0Qm94LCBMYXlvdXQsIE1hc2ssIExhYmVsLCBMYWJlbE91dGxpbmUsIFByb2dyZXNzQmFyLCBSaWNoVGV4dCwgU2Nyb2xsVmlldywgU2Nyb2xsQmFyLCBTbGlkZXIsIFNwcml0ZSwgVG9nZ2xlLCBUb2dnbGVDb250YWluZXIsIFVJTWVzaFJlbmRlcmVyLCBXaWRnZXQsIEdyYXBoaWNzLCBQYWdlVmlldywgUGFnZVZpZXdJbmRpY2F0b3IsIFVJU3RhdGljQmF0Y2gsIFVJT3BhY2l0eSwgU2FmZUFyZWEsIFVJQ29vcmRpbmF0ZVRyYWNrZXIgfSBmcm9tICcuL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgeyBqcyB9IGZyb20gJy4uL2NvcmUvdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5VSVJlb3JkZXJDb21wb25lbnQnKVxyXG5leHBvcnQgY2xhc3MgVUlSZW9yZGVyQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB3YXJuSUQoMTQwOCwgJ1VJUmVvcmRlckNvbXBvbmVudCcpO1xyXG4gICAgfVxyXG59XHJcbmxlZ2FjeUNDLlVJUmVvcmRlckNvbXBvbmVudCA9IFVJUmVvcmRlckNvbXBvbmVudDtcclxuXHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0J1dHRvbl1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IEJ1dHRvbiBhcyBCdXR0b25Db21wb25lbnQgfTtcclxubGVnYWN5Q0MuQnV0dG9uQ29tcG9uZW50ID0gQnV0dG9uO1xyXG5qcy5zZXRDbGFzc0FsaWFzKEJ1dHRvbiwgJ2NjLkJ1dHRvbkNvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tFZGl0Qm94XV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgRWRpdEJveCBhcyBFZGl0Qm94Q29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLkVkaXRCb3hDb21wb25lbnQgPSBFZGl0Qm94O1xyXG5qcy5zZXRDbGFzc0FsaWFzKEVkaXRCb3gsICdjYy5FZGl0Qm94Q29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0xheW91dF1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IExheW91dCBhcyBMYXlvdXRDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuTGF5b3V0Q29tcG9uZW50ID0gTGF5b3V0O1xyXG5qcy5zZXRDbGFzc0FsaWFzKExheW91dCwgJ2NjLkxheW91dENvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tNYXNrXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgTWFzayBhcyBNYXNrQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLk1hc2tDb21wb25lbnQgPSBNYXNrO1xyXG5qcy5zZXRDbGFzc0FsaWFzKE1hc2ssICdjYy5NYXNrQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0xhYmVsXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgTGFiZWwgYXMgTGFiZWxDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuTGFiZWxDb21wb25lbnQgPSBMYWJlbDtcclxuanMuc2V0Q2xhc3NBbGlhcyhMYWJlbCwgJ2NjLkxhYmVsQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0xhYmVsT3V0bGluZV1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IExhYmVsT3V0bGluZSBhcyBMYWJlbE91dGxpbmVDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuTGFiZWxPdXRsaW5lQ29tcG9uZW50ID0gTGFiZWxPdXRsaW5lO1xyXG5qcy5zZXRDbGFzc0FsaWFzKExhYmVsT3V0bGluZSwgJ2NjLkxhYmVsT3V0bGluZUNvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tQcm9ncmVzc0Jhcl1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IFByb2dyZXNzQmFyIGFzIFByb2dyZXNzQmFyQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlByb2dyZXNzQmFyQ29tcG9uZW50ID0gUHJvZ3Jlc3NCYXI7XHJcbmpzLnNldENsYXNzQWxpYXMoUHJvZ3Jlc3NCYXIsICdjYy5Qcm9ncmVzc0JhckNvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tSaWNoVGV4dF1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IFJpY2hUZXh0IGFzIFJpY2hUZXh0Q29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlJpY2hUZXh0Q29tcG9uZW50ID0gUmljaFRleHQ7XHJcbmpzLnNldENsYXNzQWxpYXMoUmljaFRleHQsICdjYy5SaWNoVGV4dENvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tTY3JvbGxWaWV3XV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgU2Nyb2xsVmlldyBhcyBTY3JvbGxWaWV3Q29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlNjcm9sbFZpZXdDb21wb25lbnQgPSBTY3JvbGxWaWV3O1xyXG5qcy5zZXRDbGFzc0FsaWFzKFNjcm9sbFZpZXcsICdjYy5TY3JvbGxWaWV3Q29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1Njcm9sbEJhcl1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IFNjcm9sbEJhciBhcyBTY3JvbGxCYXJDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuU2Nyb2xsQmFyQ29tcG9uZW50ID0gU2Nyb2xsQmFyO1xyXG5qcy5zZXRDbGFzc0FsaWFzKFNjcm9sbEJhciwgJ2NjLlNjcm9sbEJhckNvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tTbGlkZXJdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBTbGlkZXIgYXMgU2xpZGVyQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlNsaWRlckNvbXBvbmVudCA9IFNsaWRlcjtcclxuanMuc2V0Q2xhc3NBbGlhcyhTbGlkZXIsICdjYy5TbGlkZXJDb21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbU3ByaXRlXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgU3ByaXRlIGFzIFNwcml0ZUNvbXBvbmVudCB9O1xyXG5sZWdhY3lDQy5TcHJpdGVDb21wb25lbnQgPSBTcHJpdGU7XHJcbmpzLnNldENsYXNzQWxpYXMoU3ByaXRlLCAnY2MuU3ByaXRlQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1RvZ2dsZV1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IFRvZ2dsZSBhcyBUb2dnbGVDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuVG9nZ2xlQ29tcG9uZW50ID0gVG9nZ2xlO1xyXG5qcy5zZXRDbGFzc0FsaWFzKFRvZ2dsZSwgJ2NjLlRvZ2dsZUNvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tUb2dnbGVDb250YWluZXJdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBUb2dnbGVDb250YWluZXIgYXMgVG9nZ2xlQ29udGFpbmVyQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlRvZ2dsZUNvbnRhaW5lckNvbXBvbmVudCA9IFRvZ2dsZUNvbnRhaW5lcjtcclxuanMuc2V0Q2xhc3NBbGlhcyhUb2dnbGVDb250YWluZXIsICdjYy5Ub2dnbGVDb250YWluZXJDb21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbVUlNZXNoUmVuZGVyZXJdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBVSU1lc2hSZW5kZXJlciBhcyBVSU1vZGVsQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlVJTW9kZWxDb21wb25lbnQgPSBVSU1lc2hSZW5kZXJlcjtcclxuanMuc2V0Q2xhc3NBbGlhcyhVSU1lc2hSZW5kZXJlciwgJ2NjLlVJTW9kZWxDb21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbV2lkZ2V0XV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgV2lkZ2V0IGFzIFdpZGdldENvbXBvbmVudCB9O1xyXG5sZWdhY3lDQy5XaWRnZXRDb21wb25lbnQgPSBXaWRnZXQ7XHJcbmpzLnNldENsYXNzQWxpYXMoV2lkZ2V0LCAnY2MuV2lkZ2V0Q29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0dyYXBoaWNzXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgR3JhcGhpY3MgYXMgR3JhcGhpY3NDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuR3JhcGhpY3NDb21wb25lbnQgPSBHcmFwaGljcztcclxuanMuc2V0Q2xhc3NBbGlhcyhHcmFwaGljcywgJ2NjLkdyYXBoaWNzQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1BhZ2VWaWV3XV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgUGFnZVZpZXcgYXMgUGFnZVZpZXdDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuUGFnZVZpZXdDb21wb25lbnQgPSBQYWdlVmlldztcclxuanMuc2V0Q2xhc3NBbGlhcyhQYWdlVmlldywgJ2NjLlBhZ2VWaWV3Q29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1BhZ2VWaWV3SW5kaWNhdG9yXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgUGFnZVZpZXdJbmRpY2F0b3IgYXMgUGFnZVZpZXdJbmRpY2F0b3JDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuUGFnZVZpZXdJbmRpY2F0b3JDb21wb25lbnQgPSBQYWdlVmlld0luZGljYXRvcjtcclxuanMuc2V0Q2xhc3NBbGlhcyhQYWdlVmlld0luZGljYXRvciwgJ2NjLlBhZ2VWaWV3SW5kaWNhdG9yQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1VJU3RhdGljQmF0Y2hdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBVSVN0YXRpY0JhdGNoIGFzIFVJU3RhdGljQmF0Y2hDb21wb25lbnQgfTtcclxuanMuc2V0Q2xhc3NBbGlhcyhVSVN0YXRpY0JhdGNoLCAnY2MuVUlTdGF0aWNCYXRjaENvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tVSU9wYWNpdHldXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBVSU9wYWNpdHkgYXMgVUlPcGFjaXR5Q29tcG9uZW50IH07XHJcbmpzLnNldENsYXNzQWxpYXMoVUlPcGFjaXR5LCAnY2MuVUlPcGFjaXR5Q29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1NhZmVBcmVhXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgU2FmZUFyZWEgYXMgU2FmZUFyZWFDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuU2FmZUFyZWFDb21wb25lbnQgPSBTYWZlQXJlYTtcclxuanMuc2V0Q2xhc3NBbGlhcyhTYWZlQXJlYSwgJ2NjLlNhZmVBcmVhQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1VJQ29vcmRpbmF0ZVRyYWNrZXJdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBVSUNvb3JkaW5hdGVUcmFja2VyIGFzIFVJQ29vcmRpbmF0ZVRyYWNrZXJDb21wb25lbnQgfTtcclxuanMuc2V0Q2xhc3NBbGlhcyhVSUNvb3JkaW5hdGVUcmFja2VyLCAnY2MuVUlDb29yZGluYXRlVHJhY2tlckNvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tCbG9ja0lucHV0RXZlbnRzXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgQmxvY2tJbnB1dEV2ZW50cyBhcyBCbG9ja0lucHV0RXZlbnRzQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLkJsb2NrSW5wdXRFdmVudHNDb21wb25lbnQgPSBCbG9ja0lucHV0RXZlbnRzO1xyXG5qcy5zZXRDbGFzc0FsaWFzKEJsb2NrSW5wdXRFdmVudHMsICdjYy5CbG9ja0lucHV0RXZlbnRzQ29tcG9uZW50Jyk7XHJcbiJdfQ==