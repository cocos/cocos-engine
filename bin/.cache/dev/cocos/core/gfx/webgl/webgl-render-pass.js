(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../render-pass.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../render-pass.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.renderPass);
    global.webglRenderPass = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _renderPass) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLRenderPass = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLRenderPass = /*#__PURE__*/function (_GFXRenderPass) {
    _inherits(WebGLRenderPass, _GFXRenderPass);

    function WebGLRenderPass() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLRenderPass);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLRenderPass)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuRenderPass = null;
      return _this;
    }

    _createClass(WebGLRenderPass, [{
      key: "initialize",
      value: function initialize(info) {
        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;

        if (info.subPasses) {
          this._subPasses = info.subPasses;
        }

        this._gpuRenderPass = {
          colorAttachments: this._colorInfos,
          depthStencilAttachment: this._depthStencilInfo
        };
        this._hash = this.computeHash();
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._gpuRenderPass = null;
      }
    }, {
      key: "gpuRenderPass",
      get: function get() {
        return this._gpuRenderPass;
      }
    }]);

    return WebGLRenderPass;
  }(_renderPass.GFXRenderPass);

  _exports.WebGLRenderPass = WebGLRenderPass;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLXJlbmRlci1wYXNzLnRzIl0sIm5hbWVzIjpbIldlYkdMUmVuZGVyUGFzcyIsIl9ncHVSZW5kZXJQYXNzIiwiaW5mbyIsIl9jb2xvckluZm9zIiwiY29sb3JBdHRhY2htZW50cyIsIl9kZXB0aFN0ZW5jaWxJbmZvIiwiZGVwdGhTdGVuY2lsQXR0YWNobWVudCIsInN1YlBhc3NlcyIsIl9zdWJQYXNzZXMiLCJfaGFzaCIsImNvbXB1dGVIYXNoIiwiR0ZYUmVuZGVyUGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFHYUEsZTs7Ozs7Ozs7Ozs7Ozs7O1lBTURDLGMsR0FBNkMsSTs7Ozs7O2lDQUVsQ0MsSSxFQUFrQztBQUVqRCxhQUFLQyxXQUFMLEdBQW1CRCxJQUFJLENBQUNFLGdCQUF4QjtBQUNBLGFBQUtDLGlCQUFMLEdBQXlCSCxJQUFJLENBQUNJLHNCQUE5Qjs7QUFDQSxZQUFJSixJQUFJLENBQUNLLFNBQVQsRUFBb0I7QUFDaEIsZUFBS0MsVUFBTCxHQUFrQk4sSUFBSSxDQUFDSyxTQUF2QjtBQUNIOztBQUVELGFBQUtOLGNBQUwsR0FBc0I7QUFDbEJHLFVBQUFBLGdCQUFnQixFQUFFLEtBQUtELFdBREw7QUFFbEJHLFVBQUFBLHNCQUFzQixFQUFFLEtBQUtEO0FBRlgsU0FBdEI7QUFLQSxhQUFLSSxLQUFMLEdBQWEsS0FBS0MsV0FBTCxFQUFiO0FBRUEsZUFBTyxJQUFQO0FBQ0g7OztnQ0FFaUI7QUFDZCxhQUFLVCxjQUFMLEdBQXNCLElBQXRCO0FBQ0g7OzswQkExQmdEO0FBQzdDLGVBQVEsS0FBS0EsY0FBYjtBQUNIOzs7O0lBSmdDVSx5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWFJlbmRlclBhc3MsIEdGWFJlbmRlclBhc3NJbmZvIH0gZnJvbSAnLi4vcmVuZGVyLXBhc3MnO1xyXG5pbXBvcnQgeyBJV2ViR0xHUFVSZW5kZXJQYXNzIH0gZnJvbSAnLi93ZWJnbC1ncHUtb2JqZWN0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJQYXNzIGV4dGVuZHMgR0ZYUmVuZGVyUGFzcyB7XHJcblxyXG4gICAgcHVibGljIGdldCBncHVSZW5kZXJQYXNzICgpOiBJV2ViR0xHUFVSZW5kZXJQYXNzIHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2dwdVJlbmRlclBhc3MhO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dwdVJlbmRlclBhc3M6IElXZWJHTEdQVVJlbmRlclBhc3MgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYUmVuZGVyUGFzc0luZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29sb3JJbmZvcyA9IGluZm8uY29sb3JBdHRhY2htZW50cztcclxuICAgICAgICB0aGlzLl9kZXB0aFN0ZW5jaWxJbmZvID0gaW5mby5kZXB0aFN0ZW5jaWxBdHRhY2htZW50O1xyXG4gICAgICAgIGlmIChpbmZvLnN1YlBhc3Nlcykge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJQYXNzZXMgPSBpbmZvLnN1YlBhc3NlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2dwdVJlbmRlclBhc3MgPSB7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudHM6IHRoaXMuX2NvbG9ySW5mb3MsXHJcbiAgICAgICAgICAgIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQ6IHRoaXMuX2RlcHRoU3RlbmNpbEluZm8sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5faGFzaCA9IHRoaXMuY29tcHV0ZUhhc2goKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX2dwdVJlbmRlclBhc3MgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==