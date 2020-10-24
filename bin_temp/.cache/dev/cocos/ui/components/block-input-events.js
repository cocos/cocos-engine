(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/components/component.js", "../../core/platform/event-manager/event-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/components/component.js"), require("../../core/platform/event-manager/event-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.component, global.eventEnum);
    global.blockInputEvents = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _component, _eventEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BlockInputEvents = void 0;

  var _dec, _dec2, _dec3, _class;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var BlockEvents = [_eventEnum.SystemEventType.TOUCH_START, _eventEnum.SystemEventType.TOUCH_END, _eventEnum.SystemEventType.TOUCH_MOVE, _eventEnum.SystemEventType.MOUSE_DOWN, _eventEnum.SystemEventType.MOUSE_MOVE, _eventEnum.SystemEventType.MOUSE_UP, _eventEnum.SystemEventType.MOUSE_ENTER, _eventEnum.SystemEventType.MOUSE_LEAVE, _eventEnum.SystemEventType.MOUSE_WHEEL];

  function stopPropagation(event) {
    event.propagationStopped = true;
  }

  var BlockInputEvents = (_dec = (0, _index.ccclass)('cc.BlockInputEvents'), _dec2 = (0, _index.help)('i18n:cc.BlockInputEvents'), _dec3 = (0, _index.menu)('Components/BlockInputEvents'), _dec(_class = _dec2(_class = _dec3(_class = /*#__PURE__*/function (_Component) {
    _inherits(BlockInputEvents, _Component);

    function BlockInputEvents() {
      _classCallCheck(this, BlockInputEvents);

      return _possibleConstructorReturn(this, _getPrototypeOf(BlockInputEvents).apply(this, arguments));
    }

    _createClass(BlockInputEvents, [{
      key: "onEnable",
      value: function onEnable() {
        for (var i = 0; i < BlockEvents.length; i++) {
          // supply the 'this' parameter so that the callback could be added and removed correctly,
          // even if the same component is added more than once to a Node.
          this.node.on(BlockEvents[i], stopPropagation, this);
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        for (var i = 0; i < BlockEvents.length; i++) {
          this.node.off(BlockEvents[i], stopPropagation, this);
        }
      }
    }]);

    return BlockInputEvents;
  }(_component.Component)) || _class) || _class) || _class);
  _exports.BlockInputEvents = BlockInputEvents;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvYmxvY2staW5wdXQtZXZlbnRzLnRzIl0sIm5hbWVzIjpbIkJsb2NrRXZlbnRzIiwiU3lzdGVtRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJUT1VDSF9FTkQiLCJUT1VDSF9NT1ZFIiwiTU9VU0VfRE9XTiIsIk1PVVNFX01PVkUiLCJNT1VTRV9VUCIsIk1PVVNFX0VOVEVSIiwiTU9VU0VfTEVBVkUiLCJNT1VTRV9XSEVFTCIsInN0b3BQcm9wYWdhdGlvbiIsImV2ZW50IiwicHJvcGFnYXRpb25TdG9wcGVkIiwiQmxvY2tJbnB1dEV2ZW50cyIsImkiLCJsZW5ndGgiLCJub2RlIiwib24iLCJvZmYiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQ0EsTUFBTUEsV0FBVyxHQUFHLENBQUNDLDJCQUFnQkMsV0FBakIsRUFBOEJELDJCQUFnQkUsU0FBOUMsRUFBeURGLDJCQUFnQkcsVUFBekUsRUFDbEJILDJCQUFnQkksVUFERSxFQUNVSiwyQkFBZ0JLLFVBRDFCLEVBQ3NDTCwyQkFBZ0JNLFFBRHRELEVBRWxCTiwyQkFBZ0JPLFdBRkUsRUFFV1AsMkJBQWdCUSxXQUYzQixFQUV3Q1IsMkJBQWdCUyxXQUZ4RCxDQUFwQjs7QUFJQSxXQUFTQyxlQUFULENBQXlCQyxLQUF6QixFQUF1QztBQUNyQ0EsSUFBQUEsS0FBSyxDQUFDQyxrQkFBTixHQUEyQixJQUEzQjtBQUNEOztNQUtZQyxnQixXQUhaLG9CQUFRLHFCQUFSLEMsVUFDQSxpQkFBSywwQkFBTCxDLFVBQ0EsaUJBQUssNkJBQUwsQzs7Ozs7Ozs7Ozs7aUNBRVk7QUFDVCxhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdmLFdBQVcsQ0FBQ2dCLE1BQWhDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0FBQzNDO0FBQ0E7QUFDQSxlQUFLRSxJQUFMLENBQVVDLEVBQVYsQ0FBYWxCLFdBQVcsQ0FBQ2UsQ0FBRCxDQUF4QixFQUE2QkosZUFBN0IsRUFBOEMsSUFBOUM7QUFDRDtBQUNGOzs7a0NBRVc7QUFDVixhQUFLLElBQUlJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdmLFdBQVcsQ0FBQ2dCLE1BQWhDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0FBQzNDLGVBQUtFLElBQUwsQ0FBVUUsR0FBVixDQUFjbkIsV0FBVyxDQUFDZSxDQUFELENBQXpCLEVBQThCSixlQUE5QixFQUErQyxJQUEvQztBQUNEO0FBQ0Y7Ozs7SUFibUNTLG9CIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBldmVudFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGhpcyBjb21wb25lbnQgd2lsbCBibG9jayBhbGwgaW5wdXQgZXZlbnRzIChtb3VzZSBhbmQgdG91Y2gpIHdpdGhpbiB0aGUgc2l6ZSBvZiB0aGUgbm9kZSxcclxuICogcHJldmVudGluZyB0aGUgaW5wdXQgZnJvbSBwZW5ldHJhdGluZyBpbnRvIHRoZSB1bmRlcmx5aW5nIG5vZGUsIHR5cGljYWxseSBmb3IgdGhlIGJhY2tncm91bmQgb2YgdGhlIHRvcCBVSS48YnI+XHJcbiAqIFRoaXMgY29tcG9uZW50IGRvZXMgbm90IGhhdmUgYW55IEFQSSBpbnRlcmZhY2UgYW5kIGNhbiBiZSBhZGRlZCBkaXJlY3RseSB0byB0aGUgc2NlbmUgdG8gdGFrZSBlZmZlY3QuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDor6Xnu4Tku7blsIbmi6bmiKrmiYDlsZ7oioLngrnlsLrlr7jlhoXnmoTmiYDmnInovpPlhaXkuovku7bvvIjpvKDmoIflkozop6bmkbjvvInvvIzpmLLmraLovpPlhaXnqb/pgI/liLDkuIvlsYLoioLngrnvvIzkuIDoiKznlKjkuo7kuIrlsYIgVUkg55qE6IOM5pmv44CCPGJyPlxyXG4gKiDor6Xnu4Tku7bmsqHmnInku7vkvZUgQVBJIOaOpeWPo++8jOebtOaOpea3u+WKoOWIsOWcuuaZr+WNs+WPr+eUn+aViOOAglxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIG1lbnUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvY29tcG9uZW50JztcclxuaW1wb3J0IHsgRXZlbnQgfSBmcm9tICcuLi8uLi9jb3JlL2V2ZW50JztcclxuaW1wb3J0IHsgU3lzdGVtRXZlbnRUeXBlIH0gZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybS9ldmVudC1tYW5hZ2VyL2V2ZW50LWVudW0nO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgQmxvY2tFdmVudHMgPSBbU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfRU5ELCBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfTU9WRSxcclxuICBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfRE9XTiwgU3lzdGVtRXZlbnRUeXBlLk1PVVNFX01PVkUsIFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9VUCxcclxuICBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfRU5URVIsIFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9MRUFWRSwgU3lzdGVtRXZlbnRUeXBlLk1PVVNFX1dIRUVMXTtcclxuXHJcbmZ1bmN0aW9uIHN0b3BQcm9wYWdhdGlvbihldmVudDogRXZlbnQpIHtcclxuICBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG59XHJcblxyXG5AY2NjbGFzcygnY2MuQmxvY2tJbnB1dEV2ZW50cycpXHJcbkBoZWxwKCdpMThuOmNjLkJsb2NrSW5wdXRFdmVudHMnKVxyXG5AbWVudSgnQ29tcG9uZW50cy9CbG9ja0lucHV0RXZlbnRzJylcclxuZXhwb3J0IGNsYXNzIEJsb2NrSW5wdXRFdmVudHMgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIG9uRW5hYmxlKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBCbG9ja0V2ZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvLyBzdXBwbHkgdGhlICd0aGlzJyBwYXJhbWV0ZXIgc28gdGhhdCB0aGUgY2FsbGJhY2sgY291bGQgYmUgYWRkZWQgYW5kIHJlbW92ZWQgY29ycmVjdGx5LFxyXG4gICAgICAvLyBldmVuIGlmIHRoZSBzYW1lIGNvbXBvbmVudCBpcyBhZGRlZCBtb3JlIHRoYW4gb25jZSB0byBhIE5vZGUuXHJcbiAgICAgIHRoaXMubm9kZS5vbihCbG9ja0V2ZW50c1tpXSwgc3RvcFByb3BhZ2F0aW9uLCB0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uRGlzYWJsZSgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQmxvY2tFdmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5ub2RlLm9mZihCbG9ja0V2ZW50c1tpXSwgc3RvcFByb3BhZ2F0aW9uLCB0aGlzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19