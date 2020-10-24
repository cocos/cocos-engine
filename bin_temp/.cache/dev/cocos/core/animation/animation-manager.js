(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../components/system.js", "../data/decorators/index.js", "../director.js", "../platform/debug.js", "../scheduler.js", "../utils/array.js", "./skeletal-animation-blending.js", "../global-exports.js", "../renderer/models/skinning-model.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../components/system.js"), require("../data/decorators/index.js"), require("../director.js"), require("../platform/debug.js"), require("../scheduler.js"), require("../utils/array.js"), require("./skeletal-animation-blending.js"), require("../global-exports.js"), require("../renderer/models/skinning-model.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.system, global.index, global.director, global.debug, global.scheduler, global.array, global.skeletalAnimationBlending, global.globalExports, global.skinningModel);
    global.animationManager = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _system, _index, _director, _debug, _scheduler, _array, _skeletalAnimationBlending, _globalExports, _skinningModel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AnimationManager = void 0;
  _system = _interopRequireDefault(_system);

  var _class, _class2, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var AnimationManager = (0, _index.ccclass)(_class = (_temp = _class2 = /*#__PURE__*/function (_System) {
    _inherits(AnimationManager, _System);

    function AnimationManager() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, AnimationManager);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AnimationManager)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._anims = new _array.MutableForwardIterator([]);
      _this._delayEvents = [];
      _this._blendStateBuffer = new _skeletalAnimationBlending.BlendStateBuffer();
      _this._crossFades = [];
      _this._sockets = [];
      return _this;
    }

    _createClass(AnimationManager, [{
      key: "addCrossFade",
      value: function addCrossFade(crossFade) {
        this._crossFades.push(crossFade);
      }
    }, {
      key: "removeCrossFade",
      value: function removeCrossFade(crossFade) {
        (0, _array.remove)(this._crossFades, crossFade);
      }
    }, {
      key: "update",
      value: function update(dt) {
        var _delayEvents = this._delayEvents,
            _crossFades = this._crossFades,
            _sockets = this._sockets;

        for (var i = 0, l = _crossFades.length; i < l; i++) {
          _crossFades[i].update(dt);
        }

        var iterator = this._anims;
        var array = iterator.array;

        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
          var anim = array[iterator.i];

          if (!anim.isMotionless) {
            anim.update(dt);
          }
        }

        this._blendStateBuffer.apply();

        var stamp = _globalExports.legacyCC.director.getTotalFrames();

        for (var _i = 0, _l = _sockets.length; _i < _l; _i++) {
          var _sockets$_i = _sockets[_i],
              target = _sockets$_i.target,
              transform = _sockets$_i.transform;
          target.matrix = (0, _skinningModel.getWorldMatrix)(transform, stamp);
        }

        for (var _i2 = 0, _l2 = _delayEvents.length; _i2 < _l2; _i2++) {
          var event = _delayEvents[_i2];
          event.fn.apply(event.thisArg, event.args);
        }

        _delayEvents.length = 0;
      }
    }, {
      key: "destruct",
      value: function destruct() {}
    }, {
      key: "addAnimation",
      value: function addAnimation(anim) {
        var index = this._anims.array.indexOf(anim);

        if (index === -1) {
          this._anims.push(anim);
        }
      }
    }, {
      key: "removeAnimation",
      value: function removeAnimation(anim) {
        var index = this._anims.array.indexOf(anim);

        if (index >= 0) {
          this._anims.fastRemoveAt(index);
        } else {
          (0, _debug.errorID)(3907);
        }
      }
    }, {
      key: "pushDelayEvent",
      value: function pushDelayEvent(fn, thisArg, args) {
        this._delayEvents.push({
          fn: fn,
          thisArg: thisArg,
          args: args
        });
      }
    }, {
      key: "addSockets",
      value: function addSockets(root, sockets) {
        var _this2 = this;

        var _loop = function _loop(i) {
          var socket = sockets[i];

          if (_this2._sockets.find(function (s) {
            return s.target === socket.target;
          })) {
            return "continue";
          }

          var targetNode = root.getChildByPath(socket.path);
          var transform = socket.target && targetNode && (0, _skinningModel.getTransform)(targetNode, root);

          if (transform) {
            _this2._sockets.push({
              target: socket.target,
              transform: transform
            });
          }
        };

        for (var i = 0; i < sockets.length; ++i) {
          var _ret = _loop(i);

          if (_ret === "continue") continue;
        }
      }
    }, {
      key: "removeSockets",
      value: function removeSockets(root, sockets) {
        for (var i = 0; i < sockets.length; ++i) {
          var socketToRemove = sockets[i];

          for (var j = 0; j < this._sockets.length; ++j) {
            var socket = this._sockets[j];

            if (socket.target === socketToRemove.target) {
              (0, _skinningModel.deleteTransform)(socket.transform.node);
              this._sockets[j] = this._sockets[this._sockets.length - 1];
              this._sockets.length--;
              break;
            }
          }
        }
      }
    }, {
      key: "blendState",
      get: function get() {
        return this._blendStateBuffer;
      }
    }]);

    return AnimationManager;
  }(_system.default), _class2.ID = 'animation', _temp)) || _class;

  _exports.AnimationManager = AnimationManager;

  _director.director.on(_director.Director.EVENT_INIT, function () {
    var animationManager = new AnimationManager();

    _director.director.registerSystem(AnimationManager.ID, animationManager, _scheduler.Scheduler.PRIORITY_SYSTEM);
  });

  _globalExports.legacyCC.AnimationManager = AnimationManager;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2FuaW1hdGlvbi1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvbk1hbmFnZXIiLCJjY2NsYXNzIiwiX2FuaW1zIiwiTXV0YWJsZUZvcndhcmRJdGVyYXRvciIsIl9kZWxheUV2ZW50cyIsIl9ibGVuZFN0YXRlQnVmZmVyIiwiQmxlbmRTdGF0ZUJ1ZmZlciIsIl9jcm9zc0ZhZGVzIiwiX3NvY2tldHMiLCJjcm9zc0ZhZGUiLCJwdXNoIiwiZHQiLCJpIiwibCIsImxlbmd0aCIsInVwZGF0ZSIsIml0ZXJhdG9yIiwiYXJyYXkiLCJhbmltIiwiaXNNb3Rpb25sZXNzIiwiYXBwbHkiLCJzdGFtcCIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJnZXRUb3RhbEZyYW1lcyIsInRhcmdldCIsInRyYW5zZm9ybSIsIm1hdHJpeCIsImV2ZW50IiwiZm4iLCJ0aGlzQXJnIiwiYXJncyIsImluZGV4IiwiaW5kZXhPZiIsImZhc3RSZW1vdmVBdCIsInJvb3QiLCJzb2NrZXRzIiwic29ja2V0IiwiZmluZCIsInMiLCJ0YXJnZXROb2RlIiwiZ2V0Q2hpbGRCeVBhdGgiLCJwYXRoIiwic29ja2V0VG9SZW1vdmUiLCJqIiwibm9kZSIsIlN5c3RlbSIsIklEIiwib24iLCJEaXJlY3RvciIsIkVWRU5UX0lOSVQiLCJhbmltYXRpb25NYW5hZ2VyIiwicmVnaXN0ZXJTeXN0ZW0iLCJTY2hlZHVsZXIiLCJQUklPUklUWV9TWVNURU0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF3QmFBLGdCLE9BRFpDLGM7Ozs7Ozs7Ozs7Ozs7OztZQVFXQyxNLEdBQVMsSUFBSUMsNkJBQUosQ0FBMkMsRUFBM0MsQztZQUNUQyxZLEdBSUYsRTtZQUNFQyxpQixHQUFzQyxJQUFJQywyQ0FBSixFO1lBQ3RDQyxXLEdBQTJCLEU7WUFDM0JDLFEsR0FBMEIs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XG4gKiBAY2F0ZWdvcnkgYW5pbWF0aW9uXHJcbiAqL1xyXG5cclxuaW1wb3J0IFN5c3RlbSBmcm9tICcuLi9jb21wb25lbnRzL3N5c3RlbSc7XHJcbmltcG9ydCB7IGNjY2xhc3MgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBkaXJlY3RvciwgRGlyZWN0b3IgfSBmcm9tICcuLi9kaXJlY3Rvcic7XHJcbmltcG9ydCB7IGVycm9ySUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlcic7XHJcbmltcG9ydCB7IE11dGFibGVGb3J3YXJkSXRlcmF0b3IsIHJlbW92ZSB9IGZyb20gJy4uL3V0aWxzL2FycmF5JztcclxuaW1wb3J0IHsgQmxlbmRTdGF0ZUJ1ZmZlciB9IGZyb20gJy4vc2tlbGV0YWwtYW5pbWF0aW9uLWJsZW5kaW5nJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uU3RhdGUgfSBmcm9tICcuL2FuaW1hdGlvbi1zdGF0ZSc7XHJcbmltcG9ydCB7IENyb3NzRmFkZSB9IGZyb20gJy4vY3Jvc3MtZmFkZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBJSm9pbnRUcmFuc2Zvcm0sIGRlbGV0ZVRyYW5zZm9ybSwgZ2V0VHJhbnNmb3JtLCBnZXRXb3JsZE1hdHJpeCB9IGZyb20gJy4uL3JlbmRlcmVyL21vZGVscy9za2lubmluZy1tb2RlbCc7XHJcbmltcG9ydCB7IFNvY2tldCB9IGZyb20gJy4vc2tlbGV0YWwtYW5pbWF0aW9uJztcclxuXHJcbmludGVyZmFjZSBJU29ja2V0RGF0YSB7XHJcbiAgICB0YXJnZXQ6IE5vZGU7XHJcbiAgICB0cmFuc2Zvcm06IElKb2ludFRyYW5zZm9ybTtcclxufVxyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbk1hbmFnZXIgZXh0ZW5kcyBTeXN0ZW0ge1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYmxlbmRTdGF0ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JsZW5kU3RhdGVCdWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBJRCA9ICdhbmltYXRpb24nO1xyXG4gICAgcHJpdmF0ZSBfYW5pbXMgPSBuZXcgTXV0YWJsZUZvcndhcmRJdGVyYXRvcjxBbmltYXRpb25TdGF0ZT4oW10pO1xyXG4gICAgcHJpdmF0ZSBfZGVsYXlFdmVudHM6IHtcclxuICAgICAgICBmbjogRnVuY3Rpb247XHJcbiAgICAgICAgdGhpc0FyZzogYW55O1xyXG4gICAgICAgIGFyZ3M6IGFueVtdO1xyXG4gICAgfVtdID0gW107XHJcbiAgICBwcml2YXRlIF9ibGVuZFN0YXRlQnVmZmVyOiBCbGVuZFN0YXRlQnVmZmVyID0gbmV3IEJsZW5kU3RhdGVCdWZmZXIoKTtcclxuICAgIHByaXZhdGUgX2Nyb3NzRmFkZXM6IENyb3NzRmFkZVtdID0gW107XHJcbiAgICBwcml2YXRlIF9zb2NrZXRzOiBJU29ja2V0RGF0YVtdID0gW107XHJcblxyXG4gICAgcHVibGljIGFkZENyb3NzRmFkZSAoY3Jvc3NGYWRlOiBDcm9zc0ZhZGUpIHtcclxuICAgICAgICB0aGlzLl9jcm9zc0ZhZGVzLnB1c2goY3Jvc3NGYWRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ3Jvc3NGYWRlIChjcm9zc0ZhZGU6IENyb3NzRmFkZSkge1xyXG4gICAgICAgIHJlbW92ZSh0aGlzLl9jcm9zc0ZhZGVzLCBjcm9zc0ZhZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB7IF9kZWxheUV2ZW50cywgX2Nyb3NzRmFkZXMsIF9zb2NrZXRzIH0gPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IF9jcm9zc0ZhZGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBfY3Jvc3NGYWRlc1tpXS51cGRhdGUoZHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpdGVyYXRvciA9IHRoaXMuX2FuaW1zO1xyXG4gICAgICAgIGNvbnN0IGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XHJcbiAgICAgICAgZm9yIChpdGVyYXRvci5pID0gMDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuaW0gPSBhcnJheVtpdGVyYXRvci5pXTtcclxuICAgICAgICAgICAgaWYgKCFhbmltLmlzTW90aW9ubGVzcykge1xyXG4gICAgICAgICAgICAgICAgYW5pbS51cGRhdGUoZHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2JsZW5kU3RhdGVCdWZmZXIuYXBwbHkoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhbXAgPSBsZWdhY3lDQy5kaXJlY3Rvci5nZXRUb3RhbEZyYW1lcygpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gX3NvY2tldHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdGFyZ2V0LCB0cmFuc2Zvcm0gfSA9IF9zb2NrZXRzW2ldO1xyXG4gICAgICAgICAgICB0YXJnZXQubWF0cml4ID0gZ2V0V29ybGRNYXRyaXgodHJhbnNmb3JtLCBzdGFtcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IF9kZWxheUV2ZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBfZGVsYXlFdmVudHNbaV07XHJcbiAgICAgICAgICAgIGV2ZW50LmZuLmFwcGx5KGV2ZW50LnRoaXNBcmcsIGV2ZW50LmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfZGVsYXlFdmVudHMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJ1Y3QgKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQW5pbWF0aW9uIChhbmltOiBBbmltYXRpb25TdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fYW5pbXMuYXJyYXkuaW5kZXhPZihhbmltKTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1zLnB1c2goYW5pbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVBbmltYXRpb24gKGFuaW06IEFuaW1hdGlvblN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9hbmltcy5hcnJheS5pbmRleE9mKGFuaW0pO1xyXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1zLmZhc3RSZW1vdmVBdChpbmRleCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgzOTA3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHB1c2hEZWxheUV2ZW50IChmbjogRnVuY3Rpb24sIHRoaXNBcmc6IGFueSwgYXJnczogYW55W10pIHtcclxuICAgICAgICB0aGlzLl9kZWxheUV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgZm4sXHJcbiAgICAgICAgICAgIHRoaXNBcmcsXHJcbiAgICAgICAgICAgIGFyZ3MsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNvY2tldHMgKHJvb3Q6IE5vZGUsIHNvY2tldHM6IFNvY2tldFtdKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb2NrZXRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNvY2tldCA9IHNvY2tldHNbaV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zb2NrZXRzLmZpbmQoKHMpID0+IHMudGFyZ2V0ID09PSBzb2NrZXQudGFyZ2V0KSkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gcm9vdC5nZXRDaGlsZEJ5UGF0aChzb2NrZXQucGF0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHNvY2tldC50YXJnZXQgJiYgdGFyZ2V0Tm9kZSAmJiBnZXRUcmFuc2Zvcm0odGFyZ2V0Tm9kZSwgcm9vdCk7XHJcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NvY2tldHMucHVzaCh7IHRhcmdldDogc29ja2V0LnRhcmdldCEsIHRyYW5zZm9ybSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlU29ja2V0cyAocm9vdDogTm9kZSwgc29ja2V0czogU29ja2V0W10pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvY2tldHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3Qgc29ja2V0VG9SZW1vdmUgPSBzb2NrZXRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX3NvY2tldHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNvY2tldCA9IHRoaXMuX3NvY2tldHNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoc29ja2V0LnRhcmdldCA9PT0gIHNvY2tldFRvUmVtb3ZlLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZVRyYW5zZm9ybShzb2NrZXQudHJhbnNmb3JtLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NvY2tldHNbal0gPSB0aGlzLl9zb2NrZXRzW3RoaXMuX3NvY2tldHMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc29ja2V0cy5sZW5ndGgtLTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZGlyZWN0b3Iub24oRGlyZWN0b3IuRVZFTlRfSU5JVCwgKCkgPT4ge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uTWFuYWdlciA9IG5ldyBBbmltYXRpb25NYW5hZ2VyKCk7XHJcbiAgICBkaXJlY3Rvci5yZWdpc3RlclN5c3RlbShBbmltYXRpb25NYW5hZ2VyLklELCBhbmltYXRpb25NYW5hZ2VyLCBTY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNKTtcclxufSk7XHJcblxyXG5sZWdhY3lDQy5BbmltYXRpb25NYW5hZ2VyID0gQW5pbWF0aW9uTWFuYWdlcjtcclxuIl19