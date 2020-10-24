(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./builtin-shape.js", "../../../core/geometry/index.js", "../../framework/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./builtin-shape.js"), require("../../../core/geometry/index.js"), require("../../framework/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.builtinShape, global.index, global.index);
    global.builtinCapsuleShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _builtinShape, _index, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BuiltinCapsuleShape = void 0;

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

  var BuiltinCapsuleShape = /*#__PURE__*/function (_BuiltinShape) {
    _inherits(BuiltinCapsuleShape, _BuiltinShape);

    _createClass(BuiltinCapsuleShape, [{
      key: "localCapsule",
      get: function get() {
        return this._localShape;
      }
    }, {
      key: "worldCapsule",
      get: function get() {
        return this._worldShape;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }]);

    function BuiltinCapsuleShape() {
      var _this;

      var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _index2.EAxisDirection.Y_AXIS;

      _classCallCheck(this, BuiltinCapsuleShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BuiltinCapsuleShape).call(this));
      var halfHeight = (height - radius * 2) / 2;
      var h = halfHeight < 0 ? 0 : halfHeight;
      _this._localShape = new _index.capsule(radius, h, direction);
      _this._worldShape = new _index.capsule(radius, h, direction);
      return _this;
    }

    _createClass(BuiltinCapsuleShape, [{
      key: "setRadius",
      value: function setRadius(v) {
        this.localCapsule.radius = v;
        this.transform(this._sharedBody.node.worldMatrix, this._sharedBody.node.worldPosition, this._sharedBody.node.worldRotation, this._sharedBody.node.worldScale);
      }
    }, {
      key: "setCylinderHeight",
      value: function setCylinderHeight(v) {
        this.localCapsule.halfHeight = v / 2;
        this.localCapsule.updateCache();
        this.transform(this._sharedBody.node.worldMatrix, this._sharedBody.node.worldPosition, this._sharedBody.node.worldRotation, this._sharedBody.node.worldScale);
      }
    }, {
      key: "setDirection",
      value: function setDirection(v) {
        this.localCapsule.axis = v;
        this.localCapsule.updateCache();
        this.worldCapsule.axis = v;
        this.worldCapsule.updateCache();
        this.transform(this._sharedBody.node.worldMatrix, this._sharedBody.node.worldPosition, this._sharedBody.node.worldRotation, this._sharedBody.node.worldScale);
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(BuiltinCapsuleShape.prototype), "onLoad", this).call(this);

        this.setRadius(this.collider.radius);
        this.setDirection(this.collider.direction);
      }
    }]);

    return BuiltinCapsuleShape;
  }(_builtinShape.BuiltinShape);

  _exports.BuiltinCapsuleShape = BuiltinCapsuleShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3Mvc2hhcGVzL2J1aWx0aW4tY2Fwc3VsZS1zaGFwZS50cyJdLCJuYW1lcyI6WyJCdWlsdGluQ2Fwc3VsZVNoYXBlIiwiX2xvY2FsU2hhcGUiLCJfd29ybGRTaGFwZSIsIl9jb2xsaWRlciIsInJhZGl1cyIsImhlaWdodCIsImRpcmVjdGlvbiIsIkVBeGlzRGlyZWN0aW9uIiwiWV9BWElTIiwiaGFsZkhlaWdodCIsImgiLCJjYXBzdWxlIiwidiIsImxvY2FsQ2Fwc3VsZSIsInRyYW5zZm9ybSIsIl9zaGFyZWRCb2R5Iiwibm9kZSIsIndvcmxkTWF0cml4Iiwid29ybGRQb3NpdGlvbiIsIndvcmxkUm90YXRpb24iLCJ3b3JsZFNjYWxlIiwidXBkYXRlQ2FjaGUiLCJheGlzIiwid29ybGRDYXBzdWxlIiwic2V0UmFkaXVzIiwiY29sbGlkZXIiLCJzZXREaXJlY3Rpb24iLCJCdWlsdGluU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU1hQSxtQjs7Ozs7MEJBRVc7QUFDaEIsZUFBTyxLQUFLQyxXQUFaO0FBQ0g7OzswQkFFbUI7QUFDaEIsZUFBTyxLQUFLQyxXQUFaO0FBQ0g7OzswQkFFZTtBQUNaLGVBQU8sS0FBS0MsU0FBWjtBQUNIOzs7QUFFRCxtQ0FBMEU7QUFBQTs7QUFBQSxVQUE3REMsTUFBNkQsdUVBQXBELEdBQW9EO0FBQUEsVUFBL0NDLE1BQStDLHVFQUF0QyxDQUFzQztBQUFBLFVBQW5DQyxTQUFtQyx1RUFBdkJDLHVCQUFlQyxNQUFROztBQUFBOztBQUN0RTtBQUNBLFVBQU1DLFVBQVUsR0FBRyxDQUFDSixNQUFNLEdBQUdELE1BQU0sR0FBRyxDQUFuQixJQUF3QixDQUEzQztBQUNBLFVBQU1NLENBQUMsR0FBR0QsVUFBVSxHQUFHLENBQWIsR0FBaUIsQ0FBakIsR0FBcUJBLFVBQS9CO0FBQ0EsWUFBS1IsV0FBTCxHQUFtQixJQUFJVSxjQUFKLENBQVlQLE1BQVosRUFBb0JNLENBQXBCLEVBQXVCSixTQUF2QixDQUFuQjtBQUNBLFlBQUtKLFdBQUwsR0FBbUIsSUFBSVMsY0FBSixDQUFZUCxNQUFaLEVBQW9CTSxDQUFwQixFQUF1QkosU0FBdkIsQ0FBbkI7QUFMc0U7QUFNekU7Ozs7Z0NBRVVNLEMsRUFBVztBQUNsQixhQUFLQyxZQUFMLENBQWtCVCxNQUFsQixHQUEyQlEsQ0FBM0I7QUFDQSxhQUFLRSxTQUFMLENBQ0ksS0FBS0MsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JDLFdBRDFCLEVBRUksS0FBS0YsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JFLGFBRjFCLEVBR0ksS0FBS0gsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JHLGFBSDFCLEVBSUksS0FBS0osV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JJLFVBSjFCO0FBTUg7Ozt3Q0FFa0JSLEMsRUFBVztBQUMxQixhQUFLQyxZQUFMLENBQWtCSixVQUFsQixHQUErQkcsQ0FBQyxHQUFHLENBQW5DO0FBQ0EsYUFBS0MsWUFBTCxDQUFrQlEsV0FBbEI7QUFFQSxhQUFLUCxTQUFMLENBQ0ksS0FBS0MsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JDLFdBRDFCLEVBRUksS0FBS0YsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JFLGFBRjFCLEVBR0ksS0FBS0gsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JHLGFBSDFCLEVBSUksS0FBS0osV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JJLFVBSjFCO0FBTUg7OzttQ0FFYVIsQyxFQUFtQjtBQUM3QixhQUFLQyxZQUFMLENBQWtCUyxJQUFsQixHQUF5QlYsQ0FBekI7QUFDQSxhQUFLQyxZQUFMLENBQWtCUSxXQUFsQjtBQUVBLGFBQUtFLFlBQUwsQ0FBa0JELElBQWxCLEdBQXlCVixDQUF6QjtBQUNBLGFBQUtXLFlBQUwsQ0FBa0JGLFdBQWxCO0FBRUEsYUFBS1AsU0FBTCxDQUNJLEtBQUtDLFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCQyxXQUQxQixFQUVJLEtBQUtGLFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCRSxhQUYxQixFQUdJLEtBQUtILFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCRyxhQUgxQixFQUlJLEtBQUtKLFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCSSxVQUoxQjtBQU1IOzs7K0JBRVM7QUFDTjs7QUFDQSxhQUFLSSxTQUFMLENBQWUsS0FBS0MsUUFBTCxDQUFjckIsTUFBN0I7QUFDQSxhQUFLc0IsWUFBTCxDQUFrQixLQUFLRCxRQUFMLENBQWNuQixTQUFoQztBQUNIOzs7O0lBL0RvQ3FCLDBCIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IEJ1aWx0aW5TaGFwZSB9IGZyb20gJy4vYnVpbHRpbi1zaGFwZSc7XHJcbmltcG9ydCB7IElDYXBzdWxlU2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IGNhcHN1bGUgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgRUF4aXNEaXJlY3Rpb24sIENhcHN1bGVDb2xsaWRlciB9IGZyb20gJy4uLy4uL2ZyYW1ld29yayc7XHJcblxyXG5leHBvcnQgY2xhc3MgQnVpbHRpbkNhcHN1bGVTaGFwZSBleHRlbmRzIEJ1aWx0aW5TaGFwZSBpbXBsZW1lbnRzIElDYXBzdWxlU2hhcGUge1xyXG5cclxuICAgIGdldCBsb2NhbENhcHN1bGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbFNoYXBlIGFzIGNhcHN1bGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdvcmxkQ2Fwc3VsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dvcmxkU2hhcGUgYXMgY2Fwc3VsZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY29sbGlkZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xsaWRlciBhcyBDYXBzdWxlQ29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHJhZGl1cyA9IDAuNSwgaGVpZ2h0ID0gMiwgZGlyZWN0aW9uID0gRUF4aXNEaXJlY3Rpb24uWV9BWElTKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBjb25zdCBoYWxmSGVpZ2h0ID0gKGhlaWdodCAtIHJhZGl1cyAqIDIpIC8gMjtcclxuICAgICAgICBjb25zdCBoID0gaGFsZkhlaWdodCA8IDAgPyAwIDogaGFsZkhlaWdodDtcclxuICAgICAgICB0aGlzLl9sb2NhbFNoYXBlID0gbmV3IGNhcHN1bGUocmFkaXVzLCBoLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgIHRoaXMuX3dvcmxkU2hhcGUgPSBuZXcgY2Fwc3VsZShyYWRpdXMsIGgsIGRpcmVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UmFkaXVzICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmxvY2FsQ2Fwc3VsZS5yYWRpdXMgPSB2O1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKFxyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5Lm5vZGUud29ybGRNYXRyaXgsXHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkubm9kZS53b3JsZFBvc2l0aW9uLFxyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5Lm5vZGUud29ybGRSb3RhdGlvbixcclxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5ub2RlLndvcmxkU2NhbGVcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEN5bGluZGVySGVpZ2h0ICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmxvY2FsQ2Fwc3VsZS5oYWxmSGVpZ2h0ID0gdiAvIDI7XHJcbiAgICAgICAgdGhpcy5sb2NhbENhcHN1bGUudXBkYXRlQ2FjaGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oXHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkubm9kZS53b3JsZE1hdHJpeCxcclxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5ub2RlLndvcmxkUG9zaXRpb24sXHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkubm9kZS53b3JsZFJvdGF0aW9uLFxyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5Lm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGlyZWN0aW9uICh2OiBFQXhpc0RpcmVjdGlvbikge1xyXG4gICAgICAgIHRoaXMubG9jYWxDYXBzdWxlLmF4aXMgPSB2O1xyXG4gICAgICAgIHRoaXMubG9jYWxDYXBzdWxlLnVwZGF0ZUNhY2hlKCk7XHJcblxyXG4gICAgICAgIHRoaXMud29ybGRDYXBzdWxlLmF4aXMgPSB2O1xyXG4gICAgICAgIHRoaXMud29ybGRDYXBzdWxlLnVwZGF0ZUNhY2hlKCk7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKFxyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5Lm5vZGUud29ybGRNYXRyaXgsXHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkubm9kZS53b3JsZFBvc2l0aW9uLFxyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5Lm5vZGUud29ybGRSb3RhdGlvbixcclxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5ub2RlLndvcmxkU2NhbGVcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcbiAgICAgICAgdGhpcy5zZXRSYWRpdXModGhpcy5jb2xsaWRlci5yYWRpdXMpO1xyXG4gICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKHRoaXMuY29sbGlkZXIuZGlyZWN0aW9uKTtcclxuICAgIH1cclxufSJdfQ==