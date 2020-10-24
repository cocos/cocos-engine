(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../data/utils/attribute.js", "../math/index.js", "../utils/murmurhash2_gc.js", "./asset.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../data/utils/attribute.js"), require("../math/index.js"), require("../utils/murmurhash2_gc.js"), require("./asset.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.attribute, global.index, global.murmurhash2_gc, global.asset, global.globalExports);
    global.skeleton = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _attribute, _index2, _murmurhash2_gc, _asset, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Skeleton = void 0;

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @zh 骨骼资源。
   * 骨骼资源记录了每个关节（相对于 [[SkinnedMeshRenderer.skinningRoot]]）的路径以及它的绑定姿势矩阵。
   */
  var Skeleton = (_dec = (0, _index.ccclass)('cc.Skeleton'), _dec2 = (0, _index.type)([_attribute.CCString]), _dec3 = (0, _index.type)([_index2.Mat4]), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(Skeleton, _Asset);

    function Skeleton() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Skeleton);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Skeleton)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_joints", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_bindposes", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_hash", _descriptor3, _assertThisInitialized(_this));

      _this._invBindposes = null;
      return _this;
    }

    _createClass(Skeleton, [{
      key: "destroy",
      value: function destroy() {
        _globalExports.legacyCC.director.root.dataPoolManager.releaseSkeleton(this);

        return _get(_getPrototypeOf(Skeleton.prototype), "destroy", this).call(this);
      }
    }, {
      key: "joints",

      /**
       * 所有关节的路径。该数组的长度始终与 `this.bindposes` 的长度相同。
       */
      get: function get() {
        return this._joints;
      },
      set: function set(value) {
        this._joints = value;
      }
      /**
       * 所有关节的绑定姿势矩阵。该数组的长度始终与 `this.joints` 的长度相同。
       */

    }, {
      key: "bindposes",
      get: function get() {
        return this._bindposes;
      },
      set: function set(value) {
        this._bindposes = value;
      }
    }, {
      key: "inverseBindposes",
      get: function get() {
        if (!this._invBindposes) {
          this._invBindposes = [];

          for (var i = 0; i < this._bindposes.length; i++) {
            var inv = new _index2.Mat4();

            _index2.Mat4.invert(inv, this._bindposes[i]);

            this._invBindposes.push(inv);
          }
        }

        return this._invBindposes;
      }
    }, {
      key: "hash",
      get: function get() {
        // hashes should already be computed offline, but if not, make one
        if (!this._hash) {
          var str = '';

          for (var i = 0; i < this._bindposes.length; i++) {
            var ibm = this._bindposes[i];
            str += ibm.m00.toPrecision(2) + ' ' + ibm.m01.toPrecision(2) + ' ' + ibm.m02.toPrecision(2) + ' ' + ibm.m03.toPrecision(2) + ' ' + ibm.m04.toPrecision(2) + ' ' + ibm.m05.toPrecision(2) + ' ' + ibm.m06.toPrecision(2) + ' ' + ibm.m07.toPrecision(2) + ' ' + ibm.m08.toPrecision(2) + ' ' + ibm.m09.toPrecision(2) + ' ' + ibm.m10.toPrecision(2) + ' ' + ibm.m11.toPrecision(2) + ' ' + ibm.m12.toPrecision(2) + ' ' + ibm.m13.toPrecision(2) + ' ' + ibm.m14.toPrecision(2) + ' ' + ibm.m15.toPrecision(2) + '\n';
          }

          this._hash = (0, _murmurhash2_gc.murmurhash2_32_gc)(str, 666);
        }

        return this._hash;
      }
    }]);

    return Skeleton;
  }(_asset.Asset), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_joints", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_bindposes", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_hash", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class);
  _exports.Skeleton = Skeleton;
  _globalExports.legacyCC.Skeleton = Skeleton;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3NrZWxldG9uLnRzIl0sIm5hbWVzIjpbIlNrZWxldG9uIiwiQ0NTdHJpbmciLCJNYXQ0IiwiX2ludkJpbmRwb3NlcyIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJyb290IiwiZGF0YVBvb2xNYW5hZ2VyIiwicmVsZWFzZVNrZWxldG9uIiwiX2pvaW50cyIsInZhbHVlIiwiX2JpbmRwb3NlcyIsImkiLCJsZW5ndGgiLCJpbnYiLCJpbnZlcnQiLCJwdXNoIiwiX2hhc2giLCJzdHIiLCJpYm0iLCJtMDAiLCJ0b1ByZWNpc2lvbiIsIm0wMSIsIm0wMiIsIm0wMyIsIm0wNCIsIm0wNSIsIm0wNiIsIm0wNyIsIm0wOCIsIm0wOSIsIm0xMCIsIm0xMSIsIm0xMiIsIm0xMyIsIm0xNCIsIm0xNSIsIkFzc2V0Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFDQTs7OztNQUthQSxRLFdBRFosb0JBQVEsYUFBUixDLFVBR0ksaUJBQUssQ0FBQ0MsbUJBQUQsQ0FBTCxDLFVBR0EsaUJBQUssQ0FBQ0MsWUFBRCxDQUFMLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFNT0MsYSxHQUErQixJOzs7Ozs7Z0NBcURyQjtBQUNiQyxnQ0FBU0MsUUFBVCxDQUFrQkMsSUFBbEIsQ0FBdUJDLGVBQXhCLENBQTREQyxlQUE1RCxDQUE0RSxJQUE1RTs7QUFDQTtBQUNIOzs7O0FBdEREOzs7MEJBR2M7QUFDVixlQUFPLEtBQUtDLE9BQVo7QUFDSCxPO3dCQUVXQyxLLEVBQU87QUFDZixhQUFLRCxPQUFMLEdBQWVDLEtBQWY7QUFDSDtBQUVEOzs7Ozs7MEJBR2lCO0FBQ2IsZUFBTyxLQUFLQyxVQUFaO0FBQ0gsTzt3QkFFY0QsSyxFQUFPO0FBQ2xCLGFBQUtDLFVBQUwsR0FBa0JELEtBQWxCO0FBQ0g7OzswQkFF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bnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBhc3NldFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENDU3RyaW5nIH0gZnJvbSAnLi4vLi4vY29yZS9kYXRhL3V0aWxzL2F0dHJpYnV0ZSc7XHJcbmltcG9ydCB7IE1hdDQgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBtdXJtdXJoYXNoMl8zMl9nYyB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMvbXVybXVyaGFzaDJfZ2MnO1xyXG5pbXBvcnQgeyBEYXRhUG9vbE1hbmFnZXIgfSBmcm9tICcuLi9yZW5kZXJlci9kYXRhLXBvb2wtbWFuYWdlcic7XHJcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnLi9hc3NldCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIEB6aCDpqqjpqrzotYTmupDjgIJcclxuICog6aqo6aq86LWE5rqQ6K6w5b2V5LqG5q+P5Liq5YWz6IqC77yI55u45a+55LqOIFtbU2tpbm5lZE1lc2hSZW5kZXJlci5za2lubmluZ1Jvb3RdXe+8ieeahOi3r+W+hOS7peWPiuWug+eahOe7keWumuWnv+WKv+efqemYteOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlNrZWxldG9uJylcclxuZXhwb3J0IGNsYXNzIFNrZWxldG9uIGV4dGVuZHMgQXNzZXQge1xyXG5cclxuICAgIEB0eXBlKFtDQ1N0cmluZ10pXHJcbiAgICBwcml2YXRlIF9qb2ludHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgQHR5cGUoW01hdDRdKVxyXG4gICAgcHJpdmF0ZSBfYmluZHBvc2VzOiBNYXQ0W10gPSBbXTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9oYXNoID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9pbnZCaW5kcG9zZXM6IE1hdDRbXSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omA5pyJ5YWz6IqC55qE6Lev5b6E44CC6K+l5pWw57uE55qE6ZW/5bqm5aeL57uI5LiOIGB0aGlzLmJpbmRwb3Nlc2Ag55qE6ZW/5bqm55u45ZCM44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBqb2ludHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9qb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGpvaW50cyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9qb2ludHMgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJgOacieWFs+iKgueahOe7keWumuWnv+WKv+efqemYteOAguivpeaVsOe7hOeahOmVv+W6puWni+e7iOS4jiBgdGhpcy5qb2ludHNgIOeahOmVv+W6puebuOWQjOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgYmluZHBvc2VzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmluZHBvc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBiaW5kcG9zZXMgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fYmluZHBvc2VzID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGludmVyc2VCaW5kcG9zZXMgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faW52QmluZHBvc2VzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ludkJpbmRwb3NlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2JpbmRwb3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW52ID0gbmV3IE1hdDQoKTtcclxuICAgICAgICAgICAgICAgIE1hdDQuaW52ZXJ0KGludiwgdGhpcy5fYmluZHBvc2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ludkJpbmRwb3Nlcy5wdXNoKGludik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludkJpbmRwb3NlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGFzaCAoKSB7XHJcbiAgICAgICAgLy8gaGFzaGVzIHNob3VsZCBhbHJlYWR5IGJlIGNvbXB1dGVkIG9mZmxpbmUsIGJ1dCBpZiBub3QsIG1ha2Ugb25lXHJcbiAgICAgICAgaWYgKCF0aGlzLl9oYXNoKSB7XHJcbiAgICAgICAgICAgIGxldCBzdHIgPSAnJztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9iaW5kcG9zZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlibSA9IHRoaXMuX2JpbmRwb3Nlc1tpXTtcclxuICAgICAgICAgICAgICAgIHN0ciArPVxyXG4gICAgICAgICAgICAgICAgICAgIGlibS5tMDAudG9QcmVjaXNpb24oMikgKyAnICcgKyBpYm0ubTAxLnRvUHJlY2lzaW9uKDIpICsgJyAnICsgaWJtLm0wMi50b1ByZWNpc2lvbigyKSArICcgJyArIGlibS5tMDMudG9QcmVjaXNpb24oMikgKyAnICcgK1xyXG4gICAgICAgICAgICAgICAgICAgIGlibS5tMDQudG9QcmVjaXNpb24oMikgKyAnICcgKyBpYm0ubTA1LnRvUHJlY2lzaW9uKDIpICsgJyAnICsgaWJtLm0wNi50b1ByZWNpc2lvbigyKSArICcgJyArIGlibS5tMDcudG9QcmVjaXNpb24oMikgKyAnICcgK1xyXG4gICAgICAgICAgICAgICAgICAgIGlibS5tMDgudG9QcmVjaXNpb24oMikgKyAnICcgKyBpYm0ubTA5LnRvUHJlY2lzaW9uKDIpICsgJyAnICsgaWJtLm0xMC50b1ByZWNpc2lvbigyKSArICcgJyArIGlibS5tMTEudG9QcmVjaXNpb24oMikgKyAnICcgK1xyXG4gICAgICAgICAgICAgICAgICAgIGlibS5tMTIudG9QcmVjaXNpb24oMikgKyAnICcgKyBpYm0ubTEzLnRvUHJlY2lzaW9uKDIpICsgJyAnICsgaWJtLm0xNC50b1ByZWNpc2lvbigyKSArICcgJyArIGlibS5tMTUudG9QcmVjaXNpb24oMikgKyAnXFxuJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9oYXNoID0gbXVybXVyaGFzaDJfMzJfZ2Moc3RyLCA2NjYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5faGFzaDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgKGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuZGF0YVBvb2xNYW5hZ2VyIGFzIERhdGFQb29sTWFuYWdlcikucmVsZWFzZVNrZWxldG9uKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLlNrZWxldG9uID0gU2tlbGV0b247XHJcbiJdfQ==