(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated);
    global.ammoConstraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoConstraint = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var AmmoConstraint = /*#__PURE__*/function () {
    function AmmoConstraint() {
      _classCallCheck(this, AmmoConstraint);

      this.dirty = 0;
      this.index = -1;
      this._rigidBody = null;
      this._collided = false;
    }

    _createClass(AmmoConstraint, [{
      key: "setConnectedBody",
      value: function setConnectedBody(v) {// TODO: support dynamic change connected body
      }
    }, {
      key: "setEnableCollision",
      value: function setEnableCollision(v) {
        if (this._collided != v) {
          this._collided = v;
          this.updateByReAdd();
        }
      }
    }, {
      key: "updateByReAdd",
      value: function updateByReAdd() {
        if (this._rigidBody && this.index >= 0) {
          var sb = this._rigidBody.body.sharedBody;
          sb.wrappedWorld.removeConstraint(this);
          sb.wrappedWorld.addConstraint(this);
        }
      }
    }, {
      key: "initialize",
      value: function initialize(v) {
        this._com = v;
        this._rigidBody = v.attachedBody;
        this._collided = v.enableCollision;
        this.onComponentSet();
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
        _ammoInstantiated.default.destroy(this._impl);

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

    return AmmoConstraint;
  }();

  _exports.AmmoConstraint = AmmoConstraint;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9jb25zdHJhaW50cy9hbW1vLWNvbnN0cmFpbnQudHMiXSwibmFtZXMiOlsiQW1tb0NvbnN0cmFpbnQiLCJkaXJ0eSIsImluZGV4IiwiX3JpZ2lkQm9keSIsIl9jb2xsaWRlZCIsInYiLCJ1cGRhdGVCeVJlQWRkIiwic2IiLCJib2R5Iiwic2hhcmVkQm9keSIsIndyYXBwZWRXb3JsZCIsInJlbW92ZUNvbnN0cmFpbnQiLCJhZGRDb25zdHJhaW50IiwiX2NvbSIsImF0dGFjaGVkQm9keSIsImVuYWJsZUNvbGxpc2lvbiIsIm9uQ29tcG9uZW50U2V0IiwiQW1tbyIsImRlc3Ryb3kiLCJfaW1wbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFLYUEsYzs7OztXQXFCVEMsSyxHQUFnQixDO1dBQ2hCQyxLLEdBQWdCLENBQUMsQztXQUlQQyxVLEdBQStCLEk7V0FDL0JDLFMsR0FBWSxLOzs7Ozt1Q0F6QkpDLEMsRUFBMkIsQ0FDekM7QUFDSDs7O3lDQUVtQkEsQyxFQUFrQjtBQUNsQyxZQUFJLEtBQUtELFNBQUwsSUFBa0JDLENBQXRCLEVBQXlCO0FBQ3JCLGVBQUtELFNBQUwsR0FBaUJDLENBQWpCO0FBQ0EsZUFBS0MsYUFBTDtBQUNIO0FBQ0o7OztzQ0FrQmdCO0FBQ2IsWUFBSSxLQUFLSCxVQUFMLElBQW1CLEtBQUtELEtBQUwsSUFBYyxDQUFyQyxFQUF3QztBQUNwQyxjQUFNSyxFQUFFLEdBQUksS0FBS0osVUFBTCxDQUFnQkssSUFBakIsQ0FBd0NDLFVBQW5EO0FBQ0FGLFVBQUFBLEVBQUUsQ0FBQ0csWUFBSCxDQUFnQkMsZ0JBQWhCLENBQWlDLElBQWpDO0FBQ0FKLFVBQUFBLEVBQUUsQ0FBQ0csWUFBSCxDQUFnQkUsYUFBaEIsQ0FBOEIsSUFBOUI7QUFDSDtBQUNKOzs7aUNBRVdQLEMsRUFBcUI7QUFDN0IsYUFBS1EsSUFBTCxHQUFZUixDQUFaO0FBQ0EsYUFBS0YsVUFBTCxHQUFrQkUsQ0FBQyxDQUFDUyxZQUFwQjtBQUNBLGFBQUtWLFNBQUwsR0FBaUJDLENBQUMsQ0FBQ1UsZUFBbkI7QUFDQSxhQUFLQyxjQUFMO0FBQ0gsTyxDQUVEOzs7O3VDQUM0QixDQUFHOzs7K0JBRWYsQ0FFZjs7O2lDQUVpQjtBQUNkLFlBQUksS0FBS2IsVUFBVCxFQUFxQjtBQUNqQixjQUFNSSxFQUFFLEdBQUksS0FBS0osVUFBTCxDQUFnQkssSUFBakIsQ0FBd0NDLFVBQW5EO0FBQ0FGLFVBQUFBLEVBQUUsQ0FBQ0csWUFBSCxDQUFnQkUsYUFBaEIsQ0FBOEIsSUFBOUI7QUFDSDtBQUNKOzs7a0NBRWtCO0FBQ2YsWUFBSSxLQUFLVCxVQUFULEVBQXFCO0FBQ2pCLGNBQU1JLEVBQUUsR0FBSSxLQUFLSixVQUFMLENBQWdCSyxJQUFqQixDQUF3Q0MsVUFBbkQ7QUFDQUYsVUFBQUEsRUFBRSxDQUFDRyxZQUFILENBQWdCQyxnQkFBaEIsQ0FBaUMsSUFBakM7QUFDSDtBQUNKOzs7a0NBRWtCO0FBQ2ZNLGtDQUFLQyxPQUFMLENBQWEsS0FBS0MsS0FBbEI7O0FBQ0MsYUFBS04sSUFBTixHQUFxQixJQUFyQjtBQUNDLGFBQUtWLFVBQU4sR0FBMkIsSUFBM0I7QUFDQyxhQUFLZ0IsS0FBTixHQUFzQixJQUF0QjtBQUNIOzs7MEJBekRtQztBQUNoQyxlQUFPLEtBQUtBLEtBQVo7QUFDSDs7OzBCQUU2QjtBQUMxQixlQUFPLEtBQUtOLElBQVo7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbW1vIGZyb20gJy4uL2FtbW8taW5zdGFudGlhdGVkJztcclxuaW1wb3J0IHsgSUJhc2VDb25zdHJhaW50IH0gZnJvbSBcIi4uLy4uL3NwZWMvaS1waHlzaWNzLWNvbnN0cmFpbnRcIjtcclxuaW1wb3J0IHsgQ29uc3RyYWludCwgUmlnaWRCb2R5IH0gZnJvbSBcIi4uLy4uL2ZyYW1ld29ya1wiO1xyXG5pbXBvcnQgeyBBbW1vUmlnaWRCb2R5IH0gZnJvbSAnLi4vYW1tby1yaWdpZC1ib2R5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBBbW1vQ29uc3RyYWludCBpbXBsZW1lbnRzIElCYXNlQ29uc3RyYWludCB7XHJcblxyXG4gICAgc2V0Q29ubmVjdGVkQm9keSAodjogUmlnaWRCb2R5IHwgbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFRPRE86IHN1cHBvcnQgZHluYW1pYyBjaGFuZ2UgY29ubmVjdGVkIGJvZHlcclxuICAgIH1cclxuXHJcbiAgICBzZXRFbmFibGVDb2xsaXNpb24gKHY6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fY29sbGlkZWQgIT0gdikge1xyXG4gICAgICAgICAgICB0aGlzLl9jb2xsaWRlZCA9IHY7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnlSZUFkZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW1wbCAoKTogQW1tby5idFR5cGVkQ29uc3RyYWludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbnN0cmFpbnQgKCk6IENvbnN0cmFpbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb207XHJcbiAgICB9XHJcblxyXG4gICAgZGlydHk6IG51bWJlciA9IDA7XHJcbiAgICBpbmRleDogbnVtYmVyID0gLTE7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pbXBsITogQW1tby5idFR5cGVkQ29uc3RyYWludDtcclxuICAgIHByb3RlY3RlZCBfY29tITogQ29uc3RyYWludDtcclxuICAgIHByb3RlY3RlZCBfcmlnaWRCb2R5OiBSaWdpZEJvZHkgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfY29sbGlkZWQgPSBmYWxzZTtcclxuXHJcbiAgICB1cGRhdGVCeVJlQWRkICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmlnaWRCb2R5ICYmIHRoaXMuaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBzYiA9ICh0aGlzLl9yaWdpZEJvZHkuYm9keSBhcyBBbW1vUmlnaWRCb2R5KS5zaGFyZWRCb2R5O1xyXG4gICAgICAgICAgICBzYi53cmFwcGVkV29ybGQucmVtb3ZlQ29uc3RyYWludCh0aGlzKTtcclxuICAgICAgICAgICAgc2Iud3JhcHBlZFdvcmxkLmFkZENvbnN0cmFpbnQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRpYWxpemUgKHY6IENvbnN0cmFpbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb20gPSB2O1xyXG4gICAgICAgIHRoaXMuX3JpZ2lkQm9keSA9IHYuYXR0YWNoZWRCb2R5O1xyXG4gICAgICAgIHRoaXMuX2NvbGxpZGVkID0gdi5lbmFibGVDb2xsaXNpb247XHJcbiAgICAgICAgdGhpcy5vbkNvbXBvbmVudFNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZpcnR1YWxcclxuICAgIHByb3RlY3RlZCBvbkNvbXBvbmVudFNldCAoKSB7IH1cclxuXHJcbiAgICBvbkxvYWQgKCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBvbkVuYWJsZSAoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JpZ2lkQm9keSkge1xyXG4gICAgICAgICAgICBjb25zdCBzYiA9ICh0aGlzLl9yaWdpZEJvZHkuYm9keSBhcyBBbW1vUmlnaWRCb2R5KS5zaGFyZWRCb2R5O1xyXG4gICAgICAgICAgICBzYi53cmFwcGVkV29ybGQuYWRkQ29uc3RyYWludCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlICgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fcmlnaWRCb2R5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNiID0gKHRoaXMuX3JpZ2lkQm9keS5ib2R5IGFzIEFtbW9SaWdpZEJvZHkpLnNoYXJlZEJvZHk7XHJcbiAgICAgICAgICAgIHNiLndyYXBwZWRXb3JsZC5yZW1vdmVDb25zdHJhaW50KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkRlc3Ryb3kgKCk6IHZvaWQge1xyXG4gICAgICAgIEFtbW8uZGVzdHJveSh0aGlzLl9pbXBsKTtcclxuICAgICAgICAodGhpcy5fY29tIGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgICh0aGlzLl9yaWdpZEJvZHkgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMuX2ltcGwgYXMgYW55KSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuIl19