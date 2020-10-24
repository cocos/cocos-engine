(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./ammo-instantiated.js", "../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./ammo-instantiated.js"), require("../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.index);
    global.ammoConst = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CC_QUAT_0 = _exports.CC_V3_1 = _exports.CC_V3_0 = _exports.AmmoConstant = _exports.CollisionEventObject = _exports.TriggerEventObject = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var TriggerEventObject = {
    type: 'onTriggerEnter',
    selfCollider: null,
    otherCollider: null,
    impl: null
  };
  _exports.TriggerEventObject = TriggerEventObject;
  var CollisionEventObject = {
    type: 'onCollisionEnter',
    selfCollider: null,
    otherCollider: null,
    contacts: [],
    impl: null
  };
  _exports.CollisionEventObject = CollisionEventObject;

  var AmmoConstant = /*#__PURE__*/function () {
    function AmmoConstant() {
      _classCallCheck(this, AmmoConstant);

      this.EMPTY_SHAPE = new _ammoInstantiated.default.btEmptyShape();
      this.TRANSFORM = new _ammoInstantiated.default.btTransform();
      this.VECTOR3_0 = new _ammoInstantiated.default.btVector3();
      this.VECTOR3_1 = new _ammoInstantiated.default.btVector3();
      this.QUAT_0 = new _ammoInstantiated.default.btQuaternion();
    }

    _createClass(AmmoConstant, null, [{
      key: "instance",
      get: function get() {
        if (AmmoConstant._instance == null) AmmoConstant._instance = new AmmoConstant();
        return AmmoConstant._instance;
      }
    }]);

    return AmmoConstant;
  }();

  _exports.AmmoConstant = AmmoConstant;
  AmmoConstant._instance = void 0;
  var CC_V3_0 = new _index.Vec3();
  _exports.CC_V3_0 = CC_V3_0;
  var CC_V3_1 = new _index.Vec3();
  _exports.CC_V3_1 = CC_V3_1;
  var CC_QUAT_0 = new _index.Quat();
  _exports.CC_QUAT_0 = CC_QUAT_0;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9hbW1vLWNvbnN0LnRzIl0sIm5hbWVzIjpbIlRyaWdnZXJFdmVudE9iamVjdCIsInR5cGUiLCJzZWxmQ29sbGlkZXIiLCJvdGhlckNvbGxpZGVyIiwiaW1wbCIsIkNvbGxpc2lvbkV2ZW50T2JqZWN0IiwiY29udGFjdHMiLCJBbW1vQ29uc3RhbnQiLCJFTVBUWV9TSEFQRSIsIkFtbW8iLCJidEVtcHR5U2hhcGUiLCJUUkFOU0ZPUk0iLCJidFRyYW5zZm9ybSIsIlZFQ1RPUjNfMCIsImJ0VmVjdG9yMyIsIlZFQ1RPUjNfMSIsIlFVQVRfMCIsImJ0UXVhdGVybmlvbiIsIl9pbnN0YW5jZSIsIkNDX1YzXzAiLCJWZWMzIiwiQ0NfVjNfMSIsIkNDX1FVQVRfMCIsIlF1YXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSU8sTUFBTUEsa0JBQWtCLEdBQUc7QUFDOUJDLElBQUFBLElBQUksRUFBRSxnQkFEd0I7QUFFOUJDLElBQUFBLFlBQVksRUFBRSxJQUZnQjtBQUc5QkMsSUFBQUEsYUFBYSxFQUFFLElBSGU7QUFJOUJDLElBQUFBLElBQUksRUFBRTtBQUp3QixHQUEzQjs7QUFPQSxNQUFNQyxvQkFBb0IsR0FBRztBQUNoQ0osSUFBQUEsSUFBSSxFQUFFLGtCQUQwQjtBQUVoQ0MsSUFBQUEsWUFBWSxFQUFFLElBRmtCO0FBR2hDQyxJQUFBQSxhQUFhLEVBQUUsSUFIaUI7QUFJaENHLElBQUFBLFFBQVEsRUFBRSxFQUpzQjtBQUtoQ0YsSUFBQUEsSUFBSSxFQUFFO0FBTDBCLEdBQTdCOzs7TUFRTUcsWTs7OztXQU1BQyxXLEdBQWMsSUFBSUMsMEJBQUtDLFlBQVQsRTtXQUNkQyxTLEdBQVksSUFBSUYsMEJBQUtHLFdBQVQsRTtXQUNaQyxTLEdBQVksSUFBSUosMEJBQUtLLFNBQVQsRTtXQUNaQyxTLEdBQVksSUFBSU4sMEJBQUtLLFNBQVQsRTtXQUNaRSxNLEdBQVMsSUFBSVAsMEJBQUtRLFlBQVQsRTs7Ozs7MEJBUks7QUFDbkIsWUFBSVYsWUFBWSxDQUFDVyxTQUFiLElBQTBCLElBQTlCLEVBQW9DWCxZQUFZLENBQUNXLFNBQWIsR0FBeUIsSUFBSVgsWUFBSixFQUF6QjtBQUNwQyxlQUFPQSxZQUFZLENBQUNXLFNBQXBCO0FBQ0g7Ozs7Ozs7QUFMUVgsRUFBQUEsWSxDQUNNVyxTO0FBWVosTUFBTUMsT0FBTyxHQUFHLElBQUlDLFdBQUosRUFBaEI7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHLElBQUlELFdBQUosRUFBaEI7O0FBQ0EsTUFBTUUsU0FBUyxHQUFHLElBQUlDLFdBQUosRUFBbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW1tbyBmcm9tICcuL2FtbW8taW5zdGFudGlhdGVkJztcclxuaW1wb3J0IHsgQ29sbGlkZXIsIFRyaWdnZXJFdmVudFR5cGUsIENvbGxpc2lvbkV2ZW50VHlwZSwgSUNvbnRhY3RFcXVhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBWZWMzLCBRdWF0IH0gZnJvbSAnLi4vLi4vY29yZSc7XHJcblxyXG5leHBvcnQgY29uc3QgVHJpZ2dlckV2ZW50T2JqZWN0ID0ge1xyXG4gICAgdHlwZTogJ29uVHJpZ2dlckVudGVyJyBhcyB1bmtub3duIGFzIFRyaWdnZXJFdmVudFR5cGUsXHJcbiAgICBzZWxmQ29sbGlkZXI6IG51bGwgYXMgdW5rbm93biBhcyBDb2xsaWRlcixcclxuICAgIG90aGVyQ29sbGlkZXI6IG51bGwgYXMgdW5rbm93biBhcyBDb2xsaWRlcixcclxuICAgIGltcGw6IG51bGwsXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgQ29sbGlzaW9uRXZlbnRPYmplY3QgPSB7XHJcbiAgICB0eXBlOiAnb25Db2xsaXNpb25FbnRlcicgYXMgQ29sbGlzaW9uRXZlbnRUeXBlLFxyXG4gICAgc2VsZkNvbGxpZGVyOiBudWxsIGFzIHVua25vd24gYXMgQ29sbGlkZXIsXHJcbiAgICBvdGhlckNvbGxpZGVyOiBudWxsIGFzIHVua25vd24gYXMgQ29sbGlkZXIsXHJcbiAgICBjb250YWN0czogW10gYXMgSUNvbnRhY3RFcXVhdGlvbltdLFxyXG4gICAgaW1wbDogbnVsbCxcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbW1vQ29uc3RhbnQge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBBbW1vQ29uc3RhbnQ7XHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlICgpIHtcclxuICAgICAgICBpZiAoQW1tb0NvbnN0YW50Ll9pbnN0YW5jZSA9PSBudWxsKSBBbW1vQ29uc3RhbnQuX2luc3RhbmNlID0gbmV3IEFtbW9Db25zdGFudDtcclxuICAgICAgICByZXR1cm4gQW1tb0NvbnN0YW50Ll9pbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHJlYWRvbmx5IEVNUFRZX1NIQVBFID0gbmV3IEFtbW8uYnRFbXB0eVNoYXBlKCk7XHJcbiAgICByZWFkb25seSBUUkFOU0ZPUk0gPSBuZXcgQW1tby5idFRyYW5zZm9ybSgpO1xyXG4gICAgcmVhZG9ubHkgVkVDVE9SM18wID0gbmV3IEFtbW8uYnRWZWN0b3IzKCk7XHJcbiAgICByZWFkb25seSBWRUNUT1IzXzEgPSBuZXcgQW1tby5idFZlY3RvcjMoKTtcclxuICAgIHJlYWRvbmx5IFFVQVRfMCA9IG5ldyBBbW1vLmJ0UXVhdGVybmlvbigpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQ0NfVjNfMCA9IG5ldyBWZWMzKCk7XHJcbmV4cG9ydCBjb25zdCBDQ19WM18xID0gbmV3IFZlYzMoKTtcclxuZXhwb3J0IGNvbnN0IENDX1FVQVRfMCA9IG5ldyBRdWF0KCk7XHJcbiJdfQ==