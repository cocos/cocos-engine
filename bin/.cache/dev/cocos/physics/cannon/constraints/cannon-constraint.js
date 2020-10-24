(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon);
    global.cannonConstraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonConstraint = void 0;
  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  _cannon.default.World['staticBody'] = new _cannon.default.Body();
  _cannon.default.World['idToConstraintMap'] = {};

  var CannonConstraint = /*#__PURE__*/function () {
    function CannonConstraint() {
      _classCallCheck(this, CannonConstraint);

      this._rigidBody = null;
    }

    _createClass(CannonConstraint, [{
      key: "setConnectedBody",
      value: function setConnectedBody(v) {
        if (v) {
          this._impl.bodyB = v.body.impl;
        } else {
          this._impl.bodyB = _cannon.default.World['staticBody'];
        }
      }
    }, {
      key: "setEnableCollision",
      value: function setEnableCollision(v) {
        this._impl.collideConnected = v;
      }
    }, {
      key: "initialize",
      value: function initialize(v) {
        this._com = v;
        this._rigidBody = v.attachedBody;
        this.onComponentSet();
        this.setEnableCollision(v.enableCollision);
        _cannon.default.World['idToConstraintMap'][this._impl.id] = this._impl;
      } // virtual

    }, {
      key: "onComponentSet",
      value: function onComponentSet() {}
    }, {
      key: "onLoad",
      value: function onLoad() {}
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._rigidBody) {
          var sb = this._rigidBody.body.sharedBody;
          sb.wrappedWorld.addConstraint(this);
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._rigidBody) {
          var sb = this._rigidBody.body.sharedBody;
          sb.wrappedWorld.removeConstraint(this);
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        delete _cannon.default.World['idToConstraintMap'][this._impl.id];
        this._com = null;
        this._rigidBody = null;
        this._impl = null;
      }
    }, {
      key: "impl",
      get: function get() {
        return this._impl;
      }
    }, {
      key: "constraint",
      get: function get() {
        return this._com;
      }
    }]);

    return CannonConstraint;
  }();

  _exports.CannonConstraint = CannonConstraint;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL2NvbnN0cmFpbnRzL2Nhbm5vbi1jb25zdHJhaW50LnRzIl0sIm5hbWVzIjpbIkNBTk5PTiIsIldvcmxkIiwiQm9keSIsIkNhbm5vbkNvbnN0cmFpbnQiLCJfcmlnaWRCb2R5IiwidiIsIl9pbXBsIiwiYm9keUIiLCJib2R5IiwiaW1wbCIsImNvbGxpZGVDb25uZWN0ZWQiLCJfY29tIiwiYXR0YWNoZWRCb2R5Iiwib25Db21wb25lbnRTZXQiLCJzZXRFbmFibGVDb2xsaXNpb24iLCJlbmFibGVDb2xsaXNpb24iLCJpZCIsInNiIiwic2hhcmVkQm9keSIsIndyYXBwZWRXb3JsZCIsImFkZENvbnN0cmFpbnQiLCJyZW1vdmVDb25zdHJhaW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBQSxrQkFBT0MsS0FBUCxDQUFhLFlBQWIsSUFBNkIsSUFBSUQsZ0JBQU9FLElBQVgsRUFBN0I7QUFDQUYsa0JBQU9DLEtBQVAsQ0FBYSxtQkFBYixJQUFvQyxFQUFwQzs7TUFFYUUsZ0I7Ozs7V0FtQkNDLFUsR0FBK0IsSTs7Ozs7dUNBakJ2QkMsQyxFQUEyQjtBQUN6QyxZQUFJQSxDQUFKLEVBQU87QUFDSCxlQUFLQyxLQUFMLENBQVdDLEtBQVgsR0FBb0JGLENBQUMsQ0FBQ0csSUFBSCxDQUE0QkMsSUFBL0M7QUFDSCxTQUZELE1BRU87QUFDSCxlQUFLSCxLQUFMLENBQVdDLEtBQVgsR0FBbUJQLGdCQUFPQyxLQUFQLENBQWEsWUFBYixDQUFuQjtBQUNIO0FBQ0o7Ozt5Q0FFbUJJLEMsRUFBa0I7QUFDbEMsYUFBS0MsS0FBTCxDQUFXSSxnQkFBWCxHQUE4QkwsQ0FBOUI7QUFDSDs7O2lDQVNXQSxDLEVBQXFCO0FBQzdCLGFBQUtNLElBQUwsR0FBWU4sQ0FBWjtBQUNBLGFBQUtELFVBQUwsR0FBa0JDLENBQUMsQ0FBQ08sWUFBcEI7QUFDQSxhQUFLQyxjQUFMO0FBQ0EsYUFBS0Msa0JBQUwsQ0FBd0JULENBQUMsQ0FBQ1UsZUFBMUI7QUFDQWYsd0JBQU9DLEtBQVAsQ0FBYSxtQkFBYixFQUFrQyxLQUFLSyxLQUFMLENBQVdVLEVBQTdDLElBQW1ELEtBQUtWLEtBQXhEO0FBQ0gsTyxDQUVEOzs7O3VDQUM0QixDQUFHOzs7K0JBRXJCLENBRVQ7OztpQ0FFVztBQUNSLFlBQUksS0FBS0YsVUFBVCxFQUFxQjtBQUNqQixjQUFNYSxFQUFFLEdBQUksS0FBS2IsVUFBTCxDQUFnQkksSUFBakIsQ0FBMENVLFVBQXJEO0FBQ0FELFVBQUFBLEVBQUUsQ0FBQ0UsWUFBSCxDQUFnQkMsYUFBaEIsQ0FBOEIsSUFBOUI7QUFDSDtBQUNKOzs7a0NBRVk7QUFDVCxZQUFJLEtBQUtoQixVQUFULEVBQXFCO0FBQ2pCLGNBQU1hLEVBQUUsR0FBSSxLQUFLYixVQUFMLENBQWdCSSxJQUFqQixDQUEwQ1UsVUFBckQ7QUFDQUQsVUFBQUEsRUFBRSxDQUFDRSxZQUFILENBQWdCRSxnQkFBaEIsQ0FBaUMsSUFBakM7QUFDSDtBQUNKOzs7a0NBRVk7QUFDVCxlQUFPckIsZ0JBQU9DLEtBQVAsQ0FBYSxtQkFBYixFQUFrQyxLQUFLSyxLQUFMLENBQVdVLEVBQTdDLENBQVA7QUFDQyxhQUFLTCxJQUFOLEdBQXFCLElBQXJCO0FBQ0MsYUFBS1AsVUFBTixHQUEyQixJQUEzQjtBQUNDLGFBQUtFLEtBQU4sR0FBc0IsSUFBdEI7QUFDSDs7OzBCQXpDVztBQUFFLGVBQU8sS0FBS0EsS0FBWjtBQUFvQjs7OzBCQUNoQjtBQUFFLGVBQU8sS0FBS0ssSUFBWjtBQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDQU5OT04gZnJvbSAnQGNvY29zL2Nhbm5vbic7XHJcbmltcG9ydCB7IElCYXNlQ29uc3RyYWludCB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLWNvbnN0cmFpbnQnO1xyXG5pbXBvcnQgeyBDb25zdHJhaW50LCBSaWdpZEJvZHkgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBDYW5ub25SaWdpZEJvZHkgfSBmcm9tICcuLi9jYW5ub24tcmlnaWQtYm9keSc7XHJcblxyXG5DQU5OT04uV29ybGRbJ3N0YXRpY0JvZHknXSA9IG5ldyBDQU5OT04uQm9keSgpO1xyXG5DQU5OT04uV29ybGRbJ2lkVG9Db25zdHJhaW50TWFwJ10gPSB7fTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW5ub25Db25zdHJhaW50IGltcGxlbWVudHMgSUJhc2VDb25zdHJhaW50IHtcclxuXHJcbiAgICBzZXRDb25uZWN0ZWRCb2R5ICh2OiBSaWdpZEJvZHkgfCBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5faW1wbC5ib2R5QiA9ICh2LmJvZHkgYXMgQ2Fubm9uUmlnaWRCb2R5KS5pbXBsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuYm9keUIgPSBDQU5OT04uV29ybGRbJ3N0YXRpY0JvZHknXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RW5hYmxlQ29sbGlzaW9uICh2OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5faW1wbC5jb2xsaWRlQ29ubmVjdGVkID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW1wbCAoKSB7IHJldHVybiB0aGlzLl9pbXBsOyB9XHJcbiAgICBnZXQgY29uc3RyYWludCAoKSB7IHJldHVybiB0aGlzLl9jb20gfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaW1wbCE6IENBTk5PTi5Db25zdHJhaW50O1xyXG4gICAgcHJvdGVjdGVkIF9jb20hOiBDb25zdHJhaW50O1xyXG4gICAgcHJvdGVjdGVkIF9yaWdpZEJvZHk6IFJpZ2lkQm9keSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGluaXRpYWxpemUgKHY6IENvbnN0cmFpbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb20gPSB2O1xyXG4gICAgICAgIHRoaXMuX3JpZ2lkQm9keSA9IHYuYXR0YWNoZWRCb2R5O1xyXG4gICAgICAgIHRoaXMub25Db21wb25lbnRTZXQoKTtcclxuICAgICAgICB0aGlzLnNldEVuYWJsZUNvbGxpc2lvbih2LmVuYWJsZUNvbGxpc2lvbik7XHJcbiAgICAgICAgQ0FOTk9OLldvcmxkWydpZFRvQ29uc3RyYWludE1hcCddW3RoaXMuX2ltcGwuaWRdID0gdGhpcy5faW1wbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyB2aXJ0dWFsXHJcbiAgICBwcm90ZWN0ZWQgb25Db21wb25lbnRTZXQgKCkgeyB9XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgb25FbmFibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yaWdpZEJvZHkpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2IgPSAodGhpcy5fcmlnaWRCb2R5LmJvZHkgYXMgQ2Fubm9uUmlnaWRCb2R5KS5zaGFyZWRCb2R5O1xyXG4gICAgICAgICAgICBzYi53cmFwcGVkV29ybGQuYWRkQ29uc3RyYWludCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmlnaWRCb2R5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNiID0gKHRoaXMuX3JpZ2lkQm9keS5ib2R5IGFzIENhbm5vblJpZ2lkQm9keSkuc2hhcmVkQm9keTtcclxuICAgICAgICAgICAgc2Iud3JhcHBlZFdvcmxkLnJlbW92ZUNvbnN0cmFpbnQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgZGVsZXRlIENBTk5PTi5Xb3JsZFsnaWRUb0NvbnN0cmFpbnRNYXAnXVt0aGlzLl9pbXBsLmlkXTtcclxuICAgICAgICAodGhpcy5fY29tIGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgICh0aGlzLl9yaWdpZEJvZHkgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMuX2ltcGwgYXMgYW55KSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuIl19