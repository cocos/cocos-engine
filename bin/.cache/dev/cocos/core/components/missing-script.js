(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../utils/js.js", "../utils/misc.js", "./component.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../utils/js.js"), require("../utils/misc.js"), require("./component.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.js, global.misc, global.component, global.defaultConstants, global.globalExports, global.debug);
    global.missingScript = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _js, _misc, _component, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _class, _class2, _descriptor, _temp, _dec2, _dec3, _class4, _class5, _descriptor2, _descriptor3, _temp2;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * A temp fallback to contain the original serialized data which can not be loaded.
   * @zh
   * 包含无法加载的原始序列化数据的临时回退。
   */
  var MissingClass = (_dec = (0, _index.ccclass)('cc.MissingClass'), _dec(_class = (_class2 = (_temp = function MissingClass() {
    _classCallCheck(this, MissingClass);

    _initializerDefineProperty(this, "_$erialized", _descriptor, this);
  }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_$erialized", [_index.serializable, _index.editorOnly], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
  /**
   * @en
   * A temp fallback to contain the original component which can not be loaded.
   * @zh
   * 包含无法加载的原始组件的临时回退。
   */

  var MissingScript = (_dec2 = (0, _index.ccclass)('cc.MissingScript'), _dec3 = (0, _index.inspector)('packages://inspector/inspectors/comps/missing-script.js'), _dec2(_class4 = _dec3(_class4 = (_class5 = (_temp2 = /*#__PURE__*/function (_Component) {
    _inherits(MissingScript, _Component);

    _createClass(MissingScript, null, [{
      key: "safeFindClass",
      // _scriptUuid: {
      //    get: function () {
      //        var id = this._$erialized.__type__;
      //        if (EditorExtends.UuidUtils.isUuid(id)) {
      //            return EditorExtends.UuidUtils.decompressUuid(id);
      //        }
      //        return '';
      //    },
      // },

      /*
       * @param {string} id
       * @return {function} constructor
       */
      value: function safeFindClass(id, data) {
        var cls = (0, _js._getClassById)(id);

        if (cls) {
          return cls;
        }

        if (id) {
          _globalExports.legacyCC.deserialize.reportMissingClass(id);

          return MissingScript.getMissingWrapper(id, data);
        }

        return null;
      }
    }, {
      key: "getMissingWrapper",
      value: function getMissingWrapper(id, data) {
        if (data.node && (/^[0-9a-zA-Z+/]{23}$/.test(id) || _misc.BUILTIN_CLASSID_RE.test(id))) {
          // is component
          return MissingScript;
        } else {
          return MissingClass;
        }
      }
    }]);

    function MissingScript() {
      var _this;

      _classCallCheck(this, MissingScript);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MissingScript).call(this));

      _initializerDefineProperty(_this, "compiled", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_$erialized", _descriptor3, _assertThisInitialized(_this));

      if (_defaultConstants.EDITOR) {
        // @ts-ignore
        _this.compiled = _Scene.Sandbox.compiled;
      }

      return _this;
    }

    _createClass(MissingScript, [{
      key: "onLoad",
      value: function onLoad() {
        (0, _debug.warnID)(4600, this.node.name);
      }
    }]);

    return MissingScript;
  }(_component.Component), _temp2), (_descriptor2 = _applyDecoratedDescriptor(_class5.prototype, "compiled", [_index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "_$erialized", [_index.serializable, _index.editorOnly], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class5)) || _class4) || _class4);
  _exports.default = MissingScript;
  _globalExports.legacyCC._MissingScript = MissingScript;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy9taXNzaW5nLXNjcmlwdC50cyJdLCJuYW1lcyI6WyJNaXNzaW5nQ2xhc3MiLCJzZXJpYWxpemFibGUiLCJlZGl0b3JPbmx5IiwiTWlzc2luZ1NjcmlwdCIsImlkIiwiZGF0YSIsImNscyIsImxlZ2FjeUNDIiwiZGVzZXJpYWxpemUiLCJyZXBvcnRNaXNzaW5nQ2xhc3MiLCJnZXRNaXNzaW5nV3JhcHBlciIsIm5vZGUiLCJ0ZXN0IiwiQlVJTFRJTl9DTEFTU0lEX1JFIiwiRURJVE9SIiwiY29tcGlsZWQiLCJfU2NlbmUiLCJTYW5kYm94IiwibmFtZSIsIkNvbXBvbmVudCIsImVkaXRhYmxlIiwiX01pc3NpbmdTY3JpcHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ0E7Ozs7OztNQU9NQSxZLFdBREwsb0JBQVEsaUJBQVIsQzs7Ozt5RkFHSUMsbUIsRUFDQUMsaUI7Ozs7O2FBQ29CLEk7OztBQUd6Qjs7Ozs7OztNQVFxQkMsYSxZQUZwQixvQkFBUSxrQkFBUixDLFVBQ0Esc0JBQVUseURBQVYsQzs7Ozs7QUFHRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7b0NBSTZCQyxFLEVBQVlDLEksRUFBTTtBQUMzQyxZQUFNQyxHQUFHLEdBQUcsdUJBQWNGLEVBQWQsQ0FBWjs7QUFDQSxZQUFJRSxHQUFKLEVBQVM7QUFDTCxpQkFBT0EsR0FBUDtBQUNIOztBQUNELFlBQUlGLEVBQUosRUFBUTtBQUNKRyxrQ0FBU0MsV0FBVCxDQUFxQkMsa0JBQXJCLENBQXdDTCxFQUF4Qzs7QUFDQSxpQkFBT0QsYUFBYSxDQUFDTyxpQkFBZCxDQUFnQ04sRUFBaEMsRUFBb0NDLElBQXBDLENBQVA7QUFDSDs7QUFDRCxlQUFPLElBQVA7QUFDSDs7O3dDQUNnQ0QsRSxFQUFJQyxJLEVBQU07QUFDdkMsWUFBSUEsSUFBSSxDQUFDTSxJQUFMLEtBQWMsc0JBQXNCQyxJQUF0QixDQUEyQlIsRUFBM0IsS0FBa0NTLHlCQUFtQkQsSUFBbkIsQ0FBd0JSLEVBQXhCLENBQWhELENBQUosRUFBa0Y7QUFDOUU7QUFDQSxpQkFBT0QsYUFBUDtBQUNILFNBSEQsTUFJSztBQUNELGlCQUFPSCxZQUFQO0FBQ0g7QUFDSjs7O0FBVUQsNkJBQWU7QUFBQTs7QUFBQTs7QUFDWDs7QUFEVzs7QUFBQTs7QUFFWCxVQUFJYyx3QkFBSixFQUFZO0FBQ1I7QUFDQSxjQUFLQyxRQUFMLEdBQWdCQyxNQUFNLENBQUNDLE9BQVAsQ0FBZUYsUUFBL0I7QUFDSDs7QUFMVTtBQU1kOzs7OytCQUVnQjtBQUNiLDJCQUFPLElBQVAsRUFBYSxLQUFLSixJQUFMLENBQVVPLElBQXZCO0FBQ0g7Ozs7SUF2RHNDQyxvQixzRkFxQ3RDQyxlOzs7OzthQUNpQixLOztrRkFHakJuQixtQixFQUNBQyxpQjs7Ozs7YUFDb0IsSTs7OztBQWV6QkssMEJBQVNjLGNBQVQsR0FBMEJsQixhQUExQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29tcG9uZW50XHJcbiAqL1xyXG5cclxuaW1wb3J0IHtjY2NsYXNzLCBpbnNwZWN0b3IsIGVkaXRvck9ubHksIHNlcmlhbGl6YWJsZSwgZWRpdGFibGV9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7X2dldENsYXNzQnlJZH0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQge0JVSUxUSU5fQ0xBU1NJRF9SRX0gZnJvbSAnLi4vdXRpbHMvbWlzYyc7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50JztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IHdhcm5JRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQSB0ZW1wIGZhbGxiYWNrIHRvIGNvbnRhaW4gdGhlIG9yaWdpbmFsIHNlcmlhbGl6ZWQgZGF0YSB3aGljaCBjYW4gbm90IGJlIGxvYWRlZC5cclxuICogQHpoXHJcbiAqIOWMheWQq+aXoOazleWKoOi9veeahOWOn+Wni+W6j+WIl+WMluaVsOaNrueahOS4tOaXtuWbnumAgOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLk1pc3NpbmdDbGFzcycpXHJcbmNsYXNzIE1pc3NpbmdDbGFzcyB7XHJcbiAgICAvLyB0aGUgc2VyaWFsaXplZCBkYXRhIGZvciBvcmlnaW5hbCBvYmplY3RcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0b3JPbmx5XHJcbiAgICBwdWJsaWMgXyRlcmlhbGl6ZWQgPSBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEEgdGVtcCBmYWxsYmFjayB0byBjb250YWluIHRoZSBvcmlnaW5hbCBjb21wb25lbnQgd2hpY2ggY2FuIG5vdCBiZSBsb2FkZWQuXHJcbiAqIEB6aFxyXG4gKiDljIXlkKvml6Dms5XliqDovb3nmoTljp/lp4vnu4Tku7bnmoTkuLTml7blm57pgIDjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5NaXNzaW5nU2NyaXB0JylcclxuQGluc3BlY3RvcigncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9taXNzaW5nLXNjcmlwdC5qcycpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pc3NpbmdTY3JpcHQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIC8vIF9zY3JpcHRVdWlkOiB7XHJcbiAgICAvLyAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vICAgICAgICB2YXIgaWQgPSB0aGlzLl8kZXJpYWxpemVkLl9fdHlwZV9fO1xyXG4gICAgLy8gICAgICAgIGlmIChFZGl0b3JFeHRlbmRzLlV1aWRVdGlscy5pc1V1aWQoaWQpKSB7XHJcbiAgICAvLyAgICAgICAgICAgIHJldHVybiBFZGl0b3JFeHRlbmRzLlV1aWRVdGlscy5kZWNvbXByZXNzVXVpZChpZCk7XHJcbiAgICAvLyAgICAgICAgfVxyXG4gICAgLy8gICAgICAgIHJldHVybiAnJztcclxuICAgIC8vICAgIH0sXHJcbiAgICAvLyB9LFxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcclxuICAgICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNhZmVGaW5kQ2xhc3MgKGlkOiBzdHJpbmcsIGRhdGEpIHtcclxuICAgICAgICBjb25zdCBjbHMgPSBfZ2V0Q2xhc3NCeUlkKGlkKTtcclxuICAgICAgICBpZiAoY2xzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjbHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpZCkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5kZXNlcmlhbGl6ZS5yZXBvcnRNaXNzaW5nQ2xhc3MoaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gTWlzc2luZ1NjcmlwdC5nZXRNaXNzaW5nV3JhcHBlcihpZCwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRNaXNzaW5nV3JhcHBlciAoaWQsIGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YS5ub2RlICYmICgvXlswLTlhLXpBLVorL117MjN9JC8udGVzdChpZCkgfHwgQlVJTFRJTl9DTEFTU0lEX1JFLnRlc3QoaWQpKSkge1xyXG4gICAgICAgICAgICAvLyBpcyBjb21wb25lbnRcclxuICAgICAgICAgICAgcmV0dXJuIE1pc3NpbmdTY3JpcHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gTWlzc2luZ0NsYXNzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBjb21waWxlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIHRoZSBzZXJpYWxpemVkIGRhdGEgZm9yIG9yaWdpbmFsIHNjcmlwdCBvYmplY3RcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0b3JPbmx5XHJcbiAgICBwdWJsaWMgXyRlcmlhbGl6ZWQgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB0aGlzLmNvbXBpbGVkID0gX1NjZW5lLlNhbmRib3guY29tcGlsZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkxvYWQgKCkge1xyXG4gICAgICAgIHdhcm5JRCg0NjAwLCB0aGlzLm5vZGUubmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLl9NaXNzaW5nU2NyaXB0ID0gTWlzc2luZ1NjcmlwdDtcclxuIl19