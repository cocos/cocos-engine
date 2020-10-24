(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "../../../../core/index.js", "../rigid-body.js", "../../../../core/event/index.js", "../../../../core/default-constants.js", "../../instance.js", "../../physics-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("../../../../core/index.js"), require("../rigid-body.js"), require("../../../../core/event/index.js"), require("../../../../core/default-constants.js"), require("../../instance.js"), require("../../physics-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.rigidBody, global.index, global.defaultConstants, global.instance, global.physicsEnum);
    global.constraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _rigidBody, _index3, _defaultConstants, _instance, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Constraint = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var Constraint = (_dec = (0, _index.ccclass)('cc.Constraint'), _dec2 = (0, _index.requireComponent)(_rigidBody.RigidBody), _dec3 = (0, _index.type)(_rigidBody.RigidBody), _dec4 = (0, _index.displayOrder)(-2), _dec5 = (0, _index.type)(_rigidBody.RigidBody), _dec6 = (0, _index.displayOrder)(-1), _dec7 = (0, _index.displayOrder)(0), _dec8 = (0, _index.type)(_rigidBody.RigidBody), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Eventify) {
    _inherits(Constraint, _Eventify);

    _createClass(Constraint, [{
      key: "attachedBody",
      get: function get() {
        return this.getComponent(_rigidBody.RigidBody);
      }
    }, {
      key: "connectedBody",
      get: function get() {
        return this._connectedBody;
      },
      set: function set(v) {
        this._connectedBody = v;

        if (!_defaultConstants.EDITOR) {
          if (this._constraint) this._constraint.setConnectedBody(v);
        }
      }
    }, {
      key: "enableCollision",
      get: function get() {
        return this._enableCollision;
      },
      set: function set(v) {
        this._enableCollision = v;

        if (!_defaultConstants.EDITOR) {
          if (this._constraint) this._constraint.setEnableCollision(v);
        }
      }
    }]);

    function Constraint(type) {
      var _this;

      _classCallCheck(this, Constraint);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Constraint).call(this));
      _this.TYPE = void 0;

      _initializerDefineProperty(_this, "_enableCollision", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_connectedBody", _descriptor2, _assertThisInitialized(_this));

      _this._constraint = null;
      _this.TYPE = type;
      return _this;
    } /// COMPONENT LIFECYCLE ///


    _createClass(Constraint, [{
      key: "onLoad",
      value: function onLoad() {
        if (!_defaultConstants.EDITOR) {
          this._constraint = (0, _instance.createConstraint)(this.TYPE);

          this._constraint.initialize(this);

          this._constraint.onLoad();
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._constraint) {
          this._constraint.onEnable();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._constraint) {
          this._constraint.onDisable();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._constraint) {
          this._constraint.onDestroy();
        }
      }
    }]);

    return Constraint;
  }((0, _index3.Eventify)(_index2.Component)), _class3.EConstraintType = _physicsEnum.EConstraintType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "attachedBody", [_dec3, _index.readOnly, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "attachedBody"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "connectedBody", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "connectedBody"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "enableCollision", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "enableCollision"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enableCollision", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_connectedBody", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class);
  _exports.Constraint = Constraint;

  (function (_Constraint) {})(Constraint || (_exports.Constraint = Constraint = {}));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29uc3RyYWludHMvY29uc3RyYWludC50cyJdLCJuYW1lcyI6WyJDb25zdHJhaW50IiwiUmlnaWRCb2R5IiwiZ2V0Q29tcG9uZW50IiwiX2Nvbm5lY3RlZEJvZHkiLCJ2IiwiRURJVE9SIiwiX2NvbnN0cmFpbnQiLCJzZXRDb25uZWN0ZWRCb2R5IiwiX2VuYWJsZUNvbGxpc2lvbiIsInNldEVuYWJsZUNvbGxpc2lvbiIsInR5cGUiLCJUWVBFIiwiaW5pdGlhbGl6ZSIsIm9uTG9hZCIsIm9uRW5hYmxlIiwib25EaXNhYmxlIiwib25EZXN0cm95IiwiQ29tcG9uZW50IiwiRUNvbnN0cmFpbnRUeXBlIiwicmVhZE9ubHkiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFlYUEsVSxXQUZaLG9CQUFRLGVBQVIsQyxVQUNBLDZCQUFpQkMsb0JBQWpCLEMsVUFLSSxpQkFBS0Esb0JBQUwsQyxVQUVBLHlCQUFhLENBQUMsQ0FBZCxDLFVBS0EsaUJBQUtBLG9CQUFMLEMsVUFDQSx5QkFBYSxDQUFDLENBQWQsQyxVQVlBLHlCQUFhLENBQWIsQyxVQW1CQSxpQkFBS0Esb0JBQUwsQzs7Ozs7MEJBcENxQztBQUNsQyxlQUFPLEtBQUtDLFlBQUwsQ0FBa0JELG9CQUFsQixDQUFQO0FBQ0g7OzswQkFJc0M7QUFDbkMsZUFBTyxLQUFLRSxjQUFaO0FBQ0gsTzt3QkFFa0JDLEMsRUFBcUI7QUFDcEMsYUFBS0QsY0FBTCxHQUFzQkMsQ0FBdEI7O0FBQ0EsWUFBSSxDQUFDQyx3QkFBTCxFQUFhO0FBQ1QsY0FBSSxLQUFLQyxXQUFULEVBQXNCLEtBQUtBLFdBQUwsQ0FBaUJDLGdCQUFqQixDQUFrQ0gsQ0FBbEM7QUFDekI7QUFDSjs7OzBCQUdzQjtBQUNuQixlQUFPLEtBQUtJLGdCQUFaO0FBQ0gsTzt3QkFFb0JKLEMsRUFBRztBQUNwQixhQUFLSSxnQkFBTCxHQUF3QkosQ0FBeEI7O0FBQ0EsWUFBSSxDQUFDQyx3QkFBTCxFQUFhO0FBQ1QsY0FBSSxLQUFLQyxXQUFULEVBQXNCLEtBQUtBLFdBQUwsQ0FBaUJHLGtCQUFqQixDQUFvQ0wsQ0FBcEM7QUFDekI7QUFDSjs7O0FBY0Qsd0JBQWFNLElBQWIsRUFBb0M7QUFBQTs7QUFBQTs7QUFDaEM7QUFEZ0MsWUFaM0JDLElBWTJCOztBQUFBOztBQUFBOztBQUFBLFlBRjFCTCxXQUUwQixHQUZZLElBRVo7QUFFaEMsWUFBS0ssSUFBTCxHQUFZRCxJQUFaO0FBRmdDO0FBR25DLEssQ0FFRDs7Ozs7K0JBRW9CO0FBQ2hCLFlBQUksQ0FBQ0wsd0JBQUwsRUFBYTtBQUNULGVBQUtDLFdBQUwsR0FBbUIsZ0NBQWlCLEtBQUtLLElBQXRCLENBQW5COztBQUNBLGVBQUtMLFdBQUwsQ0FBaUJNLFVBQWpCLENBQTRCLElBQTVCOztBQUNBLGVBQUtOLFdBQUwsQ0FBaUJPLE1BQWpCO0FBQ0g7QUFDSjs7O2lDQUVxQjtBQUNsQixZQUFJLEtBQUtQLFdBQVQsRUFBc0I7QUFDbEIsZUFBS0EsV0FBTCxDQUFpQlEsUUFBakI7QUFDSDtBQUNKOzs7a0NBRXNCO0FBQ25CLFlBQUksS0FBS1IsV0FBVCxFQUFzQjtBQUNsQixlQUFLQSxXQUFMLENBQWlCUyxTQUFqQjtBQUNIO0FBQ0o7OztrQ0FFc0I7QUFDbkIsWUFBSSxLQUFLVCxXQUFULEVBQXNCO0FBQ2xCLGVBQUtBLFdBQUwsQ0FBaUJVLFNBQWpCO0FBQ0g7QUFDSjs7OztJQS9FMkIsc0JBQVNDLGlCQUFULEMsV0FFWkMsZSxHQUFrQkEsNEIsZ0ZBR2pDQyxlLDZmQW1DQUMsbUI7Ozs7O2FBQzRCLEk7Ozs7Ozs7YUFHZ0IsSTs7Ozs7OEJBc0NoQ3BCLFUsMkJBQUFBLFUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBoeXNpY3NcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCByZXF1aXJlQ29tcG9uZW50LCBkaXNwbGF5T3JkZXIsIHR5cGUsIHJlYWRPbmx5LCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgUmlnaWRCb2R5IH0gZnJvbSAnLi4vcmlnaWQtYm9keSc7XHJcbmltcG9ydCB7IEV2ZW50aWZ5IH0gZnJvbSAnLi4vLi4vLi4vLi4vY29yZS9ldmVudCc7XHJcbmltcG9ydCB7IElCYXNlQ29uc3RyYWludCB9IGZyb20gJy4uLy4uLy4uL3NwZWMvaS1waHlzaWNzLWNvbnN0cmFpbnQnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBjcmVhdGVDb25zdHJhaW50IH0gZnJvbSAnLi4vLi4vaW5zdGFuY2UnO1xyXG5pbXBvcnQgeyBFQ29uc3RyYWludFR5cGUgfSBmcm9tICcuLi8uLi9waHlzaWNzLWVudW0nO1xyXG5cclxuQGNjY2xhc3MoJ2NjLkNvbnN0cmFpbnQnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChSaWdpZEJvZHkpXHJcbmV4cG9ydCBjbGFzcyBDb25zdHJhaW50IGV4dGVuZHMgRXZlbnRpZnkoQ29tcG9uZW50KSB7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IEVDb25zdHJhaW50VHlwZSA9IEVDb25zdHJhaW50VHlwZTtcclxuXHJcbiAgICBAdHlwZShSaWdpZEJvZHkpXHJcbiAgICBAcmVhZE9ubHlcclxuICAgIEBkaXNwbGF5T3JkZXIoLTIpXHJcbiAgICBnZXQgYXR0YWNoZWRCb2R5ICgpOiBSaWdpZEJvZHkgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnQoUmlnaWRCb2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBAdHlwZShSaWdpZEJvZHkpXHJcbiAgICBAZGlzcGxheU9yZGVyKC0xKVxyXG4gICAgZ2V0IGNvbm5lY3RlZEJvZHkgKCk6IFJpZ2lkQm9keSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25uZWN0ZWRCb2R5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb25uZWN0ZWRCb2R5ICh2OiBSaWdpZEJvZHkgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGVkQm9keSA9IHY7XHJcbiAgICAgICAgaWYgKCFFRElUT1IpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbnN0cmFpbnQpIHRoaXMuX2NvbnN0cmFpbnQuc2V0Q29ubmVjdGVkQm9keSh2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgZ2V0IGVuYWJsZUNvbGxpc2lvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZUNvbGxpc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZW5hYmxlQ29sbGlzaW9uICh2KSB7XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlQ29sbGlzaW9uID0gdjtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY29uc3RyYWludCkgdGhpcy5fY29uc3RyYWludC5zZXRFbmFibGVDb2xsaXNpb24odik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IFRZUEU6IEVDb25zdHJhaW50VHlwZTtcclxuXHJcbiAgICAvLy8gUFJPVEVDVEVEIFBST1BFUlRZIC8vL1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZW5hYmxlQ29sbGlzaW9uID0gdHJ1ZTtcclxuXHJcbiAgICBAdHlwZShSaWdpZEJvZHkpXHJcbiAgICBwcm90ZWN0ZWQgX2Nvbm5lY3RlZEJvZHk6IFJpZ2lkQm9keSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfY29uc3RyYWludDogSUJhc2VDb25zdHJhaW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHR5cGU6IEVDb25zdHJhaW50VHlwZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5UWVBFID0gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8gQ09NUE9ORU5UIExJRkVDWUNMRSAvLy9cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkICgpIHtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25zdHJhaW50ID0gY3JlYXRlQ29uc3RyYWludCh0aGlzLlRZUEUpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25zdHJhaW50LmluaXRpYWxpemUodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnN0cmFpbnQub25Mb2FkISgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25FbmFibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25zdHJhaW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnN0cmFpbnQub25FbmFibGUhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25zdHJhaW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnN0cmFpbnQub25EaXNhYmxlISgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29uc3RyYWludCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25zdHJhaW50Lm9uRGVzdHJveSEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgQ29uc3RyYWludCB7XHJcbiAgICBleHBvcnQgdHlwZSBFQ29uc3RyYWludFR5cGUgPSBFbnVtQWxpYXM8dHlwZW9mIEVDb25zdHJhaW50VHlwZT47XHJcbn1cclxuIl19