(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/value-types/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/value-types/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index);
    global.gradient = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.AlphaKey = _exports.ColorKey = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _temp, _dec2, _class4, _class5, _descriptor3, _descriptor4, _temp2, _dec3, _class7, _class8, _descriptor5, _descriptor6, _descriptor7, _class9, _temp3;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  // tslint:disable: max-line-length
  var Mode = (0, _index3.Enum)({
    Blend: 0,
    Fixed: 1
  });
  var ColorKey = (_dec = (0, _index.ccclass)('cc.ColorKey'), _dec(_class = (_class2 = (_temp = function ColorKey() {
    _classCallCheck(this, ColorKey);

    _initializerDefineProperty(this, "color", _descriptor, this);

    _initializerDefineProperty(this, "time", _descriptor2, this);
  }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "color", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index2.Color.WHITE.clone();
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "time", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class); // CCClass.fastDefine('cc.ColorKey', ColorKey, {
  //     color: cc.Color.WHITE.clone(),
  //     time: 0
  // });

  _exports.ColorKey = ColorKey;
  var AlphaKey = (_dec2 = (0, _index.ccclass)('cc.AlphaKey'), _dec2(_class4 = (_class5 = (_temp2 = function AlphaKey() {
    _classCallCheck(this, AlphaKey);

    _initializerDefineProperty(this, "alpha", _descriptor3, this);

    _initializerDefineProperty(this, "time", _descriptor4, this);
  }, _temp2), (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "alpha", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "time", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class5)) || _class4); // CCClass.fastDefine('cc.AlphaKey', AlphaKey, {
  //     alpha: 1,
  //     time: 0
  // });

  _exports.AlphaKey = AlphaKey;
  var Gradient = (_dec3 = (0, _index.ccclass)('cc.Gradient'), _dec3(_class7 = (_class8 = (_temp3 = _class9 = /*#__PURE__*/function () {
    function Gradient() {
      _classCallCheck(this, Gradient);

      _initializerDefineProperty(this, "colorKeys", _descriptor5, this);

      _initializerDefineProperty(this, "alphaKeys", _descriptor6, this);

      _initializerDefineProperty(this, "mode", _descriptor7, this);

      this._color = void 0;
      this._color = _index2.Color.WHITE.clone();
    }

    _createClass(Gradient, [{
      key: "setKeys",
      value: function setKeys(colorKeys, alphaKeys) {
        this.colorKeys = colorKeys;
        this.alphaKeys = alphaKeys;
      }
    }, {
      key: "sortKeys",
      value: function sortKeys() {
        if (this.colorKeys.length > 1) {
          this.colorKeys.sort(function (a, b) {
            return a.time - b.time;
          });
        }

        if (this.alphaKeys.length > 1) {
          this.alphaKeys.sort(function (a, b) {
            return a.time - b.time;
          });
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate(time) {
        this.getRGB(time);

        this._color._set_a_unsafe(this.getAlpha(time));

        return this._color;
      }
    }, {
      key: "randomColor",
      value: function randomColor() {
        var c = this.colorKeys[Math.trunc(Math.random() * this.colorKeys.length)];
        var a = this.alphaKeys[Math.trunc(Math.random() * this.alphaKeys.length)];

        this._color.set(c.color);

        this._color._set_a_unsafe(a.alpha);

        return this._color;
      }
    }, {
      key: "getRGB",
      value: function getRGB(time) {
        if (this.colorKeys.length > 1) {
          time = (0, _index2.repeat)(time, 1);

          for (var i = 1; i < this.colorKeys.length; ++i) {
            var preTime = this.colorKeys[i - 1].time;
            var curTime = this.colorKeys[i].time;

            if (time >= preTime && time < curTime) {
              if (this.mode === Mode.Fixed) {
                return this.colorKeys[i].color;
              }

              var factor = (time - preTime) / (curTime - preTime);

              _index2.Color.lerp(this._color, this.colorKeys[i - 1].color, this.colorKeys[i].color, factor);

              return this._color;
            }
          }

          var lastIndex = this.colorKeys.length - 1;

          if (time < this.colorKeys[0].time) {
            _index2.Color.lerp(this._color, _index2.Color.BLACK, this.colorKeys[0].color, time / this.colorKeys[0].time);
          } else if (time > this.colorKeys[lastIndex].time) {
            _index2.Color.lerp(this._color, this.colorKeys[lastIndex].color, _index2.Color.BLACK, (time - this.colorKeys[lastIndex].time) / (1 - this.colorKeys[lastIndex].time));
          } // console.warn('something went wrong. can not get gradient color.');

        } else if (this.colorKeys.length === 1) {
          this._color.set(this.colorKeys[0].color);

          return this._color;
        } else {
          this._color.set(_index2.Color.WHITE);

          return this._color;
        }
      }
    }, {
      key: "getAlpha",
      value: function getAlpha(time) {
        if (this.alphaKeys.length > 1) {
          time = (0, _index2.repeat)(time, 1);

          for (var i = 1; i < this.alphaKeys.length; ++i) {
            var preTime = this.alphaKeys[i - 1].time;
            var curTime = this.alphaKeys[i].time;

            if (time >= preTime && time < curTime) {
              if (this.mode === Mode.Fixed) {
                return this.alphaKeys[i].alpha;
              }

              var factor = (time - preTime) / (curTime - preTime);
              return (0, _index2.lerp)(this.alphaKeys[i - 1].alpha, this.alphaKeys[i].alpha, factor);
            }
          }

          var lastIndex = this.alphaKeys.length - 1;

          if (time < this.alphaKeys[0].time) {
            return (0, _index2.lerp)(255, this.alphaKeys[0].alpha, time / this.alphaKeys[0].time);
          } else if (time > this.alphaKeys[lastIndex].time) {
            return (0, _index2.lerp)(this.alphaKeys[lastIndex].alpha, 255, (time - this.alphaKeys[lastIndex].time) / (1 - this.alphaKeys[lastIndex].time));
          }
        } else if (this.alphaKeys.length === 1) {
          return this.alphaKeys[0].alpha;
        } else {
          return 255;
        }
      }
    }]);

    return Gradient;
  }(), _class9.Mode = Mode, _temp3), (_descriptor5 = _applyDecoratedDescriptor(_class8.prototype, "colorKeys", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new Array();
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class8.prototype, "alphaKeys", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new Array();
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class8.prototype, "mode", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Mode.Blend;
    }
  })), _class8)) || _class7); // CCClass.fastDefine('cc.Gradient', Gradient, {
  //     mode: Mode.Blend,
  //     colorKeys: [],
  //     alphaKeys: []
  // });

  _exports.default = Gradient;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL2dyYWRpZW50LnRzIl0sIm5hbWVzIjpbIk1vZGUiLCJCbGVuZCIsIkZpeGVkIiwiQ29sb3JLZXkiLCJzZXJpYWxpemFibGUiLCJlZGl0YWJsZSIsIkNvbG9yIiwiV0hJVEUiLCJjbG9uZSIsIkFscGhhS2V5IiwiR3JhZGllbnQiLCJfY29sb3IiLCJjb2xvcktleXMiLCJhbHBoYUtleXMiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJ0aW1lIiwiZ2V0UkdCIiwiX3NldF9hX3Vuc2FmZSIsImdldEFscGhhIiwiYyIsIk1hdGgiLCJ0cnVuYyIsInJhbmRvbSIsInNldCIsImNvbG9yIiwiYWxwaGEiLCJpIiwicHJlVGltZSIsImN1clRpbWUiLCJtb2RlIiwiZmFjdG9yIiwibGVycCIsImxhc3RJbmRleCIsIkJMQUNLIiwiQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQTtBQUVBLE1BQU1BLElBQUksR0FBRyxrQkFBSztBQUNkQyxJQUFBQSxLQUFLLEVBQUUsQ0FETztBQUVkQyxJQUFBQSxLQUFLLEVBQUU7QUFGTyxHQUFMLENBQWI7TUFNYUMsUSxXQURaLG9CQUFRLGFBQVIsQzs7Ozs7O21GQUdJQyxtQixFQUNBQyxlOzs7OzthQUNjQyxjQUFNQyxLQUFOLENBQVlDLEtBQVosRTs7MkVBRWRKLG1CLEVBQ0FDLGU7Ozs7O2FBQ2EsQzs7NkJBR2xCO0FBQ0E7QUFDQTtBQUNBOzs7TUFHYUksUSxZQURaLG9CQUFRLGFBQVIsQzs7Ozs7O3FGQUdJTCxtQixFQUNBQyxlOzs7OzthQUNjLEM7OzJFQUVkRCxtQixFQUNBQyxlOzs7OzthQUNhLEM7OzhCQUdsQjtBQUNBO0FBQ0E7QUFDQTs7O01BR3FCSyxRLFlBRHBCLG9CQUFRLGFBQVIsQztBQW1CRyx3QkFBZTtBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLFdBRlBD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QUtMLFNBQUwsQ0FBZXNCLFNBQWYsRUFBMEJqQixJQUFyQyxFQUEyQztBQUM5QyxtQkFBTyxrQkFBSyxLQUFLTCxTQUFMLENBQWVzQixTQUFmLEVBQTBCUCxLQUEvQixFQUFzQyxHQUF0QyxFQUEyQyxDQUFDVixJQUFJLEdBQUcsS0FBS0wsU0FBTCxDQUFlc0IsU0FBZixFQUEwQmpCLElBQWxDLEtBQTJDLElBQUksS0FBS0wsU0FBTCxDQUFlc0IsU0FBZixFQUEwQmpCLElBQXpFLENBQTNDLENBQVA7QUFDSDtBQUNKLFNBbkJELE1BbUJPLElBQUksS0FBS0wsU0FBTCxDQUFlQyxNQUFmLEtBQTBCLENBQTlCLEVBQWlDO0FBQ3BDLGlCQUFPLEtBQUtELFNBQUwsQ0FBZSxDQUFmLEVBQWtCZSxLQUF6QjtBQUNILFNBRk0sTUFFQTtBQUNILGlCQUFPLEdBQVA7QUFDSDtBQUNKOzs7O2VBeEdhNUIsSSxHQUFPQSxJLHNGQUVwQkksbUIsRUFDQUMsZTs7Ozs7YUFDa0IsSUFBSWdDLEtBQUosRTs7Z0ZBRWxCakMsbUIsRUFDQUMsZTs7Ozs7YUFDa0IsSUFBSWdDLEtBQUosRTs7MkVBRWxCakMsbUIsRUFDQUMsZTs7Ozs7YUFDYUwsSUFBSSxDQUFDQyxLOzs4QkErRnZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb2xvciwgbGVycCwgcmVwZWF0IH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xyXG5cclxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxyXG5cclxuY29uc3QgTW9kZSA9IEVudW0oe1xyXG4gICAgQmxlbmQ6IDAsXHJcbiAgICBGaXhlZDogMSxcclxufSk7XHJcblxyXG5AY2NjbGFzcygnY2MuQ29sb3JLZXknKVxyXG5leHBvcnQgY2xhc3MgQ29sb3JLZXkge1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIGNvbG9yID0gQ29sb3IuV0hJVEUuY2xvbmUoKTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyB0aW1lID0gMDtcclxufVxyXG5cclxuLy8gQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5Db2xvcktleScsIENvbG9yS2V5LCB7XHJcbi8vICAgICBjb2xvcjogY2MuQ29sb3IuV0hJVEUuY2xvbmUoKSxcclxuLy8gICAgIHRpbWU6IDBcclxuLy8gfSk7XHJcblxyXG5AY2NjbGFzcygnY2MuQWxwaGFLZXknKVxyXG5leHBvcnQgY2xhc3MgQWxwaGFLZXkge1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIGFscGhhID0gMTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyB0aW1lID0gMDtcclxufVxyXG5cclxuLy8gQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5BbHBoYUtleScsIEFscGhhS2V5LCB7XHJcbi8vICAgICBhbHBoYTogMSxcclxuLy8gICAgIHRpbWU6IDBcclxuLy8gfSk7XHJcblxyXG5AY2NjbGFzcygnY2MuR3JhZGllbnQnKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFkaWVudCB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBNb2RlID0gTW9kZTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBjb2xvcktleXMgPSBuZXcgQXJyYXk8Q29sb3JLZXk+KCk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgYWxwaGFLZXlzID0gbmV3IEFycmF5PEFscGhhS2V5PigpO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIG1vZGUgPSBNb2RlLkJsZW5kO1xyXG5cclxuICAgIHByaXZhdGUgX2NvbG9yOiBDb2xvcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5fY29sb3IgPSBDb2xvci5XSElURS5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRLZXlzIChjb2xvcktleXM6IENvbG9yS2V5W10sIGFscGhhS2V5czogQWxwaGFLZXlbXSkge1xyXG4gICAgICAgIHRoaXMuY29sb3JLZXlzID0gY29sb3JLZXlzO1xyXG4gICAgICAgIHRoaXMuYWxwaGFLZXlzID0gYWxwaGFLZXlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzb3J0S2V5cyAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29sb3JLZXlzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xvcktleXMuc29ydCgoYSwgYikgPT4gYS50aW1lIC0gYi50aW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYWxwaGFLZXlzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5hbHBoYUtleXMuc29ydCgoYSwgYikgPT4gYS50aW1lIC0gYi50aW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGV2YWx1YXRlICh0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmdldFJHQih0aW1lKTtcclxuICAgICAgICB0aGlzLl9jb2xvci5fc2V0X2FfdW5zYWZlKHRoaXMuZ2V0QWxwaGEodGltZSkhKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJhbmRvbUNvbG9yICgpIHtcclxuICAgICAgICBjb25zdCBjID0gdGhpcy5jb2xvcktleXNbTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogdGhpcy5jb2xvcktleXMubGVuZ3RoKV07XHJcbiAgICAgICAgY29uc3QgYSA9IHRoaXMuYWxwaGFLZXlzW01hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIHRoaXMuYWxwaGFLZXlzLmxlbmd0aCldO1xyXG4gICAgICAgIHRoaXMuX2NvbG9yLnNldChjLmNvbG9yKTtcclxuICAgICAgICB0aGlzLl9jb2xvci5fc2V0X2FfdW5zYWZlKGEuYWxwaGEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFJHQiAodGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29sb3JLZXlzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdGltZSA9IHJlcGVhdCh0aW1lLCAxKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmNvbG9yS2V5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJlVGltZSA9IHRoaXMuY29sb3JLZXlzW2kgLSAxXS50aW1lO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VyVGltZSA9IHRoaXMuY29sb3JLZXlzW2ldLnRpbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGltZSA+PSBwcmVUaW1lICYmIHRpbWUgPCBjdXJUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gTW9kZS5GaXhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb2xvcktleXNbaV0uY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY3RvciA9ICh0aW1lIC0gcHJlVGltZSkgLyAoY3VyVGltZSAtIHByZVRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIENvbG9yLmxlcnAodGhpcy5fY29sb3IsIHRoaXMuY29sb3JLZXlzW2kgLSAxXS5jb2xvciwgdGhpcy5jb2xvcktleXNbaV0uY29sb3IsIGZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RJbmRleCA9IHRoaXMuY29sb3JLZXlzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIGlmICh0aW1lIDwgdGhpcy5jb2xvcktleXNbMF0udGltZSkge1xyXG4gICAgICAgICAgICAgICAgQ29sb3IubGVycCh0aGlzLl9jb2xvciwgQ29sb3IuQkxBQ0ssIHRoaXMuY29sb3JLZXlzWzBdLmNvbG9yLCB0aW1lIC8gdGhpcy5jb2xvcktleXNbMF0udGltZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGltZSA+IHRoaXMuY29sb3JLZXlzW2xhc3RJbmRleF0udGltZSkge1xyXG4gICAgICAgICAgICAgICAgQ29sb3IubGVycCh0aGlzLl9jb2xvciwgdGhpcy5jb2xvcktleXNbbGFzdEluZGV4XS5jb2xvciwgQ29sb3IuQkxBQ0ssICh0aW1lIC0gdGhpcy5jb2xvcktleXNbbGFzdEluZGV4XS50aW1lKSAvICgxIC0gdGhpcy5jb2xvcktleXNbbGFzdEluZGV4XS50aW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc29sZS53YXJuKCdzb21ldGhpbmcgd2VudCB3cm9uZy4gY2FuIG5vdCBnZXQgZ3JhZGllbnQgY29sb3IuJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbG9yS2V5cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29sb3Iuc2V0KHRoaXMuY29sb3JLZXlzWzBdLmNvbG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yLnNldChDb2xvci5XSElURSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRBbHBoYSAodGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWxwaGFLZXlzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdGltZSA9IHJlcGVhdCh0aW1lLCAxKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmFscGhhS2V5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJlVGltZSA9IHRoaXMuYWxwaGFLZXlzW2kgLSAxXS50aW1lO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VyVGltZSA9IHRoaXMuYWxwaGFLZXlzW2ldLnRpbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGltZSA+PSBwcmVUaW1lICYmIHRpbWUgPCBjdXJUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gTW9kZS5GaXhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hbHBoYUtleXNbaV0uYWxwaGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY3RvciA9ICh0aW1lIC0gcHJlVGltZSkgLyAoY3VyVGltZSAtIHByZVRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZXJwKHRoaXMuYWxwaGFLZXlzW2kgLSAxXS5hbHBoYSAsIHRoaXMuYWxwaGFLZXlzW2ldLmFscGhhICwgZmFjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBsYXN0SW5kZXggPSB0aGlzLmFscGhhS2V5cy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICBpZiAodGltZSA8IHRoaXMuYWxwaGFLZXlzWzBdLnRpbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsZXJwKDI1NSwgdGhpcy5hbHBoYUtleXNbMF0uYWxwaGEsIHRpbWUgLyB0aGlzLmFscGhhS2V5c1swXS50aW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aW1lID4gdGhpcy5hbHBoYUtleXNbbGFzdEluZGV4XS50aW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVycCh0aGlzLmFscGhhS2V5c1tsYXN0SW5kZXhdLmFscGhhLCAyNTUsICh0aW1lIC0gdGhpcy5hbHBoYUtleXNbbGFzdEluZGV4XS50aW1lKSAvICgxIC0gdGhpcy5hbHBoYUtleXNbbGFzdEluZGV4XS50aW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWxwaGFLZXlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hbHBoYUtleXNbMF0uYWxwaGE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDI1NTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENDQ2xhc3MuZmFzdERlZmluZSgnY2MuR3JhZGllbnQnLCBHcmFkaWVudCwge1xyXG4vLyAgICAgbW9kZTogTW9kZS5CbGVuZCxcclxuLy8gICAgIGNvbG9yS2V5czogW10sXHJcbi8vICAgICBhbHBoYUtleXM6IFtdXHJcbi8vIH0pO1xyXG4iXX0=