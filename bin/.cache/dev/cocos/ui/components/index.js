(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./button.js", "./editbox/edit-box.js", "./label.js", "./layout.js", "./mask.js", "./progress-bar.js", "./rich-text.js", "./scroll-bar.js", "./scroll-view.js", "./slider.js", "./sprite.js", "./toggle.js", "./toggle-container.js", "./ui-mesh-renderer.js", "./view-group.js", "./widget.js", "./label-outline.js", "./graphics.js", "./page-view.js", "./page-view-indicator.js", "./ui-static-batch.js", "./ui-opacity.js", "./safe-area.js", "./ui-coodinate-tracker.js", "./block-input-events.js", "./widget-manager.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./button.js"), require("./editbox/edit-box.js"), require("./label.js"), require("./layout.js"), require("./mask.js"), require("./progress-bar.js"), require("./rich-text.js"), require("./scroll-bar.js"), require("./scroll-view.js"), require("./slider.js"), require("./sprite.js"), require("./toggle.js"), require("./toggle-container.js"), require("./ui-mesh-renderer.js"), require("./view-group.js"), require("./widget.js"), require("./label-outline.js"), require("./graphics.js"), require("./page-view.js"), require("./page-view-indicator.js"), require("./ui-static-batch.js"), require("./ui-opacity.js"), require("./safe-area.js"), require("./ui-coodinate-tracker.js"), require("./block-input-events.js"), require("./widget-manager.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.button, global.editBox, global.label, global.layout, global.mask, global.progressBar, global.richText, global.scrollBar, global.scrollView, global.slider, global.sprite, global.toggle, global.toggleContainer, global.uiMeshRenderer, global.viewGroup, global.widget, global.labelOutline, global.graphics, global.pageView, global.pageViewIndicator, global.uiStaticBatch, global.uiOpacity, global.safeArea, global.uiCoodinateTracker, global.blockInputEvents, global.widgetManager);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _button, _editBox, _label, _layout, _mask, _progressBar, _richText, _scrollBar, _scrollView, _slider, _sprite, _toggle, _toggleContainer, _uiMeshRenderer, _viewGroup, _widget, _labelOutline, _graphics, _pageView, _pageViewIndicator, _uiStaticBatch, _uiOpacity, _safeArea, _uiCoodinateTracker, _blockInputEvents, _widgetManager) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    Button: true,
    EditBox: true,
    Layout: true,
    Mask: true,
    ProgressBar: true,
    RichText: true,
    ScrollBar: true,
    ScrollView: true,
    Slider: true,
    Sprite: true,
    Toggle: true,
    ToggleContainer: true,
    UIMeshRenderer: true,
    ViewGroup: true,
    Widget: true,
    LabelOutline: true,
    Graphics: true,
    PageView: true,
    PageViewIndicator: true,
    UIStaticBatch: true,
    UIOpacity: true,
    SafeArea: true,
    UICoordinateTracker: true,
    BlockInputEvents: true,
    widgetManager: true
  };
  Object.defineProperty(_exports, "Button", {
    enumerable: true,
    get: function () {
      return _button.Button;
    }
  });
  Object.defineProperty(_exports, "EditBox", {
    enumerable: true,
    get: function () {
      return _editBox.EditBox;
    }
  });
  Object.defineProperty(_exports, "Layout", {
    enumerable: true,
    get: function () {
      return _layout.Layout;
    }
  });
  Object.defineProperty(_exports, "Mask", {
    enumerable: true,
    get: function () {
      return _mask.Mask;
    }
  });
  Object.defineProperty(_exports, "ProgressBar", {
    enumerable: true,
    get: function () {
      return _progressBar.ProgressBar;
    }
  });
  Object.defineProperty(_exports, "RichText", {
    enumerable: true,
    get: function () {
      return _richText.RichText;
    }
  });
  Object.defineProperty(_exports, "ScrollBar", {
    enumerable: true,
    get: function () {
      return _scrollBar.ScrollBar;
    }
  });
  Object.defineProperty(_exports, "ScrollView", {
    enumerable: true,
    get: function () {
      return _scrollView.ScrollView;
    }
  });
  Object.defineProperty(_exports, "Slider", {
    enumerable: true,
    get: function () {
      return _slider.Slider;
    }
  });
  Object.defineProperty(_exports, "Sprite", {
    enumerable: true,
    get: function () {
      return _sprite.Sprite;
    }
  });
  Object.defineProperty(_exports, "Toggle", {
    enumerable: true,
    get: function () {
      return _toggle.Toggle;
    }
  });
  Object.defineProperty(_exports, "ToggleContainer", {
    enumerable: true,
    get: function () {
      return _toggleContainer.ToggleContainer;
    }
  });
  Object.defineProperty(_exports, "UIMeshRenderer", {
    enumerable: true,
    get: function () {
      return _uiMeshRenderer.UIMeshRenderer;
    }
  });
  Object.defineProperty(_exports, "ViewGroup", {
    enumerable: true,
    get: function () {
      return _viewGroup.ViewGroup;
    }
  });
  Object.defineProperty(_exports, "Widget", {
    enumerable: true,
    get: function () {
      return _widget.Widget;
    }
  });
  Object.defineProperty(_exports, "LabelOutline", {
    enumerable: true,
    get: function () {
      return _labelOutline.LabelOutline;
    }
  });
  Object.defineProperty(_exports, "Graphics", {
    enumerable: true,
    get: function () {
      return _graphics.Graphics;
    }
  });
  Object.defineProperty(_exports, "PageView", {
    enumerable: true,
    get: function () {
      return _pageView.PageView;
    }
  });
  Object.defineProperty(_exports, "PageViewIndicator", {
    enumerable: true,
    get: function () {
      return _pageViewIndicator.PageViewIndicator;
    }
  });
  Object.defineProperty(_exports, "UIStaticBatch", {
    enumerable: true,
    get: function () {
      return _uiStaticBatch.UIStaticBatch;
    }
  });
  Object.defineProperty(_exports, "UIOpacity", {
    enumerable: true,
    get: function () {
      return _uiOpacity.UIOpacity;
    }
  });
  Object.defineProperty(_exports, "SafeArea", {
    enumerable: true,
    get: function () {
      return _safeArea.SafeArea;
    }
  });
  Object.defineProperty(_exports, "UICoordinateTracker", {
    enumerable: true,
    get: function () {
      return _uiCoodinateTracker.UICoordinateTracker;
    }
  });
  Object.defineProperty(_exports, "BlockInputEvents", {
    enumerable: true,
    get: function () {
      return _blockInputEvents.BlockInputEvents;
    }
  });
  Object.defineProperty(_exports, "widgetManager", {
    enumerable: true,
    get: function () {
      return _widgetManager.widgetManager;
    }
  });
  Object.keys(_label).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _label[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmV4cG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4vYnV0dG9uJztcclxuZXhwb3J0IHsgRWRpdEJveCB9IGZyb20gJy4vZWRpdGJveC9lZGl0LWJveCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vbGFiZWwnO1xyXG5leHBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL2xheW91dCc7XHJcbmV4cG9ydCB7IE1hc2sgfSBmcm9tICcuL21hc2snO1xyXG5leHBvcnQgeyBQcm9ncmVzc0JhciB9IGZyb20gJy4vcHJvZ3Jlc3MtYmFyJztcclxuZXhwb3J0IHsgUmljaFRleHQgfSBmcm9tICcuL3JpY2gtdGV4dCc7XHJcbmV4cG9ydCB7IFNjcm9sbEJhciB9IGZyb20gJy4vc2Nyb2xsLWJhcic7XHJcbmV4cG9ydCB7IFNjcm9sbFZpZXcgfSBmcm9tICcuL3Njcm9sbC12aWV3JztcclxuZXhwb3J0IHsgU2xpZGVyIH0gZnJvbSAnLi9zbGlkZXInO1xyXG5leHBvcnQgeyBTcHJpdGUgfSBmcm9tICcuL3Nwcml0ZSc7XHJcbmV4cG9ydCB7IFRvZ2dsZSB9IGZyb20gJy4vdG9nZ2xlJztcclxuZXhwb3J0IHsgVG9nZ2xlQ29udGFpbmVyIH0gZnJvbSAnLi90b2dnbGUtY29udGFpbmVyJztcclxuZXhwb3J0IHsgVUlNZXNoUmVuZGVyZXIgfSBmcm9tICcuL3VpLW1lc2gtcmVuZGVyZXInO1xyXG5leHBvcnQgeyBWaWV3R3JvdXAgfSBmcm9tICcuL3ZpZXctZ3JvdXAnO1xyXG5leHBvcnQgeyBXaWRnZXQgfSBmcm9tICcuL3dpZGdldCc7XHJcbmV4cG9ydCB7IExhYmVsT3V0bGluZSB9IGZyb20gJy4vbGFiZWwtb3V0bGluZSc7XHJcbmV4cG9ydCB7IEdyYXBoaWNzIH0gZnJvbSAnLi9ncmFwaGljcyc7XHJcbmV4cG9ydCB7IFBhZ2VWaWV3IH0gZnJvbSAnLi9wYWdlLXZpZXcnO1xyXG5leHBvcnQgeyBQYWdlVmlld0luZGljYXRvciB9IGZyb20gJy4vcGFnZS12aWV3LWluZGljYXRvcic7XHJcbmV4cG9ydCB7IFVJU3RhdGljQmF0Y2ggfSBmcm9tICcuL3VpLXN0YXRpYy1iYXRjaCc7XHJcbmV4cG9ydCB7IFVJT3BhY2l0eSB9IGZyb20gJy4vdWktb3BhY2l0eSc7XHJcbmV4cG9ydCB7IFNhZmVBcmVhIH0gZnJvbSAnLi9zYWZlLWFyZWEnO1xyXG5leHBvcnQgeyBVSUNvb3JkaW5hdGVUcmFja2VyIH0gZnJvbSAnLi91aS1jb29kaW5hdGUtdHJhY2tlcic7XHJcbmV4cG9ydCB7IEJsb2NrSW5wdXRFdmVudHMgfSBmcm9tICcuL2Jsb2NrLWlucHV0LWV2ZW50cyc7XHJcblxyXG5leHBvcnQgeyB3aWRnZXRNYW5hZ2VyIH0gZnJvbSAnLi93aWRnZXQtbWFuYWdlcic7XHJcbiJdfQ==