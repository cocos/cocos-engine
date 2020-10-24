(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "../../animation/skeletal-animation-data-hub.js", "../../animation/transform-utils.js", "../../geometry/index.js", "../../gfx/buffer.js", "../../gfx/define.js", "../../gfx/device.js", "../../math/index.js", "../../pipeline/define.js", "../core/sampler-lib.js", "../core/texture-buffer-pool.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("../../animation/skeletal-animation-data-hub.js"), require("../../animation/transform-utils.js"), require("../../geometry/index.js"), require("../../gfx/buffer.js"), require("../../gfx/define.js"), require("../../gfx/device.js"), require("../../math/index.js"), require("../../pipeline/define.js"), require("../core/sampler-lib.js"), require("../core/texture-buffer-pool.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.skeletalAnimationDataHub, global.transformUtils, global.index, global.buffer, global.define, global.device, global.index, global.define, global.samplerLib, global.textureBufferPool);
    global.skeletalAnimationUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _skeletalAnimationDataHub, _transformUtils, _index, _buffer, _define, _device, _index2, _define2, _samplerLib, _textureBufferPool) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.selectJointsMediumFormat = selectJointsMediumFormat;
  _exports.JointAnimationInfo = _exports.JointTexturePool = _exports.jointTextureSamplerHash = _exports.MINIMUM_JOINT_TEXTURE_SIZE = _exports.uploadJointData = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // change here and cc-skinning.chunk to use other skinning algorithms
  var uploadJointData = uploadJointDataLBS;
  _exports.uploadJointData = uploadJointData;
  var MINIMUM_JOINT_TEXTURE_SIZE = _defaultConstants.EDITOR ? 2040 : 480; // have to be multiples of 12

  _exports.MINIMUM_JOINT_TEXTURE_SIZE = MINIMUM_JOINT_TEXTURE_SIZE;

  function selectJointsMediumFormat(device) {
    if (device.hasFeature(_device.GFXFeature.TEXTURE_FLOAT)) {
      return _define.GFXFormat.RGBA32F;
    } else {
      return _define.GFXFormat.RGBA8;
    }
  } // Linear Blending Skinning


  function uploadJointDataLBS(out, base, mat, firstBone) {
    out[base + 0] = mat.m00;
    out[base + 1] = mat.m01;
    out[base + 2] = mat.m02;
    out[base + 3] = mat.m12;
    out[base + 4] = mat.m04;
    out[base + 5] = mat.m05;
    out[base + 6] = mat.m06;
    out[base + 7] = mat.m13;
    out[base + 8] = mat.m08;
    out[base + 9] = mat.m09;
    out[base + 10] = mat.m10;
    out[base + 11] = mat.m14;
  }

  var dq_0 = new _index2.Quat();
  var dq_1 = new _index2.Quat();
  var v3_1 = new _index2.Vec3();
  var qt_1 = new _index2.Quat();
  var v3_2 = new _index2.Vec3(); // Dual Quaternion Skinning

  function uploadJointDataDQS(out, base, mat, firstBone) {
    _index2.Mat4.toRTS(mat, qt_1, v3_1, v3_2); // sign consistency


    if (firstBone) {
      _index2.Quat.copy(dq_0, qt_1);
    } else if (_index2.Quat.dot(dq_0, qt_1) < 0) {
      _index2.Quat.multiplyScalar(qt_1, qt_1, -1);
    } // conversion


    _index2.Quat.set(dq_1, v3_1.x, v3_1.y, v3_1.z, 0);

    _index2.Quat.multiplyScalar(dq_1, _index2.Quat.multiply(dq_1, dq_1, qt_1), 0.5); // upload


    out[base + 0] = qt_1.x;
    out[base + 1] = qt_1.y;
    out[base + 2] = qt_1.z;
    out[base + 3] = qt_1.w;
    out[base + 4] = dq_1.x;
    out[base + 5] = dq_1.y;
    out[base + 6] = dq_1.z;
    out[base + 7] = dq_1.w;
    out[base + 8] = v3_2.x;
    out[base + 9] = v3_2.y;
    out[base + 10] = v3_2.z;
  }

  function roundUpTextureSize(targetLength, formatSize) {
    var formatScale = 4 / Math.sqrt(formatSize);
    return Math.ceil(Math.max(MINIMUM_JOINT_TEXTURE_SIZE * formatScale, targetLength) / 12) * 12;
  }

  var jointTextureSamplerHash = (0, _samplerLib.genSamplerHash)([_define.GFXFilter.POINT, _define.GFXFilter.POINT, _define.GFXFilter.NONE, _define.GFXAddress.CLAMP, _define.GFXAddress.CLAMP, _define.GFXAddress.CLAMP]);
  _exports.jointTextureSamplerHash = jointTextureSamplerHash;
  var v3_3 = new _index2.Vec3();
  var v3_4 = new _index2.Vec3();
  var v3_min = new _index2.Vec3();
  var v3_max = new _index2.Vec3();
  var m4_1 = new _index2.Mat4();
  var m4_2 = new _index2.Mat4();
  var ab_1 = new _index.aabb();
  // Have to use some big number to replace the actual 'Infinity'.
  // For (Infinity - Infinity) evaluates to NaN
  var Inf = Number.MAX_SAFE_INTEGER;

  var JointTexturePool = /*#__PURE__*/function () {
    _createClass(JointTexturePool, [{
      key: "pixelsPerJoint",
      // per skeleton per clip
      // hash -> chunkIdx
      get: function get() {
        return this._pixelsPerJoint;
      }
    }]);

    function JointTexturePool(device) {
      _classCallCheck(this, JointTexturePool);

      this._device = void 0;
      this._pool = void 0;
      this._textureBuffers = new Map();
      this._formatSize = void 0;
      this._pixelsPerJoint = void 0;
      this._customPool = void 0;
      this._chunkIdxMap = new Map();
      this._device = device;
      var format = selectJointsMediumFormat(this._device);
      this._formatSize = _define.GFXFormatInfos[format].size;
      this._pixelsPerJoint = 48 / this._formatSize;
      this._pool = new _textureBufferPool.TextureBufferPool(device);

      this._pool.initialize({
        format: format,
        roundUpFn: roundUpTextureSize
      });

      this._customPool = new _textureBufferPool.TextureBufferPool(device);

      this._customPool.initialize({
        format: format,
        roundUpFn: roundUpTextureSize
      });
    }

    _createClass(JointTexturePool, [{
      key: "clear",
      value: function clear() {
        this._pool.destroy();

        this._textureBuffers.clear();
      }
    }, {
      key: "registerCustomTextureLayouts",
      value: function registerCustomTextureLayouts(layouts) {
        for (var i = 0; i < layouts.length; i++) {
          var layout = layouts[i];

          var chunkIdx = this._customPool.createChunk(layout.textureLength);

          for (var j = 0; j < layout.contents.length; j++) {
            var content = layout.contents[j];
            var skeleton = content.skeleton;

            this._chunkIdxMap.set(skeleton, chunkIdx); // include default pose too


            for (var k = 0; k < content.clips.length; k++) {
              var clip = content.clips[k];

              this._chunkIdxMap.set(skeleton ^ clip, chunkIdx);
            }
          }
        }
      }
      /**
       * @en
       * Get joint texture for the default pose.
       * @zh
       * 获取默认姿势的骨骼贴图。
       */

    }, {
      key: "getDefaultPoseTexture",
      value: function getDefaultPoseTexture(skeleton, mesh, skinningRoot) {
        var hash = skeleton.hash ^ 0; // may not equal to skeleton.hash

        var texture = this._textureBuffers.get(hash) || null;

        if (texture && texture.bounds.has(mesh.hash)) {
          texture.refCount++;
          return texture;
        }

        var joints = skeleton.joints,
            bindposes = skeleton.bindposes;
        var textureBuffer = null;
        var buildTexture = false;
        var jointCount = joints.length;

        if (!texture) {
          var bufSize = jointCount * 12;

          var customChunkIdx = this._chunkIdxMap.get(hash);

          var handle = customChunkIdx !== undefined ? this._customPool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT, customChunkIdx) : this._pool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT);

          if (!handle) {
            return texture;
          }

          texture = {
            pixelOffset: handle.start / this._formatSize,
            refCount: 1,
            bounds: new Map(),
            skeletonHash: skeleton.hash,
            clipHash: 0,
            readyToBeDeleted: false,
            handle: handle
          };
          textureBuffer = new Float32Array(bufSize);
          buildTexture = true;
        } else {
          texture.refCount++;
        }

        _index2.Vec3.set(v3_min, Inf, Inf, Inf);

        _index2.Vec3.set(v3_max, -Inf, -Inf, -Inf);

        var boneSpaceBounds = mesh.getBoneSpaceBounds(skeleton);

        for (var j = 0, offset = 0; j < jointCount; j++, offset += 12) {
          var node = skinningRoot.getChildByPath(joints[j]);
          var mat = node ? (0, _transformUtils.getWorldTransformUntilRoot)(node, skinningRoot, m4_1) : skeleton.inverseBindposes[j];
          var bound = boneSpaceBounds[j];

          if (bound) {
            _index.aabb.transform(ab_1, bound, mat);

            ab_1.getBoundary(v3_3, v3_4);

            _index2.Vec3.min(v3_min, v3_min, v3_3);

            _index2.Vec3.max(v3_max, v3_max, v3_4);
          }

          if (buildTexture) {
            if (node) {
              _index2.Mat4.multiply(mat, mat, bindposes[j]);
            }

            uploadJointData(textureBuffer, offset, node ? mat : _index2.Mat4.IDENTITY, j === 0);
          }
        }

        var bounds = [new _index.aabb()];
        texture.bounds.set(mesh.hash, bounds);

        _index.aabb.fromPoints(bounds[0], v3_min, v3_max);

        if (buildTexture) {
          this._pool.update(texture.handle, textureBuffer.buffer);

          this._textureBuffers.set(hash, texture);
        }

        return texture;
      }
      /**
       * @en
       * Get joint texture for the specified animation clip.
       * @zh
       * 获取指定动画片段的骨骼贴图。
       */

    }, {
      key: "getSequencePoseTexture",
      value: function getSequencePoseTexture(skeleton, clip, mesh, skinningRoot) {
        var hash = skeleton.hash ^ clip.hash;
        var texture = this._textureBuffers.get(hash) || null;

        if (texture && texture.bounds.has(mesh.hash)) {
          texture.refCount++;
          return texture;
        }

        var joints = skeleton.joints,
            bindposes = skeleton.bindposes;

        var clipData = _skeletalAnimationDataHub.SkelAnimDataHub.getOrExtract(clip);

        var frames = clipData.info.frames;
        var textureBuffer = null;
        var buildTexture = false;
        var jointCount = joints.length;

        if (!texture) {
          var bufSize = jointCount * 12 * frames;

          var customChunkIdx = this._chunkIdxMap.get(hash);

          var handle = customChunkIdx !== undefined ? this._customPool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT, customChunkIdx) : this._pool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT);

          if (!handle) {
            return null;
          }

          var animInfos = this._createAnimInfos(skeleton, clip, skinningRoot);

          texture = {
            pixelOffset: handle.start / this._formatSize,
            refCount: 1,
            bounds: new Map(),
            skeletonHash: skeleton.hash,
            clipHash: clip.hash,
            readyToBeDeleted: false,
            handle: handle,
            animInfos: animInfos
          };
          textureBuffer = new Float32Array(bufSize);
          buildTexture = true;
        } else {
          texture.refCount++;
        }

        var boneSpaceBounds = mesh.getBoneSpaceBounds(skeleton);
        var bounds = [];
        texture.bounds.set(mesh.hash, bounds);

        for (var f = 0; f < frames; f++) {
          bounds.push(new _index.aabb(Inf, Inf, Inf, -Inf, -Inf, -Inf));
        }

        for (var _f = 0, offset = 0; _f < frames; _f++) {
          var bound = bounds[_f];

          for (var j = 0; j < jointCount; j++, offset += 12) {
            var _j = texture.animInfos[j],
                curveData = _j.curveData,
                downstream = _j.downstream,
                bindposeIdx = _j.bindposeIdx,
                bindposeCorrection = _j.bindposeCorrection;
            var mat = void 0;
            var transformValid = true;

            if (curveData && downstream) {
              // curve & static two-way combination
              mat = _index2.Mat4.multiply(m4_1, curveData[_f], downstream);
            } else if (curveData) {
              // there is a curve directly controlling the joint
              mat = curveData[_f];
            } else if (downstream) {
              // fallback to default pose if no animation curve can be found upstream
              mat = downstream;
            } else {
              // bottom line: render the original mesh as-is
              mat = skeleton.inverseBindposes[bindposeIdx];
              transformValid = false;
            }

            var boneSpaceBound = boneSpaceBounds[j];

            if (boneSpaceBound) {
              var transform = bindposeCorrection ? _index2.Mat4.multiply(m4_2, mat, bindposeCorrection) : mat;

              _index.aabb.transform(ab_1, boneSpaceBound, transform);

              ab_1.getBoundary(v3_3, v3_4);

              _index2.Vec3.min(bound.center, bound.center, v3_3);

              _index2.Vec3.max(bound.halfExtents, bound.halfExtents, v3_4);
            }

            if (buildTexture) {
              if (transformValid) {
                _index2.Mat4.multiply(m4_1, mat, bindposes[bindposeIdx]);
              }

              uploadJointData(textureBuffer, offset, transformValid ? m4_1 : _index2.Mat4.IDENTITY, j === 0);
            }
          }

          _index.aabb.fromPoints(bound, bound.center, bound.halfExtents);
        }

        if (buildTexture) {
          this._pool.update(texture.handle, textureBuffer.buffer);

          this._textureBuffers.set(hash, texture);
        }

        return texture;
      }
    }, {
      key: "releaseHandle",
      value: function releaseHandle(handle) {
        if (handle.refCount > 0) {
          handle.refCount--;
        }

        if (!handle.refCount && handle.readyToBeDeleted) {
          var hash = handle.skeletonHash ^ handle.clipHash;

          var customChunkIdx = this._chunkIdxMap.get(hash);

          (customChunkIdx !== undefined ? this._customPool : this._pool).free(handle.handle);

          if (this._textureBuffers.get(hash) === handle) {
            this._textureBuffers["delete"](hash);
          }
        }
      }
    }, {
      key: "releaseSkeleton",
      value: function releaseSkeleton(skeleton) {
        var it = this._textureBuffers.values();

        var res = it.next();

        while (!res.done) {
          var handle = res.value;

          if (handle.skeletonHash === skeleton.hash) {
            handle.readyToBeDeleted = true;

            if (handle.refCount) {
              // delete handle record immediately so new allocations with the same asset could work
              this._textureBuffers["delete"](handle.skeletonHash ^ handle.clipHash);
            } else {
              this.releaseHandle(handle);
            }
          }

          res = it.next();
        }
      }
    }, {
      key: "releaseAnimationClip",
      value: function releaseAnimationClip(clip) {
        var it = this._textureBuffers.values();

        var res = it.next();

        while (!res.done) {
          var handle = res.value;

          if (handle.clipHash === clip.hash) {
            handle.readyToBeDeleted = true;

            if (handle.refCount) {
              // delete handle record immediately so new allocations with the same asset could work
              this._textureBuffers["delete"](handle.skeletonHash ^ handle.clipHash);
            } else {
              this.releaseHandle(handle);
            }
          }

          res = it.next();
        }
      }
    }, {
      key: "_createAnimInfos",
      value: function _createAnimInfos(skeleton, clip, skinningRoot) {
        var animInfos = [];
        var joints = skeleton.joints,
            bindposes = skeleton.bindposes;
        var jointCount = joints.length;

        var clipData = _skeletalAnimationDataHub.SkelAnimDataHub.getOrExtract(clip);

        for (var j = 0; j < jointCount; j++) {
          var animPath = joints[j];
          var source = clipData.data[animPath];
          var animNode = skinningRoot.getChildByPath(animPath);
          var downstream = void 0;
          var correctionPath = void 0;

          while (!source) {
            var idx = animPath.lastIndexOf('/');
            animPath = animPath.substring(0, idx);
            source = clipData.data[animPath];

            if (animNode) {
              if (!downstream) {
                downstream = new _index2.Mat4();
              }

              _index2.Mat4.fromRTS(m4_1, animNode.rotation, animNode.position, animNode.scale);

              _index2.Mat4.multiply(downstream, m4_1, downstream);

              animNode = animNode.parent;
            } else {
              // record the nearest curve path if no downstream pose is present
              correctionPath = animPath;
            }

            if (idx < 0) {
              break;
            }
          } // the default behavior, just use the bindpose for current joint directly


          var bindposeIdx = j;
          var bindposeCorrection = void 0;
          /**
           * It is regularly observed that developers may choose to delete the whole
           * skeleton node tree for skinning models that only use baked animations
           * as an effective optimization strategy (substantial improvements on both
           * package size and runtime efficiency).
           *
           * This becomes troublesome in some cases during baking though, e.g. when a
           * skeleton joint node is not directly controlled by any animation curve,
           * but its parent nodes are. Due to lack of proper downstream default pose,
           * the joint transform can not be calculated accurately.
           *
           * We address this issue by employing some pragmatic approximation.
           * Specifically, by multiplying the bindpose of the joint corresponding to
           * the nearest curve, instead of the actual target joint. This effectively
           * merges the skinning influence of the 'incomplete' joint into its nearest
           * parent with accurate transform data.
           * It gives more visually-plausible results compared to the naive approach
           * for most cases we've covered.
           */

          if (correctionPath !== undefined && source) {
            // just use the previous joint if the exact path is not found
            bindposeIdx = j - 1;

            for (var t = 0; t < jointCount; t++) {
              if (joints[t] === correctionPath) {
                bindposeIdx = t;
                bindposeCorrection = new _index2.Mat4();

                _index2.Mat4.multiply(bindposeCorrection, bindposes[t], skeleton.inverseBindposes[j]);

                break;
              }
            }
          }

          animInfos.push({
            curveData: source && source.worldMatrix.values,
            downstream: downstream,
            bindposeIdx: bindposeIdx,
            bindposeCorrection: bindposeCorrection
          });
        }

        return animInfos;
      }
    }]);

    return JointTexturePool;
  }();

  _exports.JointTexturePool = JointTexturePool;

  var JointAnimationInfo = /*#__PURE__*/function () {
    // per node
    function JointAnimationInfo(device) {
      _classCallCheck(this, JointAnimationInfo);

      this._pool = new Map();
      this._device = void 0;
      this._device = device;
    }

    _createClass(JointAnimationInfo, [{
      key: "getData",
      value: function getData() {
        var nodeID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '-1';

        var res = this._pool.get(nodeID);

        if (res) {
          return res;
        }

        var buffer = this._device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.UNIFORM | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _define2.UBOSkinningAnimation.SIZE, _define2.UBOSkinningAnimation.SIZE));

        var data = new Float32Array([0, 0, 0, 0]);
        buffer.update(data);
        var info = {
          buffer: buffer,
          data: data,
          dirty: false
        };

        this._pool.set(nodeID, info);

        return info;
      }
    }, {
      key: "destroy",
      value: function destroy(nodeID) {
        var info = this._pool.get(nodeID);

        if (!info) {
          return;
        }

        info.buffer.destroy();

        this._pool["delete"](nodeID);
      }
    }, {
      key: "switchClip",
      value: function switchClip(info, clip) {
        info.data[0] = 0;
        info.buffer.update(info.data);
        info.dirty = false;
        return info;
      }
    }, {
      key: "clear",
      value: function clear() {
        var _iterator = _createForOfIteratorHelper(this._pool.values()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var info = _step.value;
            info.buffer.destroy();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._pool.clear();
      }
    }]);

    return JointAnimationInfo;
  }();

  _exports.JointAnimationInfo = JointAnimationInfo;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvbW9kZWxzL3NrZWxldGFsLWFuaW1hdGlvbi11dGlscy50cyJdLCJuYW1lcyI6WyJ1cGxvYWRKb2ludERhdGEiLCJ1cGxvYWRKb2ludERhdGFMQlMiLCJNSU5JTVVNX0pPSU5UX1RFWFRVUkVfU0laRSIsIkVESVRPUiIsInNlbGVjdEpvaW50c01lZGl1bUZvcm1hdCIsImRldmljZSIsImhhc0ZlYXR1cmUiLCJHRlhGZWF0dXJlIiwiVEVYVFVSRV9GTE9BVCIsIkdGWEZvcm1hdCIsIlJHQkEzMkYiLCJSR0JBOCIsIm91dCIsImJhc2UiLCJtYXQiLCJmaXJzdEJvbmUiLCJtMDAiLCJtMDEiLCJtMDIiLCJtMTIiLCJtMDQiLCJtMDUiLCJtMDYiLCJtMTMiLCJtMDgiLCJtMDkiLCJtMTAiLCJtMTQiLCJkcV8wIiwiUXVhdCIsImRxXzEiLCJ2M18xIiwiVmVjMyIsInF0XzEiLCJ2M18yIiwidXBsb2FkSm9pbnREYXRhRFFTIiwiTWF0NCIsInRvUlRTIiwiY29weSIsImRvdCIsIm11bHRpcGx5U2NhbGFyIiwic2V0IiwieCIsInkiLCJ6IiwibXVsdGlwbHkiLCJ3Iiwicm91bmRVcFRleHR1cmVTaXplIiwidGFyZ2V0TGVuZ3RoIiwiZm9ybWF0U2l6ZSIsImZvcm1hdFNjYWxlIiwiTWF0aCIsInNxcnQiLCJjZWlsIiwibWF4Iiwiam9pbnRUZXh0dXJlU2FtcGxlckhhc2giLCJHRlhGaWx0ZXIiLCJQT0lOVCIsIk5PTkUiLCJHRlhBZGRyZXNzIiwiQ0xBTVAiLCJ2M18zIiwidjNfNCIsInYzX21pbiIsInYzX21heCIsIm00XzEiLCJtNF8yIiwiYWJfMSIsImFhYmIiLCJJbmYiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwiSm9pbnRUZXh0dXJlUG9vbCIsIl9waXhlbHNQZXJKb2ludCIsIl9kZXZpY2UiLCJfcG9vbCIsIl90ZXh0dXJlQnVmZmVycyIsIk1hcCIsIl9mb3JtYXRTaXplIiwiX2N1c3RvbVBvb2wiLCJfY2h1bmtJZHhNYXAiLCJmb3JtYXQiLCJHRlhGb3JtYXRJbmZvcyIsInNpemUiLCJUZXh0dXJlQnVmZmVyUG9vbCIsImluaXRpYWxpemUiLCJyb3VuZFVwRm4iLCJkZXN0cm95IiwiY2xlYXIiLCJsYXlvdXRzIiwiaSIsImxlbmd0aCIsImxheW91dCIsImNodW5rSWR4IiwiY3JlYXRlQ2h1bmsiLCJ0ZXh0dXJlTGVuZ3RoIiwiaiIsImNvbnRlbnRzIiwiY29udGVudCIsInNrZWxldG9uIiwiayIsImNsaXBzIiwiY2xpcCIsIm1lc2giLCJza2lubmluZ1Jvb3QiLCJoYXNoIiwidGV4dHVyZSIsImdldCIsImJvdW5kcyIsImhhcyIsInJlZkNvdW50Iiwiam9pbnRzIiwiYmluZHBvc2VzIiwidGV4dHVyZUJ1ZmZlciIsImJ1aWxkVGV4dHVyZSIsImpvaW50Q291bnQiLCJidWZTaXplIiwiY3VzdG9tQ2h1bmtJZHgiLCJoYW5kbGUiLCJ1bmRlZmluZWQiLCJhbGxvYyIsIkZsb2F0MzJBcnJheSIsIkJZVEVTX1BFUl9FTEVNRU5UIiwicGl4ZWxPZmZzZXQiLCJzdGFydCIsInNrZWxldG9uSGFzaCIsImNsaXBIYXNoIiwicmVhZHlUb0JlRGVsZXRlZCIsImJvbmVTcGFjZUJvdW5kcyIsImdldEJvbmVTcGFjZUJvdW5kcyIsIm9mZnNldCIsIm5vZGUiLCJnZXRDaGlsZEJ5UGF0aCIsImludmVyc2VCaW5kcG9zZXMiLCJib3VuZCIsInRyYW5zZm9ybSIsImdldEJvdW5kYXJ5IiwibWluIiwiSURFTlRJVFkiLCJmcm9tUG9pbnRzIiwidXBkYXRlIiwiYnVmZmVyIiwiY2xpcERhdGEiLCJTa2VsQW5pbURhdGFIdWIiLCJnZXRPckV4dHJhY3QiLCJmcmFtZXMiLCJpbmZvIiwiYW5pbUluZm9zIiwiX2NyZWF0ZUFuaW1JbmZvcyIsImYiLCJwdXNoIiwiY3VydmVEYXRhIiwiZG93bnN0cmVhbSIsImJpbmRwb3NlSWR4IiwiYmluZHBvc2VDb3JyZWN0aW9uIiwidHJhbnNmb3JtVmFsaWQiLCJib25lU3BhY2VCb3VuZCIsImNlbnRlciIsImhhbGZFeHRlbnRzIiwiZnJlZSIsIml0IiwidmFsdWVzIiwicmVzIiwibmV4dCIsImRvbmUiLCJ2YWx1ZSIsInJlbGVhc2VIYW5kbGUiLCJhbmltUGF0aCIsInNvdXJjZSIsImRhdGEiLCJhbmltTm9kZSIsImNvcnJlY3Rpb25QYXRoIiwiaWR4IiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCJmcm9tUlRTIiwicm90YXRpb24iLCJwb3NpdGlvbiIsInNjYWxlIiwicGFyZW50IiwidCIsIndvcmxkTWF0cml4IiwiSm9pbnRBbmltYXRpb25JbmZvIiwibm9kZUlEIiwiY3JlYXRlQnVmZmVyIiwiR0ZYQnVmZmVySW5mbyIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiVU5JRk9STSIsIlRSQU5TRkVSX0RTVCIsIkdGWE1lbW9yeVVzYWdlQml0IiwiSE9TVCIsIkRFVklDRSIsIlVCT1NraW5uaW5nQW5pbWF0aW9uIiwiU0laRSIsImRpcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2Q0E7QUFDTyxNQUFNQSxlQUFlLEdBQUdDLGtCQUF4Qjs7QUFDQSxNQUFNQywwQkFBMEIsR0FBR0MsMkJBQVMsSUFBVCxHQUFnQixHQUFuRCxDLENBQXdEOzs7O0FBRXhELFdBQVNDLHdCQUFULENBQW1DQyxNQUFuQyxFQUFpRTtBQUNwRSxRQUFJQSxNQUFNLENBQUNDLFVBQVAsQ0FBa0JDLG1CQUFXQyxhQUE3QixDQUFKLEVBQWlEO0FBQzdDLGFBQU9DLGtCQUFVQyxPQUFqQjtBQUNILEtBRkQsTUFFTztBQUNILGFBQU9ELGtCQUFVRSxLQUFqQjtBQUNIO0FBQ0osRyxDQUVEOzs7QUFDQSxXQUFTVixrQkFBVCxDQUE2QlcsR0FBN0IsRUFBZ0RDLElBQWhELEVBQThEQyxHQUE5RCxFQUF5RUMsU0FBekUsRUFBNkY7QUFDekZILElBQUFBLEdBQUcsQ0FBQ0MsSUFBSSxHQUFHLENBQVIsQ0FBSCxHQUFnQkMsR0FBRyxDQUFDRSxH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IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uQ2xpcCB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi9hbmltYXRpb24tY2xpcCc7XHJcbmltcG9ydCB7IFNrZWxBbmltRGF0YUh1YiB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi9za2VsZXRhbC1hbmltYXRpb24tZGF0YS1odWInO1xyXG5pbXBvcnQgeyBnZXRXb3JsZFRyYW5zZm9ybVVudGlsUm9vdCB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi90cmFuc2Zvcm0tdXRpbHMnO1xyXG5pbXBvcnQgeyBNZXNoIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21lc2gnO1xyXG5pbXBvcnQgeyBTa2VsZXRvbiB9IGZyb20gJy4uLy4uL2Fzc2V0cy9za2VsZXRvbic7XHJcbmltcG9ydCB7IGFhYmIgfSBmcm9tICcuLi8uLi9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlciwgR0ZYQnVmZmVySW5mbyB9IGZyb20gJy4uLy4uL2dmeC9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhBZGRyZXNzLCBHRlhCdWZmZXJVc2FnZUJpdCwgR0ZYRmlsdGVyLCBHRlhGb3JtYXQsIEdGWEZvcm1hdEluZm9zLCBHRlhNZW1vcnlVc2FnZUJpdCB9IGZyb20gJy4uLy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UsIEdGWEZlYXR1cmUgfSBmcm9tICcuLi8uLi9nZngvZGV2aWNlJztcclxuaW1wb3J0IHsgTWF0NCwgUXVhdCwgVmVjMyB9IGZyb20gJy4uLy4uL21hdGgnO1xyXG5pbXBvcnQgeyBVQk9Ta2lubmluZ0FuaW1hdGlvbiB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IGdlblNhbXBsZXJIYXNoIH0gZnJvbSAnLi4vY29yZS9zYW1wbGVyLWxpYic7XHJcbmltcG9ydCB7IElUZXh0dXJlQnVmZmVySGFuZGxlLCBUZXh0dXJlQnVmZmVyUG9vbCB9IGZyb20gJy4uL2NvcmUvdGV4dHVyZS1idWZmZXItcG9vbCc7XHJcblxyXG4vLyBjaGFuZ2UgaGVyZSBhbmQgY2Mtc2tpbm5pbmcuY2h1bmsgdG8gdXNlIG90aGVyIHNraW5uaW5nIGFsZ29yaXRobXNcclxuZXhwb3J0IGNvbnN0IHVwbG9hZEpvaW50RGF0YSA9IHVwbG9hZEpvaW50RGF0YUxCUztcclxuZXhwb3J0IGNvbnN0IE1JTklNVU1fSk9JTlRfVEVYVFVSRV9TSVpFID0gRURJVE9SID8gMjA0MCA6IDQ4MDsgLy8gaGF2ZSB0byBiZSBtdWx0aXBsZXMgb2YgMTJcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RKb2ludHNNZWRpdW1Gb3JtYXQgKGRldmljZTogR0ZYRGV2aWNlKTogR0ZYRm9ybWF0IHtcclxuICAgIGlmIChkZXZpY2UuaGFzRmVhdHVyZShHRlhGZWF0dXJlLlRFWFRVUkVfRkxPQVQpKSB7XHJcbiAgICAgICAgcmV0dXJuIEdGWEZvcm1hdC5SR0JBMzJGO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gR0ZYRm9ybWF0LlJHQkE4O1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBMaW5lYXIgQmxlbmRpbmcgU2tpbm5pbmdcclxuZnVuY3Rpb24gdXBsb2FkSm9pbnREYXRhTEJTIChvdXQ6IEZsb2F0MzJBcnJheSwgYmFzZTogbnVtYmVyLCBtYXQ6IE1hdDQsIGZpcnN0Qm9uZTogYm9vbGVhbikge1xyXG4gICAgb3V0W2Jhc2UgKyAwXSA9IG1hdC5tMDA7XHJcbiAgICBvdXRbYmFzZSArIDFdID0gbWF0Lm0wMTtcclxuICAgIG91dFtiYXNlICsgMl0gPSBtYXQubTAyO1xyXG4gICAgb3V0W2Jhc2UgKyAzXSA9IG1hdC5tMTI7XHJcbiAgICBvdXRbYmFzZSArIDRdID0gbWF0Lm0wNDtcclxuICAgIG91dFtiYXNlICsgNV0gPSBtYXQubTA1O1xyXG4gICAgb3V0W2Jhc2UgKyA2XSA9IG1hdC5tMDY7XHJcbiAgICBvdXRbYmFzZSArIDddID0gbWF0Lm0xMztcclxuICAgIG91dFtiYXNlICsgOF0gPSBtYXQubTA4O1xyXG4gICAgb3V0W2Jhc2UgKyA5XSA9IG1hdC5tMDk7XHJcbiAgICBvdXRbYmFzZSArIDEwXSA9IG1hdC5tMTA7XHJcbiAgICBvdXRbYmFzZSArIDExXSA9IG1hdC5tMTQ7XHJcbn1cclxuXHJcbmNvbnN0IGRxXzAgPSBuZXcgUXVhdCgpO1xyXG5jb25zdCBkcV8xID0gbmV3IFF1YXQoKTtcclxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IHF0XzEgPSBuZXcgUXVhdCgpO1xyXG5jb25zdCB2M18yID0gbmV3IFZlYzMoKTtcclxuXHJcbi8vIER1YWwgUXVhdGVybmlvbiBTa2lubmluZ1xyXG5mdW5jdGlvbiB1cGxvYWRKb2ludERhdGFEUVMgKG91dDogRmxvYXQzMkFycmF5LCBiYXNlOiBudW1iZXIsIG1hdDogTWF0NCwgZmlyc3RCb25lOiBib29sZWFuKSB7XHJcbiAgICBNYXQ0LnRvUlRTKG1hdCwgcXRfMSwgdjNfMSwgdjNfMik7XHJcbiAgICAvLyBzaWduIGNvbnNpc3RlbmN5XHJcbiAgICBpZiAoZmlyc3RCb25lKSB7IFF1YXQuY29weShkcV8wLCBxdF8xKTsgfVxyXG4gICAgZWxzZSBpZiAoUXVhdC5kb3QoZHFfMCwgcXRfMSkgPCAwKSB7IFF1YXQubXVsdGlwbHlTY2FsYXIocXRfMSwgcXRfMSwgLTEpOyB9XHJcbiAgICAvLyBjb252ZXJzaW9uXHJcbiAgICBRdWF0LnNldChkcV8xLCB2M18xLngsIHYzXzEueSwgdjNfMS56LCAwKTtcclxuICAgIFF1YXQubXVsdGlwbHlTY2FsYXIoZHFfMSwgUXVhdC5tdWx0aXBseShkcV8xLCBkcV8xLCBxdF8xKSwgMC41KTtcclxuICAgIC8vIHVwbG9hZFxyXG4gICAgb3V0W2Jhc2UgKyAwXSA9IHF0XzEueDtcclxuICAgIG91dFtiYXNlICsgMV0gPSBxdF8xLnk7XHJcbiAgICBvdXRbYmFzZSArIDJdID0gcXRfMS56O1xyXG4gICAgb3V0W2Jhc2UgKyAzXSA9IHF0XzEudztcclxuICAgIG91dFtiYXNlICsgNF0gPSBkcV8xLng7XHJcbiAgICBvdXRbYmFzZSArIDVdID0gZHFfMS55O1xyXG4gICAgb3V0W2Jhc2UgKyA2XSA9IGRxXzEuejtcclxuICAgIG91dFtiYXNlICsgN10gPSBkcV8xLnc7XHJcbiAgICBvdXRbYmFzZSArIDhdID0gdjNfMi54O1xyXG4gICAgb3V0W2Jhc2UgKyA5XSA9IHYzXzIueTtcclxuICAgIG91dFtiYXNlICsgMTBdID0gdjNfMi56O1xyXG59XHJcblxyXG5mdW5jdGlvbiByb3VuZFVwVGV4dHVyZVNpemUgKHRhcmdldExlbmd0aDogbnVtYmVyLCBmb3JtYXRTaXplOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGZvcm1hdFNjYWxlID0gNCAvIE1hdGguc3FydChmb3JtYXRTaXplKTtcclxuICAgIHJldHVybiBNYXRoLmNlaWwoTWF0aC5tYXgoTUlOSU1VTV9KT0lOVF9URVhUVVJFX1NJWkUgKiBmb3JtYXRTY2FsZSwgdGFyZ2V0TGVuZ3RoKSAvIDEyKSAqIDEyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgam9pbnRUZXh0dXJlU2FtcGxlckhhc2ggPSBnZW5TYW1wbGVySGFzaChbXHJcbiAgICBHRlhGaWx0ZXIuUE9JTlQsXHJcbiAgICBHRlhGaWx0ZXIuUE9JTlQsXHJcbiAgICBHRlhGaWx0ZXIuTk9ORSxcclxuICAgIEdGWEFkZHJlc3MuQ0xBTVAsXHJcbiAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG4gICAgR0ZYQWRkcmVzcy5DTEFNUCxcclxuXSk7XHJcblxyXG5pbnRlcmZhY2UgSUludGVybmFsSm9pbnRBbmltSW5mbyB7XHJcbiAgICBkb3duc3RyZWFtPzogTWF0NDsgLy8gZG93bnN0cmVhbSBkZWZhdWx0IHBvc2UsIGlmIHByZXNlbnRcclxuICAgIGN1cnZlRGF0YT86IE1hdDRbXTsgLy8gdGhlIG5lYXJlc3QgYW5pbWF0aW9uIGN1cnZlLCBpZiBwcmVzZW50XHJcbiAgICBiaW5kcG9zZUlkeDogbnVtYmVyOyAvLyBpbmRleCBvZiB0aGUgYWN0dWFsIGJpbmRwb3NlIHRvIHVzZVxyXG4gICAgYmluZHBvc2VDb3JyZWN0aW9uPzogTWF0NDsgLy8gY29ycmVjdGlvbiBmYWN0b3IgZnJvbSB0aGUgb3JpZ2luYWwgYmluZHBvc2VcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSm9pbnRUZXh0dXJlSGFuZGxlIHtcclxuICAgIHBpeGVsT2Zmc2V0OiBudW1iZXI7XHJcbiAgICByZWZDb3VudDogbnVtYmVyO1xyXG4gICAgY2xpcEhhc2g6IG51bWJlcjtcclxuICAgIHNrZWxldG9uSGFzaDogbnVtYmVyO1xyXG4gICAgcmVhZHlUb0JlRGVsZXRlZDogYm9vbGVhbjtcclxuICAgIGhhbmRsZTogSVRleHR1cmVCdWZmZXJIYW5kbGU7XHJcbiAgICBib3VuZHM6IE1hcDxudW1iZXIsIGFhYmJbXT47XHJcbiAgICBhbmltSW5mb3M/OiBJSW50ZXJuYWxKb2ludEFuaW1JbmZvW107XHJcbn1cclxuXHJcbmNvbnN0IHYzXzMgPSBuZXcgVmVjMygpO1xyXG5jb25zdCB2M180ID0gbmV3IFZlYzMoKTtcclxuY29uc3QgdjNfbWluID0gbmV3IFZlYzMoKTtcclxuY29uc3QgdjNfbWF4ID0gbmV3IFZlYzMoKTtcclxuY29uc3QgbTRfMSA9IG5ldyBNYXQ0KCk7XHJcbmNvbnN0IG00XzIgPSBuZXcgTWF0NCgpO1xyXG5jb25zdCBhYl8xID0gbmV3IGFhYmIoKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNodW5rQ29udGVudCB7XHJcbiAgICBza2VsZXRvbjogbnVtYmVyO1xyXG4gICAgY2xpcHM6IG51bWJlcltdO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSUN1c3RvbUpvaW50VGV4dHVyZUxheW91dCB7XHJcbiAgICB0ZXh0dXJlTGVuZ3RoOiBudW1iZXI7XHJcbiAgICBjb250ZW50czogSUNodW5rQ29udGVudFtdO1xyXG59XHJcblxyXG4vLyBIYXZlIHRvIHVzZSBzb21lIGJpZyBudW1iZXIgdG8gcmVwbGFjZSB0aGUgYWN0dWFsICdJbmZpbml0eScuXHJcbi8vIEZvciAoSW5maW5pdHkgLSBJbmZpbml0eSkgZXZhbHVhdGVzIHRvIE5hTlxyXG5jb25zdCBJbmYgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuXHJcbmV4cG9ydCBjbGFzcyBKb2ludFRleHR1cmVQb29sIHtcclxuXHJcbiAgICBwcml2YXRlIF9kZXZpY2U6IEdGWERldmljZTtcclxuICAgIHByaXZhdGUgX3Bvb2w6IFRleHR1cmVCdWZmZXJQb29sO1xyXG4gICAgcHJpdmF0ZSBfdGV4dHVyZUJ1ZmZlcnMgPSBuZXcgTWFwPG51bWJlciwgSUpvaW50VGV4dHVyZUhhbmRsZT4oKTsgLy8gcGVyIHNrZWxldG9uIHBlciBjbGlwXHJcbiAgICBwcml2YXRlIF9mb3JtYXRTaXplOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9waXhlbHNQZXJKb2ludDogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgX2N1c3RvbVBvb2w6IFRleHR1cmVCdWZmZXJQb29sO1xyXG4gICAgcHJpdmF0ZSBfY2h1bmtJZHhNYXAgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpOyAvLyBoYXNoIC0+IGNodW5rSWR4XHJcblxyXG4gICAgZ2V0IHBpeGVsc1BlckpvaW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGl4ZWxzUGVySm9pbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgICAgIGNvbnN0IGZvcm1hdCA9IHNlbGVjdEpvaW50c01lZGl1bUZvcm1hdCh0aGlzLl9kZXZpY2UpO1xyXG4gICAgICAgIHRoaXMuX2Zvcm1hdFNpemUgPSBHRlhGb3JtYXRJbmZvc1tmb3JtYXRdLnNpemU7XHJcbiAgICAgICAgdGhpcy5fcGl4ZWxzUGVySm9pbnQgPSA0OCAvIHRoaXMuX2Zvcm1hdFNpemU7XHJcbiAgICAgICAgdGhpcy5fcG9vbCA9IG5ldyBUZXh0dXJlQnVmZmVyUG9vbChkZXZpY2UpO1xyXG4gICAgICAgIHRoaXMuX3Bvb2wuaW5pdGlhbGl6ZSh7IGZvcm1hdCwgcm91bmRVcEZuOiByb3VuZFVwVGV4dHVyZVNpemUgfSk7XHJcbiAgICAgICAgdGhpcy5fY3VzdG9tUG9vbCA9IG5ldyBUZXh0dXJlQnVmZmVyUG9vbChkZXZpY2UpO1xyXG4gICAgICAgIHRoaXMuX2N1c3RvbVBvb2wuaW5pdGlhbGl6ZSh7IGZvcm1hdCwgcm91bmRVcEZuOiByb3VuZFVwVGV4dHVyZVNpemUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICB0aGlzLl9wb29sLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl90ZXh0dXJlQnVmZmVycy5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckN1c3RvbVRleHR1cmVMYXlvdXRzIChsYXlvdXRzOiBJQ3VzdG9tSm9pbnRUZXh0dXJlTGF5b3V0W10pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxheW91dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbGF5b3V0ID0gbGF5b3V0c1tpXTtcclxuICAgICAgICAgICAgY29uc3QgY2h1bmtJZHggPSB0aGlzLl9jdXN0b21Qb29sLmNyZWF0ZUNodW5rKGxheW91dC50ZXh0dXJlTGVuZ3RoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsYXlvdXQuY29udGVudHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBsYXlvdXQuY29udGVudHNbal07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBza2VsZXRvbiA9IGNvbnRlbnQuc2tlbGV0b247XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jaHVua0lkeE1hcC5zZXQoc2tlbGV0b24sIGNodW5rSWR4KTsgLy8gaW5jbHVkZSBkZWZhdWx0IHBvc2UgdG9vXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGNvbnRlbnQuY2xpcHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGlwID0gY29udGVudC5jbGlwc1trXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaHVua0lkeE1hcC5zZXQoc2tlbGV0b24gXiBjbGlwLCBjaHVua0lkeCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCBqb2ludCB0ZXh0dXJlIGZvciB0aGUgZGVmYXVsdCBwb3NlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bpu5jorqTlp7/lir/nmoTpqqjpqrzotLTlm77jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldERlZmF1bHRQb3NlVGV4dHVyZSAoc2tlbGV0b246IFNrZWxldG9uLCBtZXNoOiBNZXNoLCBza2lubmluZ1Jvb3Q6IE5vZGUpIHtcclxuICAgICAgICBjb25zdCBoYXNoID0gc2tlbGV0b24uaGFzaCBeIDA7IC8vIG1heSBub3QgZXF1YWwgdG8gc2tlbGV0b24uaGFzaFxyXG4gICAgICAgIGxldCB0ZXh0dXJlOiBJSm9pbnRUZXh0dXJlSGFuZGxlIHwgbnVsbCA9IHRoaXMuX3RleHR1cmVCdWZmZXJzLmdldChoYXNoKSB8fCBudWxsO1xyXG4gICAgICAgIGlmICh0ZXh0dXJlICYmIHRleHR1cmUuYm91bmRzLmhhcyhtZXNoLmhhc2gpKSB7IHRleHR1cmUucmVmQ291bnQrKzsgcmV0dXJuIHRleHR1cmU7IH1cclxuICAgICAgICBjb25zdCB7IGpvaW50cywgYmluZHBvc2VzIH0gPSBza2VsZXRvbjtcclxuICAgICAgICBsZXQgdGV4dHVyZUJ1ZmZlcjogRmxvYXQzMkFycmF5ID0gbnVsbCE7IGxldCBidWlsZFRleHR1cmUgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBqb2ludENvdW50ID0gam9pbnRzLmxlbmd0aDtcclxuICAgICAgICBpZiAoIXRleHR1cmUpIHtcclxuICAgICAgICAgICAgY29uc3QgYnVmU2l6ZSA9IGpvaW50Q291bnQgKiAxMjtcclxuICAgICAgICAgICAgY29uc3QgY3VzdG9tQ2h1bmtJZHggPSB0aGlzLl9jaHVua0lkeE1hcC5nZXQoaGFzaCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IGN1c3RvbUNodW5rSWR4ICE9PSB1bmRlZmluZWQgP1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VzdG9tUG9vbC5hbGxvYyhidWZTaXplICogRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCBjdXN0b21DaHVua0lkeCkgOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9vbC5hbGxvYyhidWZTaXplICogRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UKTtcclxuICAgICAgICAgICAgaWYgKCFoYW5kbGUpIHsgcmV0dXJuIHRleHR1cmU7IH1cclxuICAgICAgICAgICAgdGV4dHVyZSA9IHsgcGl4ZWxPZmZzZXQ6IGhhbmRsZS5zdGFydCAvIHRoaXMuX2Zvcm1hdFNpemUsIHJlZkNvdW50OiAxLCBib3VuZHM6IG5ldyBNYXAoKSxcclxuICAgICAgICAgICAgICAgIHNrZWxldG9uSGFzaDogc2tlbGV0b24uaGFzaCwgY2xpcEhhc2g6IDAsIHJlYWR5VG9CZURlbGV0ZWQ6IGZhbHNlLCBoYW5kbGUgfTtcclxuICAgICAgICAgICAgdGV4dHVyZUJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmU2l6ZSk7IGJ1aWxkVGV4dHVyZSA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHsgdGV4dHVyZS5yZWZDb3VudCsrOyB9XHJcbiAgICAgICAgVmVjMy5zZXQodjNfbWluLCAgSW5mLCAgSW5mLCAgSW5mKTtcclxuICAgICAgICBWZWMzLnNldCh2M19tYXgsIC1JbmYsIC1JbmYsIC1JbmYpO1xyXG4gICAgICAgIGNvbnN0IGJvbmVTcGFjZUJvdW5kcyA9IG1lc2guZ2V0Qm9uZVNwYWNlQm91bmRzKHNrZWxldG9uKTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMCwgb2Zmc2V0ID0gMDsgaiA8IGpvaW50Q291bnQ7IGorKywgb2Zmc2V0ICs9IDEyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBza2lubmluZ1Jvb3QuZ2V0Q2hpbGRCeVBhdGgoam9pbnRzW2pdKTtcclxuICAgICAgICAgICAgY29uc3QgbWF0ID0gbm9kZSA/IGdldFdvcmxkVHJhbnNmb3JtVW50aWxSb290KG5vZGUsIHNraW5uaW5nUm9vdCwgbTRfMSkgOiBza2VsZXRvbi5pbnZlcnNlQmluZHBvc2VzW2pdO1xyXG4gICAgICAgICAgICBjb25zdCBib3VuZCA9IGJvbmVTcGFjZUJvdW5kc1tqXTtcclxuICAgICAgICAgICAgaWYgKGJvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICBhYWJiLnRyYW5zZm9ybShhYl8xLCBib3VuZCwgbWF0KTtcclxuICAgICAgICAgICAgICAgIGFiXzEuZ2V0Qm91bmRhcnkodjNfMywgdjNfNCk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLm1pbih2M19taW4sIHYzX21pbiwgdjNfMyk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLm1heCh2M19tYXgsIHYzX21heCwgdjNfNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGJ1aWxkVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUpIHsgTWF0NC5tdWx0aXBseShtYXQsIG1hdCwgYmluZHBvc2VzW2pdKTsgfVxyXG4gICAgICAgICAgICAgICAgdXBsb2FkSm9pbnREYXRhKHRleHR1cmVCdWZmZXIsIG9mZnNldCwgbm9kZSA/IG1hdCA6IE1hdDQuSURFTlRJVFksIGogPT09IDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IFtuZXcgYWFiYigpXTsgdGV4dHVyZS5ib3VuZHMuc2V0KG1lc2guaGFzaCwgYm91bmRzKTtcclxuICAgICAgICBhYWJiLmZyb21Qb2ludHMoYm91bmRzWzBdLCB2M19taW4sIHYzX21heCk7XHJcbiAgICAgICAgaWYgKGJ1aWxkVGV4dHVyZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9wb29sLnVwZGF0ZSh0ZXh0dXJlLmhhbmRsZSwgdGV4dHVyZUJ1ZmZlci5idWZmZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlQnVmZmVycy5zZXQoaGFzaCwgdGV4dHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgam9pbnQgdGV4dHVyZSBmb3IgdGhlIHNwZWNpZmllZCBhbmltYXRpb24gY2xpcC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oyH5a6a5Yqo55S754mH5q6155qE6aqo6aq86LS05Zu+44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTZXF1ZW5jZVBvc2VUZXh0dXJlIChza2VsZXRvbjogU2tlbGV0b24sIGNsaXA6IEFuaW1hdGlvbkNsaXAsIG1lc2g6IE1lc2gsIHNraW5uaW5nUm9vdDogTm9kZSkge1xyXG4gICAgICAgIGNvbnN0IGhhc2ggPSBza2VsZXRvbi5oYXNoIF4gY2xpcC5oYXNoO1xyXG4gICAgICAgIGxldCB0ZXh0dXJlOiBJSm9pbnRUZXh0dXJlSGFuZGxlIHwgbnVsbCA9IHRoaXMuX3RleHR1cmVCdWZmZXJzLmdldChoYXNoKSB8fCBudWxsO1xyXG4gICAgICAgIGlmICh0ZXh0dXJlICYmIHRleHR1cmUuYm91bmRzLmhhcyhtZXNoLmhhc2gpKSB7IHRleHR1cmUucmVmQ291bnQrKzsgcmV0dXJuIHRleHR1cmU7IH1cclxuICAgICAgICBjb25zdCB7IGpvaW50cywgYmluZHBvc2VzIH0gPSBza2VsZXRvbjtcclxuICAgICAgICBjb25zdCBjbGlwRGF0YSA9IFNrZWxBbmltRGF0YUh1Yi5nZXRPckV4dHJhY3QoY2xpcCk7XHJcbiAgICAgICAgY29uc3QgZnJhbWVzID0gY2xpcERhdGEuaW5mby5mcmFtZXM7XHJcbiAgICAgICAgbGV0IHRleHR1cmVCdWZmZXI6IEZsb2F0MzJBcnJheSA9IG51bGwhOyBsZXQgYnVpbGRUZXh0dXJlID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3Qgam9pbnRDb3VudCA9IGpvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCF0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZlNpemUgPSBqb2ludENvdW50ICogMTIgKiBmcmFtZXM7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbUNodW5rSWR4ID0gdGhpcy5fY2h1bmtJZHhNYXAuZ2V0KGhhc2gpO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGUgPSBjdXN0b21DaHVua0lkeCAhPT0gdW5kZWZpbmVkID9cclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1c3RvbVBvb2wuYWxsb2MoYnVmU2l6ZSAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCwgY3VzdG9tQ2h1bmtJZHgpIDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Bvb2wuYWxsb2MoYnVmU2l6ZSAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCk7XHJcbiAgICAgICAgICAgIGlmICghaGFuZGxlKSB7IHJldHVybiBudWxsOyB9XHJcbiAgICAgICAgICAgIGNvbnN0IGFuaW1JbmZvcyA9IHRoaXMuX2NyZWF0ZUFuaW1JbmZvcyhza2VsZXRvbiwgY2xpcCwgc2tpbm5pbmdSb290KTtcclxuICAgICAgICAgICAgdGV4dHVyZSA9IHsgcGl4ZWxPZmZzZXQ6IGhhbmRsZS5zdGFydCAvIHRoaXMuX2Zvcm1hdFNpemUsIHJlZkNvdW50OiAxLCBib3VuZHM6IG5ldyBNYXAoKSxcclxuICAgICAgICAgICAgICAgIHNrZWxldG9uSGFzaDogc2tlbGV0b24uaGFzaCwgY2xpcEhhc2g6IGNsaXAuaGFzaCwgcmVhZHlUb0JlRGVsZXRlZDogZmFsc2UsIGhhbmRsZSwgYW5pbUluZm9zIH07XHJcbiAgICAgICAgICAgIHRleHR1cmVCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZlNpemUpOyBidWlsZFRleHR1cmUgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7IHRleHR1cmUucmVmQ291bnQrKzsgfVxyXG4gICAgICAgIGNvbnN0IGJvbmVTcGFjZUJvdW5kcyA9IG1lc2guZ2V0Qm9uZVNwYWNlQm91bmRzKHNrZWxldG9uKTtcclxuICAgICAgICBjb25zdCBib3VuZHM6IGFhYmJbXSA9IFtdOyB0ZXh0dXJlLmJvdW5kcy5zZXQobWVzaC5oYXNoLCBib3VuZHMpO1xyXG4gICAgICAgIGZvciAobGV0IGYgPSAwOyBmIDwgZnJhbWVzOyBmKyspIHtcclxuICAgICAgICAgICAgYm91bmRzLnB1c2gobmV3IGFhYmIoSW5mLCBJbmYsIEluZiwgLUluZiwgLUluZiwgLUluZikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBmID0gMCwgb2Zmc2V0ID0gMDsgZiA8IGZyYW1lczsgZisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kID0gYm91bmRzW2ZdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGpvaW50Q291bnQ7IGorKywgb2Zmc2V0ICs9IDEyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IGN1cnZlRGF0YSwgZG93bnN0cmVhbSwgYmluZHBvc2VJZHgsIGJpbmRwb3NlQ29ycmVjdGlvbiB9ID0gdGV4dHVyZS5hbmltSW5mb3MhW2pdO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hdDogTWF0NDsgbGV0IHRyYW5zZm9ybVZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJ2ZURhdGEgJiYgZG93bnN0cmVhbSkgeyAvLyBjdXJ2ZSAmIHN0YXRpYyB0d28td2F5IGNvbWJpbmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ID0gTWF0NC5tdWx0aXBseShtNF8xLCBjdXJ2ZURhdGFbZl0sIGRvd25zdHJlYW0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJ2ZURhdGEpIHsgLy8gdGhlcmUgaXMgYSBjdXJ2ZSBkaXJlY3RseSBjb250cm9sbGluZyB0aGUgam9pbnRcclxuICAgICAgICAgICAgICAgICAgICBtYXQgPSBjdXJ2ZURhdGFbZl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRvd25zdHJlYW0pIHsgLy8gZmFsbGJhY2sgdG8gZGVmYXVsdCBwb3NlIGlmIG5vIGFuaW1hdGlvbiBjdXJ2ZSBjYW4gYmUgZm91bmQgdXBzdHJlYW1cclxuICAgICAgICAgICAgICAgICAgICBtYXQgPSBkb3duc3RyZWFtO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gYm90dG9tIGxpbmU6IHJlbmRlciB0aGUgb3JpZ2luYWwgbWVzaCBhcy1pc1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdCA9IHNrZWxldG9uLmludmVyc2VCaW5kcG9zZXNbYmluZHBvc2VJZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib25lU3BhY2VCb3VuZCA9IGJvbmVTcGFjZUJvdW5kc1tqXTtcclxuICAgICAgICAgICAgICAgIGlmIChib25lU3BhY2VCb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGJpbmRwb3NlQ29ycmVjdGlvbiA/IE1hdDQubXVsdGlwbHkobTRfMiwgbWF0LCBiaW5kcG9zZUNvcnJlY3Rpb24pIDogbWF0O1xyXG4gICAgICAgICAgICAgICAgICAgIGFhYmIudHJhbnNmb3JtKGFiXzEsIGJvbmVTcGFjZUJvdW5kLCB0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGFiXzEuZ2V0Qm91bmRhcnkodjNfMywgdjNfNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVmVjMy5taW4oYm91bmQuY2VudGVyLCBib3VuZC5jZW50ZXIsIHYzXzMpO1xyXG4gICAgICAgICAgICAgICAgICAgIFZlYzMubWF4KGJvdW5kLmhhbGZFeHRlbnRzLCBib3VuZC5oYWxmRXh0ZW50cywgdjNfNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVpbGRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybVZhbGlkKSB7IE1hdDQubXVsdGlwbHkobTRfMSwgbWF0LCBiaW5kcG9zZXNbYmluZHBvc2VJZHhdKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEpvaW50RGF0YSh0ZXh0dXJlQnVmZmVyLCBvZmZzZXQsIHRyYW5zZm9ybVZhbGlkID8gbTRfMSA6IE1hdDQuSURFTlRJVFksIGogPT09IDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFhYmIuZnJvbVBvaW50cyhib3VuZCwgYm91bmQuY2VudGVyLCBib3VuZC5oYWxmRXh0ZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChidWlsZFRleHR1cmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9vbC51cGRhdGUodGV4dHVyZS5oYW5kbGUsIHRleHR1cmVCdWZmZXIuYnVmZmVyKTtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUJ1ZmZlcnMuc2V0KGhhc2gsIHRleHR1cmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVsZWFzZUhhbmRsZSAoaGFuZGxlOiBJSm9pbnRUZXh0dXJlSGFuZGxlKSB7XHJcbiAgICAgICAgaWYgKGhhbmRsZS5yZWZDb3VudCA+IDApIHsgaGFuZGxlLnJlZkNvdW50LS07IH1cclxuICAgICAgICBpZiAoIWhhbmRsZS5yZWZDb3VudCAmJiBoYW5kbGUucmVhZHlUb0JlRGVsZXRlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBoYXNoID0gaGFuZGxlLnNrZWxldG9uSGFzaCBeIGhhbmRsZS5jbGlwSGFzaDtcclxuICAgICAgICAgICAgY29uc3QgY3VzdG9tQ2h1bmtJZHggPSB0aGlzLl9jaHVua0lkeE1hcC5nZXQoaGFzaCk7XHJcbiAgICAgICAgICAgIChjdXN0b21DaHVua0lkeCAhPT0gdW5kZWZpbmVkID8gdGhpcy5fY3VzdG9tUG9vbCA6IHRoaXMuX3Bvb2wpLmZyZWUoaGFuZGxlLmhhbmRsZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlQnVmZmVycy5nZXQoaGFzaCkgPT09IGhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUJ1ZmZlcnMuZGVsZXRlKGhhc2gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWxlYXNlU2tlbGV0b24gKHNrZWxldG9uOiBTa2VsZXRvbikge1xyXG4gICAgICAgIGNvbnN0IGl0ID0gdGhpcy5fdGV4dHVyZUJ1ZmZlcnMudmFsdWVzKCk7XHJcbiAgICAgICAgbGV0IHJlcyA9IGl0Lm5leHQoKTtcclxuICAgICAgICB3aGlsZSAoIXJlcy5kb25lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHJlcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKGhhbmRsZS5za2VsZXRvbkhhc2ggPT09IHNrZWxldG9uLmhhc2gpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZS5yZWFkeVRvQmVEZWxldGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGUucmVmQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBkZWxldGUgaGFuZGxlIHJlY29yZCBpbW1lZGlhdGVseSBzbyBuZXcgYWxsb2NhdGlvbnMgd2l0aCB0aGUgc2FtZSBhc3NldCBjb3VsZCB3b3JrXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUJ1ZmZlcnMuZGVsZXRlKGhhbmRsZS5za2VsZXRvbkhhc2ggXiBoYW5kbGUuY2xpcEhhc2gpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbGVhc2VIYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXMgPSBpdC5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWxlYXNlQW5pbWF0aW9uQ2xpcCAoY2xpcDogQW5pbWF0aW9uQ2xpcCkge1xyXG4gICAgICAgIGNvbnN0IGl0ID0gdGhpcy5fdGV4dHVyZUJ1ZmZlcnMudmFsdWVzKCk7XHJcbiAgICAgICAgbGV0IHJlcyA9IGl0Lm5leHQoKTtcclxuICAgICAgICB3aGlsZSAoIXJlcy5kb25lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHJlcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKGhhbmRsZS5jbGlwSGFzaCA9PT0gY2xpcC5oYXNoKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGUucmVhZHlUb0JlRGVsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlLnJlZkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVsZXRlIGhhbmRsZSByZWNvcmQgaW1tZWRpYXRlbHkgc28gbmV3IGFsbG9jYXRpb25zIHdpdGggdGhlIHNhbWUgYXNzZXQgY291bGQgd29ya1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RleHR1cmVCdWZmZXJzLmRlbGV0ZShoYW5kbGUuc2tlbGV0b25IYXNoIF4gaGFuZGxlLmNsaXBIYXNoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxlYXNlSGFuZGxlKGhhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzID0gaXQubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jcmVhdGVBbmltSW5mb3MgKHNrZWxldG9uOiBTa2VsZXRvbiwgY2xpcDogQW5pbWF0aW9uQ2xpcCwgc2tpbm5pbmdSb290OiBOb2RlKSB7XHJcbiAgICAgICAgY29uc3QgYW5pbUluZm9zOiBJSW50ZXJuYWxKb2ludEFuaW1JbmZvW10gPSBbXTtcclxuICAgICAgICBjb25zdCB7IGpvaW50cywgYmluZHBvc2VzIH0gPSBza2VsZXRvbjtcclxuICAgICAgICBjb25zdCBqb2ludENvdW50ID0gam9pbnRzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBjbGlwRGF0YSA9IFNrZWxBbmltRGF0YUh1Yi5nZXRPckV4dHJhY3QoY2xpcCk7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBqb2ludENvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1QYXRoID0gam9pbnRzW2pdO1xyXG4gICAgICAgICAgICBsZXQgc291cmNlID0gY2xpcERhdGEuZGF0YVthbmltUGF0aF07XHJcbiAgICAgICAgICAgIGxldCBhbmltTm9kZSA9IHNraW5uaW5nUm9vdC5nZXRDaGlsZEJ5UGF0aChhbmltUGF0aCk7XHJcbiAgICAgICAgICAgIGxldCBkb3duc3RyZWFtOiBNYXQ0IHwgdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBsZXQgY29ycmVjdGlvblBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgd2hpbGUgKCFzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IGFuaW1QYXRoLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgICAgICAgICAgICBhbmltUGF0aCA9IGFuaW1QYXRoLnN1YnN0cmluZygwLCBpZHgpO1xyXG4gICAgICAgICAgICAgICAgc291cmNlID0gY2xpcERhdGEuZGF0YVthbmltUGF0aF07XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5pbU5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRvd25zdHJlYW0pIHsgZG93bnN0cmVhbSA9IG5ldyBNYXQ0KCk7IH1cclxuICAgICAgICAgICAgICAgICAgICBNYXQ0LmZyb21SVFMobTRfMSwgYW5pbU5vZGUucm90YXRpb24sIGFuaW1Ob2RlLnBvc2l0aW9uLCBhbmltTm9kZS5zY2FsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0NC5tdWx0aXBseShkb3duc3RyZWFtLCBtNF8xLCBkb3duc3RyZWFtKTtcclxuICAgICAgICAgICAgICAgICAgICBhbmltTm9kZSA9IGFuaW1Ob2RlLnBhcmVudDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIHJlY29yZCB0aGUgbmVhcmVzdCBjdXJ2ZSBwYXRoIGlmIG5vIGRvd25zdHJlYW0gcG9zZSBpcyBwcmVzZW50XHJcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdGlvblBhdGggPSBhbmltUGF0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpZHggPCAwKSB7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdGhlIGRlZmF1bHQgYmVoYXZpb3IsIGp1c3QgdXNlIHRoZSBiaW5kcG9zZSBmb3IgY3VycmVudCBqb2ludCBkaXJlY3RseVxyXG4gICAgICAgICAgICBsZXQgYmluZHBvc2VJZHggPSBqO1xyXG4gICAgICAgICAgICBsZXQgYmluZHBvc2VDb3JyZWN0aW9uOiBNYXQ0IHwgdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSXQgaXMgcmVndWxhcmx5IG9ic2VydmVkIHRoYXQgZGV2ZWxvcGVycyBtYXkgY2hvb3NlIHRvIGRlbGV0ZSB0aGUgd2hvbGVcclxuICAgICAgICAgICAgICogc2tlbGV0b24gbm9kZSB0cmVlIGZvciBza2lubmluZyBtb2RlbHMgdGhhdCBvbmx5IHVzZSBiYWtlZCBhbmltYXRpb25zXHJcbiAgICAgICAgICAgICAqIGFzIGFuIGVmZmVjdGl2ZSBvcHRpbWl6YXRpb24gc3RyYXRlZ3kgKHN1YnN0YW50aWFsIGltcHJvdmVtZW50cyBvbiBib3RoXHJcbiAgICAgICAgICAgICAqIHBhY2thZ2Ugc2l6ZSBhbmQgcnVudGltZSBlZmZpY2llbmN5KS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogVGhpcyBiZWNvbWVzIHRyb3VibGVzb21lIGluIHNvbWUgY2FzZXMgZHVyaW5nIGJha2luZyB0aG91Z2gsIGUuZy4gd2hlbiBhXHJcbiAgICAgICAgICAgICAqIHNrZWxldG9uIGpvaW50IG5vZGUgaXMgbm90IGRpcmVjdGx5IGNvbnRyb2xsZWQgYnkgYW55IGFuaW1hdGlvbiBjdXJ2ZSxcclxuICAgICAgICAgICAgICogYnV0IGl0cyBwYXJlbnQgbm9kZXMgYXJlLiBEdWUgdG8gbGFjayBvZiBwcm9wZXIgZG93bnN0cmVhbSBkZWZhdWx0IHBvc2UsXHJcbiAgICAgICAgICAgICAqIHRoZSBqb2ludCB0cmFuc2Zvcm0gY2FuIG5vdCBiZSBjYWxjdWxhdGVkIGFjY3VyYXRlbHkuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFdlIGFkZHJlc3MgdGhpcyBpc3N1ZSBieSBlbXBsb3lpbmcgc29tZSBwcmFnbWF0aWMgYXBwcm94aW1hdGlvbi5cclxuICAgICAgICAgICAgICogU3BlY2lmaWNhbGx5LCBieSBtdWx0aXBseWluZyB0aGUgYmluZHBvc2Ugb2YgdGhlIGpvaW50IGNvcnJlc3BvbmRpbmcgdG9cclxuICAgICAgICAgICAgICogdGhlIG5lYXJlc3QgY3VydmUsIGluc3RlYWQgb2YgdGhlIGFjdHVhbCB0YXJnZXQgam9pbnQuIFRoaXMgZWZmZWN0aXZlbHlcclxuICAgICAgICAgICAgICogbWVyZ2VzIHRoZSBza2lubmluZyBpbmZsdWVuY2Ugb2YgdGhlICdpbmNvbXBsZXRlJyBqb2ludCBpbnRvIGl0cyBuZWFyZXN0XHJcbiAgICAgICAgICAgICAqIHBhcmVudCB3aXRoIGFjY3VyYXRlIHRyYW5zZm9ybSBkYXRhLlxyXG4gICAgICAgICAgICAgKiBJdCBnaXZlcyBtb3JlIHZpc3VhbGx5LXBsYXVzaWJsZSByZXN1bHRzIGNvbXBhcmVkIHRvIHRoZSBuYWl2ZSBhcHByb2FjaFxyXG4gICAgICAgICAgICAgKiBmb3IgbW9zdCBjYXNlcyB3ZSd2ZSBjb3ZlcmVkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKGNvcnJlY3Rpb25QYXRoICE9PSB1bmRlZmluZWQgJiYgc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBqdXN0IHVzZSB0aGUgcHJldmlvdXMgam9pbnQgaWYgdGhlIGV4YWN0IHBhdGggaXMgbm90IGZvdW5kXHJcbiAgICAgICAgICAgICAgICBiaW5kcG9zZUlkeCA9IGogLSAxO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBqb2ludENvdW50OyB0KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoam9pbnRzW3RdID09PSBjb3JyZWN0aW9uUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kcG9zZUlkeCA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRwb3NlQ29ycmVjdGlvbiA9IG5ldyBNYXQ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdDQubXVsdGlwbHkoYmluZHBvc2VDb3JyZWN0aW9uLCBiaW5kcG9zZXNbdF0sIHNrZWxldG9uLmludmVyc2VCaW5kcG9zZXNbal0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYW5pbUluZm9zLnB1c2goeyBjdXJ2ZURhdGE6IHNvdXJjZSAmJiBzb3VyY2Uud29ybGRNYXRyaXgudmFsdWVzIGFzIE1hdDRbXSwgZG93bnN0cmVhbSwgYmluZHBvc2VJZHgsIGJpbmRwb3NlQ29ycmVjdGlvbiB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFuaW1JbmZvcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQW5pbUluZm8ge1xyXG4gICAgYnVmZmVyOiBHRlhCdWZmZXI7XHJcbiAgICBkYXRhOiBGbG9hdDMyQXJyYXk7XHJcbiAgICBkaXJ0eTogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEpvaW50QW5pbWF0aW9uSW5mbyB7XHJcbiAgICBwcml2YXRlIF9wb29sID0gbmV3IE1hcDxzdHJpbmcsIElBbmltSW5mbz4oKTsgLy8gcGVyIG5vZGVcclxuICAgIHByaXZhdGUgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGF0YSAobm9kZUlEID0gJy0xJykge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMuX3Bvb2wuZ2V0KG5vZGVJRCk7XHJcbiAgICAgICAgaWYgKHJlcykgeyByZXR1cm4gcmVzOyB9XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gdGhpcy5fZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVU5JRk9STSB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgVUJPU2tpbm5pbmdBbmltYXRpb24uU0laRSxcclxuICAgICAgICAgICAgVUJPU2tpbm5pbmdBbmltYXRpb24uU0laRSxcclxuICAgICAgICApKTtcclxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEZsb2F0MzJBcnJheShbMCwgMCwgMCwgMF0pO1xyXG4gICAgICAgIGJ1ZmZlci51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IHsgYnVmZmVyLCBkYXRhLCBkaXJ0eTogZmFsc2UgfTtcclxuICAgICAgICB0aGlzLl9wb29sLnNldChub2RlSUQsIGluZm8pO1xyXG4gICAgICAgIHJldHVybiBpbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95IChub2RlSUQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9wb29sLmdldChub2RlSUQpO1xyXG4gICAgICAgIGlmICghaW5mbykgeyByZXR1cm47IH1cclxuICAgICAgICBpbmZvLmJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5fcG9vbC5kZWxldGUobm9kZUlEKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3dpdGNoQ2xpcCAoaW5mbzogSUFuaW1JbmZvLCBjbGlwOiBBbmltYXRpb25DbGlwIHwgbnVsbCkge1xyXG4gICAgICAgIGluZm8uZGF0YVswXSA9IDA7XHJcbiAgICAgICAgaW5mby5idWZmZXIudXBkYXRlKGluZm8uZGF0YSk7XHJcbiAgICAgICAgaW5mby5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBpbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBpbmZvIG9mIHRoaXMuX3Bvb2wudmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgaW5mby5idWZmZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wb29sLmNsZWFyKCk7XHJcbiAgICB9XHJcbn1cclxuIl19