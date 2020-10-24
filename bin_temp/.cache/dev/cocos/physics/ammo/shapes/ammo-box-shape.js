(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "./ammo-shape.js", "../../../core/index.js", "../ammo-util.js", "../ammo-enum.js", "../ammo-const.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("./ammo-shape.js"), require("../../../core/index.js"), require("../ammo-util.js"), require("../ammo-enum.js"), require("../ammo-const.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.ammoShape, global.index, global.ammoUtil, global.ammoEnum, global.ammoConst);
    global.ammoBoxShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoShape, _index, _ammoUtil, _ammoEnum, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoBoxShape = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var v3_0 = _ammoConst.CC_V3_0;

  var AmmoBoxShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoBoxShape, _AmmoShape);

    _createClass(AmmoBoxShape, [{
      key: "setSize",
      value: function setSize(size) {
        _index.Vec3.multiplyScalar(v3_0, size, 0.5);

        (0, _ammoUtil.cocos2AmmoVec3)(this.halfExt, v3_0);
        this.impl.setUnscaledHalfExtents(this.halfExt);
        this.updateCompoundTransform();
      }
    }, {
      key: "impl",
      get: function get() {
        return this._btShape;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }]);

    function AmmoBoxShape() {
      var _this;

      _classCallCheck(this, AmmoBoxShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoBoxShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.BOX_SHAPE_PROXYTYPE));
      _this.halfExt = void 0;
      _this.halfExt = new _ammoInstantiated.default.btVector3(0.5, 0.5, 0.5);
      _this._btShape = new _ammoInstantiated.default.btBoxShape(_this.halfExt);
      return _this;
    }

    _createClass(AmmoBoxShape, [{
      key: "onComponentSet",
      value: function onComponentSet() {
        this.setSize(this.collider.size);
        this.setScale();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _ammoInstantiated.default.destroy(this.halfExt);

        (0, _ammoUtil.ammoDeletePtr)(this.halfExt, _ammoInstantiated.default.btVector3);
        this.halfExt = null;

        _get(_getPrototypeOf(AmmoBoxShape.prototype), "onDestroy", this).call(this);
      }
    }, {
      key: "setScale",
      value: function setScale() {
        _get(_getPrototypeOf(AmmoBoxShape.prototype), "setScale", this).call(this);

        (0, _ammoUtil.cocos2AmmoVec3)(this.scale, this._collider.node.worldScale);

        this._btShape.setLocalScaling(this.scale);

        this.updateCompoundTransform();
      }
    }]);

    return AmmoBoxShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoBoxShape = AmmoBoxShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby1ib3gtc2hhcGUudHMiXSwibmFtZXMiOlsidjNfMCIsIkNDX1YzXzAiLCJBbW1vQm94U2hhcGUiLCJzaXplIiwiVmVjMyIsIm11bHRpcGx5U2NhbGFyIiwiaGFsZkV4dCIsImltcGwiLCJzZXRVbnNjYWxlZEhhbGZFeHRlbnRzIiwidXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0iLCJfYnRTaGFwZSIsIl9jb2xsaWRlciIsIkFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMiLCJCT1hfU0hBUEVfUFJPWFlUWVBFIiwiQW1tbyIsImJ0VmVjdG9yMyIsImJ0Qm94U2hhcGUiLCJzZXRTaXplIiwiY29sbGlkZXIiLCJzZXRTY2FsZSIsImRlc3Ryb3kiLCJzY2FsZSIsIm5vZGUiLCJ3b3JsZFNjYWxlIiwic2V0TG9jYWxTY2FsaW5nIiwiQW1tb1NoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQSxNQUFNQSxJQUFJLEdBQUdDLGtCQUFiOztNQUVhQyxZOzs7Ozs4QkFFQUMsSSxFQUFpQjtBQUN0QkMsb0JBQUtDLGNBQUwsQ0FBb0JMLElBQXBCLEVBQTBCRyxJQUExQixFQUFnQyxHQUFoQzs7QUFDQSxzQ0FBZSxLQUFLRyxPQUFwQixFQUE2Qk4sSUFBN0I7QUFDQSxhQUFLTyxJQUFMLENBQVVDLHNCQUFWLENBQWlDLEtBQUtGLE9BQXRDO0FBQ0EsYUFBS0csdUJBQUw7QUFDSDs7OzBCQUVXO0FBQ1IsZUFBTyxLQUFLQyxRQUFaO0FBQ0g7OzswQkFFZTtBQUNaLGVBQU8sS0FBS0MsU0FBWjtBQUNIOzs7QUFJRCw0QkFBZTtBQUFBOztBQUFBOztBQUNYLHdGQUFNQyxvQ0FBMEJDLG1CQUFoQztBQURXLFlBRk5QLE9BRU07QUFFWCxZQUFLQSxPQUFMLEdBQWUsSUFBSVEsMEJBQUtDLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0IsR0FBeEIsRUFBNkIsR0FBN0IsQ0FBZjtBQUNBLFlBQUtMLFFBQUwsR0FBZ0IsSUFBSUksMEJBQUtFLFVBQVQsQ0FBb0IsTUFBS1YsT0FBekIsQ0FBaEI7QUFIVztBQUlkOzs7O3VDQUVpQjtBQUNkLGFBQUtXLE9BQUwsQ0FBYSxLQUFLQyxRQUFMLENBQWNmLElBQTNCO0FBQ0EsYUFBS2dCLFFBQUw7QUFDSDs7O2tDQUVZO0FBQ1RMLGtDQUFLTSxPQUFMLENBQWEsS0FBS2QsT0FBbEI7O0FBQ0EscUNBQWMsS0FBS0EsT0FBbkIsRUFBNEJRLDBCQUFLQyxTQUFqQztBQUNDLGFBQUtULE9BQU4sR0FBd0IsSUFBeEI7O0FBQ0E7QUFDSDs7O2lDQUVXO0FBQ1I7O0FBQ0Esc0NBQWUsS0FBS2UsS0FBcEIsRUFBMkIsS0FBS1YsU0FBTCxDQUFlVyxJQUFmLENBQW9CQyxVQUEvQzs7QUFDQSxhQUFLYixRQUFMLENBQWNjLGVBQWQsQ0FBOEIsS0FBS0gsS0FBbkM7O0FBQ0EsYUFBS1osdUJBQUw7QUFDSDs7OztJQTFDNkJnQixvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbW1vIGZyb20gJy4uL2FtbW8taW5zdGFudGlhdGVkJztcclxuaW1wb3J0IHsgQW1tb1NoYXBlIH0gZnJvbSBcIi4vYW1tby1zaGFwZVwiO1xyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSBcIi4uLy4uLy4uL2NvcmVcIjtcclxuaW1wb3J0IHsgQm94Q29sbGlkZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9leHBvcnRzL3BoeXNpY3MtZnJhbWV3b3JrJztcclxuaW1wb3J0IHsgY29jb3MyQW1tb1ZlYzMsIGFtbW9EZWxldGVQdHIgfSBmcm9tICcuLi9hbW1vLXV0aWwnO1xyXG5pbXBvcnQgeyBBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzIH0gZnJvbSAnLi4vYW1tby1lbnVtJztcclxuaW1wb3J0IHsgSUJveFNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBDQ19WM18wIH0gZnJvbSAnLi4vYW1tby1jb25zdCc7XHJcblxyXG5jb25zdCB2M18wID0gQ0NfVjNfMDtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbW1vQm94U2hhcGUgZXh0ZW5kcyBBbW1vU2hhcGUgaW1wbGVtZW50cyBJQm94U2hhcGUge1xyXG5cclxuICAgIHNldFNpemUgKHNpemU6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIodjNfMCwgc2l6ZSwgMC41KTtcclxuICAgICAgICBjb2NvczJBbW1vVmVjMyh0aGlzLmhhbGZFeHQsIHYzXzApO1xyXG4gICAgICAgIHRoaXMuaW1wbC5zZXRVbnNjYWxlZEhhbGZFeHRlbnRzKHRoaXMuaGFsZkV4dCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21wb3VuZFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYnRTaGFwZSBhcyBBbW1vLmJ0Qm94U2hhcGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIgYXMgQm94Q29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgaGFsZkV4dDogQW1tby5idFZlY3RvcjM7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKEFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMuQk9YX1NIQVBFX1BST1hZVFlQRSk7XHJcbiAgICAgICAgdGhpcy5oYWxmRXh0ID0gbmV3IEFtbW8uYnRWZWN0b3IzKDAuNSwgMC41LCAwLjUpO1xyXG4gICAgICAgIHRoaXMuX2J0U2hhcGUgPSBuZXcgQW1tby5idEJveFNoYXBlKHRoaXMuaGFsZkV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db21wb25lbnRTZXQgKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U2l6ZSh0aGlzLmNvbGxpZGVyLnNpemUpO1xyXG4gICAgICAgIHRoaXMuc2V0U2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIEFtbW8uZGVzdHJveSh0aGlzLmhhbGZFeHQpO1xyXG4gICAgICAgIGFtbW9EZWxldGVQdHIodGhpcy5oYWxmRXh0LCBBbW1vLmJ0VmVjdG9yMyk7XHJcbiAgICAgICAgKHRoaXMuaGFsZkV4dCBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0U2NhbGUoKTtcclxuICAgICAgICBjb2NvczJBbW1vVmVjMyh0aGlzLnNjYWxlLCB0aGlzLl9jb2xsaWRlci5ub2RlLndvcmxkU2NhbGUpO1xyXG4gICAgICAgIHRoaXMuX2J0U2hhcGUuc2V0TG9jYWxTY2FsaW5nKHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19