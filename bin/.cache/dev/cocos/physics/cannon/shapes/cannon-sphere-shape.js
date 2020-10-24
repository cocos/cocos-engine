(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "../../framework/util.js", "../cannon-util.js", "./cannon-shape.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("../../framework/util.js"), require("../cannon-util.js"), require("./cannon-shape.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.util, global.cannonUtil, global.cannonShape);
    global.cannonSphereShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _util, _cannonUtil, _cannonShape) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonSphereShape = void 0;
  _cannon = _interopRequireDefault(_cannon);

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

  var CannonSphereShape = /*#__PURE__*/function (_CannonShape) {
    _inherits(CannonSphereShape, _CannonShape);

    _createClass(CannonSphereShape, [{
      key: "setRadius",
      value: function setRadius(v) {
        var max = (0, _util.maxComponent)(this.collider.node.worldScale);
        this.impl.radius = v * Math.abs(max);
        this.impl.updateBoundingSphereRadius();

        if (this._index != -1) {
          (0, _cannonUtil.commitShapeUpdates)(this._body);
        }
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }, {
      key: "impl",
      get: function get() {
        return this._shape;
      }
    }]);

    function CannonSphereShape() {
      var _this;

      var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;

      _classCallCheck(this, CannonSphereShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CannonSphereShape).call(this));
      _this._shape = new _cannon.default.Sphere(radius);
      return _this;
    }

    _createClass(CannonSphereShape, [{
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(CannonSphereShape.prototype), "onLoad", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "setScale",
      value: function setScale(scale) {
        _get(_getPrototypeOf(CannonSphereShape.prototype), "setScale", this).call(this, scale);

        this.setRadius(this.collider.radius);
      }
    }]);

    return CannonSphereShape;
  }(_cannonShape.CannonShape);

  _exports.CannonSphereShape = CannonSphereShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tc3BoZXJlLXNoYXBlLnRzIl0sIm5hbWVzIjpbIkNhbm5vblNwaGVyZVNoYXBlIiwidiIsIm1heCIsImNvbGxpZGVyIiwibm9kZSIsIndvcmxkU2NhbGUiLCJpbXBsIiwicmFkaXVzIiwiTWF0aCIsImFicyIsInVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzIiwiX2luZGV4IiwiX2JvZHkiLCJfY29sbGlkZXIiLCJfc2hhcGUiLCJDQU5OT04iLCJTcGhlcmUiLCJzZXRSYWRpdXMiLCJzY2FsZSIsIkNhbm5vblNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFRYUEsaUI7Ozs7O2dDQVVFQyxDLEVBQVc7QUFDbEIsWUFBTUMsR0FBRyxHQUFHLHdCQUFhLEtBQUtDLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQkMsVUFBaEMsQ0FBWjtBQUNBLGFBQUtDLElBQUwsQ0FBVUMsTUFBVixHQUFtQk4sQ0FBQyxHQUFHTyxJQUFJLENBQUNDLEdBQUwsQ0FBU1AsR0FBVCxDQUF2QjtBQUNBLGFBQUtJLElBQUwsQ0FBVUksMEJBQVY7O0FBQ0EsWUFBSSxLQUFLQyxNQUFMLElBQWUsQ0FBQyxDQUFwQixFQUF1QjtBQUNuQiw4Q0FBbUIsS0FBS0MsS0FBeEI7QUFDSDtBQUNKOzs7MEJBZmU7QUFDWixlQUFPLEtBQUtDLFNBQVo7QUFDSDs7OzBCQUVXO0FBQ1IsZUFBTyxLQUFLQyxNQUFaO0FBQ0g7OztBQVdELGlDQUEyQjtBQUFBOztBQUFBLFVBQWRQLE1BQWMsdUVBQUwsR0FBSzs7QUFBQTs7QUFDdkI7QUFDQSxZQUFLTyxNQUFMLEdBQWMsSUFBSUMsZ0JBQU9DLE1BQVgsQ0FBa0JULE1BQWxCLENBQWQ7QUFGdUI7QUFHMUI7Ozs7K0JBRVM7QUFDTjs7QUFDQSxhQUFLVSxTQUFMLENBQWUsS0FBS2QsUUFBTCxDQUFjSSxNQUE3QjtBQUNIOzs7K0JBRVNXLEssRUFBbUI7QUFDekIsd0ZBQWVBLEtBQWY7O0FBQ0EsYUFBS0QsU0FBTCxDQUFlLEtBQUtkLFFBQUwsQ0FBY0ksTUFBN0I7QUFDSDs7OztJQWhDa0NZLHdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENBTk5PTiBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IG1heENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2ZyYW1ld29yay91dGlsJztcclxuaW1wb3J0IHsgY29tbWl0U2hhcGVVcGRhdGVzIH0gZnJvbSAnLi4vY2Fubm9uLXV0aWwnO1xyXG5pbXBvcnQgeyBDYW5ub25TaGFwZSB9IGZyb20gJy4vY2Fubm9uLXNoYXBlJztcclxuaW1wb3J0IHsgSVNwaGVyZVNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBTcGhlcmVDb2xsaWRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhbm5vblNwaGVyZVNoYXBlIGV4dGVuZHMgQ2Fubm9uU2hhcGUgaW1wbGVtZW50cyBJU3BoZXJlU2hhcGUge1xyXG5cclxuICAgIGdldCBjb2xsaWRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpZGVyIGFzIFNwaGVyZUNvbGxpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGUgYXMgQ0FOTk9OLlNwaGVyZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRSYWRpdXMgKHY6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IG1heCA9IG1heENvbXBvbmVudCh0aGlzLmNvbGxpZGVyLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICAgICAgdGhpcy5pbXBsLnJhZGl1cyA9IHYgKiBNYXRoLmFicyhtYXgpO1xyXG4gICAgICAgIHRoaXMuaW1wbC51cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICBjb21taXRTaGFwZVVwZGF0ZXModGhpcy5fYm9keSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyYWRpdXMgPSAwLjUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3NoYXBlID0gbmV3IENBTk5PTi5TcGhlcmUocmFkaXVzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UmFkaXVzKHRoaXMuY29sbGlkZXIucmFkaXVzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZSAoc2NhbGU6IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5zZXRTY2FsZShzY2FsZSk7XHJcbiAgICAgICAgdGhpcy5zZXRSYWRpdXModGhpcy5jb2xsaWRlci5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=