(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/global-exports.js", "./webview-enums.js", "../core/components/ui-base/index.js", "../core/platform/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/global-exports.js"), require("./webview-enums.js"), require("../core/components/ui-base/index.js"), require("../core/platform/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.webviewEnums, global.index, global.index);
    global.webviewImplWeb = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, _webviewEnums, _index, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebViewImpl = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var game = _globalExports.legacyCC.game,
      view = _globalExports.legacyCC.view,
      mat4 = _globalExports.legacyCC.mat4,
      misc = _globalExports.legacyCC.misc,
      sys = _globalExports.legacyCC.sys;
  var MIN_ZINDEX = -Math.pow(2, 15);

  var _mat4_temp = mat4();

  var WebViewImpl = /*#__PURE__*/function () {
    function WebViewImpl(component) {
      var _this = this;

      _classCallCheck(this, WebViewImpl);

      this._eventList = new Map();
      this._state = _webviewEnums.EventType.NONE;
      this._webview = void 0;
      this._loaded = false;
      this._webViewComponent = null;
      this._uiTrans = null;
      this._w = 0;
      this._h = 0;
      this._m00 = 0;
      this._m01 = 0;
      this._m04 = 0;
      this._m05 = 0;
      this._m12 = 0;
      this._m13 = 0;
      this._forceUpdate = false;
      this._loadedCb = void 0;
      this._errorCb = void 0;
      this._webViewComponent = component;
      this._uiTrans = component.node.getComponent(_index.UITransform);

      this._loadedCb = function (e) {
        _this._forceUpdate = true;

        _this._dispatchEvent(_webviewEnums.EventType.LOADED);
      };

      this._errorCb = function (e) {
        _this._dispatchEvent(_webviewEnums.EventType.ERROR);

        var errorObj = e.target.error;

        if (errorObj) {
          (0, _index2.error)('Error ' + errorObj.code + '; details: ' + errorObj.message);
        }
      };

      this._appendDom();
    }

    _createClass(WebViewImpl, [{
      key: "loadURL",
      value: function loadURL(url) {
        if (this._webview) {
          this._webview.src = url; // emit loading event

          this._dispatchEvent(_webviewEnums.EventType.LOADING);
        }
      }
    }, {
      key: "evaluateJS",
      value: function evaluateJS(str) {
        if (this._webview) {
          var win = this._webview.contentWindow;

          if (win) {
            try {
              win.eval(str);
            } catch (e) {
              this._dispatchEvent(_webviewEnums.EventType.ERROR);

              (0, _index2.error)(e);
            }
          }
        }
      } // Native method

    }, {
      key: "setOnJSCallback",
      value: function setOnJSCallback(callback) {}
    }, {
      key: "setJavascriptInterfaceScheme",
      value: function setJavascriptInterfaceScheme(scheme) {} // ---

    }, {
      key: "_dispatchEvent",
      value: function _dispatchEvent(key) {
        var callback = this._eventList.get(key);

        if (callback) {
          this._state = key;
          callback.call(this);
        }
      }
    }, {
      key: "_appendDom",
      value: function _appendDom() {
        this._webview = document.createElement('iframe');
        this._webview.style.border = 'none';
        this._webview.style.position = 'absolute';
        this._webview.style.bottom = '0px';
        this._webview.style.left = '0px';
        this._webview.style['transform-origin'] = '0px 100% 0px';
        this._webview.style['-webkit-transform-origin'] = '0px 100% 0px';

        this._bindEvent();

        game.container.appendChild(this._webview);
      }
    }, {
      key: "_removeDom",
      value: function _removeDom() {
        var webview = this._webview;

        if (misc.contains(game.container, webview)) {
          game.container.removeChild(webview);

          this._removeEvent();
        }

        this._loaded = false;
        this._webview = null;
      }
    }, {
      key: "_bindEvent",
      value: function _bindEvent() {
        var webview = this._webview;
        webview.addEventListener('load', this._loadedCb);
        webview.addEventListener('error', this._errorCb);
      }
    }, {
      key: "_removeEvent",
      value: function _removeEvent() {
        var webview = this._webview;
        webview.removeEventListener('load', this._loadedCb);
        webview.removeEventListener('error', this._errorCb);
      }
    }, {
      key: "enable",
      value: function enable() {
        if (this._webview) {
          this._webview.style.visibility = 'visible';
        }
      }
    }, {
      key: "disable",
      value: function disable() {
        if (this._webview) {
          this._webview.style.visibility = 'hidden';
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._removeDom();

        this._eventList.clear();
      }
    }, {
      key: "syncStyleSize",
      value: function syncStyleSize(w, h) {
        var webview = this._webview;

        if (webview) {
          webview.style.width = w + 'px';
          webview.style.height = h + 'px';
        }
      }
    }, {
      key: "getUICamera",
      value: function getUICamera() {
        if (!this._uiTrans || !this._uiTrans._canvas) {
          return null;
        }

        return this._uiTrans._canvas.camera;
      }
    }, {
      key: "syncMatrix",
      value: function syncMatrix() {
        if (!this._webview || this._webview.style.visibility === 'hidden' || !this._webViewComponent) return;
        var camera = this.getUICamera();

        if (!camera) {
          return;
        }

        this._webViewComponent.node.getWorldMatrix(_mat4_temp);

        camera.update(true);
        camera.worldMatrixToScreen(_mat4_temp, _mat4_temp, game.canvas.width, game.canvas.height);
        var width = this._uiTrans.contentSize.width;
        var height = this._uiTrans.contentSize.height;

        if (!this._forceUpdate && this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 && this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 && this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 && this._w === width && this._h === height) {
          return;
        } // update matrix cache


        this._m00 = _mat4_temp.m00;
        this._m01 = _mat4_temp.m01;
        this._m04 = _mat4_temp.m04;
        this._m05 = _mat4_temp.m05;
        this._m12 = _mat4_temp.m12;
        this._m13 = _mat4_temp.m13;
        this._w = width;
        this._h = height;
        var dpr = view._devicePixelRatio;
        var scaleX = 1 / dpr;
        var scaleY = 1 / dpr;
        var container = game.container;
        var sx = _mat4_temp.m00 * scaleX;
        var b = _mat4_temp.m01;
        var c = _mat4_temp.m04;
        var sy = _mat4_temp.m05 * scaleY;
        this._webview.style.width = "".concat(width, "px");
        this._webview.style.height = "".concat(height, "px");
        var w = this._w * scaleX;
        var h = this._h * scaleY;
        var appx = w * _mat4_temp.m00 * this._uiTrans.anchorX;
        var appy = h * _mat4_temp.m05 * this._uiTrans.anchorY;
        var offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
        var offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
        var tx = _mat4_temp.m12 * scaleX - appx + offsetX;
        var ty = _mat4_temp.m13 * scaleY - appy + offsetY;
        var matrix = 'matrix(' + sx + ',' + -b + ',' + -c + ',' + sy + ',' + tx + ',' + -ty + ')';
        this._webview.style.transform = matrix;
        this._webview.style['-webkit-transform'] = matrix;
        this._forceUpdate = false;
      }
    }, {
      key: "loaded",
      get: function get() {
        return this._loaded;
      }
    }, {
      key: "eventList",
      get: function get() {
        return this._eventList;
      }
    }, {
      key: "webview",
      get: function get() {
        return this._webview;
      }
    }, {
      key: "state",
      get: function get() {
        return this._state;
      }
    }]);

    return WebViewImpl;
  }();

  _exports.WebViewImpl = WebViewImpl;
  _globalExports.legacyCC.internal.WebViewImpl = WebViewImpl;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3dlYnZpZXcvd2Vidmlldy1pbXBsLXdlYi50cyJdLCJuYW1lcyI6WyJnYW1lIiwibGVnYWN5Q0MiLCJ2aWV3IiwibWF0NCIsIm1pc2MiLCJzeXMiLCJNSU5fWklOREVYIiwiTWF0aCIsInBvdyIsIl9tYXQ0X3RlbXAiLCJXZWJWaWV3SW1wbCIsImNvbXBvbmVudCIsIl9ldmVudExpc3QiLCJNYXAiLCJfc3RhdGUiLCJFdmVudFR5cGUiLCJOT05FIiwiX3dlYnZpZXciLCJfbG9hZGVkIiwiX3dlYlZpZXdDb21wb25lbnQiLCJfdWlUcmFucyIsIl93IiwiX2giLCJfbTAwIiwiX20wMSIsIl9tMDQiLCJfbTA1IiwiX20xMiIsIl9tMTMiLCJfZm9yY2VVcGRhdGUiLCJfbG9hZGVkQ2IiLCJfZXJyb3JDYiIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJVSVRyYW5zZm9ybSIsImUiLCJfZGlzcGF0Y2hFdmVudCIsIkxPQURFRCIsIkVSUk9SIiwiZXJyb3JPYmoiLCJ0YXJnZXQiLCJlcnJvciIsImNvZGUiLCJtZXNzYWdlIiwiX2FwcGVuZERvbSIsInVybCIsInNyYyIsIkxPQURJTkciLCJzdHIiLCJ3aW4iLCJjb250ZW50V2luZG93IiwiZXZhbCIsImNhbGxiYWNrIiwic2NoZW1lIiwia2V5IiwiZ2V0IiwiY2FsbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiYm9yZGVyIiwicG9zaXRpb24iLCJib3R0b20iLCJsZWZ0IiwiX2JpbmRFdmVudCIsImNvbnRhaW5lciIsImFwcGVuZENoaWxkIiwid2VidmlldyIsImNvbnRhaW5zIiwicmVtb3ZlQ2hpbGQiLCJfcmVtb3ZlRXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInZpc2liaWxpdHkiLCJfcmVtb3ZlRG9tIiwiY2xlYXIiLCJ3IiwiaCIsIndpZHRoIiwiaGVpZ2h0IiwiX2NhbnZhcyIsImNhbWVyYSIsImdldFVJQ2FtZXJhIiwiZ2V0V29ybGRNYXRyaXgiLCJ1cGRhdGUiLCJ3b3JsZE1hdHJpeFRvU2NyZWVuIiwiY2FudmFzIiwiY29udGVudFNpemUiLCJtMDAiLCJtMDEiLCJtMDQiLCJtMDUiLCJtMTIiLCJtMTMiLCJkcHIiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsInNjYWxlWCIsInNjYWxlWSIsInN4IiwiYiIsImMiLCJzeSIsImFwcHgiLCJhbmNob3JYIiwiYXBweSIsImFuY2hvclkiLCJvZmZzZXRYIiwicGFkZGluZ0xlZnQiLCJwYXJzZUludCIsIm9mZnNldFkiLCJwYWRkaW5nQm90dG9tIiwidHgiLCJ0eSIsIm1hdHJpeCIsInRyYW5zZm9ybSIsImludGVybmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW9DUUEsSSxHQUFnQ0MsdUIsQ0FBaENELEk7TUFBTUUsSSxHQUEwQkQsdUIsQ0FBMUJDLEk7TUFBTUMsSSxHQUFvQkYsdUIsQ0FBcEJFLEk7TUFBTUMsSSxHQUFjSCx1QixDQUFkRyxJO01BQU1DLEcsR0FBUUosdUIsQ0FBUkksRztBQUVoQyxNQUFNQyxVQUFVLEdBQUcsQ0FBQ0MsSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEVBQVosQ0FBcEI7O0FBRUEsTUFBTUMsVUFBVSxHQUFHTixJQUFJLEVBQXZCOztNQUVhTyxXO0FBd0JULHlCQUFhQyxTQUFiLEVBQXdCO0FBQUE7O0FBQUE7O0FBQUEsV0F0QmRDLFVBc0JjLEdBdEJzQixJQUFJQyxHQUFKLEVBc0J0QjtBQUFBLFdBckJkQyxNQXFCYyxHQXJCTEMsd0JBQVVDLElBcUJMO0FBQUEsV0FwQmRDLFFBb0JjO0FBQUEsV0FsQmRDLE9Ba0JjLEdBbEJKLEtBa0JJO0FBQUEsV0FoQmRDLGlCQWdCYyxHQWhCc0IsSUFnQnRCO0FBQUEsV0FmZEMsUUFlYyxHQWZpQixJQWVqQjtBQUFBLFdBYmRDLEVBYWMsR0FiVCxDQWFTO0FBQUEsV0FaZEMsRUFZYyxHQVpULENBWVM7QUFBQSxXQVhkQyxJQVdj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R0FBaUJJLE1BQWpCLEdBQTBCTyxJQUExQixHQUFpQ0ssT0FBNUM7QUFFQSxZQUFNSSxNQUFNLEdBQUcsWUFBWWYsRUFBWixHQUFpQixHQUFqQixHQUF1QixDQUFDQyxDQUF4QixHQUE0QixHQUE1QixHQUFrQyxDQUFDQyxDQUFuQyxHQUF1QyxHQUF2QyxHQUE2Q0MsRUFBN0MsR0FBa0QsR0FBbEQsR0FBd0RVLEVBQXhELEdBQTZELEdBQTdELEdBQW1FLENBQUNDLEVBQXBFLEdBQXlFLEdBQXhGO0FBQ0EsYUFBSy9GLFFBQUwsQ0FBYzBDLEtBQWQsQ0FBb0J1RCxTQUFwQixHQUFnQ0QsTUFBaEM7QUFDQSxhQUFLaEcsUUFBTCxDQUFjMEMsS0FBZCxDQUFvQixtQkFBcEIsSUFBMkNzRCxNQUEzQztBQUNBLGFBQUtwRixZQUFMLEdBQW9CLEtBQXBCO0FBQ0g7OzswQkFoTGE7QUFDVixlQUFPLEtBQUtYLE9BQVo7QUFDSDs7OzBCQUVnQjtBQUNiLGVBQU8sS0FBS04sVUFBWjtBQUNIOzs7MEJBRWM7QUFDWCxlQUFPLEtBQUtLLFFBQVo7QUFDSDs7OzBCQUVZO0FBQ1QsZUFBTyxLQUFLSCxNQUFaO0FBQ0g7Ozs7Ozs7QUFxS0xiLDBCQUFTa0gsUUFBVCxDQUFrQnpHLFdBQWxCLEdBQWdDQSxXQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMjAgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb21wb25lbnQvd2Vidmlld1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFdlYlZpZXcgfSBmcm9tICcuL3dlYnZpZXcnO1xyXG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tICcuL3dlYnZpZXctZW51bXMnO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlJztcclxuaW1wb3J0IHsgZXJyb3IgfSBmcm9tICcuLi9jb3JlL3BsYXRmb3JtJztcclxuXHJcbmNvbnN0IHsgZ2FtZSwgdmlldywgbWF0NCwgbWlzYywgc3lzIH0gPSBsZWdhY3lDQztcclxuXHJcbmNvbnN0IE1JTl9aSU5ERVggPSAtTWF0aC5wb3coMiwgMTUpO1xyXG5cclxuY29uc3QgX21hdDRfdGVtcCA9IG1hdDQoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJWaWV3SW1wbCB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9ldmVudExpc3Q6IE1hcDxudW1iZXIsIEZ1bmN0aW9uPiA9IG5ldyBNYXA8bnVtYmVyLCBGdW5jdGlvbj4oKTtcclxuICAgIHByb3RlY3RlZCBfc3RhdGUgPSBFdmVudFR5cGUuTk9ORTtcclxuICAgIHByb3RlY3RlZCBfd2VidmlldzogYW55O1xyXG5cclxuICAgIHByb3RlY3RlZCBfbG9hZGVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF93ZWJWaWV3Q29tcG9uZW50OiBXZWJWaWV3IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3VpVHJhbnM6IFVJVHJhbnNmb3JtIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF93ID0gMDtcclxuICAgIHByb3RlY3RlZCBfaCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20wMCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20wMSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20wNCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20wNSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20xMiA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20xMyA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2ZvcmNlVXBkYXRlID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9sb2FkZWRDYjogKGUpID0+IHZvaWQ7XHJcbiAgICBwcm90ZWN0ZWQgX2Vycm9yQ2I6IChlKSA9PiB2b2lkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjb21wb25lbnQpIHtcclxuICAgICAgICB0aGlzLl93ZWJWaWV3Q29tcG9uZW50ID0gY29tcG9uZW50O1xyXG4gICAgICAgIHRoaXMuX3VpVHJhbnMgPSBjb21wb25lbnQubm9kZS5nZXRDb21wb25lbnQoVUlUcmFuc2Zvcm0pO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2FkZWRDYiA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuTE9BREVEKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9lcnJvckNiID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuRVJST1IpO1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvck9iaiA9IGUudGFyZ2V0LmVycm9yO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3JPYmopIHtcclxuICAgICAgICAgICAgICAgIGVycm9yKCdFcnJvciAnICsgZXJyb3JPYmouY29kZSArICc7IGRldGFpbHM6ICcgKyBlcnJvck9iai5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fYXBwZW5kRG9tKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYWRlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRlZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZXZlbnRMaXN0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3ZWJ2aWV3ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2VidmlldztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3RhdGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZFVSTCAodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5fd2Vidmlldykge1xyXG4gICAgICAgICAgICB0aGlzLl93ZWJ2aWV3LnNyYyA9IHVybDtcclxuICAgICAgICAgICAgLy8gZW1pdCBsb2FkaW5nIGV2ZW50XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLkxPQURJTkcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXZhbHVhdGVKUyAoc3RyOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5fd2Vidmlldykge1xyXG4gICAgICAgICAgICBjb25zdCB3aW4gPSB0aGlzLl93ZWJ2aWV3LmNvbnRlbnRXaW5kb3c7XHJcbiAgICAgICAgICAgIGlmICh3aW4pIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luLmV2YWwoc3RyKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5FUlJPUik7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTmF0aXZlIG1ldGhvZFxyXG4gICAgc2V0T25KU0NhbGxiYWNrIChjYWxsYmFjazogRnVuY3Rpb24pIHt9XHJcbiAgICBzZXRKYXZhc2NyaXB0SW50ZXJmYWNlU2NoZW1lIChzY2hlbWU6IHN0cmluZykge31cclxuICAgIC8vIC0tLVxyXG5cclxuICAgIHByb3RlY3RlZCBfZGlzcGF0Y2hFdmVudCAoa2V5KSB7XHJcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLl9ldmVudExpc3QuZ2V0KGtleSk7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0ga2V5O1xyXG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2FwcGVuZERvbSAoKSB7XHJcbiAgICAgICAgdGhpcy5fd2VidmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xyXG4gICAgICAgIHRoaXMuX3dlYnZpZXcuc3R5bGUuYm9yZGVyID0gJ25vbmUnO1xyXG4gICAgICAgIHRoaXMuX3dlYnZpZXcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgIHRoaXMuX3dlYnZpZXcuc3R5bGUuYm90dG9tID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5fd2Vidmlldy5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5fd2Vidmlldy5zdHlsZVsndHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XHJcbiAgICAgICAgdGhpcy5fd2Vidmlldy5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJ10gPSAnMHB4IDEwMCUgMHB4JztcclxuICAgICAgICB0aGlzLl9iaW5kRXZlbnQoKTtcclxuICAgICAgICBnYW1lLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl93ZWJ2aWV3KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlbW92ZURvbSAoKSB7XHJcbiAgICAgICAgY29uc3Qgd2VidmlldyA9IHRoaXMuX3dlYnZpZXc7XHJcbiAgICAgICAgaWYgKG1pc2MuY29udGFpbnMoZ2FtZS5jb250YWluZXIsIHdlYnZpZXcpKSB7XHJcbiAgICAgICAgICAgIGdhbWUuY29udGFpbmVyLnJlbW92ZUNoaWxkKHdlYnZpZXcpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVFdmVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl93ZWJ2aWV3ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2JpbmRFdmVudCAoKSB7XHJcbiAgICAgICAgY29uc3Qgd2VidmlldyA9IHRoaXMuX3dlYnZpZXc7XHJcbiAgICAgICAgd2Vidmlldy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5fbG9hZGVkQ2IpO1xyXG4gICAgICAgIHdlYnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCB0aGlzLl9lcnJvckNiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlbW92ZUV2ZW50ICgpIHtcclxuICAgICAgICBjb25zdCB3ZWJ2aWV3ID0gdGhpcy5fd2VidmlldztcclxuICAgICAgICB3ZWJ2aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLl9sb2FkZWRDYik7XHJcbiAgICAgICAgd2Vidmlldy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIHRoaXMuX2Vycm9yQ2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbmFibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl93ZWJ2aWV3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dlYnZpZXcuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc2FibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl93ZWJ2aWV3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dlYnZpZXcuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5fcmVtb3ZlRG9tKCk7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0LmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3luY1N0eWxlU2l6ZSAodywgaCkge1xyXG4gICAgICAgIGNvbnN0IHdlYnZpZXcgPSB0aGlzLl93ZWJ2aWV3O1xyXG4gICAgICAgIGlmICh3ZWJ2aWV3KSB7XHJcbiAgICAgICAgICAgIHdlYnZpZXcuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcclxuICAgICAgICAgICAgd2Vidmlldy5zdHlsZS5oZWlnaHQgPSBoICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VUlDYW1lcmEgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fdWlUcmFucyB8fCAhdGhpcy5fdWlUcmFucy5fY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdWlUcmFucy5fY2FudmFzLmNhbWVyYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3luY01hdHJpeCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl93ZWJ2aWV3IHx8IHRoaXMuX3dlYnZpZXcuc3R5bGUudmlzaWJpbGl0eSA9PT0gJ2hpZGRlbicgfHwgIXRoaXMuX3dlYlZpZXdDb21wb25lbnQpIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gdGhpcy5nZXRVSUNhbWVyYSgpO1xyXG4gICAgICAgIGlmICghY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3dlYlZpZXdDb21wb25lbnQubm9kZS5nZXRXb3JsZE1hdHJpeChfbWF0NF90ZW1wKTtcclxuICAgICAgICBjYW1lcmEudXBkYXRlKHRydWUpO1xyXG4gICAgICAgIGNhbWVyYS53b3JsZE1hdHJpeFRvU2NyZWVuKF9tYXQ0X3RlbXAsIF9tYXQ0X3RlbXAsIGdhbWUuY2FudmFzLndpZHRoLCBnYW1lLmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3VpVHJhbnMhLmNvbnRlbnRTaXplLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX3VpVHJhbnMhLmNvbnRlbnRTaXplLmhlaWdodDtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZvcmNlVXBkYXRlICYmXHJcbiAgICAgICAgICAgIHRoaXMuX20wMCA9PT0gX21hdDRfdGVtcC5tMDAgJiYgdGhpcy5fbTAxID09PSBfbWF0NF90ZW1wLm0wMSAmJlxyXG4gICAgICAgICAgICB0aGlzLl9tMDQgPT09IF9tYXQ0X3RlbXAubTA0ICYmIHRoaXMuX20wNSA9PT0gX21hdDRfdGVtcC5tMDUgJiZcclxuICAgICAgICAgICAgdGhpcy5fbTEyID09PSBfbWF0NF90ZW1wLm0xMiAmJiB0aGlzLl9tMTMgPT09IF9tYXQ0X3RlbXAubTEzICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3cgPT09IHdpZHRoICYmIHRoaXMuX2ggPT09IGhlaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1cGRhdGUgbWF0cml4IGNhY2hlXHJcbiAgICAgICAgdGhpcy5fbTAwID0gX21hdDRfdGVtcC5tMDA7XHJcbiAgICAgICAgdGhpcy5fbTAxID0gX21hdDRfdGVtcC5tMDE7XHJcbiAgICAgICAgdGhpcy5fbTA0ID0gX21hdDRfdGVtcC5tMDQ7XHJcbiAgICAgICAgdGhpcy5fbTA1ID0gX21hdDRfdGVtcC5tMDU7XHJcbiAgICAgICAgdGhpcy5fbTEyID0gX21hdDRfdGVtcC5tMTI7XHJcbiAgICAgICAgdGhpcy5fbTEzID0gX21hdDRfdGVtcC5tMTM7XHJcbiAgICAgICAgdGhpcy5fdyA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2ggPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGRwciA9IHZpZXcuX2RldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgY29uc3Qgc2NhbGVYID0gMSAvIGRwcjtcclxuICAgICAgICBjb25zdCBzY2FsZVkgPSAxIC8gZHByO1xyXG5cclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBnYW1lLmNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCBzeCA9IF9tYXQ0X3RlbXAubTAwICogc2NhbGVYO1xyXG4gICAgICAgIGNvbnN0IGIgPSBfbWF0NF90ZW1wLm0wMTtcclxuICAgICAgICBjb25zdCBjID0gX21hdDRfdGVtcC5tMDQ7XHJcbiAgICAgICAgY29uc3Qgc3kgPSBfbWF0NF90ZW1wLm0wNSAqIHNjYWxlWTtcclxuXHJcbiAgICAgICAgdGhpcy5fd2Vidmlldy5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcclxuICAgICAgICB0aGlzLl93ZWJ2aWV3LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XHJcbiAgICAgICAgY29uc3QgdyA9IHRoaXMuX3cgKiBzY2FsZVg7XHJcbiAgICAgICAgY29uc3QgaCA9IHRoaXMuX2ggKiBzY2FsZVk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFwcHggPSAodyAqIF9tYXQ0X3RlbXAubTAwKSAqIHRoaXMuX3VpVHJhbnMhLmFuY2hvclg7XHJcbiAgICAgICAgY29uc3QgYXBweSA9IChoICogX21hdDRfdGVtcC5tMDUpICogdGhpcy5fdWlUcmFucyEuYW5jaG9yWTtcclxuXHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IGNvbnRhaW5lciAmJiBjb250YWluZXIuc3R5bGUucGFkZGluZ0xlZnQgPyBwYXJzZUludChjb250YWluZXIuc3R5bGUucGFkZGluZ0xlZnQpIDogMDtcclxuICAgICAgICBjb25zdCBvZmZzZXRZID0gY29udGFpbmVyICYmIGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nQm90dG9tID8gcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlLnBhZGRpbmdCb3R0b20pIDogMDtcclxuICAgICAgICBjb25zdCB0eCA9IF9tYXQ0X3RlbXAubTEyICogc2NhbGVYIC0gYXBweCArIG9mZnNldFg7XHJcbiAgICAgICAgY29uc3QgdHkgPSBfbWF0NF90ZW1wLm0xMyAqIHNjYWxlWSAtIGFwcHkgKyBvZmZzZXRZO1xyXG5cclxuICAgICAgICBjb25zdCBtYXRyaXggPSAnbWF0cml4KCcgKyBzeCArICcsJyArIC1iICsgJywnICsgLWMgKyAnLCcgKyBzeSArICcsJyArIHR4ICsgJywnICsgLXR5ICsgJyknO1xyXG4gICAgICAgIHRoaXMuX3dlYnZpZXcuc3R5bGUudHJhbnNmb3JtID0gbWF0cml4O1xyXG4gICAgICAgIHRoaXMuX3dlYnZpZXcuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSBtYXRyaXg7XHJcbiAgICAgICAgdGhpcy5fZm9yY2VVcGRhdGUgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuaW50ZXJuYWwuV2ViVmlld0ltcGwgPSBXZWJWaWV3SW1wbDtcclxuIl19