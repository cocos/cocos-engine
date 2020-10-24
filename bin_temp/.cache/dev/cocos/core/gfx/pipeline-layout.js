(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define);
    global.pipelineLayout = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXPipelineLayout = _exports.GFXPipelineLayoutInfo = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXPipelineLayoutInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXPipelineLayoutInfo() {
    var setLayouts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, GFXPipelineLayoutInfo);

    this.setLayouts = setLayouts;
  };
  /**
   * @en GFX pipeline layout.
   * @zh GFX 管线布局。
   */


  _exports.GFXPipelineLayoutInfo = GFXPipelineLayoutInfo;

  var GFXPipelineLayout = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXPipelineLayout, _GFXObject);

    _createClass(GFXPipelineLayout, [{
      key: "setLayouts",
      get: function get() {
        return this._setLayouts;
      }
    }]);

    function GFXPipelineLayout(device) {
      var _this;

      _classCallCheck(this, GFXPipelineLayout);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXPipelineLayout).call(this, _define.GFXObjectType.PIPELINE_LAYOUT));
      _this._device = void 0;
      _this._setLayouts = [];
      _this._device = device;
      return _this;
    }

    return GFXPipelineLayout;
  }(_define.GFXObject);

  _exports.GFXPipelineLayout = GFXPipelineLayout;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3BpcGVsaW5lLWxheW91dC50cyJdLCJuYW1lcyI6WyJHRlhQaXBlbGluZUxheW91dEluZm8iLCJzZXRMYXlvdXRzIiwiR0ZYUGlwZWxpbmVMYXlvdXQiLCJfc2V0TGF5b3V0cyIsImRldmljZSIsIkdGWE9iamVjdFR5cGUiLCJQSVBFTElORV9MQVlPVVQiLCJfZGV2aWNlIiwiR0ZYT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVFhQSxxQixHQUNxQjtBQUU5QixtQ0FFRTtBQUFBLFFBRFNDLFVBQ1QsdUVBRGdELEVBQ2hEOztBQUFBOztBQUFBLFNBRFNBLFVBQ1QsR0FEU0EsVUFDVDtBQUFFLEc7QUFHUjs7Ozs7Ozs7TUFJc0JDLGlCOzs7OzswQkFFQTtBQUNkLGVBQU8sS0FBS0MsV0FBWjtBQUNIOzs7QUFNRCwrQkFBYUMsTUFBYixFQUFnQztBQUFBOztBQUFBOztBQUM1Qiw2RkFBTUMsc0JBQWNDLGVBQXBCO0FBRDRCLFlBSnRCQyxPQUlzQjtBQUFBLFlBRnRCSixXQUVzQixHQUZrQixFQUVsQjtBQUU1QixZQUFLSSxPQUFMLEdBQWVILE1BQWY7QUFGNEI7QUFHL0I7OztJQWIyQ0ksaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdmeFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdGWE9iamVjdCwgR0ZYT2JqZWN0VHlwZSB9IGZyb20gJy4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi9kZXZpY2UnO1xyXG5pbXBvcnQgeyBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0IH0gZnJvbSAnLi9kZXNjcmlwdG9yLXNldC1sYXlvdXQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdGWFBpcGVsaW5lTGF5b3V0SW5mbyB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIHNldExheW91dHM6IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRbXSA9IFtdLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBwaXBlbGluZSBsYXlvdXQuXHJcbiAqIEB6aCBHRlgg566h57q/5biD5bGA44CCXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR0ZYUGlwZWxpbmVMYXlvdXQgZXh0ZW5kcyBHRlhPYmplY3Qge1xyXG5cclxuICAgIGdldCBzZXRMYXlvdXRzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2V0TGF5b3V0cztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfc2V0TGF5b3V0czogR0ZYRGVzY3JpcHRvclNldExheW91dFtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgc3VwZXIoR0ZYT2JqZWN0VHlwZS5QSVBFTElORV9MQVlPVVQpO1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYUGlwZWxpbmVMYXlvdXRJbmZvKTogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGVzdHJveSAoKTogdm9pZDtcclxufVxyXG4iXX0=