(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../renderer/core/program-lib.js", "./asset.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../renderer/core/program-lib.js"), require("./asset.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.programLib, global.asset, global.defaultConstants, global.globalExports);
    global.effectAsset = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _programLib, _asset, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.EffectAsset = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var effects = {};
  /**
   * @zh
   * Effect 资源，作为材质实例初始化的模板，每个 effect 资源都应是全局唯一的。
   */

  var EffectAsset = (_dec = (0, _index.ccclass)('cc.EffectAsset'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Asset) {
    _inherits(EffectAsset, _Asset);

    function EffectAsset() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, EffectAsset);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EffectAsset)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "techniques", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "shaders", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "combinations", _descriptor3, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(EffectAsset, [{
      key: "onLoaded",

      /**
       * @zh
       * 通过 Loader 加载完成时的回调，将自动注册 effect 资源。
       */
      value: function onLoaded() {
        this.shaders.forEach(function (s) {
          return _programLib.programLib.define(s);
        });

        if (!_defaultConstants.EDITOR) {
          _globalExports.legacyCC.game.once(_globalExports.legacyCC.Game.EVENT_ENGINE_INITED, this._precompile, this);
        }

        EffectAsset.register(this);
      }
    }, {
      key: "_precompile",
      value: function _precompile() {
        var _this2 = this;

        var root = _globalExports.legacyCC.director.root;

        var _loop = function _loop(i) {
          var shader = _this2.shaders[i];
          var combination = _this2.combinations[i];

          if (!combination) {
            return "continue";
          }

          Object.keys(combination).reduce(function (out, name) {
            return out.reduce(function (acc, cur) {
              var choices = combination[name];
              var next = [cur].concat(_toConsumableArray(Array(choices.length - 1)).map(function () {
                return Object.assign({}, cur);
              }));
              next.forEach(function (defines, idx) {
                return defines[name] = choices[idx];
              });
              return acc.concat(next);
            }, []);
          }, [{}]).forEach(function (defines) {
            return _programLib.programLib.getGFXShader(root.device, shader.name, defines, root.pipeline);
          });
        };

        for (var i = 0; i < this.shaders.length; i++) {
          var _ret = _loop(i);

          if (_ret === "continue") continue;
        }
      }
    }], [{
      key: "register",

      /**
       * @zh
       * 将指定 effect 注册到全局管理器。
       */
      value: function register(asset) {
        effects[asset.name] = asset;
      }
      /**
       * @zh
       * 将指定 effect 从全局管理器移除。
       */

    }, {
      key: "remove",
      value: function remove(name) {
        if (effects[name]) {
          delete effects[name];
          return;
        }

        for (var n in effects) {
          if (effects[n]._uuid === name) {
            delete effects[n];
            return;
          }
        }
      }
      /**
       * @zh
       * 获取指定名字的 effect 资源。
       */

    }, {
      key: "get",
      value: function get(name) {
        if (effects[name]) {
          return effects[name];
        }

        for (var n in effects) {
          if (effects[n]._uuid === name) {
            return effects[n];
          }
        }

        return null;
      }
      /**
       * @zh
       * 获取所有已注册的 effect 资源。
       */

    }, {
      key: "getAll",
      value: function getAll() {
        return effects;
      }
    }]);

    return EffectAsset;
  }(_asset.Asset), _class3._effects = {}, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "techniques", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "shaders", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "combinations", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class);
  _exports.EffectAsset = EffectAsset;
  _globalExports.legacyCC.EffectAsset = EffectAsset;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL2VmZmVjdC1hc3NldC50cyJdLCJuYW1lcyI6WyJlZmZlY3RzIiwiRWZmZWN0QXNzZXQiLCJzaGFkZXJzIiwiZm9yRWFjaCIsInMiLCJwcm9ncmFtTGliIiwiZGVmaW5lIiwiRURJVE9SIiwibGVnYWN5Q0MiLCJnYW1lIiwib25jZSIsIkdhbWUiLCJFVkVOVF9FTkdJTkVfSU5JVEVEIiwiX3ByZWNvbXBpbGUiLCJyZWdpc3RlciIsInJvb3QiLCJkaXJlY3RvciIsImkiLCJzaGFkZXIiLCJjb21iaW5hdGlvbiIsImNvbWJpbmF0aW9ucyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJvdXQiLCJuYW1lIiwiYWNjIiwiY3VyIiwiY2hvaWNlcyIsIm5leHQiLCJjb25jYXQiLCJBcnJheSIsImxlbmd0aCIsIm1hcCIsImFzc2lnbiIsImRlZmluZXMiLCJpZHgiLCJnZXRHRlhTaGFkZXIiLCJkZXZpY2UiLCJwaXBlbGluZSIsImFzc2V0IiwibiIsIl91dWlkIiwiQXNzZXQiLCJfZWZmZWN0cyIsInNlcmlhbGl6YWJsZSIsImVkaXRhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkhBLE1BQU1BLE9BQW9DLEdBQUcsRUFBN0M7QUFFQTs7Ozs7TUFLYUMsVyxXQURaLG9CQUFRLGdCQUFSLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvRUc7Ozs7aUNBSW1CO0FBQ2YsYUFBS0MsT0FBTCxDQUFhQyxPQUFiLENBQXFCLFVBQUNDLENBQUQ7QUFBQSxpQkFBT0MsdUJBQVdDLE1BQVgsQ0FBa0JGLENBQWxCLENBQVA7QUFBQSxTQUFyQjs7QUFDQSxZQUFJLENBQUNHLHdCQUFMLEVBQWE7QUFBRUMsa0NBQVNDLElBQVQsQ0FBY0MsSUFBZCxDQUFtQkYsd0JBQVNHLElBQVQsQ0FBY0MsbUJB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RCxDQUFQLENBQVdDLEtBQVgsS0FBcUJqQixJQUF6QixFQUErQjtBQUMzQixtQkFBT3pCLE9BQU8sQ0FBQ3lDLENBQUQsQ0FBZDtBQUNIO0FBQ0o7O0FBQ0QsZUFBTyxJQUFQO0FBQ0g7QUFFRDs7Ozs7OzsrQkFJd0I7QUFBRSxlQUFPekMsT0FBUDtBQUFpQjs7OztJQXhDZDJDLFksV0F5Q1pDLFEsR0FBd0MsRSxxRkFNeERDLG1CLEVBQ0FDLGU7Ozs7O2FBQ3FDLEU7OzhFQU1yQ0QsbUIsRUFDQUMsZTs7Ozs7YUFDK0IsRTs7bUZBTS9CRCxtQixFQUNBQyxlOzs7OzthQUN3QyxFOzs7O0FBNkI3Q3RDLDBCQUFTUCxXQUFULEdBQXVCQSxXQUF2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgbWF0ZXJpYWxcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBzZXJpYWxpemFibGUsIGVkaXRhYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUm9vdCB9IGZyb20gJy4uLy4uL2NvcmUvcm9vdCc7XHJcbmltcG9ydCB7IEdGWERlc2NyaXB0b3JUeXBlLCBHRlhEeW5hbWljU3RhdGVGbGFncywgR0ZYRm9ybWF0LCBHRlhQcmltaXRpdmVNb2RlLCBHRlhTaGFkZXJTdGFnZUZsYWdzLCBHRlhUeXBlIH0gZnJvbSAnLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWEJsZW5kU3RhdGUsIEdGWERlcHRoU3RlbmNpbFN0YXRlLCBHRlhSYXN0ZXJpemVyU3RhdGUgfSBmcm9tICcuLi9nZngvcGlwZWxpbmUtc3RhdGUnO1xyXG5pbXBvcnQgeyBJR0ZYVW5pZm9ybSB9IGZyb20gJy4uL2dmeC9zaGFkZXInO1xyXG5pbXBvcnQgeyBSZW5kZXJQYXNzU3RhZ2UgfSBmcm9tICcuLi9waXBlbGluZS9kZWZpbmUnO1xyXG5pbXBvcnQgeyBNYWNyb1JlY29yZCB9IGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvcGFzcy11dGlscyc7XHJcbmltcG9ydCB7IHByb2dyYW1MaWIgfSBmcm9tICcuLi9yZW5kZXJlci9jb3JlL3Byb2dyYW0tbGliJztcclxuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuL2Fzc2V0JztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9wZXJ0eUluZm8ge1xyXG4gICAgdHlwZTogbnVtYmVyOyAvLyBhdXRvLWV4dHJhY3RlZCBmcm9tIHNoYWRlclxyXG4gICAgaGFuZGxlSW5mbz86IFtzdHJpbmcsIG51bWJlciwgbnVtYmVyXTsgLy8gYXV0by1nZW5lcmF0ZWQgZnJvbSAndGFyZ2V0J1xyXG4gICAgc2FtcGxlckhhc2g/OiBudW1iZXI7IC8vIGF1dG8tZ2VuZXJhdGVkIGZyb20gJ3NhbXBsZXInXHJcbiAgICB2YWx1ZT86IG51bWJlcltdIHwgc3RyaW5nO1xyXG59XHJcbi8vIFBhc3MgaW5zdGFuY2UgaXRzZWxmIGFyZSBjb21wbGlhbnQgdG8gSVBhc3NTdGF0ZXMgdG9vXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhc3NTdGF0ZXMge1xyXG4gICAgcHJpb3JpdHk/OiBudW1iZXI7XHJcbiAgICBwcmltaXRpdmU/OiBHRlhQcmltaXRpdmVNb2RlO1xyXG4gICAgc3RhZ2U/OiBSZW5kZXJQYXNzU3RhZ2U7XHJcbiAgICByYXN0ZXJpemVyU3RhdGU/OiBHRlhSYXN0ZXJpemVyU3RhdGU7XHJcbiAgICBkZXB0aFN0ZW5jaWxTdGF0ZT86IEdGWERlcHRoU3RlbmNpbFN0YXRlO1xyXG4gICAgYmxlbmRTdGF0ZT86IEdGWEJsZW5kU3RhdGU7XHJcbiAgICBkeW5hbWljU3RhdGVzPzogR0ZYRHluYW1pY1N0YXRlRmxhZ3M7XHJcbiAgICBwaGFzZT86IHN0cmluZyB8IG51bWJlcjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElQYXNzSW5mbyBleHRlbmRzIElQYXNzU3RhdGVzIHtcclxuICAgIHByb2dyYW06IHN0cmluZzsgLy8gYXV0by1nZW5lcmF0ZWQgZnJvbSAndmVydCcgYW5kICdmcmFnJ1xyXG4gICAgZW1iZWRkZWRNYWNyb3M/OiBNYWNyb1JlY29yZDtcclxuICAgIHByb3BlcnR5SW5kZXg/OiBudW1iZXI7XHJcbiAgICBzd2l0Y2g/OiBzdHJpbmc7XHJcbiAgICBwcm9wZXJ0aWVzPzogUmVjb3JkPHN0cmluZywgSVByb3BlcnR5SW5mbz47XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJVGVjaG5pcXVlSW5mbyB7XHJcbiAgICBwYXNzZXM6IElQYXNzSW5mb1tdO1xyXG4gICAgbmFtZT86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQmxvY2tJbmZvIHtcclxuICAgIGJpbmRpbmc6IG51bWJlcjtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIG1lbWJlcnM6IElHRlhVbmlmb3JtW107XHJcbiAgICBjb3VudDogbnVtYmVyO1xyXG4gICAgc3RhZ2VGbGFnczogR0ZYU2hhZGVyU3RhZ2VGbGFncztcclxuICAgIGRlc2NyaXB0b3JUeXBlPzogR0ZYRGVzY3JpcHRvclR5cGU7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJU2FtcGxlckluZm8ge1xyXG4gICAgYmluZGluZzogbnVtYmVyO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdHlwZTogR0ZYVHlwZTtcclxuICAgIGNvdW50OiBudW1iZXI7XHJcbiAgICBzdGFnZUZsYWdzOiBHRlhTaGFkZXJTdGFnZUZsYWdzO1xyXG4gICAgZGVzY3JpcHRvclR5cGU/OiBHRlhEZXNjcmlwdG9yVHlwZTtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElBdHRyaWJ1dGVJbmZvIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGZvcm1hdDogR0ZYRm9ybWF0O1xyXG4gICAgaXNOb3JtYWxpemVkOiBib29sZWFuO1xyXG4gICAgaXNJbnN0YW5jZWQ6IGJvb2xlYW47XHJcbiAgICBsb2NhdGlvbjogbnVtYmVyO1xyXG4gICAgZGVmaW5lczogc3RyaW5nW107XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJRGVmaW5lSW5mbyB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICByYW5nZT86IG51bWJlcltdO1xyXG4gICAgb3B0aW9ucz86IHN0cmluZ1tdO1xyXG4gICAgZGVmYXVsdD86IHN0cmluZztcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElCdWlsdGluIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRlZmluZXM6IHN0cmluZ1tdO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSUJ1aWx0aW5JbmZvIHtcclxuICAgIGJsb2NrczogSUJ1aWx0aW5bXTtcclxuICAgIHNhbXBsZXJzOiBJQnVpbHRpbltdO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNoYWRlckluZm8ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaGFzaDogbnVtYmVyO1xyXG4gICAgZ2xzbDQ6IHsgdmVydDogc3RyaW5nLCBmcmFnOiBzdHJpbmcgfTtcclxuICAgIGdsc2wzOiB7IHZlcnQ6IHN0cmluZywgZnJhZzogc3RyaW5nIH07XHJcbiAgICBnbHNsMTogeyB2ZXJ0OiBzdHJpbmcsIGZyYWc6IHN0cmluZyB9O1xyXG4gICAgYnVpbHRpbnM6IHsgZ2xvYmFsczogSUJ1aWx0aW5JbmZvLCBsb2NhbHM6IElCdWlsdGluSW5mbyB9O1xyXG4gICAgZGVmaW5lczogSURlZmluZUluZm9bXTtcclxuICAgIGJsb2NrczogSUJsb2NrSW5mb1tdO1xyXG4gICAgc2FtcGxlcnM6IElTYW1wbGVySW5mb1tdO1xyXG4gICAgYXR0cmlidXRlczogSUF0dHJpYnV0ZUluZm9bXTtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElQcmVDb21waWxlSW5mbyB7XHJcbiAgICBbbmFtZTogc3RyaW5nXTogYm9vbGVhbltdIHwgbnVtYmVyW10gfCBzdHJpbmdbXTtcclxufVxyXG5cclxuY29uc3QgZWZmZWN0czogUmVjb3JkPHN0cmluZywgRWZmZWN0QXNzZXQ+ID0ge307XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIEVmZmVjdCDotYTmupDvvIzkvZzkuLrmnZDotKjlrp7kvovliJ3lp4vljJbnmoTmqKHmnb/vvIzmr4/kuKogZWZmZWN0IOi1hOa6kOmDveW6lOaYr+WFqOWxgOWUr+S4gOeahOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkVmZmVjdEFzc2V0JylcclxuZXhwb3J0IGNsYXNzIEVmZmVjdEFzc2V0IGV4dGVuZHMgQXNzZXQge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbmjIflrpogZWZmZWN0IOazqOWGjOWIsOWFqOWxgOeuoeeQhuWZqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyIChhc3NldDogRWZmZWN0QXNzZXQpIHsgZWZmZWN0c1thc3NldC5uYW1lXSA9IGFzc2V0OyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWwhuaMh+WumiBlZmZlY3Qg5LuO5YWo5bGA566h55CG5Zmo56e76Zmk44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlIChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoZWZmZWN0c1tuYW1lXSkgeyBkZWxldGUgZWZmZWN0c1tuYW1lXTsgcmV0dXJuOyB9XHJcbiAgICAgICAgZm9yIChjb25zdCBuIGluIGVmZmVjdHMpIHtcclxuICAgICAgICAgICAgaWYgKGVmZmVjdHNbbl0uX3V1aWQgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBlZmZlY3RzW25dO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmjIflrprlkI3lrZfnmoQgZWZmZWN0IOi1hOa6kOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCAobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGVmZmVjdHNbbmFtZV0pIHsgcmV0dXJuIGVmZmVjdHNbbmFtZV07IH1cclxuICAgICAgICBmb3IgKGNvbnN0IG4gaW4gZWZmZWN0cykge1xyXG4gICAgICAgICAgICBpZiAoZWZmZWN0c1tuXS5fdXVpZCA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVmZmVjdHNbbl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaJgOacieW3suazqOWGjOeahCBlZmZlY3Qg6LWE5rqQ44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0QWxsICgpIHsgcmV0dXJuIGVmZmVjdHM7IH1cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgX2VmZmVjdHM6IFJlY29yZDxzdHJpbmcsIEVmZmVjdEFzc2V0PiA9IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPliY0gZWZmZWN0IOeahOaJgOacieWPr+eUqCB0ZWNobmlxdWXjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgdGVjaG5pcXVlczogSVRlY2huaXF1ZUluZm9bXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPliY0gZWZmZWN0IOS9v+eUqOeahOaJgOaciSBzaGFkZXLjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgc2hhZGVyczogSVNoYWRlckluZm9bXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmr4/kuKogc2hhZGVyIOmcgOimgemihOe8luivkeeahOWuj+WumuS5iee7hOWQiOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBjb21iaW5hdGlvbnM6IElQcmVDb21waWxlSW5mb1tdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmAmui/hyBMb2FkZXIg5Yqg6L295a6M5oiQ5pe255qE5Zue6LCD77yM5bCG6Ieq5Yqo5rOo5YaMIGVmZmVjdCDotYTmupDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uTG9hZGVkICgpIHtcclxuICAgICAgICB0aGlzLnNoYWRlcnMuZm9yRWFjaCgocykgPT4gcHJvZ3JhbUxpYi5kZWZpbmUocykpO1xyXG4gICAgICAgIGlmICghRURJVE9SKSB7IGxlZ2FjeUNDLmdhbWUub25jZShsZWdhY3lDQy5HYW1lLkVWRU5UX0VOR0lORV9JTklURUQsIHRoaXMuX3ByZWNvbXBpbGUsIHRoaXMpOyB9XHJcbiAgICAgICAgRWZmZWN0QXNzZXQucmVnaXN0ZXIodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9wcmVjb21waWxlICgpIHtcclxuICAgICAgICBjb25zdCByb290ID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCBhcyBSb290O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuc2hhZGVyc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgY29tYmluYXRpb24gPSB0aGlzLmNvbWJpbmF0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFjb21iaW5hdGlvbikgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhjb21iaW5hdGlvbikucmVkdWNlKChvdXQsIG5hbWUpID0+IG91dC5yZWR1Y2UoKGFjYywgY3VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2VzID0gY29tYmluYXRpb25bbmFtZV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gW2N1cl0uY29uY2F0KFsuLi5BcnJheShjaG9pY2VzLmxlbmd0aCAtIDEpXS5tYXAoKCkgPT4gT2JqZWN0LmFzc2lnbih7fSwgY3VyKSkpO1xyXG4gICAgICAgICAgICAgICAgbmV4dC5mb3JFYWNoKChkZWZpbmVzLCBpZHgpID0+IGRlZmluZXNbbmFtZV0gPSBjaG9pY2VzW2lkeF0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYy5jb25jYXQobmV4dCk7XHJcbiAgICAgICAgICAgIH0sIFtdIGFzIE1hY3JvUmVjb3JkW10pLCBbe31dIGFzIE1hY3JvUmVjb3JkW10pLmZvckVhY2goXHJcbiAgICAgICAgICAgICAgICAoZGVmaW5lcykgPT4gcHJvZ3JhbUxpYi5nZXRHRlhTaGFkZXIocm9vdC5kZXZpY2UsIHNoYWRlci5uYW1lLCBkZWZpbmVzLCByb290LnBpcGVsaW5lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5FZmZlY3RBc3NldCA9IEVmZmVjdEFzc2V0O1xyXG4iXX0=