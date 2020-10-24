(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/math/index.js", "../../../../exports/physics-framework.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/math/index.js"), require("../../../../exports/physics-framework.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.physicsFramework);
    global.builtinShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _physicsFramework) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BuiltinShape = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var BuiltinShape = /*#__PURE__*/function () {
    function BuiltinShape() {
      _classCallCheck(this, BuiltinShape);

      this.id = BuiltinShape.idCounter++;
    }

    _createClass(BuiltinShape, [{
      key: "getAABB",
      value: function getAABB(v) {}
    }, {
      key: "getBoundingSphere",
      value: function getBoundingSphere(v) {}
    }, {
      key: "setMaterial",
      value: function setMaterial(v) {}
    }, {
      key: "setAsTrigger",
      value: function setAsTrigger(v) {}
    }, {
      key: "setCenter",
      value: function setCenter(v) {
        _index.Vec3.copy(this._localShape.center, v);
      }
    }, {
      key: "initialize",
      value: function initialize(comp) {
        this._collider = comp;
        this._sharedBody = _physicsFramework.PhysicsSystem.instance.physicsWorld.getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        this.setCenter(this._collider.center);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._sharedBody.addShape(this);

        this._sharedBody.enabled = true;
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._sharedBody.removeShape(this);

        this._sharedBody.enabled = false;
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this._sharedBody.reference = false;
        this._collider = null;
        this._localShape = null;
        this._worldShape = null;
      }
    }, {
      key: "transform",
      value: function transform(m, pos, rot, scale) {
        this._localShape.transform(m, pos, rot, scale, this._worldShape);
      }
      /** group */

    }, {
      key: "getGroup",
      value: function getGroup() {
        return this._sharedBody.getGroup();
      }
    }, {
      key: "setGroup",
      value: function setGroup(v) {
        this._sharedBody.setGroup(v);
      }
    }, {
      key: "addGroup",
      value: function addGroup(v) {
        this._sharedBody.addGroup(v);
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(v) {
        this._sharedBody.removeGroup(v);
      }
      /** mask */

    }, {
      key: "getMask",
      value: function getMask() {
        return this._sharedBody.getMask();
      }
    }, {
      key: "setMask",
      value: function setMask(v) {
        this._sharedBody.setMask(v);
      }
    }, {
      key: "addMask",
      value: function addMask(v) {
        this._sharedBody.addMask(v);
      }
    }, {
      key: "removeMask",
      value: function removeMask(v) {
        this._sharedBody.removeMask(v);
      }
    }, {
      key: "attachedRigidBody",
      get: function get() {
        return null;
      }
    }, {
      key: "localShape",
      get: function get() {
        return this._localShape;
      }
    }, {
      key: "worldShape",
      get: function get() {
        return this._worldShape;
      }
    }, {
      key: "impl",
      get: function get() {
        return this._worldShape;
      }
    }, {
      key: "sharedBody",
      get: function get() {
        return this._sharedBody;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
      /** id generator */

    }]);

    return BuiltinShape;
  }();

  _exports.BuiltinShape = BuiltinShape;
  BuiltinShape.idCounter = 0;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3Mvc2hhcGVzL2J1aWx0aW4tc2hhcGUudHMiXSwibmFtZXMiOlsiQnVpbHRpblNoYXBlIiwiaWQiLCJpZENvdW50ZXIiLCJ2IiwiVmVjMyIsImNvcHkiLCJfbG9jYWxTaGFwZSIsImNlbnRlciIsImNvbXAiLCJfY29sbGlkZXIiLCJfc2hhcmVkQm9keSIsIlBoeXNpY3NTeXN0ZW0iLCJpbnN0YW5jZSIsInBoeXNpY3NXb3JsZCIsImdldFNoYXJlZEJvZHkiLCJub2RlIiwicmVmZXJlbmNlIiwic2V0Q2VudGVyIiwiYWRkU2hhcGUiLCJlbmFibGVkIiwicmVtb3ZlU2hhcGUiLCJfd29ybGRTaGFwZSIsIm0iLCJwb3MiLCJyb3QiLCJzY2FsZSIsInRyYW5zZm9ybSIsImdldEdyb3VwIiwic2V0R3JvdXAiLCJhZGRHcm91cCIsInJlbW92ZUdyb3VwIiwiZ2V0TWFzayIsInNldE1hc2siLCJhZGRNYXNrIiwicmVtb3ZlTWFzayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFVYUEsWTs7OztXQWlDQUMsRSxHQUFhRCxZQUFZLENBQUNFLFNBQWIsRTs7Ozs7OEJBaENiQyxDLEVBQVMsQ0FBRzs7O3dDQUNGQSxDLEVBQVcsQ0FBRzs7O2tDQUNwQkEsQyxFQUEwQixDQUFHOzs7bUNBQzVCQSxDLEVBQVksQ0FBRzs7O2dDQUdsQkEsQyxFQUFjO0FBQ3JCQyxvQkFBS0MsSUFBTCxDQUFVLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQTNCLEVBQW1DSixDQUFuQztBQUNIOzs7aUNBK0JXSyxJLEVBQWdCO0FBQ3hCLGFBQUtDLFNBQUwsR0FBaUJELElBQWpCO0FBQ0EsYUFBS0UsV0FBTCxHQUFvQkMsZ0NBQWNDLFFBQWQsQ0FBdUJDLFlBQXhCLENBQXNEQyxhQUF0RCxDQUFvRSxLQUFLTCxTQUFMLENBQWVNLElBQW5GLENBQW5CO0FBQ0EsYUFBS0wsV0FBTCxDQUFpQk0sU0FBakIsR0FBNkIsSUFBN0I7QUFDSDs7OytCQUVTO0FBQ04sYUFBS0MsU0FBTCxDQUFlLEtBQUtSLFNBQUwsQ0FBZUYsTUFBOUI7QUFDSDs7O2lDQUVXO0FBQ1IsYUFBS0csV0FBTCxDQUFpQlEsUUFBakIsQ0FBMEIsSUFBMUI7O0FBQ0EsYUFBS1IsV0FBTCxDQUFpQlMsT0FBakIsR0FBMkIsSUFBM0I7QUFDSDs7O2tDQUVZO0FBQ1QsYUFBS1QsV0FBTCxDQUFpQlUsV0FBakIsQ0FBNkIsSUFBN0I7O0FBQ0EsYUFBS1YsV0FBTCxDQUFpQlMsT0FBakIsR0FBMkIsS0FBM0I7QUFDSDs7O2tDQUVZO0FBQ1QsYUFBS1QsV0FBTCxDQUFpQk0sU0FBakIsR0FBNkIsS0FBN0I7QUFDQyxhQUFLUCxTQUFOLEdBQTBCLElBQTFCO0FBQ0MsYUFBS0gsV0FBTixHQUE0QixJQUE1QjtBQUNDLGFBQUtlLFdBQU4sR0FBNEIsSUFBNUI7QUFDSDs7O2dDQUVVQyxDLEVBQVNDLEcsRUFBV0MsRyxFQUFXQyxLLEVBQWE7QUFDbkQsYUFBS25CLFdBQUwsQ0FBaUJvQixTQUFqQixDQUEyQkosQ0FBM0IsRUFBOEJDLEdBQTlCLEVBQW1DQyxHQUFuQyxFQUF3Q0MsS0FBeEMsRUFBK0MsS0FBS0osV0FBcEQ7QUFDSDtBQUVEOzs7O2lDQUMyQjtBQUN2QixlQUFPLEtBQUtYLFdBQUwsQ0FBaUJpQixRQUFqQixFQUFQO0FBQ0g7OzsrQkFFZ0J4QixDLEVBQWlCO0FBQzlCLGFBQUtPLFdBQUwsQ0FBaUJrQixRQUFqQixDQUEwQnpCLENBQTFCO0FBQ0g7OzsrQkFFZ0JBLEMsRUFBaUI7QUFDOUIsYUFBS08sV0FBTCxDQUFpQm1CLFFBQWpCLENBQTBCMUIsQ0FBMUI7QUFDSDs7O2tDQUVtQkEsQyxFQUFpQjtBQUNqQyxhQUFLTyxXQUFMLENBQWlCb0IsV0FBakIsQ0FBNkIzQixDQUE3QjtBQUNIO0FBRUQ7Ozs7Z0NBQzBCO0FBQ3RCLGVBQU8sS0FBS08sV0FBTCxDQUFpQnFCLE9BQWpCLEVBQVA7QUFDSDs7OzhCQUVlNUIsQyxFQUFpQjtBQUM3QixhQUFLTyxXQUFMLENBQWlCc0IsT0FBakIsQ0FBeUI3QixDQUF6QjtBQUNIOzs7OEJBRWVBLEMsRUFBaUI7QUFDN0IsYUFBS08sV0FBTCxDQUFpQnVCLE9BQWpCLENBQXlCOUIsQ0FBekI7QUFDSDs7O2lDQUVrQkEsQyxFQUFpQjtBQUNoQyxhQUFLTyxXQUFMLENBQWlCd0IsVUFBakIsQ0FBNEIvQixDQUE1QjtBQUNIOzs7MEJBbEcwQztBQUFFLGVBQU8sSUFBUDtBQUFjOzs7MEJBTXpDO0FBQ2QsZUFBTyxLQUFLRyxXQUFaO0FBQ0g7OzswQkFFaUI7QUFDZCxlQUFPLEtBQUtlLFdBQVo7QUFDSDs7OzBCQUVXO0FBQ1IsZUFBTyxLQUFLQSxXQUFaO0FBQ0g7OzswQkFFaUI7QUFDZCxlQUFPLEtBQUtYLFdBQVo7QUFDSDs7OzBCQUVlO0FBQ1osZUFBTyxLQUFLRCxTQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7QUEvQlNULEVBQUFBLFksQ0FnQ01FLFMsR0FBb0IsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdDQsIFF1YXQsIFZlYzMgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBCdWlsdGluU2hhcmVkQm9keSB9IGZyb20gJy4uL2J1aWx0aW4tc2hhcmVkLWJvZHknO1xyXG5pbXBvcnQgeyBJQnVpbHRpblNoYXBlIH0gZnJvbSAnLi4vYnVpbHRpbi1pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBDb2xsaWRlciwgUmlnaWRCb2R5LCBQaHlzaWNNYXRlcmlhbCwgUGh5c2ljc1N5c3RlbSB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBJQmFzZVNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBCdWlsdEluV29ybGQgfSBmcm9tICcuLi9idWlsdGluLXdvcmxkJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBhYWJiLCBzcGhlcmUgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2dlb21ldHJ5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBCdWlsdGluU2hhcGUgaW1wbGVtZW50cyBJQmFzZVNoYXBlIHtcclxuICAgIGdldEFBQkIgKHY6IGFhYmIpIHsgfVxyXG4gICAgZ2V0Qm91bmRpbmdTcGhlcmUgKHY6IHNwaGVyZSkgeyB9XHJcbiAgICBzZXRNYXRlcmlhbCAodjogUGh5c2ljTWF0ZXJpYWwgfCBudWxsKSB7IH1cclxuICAgIHNldEFzVHJpZ2dlciAodjogYm9vbGVhbikgeyB9XHJcbiAgICBnZXQgYXR0YWNoZWRSaWdpZEJvZHkgKCk6IFJpZ2lkQm9keSB8IG51bGwgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICAgIHNldENlbnRlciAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2xvY2FsU2hhcGUuY2VudGVyLCB2KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbG9jYWxTaGFwZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsU2hhcGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdvcmxkU2hhcGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93b3JsZFNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTaGFwZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2hhcmVkQm9keSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGlkIGdlbmVyYXRvciAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcmVhZG9ubHkgaWQ6IG51bWJlciA9IEJ1aWx0aW5TaGFwZS5pZENvdW50ZXIrKzs7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zaGFyZWRCb2R5ITogQnVpbHRpblNoYXJlZEJvZHk7XHJcbiAgICBwcm90ZWN0ZWQgX2NvbGxpZGVyITogQ29sbGlkZXI7XHJcbiAgICBwcm90ZWN0ZWQgX2xvY2FsU2hhcGUhOiBJQnVpbHRpblNoYXBlO1xyXG4gICAgcHJvdGVjdGVkIF93b3JsZFNoYXBlITogSUJ1aWx0aW5TaGFwZTtcclxuXHJcbiAgICBpbml0aWFsaXplIChjb21wOiBDb2xsaWRlcikge1xyXG4gICAgICAgIHRoaXMuX2NvbGxpZGVyID0gY29tcDtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5ID0gKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UucGh5c2ljc1dvcmxkIGFzIEJ1aWx0SW5Xb3JsZCkuZ2V0U2hhcmVkQm9keSh0aGlzLl9jb2xsaWRlci5ub2RlIGFzIE5vZGUpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuc2V0Q2VudGVyKHRoaXMuX2NvbGxpZGVyLmNlbnRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgb25FbmFibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuYWRkU2hhcGUodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5lbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVtb3ZlU2hhcGUodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5lbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IGZhbHNlO1xyXG4gICAgICAgICh0aGlzLl9jb2xsaWRlciBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICAodGhpcy5fbG9jYWxTaGFwZSBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICAodGhpcy5fd29ybGRTaGFwZSBhcyBhbnkpID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm0gKG06IE1hdDQsIHBvczogVmVjMywgcm90OiBRdWF0LCBzY2FsZTogVmVjMykge1xyXG4gICAgICAgIHRoaXMuX2xvY2FsU2hhcGUudHJhbnNmb3JtKG0sIHBvcywgcm90LCBzY2FsZSwgdGhpcy5fd29ybGRTaGFwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdyb3VwICovXHJcbiAgICBwdWJsaWMgZ2V0R3JvdXAgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuZ2V0R3JvdXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0R3JvdXAgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuc2V0R3JvdXAodik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmFkZEdyb3VwKHYpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVHcm91cCAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZW1vdmVHcm91cCh2KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbWFzayAqL1xyXG4gICAgcHVibGljIGdldE1hc2sgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuZ2V0TWFzaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNYXNrICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnNldE1hc2sodik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuYWRkTWFzayh2KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlTWFzayAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZW1vdmVNYXNrKHYpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=