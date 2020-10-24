(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.globalExports);
    global.componentEventHandler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.EventHandler = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * Component will register a event to target component's handler. And it will trigger the handler when a certain event occurs.
   *
   * @zh
   * “EventHandler” 类用来设置场景中的事件回调，该类允许用户设置回调目标节点，目标组件名，组件方法名，并可通过 emit 方法调用目标函数。
   *
   * @example
   * ```ts
   * // Let's say we have a MainMenu component on newTarget
   * // file: MainMenu.ts
   * @ccclass('MainMenu')
   * export class MainMenu extends Component {
   *     // sender: the node MainMenu.ts belongs to
   *     // eventType: CustomEventData
   *     onClick (sender, eventType) {
   *         cc.log('click');
   *     }
   * }
   *
   * import { Component } from 'cc';
   * const eventHandler = new Component.EventHandler();
   * eventHandler.target = newTarget;
   * eventHandler.component = "MainMenu";
   * eventHandler.handler = "OnClick";
   * eventHandler.customEventData = "my data";
   * ```
   */
  var EventHandler = (_dec = (0, _index.ccclass)('cc.ClickEvent'), _dec2 = (0, _index.type)(_globalExports.legacyCC.Node), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function EventHandler() {
      _classCallCheck(this, EventHandler);

      _initializerDefineProperty(this, "target", _descriptor, this);

      _initializerDefineProperty(this, "component", _descriptor2, this);

      _initializerDefineProperty(this, "_componentId", _descriptor3, this);

      _initializerDefineProperty(this, "handler", _descriptor4, this);

      _initializerDefineProperty(this, "customEventData", _descriptor5, this);
    }

    _createClass(EventHandler, [{
      key: "emit",

      /**
       * @en
       * Emit event with params
       * @zh
       * 触发目标组件上的指定 handler 函数，该参数是回调函数的参数值（可不填）。
       *
       * @param params - 派发参数数组。
       * @example
       * ```ts
       * import { Component } from 'cc';
       * const eventHandler = new Component.EventHandler();
       * eventHandler.target = newTarget;
       * eventHandler.component = "MainMenu";
       * eventHandler.handler = "OnClick"
       * eventHandler.emit(["param1", "param2", ....]);
       * ```
       */
      value: function emit(params) {
        var target = this.target;

        if (!_globalExports.legacyCC.isValid(target)) {
          return;
        }

        this._genCompIdIfNeeded();

        var compType = _globalExports.legacyCC.js._getClassById(this._componentId);

        var comp = target.getComponent(compType);

        if (!_globalExports.legacyCC.isValid(comp)) {
          return;
        }

        var handler = comp[this.handler];

        if (typeof handler !== 'function') {
          return;
        }

        if (this.customEventData != null && this.customEventData !== '') {
          params = params.slice();
          params.push(this.customEventData);
        }

        handler.apply(comp, params);
      }
    }, {
      key: "_compName2Id",
      value: function _compName2Id(compName) {
        var comp = _globalExports.legacyCC.js.getClassByName(compName);

        return _globalExports.legacyCC.js._getClassId(comp);
      }
    }, {
      key: "_compId2Name",
      value: function _compId2Name(compId) {
        var comp = _globalExports.legacyCC.js._getClassById(compId);

        return _globalExports.legacyCC.js.getClassName(comp);
      } // to be deprecated in the future

    }, {
      key: "_genCompIdIfNeeded",
      value: function _genCompIdIfNeeded() {
        if (!this._componentId) {
          this._componentName = this.component;
          this.component = '';
        }
      }
    }, {
      key: "_componentName",
      get: function get() {
        this._genCompIdIfNeeded();

        return this._compId2Name(this._componentId);
      },
      set: function set(value) {
        this._componentId = this._compName2Id(value);
      }
      /**
       * @en
       * For component event emit
       * @zh
       * 组件事件派发。
       *
       * @param events - 需要派发的组件事件列表。
       * @param args - 派发参数数组。
       */

    }], [{
      key: "emitEvents",
      value: function emitEvents(events) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        for (var i = 0, l = events.length; i < l; i++) {
          var event = events[i];

          if (!(event instanceof EventHandler)) {
            continue;
          }

          event.emit(args);
        }
      }
      /**
       * @en
       * The node that contains target callback, such as the node example script belongs to
       * @zh
       * 事件响应函数所在节点 ，比如例子中脚本归属的节点本身
       */

    }]);

    return EventHandler;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "component", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_componentId", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "handler", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "customEventData", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class);
  _exports.EventHandler = EventHandler;
  _globalExports.legacyCC.Component.EventHandler = EventHandler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy9jb21wb25lbnQtZXZlbnQtaGFuZGxlci50cyJdLCJuYW1lcyI6WyJFdmVudEhhbmRsZXIiLCJsZWdhY3lDQyIsIk5vZGUiLCJwYXJhbXMiLCJ0YXJnZXQiLCJpc1ZhbGlkIiwiX2dlbkNvbXBJZElmTmVlZGVkIiwiY29tcFR5cGUiLCJqcyIsIl9nZXRDbGFzc0J5SWQiLCJfY29tcG9uZW50SWQiLCJjb21wIiwiZ2V0Q29tcG9uZW50IiwiaGFuZGxlciIsImN1c3RvbUV2ZW50RGF0YSIsInNsaWNlIiwicHVzaCIsImFwcGx5IiwiY29tcE5hbWUiLCJnZXRDbGFzc0J5TmFtZSIsIl9nZXRDbGFzc0lkIiwiY29tcElkIiwiZ2V0Q2xhc3NOYW1lIiwiX2NvbXBvbmVudE5hbWUiLCJjb21wb25lbnQiLCJfY29tcElkMk5hbWUiLCJ2YWx1ZSIsIl9jb21wTmFtZTJJZCIsImV2ZW50cyIsImFyZ3MiLCJpIiwibCIsImxlbmd0aCIsImV2ZW50IiwiZW1pdCIsInNlcmlhbGl6YWJsZSIsImVkaXRhYmxlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BNkJhQSxZLFdBRFosb0JBQVEsZUFBUixDLFVBcUNJLGlCQUFLQyx3QkFBU0MsSUFBZCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQWlCYUMsTSxFQUFlO0FBQ3hCLFlBQU1DLE1BQU0sR0FBRyxLQUFLQSxNQUFwQjs7QUFDQSxZQUFJLENBQUNILHdCQUFTSSxPQUFULENBQWlCRCxNQUFqQixDQUFMLEVBQStCO0FBQUU7QUFBUzs7QUFFMUMsYUFBS0Usa0JBQUw7O0FBQ0EsWUFBTUMsUUFBUSxHQUFHTix3QkFBU08sRUFBVCxDQUFZQyxhQUFaLENBQTBCLEtBQUtDLFlBQS9CLENBQWpCOztBQUVBLFlBQU1DLElBQUksR0FBR1AsTUFBTSxDQUFFUSxZQUFSLENBQXFCTCxRQUFyQixDQUFiOztBQUNBLFlBQUksQ0FBQ04sd0JBQVNJLE9BQVQsQ0FBaUJNLElBQWpCLENBQUwsRUFBNkI7QUFBRTtBQUFTOztBQUV4QyxZQUFNRSxPQUFPLEdBQUdGLElBQUksQ0FBRSxLQUFLRSxPQUFQLENBQXBCOztBQUNBLFlBQUksT0FBT0EsT0FBUCxLQUFvQixVQUF4QixFQUFvQztBQUFFO0FBQVM7O0FBRS9DLFlBQUksS0FBS0MsZUFBTCxJQUF3QixJQUF4QixJQUFnQyxLQUFLQSxlQUFMLEtBQXlCLEVBQTdELEVBQWlFO0FBQzdEWCxVQUFBQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQ1ksS0FBUCxFQUFUO0FBQ0FaLFVBQUFBLE1BQU0sQ0FBQ2EsSUFBUCxDQUFZLEtBQUtGLGVBQWpCO0FBQ0g7O0FBRURELFFBQUFBLE9BQU8sQ0FBQ0ksS0FBUixDQUFjTixJQUFkLEVBQW9CUixNQUFwQjtBQUNIOzs7bUNBRXFCZSxRLEVBQVU7QUFDNUIsWUFBTVAsSUFBSSxHQUFHVix3QkFBU08sRUFBVCxDQUFZVyxjQUFaLENBQTJCRCxRQUEzQixDQUFiOztBQUNBLGVBQU9qQix3QkFBU08sRUFBVCxDQUFZWSxXQUFaLENBQXdCVCxJQUF4QixDQUFQO0FBQ0g7OzttQ0FFcUJVLE0sRUFBUTtBQUMxQixZQUFNVixJQUFJLEdBQUdWLHdCQUFTTyxFQUFULENBQVlDLGFBQVosQ0FBMEJZLE1BQTFCLENBQWI7O0FBQ0EsZUFBT3BCLHdCQUFTTyxFQUFULENBQVljLFlBQVosQ0FBeUJYLElBQXpCLENBQVA7QUFDSCxPLENBRUQ7Ozs7MkNBQzhCO0FBQzFCLFlBQUksQ0FBQyxLQUFLRCxZQUFWLEVBQXdCO0FBQ3BCLGVBQUthLGNBQUwsR0FBc0IsS0FBS0MsU0FBM0I7QUFDQSxlQUFLQSxTQUFMLEdBQWlCLEVBQWpCO0FBQ0g7QUFDSjs7OzBCQTVIcUI7QUFDbEIsYUFBS2xCLGtCQUFMOztBQUVBLGVBQU8sS0FBS21CLFlBQUwsQ0FBa0IsS0FBS2YsWUFBdkIsQ0FBUDtBQUNILE87d0JBQ21CZ0IsSyxFQUFPO0FBQ3ZCLGFBQUtoQixZQUFMLEdBQW9CLEtBQUtpQixZQUFMLENBQWtCRCxLQUFsQixDQUFwQjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztpQ0FTMEJFLE0sRUFBd0M7QUFBQSwwQ0FBYkMsSUFBYTtBQUFiQSxVQUFBQSxJQUFhO0FBQUE7O0FBQzlELGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQVIsRUFBV0MsQ0FBQyxHQUFHSCxNQUFNLENBQUNJLE1BQTNCLEVBQW1DRixDQUFDLEdBQUdDLENBQXZDLEVBQTBDRCxDQUFDLEVBQTNDLEVBQStDO0FBQzNDLGNBQU1HLEtBQUssR0FBR0wsTUFBTSxDQUFDRSxDQUFELENBQXBCOztBQUNBLGNBQUksRUFBRUcsS0FBSyxZQUFZakMsWUFBbkIsQ0FBSixFQUFzQztBQUNsQztBQUNIOztBQUVEaUMsVUFBQUEsS0FBSyxDQUFDQyxJQUFOLENBQVdMLElBQVg7QUFDSDtBQUNKO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7OzthQU82QixJOztnRkFRNUJNLG1CLEVBQ0FDLGU7Ozs7O2FBQ2tCLEU7O21GQUVsQkQsbUI7Ozs7O2FBQ3FCLEU7OzhFQVFyQkEsbUIsRUFDQUMsZTs7Ozs7YUFDZ0IsRTs7c0ZBUWhCRCxtQixFQUNBQyxlOzs7OzthQUN3QixFOzs7O0FBMkQ3Qm5DLDBCQUFTb0MsU0FBVCxDQUFtQnJDLFlBQW5CLEdBQWtDQSxZQUFsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgZXZlbnRcclxuICovXHJcblxyXG5pbXBvcnQge2NjY2xhc3MsIHR5cGUsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGV9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBDb21wb25lbnQgd2lsbCByZWdpc3RlciBhIGV2ZW50IHRvIHRhcmdldCBjb21wb25lbnQncyBoYW5kbGVyLiBBbmQgaXQgd2lsbCB0cmlnZ2VyIHRoZSBoYW5kbGVyIHdoZW4gYSBjZXJ0YWluIGV2ZW50IG9jY3Vycy5cclxuICpcclxuICogQHpoXHJcbiAqIOKAnEV2ZW50SGFuZGxlcuKAnSDnsbvnlKjmnaXorr7nva7lnLrmma/kuK3nmoTkuovku7blm57osIPvvIzor6XnsbvlhYHorrjnlKjmiLforr7nva7lm57osIPnm67moIfoioLngrnvvIznm67moIfnu4Tku7blkI3vvIznu4Tku7bmlrnms5XlkI3vvIzlubblj6/pgJrov4cgZW1pdCDmlrnms5XosIPnlKjnm67moIflh73mlbDjgIJcclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgdHNcclxuICogLy8gTGV0J3Mgc2F5IHdlIGhhdmUgYSBNYWluTWVudSBjb21wb25lbnQgb24gbmV3VGFyZ2V0XHJcbiAqIC8vIGZpbGU6IE1haW5NZW51LnRzXHJcbiAqIEBjY2NsYXNzKCdNYWluTWVudScpXHJcbiAqIGV4cG9ydCBjbGFzcyBNYWluTWVudSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAqICAgICAvLyBzZW5kZXI6IHRoZSBub2RlIE1haW5NZW51LnRzIGJlbG9uZ3MgdG9cclxuICogICAgIC8vIGV2ZW50VHlwZTogQ3VzdG9tRXZlbnREYXRhXHJcbiAqICAgICBvbkNsaWNrIChzZW5kZXIsIGV2ZW50VHlwZSkge1xyXG4gKiAgICAgICAgIGNjLmxvZygnY2xpY2snKTtcclxuICogICAgIH1cclxuICogfVxyXG4gKlxyXG4gKiBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdjYyc7XHJcbiAqIGNvbnN0IGV2ZW50SGFuZGxlciA9IG5ldyBDb21wb25lbnQuRXZlbnRIYW5kbGVyKCk7XHJcbiAqIGV2ZW50SGFuZGxlci50YXJnZXQgPSBuZXdUYXJnZXQ7XHJcbiAqIGV2ZW50SGFuZGxlci5jb21wb25lbnQgPSBcIk1haW5NZW51XCI7XHJcbiAqIGV2ZW50SGFuZGxlci5oYW5kbGVyID0gXCJPbkNsaWNrXCI7XHJcbiAqIGV2ZW50SGFuZGxlci5jdXN0b21FdmVudERhdGEgPSBcIm15IGRhdGFcIjtcclxuICogYGBgXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQ2xpY2tFdmVudCcpXHJcbmV4cG9ydCBjbGFzcyBFdmVudEhhbmRsZXIge1xyXG5cclxuICAgIGdldCBfY29tcG9uZW50TmFtZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fZ2VuQ29tcElkSWZOZWVkZWQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBJZDJOYW1lKHRoaXMuX2NvbXBvbmVudElkKTtcclxuICAgIH1cclxuICAgIHNldCBfY29tcG9uZW50TmFtZSAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRJZCA9IHRoaXMuX2NvbXBOYW1lMklkKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRm9yIGNvbXBvbmVudCBldmVudCBlbWl0XHJcbiAgICAgKiBAemhcclxuICAgICAqIOe7hOS7tuS6i+S7tua0vuWPkeOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudHMgLSDpnIDopoHmtL7lj5HnmoTnu4Tku7bkuovku7bliJfooajjgIJcclxuICAgICAqIEBwYXJhbSBhcmdzIC0g5rS+5Y+R5Y+C5pWw5pWw57uE44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZW1pdEV2ZW50cyAoZXZlbnRzOiBFdmVudEhhbmRsZXJbXSwgLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBldmVudHNbaV07XHJcbiAgICAgICAgICAgIGlmICghKGV2ZW50IGluc3RhbmNlb2YgRXZlbnRIYW5kbGVyKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGV2ZW50LmVtaXQoYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBub2RlIHRoYXQgY29udGFpbnMgdGFyZ2V0IGNhbGxiYWNrLCBzdWNoIGFzIHRoZSBub2RlIGV4YW1wbGUgc2NyaXB0IGJlbG9uZ3MgdG9cclxuICAgICAqIEB6aFxyXG4gICAgICog5LqL5Lu25ZON5bqU5Ye95pWw5omA5Zyo6IqC54K5IO+8jOavlOWmguS+i+WtkOS4reiEmuacrOW9kuWxnueahOiKgueCueacrOi6q1xyXG4gICAgICovXHJcbiAgICBAdHlwZShsZWdhY3lDQy5Ob2RlKVxyXG4gICAgcHVibGljIHRhcmdldDogTm9kZSB8IG51bGwgPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnQoc2NyaXB0KSB0aGF0IGNvbnRhaW5zIHRhcmdldCBjYWxsYmFjaywgc3VjaCBhcyB0aGUgbmFtZSAnTWFpbk1lbnUnIG9mIHNjcmlwdCBpbiBleGFtcGxlXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS6i+S7tuWTjeW6lOWHveaVsOaJgOWcqOe7hOS7tuWQje+8iOiEmuacrOWQje+8iSwg5q+U5aaC5L6L5a2Q5Lit55qE6ISa5pys5ZCNICdNYWluTWVudSdcclxuICAgICAqL1xyXG4gICAgLy8gb25seSBmb3IgZGVzZXJpYWxpemluZyBvbGQgcHJvamVjdCBjb21wb25lbnQgZmllbGRcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIGNvbXBvbmVudCA9ICcnO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyBfY29tcG9uZW50SWQgPSAnJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRXZlbnQgaGFuZGxlciwgc3VjaCBhcyBmdW5jdGlvbidzIG5hbWUgJ29uQ2xpY2snIGluIGV4YW1wbGVcclxuICAgICAqIEB6aFxyXG4gICAgICog5ZON5bqU5LqL5Lu25Ye95pWw5ZCN77yM5q+U5aaC5L6L5a2Q5Lit55qEICdvbkNsaWNrJ1xyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBoYW5kbGVyID0gJyc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEN1c3RvbSBFdmVudCBEYXRhLCBzdWNoIGFzICdldmVudFR5cGUnIGluIGV4YW1wbGVcclxuICAgICAqIEB6aFxyXG4gICAgICog6Ieq5a6a5LmJ5LqL5Lu25pWw5o2u77yM5q+U5aaC5L6L5a2Q5Lit55qEIGV2ZW50VHlwZVxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBjdXN0b21FdmVudERhdGEgPSAnJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRW1pdCBldmVudCB3aXRoIHBhcmFtc1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDop6blj5Hnm67moIfnu4Tku7bkuIrnmoTmjIflrpogaGFuZGxlciDlh73mlbDvvIzor6Xlj4LmlbDmmK/lm57osIPlh73mlbDnmoTlj4LmlbDlgLzvvIjlj6/kuI3loavvvInjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGFyYW1zIC0g5rS+5Y+R5Y+C5pWw5pWw57uE44CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ2NjJztcclxuICAgICAqIGNvbnN0IGV2ZW50SGFuZGxlciA9IG5ldyBDb21wb25lbnQuRXZlbnRIYW5kbGVyKCk7XHJcbiAgICAgKiBldmVudEhhbmRsZXIudGFyZ2V0ID0gbmV3VGFyZ2V0O1xyXG4gICAgICogZXZlbnRIYW5kbGVyLmNvbXBvbmVudCA9IFwiTWFpbk1lbnVcIjtcclxuICAgICAqIGV2ZW50SGFuZGxlci5oYW5kbGVyID0gXCJPbkNsaWNrXCJcclxuICAgICAqIGV2ZW50SGFuZGxlci5lbWl0KFtcInBhcmFtMVwiLCBcInBhcmFtMlwiLCAuLi4uXSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVtaXQgKHBhcmFtczogYW55W10pIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnRhcmdldDtcclxuICAgICAgICBpZiAoIWxlZ2FjeUNDLmlzVmFsaWQodGFyZ2V0KSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgdGhpcy5fZ2VuQ29tcElkSWZOZWVkZWQoKTtcclxuICAgICAgICBjb25zdCBjb21wVHlwZSA9IGxlZ2FjeUNDLmpzLl9nZXRDbGFzc0J5SWQodGhpcy5fY29tcG9uZW50SWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb21wID0gdGFyZ2V0IS5nZXRDb21wb25lbnQoY29tcFR5cGUpO1xyXG4gICAgICAgIGlmICghbGVnYWN5Q0MuaXNWYWxpZChjb21wKSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IGNvbXAhW3RoaXMuaGFuZGxlcl07XHJcbiAgICAgICAgaWYgKHR5cGVvZihoYW5kbGVyKSAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VzdG9tRXZlbnREYXRhICE9IG51bGwgJiYgdGhpcy5jdXN0b21FdmVudERhdGEgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zbGljZSgpO1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaCh0aGlzLmN1c3RvbUV2ZW50RGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoYW5kbGVyLmFwcGx5KGNvbXAsIHBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY29tcE5hbWUySWQgKGNvbXBOYW1lKSB7XHJcbiAgICAgICAgY29uc3QgY29tcCA9IGxlZ2FjeUNDLmpzLmdldENsYXNzQnlOYW1lKGNvbXBOYW1lKTtcclxuICAgICAgICByZXR1cm4gbGVnYWN5Q0MuanMuX2dldENsYXNzSWQoY29tcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY29tcElkMk5hbWUgKGNvbXBJZCkge1xyXG4gICAgICAgIGNvbnN0IGNvbXAgPSBsZWdhY3lDQy5qcy5fZ2V0Q2xhc3NCeUlkKGNvbXBJZCk7XHJcbiAgICAgICAgcmV0dXJuIGxlZ2FjeUNDLmpzLmdldENsYXNzTmFtZShjb21wKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0byBiZSBkZXByZWNhdGVkIGluIHRoZSBmdXR1cmVcclxuICAgIHByaXZhdGUgX2dlbkNvbXBJZElmTmVlZGVkICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NvbXBvbmVudElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudE5hbWUgPSB0aGlzLmNvbXBvbmVudDtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQgPSAnJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLkNvbXBvbmVudC5FdmVudEhhbmRsZXIgPSBFdmVudEhhbmRsZXI7XHJcbiJdfQ==