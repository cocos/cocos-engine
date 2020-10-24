(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../3d/framework/skinned-mesh-renderer.js", "../math/index.js", "./animation-state.js", "./skeletal-animation-data-hub.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../3d/framework/skinned-mesh-renderer.js"), require("../math/index.js"), require("./animation-state.js"), require("./skeletal-animation-data-hub.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.skinnedMeshRenderer, global.index, global.animationState, global.skeletalAnimationDataHub, global.globalExports);
    global.skeletalAnimationState = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _skinnedMeshRenderer, _index, _animationState, _skeletalAnimationDataHub, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SkeletalAnimationState = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var m4_1 = new _index.Mat4();
  var m4_2 = new _index.Mat4();
  var noCurves = [];

  var SkeletalAnimationState = /*#__PURE__*/function (_AnimationState) {
    _inherits(SkeletalAnimationState, _AnimationState);

    function SkeletalAnimationState(clip) {
      var _this;

      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      _classCallCheck(this, SkeletalAnimationState);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SkeletalAnimationState).call(this, clip, name));
      _this._frames = 1;
      _this._bakedDuration = 0;
      _this._animInfo = null;
      _this._sockets = [];
      _this._animInfoMgr = void 0;
      _this._comps = [];
      _this._parent = null;
      _this._curvesInited = false;
      _this._animInfoMgr = _globalExports.legacyCC.director.root.dataPoolManager.jointAnimationInfo;
      return _this;
    }

    _createClass(SkeletalAnimationState, [{
      key: "initialize",
      value: function initialize(root) {
        if (this._curveLoaded) {
          return;
        }

        this._comps.length = 0;
        var comps = root.getComponentsInChildren(_skinnedMeshRenderer.SkinnedMeshRenderer);

        for (var i = 0; i < comps.length; ++i) {
          var comp = comps[i];

          if (comp.skinningRoot === root) {
            this._comps.push(comp);
          }
        }

        this._parent = root.getComponent('cc.SkeletalAnimation');
        var baked = this._parent.useBakedAnimation;

        _get(_getPrototypeOf(SkeletalAnimationState.prototype), "initialize", this).call(this, root, baked ? noCurves : undefined);

        this._curvesInited = !baked;

        var info = _skeletalAnimationDataHub.SkelAnimDataHub.getOrExtract(this.clip).info;

        this._frames = info.frames - 1;
        this._animInfo = this._animInfoMgr.getData(root.uuid);
        this._bakedDuration = this._frames / info.sample; // last key
      }
    }, {
      key: "onPlay",
      value: function onPlay() {
        _get(_getPrototypeOf(SkeletalAnimationState.prototype), "onPlay", this).call(this);

        var baked = this._parent.useBakedAnimation;

        if (baked) {
          this._sampleCurves = this._sampleCurvesBaked;
          this.duration = this._bakedDuration;

          this._animInfoMgr.switchClip(this._animInfo, this._clip);

          for (var i = 0; i < this._comps.length; ++i) {
            this._comps[i].uploadAnimation(this.clip);
          }
        } else {
          this._sampleCurves = _get(_getPrototypeOf(SkeletalAnimationState.prototype), "_sampleCurves", this);
          this.duration = this._clip.duration;

          if (!this._curvesInited) {
            this._curveLoaded = false;

            _get(_getPrototypeOf(SkeletalAnimationState.prototype), "initialize", this).call(this, this._targetNode);

            this._curvesInited = true;
          }
        }
      }
    }, {
      key: "rebuildSocketCurves",
      value: function rebuildSocketCurves(sockets) {
        this._sockets.length = 0;

        if (!this._targetNode) {
          return null;
        }

        var root = this._targetNode;

        for (var i = 0; i < sockets.length; ++i) {
          var socket = sockets[i];
          var targetNode = root.getChildByPath(socket.path);

          if (!socket.target) {
            continue;
          }

          var clipData = _skeletalAnimationDataHub.SkelAnimDataHub.getOrExtract(this.clip);

          var animPath = socket.path;
          var source = clipData.data[animPath];
          var animNode = targetNode;
          var downstream = void 0;

          while (!source) {
            var idx = animPath.lastIndexOf('/');
            animPath = animPath.substring(0, idx);
            source = clipData.data[animPath];

            if (animNode) {
              if (!downstream) {
                downstream = _index.Mat4.identity(m4_2);
              }

              _index.Mat4.fromRTS(m4_1, animNode.rotation, animNode.position, animNode.scale);

              _index.Mat4.multiply(downstream, m4_1, downstream);

              animNode = animNode.parent;
            }

            if (idx < 0) {
              break;
            }
          }

          var curveData = source && source.worldMatrix.values;
          var frames = clipData.info.frames;
          var transforms = [];

          for (var f = 0; f < frames; f++) {
            var mat = void 0;

            if (curveData && downstream) {
              // curve & static two-way combination
              mat = _index.Mat4.multiply(m4_1, curveData[f], downstream);
            } else if (curveData) {
              // there is a curve directly controlling the joint
              mat = curveData[f];
            } else if (downstream) {
              // fallback to default pose if no animation curve can be found upstream
              mat = downstream;
            } else {
              // bottom line: render the original mesh as-is
              mat = _index.Mat4.IDENTITY;
            }

            var tfm = {
              pos: new _index.Vec3(),
              rot: new _index.Quat(),
              scale: new _index.Vec3()
            };

            _index.Mat4.toRTS(mat, tfm.rot, tfm.pos, tfm.scale);

            transforms.push(tfm);
          }

          this._sockets.push({
            target: socket.target,
            frames: transforms
          });
        }
      }
    }, {
      key: "_sampleCurvesBaked",
      value: function _sampleCurvesBaked(ratio) {
        var info = this._animInfo;
        var curFrame = ratio * this._frames + 0.5 | 0;

        if (curFrame === info.data[0]) {
          return;
        }

        info.data[0] = curFrame;
        info.dirty = true;

        for (var i = 0; i < this._sockets.length; ++i) {
          var _this$_sockets$i = this._sockets[i],
              target = _this$_sockets$i.target,
              frames = _this$_sockets$i.frames;
          var _frames$curFrame = frames[curFrame],
              pos = _frames$curFrame.pos,
              rot = _frames$curFrame.rot,
              scale = _frames$curFrame.scale; // ratio guaranteed to be in [0, 1]

          target.setRTS(rot, pos, scale);
        }
      }
    }]);

    return SkeletalAnimationState;
  }(_animationState.AnimationState);

  _exports.SkeletalAnimationState = SkeletalAnimationState;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3NrZWxldGFsLWFuaW1hdGlvbi1zdGF0ZS50cyJdLCJuYW1lcyI6WyJtNF8xIiwiTWF0NCIsIm00XzIiLCJub0N1cnZlcyIsIlNrZWxldGFsQW5pbWF0aW9uU3RhdGUiLCJjbGlwIiwibmFtZSIsIl9mcmFtZXMiLCJfYmFrZWREdXJhdGlvbiIsIl9hbmltSW5mbyIsIl9zb2NrZXRzIiwiX2FuaW1JbmZvTWdyIiwiX2NvbXBzIiwiX3BhcmVudCIsIl9jdXJ2ZXNJbml0ZWQiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwicm9vdCIsImRhdGFQb29sTWFuYWdlciIsImpvaW50QW5pbWF0aW9uSW5mbyIsIl9jdXJ2ZUxvYWRlZCIsImxlbmd0aCIsImNvbXBzIiwiZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4iLCJTa2lubmVkTWVzaFJlbmRlcmVyIiwiaSIsImNvbXAiLCJza2lubmluZ1Jvb3QiLCJwdXNoIiwiZ2V0Q29tcG9uZW50IiwiYmFrZWQiLCJ1c2VCYWtlZEFuaW1hdGlvbiIsInVuZGVmaW5lZCIsImluZm8iLCJTa2VsQW5pbURhdGFIdWIiLCJnZXRPckV4dHJhY3QiLCJmcmFtZXMiLCJnZXREYXRhIiwidXVpZCIsInNhbXBsZSIsIl9zYW1wbGVDdXJ2ZXMiLCJfc2FtcGxlQ3VydmVzQmFrZWQiLCJkdXJhdGlvbiIsInN3aXRjaENsaXAiLCJfY2xpcCIsInVwbG9hZEFuaW1hdGlvbiIsIl90YXJnZXROb2RlIiwic29ja2V0cyIsInNvY2tldCIsInRhcmdldE5vZGUiLCJnZXRDaGlsZEJ5UGF0aCIsInBhdGgiLCJ0YXJnZXQiLCJjbGlwRGF0YSIsImFuaW1QYXRoIiwic291cmNlIiwiZGF0YSIsImFuaW1Ob2RlIiwiZG93bnN0cmVhbSIsImlkeCIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiaWRlbnRpdHkiLCJmcm9tUlRTIiwicm90YXRpb24iLCJwb3NpdGlvbiIsInNjYWxlIiwibXVsdGlwbHkiLCJwYXJlbnQiLCJjdXJ2ZURhdGEiLCJ3b3JsZE1hdHJpeCIsInZhbHVlcyIsInRyYW5zZm9ybXMiLCJmIiwibWF0IiwiSURFTlRJVFkiLCJ0Zm0iLCJwb3MiLCJWZWMzIiwicm90IiwiUXVhdCIsInRvUlRTIiwicmF0aW8iLCJjdXJGcmFtZSIsImRpcnR5Iiwic2V0UlRTIiwiQW5pbWF0aW9uU3RhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDQSxNQUFNQSxJQUFJLEdBQUcsSUFBSUMsV0FBSixFQUFiO0FBQ0EsTUFBTUMsSUFBSSxHQUFHLElBQUlELFdBQUosRUFBYjtBQWFBLE1BQU1FLFFBQXlCLEdBQUcsRUFBbEM7O01BRWFDLHNCOzs7QUFXVCxvQ0FBYUMsSUFBYixFQUE2QztBQUFBOztBQUFBLFVBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDekMsa0dBQU1ELElBQU4sRUFBWUMsSUFBWjtBQUR5QyxZQVRuQ0MsT0FTbUMsR0FUekIsQ0FTeUI7QUFBQSxZQVJuQ0MsY0FRbUMsR0FSbEIsQ0FRa0I7QUFBQSxZQVBuQ0MsU0FPbUMsR0FQTCxJQU9LO0FBQUEsWUFObkNDLFFBTW1DLEdBTlQsRUFNUztBQUFBLFlBTG5DQyxZQUttQztBQUFBLFlBSm5DQyxNQUltQyxHQUpILEVBSUc7QUFBQSxZQUhuQ0MsT0FHbUMsR0FIQyxJQUdEO0FBQUEsWUFGbkNDLGFBRW1DLEdBRm5CLEtBRW1CO0FBRXpDLFlBQUtILFlBQUwsR0FBb0JJLHdCQUFTQyxRQUFULENBQWtCQyxJQUFsQixDQUF1QkMsZUFBdkIsQ0FBdUNDLGtCQUEzRDtBQUZ5QztBQUc1Qzs7OztpQ0FFa0JGLEksRUFBWTtBQUMzQixZQUFJLEtBQUtHLFlBQVQsRUFBdUI7QUFBRTtBQUFTOztBQUNsQyxhQUFLUixNQUFMLENBQVlTLE1BQVosR0FBcUIsQ0FBckI7QUFDQSxZQUFNQyxLQUFLLEdBQUdMLElBQUksQ0FBQ00sdUJBQUwsQ0FBNkJD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bEI7QUFDQSxZQUFNMEUsUUFBUSxHQUFJRCxLQUFLLEdBQUcsS0FBSzNFLE9BQWIsR0FBdUIsR0FBeEIsR0FBK0IsQ0FBaEQ7O0FBQ0EsWUFBSTRFLFFBQVEsS0FBS2xELElBQUksQ0FBQ3VCLElBQUwsQ0FBVSxDQUFWLENBQWpCLEVBQStCO0FBQUU7QUFBUzs7QUFDMUN2QixRQUFBQSxJQUFJLENBQUN1QixJQUFMLENBQVUsQ0FBVixJQUFlMkIsUUFBZjtBQUNBbEQsUUFBQUEsSUFBSSxDQUFDbUQsS0FBTCxHQUFhLElBQWI7O0FBQ0EsYUFBSyxJQUFJM0QsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLZixRQUFMLENBQWNXLE1BQWxDLEVBQTBDLEVBQUVJLENBQTVDLEVBQStDO0FBQUEsaUNBQ2hCLEtBQUtmLFFBQUwsQ0FBY2UsQ0FBZCxDQURnQjtBQUFBLGNBQ25DMkIsTUFEbUMsb0JBQ25DQSxNQURtQztBQUFBLGNBQzNCaEIsTUFEMkIsb0JBQzNCQSxNQUQyQjtBQUFBLGlDQUVmQSxNQUFNLENBQUMrQyxRQUFELENBRlM7QUFBQSxjQUVuQ04sR0FGbUMsb0JBRW5DQSxHQUZtQztBQUFBLGNBRTlCRSxHQUY4QixvQkFFOUJBLEdBRjhCO0FBQUEsY0FFekJiLEtBRnlCLG9CQUV6QkEsS0FGeUIsRUFFRzs7QUFDOUNkLFVBQUFBLE1BQU0sQ0FBQ2lDLE1BQVAsQ0FBY04sR0FBZCxFQUFtQkYsR0FBbkIsRUFBd0JYLEtBQXhCO0FBQ0g7QUFDSjs7OztJQXRIdUNvQiw4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYW5pbWF0aW9uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgU2tpbm5lZE1lc2hSZW5kZXJlciB9IGZyb20gJy4uLzNkL2ZyYW1ld29yay9za2lubmVkLW1lc2gtcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBNYXQ0LCBRdWF0LCBWZWMzIH0gZnJvbSAnLi4vbWF0aCc7XHJcbmltcG9ydCB7IElBbmltSW5mbywgSm9pbnRBbmltYXRpb25JbmZvIH0gZnJvbSAnLi4vcmVuZGVyZXIvbW9kZWxzL3NrZWxldGFsLWFuaW1hdGlvbi11dGlscyc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi9zY2VuZS1ncmFwaC9ub2RlJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uQ2xpcCwgSVJ1bnRpbWVDdXJ2ZSB9IGZyb20gJy4vYW5pbWF0aW9uLWNsaXAnO1xyXG5pbXBvcnQgeyBBbmltYXRpb25TdGF0ZSB9IGZyb20gJy4vYW5pbWF0aW9uLXN0YXRlJztcclxuaW1wb3J0IHsgU2tlbGV0YWxBbmltYXRpb24sIFNvY2tldCB9IGZyb20gJy4vc2tlbGV0YWwtYW5pbWF0aW9uJztcclxuaW1wb3J0IHsgU2tlbEFuaW1EYXRhSHViIH0gZnJvbSAnLi9za2VsZXRhbC1hbmltYXRpb24tZGF0YS1odWInO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmNvbnN0IG00XzEgPSBuZXcgTWF0NCgpO1xyXG5jb25zdCBtNF8yID0gbmV3IE1hdDQoKTtcclxuXHJcbmludGVyZmFjZSBJVHJhbnNmb3JtIHtcclxuICAgIHBvczogVmVjMztcclxuICAgIHJvdDogUXVhdDtcclxuICAgIHNjYWxlOiBWZWMzO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVNvY2tldERhdGEge1xyXG4gICAgdGFyZ2V0OiBOb2RlO1xyXG4gICAgZnJhbWVzOiBJVHJhbnNmb3JtW107XHJcbn1cclxuXHJcbmNvbnN0IG5vQ3VydmVzOiBJUnVudGltZUN1cnZlW10gPSBbXTtcclxuXHJcbmV4cG9ydCBjbGFzcyBTa2VsZXRhbEFuaW1hdGlvblN0YXRlIGV4dGVuZHMgQW5pbWF0aW9uU3RhdGUge1xyXG5cclxuICAgIHByb3RlY3RlZCBfZnJhbWVzID0gMTtcclxuICAgIHByb3RlY3RlZCBfYmFrZWREdXJhdGlvbiA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2FuaW1JbmZvOiBJQW5pbUluZm8gfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfc29ja2V0czogSVNvY2tldERhdGFbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9hbmltSW5mb01ncjogSm9pbnRBbmltYXRpb25JbmZvO1xyXG4gICAgcHJvdGVjdGVkIF9jb21wczogU2tpbm5lZE1lc2hSZW5kZXJlcltdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX3BhcmVudDogU2tlbGV0YWxBbmltYXRpb24gfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfY3VydmVzSW5pdGVkID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGNsaXA6IEFuaW1hdGlvbkNsaXAsIG5hbWUgPSAnJykge1xyXG4gICAgICAgIHN1cGVyKGNsaXAsIG5hbWUpO1xyXG4gICAgICAgIHRoaXMuX2FuaW1JbmZvTWdyID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5kYXRhUG9vbE1hbmFnZXIuam9pbnRBbmltYXRpb25JbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChyb290OiBOb2RlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnZlTG9hZGVkKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX2NvbXBzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgY29uc3QgY29tcHMgPSByb290LmdldENvbXBvbmVudHNJbkNoaWxkcmVuKFNraW5uZWRNZXNoUmVuZGVyZXIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tcHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgY29tcCA9IGNvbXBzW2ldO1xyXG4gICAgICAgICAgICBpZiAoY29tcC5za2lubmluZ1Jvb3QgPT09IHJvb3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBzLnB1c2goY29tcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcm9vdC5nZXRDb21wb25lbnQoJ2NjLlNrZWxldGFsQW5pbWF0aW9uJykgYXMgU2tlbGV0YWxBbmltYXRpb247XHJcbiAgICAgICAgY29uc3QgYmFrZWQgPSB0aGlzLl9wYXJlbnQudXNlQmFrZWRBbmltYXRpb247XHJcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZShyb290LCBiYWtlZCA/IG5vQ3VydmVzIDogdW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLl9jdXJ2ZXNJbml0ZWQgPSAhYmFrZWQ7XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IFNrZWxBbmltRGF0YUh1Yi5nZXRPckV4dHJhY3QodGhpcy5jbGlwKS5pbmZvO1xyXG4gICAgICAgIHRoaXMuX2ZyYW1lcyA9IGluZm8uZnJhbWVzIC0gMTtcclxuICAgICAgICB0aGlzLl9hbmltSW5mbyA9IHRoaXMuX2FuaW1JbmZvTWdyLmdldERhdGEocm9vdC51dWlkKTtcclxuICAgICAgICB0aGlzLl9iYWtlZER1cmF0aW9uID0gdGhpcy5fZnJhbWVzIC8gaW5mby5zYW1wbGU7IC8vIGxhc3Qga2V5XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUGxheSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25QbGF5KCk7XHJcbiAgICAgICAgY29uc3QgYmFrZWQgPSB0aGlzLl9wYXJlbnQhLnVzZUJha2VkQW5pbWF0aW9uO1xyXG4gICAgICAgIGlmIChiYWtlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zYW1wbGVDdXJ2ZXMgPSB0aGlzLl9zYW1wbGVDdXJ2ZXNCYWtlZDtcclxuICAgICAgICAgICAgdGhpcy5kdXJhdGlvbiA9IHRoaXMuX2Jha2VkRHVyYXRpb247XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1JbmZvTWdyLnN3aXRjaENsaXAodGhpcy5fYW5pbUluZm8hLCB0aGlzLl9jbGlwKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jb21wcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcHNbaV0udXBsb2FkQW5pbWF0aW9uKHRoaXMuY2xpcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9zYW1wbGVDdXJ2ZXMgPSBzdXBlci5fc2FtcGxlQ3VydmVzO1xyXG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gdGhpcy5fY2xpcC5kdXJhdGlvbjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9jdXJ2ZXNJbml0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBzdXBlci5pbml0aWFsaXplKHRoaXMuX3RhcmdldE5vZGUhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlc0luaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlYnVpbGRTb2NrZXRDdXJ2ZXMgKHNvY2tldHM6IFNvY2tldFtdKSB7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGlmICghdGhpcy5fdGFyZ2V0Tm9kZSkgeyByZXR1cm4gbnVsbDsgfVxyXG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aGlzLl90YXJnZXROb2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc29ja2V0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBzb2NrZXQgPSBzb2NrZXRzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gcm9vdC5nZXRDaGlsZEJ5UGF0aChzb2NrZXQucGF0aCk7XHJcbiAgICAgICAgICAgIGlmICghc29ja2V0LnRhcmdldCkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBjb25zdCBjbGlwRGF0YSA9IFNrZWxBbmltRGF0YUh1Yi5nZXRPckV4dHJhY3QodGhpcy5jbGlwKTtcclxuICAgICAgICAgICAgbGV0IGFuaW1QYXRoID0gc29ja2V0LnBhdGg7XHJcbiAgICAgICAgICAgIGxldCBzb3VyY2UgPSBjbGlwRGF0YS5kYXRhW2FuaW1QYXRoXTtcclxuICAgICAgICAgICAgbGV0IGFuaW1Ob2RlID0gdGFyZ2V0Tm9kZTtcclxuICAgICAgICAgICAgbGV0IGRvd25zdHJlYW06IE1hdDQgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHdoaWxlICghc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBhbmltUGF0aC5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgICAgICAgICAgICAgYW5pbVBhdGggPSBhbmltUGF0aC5zdWJzdHJpbmcoMCwgaWR4KTtcclxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IGNsaXBEYXRhLmRhdGFbYW5pbVBhdGhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuaW1Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkb3duc3RyZWFtKSB7IGRvd25zdHJlYW0gPSBNYXQ0LmlkZW50aXR5KG00XzIpOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0NC5mcm9tUlRTKG00XzEsIGFuaW1Ob2RlLnJvdGF0aW9uLCBhbmltTm9kZS5wb3NpdGlvbiwgYW5pbU5vZGUuc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdDQubXVsdGlwbHkoZG93bnN0cmVhbSwgbTRfMSwgZG93bnN0cmVhbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbU5vZGUgPSBhbmltTm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaWR4IDwgMCkgeyBicmVhazsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnZlRGF0YTogTWF0NFtdIHwgdW5kZWZpbmVkID0gc291cmNlICYmIHNvdXJjZS53b3JsZE1hdHJpeC52YWx1ZXMgYXMgTWF0NFtdO1xyXG4gICAgICAgICAgICBjb25zdCBmcmFtZXMgPSBjbGlwRGF0YS5pbmZvLmZyYW1lcztcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtczogSVRyYW5zZm9ybVtdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGYgPSAwOyBmIDwgZnJhbWVzOyBmKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXQ6IE1hdDQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VydmVEYXRhICYmIGRvd25zdHJlYW0pIHsgLy8gY3VydmUgJiBzdGF0aWMgdHdvLXdheSBjb21iaW5hdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIG1hdCA9IE1hdDQubXVsdGlwbHkobTRfMSwgY3VydmVEYXRhW2ZdLCBkb3duc3RyZWFtKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VydmVEYXRhKSB7IC8vIHRoZXJlIGlzIGEgY3VydmUgZGlyZWN0bHkgY29udHJvbGxpbmcgdGhlIGpvaW50XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ID0gY3VydmVEYXRhW2ZdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkb3duc3RyZWFtKSB7IC8vIGZhbGxiYWNrIHRvIGRlZmF1bHQgcG9zZSBpZiBubyBhbmltYXRpb24gY3VydmUgY2FuIGJlIGZvdW5kIHVwc3RyZWFtXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ID0gZG93bnN0cmVhbTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGJvdHRvbSBsaW5lOiByZW5kZXIgdGhlIG9yaWdpbmFsIG1lc2ggYXMtaXNcclxuICAgICAgICAgICAgICAgICAgICBtYXQgPSBNYXQ0LklERU5USVRZO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGZtID0geyBwb3M6IG5ldyBWZWMzKCksIHJvdDogbmV3IFF1YXQoKSwgc2NhbGU6IG5ldyBWZWMzKCkgfTtcclxuICAgICAgICAgICAgICAgIE1hdDQudG9SVFMobWF0LCB0Zm0ucm90LCB0Zm0ucG9zLCB0Zm0uc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3Jtcy5wdXNoKHRmbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fc29ja2V0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogc29ja2V0LnRhcmdldCxcclxuICAgICAgICAgICAgICAgIGZyYW1lczogdHJhbnNmb3JtcyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NhbXBsZUN1cnZlc0Jha2VkIChyYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuX2FuaW1JbmZvITtcclxuICAgICAgICBjb25zdCBjdXJGcmFtZSA9IChyYXRpbyAqIHRoaXMuX2ZyYW1lcyArIDAuNSkgfCAwO1xyXG4gICAgICAgIGlmIChjdXJGcmFtZSA9PT0gaW5mby5kYXRhWzBdKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGluZm8uZGF0YVswXSA9IGN1ckZyYW1lO1xyXG4gICAgICAgIGluZm8uZGlydHkgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc29ja2V0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCB7IHRhcmdldCwgZnJhbWVzIH0gPSB0aGlzLl9zb2NrZXRzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCB7IHBvcywgcm90LCBzY2FsZSB9ID0gZnJhbWVzW2N1ckZyYW1lXTsgLy8gcmF0aW8gZ3VhcmFudGVlZCB0byBiZSBpbiBbMCwgMV1cclxuICAgICAgICAgICAgdGFyZ2V0LnNldFJUUyhyb3QsIHBvcywgc2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=