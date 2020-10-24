(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../utils/js.js", "./asset.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../utils/js.js"), require("./asset.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.js, global.asset, global.globalExports);
    global.spriteAtlas = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, js, _asset, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SpriteAtlas = void 0;
  js = _interopRequireWildcard(js);

  var _dec, _class, _class2, _descriptor, _temp;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

  /**
   * @en
   * Class for sprite atlas handling.
   *
   * @zh
   * 精灵图集资源类。
   */
  var SpriteAtlas = (_dec = (0, _index.ccclass)('cc.SpriteAtlas'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(SpriteAtlas, _Asset);

    function SpriteAtlas() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, SpriteAtlas);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SpriteAtlas)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "spriteFrames", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(SpriteAtlas, [{
      key: "getTexture",

      /**
       * @zh
       * 获取精灵图集的贴图。请注意，由于结构调整优化，在 v1.1 版本之前，此函数的返回值为 imageAsset，在 v1.1 版本之后修正为 texture，想要获取 imageAsset 可使用 getTexture().image 获取
       *
       * @returns - 精灵贴图。
       */
      value: function getTexture() {
        var keys = Object.keys(this.spriteFrames);

        if (keys.length > 0) {
          var spriteFrame = this.spriteFrames[keys[0]];
          return spriteFrame && spriteFrame.texture;
        } else {
          return null;
        }
      }
      /**
       * @zh
       * 根据键值获取精灵。
       *
       * @param key - 精灵名。
       * @returns - 精灵。
       */

    }, {
      key: "getSpriteFrame",
      value: function getSpriteFrame(key) {
        var sf = this.spriteFrames[key];

        if (!sf) {
          return null;
        }

        if (!sf.name) {
          sf.name = key;
        }

        return sf;
      }
      /**
       * @zh
       * 获取精灵图集所有精灵。
       *
       * @returns - 返回所有精灵。
       */

    }, {
      key: "getSpriteFrames",
      value: function getSpriteFrames() {
        var frames = [];
        var spriteFrames = this.spriteFrames;

        for (var _i = 0, _Object$keys = Object.keys(spriteFrames); _i < _Object$keys.length; _i++) {
          var _key2 = _Object$keys[_i];
          frames.push(spriteFrames[_key2]);
        }

        return frames;
      }
    }, {
      key: "_serialize",
      value: function _serialize(exporting) {
        var frames = [];

        for (var _i2 = 0, _Object$keys2 = Object.keys(this.spriteFrames); _i2 < _Object$keys2.length; _i2++) {
          var _key3 = _Object$keys2[_i2];
          var spriteFrame = this.spriteFrames[_key3];
          var id = spriteFrame ? spriteFrame._uuid : '';

          if (id && exporting) {
            id = EditorExtends.UuidUtils.compressUuid(id, true);
          }

          frames.push(_key3);
          frames.push(id);
        }

        return {
          name: this._name,
          spriteFrames: frames
        };
      }
    }, {
      key: "_deserialize",
      value: function _deserialize(serializeData, handle) {
        var data = serializeData;
        this._name = data.name;
        var frames = data.spriteFrames;
        this.spriteFrames = js.createMap();

        for (var i = 0; i < frames.length; i += 2) {
          handle.result.push(this.spriteFrames, frames[i], frames[i + 1]);
        }
      }
    }]);

    return SpriteAtlas;
  }(_asset.Asset), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spriteFrames", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return js.createMap();
    }
  })), _class2)) || _class);
  _exports.SpriteAtlas = SpriteAtlas;
  _globalExports.legacyCC.SpriteAtlas = SpriteAtlas;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3Nwcml0ZS1hdGxhcy50cyJdLCJuYW1lcyI6WyJTcHJpdGVBdGxhcyIsImtleXMiLCJPYmplY3QiLCJzcHJpdGVGcmFtZXMiLCJsZW5ndGgiLCJzcHJpdGVGcmFtZSIsInRleHR1cmUiLCJrZXkiLCJzZiIsIm5hbWUiLCJmcmFtZXMiLCJwdXNoIiwiZXhwb3J0aW5nIiwiaWQiLCJfdXVpZCIsIkVkaXRvckV4dGVuZHMiLCJVdWlkVXRpbHMiLCJjb21wcmVzc1V1aWQiLCJfbmFtZSIsInNlcmlhbGl6ZURhdGEiLCJoYW5kbGUiLCJkYXRhIiwianMiLCJjcmVhdGVNYXAiLCJpIiwicmVzdWx0IiwiQXNzZXQiLCJzZXJpYWxpemFibGUiLCJlZGl0YWJsZSIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2Q0E7Ozs7Ozs7TUFRYUEsVyxXQURaLG9CQUFRLGdCQUFSLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1HOzs7Ozs7bUNBTXFCO0FBQ2pCLFlBQU1DLElBQUksR0FBR0MsTUFBTSxDQUFDRCxJQUFQLENBQVksS0FBS0UsWUFBakIsQ0FBYjs7QUFDQSxZQUFJRixJQUFJLENBQUNHLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNqQixjQUFNQyxXQUFXLEdBQUcsS0FBS0YsWUFBTCxDQUFrQkYsSUFBSSxDQUFDLENBQUQsQ0FBdEIsQ0FBcEI7QUFDQSxpQkFBT0ksV0FBVyxJQUFJQSxXQUFXLENBQUNDLE9BQWxDO0FBQ0gsU0FIRCxNQUlLO0FBQ0QsaUJBQU8sSUFBUDtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OztxQ0FPdUJDLEcsRUFBYTtBQUNoQyxZQUFNQyxFQUFFLEdBQUcsS0FBS0wsWUFBTCxDQUFrQkksR0FBbEIsQ0FBWDs7QUFDQSxZQUFJLENBQUNDLEVBQUwsRUFBUztBQUNMLGlCQUFPLElBQVA7QUFDSDs7QUFDRCxZQUFJLENBQUNBLEVBQUUsQ0FBQ0MsSUFBUixFQUFjO0FBQ1ZELFVBQUFBLEVBQUUsQ0FBQ0MsSUFBSCxHQUFVRixHQUFWO0FBQ0g7O0FBQ0QsZUFBT0MsRUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozt3Q0FNMEI7QUFDdEIsWUFBTUUsTUFBaUMsR0FBRyxFQUExQztBQUNBLFlBQU1QLFlBQVksR0FBRyxLQUFLQSxZQUExQjs7QUFFQSx3Q0FBa0JELE1BQU0sQ0FBQ0QsSUFBUCxDQUFZRSxZQUFaLENBQWxCLGtDQUE2QztBQUF4QyxjQUFNSSxLQUFHLG1CQUFUO0FBQ0RHLFVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZUixZQUFZLENBQUNJLEtBQUQsQ0FBeEI7QUFDSDs7QUFFRCxlQUFPRyxNQUFQO0FBQ0g7OztpQ0FFa0JFLFMsRUFBaUI7QUFDaEMsWUFBTUYsTUFBZ0IsR0FBRyxFQUF6Qjs7QUFDQSwwQ0FBa0JSLE1BQU0sQ0FBQ0QsSUFBUCxDQUFZLEtBQUtFLFlBQWpCLENBQWxCLHFDQUFrRDtBQUE3QyxjQUFNSSxLQUFHLHFCQUFUO0FBQ0QsY0FBTUYsV0FBVyxHQUFHLEtBQUtGLFlBQUwsQ0FBa0JJLEtBQWxCLENBQXBCO0FBQ0EsY0FBSU0sRUFBRSxHQUFHUixXQUFXLEdBQUdBLFdBQVcsQ0FBQ1MsS0FBZixHQUF1QixFQUEzQzs7QUFDQSxjQUFJRCxFQUFFLElBQUlELFNBQVYsRUFBcUI7QUFDakJDLFlBQUFBLEVBQUUsR0FBR0UsYUFBYSxDQUFDQyxTQUFkLENBQXdCQyxZQUF4QixDQUFxQ0osRUFBckMsRUFBeUMsSUFBekMsQ0FBTDtBQUNIOztBQUNESCxVQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWUosS0FBWjtBQUNBRyxVQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWUUsRUFBWjtBQUNIOztBQUVELGVBQU87QUFDSEosVUFBQUEsSUFBSSxFQUFFLEtBQUtTLEtBRFI7QUFFSGYsVUFBQUEsWUFBWSxFQUFFTztBQUZYLFNBQVA7QUFJSDs7O21DQUVvQlMsYSxFQUFvQkMsTSxFQUFZO0FBQ2pELFlBQU1DLElBQUksR0FBR0YsYUFBYjtBQUNBLGFBQUtELEtBQUwsR0FBYUcsSUFBSSxDQUFDWixJQUFsQjtBQUNBLFlBQU1DLE1BQU0sR0FBR1csSUFBSSxDQUFDbEIsWUFBcEI7QUFDQSxhQUFLQSxZQUFMLEdBQW9CbUIsRUFBRSxDQUFDQyxTQUFILEVBQXBCOztBQUNBLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2QsTUFBTSxDQUFDTixNQUEzQixFQUFtQ29CLENBQUMsSUFBSSxDQUF4QyxFQUEyQztBQUN2Q0osVUFBQUEsTUFBTSxDQUFDSyxNQUFQLENBQWNkLElBQWQsQ0FBbUIsS0FBS1IsWUFBeEIsRUFBc0NPLE1BQU0sQ0FBQ2MsQ0FBRCxDQUE1QyxFQUFpRGQsTUFBTSxDQUFDYyxDQUFDLEdBQUcsQ0FBTCxDQUF2RDtBQUNIO0FBQ0o7Ozs7SUFuRjRCRSxZLHdGQUM1QkMsbUIsRUFDQUMsZTs7Ozs7YUFDdUNOLEVBQUUsQ0FBQ0MsU0FBSCxFOzs7O0FBbUY1Q00sMEJBQVM3QixXQUFULEdBQXVCQSxXQUF2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYXNzZXRcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBzZXJpYWxpemFibGUsIGVkaXRhYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0ICogYXMganMgZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4vYXNzZXQnO1xyXG5pbXBvcnQgeyBTcHJpdGVGcmFtZSB9IGZyb20gJy4vc3ByaXRlLWZyYW1lJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5pbnRlcmZhY2UgSVNwcml0ZUF0bGFzU2VyaWFsaXplRGF0YXtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHNwcml0ZUZyYW1lczogc3RyaW5nW107XHJcbn1cclxuXHJcbmludGVyZmFjZSBJU3ByaXRlRnJhbWVMaXN0IHtcclxuICAgIFtrZXk6IHN0cmluZ106IFNwcml0ZUZyYW1lIHwgbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBDbGFzcyBmb3Igc3ByaXRlIGF0bGFzIGhhbmRsaW5nLlxyXG4gKlxyXG4gKiBAemhcclxuICog57K+54G15Zu+6ZuG6LWE5rqQ57G744CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuU3ByaXRlQXRsYXMnKVxyXG5leHBvcnQgY2xhc3MgU3ByaXRlQXRsYXMgZXh0ZW5kcyBBc3NldCB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBzcHJpdGVGcmFtZXM6IElTcHJpdGVGcmFtZUxpc3QgPSBqcy5jcmVhdGVNYXAoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W57K+54G15Zu+6ZuG55qE6LS05Zu+44CC6K+35rOo5oSP77yM55Sx5LqO57uT5p6E6LCD5pW05LyY5YyW77yM5ZyoIHYxLjEg54mI5pys5LmL5YmN77yM5q2k5Ye95pWw55qE6L+U5Zue5YC85Li6IGltYWdlQXNzZXTvvIzlnKggdjEuMSDniYjmnKzkuYvlkI7kv67mraPkuLogdGV4dHVyZe+8jOaDs+imgeiOt+WPliBpbWFnZUFzc2V0IOWPr+S9v+eUqCBnZXRUZXh0dXJlKCkuaW1hZ2Ug6I635Y+WXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgLSDnsr7ngbXotLTlm77jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFRleHR1cmUgKCkge1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnNwcml0ZUZyYW1lcyk7XHJcbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBzcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWVzW2tleXNbMF1dO1xyXG4gICAgICAgICAgICByZXR1cm4gc3ByaXRlRnJhbWUgJiYgc3ByaXRlRnJhbWUudGV4dHVyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5qC55o2u6ZSu5YC86I635Y+W57K+54G144CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGtleSAtIOeyvueBteWQjeOAglxyXG4gICAgICogQHJldHVybnMgLSDnsr7ngbXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNwcml0ZUZyYW1lIChrZXk6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHNmID0gdGhpcy5zcHJpdGVGcmFtZXNba2V5XTtcclxuICAgICAgICBpZiAoIXNmKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNmLm5hbWUpIHtcclxuICAgICAgICAgICAgc2YubmFtZSA9IGtleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNmO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bnsr7ngbXlm77pm4bmiYDmnInnsr7ngbXjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyAtIOi/lOWbnuaJgOacieeyvueBteOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0U3ByaXRlRnJhbWVzICgpIHtcclxuICAgICAgICBjb25zdCBmcmFtZXM6IEFycmF5PFNwcml0ZUZyYW1lIHwgbnVsbD4gPSBbXTtcclxuICAgICAgICBjb25zdCBzcHJpdGVGcmFtZXMgPSB0aGlzLnNwcml0ZUZyYW1lcztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc3ByaXRlRnJhbWVzKSkge1xyXG4gICAgICAgICAgICBmcmFtZXMucHVzaChzcHJpdGVGcmFtZXNba2V5XSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZnJhbWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfc2VyaWFsaXplIChleHBvcnRpbmc/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBmcmFtZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5zcHJpdGVGcmFtZXMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwcml0ZUZyYW1lID0gdGhpcy5zcHJpdGVGcmFtZXNba2V5XTtcclxuICAgICAgICAgICAgbGV0IGlkID0gc3ByaXRlRnJhbWUgPyBzcHJpdGVGcmFtZS5fdXVpZCA6ICcnO1xyXG4gICAgICAgICAgICBpZiAoaWQgJiYgZXhwb3J0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IEVkaXRvckV4dGVuZHMuVXVpZFV0aWxzLmNvbXByZXNzVXVpZChpZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnJhbWVzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgZnJhbWVzLnB1c2goaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5fbmFtZSxcclxuICAgICAgICAgICAgc3ByaXRlRnJhbWVzOiBmcmFtZXMsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2Rlc2VyaWFsaXplIChzZXJpYWxpemVEYXRhOiBhbnksIGhhbmRsZTogYW55KXtcclxuICAgICAgICBjb25zdCBkYXRhID0gc2VyaWFsaXplRGF0YSBhcyBJU3ByaXRlQXRsYXNTZXJpYWxpemVEYXRhO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBkYXRhLm5hbWU7XHJcbiAgICAgICAgY29uc3QgZnJhbWVzID0gZGF0YS5zcHJpdGVGcmFtZXM7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVGcmFtZXMgPSBqcy5jcmVhdGVNYXAoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkgKz0gMikge1xyXG4gICAgICAgICAgICBoYW5kbGUucmVzdWx0LnB1c2godGhpcy5zcHJpdGVGcmFtZXMsIGZyYW1lc1tpXSwgZnJhbWVzW2kgKyAxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5TcHJpdGVBdGxhcyA9IFNwcml0ZUF0bGFzO1xyXG4iXX0=