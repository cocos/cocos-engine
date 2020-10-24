(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js", "../utils/murmurhash2_gc.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"), require("../utils/murmurhash2_gc.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.murmurhash2_gc);
    global.inputAssembler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _murmurhash2_gc) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXInputAssembler = _exports.GFXInputAssemblerInfo = _exports.GFXAttribute = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXAttribute = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXAttribute() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXFormat.UNKNOWN;
    var isNormalized = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var stream = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var isInstanced = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var location = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    _classCallCheck(this, GFXAttribute);

    this.name = name;
    this.format = format;
    this.isNormalized = isNormalized;
    this.stream = stream;
    this.isInstanced = isInstanced;
    this.location = location;
  };

  _exports.GFXAttribute = GFXAttribute;

  var GFXInputAssemblerInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXInputAssemblerInfo() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var vertexBuffers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var indexBuffer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var indirectBuffer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, GFXInputAssemblerInfo);

    this.attributes = attributes;
    this.vertexBuffers = vertexBuffers;
    this.indexBuffer = indexBuffer;
    this.indirectBuffer = indirectBuffer;
  };
  /**
   * @en GFX input assembler.
   * @zh GFX 输入汇集器。
   */


  _exports.GFXInputAssemblerInfo = GFXInputAssemblerInfo;

  var GFXInputAssembler = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXInputAssembler, _GFXObject);

    _createClass(GFXInputAssembler, [{
      key: "vertexBuffers",

      /**
       * @en Get current vertex buffers.
       * @zh 顶点缓冲数组。
       */
      get: function get() {
        return this._vertexBuffers;
      }
      /**
       * @en Get current index buffer.
       * @zh 索引缓冲。
       */

    }, {
      key: "indexBuffer",
      get: function get() {
        return this._indexBuffer;
      }
      /**
       * @en Get current attributes.
       * @zh 顶点属性数组。
       */

    }, {
      key: "attributes",
      get: function get() {
        return this._attributes;
      }
      /**
       * @en Get hash of current attributes.
       * @zh 获取顶点属性数组的哈希值。
       */

    }, {
      key: "attributesHash",
      get: function get() {
        return this._attributesHash;
      }
      /**
       * @en Get current vertex count.
       * @zh 顶点数量。
       */

    }, {
      key: "vertexCount",
      get: function get() {
        return this._vertexCount;
      },
      set: function set(count) {
        this._vertexCount = count;
      }
      /**
       * @en Get starting vertex.
       * @zh 起始顶点。
       */

    }, {
      key: "firstVertex",
      get: function get() {
        return this._firstVertex;
      },
      set: function set(first) {
        this._firstVertex = first;
      }
      /**
       * @en Get current index count.
       * @zh 索引数量。
       */

    }, {
      key: "indexCount",
      get: function get() {
        return this._indexCount;
      },
      set: function set(count) {
        this._indexCount = count;
      }
      /**
       * @en Get starting index.
       * @zh 起始索引。
       */

    }, {
      key: "firstIndex",
      get: function get() {
        return this._firstIndex;
      },
      set: function set(first) {
        this._firstIndex = first;
      }
      /**
       * @en Get current vertex offset.
       * @zh 顶点偏移量。
       */

    }, {
      key: "vertexOffset",
      get: function get() {
        return this._vertexOffset;
      },
      set: function set(offset) {
        this._vertexOffset = offset;
      }
      /**
       * @en Get current instance count.
       * @zh 实例数量。
       */

    }, {
      key: "instanceCount",
      get: function get() {
        return this._instanceCount;
      },
      set: function set(count) {
        this._instanceCount = count;
      }
      /**
       * @en Get starting instance.
       * @zh 起始实例。
       */

    }, {
      key: "firstInstance",
      get: function get() {
        return this._firstInstance;
      },
      set: function set(first) {
        this._firstInstance = first;
      }
      /**
       * @en Get the indirect buffer, if present.
       * @zh 间接绘制缓冲。
       */

    }, {
      key: "indirectBuffer",
      get: function get() {
        return this._indirectBuffer;
      }
    }]);

    function GFXInputAssembler(device) {
      var _this;

      _classCallCheck(this, GFXInputAssembler);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXInputAssembler).call(this, _define.GFXObjectType.INPUT_ASSEMBLER));
      _this._device = void 0;
      _this._attributes = [];
      _this._vertexBuffers = [];
      _this._indexBuffer = null;
      _this._vertexCount = 0;
      _this._firstVertex = 0;
      _this._indexCount = 0;
      _this._firstIndex = 0;
      _this._vertexOffset = 0;
      _this._instanceCount = 0;
      _this._firstInstance = 0;
      _this._attributesHash = 0;
      _this._indirectBuffer = null;
      _this._device = device;
      return _this;
    }

    _createClass(GFXInputAssembler, [{
      key: "getVertexBuffer",

      /**
       * @en Get the specified vertex buffer.
       * @zh 获取顶点缓冲。
       * @param stream The stream index of the vertex buffer.
       */
      value: function getVertexBuffer() {
        var stream = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        if (stream < this._vertexBuffers.length) {
          return this._vertexBuffers[stream];
        } else {
          return null;
        }
      }
    }, {
      key: "computeAttributesHash",
      value: function computeAttributesHash() {
        var res = 'attrs';

        for (var i = 0; i < this.attributes.length; ++i) {
          var at = this.attributes[i];
          res += ",".concat(at.name, ",").concat(at.format, ",").concat(at.isNormalized, ",").concat(at.stream, ",").concat(at.isInstanced);
        }

        return (0, _murmurhash2_gc.murmurhash2_32_gc)(res, 666);
      }
    }]);

    return GFXInputAssembler;
  }(_define.GFXObject);

  _exports.GFXInputAssembler = GFXInputAssembler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2lucHV0LWFzc2VtYmxlci50cyJdLCJuYW1lcyI6WyJHRlhBdHRyaWJ1dGUiLCJuYW1lIiwiZm9ybWF0IiwiR0ZYRm9ybWF0IiwiVU5LTk9XTiIsImlzTm9ybWFsaXplZCIsInN0cmVhbSIsImlzSW5zdGFuY2VkIiwibG9jYXRpb24iLCJHRlhJbnB1dEFzc2VtYmxlckluZm8iLCJhdHRyaWJ1dGVzIiwidmVydGV4QnVmZmVycyIsImluZGV4QnVmZmVyIiwiaW5kaXJlY3RCdWZmZXIiLCJHRlhJbnB1dEFzc2VtYmxlciIsIl92ZXJ0ZXhCdWZmZXJzIiwiX2luZGV4QnVmZmVyIiwiX2F0dHJpYnV0ZXMiLCJfYXR0cmlidXRlc0hhc2giLCJfdmVydGV4Q291bnQiLCJjb3VudCIsIl9maXJzdFZlcnRleCIsImZpcnN0IiwiX2luZGV4Q291bnQiLCJfZmlyc3RJbmRleCIsIl92ZXJ0ZXhPZmZzZXQiLCJvZmZzZXQiLCJfaW5zdGFuY2VDb3VudCIsIl9maXJzdEluc3RhbmNlIiwiX2luZGlyZWN0QnVmZmVyIiwiZGV2aWNlIiwiR0ZYT2JqZWN0VHlwZSIsIklOUFVUX0FTU0VNQkxFUiIsIl9kZXZpY2UiLCJsZW5ndGgiLCJyZXMiLCJpIiwiYXQiLCJHRlhPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BU2FBLFksR0FDcUI7QUFFOUIsMEJBT0U7QUFBQSxRQU5TQyxJQU1ULHVFQU53QixFQU14QjtBQUFBLFFBTFNDLE1BS1QsdUVBTDZCQyxrQkFBVUMsT0FLdkM7QUFBQSxRQUpTQyxZQUlULHVFQUppQyxLQUlqQztBQUFBLFFBSFNDLE1BR1QsdUVBSDBCLENBRzFCO0FBQUEsUUFGU0MsV0FFVCx1RUFGZ0MsS0FFaEM7QUFBQSxRQURTQyxRQUNULHVFQUQ0QixDQUM1Qjs7QUFBQTs7QUFBQSxTQU5TUCxJQU1ULEdBTlNBLElBTVQ7QUFBQSxTQUxTQyxNQUtULEdBTFNBLE1BS1Q7QUFBQSxTQUpTRyxZQUlULEdBSlNBLFlBSVQ7QUFBQSxTQUhTQyxNQUdULEdBSFNBLE1BR1Q7QUFBQSxTQUZTQyxXQUVULEdBRlNBLFdBRVQ7QUFBQSxTQURTQyxRQUNULEdBRFNBLFFBQ1Q7QUFBRSxHOzs7O01BR0tDLHFCLEdBQ3FCO0FBRTlCLG1DQUtFO0FBQUEsUUFKU0MsVUFJVCx1RUFKc0MsRUFJdEM7QUFBQSxRQUhTQyxhQUdULHVFQUhzQyxFQUd0QztBQUFBLFFBRlNDLFdBRVQsdUVBRnlDLElBRXpDO0FBQUEsUUFEU0MsY0FDVCx1RUFENEMsSUFDNUM7O0FBQUE7O0FBQUEsU0FKU0gsVUFJVCxHQUpTQSxVQUlUO0FBQUEsU0FIU0MsYUFHVCxHQUhTQSxhQUdUO0FBQUEsU0FGU0MsV0FFVCxHQUZTQSxXQUVUO0FBQUEsU0FEU0MsY0FDVCxHQURTQSxjQUNUO0FBQUUsRztBQUdSOzs7Ozs7OztNQUlzQkMsaUI7Ozs7OztBQUVsQjs7OzswQkFJa0M7QUFDOUIsZUFBTyxLQUFLQyxjQUFaO0FBQ0g7QUFFRDs7Ozs7OzswQkFJcUM7QUFDakMsZUFBTyxLQUFLQyxZQUFaO0FBQ0g7QUFFRDs7Ozs7OzswQkFJa0M7QUFDOUIsZUFBTyxLQUFLQyxXQUFaO0FBQ0g7QUFFRDs7Ozs7OzswQkFJOEI7QUFDMUIsZUFBTyxLQUFLQyxlQUFaO0FBQ0g7QUFFRDs7Ozs7OzswQkFJMkI7QUFDdkIsZUFBTyxLQUFLQyxZQUFaO0FBQ0gsTzt3QkFFZ0JDLEssRUFBZTtBQUM1QixhQUFLRCxZQUFMLEdBQW9CQyxLQUFwQjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSTJCO0FBQ3ZCLGVBQU8sS0FBS0MsWUFBWjtBQUNILE87d0JBRWdCQyxLLEVBQWU7QUFDNUIsYUFBS0QsWUFBTCxHQUFvQkMsS0FBcEI7QUFDSDtBQUVEOzs7Ozs7OzBCQUkwQjtBQUN0QixlQUFPLEtBQUtDLFdBQVo7QUFDSCxPO3dCQUVlSCxLLEVBQWU7QUFDM0IsYUFBS0csV0FBTCxHQUFtQkgsS0FBbkI7QUFDSDtBQUVEOzs7Ozs7OzBCQUkwQjtBQUN0QixlQUFPLEtBQUtJLFdBQVo7QUFDSCxPO3dCQUVlRixLLEVBQWU7QUFDM0IsYUFBS0UsV0FBTCxHQUFtQkYsS0FBbkI7QUFDSDtBQUVEOzs7Ozs7OzBCQUk0QjtBQUN4QixlQUFPLEtBQUtHLGFBQVo7QUFDSCxPO3dCQUVpQkMsTSxFQUFnQjtBQUM5QixhQUFLRCxhQUFMLEdBQXFCQyxNQUFyQjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSTZCO0FBQ3pCLGVBQU8sS0FBS0MsY0FBWjtBQUNILE87d0JBRWtCUCxLLEVBQWU7QUFDOUIsYUFBS08sY0FBTCxHQUFzQlAsS0FBdEI7QUFDSDtBQUVEOzs7Ozs7OzBCQUk2QjtBQUN6QixlQUFPLEtBQUtRLGNBQVo7QUFDSCxPO3dCQUVrQk4sSyxFQUFlO0FBQzlCLGFBQUtNLGNBQUwsR0FBc0JOLEtBQXRCO0FBQ0g7QUFFRDs7Ozs7OzswQkFJd0M7QUFDcEMsZUFBTyxLQUFLTyxlQUFaO0FBQ0g7OztBQTRCRCwrQkFBYUMsTUFBYixFQUFnQztBQUFBOztBQUFBOztBQUM1Qiw2RkFBTUMsc0JBQWNDLGVBQXBCO0FBRDRCLFlBMUJ0QkMsT0EwQnNCO0FBQUEsWUF4QnRCaEIsV0F3QnNCLEdBeEJRLEVBd0JSO0FBQUEsWUF0QnRCRixjQXNCc0IsR0F0QlEsRUFzQlI7QUFBQSxZQXBCdEJDLFlBb0JzQixHQXBCVyxJQW9CWDtBQUFBLFlBbEJ0QkcsWUFrQnNCLEdBbEJDLENBa0JEO0FBQUEsWUFoQnRCRSxZQWdCc0IsR0FoQkMsQ0FnQkQ7QUFBQSxZQWR0QkUsV0Fjc0IsR0FkQSxDQWNBO0FBQUEsWUFadEJDLFdBWXNCLEdBWkEsQ0FZQTtBQUFBLFlBVnRCQyxhQVVzQixHQVZFLENBVUY7QUFBQSxZQVJ0QkUsY0FRc0IsR0FSRyxDQVFIO0FBQUEsWUFOdEJDLGNBTXNCLEdBTkcsQ0FNSDtBQUFBLFlBSnRCVixlQUlzQixHQUpJLENBSUo7QUFBQSxZQUZ0QlcsZUFFc0IsR0FGYyxJQUVkO0FBRTVCLFlBQUtJLE9BQUwsR0FBZUgsTUFBZjtBQUY0QjtBQUcvQjs7Ozs7QUFLRDs7Ozs7d0NBSzhEO0FBQUEsWUFBdEN4QixNQUFzQyx1RUFBckIsQ0FBcUI7O0FBQzFELFlBQUlBLE1BQU0sR0FBRyxLQUFLUyxjQUFMLENBQW9CbUIsTUFBakMsRUFBeUM7QUFDckMsaUJBQU8sS0FBS25CLGNBQUwsQ0FBb0JULE1BQXBCLENBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxpQkFBTyxJQUFQO0FBQ0g7QUFDSjs7OzhDQUUwQztBQUN2QyxZQUFJNkIsR0FBRyxHQUFHLE9BQVY7O0FBQ0EsYUFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUsxQixVQUFMLENBQWdCd0IsTUFBcEMsRUFBNEMsRUFBRUUsQ0FBOUMsRUFBaUQ7QUFDN0MsY0FBTUMsRUFBRSxHQUFHLEtBQUszQixVQUFMLENBQWdCMEIsQ0FBaEIsQ0FBWDtBQUNBRCxVQUFBQSxHQUFHLGVBQVFFLEVBQUUsQ0FBQ3BDLElBQVgsY0FBbUJvQyxFQUFFLENBQUNuQyxNQUF0QixjQUFnQ21DLEVBQUUsQ0FBQ2hDLFlBQW5DLGNBQW1EZ0MsRUFBRSxDQUFDL0IsTUFBdEQsY0FBZ0UrQixFQUFFLENBQUM5QixXQUFuRSxDQUFIO0FBQ0g7O0FBQ0QsZUFBTyx1Q0FBa0I0QixHQUFsQixFQUF1QixHQUF2QixDQUFQO0FBQ0g7Ozs7SUFwTDJDRyxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2Z4XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgR0ZYQnVmZmVyIH0gZnJvbSAnLi9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhGb3JtYXQsIEdGWE9iamVjdCwgR0ZYT2JqZWN0VHlwZSB9IGZyb20gJy4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi9kZXZpY2UnO1xyXG5pbXBvcnQgeyBtdXJtdXJoYXNoMl8zMl9nYyB9IGZyb20gJy4uL3V0aWxzL211cm11cmhhc2gyX2djJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhBdHRyaWJ1dGUge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSAnJyxcclxuICAgICAgICBwdWJsaWMgZm9ybWF0OiBHRlhGb3JtYXQgPSBHRlhGb3JtYXQuVU5LTk9XTixcclxuICAgICAgICBwdWJsaWMgaXNOb3JtYWxpemVkOiBib29sZWFuID0gZmFsc2UsXHJcbiAgICAgICAgcHVibGljIHN0cmVhbTogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgaXNJbnN0YW5jZWQ6IGJvb2xlYW4gPSBmYWxzZSxcclxuICAgICAgICBwdWJsaWMgbG9jYXRpb246IG51bWJlciA9IDAsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhJbnB1dEFzc2VtYmxlckluZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXSA9IFtdLFxyXG4gICAgICAgIHB1YmxpYyB2ZXJ0ZXhCdWZmZXJzOiBHRlhCdWZmZXJbXSA9IFtdLFxyXG4gICAgICAgIHB1YmxpYyBpbmRleEJ1ZmZlcjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGwsXHJcbiAgICAgICAgcHVibGljIGluZGlyZWN0QnVmZmVyOiBHRlhCdWZmZXIgfCBudWxsID0gbnVsbCxcclxuICAgICkge31cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBHRlggaW5wdXQgYXNzZW1ibGVyLlxyXG4gKiBAemggR0ZYIOi+k+WFpeaxh+mbhuWZqOOAglxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdGWElucHV0QXNzZW1ibGVyIGV4dGVuZHMgR0ZYT2JqZWN0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCB2ZXJ0ZXggYnVmZmVycy5cclxuICAgICAqIEB6aCDpobbngrnnvJPlhrLmlbDnu4TjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHZlcnRleEJ1ZmZlcnMgKCk6IEdGWEJ1ZmZlcltdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmVydGV4QnVmZmVycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCBpbmRleCBidWZmZXIuXHJcbiAgICAgKiBAemgg57Si5byV57yT5Yay44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBpbmRleEJ1ZmZlciAoKTogR0ZYQnVmZmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4QnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBjdXJyZW50IGF0dHJpYnV0ZXMuXHJcbiAgICAgKiBAemgg6aG254K55bGe5oCn5pWw57uE44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBhdHRyaWJ1dGVzICgpOiBHRlhBdHRyaWJ1dGVbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGhhc2ggb2YgY3VycmVudCBhdHRyaWJ1dGVzLlxyXG4gICAgICogQHpoIOiOt+WPlumhtueCueWxnuaAp+aVsOe7hOeahOWTiOW4jOWAvOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgYXR0cmlidXRlc0hhc2ggKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXNIYXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBjdXJyZW50IHZlcnRleCBjb3VudC5cclxuICAgICAqIEB6aCDpobbngrnmlbDph4/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHZlcnRleENvdW50ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0ZXhDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmVydGV4Q291bnQgKGNvdW50OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl92ZXJ0ZXhDb3VudCA9IGNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBzdGFydGluZyB2ZXJ0ZXguXHJcbiAgICAgKiBAemgg6LW35aeL6aG254K544CCXHJcbiAgICAgKi9cclxuICAgIGdldCBmaXJzdFZlcnRleCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3RWZXJ0ZXg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZpcnN0VmVydGV4IChmaXJzdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZmlyc3RWZXJ0ZXggPSBmaXJzdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCBpbmRleCBjb3VudC5cclxuICAgICAqIEB6aCDntKLlvJXmlbDph4/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGluZGV4Q291bnQgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4Q291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGluZGV4Q291bnQgKGNvdW50OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9pbmRleENvdW50ID0gY291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IHN0YXJ0aW5nIGluZGV4LlxyXG4gICAgICogQHpoIOi1t+Wni+e0ouW8leOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZmlyc3RJbmRleCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3RJbmRleDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZmlyc3RJbmRleCAoZmlyc3Q6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZpcnN0SW5kZXggPSBmaXJzdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCB2ZXJ0ZXggb2Zmc2V0LlxyXG4gICAgICogQHpoIOmhtueCueWBj+enu+mHj+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgdmVydGV4T2Zmc2V0ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0ZXhPZmZzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZlcnRleE9mZnNldCAob2Zmc2V0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGN1cnJlbnQgaW5zdGFuY2UgY291bnQuXHJcbiAgICAgKiBAemgg5a6e5L6L5pWw6YeP44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBpbnN0YW5jZUNvdW50ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZUNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpbnN0YW5jZUNvdW50IChjb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5faW5zdGFuY2VDb3VudCA9IGNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBzdGFydGluZyBpbnN0YW5jZS5cclxuICAgICAqIEB6aCDotbflp4vlrp7kvovjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGZpcnN0SW5zdGFuY2UgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0SW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZpcnN0SW5zdGFuY2UgKGZpcnN0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9maXJzdEluc3RhbmNlID0gZmlyc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IHRoZSBpbmRpcmVjdCBidWZmZXIsIGlmIHByZXNlbnQuXHJcbiAgICAgKiBAemgg6Ze05o6l57uY5Yi257yT5Yay44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBpbmRpcmVjdEJ1ZmZlciAoKTogR0ZYQnVmZmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luZGlyZWN0QnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZGV2aWNlOiBHRlhEZXZpY2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9hdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXSA9IFtdO1xyXG5cclxuICAgIHByb3RlY3RlZCBfdmVydGV4QnVmZmVyczogR0ZYQnVmZmVyW10gPSBbXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2luZGV4QnVmZmVyOiBHRlhCdWZmZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3ZlcnRleENvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBfZmlyc3RWZXJ0ZXg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pbmRleENvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBfZmlyc3RJbmRleDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3ZlcnRleE9mZnNldDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2luc3RhbmNlQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9maXJzdEluc3RhbmNlOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBfYXR0cmlidXRlc0hhc2g6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pbmRpcmVjdEJ1ZmZlcjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgc3VwZXIoR0ZYT2JqZWN0VHlwZS5JTlBVVF9BU1NFTUJMRVIpO1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYSW5wdXRBc3NlbWJsZXJJbmZvKTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZXN0cm95ICgpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0aGUgc3BlY2lmaWVkIHZlcnRleCBidWZmZXIuXHJcbiAgICAgKiBAemgg6I635Y+W6aG254K557yT5Yay44CCXHJcbiAgICAgKiBAcGFyYW0gc3RyZWFtIFRoZSBzdHJlYW0gaW5kZXggb2YgdGhlIHZlcnRleCBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWZXJ0ZXhCdWZmZXIgKHN0cmVhbTogbnVtYmVyID0gMCk6IEdGWEJ1ZmZlciB8IG51bGwge1xyXG4gICAgICAgIGlmIChzdHJlYW0gPCB0aGlzLl92ZXJ0ZXhCdWZmZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmVydGV4QnVmZmVyc1tzdHJlYW1dO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29tcHV0ZUF0dHJpYnV0ZXNIYXNoICgpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCByZXMgPSAnYXR0cnMnO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0ID0gdGhpcy5hdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICByZXMgKz0gYCwke2F0Lm5hbWV9LCR7YXQuZm9ybWF0fSwke2F0LmlzTm9ybWFsaXplZH0sJHthdC5zdHJlYW19LCR7YXQuaXNJbnN0YW5jZWR9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG11cm11cmhhc2gyXzMyX2djKHJlcywgNjY2KTtcclxuICAgIH1cclxufVxyXG4iXX0=