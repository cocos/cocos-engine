(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/math/index.js", "../../../core/geometry/index.js", "./builtin-shape.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/math/index.js"), require("../../../core/geometry/index.js"), require("./builtin-shape.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.builtinShape);
    global.builtinBoxShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _builtinShape) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BuiltinBoxShape = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var BuiltinBoxShape = /*#__PURE__*/function (_BuiltinShape) {
    _inherits(BuiltinBoxShape, _BuiltinShape);

    _createClass(BuiltinBoxShape, [{
      key: "localObb",
      get: function get() {
        return this._localShape;
      }
    }, {
      key: "worldObb",
      get: function get() {
        return this._worldShape;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }]);

    function BuiltinBoxShape() {
      var _this;

      _classCallCheck(this, BuiltinBoxShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BuiltinBoxShape).call(this));
      _this._localShape = new _index2.obb();
      _this._worldShape = new _index2.obb();
      return _this;
    }

    _createClass(BuiltinBoxShape, [{
      key: "setSize",
      value: function setSize(size) {
        _index.Vec3.multiplyScalar(this.localObb.halfExtents, size, 0.5);

        _index.Vec3.multiply(this.worldObb.halfExtents, this.localObb.halfExtents, this.collider.node.worldScale);
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(BuiltinBoxShape.prototype), "onLoad", this).call(this);

        this.setSize(this.collider.size);
      }
    }]);

    return BuiltinBoxShape;
  }(_builtinShape.BuiltinShape);

  _exports.BuiltinBoxShape = BuiltinBoxShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3Mvc2hhcGVzL2J1aWx0aW4tYm94LXNoYXBlLnRzIl0sIm5hbWVzIjpbIkJ1aWx0aW5Cb3hTaGFwZSIsIl9sb2NhbFNoYXBlIiwiX3dvcmxkU2hhcGUiLCJfY29sbGlkZXIiLCJvYmIiLCJzaXplIiwiVmVjMyIsIm11bHRpcGx5U2NhbGFyIiwibG9jYWxPYmIiLCJoYWxmRXh0ZW50cyIsIm11bHRpcGx5Iiwid29ybGRPYmIiLCJjb2xsaWRlciIsIm5vZGUiLCJ3b3JsZFNjYWxlIiwic2V0U2l6ZSIsIkJ1aWx0aW5TaGFwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BT2FBLGU7Ozs7OzBCQUVPO0FBQ1osZUFBTyxLQUFLQyxXQUFaO0FBQ0g7OzswQkFFZTtBQUNaLGVBQU8sS0FBS0MsV0FBWjtBQUNIOzs7MEJBRWU7QUFDWixlQUFPLEtBQUtDLFNBQVo7QUFDSDs7O0FBRUQsK0JBQWU7QUFBQTs7QUFBQTs7QUFDWDtBQUNBLFlBQUtGLFdBQUwsR0FBbUIsSUFBSUcsV0FBSixFQUFuQjtBQUNBLFlBQUtGLFdBQUwsR0FBbUIsSUFBSUUsV0FBSixFQUFuQjtBQUhXO0FBSWQ7Ozs7OEJBRVFDLEksRUFBaUI7QUFDdEJDLG9CQUFLQyxjQUFMLENBQW9CLEtBQUtDLFFBQUwsQ0FBY0MsV0FBbEMsRUFBK0NKLElBQS9DLEVBQXFELEdBQXJEOztBQUNBQyxvQkFBS0ksUUFBTCxDQUFjLEtBQUtDLFFBQUwsQ0FBY0YsV0FBNUIsRUFBeUMsS0FBS0QsUUFBTCxDQUFjQyxXQUF2RCxFQUFvRSxLQUFLRyxRQUFMLENBQWNDLElBQWQsQ0FBbUJDLFVBQXZGO0FBQ0g7OzsrQkFFUztBQUNOOztBQUNBLGFBQUtDLE9BQUwsQ0FBYSxLQUFLSCxRQUFMLENBQWNQLElBQTNCO0FBQ0g7Ozs7SUE1QmdDVywwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBvYmIgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgQnVpbHRpblNoYXBlIH0gZnJvbSAnLi9idWlsdGluLXNoYXBlJztcclxuaW1wb3J0IHsgSUJveFNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBCb3hDb2xsaWRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1aWx0aW5Cb3hTaGFwZSBleHRlbmRzIEJ1aWx0aW5TaGFwZSBpbXBsZW1lbnRzIElCb3hTaGFwZSB7XHJcblxyXG4gICAgZ2V0IGxvY2FsT2JiICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxTaGFwZSBhcyBvYmI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdvcmxkT2JiICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTaGFwZSBhcyBvYmI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIgYXMgQm94Q29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbG9jYWxTaGFwZSA9IG5ldyBvYmIoKTtcclxuICAgICAgICB0aGlzLl93b3JsZFNoYXBlID0gbmV3IG9iYigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNpemUgKHNpemU6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIodGhpcy5sb2NhbE9iYi5oYWxmRXh0ZW50cywgc2l6ZSwgMC41KTtcclxuICAgICAgICBWZWMzLm11bHRpcGx5KHRoaXMud29ybGRPYmIuaGFsZkV4dGVudHMsIHRoaXMubG9jYWxPYmIuaGFsZkV4dGVudHMsIHRoaXMuY29sbGlkZXIubm9kZS53b3JsZFNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMuc2V0U2l6ZSh0aGlzLmNvbGxpZGVyLnNpemUpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=